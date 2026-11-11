# IC-01 binding-role contract and revised implementation

Root contract v1, against clean B1 3f197340/tree9ee95765 on
codex/qualified-adt-core. The operator explicitly authorized settling this
contract, implementing the bounded repair and independent validation before
qualified constructors (2026-11-11), Luna 6 High CC / Sol 6.1 High CDC,
Autonomous Mode. No release integration or remote action is included.

This supersedes the incomplete traversal recipe in
[the preserved initial design](reserved-binding-repair-design.md). Its finite
keyword/strict-binding policy, unchanged DD-49 conversion, native check reuse,
actual executable-ESM oracle and delivery requirements still govern. Its ban
on source-role corrections and naive recursive post-expansion gate do not.

## Binding contract

Validation enumerates actual binding occurrences in executable syntax under
the incoming lexical environment. Spelling alone does not establish a binder.
It must not expand macros, evaluate code, mutate reader nodes, reset state or
invent source bindings. The source and lowered-kernel stages share projection
helpers but have explicit parameter/pattern grammar where their shapes differ.

| Role | Required action |
| --- | --- |
| Binding leaf | Validate its DD-49 emitted spelling, retaining raw name/kind/span; keywords and strict eval/arguments are separate categories |
| Binding pattern | Project only bound leaves; type annotations, keys and grammar markers are structure; visit executable defaults separately |
| Executable expression | Resolve whether its head is a language form or an ordinary lexical call before projecting binders; visit computed callee and call operands independently |
| Structural member/property/import/export slot | Do not dispatch its list as a form; visit only actual executable values, computed keys, method defaults/bodies or declaration payloads |
| Quoted data | Do not project binders or visit contents as executable forms |
| Quasiquoted template | Track quasiquote depth; visit unquote/splice expressions active at depth one; nested quasiquote changes depth, an ordinary quote-shaped list inside the template does not |
| Lexical sequence | Use existing sequential/grouped binding visibility, body boundaries and per-clause scopes; never leak nested body parameters to siblings |

Unresolved source heads are gated by the incoming lexical names. Tagged bound
heads are calls. Explicit kernel escapes and compiler-owned kernel forms keep
their existing dispatch authority despite a same-spelled local. Public checks
use isKernel from the dependency-free kernel-mark module where necessary.
Private compiler atoms retain their existing identity exclusions. No spelling
or JSON marker gains compiler authority.

Quote/quasiquote rules apply when the node denotes that syntax in its actual
pipeline, not when the word is an ordinary lexical call. Preserve actual
expansion ordering; this task does not add a macro phase or replay a macro.
Native validation runs after existing expansion/resolution; public validation
checks both actual input and actual expanded forms. A bound call to bind with
an eval argument is valid reference syntax, not a declaration.

## Scoped projection and walker recipe

Keep binding knowledge in binding.rs / binding.js. Extend the existing shared
projection for real kernel function parameters and nullary type constructors;
do not create a second free-standing validator with an independent binder list.
Use small private role/parameter/default helpers there. Keep the existing
public return shapes and no-argument behavior. No source AST or private-atom
cloning is needed.

Public walkBindings(forms, { bindings = new Set() } = {}) copies its incoming
Set for private traversal; validateReservedNames accepts the same options and
forwards them. Existing one-argument callers remain valid. Native public
walk_bindings/validate_reserved_names retain their signatures, using an empty
initial scope and actual NameRes tags plus private lexical traversal. No new
native public context object is required. Record the additive public JS option
and corrected diagnostics for S06.

Implement walk sequence / walk expression / walk pattern-defaults / walk quoted
template as distinct private operations with explicit scope ownership. Native
enums for role/dialect/depth states are preferred to positional boolean flags;
JS options/record values make those states explicit. Reuse existing binder and
scope helpers for ordinary source forms; add the precise exceptions below.
Avoid a whole-tree bindings scan followed by a second spelling filter.

- A lexical call projects no binders. Traverse its computed callee and each
  argument with the incoming scope; declarations inside one operand do not
  become siblings of another. Ordinary sequence blocks retain sequential scope.
- Grouped bind visits each initializer before extending with that pair's
  projected names. Conditional operands are separate. Match subjects are outside
  clause bindings; each real pattern, guard and body has its own clause scope.
  Reuse existing match-clause projection and grouped-binding grammar.
