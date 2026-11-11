# Qualified ADT contract — design proposal

**State:** partial iteration01 CC return; all QD rows remain open. It
formalizes the coordinator's supplied v1 contract decisions after findings
RV-01–06. During drafting, root identified a real conflict in iteration01's
L2 route: a separately evaluated/cached identity sidecar can make two
evaluations of the producer share one token, contradicting generative runtime
identity. Therefore the protocol in this working set is not coherent or
executable yet; root will issue iteration02 to replace L2 with a same-module
facade/direct-case lowering alternative. This partial contract is not accepted
until independent review. No layout was selected and no experiment ran.

## Approved surface and binding rule

The intended declaration and uses are:

```lykn
(type Label MissingField (Text :string value))
(bind absent Label:MissingField)
(bind greeting (Label:Text "hello"))
(match x
  (Label:MissingField (print "absent"))
  ((Label:Text text) (print text)))
```

`Label:MissingField` is a zero-field singleton value, not a zero-argument
call. A declaration's `(Zero)` spelling is normalized to the same zero-field
case as `Zero`. Neither spelling creates a callable constructor. Fielded
constructors are ordinary functions; their declared source arity is checked
at compile time, not by a new dynamic arity wrapper. Extra runtime JavaScript
arguments retain normal function semantics; missing arguments reach the
declared runtime payload guard (and may be `undefined` when assertions are
stripped or the field is `:any`).

Type and value namespaces are separate. `(type Box (Box :number value))`
defines a `Box` owner with case `Box`; its value form is `(Box:Box 1)` and it
does not create a flat `Box` constructor binding. Existing ordinary functions
whose names coincide with a type or case keep their ordinary lexical binding.
Unknown owner, unknown case, malformed ADT pattern and source arity are
compile diagnostics in both checked and stripped modes. Static checking here
means resolving the declared owner/case and source arity; it does not add
general type inference. Declared payload type checks are runtime guards.

The grammar keeps ordinary `Foo:method`, `object:field`, imported-object and
host-object member calls unchanged. No capitalization heuristic classifies
them as ADTs. A known ADT type binding makes `Label:Unknown` an unknown-case
diagnostic in constructor position. In expression position, an ordinary value
binding named `Label` makes `Label:Text` ordinary property access/call. A
pattern constructor must resolve to a statically declared/imported type
owner; if `Label` resolves to a value instead, the pattern reports that it is
not an ADT owner. Unknown owner diagnostics are limited to ADT pattern/type
contexts or known ADT owners, never arbitrary colon syntax.

Resolution uses semantic compile-time `OwnerRef` and `CaseRef` types, not
qualifier or case strings alone. The current AST stores constructor/pattern
names as strings; this is insufficient for two owners with the same case
name. V1 supports top-level type declarations only. A non-top-level `type`
declaration gets an explicit diagnostic in both compilers; it must not be
partially registered globally or imply a local generative-type feature.
The existing module-top-level compatibility wrapper `(export (type ...))`
is still top-level and participates in owner collection, runtime exports and
DTS metadata just like a direct declaration. Only genuinely block/function
nested type declarations are unsupported in v1.
Function/block-local value aliases of top-level or imported owners remain
valid and retain their `OwnerRef`. Pattern field bindings are clause-local.
Nested patterns recursively check the nested owner/case after extracting
each accessed field once into its binding; guards see those bindings. A false
guard tries later clauses. A foreign getter/proxy exception during a field
read propagates normally. The subject expression is evaluated once; a matcher
must not memoize arbitrary getter results across clauses. If no clause matches,
retain the current `match: no matching pattern` behavior/fallback.

Worked alias and boundary examples:

