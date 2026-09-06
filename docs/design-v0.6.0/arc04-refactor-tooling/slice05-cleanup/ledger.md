# Slice 05: cleanup (M22.5-4) — Ledger

Deletion + verification (not `move-function` moves). **Lands; closes arc04's
extraction campaign.** Rebuild-first verify. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Delete dead `buildThread` + `buildSomeThread` (+ the dangling comment) from `registerSurfaceMacros` | `grep -nE 'buildThread\|buildSomeThread' packages/lang/surface.js` → none | serious | slice03/04 bubble-up | **done** | Commit `6c9de6d`. Both deleted (92 lines) + the docblock comment; grep → none. Zero call sites confirmed | **attested** |
| F-2 | **`deno lint packages/` exit 0** | `deno lint packages/` → exit 0 (the last 2 residuals cleared) | serious | standing debt | **done** | `deno lint packages/` → "Checked 14 files", **exit 0**. One extra residual (`gensym`, used only by the deleted buildSomeThread) cleared too. Standing JS-lint debt since cdc/compiler-coherence gone | **attested** |
| F-3 | rebuild-first full suite green | rebuild-first `lykn test`/`deno test` → 0 failed | serious | slice02 F-7 | **done** | rebuild-first: `lykn test` 1345/0; `deno test --config project.json -A test/` 658/0 | **attested** |
| F-4 | no regressions / lint clean | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | serious | slice-doc | **done** | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0 | **attested** |
| F-5 | **`_kernel` / DD-37-step-4 assessment** written; `_kernel` NOT removed here | a closing-report section: current `_kernel` usage + what full removal requires + recommended follow-up (DD-37 step 4) | correctness | slice-doc | **done** | closing-report §F-5: load-bearing usage (expander.js:733–751 dispatch, classifier.js:297, surface-helpers.js kernelArray) documented; full removal = expander-core change → recommended as DD-37 step 4 (future arc). Not removed | **attested** |
| F-6 | `surface.js` irreducible-core inventory | a brief list in the closing report — confirms nothing extractable left | polish | slice-doc | **done** | closing-report §F-6: surface.js now **448 lines** (from ~2,315); remains = param/destructure parsers + `resetTypeRegistry` + `registerSurfaceMacros` (js:* interop). Nothing extractable for the form campaign | **attested** |

## What Worked

- **Tight scope held.** Deletion + verify only; resisted the `_kernel`-removal
  trap (assessed + handed on as DD-37 step 4) — the slice stayed small.
- **The deletion cascaded cleanly** — removing the dead functions surfaced one
  more genuinely-dead import (`gensym`), and clearing it took `deno lint
  packages/` to exit 0 (the standing debt since cdc/compiler-coherence).

## Closure

Closed 2026-06-29 (commit `6c9de6d`). Verified by: CC (attested) + CDC
(`cdc-verification.md`: grep-confirmed deletions + surface.js=448; lint exit 0 cause-verified).
Rows: 6. Done: 6. Deferred: 0. No-op: 0. **Closing slice05 completes arc04** —
all five slices closed; ready for arc04's arc-level close.

> Keep it tight: this is the easy cleanup that closes a long campaign. The only
> trap is over-reaching into `_kernel` removal — **don't**; assess and hand it
> on. Keep `kernelArray` (used) and `registerSurfaceMacros` (js:* interop).
