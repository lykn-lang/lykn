# Slice 04: deno-workflow-reconciliation - Ledger

Deno workflow reconciliation for arc07. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| D-1 | Current Deno/lykn workflow substrate is loaded before editing | closing report lists slice03 CDC verification, this open set, guides 12-01/12-02/12-03, guide 10, guide 15, `assets/ai/SKILL.md`, and live help for `build`/`test`/`lint`/`run` | serious | slice-doc | open | | prevents editing from the pre-slice03 `dist/` model |
| D-2 | Guide 12-01 distinguishes runtime-level Deno examples from normal lykn project workflow | targeted read plus `rg -n 'lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno test test/|dist/main.js|dist/server.js' docs/guides/12-deno/12-01-runtime-basics.md`; closing report classifies retained direct-Deno examples | correctness | slice03 bubble-up | open | | Deno permissions/API examples may remain direct when framed as runtime examples |
| D-3 | Guide 12-02 teaches `lykn test` as the normal test workflow | `rg -n 'lykn compile .* -o dist/|../../dist/|deno test test/|make test' docs/guides/12-deno/12-02-testing.md`; stale normal-workflow hits are gone or explicitly classified | correctness | slice03 bubble-up | open | | JS assertion examples can remain if imports and workflow wording are current |
| D-4 | Guide 12-03 task examples use lykn wrappers for normal workflows | `rg -n 'make build|lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno run --watch.*dist/|dist/main.js' docs/guides/12-deno/12-03-task-runner.md`; no stale normal workflow remains | serious | slice03 bubble-up | open | | `deno task` remains the subject; task bodies should call lykn wrappers |
| D-5 | Normal workflow language across the target guides agrees with guide 10, guide 15, and the SKILL | compare target-guide wording with `docs/guides/10-project-structure.md`, `docs/guides/15-lykn-cli.md`, and `assets/ai/SKILL.md`; no contradictions around `target/lykn/{build,test,dist}`, `lykn test`, `lykn lint`, or generated JS remain | serious | arc capability | open | | slice03 files are reference material, not broad edit targets |
| D-6 | Legitimate direct Deno teaching is preserved, not over-normalized | closing report lists retained direct `deno run`/`deno test`/Deno API examples and explains why each is runtime/API/task-runner teaching rather than normal lykn project workflow | correctness | slice-doc | open | | avoids erasing the Deno guide's purpose |
| D-7 | Slice boundary is preserved | `git diff --name-only` is limited to guides 12-01/12-02/12-03, optional cross-reference touch-ups in guide 10/15/SKILL, backlog/status surfaces, and slice close artifacts | correctness | slice-doc | open | | no compiler, CLI, `.d.ts`, or arc10 work |
| D-8 | Docs/path gates green at close | `make test-docs`, `make check-cited-paths`, and `git diff --check` pass | serious | process note + P-21 | open | | doc-touching slice; cited-path gate must stay green |

## What Worked

_(At slice close. Capture patterns that helped preserve Deno teaching while
removing stale lykn workflow guidance.)_

## Closure

Open.
