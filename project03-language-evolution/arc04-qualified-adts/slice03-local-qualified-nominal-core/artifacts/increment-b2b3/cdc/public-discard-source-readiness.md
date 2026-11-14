# Public discard caller/consumer census — source759567f9

Read-only independent Sol6.1High source-readiness for root's next recipe.
Source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/qualified-adt-core`, HEAD759567f92bd145b5fbd0fbd4273aef368e52aeba,
tree52dd6558eba4a5e9fe057dd03c368327ea578662. Public files remain those of
accepted57c76c99. Root owns source/build/design; no test/build/source/Git/index/
ledger mutation or public software acceptance occurs here. Some guessed source
module paths in read queries did not exist; actual definitions below were
located in expander-core.js, not a separate dispatch/child-role module.

## Parsed callable coverage and schema separation

The complete `paramNameNodes`/`paramTypeChecks` caller query under packages/lang
finds these consumers in classifier.js (definitions surface-helpers261/311):

| Callable | Actual lowering caller | Important consumed behavior |
| --- | --- | --- |
| Fn and Lambda | Fn681; classifier212 maps both to Fn | parseTypedParams, separate pattern/check walks; arrow body shape depends on checks/body count. |
| Single Func | buildSingleClauseFunc841, parse856, pattern858/check865 | checks before pre/body/post/return; source shorthand Func has no parsed params. |
| Multi Func | buildMultiClauseFunc1001, parse all clauses1011; binding1121/check1132 | sort by arity/type count; destructured uses paramNameNodes, SIMPLE uses p.name directly. |
| Genfunc | emitGenfuncMacro1221, parse1251, pattern1253/check1260 | generator checks execute in body; pre/yield instrumented; post/returns ignored; real multi rejected1234. |
| Genfn | GenFn779, parse791, pattern792/check795 | shared genfnBodyLayout selects body; keyword yields instrumentation; ignored payload remains inert. |

`paramNameNodes` recursively handles fields/nested aliases, defaults, simple
rest and p.rest array collection. `paramTypeChecks` recursively handles nested
leaves, then existing non-any alias guard (selector spelling); preserve its
existing annotation semantics rather than claim this increment fixes them.
Two concrete backend-specific constraints for root's recipe:

- surface.js173 stores nested array `rest={typeKw,name}` WITHOUT isRest.
  surface-helpers315 includes p.rest in allFields, then340 calls ordinary
  buildTypeCheck on the collection. It does not take simple isRest's per-element
  path at345. A native-like nested-rest runtime contract needs an explicit
  disposition of this actual public path; source fact, not runtime reproduced.
- Multi SIMPLE p.name at1125 ignores its default/isRest pattern metadata.
  Do not infer new public top-level-simple multi default/rest support from a
  shared preparation refactor. Supported nested destructuring is a separate
  route. Exact-arity/type dispatch remains the existing algorithm.

Type schema emitter1527–1600 also uses parseTypedParams (1560), but DOES NOT
call either param helper: fields.map(f.name) builds constructor signature,
buildTypeCheck(f.name,...,'field') guards, and f.name.value is the object key.
Thus shared parser is not authority to turn constructor field `_` into discard.
The ordinary schema local/property linkage must survive unchanged.

buildTypeCheck surface-helpers164 uses paramNode.value as diagnostic display;
both predicate and typeof already reuse the actual paramNode object. Separating
source display from a prepared private actual must retain that object, including
its WeakMap capabilities. Public lykn/mod23 and browser compileLykn14 accept
strict only; there is no public strip-assertions option to infer or add here.

## Bind/export structure and actual sibling visibility

classifier458 emitBindKernelArgs emits const alone for untyped/:any/literal
matched binds. A typed NONLITERAL creates `(block const check)` at478, not
ordinary sibling statements. BindGroup729 maps pairs through that helper;
expander2029 handles grouped expansion itself and advances cur with SOURCE
bindingNamesInPattern after each pair. Ordinary non-group typed bind takes
normal emitted-kernel expansion at2073. A block is a real lexical boundary in
compiler output, even though bindingScopePlan468 describes its child sequence.
Root owns the bounded actual baseline runtime probe; no result inferred here.

There is no Source Export AST/classifier case. export is a kernel form and
falls through expander's ordinary children-plan path2289. childRoles1235 gives
one non-names declaration child Value; expandChildrenPlan's Value child goes
through expandSingle (Single result slot). Actual compilerExport1001 supports
default/reexport/names/single atom/declaration. Its declaration branch1047
wraps compileExpr(child,'expression') as ExportNamedDeclaration without a
separate source Bind/Group lowerer. Typed Bind's block and grouped multiple
results therefore require explicit source-level slot/sequence handling; do not
blindly wrap every support statement or rely on a block to expose live names.
`buildExportNames`112 supports an empty list (empty specifiers) and source/local
aliases. Existing arity/consumption differs from native permissive extras:
public declaration requires args.length===1; default/reexport require2.

Shared `bindingNamesInPattern`840 projects actual source sites and excludes
scalar `_`. The classifier-local namesInPattern350, used only by grouped
validation, differs: missing alias, default recurses child2 (RHS) rather than
BindingPattern child1, no spread. This is not interchangeable with shared
projection when collecting source exports or asserting duplicate coverage.
Shared patternNames also presently lacks spread and default minimum-extent
checks; root must align any changed pattern-writer consumption deliberately.
No native malformed-admission rule is presumed to exist in public parseBindGroup.

## Private markers, environments and phase boundaries

- compiler-private-atoms33 marks WeakMap metadata {identity,prefix}; private
  identity is object-owned, not spelling. formHead23 excludes host refs/binding
  tags, not private markers by itself.
- binding846 filters a ROOT private pattern atom. But kernelParamNames676
  directly pushes atom params, and patternNames858 directly pushes nested
  array/object atom members, without isCompilerPrivateAtom. These are concrete
  holes for new prepared private parameters, despite alias/rest/default targets
  recursively taking the already-filtered root path. Other direct projections
  (kernel named function665, class704/712, imports/type constructors) are separate
  source roles, not evidence that new callable private storage belongs there.
- expandFunctionRegions1025 gets kernelParameterNames at1031, extends localEnv
  BEFORE defaults1034 and body1042, and advances actual-result hoists1058.
  Therefore a private placeholder falsely projected as a source name affects
  dispatch before finalization; filtering only the final public validator is
  too late. tagDefSites850 also consumes bindingsIntroduced and tags projected
  atoms. Private storage must not become a source definition/environment entry.
- cloneOccurrenceSyntax856 preserves exact private/host/kernel/expanded-host
  nodes; ordinary syntax is cloned by occurrence. expandExprInner1902 returns
  atom objects unchanged. Rebuilding list containers is compatible with reused
  child atoms; object-spreading a private ATOM would lose WeakMap authority.
- compilerPrivateAtom763 increments a creation counter, but identity grouping
  is explicit. finalizeCompilerPrivateAtoms1263 uses identity+prefix, reserves
  emitted normalized atoms/colon segments, mutates marker nodes and clears
  private metadata. Shared same-node occurrences are finalized once; separate
  nodes with same identity receive matching names. No source string is trust.
- normal pass2 finalizes2413 AFTER all siblings; then postvalidation/strict,
  expanded-host materialization and lowerHostReferences2492 happen. Fragment
  expandExpr1856 similarly clones/validates, expands, finalizes, postvalidates
  and lowers host refs. Do not finalize one parameter before its default/body
  traversal or reconstruct guards from strings. JSON/ordinary output is after
  finalization; raw unfinalized WeakMap identities are not a JSON contract.

## Pattern compiler contexts and delivery

compiler.compileParam1910 treats direct atom `_` as Identifier; compilePattern
1917 treats raw scalar `_` as null. Object shorthand1990 explicitly makes both
key/local Identifiers; object alias2054 has compilePattern(local), optional
AssignmentPattern default. Array2096 puts raw `_` null elisions, while typed
prepared private atoms are ordinary emitted Identifier leaves after finalization.
No public trailing-hole fix is established by native code; public uses ESTree/
astring ArrayPattern null elements.

Public compilePattern currently recognizes rest (1960) but not spread: spread
falls through compileExpr to SpreadElement1437 whose argument is expression
compiled. ObjectPattern2010 accepts rest and throws unknown list helpers;
ArrayPattern2110 accepts rest and otherwise compilePattern fallback. Public
canonical pattern spread parity with native19 is therefore not implemented.
Value spread1437 stays expression grammar. Assignment operator784 and declaration
makeVarDecl533 share compilePattern; any change there affects raw params/loops/
assignment as well as Surface Bind, so consumed roles need explicit boundaries.
Catch compiler1114 calls compileExpr(catchParam), not compilePattern, retaining
its existing expression-rendered grammar; it is not an implied repair. A final
artifact read initially used source-relative rather than planning-relative cwd;
the absolute canonical artifact was then read successfully (no source writes).

Normal packages/lang/mod.js23 = read→expand→compile. Deno expander façade and
browser expander share expandWithMacroImports but have distinct Pass0 adapters;
browser compileLykn uses lang/ imports, not a separate discard lowerer. Native
embedded mirrors and cold materialized copies must match changed public files.
Current source M6 lists14 byte-comparison modules and five mapped test files
(5+6+17+21+6=55); it maps lang/ to materialized compiler and browser/ to fresh
staged target/lykn/build/browser, not relative canonical fallback. This population
is already independently reproduced at native759, NOT proof of future public
discard tests; root must derive its new selected population after authoring.

These facts support root's source-ready recipe construction; no competing
architecture or software verdict is selected here. Native acceptance and all
public/raw/catch/kernel/grouped/top-simple-multi/name/owner/check/DTS/docs/book/
LC02–08/B2b/S03 limits remain staged/open as already recorded. Source/build
stays root-owned with no reviewer jobs.

## Unissued public recipe review —2026-11-13

Read the complete `artifacts/b2-public-discard-recipe.md` against unchanged
759567f9/tree52dd6558; source-only review, no execution or implementation.
The root-owned baseline probes are recorded as root evidence, not independent
runtime claims here. The concrete recipe addresses the typed nonliteral Bind
block and nested-rest collection-check source paths identified above.

Prepared actual/source separation, all five consumers, schema exemption,
private direct-atom exclusions before lexical env construction, object key/
local distinction, private element loop IDs, direct `_` transfer path using
prepared declaration, source-only export siblings and whole-result finalization
are coherent with inspected current source. Existing non-any selector annotation
and top-level-simple multi default/rest limits remain explicitly held. Public
all-discard group admission is preserved rather than importing native's earlier
non-atom restriction. Shared grouped duplicate projection removes the second
wrong walker. Public raw catch still goes through compileExpr and remains held.

The exact proposed scope count is13: five canonical modules +five embedded
mirrors +one new mapped product test +fn-lambda_test.lykn +macro_dependencies.rs.
All five canonical modules are already in the14-module M6 comparison union.
Current M6 is55 selected across5files; adding seven natural groups gives62
across6files, subject to actual test declaration/execution count. The two stale
fn-lambda assertions are exactly `_ => 42` and `(_, i)`; the separate runtime30
case must remain. Existing mapped browser/ESM/private/Reflect tests exercise the
correct facade, and new discard tests still need actual semantic observations.
No new public strip flag, serialized private capability or browser run/load
policy is inferred.

Two narrow source-shape clarifications were sent to root BEFORE issue:

1. **Export macro priority placement.** The new unmarked/unbound Source export
   branch belongs after existing user-macro redispatch2095–2134 and before
   generic children-plan handling2289. `export` is currently not classifier-
   owned, so a registered user macro named export reaches that loop today.
   Unmarked/unbound alone does not exclude that macro. Preserve actual direct
   entry and every macro-result priority; no new macro phase is needed.
2. **Assignment member shape.** Ordinary `(= target:value rhs)` uses compileExpr
   at compiler784; list targets such as `(get target :value)` use compilePattern's
   generic compileExpr fallback. In contrast a colon atom nested as object alias
   LOCAL goes2054→compilePattern1930, producing Identifier with a colon-preserving
   toJsIdentifier spelling. It is not the same native emit_expr fallback that
   passed the nested colon alias runtime. The recipe must name which existing
   assignment shapes it preserves; do not call that nested colon alias already
   supported or silently add its repair. No runtime outcome asserted here.

Subject to those exact root dispositions, no further material contradiction was
found in the bounded recipe. This is conditional SOURCE readiness only; numbered
prompt/current source reread, implementation and independent software gates are
still required. All prior observations/history remain intact. Root retains
source/build/design/Git/index/ledger, with no reviewer job or source mutation.

## Final draft21 disposition — SOURCE-READY

Read full unissued `cc-prompt-iteration21.md` and complete amended recipe
through EOF, plus root/public-baseline/README.md. No source pin change from
759567f9/tree52dd6558 and no execution. Root's two baseline outcomes remain
root-reproduced evidence, not reviewer runtime results at this readiness stage.

Both material clarifications above are now explicitly resolved in the recipe
and test contract: Source export handling is AFTER user-macro redispatch and
BEFORE generic Value/Single handling, including a macro named export test;
assignment preservation is direct colon-member and nested get-list targets,
with nested colon alias LOCAL explicitly retained as an unsupported raw limit.
The complete prompt carries the source/private/schema/default/rest/export
contracts, exact13 paths, meaningful seven mapped groups/derived62 cases,
all14 module comparisons, two narrow snapshot migrations preserving runtime30,
actual ESM/JSON/browser/fragment/private regression proof and final gates.

No remaining material source contradiction identified. Root may issue21 under
the already authorized arrangement. This verdict is SOURCE readiness only;
CC implementation/self-review and an exact committed candidate's independent
software validation remain necessary before B2-DISCARD-P acceptance. All
native/public staged follow-through and LC02–08/B2b/S03 limits remain open.
No source/build/test/Git/index/ledger mutation or reviewer job; root retains
source/build ownership until actual issue and explicit transfer.
