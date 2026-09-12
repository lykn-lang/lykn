# CC Prompt - arc16 slice10 language-surface chapters

You are working on lykn project02, arc16, slice10. The planning home is `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice10-language-surface-chapters/`. The source/user-docs home for 0.6.x is `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`. The book content is in `/Users/oubiwann/lab/cnbb/lykn`. The writers-guide is in `/Users/oubiwann/lab/cnbb/lykn-writers-guide`.

Read and follow the active `AGENTS.md` instructions in the lang, book, and writers-guide repos. Preserve the planning/source/book split. Do not merge planning into source. Preserve the book repo's pre-existing untracked `_to_delete/` directory.

## Required reading

Before editing, read:

- `../arc-plan.md`;
- `slice-plan.md` and `ledger.md` in this slice;
- `../slice07-current-book-drift-refresh/artifacts/current-book-drift-inventory-2026-09.md`;
- `../slice08-js-fn-return-parity/closing-report.md` and `../slice08-js-fn-return-parity/cdc-verification.md`;
- `../slice09-toolchain-and-project-structure-chapters/closing-report.md`;
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/guides/` entries relevant to the language forms you touch;
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md` and `planned-toc.md`.

## Goal

Update the Lykn Book language/compiler chapters so their prose and executable `lisp` fences match current 0.6.x behavior. Use the slice07 inventory as the failure map, including kernel-only examples, intentional compile-error examples, placeholder/non-Lykn examples, stale pre-0.6.0 surface/library examples, and expected-output drift.

Pay special attention to current shipped behavior for:

- surface-vs-kernel examples and position-aware forms;
- `fn`/`lambda` returns after slice08;
- `(exports ...)`, grouped sequential `bind`, and `cond`;
- identifier mapping, records/single-constructor types, destructuring, classes, generators, equality, and diagnostics where chapters teach them.

If you find a new implementation defect, register and route it instead of making prose normalize around it.

## Out of scope

Do not redo the slice09 toolchain/testing/project-structure chapter pass. Do not perform the whole-book final build/link/voice/metadata close; slice11 owns that. Do not implement source changes unless a routed blocker must be fixed and the slice plan/ledger are updated accordingly.

## Verification

Run the focused book doctest gate from `/Users/oubiwann/lab/cnbb/lykn` for every touched language/compiler chapter, using repeated `--docs` arguments and `--fence lisp`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <chapter> --fence lisp
```

Record generated/skipped/passed/failed counts in the closing report. Run source gates only if source code or source docs change. Remove generated doctest `target/` unless intentionally tracked.

## Closeout

At close, update this slice ledger and create `closing-report.md`; update the arc plan, project/status surfaces, and next-slice state; run planning whitespace/JSON checks; then commit with the required co-author trailers.
