# Native runtime binding-name plan — source-readiness draft, not issued

Root2026-11-13. This refines the runtime-name direction in
b2b-owner-unit-preparation.md after the operator selected exact source identity.
Current native ICU candidate228e8c99 and public follow-through17 remain separate
gates. This is not a CC assignment or claim of implemented scalar-name hygiene.
Typed source owner/query BindingId, OwnerRef/CaseRef and nominal activation
remain their original B2b obligations; the plan below is the later runtime
namespace, not a retrospective source-owner search.

## Recommended private boundary

One private owned KernelNamePlan per complete canonical emission. Build it over
the actual completed Core Kernel after completion, host invocation and host
reference materialization; then rewrite names/dual-role slots before returning
emit/emit_json. No global current unit, filesystem/import resolution, runtime
helper or public serialization metadata. Whole-unit caller consumes plain
fully lowered kernel afterward. Raw fragment/writer entrances require their
own explicit API disposition; do not claim canonical proof covers them.

Use distinct private RuntimeScopeId and RuntimeBindingId types, source spelling
and declaration role, and occurrence paths into the one original kernel
tree. Paths identify this traversal, never bindings or cross-unit authority.
One binding can have several var declaration sites. An ordinary value use is
Bound(RuntimeBindingId) or Foreign with its existing JS interop target. Keep
property/API names, syntactic heads and label namespace separate. Preserve
original form-versus-call decisions; a runtime-hoisted declaration cannot
redispatch a form that expansion already selected.

Implementation may use an arena plus scope parent links and per-scope exact
name maps. First collect actual declarations/hoists for each runtime region,
then resolve uses. Avoid a clone of the entire subtree at every node or a
parallel mutable global environment. Rewriter walks original positions and
builds output; expand an individual shorthand in place. Inline export splitting
at module sequence must not shift the occurrence paths still being read.
Retain original spans and private tags with a narrowly scoped atom rename;
do not reconstruct atoms in a way that silently drops unrelated metadata.
All unfinished host/completion markers must have a concrete rejection/
finalization disposition before this stage, never accidentally lose authority.

## Actual writer scope and role table to implement

This table is grounded in native codegen/emit.rs at228e8c99, not an abstract
JS AST grammar. Dispatch uses as_form_head; structural pattern/member/module
markers use the actual raw accessors as their writers do.

| Kernel shape | Binding/scope and executable operands |
| --- | --- |
| module / block | Module or lexical sequence; precollect direct lexical declarations and function-scoped var hoists without crossing callable/class boundaries. |
| const/let/var | args0 is binding pattern; args1 initializer only. Lexical binding exists for whole region, including own initializer TDZ; var uses nearest var environment. Ignore extra unconsumed args. |
| function / function* / lambda / arrow | Distinguish expression/declaration position and named-expression self binding. Parameter definitions precede defaults. Body var environment splits on actual parameter ContainsExpression, not merely non-simple shape; preserve same-name var/parameter relationships. Functions stay hoisted, const stays TDZ. |
| async | Only the consumed payload; callable wrapper does not invent another scope. |
| if | Test parent; each emitted arm owns one block, explicit block retained once. No sibling-arm declaration leakage. |
| while / do-while | Condition outside body block; body statements in block. |
| for | init/test/update header; lexical init owns loop environment, var remains function-scoped. Body separate block. Honor bare declaration clauses as writer consumes them. |
| for-of/in/await-of | Bare binding is const in loop environment; iterable and pattern initialization must use real loop TDZ semantics. Wrapped declaration remains rejected. Body separate block. |
| switch | Discriminant parent; all actual cases share one lexical case-block. Case tuple child0 is case expression, raw default is marker; no case keyword. |
| try | Selected last catch/finally structural clauses only, other actual body forms in try block. Catch binder/handler scope separate; finally separate block. Do not visit superseded ignored clauses as declarations. |
| class / class-expr | Decl name has outer and class-inner coupled spellings; bases consume first entry only. Member keys are properties; each method/getter/setter/constructor owns params/default/body. Fields consume value only; static/async wrapper consumes inner member. |
| object expression | Bare atom means key+value. Tuple key atom/string is property data; computed key is executable, tuple value executable, spread operand executable. Never mistake property tuple for declaration/call. |
| binding/assignment patterns | Separate Def vs Use. Object shorthand preserves key; alias key/local/default have separate roles; array _ is hole but object _ is actual name. Rest/default use actual consumed slots. Defaults are expressions in the proper parameter/declaration environment. |
| import | Module string/remote names are data/API; local default/named/alias slot defines binding. Preserve actual existing grammar; do not invent namespace-import support. |
| export | Local occurrence vs public API name vs remote reexport. Renaming must retain live public alias; default expression stays expression. Inline named declaration may split into declaration plus explicit export aliases at same evaluation position. |
| colon atom / get / dot | Colon first segment is lexical root; suffixes properties. get consumes object/key expressions. Dot atom method is property; non-atom consumed method follows actual writer expression behavior. |
| label / break / continue | Own label namespace, active only in its statement region and not through functions. Bind/use exact spelling; do not accidentally treat labels as value references. |
| seq / operators / calls | seq is comma expression, not block. Preserve already-selected kernel heads; visit only consumed operand slots. Ordinary callee/arguments are values, not sibling declaration sequences. |
| template / tag / regex | ICU keyword keys and literal text are data; kwarg values executable. Concat nonstrings executable. Tag callee and template values executable; regex string/flags data. ICU late locals use their independently reviewed allocator. |
| literals / Cons | Literal data has no value bindings. Current writer emits Cons as comment; do not infer executable variable scope from its payload. |

