# Arc03 ledger

2026-09-13 subsequent CDC: [Slice06 independently closed](slice06-deno-launch-compatibility/cdc-verification.md).
All six LC criteria and A3-06 are done. Resume Arc01/Slice04's full open set;
A3-02–05 and arc composition remain open. Earlier handoffs below are historical.

2026-09-13: Slice06 is [CC proposed-done](slice06-deno-launch-compatibility/closing-report.md).
A3-06 remains open pending independent correction verification; full source
gates and child attestation do not close arc composition or other findings.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A3-01 | Run-permission correction independently closed | Source/argv/denial tests, build receipt and Slice01 CDC report | serious | D-2609-PERM | done | [Reproduced Slice01 CDC](slice01-run-permissions/cdc-verification.md); [RP-B01](slice01-run-permissions/artifacts/build-receipt.md) | JSON launcher prerequisite lifted; no inherited arc closure |
| A3-02 | Test-runner permission policy reconciled and verified | Slice02 argv/denial evidence and retained corpus/doc checks | serious | B01 test -A observation | open | — | Run fix does not discharge this |
| A3-03 | Accepted guide contradictions corrected and retested | Original claims/tasks against corrected guide trials | correctness-grade | LINT/NPMB and Arc02 | open | — | No blanket rewrite |
| A3-04 | Accepted book/language findings and human revisions integrated | Source commits, failure reproductions, book coordination and operator records | correctness-grade | JSER and Arc02 | open | — | Human acceptance explicit |
| A3-05 | Corrections compose and residual work has real destinations | Arc-scale corrected workflow and discovery/acceptance walk | correctness-grade | Project DoD 6 | open | — | Child closure insufficient |
| A3-06 | Deno 2.9.6 launch compatibility is independently verified without weakening authority or argument safety | Slice06 original reproduction, actual runtime/argv regressions, canonical gates and build receipt | correctness-grade | Arc01/Slice04; D-2609-DARG | done | [Slice06 CDC](slice06-deno-launch-compatibility/cdc-verification.md) | Six criteria reproduced; original five criteria unchanged |
