# CC prompt — `03-citation-repoint`

**From:** CDC · **Date:** 2026-07-25 · **Branch:** `release/0.6.x` (work in
`.worktrees/0.6.x`) · **Size:** small-to-medium, mostly mechanical.

Follow-on to `02-artifact-homes`, which you delivered. **That slice built the
gate; this one uses it.** No new mechanism here.

## The operator's disposition, as amended

The freeze is **not** wholesale. The rule:

> Any citation whose target migrated to a **tracked** location should be
> updated — **unless** updating it would damage the accuracy of the historical
> record.

`workbench/` (306 pairs) and `assets/ai/*` stay frozen: both are gitignored by
rule, so those targets can never resolve. Everything else is walked.

**The carve-out is the part that matters.** Repoint a *reference to* an
artifact; never rewrite a sentence that *narrates the move itself*. For example:

```text
See `packages/lykn/mod.js` -> repoint.
`packages/lykn/` was renamed to `packages/lang/` in M17 -> leave both paths verbatim.
```

Freeze the narration row and note the reason. **When in doubt, read the
sentence, not the path.** A repoint that turns a true sentence false is worse
than a dangling path — the dangling path is at least visibly broken. This is
ledger row **R-5** and it is a `serious` row.

## 1. Ground truth, and a CDC error you should not inherit

Same-basename match against the 954 tracked files at `e77ebcf`:

| Class | Distinct paths | Match |
|---|---:|---:|
| crates/design | 9 | **9** — exact: same basename under `docs/design/06-final/` |
| `examples/` | 6 | **6** |
| `docs/` | 47 | 13 |
| `packages/` | 12 | 7 |
| `assets/` | 6 | 2 |
| `test/` | 50 | **1** |

**This is a floor, not a ceiling.** A file renamed *and* moved will not match by
basename, so your real matching may recover more. **Do not treat a miss as proof
of absence** — that inversion is how a freeze becomes a silent drop.

**Correction to inherit consciously:** `02-artifact-homes` ledger amendment (4)
classified the `test/` group as *"migrated test files — repoint"*. **Wrong.**
CDC inferred it from `test/surface/*.test.js` appearing in your report and never
checked; 1 of 50 resolves. Most cited `test/` paths are **deleted**, not moved.
The table above supersedes that row. If your matching disagrees with this table
in either direction, **your data wins** — say so and show it.

## 2. Four files to *move*, not repoint

A committed document already assigned each a home; the file still sits
unmigrated in `workbench/`. Moving them makes the existing citation **true**:

| Move to | From |
|---|---|
| `docs/design-v0.6.0/arc01-build-publish-toolchain/kickoff-thread-build-dir-and-publish-dirty-check.md` | workbench/kickoff-thread-build-dir-and-publish-dirty-check.md |
| `docs/design-v0.6.0/arc03-compiler-coherence/2026-05-10-compiler-coherence-thread-opening.md` | workbench/2026-05-10-compiler-coherence-thread-opening.md |
| `docs/design-v0.6.0/arc03-compiler-coherence/handoff-surface-kernel-separation-2026-05-14.md` | workbench/handoff-surface-kernel-separation-2026-05-14.md |
| `docs/design-v0.6.0/arc03-compiler-coherence/kickoff-thread-compiler-architecture-coherence.md` | workbench/kickoff-thread-compiler-architecture-coherence.md |

Content moves **verbatim**. If a file turns out to be genuinely ephemeral rather
than worth tracking, say so and leave the citation frozen with that reason —
`workbench/` was designed for ephemeral content and not everything in it earns
a permanent home. That judgement is yours to raise, the operator's to settle.

## 3. The census can only shrink

`scripts/cited-paths-census.tsv` is a **historical record, not a config** — your
header says so. **Delete resolved rows in place. Do not regenerate.** A
regenerated census silently re-admits anything newly broken and the diff reads
as ordinary churn. `git diff` on that file must show **deletions only, zero
additions** (ledger **R-6**). Record the delta and reconcile it against the
number of repoints you claim; if they disagree, something did not actually
resolve.

## 4. Not yours

- The 14 `release/0.7.x` defects (`D-2607-5TDW`) — another branch.
- Your §8 root-vs-leaf exemption rule (`D-2607-W2FJ`) and the red-until-commit
  contract (`D-2607-Q8LM`) — both with the operator. If either lands mid-flight
  it changes what the gate *reports*, not what this slice *repoints*.
- Register rows for anything you find: write them. The concurrent-session race
  that made you defer last time is over.

## Standing

- `./bin/lykn`, never bare `lykn`. `make check` is the bar.
- Do not weaken the gate to make this pass. If the gate is wrong, say the gate
  is wrong — you were right about amendment (1) point 4, and CDC withdrew it.
- Five-iteration budget; **self-stop and write a handoff if a premise cracks.**
- The gate will read red on a dirty tree by construction — that is
  `D-2607-Q8LM`, not your bug. Green is owed at `HEAD` **after** the operator
  commits.