```lykn
(import "./label.js" ((alias Label label)))
(bind another label)
(bind text-constructor another:Text)
(bind text (text-constructor "hello"))
(match value
  ((another:Text text) :when (valid? text) text)
  (another:MissingField "empty")
  (_ "other"))

;; Dynamic property lookup is an ordinary runtime value, not an OwnerRef.
(bind selected (get another key))
(selected "hello")

;; Known owner, unknown case: compile error, including stripped mode.
(bind invalid label:Missing)

;; A value parameter shadows the owner inside this function.
(func call-member
  :args (:any Label :any value)
  :returns :any
  :body (Label:Text value))
```

The alias example is design input, not a compiler run. A direct immutable
owner alias preserves the owner reference; a conditional/dynamic namespace
value does not. A detached case constructor is an ordinary function that
closes over its owner token, works without a receiver, and retains declared
payload guards. It is not inferred as an ADT pattern owner by aliasing the
function. Runtime property/getter exceptions propagate. A non-null check
rejects null and primitive match subjects before brand/tag reads, allowing a
later wildcard/fallback or the existing no-match error. There is no new
exhaustiveness, general inference or recursive payload validation guarantee.
Native nested pattern lowering is an existing gap to close before this
contract is implemented.

In `call-member`, the parameter binding makes `Label:Text` an ordinary runtime
member call. In a pattern position inside that scope, `(Label:Text text)` is a
compile error because the resolved binding is not an owner. Conversely the
direct `(bind another label)` alias above retains the imported `OwnerRef`, so
`(another:Text text)` is valid. A dynamic `(get another key)` remains an
ordinary runtime value and cannot become a pattern owner. A pattern using
`(another:Missing text)` is a compile error for that statically known owner
and unknown case, also when assertions are stripped.

## Owner identity and imported metadata

Compile-time owner identity and runtime identity are deliberately different.
`OwnerRef` is a semantic reference to a top-level type declaration in the
canonical compile-time module graph, represented as `(moduleId,
declarationId)`. Named reexports and import aliases preserve this reference;
a local type with the same source name does not. Runtime user ADTs are
generative: every evaluated owner declaration/module instance creates one
fresh `Symbol()` token. Two modules that each declare `Label.Text`, identical
source copies evaluated as separate modules, and two independent local
declarations remain different runtime types. Reexports import and expose the
same defining token. There is no process-global owner registry, source-hash
identity or absolute-path runtime identity.

### Version-1 type-interface input

Runtime ESM imports never populate compile-time metadata. Each public
synchronous compiler call receives explicit, already resolved `moduleId` and
`typeInterfaces` options. The data contract is JSON-shaped and validated into
fresh immutable per-compilation semantic records:

```json
{
  "schema": "lykn.type-interfaces",
  "version": 1,
  "runtimeAbi": "lykn.adt.v1",
  "currentModuleId": "pkg:@example/shapes@1.0.0/consumer",
  "modules": [
    {
      "moduleId": "pkg:@example/shapes@1.0.0/label",
      "imports": [],
      "exports": {
        "Label": {
          "ownerRef": {
            "moduleId": "pkg:@example/shapes@1.0.0/label",
            "declarationId": "top-level:Label"
          },
          "cases": [
            { "sourceName": "MissingField", "jsName": "MissingField", "fields": [],
              "runtime": { "caseLink": { "kind": "namespace-member", "member": "MissingField" } } },
            { "sourceName": "Text", "jsName": "Text", "fields": [
              { "sourceName": "value", "jsName": "value", "typeKeyword": "string" }
            ], "runtime": { "caseLink": { "kind": "namespace-member", "member": "Text" } } }
          ],
          "runtime": {
            "layout": "l1",
            "namespaceExport": "Label",
            "ownerTokenExport": "__lykn_adt_v1_owner_Label",
            "ownerTokenSpecifier": "@example/shapes/label",
            "caseModuleSpecifier": null
          }
        }
      }
    },
    {
      "moduleId": "pkg:@example/shapes@1.0.0/consumer",
      "imports": [
        { "specifier": "./label.lykn", "targetModuleId": "pkg:@example/shapes@1.0.0/label" }
      ],
      "exports": {}
    }
  ]
}
```

