Correction07 preflight chronology

Planning baseline before dependent checks: clean branch planning, HEAD 8d903dfa3b7376e37251465992c8911dfd62cedc.
Immutable parser-core source input: artifacts/tooling/parser-core.lykn, SHA-256 6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7.
Config-free copied source: /private/tmp/lykn-s19-correction07/source/parser-core.lykn; copied SHA-256 matches the source.
CLI: /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn, SHA-256 aa31947fd4bb0ae0024cf82380c8e076bc2b92ba4493fec4feade586058bfaf8, reports version 0.6.0.
Deno: /opt/homebrew/bin/deno, SHA-256 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74.
Acorn: literal cached file /Users/oubiwann/Library/Caches/deno/npm/registry.npmjs.org/acorn/8.17.0/dist/acorn.mjs, SHA-256 1cbcbf252a5800e496dc505c706f309a9dd4e1789392e12963c77ae9497ff6f7.
Output path: .worktrees/planning/target/slice19/correction07/modules/parser-core.js (gitignored by .git/info/exclude).
CWD: /private/tmp/lykn-s19-correction07/cwd. Exact ancestor project.json checks at this directory, /private/tmp/lykn-s19-correction07, /private/tmp, /private, and / returned no file.

Process deviation: the initial unchanged source evidence copy was briefly written at artifacts/evidence/cc/tooling/correction07-parser-core-source.lykn, immediately moved to the authorized correction07 directory as parser-core-source.lykn, and hash-checked unchanged at 6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7. No checker consumed the temporary location.

Unchanged-source native prerequisite completed: check, fmt --check, lint, and strict default compile each exited 0; raw stdout/stderr/exit receipts are stored beside this file. Compile used the exact final source/cwd/output paths recorded above. Actual generated parser-core.js SHA-256: 068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9; its complete emitted text is stored as parser-core.js and byte-compared to the ignored final module. The CLI emits no parser-core.d.ts in this output directory, and `lykn compile --help` exposes no declaration option. This absence is retained as observed; no alternate generator was used.

An earlier combined `ls`/hash/copy attempt returned the actual generated JS listing and a missing parser-core.d.ts error but its overall exit was not recorded. A later exact directory listing was recorded with exit 0 in core-output-listing-*.

Output-path reconciliation: the first unchanged-source compile used the planning worktree target path `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/target/slice19/correction07/modules/parser-core.js`. Planning target is not the ignored task output home. The byte-identical 068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9 module was moved, without overwrite, to the confirmed ignored task target `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice19/correction07/modules/parser-core.js`; the planning target directories created for the first attempt were empty and removed with `rmdir`. The private/tmp source copy and config-free CWD remain unchanged. All later core compiles must use the task-target output path and reproduce the already-observed hash.
