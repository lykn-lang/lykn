# Implementation Plan: DD-50 Position-Aware Compilation

**... of Conditional and Block Forms**

## Context

DD-50 (`docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`) fixes V-04 and V-05: `if` forms in expression position (bind initializers, function return values) currently emit invalid JS `if`-statements. The fix makes `if` position-aware — ternary in expression position, if-statement in statement position, IIFE when branches contain statements. Also adds `do` blocks with IIFE in expression position.

The change touches **Rust** (~65%) and **JS** (~35%). No Lykn source changes beyond test files.

---

## Phase 1: Rust — Position-Aware `if` Emission

**Primary file:** `crates/lykn-lang/src/emitter/forms.rs`

### Key architectural insight

The Rust compiler already has `ExprContext` (`Statement` / `Value` / `Tail`) defined in `crates/lykn-lang/src/emitter/context.rs:5-12` and threaded via `EmitterContext`. It's already used by `match`/`if-let`/`when-let` for context-aware dispatch. The `if` form flows to `codegen/emit.rs` kernel emitter which has NO context. The fix: intercept `if` in `forms.rs`'s `emit_expr` function when in `Value`/`Tail` context, before it reaches the kernel emitter.

The existing line 354-355 pattern (save/set/restore `ctx.expr_context = ExprContext::Value` for nested surface forms) is the template for context save/restore — follow it everywhere we change context, including in `emit_bind` (1a).

**Useful starting-point evidence:** M6's CDC review (`workbench/M6-cdc-review-2026-05-02.md`) noted that the Rust compiler already emits ternary for the `js:eq` path in V-04. Locate that branch (grep `js:eq` in `forms.rs` and `codegen/emit.rs`) and study what triggers it — the existing single-case ternary is a useful breadcrumb but is NOT the framework being completed; the position-tracking infrastructure built here is new.

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

- **Rule 2 (no-else compile error):** If `args.len() < 3` in expression position, the DD-50 spec requires a true compile-time error. The cleanest architectural fit is a new analysis pass (e.g., `analysis/if_check.rs` modelled on `analysis/match_check.rs`) that runs before emit and reports the diagnostic via the existing `Diagnostic` channel — same shape as DD-49's collision detection in `analysis/scope.rs`. **However**, if scoping that pass into this milestone is too large, an MVP fallback is acceptable: emit a kernel `(throw (new TypeError "COMPILE_ERROR: if in expression position requires an else branch — add an else branch, or restructure as a statement"))` form that fires at runtime if the path executes. Mark this as a temporary stand-in with a TODO comment referencing this DD; the analysis-pass replacement is then a fast-follow item logged in the closing report. **Do not silently spec-soften** — pick one (analysis pass or runtime stand-in) and document the choice in the implementation commit.
- **Pure-expression branches → ternary:** Emit `(? cond then else)` kernel form (which the existing `emit_ternary` in `codegen/emit.rs` handles correctly with precedence).
- **Statement-form branches → IIFE:** Build `(() => { if (cond) { return then } else { return else } })()`.

Branch classification: after recursively emitting each branch via `emit_expr`, check if the result is a kernel statement form. The full statement-form list to check (head atom value):

```
"if", "while", "for", "for-of", "for-in", "do-while", "switch",
"throw", "return", "break", "continue", "label", "debugger",
"block", "try", "catch", "finally",
"var", "const", "let",
"func", "fn", "class", "type", "export", "import",
```

If the head matches any of these → IIFE. If it doesn't → ternary. Maintain this list as a `const STATEMENT_FORM_HEADS: &[&str]` near the top of `forms.rs` so it's auditable; CC adds new entries when new statement-emitting kernel forms are introduced.

**The "compile-then-check" approach:** Nested `do` blocks or `if` forms in branches compile FIRST (producing IIFEs or ternaries), THEN the outer `if` classifies the already-compiled result. A nested `do` that compiled to an IIFE (a `CallExpression` / kernel call form) is NOT a statement form — so the outer `if` can still use ternary.

### 1d. Implement `emit_if_iife` helper

Builds the IIFE kernel form: `((() => { if (cond) { (block (return then)) } else { (block (return else)) } })())`. Follow the pattern from `emit_match_iife` at line 1752.

### 1e. Audit and update other expression-position sites

Every expression-position emit site MUST set `ExprContext::Value` (or `::Tail` for the last expression of a function body with `:returns`) before calling `emit_expr`. **Any site that misses this perpetuates V-04/V-05 at that site**, since `if` will not be intercepted in 1b without the right context.

