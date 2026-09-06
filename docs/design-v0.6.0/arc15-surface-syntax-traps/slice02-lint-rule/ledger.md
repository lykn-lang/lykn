# arc15 · slice02 — Ledger (Lint rule for method-on-expression + check parity)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands + attests
`make check`; CDC verifies against `lang`. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | **Shared detector — one source of truth.** The lint rule and the compile pass call the **same** per-node predicate (slice01's `check_method_on_expression`); no duplicated detection logic. | read the lint rule; it calls the exposed classifier predicate | correctness | slice02 goal | **done** | `method_on_expression_diagnostic(node)` (classifier) wraps `check_method_on_expression`; lint `enter` + `validate_method_calls` (compile/check) both bottom out there. Call sites in closing-report | anti-fork |
| S-2 | **Lint rule fires** `Severity::Error` on `(<non-atom-head> :kw …)` with the threading fix-it, at **top-level and nested** (lint walk is recursive). | rule registered; unit tests: express/new/arith + a nested `bind`-value case → 1 Error each | serious | DD-64 / slice01 carry-forward | **done** | `rules::NoMethodOnExpression` (Error); `no_method_on_expression_flags_receiver_shapes` + `_flags_nested_and_deep`; host `lykn lint` rc=1 | id `no-method-on-expression` |
| S-3 | **No over-rejection** — atom method `(x:m a)`, threading `(:m a)`, IIFE `((fn (x) …) 5)`, curried `((add 3) 4)`, plain calls → **no** finding. | negative unit tests | correctness | DD-64 §3 | **done** | `no_method_on_expression_silent_on_positives` + **`dd64_match_guard_is_not_a_trap`** (the slice01 `:when` regression — see closing-report headline) | parity + `:when` carve-out |
| S-4 | **`lykn check` ≡ compile** — `check_strict` calls `validate_method_calls`; a nested trap that `build` rejects now fails `check` too. | read `check_strict`; test a nested trap → check errors | serious | slice01 carry-forward | **done** | `compile.rs::check_strict` calls `validate_method_calls` post-resolve; host `lykn check` nested trap → rc=1 | closes the soft edge |
| S-5 | **Snapshot + registry.** New rule in `registry()`; a lint snapshot covers it (arc05 pattern). | `lint/snapshots/` has the rule; registry lists it | serious | arc05 discipline | **done** | `mod.rs` registry line 87; `lint_text_no_method_on_expression.snap` (reviewed/accepted) | |
| S-6 | **guide-09 reclassified** — ID-47 marked *compiler-enforced + linted*. | read guide-09 rule table | correctness | slice-doc | **done** | ID-47 Status `Compiler-enforced · Linted (`no-method-on-expression`)`; table row + tally (6 compiler / 14 linted / 2 split) | |
| S-7 | **`make check` green; scoped diff** — classifier (predicate export) + lint + `check_strict` + guide-09 only; no unrelated changes. | host `make check`; `git show --stat` | serious | recon discipline | **done** (CC-attested) | `make check` ✓; diff = classifier(×2) + compile.rs + lint(×2)+snap + guide-09. ID-32/33 untouched | |

## Closure

Closed at `<CDC-fills>` (CC-attested; `make check` reconciles on host). Rows: 7.
Done: 7. **Carried a slice01 fix:** the shared detector gained a `:when`
match-guard carve-out (slice01 over-rejected valid `match` guards — a shipped
regression the dogfood caught). _(On close: CDC greps the lint rule reuses the
shared predicate, checks Error severity + registration + `check_strict` wiring +
snapshot, re-runs the over-rejection cases **including `:when`**, checks arc
ledger A-2, and notes slice01's cdc-verification "no over-rejection" missed the
`:when` case — the corpus sweep didn't compile those sites.)_
