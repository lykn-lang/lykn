# arc16 slice08 - CDC Verification

Verified by CDC on 2026-09-12.

## Scope

CDC verified CC's slice08 close for `D-2609-FNRT`: JS compiler parity for
return-typed `func` bodies ending in direct `fn` or `lambda` closures.

## Independent Checks

Repository state before CDC edits:

- Release worktree: `## release/0.6.x`
- Planning worktree: `## planning`
- Book repo: `## main`, with pre-existing untracked `_to_delete/`
- Writers-guide repo: `## main`

Commit checks:

- Source: `8c66469 fix: allow func to return typed closures`
- Planning: `0d2278f planning: close arc16 slice08`
- Both commits include the required Codex and Billo AI trailers.

Source diff inspection:

- `packages/lang/surface-helpers.js` removes `fn` from the JS
  `STATEMENT_ONLY_HEADS` list.
- `test/forms/dd-50.6_test.lykn` adds direct `fn` and `lambda`
  `:returns :function` cross-compiler regression coverage.
- `docs/guides/06-functions-closures.md` no longer teaches bare `fn`/`lambda`
  as statement-only in closure-return position.

Planning inspection:

- `D-2609-FNRT` is marked closed and points to the slice08 close report.
- The slice08 ledger has 7 rows, all marked done.
- The slice08 closing report walks all 7 rows and includes artifact inventory,
  verification transcript, and slice-to-arc bubble-up.
- slice09 is opened for toolchain and project-structure chapter work.

## Reproduced Verification

Release worktree:

```sh
./bin/lykn test test/forms/dd-50.6_test.lykn
```

Result: 10 passed / 0 failed, including direct typed `fn` and `lambda` return
regressions.

```sh
cargo fmt --check
cargo test -p lykn-cli
deno test --config project.json -A test/
make test-docs
make check-cited-paths
```

Results:

- `cargo fmt --check`: passed
- `cargo test -p lykn-cli`: passed
- `deno test --config project.json -A test/`: 763 passed / 0 failed
- `make test-docs`: 482 passed / 0 failed
- `make check-cited-paths`: passed, 63 documents checked, 601 historical
  citations accepted

Book subset:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter4/3-scope.md src/part2/chapter7/4-closures.md --fence lisp
```

Result from `/Users/oubiwann/lab/cnbb/lykn`: 1 generated doctest file, 3
blocks, 0 skipped, 3 passed / 0 failed.

The generated book `target/` directory was removed after verification; the book
repo returned to its pre-existing `_to_delete/`-only untracked state.

Planning checks before commit:

```sh
git diff --check
jq empty status/status.json status/project02-language-toolchain-alignment/status.json status/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/status.json
```

Both passed.

## Verdict

slice08 is CDC-verified. `D-2609-FNRT` is fixed on the maintained JS compiler
path, covered by cross-compiler regression tests, and no longer blocks
book-facing chapter work. slice09 is the correct next executable slice.
