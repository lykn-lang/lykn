# lykn 0.6.0 — Design & Planning

> The canonical project/arc/slice planning tree for the lykn **0.6.0**
> release, per `collaboration-framework/docs/PROJECT-MANAGEMENT.md` (v2.1).
>
> **Reconstructed retroactively (2026-06-28)** by curating the genuine planning
> value out of the (gitignored) `workbench/` rat's nest — milestone ledgers,
> closing reports, CDC reviews, verification evidence, and design drafts — and
> reorganizing it into this legible structure. `workbench/` is left intact as a
> safety net; once you've verified this tree, it can be deleted. Scope: 0.6.0
> only (the 0.1.0–0.5.x history remains in `workbench/old/`).

## Start here

- **[`project-plan.md`](./project-plan.md)** — the arc roadmap, current status,
  and the project ledger (the 0.6.0 definition of done as checkable rows).

## The arcs

| Arc | Capability | Status |
|-----|-----------|--------|
| [arc01 · build-publish-toolchain](./arc01-build-publish-toolchain/arc-plan.md) | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check | **Closed** (M11+M13) |
| [arc02 · type-dts-generation](./arc02-type-dts-generation/arc-plan.md) | `.d.ts` from `:type` annotations (DD-56) | **Closed** (M10) |
| [arc03 · compiler-coherence](./arc03-compiler-coherence/arc-plan.md) | Rust + JS coherent; DD-58 kernel/surface + DD-37 surface compiler | **Closed** — architecture landed on release 2026-06-29; corpus 1345/0 |
| [arc04 · refactor-tooling](./arc04-refactor-tooling/arc-plan.md) | `move-function` tool + the surface-extraction it drives | **Closed** — 5/5 slices; tool built + full extraction; surface.js 2315→448; lint green; `_kernel`→DD-37 step 4 follow-up |
| [arc05 · lykn-source-linter](./arc05-lykn-source-linter/arc-plan.md) | `lykn lint` over Lykn source | **Open** (not started) |
| [arc06 · cross-project-dep-ergonomics](./arc06-cross-project-dep-ergonomics/arc-plan.md) | `lykn add`, downstream-blocker audit | **Open** (slice01 exports-gap closed; main work not started) |
| [arc07 · docs](./arc07-docs/arc-plan.md) | Guide/SKILL alignment with 0.6.0; clear guide drift | **Open** (seeded, not slice-planned) |
| [arc08 · template-i18n](./arc08-template-i18n/arc-plan.md) | `template` → ICU MessageFormat + i18n (DD-55) | **Closed** — landed on release 2026-06-29 |
| [arc09 · release-0.6.0](./arc09-release-0.6.0/arc-plan.md) | Version bumps, release notes, publish | **Future** |

## Layout conventions

Each arc directory carries an `arc-plan.md` (capability, slice breakdown, arc
ledger, version history) and, where it existed, a `design/` folder with the
originating kickoff thread, DD drafts, diagnoses, and phase catalogs.

Each slice directory carries the canonical per-slice docs **where the original
work produced them**: `cc-prompt.md` (the CC assignment), `ledger.md`
(grep-verifiable acceptance rows), `closing-report.md` (CC's per-row walk),
`cdc-verification.md` (CDC's independent review), plus `verify/` (CDC evidence:
baselines, audits) and `design/` (diagnoses) where present. Reconstructed
`slice-doc.md` stubs record goal/status/pointers; gaps (e.g. milestones that
shipped without a standalone ledger or slice-doc) are disclosed in-file rather
than fabricated.

## Provenance and caveats

- **Closed arcs are *reconstructed*, not re-verified.** Slice-level closures
  carry their original evidence (*attested* from the shipped closing reports);
  they were not independently re-reproduced during the migration. arc-level
  composition checks (LEDGER-DISCIPLINE §B) were generally **not** run at the
  time — most visibly arc03's `compileBoth` end-to-end pass (row A-2), which is
  the main open item before arc03 can formally close.
- **Unpromoted DD drafts** (`dd-58-kernel-surface-separation-DRAFT.md`,
  `dd-56-canonical-form-spec-DRAFT.md`) live under the relevant arc's `design/`
  and are flagged for **odm promotion** — they were not pushed into the
  odm-managed `docs/design/` tree by the migration.
- The DDs themselves remain the odm-managed design layer in `docs/design/`;
  this tree references them, it does not replace them.
