# CC — repair NE-C01, then resume frozen native controls

Fresh CC Luna 6 High; CDC Sol 6.1 High reviews. Operator approved this repair and
subsequent same five controls, confirmed “keep going”. Read full sibling plan and
ledger; this prompt executes them, not a readiness-only investigation. Current
phase is A. No pilot until independent repair acceptance and explicit stage resume.

## Readback and ownership

Read current AGENTS fully in planning and the dedicated source home
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering. It is clean
codex/contract-predicate-lowering@9be0c301e11e3d8503605e9b50b53056f47c9b14;
code/lock/Make/scripts match74a90d5. Other source homes read-only. Planning is
the existing .worktrees/planning branch; verify dispatched prep commit/status.
Guidance cleanup is independently accepted, not a pending permission question.

Load installed collaboration-framework and the relevant roles/Autonomous,
execution-intake/ownership, ledger/independent-review contracts. Models/settings
are already explicitly approved; do not ask again. Rust: installed rust-guidelines
entrypoint, anti-pattern summary plus actual AP-02/09/12/18 and core ID-39;
testing entrypoint and Testing Discipline/Validation Gates. Apply these scoped
borrow/owned-AST/error/test rules; no new runtime/trait/unsafe/dependency design.
Lykn: source skills/lykn/SKILL.md Functions/Bindings/Errors and surface guide
Equality, Functions/:pre/:post, cond/if/value forms, Modules; test/CONVENTIONS.md.
Read source contracts.rs, forms.rs emit_expr/emit_bind and five function contract
call sites, context.rs, native CLI compile path, existing constructor tests,
Cargo dev-deps/tempfile and testing/helpers.js compileBoth contract. JS expander
951–985 explains its recursive child lowering; no JS production repair assumed.
Stable section names and actual read extents, not copied line counts. Give a
brief source-cited contract readback in one artifacts/results.md before edits.

You own only the four source paths named in the plan and this slice's
artifacts/results.md, closing-report.md, ledger evidence/status-open and plan
status/intake. No parent/prompt/reviewer/retrospective edits. CDC/root read only
after handoff. Exact-path local commits, both contiguous trailers. No external
publication/push/integration or other source worktree edit. Use task target/
and temp dirs for generated files; don't write generated JS alongside sources.

## Implement at the guard boundary

Follow the plan's original-AST/owned-predicate internal builder shape. Keep
public emit_pre_check/emit_post_check signatures and pure-kernel behavior;
new pub(super) variants take (&str name, &SExpr original, SExpr predicate, Span).
Original helpers may delegate with their existing raw cloned predicate. Post's
existing tilde replacement stays unchanged, visible within emitter if necessary.
forms.rs private predicate helper uses this verified local pattern (pseudocode):

    saved = ctx.expr_context;
    ctx.expr_context = ExprContext::Value;
    predicate = emit_expr(raw_predicate, ctx, registry);
    ctx.expr_context = saved;
    return predicate;

Pre lowers raw guard; post replaces ~ first, lowers that result, and retains
original post solely for source diagnostics. Use shared context/registry/gensym
and existing resolved-head semantics. Wire single func pre/post, multi func
pre/post, genfunc pre. Don't transform printed operators, double-lower generated
kernel assignments, reset context/gensym, alter helper APIs or strip contracts.

## Concrete behavioral regressions before and after

Use existing tempfile and native CARGO_BIN_EXE_lykn in the new Rust integration
test, unique temp cwd/no project config, default strict compile to owned JS.
Run generated modules with Deno and the plan's no-config/offline/no-permission
probe flags. No raw JS/eval/helper package. Capturing expected errors in Lykn
try/catch and printing JSON name/message is suitable; assert actual Error and
original caller/callee diagnostic. A SyntaxError line containing the diagnostic
string is NOT contract rejection. Missing Deno/test selection is a failure,
not an ignored pass. The finite fixture families and observations are:

| Fixture | Binding source shape | Required observations |
| --- | --- | --- |
| exact YAML | Copy frozen Slice06 lib/yaml/value.lykn function/export unchanged; append test call | "answer: 42" -> {answer:42}; other string -> caller Error (2) |
| strict pre | :args(:any x), :pre(= x42), :body x | number42 passes; string"42" caller Error, not parameter TypeError (2) |
| strict post | :args(:any x), :post(= ~42), :body x | number42 passes; string"42" callee Error with original ~ in message (2) |
| multi | arity1 :pre(=x42)/:post(=~42)/bodyx; arity2 :pre(=expected42)/:post(=~42)/body actual, all:any | arity1 pass/pre-fail; arity2 pass/pre-fail/post-fail (5) |
| generator | :args(:any x), :yields:any, :pre(=x42), body(yield x) | consume42 -> [42]; consume"42" caller Error (2) |
| nested/value | :pre(cond ((and (>x0)(or (=x42)(=x43))) (not (!=x42))) (:else false)), bodyx | 42 passes/43 caller Error; following top-level statement if still valid (2) |
| resolved head | :args(:function not), :pre(not false), body7 | callback negating false passes7; identity callback fails caller Error (2) |

The compact table omits whitespace for brevity; actual source uses valid spaced
typed surface forms. This is seven native regression families/17 input observations,
separate from the five unchanged pilot programs. For the final fixture use typed
fn callbacks, preserving bound not as a real call. No broad supervisor/fuzz matrix.
Use named outcomes/assertions instead of exit-zero/no-test assumptions. Keep
existing pure constructor and tilde tests. Add the small Lykn parity test through
existing compileBoth for equality pre plus post/nested guard; no normalizer change.
Its existing lax comparison is sanctioned; strict native cases above remain mandatory.

Commit tests first and run focused native test against unfixed code; retain
actual expected-red outputs and any unaffected passes. Then implement/commit fix,
run focused tests green, cached offline/locked native build and real repository
gates. Canonical make check intentionally runs existing available npm-client
compatibility tests; native backend/probes/pilot remain free of that client.
Do not remove/filter/hide those tests or claim all validation is npm-free.
No new Node/npm/Rust dependency/toolchain installation or unrelated update.
make check-cited-paths resolves HEAD, so commit before it. Preserve any actual
check-deps/cache/tool/permission failure, satisfy approved permissions, and return
exact blocker rather than skip/patch gates or accept snapshots automatically.

## Phase A return, then unchanged Phase B

Stop before all pilot bundles/runtimes and return source/test commits, full
actual red/green/native-gate results, toolchain/lock/new compiler path+hash,
scoped diffs/status and row attestation; relinquish mutation/index ownership.
CDC independently reviews source/regressions/gates before phase resume.

Phase B is already authorized after acceptance; its detailed source population,
new-compiler identity freeze, old Slice06 predictions, staged-byte/nine-export
checks, C4-first code/metafile stop gate and fixed11-call sequence are in the
plan. Reuse unchanged native esbuild/Deno and exact planning30e9793 source
archive; no fixture/observer correction or new backend. Commit new compiler
condition/predictions before replay. Preserve original failed condition and
all F1–F12/Project07 obligations. Final acceptance needs actual raw code/meta/
behavior/API evidence, or an honest stop with all remaining counts/owners.
