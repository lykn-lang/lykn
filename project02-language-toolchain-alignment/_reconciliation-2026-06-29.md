# Branch-Ancestry Reconciliation — 2026-06-29

> Ground-truth audit of what 0.6.0 work is actually **merged to
> `release/0.6.x`** vs. **stranded on a worktree branch**. Triggered by
> arc04/slice02's `andChain` finding (the M22 architecture wasn't on release).
> Method: `git merge-base --is-ancestor` + `git log release/0.6.x..<branch>`
> per branch. Authoritative as of 2026-06-29.

## ✅ RESOLVED — 2026-06-29 (same day)

Both stranded bodies were merged into `release/0.6.x` and verified green:
- `cdc/compiler-coherence` (DD-58 + DD-37) — merge `6aa3724` (clean auto-merge;
  needed 3 fixups for a pre-existing `make check` red the merge inherited).
- `feature/template-update` (DD-55 ICU/i18n) — merge `7a552ca` (6 conflicts
  resolved HEAD-favoured; the D-2 backslash + slice11 async invariants held).

Re-audit: **all worktree branches are now 0-ahead of `release/0.6.x` — zero
stranded.** Verification (CC-attested): corpus 1345/0, deno 658/0, 25 ICU
cross-compiler tests, clippy/fmt/lint clean. Plan reconciled: arc03 close
restored; **DD-55 added as arc08** (release → arc09); arc04 A-3 / M22.5-2
unblocked. One follow-up: slice02's F-7 freshness guard is too broad (scope it to
the cross-compiler corpus). The original finding is retained below for the record.

---

## Headline (original finding — now resolved)

Two substantial bodies of closed/landed-*looking* work were **not on
`release/0.6.x`**:

1. **DD-58 + DD-37** (compiler kernel/surface split + JS classifier) — 47
   commits on `cdc/compiler-coherence` (M17–M22). = arc03 slices **02–08**.
2. **DD-55** (template macro → ICU MessageFormat / i18n) — 11 commits on
   `feature/template-update`. **Not currently represented as an arc** in
   `design-v0.6.0` (a reconstruction gap).

Everything else audited is correctly landed.

## Branch summary

| Branch | Commits ahead of release/0.6.x | Verdict |
|--------|-------------------------------|---------|
| `cdc-build-dir-reorg` | 0 | merged ✓ |
| `cdc/dep-ergonomics` | 0 | merged ✓ |
| `m12-linter` | 0 | merged/empty ✓ (no stranded linter work) |
| `cdc/compiler-coherence` | 47 | **STRANDED** — DD-58 + DD-37 (M17–M22) |
| `feature/template-update` | 11 | **STRANDED** — DD-55 ICU/i18n |

Fork point for `cdc/compiler-coherence`: `e462a67` (D-2, 2026-05-16).

## Per-arc / per-slice landed map

| Arc / slice | Milestone | On `release/0.6.x`? |
|-------------|-----------|---------------------|
| arc01 slice01 build-publish | M11+M13 | **yes** ✓ |
| arc02 slice01 type-dts | M10 | **yes** ✓ |
| arc03 slice01 cross-compiler-hygiene | M16 | **yes** ✓ |
| arc03 slice02 dd58-kernel-prefix | M17 | **NO** (cdc/compiler-coherence) |
| arc03 slice03 dd58-namespace-dispatch | M18 | **NO** |
| arc03 slice04 dd58-test-migration | M19 | **NO** |
| arc03 slice05 dd58-kernel-corpus | M20 | **NO** |
| arc03 slice06 dd58-phase1-polish | — | **NO** |
| arc03 slice07 dd37-bundle-baseline | M21 | **NO** |
| arc03 slice08 dd37-per-form-migration | M22 | **NO** |
| arc03 slice09 cross-compiler-fast-follows | — | **yes** ✓ (shared base) |
| arc03 slice10 icu-doctest-fences | W-4d | **yes** ✓ (shared base) |
| arc03 slice11 cross-compiler-corpus-green | (this session) | **yes** ✓ |
| arc04 slice01 move-function-core | (this session) | **yes** ✓ |
| arc04 slice02 move-function-rewiring | (this session) | **yes** ✓ |
| arc06 slice01 lang-exports-gap | Finding D | **yes** ✓ (cdc/dep-ergonomics merged) |
| **DD-55 ICU/i18n (unmapped)** | DD-55 | **NO** (feature/template-update) |

