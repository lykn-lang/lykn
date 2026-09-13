# Slice06 ledger

Six criteria open. Implementation attestation is not independent verification.

2026-09-13: all six rows are **CC proposed-done** in the
[row-by-row handoff](closing-report.md), with reproduction, validation and build
receipt under artifacts. Status remains open until independent CDC reproduces
the evidence. Source: `4dded883bbd321d19635e6fce233343f33803f9e`.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LC-01 | Original launch failure and current identities are attributable | Fresh minimal failure, exact argv/source/emitted bytes and runtime/CLI hashes | correctness-grade | D-2609-DARG | open | [CC attestation](closing-report.md) | Keep old condition distinct |
| LC-02 | Script selection works without sacrificing filename or argument safety | Real and argv tests across routes, spaces, leading-hyphen filenames and script options | correctness-grade | R-01/R-05 | open | [CC attestation](closing-report.md) | No token loss or option reinterpretation |
| LC-03 | Permissions, config, offline controls and exit propagation remain explicit | Actual denied/scoped operations; requested all-grants, repeat/empty scopes, overlays and nonzero exit | correctness-grade | PERM; DARG | open | [CC attestation](closing-report.md) | Generic failure is not denial proof |
| LC-04 | Relevant regressions and canonical source gates pass | Targeted run_permissions tests, make check and cited-path gate | correctness-grade | Source governance | open | [CC attestation](closing-report.md) | No safety bypass or snapshot auto-accept |
| LC-05 | Corrected source and executable provenance reconcile | Separate source commit, isolated build receipt and execution of recorded binary/runtime pair | correctness-grade | RP01 | open | [CC attestation](closing-report.md) | No unavailable-runtime claim |
| LC-06 | CDC handoff preserves research and authoring obligations | Exact-path commits, raw evidence/replay, ancestor body/history, full Slice04 re-entry and residual owners | correctness-grade | Project scope | open | [CC attestation](closing-report.md) | No inferred library or human acceptance |
