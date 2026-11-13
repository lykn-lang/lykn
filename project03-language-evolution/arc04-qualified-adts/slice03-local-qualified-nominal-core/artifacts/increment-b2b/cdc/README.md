# B2b independent read-only identity/hygiene census

Sol6.1High,2026-11-13. Source inspected at clean
f9be7cb85f62513f1624964fcc6773bffe4f66fe,
tree0ea27d21f759e0c068e8f655b14f43a1a5f20452, branchcodex/qualified-adt-core,
source home `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Operator has resolved B2-ID-NAME: distinct Lykn spellings identify distinct
bindings. Root owns policy/design/source; this is a bounded API/caller census,
not implementation architecture selection or software acceptance. No source
edit, build/test, Git/index/ledger mutation or new research helper. Root-owned
b2b-owner-unit-preparation.md was not edited. All A/B1/IC/B2-LX acceptance and
remaining LC/S03 limits survive.

## Existing binding identity and output naming are separate concerns

| Seam | Source facts at held pin | Constraint for root recipe |
| --- | --- | --- |
| Native lexical links | ast/sexpr.rs16–53: NameRes has Unresolved/BindingDef/BindingRef only; AtomData privately stores source value/span and dispatch tag, completion identity, host-request/reference metadata. resolver.rs334–355 identifies the exact definition occurrence then compares scope String names to the whole raw atom spelling, cloning with a dispatch tag. It does not retain which declaration a reference selected. | Existing tags can preserve dispatch; they cannot distinguish two different same-spelled lexical declarations or select different emitted names for normalized collisions. Ordinary value refs and colon roots need their selected lexical binding too, not only call heads. |
| Public lexical links | expander-core.js744–753 carries Set<string> bindings plus per-call type context. binding.js42–64 clones/extends source-name Sets. tagDefSites842–851 writes binding='def'; head gate1989–1991 writes binding='ref' for exact head.value in scope. Non-head value refs are returned directly1903+, not linked to a declaration. | A new identity cannot be inferred from the existing def/ref string property or Set membership alone. Existing binding/lexical-region helpers already identify actual sites and precise scope transitions; root can reuse those facts without reintroducing aggregate clause/member scopes. |
| Native emission | codegen/names.rs185–225 emits identifiers by to_js_identifier(raw text), splitting colon roots from member suffixes. codegen/emit.rs90–99 uses that path; direct binding/pattern/name writer sites also normalize strings383/410/1095/1217+. | Changing source lexical lookup alone leaves JS capture/declaration collisions. Changing DD-49 globally would also alter property/import/export/keyword spelling. |
| Public emission | compiler.js1743–1821 maps ordinary atom text directly to ESTree Identifier, handling colon root separately from member tails. Function/generator declarations782/807, class IDs1173/1183, params/patterns and other direct sites also use toJsIdentifier. | Output naming must reach actual emitted binding AND reference sites, including direct writer helpers; wrapping compileExpr alone misses declaration/pattern writer paths. |
| Existing collision diagnostics | Native analysis/scope.rs80–115 keeps source-name bindings plus per-level js_names and errors for different source spellings with same normalized output IN THAT SCOPE. reference/lookup127+ use exact raw names. Nested scopes intentionally have separate js_names (tests389+). Public binding.js895 validates normalized reserved/strict words only; no matching same-scope collision allocator is present there. | Existing collision policy/diagnostics require explicit root disposition; nested valid distinct-source references already need hygiene independently of same-module/export-collision policy. The source-only operator choice is not itself an implementation of a module export ABI. |

## Reusable private allocation facilities and their limits

- Native ast/sexpr.rs completion_value_atom/finalize_completion_value249–323
  carries private CompletionValueId by value through clones. EmitterContext24+
  owns counters. emitter/forms.rs352–400 finalizes one emitted name per identity
  after collecting normalized names/colon segments4336–4354 from the whole
  emitted unit. emitter/mod.rs27–40 invokes finalization after raw emission.
  This is an existing generated-result identity facility, not a source binding
  table; EmitterGensym::next is only a deterministic text counter.
- Public compiler-private-atoms.js33–48 is a dependency-free WeakMap of atom→
  {identity,prefix}; expander-core.js763 creates marked atoms. emittedNames1247+
  reserves normalized atoms/colon segments; finalizeCompilerPrivateAtoms1263+
  maps identity+prefix→one collision-free name, mutates value and clears marks.
  pass2ExpandAll2396–2415 and expandExpr1855–1870 finalize at their own complete
  boundaries. The counter is an invocation-presence sentinel, not a unit/binding
  identity. Cloned ordinary syntax854+ is per occurrence; true private atom/
  host/kernel/expanded-Reflect identities are deliberately retained.
- Native/public host-reference lowerers independently reserve names and allocate
  aliases (codegen/host_references.rs35–61, compiler.js29–85). New source output
  names must compose with those reservations and completion/Reflect names;
  fresh source allocation must also avoid capturing unresolved ambient roots.
  Reusing a normalized spelling as binding identity would contradict the new
  policy even if the alias allocator itself chooses safe suffixes.

## Native late parsing/emission transport doors

Metadata on source AtomData alone is insufficient unless these doors retain it:

- SurfaceForm::Bind stores `name:SExpr` (ast/surface.rs258), emit_bind2813–2846
  clones the name atom. Class name is likewise retained SExpr:
  emit_class_form4999–5020 accepts Option<&SExpr> and calls emit_expr. These
  are NOT inherently string-loss paths.
- Named Func/Genfunc store name:String plus span (ast/surface.rs269+);
  TypedParam11 stores name:String/name_span; Pattern::Binding/Constructor184+
  and Constructor175 store names as Strings. param_to_kernel_names3387–3455
  recreates fresh atom(&tp.name); function/type/pattern emission similarly
  creates new names. Raw default/body expressions remain SExpr and later pass
  through emit_expr/classification. A recipe must cover both retained atoms
  and reconstructed binder/reference atoms, not assume all forms preserve an
  input node or every name is already a String.
- dts.rs normalizes its own raw declaration/parameter/field names (42/55/94/
  113/170/196/330/349). A changed emitted local vs exported name needs a coherent
  declaration/export contract; this existing independent writer is a carryover
  boundary, not proof of current identity transport.

## Property/member/import/export slots must stay distinct

- Native names.rs203–225 and public compiler.js1775–1817 split colon chains:
  first segment is a value root; later segments are property names. Native
  resolver334's whole-value comparison currently does not link a colon root.
- Native emit_object1203+ and public object1464+ use one shorthand spelling for
  both property key and value. Object patterns use the same shorthand coupling
  (native403+, public1926+); alias slots separate key from nested leaf. If the
  local value/leaf is renamed, the property key is still its structural key.
  Class method/field keys are separately normalized (JS toClassKey144+), not
  ordinary lexical references. Keywords/string/computed keys retain their
  existing respective contracts.
- Public buildImportSpecifier90–109 explicitly has imported vs local fields;
  buildExportNames112–140 has local vs exported, including aliases/reexports.
  Native emit_import_specifiers1620–1643 and emit_export_names1707–1732 currently
  call emit_expr for both alias slots, and a shorthand prints one atom once.
  A role-aware change cannot treat remote/imported/exported spellings as local
  binding identities or silently change stable property/module names. Direct
  exported declarations also need their local binding vs external name policy
  made concrete by root. This census selects no export policy.

## Serialization/bridge preservation boundaries

- Native macro protocol env.rs306–331 emits only atom type/value; its decoder
  protocol_json_to_sexpr340+ creates SExpr::atom with default span, no resolution
  or private metadata. diagnostics/serializer.rs5 serializes only textual name.
  They are source/macro transport, not a private-identity channel.
- Native kernel emitter/json.rs19–31 serializes only atom type/value and refuses
  unfinished owned host references. emit_module_json67 lowers host refs first;
  completion names were finalized by emission. CLI compile.rs205–218 selects
  JSON vs native JS only AFTER classification/analysis/emission; with-DTS path
  has its own output pair. Any identity still required at this bridge must be
  finalized to ordinary output text or transported by an explicitly trusted
  private mechanism; source/JSON fields cannot manufacture private authority.
- Public WeakMaps do not survive JSON/structuredClone. Existing ordinary node
  spread copying keeps enumerable def/ref tags, while cloneOccurrenceSyntax854
  returns identity-bearing private nodes unchanged. Public compile2220 lowers
  host refs and validates the complete kernel unit before AST generation;
  compileExpr remains a separate fragment entry. A new transport must state
  when metadata is consumed and how raw/fragment/JSON callers are handled.

## Bounded prerequisite surface, without selecting storage or phase

The source facts require a usable source-binding/reference→emitted-identifier
path before owner activation can claim the new policy: exact lexical binding
selection, stable linkage across cloning/late header parsing, collision-safe
output for selected bindings/reads, ordinary/member/import/export role
separation, and honest JSON/fragment/full-unit boundaries. Existing precise
B2-LX regions and private generated-name allocators are reuse points; neither
by itself supplies source binding identity. Rewriting raw source value strings
before the remaining semantic classifiers would erase the very source spelling
those classifiers/diagnostics compare, so its ordering/transport must be explicit.
This is a constraint list for root's smallest usable prerequisite, not a choice
of owner storage, unit API, allocator scope, export ABI or pipeline phase.

Readiness/implementation/software acceptance remain separate. Root-owned design
will receive a later independent read-only recipe check. No current build/test
or name-semantics runtime parity claim is made by this census.

## Iteration14 B2b1 native owned-unit readiness — read-only

Read complete cc-prompt-iteration14.md against f9be7cb8/tree0ea27d21.
**Source-ready; no concrete contradiction found.** This is readiness only,
not a software verdict, API acceptance, name-hygiene implementation or owner
activation. No edits/build/tests/source Git/archive changes were made.

- analyze387–416 has a finite packaging seam: prelude registration, collect
  all forms, per-form check then track, mark exports, collect scope diagnostics,
  and Severity::Error test. Moving the original Vec into a private success
  unit after that same algorithm can retain all diagnostics/order and avoid
  reclassification or an extra whole-tree clone. Failure can preserve the same
  complete vector while Display filters original error Diagnostic formatting,
  which already includes line/column and suggestion (diagnostics/mod.rs20–36).
- Canonical emitter::emit27–50/emit_json213–221 and module DTS201–302 can obtain
  matched immutable forms/registry from the unit without changing emission,
  host/completion finalization, error channels or output order. Low-level
  emit_form/context, leaf DTS helpers, emitted-kernel JSON and codegen remain
  explicitly outside the new whole-unit safety claim.
- Complete production caller paths are compile.rs186/257 and dist.rs239.
  compile maps errors to CompileError::Analysis with only Error diagnostics;
  successful output prints Severity::Warning. Dist maps analysis Error text to
  DistError::Io/InvalidData with original source path and currently prints NO
  analysis warnings, only DTS warnings267+. Preserve that existing asymmetry
  under the draft's 'exactly as before' requirement; do not add dist warnings.
  compile_with_dts already emits kernel and declarations from one classified
  input; borrowing one success unit retains that ordering and write behavior.
- cross_compiler.rs19–63 and e2e_tests.rs21–65 manually register types and skip
  analysis; inspected source cases are ordinary analysis-valid forms. Migration
  must actually call analyze and fail normally if its assertion discovers an
  invalid preexisting fixture; no skip/bypass registry is permitted.
- Complete emission_results.rs read: whole-unit nested malformed child tests
  classify only outer forms, while the preserved current analyzer does not
  recursively classify those bodies/Obj children. They appear analysis-valid
  and can retain nested Classify/Codegen message/span/suggestion assertions
  after unit preparation. Raw emit_form failure/recovery/owned-reference and
  multi-clause fragment tests remain raw; no fragment contract is weakened.
- check_strict76–109 currently stops after classification; retaining that is
  explicit bounded scope, with semantic-unit join still due before activation.
  Source/docs query found the error-handling guide names the fallible emitter
  entrypoints but does not expose the old forms+registry call shape there.

The independent same-Entry/two-owner units, interleaved JS/JSON/DTS/runtime,
failure diagnostics plus recovery, and compile_fail private-construction/old-
API examples are meaningful proposed proofs of this ownership boundary. They
are not owner identity, qualified nominal isolation or new source-name semantics.
Root retains storage/API design; all accepted prerequisites and LC02–08 remain.

## Immutable f9 kernel role/helper addendum — during B2b1 CC ownership

All source reads for this addendum used `git show f9be7cb8:path`, never mutable
analysis/emitter files while CC owns source/build. No runtime/build/tests,
source/design/ledger edits or new helper. These are accepted writer shapes and
existing traversal facts, not a storage/phase/forward-policy selection.

### Concrete local-vs-structural slots

| Kernel shape | Local/value role vs property/API role | Immutable source |
| --- | --- | --- |
| `(object local)` | One shorthand atom currently supplies BOTH normalized key and value identifier. A distinct emitted local requires preserving the key independently; it is not sufficient to rewrite that atom's sole text. | Native codegen/emit.rs1203–1218; public compiler.js1464–1480. |
| `(object (key value))`, `(object ((computed key-expr) value))`, `(object (spread source))` | Pair key is structural; value is executable. Computed key expression is executable; spread operand is executable. Colon member roots in those expressions are lexical values, not their suffix names. | Native1203–1259; public object lowering1490+; native semantic_roles.rs32–64 ObjectPropertyRole::{Shorthand,Value,Pair,Dynamic,Computed} already identifies these raw property shapes. |
| `(object local)` in binding/pattern position | Shorthand couples property key and local binder. `(default local value)` couples the key and binder again, plus an executable default. `(alias key local)` / `(alias key local default)` already separates key from binder/nested pattern and optional executable default. | Native emit_pattern377–400, emit_object_pattern403–441, emit_default_pattern1351, emit_alias_pattern1370; public compilePattern1872–1920 and compileObjectPattern1926–2028. |
| `(array local _ (rest tail))` pattern | Element/rest targets are binders, `_` is a hole in arrays; no object property name is involved. Generic default patterns distinguish target and expression. | Native emit_array_pattern443+, emit_rest_pattern1361; public compileArrayPattern2037+, compilePattern/default1898+. Existing BindingPattern projection already handles producer slots. |
| `local:member:-private` | Root is a lexical value; later segments are public/private property names, independently normalized. A local allocation must not rename the member or a class property declaration just because spelling matches. | Native codegen/names.rs203–225; public compiler.js1775–1817 and toClassKey144–150. |
| `(import "m" local)`, `(import "m" ((alias remote local)))`, `(import "m" local (specs...))` | Default local is a binder. Named imported remote name is an API spelling; alias local is a binder. Shorthand imported name currently doubles as local. Module string is structural. | Native emit_import1569–1618/import_specifiers1620–1643; public import885–944/buildImportSpecifier90–109. Native binding.rs1016–1064 already enumerates default and alias LOCAL slots only. |
| `(export (names local (alias local external)))`, `(export "m" (names ...))` | Local export slot references a local only when not reexporting another module. Exported name is API spelling; reexport names are remote. Shorthand currently shares one spelling. Direct declaration/default export local scope follows accepted B2a consumed-slot facts. | Native emit_export1645+/emit_export_names1707–1732; public buildExportNames112–140/export946–1000; shared enclosing_declaration_sites/enclosingDeclarationSites retain actual normal/default declaration-slot policies. |
| `(label target body)`, `(break target)`, `(continue target)` | Label namespace is separate from ordinary value identity. Its textual target must not become a value reference because a same-spelled local exists. | Native binding.rs156–157/181–190/1004–1014 explicitly marks Label D2-only/non-value; public binding kind and label lowering compiler1263. |

A supported-shape limit matters: public compilePattern1918 explicitly rejects
`alias` outside an object pattern; compileObjectPattern1990+ owns the alias
key/local/default shape. Native emit_alias_pattern1370 has no context restriction
and mechanically prints key:pattern. Thus an alias in an array pattern is not
proven a common valid JS-emission shape. Earlier typed nested-array alias tests
were source-only projection/host-policy evidence with runtime-emitter concerns
carried; do not expand accepted array alias grammar as a side effect of hygiene.

### Existing traversal helpers and actual forward behavior

- Native resolver ScopePlan117–151 covers Sequence, Body, GroupedBind,
  Conditional, Call, Match, SourceFunction and Class. `scope_plan` delegates to
  actual dispatch+occurrence work167+. Body_start keeps loop iterable/scrutinee
  outside its binders281–291; grouped initializers resolve before that pair's
  names enter scope740–767. Actual Call is independent operands, despite the
  older Sequence enum comment mentioning calls. Use the executed variant logic,
  not that stale descriptive shortcut.
- Native binding.rs BindingOccurrence/BindingSite and explicit TypedParameter vs
  BindingPattern projection617/858/944 supply binder roles; Label.shadows_values
  false, import locals1016+ and actual enclosing-declaration sites preserve
  kind/span. lexical_regions.rs20–61 names parameter/default/pre/body/post,
  base/member/field-init paths by original occurrence indexes. These are role/
  scope reuse points, not a general resolved-value reference graph.
- Public bindingScopePlan459+ similarly selects class/function layouts,
  real do/block/seq, conditional and body regions; walkSequenceReturning60–67
  extends exact source names from actual declarations AFTER walking each form.
  Function/member defaults and TypedParameter/BindingPattern are already
  producer-specific. Separate object writer roles and shorthand keys must not
  be inferred solely from recursive atom or binder enumeration.
- Native resolve_seq300–325 and public pass2ExpandAll2396–2415 extend incoming
  environments only after each actual sibling; neither precollects a complete
  forward declaration→reference table for ordinary values. A named function
  receives its own recursion binding before its own body. Current public value
  atoms return unchanged; native earlier value atoms remain Unresolved until
  a binding is in incoming scope. Writers still emit those value spellings as
  ordinary JS identifiers. Consequently JS's declaration hoisting/TDZ can act
  on such output, while an earlier form/macro-shaped CALL may already have
  expanded under the original incoming dispatch scope. This is source-inspected
  behavior, not a fresh runtime forward-semantics proof or a new policy.

The subsequent recipe therefore needs an explicit distinction between actual
expansion-time dispatch visibility and eventual selected value-binding/name
transport, with structural keys/API spellings preserved. This addendum does
not decide which pass/storage or exact forward semantics should implement it.
Original accepted prerequisites and LC02–08/S03 scope remain unchanged.
