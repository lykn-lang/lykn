# project02-language-toolchain-alignment

Current home: branch planning, project02-language-toolchain-alignment. Start with [project-plan.md](project-plan.md). Release intent is YAML metadata; the following retained notes describe the original versioned layout.

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

- **[`project-plan.md`](project-plan.md)** — the arc roadmap, current status,
  and the project ledger (the 0.6.0 definition of done as checkable rows).
- **[`../status/project02-language-toolchain-alignment/status.html`](../status/project02-language-toolchain-alignment/status.html)** —
  standalone dashboard (open in a browser); edit its `DATA` object to update as
  items land.
- **[`BOOTSTRAP.md`](BOOTSTRAP.md)** — onboarding for a fresh CDC session,
  including the **issues & learnings log** (the workflow-evolution record).

## The arcs

| Arc | Capability | Status |
|-----|-----------|--------|
| [arc01 · build-publish-toolchain](arc01-build-publish-toolchain/arc-plan.md) | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check | **Closed** (M11+M13) |
| [arc02 · type-dts-generation](arc02-type-dts-generation/arc-plan.md) | `.d.ts` from `:type` annotations (DD-56) | **Closed** (M10) |
| [arc03 · compiler-coherence](arc03-compiler-coherence/arc-plan.md) | Rust + JS coherent; DD-58 kernel/surface + DD-37 surface compiler | **Closed** — architecture landed on release 2026-06-29; corpus 1345/0 |
| [arc04 · refactor-tooling](arc04-refactor-tooling/arc-plan.md) | `move-function` tool + the surface-extraction it drives | **Closed** — 5/5 slices; tool built + full extraction; surface.js 2315→448; lint green; `_kernel`→DD-37 step 4 follow-up |
| [arc05 · lykn-source-linter](arc05-lykn-source-linter/arc-plan.md) | `lykn lint` over Lykn source | **Closed** — gate GO 2026-07-21 (`make check` green; P-11 demo 16/16 seeded → exit 1, clean → exit 0). `lykn lint` (16 rules, resolution-aware) ships; guide-09 reclassified. Inline suppression deferred → arc14 (DD-62) |
| [arc13 · expander-coherence](arc13-expander-coherence/arc-plan.md) | Lexical bindings shadow macros on both backends; reserved words rejected; conformance corpus | **Closed — gate GO 2026-07-09** (ancestry ×6; `make check` 100%; matrix 1947/53 exact; D2 demos verbatim); DD-60 D1/D2 hold on both backends; corpus standing in `make check`; P-18 reconciled |
| [arc06 · cross-project-dep-ergonomics](arc06-cross-project-dep-ergonomics/arc-plan.md) | `lykn add`, `lykn link`, downstream dependency ergonomics | **Closed — gate GO 2026-07-24**; all 7 slices closed/CDC-verified; mycelium consumes lykn end-to-end (build, test 43/0, publish dry-run); P-6 done and reproduced by operator host gate |
| [arc07 · docs](arc07-docs/arc-plan.md) | Guide/SKILL alignment with 0.6.0; clear guide drift | **Closed — gate GO 2026-08-08**; all 4 slices closed/CDC-verified; A-1...A-7 met; P-13 done |
| [arc08 · template-i18n](arc08-template-i18n/arc-plan.md) | `template` → ICU MessageFormat + i18n (DD-55) | **Closed** — landed on release 2026-06-29 |
| [arc09 · release-0.6.0](arc09-release-0.6.0/arc-plan.md) | Version bumps, release notes, publish | **Open** — slice01 and slice02 closed/CDC-verified; slice03 `publish-dry-runs-and-package-audit` active |
| [arc10 · compiler-completion](arc10-compiler-completion/arc-plan.md) | DD-58 strict-default + JS-parity + DD-37 step-4 (`_kernel` removal), plus no-invalid-JS follow-up | **Closed — gate GO restored 2026-08-08**; slice04 fixed no-else `if` expression-position errors |
| [arc11 · source-only-test-build](arc11-source-only-test-build/arc-plan.md) | `lykn test` → `target/lykn/test/` (no compiled JS in the source tree, ever) + buried-intent audit | **Closed** — gated 2026-07-05; P-7's demo unconditional; buried-intent inventory empty-or-tracked |
| [arc12 · test-topology](arc12-test-topology/arc-plan.md) | Every test runs exactly once per `make check`; `make test-docs` tests docs (1m52s → 2.6s) | **Closed** — gated 2026-07-05; created, delivered, and gated same-day |
| [arc14 · comment-retention](arc14-comment-retention/arc-plan.md) | Retain comments through the pipeline (reader → surface→kernel provenance → JS-emit strip/preserve); DD-62 | **Seeded → 0.7.0** — home for lint-suppression; **release boundary decided 0.7.0** (operator, 2026-07-21); not slice-planned |
| [arc15 · surface-syntax-traps](arc15-surface-syntax-traps/arc-plan.md) | Compile-clean-but-wrong surface shapes become hard errors + lint + guide fixes | **Closed — gate GO 2026-08-08**; slices 01/02/04/05 closed; slice03 deferred to 0.7.0; arc ledger A-1…A-6 met |
| [arc16 · book-0.6.0-edition](arc16-book-0.6.0-edition/arc-plan.md) | Lykn Book 0.6.0 edition; full-surface review before release | **Closed / CDC-verified** — final book gate closed at book commit `de0342c`; P-20 done |

_Numbering is **creation order** (from 2026-06-30). Current release sequence: arc09._

## Standalone slices

| Slice | Status |
|-------|--------|
| [01 · macro-entry-diagnostics](arc15.1-macro-entry-diagnostics/slice01-macro-entry-diagnostics/slice-plan.md) | **Closed** — source/test fix `41cf05a`, docs `e8f212d`, CDC close `bc51055`; end-to-end mycelium acceptance demo deferred until 0.6.0 is published |
| [02 · artifact-homes](arc16.1-artifact-homes/slice01-artifact-homes/slice-plan.md) | **Closed** — cited-path gate is green; sibling-repo `AGENTS.md`/`CLAUDE.md` guidance and the book audit tool are tracked; P-21 done |
| [03 · citation-repoint](arc16.2-citation-repoint/slice01-citation-repoint/slice-plan.md) | **Closed** — migrated citations repointed, four decided artifact homes populated, and frozen census shrank 631 -> 601; `make check-cited-paths` green at close |

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

- **Some early closed arcs are *reconstructed*, not re-verified.** Later gates
  closed the high-risk gaps: arc03, arc05, arc06, arc10, arc11, arc12, and
  arc13 have explicit gate records in their closing reports or project ledger.
  Old slices without `cdc-verification.md` remain historical evidence rather
  than freshly reproduced evidence.
- **Unpromoted DD drafts** (`dd-58-kernel-surface-separation-DRAFT.md`,
  `dd-56-canonical-form-spec-DRAFT.md`) live under the relevant arc's `design/`
  and are flagged for **odm promotion** — they were not pushed into the
  odm-managed `docs/design/` tree by the migration.
- The DDs themselves remain the odm-managed design layer in `project01-mvp/artifacts/design-index.md/`;
  this tree references them, it does not replace them.
