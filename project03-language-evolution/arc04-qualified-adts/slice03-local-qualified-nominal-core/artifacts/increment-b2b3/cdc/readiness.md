# Native runtime-name direction — independent source constraints

Sol6.1High,2026-11-13. Read complete UNISSUED
artifacts/b2-native-runtime-name-plan.md against immutable native
228e8c99707e5dc4ee86a50e8aea532c9a99a80b,
tree5a2c9a4ba836aaf6e34ef63c04f08b7f47621877 in taskworktree
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
branchcodex/qualified-adt-core. This is preparatory source constraint review,
not implementation readiness of an as-yet-unspecified API or runtime acceptance.
Root owns design/remaining author readiness; Luna owns active public17 source/
build. No tests/build/source/Git/index/ledger mutation or helper was performed.

## Concrete table corrections and consumption constraints

1. **Direct named default declaration distinction.** Native writer
   codegen/emit.rs1653–1660 emits export default followed by direct emit_expr,
   without expression-forcing parentheses. A direct named function/class
   (including actual async/generator payload) is therefore the named-default
   declaration position; wrapped/conditional value is an expression. Initial
   plan wording 'default expression stays expression' was too broad. Root has
   corrected the table and preserved the already-required B2a R04 distinction.
   Name-plan role must depend on output position, including named class used
   as an initializer expression, not solely kernel head class/function.
2. **Catch does not use ordinary pattern writer.** emit_try1001–1004 calls
   emit_expr on its binder; functions/declarations use emit_pattern. Consequently
   `(catch (array _) ...)` is emitted as catch([_]): `_` is an actual catch
   binding. emit_array_pattern451–453 instead treats `_` as a hole. An ordinary
   array-pattern walker silently reused for catch misidentifies that legal
   emitted shape. Object catch payloads follow emit_object (including tuple
   key/value consumption), not alias/default/rest pattern consumption. Exact
   catch grammar/valid-shape disposition must be explicit before issue; do not
   silently introduce new pattern support or treat malformed output as accepted
   execution. This concrete constraint was sent to root; no runtime is claimed.
3. **Not every structural consumed head uses as_form_head.** emit_async612–640
   dispatches consumed payload =>/function/function*/lambda using raw as_atom;
   is_async_declaration55–73 uses the same raw payload head. For clauses,
   emit_for_clause787–795 accepts raw const/let/var in ALL three header slots,
   not only init. Try catch/finally970–985, switch default903, class member
   heads1455, object/spread/computed and tag's template payload1326 are likewise
   structural raw grammar. Role selection must reproduce those actual doors,
   even when an occurrence carries a binding tag. Preserving completed dispatch
   cannot be implemented by uniformly re-running generic form-head resolution.
4. **Actual function shape/position.** function541–564 always uses name args0,
   params args1/body2..; function*568–603 switches anonymous params0/body1.. only
   when args0 is List. lambda529–539 is anonymous params0/body1..; arrow488–527
   has expression body only when one body child is not actual unbound block,
   otherwise a block. Header non-List currently emits no params. Statement
   classification23–46/emit_statement110–157 and raw async wrapper affect actual
   declaration syntax. Thus params/body selection and declaration-vs-self scope
   cannot be inferred from one generic function-layout assumption.
5. **Remaining writer roles align with bounded table, with consumed-slot limits.**
   For-of/in/await-of833–887 emit const+emit_pattern then RHS then body block,
   reject wrapped declarations. Switch uses one emitted brace pair/no per-case
   block. Try removes ALL structural catches/finallys, emits only selected last
   ones and retains other source body forms in order. Class bases consume first
   list element only; class-expr is inherently anonymous. Member static/async
   recurse child1 only; non-atom member head is omitted entirely. Field writer
   only consumes name and optional value; atom keys are property roles, while
   malformed non-atom fallback emission is not a new binding grammar. Object
   tuple consumes key/value only, spread consumes child1; computed marker
   unwraps child1. Arrays consume every ordinary element/spread child1. Get,
   dot, assignment/pattern/default/alias/rest, label, export/import and regex
   must retain their actual extra-argument/structural-slot behavior. Cons writer
   is comment-only; a conservative SOURCE reservation scan may still inspect it
   without claiming kernel executable scopes for it.

## Scope/finalization constraints before numbered authoring

