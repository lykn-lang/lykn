# Incremental source-completion design — 2026-11-08

**Design recommendation, not implementation acceptance.** CDC `/root/cdc`
(Sol6.1 High) authors/selects this proposal; fresh Luna6 High
`/root/cdc/completion_design_luna_cc` supplied a read-only source feasibility
contribution under [the issued assignment](../cc-prompt.md), not code or
independent acceptance of CDC's design. Root contributes read-only co-design.
Product remains clean62e9531e/tree6721237; no builds/tests/probes/new fixtures or
production source edits occurred. All six CV rows remain open. Operator approved the
semantic principle, not every representation/host assumption below.

## 1. Binding semantics and selected representation direction

Return belongs to the nearest **language-level** function; break belongs to a
source loop/switch/valid label, continue to a source loop (including a label
aliasing that loop). Target search stops at a language function. Preserve
existing switch behavior; Operator's loop/label shorthand does not remove it.
Compiler transport wrappers/labels never become source targets. A class method,
constructor or construct intentionally defining a callable function is semantic
even when its JS syntax is generated. Macro-produced genuine functions count;
macro-produced match/if/do forms do not create extra function boundaries.

Use a **private structured evaluation/completion plan**, with source target and
binding identities distinct from S03's consumption/cardinality roles. Retain
ordinary value expressions as existing AST leaves where a complete adapter
establishes no required lifting. This is not A6's full recursive typed public
surface AST. Do not retrofit fields into public SExpr/ESTree merely for metadata.
No runtime Completion object or exception protocol is implied by the model.

Uncompiled private shape (names illustrative, invariants binding for the design):

```text
FunctionId, LoopId, SwitchId, LabelId, BindingId, ScopeId, NodeId
BreakTarget = Loop | Switch | Label; ContinueTarget = Loop
NormalResult<T> = NoValue | Value(T)    // Value(undefined) is a real value
Completion<T> = Normal(NormalResult<T>) | Return(FunctionId,T) | Throw(T)
              | Break(BreakTarget) | Continue(LoopId)
NormalReachability = Never | Possible   // summary, not a fabricated outcome
Region = lexical scope + executable role + source-origin + owned targets
EvalPlan = ordered region/effect plan + Normal value destination
ReferencePlan = binding OR (base,key,receiver,reference-kind)
ArgumentPlan = ordered value/spread operations, NOT a plain value vector
```

Proposed private entrypoints (uncompiled design signatures, not existing APIs):
`plan_unit(resolved, origins, registry) -> Result<PlannedUnit, LyknError>`,
`lower_value(node, destination, region) -> Result<RegionPlan, LyknError>`,
`lower_reference(node, region) -> Result<ReferencePlan, LyknError>` and
`lower_arguments(args, region) -> Result<ArgumentPlan, LyknError>`.
Raw/classified input adapters share target/role rules; checked public emitter
facades and CLI routes consume the internal plan rather than exposing it.
JS uses equivalent private functions/throwing boundary, not a new root export.
An internal compiler-only module and canonical/embedded byte synchronization/
fresh materialization are future source homes, not an imported user runtime.

`ExprUse` remains Statement/Value/Tail; no From/Into/public enum change is needed
to confuse those with target ownership. Closed private enums/newtype IDs follow
Rust TD-03/TD-06 (SHOULD): exhaustive state/data pairing, rather than unrelated
return/pending booleans. JS uses private tagged variants/exhaustive adapters,
not publicly mandated AST fields. Source spans remain attached where known;
macro/synthetic unknown locations are identified honestly, never fabricated0:0
as a precise source blame. S02 checked errors/phase distinctions stay intact.
Normal statement completion without a value is not `Value(undefined)` and not
an absent normal path (all paths abrupt). Preserve DD50.6's typed statement-only
tail diagnostics; do not turn an invalid valueless tail into a synthesized
undefined success. Explicit bare return carries its language undefined return
value as a Return completion, not normal statement fallthrough.

## 2. Phase ownership and public entrypoints

Native `expander/mod.rs::expand` returns unchanged forms without macros;
otherwise pass2 expands macros/sugar before resolver/classifier/emitter. Native
pass2's ordinary sugar is not itself proof of a lost function boundary, but
`eval_surface_macro` can already return kernel through the Deno JSON wire.
PublicJS `expandExprInner` classifies builtins and recursively expands them
before/among user macro fixed points. There is no universally safe existing
"post user macro, pre wrapper" pass to invoke blindly on both routes.

Recommended phase split:

1. Expand user macros with existing lexical shadowing/quote rules; retain
   unlowered language constructs or trusted compiler-origin information where
   an imported surface-macro adapter already produced transport kernel.
