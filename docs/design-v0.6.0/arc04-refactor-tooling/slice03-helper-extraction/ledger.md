# Slice 03: helper-extraction (M22.5-2) — Ledger

The first real `move-function` extraction; **it lands** (committed). Every move
is performed **by the tool** (`scripts/move-function.js`), never hand-edited or
reimplemented — that is the whole point of arc04. Rebuild-first verify
throughout. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

The 10 helpers: `isPascalCase`, `compilePattern`, `andChain`, `getLiteralType`,
`typeMatchesLiteral`, `buildTypeCheck`, `compileLetPattern`, `parseTypedParams`,
`paramNameNodes`, `paramTypeChecks`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Dependency analysis** — for each of the 10, list its free-var + inter-helper deps; derive a leaf-first move order | a dep table in the closing report; every helper's deps are already in `surface-helpers.js` or scheduled earlier in the order | serious | slice02 bubble-up | **done** | Dep table in closing-report §1 (acorn free-var scan). Two hazards (`compilePattern→typeRegistry`, `parseTypedParams→parse{Destructured,Default,Rest}Param`) are **exported/importable**, so satisfied by adding imports to surface-helpers.js — not M22.5-3 deferrals. Leaf-first order derived | **attested** |
| F-2 | Moves performed **by `scripts/move-function.js`** (batch or per-name), not by hand | the move commands/transcript recorded; no manual cut-paste of bodies | serious | arc04 invariant | **done** | 3 `move-function.js` invocations (batch of 7 leaves; batch of 2 `compilePattern,compileLetPattern`; single `parseTypedParams`), each with rebuild-first `--verify-cmd`. No body hand-edited | **attested** |
| F-3 | All 10 **defined in `surface-helpers.js`**, **0 in `surface.js`** | grep → surface-helpers.js=1, surface.js=0 for each | serious | slice-doc | **done** | grep loop: all 10 `surface.js=0 helpers.js=1` | **attested** |
| F-4 | Each moved body **byte-identical** to its pre-move form | `git show` pre/post diff per helper = zero body diff | serious | arc04 invariant | **done** | Captured all 10 pre-move bodies; post-move `slice(start,end)` === original for all 10 ("ALL 10 BYTE-IDENTICAL ✓"). The tool's invariant held | **attested** |
| F-5 | The alias re-export line removed from `surface-helpers.js` | grep no longer lists the 10 | correctness | slice-doc | **done** | The tool's `stripReExport` shrank the alias incrementally; after the last move it was empty and deleted. `grep 'export {…} from "./surface.js"'` → none. (Stale comment also removed) | **attested** |
| F-6 | Consumers import all 10 from `surface-helpers.js`, none from `surface.js` | classifier.js import line 8 no longer lists the 6 | correctness | slice-doc | **done (with note)** | classifier.js line 8 (from surface.js) lists **none** of the 10 — only M22.5-3 forms. It imports from surface-helpers.js the **7** of the 10 it actually uses; `isPascalCase`/`andChain`/`compilePattern` were **pre-existing dead imports** (never used by classifier.js) — removed rather than carried as dead | **attested**; F-6 "all 10" adjusted to "all it uses, none from surface.js" |
| F-7 | **rebuild-first full suite green** | rebuild-first `lykn test` 0 failed; `deno test … test/` 0 failed | serious | slice02 F-7 | **done** | rebuild-first: `lykn test` → **1345/0**; `deno test --config project.json -A test/` → **658/0**. Each move also verified rebuild-first | **attested** |
| F-8 | no regressions / lint clean | `cargo test --workspace` 0 failed; `deno lint` + `deno lint scripts/` exit 0; `cargo clippy -D warnings` exit 0 | serious | slice-doc | **done (except pre-existing deno-lint-packages debt)** | `cargo test` 0 failed; `cargo clippy -D warnings` exit 0; `deno lint scripts/` exit 0. **`deno lint packages/` NOT exit 0** — 4 residual errors, ALL pre-existing cdc/compiler-coherence debt **out of slice03 scope**: `typeRegistry`/`parseKeywordClauses` (classifier.js dead imports for the M22.5-3 complex forms) + `buildThread`/`buildSomeThread` (surface.js dead **functions** = M22.5-4). slice03 cleaned its move-induced unused imports + reduced packages/ errors 10+→4 and introduced none | **attested**; F-8 deno-lint-packages blocked by pre-existing M22.5-3/4 debt — see closing report |

## What Worked

- **Dependency-first, leaf-first ordering** — the acorn free-var scan turned a
  10-helper move into a safe sequence; the two importable hazards were satisfied
  by 4 destination imports, no deferrals needed.
- **The tool's stripReExport handled F-5 for free** — the alias line shrank
  move-by-move and self-deleted; no manual alias edit.
- **Byte-identity held across all 10** on real, entangled corpus code — the
  payoff of the slice01/02 invariant.

## Closure

Closed on 2026-06-29 (commit `266ff3d`). Verified by: CC (attested) + CDC
(`cdc-verification.md`: git/grep-confirmed F-3/F-5/F-6/F-8 + andChain byte-identity
spot-check; F-7 runtime deferred to host).
Rows: 8. Done: 8 (F-6 with a noted adjustment; F-8 green except pre-existing
`deno lint packages/` debt that is M22.5-3/4 scope — disclosed, not silently
dropped). Deferred: 0. No-op: 0.

> **Iteration budget:** standing override — genuine engineering over count; CDC
> review judges substance. If a helper's deps make a clean byte-move impossible,
> **surface it** (it may need its deps moved first, or it's really an M22.5-3
> entanglement) — do not hand-edit the body to force it.
