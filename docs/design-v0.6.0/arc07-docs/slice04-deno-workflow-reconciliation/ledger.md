# Slice 04: deno-workflow-reconciliation - Ledger

Deno workflow reconciliation for arc07. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| D-1 | Current Deno/lykn workflow substrate is loaded before editing | closing report lists slice03 CDC verification, this open set, guides 12-01/12-02/12-03, guide 10, guide 15, `assets/ai/SKILL.md`, and live help for `build`/`test`/`lint`/`run` | serious | slice-doc | closed | Required substrate loaded; live help captured for build/test/lint/run. | prevents editing from the pre-slice03 `dist/` model |
| D-2 | Guide 12-01 distinguishes runtime-level Deno examples from normal lykn project workflow | targeted read plus `rg -n 'lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno test test/|dist/main.js|dist/server.js' docs/guides/12-deno/12-01-runtime-basics.md`; closing report classifies retained direct-Deno examples | correctness | slice03 bubble-up | closed | Guide 12-01 now frames direct `deno run` as permission/runtime teaching and normal workflow as `lykn build`/`run`/`test`/`lint`; targeted stale sweep returned no hits. | Deno permissions/API examples remain direct when framed as runtime examples |
| D-3 | Guide 12-02 teaches `lykn test` as the normal test workflow | `rg -n 'lykn compile .* -o dist/|../../dist/|deno test test/|make test' docs/guides/12-deno/12-02-testing.md`; stale normal-workflow hits are gone or explicitly classified | correctness | slice03 bubble-up | closed | Guide 12-02 now leads with `lykn test`, `target/lykn/test/`, and pass-through Deno test args; targeted stale sweep returned no hits. | JS assertion examples remain as Deno API examples |
| D-4 | Guide 12-03 task examples use lykn wrappers for normal workflows | `rg -n 'make build|lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno run --watch.*dist/|dist/main.js' docs/guides/12-deno/12-03-task-runner.md`; no stale normal workflow remains | serious | slice03 bubble-up | closed | Guide 12-03 task bodies now call `lykn build`, `lykn test`, `lykn lint`, `lykn fmt`, `lykn run`, and `lykn dist`; targeted stale sweep returned no hits. | `deno task` remains the subject; task bodies call lykn wrappers |
| D-5 | Normal workflow language across the target guides agrees with guide 10, guide 15, and the SKILL | compare target-guide wording with `docs/guides/10-project-structure.md`, `docs/guides/15-lykn-cli.md`, and `assets/ai/SKILL.md`; no contradictions around `target/lykn/{build,test,dist}`, `lykn test`, `lykn lint`, or generated JS remain | serious | arc capability | closed | Target guides match guide 10/15/SKILL: `lykn build` -> `target/lykn/build/`, `lykn test` -> `target/lykn/test/`, `lykn lint` over source, and no repo-root generated JS workflow. | slice03 files used as reference material only |
| D-6 | Legitimate direct Deno teaching is preserved, not over-normalized | closing report lists retained direct `deno run`/`deno test`/Deno API examples and explains why each is runtime/API/task-runner teaching rather than normal lykn project workflow | correctness | slice-doc | closed | Closing report classifies retained direct Deno examples: permission flags, Deno namespace APIs, assertions/test API, and `deno task` syntax. | avoids erasing the Deno guide's purpose |
| D-7 | Slice boundary is preserved | `git diff --name-only` is limited to guides 12-01/12-02/12-03, optional cross-reference touch-ups in guide 10/15/SKILL, backlog/status surfaces, and slice close artifacts | correctness | slice-doc | closed | Diff limited to guides 12-01/12-02/12-03, arc/slice close artifacts; no compiler, CLI, `.d.ts`, arc10, or cited-path census edits. | no compiler, CLI, `.d.ts`, or arc10 work |
| D-8 | Docs/path gates green at close | `make test-docs`, `make check-cited-paths`, and `git diff --check` pass | serious | process note + P-21 | closed | `make test-docs`: 476 passed, 0 failed; `make check-cited-paths`: passed; `git diff --check`: clean. | doc-touching slice; cited-path gate must stay green |

## What Worked

- Separating "Deno is the subject" from "normal lykn workflow" let the slice
  preserve useful runtime examples while removing hand-managed generated JS
  pipelines.
- The targeted stale-workflow greps cleanly identified the repo-root `dist/`
  model without forcing broad edits to unrelated Deno API sections.

## Closure

Closed. Rows: 8. Done: 8. Deferred: 0. No-op: 0.
