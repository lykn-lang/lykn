# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

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

