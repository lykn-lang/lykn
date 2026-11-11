# B1 — public per-call type context

**Source-ready B1 recipe; software not implemented or accepted.** Root's bounded first B increment
removes the actual shared public type registry before qualified activation.
All LC-02 obligations stay open: typed OwnerRef/CaseRef, lexical owners/aliases,
forward references and nominal runtime are later B work. This does not reduce
S03 scope or substitute a mutable field-name Map for the final typed design.
A is independently accepted at 5caf3d87. Execute only under root's numbered
iteration04 assignment against that exact corrected pin.

## Source facts and applied guidance

Root inspected immutable 16dcd64f, supplemented by Sol's read-only caller map.
Correction02 is expected to leave these compiler JS inputs unchanged; verify
the actual accepted candidate before issue.

- `surface-helpers.js::typeRegistry` is a module-global Map from short case
  name to field-name array. `classifier.js::emitTypeMacro` writes it;
  `compilePattern` reads it. Explicit resetTypeRegistry/resetMacros clears it,
  but ordinary expand calls do not. A successful or failed compile can affect
  a later call, and an inner compilation can overwrite the outer one's map.
- Public complete expansion enters `expandWithMacroImports` and
  `pass2ExpandAll`. Public `expandExpr(form, env = EMPTY_ENV)` is a separate
  single-form boundary without Pass-0/Pass-1 registration/import behavior.
  Internal recursion already uses expandAt rather than the public wrapper.
- The core imports `extendBindingEnv as extendEnv`; its current environments
  are Sets. Seven explicit env.has sites cover direct/computed calls and the
  lexical dispatch gate. `classifier.js::emitMatchStatementMacro` separately
  constructs a clause Set. Those sites must preserve the shared context while
  extending names.
- `emitSurfaceForm` is called at the direct-bind path, grouped binds and the
  ordinary classifier path. Three statement/direct/result match adapters call
  emitMatchStatementMacro separately. Updating only the ordinary path misses
  real nested scopes and completion cases.
- `./surface.js` is an actual JSR export; resetTypeRegistry removal is a public
  export change. surface-helpers and the proposed context module are compiler
  dependencies, not new public JSR entrypoints. Native core has its own fresh
  registry and is not changed by this bounded JS state repair.

| Read guidance | Applied decision | Why/proof |
| --- | --- | --- |
| JS values/references ID-02, SHOULD: shared identities make mutation visible | Share one type context deliberately within an expansion; allocate another at each public call | Successful, failed and re-entrant compilation oracles distinguish cross-call mutation |
| ID-04, MUST: const does not freeze referenced data | A new const binding is not isolation; create a new Map and fresh seed arrays per call | Inner compile must not overwrite outer case field mapping |
| ID-06, SHOULD: copies are shallow | Copy lexical binding sets with the existing helper; preserve context identity only inside that unit | Function, catch, grouped-bind and separate match-clause gates retain context |
| Existing A/S02 private metadata discipline | Change environment plumbing, not AST cloning or macro/lowering order | Private atoms, host refs and Reflect anchors retain their current identities and behavior |

Do not use a global active context, clear-on-entry/finally-reset, or global
save/restore. These retain re-entrancy hazards and obscure ownership.

## Binding API and state decisions

Add a dependency-free private module `packages/lang/surface-type-context.js`.
It exports a creator for compiler consumers, without adding a deno.json
entrypoint. Recommended JSDoc shape and binding lifecycle (sketch, not executed):

```js
// One legacy field-metadata context, used only within one public expansion.
// Every creator invocation allocates both the Map and its field arrays.
function createSurfaceTypeContext() {
  return { constructors: new Map([
    ['Some', ['value']], ['None', []],
    ['Ok', ['value']], ['Err', ['error']],
  ]) };
}

// Private core environment; existing public expandExpr still accepts a Set.
function createExpansionEnvironment(bindings, typeContext) {
  return { bindings: new Set(bindings), typeContext };
}
function extendEnv(env, names) {
  return {
    bindings: extendBindingEnv(env.bindings, names),
    typeContext: env.typeContext,
  };
}
```

The prelude entries are field metadata only: do not introduce runtime values,
namespaces or bindings. Existing user declarations overwrite these metadata
entries as before. Current legacy declaration/constructor syntax and fallback
semantics remain for this checkpoint; qualified B later removes that fallback.
There is no persistent context to reset.

**Explicit normalization selected by root:** the old never-reset module starts
with an empty Map; only resetMacros seeds the prelude metadata. Ordinary
registerSurfaceMacros does not. Seed each fresh unit consistently from the
old explicit-reset baseline, matching the existing native analysis metadata.
This deliberately removes reset-history-dependent extraction behavior; it is
not byte-preservation of old cold positional fallback. Add a focused fresh-
process cold control with a prelude-shaped object whose inserted decoy property
precedes value: extraction must select its named value field. Keep this legacy
checkpoint's tests in the later qualified migration census; they do not promise
that plain tagged data will remain nominally accepted after B2.

At each complete expand boundary create one context and one private environment
for pass2. At each public expandExpr boundary independently create one context
and copy its supplied binding Set. Internal expandAt recursion and child scopes
share that context through explicit environment values. Do not change public
expand/expandExpr argument/result contracts, macro registration/reset behavior,
strict policy, or add stripping/module/interface options in this increment.

Change the core's env.has reads to env.bindings.has. Keep binding.js's public
Set helper unchanged; import extendBindingEnv under its own name and implement
the local wrapper. Replace classifier's direct clause Set creation with an
explicit extendEnv callback supplied by all three core match adapters. Its
clauses remain separate environments with the same unit context.

