# Slice 01: run-once-topology — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-05
**Verdict: accepted — slice01 closed; arc12 ready to close.** All four
fixes reproduced by code; the win is measured (`make test-docs` 1m52s →
2.6s; `make check` >2m → 1m04s; corpus 8×/4× → 1×/0×); counts held. One
minor reconciliation query for the gate session (below).

## Verification (git + code review; runtime CC-attested)

Commit: **`3612cad` confirmed on `release/0.6.x`**. Diff: 6 files,
+185/−60 — Makefile + `main.rs`/`doctest.rs` + the new gating test + docs.

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 baseline | Before-table present, matches the report + CDC's own topology read (test-lykn ⊂ test-js confirmed independently pre-slice). | reproduced (read) |
| F-2 (A) | **Code-reproduced**: the `test/` `default_value` on `patterns` is gone (only lint's `packages/` default remains); `docs_pattern_gating.rs` exists (74 lines) pinning both directions. Behavior attested (census 0× in test-docs). | reproduced (code) + attested |
| F-3 (B) | **Code-reproduced**: `docs: Vec<String>` (multi-path flag); `make test-docs` = one invocation with 4 `--docs` args (`Makefile:246–250`); granular targets preserved. Mechanism rationale stated (reuse over rework — sound). | reproduced (code) |
| F-4 (C) | **Code-reproduced**: `test: test-rust test-suite test-docs` (`Makefile:200`); `test-suite` honest name; `test-lykn` kept as documented dev alias, out of the chain. Naming surfaced, not silent. | reproduced (code) |
| F-5 (D) | **Code-reproduced**: `common-checks: check-deps build-release lint` — plus a latent ordering fix CC caught (lint needs `bin/lykn`, which build produces; it ran *after* lint before). | reproduced (code) |
| F-6 | Docs reproduced (CLAUDE.md + `test/CONVENTIONS.md` name `make check` as the bar); counts attested (1365/0 · 673/0 · docs 475/0); census attested (1×/0×); timing table present. | reproduced (read) + attested |

Rows: 6/6 walked. Done: 6. Deferred: 0. No-op: 0. **No silent drops.**

**Minor reconciliation query (for the gate session, not close-blocking):**
the combined doc run reports **475/0**; the last per-suite numbers summed
to ~473 (guides 468 + README 1 + examples 2+2). CC states "identical set."
Likely a benign counting difference from consolidation (or the arc10 fence
flips) — worth one glance at the combined run's block count during the
gate so the number is *reconciled*, not just plausible.

## Bubble-up check

- Delivered the arc capability: **yes** — each test once per `make check`,
  docs-only `make test-docs`, honest targets, measured win.
- Silent-drop diff: clean. Beyond-scope finds all filed, not parked:
  batch-compile lever; `--compile-only`+`--docs` quirk; **stray-sibling
  double-run hardening** (deno discovery of `test/` picks up stray
  `*_test.js` — CC hit the 97 stale-binary leftovers during the census;
  `lykn test` verified not to create them); freshness-guard false-positive
  (scope to `src/`). **All four instantiated in project-plan §Post-0.6.0
  this pass** — routed means watched.
- arc-plan change: A-1 done; A-2/A-3 met (attested; reproduce at the gate).

## Disposition

**slice01 closed; arc12 → CLOSING** (single-slice arc; closing-report
assembled). The **combined gate session** now covers arc10 + arc11 + arc12
in one cheap pass — consolidated runbook in arc12's closing-report §4.
