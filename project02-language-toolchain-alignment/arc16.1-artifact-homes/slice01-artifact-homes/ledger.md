# Ledger — `02-artifact-homes`

Rows are the contract. Every row reaches a final status before the slice
advances. Evidence strengths: `asserted` < `attested` < `reproduced` <
`reconciled`. Closer ≠ verifier.

| ID | Acceptance criterion | Verify | Sev | Status | Evidence | Strength |
|----|----------------------|--------|-----|--------|----------|----------|
| L-1 | Discovery Register lives at `docs/backlog/discoveries.md`, tracked, content byte-identical to the workbench original apart from a disclosed relocation note + one `Source material` path fix | `git ls-files docs/backlog/discoveries.md`; diff vs. the pre-move copy | serious | **done** | moved 2026-07-25; header carries the relocation note naming the five prior citations | reproduced (CDC) |
| L-2 | `backlog/README.md` exists and carries: row format, sections, closing, triage, **and the routing rule** stated as *"a row is not `routed` until the destination file exists in git and contains it"* | read the file; grep for the rule verbatim | serious | **done** | 97 lines; rule stated as a blockquote under its own heading | reproduced (CDC) |
| L-3 | Owed-0.7.x rows have a tracked home at `docs/backlog/owed-0.7.x-rows.md` | `git ls-files` | polish | **done** | moved 2026-07-25 | reproduced (CDC) |
| L-4 | arc16's planning home exists at `docs/design-v0.6.0/arc16-book-0.6.0-edition/` and its four source artifacts are tracked under `design/` (drift inventory, kickoff thread, fence-wiring spec, dogfooding friction log) | `ls` the dir; `git ls-files` | serious | **done** | fence-wiring spec also moved out of the loose root-level file; friction log relocated from the book repo's ignored `workbench/` | reproduced (CDC) |
| L-5 | `AGENTS.md` in **all three** repos records the artifact layout, the `workbench/`-is-scratch rule, and the cited-path rule; book + writers-guide point at the lang planning home | read all three | serious | **done** | 2026-08-08 remediation: lang `AGENTS.md` already tracked; book commit `91fee17` and writers-guide commit `a042e18` add tracked `AGENTS.md`, make `CLAUDE.md` a symlink to it, and record the assistant-authored commit trailers. | reproduced (CDC) |
| L-6 | `fences.lykn` has a tracked home in the book repo | `git status` in `~/lab/cnbb/lykn` | polish | **done** | 2026-08-08 remediation: book commit `91fee17` tracks `tools/book-audit/fences.lykn`; `git ls-files -s AGENTS.md CLAUDE.md tools/book-audit/fences.lykn` shows `AGENTS.md`, symlink-mode `CLAUDE.md`, and the fence tool. | reproduced (CDC) |
| L-7 | **`make check` fails when a tracked document cites a repo-relative path that does not resolve in git *on that document's own branch***, with the file:line of the offending citation in the message | seeded-failure demo (add a bogus citation → red; remove → green), **run on at least two branches** | **serious** | **done — CC** | `scripts/check-cited-paths.js` + 22 tests in `test/integration/cited-paths.test.js`; `check-cited-paths` target in `common-checks` → `make check`. Resolves against `git ls-tree -r HEAD` (never `--all`, never the filesystem). Seeded-failure demo: 4 seeds → 4 hits with `file:line`, exit 1; removed → exit 0. **Three branches** exercised: `release/0.6.x` (2 live — see below), `main` (1), `release/0.7.x` (**15, of which 14 are new real defects**). Full walk in `closing-report.md`. | **attested (CC)** — `make check`'s composite green reconciles on the operator's host |
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

`AGENTS.md`'s new **"Which branch do I write to?"** rule states the check's real
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
4. `AGENTS.md` is byte-identical on every branch by rule, so it is the one file
   whose citations must resolve on **all** branches. Worth a dedicated case.


## Amendment 2026-07-25 (2) — L-8b closed, and what the exemption must look like

**Operator disposition: option (a), accept and mark.** The historical corpus is
not salvaged. That closes L-8b as a *decision* and leaves exactly one buildable
consequence, which is L-7's exemption mechanism.

**The design, and why it is not a loophole.** `workbench/` is gitignored by
rule, so a `workbench/…` citation can **never** resolve in git — not today, not
after any commit. Exempting the prefix outright would therefore look like the
obvious move, and it is wrong: `AGENTS.md` now says *nothing durable, nothing
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


## Implementation note 2026-07-25 (CC) — what the build changed about the above

L-7 and L-8's buildable halves are delivered; the walk is in `closing-report.md`.
Four things the amendments above did not anticipate, recorded here because the
amendments are the spec a future reader will start from:

1. **The census is twice the assumed size, and only half of it is `workbench/`.**
   631 `(file, path)` pairs / 307 distinct paths / 174 citing files, against the
   amendment's "143 paths × 106 files". The gap is not a discrepancy: CDC's sweep
   looked for `workbench/…` only, and the gate checks *every* repo-relative
   citation. The 325 non-workbench pairs — renamed packages, migrated tests,
   pre-restructure trees — are the same accept-and-mark class by the same
   argument; they were simply never measured. **The operator's disposition is
   read as covering them.** If that reading is wrong, the census needs splitting.

2. **The census is generated from HEAD's committed content, not the working
   tree.** Not in the amendment, but forced by it: a snapshot that reads the
   working tree lets an in-flight edit in someone else's checkout become a
   permanent accepted exemption. The gate itself still reads the working tree,
   so breakage surfaces *before* the commit that would bake it in.

3. **Point 4 of the first amendment does not hold as written.** `AGENTS.md` has
   eight dangling citations, and three of the four classes are things it must say
   by its own governance design — the routing table's own 0.7.0 target, the
   `workbench/`-is-scratch rule naming `workbench/`, and skill paths it itself
   calls conditional. The branch rule outlaws the document carrying it.
   `closing-report.md` §8 states the case and recommends a resolution that goes
   against the amendment's letter; **that one is the operator's.**

4. **A report about broken paths cannot cite them.** This report tripped the gate
   17 times on its first draft, all correctly. Resolved by convention (fenced
   blocks / unbackticked prose), not by mechanism — see `closing-report.md` §11.
   It also exposed that "fenced blocks are not scanned" was *accidentally* true
   rather than implemented; fence state is now tracked and regression-tested.


## Amendment 2026-07-25 (3) — CDC retracts point 4; two decisions returned to the operator

Written after CC delivered L-7/L-8. **This amendment corrects the first one.**

### Point 4 is withdrawn

Amendment (1) point 4 read: *"`AGENTS.md` is byte-identical on every branch by
rule, so it is the one file whose citations must resolve on **all** branches."*

**That is wrong, and CC's gate proved it in one run.** `AGENTS.md` carries eight
citations that cannot resolve on `release/0.6.x`, and at least four of them are
things the document **must** say to do its job: the routing table names
docs/design-v0.7.0; the scratch rule names `workbench/`; the worktree
protocol names `.worktrees/0.6.x/` and `.worktrees/0.7.x/`. **A routing table's
purpose is to name places that do not exist here.** The rule as I wrote it
outlaws the document that carries it.

I derived point 4 as a consequence of "byte-identical everywhere" and never
opened `AGENTS.md` to see what the consequence implied. Registered as
`D-2607-W2FJ`; it is the fourth *consequence-not-walked* instance this week and
the first where the unwalked path was my own rule.

**CDC endorses CC's §8 proposal** and returns it to the operator because it
contradicts this ledger's letter: exempt a sibling release's planning tree
**only when that tree is absent from `HEAD` entirely** — *a missing root is a
branch-ownership fact; a missing leaf under a present root is a bug.* It keeps
the teeth exactly where they earn their keep.

### The census is bigger than the amendment assumed — and that is not a discrepancy

Amendment (1) specified the frozen allowlist as "143 paths × 106 files". CC's
census is **631 pairs / 307 paths / 174 files**, split **306 `workbench/` : 325
other**. Reconciled: my sweep was **`workbench/`-scoped and said so** — the
general sweep I ran returned ~436 hits which I explicitly marked untrustworthy
and did not use. CC measured the half I declined to. My 353 *sites* and CC's 306
*distinct pairs* are the same measurement at different granularity. **No numbers
conflict; CC's are the better ones and supersede mine.**

**Open for the operator:** does the option-(a) disposition extend to the 325
non-`workbench` pairs (renamed packages/lykn, migrated
`test/surface/*.test.js`, `crates/design/…`)? They are the same accept-and-mark
class by the same argument. **One honest difference:** a `workbench/` path can
*never* resolve — it is gitignored by rule — whereas a renamed path *could* be
mechanically repointed to its new home, and repointing would restore
navigability. Freezing them is therefore a slightly larger concession than
freezing the `workbench/` half. It is still the right call if the answer to
*"will anyone open these?"* is no; and a later mechanical repoint pass stays
cheap if that answer changes.

### Self-reference: a report about broken paths cannot cite them

CC's report tripped the gate 17 times on its first draft, **all correctly**, and
resolved it by **convention** — fenced blocks and unbackticked prose — rather
than by adding an inline-suppression mechanism, noting that `Makefile:308`
records the house position against inline suppression and *a gate landing today
should not quietly reverse a standing position*.

