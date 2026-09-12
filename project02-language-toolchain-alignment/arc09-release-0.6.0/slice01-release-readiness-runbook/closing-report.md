# arc09 slice01 — Release Readiness Runbook Closing Report

Status: **CC proposed-done; CDC pending**
Date: 2026-09-12
Branch/worktree: planning branch in `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`
Source release worktree inspected: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`

## Scope completed

slice01 converted arc09 from terminal release intent into an executable 0.6.0 release runbook. The slice produced:

- [version-surface-inventory.md](artifacts/version-surface-inventory.md) — version-bearing files, generated metadata surfaces, CI/publishing command surfaces, current branch/tag state, and release actions.
- [release-note-inputs.md](artifacts/release-note-inputs.md) — curated user-visible release-note inputs from `0.5.2..release/0.6.x`, book-discovered fixes, and routed/deferred discoveries.
- [release-runbook.md](artifacts/release-runbook.md) — phase-by-phase release procedure for version bump, dry-runs, operator publication/tags, and post-publish verification.
- Updated [arc-plan.md](../arc-plan.md) and [ledger.md](../ledger.md) with a detailed five-slice release sequence.
- Opened [slice02-version-bump-release-notes-ci-chore](../slice02-version-bump-release-notes-ci-chore/slice-plan.md) with a dedicated ledger and prompt.
- Updated arc/project status surfaces under `status/`.

## Required guidance and source material read

- Repository governance in AGENTS.md for `release/0.6.x`.
- Book AGENTS.md and writers-guide AGENTS.md.
- Project02 `project-plan.md` and `ledger.md`.
- arc09 `arc-plan.md`, `ledger.md`, slice01 `slice-plan.md`, and slice01 `cc-prompt.md`.
- arc16 `closing-report.md` and `slice12-edition-close-and-release-gate/cdc-verification.md`.
- Release publishing docs in `docs/guides/12-deno/12-04-publishing.md` and `docs/guides/15-lykn-cli.md`.
- Source release surfaces on `release/0.6.x`, including Cargo manifests/lockfile, JS package manifests, Makefile, workflows, README, CLI publish/help behavior, and local Git branch/tag state.
- Book v0.6 edition tag references in `src/book-versions.md` and current book/writers-guide 0.6.0 references.

## Findings that affect the release plan

- Current source package versions are still `0.6.0-dev`; slice02 owns changing them to `0.6.0` and verifying the rebuilt CLI reports `lykn 0.6.0`.
- The source release branch has no upstream shown by `git branch -vv`; release pushes must name target remotes and `release/0.6.x` explicitly.
- Existing local language tags stop at `0.5.2`; the release tag to create after publication approval is `0.6.0`.
- The book repository currently has no local tags; the v0.6 edition page names `book-v0.6.0` as the release tag once the release is cut.
- Current `make publish-dry-run` uses `--allow-dirty`; it must be repaired or avoided as release evidence.
- Current `make push` is not a release-branch push recipe; the runbook uses explicit `git push <remote> release/0.6.x` and explicit tag pushes.
- Project07 discoveries visible in the planning backlog are not Project02 release blockers based on slice01 evidence. `D-2609-PERM` is a source release-note candidate only because the release line currently includes commit `d0bb981`; its Project07 CDC status remains separate.

## Verification performed

- Read-only inventory of source release version surfaces, publishing surfaces, CI workflows, book tag/version references, and backlog rows.
- Parsed updated status JSON files with `python3 -m json.tool`.
- Checked planning diff paths to confirm edits were limited to arc09/project02/status release-planning files.
- Checked final source, book, writers-guide, and planning statuses. Pre-existing unrelated Project07 planning changes and book `_to_delete/` remain unstaged and untouched.

## Closure boundary

This is a CC proposed-done close, not independent CDC verification and not operator acceptance. No source files, registry packages, release tags, remotes, or book tags were changed in this slice.
