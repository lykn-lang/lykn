# Ledger — `03-citation-repoint`

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Strengths:
`asserted` < `attested` < `reproduced` < `reconciled`. **Closer ≠ verifier** —
CC closes, CDC verifies, the operator gates.

| Row | Acceptance criterion | Verify | Sev | Status | Evidence | Strength |
|---|---|---|---|---|---|---|
| **R-1** | Every crates/design citation is repointed to its `docs/design/06-final/…` home. All 9 distinct paths resolve; the mapping is same-basename and was spot-checked on 5. | `make check-cited-paths` reports zero crates/design hits; census loses the corresponding rows | correctness | open | — | — |
| **R-2** | Every `examples/…` citation is repointed (6/6 have tracked homes). | as R-1 | polish | open | — | — |
| **R-3** | `docs/`, `packages/`, `assets/`, `test/` are walked **per citation**, and each is either repointed, or **frozen with a one-line reason** in the census row. No silent leave-behinds: the census delta must account for every path in these classes. | census diff + the reason column | serious | open | — | — |
| **R-4** | **The four decided-but-unmigrated files are moved**, and their citations now resolve. Not repoints — the destination was already chosen by a committed document. See `cc-prompt.md` §2. | `git ls-tree HEAD` on each destination; gate green on those four | serious | open | — | — |
| **R-5** | **No repoint made a sentence false.** Every citation inside a sentence that *narrates a move or rename* is left verbatim and marked frozen-by-carve-out. | CDC reads the diff sentence-by-sentence, not path-by-path | **serious** | open | — | — |
| **R-6** | The frozen census **shrank and did not grow**; the delta is recorded and equals the number of rows resolved. Regeneration is **not** permitted — delete resolved rows in place. | `git diff` on `scripts/cited-paths-census.tsv`: deletions only, zero additions | **serious** | open | — | — |

## Why R-5 and R-6 are the serious ones

R-6 protects the mechanism: amendment (1) specified a census that can only
shrink, precisely so an exemption list cannot become the bug. A regenerated
census would silently re-admit anything newly broken, and the diff would look
like ordinary churn. **Deletions only.**

R-5 protects the record. This slice is executing a disposition whose whole point
is that history stays accurate; the failure mode is a well-meaning
search-and-replace that turns *"packages/lykn was renamed to
`packages/lang/`"* into a sentence claiming a rename from a thing to itself.
Path-by-path review cannot catch that. **Read sentences.**

## Silent-drop diff (at close)

Scope-as-specified vs scope-as-delivered goes here. The three "out" items in
`slice-doc.md` are disclosed deferrals with named homes — the `workbench/` +
`assets/ai` freeze (operator disposition, `D-2607-D3NL`), the 0.7.x defects
(`D-2607-5TDW`), and the two open operator decisions (`D-2607-W2FJ`,
`D-2607-Q8LM`) — not drops.
