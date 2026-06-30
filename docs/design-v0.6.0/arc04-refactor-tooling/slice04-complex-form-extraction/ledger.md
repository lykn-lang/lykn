# Slice 04: complex-form-extraction (M22.5-3) — Ledger

The hardest extraction; **it lands**. Every move **by the tool**
(`scripts/move-function.js`), never reimplemented — these are the exact functions
(`emitMatchMacro` especially) where reimplementation shipped a bug in M22.
Rebuild-first verify throughout. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

Move set → `classifier.js`: `buildSingleClauseFunc`, `buildMultiClauseFunc`,
`emitMatchMacro`, `emitTypeMacro`, `emitGenfuncMacro`, + `parseKeywordClauses`,
`instrumentYields`. Shared state → `surface-helpers.js`: `typeRegistry`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Dependency analysis** (acorn free-var scan) of the 5 emitters + support; classify each symbol move-with-emitters / shared-relocate / import-from-helpers; derive move order | dep table in closing report; `typeRegistry` flagged as shared single-instance | serious | slice-doc | open | | known: `parseKeywordClauses`/`instrumentYields` move with; `typeRegistry` shared |
| F-2 | **`typeRegistry` relocated to `surface-helpers.js` as a single shared instance**; surface.js init + classifier.js emitter both import it | grep: `new Map()` for typeRegistry in surface-helpers.js only; both files import it; **ADT round-trip works** (F-10) | serious | slice-doc | open | | the critical-care step — do this deliberately, verify identity |
| F-3 | The 5 emitters + `parseKeywordClauses` + `instrumentYields` moved `surface.js`→`classifier.js` **by the tool**, dependency-ordered | move transcript; no hand-edited bodies | serious | arc04 invariant | open | | classifier.js is sole caller → clean move, no back-import |
| F-4 | Each moved body **byte-identical** to pre-move | `git show` / `slice(start,end)===original` per function | serious | arc04 invariant | open | | esp. `emitMatchMacro` |
| F-5 | `surface.js` no longer defines the 5 emitters / moved support | grep `function <name>` in surface.js = 0 for each | correctness | slice-doc | open | | |
| F-6 | `classifier.js` defines/uses them; `match`/`type`/`genfunc`/`func` dispatch correctly; no `surface↔classifier` emitter cycle | grep + the form tests pass | serious | slice-doc | open | | surface.js doesn't call them → no cycle |
| F-7 | **rebuild-first full suite green** | `cargo build --release && LYKN_BIN=… "$LYKN_BIN" build && "$LYKN_BIN" test` → 0 failed; `deno test … test/` → 0 failed | serious | slice02 F-7 | open | | lands — must be green |
| F-8 | `deno lint packages/` residuals reduced 4→2 | the `typeRegistry`/`parseKeywordClauses` dead-import errors gone; only `buildThread`/`buildSomeThread` (M22.5-4) remain | correctness | slice03 bubble-up | open | | becomes-live or local |
| F-9 | no regressions / lint clean | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | serious | slice-doc | open | | |
| F-10 | **`typeRegistry` single-instance / ADT round-trip** intact | a `type`+`match` end-to-end test: define an ADT, match on it — registration and resolution share one Map | serious | slice-doc | open | | the shared-state correctness gate |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 10. Done: _. Deferred: _. No-op: _.

> **Iteration budget:** standing override — substance over count. **Never
> reimplement to force a move** — these are the functions that broke that way
> before. If a clean byte-move is blocked, surface it (move its deps first, or
> split the slice). If the slice proves too large for one context, split it.
