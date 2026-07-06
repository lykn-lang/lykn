# Slice 01: run-once-topology

> Implement CC's A–D from the 2026-07-05 redundancy report so **every test
> executes exactly once per `make check`** and **`make test-docs` tests
> docs** (today it is 85–94% corpus re-runs). The operator's manual
> verification bar becomes `make check`, full stop.

## Goal

Kill the four verified redundancies: (A) `lykn test --docs X` runs the
whole `test/` corpus before the docs — every time, 4× per `test-docs`;
(B) the doc phase pays 4 Deno startups; (C) `test-lykn` re-runs a strict
subset of `test-js`; (D) duplicate build work across `common-checks` and
`fresh-artifacts`. Measured baseline: corpus ×~12 across
`make check && make test-docs`; `make test-docs` ≈ 1m53s. Compilation is
NOT the cost (0 crates recompiled in the timed run) — Deno corpus
re-execution is.

## Current state (CC report 2026-07-05 + CDC topology read)

- **A (CLI bug, biggest structural cause):** `cmd_test`'s `patterns`
  defaults to `test/`, and the `--docs` branch (`main.rs:463–480` region)
  discovers + compiles + runs the corpus before `doctest::run_doc_tests` —
  so `--docs docs/guides/` executes 88 corpus files to test 16 doc files.
- **B:** `test-docs` = 3 sub-targets = 4 `lykn test --docs` invocations
  (guides, README, examples ×2), each a Deno startup (~25–40s each with
  the corpus; seconds without).
- **C (target drift):** `test-js` runs bare `lykn test` (= the FULL suite:
  673 hand-written + ~692 corpus = 1365); `test-lykn` then runs
  `lykn test test/surface/` — a pure subset re-run. The names predate
  `lykn test` growing to cover both.
- **D (minor):** `check` → `common-checks` → `build` (debug) and
  `test-*` → `fresh-artifacts` (release + `lykn build`); incremental, so
  cheap on a warm tree, compounding on cold.

## Scope (in)

1. **F-2 (A):** with `--docs` and **no explicit test patterns**, run docs
   only. Explicit patterns + `--docs` keeps the combined behavior
   (preserve the capability; change the default). Corpus count during
   `make test-docs` → **0**.
2. **F-3 (B):** the doc suites run under **one** Deno startup for
   `make test-docs`; keep the granular `test-docs-*` targets for focused
   dev runs (mechanism — one multi-path invocation vs one combined out-dir
   — CC's call, stated).
3. **F-4 (C):** `make test` runs each suite **exactly once**. `test-lykn`
   is removed from `test`'s chain and either deleted or repurposed
   honestly (e.g. an explicit convenience alias) — surface the choice.
   Target names end up truthful.
4. **F-5 (D):** rationalize the build steps so one `make check` does one
   build pass (mechanism CC's call; minor).
5. **F-6 docs:** the canonical operator verify is **`make check`** —
   update CLAUDE.md (verify commands), `test/CONVENTIONS.md`, and the
   process-standard wording (the green bar's "make test-docs (or make
   check)" becomes "make check; make test-docs only for doc-focused
   iteration"). This kills redundancy #1 (the `&&` habit) at the source.

## Scope (out)

- Batching the 97 per-file `deno eval` compile spawns into one process — a
  real future speed lever, but a compiler-CLI change beyond topology; file
  it as a candidate (Post-0.6.0 polish or arc09-adjacent).
- CI workflow changes beyond what the Makefile targets imply (arc09).
- Any change to *what* the tests verify.

## Verification approach

**Sentinel census** (CC's methodology, formalized): count executions of one
corpus file (`surface/bind_test`, 11 tests) — `make check` → exactly **1**;
`make test-docs` → **0**; each doc suite → once. Suite counts unchanged
(`lykn test` 1365/0; deno 673/0; doctest counts identical before/after).
Before/after wall-clock recorded for `make check` and `make test-docs` —
the win is measured. Rebuild-first.

## Exit criteria

Census clean (1/0/once); counts unchanged; times recorded (expect
`make test-docs` → seconds; `make check` roughly halved); targets honest;
docs updated so `make check` is the stated bar. The pending arc10/arc11
gate re-run should be performed **after** this lands (one cheap session
covers all three arcs).
