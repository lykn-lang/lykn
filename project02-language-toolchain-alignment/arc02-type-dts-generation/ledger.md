# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slice01 closed | ptr: slice01 closing-report + cdc-verification | correctness | arc-plan | done | M10 closing report + CDC review |
| A-2 | `.d.ts` emitted from `:type` annotations | slice01 closing report (per-row walk) | correctness | arc-plan | done | reproduced at slice scale (closing report) |

**Reconstruction caveat:** no separate `ledger.md` existed for M10 (it was
tracked via diagnosis → prompt → closing → CDC, without a `milestones/` ledger
file). The closing report + CDC review carry the evidence. Rows here are
*attested* from those artifacts.

