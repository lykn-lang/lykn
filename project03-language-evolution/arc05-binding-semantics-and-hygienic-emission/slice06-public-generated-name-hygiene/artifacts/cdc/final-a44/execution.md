# Independent final-a44 execution receipts

2026-11-14, `arc05_s06_cdc`, OpenAI gpt-6.1-sol/high. Validation-only exclusive
ownership; no product/Git mutation. Worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
`codex/qualified-adt-core`, clean source
`a44e16db96ca4ae76de124b555c34ffe2c2779ba`, tree
`4080ee3f7be200610814b39b4118d2b5f3062ca8` checked before launch.

Evidence root is this `artifacts/cdc/final-a44/` directory in the canonical S06
planning slice. Runtime environment for every gate:

```text
TMPDIR=/private/tmp/lykn-arc05-s06-cdc/tmp
XDG_CACHE_HOME=/private/tmp/lykn-arc05-s06-cdc/xdg
NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s06-cdc/npm
DENO_DIR=/Users/oubiwann/Library/Caches/deno
```

The three owned temporary directories, this evidence root and its DISTINCT
`m6-evidence/` were created by direct mkdir and verified by direct ls before
setting TMPDIR. Both commands returned terminal exit0 with no session. Deno
dependencies are explicitly warm; neither cold external resolution nor cold
Cargo compilation is claimed.

## Gate receipts

1. `make fresh-artifacts`, same environment, stdout/stderr directly redirected
   to `fresh-artifacts.stdout`/`.stderr`: exec_command terminal exit0, no session,
   chunk0bbd35. Release profile optimized; refreshed lang/browser/testing build
   packages. No pre-refresh focused run occurred.
2. `deno test --config project.json -A test/forms/public-generated-names.test.js
   test/forms/icu-generated-names.test.js test/forms/lazy-protected-invocation.test.js
   test/forms/remaining-discard-bindings.test.js test/forms/dd-37-classifier-pilot.test.js
   test/forms/host-reference-lowering.test.js test/forms/browser-host-reference-compile.test.js
   test/forms/discard-bindings.test.js`, stdout/stderr directly redirected to
   `focused.stdout`/`.stderr`: initial exec session44107 (chunka6cdc6), terminal
   write_stdin exit0/no session (chunkbc773e). Actual42 passed/0 failed across
   eight paths, including all8 new groups. Stderr contains the eight ordinary
   Deno Check notices, not test failures.
3. One `make check`, same environment plus
   `LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR=/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice06-public-generated-name-hygiene/artifacts/cdc/final-a44/m6-evidence`,
   stdout/stderr redirected directly to `make-check.stdout`/`.stderr`.
   Initial exec session48535 (chunkb75763). Standard authorized escalation
   permits pinned test dependency access; no dependency or cold-test semantics
   were changed. Intermediate polls remained running; terminal write_stdin
   returned exit0/no session (chunke98139). One full invocation, docs once,
   with no independent retry or failure. Actual42 Rust result records total
   1798 passed/0 failed/0 ignored, including native Lang1217; full JS/Lykn
   1586 passed/67 steps/0 failed; docs482 passed/0 failed, generated22 files,
   15 skipped blocks and nine informational no-block files. Compiled99 Lykn
   test files. The release build is optimized; dev/test profiles are
   unoptimized + debuginfo. M6 copies Cargo's test/dev CARGO_BIN_EXE_lykn,
   not the optimized release binary.
4. Separate final-HEAD `make check-cited-paths`, same environment, streams in
   `final-citations.stdout`/`.stderr`: exec terminal exit0/no session,
   chunk50bf3c; actual64 docs/601 historical citations. This is additional to
   the citation check already included in make check.
5. Separate fresh `make bundle-size-check`, same environment, streams in
   `bundle-size.stdout`/`.stderr`: exec terminal exit0/no session,
   chunk5ae40e. Current raw388047/minified184990/gzip50162 bytes; same-tool
   baseline commit4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0 has gzip27630,
   delta22532. Current50162 is below81920. Deno2.9.6, V8
   15.0.245.2-rusty, TypeScript6.0.3. Stderr retains esbuild registry download
   notices and existing astring package condition-order warnings.

## Inspected delivery and limits

All15 `m6-evidence/m6-embedded-delivery-*.comparison.txt` files were read:
both canonical_equals_embedded and canonical_equals_materialized are true
in every file. Exact bytes/name mapping and actual strict8-path/78 result,
command/config/status/cache scope are in the authoritative final validation
append to `../../../cdc-verification.md`.

M6 strict stderr is0 bytes; standalone compile stderr retains five fixture
warnings (unreachable clause and four unused bindings), so delivery compile
stderr is not described as empty. Full streams and generated/source bytes
remain in the distinct M6 directory. Child executable resolves to
/opt/homebrew/Cellar/deno/2.9.6/bin/deno; macro child argv is not separately
traced. Warm shared DENO_DIR remains explicit; fixture-owned XDG materialization
does not establish cold dependency/network resolution.

The fresh full stream reports DD-53 R-5 outer test ok, but does not expose
its console branch marker. Its actual source permits early return on missing
JSR permission/reachability; therefore this independent run makes no external
JSR registry-path or cold-network claim. CC's separately retained full run
explicitly recorded its unreachable-JSR skip; that is CC evidence, not a
fresh independent observation. No extra network probe or rerun was performed.

Post-gate direct Git status is empty and HEAD/tree remain the exact reviewed
a44/4080 pin. All execution sessions terminated; validation returns no jobs.
No product edit, Git mutation, policy/cache semantic change, native follow-up
probe, release integration or S07 work occurred. Earlier failed, interrupted,
unknown and discarded attempts remain separate historical receipts.
