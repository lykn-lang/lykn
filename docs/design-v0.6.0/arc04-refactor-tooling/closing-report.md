# arc04 — Refactor Tooling (`move-function`) — Arc Closing Report

> Arc-level close + bubble-up, written by CDC (2026-06-29) after all five slices
> closed. Per `collaboration-framework/docs/PROJECT-MANAGEMENT.md` Part V and
> `templates/LEDGER-DISCIPLINE.md` §B. This is arc04's composition check.

## 1. Capability restated + verdict

**Capability:** a byte-exact `move-function` tool that relocates declarations
without changing their text, then rewires consumers — *the tool the M22.5
surface-extraction workstreams are executed with* — and the surface extraction it
drives.

**Verdict: delivered, in full.** The tool was built and proven (slices 01–02),
then drove the complete surface extraction (slices 03–05): every helper and
complex-form emitter moved out of `surface.js` **byte-identical, by the tool,
never reimplemented** — including `emitMatchMacro`, the exact function M22 broke
by rewriting. DD-37's implementation migration is finished and the JS lint slate
is green.

## 2. Slice walk

| Slice | Outcome |
|-------|---------|
| slice01 move-function-core (M22.5-T1a) | Delivered — verbatim-move core, byte-identity invariant (CC+CDC verified) |
| slice02 move-function-rewiring (M22.5-T1b) | Delivered — cross-file rewiring + batch + atomic multi-file revert |
| slice03 helper-extraction (M22.5-2) | Delivered — 10 helpers moved byte-identical; first real extraction (`266ff3d`) |
| slice04 complex-form-extraction (M22.5-3) | Delivered — 4 complex emitters + support moved byte-identical incl. `emitMatchMacro`; `typeRegistry` single-instance (`ff481b4`) |
| slice05 cleanup (M22.5-4) | Delivered — dead code removed; `deno lint packages/` exit 0 (`6c9de6d`) |

Slice count (5) matches the arc-plan breakdown. No arc-scale silent drop.

## 3. Composition check (reproduced at arc scale)

Do the slices recompose into the capability? **Yes** — demonstrated across the
campaign:

- **The tool drove every move** — no body was hand-written or reimplemented;
  byte-identity held on all moved functions across slices 03–04 (CDC byte-diffed
  `emitMatchMacro`).
- **`surface.js` reduced 2,315 → 448 lines** (pre-DD-37 → now); all extractable
  form logic now lives in `classifier.js` ("Option C"), which imports **nothing**
  from `surface.js` (the DD-37 dependency inversion is complete).
- **Behaviour preserved throughout** — the cross-compiler corpus stayed **1345/0**
  and `deno test` **658/0** at every slice, including the `type`/`match` ADT
  round-trip through the single shared `typeRegistry`.
- **JS lint green** — `deno lint packages/` exit 0 (the standing debt since the
  cdc/compiler-coherence merge, closed in slice05).

This is the class-(b) composition evidence, reproduced at arc scale (cumulative
green suite + the structural reduction + byte-identity), not inherited from slice
attestations. Runtime rows are CC-attested; an operator host re-run reconciles.

## 4. Arc-plan change log (accumulated)

- Scope **expanded** from "build the tool" (the original arc04) to "the
  move-function refactor end-to-end: build the tool *and* drive the surface
  extraction" — slices 03–05 added as the campaign (recorded in arc-plan v1.1–v1.4).
- A-3 (real green move) moved deferred → **done** (slice03).
- The tool gained a **TDD'd TO-as-consumer import-prune** capability (slice04) —
  a permanent improvement enabling clean moves into a file that already imports
  the symbol.
- Two staleness traps (stale binary, stale build-dir) guarded along the way
  (slice02/arc03-slice11).

## 5. Bubble-up to the project

1. **Did arc04 deliver its capability as `project-plan.md` defined it?** Yes —
   the tool *and* the DD-37 implementation migration it was built to drive.
   Project-ledger **P-4 → done/composed.**
2. **What did arc04 reveal the project plan didn't anticipate?**
   - **DD-37 step 4 (`_kernel` marker removal)** is a remaining follow-up —
     `_kernel` is still load-bearing in `expander.js`'s core dispatch, so its
     removal is an architectural change, not cleanup. Surfaced (slice05), **not
     yet scoped** — a candidate future arc/slice (or a DD). Recorded at project
     level.
   - The `move-function` tool is now a **reusable asset** beyond this campaign
     (any future module split).
   - A tool-enhancement candidate remains: prune now-unused imports in the FROM
     file post-move (CC hand-cleaned these twice).
3. **Silent-drop diff at arc scale:** none. M22.5-1 (audit, input) → M22.5-2/-3/-4
   all delivered; `_kernel` removal is *disclosed-deferred with rationale*, not
   dropped.

## 6. Check (independence) + What Worked

Slice-level closes were CC-implemented / CDC-verified; this arc close is CDC-
assembled. **Operator host re-run recommended** to lift the runtime rows
(corpus/lint) to reconciled.

**What worked:** the slice01/02 byte-identity invariant made the high-stakes
slice04 moves boring (the right kind of boring); dependency-analysis-first
(acorn free-var scans) turned entangled moves into safe ordered sequences;
"fix the tool, not the move" (the TO-as-consumer enhancement) kept `emitMatchMacro`
verbatim. **What recurred:** stale-artifact traps — now permanently guarded.

**arc04 is closed.**
