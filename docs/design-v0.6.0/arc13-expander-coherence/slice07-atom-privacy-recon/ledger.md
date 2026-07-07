# Slice 07: atom-privacy-recon — Ledger

Recon-only investigation for the §A6 by-construction (atom-payload-privacy)
layer. Per LEDGER-DISCIPLINE. **Depends on: slice06 closed.** 5 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Construction-site census (post-slice06)** — every `SExpr::Atom` literal classified central-constructor / local-helper / bare, per module, with citations; local-helper consolidation recommendation | census table in closing report; spot-reproducible by grep | serious | operator phasing call 2026-07-06 | open | | slice06's in-flight measure: 31 bare literals broke on the field add — reconcile against the landed tree |
| F-2 | **Pattern-site census** — every pattern **naming** `value`/`span`/`binding` (privacy breaks these even with `..`; only field-free `Atom { .. }` survives), classified by purpose + accessor needed; non-mechanical sites (nested patterns, multi-field reads, guards) flagged | census table with citations | serious | operator phasing call | open | | this class ≫ the 28 non-`..` patterns the field add broke — it is the restructure's real blast radius |
| F-3 | **Design proposal** — payload shape options (`Atom(AtomData)` vs alternatives), accessor API, `Display`/`Debug`/`PartialEq` carry-over (slice06 chose tag-insensitive equality — confirm it survives), span story, migration order; LoE + sizing judgment (one slice or two, fits-one-context test). Options **surfaced for the operator, not decided** | the proposal section in closing report | serious | DD-61 §A6 refinement log | open | | |
| F-4 | **Blast radius outside `crates/lykn-lang`** — umbrella `lykn` crate re-exports enumerated; `lykn-cli`'s separate `SExpr` confirmed independent; any other `ast::sexpr` consumer listed | grep transcript + list in closing report | correctness | scope discipline | open | | |
| F-5 | **Recon-only** — empty source diff at close | `git status`/`git diff` transcript | serious | slice01 precedent | open | | |

## What Worked / Closure

_(At slice close.)_
