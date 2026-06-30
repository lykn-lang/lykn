# Slice 05: cleanup (M22.5-4) — Ledger

Deletion + verification (not `move-function` moves). **Lands; closes arc04's
extraction campaign.** Rebuild-first verify. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Delete dead `buildThread` + `buildSomeThread` (+ the dangling comment) from `registerSurfaceMacros` | `grep -nE 'buildThread\|buildSomeThread' packages/lang/surface.js` → none | serious | slice03/04 bubble-up | open | | zero call sites; only a comment referenced them |
| F-2 | **`deno lint packages/` exit 0** | `deno lint packages/` → exit 0 (the last 2 residuals cleared) | serious | standing debt | open | | the headline — JS lint fully green |
| F-3 | rebuild-first full suite green | `cargo build --release && LYKN_BIN=… "$LYKN_BIN" build && "$LYKN_BIN" test` → 0 failed; `deno test … test/` → 0 failed | serious | slice02 F-7 | open | | lands |
| F-4 | no regressions / lint clean | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | serious | slice-doc | open | | |
| F-5 | **`_kernel` / DD-37-step-4 assessment** written; `_kernel` NOT removed here | a closing-report section: current `_kernel` usage (expander dispatch 733–751, classifier.js:297, kernelArray) + what full removal requires + recommended follow-up (DD-37 step 4) | correctness | slice-doc | open | | scope guard: assess, don't remove |
| F-6 | `surface.js` irreducible-core inventory | a brief list in the closing report: what remains (param/destructure parsing, `resetTypeRegistry`, `registerSurfaceMacros` js:* interop) — confirms nothing extractable left for this campaign | polish | slice-doc | open | | confirms arc04 extraction complete |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 6. Done: _. Deferred: _. No-op: _.

> Keep it tight: this is the easy cleanup that closes a long campaign. The only
> trap is over-reaching into `_kernel` removal — **don't**; assess and hand it
> on. Keep `kernelArray` (used) and `registerSurfaceMacros` (js:* interop).
