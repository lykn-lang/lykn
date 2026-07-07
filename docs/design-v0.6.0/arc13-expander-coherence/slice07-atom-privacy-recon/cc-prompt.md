# CC Prompt — arc13 / slice07 · atom-privacy-recon

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x`. **Re:** The investigation pass for the
*atom-payload-privacy* slice (the §A6 by-construction layer the operator
phased out of slice06). **Recon-only — zero source changes; the slice
closes on an empty diff** (the slice01 precedent). **Do NOT start until
slice06 is closed** — your census target is the post-slice06 tree.

## Read first

The slice-doc (the two site classes and why they differ), slice06's
closing report + handoff notes (its field-add broke 31 constructions +
28 non-`..` patterns — your F-1 baseline), DD-61 §A6 + its refinement
log (the phasing entry).

## The work (MUST) — 5 rows (ledger has the table)

1. **F-1** — construction census: every `SExpr::Atom` literal, classified
   (central-constructor / local-helper / bare), per module, cited.
2. **F-2 — the real question.** Privacy breaks every pattern that
   **names** a field — `Atom { value, .. }` included; only field-free
   `Atom { .. }` survives. Census that class: purpose, replacement
   accessor, and a flagged list of non-mechanical sites. Nobody has
   counted this; the field-add's 28 is a floor, not the number.
3. **F-3** — design proposal with options for the operator (payload
   shape, accessor API, equality/Display/span carry-over, migration
   order) + LoE + the sizing judgment (one slice or two). Surface,
   don't decide.
4. **F-4** — blast radius outside `crates/lykn-lang` (umbrella crate
   re-exports; `lykn-cli`'s separate `SExpr` confirmed independent).
5. **F-5** — empty diff at close (transcript in the report).

## Discipline

Anything the census reveals that the phasing plan didn't anticipate is a
bubble-up finding, not a fold. Closing report untracked
(`docs/design-v0.6.0/**` is CDC's). The implementation slice's open set
gets written from your closing report — write it to be consumed.
