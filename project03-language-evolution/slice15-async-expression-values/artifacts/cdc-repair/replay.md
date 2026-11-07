# Independent CDC repair replay — partial, before full acceptance

CDC Sol6.1 High, 2026-11-06. Source frozen54608a7c463ea0386c9fade45d57d66da45050b9,
branch codex/async-expression-values. This is an actual independent execution,
not a relabeled CC result. Full Make/source acceptance remains pending.

Copied the built debug CLI into owned config-free
`/private/tmp/lykn-s15-cdc-54608a7/lykn`, SHA256
`6cb24b83593f837400c95299465f24fc1db040f2560f5e1737ab80d90e8e19cc`.
Deno `/opt/homebrew/bin/deno` SHA256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
No project.json/deno.json exists at /, /private or /private/tmp (literal ls
absence check exited1). Copied unchanged E1–E5 sources here before compilation;
full bodies/generated modules/raw outputs are adjacent. No source/cache/index
owned by CC was written during this parallel immutable-candidate replay.

For each literal E1, E2, E3, E4, E5 filename, cwd was the scratch directory.
Actual strict argv was `/private/tmp/lykn-s15-cdc-54608a7/lykn compile
/private/tmp/lykn-s15-cdc-54608a7/E1.lykn -o
/private/tmp/lykn-s15-cdc-54608a7/E1.js` (corresponding exact E2–E5 paths).
Each stdout/stderr/exit was saved separately before runtime. All compile exits0;
E2/E5 retain unused-binding warnings. No declaration sidecars were produced.

Manually read the COMPLETE five generated modules before invoking Deno. Each
actual runtime argv was `/opt/homebrew/bin/deno run --no-config --cached-only
--no-npm --no-remote --deny-net --no-prompt
/private/tmp/lykn-s15-cdc-54608a7/E1.js` (corresponding E2–E5). Environment was
`env -i PATH=/opt/homebrew/bin:/usr/bin:/bin
DENO_DIR=/private/tmp/lykn-s15-cdc-54608a7/deno-cache
DENO_NO_UPDATE_CHECK=1 NO_COLOR=1`; no permission grants. Outputs/statuses
were saved first, then inspected. All5 exits0, empty stderr, exact corrected
correction02 JSON: synchronous number41/42 and prefix effect; selected-path trace
and awaited42/7; Promise identity/then/resolved9; deferred callback counts; selected
throw/rejection messages and preserved outer scope. This is finite proof, not a
universal scheduler/host-mutation claim.

Also independently ran existing public JS product test on the SAME source:
`env DENO_DIR=/Users/oubiwann/Library/Caches/deno DENO_NO_UPDATE_CHECK=1 NO_COLOR=1
/opt/homebrew/bin/deno test --config
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/project.json
--allow-read --allow-write --allow-run --cached-only
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/test/forms/async-expression-values.test.js`.
Cwd was that source worktree. Existing cached compiler inputs only; generated
children use the test's offline/no-permission argv. Full preassert source/generated
modules and runtime receipts read: all5 exact expected JSON/exit0/empty stderr;
Deno reports1 test/5 steps, exit0.

## Same complete-core corroboration

Retrieved parser-core.lykn from immutable13fd27feed2c3e6b4c0de37835f9edab602cee47,
Slice14 artifacts/stage-c/tooling. Verified SHA256
`6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7`.
Same scratch cwd/compiler: actual argv was
`/private/tmp/lykn-s15-cdc-54608a7/lykn compile
/private/tmp/lykn-s15-cdc-54608a7/parser-core.lykn -o
/private/tmp/lykn-s15-cdc-54608a7/parser-core.js`. Exit0; unused-binding warnings
retained. JS SHA256 `068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9`,
byte-equal to CC's correction04/core-generated.js (cmp0). Complete module read:
loadParser now returns the mismatch/ready/version result, and its dynamic import
lies inside an async value IIFE with the private value carrier. No top-level entry
function call/import occurs. Actual module argv was the same no-permission/offline
Deno command above, replacing E1.js with parser-core.js. Exit0, empty streams,
raw receipts adjacent. This proves the previous hard module-parse witness is
resolved on the same source; it does not execute any of the four parser controls
or establish parser capability. DenoCheck0 is not used as the validity oracle.

## Preserved reviewer method deviation

First compile-only batch used `./lykn` in the same verified scratch cwd instead
of the assignment's required ABSOLUTE path. It was the verified copy, not global
lykn, but its argv did not follow the explicit instruction. All five original
compile outputs/generated bodies remain in compile-relative-attempt01. Repeated
all five with the absolute path BEFORE any runtime. A native mv preservation
command also named nonexistent .d.ts sidecars and exited1; existing files moved
successfully. Their absence is retained, not a compiler failure. Neither event
is retroactively labeled compliant. No Python or alternate research helper was used.
