# DD-37 browser bundle ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| DB-01 | Exact fixed historical gate and current browser compiler regression reproduced | Locked source inputs, same-platform pinned Deno and esbuild, full stdout/stderr/exit | correctness-grade | DD-37 | open | cc-prompt.md |
| DB-02 | Source growth and bounded low-risk paths quantified | Actual checkpoints, explicit module-attribution limits, individual and combined controlled cuts | decision-grade | DD-37 | open | cc-prompt.md |
| DB-03 | Product either passes unchanged budget with browser behavior, or remaining repair decision is explicit | Real compiler/browser paths and exact gate if a candidate exists, otherwise measured bound and held product obligation | correctness-grade | Operator | open | cc-prompt.md |
| DB-04 | Separate reviewer reproduces the decisive observations | Clean source state, exact artifact inputs, raw measurements and source/contract review | correctness-grade | AGENTS | open | cc-prompt.md |
