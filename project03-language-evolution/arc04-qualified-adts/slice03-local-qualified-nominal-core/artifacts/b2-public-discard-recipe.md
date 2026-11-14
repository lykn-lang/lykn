# Public Surface discard checkpoint — source-ready recipe21

Root2026-11-13. Source759567f9/tree52dd6558 at the existing task worktree;
native B2-DISCARD-N is independently accepted. The operator's rules are settled:
`_` discards in binding patterns, `_value` binds normally, distinct source
spellings identify distinct bindings. This recipe is the public parsed-callable/
Bind counterpart, not full raw/catch/loop/class discard or ordinary-name/owner
activation. Issued21 records the source/build handoff; root retains design.

## Producer and private-value boundary

In surface-helpers.js replace the split paramNameNodes/paramTypeChecks path with
one prepared result per parsed parameter/signature: pattern:SExpr, actual value
where applicable, and checks:SExpr[]. A private leaf helper keeps source display
name separately from actual storage. Ordinary parsed leaves retain their source
atom; `_` gets compilerPrivateAtom(fresh identity object,'discardValue'). Reuse
that same atom in pattern, guard predicate and dynamic typeof operand. Do not
clone private atoms with object spread/JSON, mutate original parsed records or
allocate IDs independently on a second check traversal.

Preserve public buildTypeCheck's existing four-argument contract by delegation
to a private actual-value/source-label helper. Predicates/typeof use actual;
only message text uses original source label. Source label is used for new
prepared rest checks too, never a private/generated element name. This is an
intentional public diagnostic improvement for simple named rest; native's old
ordinary-rest wording is not newly claimed byte-identical. No new public flag,
unit singleton, runtime dependency or current-compilation global state.

Nested object `_` fields use original `_` key and private local via alias,
including the optional default slot. Prepared leaf has a separate actual so
default wrappers are not nested/duplicated. Recurse nested aliases as property
selectors. Bare array Skip stays `_` elision; typed array `_` gets storage and
normal value read. Both simple isRest and array p.rest take per-ELEMENT guard
loops over their prepared collection (the latter currently lacks isRest in its
parsed record). Allocate a distinct compilerPrivateAtom(...,'discardElement')
for that element, sharing it between loop binder/check. `:any` has no loop.

The p.rest collection-as-number bug is runtime-reproduced in
increment-b2b3/root/public-baseline/nested-rest-*. Existing non-:any nested
alias/selector annotation behavior is a separate known limitation: do not
silently invent whole-parent capture/type-check ordering in this refactor or
claim that path corrected. Preserve its existing check placement/semantics;
successful nested selector controls use :any and test typed LEAVES. Native's
alias-annotation limitation remains separately open for proper elaboration.

Update ALL five classifier consumers once: Fn (also Lambda), single Func,
multi Func, Genfunc and Genfn. Keep sorting/dispatch, defaults/pre/post/return/
yield ordering and existing unsupported top-level-simple multi default/rest
extent. Multi simple clause binding uses prepared ACTUAL rather than a default/
rest signature wrapper; nested destructured patterns use prepared pattern.
No new multi default/rest success claim. Type constructor/schema fields use
their original names/check helper/property keys, never discard preparation.
Remove the now-unused split helpers/imports after full caller census; they are
internal module exports, not new package APIs. Record the S06 surface impact.

## Source environments and finalization

In binding.js kernelParamNames' direct atom branch and patternNames' nested
direct-atom branch exclude ACTUAL isCompilerPrivateAtom nodes before producing
source sites. Existing root-pattern filter is insufficient: function localEnv
is built before default/body expansion. Preserve source atoms with identical
raw prefix/fields; a string or lookalike object is not private authority. Keep
named declarations/imports/type schema roles distinct; no global spelling ban.

Use existing compilerPrivateAtom count/finalizer lifecycle unchanged: normal
pass2 and expandExpr finalize after expansion, before postvalidation/host
lowering/ordinary JSON return. cloneOccurrenceSyntax already keeps identity
nodes; retain it. No early per-parameter finalization or whole-tree cloning of
host invocation anchors. Existing ICU, protected references/Reflect, fragments,
strict source and context-recovery contracts remain.

## Bind statements and inline exports

Add a small reusable lowerDiscardBindingPattern in surface-helpers for actual
Bind pattern roles, analogous to native: scalar `_` gets private storage;
object `_` shorthand/default preserve the key through alias; aliases recurse
LOCAL only, default RHS stays value, rest/spread recurse actual target; nested
arrays recurse but bare `_` stays hole. Preserve source child objects/metadata.
No assignment-target, raw compiler scalar, named declaration, schema or import
rewrite. compiler.js's direct compileParam `_` remains for existing raw/schema
consumers; normal Source receives already lowered names.

classifier emitBindKernelArgs uses prepared binder for const and SAME scalar
actual for typed check, source name for error. Preserve literal mismatch/any
rules and unrelated malformed typed-pattern limits. Typed nonliteral bind must
return ordinary sibling const/check forms, NOT a kernel block. This real
scope defect is reproduced by public-baseline/probe*: expected7, actual
ReferenceError. Preserve statement completion/return-transfer semantics; do
not flatten user-authored blocks or turn bind into a new value form.

