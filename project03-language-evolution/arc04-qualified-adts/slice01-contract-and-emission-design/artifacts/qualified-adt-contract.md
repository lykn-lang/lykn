# Qualified ADT contract — iteration02 proposal

**Status:** CC proposal for independent review. All QD rows remain open. This replaces the incoherent iteration01 sidecar layout while preserving its history in Git and the slice report. No example below was compiled or executed.

## 1. Surface contract and binding resolution

The approved declaration and construction shape is:

```lykn
(type Label MissingField NullField (Text :string value))

(match input
  ((Label:MissingField) "missing")
  ((Label:NullField) "null")
  ((Label:Text text) text))

(Label:Text "hello")
```

`(Zero)` in a declaration normalizes to the same zero-field case as `Zero`; neither is a callable constructor. Zero-field cases are values, fielded cases are constructor functions. `Label:Text` is resolved through the lexical binding for `Label`, then its declared case, never by capitalization or a textual tag. A lower-case imported alias works identically:

```lykn
(import "./label.js" (Label))
(bind label Label)
(bind greeting (label:Text "hello"))
```

An immutable direct owner alias retains its semantic `OwnerRef`. Conditional/dynamic namespace values do not. `(get Label key)` and arbitrary `object:method`/colon access remain ordinary runtime member access. Unknown-owner diagnostics apply only inside ADT-specific type/pattern contexts or where binding analysis identifies an ADT owner; they must not reject an ordinary host object. A pattern naming a statically known owner but an undeclared case, malformed constructor, or wrong arity is a compile diagnostic in either assertion mode. Unknown imported interfaces are diagnosed only when an ADT-specific use requires them.

Case names do not create flat value bindings: `(type Box (Box :number value))` is used as `(Box:Box 1)`. Existing ordinary calls to a short name keep their lexical resolution. The runtime namespace introduces a lexical value named `Box`; another declaration with that same normalized value name in the same scope conflicts and receives a targeted diagnostic. A function sharing only a case's short name is independent. Nested lexical shadowing remains ordinary lexical behavior. `(export (type ...))` is module-top-level and participates in owner collection; type declarations nested in functions/blocks are unsupported in v1 and get an explicit diagnostic in both compilers. The static collection pass does not execute or hoist runtime initialization. Forward type/interface references can resolve statically, but runtime bindings initialize at declaration position and obey normal `const`/ESM TDZ, including cyclic access before initialization.

Identifier normalization must be performed before conflict checks. Detect two source names that map to the same Lykn JS identifier, namespace case members that normalize to the same emitted JS property, generated ABI export collisions, namespace binding collisions, and reserved metadata collisions. `tag` is reserved as a payload field. Other payload keys are ordinary data keys; generated object code must define even `__proto__` as a computed data property. Namespace cases use own declared properties only. Compiler-generated identifiers and ABI exports use a reserved hygienic naming scheme and collision checks, not source spelling guesses.

## 2. Semantic references and metadata delivery

Compile-time identity is a typed `OwnerRef` (canonical logical module ID plus stable declaration ID) and `CaseRef` (owner plus declared case ID), separate from runtime identity. Logical IDs must not be absolute build-machine paths. Reexports and named import aliases preserve the same `OwnerRef`; separate declarations with equal names remain distinct. Runtime instances allocate a fresh token for each evaluated owner declaration. Re-evaluating the same producer through independent module instances therefore creates distinct runtime owners.

Version-1 supplied interface metadata has this shape (illustrative JSON):

