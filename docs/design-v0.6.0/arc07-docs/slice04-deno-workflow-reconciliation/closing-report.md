# Slice 04 Closing Report: deno-workflow-reconciliation

Date: 2026-08-08
Status: Closed

## Summary

Slice 04 reconciled the remaining Deno workflow guides after slice03 closed the
build/dist/publish cluster. Guides 12-01, 12-02, and 12-03 now teach the lykn
CLI as the normal project workflow:

- `lykn build` builds workspace packages into `target/lykn/build/`.
- `lykn test` compiles `.lykn` and `.lyk` tests into `target/lykn/test/` and
  invokes Deno's test runner.
- `lykn lint` lints lykn source directly.
- `lykn run <file>` is the normal wrapper for lykn entry points.
- `deno task` remains the task runner, but normal project task bodies call the
  lykn wrappers.

Direct Deno examples remain where Deno itself is the subject: permissions,
Deno namespace APIs, assertion/test APIs, and task syntax. No compiler, CLI,
`.d.ts`, arc10, or cited-path census files were changed.

CDC verification found a remaining supporting-reference drift in guides 10 and
15: the Deno workflow target guides were fixed, but the reference guides still
contained a repo-root `dist/` Makefile/task pipeline and a multi-file
`lykn compile` loop. CDC repaired those references during verification so the
slice's D-5 consistency row is true at close.

## Substrate Loaded

Before editing, CC loaded:

- `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/cdc-verification.md`
- `docs/design-v0.6.0/arc07-docs/slice04-deno-workflow-reconciliation/slice-doc.md`
- `docs/design-v0.6.0/arc07-docs/slice04-deno-workflow-reconciliation/ledger.md`
- `docs/guides/12-deno/12-01-runtime-basics.md`
- `docs/guides/12-deno/12-02-testing.md`
- `docs/guides/12-deno/12-03-task-runner.md`
- `docs/guides/10-project-structure.md`
- `docs/guides/15-lykn-cli.md`
- `assets/ai/SKILL.md`

CC also checked the live command surface:

- `./bin/lykn build --help`: build output is `target/lykn/build/`.
- `./bin/lykn test --help`: test output defaults to `target/lykn/test/`, and
  extra Deno test-runner args pass after `--`.
- `./bin/lykn lint --help`: lints `.lykn` source recursively; `.lyk` files are
  exempt.
- `./bin/lykn run --help`: runs a `.lykn` or `.js` file.

## Changes

- `docs/guides/12-deno/12-01-runtime-basics.md` now explicitly separates Deno
  runtime teaching from normal lykn project commands. The project pipeline uses
  `lykn build`, `lykn run`, `lykn test`, and `lykn lint`; the permission
  examples remain direct `deno run` because permission flags are the subject.
- `docs/guides/12-deno/12-02-testing.md` now teaches `lykn test` as the normal
  test workflow, names `target/lykn/test/`, and shows Deno test-runner
  pass-through args after `--`. The `Deno.test` and `@std/assert` example
  remains as Deno API/assertion teaching.
- `docs/guides/12-deno/12-03-task-runner.md` now keeps `deno task` as the
  subject but routes task bodies through `lykn build`, `lykn test`,
  `lykn lint`, `lykn fmt`, `lykn run`, and `lykn dist`.
- CDC follow-up refreshed the guide 10 task/project pipeline and guide 15
  compile/run examples so supporting references no longer teach repo-root
  `dist/` or a hand-managed multi-file compile loop as the normal workflow.

## Retained Direct Deno Examples

- Guide 12-01 retains direct `deno run` permission examples because the section
  teaches Deno's permission flags, not the normal lykn run workflow.
- Guide 12-01 retains Deno namespace API examples such as file I/O,
  `Deno.serve`, `Deno.Command`, `Deno.env.get`, and `Deno.args` because the
  section teaches runtime APIs available to compiled lykn output.
- Guide 12-02 retains `Deno.test` and `@std/assert` examples because they teach
  Deno's test API and assertion library. The surrounding workflow text now
  points normal lykn project tests at `lykn test`.
- Guide 12-03 retains `deno task` commands because the guide's subject is the
  task runner. The task bodies now call lykn wrappers.

## Ledger Walk

| ID | Result | Evidence |
|----|--------|----------|
| D-1 | closed | Required context loaded; live help checked for build/test/lint/run. |
| D-2 | closed | Guide 12-01 distinguishes runtime Deno examples from normal lykn wrappers; targeted stale sweep returned no hits. |
| D-3 | closed | Guide 12-02 leads with `lykn test` and `target/lykn/test/`; targeted stale sweep returned no hits. |
| D-4 | closed | Guide 12-03 task bodies call lykn wrappers; targeted stale sweep returned no hits. |
| D-5 | closed | Target guide wording matches guide 10, guide 15, and the SKILL for `target/lykn/{build,test,dist}`, `lykn test`, `lykn lint`, and generated JS. |
| D-6 | closed | Retained direct Deno examples are classified above. |
| D-7 | closed | Diff stayed within guides 12-01/12-02/12-03, arc/slice close artifacts; no code, `.d.ts`, arc10, or census changes. |
| D-8 | closed | `make test-docs`, `make check-cited-paths`, and `git diff --check` passed. |

## Verification

Commands run:

```sh
./bin/lykn build --help
./bin/lykn test --help
./bin/lykn lint --help
./bin/lykn run --help
rg -n 'lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno test test/|dist/main.js|dist/server.js' docs/guides/12-deno/12-01-runtime-basics.md
rg -n 'lykn compile .* -o dist/|../../dist/|deno test test/|make test' docs/guides/12-deno/12-02-testing.md
rg -n 'make build|lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno run --watch.*dist/|dist/main.js' docs/guides/12-deno/12-03-task-runner.md
make test-docs
make check-cited-paths
git diff --check
```

Results:

- Targeted stale workflow sweeps: no hits.
- `make test-docs`: 476 passed, 0 failed.
- `make check-cited-paths`: passed.
- `git diff --check`: clean.

## Bubble-up to the Arc

slice04 delivered the Deno workflow reconciliation assigned by the arc plan:
guides 12-01, 12-02, and 12-03 now route normal project workflows through lykn
wrappers while preserving intentional Deno runtime/API/task-runner teaching.

Implementation and CDC verification revealed one adjacent guide consistency
gap: guide 10 and guide 15 still carried some old manual `dist/` workflow
examples. CDC repaired those as supporting-reference touch-ups inside the
slice boundary. No new slice is required for that finding.

Silent-drop diff: the slice did not change compiler/CLI behaviour, `.d.ts`
documentation, arc10, or the cited-path census, matching the out-of-scope list.
Arc07 remains active for the arc-level composition rows A-3, A-4, and A-5.

## Deferrals

- The no-else `if` compiler defect remains routed to arc10 slice04.
- The optional `.d.ts` documentation pass remains deferred pending an
  artifact-producing fixture.
- Arc-level rows A-3, A-4, and A-5 remain open for arc07 close; this slice
  closes the guide 12-01/12-02/12-03 Deno workflow piece only.
