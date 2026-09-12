# arc09 — Release 0.6.0

> **Status: Open — next Project02 arc after arc16 close.** Planned at capability
> depth only. Was tracked as the M14/M15 release milestones. arc16 closed from
> CC's side on 2026-09-12; CDC verification of that close remains pending, but
> release planning can now prepare the arc09 slice breakdown and gates.

## 1. Capability

Cut the 0.6.0 release: version bumps across the Rust workspace and JS packages,
release notes (continuing the `release-notes-0.5.x` series), and publish to JSR,
npm, and crates.io via the Lykn-only publish path (`lykn publish --jsr` /
`--npm`, `make publish-crates`), with the `lykn publish` dirty-check gate
(arc01) enforced.

## 2. Slice breakdown

_Not yet planned._ Likely slices: version-bump + release-notes authoring →
publish dry-runs (JSR/npm/crates) → the actual publish + tag. Duncan handles
manual publishes; this arc scopes the preparation and verification.

**Release-prep checklist items captured along the way:**
- **Green CI on `release/0.6.x`** (gated on arc07 slice01 — the 8-block doctest
  drift fix) + a clean `make check` / `make test-docs`.
- **CI maintenance:** bump `actions/checkout@v4 → v5` (and any Node-20 actions)
  in `.github/workflows/*` — Node-20 deprecation; non-blocking drive-by.

## 3. Dependencies

Gated on: arc03 closed (✓ landed), arc04 closed (tool built), arc08
(template-i18n ✓ landed), the 0.6.0-committed arcs (05 linter, 06 dep-ergonomics)
reaching their intended 0.6.0 state, **arc07 (docs)**, and **arc16 (book 0.6.0
edition)**. Those gates are closed from CC's side as of 2026-09-12; arc16 CDC
verification remains pending. Relies on arc01's publish gate. This arc's close is the **project gate**
(go / adjust / kill against the 0.6.0 DoD — project-plan §4).

## 4. Arc ledger

See [ledger.md](ledger.md). Historical rows were extracted without changing their dispositions during project06-planning-reorg. The detailed release-cut slice breakdown is the next planning task.

## 5. Version History

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
