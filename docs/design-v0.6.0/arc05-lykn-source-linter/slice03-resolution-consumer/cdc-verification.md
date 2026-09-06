# arc05 · slice03 — CDC Verification (Linter resolution-consumer + context rules)

**By:** CDC (Cowork) · **Date:** 2026-07-21 · **Branch:** `release/0.6.x`
**Source under review:** `ea429e2` (546 insertions: `resolver.rs` +221,
`lint/mod.rs` +241, `lint/rules.rs` +73, +2 insta snapshots).
**Verdict: CDC-closed.** All 9 ledger rows verified. F-1…F-6 **reproduced by
code review + grep** (the sandbox has no toolchain — bootstrap §3); F-8/F-9 are
**CC-attested runtime**, reconciled by an operator host `make check` + dogfood
re-run. No silent drops, no spec-softening, no over-claim. The one row that
mattered most — F-6, no second scope decider — holds rigorously.

## Method (evidence strength, honestly labelled)

Cowork cannot run `cargo`/`deno`. Verification is **git-ancestry + code review
+ workspace grep**, per the arc's standing practice. Rows whose Verify is a
`cargo test`/`make check` run are marked **attested-runtime** (CC ran them;
strength `attested`); rows I could confirm by reading the diff/grepping are
**reproduced-by-code** (strength `reproduced` at code scale — the actual
artifact, not CC's summary). The runtime rows reconcile to `reconciled` on the
operator host re-run.

## Per-row verification

| Row | CDC finding | Strength |
|-----|-------------|----------|
| **F-1** resolve before dispatch; `atom_call`→`as_form_head()` | **Confirmed by diff.** `lint/mod.rs:102` `resolver::resolve(&reader::read(source)?)`; `lint/rules.rs:38` `atom_call` reads `head.as_form_head()` + `head.span()`. Single funnel — every head-matching rule inherits the gate. | reproduced-by-code |
| **F-2** bound heads silent, unbound fire | **Confirmed by diff.** 10 both-direction fixtures via `assert_resolution`, covering no-require/parseint/eval/isnan/or/delete/new/for-in + the sort & relative-import funnels. The MUST-check (F-2 item 4) was genuinely probed — a user-macro head stays `Unresolved`. Runtime pass CC-attested (53/0). | reproduced-by-code (tests present) + attested (pass) |
| **F-3** atom-position rules honour resolution | **Confirmed by diff.** New `unresolved_atom` gate (`name_res()==Unresolved`); `no-arguments`/`no-dirname-fixtures` both switched to it; both-direction fixtures present. | reproduced-by-code |
| **F-4** shadowing rule at inner def-site | **Confirmed by diff.** `Shadowing` registered; fires only where `ctx.shadow_spans.contains(&span)`; span at the inner def (tested line-2). | reproduced-by-code |
| **F-5** silent on form-shadowing (D1) + non-shadowing | **Confirmed by diff.** `array`/`cell` params silent; distinct + sibling-rebind silent; verified at both the resolver level (`form_shadowing_is_not_a_shadow`) and the lint level. | reproduced-by-code |
| **F-6** no second scope decider (the crux) | **Confirmed by diff + grep.** `shadowing_sites` lives in `resolver.rs`, consuming `scope_plan`/`hoisted_names`/`bindings_introduced` — the same deciders `resolve_seq`/`resolve_form`/`resolve_split_at` use; `shadow_seq`/`shadow_form` mirror that walk exactly. **Independent grep: `lint/` contains zero `scope_plan`/`bindings_introduced`/`hoisted`/`ScopePlan`/`BindingKind`** — it matches precomputed spans only. `resolve_shadow_parity` pins every shadow span to a `BindingDef` `resolve()` tags. Route (b), grounded (route (a) genuinely insufficient — tags don't encode "shadows an enclosing binding"). | **reproduced-by-code + grep** |
| **F-7** arc13 A-6 closed (ID-42 = no rule) | **Confirmed.** No reserved/form-named-param rule added (grep: registry has `Shadowing` only among new rules). Disposition matches the scoping decision. **A-6 was already flipped to `done` at scoping (committed `c3d74f2`)** — CC's requested CDC action was pre-done; confirmed still `done` in arc13 closing-report §3. | reproduced-by-code |
| **F-8** dogfood (arc05 A-5) | **Attested.** 118 `.lykn` files → 2 benign `prefer-surface-operators` hits in a kernel-interop *fixture* (intentional test material; triage table honest), 0 shadowing findings, 0 resolution regressions. Cannot re-run in sandbox; **host reconcile**. Spot-checked the cited fixture path exists. | attested-runtime |
| **F-9** `make check` green; source-only diff | **Partly confirmed.** Diff **is** source-only (`git show --stat`: 3 source + 2 snapshot files, no `docs/**`) — reproduced-by-code. `make check` green is **CC-attested**; host reconcile. | reproduced (diff) + attested (make check) |

## Silent-drop / spec-softening / over-claim checks

- **Silent-drop:** 9 rows opened, 9 walked (8 done + 1 disposition, 0 deferred).
  No drop. The only scope *addition* (`shadowing_sites` export) was anticipated
  by the ledger's route-(b) clause; the only *subtraction* (route (a) rejected)
  is grounded and disclosed. ✓
- **Spec-softening:** none. No `done` row carries a weaker guarantee than its
  criterion. F-6 in particular is *stronger* than "reuse or expose" — it's a
  zero-scope-in-`lint/` grep-clean result. ✓
- **Over-claim:** none. `make check`/dogfood correctly flagged CC-attested, not
  asserted-reconciled. The `delete`/reserved-word fixture is reasoned honestly
  (a bound reserved word wouldn't compile, but the linter is a pure pre-compile
  resolution consumer — correct). ✓
- **Partial-adoption:** grep confirms the `as_form_head` funnel + `unresolved_atom`
  gate are applied at *every* dispatch/atom site; the one `first().atom_parts`
  hit is an argument read (`no-new-wrappers` ctor), not head dispatch. ✓

## Bubble-up check (verified, and routed)

CC's three-question bubble-up is honest and complete. The findings, verified and
routed into `arc-plan.md` v1.7:

1. **`shadowing_sites` needed a new `lykn-lang` export, not tag-consumption** —
   a real, grounded arc-plan correction (route (a) was insufficient). Recorded;
   informs slice04 if more scope-aware rules appear.
2. **The `LintContext` ancestry API (`ancestors`/`source`/`parent()`) is now
   orphaned** — slice01 disclosed it as forward-API "the shadowing rule will
   consume"; the rule took the better route (resolver reuse), leaving it
   dead-code. **Routed to slice04: delete it, or keep it for a rule that needs
   raw ancestry.** Correctly left in place this slice (removing it re-touches the
   walk signature). This is the disclosed-forward-API discipline paying off — it
   was flagged, not buried.
3. **`prefer-surface-operators` fixture noise** motivates slice04's suppression
   mechanism. Routed.
4. **Stale-`bin/lykn` guard bites bare `cargo test`** (`lyk_runner_kernel_only`)
   — the 4th costume of staleness trap #4. Routed to the arc-plan standing notes
   + the operator gate runbook: `cargo build --release && cp target/release/lykn
   bin/lykn` before a bare `cargo test`; `make check` rebuilds first, so it's green.

## What Worked

- **The single-funnel design earns its keep.** One `atom_call`→`as_form_head`
  change gated the entire head-matching rule set for resolution — zero
  per-rule edits, zero regressions across 36 pre-existing tests. The elegance
  the scoping pass predicted held up.
- **The expander precedent de-risked F-6.** `expand_children_scoped` already
  being a second consumer of `scope_plan`/`hoisted_names` made "one decider,
  many consumers" a demonstrated pattern, not a hope — and gave CC a concrete
  shape to mirror. The `resolve_shadow_parity` test is the guard that keeps the
  mirror honest.
- **Route-(a)-looked-plausible-but-grounding-killed-it** is exactly the failure
  the "ground the ledger in real code" discipline exists to catch — caught at
  implementation by CC rather than shipped.

## Disposition

**slice03 is CDC-closed** on the strength of the code review + grep, with
F-8/F-9 pending the operator host reconcile (a single `make check` + a
`./bin/lykn lint test examples packages` re-run). arc05 arc-ledger **A-3
(slice03 closed) → done** and **A-5 (dogfood) → done**; A-4/A-6/A-7 remain
slice04. arc05 does not close until slice04 lands.