`moduleId` is a canonical logical module specifier from package identity and
package-relative path, including a resolved package version where applicable;
workspace modules use package name plus package-relative path. It never embeds
an absolute build/check-out path. `declarationId` is the unique top-level type
binding key within that module (v1 uses `top-level:<source-name>`; duplicate
top-level bindings are diagnosed). `imports` map the exact source module
specifier as resolved by the configured import map/workspace graph to one
`targetModuleId`; no fuzzy basename or process registry lookup is allowed.
The exported name is the module-facing alias. A reexport copies the original
`ownerRef`, cases and runtime linkage under its new export name. Field entries
preserve declaration order, exact source name, normalized JS property name and
declared `typeKeyword` as stored by the source compiler. Each case's
`runtime.caseLink` is `namespace-member` for L1 (with its exact `member`) or
`named-module-export` for L2 (with the exact `moduleSpecifier` and
`exportName`). `runtime` names the actual ESM export spellings at this
module boundary. `layout` is `l1` or `l2` for the package build candidate. For
L1, `caseModuleSpecifier` is null and imported source-case references use the
namespace member; for L2 it is the actual published compiler-owned case-module
specifier, with each case's normalized `jsName` as its named runtime export.
`ownerTokenSpecifier` is the actual public module specifier used for the
generated owner-token export. A reexport preserves the same `ownerRef` and
reexports that exact token; package metadata and export maps must resolve both
the public namespace and L2 sidecar paths exactly. There is no guessed
specifier concatenation or basename fallback.

Validation rejects unsupported schema/version/ABI, duplicate module IDs or
specifier mappings, unresolved targets/exports/OwnerRefs, duplicate or
normalized-colliding names, invalid case/field shapes, unknown type keywords,
missing runtime exports, owner-ref mismatches across reexports, and malformed
metadata. These errors are typed, fallible API errors and do not mutate global
state; source-use diagnostics retain the source span. Ordinary runtime imports
and colon calls remain usable without an ADT interface. Only ADT-specific
owner/case use requires a matching interface.

The CLI `compile`, `build` and `dist` paths construct this set with a
non-executing module-interface graph pass over source and generated package
metadata. `dist` emits `lykn.types.v1.json` alongside the package's ordinary
files; package metadata records canonical module IDs, specifier mappings,
reexports, cases/fields and runtime-linkage names. No module is evaluated and
no network fetch discovers types. Graph traversal handles cycles finitely;
forward references may resolve statically but are not runtime hoists. Owner
token and namespace initialization occur at the type declaration's normal
evaluation position, so ordinary `const`/ESM TDZ and cyclic-import access
before initialization still apply. Existing macro expansion remains its
separate compile-time activity and does not evaluate runtime modules. The
public source API stays
synchronous/string-returning: `lykn(source, {strict, moduleId,
typeInterfaces})`; browser `compileLykn` mirrors it. Existing lower-level public
expand/classify/compile stages receive the same explicit options/context and
preserve their existing result/error shapes. Native `compile_source`,
`compile_file`, resolver, analyzer and emitter receive typed context values
(`TypeInterfaceSetV1`, `OwnerRef`, `CaseRef`) and preserve `Result`/diagnostic
boundaries. No new async loader, compile function name, runtime registry or
mandatory runtime library is introduced. Public JS per-call state is fresh;
success or failure in one compile cannot affect the next. In particular,
`resetMacros` is explicit; ordinary `expandWithMacroImports` does not call it,
and `classifier.js` currently writes a shared `typeRegistry`. V1 must replace
that shared type state with explicit per-compilation context at every stage.

## Runtime identity, construction and guards

The source baseline emits a flat object with string `tag`, flat constructor
bindings and bare-tag matching; native and public registries key cases by
unqualified names. That shape does not distinguish owners. V1 formalizes this
recommended runtime representation, identical in both builder trials:

