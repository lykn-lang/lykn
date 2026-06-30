# arc01 — Build & Publish Toolchain

> **Status: Closed.** Reconstructed retroactively (2026-06-28) from milestone
> M11+M13. See `slice01-.../{ledger.md, closing-report.md}` for the shipped
> evidence and `design/kickoff-thread.md` for the originating thread.

## 1. Capability

Move the build/publish toolchain onto a clean, Lykn-scoped artifact discipline:
intermediate compiler output under `target/lykn/build/` and publish-ready
staging under `target/lykn/dist/` (matching Rust's `target/` convention and
keeping `.js` out of the source tree, per philosophy Principle 1), and make the
publish gate explicit at the Lykn surface — `lykn publish` fails on an
uncommitted working tree, with an opt-in override that is **never**
auto-injected (philosophy decided-questions #1 and #4; CLAUDE.md "Lykn CLI
safety gates").

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · build-dir-and-publish-dirty-check** | `target/lykn/{build,dist}` reorg; `lykn dist` subcommand + deprecation alias; whole-project `lykn build`; `project.json` import repointing; scaffold update; `lykn publish` dirty-check gate + `--allow-dirty` (no auto-injection) | Closed |

**Note on slicing.** This arc was proposed as two slices (build-dir reorg /
publish dirty-check) but **shipped as one combined milestone (M11+M13)** with a
single ledger whose rows (`M11M13-1…12`) interleave both capabilities and share
cross-spec consistency and substrate-compliance checks. Splitting the combined
artifact retroactively would damage a coherent document, so the arc carries one
slice. Both capabilities are fully covered within. (Recorded in project-plan
Version History v1.0.)

## 3. Dependencies

Consumes: nothing earlier (foundational). Leaves for later arcs: the
`target/lykn/build/` layout that arc03 (compiler-coherence) and arc06
(dep-ergonomics) build on; the `lykn publish` gate that arc09 (release) relies
on.

## 4. Arc ledger

Composition criteria verifying the capability. Closed; per-row walk in the
shipped `slice01/closing-report.md` (rows `M11M13-1…12`).

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 closed | ptr: slice01 closing-report (12-row per-row walk) | correctness | arc-plan | done | M11+M13 closing report |
| A-2 | compile output relocated to `target/lykn/build/`; 0 `.js` in source tree | closing report rows M11M13-2/-5/-6 | serious | arc-plan | done | reproduced at slice scale (closing report) |
| A-3 | `lykn publish` enforces dirty-check; `--allow-dirty` not auto-injected | closing report rows M11M13-8/-9 | serious | arc-plan | done | reproduced at slice scale (closing report) |

**Reconstruction caveat:** the original M11+M13 close predates the
arc/project-scale ledger discipline; these rows are *attested* from the shipped
closing report, not independently re-reproduced at arc scale during this
migration. A fresh arc-scale composition run is the honest next step if arc01
is ever re-gated.

## 5. Version History

### v1.0 — 2026-06-28 (reconstructed)
Reconstructed from M11+M13 (shipped 2026-05-11). One-slice decision recorded
above and in project-plan v1.0.
