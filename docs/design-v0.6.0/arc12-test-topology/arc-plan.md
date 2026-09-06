# arc12 — Test Topology (each test runs once)

> **Status: CLOSED — gated by the operator 2026-07-05** (suite bars
> reproduced; census operator-observed; see
> [`closing-report.md`](./closing-report.md) §5). Created same day from the operator's repeated-tests
> observation + CC's quantified investigation (corpus ×~12); delivered same
> day: `make test-docs` **1m52s → 2.6s**, `make check` **>2m → 1m04s**,
> corpus **1× / 0×**, counts unchanged — and the operator's own
> `make check && make test-docs` run reproduced the after-state green. See
> [`closing-report.md`](./closing-report.md) §4 for the (now tiny)
> consolidated three-arc gate.

## 1. Capability

**Every test executes exactly once per `make check`, and `make test-docs`
tests docs.** The verified-by-CC redundancy census (2026-07-05):

1. `make check` ⊇ `test-docs`, so the habitual `make check && make
   test-docs` duplicates the entire doc phase. *(Invocation habit — fixed by
   documentation + honest targets.)*
2. **`lykn test --docs X` runs the whole 88-file corpus first** (patterns
   default to `test/` even under `--docs`), 4× per `test-docs`. *(CLI
   behavior bug — the biggest structural cause.)*
3. `test-lykn` re-runs a strict subset of what `test-js` just ran. *(Target
   drift — names lie; `test-js` runs everything.)*
4. `fresh-artifacts` + `common-checks`' debug `build` duplicate build work
   across invocations. *(Minor; incremental builds — 0 crates recompiled.)*

Fix set = CC's A–D: **A** `--docs` without explicit test patterns runs docs
only; **B** the doc suites run under one Deno startup; **C** `make test`
runs each suite once (`test-lykn` removed or made honest); **D** build-once
across `common-checks`/`fresh-artifacts`. Compilation is *not* the problem
(measured); Deno corpus re-execution is.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · run-once-topology** | Implement A–D + update the canonical-verify docs (the operator bar becomes `make check`, full stop); sentinel-census verification (count executions of one corpus file across each target); suite counts and doctest counts unchanged; before/after wall-clock recorded. | **Open — scoped** (open set written) |

## 3. Dependencies

Consumes arc11 slice01's out-dir layout (the corpus lives in
`target/lykn/test/`). **Blocks nothing but should land before the
arc10/arc11 gate re-run** (it changes `lykn test` internals, so one gate
session at the end covers everything, cheaply). Independent of arc05.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-07-05; `3612cad`) — attested (pointer) | |
| A-2 | **corpus executes exactly once per `make check`; zero times per `make test-docs`** | sentinel census (e.g. `surface/bind_test`): count = 1 in `make check`, 0 in `make test-docs`; doc suites run once each | serious | CC redundancy report 2026-07-05 | **met (attested + operator-observed)** | CC census (1× / 0×) + operator host run 2026-07-05 (`make check && make test-docs` green, single-run observed) | formal census grep once at the gate if wanted — one command now |
| A-3 | suite + doctest counts unchanged; wall-clock materially reduced (before: `make test-docs` ≈ 1m53s, corpus ~12× across the pair) | `lykn test` 1365/0; deno 673/0; doctest counts unchanged; recorded before/after times | serious | arc-plan | **met (attested + operator-reproduced)** | 1365/0 · 673/0 · docs 475/0; `make test-docs` 1m52s → **2.6s**; `make check` >2m → **1m04s**; operator run green | minor: 473-vs-475 doc-count reconciliation, one glance |

## 5. Version History

### v1.0 — 2026-07-05 (created)
Created from the operator's observation (repeated tests, slow manual
verification) during the arc10/arc11 gate attempt, corroborated
independently by CDC (Makefile topology: `test-lykn` ⊂ `test-js`) and
quantified by CC (corpus ×12; `--docs` runs the corpus; 1m53s test-docs =
85–94% corpus). Homed as a new arc rather than an arc11 slice03: arc11's
close is assembled around its stated capability and this is a third one.
Another specimen of the drift genus: targets that were honest once
(`test-js` = deno-only, `test-lykn` = corpus) silently became lies when
`lykn test` grew to cover both. Sequences immediately — it cheapens the
pending gates and every verification after.
