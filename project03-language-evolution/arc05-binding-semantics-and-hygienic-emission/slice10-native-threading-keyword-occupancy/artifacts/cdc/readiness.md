# Independent preissue readiness review

2026-11-14, separate Sol CDC. **FINDING: revise the tagged Bare recipe before
issue.** This reviews the current dirty planning draft, not an issued CC
assignment or implementation. No formal refinement is charged.

Source independently read at clean
`a44e16db96ca4ae76de124b555c34ffe2c2779ba`, tree
`4080ee3f7be200610814b39b4118d2b5f3062ca8`, branch
`codex/qualified-adt-core`, worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Planning HEAD is `5035c148ba382338b0fec265572371b3d749bee2`; slice-plan.md,
ledger.md and cc-prompt.md were read completely in their uncommitted state,
together with the relevant Arc05 authority/roadmap sections. This reviewer
authored no implementation and ran no probe, build, import or Git mutation.
The only write is this assigned review artifact.

## Finding: distinguish tagged Bare expressions from raw list steps

The recommended common `thread_step` helper treats every List as a call step,
and the draft sends a Surface `ThreadingStep::Bare` through that helper.
Actual `apply_threading_step` treats a non-keyword Bare as an ordinary
expression (`emitter/forms.rs:3500–3506`), regardless of its S-expression shape.
`ThreadingStep::Bare(SExpr::List(...))` remains constructible through the
existing public Surface/fragment API, even though the source classifier
normally tags a list as Call (`classifier/forms.rs:1807–1812`).

For a concrete missed occurrence, a Bare expression can itself be a raw
`(some-> initial :child[t__gensym0])` that returns the function applied to the
outer accumulator. Lowering recursively classifies that inner expression.
The draft helper instead treats its list as a Call, scans `some->` as its
head and its keyword method as an ordinary argument, and misses the executable
keyword occurrence. Conversely a keyword-headed Bare list would receive a
method role that its tagged lowering does not assign.

Revise the contract so a Surface Bare reserves a keyword value when it is
itself a keyword and otherwise visits the complete expression ordinarily.
Surface Call retains the call helper. Raw unclassified steps retain the
keyword/List/ordinary distinction. Keep the helper design borrowed/private;
this needs no additional product path, grammar or public API. Add a bounded
inline regression in which a tagged Bare contains a genuine raw threading
expression, so the existing fragment boundary is protected rather than
implicitly restricted to classifier-produced Bare atoms.

## Evidence and remaining readiness

I inspected all retained baseline files: both exact .lykn sources, actual
generated .mjs bytes, runtime stdout/stderr and execution.md. The first source
sets a string-keyed global index and produces a local `t__gensym0` used as both
receiver and computed index, explaining the retained TypeError. The typed
plain-thread source produces a `result__gensym0` self-read in its initializer,
explaining the retained ReferenceError. Each callable child entry returns7.
These are inspected actual root receipts, not independent execution by me.
The previous native watch retains its original source-assessed scope.

The reservation timing is otherwise correctly selected: complete-unit
`emitter::emit` and public `emit_form` reserve before lowering, whereas nested
`emit_expr` dispatches directly to the inner emitter. Existing `text` forwards
to `EmitterGensym::reserve`; its physical mapping already handles computed
identifier runs and static Unicode aliases. No new decoder is needed.

The existing generated_name_hygiene.rs product clients support the proposed
actual CLI compile/runtime, serialized kernel-to-public-compiler and package
checks without a new runner. `EmitterContext::new`, its public gensym field,
the existing public emit_form entrance and the actual four Surface variants
support the proposed inline tests without a new accessor. The existing helper
name guide section is the appropriate narrow documentation home.

The four heads × two keyword roles × two extensions × two assertion modes
give32 main runtime cells. Fresh contexts, string-keyed global initialization,
unchanged foreign-read assertions and generated-binding separation oppose
accidental atom-census masking. Stripped plain-thread cells correctly do not
require the checked-only result helper. Separate negative census fixtures,
Unicode mapping, enclosing timing, ordinary atom control, null/order/effect
checks and a real JSON consumer provide meaningful wrong-implementation
controls. Existing private/package tests and M6 remain preservation gates,
with fresh actual values required instead of inherited counts.

Apart from the tagged Bare issue above, I found no blocking source/API,
domain-coverage, intake, proof-viability or three-path scope contradiction.
S10 remains open, root owns source/build, and neither implementation nor S07
is authorized by this preissue review alone. Re-read the revised draft before
recording readiness PASS and committed dispatch.

## Preissue resolution and final readiness

Root accepted the finding and revised the uncommitted slice-plan.md and
cc-prompt.md before dispatch. I re-read the changed binding contract,
recommended helper recipe and inline proof requirements. They now distinguish
`bare_step` (keyword text, otherwise ordinary expression), `raw_step` (List
call handling, otherwise bare handling) and `thread_call`; actual Surface
Bare and Call tags use their respective paths. The prompt explicitly requires
both the genuine raw thread inside a supplied Bare expression and the
keyword-headed ordinary Bare-list negative. This resolves the finding without
changing product paths, rows, API or scope. The original finding above remains
part of the preissue history, and no formal refinement has been charged.

**Final readiness: PASS for committed issue of this bounded initial
assignment.** This is source/prompt readiness against immutable a44 and the
current dirty planning draft, not implementation acceptance, independent
runtime verification or slice closure. Root must still perform its committed
dispatch and explicit source/build handoff; the six TK rows remain open.
