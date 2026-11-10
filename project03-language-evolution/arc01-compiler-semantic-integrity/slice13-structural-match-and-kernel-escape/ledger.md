# Structural match and nested escape ledger

Old `28ed061d` actual native 19/22 and the expected private unknown
red, with tagged-call preservation green. Public 17/20 fixture
steps and all five independent negatives passed. Expected F1/F3
were red, alongside F2 duplicate macro state.
[Refinement 02](cc-prompt-iteration02.md) preserves the baseline
and isolates only the repeated public fixture.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MK-01 | Public reserved-name walk reads genuine match structure and retains true diagnostics | Exact original F1, pattern/guard/body and diagnostic-order negatives | correctness-grade | NE-C16/DD61 | open | artifacts/fixtures.md | Canonical and embedded parity |
| MK-02 | Public bound match stays ordinary with real executable operands | F3 outer binding and parameter scope, complete runtime modules | correctness-grade | DD60 D1 | open | cc-prompt.md | No new tag policy |
| MK-03 | Native nested kernel escape retains direct form and child roles | Exact original F2, F4 ordinary/overlapping/computed/spread and assignment, actual runtime | correctness-grade | NE-C17/DD58 | open | artifacts/fixtures.md | No namespace rewrite |
| MK-04 | Unknown escape fails checked classification and tagged call bypass remains | Exact diagnostics and file effects, direct parsed span/tag controls | correctness-grade | DD58/61 | open | cc-prompt.md | Keep check versus compile boundary |
| MK-05 | Source and evidence independently accepted | Exact delta, focused/native/public/full Make/cites, fresh embedded bytes and independent replay | correctness-grade | AGENTS/Arc01 | open | cc-prompt.md | Task only |
