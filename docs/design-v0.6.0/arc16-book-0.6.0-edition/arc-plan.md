# arc16 — Lykn Book 0.6.0 Edition

> **Status: OPEN — slice01 `pre-book-decision-gate` closed/CDC-verified
> 2026-08-08; operator decisions pending before book prose.** This arc gates
> arc09/release: the book is the full-surface reader of 0.6.0, and every
> language/tooling/book defect it exposes must be fixed for 0.6.0 or routed
> with a named home before the release cut.

## 1. Capability

Arc16 produces the Lykn Book's 0.6.0 edition and uses that work as the final
full-surface review of the language, CLI, package model, guides, and teaching
story before arc09 cuts the release.

The plan-of-record lives in this language repo because 0.6.0 release readiness
gates on it. The book content remains in the sibling book repo
`/Users/oubiwann/lab/cnbb/lykn`, and the reusable prose conventions remain in
`/Users/oubiwann/lab/cnbb/lykn-writers-guide`. Those repos now have tracked
`AGENTS.md` files pointing back here; do not create a parallel planning tree in
either sibling repo.

This arc is done when:

- the 0.6.0 book edition reflects shipped 0.6.0 behavior rather than 0.5.x
  drift;
- every Lykn code example touched by the pass is checked against the current
  compiler/tooling surface;
- the pre-book design findings from dogfooding have either landed, been
  accepted as-is with explicit rationale, or been routed out of 0.6.0 with a
  named re-entry condition;
- the book and writers-guide instructions no longer teach stale paths,
  obsolete toolchain flows, or unreachable verification gates;
- the final HTML/EPUB build, link/path sweep, and voice review are recorded in
  the arc close.

## 2. Source Material

Read these before planning or executing any slice:

- [`design/kickoff-thread-book-0.6.0-update.md`](./design/kickoff-thread-book-0.6.0-update.md)
  — the original 6-8 iteration book-update thread and open decisions.
- [`design/book-drift-inventory-0.6.0.md`](./design/book-drift-inventory-0.6.0.md)
  — the historical drift inventory. Treat it as a snapshot to verify, not live
  truth.
- [`design/fence-wiring-spec.md`](./design/fence-wiring-spec.md) — the
  `lykn test --docs --fence lisp` reachability spec for the book's `lisp`
  fences.
- [`design/dogfooding-friction-log.md`](./design/dogfooding-friction-log.md) —
  real-module dogfood findings, including the pre-book language/package
  decisions.
