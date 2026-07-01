# arc07 — Documentation & Guide Alignment

> **Status: Open — near-term (red CI).** Created 2026-06-28 to give the 0.6.0-era
> docs/SKILL hygiene work a home. **2026-06-30: the first CI run on `release/0.6.x`
> went red on 8 guide doctest blocks** (DD-50.6 return-type drift) — see
> slice01 below. That makes arc07's first slice **the path to green CI**, an
> argument to pull this arc forward ahead of arc05/06. Otherwise planned at
> capability depth per *plan late, plan deep*.

## 1. Capability

Keep `docs/guides/` and the `assets/ai/` SKILL files aligned with the 0.6.0
language and toolchain — eliminate guide drift (content that no longer matches
what the compiler/CLI actually do) and land the discoverability-gap additions
that surfaced when the first real downstream project (mycelium) was bootstrapped.
The aim is that a reader following the guides/SKILL gets advice that matches
shipped 0.6.0 behaviour, so docs are release-ready before arc09 cuts 0.6.0.

**Relationship to neighbouring arcs.** Distinct from arc03's W-4d doctest-fence
work (that was compiler-coherence: making doctests compile correctly). This arc
is prose/guidance correctness. It also feeds arc05 (the linter's rule corpus
draws on `docs/guides/09-anti-patterns.md` and the surface-forms reference), so
clearing guide drift first makes the linter's seed corpus trustworthy.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · doctest-drift-fix** (CI green) | Fix the 8 guide doctest blocks failing DD-50.6's return-type check: 2 `try` cases (explicit return / drop `:returns`) + the `fn`-closure cases (value-producing return — **bind-then-return `fn`** to keep typed params, or untyped `=>`; docs-only, settled). Takes `release/0.6.x` CI green. No compiler change. | **Open — scoped** (slice-doc + ledger + cc-prompt ready for CC) |

The 8 blocks: `03-error-handling.md` (`load-config`, `valid-json?` — `try`),
`06-functions-closures.md` (`create-logger`, `create-filter` — `fn`),
`07-async-concurrency.md` (`debounce` — `fn`), `08-performance.md` (`memoize`,
`memoize-lru` — `fn`), `11-documentation.md` (`debounce` — `fn`). Verify with
`make test-docs` (the surface that catches this — see the process note below).

_Later slices (still capability-depth):_ the broader **guide-drift audit**
(`guide-drift-cleanup-plan` seed), **SKILL/guide additions**
(`proposed-skill-and-guide-additions` seed), and a possible **guide↔SKILL
consistency** pass. Size each when the arc is active. 0.5.x-era guide-drift
sessions (`workbench/old/`) are out of 0.6.0 scope.

> **Process note (applies arc-wide and beyond):** the standing slice "green" bar
> (`lykn test` + `deno test test/`) **does not run `make test-docs`**, which is
> why this drift sat latent until CI caught it. Slice ledgers touching guides/docs
> (and arc-composition checks) must include `make test-docs` (or `make check`) in
> their verification. Recorded as a project-level process fix.

## 3. Dependencies

Consumes: the shipped behaviour of arc01–arc06 (docs describe what those landed).
Best sequenced **after** the language/toolchain arcs stabilize (so docs aren't
chasing a moving target) and **before** arc09 (release ships release-ready docs).
Feeds arc05 (linter rule corpus).

## 4. Arc ledger

_Opens when the arc-plan is detailed._ Class-(b) composition row will be a
drift-audit demonstration: a defined sample of guide claims checked against
actual compiler/CLI behaviour with zero unreconciled drift, reproduced at arc
scale.

## 5. Version History

### v1.1 — 2026-06-30 (slice01 added — red-CI doctest drift)
The first CI run on `release/0.6.x` (the commit enabling release/* CI) went red on
8 guide doctest blocks failing DD-50.6's return-type check — accumulated guide
drift, newly exposed (compiler correct; not an arc04 regression). Added **slice01
· doctest-drift-fix** (the path to green CI). Design call settled (CC report):
**docs-only — closure returns use `=>`**, not a `fn`/`lambda` value-position tweak.
Recorded the process gap (slice green-bar omits `make test-docs`). Arc flagged
near-term.

### v1.0 — 2026-06-28 (created)
Arc created to home the 0.6.0 docs/SKILL hygiene backlog (`guide-drift-cleanup-plan`,
`proposed-skill-and-guide-additions`), previously un-arc'd in `workbench/`.
Release renumbered arc07→arc08 to keep dependency order (docs before release).
