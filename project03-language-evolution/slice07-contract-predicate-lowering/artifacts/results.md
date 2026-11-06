# Slice07 CC evidence

## Phase A — intake and source-cited readback

Prepared before implementation changes. CC: Luna 6 High (Operator-selected).
CDC: Sol 6.1 High; owns independent acceptance. Phase B remains gated on that
acceptance and an explicit resume. Source mutation/index ownership is CC only
for the four authorized paths; planning evidence ownership is limited to this
file, `closing-report.md`, the ledger evidence/status, and plan status/intake.

### Frozen inputs and ownership

- Planning worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch
  `planning`, HEAD `f12e1e6ae00b19d92d06fbd4e17374d89e1f8e97`; clean at intake.
- Sole source worktree
  `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  branch `codex/contract-predicate-lowering`, HEAD
  `9be0c301e11e3d8503605e9b50b53056f47c9b14`; clean at intake. The implementation
  baseline is `74a90d5`; intervening commit is guidance-only.
- Rust/Cargo `1.97.0`; Deno `2.9.6`; Cargo.lock SHA-256
  `bbec9052ee3a3401d716c3b4f2d227107e7e0a8c6f8c846c27fd902e0f39ca92`.
- Allowed source paths: `crates/lykn-lang/src/emitter/contracts.rs`,
  `crates/lykn-lang/src/emitter/forms.rs`,
  `crates/lykn-cli/tests/contract_predicate_lowering.rs`, and
  `test/surface/contract_predicates_test.lykn`. The only planning path touched
  so far is this evidence file.

### Contract/codegen readback

At the assigned source baseline, `contracts.rs` public
`emit_pre_check(func_name, pre_expr, span)` serializes the raw predicate for a
caller-blame diagnostic and inserts `pre_expr.clone()` under kernel `!`;
`emit_post_check` serializes original post text, replaces `~`, then inserts the
replacement under `!` (source `crates/lykn-lang/src/emitter/contracts.rs`,
functions `emit_pre_check`, `emit_post_check`, and `replace_tilde`). Existing
unit tests cover kernel constructor structure/messages and recursive tilde
replacement (`#[cfg(test)] mod tests` in the same file).

`forms.rs::emit_expr` is the existing recursive lowering and dispatch point:
resolved form heads are distinguished from lexically bound call names, known
surface forms are classified/emitted, and plain kernel calls recursively emit
their children. `ExprContext::Value` is the context used by value forms; the
existing `emit_bind`, `emit_obj`, and `emit_cell` routines save and restore it
around `emit_expr` (source `crates/lykn-lang/src/emitter/forms.rs`,
`emit_expr`, `emit_bind`, `emit_obj`, `emit_cell`; `emitter/context.rs`,
`ExprContext` and `EmitterContext`). This supports lowering each raw contract
predicate once through the existing pipeline while preserving caller context,
registry and gensym state.

All five production sites currently pass unlowered predicates to the public
constructors: single `func` pre/post (`emit_func_single`), multi-clause `func`
pre/post (`emit_func_multi`), and `genfunc` pre (`emit_genfunc`, around the
baseline locations 1393, 1442, 1613, 1654 and 1789 respectively in
`forms.rs`). Post lowering must still replace `~` before lowering, while its
diagnostic must serialize the original post expression. Generated kernel
assignment/control forms must not be recursively reinterpreted.

The narrow repair is an internal `pub(super)` constructor path taking original
diagnostic AST by borrow and an owned already-lowered predicate. Preserve the
public helper signatures and their existing raw-kernel behavior. In `forms.rs`,
lower pre directly; for post, use the existing tilde replacement first, then
lower. The private lowering helper saves `ctx.expr_context`, sets `Value`, calls
`emit_expr` with the shared mutable context and registry, and restores the saved
value. Wire all five sites. No change to JS production lowering, public API,
diagnostic wording, type/contract order, or generated kernel assignment walk.

### Surface and test contracts

