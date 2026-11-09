# Arc03 S01 correction05 — finish the scoped proof and run the original gates

Under the recorded standard Autonomous Mode steering, CDC issues the
final normal refinement from clean `0c4e3ca9bc477d457feb3c8d80d7e1af53887274`,
tree `dcf609936193fa432e50e1d496ad43958aa4a947`, on the existing task
branch `codex/protected-host-contract`. Luna6 High CC implements and
Sol6.1 High CDC independently reviews. This is source refinement 05 of 5.
Resolve the clear S01-local issues below and ordinary mechanical/setup
problems. Hold genuinely unresolved design/evidence or material scope
questions. No expansion to later slices, release integration, or push.

## Intake and unchanged obligations

Required-full: this prompt, current [slice plan](slice-plan.md),
[ledger](ledger.md), predecessor [iteration06](cc-prompt-iteration06.md)
and exact [review below](cdc-verification.md#correction04-static-return-and-correction05).
Use the completed same-context intake for unchanged AGENTS, guides,
implementation and prospective execution conditions. Refresh the actual
frozen changed modules at `0c4e3ca9` and the named codegen roles below.
Apply Rust TD-03/05/06, EH-01/04 and existing testing exact effect and
JavaScript/Deno ID-01/08/12 guidance. Read the supplied
[source commit body](artifacts/commit-messages/correction05-v1.txt)
verbatim. Return current source and contract readback before renewed
exclusive source/index/build/raw ownership. CDC retains planning.

Correction04's seven repair paths and original oracle inputs stay
binding. Native W1–W9, 29 exact routes, 15 oracle controls, legal4,
typed dist and public 1 parent/13 steps do not change. The existing
new if-let control uses the [valid binding clarification](slice-plan.md#iteration06-private-if-let-oracle-clarification).
The pre-policy baseline, source refs, macro-time boundary, portable
Deno fallback, original typed diagnostic adapters, and docs scope are
unchanged. The v1 candidate has never run.

## One consolidated local correction

Semantic edits stay in the exact four paths from iteration06. Use
existing walkers and binder/target helpers. Keep compile-only controls
inside the native policy test module and separate JS policy test file.
Private names and modest deduplication are local discretion.

1. Correct the private explicit-escape test's expected span. The outer
   `(kernel:array (kernel:= Reflect:apply 0))` has one operand. Access
   form0 child1 then its child1. Assert one diagnostic, exact slot and
   that span. Leave the paired unprefixed equality input and behavior
   unchanged.
2. Separate default evaluation and body scope at actual function/method
   boundaries. For defaults use the enclosing scopes, applicable
   function name and actual normalized params only. Add body lexical
   declarations and body var hoists only for body expressions. Rust
   classified `func`/`genfunc` defaults are visited before adding body
   names. `pre`/`post` and body retain their real emitted context.
   Raw kernel function/function*/lambda/arrow and class methods follow
   the same two scopes. Reuse real binding shape, and visit default
   expressions, including nested pattern defaults, as expressions.
   See repo ECMAScript `10-ordinary-and-exotic-objects-behaviours.md`
   §10.2.11, Rust `param_to_kernel_names` and `emit_params`, and JS
   `compileParam`/function builders. Body names must not hide a
   global target in a parameter default.
3. Handle structural object-literal children by their actual roles.
   The ordinary pair's key is a property name, not a dispatch form or
   binder. Visit its value, a spread's operand, and a genuine computed
   key expression and value. Reuse this role distinction in both
   ordinary traversal and var-hoist discovery, so a `delete` key
   cannot manufacture a write and a `var` key cannot invent a local.
   Actual writer contracts are native `codegen/emit.rs:1170–1225`
   and public `compiler.js:1528–1614`. Keep real destructuring
   assignment target interpretation separate from object values.
4. Visit a public executable callee when `formHead` returns null.
   The actual compiler passes the head to `compileExpr` in its plain
   call path (`compiler.js:1884–1898`). Visit effectful list heads
   and ordinary arguments. Respect function boundaries in hoist
   discovery. Native already visits all executable values in this
   case. A computed callable cannot conceal a protected write.
5. Close the remaining obvious body-role mismatches in the same
   walkers. Surface `do`'s lexical declarations scope to the sequence
   it emits (`emitter/forms.rs:3127–3189`), not surrounding siblings.
   Catch body declarations, and actual source match/when-let
   body sequences, get their body lexical scope without leaking to
   surrounding siblings. Preserve `if-let`'s scrutinee/else vs then
   boundary. Visit executable try body before structural catch and
   finally bodies so collected diagnostic order agrees with emitted
   program order. Do not add semantics for unsupported forms.

Add compact compile-only discriminators. A kernel function default
`(default x (++ Reflect))` with body `(let Reflect 0)` must still
produce the global Reflect diagnostic. A real Reflect parameter
can shadow the default's reference. Use actual raw function syntax
`(function f ((default x (++ Reflect))) (let Reflect 0) x)`.
In a kernel object `(const obj (object (delete Reflect:apply)))`
the initializer retains the property read, with no policy error.
`(const obj (object (var Reflect))) (++ Reflect)` must still reject
the real outer update. A genuine evaluated computed key and an
immediately invoked kernel arrow with a real write are negative
countercontrols. These are compile-only with original source oracle
population unchanged. Use exact diagnostic messages/spans where the
current boundary provides them. Do not launch write artifacts.

## Freeze and gate sequence

Freeze exact source, normal commit and supplied `-F`, raw body,
source/tree/status and mirror comparison. CDC static review comes
before any formatter or validation. The inherited blank Rust EOF
and Rust style completion are mechanical. A separate prospective
formatting release may touch only actual allowed Rust files. Preserve
the before/after commits and verify no unrelated semantic edit, no
change to frozen fixtures, and at most the known Deno-fallback line's
formatting in the native host test.

Resume the original [iteration05 verification](cc-prompt-iteration05.md#freeze-verification-and-return)
and iteration06's separate compile-only JS target, then separate CDC
reproduction. Every validation command, including formatter, no-run,
test, artifact refresh, Make and cited paths, has its own actual
prospective readback and named release. Scope inputs and raw status
paths in each receipt. No compile fixture rerun from the pre-policy
baseline. Retain real failures, source producer pins, generated legal
modules, per-case receipts and all mandatory gates.

Return all HC evidence or actual blocker, exact clean refs and source/
index/build/raw ownership. No Python, substitute script, new dependency,
new public API, weakened gate, later slice or release work.
