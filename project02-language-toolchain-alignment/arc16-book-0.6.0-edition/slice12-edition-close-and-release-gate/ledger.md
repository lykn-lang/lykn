# arc16 slice12 - Edition Close and Release Gate Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| E-1 | Starting heads and instructions are current | repo statuses and relevant AGENTS/instructions are checked | serious | AGENTS.md | open | | preserve split planning/source/book ownership |
| E-2 | Book HTML build passes | book build command output recorded | serious | arc16 close | open | | record warnings, especially known mdbook-mermaid warning if present |
| E-3 | Book EPUB build is attempted or explicitly unavailable | EPUB command output or tooling absence recorded | serious | arc16 close | open | | do not invent an EPUB gate if the repo lacks one |
| E-4 | Whole-book executable examples pass | `lykn test --docs src --fence lisp` and any required additional fence gates | correctness | slice06/slice11 | open | | remove generated `target/` after runs |
| E-5 | Links, paths, and edition metadata are swept | command evidence and manual notes | serious | kickoff inventory | open | | route defects instead of hiding them in prose |
| E-6 | Final voice/stale-caveat review is completed | changed files or review notes cite findings | serious | book edition close | open | | no broad rewrites unless needed for correctness |
| E-7 | Any new findings are routed | Discovery Register rows and next-slice/deferral homes | correctness | arc16 method | open | | do not close arc16 with unnamed blockers |
| E-8 | arc16/project/arc09 status is updated | arc/project/status JSON/HTML and ledgers | serious | project-management | open | | close arc16 only if gates justify it |
| E-9 | Repository hygiene is preserved | final statuses for release/0.6.x, planning, book, writers-guide | serious | worktree governance | open | | preserve unrelated work such as book `_to_delete/` |

## Closure

Open as of 2026-09-12. Rows: 9. Done: 0. Deferred: 0. No-op: 0. Pending: 9.
