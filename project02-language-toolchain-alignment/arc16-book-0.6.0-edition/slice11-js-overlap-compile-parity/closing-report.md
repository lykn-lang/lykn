# arc16 slice11 - JS Overlap Compile Parity Closing Report

Date: 2026-09-12
Status: **Closed / CDC-verified**

## Outcome

`D-2609-FOVL` is fixed. The JS API path now rejects overlapping multi-clause `func` definitions at compile time before emitting dispatch code, matching the CLI compile path for the book overlap examples.

The book overlap chapter no longer carries the temporary JS-API caveat. The three intentional-overlap examples are restored as `lisp,compile-fail` fences and are covered by the focused book doctest gate.

## Changes

Source commit: `2a0cabf` (`release/0.6.x`)

- `packages/lang/classifier.js` now checks parsed multi-clause `func` signatures for same-arity compatible dispatch types before sorting clauses and emitting first-match dispatch code.
- `test/forms/language-surface-runway.test.js` adds regressions for duplicate typed overlap, `:any` subsumption, and destructured-object overlap.

Book commit: `43cfebc` (`/Users/oubiwann/lab/cnbb/lykn` main)

- `src/part2/chapter8/4-overlap.md` removes the temporary `D-2609-FOVL` caveat.
- The skipped overlap examples are now `lisp,compile-fail` examples.

## Reproduction and verification

Initial reproduction:

- CLI compile rejected `/private/tmp/overlap1.lykn` with `bad: clauses 0 and 1 overlap (same arity 1, compatible types)`.
- Pre-fix JS API through `packages/lang/mod.js` emitted duplicate first-match dispatch checks and a fall-through `TypeError` instead of throwing at compile time.
- Post-fix JS API probe throws `bad: clauses 0 and 1 overlap (same arity 1, compatible types)`.

Source gates:

```sh
deno test --config project.json -A test/forms/language-surface-runway.test.js
```

Result: passed, 7/0.

```sh
make check
```

Result: passed, all checks. The first sandboxed run reached `npm_dry_run_produces_expected_file_list` and failed because npm could not write log files under `/Users/oubiwann/.npm/_logs`; the same gate was rerun outside the sandbox and passed.

Book gates:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src/part2/chapter8/4-overlap.md --fence lisp
```

Result: generated 1 test file with 4 blocks, 0 skipped; passed 4/0.

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Result: generated 177 test files with 428 blocks, 19 skipped; passed 428/0.

Hygiene gates:

```sh
git diff --check -- packages/lang/classifier.js test/forms/language-surface-runway.test.js
git -C /Users/oubiwann/lab/cnbb/lykn diff --check -- src/part2/chapter8/4-overlap.md
```

Result: both passed.

Generated book `target/` was removed after the doctest runs. The pre-existing untracked `_to_delete/` directory in the book repo was preserved.

## Ledger row walk

- O-1 done: both paths were reproduced before the fix.
- O-2 done: Rust analysis and CLI behavior define overlap as a compile-time error for 0.6.x.
- O-3 done: JS API overlap detection landed in `2a0cabf` with regression coverage.
- O-4 done: the book chapter was updated in `43cfebc`; focused doctest passed 4/0.
- O-5 done: focused JS regression, canonical source gate, focused book gate, and whole-book `lisp` gate passed.
- O-6 done: generated book `target/` was removed and unrelated `_to_delete/` was left alone.
- O-7 done: this closeout updates the ledger, discovery row, arc/project/status surfaces, and opens slice12.

## Next slice

arc16 can now proceed to `slice12-edition-close-and-release-gate`, the final whole-book edition close and release-gate pass before handing back to arc09.

CDC verification is recorded in [`cdc-verification.md`](cdc-verification.md).
