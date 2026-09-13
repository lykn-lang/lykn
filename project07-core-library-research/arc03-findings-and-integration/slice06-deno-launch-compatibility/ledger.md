# Slice06 ledger

Six criteria open. Implementation attestation is not independent verification.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LC-01 | Original launch failure and current identities are attributable | Fresh minimal failure, exact argv/source/emitted bytes and runtime/CLI hashes | correctness-grade | D-2609-DARG | open | — | Keep old condition distinct |
| LC-02 | Script selection works without sacrificing filename or argument safety | Real and argv tests across routes, spaces, leading-hyphen filenames and script options | correctness-grade | R-01/R-05 | open | — | No token loss or option reinterpretation |
| LC-03 | Permissions, config, offline controls and exit propagation remain explicit | Actual denied/scoped operations; requested all-grants, repeat/empty scopes, overlays and nonzero exit | correctness-grade | PERM; DARG | open | — | Generic failure is not denial proof |
| LC-04 | Relevant regressions and canonical source gates pass | Targeted run_permissions tests, make check and cited-path gate | correctness-grade | Source governance | open | — | No safety bypass or snapshot auto-accept |
| LC-05 | Corrected source and executable provenance reconcile | Separate source commit, isolated build receipt and execution of recorded binary/runtime pair | correctness-grade | RP01 | open | — | No unavailable-runtime claim |
| LC-06 | CDC handoff preserves research and authoring obligations | Exact-path commits, raw evidence/replay, ancestor body/history, full Slice04 re-entry and residual owners | correctness-grade | Project scope | open | — | No inferred library or human acceptance |
