# CC Prompt - arc16 slice07 Current Book Drift Refresh

You are CC in the Lykn lang project. CDC has opened arc16 slice07:

- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/slice-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/ledger.md`

## Mission

Refresh the Lykn Book 0.6.0 drift inventory against current heads. Do not start
normal chapter rewrites yet. Use the book fence gate landed in slice06 to get
fresh failure evidence, classify every current failure, reconcile the old May
inventory against reality, and recommend the next executable slice.

The current source worktree is:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/`

It is branch `release/0.6.x`.

The current planning home is:

`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/`

Use planning artifacts from the `planning` worktree. Do not create new planning
under `.worktrees/0.6.x/docs/design-v0.6.0/`; that path is historical after the
planning migration.

## Required Reading

Read these before edits and list them in the closing report with one-line roles:

- `/Users/oubiwann/.codex/skills/collaboration-framework/SKILL.md`
- `/Users/oubiwann/.codex/skills/project-management/SKILL.md`
- `/Users/oubiwann/.codex/skills/project-management/guides/README.md`
- `/Users/oubiwann/.codex/skills/project-management/guides/01-scales-of-work.md`
- `/Users/oubiwann/.codex/skills/project-management/guides/02-canonical-planning-worktree.md`
- `/Users/oubiwann/.codex/skills/project-management/guides/03-planning-top-down.md`
- `/Users/oubiwann/.codex/skills/work-verification/SKILL.md`
- `/Users/oubiwann/.codex/skills/work-verification/guides/01-ledger-discipline.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/AGENTS.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`
- `project02-language-toolchain-alignment/project-plan.md`
- `project02-language-toolchain-alignment/README.md`
- `status/status.json`
- `status/status.html`
- `status/project02-language-toolchain-alignment/status.json`
- `status/project02-language-toolchain-alignment/status.html`
- `status/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/status.json`
- `status/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/status.html`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/ledger.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice06-book-fence-reachability/closing-report.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice06-book-fence-reachability/cdc-verification.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/book-drift-inventory-0.6.0.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/design/dogfooding-friction-log.md`
- `backlog/discoveries.md`, especially the Book section
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/planned-toc.md`

If you end up editing Lykn examples, Lykn tooling, Rust, or Deno/JavaScript,
stop and load the relevant local language guidance first. This slice should
normally avoid implementation and normal chapter rewrites.

## Current-State Checks First

Record these before edits:

```sh
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning status --short --branch
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x status --short --branch
git -C /Users/oubiwann/lab/cnbb/lykn status --short --branch
git -C /Users/oubiwann/lab/cnbb/lykn-writers-guide status --short --branch
```

At slice open, the planning worktree had unrelated project05 hardware edits.
Preserve them. The book repo may still have pre-existing untracked
`_to_delete/`; preserve it.

## Book Fence Evidence

From the book repo root, rerun the current fence gates using the 0.6.x binary:

```sh
cd /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

Expected: the commands may exit non-zero. That is acceptable only if they reach
Deno execution and produce current counts. Record generated files, blocks,
skipped blocks, passed examples, failed examples, and enough failure text to
classify every failure.

## Drift Inventory Artifact

Write the refreshed inventory here:

`project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/artifacts/current-book-drift-inventory-2026-09.md`

The artifact must include:

- repo/commit/status baseline for planning, lang 0.6.x, book, and
  writers-guide;
- exact book fence commands and current counts;
- one row per current failing example with source path, nearby lesson context,
  failure text/class, source-of-truth comparison, and disposition;
- a reconciliation table for the historical May drift rows/buckets, marking
  each as still-open, closed, obsolete, routed, duplicate, deferred, or no-op;
- a targeted stale-path sweep for active instruction surfaces, especially old
  references to `.worktrees/0.6.x/docs/design-v0.6.0/...`;
- recommended next slice order, including any newly inserted implementation or
  instruction cleanup slice if triage proves one is needed before slice08 or
  slice09.

## Editing Rules

Allowed:

- planning artifacts for this slice;
- the refreshed inventory artifact;
- `backlog/discoveries.md` if new or updated durable findings are needed;
- sibling standing instructions if they contain active stale planning paths or
  current-process drift discovered by this recon.

Not allowed:

- broad book chapter rewrites;
- language/compiler/CLI implementation;
- rewriting examples merely to make the gate green before routing the failure;
- migrating book fences from `lisp` to `lykn`;
- touching unrelated planning work, especially existing project05 hardware
  edits.

## Verification

Run and record as applicable:

```sh
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning diff --check -- project02-language-toolchain-alignment/arc16-book-0.6.0-edition project02-language-toolchain-alignment/project-plan.md project02-language-toolchain-alignment/README.md project02-language-toolchain-alignment/BOOTSTRAP.md README.md status backlog/discoveries.md
```

If you edit book or writers-guide instructions, also run in each edited sibling
repo:

```sh
git status --short --branch
git diff --check
git ls-files -s AGENTS.md CLAUDE.md
readlink CLAUDE.md
```

If you edit lang source/user docs or the Discovery Register on the 0.6.x
worktree, run from `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`:

```sh
make test-docs
make check-cited-paths
```

Do not run extra broad source gates unless your edits make them relevant.

## Close

Before committing, update the slice ledger with evidence. Then add
`closing-report.md` with a row-by-row ledger walk, and update arc16/project
planning/status surfaces with the outcome and next slice recommendation.

In Expedited Mode, commit your scoped changes before returning. Because the
planning worktree may contain unrelated edits, explicitly list only the files
you changed. Include both trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

Report the commit hash, verification, touched repos, preserved unrelated state,
and the recommended next CC prompt path if the next slice is opened.
