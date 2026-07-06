//! Lint rules (DD-59). The shape tier of the guide's anti-patterns: pure
//! SExpr pattern matches over what the user *wrote* (pre-expansion). Each
//! rule's Guide-09 ID is in its doc. Three pilots (slice01) — `no-require`,
//! `sort-without-comparator`, `parseint-radix` — plus the 12 slice02 rules
//! (10 tier-1 shape rules + 2 path-scoped conventions rules), sourced from
//! slice01's compiler-verified F-1 table (not DD-59's superseded list).

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

/// A literal datum — a string, number, boolean, or null. Used by
/// `or-for-defaults` to spot `(or expr <literal>)` default patterns.
fn is_literal(node: &SExpr) -> bool {
    matches!(
        node,
        SExpr::String { .. } | SExpr::Number { .. } | SExpr::Bool { .. } | SExpr::Null { .. }
    )
}

/// True for this repo's test-source files (`*_test.lykn` / `*.test.lykn`, and
/// the `.lyk` variants). The two conventions rules are path-scoped to these —
/// relative imports and `import.meta`-anchored fixtures only dangle when a test
/// compiles into `target/` (arc11), so the rules are noise elsewhere.
fn is_test_file(path: &str) -> bool {
    let base = path.rsplit(['/', '\\']).next().unwrap_or(path);
    base.ends_with("_test.lykn")
        || base.ends_with(".test.lykn")
        || base.ends_with("_test.lyk")
        || base.ends_with(".test.lyk")
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

// ---------------------------------------------------------------------------
// slice02 — the shape tier (10 tier-1 rules)
// ---------------------------------------------------------------------------

/// no-eval (guide ID-31, **error**): `(eval …)` / `(js:eval …)` execute
/// arbitrary code — a security hole and an optimization barrier.
pub struct NoEval;
impl LintRule for NoEval {
    fn id(&self) -> &'static str {
        "no-eval"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, _args, span)) = atom_call(node)
            && (head == "eval" || head == "js:eval")
        {
            out.push(Diagnostic {
                severity: Severity::Error,
                message: format!("`{head}` executes arbitrary code (security + deopt risk)"),
                span,
                suggestion: Some(
                    "remove it; use `obj:key` indexing or `JSON:parse` for the real intent"
                        .to_string(),
                ),
            });
        }
    }
}

/// no-new-wrappers (guide ID-06, warn): `(new String|Number|Boolean …)` boxes a
/// primitive into an object wrapper — `new Boolean(false)` is truthy.
pub struct NoNewWrappers;
impl LintRule for NoNewWrappers {
    fn id(&self) -> &'static str {
        "no-new-wrappers"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, _span)) = atom_call(node)
            && head == "new"
            && let Some(SExpr::Atom { value: ctor, span }) = args.first()
            && matches!(ctor.as_str(), "String" | "Number" | "Boolean")
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: format!("`new {ctor}` creates an object wrapper, not a primitive"),
                span: *span,
                suggestion: Some(format!(
                    "call `{ctor}` without `new` to convert, e.g. `({ctor} x)`"
                )),
            });
        }
    }
}

/// global-isnan (guide ID-04, warn): the global `isNaN` coerces its argument;
/// `Number:isNaN` does not.
pub struct GlobalIsnan;
impl LintRule for GlobalIsnan {
    fn id(&self) -> &'static str {
        "global-isnan"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, _args, span)) = atom_call(node)
            && head == "isNaN"
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "global `isNaN` coerces its argument before testing".to_string(),
                span,
                suggestion: Some("use `Number:isNaN`, which never coerces".to_string()),
            });
        }
    }
}

/// no-arguments (guide ID-30, warn): the `arguments` object doesn't exist in
/// lykn's surface model — use a `(rest …)` parameter.
pub struct NoArguments;
impl LintRule for NoArguments {
    fn id(&self) -> &'static str {
        "no-arguments"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let SExpr::Atom { value, span } = node
            && value == "arguments"
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`arguments` is a legacy object with no place in surface lykn".to_string(),
                span: *span,
                suggestion: Some("declare a `(rest …)` parameter and use it by name".to_string()),
            });
        }
    }
}

