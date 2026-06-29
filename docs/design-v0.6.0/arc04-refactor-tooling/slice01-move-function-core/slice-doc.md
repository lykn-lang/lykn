# Slice: move-function-core (M22.5-T1a)

> Reconstructed retroactively (2026-06-28). **Closed 2026-06-28** (CC-attested;
> awaiting CDC verification).

## Goal / scope
Verbatim-move core of `move-function.js`: relocate a function between two named
files without changing its text, validated on a zero-external-consumer helper.

## Status
Closed (2026-06-28). `scripts/move-function.js` built TDD-first (9 ledger rows,
all done); 26 tool tests + the 657-test JS suite green; `deno lint scripts/`
clean. Layer-4 acceptance (`parseRestParam`, byte-identical) ran on a discarded
scratch — no extraction landed.

## Artifacts
- `cc-prompt.md` — the CC assignment
- `ledger.md` — the 9-row ledger, walked at close
- `closing-report.md` — per-row walk + bubble-up to arc04
- `scripts/move-function.js` + `scripts/move-function.test.js` — the tool

## Close set
`cdc-verification.md` — CDC reproduces F-1…F-9 and lifts evidence to
`reproduced`. slice02 (cross-file rewiring / batch) stays unplanned until then.
