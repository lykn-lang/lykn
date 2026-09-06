# CC Prompt - arc16 slice02: dogfood implementation runway

You are CC in the implementation/dogfood seat. CDC has opened arc16 slice02 so
we can run another from-scratch Lykn project before any book prose starts.

## Branch and Repo

Work in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`

Branch:

`release/0.6.x`

Do not edit the sibling book repo or writers-guide repo in this slice. Do not
edit compiler, CLI, scaffold, guide, or book files unless Duncan explicitly
redirects you. This is a dogfood and routing slice.

## Required Reading

Read these before creating the dogfood project:

1. `AGENTS.md`
2. `assets/ai/SKILL.md`
3. `docs/guides/00-lykn-surface-forms.md`
4. `docs/guides/01-core-idioms.md`
5. `docs/guides/02-api-design.md`
6. `docs/guides/03-error-handling.md`
7. `docs/guides/10-project-structure.md`
8. `docs/guides/15-lykn-cli.md`
9. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`
10. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/closing-report.md`
11. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice01-pre-book-decision-gate/cdc-verification.md`
12. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/slice-plan.md`
13. `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/ledger.md`

## Dogfood Assignment

Create one small but non-trivial Lykn utility-library project from scratch in a
scratch directory outside tracked source trees. A timestamped directory under
`/private/tmp` is fine.

Choose a utility-library subject that naturally exercises:

- modules and public API boundaries;
- package entrypoint/export decisions;
- several derived local values;
- ordered validation/error construction;
- arrays/objects/records or tagged results;
- a small test suite;
- at least one runnable/demo command if supported by the project shape.

Avoid toy arithmetic and one-function examples. The point is to let awkward
language and tooling pressure appear naturally.

## Required Checks

For the scratch project, run and record:

- the creation/setup command transcript;
- `./bin/lykn build`;
- `./bin/lykn test`;
- `./bin/lykn lint`;
- one run/demo command, or a concrete reason it is not applicable.

If a command fails, do not hide it. Record the command, exit status, relevant
output, and whether the failure is a project bug, a guide hole, a toolchain bug,
or expected current behavior.

For the lang repo before commit, run:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

## Required Report

Create the slice close report as `closing-report.md` in this slice directory.
Include:

1. Source material read, with one-line role for each required file.
2. Scratch project summary: subject, file layout, why it is realistic enough.
3. Command transcript and outcomes.
4. Project self-grade against the Lykn SKILL and guides:
   - what followed guidance cleanly;
   - what strained or contradicted guidance;
   - what the guides did not answer.
5. Dogfood evidence for the known pre-book decisions:
   - `D-2607-R4NW`;
   - `D-2608-XPRT`;
   - `D-2608-LBND`;
   - `D-2608-COND`;
   - `D-2608-SOWN`.
6. New findings, if any, with proposed discovery IDs or a clear "none".
7. Row-by-row ledger walk for F-1 through F-9.
8. Bubble-up to the arc:
   - whether implementation work must happen before book/writers-guide prose;
   - what exact slice or arc should open next;
   - what remains blocked on Duncan's decision.

## Important Constraints

- Do not commit scratch project files into this repo.
- Do not append to `scripts/cited-paths-census.tsv`.
- Do not cite nonexistent future close-set paths as full repo paths in tracked
  docs.
- Do not soften a toolchain failure into prose. Failures are data.
- Use the required co-author trailers if you commit:

```
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