`emitSurfaceForm(node, helpers)` receives helpers.typeContext from every core
call site. Pass that explicit dependency to TypeDef, Match, IfLet and WhenLet
producers and their recursive pattern helpers. Recommended private signatures:

```text
compilePattern(pattern, target, { typeContext })
compileLetPattern(pattern, target, { typeContext })
emitTypeMacro(args, { typeContext })
emitMatchMacro(args, { typeContext })
emitMatchStatementMacro(args, { ..., env, extendEnv, typeContext })
```

Registry consumers use typeContext.constructors. No helper reads a default
global or creates a hidden second context inside the same expansion. Private
direct test consumers explicitly create/pass a context; absence where required
gets a descriptive TypeError. Helpers that do not consume type metadata need
no new failure behavior. These internal changes do not create a public context
injection API. Fully lowered kernel still needs no type context.

Remove the exported global typeRegistry, resetTypeRegistry and its import/call
from resetMacros. Preserve resetMacros' actual macro clearing/re-registration
behavior and resetGensym's separate semantics. Record the removed surface.js
export for S06; do not retain a misleading no-op reset API. No global macro
state isolation or rollback is promised here.

## Concrete route and proof

1. Add the private creator, adapt the core environment and all extension/read
   sites, and wire every actual producer/statement-match adapter. Change the
   small registry producer/consumer signatures in classifier/surface-helpers.
   Remove surface.js's global reset API. Do not reorganize unrelated helpers or
   reformat legacy files wholesale.
2. Build a discriminating public regression first. Use a unique legacy case
   with one registered field name; compare a later compile's actual runtime
   result against its own cold baseline after a separate successful compile
   registers that case. Arrange object property order so leaked named-field
   extraction differs from the untouched baseline. Do not enshrine a desired
   result for the positional fallback: the oracle is equality to the independent
   baseline. Repeat after a compilation that registers the type then throws a
   later source error, without calling resetMacros/resetTypeRegistry.
3. Exercise re-entrancy in a normal product JS test: install one uniquely named
   macro callback through the existing private macroEnv used by compiler tests.
   The outer source declares a case field named outer; the callback invokes
   normal lykn() on an inner declaration of the same short case with a field
   named inner, then returns a plain literal AST. The remaining outer match
   must extract outer and produce the exact outer marker. Include an inner
   failed compilation variant. Restore only that callback's previous entry in
   finally; do not reset global macros or simulate context save/restore.
   This is compiler product testing, not a JS research helper.
4. Cover public expandExpr separately and preserve a caller-provided binding
   Set unchanged. Existing complete expand registration/import behavior stays
   distinct. Run nested value/direct/statement match, if-let/when-let and the
   S02 macro-hygiene/completion/Reflect controls so no context path is missed.
   Retain the pre-fix discriminating failure rather than a claim inferred only
   from source deletion or a factory-new-Map test.
5. Copy changed canonical modules and the new module into the actual embedded
   package. M6's seven-file union grows to nine: add both changed surface.js
   and new surface-type-context.js;
   retain config/lock, cold copied CLI and no-canonical-fallback assertions.
   Exercise per-call isolation through the materialized lang/ mapping as well
   as canonical source, and browser compile returning ESM text. Do not confuse
   browser compile with eval-based run/load fallback limitations.
6. Run meaningful focused regressions before full make check, browser 80 KiB
   and committed-HEAD citations. No new dependency, runtime helper, nominal
   namespace, private purity or JSON research probe is introduced. Use Lykn
   for new research tooling; ordinary compiler/product JS tests are allowed.

Keep the already approved S03 B/C remainder intact. This usable state repair
is independently checked as a partial LC-02 foundation; it cannot close LC-02
or S03, and it chooses no optimizer layout. Exact source pin, test homes,
source-role preservation and final author readiness are required before root
issues implementation.

## Bounded preparation review and package wiring

Sol's separate immutable-source review found no fundamental scope/re-entry
blocker and supplied the following corrections, adopted by root before issue:

- The M6 union is nine, including changed surface.js as well as the new module.
- Fresh seeding intentionally normalizes never-reset cold behavior; the
  explicit disposition and ordered-object control above are binding.
- Failed-compilation leak probes must fail in later Pass 2 after type emission,
  such as a later malformed not form. An early reserved-name, import/Pass-0 or
  macro-registration/Pass-1 failure does not prove the registry was populated.
- Preserve the existing direct non-metadata Not emitter test at
  dd-37-classifier-pilot.test.js: it passes only sym/array helpers and needs no
  type context. Do not introduce a new error on that unrelated path.

| Actual packaging route at 16dcd64f | Wiring for the new private module |
| --- | --- |
| embedded.rs recursively includes the crate-owned embedded directory | Add the byte-identical embedded copy |
| CLI build/dist recursively copies .js files | Existing recursive route includes it |
| npm dist file list includes *.js | Existing pattern includes it |
| JSR deno.json exports explicit public entrypoints | Add no public entrypoint; retain it as a local compiler dependency |
| browser bundle resolver follows relative dependencies | Use the existing relative import route |
| M6 comparison list is explicit | Expand the actual union to nine files |

Root verified the accepted A pin 5caf3d87 and the exact relevant JS delta from
16: only the implicit-return branch changed, leaving this caller map valid.
Final separate Sol preparation review supports iteration04 after the nine-file,
cold-normalization, late-failure and context-free-helper clarifications.
No software criterion follows from this readiness review; source authority is
the issued numbered prompt. Typed/nominal B/C obligations remain open.
