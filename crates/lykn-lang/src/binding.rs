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
    /// An `if-let`/`when-let` binding pattern or a `match` clause pattern
    /// (DD-60 refinement, 2026-07-06).
    Pattern,
    /// A `catch` clause error binding (DD-60 refinement #2).
    CatchBinding,
    /// An `import` local name (default or named-specifier local; refinement #2).
    ImportLocal,
    /// A `label` name (refinement #2). **Its own namespace** — a label does not
    /// shadow value bindings, so the resolution slices extend the value env for
    /// everything *except* this kind (D2 validates it; D1 skips it).
    Label,
}

impl BindingKind {
    /// Human phrase for diagnostics ("… as a lykn `func` parameter").
    pub fn describe(self) -> &'static str {
        match self {
            BindingKind::Param => "function parameter",
            BindingKind::Bind => "binding name",
            BindingKind::LoopBinding => "loop binding",
            BindingKind::ClassMethodParam => "class method parameter",
            BindingKind::Pattern => "pattern binding",
            BindingKind::CatchBinding => "catch binding",
            BindingKind::ImportLocal => "imported name",
            BindingKind::Label => "label",
        }
    }

    /// Whether this binding participates in **value** scope — i.e. it shadows a
    /// macro/form of the same name (DD-60 D1). A `Label` has its own namespace
    /// and does not shadow, so the resolution slices (05/06) extend the value
    /// env for every kind *except* `Label`. (D2 validates all kinds.)
    pub fn shadows_values(self) -> bool {
        !matches!(self, BindingKind::Label)
    }
}

/// A name introduced at a binding position.
#[derive(Debug, Clone, PartialEq)]
pub struct BindingSite {
    pub name: String,
    pub kind: BindingKind,
    pub span: Span,
}

/// A binding at its actual node in the input tree. Unlike `BindingSite`, this
/// private resolver representation keeps occurrence identity separate from
/// diagnostic span data.
#[derive(Debug, Clone, Copy)]
pub(crate) struct BindingOccurrence<'a> {
    pub(crate) atom: &'a SExpr,
    pub(crate) kind: BindingKind,
}

impl BindingOccurrence<'_> {
    fn project(self) -> BindingSite {
        let (name, span) = self
            .atom
            .atom_parts()
            .expect("binding occurrence is an atom");
        BindingSite {
            name: name.to_string(),
            kind: self.kind,
            span,
        }
    }
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
    binding_occurrences(form)
        .into_iter()
        .map(BindingOccurrence::project)
        .collect()
}

/// The actual input atom for every binding introduced by one form.
pub(crate) fn binding_occurrences(form: &SExpr) -> Vec<BindingOccurrence<'_>> {
    let SExpr::List { values, .. } = form else {
        return Vec::new();
    };
    let Some(head) = values.first().and_then(|e| e.as_atom()) else {
        return Vec::new();
    };
    let args = &values[1..];
    match head {
        "bind" => bind_names(args),
        "func" | "genfunc" | "fn" | "lambda" | "genfn" | "type" | "if-let" | "when-let"
        | "match" => crate::classifier::forms::classify_form_with_bindings(form)
            .map(|(_, occurrences)| occurrences)
            .unwrap_or_default(),
        "for-of" | "for-in" | "for-await-of" => loop_names(args),
        "class" => class_names(args),
        "catch" => catch_names(args),
        "import" => import_local_names(args),
        "label" => label_names(args),
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
fn bind_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let mut out = Vec::new();
    match args.len() {
        2 => pattern_occurrences(&args[0], BindingKind::Bind, &mut out),
        3 => pattern_occurrences(&args[1], BindingKind::Bind, &mut out),
        len if len >= 4 => {
            let mut i = 0;
            while i < args.len() {
                let (name_index, next) = if matches!(args.get(i), Some(SExpr::Keyword { .. })) {
                    if i + 2 >= args.len() {
                        return out;
                    }
                    (i + 1, i + 3)
                } else {
                    if i + 1 >= args.len() {
                        return out;
                    }
                    (i, i + 2)
                };
                pattern_occurrences(&args[name_index], BindingKind::Bind, &mut out);
                i = next;
            }
        }
        _ => {}
    }
    out
}

/// Return every name bound by a single binding pattern. This is the public
/// helper for consumers that need grouped-bind duplicate checks or scoped
/// per-pair visibility without re-deriving destructuring grammar.
pub(crate) fn binding_names_in_pattern(pat: &SExpr, kind: BindingKind) -> Vec<BindingSite> {
    let mut out = Vec::new();
    pattern_occurrences(pat, kind, &mut out);
    out.into_iter().map(BindingOccurrence::project).collect()
}

