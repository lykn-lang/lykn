# Slice 05: position-sweep + walker-completion — Ledger

Refinement #2's three positions + the derived-exhaustiveness sweep + the
standing coverage-diff test. Per LEDGER-DISCIPLINE. Rebuild-first. 5 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **catch/import-local (D1+D2) + label (D2-only) covered**, both backends; slice04's evidence repros error | per-position tests; `(try (f) (catch if …))`, `(import "m" (if))`, `(label if …)` error on both | serious | DD-60 refinement #2 (confirmed) | open | | label = name-slot validation only; labels don't shadow (documented) |
| F-2 | **The sweep** — derived identifier-emission inventories per backend (with emission-site citations); walker-coverage diff; gaps folded (mechanical) or surfaced as refinement #3 (semantic) | the inventories + diff in the closing report | serious | operator method-change decision | open | | authority inversion: derive from outputs, don't accumulate from leaks |
| F-3 | **Coverage-diff test standing in `make check`** — derived list vs walker coverage, per backend; empty = complete; seeded-gap demo | the test + demo transcript | serious | operator decision | open | | a future name-binding grammar addition fails CI until the walker knows it |
| F-4 | **Matrix: only the new positions' D2 rows flip**; originals byte-identical | re-probe diff | serious | scope discipline | open | | any original cell moving = leak — stop |
| F-5 | **Green bar** — `make check` ✓; suites ≥1391/0 + new; three-way parity green | suite runs | serious | standing bar | open | | |

## What Worked / Closure

- **Inverting the discovery direction found a class probing couldn't** —
  name slots don't look like "binding positions" from the input side; from
  the emission side they're unmissable. Derive-from-outputs beat
  probe-inputs on its first outing.
- **`shadows_values()` in the API** — the label-namespace distinction
  shipped as a walker property the resolution slices consume, not a
  comment they must remember.

Closed 2026-07-06. Rows: 5/5 done. Suites 1401/0; matrix 8→11 positions,
originals byte-identical; coverage test standing in `make check`
(seeded-gap demo'd). **Exhaustiveness: by construction + test-pinned; the
discover-by-leak loop is closed.** Next: rust-resolution (numbered at
creation).
