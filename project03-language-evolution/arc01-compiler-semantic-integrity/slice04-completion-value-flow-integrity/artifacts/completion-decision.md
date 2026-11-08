# S04 decision needed — return targets inside discarded match

## Resolution — Operator decision, 2026-11-08

Operator adopted source-level completion uniformly: nearest language-level
function (including intentionally macro-introduced functions) owns return;
source loops/labels own break/continue. Compiler wrappers are not semantic
boundaries and consumption/discard cannot retarget transfers. This is now the
binding principle. The historical choice table below remains the pre-decision
record, not an unresolved poll or selection of a private IR. Current work is
design only; [assignment](../cc-prompt.md) engineers staged implementation and
remaining interactions. No production source/test/probe is authorized here.

2026-11-08, CDC source/design reading only. This brief consumes the existing
C02/C05/NE-C13 assignment; no new experiment or implementation is authorized
by the brief. No S04 runtime observation, source change or compiler failure is
claimed. Release62e is independently accepted by Slice22.

## Worked source consequence

Consider the following **static illustration, not a frozen/executed test**:

```lykn
(func f :args (:any n) :returns :any :body
  (match n (_ (return "inside")))
  "after")
```

Current native Statement-match lowering places its clause in a block/if chain:
the explicit return targets `f`, predicting `"inside"`. Current publicJS lowers
the match to an arrow IIFE: that return targets the generated function, its
discarded result is ignored, and `f` reaches `"after"`. The distinction follows
the actual lowering paths; neither prediction has been runtime-tested here.

DD50's selected position-aware rules acknowledge local IIFE returns, and Rule3
plus today's guide00 say match always IIFE. Native's earlier April optimization
introduced bare statement chains without an explicit abrupt-exit decision.
This cannot be settled by calling either backend an oracle or by preferring
the smaller patch. `break`/`continue` also need precise targets: an IIFE is NOT
a loop, and a new function boundary cannot legally target an enclosing loop.
The historical shorthand that these simply "exit the IIFE" is not a valid
unqualified JavaScript contract.

## Concrete choices and costs — none selected

| Choice | Result for f | Bounded engineering consequences |
| --- | --- | --- |
| Keep documented match-local completion in every position | `"after"` | Align native discarded match with the documented/publicJS wrapper rule. Explain the local-return boundary; preserve normal throw propagation. Fix guard progression/exhaustion without promising legal outer-loop break/continue through a function. This changes today's native statement behavior. |
| Preserve native transparent completion for discarded/statement match | `"inside"` | Introduce a matching publicJS statement-context route and explicitly document the position distinction. A hygienic block/selection continuation may preserve outer return/break/continue without a new function/loop boundary, but that mechanism is not yet selected. Consumed/value match retains the separately acknowledged wrapper rule unless scope is explicitly expanded. |
| Adopt source function/loop targets uniformly across consumed forms too | `"inside"`, independent of consumption | Broader completion design for match/if/do synthetic wrappers, async/value transport and abrupt exits; requires an explicitly sized design/scope decision, not a silent S04 label-block patch or A6 migration. |

The programming-language principle is the decision: whether source-visible
control targets may depend on an invisible generated function. CDC/root lean
toward explicit source boundaries as a long-term principle, but that inclination
is **not Operator approval** of the second/third choice or their implementation
scope. A narrow positional contract and a uniform source-boundary contract are
different commitments. Operator should select the intended rule and boundary
before tests encode it. No backward-compatibility shim is proposed merely for
stability; the previously selected0.6 breaking-development policy remains.

## Consequences for the other S04 work

C02's braced statement branches/block scope have direct source-contract support;
current resolver arm isolation must be checked alongside printing. C05's
explicit return is not banned by implicit-return style. Typed/post result checks
must target actual outgoing returns from the intended function, not accidentally
rewrite a return belonging to a nested source function or match wrapper.
Finally may change an outgoing completion; syntax-only final-return extraction
does not prove type/post enforcement. These recipes depend on the return-target
decision; no production authoring is dispatched meanwhile.

Guard false must continue to later candidates; source reading also finds that
publicJS's final exhaustiveness decision uses only the last pattern, not its
guard. This is a held source-only NE-C13 completion input, not a measured new
failure or evidence that all public/native guard paths share one cause. S03
accepted finite value controls remain accepted.

## Source map and confidence

All current product locators refer to exact62e/tree6721237 in the existing task
checkout; paths below are repository-relative. Native:
`crates/lykn-lang/src/emitter/forms.rs::emit_match_statement/emit_match_iife/emit_func_single/emit_func_multi`,
`crates/lykn-lang/src/codegen/emit.rs::emit_if/emit_stmt_or_block`, and
`crates/lykn-lang/src/resolver.rs::scope_plan/resolve_seq/resolve_form`.
PublicJS: `packages/lang/classifier.js::emitMatchMacro/buildSingleClauseFunc/buildMultiClauseFunc`
and `packages/lang/surface-helpers.js::wrapReturnLast/isControlTransferForm`.
Guide00 match473/guard501+, guide01 ID19/26/32 and guide06 ID11/14.

Canonical [DD50](../../../../project01-mvp/arc13-position-aware-compilation/artifacts/design/06-final/0050-position-aware-compilation-of-conditional-and-block-forms.md)
Rule1/3/IIFE caveat and [DD50.5 Pattern7](../../../../project01-mvp/arc14-kernel-context-refinement/artifacts/dev/0010-dd-50.5-kernel-form-context-refinement-prompt-for-cc.md)
provide the historical conditional/explicit-return contracts. Native split
origin2c0304c14b703969efb2912fbbb4e76a5d8ebcc6 (2026-04-04) describes a discarded-
result optimization; it predates DD50's May contract/current guide. Historical
C05 full-source330ff2c4…3a923/output04567627…a0b67e are still present at their
retained target/slice09 paths. C02 lacks its original full module. None of these
facts is promoted to a new current runtime result.
