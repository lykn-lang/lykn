//! `lykn lint` — source-level idiom/style linting (DD-59).
//!
//! Lint runs over the **reader SExpr, pre-expansion** — it judges what the
//! user *wrote*, not what it expands to (matching `lykn check`'s pipeline
//! position, one pass earlier than `check`'s classify). Rules are a hardcoded
//! match-dispatch registry; findings are `Diagnostic`s (error/warn) rendered
//! like `lykn check`'s, plus a `--format=json` shape for tooling.

mod rules;

use lykn_lang::ast::sexpr::SExpr;
use lykn_lang::diagnostics::{Diagnostic, Severity};
use lykn_lang::error::LyknError;
use lykn_lang::reader;

/// A lint finding: a `Diagnostic` tagged with the rule id and source file.
pub struct LintFinding {
    pub rule: &'static str,
    pub file: String,
    pub diagnostic: Diagnostic,
}

/// Read-only context handed to each rule: the ancestor stack (outermost first,
/// immediate parent last) and the file/source for context queries.
///
/// `file` is read by the slice02 conventions rules (path-scoping). `ancestors`,
/// `source`, and `parent()` are the ancestry API the slice03 `shadowing` rule
/// (scope tracking) will consume; they're built by the walk **now** and marked
/// `allow(dead_code)` as disclosed forward-API with that re-entry condition, not
/// buried intent — see the closing-report bubble-up.
pub struct LintContext<'a> {
    #[allow(dead_code)]
    pub ancestors: &'a [&'a SExpr],
    pub file: &'a str,
    #[allow(dead_code)]
    pub source: &'a str,
}

impl LintContext<'_> {
    /// The immediate parent form, if any.
    #[allow(dead_code)]
    pub fn parent(&self) -> Option<&SExpr> {
        self.ancestors.last().copied()
    }
}

/// A lint rule. `enter`/`exit` take `&mut self` so **stateful** rules (e.g.
/// scope tracking for `shadowing`, slice03) are not precluded; the slice01
/// pilots are stateless. `exit` fires when the walk leaves a node (for
/// scope-popping rules); its default is a no-op.
pub trait LintRule {
    fn id(&self) -> &'static str;
    fn enter(&mut self, node: &SExpr, ctx: &LintContext, out: &mut Vec<Diagnostic>);
    fn exit(&mut self, _node: &SExpr) {}
}

/// The hardcoded rule registry (DD-59 Q2). Fresh instances per file so
/// stateful rules reset between files.
fn registry() -> Vec<Box<dyn LintRule>> {
    vec![
        // slice01 pilots
        Box::new(rules::NoRequire),
        Box::new(rules::SortWithoutComparator),
        Box::new(rules::ParseintRadix),
        // slice02 tier-1 shape rules
        Box::new(rules::NoEval),
        Box::new(rules::NoNewWrappers),
        Box::new(rules::GlobalIsnan),
        Box::new(rules::NoArguments),
        Box::new(rules::NoIife),
        Box::new(rules::NoDeleteOnArray),
        Box::new(rules::NoJsonDeepCopy),
        Box::new(rules::PreferSurfaceOperators),
        Box::new(rules::OrForDefaults),
        Box::new(rules::ForInOnArrays),
        // slice02 conventions rules (path-scoped to test files)
        Box::new(rules::NoRelativeSourceImports),
        Box::new(rules::NoDirnameFixtures),
    ]
}

/// Lint one source string. Returns findings sorted by position (empty = clean).
/// Errors only if the source cannot be read into SExpr (a syntactically invalid
/// file is not lintable).
pub fn lint_source(source: &str, file: &str) -> Result<Vec<LintFinding>, LyknError> {
    let forms = reader::read(source)?;
    let mut rules = registry();
    let mut findings = Vec::new();
    let mut ancestors: Vec<&SExpr> = Vec::new();
    for form in &forms {
        walk(
            form,
            &mut ancestors,
            &mut rules,
            file,
            source,
            &mut findings,
        );
    }
    findings.sort_by_key(|f| (f.diagnostic.span.start.line, f.diagnostic.span.start.column));
    Ok(findings)
}

