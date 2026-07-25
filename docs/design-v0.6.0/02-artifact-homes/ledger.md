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
| L-7 | **`make check` fails when a tracked document cites a repo-relative path that does not resolve in git *on that document's own branch***, with the file:line of the offending citation in the message | seeded-failure demo (add a bogus citation → red; remove → green), **run on at least two branches** | **serious** | **open — CC (spec revised 2026-07-25)** | — | — |
| L-8a | The existing corpus is swept and the dangling-citation census is recorded | run a sweep over HEAD; record counts | serious | **done** | **106 tracked docs cite 143 distinct `workbench/…` paths across 353 sites; 57 of those paths are already gone from disk.** Registered as `D-2607-D3NL` | reproduced (CDC, scripted) |
| L-8b | Every dangling citation is fixed, or dispositioned with a rationale recorded in `D-2607-D3NL` | walk the census against the chosen disposition | serious | **done — dispositioned** | **Operator decision 2026-07-25: option (a), accept and mark.** The 57 dead paths are purely historical; not salvaged, not repointed. Recorded as an accept-with-rationale closure on `D-2607-D3NL` (now in the register's `Closed` section, titled *accepted, not repaired*). The residual — the gate must not fail on the accepted class — is **not** left dangling: it is the frozen-census allowlist specified in the amendment below and in `cc-prompt.md`. *(CDC premise correction retained: L-8 was written assuming a small exemption class; the census showed exemptions are the dominant problem — shorthand fragments, pre-restructure paths, out-of-repo symlinks, and cross-branch reaches.)* | **reconciled** (the decision is the operator's and is recorded in two places) |
| L-9 | Bubble-up recorded: `project-plan.md` v1.38 with the plan-change discipline (what / which-child / why), P-21 opened, P-20 amended, `02-artifact-homes` listed as a standalone slice; `status.html` carries the learnings | read both | correctness | **done** | v1.38 + 3 new `issues` entries | reproduced (CDC) |

## Silent-drop diff (at close)

Scope-as-specified vs scope-as-delivered goes here at close. The three "out"
items in `slice-doc.md` are **disclosed deferrals with named homes**, not drops:
arc16's `arc-plan.md` → P-20; the `->>`/prelude question → register rows
`D-2607-K9RT` / `D-2607-W7KD` (`held-for-design`); the bootstrap duplicate and
the DD drafts → operator.


## Amendment 2026-07-25 — L-7 gains a branch dimension

`CLAUDE.md`'s new **"Which branch do I write to?"** rule states the check's real
contract, and it is stricter than L-7 was originally written:

> A path cited in a tracked document must resolve on **that document's own
> branch**.

That is not a rewording. The original row said "resolve in git", which a naive
implementation satisfies by asking whether the path exists in *any* ref. Under
the branch rule it must resolve against **the branch being checked** — i.e.
`git ls-tree HEAD`, never `git ls-tree --all`, and never the working tree.

**Why this is the version that matters.** In the day between writing L-7 and
amending it, three real dangling citations appeared and were fixed by hand, and
**every one of them was cross-branch, not typo'd**:

- `inventory.md` §9 cited `../../../../../docs/ecmascript-2025/function-heads.md`
  — deliberately reaching out of `release/0.7.x` into a `main` checkout because
  the corpus was `main`-only. A path that resolved for its author and for nobody
  fetching that branch alone.
- Ledger R-1 carried the same reach in prose.
- `D-2607-L7BX` recorded the split as an open operator call.

All three were then silently *un*-broken by a rebase that carried the corpus
onto `release/0.7.x`. **The check is the only thing that would have reported
either transition.** A per-branch check catches the break; re-running it after
a merge or rebase reports the repair. Neither event announced itself.

**Consequences for the implementation (CC):**

1. Resolve against `HEAD` of the current checkout. A file present in the working
   tree but untracked must **fail** — that is the original register bug.
   A file present on another branch must **also fail** on this one.
2. `make check` runs per-branch, so the gate is only as good as where it runs.
   Say plainly in the closing report which branches were exercised.
3. The exemption design (L-8b) now has a **fourth** class alongside shorthand
   fragments, pre-restructure paths, and out-of-repo symlinks: **deliberate
   cross-branch citations**. Do not add a blanket escape for them — under the
   new rule they are precisely the thing being outlawed. If a unit genuinely
   needs data from another branch, the answer is to get the data onto its branch
   (which is what the rebase did here), not to exempt the citation.
4. `CLAUDE.md` is byte-identical on every branch by rule, so it is the one file
   whose citations must resolve on **all** branches. Worth a dedicated case.


## Amendment 2026-07-25 (2) — L-8b closed, and what the exemption must look like

**Operator disposition: option (a), accept and mark.** The historical corpus is
not salvaged. That closes L-8b as a *decision* and leaves exactly one buildable
consequence, which is L-7's exemption mechanism.

**The design, and why it is not a loophole.** `workbench/` is gitignored by
rule, so a `workbench/…` citation can **never** resolve in git — not today, not
after any commit. Exempting the prefix outright would therefore look like the
obvious move, and it is wrong: `CLAUDE.md` now says *nothing durable, nothing
cited*, so a **new** `workbench/` citation is precisely the thing the gate
exists to reject. Same prefix, opposite verdicts.

Resolve it by **age, mechanically** — a **frozen census allowlist**:

1. Generate it **once**, from today's census: the 143 distinct `workbench/…`
   paths and the 106 files citing them, as `(file, path)` pairs. Commit it as
   data next to the check.
2. The gate exempts a `workbench/` citation **only if the exact `(file, path)`
   pair is in the snapshot**. Everything else fails.
3. **Never append to it.** The file is a historical record, not a config. A new
   citation cannot be silenced by adding a line — and if someone does, the diff
   says so in review, which is the whole point.
4. Add a header to the snapshot naming it as the closure of `D-2607-D3NL`, so a
   reader who finds it later understands it is an accepted class rather than a
   backlog of unfixed work.

This makes the exemption **self-closing**: it can only shrink (as historical
documents are edited or retired), never grow. Contrast the blanket allowlist the
original L-8 imagined, which grows every time someone finds it inconvenient —
the mechanism by which an exemption list becomes the bug.
