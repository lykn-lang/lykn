# CC Prompt - arc16 slice08 JS `fn` Return Parity

You are CC in the Lykn lang project. CDC/CC closed slice07 by routing a live
book-gate compiler mismatch to this slice:

- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice08-js-fn-return-parity/slice-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice08-js-fn-return-parity/ledger.md`

## Mission

Fix or explicitly dispose `D-2609-FNRT`: the book doctest path through the JS
compiler rejects a `func` with `:returns :function` whose body ends with `fn`,
while the Rust CLI accepts and compiles the same shape.

Start from the `release/0.6.x` worktree:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/`

Planning artifacts live in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/`

Do not create planning under source `docs/`.

## Required Reading

Read before edits and list roles in the closing report:

- `/Users/oubiwann/.codex/skills/collaboration-framework/SKILL.md`
- `/Users/oubiwann/.codex/skills/project-management/SKILL.md`
- `/Users/oubiwann/.codex/skills/project-management/guides/README.md`
- `/Users/oubiwann/.codex/skills/work-verification/SKILL.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/assets/ai/SKILL.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/backlog/discoveries.md` row `D-2609-FNRT`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/artifacts/current-book-drift-inventory-2026-09.md`
- relevant `packages/lang/` JS compiler/classifier/expander files
- relevant Rust compiler/check path if needed for source-of-truth comparison

If you edit JavaScript or Rust, load the local language guidance first.

## Current-State Checks First

Record before edits:

```sh
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning status --short --branch
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x status --short --branch
git -C /Users/oubiwann/lab/cnbb/lykn status --short --branch
```

Preserve unrelated changes and the book repo's pre-existing `_to_delete/`.

## Verification

Run the gates named in `slice-plan.md`. If the implementation changes the
release binary, rebuild/copy the binary before the book subset probe.

## Close

Update the ledger, add `closing-report.md`, update `D-2609-FNRT` and arc/status
surfaces, then commit scoped changes with both trailers.