- ContainsExpression is not a current native helper: immutable src query finds
  none. lexical_regions collect_default_paths350–400 is an occurrence/default
  selector, not a JS callable instantiation proof. Kernel defaults occur in
  nested pattern/default RHS and alias optional default (emit.rs1349–1383),
  while parameters are all rendered by emit_pattern. Root still owes precise
  parameter/body var coupling plus valid non-simple-without-default controls;
  source writer shape alone does not prove TDZ/instantiation runtime semantics.
- For-loop RHS TDZ, catch simple-param versus body var initializer coupling,
  class outer/inner declaration coupling (including inheritance TDZ and method/
  field environments), block function hoisting and expression self binding
  remain exact graph/fixture obligations. Exact-spelling coallocation can keep
  output names coupled, but is not itself proof that distinct binding IDs or
  occurrence roles are correct. No runtime/spec experiment was performed here.
- Actual canonical order is emitter/mod.rs37–61: create context, emit every
  owned form, finalize completion, Kernel protected validation, materialize
  invocation, lower host references. Desired post-materialization name stage
  therefore needs the explicitly outstanding validation placement decision.
  codegen/mod.rs53–63 validates Kernel again; emit_json calls emit then JSON.
  json::emit_module_json63 lowers host refs again. A second consumer/name-plan
  pass must preserve already-lowered aliases/dispatch: root's added SAME safe
  raw spelling for every definition+bound use (not just array call head) is a
  necessary idempotence constraint. JSON29–35 drops NameRes/private atom tags.
- AtomData fields are private; existing with_name_res changes tags only and
  finalize_completion/host_reference changes names only when their own marker
  is present (sexpr.rs275–325). There is no ordinary rename accessor to reuse
  without a new precise scoped API. Root must settle it while preserving span,
  NameRes and unrelated private metadata; never reconstruct via SExpr::atom.

## Early producer/reservation census

EmitterGensym currently has only usize counter, unchecked next+=1 and public
reset (gensym.rs6–27); it knows no source reservations. Canonical emit's single
EmitterContext is created before first emission. Product calls include
value_box226, dissoc discard/rest3123/3126, await3234/4417/4766,
thread t3247/3275, function result3615/3696/3849, yielded yv4125, and match's
next_unreserved_gensym4328. The latter has a local emitted-name reservation
only; it does not supply complete unit source ownership to other producers.
A separate EmitterContext::new inside emit_if_iife5133 is a synchronous false-
async wrapper path (2727→5127); it currently does not allocate a gensym, so it
is not evidence of an unseeded allocating producer. Public emit_form281 and
EmitterContext API remain distinct fragment dispositions, not automatically
covered by canonical preseed.

Complete SurfaceForm reservation cannot be typed_params()/bound_names(): source
string fields include Func/Genfunc/MacroDef names, Type/Constructor/fields,
TypeAnnotation names, Pattern constructor/binding/object keys, nested ParamShape
alias/property strings plus typed leaf names/defaults, all clause pre/post/body,
Match guards/bodies, BindGroup names/values, ThreadingStep Bare/Call, Obj/Assoc/
Dissoc strings, Export inner+extra/Exports names, Class name/superclass and
ClassMember prefix/body/init/Raw, KernelPassthrough and FunctionCall head/args.
All remaining expression variants' SExpr fields require recursion (surface.rs
1–478). A conservative source reservation may include property/data names;
that is different from declaring them bindings in the kernel graph.

Early-normalization query found protected_host scope collection/is_local/path
normalizing local names before source lookup (152/228/311/355/437–446): root's
exact-local-first change is necessary there, not fixed by a late graph alone.
analysis/scope.rs91–107 still rejects same-scope normalized collisions BEFORE
emission; the plan explicitly retains these diagnostics, so emitted hygiene
cannot be claimed to accept those currently rejected programs. Emitter raw
runtime constructor/field/param atoms retain original strings (forms.rs3326–
3461); queried to_js_identifier uses elsewhere are display messages, direct
admission/shape checks, normalized property key data or local reservation,
not evidence of wholesale early source-value normalization. DTS independently
normalizes source names (dts.rs113/196/205 onward), so late JS plan cannot by
itself guarantee coherent declarations; its stated consumer census remains due.

No final API/storage/phase choice is selected here. Root has already named the
remaining author requirements and must resolve catch/structural grammar plus
complete visitor/error/placement/.lyk/check/DTS/fragment census and concrete
outputs before implementation issue. B2-ICU-P, general source hygiene,
owner/case activation, LC02–08/B2b/S03 are not accepted by this preparatory note;
B2-ICU-N and prior accepted rows stay within their existing limits. Initial combined reads
truncated, then affected snippets/callers were recovered; immutable queries only.
