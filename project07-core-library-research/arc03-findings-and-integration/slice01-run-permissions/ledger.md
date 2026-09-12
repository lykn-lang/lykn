# Run-permission correction ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RP-01 | Both run routes add no implicit grant | Standalone/workspace Lykn and JS argv tests; original failure retained | serious | PERM | open | — | Actual child boundary |
| RP-02 | Explicit flags and script args obey the CLI contract | Bare/scoped/repeated options, -A, equals, spaces, -- and flags after FILE | correctness-grade | CLI contract | open | — | No arbitrary passthrough |
| RP-03 | Actual Deno enforces narrow grants | No-grant denial, scoped success, outside-scope and explicit deny controls | serious | Research gate | open | — | Mock argv is insufficient |
| RP-04 | Config/forwarding/exit behavior is preserved | Process tests for config, cached/frozen and nonzero child | correctness-grade | Existing behavior | open | — | Full offline graph is later work |
| RP-05 | Docs and corrected binary are traceable | Guide/help review; source/tree/binary/runtime build receipt | correctness-grade | B01 drift | open | — | Version text alone insufficient |
| RP-06 | Validation and independent close support JSON launch | Targeted tests, make check, cited-path gate, scoped commits and CDC replay | correctness-grade | Expedited Mode | open | — | Test runner and other corrections stay open |
