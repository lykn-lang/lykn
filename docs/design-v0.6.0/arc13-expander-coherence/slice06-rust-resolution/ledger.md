# Slice 06: rust-resolution — Ledger

DD-60 D1 on Rust per DD-61: env + resolved-atom tags; emitter/codegen →
read-only consumers via `as_form_head()` (§A6 rows pinned at scoping).
Per LEDGER-DISCIPLINE. Rebuild-first. 6 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Resolver: env + tags on the classifier path.** `SExpr::Atom` carries `NameRes ∈ {Unresolved, BindingDef, BindingRef}`; reader always yields `Unresolved`; env extends via `binding::bindings_introduced` only (never re-derived), skipping `shadows_values() == false` kinds; scope exits restore; macro-introduced bindings participate (§A4) | unit tests: def/ref tags per binding kind; shadow ends at scope exit; nested scopes; label non-shadowing | serious | DD-61 §A1/§A3 | open | | tags never change emitted JS text; equality decision (tension #2) surfaced, not silent |
| F-2 | **Expander light binding-scan** — a lexically-bound head fires neither a user macro nor a pass2 desugar, in scope, on the macro-bearing path; scan consumes the walker | tests: `(macro when …)` + param `when` → plain call; param `car` → no desugar; out-of-scope use still expands | serious | DD-61 §A3; DD-60 D1 (incl. `import-macros`) | open | | verify the `has_macros` short-circuit leaves no no-macro exposure (tension #3) |
| F-3 | **The §A6 accessor swap** — `as_form_head() -> Option<&str>` (`#[must_use]`; `NameRes` `#[non_exhaustive]`; `None` for binding-refs) and **zero dispatch-purpose raw-head reads remain** across expander/classifier/emitter/codegen; `BindingRef` heads emit a plain call | review of the four subsystems' diffs + F-4's check; grep transcript in closing report | serious | DD-61 §A6 (pinned at scoping) | open | | privacy restructure is NOT this slice — operator phasing call 2026-07-06; follow-up slice numbered at creation |
| F-4 | **Rust-side static conformance check standing in `make check`** — dispatch-purpose `as_atom()` head reads outside sanctioned sites fail CI; seeded-violation demo | the test + demo transcript | serious | DD-61 §A6 + operator phasing call | open | | the A-7/coverage-test pattern applied to dispatch discipline |
| F-5 | **Matrix: Rust columns → DD-60 targets; no leaks** — every legal-ident binding×reference cell on Rust = `calls-binding`; reserved rows stay `rejects-cleanly`; **JS columns byte-identical** to the slice05 baseline; existing corpus outputs unchanged | re-probe diff vs slice05 baseline; `lykn test` corpus run | serious | arc A-4 footing | open | | any JS-column or corpus-output movement = leak = stop |
| F-6 | **Green bar** — `make check` ✓; suites ≥1401/0 + new tests; walker coverage + three-way parity green; `./bin/lykn` rebuilt before every probe | suite runs | serious | standing bar | open | | |

## What Worked / Closure

_(At slice close.)_
