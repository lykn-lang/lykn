# Ledger — `02-artifact-homes`

Rows are the contract. Every row reaches a final status before the slice
advances. Evidence strengths: `asserted` < `attested` < `reproduced` <
`reconciled`. Closer ≠ verifier.

| ID | Acceptance criterion | Verify | Sev | Status | Evidence | Strength |
|----|----------------------|--------|-----|--------|----------|----------|
| L-1 | Discovery Register lives at `docs/backlog/discoveries.md`, tracked, content byte-identical to the workbench original apart from a disclosed relocation note + one `Source material` path fix | `git ls-files docs/backlog/discoveries.md`; diff vs. the pre-move copy | serious | **done** | moved 2026-07-25; header carries the relocation note naming the five prior citations | reproduced (CDC) |
| L-2 | `docs/backlog/README.md` exists and carries: row format, sections, closing, triage, **and the routing rule** stated as *"a row is not `routed` until the destination file exists in git and contains it"* | read the file; grep for the rule verbatim | serious | **done** | 97 lines; rule stated as a blockquote under its own heading | reproduced (CDC) |
| L-3 | Owed-0.7.x rows have a tracked home at `docs/backlog/owed-0.7.x-rows.md` | `git ls-files` | polish | **done** | moved 2026-07-25 | reproduced (CDC) |
| L-4 | arc16's planning home exists at `docs/design-v0.6.0/arc16-book-0.6.0-edition/` and its four source artifacts are tracked under `design/` (drift inventory, kickoff thread, fence-wiring spec, dogfooding friction log) | `ls` the dir; `git ls-files` | serious | **done** | fence-wiring spec also moved out of the loose root-level file; friction log relocated from the book repo's ignored `workbench/` | reproduced (CDC) |
| L-5 | `CLAUDE.md` in **all three** repos records the artifact layout, the `workbench/`-is-scratch rule, and the cited-path rule; book + writers-guide point at the lang planning home | read all three | serious | **done** | lang: new §"Where non-planning artifacts live"; book + writers-guide: created (neither had one) | reproduced (CDC) |
| L-6 | `fences.lykn` has a tracked home in the book repo | `git status` in `~/lab/cnbb/lykn` | polish | **done** | `tools/book-audit/fences.lykn` | reproduced (CDC) |
| L-7 | **`make check` fails when a tracked document cites a repo-relative path that does not resolve in git**, with the file:line of the offending citation in the message | seeded-failure demo (add a bogus citation → red; remove → green) | **serious** | **open — CC** | — | — |
| L-8a | The existing corpus is swept and the dangling-citation census is recorded | run a sweep over HEAD; record counts | serious | **done** | **106 tracked docs cite 143 distinct `workbench/…` paths across 353 sites; 57 of those paths are already gone from disk.** Registered as `D-2607-D3NL` | reproduced (CDC, scripted) |
| L-8b | Every dangling citation is fixed, or dispositioned with a rationale recorded in `D-2607-D3NL` | walk the census against the chosen disposition | serious | **open — operator decision first** | **CDC premise correction:** L-8 was written assuming a small exemption class. The census says the exemption problem is the *dominant* problem — three-plus distinct classes (shorthand fragments, pre-restructure historical paths, deliberately out-of-repo symlinks) on top of genuine dangles. Disposition options in the register row | — |
| L-9 | Bubble-up recorded: `project-plan.md` v1.38 with the plan-change discipline (what / which-child / why), P-21 opened, P-20 amended, `02-artifact-homes` listed as a standalone slice; `status.html` carries the learnings | read both | correctness | **done** | v1.38 + 3 new `issues` entries | reproduced (CDC) |

## Silent-drop diff (at close)

Scope-as-specified vs scope-as-delivered goes here at close. The three "out"
items in `slice-doc.md` are **disclosed deferrals with named homes**, not drops:
arc16's `arc-plan.md` → P-20; the `->>`/prelude question → register rows
`D-2607-K9RT` / `D-2607-W7KD` (`held-for-design`); the bootstrap duplicate and
the DD drafts → operator.
