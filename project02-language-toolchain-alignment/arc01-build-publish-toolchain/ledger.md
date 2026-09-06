# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

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

