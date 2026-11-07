# Frozen baseline record

The fixture and expected-value freeze is in source commit `61a7e3e` and
planning commit `5dc2e0d`; neither body was changed during this baseline. The
native expectation-storage correction is test-only commit `5b11f49` and is
authoring correction 1 of the unit's five-pass ceiling. See `../frozen-oracles.md`
and `pins.md`.

## Preserved attempts

| Raw file | Command/result | What it establishes |
| --- | --- | --- |
| `native-build.log` | `cargo test --offline --locked -p lykn-cli --test async_expression_values --no-run`, exit 101 | Harness-only compile failure: `json!` cannot initialize const `Value`; no fixture runtime occurred. |
| `native-build-attempt-0002.log` | Same no-run command, exit 0 | Compiled the native integration test and CLI before runtime. |
| `native-runtime.log` | `LYKN_TEST_DENO=/opt/homebrew/bin/deno cargo test --offline --locked -p lykn-cli --test async_expression_values -- --nocapture`, exit 101 | All five loop positions were reached. E1 compiled and failed at runtime: branch-do results were absent and a no-else `if` was emitted as expression error. E2 fixture failed reader parsing at line 3, so it establishes no compiler behavior. E3 compiled but module load failed on await inside a synchronous IIFE. E4 compiled but module load failed on malformed returned-function IIFE. E5 matched frozen JSON and exited 0. Complete generated output/source/status precedes each runtime/assertion. |
| `js-runtime.log` | Initial JS baseline with `--no-remote`, exit 1 | Runner setup failure: cached test dependency metadata still requests the JSR specifier; no fixture ran. |
| `js-runtime-attempt-0002.log` | Retry with `--cached-only --no-npm`, exit 1 | Runner setup failure: public compiler's existing `npm:astring` import was blocked; no fixture ran. |
| `js-runtime-attempt-0003.log` | `/opt/homebrew/bin/deno test --config project.json --allow-read --allow-write --allow-run --cached-only test/forms/async-expression-values.test.js`, exit 1 | Public JS reached all five steps. E1's expected JSON values were observed, but the fixture also printed its no-else sentinel to stdout, so the current JSON-only reader rejects the combined output. E2 public API rejects `(async (func ...))`; no execution. E3 generated the same syntax error as native. E4 passed at top level, which does not exercise the required sync-function boundary. E5 passed with the frozen JSON. |

The fixture issues in E2/E4 and E1's stdout sentinel are preserved as authoring
findings, not recast as product results. The assigned CDC will issue one
consolidated preserved correction iteration before any production edit. No
parser, source implementation, mirror, or generated output has been changed.
