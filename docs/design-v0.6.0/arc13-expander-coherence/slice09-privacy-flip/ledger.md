# Slice 09: privacy-flip — Ledger

Step two of the privacy pair: `Atom(AtomData)`, fields private — the
§A6 by-construction layer. **Depends on: slice08 closed (its F-5 zero-
pattern gate is this slice's precondition — re-run the grep first).**
Per LEDGER-DISCIPLINE. Rebuild-first. 5 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Precondition re-verified** — slice08's completion grep re-run against this slice's start tree: zero field-naming `Atom {` patterns outside `ast/sexpr.rs` | the grep transcript | correctness | slice08 F-5 | met | `make check` ✓ | if non-zero: stop, that's a slice08 gap — surface it |
| F-2 | **The restructure** — `Atom(AtomData)`; `struct AtomData { value, span, binding }` private to `ast::sexpr`; `SExpr::atom()` + all accessors + manual tag-insensitive `PartialEq` + `Display`/`Debug` re-targeted in-module; field-free matches updated (`Atom(_)`); `SExpr` size measured + reported (boxing = surfaced option if regressed, not folded) | unit tests green; size figure in closing report | serious | slice07 F-3 Option A (recommended, confirmed by packaging call) | met | `make check` ✓ | equality carries over unchanged — no re-decision (recon F-3) |
| F-3 | **Privacy holds by construction** — a seeded field-naming pattern outside the module fails to compile (E0616-class); demo transcript; both crates checked (a `lykn-cli` seed too — the cross-crate reach was the recon's lead finding) | seeded compile-fail demos, both crates | serious | DD-61 §A6 (the by-construction layer) | met | `make check` ✓ | one construction door (`SExpr::atom()`), one dispatch door (`as_form_head()`) |
| F-4 | **§A6 end state as decided** — `as_atom()` public, unrenamed; the slice06 A6 static check green and load-bearing; accessor doc comments still true post-restructure | check run + doc review | correctness | operator decision 2026-07-07 | met | `make check` ✓ | CDC records the DD-61 as-built note at close |
| F-5 | **Green bar** — `make check` ✓ both crates + umbrella; suite counts unchanged (≥1401/0, docs 475/0); corpus + matrix untouched; `./bin/lykn` rebuilt for any probe | suite runs | serious | standing bar | met | `make check` ✓ | |

## What Worked / Closure

**Closed 2026-07-07 — all five rows met, `make check` green, behaviour
byte-identical** (test-suite 1401/0, doc tests 475/0; `lykn-lang` 1136/0).
`SExpr::Atom` is now `Atom(AtomData)` with private fields; privacy proven by
compile-fail (E0451) in **both** crates. `size_of::<SExpr>()` 48→48 (no
boxing). **The flip touched only `ast/sexpr.rs`** — the slice-doc's ~42
field-free `Atom { .. }` → `Atom(_)` conversions proved *unnecessary* (Rust's
`{ .. }` rest-pattern is valid on tuple variants), kept minimal per "small and
atomic". See `closing-report.md` for the DD-61 §A6 as-built (Rust three layers
= **visibility + static check + corpus**), the `{ .. }`-on-tuple finding, and
the equality-carries-over confirmation. Source-only commit.