2. Resolve symbols and assign executable regions/source targets BEFORE builtin
   wrapper construction. Syntax/header/property/pattern/quote regions are not
   generic executable lists. Parameter/default/initializer/deferred ownership
   needs explicit form adapters; bodies are still compiled, not skipped.
3. Plan completion/value/reference operations; lower to completion-safe kernel
   or ESTree; only then expose the ordinary compiled representation.

Private unit adapters can own `tree + region/target/binding data`. Native IDs
are private arena/path identities allocated after expansion, not spans used as
unique keys. If origin metadata crosses the macro subprocess, use an explicit
private protocol envelope in `expander/env.rs`/`deno.rs` and the existing bridge;
do not infer transparency from raw function spelling or the sanctioned-kernel
WeakSet. An unannotated genuine function emitted by a user macro is semantic.

PublicJS `expand`→`compile` is an exported seam. Prefer completing normalization
before exposing expanded kernel, so correctness does not depend on a WeakMap
secret that disappears on cloning/JSON. `compile` must also normalize supported
raw-kernel input consistently. Public `compileExpr` and Rust `emit_form` cannot
silently invent an enclosing source function for a free return: keep successful
self-contained expressions/forms, and provide an honest context/target error
where an isolated low-level entry lacks an owning region. Exact low-level API
error/documentation disposition is part of the affected coding readiness/S07;
no public entrypoint removal or public AST migration is selected here.

A source-origin function and a transparent helper are not equivalent to
"handwritten" and "generated". Pure helpers may remain if proven not to alter
source control, lexical this/arguments, await/yield or value adoption. Control-
bearing transport IIFEs must not survive merely because they are convenient.

## 3. Evaluation, references and the concrete held host gate

Destination lowering makes value `if`/`do`/`match` assign a hygienic result slot
inside selected scopes; source Return/Break/Continue retain their target IDs.
Short-circuit operands and branch prefixes stay inside the selected branch.
Evaluate earlier operands before later lifted work unless they are proven
stable literals/private temps; do not infer purity from generic syntax/size.

Calls require more than a saved value. The
[ECMAScript call algorithm](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-evaluatecall)
gets the callee before arguments and derives receiver from its Reference.
For a getter method followed by a control-bearing argument, save base/key,
read the callable once, then evaluate arguments; retain original receiver even
if an argument changes the property. Simple assignment saves base/key before
RHS; compound assignment also reads before RHS and writes afterward.

Argument spreads are ordered iterator operations: finish each spread at its
original position before later argument work. Do not postpone spread by first
hoisting values, or re-spread a materialized Array with a possibly changed
iterator. A private null-prototype ArrayLike accumulator with native iteration
is an uncompiled candidate, not a requirement for a new runtime; user push/
.call/.apply methods cannot be trusted as implementation primitives.

**H1 — REAL contract/effect gate, not a missing-API blocker:** a new private
CallWithReceiver operation is ordinary compiler implementation. Its JS lowering
still needs a justified invocation capability. `savedFn.call(...)` is wrong for
an own overridden .call; a hygienic captured `Reflect.apply` is plausible but
current inspected code supplies no primordial capability. A bounded search of
current docs/guides, skill, README and AGENTS for intrinsic/primordial/realm/
Reflect/globalThis found no standing mutable-realm trust contract (only a
cross-realm array note). This is not proof no historical statement exists.

Concrete alternatives, NOT selected:

| Route | Preserves / costs / gate |
| --- | --- |
| Feature-local compiler-private alias captured at module entry | Can retain saved receiver/callee and protect against later within-module replacement. Source Reflect/globalThis shadowing requires actual binding hygiene, not a fresh alias alone. Pre-module host poisoning still affects capture. A property read at module initialization can retain effects/payload even when the feature's function is unused. No purity annotation or unrun esbuild claim may erase that. |
| Lazy capture in the using function/path | Avoids module-load read for unused code, but can observe an earlier within-module mutation that ordinary method syntax would not need. It is not equivalent under a merely "standard at module entry" assumption. |
| Trusted host-supplied primordial capability | Addresses poisoning/hygiene only under a newly specified capability contract; must not silently introduce a mandatory imported runtime/dependency or new deployment requirement. |

Counterexample is static: replace host Reflect.apply before compiled module
initialization; its ordinary `receiver.method(arg)` would still work while a
captured replacement may fail. Distinguish this from own .call overrides,
source lexical shadowing and mutation AFTER an already-correct capture. None
was executed here. Ordered-call lowering is **HELD** until H1 is resolved with
source-first/no mandatory runtime/zero unused payload constraints. No unsupported
"safe global" assumption, helper implementation or new K trial is authorized.