The audit list (CC verifies each, applies the save/set/restore pattern from line 354-355, and records the file:line in the closing report):

| Site | File:Line (approx) | Context to set |
|------|-------------------|----------------|
| `bind` initializer | `forms.rs:516` (covered by 1a) | `Value` |
| `func` / `fn` / `=>` body **last** expression | `forms.rs` `emit_function_body`, `emit_fn`, `emit_arrow` | `Tail` if `:returns`, else `Value` |
| `func` / `fn` / `=>` body **non-last** expressions | same | `Statement` (already; verify) |
| Function-call arguments | `forms.rs` `emit_function_call` (~647) | `Value` |
| Object values | `forms.rs` `emit_obj` | `Value` |
| Array elements | `forms.rs` `emit_array` | `Value` |
| Thread-macro intermediate values | `forms.rs` `emit_thread_first`, `emit_thread_last` | `Value` |
| `cell` initial value, `reset!` value, `swap!` function arg | `forms.rs` cell handlers | `Value` |
| Assignment RHS (`(= lhs rhs)`) | wherever `=` is handled | `Value` |
| Conditional condition (test of `if`/`while`/`for`) | various | `Value` (the value is consumed as a boolean) |

**Verification grep:** after the audit, run

```sh
grep -nE "emit_expr\(.*ctx" crates/lykn-lang/src/emitter/forms.rs
```

and walk every match, confirming the surrounding code sets `expr_context` appropriately. A missing site is the kind of thing that doesn't fail unit tests in isolation but breaks V-04/V-05 at the missed location.

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

**Important context:** `do` is being introduced as a **new** surface form by this DD. It does not exist today (verified: no matches for `"do"` or `SurfaceForm::Do` in `classifier/dispatch.rs`, `classifier/forms.rs`, `ast/surface.rs`, or `packages/lang/compiler.js`). DD-50's spec assumes `do` exists as a sequence-of-expressions form whose value is the value of the final expression — this implementation introduces that form.

**Naming-clash note:** lykn already has `do-while` as a kernel loop form (see `docs/guides/00-lykn-surface-forms.md` line 783). The new `do` form is distinct: `do` is a sequence/block form, `do-while` is a loop. The names share a prefix but are unrelated. Document this distinction in `docs/guides/00-lykn-surface-forms.md` when adding `do`.

**Files to modify:**

- `crates/lykn-lang/src/classifier/dispatch.rs` — add `"do"` to `is_surface_form` match
- `crates/lykn-lang/src/classifier/forms.rs` — add classification case for `"do"` → `SurfaceForm::Do`
- `crates/lykn-lang/src/ast/surface.rs` — add `Do { body: Vec<SExpr>, span: Span }` variant
- `docs/guides/00-lykn-surface-forms.md` — document the new form (distinct from `do-while`)
- `assets/ai/SKILL.md` — naming conventions or surface-form table update if needed

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

**Backward-compat note:** `compileExpr` today produces both expression and statement nodes; existing call sites wrap with `toStatement(compileExpr(e))` to normalise (see `compiler.js:1130` `toStatement` — it passes statement nodes through unchanged and wraps expressions in `ExpressionStatement`). Default `position = 'statement'` preserves this behaviour: existing toStatement-wrapping callers don't need changes (their `if` produces `IfStatement` as today). The new ternary/IIFE behaviour activates ONLY when a caller explicitly passes `'expression'`.

**This is the critical correctness gate:** every call site that consumes an expression value (bind initializer, function arg, etc.) MUST be updated in 3b to pass `'expression'`. **Any site missed perpetuates V-04/V-05 at that site** — the bug is silent (no error, just invalid JS output). Plan a grep audit before declaring complete.

### 3b. Pass `'expression'` from expression-position call sites

The list below MUST be **exhaustive**. Every expression-context call site in `compiler.js` needs the `'expression'` argument. Use this grep as the audit starting point:

```sh
grep -nE "compileExpr\(" packages/lang/compiler.js
```

Expected expression-position sites (CC walks each match and confirms or updates):

- `const` / `let` / `var` initializer (`makeVarDecl` and the macro handlers around `compiler.js:208`)
- Arrow body / `=>` body single-expression branch (`compiler.js:191`)
- `func` / `fn` body last expression (return value of the function)
- Function-call arguments (callsite of `arguments: methodArgs.map(compileExpr)` etc.)
- Assignment RHS (the `=` macro handler around `compiler.js:262`)
- Array elements
- Object property values
- Ternary `?` operands (already expression-typed; verify)
- Binary / unary operands
- `return` argument
- `throw` argument
- `await` argument
- Spread operand
- Template-literal interpolations

