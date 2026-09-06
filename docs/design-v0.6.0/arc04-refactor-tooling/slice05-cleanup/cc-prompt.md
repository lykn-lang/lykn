# CC Prompt — arc04 / slice05 · cleanup (M22.5-4)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-29
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** The cleanup that **closes arc04's extraction campaign.** Remove the dead
code the DD-37 migration left, take `deno lint packages/` to **exit 0**, and
assess (don't attempt) the `_kernel` marker removal. Small, tight slice — the
trap is over-reaching.

## 0. Read first
- `…/slice05-cleanup/ledger.md` — the contract (6 rows).
- `…/slice05-cleanup/slice-doc.md` — in/out scope (note what stays).

## 1. The work (MUST)

1. **Delete `buildThread` (surface.js:375) and `buildSomeThread` (surface.js:406)**
   — dead nested functions in `registerSurfaceMacros`; zero call sites (the only
   other mention is a comment at line 404 — remove it too). (F-1)
2. **`deno lint packages/` → exit 0** (F-2). With those two gone, the last
   unused-var residuals clear. If `deno lint` flags anything else as dead from
   the migration, remove it (it's genuinely unused) — but see "do not touch" below.
3. **Verify green** (F-3/F-4), rebuild-first: `lykn test` 0 failed, `deno test`
   0 failed, `cargo test` 0 failed, `cargo clippy -D warnings` + `deno lint
   scripts/` exit 0.
4. **`_kernel` assessment (F-5) — ASSESS, do not remove.** Write a closing-report
   section documenting current `_kernel` usage (`expander.js` dispatch ~733–751,
   `classifier.js:297`, `surface-helpers.js:54` via `kernelArray`), what a full
   removal (DD-37 step 4) would require, and a recommended follow-up. Removing
   `_kernel` is an expander-core architectural change — **out of scope here.**
5. **`surface.js` core inventory (F-6)** — a brief list of what remains
   (param/destructure parsing, `resetTypeRegistry`, `registerSurfaceMacros`'s
   `js:*` interop), confirming nothing extractable is left for this campaign.

## 2. Do NOT touch
- **`kernelArray`** — still used (`surface-helpers.js:512`). Keep it.
- **`registerSurfaceMacros`** — keep (holds the 5 `js:*` interop forms).
- **The `_kernel` marker / expander dispatch** — assess only (F-5).

## 3. Discipline
- This is **deletion + verification**, not `move-function` moves — the move-by-tool
  invariant doesn't apply (nothing relocates).
- Lands (committed). Keep it small; resist scope-creep into `_kernel` removal.
- Leave `docs/design-v0.6.0/**` to CDC.

## 4. Close
Write `closing-report.md` (per-row walk + the F-5 `_kernel`/DD-37-step-4
assessment + the F-6 core inventory + a **bubble-up to arc04**: confirm all five
arc04 slices are done and the campaign is complete) → hand back for CDC
`cdc-verification.md`. Closing slice05 means **arc04 is ready for its arc-level
close** (CDC writes `arc04/closing-report.md`: the tool was built *and* drove the
full surface extraction; `surface.js` 2,315 → core).
