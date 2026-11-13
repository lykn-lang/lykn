# B2b — owner-unit transport preparation (not issued)

Root working design against e80f613b and the issued B2a lexical contract.
Implementation must be prepared against independently accepted B2a, with its
actual private helper signatures and consumer census. This file is not an
assignment or acceptance. No B2b source changes are authorized by iteration09.
The operator's B2 authorization covers completing this design and later
implementation/review; root retains consequential decisions.

2026-11-13 current foundation: B2-LX is independently accepted atf9be7cb8,
tree0ea27d21. This preparation remains unissued pending final source-ready
owner-unit APIs; lexical acceptance is not owner/case acceptance. B2-ID-NAME
was resolved below. The initial native ownership boundary is now assigned by
iteration14 and independently accepted through iteration15 at5554a4d6/
treef632c415; this full owner/hygiene preparation is not that implementation
assignment and remains unissued. Canonical native analyze now consumes owned
forms and returns Result<AnalyzedUnit,AnalysisFailure>; whole emit/emit_json and
module DTS borrow that same opaque success unit. Older f9 signatures below are
explicit historical consumer-census inputs, not the current API.

## Source-name identity decision (B2-ID-NAME)

**Binding operator decision,2026-11-13:** “yes, distinct Lykn spellings should
identify distinct bindings”. B2-ID-NAME is resolved. Exact source spelling is
the binding/lookup key; JavaScript normalization cannot merge identities or
create an alias. Hygienic allocation must preserve those identities through
emission. The example below must return1. Existing same-scope normalized-binding
and public export collision diagnostics remain under the previously stated
recommendation/DD-49 contract; property keys and foreign/public names retain
their separate normalization. Future work must distinguish binding identity
from those data/API names. No implicit permission to change those contracts.

The following records the question and alternatives before this decision.

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
operator response recorded above selects distinct identities and return1.

## Settled identity/query rules

### Runtime binding hygiene constraints (source-readiness, not issued)

At accepted f9, resolver exact spelling only tags dispatch; it does not connect
ordinary value uses to declaration identities. Both writers still normalize
raw strings. The first owned native-unit checkpoint does not implement this
missing runtime binding plan. Source annotations/owner queries and runtime
value binding are distinct phases with distinct visibility rules.

Current source guide06-functions-closures.md ID11–15 is consequential evidence:
bind emits block-scoped const with a real TDZ; func emits a hoisted function,
and its prose explicitly supports public APIs before later helper definitions.
Hygiene must preserve these runtime lifetimes while resolving exact spellings.
The existing sequential macro/form environment is not by itself a complete
runtime value-binding graph. Do not silently turn forward helper calls into
foreign globals, eliminate TDZ, or adopt let-style outer-initializer lookup
from a macro-dispatch-only scope comment. ID13's heading says "func Is Not
Hoisted" while its summary/rationale say it is hoisted: a source-verified S06
guide inconsistency, not authority to change emitted lifetimes.

Required engineering constraints for the later source-ready recipe:

- BindingId belongs to an actual lexical binding, not just a spelling or JS
  preferred name. Repeated var declarations in one owned kernel function may
  denote the same runtime binding; new nested declarations are distinct.
- Definition/value-reference identity must survive lowering and all late
  classifier reconstruction doors. Native Bind/Class retain name SExprs;
  named Func/Genfunc, TypedParam, Pattern and constructor names often reconstruct
  from Strings. Merely adding AtomData fields to the reader cannot solve those
  consumers. Unit-aware prepared form/header sites must supply the identity.
- Bound colon roots use the binding's allocated JS name, while member suffixes
  remain property names. Object literal/pattern shorthand must retain its
  property key even when its local variable is renamed. Import remote/local,
  export local/API and reexport names are separate roles; labels are a separate
  namespace. A broad string rewrite or a global raw-spelling-to-name map is
  insufficient: the same raw spelling can be bound in one occurrence and a
  free foreign-JS name in another.
- Allocate names under explicit unit ownership, reserve free foreign and owned
  compiler names, and retain public export spellings through explicit local/API
  aliasing when required. Compiler-generated ICU/host/completion names and
  source names must participate in collision avoidance without manufacturing
  private authority from JSON/source fields.
