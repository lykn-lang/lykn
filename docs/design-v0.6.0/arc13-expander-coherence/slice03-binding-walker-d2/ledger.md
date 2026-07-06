# Slice 03: binding-walker + d2-validation — Ledger

DD-61 §A2's walker (both backends) + the D2 validator riding it. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Rebuild-first.
5 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Binding-position walker, Rust** — visits every DD-60 binding position (params/`bind`/destructuring/loop/class-method) yielding (name, kind, span); no behavior change | walker unit tests per position kind | serious | DD-61 §A2 | open | | the single component that knows what binds; D1's chassis (slices 04/05 hook the env here) |
| F-2 | **Binding-position walker, JS** — same contract; **shared fixture corpus proves shape-knowledge parity** across backends | the shared fixtures pass on both walkers | serious | DD-61 §A2 | open | | identifies binding positions WITHOUT changing their expansion yet (dispatch fixes = slice05) |
| F-3 | **D2 validator, both backends** — reserved word at any binding position → compile error with diagnostic (DD-58 voice), incl. `export`ed names + the `kernel:` name slot; no invalid JS at rc=0 for any name | validator tests per position; `(kernel:const if 0)` + `(export (bind if 0))` error on both; `deno check` spot-check on probe output | serious | DD-60 D2 (confirmed) | open | | kills the ID-44 genus; arc09 breaking note |
| F-4 | **Three-way list parity** — Rust list ≡ JS list ≡ the probe's empirical legality (`tools/conformance-matrix.js`), tested in `make check`; seeded-drift demo | the parity test + demo transcript | correctness | DD-60 D2 authority | open | | A-7 precedent, now three-way |
| F-5 | **Matrix re-probe: only D2 rows move** — D2 rows → `rejects-cleanly` both backends; every other column byte-identical to baseline; suites green | re-probe diff; `make check` ✓; suites ≥1368/0 · ≥673/0 | serious | standing bar + scope discipline | open | | any non-D2 cell moving = scope leak into 04/05 — stop and surface |

## What Worked / Closure

- **The walker found a hole in its own spec** — enumerating "what binds" in
  one place exposed that DD-60's confirmed list missed `if-let`/`when-let`/
  `match` patterns (live ID-44-genus leaks). Single-source components audit
  their specifications for free.
- **Reusing `ParamShape`** kept the walker from re-deriving grammar — the
  divergence-avoidance discipline applied inside one backend.

Closed 2026-07-06 (commit pending on the staged 8 files; content
CDC-verified from tree). Rows: 5/5 done. Matrix: only D2 rows moved;
disagreement 312→208; suites 1387/0 (+19). **Finding routed:** DD-60 +3
binding positions (operator-confirmed) → **slice04 · walker-extension**;
resolution slices renumber 05/06, corpus 07.

> Bubble-up must carry the walker's env-extension hook points for slices
> 04/05, and the arc09 breaking note.
