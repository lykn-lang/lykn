# Slice `03-citation-repoint` — plan of record

**Scale:** standalone slice (no arc wrapper — `PROJECT-MANAGEMENT.md` Part II
collapse rule, same as `01-macro-entry-diagnostics` / `02-artifact-homes`).
**Opened:** 2026-07-25. **Seat:** CC implements; CDC verifies; operator gates.

## Why a new slice rather than a row on `02-artifact-homes`

`02-artifact-homes` has a written closing report and L-7 delivered. Reopening it
to carry mechanical follow-up work would be the bisection anti-pattern
(`PROJECT-MANAGEMENT.md` Part IX routes exactly this shape as a *new slice*, not
as "slice 02.1"). The work is also a different kind — no new mechanism, only
repointing against a gate that already exists.

## Goal

Execute the operator's amended disposition (`02-artifact-homes` ledger,
amendment 4): **repoint every citation whose target migrated to a tracked
location; leave frozen only what can never resolve.** Shrink the frozen census
accordingly, and perform four migrations that were decided but never done.

## The rule, and its carve-out

> Any citation whose target migrated to a **tracked** location should be
> updated — **unless** updating it would damage the accuracy of the historical
> record.

**Repoint a *reference to* an artifact. Never rewrite a sentence that *narrates
the move itself*.** For example:

```text
See `packages/lykn/mod.js` -> repoint.
`packages/lykn/` was renamed to `packages/lang/` -> leave both paths verbatim.
```

Freezing that narration citation is correct. **When in doubt, read the sentence,
not the path.** A repoint that turns a true sentence false is worse than a
dangling path, because the dangling path is at least visibly broken.

## Ground truth (CDC, `release/0.6.x` @ `e77ebcf`)

Resolvability by same-basename match against the 954 tracked files. **This is a
floor, not a ceiling** — a file that was renamed *and* moved will not match, so
CC's real matching may recover more. Do not treat a miss as proof of absence.

| Class | Distinct paths | Same-basename tracked match |
|---|---:|---:|
| crates/design | 9 | **9** — exact, systematic: same basename under `docs/design/06-final/` |
| `examples/` | 6 | **6** |
| `docs/` | 47 | 13 |
| `packages/` | 12 | 7 |
| `assets/` | 6 | 2 |
| `test/` | 50 | **1** |

**CDC correction, disclosed:** amendment (4) classified the `test/` group (127
pairs) as *"migrated test files — repoint"*. **That was wrong.** It was inferred
from `test/surface/*.test.js` appearing in CC's report and never checked; 1 of
50 distinct paths resolves. Most cited `test/` paths are **deleted**, not moved,
and freeze. Same error shape as the week's others — a consequence asserted about
a path not walked. The table above supersedes amendment (4)'s.

## Scope — in

1. **Repoint** every citation whose target has a tracked home today, honouring
   the carve-out. crates/design and `examples/` are the clean wins.
2. **Migrate four files** that a committed document already assigned a home to,
   which still sit unmigrated in `workbench/` (see `cc-prompt.md` for the table).
   These are not repoints — the citation becomes *true*.
3. **Shrink the frozen census** by deleting resolved rows; record the delta.
4. Close out with the gate green on `release/0.6.x` at `HEAD` after commit.

## Scope — out (disclosed, not dropped)

- **The 306 `workbench/` pairs and `assets/ai/*`** — frozen by operator
  disposition; they can never resolve (`/workbench` and `/assets/ai` are
  gitignored by rule). Not this slice's business.
- **The 14 `release/0.7.x` defects** (`D-2607-5TDW`) — another branch's work.
- **CC's §8 root-vs-leaf exemption rule** and the **red-until-commit contract**
  (`D-2607-W2FJ`, `D-2607-Q8LM`) — operator decisions still open. If either
  lands first, it changes what the gate reports, not what this slice repoints.

## Verification approach

The gate *is* the verification: a repoint that does not remove a census row did
not work. Every row below is checkable by running `make check-cited-paths` and
diffing the census. CDC will re-derive the counts independently.

## Exit criteria

`ledger.md` rows R-1…R-6 reach a final status; census delta recorded and
matching the count of repoints claimed; gate green at `HEAD` on
`release/0.6.x`; no sentence made false by a repoint (CDC spot-check).
