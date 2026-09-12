# arc16 slice07 - Current Book Drift Refresh Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required framework, planning, verification, lang, book, and writers-guide sources are read before edits | closing report lists each required source with a one-line role | serious | collaboration framework / arc16 plan | **done** | `closing-report.md` §1 | no stale-memory-only close |
| F-2 | Current repo states are recorded before edits | closing report records `git status --short --branch` for planning, lang 0.6.x, book, and writers-guide, preserving unrelated dirty state caveats | serious | slice close discipline | **done** | `closing-report.md` §2 | book `_to_delete/` preserved |
| F-3 | Current book fence gate is rerun against the live 0.6.x binary | closing report records exact commands, exit behavior, generated-file count, block count, skipped count, and pass/fail count | serious | slice06 bubble-up / A-4 | **done** | inventory §Current Book Fence Evidence | non-zero after Deno execution |
| F-4 | Every current failing book example is triaged | refreshed inventory lists source path, nearby lesson context, failure text/class, source-of-truth comparison, and disposition for each failing example | serious | slice06 failure inventory | **done** | inventory §Current Failure Triage | 27/27 rows classified |
| F-5 | Historical May drift inventory is reconciled against current heads | refreshed inventory maps historical rows/buckets to current status | serious | historical inventory | **done** | inventory §Historical May Inventory Reconciliation | historical rows treated as input |
| F-6 | Active planning-path drift is fixed or routed | sweeps over active surfaces show no current arc16 references to old source-doc planning home after sibling fixes | serious | planning migration | **done** | sibling diffs + closing report §5 | historical references retained |
| F-7 | Implementation/tooling/DevX defects discovered during triage are registered and routed | Discovery Register diff and new slice08 open set route `D-2609-FNRT` | serious | defect-routing rule | **done** | `backlog/discoveries.md`; `slice08-js-fn-return-parity/` | one implementation defect found |
| F-8 | Book-facing chapter work remains blocked until routing is clear | inventory and arc plan recommend inserted implementation slice08 before chapter slices | serious | implementation-first rule | **done** | inventory §Recommended Next Slice Order | normal chapter work remains blocked |
| F-9 | Normal chapter prose is not rewritten in this recon slice | scoped diffs show no book `src/` chapter edits | correctness | slice scope | **done** | `git diff --stat`; sibling diffs only touch instructions | chapter content untouched |
| F-10 | Planning/status surfaces are updated without touching unrelated work | arc16 arc plan, project plan/README/status, ledger, close report, and slice08 open set updated; explicit pathspec commits | serious | Expedited Mode / AGENTS.md | **done** | commit evidence | unrelated state preserved |
| F-11 | Required checks are run and recorded | closing report records scoped `git diff --check` and sibling checks | serious | AGENTS.md / arc16 verification strategy | **done** | `closing-report.md` §7 | no lang source/user docs edited |

## Closure

Closed by CC on 2026-09-12. Rows: 11. Done: 11. Deferred: 0. No-op: 0. Pending: 0. CDC verification pending.
