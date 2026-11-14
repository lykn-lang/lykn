---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice03-public-binding-discards
status: active
version: "1.0"
depends-on: [slice02-native-binding-discards]
---

# Remaining public/browser discard binding forms

## Authority and useful delivery

2026-11-14: the operator opens Arc05 S03 with Luna6 High CC, separate Sol6.1
High CDC, usual Autonomous Mode. Root coordinates/designs and owns planning
Git/index/status; one contributor owns source/build at a time. The authorized
endpoint is an implemented, independently accepted S03 on the existing task
branch, with retrospective and bubble-up. S04 onward, integration, push,
publication, licence/dependency choices and remote CI remain unopened.

The useful result is coherent remaining public discard behavior through the
normal Deno API, fragment expansion and browser compile-to-ESM facade, with
actual materialized embedded delivery. `_` discards a binding, `_value` is an
ordinary name; initializers, arguments, destructuring operations/defaults,
guards, failure propagation and source-only exports remain observable. The
native contract accepted by S02 is an input, not proof of the public result.

| Role | Requested/selected configuration | Ownership |
| --- | --- | --- |
| Root coordinator | Current main context; backend identity not independently reported | Design/planning/index and final reconciliation; no implementation self-acceptance |
| CC | OpenAI gpt-6-luna, high, explicitly operator-selected | Authorized product files, tests and doer evidence |
| Assigned independent CDC | OpenAI gpt-6.1-sol, high, explicitly operator-selected | Readiness and independent source/runtime verdict; own cdc-verification.md |

No substitution is authorized. Use reviewer-authored `cdc-verification.md`;
root closes ledgers only after independent proof. Existing canonical planning
layout and artifact categories remain in force; no new layout decision arises.

## Compact preflight

