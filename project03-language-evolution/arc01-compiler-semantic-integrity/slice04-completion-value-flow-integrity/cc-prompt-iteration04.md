# S04 iteration 04 — align conditional scope with the resolved head

Same Luna 6 High CC and Sol 6.1 High CDC, standard Autonomous Mode.
Source refinement 03 of the normal five. The I1 candidate
`45df1093f109f7a27bf002c553f7d76cdfdc4125` is clean and untested
after its static hold. Review found an exact private mismatch. The
`kernel:if` ScopePlan branch keys off the raw name alone, while the native
classifier's explicit escape requires an actual form head.

In `resolver.rs`, choose `ScopePlan::Conditional` early only when
`values.first().and_then(SExpr::as_form_head)` yields `if` or `kernel:if`
and that exact spelling is not in the current lexical names. Match the
existing raw head for every other ScopePlan rule. Thus a real
`kernel:if` still works when only bare `if` is bound. Extend the current
private conditional scope test to prove that, and to prove a raw
`kernel:if` atom tagged `BindingRef` takes Sequence. No new population
or change to parsed integration fixtures.

Replace the stale inline-output comment above `emit_if_branch` and the
stale public compiler comment `Statement position: unchanged` with
accurate descriptions of block arms, and byte-copy the canonical
compiler mirror. Clarify Guide 00's newly added arm prose in plain
sentences, preserving scope, sequential bindings and direct targets.
Do not add a doc-only validation reset. No other source, rules,
tests/oracles, dependencies or API change.

Use the exact supplied source message
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-resolved-head-message.txt`,
normal Git/hooks and the five named paths above. Format/check, freeze
and return the exact delta for static release. Then execute the existing
I1 validation population under the original prospective condition,
including full Make and separate cites. NE-C14 remains separate.
