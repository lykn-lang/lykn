# arc04 — Refactor Tooling (`move-function`)

> **Status: In flight — slice01 closed; slice02 next.** slice01
> (`move-function-core`) delivered the byte-exact verbatim-move core (TDD-first,
> 9/9 rows, byte-identity invariant verified). slice02 (cross-file rewiring +
> batch) is the remaining work. Reconstructed retroactively (2026-06-28) from
> the M22.5 tooling track. See `design/move-function-tool-spec-SUPERSEDED.md`
> and `design/m22.5-audit-prompt.md`.

## 1. Capability

A byte-exact `move-function` tool that relocates a function between files
without changing its text, then rewires cross-file consumers — the tool the
DD-37 surface-extraction workstreams (M22.5-2, M22.5-3) are meant to be
executed *with*, so that large mechanical surface refactors are verifiable
rather than hand-edited. The tool's own development follows ledger discipline
(TDD-first paired commits, grep-verifiable Verify), and respects the *spirit*
of the CLAUDE.md safety gates (never silently bypass its own verify step).

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · move-function-core** | M22.5-T1a: verbatim-move core — edits only the two named files, validated on a zero-external-consumer helper | **Closed** (9/9; `scripts/move-function.js` TDD-first; byte-identity invariant verified) |
| **slice02 · move-function-rewiring** | M22.5-T1b: cross-file consumer rewiring + batch mode. **Refined by slice01 bubble-up:** must (a) pick/create the real extraction target (no `surface-helpers.js` exists yet) and (b) use a **rebuild-first** `--verify-cmd` (built `lang/` staleness — reuse arc03/slice11's freshness guard) | Open (prompt written; not yet scoped/run) |

slice02 holds its `cc-prompt.md` (open-set) plus the two scope refinements above;
its `ledger.md` / close set are written when it becomes active (plan late, plan
deep).

## 3. Dependencies

Consumes: arc03's coherent two-compiler surface and the DD-37 per-form migration
state. Enables: the remaining M22.5 surface-extraction workstreams.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (verbatim-move core) closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | **done** | slice01 closed 9/9 (CC-attested + CDC code/git-verified) |
| A-2 | slice02 (rewiring + batch) closed | ptr: slice02 closing-report | correctness | arc-plan | open | not started |
| A-3 | `move-function` performs a real move with the full suite green, end-to-end | run the move + `lykn test` (rebuild-first verify) | serious | arc-plan | open | reproduce at arc scale (gated on slice02 + a real extraction target) |

## 5. Version History

### v1.1 — 2026-06-28 (slice01 closed)
slice01 (`move-function-core`) closed: `scripts/move-function.js` built TDD-first
(9/9 rows), byte-identity invariant verified, fmt drive-by landed (`401e2bd`).
A-1 → done. **Bubble-up from slice01 refined slice02's scope** (surfaced by
slice01): (a) no `surface-helpers.js`/extraction target exists yet — slice02 must
pick or create one; (b) the tool's verify runs against built `lang/`, so slice02
needs a rebuild-first `--verify-cmd` — reuse arc03/slice11's freshness guard
rather than re-solve. Recorded in the slice02 breakdown row.

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from the M22.5 tooling-track prompts (2026-05-23). Arc is the
warmest in-flight thread; slices carry open-set prompts only.
