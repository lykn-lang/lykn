# Slice 06: rust-resolution — Ledger

DD-60 D1 on Rust per DD-61: env + resolved-atom tags; emitter/codegen →
read-only consumers via `as_form_head()` (§A6 rows pinned at scoping).
Per LEDGER-DISCIPLINE. Rebuild-first. 6 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Resolver: env + tags on the classifier path.** `SExpr::Atom` carries `NameRes ∈ {Unresolved, BindingDef, BindingRef}`; reader always yields `Unresolved`; env extends via `binding::bindings_introduced` only (never re-derived), skipping `shadows_values() == false` kinds; scope exits restore; macro-introduced bindings participate (§A4) | unit tests: def/ref tags per binding kind; shadow ends at scope exit; nested scopes; label non-shadowing | serious | DD-61 §A1/§A3 | met | `make check` ✓ | tags never change emitted JS text; equality decision (tension #2) surfaced, not silent |
| F-2 | **Expander light binding-scan** — a lexically-bound head fires neither a user macro nor a pass2 desugar, in scope, on the macro-bearing path; scan consumes the walker | tests: `(macro when …)` + param `when` → plain call; param `car` → no desugar; out-of-scope use still expands | serious | DD-61 §A3; DD-60 D1 (incl. `import-macros`) | met | `make check` ✓ | verify the `has_macros` short-circuit leaves no no-macro exposure (tension #3) |
| F-3 | **The §A6 accessor swap** — `as_form_head() -> Option<&str>` (`#[must_use]`; `NameRes` `#[non_exhaustive]`; `None` for binding-refs) and **zero dispatch-purpose raw-head reads remain** across expander/classifier/emitter/codegen; `BindingRef` heads emit a plain call | review of the four subsystems' diffs + F-4's check; grep transcript in closing report | serious | DD-61 §A6 (pinned at scoping) | met | `make check` ✓ | privacy restructure is NOT this slice — operator phasing call 2026-07-06; follow-up slice numbered at creation |
| F-4 | **Rust-side static conformance check standing in `make check`** — dispatch-purpose `as_atom()` head reads outside sanctioned sites fail CI; seeded-violation demo | the test + demo transcript | serious | DD-61 §A6 + operator phasing call | met | `make check` ✓ | the A-7/coverage-test pattern applied to dispatch discipline |
| F-5 | **Matrix: Rust columns → DD-60 targets; no leaks** — every legal-ident binding×reference cell on Rust = `calls-binding`; reserved rows stay `rejects-cleanly`; **JS columns byte-identical** to the slice05 baseline; existing corpus outputs unchanged | re-probe diff vs slice05 baseline; `lykn test` corpus run | serious | arc A-4 footing | met | `make check` ✓ | any JS-column or corpus-output movement = leak = stop |
| F-6 | **Green bar** — `make check` ✓; suites ≥1401/0 + new tests; walker coverage + three-way parity green; `./bin/lykn` rebuilt before every probe | suite runs | serious | standing bar | met | `make check` ✓ | |

## What Worked / Closure

**Closed 2026-07-06 — all six rows met, `make check` green** (test-suite
1401/0, doc tests 475/0, clippy + fmt clean). See `closing-report.md` for the
per-row walk, the three tension resolutions (equality = tag-insensitive manual
`PartialEq`; §A6 privacy phased; `has_macros` short-circuit verified — no
no-macro exposure), the js-resolution hook notes, and the silent-drop diff
(Rust: 160 legal-ident cells → `calls-binding`, 22 `label` cells held by design;
JS + corpus byte-identical).

Key build facts: the resolver is a **dedicated pass** (`src/resolver.rs`) after
expand, not inside the shallow classifier (grounded §A3 deviation); scoping is
shared with the expander scan via `resolver::scope_plan`/`hoisted_names`; the
central `SExpr::atom()` constructor pre-stages the payload-privacy follow-up
slice. F-4 lives in `crates/lykn-lang/tests/a6_dispatch_conformance.rs`.
