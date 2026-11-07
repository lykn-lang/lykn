# Draft review correction — correction3/5

Same approved Luna6 High CC and Sol6.1 High CDC, Autonomous Mode. Source
45fc835c2bcf0c4a713a49a9910bb3458feed4e9 preserves your complete UNACCEPTED
three-path draft. Planning5bcb4f7 preserves the corrected five-case baseline.
This is correction3/5 across Slice15; two remain, no stage reset. Reuse unchanged
guidance readings and the original plan, except this explicit affected refinement.

Earlier implementation01 native/public-JS greens occurred before the production
freeze; a later JS scanner edit and native unit addition were not rerun. Retain
these as draft observations, not proof of the current committed body. Do not
invent a pre-run snapshot or reconstruct missing receipt/pin information. State
exact available chronology/limits in a short raw index, including the attested
embedded-JS formatter attempt whose raw receipt is not presently retained.

CDC source review found a real draft regression: contains_current_await walks
class member names as operators. Native codegen emit.rs1346–1531 gives classes
their own member namespace; binding.rs class handling does not bind method names.
A method named await is a NAME. The JS draft raw-SExpr detector also deviates
from the original compiled-ESTree design. Correct these narrowly before accepting
the implementation, without changing the five shared fixtures or their oracles.

## Focused correction

1. Add a private native unit countercontrol in forms.rs BEFORE fixing the helper:
   class/class-expr method named await and deferred async method bodies must not
   mark their creator as suspending; an actual await in the eager superclass
   expression must be detected. Commit the unit freeze and run it on the current
   draft to retain the meaningful failure. One compact unit may cover these roles;
   no sixth shared fixture family, unrelated class implementation or runtime matrix.
2. Make only the NEW native current-scope scanner structurally follow the actual
   kernel class schema. Class superclass is the first expression INSIDE its bases
   list (not the list interpreted as a call). Member head/params/body are not
   current-scope calls; static/async wrappers and get/set/field/constructor use
   codegen's role schema. Eager superclass/static initializer evaluation belongs
   to the current scope; instance initializers and method bodies are deferred.
   Inspect actual field-name handling for non-atom expressions rather than guess
   computed-key semantics. Leave the legacy contains_await and other consumers
   unchanged. Preserve resolution-aware bound await calls and existing scalar
   unwrapping/boxed-value/selected-branch invariants.
3. Replace the new JS raw-SExpr detector with a private compiled-ESTree detector
   as originally assigned. Compile do statements/tail first, then inspect the
   resulting nodes; inspect compiled if branches for the fallback. Detect
   AwaitExpression and awaited ForOfStatement, stop at nested FunctionDeclaration,
   FunctionExpression and ArrowFunctionExpression. Class heritage/computed keys
   are eager; method function bodies and non-static PropertyDefinition values are
   deferred; static initializers are eager. An Identifier named await is never an
   AwaitExpression. Use actual compileClassMember AST roles, not raw name guessing.
   Keep canonical compiler.js and embedded mirror byte-equal. No AST normalizer,
   printer, public API, class lowering or unrelated legacy scanner changes.
4. Complete the private carrier invariant already required by the original plan:
   every NORMAL completion of a boxed async IIFE returns a carrier, including
   undefined; throws remain abrupt. Current statement-form tails/branches can
   fall through to raw undefined and then fail during unboxing. Add a compact
   private native structural countercontrol for normal statement fallthrough and
   current-scope return transport before correcting it. Append a boxed-undefined
   fallback for normal completion, and box returns belonging to THIS synthetic
   IIFE only (stop at nested functions/classes); do not turn throws into values or
   introduce a blanket outer-function return rewrite. JS follows the same AST
   scope/return rule. The guide's do last-value contract and existing statement
   handling establish this invariant; no new shared fixture/runtime family or
   broader return-language redesign is requested.

Allowed source paths remain the original allowlist, but this correction needs
only forms.rs and the two compiler.js files (private native unit in forms.rs).
Retain all bodies before edits/checks. Freeze final actual product/test source in
a normal commit BEFORE any fresh green runtime. Check actual executable paths,
hashes and source IDs before capture. Repeat the existing scope/class/bound-call
units and the SAME five native/public-JS runtime controls. Preserve all raw exits,
stdout/stderr and generated sources; do not weaken expected values or add cases.
Then complete the original focused regressions, fresh embedded mirror proof and
normal full make check/citation gates. Do not mass-format unrelated baseline JS.
Normal metadata environment for full Make; prior isolated npm/XDG and fixed
existing DENO_DIR pattern applies. No parser observations before CDC independent
acceptance. Return exact source/evidence tips and relinquish mutation ownership.

You own only allowed source paths and new raw evidence under
artifacts/repair/correction03/**; CDC owns all planning prose/ledgers/prompts.
No Python execution whatsoever, including replacements; no exception. No Ruby,
Fennel, handwritten research JS/Node/jq or shell-logic substitutes. Research logic
Lykn; native direct invocations/simple lifecycle/raw capture and authorized product
Rust/JS tests/compiler edits only. No hook bypass/no-verify/force/skip/suppression,
grant widening/generated patch/dependency or toolchain changes/integration/external
actions. Explicit-path commits, actual newlines with contiguous Codex/BilloAI
trailers and immediate rawbody checks. A real unrelated compiler/parser/offline/
oracle gap stops dependent work; normal source errors stay within the retained
five-correction budget. Preserve every old failure, violation and unrun denominator.
