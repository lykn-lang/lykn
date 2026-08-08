# Slice 04: no-else-if-expression-error -- Closing Report

**Assembled by:** CDC (Codex Desktop)  
**Date:** 2026-08-08

## 1. Outcome

`D-2608-W2HF` is fixed. A no-else `if` in expression position now fails during
`lykn check` and `lykn compile` before codegen can emit invalid JavaScript.
Statement-position no-else `if` remains valid, and expression-position `if`
with an else branch still compiles normally.

Implementation:

- `crates/lykn-lang/src/classifier/forms.rs` adds
  `validate_no_else_if_expressions`, a context-aware structural validator over
  resolved `SExpr`s.
- `crates/lykn-lang/src/classifier/mod.rs` exports the validator.
- `crates/lykn-cli/src/compile.rs` calls it from the strict check/compile paths.
- Rust tests cover value slots, statement bodies, `switch`, `try`/`catch`/
  `finally`, class member bodies, class field initializers, and CLI check/compile.

## 2. Baseline Reproduction

Fixture:

```lykn
(bind label (if (> 1 0) "items"))
```

Before the fix:

```text
./bin/lykn check /private/tmp/arc10-no-else-negative.lykn
/private/tmp/arc10-no-else-negative.lykn: ok (1 top-level expressions)

./bin/lykn compile /private/tmp/arc10-no-else-negative.lykn
const label = throw new TypeError("COMPILE_ERROR: if in expression position requires an else branch ...");
```

This confirmed the defect: success rc=0 plus invalid JavaScript.

## 3. Row Walk

| Row | Status | Evidence |
|-----|--------|----------|
| N-1 baseline reproduced | done | Baseline `check`/`compile` reproduced the rc=0 invalid-JS behavior before the fix. |
| N-2 Rust check/compile reject value-context no-else `if` | done | `cargo test -p lykn-lang`; `cargo test -p lykn-cli`; negative user fixture fails both commands with the DD-50 diagnostic. |
| N-3 no invalid JS emitted at success rc=0 | done | Negative `compile` exits 1 and prints no `const label = throw ...` output. |
| N-4 statement-position no-else `if` remains valid | done | Statement fixture check/compile pass; DD-50.5/DD-50.7 suites pass, including `while`, `for`, `block`, `try`, `switch`, and function bodies. |
| N-5 `if` with else in expression position remains valid | done | Positive fixture compiles to a ternary; DD-50/DD-50.7 regression suites pass. |
| N-6 JS parity preserved | done | JS DD-50 tests pass 34/0; compiled `.lykn` DD-50 fixture passes 34/0. |
| N-7 status surfaces reconciled | done | arc10, project plan, design README, bootstrap, dashboard data, and guide 00 updated. |
| N-8 full gates green | done | See §5. |

## 4. User-Facing Repro After Fix

```text
./bin/lykn check /private/tmp/arc10-no-else-negative.lykn
/private/tmp/arc10-no-else-negative.lykn: error: 1:13: error: if in expression position requires an else branch
  suggestion: add an else branch, or restructure as a statement

./bin/lykn compile /private/tmp/arc10-no-else-negative.lykn
1:13: error: if in expression position requires an else branch
  suggestion: add an else branch, or restructure as a statement

./bin/lykn check /private/tmp/arc10-no-else-statement.lykn
/private/tmp/arc10-no-else-statement.lykn: ok (1 top-level expressions)

./bin/lykn compile /private/tmp/arc10-no-else-positive.lykn
const label = 1 > 0 ? "items" : "none";

./bin/lykn compile /private/tmp/arc10-no-else-statement.lykn
if (1 > 0) console.log("items");
```

## 5. Verification

```text
cargo fmt --check
cargo test -p lykn-lang
cargo test -p lykn-cli
deno test --config project.json -A test/forms/dd-50.test.js test/forms/dd-50.7.test.js
./bin/lykn test test/forms/dd-50_test.lykn
make test-docs
make check-cited-paths
git diff --check
```

At close, the Rust package tests passed, the CLI package tests passed, the
targeted Deno DD-50 suites passed 34/0, and the compiled Lykn DD-50 fixture
passed 34/0. `cargo fmt --check` and `git diff --check` were clean.
`make test-docs` passed 476/0. `make check-cited-paths` was expected-red before
commit because the new close artifacts were not yet in HEAD; after commit it
passed across 598 documents with 601 historical citations accepted.

## 6. Bubble-Up

- arc10 A-9/A-10 are done; arc10 returns to closed.
- Project row P-22 is done.
- arc09 no longer waits on this compiler follow-up; the remaining release gate
  is arc16, then arc09.
- guide 00 now states the settled compiler behavior rather than carrying a known
  0.6.0-dev defect note.
