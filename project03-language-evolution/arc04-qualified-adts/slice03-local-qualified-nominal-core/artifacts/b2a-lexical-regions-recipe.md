# B2a — precise lexical regions in actual compiler execution

Root source-ready recipe against accepted e80f613b/tree7376b33d. This implements
the lexical checkpoint of b2-owner-and-lexical-design.md, not OwnerRef metadata,
nominal activation, a new macro phase or a new public API. All IC-01 roles,
grammar distinctions, private identities and A/B1 behavior remain binding.

## Contract and deliberate corrections

Each ordinary function clause has its own parameter scope. Defaults that the
backend actually emits see that clause's parameters; pre sees parameters, body
is a local statement sequence, and an
ordinary Func post sees the outgoing own-level body scope. Body declarations
inside nested branches/blocks/other clauses do not escape. Parameter/header
syntax is not executable code. Annotation keywords and member names remain
structural. Named source function identity is visible recursively, not sibling
clause parameter names. Anonymous fn/lambda/genfn and kernel function/arrow
headers retain IC's explicit TypedParameter/BindingPattern distinction.

For native ordinary Func, visit selected executable regions in emitted semantic
order: defaults, pre, body, post regardless of keyword order. This deliberately
repairs earlier native textual macro/dispatch behavior; do not claim its raw
textual invocation/failure order preserved. Public emission already follows
that order and must retain it. Keep current backend clause dispatch/emission
sorting and supported grammar. Native macro expansion retains source clause
order; public retains sorted lowered clause order, since it lowers before
walking. No general cross-backend macro-effect-order parity is claimed. Generator
post/returns support is not added: public emitGenfuncMacro and native generator
emission ignore post, so do not activate it as an executable region. Ordinary
Func's selected repeated keyword group is last-wins; ignored groups and extra
metadata remain inert. Existing classifiers own malformed-header diagnostics;
new region helpers must safely decline malformed layouts without indexing panic.
Validate known header layout before executing its regions. A malformed new
layout must reach its established classifier diagnostic, not trigger macros
from ignored structural syntax as a substitute for parsing.

Two inspected legacy behaviors receive explicit bounded dispositions:

- Public ordinary multi-clause Func currently drops a simple parameter's
  defaultValue when binding arguments; native retains a default-shaped binding.
  B2a does not repair multi-clause default execution or introduce public macro
  effects from defaults it does not emit. Single-clause/source/kernel paths
  supply actual default execution oracles. Preserve each backend's current
  multi-clause default lowering and record this source-inspected parity issue
  as a B2b/S06 input before broader function/type claims. It is not tested
  runtime proof or an accepted common default contract.
- Native parses multiple genfunc clauses but emits only the first. Replace
  that silent loss with ordinary `genfunc: multiple clauses are not supported`
  diagnostics for actual two-or-more clause forms in both compilers, before
  expanding their bodies. This is a deliberate source compatibility correction,
  not new generator dispatch. Native's existing single wrapped clause may
  remain; public gains no new wrapped-clause grammar. Manually constructed
  native multi-clause SurfaceForm emission also fails normally rather than
  selecting clauses[0]. Preserve normal single keyword-clause generators and
  their ignored post/returns behavior. Test no body macro executes for rejected
  multi-clause generators; record any necessary existing test/docs migration.

A class scopes its own name without sharing method parameters. Base expressions
use incoming scope plus the class's own binding, matching current semantics
and runtime TDZ; they never receive method parameters. Each method/constructor/accessor has its
own parameter/default/body scope; static/async wrappers preserve it. Property
names, wrapper markers and fields' declaration keys remain structural; field
initializers/computed executable keys use the appropriate class/outer region,
never any method's parameters. ClassExpr has no sibling name. Reuse the actual
native classifier and public compiler member shapes; do not add a class syntax
or fix unrelated emitter behavior.

Lexical/surface dispatch priority is checked at every macro head step, not just
before a chain begins: bound heads are calls, known surface heads retain form
priority, then eligible user macros expand. Preserve one count/limit per head
chain, existing error wrapping, raw lazy arguments and occurrence semantics.
Do not reset the limit by recursively starting a new chain after every step.
Thread/Eq still transform operands before their existing nested expansion;
quote/template, debug macroexpand and array-result slot behavior remain intact.

## Implementation spine

