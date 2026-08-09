# slice01 — Pre-Book Decision Gate Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required arc16 source material read and cited in the closing report | closing report lists every file from `slice-doc.md` §2 with a one-line role | serious | slice-doc | open | | prevents planning from stale memory |
| F-2 | Current repo facts verified for lang, book, and writers-guide | closing report records branch/status for lang plus filesystem/git facts for sibling `AGENTS.md`, `CLAUDE.md`, `/Users/oubiwann/lab/cnbb/lykn/test/book/`, `book.toml`, and `src/SUMMARY.md` | serious | slice-doc | open | | use evidence, not May inventory claims |
| F-3 | Historical decisions D-1...D-5 dispositioned against current state | closing report has a table for D-1...D-5 with current state, recommendation, and whether Duncan input is still needed | serious | inventory | open | | some old rows may already be resolved by artifact-home work |
| F-4 | `D-2607-R4NW` / book fence reachability strategy reconciled with B0-G | closing report compares `lykn test --docs --fence lisp`, `/Users/oubiwann/lab/cnbb/lykn/test/book/`, and any hybrid option; recommends the next implementation route | serious | fence spec + inventory | open | | do not assume the old external book-suite plan still wins |
| F-5 | `D-2608-XPRT` export ownership options packet written | closing report states candidate syntax/semantics, current compiler/doc evidence, implementation scope, risks, and recommendation | serious | dogfood F-7 | open | | includes `mod.lykn` re-export layer |
| F-6 | `D-2608-LBND` grouped local binding options packet written | closing report states candidate syntax/semantics, compiler impact, examples, risks, and recommendation | serious | dogfood F-8 | open | | distinguish `bind` extension vs `let`/`let*` |
| F-7 | `D-2608-COND` flatter branching options packet written | closing report states candidate syntax/semantics, expression/statement behavior, no-else interaction, risks, and recommendation | serious | dogfood F-9 | open | | include `?` and `match` relationship |
| F-8 | `D-2608-SOWN` source ownership options packet written | closing report distinguishes user-authored non-Lykn files from Lykn-owned generated/config manifests and recommends package metadata placement | serious | dogfood F-10 | open | | do not ban user-owned JSON/assets |
| F-9 | Next slice order recommended with blockers named | closing report names slice02 scope and any blocking implementation slice/arc that must happen before chapter work | serious | arc-plan | open | | must update arc-plan if ordering changes |
| F-10 | Lang repo planning/doc gates pass | `git diff --check`; `make check-cited-paths`; `make test-docs` | correctness | standing bar | open | | docs-only slice |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

Open. Closing report and CDC verification are written only after CC completes
the slice.
