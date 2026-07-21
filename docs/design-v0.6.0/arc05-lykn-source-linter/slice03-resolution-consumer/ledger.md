# arc05 · slice03 — Ledger (Linter resolution-consumer + context rules)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Rows are
grep/test-verifiable acceptance criteria. `done` requires evidence at
`reproduced` strength at slice scale; sandbox runtime rows are CC-attested
and reconciled by an operator host re-run (bootstrap §3, §9).

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | The lint pipeline resolves before rule dispatch: `lint_source` runs `resolver::resolve` over the reader forms, and the shared head accessor `atom_call` returns the head **only for unresolved atoms** (via `as_form_head()`), `None` for a bound head. | read `lint/mod.rs` + `lint/rules.rs`: `resolver::resolve` in the pipeline; `atom_call` uses `as_form_head()` not `atom_parts()` for the head | serious | arc13 A-6 / DD-61 §A6 | **done** | `ea429e2` — `lint_source` resolves then walks the resolved tree; `atom_call` reads `head.as_form_head()`. lint 53/0 | the single funnel — gates all head-matching rules at once |
| F-2 | No head-matching rule fires on a **lexically-bound head**. A fixture per trigger class (`(bind require 0)(require x)`; `(func f :args (:any parseInt) :body (parseInt s))`; a bound `sort`/`eval`/`isNaN`/`or`/`delete`/`new`/`for-in`/`import`) lints **silent**; the same head **unbound** still fires. | `cargo test -p lykn-cli lint::` resolution fixtures, both directions | serious | DD-61 §A6 | **done** | `ea429e2` — 10 `resolution_*` fixtures both directions. **MUST-verify done:** probed `resolve()` pre-expansion — user-macro head stays Unresolved, binders tag refs (closing-report F-2) | the false-positive class the slice exists to kill |
| F-3 | The two **atom-position** rules honour resolution: `no-arguments` and `no-dirname-fixtures` do not fire on a bound atom of that name (a `bind`/param named `arguments`). | fixture: `(func f :args (:any arguments) :body arguments)` → silent; bare `arguments` → fires | correctness | DD-61 §A6 | **done** | `ea429e2` — new `unresolved_atom` gate (`name_res()==Unresolved`); `resolution_no_arguments_bound_atom_is_silent`, `resolution_no_dirname_bound_atom_is_silent` | atom rules read `atom_parts`, not `atom_call` — separate check |
| F-4 | **shadowing rule (ID-12), warn** — a lexical binding whose name is already bound in an **enclosing lexical scope** is flagged (e.g. inner `func`/`fn` param `x` inside an outer binder of `x`; a `bind x` inside a scope already binding `x`). | `cargo test` shadowing fixtures: nested shadow → 1 warn at the inner def span; sibling non-shadow → silent | correctness | arc-plan A-3 / DD-59 Q6 | **done** | `ea429e2` — `resolver::shadowing_sites` + `Shadowing` rule (registered); `shadowing_flags_nested_shadow_at_inner_def_site` (1 warn, inner span); insta text+JSON snapshots | span points at the shadowing def-site |
| F-5 | The shadowing rule is **silent on form-shadowing** (a param named `array`/`cell` shadowing a built-in form — legal by DD-60 D1) and on plain non-shadowing binds. | fixture: `(func f :args (:any array) :body (array 1))` → silent; `(bind x 1)(bind y 2)` → silent | correctness | DD-60 D1 | **done** | `ea429e2` — `shadowing_silent_on_form_shadowing_d1` (`array`/`cell`), `shadowing_silent_on_non_shadowing_binds` (distinct + sibling-rebind) | D1 made form-shadowing correct — must not warn on it |
| F-6 | The shadowing rule reuses the resolver's **single** scope model — no second/divergent scope decider. | grep: shadowing rule consumes `resolver`/`binding` scoping (resolved tags or an exposed `resolver` helper); **no** re-implemented body-vs-enclosing scope logic in `lint/` | serious | arc13 lesson (N deciders diverge) | **done** | `ea429e2` — `shadowing_sites` in `resolver.rs` reuses `scope_plan`/`hoisted_names`/`bindings_introduced` (the expander's own deciders); `lint/` has zero scope-threading; `resolve_shadow_parity` pins the two walks. Route (b), rationale in closing-report | if a helper must be exposed from `lykn-lang`, it is the *same* one `resolver.rs` uses |
| F-7 | **arc13 A-6 closed** — the ID-42 (`fn`/form/reserved param-name) lint question is re-answered from the fixed state, in writing, with rationale: reserved words → D2 compile errors (no lint); form-named params → D1 legal shadow (no error); **disposition: no lint rule**. | this slice-doc §1/§4 + a DD-59 addendum note; arc13 `closing-report.md` A-6 row flipped to `done` with a pointer here | serious | arc13 A-6 (hands off by design) | **done** (disposition) | **No rule added.** Rationale: closing-report §F-7. Dogfood found no harm in silence. **CDC:** record DD-59 addendum + flip arc13 A-6 → done | closing A-6 *is* writing this re-answer (its own Verify) |
| F-8 | **Dogfood (arc05 A-5)** — resolution-aware `lykn lint` over `test/`, `examples/`, `packages/**` `.lykn`: zero findings, or every finding fixed or acknowledged in a triage table with rationale. | host: `./bin/lykn build` then `./bin/lykn lint <trees>`; triage table in the closing report | serious | arc-plan A-5 | **done** | `./bin/lykn lint test examples packages` over 118 `.lykn` → 2 benign `prefer-surface-operators` (kernel-interop fixtures, triaged); 0 shadowing, 0 false-positives | resolution-awareness changes the finding set vs slice02's dogfood — re-run, don't reuse |
| F-9 | `make check` green; new lint tests pass; **diff is source-only** (no `docs/design-v0.6.0/**` edits in CC's commit). | host `make check`; `git show --stat` = source only | serious | standing bar | **done** (CC-attested) | `make check` ✓ (docs 475/0); `git show --stat ea429e2` = 3 source + 2 snapshot files, no docs | CC-attested; operator host re-run reconciles |

## What Worked

- **The expander precedent settled the F-6 route in one grep.** `scope_plan`/
  `hoisted_names` were already a shared decider with a second traversal consumer
  (the expander) — so `shadowing_sites` as a third consumer is the sanctioned
  "one decider, many consumers" shape, not the "N deciders diverge" failure.
  Grounding beat guessing: route (a) (tag-consumption) looked plausible but the
  tags don't encode "shadows an enclosing binding," so it couldn't work.
- **Resolution-awareness was a zero-regression change.** All 36 pre-existing
  lint tests stayed green after the `as_form_head` funnel + `unresolved_atom`
  gate; the dogfood surfaced no new false positives. The single-funnel design
  (one `atom_call` accessor) gated every head-matching rule at once.
- **The probe caught the pre-expansion question the ledger flagged (F-2 item
  4):** `resolve()` is structural and leaves user-macro heads `Unresolved`, so
  lint still sees them — verified before wiring, not assumed.

## Closure

Closed at commit `ea429e2` on 2026-07-21 (CC-attested; operator host re-run +
CDC verification reconcile). Rows: 9. Done: 8. Disposition (no-op by design): 1
(F-7 — no rule). Deferred: 0.

**CDC verification (2026-07-21).** Independently verified against `ea429e2` by
code-review + workspace grep (Cowork has no toolchain). F-1…F-6
**reproduced-by-code** (the `as_form_head` funnel, the `unresolved_atom` gate,
`resolver::shadowing_sites`, and — grep-confirmed — zero scope re-derivation in
`lint/`); F-8/F-9 **CC-attested runtime**, reconcile on the operator host re-run
(`make check` + `./bin/lykn lint test examples packages`). No silent drop, no
spec-softening, no over-claim. **slice03 CDC-closed.** See `cdc-verification.md`.
Verified by: CDC (Cowork).

