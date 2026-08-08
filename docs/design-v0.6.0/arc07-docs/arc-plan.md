# arc07 — Documentation & Guide Alignment

> **Status: ACTIVE — slice01 closed; slice02 current-drift recon opened.**
> Created 2026-06-28 for the 0.6.0-era docs/SKILL hygiene work. The red-CI finding
> (2026-06-30: 8 guide doctest blocks, DD-50.6 drift) is **fixed and landed** in
> **slice01** (`0731048`; guide doctests 472/0) — the release-branch doctests are
> green (CI re-run pending). The rest of arc07 (guide-drift audit, SKILL additions,
> guide↔SKILL consistency) is now being re-grounded after arc05, arc06, and
> arc15 changed the shipped 0.6.0 surface.

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
| **slice01 · doctest-drift-fix** (CI green) | Fix the 8 guide doctest blocks failing DD-50.6's return-type check: 2 `try` cases (explicit return / drop `:returns`) + the `fn`-closure cases (bind-then-return to keep typed params) + a preventive style note. | **Closed** (`0731048`; docs-only; guide doctests 464/8→472/0; `make check` green; CI re-run pending) |
| **slice02 · current-drift-recon** | Re-ground the old guide/SKILL seed lists against current `release/0.6.x`; disposition each seed item as done/stale/open/defer; run current drift sweeps; behaviour-check live compiler/CLI claims; recommend the next slice breakdown. Recon-only: no guide/SKILL edits. | **Open** ([slice-doc](./slice02-current-drift-recon/slice-doc.md), [ledger](./slice02-current-drift-recon/ledger.md), [cc-prompt](./slice02-current-drift-recon/cc-prompt.md)) |

The 8 blocks: `03-error-handling.md` (`load-config`, `valid-json?` — `try`),
`06-functions-closures.md` (`create-logger`, `create-filter` — `fn`),
`07-async-concurrency.md` (`debounce` — `fn`), `08-performance.md` (`memoize`,
`memoize-lru` — `fn`), `11-documentation.md` (`debounce` — `fn`). Verify with
`make test-docs` (the surface that catches this — see the process note below).

_Later slices (pending slice02):_ slice02 decides whether the remaining work is
one implementation slice, split implementation slices, or an arc-close pass.
The known seed surfaces are the broader **guide-drift audit**
(`guide-drift-cleanup-plan` seed), **SKILL/guide additions**
(`proposed-skill-and-guide-additions` seed), and possible **guide↔SKILL
consistency** pass. 0.5.x-era guide-drift sessions (`workbench/old/`) are out of
0.6.0 scope.

> **Process note (applies arc-wide and beyond):** the standing slice "green" bar
> (`lykn test` + `deno test test/`) **does not run `make test-docs`**, which is
> why this drift sat latent until CI caught it. Slice ledgers touching guides/docs
> (and arc-composition checks) must include `make test-docs` (or `make check`) in
> their verification. Recorded as a project-level process fix.

## 3. Dependencies

Consumes: the shipped behaviour of arc01–arc06 and arc15 (docs describe what
those landed).
Best sequenced **after** the language/toolchain arcs stabilize (so docs aren't
chasing a moving target) and **before** arc09 (release ships release-ready docs).
Feeds arc16 (the book should describe the reconciled guide truth) and arc09.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 doctest-drift fix closed | ptr: slice01 cdc-verification | correctness | arc-plan | **done** | `0731048` + [`slice01-doctest-drift-fix/cdc-verification.md`](./slice01-doctest-drift-fix/cdc-verification.md) | red-CI item closed |
| A-2 | slice02 current-drift recon closed | ptr: slice02 closing-report + cdc-verification | serious | arc-plan v1.3 | open | | re-ground before editing |
| A-3 | All current guide/SKILL drift is either fixed in arc07 or explicitly routed | arc close: compare slice02 inventory with subsequent implementation slices and deferrals | serious | arc capability | open | | anti-silent-drop row |
| A-4 | Guide/SKILL claims match shipped 0.6.0 behaviour for sampled executable claims | arc close: reproduce selected `./bin/lykn` checks/compiles/lints and `make test-docs` | serious | P-13 | open | | class-(b) composition row; reproduce at arc scale |
| A-5 | `make test-docs` and `make check-cited-paths` are green at arc close | arc close gate | serious | process note + P-21 | open | | docs drift and cited-path drift stay visible |

## 5. Version History

### v1.3 — 2026-08-08 (slice02 current-drift recon opened)

After arc15 closed, arc07 became the next release gate. The seed docs are now
old enough that implementation would be risky without a freshness pass:
publishing/no-`src` SKILL guidance is already present, `13-biome/` is gone, and
DD-49/DD-50/arc15 changed several claims the May seed material names. Opened
slice02 as a recon-only slice to disposition the old seed rows, sweep the current
guides/SKILL, behaviour-check live claims, and recommend the actual next slice
breakdown.

The arc ledger is now explicit: slice01 is done, slice02 is open, and the
remaining composition rows check that all guide/SKILL drift is fixed or routed
before arc07 can close.

### v1.2 — 2026-06-30 (slice01 closed — CI-green)
slice01 landed (`0731048`): the 8 drifted blocks fixed docs-only — `try` cases via
explicit `(return …)` + dropped `:returns`; `fn` closures via **bind-then-return**
(kept typed params); preventive note added. Guide doctests **464/8→472/0**,
`make check` green. Red-CI item resolved (CI re-run pending). arc07 stays open for
the broader guide-drift work.

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
