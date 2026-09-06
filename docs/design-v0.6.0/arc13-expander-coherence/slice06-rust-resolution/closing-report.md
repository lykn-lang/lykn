# Slice 06: rust-resolution — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-07-06 · **Branch:** `release/0.6.x`
**Verdict: delivered — one resolver on the Rust pipeline; the Rust matrix
columns meet their DD-60 targets, JS + corpus byte-identical, `make check`
green.** DD-60 D1 now holds on Rust: every legal-identifier name the user
lexically binds *means the binding* in every binding position and every
reference position — surface forms, kernel heads, user macros, and built-in
desugars all shadowed — with the one principled exception that labels do not
shadow values (DD-60 D1 does not apply to the label namespace).

## Architecture as built (grounded)

`read → expand → **resolve** → classify → analyze → emit → codegen`

- **The resolver is a dedicated pass** (`crates/lykn-lang/src/resolver.rs`),
  inserted after expansion and before classification, tagging every atom with
  `NameRes ∈ {Unresolved, BindingDef, BindingRef}`. DD-61 §A3 nominates the
  *classifier* as the env host; on this backend classification is **shallow per
  form** (the emitter drives the recursive walk), so hosting the env there would
  have meant threading scope through an emitter-driven recursion. A standalone
  pass over the `SExpr` tree is the same "resolve once, consume everywhere"
  contract, factored cleanly, and the tag rides the atom by value into every
  downstream consumer. **Surfaced deviation from §A3's letter — same substance.**
- **The expander keeps its own light binding-scan** (DD-61 §A3): it runs
  *before* the resolver, so it cannot read tags — it carries a scope set built
  from the shared walker and gates desugar + user-macro dispatch directly.
- **Scoping lives in one place.** `resolver::scope_plan` / `hoisted_names` are
  the single source of scoping truth, consumed by both the resolver (tagging)
  and the expander's scan (dispatch gating), so the two can never diverge.

## Per-row walk (6 rows)

**F-1 — resolver: env + tags on the classifier path — MET.** `SExpr::Atom`
gained `binding: NameRes` (`#[non_exhaustive]`, `Default = Unresolved`); the
reader always yields `Unresolved` via the new central `SExpr::atom(value, span)`
constructor (the §A4 invariant in one place — and step 1 of the phased
atom-payload-privacy slice, pre-done per the CDC recommendation). The resolver
extends the value env only from `binding::bindings_introduced` (never
re-derived), skipping `shadows_values() == false` (labels), tagging def-sites
and refs. **Tags never change emitted JS text** — verified: wiring the resolver
in with no consumer swap left every suite byte-identical. 15 resolver unit tests
cover def/ref tags per binding kind, scope exit, nested scopes, label
non-shadowing, and the initializer-outside-scope guarantee.

**F-2 — expander light binding-scan — MET.** `pass2::expand_all`/`expand_expr`
thread a scope set; a lexically bound head fires neither `try_desugar` nor a
user macro. 4 integration tests (`binding_scan_shadows_macros.rs`) pin: bound
`when` (user macro) → plain call; bound `car` (desugar) → plain call;
out-of-scope use still expands; a `bind` shadows a *following* sibling's
desugar. **Tension #3 verified (not assumed) — see below.**

**F-3 — the §A6 accessor swap — MET.** `SExpr::as_form_head() -> Option<&str>`
(`#[must_use]`; `None` for any non-`Unresolved` atom). Every **dispatch-purpose**
head read across the three post-resolution consumers now goes through it;
`BindingRef` heads take the **plain call** path (`array(987)`, not the
parenthesized computed-callee shape). Grounded sites converted:
- **Classifier** — `classify_form{,_strict,_kernel_only}` head dispatch;
  `classify_export`/`classify_async` inner-form dispatch.
- **Emitter** — `emit_expr` main dispatch; `FunctionCall` emit
  (`assign`/`js:` gates); `is_statement_form`, `is_valueless_last_expr`, the
  yield-instrumentation head, and the literal-type inferencer.
- **Codegen** — `emit_list` (`match head`, with a new atom-vs-non-atom split so
  a bound head is a plain call); `emit_statement` (`is_statement_form` /
  `is_async_declaration` / needs-parens); the arrow/`emit_stmt_or_block`
  body-block detection.

