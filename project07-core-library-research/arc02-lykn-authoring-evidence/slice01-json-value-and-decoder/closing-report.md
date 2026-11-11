# S01 JSON value and decoder closing report

Date: 2026-11-10. This is the canonical slice-root closeout for the AT-02 contributor candidate. The first closeout receipt was committed at [`artifacts/at02/closing-report.md`](artifacts/at02/closing-report.md); it is preserved unchanged. This root report supplies the required slice-level handoff and points to durable committed evidence.

## Result

The unchanged initial answer/source at `de33d6bf` remains frozen. Contributor native check, lint, default compile and stripped compile each failed at the same parser error (`unterminated list at 64:1`), so initial-source runtime was not run. Five corrected-draft parser failures were also retained. Under iteration04, the exact delimiter and conditional-expression corrections were applied and the task continued.

The final Lykn specimen passes native check/lint, native default and stripped compile/run, and public compile/run at the pinned toolchain. Native decoder default and stripped output match byte-for-byte; public default decoder output matches native default. The 47-row case manifest covers 35 ordinary decoder/config/key/edit rows and 12 controls. The independent reviewer reports all 105 ordinary row-condition outcomes and 36 control dispositions checked, with six actual nested-match runtime failures: T11/T12 under native default, native stripped and public default. Both nested match cases throw `ReferenceError` rather than producing their expected branch results; native and public error messages differ.

The zero-field list-vs-bare control found that the public compiler emits a function for a list-form zero-field declaration; stringifying the function yields `undefined`. The bare form emits a constant and works. The final specimen uses bare zero-field names, and native/public decoder outputs agree. This source adjustment and its pre-fix witness remain recorded.

## Ledger disposition

| Criterion | Evidence state | Status |
|---|---|---|
| JV-01: six JSON shapes and nested wrong values | Parsed shapes, recursive members and exact injected-undefined paths observed; see [findings](artifacts/at02/findings.md) and [raw decoder output](artifacts/at02/evidence/final/native/run-default-decoder.stdout). | Open pending reviewer/owner reconciliation. |
| JV-02: config failures and optional values | Port endpoints and wrong/missing/null values, plus label missing/null/empty/text/falsy/own-undefined distinctions, observed in the [case matrix](artifacts/at02/matrix.md) and [raw output](artifacts/at02/evidence/final/native/run-default-decoder.stdout). | Open pending reviewer/owner reconciliation. |
| JV-03: constructor, annotation and match boundaries | Default/stripped and native/public controls observed; nested match cases fail as noted above. See [control output](artifacts/at02/evidence/final/native/run-default-controls.stdout). | Open; retain the six failure cells for reconciliation. |
| JV-04: exact keys and immutable nested edits | Nine exact keys observed; nested update changes intended value, leaves original unchanged, and returns false alias identity. See [raw output](artifacts/at02/evidence/final/native/run-default-decoder.stdout). | Open pending reviewer/owner reconciliation. |
| JV-05: authoring, formatter and reference evidence | Initial source/receipt, intake corrections, failed attempts, final source, formatter receipts and replay are preserved; see [execution results](artifacts/at02/iteration-results.md), [replay receipt](artifacts/at02/replay.md), and [reference intake](artifacts/at02/intake-iteration01.md). | Open pending independent technical review. |

All five JV rows remain **open** pending independent reviewer disposition. Contributor execution and coordinator-reported independent reproduction do not themselves constitute ledger acceptance. Arc02 AE-05 owns the separate human readability judgment; the operator has the original and corrected source and the concrete review question, and the response remains pending. That judgment is not a prerequisite for technically accepting JV-05's preservation evidence. The initial answer's completion remains 0/1 because syntax acceptance failed; contributor runtime on that initial source remains 0/1 and blocked. The final matrix is evidence for this authored specimen, not a guide-efficacy result. No incidence statistic or causal claim is made.

## Scope and handoff

This was a known-valid JSON text decoder trial, not a safe parsing API claim. Malformed JSON parse exceptions, general numeric fidelity and lossless token fidelity were not characterized. No source checkout, package API, dependency, release or publication changes were made.

The candidate commit is `5be740daf857ec6a3529a6196caf4e8b70a7d432`; this canonical closeout and the durable ledger-link correction are a separate follow-up. The parent should reconcile the independent reviewer packet with the five open ledger rows and retain the nested-match failures in the final disposition.
