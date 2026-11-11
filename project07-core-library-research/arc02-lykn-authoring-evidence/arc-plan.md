---
project: project07-core-library-research
arc: arc02-lykn-authoring-evidence
status: active
depends-on: [arc01-format-runtime-evidence]
---

# Lykn authoring evidence

Resume at the validated `685bbe1d` compiler with Deno 2.9.6.
Use the frozen [AE01 tasks](../arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/authoring-evaluation.md)
and [L-01–09 matrix](../arc01-format-runtime-evidence/slice01-baseline-and-protocol/artifacts/fixture-matrix.md).
Pin and capture the actual compiler, guide and book revisions for each
trial. The first control uses book `f55da0e` and the guides at
`685bbe1d`. Retain original attempts and distinguish runtime,
guide, book and operator judgments.

| Order | Work | Verification |
| --- | --- | --- |
| [S01 JSON value and decoder](slice01-json-value-and-decoder/slice-plan.md) | AT-02 with L-01–04 and its formatting checks | Tagged value representation, recursive checking, exact keys, domain Result and optional label. Compare both compilers on shared controls. |
| JSON file and module trial | AT-01 and AT-04 with L-05 and their L-06 checks | Read/edit/write, safe failure, async error and actual public module boundary. |
| YAML authoring trial | AT-03 on the accepted value route | No-op and edit byte diffs, with Y-14 document work following its compatible-route gate. |
| References and source review | AT-05 and L-07/08 | Reproduce book and guide discrepancies. Present retained source for the operator's code-shape judgment. Route corrections and L-09 to Arc03. |

S01 starts from the [exploratory ADT control](slice01-json-value-and-decoder/artifacts/adt-preflight/results.md).
Library contracts and separate projects follow the research synthesis.
