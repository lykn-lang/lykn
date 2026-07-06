//! Slice01 pilot rules (DD-59). Shape-diverse on purpose: `no-require` is a
//! call-head match, `sort-without-comparator` a method-call arity check, and
//! `parseint-radix` a call arity check — exercising the walk + registry +
//! both severities. The full corpus is slice02 (see the F-1 verification
//! table). Guide-09 IDs in each rule's doc.

use lykn_lang::ast::sexpr::SExpr;
use lykn_lang::diagnostics::{Diagnostic, Severity};
use lykn_lang::reader::source_loc::Span;

use super::{LintContext, LintRule};

/// If `node` is a call form `(head args…)` with an **atom** head, return the
/// head text, its args, and its span.
fn atom_call(node: &SExpr) -> Option<(&str, &[SExpr], Span)> {
    if let SExpr::List { values, .. } = node
        && let Some(SExpr::Atom { value, span }) = values.first()
    {
        return Some((value.as_str(), &values[1..], *span));
    }
    None
}

/// no-require (guide ID-33, **error**): `(require …)` compiles to a CommonJS
/// `require(...)` call that fails at runtime in the ESM/Deno output.
pub struct NoRequire;
impl LintRule for NoRequire {
    fn id(&self) -> &'static str {
        "no-require"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, _args, span)) = atom_call(node)
            && head == "require"
        {
            out.push(Diagnostic {
                severity: Severity::Error,
                message: "`require` compiles to a CommonJS call that fails in the ESM output"
                    .to_string(),
                span,
                suggestion: Some(
                    "use `(import \"module\" (names))` for ES-module imports".to_string(),
                ),
            });
        }
    }
}

/// sort-without-comparator (guide ID-17, warn): `(xs:sort)` with no comparator
/// sorts by string order and mutates in place.
pub struct SortWithoutComparator;
impl LintRule for SortWithoutComparator {
    fn id(&self) -> &'static str {
        "sort-without-comparator"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, span)) = atom_call(node)
            // a method call `(receiver:sort)` — the colon is part of the atom
            // (DD-01) — with no comparator argument.
            && head.ends_with(":sort")
            && args.is_empty()
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`sort` with no comparator sorts by string order and mutates in place"
                    .to_string(),
                span,
                suggestion: Some(
                    "pass a comparator, e.g. `(xs:sort (fn (:number a :number b) (- a b)))`, \
                     or use `:toSorted` for a non-mutating sort"
                        .to_string(),
                ),
            });
        }
    }
}

/// parseint-radix (guide ID-5, warn): `(parseInt s)` without a radix is
/// error-prone (leading-zero / hex surprises).
pub struct ParseintRadix;
impl LintRule for ParseintRadix {
    fn id(&self) -> &'static str {
        "parseint-radix"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, span)) = atom_call(node)
            && head == "parseInt"
            && args.len() == 1
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`parseInt` without an explicit radix is error-prone".to_string(),
                span,
                suggestion: Some("pass a radix, e.g. `(parseInt s 10)`".to_string()),
            });
        }
    }
}