/// Depth-first walk of the SExpr tree, maintaining the ancestor stack and
/// firing every rule's `enter`/`exit` on each node.
fn walk<'a>(
    node: &'a SExpr,
    ancestors: &mut Vec<&'a SExpr>,
    rules: &mut [Box<dyn LintRule>],
    file: &str,
    source: &str,
    findings: &mut Vec<LintFinding>,
) {
    {
        let ctx = LintContext {
            ancestors: ancestors.as_slice(),
            file,
            source,
        };
        for rule in rules.iter_mut() {
            let mut diags = Vec::new();
            rule.enter(node, &ctx, &mut diags);
            let id = rule.id();
            for d in diags {
                findings.push(LintFinding {
                    rule: id,
                    file: file.to_string(),
                    diagnostic: d,
                });
            }
        }
    }

    ancestors.push(node);
    match node {
        SExpr::List { values, .. } => {
            for child in values {
                walk(child, ancestors, rules, file, source, findings);
            }
        }
        SExpr::Cons { car, cdr, .. } => {
            walk(car, ancestors, rules, file, source, findings);
            walk(cdr, ancestors, rules, file, source, findings);
        }
        _ => {}
    }
    ancestors.pop();

    for rule in rules.iter_mut() {
        rule.exit(node);
    }
}

fn severity_str(s: &Severity) -> &'static str {
    match s {
        Severity::Error => "error",
        Severity::Warning => "warning",
        Severity::Info => "info",
    }
}

/// Render a finding as a `check`-style text line:
/// `file:line:col: severity [rule]: message` (+ an indented suggestion).
pub fn render_text(f: &LintFinding) -> String {
    let d = &f.diagnostic;
    let mut out = format!(
        "{}:{}:{}: {} [{}]: {}",
        f.file,
        d.span.start.line,
        d.span.start.column,
        severity_str(&d.severity),
        f.rule,
        d.message,
    );
    if let Some(ref s) = d.suggestion {
        out.push_str(&format!("\n  suggestion: {s}"));
    }
    out
}

