# Qualified ADT contract — design proposal

**State:** CC proposal for independent review; all QD rows remain open. The
source forms and qualified public JavaScript access below are fixed by the
operator-approved Arc04 direction. Representation, guards, metadata transport
and compatibility are proposed or unresolved as labeled.

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

`Label:MissingField` is a zero-field value, not a zero-argument call. A
fielded constructor is called with exactly its declared payload arity. The
approved source grammar distinguishes a qualified constructor/pattern by
resolved binding identity, not capitalization: a lower-case import alias is
equally valid. `Foo:method` and `object:field` remain ordinary colon/member
access in runtime expressions, including imported and host objects. Unknown
owner diagnostics apply only in an ADT-specific type declaration/pattern
context or after a binding has been statically identified as an ADT owner; a
blanket rule that rejects arbitrary colon access is incorrect. In a
constructor expression, the classifier/resolver must use lexical binding
kind to distinguish a type owner from a runtime value. It must not infer
typehood from uppercase spelling. A lower-case alias still qualifies when its
binding is a type. Shadowing follows lexical binding: a local value named
`Label` shadows the imported type in that region, so `Label:Text` remains a
runtime member access/call; an ADT pattern context that requires a constructor
reports that the binding is not an ADT owner.

Resolution should produce an owner reference plus case reference on AST or
resolved IR nodes. The current source AST stores constructor/pattern names as
strings; retaining strings alone cannot distinguish two owners with the same
case name. Unknown owner, unknown case, missing metadata, an ambiguous owner
binding, duplicate fields, wrong constructor arity, and malformed patterns
must be deterministic source diagnostics with spans. Case patterns bind
payload fields in clause-local scope; nested patterns recurse through declared
fields, and guard expressions see those bindings. A false guard proceeds to
the next matching clause/fallback; it does not mark the constructor absent.
Examples:

```lykn
(match value
  ((Label:Text (Some inner)) :when (valid? inner) inner)
  (Label:MissingField default))
```

The spelling above is illustrative of recursive binding only; nested pattern
support is an implementation requirement to establish, not current behavior.
Native emitter currently has a nested-pattern TODO. There is no proposal here
to infer exhaustive matches or deep container validation from qualified names.

## Owner identity and imported metadata

Owner identity is the identity of the declaration binding exported by a
logical module, not a qualifier string, a case name, an absolute build path,
or the emitted JavaScript variable name. Thus two modules that each declare
`Label` with a `Text` case retain different owners even when a consumer gives
each local binding the spelling `Label` in separate scopes; their public
qualified member shape may both read `Label.Text`. An import alias changes the
local binding spelling but preserves imported owner identity. Two aliases of
the same exported type denote the same owner. This also applies when a local
type shadows one imported under an alias.

**Recommendation for CDC:** assign a stable logical `OwnerId` from the
package/module public specifier and exported type declaration key, with a
versioned or content/interface component only if the package identity policy
requires it. Resolve import specifiers and aliases to that identity using the
build's explicit module graph. Do not include checkout roots or machine paths.
The exact stable key, package-version behavior, private/local owner identity,
and cross-package duplicate policy require CDC disposition.

Compile-time resolution needs explicit type-interface metadata. Runtime ESM
imports do not register compile-time types. The CLI/build recommendation is a
graph prepass: read the statically declared source modules, collect exported
type interfaces (owner ID, cases, ordered fields and source names/types),
resolve import specifiers through the configured import map/package graph,
then pass the imported interfaces into each module's resolver/analyzer. Normal
compile and dist must use the same interface pass; unresolved/dynamic imports
cannot silently guess. Preserve per-file diagnostics and source spans.

The current public `lykn(source, {strict})` and browser `compileLykn(source,
{strict})` routes are synchronous, single-source compilers. **CDC must choose
their compatible metadata API.** Recommended
minimal path: keep this entry point synchronous and add an explicit options
field such as `moduleId` and `typeInterfaces`, or a separate synchronous
`compileWithInterfaces(source, options)`; callers supply already resolved
interfaces. A graph-aware build API may resolve modules before invoking it.
Any async resolver must be a separate additive API. Never rely on a
process-global registry populated by runtime imports. Missing metadata for a
qualified imported pattern is an error. The Rust `compile_source`/`compile_file`
and `dist` routes likewise need the interface input wired through their
resolve/analyze stages.

## Runtime identity, construction and guards

The existing native representation is a flat object with a textual `tag`;
fielded constructors emit functions, zero-field cases emit constants, and
patterns compare `target.tag` with the bare constructor name. This representation
cannot establish owner membership. The existing public compiler has a similar
bare-constructor map. `packages/lang/classifier.js` mutates a process-global
registry and `expander-core.js` resets type state on its path; metadata
isolation must be explicit so repeated synchronous compilations cannot leak
owner declarations across calls. A value bearing `{tag: "Text"}` is forgeable and is not
proof it came from either declared `Label`.

