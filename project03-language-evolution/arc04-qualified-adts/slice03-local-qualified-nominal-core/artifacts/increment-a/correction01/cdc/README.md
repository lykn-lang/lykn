# Independent correction01 receipts — 16dcd64f

Separate Sol 6.1 High review, 2026-11-11. Clean source:
`16dcd64f09946b6bd484a893dcefa16c01e1b431`, tree
`6f36076d83c0f87b5e038be99604b8bc7eb5d531`.

`receipts-16dcd64f.tar.gz` SHA-256:
`c5d196d33c53dce597aff9e5aaf96d3c4ba4f9eb49124f47fde4184ca7ee3188`.
No binaries/packages/caches are included. The archive retains actual raw
launch/status/streams, product M6/dispatch receipts, Lykn-authored helpers,
generated public modules, exact census and final pins.

| Archive path | Observation |
| --- | --- |
| `receipts/emitter-forms/` | 202 passed/974 filtered; 44 tests locally select the internal raw producer. |
| `receipts/emission-results/` | 7 passed, including exact single-clause Codegen fragment diagnostic/span, complete-unit JSON and plain fragment successes. |
| `receipts/dispatch-matrix/`, `semantic/` | 1 selected test/58 filtered; four module/parameter × checked/stripped conditions each output `["array","string",["TypeError","choose-value: no matching clause for arguments"]]`. |
| `receipts/same-spelling-macro/` | 1 selected native semantic test/58 filtered passes. |
| `receipts/public-focused/` | 12 passed: 7 host-reference, 1 browser ESM consumer, 4 protected-invocation tests. |
| `receipts/m6-cold/`, `m6/` | 1 selected M6/5 filtered, seven module comparisons, 3 materialized public runtime tests pass; neither required multi-clause dispatch fixture is included. |
| `reference-probes.lykn`, `reference-results.json`, generated public modules | Fresh original all-nine driver: 27 runtime assertions/3 fragment rejections pass; formerly rejected shared reference now compiles. Product test separately runs two-call identity. |
| `test-census.lykn`, `test-census.json` | 202 test sections: 44 raw local aliases; 158 unchanged remainder comprising 125 sections with direct public emit_form calls and 33 other helper/internal tests. |
| `pins.json`, `receipts/final-pins/` | Clean state, 12 changed paths, contiguous trailers, tools and binary hashes. |

Explicit existing `DENO_DIR=/Users/oubiwann/Library/Caches/deno` and owned
npm/XDG/tmp below `/private/tmp/lykn-s03-a-cdc-16dcd64f` were used; M6 creates
another cold owned fixture. Rust/Cargo 1.97.0, Deno 2.9.6. Installed/release
CLI hash `9e3d716177cff6c9167efd4d45a0a99a5d0fe62be2f20ea1839a1c554830a300`.

Root required the missing materialized dispatch test and source-span completion.
No fresh full make/citation/size gate began on this known-incomplete candidate.
Prior gates remain separate at their original pins. No command here failed;
helper warnings remain session observations. No source/index/commit changed.
