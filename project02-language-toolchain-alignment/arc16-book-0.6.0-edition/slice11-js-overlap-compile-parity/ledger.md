# arc16 slice11 - JS Overlap Compile Parity Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| O-1 | `D-2609-FOVL` is reproduced on both paths | CLI compile and JS API probes are recorded | correctness | slice10 bubble-up | open | | distinguish syntax check from compile path |
| O-2 | Correct overlap semantics are confirmed | source guide/design references show whether overlap is compile-time or runtime | serious | language design | open | | do not normalize implementation divergence in prose |
| O-3 | JS API/compiler behavior is fixed or explicitly disposed | regression test or accepted deferral evidence | correctness | `D-2609-FOVL` | open | | likely source change in release/0.6.x |
| O-4 | Book overlap examples are updated after disposition | focused doctest for `src/part2/chapter8/4-overlap.md --fence lisp` | serious | slice10 skip caveat | open | | remove skip if fixed |
| O-5 | Required source/book gates pass | relevant source tests plus focused/whole-book docs gates as applicable | serious | arc16 verification | open | | record exact counts |
| O-6 | Repository hygiene is preserved | statuses for release/0.6.x, planning, book, and writers-guide | serious | AGENTS.md | open | | preserve `_to_delete/`; remove generated target |
| O-7 | Planning surfaces and discovery row are updated | ledger/report, `D-2609-FOVL`, arc/project/status, and next slice state | serious | project-management | open | | no silent drops |

## Closure

Open as of 2026-09-12. Rows: 7. Done: 0. Deferred: 0. No-op: 0. Pending: 7.
