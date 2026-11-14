# Regression-first red receipt

- Source: `codex/qualified-adt-core` at `dba24d4063f34551c30590c884a495c8ca57298f` with only `test/forms/discard-bindings.test.js` edited to add the prescribed test to existing pattern/catch group.
- CWD: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
- Command: `deno test --config project.json -A test/forms/discard-bindings.test.js`.
- Environment: `DENO_DIR=/Users/oubiwann/Library/Caches/deno`; `TMPDIR=/private/tmp/lykn-arc05-s01-cc/tmp`; `XDG_CONFIG_HOME=/private/tmp/lykn-arc05-s01-cc/xdg`; `NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s01-cc/npm`.
- Numeric status: 1. Raw stdout, stderr and status are retained beside this receipt in `regression-first.stdout`, `regression-first.stderr`, and `regression-first.exit`.
- Population: exactly 7 top-level groups; 6 passed, 1 failed. Existing catch-default positive executed as ESM with expected `1\n`, process 0 and empty stderr for the first facade. The next assertion failed because the `eval` variant did not throw during compilation. The failure is `Expected function to throw` at product test line 428; no later SyntaxError was used as the oracle. Browser and `arguments` checks are downstream in this same test and therefore not reached on this red run.
- Interpretation: the expected current failure demonstrates the reported R01 defect at the actual compile-time validation boundary; it does not claim a complete negative matrix.
