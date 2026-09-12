# CC Prompt — arc09 slice03 Publish Dry-runs and Package Audit

You are working in the Lykn language repository. Read and follow AGENTS.md,
project-management guidance, and work-verification guidance before running the
release gates.

## Context

Planning authority lives in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

Source release work for 0.6.0 lives in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`

slice02 prepared the 0.6.0 source release tree and committed:

`65ff40fbcabbf3edab760947108f4a0d13ed9d99 Prepare 0.6.0 release tree`

Use these inputs:

- `project02-language-toolchain-alignment/arc09-release-0.6.0/slice01-release-readiness-runbook/artifacts/release-runbook.md`
- `project02-language-toolchain-alignment/arc09-release-0.6.0/slice02-version-bump-release-notes-ci-chore/closing-report.md`
- `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/release-notes-0.6.0.md`

## Goal

Run the 0.6.0 dry-runs and package audit from the exact committed
`release/0.6.x` tree without weakening dirty-tree gates. Capture the evidence
needed for the operator publication/tag approval slice.

## Required scope

1. Confirm worktrees and status before running gates:
   - source `release/0.6.x` branch/worktree clean;
   - source `HEAD` equals `65ff40fbcabbf3edab760947108f4a0d13ed9d99` or explicitly record any newer source commit and why it is in scope;
   - planning branch/worktree status;
   - book/writers-guide status only if inspected.
2. Run the canonical source gate:

   ```sh
   make check
   ```

3. Stage and audit dist packages:

   ```sh
   ./bin/lykn dist
   ```

   Record generated `deno.json` and `package.json` names/versions for
   `browser`, `lang`, and `testing`. Inspect the generated package file lists
   enough to catch missing README/LICENSE/stubs or stale versions.
4. Run JSR dry-run:

   ```sh
   ./bin/lykn publish --jsr --dry-run
   ```

5. Run npm dry-run:

   ```sh
   ./bin/lykn publish --npm --dry-run
   ```

6. Run crates dry-runs without bypass flags:

   ```sh
   make publish-dry-run
   ```

   If that fails for a reason that needs narrower evidence, run the direct
   no-bypass commands and record both the target failure and direct evidence:

   ```sh
   cargo publish -p lykn-lang --dry-run
   cargo publish -p lykn-cli --dry-run
   cargo publish -p lykn --dry-run
   ```

7. Save concise receipts or transcripts under this slice's `artifacts/` directory.
8. Do not publish, tag, or push.
9. Update planning:
   - this slice ledger and closing report;
   - arc09 ledger/status;
   - Project02 status if current slice changes;
   - open `slice04-operator-publication-and-tags/cc-prompt.md` with the exact manual approval boundary.

## Out of scope

- Real publication to JSR, npm, or crates.io.
- Creating or pushing `0.6.0` or `book-v0.6.0` tags.
- Pushing branches/remotes.
- Passing `--allow-dirty` or any equivalent bypass flag as release evidence.
- Editing unrelated Project07 planning, book `_to_delete/`, or other unrelated work.

## Expected final response

Report dry-run results, artifact receipt locations, source commit checked,
whether any gate failed, and the next slice prompt path. Keep operator
publication/tag approval separate from dry-run success.
