# Local owner resolution — preparation, not an issued assignment

2026-11-11. Root's preparation for increment B while Luna implements A.
This record adds no source authority, closes no LC row, and does not replace
the accepted S01 contract. The B prompt will be issued against independently
accepted A, after inspecting that candidate. All implementation below remains
unexecuted.

## Verified boundaries

Read-only inspection used immutable source 0829e892, not Luna's changing tree.
Sol independently mapped the same boundaries without builds or writes.

- Native `compile_source_inner` and `compile_source_with_dts` in
  `crates/lykn-cli/src/compile.rs` currently perform expansion, lexical
  resolution, classification, analysis and emission as separate calls.
  `dist.rs` has another analysis/DTS consumer. Those actual callers must
  consume the same resolved unit; fixing only the ordinary compile path loses
  declaration/package semantics.
- `analysis::Analyze::collect` recognizes bare top-level `SurfaceForm::Type`,
  not the inner type of `Export`. The existing emission and DTS consumers do
  descend through Export. Collection must cover the same top-level owners.
- Nested function/match bodies remain raw SExpr. `emit_expr_inner` later
  re-enters `classifier::classify_expr`, without re-entering semantic analysis.
  Root-only match checking cannot establish nested owner correctness.
- `NameRes` identifies definitions/references but not which binding they mean.
  Type annotations and registry ownership are strings. The current global
  constructor-to-type map cannot distinguish separate owners with equal case
  spellings or preserve owner aliases.
- Native `ScopePlan`, `binding_occurrences`, grouped-binding slots and match
  clause scopes already define lexical boundaries. Public `bindingScopePlan`
  and expansion walkers have corresponding rules. Owner resolution must use
  these boundaries, including ordinary-binding shadow entries; a capitalization
  heuristic or a recursive string search is insufficient.
- Public `surface-helpers.js::typeRegistry` is a process/module-global Map,
  mutated by `classifier.js::emitTypeMacro`. Its clear/populate operation in
  `surface.js::resetTypeRegistry` is reached from explicit `resetMacros`, not
  from ordinary compile boundaries. Success, failure, repeated calls and
  re-entrant compilation therefore all need explicit per-unit ownership.
- Public macro expansion, classification and lowering are interleaved in
  `expander-core.js::expandExprInner`. Forward collection must include actual
  macro-produced top-level declarations without executing a macro twice or
  treating quoted syntax as declarations. The existing fixed-point macro-head
  invocation loop and binding-aware dispatch must remain authoritative.
- `emitter/dts.rs::lykn_type_to_ts` currently ignores the registry argument.
  Precise declaration output cannot be inferred from corrected runtime output.

## Design constraints selected for the source-ready recipe

These choices implement S01 rather than changing its source language:

1. Resolve names to typed `OwnerRef`/`CaseRef` and builtin-or-ADT type references
   before their semantic consumers. Preserve this information through clones
   and nested classification, by value in native syntax/AST metadata and by
   per-unit private identity metadata in the public compiler. Do not use source
   spans, object addresses after rebuilding, normalized spellings, or a global
   active-registry variable as semantic identity.
2. Use a fresh unit context, with optional explicit logical module ID and a
   fresh anonymous identity otherwise. Owner declaration IDs are stable within
   that logical module. No absolute machine path, basename or source-byte hash
   substitutes for module identity. Full external interface validation remains
   S04; no inferred imported owner is enabled here.
3. Collect all genuine top-level owner declarations, including inline exports,
   before resolving type references. Collection is static. Runtime namespace
   and token initialization remain at the original declaration position.
   Reject nested/local declarations explicitly. A local ordinary binding is a
   shadow entry, not absence from the owner map. Immutable direct aliases carry
   the same OwnerRef; conditional, mutable and computed values do not.
4. Resolve annotations in their declaration context before parameter binders
   enter the body scope. For example, a parameter named Label must not capture
   the outer owner used by its `:Label` annotation. Pattern qualifiers, in
   contrast, resolve in the actual pattern's lexical environment. Preserve the
   actual qualifier syntax for its required runtime read; loading a private
   token alone does not prove alias TDZ/evaluation order.
