# arc15 · slice05 — Ledger (Nested `fn` parameter validation)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CDC is landing
this fast-follow directly after operator approval; evidence is recorded per row.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S5-1 | **Mismatch reproduced.** Current JS rejects bare-parameter `fn`; current Rust emits bad JS. | probe transcript | serious | `D-2608-H7FN` | done | Pre-fix JS probe exited 1 with `expected type keyword or sub-form at position 0, got atom`; pre-fix Rust CLI exited 0 and emitted `const f = fn(x(), x);`. | |
| S5-2 | **Rust nested validator.** `fn`/`lambda`/`genfn` parameter-shape errors are caught recursively after resolution and before emission fallback. | Rust classifier tests | serious | slice-doc | done | `cargo test -p lykn-lang nested_fn -- --nocapture` -> 4 passed / 0 failed. | Preserves DD-61 bound-head behavior; intentionally validates param-list mismatches, not every older malformed arity residual. |
| S5-3 | **Compile/check parity.** `lykn compile` and `lykn check` both reject nested bare-parameter `fn`. | CLI tests | correctness | slice-doc | done | `cargo test -p lykn-cli nested_bare_parameter_fn -- --nocapture` -> 2 passed / 0 failed; `cargo test -p lykn-cli fn_head -- --nocapture` -> 1 passed / 0 failed. Direct probes after fix: `compile` and `check` reject `(bind f (fn (x) x))`; bound `(fn 1)` value-call still emits `const _y = fn(1);`. | |
| S5-4 | **JS behavior pinned.** Existing JS rejection is covered by a Deno regression test. | Deno test | correctness | parity | done | `deno test --config project.json -A test/forms/arc15-fn-param-validation.test.js` -> 1 passed / 0 failed. | No JS implementation change. |
| S5-5 | **Docs/register reconciled.** `D-2608-H7FN` closes and arc/project/status text reflects slice05. | read docs | serious | close discipline | done | `backlog/discoveries.md`, `arc-plan.md`, `README.md`, `project-plan.md`, and `status.html` updated in this close set. | Arc15 itself remains open for arc-close reproduction. |
| S5-6 | **Full gate green and scoped diff.** Build, lint, tests, cited-path gate, and diff hygiene pass. | `make check`; `git diff --check`; status review | serious | close discipline | done | `cargo fmt --check`, Deno fmt check, `make lint`, `make test`, and `git diff --check` green. Pre-commit `make check-cited-paths` failed only on six citations to new slice05 files absent from `HEAD`, as expected. Post-commit `make check` green, including cited-paths: 576 documents, 601 accepted historical citations. | `make test` needed normal filesystem access because npm dry-run writes user npm logs. |

## Closure

Closed by `closing-report.md`. Rows: 6. Done: 6. Deferred: 0. No-op: 0.
