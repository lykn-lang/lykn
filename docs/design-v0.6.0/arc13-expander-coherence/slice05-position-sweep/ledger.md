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

_(At slice close.)_
