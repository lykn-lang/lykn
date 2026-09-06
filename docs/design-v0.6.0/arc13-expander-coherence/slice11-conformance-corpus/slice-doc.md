# Slice 11: conformance-corpus + dispositions

> **The last slice of arc13** — the recomposition deliverable. Both
> backends now implement DD-60 D1/D2 (slices 03–10); this slice makes
> that convergence **permanent** (the standing cross-backend corpus the
> arc's capability statement promised) and **complete** (a recorded
> disposition for every explained residual). It is *not* the arc close
> itself: the arc-level closing-report, the A-4/A-5 composition rows
> reproduced at arc scale, and the operator gate follow this slice as
> the arc close-set (CDC + operator work, per LEDGER-DISCIPLINE §B —
> bundling them into a slice was the old plan's mis-labeling, corrected
> at scoping 2026-07-07).

## Goal

A future regression in name-binding semantics — on either backend, in
any binding or reference position — fails CI before it ships. And the
56-cell residual is zero-ambiguity: every disagreeing cell is either
**fixed** (converged) or **documented as intended** with a rationale a
future session can find.

## The corpus (F-1 — the design question)

The matrix (`tools/conformance-matrix.js`, 1947 cells, shells
`./bin/lykn` per Rust cell) is the *audit tool* — almost certainly too
slow for `make check`. The corpus is the *standing gate*. The design
call (CC proposes with timing evidence; surface if structural):

- **Coverage bar:** at least one standing cross-backend test per
  **name-class × binding-position × reference-position equivalence
  class** (the matrix's own collapse rules define the classes) — not
  all 1947 cells, but no class uncovered.
- **Vehicle:** `.lykn` compile-both corpus rows (the A-8/kernel-escape
  precedent) and/or a matrix-subset snapshot test — CC's call on
  timing evidence; `make check` cost reported before/after.
- **Teeth:** a seeded-divergence demo — break one backend's resolution
  (temporarily), watch the corpus go red, restore.

## The dispositions (F-2..F-4 — the 56-cell residual + two carried items)

From slice10's bubble-up (the A-4 baseline) and the arc's routed pins:

1. **The `macro` name row — a Rust-side gap, JS is ahead.** A bound
   legal-ident `macro` should be `calls-binding` on both backends (D1
   has no macro-name exception). Expected: a small Rust fix; the cells
   converge. If contact says it isn't small — surface, don't grow.
2. **The label accidental-shadowing asymmetry** (pre-existing): the
   backends disagree on *reference* behavior around label-position
   names. Labels don't shadow values (DD-60 ‡), so the question is
   whether the asymmetry is a D1 violation in disguise or a documented
   corner. Fix-or-document with rationale; if document → a DD-60
   refinement-log note (operator confirms via CDC).
3. **`kernel:if` strict-mode cells** — expected: document (the
   `kernel:`-prefixed class is unbindable; DD-60 edge case 4).
4. **`contains_await`** (slice08's find): should async-ness detection
   honour resolution? Probe: bound `await` param + non-async body →
   what emits today, what should. Expected: the one-line
   `as_form_head()` change + test, **or** a documented `A6-exempt`
   rationale. Decide with the probe in hand; record either way.
5. **D2-timing constructed-name residual** (slice10's measure): a
   reserved binder name *constructed from a macro argument* escapes
   JS's pre-lowering validation (hits an unrelated error today).
   Expected: document as the permanent asymmetry (practical risk nil)
   + a pinning probe if cheap. Unifying the pass placement is **out**
   of scope unless trivially cheap — surface if tempted.

Every disposition lands in the closing report as: probe evidence →
decision → where it's recorded (code fix + corpus row, or DD note).

## Scope (out)

The arc close itself (closing-report / A-4/A-5 arc-scale reproduction /
operator gate / ancestry reconciles — CDC's, after this slice); any
DD-60/61 semantics change beyond confirmed-refinement notes; arc05's
lint work (the resolution machinery hands off there next); matrix tool
redesign (it stays the on-demand audit tool).

## Exit criteria

Corpus standing in `make check` with the coverage bar met and the
seeded-divergence demo transcript; `make check` cost delta reported;
all five dispositions recorded with probe evidence; final matrix
snapshot published (the end-state divergence count, every residual
documented-as-intended) — this is the **A-4 evidence input** for the
arc close. Bubble-up: the arc-close handoff (anything the corpus build
revealed; the final numbers; confirmation the arc's capability holds
end-to-end or what's missing).
