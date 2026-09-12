# arc16 slice10 - Language Surface Chapters Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| L-1 | Required instructions and current language guidance are read before edits | closing report lists lang/book/writers-guide instructions, slice07 inventory, slice08/slice09 close evidence, and source guides used | serious | arc16 process | done | [`closing-report.md`](closing-report.md) §Grounding | preserve planning/source/book split |
| L-2 | Chapter scope is explicit | closing report names every language/compiler chapter touched and maps each to the slice07 failure classes | serious | slice07 inventory | done | [`closing-report.md`](closing-report.md) §Chapter map | broad untracked rewrite avoided |
| L-3 | Kernel-only and non-surface examples are corrected or annotated | focused doctest gate plus diff review show no ordinary surface examples depend on kernel-only forms | correctness | slice07 inventory | done | book commit `6aa379d`; focused gate 39/0 with 9 skipped | overlap examples routed to `D-2609-FOVL` |
| L-4 | Intentional error, placeholder, and non-Lykn examples are correctly dispositioned | examples are skipped/annotated or moved out of executable fences with explicit reason | serious | slice07 inventory | done | book commit `6aa379d`; whole-book gate 425/0 with 22 skipped | compile-error examples use `compile-fail` where supported; LFE retagged |
| L-5 | 0.6.x language surface prose matches shipped behavior | source-guide cross-check covers exports, grouped bind, cond, functions/closures, records/types, destructuring, classes, generators, equality, and diagnostics touched | serious | arc16 capability | done | source guides read; book diff; `D-2609-FOVL` discovery added for overlap parity | no source docs changed |
| L-6 | Focused book gates pass or failures are explicitly dispositioned | `lykn test --docs <touched> --fence lisp` from book repo | serious | book fence gate | done | focused touched-chapter gate: 14 files, 39 blocks, 9 skipped, 39 passed / 0 failed | whole-book `--fence lisp`: 177 files, 425 blocks, 22 skipped, 425 passed / 0 failed |
| L-7 | Repository hygiene is preserved | `git status --short --branch` for planning, release/0.6.x, book, and writers-guide as applicable | serious | AGENTS.md | done | generated book `target/` removed; `_to_delete/` preserved | final statuses recorded in closeout |
| L-8 | Planning surfaces are updated at close | slice ledger/report, arc plan/status, project/status, and next slice reflect final disposition | serious | project-management | done | this closeout set; `D-2609-FOVL`; slice11 opened | no silent drops |

## Closure

CC-closed as of 2026-09-12. Rows: 8. Done: 8. Deferred: 0. No-op: 0. Pending: 0. CDC remains pending.
