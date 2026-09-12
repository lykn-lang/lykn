# arc16 slice07 - CDC Verification

Verified by CDC on 2026-09-12.

## Scope

CDC verified CC's slice07 close for the current book drift refresh. The review
covered the planning commit, sibling instruction commits, refreshed inventory,
slice ledger, dashboard/status rollups, and the opened slice08 route for
`D-2609-FNRT`.

## Independent Checks

Repository state checks:

- Planning worktree: `## planning`
- Lang release worktree: `## release/0.6.x`
- Book repo: `## main`, with only pre-existing untracked `_to_delete/` after
  generated doctest output cleanup
- Writers-guide repo: `## main`

Commit checks:

- Planning: `0b71c5d planning: close arc16 slice07 drift refresh`
- Book: `80681b7 docs: update arc16 planning paths`
- Writers-guide: `4ecd1cc docs: update arc16 planning paths`

Structural checks:

- `D-2609-FNRT` is present in `backlog/discoveries.md` and routes to
  `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/slice08-js-fn-return-parity/`.
- The live status dashboard is consolidated under `status/`, with project and
  arc status in `status/project02-language-toolchain-alignment/`.
- The only additional `status.html` found outside `status/` is an inherited
  historical copy under `project06-planning-reorg/.../artifacts/inherited-variants/`.
- Book and writers-guide `CLAUDE.md` files remain tracked symlinks to
  `AGENTS.md`.
- Active sibling instructions now point to the planning worktree and no longer
  point at the old source-doc planning home.
- Planning JSON status files pass `jq empty`.
- Planning `git diff --check` passes.
- The release worktree `make check-cited-paths` passes: 63 documents checked,
  601 historical citations accepted.

The planning worktree does not currently expose a `make check-cited-paths`
target; the current planning-file checks above are therefore the applicable
planning-close gates for this CDC update.

Book gate reproduction:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Reproduced the expected-red baseline after reaching Deno execution:

- generated files: 176
- extracted blocks: 444
- skipped blocks: 0
- result: 417 passed / 27 failed
- exit: 1

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

Reproduced the expected-red mixed baseline after reaching Deno execution:

- generated files: 177
- extracted blocks: 447
- skipped blocks: 0
- result: 420 passed / 27 failed
- exit: 1

The generated book `target/` directory was removed after verification so the
book repo returned to its pre-existing state.

## Finding

CDC found one close-material hygiene issue: the slice08 CC prompt referenced
the slice07 inventory using a bare sibling-relative path. That could work from
inside the arc directory, but it is ambiguous for a copied prompt. CDC updated
the prompt to use the project-relative planning path.

## Verdict

slice07 is CDC-verified. The refreshed inventory is reproducible, the current
book-fence failures are properly classified as expected-red routing input, and
`D-2609-FNRT` is correctly opened as slice08 before normal chapter rewrite work.
