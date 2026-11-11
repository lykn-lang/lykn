# IC-01 correction01 — complete executable regions

Root's consolidated correction against clean5bdbfe3c/treee0a95d74. The separate
[software HOLD](../cdc-verification.md#ic-01-candidate-5bdbfe3c--2026-11-11)
reproduces IC-R01–04 and the IC-R05 test gap. The original role contract still
governs; this attachment supplies exact completion mechanics and the necessary
shared-parser wiring. No keyword, DD-49, new source syntax, public lambda
escape, nominal feature or general D1 class/clause repair is selected here.

## R01 — use the real function group grammar

Current walkers reconstruct key/value windows and visit only the next value.
This omits later :body forms and zero-arg shorthand. The actual classifiers
already have parse_keyword_clauses / parseKeywordClauses: they delimit only
the six known keys, preserve non-delimiter keywords as values and use the last
group for a repeated key. Reuse that implementation, not another approximation.

- Make native classifier/forms.rs::parse_keyword_clauses and
  is_func_clause_key pub(crate), retaining signatures/algorithm. Binding can
  use their borrowed node references without cloning the input tree.
- Extract public parseKeywordClauses plus FUNC_CLAUSE_KEYS unchanged into a
  dependency-free private function-clauses.js. Its keyword predicate is exactly
  nonnull/nonundefined node.type === keyword, matching existing isKeyword.
  Classifier imports/reexports the same names, preserving existing exports and
  Set identity. Binding imports the leaf instead of importing classifier/core
  and creating a cycle. Preserve emitter behavior and the existing key set.
- Select source func/genfunc layout from the first argument after its name,
  using the actual backend discriminator: multi-clause, keyword mode, or zero-
  argument shorthand. Do not classify a function from a keyword-like list
  found somewhere later in its body. Preserve the current native/public
  discriminator differences rather than changing source grammar incidentally.
- Within a clause, project the actual selected args list, visit parameter
  defaults, then visit every selected body form as a lexical statement sequence.
  For zero-arg shorthand visit the entire body. Pre/post handling follows the
  actual producer: first consumed expression where supported, not all ignored
  metadata values. Never scan an overridden earlier group as live code.

## R04 — outgoing body scope and postconditions

Public lowering runs pre, body, post regardless of textual key order. The new
input gate must preserve both immutable-B1 successful examples from the review:
body declares a callable bind; post invokes (bind eval 1). Visit pre with the
parameter scope, walk the body sequence and retain its outgoing **own-level**
scope, then visit post with that scope. Do this in public validation even when
the post key precedes body in the source. Declarations inside nested blocks,
other clauses, operands or methods do not escape into that outgoing scope.

Recommended private helper: factor sequence walking so it can return its final
local scope (or visit into a caller-owned local scope), while ordinary recursive
callers discard it. Public incoming Sets and native caller scopes remain
unchanged; parameter and clause locals never escape to enclosing siblings.
Use actual declaration gating when collecting outgoing names, not raw hoisted
names from a bound/tagged call with the same spelling as a declaration.

Native already has a separate order-sensitive resolution/lowering limitation:
body-before-post works, post-before-body referencing a body-local binding
previously emitted invalid predicate syntax. Candidate5bdb rejects that older
bad native case at the new gate. **Do not import public post visibility into
native validation so it suppresses this rejection while native lowering still
misclassifies the predicate.** Native validation honors its actual NameRes
tags and existing physical visibility; retain body-before-post success and
post-before-body rejection for this particular case. If a private outgoing-
scope helper is shared conceptually, native body-local inference into post is
limited to physically later selected post groups, matching existing resolution.
The general native ordering repair is explicitly a B2 input, not this correction.
Do not use spans as node identity or reorder macro expansion to implement it.

## R02 — computed callees

In native walk's ordinary-call fallback, a non-atom computed head is itself an
executable expression. Visit it before all arguments, using incoming scope;
an atom call head has no subtree. Each argument retains the same incoming scope,
not sequential sibling visibility. Preserve the public equivalent, which
already catches the review witness. This fixes a missing child, not dispatch
classification or a new computed-call syntax.

## R03 — one recursive default-region operation, wired everywhere

Complete the existing private parameter/pattern-default traversal using actual
source versus kernel grammar. Its job is to visit executable default values;
it does not evaluate them. Keep binder projection separate from that visit.

| Pattern role | Binding projection / executable traversal |
| --- | --- |
| Typed source (default :type name value) | Project name at2; visit value at3 |
| Kernel (default pattern value) | Project pattern at1; recurse its pattern roles; visit value at2 |
| Rest | Recurse the actual source/kernel binding pattern, not a type marker |
| Nested array/object | Recurse each complete nested pattern/member, not just its first child |
| Kernel object alias (alias key local [default]) | Key is data; recurse local at2; visit optional default at3 as expression |
| Typed nested alias (alias :type name pattern) | Project alias name and recurse pattern at3; that pattern is not a default expression |

Use explicit private grammar state/helper names where necessary; do not guess
all default positions from length alone. Reuse binder/projection helpers and
actual codegen grammar. Wire default-region visiting into kernel function/
lambda/arrow parameter lists **including the first parameter**, every class
member/accessor/wrapper parameter list before its body, source typed parameter
lists, source bind and kernel const/let/var binding patterns. Cover existing
loop/catch binding-pattern default consumers where their grammar permits them;
do not add unsupported source patterns. Initializers are value slots outside
new declaration names; method defaults see parameter/class scope, not method
body locals. Walk method bodies as their own statement sequences.

Visit supported computed pattern keys only as specified by the actual pattern
writer; external keys remain data. Keep existing D1 aggregate class adapters
unchanged: new member-role/default traversal is validation-only. Do not fix
the older native unlowered-do alias-default emission problem under this scope.

## R05 and discriminating product oracles

Replace/supplement the unsupported anonymous plain-function macro fixture with
the review's supported AST-argument macro: it takes params and quasiquotes a
real fn using unquote. The restricted parameter AST (:any package) must fail
with the intended binding diagnostic; a legally renamed counterpart must
compile and execute, proving grammar validity. No kernel:lambda whitelist change.

Retain all existing regressions and add actual reviewed inputs for: later body
form, zero-arg shorthand and genfunc body tail, repeated-group last-wins,
computed callee, first kernel parameter default, kernel declaration destructuring
default and method parameter default, nested alias defaults, and public body-
to-post scope in both textual orders. Exercise native checked/stripped compile
and check and public complete/expandExpr/direct gate as applicable. Positives
must execute generated ESM and preserve proper local scope. Native body-before-
post must still run true; older post-before-body is rejected and recorded as
the distinct B2 limitation, not silently counted as a successful public parity
case. The nested alias witness's prior native parse result is confounded by
unlowered do: use it as a direct-gate regression, not an independent runtime
reserved-declaration proof or permission to repair that emitter.

The reviewer retained actual5bdb failing sources/results and immutable B1
ordering baselines. Use them as immutable witnesses rather than reconstructing
prior raw logs. Fresh focused tests precede full gates on the corrected source.
Do not rerun expensive gates on known-bad5bdb. The new public leaf and changed
classifier need embedded mirrors; actual M6 comparison union grows11→12
(classifier was already included; function-clauses.js is new). Execute all prior
public cases and the new regressions through the actual cold materialized map;
derive test counts. Full make check, docs once, committed citations and80KiB
remain required. No research helpers outside Lykn, no Python execution, no
new dependency or publication/release action. All LC-02–08 remain open.