* Each evaluated declared owner creates one fresh `Symbol()` owner token. The
  shared metadata key is `Symbol.for("lykn.adt.owner.v1")`; the shared key is
  not the owner identity. The ECMAScript symbol registry is per agent, not a
  cross-agent serialization mechanism.
* Each constructed value receives an own symbol-keyed owner property with
  `{value: ownerToken, enumerable: false, writable: false, configurable: false}`.
  It also receives own `tag` with the normalized case name and explicit
  `{enumerable: true, writable: false, configurable: false}`.
* Payload fields are own ordinary enumerable, writable, configurable data
  properties. They remain shallowly checked at construction, not frozen or
  recursively validated. The `tag` payload field is reserved and produces a
  targeted diagnostic. Literal/computed property emission must treat
  `__proto__` as data, never as object-literal prototype syntax.
* A zero-field case has one per-owner/per-case object singleton, and that
  object is frozen so callers cannot add state to the shared value. A fielded
  constructor returns a fresh payload object. Do not intern fielded values or
  deep-freeze them.
* The namespace exposes exactly the declared normalized case properties and
  is shallowly read-only/frozen. Constructor bindings and identity metadata
  are immutable; this says nothing about payload mutability. Namespace
  prototype, reflective ordering, or a promise that it is a plain object are
  outside the public contract.

Statically provable source writes or deletes through a resolved ADT namespace
member are compile errors, including aliases whose `OwnerRef` remains known.
Dynamic escape to an ordinary object does not grant a new source mutation
exception; runtime consumers observe the frozen namespace's read-only slots.

The descriptor construction should use compiler-owned null-prototype literal
records with every descriptor attribute explicit, so polluted inherited
`Object.prototype` descriptor fields cannot alter `Object.defineProperties`.
Use a null-prototype descriptor map such as `{__proto__: null, ...}` and
computed property names for metadata and source fields. A computed
`["__proto__"]` payload member is an ordinary own data property. Do not add
`Object.create` or blanket `Object.prototype` freezing to the design.

Illustrative emitted shape (design only, not compiled):

```js
const __ownerToken = __lyknHostSymbol();
const __ownerKey = __lyknHostSymbol.for("lykn.adt.owner.v1");
const __Text = function(value) {
  const result = { ["value"]: value };
  __lyknHostObject.defineProperties(result, {
    __proto__: null,
    [__ownerKey]: { __proto__: null, value: __ownerToken,
      enumerable: false, writable: false, configurable: false },
    tag: { __proto__: null, value: "Text",
      enumerable: true, writable: false, configurable: false }
  });
  return result;
};
const Label = __lyknHostObject.freeze({
  __proto__: null, MissingField: __MissingField, Text: __Text
});
```

The real owner token and namespace declarations are initialized at the source
type declaration position. The illustrative null-prototype object literals
are compiler-owned generated text; no raw JavaScript helper is authored or
run by this design task.

The precise nominal membership predicate for an expected owner token is
evaluated in this order (each shown property read occurs once per predicate
invocation):

```js
if (value === null || typeof value !== "object") return false;
const observedOwner = value[ownerKey];
if (observedOwner !== expectedOwnerToken) return false;
const observedTag = value.tag;
return typeof observedTag === "string" &&
  (observedTag === "MissingField" || observedTag === "Text");
```

The final disjunction is the exact set of normalized cases for that owner.
This checks non-null object, brand equality and declared case membership; it
does not require a plain object, own properties, enumerable brand, matching
payload shape, or any recursive validity. Constructors install their own
readonly descriptors, but the matcher does not promise ownness as a security
boundary. Thus an object inheriting a matching brand and tag may satisfy the
predicate; arrays are not excluded if they carry those properties.
`Symbol.for` makes the key reflectable; hostile reflection can find and
deliberately copy the actual owner token. This is nominal membership against
ordinary raw `{tag: "Text"}` values, not an anti-forgery/security guarantee.
Reading brand/tag through foreign getters or proxies can throw, and the
exception propagates. The predicate reads brand once, then tag once if the
brand matches; separate clauses perform separate predicate evaluations.

