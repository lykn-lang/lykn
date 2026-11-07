# Independent review — source accepted, parser phase pending

## Current source-stage acceptance after correction7

**Accepted TASK-ONLY at5408abd432b8789ae474a3895436f68818c4e482, before parser
continuation.** Independent normal full Make exits0: all Rust, JS1468/0failed
(11steps), docs482/0failed, citations63docs/601historical plus build/lint pass.
Exact two switch regressions/grouped-bind and five native runtime cases independently
pass, complete generated modules reviewed, same-core strict module load0. Full
evidence/commands/pins: [CDC final replay](artifacts/cdc-correction07/replay.md).
CC full Make/source evidence is correction07 at planning2fb39c3. Current compiler
is absolute task target/release/lykn SHA
b0a5649791ec6dfdd774619cc7c01c4c6c4f1138a5db7e368916416a9600b873;
canonical/embedded/fresh materialized JS match1c1e7e8. Source clean; no integration.

AV-01–04 source criteria are accepted within their finite proof, not universal
compiler correctness. The original shadow proof and later sibling fixture are
distinct preserved conditions. All prior rejected candidates, failed gates and
process/provenance limits below remain historical facts. AV-05/06 parser work
remains0/4; AV-07 awaits endpoint. Preserved cc-prompt-iteration07.md is the
original authorized conditional parser continuation, not an eighth correction.
No parser child/runtime ran before this recorded acceptance.

## Current verdict after authorized correction6

**Subsequent authorization:** Operator's “yes, authorised!” permits ONE bounded
correction7, recorded in the plan/ledger and cc-prompt-iteration06.md before work.
The rejected correction6 verdict below remains evidence; source is not accepted
and the budget is not reset. Full independent gates still precede the same four.

**Still rejected; extra cycle spent, awaiting Operator decision.** Final source
3f8f6dfe6177db7233932dc6c8938993655a1cae is clean. The narrow statement expansion
fix96e20b9 plus rustfmt-only3f8f6df resolves the exact grouped-bind unit: CC final
unit1/1; CDC independently replayed the96 binary1/1 and reviewed the subsequent
one-line whitespace diff. Five native/public fixtures and same-core load remain
green; full normal validation is NOT green, so source is not accepted.

CC's final normal Make (correction06/raw/attempt-31, actual exit2) passes deps,
citations63/601, release/clippy/format/syntax/lint and ALL Rust suites, then JS/Lykn
reports1466passed/2failed(11steps). Both failures are unchanged existing DD50
switch-case tests. Docs and the independent full Make are unrun; parser0/4.
Separate citation attempt32 also passes63/601, but is CC evidence, not CDC replay.

I independently reran ONLY those exact two existing tests with actual absolute
release compiler SHAedafa7067f481bdc4f61d412bd6ba68853ba018341914e9b8c3ab2b30912b987,
pinned Deno and unchanged generated harness. Each selected1/failed1/filtered33,
exit1. [Exact commands/raw/pins](artifacts/cdc-correction06/failing-switch-cases/commands.md).
The JS output preserves conditional console.log; Rust instead emits an unconditional
COMPILE_ERROR throw. These are actual compiler-output mismatches; no runtime
throw or invalid-module syntax is claimed. The accepted3b65 independent full
Make previously passed both (Slice14 raw lines2066/2078). These are introduced
candidate regressions, not evidence of previously failing baseline tests.

**Source mechanism:** test/forms/dd-50_test.lykn126–129/189–191 compile top-level
switch strings, so the grouped-bind function-body helper is not their direct
path. emit_body/classify_statement_surface remain unchanged from3b65. Kernel
switch passes clause lists as Statement (forms.rs3212); each case begins with
number1. emit_expr's newly changed non-form-head fallback550–555 treats that
structural clause as a computed call and forces all children Value, incorrectly
rejecting its no-else if. Codegen emit.rs861–895 explicitly treats clause[0] as
the test and clause[1..] as statements. Guide00:849–858 supports statement if and
932–940 documents the switch shape. This is source-grounded causal analysis,
not a new experiment or a claim that every clause variant was exercised.

**Concrete proposed next scope — NOT authorized/dispatched:** role-aware traversal
of switch clauses, preserving Value discriminant/case tests and Statement bodies
without treating a clause as an ordinary call. Retain actual bound/computed-call
Value arguments needed by the NE-C09 repair; do not blanket revert that behavior,
weaken assertions or change helpers/fixtures/oracles. Require these same two
existing failures, grouped-bind regression, same five cases/full normal Make/
citations and independent review, then the same four only after source acceptance.
The one extra cycle is exhausted; this needs a further explicit Operator decision,
not a seventh pass, re-slice/reset or automatic continuation. No code changed
after the failed gate; accepted3b65/releasef705 remain unchanged/clean.

Correction06 preserves two0-case product setup failures (--no-remote then no-npm),
the rustfmt-only failure, and a wrong full-SHA suffix in initial19/20 metadata
explicitly retracted against actual Git21 output. CC core-load argv omitted explicit
deny-net; CDC's strict no-grant core load includes it. All actual receipts remain;
none is retroactively compliant. Positive CDC raw is under cdc-correction06;
no overall acceptance or formal slice close follows these partial successes.

## Prior five-pass verdict (preserved)

