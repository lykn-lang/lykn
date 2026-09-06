# CC Prompt — arc13 / slice04 · walker-extension

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x`. **Re:** Your slice03 finding, operator-confirmed
as a DD-60 refinement and packaged as its own small slice: the binding-
position list gains **`if-let`/`when-let` bindings and `match` clause
patterns** (DD-60's refinement log has the entry; which-child-surfaced =
you). Extend the walkers, D2, and the matrix probe. (Commit your slice03
staged source first if not yet done.)

## The work (MUST) — 4 rows

1. **F-1** — both walkers cover the 3 positions via the existing hook
   points (`bindings_introduced`/`bindingsIntroduced`) — no parallel
   enumeration; parity fixtures extended.
2. **F-2** — D2 rejects reserved words there, both backends; your own
   slice03 evidence repro (`(if-let (if x) …)`) now errors on both;
   DD-58-voice diagnostics.
3. **F-3** — extend `tools/conformance-matrix.js` with the new
   binding-position cells; baseline; re-probe shows **exactly** the new
   positions' D2 rows flipping — any pre-existing cell moving is a scope
   leak: stop and surface.
4. **F-4** — `make check` ✓; suites ≥1387/0 + new tests; three-way parity
   green; `./bin/lykn` everywhere.

## Discipline

If this work surfaces a **fourth** missed binding position, surface it as
a further DD-60 refinement — don't fold it silently (your slice03 move,
repeated). Closing report untracked; `docs/design-v0.6.0/**` is CDC's.
Bubble-up: hook-point notes for slices 05/06 (rust-/js-resolution) and
your judgment on whether the DD-60 list is now exhaustive.
