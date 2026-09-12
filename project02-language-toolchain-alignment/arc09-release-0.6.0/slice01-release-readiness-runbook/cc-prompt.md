# CC Prompt - arc09 slice01 Release Readiness Runbook

You are CC in the Lykn language project. Planning lives on branch `planning` in
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. Source/user docs for 0.6.x
live on branch `release/0.6.x` in
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`. The Lykn Book content lives in
`/Users/oubiwann/lab/cnbb/lykn`, and the writers-guide lives in
`/Users/oubiwann/lab/cnbb/lykn-writers-guide`.

Read `AGENTS.md`, then read the installed collaboration-framework
project-management and work-verification close/planning guides before changing
planning. Read Project02 `project-plan.md` and `ledger.md`, arc09
`arc-plan.md` and `ledger.md`, this slice's `slice-plan.md` and `ledger.md`,
and arc16's `closing-report.md` plus
`slice12-edition-close-and-release-gate/cdc-verification.md`.

## Goal

Turn arc09 from capability-depth release intent into an executable 0.6.0
release runbook and detailed slice plan. The output should tell the next CC
exactly where version state lives, what release notes must cover, which dry-run
gates prove publishability, which steps Duncan/operator must perform manually,
and how post-publish artifact/install verification will close P-12.

## Scope

- Check starting statuses for `release/0.6.x`, planning, book, and writers-guide.
- Inventory version surfaces across Rust crates, JS package/project metadata,
  CLI-reported versions if any, release notes, docs, book edition/tag
  references, CI, and publishing scripts.
- Inventory release-note inputs from Project02 closed arcs, discoveries, and
  user-visible behavior changes.
- Draft the release runbook with separate sections for preparation, dry-runs,
  operator publication, tags, and post-publish verification.
- Detail arc09's slice breakdown and ledger from the runbook.
- Route blockers or release chores explicitly. If no blocker exists, say so
  with evidence.
- Open the next arc09 slice prompt according to the resulting sequence.

## Out Of Scope

Do not publish packages, create release tags, or claim public availability.
Avoid version bumps unless you can prove they are only planning/doc corrections
inside this slice; normal version bump implementation belongs in the next
slice. Do not add or rely on publish bypass flags.

## Verification

Minimum expected evidence:

- Version-surface inventory.
- Release-note input inventory.
- Release runbook.
- Updated arc09 plan/ledger/status surfaces.
- Planning `git diff --check`.
- JSON parse checks for touched status files.
- Final `git status --short --branch` for release/0.6.x, planning, book, and
  writers-guide.

If you touch source files, run the release worktree gates required by
`AGENTS.md` and explain why source edits belonged in this slice.

## Closeout

Commit only the explicit files you touched for this slice. Include both
co-author trailers. Report the commit, verification, final repo statuses, and
the next `cc-prompt.md` path relative to the project directory.