- Source: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  branch `codex/qualified-adt-core`, clean
  `9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree
  `6d64692fde0c367e73deeda1ec1aca19e49d6b93`.
- Planning: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, orphan
  `planning`, initial checkpoint `69cc8e4fbcbaea8e41e01d9eb17a50e6fb11046f`.
- Release remains `0829e892999890e8877dec5e35cd249753e1be5d`. No branch propagation.
- Live runtime: Deno2.9.6, V8 15.0.245.2-rusty, Cargo1.97.0. Shared Deno cache
  `/Users/oubiwann/Library/Caches/deno`; owned fresh per-contributor XDG/tmp
  roots under `/private/tmp/lykn-arc05-s03-{cc,cdc}`. Preserve unknown outputs.
- Source/build currently root-owned during preparation. Transfer to CC only
  after readiness review and committed open set; return to root, then reviewer,
  for stable-input independent gates. No concurrent edits/build/scanners.
  Readiness review completed; root now transfers source/build to CC on initial
  dispatch, with independent reviewer context `/root/arc05_s03_cdc`.
- [S02 final acceptance](../slice02-native-binding-discards/cdc-verification.md#final-correction04-verdict--accept--2026-11-14)
  and [retrospective](../slice02-native-binding-discards/cdc-retrospective.md)
  supply the actual admission/role/oracle/staging lessons. Earlier HOLDs remain
  at their original paths. No historical prompt resumes or budget resets.
- New supporting evidence defaults to `artifacts/cc/` and `artifacts/cdc/` here,
  only for intake, consequential failures and command/gate evidence needed to
  reproduce the row claims. Git supplies source snapshots; no archive/replay
  framework or per-command inventory is requested.

## Binding contract and source-grounded design

Source locators below refer to the task branch at9e6fb127, not planning's tree.
They describe inspected code; illustrative cases are proposed tests, not claims
of execution during preparation.

### 1. Admission and preparation boundary

`packages/lang/mod.js:lykn` runs read→expand→compile; browser/compiler.js uses
the same pipeline with its built expander adapter. `expandWithMacroImports`
and `expandExpr` clone ordinary occurrence syntax and finalize private atoms.
The `KERNEL_FORMS` whitelist really admits const/let/var/function/function*/=>,
loops/try/async, and excludes lambda/class/class-expr prefixes. Typed Source
lambda and ordinary class/class-expr are separate existing entrances. Do not
extend the whitelist or infer an escape from writer/lexical support.

Raw public `compile(read(...))` and `compileExpr(readerNode)` are literal kernel
writers, like the native raw writer. Do NOT add discard semantics to compiler.js
or rewrite every completed tree: generated Type constructors bind real `_`
schema fields. Prepare only source-consumed roles in expansion, before existing
private finalization, while preserving compiler-owned generated forms.

Recommended: extend surface-helpers.js with a role-local preparation helper and
wire it into expander-core.js in two places:

1. The explicit kernel escape validates first, strips the head, prepares ONLY
   this source form's binding slots, then marks it kernel and recurses normally.
2. The ordinary fallback runs preparation after lexical-call resolution,
   surface classification and user-macro fixed point, only for unmarked source
   forms with an actual unbound/form head. Already marked compiler output skips
   own-slot preparation. Its ordinary source children still expand normally.

Keep returned sanctioned marks on the exact prepared node; do not clone a marked
node and accidentally lose its capability. A macro/lexical call named function,
try or class keeps established dispatch priority. Existing private atoms must
retain object identities; neither JSON nor structuredClone can copy WeakMap
capabilities. Reuse compilerPrivateAtom({}, "discardValue") through the existing
counter/reservation/finalization path. No extra shared active-unit state or
prefix-based authority. No new public option/API is needed.

### 2. Ordinary binding roles

Reuse/extend lowerDiscardBindingPattern without changing value/default/key
expressions. Prepare const/let/var binder slot, for-in/of/await-of binder slot,
and the declaration binder inside numeric-for initializer. Prepare EACH raw
function/function*/arrow parameter independently: ordinary function requires a
name; function* admits named and anonymous layouts. Choose parameter indexes
from that actual grammar. Typed Source lambda is the anonymous non-generator
entrance; ordinary anonymous function syntax remains rejected by its writer.
Async's payload is visited normally.
Preserve names, `.length`, evaluation order, generator timing and default laziness.

For class/class-expr use existing classRegionLayout member paths, recurse through
static/async wrappers and replace only each parameter element. Leave field
names/initializers, bases and property names alone. Object callable values go
through the same function/arrow paths; no object-method grammar is introduced.

The helper already preserves bare array `_` as a hole and rewrites object `_`
to an alias with private target. Root default/rest/spread wrappers must recurse
only into their binding operand; add an alias case where that writer consumes
its target. Never treat a parameter-list container as an array pattern.

### 3. Catch keeps its actual legacy grammar

compiler.js's try writer selects trailing finally, then the immediately preceding
catch. Match THAT public selection; do not rewrite all catch-looking children or
copy native selection assumptions. Its param uses compileExpr, not compilePattern.
Use a separate catch preparation helper mirroring that expression grammar:
bare catch array `_` is a private VALUE binder, not a hole. Catch object shorthand
`_` becomes a key/value pair preserving key `_`; literal pair/computed keys remain
keys, only their value target recurses. `(object (default _))` means property
`default`, and `(object (alias _))` means property `alias`, not a pattern alias.
Public default/rest writers themselves use compileExpr on the left/argument,
so those catch operands recurse with LEGACY catch roles too, retaining nested
array value binders; default RHS remains an expression. Array spread likewise
consumes a legacy catch binding operand. There is no standalone catch alias
subwriter in the public compiler; do not invent one. Ordinary declaration
pattern aliases still use the separate compilePattern path. Preserve selected handlers/finally, direct
returns and existing nested catch-default strict-name validation from S01.

### 4. Shared binding projections

binding.js kernelParamNames currently recognizes top-level rest/default but not
spread, although compilePattern accepts spread. Add spread to that untyped role.
lexical-regions.js parameterDefaultPaths likewise traverses spread only for
BindingPattern grammar. Typed schema/Source parameter grammar is not widened.
Prove named spread/default body resolution and reserved/form-name controls, not
only private emitted spellings. Existing pre/post/source environments remain.

### 5. Grouped admission and static keys

Public parseBindGroup already accepts non-atom zero-name patterns. Preserve its
valid empty/all-discard/nested/default/rest patterns, including its existing
empty-list object-pattern shorthand; do not import the native nonempty-name proxy
or the native newly-admitted-only structural predicate wholesale. Typed grouped
names stay atoms, duplicate named targets stay errors, exports contain source
names only. General pattern grammar validation is not this slice's deliverable.

For untyped grouped patterns whose projected source names are empty, normalize
static alias Atom/Keyword keys into String nodes using the existing toJsIdentifier
before ordinary discard preparation. This preserves the writer's property names
and represents pipe/Unicode/punctuation as DATA. Preserve node metadata via
role-local copies, String spelling, numeric keys and existing -0 behavior;
reject member-expression Atom keys containing colon/dot with the same early
group diagnostic as native. Recurse only actual targets/default-left/rest;
never normalize default RHSs, computed/value expressions, named groups, single
Bind or raw writer input. Do not add a punctuation blacklist/Unicode validator.
The bounded classified-IR change goes to Arc06 LI-04; no broader API audit closes.

### 6. Multi-clause signature boundary

Native S02 rejects any TOP-LEVEL simple default/rest in a func with >1 clauses:
`multi-clause func does not support top-level default or rest parameters`.
Public must enforce that same restriction before emitting JS, even in mixed
simple/destructured signatures. Parse actual params with parseTypedParams and
reject !destructured && (defaultValue present || isRest), inspecting every clause.
Share the predicate between classifySurfaceForm's func case and direct exported
buildMultiClauseFunc/emitSurfaceForm entry. No default RHS is expanded/executed
before the rejection. Do not infer support from exact args.length dispatch.

Single-clause signatures and nested destructured defaults/rest remain supported.
Public's parenthesized single clause currently routes through the multi builder;
put the ONE-clause delegation in exported buildMultiClauseFunc itself:
clauseLists.length===1 returns buildSingleClauseFunc(funcName, funcNameNode,
clauseLists[0].values) before creating dispatch state. Both emitSurfaceForm and
direct builder callers then use ordinary defaults/rest rather than exact-arity
dispatch and dropped defaults. Prove both actual source and direct-builder cases.
Retain >1-clause fixed-arity/type priority/pre/post/guard behavior. Full omitted/
variadic overload support remains unopened root/Arc05 candidate S09 with its
explicit arity/selection/binding/effect/guard design and both-backend re-entry.

## Product footprint and implementation order

Exactly these14 product paths are authorized; a needed additional file is a
root scope decision before editing it. No compiler.js/writer, whitelist, reader,
dependency/lock/config, native implementation or loader execution-policy changes.

1. `packages/lang/surface-helpers.js`
2. `packages/lang/expander-core.js`
3. `packages/lang/classifier.js`
4. `packages/lang/binding.js`
5. `packages/lang/lexical-regions.js`
6. `crates/lykn-lang/embedded/packages/lang/surface-helpers.js`
7. `crates/lykn-lang/embedded/packages/lang/expander-core.js`
8. `crates/lykn-lang/embedded/packages/lang/classifier.js`
9. `crates/lykn-lang/embedded/packages/lang/binding.js`
10. `crates/lykn-lang/embedded/packages/lang/lexical-regions.js`
11. `test/forms/remaining-discard-bindings.test.js`
12. `crates/lykn-cli/tests/macro_dependencies.rs` — only add that public test to
    M6 and update its exact selected population from62 to70 (62 retained+8 new).
13. `docs/guides/00-lykn-surface-forms.md`
14. `docs/guides/06-functions-closures.md`

Implement the new eight-group product suite and show at least the raw repeated-
parameter/discard or signature witness failing on9e baseline. Refresh staged
imports with make fresh-artifacts before interpreting it. Then implement role
preparation and projections, grouped static-key handling and signature guards,
copy the five canonical modules byte-for-byte into embedded mirrors, update M6
selection and immediate factual guides, refresh again and run focused checks.
Inspect the complete diff before the final full gate. Keep each consequential
failed condition rather than silently replacing its source/expectations.

## Verification method and discriminating oracles

Use ordinary product Deno tests, reusing existing discard test ESM child/namespace
patterns and direct native commands. No new generic verifier/harness. Eight
top-level Deno.test groups in the new file are the declared M6 population:

1. Declarations/loops: foreign `_`99, `_value`7, repeated discards retain99;
   initializer/default/key effects once. For-of hole fixture observes the getter
   on the iterator RESULT's value property (hole0 versus fresh named2); outer
   early break proves next1/return1. Cover for-in, await-of and numeric-for
   initializer with immediate break; do not claim a discarded numeric counter.
   Concretely, the outer iterable contains two inner iterables; each inner
   Symbol.iterator returns next() results with done:false and a live value
   getter that increments the counter and returns7. `(array _)` performs two
   inner next calls without reading their values; fresh `(array named)` reads
   those two result-value getters. Observe THAT result, not a nested array
   element's getter. Use a separate outer-iterator early-break control.
2. Callable/classes: named function, named/anonymous function*, arrow, async, typed
   Source lambda, constructor/method/get/set/static/async wrappers and object
   callable values. Foreign99 versus argument7, `.length`, lazy defaults,
   generator body advances only on next, thrown getter/default propagates.
3. Catch: scalar, array/object shorthand, pair/computed keys, legacy default/
   rest/spread operands, alias-named property, direct return and suffix selection/finally. Catch array `_` reads
   live value versus declaration hole; legacy property-default/pair yields8.
   Existing nested default containing reserved eval/arguments still rejects.
4. Projections/private lifecycle: named top-level spread with nested defaults,
   reserved/form-name resolution, `_value`, foreign/source/private-looking name
   collisions, whole/fragment failure then reuse; no prefix grants authority.
5. Grouped patterns: empty/all-discard/nested/default/rest groups remain usable,
   including public empty-list shorthand; live property getters exactly once,
   Atom/Keyword/String pipe and normalized/Unicode keys, negative/-0 numeric
   keys, RHS stays an expression; typed-group nonatom/named duplicates reject.
   Colon/dot keys reject before JS. Named/single/raw branches are unchanged.
6. Signatures: exact new early diagnostic through lykn, browser facade, direct
   classify/emit/build functions for default/rest and mixed >1 clauses; a default
   macro counter stays0. Single-clause keyword, parenthesized and direct-builder
   defaults/rest actually run; nested defaults/rest and fixed type-priority/pre/post dispatch
   remain usable. Avoid general variadic-dispatch feature claims.
7. Raw/JSON/schema: direct compile of raw function binds argument7 against
   foreign99 and retains literal `_`; expanded public form returns99. Finalized
   expand/expandExpr JSON round-trip compiles/runs with no leaked private markers.
   ADT schema field `_` retains value7 and type errors; function names, assignment,
   property/data/import/label roles retain meanings. Unsupported kernel prefixes
   lambda/class/class-expr still reject; strict and explicit lax routes are real.
8. Actual delivery: Deno facade and staged browser compiler generate ESM with
   same representative remaining forms, effects and source-only export namespace;
   run via actual imported modules. Browser compile proof does not claim browser
   run/load/CSP execution policy or a public assertion-stripping mode.

Groups can contain bounded subtests/cases; assertions must discriminate old or
plausibly wrong behavior. Do not count setup as runtime proof. Test existing
S01 discard/lexical/private/schema behavior too. Change only expected counts
that follow the deliberately added8 tests, not tolerances to absorb failures.

From source cwd, with owned TMPDIR/XDG/cache roots precreated and DENO_DIR set:

1. `make fresh-artifacts` before staged consumers.
2. `deno test --config project.json -A test/forms/remaining-discard-bindings.test.js test/forms/discard-bindings.test.js test/expander/lexical-regions.test.js test/expander/binding-walker-parity.test.js`.
3. One final `make check` (already includes docs). Set precreated absolute
   LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR to this contributor's artifacts M6 home.
   Inspect actual child command/config/status, strict70/0 population and all14
   canonical=embedded=materialized comparisons, not only outer Rust success.
4. Commit explicit product paths with both contiguous coauthors; then run
   final-HEAD `make check-cited-paths` and fresh `make bundle-size-check`, retaining
   actual gzip below81920 and warnings. Fix/review then re-pin if source changes.

Retain full denominator, self-skips (including unreachable JSR), warning/cache/
download distinctions, interrupted/unrun outcomes. No network publication claim.
Independent CDC inspects source/oracles first, then reproduces focused, full,
inner delivery, citations and fresh size gates at the candidate. Earlier S02
native proof remains only at its original pin with applicability checked.

## Guidance applied and readiness

Root refreshed collaboration-framework3.0.1/PM3.0.0: canonical open set, source-
grounded prompt/intake, stable owner and independent ledger proof. These guides
do not impose a new permission stop when operator authority already exists.
JS/Deno skill1.0.0 core declarations/equality and functions/closures ID11–14
support occurrence-local copying, explicit scope and preserved TDZ rather than
global underscore replacement. Anti-pattern ID12 and ID35 warn against accidental
capture and identity-losing deep copies; use existing private WeakMaps and local
structural copies. Deno testing ID08 and testing discipline/Proportionate Proof
support exact throws and real ESM/effect controls through existing machinery.
Rust anti-pattern AP09 allows assertion failures in tests; M6 retains its actual
inner status/count assertions, with no new fallible production Rust API.
Project repository guidance controls existing style/commands over generic skill
examples (no dependency/format migration or broad formatter run).

Root has traced actual admission, writer roles, source/compiler-produced
boundaries, parse shapes and M6 population. Separate Sol6.1 High
[readiness review](cdc-verification.md#source-readiness-review--pass--2026-11-14)
passes the corrected initial open set against source before CC issue. Preparation
corrected ordinary function admission, the public catch expression subwriters,
exact guide locators and direct one-clause builder delegation; no source changes
or implementation acceptance occurred. Public empty-list grouped admission and one-clause builder routing
are explicit preservation requirements, not copied native assumptions.
Packet is one coherent public backend increment: five canonical modules with
mirrors, one product suite and bounded M6/docs integration; later naming/DTS/
qualified APIs remain separate. Five-refinement cap remains; ordinary scoped
corrections proceed autonomously, ambiguous design/evidence gaps return to root.

## Assignment history

- 2026-11-14 initial `cc-prompt.md`: issued after separate Sol readiness PASS.
  Source9e6fb127; all nine PB rows open. Current assignment is this initial CC
  prompt; no refinement pass has executed. Source/build transfers to Luna on
  dispatch. Readiness corrections above preceded issue; original S02 history
  remains unchanged.

## Exit and bubble-up

All [PB-01–09](ledger.md) must receive independent dispositions before closure.
Root completes retrospective, BS-03 reconciliation and Arc06 LI-04 API/IR/docs
carry-forward, retaining S04 declarations, S05–08 naming, S09 signature design,
NUMI, reader RDEO/RDCL, Arc04 local qualified and Project07/book/human/licence
owners. Neither native/public discard acceptance nor guide edits close those.

## Version history

- 2026-11-14 v1.0: Prepare operator-opened S03 from accepted9e6fb127, with
  public-specific producer roles, existing grouped admission, signature boundary,
  direct raw API distinction and actual browser/materialized proof.
