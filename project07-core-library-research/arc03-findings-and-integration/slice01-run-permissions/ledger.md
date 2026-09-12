# Run-permission correction ledger

2026-09-12: CC proposed-done. All six statuses stay open until independent
CDC reproduction; see [closing-report.md](closing-report.md).

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RP-01 | Both run routes add no implicit grant | Standalone/workspace Lykn and JS argv tests; original failure retained | serious | PERM | open | CC attested: [validation](artifacts/validation.md); [original](artifacts/reproduction.md) | Actual child boundary; proposed-done, CDC pending |
| RP-02 | Explicit flags and script args obey the CLI contract | Bare/scoped/repeated options, -A, equals, spaces, -- and flags after FILE | correctness-grade | CLI contract | open | CC attested: [validation](artifacts/validation.md) | No arbitrary passthrough; proposed-done, CDC pending |
| RP-03 | Actual Deno enforces narrow grants | No-grant denial, scoped success, outside-scope and explicit deny controls | serious | Research gate | open | CC attested: [validation](artifacts/validation.md) | Mock argv is insufficient; proposed-done, CDC pending |
| RP-04 | Config/forwarding/exit behavior is preserved | Process tests for config, cached/frozen and nonzero child | correctness-grade | Existing behavior | open | CC attested: [validation](artifacts/validation.md) | Full offline graph is later work; proposed-done, CDC pending |
| RP-05 | Docs and corrected binary are traceable | Guide/help review; source/tree/binary/runtime build receipt | correctness-grade | B01 drift | open | CC attested: [validation](artifacts/validation.md); [RP-B01](artifacts/build-receipt.md) | Version text alone insufficient; proposed-done, CDC pending |
| RP-06 | Validation and independent close support JSON launch | Targeted tests, make check, cited-path gate, scoped commits and CDC replay | correctness-grade | Expedited Mode | open | CC attested: [validation](artifacts/validation.md); [handoff](closing-report.md) | Test runner and other corrections stay open; proposed-done, CDC pending |
