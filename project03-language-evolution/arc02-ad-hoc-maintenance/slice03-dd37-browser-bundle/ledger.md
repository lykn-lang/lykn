# DD-37 browser bundle ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| DB-01 | Exact fixed historical gate and current browser compiler regression reproduced | Locked source inputs, same-platform pinned Deno and esbuild, full stdout/stderr/exit | correctness-grade | DD-37 | done | cdc-verification.md |
| DB-02 | Source growth and bounded graph cuts quantified | Actual checkpoints, explicit module-attribution limits, individual and combined controlled cuts | decision-grade | DD-37 | done | cdc-verification.md |
| DB-03 | Product meets the approved browser budget and behavior contract | Real compiler/browser paths and exact approved gate | correctness-grade | Operator | open | cdc-verification.md |
| DB-04 | Separate reviewer reproduces the decisive observations | Clean source state, exact artifact inputs, raw measurements and source/contract review | correctness-grade | AGENTS | done | cdc-verification.md |