/// no-iife (guide ID-32, warn): an immediately-invoked function `((fn …) …)`
/// adds a scope ESM modules already provide.
pub struct NoIife;
impl LintRule for NoIife {
    fn id(&self) -> &'static str {
        "no-iife"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        // a call whose *head* is itself a function-literal form.
        if let SExpr::List { values, span } = node
            && let Some(head_list) = values.first()
            && let Some((inner_head, _, _)) = atom_call(head_list)
            && matches!(inner_head, "fn" | "lambda" | "genfn")
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "IIFE adds no isolation — ESM modules are already scoped".to_string(),
                span: *span,
                suggestion: Some(
                    "hoist the body to module scope, or name it with `bind`/`func`".to_string(),
                ),
            });
        }
    }
}

/// no-delete-on-array (guide ID-34, warn): `(delete arr <index>)` leaves a hole
/// rather than shrinking the array.
pub struct NoDeleteOnArray;
impl LintRule for NoDeleteOnArray {
    fn id(&self) -> &'static str {
        "no-delete-on-array"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, span)) = atom_call(node)
            && head == "delete"
            && args.len() == 2
            && matches!(args[1], SExpr::Number { .. })
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`delete` on an array index leaves a hole, not a shorter array"
                    .to_string(),
                span,
                suggestion: Some(
                    "use `(arr:toSpliced i 1)` (non-destructive) or `(arr:splice i 1)`".to_string(),
                ),
            });
        }
    }
}

/// no-json-deep-copy (guide ID-35, warn): `(JSON:parse (JSON:stringify x))`
/// silently drops `undefined`, functions, and symbols.
pub struct NoJsonDeepCopy;
impl LintRule for NoJsonDeepCopy {
    fn id(&self) -> &'static str {
        "no-json-deep-copy"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, span)) = atom_call(node)
            && head == "JSON:parse"
            && let Some(inner) = args.first()
            && let Some((inner_head, _, _)) = atom_call(inner)
            && inner_head == "JSON:stringify"
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "JSON round-trip deep-copy drops undefined, functions, and symbols"
                    .to_string(),
                span,
                suggestion: Some("use `(structuredClone x)` for a faithful deep copy".to_string()),
            });
        }
    }
}

/// prefer-surface-operators (guide ID-38, warn): kernel operators compile fine
/// but the surface spellings (`=`/`!=`/`and`/`or`) read better and analyze
/// better. `==`/`!=` also carry a loose-vs-strict caveat (see the suggestion).
pub struct PreferSurfaceOperators;
impl PreferSurfaceOperators {
    /// The surface spelling for a kernel operator head, plus an optional caveat.
    ///
    /// `!=` is **not** here: it already *is* the surface spelling — `(!= a b)`
    /// compiles to `a !== b`, identical to `(!== a b)`. (The slice-doc contract
    /// mistakenly listed `!=`; the dogfood measurement corrected it — flagging
    /// `!=` produced a self-referential "spell `!=` as `!=`" message.)
    fn surface_for(head: &str) -> Option<(&'static str, Option<&'static str>)> {
        match head {
            "===" => Some(("=", None)),
            "!==" => Some(("!=", None)),
            "&&" => Some(("and", None)),
            "||" => Some(("or", None)),
            // `==` is loose; the surface `=` is strict — flag, but warn that the
            // rewrite changes semantics (and `== null` belongs in `js:eq`).
            "==" => Some((
                "=",
                Some("(surface `=` is strict; for `== null` use `(js:eq x null)`)"),
            )),
            _ => None,
        }
    }
}
impl LintRule for PreferSurfaceOperators {
    fn id(&self) -> &'static str {
        "prefer-surface-operators"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, _args, span)) = atom_call(node)
            && let Some((surface, caveat)) = Self::surface_for(head)
        {
            let suggestion = match caveat {
                Some(c) => format!("prefer `{surface}` {c}"),
                None => format!("prefer the surface spelling `{surface}`"),
            };
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: format!(
                    "`{head}` is a kernel operator; surface lykn spells it `{surface}`"
                ),
                span,
                suggestion: Some(suggestion),
            });
        }
    }
}

