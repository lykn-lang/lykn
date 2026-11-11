# Qualified ADT contract — iteration03 proposal

**Status:** CC proposal for independent review; all QD rows remain open. This version replaces the current contract text while preserving earlier candidate and review history in Git and the slice-root report. Examples are design inputs and were not compiled or run.

## Source forms, binding resolution, and diagnostics

The approved declaration and primary pattern example are:

```lykn
(type Label MissingField NullField (Text :string value))

(match input
  (Label:MissingField "missing")
  (Label:NullField "null")
  ((Label:Text text) text))

(Label:Text "hello")
```

Zero-field declaration syntax `(Zero)` normalizes to `Zero`; both declare a value, not a function. The canonical zero-field pattern is the bare qualified case in its clause, e.g. `(Label:MissingField "missing")`. The parenthesized pattern `(Label:MissingField)` is accepted as an equivalent zero-field pattern *inside a match clause*, including through a lowercase imported owner alias. It never denotes an expression call: `(Label:MissingField)` in expression position is a compile-time invalid call of a zero-field value. Its expression value is `Label:MissingField`. A fielded `Label:Text` pattern has exactly the declared field count; fielded constructor patterns bind the declared fields in order.

A direct, statically resolved qualified fielded constructor call has exactly its declared payload arity, diagnosed at compile time in both checked and stripped modes. This is a source rule, not an emitted runtime arity checker. A detached case function or dynamic ordinary function value remains an ordinary JavaScript function call with JavaScript arity behavior; existing payload type guards still apply where emitted and may be stripped. An unknown case on a statically known ADT owner is diagnosed in either mode. Unknown-owner errors are limited to ADT-specific type/pattern contexts or bindings statically identified as ADT owners; ordinary `object:method`, host objects and computed `(get object key)` stay ordinary member operations.

For each match, all root-level constructor patterns must resolve to one owner identity. Static constructor patterns from different owners produce the shared diagnostic `mixed constructor types in match: expected '<owner>', found '<owner>'` (native `Diagnostic` and public compiler error must agree in category and wording). This preserves the existing match check's single constructor universe; qualified v1 does not add heterogeneous-root matches or a new exhaustiveness algorithm. A nested constructor pattern is checked against its declared field type and has its own nested-field owner; it does not create another root owner in the enclosing match. Existing native reachability/exhaustiveness behavior is retained and migrated from short type-name strings to `OwnerRef`/`CaseRef`; equal-spelled declarations cannot collapse into one universe.

Owner lookup follows lexical binding identity, including a lowercase imported alias; it never uses capitalization. Immutable direct owner aliases preserve the same `OwnerRef`; conditional/dynamic namespace values do not. A dynamically fetched case value is ordinary code, not an ADT-specific pattern owner. Case names do not declare flat bindings. `(type Box (Box :number value))` is used as `(Box:Box 1)`. The runtime namespace creates a lexical value binding named `Box`: an ordinary function or value with that same normalized name in the same scope conflicts and receives a diagnostic. A function sharing only a short case name is independent; nested lexical shadowing remains normal. `(export (type ...))` remains top-level and participates in owner collection. Other nested/local type declarations are unsupported v1 and receive an explicit diagnostic in both compilers. Static collection does not execute or hoist values. Forward type/interface references may resolve statically, while owner namespace/token initialization remains at its declaration position and follows ordinary const/ESM TDZ.

JS-name conversion is part of name identity checks. Detect distinct source names that normalize to the same JS identifier, namespace members that collide after conversion, duplicate case/field property names, ABI-export collisions, namespace/function collisions, and reserved slots before emission. `tag` is reserved as a payload field. Other payload keys are ordinary data keys; emitted `__proto__` data keys must use safe computed definitions. Compiler-generated names and imports are hygienic. User bindings/aliases named `Symbol`, `Object`, `Number`, `Array`, `Promise`, `TypeError`, or `Error` cannot capture compiler-owned helper references; the host extension's roots/slots and dynamic-alias limits cover these uses.

## Compile-time owner identity and loader-instance identity

Static identity uses typed `OwnerRef` and `CaseRef`; runtime identity is a fresh token for each evaluated owner declaration in the actual producer module instance. Owner references use a canonical logical module-graph identity plus stable declaration ID, not basename, source bytes or absolute build-machine paths. The graph identity must preserve distinctions the loader preserves: URLs/specifiers differing by query or fragment and separately resolved copies remain distinct owners even when source bytes match. Same module instance imported through named aliases or a reexport shares the same owner. The owner token and case exports stay attached to that real producer instance/boundary; no deduplication by short type name or package template ID.