Match dispatch always tests expected owner token and case before extracting
fields. A null/primitive subject returns false before property access, so a
later wildcard can match; absent fallback retains the existing
`match: no matching pattern` error. It then reads each binding field once into
a clause-local temp and recursively tests that value. The scrutinee is
evaluated once. No getter result is cached across clause attempts. Cross-owner
same-tag data, or ordinary raw `{tag:"Text"}`, cannot select the wrong branch
without copying the actual brand. Matching and owner/case dispatch remain
active under `strip_assertions` because they are language semantics.

Default named-ADT argument, return and payload guards check the same brand and
that `tag` belongs to the declared owner's case set. They do not recursively
revalidate mutable payload contents. `strip_assertions` removes these
assertions as it removes existing runtime type guards: a wrong-owner value may
pass a stripped function boundary, but it still cannot select a different
owner's match arm. Source owner/case/arity errors remain compile errors under
stripping. A fielded constructor is a detached receiver-independent ordinary
function that closes over its owner token. There is no dynamic arity wrapper:
extra JS arguments are ignored normally; missing `:string` arguments fail
the default payload guard, while stripped or `:any` calls may carry undefined.

Keep the selected mutation policies distinct. Namespace case members are
read-only and the namespace is shallowly frozen; zero-field singletons are
also frozen. Fielded payload objects keep writable fields, with immutable
brand and tag. In-place mutation retains the brand but can invalidate a field
type after the constructor guard ran. Spreading, `assoc` or `Object.assign`
creates ordinary data and loses the non-enumerable brand. There is no implicit
ADT-aware `assoc` or generic record-update operation. To change a value,
pattern-match and call the constructor again:

```lykn
(bind reconstructed
  (match original
    ((Label:Text text) (Label:Text text))
    (Label:MissingField Label:MissingField)))
```

JSON and supported clone operations have the same data/identity distinction;
see the next section.

The required host operations are `Symbol`, `Symbol.for`, `Object.freeze` and
`Object.defineProperties`. Arc03 host v1 protects only global `Reflect` and
exact `Reflect.apply`, and establishes no protection for these operations.
Therefore a bounded protected-host extension is an implementation
prerequisite. It must enumerate global roots (`Symbol`, `Object`) and exact
mutable slots (`Symbol.for`, `Object.freeze`, `Object.defineProperties`),
preserve lexical shadowing semantics, reject statically provable Lykn writes,
and state v1-style limits for dynamic aliases, globalThis escape and foreign
code. It must not claim to defend against an embedder that mutates intrinsics
before module evaluation or arbitrary foreign code. Hygienic compiler-owned
captures must work even when source binds `Symbol` or `Object`; the bounded
static inline-data-module import pattern avoids lexical capture by source and
adds no runtime package, but hosts/CSP that disallow data-module imports cannot
use that output path. No `Object.create`, prototype mutation or general
intrinsic trust is added. Pure initialization annotations are allowed only
after this extension is verified and only for fresh owner/object/namespace
construction; payload applications, guards and consumer effects are never
marked pure. The source baseline has no compiler-owned PURE annotation
facility; building and proving that provenance mechanism is a prerequisite,
not hand-authored output comments or a new public Lykn annotation.

The representation relies on the specified fresh-symbol, shared-registry,
and descriptor operations: [ECMAScript `Symbol`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor),
[`Symbol.for`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.for),
and [`Object.defineProperties`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperties).
These are primary-standard references for design semantics, not a claim of an
independent Deno/runtime test.

## Serialization and copy behavior

