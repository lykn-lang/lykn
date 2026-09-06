# Slice 04: deno-workflow-reconciliation

> **Open set** (2026-08-08, CDC). Reconcile the remaining Deno workflow guides
> after slice03 closed the build/dist/publish cluster. This slice should make
> normal lykn project workflows route through the lykn CLI while preserving
> intentional Deno runtime teaching.

## 1. Goal

Bring guides 12-01, 12-02, and 12-03 into line with the current 0.6.0 CLI:

- `lykn build` writes build artifacts to `target/lykn/build/`;
- `lykn test` compiles `.lykn`/`.lyk` tests into `target/lykn/test/` and then
  runs Deno's test runner;
- `lykn lint` lints Lykn source directly;
- `lykn run` is the normal wrapper for running Lykn files;
- generated JS under `target/lykn/` should not become a hand-written workflow
  target for normal project work.

The guides should still teach Deno concepts where Deno itself is the subject:
permissions, `Deno:*` APIs, `deno.json` task mechanics, assertions, and direct
Deno examples that are explicitly framed as runtime-level examples rather than
the normal lykn project workflow.

## 2. Scope

### In

- Update `docs/guides/12-deno/12-01-runtime-basics.md`:
  - distinguish Deno runtime examples from normal lykn project commands;
  - replace stale `lykn compile ... -o dist/...`, `deno fmt dist/`, and
    `deno test test/` workflow prose where it claims to be the project path;
  - keep Deno permission/API examples that are teaching the runtime itself.
- Update `docs/guides/12-deno/12-02-testing.md`:
  - describe `lykn test` as the normal test workflow;
  - describe JS tests against compiled output accurately without teaching a
    hand-managed repo-root `dist/`;
  - keep Deno's assertion/test API examples where they remain the right subject.
- Update `docs/guides/12-deno/12-03-task-runner.md`:
  - make `deno task` examples call lykn wrappers (`lykn build`, `lykn test`,
    `lykn lint`, `lykn run`) instead of compiling/linting generated `dist/`
    by hand;
  - avoid Makefile examples that reintroduce `lykn compile ... -o dist/...`.
- Use guide 10, guide 15, and `assets/ai/SKILL.md` as the already-refreshed
  reference model from slice03.
- If the sweep finds another already-fixed or explicitly-routed discovery row,
  update `backlog/discoveries.md` honestly; do not invent a row for every
  prose edit.

### Out

- Do not change compiler behaviour or CLI implementation. This is docs-only
  unless a tiny typo in help text is discovered and explicitly justified.
- Do not edit the already-refreshed build/dist/publish guide cluster except for
  link or cross-reference corrections that are necessary for consistency.
- Do not implement the no-else `if` compiler fix; that remains arc10 slice04.
- Do not do the optional `.d.ts` documentation pass. If a `.d.ts` mention is
  encountered, leave it accurate but do not expand the surface without a
  fixture-backed plan.
- Do not append to `scripts/cited-paths-census.tsv`.

## 3. Verification Approach

Start by reproducing the current command surfaces:

- `./bin/lykn build --help`
- `./bin/lykn test --help`
- `./bin/lykn lint --help`
- `./bin/lykn run --help`

Then sweep the three target guides for stale normal-workflow claims:

- repo-root `dist/` as the standard compiled-output home;
- `lykn compile ... -o dist/...` as the normal build step;
- `deno fmt dist/` or `deno lint dist/` over generated JS;
- direct `deno test` where the text is teaching the lykn project workflow;
- `make build` examples that compile by hand into `dist/`;
- `deno task` examples that bypass the lykn wrapper in normal workflows.

Use judgment: some direct `deno run`, `deno test`, and Deno API examples are
valid when the section is explicitly about Deno itself. Classify retained direct
Deno examples in the closing report so CDC can tell preservation from drift.

Required gates:

- `make test-docs`
- `make check-cited-paths`
- `git diff --check`

## 4. Exit Criteria

1. Guides 12-01, 12-02, and 12-03 teach lykn wrappers for normal project build,
   run, test, lint, and task workflows.
2. No target guide teaches repo-root `dist/` or hand-managed generated JS as the
   normal lykn project workflow.
3. Legitimate Deno runtime/API/assertion/task-runner teaching is preserved and
   explicitly classified in the closing report.
4. The slice stays docs-scoped unless a tiny source typo is explicitly justified.
5. `make test-docs`, `make check-cited-paths`, and `git diff --check` pass.