**CDC disposition required before implementation:** choose runtime owner/case
encoding and equality semantics. Candidate classes for comparison include a
stable serializable owner-and-case discriminator in data, a private nominal
brand, or a hybrid brand plus serializable descriptor. A textual descriptor
can distinguish owners when correct but remains forgeable; an object identity
or symbol brand can resist ordinary forgery but does not survive JSON or
structured clone without reconstruction. No option is selected by this draft.
Both constructor values and pattern checks must use the same selected
representation. The zero-field constant must be unique for its owner/case;
fielded calls produce a fresh payload value unless CDC chooses interning.

Typing has distinct stages. Static checking rejects a known constructor/case
from the wrong owner. In checked output, construction checks declared payload
types and pattern dispatch checks the actual owner/case membership using the
chosen runtime encoding. This membership check is stronger than the current
generic `object && "tag" in value` fallback; do not describe that fallback as
nominal typing. Under `strip_assertions`, runtime type/payload assertions may
be removed according to existing policy, but the match's case-selection
semantics must still select the correct branch. Whether runtime owner-membership
checks are classified as removable assertions or essential dispatch is an
explicit CDC choice. Exhaustiveness and recursive validation are not promised.

Keep three mutation questions independent:

1. **Namespace mutation:** recommendation is read-only constructor members so
   replacing `Label.Text` cannot silently change the meaning/identity of an
   already compiled constructor. CDC must decide whether to freeze/protect the
   public namespace or merely emit immutable bindings, and how dynamic escape
   interacts with this.
2. **Payload mutation:** recommendation is ordinary mutable JavaScript data
   for payload objects, preserving current object behavior. Immutability of a
   Lykn binding does not deep-freeze the object. This is independent of the
   namespace choice.
3. **Trusted intrinsic hygiene:** generated checks must not assume mutable,
   shadowable globals are pristine. The Arc03 protected-host v1 contract
   protects only global `Reflect` and exact `Reflect.apply`; it does not grant
   `Object`, `Symbol`, `Object.freeze`, `defineProperty` or other host values
   trusted status. If a chosen layout uses those, CDC must decide whether to
   avoid the intrinsic, capture it under the existing protected contract, or
   propose a separately scoped host-contract extension. Do not silently use a
   shadowable `Object` or assume prototype methods are safe.

Potential counterexamples that the eventual checks must distinguish:

```js
const forged = { tag: "Text", value: "x" };
const fromOtherModule = { tag: "Text", value: "x" };
```

Neither spelling alone establishes membership in a particular `Label` owner.
Rejection/acceptance depends on the CDC-selected owner encoding and assertion
mode, with explicit expected verdicts frozen before implementation.

## Serialization and copy behavior

Serialization is not object identity. `JSON.stringify`/`JSON.parse` creates a
new plain data object, drops unsupported JavaScript values, and does not
preserve symbol/private brands. `structuredClone` also produces a new object
and does not preserve arbitrary instance identity. A string owner/case
descriptor can survive data serialization but is still forgeable and needs
validation against a known interface. If CDC selects non-serializable nominal
branding, decoded values are ordinary untrusted data until explicitly
reconstructed by a generated/public constructor or decoder that validates
owner, case and payload. The contract must state that transition; it must not
claim identity round-trips. Tests should separately cover source construction,
JSON data copy, structured clone where supported, and reconstruction.

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

Current corpus uses legacy unqualified forms such as `Option`, `Some`, and
`None`; zero-field `None` is a bare constant. Native TypeRegistry keys
constructors by bare name and rejects repeated user case names across types;
the public registry is also keyed by bare constructor. Native emitter creates
flat bindings and DTS emits a union with textual tags plus separate
constructor declarations. Existing imports support named/aliased bindings;
`skills/lykn/SKILL.md` bans surface namespace imports and `export *`.
Qualified type access as `Label.Text` must not be used to imply that Lykn
namespace imports are newly legal.

**CDC compatibility decisions:** whether bare constructors remain accepted
as legacy syntax; how collisions between old bare names and new namespace
bindings are diagnosed/migrated; whether raw JS `tag` shape remains supported;
how old serialized values are decoded; public JS export names and `.d.ts`
shape; and deprecation/version policy. Recommendation: add qualified local
bindings without changing unrelated member syntax; emit explicit named exports
for the type namespace where the package API supports them; keep namespace
imports out of Lykn source syntax. If an implementation layout needs an ESM
namespace import internally, distinguish that compiler-generated edge from
surface syntax, scope it to a module boundary, and include its export and DTS
plan before approval. Current source search shows no `ImportNamespaceSpecifier`
support.

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
imports and exports, but provide no cross-module imported type-owner oracle.
Actual callers in source docs and prelude therefore require a migration
inventory during implementation; no use count or “no breakage” claim is made
by this design. Keep Project07's book/human review and Project03's API/docs
audit as separate gates.

## Proposed acceptance checks (not run)

Before implementation, CDC dispositions must freeze identity, guard, metadata,
serialization, mutability, name-collision and migration decisions. Then
source-level checks should include: two modules each declaring `Label.Text`;
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
