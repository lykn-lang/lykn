# Slice 05: cleanup (M22.5-4) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-29 · **Branch:** `release/0.6.x`
**Verdict: delivered — arc04's extraction campaign is complete.** Dead code gone;
**`deno lint packages/` reaches exit 0** (the standing debt since the
cdc/compiler-coherence merge); `_kernel` removal assessed (not attempted) and
handed on as DD-37 step 4. Committed `6c9de6d`.

---

## Per-row walk

- **F-1 — dead functions deleted.** `buildThread` and `buildSomeThread` (nested in
  `registerSurfaceMacros`, zero call sites) removed, along with the dangling
  `buildThread` reference in buildSomeThread's docblock. `grep -nE
  'buildThread|buildSomeThread' surface.js` → none. (92 lines deleted.)
- **F-2 — `deno lint packages/` exit 0.** With those two gone, one more residual
  surfaced (`gensym`, used only by the deleted `buildSomeThread`) and was removed
  from surface.js's import. `deno lint packages/` → "Checked 14 files", **exit 0**.
- **F-3/F-4 — green.** Rebuild-first: `lykn test` 1345/0; `deno test --config
  project.json -A test/` 658/0; `cargo test` 0 failed; `cargo clippy -D warnings`,
  `deno lint scripts/`, `deno lint packages/` all exit 0.
- **F-5 — `_kernel` assessed (below).**
- **F-6 — core inventory (below).**

Deletion + verification only — no `move-function` moves (nothing relocated), so
the arc04 move-by-tool invariant doesn't apply here.

---

## F-5 — `_kernel` marker / DD-37 step 4 assessment (assess, do NOT remove)

**What `_kernel` is.** A boolean marker stamped on kernel-form AST nodes
(`node._kernel = true`) that tells the expander "this is already a kernel form —
do not re-expand it." It's the guard that stops surface macros' kernel output
from being re-macro-expanded (infinite-loop / double-expansion prevention).

**Current usage (load-bearing):**
- `expander.js:733–751` — the **core dispatch**: `if (head.type === 'atom' &&
  !form._kernel)` gates surface-macro expansion (733, 746); emitted kernel forms
  are stamped `_kernel = true` (738, 740) and skipped on re-walk (751). This is
  the heart of the macro-expansion loop.
- `classifier.js:297` — `pair._kernel = true` stamps a kernel pair the classifier
  emits.
- `surface-helpers.js:52` — `kernelArray(...)` is the canonical setter
  (`node._kernel = true`); used at `surface-helpers.js:512` by `compileLetPattern`.

**What full removal (DD-37 step 4) would require.** Replacing the marker with a
structural distinction between surface and kernel forms — e.g. a dedicated
kernel-node type/tag the reader/emitter produce, or threading expansion-state
through the walker instead of mutating nodes. That is an **expander-core
architectural change** (it touches `expander.js`'s dispatch, every kernel-form
emitter's output shape, and `kernelArray`), with its own design decision and test
surface. It is **not cleanup** and is correctly out of slice05's scope.

**Recommendation.** Track `_kernel` removal as **DD-37 step 4**, a dedicated slice
(or DD) under a future arc — scoped as an expander refactor with its own ledger,
not folded into arc04. `kernelArray` stays until then (it's the marker's setter,
genuinely used).

---

## F-6 — `surface.js` irreducible-core inventory

`surface.js` is now **448 lines** (from the ~2,315-line pre-campaign baseline).
Remaining top-level declarations:

| Decl | Category | Why it stays |
|------|----------|--------------|
| `resetTypeRegistry` | ADT registry init | Initializes the (relocated) `typeRegistry` with the blessed prelude types; an init routine, not a form. |
| `parseDestructuredParam`, `parseObjectDestructure`, `parseArrayDestructure`, `paramBoundNames`, `parseDefaultParam`, `parseRestParam` | param/destructure **parsing primitives** | Not surface *forms* — low-level param-shape parsers. Still used (via `parseTypedParams` in surface-helpers.js). A different category from the extracted form-emitters. |
| `registerSurfaceMacros` | `js:*` interop registration | Holds the 5 `js:*` interop forms — interop, never surface-migrated (kept per scope). |

**Conclusion: nothing extractable for the form-extraction campaign remains.** All
surface-form emit logic moved to classifier.js (slice03/04); what's left in
surface.js is param-parsing primitives + ADT-registry init + `js:*` interop. The
campaign is complete.

---

## Bubble-up to arc04 — campaign complete

All **five** arc04 slices are closed:
1. **slice01** — `move-function` core (byte-exact, verify gate).
2. **slice02** — cross-file rewiring + batch + atomic revert.
3. **slice03** — helper extraction (10 helpers → surface-helpers.js).
4. **slice04** — complex-form extraction (5 emitters + support → classifier.js;
   `typeRegistry` relocated; the TO-as-consumer tool enhancement).
5. **slice05** — cleanup (dead code gone; `deno lint packages/` exit 0).

**arc04 is ready for its arc-level close.** The composition claim: the tool was
*built* (slice01/02) **and** *drove the complete surface extraction* (slice03/04)
— `surface.js` reduced ~2,315 → 448 lines (its irreducible core), every move
byte-exact (incl. `emitMatchMacro`, the function M22 broke), DD-37's
implementation migration done, and the JS lint slate fully green.

**One follow-up handed on:** `_kernel` removal = **DD-37 step 4** (expander
refactor, future arc) — assessed above, not attempted.

---

## Reproduce (for CDC)

```sh
cd /Users/oubiwann/lab/lykn/lang
grep -nE 'buildThread|buildSomeThread' packages/lang/surface.js   # → none (F-1)
deno lint packages/                                                # exit 0 (F-2)
cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"
"$LYKN_BIN" build && "$LYKN_BIN" test                              # 1345 | 0
deno test --config project.json -A test/                           # 658 | 0
cargo test --all-features --workspace                              # 0 failed
cargo clippy --all-features --workspace -- -D warnings             # exit 0
deno lint scripts/                                                 # exit 0
```
