# Slice 09: privacy-flip — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-07
**Verdict: accepted — slice09 closed; the atom-payload-privacy pair
(08+09) is complete and arc A-11 flips done.** Rows: 5/5, no silent
drops. Source: `4c12301` — a **single-file** change (`ast/sexpr.rs`),
exactly the atomicity the phasing was designed to buy. Runtime rows
attested (`make check` ✓; 1401/0, docs 475/0, lykn-lang 1136/0;
byte-identical).

## Verification (tree review; runtime attested)

- **F-2** — reproduced in-tree: `pub struct AtomData` with **private**
  `value`/`span`/`binding`; `SExpr::Atom(AtomData)`; constructor and
  accessors destructure the payload only in-module; the tag-insensitive
  `PartialEq` carried over. `size_of::<SExpr>()` 48→48 — no boxing
  (measured, not assumed).
- **F-3** — E0451 compile-fail attested in **both** crates (sibling
  module + cross-crate), which is the §A6 by-construction claim made
  falsifiable. With F-1's re-run gate (and CDC's own slice08
  reproduction of it), privacy's precondition was checked three times
  total.
- **F-4** — `as_atom()` public/unrenamed; A6 static check green and
  load-bearing (attested); doc comments updated to name the two doors.

## Findings — dispositions

1. **`{ .. }` rest-pattern is valid on tuple variants** → the ~42
   field-free `Atom { .. }` conversions were unnecessary; CC correctly
   left them per "small and atomic is the spec." Cosmetic normalization
   (→ `Atom(_)`) noted as a *possible* polish follow-up — routed to the
   post-0.6.0 polish list, not an arc13 item.
2. **DD-61 §A6 as-built on Rust: visibility + static check + corpus** —
   matches the refinement-log entry; the corpus+close slice records the
   full as-built.
3. **Process near-miss (disclosed, recovered):** a `git checkout` to
   remove a temp probe reverted the uncommitted restructure — caught
   immediately, redone, probes removed surgically after. The honest
   disclosure is the system working; lesson noted: on uncommitted work,
   prefer surgical edits over checkout-based cleanup.

## Disposition

**slice09 closed; A-11 done.** DD-61 §A6's phased plan is fully landed
on Rust: `as_form_head()` (slice06) + the static check (slice06) +
**by-construction privacy (slice09)** + the corpus (arc gate). Next:
**js-resolution** — scoped fresh (numbered at creation), consuming
slice06's hook notes (the `scope_plan` region model, the label
exception, `formHead()` + the JS grep check).