The source reference `skills/lykn/SKILL.md` sections “Bindings & Mutation”,
“Functions”, “Generators”, “Types & Pattern Matching”, “Modules”, and “Error
Handling” defines typed `:any` function arguments, `:pre`/`:post` runtime
contracts, generator guard behavior, value-producing `cond`, normal function
calls, ESM exports, and throwing `Error` instances. It documents `=` as strict
surface equality and `and`/`or`/`not` as surface operators in “Anti-Patterns to
AVOID”. The functions/closures guide's introduction and ID-01 document
`:pre`/`:post` support and multi-clause function contracts. Test repository `test/CONVENTIONS.md`
requires `make check` as the canonical full check and avoids duplicate docs
tests; `packages/testing/helpers.js::compileBoth` is a lax JS/Rust convergence
harness using `--no-strict`, with known non-semantic formatting normalization.
It is supplementary parity evidence, not strict native acceptance.

The native test will use existing `tempfile` CLI dev-dependency and
`CARGO_BIN_EXE_lykn`, create isolated temp working directories with no project
config, compile with default strict CLI behavior to owned JS, then execute those
modules using Deno with the planned offline/no-config/no-permission probe flags.
The seven fixed fixture families and 17 input observations in `cc-prompt.md`
are the acceptance population; expected rejection must be a caught runtime
`Error` with caller/callee diagnostic identity, never a parse failure.

### Applied engineering/verification guidance

The installed `collaboration-framework` Autonomous Mode/execution preflight,
project-management execution rules, `work-verification` Ledger Discipline and
Independent Verification preserve single mutation ownership, stable inputs,
row-by-row CC attestation, and CDC's distinct acceptance. The installed
`testing` Testing Discipline and Validation Gates require actual behavior at
the native CLI/runtime boundary, focused plus required full repository gates,
and preserving failures/unrun checks. The installed Rust `AP-02` and `ID-39`
prefer borrowed `&str`/`&SExpr`; `AP-09` excludes new production panic paths;
`AP-12` and `AP-18` rule out clones except intentional owned AST construction
and the existing tilde traversal. The concrete task design and authority are
the preserved `cc-prompt.md` and `slice-plan.md`; no added design choice is
being introduced here.

## Execution evidence

No tests or source edits have been made before this readback. Subsequent
commands, outputs, red/green observations, commits, hashes, and required gate
results will be appended below without rewriting failed or unrun history.

## Phase A — expected-red native baseline

The initial committed test-only attempt at `4bee70bd0e6838d84e502d141a0ed6a7107c9d98`
did not reach runtime: all seven fixture compiles reported `unterminated list
at 2:1`, leaving 17/17 inputs unrun. Inspection found one missing close
parenthesis in the shared Lykn observation function. That test-source defect is
corrected in test-only commit `5fa1f7b83ecbda73839d09ba86a401f968ddd03c`;
the first failed attempt remains recorded.

On unfixed source after that correction, command
`cargo test --locked -p lykn-cli --test contract_predicate_lowering -- --nocapture`
exited 101 (expected red). Strict CLI compilation succeeded for all seven
fixtures. Actual Deno outcomes:

| Family | Runtime observations | Result |
| --- | ---: | --- |
| exact YAML | 2 | Generated `if (!text = "answer: 42")` raised `SyntaxError: Expected ')', got '='`; 2 not established |
| strict pre | 2 | Generated `if (!x = 42)` raised the same SyntaxError; 2 not established |
| strict post | 2 | Generated `if (!result__gensym0 = 42)` raised the same SyntaxError; 2 not established |
| multi-clause | 5 | Generated `if (!actual = 42)` raised the same SyntaxError; 5 not established |
| generator | 2 | Generated `if (!x = 42)` raised the same SyntaxError; 2 not established |
| nested/value context | 2 | Deno exited 0, but both calls yielded `ReferenceError: cond is not defined`; 2 wrong outcomes |
| resolved bound head | 2 | Both passed: negating callback returned 7; identity callback produced the expected caller `Error` and `(not false)` diagnostic |

Baseline denominator: 17 inputs; 2 pass, 2 execute with wrong results, and 13
are not established (13 runtime probes did not run after generated-module parse
failure; nested calls did run but both failed their value/error oracles). These
observations identify generated contract code bypassing surface-expression
lowering; parse failures are not counted as contract rejection. The runtime
diagnostic excerpts above and the full command output were observed in the
focused test run. No pilot inputs were run.
