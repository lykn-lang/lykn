# Slice14 CC Stage A results — NE-C08

**CDC handoff note, 2026-11-06:** CC stopped after a prohibited Python ledger
edit and made no planning commit. See [incident and status limits](artifacts/python-policy-incident.md).
The following is retained CC-attested evidence, independently reviewed/replayed
only as the CDC verification later records; no blanket process-compliance claim.

Status at handoff: CC Stage A implementation and bounded required local evidence recorded; CDC independent disposition pending. VP-01/02/03 remain open. NE-C07, parser observations, and later Make checks were not started.

## Source history

Task checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/compile-route-validation`, began at `2bf7a10929dc870acbd37709d5851cfd109f0082` and is clean at `4610b4ce37d41dd11a591f88b4e67e15b84f96b1`. The focused test freeze is `94076ccee4ffaff8f0db58677da06ac8da5ad93c`, followed by the offline Deno flag correction `759300d748d250c8997be15b2c8d240024072e89`, then the private shared validator patch `4610b4ce37d41dd11a591f88b4e67e15b84f96b1`. Each commit has the required contiguous co-author trailers. No source paths outside the two Stage A paths were changed.

The production helper factors the stdout route's five validators in their existing order and invokes the same borrowed-form helper after resolution in both compile routes. `check_strict` remains untouched. CDC's read-only source delta review at `4610b4c` found no substantive source finding; that review is not independent acceptance.

## Frozen red and focused green

The frozen API test run selected one meaningful parity test and failed before the fix: stdout rejected all five categories, while `with_dts` accepted reserved binding, method-on-expression, and nested bare-parameter function inputs. Raw outputs are `artifacts/stage-a-api-red.txt` and `artifacts/stage-a-api-red-retry02.txt`. The initial `--exact` substring attempt and wrong `--lib` target selected zero tests; both invocation errors remain in `stage-a-api-red.txt`, `stage-a-api-red-retry01.txt`, and `stage-a-test-freeze-pathspec-failure.txt` as applicable.

Before-patch CLI runtime selected 3 integration tests: 2 failed on the route-parity/output-write regressions and the synchronous positive control passed. Raw `artifacts/stage-a-cli-red.txt` retains process output and pre-assert bytes.

After the patch, `cargo test --offline --locked --package lykn-cli --bin lykn compile_ -- --nocapture` selected 40 tests: 40 passed, 0 failed, 138 filtered. This includes the five API parity inputs and positive API controls. Raw output: `artifacts/stage-a-api-green.txt`.

`LYKN_TEST_DENO=/opt/homebrew/bin/deno cargo test --offline --locked -p lykn-cli --test compile_validation_parity -- --nocapture` selected 3 integration tests: 3 passed, 0 failed, 0 filtered. All five validation inputs reject on stdout and `-o`; rejection creates neither fresh output and preserves existing JS/DTS sentinels. The typed stdout and file JS match, typed DTS is exact, and cached local Deno execution returns `42\n` with empty stderr. Raw output: `artifacts/stage-a-cli-green.txt`.

Test build and executable provenance: `artifacts/stage-a-frozen-test-build.txt`, `stage-a-green-test-build.txt`, `stage-a-test-executable-pins.md`, and `stage-a-green-executable-pins.md`. The post-fix CLI debug binary SHA-256 is `79720545b4846538b83f78348a68aa6610e2fc0ac95b3cd65e5968d0c5291d08`; Deno 2.9.6 SHA-256 is `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.

## Build and repository gates

`cargo build --release --offline --locked -p lykn-cli` passed. Raw output and release CLI SHA-256 `9e73a4241c2e3d2ef895c4057929d588fb37d7572c88c1659b31a1e35fdff025` are recorded in `artifacts/stage-a-release-build.txt` and `stage-a-release-executable-pins.md`.

Unfiltered `make check` ran in the task checkout with task-local npm cache, fresh task-local XDG cache/config/data/state directories, and `DENO_DIR=/Users/oubiwann/Library/Caches/deno`. `cargo-binstall` and `cargo-outdated` were present before invocation; no installer branch was needed. `check-deps`, integrated committed citation check (63 documents, 601 historical citations), release build, Clippy, rustfmt, syntax check, and Lykn lint completed successfully. In `test-rust`, `lykn` lib selected 0, `lykn_cli` lib selected 98 and passed 98/98, and `lykn` main binary selected 178 and passed 178/178. The following `tests/async_exports.rs` selected 2: the negative control passed and the known NE-C07 positive failed because `fetch-value` was reported as an unknown top-level binding. Raw complete output: `artifacts/stage-a-make-check.txt`. `make check` stopped with exit 101 there; later test-suite and documentation targets are unrun, so no full-green claim is made.

The committed citation gate was also run directly: `DENO_DIR=/Users/oubiwann/Library/Caches/deno make check-cited-paths`; it passed for 63 committed documents with 601 historical citations accepted. Raw output: `artifacts/stage-a-cited-paths.txt`.
