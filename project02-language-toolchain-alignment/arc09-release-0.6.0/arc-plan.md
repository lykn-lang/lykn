# arc09 — Release 0.6.0

> **Status: Open — slice01 release-readiness-runbook active.** Was tracked as
> the M14/M15 release milestones. arc16 is closed/CDC-verified as of
> 2026-09-12, so release planning is now the current Project02 path.

## 1. Capability

Cut the 0.6.0 release: version bumps across the Rust workspace and JS packages,
release notes (continuing the `release-notes-0.5.x` series), and publish to JSR,
npm, and crates.io via the Lykn-only publish path (`lykn publish --jsr` /
`--npm`, `make publish-crates`), with the `lykn publish` dirty-check gate
(arc01) enforced.

## 2. Slice Breakdown

Plan late, plan deep. slice01 turns the release arc into an executable runbook
and may adjust the later slice sequence if the inventory finds a better cut.

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · release-readiness-runbook** | Inventory version surfaces, release-note inputs, dry-run gates, manual-publish boundaries, tag/post-publish verification, and any blockers; detail the rest of arc09 before implementation. | **Open** ([slice-plan](slice01-release-readiness-runbook/slice-plan.md), [ledger](slice01-release-readiness-runbook/ledger.md), [cc-prompt](slice01-release-readiness-runbook/cc-prompt.md)) |
| **slice02 · version-bump-and-release-notes** | Apply 0.6.0 version updates and release-note content according to the slice01 runbook. | **Future** |
| **slice03 · publish-dry-runs** | Run JSR/npm/crates dry-runs against the exact release tree, preserving dirty-tree gate evidence. | **Future** |
| **slice04 · publication-tag-and-postpublish-verification** | Operator publication, release tags, and post-publish artifact/install verification. | **Future** |

**Release-prep checklist items captured along the way:**
- **Green CI on `release/0.6.x`** (gated on arc07 slice01 — the 8-block doctest
  drift fix) + a clean `make check` / `make test-docs`.
- **CI maintenance:** bump `actions/checkout@v4 → v5` (and any Node-20 actions)
  in `.github/workflows/*` — Node-20 deprecation; non-blocking drive-by.

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
