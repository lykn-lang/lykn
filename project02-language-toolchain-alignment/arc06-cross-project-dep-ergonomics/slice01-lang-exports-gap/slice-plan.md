# Slice: lang-exports-gap (Finding D)

> Reconstructed retroactively (round-2 migration, 2026-06-28). A complete
> finding → prompt → closing → CDC micro-slice, surfaced by CC's reconciliation
> as real arc06 seed evidence (originally on branch `cdc/dep-ergonomics`).
> Gap: no standalone `ledger.md` (tracked as a finding, not a milestone).

## Goal / scope
`packages/lang/deno.json`'s `exports` field omitted `./mod.js`, breaking
downstream `lang/mod.js` resolution. Add the missing sub-path export so
downstream consumers (the mycelium project) resolve `@lykn/lang/mod.js`.

## Status
Closed (shipped 2026-05-12).

## Artifacts
- `cc-prompt.md` — Finding D implementation prompt
- `closing-report.md` — Finding D closing note
- `cdc-verification.md` — CDC independent review
- `design/finding.md` — the original finding (the `./mod.js` exports gap)

## Provenance
The empirical root of this finding is the mycelium bootstrap (see
`../design/mycelium-bootstrap-issues.md`); the disconfirmation thread that ran
alongside it is `../../arc03-compiler-coherence/design/finding-e-empirical-disconfirmation.md`.
