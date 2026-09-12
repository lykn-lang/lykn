# arc09 slice02 — Version Bump, Release Notes, and CI Chore Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| V-1 | Source branch and cleanliness are confirmed before edits | status/branch evidence recorded | serious | release runbook | **done / CC-attested; CDC pending** | [validation receipt](artifacts/build-and-validation-receipt.md#entry-status) | source branch was `release/0.6.x`; planning/book boundaries preserved |
| V-2 | Rust version surfaces are updated to 0.6.0 | Cargo manifests/lockfile diff and rebuilt package metadata | correctness | version inventory | **done / CC-attested; CDC pending** | `65ff40f`, [validation receipt](artifacts/build-and-validation-receipt.md#version-evidence) | workspace package, local dependency, and lockfile versions updated |
| V-3 | JS package versions are updated to 0.6.0 | three package `deno.json` diffs and dist metadata spot check | correctness | version inventory | **done / CC-attested; CDC pending** | [validation receipt](artifacts/build-and-validation-receipt.md#dist-package-metadata-spot-check) | generated JSR/npm metadata spot check reports 0.6.0 for all packages |
| V-4 | CLI reports the release version | `./bin/lykn --version` after rebuild | correctness | release runbook | **done / CC-attested; CDC pending** | [validation receipt](artifacts/build-and-validation-receipt.md#build-and-cli-evidence) | output: `lykn 0.6.0` |
| V-5 | Release notes are drafted from curated inputs | release-note artifact/file diff reviewed | serious | P-12 | **done / CC-attested; CDC pending** | source `release-notes-0.6.0.md`, [validation receipt](artifacts/build-and-validation-receipt.md#source-commit) | release notes remain draft until publication/tag/post-publish evidence lands |
| V-6 | Release-prep chores are handled or explicitly routed | CI checkout maintenance and publish-dry-run no-bypass decision recorded | serious | slice01 findings | **done / CC-attested; CDC pending** | [validation receipt](artifacts/build-and-validation-receipt.md#ci-and-publish-dry-run-chore-evidence) | checkout v5 applied; `publish-dry-run` no longer injects `--allow-dirty` |
| V-7 | Source validation passes | `make check` receipt | correctness | release gate | **done / CC-attested; CDC pending** | [validation receipt](artifacts/build-and-validation-receipt.md#full-validation) | sandbox-limited run failed; escalated required gate passed |
| V-8 | Source changes are committed with required trailers | source commit hash recorded | serious | AGENTS governance | **done / CC-attested; CDC pending** | `65ff40fbcabbf3edab760947108f4a0d13ed9d99` | no publish/tag/push performed |
| V-9 | Arc09 planning/status and next slice prompt are updated | arc09 ledger/status + slice03 prompt | serious | project-management | **done / CC-attested; CDC pending** | [closing report](closing-report.md), [slice03 prompt](../slice03-publish-dry-runs-and-package-audit/cc-prompt.md) | prepare dry-run slice |

## Closure

CC proposed-done; CDC pending. Rows: 9. Done / CC-attested: 9. Deferred: 0. No-op: 0. Pending: 0.
