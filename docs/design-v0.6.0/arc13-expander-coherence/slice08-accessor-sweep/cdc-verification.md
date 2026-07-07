# Slice 08: accessor-sweep — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-07
**Verdict: accepted — slice08 closed.** Rows: 6/6, no silent drops.
Committed source-only in two green increments (`7d86703` F-1+F-2;
`dab4405` F-3+F-4). Runtime rows attested (`make check` ✓; 1401/0,
docs 475/0, lykn-lang units 1136/0; behavior byte-identical).

## Verification

- **F-5 — REPRODUCED by CDC** (the row that matters most, since it is
  slice09's precondition): grep for field-naming `SExpr::Atom {`
  patterns across `crates/` returns hits **only inside `ast/sexpr.rs`**
  (the defining module — `PartialEq`, `Display`, the constructor, the
  accessors). Zero in either crate outside it. Run in this session.
- **F-1** — `atom_parts()` at `ast/sexpr.rs:227`, the shape specified
  (`Option<(&str, Span)>`); the only in-module change.
- **F-2/F-3/F-4** — conversions attested + spot-checked; the emergent
  idioms (`@`-bind for match arms, `atom_parts()` match collapse,
  `.and_then(|e| e.as_atom())` for let-chains) are recorded in the
  closing report and are the pattern set slice09/js-resolution
  reviewers should expect.
- **F-6** — counts unchanged; no corpus/matrix movement (attested).

## Bubble-up check

**`contains_await` — a real find, correctly handled.** A
destructure-shaped head-*dispatch* read (`emitter/forms.rs:59`) that
slice06's F-4 check was structurally blind to (it greps `as_atom()`
calls; a destructure isn't one). CC kept it **byte-identical**
(`as_atom()` + `A6-exempt` note, verified in-tree at :62) and surfaced
the behavior question instead of folding it: *should async-ness detection
honour resolution?* — a bound `await` param arguably shouldn't mark a
body async. That is a **behavior change** and was rightly deferred.
**Routed: pinned for the corpus+close slice's scoping** (a probe row:
bound `await` in a `func` body → expected async-ness; decide
`as_form_head` vs documented exemption there, where the matrix can
verify it). Note the structural win CC named: post-sweep, destructure
dispatch reads **cannot exist** (the pattern class is gone; post-flip it
won't compile) — the F-4 blind spot self-closed.

## Disposition

**slice08 closed. slice09 · privacy-flip is GO** — its F-1 precondition
is verified twice over (CC's transcript + CDC's independent grep).
Ledger closure line finalized with both SHAs.
