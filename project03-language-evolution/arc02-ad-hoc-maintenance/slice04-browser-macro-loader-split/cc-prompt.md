# S04 — Share expansion and split the Deno external macro loader

## Authority, intake and source

The Operator approved S04 then S05 in standard Autonomous Mode.
You are actual fresh Luna 6 High CC. Sol 6.1 High CDC owns planning
and independent acceptance. Task is
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/completion-value-flow`, exact `b0c97f4eb587e4a65273131fd9d2bbe0f63b3f8a`
(tree `35f154f186c6172fc380a8b0295c2ce06be37bda`). Release holds this base.
After your intake readback and handoff you own source/index/build.
Retain original attempts and return the clean source freeze and actual
proposed row dispositions. Use exact owned path commits with both
required trailers. Native shell, native tools and normal repo gates
are allowed. All authored research/evidence logic must be Lykn.
No Python or Node. Keep unmodified lock, cap and historical source.
S05 and release integration have separate execution boundaries.

Required full reads are task AGENTS, this prompt, plan, ledger,
the S04 and integration parts of
`../artifacts/browser-compiler-split-plan.md`, `packages/browser/{mod,compiler,scripts}.js`,
and `scripts/{bundle-size.js,check-bundle-size.sh}`.
Required sections are the complete `expand` and Pass 0 bodies
in `packages/lang/expander.js`, its imports and public exports,
the first import/initialization portions of `surface.js` and
`surface-helpers.js`, CLI `build_browser_bundle` and dist
`rewrite_imports`/stage/copy/export definitions, and embedded
cache and macro evaluator command. Inspect all imports/exports
and inspect the complete pinned baseline DOM report rows.
Required tests are relevant complete files found by
`rg --files test/expander test/integration | rg 'import-macros|macro-module|macro-entry'`
and the native `macro_dependencies.rs` m4 route and fixture helpers.
Readback actual file coverage, relevant contract, source paths,
and scope before edits. Recover truncation.

Installed skill roots are under
`/Users/oubiwann/Library/Application Support/ChatGPT-Profiles/personal/codex-home/skills`.
Use JavaScript/Deno performance ID-01, ID-30/31 and ID-33
(guide 08), and Rust error-handling EH-08/09 where applicable.
Use named entry points and declaration-only adapters so esbuild
can exclude the Deno graph. Measure actual result before claiming
savings. Preserve the existing recoverable Result path and sentinel
readiness in native cache. Follow testing validation gates and
engineering-methods intake. The ordinary Deno 2.9.6 PATH gate
and fixed Deno 2.7.7 meter are distinct.

## Implementation

1. Move current expansion logic to private `packages/lang/expander-core.js`.
   Keep its one macro map, gensym and existing surface type registry.
   Replace the public implementation entry internally with
   `expandWithMacroImports(forms, context, processImports)`.
   Preserve ordering of idempotent surface registration, existing
   context defaults and getter evaluation, reserved precheck, Pass 0,
   Pass 1/2, strict check and host-call materialization. Redirect both
   `surface.js` and `surface-helpers.js` import back-edges to the
   core. Do not expose any new core exports from published façades.
2. Move the old native/Deno loader block, cache and reset to
   private `macro-imports-deno.js`. The map, macro registering
   helper and AST helpers reference the one core instance. Keep
   recursive import ordering, aliases, duplicate/cycle checks,
   finally restoration, and mtime-based module cache. Extract a
   narrow private shared `parseMacroImport(form)` in
   `macro-import-form.js`: exact old head recognition, path and
   binding-list checks, return null for a non-import, otherwise
   path and original binding nodes. Both adapters use it. Further
   binding validation remains at its old location after Deno load.
   Restore `expander.js` as Deno façade with the exact previous
   named exports, including cache reset and diagnostic helpers.
   No wildcard that exposes internal names.
3. Implement private `expander-browser.js` synchronous façade and
   Pass 0 with the same parser. Share core, retain only rejection
   path, and return forms in ordinary no-import case. Real frozen
   browser diagnostics are in `artifacts/baseline/diag-{min,dev}.dom`.
   Preserve exact malformed and generic relative/parent/bare
   messages, absolute multi-tier message (including full path),
   and file URL behavior. For `file://`, construct URL to retain
   native invalid URL error, otherwise throw exact missing-module
   message. Registry schemes `jsr:`, `npm:`, `http:`, `https:`
   have Error, same wrapped specifier and resolution cause.
   Freeze cause spelling `import_meta.resolve is not a function`
   (existing dev) so both builds preserve the reason. Existing
   min `mo` is a generated local identifier only. Normalize only
   this proven prefix difference in the comparison.
