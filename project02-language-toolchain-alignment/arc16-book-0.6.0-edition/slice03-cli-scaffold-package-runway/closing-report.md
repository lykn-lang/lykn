# arc16 slice03 - CLI Scaffold Package Runway Closing Report

## 1. Source Material Read

| File | Role in this slice |
|------|--------------------|
| `AGENTS.md` | Branch/worktree rules, generated-output policy, arc16 split layout, and required commit trailers. |
| `assets/ai/SKILL.md` | Lykn authoring rules: CLI-only workflow, generated output boundary, package-root source, tests, and Deno boundary. |
| `docs/guides/10-project-structure.md` | Project layout truth for package roots, nested feature directories, local binary, generated homes, and source ownership. |
| `docs/guides/15-lykn-cli.md` | `lykn new`, `build`, `test`, `lint`, `run`, `dist`, and publish command truth. |
| `docs/guides/16-testing.md` | Testing DSL import shape, scaffolded Lykn test expectations, and `lykn test` behavior. |
| `/Users/oubiwann/.agents/skills/rust-guidelines/SKILL.md` | Rust implementation guidance used before editing CLI code. |
| `/Users/oubiwann/.agents/skills/rust-guidelines/guides/11-anti-patterns.md` | Rust anti-pattern checks for new traversal and CLI helpers. |
| `/Users/oubiwann/.agents/skills/rust-guidelines/guides/14-cli-tools/03-error-handling.md` | CLI error-message and exit-code guidance. |
| `/Users/oubiwann/.agents/skills/rust-guidelines/guides/14-cli-tools/06-testing.md` | CLI integration-test guidance for subprocess coverage. |
| `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/SKILL.md` | Deno/package metadata guidance before changing `packages/testing/deno.json`. |
| `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/guides/12-deno/12-04-publishing.md` | Deno/JSR metadata context for macro package publish truth. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md` | Arc status, implementation-first rule, and slice03 scope. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md` | Original dogfood failures and routing recommendations for `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and `D-2608-SOWN`. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/cdc-verification.md` | CDC reproduction of slice02 failures and required next implementation cluster. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/slice-plan.md` | Slice goal, scope, expected behavior, and verification bar. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/ledger.md` | F-1 through F-10 acceptance criteria. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/cc-prompt.md` | Direct execution contract. |
| `crates/lykn-cli/src/main.rs` | `cmd_new`, scaffold templates, local binary install, local testing overlay, `cmd_run`, and CLI test/run behavior. |
| `crates/lykn-cli/src/dist.rs` | `build_project`, recursive compilation/copying, dist staging, and generated metadata/stubs. |
| `crates/lykn-cli/src/config.rs` | Project/package config parsing and the local overlay writer used by the scaffold. |
| `crates/lykn-lang/src/expander/pass0.rs` | Macro package resolution, `lykn.macroEntry`, fallback entry lookup, and import-map behavior. |
| `packages/testing/deno.json` | Testing macro package metadata. |
| `packages/testing/mod.lykn` | Testing macro package entry surface. |
| `crates/lykn-cli/tests/` and `test/integration/` | Existing CLI and integration-test conventions used for regression coverage. |

Note: this worktree does not contain in-repo Rust or JS AI guidance
directories; the available Rust and Deno JS guideline skills under
`/Users/oubiwann/.agents/skills/` were used instead.

## 2. Implementation Summary

| Discovery | Disposition | Implementation evidence |
|-----------|-------------|-------------------------|
| `D-2608-BINW` | Implemented. Fresh scaffolds now include a project-local `bin/lykn`. | `cmd_new` creates `bin/`, copies the active executable into `bin/lykn`, sets executable mode on Unix, and updates scaffold README/next-step/task commands to `./bin/lykn`. Covered by `fresh_scaffold_supports_local_bin_tests_nested_build_and_source_run`. |
| `D-2608-TDSL` | Implemented for local dogfood and future package publish. | Scaffolded tests now import macros via bare `testing`; generated `project.json` remains registry-oriented; when `lykn new` is run from a source checkout, it writes gitignored `project.local.json` pointing `testing` and `testing/` at the local testing package. `packages/testing/deno.json` now declares `lykn.macroEntry`. Covered by fresh scaffold `./bin/lykn test` and targeted testing DSL gates. |
| `D-2608-BREC` | Implemented by recursive build/dist traversal. | `build_project` now compiles nested `.lykn` and `.lyk` files and copies nested handwritten `.js` files while preserving package-relative paths. Runtime dist copy and macro-module source copy are recursive as well. Covered by the recursive build/dist regression and scratch `test -f` check. |
| `D-2608-RIMP` | Implemented for workspace package source files. | `lykn run` on a workspace source file now builds the workspace and executes the package build output path, so relative imports resolve beside generated package output instead of from the OS temp directory. Non-workspace source still compiles under `target/lykn/run/` when a project root exists, otherwise to temp. Covered by fresh scaffold source and built entrypoint runs. |
| `D-2608-SOWN` | 0.6.0 floor implemented. | `build`, `run`, and `test` keep generated JS under `target/lykn/`; package source trees may contain arbitrary non-Lykn files, but `lykn build` does not copy them into build output. `project.local.json`, `bin/`, and `target/` are gitignored scaffold/local generated homes. |

## 3. Files Changed

| File | Change |
|------|--------|
| `crates/lykn-cli/src/main.rs` | Added project-local binary install, optional local testing overlay generation, scaffold command updates, and source-run routing to workspace build output. |
| `crates/lykn-cli/src/dist.rs` | Added recursive package file traversal for compile/copy/dist/stub generation. |
| `crates/lykn-cli/tests/publishing_build_each_kind.rs` | Added recursive build/dist and source-ownership regression coverage. |
| `crates/lykn-cli/tests/scaffold_runway.rs` | Added end-to-end fresh scaffold runway coverage. |
| `packages/testing/deno.json` | Added explicit `lykn.macroEntry`. |
| `docs/guides/10-project-structure.md` | Documented recursive build behavior and non-Lykn source ownership boundary. |
| `docs/guides/15-lykn-cli.md` | Documented scaffolded `bin/lykn`, local testing overlay, and updated `lykn run` source behavior. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md` | Updated slice03 status and arc ledger evidence. |
| `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/ledger.md` | Closed F-1 through F-10 with evidence. |

