# arc15 · slice05 — Nested `fn` Parameter Validation

> **Open set** (2026-08-08, CDC). Close the `D-2608-H7FN` fast-follow surfaced
> by slice04: Rust must reject nested bare-parameter `fn` forms at compile time
> instead of letting them fall through to bad JavaScript.

## 1. Goal

Make Rust match the JS compiler's language-safety surface for nested `fn` forms:

- `(fn (x) x)` is a compile-time typed-parameter error wherever it appears.
- Valid typed `fn`, `lambda`, and `genfn` forms still compile.
- Lexically bound heads named `fn` remain ordinary calls, per DD-61 dispatch
  tagging.

## 2. Scope

### In

- Add a Rust recursive validation pass for nested `fn`-family parameter shapes
  before emission can fall back to raw S-expressions.
- Wire the pass into both `lykn compile` and `lykn check`, in the same resolved
  pre-classification pipeline slot as the arc15 method-call validator.
- Add Rust tests for direct compile rejection, nested compile rejection, and
  bound-head non-rejection.
- Add a JS test pinning the already-correct rejection so parity cannot drift.
- Close `D-2608-H7FN` and update arc/project/status planning text.

### Out

- Reworking `emit_expr` to return `Result` for all nested classifier failures.
  That is the more general architecture fix, but it is larger than this
  fast-follow.
- The deferred slice03 Option C fully-typed classifier rewrite.
- Changing the syntax rule that `fn` parameters are typed.

## 3. Verification Approach

- Reproduce the pre-fix mismatch with JS `lykn()` and Rust CLI output.
- Unit-test the new Rust validator and CLI pipeline behavior.
- Add a focused Deno test for JS rejection.
- Run `make lint`, `make test`, `make check-cited-paths` before commit
  expecting only new-doc-at-HEAD failures, then `make check` after commit.

## 4. Exit Criteria

1. Rust rejects `(bind f (fn (x) x))` before JS code is emitted.
2. Rust rejects the same bare-parameter `fn` when nested inside another form.
3. A local binding named `fn` can still be called as a value.
4. JS has a regression test for the existing rejection.
5. Discovery/planning docs no longer list `D-2608-H7FN` as open.
6. Full gate is green after the commit.