- [`../../backlog/discoveries.md`](../../backlog/discoveries.md) — permanent
  register rows for routed findings.
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` and
  `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` — sibling-repo
  instruction files that record the split-by-design planning layout.

## 3. Slice Breakdown

Plan late, plan deep. slice01 is closed as an evidence packet; later slices
remain deliberately scoped at capability level until the operator decides which
slice01 recommendations land in 0.6.0 and which route to later work.

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · pre-book-decision-gate** | Re-ground the historical book inventory and dogfood findings against current lang/book/writers-guide state; produce the operator decision packet for D-1...D-5, `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN`; classify each as 0.6.0 implementation, docs/book-only, or 0.7.0+ deferral; recommend the next executable slice order. No compiler/book prose edits. | **Closed / CDC-verified** ([closing-report](./slice01-pre-book-decision-gate/closing-report.md), [cdc-verification](./slice01-pre-book-decision-gate/cdc-verification.md)) |
| **slice02 · book-instruction-bootstrap** | Reconcile the book repo and writers-guide instructions after slice01 decisions: stale paths, toolchain commands, planned-ToC strategy, `AGENTS.md`/`CLAUDE.md` status, and durable close-artifact locations. Disposition Bucket 0 rows that are already fixed by sibling-repo commits. | Next to open after operator decisions |
| **slice03 · book-fence-reachability** | Make the book's `lisp` fences reachable to automated verification, using the fence-first route recommended by slice01 unless the operator chooses another strategy. Establish the gate that later chapter slices must run. | Blocked on `D-2607-R4NW` decision |
| **slice04 · current-book-drift-refresh** | Refresh the 0.6.0 book drift inventory against the current book/writers-guide/lang heads after arc07, arc10, and arc15 have closed. Replace stale May bucket/thread terminology with live 0.6.0 arc/slice truth. | Planned after slice02/slice03 |
| **slice05 · toolchain-and-project-structure-chapters** | Update book chapters that teach project layout, Deno boundaries, testing, tooling, CI/CD, publish/build/dist, and source ownership. Depends on the slice01 decision for `D-2608-SOWN`. | Provisional |
| **slice06 · language-surface-chapters** | Update language chapters for identifier mapping, position-aware forms, records/single-constructor types, exports, grouped local bindings, and flatter validation branching. Depends on slice01 decisions for `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`, plus any routed implementation slices. | Provisional |
| **slice07 · compiler-and-verification-chapters** | Update compiler/testing chapters for the final 0.6.0 compiler surface, cross-compiler verification, source linting, doctest reachability, and any late compiler semantics settled by earlier slices. | Provisional |
| **slice08 · edition-close-and-release-gate** | Whole-book final pass: build HTML/EPUB, run book/example gates, voice consistency review, stale-link/path sweep, version/edition metadata check, and arc close with bubble-up to arc09. | Provisional |

slice01 found that D-3 is resolved by the tracked lang planning home, while D-1
and `D-2607-R4NW` should be treated as one verification strategy: implement a
repeatable book-fence gate before chapter code edits. It also confirmed that
`D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN` remain operator
decisions. If any of them becomes 0.6.0 implementation work, it may live in
arc10, a new 0.6.0 language-surface arc, or an arc16 support slice, but the
route must be explicit and must block the relevant chapter slice until closed.

## 4. Dependencies

Consumes:

- arc07 guide/SKILL alignment — closed and current as of 2026-08-08;
- arc10 compiler-completion — closed, including the no-else `if` expression
  fix;
- arc15 surface-syntax-traps — closed, with slice03 hardening deferred to
  0.7.0 by name;
- arc01-arc06, arc08, arc11-arc13 — shipped behavior the book must describe.

Feeds:

- arc09 release — arc09 remains future until arc16 closes;
- any new 0.6.0 implementation slice/arc opened from slice01 decisions;
- 0.7.0 backlog, but only for findings explicitly deferred with a re-entry
  condition.

## 5. Decision Gates

Slice01 must produce a table with one row per gate below. The operator makes the
final call; CC/CDC supply evidence, options, costs, and routing.

| Gate | Source | Decision needed before |
|------|--------|------------------------|
| D-1 | historical inventory B0-G | choose book example verification strategy: bootstrap `/Users/oubiwann/lab/cnbb/lykn/test/book/`, use `lykn test --docs --fence lisp`, or downgrade the old test-suite claim |
| D-2 | historical inventory B0-I | preserve `planned-toc.md` as v2 and create v3, or reconcile in place |
| D-3 | historical inventory B0-M | confirm durable close-artifact locations after `workbench/` was declared scratch |
| D-4 | historical inventory | decide whether the verification bootstrap is sequential before chapter work or can run in parallel |
| D-5 | historical inventory | decide PR/commit cadence for book/writers-guide iterations |
| `D-2607-R4NW` | fence-wiring spec | choose and/or implement the book `lisp` fence reachability mechanism |
| `D-2608-XPRT` | dogfood F-7 | settle export ownership: inline definitions, top-of-module exports, `mod.lykn` re-export semantics, and implementation route |
| `D-2608-LBND` | dogfood F-8 | settle grouped local binding syntax/semantics and implementation route |
| `D-2608-COND` | dogfood F-9 | settle flatter validation branch syntax/semantics and implementation route |
| `D-2608-SOWN` | dogfood F-10 | settle Lykn-owned generated/config manifest placement without restricting user-owned non-Lykn source files |

Slice01's decision packet is recorded in
[`slice01-pre-book-decision-gate/closing-report.md`](./slice01-pre-book-decision-gate/closing-report.md)
and CDC-verified in
[`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md).
Current CDC read:

- D-3 is resolved unless the operator reopens artifact-home policy: durable
  arc16 planning/close artifacts live in this tracked lang arc directory, not
  sibling repo scratch space.
