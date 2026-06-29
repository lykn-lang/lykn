# arc04 — Refactor Tooling (`move-function`)

> **Status: In flight.** Slices have implementation prompts (2026-05-23) but no
> closing reports. Reconstructed retroactively (2026-06-28) from the M22.5
> tooling track. See `design/move-function-tool-spec-SUPERSEDED.md` (the
> combined spec, retained for reasoning) and `design/m22.5-audit-prompt.md`.

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
| **slice01 · move-function-core** | M22.5-T1a: verbatim-move core — edits only the two named files, validated on a zero-external-consumer helper | **Open — scoped** (ledger + CDC handoff ready for CC; incl. fmt Step 0) |
| **slice02 · move-function-rewiring** | M22.5-T1b: cross-file consumer rewiring + batch mode, validated on the real `andChain` move with the full suite green | Open (prompt written; no closing report) |

Both slices currently hold only `cc-prompt.md` (the open-set assignment). Their
`ledger.md` / `closing-report.md` / `cdc-verification.md` will be written as the
work runs — they are correctly absent for not-yet-executed slices.

## 3. Dependencies

Consumes: arc03's coherent two-compiler surface and the DD-37 per-form migration
state. Enables: the remaining M22.5 surface-extraction workstreams.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (verbatim-move core) closed | ptr: slice01 closing-report | correctness | arc-plan | open | not started |
| A-2 | slice02 (rewiring + batch) closed | ptr: slice02 closing-report | correctness | arc-plan | open | not started |
| A-3 | `move-function` performs a real move (`andChain`) with the full suite green, end-to-end | run the move + `lykn test` | serious | arc-plan | open | reproduce at arc scale |

## 5. Version History

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from the M22.5 tooling-track prompts (2026-05-23). Arc is the
warmest in-flight thread; slices carry open-set prompts only.