Serialization is not owner identity. `JSON.stringify`/`JSON.parse` carries the
enumerable `tag` and payload data but not the non-enumerable symbol brand.
Supported `structuredClone` operations do not preserve this symbol brand.
Object spread, `assoc`, and `Object.assign` copy enumerable data (including
`tag`) but lose the brand; their result is an ordinary object. No ADT-aware
`assoc` special case or record-update API is added. Preserve nominal
membership by pattern-matching and calling the declared constructor again, as
shown above. Raw JSON/clone/spread data requires explicit validation and
reconstruction with the declared constructor before nominal guards/patterns
accept it. There is no generic decoder, wire ABI, JSON-safe arbitrary payload
or structured-clone success guarantee. These statements follow the standards'
own-enumerable-property rules, not an independently executed runtime
experiment: [ECMAScript copy operations](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties),
[ECMAScript enumerable-own-property iteration](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-enumerableownproperties),
and [HTML structured serialization](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal).

## Names, collisions and diagnostics

Lykn source identifiers are converted to JavaScript names (for example,
`foo-bar` maps to `fooBar`). Validate collisions after the actual
`to_js_identifier`/public `toJsIdentifier` conversion, not just raw spellings.
At minimum, reject conflicting normalized type names, cases within a type,
fields within a constructor, imported aliases, and emitted namespace/member
bindings with a diagnostic naming both source spans. E.g. fields `foo-bar`
and `fooBar` cannot both emit to `fooBar`; neither may be silently overwritten.
Check collisions across case names, namespace properties, constructor locals,
and generated helper names in the final output scope.

`tag` is ordinary user data in the abstract language unless the chosen runtime
layout reserves it. Under the current tagged-object candidate, a payload field
named `tag` collides with metadata and must either receive a different
representation/key or be rejected with a targeted diagnostic; do not silently
overwrite it or misclassify all ordinary object keys as reserved. Any metadata
keys and helper identifiers must be enumerated by the selected layout and
collision-checked. Generated helper names should be compiler-owned and
hygienic across source bindings. Namespace member collision rules must also
cover case conversion and public exports. This diagnostic policy needs a
falsifiable inventory of all normalized names and metadata slots.

## Migration, exports and declarations

Current corpus uses legacy unqualified declarations and values (`Option`,
`Some`, `None`, same-named `Box` type/case) and its snapshots assert flat
constructor output. V1 deliberately changes this in release 0.6: qualified
declared constructors replace automatic flat constructor bindings; there is
no dual legacy emission mode or implicit bare export alias. A type/case
namespace is separate from ordinary function bindings, so user-defined
functions with short names remain intact. The existing `Box` example becomes
`(type Box (Box :any value))` plus `(Box:Box value)`; no `Box` function is
created from the case. Existing source/tests/examples and public constructor
and DTS exports must be inventoried and migrated at the recorded implementation
pin. Keep original historical evidence unchanged and distinguish migrated
test snapshots from old receipts.

The native `analysis/prelude.rs` registers blessed `Option` and `Result`
records with paths `lykn/core/option` and `lykn/core/result`, but these are
analysis metadata only: they install no runtime `Some`, `None`, `Ok`, `Err` or
owner namespace. Public pre-registration likewise must not synthesize runtime
constructors. No automatic built-in namespaces, shared runtime or mandatory
standard-library package is added. A local `(type Option ...)` is an ordinary
nominal declaration, distinct from any other `Option`; cross-module APIs must
explicitly declare/export an owner and import/reexport that same owner. Blessed
diagnostics may annotate a real declared/imported interface of the expected
shape, but metadata alone never authorizes an ownerless runtime pattern.
V1 intentionally replaces structural string-tag interoperation and the old
constructor-collision/prelude-shadow enhancement behavior; raw legacy tag
objects fail nominal guards and matches until the user explicitly validates
and reconstructs through a declared constructor.

Existing imports support named aliases; `skills/lykn/SKILL.md` bans surface
namespace imports and `export *`. User source continues to use named imports
such as `(import "./label.js" ((alias Label label)))`. L2's compiler-generated
namespace import is only an internal implementation edge. The package export
map, generated token/case exports, and `.d.ts` declarations are audited as
compiler-owned interface. DTS exposes the runtime owner namespace, a nominal
tagged union with readonly `tag` and readonly symbol brand, mutable payload
fields, and the generated token as its actual `unique symbol` export. It adds
no helper property to `Label`; the generated token is a versioned ABI export,
not a secret or human-facing constructor API.

