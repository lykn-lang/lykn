# Independent correction6 replay — before full acceptance

CDC Sol6.1 High, source96e20b98095f64fb7f27e8431c6c7ba958b645b4, 2026-11-06.
Reviewed the complete one-function diff: non-value-tail statements delegate to
existing emit_body/out.extend with context restoration; value-tail expression
lowering remains unchanged. Tests, five fixtures, expected JSON, JS and mirror
are unchanged from802. No code was authored by CDC.

Copied actual CC-built lib-test/CLI to separate owned
`/private/tmp/lykn-s15-cdc-96e20b9/`, verified hashes before execution (pins.txt).
No shared build/cache/index writes during these independent executions. Actual
absolute libtest argv: `libtest --exact
emitter::forms::tests::test_emit_bind_group_in_function_body_stays_sibling_scoped
--nocapture` with executable prefix `/private/tmp/lykn-s15-cdc-96e20b9/`.
Exit0,1passed/1122filtered, raw streams adjacent. Test binary built by CC from
the frozen source; subsequent independent normal full Make remains required.

Copied immutable current five fixtures before compile. Cwd was this genuinely
config-free scratch directory; native ancestor config absence receipt retained.
Each actual argv was `/private/tmp/lykn-s15-cdc-96e20b9/lykn compile
/private/tmp/lykn-s15-cdc-96e20b9/E1.lykn -o
/private/tmp/lykn-s15-cdc-96e20b9/E1.js` with corresponding literal E2–E5 paths.
All compile0; original E2/E5 unused-binding warnings retained, no filtering.
Read COMPLETE generated modules before runtime. Each actual runtime argv:
`/opt/homebrew/bin/deno run --no-config --cached-only --no-npm --no-remote
--deny-net --no-prompt /private/tmp/lykn-s15-cdc-96e20b9/E1.js` (literal E2–E5).
Environment: `env -i PATH=/opt/homebrew/bin:/usr/bin:/bin
DENO_DIR=/private/tmp/lykn-s15-cdc-96e20b9/deno-cache DENO_NO_UPDATE_CHECK=1
NO_COLOR=1`. No grants. All5 runtime exits0/empty stderr, exact frozen JSON
including new E5 sibling-scope outputs; source/generated/results read before
claiming pass. Per-case full generated JS and raw output/status retained.

Independent public product test: task cwd,
`env DENO_DIR=/Users/oubiwann/Library/Caches/deno DENO_NO_UPDATE_CHECK=1 NO_COLOR=1
/opt/homebrew/bin/deno test --config
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/project.json
--allow-read --allow-write --allow-run --cached-only
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/test/forms/async-expression-values.test.js`.
Exit0,1test/5steps; all5 child code0/empty stderr/exact JSON. Complete generated
module/source fields read, including changed E5 input. Existing cached product
JSR/astring inputs only; child strict offline/no-grant argv remains unchanged.

Retrieved SAME complete core from immutable13fd27f: SHA6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7.
Actual native compile command is the above absolute CLI with parser-core.lykn/js
paths substituted, exit0/warnings retained. New output SHA068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9,
identical to the already retained full body in ../cdc-repair/parser-core.js;
complete new body manually read. Actual Deno argv/env is above with parser-core.js.
Exit0/empty streams, no permissions/inputs/entry function call/Acorn import.
This is genuine module-load proof, not DenoCheck-only or four parser observations.

Normal full Make/source acceptance remains pending at this evidence cutoff.
No claim that focused successes supersede failed old gates or process violations.