5. Root match universes and function dispatch/overlap checks use owner identity,
   not short names. Nested patterns have their own declared-field expectations.
   Remove the unregistered positional Object.values constructor fallback as
   part of the intentional qualified-ADT migration. Preserve literal/object
   patterns and ordinary member calls. Do not silently reinterpret a legacy
   constructor pattern as an irrefutable binding.
6. All owner construction uses A's owned intrinsic facility. Use null-prototype
   descriptor records with every descriptor attribute explicit. Define data
   keys such as __proto__ through computed keys. Fresh owner token, immutable
   tag/brand, mutable payload, frozen zero singleton and shallow-frozen owner
   namespace have distinct tests. No deep validation or anti-forgery claim.
7. Named ADT checks remain shallow: check the owner's closed membership and
   the selected case's declared field guards. An ADT-typed field uses nested
   owner membership, without unbounded recursive validation on recursive or
   cyclic data. Pattern dispatch does not add payload type assertions that
   disappear/change when assertion stripping is selected.
8. The first runtime layout is the agreed same-module facade baseline. It is
   not the optimizer winner. No purity provenance or removal claim is enabled
   by B. C must include both owner initialization and feature-local intrinsic
   support in its verified initialization graph.

## Readiness work still required

Before issue, root must settle and source-check the exact native analyzed-unit
API and metadata propagation recipe, and the public collection/macro/lowering
boundary. In particular, nested raw annotations must not lose their resolved
owner when classified later, and public forward collection must not introduce
an ambient context or duplicate macro execution. Inspect accepted A's actual
lowering/finalization interfaces, enumerate all changed API/caller signatures,
then obtain Sol's separate preparation review. The eventual prompt must state
the required builtin-guard parity limits, migration census and focused runtime
oracles explicitly. This preparation record is not a claim of readiness.

## Public macro-phase proposal — withdrawn before issue

The following proposal was selected provisionally during preparation, then
withdrawn before an implementation prompt was issued. See the source-grounded
counterexamples and current incremental direction below. It is retained as
design history, not an active prerequisite or authority to change macro behavior.

Sol's second immutable-source lookup confirmed that no existing mode returns
macro-expanded, unlowered surface syntax. `strict:false` only changes policy;
`macroexpand` prints full lowering, and `macroexpand-1` prints one head step.
The current head loop immediately re-enters lowering. An extra head scan that
then reruns ordinary expansion is therefore not an acceptable collection pass.

Root selects a bounded source-preserving macro-expansion prerequisite within
B, before owner metadata and nominal activation. Separate macro expansion from
surface lowering in the public compiler so both compilers can hand a complete
expanded unit to semantic resolution. Keep the existing public expand/compile
result contracts. This is private phase separation, not a new source form or
public macroexpand API. It also avoids an active global type context.

The source-ready recipe must extract the existing macro invocation/error/limit
behavior and reuse binding-aware dispatch, quotation/quasiquotation handling,
and source-role walkers. A generic recursion through every list is incorrect:
patterns, parameter declarations, import/export names and type declarations
contain syntax/data positions rather than ordinary calls. Match clauses need
separate environments, grouped bind initializers need sequential visibility,
and conditional arms must not leak bindings. Macro-produced declarations must
update the actual following-sibling environment. Known surface forms retain
priority over same-spelled macros, and lexical references retain priority over
both. Preserve sanctioned-kernel authority when rebuilding nodes and retain
existing private atom/request identities rather than copying their spelling.

The macro stage executes each encountered user macro once per expansion step,
including nested and array-returning expansions, and retains its expanded
result. Lowering then consumes that result without reinvoking user macros.
Existing registration and explicit resetMacros behavior remain a distinct
contract; this work must not silently add global macro-state rollback/isolation.
Preserve debug macroexpand's actual printing/erasure behavior and failure
channels. Test source-order invocation, quote opacity, active unquotes,
macro-generated top-level types and nested-type syntax retention, same-spelled
bindings, per-clause/grouped/conditional scopes, kernel authority, expanded
array results, and re-entrant calls. Real A host-support finalization and S02
completion/Reflect/private-pattern controls must remain green.

