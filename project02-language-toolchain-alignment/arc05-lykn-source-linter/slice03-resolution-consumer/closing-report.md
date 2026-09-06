# arc05 · slice03 — Closing Report (Linter resolution-consumer + context rules)

**By:** CC (Claude Code) · **Date:** 2026-07-21 · **Branch:** `release/0.6.x`
**Source commit:** `ea429e2` (source-only; docs are CDC's separate commit).
**Verdict: delivered.** `lykn lint` is now a resolution consumer — a
lexically-bound head is a call to the binding on every rule, exactly as the
compiler's dispatch sites behave — and the ID-12 shadowing rule rides arc13's
single scope model rather than a parallel decider. `make check` green; the
resolution-aware dogfood over the repo's `.lykn` sources is clean.

## Per-row ledger walk (9 rows in, 9 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **F-1** — resolve before dispatch; `atom_call` head via `as_form_head()` | **done** | `ea429e2` `lint/mod.rs` `lint_source` calls `resolver::resolve(&reader::read(...))` then walks the resolved tree; `lint/rules.rs` `atom_call` reads `head.as_form_head()` (`None` for a bound head) — the single funnel. `cargo test -p lykn-cli lint::` 53/0. |
| **F-2** — no head-matching rule fires on a bound head; unbound still fires | **done** | Resolution fixtures both directions: `resolution_no_require_bound_via_bind`, `resolution_parseint_bound_via_param`, `resolution_eval_bound_via_bind`, `resolution_isnan_bound_via_param`, `resolution_or_for_defaults_bound_via_bind`, `resolution_delete_bound_via_bind`, `resolution_new_wrappers_bound_via_bind`, `resolution_for_in_bound_via_bind`, `resolution_sort_bound_head_is_silent`, `resolution_import_relative_bound_head_is_silent_in_test_file`. **MUST-verify (item 4):** probed `resolve()` on pre-expansion input — a user-macro call head `(dbl 21)` stays `Unresolved` (lint still sees it), while a param-bound `dbl` ref tags `BindingRef` (lint silent). No post-expansion assumption breaks lint. |
| **F-3** — atom-position rules honour resolution | **done** | New `unresolved_atom` gate (`name_res() == Unresolved`) in `rules.rs`; `no-arguments`/`no-dirname-fixtures` use it. `resolution_no_arguments_bound_atom_is_silent`, `resolution_no_dirname_bound_atom_is_silent` (bound → silent; global → fires). |
| **F-4** — shadowing rule (ID-12), warn, at the inner def-site | **done** | `resolver::shadowing_sites` + the `Shadowing` lint rule (registered in `registry()`). `shadowing_flags_nested_shadow_at_inner_def_site` (1 warn at line 2, the inner `result`), `shadowing_flags_param_shadowing_enclosing_bind`. insta snapshots `lint_text_shadowing` / `lint_json_shadowing` (reviewed, accepted). |
| **F-5** — silent on form-shadowing (D1) and non-shadowing binds | **done** | `shadowing_silent_on_form_shadowing_d1` (`array`/`cell` params → silent), `shadowing_silent_on_non_shadowing_binds` (distinct binds + same-scope sibling rebind → silent). Resolver-level: `form_shadowing_is_not_a_shadow`, `sibling_rebind_is_not_enclosing_shadow`. |
| **F-6** — reuses the resolver's single scope model, no second decider | **done** | `shadowing_sites` lives in `resolver.rs` and consumes `scope_plan`/`hoisted_names`/`bindings_introduced` — the same deciders `resolve()` and the expander's `expand_children_scoped` use (route (b); see below). `lint/` contains **zero** scope-threading — it consumes precomputed def-site spans. `resolve_shadow_parity` pins the two walks to the same scope decisions. |
| **F-7** — arc13 A-6 closed: ID-42 re-answer (no rule) | **done** (disposition) | **No reserved/form-named-param lint rule added.** Rationale below. Dogfood surfaced **no** concrete case where silence is harmful. **CDC action:** record the DD-59 addendum + flip arc13 `closing-report.md` A-6 → done pointing here. |
| **F-8** — dogfood (arc05 A-5) | **done** | `./bin/lykn build` + `./bin/lykn lint test examples packages` over **118 `.lykn` files** → 2 findings, both benign (triage table below); **0 shadowing findings**, 0 resolution false-positives. |
| **F-9** — `make check` green; source-only diff | **done** (CC-attested) | `make check` ✓ (build + lint + fmt + Rust tests + JS/lykn suite + docs 475/0). `git show --stat ea429e2` = 3 source files + 2 snapshot files, no `docs/design-v0.6.0/**`. Operator host re-run reconciles. |

## Dogfood triage table (F-8)

Resolution-aware `lykn lint` over `test/`, `examples/`, `packages/**` (118
`.lykn` files):

| Rule | Site | Disposition |
|------|------|-------------|
| `prefer-surface-operators` | `test/surface/kernel-in-surface_test.lykn:211` (`=== this:items:length 0`) | **Benign — acknowledged.** The file's entire purpose is exercising kernel forms inside surface code; the `===` is intentional test material, not a defect. Suppression is slice04. |
| `prefer-surface-operators` | `test/surface/kernel-in-surface_test.lykn:216` (`=== len 0`) | **Benign — acknowledged.** Same fixture, same rationale. |

Everything else is clean. Notably the **new shadowing rule fired zero times**
across the whole repo (no accidental shadowing in-tree), and the
resolution-awareness introduced **zero false-positive regressions** — the two
findings are the same pre-existing `prefer-surface-operators` matches slice02
would have made.

## Route taken (F-6) and the ID-42 re-answer (F-7)

### F-6 — scope-model reuse: route (b), and why it isn't a second decider

The cc-prompt offered (a) consume the resolved tree's tags, or (b) expose a
minimal helper from `lykn-lang` that is the *same* scoping `resolver.rs` uses.
**Route (a) is insufficient**: `resolve()` tags each atom `BindingDef`/
`BindingRef`/`Unresolved`, but a `BindingDef` tag does not say whether that def
*shadows an enclosing binding* — recovering that needs a scope-threaded walk,
which the tags alone don't carry. So the shadow decision needs the scope model,
not just its output.

**Route (b), realized in `resolver.rs` as `pub fn shadowing_sites`.** The
decisive precedent: `scope_plan`/`hoisted_names` are *already* consumed by a
second traversal — the expander's `pass2.rs::expand_children_scoped` mirrors the
resolver's walk using those exact deciders ("mirroring the resolver so the
expander's light scan and the resolver's tagging agree"). This is the arc13 win
in practice: **one decider (`scope_plan`/`hoisted_names`/`bindings_introduced`),
many consumers (resolve-tagging, expand-gating, now shadow-detection).** It is
*not* the "N deciders diverge" failure — the body-vs-enclosing scope logic lives
in exactly one place; `shadowing_sites` only threads the stack around it, the
same mechanical scaffold `resolve_seq`/`resolve_split_at` and `expand_seq`/
`expand_children_scoped` already carry. `lint/` re-derives nothing: it calls
`shadowing_sites` and matches def-site spans. `resolve_shadow_parity` asserts
every shadow span is a def-site `resolve()` independently tags `BindingDef`.

The shadow definition, derived from the shared model: a binding shadows when its
name is already bound in an **enclosing** scope at the point it enters scope —
checked against `scope[..mark]` (ancestor frames only, never a same-sequence
sibling) for the enclosing-scoped kinds (`bind`/import/`func`|`class` names) at
their hoist point, and against the full enclosing scope for the body-scoped
kinds (params/loop/pattern/catch) as they open a deeper frame. Each binding is
checked in exactly one place, so the func-name-in-two-scopes quirk (a `Bind`
that is both hoisted and body-visible) can't double-report.

### F-7 — the ID-42 re-answer: no lint rule (closes arc13 A-6)

The original ID-42 question — *should the linter warn on reserved-word or
form-named parameters?* — is re-answered from arc13's fixed state:

- **Reserved-word binding positions are already D2 compile errors.**
  `binding::validate_reserved_names` rejects every reserved word at every
  derived binding position on both backends (the ID-44 genus is dead at the
  root). A lint warning would be redundant with — and weaker than — a compile
  error.
- **Form-named parameters legally shadow (DD-60 D1).** A param named `array`/
  `cell`/`parseInt` now genuinely shadows the form/global on both backends; the
  compiler emits a call to the binding. There is nothing to warn about — warning
  would contradict the semantics arc13 was run to establish.

**Disposition: no rule.** This is the operator steer — *"do the right thing
instead of warning broadly"* — vindicated by the fixed compiler. Dogfooding
surfaced no concrete case where the linter's silence on a param name is harmful.
The shadowing rule (F-4) covers the *one* param-name situation that remains
genuinely confusing — shadowing an **enclosing binding** (not a form) — which is
orthogonal to ID-42's reserved/form question.

**CDC action:** record this as a DD-59 addendum note and flip arc13
`closing-report.md` A-6 → `done` pointing at this report §F-7 and the slice-doc
§1/§4.

## Bubble-up to the arc (three questions)

**1. Did slice03 deliver its assigned piece of arc05?** Yes. The linter is now
semantically correct on true lexical scoping (the consequence arc13 was run to
enable): head-matching rules and the two atom-position rules all honour
resolution, the shadowing rule lands on the shared scope model, the ID-42
question is re-answered (closing arc13 A-6), and the dogfood is clean. arc05 A-5
(dogfood) is met; A-3 (this slice closed) pending CDC verification.

**2. What it revealed the arc-plan didn't anticipate:**

- **The shadowing rule needed a *new* `lykn-lang` export, not tag-consumption.**
  The arc-plan's route (a) (consume `BindingDef`/`BindingRef` tags) is not
  enough — the tags don't encode "shadows an enclosing binding." The clean
  answer was route (b) (`shadowing_sites` in `resolver.rs`), which the expander
  precedent made low-risk and unambiguous. Worth carrying: the resolver's
  *tags* answer "is this bound?"; a *shadow* question needs the resolver's
  *scope model*, exposed as a walk — a distinction slice04 should keep in mind
  if more scope-aware rules appear.
- **The `LintContext` ancestry API (`ancestors`/`source`/`parent()`) went
  unused.** slice01 disclosed it as forward-API "the shadowing rule will
  consume." The shadowing rule instead consumes the resolver's scope model
  (correctly — no second decider), so that ancestry API is now dead-code with no
  known consumer. **slice04 or a cleanup should decide: delete it, or keep it
  for a future rule that genuinely needs raw ancestry.** Flagged, not silently
  dropped. (Left in place this slice — removing it is out of scope and would
  touch the walk signature again.)
- **`prefer-surface-operators` in kernel-interop test files is dogfood noise.**
  The 2 findings are intentional `===` fixtures. This is exactly the case
  **slice04's suppression mechanism** is for — a per-file/per-line disable would
  silence them honestly. Concrete motivation for slice04, logged here.
- **The stale-`bin/lykn` guard bites `cargo test` directly.** Two pre-existing
  integration tests (`lyk_runner_kernel_only.rs`) fail under a bare `cargo test`
  when `bin/lykn` is older than `crates/` — the `lykn test` stale-binary guard
  fires with a different diagnostic than the tests assert. `make check`
  rebuilds first, so it's green; a direct `cargo test` needs
  `cargo build --release && cp target/release/lykn bin/lykn` first. Not a slice
  defect — the fourth costume of staleness trap #4, for the arc-plan's standing
  notes.

**3. Silent-drop diff (scope-as-specified vs delivered):** none. All 9 ledger
rows delivered as specified. The only scope *addition* is the `shadowing_sites`
export in `lykn-lang` (anticipated by the ledger's route (b) clause). The only
scope *subtraction* is that the arc-plan's route (a) (tag-consumption) was
rejected for the grounded reason above. No feature was quietly cut; slice04's
named-out items (suppression, `make lint` wiring, guide-09/15, P-11, arc close)
remain out and are reinforced by this slice's findings.

## Discipline notes

- **Source touched:** `crates/lykn-lang/src/resolver.rs` (+`shadowing_sites` and
  helpers, tests), `crates/lykn-cli/src/lint/{mod,rules}.rs` (resolve in the
  pipeline, `as_form_head` funnel, `unresolved_atom` gate, `Shadowing` rule,
  fixtures), + 2 insta snapshots. No guide/doc touched (docs are slice04). No
  safety-gate shortcuts.
- **Snapshots reviewed, never auto-accepted** — the text + JSON shadowing
  snapshots were read and confirmed intentional before accepting.
- Closing report untracked at hand-off per LEDGER-DISCIPLINE; the source landed
  as a green increment (`ea429e2`). CDC verifies, closes, and does the
  planning-doc + arc13 A-6 edits.
