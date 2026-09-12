# arc16 slice09 - CDC Verification

Verified by CDC on 2026-09-12.

## Scope

CDC verified CC's slice09 close for the Lykn Book toolchain, testing,
project-structure, build/dist, publish, Deno/no-Node, CI, and source-ownership
chapter refresh.

## Independent Checks

Repository state before CDC edits:

- Book repo: `## main`, with pre-existing untracked `_to_delete/`
- Planning worktree: `## planning`
- Release worktree: `## release/0.6.x`
- Writers-guide repo: `## main`

Commit checks:

- Book: `03b3818 docs: refresh lykn toolchain chapters`
- Planning: `2229a1c planning: close arc16 slice09`
- Both commits include the required Codex and Billo AI trailers.

Diff inspection:

- The book commit touches the expected installation, Deno, testing, tooling,
  project-structure, CI, docs-CI, deployment, and `SUMMARY.md` surfaces.
- The planning commit adds the slice09 close report, closes the seven-row
  slice09 ledger, opens slice10, and updates project/arc/status surfaces.

Silent-drop check:

- Opening ledger rows: 7.
- Closing-report row disposition: all 7 rows accounted for by scope, chapter
  map, verification, repository hygiene, planning closeout, and bubble-up.
- Final ledger counts: 7 done, 0 deferred, 0 no-op, 0 pending.

## Reproduced Verification

Focused touched-book doctest gate from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched-book-chapters> --fence lisp
```

Result:

- 7 generated test files
- 5 runnable blocks
- 13 skipped blocks
- 5 passed / 0 failed

Book render:

```sh
mdbook build -d book
```

Result: passed. The only reported warning was the existing mdbook-mermaid
preprocessor version warning.

Whitespace and status checks:

```sh
git -C /Users/oubiwann/lab/cnbb/lykn diff --check
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning diff --check
python3 -m json.tool status/status.json
python3 -m json.tool status/project02-language-toolchain-alignment/status.json
python3 -m json.tool status/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/status.json
```

Results: all passed.

The generated book doctest `target/` directory was removed after verification.
The book repo returned to its pre-existing `_to_delete/`-only untracked state.

## Verdict

slice09 is CDC-verified. The toolchain/project-structure chapter pass landed in
the book repo, its focused executable examples pass the current `--fence lisp`
gate, the skipped testing-macro fragments are explicitly justified as
project-context examples, and no new implementation blocker was found.

slice10 remains the correct active slice for the remaining language-surface
chapter work.
