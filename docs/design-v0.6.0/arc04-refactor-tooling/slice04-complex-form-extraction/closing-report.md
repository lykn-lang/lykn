# Slice 04: complex-form-extraction (M22.5-3) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-29 · **Branch:** `release/0.6.x`
**Status: DELIVERED — all 10 rows done.** The hardest extraction landed: the 4
complex-form emitters (`match`/`type`/`genfunc`/`func`, incl. `emitMatchMacro`
that M22 broke) + their support moved to classifier.js byte-exact via the tool;
`typeRegistry` relocated as a single shared instance; full suite green; `deno
lint packages/` 4→2. Built across `3ed5e6a` (typeRegistry), `fdde09f`/`20748a5`
(tool TO-as-consumer enhancement), `ff481b4` (the 10 moves).

> **Note:** Part 1 below was written when this slice was planned as a 2-part
> split. The split proved **unnecessary** — the tool enhancement (§3) made the
> emitter moves clean enough to finish in one session. Kept for the record.

---

## 1. Dependency analysis (F-1) — done

acorn free-var scan of the 7 named movers, plus discovery of **3 additional
support symbols** the scan surfaced. Classification:

| Mover | move-with (only movers use it) | shared-relocate | from surface-helpers.js | **new surface-local support** |
|-------|-------------------------------|-----------------|-------------------------|-------------------------------|
| `buildSingleClauseFunc` | parseKeywordClauses | — | isArray, parseTypedParams, paramNameNodes, paramTypeChecks, formatSExpr, array, sym, isKeyword, isStatementOnlyForm, gensym, buildTypeCheck, wrapReturnLast | **replaceTilde** |
| `buildMultiClauseFunc` | parseKeywordClauses | — | gensym, isArray, parseTypedParams, array, sym, andChain, paramNameNodes, paramTypeChecks, formatSExpr, wrapReturnLast | **paramDispatchType, replaceTilde** |
| `emitGenfuncMacro` | parseKeywordClauses, instrumentYields | — | isArray, parseTypedParams, paramNameNodes, paramTypeChecks, formatSExpr, array, sym, isKeyword | — |
| `emitMatchMacro` | — | — | gensym, array, sym, isArray, isKeyword, compilePattern, andChain, wrapReturnLast, isPascalCase | — |
| `emitTypeMacro` | — | **typeRegistry** | array, sym, isArray, parseTypedParams, buildTypeCheck | — |
| `parseKeywordClauses` | — | — | isKeyword | **FUNC_CLAUSE_KEYS** |
| `instrumentYields` | — | — | gensym, buildTypeCheck, array, sym | — |

**Key findings:**
- **surface.js makes 0 real calls to the 5 emitters** (grep excluding defs) →
  classifier.js is the sole caller → clean move, **no back-import** for the emitters.
- **3 newly-discovered support symbols** (`replaceTilde` [not exported],
  `paramDispatchType` [exported], `FUNC_CLAUSE_KEYS` [const]) are each used **only
  by movers** (no external/non-mover refs) → they **move too**, into classifier.js.
  Full move set is therefore **10 → classifier.js** + `typeRegistry` → surface-helpers.js.
- **Clean split fault line:** func (`buildSingle/MultiClauseFunc`) + genfunc
  (`emitGenfuncMacro`) share all 5 support symbols; match/type
  (`emitMatchMacro`/`emitTypeMacro`) depend only on slice03 helpers + the
  relocated `typeRegistry`. No cross-dependency → Part-A = func/genfunc+support,
  Part-B = match/type.

**Move order (leaf-first):** `FUNC_CLAUSE_KEYS`, `replaceTilde`,
`paramDispatchType`, `instrumentYields` → `parseKeywordClauses` → emitters
(func/genfunc, then match/type). **But see §3 for the import-order constraint.**

## 2. `typeRegistry` relocation (F-2 + F-10) — done, committed `3ed5e6a`

`typeRegistry` (`const … = new Map()`) moved surface.js → surface-helpers.js via
the tool. It is now a **single instance** imported by both owners — surface.js's
`resetTypeRegistry` (init, sets Some/None/Ok/Err) and classifier.js's
`emitTypeMacro` (resolution) — via ESM live bindings. The slice03
`import { typeRegistry } from "./surface.js"` in surface-helpers.js was removed
first (it became a real def there); the tool added surface.js's back-import and
rewired classifier.js.

