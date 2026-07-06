# Slice 04: walker-extension — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — slice04 closed.** The three refinement positions are
in both walkers (tree-verified: the `if-let`/`when-let`/`match` handling
present in `binding.rs` and `binding.js`; Rust reuses `classify_expr`'s
typed `Pattern` — single-source again; JS mirrors the pattern grammar
incl. the bind/don't-bind distinctions for `_`/literals/PascalCase);
slice03's evidence leaks now error on both backends; matrix 5→8
binding-position columns with original columns byte-identical; parity
fixtures 16→20; suites **1391/0**; `make check` ✓. Rows: 4/4, no silent
drops.

**The finding — round two, handled exactly right.** Probing for a fourth
position per the discipline clause found **three**: `catch` bindings,
`import` local names (both genuine lexical bindings), `label` names (own
namespace; still an rc=0 leak). Surfaced with an evidence table, not
folded. **Operator (2026-07-06): refinement #2 confirmed + the
derived-exhaustiveness sweep** — because two rounds of discovery-by-leak
means the method must change: **slice05 · position-sweep +
walker-completion** derives the complete position list from the
grammar/codegen and diffs it against the walker, ending the accumulate-
by-surprise loop.

**Disposition:** slice04 closed; DD-60 refinement log gains entry #2;
slice05 scoped. Future table entries de-numbered (correcting CDC's own
tail-renumbering slip at the slice04 insert — numbers at creation only).
