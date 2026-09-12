# arc09 — Release 0.6.0

> **Status: Open — slice02 version-bump/release-notes/CI chore active.**
> arc16 is closed/CDC-verified as of 2026-09-12. slice01 is closed/CDC-verified:
> it converted the release arc into an executable runbook and found no release
> blocker, but it did route two command-surface hazards: current
> `make publish-dry-run` uses `--allow-dirty`, and current `make push` is not a
> release-branch push recipe.

## 1. Capability

Cut the 0.6.0 release: version bumps across the Rust workspace and JS packages,
release notes (continuing the `release-notes-0.5.x` series), and publish to JSR,
npm, and crates.io via the Lykn-only publish path (`lykn publish --jsr` /
`--npm`, `make publish-crates`), with the `lykn publish` dirty-check gate
(arc01) enforced.

## 2. Slice Breakdown

slice01 produced the release runbook and refined the implementation sequence.
Future slices must keep CC-preparable work distinct from operator-owned real
publication, release tags, and pushes.

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · release-readiness-runbook** | Inventory version surfaces, release-note inputs, dry-run gates, manual-publish boundaries, tag/post-publish verification, and blockers; write the executable release runbook. | **Closed / CDC-verified** ([slice-plan](slice01-release-readiness-runbook/slice-plan.md), [ledger](slice01-release-readiness-runbook/ledger.md), [closing-report](slice01-release-readiness-runbook/closing-report.md), [cdc-verification](slice01-release-readiness-runbook/cdc-verification.md), [runbook](slice01-release-readiness-runbook/artifacts/release-runbook.md)) |
| **slice02 · version-bump-release-notes-ci-chore** | Update version surfaces from `0.6.0-dev` to `0.6.0`, regenerate lock/version evidence, write 0.6.0 release notes, apply low-risk CI checkout maintenance if still current, and either repair or explicitly route no-bypass replacement for `make publish-dry-run`. | **Open** ([slice-plan](slice02-version-bump-release-notes-ci-chore/slice-plan.md), [ledger](slice02-version-bump-release-notes-ci-chore/ledger.md), [cc-prompt](slice02-version-bump-release-notes-ci-chore/cc-prompt.md)) |
| **slice03 · publish-dry-runs-and-package-audit** | Run `make check`, dist/package audits, JSR/npm dry-runs, and crates.io dry-runs against the exact release tree without weakening dirty-tree gates; capture receipts. | **Future** |
| **slice04 · operator-publication-and-tags** | Prepare the final approval packet; after explicit operator authorization, publish JSR/npm/crates artifacts, tag `0.6.0`, push release branch/tag explicitly to intended remotes, and handle the book `book-v0.6.0` tag/publication boundary. | **Future** |
| **slice05 · postpublish-verification-and-project-close** | Verify published registry artifacts and explicit temporary installs, confirm remote tags/branch visibility, reconcile book release artifacts, close Project02 P-8/P-12, and produce final project closeout evidence. | **Future** |

**Release-prep checklist items captured along the way:**
- **Green CI on `release/0.6.x`** and a clean `make check` before publication.
- **CI maintenance:** bump `actions/checkout@v4 → v5` where compatible. Treat as
  release-prep chore, not a blocker unless CI proves otherwise.
- **No-bypass dry-runs:** do not rely on the current `make publish-dry-run`
  target while it passes `--allow-dirty`.
- **Explicit release pushes:** do not rely on the current `make push` recipe for
  release-branch push evidence; name `release/0.6.x` and `0.6.0` explicitly.

## 3. Dependencies

Gated on: arc03 closed (✓ landed), arc04 closed (tool built), arc08
(template-i18n ✓ landed), the 0.6.0-committed arcs (05 linter, 06 dep-ergonomics)
reaching their intended 0.6.0 state, **arc07 (docs)**, and **arc16 (book 0.6.0
edition)**. Those gates are closed/CDC-verified as of 2026-09-12. Relies on
arc01's publish gate. This arc's close is the **project gate** (go / adjust /
kill against the 0.6.0 DoD — project-plan §4).

## 4. Arc Ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing
their dispositions during project06-planning-reorg. slice01 owns the detailed
release runbook and can refine the future slice sequence before implementation.

## 5. Version History

### v1.5 - 2026-09-12 (slice01 CDC verified)

CDC reproduced slice01's release-readiness claims against the live source,
planning, book, and writers-guide worktrees. Version surfaces remain
`0.6.0-dev`, CLI reports `lykn 0.6.0-dev`, language tags stop at `0.5.2`, the
book tag remains uncut, `make publish-dry-run` still passes `--allow-dirty`,
and `make push` is not a release-branch recipe. slice01 is closed/CDC-verified;
slice02 remains active.

### v1.4 - 2026-09-12 (slice01 CC proposed-done; slice02 opened)

slice01 inventoried version surfaces, release-note inputs, publishing gates,
manual operator boundaries, post-publish checks, and release chores. Opened
slice02 for version bump, release notes, CI checkout maintenance, and the
`make publish-dry-run` no-bypass decision.

### v1.3 - 2026-09-12 (slice01 opened after arc16 CDC verification)

arc16 is closed/CDC-verified. Opened slice01 `release-readiness-runbook` to
inventory version surfaces, release notes, publish dry-runs, manual-publish
boundaries, tags, and post-publish verification before release implementation
begins.

### v1.2 — 2026-06-29 (renumbered arc08 → arc09)
Renumbered again when **arc08-template-i18n** (DD-55, un-stranded from
`feature/template-update`) was inserted ahead of release. Added arc08 to the
gating dependencies (now landed). Release stays terminal.

### v1.1 — 2026-06-28 (renumbered arc07 → arc08)
Renumbered when **arc07-docs** was inserted ahead of release to preserve
dependency order (docs alignment lands before the release cut). Added arc07
(docs) to the gating dependencies.

### v1.0 — 2026-06-28 (reconstructed)
Release arc seeded; gated on the open/in-flight arcs.
