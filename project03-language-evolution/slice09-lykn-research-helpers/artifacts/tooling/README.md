# Slice09 Lykn research helpers

These small local helpers replace the scoped public-export validator and the
needed process/copy/compare orchestration. Logic lives in Lykn. The only
temporary Python use is execution of the exact, unmodified, hashed Slice08
validator once against its accepted hardcoded workspace for migration parity;
CDC review must precede its separately authorized deletion. Do not add another
Python program or wrapper, or replace these helpers with another scripting
language.

## Pins and compile

Use this accepted task binary and Deno 2.9.6. Verify these hashes before every
captured check, lint, format, compile, or runtime invocation:

- `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn`, SHA-256
  `544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`
- `/opt/homebrew/bin/deno`, SHA-256
  `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`

From the contract-predicate-lowering worktree, use the explicit empty compiler
project recorded by CDC, then check, format, lint and compile each source in
default strict mode. Do not use the publishing-fixture project config:

```sh
mkdir -p target/slice09/empty
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/evidence/cdc-pin-recheck/project.json target/slice09/empty/project.json
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/public-check.lykn target/slice09/empty/public-check.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/orchestrate.lykn target/slice09/empty/orchestrate.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/check-helpers.lykn target/slice09/empty/check-helpers.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/child-fixture.lykn target/slice09/child-fixture.lykn
cp target/slice09/child-fixture.lykn target/slice09/empty/child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check target/slice09/empty/public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check target/slice09/empty/orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check target/slice09/empty/check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn check target/slice09/empty/child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w target/slice09/empty/public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w target/slice09/empty/orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w target/slice09/empty/check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn fmt -w target/slice09/empty/child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint target/slice09/empty/public-check.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint target/slice09/empty/orchestrate.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint target/slice09/empty/check-helpers.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn lint target/slice09/empty/child-fixture.lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile target/slice09/empty/public-check.lykn -o target/slice09/public-check.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile target/slice09/empty/orchestrate.lykn -o target/slice09/orchestrate.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile target/slice09/empty/check-helpers.lykn -o target/slice09/check-helpers.js
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn compile target/slice09/empty/child-fixture.lykn -o target/slice09/child-fixture.js
```

Inspect all generated JavaScript after compiling; these files are disposable
outputs and stay below the task's ignored `target/slice09/`.

## Direct runs and permissions

Run the public validator with an explicit workspace argument:

```sh
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/public-check.js,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" target/slice09/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace
```

Choose a fresh `RUNROOT` below `target/slice09/`. The check driver accepts seven
arguments in this order: `RUNROOT WORKSPACE PUBLIC-CHECK-JS ORCHESTRATE-JS
CHILD-JS COMPILER CHILD-LYKN`. Its outer Deno process can read/write the task
target and unchanged workspace, and can start the pinned Deno process. The
orchestrator's own Deno invocation grants subprocess access to Deno and the
exact compiler path for R0:

```sh
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" --allow-write=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09 --allow-run=/opt/homebrew/bin/deno,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn target/slice09/check-helpers.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/run-iteration01-2026-11-06 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/orchestrate.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/child-fixture.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/child-fixture.lykn
```

`orchestrate.lykn MANIFEST RECEIPT-DIRECTORY` requires an unused receipt path.
Its command entries use absolute executable, cwd, and argv values; it never
passes command text through a shell. Its file actions are byte-oriented, and
all receipt directories and files are created without replacing existing
paths. Use only the fixed local cases when reviewing these controls.