Illustrative declaration shape (exact syntax remains a DTS implementation
conformance check):

```ts
export declare const __lykn_adt_v1_owner_Label: unique symbol;
export type Label =
  | { readonly tag: "MissingField";
      readonly [__lykn_adt_v1_owner_Label]: typeof __lykn_adt_v1_owner_Label }
  | { readonly tag: "Text";
      readonly [__lykn_adt_v1_owner_Label]: typeof __lykn_adt_v1_owner_Label;
      value: string };
export declare const Label: Readonly<{
  MissingField: Label;
  Text: (value: string) => Label;
}>;
```

The symbol property is readonly in the type and has the matching runtime
non-enumerable descriptor; source payload fields remain mutable. The runtime
namespace member object contains no owner-token helper property.

Migration inventory from actual tracked searches (commands used):

```text
git grep -l -E '\(type |\(match |\(import .*alias|\(exports|\(export ' HEAD -- crates/lykn-lang/tests crates/lykn-lang/src packages/lang/test docs/guides
git grep -l -E '\(type |\(match |\(import .*alias|\(exports|\(export ' HEAD -- test crates/lykn-lang/tests
```

`packages/lang/test` is absent; public corpus tests live under `test/`.
Inspected complete `test/surface/type_test.lykn`, `match_test.lykn`, import
and export fixtures/tests, native match-check cases, and the registry, parser,
resolver, analysis, emitter and DTS symbols listed in the closeout. They
exercise local legacy declarations/construction/matching, aliases for runtime
imports and exports, and concrete same-name `Box`/`Pair` cases, but provide no
cross-module imported type-owner oracle. A migration inventory must list all
changed source examples, tests, generated JS/DTS exports and package consumers;
this design does not claim a use count or “no breakage.” Project07's book and
human review and Project03's API/docs audit remain separate gates.

## Proposed acceptance checks (not run)

After independent review accepts these contract decisions and the L2 identity
conflict is resolved in iteration02, source-level checks should include: two
modules each declaring `Label.Text`;
two aliases including a lowercase alias; same-owner aliases; a shadowed type
binding; unknown owner/case and missing interface; zero-field constant use;
fielded arity, nested extraction and guard behavior; wrong-owner/forged values
under checked and stripped output; payload type mismatch; effectful guard and
fallback order; normalized identifier and `tag` collisions; namespace/payload
mutation separately; named exports and declarations; JSON/clone plus explicit
reconstruction if required. Inspect generated code and runtime outcomes, not
only AST or diagnostic snapshots. No checks were run for this design artifact.

## Grounding and limits

Source is the clean `codex/completion-value-flow` worktree at
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`; planning citations resolve to
that assigned checkout, not the planning tree. Key implementation surfaces:
`crates/lykn-lang/src/analysis/type_registry.rs` (bare constructor map and
`TypeDef`), `analysis/pattern.rs` (bare lookup), `ast/surface.rs` and
`classifier/forms.rs` (string names), `resolver.rs` (lexical value binding),
`analysis/mod.rs` (per-module declarations), `emitter/forms.rs` (`emit_type`,
`compile_pattern`, `compile_let_pattern`), `emitter/type_checks.rs`,
`emitter/dts.rs`, and public `packages/lang/mod.js`, `expander.js`,
`expander-core.js`, `surface.js`, `surface-helpers.js`, `surface-ast.js`,
`classifier.js`, `compiler.js`. The source-facing `lykn(source,{strict})` is a
pure synchronous single-source route; `compile_file`/`compile_source` and
`dist` analyze files individually and currently have no type-interface graph.
This is a design contract, not implementation evidence or test acceptance.
