# Slice 01: conformance-matrix + DD-60 — Ledger

Recon-only: the full name-binding conformance matrix (both backends) +
the DD-60 semantics draft + 02/03 sizing. **No compiler changes.** Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. 5 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Matrix complete + re-runnable** — name classes (surface macros [full sets], kernel heads, `kernel:`-prefixed, JS reserved words, ordinary controls) × binding positions (params, `bind`, destructuring, loop bindings, class fields) × reference positions (call-head, argument, nested-fn capture) × both backends; automated probe script, deterministic re-runs | the matrix table + the script + a re-run transcript matching | serious | arc05 F-4 recon (seed) | open | | the script becomes slice03's conformance-corpus seed and A-4's re-probe |
| F-2 | **DD-60 draft covers every live cell** — lexical-bindings-shadow-macros semantics; reserved-words-invalid-names validator spec; DD-58 boundary untouched; per-cell target behavior; breaking-change analysis (expected: wrong-code rows become correct; nothing correct breaks — verify that claim against the matrix) | DD-60 in `arc13/design/`; zero TBD cells; the breaking table | serious | operator decision 2026-07-06 | open | | odm promotion = Duncan, after review |
| F-3 | **Implementation recon + 02/03 sizing** — per-backend mechanism sketch (where binding awareness attaches in each expander), LoE estimate, merge-or-split recommendation | the recon section in the closing report | serious | arc-plan sizing note | open | | honest LoE — this decides the arc's remaining shape |
| F-4 | **No compiler changes** — recon only | empty diff on `crates/` + `packages/` (probe script/fixtures excepted, per F-1's home decision) | correctness | slice-doc | open | | the discipline that kept F-4/arc05 safe, applied again |
| F-5 | **Green bar untouched** | `make check` ✓ (unchanged behavior); suites at baseline | serious | standing bar | open | | |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> Sub-questions (shadowing granularity, exported-name coverage, probe
> home) surfaced in the closing report. DD-60 goes to the operator for
> confirmation before slice02 is scoped against it.
