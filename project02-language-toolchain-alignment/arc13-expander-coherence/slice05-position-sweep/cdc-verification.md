# Slice 05: position-sweep + walker-completion — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — slice05 closed.** The discover-by-leak loop is closed
— by a test, not a promise. Rows: 5/5, no silent drops. Suites **1401/0**;
`make check` ✓; matrix 8→11 position columns with the original 8
byte-identical.

## Verification (tree/report review; runtime CC-attested)

- **F-1** — catch + import locals (default/named/alias) at D1+D2 footing;
  label D2-only with `shadows_values() = false` (the resolution slices get
  the skip-labels signal *in the API* — good design, not a comment).
  slice04's evidence repros error on both backends.
- **F-2 — the sweep found what probing couldn't:** the **name-slot class**
  (`func`/`genfunc`/`class`/`type`-constructor names and ctor params → all
  emitted invalid JS at rc=0). Mechanical, correctly folded (identifiers in
  name slots of forms the walker already handled — within confirmed D2
  semantics, not a semantics change). Derived inventories with codegen
  citations in the closing report; non-binders documented with
  verification (class-expr erased name, property names, re-export refs).
- **F-3** — the coverage test stands in `make check`: one fixture per
  derived binder position, both backends must reject; seeded-gap demo
  (removed the JS catch arm → catch fixture fails → restored).
- **F-4/F-5** — matrix delta exactly the new positions' D2 rows; parity
  green; 1401/0.

**Exhaustiveness claim: accepted as evidenced** — the codegen match head is
a closed set; the sweep walked it; every identifier-into-a-binder position
is covered or documented-non-binder; the standing test converts the claim
from a snapshot into an invariant. No refinement #3 needed (name slots were
mechanical D2 coverage, logged in DD-60's refinement log as an addendum,
not a semantics change).

## Disposition

**slice05 closed.** The binding-position layer is complete by construction
and test-pinned. **Next: the resolution slices proper** — rust-resolution
first (D1 env + resolved-atom tags; emitter/codegen → consumers via the
`as_form_head()` swap, DD-61 §A6 rows pinned at scoping), then
js-resolution, then the conformance corpus + arc close. Hook-point notes
live in CC's slice03/05 closing reports.
