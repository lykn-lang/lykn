# Slice: move-function-rewiring (arc04 / slice02) — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-29
**Verdict: accepted — slice02 closed.** The tool's rewiring + batch capability is
delivered and proven; F-4's adaptation is honest and, in fact, surfaced a
significant cross-arc finding (see bottom).

## Verification (Linux sandbox: git + code review; runtime CC-attested)

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1…F-7 commits | **git-confirmed** all six slice02 commits are ancestors of `release/0.6.x` (`37196df e0c4b2d eb3b424→c8211ee f57954b→babc6a5 01dc09d→b4ab5b7 0b4304c`); TDD pairs intact. | reproduced (git) |
| F-2 atomic multi-file revert | **code-reviewed** `scripts/move-function.js`: `moveFunction` writes FROM/TO/all consumers, and on verify failure reverts **all three classes** byte-exact (`fromOrig`, `toOrig`, each `consumer.orig`) before throwing. The safety-critical row holds. | reproduced (code) |
| F-1/F-3/F-7 | code-reviewed: `rewireConsumer` + `importResolvesTo` (path-aware), `batchMove` (atomic-per-name, stop-on-failure), `runVerifyCommand` via `sh -c` (compound rebuild-first verify; no injected skip flags). | reproduced (code) |
| F-4 acceptance (adapted) | **Accepted.** The literal `andChain`/`classifier.js` scenario is unrunnable on `release/0.6.x` (the architecture isn't there — see finding). CC proved the capability on the real `toJsIdentifier` (compiler.js consumer): consumer rewired, back-import added, byte-identical body; the move's free-var entanglement triggered 294 failures → **atomic revert of all 3 files**, suite green (657/0), scratch discarded. The gate earning its keep on real code is stronger evidence than a contrived green. | attested + reasoned |
| F-5/F-6 | CC-attested (`deno lint` exit 0; 36 tool tests + 657 JS suite green). Host re-run to reconcile. | attested |

## Disposition

- Silent-drop check: 7 rows, 7 closed (6 done, F-4 done-adapted). `--batch-verify-once` is a disclosed sub-item deferral (track C). No silent drops. ✓
- safety-gate ethos honored (no injected skip flags); byte-identity preserved. ✓
- **slice02 closed.** With slice01, arc04's `move-function` tool is **built and
  proven**. Operator host re-run recommended to reconcile F-4/F-5/F-6.

## Finding bubbled up (beyond arc04 — to arc03 + project)

CC's F-4 caveat is a real, verified, cross-arc finding: **the M22 DD-37
architecture (`classifier.js`, `surface-helpers.js`, exported surface helpers)
does not exist on `release/0.6.x`.** CDC confirmed: `packages/lang/` has no
`classifier.js`/`surface-helpers.js`, `surface.js` still registers 36 macros,
and the M17–M22 commits (DD-58 + DD-37) are ancestors only of
`cdc/compiler-coherence`, not `release/0.6.x` (fork point `e462a67`, D-2). This
means arc03 slices 02–05 (DD-58) and 07–08 (DD-37) are **implemented but not
merged to the release branch** — arc03's close overstated "landed." Escalated to
arc03 `closing-report.md`, `project-plan.md`, and the operator (a merge/branch
decision is required). The M22.5-2/-3 extraction campaigns are blocked until the
architecture lands.
