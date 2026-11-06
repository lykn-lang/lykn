# Slice10 ledger

All five rows independently accepted by CDC, 2026-11-06. CC's original open
attestations remain at a4a2bf1; actual review is in cdc-verification.md.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TI-01 | Exact authorized clean inputs and reviewed merge scope | Live identities/status/hooks; accepted source/13-path diff; merge-tree | serious | Operator integration | done | Reconciled: cdc-verification.md; artifacts/evidence/cdc/preflight.log | Exact inputs and scope, no source repair |
| TI-02 | Accepted repair locally integrated without extra changes | Two parents, a061 ancestry, exact572bc953 tree/13 paths; trailers | serious | Operator integration | done | Reconciled: cdc-verification.md; own preflight/identity.log | f705655; only release0.6, no push/propagation |
| TI-03 | Required release validation actually succeeds | Full unfiltered make check, focused native22 values, committed citations; actual populations/raw exits | serious | Repository gates | done | Reproduced: own make-check/native-focused/cited-paths logs and exit0 receipts | Rust1509; JS/Lykn1467; docs482; no bypass/updates |
| TI-04 | Real release binary and embedded/public compiler bytes reconciled | Absolute binary hash/version; canonical/mirror/materialized equality under fresh owned XDG/fixed Deno | serious | NE-C04 risk/Slice08 | done | Reconciled: own identity.log; cdc-verification.md | Real release artifact57a49f55; three compiler copies50db21ce |
| TI-05 | Independent acceptance, honest scope/history and retrospective complete | CDC own release gate/row walk; reports/plan/status and residual owners | correctness-grade | Autonomous endpoint | done | Reconciled: cdc-verification.md; cdc-retrospective.md; dated parent/backlog integration record | Historical failures/corrections and all other obligations preserved; endpoint only |