The loop iterable TDZ, parameter ContainsExpression, named declaration vs
expression and class/catch var coupling need precise final source/runtime
discriminators before issue; do not paper over them with a string map.

## Hygienic output allocation

Runtime BindingIds remain distinct even if same-spelled bindings can safely
reuse an emitted name in different scopes. Recommended coallocation by exact
raw spelling across the unit preserves existing JS scope coupling/output
without assuming equal BindingIds. Distinct raw groups get distinct emitted
names when preferred normalization collides. A resolved occurrence chooses its
binding group's allocated name; an unbound foreign occurrence keeps its own
existing interop target. A global raw replacement without resolved occurrence
roles cannot implement this contract.

Reserve all actual foreign JS root targets before allocating local groups.
Preserve the first safe preferred name; suffix occupied candidates with checked
deterministic search, reserving every result and avoiding all other existing
preferred names. No reserved-looking prefix is an unforgeable namespace.
Same-scope duplicate/normalized/export diagnostics remain; do not uniquely
rename invalid duplicates into accidentally valid code.

Keep ordinary noncolliding raw variable spellings where possible. If an
already-resolved variable call has a raw spelling that would redispatch as a
kernel form after JSON loses tags (e.g. array), use a kernel-safe raw spelling
that maps to the SAME chosen emitted JS name, such as array! after verifying
normalization. It is serialization of the completed name plan, not new source
authority or an annotation field. Property keys/import remote/export API names
must retain original normalization through explicit key/local aliases.

## Producer collisions and policy validation

A late plan cannot recover distinct compiler/user bindings after an earlier
producer merged their exact raw strings. Native EmitterGensym therefore needs
complete source-name reservation before emission, or private generated IDs
through every producer. Root's recommended bounded route is per-unit source
reservation: recursively census all owned SurfaceForm fields and nested syntax,
including reconstructed function/type/parameter/pattern names, then seed the
owned emitter generator before its first allocation. Existing counter uniqueness
separates generated bindings; reservation separates them from source/foreign
spellings. Do not use incomplete typed_params()/bound_names() projections.
Do not claim this newly solves arbitrary user-macro gensym transport.

Protected-host Surface lookup must check exact source local root before
normalizing a foreign protected target. Finalized Kernel validation sees actual
allocated names. Preserve finite protected slots/unknown/dynamic policy, all
private aliases/Reflect fallback and fragment/orphan/recovery behavior. Native
module helper fallback may remain conservatively selected; do not make an
optimization claim or accidentally remove a necessary inline import.

## Outstanding author readiness

Before a numbered assignment, root still owes complete SurfaceForm reservation
visitor fields/call sites, exact private plan/error/rewriter API, all consumed
expression-role table details, placement relative to final kernel validation,
actual canonical/.lyk/check/DTS/fragment consumer census and discriminating
fixtures with concrete outputs/errors. Required change/preservation pair is
some-name/someName=>1 and hoisted helper=>41. Add same-raw shadow/TDZ/defaults,
foreign normalized target, properties/shorthand, import/export/live binding,
labels, macro-shared syntax, JSON, private/host/completion and real CLI/cold
consumer proof. No source naming acceptance follows from this draft.
