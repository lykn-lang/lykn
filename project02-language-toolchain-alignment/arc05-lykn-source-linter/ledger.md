# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (lint-infra) closed | ptr: slice01 cdc-verification | serious | arc-plan | done | slice01 cdc-verification (attested) | |
| A-2 | slice02 (shape-rule-corpus) closed | ptr: slice02 cdc-verification | serious | arc-plan | done | slice02 cdc-verification (attested) | |
| A-3 | slice03 (resolution-consumer + context rules) closed | ptr: slice03 cdc-verification | correctness | arc-plan | done | `ea429e2`; cdc-verification.md (code-review + grep; runtime host-reconcile) | narrowed by the v1.6 split |
| A-4 | **`lykn lint` flags every v1 rule's seeded anti-pattern in a fixture corpus and stays silent on clean idiomatic source** (the P-11 demo) | end-to-end run over the seeded + clean fixtures; every rule fires exactly where seeded; exit 1 dirty / 0 clean | serious | arc-plan / P-11 | done | `2feb5fd` `p11_lint_corpus` (seeded→16 rules/exit1, clean→exit0) in `make check`; host §5 | reproduced at arc scale (attested; host reconcile) |
| A-5 | **the linter is dogfooded** — `lykn lint` over the repo's own `.lykn` sources returns zero findings, or every finding is fixed/acknowledged with rationale | run it on `test/`, `examples/`, `packages/`; triage table | serious | arc-plan | done | `ea429e2` dogfood: 118 `.lykn` files, 2 benign fixtures triaged, 0 shadowing FPs (CC-attested; host-reconcile) | closed by slice03 |
| A-6 | **guide-09 is aligned** — every entry carries its enforcement label (compiler-enforced / linted / documented-only); doctests green | grep the labels; `make check` | correctness | CC anti-patterns audit (2026-06-30) | done | `2feb5fd`: 46 entries labelled (7 compiler-enforced/14 linted/25 documented-only); all 12 formerly-ELIMINATED reclassified; `make test-docs` 475/0 | closes the reclassification debt that spawned arc10 |
| A-7 | slice04 (integration + guide alignment) closed | ptr: slice04 cdc-verification | correctness | arc-plan (v1.6 split) | done | slice04 cdc-verification; `2feb5fd` | suppression deferred → arc14 |

