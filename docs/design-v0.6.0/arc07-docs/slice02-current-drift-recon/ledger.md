# Slice 02: current-drift-recon — Ledger

Recon-only guide/SKILL drift inventory for arc07. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. No guide/SKILL edits.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| R-1 | Current substrate loaded: arc07 plan, both seed docs, current guides, current `assets/ai/SKILL.md`, and the recent arc05/arc06/arc15 status that can obsolete seed claims | closing report lists exact files read and branch/HEAD used | serious | slice-doc | open | | prevents May-era seed assumptions from driving August edits |
| R-2 | Every item in `guide-drift-cleanup-plan.md` is dispositioned as `done`, `still-open`, `stale`, `superseded`, or `defer` with file/line evidence | closing report contains a complete disposition table covering all numbered sections and per-thread items | serious | seed doc | open | | missing seed rows are silent drops |
| R-3 | Every item in `proposed-skill-and-guide-additions.md` is dispositioned with file/line evidence and, where needed, behavioural proof | closing report contains a complete disposition table for items 1-7 | serious | seed doc | open | | likely stale items include `?` suffix and `if` expression-position claims; verify them |
| R-4 | Current drift sweeps run over `docs/guides/` and `assets/ai/SKILL.md`, including raw CLI bypasses, Biome, output-path drift, package-layout drift, DD-49/DD-50 claims, and arc15 trap teaching | closing report includes commands, hit counts, and classification summary | serious | arc-plan | open | | use `rg`; do not rely on memory |
| R-5 | Behavioural claims are validated against the actual 0.6.0 branch or explicitly marked unverified with a re-entry condition | for every `still-open` behavioural candidate, closing report includes `./bin/lykn`/test evidence or a named blocked reason | correctness | ledger | open | | examples: `?` suffix mapping, `if` expression-position, build/publish path claims |
| R-6 | The recon output proposes the next arc07 shape | closing report includes "Recommended next slice breakdown" with close/one-slice/split decision and rationale | correctness | arc-plan | open | | should update arc-plan before the next implementation slice is scoped |
| R-7 | Recon-only boundary preserved | `git diff --name-only` excludes `docs/guides/**` and `assets/ai/SKILL.md` except for accidental typo repair explicitly justified | correctness | slice-doc | open | | keeps this slice from smuggling implementation edits |
| R-8 | Docs/path gates green at close | `make test-docs` and `make check-cited-paths` pass | serious | process note | open | | `make check` optional unless recon touches executable docs beyond close artifacts |

## What Worked

_(At slice close.)_

## Closure

_(At slice close.)_
