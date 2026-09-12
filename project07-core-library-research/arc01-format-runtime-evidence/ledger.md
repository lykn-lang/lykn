# Arc01 ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-01 | Slice01 baseline and protocol are independently verified and closed | Inspect Slice01 ledger, closing report, and CDC reproduction of baseline/claim inventory | correctness-grade | Arc roadmap | open | [CC attestation](slice01-baseline-and-protocol/closing-report.md) | Slice01 proposed-done; CDC not performed |
| A-02 | JSON behavior is independently verified and closed | Inspect Slice02 closure and replay native JSON plus extension/failure cases through Lykn | correctness-grade | Project JSON scope | open | — | Detailed slice opens after Slice01 |
| A-03 | YAML behavior and fidelity are independently verified and closed | Inspect Slice03 closure and compare both semantic values and source bytes on its fixtures | correctness-grade | Project YAML scope | open | — | Preservation is a separate claim from parsing |
| A-04 | Runtime/dependency boundary is independently verified and closed | Inspect Slice04 closure, dependency graph/provenance, permission and offline evidence | serious | Operator no-Node direction | open | — | Registry location is not provenance proof |
| A-05 | The slices compose into an actionable cross-format capability matrix | Independently replay one JSON and one YAML read/edit/write workflow and reconcile with the matrix and limitations | correctness-grade | Arc capability | open | — | Do not infer composition from child status |
| A-06 | Lykn/guide/book/human-review findings and unresolved decisions reach the next work | Walk fixture observations and discovery IDs into Arc02/Arc03 scope and project Version History | correctness-grade | Operator explicit authoring goals | open | [Slice01 findings](slice01-baseline-and-protocol/artifacts/findings.md) | PERM/YNOD prerequisites and LINT/NPMB/JSER findings retained; later routing/closure pending |
