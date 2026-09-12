# arc16 slice11 - JS Overlap Compile Parity Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| O-1 | `D-2609-FOVL` is reproduced on both paths | CLI compile and JS API probes are recorded | correctness | slice10 bubble-up | done | CLI compile rejected `/private/tmp/overlap1.lykn`; pre-fix JS API emitted first-match dispatch code | distinguish syntax check from compile path |
| O-2 | Correct overlap semantics are confirmed | source guide/design references show whether overlap is compile-time or runtime | serious | language design | done | Rust analysis `func_check.rs` and CLI diagnostic define overlap as compile-time error | no prose workaround accepted |
| O-3 | JS API/compiler behavior is fixed or explicitly disposed | regression test or accepted deferral evidence | correctness | `D-2609-FOVL` | done | source commit `2a0cabf`; JS probe now throws `bad: clauses 0 and 1 overlap (same arity 1, compatible types)` | implemented in JS multi-clause `func` path before dispatch emission |
| O-4 | Book overlap examples are updated after disposition | focused doctest for `src/part2/chapter8/4-overlap.md --fence lisp` | serious | slice10 skip caveat | done | book commit `43cfebc`; focused book doctest 4/0, 0 skipped | overlap examples are `lisp,compile-fail` again |
| O-5 | Required source/book gates pass | relevant source tests plus focused/whole-book docs gates as applicable | serious | arc16 verification | done | `deno test --config project.json -A test/forms/language-surface-runway.test.js` 7/0; `make check` passed; focused book doctest 4/0; whole-book `--fence lisp` 428/0 | sandbox-only first `make check` failed on npm log write, rerun escalated passed |
| O-6 | Repository hygiene is preserved | statuses for release/0.6.x, planning, book, and writers-guide | serious | AGENTS.md | done | final status check recorded in closeout; book `target/` removed; `_to_delete/` preserved | source/book/planning commits only staged intended paths |
| O-7 | Planning surfaces and discovery row are updated | ledger/report, `D-2609-FOVL`, arc/project/status, and next slice state | serious | project-management | done | this ledger, closing report, discovery row, arc/project/status updates, and slice12 open set | no silent drops |

## Closure

CC proposed-done as of 2026-09-12. Rows: 7. Done: 7. Deferred: 0. No-op: 0. Pending: 0. CDC verification remains pending.
