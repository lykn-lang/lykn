# Slice 02: current-drift-recon — Ledger

Recon-only guide/SKILL drift inventory for arc07. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. No guide/SKILL edits.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| R-1 | Current substrate loaded: arc07 plan, both seed docs, current guides, current `assets/ai/SKILL.md`, and the recent arc05/arc06/arc15 status that can obsolete seed claims | closing report lists exact files read and branch/HEAD used | serious | slice-doc | done | `closing-report.md` Inputs Read records branch `release/0.6.x` at `17117b3`, seed docs, guide/SKILL surface, and code evidence files. | prevents May-era seed assumptions from driving August edits |
| R-2 | Every item in `guide-drift-cleanup-plan.md` is dispositioned as `done`, `still-open`, `stale`, `superseded`, or `defer` with file/line evidence | closing report contains a complete disposition table covering all numbered sections and per-thread items | serious | seed doc | done | `closing-report.md` "Seed Disposition: Guide-Drift Cleanup Plan" covers steps 1-8 and all per-thread rows through Thread 4 with line evidence. | missing seed rows are silent drops |
| R-3 | Every item in `proposed-skill-and-guide-additions.md` is dispositioned with file/line evidence and, where needed, behavioural proof | closing report contains a complete disposition table for items 1-7 | serious | seed doc | done | `closing-report.md` "Seed Disposition: Proposed Skill and Guide Additions" covers items 1-7; behavior probes validate `valid?`, `if` expression, no-else `if`, and method-on-expression. | likely stale items include `?` suffix and `if` expression-position claims; verify them |
| R-4 | Current drift sweeps run over `docs/guides/` and `assets/ai/SKILL.md`, including raw CLI bypasses, Biome, output-path drift, package-layout drift, DD-49/DD-50 claims, and arc15 trap teaching | closing report includes commands, hit counts, and classification summary | serious | arc-plan | done | Required `rg` sweep plus targeted sweeps recorded in `closing-report.md`; `rg --count-matches` hit table included. | use `rg`; do not rely on memory |
| R-5 | Behavioural claims are validated against the actual 0.6.0 branch or explicitly marked unverified with a re-entry condition | for every `still-open` behavioural candidate, closing report includes `./bin/lykn`/test evidence or a named blocked reason | correctness | ledger | done | `./bin/lykn --version`, `build --help`, `publish --help`, `dist --help`, `build`, and four compile/run probes recorded in `closing-report.md`. | surfaced no-else `if` expression defect: compile/check exit 0 but emitted JS is invalid |
| R-6 | The recon output proposes the next arc07 shape | closing report includes "Recommended next slice breakdown" with close/one-slice/split decision and rationale | correctness | arc-plan | done | `closing-report.md` recommends split follow-ups: build-dist-publish refresh, Deno workflow reconciliation, compiler no-else follow-up, optional `.d.ts` docs. | should update arc-plan before the next implementation slice is scoped |
| R-7 | Recon-only boundary preserved | `git diff --name-only` excludes `docs/guides/**` and `assets/ai/SKILL.md` except for accidental typo repair explicitly justified | correctness | slice-doc | done | `git diff --name-only` listed only this `ledger.md` before tracking the new report; `git status --short` used for the new close artifact before staging. No `docs/guides/**` or `assets/ai/SKILL.md` changes. | keeps this slice from smuggling implementation edits |
| R-8 | Docs/path gates green at close | `make test-docs` and `make check-cited-paths` pass | serious | process note | done | `make test-docs` passed: 476 passed / 0 failed. `make check-cited-paths` passed: 580 documents on `release/0.6.x`, 601 historical citations accepted. | `make check` optional unless recon touches executable docs beyond close artifacts |

## What Worked

- The old May seed rows are useful provenance but not safe as implementation
  instructions without current CLI probes. DD-49/DD-50/arc15 made multiple old
  examples stale.
- The remaining user-facing drift clusters cleanly around build/dist/publish
  and raw Deno workflow examples.
- Recon surfaced one real behavior defect outside the docs-only slice: no-else
  `if` in expression position emits invalid JS instead of failing at
  `lykn check`/`lykn compile`.

## Closure

Closed as recon-only. Remaining work is explicitly split in
`closing-report.md`: build/dist/publish docs, Deno workflow reconciliation, a
compiler follow-up for no-else `if` in expression position, and optional `.d.ts`
docs with a targeted artifact fixture.
