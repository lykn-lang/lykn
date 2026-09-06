# Slice 01: run-once-topology — Ledger

Every test executes exactly once per `make check`; `make test-docs` tests
docs. CC's A–D, with the sentinel census as the proof. Rebuild-first. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. 6 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Baseline recorded** — the redundancy census (corpus ×~12 across `make check && make test-docs`; `make test-docs` ≈ 1m53s, 85–94% corpus; 0 crates recompiled) is captured in the closing report as the before-state | before-numbers table (from the 2026-07-05 report + a fresh timing) | correctness | CC redundancy report | open | | the win must be measurable against this |
| F-2 | **(A) `--docs` without explicit test patterns runs docs only** — `lykn test --docs docs/guides/` executes 0 corpus files; explicit patterns + `--docs` preserves the combined run | sentinel census during `make test-docs` → 0 corpus executions; doctest counts unchanged; a test pinning both behaviors (docs-only default; patterns+docs combined) | serious | CC report cause #2 | open | | the biggest structural fix; TDD the CLI default change |
| F-3 | **(B) one Deno startup for the doc phase** — `make test-docs` runs all doc suites (guides/README/examples×2) under a single invocation; granular `test-docs-*` targets preserved for focused runs | process/timing evidence (one startup); each doc suite runs exactly once; mechanism stated | correctness | CC report | open | | mechanism (multi-path `--docs` vs combined run) = CC's call, with rationale |
| F-4 | **(C) `make test` runs each suite exactly once** — `test-lykn`'s subset re-run is gone from the chain (target deleted or repurposed honestly, surfaced); target names truthful (`test-js` renamed or re-documented to match what it runs) | sentinel census during `make check` → exactly **1** corpus execution; `make -n test` shows no duplicate suite | serious | CC report cause #3 / CDC topology read | open | | naming: surface, don't decide silently |
| F-5 | **(D) one build pass per `make check`** — the `common-checks` debug build vs `fresh-artifacts` release build duplication rationalized | `make -n check` build steps; stated mechanism | polish | CC report cause #4 | open | | minor; incremental — don't over-engineer |
| F-6 | **Counts unchanged + docs updated + times recorded** — `lykn test` 1365/0; deno 673/0; doctest counts identical; AGENTS.md + `test/CONVENTIONS.md` + the process-standard wording name **`make check`** as the canonical bar (killing the `&& make test-docs` habit); before/after wall-clock for `make check` and `make test-docs` in the closing report | suite runs; grep the doc updates; the timing table | serious | standing bar + CC recommendation #0 | open | | expect: `make test-docs` → seconds; `make check` ≈ halved |

## What Worked

- **The implementer wrote the audit, then implemented it under a ledger** —
  CC's report became F-1's baseline verbatim, so the win was measured
  against numbers nobody could quietly soften (1m52s → 2.6s; 8×/4× → 1×/0×).
- **The census sentinel made "runs once" checkable** — a single grep-able
  claim instead of "it feels faster."
- **The fix surfaced two latent defects for free**: lint ran before the
  binary it needs was built (F-5 caught the ordering), and stray sibling
  `*_test.js` double-run via deno discovery (filed as hardening).

## Closure

Closed 2026-07-05 (commit `3612cad`). Verified by: CC (attested, measured)
+ CDC (`cdc-verification.md`: A–D all reproduced by code; census/timing
attested) + **operator host run same day** (`make check && make test-docs`
green, single-run observed — the after-state reproduced where it matters).
Rows: 6. Done: 6. Deferred: 0. No-op: 0. **Filed + instantiated:**
batch-compile lever; stray-sibling hardening; freshness-guard scoping;
`--compile-only`+`--docs` tidy (project-plan §Post-0.6.0). Minor open
query: doc-count 473-vs-475 reconciliation (one glance at the gate).

> The batch-compile speed lever (97 per-file `deno eval` spawns → one
> process) is explicitly out of scope — file it in the bubble-up as a
> Post-0.6.0 candidate. After this closes: **one combined gate session**
> reproduces arc10 §5 + arc11 §5 + arc12 A-2/A-3 — cheaply.
