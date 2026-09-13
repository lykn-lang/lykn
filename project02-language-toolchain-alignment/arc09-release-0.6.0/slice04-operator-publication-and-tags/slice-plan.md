# arc09 slice04 — Operator Publication and Tags

> **Status: Open.** slice03 produced dry-run/package evidence from source commit
> `50608c443c452107b138cc30deda4a09ab5c7642`. This slice is the manual
> publication, release tag, branch push, and book-tag boundary.

## 1. Objective

Prepare a concrete approval packet for the operator, then perform publication
and tagging only after explicit operator authorization.

## 2. Inputs

- [slice03 closing report](../slice03-publish-dry-runs-and-package-audit/closing-report.md)
- [slice03 dry-run receipt](../slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md)
- Source release commit `50608c443c452107b138cc30deda4a09ab5c7642`
- Source release notes: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/release-notes-0.6.0.md`

## 3. In scope

- Reconfirm source, planning, book, and writers-guide status before publication.
- Present the exact commands and receipts for operator approval.
- After explicit operator authorization, publish JSR and npm packages via `./bin/lykn publish`.
- Publish crates in dependency order: `lykn-lang`, `lykn-cli`, `lykn`.
- Capture per-registry and per-crate publication transcripts.
- Create and verify the source `0.6.0` tag only after successful publication.
- Push the release branch and tag explicitly to intended remotes after operator authorization.
- Handle the book `book-v0.6.0` tag/publication boundary only if explicitly authorized and current book status permits it.

## 4. Out of scope

- Silent publication without explicit operator authorization.
- Passing `--allow-dirty`, `--force`, `--no-verify`, or other safety-bypass flags as release evidence.
- Changing release contents after approval except to resolve an explicitly surfaced blocker.
- Post-publish temporary-install verification; that belongs to slice05.

## 5. Verification

- Publication transcripts for JSR, npm, and crates.io.
- Tag evidence for source `0.6.0` and, if authorized, book `book-v0.6.0`.
- Explicit remote push evidence naming branch and tag.
- Final status proving no unrelated work was staged or changed.

## 6. Completion

This slice closes when authorized publication/tag/push actions are complete and
all publication transcripts are recorded, or when the operator declines/defers
publication with the exact boundary recorded.
