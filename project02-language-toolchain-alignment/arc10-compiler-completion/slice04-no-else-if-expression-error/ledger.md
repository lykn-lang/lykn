# Slice 04: no-else-if-expression-error -- Ledger

Compiler follow-up for `D-2608-W2HF`: no-else `if` in expression position must
fail before Rust codegen can emit invalid JavaScript.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| N-1 | Defect reproduced on the current `release/0.6.x` baseline before the fix | `./bin/lykn check` and `./bin/lykn compile` on `(bind label (if (> 1 0) "items"))` demonstrate the current bad behavior | serious | arc07 slice02 / `D-2608-W2HF` | done | [`closing-report.md`](closing-report.md) §2 records the baseline: `check` rc=0; `compile` rc=0; emitted `const label = throw ...`. | baseline reproduced before the fix |
| N-2 | Rust compiler/check path rejects no-else `if` where a value is required | targeted Rust tests plus `./bin/lykn check <fixture>` and `./bin/lykn compile <fixture>` fail with the DD-50 diagnostic | serious | slice-doc | done | `cargo test -p lykn-lang`; `cargo test -p lykn-cli`; negative fixture now fails both `check` and `compile` with `if in expression position requires an else branch`. | error occurs before JS emission |
| N-3 | No invalid `const x = throw ...` JavaScript is emitted at success rc=0 | compile command exits non-zero for the defect fixture; any captured stdout does not contain `const label = throw` | correctness | slice-doc | done | `./bin/lykn compile /private/tmp/arc10-no-else-negative.lykn` exits 1 and prints only the diagnostic + suggestion. | protects the actual user-visible failure mode |
| N-4 | Statement-position no-else `if` remains valid | positive fixture and existing DD-50.5/DD-50.7 tests pass | serious | slice-doc | done | `./bin/lykn check /private/tmp/arc10-no-else-statement.lykn` exits 0; `./bin/lykn compile` emits `if (1 > 0) console.log("items");`; DD-50.5/DD-50.7 suites pass. | includes `switch`, `try`/`catch`/`finally`, and class method body coverage |
| N-5 | Expression-position `if` with an `else` remains valid | positive fixture and existing DD-50/DD-50.7 tests still compile to ternary or IIFE as appropriate | serious | slice-doc | done | `./bin/lykn compile /private/tmp/arc10-no-else-positive.lykn` emits `const label = 1 > 0 ? "items" : "none";`; DD-50/DD-50.7 suites pass. | preserves DD-50 position-aware semantics |
| N-6 | JS compiler parity is preserved | existing JS DD-50 tests still pass; no new divergence introduced between JS and Rust compilers | correctness | slice-doc | done | `deno test --config project.json -A test/forms/dd-50.test.js test/forms/dd-50.7.test.js` passes 34/0; `./bin/lykn test test/forms/dd-50_test.lykn` passes 34/0. | JS already threw the intended diagnostic |
| N-7 | Arc/project/docs status surfaces are reconciled | arc10 ledger A-9/A-10, project sequence/status, and any guide defect note are updated to reflect the landed fix | serious | bubble-up from arc07 | done | `arc-plan.md`, arc10 `closing-report.md`, project `README.md`, `project-plan.md`, `BOOTSTRAP.md`, `status.html`, and guide 00 updated. | arc10 returns to closed; P-22 done |
| N-8 | Full gates are green at close | `cargo fmt --check`, `cargo test -p lykn-lang`, `cargo test -p lykn-cli`, relevant Deno tests, `make test-docs`, `make check-cited-paths`, and `git diff --check` pass | serious | process note | done | Final gate transcript recorded in [`closing-report.md`](closing-report.md) §5. | `make check-cited-paths` must be rerun after commit because new close docs are cited |

## What Worked

- The Rust path already had the right DD-50 diagnostic text in the emitter; the
  missing piece was an earlier structural check over the resolved surface tree.
- The old DD-50.5 context-profile corpus paid off: switch case bodies and
  try/catch/finally statement bodies were caught and pinned before close.

## Closure

Closed 2026-08-08. `D-2608-W2HF` is fixed; arc10 and project row P-22 are
reclosed by this slice.