1. **Shared structural layouts, not another recursive name heuristic.** Add
   private lexical-regions helpers (native module + packages/lang leaf mirrored
   in embedded). Describe source Func clauses, source anonymous/kernel function
   headers and class member executable regions with explicit grammar and
   original child-index paths. Native types use named enums/structs and borrowed
   input; JS uses tagged records with documented fields. Layouts separate
   parameters, default-value paths, pre, body and post. Property/annotation
   regions are opaque. Reuse IC binder/default projection logic and canonical
   keyword grouping; extract small private adapters where necessary rather
   than copying a new incomplete grammar.
2. **Occurrence paths survive shared macro objects.** Original child-index
   paths identify positions only within this traversal; they are not OwnerRef
   identity or span keys. If canonical keyword parsing needs positions, factor
   a shared last-wins group-range parser and keep existing parse_keyword_clauses/
   parseKeywordClauses wrappers and exported Set/function identity behavior.
   Do not recover a position with first pointer/object equality: one macro can
   reuse the same object in two distinct occurrences. Build replacements by
   original position and rebuild the original layout once after visiting the
   selected regions, preserving inert/ignored syntax and private metadata.
   Source physical key order remains in the retained syntax even when its
   executable regions are processed semantically. Existing optional elision
   semantics remain; no generic flattening or source-do wrapper is introduced.
3. **Native actual consumers.** Add explicit function/class role cases to
   resolver::ScopePlan and consume them in resolver and expander/pass2. Factor
   local callback traversal so both use the same structural layout and scope
   transition order, while one expands and the other tags. Resolve/expand
   parameters structurally and defaults as expressions once, then pre/body/post
   as above; clone input nodes with existing private fields intact. After each
   body expression, extend only from the actual expanded/resolved declaration
   that dispatches as a declaration. Ordinary call operands do not become
   sibling statements. No source-clause union or class-wide parameter adapter
   may re-enter actual function/member scope through another fallback.
4. **Public actual consumers.** Remove the FUNCTION_FAMILY aggregate
   preextension in expandExprInner. Existing lowered per-clause const bindings
   and actual kernel function parameter scopes must provide visibility. Add
   explicit function/class handling in expandChildrenPlan so names and parameter
   patterns are structural, defaults expand once, method/branch bodies use
   independent environments and completion use is preserved. Multi-clause Func
   still lowers in its current sorted dispatch order; no source pre-expansion
   of its raw body or duplicate macro invocation. Retain actual body own-level
   bindings into post. If a narrow source Func emitter callback is necessary
   to preserve per-clause annotation/body scope, root allows it in classifier.js;
   its behavior must follow this contract, not global union preextension.
5. **Actual result visibility.** In native top-level expand_all and nested
   expand_seq, and public pass2ExpandAll/expandChildrenSeq/expandChildrenTail/
   plan loops, collect following names from actual expanded result(s) and only
   when the form dispatches as a declaration. Preserve incoming environments
   and scope exit. Public existing statement-sequence macro array results expand
   sequentially under successive environments; value/argument slot meanings
   stay unchanged. Native gains no new multi-form macro result representation.
   Export/async wrappers must expose the actual supported enclosed declaration
   names through the shared hoist adapter, without leaking names from blocks,
   branches, methods or ordinary calls.
   That adapter checks actual dispatch against the incoming lexical environment
   (trusted public kernel marks retain priority), not raw head spelling alone.
   A new private helper/signature may carry that incoming environment; existing
   public introspection signatures need not change.
   For public array results, carry an explicit private result-slot tag from
   existing sibling-sequence consumers through expandAt into the macro branch
   (recommended: Single versus Sequence). Pass Sequence from top-level and
   actual statement-sequence splice consumers, not by guessing from Legacy or
   completion use alone. The macro branch expands existing statement arrays
   sequentially only for that tag; all other slots keep their existing mapping/
   rejection/materialization behavior. This tag conveys traversal position,
   grants no compiler authority and is not a new public expandExpr argument.
6. **D1 projection and D2 validation align.** Retire aggregate clause/member
   parameter projection as a D1 environment source; keep exact binding-site
   enumeration where required for validation, using the precise regions. Old
   IC direct occurrence counts and all actual error/positive cases remain.
   Public/kernel trusted markers retain priority; a same-spelled bound source
   head stays an ordinary call. No new kernel:lambda escape. No global context,
   source-node authority fields or new dependency.

