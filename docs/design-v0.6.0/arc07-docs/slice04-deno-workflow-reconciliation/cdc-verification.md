# arc07 / slice04 CDC Verification: deno-workflow-reconciliation

**Verdict: accepted - slice04 closed/CDC-verified.** CC's close at `ae31c75`
fixed the target Deno workflow guides. CDC found one close-discipline/content
gap during verification: the target guides matched the intended flow, but guide
10 and guide 15 still carried supporting-reference examples for the old
repo-root `dist/` / hand-managed compile pipeline. CDC repaired those reference
examples before accepting the slice.

arc07 remains active because A-3/A-4/A-5 are arc-level composition rows and
must close at arc scale.

## Verification

| Check | Result | Evidence strength |
|---|---|---|
| Commit scope | `git show --stat --name-status --oneline ae31c75` touched guides 12-01/12-02/12-03, the arc plan, and slice04 close artifacts. CDC follow-up touched only guide 10, guide 15, the slice04 ledger/close artifacts, and status surfaces. | reproduced |
| Worktree state | `git status --short --branch` reported only `## release/0.6.x` before CDC edits. | reproduced |
| Ledger closure | The opening ledger had D-1 through D-8; the closed ledger and closing report walk D-1 through D-8 with no missing rows. | reproduced by artifact review |
| Closing report completeness | CC's report listed substrate, changes, retained direct Deno examples, a D-1..D-8 ledger walk, verification, and deferrals. CDC added the required explicit bubble-up section. | reproduced by artifact review |
| Live CLI contract | `./bin/lykn build --help`, `./bin/lykn test --help`, `./bin/lykn lint --help`, and `./bin/lykn run --help` match the documented normal workflows and target directories. | reproduced |
| Target guide stale sweeps | The D-2, D-3, and D-4 `rg` commands returned no stale normal-workflow hits in guides 12-01, 12-02, and 12-03. | reproduced |
| Supporting-reference sweep | CDC initially found stale guide 10/15 examples with a broader sweep. After repair, `rg -n 'lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno test test/|deno run --watch.*dist/|../../dist/|dist/main.js|dist/server.js|make build|make test|make check|deno fmt on compiled|deno test to run|deno run to execute|lykn compile to produce' docs/guides/10-project-structure.md docs/guides/12-deno docs/guides/15-lykn-cli.md` returned no hits. | reproduced |
| Direct Deno examples | Retained direct `deno run`, `Deno.*`, `@std/assert`, and `deno task` examples are framed as permission/runtime/API/assertion/task-runner teaching rather than normal lykn project workflow. | reproduced by artifact review |
| Slice boundary | No compiler, CLI, `.d.ts`, arc10, or cited-path census files were changed. The guide 10/15 edits are supporting-reference touch-ups allowed by D-7. | reproduced |
| Whitespace check | `git diff --check` exited 0 after CDC repairs. | reproduced |
| Docs gate | `make test-docs` passed: 476 passed, 0 failed. | reproduced |
| Cited-path gate | `make check-cited-paths` passed: 593 documents on `release/0.6.x`, 601 historical citations accepted via `scripts/cited-paths-census.tsv`. | reproduced |

## Row Walk

| ID | CDC disposition |
|----|-----------------|
| D-1 | Accepted. The closing report names the required substrate and live help commands; CDC reproduced the help surface. |
| D-2 | Accepted. Guide 12-01 distinguishes normal lykn wrappers from direct Deno permission/runtime examples; the stale sweep is clean. |
| D-3 | Accepted. Guide 12-02 leads with `lykn test`, `target/lykn/test/`, and Deno arg pass-through; Deno assertion examples are correctly classified. |
| D-4 | Accepted. Guide 12-03 keeps `deno task` as the subject while task bodies call lykn wrappers; the stale sweep is clean. |
| D-5 | Accepted after CDC repair. The target guides now agree with guide 10, guide 15, and `assets/ai/SKILL.md` for `target/lykn/{build,test,dist}`, source linting, testing, and generated JS. |
| D-6 | Accepted. Direct Deno teaching was preserved where the guide is teaching Deno mechanics. |
| D-7 | Accepted. CDC's guide 10/15 touch-ups are within the optional supporting-reference scope; no implementation or census files changed. |
| D-8 | Accepted. Docs/path/whitespace gates reproduced. |

## Bubble-Up

slice04 delivers its assigned arc07 piece: Deno workflow drift in guides 12-01,
12-02, and 12-03 is closed, and the supporting references in guide 10 and guide
15 no longer contradict that guidance.

No new arc slice is required from this close. The no-else `if` compiler defect
remains routed to reopened arc10 slice04, and the optional `.d.ts` user-doc pass
remains a later candidate pending an artifact-producing fixture.

arc07 should move to arc-level close next. Rows A-3, A-4, and A-5 still need an
arc composition report and reproduced arc-scale checks.

## What Worked

The targeted CC sweeps removed the intended drift from the target guides. The
CDC broader sweep over guide 10, guide 12, and guide 15 caught the remaining
supporting-reference contradiction before the slice became sediment.
