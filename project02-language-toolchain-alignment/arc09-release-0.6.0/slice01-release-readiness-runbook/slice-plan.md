# arc09 slice01 - Release Readiness Runbook

> **Status:** Open.

## Capability

Prepare the 0.6.0 release cut as a falsifiable runbook before any publication
or tag work begins. This slice inventories the version surfaces, release-note
inputs, publish dry-run gates, manual-publish boundaries, and post-publish
verification requirements that later arc09 slices will execute.

## Scope

- Re-read repo instructions, Project02 plan/ledger, arc09 plan/ledger, arc16
  close/CDC evidence, and the release/source worktree instructions.
- Inspect the current release branch version surfaces across Rust crates, JS
  package/project metadata, CLI output if applicable, docs/release notes, and
  book edition references.
- Build a release runbook that separates preparation, dry-runs, operator manual
  publication, tag creation, and post-publish verification.
- Draft or update arc09's detailed slice breakdown and arc ledger from the
  inventory.
- Identify release blockers, missing release-note inputs, stale CI/tooling
  chores, or operator approval gates; route them explicitly.

## Out Of Scope

- Do not publish to JSR, npm, crates.io, or GitHub.
- Do not create release tags.
- Do not bump versions or edit release notes unless the inventory proves they
  are only planning/doc corrections. Prefer routing actual version changes to
  the next slice.
- Do not weaken publish safety gates or add bypass flags.

## Verification

- Planning diff check.
- Status JSON parse checks for touched status files.
- Source/book/writers-guide final status checks.
- If the slice makes source changes, run the source gates named in the release
  worktree instructions.

## Close

Close only after every ledger row is dispositioned and the next arc09 slice has
a clear `cc-prompt.md`, unless a blocker requires operator input or a different
slice order.
