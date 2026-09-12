# arc09 slice03 — Publish Dry-runs and Package Audit

> **Status: Open.** slice02 prepared and committed the 0.6.0 source release
> tree at `65ff40fbcabbf3edab760947108f4a0d13ed9d99`. This slice proves the exact release tree through
> dry-runs and package artifact inspection before operator publication.

## 1. Objective

Run the 0.6.0 release dry-runs and package audit from the committed
`release/0.6.x` tree without weakening dirty-tree gates. Capture enough evidence
for the operator to decide whether to proceed to publication/tag approval.

## 2. Inputs

- [slice01 release runbook](../slice01-release-readiness-runbook/artifacts/release-runbook.md)
- [slice02 closing report](../slice02-version-bump-release-notes-ci-chore/closing-report.md)
- Source commit `65ff40fbcabbf3edab760947108f4a0d13ed9d99` on `release/0.6.x`
- Source release notes: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/release-notes-0.6.0.md`

## 3. In scope

- Confirm the source worktree is clean and at the intended commit.
- Re-run `make check` from the exact release tree.
- Run `./bin/lykn dist` and audit `target/lykn/dist/` package contents and generated metadata.
- Run `./bin/lykn publish --jsr --dry-run`.
- Run `./bin/lykn publish --npm --dry-run`.
- Run crates dry-runs without bypass flags, preferably through the repaired `make publish-dry-run` target and, if needed, direct `cargo publish -p <crate> --dry-run` commands.
- Record receipts/transcripts under this slice's `artifacts/` directory.
- Update slice/arc/project status and open the operator publication/tag slice prompt.

## 4. Out of scope

- Real publication to JSR, npm, or crates.io.
- Creating or pushing release tags.
- Pushing branches or tags to remotes.
- Publishing or tagging the book.
- Passing `--allow-dirty` or equivalent bypass flags as release evidence.
- Editing unrelated planning, source, book, or writers-guide work.

## 5. Verification

- `git status --short --branch` and `git rev-parse HEAD` before dry-runs.
- `make check` passes.
- Dist metadata and file-list audit covers all expected packages.
- JSR dry-run passes or records concrete failure evidence.
- npm dry-run passes or records concrete failure evidence.
- Crates dry-run passes for `lykn-lang`, `lykn-cli`, and `lykn`, or records concrete failure evidence.
- Final status confirms no publish/tag/push occurred.

## 6. Completion

This slice closes when dry-run/package evidence is recorded and arc09 has an
operator-publication slice prompt that names the exact release commit, package
receipts, manual approval boundary, and post-publish evidence expected next.
