# lykn 0.6.0 — Project Plan

> Plan-of-record for the lykn 0.6.0 release: the **language-toolchain
> alignment** release. This document is the arc roadmap — the place a fresh
> session reads to understand all the arcs at once before opening any single
> `arc-plan.md`.
>
> **Reconstructed retroactively (2026-06-28)** from the milestone (M-series)
> history that lived in `workbench/` under the project's prior tracking
> convention. The arcs, slices, and statuses below are recovered from the
> actual shipped milestones, their ledgers, closing reports, and CDC reviews —
> now reorganized into the canonical `docs/design-v0.6.0/` layout per
> `collaboration-framework/docs/PROJECT-MANAGEMENT.md` (v2.1). See the Version
> History for the migration provenance.

## 1. Definition of done and boundaries

**What 0.6.0 delivers.** 0.5.1 was the documentation/scaffold/SKILL alignment
release; **0.6.0 is the release where the structural language-toolchain
commitments land**. Specifically, 0.6.0 is done when:

- The build/publish toolchain is reorganized onto the `target/lykn/{build,dist}`
  discipline, and `lykn publish` enforces an uncommitted-changes gate
  (philosophy commitments #1 and #4).
- The two compilers (Rust + JS) are coherent by construction wherever
  possible: same surface input → same output, with intentional divergence
  documented (DD-36/DD-58 kernel/surface separation; DD-37 JS surface
  compiler architecture).
- `.d.ts` type declarations are generated from `:type` annotations (DD-56).
- `lykn lint` lints **Lykn source** (anti-patterns, idiom, style), replacing
  the compiled-JS-lint surface (philosophy commitment #2, Option A).
- The release is cut: version bumps, release notes, publish to JSR / npm /
  crates.io.

**Boundaries — explicitly NOT in 0.6.0 scope here.** The architecture is in
the design docs (`docs/design/`, odm-managed DDs) and `docs/philosophy.md`;
this file is the *plan*, not the design. The **Lykn Book 0.6.0 update** lives
in a separate repo (`~/lab/cnbb/lykn`) and is tracked as its own project, not
as an arc here (decided 2026-06-28). The **0.1.0–0.5.x history** remains in
`workbench/old/` and is out of this plan's scope; a `docs/design-v0.5.x/`
retro pass may reconstruct it later.

A pointer to the architecture: `docs/philosophy.md` (the three principles +
0.6.0 commitments), and the odm-managed DDs in `docs/design/` (DD-36, DD-37,
DD-56, DD-58 in particular).

## 2. The arc roadmap

Arcs in dependency order. Each delivers one coherent capability.

| Arc | Capability | Depends on | Status |
|-----|-----------|-----------|--------|
| **arc01 · build-publish-toolchain** | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check gate | — | **Closed** (M11+M13) |
| **arc02 · type-dts-generation** | `.d.ts` declarations generated from `:type` annotations (DD-56) | — | **Closed** (M10) |
| **arc03 · compiler-coherence** | Rust + JS compilers coherent by construction; kernel/surface split (DD-58) + JS surface compiler arch (DD-37) | arc01 (build) | **Substantially delivered** (M16–M22 + fast-follows); arc-level composition check pending |
| **arc04 · refactor-tooling** | `move-function` byte-exact code-move tool driving surface extraction | arc03 | **In flight** (M22.5; slices open) |
| **arc05 · lykn-source-linter** | `lykn lint` over Lykn source — anti-patterns, idiom, style (Option A) | arc03 | **Open** (not started; was M12) |
| **arc06 · cross-project-dep-ergonomics** | `lykn add` and ergonomic cross-project dependency handling (DD-51 follow-ons) | arc01 | **Open** (not started) |
| **arc07 · docs** | Guide/SKILL alignment with 0.6.0; clear guide drift; land discoverability additions | arc01–06 (describes shipped behaviour) | **Open** (seeded, not slice-planned) |
| **arc08 · release-0.6.0** | Version bumps, release notes, publish to JSR / npm / crates.io | all above incl. arc07 docs | **Future** (was M14/M15) |

## 3. Current status (2026-06-28)

- **Done:** arc01, arc02. arc03 substantially delivered (every constituent
  slice has a closing report and CDC review) but has not had a formal
  **arc-level composition check** — see arc03 `closing-report.md` (to be
  written) and the arc-ledger section in its `arc-plan.md`.
- **Active / warmest thread:** arc04 (`move-function` tooling) — implementation
  prompts written 2026-05-23 (T1a core, T1b rewiring), no closing reports yet.
- **Not started:** arc05 (linter), arc06 (dep ergonomics).
- **Gated:** arc08 (release) waits on the open arcs and on arc03's composition
  check.

Per **plan late, plan deep**: arc-plans for the closed arcs (01–03) are
*reconstructed* from shipped work; arc04 is planned to the depth its in-flight
state supports; arc05–07 carry capability statements and their kickoff-thread
seeds but are **not** planned slice-by-slice until they become active.

## 4. Project ledger

Composition criteria that verify the 0.6.0 definition of done. Opens here;
closes (per-row walk) in this project's `closing-report.md` when 0.6.0 ships.
Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §C, class-(b)
rows are **reproduced at project scale** (end-to-end demonstration), never
inherited from arc attestations.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| P-1 | arc01 closed + composed | ptr: arc01 closing-report | correctness | project-plan | done | M11+M13 closing report | attested (reconstructed) |
| P-2 | arc02 closed + composed | ptr: arc02 closing-report | correctness | project-plan | done | M10 closing report + CDC | attested (reconstructed) |
| P-3 | arc03 closed + composed | ptr: arc03 closing-report | serious | project-plan | open | composition reproduced (0 semantic divergences) | **close gated on remediation slice11** (corpus red: 6 non-semantic) |
| P-4 | arc04 closed + composed | ptr: arc04 closing-report | correctness | project-plan | open | | in flight |
| P-5 | arc05 (linter) closed + composed | ptr: arc05 closing-report | correctness | project-plan | open | | not started |
| P-6 | arc06 (dep-ergonomics) closed + composed | ptr: arc06 closing-report | polish | project-plan | open | slice01 (exports-gap) closed | main work (`lykn add`, mycelium audit) not started |
| P-7 | `build` emits to `target/lykn/build/`; no `.js` in source tree (DoD demo) | end-to-end: clean build, grep source tree for `.js` = 0 | serious | DoD | open | | reproduce at project scale |
| P-8 | `lykn publish` fails on a dirty tree; `--allow-dirty` overrides, never auto-injected | end-to-end publish dry-run on dirty + clean tree | serious | DoD | open | | reproduce at project scale |
| P-9 | same surface input → same output across Rust + JS for the migrated corpus (`compileBoth`) | run `compileBoth` corpus; divergences documented or zero | serious | DoD | open | **reproduced** (CC 2026-06-28): 1287/6, 0 semantic divergences over 146 assertions | form-codegen only (~11%); 6 non-semantic residuals → arc03 slice11 |
| P-10 | `.d.ts` generated from `:type` annotations | end-to-end: compile a typed module, inspect emitted `.d.ts` | correctness | DoD | open | | reproduce at project scale |
| P-11 | `lykn lint` lints Lykn source (not compiled JS) | end-to-end: `lykn lint` on a fixture with seeded anti-patterns | correctness | DoD | open | | blocked on arc05 |
| P-12 | 0.6.0 published to JSR + npm + crates.io | release transcript | serious | DoD | open | | blocked on arc08 |
| P-13 | docs/guides + SKILL aligned with shipped 0.6.0 (no unreconciled guide drift) | arc07 drift-audit demo | correctness | project-plan | open | | blocked on arc07 |

DoD verdict, gate (go / adjust / kill), and the per-row walk are recorded in
this project's `closing-report.md` at release time.

## 5. Version History

### v1.2 — 2026-06-28 (docs arc added)

Added **arc07 · docs** to home the 0.6.0 docs/SKILL hygiene backlog
(`guide-drift-cleanup-plan`, `proposed-skill-and-guide-additions`), previously
un-arc'd in `workbench/`. To preserve dependency order (docs alignment lands
before the release cut), **release was renumbered arc07 → arc08**; all
references updated (this plan, README, arc01, arc03 closing-report, the release
arc-plan). Added project-ledger row **P-13** (docs aligned with shipped 0.6.0).
(Surfaced by: operator request to spin up a docs arc; the M6/M7 closings remain
out of scope — arc03 prehistory below the M10 floor, left for a `design-v0.5.x`
retro.)

### v1.1 — 2026-06-28 (CC verification + round-2 + arc03 composition)

After an independent verification pass (CC), with results in
`workbench/cc-results-design-v060/`:

- **Structure verified:** canonical layout confirmed, 115 files, no undisclosed
  gaps (CC `01-structure-verification.md`).
- **arc03 composition (P-9) reproduced** end-to-end for the first time: 146
  cross-compiler assertions, 1287/6, **0 semantic divergences**. arc03 stays
  **open**, close gated on new **slice11** (corpus-green remediation) for 6
  non-semantic residuals. (Surfaced by: arc03 composition run.)
- **Round-2 migration** (CC reconciliation found real value the first pass
  missed): arc06 gained closed **slice01 · lang-exports-gap** (Finding D) +
  `mycelium-bootstrap-issues.md`; arc03 gained **slice10 · icu-doctest-fences**
  (W-4d) + `finding-e-empirical-disconfirmation.md`. P-6 updated.
- **Three project-level findings bubbled up from arc03** (to act on before
  arc08): (1) **stale-`bin/lykn` trap** — A-2/P-7/P-9 demos must
  `make build-release` first or the harness reports false divergences;
  (2) **`make check` is red on `release/0.6.x`** — `cargo fmt --check` fails on
  5 committed files (pre-existing; fix = `cargo fmt --all` + commit, per CLAUDE.md
  — do not bypass); blocks P-7/P-8 clean-toolchain demos; (3) **cross-compiler
  coverage is form-codegen only (~11%)** — reader/expander/integration parity is
  a documented latent gap.
- **Repo finding (non-plan):** `assets/ai/LEDGER_DISCIPLINE.md` is a **dead
  symlink** (underscore vs hyphen + moved base path) — CLAUDE.md's "read first"
  pointer is broken; worth fixing.

### v1.0 — 2026-06-28 (reconstructed)

Initial project-plan, **reconstructed retroactively** from the M-series
milestone history that previously lived in `workbench/` (gitignored) under the
project's pre-framework tracking convention. The migration:

- Adopted the canonical `docs/design-v0.6.0/` layout (operator-confirmed
  2026-06-28: canonical layout, lang-repo-only scope, 0.6.0-only history,
  copy-not-move so `workbench/` remains intact as a safety net).
- Mapped milestones → arcs/slices: M10→arc02; M11+M13→arc01; M16–M22 + the
  DD-58/DD-37 phases + cross-compiler fast-follows→arc03; M22.5→arc04;
  M12→arc05 (open); dep-ergonomics→arc06 (open); M14/M15→arc07 (future).
- **Deviation from the proposed slice split:** arc01 was proposed as two
  slices (build-dir-reorg / publish-dirty-check) but shipped as one combined
  milestone (M11+M13) with a single interleaved ledger (`M11M13-1…12`). Split
  was rejected as destructive to a coherent artifact; arc01 carries one slice
  holding the combined ledger + closing report, with both capabilities
  documented. (Surfaced by: the migration; recorded here per plan-change
  discipline.)

_This document is a living spec. Reconstructed 2026-06-28._