/// The stable `--format=json` shape (rule, severity, message, file, span,
/// suggestion). Keys are API.
pub fn to_json(findings: &[LintFinding]) -> String {
    let arr: Vec<serde_json::Value> = findings
        .iter()
        .map(|f| {
            let d = &f.diagnostic;
            serde_json::json!({
                "rule": f.rule,
                "severity": severity_str(&d.severity),
                "message": d.message,
                "file": f.file,
                "span": {
                    "start": { "line": d.span.start.line, "column": d.span.start.column },
                    "end": { "line": d.span.end.line, "column": d.span.end.column },
                },
                "suggestion": d.suggestion,
            })
        })
        .collect();
    serde_json::to_string_pretty(&serde_json::Value::Array(arr))
        .unwrap_or_else(|_| "[]".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Lint a snippet, expecting it to parse. Panics on a read error.
    fn lint(src: &str) -> Vec<LintFinding> {
        lint_source(src, "fixture.lykn").expect("fixture must parse")
    }

    // --- F-4: per-rule fixtures, both directions ---

    #[test]
    fn no_require_flags_require_call() {
        let f = lint("(bind fs (require \"fs\"))");
        assert_eq!(f.len(), 1, "one finding");
        assert_eq!(f[0].rule, "no-require");
        assert_eq!(f[0].diagnostic.severity, Severity::Error);
        // span points precisely at the `require` head atom, not the whole `bind`.
        assert_eq!(f[0].diagnostic.span.start.line, 1);
        assert_eq!(f[0].diagnostic.span.start.column, 11);
        assert!(
            f[0].diagnostic
                .suggestion
                .as_deref()
                .unwrap()
                .contains("import")
        );
    }

    #[test]
    fn no_require_silent_on_import() {
        assert!(lint("(import \"fs\" (readFile))").is_empty());
    }

    #[test]
    fn sort_without_comparator_flags_bare_sort() {
        let f = lint("(bind s (nums:sort))");
        assert_eq!(f.len(), 1);
        assert_eq!(f[0].rule, "sort-without-comparator");
        assert_eq!(f[0].diagnostic.severity, Severity::Warning);
        assert!(
            f[0].diagnostic
                .suggestion
                .as_deref()
                .unwrap()
                .contains("comparator")
        );
    }

    #[test]
    fn sort_with_comparator_silent() {
        assert!(lint("(bind s (nums:sort (fn (:number a :number b) (- a b))))").is_empty());
    }

    #[test]
    fn parseint_radix_flags_missing_radix() {
        let f = lint("(bind n (parseInt s))");
        assert_eq!(f.len(), 1);
        assert_eq!(f[0].rule, "parseint-radix");
        assert_eq!(f[0].diagnostic.severity, Severity::Warning);
        assert!(
            f[0].diagnostic
                .suggestion
                .as_deref()
                .unwrap()
                .contains("radix")
        );
    }

    #[test]
    fn parseint_radix_silent_with_radix() {
        assert!(lint("(bind n (parseInt s 10))").is_empty());
    }

    #[test]
    fn nested_calls_are_walked() {
        // a require buried inside a let body must still be found.
        let f = lint("(func f :body (block (bind fs (require \"fs\"))))");
        assert_eq!(f.len(), 1);
        assert_eq!(f[0].rule, "no-require");
    }

    #[test]
    fn findings_sorted_by_position() {
        let f = lint("(bind n (parseInt s))\n(bind fs (require \"fs\"))");
        assert_eq!(f.len(), 2);
        assert_eq!(f[0].diagnostic.span.start.line, 1); // parseInt first
        assert_eq!(f[1].diagnostic.span.start.line, 2); // require second
    }

    #[test]
    fn clean_source_is_silent() {
        assert!(lint("(func add :args (:number a :number b) :body (+ a b))").is_empty());
    }

    // --- slice02: the 12 shape/conventions rules, both directions ---

    /// Lint a snippet as a specific file (for path-scoped conventions rules).
    fn lint_as(src: &str, file: &str) -> Vec<LintFinding> {
        lint_source(src, file).expect("fixture must parse")
    }

    fn only_rule(f: &[LintFinding], rule: &str) -> bool {
        !f.is_empty() && f.iter().all(|x| x.rule == rule)
    }

    #[test]
    fn no_eval_flags_eval_and_js_eval() {
        assert!(only_rule(&lint("(bind r (eval \"1+1\"))"), "no-eval"));
        assert!(only_rule(&lint("(bind r (js:eval \"1+1\"))"), "no-eval"));
        assert_eq!(
            lint("(bind r (eval \"x\"))")[0].diagnostic.severity,
            Severity::Error
        );
    }
    #[test]
    fn no_eval_silent_on_normal_call() {
        assert!(lint("(bind r (evaluate x))").is_empty());
    }

    #[test]
    fn no_new_wrappers_flags_boxed_primitives() {
        assert!(only_rule(&lint("(new Boolean false)"), "no-new-wrappers"));
        assert!(only_rule(&lint("(new String x)"), "no-new-wrappers"));
        assert!(only_rule(&lint("(new Number 1)"), "no-new-wrappers"));
    }
    #[test]
    fn no_new_wrappers_silent_on_real_class() {
        assert!(lint("(new Dog \"Rex\")").is_empty());
    }

    #[test]
    fn global_isnan_flags_bare_isnan() {
        assert!(only_rule(&lint("(bind r (isNaN x))"), "global-isnan"));
    }
    #[test]
    fn global_isnan_silent_on_number_isnan() {
        assert!(lint("(bind r (Number:isNaN x))").is_empty());
    }

    #[test]
    fn no_arguments_flags_the_atom() {
        assert!(only_rule(&lint("(bind a arguments)"), "no-arguments"));
    }
    #[test]
    fn no_arguments_silent_on_rest() {
        assert!(lint("(func f :args ((rest xs)) :body xs)").is_empty());
    }

    #[test]
    fn no_iife_flags_immediately_invoked_fn() {
        assert!(only_rule(&lint("((fn () 1))"), "no-iife"));
        assert!(only_rule(&lint("((lambda () 1))"), "no-iife"));
    }
    #[test]
    fn no_iife_silent_on_named_call() {
        assert!(lint("(f 1)").is_empty());
    }

    #[test]
    fn no_delete_on_array_flags_numeric_index() {
        assert!(only_rule(&lint("(delete arr 0)"), "no-delete-on-array"));
    }
    #[test]
    fn no_delete_on_array_silent_on_property_delete() {
        // deleting a named property is a different (legitimate) shape.
        assert!(lint("(delete obj:key)").is_empty());
    }

    #[test]
    fn no_json_deep_copy_flags_roundtrip() {
        assert!(only_rule(
            &lint("(bind c (JSON:parse (JSON:stringify x)))"),
            "no-json-deep-copy"
        ));
    }
    #[test]
    fn no_json_deep_copy_silent_on_plain_parse() {
        assert!(lint("(bind c (JSON:parse raw))").is_empty());
    }

    #[test]
    fn prefer_surface_operators_flags_kernel_ops() {
        assert!(only_rule(&lint("(=== a b)"), "prefer-surface-operators"));
        assert!(only_rule(&lint("(!== a b)"), "prefer-surface-operators"));
        assert!(only_rule(&lint("(&& p q)"), "prefer-surface-operators"));
        assert!(only_rule(&lint("(|| p q)"), "prefer-surface-operators"));
    }
    #[test]
    fn prefer_surface_operators_silent_on_surface_forms() {
        assert!(lint("(= a b)").is_empty());
        assert!(lint("(and p q)").is_empty());
        assert!(lint("(or p q)").is_empty()); // (or x y) with non-literal → not or-for-defaults either
        // `!=` already IS the surface spelling (compiles to `!==`) — not flagged.
        assert!(lint("(!= a b)").is_empty());
    }

    #[test]
    fn or_for_defaults_flags_literal_default() {
        assert!(only_rule(&lint("(bind y (or x 5))"), "or-for-defaults"));
        assert!(only_rule(&lint("(bind y (or x \"d\"))"), "or-for-defaults"));
    }
    #[test]
    fn or_for_defaults_silent_on_boolean_logic() {
        // (or a b) with two non-literal operands is genuine boolean logic.
        assert!(lint("(bind y (or a b))").is_empty());
    }

    #[test]
    fn for_in_on_arrays_flags_array_literal() {
        assert!(only_rule(
            &lint("(for-in k #a(1 2) (console:log k))"),
            "for-in-on-arrays"
        ));
    }
    #[test]
    fn for_in_on_arrays_silent_on_object_and_ambiguous() {
        // conservative: object literal and bare bindings are not flagged.
        assert!(lint("(for-in k #o(:a 1) (console:log k))").is_empty());
        assert!(lint("(for-in k obj (console:log k))").is_empty());
    }

    // conventions rules — path-scoped to test files

    #[test]
    fn no_relative_source_imports_flags_in_test_file() {
        let f = lint_as("(import \"./foo.js\" (bar))", "a_test.lykn");
        assert!(only_rule(&f, "no-relative-source-imports"));
        assert_eq!(f[0].diagnostic.severity, Severity::Error);
    }
    #[test]
    fn no_relative_source_imports_silent_outside_test_files_and_on_bare() {
        // same relative import in a non-test file → not this rule's concern.
        assert!(lint_as("(import \"./foo.js\" (bar))", "src.lykn").is_empty());
        // bare specifier in a test file → silent.
        assert!(lint_as("(import \"lang/compiler.js\" (compile))", "a_test.lykn").is_empty());
    }

    #[test]
    fn no_dirname_fixtures_flags_in_test_file() {
        let f = lint_as("(resolve import.meta:dirname \"f.json\")", "a_test.lykn");
        assert!(only_rule(&f, "no-dirname-fixtures"));
        assert_eq!(f[0].diagnostic.severity, Severity::Error);
        // the `import:meta:dirname` spelling too.
        assert!(only_rule(
            &lint_as("(resolve import:meta:dirname \"f.json\")", "a_test.lykn"),
            "no-dirname-fixtures"
        ));
    }
    #[test]
    fn no_dirname_fixtures_silent_outside_test_and_on_cwd() {
        assert!(lint_as("(resolve import.meta:dirname \"f.json\")", "src.lykn").is_empty());
        assert!(lint_as("(resolve (Deno:cwd) \"test/fixtures\")", "a_test.lykn").is_empty());
    }

    // --- F-5: snapshots (text + JSON) ---

    /// A fixture exercising all three pilots at once, for stable snapshots.
    const ALL_THREE: &str =
        "(bind fs (require \"fs\"))\n(bind s (nums:sort))\n(bind n (parseInt x))";

    #[test]
    fn snapshot_text_output() {
        let findings = lint(ALL_THREE);
        let text = findings
            .iter()
            .map(render_text)
            .collect::<Vec<_>>()
            .join("\n");
        insta::assert_snapshot!("lint_text_all_three", text);
    }

    #[test]
    fn snapshot_json_output() {
        let findings = lint(ALL_THREE);
        let value: serde_json::Value =
            serde_json::from_str(&to_json(&findings)).expect("valid JSON");
        insta::assert_json_snapshot!("lint_json_all_three", value);
    }

    /// The full slice02 shape + conventions corpus, one finding per rule, in a
    /// `_test.lykn` file so the path-scoped conventions rules fire. Locks every
    /// rule's message, span, and suggestion for review.
    const SHAPE_CORPUS: &str = "\
(bind r (eval \"1+1\"))
(bind b (new Boolean false))
(bind n (isNaN x))
(bind a arguments)
((fn () 1))
(delete arr 0)
(bind c (JSON:parse (JSON:stringify x)))
(=== a b)
(bind y (or x 5))
(for-in k #a(1 2) (console:log k))
(import \"./foo.js\" (bar))
(bind p (resolve import.meta:dirname \"f.json\"))";

    #[test]
    fn snapshot_shape_corpus_text() {
        let findings = lint_as(SHAPE_CORPUS, "corpus_test.lykn");
        let text = findings
            .iter()
            .map(render_text)
            .collect::<Vec<_>>()
            .join("\n");
        insta::assert_snapshot!("lint_text_shape_corpus", text);
    }
}