DirectStatement simpleDirectBind must admit scalar `_` as a discard. In
expandDirectBind obtain the prepared storage from emitted const and retain it
in both fast and direct-transfer paths. Never rebuild the declaration using
the original `_`. Expand initializer once in original source environment;
completion storage remains its distinct existing identity. Grouped pair
expansion preserves actual pair order and extends source env using original
named sites only.

Classifier's namesInPattern is a second, incorrect grouped duplicate walker
(alias missing/default walks RHS). Replace it with shared bindingNamesInPattern
site names, not another grammar. Public currently admits scalar-only and
non-atom all-discard groups; preserve that admission and named duplicates.
Do not import native's still-open non-atom admission restriction.

There is no classifier Export node today. Add a narrowly scoped source-level
branch in expander-core for unmarked/unbound Source `(export (bind ...))` with
one declaration child, AFTER existing user-macro redispatch/fixed-point handling
and BEFORE generic Value/Single-child handling. Source export is not classifier-
owned today: an actual macro named export must retain its existing priority.
Do not intercept its call before that loop. Resolve
bind head using the SAME source head/env rules as existing surface dispatch;
a bound bind callee is not a declaration. Validate/classify that actual source
Bind/BindGroup, collect original source binding sites, expand its declarations
in Statement/sequence context, flatten its actual sibling output, then append
sanctioned existing `(export (names ...))`. Empty names means export{}.
Do not wrap checks/private support declarations or duplicate expansion.
Preserve PUBLIC arity: extra declaration operands reject with the existing
`export: unrecognized form`; native permissive ignored extras are not public
authority. Leave raw kernel/default/reexport/async and unrelated Export paths
unchanged. Respect fragment multiple-form results rather than inserting scope
blocks merely to keep one node.

## Pattern compiler parity and data keys

Public compilePattern/ObjectPattern/ArrayPattern gain spread as the existing
rest-pattern synonym, with RestElement/compilePattern targets, last/arity
checks retained. Value-position spread stays SpreadElement/expression.
Catch still compiles its parameter through compileExpr. Generic assignment
member targets remain supported; no blanket discard handling in the raw writer.
Here that preservation means direct `target:value` assignment (existing
compileExpr route) and list `(get target "value")` targets inside an assignment
pattern (existing compilePattern fallback). A nested colon atom as alias LOCAL
currently becomes an Identifier, unlike native; this recipe does not newly
promise/fix that separate raw pattern limitation. Use the supported get-list
shape for the nested assignment consumer oracle.

Shared binding.js projection gains spread child1 and default required RHS only
for BindingPattern excluding catch-binding, as native19. TypedParameter and
legacy catch projection stay unchanged. Compiler private direct atoms are not
source names in either mode. Existing public malformed-pattern rejection stays;
do not emulate native's permissive ignored underfilled default.

Object alias key must distinguish data from names: atom key→normalized
Identifier; string/number/keyword literal→compileExpr literal semantics (string
bytes preserved; keyword normalization retained). Reject unsupported computed
forms without inventing a new grammar. Current .value→toJsIdentifier string
route loses literal punctuation and numeric AST identity. Test quoted
"first-name"/"0" as actual property keys and source underscore property/data.
Existing unknown-list pattern rejection remains; do not claim native/public
diagnostics are byte-identical. Pattern spread affects assignment/raw params/
loops too; test actual affected consumers while retaining catch extent.

## Delivery and acceptance

Canonical product edits are exactly surface-helpers.js, classifier.js,
expander-core.js, binding.js and compiler.js, plus their byte-identical embedded
counterparts. New test/forms/discard-bindings.test.js uses mapped lang/ and
browser/ imports, real emitted ESM execution and actual namespace/guard/effects.
Seven useful top-level groups: callable/bind identity+source/macro prefix;
types/default/rest/schema; scopes/effects/iterator/transfer; source-only exports;
pattern/projector/data-key/assignment/legacy catch; private/JSON/fragment/recovery;
browser ESM delivery. Assertions may share helpers; count natural populations
accurately, not no-op tests. Exercise old typed-bind and nested-rest failures.

Migrate only two stale `_` parameter spelling assertions in existing
test/surface/fn-lambda_test.lykn to useful compile/arrow/check semantics without
pinning private gensym names; new mapped JS tests establish actual public
noncapture runtime. Preserve its runtime30 case and all other tests. M6 adds
the new mapped file, making55+7=62 meaningful tests with all14 byte comparisons.
If natural group count needs adjustment, derive/record the actual denominator
before changing the existing harness, never weaken it.

Normal public API has no strip option. Native comparison is checked semantics;
new source names/owners/nominality/purity/DTS/book/human and full raw discard
remain open. Whole JSON roundtrip uses only already finalized expanded output;
no serialized private authority. Preserve actual private/host invocation object
identities, macro priority/Source binding regions, ICU behavior and finite host
contract. No Node/new npm dependency or helper-language exception.