- Native macro JSON and kernel JSON do not preserve arbitrary private metadata;
  public WeakMaps are not serialization. Source macro exchange precedes semantic
  identity attachment. Kernel serialization must finalize identities/names with
  property roles preserved, or use a separately reviewed trusted transport;
  never silently drop pending resolution. Fully lowered kernel remains usable
  without an ambient active unit.
- Occurrence identity must work when macros reuse syntax objects. Existing
  public cloneOccurrenceSyntax intentionally preserves trusted kernel/private/
  host/Reflect nodes. New naming metadata cannot assume every encountered object
  has one lexical use, nor break those private anchors by generic copying.
- Existing public runtime pattern compiler rejects alias outside object
  patterns. Native/source validator handling of nested-array alias does not
  prove it is a common executable runtime shape. Preserve that scope limit;
  do not broaden grammar as a side effect of hygiene.

These are engineering requirements and source-inspected hazards, not a claim
that all storage/visitor/context APIs are ready or that a new runtime gate ran.
The immutable source census is in increment-b2b/cdc/README.md. Root retains the
final recipe/storage/phase decisions; accepted source-name policy is resolved.

### Runtime-name implementation direction to finish source-checking

Recommended next boundary: build an explicit private binding/occurrence/scope
plan over the completed Core Kernel, after source lowering. Raw source spelling
must be retained in VARIABLE slots until this point. This avoids relying on
metadata that structural header parsers currently erase; static source-owner
queries still require their separate earlier scope snapshots. This is a
refinement of the earlier source-Atom transport proposal, not permission to
replace owner-query identity with a late raw-name search.

The plan distinguishes actual binding identities, bound/free value uses,
property/API names and labels. Runtime lexical collection must match actual
writer scopes and hoisting/TDZ, preserving already-decided form-versus-call
roles rather than redispatching a lowered operator from a new hoisted env.
Native ScopeTracker already keeps exact source keys and a SEPARATE normalized
collision map; do not mistakenly replace its working reference lookup.
Protected-host scope sets still normalize local names and must be reconciled
with exact source lookup before/alongside naming activation.

Allocation may coallocate the emitted spelling of same-raw-name bindings in
different scopes while keeping their BindingIds distinct. Distinct raw-name
groups whose preferred JS spellings collide must receive different names;
free foreign-JS occurrences retain their own target names. Role-aware use
classification is essential even with such groups. Coallocation avoids
unnecessary output changes and preserves JS syntax that couples names, such
as the inner and outer class-declaration bindings. That coupling is grounded
in [ECMAScript2025 class evaluation](https://tc39.es/ecma262/2025/multipage/ecmascript-language-functions-and-classes.html#sec-runtime-semantics-classdefinitionevaluation).
Legacy raw-kernel var/catch interactions also caution against blindly giving
every declaration token a globally unique output name; actual pinned-runtime
support must be established before claiming those optional shapes. See the
[specified compatibility rule](https://tc39.es/ecma262/2025/multipage/additional-ecmascript-features-for-web-browsers.html#sec-variablestatements-in-catch-blocks).

Final rewriting must preserve object/pattern shorthand keys through explicit
key/local forms, import remote names, export API names/live bindings, class
member keys and colon suffixes. Allocated call names must remain unambiguous
through kernel JSON, which currently omits dispatch tags. Compiler-generated
ICU/host/completion names must reserve source/foreign/allocated names. Do not
rewrite raw JavaScript strings as if they were Lykn variable occurrences.

Before issue, root still owes a complete writer-scope/position table and exact
callback/record/error/consumer signatures, all early-normalization producer
checks and private-anchor handling. Canonical expansion materializes private
host calls, but raw private invocation entrypoints retain address/WeakMap
anchors and a unit-array identity: generic AST copying can break them. They
need explicit same-unit rewrite/reanchoring or a shared pre-materialization
integration, with existing fragment/orphan/recovery proofs retained. The
implementation cannot be issued as merely "walk and rename".

Two actual cf432622 baselines in the CDC census now establish the future
change/preservation pair: the operator's naming program prints2, and entry
calling a later helper prints41. Neither is a B2-UNIT failure or proof of
implemented hygiene. The later gate must produce1 and retain41, alongside
same-spelling shadowing, TDZ, property/import/export, foreign-name, macro-shared
occurrence, private/host/JSON and current documentation/build consumers.

### Settled static owner/query rules

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
