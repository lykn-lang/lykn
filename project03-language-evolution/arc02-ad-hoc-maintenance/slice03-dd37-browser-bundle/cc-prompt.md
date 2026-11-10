# Trace and bound the DD-37 browser bundle regression

## Authority and intake

Operator approved this bounded repair in standard Autonomous Mode.
Actual fresh Luna 6 High CC and separate Sol 6.1 High CDC. The
dedicated task checkout is
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/completion-value-flow`, clean exact
`487ebdbbae1758228f81383210eba419d64cc8ed`, tree
`05b5aa7a52cca1a32e65c5bd378c3a24ac12f5a7`. CC owns its build
and index only after intake readback. CDC owns planning and independent
review. No new worktree is needed. Release remains fixed.

Read this entire prompt, `slice-plan.md`, `ledger.md`, and the
task checkout's complete `AGENTS.md`. Read `docs/bundle-size.md`,
`scripts/check-bundle-size.sh`, `scripts/bundle-size.js`,
`packages/browser/{mod,compiler,scripts}.js`, and the current
`bundle-size` job and Make targets. In source read the expander
imports, `findProjectImports` through `loadMacroModule`, the
`expand` entry and `materializeExpandedHostCalls` call, the two
compiler host-invocation hooks and their definitions in
`packages/lang/host-invocation.js`, and `build_browser_bundle`
in native CLI `main.rs`. Check all package exports and all live
`compileWithHostInvocations` callers with rg. Read README's
browser API and import-macros boundary. Retain readback of what
the source shows and what remains an inference.

Installed guides under
`/Users/oubiwann/Library/Application Support/ChatGPT-Profiles/personal/codex-home/skills`:
JavaScript/Deno performance ID-01, ID-30/31 and ID-33
(`javascript-deno-guidelines/guides/08-performance.md`),
`scientific-methods/guides/07-comparison-and-regression-testing.md`,
and engineering-methods prompt-authoring intake section. Recover
truncations before claiming coverage. Apply performance ID-01 and
ID-33 (MUST) by measuring the actual gzip delta before proposing
a rewrite. Apply ID-30/31 (SHOULD) to test explicit unused-module
seams rather than universal removal or new load-time I/O.
Apply same-conditions comparison by holding entry, runtime, lock,
scripts and gzip method fixed. Verify actual scope with git.

No Python execution. Use native git, shell, Make, cmp/shasum and
the existing committed scripts. If additional research or
evidence logic is needed, author it in Lykn, compile with the
accepted native compiler, then use pinned Deno. The prescribed
three product-JS scratch diffs are ordinary controlled source
variants, not handwritten evidence drivers. No new dependency,
gate, baseline, allowance, remote CI, release mutation or push.

## Binding measurement

Use official Deno 2.7.7 executable
`/private/tmp/lykn-dd37-deno277.610gtfPO/deno`, SHA-256
`d0edffcb55e0298d2ff4c639d2c3b64475072634ed8bee2cbcbf8803e9f3a9d2`.
Verify version/platform and hash. Put that directory first on PATH
for this exact DD-37 launch. Explicit fixed
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`. Lock holds esbuild
0.27.4 and astring 1.9.0. Compare both revisions on the same
macOS arm64 and same frozen config/lock and script. Ordinary
release validation uses its separate Deno 2.9.6 contract.
Use fresh precreated `/private/tmp` TMPDIR/XDG/npm roots and exact
named config absence, plus durable prospective argv/cwd/env/locators
and separate raw stdout/stderr/exits. Record prelaunch script, config,
lock and producer identities. Keep distinct receipts per invocation.

On unchanged clean task run `make bundle-size-check` exactly.
Expected observed prior native Deno 2.7.7 fixed comparison is
27,906 → 44,844 gzip (+16,938, 11,818 above allowance). Keep actual
differences, exit and warning evidence. Expected gate status 2
comes from real threshold status 1 under Make. Do not use older
stored numbers for pass/fail. Root archive replay
`/private/tmp/lykn-dd37-release-pinned.l7eGLjlV` and older checkpoint
raw roots `/private/tmp/lykn-ci-bundle*` are historical sources.
Extract same-script raw/min/gzip and exact commit provenance from
actual receipts. Account for different Deno versions. Existing
diagnostic native esbuild attribution
`/private/tmp/lykn-dd37-native-attribution.XCJcdq1H` uses external
node:path and is a relative minified-byte clue, never the gate,
marginal gzip or a changed dependency graph claim.

## Three diagnostic variants and a decision

Export `packages`, `scripts`, `Makefile`, `project.json` and
`deno.lock` for exact `487ebdbb` into an owned clean source archive
per variant. Set read-only `GIT_DIR` from the real source Git
metadata and `GIT_WORK_TREE` to each archive for the native
baseline lookup. Test the actual archived cwd and no changes to
measurement files. Preserve exact variant patches, source hashes,
commands, raw and status. Use three variants only.

- Filesystem macro loader cut. Replace only the `expand` entry's
  `const afterPass0 = pass0ImportMacros(forms, filePath, compilationStack)`
  with `const afterPass0 = forms` in scratch
  `packages/lang/expander.js`. This intentionally severs the entire
  Deno-only pass0 graph to estimate its size. Inline Pass1/Pass2
  stays present. It is not a shippable product change. A true browser
  specialization must keep actual import-macros errors and current
  Deno-backed ESM behavior. The current browser's valid relative
  import reaches the throwing node:path shim. File and scheme routes
  have distinct current behavior, so generic rejection alone is
  not proven equivalent.
- Dormant ESTree bridge cut. In scratch `packages/lang/compiler.js`
  remove the internal import of `requestedHostCall` and
  `finalizeHostInvocations`, remove their early two lines in
  `compileExpr`, and call `generate(program, ...)` in `compile`.
  Keep protected host validation and `materializeExpandedHostCalls`
  untouched. Existing tree-wide live browser callers are not
  expected to enter the internal requested-host callback scope.
  Direct/clone/JSON ordinary kernel seams remain meaningful.
  This is an optimistic cut of accepted internal behavior,
  not permission to delete the tested bridge.
- Combined variant applies those exact two cuts. Measure the
  actual compression of the combination rather than adding
  marginal gzip figures. Compare all three to the exact task
  control and original source limit on pinned Deno 2.7.7.

Observe preserved public surface from source, including inline
macros, reserved/protected behavior and whole-unit support, and
identify what the proposed safe mechanism must keep. If the
combined cut still misses the unchanged allowance substantially,
return those measurements, remaining gap, exact code size
concentrations, and the genuine scope decision. Do not start a
large compiler rewrite, remove accepted features, modify measurement
to bypass the cap, or commit these variants. If evidence reveals
a concrete small route to actual passing budget while preserving
behavior, send the exact patch design for immediate CDC source
scope/fixture review under existing authority. Avoid speculative
multiple rewrites. For a real repair require unchanged public
exports and observable synchronous/asynchronous/DOM boundaries,
existing semantic/protected host suites, actual shipped
`lykn build --browser` output and behavior, mirrored code paths,
exact `make bundle-size-check`, normal unfiltered `make check`
and standalone citations. If no production change is justified,
report that explicitly and return clean source ownership. An
incomplete product gate remains open even when inquiry evidence
is complete.

Return actual commands, raw locators and measured table, then
propose row dispositions against the canonical ledger. CDC will
reproduce exact gate, decisive controlled comparison and analyze
the remaining product choice independently.
