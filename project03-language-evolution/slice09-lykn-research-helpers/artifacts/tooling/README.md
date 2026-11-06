# Slice09 Lykn research helpers

These small local helpers replace the scoped public-export validator and the
needed process/copy/compare orchestration. Logic lives in Lykn. The only
temporary Python use is execution of the exact, unmodified, hashed Slice08
validator once against its accepted hardcoded workspace for migration parity;
CDC review must precede its separately authorized deletion. Do not add another
Python program or wrapper, or replace these helpers with another scripting
language.

## Pins and compile

Use the accepted task binary and Deno 2.9.6:

- `target/release/lykn`, SHA-256
  `544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`
- `/opt/homebrew/bin/deno`, SHA-256
  `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`

From `lang/.worktrees/contract-predicate-lowering`, prepare the isolated
compiler project and compile the four sources in default strict mode:

```sh
mkdir -p target/slice09/empty
cp test/integration/publishing/fixtures/consumer-local/project.json target/slice09/empty/project.json
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/public-check.lykn target/slice09/empty/public-check.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/orchestrate.lykn target/slice09/empty/orchestrate.lykn
cp /Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/check-helpers.lykn target/slice09/empty/check-helpers.lykn
cp target/slice09/child-fixture.lykn target/slice09/empty/child-fixture.lykn
target/release/lykn check target/slice09/empty/public-check.lykn target/slice09/empty/orchestrate.lykn target/slice09/empty/check-helpers.lykn target/slice09/empty/child-fixture.lykn
target/release/lykn fmt -w target/slice09/empty/public-check.lykn target/slice09/empty/orchestrate.lykn target/slice09/empty/check-helpers.lykn target/slice09/empty/child-fixture.lykn
target/release/lykn lint target/slice09/empty/public-check.lykn target/slice09/empty/orchestrate.lykn target/slice09/empty/check-helpers.lykn target/slice09/empty/child-fixture.lykn
target/release/lykn compile target/slice09/empty/public-check.lykn -o target/slice09/public-check.js
target/release/lykn compile target/slice09/empty/orchestrate.lykn -o target/slice09/orchestrate.js
target/release/lykn compile target/slice09/empty/check-helpers.lykn -o target/slice09/check-helpers.js
target/release/lykn compile target/slice09/empty/child-fixture.lykn -o target/slice09/child-fixture.js
```

Inspect all generated JavaScript after compiling; these files are disposable
outputs and stay below the task's ignored `target/slice09/`.

## Direct runs and permissions

Run the public validator with an explicit workspace argument:

```sh
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/public-check.js,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" target/slice09/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace
```

Run the fixed controls with read/write access restricted to the task target,
read access to the unchanged accepted workspace, and subprocess permission only
for the pinned Deno executable:

```sh
/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt --allow-read="/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09,/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace" --allow-write=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09 --allow-run=/opt/homebrew/bin/deno target/slice09/check-helpers.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09 /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/public-check.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/orchestrate.js /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice09/child-fixture.js
```

`orchestrate.lykn MANIFEST RECEIPT-DIRECTORY` requires an unused receipt path.
Its command entries use absolute executable, cwd, and argv values; it never
passes command text through a shell. Its file actions are byte-oriented, and
all receipt directories and files are created without replacing existing
paths. Use only the fixed local cases when reviewing these controls.
