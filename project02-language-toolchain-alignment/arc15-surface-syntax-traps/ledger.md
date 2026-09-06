# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

Composition criteria that verify the capability. Class-(b) rows reproduced at
arc scale. Opens here; per-row walk closes in `closing-report.md`.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (reject + guide migration) closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | `9ca9c7e` + CDC verification | the guarantee + docs correctness |
| A-2 | slice02 (lint rule) closed | ptr: slice02 cdc-verification | serious | arc-plan | **done** | `d6c23b5` + follow-up B `90cf211`, both CDC-verified | the DX layer |
| A-3 | **`((express x):m …)` and every non-atom-head + keyword-first shape is a compile ERROR** with the threading fix-it (not silent, not a warning) | host: `lykn compile` the trap → non-zero exit + fix-it message; the 3 canonical shapes (express / new / arithmetic) all rejected | serious | DD-64 | **done** | arc close repro: `((express parts):join "")`, `((new TextEncoder):encode s)`, and `((/ cents 100):toFixed 2)` all exit 1 with the method-on-parenthesized-expression diagnostic + threading fix-it | reproduced at arc scale |
| A-4 | **the Lykn-correct form compiles** — `(-> (express x) (:m …))` and atom `(x:m …)` still emit correctly (no over-rejection) | host: threading + atom-method forms compile green; positive tests | correctness | DD-64 | **done** | arc close repro: atom `(parts:join "")` emits `parts.join("")`; threaded `(-> (express parts) (:join ""))` emits `parts.value.join("")`; `lykn lint` returns no findings for both | anti-over-rejection |
| A-5 | **no guide teaches the trap** — the sweep for `):kw` glued fingerprint returns only *documented-as-wrong* sites; `make test-docs` green | re-run the CDC sweep; every remaining hit is an ID-31/anti-pattern "don't" example | correctness | CDC sweep | **done** | guide sweep returned 9 hits, all documented-as-wrong/comment/prose; `make test-docs` green: 476 passed, 0 failed, 15 skipped | broader guide/SKILL alignment remains arc07 |
| A-6 | **no existing source/test regressed** — corpus was 0-hits pre-change; `make check` green | host: `make check` green post-error | correctness | CDC sweep | **done** | slices 01/02 attested green; slice04 and slice05 closed green; final arc-close `make check` green on the committed close-documentation state | sweep said 0 source hits |

