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
| F-1 | `rewriteImportSource(text, name, oldSpec, newSpec)` — move a name between import sources (merge/create/delete-when-empty/no-op), incl. path resolution | Layer-1 unit tests green; **all slice01 tests still green** | correctness | T1b-1 | **done** | TDD pair `37196df`→`e0c4b2d`. rewriteImportSource (reuses addNamedImport) + importResolvesTo (`./surface.js` vs `../lang/surface.js` resolve same). 31 tests green (26 slice01 + 5) | **attested** |
| F-2 | consumer discovery + rewire folded into `moveFunction`; **atomic multi-file revert** across FROM, TO, and every rewired consumer | Layer-2 e2e (consumer file) + Layer-3 multi-file-revert tests green | serious | T1b-2 | **done** | TDD pair `eb3b424`→`c8211ee`. Consumer globbed by resolved path; re-exporter consumer left alone; failing verify reverts FROM+TO+all consumers byte-exact. 33 tests green | **attested** |
| F-3 | batch mode `--names a,b,c` — atomic move+verify per name, stop-on-failure (optional `--batch-verify-once`) | Layer-3 batch test green | correctness | T1b-3 | **done** | TDD pair `f57954b`→`babc6a5`. batchMove keeps green, reverts+stops on first red. `--batch-verify-once` **deferred** (track C) — disclosed in closing report. 35 tests green | **attested**; `--batch-verify-once` not implemented (allowed deferral) |
| F-4 | acceptance: scratch `andChain` move … rewires `classifier.js`, full suite green, moved body **byte-identical**, scratch discarded | `deno test -A test/` green on scratch; rewired consumers + zero-body-diff recorded | serious | T1b-4 | **done (adapted)** | **Capability proven on the real corpus**, but the literal andChain/classifier scenario does **not exist on release/0.6.x** (no `classifier.js`; `andChain` is internal-only with 0 consumers; both `andChain` and `toJsIdentifier` reference module-level free vars). Demonstrated instead on `toJsIdentifier` (compiler.js→scratch surface-helpers.js): tool rewired the real consumer `surface.js` (`consumers rewired: 1`, import → `./surface-helpers.js`), added compiler.js back-import, **byte-identical: true**. Its full move (rebuild-first verify) surfaced toJsIdentifier's free-var deps → **294 failures → atomic revert of all 3 files** (verify gate + multi-file revert proven at scale on real code). Scratch discarded; suite green on release/0.6.x (657/0). **Green real extraction deferred to M22.5-2** (needs the M22 surface/helpers architecture first) — see closing report | **attested**; honest caveat: literal andChain-green not achievable on this branch — capability + gate proven, green-extraction deferred |
| F-5 | `deno lint scripts/` clean; closing notes | `deno lint scripts/` exits 0 | correctness | T1b-5 | **done** | `deno lint scripts/` → "Checked 2 files", exit 0. Plain JS, `npm:acorn@^8` only | **attested** |
| F-6 | no regressions | `deno test --config project.json -A test/` green; all slice01 tool tests green | serious | §7 | **done** | `deno test --config project.json -A test/` → `657/0`; `deno test -A scripts/move-function.test.js` → `36/0` (all 26 slice01 + 10 slice02) | **attested** |
| F-7 | **rebuild-first verify** — acceptance/verify runs against freshly built `lang/`, not stale `target/lykn/build/` | acceptance `--verify-cmd` rebuilds first (e.g. `lykn build && deno test -A test/`) **or** reuses arc03/slice11's freshness guard | serious | slice01 bubble-up | **done** | TDD pair `01dc09d`→`b4ab5b7`. runVerifyCommand now runs via `sh -c`, so a compound `<lykn> build && deno test …` rebuild-first verify works (used live in the F-4 toJsIdentifier acceptance). No injected skip-gate flags. 36 tests green | **attested** |

## What Worked

- **TDD-first paired commits held** — F-1/F-2/F-3/F-7 are each a visible red→green
  SHA boundary; all 26 slice01 tests stayed green throughout.
- **Reuse over duplication** — rewriteImportSource composes addNamedImport +
  removeDeclaration; rewireConsumer composes rewriteImportSource + importResolvesTo;
  batchMove + atomic revert reuse moveFunction. No logic duplicated.
- **The verify gate earned its keep on real code** — the toJsIdentifier move
  surfaced a genuine entanglement (free-var deps) and the multi-file revert
  restored all three touched files byte-exact. The gate is what makes the tool
  safe to point at the real corpus.

## Closure

Closed on 2026-06-29. Verified by: CC (attested, 7 rows: 6 done, 1 done-adapted)
+ CDC (`cdc-verification.md`: git-confirmed commits on release/0.6.x;
code-reviewed atomic multi-file revert + rewiring + sh-c verify; F-4 adaptation
accepted; runtime deferred to host).
Rows: 7. Done: 7 (F-4 adapted, green-extraction deferred to M22.5-2). Deferred: 0
rows (1 sub-item: `--batch-verify-once`). No-op: 0.

TDD pairs (test→fix): F-1 `37196df`→`e0c4b2d` · F-2 `eb3b424`→`c8211ee` ·
F-3 `f57954b`→`babc6a5` · F-7 `01dc09d`→`b4ab5b7`. F-4 acceptance ran on a
discarded scratch branch (no commit). F-5/F-6 + close: final commit.

> **Iteration budget:** standing override — genuine engineering over count; CDC
> review judges substance.
