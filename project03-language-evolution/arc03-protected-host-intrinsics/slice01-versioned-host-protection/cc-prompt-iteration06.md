# Arc03 S01 correction04 — exact v1 dialect, scope and path proof

The Operator authorizes one consolidated correction for the seven
recorded static findings, then the original S01 validation. This is
source refinement 04 of 5. Luna6 High CC implements and separate
Sol6.1 High CDC reviews and reproduces in Autonomous Mode. Stop on the
first further substantive failure or real evidence gap.

Work only in the existing task checkout
`.worktrees/contract-predicate-lowering`, clean
`codex/protected-host-contract@cabfc621dd28331aafe1315292bd830be2dd459d`,
tree `1809cdaa7918c0cd2c24fa6e5a9d878161fc59cf`.
Retain the accepted pre-policy baseline `5a2e569`, numeric prerequisite
`46ca1c04`, and read-only release `62e9531e`. No release integration,
push, next slice, S04, new dependency or K work.

## Intake and ownership

Required-full: this prompt, current [plan](slice-plan.md),
[ledger](ledger.md), preceding [iteration05](cc-prompt-iteration05.md)
and [iteration04](cc-prompt-iteration04.md)'s prospective hold rules.
Read the three complete top finding sections in
[CDC verification](cdc-verification.md), starting at the exact
path-identity stop. The accepted original baseline remains evidence
for the pre-policy condition only. Reuse actual completed same-context
intake for unchanged guides, source test contracts and AGENTS.

Required-sections at cabfc621: read both complete protected-host
modules and the actual named function/assignment builders that
determine the seven repairs. Use native `SurfaceForm::Func` and
`Genfunc`, `FuncClause` and `GenfuncClause` from `ast/surface.rs`,
`binding::param_names`, `classifier::classify_expr`, and the two
if-let lowerers in `emitter/forms.rs:2613–2623,2662–2680`.
On JS read `mod.js:23–24`, `classifier.js:513–516,757–758,963–968`,
`compiler.js` function/function* and compileParam/compilePattern
builders plus the computed get and delete handlers, and
`binding.js` bindingsIntroduced/bindingNamesInPattern. Recover
truncated required bodies. Apply existing Rust TD-03/05/06,
EH-01/04 and Deno ID-01/08/12 and testing's behavioral oracle guidance.
Read back the actual
[fixed source commit body](artifacts/commit-messages/correction04-v1.txt).
Return actual read extents and the repaired route/scope contract to CDC.
Wait for explicit exclusive source/index/build/raw handoff.

## Corrective implementation

Only these semantic paths may change:

- `crates/lykn-lang/src/protected_host.rs` including inline private controls.
- `packages/lang/protected-host.js` and its exact embedded mirror
  `crates/lykn-lang/embedded/packages/lang/protected-host.js`.
- New `test/forms/protected-host-policy.test.js` for the separate
  compile-only exact-key proof specified below.

Mechanical Rust formatting may touch only the original candidate's
changed Rust paths. Preserve the exact frozen native/public host tests,
including the portable fallback, all fixture strings and assertions.
Keep the macro-time bypass, dist typed diagnostic adapter, existing
whole-unit hooks and normative guide/skill behavior. A new substantive
finding requires a stop and return, never an opportunistic repair.

1. **Public entry is Kernel.** `compile` receives the lowered program.
   Start the public visitor in Kernel so ordinary expanded `=` records
   the target from `set!` and `set-symbol!`. Preserve `formHead` as
   the real form dispatch and do not reapply runtime policy to
   `compileMacroBody` or recursive `compileExpr`.
2. **Delete is a kernel write.** In each walker record the operand of
   recognized kernel `delete` as a target, preserving its span in
   native. Native Surface explicit `kernel:delete` and public's
   lowered `delete` must reject unchanged W7. Visit executable
   computed target expressions normally. Do not treat a delete target
   as a destructuring pattern.
3. **Native Surface function clauses have scopes.** At actual Surface
   `func`/equivalent `genfunc` dispatch use the existing classified
   clause objects, without invoking whole-unit validation recursively.
   Normalize each clause's own typed parameters from
   `ParamShape::typed_params()`, retaining actual declaration name
   ownership. Keep sibling clauses distinct. Check defaults and
   `pre`/`post`/body with the correct clause scopes, preserving
   pre-strip detection and traversing executable child expressions.
   The existing binder's all-clauses parameter union is not a scope.
   Preserve ordinary lexical calls. V2/V3 must remain legal and W9
   must reject before any assertion stripping.
