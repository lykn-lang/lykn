# Preserve evaluation order for calls through lexical bindings

Luna 6 High CC in standard Autonomous Mode. Separate Sol 6.1
High CDC owns readiness, review and independent acceptance.
Required-full in order: this prompt, [plan](slice-plan.md),
[ledger](ledger.md) and [fixtures](artifacts/fixtures.md).
Task checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, `codex/completion-value-flow`, exact clean
`6c9dbd5c38f16674c7b95315bd32bfee9fd131e5`, tree
`d9ce3a36e164252740d9ac29f712c85add99a0de`. Release is
independently green and read-only. Await exclusive task/source/
index/build/runtime/raw handoff after intake.

## Required reading and applied decisions

Read task AGENTS.md fully, Lykn skill Bindings & Mutation and
Functions, and Guide 00's bind section. Their typed-parameter and
surface mutation choices determine the fixture. Its single kernel
assignment deliberately proves compiler order and is not user advice.
Read Rust type-design TD-04 through TD-06. Use a private named
`prefix + call` result and existing closed DirectTailResult, retaining
private marker identities and the current checked first-fatal path.
Read JS Deno skill anti-patterns, values/references ID-04/05 and Deno
testing sections. Save actual values with `const`, not a delayed lookup
or object copy, and use existing real strict child runners. Read
testing discipline/validation gate and work-verification independent
verification. Full Make and current exact runtime, scope and raw proof
remain required.

