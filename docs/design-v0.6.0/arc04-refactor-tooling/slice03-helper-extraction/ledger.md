# Slice 03: helper-extraction (M22.5-2) — Ledger

The first real `move-function` extraction; **it lands** (committed). Every move
is performed **by the tool** (`scripts/move-function.js`), never hand-edited or
reimplemented — that is the whole point of arc04. Rebuild-first verify
throughout. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

The 10 helpers: `isPascalCase`, `compilePattern`, `andChain`, `getLiteralType`,
`typeMatchesLiteral`, `buildTypeCheck`, `compileLetPattern`, `parseTypedParams`,
`paramNameNodes`, `paramTypeChecks`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Dependency analysis** — for each of the 10, list its free-var + inter-helper deps; derive a leaf-first move order | a dep table in the closing report; every helper's deps are already in `surface-helpers.js` or scheduled earlier in the order | serious | slice02 bubble-up | open | | known: `compileLetPattern`→`isPascalCase`; `andChain`/`buildTypeCheck` are leaves |
| F-2 | Moves performed **by `scripts/move-function.js`** (batch or per-name), not by hand | the move commands/transcript recorded; no manual cut-paste of bodies | serious | arc04 invariant | open | | reimplementation is the failure this whole arc exists to prevent |
| F-3 | All 10 **defined in `surface-helpers.js`**, **0 in `surface.js`** | `grep -cE 'function (h)\b\|const (h)\b'` → surface-helpers.js=1, surface.js=0 for each | serious | slice-doc | open | | |
| F-4 | Each moved body **byte-identical** to its pre-move form | `git show` pre/post diff per helper = zero body diff | serious | arc04 invariant | open | | the tool guarantees; confirm |
| F-5 | The alias re-export line removed from `surface-helpers.js` | `grep 'from "./surface.js"' surface-helpers.js` no longer lists the 10 | correctness | slice-doc | open | | becomes real defs |
| F-6 | Consumers import all 10 from `surface-helpers.js`, none from `surface.js` | `classifier.js` import line 8 no longer lists the 6; `surface.js` back-imports any it still uses | correctness | slice-doc | open | | 4 already import from helpers (no rewire); 6 rewired |
| F-7 | **rebuild-first full suite green** | `cargo build --release && LYKN_BIN=… "$LYKN_BIN" build && "$LYKN_BIN" test` → 0 failed; `deno test --config project.json -A test/` → 0 failed | serious | slice02 F-7 | open | | this slice lands — must be green |
| F-8 | no regressions / lint clean | `cargo test --workspace` 0 failed; `deno lint` + `deno lint scripts/` exit 0; `cargo clippy -D warnings` exit 0 | serious | slice-doc | open | | |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 8. Done: _. Deferred: _. No-op: _.

> **Iteration budget:** standing override — genuine engineering over count; CDC
> review judges substance. If a helper's deps make a clean byte-move impossible,
> **surface it** (it may need its deps moved first, or it's really an M22.5-3
> entanglement) — do not hand-edit the body to force it.
