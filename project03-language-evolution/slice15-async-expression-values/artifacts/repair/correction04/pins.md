# Correction04 native verification pins

- Source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/async-expression-values`.
- Frozen native source commit before fresh focused greens: `54608a7c463ea0386c9fade45d57d66da45050b9`.
- `crates/lykn-lang/src/emitter/forms.rs` SHA-256: `f843bd70d69595202905dd42b9e76e0126ee54c419ba999311541087c596ec2a`.
- Actual built CLI `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/lykn`, SHA-256 `6cb24b83593f837400c95299465f24fc1db040f2560f5e1737ab80d90e8e19cc`.
- Actual integration test executable `target/debug/deps/async_expression_values-ca9664e9a5eacb46`, SHA-256 `9d506ec2001e24b5e0cfe4ebd51bddbfce44bc5472faac552bdcdd3f5dfb9a3c`.
- Cargo 1.97.0 (`c980f4866`, 2026-06-30); rustc 1.97.0 (`2d8144b78`, 2026-07-07).
- Deno `/opt/homebrew/bin/deno`, 2.9.6 stable, V8 15.0.245.2-rusty, SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
- Focused native runtime command: `LYKN_TEST_DENO=/opt/homebrew/bin/deno cargo test --offline --locked -p lykn-cli --test async_expression_values -- --nocapture`.
- Frozen five fixture/oracle source is unchanged from correction03; public and embedded JS files are unchanged at their retained correction03 hashes. No new JS runtime run is required by correction04.

## Control chronology

- `be6bf73` froze the initial private loop-tail unit. Its first run passed because the assertion inspected a form head on the loop list itself; preserve as a weak control only (`for-await-tail-before.log`).
- `949da90` corrected the same assertion to inspect the carrier element's list head. It failed on the unchanged `0fe6663` product source (exit 101), preserved in `for-await-tail-corrected-before.log`.
- First pre-freeze no-run build after the product edit failed with a borrow-after-move in the emitted-if scanner. The complete compiler diagnostic is preserved in `native-test-build.log`; the exact transient failed working-tree source body was not separately saved, so no body hash is claimed.
- Final formatting/no-run/build receipts are retained in `rustfmt-write.log`, `rustfmt-check.log`, `rustfmt-write-after.log`, `rustfmt-check-after.log`, `native-test-build-final.log`, and `native-build.log`.
