# arc09 slice03 — Publish Dry-runs and Package Audit Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| D-1 | Exact release tree is identified and clean before dry-runs | `git status --short --branch`; `git rev-parse HEAD` | serious | release runbook | open | | expected source commit from slice02 |
| D-2 | Canonical source gate passes on the exact release tree | `make check` receipt | correctness | release gate | open | | rerun even though slice02 passed |
| D-3 | Dist package contents and metadata are audited | `./bin/lykn dist`; generated file list and metadata spot checks | correctness | P-12 | open | | `@lykn/browser`, `@lykn/lang`, `@lykn/testing` |
| D-4 | JSR dry-run passes without bypass flags | `./bin/lykn publish --jsr --dry-run` receipt | correctness | release runbook | open | | no real publish |
| D-5 | npm dry-run passes without bypass flags | `./bin/lykn publish --npm --dry-run` receipt | correctness | release runbook | open | | no real publish |
| D-6 | crates.io dry-runs pass without bypass flags | `make publish-dry-run` or direct `cargo publish -p <crate> --dry-run` receipts | correctness | release runbook | open | | cover `lykn-lang`, `lykn-cli`, `lykn` |
| D-7 | Dry-run evidence is captured in slice artifacts | artifact manifest with command outputs/receipts | serious | work-verification | open | | enough for operator publication decision |
| D-8 | No publication/tag/push side effects occur | final status plus no tag/publish transcript | serious | operator boundary | open | | publication is slice04 |
| D-9 | Arc09 planning/status and next operator prompt are updated | slice03 close, arc ledger/status, slice04 prompt | serious | project-management | open | | prepare publication/tag boundary |

## Closure

Open. Rows: 9. Done: 0. Deferred: 0. No-op: 0. Pending: 9.