```json
{
  "schema": "lykn.type-interfaces",
  "version": 1,
  "runtimeAbi": "lykn.adt.v1",
  "currentModuleId": "app/main",
  "modules": [{
    "moduleId": "pkg/label",
    "imports": [],
    "typeDefinitions": [{
      "ownerRef": {"moduleId": "pkg/label", "declarationId": "Label"},
      "name": "Label",
      "visibility": "public",
      "cases": [
        {"name": "MissingField", "fields": []},
        {"name": "NullField", "fields": []},
        {"name": "Text", "fields": [{"name": "value", "type": {"kind": "builtin", "keyword": "string"}}]}
      ]
    }],
    "exports": [{
      "name": "Label",
      "ownerRef": {"moduleId": "pkg/label", "declarationId": "Label"},
      "namespaceExport": "Label",
      "ownerTokenExport": "__lykn_adt_v1_owner_Label",
      "caseExports": {
        "MissingField": "__lykn_adt_v1_case_Label_MissingField",
        "NullField": "__lykn_adt_v1_case_Label_NullField",
        "Text": "__lykn_adt_v1_case_Label_Text"
      }
    }]
  }]
}
```

Each field `type` is a tagged union: a recognized built-in keyword or `{"kind":"adt","ownerRef":{"moduleId":"...","declarationId":"..."}}`; it is never an unqualified type-name string resolved in the consumer. `typeDefinitions` includes required private and transitively referenced definitions for type checking/declarations, marked private and without a public runtime namespace export. `imports` maps the actual source specifier to its target module ID. Reexports preserve `ownerRef` and record the actual namespace/token/case export names at each reexport boundary. There is no layout field, sidecar specifier, or guessed export name. Schema/consistency validation is deterministic and performs no I/O. It cannot prove a remote module exports what a caller claims; the build graph validates source and produced exports, while public callers provide trusted matching interfaces.

The existing synchronous `lykn(source, {strict})` call remains valid. Add optional `moduleId` and `typeInterfaces`; without `moduleId`, each call has a fresh anonymous context suitable for local ADTs but not stable cross-module identity. Missing `typeInterfaces` means no external ADT interfaces, not no local ADTs. When interfaces are supplied, `moduleId` identifies the current unit and must match. Invalid schema fails deterministically before lowering. The CLI/build adapter creates metadata using a non-executing module-interface graph pass and passes it to compilation; runtime imports do not populate a compile-time registry. Do not evaluate modules or fetch network metadata. Native `lykn compile`, `build`, and `dist` use this graph adapter; package output preserves the generated ABI exports.

Public stage shapes remain: `expand` returns kernel forms, `compile` returns a program string, and `compileExpr` returns an ESTree node. Fresh metadata/state is threaded through surface resolution and lowering. Fully lowered kernel input continues to compile without an ambient registry or newly mandatory context. Public `browser.compileLykn` mirrors the optional metadata options and string result. Replace the JS process-global type registry with per-compilation state; explicit `resetMacros` remains an explicit reset, not an isolation guarantee. Native analysis currently lacks an imported module path/interface graph and collects top-level types only. Prelude Option/Result records in `analysis/prelude.rs` are analysis metadata only: they install no runtime namespace, owner token, or constructors. They do not grant ownerless matching or automatic runtime interoperability.

## 3. Runtime representation and match/guard contract

Recommended common representation for both emission candidates:

- At each evaluated owner declaration, allocate a fresh `const ownerToken = Symbol()`.
- Use the shared metadata key `Symbol.for("lykn.adt.owner.v1")` as the key on instances; its property value is the owner's private token. The shared key is not itself identity.
- Each instance has own `tag`, enumerable, non-writable, non-configurable, containing the normalized case name; and an own shared-symbol brand property, non-enumerable, non-writable, non-configurable, containing the owner token.
- Payload fields are own enumerable writable/configurable data properties and are shallowly guarded at construction by current declared field checks. Payload records remain mutable. `tag` is reserved and rejected as a payload field.
- A zero-field case has one frozen singleton per evaluated owner/case. Fielded constructor calls return fresh records. Constructor functions are ordinary receiver-independent functions; detached calls need no dynamic arity checker. Existing field guards catch missing/undefined or wrong-typed values unless assertions are stripped.
- `Label` is a shallow-frozen namespace facade with immutable case members. Namespace immutability, payload mutability, and intrinsic assumptions are distinct policies. Fielded data is not deep-frozen; payload mutation may invalidate a declared field type, matching existing mutable-data limitations.

