# Slice01 ledger

2026-09-12: **CDC closed**. All seven original criteria are independently
reproduced; see [CDC verification](cdc-verification.md) for the per-row verdict,
replay results and current baseline drift. CC's original attestation is retained
in the closing report. Later runtime/source/human outcomes remain open.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S-01 | Actual runtime, CLI, source worktrees, guides, book, and patch availability have explicit identities | Independently rerun recorded version/path/Git checks and inspect `artifacts/baseline.md` | correctness-grade | Slice scope 1–2 | done | Reproduced: [CDC](cdc-verification.md), [B01](artifacts/baseline.md) | Current drift reconciled; historical binary provenance remains unknown |
| S-02 | Every exploratory seed claim has a source-backed disposition | Walk SE-01 through SE-10 into `artifacts/source-register.md`; inspect pinned sources and evidence kinds | correctness-grade | Slice scope 3 | done | Reproduced: [CDC](cdc-verification.md), [source register](artifacts/source-register.md) | 10/10 dispositions; no runtime inference |
| S-03 | Format and runtime fixture matrix preserves all project requirements | Cross-check `artifacts/fixture-matrix.md` against project Scope and Arc01 slice coverage; inspect case IDs/invariants/owners | correctness-grade | Slice scope 4 | done | Reproduced: [CDC](cdc-verification.md), [FM01](artifacts/fixture-matrix.md) | 51 families with owners, invariants and evidence |
| S-04 | Replay protocol defines a concrete available baseline and isolated execution | Follow setup in `artifacts/research-protocol.md` as a read-only walkthrough; verify paths, commands, permissions, recording and stop rules | correctness-grade | Slice scope 2,4 | done | Reproduced: [CDC](cdc-verification.md), [RP01](artifacts/research-protocol.md) | Launcher gate retained; corrected-build receipt required |
| S-05 | Lykn/guide/book/operator evaluation can be run and assessed without hidden context | Inspect `artifacts/authoring-evaluation.md` for tasks, inputs, actual-reference logs, attribution, denominators, controls, and operator review records | correctness-grade | Operator explicit goals; slice scope 5 | done | Reproduced: [CDC](cdc-verification.md), [AE01](artifacts/authoring-evaluation.md) | Five tasks; no human acceptance or trial scores |
| S-06 | Findings and unresolved prerequisites have honest, durable dispositions | Inspect `artifacts/findings.md`; check permanent IDs/deduplication and real Git destinations for any routed discovery | correctness-grade | Slice scope 6 | done | Reproduced: [CDC](cdc-verification.md), [findings](artifacts/findings.md) | Five findings remain unrepaired; PERM correction now opened |
| S-07 | Handoff is complete, scoped, and reproducible | Check artifact set/links, inspect changed paths and staged diff, and walk all rows in closing report | correctness-grade | Expedited Mode; verification contract | done | Reproduced: [CDC](cdc-verification.md), [closing report](closing-report.md) | 49 links, 17 locators, 107 checksums and exact scope reproduced |
