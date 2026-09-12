# arc16 slice10 - Language Surface Chapters Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| L-1 | Required instructions and current language guidance are read before edits | closing report lists lang/book/writers-guide instructions, slice07 inventory, slice08/slice09 close evidence, and source guides used | serious | arc16 process | open | | preserve planning/source/book split |
| L-2 | Chapter scope is explicit | closing report names every language/compiler chapter touched and maps each to the slice07 failure classes | serious | slice07 inventory | open | | avoid broad untracked rewrite |
| L-3 | Kernel-only and non-surface examples are corrected or annotated | focused doctest gate plus diff review show no ordinary surface examples depend on kernel-only forms | correctness | slice07 inventory | open | | route real compiler defects instead of prose workarounds |
| L-4 | Intentional error, placeholder, and non-Lykn examples are correctly dispositioned | examples are skipped/annotated or moved out of executable fences with explicit reason | serious | slice07 inventory | open | | do not let false failures mask real ones |
| L-5 | 0.6.x language surface prose matches shipped behavior | source-guide cross-check covers exports, grouped bind, cond, functions/closures, records/types, destructuring, classes, generators, equality, and diagnostics touched | serious | arc16 capability | open | | update only forms actually in touched chapters |
| L-6 | Focused book gates pass or failures are explicitly dispositioned | `lykn test --docs <touched> --fence lisp` from book repo | serious | book fence gate | open | | record generated/skipped/passed/failed counts |
| L-7 | Repository hygiene is preserved | `git status --short --branch` for planning, release/0.6.x, book, and writers-guide as applicable | serious | AGENTS.md | open | | preserve book `_to_delete/`; remove generated `target/` unless intentionally tracked |
| L-8 | Planning surfaces are updated at close | slice ledger/report, arc plan/status, project/status, and next slice reflect final disposition | serious | project-management | open | | no silent drops |

## Closure

Open as of 2026-09-12. Rows: 8. Done: 0. Deferred: 0. No-op: 0. Pending: 8.