## What's stranded, in detail

**`cdc/compiler-coherence` (47 commits):** M17 (`kernel:` escape recognition),
M18 (closed-namespace dispatch + strict mode), Phase-1 polish, M19 (test
migration + strict-mode enforcement), M20 (kernel test corpus + `.lyk` runner),
M21 (bundle baseline + CI guard + `not` pilot + `surface-ast.js` + `classifier.js`
creation), M22 (per-form migration to classifier + `surface-helpers.js`), plus a
DD-58 quote/quasiquote refinement. This is the entire DD-58/DD-37 architecture —
`classifier.js`, `surface-ast.js`, `surface-helpers.js`, and the per-form moves.

**`feature/template-update` (11 commits):** DD-55 ICU MessageFormat in the
`template` macro — JS pipeline (Phase A), Rust ICU parser + codegen mirror
(Phase 3), fallible-codegen Result cascade, review fixes, cross-compiler
equivalence tests, the i18n guide + runnable example + README.

## Root cause

The retroactive `design-v0.6.0/` migration reconstructed the plan from workbench
**milestone closing reports**, and the arc closes (arc03 especially) treated
"milestone closed" as "landed on `release/0.6.x`" **without a branch-ancestry
check**. The slice-level CDC verifications done this session (slice11, slice01,
slice02) *did* confirm their own commits on release — which is why those hold —
but the reconstructed arcs inherited the reports' word. DD-55 was excluded from
the arc map entirely (it sat in `feature/template-update`, not in the workbench
milestone series). A CDC verification gap, now named and corrected.

## Why the corpus still passed on release

slice11's `compile-both` corpus ran green (1293/0) on `release/0.6.x` because the
**language behaviour** is correct via `surface.js`'s macro path. DD-58/DD-37 are
*architecture refactors* (move forms into a classifier); they don't change
output. So behaviour-coherence is genuinely verified on release; the
architectural cleanup is what's unmerged.

## Recommendations (for the operator decision)

1. **Decide intent per stranded body.** Were DD-58/DD-37 and DD-55 meant to land
   in 0.6.0? (Almost certainly yes — both are closed, substantial, 0.6.0-era.)
   If so, they need merging to `release/0.6.x`.
2. **Expect non-trivial merges.** `cdc/compiler-coherence` forked at D-2, before
   this session's release commits (incl. slice11's `emit.rs` async-declaration
   fix and the `move-function` tool). The Rust compiler files (`emit.rs`,
   `forms.rs`) and the JS surface files are likely conflict points. `feature/
   template-update` touches `emit.rs`/ICU modules too.
3. **Re-verify after each merge:** re-run slice11's `compile-both` corpus
   (rebuild-first) and the full suite; confirm slice11's async fix survives the
   `cdc/compiler-coherence` merge (cdc forked before it).
4. **Then reconcile the plan:** lift arc03's close from *qualified* back to a
   true close (or re-open slices if the merge surfaces issues); add a DD-55 arc
   (or fold into arc03/a template arc) so it's tracked; unblock M22.5-2/-3.
5. **Sequence:** likely `cdc/compiler-coherence` first (it's the arc03 spine and
   the M22.5 blocker), then `feature/template-update`, then re-run this audit to
   confirm zero stranded.

## Caveat

This audit is commit-ancestry truth (what's reachable from `release/0.6.x`). It
does not re-verify that the *merged* result builds/tests green — that's the
post-merge reconciliation in rec. #3. Git ops are host-side (operator/CC).
