# Browser macro loader split ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| BM-01 | One shared expansion pipeline and preserved public package behavior | Actual compiled browser and staged ESM APIs, macro state and strict/lax behavior | correctness-grade | AM-06 | done | cdc-verification.md |
| BM-02 | Shipped browser retains DOM, fetch and distinct external macro diagnostics | Actual dev and minified CLI bundles in Chromium against baseline, with deterministic response | correctness-grade | AM-06 | done | cdc-verification.md |
| BM-03 | Deno and native embedded loader routes retain import semantics and isolated warm cache | Existing local macro suites, actual native cold/warm, legacy cache preserved, complete mirror | correctness-grade | AM-06 | done | cdc-verification.md |
| BM-04 | Actual CLI browser graph omits the Deno loader and the pinned meter records savings | Output-identical diagnostic metafile, native CLI bytes, fixed historical and 80 KiB budget | correctness-grade | AM-05/06 | done | cdc-verification.md |
| BM-05 | Independent replay and canonical gates agree | Frozen diff, unfiltered Make, cites, budget and independent product proofs | correctness-grade | AGENTS | done | cdc-verification.md |
