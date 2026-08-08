# arc15 · slice05 — CDC Verification

Verifier: CDC, same operating surface as the implementation. This is a close
discipline pass over the ledger, diff, and gates; an independent CDC seat would
still be stronger if the operator wants a second read before arc15 close.

## Ledger Check

- S5-1 is supported by the recorded pre-fix probes.
- S5-2/S5-3 are supported by Rust unit tests and CLI pipeline tests.
- S5-4 is supported by the focused Deno regression.
- S5-5 is supported by the register and status-document edits in this close set.
- S5-6 is supported by the gate transcript below.

## Scope Check

The diff is scoped to:

- Rust classifier validation and CLI wiring.
- Focused Rust and JS tests for nested bare-parameter `fn` rejection and bound
  `fn` value-call preservation.
- arc15 slice05 planning/close docs and project/status reconciliation.

The diff does not rewrite the recursive emitter error path and does not alter
the documented labelled-`fn` arity residual.

## Gate Evidence

- `cargo test -p lykn-lang nested_fn -- --nocapture` -> 4 passed / 0 failed.
- `cargo test -p lykn-cli nested_bare_parameter_fn -- --nocapture` -> 2 passed / 0 failed.
- `cargo test -p lykn-cli fn_head -- --nocapture` -> 1 passed / 0 failed.
- `deno test --config project.json -A test/forms/arc15-fn-param-validation.test.js` -> 1 passed / 0 failed.
- `deno test --config project.json -A test/expander/conformance-corpus.test.js` -> 9 passed / 0 failed.
- `make test` -> green, including Rust tests, generated corpus, JS tests, and documentation doctests.
- `cargo fmt --check` -> green.
- `deno fmt --check test/forms/arc15-fn-param-validation.test.js` -> green.
- `make lint` -> green.
- `git diff --check` -> green.
- Pre-commit `make check-cited-paths` -> expected red: six citations, all to
  new slice05 docs not present in `HEAD`.
- Post-commit `make check` -> green. The cited-path gate passed at the start of
  that run: 576 documents checked, 601 historical citations accepted via the
  frozen census.
