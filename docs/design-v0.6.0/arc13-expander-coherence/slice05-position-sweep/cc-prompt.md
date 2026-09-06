# CC Prompt — arc13 / slice05 · position-sweep + walker-completion

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x`. **Re:** Your round-two finding,
operator-confirmed with a **method change**: two rounds of
discovery-by-leak means the binding-position list must be **derived, not
accumulated**. This slice adds catch/import-local/label AND performs the
exhaustiveness sweep that ends the loop. (Commit slice04's source first if
not yet done.)

## The work (MUST) — 5 rows (ledger has the table)

1. **F-1** — walkers + D2 for `catch` bindings and `import` local names
   (full D1+D2 footing); **D2-only** for `label` (own namespace — labels
   don't shadow variables; document, don't implement D1 there). Your
   evidence repros error on both backends.
2. **F-2 — the sweep (the point).** Invert discovery: enumerate every
   place each backend's codegen emits an identifier into a JS
   binding/declaration/label slot (Rust: `emit.rs`/codegen emission sites;
   JS: `compiler.js` ESTree `Identifier`-in-binder-position
   constructions). Publish the derived per-backend inventories **with
   citations**, diff against walker coverage. Mechanical gaps fold into
   this slice; anything *semantically novel* is refinement #3 — surface,
   don't fold (three-peat the discipline).
3. **F-3** — make the coverage-diff a **standing test** in `make check`
   (per backend; seeded-gap demo). Same authority-inversion as the
   reserved-word parity test: the grammar is the source of truth, the test
   keeps the walker honest against it forever.
4. **F-4** — matrix columns for the new positions; only their D2 rows
   flip; originals byte-identical (leak = stop).
5. **F-5** — `make check` ✓; suites ≥1391/0; three-way parity green;
   `./bin/lykn` everywhere.

## Discipline

Closing report untracked; `docs/design-v0.6.0/**` is CDC's; bubble-up
carries the exhaustiveness claim **with the derivation as evidence** + the
resolution-slice hook notes. After this: the resolution slices proper
(rust, then js), where `as_form_head()`/`formHead()` land per DD-61 §A6.
