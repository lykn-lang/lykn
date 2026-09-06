# Slice 03: helper-extraction (M22.5-2)

> The **first real `move-function` extraction** — the payoff the tool (slice01 +
> slice02) was built for. Unlike slice01/02 (scratch, nothing landed), this one
> **lands**: it physically moves the 10 aliased helpers out of `surface.js`,
> completing the helper half of DD-37's surface migration.
>
> **Closed 2026-06-29** (CC-attested; awaiting CDC verification). All 10 moved
> by the tool, byte-identical; consumers rewired; alias gone; corpus 1345/0 +
> deno test 658/0. F-8 exception: `deno lint packages/` blocked by pre-existing
> cdc/compiler-coherence debt that is M22.5-3/4 scope — see closing-report §4.

## Goal

Turn the 10 **aliased** helpers — currently *defined* in `surface.js` and only
*re-exported* through `surface-helpers.js` — into **real definitions in
`surface-helpers.js`**, using `scripts/move-function.js` (byte-exact, never
reimplemented), rewire their consumers, and delete the alias re-export line.

The 10 (per the M22 audit): `isPascalCase`, `compilePattern`, `andChain`,
`getLiteralType`, `typeMatchesLiteral`, `buildTypeCheck`, `compileLetPattern`,
`parseTypedParams`, `paramNameNodes`, `paramTypeChecks`.

## Current state (release/0.6.x, post-merge)

- All 10 are **defined in `surface.js`**, 0 in `surface-helpers.js`.
- `surface-helpers.js` re-exports them via one alias line
  (`export { … } from "./surface.js"`) and already imports the common expander
  deps (`sym, array, gensym, isKeyword, isArray, formatSExpr, toJsIdentifier`).
- **Consumers split two ways:** `classifier.js` already imports 4 of them
  (`compileLetPattern, parseTypedParams, paramNameNodes, paramTypeChecks`) from
  `surface-helpers.js` (via the alias) — those need **no rewire**, just the alias
  drop; the other 6 (`compilePattern, andChain, isPascalCase, buildTypeCheck,
  getLiteralType, typeMatchesLiteral`) it imports straight from `surface.js` →
  **rewire to `surface-helpers.js`**. `surface.js` itself may still use some
  (unmigrated forms) → the tool adds the back-import.

## The hazard (slice02 bubble-up): dependency ordering

The tool moves **bytes, not dependencies**. Each helper references module-level
names; the move only succeeds if those are available at the destination:
- **Leaf helpers** (deps already in `surface-helpers.js`) move cleanly — e.g.
  `andChain` (uses only `sym`/`array`), `buildTypeCheck` (uses `toJsIdentifier`).
- **Inter-helper deps** force an order — e.g. `compileLetPattern` calls
  `isPascalCase`, so `isPascalCase` must land first (or move together).
So this slice is **dependency-ordered**, not just consumer-ordered.

## Scope (out)

M22.5-3 (the 4 complex forms `match`/`type`/`genfunc`/`func`, ~470 lines) and
M22.5-4 (dead-code + `_kernel` cleanup) — later slices.

## Verification approach

Rebuild-first throughout (the slice02 F-7 / arc03-slice11 freshness lesson):
`cargo build --release && export LYKN_BIN=… && "$LYKN_BIN" build && "$LYKN_BIN" test`.
Per-row in `ledger.md`. This slice **lands** (committed), so the final state must
be fully green.

## Exit criteria

All 10 helpers defined in `surface-helpers.js`, none in `surface.js`; alias line
gone; all consumers import from `surface-helpers.js`; each body byte-identical to
its pre-move form; full suite green; every move done **via the tool**, not by hand.