## 4. Automated Coverage

| Behavior | Coverage |
|----------|----------|
| Scaffold local binary | `crates/lykn-cli/tests/scaffold_runway.rs`, assertion that `bin/lykn` exists and `./bin/lykn --version` succeeds. |
| Scaffolded Lykn testing DSL | `crates/lykn-cli/tests/scaffold_runway.rs`, fresh `./bin/lykn test`; plus `deno test --config project.json -A test/integration/testing-dsl.test.js` and `./bin/lykn test test/integration/testing-dsl_test.lykn`. |
| Recursive package build/copy | `build_project_recurses_runtime_sources_and_preserves_ownership_boundary` in `crates/lykn-cli/tests/publishing_build_each_kind.rs`. |
| Source-run relative import | `crates/lykn-cli/tests/scaffold_runway.rs`, fresh source entrypoint importing a nested helper. |
| Source ownership floor | `build_project_recurses_runtime_sources_and_preserves_ownership_boundary` proves arbitrary non-Lykn package source files are allowed but not copied into build/dist output. |

## 5. Scratch Acceptance Transcript

Scratch parent:

```text
/private/tmp/lykn-runway-slice03.V43IAJ
```

Commands and results:

```text
$ /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn new runway-fixture --path /private/tmp/lykn-runway-slice03.V43IAJ
exit 0
Created Lykn project: runway-fixture
Next steps use ./bin/lykn.

$ cd /private/tmp/lykn-runway-slice03.V43IAJ/runway-fixture

$ ./bin/lykn --version
exit 0
lykn 0.6.0-dev

$ ./bin/lykn build
exit 0
@runway-fixture/runway-fixture built in target/lykn/build/runway-fixture/

$ ./bin/lykn test
exit 0
Compiled 1 .lykn test file(s) to target/lykn/test.
runway-fixture: placeholder test ... ok
ok | 1 passed | 0 failed

$ ./bin/lykn lint packages/runway-fixture test
exit 0
no lint findings (2 file(s))
```

After adding nested helper source and a source entrypoint:

```text
packages/runway-fixture/nested/helper.lykn
packages/runway-fixture/source-entrypoint.lykn
```

Final commands and results:

```text
$ ./bin/lykn build
exit 0
@runway-fixture/runway-fixture built in target/lykn/build/runway-fixture/

$ test -f target/lykn/build/runway-fixture/nested/helper.js
exit 0

$ ./bin/lykn run packages/runway-fixture/source-entrypoint.lykn
exit 0
hello runway

$ ./bin/lykn run target/lykn/build/runway-fixture/source-entrypoint.js
exit 0
hello runway
```

## 6. Verification Transcript

