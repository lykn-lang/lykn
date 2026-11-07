# Baseline execution pins

Fixture/prediction freeze: source `61a7e3e`; oracle `5dc2e0d`. Harness-only
correction after the preserved first no-run failure: source `5b11f49`. Current
task checkout is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on `codex/async-expression-values` at `5b11f496ca2a284dede80abbb95b47fcbb301ed8`.

The native integration test's `CARGO_BIN_EXE_lykn` target is the absolute debug
CLI `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/lykn`,
SHA-256 `a13d6b313740608eaa0e825b81573fa6e0db6066aa9754bf0843ff15c5485957`.
The runtime is `/opt/homebrew/bin/deno`, SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`, version
`2.9.6 (stable, release, aarch64-apple-darwin)`, V8 `15.0.245.2-rusty`.

Build-only command and result:

```text
cargo test --offline --locked -p lykn-cli --test async_expression_values --no-run
exit 0
raw output: native-build-attempt-0002.log
```

No environment override was used for build. The native runtime test receives
`LYKN_TEST_DENO=/opt/homebrew/bin/deno`; its direct child invocation uses
`run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`.
