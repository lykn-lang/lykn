# Slice 07: atom-privacy-recon — Ledger

Recon-only investigation for the §A6 by-construction (atom-payload-privacy)
layer. Per LEDGER-DISCIPLINE. **Depends on: slice06 closed.** 5 rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Construction-site census (post-slice06)** — every `SExpr::Atom` literal classified central-constructor / local-helper / bare, per module, with citations; local-helper consolidation recommendation | census table in closing report; spot-reproducible by grep | serious | operator phasing call 2026-07-06 | met | closing report §F-1 | **Construction is done**: 170 `SExpr::atom()` calls, 7 helpers all delegating, **1** bare literal left (the constructor). No consolidation needed. |
| F-2 | **Pattern-site census** — every pattern **naming** `value`/`span`/`binding` (privacy breaks these even with `..`; only field-free `Atom { .. }` survives), classified by purpose + accessor needed; non-mechanical sites (nested patterns, multi-field reads, guards) flagged | census table with citations | serious | operator phasing call | met | closing report §F-2 | **~85 sites** break (63 lykn-lang prod + 17 test + **5 lykn-cli**); ~52 trivial `as_atom()`, 16 value+span, 25 nested let-chains, 14 parser `matches!`. The 28 floor confirmed ≪ real number. |
| F-3 | **Design proposal** — payload shape options (`Atom(AtomData)` vs alternatives), accessor API, `Display`/`Debug`/`PartialEq` carry-over (slice06 chose tag-insensitive equality — confirm it survives), span story, migration order; LoE + sizing judgment (one slice or two, fits-one-context test). Options **surfaced for the operator, not decided** | the proposal section in closing report | serious | DD-61 §A6 refinement log | met | closing report §F-3 | Recommends `Atom(AtomData)` + convert-patterns-then-flip-privacy; **leans two slices**; equality carries over; §A6 end-state needs operator confirm (as_atom stays public + static check stays load-bearing). |
| F-4 | **Blast radius outside `crates/lykn-lang`** — umbrella `lykn` crate re-exports enumerated; `lykn-cli`'s separate `SExpr` confirmed independent; any other `ast::sexpr` consumer listed | grep transcript + list in closing report | correctness | scope discipline | met | closing report §F-4 | **CORRECTION: `lykn-cli` is NOT independent** — no separate `SExpr`; it imports lykn-lang's and pattern-matches it (5 sites). Blast radius = two crates. |
| F-5 | **Recon-only** — empty source diff at close | `git status`/`git diff` transcript | serious | slice01 precedent | met | `git status --short crates/` empty | |

## What Worked / Closure

**Closed 2026-07-06 — recon complete, empty source diff.** All five rows met
against the post-slice06 tree (HEAD `dc37ae9`). See `closing-report.md` for the
two censuses, the design proposal, and the bubble-up.

**Lead finding (overturns a phasing-plan assumption):** there is no separate
`lykn-cli` `SExpr` — the blast radius is **two crates**, and the work is a
**pattern-site** problem (~85 sites), not a construction problem (slice06's
constructor already retired that class). The implementation slice's open set:
add `atom_parts()` (optional) → convert ~85 pattern sites to accessors while
fields are public (green) → flip privacy (atomic, small), across lykn-lang
**and** lykn-cli. **Recommendation: two slices** (mechanical sweep, then the
atomic flip); operator to confirm the §A6 end state (as_atom stays public; the
slice06 static check stays load-bearing).
