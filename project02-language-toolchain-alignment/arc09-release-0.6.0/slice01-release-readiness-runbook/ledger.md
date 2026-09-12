# arc09 slice01 - Release Readiness Runbook Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| R-1 | Required project/repo guidance is read before planning | close report lists AGENTS, project plan/ledger, arc09 plan/ledger, arc16 close/CDC evidence, and release docs read | serious | project-management | open | | planning/source/book split must remain intact |
| R-2 | Version surfaces are inventoried | manifest of every file/command that carries 0.6.0 version state | correctness | release cut | open | | Rust crates, JS packages, CLI, docs, book tag references |
| R-3 | Release-note inputs are inventoried | list of closed arcs/discoveries/user-visible changes feeding release notes | serious | P-12 | open | | include breaking/compatibility notes and deferred items |
| R-4 | Publish dry-run gates are specified | commands and expected artifacts for JSR, npm, crates.io dry-runs | correctness | arc01/P-8/P-12 | open | | no real publish in this slice |
| R-5 | Manual publication and approval boundaries are explicit | runbook separates CC-preparable work from operator-owned publish/tag steps | serious | operator publishing boundary | open | | Duncan handles manual publishes |
| R-6 | Post-publish verification is specified | install/artifact/tag verification steps are named with evidence homes | correctness | P-12 | open | | include temporary install directory convention |
| R-7 | Blockers and release chores are routed | discoveries, slice insertions, or explicit no-blocker statement | serious | project-management | open | | include CI maintenance if it remains release-relevant |
| R-8 | Arc09 plan, ledger, and status surfaces are updated | arc09 plan/ledger/status and next slice prompt reflect actual findings | serious | Expedited Mode | open | | no silent release-plan gaps |

## Closure

Open. Rows: 8. Done: 0. Deferred: 0. No-op: 0. Pending: 8.
