# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | Release readiness runbook slice closes | ptr: slice01 closing-report + CDC verification | serious | arc-plan | **done / CDC-verified** | [slice01 closing-report](slice01-release-readiness-runbook/closing-report.md), [CDC verification](slice01-release-readiness-runbook/cdc-verification.md), [runbook](slice01-release-readiness-runbook/artifacts/release-runbook.md), [version inventory](slice01-release-readiness-runbook/artifacts/version-surface-inventory.md), [release-note inputs](slice01-release-readiness-runbook/artifacts/release-note-inputs.md) | detailed release sequence drafted and verified; slice05 active |
| A-2 | Version bumps and release notes land | exact source/book/docs version diff plus release-note review | correctness | P-12 | **done / CDC-verified** | [slice02 closing-report](slice02-version-bump-release-notes-ci-chore/closing-report.md), [CDC verification](slice02-version-bump-release-notes-ci-chore/cdc-verification.md), source commit `65ff40f` | 0.6.0 versions/release notes/checkouts/no-bypass dry-run helper prepared and independently verified |
| A-3 | Publish dry-runs pass without weakening dirty-tree gates | JSR, npm, and crates dry-run evidence from the exact release tree | correctness | arc01/P-8/P-12 | **done / qualified / CDC-verified** | [slice03 closing report](slice03-publish-dry-runs-and-package-audit/closing-report.md), [CDC verification](slice03-publish-dry-runs-and-package-audit/cdc-verification.md), [dry-run receipt](slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md) | source commit `50608c4`; JSR/npm pass; `lykn-lang` crates dry-run passes; `lykn-cli`/`lykn` are gated by crates.io dependency sequencing until internal 0.6.0 crates publish |
| A-4 | Publication and tags are completed by the operator-approved route | release transcript and tag evidence | serious | P-12 | open | [slice04 closing report](slice04-operator-publication-and-tags/closing-report.md), [slice05 prompt](slice05-release-candidate-uat-feedback/cc-prompt.md) | operator deferred publication until release-candidate UAT projects can ship; publication resumes after UAT |
| A-5 | Published artifacts are installable and match release expectations | temporary install/artifact verification across published channels | correctness | P-12 | open | | use explicit temporary install directories |
| A-6 | Project02 definition of done is reconciled | project ledger P-8/P-12 and status surfaces close or route remaining gaps | serious | project close | open | | final Project02 gate after post-publish verification |

## Closure

Open. Rows: 6. Done / CDC-verified: 2. Done / qualified / CDC-verified: 1. Deferred: 0. No-op: 0. Pending: 3.