This prerequisite is not yet issued. Root will inspect accepted A, settle its
exact producer/consumer signatures and preservation rules, and request the
separate source-readiness review before writing the numbered implementation
assignment. It closes no LC row on its own. Native owner-resolution metadata,
nominal runtime activation, precise declarations, migration and private purity
remain the rest of B/C rather than being dropped by this additional boundary.

### Preparation-review consequences

Separate Sol lookup/review of immutable 0829e892 identified the following
concrete obligations. Root agrees they must be resolved in the recipe, rather
than leaving CC to discover/select language behavior:

- Macro arguments are raw and lazy. Invoke a macro head before walking its
  arguments. A discard macro can suppress a nested invocation; a duplicating
  macro can cause two expansions of the same returned syntax occurrence.
  Identity-based memoization of macro execution would be wrong.
- The existing inner macro fixed-point loop omits renewed lexical/surface
  priority checks. Root selects the already documented lexical dispatch rule
  at every step, including a macro result whose head names a lexical binding
  or known surface form. This deliberately repairs that inconsistency; it is
  not byte-preservation of the defective inner-loop behavior. Include exact
  chain controls and retain their baseline evidence when implemented.
- Lexical scope plans do not supply all source-role information. Protect type
  cases, patterns, parameter declarations, object/member names and import/export
  grammar from call expansion, while visiting executable default initializers.
  Match clauses require individual environments.
- Function macro expansion currently follows emitted semantic order: defaults,
  precondition, body, postcondition, not arbitrary textual keyword order. Valid
  program expansion must retain this ordering. Earlier malformed-form checks
  currently live partly in emission; any changed first-error/macro-effect
  ordering needs an explicit disposition and test, not a preservation claim.
- Array/null expansion results have slot-specific meanings. Preserve a macro's
  multiple-form result until the existing statement/value/return/assignment
  consumer decides whether to splice, reject, or build a result region.
  Flattening every nested result or rewriting every result as source `do` is
  not justified. The exact private prepared-region representation and its
  lowering/fragment-rejection boundary remain to be source-checked before issue.
- Rebuilt syntax occurrences need explicit authority/identity treatment.
  Kernel marks, private atoms, A's host refs and Reflect request anchors are
  different metadata facilities. Do not grant compiler authority from an
  ordinary property/spelling, silently drop an owned request, or deduplicate
  two semantic occurrences because a macro shared an input object.
- Full debug macroexpand currently lowers, prints and erases its target;
  macroexpand-1 invokes only one head. Keep these distinct and avoid replay.
  Ordinary expandExpr must not acquire complete expand's import/registration
  side effects. Type-unit isolation remains separate from existing explicit
  global macro-state/reset behavior.

These are source-grounded preparation constraints, not software findings with
executed repros or approval of a concrete implementation. A is still separate
and has priority for independent review when handed off.

## Why that proposal is withdrawn

Further root inspection of candidate 5a8aedc5 exposed valid-program behavior
that a source-role walk alone would not preserve. In classifier.js,
`emitSurfaceForm`'s Thread branch inserts the threaded operand into a step before
the step's possible macro invocation. Its Eq branch for three or more operands
duplicates middle operands into adjacent comparisons, which the existing
expansion walk then encounters separately. Expanding those nested macros first
would change their arguments or invocation count. Function pre/body/post
reordering, multi-form macro results and malformed-program failure timing add
further contracts. These are inspected control-flow facts, not executed runtime
repros, and no claim is made that every historical behavior is desirable.

A wholesale macro-before-surface phase would therefore be a separate language
design change, with its own compatibility decisions. S03 does not need to
choose those decisions to deliver qualified ADTs. Root withdraws that proposed
prerequisite and retains the existing macro/lowering ordering for this slice.
No implementation was started and no issued prompt needs replacement.

## Current incremental direction — semantic plans before final ADT lowering

