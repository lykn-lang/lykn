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
/// The slice01 pilots are node-local and don't read these, but the walk builds
/// them **now** (F-2) because the ancestry-dependent rules land next:
/// `for-in-on-arrays` and the two arc11 conventions rules (slice02), and
/// `shadowing` (slice03) — see the closing-report bubble-up. Marked
/// `allow(dead_code)` as disclosed forward-API with that re-entry condition,
/// not buried intent.
#[allow(dead_code)]
pub struct LintContext<'a> {
    pub ancestors: &'a [&'a SExpr],
    pub file: &'a str,
    pub source: &'a str,
}

#[allow(dead_code)]
impl LintContext<'_> {
    /// The immediate parent form, if any.
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
        Box::new(rules::NoRequire),
        Box::new(rules::SortWithoutComparator),
        Box::new(rules::ParseintRadix),
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
}
