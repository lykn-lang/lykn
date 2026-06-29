# Slice: move-function-core (arc04 / slice01) — Ledger

Canonical ledger, lifted from the cc-prompt's embedded §8 ledger + §11
acceptance criteria. TDD-first paired commits (test-only commit, then fix-only
commit). Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Evidence
reaches at least `reproduced` (CDC re-runs the Verify) for `done`.

**The non-negotiable invariant (F-3):** parse only to locate; copy raw bytes;
never regenerate. The moved declaration's bytes must be strict-string-identical
to the source bytes — that byte-identity is what makes the move verifiable.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `scripts/move-function.js` scaffold: CLI args (`--from/--to/--name/--dry-run/--verify-cmd`), `import.meta.main` guard, invocation comment; first failing `locateDeclaration` test | `deno test -A scripts/move-function.test.js` (red→green pair) | correctness | T1a-1 | open | | |
| F-2 | `locateDeclaration` handles all declaration shapes + leading-comment extension | Layer-1 locate tests green | correctness | T1a-2 | open | | |
| F-3 | `removeDeclaration` + `insertDeclaration` — verbatim slice; **byte-identity invariant holds** | Layer-1 + §2 invariant test green (moved bytes === source bytes) | serious | T1a-3 | open | | the non-negotiable; no astring/regeneration |
| F-4 | `addNamedImport` + `stripReExport` | Layer-1 import/re-export tests green | correctness | T1a-4 | open | | |
| F-5 | `moveFunction` orchestration (single name, two files) + Layer-2 temp-fixture tests + abort conditions | Layer-2 + abort tests green | serious | T1a-5 | open | | |
| F-6 | Verify gate + auto-revert + dry-run; **no skip-gate flags, no silent `--no-verify`** | Layer-3 verify/dry-run tests green | serious | T1a-6 | open | | safety-gate discipline (CLAUDE.md) |
| F-7 | Acceptance: scratch-branch move of a **zero-external-consumer** helper keeps `deno test -A test/` green; scratch discarded (no real extraction lands) | `deno test -A test/` green on scratch; helper + zero-consumer grep recorded | serious | T1a-7 | open | | reproduce at slice scale |
| F-8 | `deno lint scripts/` clean; closing notes | `deno lint scripts/` exits 0 | correctness | T1a-8 | open | | |
| F-9 | no regressions | `deno test --config project.json -A test/` green | serious | §11 | open | | guard the broader suite |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 9. Done: _. Deferred: _. No-op: _.

> **Iteration budget:** the cc-prompt invokes the standing override — genuine
> engineering over count (progress, not compliance theatre). CDC review judges
> substance.
