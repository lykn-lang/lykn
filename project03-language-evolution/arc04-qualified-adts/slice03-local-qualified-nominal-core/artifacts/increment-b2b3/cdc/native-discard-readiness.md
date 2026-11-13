# Native discard first checkpoint — independent source readiness

Sol6.1High,2026-11-13. Operator policy B2-ID-DISCARD: `_` is true discard in
binding patterns; `_value` remains an ordinary binding. Reviewed root's bounded
message recipe against immutable57c76c99cbed07ff992e78aac8afefa4bdf0b2ad,
treef044d795e88c3dac8e84a73a557cf071edd5327c in assigned native source worktree,
branchcodex/qualified-adt-core. Root owns source/build/design and is writing18;
no source/build/test/Git/index/ledger mutation, implementation or acceptance.

**Bounded emitter/parsed-parameter recipe is coherent after root's guard/rest
and existing multi-shape dispositions.** One additional canonical classifier
acceptance gate for all-discard groups needs explicit scope disposition before
issue. This note does not choose an API/storage/phase beyond root's recipe.

## Concrete canonical admission gate

classifier/forms.rs1358–1365 rejects a grouped non-atom pattern whose
binding_names_in_pattern is empty; that helper already excludes `_`.
validate_bind_group_duplicates1452–1454 then rejects any group with no real
name (`bind group must declare at least one name`). Thus `(bind _ expr1 _ expr2)`
never reaches SurfaceForm/emit_bind_group. All-hole/discard grouped object/array
patterns can also fail the first gate. If18 promises these, it needs narrowly
scoped classifier acceptance of VALID all-discard patterns; merely removing
empty-name checks must not accept arbitrary malformed patterns. Otherwise
record the precise remaining canonical limit. A group containing a real
_value and discards can already pass; it alone cannot prove all-discard groups.
Duplicate real _value still needs its existing rejection. Sent this to root.

## Private storage and guard call-site coverage

- CompletionValueId is a checked per-EmitterContext identity, copied by value
  through cloned SExpr atoms (context.rs55–63, sexpr.rs246–255). Current private
  marker finalizer forms.rs352–403 reserves actual emitted names/roots then
  chooses one name per ID and clears it. Reuse for discard storage fits this
  invariant; not restricted to a returned completion result. Allocate once for
  each actual discard binding occurrence and reuse that exact identity in
  binder/guard reads. Tag-insensitive SExpr PartialEq is not proof of sharing.
- Scalar Bind forms.rs2813–2877 emits initializer with existing direct-return
  transfer handling BEFORE const and optional runtime check. Replace only the
  binding storage/actual guard operand; preserve that path's early return/
  throw/evaluation behavior. BindGroup2880 onward calls emit_bind sequentially;
  distinct discards need distinct private identities even if names are equal.
  Typed literal mismatch is rejected by analysis and literal checks are skipped
  here, so runtime guard proof must use a nonliteral value.
- Existing param_to_kernel_names3385–3459 and param_type_checks3462–3489 are
  separate traversals. Preparing output and checks together once per signature/
  clause avoids allocating unrelated discard IDs on the two traversals.
  Complete consumers: Fn/Lambda3503/3511; single Func3566/3573;
  multi Func3808/3821; single Genfunc4013/4020; Genfn4071/4078. Preserve clause
  sorting/dispatch_type/arity and generator error/yields/post limits. Multi
  clauses prepare separately, including destructured leaves and branch blocks.
- type_checks.rs32–134 build_check repeatedly reads a name, and
  build_error_message181–198 separately emits dynamic `(typeof param_name)`.
  Root's new private emit_type_check_value(actual:&SExpr,source_name:&str,...)
  must use actual in BOTH condition and got-type operand; `_` remains display
  label only. Keep public string API intact for constructor fields, returns/
  yielded checks and legacy callers. A wrong guard can throw on valid input or
  report undefined instead of the actual bad type; success AND failure controls
  discriminate it, unlike only checking generated text.
- Typed rest currently creates a raw _el__<name> loop local and iterates the
  original source param atom3469–3484. Discard rest requires prepared PRIVATE
  collection plus DISTINCT private loop-element identity; guard refers to that
  actual element, diagnostic source label `_`. Root explicitly agreed this.
  Reconstructing `_` or _el___ would lose the binding/label contract. Ordinary
  non-discard rest/public string-helper diagnostics should retain their scope.

## Patterns/defaults and explicit preserved limits

ParamShape typed leaf `_` is different from ArrayParamElement::Skip: classifier/
forms.rs2902 creates Skip only for raw bare `_` inside array syntax. Typed
`:any _` is a real consumed value assigned to private discard storage; it must
still perform normal IteratorValue/property/default work although any has no
check. Skip remains an elision. Object Simple field `_` is a PROPERTY key plus
discard local; emit an alias preserving `_`, including default/rest layouts.
Nested alias_name is a key/structural slot, not automatically a local to replace.
Existing param_to_kernel_names source default values are retained unchanged;
no source `_` body/pre/post/default rewriting or global spelling substitution.

Root explicitly preserves existing multi-clause limits: exact args.length and
const-binding-from-args3800–3815 turn simple default/rest parameter shapes into
invalid declaration syntax. This checkpoint does not repair/accept those forms.
Successful multi proof uses fixed simple/destructured shapes only; default/rest
success controls belong to single-callable signatures where actually supported.
Default side effects still occur once/only when missing, independent of private
storage; a default expression's own `_` reference remains source lookup. Do not
quietly change multi dispatch to variable arity or drop default effects.