| Command | Result |
|---------|--------|
| `cargo test -p lykn-cli build_project_recurses_runtime_sources_and_preserves_ownership_boundary` | exit 0; focused recursive build/dist regression passed. |
| `cargo test -p lykn-cli fresh_scaffold_supports_local_bin_tests_nested_build_and_source_run` | exit 0; focused scaffold runway regression passed. |
| `cargo test -p lykn-cli` | initially failed because the ignored repo `bin/lykn` helper was stale relative to edited Rust sources. Refreshed ignored local binary from `target/debug/lykn`. |
| `env LYKN_BIN=target/debug/lykn cargo test -p lykn-cli` | in sandbox, progressed past stale-binary guard but failed at npm dry-run logging under the home directory. |
| `cargo test -p lykn-cli` | exit 0 outside the sandbox after refreshing ignored `bin/lykn`; all lykn-cli unit, integration, publish dry-run, scaffold, and doctest targets passed. |
| `cargo test -p lykn-lang` | exit 0; 1099 unit tests plus language integration/doc tests passed. |
| `./bin/lykn build` | exit 0; rebuilt `@lykn/lang`, `@lykn/browser`, and `@lykn/testing`. |
| `deno test --config project.json -A test/integration/testing-dsl.test.js` | exit 0; 28 passed, 0 failed. |
| `./bin/lykn test test/integration/testing-dsl_test.lykn` | exit 0; 28 passed, 0 failed. |
| `cargo fmt --check` | exit 0. |
| `git diff --check` | exit 0. |
| `make test-docs` | exit 0; generated 22 doctest files with 476 Lykn blocks, 476 passed, 0 failed. |
| `make check-cited-paths` | pre-commit exit 2; expected because this new `closing-report.md` is cited by the ledger and arc plan but is not present in `HEAD` until committed. This gate must be rerun against the committed tree. |
| `make check-cited-paths` | post-commit exit 2; flagged close-report mentions of non-existent in-repo guidance directories and a scratch scaffold test path as path citations. The close report was revised to avoid claiming those as tracked repo paths. |
| `make check-cited-paths` | final committed-tree exit 0; 613 documents checked on `release/0.6.x`, with historical citations accepted from the frozen census. |

One non-gate sweep command was mistyped with shell backticks in the regex, which
accidentally invoked `lykn test` and `lykn run` through command substitution.
Follow-up `git status` showed no tracked or untracked source byproducts, and the
sweep was rerun with safe single-quoted regex.

## 7. Ledger Walk

| ID | Status | Evidence |
|----|--------|----------|
| F-1 | done | Section 1 lists all required guidance, arc/slice docs, source seams, and test areas read before edits. |
| F-2 | done | `cmd_new` installs `bin/lykn`; fresh scratch `./bin/lykn --version` exited 0; `scaffold_runway.rs` covers it. |
| F-3 | done | The scaffolded test imports `testing` and passed through `./bin/lykn test`; `packages/testing/deno.json` now declares `macroEntry`. |
| F-4 | done | Recursive build emits nested Lykn/kernel/JS outputs with preserved relative paths; scratch `test -f` and Rust regression cover it. |
| F-5 | done | Source-file `lykn run` on the scratch entrypoint imported a nested helper and printed `hello runway`; `scaffold_runway.rs` covers it. |
| F-6 | done | Build/run/test write generated output under `target/lykn/`; scaffold/local generated homes are gitignored; arbitrary non-Lykn source is accepted but not copied into build/dist. |
| F-7 | done | `cargo test -p lykn-cli` includes scaffold/bin, testing macro, recursive build/copy, source-run, and ownership regressions. |
| F-8 | done | Section 5 records the fresh scratch acceptance demo with commands, exits, and outputs. |
| F-9 | done | Guides 10 and 15 were updated; stale-claim sweep found only intentional `./bin/lykn` command shapes after safe rerun; `make test-docs` passed. |
| F-10 | done | Implementation gates, `cargo fmt --check`, `git diff --check`, `make test-docs`, `make check-cited-paths`, `cargo test -p lykn-cli`, `cargo test -p lykn-lang`, and targeted Deno/Lykn DSL tests passed. |

## 8. Bubble-Up

slice03 closes the first CLI/scaffold/package runway cluster for 0.6.0, pending
CDC verification. A fresh project no longer needs the manual repairs recorded
in slice02 for local binary, testing macros, nested build output, or source-run
relative imports.

Recommended next arc16 move:

1. Run CDC verification against this close, especially the scratch acceptance
   transcript and the new `scaffold_runway.rs` coverage.
2. Open or schedule the language-surface implementation decision slice for
   `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`, or explicitly defer them
   with re-entry conditions.
3. Keep book/writers-guide prose blocked until those accepted language-surface
   decisions are closed or deferred; the CLI/package runway itself is no longer
   a blocker after this slice.

Known limitation: the scaffold uses `project.local.json` only as a local
source-checkout overlay before the fixed `@lykn/testing` package is published.
The committed scaffold `project.json` remains registry-oriented; package publish
will carry the new `lykn.macroEntry` metadata.
