# arc16 slice09 - Toolchain and Project-Structure Chapters Closing Report

Status: **Closed / CDC-verified 2026-09-12**.

## Outcome

slice09 refreshed the Lykn Book chapters that teach the current 0.6.x toolchain, testing workflow, project structure, build/dist/publish path, Deno/no-Node boundary, CI framing, and source ownership. The book-side change landed in `/Users/oubiwann/lab/cnbb/lykn` as commit `03b3818` (`docs: refresh lykn toolchain chapters`).

The four slice07 testing-macro book failures were disposed by making their context explicit: the snippets are instructional fragments for project test files, not standalone book doctests from the book repository. Those examples are now annotated as skipped and paired with prose explaining that real `lykn new` projects provide the project context and import map. This records the boundary directly instead of papering over an implementation defect. No new implementation defect appeared during the pass.

## Grounding

The pass read and applied:

- lang worktree `AGENTS.md` and branch/worktree ownership rules;
- arc16 `arc-plan.md`;
- slice09 `slice-plan.md`, `ledger.md`, and `cc-prompt.md`;
- slice07 current-book drift inventory;
- slice08 CDC verification for `D-2609-FNRT`;
- book repo `AGENTS.md`;
- writers-guide `AGENTS.md`, `authoring-guide.md`, and `planned-toc.md`;
- source guides `docs/guides/10-project-structure.md`, `docs/guides/12-deno/12-01-runtime-basics.md`, `docs/guides/12-deno/12-02-testing.md`, `docs/guides/12-deno/12-03-task-runner.md`, `docs/guides/12-deno/12-04-publishing.md`, `docs/guides/14-no-node-boundary.md`, `docs/guides/15-lykn-cli.md`, and `docs/guides/16-testing.md`;
- the book `Makefile`, `book.toml`, `README.md`, and touched chapters.

## Chapter map

The book commit touched these tracked files:

- `src/SUMMARY.md` — renamed the stale Biome/ESLint chapter labels to the current Deno/external-linter framing.
- `src/part0/chapter1/1-installing.md` — refreshed quickstart and toolkit setup around current `lykn` commands.
- `src/part6/chapter28/1-why-deno.md` and `src/part6/chapter28/6-environment.md` — clarified Deno as the JS runtime/tooling substrate, the root `project.json`, package `deno.json` metadata, and generated output under `target/lykn/`.
- `src/part6/chapter29/*.md` — aligned testing prose with current `lykn test`, `lykn test --docs --fence`, Deno passthrough after `--`, source-only generated tests under `target/lykn/test/`, and macro-example context.
- `src/part6/chapter30/*.md` — aligned workflow/tooling chapters with `lykn build`, `lykn lint`, `lykn dist`, `lykn publish`, Deno lint/format, optional external linters, and current project structure.
- `src/part6/chapter31/*.md` — refreshed tasks, GitHub Actions, docs CI, and deployment/publish dry-run examples around the current CLI and source-ownership model.

## Verification

From `/Users/oubiwann/lab/cnbb/lykn`, the focused book doctest gate for all touched chapters passed:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test   --docs src/part0/chapter1/1-installing.md   --docs src/part6/chapter28/1-why-deno.md   --docs src/part6/chapter28/6-environment.md   --docs src/part6/chapter29/1-philosophy.md   --docs src/part6/chapter29/2-writing-tests.md   --docs src/part6/chapter29/3-assertions.md   --docs src/part6/chapter29/4-suites-steps.md   --docs src/part6/chapter29/5-test-compiles.md   --docs src/part6/chapter29/6-markdown-testing.md   --docs src/part6/chapter29/7-running-tests.md   --docs src/part6/chapter30/1-workflow.md   --docs src/part6/chapter30/2-biome.md   --docs src/part6/chapter30/3-eslint.md   --docs src/part6/chapter30/4-lykn-cli.md   --docs src/part6/chapter30/5-project-structure.md   --docs src/part6/chapter31/1-pipeline.md   --docs src/part6/chapter31/2-tasks.md   --docs src/part6/chapter31/3-github-actions.md   --docs src/part6/chapter31/4-docs-ci.md   --docs src/part6/chapter31/5-deployment.md   --fence lisp
```

Result: 7 generated test files from 5 runnable blocks, 13 skipped blocks, 5 passed / 0 failed. Touched shell/prose-only chapters reported no Lykn blocks.

The book build passed:

```sh
mdbook build -d book
```

Result: EPUB and HTML output generated successfully. The only reported warning was the existing `mdbook-mermaid` preprocessor version warning.

Whitespace verification passed:

```sh
git -C /Users/oubiwann/lab/cnbb/lykn diff --check
```

Repository hygiene before planning closeout: book `main` had only the pre-existing untracked `_to_delete/`; release/0.6.x and writers-guide were clean. The generated book doctest `target/` directory was removed after verification.

No source code or source docs changed in release/0.6.x, so source gates were not required for this slice.

## Artifact inventory

- Book commit: `03b3818` (`docs: refresh lykn toolchain chapters`).
- Planning close artifacts: this closing report, the updated slice09 ledger,
  and [`cdc-verification.md`](cdc-verification.md).
- No durable planning artifacts were added beyond the closeout set.
- Generated doctest `target/` was removed; generated mdBook output under `book/` remains ignored by the book repo.

## Bubble-up and next slice

slice09 delivered the assigned toolchain/project-structure chapter pass and found no new implementation blocker. slice10 is opened for language-surface chapters: kernel-only examples, compile-error annotations, placeholder/non-Lykn examples, stale surface/library examples, expected-output drift, and the language/compiler chapter rows left by the slice07 inventory.

Silent-drop check: all seven ledger rows were completed. No row was deferred or marked no-op.
