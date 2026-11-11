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

## Public macro-phase prerequisite selected after topology inspection

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
