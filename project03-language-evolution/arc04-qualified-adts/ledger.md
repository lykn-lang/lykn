# Qualified ADTs arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| QA-01 | Constructor, pattern, identity and emission contracts are settled | S01 contract and protocol review with explicit decisions and limits | correctness-grade | Operator, NE-T02 | done | Independent [S01 final design review](slice01-contract-and-emission-design/cdc-verification.md#iteration04-final-design-acceptance--2026-11-11) accepts candidate 4d4aef29's contract/proposal only. No software, experiment or production-layout acceptance. |
| QA-02 | Nested and zero-field constructor behavior agrees across compilers | Original NPAT/ZVAR witnesses and discriminating regressions | correctness-grade | D-2611-NPAT/ZVAR | open | [S02 software verification](slice02-existing-adt-correctness/cdc-verification.md#corrected-candidate-independent-source-and-runtime-verification--2026-11-11) reproduces correctness at task 0829e892 across native/canonical/embedded paths. Final S02 documentary closure pending; no release or qualified-feature claim. |
| QA-03 | Qualified source and public runtime entry points work coherently | Native/public/CLI/module consumers, guards, diagnostics and declarations | correctness-grade | Operator | open | — |
| QA-04 | Build, package, size and JSON research consumers compose | Actual selective/escaping namespace builds, API checks and repinned original decoder comparisons | correctness-grade | Micro-deployments, Project07 | open | — |
| QA-05 | Full API/documentation impact is accounted for | S06 changes/consumers/reference audit and explicit remaining owners | correctness-grade | Operator post-work audit request | open | — |
| QA-06 | Required documentation and human source review are integrated | Conditional S07 proof and actual operator dispositions | serious | Operator, Project07 AE-05 | open | — |
