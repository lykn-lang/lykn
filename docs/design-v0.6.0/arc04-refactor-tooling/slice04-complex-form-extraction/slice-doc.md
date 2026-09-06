# Slice 04: complex-form-extraction (M22.5-3)

> The **hardest** extraction — the 4 complex-form emitters (`match`, `type`,
> `genfunc`, `func`), ~470 lines, the biggest functions in `surface.js`. These
> are the *exact* functions where, in M22, a session **reimplemented** instead of
> copying and shipped a broken `emitMatch`. The whole `move-function` tool exists
> so this slice can be a byte-exact move, not a rewrite. **It lands.**

## Goal

Move the 4 complex forms' emit implementations out of `surface.js` (where
`classifier.js` currently delegates to them, DD-37 "Option A") into
`classifier.js` (inline, "Option C"), using `scripts/move-function.js` — finishing
the implementation half of DD-37's surface migration.

## The move set (current state, release/0.6.x post-slice03)

All defined in `surface.js`; `classifier.js` is the **sole caller** (surface.js
does not call them) → moving to `classifier.js` is clean, no back-import:

| Function | surface.js line | Notes |
|----------|-----------------|-------|
| `buildSingleClauseFunc` | 441 | `func` (single clause) |
| `buildMultiClauseFunc` | 598 | `func` (multi clause) |
| `emitMatchMacro` | 813 | `match` — **the one that broke before** |
| `emitTypeMacro` | 930 | `type` — touches `typeRegistry` |
| `emitGenfuncMacro` | 1002 | `genfunc` |

**Support that moves *with* them** (only the movers use it): `parseKeywordClauses`,
`instrumentYields` (recursive; used only by `emitGenfuncMacro`).

## The critical hazard: `typeRegistry` is shared mutable state

`typeRegistry` (`const typeRegistry = new Map()`, surface.js:25) is used by **two
owners**: a surface.js init/reset routine (sets `Some`/`None`/`Ok`/`Err`,
lines 27–33) **and** `emitTypeMacro` (946/965, which is moving). It must remain a
**single `Map` instance** shared by both — duplicating it would split ADT
registration from resolution and silently break `type`/`match`.

**Plan:** relocate `typeRegistry` to `surface-helpers.js` (the shared-state home);
both `surface.js` (init) and `classifier.js` (`emitTypeMacro`) import the one
instance (ESM live bindings preserve identity). This is the riskiest step —
verify the registry round-trips end-to-end (ADTs register and resolve).

## Dependency notes

The movers also call the slice03 helpers (`compilePattern`, `buildTypeCheck`,
`andChain`, `compileLetPattern`, …) — import those from `surface-helpers.js`
(already there). `classifier.js` already imports `typeRegistry`/`parseKeywordClauses`/
`instrumentYields` (currently **dead** imports — they become live, or are replaced
by local defs, once the impls land).

## Scope (out)

M22.5-4 (dead-code: `buildThread`/`buildSomeThread`; `_kernel` cleanup) — slice05.

## Sizing note

This is the largest slice (~470 lines, 5 functions + shared-state relocation). It
should still fit one context, but if the dependency analysis shows it won't, **say
so and split** (e.g., the `typeRegistry` relocation as its own step, then the
emitters) rather than grinding.

## Verification approach

Rebuild-first throughout. This **lands** — final state fully green, plus an
explicit `typeRegistry` single-instance / ADT round-trip check. Per-row in
`ledger.md`.

## Exit criteria

The 5 emitters (+ `parseKeywordClauses`/`instrumentYields`) live in `classifier.js`,
byte-identical; `typeRegistry` is a single shared instance in `surface-helpers.js`;
`surface.js` no longer defines them; `match`/`type`/`genfunc`/`func` all work;
full suite green; the `typeRegistry`/`parseKeywordClauses` `deno lint packages/`
residuals cleared (4→2); every move by the tool, never reimplemented.
