# arc16 slice09 - Toolchain and Project-Structure Chapters

> **Status:** Opened 2026-09-12 from slice08. slice08 fixed `D-2609-FNRT`; CDC verification is pending, so stop and surface if CDC reopens the compiler parity blocker.

## Goal

Update the Lykn Book chapters that teach project layout, Deno boundaries, testing, tooling, CI/CD, build/dist/publish, and source ownership so they match the current 0.6.x language repo and sibling-repo instructions.

## Scope

In scope:

- Re-read the current book, writers-guide, lang `AGENTS.md`, source guides, and slice07 drift inventory entries routed to slice09.
- Update the relevant book chapters in `/Users/oubiwann/lab/cnbb/lykn` for the current `lykn test`, `lykn test --docs --fence`, `make check`, build/dist/publish, source-ownership, and no-Node/Deno framing.
- Fix or route the four current `testing` macro book failures from the slice07 inventory.
- Remove or rewrite stale Biome/ESLint/raw-Deno workflow claims where they conflict with current 0.6.x guidance.
- Run focused book fence gates for touched chapters and any source-tree gates needed by edits.

Out of scope:

- Normal language-surface chapter rewrites reserved for slice10.
- New compiler/tooling implementation, except for a newly discovered blocking defect that must be registered and routed before prose normalizes it.
- Final whole-book build/EPUB/link/voice close, reserved for slice11.

## Verification

Minimum expected gates:

```sh
# from /Users/oubiwann/lab/cnbb/lykn
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs <touched-book-chapters> --fence lisp
```

Also run any source-tree gates required by lang edits. If the slice edits only book prose/examples, run the affected book fence subset and the book repository's configured render/build checks identified during grounding.

## Exit Criteria

- Touched toolchain/project-structure/testing/build/publish chapters no longer teach stale 0.5.x or pre-arc16 paths.
- The four `testing` macro failures from slice07 are fixed or explicitly routed with permanent discovery IDs.
- Book examples touched by this slice pass the focused `--fence lisp` doctest gate or are annotated/routed with rationale.
- Book checkout status preserves pre-existing `_to_delete/` and does not leave generated `target/` artifacts.
- Arc16/project/status surfaces are updated with the outcome and next slice.
