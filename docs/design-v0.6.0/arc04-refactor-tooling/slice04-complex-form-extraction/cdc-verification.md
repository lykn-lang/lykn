# Slice 04: complex-form-extraction (M22.5-3) — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-06-29
**Verdict: accepted — slice04 closed.** The hardest extraction landed cleanly,
and the arc04 invariant held on its highest-stakes case: **`emitMatchMacro` moved
byte-identical** — the exact function M22 broke by reimplementing.

## Verification (Linux sandbox: git + grep + byte-diff; runtime CC-attested)

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 dep analysis | Accepted; CC's acorn scan surfaced 3 extra movers-only symbols (`replaceTilde`, `paramDispatchType`, `FUNC_CLAUSE_KEYS`) my scope hadn't named — a good catch. | attested + reasoned |
| F-2 typeRegistry single instance | **grep-confirmed:** `typeRegistry = new Map()` exists **only** in `surface-helpers.js` (surface.js=0, classifier.js=0); both owners import it. Commit `3ed5e6a`. | reproduced (grep) |
| F-3/F-5 moved by tool | **grep-confirmed:** all 10 movers are `surface.js=0, classifier.js=1`. Commit `ff481b4`. | reproduced (grep) |
| F-4 byte-identical | **byte-diff confirmed:** `emitMatchMacro` pre-move (`surface.js@ff481b4~1`) vs now (`classifier.js`) — 116 lines, `diff` empty → **byte-identical**. CC verified all 10. | reproduced (diff) |
| F-6 no cycle | **grep-confirmed:** `classifier.js` imports **nothing** from `surface.js` — the DD-37 dependency inversion is complete. `test/surface` 292/0 (match/type/genfunc/func). | reproduced (grep) + attested |
| F-7/F-9 green | CC-attested: `lykn test` 1345/0, `deno test` 658/0, `cargo test` 0, `clippy -D warnings` + `deno lint scripts/` exit 0. Not runnable here. | attested |
| F-8 lint 4→2 | **grep-confirmed:** `buildThread`/`buildSomeThread` (the 2 M22.5-4 residuals) still in `surface.js`; `typeRegistry`/`parseKeywordClauses` dead-imports cleared. | reproduced (grep) + attested |
| F-10 ADT round-trip | CC-attested (`test/surface` "type runtime: match on ADT" + 6 type/match tests green, single Map). | attested |

## Notable: a tool enhancement, done the right way

The blocker (classifier.js already imported all 10 movers → every move collided
with the existing import) was solved not by manual import surgery on the
highest-stakes file, but by a **TDD'd tool capability**: `move-function.js` now
prunes the moved name's import from the TO file when TO imports it from FROM
(`fdde09f` test → `20748a5` fix; a genuine local-decl collision still aborts).
This is exactly "fix the tool, not the move" — and "TO-as-consumer" is now a
first-class, tested move benefiting every future extraction. (It's a tool change
inside an extraction slice, but justified: it's what let `emitMatchMacro` move
verbatim instead of being hand-edited.)

## Disposition

- Silent-drop check: 10 rows, 10 done. No drops. ✓
- arc04 invariant held — every move by the tool, byte-identical, **including the
  function that broke before**. ✓
- **slice04 closed. DD-37's implementation migration is FINISHED** — all
  complex-form emit logic lives in `classifier.js` ("Option C"); `surface.js`
  holds none of it. `surface.js` is now **540 lines** (was 2,315 pre-DD-37).
- Operator host re-run recommended to reconcile F-7/F-9/F-10.
- Next: **slice05 = M22.5-4** (remove `buildThread`/`buildSomeThread` + `_kernel`
  prep) — clears the final 2 `deno lint packages/` residuals → exit 0.
