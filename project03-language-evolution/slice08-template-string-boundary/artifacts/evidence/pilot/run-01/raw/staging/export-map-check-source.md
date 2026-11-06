# Removed Slice08 export-map validator source

Removed on 2026-11-06 after functional parity acceptance of the Slice09 Lykn
validator and exact positive-output parity. The original tracked source was
`project03-language-evolution/slice08-template-string-boundary/artifacts/evidence/pilot/run-01/raw/staging/export-map-check.py` at planning commit
`7048fba9c5da1fefef4659d9c668d0b01d4616eb`, Git blob
`37e39ae6bc285a9a6212efd6725b5e1e1222562c`, SHA-256
`8bdaed8398d03e491cb6b349c7d764fc5d8066a6bf1d2467161d037dee105865`.

The identical ignored task copy at
`target/slice08/pilot/run-01/raw/staging/export-map-check.py` was removed at
the same time. No body copy or archive was retained. The replacement is the
Slice09 Lykn implementation at
`project03-language-evolution/slice09-lykn-research-helpers/artifacts/tooling/public-check.lykn`, with the fixed controls in `check-helpers.lykn`. Independent acceptance is recorded in Slice09 `cdc-verification.md`, “Functional parity and fixed controls”; CC's saved one-time original stdout and exact V0 parity are recorded in Slice09 `artifacts/results.md`, “Iteration01 fixed-control outcome”. The Python parity exception is consumed; no further Python execution is permitted.
