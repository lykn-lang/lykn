# arc08 — Template Macro: ICU MessageFormat & i18n (DD-55)

> **Status: Closed (landed 2026-06-29).** Reconstructed retroactively and added
> to the plan on 2026-06-29 after the branch-ancestry audit found DD-55 had been
> developed on `feature/template-update` and never mapped to an arc. Merged to
> `release/0.6.x` (merge commit `7a552ca`) and verified green (25 ICU
> cross-compiler tests; full corpus 1345/0). Evidence is the **git history** (the
> DD-55 commit series) — DD-55 was developed on a feature branch, not through the
> workbench milestone process, so there are no workbench ledgers/closing-reports
> to migrate.

## 1. Capability

Extend the `template` macro to support **ICU MessageFormat** — the foundation for
internationalization (i18n): plural/select/number/date arguments, with a Rust
codegen mirror so both compilers emit equivalent output, and the `template`
escaping kept consistent with the D-2 backslash-passthrough fix. Ships with an
i18n guide, a runnable example, and a README entry.

## 2. Slice breakdown (reconstructed from the DD-55 commit series)

| Slice | Scope | Commits | Status |
|-------|-------|---------|--------|
| **slice01 · icu-js-pipeline** | DD-55 Phase A — ICU MessageFormat in the `template` macro (JS pipeline) | `d261f30` | Closed |
| **slice02 · icu-rust-mirror** | DD-55 Phase 3 + R-1 — Rust ICU parser + codegen mirror; make codegen **fallible** (`Result` cascade through the emit layer) | `659a72f`, `48a5b8a` | Closed |
| **slice03 · icu-review-and-cross-compiler** | DD-55 Phases 4/5 + review rounds + R-14 — error-prefix fix, JS/Rust review fixes (TDZ, hoisting, select override, CLDR, `$` escaping), cross-compiler equivalence tests, i18n guide + runnable example + README | `6e5ada9`, `7810e68`, `b411efa`, `0e2a45d`, `4c909ee`, `0b26857`, `6ad75b7`, `dbf9dc4` | Closed |

## 3. Dependencies

Builds on the `template` macro (DD-54) and the D-series template-escape fixes
(D-1/D-2) already on release. The Rust ICU codegen (`crates/lykn-lang/src/codegen/icu.rs`)
sits alongside `emit.rs`. Interacts with arc03's DD-37/DD-58 (shared `emit.rs`)
— the merge reconciled them (the `R-1` fallible-codegen cascade coexists with
arc03's codegen). Feeds arc07 (docs — the i18n guide) and arc09 (release).

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | ICU MessageFormat works in `template` (JS) | DD-55 JS tests | serious | arc-plan | done | merged; suite green |
| A-2 | Rust ICU mirror emits equivalent output | 25 ICU cross-compiler tests | serious | arc-plan | done | `0b26857`; CC-attested green at merge |
| A-3 | template escaping consistent with D-2 (no backslash double-escape) | "ICU template backslash passthrough" + "D-2 converges" tests | serious | merge | done | merge resolved HEAD-favoured; both tests green |
| A-4 | i18n guide + runnable example + README present | guide 17 + example | polish | arc-plan | done | `6ad75b7`, `dbf9dc4` |

**Reconciliation note:** DD-55 had been applied to `release/0.6.x` largely in
**parallel** (the release-side template/ICU work == DD-55's), so the merge's net
code change was small — it mainly records the history convergence. No DD-55
functionality was lost; the two dangerous escaping conflicts (compiler.js,
icu.rs) were resolved in HEAD's favour, preserving the D-2 fix while keeping
DD-55's ICU codegen. See `_reconciliation-2026-06-29.md` and `_merge2-resolution-cc-prompt-2026-06-29.md`.

## 5. Version History

### v1.0 — 2026-06-29 (created on landing)
Arc created when DD-55 was un-stranded from `feature/template-update` and merged
to `release/0.6.x`. Closed on arrival (the work was complete + verified). Slice
breakdown reconstructed from the commit series; evidence is git history (no
workbench artifacts existed). Appended as arc08 (release renumbered → arc09 to
stay terminal); NN reflects insertion order, not strict chronology (DD-55 is
~arc02-era by date).
