# B2b — owner-unit transport preparation (not issued)

Root working design against e80f613b and the issued B2a lexical contract.
Implementation must be prepared against independently accepted B2a, with its
actual private helper signatures and consumer census. This file is not an
assignment or acceptance. No B2b source changes are authorized by iteration09.
The operator's B2 authorization covers completing this design and later
implementation/review; root retains consequential decisions.

## Pending source-name identity decision (B2-ID-NAME)

Root requested an actual operator language-design disposition on2026-11-12,
while B2a continues independently. DD-49 Rule6 explicitly diagnoses distinct
source names mapping to one JS identifier in module/export binding scope;
it does not settle nested reference/alias semantics. Both `valid?` and
`is-valid` map to `isValid`. With one as an outer owner/alias and the other
as an inner parameter, source-exact lookup plus hygienic emission and canonical
normalized-name lookup produce different owner queries and runtime shadowing.

Root recommends distinct source binding identities with hygienic emission
where required; same-scope normalized collision diagnostics remain. The
alternative makes normalized spellings equivalent references and shadows,
requiring consistent canonical dispatch across both compilers. Neither may
be silently selected merely from the current emitted JS behavior. The question
also used some-name/someName as a simpler spelling example. Operator response
is pending; dependent B2b lookup/name-allocation implementation is held. This
is a substantive language semantics choice, not a request to approve routine
implementation or pause B2a. Source spelling/property-key normalization and
public JS export-name mapping remain distinct concerns whatever the answer.

Concrete proposed decision example (not a claim about current compiler output):

```lykn
(bind some-name 1)
(func read-name :args (:number someName) :body some-name)
(read-name 2)
```

Distinct source identities make this return1; emission must give the two
bindings different JavaScript names. Canonical aliases make it return2 because
the parameter shadows the outer binding through normalized spelling. Root
recommends1: resolving a Lykn identifier should depend on Lykn's binding
identity, with JavaScript name allocation preserving it. This retains the
existing same-scope normalized collision diagnostic; it does not silently
permit two colliding exported names or rename external property keys. The
operator response remains required before either observable rule is implemented.

## Settled identity/query rules

- ModuleIdentity is Named(LogicalModuleId) or fresh opaque AnonymousUnit.
  Named IDs are exact nonempty caller-supplied logical strings, with no URL,
  query/fragment, path or source-hash normalization. Anonymous equality is
  opaque unit identity, never the string '<anonymous>'. Anonymous units cannot
  advertise stable graph metadata. No filesystem/module I/O is introduced.
- DeclarationId is the unique normalized top-level owner binding name in this
  local v1 unit; retain raw source spelling separately for diagnostics. OwnerRef
  is module identity plus DeclarationId; CaseRef is OwnerRef plus normalized
  case identity. Different owners may have equal case names. ScopeId,
  ScopeSnapshotId, BindingId and semantic occurrence IDs are distinct private
  types belonging to a unit domain. IDs cannot be confused with spans/names or
  reused across anonymous calls.
- A lexical scope is not a mutable retrospective name dictionary. At a real
  annotation/pattern/member occurrence, capture either the then-visible
  BindingId or a pending top-level owner-name query. Final collection may fill
  in top-level owner declarations, but never a later ordinary alias. Ordinary
  bindings and parameters shadow owners; only immutable direct owner aliases
  preserve OwnerRef. Mutable/dynamic/conditional values are ordinary code.
  A direct alias initializer may refer to a forward owner declaration, but its
  runtime read/TDZ and declaration position remain unchanged. Alias relations
  point to the initializer's captured query, not a name looked up again later.
- Named annotation queries use the header's lexical scope before introducing
  its parameters; the function's own recursive binding remains visible. Return/
  yields annotations use that same header scope, not body-local declarations.
  Grouped typed binds are a separate case: each pair's annotation uses the
  snapshot after preceding pairs and before introducing its own binding. One
  outer bind-head snapshot is insufficient; retain an occurrence-plus-group-
  slot query or that binder's pre-introduction context.
  Type fields use declaration scope with forward owner lookup. Pattern owner
  queries use incoming clause scope before introducing pattern bindings;
  guards/bodies then see the actual pattern bindings. All source member paths
  retain their original qualifier reads and existing ordinary-call semantics.
- Final field TypeRef is Builtin or Adt(OwnerRef). Recursive field graphs are
  legal metadata, not recursively evaluated values. Prelude Option/Result
  analysis metadata never manufactures an OwnerRef/token/namespace. Unknown
  names in ADT-specific type/pattern contexts diagnose; ordinary object member
  use remains ordinary when its binding does not identify an owner.

## Native resolved-unit boundary

