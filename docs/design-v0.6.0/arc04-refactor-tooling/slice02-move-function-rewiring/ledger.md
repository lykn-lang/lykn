# Slice: move-function-rewiring (arc04 / slice02) — Ledger

Canonical ledger, lifted from the cc-prompt's embedded §4 ledger + §7 acceptance,
plus the rebuild-first verify required by slice01's bubble-up. TDD-first paired
commits (test-only, then fix-only); all slice01 (T1a) tests stay green
throughout. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

**Scope reminder:** slice02 builds and *proves* the cross-file rewiring + batch
capability on a **scratch** `andChain` move (nothing lands). The real helper
extraction (M22.5-2) and complex-form extraction (M22.5-3) are **later slices**
executed *with* this tool.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `rewriteImportSource(text, name, oldSpec, newSpec)` — move a name between import sources (merge/create/delete-when-empty/no-op), incl. path resolution | Layer-1 unit tests green; **all slice01 tests still green** | correctness | T1b-1 | open | | reuse T1a `addNamedImport` internals; don't duplicate |
| F-2 | consumer discovery + rewire folded into `moveFunction`; **atomic multi-file revert** across FROM, TO, and every rewired consumer | Layer-2 e2e (consumer file) + Layer-3 multi-file-revert tests green | serious | T1b-2 | open | | on verify failure ALL touched files revert byte-exactly |
| F-3 | batch mode `--names a,b,c` — atomic move+verify per name, stop-on-failure (optional `--batch-verify-once`) | Layer-3 batch test green | correctness | T1b-3 | open | | left-to-right; keep-if-green, revert-and-stop on red |
| F-4 | acceptance: scratch `andChain` move from `surface.js`→`surface-helpers.js`, rewires `classifier.js` (+ any other real consumer), full suite green, moved body **byte-identical**, scratch discarded | `deno test -A test/` green on scratch; rewired consumers + zero-body-diff (`git show` diff) recorded | serious | T1b-4 | open | | the real consumers are real (classifier.js:8 imports andChain from surface.js) |
| F-5 | `deno lint scripts/` clean; closing notes | `deno lint scripts/` exits 0 | correctness | T1b-5 | open | | stays plain JS, `npm:acorn`-only |
| F-6 | no regressions | `deno test --config project.json -A test/` green; all slice01 tool tests green | serious | §7 | open | | |
| F-7 | **rebuild-first verify** — the acceptance/verify runs against freshly built `lang/`, not stale `target/lykn/build/` (slice01 bubble-up #2) | acceptance `--verify-cmd` rebuilds first (e.g. `lykn build && deno test -A test/`) **or** reuses arc03/slice11's freshness guard | serious | slice01 bubble-up | open | | prevents the stale-build-dir false-green/red class arc03/slice11 already guards |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 7. Done: _. Deferred: _. No-op: _.

> **Iteration budget:** standing override — genuine engineering over count; CDC
> review judges substance.
