# slice01 — Pre-Book Decision Gate Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required arc16 source material read and cited in the closing report | closing report lists every file from `slice-doc.md` §2 with a one-line role | serious | slice-doc | done | [`closing-report.md`](./closing-report.md) section 1 lists every required slice source and sibling source, plus targeted implementation snippets used for current-state evidence. | prevents planning from stale memory |
| F-2 | Current repo facts verified for lang, book, and writers-guide | closing report records branch/status for lang plus filesystem/git facts for sibling `AGENTS.md`, `CLAUDE.md`, the book example-test directory, `book.toml`, and `src/SUMMARY.md` | serious | slice-doc | done | [`closing-report.md`](./closing-report.md) section 2 records lang branch/status, sibling `AGENTS.md`/`CLAUDE.md` symlinks, absent book example-test tree, book config/ToC, and status caveats. | use evidence, not May inventory claims |
| F-3 | Historical decisions D-1...D-5 dispositioned against current state | closing report has a table for D-1...D-5 with current state, recommendation, and whether Duncan input is still needed | serious | inventory | done | [`closing-report.md`](./closing-report.md) section 3 rows D-1...D-5 disposition the May decisions against current repo facts. | some old rows may already be resolved by artifact-home work |
| F-4 | `D-2607-R4NW` / book fence reachability strategy reconciled with B0-G | closing report compares `lykn test --docs --fence lisp`, the absent external book example-test tree, and any hybrid option; recommends the next implementation route | serious | fence spec + inventory | done | [`closing-report.md`](./closing-report.md) section 3 rows D-1 and `D-2607-R4NW` recommend fence-first plus targeted external book tests. | do not assume the old external book-suite plan still wins |
| F-5 | `D-2608-XPRT` export ownership options packet written | closing report states candidate syntax/semantics, current compiler/doc evidence, implementation scope, risks, and recommendation | serious | dogfood F-7 | done | [`closing-report.md`](./closing-report.md) section 3 row `D-2608-XPRT` covers inline exports, top-of-module exports, and `mod.lykn` re-export semantics. | includes `mod.lykn` re-export layer |
| F-6 | `D-2608-LBND` grouped local binding options packet written | closing report states candidate syntax/semantics, compiler impact, examples, risks, and recommendation | serious | dogfood F-8 | done | [`closing-report.md`](./closing-report.md) section 3 row `D-2608-LBND` covers repeated `bind`s, grouped binding options, and compiler impact. | distinguish `bind` extension vs `let`/`let*` |
| F-7 | `D-2608-COND` flatter branching options packet written | closing report states candidate syntax/semantics, expression/statement behavior, no-else interaction, risks, and recommendation | serious | dogfood F-9 | done | [`closing-report.md`](./closing-report.md) section 3 row `D-2608-COND` covers `cond`, current guard clauses, `?`, `if`, `match`, and no-else behavior. | include `?` and `match` relationship |
| F-8 | `D-2608-SOWN` source ownership options packet written | closing report distinguishes user-authored non-Lykn files from Lykn-owned generated/config manifests and recommends package metadata placement | serious | dogfood F-10 | done | [`closing-report.md`](./closing-report.md) section 3 row `D-2608-SOWN` distinguishes user-owned resources from generated/config manifests and routes docs-only vs behavior-change outcomes. | do not ban user-owned JSON/assets |
| F-9 | Next slice order recommended with blockers named | closing report names slice02 scope and any blocking implementation slice/arc that must happen before chapter work | serious | arc-plan | done | [`closing-report.md`](./closing-report.md) section 5 recommends slice02 next, slice03 fence reachability before chapter examples, and separate implementation slices for accepted surface changes. | arc-plan needs decision-state updates before downstream book/prose slices |
| F-10 | Lang repo planning/doc gates pass | `git diff --check`; `make check-cited-paths`; `make test-docs` | correctness | standing bar | done | [`closing-report.md`](./closing-report.md) section 6 records `git diff --check` clean, `make check-cited-paths` passing after one wording fix for absent-path evidence, and `make test-docs` passing 476/0. | docs-only slice |

## What Worked

The current-repo probes were decisive: several May inventory claims are stale
(`AGENTS.md` is now present in both sibling repos), while the verification gap is
still real (the external book example-test tree is absent and current `lykn test --docs` cannot accept
`--fence lisp`).

## Closure

CC closeout complete. `closing-report.md` is written, all F-rows are done, and
no `cdc-verification.md` is written by CC.
