# arc03 — Compiler Architecture Coherence

> **Status: Composition demonstrated (0 semantic divergences); clean close
> gated on remediation slice11.** Reconstructed retroactively (2026-06-28) from
> milestones M16–M22, the DD-58/DD-37 phase work, and the cross-compiler
> fast-follows. The arc-scale composition demonstration (row A-2) has now been
> **run end-to-end** by an independent context (CC, 2026-06-28): 146
> cross-compiler assertions, **1287 passed / 6 failed, 0 semantic divergences**.
> The 6 residuals are non-semantic (3 share one async trailing-`;` root cause);
> the corpus is therefore *red* and a formal close is gated on **slice11**
> (corpus-green remediation). See `closing-report.md` for the full per-row walk
> and bubble-up, and `design/` for the originating thread, DD drafts, readiness
> review, and phase catalogs.

## 1. Capability

lykn has two compilers — the Rust CLI codegen and the JS (`packages/lang/`)
compiler. They share the surface language but diverged structurally at multiple
points. This arc makes **"same surface input → same output"** true by
construction wherever possible, documents intentional divergence where it
remains, and lands the two architectural design decisions that make the
coherence durable: the **kernel/surface separation** (DD-58 — a closed surface
namespace with `kernel:` escape, classifier, strict mode) and the **JS surface
compiler architecture** (DD-37 — per-form migration onto the surface compiler
with a bundle-size guard). `compileBoth` is the gating tool throughout.

## 2. Slice breakdown

| Slice | Scope | DD | Status |
|-------|-------|----|--------|
| **slice01 · cross-compiler-hygiene** | M16: cross-compiler hygiene; M16-2 formatting-divergence diagnosis + turn-2 fix | — | Closed |
| **slice02 · dd58-kernel-prefix** | M17: `kernel:` escape recognition in the Rust classifier (DD-58 Phase 1a) | DD-58 | Closed |
| **slice03 · dd58-namespace-dispatch** | M18: closed-namespace dispatch + strict-mode flag (DD-58 Phase 1b) | DD-58 | Closed |
| **slice04 · dd58-test-migration** | M19: test migration + strict-mode enforcement for tests (DD-58 Phase 1c) | DD-58 | Closed |
| **slice05 · dd58-kernel-corpus** | M20: kernel test corpus + `.lyk` runner support (DD-58 Phase 1.5) | DD-58 | Closed |
| **slice06 · dd58-phase1-polish** | DD-58 Phase 1 comprehensive cleanup/polish | DD-58 | Closed |
| **slice07 · dd37-bundle-baseline** | M21: bundle-size baseline + CI guard + `not` pilot (DD-37 Phase 0) | DD-37 | Closed |
| **slice08 · dd37-per-form-migration** | M22: per-form migration + CI integration (DD-37 Step 3); incl. mid-flight Option C directive + M22 audit | DD-37 | Closed |
| **slice09 · cross-compiler-fast-follows** | Grouped drive-by coherence fixes: compileBoth `--source-context-path`; import-macros output divergence; drive-by cleanups; wishlist cleanup; `closest_kernel_form` refactor | — | Closed |
| **slice10 · icu-doctest-fences** | W-4d: ICU error-block fence annotations (`lykn,compile-fail`) in guide 17; closes D-3 doctest failures (round-2 migration) | DD-55 | Closed |
| **slice11 · cross-compiler-corpus-green** | Remediation: clear the 6 red `compile-both` failures — fix async trailing-`;` codegen (clears 3), confirm import-macros temp-path, canonicalize gensym/blank-line, disposition the JSR/network test; add a stale-`bin/lykn` guard | — | **Open — scoped** (open set written; ready for CC) |

`slice09` groups five small, independently-shipped fast-follows under one slice
directory (each in `fast-follows/<item>/` with its own cc-prompt / closing /
cdc) rather than inflating the arc with five micro-slices — a legibility choice
for the reconstruction. The D-series cross-compiler divergence fixes
(template-escape unification, single-param arrow cosmetics) are the committed
code tail of this arc (HEAD of `release/0.6.x`).

## 3. Dependencies

Consumes: arc01's `target/lykn/build/` layout (bundle-size baseline measures
built output). Leaves for later: the coherent two-compiler surface that arc04
(`move-function` surface extraction) operates on, and the canonical-form
discipline arc05 (linter) will lint against.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slices 01–10 each closed | ptr: each slice closing-report + cdc-verification | correctness | arc-plan | done | shipped closing reports + CDC reviews (attested) |
| A-2 | **same surface input → same output across Rust + JS** (form-codegen corpus), demonstrated end-to-end | `LYKN_BIN=target/release/lykn lykn test` over 146 `compile-both` assertions | serious | arc-plan | **done** | **reproduced at arc scale** (CC, 2026-06-28): 1287/6, **0 semantic divergences**; see closing-report §3 |
| A-3 | DD-58 kernel/surface separation landed (classifier, `kernel:` escape, strict mode, corpus) | slices 02–06 closing reports | serious | arc-plan | done | reproduced at slice scale |
| A-4 | DD-37 JS surface compiler architecture landed (bundle guard + per-form migration) | slices 07–08 closing reports | serious | arc-plan | done | reproduced at slice scale |
| A-5 | intentional divergences documented (incl. the newly characterized async trailing-`;` class) | closing-report §3/§5 + `helpers.js:104-109` | correctness | bubble-up | done | documented; async class routed to slice11 |
| A-6 | **cross-compiler corpus green** — 6 residual non-semantic failures fixed or skip-listed-with-rationale | `lykn test` exits 0 | serious | bubble-up | **open** | routed to slice11 (remediation) |

**The open close.** Composition (A-2) is reproduced with **0 semantic
divergences** — the substantive coherence claim holds. The arc is *not yet
clean-closed* only because the corpus is red (A-6): 6 non-semantic failures, 3
sharing one async trailing-`;` root cause. Per LEDGER-DISCIPLINE §B this is
**remediation-not-iteration** — A-6 is routed to **slice11**, and the arc closes
when slice11 closes. Full per-row walk, dispositions, and project bubble-up are
in `closing-report.md`.

## 5. Version History

### v1.1 — 2026-06-28 (composition check run)
A-2 reproduced end-to-end for the first time by an independent context (CC):
146 cross-compiler assertions, 1287/6, **0 semantic divergences**. Surfaced by
slice-level composition run: (a) the stale-`bin/lykn` confound (16 false
failures vs a fresh binary); (b) the corpus is red on 6 non-semantic residuals
(async trailing-`;` ×3, gensym/blank-line, import-macros temp-path, JSR/network).
Added **slice10** (icu-doctest-fences / W-4d, round-2 migration) and **slice11**
(cross-compiler-corpus-green remediation); added ledger rows **A-5 done** and
**A-6 open**. Project-level findings (stale-binary trap, `make check` red,
coverage bound) bubbled to project-plan.

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from M16–M22 + DD-58/DD-37 phases + fast-follows. slice09 grouping
and the pending arc-composition check (A-2/A-5) disclosed above.