4. Update resolver in both embedded CLI build script and
   `scripts/bundle-size.js` to statically redirect only
   `lang/expander.js` from actual `packages/browser/compiler.js`
   to the browser façade when the matching source file exists.
   Resolve all other aliases as before. Legacy trees without
   the adapter still use the old expander and shim. Apply the
   same selection logic and real browser entry in both paths.
   The package source `packages/browser/compiler.js` continues
   its Deno façade import. Staged rewrite remains
   `@lykn/lang/expander.js`, a real public export. No manifest
   change or public target/options. Verify CLI and meter build.
5. Mirror every changed/new `packages/lang` file byte-for-byte in
   the embedded crate. Use a private `<version>-expander-split`
   embedded cache directory in `embedded.rs`; sentinel keeps
   version bytes and same current-config/lock readiness semantics.
   Separate layouts avoid old and new binaries deleting each
   other's same-version cache. Update the sole hardcoded
   current path in native test `macro_dependencies.rs`. Verify
   old version path remains present during actual new cold/warm
   compiler runs. General atomic cache work has separate ownership.

Allowed product paths are those named above, their mirrors,
`crates/lykn-cli/src/main.rs`, `crates/lykn-lang/src/expander/embedded.rs`,
`crates/lykn-cli/tests/macro_dependencies.rs`, and a narrowly
targeted browser adapter regression in `test/expander/` if useful.
Other product paths need specific design justification and
coordination. Move old bodies mechanically to preserve behavior
and reviewability. Fix ordinary local failures autonomously.

## Proof

- Use actual accepted/rebuilt CLI `lykn build --browser` for
  min and dev artifacts. Freeze before/after complete DOM
  output using Lykn-authored driver and installed Chromium
  headless shell 1234. Compare the 15 cases in the existing
  diagnostic driver (14 errors and one exact code result) and
  verify exact inline macro code `2 + 2;\n`, sync `compile`/`run`,
  lax `.lyk`, strict `.lykn`, controlled `fetch` and document
  script order across inline → awaited external → inline.
  Use an owned file HTML fixture and Lykn-compiled fetch/trace
  driver. Real Chromium may need managed-sandbox escalation
  for Mach bootstrap; keep Chromium's own sandbox enabled
  and retain any actual failure. No substitute DOM.
- Use actual `lykn dist` and evaluate staged public package
  via its real export/import map. Staging rewrites the
  `lang/` imports. A fixture-only config may map already locked
  astring if required; do not edit staged product bytes.
  Check exact `compile/run/load` public names and sync/async
  contracts and successful Deno-backed local macro import
  from staged browser `compile`. Record actual artifact path
  and exact emitted bytes; confirm normalized package exports.
- Run deterministic existing public macro import (alias),
  duplicate/cycle, chain, registry-local overlay diagnostic
  fixtures, and native macro dependency tests. Warm/cold
  must observe the real module cache and embedded tree, not
  just use stable filenames. Native fresh, warm and old
  same-version sibling remain intact with pinned Deno cache.
- Compare browser metafile input graph and complete emitted
  IIFE against actual CLI bytes. Use native esbuild 0.27.4
  from the same Deno lock cache with the equivalent explicit
  browser alias and no node:path external fallback. Require
  complete min output equality to make graph attribution
  relevant. Deno loader and node shim inputs must be absent.
  Check actual CLI min/dev raw, minified and gzip sizes with
  the same Deno CompressionStream. Use Lykn for any new
  measurement driver. Exact unchanged historical meter
  requires `make bundle-size-check` with official 2.7.7
  (`/private/tmp/lykn-dd37-deno277.610gtfPO/deno`,
  SHA `d0edffcb55e0298d2ff4c639d2c3b64475072634ed8bee2cbcbf8803e9f3a9d2`),
  baseline 27,906 gzip and current base 44,844 on this host.
  Record actual candidate and delta, not an assumed 3,035.
- Finish normal unfiltered `make check`, standalone
  `make check-cited-paths`, explicit pinned-cache/fresh
  config-free roots, prelaunch argv/env/tool identity,
  complete raw outputs and all status values. Record package
  mirror and exact producers after the final build.
  Keep evidence under an owned `/private/tmp` root and send
  raw locators. CDC will independently replay against the
  final frozen source and archive needed originals.
