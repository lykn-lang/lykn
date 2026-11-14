# S04 discard-aware declarations ledger

2026-11-14 opening atc60dea62. Eight criteria open; doer green is proposed-done.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| DT-01 | Discard and anonymous parameter labels preserve argument positions without collisions | Repeated typed `_`, `_value`, destructured and named arg0/arg2/suffix oppositions, deterministic clause/unit-local allocation; actual TS checker | correctness-grade | BS-04 and accepted discard roles | open | — |
| DT-02 | Declaration types describe supported default/rest/destructured input positions | Required/trailing/pre-required defaults, rest/default-before-rest, nested tuple default/skip/rest, explicit undefined under strict/exactOptionalPropertyTypes and fixed overload controls | correctness-grade | BS-04 real parameter contract | open | — |
| DT-03 | Binding exports match the real source namespace | Scalar/group/pattern inline and named exports, typed/inferred/unknown leaves, discard-only and empty handled groups, conservative module marker, stale-sidecar replacement and exact namespace keys | correctness-grade | BS-04 empty/mixed exports | open | — |
| DT-04 | Data/schema and existing declaration contracts survive | `_` object/schema/constructor fields, array holes versus typed entries, `_value`, normalized meaningful names, returns/pre/post/warnings, raw low-level helpers and empty non-module behavior | correctness-grade | Binding/data boundary and S03 preservation | open | — |
| DT-05 | Actual native/file/package consumers deliver the same declarations | Successful AnalyzedUnit API, real normal/strip CLI outputs, `lykn build` emitDts:true package, final sidecars read before assertions and executed JS outputs | correctness-grade | BS-04 actual generated delivery | open | — |
| DT-06 | Real TypeScript and runtime oracles discriminate wrong declarations | Generated local DTS type-only import, positive and expect-error calls plus one real TS negative, actual source namespace/runtime99/7/schema controls; no skip/replacement typings | correctness-grade | Operator/API assurance and S03 oracle lesson | open | — |
| DT-07 | Final source and current delivery gates pass | Focused Rust DTS/CLI, full make check/docs once, actual unchanged M670/all14 comparisons, final exact scope/coauthors/citations/fresh81920 size and actual skips/cache limits | correctness-grade | Repository delivery bar | open | — |
| DT-08 | Independent close preserves history and later owners | Separate Sol eight-row verdict, CC closing/inventory, root retrospective/BS-04/API/IR/research routing, immutable prompts/failures, task-only source and no S05/release advancement | serious | Autonomous Mode and operator conditional S04 authority | open | — |