A package's interface template identity is instantiated/rebased by the graph adapter to the actual resolved `OwnerRef`s in the consuming graph. A pure public compiler caller supplies the already resolved graph. If two distinct resolved producer instances declare `Label`, their OwnerRefs and evaluated Symbol tokens differ. A future semantic regression constructs both source-identical instances (for example distinct query URLs), asserts different tokens, then verifies cross-owner pattern rejection. This is separate from the 24 bundle cells.

## Version-1 interface schema and validation

The schema is a trusted, explicit compile-time input; runtime imports do not populate a compile-time registry. Top-level object fields are required and exact: `schema`, `version`, `runtimeAbi`, `currentModuleId`, `modules`. V1 requires `schema: "lykn.type-interfaces"`, `version: 1`, `runtimeAbi: "lykn.adt.v1"`, a non-empty `currentModuleId`, and a `modules` array with one unique record for every reachable logical module in the supplied graph, including the current module. Module records require `moduleId`, `imports`, `typeDefinitions`, and `exports`; arrays may be empty. V1 has no implicit defaults inside an interface record and rejects unknown fields so later additions require a version decision.

An `imports` item is exactly `{specifier, targetModuleId}`. The `specifier` is the literal module specifier as used by that current module; duplicates are invalid. `targetModuleId` must name one module record in the schema. To resolve `(import "./label.js" ((alias Label label)))`, find the current module record, look up the exact specifier `./label.js`, find the target module record, normalize imported name `Label` with Lykn's JS-name conversion, find that exact public `exports[].name`, then bind its `ownerRef` under local alias `label`. Never guess a path, infer an ADT from capitalization, or consult a process-global registry.

A type definition requires `ownerRef`, source `name`, `visibility` (`public` or `private`), and `cases`. `ownerRef` is `{moduleId, declarationId}` and must identify exactly one definition in exactly one module; reexports refer to that same definition without redefining it. A case requires `name` and `fields`. A field requires `name` and `type`. A field type is exactly one of `{kind:"builtin",keyword:<supported built-in>}` or `{kind:"adt",ownerRef:<resolved OwnerRef>}`. Field names, case names, normalized JS names and declaration IDs are unique in their applicable owner scope. Every ADT field OwnerRef must resolve. Metadata includes private/transitively referenced definitions required for type/declaration checking, but these do not acquire public namespace or ABI exports.

An ADT export requires `name`, `ownerRef`, `namespaceExport`, `ownerTokenExport`, and `caseExports`. `caseExports` has exactly one actual generated export name for every case and no unknown case keys. `name` is the Lykn-visible export used by an import. The other fields are the real runtime export names at that module boundary. Normalized export names and all actual ESM binding names must be unique. For a direct public owner, `ownerRef` must resolve to a public definition in that module. For a reexport, `ownerRef` stays the original defining OwnerRef while `namespaceExport`, `ownerTokenExport`, and each `caseExports` entry name the actual reexported bindings. This does not impose a sidecar or a layout field.

The full renamed barrel graph is:

```lykn
;; pkg/label.lykn
(export (type Label MissingField NullField (Text :string value)))

;; app/barrel.lykn
(import "./label.js" ((alias Label Renamed)))
(exports Renamed)

;; app/main.lykn
(import "./barrel.js" ((alias Renamed label)))
(bind greeting (label:Text "hello"))
```

Its metadata records these three modules and the actual specifier routes:

```json
{
  "schema": "lykn.type-interfaces",
  "version": 1,
  "runtimeAbi": "lykn.adt.v1",
  "currentModuleId": "app/main",
  "modules": [
    {
      "moduleId": "pkg/label",
      "imports": [],
      "typeDefinitions": [{
        "ownerRef": {"moduleId": "pkg/label", "declarationId": "Label"},
        "name": "Label", "visibility": "public",
        "cases": [
          {"name": "MissingField", "fields": []},
          {"name": "NullField", "fields": []},
          {"name": "Text", "fields": [{"name": "value", "type": {"kind": "builtin", "keyword": "string"}}]}
        ]
      }],
      "exports": [{
        "name": "Label", "ownerRef": {"moduleId": "pkg/label", "declarationId": "Label"},
        "namespaceExport": "Label", "ownerTokenExport": "__lykn_adt_v1_owner_Label",
        "caseExports": {
          "MissingField": "__lykn_adt_v1_case_Label_MissingField",
          "NullField": "__lykn_adt_v1_case_Label_NullField",
          "Text": "__lykn_adt_v1_case_Label_Text"
        }
      }]
    },
    {
      "moduleId": "app/barrel",
      "imports": [{"specifier": "./label.js", "targetModuleId": "pkg/label"}],
      "typeDefinitions": [],
      "exports": [{
        "name": "Renamed", "ownerRef": {"moduleId": "pkg/label", "declarationId": "Label"},
        "namespaceExport": "Renamed", "ownerTokenExport": "__lykn_adt_v1_owner_Renamed",
        "caseExports": {
          "MissingField": "__lykn_adt_v1_case_Renamed_MissingField",
          "NullField": "__lykn_adt_v1_case_Renamed_NullField",
          "Text": "__lykn_adt_v1_case_Renamed_Text"
        }
      }]
    },
    {
      "moduleId": "app/main",
      "imports": [{"specifier": "./barrel.js", "targetModuleId": "app/barrel"}],
      "typeDefinitions": [],
      "exports": []
    }
  ]
}
```