/// Loop binding: `(for-of binding iterable body…)` — binding is an atom or a
/// destructuring pattern.
fn loop_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let Some(binding) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_occurrences(binding, BindingKind::LoopBinding, &mut out);
    out
}

/// `(kernel:const NAME value)` / `const`/`let`/`var`/`function`/`function*` —
/// the name slot is the first argument.
fn kernel_decl_names<'a>(kernel_form: &str, args: &'a [SExpr]) -> Vec<BindingOccurrence<'a>> {
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
    pattern_occurrences(name_slot, BindingKind::Bind, &mut out);
    out
}

/// `catch` clause error binding: `(catch NAME handler…)` — NAME is the first
/// argument (an atom, or a destructuring pattern for `catch ({…})`).
fn catch_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let Some(binding) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_occurrences(binding, BindingKind::CatchBinding, &mut out);
    out
}

/// `label` name: `(label NAME body)` — NAME binds in the *label* namespace
/// (D2-only; labels do not shadow value bindings).
fn label_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    match args.first() {
        Some(atom) if atom.as_atom().is_some_and(|value| value != "_") => vec![BindingOccurrence {
            atom,
            kind: BindingKind::Label,
        }],
        _ => Vec::new(),
    }
}

/// `import` local names — the default-import name and every named-specifier
/// local. Forms (codegen `emit_import`): `(import "m")` (none), `(import "m"
/// name)` (default), `(import "m" (spec…))` (named), `(import "m" name (spec…))`
/// (default + named). A spec is an atom (local = name) or `(alias original
/// local)` (local = 3rd element).
fn import_local_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let mut out = Vec::new();
    let Some(second) = args.get(1) else {
        return out; // side-effect import
    };
    match second {
        // (import "m" (spec…))
        SExpr::List { values, .. } => import_specs(values, &mut out),
        // (import "m" name …) — default import name
        a @ SExpr::Atom { .. } if a.as_atom() != Some("_") => {
            out.push(BindingOccurrence {
                atom: a,
                kind: BindingKind::ImportLocal,
            });
            // (import "m" name (spec…)) — default + named
            if let Some(SExpr::List { values, .. }) = args.get(2) {
                import_specs(values, &mut out);
            }
        }
        _ => {}
    }
    out
}

fn import_specs<'a>(specs: &'a [SExpr], out: &mut Vec<BindingOccurrence<'a>>) {
    for spec in specs {
        match spec {
            a @ SExpr::Atom { .. } if a.as_atom() != Some("_") => out.push(BindingOccurrence {
                atom: a,
                kind: BindingKind::ImportLocal,
            }),
            // (alias original local) → local binding is the 3rd element
            SExpr::List { values, .. }
                if values.first().and_then(|e| e.as_atom()) == Some("alias") =>
            {
                if let Some(local) = values.get(2).filter(|e| e.atom_parts().is_some()) {
                    out.push(BindingOccurrence {
                        atom: local,
                        kind: BindingKind::ImportLocal,
                    });
                }
            }
            _ => {}
        }
    }
}

