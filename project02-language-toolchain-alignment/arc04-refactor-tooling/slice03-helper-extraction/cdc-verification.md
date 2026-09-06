# Slice 03: helper-extraction (M22.5-2) — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-29
**Verdict: accepted — slice03 closed.** The first real `move-function`
extraction landed correctly: 10 helpers physically moved, byte-identical, by the
tool. The one F-8 exception is genuinely pre-existing, out-of-scope debt.

## Verification (Linux sandbox: git + grep; runtime CC-attested)

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 dep analysis | Accepted CC's acorn free-var scan + leaf-first order; the two hazards (`compilePattern→typeRegistry`, `parseTypedParams→parse*Param`) are importable, satisfied by adding imports (not deferred). | attested + reasoned |
| F-2 tool-not-hand | 3 `move-function.js` runs (batch-of-7 leaves → `compilePattern,compileLetPattern` → `parseTypedParams`), rebuild-first; no body hand-edited. | attested |
| F-3 moved | **grep-confirmed:** all 10 are `surface.js=0, surface-helpers.js=1`. | reproduced (grep) |
| F-4 byte-identical | **spot-checked** `andChain` in `surface-helpers.js` === its prior `surface.js` body, char-for-char; CC verified all 10 (`slice(start,end)===original`). | reproduced (spot) + attested |
| F-5 alias gone | **grep-confirmed:** the 10-helper `export { … } from "./surface.js"` re-export is gone. (Residual `from "./surface.js"` imports are the dep-satisfying `typeRegistry`/`parse*Param` — see cycle note.) | reproduced (grep) |
| F-6 consumers | **grep-confirmed:** `classifier.js` line 8 (from `surface.js`) lists none of the 10 — only M22.5-3 forms. The 3 pre-existing dead imports (`isPascalCase`/`andChain`/`compilePattern`, never used by classifier.js) were correctly removed, not carried. | reproduced (grep) |
| F-7 green | CC-attested rebuild-first: `lykn test` 1345/0, `deno test` 658/0. Not runnable here. | attested |
| F-8 lint | **grep-confirmed the exception is pre-existing + out of scope:** `deno lint packages/` ≠ 0 due to `buildThread`/`buildSomeThread` (dead funcs in `surface.js` → M22.5-4) + `typeRegistry`/`parseKeywordClauses` (dead imports in `classifier.js` → M22.5-3). slice03 cut packages/ errors 10+→4, introduced none. `cargo test`/`clippy`/`deno lint scripts/` green (attested). | reproduced (grep) + attested |

## Notes / bubble-up accepted (→ arc04, M22.5-3)

1. **Transitional `surface ↔ surface-helpers` import cycle.** `surface-helpers.js`
   now imports `typeRegistry` + `parse*Param` *back* from `surface.js`. Safe
   (ESM live bindings; used at call-time, not module-init). It's the expected
   mid-extraction state; M22.5-3 (move the complex forms that own these) and
   M22.5-4 (dead-code) will reduce it. Not a defect.
2. **`deno lint packages/` clears with M22.5-3 + M22.5-4** — the 4 residuals are
   exactly that debt. Recorded at project level (blocks a fully-clean JS lint for
   arc07/arc09 until then).
3. **Tool-enhancement candidate** (CC): after a move, prune now-unused imports in
   the FROM file (CC hand-cleaned `surface.js`'s dangling `toJsIdentifier`/
   `kernelArray`). A nice `move-function` follow-up; tracked for the tool, not
   blocking.

## Disposition

- Silent-drop check: 8 rows, 8 closed (F-6 adjusted-with-note, F-8 green-except-
  disclosed-debt). No silent drops. ✓
- arc04 invariant held: every move by the tool, byte-identical, no reimplementation. ✓
- **slice03 closed.** `surface.js` is now meaningfully smaller (helper half of
  DD-37's migration complete). Operator host re-run recommended to reconcile F-7.
  Next: **slice04 = M22.5-3** (the 4 complex forms).
