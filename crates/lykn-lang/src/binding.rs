//! DD-61 §A2 — the binding-position walker (Rust).
//!
//! The single per-backend component that knows **what binds**: every DD-60
//! binding position — params of `func`/`fn`/`genfunc`/`genfn`/`lambda`, `bind`,
//! destructuring patterns, loop bindings (`for-of`/`for-in`/`for-await-of`), and
//! class-method params (plus the `kernel:` declaration name slots). Both D2 (the
//! reserved-word validator — this slice) and D1 (the resolver env — slices
//! 04/05) are clients of this walker, so binding knowledge lives in exactly one
//! place per backend.
//!
//! It operates over raw `SExpr` (pre-resolution) and changes no behavior — it
//! only *identifies* positions. Param grammar (typed / destructured / rest /
//! default) is reused from the classifier, so the walker never re-derives it.

use crate::ast::sexpr::SExpr;
use crate::ast::surface::{ParamShape, SurfaceForm};
use crate::diagnostics::{Diagnostic, Severity};
use crate::reader::source_loc::Span;

/// JS reserved words — names that cannot be a lexical binding identifier (DD-60
/// D2). **The authority for this list is empirical**: a name is reserved iff
/// `const <name> = 0;` fails to parse as an ES module. This static copy is
/// pinned to that authority — and to the JS backend's copy
/// (`packages/lang/reserved-words.js`) — by the three-way parity test
/// (`test/expander/reserved-words-parity.test.js`, in `make check`).
///
/// ⚠ DIVERGENCE RISK: keep identical to `packages/lang/reserved-words.js` and to
/// the probe's `const NAME = 0` legality (`tools/conformance-matrix.js`). The
/// parity test fails on any drift.
pub const RESERVED_WORDS: &[&str] = &[
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
];

/// True if `name` is a JS reserved word (invalid as a lykn binding name, D2).
pub fn is_reserved_word(name: &str) -> bool {
    RESERVED_WORDS.contains(&name)
}

/// DD-60 D2: every binding position whose name is a JS reserved word is a
/// compile error. Walks all binding positions (via [`walk_bindings`], so
/// `export`ed names and `kernel:` declaration name slots are covered) and
/// returns one diagnostic per offending name — before codegen can emit invalid
/// JS at rc=0 (the ID-44 genus).
pub fn validate_reserved_names(forms: &[SExpr]) -> Vec<Diagnostic> {
    walk_bindings(forms)
        .into_iter()
        .filter(|b| is_reserved_word(&b.name))
        .map(|b| Diagnostic {
            severity: Severity::Error,
            message: format!(
                "'{}' is a JavaScript reserved word and cannot be used as a lykn {}",
                b.name,
                b.kind.describe()
            ),
            span: b.span,
            suggestion: Some(format!(
                "rename the {} (e.g. `{}_`)",
                b.kind.describe(),
                b.name
            )),
        })
        .collect()
}

/// Which kind of binding position introduced a name.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BindingKind {
    /// A `func`/`fn`/`genfunc`/`genfn`/`lambda` parameter.
    Param,
    /// A `bind` (or a `kernel:const`/`let`/`var`/`function` name slot).
    Bind,
    /// A `for-of`/`for-in`/`for-await-of` loop binding.
    LoopBinding,
    /// A class method/constructor parameter.
    ClassMethodParam,
}

impl BindingKind {
    /// Human phrase for diagnostics ("… as a lykn `func` parameter").
    pub fn describe(self) -> &'static str {
        match self {
            BindingKind::Param => "function parameter",
            BindingKind::Bind => "binding name",
            BindingKind::LoopBinding => "loop binding",
            BindingKind::ClassMethodParam => "class method parameter",
        }
    }
}

/// A name introduced at a binding position.
#[derive(Debug, Clone, PartialEq)]
pub struct BindingSite {
    pub name: String,
    pub kind: BindingKind,
    pub span: Span,
}

/// Recursively walk `forms`, collecting every binding site in source order.
///
/// This is D2's enumeration. Slices 04/05 use [`bindings_introduced`] per form
/// during their own scoped walk to extend the resolver env — see the module
/// doc and the slice03 bubble-up for the hook points.
pub fn walk_bindings(forms: &[SExpr]) -> Vec<BindingSite> {
    let mut out = Vec::new();
    for form in forms {
        walk(form, &mut out);
    }
    out
}

fn walk(form: &SExpr, out: &mut Vec<BindingSite>) {
    if let SExpr::List { values, .. } = form {
        out.extend(bindings_introduced(form));
        for child in values {
            walk(child, out);
        }
    }
}