The raw `as_atom()` survives for **non-dispatch** uses only — spans, rendering,
argument reads, and the *structural grammar* reads (destructuring-pattern
markers, param defaults, `spread`/`template`/`alias`/`names` markers,
declaration keywords in for-init/loop position, `try`-clause markers, and
class-member *names*). Those must stay `as_atom`: they read a literal grammar
marker that has its own namespace and **must not** flip when a value binding
happens to shadow the marker name (converting them would be a bug). Each is
sanctioned with an `A6-exempt` marker (F-4).

**F-4 — Rust-side static conformance check — MET.**
`tests/a6_dispatch_conformance.rs` scans the three consumers for **form-head**
`as_atom()` reads (`values[0].as_atom()` / `values.first().…as_atom()`) and
fails unless each is `as_form_head()` or `A6-exempt`-marked. Runs in
`make check` (it is a `cargo test`). **Seeded-violation demo:** inserting
`values[0].as_atom() == Some("block")` into `emit_list` fails the check
(`emit.rs:227`); removed → green. (The Rust analogue of DD-61 §A6's JS
`.value ===` grep; the by-construction privacy upgrade is the follow-up
payload-restructure slice.)

**F-5 — matrix: Rust columns → DD-60 targets; no leaks — MET.**
- **Rust legal-ident cells → `calls-binding`.** `macro-fires` fell 182 → 22 on
  Rust; the **22 residual are exactly the `label` binding position** across the
  form-named legal idents — the correct DD-60 behaviour (labels do not shadow
  values; `Label.shadows_values() == false`, slice05), **not a leak.**
- **Reserved rows → `rejects-cleanly`** (`✗throw` both backends, D2 intact).
- **JS columns byte-identical to the slice05 baseline** — guaranteed by
  construction: no `packages/**` (JS) source was touched (`git status packages/`
  empty). The JS tally is unchanged (calls-binding 323 / macro 120 / throws
  1453 / invalid 51).
- **Corpus outputs unchanged** — the full `.lykn` cross-compiler corpus is
  **1401 / 0** (`make test-suite`). No JS-column or corpus movement.
- The 66 `invalid-output` cells are entirely the `kernel-prefixed` class
  (`kernel:const`, `kernel:if`) — documented unbindable (DD-60 edge case 4),
  unchanged.

**F-6 — green bar — MET.** `make check` ✓ (build + lint + test): clippy clean,
`cargo fmt --check` clean, Rust tests green (incl. the new resolver units, F-2
integration, F-4 check), **test-suite 1401 / 0**, doc tests 475 / 0. Three-way
reserved-word parity green. `./bin/lykn` rebuilt before every probe (the
PATH-binary trap bit twice mid-slice — the stale-binary guard fired on the
`lyk_runner` integration tests until `bin/lykn` was refreshed).

## The three named design tensions — resolved

1. **§A6 privacy is phased.** Delivered as planned: the accessor +
   `#[must_use]` + `#[non_exhaustive]` `NameRes` + the F-4 standing check land
   now; the by-construction private-field payload restructure is the follow-up
   slice. The three-layer story holds today, check-enforced.
2. **Equality — DECIDED: tag-insensitive manual `PartialEq`.** The `binding`
   tag is dispatch metadata, not structural identity. A hand-written
   `impl PartialEq for SExpr` compares every field *except* `binding` (span
   included, exactly as the former derive) — so every pre-existing `SExpr`
   comparison (tests, macro fixed-point cache keys, corpus diffs) is stable
   whether or not the resolver has run. This is why F-1 could land inert
   (byte-identical) before F-3 activated consumption. Rationale recorded in
   `ast/sexpr.rs`.
3. **The `has_macros` short-circuit — VERIFIED, no exposure.** `expander::expand`
   returns forms unchanged when no `macro`/`import-macros` is present, so `pass2`
   (and its light scan) only runs on macro-bearing files. **Finding:** on the
   no-macro path the expander is a *no-op* — desugars (`car`/`cdr`/…) and user
   macros do not run there at all (confirmed empirically: `(car #a(1 2 3))` in a
   macro-free file compiles to `car([1,2,3])`, a plain call, never `[1,2,3][0]`).
   So the no-macro path has **no expander-level shadowing exposure**; the
   surface-form / kernel-head shadowing on that path is handled by the resolver
   + F-3, which run **unconditionally** (in `compile.rs`, not gated by
   `has_macros`). The scan's job is strictly the macro-bearing path (desugars +
   user macros, consumed before the resolver can see them).

## Bubble-up to arc13 — hook notes for js-resolution (next slice)

