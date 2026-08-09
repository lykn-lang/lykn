# arc16 / slice01 CDC Verification: pre-book-decision-gate

**Verdict: accepted - slice01 closed/CDC-verified.** CC's close at `00b3338`
delivered the decision packet requested by the slice: it re-grounded the May
book inventory and the dogfood findings against current lang, book, and
writers-guide state, then routed the remaining choices before book prose starts.

This closes the slice as a decision gate. It does not mean the operator has made
every decision in the packet yet. The arc remains open, and the next slice must
plan against the routed decision state recorded here and in `arc-plan.md`.

## Verification

| Check | Result | Evidence strength |
|---|---|---|
| Commit scope | `git show --stat --summary --format=fuller HEAD` shows `00b3338` added `closing-report.md` and updated only this slice's `ledger.md`; the required co-author trailers are present. | reproduced |
| Worktree state | `git status --short` reported no local changes before CDC edits. | reproduced |
| Ledger closure | The opening ledger had F-1 through F-10; the closed ledger marks F-1 through F-10 `done`, with no missing or still-open rows. | reproduced by artifact review |
| Closing report completeness | `closing-report.md` includes source material read, current-state evidence, a D-1...D-5 plus discovery decision table, a row-by-row ledger walk, bubble-up to the arc, and verification transcript. | reproduced by artifact review |
| Sibling book status | `git -C /Users/oubiwann/lab/cnbb/lykn status --short --branch` reported `## main` plus untracked `_to_delete/`; no book files were edited by this slice. | reproduced |
| Sibling writers-guide status | `git -C /Users/oubiwann/lab/cnbb/lykn-writers-guide status --short --branch` reported `## main`; no dirty entries. | reproduced |
| Sibling instruction files | `git ls-files -s` in both sibling repos shows tracked `AGENTS.md` mode `100644` and tracked `CLAUDE.md` mode `120000`; `readlink` returns `AGENTS.md` in both repos. | reproduced |
| Book verification gap | The absolute external book example-test directory check exited 1, so the historical example-test tree is still absent. | reproduced |
| Book fence census | `rg -o '^```[A-Za-z0-9_-]+' src -g '*.md'` over the book repo reported 444 `lisp` fences and 3 `lykn` fences, plus non-Lykn tags. | reproduced |
| Book ToC shape | `src/SUMMARY.md` currently lists Ch 0 through Ch 38, and the appendix sweep found no appendix entries. | reproduced |
| Current docs-test surface | `./bin/lykn test --docs docs/guides/00-lykn-surface-forms.md --fence lisp` exited 2 with `unexpected argument '--fence'`; `crates/lykn-cli/src/doctest.rs` extracts `lykn` fences today. | reproduced |
| Stale writers-guide guidance | `rg` over writers-guide files reproduced stale old source paths, raw Deno test commands, `lisp` fence guidance, and absent external example-test references. | reproduced |
| Whitespace check | `git diff --check` exited 0. | reproduced |
| Cited-path gate | `make check-cited-paths` passed: 603 documents on `release/0.6.x`, with 601 historical citations accepted via `scripts/cited-paths-census.tsv`. | reproduced |
| Docs gate | `make test-docs` passed: 476 passed, 0 failed. | reproduced |

## Row Walk

| ID | CDC disposition |
|----|-----------------|
| F-1 | Accepted. The close report lists every required slice source, historical design source, sibling repo source, and supporting implementation snippet used for the packet. |
| F-2 | Accepted. CDC reproduced the current lang/book/writers-guide status facts, sibling instruction-file symlinks, absent external book example-test tree, and book ToC/config evidence. |
| F-3 | Accepted. D-1 through D-5 each have current evidence, options, recommendation, operator-input classification, impact, and proposed routing home. |
| F-4 | Accepted. D-1 and `D-2607-R4NW` are reconciled together; the packet recommends fence-first reachability plus later targeted external tests, rather than assuming the old absent suite. |
| F-5 | Accepted. `D-2608-XPRT` names the current inline export/re-export behavior, the top-of-module export option, implementation risk, and routing home. |
| F-6 | Accepted. `D-2608-LBND` distinguishes keeping repeated binds, extending `bind`, adding a `let`/`let*`-style grouped local form, and deferral. |
| F-7 | Accepted. `D-2608-COND` compares guard clauses, `cond`, `?`, `if`, and `match`, and notes the no-else expression-position interaction. |
| F-8 | Accepted. `D-2608-SOWN` preserves user-owned non-Lykn source freedom while separating Lykn-owned generated/config artifacts. |
| F-9 | Accepted with bubble-up. The report recommends slice02 next, slice03 before chapter code edits, and explicit implementation slices for accepted surface changes. |
| F-10 | Accepted. CDC reproduced `git diff --check`, `make check-cited-paths`, and `make test-docs`. |

## Bubble-Up

slice01 delivered its assigned arc16 piece: the pre-book decision packet exists,
the stale May assumptions have been checked against current state, and the
remaining work is now separated into operator decisions, implementation routes,
and book/writers-guide documentation routes.

The arc plan did need a slice-close update before slice02 opens. CDC updated the
arc plan to mark slice01 closed, record that D-3 is resolved by the tracked
lang planning home, record the fence-first recommendation for D-1 /
`D-2607-R4NW`, and mark `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and
`D-2608-SOWN` as explicit operator decisions that can block later chapter slices
or spawn implementation work.

No sibling book or writers-guide files were edited in this verification pass.
arc16 remains open, and P-20 remains open, because the book edition and its
implementation/doc follow-ups have not yet closed.

## What Worked

The decision-gate slice paid for itself: it turned a stale May book plan into a
current set of choices with evidence. The most useful pattern was treating old
inventory rows as hypotheses to re-prove, not as commands to carry forward.
