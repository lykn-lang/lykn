# Kernel Profile Audit — M16-4

**Date:** 2026-05-15
**Pattern doc:** `docs/dev/0024-if-profile-audit-pattern-for-special-case-intercepts.md`
**Scope:** All kernel forms with special-case context intercepts in
`crates/lykn-lang/src/emitter/forms.rs` `emit_expr` function.

## Intercept Inventory

Searched via: `grep -nE 'head_name == "' crates/lykn-lang/src/emitter/forms.rs`

| Form | Line | Intercept Condition | Non-intercepted Path | Profile Audit |
|------|------|---------------------|----------------------|---------------|
| `assign` | 328 | Always (class body check) | N/A — emits directly, never falls through to kernel profile | **n/a** — no profile dispatch on any path |
| `class` / `class-expr` | 349-350 | Always (routed to surface form dispatch) | N/A — always enters surface form classifier | **n/a** — surface form dispatch, not kernel profile |
| `if` | 375 | `ExprContext::Value \| ExprContext::Tail` | `ExprContext::Statement` — falls through to kernel profile | **audited** — see below |

### `if` Profile Audit

- **Intercepted path:** Value/Tail context → `emit_if_expression` (DD-50).
  Produces ternary or IIFE. Profile not consulted.
- **Non-intercepted path:** Statement context → `kernel_child_profile("if")`.
- **Current profile:** `Positional(&[V, S, S])` (condition=Value, then=Statement, else=Statement).
- **Correctness check:** In Statement context, `if` emits a JS `IfStatement`.
  The condition is always a value expression (V correct). The then-branch
  and else-branch are statement positions in JS (S correct).
- **Profile fixed in:** DD-50.7 (was `AllValue`, corrected to `Positional(&[V, S, S])`,
  commit on cdc/dep-ergonomics branch, merged into release/0.6.x).
- **Test reference:** `test/forms/dd-50_test.lykn` — DD-50.7 regression tests
  exercise `if` in Statement context with nested statement-bearing forms
  (for-of, bind, console.log).

**Result:** All three intercepted forms audited. Only `if` reaches the
kernel profile on a non-intercepted path; its profile is correct.
