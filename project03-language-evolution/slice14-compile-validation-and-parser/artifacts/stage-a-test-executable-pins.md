# Stage A test executable pins

Test-source freeze: task worktree `codex/compile-route-validation` at
`759300d748d250c8997be15b2c8d240024072e89`.

Build-only command:

```sh
cargo test --no-run --offline --locked --package lykn-cli
```

Exit 0. Raw output: `stage-a-frozen-test-build.txt`. It emitted the parity
integration executable `target/debug/deps/compile_validation_parity-ed5da4aecd278839`.

CLI binary used by that test target:

- Path: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/lykn`
- SHA-256: `e6b3b6a8af4f9df87e45a4e7335a5cc82348cee46daa6f2b701bc3c3ecde77a4`

Deno runtime used by the positive CLI integration control:

- Command: `/opt/homebrew/bin/deno`
- Resolved path: `/opt/homebrew/Cellar/deno/2.9.6/bin/deno`
- Version: `2.9.6 (stable, release, aarch64-apple-darwin)`
- SHA-256: `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`
