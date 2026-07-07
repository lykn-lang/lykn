# CC Prompt — arc13 / slice09 · privacy-flip

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-07
**Branch:** `release/0.6.x`. **Re:** Step two of the privacy pair — the
atomic restructure. **Do NOT start until slice08 is closed**; your first
act is re-running its completion grep (F-1). If slice08 did its job,
this slice breaks only `ast/sexpr.rs` — small and focused.

## The work (MUST) — 5 rows (ledger has the table)

1. **F-1** — re-run slice08's zero-pattern grep against your start
   tree. Non-zero → **stop and surface** (a slice08 census gap, not
   yours to quietly absorb).
2. **F-2** — `Atom { value, span, binding }` → **`Atom(AtomData)`**,
   `AtomData` fields private to `ast::sexpr` (recon Option A).
   Re-target in-module: `SExpr::atom()`, all accessors (`as_atom`,
   `as_form_head`, `span`, `name_res`, `with_name_res`, `atom_parts`),
   the **manual tag-insensitive `PartialEq`** (behavior unchanged),
   `Display`/`Debug`. Update field-free matches to `Atom(_)`. Measure
   `size_of::<SExpr>()` before/after — report it; if it regresses,
   boxing is a **surfaced option**, not a change you make.
3. **F-3** — prove privacy: seed a field-naming pattern outside the
   module (one in `lykn-lang`, one in `lykn-cli`) → compile error →
   remove; transcripts in the closing report.
4. **F-4** — `as_atom()` stays public, unrenamed (operator call
   2026-07-07); the slice06 A6 static check must be green and its doc
   comments still true.
5. **F-5** — `make check` ✓ (both crates + the umbrella `lykn` crate);
   counts unchanged (≥1401/0, docs 475/0); corpus + matrix untouched;
   `./bin/lykn` rebuilt for any probe.

## Discipline

This is the slice where "small and atomic" is the spec — if it stops
being small (a missed site class, a size surprise, an impl that can't
re-target cleanly), **self-stop and surface** rather than grow it.
Bubble-up: the DD-61 §A6 as-built record — on Rust the three layers are
now **visibility + static check + corpus** — plus anything the flip
revealed. Closing report untracked; commit **source only**.