The consumer's L2 case ABI import is from the actual barrel specifier `./barrel.js`, using `__lykn_adt_v1_case_Renamed_Text`; its OwnerRef remains `pkg/label/Label`. Runtime reexports preserve the defining token. The barrel declaration reuses the original type:

```ts
export type Renamed = import("./label.js").Label;
export { Label as Renamed,
  __lykn_adt_v1_owner_Label as __lykn_adt_v1_owner_Renamed,
  __lykn_adt_v1_case_Label_MissingField as __lykn_adt_v1_case_Renamed_MissingField,
  __lykn_adt_v1_case_Label_NullField as __lykn_adt_v1_case_Renamed_NullField,
  __lykn_adt_v1_case_Label_Text as __lykn_adt_v1_case_Renamed_Text } from "./label.js";
```

The same original private brand-key declaration is inherited through the imported `Label` type; a barrel must not manufacture a new key or nominal brand.

V1 consistency validation is deterministic and performs no filesystem/module I/O. Representative public malformed-option/interface failures throw synchronous `TypeError`s; source-use failures remain compiler diagnostics/errors. Native validation returns a named typed error through existing `Result` and CLI propagation. Example categories/messages:

- unsupported ABI/version: `typeInterfaces: expected lykn.type-interfaces v1 with runtimeAbi lykn.adt.v1`;
- missing current unit: `typeInterfaces: currentModuleId "app/main" has no module record`;
- unresolved exact source route: `typeInterfaces: module "app/main" has no import "./label.js"`;
- unresolved public imported name: `typeInterfaces: export "Label" not found in module "pkg/label"`;
- unresolved definition reference: `typeInterfaces: OwnerRef "pkg/label/Label" is unresolved`;
- post-conversion collision: `typeInterfaces: module "pkg/label" has colliding JS name "someName"`.

The real import resolver/build adapter separately verifies source files and emitted ESM export existence, and rebases package template owner IDs to the resolved module graph. Synchronous `lykn(source,{strict})` remains valid; add optional `moduleId` and `typeInterfaces`. Without moduleId, local ADTs receive a fresh anonymous compile context and are not advertised as stable cross-module metadata. Without typeInterfaces, local ADTs still work and external ADT imports are unavailable. Supplied `moduleId` must agree with the current module record. Public `expand` returns kernel forms, `compile` returns a program string, and `compileExpr` returns an ESTree node; fresh metadata is threaded through surface resolution/lowering. Fully lowered kernel input needs no ambient type registry or mandatory new context. Browser `compileLykn` mirrors optional metadata and the string result. Replace shared JS typeRegistry mutation with per-call state. The explicit `resetMacros` API is not automatic isolation. Prelude Option/Result are analysis metadata only, not runtime constructors/namespaces and not a special implicit owner.

## Runtime representation, match guards, and mutation

Both emission candidates use the same representation. Each evaluated owner declaration allocates a fresh token with `Symbol()`. Instances carry the shared metadata key `Symbol.for("lykn.adt.owner.v1")` as a non-enumerable, non-writable, non-configurable own symbol property whose value is that private owner token. The shared key is not identity. Each instance has own enumerable, non-writable, non-configurable `tag` set to the normalized case name. Payload fields are own enumerable writable/configurable data properties and get shallow declared checks at construction when assertions are enabled. `tag` is reserved as a payload field. Fielded constructors return fresh mutable payload records. Each zero-field case has one frozen singleton per evaluated owner/case. The exported namespace is shallow-frozen with immutable own case members. Namespace mutability, payload mutability, and trusted-intrinsic hygiene are separate policies; no deep payload freeze or general soundness guarantee is claimed.

