# M21 Closing Report — DD-37 Phase 0: Bundle-Size Baseline + `not` Pilot

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-17
**Branch:** cdc/compiler-coherence

---

## Per-Row Walk

### M21-1 — Baseline directory: done
`workbench/verify/m21/baseline.md` and `design-confirmation.md` exist.

### M21-2 — esbuild + make bundle-size: done
Commit `4b9546c`. `scripts/bundle-size.js` using npm:esbuild via Deno. Reuses existing browser build plugin infrastructure (nodePathShimPlugin, lyknImportPlugin). `make bundle-size` exits 0 with reproducible measurements.

### M21-3 — Baseline in DD-37: done
Commit `4b9546c`. DD-37 refinement log has "2026-05-17 — Phase 0 bundle baseline" with all three measurements (212.6 KB raw, 103.0 KB minified, 27.0 KB gzipped).

### M21-4 — CI guard: done (manual-runnable fallback)
Script exits non-zero on +5KB gzipped breach, warns on +2KB. BASELINE_GZIPPED env var configures the threshold. No existing CI workflow integration yet — fast-follow logged.

### M21-5 — Pre-pilot infrastructure: done
Commit `5b3103e`. `packages/lang/surface-ast.js` with Not constructor. `packages/lang/classifier.js` with classifySurfaceForm + emitSurfaceForm.

### M21-6 — `not` pilot: done
**TDD paired commits:**
- Test: `bf1883f` — regression tests for (not x) compilation
- Fix: `3a2eb91` — not removed from surface.js macro registration; classifier wired into expander pipeline

### M21-7 — Delta + extrapolation: done
Commit `4cfa4c2`. Recorded in DD-37 refinement log.

### M21-8 — All tests pass: done
- Rust (lykn-lang): 1023, CLI: 83, Surface: 292, Forms: 674, Kernel: 15

### M21-9 — Backward-compat: done
Production `lykn compile` unchanged. Kernel compiler path unchanged. Only `not` routing changed; all other surface forms use the old macro path.

### M21-10 — Closing report: done (this file)

### M21-11 — Commit chain: done
Test `bf1883f` → fix `3a2eb91` (paired commits for M21-6).

---

## Summary Table

| Metric | Baseline | Post-pilot | Delta |
|--------|----------|------------|-------|
| Raw | 217,672 (212.6 KB) | 218,410 (213.3 KB) | +738 (+0.7 KB) |
| Minified | 105,439 (103.0 KB) | 105,752 (103.3 KB) | +313 (+0.3 KB) |
| Gzipped | 27,630 (27.0 KB) | 27,739 (27.1 KB) | +109 (+0.1 KB) |

**Extrapolation × 20 forms:**
- Lower bound: +2.2 KB gzipped
- Upper bound: +6.5 KB gzipped (3× scaling for larger forms)
- Budget: +20 KB gzipped → **well within budget**
- **Go/no-go: GO**

## Design-Call Confirmations

All 10 confirmed. See `workbench/verify/m21/design-confirmation.md`.

---

## Substrate-rule compliance

1. **CLAUDE.md safety gates:** No violations.
2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 11 rows addressed.
3. **philosophy.md Principle 1:** New files additive (surface-ast.js, classifier.js, bundle-size.js).
4. **philosophy.md Principle 3:** Pilot produces identical output to old path.
5. **Backward-compat:** Production paths unchanged; only `not` rerouted.
6. **TDD-first:** M21-6 test `bf1883f` → fix `3a2eb91`. Paired commits.

---

## Findings for fast-follow

1. **CI integration.** `make bundle-size` is manually runnable with threshold checking. Wiring into `.github/workflows/ci.yml` as a job is a fast-follow.
2. **Extrapolation is encouraging.** +109 bytes/form gzipped × 20 = well within +20 KB budget. Per-form migration may proceed.
3. **Classifier wiring pattern is clean.** The expander checks `classifySurfaceForm` before macro dispatch. Adding more forms to classifier.js is a slot-in per the same pattern.

---

## Closure

DD-37 Phase 0 acceptance criteria met:
1. ✅ Baseline measurement landed (27.0 KB gzipped)
2. ✅ CI guard wired (manual-runnable with threshold exit codes)
3. ✅ One full-pipeline migration prototyped (not: +109 bytes gzipped)

Go/no-go for DD-37 step 3+: **GO.**
