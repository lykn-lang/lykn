# CC Prompt - arc16 slice03: CLI scaffold package runway

You are CC in the implementation seat. CDC has opened arc16 slice03 to turn the
slice02 dogfood runway failures into focused 0.6.0 implementation work before
the Lykn Book starts teaching project structure.

## Branch and Repo

Work in:

```text
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x
```

Branch:

```text
release/0.6.x
```

Do not edit the sibling book repo or writers-guide repo in this slice. Do not
work on exports, grouped local bindings, or `cond` here; those are later
language-surface decisions.

## Required Reading

Read these before editing:

1. `AGENTS.md`
2. `assets/ai/SKILL.md`
3. `docs/guides/10-project-structure.md`
4. `docs/guides/15-lykn-cli.md`
5. `docs/guides/16-testing.md`
6. Rust language/project guidelines before editing Rust
7. Deno-based JavaScript guidelines before editing JS or Deno-facing package
   metadata
8. `docs/design-v0.6.0/arc16-book-0.6.0-edition/arc-plan.md`
9. `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/closing-report.md`
10. `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice02-dogfood-implementation-runway/cdc-verification.md`
11. `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/slice-doc.md`
12. `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice03-cli-scaffold-package-runway/ledger.md`

Then inspect the likely implementation seams:

- `crates/lykn-cli/src/main.rs`
- `crates/lykn-cli/src/dist.rs`
- `crates/lykn-cli/src/config.rs`
- `crates/lykn-lang/src/expander/pass0.rs`
- `packages/testing/deno.json`
- `packages/testing/mod.lykn`
- existing integration tests under `crates/lykn-cli/tests/` and `test/integration/`

## Implementation Assignment

Close the first arc16 implementation-routing cluster:

- `D-2608-BINW`: fresh scaffolds should support the project-local
  `./bin/lykn` workflow, or the project must deliberately stop promising that
  command shape.
- `D-2608-TDSL`: the scaffolded Lykn test must run through the testing macro
  package in a fresh project.
- `D-2608-BREC`: nested package source must either build recursively with
  preserved relative paths, or fail with a clear diagnostic and documented
  flat-package rule.
- `D-2608-RIMP`: source-file `lykn run` with relative imports must either work
  from the source/package context, or fail with a clear diagnostic steering to a
  built entrypoint.
- `D-2608-SOWN`: preserve the 0.6.0 source ownership floor. User-authored
  non-Lykn files are allowed in source trees; Lykn-owned generated output must
  stay under generated homes such as `target/lykn/`.

CDC's opening read found one likely run fix: `lykn compile` already has
source-context plumbing for temporary compilation, but `cmd_run` currently calls
the plain compile-file path and writes a fixed temp file. Treat that as a lead,
not a mandate; prove the final behavior with tests.

## Required Behavior Demo

Create a fresh scratch project outside tracked source trees, for example under
`/private/tmp`, and demonstrate the accepted workflow. At minimum:

```sh
./bin/lykn new runway-fixture --path /private/tmp/<scratch>
cd /private/tmp/<scratch>/runway-fixture
./bin/lykn --version
./bin/lykn build
./bin/lykn test
./bin/lykn lint packages/runway-fixture test
```

Then add a small nested helper module and source entrypoint that imports it.
Record:

```sh
./bin/lykn build
test -f target/lykn/build/runway-fixture/<nested-helper>.js
./bin/lykn run packages/runway-fixture/<source-entrypoint>.lykn
./bin/lykn run target/lykn/build/runway-fixture/<built-entrypoint>.js
```

If you intentionally narrow any behavior instead of implementing it, replace
the relevant demo command with the new expected diagnostic and explain the
deferral/re-entry condition.

## Required Automated Coverage

Add focused regression coverage. Prefer tests close to the behavior:

- scaffold/bin behavior near the CLI scaffold code;
- recursive build/copy behavior near `build_project`/dist helpers;
- source-run import behavior near CLI run/compile integration;
- testing macro package behavior in existing testing DSL or expander coverage.

Do not rely on the scratch transcript alone for a `done` row.

## Required Checks

Run all relevant checks before commit:

```sh
cargo fmt --check
cargo test -p lykn-cli
```

Also run when relevant:

```sh
cargo test -p lykn-lang
deno test --config project.json -A test/integration/testing-dsl.test.js
./bin/lykn test test/integration/testing-dsl_test.lykn
```

Always run the docs/planning bar because this slice touches release-gating
planning and may touch guides:

```sh
git diff --check
make check-cited-paths
make test-docs
```

If a gate fails for a pre-existing or intentionally exposed reason, record the
exact command, exit status, and re-entry condition. Do not report a failed gate
as passed.

## Required Close

When done, write the standard slice close report in this slice directory. It
must include:

1. Source material read, with one-line roles.
2. Implementation summary grouped by discovery ID.
3. Tests added or changed.
4. Scratch acceptance transcript.
5. Row-by-row ledger walk for F-1 through F-10.
6. Bubble-up to arc16:
   - whether any of the five runway findings remain open;
   - whether the next slice should be another dogfood pass or the language
     surface slice for exports/grouped locals/branching;
   - what remains blocked on Duncan's design decision.

Commit the implementation and close artifacts together unless Duncan directs a
split. Use the shared trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```
