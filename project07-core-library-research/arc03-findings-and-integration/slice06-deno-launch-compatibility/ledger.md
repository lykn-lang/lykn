# Slice06 ledger

Six criteria CDC closed on 2026-09-13. [Independent verification](cdc-verification.md)
reproduces the corrected binary, regressions, gates and runtime evidence.

2026-09-13: all six rows are **CC proposed-done** in the
[row-by-row handoff](closing-report.md), with reproduction, validation and build
receipt under artifacts. That historical attestation preceded the independent
closure below. Source: `4dded883bbd321d19635e6fce233343f33803f9e`.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LC-01 | Original launch failure and current identities are attributable | Fresh minimal failure, exact argv/source/emitted bytes and runtime/CLI hashes | correctness-grade | D-2609-DARG | done | [CDC verification](cdc-verification.md) | Fresh parent failure; original condition retained |
| LC-02 | Script selection works without sacrificing filename or argument safety | Real and argv tests across routes, spaces, leading-hyphen filenames and script options | correctness-grade | R-01/R-05 | done | [CDC verification](cdc-verification.md) | 16 regressions and eight fresh runtime captures |
| LC-03 | Permissions, config, offline controls and exit propagation remain explicit | Actual denied/scoped operations; requested all-grants, repeat/empty scopes, overlays and nonzero exit | correctness-grade | PERM; DARG | done | [CDC verification](cdc-verification.md) | Specific NotCapable failures; scoped successes and exit 23 |
| LC-04 | Relevant regressions and canonical source gates pass | Targeted run_permissions tests, make check and cited-path gate | correctness-grade | Source governance | done | [CDC verification](cdc-verification.md) | Full gates; disposable npm cache retry retained |
| LC-05 | Corrected source and executable provenance reconcile | Separate source commit, isolated build receipt and execution of recorded binary/runtime pair | correctness-grade | RP01 | done | [CDC verification](cdc-verification.md) | Selected release hash unchanged across direct harness replay |
| LC-06 | CDC handoff preserves research and authoring obligations | Exact-path commits, raw evidence/replay, ancestor body/history, full Slice04 re-entry and residual owners | correctness-grade | Project scope | done | [CDC verification](cdc-verification.md) | All eight DB rows remain open; no human acceptance |
