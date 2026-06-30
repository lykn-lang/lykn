# arc09 — Release 0.6.0

> **Status: Future — gated on all preceding arcs.** Planned at capability depth
> only. Was tracked as the M14/M15 release milestones. (Renumbered arc07→08→09 as
> arc07-docs then arc08-template-i18n were inserted ahead of release — see
> Version History.)

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

## 3. Dependencies

Gated on: arc03 closed (✓ landed), arc04 closed (tool built), arc08
(template-i18n ✓ landed), the 0.6.0-committed arcs (05 linter, 06 dep-ergonomics)
reaching their intended 0.6.0 state, and **arc07 (docs) — release ships
release-ready docs**.
Relies on arc01's publish gate. This arc's close is the **project gate**
(go / adjust / kill against the 0.6.0 DoD — project-plan §4).

## 4. Arc ledger

_Opens when the arc-plan is detailed._ Class-(b) composition row will be a
publish dry-run reproduced across all three registries, then the published
artifacts verified installable.

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
