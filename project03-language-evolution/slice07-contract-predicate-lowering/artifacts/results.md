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

## Phase A CC return

Source branch `codex/contract-predicate-lowering` is clean at
`86d116db5c096d0fff7ec555d388343946114e4d`; repair is
`4f5ac27fad9363896de4e55559663f07d5a2fc91`. The implementation diff is scoped
to `contracts.rs` and `forms.rs`; the two assigned test paths are separately
committed. Rust/Cargo 1.97.0, Deno 2.9.6, lock SHA-256
`bbec9052ee3a3401d716c3b4f2d227107e7e0a8c6f8c846c27fd902e0f39ca92`;
locked/offline release build passed. `target/release/lykn` and `bin/lykn` SHA-256
`eb24ae3ba372ecfaef255ac883e0f41a0f1ef85494d41925583c4eb2148cbddb`.

Receipts are retained under source `target/slice07/`:

- `native-red-final-baseline.log`: old emitter bytes from `9be0c30`, corrected
  17-input fixture, 2 pass / 2 wrong nested runtime outcomes / 13
  unestablished generated-module parse failures.
- `native-green-focused-head-final.log`: committed candidate, all 17 inputs
  pass plus following-if branch marker.
- `lykn-parity-focused-head-corrected.log`: compileBoth 1/1 pass.
- `make-check-isolated-cache.log`: final unfiltered canonical make check exit 0;
  dependency, citations, build, clippy, format, syntax/lint, Rust tests
  (including npm dry-run 5/5), full JS+Lykn (1461/1461), docs (482/482).
- `check-cited-paths-final.log`: standalone final-HEAD gate passed (63 documents,
  601 historical citations).
- Preserve failed/intermediate attempts too: `native-red-corrected-baseline.log`
  contains the invalid branch-local-bind witness; `lykn-parity-focused.log`
  records missing built artifacts;
  `lykn-parity-focused-head.log` records the cond IIFE/ternary shape divergence;
  `make-check.log` records the first clippy failure; `make-check-head-final.log`
  records the default npm-cache EPERM. The valid witness/fixture corrections
  remain in test commits `5ff398f` and `e38960d`; no normalizer or JS compiler
  changes were made. The cache retry changed only `npm_config_cache` to ignored
  `target/slice07/npm-cache`; no install, HOME override, or gate filtering.

The corrected multi-clause fixture superseded an earlier candidate run whose
actual tool output (test source commit `5fa1f7b`, before `e38960d`) was:

```text
cargo test --locked -p lykn-cli --test contract_predicate_lowering -- --nocapture
exit 101; exact-yaml, strict-pre, strict-post, generator, nested/value and
resolved-bound-head passed (12 observations); multi-clause Deno exited 1:
SyntaxError: Identifier 'multiCheck' has already been declared
function multiCheck(actual, expected) {
^
at fixture.js:20:1; 5 multi-clause observations unestablished
```

The original run stdout/stderr was shown by the tool but not captured to a
target log; this excerpt preserves its actual reported failure and denominator.
Its source was two same-name top-level functions at lines 110-119 of test
source commit `5fa1f7b`, not the final corrected single multi-clause form. The
valid 17-input unfixed comparison is separately captured in
`native-red-final-baseline.log` (test source commit `5ff398f`, after the
`e38960d` fixture correction). A prior draft incorrectly associated the
passing `native-green-focused.log` and `native-green-focused-head.log` with the
duplicate-declaration failure; correction: both files contain passing 17/17
candidate runs. The duplicate-declaration attempt has no retained raw file;
only its captured tool output and source revision are preserved here.

The other confounded source was `(if true (bind following-statement 99))`,
line 70 of `crates/lykn-cli/tests/contract_predicate_lowering.rs` at test
source commit `d936c18bf9cf5b2e21c6e548eb1a157d7cfde040`. Its actual emitted
line is retained at line 64 of `native-red-corrected-baseline.log`:
`if (true) const followingStatement = 99;`; Deno reported
`SyntaxError: Expression expected`. It is not a repair oracle and was replaced
in `5ff398f` with the valid bind-then-if witness. The first delimiter attempt
(`4bee70b`) also has its commits and actual `unterminated list at 2:1` result
recorded above, but no raw log.

CC attests CP-01, CP-02 and CP-03 as proposed done on this source state;
CP-04/CP-05 remain held for CDC's independent repair acceptance and explicit
Phase B resume; CP-06 awaits CDC review and retrospective. All ledger rows stay
open until independent disposition. No pilot bundle or runtime invocation was
run. This handoff does not claim independent acceptance.

## Phase B — frozen condition and predictions (before execution)

CDC independently accepted Phase A and resumed this bounded Phase B at
planning commit `fc4da722193fc5d2153336f8b5c69f6a78593b66`. Before any new
compile, bundle, or runtime invocation, the frozen run condition is recorded:

- Exact source task commit: `86d116db5c096d0fff7ec555d388343946114e4d`, clean;
  `target/release/lykn` SHA-256
  `eb24ae3ba372ecfaef255ac883e0f41a0f1ef85494d41925583c4eb2148cbddb`.
- Frozen source archive: planning commit
  `30e97932dc2cabeaa243338f405a5b8fe6399c10`, path
  `project03-language-evolution/slice06-native-esbuild-controls/artifacts/source`.
  It will be exported unchanged to
  `target/slice07/pilot-corrected/run-01/experiment/` with the first four path
  components stripped.
- Deno 2.9.6 SHA-256
  `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`;
  native esbuild 0.25.5 SHA-256
  `b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`.
- Run root:
  `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice07/pilot-corrected/run-01/`.

The five original predictions are unchanged: C1 BASE has zero library graph
and payload; C2 returns the JSON value without YAML graph/contribution; C3
returns the direct JSON value without file/document/YAML graph/contribution;
C4 emits the effect before entry value 42, retains used/effect code, and omits
unusedPure from output even if its input resolves; C5 resolves all nine public
paths with the exact frozen values while package bytes remain unchanged. The
YAML implementation remains a one-input research stub, not a production or
fidelity claim. The first action after fresh strict compilation/staging checks
will be only the C4 bundle gate; no runtime is authorized before CDC reviews
that gate and confirms continuation.

At this pre-execution point no new archive has been exported, no compilation,
bundle, or runtime has been invoked, and all five controls remain unrun (0/5;
the prior Slice06 1/5 bundle and 1/11 runtime-attempt history remains intact).