Read-only consumer refresh at f9be7cb8/tree0ea27d21 (2026-11-13), while Sol
owns validation: analysis/mod.rs19–23 exposes diagnostics/registry/has_errors
as independently accessible AnalysisResult fields; analyze387–415 receives a
borrowed SurfaceForm slice and builds a separate registry. emitter/mod.rs28
and213 independently accept forms plus registry for emit/emit_json. CLI
compile.rs175–213 and246–277 and dist.rs234–258 construct that pairing; DTS
module generation separately accepts forms/registry at emitter/dts.rs201.
compile.rs84–108 check_strict resolves/validates/classifies and returns without
analysis. These are actual migration consumers, not already unit-safe APIs.
The later recipe must give check the same semantic-unit preparation while
retaining its no-emission role. Native dev-path preliminary classification in
main.rs1004 is another caller to account for; it is not evidence that check
already performs analysis. No API or source changes result from this census.

The canonical path must prepare one closed semantic unit from post-expansion
source and use it in compile, check, DTS and dist, including inline exports.
It must resolve nested raw annotations/matches/defaults before emission, not
only top-level SurfaceForm records. The strong API direction is an owned
AnalyzedUnit plus typed error/diagnostic return, consumed by whole-unit emission;
do not keep a public forms-plus-unrelated-registry pairing as the canonical
qualified route merely for compatibility. Rust breaking API change is allowed
for0.6, but every actual caller and S06 impact must be enumerated before issue.

Recommended transport to finish source-checking: add private unit-domain,
occurrence and scope-snapshot handles to AtomData, preserving them on clones.
Annotate actual source head/member/atom occurrences under the B2a regions.
Raw nested source then keeps its scope when later classified. Header parsers
receive the enclosing source occurrence's semantic context explicitly;
parameters/returns use its captured header scope, rather than adding a private
field to every Keyword variant or guessing from its span. Typed source AST
annotations/patterns consume closed TypeRef/CaseRef facts, and nested emitter
reclassification must call the unit-aware classifier, never the unscoped legacy
classifier. If semantic positions require a site key, use the original
occurrence ID plus structural slot path, not pointer identity or source span.

The unit owns an immutable graph and the scope snapshots; private handles check
their unit domain. Source/JSON cannot construct them. Analysis-only scope
handles are not host authority or initialization-purity proof. Final emitted
kernel has no unresolved ADT requests or dependency on an active analysis unit;
fully lowered kernel compilation remains context-free. Avoid a complete cloned
subtree cached at every node, which could add quadratic storage.

Separate Sol's immutable-source transport check found no position inherently
requiring Keyword metadata, but confirmed these mandatory consumers:

- Grouped annotations are parsed at classifier/forms.rs:1328–1411 and need
  the per-pair snapshots above. Simple/default/rest and nested destructuring
  annotations all use their actual header context. ParamShape::typed_params()
  omits DestructuredField::Nested and ArrayParamElement::NestedWithAlias type
  annotations and therefore is not a complete annotation census.
  Also distinguish their external alias key from a runtime value binding:
  ParamShape::bound_names currently documents/includes alias names, while
  classifier capture and IC's precise projector correctly bind only nested
  leaves. Do not use that aggregate to reconstruct semantic bindings. Existing
  nested-alias guard producers refer to the alias spelling as a value when its
  annotation is not any; that needs a real value-projection/capture disposition
  before claiming named guards there, not just a resolved type lookup. This is
  a source-inspected integration concern, not a new executed runtime finding.
- Native instrument_yields currently receives only yields_ann.name at
  emitter/forms.rs:4044/4090. It must consume the resolved header TypeRef,
  not reconstruct a name query in a yield body's potentially shadowed scope.
- All late classifier doors at emitter/forms.rs:755,1089,2409,2424,2433,2627,
  plus recursive classify_export/classify_async, need the same closed unit and
  the correct inner occurrence. Detached emitter/DTS annotation helpers must
  receive resolved facts rather than attempt to recover a missing raw parent.
- Structural binding discovery and protected-host validation already call
  classify_form_with_bindings/classify_expr before an owner unit exists.
  Keep pure structural parsing separate from semantic preparation; do not
  introduce a classifier↔unit preparation cycle or allow those structural
  results to bypass resolved semantic emission.
- Canonical JS/DTS consumer pairs at compile.rs:186/206,257/275/291 and
  dist.rs:239/254/267 must share one prepared unit. check_strict must join
  analysis rather than stopping after classification. Foreign raw scope
  handles reject even if two named unit graphs have equal logical module IDs.

These are source-inspected constraints, not implementation or runtime receipts.
The next API recipe should use a private prepared/resolved-form layer around
structural source AST, rather than an optional unresolved name that every
emitter may silently reinterpret. Emission accepts an owned analyzed-unit
boundary; structurally constructed library/test AST must explicitly prepare or
receive a normal unresolved-context diagnostic. Exact report/error/signature
migration remains root's source-readiness responsibility before issue.

## Public producer/finalizer boundary

Retain the actual expansion order and fresh per-call type context. Extend the
environment with explicit semantic scope/frame state; distinguish entering a
scope from declaring following-sibling bindings. Actual expanded declaration
results feed the same unit, including macro-produced/export-wrapped top-level
owners. Nested/local type declarations receive the S01 v1 diagnostic. Top-level
position is explicit, not inferred solely from a shared lexical frame.

