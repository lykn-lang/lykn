# arc05 · slice03 — Ledger (Linter resolution-consumer + context rules)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Rows are
grep/test-verifiable acceptance criteria. `done` requires evidence at
`reproduced` strength at slice scale; sandbox runtime rows are CC-attested
and reconciled by an operator host re-run (bootstrap §3, §9).

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | The lint pipeline resolves before rule dispatch: `lint_source` runs `resolver::resolve` over the reader forms, and the shared head accessor `atom_call` returns the head **only for unresolved atoms** (via `as_form_head()`), `None` for a bound head. | read `lint/mod.rs` + `lint/rules.rs`: `resolver::resolve` in the pipeline; `atom_call` uses `as_form_head()` not `atom_parts()` for the head | serious | arc13 A-6 / DD-61 §A6 | open | | the single funnel — gates all head-matching rules at once |
| F-2 | No head-matching rule fires on a **lexically-bound head**. A fixture per trigger class (`(bind require 0)(require x)`; `(func f :args (:any parseInt) :body (parseInt s))`; a bound `sort`/`eval`/`isNaN`/`or`/`delete`/`new`/`for-in`/`import`) lints **silent**; the same head **unbound** still fires. | `cargo test -p lykn-cli lint::` resolution fixtures, both directions | serious | DD-61 §A6 | open | | the false-positive class the slice exists to kill |
| F-3 | The two **atom-position** rules honour resolution: `no-arguments` and `no-dirname-fixtures` do not fire on a bound atom of that name (a `bind`/param named `arguments`). | fixture: `(func f :args (:any arguments) :body arguments)` → silent; bare `arguments` → fires | correctness | DD-61 §A6 | open | | atom rules read `atom_parts`, not `atom_call` — separate check |
| F-4 | **shadowing rule (ID-12), warn** — a lexical binding whose name is already bound in an **enclosing lexical scope** is flagged (e.g. inner `func`/`fn` param `x` inside an outer binder of `x`; a `bind x` inside a scope already binding `x`). | `cargo test` shadowing fixtures: nested shadow → 1 warn at the inner def span; sibling non-shadow → silent | correctness | arc-plan A-3 / DD-59 Q6 | open | | span points at the shadowing def-site |
| F-5 | The shadowing rule is **silent on form-shadowing** (a param named `array`/`cell` shadowing a built-in form — legal by DD-60 D1) and on plain non-shadowing binds. | fixture: `(func f :args (:any array) :body (array 1))` → silent; `(bind x 1)(bind y 2)` → silent | correctness | DD-60 D1 | open | | D1 made form-shadowing correct — must not warn on it |
| F-6 | The shadowing rule reuses the resolver's **single** scope model — no second/divergent scope decider. | grep: shadowing rule consumes `resolver`/`binding` scoping (resolved tags or an exposed `resolver` helper); **no** re-implemented body-vs-enclosing scope logic in `lint/` | serious | arc13 lesson (N deciders diverge) | open | | if a helper must be exposed from `lykn-lang`, it is the *same* one `resolver.rs` uses |
| F-7 | **arc13 A-6 closed** — the ID-42 (`fn`/form/reserved param-name) lint question is re-answered from the fixed state, in writing, with rationale: reserved words → D2 compile errors (no lint); form-named params → D1 legal shadow (no error); **disposition: no lint rule**. | this slice-doc §1/§4 + a DD-59 addendum note; arc13 `closing-report.md` A-6 row flipped to `done` with a pointer here | serious | arc13 A-6 (hands off by design) | open | | closing A-6 *is* writing this re-answer (its own Verify) |
| F-8 | **Dogfood (arc05 A-5)** — resolution-aware `lykn lint` over `test/`, `examples/`, `packages/**` `.lykn`: zero findings, or every finding fixed or acknowledged in a triage table with rationale. | host: `./bin/lykn build` then `./bin/lykn lint <trees>`; triage table in the closing report | serious | arc-plan A-5 | open | | resolution-awareness changes the finding set vs slice02's dogfood — re-run, don't reuse |
| F-9 | `make check` green; new lint tests pass; **diff is source-only** (no `docs/design-v0.6.0/**` edits in CC's commit). | host `make check`; `git show --stat` = source only | serious | standing bar | open | | CC-attested; operator host re-run reconciles |

## What Worked

_(At slice close.)_

## Closure

Closed at commit `<SHA>` on `<date>`. Verified by: `<CDC session>`.
Rows: 9. Done: _. Deferred: _. No-op: _.