The membership predicate for a value `v`, owner token `o`, and case set `C` is exactly: `v` is non-null and `typeof v === "object"`, `v[brandKey] === o`, and `v.tag` is a member of the declared case names `C`. This is not an own-property requirement, descriptor audit, anti-forgery boundary, or recursive payload validator. A deliberately forged/copy-constructed brand can pass; old plain `{tag:"Text"}` data cannot. Default named-ADT guards use this owner/case predicate plus existing declared payload field guards at constructor/function boundaries. Match dispatch uses owner/case membership even when assertions are stripped. Wrong-owner data fails default guards and cannot select a wrong match arm in stripped mode. `null`, primitives, and missing values safely fail membership before subject-property extraction, so a fallback can match; no match preserves the existing `match: no matching pattern` error. Once a pattern matches owner/case, nested field reads occur exactly once per source occurrence into clause-local bindings, then nested checks run. A foreign getter/proxy that throws during an actual property access propagates its exception; it is not converted to a no-match. “Exactly once” does not authorize memoizing getters across clauses.

A qualified expression reads the actual source qualifier before arguments, even under L2 static case linkage. For example, if `Later` is initialized after `use`, then `use` called before that initialization must throw a TDZ `ReferenceError` before `argEffect()` runs:

```lykn
(func use (x) (Later:Text (argEffect x)))
(bind answer (use input)) ; Later is still in its TDZ; argEffect must not run
(bind Later Label)
```

The illustrative lowering is `(qualifierBinding, privateCaseBinding)(args)`; extracted values and unit cases perform `(qualifierBinding, privateCaseBinding)` as a sequence before yielding the case. This retains the source alias read and constructor argument order while avoiding receiver dependence. Do not infer a broad TDZ guarantee from a particular bundler. Pattern dispatch similarly reads its resolved qualifier before safe membership checks; nested qualifiers are read only when reached. Conditional/dynamic namespace values and computed gets remain ordinary runtime operations, not statically owned patterns.

Standard semantics supporting the representation: fresh `Symbol()` and shared `Symbol.for` registry behavior in the [ECMAScript Symbol constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor) and [Symbol.for](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.for); explicit property descriptors in [Object.defineProperties](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperties); enumerable-copy behavior in [CopyDataProperties](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties) and [EnumerableOwnProperties](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-enumerableownproperties); structured serialization's ordinary-object handling in the [HTML structured serialize algorithm](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal). These are standards claims, not a runtime execution receipt.

## 4. Serialization, mutation, and host prerequisites

JSON and supported structured clone operations transport data, not nominal membership. A decoded/raw value requires explicit application validation and reconstruction through its declared constructor before nominal guards or patterns accept it. No automatic decoder, arbitrary-payload JSON guarantee, or identity round-trip is added. `Object.assign({}, value)`, spread, Lykn `assoc` (which emits a spread copy), JSON and clone omit the non-enumerable brand. In contrast, `Object.assign(existingADT, updates)` mutates that object and retains its brand, subject to readonly `tag`/brand descriptors and ordinary mutable payload fields. Idiomatic update reconstructs explicitly:

```lykn
(match value
  ((Label:Text text) (Label:Text (template text "!"))))
```

There is no generic ADT-aware assoc special case or new record-update form.

The current protected-host v1 protects only the global `Reflect` binding and exact `Reflect.apply`. It does not protect `Symbol`, `Symbol.for`, `Object.freeze`, or `Object.defineProperties`. Implementation therefore requires a separately reviewed bounded host-contract extension naming exact roots/slots, lexical hygiene, source-write diagnostics, and limits for shadowing, dynamic aliases, and foreign mutation. Capture/hygiene strategy must state inline-module/CSP implications. For descriptor construction, use compiler-owned null-prototype descriptor records such as `{__proto__: null, value: ..., writable: false, enumerable: true, configurable: false}` with every attribute explicit; this avoids inherited `Object.prototype` descriptor pollution without requiring `Object.create`. Computed property definitions safely preserve payload keys such as `__proto__`. This is not a promise that all host prototypes are pristine or frozen. Do not claim Reflect protection covers other intrinsics.

