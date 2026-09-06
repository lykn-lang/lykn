# CC Prompt — arc13 / slice08 · accessor-sweep

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-07
**Branch:** `release/0.6.x` (from `dc37ae9` or later). **Re:** Step one
of the atom-payload-privacy pair (operator-confirmed two-slice
packaging, per your slice07 recommendation). Convert every field-naming
`SExpr::Atom {…}` pattern outside `ast/sexpr.rs` to accessors **while
fields are still public** — green at every step, behavior
byte-identical. **Your slice07 closing report is the census — work from
its site lists; don't re-derive.**

## The work (MUST) — 6 rows (ledger has the table)

1. **F-1** — add `atom_parts() -> Option<(&str, Span)>` to
   `ast/sexpr.rs` (+tests). That is the **only** in-module change —
   the restructure is slice09's.
2. **F-2** — `lykn-lang` prod (63 sites): value-only → `as_atom()`;
   value+span → `atom_parts()`; the **25 nested let-chains** are the
   effort concentration — restructure each chain preserving its boolean
   logic exactly; take them one at a time.
3. **F-3** — `lykn-lang` tests (17): the 14 parser `matches!` guards →
   `as_atom() == Some("…")`; the 3 resolver value+binding helpers →
   `as_atom()` + `name_res()`.
4. **F-4** — `lykn-cli` (5 sites: `formatter.rs:25`,
   `lint/rules.rs:18,159,205,451`); keep the 2 `A6-exempt` markers with
   their sites; confirm the umbrella `lykn` crate builds.
5. **F-5** — the completion gate: publish the grep proving **zero**
   field-naming `Atom {` patterns remain outside the defining module
   (field-free `{ .. }` exempt) — slice09's reproducible precondition.
6. **F-6** — `make check` ✓ with **unchanged counts** (≥1401/0, docs
   475/0); no corpus/matrix movement; `./bin/lykn` rebuilt for any probe.

## Discipline

Exact-string edits, diff-inspected — **no byte-offset scripting** (the
slice06 crash lesson). Commit in green increments (per-class or
per-file batches). Any site class or idiom the census missed → surface
in the bubble-up, don't fold. `as_atom()` stays as-is (operator call
2026-07-07) — do not rename or narrow it. Closing report untracked;
commit **source only**. After this: slice09 flips privacy (small,
atomic).
