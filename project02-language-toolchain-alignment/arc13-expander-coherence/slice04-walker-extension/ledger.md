# Slice 04: walker-extension — Ledger

+3 binding positions (DD-60 refinement 2026-07-06) through walker + D2 +
probe, both backends. Per LEDGER-DISCIPLINE. Rebuild-first. 4 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Walkers cover the 3 new positions** (`if-let`/`when-let` patterns incl. destructuring; `match` clause patterns), both backends; parity fixtures extended | per-position walker tests; shared fixtures green on both | serious | DD-60 refinement (slice03 finding) | open | | via the existing hook points — no parallel enumeration |
| F-2 | **D2 covers them** — reserved word in any of the 3 positions → compile error both backends; the live `(if-let (if x) …)` leak closes | validator tests; the slice03-evidence repro now errors on both; `deno check` spot-check | serious | Principle 3 / ID-44 genus | open | | DD-58-voice diagnostics |
| F-3 | **Matrix probe extended + only-new-D2 delta** — new binding-position cells baselined; re-probe: new positions' reserved-word rows → `rejects-cleanly`; ALL pre-existing cells byte-identical | probe diff transcript | serious | scope discipline | open | | any pre-existing cell moving = leak — stop and surface |
| F-4 | **Green bar** — `make check` ✓; suites ≥1387/0 + new tests; three-way parity green | suite runs | serious | standing bar | open | | |

## What Worked / Closure

- **The probe-for-a-fourth clause found three** — asking "what else did we
  miss" as a ledgered obligation, not a virtue, keeps paying.
- **Pattern-grammar reuse on both sides** (Rust `classify_expr` `Pattern`;
  JS mirroring `classify_pattern`) kept bind/don't-bind judgments
  (`_`/literals/PascalCase constructors) single-sourced per backend.

Closed 2026-07-06. Rows: 4/4 done. Matrix 5→8 position columns, originals
byte-identical; fixtures 16→20; suites 1391/0. **Finding routed
(operator-confirmed):** `catch`/`import`-local/`label` + the
derived-exhaustiveness sweep → **slice05 · position-sweep +
walker-completion**; DD-60 refinement log entry #2.
