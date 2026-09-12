# CC Prompt - arc16 slice09 Toolchain and Project-Structure Chapters

Read and follow:

- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/arc-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice09-toolchain-and-project-structure-chapters/slice-plan.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice09-toolchain-and-project-structure-chapters/ledger.md`
- `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice07-current-book-drift-refresh/artifacts/current-book-drift-inventory-2026-09.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md`
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md`

## Goal

Update the book chapters for toolchain, testing, project structure, build/dist/publish, source ownership, and Deno/no-Node framing against current 0.6.x truth. slice08 fixed `D-2609-FNRT` in release/0.6.x commit `8c66469`, so do not preserve prose workarounds for direct `fn`/`lambda` returns.

## Required starting checks

```sh
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/planning status --short --branch
git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x status --short --branch
git -C /Users/oubiwann/lab/cnbb/lykn status --short --branch
git -C /Users/oubiwann/lab/cnbb/lykn-writers-guide status --short --branch
```

Preserve the book repo's pre-existing untracked `_to_delete/`. Remove generated `target/` outputs after verification unless the book repo explicitly tracks them.

## Work instructions

Use slice07's refreshed inventory as the routing map for slice09. Pay special attention to:

- the four current `testing` macro book failures;
- stale Biome/ESLint or raw-Deno workflow framing;
- current `lykn test`, `lykn test --docs --fence`, `make check`, and source-only `target/lykn/test/` behavior;
- build/dist/publish paths and safety-gate wording;
- current source-ownership rules from the 0.6.x lang guides and sibling `AGENTS.md` files.

Do not perform normal language-surface chapter rewrites reserved for slice10. If a book example exposes another implementation defect, register it in `backlog/discoveries.md` and route it instead of normalizing prose around it.

## Verification

Run focused book doctests for every touched chapter, at minimum:

```sh
cd /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched-book-chapters> --fence lisp
```

Run any configured book build/check command identified from the book repo instructions. If source code or source docs change, also run the relevant release/0.6.x gates from `AGENTS.md`.

## Close

Update the ledger, add `closing-report.md`, update arc/project/status surfaces, and open the next slice if appropriate. The likely next slice is `slice10-language-surface-chapters` unless slice09 finds a new implementation blocker.
