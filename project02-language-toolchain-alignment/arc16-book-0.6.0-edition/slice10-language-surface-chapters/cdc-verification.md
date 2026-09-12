# arc16 slice10 - CDC Verification

Verified by CDC on 2026-09-12.

## Scope

CDC verified CC's slice10 close for the Lykn Book language/compiler chapter
refresh and the routed `D-2609-FOVL` implementation blocker.

## Independent Checks

Repository state before CDC edits:

- Book repo: `## main`, with pre-existing untracked `_to_delete/`
- Planning worktree: `## planning`
- Release worktree: `## release/0.6.x`
- Writers-guide repo: `## main`

Commit checks:

- Book: `6aa379d docs: refresh lykn language chapters`
- Planning: `d80fc63 planning: close arc16 slice10`
- Both commits include the required Codex and Billo AI trailers.

Diff inspection:

- The book commit touches the 14 language/compiler chapter files named in the
  slice10 closing report.
- The planning commit adds the `D-2609-FOVL` discovery, closes the eight-row
  slice10 ledger, opens slice11, shifts edition close to slice12, and updates
  project/arc/status surfaces.

Silent-drop check:

- Opening ledger rows: 8.
- Closing-report row walk: L-1 through L-8 are each present exactly once.
- Final ledger counts: 8 done, 0 deferred, 0 no-op, 0 pending.

## Reproduced Verification

Focused touched-chapter book gate from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched-language-chapters> --fence lisp
```

Result:

- 14 generated test files
- 39 runnable blocks
- 9 skipped blocks
- 39 passed / 0 failed

Whole-book `lisp` gate from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Result:

- 177 generated test files
- 425 runnable blocks
- 22 skipped blocks
- 425 passed / 0 failed

Book render:

```sh
mdbook build -d book
```

Result: passed. The only reported warning was the existing mdbook-mermaid
preprocessor version warning.

Book whitespace:

```sh
git -C /Users/oubiwann/lab/cnbb/lykn diff --check
```

Result: passed.

`D-2609-FOVL` probe:

- CLI compile rejected the overlapping `func` clauses with
  `clauses 0 and 1 overlap (same arity 1, compatible types)`.
- The JS API returned generated code with two compatible `number` checks and a
  fall-through `TypeError` instead of throwing at compile time.

Planning checks before CDC commit:

```sh
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning diff --check
python3 -m json.tool status/status.json
python3 -m json.tool status/project02-language-toolchain-alignment/status.json
python3 -m json.tool status/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/status.json
```

Results: all passed.

The generated book doctest `target/` directory and temporary overlap probe
files were removed after verification. The book repo returned to its
pre-existing `_to_delete/`-only untracked state.

## Verdict

slice10 is CDC-verified. The language/compiler chapter pass is green under the
focused and whole-book `--fence lisp` gates, and `D-2609-FOVL` is correctly
routed to slice11 before edition close.
