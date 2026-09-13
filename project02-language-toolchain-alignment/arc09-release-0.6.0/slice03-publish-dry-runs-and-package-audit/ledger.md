# arc09 slice03 — Publish Dry-runs and Package Audit Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| D-1 | Exact release tree is identified and clean before dry-runs | `git status --short --branch`; `git rev-parse HEAD` | serious | release runbook | **done / CC proposed-done** | [receipt](artifacts/dry-run-and-package-audit-receipt.md#entry-status) | began at `65ff40f`; final evidence is from repaired source commit `50608c4` |
| D-2 | Canonical source gate passes on the exact release tree | `make check` receipt | correctness | release gate | **done / CC proposed-done** | [make-check.log](artifacts/make-check.log) | passed after required filesystem escalation for npm home log/cache access |
| D-3 | Dist package contents and metadata are audited | `./bin/lykn dist`; generated file list and metadata spot checks | correctness | P-12 | **done / CC proposed-done** | [dist-audit.log](artifacts/dist-audit.log), [receipt](artifacts/dry-run-and-package-audit-receipt.md#package-audit-summary) | `@lykn/browser`, `@lykn/lang`, `@lykn/testing` all report `0.6.0` |
| D-4 | JSR dry-run passes without bypass flags | `./bin/lykn publish --jsr --dry-run` receipt | correctness | release runbook | **done / CC proposed-done** | [jsr-dry-run.log](artifacts/jsr-dry-run.log) | passed with `import.meta.resolve` warning for `@lykn/lang` |
| D-5 | npm dry-run passes without bypass flags | `./bin/lykn publish --npm --dry-run` receipt | correctness | release runbook | **done / CC proposed-done** | [npm-dry-run.log](artifacts/npm-dry-run.log) | all three npm packages simulated successfully |
| D-6 | crates.io dry-runs pass without bypass flags | `make publish-dry-run` or direct `cargo publish -p <crate> --dry-run` receipts | correctness | release runbook | **done / qualified** | [crates-dry-run.log](artifacts/crates-dry-run.log), [cargo-publish-lykn-lang.log](artifacts/cargo-publish-lykn-lang.log), [cargo-publish-lykn-cli.log](artifacts/cargo-publish-lykn-cli.log), [cargo-publish-lykn.log](artifacts/cargo-publish-lykn.log) | `lykn-lang` passes; `lykn-cli`/`lykn` are gated by crates.io dependency order until internal 0.6.0 crates are published |
| D-7 | Dry-run evidence is captured in slice artifacts | artifact manifest with command outputs/receipts | serious | work-verification | **done / CC proposed-done** | [artifacts](artifacts), [receipt](artifacts/dry-run-and-package-audit-receipt.md) | includes initial failure and rerun receipts |
| D-8 | No publication/tag/push side effects occur | final status plus no tag/publish transcript | serious | operator boundary | **done / CC proposed-done** | [closing report](closing-report.md#bubble-up-to-the-arc) | publication is slice04 |
| D-9 | Arc09 planning/status and next operator prompt are updated | slice03 close, arc ledger/status, slice04 prompt | serious | project-management | **done / CC proposed-done** | [closing report](closing-report.md), [slice04 prompt](../slice04-operator-publication-and-tags/cc-prompt.md) | prepare publication/tag boundary |

## Closure

Closed / CC proposed-done, qualified crates sequencing. Rows: 9. Done / CC proposed-done: 8. Done / qualified: 1. Deferred: 0. No-op: 0. Pending: 0.
