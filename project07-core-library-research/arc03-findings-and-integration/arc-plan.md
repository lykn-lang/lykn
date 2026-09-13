# Arc03 — Findings and integration

## Capability and status

Correct accepted guide, book, language and tooling findings; reproduce original
failures and relevant regressions. Human code-shape acceptance remains distinct.
This arc opens early because Arc01/Slice01 exposed D-2609-PERM.
Parent: [project plan](../project-plan.md). Status: active; Slice01 CDC closed
(was CC proposed-done). Slice06 is now open as the Deno 2.9.6 launch prerequisite
for Arc01/Slice04; Slice02 planning stays queued. The earlier instruction to
resume Arc01/Slice02 was fulfilled by its subsequent CDC closure.

## Slice breakdown

| Slice | Capability | Depends on | Status |
| --- | --- | --- | --- |
| [slice01-run-permissions](slice01-run-permissions/slice-plan.md) | Explicit run permissions, real denial controls and traceable build | Arc01/Slice01 CDC | CDC closed; six criteria reproduced |
| slice02-test-permissions | Reconcile test runner's implicit -A with governance while preserving corpus/doc testing | Slice01 and current test contract inspection | Roadmap only |
| slice03-guide-consistency | Correct LINT/NPMB and accepted guide findings; compare original authoring tasks | Arc02 evidence and runtime decisions | Roadmap only |
| slice04-book-and-language-corrections | Integrate JSER and accepted book/language/formatter findings with operator review | Arc02 and Project02 book coordination | Roadmap only; split as needed |
| slice05-regression-and-integration | Demonstrate correction composition and carry residual work to handoff | Earlier slices and Arc02 completion | Roadmap only |
| [slice06-deno-launch-compatibility](slice06-deno-launch-compatibility/slice-plan.md) | Restore script selection on Deno 2.9.6 while preserving explicit authority, path and argument safety | Arc01/Slice04 D-2609-DARG evidence | Open; execute before resuming Arc01/Slice04 |

After Slice01 closes, resume the already-open Arc01/Slice02 research packet;
queue this arc's Slice02 planning. This explicit cross-arc ordering supersedes
numerical advancement. Closing the run fix does not close Arc03 or test-runner
permission debt. Later slices are planned deeply when evidence is available.

New ordering, 2026-09-13: Arc01/Slice04 found that the operator-upgraded Deno
2.9.6 fails before executing the pinned CLI's no-import program. Actual argv
and upstream source identify pre-script separator handling; all-grants controls
fail identically. Slice06 owns the bounded repair and new build receipt. After
its CDC, return to the entire Slice04 open set; test-permission, guide/book,
language and integration work keep their existing owners and criteria.

CDC has [independently reproduced the blocker and evidence tooling](../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cdc-verification.md).
Slice06's correction prompt is ready for CC. Keep normal execution on deno run
and preserve the supported stdin/specifier and local-path boundaries before
normalization. No LC criterion closes from reproducing the old failure.

## Boundaries and verification

Each source slice specifies exact worktree/paths and separate source/planning
commits. CDC inspected release/0.6.x head `50608c4` on 2026-09-13; refresh before work
and preserve concurrent edits. Never reset to the old research baseline or
author source on main. No automatic release rebase/propagation or publication.

Retain original claims/reproductions, corrected behavior and regressions.
Apply Expedited Mode exact-path commits, independent CDC review and evidence-
based close. The ledger is [ledger.md](ledger.md). Arc-level composition must
be independently demonstrated, not inherited from child closures.

## Current correction evidence

Slice01 source commit `d0bb981dae2a4abf6c984406c4b2081a45cc92f8` supplies the run correction.
Its [CDC verification](slice01-run-permissions/cdc-verification.md) independently
reproduces six criteria, full gates and the [RP-B01 receipt](slice01-run-permissions/artifacts/build-receipt.md).
A3-01 closes and the JSON launcher dependency is lifted. No slice breakdown
or sequencing change is needed: resume Arc01/Slice02 with its own remaining
preflights. Repeated-scope and empty-value behavior is retained in tests.
Full gates required an isolated cache for an existing package test under the
CDC sandbox; this is not authority to add npm research dependencies.

## Version History

- 2026-09-13 v1.4: CDC independently reproduced DARG and the partial static/eval
  evidence. Confirmed Slice06 as the next correction and clarified preservation
  of normal run execution, stdin/specifiers, symlinks and relative imports.
  No source change or correction closure; full Slice04 re-entry remains gated.

- 2026-09-13 v1.3: Arc01/Slice04 preparation exposed D-2609-DARG on Deno 2.9.6.
  Added Slice06 as the immediate source correction prerequisite, preserving
  original PERM closure and all other correction/composition obligations.

- 2026-09-12 v1.2: Slice01 CDC reproduced the run correction and build receipt;
  closed A3-01 and resumed Arc01/Slice02. Existing cross-arc sequence and
  test-runner/guide/book/integration scope remain unchanged.
- 2026-09-12 v1.1: Slice01 CC delivered the scoped correction and build receipt;
  attached evidence while retaining CDC, JSON and test-runner boundaries.

- 2026-09-12 v1.0: Opened early from Arc01/Slice01 CDC findings; run permissions
  and build provenance precede JSON trials. Other corrections remain separate.
