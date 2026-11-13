# B2 — typed owners, cases and occurrence-scoped resolution

Root design, 2026-11-12, based on accepted e80f613b/tree7376b33d in the
dedicated codex/qualified-adt-core worktree. The operator authorizes settling
and implementing B2 with Luna6High CC, independent Sol6.1High CDC, Autonomous
Mode. IC-01 and A/B1 remain accepted. This is an incremental implementation
design under S01, not a change to the seven-slice arc or permission to merge,
push, publish or run the later emission experiment.

## Binding architecture decisions

1. **Identity is typed and unit-owned.** Distinguish LogicalModuleId,
   DeclarationId, OwnerRef, CaseRef, ScopeId and BindingId. OwnerRef is logical
   module identity plus declaration identity; CaseRef contains OwnerRef and
   case identity, never a bare case spelling. An explicit moduleId is logical,
   not a filesystem path. Anonymous calls have fresh opaque unit identity and
   cannot advertise stable cross-module metadata. Strings/spans/capitalization
   are names/diagnostic locations, not binding or owner identity. Runtime fresh
   Symbol tokens remain a separate nominal-activation obligation.
2. **Lookup records the occurrence's lexical environment.** A type/member/
   pattern request captures a scope/binding query when that source occurrence
   is actually expanded/resolved. A visible immutable direct owner alias keeps
   the same OwnerRef; ordinary bindings/parameters shadow owners, and dynamic
   values do not become static aliases. Grouped binds introduce each alias
   after its initializer. A future ordinary alias cannot be discovered by a
   retrospective whole-unit name search. Top-level owner declarations may be
   resolved forward after collection, while their runtime const initialization
   stays in place. Named annotation lookup precedes introduction of that
   function's parameter names. No ambient active compilation context.
3. **Actual expansion supplies declarations.** Keep the current macro and
   surface-lowering phase arrangement. Do not execute a macro twice to collect
   types; do not eagerly visit raw macro arguments, move Thread/Eq transforms,
   memoize shared syntax objects or reinterpret source/JSON properties as
   compiler authority. Following-sibling visibility comes from actual expanded
   declaration results, not the spelling of a macro invocation. Public arrays
   retain their existing slot meanings; only existing sibling-sequence result
   splicing is sequential. Native gains no new macro-array return protocol.
4. **A resolved unit is the semantic boundary.** Its owner/case definitions,
   lexical queries and field TypeRef values are immutable after finalization.
   Field TypeRef is Builtin or Adt(OwnerRef). Builtin/prelude analysis metadata
   is not a runtime owner. Native nested raw syntax must retain a private scope
   handle into that unit when classified later; no span-keyed registry or
   top-level-only annotation patch. Whole compile/check/DTS/dist must consume
   the same resolved-unit contract. Exact storage/consumer APIs are issued
   with B2b against accepted B2a; they are not delegated to B2a's implementer.
5. **Public ADT operations may be deferred; macros are not replayed.** Producers
   create private typed declaration, predicate, pattern and qualified-access
   requests under an explicitly threaded fresh unit. After actual declarations
   are known, finalize requests to resolved OwnerRef/CaseRef plans, then lower
   before host-reference materialization and ordinary kernel return. Requests
   retain actual qualifier reads, already expanded operands/completion use and
   clause-local field temporaries. Fragment/serialization boundaries reject
   unfinished requests; source spelling/macro properties cannot manufacture
   their identity. Preserve existing completion/private-atom/Reflect anchors.
6. **Static and runtime positions remain separate.** Final collection is not
   value hoisting. Qualified facade reads precede arguments; zero values and
   detached cases still read the actual source qualifier. Forward owner and
   immutable-alias TDZ behavior survives finalization. Same-module facade is
   the semantic baseline, with no purity/optimizer winner selected here.

These are settled architectural constraints, not a claim that the complete
owner-unit transport or nominal runtime has been implemented. S01 remains
authority for all arity, nominal representation, guard, match-universe,
descriptor, namespace collision and API behavior.

## Delivery checkpoints and preserved scope

- **B2a, precise lexical regions:** remove source Func clause union and class
  member aggregation from actual expansion/resolution; align native selected
  function regions with emitted semantic order; use actual expanded declaration
  results for following visibility and recheck dispatch priority at macro steps.
  This is a usable compiler correctness repair and prerequisite to identity.
- **B2b, resolved owner/case unit:** issue its source-ready typed API, metadata
  transport and private request lifecycle against accepted B2a; implement and
  independently validate actual owner/case/alias/forward/shadow queries through
  nested native and public producers. It does not disappear behind B2a closure.
- **Remaining B/C:** activate the accepted nominal namespace/constructors,
  recursive patterns/guards, migrate consumers, finish exact declarations and
  reviewed private initialization-purity transport. All LC-02–08 remain until
  their complete verifiers pass. Imported graphs/emission S04, build/JSON S05,
  full API/docs/book/human S06/S07 retain their existing gates.

The checkpoints are not new slices or a reduction of S03. B2a acceptance alone
cannot close LC-02 or be reported as complete typed-owner implementation.
Root owns subsequent concrete API/storage recipes and consequential decisions.
The withdrawn macro-first proposal stays withdrawn.

## Source findings driving B2a

At e80f613b, native resolver.rs::scope_plan_with_occurrences builds a whole-
subtree Body from all clause/member parameter occurrences. expander/pass2.rs
consumes it textually, whereas emitter/forms.rs emits selected Func regions
defaults/pre, body, post. Public expander-core.js::FUNCTION_FAMILY preextends
one childEnv from bodyScopeNames before rewalking all lowered clauses; class
scope also aggregates parameters. Both backends' sequence updates currently
consult original forms rather than actual expanded declarations. Native nested
classification at emitter/forms.rs::classify_and_emit_expr bypasses top-level
analysis, and inline exported Type collection is incomplete. The latter two
facts are explicit B2b transport inputs, not fixed by lexical repair.

Root and separate Sol inspected these source paths read-only. No new runtime
research experiment is claimed by this design. B2a's concrete method and oracles
are in b2a-lexical-regions-recipe.md; B2b receives a separate source-readiness
check and next numbered prompt before dependent source implementation.
