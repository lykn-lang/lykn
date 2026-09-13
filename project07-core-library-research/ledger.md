# Project07 ledger

All rows are open at project opening. Evidence must be independently
reproduced at the scale claimed. CC attestation is proposed-done only.

2026-09-12: Arc01/Slice01 is [CDC closed](arc01-format-runtime-evidence/slice01-baseline-and-protocol/cdc-verification.md),
with independently reproduced baseline/protocol evidence. JSON behavior now has
[independent CDC closure](arc01-format-runtime-evidence/slice02-json-behavior/cdc-verification.md)
after full replay. Arc03/Slice01 is now [CDC closed](arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md)
for the run-permission correction; Arc01/Slice02 completed its preflights and
closed all 17 JSON families at reproduced strength. YAML preparation is CDC closed;
values/resources/documents have explicit later owners with every Y ID retained.
PERM is repaired on release/0.6.x; YNOD and guide/book
corrections from the [findings](arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/findings.md)
remain open in the project plan.
All P-01–P-08 criteria remain open; no project-scale outcome is inherited.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P-01 | Arc01 establishes JSON/YAML/Deno capabilities and dependency evidence | Inspect Arc01 child closure and rerun a representative cross-format read/edit/write case against its capability matrix | correctness-grade | Project DoD 1–2 | open | — | Evidence must distinguish documentation from execution |
| P-02 | Arc02 establishes actual Lykn ADT and authoring behavior | Reproduce representative successful and failing Lykn cases and reconcile with the compiler/guide/book baseline | correctness-grade | Project DoD 3 | open | — | Do not infer recursive or parametric type support from desired signatures |
| P-03 | Guide usability and generated code quality are evaluated with attributable evidence | Inspect original tasks, loaded-reference lists, generated code, error attribution, counts/denominators, and comparison controls | correctness-grade | Operator explicit goals; DoD 4 | open | — | Observational findings are not controlled experiments |
| P-04 | Book discrepancies and human code-shape judgments receive explicit dispositions | Reconcile book locators and source samples with recorded operator feedback and follow-up changes | correctness-grade | Operator explicit goals; DoD 5 | open | — | Operator evidence cannot be supplied by an LLM |
| P-05 | Accepted authoring-ecosystem corrections are integrated and verified | Inspect Arc03 closure, source commits, original-failure reproductions, regression evidence, and linked discoveries | correctness-grade | Operator explicit scope; DoD 6 | open | [Arc03/Slice01 attestation](arc03-findings-and-integration/slice01-run-permissions/closing-report.md) | Run correction CDC closed; further corrections and project composition pending |
| P-06 | Research composes into separate JSON and YAML project handoffs | Inspect Arc04 closure and actual project plans containing contract decisions, dependencies, tests, source homes, and ongoing guide/book/human goals | correctness-grade | One project per new library; DoD 7 | open | — | Do not reserve IDs or claim a nonexistent patch checkout |
| P-07 | All findings and residual work survive handoff without silent scope loss | Walk project requirements through arc evidence, discovery IDs, destinations, reasons, and re-entry conditions | correctness-grade | DoD 6–8 | open | — | Child closure alone does not establish composition |
| P-08 | Operator accepts the resulting direction and residual boundaries | Record operator review of synthesis and representative source samples; fresh review checks project composition | serious | DoD 8; human acceptance | open | — | No timeout or silence counts as acceptance |

JSON authoring findings D-2609-NZRO/JSCF/UNUS and J-09 support for JSER
remain in the [slice findings](arc01-format-runtime-evidence/slice02-json-behavior/artifacts/findings.md).
No P criterion changes status from child attestation.

2026-09-12: YAML preparation is [CC proposed-done](arc01-format-runtime-evidence/slice03-yaml-preflight/closing-report.md).
All 16 YAML families remain owned by Slices05/06/07; only bounded sentinels ran.
P-01–08 stay open. Lykn evidence tooling, source-build drift controls and pending
operator review remain explicit; preparation does not close YAML capability.

2026-09-12 CDC: [YAML preflight independently closed](arc01-format-runtime-evidence/slice03-yaml-preflight/cdc-verification.md),
six of six criteria reproduced. Slice05 is open for 259 full value variants;
62 resource/file and 28 document variants retain their later owners. All project
rows remain open, including guide/book evaluation and human acceptance.
