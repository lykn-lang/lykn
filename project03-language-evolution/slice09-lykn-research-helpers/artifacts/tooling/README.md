# Slice09 Lykn research helpers

These local research helpers implement the accepted public-export validator,
process runner, byte copy/compare actions, and their fixed behavior controls in
Lykn. Independent CDC review accepted exact positive-output parity and all
V0–V7/R0–R3 controls. The original Python bodies were removed after that review;
no Python execution, script, wrapper, or fallback remains permitted or needed.

## Tool pins and compilation

Use the accepted task compiler and Deno 2.9.6. Verify their hashes before
captured compiler or runtime invocations:

- `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`, SHA-256 `544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`
- `/opt/homebrew/bin/deno`, SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`

From the contract-predicate-lowering worktree root, each compiler command below
runs from the explicit empty-config cwd. The example uses fresh iteration02
paths; stop if any already exists rather than overwriting prior frozen products
or receipts:

```sh
set -e
test ! -e target/slice09/empty-cleanup-iteration02-2026-11-06
test ! -e target/slice09/frozen-cleanup-iteration02-2026-11-06
test ! -e target/slice09/run-cleanup-iteration02-2026-11-06
mkdir target/slice09/empty-cleanup-iteration02-2026-11-06
mkdir target/slice09/frozen-cleanup-iteration02-2026-11-06
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/evidence/cdc-pin-recheck/project.json target/slice09/empty-cleanup-iteration02-2026-11-06/project.json
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/public-check.lykn target/slice09/empty-cleanup-iteration02-2026-11-06/public-check.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/orchestrate.lykn target/slice09/empty-cleanup-iteration02-2026-11-06/orchestrate.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/check-helpers.lykn target/slice09/empty-cleanup-iteration02-2026-11-06/check-helpers.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/child-fixture.lykn target/slice09/empty-cleanup-iteration02-2026-11-06/child-fixture.lykn
cp target/slice09/empty-cleanup-iteration02-2026-11-06/child-fixture.lykn target/slice09/frozen-cleanup-iteration02-2026-11-06/child-fixture.lykn
cd target/slice09/empty-cleanup-iteration02-2026-11-06
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile public-check.lykn -o ../frozen-cleanup-iteration02-2026-11-06/public-check.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile orchestrate.lykn -o ../frozen-cleanup-iteration02-2026-11-06/orchestrate.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile check-helpers.lykn -o ../frozen-cleanup-iteration02-2026-11-06/check-helpers.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile child-fixture.lykn -o ../frozen-cleanup-iteration02-2026-11-06/child-fixture.js
cd ../../..
```

## Direct validation and controls

Run commands from the contract-predicate-lowering worktree root. R0 also reads
the already preserved CDC empty config at `target/slice09/empty/project.json`
(SHA-256
`79eb6349b3638aaebd03b21d7418c81756b21bc870a0db50b300badc00c5f851`); keep
that path intact because the accepted helper copies it into R0's compile cwd.
The validator takes the accepted workspace explicitly:

```sh
set -e
test ! -e target/slice09/run-cleanup-iteration02-2026-11-06
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/public-check.js,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" target/slice09/frozen-cleanup-iteration02-2026-11-06/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace
```

The check driver accepts seven arguments in this order:
`RUNROOT WORKSPACE PUBLIC-CHECK-JS ORCHESTRATE-JS CHILD-JS COMPILER CHILD-LYKN`.
The example below uses a fresh run root and generated products distinct from all
iteration01 receipts. The outer Deno process can read/write the task target and
unchanged workspace, and can start the pinned Deno process. The orchestrator's
Deno invocation grants only Deno and the exact pinned compiler for R0. The
staged child source is read beneath the already-granted task target:

```sh
set -e
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" --allow-write=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09 --allow-run=/opt/homebrew/bin/deno /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/check-helpers.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/run-cleanup-iteration02-2026-11-06 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/orchestrate.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/child-fixture.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/frozen-cleanup-iteration02-2026-11-06/child-fixture.lykn
```

`orchestrate.lykn MANIFEST RECEIPT-DIRECTORY` creates a new receipt path,
validates the action list, passes argv directly without a shell, and preserves
raw command bytes and status before stopping on failure. File copies refuse to
clobber existing destinations; comparisons record actual byte equality.
