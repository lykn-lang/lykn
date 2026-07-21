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
- **[`status.html`](./status.html)** — standalone dashboard (open in a browser);
  edit its `DATA` object to update as items land.
- **[`BOOTSTRAP.md`](./BOOTSTRAP.md)** — onboarding for a fresh CDC session,
  including the **issues & learnings log** (the workflow-evolution record).

## The arcs

| Arc | Capability | Status |
|-----|-----------|--------|
| [arc01 · build-publish-toolchain](./arc01-build-publish-toolchain/arc-plan.md) | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check | **Closed** (M11+M13) |
| [arc02 · type-dts-generation](./arc02-type-dts-generation/arc-plan.md) | `.d.ts` from `:type` annotations (DD-56) | **Closed** (M10) |
| [arc03 · compiler-coherence](./arc03-compiler-coherence/arc-plan.md) | Rust + JS coherent; DD-58 kernel/surface + DD-37 surface compiler | **Closed** — architecture landed on release 2026-06-29; corpus 1345/0 |
| [arc04 · refactor-tooling](./arc04-refactor-tooling/arc-plan.md) | `move-function` tool + the surface-extraction it drives | **Closed** — 5/5 slices; tool built + full extraction; surface.js 2315→448; lint green; `_kernel`→DD-37 step 4 follow-up |
| [arc05 · lykn-source-linter](./arc05-lykn-source-linter/arc-plan.md) | `lykn lint` over Lykn source | **RESUMED** — slice03 **CLOSED** 2026-07-21 (`ea429e2`, CDC-verified). **slice04 SCOPED** (arc05's last) = `make lint` wiring + guide-09/15 + SKILL + P-11 → arc close; **suppression deferred → arc14** (DD-62, reader comment-retention). arc13 A-6 closed |
| [arc13 · expander-coherence](./arc13-expander-coherence/arc-plan.md) | Lexical bindings shadow macros on both backends; reserved words rejected; conformance corpus | **Open — 5 slices closed** (binding layer complete by construction; D2 everywhere; coverage test standing); **CLOSED — gate GO 2026-07-09** (ancestry ×6; `make check` 100%; matrix 1947/53 exact; D2 demos verbatim); DD-60 D1/D2 hold on both backends; corpus standing in `make check`; P-18 reconciled; arc05 unpaused |
| [arc06 · cross-project-dep-ergonomics](./arc06-cross-project-dep-ergonomics/arc-plan.md) | `lykn add`, downstream-blocker audit | **Open** (slice01 exports-gap closed; main work not started) |
| [arc07 · docs](./arc07-docs/arc-plan.md) | Guide/SKILL alignment with 0.6.0; clear guide drift | **Open** — slice01 (CI-green doctest fix) closed; broader guide-drift work pending |
| [arc08 · template-i18n](./arc08-template-i18n/arc-plan.md) | `template` → ICU MessageFormat + i18n (DD-55) | **Closed** — landed on release 2026-06-29 |
| [arc09 · release-0.6.0](./arc09-release-0.6.0/arc-plan.md) | Version bumps, release notes, publish | **Future** |
| [arc10 · compiler-completion](./arc10-compiler-completion/arc-plan.md) | DD-58 strict-default + JS-parity + DD-37 step-4 (`_kernel` removal) | **Closed** — gated 2026-07-05; DD-58 enforced on every compile path incl. the macro boundary; `_kernel` retired |
| [arc11 · source-only-test-build](./arc11-source-only-test-build/arc-plan.md) | `lykn test` → `target/lykn/test/` (no compiled JS in the source tree, ever) + buried-intent audit | **Closed** — gated 2026-07-05; P-7's demo unconditional; buried-intent inventory empty-or-tracked |
| [arc12 · test-topology](./arc12-test-topology/arc-plan.md) | Every test runs exactly once per `make check`; `make test-docs` tests docs (1m52s → 2.6s) | **Closed** — gated 2026-07-05; created, delivered, and gated same-day |
| [arc14 · comment-retention](./arc14-comment-retention/arc-plan.md) | Retain comments through the pipeline (reader → surface→kernel provenance → JS-emit strip/preserve); DD-62 | **Seeded** 2026-07-21 — home for lint-suppression; release boundary (0.6.0 vs 0.7.0) = operator's call (CDC leans 0.7.0); not slice-planned |

_Numbering is **creation order** (from 2026-06-30); dependency sequence of the open arcs is **arc13 → arc05(resume) → arc06 → arc07 → arc09**._

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