/// The names a **single** form introduces (non-recursive). Empty if `form` is
/// not a binding introducer. This is the D1 env-extension hook: "entering this
/// form, these names are now in scope."
pub fn bindings_introduced(form: &SExpr) -> Vec<BindingSite> {
    let SExpr::List { values, .. } = form else {
        return Vec::new();
    };
    let Some(head) = values.first().and_then(|e| e.as_atom()) else {
        return Vec::new();
    };
    let args = &values[1..];
    match head {
        "bind" => bind_names(args),
        "func" | "genfunc" | "fn" | "lambda" | "genfn" => param_names(form),
        "for-of" | "for-in" | "for-await-of" => loop_names(args),
        "class" => class_method_param_names(args),
        // `kernel:` declaration escapes bind their name slot (D2 edge case 3).
        _ => {
            if let Some(kernel) = head.strip_prefix("kernel:") {
                kernel_decl_names(kernel, args)
            } else {
                // Bare kernel declaration heads (e.g. in `.lyk` or passthrough).
                kernel_decl_names(head, args)
            }
        }
    }
}

/// `(bind name value)` / `(bind :type name value)` — the name slot is an atom or
/// a destructuring pattern.
fn bind_names(args: &[SExpr]) -> Vec<BindingSite> {
    let name_slot = match args.len() {
        2 => &args[0],
        3 => &args[1], // (bind :type name value)
        _ => return Vec::new(),
    };
    let mut out = Vec::new();
    pattern_names(name_slot, BindingKind::Bind, &mut out);
    out
}

/// Loop binding: `(for-of binding iterable body…)` — binding is an atom or a
/// destructuring pattern.
fn loop_names(args: &[SExpr]) -> Vec<BindingSite> {
    let Some(binding) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_names(binding, BindingKind::LoopBinding, &mut out);
    out
}

/// `(kernel:const NAME value)` / `const`/`let`/`var`/`function`/`function*` —
/// the name slot is the first argument.
fn kernel_decl_names(kernel_form: &str, args: &[SExpr]) -> Vec<BindingSite> {
    if !matches!(
        kernel_form,
        "const" | "let" | "var" | "function" | "function*"
    ) {
        return Vec::new();
    }
    let Some(name_slot) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_names(name_slot, BindingKind::Bind, &mut out);
    out
}

/// Params of `func`/`genfunc`/`fn`/`lambda`/`genfn` — reuse the classifier's
/// clause + param-shape parsing so the grammar (typed / destructured / rest /
/// default) is never re-derived here.
fn param_names(form: &SExpr) -> Vec<BindingSite> {
    let Ok(sf) = crate::classifier::classify_expr(form) else {
        return Vec::new();
    };
    let mut out = Vec::new();
    let push_params = |params: &[ParamShape], out: &mut Vec<BindingSite>| {
        for shape in params {
            for tp in shape.typed_params() {
                out.push(BindingSite {
                    name: tp.name.clone(),
                    kind: BindingKind::Param,
                    span: tp.name_span,
                });
            }
        }
    };
    match sf {
        SurfaceForm::Func { clauses, .. } => {
            for clause in &clauses {
                push_params(&clause.args, &mut out);
            }
        }
        SurfaceForm::Genfunc { clauses, .. } => {
            for clause in &clauses {
                push_params(&clause.args, &mut out);
            }
        }
        SurfaceForm::Fn { params, .. }
        | SurfaceForm::Lambda { params, .. }
        | SurfaceForm::Genfn { params, .. } => push_params(&params, &mut out),
        _ => {}
    }
    out
}

/// Class-method (and constructor) params. Methods are stored raw as
/// `(method-name (param…) body…)`; the param list is the second element.
fn class_method_param_names(args: &[SExpr]) -> Vec<BindingSite> {
    // (class Name (bases) member…) — members start after name + bases list.
    let mut out = Vec::new();
    for member in args {
        let SExpr::List { values, .. } = member else {
            continue;
        };
        // A method/constructor: (mname (params) body…). Field decls and other
        // shapes have no bare param list in slot 1.
        if let Some(SExpr::List { values: params, .. }) = values.get(1) {
            for p in params {
                if let SExpr::Atom { value, span } = p
                    && value != "_"
                {
                    out.push(BindingSite {
                        name: value.clone(),
                        kind: BindingKind::ClassMethodParam,
                        span: *span,
                    });
                }
            }
        }
    }
    out
}

