# arc09 slice02 — Version Bump, Release Notes, and CI Chore

> **Status: Open.** slice01 produced the 0.6.0 release runbook and opened this
> slice to prepare the exact release tree before dry-runs.

## 1. Objective

Prepare the committed `release/0.6.x` source tree for 0.6.0 dry-runs by changing
release-facing versions from `0.6.0-dev` to `0.6.0`, updating release notes,
applying low-risk CI checkout maintenance if still current, and resolving the
`make publish-dry-run` no-bypass evidence hazard.

## 2. Inputs

- [slice01 release runbook](../slice01-release-readiness-runbook/artifacts/release-runbook.md)
- [slice01 version surface inventory](../slice01-release-readiness-runbook/artifacts/version-surface-inventory.md)
- [slice01 release-note input inventory](../slice01-release-readiness-runbook/artifacts/release-note-inputs.md)
- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
- Planning worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

## 3. In scope

- Update release-facing Rust and JS package versions from `0.6.0-dev` to `0.6.0`.
- Regenerate/update `Cargo.lock` when necessary.
- Verify the rebuilt CLI reports `lykn 0.6.0`.
- Draft the 0.6.0 release notes from the curated slice01 inputs.
- Check README/docs for release-facing version strings that must change now.
- Apply `actions/checkout@v5` maintenance if current action compatibility still supports it.
- Repair `make publish-dry-run` to avoid `--allow-dirty`, or explicitly record why slice03 will use direct cargo no-bypass commands instead.
- Run the source validation needed before dry-runs, normally `make check`.
- Commit source changes on `release/0.6.x` with the required co-author trailers.
- Update this slice ledger, arc09 ledger/status, and open the next dry-run slice prompt.

## 4. Out of scope

- Real publication to JSR, npm, or crates.io.
- Creating or pushing release tags.
- Publishing or tagging the book.
- Weakening dirty-tree or publish safety gates.
- Editing unrelated Project07 planning changes or book `_to_delete/` files.

## 5. Verification

- `git status --short --branch` before and after source edits.
- Version-surface diff against the slice01 inventory.
- `./bin/lykn --version` after rebuild, expected `lykn 0.6.0`.
- `make check` from the source release worktree.
- JSON/status parse checks for any planning status changes.
- Explicit final pathspec review before staging/committing.

## 6. Completion

This slice closes when the release tree has a committed version/release-note/CI
prep diff, validation evidence is recorded, and slice03 is open with exact
dry-run commands and artifact receipt expectations.
