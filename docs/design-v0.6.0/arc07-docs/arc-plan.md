# arc07 — Documentation & Guide Alignment

> **Status: Open — seeded, not slice-planned.** Created 2026-06-28 to give the
> 0.6.0-era docs/SKILL hygiene work a home (it was un-arc'd backlog in
> `workbench/`). Planned at capability depth per *plan late, plan deep*. Seed
> material in `design/`.

## 1. Capability

Keep `docs/guides/` and the `assets/ai/` SKILL files aligned with the 0.6.0
language and toolchain — eliminate guide drift (content that no longer matches
what the compiler/CLI actually do) and land the discoverability-gap additions
that surfaced when the first real downstream project (mycelium) was bootstrapped.
The aim is that a reader following the guides/SKILL gets advice that matches
shipped 0.6.0 behaviour, so docs are release-ready before arc08 cuts 0.6.0.

**Relationship to neighbouring arcs.** Distinct from arc03's W-4d doctest-fence
work (that was compiler-coherence: making doctests compile correctly). This arc
is prose/guidance correctness. It also feeds arc05 (the linter's rule corpus
draws on `docs/guides/09-anti-patterns.md` and the surface-forms reference), so
clearing guide drift first makes the linter's seed corpus trustworthy.

## 2. Slice breakdown

_Not yet planned._ Likely slices when active, seeded by `design/`:
- a **guide-drift audit + cleanup** pass over `docs/guides/` (the
  `guide-drift-cleanup-plan` seed), sized per the drift inventory;
- a **SKILL/guide additions** slice landing the discoverability gaps
  (`proposed-skill-and-guide-additions` seed);
- possibly a **guide↔SKILL consistency** pass (align the two surfaces).

Size each per the sizing judgment (PROJECT-MANAGEMENT.md Part I) when the arc
becomes active. Note: 0.5.x-era guide-drift sessions (the `CC-prompt-guide-drift-*`
files) live in `workbench/old/` and are out of 0.6.0 scope.

## 3. Dependencies

Consumes: the shipped behaviour of arc01–arc06 (docs describe what those landed).
Best sequenced **after** the language/toolchain arcs stabilize (so docs aren't
chasing a moving target) and **before** arc08 (release ships release-ready docs).
Feeds arc05 (linter rule corpus).

## 4. Arc ledger

_Opens when the arc-plan is detailed._ Class-(b) composition row will be a
drift-audit demonstration: a defined sample of guide claims checked against
actual compiler/CLI behaviour with zero unreconciled drift, reproduced at arc
scale.

## 5. Version History

### v1.0 — 2026-06-28 (created)
Arc created to home the 0.6.0 docs/SKILL hygiene backlog (`guide-drift-cleanup-plan`,
`proposed-skill-and-guide-additions`), previously un-arc'd in `workbench/`.
Release renumbered arc07→arc08 to keep dependency order (docs before release).
