# S02 initial-attempt retrospective

2026-11-07, CDC Sol6.1 High; fresh Luna6 High CC. This covers the stopped test-only attempt, not a completed source delivery or a model benchmark.

The concrete design and staged old-API tests avoided an artificial type-error baseline during a Result API migration. Fixed message files and raw Git readback produced compliant trailers on the actual test commit; static review caught defective oracles before any behavioral execution or production patch.

The first implementation still reproduced avoidable test-design mistakes: deriving output paths from directory names rather than actual package-name semantics, assuming all successful compilation produces DTS, omitting the package runtime half and accepting empty stderr through contains(""). CDC's prompt owned source-ready precision: it should have supplied the exact `emission` path and explicit absence oracle, rather than relying on the contributor to reconcile them. The required runtime predicates were already stated but not faithfully implemented. These observations support a narrow correction of this test, not broader claims about the language guides or model effectiveness.

Prospective evidence capture was also not followed for the no-run build: only later transcript readback remains, no separated durable streams or post-build pin. Preserve that limit; do not regenerate a compliant historical receipt. Failed commit-command readback also described an outside-file restriction, but placing -F AFTER -- makes it a pathspec; this does not establish a Git restriction on reading an external message file. Supplied original messages and actual successful raw body remain available.

Review and stopping were useful, but no behavioral source work was reached. Do not claim improved efficiency or source correctness from this attempt. The proposed remedy is one consolidated test-only correction under explicit continuation authority, followed by the original red/green/full-gate design. No additional checker/framework, source family, tool-budget reset or automatic next unit is recommended.
