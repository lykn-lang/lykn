# Slice13 ledger

Seven rows closed at the first new evidence gap, 2026-11-06: one done,
six deferred. Historical Slice12 deferrals/process exceptions stay.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AE-01 | Narrow documented contract and real red regression established | Current source/guide/callers + frozen meaningful failing tests before patch | serious | NE-C07 | deferred | [Review](cdc-verification.md#red-evidence-and-candidate-limits), raw red logs | Meaningful CC red recorded; complete independent regression acceptance held at NE-C08, not upgraded from attestation |
| AE-02 | Valid async named bindings exported without scope widening | Private collector diff; positive wrapper and unknown/nested/duplicate/reserved/resolved-head regressions | serious | Operator repair | deferred | [Candidate provenance](artifacts/unvalidated-candidate/provenance.md) | Patch authored but never validated; live production edit restored |
| AE-03 | Actual native check/strict compile/imported await behavior proven | Focused native/CLI tests and generated code, exact42 LF and negative rejection predicates | serious | Semantic regression | deferred | [NE-C08 proof](cdc-verification.md#independently-reproduced-ne-c08) | Positive native check still red; async compile/import runtime not reached |
| AE-04 | Required complete source validation succeeds independently | Full unfiltered Make, committed citations, exact source/binary/tool/cache identities | serious | Repository gate | deferred | [Endpoint](cdc-verification.md#endpoint-and-remaining-work) | No post-patch focused/full gates; no accepted repair binary |
| AE-05 | Unchanged parser re-entry prepared and source/generated gates pass | Preserved followup, exact old data/new compiler pin, check/fmt/lint/compile/Deno check/whole gen review | serious | Operator continuation | deferred | [Endpoint](cdc-verification.md#endpoint-and-remaining-work) | PhaseB not authorized to proceed without independent repair acceptance |
| AE-06 | Same four offline observations pass or real new gap is honestly deferred | K11/K01/K08/K09 exact frozen expected raw/status/location/range and CDC fresh replay | serious | Bounded capability | deferred | [Closing report](closing-report.md) | 0/4 run, 4/4 unrun; new compiler gap precedes parser observations |
| AE-07 | Independent close, history/owners and retrospective complete | All7 rows, exact source/plan refs, old Slice12 unchanged, parent/backlog and retro | correctness-grade | Autonomous endpoint | done | [Review](cdc-verification.md), [retrospective](cdc-retrospective.md), Project03 NE-C08 | Independently accepted stop only; no next unit/repair/propagation |