Native emit_array_pattern443–467 currently writes separators only BETWEEN
elements, so a trailing raw Skip lacks the extra comma that preserves the last
elision's IteratorStep. Root's bounded writer repair is coherent: append needed
comma only when the last actual element is raw hole `_`; keep zero/multiple/
nontrailing hole/rest formatting and ordinary object `_` semantics. This
mechanical fix also reaches existing raw native array-pattern consumers; it is
not a new raw scalar/catch/loop discard transform. Iterator oracle must record
next calls AND distinguish value getter reads: bare Skip steps without reading
IteratorValue, while typed :any _ steps AND reads its normal value. A simple
[_,bound] fixture misses the trailing-hole defect; raw trailing/multiple holes
and typed consumed discard need separate valid controls. No run claimed here.

## Semantic introductions and non-goals

binding.rs1118 onward and typed_param_names619 already exclude literal `_` at
source binding pattern sites. Classifier record/capture/default/rest paths must
be checked as actual introducing sites, not changed by string-wide filtering.
Analysis is inconsistent today: Bind atom265 introduces `_`, grouped pattern
helper272 already skips it; parsed callable typed leaf introductions294/346/
365/377 include it. Root's scoped semantic fix belongs at these actual pattern
introductions. Do not change global ScopeTracker::introduce: Type/Constructor
names collect224–226 and other roles still need their own current contracts.
Pattern::Wildcard already does not introduce; do not invent a binding from it.
Preserve _value. Raw kernel/catch/loop/class param lowering is outside18.

Type constructors forms.rs3326–3375 intentionally emit their source fields as
schema/property keys and ordinary generated parameter locals; `_` here is NOT
converted by the parsed callable preparation helper. Do not accidentally route
all TypedParam values through discard semantics. Guard public API stays for
this producer. Constructor-field runtime/property preservation is a separate
negative-to-overbroad-transform control, not new ADT owner activation.

Source `_` uses stay untouched and resolve only to whatever ordinary source/
foreign binding remains, never to private discarded storage. Unknown/typeof/
outer lookup tests must not expect new unbound-name diagnostics or rewrite
pre/post/default bodies. Private source-looking completionValue__gensym names
must not acquire authority; finalizer reservation and current fragment/orphan/
serialization contracts remain. Full public/kernel/catch/loop/raw callable
lowering, ordinary runtime hygiene, owners/check join/DTS/docs/S06 and all
LC02–08/B2b/S03 remain staged follow-through, not discard-policy closure.

Planned runtime oracle set (not executed): repeated discard initializers/effect
order/early transfer; repeated parsed params with valid+invalid typed values and
exact source `_` got-type error; object `_` key/default/rest and _value control;
array Skip iteration-versus-value reads; single default/rest and later-bad-rest
member; fixed-arity multi-clause selection+guard (e.g typeof-number dispatch can
select NaN then real number guard rejects); generator actual iteration to force
checks; schema `_` field preserved; checked/stripped actual CLI/JSON/private/
full delivery with prior accepted scope retained. No arbitrary fixture grammar
or existing unsupported shape is preclaimed supported.

## Complete draft18 review and final root dispositions

Read complete cc-prompt-iteration18.md after root put it on disk, then refreshed
its amended multi/default/rest wording. **Source-ready for this bounded native
checkpoint; no remaining material contradiction found.** This remains design
readiness only. Source/build ownership stays root; no build/test/source/Git/
index/ledger change or implementation acceptance.

Draft18 explicitly authorizes6paths: emitter forms/type_checks, analysis,
classifier forms, native writer and new ordinary Rust discard_bindings tests.
It intentionally uses existing private ID/finalization lifecycle without SExpr
API changes. All5callable consumer routes and Bind/Group use prepared storage/
checks; actual value feeds BOTH condition and dynamic got-type. Rest uses
private collection+distinct private element with source `_` label; source
body/pre/post/default references and constructor-field producer stay untouched.
Native trailing-hole comma is the only shared raw writer correction; no generic
raw scalar `_` pattern conversion. Full public/raw kernel/catch/loop/class and
remaining source/owner/DTS/docs obligations are explicitly carried.

Root settled the canonical admission gate narrowly: remove only duplicate
validator's final seen.is_empty rejection, so valid repeated scalar `_` groups
reach emission; keep earlier non-atom-pattern admission/typed-atom/malformed
checks and named duplicate errors. All-discard grouped non-atom patterns remain
explicit follow-through. This resolves the earlier source-readiness gate
without claiming all-discard grammar closure.

Root also narrowed the existing multi limitation precisely to TOP-LEVEL
ParamShape::Simple default/rest. Nested object defaults and array-rest inside
multi destructured parameters produce valid const destructuring syntax and
remain supported/prepared/guarded and tested. This matches actual3806–3815/
3385–3459 source and avoids treating supported nested paths as unsupported.
The original broader multi-limit wording in the earlier preparation above is
superseded by this precise disposition; no source behavior was tested here.

Final runtime test traps retained: generator checks require actual next()/
iteration; nonliteral typed Bind for runtime checks; both good and bad values
for private-identity coherence; iterator steps versus value-getter reads and
close; _value ordinary duplicate/shadow behavior; real foreign global99 rather
than `(bind _ 99)`; source default/pre/post `_` free lookup must not become
private storage; schema/property `_` keys and constructor guards unchanged.
The issued staged row can only accept its native bounded usable result after
separate software verification, not the whole operator discard policy or S03.
