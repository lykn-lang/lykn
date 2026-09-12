# arc16 slice07 - Current Book Drift Refresh

> **Status:** Opened 2026-09-12.

## Goal

Refresh the Lykn Book 0.6.0 drift inventory against the current `planning`,
`release/0.6.x`, book, and writers-guide heads before any chapter rewrite
normalizes stale behavior.

This slice consumes the signal exposed by slice06: the book's `lisp` fences are
now reachable, and the first whole-book run produced 27 failing examples. The
job here is not to make the book green by editing prose. The job is to classify
the current drift accurately, correct or route instruction-path drift caused by
the planning migration, and recommend the next executable slice order.

## Scope

In scope:

- Read the current collaboration framework and project-management guidance, the
  lang `AGENTS.md`, this arc plan, slice06 close/CDC evidence, the historical
  book drift inventory, the dogfooding friction log, the Discovery Register's
  Book section, and the sibling book/writers-guide instructions before making
  edits.
- Record current status for the planning worktree, the `release/0.6.x` worktree,
  the book repo, and the writers-guide repo before edits.
- Re-run the current whole-book fence commands from `/Users/oubiwann/lab/cnbb/lykn`
  using `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

- Capture current generated-file, block, pass/fail, and skipped counts.
- For every current failing book example, record the source file, nearby lesson
  context, failure text, likely class, current source of truth, and disposition:
  book/content drift, instruction drift, implementation/tooling defect, already
  fixed by current source, duplicate, or explicit deferral candidate.
- Reconcile the historical May drift inventory against current heads. Treat
  `design/book-drift-inventory-0.6.0.md` as historical input, not as live truth.
- Identify stale instruction-path references caused by the planning migration,
  especially active references that still point at
  `.worktrees/0.6.x/docs/design-v0.6.0/...` instead of
  `.worktrees/planning/project02-language-toolchain-alignment/...`; fix them if
  they are in standing instructions touched by this slice, otherwise route them
  explicitly.
- Update or add Discovery Register rows only when triage proves a language,
  tooling, documentation, or DevX defect that should outlive this slice.
- Produce the refreshed inventory under `artifacts/`, and update arc/project
  planning surfaces plus the consolidated `planning/status/` project and arc
  status files with the open/close state and next-slice recommendation.

Out of scope:

- Rewriting normal book chapters to fix examples.
- Editing around a language/tooling defect in prose instead of routing it.
- Implementing language, compiler, CLI, or doctest changes.
- Reworking the book's table of contents beyond recording current drift and
  recommending a next slice.
- Changing book fence tags from `lisp` to `lykn`.
- Treating the historical May bucket labels as current planning truth without
  revalidation.
- Touching unrelated dirty work in the planning worktree.

## Artifact Home

Durable slice outputs live here:

`project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/artifacts/`

Expected artifact:

- `current-book-drift-inventory-2026-09.md` - refreshed drift inventory,
  including current book-gate failure triage and next-slice recommendations.

## Grounding

Known inputs at open:

- slice06 is closed/CDC-verified.
- The book `--fence lisp` probe previously reached 444 blocks, with 417 passing
  and 27 failing.
- The mixed `--fence lisp --fence lykn` probe previously reached 447 blocks,
  with 420 passing and 27 failing.
- The book repo has a pre-existing untracked `_to_delete/` directory. Preserve
  it.
- The planning home has moved to the orphan `planning` worktree:
  `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/`.
- Source and user/developer docs for 0.6.x live on `release/0.6.x` in
  `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/`.

## Verification Approach

This is a recon and planning slice. Its evidence should be mostly reproduced
commands, file/path sweeps, and row-by-row classification rather than source
implementation tests.

Minimum verification:

- scoped whitespace check for touched files;
- current book `--fence lisp` and mixed-tag runs, with counts;
- targeted sweeps for stale planning paths in active lang/book/writers-guide
  instruction surfaces;
- sibling repo status and symlink checks if sibling instructions are edited;
- `make test-docs` and `make check-cited-paths` in the 0.6.x worktree if lang
  source/user docs or Discovery Register files are edited there.

## Exit Criteria

- A refreshed current drift inventory exists in the slice `artifacts/` home.
- Every current book-fence failure is classified with source path, failure
  evidence, source-of-truth comparison, and disposition.
- Historical May inventory rows are marked as still-open, obsolete, closed,
  routed, duplicate, or deferred against current heads.
- Active planning-path drift in standing instructions is fixed or explicitly
  routed.
- Any implementation/tooling/DevX defects found by triage have Discovery rows
  and a recommended slice/deferral route.
- The arc plan, project plan, README/status dashboard hierarchy, and slice
  ledger reflect that slice07 opened and, at close, what should happen next.
- Normal chapter rewrite work remains blocked until this slice tells us which
  book-facing or implementation slice should come next.