The membership predicate for `v`, token `o`, and declared case set `C` is exactly: `v` is non-null with `typeof v === "object"`, `v[brandKey] === o`, and `v.tag` belongs to the closed declared case set `C` (implemented as exact declared-tag membership). It is not an own-property, descriptor, anti-forgery, or deep validation guarantee. A deliberate forged brand can pass; an old plain `{tag:"Text"}` cannot. Default named-ADT guards combine owner/case membership with the existing declared field guards. Match owner/case dispatch remains when assertions are stripped. A wrong-owner value fails default guards and cannot select the wrong arm after stripping. For each attempted qualified pattern clause, evaluate/read its actual resolved namespace qualifier before owner/case dispatch; evaluate nested qualifiers only when the nested pattern is reached. `null`, primitive and missing subjects fail membership before subject property extraction and can fall through; no selected arm retains `match: no matching pattern`. A throwing foreign getter/proxy exception during a real property read propagates normally. Nested field occurrences are read once into clause-local temporaries after that clause's root owner/case match; this does not memoize foreign getters across clauses.

The accepted nested pattern and false-guard example declares both owners and gives the wrapper a typed Label field:

```lykn
(type Label MissingField NullField (Text :string value))
(type Envelope (Wrapped :Label payload))
(bind envelope (Envelope:Wrapped (Label:Text "hello")))
(match envelope
  ((Envelope:Wrapped (Label:Text text)) :when false "guarded")
  (_ "fallback"))
```

Root match owner is `Envelope`; its nested field pattern is owned by `Label`. Expected result is `fallback`. This does not use an ownerless prelude constructor and does not weaken existing exhaustiveness/reachability checks.

Qualified constructor evaluation reads the *actual source qualifier* before arguments, even for L2 direct case imports. The resolver-safe example is:

```lykn
(type Label (Text :string value))
(func arg-effect
  :args () :returns :string
  :body (console:log "argument") "hello")
(bind answer (use))
(bind Later Label)
(func use
  :args () :returns :any
  :body (Later:Text (arg-effect)))
```

`use` is a function declaration visible to the earlier call; its body resolves only after `Later` enters the following sibling scope. At runtime that earlier call reads `Later` while the alias is in TDZ and throws `ReferenceError`; `arg-effect` does not log. This distinguishes actual alias evaluation from merely loading the owner token. L2 preserves the qualifier expression/read before argument evaluation, with no receiver dependence. For extracted cases and zero values, sequence the actual qualifier read before yielding the linked case/value. Do not depend on a bundler-specific TDZ optimization.

## Serialization and reconstruction

JSON and supported structured-clone operations serialize data, not nominal owner identity. Decoded data requires explicit application validation and constructor reconstruction before nominal guards/patterns accept it. No automatic decoder, arbitrary JSON payload guarantee or identity round-trip is promised. Spread, structured clone, JSON, `Object.assign({}, value)`, and Lykn `assoc` (currently a new spread object) lose the non-enumerable brand. `Object.assign(existingADT, updates)` mutates the existing instance and retains brand, subject to readonly `tag`/brand and mutable payload behavior. In-place payload edits can violate declared field types. The complete all-case reconstruction is:

```lykn
(match value
  (Label:MissingField Label:MissingField)
  (Label:NullField Label:NullField)
  ((Label:Text text) (Label:Text (template text "!"))))
```

There is no generic ADT-aware `assoc` special case or new record-update feature.

The representation's standard-semantics assumptions are supported by the [ECMAScript Symbol constructor](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol-constructor), [`Symbol.for`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-symbol.for), and [`Object.defineProperties`](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-object.defineproperties); enumerable copy behavior by [`CopyDataProperties`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-copydataproperties) and [`EnumerableOwnProperties`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-enumerableownproperties); and ordinary object handling by the [HTML structured serialize algorithm](https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal). These primary standards references are not a runtime execution receipt.

## Host and purity prerequisites

Protected-host v1 protects only global `Reflect` and exact `Reflect.apply`. It does not protect `Symbol`, `Symbol.for`, `Object.freeze`, `Object.defineProperties`, or other host intrinsics. A separately reviewed bounded extension must name exact slots, capture/hygiene rules, source-write diagnostics and limits on dynamic aliases/foreign mutation. Compiler-owned null-prototype descriptor records with every attribute explicit avoid inherited `Object.prototype` descriptor pollution; computed payload definitions safely preserve `__proto__`. This does not promise pristine/frozen host prototypes or require a blanket freeze.

