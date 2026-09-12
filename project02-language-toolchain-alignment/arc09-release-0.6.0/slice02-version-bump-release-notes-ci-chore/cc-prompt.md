# CC Prompt — arc09 slice02 Version Bump, Release Notes, and CI Chore

You are working in the Lykn language repository. Read and follow the repository
AGENTS.md plus the project-management and work-verification guidance before
making changes.

## Context

Planning authority lives in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

Source release work for 0.6.0 lives in:

`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`

Book content lives in:

`/Users/oubiwann/lab/cnbb/lykn`

slice01 closed as CC proposed-done and produced the release runbook:

`project02-language-toolchain-alignment/arc09-release-0.6.0/slice01-release-readiness-runbook/artifacts/release-runbook.md`

Use these slice01 artifacts as binding inputs for this slice:

- `slice01-release-readiness-runbook/artifacts/version-surface-inventory.md`
- `slice01-release-readiness-runbook/artifacts/release-note-inputs.md`
- `slice01-release-readiness-runbook/artifacts/release-runbook.md`

## Goal

Prepare the exact `release/0.6.x` tree for 0.6.0 dry-runs. Change
release-facing versions from `0.6.0-dev` to `0.6.0`, draft the 0.6.0 release
notes, apply low-risk CI checkout maintenance if still current, resolve the
`make publish-dry-run` no-bypass evidence hazard, validate, commit source
changes, and open the dry-run slice.

## Required scope

1. Confirm worktrees and status before writing:
   - planning branch/worktree
   - source `release/0.6.x` branch/worktree
   - book and writers-guide status if you inspect them
   - unrelated planning/book changes must be preserved
2. Update version surfaces identified by slice01:
   - root `Cargo.toml` workspace package version
   - root `Cargo.toml` local workspace dependency versions
   - `Cargo.lock` local Lykn package entries
   - `packages/browser/deno.json`
   - `packages/lang/deno.json`
   - `packages/testing/deno.json`
   - release-facing README/docs references if they are actual package release strings
3. Rebuild and verify:
   - `make build`
   - `./bin/lykn --version` must report `lykn 0.6.0`
4. Draft or update 0.6.0 release notes from slice01 `release-note-inputs.md`.
5. Check CI workflow maintenance:
   - update `actions/checkout@v4` to `actions/checkout@v5` if still compatible/current;
   - record any reason you leave a workflow unchanged.
6. Resolve the `make publish-dry-run` issue:
   - preferred: remove `--allow-dirty` from that dry-run evidence path if the resulting target is useful; or
   - explicitly route slice03 to direct `cargo publish -p <crate> --dry-run` and `cargo package -p <crate> --list` commands without using the target.
7. Run `make check` unless a concrete source issue requires a narrower failed-evidence report first.
8. Commit source changes on `release/0.6.x` with both required trailers:

   ```text
   Co-authored-by: Codex <noreply@openai.com>
   Co-authored-by: Billo AI <ai-engineering@billo.systems>
   ```

9. Update planning:
   - this slice ledger and closing report;
   - arc09 ledger/status;
   - Project02 status if current slice changes;
   - open `slice03-publish-dry-runs-and-package-audit/cc-prompt.md`.

## Out of scope

- Do not publish to JSR, npm, or crates.io.
- Do not create or push `0.6.0` or `book-v0.6.0` tags.
- Do not push branches/remotes.
- Do not pass publish safety-bypass flags silently.
- Do not edit unrelated Project07 planning changes or book `_to_delete/`.

## Expected final response

Report the source commit hash, version surfaces changed, release-note location,
validation results, any routed release chores, and the next slice prompt path.
Keep operator publication/tag approval separate from CC proposed-done.
