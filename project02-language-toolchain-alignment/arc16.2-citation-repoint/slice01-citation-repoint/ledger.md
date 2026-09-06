# Ledger — `03-citation-repoint`

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Strengths:
`asserted` < `attested` < `reproduced` < `reconciled`. **Closer ≠ verifier** —
CC closes, CDC verifies, the operator gates.

| Row | Acceptance criterion | Verify | Sev | Status | Evidence | Strength |
|---|---|---|---|---|---|---|
| **R-1** | Every crates/design citation is repointed to its `docs/design/06-final/…` home. All 9 distinct paths resolve; the mapping is same-basename and was spot-checked on 5. | `make check-cited-paths` reports zero crates/design hits; census loses the corresponding rows | correctness | done | Repoints landed in `774e9eb`; remaining directory citation corrected in `2df2130`; `make check-cited-paths` passes at HEAD with 601 historical citations accepted. | reproduced |
| **R-2** | Every `examples/…` citation is repointed (6/6 have tracked homes). | as R-1 | polish | done | Repoints landed in `774e9eb`; cited-path gate green at HEAD; resolved rows deleted from the census. | reproduced |
| **R-3** | `docs/`, `packages/`, `assets/`, `test/` are walked **per citation**, and each is either repointed, or **frozen with a one-line reason** in the census row. No silent leave-behinds: the census delta must account for every path in these classes. | census diff + the reason column | serious | done with caveat | Live mixed-class findings were walked and either repointed, de-citationized as historical narration, or left under the existing operator dispositions in `D-2607-D3NL`, `D-2607-5TDW`, `D-2607-W2FJ`, and `D-2607-Q8LM`. Caveat: the census format has no reason column, so reasons are recorded in the close evidence and discovery rows rather than per TSV row. | reproduced |
| **R-4** | **The four decided-but-unmigrated files are moved**, and their citations now resolve. Not repoints — the destination was already chosen by a committed document. See `cc-prompt.md` §2. | `git ls-tree HEAD` on each destination; gate green on those four | serious | done | Four artifacts were added to their planned homes in `774e9eb`; follow-up citation cleanup inside them landed in `a3055c9`; gate green at HEAD. | reproduced |
| **R-5** | **No repoint made a sentence false.** Every citation inside a sentence that *narrates a move or rename* is left verbatim and marked frozen-by-carve-out. | CDC reads the diff sentence-by-sentence, not path-by-path | **serious** | done | Historical move/rename examples in 02/03 docs were fenced, unbackticked, or rephrased instead of silently repointed; migrated artifact internals were checked in `a3055c9`. | reproduced |
| **R-6** | The frozen census **shrank and did not grow**; the delta is recorded and equals the number of rows resolved. Regeneration is **not** permitted — delete resolved rows in place. | `git diff` on `scripts/cited-paths-census.tsv`: deletions only, zero additions | **serious** | done | Census shrank from 631 accepted pairs to 601 accepted pairs across `774e9eb` and `2df2130`; no rows were added. | reproduced |

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

At close, scope delivered matches the slice goal with one format caveat:
`scripts/cited-paths-census.tsv` remains a two-column exact-pair allowlist, so
the requested "reason column" was not introduced in this no-new-mechanism slice.
The reasons for residual frozen classes are carried in the operator disposition
rows and in `closing-report.md`.
