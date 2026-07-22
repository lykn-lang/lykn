# arc06 · slice02 — Ledger (Mycelium re-audit, recon-only)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. The deliverable
is a findings document; rows verify the audit is **complete and honest**. Host
reproductions are CC-attested (mycelium is host-only); reconcile on an operator/
fresh-CC host re-run. CDC verifies completeness + internal consistency against
`lang` (the "fixed" cites) — CDC cannot see mycelium.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `reaudit-findings.md` dispositions **all 14** `mycelium-bootstrap-issues.md` issues (fixed / partial / open). | grep the findings: 14 issue IDs, each with a disposition | serious | arc-plan A-7 | open | | no issue skipped |
| F-2 | Every **fixed** disposition cites the 0.6.0 arc/commit that fixed it (traceable in `lang`). | each "fixed" row names an arc/SHA CDC can confirm in `lang` | correctness | recon discipline | open | | e.g. #14→arc01/arc11, #2→0.5.2, #8→arc02 |
| F-3 | Every **open/partial** disposition carries a **concrete reproduction** — the failing command + its output against current `release/0.6.x`. | read the findings: reproduction block per open/partial issue | serious | "assertions ≠ evidence" | open | | ground truth, not recall |
| F-4 | **New friction** (issues not in the original 14, hit against current lykn) is cataloged, each with a reproduction. | findings "new friction" section | serious | arc-plan | open | | the toolchain moved; new gaps expected |
| F-5 | **Routing table** — every open/partial item (original + new) routed to a home: arc06 slice03 / slice04 / compiler-follow-up (with fix-in-0.6.0-vs-post recommendation) / arc07 / post-0.6.0 (with re-entry). | table maps each open item → home; count matches the open set | correctness | arc ledger A-7 | open | | the anti-silent-drop artifact |
| F-6 | The mycelium **baseline** is recorded: does `lykn build` + `lykn test` run against current lykn from mycelium, and the pass/fail + output. | findings baseline section (commands + output) | serious | arc-plan | open | | the acceptance-corpus starting point |
| F-7 | A **`lykn add` requirements read** is captured — the specifier forms downstream needs (jsr:/npm:/workspace), the `project.json`/import-map edits, version/cache behaviour — as the DD-63 input. | findings "lykn add requirements" section | correctness | arc-plan / DD-63 | open | | scopes slice03 |
| F-8 | **Recon-only**: no changes to `crates/`/`packages/`/compiler/`lykn new`; the diff is the findings doc only. | `git show --stat` = docs/findings only; no source | serious | recon discipline | open | | tempting one-line fixes are *routed*, not landed |

## What Worked

_(At slice close.)_

## Closure

Closed at commit `<SHA>` on `<date>`. Verified by: `<CDC session>`.
Rows: 8. Done: _. Deferred: _. No-op: _.
_(Recon-only; empty source diff. On close: CDC drafts DD-63 from F-7 and details
slices 03/04 against the F-5 routing table.)_
