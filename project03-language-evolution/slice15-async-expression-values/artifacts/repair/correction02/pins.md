# Correction02 pre-runtime pins

Corrected expectation/source freeze: source `e9dd7b1`; correction02 oracle
`19afaa6`; source-format commit `babe580`. Original freeze and baseline remain
unchanged. The accidentally formatted E3 was restored byte-for-byte from
`5b11f49`; its SHA-256 is the earlier recorded `bc7a7b23007b80f10b298145e36a859d0a108a70537139e85628c3986a1d21fb`.

Task checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/async-expression-values`, source `babe580b762395d1fd235d0bcf2c79a80bd238ec`.

| Executable | Absolute path | SHA-256 / version |
| --- | --- | --- |
| Native CLI used by integration test (`CARGO_BIN_EXE_lykn`) | `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/lykn` | `a13d6b313740608eaa0e825b81573fa6e0db6066aa9754bf0843ff15c5485957` |
| Native integration test executable | `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/deps/async_expression_values-ca9664e9a5eacb46` | `58ccf4183c9231b5d2fc0b8132d9ba164ce4319d423a739318ed4bbc3d85ae7d` |
| Deno runtime and test runner | `/opt/homebrew/bin/deno` | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`, Deno `2.9.6`, V8 `15.0.245.2-rusty` |

Build-only command: `cargo test --offline --locked -p lykn-cli --test async_expression_values --no-run`, exit 0; complete output is in `native-build.log`. Toolchain is Rust/Cargo `1.97.0`; rustfmt `1.9.0-stable`.

Native runtime command is
`LYKN_TEST_DENO=/opt/homebrew/bin/deno cargo test --offline --locked -p lykn-cli --test async_expression_values -- --nocapture`.
The Rust integration test invokes the pinned CLI through Cargo's
`CARGO_BIN_EXE_lykn`, then invokes the pinned Deno child with
`run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`.

Public JS test command is
`/opt/homebrew/bin/deno test --config project.json --allow-read --allow-write --allow-run --cached-only test/forms/async-expression-values.test.js`.
It uses the existing cached JSR and npm inputs; its generated fixture child
remains offline and receives no permissions.

Source validation: the pinned built CLI `target/release/lykn` checked all five
fixture bodies (exit 0). Its `fmt --check` found the initial draft unformatted;
the formatted E1/E2/E4/E5 now pass `fmt --check` (exit 0). Read-only `E3` was
excluded from the final format command. Rust and JS harnesses pass their
respective formatter checks after their exact formatting commits.
