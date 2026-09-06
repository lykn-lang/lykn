# CC Prompt: arc10 slice04 -- no-else-if-expression-error

You are CC implementing slice04 in:

`docs/design-v0.6.0/arc10-compiler-completion/slice04-no-else-if-expression-error/`

Branch/worktree:

- Work in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
- Branch: `release/0.6.x`

## Goal

Fix `D-2608-W2HF`: a no-else `if` in expression position must fail during
`lykn check` and `lykn compile`, before any invalid JavaScript such as
`const label = throw ...` can be emitted.

Current defect fixture:

```lykn
(bind label (if (> 1 0) "items"))
```

Expected behavior after the slice:

- `./bin/lykn check <fixture>` exits non-zero with the DD-50 diagnostic.
- `./bin/lykn compile <fixture>` exits non-zero with the same diagnostic.
- Statement-position no-else `if` remains valid.
- Expression-position `if` with an `else` remains valid.

## Scope

In scope:

- Reproduce the defect on the current branch and record the transcript in the
  closing report.
- Fix the Rust CLI/check/compile path. The JS compiler already throws the
  intended DD-50 error; preserve that parity.
- Add focused regression coverage at the Rust validator/CLI level and keep the
  existing DD-50 JS and corpus tests green.
- Update the slice ledger evidence, add `closing-report.md`, and bubble the
  outcome up to `arc-plan.md` / project status surfaces.

Out of scope:

- Redesigning DD-50 position-aware `if` semantics.
- Broad docs/book rewrites.
- `.d.ts` documentation work.
- Changing the JS compiler semantics unless a parity test proves an actual
  divergence.

## Implementation Hint

Follow the local arc15 pattern in `crates/lykn-lang/src/classifier/forms.rs`:
add a recursive structural validator over resolved `SExpr`s, export it through
`crates/lykn-lang/src/classifier/mod.rs`, and call it from the same
pre-analysis/pre-codegen points in `crates/lykn-cli/src/compile.rs` that already
call `validate_method_calls` and `validate_nested_fn_params`.

The validator should be context-aware:

- `bind` values, function call arguments, return/throw arguments, object values,
  ternary operands, loop tests, and assignment RHS are value contexts.
- statement bodies in forms such as `if`, `while`, `for`, `block`, `try`,
  `switch` case bodies, and function bodies are statement contexts.
- a raw `if` in value context with fewer than three arguments is an error.

Use the existing diagnostic text:

`if in expression position requires an else branch`

## Required Verification

Run and record:

```sh
cargo fmt --check
cargo test -p lykn-lang
cargo test -p lykn-cli
deno test --config project.json -A test/forms/dd-50.test.js test/forms/dd-50.7.test.js
./bin/lykn check <negative fixture>
./bin/lykn compile <negative fixture>
./bin/lykn check <positive statement fixture>
./bin/lykn compile <positive expression fixture>
make test-docs
make check-cited-paths
git diff --check
```

`make check-cited-paths` may be expected-red before commit if the closing report
is newly cited by tracked docs. It must be green after the commit.

## Close Requirements

- Update every ledger row to `done`, `deferred`, or `no-op` with evidence.
- Add `closing-report.md` with a row-by-row walk, verification transcript, and
  bubble-up to arc10.
- Update arc10 A-9/A-10 and project/status surfaces if the slice lands.
- Commit with the repository footer convention:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
