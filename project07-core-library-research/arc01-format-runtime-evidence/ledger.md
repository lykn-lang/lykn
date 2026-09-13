# Arc01 ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A-01 | Slice01 baseline and protocol are independently verified and closed | Inspect Slice01 ledger, closing report, and CDC reproduction of baseline/claim inventory | correctness-grade | Arc roadmap | done | [Reproduced CDC verification](slice01-baseline-and-protocol/cdc-verification.md) | Seven criteria closed; historical binary provenance remains explicitly unknown |
| A-02 | JSON behavior is independently verified and closed | Inspect Slice02 closure and replay native JSON plus extension/failure cases through Lykn | correctness-grade | Project JSON scope | done | [Reproduced Slice02 CDC](slice02-json-behavior/cdc-verification.md) | All 161 variants/354 attempts replayed; no library adoption claim |
| A-03 | YAML behavior and fidelity are independently verified and closed | Inspect Slice03 preparation and Slices05–07 closure; compare both semantic values and source bytes on the retained Y-01–16 fixtures | correctness-grade | Project YAML scope | open | [Preparation plan](slice03-yaml-preflight/slice-plan.md) | Former Slice03 split explicitly; Y-14 awaits Slice04 compatible-route decision |
| A-04 | Runtime/dependency boundary is independently verified and closed | Inspect Slice04 closure, dependency graph/provenance, permission and offline evidence | serious | Operator no-Node direction | open | — | Registry location is not provenance proof |
| A-05 | The slices compose into an actionable cross-format capability matrix | Independently replay one JSON and one YAML read/edit/write workflow and reconcile with the matrix and limitations | correctness-grade | Arc capability | open | — | Do not infer composition from child status |
| A-06 | Lykn/guide/book/human-review findings and unresolved decisions reach the next work | Walk fixture observations and discovery IDs into Arc02/Arc03 scope and project Version History | correctness-grade | Operator explicit authoring goals | open | [Slice01 findings](slice01-baseline-and-protocol/artifacts/findings.md) | PERM/YNOD prerequisites and LINT/NPMB/JSER findings retained; later routing/closure pending |

2026-09-12 Slice02 bubble-up: D-2609-NZRO/JSCF/UNUS and J-09 evidence for
existing JSER survive in the [findings](slice02-json-behavior/artifacts/findings.md).
A-02 is now CDC closed after full replay; A-03 through A-06 remain open.
YAML preparation/value/resource/document owners are explicit in arc v1.5;
all Y-01–16 requirements survive. JSON closure does not close arc composition.

2026-09-12: Slice03 [CC preparation handoff](slice03-yaml-preflight/closing-report.md)
freezes 349 YAML variants and records 38 sentinel/control attempts plus three
supervisor controls. A-03 remains open pending CDC and full Slices05–07;
A-04–06 retain their policy/composition/authoring obligations.
