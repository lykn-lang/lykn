# Value-Override Audit — M16-5

**Date:** 2026-05-15
**Pre-refactor commit:** eb9ad35

## The Problem

Line 356 of `emitter/forms.rs` sets `ctx.expr_context = ExprContext::Value`
as a blanket override for all surface form dispatch. This was correct for
the original design (surface forms nested inside expressions produce values),
but it means any surface form whose body emits a statement sequence must
manually save/restore the context to Statement.

DD-50.7 added 9 such save/restore workarounds. The refactor removes the
blanket override and has each emitter set its own child context.

## Per-Emitter Audit

All 9 sites use the identical save/restore pattern:
```rust
let saved_body_ctx = ctx.expr_context;
ctx.expr_context = ExprContext::Statement;
// ... emit body ...
ctx.expr_context = saved_body_ctx;
```

| Emitter | Line | Required Body Context | Reason |
|---------|------|----------------------|--------|
| `emit_fn_expr` | 1254 | Statement | Arrow fn body is a block of statements |
| `emit_func_single` | 1319 | Statement | Function body is a block of statements |
| `emit_func_multi` | 1539 | Statement | Multi-clause function body is statements |
| `emit_genfunc_single` | 1715 | Statement | Generator function body is statements |
| `emit_genfn_expr` | 1760 | Statement | Generator arrow body is statements |
| `emit_match_statement` | 1881 | Statement | Match branch bodies are statements |
| `emit_match_iife` | 1969 | Statement | IIFE-wrapped match branch bodies are statements |
| `emit_when_let_statement` | 2284 | Statement | When-let body is a statement sequence |
| `emit_when_let_iife` | 2334 | Statement | IIFE-wrapped when-let body is statements |

All 9 require Statement. No emitter requires Value for its body children.

## Refactor Plan

1. **Remove** the blanket `ctx.expr_context = ExprContext::Value` at line 356.
2. **Keep** each per-emitter Statement override — they are now the *only*
   context-setting mechanism for their bodies (no longer workarounds).
3. The save/restore pattern at each site is still needed because the
   emitter may be called from a Value context (e.g., a `func` inside a
   `bind` initializer), and the body needs Statement regardless.
4. Other surface forms that DO need Value context (e.g., arithmetic,
   comparison operators, `obj`, `assoc`) don't need explicit context
   setting because their children are subexpressions that naturally
   inherit the enclosing context or produce values regardless.

## Pre-Refactor Test State

- `./bin/lykn test test/forms/dd-50_test.lykn`: 34 passed, 0 failed
- `make test-lykn`: 292 passed, 0 failed
- `./bin/lykn test test/forms/`: 666 passed, 0 failed
