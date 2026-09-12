# arc16 slice07 - Current Book Drift Refresh Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required framework, planning, verification, lang, book, and writers-guide sources are read before edits | closing report lists each required source with a one-line role | serious | collaboration framework / arc16 plan | open | | prevents recon from stale memory |
| F-2 | Current repo states are recorded before edits | closing report records `git status --short --branch` for planning, lang 0.6.x, book, and writers-guide, preserving unrelated dirty state caveats | serious | slice close discipline | open | | planning currently has unrelated project05 edits; book may have `_to_delete/` |
| F-3 | Current book fence gate is rerun against the live 0.6.x binary | closing report records exact `--fence lisp` and mixed `--fence lisp --fence lykn` commands, exit behavior, generated-file count, block count, skipped count, and pass/fail count | serious | slice06 bubble-up / A-4 | open | | expected non-zero is acceptable only after Deno execution is reached |
| F-4 | Every current failing book example is triaged | refreshed inventory lists source path, nearby lesson context, failure text/class, source-of-truth comparison, and disposition for each failing example | serious | slice06 failure inventory | open | | no silent failure buckets |
| F-5 | Historical May drift inventory is reconciled against current heads | refreshed inventory maps historical rows/buckets to current status: open, closed, obsolete, routed, duplicate, deferred, or no-op | serious | `design/book-drift-inventory-0.6.0.md` | open | | historical inventory is input, not authority |
| F-6 | Active planning-path drift is fixed or routed | targeted sweeps over lang/book/writers-guide instruction surfaces show no active references treating `.worktrees/0.6.x/docs/design-v0.6.0/...` as the current arc16 planning home, or the close report lists remaining references with rationale | serious | 2026-09-06 planning migration / operator clarification | open | | sibling `AGENTS.md` files are known suspects at open |
| F-7 | Implementation/tooling/DevX defects discovered during triage are registered and routed | Discovery Register diff or close report shows new/updated rows with owning arc/slice or explicit deferral and re-entry condition | serious | defect-routing rule | open | | do not normalize defects away in prose |
| F-8 | Book-facing chapter work remains blocked until routing is clear | refreshed inventory and close report recommend the next executable slice: slice08, slice09, a newly inserted implementation slice, or an explicit deferral path | serious | implementation-first rule | open | | arc16 may grow new slices |
| F-9 | Normal chapter prose is not rewritten in this recon slice | scoped diffs show no chapter content rewrites except explicitly justified minimal instruction/path corrections | correctness | slice scope | open | | keeps recon separate from chapter editing |
| F-10 | Planning/status surfaces are updated without touching unrelated work | arc16 arc plan, project plan, README, consolidated project/arc status files under `planning/status/`, and this ledger reflect slice07 state; commit uses explicit pathspecs and excludes unrelated project05 planning edits | serious | Expedited Mode / AGENTS.md | open | | close-set files are created only at close |
| F-11 | Required checks are run and recorded | closing report records scoped `git diff --check`; sibling checks if edited; and 0.6.x `make test-docs` / `make check-cited-paths` if lang source/user docs or Discovery Register files are edited there | serious | AGENTS.md / arc16 verification strategy | open | | planning-only opens need scoped checks because other planning work is dirty |

## Closure

Open as of 2026-09-12. Rows: 11. Done: 0. Deferred: 0. No-op: 0. Pending: 11.
