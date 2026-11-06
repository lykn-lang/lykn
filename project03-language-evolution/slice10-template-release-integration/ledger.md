# Slice10 ledger

CC attestations are proposed-done; CDC independently disposes all five rows.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TI-01 | Exact authorized clean inputs and reviewed merge scope | Live identities/status/hooks; accepted source/13-path diff; merge-tree | serious | Operator integration | open | results.md; release merge f70565566088f5d55129edda6bd73a4691e5a58d | CC proposes done; CDC must independently reproduce. |
| TI-02 | Accepted repair locally integrated without extra changes | Two parents, a061 ancestry, exact 572bc953 tree/13 paths; trailers | serious | Operator integration | open | results.md; artifacts/evidence/cc/materialized-identities.log | CC proposes done; local release/0.6.x only, no push/propagation. |
| TI-03 | Required release validation actually succeeds | Full unfiltered make check, focused native 22, committed citations; actual populations and raw exits | serious | Repository gates | open | artifacts/evidence/cc/make-check.log; native-focused.log; cited-paths.log | CC proposes done; native proof is one test with 22 observations; CDC owns independent reruns and disposition. |
| TI-04 | Real release binary and embedded/public compiler bytes reconciled | Absolute binary hash/version; canonical/mirror/materialized equality under fresh owned XDG/fixed Deno | serious | NE-C04 risk/Slice08 | open | artifacts/evidence/cc/runtime-pins.txt; materialized-identities.log; release-binary-version.log | CC proposes done; exact local identities recorded in results.md. |
| TI-05 | Independent acceptance, honest scope/history and retrospective complete | CDC own release gate/row walk; reports/plan/status and residual owners | correctness-grade | Autonomous endpoint | open | | Pending independent CDC review, row disposition and retrospective. |