Type declarations, named predicates and qualified patterns need private typed
requests while forward metadata is incomplete. Capture query IDs, qualifier
syntax, already expanded operands/body/guard/completion use and field-slot
positions. A same-spelled source object or JSON record cannot manufacture a
request; a request from another unit is rejected. Per-request WeakMap metadata
is allowed as an identity facility; it is not an active global compilation.
Separate request ownership from existing compiler atoms, kernel marks, Reflect
anchors and future purity metadata.

Finalize after actual expansion/collection, before compiler-private name
allocation and A host-call/reference materialization. Seal queries first;
final lowering consumes resolved facts and must not create new unresolved
lookups, execute macros or re-expand expressions. Pending pattern field keys
may be private field-slot requests resolved to exact declared keys; keep field
reads in the existing short-circuit/clause-local temporary plan. Unfinished
fragments/serialization boundaries diagnose rather than silently dropping a
request. expandExpr finalizes its own complete one-form unit; it does not gain
whole expand's import/macro registration side effects.

Direct qualified calls/extractions can retain ordinary L1 member lowering and
record side requests for static validation, avoiding unnecessary new call
rewrites. Capture original exact case use and argument shape at actual expansion,
not by scanning arbitrary final property syntax. Known-owner unknown cases,
zero-field calls and direct fielded arity diagnose in both modes. Unknown-owner
ordinary object members remain ordinary. Shared syntax reused by a macro is
visited per occurrence, not memoized by object identity. Exact native/public
producer callback signatures and completion-region request categories still
need the accepted-B2a source-readiness pass.

## Preserved runtime and static distinctions

Activation must co-deliver a coherent semantic/runtime boundary, not identify
an owner statically while emitting only unrelated legacy flat constructors.
Private metadata primitives may land first under focused tests, but no full
qualified feature or B2 acceptance follows until actual consumers lower the
same resolved unit. Minimum namespace/guard/pattern integration and necessary
legacy migration therefore belong with owner activation; C still owns complete
API/DTS consumer proof, private purity and the original full-slice obligations.
No new public feature flag may disguise an unresolved emitter/model mismatch.

Namespace declaration position and actual qualifier-before-argument/field
reads are fixed by S01. Named type annotations are static queries, not ordinary
namespace expressions; their runtime checks use the resolved owner token and
closed case membership. Explicit qualified values/patterns still read their
actual source qualifier, including aliases in TDZ. Do not replace that read
with a token-only optimization.

No purity annotation is inferred from owner identity. Constructor/predicate/
pattern initialization lowering still needs the separately reviewed typed
purity producer/serialization/writer protocol. Static validation, field guard
policy, runtime nominal tokens and public declaration types are separate proof
obligations; a successful metadata query cannot close nominal runtime rows.

## Source-readiness work remaining before B2b issue

Type declaration arguments are static data under S01. Native
classify_type uses parse_simple_typed_params_with_capture: constructor fields
are keyword/name pairs, not general parameter defaults/rest/destructuring.
Public emitTypeMacro currently calls the broader parseTypedParams; nominal
activation must narrow that producer to the agreed static field grammar, not
accidentally import effectful function-parameter syntax into owned initialization.
Native macro expansion must also preserve actual Type case/field grammar as
structure instead of treating a constructor-shaped list as a macro call. This
must happen at the real expanded Type producer, including macro-returned Type,
without a separate eager macro phase. These inspected facts require explicit
actual data-slot/macro-effect controls in the B2b recipe.

The builtin metadata vocabulary is the existing union represented by DTS and
runtime consumers: any, number, string, boolean, function, object, array,
symbol, bigint, promise and void. Named-owner lookup is for non-builtin type
spellings; ordinary value bindings do not redefine fixed builtin keywords.
Runtime guard parity (native symbol/bigint and public promise) and valid void
positions still require concrete migration decisions before a broad guard
claim. Do not silently treat a known builtin as an unresolved ADT merely
because one old runtime switch lacks its branch.

Enumerate actual raw-header/nested-classification consumers and scoped unit
API callers at the accepted B2a pin; settle error/report/signature migration,
request kinds and reconstruction boundaries, field/case/ABI collision checks,
pattern nested-field policy and direct-call spread handling. Check constructor
field grammar against S01's static declarations. Supply actual source/runtime
and metadata oracles rather than leaving public behavior to the implementer.

Two inspected feature limitations stay explicit: public ordinary multi-clause
simple defaults are dropped while native retains a default-shaped binding;
and the current public reference compiler has no assertion-stripping option
(no stripAssertions/strip_assertions producer in inspected public core). The
future full checked/stripped consumer claim must supply a reviewed public
policy/route or precisely account for this boundary; do not invent a passing
public stripped gate. Native stripping and ordinary public checked behavior
remain actual existing routes. These are source-inspected inputs, not executed
new experiments or approval to reduce S03. B2a's generator rejection is separate.