Unused initialization removal additionally requires a compiler-owned typed provenance mechanism for initialization purity. There is no current `PURE`/`PureCall` facility. It must attach verified provenance to just safe owner/namespace/case initialization, preserve effectful applications, arguments and guards, and be covered by AST/comment serialization tests; no hand-written output comments or general public purity annotation.

## 5. Declaration and export ABI

For public `Label`, export the frozen namespace as `Label`, a fresh owner token as `__lykn_adt_v1_owner_Label`, and each case as a named versioned ABI export such as `__lykn_adt_v1_case_Label_Text`. Both candidate layouts export these identical names from the same producer module; no helper member is added to `Label`. Private owners remain private. Reexports map these actual names and preserve the logical `OwnerRef`. Package staging preserves all public namespace/token/case exports; application bundling may remove unobserved code only with effects preserved.

The `.d.ts` uses a private declared unique-symbol key for the shared runtime brand key and the actual exported unique owner token as the nominal property value type, not as the property key. Sketch:

```ts
declare const __lykn_adt_v1_owner_brand: unique symbol;
export declare const __lykn_adt_v1_owner_Label: unique symbol;
export type LabelValue =
  | { readonly tag: "MissingField"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label }
  | { readonly tag: "NullField"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label }
  | { readonly tag: "Text"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label; value: string };
export declare const __lykn_adt_v1_case_Label_MissingField: LabelValue;
export declare const __lykn_adt_v1_case_Label_NullField: LabelValue;
export declare function __lykn_adt_v1_case_Label_Text(value: string): LabelValue;
export declare const Label: Readonly<{
  MissingField: typeof __lykn_adt_v1_case_Label_MissingField;
  NullField: typeof __lykn_adt_v1_case_Label_NullField;
  Text: typeof __lykn_adt_v1_case_Label_Text;
}>;
```

Confirm TypeScript's unique-symbol declaration and readonly/mutable payload intent in the later API gate. ABI exports and declaration names must be collision-checked after JS name conversion. Do not make namespace imports or `export *` legal; compiler-internal named case imports are not a user syntax exception.

## 6. Migration and falsifiable conformance obligations

The current source corpus contains legacy bare constructor uses (including `test/surface/type_test.lykn` Box/Pair cases); source guide says namespace imports and `export *` are banned. Native `TypeRegistry` is bare-case keyed; AST/surface constructor/pattern nodes carry textual names; native analysis collects top-level types, resolver handles lexical bindings but not ADT import interfaces; current emitter emits flat constructors and textual tags, and nested pattern support is incomplete. Native DTS separates constructor declarations from tagged unions. JS surface helpers/classifier use a bare-name registry that can leak across ordinary calls; explicit `resetMacros` is not automatic isolation. Public `lykn` and browser compile are synchronous source-to-string APIs; CLI compile/build/dist have no interface graph. Native and public parity, actual corpus migration, declarations, tests, API audit, guides and book remain required. The record does not assert a whole-repository occurrence count.

Discriminating checks for later implementation: same-spelled `Left.Label:Text` and `Right.Label:Text` match only their owners; a lowercase alias resolves the same imported owner; an unknown ADT case errors while an ordinary imported object colon access compiles; same-scope normalized namespace/function collision errors while nested shadowing works; alias TDZ occurs before argument effects; wrong-owner default guard fails but stripped match still selects no false arm; null/primitive fallback has no subject property read; throwing getter propagates; nested field extraction is once; `assoc`/spread/JSON/clone lose membership while in-place payload mutation retains it; decoded data reconstructs only by explicit constructor; repeated JS compiler calls do not leak registries; package exports and `.d.ts` agree with metadata. These are future implementation oracles, not checks run here.

Migration is a deliberate 0.6 break: qualify constructor and pattern uses, replace structural `{tag:...}` interoperability with shared declared owner imports, preserve ordinary function calls, and update public exports/declarations. Blessed Option/Result metadata alone does not synthesize runtime values. Any Option/Result sharing must use an explicitly declared/imported owner. Corpus-wide impact, API docs and human-facing book changes are assigned to later audit/review, not assumed complete here.
