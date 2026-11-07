# Exact existing-case independent replay

Source3f8f6dfe6177db7233932dc6c8938993655a1cae, source worktree cwd
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Verified actual release/compiler, Deno, generated test and helper hashes BEFORE
the executions (pins.txt). Both separate invocations used:

```text
env LYKN_BIN=/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn DENO_DIR=/Users/oubiwann/Library/Caches/deno NO_COLOR=1 DENO_NO_UPDATE_CHECK=1 /opt/homebrew/bin/deno test --config /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/project.json --no-check -A --cached-only --filter <EXACT NAME BELOW> /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/lykn/test/test/forms/dd-50_test.js
```

- switch-if: `DD-50.5 addendum: no-else if in switch case body — both compilers agree`
- switch-or: `DD-50.5 iter3: surface or inside switch case body`

Each literal full name was one quoted argv value. --no-check/-A are the existing
repository contributor test route from main.rs run_deno_test, not newly injected
suppression/grants; --cached-only restricts it to the existing graph. The existing
compileBoth harness uses its documented --no-strict coherence comparison, not an
authored-source strict gate waiver. LYKN_BIN names the ABSOLUTE pinned final
compiler edafa7067f481bdc4f61d412bd6ba68853ba018341914e9b8c3ab2b30912b987.

Each exact existing test selected1, failed1, filtered33, exit1; streams/exits
retained BEFORE interpretation. No new source specimen or runtime variant.
JS retains conditional console.log inside case1; Rust emits a COMPILE_ERROR
TypeError throw instead. This is actual emitted-output divergence, not an
executed runtime throw or invalid-JS parsing claim. No parser observation ran.

Generated test/helper copies were retained after execution, with hashes rechecked
identical to the pre-run pins. No build/source change intervened; these are actual
observed bytes, not reconstructed substitutes. Source fixtures remain immutable
at test/forms/dd-50_test.lykn126–129 and189–191. Prior independent Slice14 full
Make reports both cases passed at lines2066/2078 of artifacts/cdc-stage-b/make-check.log.
