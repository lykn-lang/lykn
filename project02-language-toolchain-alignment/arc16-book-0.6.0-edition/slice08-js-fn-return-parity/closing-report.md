# arc16 slice08 - JS `fn` Return Parity Closing Report

**Status:** CC-closed 2026-09-12; CDC verification pending.

## Outcome

`D-2609-FNRT` is fixed for 0.6.x. The intended semantics are that `fn` and `lambda` are value-producing function forms. The Rust CLI already accepted a `func` whose `:returns :function` body ends in a direct typed `fn`; the JS compiler path was stale because `packages/lang/surface-helpers.js` still classified `fn` as statement-only.

Source commit `8c66469` removes `fn` from the JS statement-only head list, adds cross-compiler regression coverage for direct `fn` and `lambda` returns, and updates the functions/closures guide note that still taught the stale workaround as a compile rule.

## Grounding read

- `AGENTS.md` for branch/worktree ownership, command gates, source-vs-planning split, and assistant commit trailers.
- `assets/ai/SKILL.md` for Lykn surface guidance. The repo-local `assets/ai/js/SKILL.md` named by `AGENTS.md` is absent in this worktree; JS work therefore followed the installed JavaScript/Deno guidance plus local tests and conventions.
- `packages/lang/surface-helpers.js` for `STATEMENT_ONLY_HEADS`, `isStatementOnlyForm`, and `wrapReturnLast`.
- `packages/lang/classifier.js` for `fn`/`lambda` classification and `buildSingleClauseFunc` return-body checks.
- `test/forms/dd-50.6_test.lykn` and `packages/testing/helpers.js` for the existing statement-only regression harness and JS/Rust `compile-both` parity route.
- `docs/guides/01-core-idioms.md` and `docs/guides/06-functions-closures.md` for the contradictory prose: ID-32 already described `fn` as value-producing, while ID-9 still described bare `fn`/`lambda` as statement-only in a factory return.
- slice07's refreshed inventory and `D-2609-FNRT` register row for the exposed book failure boundary.

## Decision

Rust behavior is the 0.6.x source of truth for this case: `fn` and `lambda` produce function values and can satisfy `:returns :function` when used as the final body expression of `func`. JS's previous rejection was not a design choice; it was drift in the shared statement-only list. Real statements such as `while` and no-else `if` remain rejected when a return-typed `func` needs a value.

## Row walk

| ID | Final status | Evidence |
|----|--------------|----------|
| F-1 | done | Read the listed local instructions, compiler files, tests, guides, and slice07/register evidence before editing. |
| F-2 | done | Focused JS repro before the fix failed with `function make-greeter declared :returns :function but body ends with fn ...`; the prior Rust CLI probe on the same shape succeeded and emitted a return-checked closure. |
| F-3 | done | Decision recorded above: `fn`/`lambda` are value-producing; JS was corrected to Rust/current-guide behavior. |
| F-4 | done | Source commit `8c66469` touched only `packages/lang/surface-helpers.js`, `test/forms/dd-50.6_test.lykn`, and `docs/guides/06-functions-closures.md`. |
| F-5 | done | From `/Users/oubiwann/lab/cnbb/lykn`: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter4/3-scope.md src/part2/chapter7/4-closures.md --fence lisp` generated 1 doctest file with 3 blocks and passed 3/0. The generated `target/` directory was removed; pre-existing `_to_delete/` remains. |
| F-6 | done | `cargo fmt --check`, `cargo test -p lykn-cli`, `deno test --config project.json -A test/`, `make test-docs`, and `make check-cited-paths` all passed. `make test-docs` reported 482 doctests passed / 0 failed. |
| F-7 | done | This close updates the slice ledger/report, `D-2609-FNRT`, arc/project/status surfaces, and opens slice09. |

## Verification transcript

```sh
# focused before-fix JS repro
function `make-greeter` declared `:returns :function` but body ends with `fn` (a statement-only form which cannot produce a value). Either: (a) add a return-typed expression after the form, or (b) remove `:returns :function` from the function declaration.

# focused after-fix JS repro
deno run --config project.json -A /private/tmp/slice08-js-fn-return-probe.js
# emitted function makeGreeter(prefix) with a typed arrow closure, return type check, and `return result__gensym0;`

./bin/lykn build
./bin/lykn test test/forms/dd-50.6_test.lykn
# 10 passed / 0 failed

cargo fmt --check
cargo test -p lykn-cli
# passed

deno test --config project.json -A test/
# 763 passed / 0 failed

make test-docs
# 482 passed / 0 failed

make check-cited-paths
# passed; 63 documents on release/0.6.x; 601 historical citations accepted

cd /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter4/3-scope.md src/part2/chapter7/4-closures.md --fence lisp
# 3 passed / 0 failed
```

## Artifact inventory

No durable slice-produced artifacts beyond the planning close set were produced. Temporary probe files lived under `/private/tmp`; generated test artifacts under the book checkout's `target/` were removed after verification.

## Bubble-up to the arc

slice08 delivered the arc-plan piece assigned to it: `D-2609-FNRT` no longer blocks chapter rewrites. The fix also removed one contradictory guide note in the source tree so book prose does not need to normalize around a compiler bug.

The slice did not uncover a new arc-scope blocker or require a new slice before chapter work. It confirms the slice07 recommendation that slice09 should be the next executable book-facing slice for toolchain, testing, project-structure, build/dist/publish, and source-ownership chapters.

Silent-drop check: the slice reproduced the mismatch, selected intended semantics, fixed the JS compiler path, added parity coverage, updated the contradictory guide note, reran required lang gates, reran the affected book subset, updated planning/register/status surfaces, and opened slice09. No slice08 scope item is deferred or dropped.