Private names/factoring are local discretion; source visibility, processing
order, no replay, structural ownership and result-slot meanings are binding.
No new user option or unresolved public language decision is left to CC.

## Discriminating product tests

Use ordinary native/public product tests, actual emitted ESM and existing macro
test facilities. Exact source shapes must follow existing supported examples.
Preserve a baseline failure receipt for each newly repaired boundary before
editing, using immutable e80 source/binary and owned temporary locations. These
are focused regression checks, not a new open-ended research matrix.

- Multi-clause Func: one one-argument clause has a callable parameter named
  bind; another two-argument clause uses the real bind form and returns their
  sum. Both clauses compile and execute their distinct expected results. A
  macro/form name shadowed in clause A cannot suppress it in B. Cover defaults
  on supported single-clause/kernel paths, a nested closure, and actual macro
  invocation order/count with the stated backend clause-order distinction.
- Classes: a parameter named bind in one method cannot turn bind in another
  method/field initializer/base into a call. Paired tests must also show that
  the parameter does shadow within its own method. Cover constructor, getter/
  setter, static/async wrappers and supported class-expr shapes, using existing
  writer grammar. External property names stay legal data.
- Replay the retained IC post-before-body source from reserved-binding-output:
  `(func sample :args () :post (bind eval 1) :body
  (bind bind (fn (:any a :any b) (= a eval))) true) (console:log (sample))`.
  Native checked compile/check/stripped now succeeds and actual output is true,
  as for body-before-post and both public orders. This deliberately retires the
  old native ordering HOLD, not an assertion it was already fixed. A body-local
  declaration in a nested block must not leak into post.
- Selected function groups: later body forms execute/expand, repeated group
  last-wins, ignored metadata invokes no macro, valid zero-arg shorthand stays
  valid; malformed/empty source headers report existing errors, never panic.
  Generator ignored post remains ignored by actual expansion; no new feature.
- A macro returns a real bind/function/class/export declaration, followed by
  a same-spelled macro call site that must now resolve to that binding. Assert
  actual runtime result and macro call counts. Public existing multi-result
  statement arrays obey sequential visibility; do not invent a native array
  oracle unsupported by its existing bridge. A declaration returned in an
  ordinary operand/conditional branch does not leak to its siblings.
- A macro head chain returns a lexical call or known surface form sharing a
  registered macro name: correct priority stops further macro execution. Keep
  raw discard/duplicate argument, nested Thread/Eq transformation, quote,
  quasiquote, expansion-limit and error-wrapping controls intact.
- A/S02/IC controls: completion exits/finally/transfers, sparse host refs and
  Reflect anchors, checked/stripped type checks, computed callees, every old
  actual role witness, private fragments and re-entry/type isolation.

Focused real paths precede full gates. Then fresh make check (docs once),
committed citations and browser80KiB; cold M6 extends its current twelve-file
union for any new leaf and runs retained plus new actual materialized public
cases. Derive counts and inspect changed mirrors. No known-bad full reruns.
No full nominal/OwnerRef/purity/LC closure follows from these lexical checks.

## Applied guidance and review readiness

Rust TD-01/02/03 SHOULD supports named semantic region/path/grammar types rather
than bool flags, strings or span identity. EH-01 MUST keeps malformed source
on existing fallible diagnostic paths. Borrowed source/layout plus one owned
rebuild avoids self-references/unsafe and redundant whole-tree clones. Existing
private host/completion metadata must survive ordinary cloning.
JS API guide ID-03 SHOULD makes required private grammar/region dependencies
explicit and retains existing public optional API signatures; ID-04 MUST uses
one tagged layout/absent result shape. Testing validation-gates requires paired
real successes/failures and actual package delivery, not a name-census-only
claim. The canonical repository gates supersede skill example repo commands.

Root inspected the actual parser, binding, resolver/pass2, public lowering/
sequence/marker and native member classifier/emitter paths at e80. Separate
Sol confirms the baseline carryovers and nested analysis limitations. Root
resolved native semantic-order correction, generator non-feature, structural
metadata, occurrence positions, result visibility and macro priority explicitly.
A separate readiness check precedes issue. B2b exact owner-unit transport and
nominal/purity work remain separately prepared, not guessed by this implementer.
