# CC Prompt - arc16 slice11 JS overlap compile parity

You are working on lykn project02, arc16, slice11. The planning home is `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice11-js-overlap-compile-parity/`. The source/user-docs home for 0.6.x is `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`. The book content is in `/Users/oubiwann/lab/cnbb/lykn`. The writers-guide is in `/Users/oubiwann/lab/cnbb/lykn-writers-guide`.

Read and follow the active `AGENTS.md` instructions in the lang, book, and writers-guide repos. Preserve the planning/source/book split. Do not merge planning into source. Preserve the book repo's pre-existing untracked `_to_delete/` directory.

## Required reading

Before editing, read:

- `../arc-plan.md`;
- this slice's `slice-plan.md` and `ledger.md`;
- `../slice10-language-surface-chapters/closing-report.md`;
- `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/backlog/discoveries.md` row `D-2609-FOVL`;
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`;
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`;
- source guides/design material needed to confirm multi-clause `func` overlap semantics.

## Goal

Fix or explicitly dispose `D-2609-FOVL`: the JS API path used by book doctests does not compile-reject overlapping multi-clause `func` definitions, while the CLI compile path rejects the same source. The slice10 book overlap examples are skipped pending this fix.

## Starting probe

slice10 observed:

- `lykn compile /private/tmp/overlap1.lykn` rejects with `clauses 0 and 1 overlap (same arity 1, compatible types)`.
- JS API `lykn(src)` under release `project.json` returns JavaScript containing duplicate compatible clause checks and a fall-through `TypeError` instead of throwing at compile time.

Reproduce this before changing behavior.

## Out of scope

Do not redesign multi-clause dispatch. Do not redo slice10 language chapter rewrites. Do not run final edition close; that belongs to slice12 after this blocker is fixed or explicitly disposed.

## Verification

If source changes, run focused source regression tests for the JS compiler overlap behavior plus the relevant source gates. Update the book overlap chapter so the examples can use `lisp,compile-fail` when the doctest path proves the compile-time failure, then run:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter8/4-overlap.md --fence lisp
```

Run the whole-book `--fence lisp` gate if the book changes. Remove generated book `target/` unless intentionally tracked.

## Closeout

At close, update this slice ledger and create `closing-report.md`; update `D-2609-FOVL`, the arc plan, project/status surfaces, and next-slice state; run planning whitespace/JSON checks; then commit with the required co-author trailers.
