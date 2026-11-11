# AT-02 raw replay receipt

This receipt describes only commands actually executed by this contributor. The source root and hashes are recorded in `intake-iteration01.md`; the worktree was read-only throughout.

## Initial source

Input: `initial/decoder.lykn`, commit `de33d6bf8c57c2bf7e437a2dee4eba09236fdd1e`, SHA-256 `e5254ac8d685434372849f3c4359882ba49b0c6f6f9be7a892f88807485216d7`. Owned scratch copy: `scratch/initial/decoder.lykn`, verified byte-equal by `cmp`. Config: `scratch/initial/project.json` = `{}`. Output root: `scratch/initial/target/`.

Commands, run from `artifacts/at02/scratch/initial/`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check decoder.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint decoder.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile decoder.lykn -o target/default.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile --strip-assertions decoder.lykn -o target/stripped.js
```

Every invocation redirects stdout, stderr and exit status to the matching `scratch/initial/<name>.{stdout,stderr,status}`. Both compiles failed; both `lykn run` commands were skipped because no output JS existed. Public compilation/runtime were skipped by this contributor because the unchanged source failed native check and compile. Independent reviewer public evidence should be added with its actual source path and contributor attribution; do not merge it into this run's denominators.

## Final draft attempts

Source snapshots: `scratch/final/iter01/decoder.lykn` through `iter05/decoder.lykn`. Each is the exact source submitted to one `lykn check` attempt. Logs are `final/check.*` for attempt 1 and `final/iterNN-check.*` for 2–5. Attempt 5 matches `final/decoder.lykn` (SHA-256 `85c7f3b68370d56b6528ec4da8ffd6127ff28214f62cecea00b2faab87c2ce63`). All checks exited 1; error text is in `iteration-results.md` and each raw stderr file. The assignment's five-correction limit was reached. No final lint, compile, runtime, formatter, generated-JS inspection or public matrix command ran.

`original-to-final.diff` compares the frozen initial source with the final failed draft; `original-to-final.diff.status` retains the ordinary `diff` status. No generated JS exists for either source. Re-running any command after this record would create new evidence and is outside the completed contributor run.

## Iteration04 continuation amendment

The paragraph above is preserved as the earlier stop receipt and is superseded for current execution status by the authorized continuation below. It is not a claim that the final matrix remains unrun.

### Final source and formatter checks

The accepted final pin is `final/decoder.lykn`, `final/controls.lykn`, and `final/zero-field-control.lykn`, executed as exact copies under `scratch/final/iter11/`. SHA-256 values are listed in `iteration-results.md`. Each file was formatted twice with `lykn fmt`; the second formatted result compared byte-identically with the first. The resulting formatted source was then checked, linted, compiled and run. No emitted JS was edited. The full command statuses and raw streams for final native invocations are preserved in `scratch/final/iter11/` and copied into `evidence/final/native/`. Public driver statuses/raw streams are retained in `scratch/final/iter11/public/` and copied into `evidence/final/public/`.

### Final native invocations

From the iteration11 scratch directory, with `project.json` retained there:

```sh
lykn check decoder.lykn
lykn check controls.lykn
lykn check zero-field-control.lykn
lykn lint decoder.lykn
lykn lint controls.lykn
lykn lint zero-field-control.lykn
lykn compile decoder.lykn -o target/default-decoder.js
lykn compile --strip-assertions decoder.lykn -o target/stripped-decoder.js
lykn compile controls.lykn -o target/default-controls.js
lykn compile --strip-assertions controls.lykn -o target/stripped-controls.js
lykn compile zero-field-control.lykn -o target/zero-field-control.js
```

The five native runs used `lykn run` on the matching default/stripped/control outputs. Every command's actual invocation and status is retained in scratch evidence; generated native JS is retained at `output/native/`. Native decoder default and stripped outputs compared byte-identically.

### Public compiler fixture and observations

The public fixture was assembled from the exact pinned `packages/lang` export at source commit `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`, with the previously accepted public `project.json` and `deno.lock`. It used `DENO_DIR=/Users/oubiwann/Library/Caches/deno`, `--cached-only --frozen --no-prompt`, and a read permission scoped to the driver input. The compile drivers and raw compiler outputs are retained under iteration11 scratch; generated public JS is copied into `output/public/`. Public runtime execution had no runtime grants. All decoder, controls and zero-field driver compile/run invocations exited 0. Public decoder output matches native default exactly. Public control output differs from native only in the nested-match `ReferenceError` message for T11/T12.

Do not stage the scratch public package export, `target/`, or tool caches as evidence. The tracked raw logs, exact final source, fixture config/lock and emitted JS are sufficient to reconstruct the owned trial.