Hygiene needs BindingId→JS-name allocation after expansion, reserving source and
macro names AND free references after JS identifier conversion, plus separate
source-label IDs. Existing `{prefix}__gensymN` counters do not prove collision
avoidance. If freeing a compiler global reference requires alpha-renaming a
source binding/import, rewrite resolved refs and preserve property/export names;
record observable generated-name/API impacts, not a raw string replacement.

## 4. Completion through finally and checked function exits

Use region-scoped completion, not one global pending-return flag. A finalizer's
normal completion preserves its incoming completion; its abrupt completion
replaces it. A user catch handles only an actual Throw; return/break/continue
must never become catchable exception packets. The
[try algorithm](https://tc39.es/ecma262/multipage/ecmascript-language-statements-and-declarations.html#sec-try-statement-runtime-semantics-evaluation)
is the model for the region adapter, not a mandate to allocate runtime records.

Uncompiled transfer rule:

```text
B := completion of protected body; apply user catch only if B is Throw
F := completion of finalizer, evaluated with its own region state
out := if F is Normal then B else F
consume only a transfer matching the source loop/switch/label being exited
check type/post only when the semantic function's settled completion exits
```

Keep native JS abrupt/finally constructs where this rule can be emitted directly;
where outgoing checks need transport, use private structured region joins/
scalar completion state or an equivalent proved adapter. A saved value followed
by break-to-one-epilogue is NOT the chosen sufficient algorithm. Captured pending
state must be scoped to each protected/finalizer region; a caught cleanup error
cannot resurrect a cancelled return, or erase an outer pending return when
cleanup itself completes normally. Implicit thrown getters/calls matter too.
Function/loop targets consume only their own completion, not an internal label.

Return operands execute once at the original point and inside the original
catch scope. User finalizers finish (and may replace/mutate the value) before
return-type/post checks. Uncaught throw preserves identity and bypasses normal
exit checks; contract errors remain callee blame. Do not weaken S02's first-
fatal/route/file guarantees or expand `check`'s documented subset implicitly.

`:post` is not assumed to see only params/~: current lowering can leave body
locals in the same scope as the emitted predicate, and classifier retains raw
post expressions. Preserve source BindingId/scope/TDZ and by-reference capture;
do not move a post outside a new block or initialize a body-local let early.
A scope-preserving exit continuation or selective accessor capture is a design
option; exact target emission (including source var/function hoisting and
awaiting predicates if supported) MUST be worked before the protected-exit code
assignment. This is a readiness obligation, not a claim a generic epilogue works.
No new restriction on post free variables or abrupt contract predicates is
quietly selected. Their supported grammar must be resolved if a required case
depends on it; arbitrary contract-transfer semantics are not invented here.

Async recommendation preserves existing phase ordering: source explicit await
resolves its operand; user finally settles; check the outgoing source operand;
then the semantic async function performs its ordinary Promise adoption. No
synthetic async wrapper/extra await merely transports a raw Promise value, and
untaken await branches do not suspend. This follows current async-wrapper/func
placement and guide07 ID11's synchronous pre-await rule; it is a precise design
proposal to validate, not a new universal :promise annotation promise. Keep
generator/method/deferred regions distinct; no whole generator/type-policy
redesign is smuggled into a current-function return scan.

## 5. Recommended useful implementation split (not executed/approved code)

One Luna-sized patch cannot responsibly include this entire phase/flow change.
Recommend four source deliveries. Preserve existing S01–03 and S05–08 identities;
proposed remaining homes S09–11 have no directories/prompts now. S04 remains the
current design/first-delivery owner; explicit transfer at future closure must
retain every CV obligation. Dependency order, not directory number, governs.

| Delivery | Concrete homes / useful outcome | Falsifying oracles / readiness | CV ownership |
| --- | --- | --- | --- |
| I1: S04 source boundaries + C02 branch scope | Native private region/target module; resolver ScopePlan and BOTH resolve/shadow consumers plus pass2 scope adapter; codegen if branches; publicJS expander scope/stage adapter and compiler if builder. Add target information before wrappers and preserve public expansion shape. | Braced first/alternate declaration arms, grouped sibling visibility within an arm, no alternate/following leakage, dangling-else selection. Macro emits genuine fn versus match-return get different target ownership; genuine bound fn/match remain calls. Expected original C02 parse-red only after exact frozen current baseline; no new runtime claim now. **Designable independently of H1**, exact future source prompt still required. | CV01/02; supplies region facts for CV03/04 |
| I2: proposed S09 transparent value/control lowering | Private destination plan; native emit_if/do/match and public expand/classifier/compiler adapters. Preserve lexical blocks and lazy conditions, guard progression/exhaustion, source targets in consumed and discarded forms. | Original f must yield inside in BOTH positions/backends; true/false guards select exactly once, subject count1, all-false guarded wildcard throws existing no-match error. Short-circuit untaken control arm has no effects. Cover ordinary bind/return destinations first; unsupported ordered-call/reference compositions wait I3 with explicit partial-delivery diagnostic/HOLD, NEVER a control-bearing IIFE/raw fallback. CV04 stays open globally. | CV01/04; CV05 partial |
| I3: proposed S10 ordered references/arguments | Private Reference/Argument plans and backend call/member/assignment adapters; exact compiler hygiene/invocation capability after H1. No mandatory runtime or unconditional unused-feature capture by assumption. | Getter→argument→original method/receiver sequence; own .call override not consulted; argument mutates method but saved original runs; throwing getter skips args, throwing arg skips call. Spread iterator completes before next arg; compound assignment base/key/get/RHS/set once/in order. **HELD H1**, no source assignment ready yet. | CV01/05; source-first/public-impact gates |
| I4: proposed S11 protected function exits + composition | Func single/multi clauses, private target/finalizer adapter, checked-emission diagnostics, scope-aware post/type exit continuation and both backends. Preserve async/generator controls and all prior accepted regressions. | Surviving explicit/implicit result checked once after finally; exact tests below. Scope-preserving target-code recipe is a required readiness checkpoint, not omitted work. Size may require a further approved usable split before source, never an exhausted-budget workaround. | CV03/05/06; final CV01/04 composition |

Each source delivery includes its affected tests/guides/LLM reference, full
normal Make/citations and separate CDC source/generated/native/public/runtime
acceptance; no investigation-only repair/review chain. Existing old-source
receipts establish history, not current applicability. New shared controls are
source regression fixtures, NEVER edits to original frozen K13 rows/oracles.
An interim unsupported-composition diagnostic must blame incomplete lowering,
not falsely declare valid Lykn invalid or prescribe a semantic workaround. Its
exact observable partial-delivery contract needs source-prompt readiness review;
no automatic release/integration of partial stages is authorized. Existing
whole-source gates still run; an unexpected failure stops rather than being
waived as "future work". No control-bearing fallback may claim new semantics.

Finite exit/async discriminator set for I4 readiness (static predictions):

- Return1 then finally-return2 → check/return2 only; return object then finalizer
  mutation → post observes final state; return operand throws → original catch
  handles that error at its original evaluation point.
- Inner return then finally throws, outer catch completes normally → cancelled
  return is not revived (normal fallthrough/next value wins). Outer return with
  a cleanup-internal throw caught normally → original pending return survives.
- Finalizer break/continue overrides prior return and reaches the exact source
  target; for-update/iterator closing retain order. User catch never sees a
  synthetic control token. Nested genuine function return stays nested.
- Post reads a body-local value and detects TDZ on an early exit before its
  initializer; no initialized-let hoist. Explicit typed early return cannot skip
  type/post checks; existing mismatch/void/strip-assertions rules stay explicit.
- Async pre-await trace remains synchronous; untaken await branch introduces
  no suspension; explicit awaited value versus raw Promise-valued intermediate
  remain distinct. No new microtask/performance claim is measured here.

## 6. Review disposition, limits and next decision

Luna's private Target/Completion/Reference recommendation is retained; its
"native natural insertion point" is QUALIFIED by native imported surface-macro
kernel output. Its proposed bound-if runtime sketch is NOT adopted: use valid
bound fn/match forms or direct private metadata controls, respecting reserved-
binding checks. Switch is retained as routine existing breakable behavior, not
a new Operator poll. Finally/realm gaps were actual design objections, not
runtime discoveries or proof A6 is required. CDC owns this synthesis; no
independent self-review claim or production acceptance follows from it.

The result is an actionable incremental direction plus a concrete H1 HOLD,
not a fully source-ready all-S04 patch. Operator/root review should disposition
the proposed split and trusted invocation/source-first boundary before I3.
I4 still requires its exact scope-preserving target emission recipe before code.
No new experiment is requested: if a future feasibility experiment is needed,
engineer its method and obtain scope before running it. All six CV/CI04 stay
open; source0/5, S03's03/5, S02's03/5 and exhausted tooling8/K0/13 are unchanged.
No implementation dispatch/merge/push/S05/K/corpus/library/AST migration.

### Current phase handoff

Design activity stops at H1 under the selected real-gap rule. No mechanism
experiment or alternative-design inquiry is launched. I1 is ready in semantic/
architecture direction independently of H1, but still needs its exact executable
source/test packet and production authority; it is not an issued assignment.
I2 is dependency-ready as a planned useful increment; I3 is held; I4 has explicit
protected-exit/scope emission readiness work before any code prompt. Whole S04 is
**NOT implementation-ready** and no CV is accepted from this design record.
Operator/root receive the concrete host/effect choices above; an absent private
API, uncompiled sketch or source-only concern is not itself labeled a new
compiler/parser evidence failure. All earlier accepted code remains accepted.