- **Mirror the per-form scoping split, not just the flat walker.** The resolver
  learned (against the matrix's own shapes) that a binding is **not** in scope
  over an initializer / iterable / `match`-subject / `if-let` scrutinee /
  `bind`-value — those are evaluated before the binding exists. A naive
  "push the binding over the whole form subtree" **miscompiles** the iterable
  (`(for-of array #a(1) …)` → `array(1)` instead of `[1]`). The JS slice must
  reproduce `scope_plan`'s regions: `for-*` body starts after the iterable;
  `if-let`/`when-let`/`match` bodies after the scrutinee; `bind` and the kernel
  declaration escapes scope over *following siblings only* (not their own value);
  `func`/`class` names scope over their own body (recursion) **and** siblings.
- **Where the env lives is the asymmetry.** JS resolves *inside* the
  `expandExpr` walk (§A3) — one resolver, tags consumed by `compiler.js` via
  `formHead(node)`. Rust hosts a **separate** resolver pass (classification is
  shallow) **and** a separate expander light-scan. So on Rust the "scan" and the
  "tagger" are two consumers of one `scope_plan`; on JS they can be the same
  walk. The D2-timing note from slice03 still applies: JS's throws-from-the-
  binding-site rows are fixed the moment binding-position atoms stop dispatching
  (`formHead` → null on defs) — this is the JS analogue of `as_form_head`
  returning `None` for `BindingDef`.
- **Label semantics must match.** Both backends currently show `macro-fires` at
  the `label` binding position for form-named legal idents (byte-identical). The
  JS slice should keep it: labels are their own namespace and do **not** shadow
  values. Do *not* "fix" the label column to `calls-binding` — that would be a
  DD-60 D1 violation. (If the operator wants the matrix's per-cell target table
  amended to state the label exception explicitly, that is a DD-60 refinement,
  not a code change.)
- **F-4 has a JS twin already specified** — DD-61 §A6's `packages/lang`
  `.value ===` grep. The Rust check's shape (form-head reads must use the
  resolution-aware accessor or be `A6-exempt`) is the pattern to copy.

## Silent-drop diff (what moved, what didn't)

- **Rust, moved (all improvements toward DD-60):** 160 legal-ident
  binding×reference cells flipped `macro-fires`/`throws` → `calls-binding`
  (surface forms: `fn`/`func`/`cell`/`not`/`express`/…; kernel heads:
  `array`/`assign`/`async`/`await`/`block`/`get`/`yield`). Plus the below-matrix
  wins F-2 pins: bound user macros and bound desugars now call the binding.
- **Rust, deliberately not moved:** the 22 `label` cells (D1 exception) and the
  66 `kernel-prefixed` cells (unbindable). Reserved-word rows stay
  `rejects-cleanly`.
- **JS + corpus: nothing moved.** JS columns byte-identical (no JS source
  touched); corpus parity 1401 / 0.

## Findings surfaced (not folded)

1. **Self-reference-in-initializer is intentionally *not* shadowed for
   `bind`/kernel decls.** The clean model routes declaration escapes to the
   `Sequence` plan, so `(bind array (array 1 2))` keeps the RHS `array` the array
   *form* (name in scope for *following* code, not its own value). `func`/`class`
   names *are* in their own body (recursion). This avoids a TDZ-shaped behaviour
   change and matches how a reader expects a declaration to scope. Blast radius:
   0 (corpus unchanged).
2. **Conservative over-approximation for multi-clause `func` params and `class`
   method params.** They are pushed over the whole form subtree, so a param of
   method `m` is (harmlessly) in scope inside method `m2`. Precise per-clause /
   per-method scoping would need structural knowledge the flat walker does not
   surface. Blast radius: 0 (would require a param name colliding with a form
   *and* used as a head in a sibling clause/method — none in-tree; corpus
   confirms). Recorded as a known simplification; the matrix's whole-scope
   shadowing (DD-60 sub-question #1, "whole-scope") is satisfied.
3. **The central `SExpr::atom()` constructor** was adopted (operator-aware CDC
   recommendation): it centralizes the §A4 "reader → Unresolved" invariant and
   pre-does step 1 of the phased atom-payload-privacy slice, so that follow-up
   becomes a field-visibility change rather than a 250-site sweep.

## Discipline notes

- Source only touched; the closing report + ledger/status live under
  `docs/design-v0.6.0/**` (CDC's tree). No `--allow-dirty`-class shortcuts; no
  byte-offset scripting (every mechanical sweep was an exact-string regex,
  dry-run and diff-inspected before applying, per the outgoing session's crash
  lesson).
- `./bin/lykn` rebuilt before every matrix/probe run.
