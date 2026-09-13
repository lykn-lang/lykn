# arc09 slice04 — Operator Publication and Tags Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| O-1 | Final pre-publication status is clean and at the approved commit | status/branch/HEAD evidence | serious | release runbook | open | | expected source commit `50608c443c452107b138cc30deda4a09ab5c7642` |
| O-2 | Operator approves the concrete publication packet | explicit approval recorded | serious | operator boundary | open | | approval must name publication/tag/push scope |
| O-3 | JSR packages are published | publication transcript | serious | P-12 | open | | `@lykn/lang`, `@lykn/testing`, `@lykn/browser` |
| O-4 | npm packages are published | publication transcript | serious | P-12 | open | | `@lykn/lang`, `@lykn/testing`, `@lykn/browser` |
| O-5 | crates are published in dependency order | publication transcript per crate | serious | P-12 | open | | `lykn-lang` → `lykn-cli` → `lykn` |
| O-6 | Source release tag `0.6.0` is created and verified | `git tag --list`, tag object/annotation evidence | serious | release runbook | open | | after successful publication |
| O-7 | Release branch and tag are pushed explicitly to intended remotes | remote push transcript | serious | release runbook | open | | do not rely on ambiguous push evidence |
| O-8 | Book release tag/publication boundary is handled | explicit operator decision and transcript if performed | serious | arc16/release runbook | open | | book repo currently separate |
| O-9 | Publication side effects are recorded and slice05 is opened | close packet and postpublish prompt | serious | project-management | open | | slice05 owns install verification |

## Closure

Open. Rows: 9. Done: 0. Deferred: 0. No-op: 0. Pending: 9.
