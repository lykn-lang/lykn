# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 doctest-drift fix closed | ptr: slice01 cdc-verification | correctness | arc-plan | **done** | `0731048` + [`slice01-doctest-drift-fix/cdc-verification.md`](slice01-doctest-drift-fix/cdc-verification.md) | red-CI item closed |
| A-2 | slice02 current-drift recon closed | ptr: slice02 closing-report + cdc-verification | serious | arc-plan v1.3 | **done** | `66a3565` + [`slice02-current-drift-recon/cdc-verification.md`](slice02-current-drift-recon/cdc-verification.md); CDC reproduced docs/path gates and the no-else `if` defect | re-grounded before editing |
| A-3 | All current guide/SKILL drift is either fixed in arc07 or explicitly routed | arc close: compare slice02 inventory with subsequent implementation slices and deferrals | serious | arc capability | **done** | [`closing-report.md`](closing-report.md): slice02 inventory mapped to slice03, slice04, arc10/P-22, or explicit later-candidate deferrals; arc10/P-22 is now fixed; no silent drops | anti-silent-drop row |
| A-4 | Guide/SKILL claims match shipped 0.6.0 behaviour for sampled executable claims | arc close: reproduce selected `./bin/lykn` checks/compiles/lints and `make test-docs` | serious | P-13 | **done** | [`closing-report.md`](closing-report.md): live CLI help/build/run/lint/check/compile samples reproduced; post-close arc10/P-22 fixed no-else `if`, so guide 00 now states the settled compile/check error | class-(b) composition row; reproduced at arc scale |
| A-5 | `make test-docs` and `make check-cited-paths` are green at arc close | arc close gate | serious | process note + P-21 | **done** | `make test-docs`: 476 passed / 0 failed; `make check-cited-paths`: green at close; `git diff --check`: clean | docs drift and cited-path drift stay visible |
| A-6 | slice03 build-dist-publish guide refresh closed | ptr: slice03 cdc-verification | serious | arc close accrual | **done** | `dcf23f5` + [`slice03-build-dist-publish-guide-refresh/cdc-verification.md`](slice03-build-dist-publish-guide-refresh/cdc-verification.md) | accrued child-closed row |
| A-7 | slice04 Deno workflow reconciliation closed | ptr: slice04 cdc-verification | serious | arc close accrual | **done** | `ae31c75` + `af69f70` + [`slice04-deno-workflow-reconciliation/cdc-verification.md`](slice04-deno-workflow-reconciliation/cdc-verification.md) | accrued child-closed row |

