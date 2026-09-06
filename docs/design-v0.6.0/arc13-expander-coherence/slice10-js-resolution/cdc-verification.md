# Slice 10: js-resolution — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-07
**Verdict: accepted — slice10 closed.** Rows: 6/6, no silent drops.
Source-only commit `c19a1fb`. **DD-60 D1 now holds on both backends.**
Runtime rows attested (`make check` ✓; JS suite 707, corpus green,
docs 475/0; matrix reproduced by CC); structure **reproduced by code
review** in this session.

## Verification (tree review; runtime CC-attested)

- **F-3** — `compiler.js:19` `formHead(node)`: name only when
  `node.binding === undefined` — `null` for `def` AND `ref`, the exact
  `as_form_head` mirror; the **single dispatch door** at :1782 converted
  (`macros[formHead(head)]`); 18 `A6-exempt` structural markers
  verified in place (import/export alias, decl wrappers, try/switch
  clause grammar, pattern elements, accessor get/set) — each annotated
  with *why* it is structural, better than bare markers.
- **F-1** — `expander.js:784` `scopePlan(form)` is a faithful mirror of
  Rust `resolver::scope_plan` (`Sequence` vs `Body{names, bodyStart}`;
  loop iterable / scrutinee outside their own binding's scope); the
  default walk is region-aware (:1080); the env is an immutable `Set`
  threaded through the walk; ref-gate at :941 tags and short-circuits.
- **F-2/F-4/F-5/F-6** — attested + consistent with the reviewed
  structure: resolution.test.js (11 tests incl. the non-negotiable
  region probe → `for (const array of [1]) array(987)`);
  a6-dispatch-conformance.test.js with seeded demo (the finding that
  the JS dispatch idiom is the `macros[…]` **indexing door**, not
  `.value ===`, is itself good recon — the check watches the right
  thing); matrix: JS calls-binding 323→874, macro 120→12, divergence
  **601→56**, Rust columns untouched, corpus unchanged; migration list
  **empty** (recon-confirmed — no old-behavior assertions existed).

## The design decision (surfaced, accepted)

Two mechanisms that must agree, forced by grounded constraints
(monolithic lowering; `bindingsIntroduced` is surface-only; no spans on
JS atoms): function-family params env-extend at the **surface** level
(their lowered `=>`/`function` param lists don't survive to
`bindingsIntroduced`); everything else re-exposes binders to the uniform
`scopePlan` walk. Extending at both levels would double-shadow a
`for-of` iterable — the reasoning is recorded, the region probes pin it.
This answers the open sub-question the recon addendum posed; the
CDC sketch held with that one JS-specific split.

## Dispositions

- **Disclosed artifact:** function-family *simple* params tag `ref` not
  `def` — inert (the compiler reads param lists structurally;
  `formHead` nulls both). Accepted as documented; cosmetic
  normalization is not arc work.
- **D2 timing:** documented, not unified — measured on contact: JS
  *does* catch lexically-visible macro-emitted reserved binders; the
  residual (a name constructed from a macro argument) hits an unrelated
  error today. **Routed → corpus+close scoping** (decide: document as
  permanent asymmetry or pin with a probe).
- **A-4 baseline (the bubble-up's core):** **56 disagreeing cells of
  1947**, all explained, none a leak — (a) the label
  accidental-shadowing asymmetry (pre-existing, unchanged), (b) the
  `macro` name row (**JS ahead of a Rust gap** — a Rust-side item!),
  (c) `kernel:if` strict-mode. **Each of the three classes needs a
  disposition at corpus+close** (fix / document / DD refinement).
- **Staleness trap #4 (new costume):** the `lang/` import map resolves
  to `target/lykn/build/lang/` — `./bin/lykn build` must refresh before
  any deno/matrix run reflects a source edit. Same genus as the
  PATH-binary and stale-bin traps; for the issues log.

## Disposition

**slice10 closed; A-10 flips done.** Remaining in arc13: the
conformance-corpus + arc-close slice (numbered at creation), whose
scoping now has a rich pin list: the 56-cell baseline (3 classes to
disposition), `contains_await`, D2-timing, the DD-61 as-built record,
and the host ancestry reconciles (5 SHAs incl. `c19a1fb`).