- D-1 and `D-2607-R4NW` should be decided together. The recommended route is a
  repeatable `lykn test --docs --fence <tag>` book gate, with targeted external
  tests later for examples that need more than fence compilation/execution.
- D-2, D-4, and D-5 are still operator/editorial process decisions for ToC
  policy, sequential verification, and cross-repo review cadence.
- `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` are language-surface
  decisions. If selected for 0.6.0, they need implementation before slice06 can
  teach them.
- `D-2608-SOWN` can be a docs-only 0.6.0 compromise or a scaffold/build/dist
  behavior change, depending on the operator decision.

## 6. Arc Ledger

Capability: the 0.6.0 Lykn Book edition is release-ready, and the book pass has
either fixed or routed every language/tooling defect it surfaced.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 pre-book decision gate closed | ptr: slice01 closing-report + cdc-verification | serious | arc-plan | **done** | [`slice01-pre-book-decision-gate/closing-report.md`](./slice01-pre-book-decision-gate/closing-report.md) + [`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md); commit `00b3338` plus CDC follow-up | decisions before edits |
| A-2 | every pre-book decision gate has a final disposition | arc close: compare §5 gates with operator decisions and routed homes | serious | arc-plan | open | | no design silent drops |
| A-3 | book/writers-guide instructions are reconciled with the confirmed layout and current toolchain | read sibling `AGENTS.md`, writer-guide diffs, and slice02 close | serious | arc-plan | open | | includes stale B0 rows |
| A-4 | book code fences/examples are reachable by an automated gate | run the chosen book fence/test command and record extracted/passing/failing counts | serious | `D-2607-R4NW` + B0-G | open | | class-(b) composition row |
| A-5 | stale 0.5.x/tooling/book drift inventory rows are either fixed, no-op, or deferred with re-entry | arc close: compare refreshed inventory against slice closures | serious | inventory | open | | anti-silent-drop row |
| A-6 | chapters touched for 0.6.0 language/tooling changes match shipped behavior | chapter-scope tests plus source sweeps against current lang guides/SKILL | serious | P-20 | open | | reproduced at arc scale |
| A-7 | final book outputs build and render in supported formats | run mdBook HTML/EPUB build and any configured book checks | serious | P-20 | open | | include known EPUB workaround |
| A-8 | arc16 bubbles up honestly to arc09 | arc closing-report updates project-plan/status and names remaining blockers, if any | serious | project-management | open | | release gate |

## 7. Verification Strategy

Minimum gates for arc16 planning/docs changes in this repo:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

Book/writers-guide implementation slices add their own repo-local gates, chosen
per slice. At minimum, any chapter slice touching code fences must run the
chosen book example gate for the affected chapter(s), and the final slice must
build the book HTML/EPUB outputs. If a gate is not yet possible because the
test/fence bootstrap does not exist, the slice must say that plainly and route
the bootstrap before relying on manual review.

## 8. Out Of Scope

- Publishing the 0.6.0 release itself; arc09 owns release cutting.
- GitHub Linguist / ` ```lykn ` migration; deferred to 0.7.0+ unless the
  operator changes the release boundary.
- Cover art, illustration redesign, translation/localization, or broad chapter
  restructuring not caused by 0.6.0 truth.
- Teaching around a known language defect instead of fixing or routing it.

## 9. Version History

### v1.1 — 2026-08-08 (slice01 closed/CDC-verified)

slice01 closed at `00b3338` and CDC reproduced the close in
[`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md).
The arc plan now treats the decision gate as closed, marks A-1 done, resolves
D-3 to the tracked lang arc16 planning home, records the fence-first
recommendation for D-1 / `D-2607-R4NW`, and keeps the export, grouped-binding,
branching, and source-ownership findings as explicit operator decisions before
later chapter slices normalize those surfaces.

### v1.0 — 2026-08-08 (arc planned; slice01 opened)

Created the arc plan after arc07, arc10, and arc15 closed and after the
external dogfood experiment added four pre-book decisions:
`D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN`. Converted the
old "6-8 iteration" book thread into canonical arc/slice shape, kept the split
layout decision (plan in lang, content in sibling repos), opened the arc ledger,
and opened slice01 as the decision-gate recon before implementation/book prose
work begins.
