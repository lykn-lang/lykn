# arc09 — Release 0.6.0

> **Status: Open — release-candidate UAT before publication.**
> arc16, slice01, slice02, and slice03 are closed/CDC-verified. slice04 closed
> by operator deferral before publication: the 0.6.0 release candidate at
> source commit `50608c4` will be exercised in other projects before the full
> 0.6.0 delivery. Real publication, tags, branch pushes, and book release tags
> remain operator-owned boundaries.

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
| **slice02 · version-bump-release-notes-ci-chore** | Update version surfaces from `0.6.0-dev` to `0.6.0`, regenerate lock/version evidence, write 0.6.0 release notes, apply low-risk CI checkout maintenance if still current, and either repair or explicitly route no-bypass replacement for `make publish-dry-run`. | **Closed / CDC-verified** ([slice-plan](slice02-version-bump-release-notes-ci-chore/slice-plan.md), [ledger](slice02-version-bump-release-notes-ci-chore/ledger.md), [closing-report](slice02-version-bump-release-notes-ci-chore/closing-report.md), [cdc-verification](slice02-version-bump-release-notes-ci-chore/cdc-verification.md)) |
| **slice03 · publish-dry-runs-and-package-audit** | Run `make check`, dist/package audits, JSR/npm dry-runs, and crates.io dry-runs against the exact release tree without weakening dirty-tree gates; capture receipts. | **Closed / CDC-verified, qualified crates sequencing** ([slice-plan](slice03-publish-dry-runs-and-package-audit/slice-plan.md), [ledger](slice03-publish-dry-runs-and-package-audit/ledger.md), [closing-report](slice03-publish-dry-runs-and-package-audit/closing-report.md), [cdc-verification](slice03-publish-dry-runs-and-package-audit/cdc-verification.md), [receipt](slice03-publish-dry-runs-and-package-audit/artifacts/dry-run-and-package-audit-receipt.md)) |
| **slice04 · operator-publication-and-tags** | Prepare the final approval packet; after explicit operator authorization, publish JSR/npm/crates artifacts, tag `0.6.0`, push release branch/tag explicitly to intended remotes, and handle the book `book-v0.6.0` tag/publication boundary. | **Closed / operator-deferred before publication** ([slice-plan](slice04-operator-publication-and-tags/slice-plan.md), [ledger](slice04-operator-publication-and-tags/ledger.md), [closing-report](slice04-operator-publication-and-tags/closing-report.md)) |
| **slice05 · release-candidate-uat-feedback** | Exercise the 0.6.0 release candidate in downstream/projects-that-must-ship, record feedback, and decide whether to iterate or resume publication. | **Open** ([slice-plan](slice05-release-candidate-uat-feedback/slice-plan.md), [ledger](slice05-release-candidate-uat-feedback/ledger.md), [cc-prompt](slice05-release-candidate-uat-feedback/cc-prompt.md)) |
| **slice06 · operator-publication-and-tags-after-uat** | After UAT is green and explicit operator authorization is given, publish JSR/npm/crates artifacts, tag `0.6.0`, push release branch/tag explicitly, and handle the book `book-v0.6.0` boundary. | **Future** |
| **slice07 · postpublish-verification-and-project-close** | Verify published registry artifacts and explicit temporary installs, confirm remote tags/branch visibility, reconcile book release artifacts, close Project02 P-8/P-12, and produce final project closeout evidence. | **Future** |

**Release-prep checklist items captured along the way:**
- **Green CI on `release/0.6.x`** and a clean `make check` before publication.
- **CI maintenance:** bump `actions/checkout@v4 → v5` where compatible. Treat as
  release-prep chore, not a blocker unless CI proves otherwise.
- **No-bypass dry-runs:** slice02 repaired `make publish-dry-run` to call
  `cargo publish --dry-run` without `--allow-dirty`; slice03 proved the helper
  and recorded the Cargo registry-sequencing qualification.
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

### v1.10 - 2026-09-12 (slice04 operator-deferred; slice05 opened)

The operator declined the concrete publication/tag/push packet for now and
directed UAT in other projects before full 0.6.0 delivery. slice04 is closed as
operator-deferred before publication. No registry publication, source tag,
branch push, tag push, book tag, or book publication occurred. slice05 is opened
to record release-candidate UAT feedback against source commit `50608c4`;
publication resumes only after UAT feedback is accepted or routed.

### v1.9 - 2026-09-12 (slice03 CDC verified)

CDC reproduced slice03's package-audit and dry-run claims against source commit
`50608c4`: `make check` passed outside the sandbox home-log restriction, dist
metadata reports `0.6.0`, JSR and npm dry-runs passed, `cargo package -p
lykn-lang --list` includes the embedded language payload, and `cargo publish -p
lykn-lang --dry-run` verified the crate. The `lykn-cli` and `lykn` crates remain
qualified by normal crates.io dependency ordering until `lykn-lang 0.6.0` and
then `lykn-cli 0.6.0` are actually published. slice04 remains open for
operator-approved publication and tags.

### v1.8 - 2026-09-12 (slice03 CC proposed-done; slice04 opened)

slice03 found a real `lykn-lang` crate packaging blocker during crates dry-run,
repaired it in source commit `50608c4`, and reran release evidence from that
committed tree. `make check`, dist audit, JSR dry-run, npm dry-run, and
`cargo publish -p lykn-lang --dry-run` passed. `make publish-dry-run` and direct
`cargo publish` for `lykn-cli`/`lykn` remain qualified by normal crates.io
dependency sequencing until `lykn-lang 0.6.0` and then `lykn-cli 0.6.0` are
published. No publish, tag, or push was performed. slice04 is opened for
operator-approved publication and tags.

### v1.7 - 2026-09-12 (slice02 CDC verified)

CDC independently reproduced slice02's release-prep evidence: source commit
`65ff40f` carries the 0.6.0 version surfaces, draft release notes, checkout v5
maintenance, and repaired no-bypass `make publish-dry-run`; rebuilt CLI reports
`lykn 0.6.0`; generated dist metadata reports `0.6.0`; `make check` passed
outside the sandbox home-log restriction; no publication, release tag, branch
push, or book tag was performed. slice03 remains active.

### v1.6 - 2026-09-12 (slice02 CC proposed-done; slice03 opened)

slice02 committed source `65ff40f` with all 0.6.0 version surfaces,
draft release notes, checkout v5 workflow maintenance, and a repaired crates
dry-run target that no longer passes `--allow-dirty`. Opened slice03 to run
`make check`, dist/package audits, JSR/npm dry-runs, and crates dry-runs from
the exact release tree.

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
