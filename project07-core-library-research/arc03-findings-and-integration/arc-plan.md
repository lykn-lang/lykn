# Arc03 — Findings and integration

## Capability and status

Correct accepted guide, book, language and tooling findings; reproduce original
failures and relevant regressions. Human code-shape acceptance remains distinct.
This arc opens early because Arc01/Slice01 exposed D-2609-PERM.
Parent: [project plan](../project-plan.md). Status: active; Slice01 CC proposed-done, awaiting CDC.

## Slice breakdown

| Slice | Capability | Depends on | Status |
| --- | --- | --- | --- |
| [slice01-run-permissions](slice01-run-permissions/slice-plan.md) | Explicit run permissions, real denial controls and traceable build | Arc01/Slice01 CDC | CC proposed-done; CDC pending |
| slice02-test-permissions | Reconcile test runner's implicit -A with governance while preserving corpus/doc testing | Slice01 and current test contract inspection | Roadmap only |
| slice03-guide-consistency | Correct LINT/NPMB and accepted guide findings; compare original authoring tasks | Arc02 evidence and runtime decisions | Roadmap only |
| slice04-book-and-language-corrections | Integrate JSER and accepted book/language/formatter findings with operator review | Arc02 and Project02 book coordination | Roadmap only; split as needed |
| slice05-regression-and-integration | Demonstrate correction composition and carry residual work to handoff | Earlier slices and Arc02 completion | Roadmap only |

After Slice01 closes, resume the already-open Arc01/Slice02 research packet;
queue this arc's Slice02 planning. This explicit cross-arc ordering supersedes
numerical advancement. Closing the run fix does not close Arc03 or test-runner
permission debt. Later slices are planned deeply when evidence is available.

## Boundaries and verification

Each source slice specifies exact worktree/paths and separate source/planning
commits. Current inspected release/0.6.x head is `2a0cabf`; refresh before work
and preserve concurrent edits. Never reset to the old research baseline or
author source on main. No automatic release rebase/propagation or publication.

Retain original claims/reproductions, corrected behavior and regressions.
Apply Expedited Mode exact-path commits, independent CDC review and evidence-
based close. The ledger is [ledger.md](ledger.md). Arc-level composition must
be independently demonstrated, not inherited from child closures.

## Current correction evidence

Slice01 source commit `d0bb981dae2a4abf6c984406c4b2081a45cc92f8` supplies the run correction.
Its [CC report](slice01-run-permissions/closing-report.md) and
[RP-B01 receipt](slice01-run-permissions/artifacts/build-receipt.md) are attested,
not independently closed. A3-01 and the JSON launch gate remain open. No slice
breakdown or sequencing change was required by implementation; repeated-scope
and empty-value behavior is retained in the evidence and tests.

## Version History

- 2026-09-12 v1.1: Slice01 CC delivered the scoped correction and build receipt;
  attached evidence while retaining CDC, JSON and test-runner boundaries.

- 2026-09-12 v1.0: Opened early from Arc01/Slice01 CDC findings; run permissions
  and build provenance precede JSON trials. Other corrections remain separate.