/// Collect the leaf names bound by a pattern (an atom, or an `(array …)` /
/// `(object …)` destructuring form). Type keywords, `_` skips, and nested
/// structure are handled; `(rest x)` binds `x`.
fn pattern_names(pat: &SExpr, kind: BindingKind, out: &mut Vec<BindingSite>) {
    match pat {
        SExpr::Atom { value, span } if value != "_" => out.push(BindingSite {
            name: value.clone(),
            kind,
            span: *span,
        }),
        SExpr::List { values, .. } => {
            let head = values.first().and_then(|e| e.as_atom()).unwrap_or("");
            match head {
                "array" | "object" => {
                    for el in &values[1..] {
                        match el {
                            // keywords are types/keys, not bound names
                            SExpr::Keyword { .. } => {}
                            // (rest x), (default :t x v), nested patterns
                            SExpr::List { values: inner, .. } => {
                                let ih = inner.first().and_then(|e| e.as_atom()).unwrap_or("");
                                match ih {
                                    "rest" => {
                                        if let Some(n) = inner.get(1) {
                                            pattern_names(n, kind, out);
                                        }
                                    }
                                    "default" => {
                                        // (default :type name value)
                                        if let Some(n) = inner.get(2) {
                                            pattern_names(n, kind, out);
                                        }
                                    }
                                    "array" | "object" => pattern_names(el, kind, out),
                                    _ => {}
                                }
                            }
                            SExpr::Atom { value, span } if value != "_" => out.push(BindingSite {
                                name: value.clone(),
                                kind,
                                span: *span,
                            }),
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        }
        _ => {}
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::reader::read;

    /// Walk a source string; return (name, kind) pairs in source order.
    fn sites(src: &str) -> Vec<(String, BindingKind)> {
        let forms = read(src).expect("parse");
        walk_bindings(&forms)
            .into_iter()
            .map(|b| (b.name, b.kind))
            .collect()
    }

    fn names(src: &str) -> Vec<String> {
        sites(src).into_iter().map(|(n, _)| n).collect()
    }

    #[test]
    fn bind_atom() {
        assert_eq!(sites("(bind x 1)"), vec![("x".into(), BindingKind::Bind)]);
    }

    #[test]
    fn bind_typed() {
        assert_eq!(
            sites("(bind :number x 1)"),
            vec![("x".into(), BindingKind::Bind)]
        );
    }

    #[test]
    fn bind_destructuring_array() {
        assert_eq!(names("(bind (array a b) xs)"), vec!["a", "b"]);
    }

    #[test]
    fn func_params() {
        assert_eq!(
            names("(func f :args (:number a :string b) :body (+ a b))"),
            vec!["a", "b"]
        );
    }

    #[test]
    fn func_multi_clause_params() {
        let src = "(func f (:args (:number a) :body a) (:args (:string s) :body s))";
        assert_eq!(names(src), vec!["a", "s"]);
    }

    #[test]
    fn fn_and_lambda_params() {
        assert_eq!(names("(fn (:number x) x)"), vec!["x"]);
        assert_eq!(names("(lambda (:number y) y)"), vec!["y"]);
    }

    #[test]
    fn genfunc_and_genfn_params() {
        assert_eq!(
            names("(genfunc g :args (:number n) :body (yield n))"),
            vec!["n"]
        );
        assert_eq!(names("(genfn (:number m) (yield m))"), vec!["m"]);
    }

    #[test]
    fn loop_binding_atom_and_destructure() {
        assert_eq!(
            sites("(for-of item items (f item))"),
            vec![("item".into(), BindingKind::LoopBinding)]
        );
        assert_eq!(
            names("(for-of (array i v) (xs:entries) (f i))"),
            vec!["i", "v"]
        );
        assert_eq!(names("(for-in k obj (f k))"), vec!["k"]);
    }

    #[test]
    fn class_method_params() {
        let src = "(class C () (constructor (name) (assign this:x name)) (speak (a b) (+ a b)))";
        assert_eq!(
            sites(src),
            vec![
                ("name".into(), BindingKind::ClassMethodParam),
                ("a".into(), BindingKind::ClassMethodParam),
                ("b".into(), BindingKind::ClassMethodParam),
            ]
        );
    }

    #[test]
    fn kernel_decl_name_slot() {
        assert_eq!(names("(kernel:const x 1)"), vec!["x"]);
        assert_eq!(names("(kernel:let y 1)"), vec!["y"]);
    }

    #[test]
    fn nested_bindings_are_found() {
        // a bind inside a func body, and a param — both surface.
        let src = "(func f :args (:number a) :body (bind b (fn (:number c) c)))";
        assert_eq!(names(src), vec!["a", "b", "c"]);
    }

    #[test]
    fn export_wrapped_binding_is_found() {
        assert_eq!(names("(export (bind x 1))"), vec!["x"]);
    }

    #[test]
    fn non_binding_forms_yield_nothing() {
        assert!(sites("(f 1 2)").is_empty());
        assert!(sites("(cell 1)").is_empty());
        assert!(sites("(+ 1 2)").is_empty());
    }

    #[test]
    fn underscore_is_not_a_binding() {
        assert!(names("(for-of _ items (f 1))").is_empty());
    }
}
