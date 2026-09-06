# CC Prompt — arc04 / slice04 · complex-form-extraction (M22.5-3)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-29
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** The **hardest, highest-stakes extraction** — move the 4 complex-form
emitters (`match`/`type`/`genfunc`/`func`) out of `surface.js` into `classifier.js`.
**This lands.** These are the functions where reimplementation shipped a broken
`emitMatch` in M22; the tool exists precisely so this is a *byte-exact move*.

## 0. Read first
- `…/slice04-complex-form-extraction/ledger.md` — the contract (10 rows).
- `…/slice04-complex-form-extraction/slice-doc.md` — move set, the `typeRegistry` hazard, dependency notes.
- `…/slice03-helper-extraction/closing-report.md` — the dependency-ordered pattern that worked, and the import-then-byte-move technique.

## 1. Two invariants (non-negotiable)
1. **Move with the tool; NEVER reimplement or hand-edit a moved body.** This is
   the slice where that discipline matters most — `emitMatchMacro` is the function
   M22 broke by rewriting. Byte-identical via `scripts/move-function.js`, or stop
   and surface the blocker. No "I'll just adjust it slightly."
2. **`typeRegistry` stays a single shared `Map` instance.** It's used by *both* a
   surface.js init routine (`Some`/`None`/`Ok`/`Err`) and `emitTypeMacro` (moving).
   Relocate it to `surface-helpers.js`; both `surface.js` and `classifier.js`
   import the **one** instance. Duplicating it splits ADT registration from
   resolution and silently breaks `type`/`match`. Verify the round-trip (F-10).

## 2. The work (MUST, in order)

1. **Dependency analysis first (F-1)** — acorn free-var scan of the 5 movers
   (`buildSingleClauseFunc`, `buildMultiClauseFunc`, `emitMatchMacro`,
   `emitTypeMacro`, `emitGenfuncMacro`) plus `parseKeywordClauses` and
   `instrumentYields`. Classify each referenced symbol: *moves-with* (only movers
   use it — expected for `parseKeywordClauses`, `instrumentYields`),
   *shared-relocate* (`typeRegistry`), or *import-from-`surface-helpers.js`* (the
   slice03 helpers). Confirm `surface.js` does **not** call the 5 emitters (it
   doesn't — `classifier.js` is the sole caller → clean move, no back-import).
   Produce the move order.
2. **Relocate `typeRegistry` (F-2) — do this deliberately, first.** Move it to
   `surface-helpers.js`; repoint surface.js's init and classifier.js's import to
   the single instance. Then prove ADT round-trip works (F-10) before moving the
   emitters on top of it.
3. **Move the emitters + `parseKeywordClauses` + `instrumentYields`
   `surface.js`→`classifier.js`** via the tool (F-3/F-4/F-5), dependency-ordered,
   each rebuild-first verified, byte-identical. Import the slice03 helpers from
   `surface-helpers.js` at the destination.
4. **Confirm dispatch (F-6):** `match`/`type`/`genfunc`/`func` all compile and
   run via classifier.js; no `surface↔classifier` emitter cycle.
5. **Green (F-7/F-9):** rebuild-first `lykn test` 0 failed, `deno test` 0 failed,
   `cargo test` 0 failed, `clippy -D warnings` + `deno lint scripts/` exit 0.
6. **Lint progress (F-8):** the `typeRegistry`/`parseKeywordClauses` dead-import
   errors in `deno lint packages/` are now gone (live or local); only
   `buildThread`/`buildSomeThread` (M22.5-4) remain — 4→2.

## 3. Discipline
- Lands (committed; move-by-move commits with visible boundaries ideal).
- Standing iteration override (substance over count) — but **never reimplement to
  force it**, and if the slice is too large for one context, **split it** (e.g.,
  land the `typeRegistry` relocation + `func`/`genfunc`, then `match`/`type`) and
  say so.
- Don't touch `buildThread`/`buildSomeThread` or `_kernel` — that's M22.5-4.
- Leave `docs/design-v0.6.0/**` to CDC.

## 4. Close
Write `closing-report.md` (per-row walk + the F-1 dependency table + the
`typeRegistry` relocation account + a **bubble-up to arc04**: what M22.5-4 cleanup
remains, and any residual `surface↔surface-helpers`/`classifier` cycle state) →
hand back for CDC `cdc-verification.md`. Closing slice04 finishes DD-37's
implementation migration; **slice05 = M22.5-4** (dead-code + `_kernel`; also clears
the last `deno lint packages/` residuals) follows.
