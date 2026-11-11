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
    "await",
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
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "implements",
    "interface",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "super",
    "static",
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
    "yield",
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
        .filter_map(|b| {
            let emitted = crate::codegen::names::to_js_identifier(&b.name);
            let strict_binding = b.kind != BindingKind::Label
                && matches!(emitted.as_str(), "eval" | "arguments");
            if (strict_binding && b.kind != BindingKind::Label) || is_reserved_word(&emitted) {
                let changed = emitted != b.name;
                let message = if strict_binding {
                    if changed {
                        format!(
                            "'{}' emits '{}' which is forbidden as a strict-mode binding identifier",
                            b.name, emitted
                        )
                    } else {
                        format!("'{}' is forbidden as a strict-mode binding identifier", b.name)
                    }
                } else if changed {
                    format!(
                        "'{}' emits the JavaScript reserved word '{}' and cannot be used as a lykn {}",
                        b.name,
                        emitted,
                        b.kind.describe()
                    )
                } else {
                    format!(
                        "'{}' is a JavaScript reserved word and cannot be used as a lykn {}",
                        b.name,
                        b.kind.describe()
                    )
                };
                Some((b, message))
            } else {
                None
            }
        })
        .map(|(b, message)| Diagnostic {
            severity: Severity::Error,
            message,
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
    pub(crate) fn project(self) -> BindingSite {
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
    walk_sequence(forms, &mut out, &mut Vec::new());
    out
}

fn walk_sequence(forms: &[SExpr], out: &mut Vec<BindingSite>, scope: &mut Vec<String>) {
    let mark = scope.len();
    for form in forms {
        walk(form, out, scope);
        let dispatches = match form {
            SExpr::List { values, .. } => values
                .first()
                .and_then(SExpr::as_form_head)
                .is_some_and(|head| !scope.iter().any(|bound| bound == head)),
            _ => false,
        };
        if dispatches {
            scope.extend(crate::resolver::hoisted_names(form));
        }
    }
    scope.truncate(mark);
}

fn walk_sequence_refs(forms: &[&SExpr], out: &mut Vec<BindingSite>, scope: &mut Vec<String>) {
    for form in forms {
        walk(form, out, scope);
        let dispatches = match form {
            SExpr::List { values, .. } => values
                .first()
                .and_then(SExpr::as_form_head)
                .is_some_and(|head| !scope.iter().any(|bound| bound == head)),
            _ => false,
        };
        if dispatches {
            scope.extend(crate::resolver::hoisted_names(form));
        }
    }
}

fn walk(form: &SExpr, out: &mut Vec<BindingSite>, scope: &mut Vec<String>) {
    if let SExpr::Cons { car, cdr, .. } = form {
        walk(car, out, scope);
        walk(cdr, out, scope);
        return;
    }
    let SExpr::List { values, .. } = form else {
        return;
    };
    let Some(head) = values.first() else {
        return;
    };
    let raw = head.as_atom();
    let Some(name) = head
        .as_form_head()
        .filter(|name| !scope.iter().any(|bound| bound == name))
    else {
        if head.as_atom().is_none() {
            walk(head, out, scope);
        }
        for child in values.iter().skip(1) {
            walk(child, out, scope);
        }
        return;
    };

    match name {
        "quote" | "kernel:quote" => return,
        "quasiquote" | "kernel:quasiquote" => {
            if let Some(template) = values.get(1) {
                walk_template(template, out, scope, 1);
            }
            return;
        }
        "obj" => {
            for pair in values[1..].chunks(2) {
                if let Some(key) = pair.first().filter(|key| matches!(key, SExpr::List { .. })) {
                    walk(key, out, scope);
                }
                if let Some(value) = pair.get(1) {
                    walk(value, out, scope);
                }
            }
            return;
        }
        "object" | "kernel:object" => {
            for property in &values[1..] {
                use crate::semantic_roles::ObjectPropertyRole;
                match crate::semantic_roles::object_property_role(property) {
                    ObjectPropertyRole::Shorthand => {}
                    ObjectPropertyRole::Value => walk(property, out, scope),
                    ObjectPropertyRole::Pair => {
                        if let SExpr::List { values, .. } = property {
                            if values.first().and_then(SExpr::as_atom) == Some("spread") {
                                for value in values.iter().skip(1) {
                                    walk(value, out, scope);
                                }
                            } else if let Some(value) = values.get(1) {
                                walk(value, out, scope);
                            }
                        }
                    }
                    ObjectPropertyRole::Computed => {
                        if let SExpr::List { values, .. } = property {
                            if let Some(SExpr::List {
                                values: computed, ..
                            }) = values.first()
                            {
                                for value in computed.iter().skip(1) {
                                    walk(value, out, scope);
                                }
                            }
                            if let Some(value) = values.get(1) {
                                walk(value, out, scope);
                            }
                        }
                    }
                    ObjectPropertyRole::Dynamic => {
                        if let SExpr::List { values, .. } = property {
                            for value in values {
                                walk(value, out, scope);
                            }
                        }
                    }
                }
            }
            return;
        }
        "class" => {
            let class_names = class_names(&values[1..]);
            out.extend(
                class_names
                    .iter()
                    .filter(|site| site.kind == BindingKind::Bind)
                    .map(|site| (*site).project()),
            );
            let mut class_scope = scope.clone();
            class_scope.extend(
                class_names
                    .iter()
                    .filter(|site| site.kind == BindingKind::Bind)
                    .filter_map(|site| site.atom.as_atom().map(str::to_string)),
            );
            if let Some(SExpr::List { values: bases, .. }) = values.get(2) {
                for base in bases {
                    walk(base, out, &mut class_scope);
                }
            }
            for member in values.iter().skip(3) {
                walk_class_member(member, out, &mut class_scope);
            }
            return;
        }
        "func" | "genfunc" => {
            walk_source_function(form, out, scope);
            return;
        }
        "fn" | "genfn" | "lambda" => {
            walk_typed_function(form, out, scope);
            return;
        }
        _ => {}
    }

    let sites = bindings_introduced(form);
    out.extend(sites.clone());
    if name == "bind" {
        walk_bind_operands(&values[1..], out, scope);
        return;
    }
    if matches!(name, "for-of" | "for-in" | "for-await-of") {
        if let Some(pattern) = values.get(1) {
            walk_pattern_defaults(pattern, out, scope, PatternGrammar::BindingPattern);
        }
        if let Some(iterable) = values.get(2) {
            walk(iterable, out, scope);
        }
        let mark = scope.len();
        scope.extend(
            sites
                .iter()
                .filter(|site| site.kind.shadows_values())
                .map(|site| site.name.clone()),
        );
        walk_sequence(values.get(3..).unwrap_or_default(), out, scope);
        scope.truncate(mark);
        return;
    }
    if name == "catch" {
        if let Some(pattern) = values.get(1) {
            walk_pattern_defaults(pattern, out, scope, PatternGrammar::BindingPattern);
        }
        let mark = scope.len();
        scope.extend(
            sites
                .iter()
                .filter(|site| site.kind.shadows_values())
                .map(|site| site.name.clone()),
        );
        walk_sequence(values.get(2..).unwrap_or_default(), out, scope);
        scope.truncate(mark);
        return;
    }
    let kernel_head = name.strip_prefix("kernel:").unwrap_or(name);
    if matches!(kernel_head, "const" | "let" | "var")
        && let Some(pattern) = values.get(1)
    {
        walk_pattern_defaults(pattern, out, scope, PatternGrammar::BindingPattern);
        for initializer in values.iter().skip(2) {
            walk(initializer, out, scope);
        }
        return;
    }
    if matches!(kernel_head, "function" | "function*" | "=>" | "lambda") {
        let args = &values[1..];
        let params = if matches!(kernel_head, "=>" | "lambda")
            || matches!(args.first(), Some(SExpr::List { .. }))
        {
            args.first()
        } else {
            args.get(1)
        };
        if let Some(params) = params.filter(|p| matches!(p, SExpr::List { .. })) {
            let mut param_scope = scope.clone();
            param_scope.extend(
                sites
                    .iter()
                    .filter(|site| site.kind.shadows_values())
                    .map(|site| site.name.clone()),
            );
            walk_param_defaults(
                params,
                out,
                &mut param_scope,
                PatternGrammar::BindingPattern,
            );
        }
    }
    if matches!(
        name.strip_prefix("kernel:").unwrap_or(name),
        "function" | "function*" | "=>" | "lambda"
    ) {
        let mark = scope.len();
        scope.extend(
            sites
                .iter()
                .filter(|s| s.kind.shadows_values())
                .map(|s| s.name.clone()),
        );
        let args = &values[1..];
        let params_index = if matches!(kernel_head, "=>" | "lambda")
            || matches!(args.first(), Some(SExpr::List { .. }))
        {
            0
        } else {
            1
        };
        for (index, child) in args.iter().enumerate() {
            if index != params_index {
                walk(child, out, scope);
            }
        }
        scope.truncate(mark);
        return;
    }
    let mark = scope.len();
    if matches!(name, "match" | "if-let" | "when-let") {
        // Clause/pattern structure is handled by the established scope plan;
        // visit executable children without treating grammar markers as forms.
        for child in values.iter().skip(1) {
            walk(child, out, scope);
        }
    } else {
        for child in values.iter().skip(1) {
            walk(child, out, scope);
        }
    }
    scope.truncate(mark);
    let _ = raw;
}

fn walk_class_member(member: &SExpr, out: &mut Vec<BindingSite>, class_scope: &mut Vec<String>) {
    let SExpr::List { values, .. } = member else {
        return;
    };
    if values.is_empty() {
        return;
    }
    let member_head = values[0].as_atom().unwrap_or("");
    if matches!(member_head, "static" | "async") {
        for inner in values.iter().skip(1) {
            walk_class_member(inner, out, class_scope);
        }
        return;
    }
    let params_index = if matches!(member_head, "get" | "set") {
        2
    } else {
        1
    };
    if let Some(params) = values
        .get(params_index)
        .filter(|param| matches!(param, SExpr::List { .. }))
    {
        let mut method_scope = class_scope.clone();
        let sites = kernel_param_names(params)
            .into_iter()
            .map(|site| {
                let mut site = site.project();
                site.kind = BindingKind::ClassMethodParam;
                site
            })
            .collect::<Vec<_>>();
        method_scope.extend(sites.iter().map(|site| site.name.clone()));
        out.extend(sites);
        walk_param_defaults(
            params,
            out,
            &mut method_scope,
            PatternGrammar::BindingPattern,
        );
        for body in values.iter().skip(params_index + 1) {
            walk(body, out, &mut method_scope);
        }
    } else {
        for value in values.iter().skip(1) {
            walk(value, out, class_scope);
        }
    }
}

fn walk_source_function(form: &SExpr, out: &mut Vec<BindingSite>, scope: &[String]) {
    let SExpr::List { values, .. } = form else {
        return;
    };
    let Some((name, args)) = values[1..].split_first() else {
        return;
    };
    let mut function_scope = scope.to_vec();
    if name.as_atom() != Some("_") && name.atom_parts().is_some() {
        let site = BindingOccurrence {
            atom: name,
            kind: BindingKind::Bind,
        }
        .project();
        function_scope.push(site.name.clone());
        out.push(site);
    }
    let rest = args;
    let multi = matches!(rest.first(), Some(SExpr::List { values, .. })
        if values.first().and_then(SExpr::as_keyword).is_some_and(crate::classifier::forms::is_func_clause_key));
    let keyword_mode = !multi
        && rest
            .first()
            .and_then(SExpr::as_keyword)
            .is_some_and(crate::classifier::forms::is_func_clause_key);
    let clauses: Vec<&[SExpr]> = if multi {
        rest.iter()
            .filter_map(|clause| match clause {
                SExpr::List { values, .. }
                    if values
                        .first()
                        .and_then(SExpr::as_keyword)
                        .is_some_and(crate::classifier::forms::is_func_clause_key) =>
                {
                    Some(values.as_slice())
                }
                _ => None,
            })
            .collect()
    } else if keyword_mode {
        vec![rest]
    } else {
        let mut body_scope = function_scope.clone();
        walk_sequence(rest, out, &mut body_scope);
        return;
    };
    for clause in clauses {
        let groups = crate::classifier::forms::parse_keyword_clauses(clause);
        let params = groups
            .get("args")
            .and_then(|values| values.first())
            .copied();
        let mut clause_scope = function_scope.clone();
        if let Some(params) = params {
            let param_sites = typed_param_names(params);
            out.extend(param_sites.iter().map(|site| site.project()));
            clause_scope.extend(
                param_sites
                    .iter()
                    .filter(|site| site.kind.shadows_values())
                    .map(|site| site.atom.as_atom().unwrap().to_string()),
            );
            walk_param_defaults(
                params,
                out,
                &mut clause_scope,
                PatternGrammar::TypedParameter,
            );
        }
        let pre = groups.get("pre").and_then(|values| values.first()).copied();
        let post = groups
            .get("post")
            .and_then(|values| values.first())
            .copied();
        let body = groups.get("body").map(Vec::as_slice).unwrap_or(&[]);
        let body_pos = clause
            .iter()
            .rposition(|item| item.as_keyword() == Some("body"));
        let post_pos = clause
            .iter()
            .rposition(|item| item.as_keyword() == Some("post"));
        if let Some(pre) = pre {
            walk(pre, out, &mut clause_scope);
        }
        if post_pos
            .zip(body_pos)
            .is_some_and(|(post, body)| post < body)
        {
            if let Some(post) = post {
                walk(post, out, &mut clause_scope);
            }
            walk_sequence_refs(body, out, &mut clause_scope);
        } else {
            walk_sequence_refs(body, out, &mut clause_scope);
            if let Some(post) = post {
                walk(post, out, &mut clause_scope);
            }
        }
    }
}

fn walk_typed_function(form: &SExpr, out: &mut Vec<BindingSite>, scope: &mut Vec<String>) {
    let SExpr::List { values, .. } = form else {
        return;
    };
    let Some(params) = values.get(1) else {
        return;
    };
    let param_sites = typed_param_names(params);
    out.extend(param_sites.iter().map(|site| site.project()));
    let mark = scope.len();
    scope.extend(
        param_sites
            .iter()
            .filter(|site| site.kind.shadows_values())
            .filter_map(|site| site.atom.as_atom().map(str::to_string)),
    );
    walk_param_defaults(params, out, scope, PatternGrammar::TypedParameter);
    walk_sequence(values.get(2..).unwrap_or_default(), out, scope);
    scope.truncate(mark);
}

fn typed_param_names(params: &SExpr) -> Vec<BindingOccurrence<'_>> {
    let SExpr::List { values, .. } = params else {
        return Vec::new();
    };
    let mut out = Vec::new();
    for param in values {
        match param {
            SExpr::Atom { .. } if param.as_atom() != Some("_") => out.push(BindingOccurrence {
                atom: param,
                kind: BindingKind::Param,
            }),
            SExpr::List { values, .. } => match values.first().and_then(SExpr::as_atom) {
                Some("rest" | "default") => {
                    if let Some(binding) = values.get(2) {
                        pattern_occurrences(
                            binding,
                            BindingKind::Param,
                            PatternGrammar::TypedParameter,
                            &mut out,
                        );
                    }
                }
                Some("array" | "object") => pattern_occurrences(
                    param,
                    BindingKind::Param,
                    PatternGrammar::TypedParameter,
                    &mut out,
                ),
                _ => {}
            },
            _ => {}
        }
    }
    out
}

fn walk_param_defaults(
    params: &SExpr,
    out: &mut Vec<BindingSite>,
    scope: &mut Vec<String>,
    grammar: PatternGrammar,
) {
    let SExpr::List { values, .. } = params else {
        return;
    };
    for param in values {
        let SExpr::List { values, .. } = param else {
            continue;
        };
        if matches!(
            values.first().and_then(SExpr::as_atom),
            Some("default" | "rest" | "array" | "object")
        ) {
            walk_pattern_defaults(param, out, scope, grammar);
        }
    }
}

fn walk_bind_operands(args: &[SExpr], out: &mut Vec<BindingSite>, scope: &mut Vec<String>) {
    let mark = scope.len();
    if args.len() == 2 || args.len() == 3 {
        let pattern_index = usize::from(args.len() == 3);
        walk_pattern_defaults(
            &args[pattern_index],
            out,
            scope,
            PatternGrammar::BindingPattern,
        );
        walk(&args[pattern_index + 1], out, scope);
        scope.truncate(mark);
        return;
    }
    if args.len() < 4 {
        return;
    }
    let mut i = 0;
    while i < args.len() {
        let pattern_index = i + usize::from(matches!(args.get(i), Some(SExpr::Keyword { .. })));
        let value_index = pattern_index + 1;
        if value_index >= args.len() {
            break;
        }
        walk_pattern_defaults(
            &args[pattern_index],
            out,
            scope,
            PatternGrammar::BindingPattern,
        );
        walk(&args[value_index], out, scope);
        scope.extend(
            binding_names_in_pattern(&args[pattern_index], BindingKind::Bind)
                .into_iter()
                .map(|site| site.name),
        );
        i = value_index + 1;
    }
    scope.truncate(mark);
}

fn walk_pattern_defaults(
    pattern: &SExpr,
    out: &mut Vec<BindingSite>,
    scope: &mut Vec<String>,
    grammar: PatternGrammar,
) {
    let SExpr::List { values, .. } = pattern else {
        return;
    };
    let head = values.first().and_then(SExpr::as_atom).unwrap_or("");
    if head == "default" {
        let typed = grammar == PatternGrammar::TypedParameter;
        if grammar == PatternGrammar::BindingPattern
            && let Some(nested) = values.get(1)
        {
            walk_pattern_defaults(nested, out, scope, grammar);
        }
        if let Some(value) = values.get(if typed { 3 } else { 2 }) {
            walk(value, out, scope);
        }
        return;
    }
    if head == "rest" {
        let typed = grammar == PatternGrammar::TypedParameter;
        if let Some(nested) = values.get(if typed { 2 } else { 1 }) {
            walk_pattern_defaults(nested, out, scope, grammar);
        }
        return;
    }
    if !matches!(Some(head), Some("array" | "object")) {
        return;
    }
    for member in values.iter().skip(1) {
        let SExpr::List { values, .. } = member else {
            continue;
        };
        match values.first().and_then(SExpr::as_atom) {
            Some("alias") => {
                let typed = grammar == PatternGrammar::TypedParameter;
                if let Some(nested) = values.get(if typed { 3 } else { 2 }) {
                    walk_pattern_defaults(nested, out, scope, grammar);
                }
                if !typed && let Some(default) = values.get(3) {
                    walk(default, out, scope);
                }
            }
            Some("default" | "rest" | "array" | "object") => {
                walk_pattern_defaults(member, out, scope, grammar)
            }
            _ => {}
        }
    }
}

fn walk_template(node: &SExpr, out: &mut Vec<BindingSite>, scope: &mut Vec<String>, depth: usize) {
    let SExpr::List { values, .. } = node else {
        return;
    };
    match values.first().and_then(SExpr::as_atom) {
        Some("quasiquote") => {
            if let Some(child) = values.get(1) {
                walk_template(child, out, scope, depth + 1);
            }
        }
        Some("unquote" | "unquote-splicing") if depth == 1 => {
            if let Some(child) = values.get(1) {
                walk(child, out, scope);
            }
        }
        Some("unquote" | "unquote-splicing") => {
            if let Some(child) = values.get(1) {
                walk_template(child, out, scope, depth - 1);
            }
        }
        _ => {
            for child in values {
                walk_template(child, out, scope, depth);
            }
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
        "func" | "genfunc" | "fn" | "lambda" | "genfn" | "if-let" | "when-let" | "match" => {
            crate::classifier::forms::classify_form_with_bindings(form).unwrap_or_default()
        }
        "kernel:lambda" => args.first().map(kernel_param_names).unwrap_or_default(),
        "type" => {
            let mut out =
                crate::classifier::forms::classify_form_with_bindings(form).unwrap_or_default();
            for ctor in args
                .iter()
                .skip(1)
                .filter(|ctor| ctor.atom_parts().is_some())
            {
                if ctor.as_atom() != Some("_") {
                    out.push(BindingOccurrence {
                        atom: ctor,
                        kind: BindingKind::Bind,
                    });
                }
            }
            out
        }
        "for-of" | "for-in" | "for-await-of" => loop_names(args),
        "function" | "function*" | "kernel:function" | "kernel:function*" => {
            kernel_function_names(args)
        }
        "=>" | "kernel:=>" => args.first().map(kernel_param_names).unwrap_or_default(),
        "class" => class_names(args),
        "catch" => catch_names(args),
        "import" => import_local_names(args),
        "label" | "kernel:label" => label_names(args),
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

fn kernel_function_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    if matches!(args.first(), Some(SExpr::List { .. })) {
        return kernel_param_names(&args[0]);
    }
    let mut out = Vec::new();
    if let Some(name) = args.first().filter(|name| name.as_atom() != Some("_"))
        && name.atom_parts().is_some()
    {
        out.push(BindingOccurrence {
            atom: name,
            kind: BindingKind::Bind,
        });
    }
    if let Some(params) = args.get(1) {
        out.extend(kernel_param_names(params));
    }
    out
}

fn kernel_param_names(params: &SExpr) -> Vec<BindingOccurrence<'_>> {
    let SExpr::List { values, .. } = params else {
        return Vec::new();
    };
    let mut out = Vec::new();
    for param in values {
        match param {
            a @ SExpr::Atom { .. } if a.as_atom() != Some("_") => {
                out.push(BindingOccurrence {
                    atom: a,
                    kind: BindingKind::Param,
                });
            }
            SExpr::List { values, .. } => match values.first().and_then(SExpr::as_atom) {
                Some("rest" | "default") => {
                    if let Some(binding) = values.get(1) {
                        pattern_occurrences_with_grammar(
                            binding,
                            BindingKind::Param,
                            PatternGrammar::BindingPattern,
                            &mut out,
                        );
                    }
                }
                Some("array" | "object") => pattern_occurrences_with_grammar(
                    param,
                    BindingKind::Param,
                    PatternGrammar::BindingPattern,
                    &mut out,
                ),
                _ => {}
            },
            _ => {}
        }
    }
    out
}

/// `(bind name value)` / `(bind :type name value)` — the name slot is an atom or
/// a destructuring pattern.
fn bind_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let mut out = Vec::new();
    match args.len() {
        2 => pattern_occurrences(
            &args[0],
            BindingKind::Bind,
            PatternGrammar::BindingPattern,
            &mut out,
        ),
        3 => pattern_occurrences(
            &args[1],
            BindingKind::Bind,
            PatternGrammar::BindingPattern,
            &mut out,
        ),
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
                pattern_occurrences(
                    &args[name_index],
                    BindingKind::Bind,
                    PatternGrammar::BindingPattern,
                    &mut out,
                );
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
    pattern_occurrences(pat, kind, PatternGrammar::BindingPattern, &mut out);
    out.into_iter().map(BindingOccurrence::project).collect()
}

/// Loop binding: `(for-of binding iterable body…)` — binding is an atom or a
/// destructuring pattern.
fn loop_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let Some(binding) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_occurrences(
        binding,
        BindingKind::LoopBinding,
        PatternGrammar::BindingPattern,
        &mut out,
    );
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
    pattern_occurrences_with_grammar(
        name_slot,
        BindingKind::Bind,
        PatternGrammar::BindingPattern,
        &mut out,
    );
    out
}

/// `catch` clause error binding: `(catch NAME handler…)` — NAME is the first
/// argument (an atom, or a destructuring pattern for `catch ({…})`).
fn catch_names(args: &[SExpr]) -> Vec<BindingOccurrence<'_>> {
    let Some(binding) = args.first() else {
        return Vec::new();
    };
    let mut out = Vec::new();
    pattern_occurrences(
        binding,
        BindingKind::CatchBinding,
        PatternGrammar::BindingPattern,
        &mut out,
    );
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
    grammar: PatternGrammar,
    out: &mut Vec<BindingOccurrence<'a>>,
) {
    pattern_occurrences_with_grammar(pat, kind, grammar, out);
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum PatternGrammar {
    TypedParameter,
    BindingPattern,
}

fn pattern_occurrences_with_grammar<'a>(
    pat: &'a SExpr,
    kind: BindingKind,
    grammar: PatternGrammar,
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
                                        let index = if grammar == PatternGrammar::TypedParameter {
                                            2
                                        } else {
                                            1
                                        };
                                        if let Some(n) = inner.get(index) {
                                            pattern_occurrences_with_grammar(n, kind, grammar, out);
                                        }
                                    }
                                    "default" => {
                                        let index = if grammar == PatternGrammar::TypedParameter {
                                            2
                                        } else {
                                            1
                                        };
                                        if let Some(n) = inner.get(index) {
                                            pattern_occurrences_with_grammar(n, kind, grammar, out);
                                        }
                                    }
                                    "alias" => {
                                        let typed = grammar == PatternGrammar::TypedParameter;
                                        if let Some(local) = inner.get(if typed { 3 } else { 2 }) {
                                            pattern_occurrences_with_grammar(
                                                local, kind, grammar, out,
                                            );
                                        }
                                    }
                                    "array" | "object" => {
                                        pattern_occurrences_with_grammar(el, kind, grammar, out)
                                    }
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
    fn source_func_validation_scopes_each_clause_separately() {
        let legal =
            read("(func f (:args (:any bind) :body (bind eval 1)) (:args (:any x) :body x))")
                .unwrap();
        assert!(validate_reserved_names(&legal).is_empty());
        let illegal =
            read("(func f (:args (:any bind) :body 0) (:args (:any x) :body (bind eval 1)) )")
                .unwrap();
        assert!(validate_reserved_names(&illegal).iter().any(|diagnostic| {
            diagnostic
                .message
                .contains("strict-mode binding identifier")
        }));
    }

    #[test]
    fn kernel_lambda_parameters_are_validated_as_kernel_slots() {
        let forms = read("(kernel:lambda (package) package)").unwrap();
        assert_eq!(names("(kernel:lambda (package) package)"), vec!["package"]);
        assert!(
            validate_reserved_names(&forms)
                .iter()
                .any(|diagnostic| diagnostic.message.contains("package"))
        );
    }

    #[test]
    fn defaults_use_actual_typed_or_untyped_slots_and_visit_alias_expressions() {
        for source in [
            "(fn ((default :any package 0)) package)",
            "(function local ((default package 0)) package)",
            "(bind (object (default package 0)) source)",
        ] {
            let forms = read(source).unwrap();
            assert!(
                validate_reserved_names(&forms)
                    .iter()
                    .any(|diagnostic| diagnostic.message.contains("package")),
                "{source}"
            );
        }
        let forms = read("(bind (object (alias data local (bind eval 1))) source)").unwrap();
        assert!(validate_reserved_names(&forms).iter().any(|diagnostic| {
            diagnostic
                .message
                .contains("strict-mode binding identifier")
        }));
    }

    #[test]
    fn correction07_walks_selected_function_regions_and_recursive_kernel_defaults() {
        for source in [
            "(func example :args () :body 1 (bind package 2) 3)",
            "(func example 1 (bind package 2) 3)",
            "(genfunc example :args () :body (yield 1) (bind package 2))",
            "(bind result ((do (bind package 1) (fn () 2))))",
            "(kernel:function example ((default value (do (bind package 1) 2))) (return value))",
            "(kernel:const (object (default value (do (bind package 1) 2))) (object))",
            "(class Example () (method ((default value (do (bind package 1) 2))) (return value)))",
            "(bind (object (alias data (object (default value (do (bind package 1) 2))))) (object))",
        ] {
            let forms = read(source).expect("parse correction witness");
            assert!(
                validate_reserved_names(&forms)
                    .iter()
                    .any(|d| d.message.contains("package")),
                "{source}"
            );
        }
        let repeated = read("(func f :args () :body (bind package 1) :body 1)").unwrap();
        assert!(validate_reserved_names(&repeated).is_empty());
        let typed_alias =
            read("(func f :args ((object (alias :any package (object :any local)))) :body local)")
                .unwrap();
        assert_eq!(
            names("(func f :args ((object (alias :any package (object :any local)))) :body local)"),
            vec!["f", "local"]
        );
        assert!(
            !validate_reserved_names(&typed_alias)
                .iter()
                .any(|d| d.message.contains("package"))
        );
        let kernel_alias = read("(kernel:const (object (alias :package eval)) (object))").unwrap();
        assert!(
            validate_reserved_names(&kernel_alias)
                .iter()
                .any(|d| d.message.contains("eval"))
        );
        assert_eq!(
            names(
                "(kernel:const (object (default value (bind local (fn (:any inner) inner)))) source)"
            ),
            vec!["value", "local", "inner"]
        );
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
    fn binding_patterns_use_their_producer_grammar() {
        for source in [
            "(bind (object (alias :value package)) (obj :value 1))",
            "(for-of (object (alias :value package)) (array (obj :value 1)) 1)",
            "(const (object (alias :value package)) (object))",
            "(kernel:const (object (alias :value package)) (object))",
            "(catch (object (alias :value package)) (return package))",
            "(for-of (object (alias :value local (bind package 1))) (array (obj :value 1)) 1)",
            "(catch (object (alias :value local (bind package 1))) 1)",
        ] {
            assert!(
                names(source).contains(&"package".to_string()),
                "{source}: {:?}",
                names(source)
            );
        }
        assert_eq!(
            names("(func f :args ((object (alias :any package (object :any local)))) :body local)"),
            vec!["f", "local"]
        );
    }

    #[test]
    fn function_default_occurrences_are_walked_once_per_producer() {
        let body = "(do (bind local (fn (:any inner) inner)) local)";
        let cases = [
            (
                format!("(function example ((default value {body})) (return value))"),
                vec!["example", "value", "local", "inner"],
            ),
            (
                format!("(func example :args ((default :any value {body})) :body value)"),
                vec!["example", "value", "local", "inner"],
            ),
            (
                format!(
                    "(genfunc example :args ((default :any value {body})) :body (yield value))"
                ),
                vec!["example", "value", "local", "inner"],
            ),
            (
                format!("(function* ((default value {body})) (yield value))"),
                vec!["value", "local", "inner"],
            ),
            (
                format!("(fn ((default :any value {body})) value)"),
                vec!["value", "local", "inner"],
            ),
            (
                format!("(lambda ((default :any value {body})) value)"),
                vec!["value", "local", "inner"],
            ),
            (
                format!("(genfn ((default :any value {body})) (yield value))"),
                vec!["value", "local", "inner"],
            ),
            (
                format!("(=> ((default value {body})) value)"),
                vec!["value", "local", "inner"],
            ),
            (
                format!("(kernel:lambda ((default value {body})) value)"),
                vec!["value", "local", "inner"],
            ),
        ];
        for (source, expected) in cases {
            assert_eq!(names(&source), expected, "{source}");
        }
        assert_eq!(
            names("(function example (same same) (return same))"),
            vec!["example", "same", "same"]
        );
    }

    #[test]
    fn empty_source_function_headers_do_not_invent_bindings() {
        assert!(walk_bindings(&read("(func)").unwrap()).is_empty());
        assert!(walk_bindings(&read("(genfunc)").unwrap()).is_empty());
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

    #[test]
    fn validates_emitted_names_and_keeps_strict_bindings_separate_from_labels() {
        let normalized = read("(bind if! 1)").expect("parse normalized keyword binder");
        let diagnostic = validate_reserved_names(&normalized)
            .pop()
            .expect("if! emits if");
        assert!(
            diagnostic
                .message
                .contains("'if!' emits the JavaScript reserved word 'if'")
        );
        assert_eq!(diagnostic.span, walk_bindings(&normalized)[0].span);

        let strict = read("(fn (:any eval) eval)").expect("parse strict binding");
        let diagnostic = validate_reserved_names(&strict)
            .pop()
            .expect("eval binding rejected");
        assert!(
            diagnostic
                .message
                .contains("strict-mode binding identifier")
        );

        let label = read("(label eval (block))").expect("parse eval label");
        assert!(validate_reserved_names(&label).is_empty());
        let keyword_label = read("(label if (block))").expect("parse keyword label");
        assert!(
            validate_reserved_names(&keyword_label)[0]
                .message
                .contains("reserved word")
        );
    }

    #[test]
    fn emitted_kernel_parameter_and_role_projection_is_precise() {
        assert_eq!(
            names("(function run (package) package)"),
            vec!["run", "package"]
        );
        assert_eq!(
            names("(function* ((rest package)) (yield package))"),
            vec!["package"]
        );
        assert!(validate_reserved_names(&read("(quote (bind if 0))").unwrap()).is_empty());
        assert!(validate_reserved_names(&read("(kernel:object (const eval))").unwrap()).is_empty());
        assert!(
            validate_reserved_names(&read("(bind bind 0 result (bind eval))").unwrap()).is_empty()
        );
        assert!(
            validate_reserved_names(&read("(bind first 0 second (bind eval 1))").unwrap())[0]
                .message
                .contains("strict-mode binding identifier")
        );
    }
}
