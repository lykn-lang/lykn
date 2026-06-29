# arc06 — Cross-Project Dependency Ergonomics

> **Status: Open — one closed micro-slice; main work not started.** Planned at
> capability depth, per *plan late, plan deep*. Originating thread preserved at
> `design/kickoff-thread.md`. Round-2 migration (2026-06-28) recovered real seed
> evidence CC's reconciliation surfaced: a closed Finding-D micro-slice
> (`@lykn/lang` exports gap) and the mycelium bootstrap report it grew from.

## 1. Capability

lykn projects sometimes consume lykn itself as a dependency (the canonical
downstream is the **mycelium** project at `~/lab/lykn/mycelium`). When that
integration breaks, downstream users hit hard blockers. Phase 1/2 fixed several;
this arc audits and addresses what remains, and delivers the ergonomic
dependency-addition path — `lykn add` — tracked as future work since DD-51
(which banned `deno add` in lykn projects without yet providing the Lykn-level
replacement). The absence of `lykn add` does not block the `deno add` ban; this
arc closes the ergonomics gap the ban opened.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · lang-exports-gap** (Finding D) | `packages/lang/deno.json` `exports` missing `./mod.js`; fix the downstream-resolution blocker | Closed (2026-05-12) |

_Remaining not yet planned._ Likely slices when active: a downstream-blocker
audit (against mycelium as the acceptance corpus; see
`design/mycelium-bootstrap-issues.md`) → `lykn add` implementation
(`project.json` workspace-import aware) → cross-project resolution hardening.
Size per slice when the arc is detailed.

## 3. Dependencies

Consumes: arc01's `target/lykn/build/` + `project.json` import layout; DD-51's
tool-boundary decisions. Acceptance corpus: the mycelium downstream.

## 4. Arc ledger

Fully opens when the arc-plan is detailed. Class-(b) composition row will be a
mycelium-as-downstream end-to-end build/consume demonstration, reproduced at arc
scale. One row exists now:

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 (lang-exports-gap) closed | ptr: slice01 closing-report + cdc-verification | correctness | round-2 | done | Finding-D closing + CDC review (attested) |

## 5. Version History

### v1.1 — 2026-06-28 (round-2 migration)
Added closed **slice01 · lang-exports-gap** (Finding D — a complete
finding→prompt→closing→cdc micro-slice) and `design/mycelium-bootstrap-issues.md`
(its empirical root), surfaced by CC's reconciliation. Status moved from "not
started" to "one closed micro-slice."

### v1.0 — 2026-06-28 (reconstructed)
Capability statement recovered from the dep-ergonomics kickoff thread; arc
seeded, not slice-planned.
