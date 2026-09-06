# Slice 09: privacy-flip

> **Step two of the atom-payload-privacy pair — the atomic restructure.**
> With slice08's sweep complete (zero field-naming `Atom` patterns
> outside `ast/sexpr.rs` — its F-5 gate is this slice's precondition),
> flipping the payload private breaks only the defining module. This is
> the DD-61 §A6 **by-construction** layer the operator phased out of
> slice06: after this slice, a resolution-unaware consumer *cannot*
> destructure its way to a raw atom name — the accessors are the only
> door, and `as_form_head()` is the only dispatch-purpose one.
> **Depends on: slice08 closed.**

## Goal

`SExpr::Atom` becomes `Atom(AtomData)` — a tuple variant whose
`struct AtomData { value, span, binding }` fields are **private to
`ast::sexpr`** (the recon's Option A; Option B was rejected for cause —
`#[non_exhaustive]` doesn't block field *reads*; Option C, boxing, only
if a measured size regression demands it). All defining-module impls
re-target inside the module: `SExpr::atom()`, the accessors
(`as_atom`/`as_form_head`/`span`/`name_res`/`with_name_res`/`atom_parts`),
the tag-insensitive manual `PartialEq` (carries over unchanged — no
equality re-decision, per the recon), `Display`/`Debug`.

## The §A6 end state (operator-decided 2026-07-07)

- **`as_atom()` stays public under its current name** — the sanctioned
  non-dispatch accessor (spans, rendering, argument reads, lykn-cli's
  formatter/lint). Privacy strengthens layer 1 (no destructure path to
  the name); it does **not** replace layers 2–3 — **the slice06 A6
  static check stays load-bearing** and must remain green.
- Recorded as a DD-61 as-built note (CDC writes the DD entry; this
  slice's job is that the check and the doc comments stay true).

## Scope (in)

The variant restructure + `AtomData`; the defining-module impl
re-targets; a compile-fail demonstration that privacy holds (a seeded
field-naming pattern outside the module fails to compile); pattern-match
compatibility for field-free matches (`Atom(_)` / equivalent) across
both crates; green bar with unchanged counts.

## Scope (out)

Any new pattern-site conversions (slice08 finished them — if the flip
reveals a missed site, that is a slice08 census gap: fix it, and
**surface it** in the bubble-up); behavior changes; `as_atom()`
renaming/narrowing; JS; size optimization beyond the measure-and-report
(boxing is a surfaced option, not a default).

## Exit criteria

Fields private and unreachable outside `ast::sexpr` (seeded compile-fail
demo); one construction door (`SExpr::atom()`), one dispatch door
(`as_form_head()`); all suites green at unchanged counts; corpus and
matrix untouched; both crates + umbrella build; `SExpr` size measured
and reported. Bubble-up: DD-61 §A6's three-layer story is now
**visibility + static check + corpus** on Rust — the as-built record
for the corpus+close slice, plus anything the flip revealed.