Keep the actual public expansion walk and its completion/use modes. Introduce
an explicitly passed fresh unit context for ADT collection/resolution. Surface
ADT producers build compiler-private semantic requests/plans; final ADT
resolution/lowering runs once the actual expanded unit's declarations are
known. This is typed intermediate compiler data, not a source-spelling
postprocessor or a new public kernel form. Native expansion already retains
surface syntax and can resolve the same semantic identities before emission.

The source-ready recipe still needs exact signatures and callers, but its
binding constraints are:

- A unit records typed owner declarations, lexical scope/binding identities,
  immutable direct alias relations and ordinary-binding shadow entries.
  References capture the actual lexical binding query at their occurrence.
  Resolution may consult the unit's complete top-level owner definitions for
  forward type references; it cannot discover an ordinary alias that was not
  lexically visible there. Queries resolve to OwnerRef/CaseRef, not strings as
  identity. Each actual declaration keeps its original runtime position.
- A pending named-type predicate carries a type query, value and diagnostic
  context. A pending pattern plan carries the actual qualifier, owner/case
  query, subject, child-field positions and clause-local temporaries. Final
  resolution validates arity, owner universes and nested field types, then
  supplies exact field keys and nominal gates. Bodies/guards have already been
  expanded under the existing clause scope and completion use; finalizing the
  plan must not replay user macros or user expressions.
- Owner declarations contain only static case/field metadata, so their owned
  namespace/token/constructor initialization can be built after type resolution
  while being inserted at the original declaration position. No source payload
  expression or application call becomes initialization work.
- Direct qualified call/extraction checks retain source qualifier/case syntax,
  binding query and argument count, even if completion lowering restructures
  their surroundings. L1 runtime member access keeps its existing qualifier-
  before-arguments behavior. Ordinary object members remain ordinary when the
  binding query does not identify an ADT owner.
- Private plans have explicit whole-unit consumption and unfinished-fragment
  errors. Readers, JSON spelling, source properties and macros cannot create
  their authority. All such plans are consumed before public expand returns
  ordinary self-contained kernel forms and before A's final host-reference
  support is materialized. Preserve Reflect request anchor identity and private
  completion destinations when rebuilding; do not borrow a global active unit.
- The context is a per-call object passed to actual producers/recursive entry
  points, so nested/re-entrant calls do not share type state. Existing macro
  environment/reset behavior remains separate. No new generic prepared-macro
  region or broad macro contract is needed by this direction.

This is preparation, not a source-ready or independently accepted design.
Root must inspect the corrected accepted A candidate, finish the concrete
native/public plan/metadata types and lifecycle, and obtain the separate
readiness review before issue. The earlier macro-phase proposal must not be
implemented from this historical memo.

## IC-01 — reserved-binding carryover for namespace validation

Open input to B2's runtime-binding/identifier validation, distinct from the
accepted A host prerequisite and B1's per-call state repair. During independent
A verification, normal surface compilation of the cold-driver Lykn source at
5caf3d87 exited zero but emitted `const package = ...`; Deno then rejected the
strict-mode reserved identifier. The source binding was line 6:

```lykn
(bind package (+ cache "/lykn/embedded/0.6.0-compiler-split/packages/lang"))
```

Existing actual command was `bin/lykn compile <cold-cli.lykn> -o <cold-cli.js>`,
with no --no-strict or kernel escape. The accepted compiler binary was SHA-256
5a226c7af5a79e91dc76464f02c7b40a24057bdbc4436b1bb0a5b7b988dcc476.
The [independent archive](increment-a/correction03/cdc/receipts-5caf3d87.tar.gz)
retains cold-cli-first.lykn/js, receipts/cold-driver-compile and
receipts/cold-cli. The probe-only rename allowed the verification driver to
continue; it does not fix or dismiss the compiler's validation gap.

Literal `(bind package 1)` and the public compiler route have not been
separately executed. Root cause may involve the reserved set or traversal;
neither is established by this observation. B2 must reproduce/resolve the
relevant binding-path gap before its namespace/identifier claims close, or
record an explicit owning follow-up. Keep valid property/data keys distinct
from lexical bindings; this observation does not justify banning a payload or
namespace member named package. No new source repair was made during review.
