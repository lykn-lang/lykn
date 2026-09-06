# slice02 - Dogfood Implementation Runway Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required Lykn substrate read before dogfood work | closing report lists `AGENTS.md`, `assets/ai/SKILL.md`, relevant `docs/guides/`, arc16 `arc-plan.md`, slice01 `closing-report.md`, and slice01 `cdc-verification.md` with one-line roles | serious | slice-doc | done | `closing-report.md` Section 1 lists every required file read with one-line roles. | prevents stale or invented guidance |
| F-2 | Scratch dogfood project created outside tracked source trees | closing report records the scratch project location, creation command, project shape, and confirmation that no generated project files were committed here | serious | operator direction | done | `closing-report.md` Section 2 records the scratch path, creation command, final layout, and no-commit statement. | scratch evidence, durable report |
| F-3 | Dogfood project exercises realistic module/API pressure | closing report identifies exports, package entrypoint, local bindings, validation/control-flow, data structures, tests, and runnable/demo surface in the project | serious | slice-doc | done | `closing-report.md` Sections 2 and 4 identify the API, modules, validation, data structures, tests, and demo. | avoid toy-only evidence |
| F-4 | Dogfood project build/test/lint/run behavior recorded | closing report includes command transcript and exit status for build, test, lint, and a run/demo command or an explicit reason a run/demo is not applicable | correctness | slice-doc | done | `closing-report.md` Section 3 records build/test/lint/run successes and failures. | failures are evidence |
| F-5 | CC self-grades adherence to Lykn SKILL and guides | closing report includes a concrete self-grade with examples of what followed guidance, what strained guidance, and what the guidance failed to answer | serious | dogfood method | done | `closing-report.md` Section 4 gives a B- self-grade with evidence and weaknesses. | not vibes; cite code shapes |
| F-6 | Existing pre-book implementation candidates are routed from dogfood evidence | closing report revisits `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN` with evidence-based recommendation: implement in 0.6.0, document current behavior, defer, or run another dogfood iteration | serious | slice01 bubble-up | done | `closing-report.md` Section 6 routes all five known decisions. | operator still decides |
| F-7 | New defects or guide holes receive durable routing recommendations | closing report lists any new findings with suggested discovery IDs or says none found, with rationale | serious | dogfood method | done | `closing-report.md` Section 7 proposes `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and `D-2608-RIMP`, plus a no-ID lint prompt note. | no silent drops |
| F-8 | Next executable work is recommended before book prose | closing report names the next slice/arc candidate and its blocker relationship to book/writers-guide/chapter work | serious | operator direction | done | `closing-report.md` Section 9 recommends implementation-routing/CLI-scaffold-package work before book prose. | implementation-first gate |
| F-9 | Lang repo planning/doc gates pass | `git diff --check`; `make check-cited-paths`; `make test-docs` | correctness | standing bar | done | `git diff --check` exited 0; `make check-cited-paths` exited 0 for 607 docs with 601 historical citations accepted; `make test-docs` exited 0 with 476 passed, 0 failed. | docs-only slice |

## What Worked

The scratch run made failures observable instead of hidden: testing DSL package
resolution, nested package source traversal, source-run import resolution, and
scaffold-local binary expectations all surfaced before book prose could
normalize them.