2026-11-06, CDC OpenAI Sol6.1 High. **Candidate rejected; execution paused at
five correction passes.** Source802bb223b341b5860fc2a0b7d2f2f77f17fbe499 on
codex/async-expression-values contains unaccepted production54608a7 and the
lint-clean E5 test correction. Prior accepted3b65d09 and releasef705655 remain
untouched. No repair acceptance, integration, sixth pass or parser observation.

**Subsequent Operator decision:** the explicit one-cycle override is now recorded
in the governing plan/ledger and cc-prompt-iteration05.md BEFORE fresh execution.
The rejected candidate and five-pass pause below remain historical evidence.
Correction6 total is authorized once; no reset, source acceptance or waiver.

## Exact blocking result

CC's normal full Make passed dependencies, citations63docs/601historical,
release build, clippy, rustfmt, syntax and lint132files, then Rust library tests
reported1122passed/1failed. Raw
[full Make](artifacts/repair/correction05/full-make-check.log) ends with
`test-rust Error 101`; overall pipeline status was not retained and is not
inferred from that child error. Later Make targets did not run.

I independently rebuilt the SAME lib test with
`cargo test --offline --locked -p lykn-lang --lib --no-run` in the task worktree
(exit0), pinned executable SHA256
`0e6fa26c5fdc856373d59a797b4a10fdf183132f085bed880a51f2d020cf7cf3`, then ran:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/debug/deps/lykn_lang-660f810f98f77866 --exact emitter::forms::tests::test_emit_bind_group_in_function_body_stays_sibling_scoped --nocapture
```

Exit101,1failed/1122filtered: actual `Some("block")`, expected `Some("const")`,
forms.rs3404. [Raw output](artifacts/cdc-repair/grouped-bind-unit.log),
[exit](artifacts/cdc-repair/grouped-bind-unit.exit),
[build](artifacts/cdc-repair/grouped-bind-test-build.log). No variants or new
runtime fixture were executed. Source forms.rs SHA256
`f843bd70d69595202905dd42b9e76e0126ee54c419ba999311541087c596ec2a`.

The existing test at forms.rs3375 is unchanged: grouped bind(email raw, role email)
in a function PREFIX, then sibling implicit return(role). It passed in the prior
independent Slice14 full gate (cdc-stage-b/make-check.log1189). Guide00:101–114
documents const/sequential grouped bindings. Source review identifies the
regression: old emit_body in Statement context expands a classified form with
`out.extend(emit_form(...))`; new emit_function_body instead maps each prefix
through emit_expr, collecting a block for the multi-declaration group. That nests
email/role outside their required sibling declaration scope. This is an introduced
NE-C09 regression, not a newly discovered unrelated compiler bug. The unit proves
the AST mismatch; no additional runtime consequence is claimed as executed.

## Positive evidence remains bounded

I reviewed the exact10-path source diff, both compiler implementations, private
class/carrier/statement-role corrections, both harnesses and all five source
fixtures. Canonical/embedded JS match SHA1c1e7e822e5665b3cac2914d95bceade004694c0c37db5be1dd971876e56fd56.
[Independent replay](artifacts/cdc-repair/replay.md) retains five native/five
public-JS exact outputs and complete generated modules, plus genuine no-permission
load0 of the SAME old complete core (JS SHA068afeb7...). These are real finite
successes, not sufficient acceptance against the failed pre-existing unit.

The original shadow fixture's independent results apply to identical production
blobs at546, not the replacement sibling-scope condition. CC's new sibling E5
same-five suites pass at802; original shadow source/results and the lint-failed
Make remain preserved. Private scanner/carrier/loop controls have genuine reds
after two weak initial units were exposed. Parser observations stay0/4; helper
re-entry/full source gate/independent full Make are unrun.

## Concrete proposed extra correction — NOT authorized or dispatched

One bounded native correction would restore the existing Statement-body
`emit_body`/`out.extend` expansion for non-tail function-body forms, while keeping
the new value-tail lowering. Only forms.rs needs reviewable product changes;
do not alter the existing regression assertion, JS/mirror, five fixtures or
oracles. The exact existing grouped-bind unit must pass, followed by the same
five cases, full normal unfiltered Make/citations and independent CDC review/replay.
Only after source acceptance may the unchanged four parser observations resume,
with the same stop rule. No merge, dependency, walker or other compiler repair.

This requires an explicit Operator decision to re-scope/override the exhausted
budget, not a silent sixth pass. PM guide03 lines250–255 says to surface that
decision at the cap. Its linked ledger discipline's Iteration budget states:
“Reaching 5 without convergence: stop. Do not iterate a sixth time on the same
ledger in the same session.” It permits an Operator override. No override is
recorded here. The review proposes one concrete correction, not an unlimited loop.

History remains candid: original fixture/harness errors; pre-freeze implementation
greens and missing transient bodies; weak class/tail units; borrow-after-move
author error; original lint conflict; wrong-cwd Cargo attempt whose file log was
overwritten (tool-text attestation only); CDC's relative-path compile-only batch
repeated with the required absolute path before runtime. None is retroactively
made compliant. Prior Slice12/14 process violations and every original F/Project07
obligation remain unchanged. All ledger rows remain open pending disposition;
there is no formal completed-slice claim or closing retrospective yet.
