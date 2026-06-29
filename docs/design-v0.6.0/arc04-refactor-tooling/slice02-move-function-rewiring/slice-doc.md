# Slice: move-function-rewiring (M22.5-T1b)

> Reconstructed retroactively (2026-06-28); scoped 2026-06-28; **closed
> 2026-06-29** (CC-attested; awaiting CDC verification). Depends on slice01 (closed).

## Goal / scope
Extend `scripts/move-function.js` so a move also **rewires cross-file consumers**
(modules importing the moved name) and supports **batch mode** (`--names`), with
atomic multi-file revert on verify failure. Proven on a **scratch** `andChain`
move (`surface.js` → `surface-helpers.js`, rewiring `classifier.js`) — nothing
lands. This completes the tool so the real extraction campaigns can run with it.

## Status
Closed (2026-06-29). Cross-file rewiring + atomic multi-file revert + batch mode
+ rebuild-first verify added to `scripts/move-function.js` (TDD-first). 36 tool
tests + 657 JS suite green; `deno lint scripts/` clean. **F-4 adapted:** the
literal andChain/classifier scenario doesn't exist on `release/0.6.x`, so the
rewiring capability was proven on the real `toJsIdentifier` (compiler.js consumer
= surface.js); a fully-green real extraction is deferred to M22.5-2 (which must
build the surface/helpers split and handle free-var deps first). No extraction
landed.

## Key constraint (slice01 bubble-up)
The acceptance runs the full suite against built `lang/`, so the verify must
**rebuild first** (`lykn build && deno test -A test/`) or reuse arc03/slice11's
freshness guard — else a stale build dir manufactures false green/red.

## Out of scope (later slices)
The real **M22.5-2** (10-helper extraction) and **M22.5-3** (4 complex-form
extraction) campaigns. slice02 only proves the capability.

## Artifacts
- `cc-prompt.md` — the CC assignment (T1b spec + CDC handoff)
- `ledger.md` — 7-row ledger, walked at close
- `closing-report.md` — per-row walk + bubble-up to arc04 (incl. the import-shape
  / free-var findings the real M22.5-2/-3 moves must handle)
- `scripts/move-function.js` (+ test) — now with cross-file rewiring + batch

## Close set
`cdc-verification.md` — CDC reproduces F-1…F-7. Closing slice02 completes arc04's
tool build; the extraction campaigns (M22.5-2/-3/-4) follow as their own slices.
