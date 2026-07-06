# Slice 05: position-sweep + walker-completion

> End the discover-by-leak loop (operator, 2026-07-06): add refinement #2's
> three positions (`catch` bindings, `import` local names, `label` names)
> AND perform the **derived-exhaustiveness sweep** — enumerate every
> identifier-emitting binding/declaration position from the grammar/codegen
> itself, per backend, diff against the walker, and make that diff a
> standing test. After this slice the binding-position list is **complete
> by construction**, not by accumulation.

## Goal

Walkers + D2 cover catch/import-local (D1+D2 class) and label (D2-only —
its own namespace; labels don't shadow variables) plus **anything the
sweep finds**; the sweep's derived list lives as a testable artifact so a
future grammar addition that binds a name fails `make check` until the
walker knows it.

## The sweep method (the point of this slice)

Invert the discovery direction: instead of probing inputs for leaks,
enumerate **outputs** — every place each backend's codegen emits an
identifier into a JS *binding/declaration/label* grammar slot
(`const|let|var X`, `function X`, params, `catch (X)`, `import {X}`,
`X:` labels, class fields/methods where names are emitted, destructuring
targets, …). Rust: sweep `emit.rs`/`codegen` for identifier-emission
sites; JS: `compiler.js` ESTree constructions with `Identifier` in
binder/declaration position. The derived per-backend list → diffed
against `bindings_introduced`/`bindingsIntroduced` coverage + the D2
name-slot set → **the diff is a test** (empty = complete; non-empty names
the gap). This is the same authority-inversion as the reserved-word list
(empirical probe > hand-list), applied to positions.

## Scope (in)

1. **F-1** — walkers + D2 for catch/import-local; D2-only for label (both
   backends); slice04's evidence repros error on both.
2. **F-2** — the sweep, both backends: derived position inventories with
   emission-site citations; walker-coverage diff; anything uncovered joins
   this slice (walker + D2 + matrix) or — if it's semantically novel — is
   surfaced as refinement #3, not folded.
3. **F-3** — the **coverage-diff test** in `make check` (per backend): the
   derived list vs the walker's covered set; seeded-gap demo.
4. **F-4** — matrix probe: new position columns (catch/import/label + any
   sweep finds), baselined; only their D2 rows flip; originals
   byte-identical.
5. **F-5** — green bar: `make check` ✓; suites ≥1391/0 + new tests;
   three-way parity green.

## Scope (out)

Resolution/env/tags (next slices); dispatch changes; the label namespace's
D1 semantics (labels don't shadow — documented, not implemented).

## Exit criteria

The three positions covered; the derived inventories published in the
closing report with citations; the coverage-diff test standing in
`make check`; matrix delta exactly the new positions' D2 rows; suites
green. Bubble-up: the exhaustiveness claim **with the derivation as
evidence** (or refinement #3 surfaced), and hook-point notes for the
resolution slices.
