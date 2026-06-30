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
| F-1 | **Dependency analysis** (acorn free-var scan) of the 5 emitters + support; classify each symbol move-with-emitters / shared-relocate / import-from-helpers; derive move order | dep table in closing report; `typeRegistry` flagged as shared single-instance | serious | slice-doc | **done** | Dep table in closing-report §1. Surfaced **3 extra movers-only support symbols** (`replaceTilde`, `paramDispatchType`, `FUNC_CLAUSE_KEYS`) → move set is 10 → classifier.js + typeRegistry. surface.js makes 0 real calls to the 5 emitters (clean, no back-import). Clean func/genfunc ⟂ match/type split fault line | **attested** |
| F-2 | **`typeRegistry` relocated to `surface-helpers.js` as a single shared instance**; surface.js init + classifier.js emitter both import it | grep: `new Map()` for typeRegistry in surface-helpers.js only; both files import it; **ADT round-trip works** (F-10) | serious | slice-doc | **done** | Commit `3ed5e6a`. `new Map()` for typeRegistry only in surface-helpers.js (surface.js=0); surface.js (resetTypeRegistry) + classifier.js (emitTypeMacro) both import the one instance. Moved by the tool; rebuild-first verify passed | **attested** |
| F-3 | The 5 emitters + `parseKeywordClauses` + `instrumentYields` moved `surface.js`→`classifier.js` **by the tool**, dependency-ordered | move transcript; no hand-edited bodies | serious | arc04 invariant | open | | classifier.js is sole caller → clean move, no back-import |
| F-4 | Each moved body **byte-identical** to pre-move | `git show` / `slice(start,end)===original` per function | serious | arc04 invariant | open | | esp. `emitMatchMacro` |
| F-5 | `surface.js` no longer defines the 5 emitters / moved support | grep `function <name>` in surface.js = 0 for each | correctness | slice-doc | open | | |
| F-6 | `classifier.js` defines/uses them; `match`/`type`/`genfunc`/`func` dispatch correctly; no `surface↔classifier` emitter cycle | grep + the form tests pass | serious | slice-doc | open | | surface.js doesn't call them → no cycle |
| F-7 | **rebuild-first full suite green** | `cargo build --release && LYKN_BIN=… "$LYKN_BIN" build && "$LYKN_BIN" test` → 0 failed; `deno test … test/` → 0 failed | serious | slice02 F-7 | open | | lands — must be green |
| F-8 | `deno lint packages/` residuals reduced 4→2 | the `typeRegistry`/`parseKeywordClauses` dead-import errors gone; only `buildThread`/`buildSomeThread` (M22.5-4) remain | correctness | slice03 bubble-up | open | | becomes-live or local |
| F-9 | no regressions / lint clean | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | serious | slice-doc | open | | |
| F-10 | **`typeRegistry` single-instance / ADT round-trip** intact | a `type`+`match` end-to-end test: define an ADT, match on it — registration and resolution share one Map | serious | slice-doc | **done** | `test/surface` "type runtime: match on ADT" + 6 type/match tests green (292/0): ADT registers via `type`, resolves via `match`, through the one Map | **attested** |
| F-3 | emitters + support moved to classifier.js by the tool, dep-ordered | move transcript | serious | arc04 invariant | **done** | Commit `ff481b4`. 2 tool batches (5 emitters, then 5 support: parseKeywordClauses, instrumentYields, replaceTilde, paramDispatchType, FUNC_CLAUSE_KEYS), each rebuild-first verified. Enabled by the TO-as-consumer tool enhancement (`20748a5`) — pruned classifier.js's imports as defs landed | **attested** |
| F-4 | each moved body byte-identical | per-fn diff | serious | arc04 invariant | **done** | all 10 `slice(start,end) === original` ("ALL 10 BYTE-IDENTICAL ✓"), incl. `emitMatchMacro` | **attested** |
| F-5 | surface.js no longer defines the 5 emitters / moved support | grep=0 | correctness | slice-doc | **done** | grep loop: all 10 `surface=0` | **attested** |
| F-6 | classifier.js defines/dispatches them; no cycle | grep + form tests | serious | slice-doc | **done** | all 10 `classifier=1`; classifier.js imports **nothing** from surface.js (no cycle); `test/surface` 292/0 (match/type/func/genfunc) | **attested** |
| F-7 | rebuild-first full suite green | corpus + deno test 0 failed | serious | slice02 F-7 | **done** | rebuild-first: `lykn test` 1345/0; `deno test --config project.json -A test/` 658/0 | **attested** |
| F-8 | `deno lint packages/` residuals 4→2 | typeRegistry/parseKeywordClauses dead-imports gone | correctness | slice03 bubble-up | **done** | typeRegistry (Part 1) + parseKeywordClauses (now local) cleared; move-induced surface.js unused imports cleaned. `deno lint packages/` = **2** (`buildThread`/`buildSomeThread`, M22.5-4) | **attested** |
| F-9 | no regressions / lint clean | cargo/clippy/deno-lint-scripts | serious | slice-doc | **done** | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | **attested** |

## What Worked

- **Dependency analysis before any move** — the acorn scan surfaced 3 support
  symbols the move set didn't name and proved a clean func/genfunc ⟂ match/type
  fault line, enabling a safe split.
- **The critical-care `typeRegistry` relocation went clean via the tool** — single
  instance preserved, ADT round-trip verified before building emitters on top.

## Closure

Closed 2026-06-29. Verified by: CC (attested) + CDC (`cdc-verification.md`:
git/grep-confirmed F-2/F-3/F-5/F-6/F-8 + **byte-diff on `emitMatchMacro`**;
F-7/F-9/F-10 runtime deferred to host).
Part 1 (`3ed5e6a`): F-1/F-2/F-10 (dep analysis + typeRegistry relocation + ADT
round-trip). The TO-as-consumer **tool enhancement** (`fdde09f` test → `20748a5`
fix) then made the emitter moves clean. Part 2 (`ff481b4`): F-3…F-9 — all 10
items moved byte-exact, dispatch works, no cycle, lint 4→2, suite green.
**The split anticipated in Part 1 proved unnecessary** once the tool could prune
TO imports. Rows: 10. Done: 10. Deferred: 0. No-op: 0.

> **Iteration budget:** standing override — substance over count. **Never
> reimplement to force a move** — these are the functions that broke that way
> before. If a clean byte-move is blocked, surface it (move its deps first, or
> split the slice). If the slice proves too large for one context, split it.
