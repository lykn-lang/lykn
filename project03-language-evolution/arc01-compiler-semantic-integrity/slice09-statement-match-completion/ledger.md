# Direct statement-match acceptance

First baseline at `13e7a4bf` used old production f348. Native 11/15
passed. F1 strict analysis rejected the guarded-only top-level match,
and F2/F4/F5 reached the retained expected old bad behavior. Public
10/14 steps passed. F6 passed both routes. [Iteration 03](cc-prompt-iteration03.md)
adds an explicit unguarded fallback to F1, with the same behavioral
oracle. S09 refinements 02, including the F5 deterministic setup.

Current acceptance at `7b17a784` follows [refinement 03](cc-prompt-iteration04.md).
The Luna 6 High CC proposed all five rows. Separate Sol 6.1 High CDC
reproduction and [row walk](cdc-verification.md) accept all five.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SM-01 | One subject, ordered pattern/guard effects and first successful body | Frozen F1 old/current, exact native/public stdout and modules | correctness-grade | NE-C13/I2 | done | cdc-verification.md F1 | CV-04 remains open |
| SM-02 | Enclosing return and loop transfer targets preserved | F2/F3 native/public strict runtimes, no inserted function/loop | correctness-grade | Operator source completion rule | done | cdc-verification.md F2/F3 | Checked exits remain I4 |
| SM-03 | Exhausted guarded catch-all throws existing error | F4 selected guarded match in try, exact caught message and order | correctness-grade | Guide00 / I2 | done | cdc-verification.md F4 | Consumed exhaustion separate |
| SM-04 | Binding and macro scope, hygiene, consumed and protected controls preserved | F5 actual macro/normalization witness, F6 checked tail/post-effect, existing consumed/bound tests and complete modules | correctness-grade | DD60/DD61/I2 | done | cdc-verification.md F5/F6 | Finite controls, native clause scope and checked exits remain open |
| SM-05 | Whole source and repository validation accepted | CC and separate CDC exact source/runtime/full Make/cites, mirrors, source guide and record | correctness-grade | AGENTS/Arc01 | done | cdc-verification.md, closing-report.md and cdc-retrospective.md | Task-only acceptance |
