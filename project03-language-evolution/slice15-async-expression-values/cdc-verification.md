# Independent review — pending Operator decision

2026-11-06, CDC OpenAI Sol6.1 High. **Candidate rejected; execution paused at
five correction passes.** Source802bb223b341b5860fc2a0b7d2f2f77f17fbe499 on
codex/async-expression-values contains unaccepted production54608a7 and the
lint-clean E5 test correction. Prior accepted3b65d09 and releasef705655 remain
untouched. No repair acceptance, integration, sixth pass or parser observation.

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