Sites that should remain `'statement'` (no change):

- `do` block body non-last expressions (statement context until DD-50's `do` handler intervenes)
- `block` body
- `for` body
- `while` body
- `try`/`catch`/`finally` bodies
- Top-level program statements

**Final verification:** after walking the grep list, recompile a known V-05 case (`(bind size (if (> n 0) "big" "small"))`) and inspect the output. Should be `const size = n > 0 ? "big" : "small";` — if it's still `const size = if (n > 0) "big"; else "small";;`, a call site was missed.

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

Using `test-compiles` and `includes` assertions. Every test case below MUST be present:

**V-04/V-05 regressions:**

- V-05: `(bind size (if (> n 0) "big" "small"))` → `const size = n > 0 ? "big" : "small"`
- V-04 (nested if as func body): `(func classify :args (:any x) :returns :string :body (if (= x null) "null" (if (= (typeof x) "string") "string" "other")))` → nested ternary in the body

**Position-aware behaviour:**

- Statement-position `if` unchanged: `(if cond (console:log "x"))` → `if (cond) { console.log("x"); }`
- Expression-position `if` with both pure-expression branches → ternary
- Expression-position `if` with statement-form branch (`throw`) → IIFE wrap
- Expression-position `if` with `do`-block branch → ternary (because the inner `do` produces an IIFE expression)

**Rule 2 (no-else compile error):**

- `(bind x (if cond val))` triggers the compile-error path (whether analysis-pass or runtime-throw stand-in per 1c). Test asserts on the error/exception message containing `"if in expression position requires an else branch"`.

**`do` in both positions:**

- Statement-position: `(do a b c)` at top level → block of three statements (or whatever the kernel-block shape is)
- Expression-position: `(bind x (do a b c))` → IIFE returning `c`

**Regression — already-IIFE-wrapped forms unchanged:**

These forms must continue producing the exact same output as before DD-50 (they were already expression-valid in any position via IIFE):

- `match` in any position: `(bind x (match v ((Some n) n) (None 0)))` → existing IIFE shape preserved
- `if-let` in any position
- `when-let` in any position

Run the existing test files (`test/surface/match_test.lykn` etc.) as-is to confirm no regression in their output.

**Out of scope:**

- `cond` is not a current lykn surface form (per DD-50 Rule 3) — no test for it. Logged as backlog if `match` proves insufficient.

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
Phase 1 (Rust if)  ─┬─→ Phase 4 (Integration: lykn tests + JS units + capture refresh) ─→ Phase 5 (verify)
Phase 2 (Rust do)  ─┤
Phase 3 (JS if+do) ─┘
```

Phases 1, 2, and 3 are independent and can be developed in parallel — Phase 1 (Rust `if`) and Phase 2 (Rust `do`) on the Rust side; Phase 3 covers both `if` and `do` on the JS side. Phase 4 (integration) depends on **all three** because its `test-compiles` tests run both compilers on the same input. Phase 5 is the final sweep.

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

## Cross-compiler byte-identical convergence

Per the M5 context-aware split: the Rust and JS implementations diverge in mechanism but **must converge in user-visible output** for the same lykn input. Specifically:

- The set of statement-form heads triggering IIFE wrap (Rust's `STATEMENT_FORM_HEADS` constant; JS's `isExpressionNode` predicate) MUST classify the same lykn forms identically.
- The IIFE shape (`(() => { if (cond) return then; else return else; })()`) MUST be byte-identical between compilers.
- The compile-error message text for no-else-in-expression-position MUST be byte-identical.
- The set of expression-position call sites updated in 1e (Rust) and 3b (JS) MUST cover the same conceptual positions, even though the implementations differ.

Phase 4a's `test-compiles`-based tests automatically gate this — they run both compilers on the same input and compare. If an output diverges, that's a bug in one implementation, not a design difference.

## Substrate-rule compliance reminders

- **DD-50 Rule 2 says "compile error" — pick the analysis-pass path or document the runtime-throw stand-in.** Per CLAUDE.md spec-softening discipline, do not silently substitute a runtime throw for a compile error without flagging it. If the runtime-throw stand-in is chosen for MVP, the closing report MUST log "analysis-pass replacement" as a fast-follow.
- **CLAUDE.md "Lykn CLI safety gates":** none of the deliverables require any safety-bypass flags.
- **LEDGER_DISCIPLINE inline-amendment pattern:** if any audit-list entry in 1e or 3b doesn't fit reality (e.g., the file:line is off, or a site doesn't exist), amend inline using the M5/M9 pattern in the closing report — do not silently rewrite.
