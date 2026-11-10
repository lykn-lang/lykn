# Ordered computed member call ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CM-01 | Actual computed reference preserves receiver/key order and source return | Shared F1, actual native/public runtime and emitted kernel | correctness-grade | I3 / CV-04 | open | artifacts/fixtures.md | Real effectful key and receiver |
| CM-02 | Getter and argument throw identity and transfer are preserved | Exact F1 trace, modes 1 and 2, no later call effects | correctness-grade | I3 / CV-04 | open | artifacts/fixtures.md | Actual source route |
| CM-03 | Ordinary output and checked unsupported boundary stay sound | F2 baseline byte equality and lexical get, F3 exact diagnostic, native kernel and public round trips | correctness-grade | I3 / CV-05 | open | artifacts/fixtures.md | Keep ordinary kernel and no extra support |
| CM-04 | Full final scope and actual independent gates agree | Actual producer pins, native/public and normal full Make/cites, mirrors | correctness-grade | AGENTS / Arc01 | open | cc-prompt.md | Other I3 work stays open |
