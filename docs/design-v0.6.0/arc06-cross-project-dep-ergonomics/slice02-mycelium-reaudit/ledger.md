# arc06 · slice02 — Ledger (Mycelium re-audit, recon-only)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. The deliverable
is a findings document; rows verify the audit is **complete and honest**. Host
reproductions are CC-attested (mycelium is host-only); reconcile on an operator/
fresh-CC host re-run. CDC verifies completeness + internal consistency against
`lang` (the "fixed" cites) — CDC cannot see mycelium.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `reaudit-findings.md` dispositions **all 14** `mycelium-bootstrap-issues.md` issues (fixed / partial / open). | grep the findings: 14 issue IDs, each with a disposition | serious | arc-plan A-7 | **done** | 14/14: 9 fixed (#1/2/3/4/5/7/9/12/14), 1 partial (#8), 2 open (#6/#11), 1 no-op (#10), 1 design (#13) | no issue skipped |
| F-2 | Every **fixed** disposition cites the 0.6.0 arc/commit that fixed it (traceable in `lang`). | each "fixed" row names an arc/SHA CDC can confirm in `lang` | correctness | recon discipline | **done** | #1/5/7→arc03/arc10; #2→0.5.2/V-08; #8→arc02; #14/#3→arc01/arc11; #9/#4/#12→CLI. Each: old repro no longer reproduces (probe outputs) | audit @ `486f2eb` |
| F-3 | Every **open/partial** disposition carries a **concrete reproduction** — the failing command + its output against current `release/0.6.x`. | read the findings: reproduction block per open/partial issue | serious | "assertions ≠ evidence" | **done** | #6 `((express parts):join "")`→`parts.value("join","")`; #11 `VOID-ELEMENTS` used→`unused binding`; #8 slow-types warning + 26 B `.d.ts`. Commands + output in findings | ground truth |
| F-4 | **New friction** (issues not in the original 14, hit against current lykn) is cataloged, each with a reproduction. | findings "new friction" section | serious | arc-plan | **done** | N1 (`lykn test` relative `.js` under `target/` — baseline repro), N2 (manual re-point), N3 (`build --dist`→`dist`), N4 (surface-name warning) | N1 is the arc's acceptance gap |
| F-5 | **Routing table** — every open/partial item (original + new) routed to a home: arc06 slice03 / slice04 / compiler-follow-up (with fix-in-0.6.0-vs-post recommendation) / arc07 / post-0.6.0 (with re-entry). | table maps each open item → home; count matches the open set | correctness | arc ledger A-7 | **done** | §Routing: 12 rows → homes with 0.6.0-vs-post; #6 recommended for 0.6.0 (silent miscompile), N1→slice04, N2→slice03 | anti-silent-drop |
| F-6 | The mycelium **baseline** is recorded: does `lykn build` + `lykn test` run against current lykn from mycelium, and the pass/fail + output. | findings baseline section (commands + output) | serious | arc-plan | **done** | `lykn build` rc=0 (both pkgs → `target/`); `lykn test` rc=1 (N1). Commands + output in §Baseline | acceptance-corpus start |
| F-7 | A **`lykn add` requirements read** is captured — the specifier forms downstream needs (jsr:/npm:/workspace), the `project.json`/import-map edits, version/cache behaviour — as the DD-63 input. | findings "lykn add requirements" section | correctness | arc-plan / DD-63 | **done** | §`lykn add` requirements (5 points + N1 corollary); `lykn add` confirmed absent. Key: local⇄registry switch + version-pinning + bare/slash pair | scopes slice03 |
| F-8 | **Recon-only**: no changes to `crates/`/`packages/`/compiler/`lykn new`; the diff is the findings doc only. | `git show --stat` = docs/findings only; no source | serious | recon discipline | **done** (CC-attested) | zero source changes; only untracked `reaudit-findings.md`+`closing-report.md` are mine. mycelium re-point on throwaway `audit/0.6.0-reaudit`; `smoke`/`main` restored | tempting fixes (#6/#11/N1) routed, not landed |

## What Worked

- **The probe-the-un-worked-around-form method settled the toolchain-bug class
  fast.** Compiling minimal snippets of the *original* (pre-workaround) forms
  (#1/#5/#6/#7) gave unambiguous fixed/open verdicts in one pass — no need to
  edit mycelium. #1/#5/#7 fixed (valid JS now), #6 still miscompiles.
- **The baseline caught the real gap the 14-issue list didn't have.** N1
  (`lykn test`'s relative `.js` import failing under `target/`) is the arc's
  central acceptance problem and is *new* — a direct product of arc11 shipping.
  Running, not reading, surfaced it.
- **The re-point *was* the evidence.** M1's manual awkwardness (build-dir path,
  `mod.js` entry, bare/slash pair) is the concrete `lykn add`/DD-63 requirement —
  the friction the arc exists to remove.

## Closure

Closed at commit `<CDC-fills>` on 2026-07-22 (CC-attested; runtime rows —
`lykn build`/`test`/`publish --dry-run` + compile probes — reconcile on an
operator/fresh-CC host re-run at `486f2eb`+). Rows: 8. Done: 8. Deferred: 0.
No-op: 0. **Recon-only; empty source diff.**
_(On close: CDC verifies the fixed→arc cites against `lang`, drafts DD-63 from
F-7, and details slices 03/04 against the F-5 routing table — adopting N1
[downstream `lykn test` green] as A-6's concrete bar.)_
