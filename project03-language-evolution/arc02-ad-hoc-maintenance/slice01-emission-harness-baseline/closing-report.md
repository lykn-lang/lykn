# S01 CC execution report — proposed return, independent review pending

**Disposition:** source correction and one frozen baseline execution are reported for CDC review. This is not independent acceptance. The first unpredicted substantive result occurred in the package runtime control; execution stopped without a source/oracle change or retry. CDC owns the separate replay and final row dispositions. Arc01 S02 remains held pending acceptance and explicit Operator continuation.

## Frozen source

- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
- Branch: `codex/emission-harness-baseline`, created at the clean `23219431e6d154a4e046bfd375a01dc8bfb3929d` task baseline.
- Source commits: `5480a27e232acd59a339558786e11690b4d1e370` and `c129e94cc3c2d27a07c3bf26e4476bf740c04461`. Both use the assigned fixed source message and contiguous Codex/Billo AI trailers. Each changes only `crates/lykn-cli/tests/emission_failures.rs`; no amend or history rewrite.
- The three fixture constants remain byte-identical to232. The test now watches `target/lykn/build/emission/{mod.js,mod.d.ts}`, asserts the real pre-build source-vs-sentinel mtime inequality, treats DTS as absent for both nonexporting valid sources, runs the same exact private runtime predicate on CLI and package outputs, and records ten predicate self-check observations.
- `rustfmt --edition 2024` and `git diff --check -- crates/lykn-cli/tests/emission_failures.rs` completed before source freeze. No source edit occurred after the baseline run.

## Baseline execution

The first focused no-run build was executed from the source worktree with Rust/Cargo 1.97.0, `--offline --locked`, fresh owned XDG/npm cache directories, fixed `DENO_DIR=/Users/oubiwann/Library/Caches/deno`, and `LYKN_TEST_DENO=/opt/homebrew/bin/deno`. It exited 0 without warnings. Its output selected the actual test executable `target/debug/deps/emission_failures-ee1302ddd95a417d`. Pinned `target/debug/lykn` SHA256 was `9fc676a2c1a11355966680808dd0a3c8afb2c74881b2b7a78ad35e12588e48de`; test executable SHA256 was `39e857d95b1ff55d5d8a4c823af5b02a947561e87abedaba490a652b5624fe73`. Before/after hashes around direct test execution match.

The actual test executable ran once, unfiltered, as `--nocapture --test-threads=1`; it exited 101 with 3 tests selected: 1 passed and 2 failed. The ten predicate self-checks all matched their expected values (10/10). The four invalid-source routes were all observed and showed the predicted old-product success/output behavior: CLI stdout emitted JS at exit 0; existing CLI JS was overwritten at exit 0 while DTS sentinel remained; fresh CLI JS was created at exit 0 while DTS was absent; package build returned `Ok` with short name `emission`, replaced JS, and retained the DTS sentinel. The invalid generated output was not executed.

All four valid source compilations produced JS and no DTS. User-text/throw matched on both routes (exit1, exact literal stdout, both TypeError and user message in stderr). Shadowed `dissoc` matched on CLI (exit0, exact `"kept"\n`, empty stderr). **Unexpected product discrepancy:** the package shadowed-`dissoc` route exited1 with `ReferenceError: obj is not defined`. Manual inspection of the preserved package module shows `obj` emitted as `obj("secret", 1)`, while the CLI module emits `{ secret: 1 }`. This contradicts the source-based package-runtime prediction in the prompt; it is preserved as product behavior and is not authorization to repair resolution or weaken the control.

## Receipts and limits

Durable raw stdout/stderr/status, command metadata, generated valid modules, DTS-absence records, pre/post sentinels and mtimes, build result, exact no-run streams, executable pins, and Deno identity are under [`artifacts/evidence/cc/attempt01/`](artifacts/evidence/cc/attempt01/). Deno was `/opt/homebrew/bin/deno`, version2.9.6, SHA256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. The outer test stream preserves all four invalid observations and each runtime outcome; per-command raw receipts preserve actual runtime bytes and generated valid modules before temporary fixture cleanup.

Receipt limit: for the fresh invalid CLI condition, the test records that JS exists and DTS does not, and the outer stream records the resulting success/output; it does not retain the generated JS bytes as a separate per-condition module file. Do not claim that module bytes were retained. Historical232 missing original no-run streams/post-build pin remain unreconstructed.

No full Make gate, filtered/repeated test, repair, Deno permission change, dependency change, source change, S02 Result implementation, integration, push, or publication occurred. Test/build result is an old-compiler baseline with one declared expected product red and one newly observed package-runtime discrepancy, not product acceptance. Review/replay this exact frozen source before closing any S01 rows.