- For plain kernel function, preserve its required name plus parameter list.
  Kernel lambda is the existing anonymous regular-function form; function*
  supports named/anonymous shapes. For => use its first argument as the list. Function
  name is an enclosing binding only for the existing named declaration shape;
  parameters are Param, never Bind. Project rest/default/destructured leaves
  from the actual source or kernel grammar: kernel default is (default name
  value), while the existing typed source default includes a type slot.
  Defaults are executable values, not binder lists. Own function name and all
  parameters form its inner scope; none of its parameter/body additions leak.
  Validation of source multi-clause functions keeps separate clause parameter/
  body scopes. Do not infer full existing source-expansion clause-scope repair
  from the narrower kernel D1 change; see the explicit carryover below.
- Adding kernel parameter occurrences must update the actual D1 function scope
  plans as well. In JS bindingScopePlan and native resolver::scope_plan, special-
  case function/function*/kernel-lambda/=> before the generic declaration-Sequence case.
  Their inner environment includes own name and parameters; only the existing
  named declaration binding hoists to following siblings. Header binder atoms
  must retain definition identity and default expressions see parameter scope.
  Do not accidentally hoist Param kinds or alter ordinary const initializers.
- Object construction visits each value/computed key/spread operand. It never
  dispatches the enclosing property pair: (object (const eval)) is a property
  named const whose value is the global eval. Surface obj alternating keys and
  values and source/kernel object pairs remain distinct grammar. Destructuring
  object patterns project local names, not external keys, and visit defaults.
  Kernel object patterns include (alias key local [default]): project local,
  visit the optional default, never project the external key. Array _ is a hole.
  Reuse native semantic_roles::object_property_role for actual kernel objects;
  preserve its existing native dynamic-list-key versus public explicit-computed
  distinction rather than inventing cross-backend syntax in this repair.
- Class/member validation projects the class binding and each actual method's
  parameters, visiting that method under only its own scope and the class scope.
  Member names, accessor/static markers and base-list structure are not forms.
  Visit executable bases/field initializers/computed names as their grammar
  specifies. No method parameter may mask a form in another method's validation.
  Handle classes explicitly before the validator's generic projection branch.
  Keep the legacy aggregate classNames/class_names D1 adapter unchanged; do not
  append new accessor/wrapper/destructured parameter sites to that aggregate.
  Private member-role queries in the same binding component use the existing
  pattern/parameter helpers, projecting each member for validation only. This
  separates an actual per-member query from the legacy aggregate consumer;
  it is not an independent spelling-based binder inventory.
- Import projects local aliases only and export visits declaration/expression
  payloads only. Labels use a separate namespace: eval/arguments labels are
  valid, but reserved identifiers remain invalid. Labels never shadow forms.
- Public typeConstructorNames must include atom-form nullary declarations.
  (type Metadata package) emits a binder and is rejected; (type package Safe)
  still has a metadata-only type name and remains valid at this checkpoint.
  Legacy field parameters are real bindings; future qualified payload-key
  hygiene remains B2, not permission to ban legal data keys.

## Lifecycle and bounded source changes

Keep early complete-public validation, now role/scope aware. Add final validation
after Pass 2 before host support materialization. Public expandExpr validates
input with its supplied binding Set and actual result with the same incoming
Set; no new import/registration phase. It must handle a result form array
without wrapping it as an extra form or losing the B1 context boundary.
Native check_strict uses validate_compile_forms instead of its duplicate groups;
normal compile/dist retain the same shared priority. Normalization uses the
existing converter; public identifier.js is a dependency-free extraction with
the old compiler.js export preserved. No new entrypoint/dependency/option for
disabling correctness validation is added.

The source edits are binding.rs, resolver.rs and focused tests; CLI compile.rs
and M6; public binding/compiler/reserved-words/expander-core and new identifier
leaf, with five embedded mirrors. Other source-role/expansion semantics are
not a general rewrite target. If a concrete test reveals an additional necessary
bounded role case, return the finding to root for explicit recipe correction.
No arbitrary ignore-list or diagnostic swallowing is allowed.