Required-section actual Rust emitter/forms.rs `emit_expr_inner`,
`emit_direct_tail`, `emit_direct_header_value`, `emit_bind` and
`emit_body`/statement classifier, context marker allocation/finalizer,
native codegen plain call, and CLI compile with/without output including
`--kernel-json`. Required-section public expander.js bound dispatch,
`expandDirectValuePlan`, private result statements and unit marker
finalization, compiler.js plain-call branch and package mod.js.
Read current actual source host contract's invocation/seam section
and [I3 design section 3](../slice04-completion-value-flow-integrity/artifacts/incremental-completion-design.md#3-evaluation-references-and-the-concrete-held-host-gate).
The accepted protected call adapter is a later receiver input, not
used in this change. Read actual native/public semantic-role runners,
including individual native registrations. Return exact intake readback,
source role, scope, oracle and gates before touching source.

## Implementation recipe

A source ordinary call qualifies only when the actual resolved
callee is a bare lexical reference, with no colon member and no
normalized direct `eval`, `super` or other special callable form.
In Rust require an actual atom with `NameRes::BindingRef` and
unchanged name semantics. In JS operate only at the existing
`!isKernel(form)` genuine lexical/ref dispatch after the existing
escape/scope logic, with its actual tagged head. Keep free,
computed, colon/member, new, super, dynamic import and eval
on their existing paths. Preserve ordinary protected/deferred/
legacy and top-level contexts. No generic effect/purity inference.

At the native direct-tail entry before `as_form_head` is asked to
reject bound heads, route the eligible lexical call through the shared
plan. At the native `emit_expr_inner` plain bound fallback in actual
Statement use and `ctx.direct_return_region`, use the same plan.
`classify_statement_surface` already leaves bound heads to that
fallback. Ordinary Value fallback is unchanged. The direct result
uses existing Return/Assign materializer, and Statement emits the call
as a normal discarded statement. No new public signature or context.
In JS use the same private planner in the existing actual lexical
branch for DirectStatement and ReturnOperand/Assign use. Tag the
original head like today. Avoid reexpanding macros or arguments.

Plan each actual argument once in source order via the existing
direct value-prefix planner. A plain Value has no prefix. A
statement plan already assigns a finalized private stable temp on
its normal path. Find the last nonempty prefix. If none, rebuild the
same ordinary tagged call with those ordinary values and no emitted
support. Preserve genuinely ordinary spread in that path. If a
normalized genuine spread argument is present and a prefix is required,
report exact F3 diagnostic through `ctx.record_fatal(codegen_error(...))`
with original call span or the existing JS Error path. Use actual
normalized root roles and recognize a macro-produced spread without
re-expanding it. A lexical lookalike spread call is not the marker.
Do not emit temporary invalid spread assignment or fall back to a
control-bearing wrapper.

For mixed ordinary value arguments, emit one hygienic private
`const` saving the callee before any argument prefix/effect.
Walk args left-to-right. Emit each prefix at its exact turn.
For an ordinary Value before a later prefix, save it once to a
new private `const` before that prefix. A prefixed argument is
already a stable temp. Later trailing Values can remain inline in
their original call order. Invoke the saved callee by normal bare
call, no `.call`, host request or invocation helper. Let JS
perform the callable check after argument evaluation. Enclose
the prefix and normal invocation/materializer in a lexical
block without an extra function/loop, using current typed marker
and whole-unit name allocation. A source return/break/continue/throw
retains its actual target. Output remains ordinary kernel, including
the normalized saved callee and argument names before exported seams.

## Frozen test, scope and execution

Test-only first. Exactly the two named fixtures, Rust semantic_roles
runner and JS semantic-roles runner. Register both Rust fixtures at
indices 33/34 in actual individual `#[test]` calls. Add actual F3
negative separately in both runners, using existing raw child helpers,
native no-artifact and exact error checks and public assertThrows.
Old expected failures are two changed behaviors and old successful
F3 compile. Preserve any unexpected actual result. Do not execute
F3 output. For the two positives record real `lykn compile
<source> --kernel-json` as stdout in native runner using the same
per-case scope and raw helper. Require successful parsed ordinary
JSON, inspect complete output at independent review. In public
runner retain usual `lykn` runtime. On these two macro-free fixtures
also require `compile(expand(read(source)))`, structuredClone and
JSON round-trip compile to give the exact same complete module.
No new validation framework.

Use prepared `/private/tmp/lykn-s17-cdc.lAFdsMI8/test-message.txt` and
`/private/tmp/lykn-s17-cdc.lAFdsMI8/source-message.txt` with normal
exact-path `git commit --only -F` and actual Git body readback.
Before old execution return immutable test freeze for independent
static release. Product held until actual old outcomes are returned.
Product paths only `crates/lykn-lang/src/emitter/forms.rs`,
canonical `packages/lang/expander.js` and its exact embedded
mirror, and narrow Guide 00 clarification. No format churn. Return
immutable corrected product for independent static release before
current execution. Baseline and current run exact native 38
(35 prior, two runtime, one F3) and public 34 shared steps plus
eight standalone controls including F3. No new public/runtime
dependencies, public AST fields or new exports.

All launches retain separate full raw streams, status, cwd,
argv, scope and producer pins. Precreate uniquely owned fresh
config-free /private/tmp per-command TMPDIR/XDG/npm and evidence
dirs and record all four named config files through required
ancestors and fixed DENO_DIR before launch. Use Deno 2.9.6
`/opt/homebrew/bin/deno` SHA `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`
and Cargo/Rust 1.97.0. Exact group `cargo test -p lykn-cli
--test semantic_roles --no-run`, then `cargo build -p lykn-cli
--bin lykn`, pin CLI/runner/Deno after final build. Direct actual
runner `--nocapture` only, no Cargo test wrapper or serial flag.
Public `deno test --config project.json -A test/forms/semantic-roles.test.js`.
Verify pins before and after focus. Native/JS complete modules,
kernel artifacts and original fixture bytes retained. No Python
execution is permitted. Use Lykn for authored research/evidence
logic, native tools for exact invocation and filesystem actions.

Current full unfiltered `make check` and standalone
`make check-cited-paths` after focus. Normal Make truly
unsets both test-only variables. Retain exact post-Make binary
and actual fresh XDG materialization, full raw, proposed
OC-01..04 and explicit clean ownership return. CDC independently
reproduces all current gates. Ordinary in-scope corrections use
standard recorded autonomy. Receiver/reference/assignment/spread
lowering waits later I3 scope, I4/K/release propagation out.
