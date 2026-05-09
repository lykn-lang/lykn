# Implementation Plan: DD-50 Position-Aware Compilation of Conditional and Block Forms

## Context

DD-50 (`docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`) fixes V-04 and V-05: `if` forms in expression position (bind initializers, function return values) currently emit invalid JS `if`-statements. The fix makes `if` position-aware — ternary in expression position, if-statement in statement position, IIFE when branches contain statements. Also adds `do` blocks with IIFE in expression position.

The change touches **Rust** (~65%) and **JS** (~35%). No Lykn source changes beyond test files.

---

## Phase 1: Rust — Position-Aware `if` Emission

**Primary file:** `crates/lykn-lang/src/emitter/forms.rs`

### Key architectural insight

The Rust compiler already has `ExprContext` (`Statement` / `Value` / `Tail`) threaded via `EmitterContext`. It's already used by `match`/`if-let`/`when-let` for context-aware dispatch. The `if` form flows to `codegen/emit.rs` kernel emitter which has NO context. The fix: intercept `if` in `forms.rs`'s `emit_expr` function when in `Value`/`Tail` context, before it reaches the kernel emitter.

### 1a. Set `ExprContext::Value` in `emit_bind`

**File:** `crates/lykn-lang/src/emitter/forms.rs` line 505-549

Currently `emit_bind` calls `emit_expr(value, ctx, registry)` at line 516 without setting the context to `Value`. The context is inherited (likely `Statement`). Fix:

```rust
fn emit_bind(...) -> Vec<SExpr> {
    let saved_ctx = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    let const_form = list(vec![
        atom("const"),
        name.clone(),
        emit_expr(value, ctx, registry),
    ]);
    ctx.expr_context = saved_ctx;
    // ... rest unchanged
}
```

### 1b. Intercept `if` in `emit_expr` when in expression position

**File:** `crates/lykn-lang/src/emitter/forms.rs` around line 347 (the `is_surface_form` check)

In the else branch (line 374: "Not a surface form — recursively process all subexpressions"), add a check BEFORE the generic recursive processing:

```rust
} else if head_name == "if"
    && matches!(ctx.expr_context, ExprContext::Value | ExprContext::Tail)
{
    // DD-50: if in expression position → position-aware emission
    emit_if_expression(&values[1..], ctx, registry)
} else {
    // Not a surface form — recursively process all subexpressions
    // ... existing code
}
```

### 1c. Implement `emit_if_expression`

New function in `forms.rs`:

- **Rule 2 (no-else compile error):** If `args.len() < 3` in expression position, emit a throw form as compile-time error marker.
- **Pure-expression branches → ternary:** Emit `(? cond then else)` kernel form (which the existing `emit_ternary` in `codegen/emit.rs` handles correctly with precedence).
- **Statement-form branches → IIFE:** Build `(() => { if (cond) { return then } else { return else } })()`.

Branch classification: after recursively emitting each branch via `emit_expr`, check if the result is a kernel statement form (head is `"if"`, `"while"`, `"throw"`, `"return"`, `"break"`, `"continue"`, `"block"`, `"for"`, etc.). If yes → IIFE. If no → ternary.

**The "compile-then-check" approach:** Nested `do` blocks or `if` forms in branches compile FIRST (producing IIFEs or ternaries), THEN the outer `if` classifies the already-compiled result. A nested `do` that compiled to an IIFE (a `CallExpression` / kernel call form) is NOT a statement form — so the outer `if` can still use ternary.

### 1d. Implement `emit_if_iife` helper

Builds the IIFE kernel form: `((() => { if (cond) { (block (return then)) } else { (block (return else)) } })())`. Follow the pattern from `emit_match_iife` at line 1752.

### 1e. Verify other expression-position sites

Ensure `ExprContext::Value` is set before `emit_expr` in:
- Function-call arguments (line ~647 `emit_function_call`)
- Object values in `emit_obj`
- Array elements
- Thread macro intermediate values
- `cell` value, `reset!` value, `swap!` function arg

The existing line-354 mechanism sets `Value` for nested surface forms. For nested kernel forms (like `if`), the interception at 1b handles it directly regardless of how the parent set the context — as long as `emit_bind` (1a) and func-body-last-expr set `Value`/`Tail`.

### 1f. Unit tests

Add to `forms.rs` test module:
- `test_if_in_bind_emits_ternary`: `(bind x (if (> n 0) "big" "small"))` → kernel output contains `(? ...)`
- `test_if_nested_emits_nested_ternary`: V-04 shape → nested `(?` forms
- `test_if_no_else_in_expression_emits_error`: `(bind x (if cond val))` → contains `throw`
- `test_if_in_statement_unchanged`: top-level `(if cond (f))` → still `(if ...)`
- `test_if_with_throw_branch_emits_iife`: `(bind x (if cond a (throw err)))` → IIFE shape

---

## Phase 2: Rust — `do` Block Form

### 2a. Add `do` to surface form vocabulary