**CDC agrees, and would make the convention explicit rather than leave it as
this document's habit:** *documents that discuss dangling paths cite them in
fenced blocks, not inline code.* Write it next to the gate. The mechanism
alternative is the thing the house already rejected, and one new check is not
grounds to reopen it.

### The gate is red on `release/0.6.x`, and one of the two causes is mine

`slice04-sibling-traps/liveness-recheck.md` — written by CDC at 01:32, cited
from `arc-plan.md`, `discoveries.md`, and CC's own `closing-report.md` — is
untracked. **The register bug reproduced itself the same day the gate landed,
and I am the one who reproduced it.**

It is not carelessness on anyone's part; it is two rules composing, and it will
recur every session. Registered as `D-2607-Q8LM` with three options and a
recommendation (**accept red-until-commit**: the contract is *green at `HEAD`
after the operator commits*, not *green continuously* — a dirty tree reading red
is arguably correct, since the citations genuinely do not resolve for anyone
else yet). **Whichever is chosen, it belongs in `AGENTS.md` next to the gate.**
An unexplained red is how a good gate gets disabled.


## Amendment 2026-07-25 (4) — disposition split: freeze the unresolvable, repoint the migrated

**Operator, 2026-07-25.** The option-(a) freeze does **not** extend wholesale to
the 325 non-`workbench` pairs. The rule is now:

> **Any citation whose target migrated to a location that is tracked should be
> updated — unless updating it would damage the accuracy of the historical
> record.**

### The carve-out, stated precisely, because it is the part that gets fumbled

Repoint a **reference to** an artifact. Never rewrite a sentence that
**narrates the move itself**. *"See packages/lykn/mod.js"* is a reference —
repoint it. *"packages/lykn was renamed to `packages/lang/` in M17"* is
history — both paths must survive verbatim, and freezing that citation is
correct. **When in doubt, read the sentence, not the path.** A repoint that
turns a true sentence false is worse than a dangling path, because the dangling
path is at least visibly broken.

### The classification (from the census, 325 non-`workbench` pairs)

| Class | Count (pairs) | Disposition |
|---|---|---|
| `test/` — migrated test files | 127 | **Repoint** where the file exists at a tracked path today |
| `docs/` — mixed | 105 | **Split**: repoint real migrations; freeze docs/archive, docs/design-v0.5.x (never created) |
| `assets/` — mostly `assets/ai/*` | 39 | **Freeze.** `/assets/ai` is gitignored (a symlink dir); these can never resolve |
| `packages/` — renamed packages/lykn | 26 | **Repoint**, minus any narration-of-the-rename |
| `crates/design/{dev,docs}/…` | 20 | **Repoint** — the DDs live under `docs/design/` under the *same numbering*; spot-checked `0001-dd-01…` and `0013-dd-10…`, both present |
| `examples/`, `tools/`, `scripts/` | 8 | Case by case |

The `workbench/` half (306 pairs) stays **frozen** — those targets can never
resolve, by rule.

### ★ Four files are not lost — they are cited at a home nobody moved them to

The sweep found citations pointing at a **destination inside the tracked
planning tree** while the file still sits in `workbench/`, unmigrated:

| Cited as | Actually still at |
|---|---|
| `project02-language-toolchain-alignment/arc01-build-publish-toolchain/kickoff-thread-build-dir-and-publish-dirty-check.md` | workbench/kickoff-thread-build-dir-and-publish-dirty-check.md |
| `project02-language-toolchain-alignment/arc03-compiler-coherence/2026-05-10-compiler-coherence-thread-opening.md` | workbench/2026-05-10-compiler-coherence-thread-opening.md |
| `project02-language-toolchain-alignment/arc03-compiler-coherence/handoff-surface-kernel-separation-2026-05-14.md` | workbench/handoff-surface-kernel-separation-2026-05-14.md |
| `project02-language-toolchain-alignment/arc03-compiler-coherence/kickoff-thread-compiler-architecture-coherence.md` | workbench/kickoff-thread-compiler-architecture-coherence.md |

**A committed document already decided where each belongs, the file still
exists, and nobody executed the move.** These are not repoints — they are the
migration finally happening. Do the move; the citation becomes true instead of
being frozen as false. This is the cheapest recovery in the whole census and it
directly narrows `D-2607-D3NL`.

### Consequence for the frozen census

The allowlist can only **shrink** — that property was specified in amendment (1)
and it is now doing work. Every repoint removes a pair; every one of the four
moves above removes a pair. Regenerating the census is **not** permitted; CC
deletes the resolved rows and records the count delta. If a row cannot be
deleted because the path still fails, it was not actually repointed.