**F-10 ADT round-trip verified:** `test/surface` "type runtime: match on ADT"
(+6 type/match tests) green, 292/0 — an ADT registers via `type` and resolves via
`match` through the one Map. Move verified rebuild-first (deno test 658/0).

---

## 3. Part 2 (F-3…F-9) — executed via a tool enhancement

**The wrinkle was TO-as-consumer.** classifier.js already imports all 10 movers.
The tool's collision check aborted any move into a file that imports the name. So
instead of manual per-move import surgery on the highest-stakes file, I **taught
the tool to handle it** (commit `fdde09f` test → `20748a5` fix): when TO imports
the moved name *from FROM*, prune that import and insert the byte-exact def; a
genuine collision (TO locally declares the name, or imports from elsewhere) still
aborts. With that, the 10 moves ran in two clean rebuild-first batches (emitters
first so surface.js loses the support calls, then support — no back-import cycle).
`replaceTilde`/`FUNC_CLAUSE_KEYS` were exported in surface.js to enable the
emitters-first order, then moved out (now exported in classifier.js). surface.js's
now-unused helper imports were cleaned (move-induced). Result: all 10
byte-identical, no surface↔classifier cycle, `deno lint packages/` 4→2.

The original per-move technique (for reference, had the enhancement not been
built):

**The cycle hazard.** `parseKeywordClauses`/`instrumentYields` (+ the 3 support
symbols) are *called by* the emitters. Move **emitters first** (so surface.js
loses the calls), then the support — else surface.js needs a back-import from
classifier.js (wrong-direction cycle).

**Procedure per Part (A = func/genfunc, B = match/type):**
1. **Prep classifier.js imports:** add to its `surface-helpers.js` import the
   slice03 helpers the emitters need but it doesn't yet import (for func/genfunc:
   `isArray, array, sym, isKeyword, gensym, andChain, isStatementOnlyForm`; for
   match: re-add `compilePattern, andChain, isPascalCase`). Add to its
   `surface.js` import the still-in-surface support the emitters call
   (`replaceTilde, paramDispatchType, FUNC_CLAUSE_KEYS`).
2. **Move each emitter:** remove it from classifier.js's `surface.js` import,
   then `move-function.js --from surface.js --to classifier.js --name <emitter>`
   with the rebuild-first `--verify-cmd`. The tool inserts the def byte-exact;
   classifier.js's dispatch call resolves to the local def.
3. **Move the support** (`parseKeywordClauses, instrumentYields, replaceTilde,
   paramDispatchType, FUNC_CLAUSE_KEYS`): remove each from classifier.js's
   surface.js import, then move. surface.js no longer references them → no
   back-import.
4. **F-8:** the `parseKeywordClauses` dead-import error clears (it becomes a local
   def in classifier.js); `typeRegistry` already cleared by Part 1. `deno lint
   packages/` residuals → 2 (`buildThread`/`buildSomeThread`, M22.5-4).

**Recommended tool enhancement (surfaces from this slice):** teach
`move-function.js` to **prune the moved name from the TO file's own import** when
TO is also a consumer — that removes the manual per-move import surgery and the
duplicate-binding hazard entirely. A clean addition to arc04's tool.

**Pre-move bodies captured** at `/tmp/slice04-orig/*.txt` for byte-identity
(F-4); the next context should re-capture from the current tree.

---

## 4. Bubble-up to arc04

- **DD-37 implementation migration is complete.** All complex-form emit logic now
  lives in classifier.js ("Option C"); surface.js no longer defines any of the
  forms' emitters or their helpers. The surface→helpers→classifier layering is
  clean (no surface↔classifier cycle).
- **The `move-function` tool gained a real capability** (TO-as-consumer pruning,
  `20748a5`) — moving a declaration into its own consumer is now a first-class,
  tested operation. This is what made the highest-stakes extraction byte-exact
  and clean; future "inline into the caller" moves are now trivial.
- **The byte-exact invariant held on the functions M22 broke** — `emitMatchMacro`
  and the rest moved with zero body diff. The tool fulfilled its founding purpose.
- **M22.5-4 (slice05) is the last arc04 step:** remove the dead `buildThread`/
  `buildSomeThread` functions (+ `_kernel` cleanup), which also clears the final 2
  `deno lint packages/` residuals (the only ones left). After that, `deno lint
  packages/` reaches exit 0.