/// Class binders: the class **name** (`class NAME {…}` — a reserved NAME →
/// invalid `class if`; sweep finding) plus every method/constructor param.
/// Field/method *names* are property names (reserved words are legal there), so
/// they are not binders.
fn class_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let mut out = Vec::new();
    // (class NAME (bases) member…) — NAME is args[0].
    if let Some(atom) = args.first()
        && atom.as_atom().is_some_and(|value| value != "_")
    {
        out.push(BindingOccurrence {
            atom,
            kind: BindingKind::Bind,
        });
    }
    // members start after name + bases list.
    for member in &args[1..] {
        let SExpr::List { values, .. } = member else {
            continue;
        };
        // A method/constructor: (mname (params) body…). Field decls and other
        // shapes have no bare param list in slot 1.
        if let Some(SExpr::List { values: params, .. }) = values.get(1) {
            for p in params {
                if p.as_atom().is_some_and(|value| value != "_") {
                    out.push(BindingOccurrence {
                        atom: p,
                        kind: BindingKind::ClassMethodParam,
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
fn pattern_occurrences<'a>(
    pat: &'a SExpr,
    kind: BindingKind,
    out: &mut Vec<BindingOccurrence<'a>>,
) {
    match pat {
        a @ SExpr::Atom { .. } if a.as_atom() != Some("_") => {
            out.push(BindingOccurrence { atom: a, kind })
        }
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
                                            pattern_occurrences(n, kind, out);
                                        }
                                    }
                                    "default" => {
                                        // (default :type name value)
                                        if let Some(n) = inner.get(2) {
                                            pattern_occurrences(n, kind, out);
                                        }
                                    }
                                    "array" | "object" => pattern_occurrences(el, kind, out),
                                    _ => {}
                                }
                            }
                            a @ SExpr::Atom { .. } if a.as_atom() != Some("_") => {
                                out.push(BindingOccurrence { atom: a, kind })
                            }
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
    fn bind_group() {
        assert_eq!(names("(bind a 1 b a)"), vec!["a", "b"]);
        assert_eq!(
            names("(bind :string email raw role \"user\")"),
            vec!["email", "role"]
        );
    }

    #[test]
    fn bind_destructuring_array() {
        assert_eq!(names("(bind (array a b) xs)"), vec!["a", "b"]);
    }

    #[test]
    fn func_params() {
        // the func NAME binds too (sweep finding), before its params.
        assert_eq!(
            names("(func f :args (:number a :string b) :body (+ a b))"),
            vec!["f", "a", "b"]
        );
    }

    #[test]
    fn func_multi_clause_params() {
        let src = "(func f (:args (:number a) :body a) (:args (:string s) :body s))";
        assert_eq!(names(src), vec!["f", "a", "s"]);
    }

    #[test]
    fn fn_and_lambda_params() {
        assert_eq!(names("(fn (:number x) x)"), vec!["x"]);
        assert_eq!(names("(lambda (:number y) y)"), vec!["y"]);
    }

    #[test]
    fn genfunc_and_genfn_params() {
        // genfunc has a NAME (binds); genfn is anonymous.
        assert_eq!(
            names("(genfunc g :args (:number n) :body (yield n))"),
            vec!["g", "n"]
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
                ("C".into(), BindingKind::Bind), // the class name binds (sweep finding)
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
        assert_eq!(names(src), vec!["f", "a", "b", "c"]);
    }

    #[test]
    fn export_wrapped_binding_is_found() {
        assert_eq!(names("(export (bind x 1))"), vec!["x"]);
    }

    // DD-60 refinement (2026-07-06): if-let / when-let / match patterns.

    #[test]
    fn if_let_binding() {
        assert_eq!(
            sites("(if-let (x expr) (f x))"),
            vec![("x".into(), BindingKind::Pattern)]
        );
    }

    #[test]
    fn when_let_binding() {
        assert_eq!(
            sites("(when-let (y expr) (f y))"),
            vec![("y".into(), BindingKind::Pattern)]
        );
    }

    #[test]
    fn match_clause_patterns_bind_constructor_vars() {
        // constructor sub-patterns bind; the constructor head and wildcard don't.
        assert_eq!(
            names("(match v ((Some x) x) ((Pair a b) (+ a b)) (_ 0))"),
            vec!["x", "a", "b"]
        );
    }

    #[test]
    fn match_literal_and_wildcard_bind_nothing() {
        assert!(names("(match v (0 \"zero\") (_ \"other\"))").is_empty());
    }

    // DD-60 refinement #2 (slice05): catch / import-local / label + name slots.

    #[test]
    fn catch_binding() {
        assert_eq!(
            sites("(try (f) (catch e (g e)))"),
            vec![("e".into(), BindingKind::CatchBinding)]
        );
    }

    #[test]
    fn import_default_named_and_alias_locals() {
        assert_eq!(names("(import \"m\" (a b))"), vec!["a", "b"]);
        assert_eq!(names("(import \"m\" def)"), vec!["def"]);
        assert_eq!(names("(import \"m\" def (a))"), vec!["def", "a"]);
        // (alias original local) → local binding is the 3rd element.
        assert_eq!(names("(import \"m\" ((alias orig loc)))"), vec!["loc"]);
    }

    #[test]
    fn label_is_its_own_namespace() {
        let s = sites("(label loop-a (block))");
        assert_eq!(s, vec![("loop-a".into(), BindingKind::Label)]);
        assert!(!BindingKind::Label.shadows_values());
        assert!(BindingKind::Bind.shadows_values());
    }

    #[test]
    fn function_and_class_name_slots() {
        // sweep finds: the NAME slot binds, on top of the params.
        assert_eq!(names("(func f :args (:number a) :body a)"), vec!["f", "a"]);
        assert_eq!(names("(genfunc g :args () :body (yield 1))"), vec!["g"]);
        assert_eq!(names("(class C () (m (x) x))"), vec!["C", "x"]);
    }

    #[test]
    fn type_constructor_names_and_fields() {
        assert_eq!(
            names("(type Shape (Circle :number r) (Rect :number w :number h))"),
            vec!["Circle", "r", "Rect", "w", "h"]
        );
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
