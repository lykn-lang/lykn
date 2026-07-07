# Slice 07: atom-privacy-recon

> **Recon-only — the investigation pass for the §A6 by-construction
> layer** (the operator phasing call, 2026-07-06, plus the same-day
> central-constructor discussion). The atom-payload-privacy restructure
> decomposes into (1) centralize `SExpr::Atom` construction and (2) make
> the payload's fields private + convert every pattern/field-read site to
> accessors. slice06 *may* land (1) as its vehicle for the `binding`
> field — this recon measures whichever world slice06 leaves behind and
> produces the implementation slice's ground truth. **No compiler
> changes** (the slice01 pattern: recon closes on an empty diff).
> **Depends on: slice06 closed** — the census target is the post-slice06
> tree, not the one moving under CC today.

## Goal

The implementation slice (*atom-payload-privacy*, numbered at creation
once this closes) gets scoped against evidence instead of estimates: a
complete construction-site and pattern-site census, a design proposal
with options for the operator, and an LoE + sizing judgment (one slice or
two, by the fits-one-context test). The arc has been burned once by
under-scoped recon (slice02's four-subsystem self-stop); this slice is
the countermeasure applied *before* the biggest mechanical churn in the
arc.

## Why a recon slice at all

Privacy on the Atom payload breaks two different site classes with
different remedies:

- **Construction literals** (`SExpr::Atom { value, span, … }`) — break
  at (1). Pre-slice06 count: ~259 in `crates/`, an unknown share behind
  local helpers (the emitter's `atom(…)`, test-module `fn atom(name)`
  helpers in expander/pass2 and others). If slice06 lands the central
  constructor, most of this class is already done.
- **Pattern/field reads** (`SExpr::Atom { value, .. }` destructuring,
  `if let`, nested patterns) — break at (2), because private fields
  cannot be destructured outside the defining module (`ast::sexpr`), and
  classifier/emitter/expander/codegen are sibling modules. These need
  accessor conversion (`as_atom()`, `span()`, `as_form_head()`, or a new
  accessor the census identifies), and some sit inside complex nested
  patterns where the rewrite is not one-line-mechanical.

Nobody has counted the second class. That count — and the shape of its
worst sites — is what decides whether the implementation is one slice or
two.

## Scope (in)

1. **F-1** — construction-site census (post-slice06): every
   `SExpr::Atom` literal, classified central-constructor / local-helper /
   bare, per module, with citations; the local-helper consolidation
   recommendation.
2. **F-2** — pattern-site census: every destructuring/field-read site,
   classified by fields read, purpose (dispatch — should already be
   `as_form_head()` post-slice06 — vs. span/render/argument/test), the
   accessor each needs, and a flagged list of the non-mechanical sites
   (nested patterns, multi-field reads, guard positions).
3. **F-3** — design proposal, options surfaced for the operator (not
   decided): payload shape (`Atom(AtomData)` tuple variant vs.
   alternatives), accessor API, `Display`/`Debug`/`PartialEq` handling
   (incl. whether the slice06 equality decision carries over cleanly),
   span story, and the migration order. Plus LoE and the sizing
   judgment.
4. **F-4** — blast-radius check outside `crates/lykn-lang`: the umbrella
   `lykn` crate's re-exports, `lykn-cli`'s *separate* `SExpr` (confirm
   independence), any other consumer of `ast::sexpr`.
5. **F-5** — recon-only guard: empty source diff at close.

## Scope (out)

Any code change (the implementation slice owns all of it); re-litigating
the phasing call or DD-61 §A6; the JS side (no visibility system there —
its backstop is the js-resolution slice's static check); `lykn-cli`'s own
`SExpr` (separate type, separate story — F-4 only *confirms* the
separation).

## Exit criteria

The two censuses published with citations; the design proposal with
options + recommendation + LoE + sizing judgment; blast radius confirmed;
empty diff. Bubble-up: whatever the census reveals that the phasing plan
didn't anticipate (e.g. a pattern-site class that resists mechanical
conversion, or evidence the implementation needs an operator design
call), surfaced — the implementation slice's open set is written from
this slice's closing report.
