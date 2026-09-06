# CC Prompt — arc04 / slice03 · helper-extraction (M22.5-2)

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-29
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git ops host-side).
**Re:** The **first real `move-function` extraction.** Physically move the 10
aliased helpers out of `surface.js` into `surface-helpers.js`, using the tool you
built. **This one lands** (it's a real, committed extraction — not a scratch run).

## 0. Read first
- `project02-language-toolchain-alignment/arc04-refactor-tooling/slice03-helper-extraction/ledger.md` — the contract (8 rows).
- `…/slice03-helper-extraction/slice-doc.md` — current state, the consumer split, the dependency hazard.
- `…/slice02-move-function-rewiring/closing-report.md` — the free-var-dependency finding that shapes this slice.
- The M22 audit `…/arc03-compiler-coherence/slice08-dd37-per-form-migration/design/m22-audit-report.md` §"M22.5-2".

## 1. The invariant (the reason this whole arc exists)
**Move with the tool; never reimplement, never hand-edit a moved body.** Every
helper is relocated by `scripts/move-function.js` (byte-exact slice), not by
cut-paste or retyping. M22 failed precisely because sessions *reimplemented*
moved functions and introduced divergence (a broken `emitMatch`). If a clean
byte-move isn't possible, **stop and surface it** — do not force it by editing.

## 2. The work (MUST, in order)

1. **Dependency analysis first (F-1).** For each of the 10 — `isPascalCase`,
   `compilePattern`, `andChain`, `getLiteralType`, `typeMatchesLiteral`,
   `buildTypeCheck`, `compileLetPattern`, `parseTypedParams`, `paramNameNodes`,
   `paramTypeChecks` — list what module-level names it references (expander
   helpers, `toJsIdentifier`, other helpers in the 10, any `surface.js`-local
   consts). `surface-helpers.js` already imports
   `sym, array, gensym, isKeyword, isArray, formatSExpr, toJsIdentifier`, so deps
   in that set are already satisfied. Derive a **leaf-first move order** (known:
   `compileLetPattern` calls `isPascalCase`, so `isPascalCase` moves first;
   `andChain`/`buildTypeCheck` are leaves). If a helper depends on a `surface.js`
   const/helper **not** in the 10 and not importable, surface it — that's an
   M22.5-3 entanglement, not an M22.5-2 helper.
2. **Move in dependency order (F-2/F-3/F-4)** via `scripts/move-function.js`
   (`--from surface.js --to surface-helpers.js --name <h>`, or `--names` batch in
   order). Each move: byte-identical body, the tool adds `surface.js`'s back-import
   if still used, and rewires consumers. Use the **rebuild-first `--verify-cmd`**
   (`lykn build && deno test -A test/`, or wire arc03/slice11's freshness guard)
   so the verify isn't fooled by a stale build dir.
3. **Drop the alias (F-5).** Once all 10 are real defs in `surface-helpers.js`,
   delete the `export { … } from "./surface.js"` re-export line.
4. **Confirm consumers (F-6).** `classifier.js` imports all 10 from
   `surface-helpers.js`, none from `surface.js`. (4 already do; 6 get rewired by
   the tool. `surface.js` back-imports any it still uses for unmigrated forms.)
5. **Green (F-7/F-8).** Rebuild-first full suite: `lykn test` 0 failed, `deno test`
   0 failed, `cargo test` 0 failed, `clippy -D warnings` + `deno lint` + `deno lint
   scripts/` exit 0. No skip-gate flags.

## 3. Discipline
- This **lands** — it's a real extraction, committed (TDD/move-by-move commits
  with visible boundaries are ideal).
- Iteration budget: standing override (substance over count). But if you hit a
  helper that won't byte-move cleanly, surface it rather than grinding or
  hand-editing.
- Don't touch the 4 complex forms (`match`/`type`/`genfunc`/`func`) or dead code
  — those are M22.5-3 / M22.5-4.
- Leave `docs/design-v0.6.0/**` to CDC.

## 4. Close
Write `closing-report.md` (per-row walk + the **dependency table** from F-1 + a
**bubble-up to arc04**: any free-var entanglements or import shapes the M22.5-3
complex-form moves will face) → hand back for CDC `cdc-verification.md`. Closing
slice03 delivers the first real surface.js reduction; M22.5-3 (complex forms)
follows.
