# AT-02 contributor closing report (candidate for independent review)

Date: 2026-11-10. Author role: CC. Source/CLI/Deno/book pins were reverified unchanged before execution; source/planning checkouts were clean at intake. Source checkout remained unmodified. Original source/answer at `de33d6bf` is frozen and byte-preserved. This is a candidate handoff, not independent acceptance.

## Execution and source record

The unchanged original was run first. Contributor check/lint/default compile/stripped compile all failed on the same parse error; no contributor runtime was claimed. Five subsequent draft checks failed and remain preserved. Iteration04 resumed under the operator's standing autonomy instruction with exact delimiter and expression-conditional fixes. Final sources are frozen and checksum-pinned:

- `final/decoder.lykn`: `7a99e9d63836b78d60047045f7129ca4780a20e8c494c17c31bb9ac8e52123ad`
- `final/controls.lykn`: `c5db7b99f2ca1cea3d6f41ded36233daad6cb4713d35d9876a435978174a39bd`
- `final/zero-field-control.lykn`: `3f56706c048cbba48c1f6891e2118aaad368d224c9bf5568b8656cf2071ae023`

Each final file was formatted twice with byte-identical result, checked, linted, compiled and run. Native decoder default and stripped output match byte-for-byte. Public default decoder output matches native default byte-for-byte. The zero-field form correction and compiler-specific nested-match failures are disclosed in `findings.md`.

## Case disposition

The frozen `matrix.md` declares 47 rows: 35 ordinary decoder/config/key/edit rows and 12 separate controls. Contributor raw runs have output for all rows in the three applicable paths (native default, native stripped, public default). Decoder outputs match across those paths. The 12 controls match on their substantive observations, except that nested-match failures have differing error message text by compiler. The two nested rows throw `ReferenceError` in both compilers and therefore do not meet their intended branch-value expectation. No hidden row was dropped; zero-field observations are a separately identified control supporting the documented correction.

Contributor output files: `scratch/final/iter11/run-default-decoder.stdout`, `run-stripped-decoder.stdout`, and `public/run-public-decoder.stdout`; controls equivalents; `run-zero-field.stdout`, `public/run-public-zero-field.stdout`. Native statuses/streams are copied to `evidence/final/native/`; public statuses/streams to `evidence/final/public/`. Emitted native/public JS is in `output/`. Do not use scratch `target/` files as the only durable evidence; tracked copies are retained outside target. The reconstructed public package tree and Deno cache are not part of this candidate.

## Ledger and open acceptance

| Row | Contributor evidence state | Candidate status |
|---|---|---|
| JV-01 | Six shapes and nested parsed values observed; nested wrong-value path observed at `$[1]`; raw own undefined path at `$["label"]`. | Open pending independent review. |
| JV-02 | Config bounds, wrong/missing/null cases, and missing/null/empty/text/falsy/own-undefined label distinctions observed. | Open pending independent review. |
| JV-03 | Constructor and annotation controls observed in default/stripped and native/public paths. Nested positive and negative matches fail with `ReferenceError` in both compilers. | Open; preserve compiler failure finding and await independent disposition. |
| JV-04 | All nine exact J-08 keys present; nested edit changes only intended value, retains original, and yields false alias identity. | Open pending independent review. |
| JV-05 | Initial response/source and reference intake receipts, all correction snapshots, formatter idempotence, compiler outputs, raw runs and this report retained. | Open pending independent review and operator readability assessment. |

Overall acceptance remains **open**. This is a known-valid JSON text decode trial; malformed JSON parse exceptions, general numeric fidelity and lossless token fidelity were not characterized. Do not convert contributor execution into independent reproduction or readability approval. Initial answer completion remains 0/1 because its source did not pass syntax acceptance; its contributor runtime was 0/1 and blocked. The extension's 47-row manifest is an observed matrix, not evidence of guide efficacy. No incidence statistic or causal claim is made.

Parent reports that the independent reviewer replayed the exact final hashes with 49 command cells exiting 0. Their exact-value audit confirms **105/105 ordinary row-condition outcomes** and **36/36 control dispositions**, including the six nested-match failures (T11/T12 under native default, native stripped and public default). This is coordinator-reported independent evidence, with raw packet parent-owned under `independent-original/` and excluded from this contributor commit. The parent will reconcile final ledger disposition; this report does not mark any row accepted.

## Handoff

Candidate contributor evidence is ready for independent review. Reconcile review findings with the slice ledger after reviewer completion. Keep all five JV rows open until independent disposition and operator review. No source checkout changes, package API changes, dependency changes, release or publication actions were made.
