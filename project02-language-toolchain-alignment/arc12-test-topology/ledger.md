# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-07-05; `3612cad`) — attested (pointer) | |
| A-2 | **corpus executes exactly once per `make check`; zero times per `make test-docs`** | sentinel census (e.g. `surface/bind_test`): count = 1 in `make check`, 0 in `make test-docs`; doc suites run once each | serious | CC redundancy report 2026-07-05 | **met (attested + operator-observed)** | CC census (1× / 0×) + operator host run 2026-07-05 (`make check && make test-docs` green, single-run observed) | formal census grep once at the gate if wanted — one command now |
| A-3 | suite + doctest counts unchanged; wall-clock materially reduced (before: `make test-docs` ≈ 1m53s, corpus ~12× across the pair) | `lykn test` 1365/0; deno 673/0; doctest counts unchanged; recorded before/after times | serious | arc-plan | **met (attested + operator-reproduced)** | 1365/0 · 673/0 · docs 475/0; `make test-docs` 1m52s → **2.6s**; `make check` >2m → **1m04s**; operator run green | minor: 473-vs-475 doc-count reconciliation, one glance |

