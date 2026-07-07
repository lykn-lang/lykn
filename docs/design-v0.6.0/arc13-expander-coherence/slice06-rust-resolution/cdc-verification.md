# Slice 06: rust-resolution — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — content-verified; formal close on the source
commit landing on `release/0.6.x`** (nothing is committed yet; per the
"milestone-closed ≠ landed" lesson the closure line gets the SHA and an
ancestry check before A-9 flips). Rows: 6/6, no silent drops. Runtime
rows (`make check`, 1401/0, 475/0, matrix re-probe) are **CC-attested**;
structure and semantics **reproduced by code review** in the working
tree.

## Verification (tree review; sandbox has no toolchain)

- **F-1** — `ast/sexpr.rs` reproduced to spec: `NameRes`
  (`#[non_exhaustive]`, `Default = Unresolved`, doc'd fall-through
  rationale); `SExpr::atom()` as the single §A4 invariant point;
  `name_res()`/`with_name_res()` (`#[must_use]`); **manual
  tag-insensitive `PartialEq`** comparing value+span exactly as the old
  derive (tension #2 resolved as recommended, rationale in-file).
  `resolver.rs` extends scope only via `bindings_introduced` (:25/:50)
  and encodes the region model in `ScopePlan {Sequence, Body}` —
  decl heads → `Sequence` (the initializer-not-in-own-scope finding),
  `for-*`/`if-let`/`when-let`/`match` → `Body` after the
  iterable/scrutinee.
- **F-2** — `pass2.rs` reproduced: one `bound` check gates **both**
  `try_desugar` and user-macro dispatch (:106–117);
  `expand_children_scoped` consumes `resolver::scope_plan`, so scan and
  tagger share one scoping truth (the divergence-proofing the closing
  report claims).
- **F-3** — `as_form_head()` returns `Some` only for
  `binding: NameRes::Unresolved` (verified at the match arm); codegen
  `emit_list` splits atom-with-`None` → **plain call** (`emit.rs:204–211`,
  comment matches behavior); dispatch reads in
  classifier/emitter/codegen conversions spot-checked.
- **F-4** — `tests/a6_dispatch_conformance.rs` reproduced: form-head
  `as_atom()` reads must be `as_form_head` or `A6-exempt`-sanctioned
  (±window); failure message names DD-61 §A6. Seeded-violation demo
  attested (`emit.rs:227` transcript). Runs as a `cargo test` →
  in `make check` by construction.
- **F-5** — JS untouched **verified by construction** (`git status
  packages/` empty per report; no `packages/**` files in the changed
  set). Matrix numbers (182→22 macro-fires; the 22 = label column;
  reserved rows `✗throw`; JS tally unchanged) attested; the label
  residue is **correct** per `Label.shadows_values() == false`
  (slice05), not a leak. Corpus 1401/0 attested.
- **F-6** — attested (`make check` ✓, clippy/fmt clean); operator host
  runs already reproduced the bar during the session.

## Bubble-up check

- **Delivered its arc piece:** yes — the arc-plan's slice06 line
  (env + tags; consumers via the §A6 swap; §A6 pins held: zero
  unsanctioned raw-head dispatch reads, JS baseline byte-identical).
- **Findings all surfaced, none folded** (the arc's discipline held):
  (1) §A3 as-built deviation — resolver is a standalone pass
  (classification is shallow/emitter-driven); same resolve-once
  substance; **routes to the corpus+close slice's "DD-61 as-built"
  recording**. (2) The `scope_plan` region model — **load-bearing for
  js-resolution** (a naive whole-subtree push miscompiles iterables);
  hook notes carry it. (3) Label cells stay `macro-fires` by design —
  **DD-60's per-cell target table could state the label exception
  explicitly; surfaced to the operator as a possible textual
  refinement** (no code change either way). (4) Two disclosed
  simplifications (decl self-reference → `Sequence`; multi-clause param
  over-approximation), both blast-radius 0 and corpus-pinned.
- **Silent-drop diff:** complete and honest (moved / deliberately-not-
  moved / untouched all named with counts).

## Disposition

Content-accepted. **To finalize:** CC commits **source only** on
`release/0.6.x` → record the SHA in the ledger Closure line → CDC
ancestry-check (`git merge-base --is-ancestor <SHA> release/0.6.x`) →
flip arc A-9 done. Then **slice07 · atom-privacy-recon is unblocked**
(its census targets this landed tree — note the constructor landed, so
F-1's "31 bare literals" baseline is now expected to read
central-constructor-dominant).
