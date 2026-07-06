# Slice 01: lint-infra — Ledger

`lykn lint` machinery end-to-end + 3 pilot rules + the rule-inventory
compiler-verification pass. Per DD-59 draft (operator-confirmed) and
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Rebuild-first.
6 rows.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Rule inventory compiler-verified** — every DD-59 candidate's bad-example compiled against the current compiler; classified already-errors / compiles-and-lintable / unclear; the table is slice02's authoritative corpus | table + compile transcripts in the closing report; count reconciles with DD-59's list (15 tier-1 + 2 tier-2 + 2 conventions) | serious | DD-59 + arc10 lesson #4 | open | | watch ID-44/45/46 (may already error) and ID-03's false-positive question (flag, don't decide) |
| F-2 | **Lint infrastructure** — spanned walk (with parent context), rule trait + match-dispatch registry, error/warn severities, diagnostics through the existing `Diagnostic` rendering | code review + the pilots exercising walk/registry/severities | serious | DD-59 Q1/Q2/Q4 | open | | rule trait must not preclude stateful rules (slice03 shadowing) |
| F-3 | **CLI wired, stub replaced** — `lykn lint <paths…>` (files/dirs, `.lykn` discovery, `.lyk` exempt); exit 0 clean / 1 findings / 2 usage-IO; `--format=json` with a stable shape (rule, severity, message, file, span, suggestion) | run on clean fixture → exit 0; seeded → exit 1 + diagnostics; bad path → exit 2; JSON parses with the documented keys; the issue-#1 stub text is gone (grep) | serious | DD-59 Q3 + the stub | open | | exit codes are API — CI will gate on them |
| F-4 | **3 pilot rules green** — `no-require` (error), `sort-without-comparator` (warn), `parseint-radix` (warn): bad fixtures flagged at the right span with suggestions; good fixtures silent | per-rule fixture tests, both directions | serious | DD-59 Q6 pilots | open | | shape-diverse on purpose: call-head match, method-call arity, call arity |
| F-5 | **Snapshots** — text and JSON output under `insta`, reviewed (never auto-accepted) | snapshot files committed; review noted in the walk | correctness | project snapshot discipline | open | | |
| F-6 | **Green bar + smoke dogfood** — `make check` ✓ (suites 1365/0 · 673/0 unchanged); `lykn lint test/ examples/` runs cleanly (no crash); any findings recorded for slice02's triage, not fixed here | suite runs; smoke transcript | serious | standing bar | open | | full dogfood (A-5) is arc-scale, after the corpus lands |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row disposition counts.)_

> F-1 informs slice02's contract — deliver the table even if some pilot
> work runs long. Design sub-questions (walk context, `.lyk` exemption,
> rule-ID naming) go in the closing report. `make check` is the bar
> (~1m04s, post-arc12).