4. **Native explicit escape affects its own operator only.** Keep the
   surrounding dialect for unprefixed RHS, target keys, defaults and
   every other child expression. Use the operator's effective dialect
   to recognize writes. Propagate the enclosing dialect through
   pattern-default traversal as well as the ordinary child loop.
5. **Native if-let binding belongs to then only.** Visit the
   scrutinee in the outer scope, the then arm under the pattern scope,
   pop it, and visit else in the outer scope. Keep when-let's existing
   pattern body ownership. The source classifier must prove the
   global write in else independently of backend checks.
6. **Public kernel functions own their parameter list.** Use actual
   `function` child slots: name at args[0], parameters at args[1],
   body from args[2]. `function*` shares these slots for a named
   form; use the actual compiler's params index for anonymous forms
   (first list, or second after the anonymous placeholder). Collect
   real normalized local bindings, keeping the declaration name's
   outer scope separate. Use bindingNamesInPattern for supported
   binding grammar and honor the actual compilePattern wrappers for
   defaults/rest/alias without treating default expressions or object
   keys as local names. Check executable defaults and body under
   their function scope. Do not change public AST or public APIs.
   The original public V2/V3 must still execute with their exact
   outputs after Kernel assignment detection is enabled.
7. **Compare path segments without flattening.** Compare exact
   length and segments for the protected paths and the whole-unit
   alias-invalidating paths. Keep computed string keys literal.
   `["globalThis", "Reflect.apply"]` and
   `["globalThis", "Reflect", "apply"]` remain distinct. Select the
   stable displayed slot from the matched path, not a joined prefix.

These are behavioral contracts. Private helper names and ordinary
representation mechanics are local discretion. Retain original
pre-strip and codegen boundaries, real binders, scope/namespace/alias
limits, typed file diagnostics and direct/module proof.

## Controls and gates

Keep the original W1–W9/native29/native15/legal4/dist and public
1 parent/13 steps byte-exact. Add two compile-only private Rust controls
in the existing module:

- The Source form `(if-let (Reflect source) (++ Reflect) (++ Reflect))`
  must produce exactly one Reflect diagnostic, with the target span
  of the else operand, not then. Derive the expected span from
  the parsed original form's else arm. No program executes.
- Source `(kernel:array (= Reflect:apply 0))` stays legal. The same
  outer form with `(kernel:= Reflect:apply 0)` inside produces exactly
  one Reflect.apply diagnostic at the parsed target. This distinguishes
  correct operator-local escape handling from disabling escapes.

The new Deno test uses the existing canonical `read` and raw public
`compile` from source modules, without any runtime launch. Compile
`(= (get globalThis "Reflect.apply") 0)` and require the exact
trimmed artifact `globalThis["Reflect.apply"] = 0;`. Compile
`(= (get (get globalThis "Reflect") "apply") 0)` and require exact
Error message `host-contract v1: write to protected slot Reflect.apply`.
Use one independent Deno.test and the repository's exact assertions.
These are two compile-only proof inputs in one test, separate from the
unchanged original public host population. No generated write runs.

Freeze a clean immutable corrective candidate using the fixed `-F`
message, normal exact paths and raw commit-body readback. CDC reviews
the exact scoped diff, original obligations and the seven changed
proofs before releasing anything. If needed, mechanical formatting
requires its own prospective receipt/release and preserved new freeze
before any further gate. Remove the frozen blank EOF mechanically.
Return a newly found substantive issue immediately, with no corrective
edit for it.

Follow the original iteration05 focused, mirror/materialization,
normal unfiltered Make, standalone cited paths, actual producer pins
and independent reproduction contract. Add the separate configured
`deno test --config project.json -A test/forms/protected-host-policy.test.js`
to each CC/CDC gate sequence. All real validation launches need their
own durable read-back receipt and named CDC release before execution,
including build/formatter/refresh/runtime/citation. Record actual
named config paths and outputs, fresh roots, exact argv/cwd/scoped
env/producer and raw destinations. Preserve expected outputs and
actual raw bytes before assertions. No prior baseline rerun.

Return exact commits/tree/clean refs, immutable diff and actual per-HC
row evidence or stop. CDC independently reproduces after clean
exclusive ownership returns. No Python or exceptions, substitute
research script, new framework, gate bypass or scope advancement.
