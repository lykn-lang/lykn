# CC correction03 — raw callable parameter regions

Issued2026-11-14, Project03/Arc05/S03 refinement03, following
[correction02](cc-prompt-iteration02.md). Same Luna6 High CC and separate
Sol6.1 High CDC, Autonomous Mode through independent S03 close only. Root
owns planning Git/index/rows. This is the third refinement within five passes.

## Source, finding and exact scope

Start clean at `3d21eab58cb3d28714338e8742dbb0a9c519822b`, tree
`b7788f6564863f51d5e8fe62979098b583b7b4b6`, existing
`codex/qualified-adt-core` worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Planning remains `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`.
Do not amend reviewed commits. Release/0.6.x stays0829e892.

Independent [source-first evidence](artifacts/cdc/correction02/source-first.md)
resolves R01–05 but confirms R06: a user macro named
`discardValue__private` intercepts an ordinary `(=> (_) _)` parameter-list
container, changing arity1 to2 through both facades. Explicit kernel control
remains length1. New8 passed but full gates were correctly withheld. All nine
PB rows remain open; preserve prior HOLDs, failures, prompts and limits.

Only THREE product paths may change:

1. `packages/lang/binding.js`
2. `crates/lykn-lang/embedded/packages/lang/binding.js`
3. `test/forms/remaining-discard-bindings.test.js`

The complete delivery remains the same fourteen paths, eight top-level new
groups and M6 exact70/all14 comparisons. No other source/docs, writer,
whitelist, sanctioning, macro priority, dependencies, raw API or native change.

## Loading and intake before edits

Required-full, in order: this prompt; current slice-plan.md and ledger.md;
artifacts/cdc/correction02/source-first.md; source AGENTS.md. Required-section:
cdc-verification.md correction02 verdict; original prompt helper/commit/return
rules; correction02's R01–R05 and gates; CC correction02 intake/closing additions.
Read the actual complete bindingScopePlan, functionRegionLayout,
expandChildrenPlan, expandFunctionRegions, expandAt dispatch/preparation and
whole/fragment lifecycle, plus the entire current new540-line suite. Recover
truncated output. Required-guidance: engineering-methods intake; testing's
Proportionate Proof; JS/Deno anti-pattern ID12, function lexical-scope guidance
and Deno testing ID08. Resolve installed skills through the catalog.

Append exact loaded extents and source-cited readback to canonical
artifacts/cc/intake.md before dependent edits. Explain why resolved callable
structure differs from marking syntax kernel and why the existing escaped-only
fragment tests did not prove this producer. Earlier receipts are not substitutes
for required contents absent from the executing context.

## Binding repair and worked implementation

Root inspected binding.js:458–495 and expander-core.js:932–938,1025–1060,
2224 onward at3d. The caller already dispatches after lexical/user-macro
priority. Existing function-region expansion leaves the parameter container
structural, expands only discovered default RHS paths and body paths, and
extends the existing lexical environment. The current isKernel condition
accidentally excludes admitted unmarked raw callable heads.

**Binding:** route resolved ordinary `function`, `function*` and `=>` through
the existing functionRegionLayout regardless of isKernel. Keep `lambda`
marked-only, preserving its typed Source classification. Recommended condition:

    ["function", "function*", "=>"].includes(headName) ||
      (headName === "lambda" && isKernel(form))

This sketch replaces only the present callable-region condition. Keep the
existing layout/null handling and other plans. Do not mark raw source as kernel,
broaden escapes, change formHead to hide the symptom or recursively rewrite
parameters. Preserve lexical/macro head resolution before this point, default
evaluation timing, named recursion, actual generator sentinel layout and errors.
No new public API, module, runtime state or resource owner is needed. This reuses
the current linear region walk rather than adding a second traversal.

JS guidance applied: SHOULD-AVOID accidental shadowing (anti-pattern ID12)
supports keeping actual lexical regions, not textual macro-name bans; existing
function-region consumers supply the proper scope. MUST error-test guidance
(Deno ID08) supports retaining exact strict rejection checks. These are domain
applications, not claims that syntax checks establish behavior.

## Discriminating regression and retained proof

Inside existing eight groups, add a source macro named `discardValue__private`
returning `(captured-one captured-two)`, then an ORDINARY `(=> (_) _)`.
Against foreign `_`99 and argument7, compiled ESM must show length1/result99
through both public Deno and browser facades. The macro must not run on the
parameter-list container; an execution/expansion count can make this explicit.
Use actual source macro or existing macroEnv, reset in finally when needed.
Do not rely solely on explicit kernel or typed fn controls, which already pass.

Exercise the same protection through expandExpr on unmarked ordinary arrow
and supported explicit-lax raw named function and generator (including the
String-empty sentinel). Preserve arity, default RHS macro expansion exactly once
and call/body timing with opposing live values. For priority controls, bind
`lambda` to a typed fn and invoke `(lambda 7)`; separately use a user macro
named `function` that emits an addition. Do not bind reserved JS `function` or
create a self-reexpanding arrow macro. A callable bound lexically or selected
by a legitimate user macro still wins head resolution; strict ordinary function
rejection remains intact. Use current real APIs/subprocess helpers;
do not create verification software. Existing R01–05 cases stay present.

Before the production repair retain a focused red showing the new test fails
at3d for arity or unexpected macro dispatch, not invalid fixture syntax.
Keep the test condition and full streams/status. Then mirror binding.js exactly,
refresh make fresh-artifacts and run the existing four-file focused66 command.
After green, run full make check/docs once, actual M6 exact70/all14 comparisons,
then exact three-path source commit with adjacent coauthors, final-HEAD citations
and fresh81920-byte size gate. New evidence/cache roots use correction03 under
the existing owned homes; never overwrite earlier conditions. Preserve complete
output, actual warnings/skips/download/cache/tracing limits and all failures.

Append correction03 intake/closing/bubble-up with exact candidate/commands,
R06 disposition, all nine PB obligations and limitations. Return clean/no jobs
to root for the same independent Sol review. Root alone commits planning.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
must be Lykn, never Python/Ruby/Fennel/handwritten JS/Node or another scripting
language. **No Python execution or parity exception.** Named product JS/tests/
fixtures are this deliverable; native shell/Git only direct invocation/simple
filesystem lifecycle. No S04, merge, push, licence/publication or remote action.
Fix obvious scoped problems autonomously; return a genuine non-obvious contract
or evidence gap before dependent work. No ledger row closes on doer attestation.
