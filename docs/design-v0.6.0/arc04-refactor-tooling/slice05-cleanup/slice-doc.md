# Slice 05: cleanup (M22.5-4)

> The denouement of arc04's surface-extraction campaign. After slice03 (helpers)
> and slice04 (complex forms) finished DD-37's implementation migration, this
> slice removes the **dead code** the migration left behind and takes the JS
> lint **fully green**. It also assesses — but does **not** attempt — the full
> `_kernel` marker removal (DD-37 step 4). **It lands; closing it closes arc04.**

## Goal

1. Delete the dead `buildThread` / `buildSomeThread` functions, clearing the last
   2 `deno lint packages/` residuals so it reaches **exit 0**.
2. Assess the `_kernel` marker state and **surface** what DD-37 step 4 (full
   removal) requires as a separate follow-up — do not remove it here.

## In scope (deletion + verify — NOT tool-moves)

- **Delete `buildThread` (surface.js:375) and `buildSomeThread` (surface.js:406)**
  — dead nested functions inside `registerSurfaceMacros`; zero call sites (the
  only other reference is a dangling comment at line 404, also removed). These
  are the exact `deno lint packages/` unused-var residuals.
- Any other dead code the migration left in `surface.js` that `deno lint` flags.

This slice is **deletions + verification**, not `move-function` moves — the arc04
move-by-tool invariant doesn't apply (nothing is relocated).

## Explicitly NOT in scope

- **`kernelArray` stays** — it is still used (`surface-helpers.js:512`, by
  `compileLetPattern`); it's part of the `_kernel` mechanism, not dead.
- **`registerSurfaceMacros` stays** — it still legitimately holds the 5 `js:*`
  interop forms (interop, never surface-migrated).
- **Full `_kernel` marker removal (DD-37 step 4)** — `_kernel` is still
  load-bearing in `expander.js`'s core dispatch (`733–751`), `classifier.js:297`,
  and `surface-helpers.js:54` (`kernelArray`). Removing it is an architectural
  change touching the expander, not cleanup. **Assess and surface it as a
  follow-up (DD-37 step 4); do not attempt it here.**

## Verification approach

Rebuild-first. The headline gate: `deno lint packages/` **exit 0** (it's been the
standing debt since the cdc/compiler-coherence merge). Full suite green. Per-row
in `ledger.md`.

## Exit criteria

`buildThread`/`buildSomeThread` gone; `deno lint packages/` exit 0; full suite
green; a written `_kernel` / DD-37-step-4 assessment in the closing report.
Closing this slice means **all five arc04 slices are closed** → arc04 ready for
its arc-level close (composition: the tool was built *and* drove the complete
surface extraction; `surface.js` reduced from 2,315 to its irreducible core).
