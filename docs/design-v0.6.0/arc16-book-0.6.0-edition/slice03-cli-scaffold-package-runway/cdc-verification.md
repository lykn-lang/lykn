# arc16 slice03 - CDC Verification

Verifier: CDC (Codex Desktop)
Date: 2026-08-20
Implementation commit verified: `dc0e1f0e8cd94e1ea16e5221c0429a393b771a20`

## Verdict

Accepted. The implementation commit closes the CLI/scaffold/package runway
cluster for `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and `D-2608-RIMP`,
and implements the 0.6.0 source-ownership floor for `D-2608-SOWN`.

No blocking code findings were found in CDC review. The remaining arc16 blocker
is not this runway; it is the language-surface decision set:
`D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`.

## Scope And Diff Review

CDC verified that HEAD is `dc0e1f0` on `release/0.6.x`, with a clean worktree
before CDC edits. The implementation diff touched the expected surfaces:

- `crates/lykn-cli/src/main.rs` for `lykn new`, scaffold templates, local
  binary install, local testing overlay generation, and source-file `lykn run`
  routing through workspace build output.
- `crates/lykn-cli/src/dist.rs` for recursive package traversal, nested
  `.lykn`/`.lyk` compilation, nested handwritten `.js` copying, and recursive
  dist staging.
- `crates/lykn-cli/tests/scaffold_runway.rs` for the fresh-project acceptance
  path.
- `crates/lykn-cli/tests/publishing_build_each_kind.rs` for recursive
  build/dist and source-ownership regression coverage.
- `packages/testing/deno.json` for `lykn.macroEntry`.
- Guides 10 and 15 plus the slice close artifacts.

The implementation commit includes both required co-author trailers.

## Ledger Verification

Opening ledger rows counted: 10. Closing-report rows counted: 10. No silent
drops found.

| ID | CDC disposition | Evidence |
|----|-----------------|----------|
| F-1 | accepted | Closing report lists the required guidance/source reads; CDC also read `AGENTS.md`, Lykn SKILL/guides 10/15/16, collaboration-framework close discipline, Rust review guidance, and Deno publishing guidance. |
| F-2 | reproduced | Fresh scratch scaffold created `bin/lykn`; `/private/tmp/lykn-cdc-slice03-20260820-01/runway-fixture` ran `./bin/lykn --version` and printed `lykn 0.6.0-dev`; `cargo test -p lykn-cli` includes `fresh_scaffold_supports_local_bin_tests_nested_build_and_source_run`. |
| F-3 | reproduced | Fresh scratch `./bin/lykn test` compiled the scaffolded test module and passed `1 passed / 0 failed`; targeted DSL gates passed `28 passed / 0 failed` in both JS and Lykn forms. |
| F-4 | reproduced | Fresh scratch nested helper built to `target/lykn/build/runway-fixture/nested/helper.js`; `cargo test -p lykn-cli` includes `build_project_recurses_runtime_sources_and_preserves_ownership_boundary`. |
| F-5 | reproduced | Fresh scratch `./bin/lykn run packages/runway-fixture/source-entrypoint.lykn` printed `hello runway`; built output entrypoint printed the same. |
| F-6 | accepted | Diff review confirms runtime build output copies `.lykn`/`.lyk` and handwritten `.js` into `target/lykn/build/`, excludes arbitrary non-Lykn files for runtime build/dist, and documents that user-authored non-Lykn source remains allowed. The stronger package-metadata ownership design remains open under `D-2608-SOWN`. |
| F-7 | reproduced | `cargo test -p lykn-cli` passed, including the scaffold runway and recursive build/source-ownership tests. |
| F-8 | reproduced | CDC reran the scratch acceptance workflow at `/private/tmp/lykn-cdc-slice03-20260820-01/runway-fixture`: version, build, test, lint, nested helper build, source run, and built run all passed. |
| F-9 | reproduced | Guide doctests passed with `make test-docs`: 476 passed, 0 failed. Cited-path check passed on the committed implementation state: 613 documents checked. |
| F-10 | reproduced | Standing gates listed below passed. |

Note: one CDC file-existence probe was initially started in parallel with the
scratch build and raced the build output. It was rerun serially after the build
and passed; the source and built runs also proved the nested helper existed and
loaded correctly.

## Commands Reproduced

```text
git status --short
clean

./bin/lykn --version
lykn 0.6.0-dev

/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn new runway-fixture --path /private/tmp/lykn-cdc-slice03-20260820-01
Created Lykn project: runway-fixture

cd /private/tmp/lykn-cdc-slice03-20260820-01/runway-fixture
./bin/lykn --version
lykn 0.6.0-dev

./bin/lykn build
@runway-fixture/runway-fixture built in target/lykn/build/runway-fixture/

./bin/lykn test
1 passed / 0 failed

./bin/lykn lint packages/runway-fixture test
no lint findings (2 file(s))

./bin/lykn build
@runway-fixture/runway-fixture built in target/lykn/build/runway-fixture/

test -f target/lykn/build/runway-fixture/nested/helper.js
exit 0

./bin/lykn run packages/runway-fixture/source-entrypoint.lykn
hello runway

./bin/lykn run target/lykn/build/runway-fixture/source-entrypoint.js
hello runway
```

Standing gates:

```text
cargo fmt --check
passed

cargo test -p lykn-cli
passed

cargo test -p lykn-lang
passed

./bin/lykn build
passed

deno test --config project.json -A test/integration/testing-dsl.test.js
28 passed / 0 failed

./bin/lykn test test/integration/testing-dsl_test.lykn
28 passed / 0 failed

git diff --check
passed

make test-docs
476 passed / 0 failed

make check-cited-paths
passed; 613 documents checked
```

## Bubble-Up

slice03 delivered its assigned arc16 piece: fresh projects can now follow the
normal CLI/scaffold/package runway without the manual repairs recorded in
slice02. Specifically, `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and
`D-2608-RIMP` are closed by implementation plus regression coverage.

`D-2608-SOWN` is partially resolved: the 0.6.0 floor is now explicit and tested
for build/dist ownership, while the stronger package-metadata ownership model
remains a design decision for later arc16 planning.

The next implementation-first arc16 work should address the language-surface
decisions before book prose normalizes examples:

- `D-2608-XPRT` - top-of-module exports and `mod.lykn` export ownership.
- `D-2608-LBND` - grouped local binding / let-style surface.
- `D-2608-COND` - flatter ordered validation branching.

Book/writers-guide/chapter slices remain blocked until those language-surface
items are closed or explicitly deferred with re-entry conditions.
