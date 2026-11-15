# Correction02 focused gate receipts

Source at all attempts: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/qualified-adt-core`. Focused command:

```sh
deno test --config project.json -A test/forms/public-generated-names.test.js test/forms/icu-generated-names.test.js test/forms/lazy-protected-invocation.test.js test/forms/remaining-discard-bindings.test.js test/forms/dd-37-classifier-pilot.test.js test/forms/host-reference-lowering.test.js test/forms/browser-host-reference-compile.test.js test/forms/discard-bindings.test.js
```

## attempt01 — isolated default Deno cache

Environment: owned `TMPDIR`, `XDG_CACHE_HOME`, `NPM_CONFIG_CACHE`; no explicit `DENO_DIR`. `exec_command` first returned session id 51598. `write_stdin` terminal result had `exit_code: 1`, no `session_id`. Preserved `focused.stdout.log`, `focused.stderr.log`, and `focused.exit`: Deno attempted dependency downloads and failed loading `https://jsr.io/@std/assert/meta.json` under sandbox networking; test bodies did not run. This was cache/dependency availability, not a source-test failure.

## attempt02 — warm Deno, owned XDG/temp

Environment adds `DENO_DIR=/Users/oubiwann/Library/Caches/deno`. `exec_command` first returned session id 41902. `write_stdin` terminal result had `exit_code: 1`, no `session_id`. Preserved streams: 41 passed, 1 failed, 0 skipped across the 8 named files. The sole failure was the newly authored typed `->`/`->>` consumer wrapping a member call a second time, producing `child[result__gensym0]()()`; the test correctly rejected the resulting TypeError. This exact fixture construction was corrected to let the thread step perform its single call.

## attempt03 — final focused proof for correction02

Before the test command, `make fresh-artifacts` completed with exit0 under owned `TMPDIR`, `XDG_CACHE_HOME`, `NPM_CONFIG_CACHE`, and explicit warm `DENO_DIR`. It rebuilt the release binary and refreshed `target/lykn/build/{lang,browser,testing}`. Command output is in `fresh-artifacts.stdout.log` and `fresh-artifacts.stderr.log`; command exit is `fresh-artifacts.exit`. `exec_command` returned terminal `exit_code: 0`, no session id.

The focused command ran with the same four environment assignments. `exec_command` returned session id 92966; its terminal `write_stdin` returned `exit_code: 0`, no session id. Preserved full output and exit. Result: 42 passed, 0 failed, 0 skipped, eight paths. All eight public-generated-name groups passed; each of the seven retained consumer files passed its actual current test count (6 ICU, 4 lazy invocation, 8 remaining discards, 1 DD-37 pilot, 7 host references, 1 browser host-reference compile, 7 discard bindings).
