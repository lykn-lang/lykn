# Run-permission correction ledger

2026-09-12: CDC closed (was CC proposed-done). All six criteria independently
reproduced; see [CDC verification](cdc-verification.md). Original CC evidence
remains in [closing-report.md](closing-report.md).

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RP-01 | Both run routes add no implicit grant | Standalone/workspace Lykn and JS argv tests; original failure retained | serious | PERM | done | Reproduced: [CDC](cdc-verification.md); [original](artifacts/reproduction.md) | Parent source checked; current child-boundary tests pass |
| RP-02 | Explicit flags and script args obey the CLI contract | Bare/scoped/repeated options, -A, equals, spaces, -- and flags after FILE | correctness-grade | CLI contract | done | Reproduced: [CDC](cdc-verification.md) | No arbitrary passthrough or empty-value widening |
| RP-03 | Actual Deno enforces narrow grants | No-grant denial, scoped success, outside-scope and explicit deny controls | serious | Research gate | done | Reproduced: [CDC](cdc-verification.md) | All-route tests plus 10 release-binary controls |
| RP-04 | Config/forwarding/exit behavior is preserved | Process tests for config, cached/frozen and nonzero child | correctness-grade | Existing behavior | done | Reproduced: [CDC](cdc-verification.md) | Full offline graph remains later work |
| RP-05 | Docs and corrected binary are traceable | Guide/help review; source/tree/binary/runtime build receipt | correctness-grade | B01 drift | done | Reproduced: [CDC](cdc-verification.md); [RP-B01](artifacts/build-receipt.md) | Local source/input/build hashes reconciled; no clean-room claim |
| RP-06 | Validation and independent close support JSON launch | Targeted tests, make check, cited-path gate, scoped commits and CDC replay | correctness-grade | Expedited Mode | done | Reproduced: [CDC](cdc-verification.md); [handoff](closing-report.md) | Full gates pass with isolated existing package-test cache; other corrections stay open |