**Files to modify:**
- `crates/lykn-lang/src/classifier/dispatch.rs` — add `"do"` to `is_surface_form` match
- `crates/lykn-lang/src/classifier/forms.rs` — add classification case for `"do"` → `SurfaceForm::Do`
- `crates/lykn-lang/src/ast/surface.rs` — add `Do { body: Vec<SExpr>, span: Span }` variant

### 2b. Emit `do` in `forms.rs`

Add to `emit_form` match:
```rust
SurfaceForm::Do { body, .. } => vec![emit_do(body, ctx, registry)],
```

Implement `emit_do`:
- **Statement position:** emit `(block stmt1 stmt2 ... final)` — value discarded
- **Expression position (Value/Tail):** IIFE-wrap — emit all but last as statements, last as `(return final)` inside an arrow-function body

### 2c. Unit tests for `do`

- `test_do_in_expression_emits_iife`
- `test_do_in_statement_emits_block`
- `test_do_empty_body`

---

## Phase 3: JS Compiler — Position-Aware `if`

**File:** `packages/lang/compiler.js`

### 3a. Add position parameter to `compileExpr`

Change signature from `compileExpr(node)` to `compileExpr(node, position = 'statement')`.

### 3b. Pass `'expression'` from expression-position call sites

Key sites:
- `const`/`let`/`var` initializer (inside the declaration macro handler)
- Arrow/function body last expression
- Function-call arguments
- Assignment RHS
- Array elements, object values
- Ternary operands (already expression)
- Binary/unary operands

### 3c. Update `if` handler to be position-aware

The macro handlers receive `(args, position)`. The `if` handler:
- If `position === 'expression'` and no else → `throw new Error('if in expression position requires an else branch')`
- If `position === 'expression'` and both branches compile to expression nodes → `{ type: 'ConditionalExpression', ... }`
- If `position === 'expression'` and branches are statement nodes → IIFE wrap
- If `position === 'statement'` → existing `IfStatement` logic

### 3d. Add helpers

- `isExpressionNode(node)`: returns `true` if node type doesn't end in `Statement` or `Declaration`
- `buildIfIIFE(test, consequent, alternate)`: builds `CallExpression` wrapping `ArrowFunctionExpression` with `IfStatement` + `ReturnStatement` body

### 3e. Add `do` handler

- If `position === 'expression'` → IIFE (arrow body: all but last as statements, last as ReturnStatement)
- If `position === 'statement'` → `BlockStatement`

---

## Phase 4: Integration Testing

### 4a. Lykn surface tests (`test/forms/dd-50_test.lykn`)

Using `test-compiles` and `includes` assertions:
- V-05 regression: `(bind size (if (> n 0) "big" "small"))` → `const size = n > 0 ? "big" : "small"`
- V-04 regression: nested if as func body → nested ternary
- Statement-position if unchanged
- No-else in expression → compile error
- `do` in expression → IIFE
- `match`/`if-let`/`when-let` regression (unchanged)

### 4b. JS unit tests (`test/forms/dd-50.test.js`)

Mirror Rust tests for cross-compiler convergence.

### 4c. V-04/V-05 capture refresh

Re-capture `workbench/verify/m6/v04-*` and `v05-*` outputs post-fix.

---

## Phase 5: Final Verification

```sh
make lint     # clippy, cargo fmt, lykn syntax
make test     # all suites green
```

Confirm V-04 and V-05 produce valid JS in both compilers.

---

## Critical Files

| File | Phase | Change type |
|------|-------|------------|
| `crates/lykn-lang/src/emitter/forms.rs` | 1, 2 | Intercept `if` in expression context; add `do` emission |
| `crates/lykn-lang/src/emitter/context.rs` | — | Reference only (ExprContext enum) |
| `crates/lykn-lang/src/classifier/dispatch.rs` | 2 | Add `"do"` to surface form list |
| `crates/lykn-lang/src/classifier/forms.rs` | 2 | Add `"do"` classification |
| `crates/lykn-lang/src/ast/surface.rs` | 2 | Add `SurfaceForm::Do` variant |
| `packages/lang/compiler.js` | 3 | Position parameter + `if`/`do` handlers |
| `test/forms/dd-50_test.lykn` | 4 | End-to-end tests |
| `test/forms/dd-50.test.js` | 4 | JS unit tests |

## Sequencing

```
Phase 1 (Rust if) ──→ Phase 2 (Rust do) ──→ Phase 5 (verify)
Phase 3 (JS if)   ──→ Phase 4 (JS do)   ──↗
```

Phases 1+2 (Rust) and Phases 3+4 (JS) are independent and can be developed in parallel.

## Key Rust Quality Checks

- Use existing `ExprContext` enum — don't invent new types
- Follow `emit_match_iife` pattern for IIFE construction
- `#[cfg(test)]` module with descriptive test names
- `cargo clippy -- -D warnings` clean
- `cargo fmt` clean
- Save/restore `ctx.expr_context` around context changes (existing pattern at line 354-372)

## Key JS Quality Checks

- Default parameter `position = 'statement'` preserves backward compat for existing call sites
- `===` for all position comparisons
- Named `function` for helpers (`isExpressionNode`, `buildIfIIFE`)
- No `var`, no `==`
