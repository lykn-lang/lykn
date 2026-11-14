# Qualified ADTs arc ledger

2026-11-13 v2.0: original statuses are unchanged. Arc05 owns general binding
work; Arc04 S08–S13 own the remaining local ADT core; Arc06 owns former
downstream S04–S07. These are recorded roadmaps, not opened source slices.
Implementation remains paused. Original QA-04–06 continue to verify the whole
promised outcome using the named Arc06 deliveries, not pointers alone.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| QA-01 | Constructor, pattern, identity and emission contracts are settled | S01 contract and protocol review with explicit decisions and limits | correctness-grade | Operator, NE-T02 | done | Independent [S01 final design review](slice01-contract-and-emission-design/cdc-verification.md#iteration04-final-design-acceptance--2026-11-11) accepts candidate 4d4aef29's contract/proposal only. No software, experiment or production-layout acceptance. |
| QA-02 | Nested and zero-field constructor behavior agrees across compilers | Original NPAT/ZVAR witnesses and discriminating regressions | correctness-grade | D-2611-NPAT/ZVAR | done | [S02 independent verification](slice02-existing-adt-correctness/cdc-verification.md) reproduces correctness at task 0829e892 across native/canonical/embedded paths and accepts final metadata at b61c9968. All five PC rows done; no release or qualified-feature claim. |
| QA-03 | Qualified source and public runtime entry points work coherently | Native/public/CLI/module consumers, guards, diagnostics and declarations | correctness-grade | Operator | open | [Local core roadmap S08–S13](arc-plan.md), [binding prerequisites](../arc05-binding-semantics-and-hygienic-emission/ledger.md) and [module LI-01](../arc06-adt-modules-and-library-integration/ledger.md). Accepted B2-LX/B2-UNIT and other S03 checkpoints remain bounded inputs; no qualified feature acceptance. |
| QA-04 | Build, package, size and JSON research consumers compose | Actual selective/escaping namespace builds, API checks and repinned original decoder comparisons | correctness-grade | Micro-deployments, Project07 | open | [Arc06 LI-01/02/03/06](../arc06-adt-modules-and-library-integration/ledger.md), former S04/S05 ownership; original experiment checkpoint retained. |
| QA-05 | Full API/documentation impact is accounted for | S06 changes/consumers/reference audit and explicit remaining owners | correctness-grade | Operator post-work audit request | open | Former S06 now [Arc06 LI-04](../arc06-adt-modules-and-library-integration/ledger.md); coordinate Arc01 CI-07. |
| QA-06 | Required documentation and human source review are integrated | Conditional S07 proof and actual operator dispositions | serious | Operator, Project07 AE-05 | open | Former S07 now [Arc06 LI-05](../arc06-adt-modules-and-library-integration/ledger.md); separate book and actual human acceptance remain. |
