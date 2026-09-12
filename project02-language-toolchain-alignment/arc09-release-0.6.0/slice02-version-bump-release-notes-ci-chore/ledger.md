# arc09 slice02 — Version Bump, Release Notes, and CI Chore Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| V-1 | Source branch and cleanliness are confirmed before edits | status/branch evidence recorded | serious | release runbook | open | | source branch is `release/0.6.x`; preserve unrelated planning/book changes |
| V-2 | Rust version surfaces are updated to 0.6.0 | Cargo manifests/lockfile diff and rebuilt package metadata | correctness | version inventory | open | | workspace package and local dependency versions |
| V-3 | JS package versions are updated to 0.6.0 | three package `deno.json` diffs and dist metadata spot check | correctness | version inventory | open | | `@lykn/browser`, `@lykn/lang`, `@lykn/testing` |
| V-4 | CLI reports the release version | `./bin/lykn --version` after rebuild | correctness | release runbook | open | | expected `lykn 0.6.0` |
| V-5 | Release notes are drafted from curated inputs | release-note artifact/file diff reviewed | serious | P-12 | open | | separate user-facing changes from planning mechanics |
| V-6 | Release-prep chores are handled or explicitly routed | CI checkout maintenance and publish-dry-run no-bypass decision recorded | serious | slice01 findings | open | | no silent bypass flags |
| V-7 | Source validation passes | `make check` receipt | correctness | release gate | open | | source-focused verification before dry-runs |
| V-8 | Source changes are committed with required trailers | source commit hash recorded | serious | AGENTS governance | open | | no publish/tag/push in this slice |
| V-9 | Arc09 planning/status and next slice prompt are updated | arc09 ledger/status + slice03 prompt | serious | project-management | open | | prepare dry-run slice |

## Closure

Open. Rows: 9. Done: 0. Deferred: 0. No-op: 0. Pending: 9.