The M6 union is eleven: existing nine plus reserved-words.js and identifier.js.
Retain actual materialized runtimes and add the new regression file there.
Browser compile, actual generated module execution, full make check, committed
citations and 80KiB gzip gates remain mandatory after focused green controls.

## Discriminating tests and applied guidance

In addition to the initial design's negative and legal-ESM oracles, test:

1. Source macro returning an fn with restricted parameter; named kernel function,
   anonymous kernel lambda, generator, arrow, rest/default/destructured cases.
   Bound form-named parameters must gate dispatch within the body and must not
   affect following siblings. Two different function clauses cannot share scope.
2. Quoted (bind if! 1) accepted as data; public quasiquote at two depths with active
   unquote containing a real restricted binder rejected, inactive inner data
   accepted. Native quote and actual macro-template compilation are covered;
   native top-level runtime quasiquote is not an existing supported path and is
   not added or claimed. Do not use only a structural node-count assertion.
3. (obj :const eval), reserved object keys, computed-key/spread values and legal
   method names compile/run. Restricted binders in executable property values,
   defaults and method bodies are rejected. A property's list head is never
   accepted as a declaration merely because its spelling is const or bind.
4. Public expandExpr with supplied Set containing bind accepts (bind eval 1)
   as an ordinary call; complete native/public source binds bind to a function
   then calls it with eval. Compare actual output/runtime. Tagged call-head
   controls and kernel escape/trusted-lowering controls remain distinct.
5. Nullary constructor versus erased type-name pair, import external/local name
   pair, and strict-binding versus label pair give opposite expected outcomes.
6. Reproduce package and normalized-name failures against immutable baseline,
   then exercise real default/stripped native compile, native check, complete
   public/expandExpr, actual embedded and browser routes. All accepted generated
   ESM witnesses must execute, not merely pass deno check.

These are normal product compiler tests, not a new handwritten JS research
harness. Any helper/research orchestration is Lykn-only. No Python execution.

| Guidance actually consulted | Applied decision and proof |
| --- | --- |
| Rust type-design TD-01/02, SHOULD | Use explicit private role state and existing BindingKind, not ambiguous flags/string identities; source-span and role-negative controls |
| JS API-design ID-01/02/03, SHOULD | Required forms argument plus optional incoming bindings options with two-level defaults; old callers and supplied Set preservation |
| Existing A/B1 private identity contract | Traverse without cloning/mutation or private marker imitation; retain all-nine reference and re-entry regressions |
| Prompt-authoring sections 3–5 | Resolve stage/scoping interactions before issue; actual macro-lowered and data/call counterexamples discriminate the incomplete draft |

Separate Sol source-readiness lookup supplied exact grammar/caller corrections,
adopted by root before issue: plain function is named (anonymous uses kernel
lambda); typed/kernel rest/default positions differ and aliases project locals;
native top-level runtime quasiquote is not promised; ordinary quote-shaped
template lists do not add quasiquote depth; source Func's existing clause union
is explicitly carried below instead of falsely claimed fixed by kernel plans.

LC-02–08 stay open after this prerequisite. It accepts no qualified ownership,
nominal values, purity, declarations or final migration, and changes no release.

## Explicit existing scope carryover

The public surface Func expansion preextends its child environment with
bodyScopeNames, which currently unions source multi-clause parameters before
kernel lowering. This is a source-inspected existing scope issue distinct from
the new validator's per-clause environment. This prerequisite must not add that
union to its validation walk or claim to fix the general surface-expansion
issue by adjusting only kernel scope plans. Retain it as a concrete B2 lexical-
identity input in local-owner-preparation and later acceptance. Tests here prove
per-clause binding-validation decisions, not full function-clause macro dispatch
equivalence. The original B2 typed/lexical criteria remain open for that work.

Likewise, existing D1 classNames/class_names flattens bare method parameters
into the whole-class environment. Do not widen it with newly recognized member
shapes in IC-01. Per-member role queries here serve validation only; the legacy
aggregate adapter and its corresponding source scope need a proper B2 lexical
disposition. No general class/method expansion/resolution repair is claimed.
Sol's final readiness ambiguity is resolved by this explicit validation-only
member boundary; the new D1 implementation scope remains kernel functions.
