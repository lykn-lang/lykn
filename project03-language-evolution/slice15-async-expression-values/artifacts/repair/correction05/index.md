# Correction05 source and prediction freeze

The only product-source change for this correction is E5's pair of same-name sibling Do bindings. Exact whole-body snapshot: `new-E5-frozen.lykn`, SHA-256 `0b4a02a9c67e7537fc8a3f88cf2a001387b925772a7c75fe79d23dd8bd499034`. It matches the committed source at `802bb223b341b5860fc2a0b7d2f2f77f17fbe499` byte for byte. The source file is `test/fixtures/async-expression-values/E5-effects-errors.lykn`.

Source-derived prediction, frozen before checks or runtimes: `prediction.md`, SHA-256 `a9dafe689b06b193c95b4a2fc26050ba8cc64482d6dc9962f0d058e66e3f0afa`. The exact expected E5 JSON remains `{"trace":["selected","await-selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner","asyncValueMessage":"value boom"}`. Other fixtures, harnesses, expected values, and product files are outside this correction's change.

`old-E5-at-54608a7.lykn` preserves the previous complete E5 body, SHA-256 `5440850abf7cab981ddab36a82a3dc060be872625078837214df52f4ce105d77`. The earlier original-shadow proof remains attributed to that old fixture on unchanged product commit `54608a7c463ea0386c9fade45d57d66da45050b9`; it is not evidence for this sibling-scope condition.

No runtime or check had run when these source and prediction snapshots were frozen.

## Correction05 execution results

The first native test command was accidentally invoked from `/Users/oubiwann/lab/lykn/lang` rather than the authorized contract worktree. Cargo reported `no test target named async_expression_values`; that invocation performed no test. Its initial `native-five.log` tee target was overwritten by the corrected run, so there is no separate filesystem log for the first attempt. The exact command output is retained in the CC tool response in this conversation; this limitation is not backfilled as a run artifact.

From `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` at source commit `802bb223b341b5860fc2a0b7d2f2f77f17fbe499`, the corrected native same-five command exited 0: one harness test passed, exercising E1-E5. Raw output is `native-five.log`. The public JS same-five command also exited 0: one test, five fixture steps passed. Raw output is `public-js-five.log`. Both report the frozen E5 JSON exactly; no product or other fixture changed.

Before full Make, C5-specific npm and XDG cache directories did not exist and were created empty at `target/slice15/correction05/npm-cache` and `target/slice15/correction05/xdg-cache`. Full command:

`env DENO_DIR=/Users/oubiwann/Library/Caches/deno LYKN_TEST_DENO=/opt/homebrew/bin/deno npm_config_cache=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice15/correction05/npm-cache XDG_CACHE_HOME=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice15/correction05/xdg-cache make check`

No `CARGO_NET_OFFLINE` or `CARGO_TARGET_DIR` override was set. Dependencies and the committed citation gate passed (63 documents, 601 historical citations); release build, clippy, rustfmt, syntax, and Lykn lint (132 files) also passed. `make check` stopped during `test-rust` at `emitter::forms::tests::test_emit_bind_group_in_function_body_stays_sibling_scoped`: assertion expected `Some("const")`, observed `Some("block")`. Rust unit result was 1122 passed, 1 failed; Make reported `Error 101` for `test-rust`. Raw full-gate output is `full-make-check.log`. The overall shell pipeline exit code was not retained from the completed PTY poll. No later Make test targets or fresh mirror materialization check ran after this failure.

The recorded release compiler was `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`, SHA-256 `b42b1adea1e60c1412eaa210190e4061e56709b770a292d21202334746bd8a93`. Product source remains unchanged from `54608a7c463ea0386c9fade45d57d66da45050b9`; the separate original-shadow proof applies only to its original fixture condition.
