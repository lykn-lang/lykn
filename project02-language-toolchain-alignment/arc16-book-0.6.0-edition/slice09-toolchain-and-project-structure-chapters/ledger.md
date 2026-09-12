# arc16 slice09 - Toolchain and Project-Structure Chapters Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| T-1 | Required instructions and current source/book guidance are read before edits | closing report lists lang/book/writers-guide `AGENTS.md`, relevant source guides, slice07 inventory entries, and touched book chapters | serious | arc16 process | open | | preserve planning/source/book split |
| T-2 | Chapter scope is explicit | closing report names every book chapter touched and maps each to the slice09 drift categories | serious | slice07 inventory | open | | avoid broad untracked rewrite |
| T-3 | Testing macro failures are fixed or routed | rerun focused book fence gate or register permanent discoveries for unresolved failures | correctness | slice07 inventory | open | | four failures were routed to slice09 candidate work |
| T-4 | Toolchain/project-structure prose matches current 0.6.x behavior | diff plus source-guide cross-check show current `lykn test`, doctest, build/dist/publish, source-ownership, Deno/no-Node, and Makefile guidance | serious | arc16 capability | open | | no stale Biome/ESLint/raw-Deno claims left in touched scope |
| T-5 | Focused book gates pass or failures are explicitly dispositioned | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched> --fence lisp` from book repo | serious | book fence gate | open | | include generated/passing/failing counts |
| T-6 | Repository hygiene is preserved | `git status --short --branch` for planning, release/0.6.x, book, and writers-guide as applicable | serious | AGENTS.md | open | | preserve book `_to_delete/`; remove generated `target/` unless intentionally tracked |
| T-7 | Planning surfaces are updated at close | slice ledger/report, arc plan/status, project/status, and next slice reflect final disposition | serious | project-management | open | | no silent drops |

## Closure

Open as of 2026-09-12. Rows: 7. Done: 0. Deferred: 0. No-op: 0. Pending: 7.