The S03 host plan must include transitive host operations required by reused emitted guards/errors, not just ADT branding: native `emitter/type_checks.rs` uses `Number.isNaN`, `Array.isArray`, `TypeError`, and `Promise` for `:promise`; native match no-match paths use `Error`. Public `surface-helpers.js` uses `Number.isNaN`, `Array.isArray`, and `TypeError`; its no-match path uses `Error`. Specify hygienic resolution if user owners/aliases shadow `Number`, `Array`, `TypeError`, or `Error`, and review the finite protected slots explicitly. Do not imply all current builtin guard semantics are already cross-compiler coherent; retain existing keyword/parity differences for the API/source audit. No new runtime library or blanket prototype freeze is in scope.

Unused initialization removal requires compiler-owned typed purity provenance, which does not exist in the current source. It applies only to verified owner/namespace/case initialization, never effectful application calls, arguments or guards. AST/comment serialization and typed provenance require scoped implementation and tests; do not add hand-authored output comments or a public purity annotation.

## Runtime ABI and precise TypeScript declarations

A public owner exports its namespace, owner token and each case from the same producer module under versioned names: `Label`, `__lykn_adt_v1_owner_Label`, `__lykn_adt_v1_case_Label_MissingField`, `..._NullField`, and `..._Text`. Private owners stay private. Both layouts have identical exports/metadata; ABI exports are real generated bindings audited by package staging and API checks. Reexports preserve runtime identity and map actual names at each boundary. Package staging retains public ABI exports; application bundling may remove unobserved code with effects preserved.

The TypeScript type namespace retains the public name `Label` alongside runtime value `Label`. The property key is a private declared unique symbol modeling the shared runtime brand key; its value type is the actual exported owner token. Case aliases give each ABI member its precise type. Sketch:

```ts
declare const __lykn_adt_v1_owner_brand: unique symbol;
export declare const __lykn_adt_v1_owner_Label: unique symbol;
type LabelMissingField = { readonly tag: "MissingField"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label };
type LabelNullField = { readonly tag: "NullField"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label };
type LabelText = { readonly tag: "Text"; readonly [__lykn_adt_v1_owner_brand]: typeof __lykn_adt_v1_owner_Label; value: string };
export type Label = LabelMissingField | LabelNullField | LabelText;
export declare const __lykn_adt_v1_case_Label_MissingField: LabelMissingField;
export declare const __lykn_adt_v1_case_Label_NullField: LabelNullField;
export declare function __lykn_adt_v1_case_Label_Text(value: string): LabelText;
export declare const Label: Readonly<{
  MissingField: typeof __lykn_adt_v1_case_Label_MissingField;
  NullField: typeof __lykn_adt_v1_case_Label_NullField;
  Text: typeof __lykn_adt_v1_case_Label_Text;
}>;
```

The tag and brand properties are readonly; Text.value is mutable. A reexported type alias references the original module's `Label`, never a new brand-key declaration. Later type-consumer checks must prove: `Label.Text("x").value` is string; `Label.MissingField.value` rejects; tag and brand writes reject; Text payload writes compile; barrel aliases retain the same nominal type. Declaration and generated ABI names are checked after JS name conversion. Namespace imports and `export *` stay banned.

## Source-grounded migration and future checks

At source commit `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95` in `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering` (`codex/completion-value-flow`), native `TypeRegistry` indexes bare constructor names; current surface AST/classifier records constructor and pattern spellings; `analysis/pattern.rs` deconstructed constructors and `analysis/match_check.rs::infer_match_type` compare short type-name strings; native analysis registers top-level types but has no imported interface graph. `emitter/forms.rs` emits flat constructors/text tags and has incomplete nested constructor extraction; `emitter/type_checks.rs` owns runtime guard generation; `emitter/dts.rs` emits function and tagged-union declarations. `packages/lang/mod.js` exposes synchronous `lykn(source,{strict})`; public surface/classifier currently mutates bare-name typeRegistry, while `resetMacros` is explicit. `packages/lang/compiler.js` resolves named import and alias syntax and dynamic import; `classifier/forms.rs::top_level_exportable_names` accepts `ImportLocal`, so exporting a locally imported namespace is legal. `packages/lang/test` is absent; support tests live in `test/`. Current prelude Option/Result registration is metadata only.

Later semantic checks are separate from the bundle cells: canonical and parenthesized zero patterns versus invalid zero calls; direct qualified arity in stripped/default modes; detached JS arity; shared mixed-root-owner diagnostic; nested typed Envelope/Label false-guard result; constructor owner equality and distinct query/fragment instance tokens; TDZ before argument effects; null/primitive fallback and throwing getters; clone/spread/assoc reconstruction; normalized collisions; alias/reexport metadata consistency; repeated-call isolation; and type-consumer declaration oracles above. These are required future checks, not executed evidence. The 0.6 migration deliberately qualifies legacy ADT uses and structural-tag interop; actual corpus census, public API audit, guide/book and human review remain with later increments.