/// or-for-defaults (guide ID-03, **severity measured** — see the F-2 table):
/// `(or expr <literal>)` swallows `0`, `""`, and `false` as if they were
/// absent. Severity set to warn pending the measurement in slice02's report.
pub struct OrForDefaults;
impl LintRule for OrForDefaults {
    fn id(&self) -> &'static str {
        "or-for-defaults"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if let Some((head, args, span)) = atom_call(node)
            && head == "or"
            && args.len() == 2
            && is_literal(&args[1])
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`or` for a default swallows `0`, `\"\"`, and `false`".to_string(),
                span,
                suggestion: Some(
                    "use `??`-style nullish defaulting, e.g. `(js:eq x null)` guard or `(?? x d)`"
                        .to_string(),
                ),
            });
        }
    }
}

/// for-in-on-arrays (guide ID-29, warn): `for-in` iterates string keys,
/// including inherited ones. **Conservative** (v1): only an array *literal*
/// iterable (`#a(…)` → `(array …)`) is flagged — prefer misses over false
/// positives on ambiguous bindings.
pub struct ForInOnArrays;
impl LintRule for ForInOnArrays {
    fn id(&self) -> &'static str {
        "for-in-on-arrays"
    }
    fn enter(&mut self, node: &SExpr, _ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        // (for-in <binding> <iterable> body…) — iterable is values[2].
        if let Some((head, args, span)) = atom_call(node)
            && head == "for-in"
            && let Some(iterable) = args.get(1)
            && let Some((iter_head, _, _)) = atom_call(iterable)
            && iter_head == "array"
        {
            out.push(Diagnostic {
                severity: Severity::Warning,
                message: "`for-in` over an array iterates keys (incl. inherited), not values"
                    .to_string(),
                span,
                suggestion: Some(
                    "use `(for-of v arr …)`, or `(for-of (array i v) (arr:entries) …)` for indices"
                        .to_string(),
                ),
            });
        }
    }
}

// ---------------------------------------------------------------------------
// slice02 — conventions rules (path-scoped to this repo's test files)
// ---------------------------------------------------------------------------

/// no-relative-source-imports (arc11 convention, **error**): a test that
/// imports the repo via a relative path breaks when it compiles into
/// `target/`. Use bare import-map specifiers. Path-scoped to test files.
pub struct NoRelativeSourceImports;
impl LintRule for NoRelativeSourceImports {
    fn id(&self) -> &'static str {
        "no-relative-source-imports"
    }
    fn enter(&mut self, node: &SExpr, ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if !is_test_file(ctx.file) {
            return;
        }
        if let Some((head, args, _span)) = atom_call(node)
            && head == "import"
            && let Some(SExpr::String { value: path, span }) = args.first()
            && (path.starts_with("./") || path.starts_with("../"))
        {
            out.push(Diagnostic {
                severity: Severity::Error,
                message: format!(
                    "relative import `{path}` dangles when the test compiles into `target/`"
                ),
                span: *span,
                suggestion: Some(
                    "use a bare import-map specifier, e.g. `\"lang/compiler.js\"`".to_string(),
                ),
            });
        }
    }
}

/// no-dirname-fixtures (arc11 convention, **error**): `import.meta:dirname`
/// encodes the test's compile location, which changes under `target/`. Anchor
/// fixture paths at `(Deno:cwd)`. Path-scoped to test files.
pub struct NoDirnameFixtures;
impl LintRule for NoDirnameFixtures {
    fn id(&self) -> &'static str {
        "no-dirname-fixtures"
    }
    fn enter(&mut self, node: &SExpr, ctx: &LintContext, out: &mut Vec<Diagnostic>) {
        if !is_test_file(ctx.file) {
            return;
        }
        if let SExpr::Atom { value, span } = node
            && (value == "import.meta:dirname" || value == "import:meta:dirname")
        {
            out.push(Diagnostic {
                severity: Severity::Error,
                message: format!("`{value}` encodes the source location; it dangles under `target/`"),
                span: *span,
                suggestion: Some(
                    "anchor fixtures at project root, e.g. `(resolve (Deno:cwd) \"test/fixtures\")`"
                        .to_string(),
                ),
            });
        }
    }
}
