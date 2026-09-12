# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | Release readiness runbook slice closes | ptr: slice01 closing-report + CDC verification | serious | arc-plan | **CC proposed-done; CDC pending** | [slice01 closing-report](slice01-release-readiness-runbook/closing-report.md), [runbook](slice01-release-readiness-runbook/artifacts/release-runbook.md), [version inventory](slice01-release-readiness-runbook/artifacts/version-surface-inventory.md), [release-note inputs](slice01-release-readiness-runbook/artifacts/release-note-inputs.md) | detailed release sequence drafted; independent CDC still pending |
| A-2 | Version bumps and release notes land | exact source/book/docs version diff plus release-note review | correctness | P-12 | open | [slice02 prompt](slice02-version-bump-release-notes-ci-chore/cc-prompt.md) | scope determined by slice01; includes CI checkout maintenance and publish-dry-run no-bypass route |
| A-3 | Publish dry-runs pass without weakening dirty-tree gates | JSR, npm, and crates dry-run evidence from the exact release tree | correctness | arc01/P-8/P-12 | open | | do not use current `make publish-dry-run` as evidence while it passes `--allow-dirty` |
| A-4 | Publication and tags are completed by the operator-approved route | release transcript and tag evidence | serious | P-12 | open | | Duncan/operator owns manual publication; push release branch/tag explicitly |
| A-5 | Published artifacts are installable and match release expectations | temporary install/artifact verification across published channels | correctness | P-12 | open | | use explicit temporary install directories |
| A-6 | Project02 definition of done is reconciled | project ledger P-8/P-12 and status surfaces close or route remaining gaps | serious | project close | open | | final Project02 gate after post-publish verification |

## Closure

Open. Rows: 6. Done: 0. Deferred: 0. No-op: 0. Pending: 5. CC proposed-done / CDC pending: 1.
