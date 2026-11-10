# 0.6.x browser compiler split

Operator direction on 2026-11-10 sets the delivery order and the
release gate. The two refactors precede 0.6.0 publication. Apply the
80 KiB absolute gzip cap while continuing to report the difference
from the original DD-37 source. The release budget and the two
refactors have separate acceptance evidence.

The design baseline is release/0.6.x at `487ebdbb`. The independent
[DD-37 inquiry](../slice03-dd37-browser-bundle/cdc-verification.md)
measured 44,844 gzip bytes against the 27,906-byte historical
baseline on macOS with the CI Deno 2.7.7 pin. Experimental graph
cuts saved 3,035 bytes for the macro loader, 918 for the ESTree
bridge, and 3,943 together. Use those figures to prioritize.
Measure actual savings after each compatibility-preserving split.

The policy is committed locally as `b0c97f4e` on release/0.6.x.
The actual pinned `make bundle-size-check` passes at 44,844 bytes
and reports growth of 16,938 bytes. The same check in a scratch
archive with an oversized browser entry rejects 83,366 bytes at
the new 81,920-byte ceiling. Use `b0c97f4e` or its verified
descendant as the source integration base for implementation.

## S04 — Split browser expansion from the Deno macro loader

Own the first independently usable increment under AM-06.
Move the Deno-specific external macro loader behind a statically
selected Pass 0 adapter. Share the parsing of macro import forms,
the expansion pipeline, and its state. The Deno adapter owns path
and registry resolution, file I/O, recursive import and cache work.
The browser adapter owns the existing boundary for unavailable
external macros. It runs synchronously alongside the shared inline
macro and ordinary expansion passes.

At `487ebdbb`, `packages/lang/expander.js` combines both routes.
`surface.js` and `surface-helpers.js` also import expander helpers.
Trace those back-edges during the split so the browser entry cannot
pull the Deno façade in through shared imports. Keep a single
macro environment, gensym state, and type registry in each existing
compiler instance. Preserve registration, resets, macro export
aliasing, recursion and cache lifetime. The Deno façade keeps the
existing `expand` exports and context defaults.

Select the browser adapter at a module boundary. The actual CLI
`lykn build --browser` and DD-37 meter must use the same selection.
Keep the fixed baseline buildable with its historical shim and
retain measurement comparability. Review workspace import rewriting
in `crates/lykn-cli/src/dist.rs` before choosing any cross-package
adapter import. A new internal dependency must resolve from staged
artifacts without exposing an accidental public subpath. Preserve
the published ESM entry's observed Deno behavior as well as the
browser IIFE contract.

Acceptance evidence covers:

- The actual CLI-built browser bundle and staged `@lykn/browser`
  package. Freeze existing browser behavior for synchronous
  `compile` and `run`, asynchronous `load`, strict/lax handling,
  inline macros, and DOM script ordering. Test browser execution
  with the DOM and a controlled fetch response.
- Exact baseline diagnostics for malformed imports and for valid
  relative, absolute, bare, file-URL, and registry/scheme imports
  in the shipped IIFE. Preserve each observed class, including
  any distinct messages before the path resolver is reached.
- Existing Deno import-macro resolution, duplicate/cycle behavior,
  cold and warm cache behavior, and the native embedded compiler
  route with its own config and lock. Use existing deterministic
  local fixtures for registry resolution and linked overlays.
- A browser metafile and output check showing the Deno macro
  loader, `node:path` compatibility route, and its Deno file,
  cache, and subprocess code are absent from the shipped graph.
  Check the complete regenerated embedded package against
  canonical source. Record before/after raw, minified, and gzip
  bytes with the CI-pinned meter and actual CLI artifact.

## S05 — Split the private ESTree invocation bridge

Own AM-07. Start from independently accepted S04. The current
`packages/lang/compiler.js` calls `requestedHostCall` and
`finalizeHostInvocations` from the private bridge. Ordinary
expansion already materializes lazy host calls as normal kernel
forms through `materializeExpandedHostCalls`. Keep that live
kernel route and protected-host validation in the browser.

Give the private request scope, ESTree anchors, and finalizer
their own module boundary. Route normal browser compilation
through the ordinary lowering and printer. Prefer statically
selected ordinary behavior using the S04 seam where a shared
import would otherwise retain the bridge. Retain the existing
explicit private caller and its request lifetime checks. Keep
shared invocation constants or validation shared where both
paths really use them. Preserve the existing public compile
signatures and ordinary kernel direct/clone/JSON entry routes.

Acceptance evidence covers:

- The browser graph and output exclude the private ESTree
  request/finalization machinery. Prove ordinary output,
  live lazy support, and the existing protected-write rejection
  against the pre-split controls.
- Private invocation tests cover request identity, duplicate,
  orphaned, nested, and incomplete plans, name collisions, and
  the local helper and shadowed-Reflect inline ESM fallback.
  Preserve the established distinction between browser
  `compile` returning ESM text and `run`/`load` using eval.
- Recheck S04 browser and Deno behavior on the composed tree.
  Reproduce the existing retained and shaken generated-program
  controls, including the preserved module startup effect.
  Measure S05's incremental and the combined bundle savings
  with the same lock, historical source, runtime, and gzip method.

## Integration and release gate

Open each numbered implementation slice and its ledger against the
actual starting tree when execution is commissioned. Use separate
commits for S04 and S05 and independent review of each. Exercise
focused JS/Deno, native embedding, and staged package checks, then
the unfiltered `make check`, `make check-cited-paths`, and the
actual `make bundle-size-check`. Retain full package and runtime
outputs for each accepted stage.

Integrate the independently accepted composition into release/0.6.x
under the release integration authority. Repeat the release checks
on that exact candidate and satisfy the
[0.6.0 release gates](../../../project02-language-toolchain-alignment/arc09-release-0.6.0/arc-plan.md).
Record the hard-cap decision separately from actual byte savings.
The [0.7.x AOT roadmap](../../BACKLOG.md#ahead-of-time-application-builds-07x)
owns application packaging and application-size acceptance.

## Accepted task composition

S04 `cc806c84` and S05 `685bbe1d` have independent source and
product acceptance. The fixed meter reports 42,221 gzip bytes
after S04 and 41,338 after S05 against 44,844 at `b0c97f4e`.
The original 27,906-byte baseline remains part of the report.
[Actual composition evidence](../slice05-browser-estree-bridge-split/cdc-verification.md).

The accepted task composition awaits release integration and checks
under the separate release gate above.
