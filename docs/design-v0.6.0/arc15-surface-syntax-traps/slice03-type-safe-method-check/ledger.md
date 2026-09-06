# arc15 · slice03 — Ledger (type-safe post-classification method-check)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands + attests
`make check`; CDC verifies structure against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **Post-classify pass** `validate_method_calls(&[SurfaceForm])` — runs after `classify`, walks the classified tree, descends into raw `SExpr` children, shape-checks each. | read the pass + the compile/check call sites (after classify) | **serious** | slice-doc | open | | the relocated guarantee |
| S-2 | **Exhaustive `match` — no `_ =>` wildcard.** A new `SurfaceForm` variant is a compile error until handled (the completeness guarantee). | read the match; confirm no wildcard arm | **serious** | slice-doc (type-safety) | open | | the real "protect with a type" |
| S-3 | **`SExpr`-child coverage complete** — every `SExpr`-bearing field of every variant + sub-struct (`MatchClause`, `FuncClause`, class members, threading steps, `FunctionCall`, `KernelPassthrough`, `Box<SurfaceForm>` recursion) is walked. | CDC field-by-field cross-check vs the enum | **serious** | completeness risk | open | | a missed field = a missed trap |
| S-4 | **Carve-out removed** — `is_match_clause`, `ptr::eq`, `:when` special-case, and the pre-classify parent-aware `walk_method_calls` are **gone**. | grep: no `is_match_clause`/`ptr::eq` in the trap path | **serious** | the hardening's point | open | | zero fragility |
| S-5 | **Full parity** — express/new/arith/`#a(…)` + nested + deep flagged; guarded match **not** flagged (no exemption); subject/body traps flagged; `((expr):when x)` outside match flagged. | the parity test set on the new pass | **serious** | slice01/02/B | open | | no regression, no re-open |
| S-6 | **Lint rule RETIRED** (operator-confirmed 2026-07-22) — `NoMethodOnExpression` + registry entry + tests/snapshot deleted; **`is_match_clause`/`ptr::eq` deleted** (no remaining caller); **guide ID-47 retained** (compiler-enforced). | the lint diff; grep no `is_match_clause` | serious | design decision | open | | revisits slice02 "both" — retire |
| S-7 | **`make check` green; scoped diff** — classifier pass + compile/check rewiring (+ lint per S-6) only. | host `make check`; `git show --stat` | serious | recon discipline | open | | |

## Closure

Closed at `<CDC-fills>` (CC-attested; `make check` reconciles on host). Rows: 7.
_(On close: CDC confirms the exhaustive match + full `SExpr`-child coverage
(field-by-field), the carve-out removal, and parity; runtime reconciles on host.
On S-6 CDC checks the operator's chosen lint fate landed.)_
