# arc16 slice09 - Toolchain and Project-Structure Chapters Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| T-1 | Required instructions and current source/book guidance are read before edits | closing report lists lang/book/writers-guide `AGENTS.md`, relevant source guides, slice07 inventory entries, and touched book chapters | serious | arc16 process | done | [`closing-report.md`](closing-report.md) §Grounding | preserve planning/source/book split |
| T-2 | Chapter scope is explicit | closing report names every book chapter touched and maps each to the slice09 drift categories | serious | slice07 inventory | done | [`closing-report.md`](closing-report.md) §Chapter map | broad untracked rewrite avoided |
| T-3 | Testing macro failures are fixed or routed | rerun focused book fence gate or register permanent discoveries for unresolved failures | correctness | slice07 inventory | done | focused `--fence lisp` gate: 5 passed / 0 failed, 13 skipped; book commit `03b3818` | macro-context examples annotated as skipped with prose rationale |
| T-4 | Toolchain/project-structure prose matches current 0.6.x behavior | diff plus source-guide cross-check show current `lykn test`, doctest, build/dist/publish, source-ownership, Deno/no-Node, and Makefile guidance | serious | arc16 capability | done | book commit `03b3818`; source guides cross-checked in close | stale Biome/ESLint/raw-Deno claims removed from touched scope |
| T-5 | Focused book gates pass or failures are explicitly dispositioned | `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched> --fence lisp` from book repo | serious | book fence gate | done | generated 7 test files from 5 runnable blocks; 5 passed / 0 failed; 13 skipped | touched shell/prose-only files had no Lykn blocks |
| T-6 | Repository hygiene is preserved | `git status --short --branch` for planning, release/0.6.x, book, and writers-guide as applicable | serious | AGENTS.md | done | book: `## main` + pre-existing `?? _to_delete/`; release/writers-guide clean before closeout | generated book doctest `target/` removed |
| T-7 | Planning surfaces are updated at close | slice ledger/report, arc plan/status, project/status, and next slice reflect final disposition | serious | project-management | done | this closeout set; slice10 opened; [`cdc-verification.md`](cdc-verification.md) | no silent drops |

## Closure

Closed / CDC-verified as of 2026-09-12. Rows: 7. Done: 7. Deferred: 0. No-op: 0. Pending: 0.
