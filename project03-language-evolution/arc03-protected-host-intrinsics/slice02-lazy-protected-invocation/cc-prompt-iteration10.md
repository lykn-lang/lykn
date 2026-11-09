# S02 iteration 10 — align whole-unit kernel binding roles

At clean formatted `aa6fa30aa77b3c98ca201891575863ef7503f34a`, fresh
arc review traced two source-proven failures of the same whole-module
contract. No final validation ran. The tenth numbered assignment is
five beyond the normal ceiling under the Operator's standard Autonomous
Mode instruction to fix clear in-scope issues. Same Luna 6 High CC and
Sol 6.1 High CDC. Preserve both witnesses, prior accepted S01 history and
actual 8e122ad product observations.

1. `(bind Reflect! local)` in raw native kernel emits an ordinary
   `bind(Reflect, local)` call (also reached via documented `js:call`).
   The surface-aware module scanner wrongly invents a binding, selecting
   the loader-sensitive fallback and potentially hiding a following
   real-global write. Public S02's emitted-ESTree selector is already
   right, but S01's public raw-kernel root scanner also counts the bind.
2. `(export (function Reflect! () (return 1)))` introduces a real
   normalized local binding. A following `(= Reflect:apply 0)`
   is a legal local write. S02 identifies the actual binding; S01's
   outer module scope has not unwrapped that declaration, so the
   validation gate can incorrectly reject. The same declaration
   ownership applies to emitted async function and named default
   declaration paths.

Change these private files only: `crates/lykn-lang/src/protected_host.rs`,
`crates/lykn-lang/src/codegen/mod.rs` test section, canonical
`packages/lang/protected-host.js` and its exact embedded mirror,
and `test/forms/lazy-protected-invocation.test.js`. This expressly
adds the two private protection JS mirrors to the prior allowlist
only for the necessary composed kernel correction. No public API,
source syntax, facility/docs/fixture/optimizer oracle changes.

Native: create/reuse one private module kernel names collector
for both `validate_program(..., InputDialect::Kernel)`'s outer
scope and `module_binds_reflect`. Keep the existing Surface route
and nested-scope behavior. Collect actual final-kernel direct
`const/let/function/function*/class/import` declarations using
existing pattern/name helpers after the real head is identified.
Unwrap genuine exported declarations, named defaults and async
function/function* payloads. Native writer's async payload head is
a structural atom slot; its declaration name is the first argument.
Skip re-exports/anonymous functions and use `as_form_head` for
ordinary dispatch. Reuse the existing executable var hoist walk,
with a mode if necessary, so this raw path counts `var` and never
raw `kernel:var`; preserve existing Surface/nested callers'
behavior. No raw `bind/func/genfunc/type` or explicit surface escape
may manufacture a module binding on this final raw route.

Public: `validateProtectedHost` starts its complete unit with
`visitMany(exprs, ..., 'kernel', visit)`. Replace only that root's
scope gather with the raw kernel declaration rules of the actual
`compiler.js` dispatch. Reuse `addPatternNames` /
`bindingsIntroduced` after identifying actual direct declaration
heads, export wrapper and real async function/function* payload.
Public async uses compileExpr on its child; use its actual formHead
behavior. Reuse the var walk in raw mode without explicit escape
reinterpretation. Keep existing nested Surface helpers and its
emitted-ESTree S02 selector. Compare mirror bytes before freeze.

Extend the existing native and public binding-role focused test with
paired compile-only discriminators. For `(bind Reflect! local)
(saved receiver argv)`, assert actual ordinary `bind(Reflect, local)`
and requested local helper with zero inline URL. In the same raw
unit with `(= Reflect:apply 0)` added, assert the exact v1 protected
slot diagnostic (Rust existing typed Codegen, JS existing Error) with
and without an otherwise valid private request, before output. Then
with a real exported named function or exported async function
`Reflect!` in place of the call, the same write compiles, remains
a local property assignment and the requested output selects one
inline URL. The empty plan has no inline URL. Add raw `kernel:var`
negative with ordinary-call shape if useful for the exact mode
distinction. Keep all current positives, controls and Surface tests.
These are compiler-output tests. Never execute a protected global
write or add an evidence fixture family.

Use actual repository formatter, standalone format check and normal
exact-path `git commit --only -F
/private/tmp/lykn-hi05-cdc.Goin1Htz/source-kernel-role-message.txt`. Return immutable clean
source for static review. Then [iteration 08](cc-prompt-iteration08.md)'s
normal Make, citations and postbuild exact artifact comparison apply.
Prior CC 14/20 retained only if regenerated inputs are byte-identical.
CDC repeats final focused, 14/20 and normal gates. No release, S04 or K.
