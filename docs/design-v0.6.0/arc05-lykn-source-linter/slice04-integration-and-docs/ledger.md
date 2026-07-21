# arc05 · slice04 — Ledger (Integration + guide alignment)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Runtime rows
(`make lint`/`make check`/`make test-docs`/P-11) are CC-attested and reconciled
by an operator host re-run; doc/grep rows are reproduced-by-code.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `make lint` (and thus `make check`) runs `./bin/lykn lint` over the repo's `.lykn` source and is **green**; the 2 kernel-interop fixture findings are **path-scoped** (not inline-suppressed), mechanism recorded. | `make lint` exit 0; read the Makefile target + the scoping mechanism | serious | arc-plan / slice03 bubble-up | open | | suppression is arc14, not here |
| F-2 | **guide-09 reclassified** — every `## ID-NN` entry's `**Status**` is one of **Compiler-enforced** / **Linted (`<rule-id>`)** / **Documented-only**; no inaccurate blanket "ELIMINATED BY LANGUAGE DESIGN" remains. | grep every `## ID-` has a labelled Status; count = entry count | correctness | CC anti-patterns audit; arc05 A-6 | open | | closes arc05 A-6 |
| F-3 | The labels are **accurate** — each "Linted" cites a real rule in `registry()`; each "Compiler-enforced" is a real compile error (spot-check a sample on both). | cross-check a sample of labels vs. the rule registry + a spot compile | serious | A-6 (substance, not presence) | open | | the audit's point: labels that are true, not just present |
| F-4 | `make test-docs` green after the guide-09/15 edits (doctest fences still compile). | `make test-docs` | serious | standing bar (docs-touching) | open | | doc drift is invisible to `lykn test` alone |
| F-5 | **guide-15 + SKILL** document `lykn lint` — CLI usage, rule set, exit 0/1/2, `--format=json`, `.lyk` exempt. | read `docs/guides/15-lykn-cli.md` + the SKILL linter note | correctness | arc-plan | open | | discoverability |
| F-6 | **P-11 seeded corpus** — a fixture with one deliberate instance per v1 rule (incl. shadowing + the path-scoped conventions rules): **every rule fires exactly where seeded**, exit 1. | run `./bin/lykn lint` over the seeded fixture; each rule id present once | serious | arc-plan / P-11 / A-4 | open | | the arc composition demo material |
| F-7 | **P-11 clean corpus** — an idiomatic fixture: **zero findings**, exit 0. | run `./bin/lykn lint` over the clean fixture | serious | arc-plan / P-11 / A-4 | open | | silence on clean source |
| F-8 | `make check` green; **no half-built suppression** (deferred to arc14 — confirm nothing suppression-related half-landed); diff is source + docs only (no `docs/design-v0.6.0/**`). | `make check`; grep for stray suppression scaffolding; `git show --stat` | serious | standing bar | open | | CC-attested; host reconcile |

## What Worked

_(At slice close.)_

## Closure

Closed at commit `<SHA>` on `<date>`. Verified by: `<CDC session>`.
Rows: 8. Done: _. Deferred: _. No-op: _.
_(On close: CDC writes the arc05 `closing-report.md` — composition check
A-1…A-7, bubble-up to the project, P-5 — and arc05 closes.)_
