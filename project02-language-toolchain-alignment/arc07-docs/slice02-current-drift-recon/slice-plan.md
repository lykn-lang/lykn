# Slice 02: current-drift-recon

> **Open set** (2026-08-08, CDC). Re-ground arc07 after arc05, arc06, and
> arc15 changed the shipped surface. This is a **recon-only** slice: classify
> current guide/SKILL drift and propose the next slice shape, without editing
> the guides or `assets/ai/SKILL.md`.

## 1. Goal

Produce a current, evidence-backed drift inventory for `docs/guides/` and
`assets/ai/SKILL.md` against the actual 0.6.0 branch, then recommend whether
arc07 needs one implementation slice, multiple implementation slices, or an
arc-close pass.

slice01 only fixed the red-CI doctest failures. The remaining seed material is
older than the linter, dependency ergonomics, artifact-home cleanup, and
surface-syntax trap work. Some seed items are already done; some are probably
stale; some likely remain real drift. This slice separates those classes before
we edit docs.

## 2. Scope

### In

- Read the arc07 seed docs:
  - [`../design/guide-drift-cleanup-plan.md`](../design/guide-drift-cleanup-plan.md)
  - [`../design/proposed-skill-and-guide-additions.md`](../design/proposed-skill-and-guide-additions.md)
- Read the current guide/SKILL surfaces:
  - `docs/guides/**/*.md`
  - `assets/ai/SKILL.md`
- Disposition every seeded item as `done`, `still-open`, `stale`, `superseded`,
  or `defer`, with file/line evidence and a short rationale.
- Run current drift sweeps for stale 0.6.0 claims, especially:
  - raw publish/build/test/run commands that bypass the `lykn` CLI;
  - `Biome` references;
  - old `dist/` / `target/lykn/{build,dist}` / source-tree output claims;
  - top-level `src/` package-layout examples;
  - `?` suffix and `if` expression-position claims that may have been
    superseded by DD-49/DD-50 work;
  - arc15 surface-syntax trap examples taught as valid rather than wrong.
- For any candidate drift that asserts compiler/CLI behaviour, verify against
  the actual branch with `./bin/lykn` or an existing test/gate; do not classify
  behaviour from prose alone.
- Write a closing report whose main payload is the drift inventory and a
  proposed next-slice breakdown.

### Out

- Do not edit `docs/guides/` or `assets/ai/SKILL.md` in this slice, except to
  fix a typo introduced by this slice's own planning text.
- Do not close arc07.
- Do not rewrite the old seed docs; preserve them as provenance and classify
  their rows from the current branch.
- Do not plan the Lykn Book work here. arc16 consumes the result of arc07, but
  book planning stays in arc16.

## 3. Verification Approach

The recon must be reproducible from commands and file reads:

- `rg` sweeps over `docs/guides/` and `assets/ai/SKILL.md` for known drift
  fingerprints.
- Targeted reads around every hit classified as open, stale, or surprising.
- `./bin/lykn check`, `./bin/lykn compile`, `./bin/lykn lint`, or existing
  tests/gates for behaviour claims that can be executed cheaply.
- `make test-docs` to confirm the docs still pass after the recon branch's
  close artifacts land.
- `make check-cited-paths` because the closing report will cite tracked paths.

## 4. Exit Criteria

1. Every item in both arc07 seed docs has a current disposition and evidence.
2. Current-guide/SKILL sweeps have identified and classified all obvious 0.6.0
   drift fingerprints.
3. Behavioural drift candidates are checked against the branch, not inferred.
4. The closing report recommends the next arc07 slice shape: close, one
   implementation slice, or split implementation slices, with rationale.
5. No guide/SKILL content changes are made by this recon slice.
6. `make test-docs` and `make check-cited-paths` are green at close.
