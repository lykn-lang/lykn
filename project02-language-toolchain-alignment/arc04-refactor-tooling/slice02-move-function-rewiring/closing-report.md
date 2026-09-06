# Slice: move-function-rewiring (arc04 / slice02) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-29 · **Branch:** `release/0.6.x`
**Evidence strength:** `attested` (CC ran every command; CDC reproduces).

**Verdict: delivered.** `scripts/move-function.js` gains cross-file consumer
rewiring (by resolved path), atomic multi-file revert, batch mode, and a
rebuild-first verify. All 7 ledger rows reach a final status (6 `done`, F-4
`done-adapted`). 36 tool tests + the full 657-test JS suite green; `deno lint
scripts/` clean. Built TDD-first with a visible red→green SHA boundary per row;
all 26 slice01 tests stayed green throughout.

---

## Expected vs actual (honest summary)

**What rewiring covers (T1b scope):** after the core two-file move, `moveFunction`
globs `*.js` in `consumerDir` (default FROM's dir, excluding FROM/TO) and, for
each module importing the moved name from a specifier that **resolves by path**
to FROM, rewrites that import to TO (`rewriteImportSource`). A consumer importing
the name from a *re-exporter* (resolving elsewhere) is left alone (§2.3). Writes
cover FROM, TO, and every rewired consumer; on verify failure **all** of them
revert byte-exact. Batch (`--names`) processes left-to-right, atomic move+verify
per name, keep-green / revert-and-stop-on-red.

**Deferred (disclosed):** `--batch-verify-once` (verify only after all moves) is
**not implemented** — deferred to track C per spec §2.4. Atomic-per-name is the
default and gives clean bisection.

**Design call surfaced:** `runVerifyCommand` now runs the verify command via
`sh -c` (was whitespace-split exec). This is required for a rebuild-first verify
(`<lykn> build && deno test …`) — a single exec can't express `&&`. Still no
injected skip-gate flags; the command runs verbatim. (F-7.)

---

## The F-4 acceptance — what actually happened (read this)

The spec's literal acceptance — "move `andChain` from `surface.js` to
`surface-helpers.js`, rewiring `classifier.js`, full suite green" — **cannot be
performed on `release/0.6.x`**, because the M22-era architecture it assumes does
not exist on this branch:

- **No `classifier.js`.** `packages/lang/` is `compiler.js`, `expander.js`,
  `icu-parser.js`, `mod.js`, `reader.js`, `surface.js`. The
  surface/classifier/helpers split the M22 audit describes was worktree state
  (`.worktrees/compiler-coherence`) that never landed on `release/0.6.x`.
- **`andChain` is internal-only** (`surface.js:887`, not exported, 0 external
  consumers) — and its body references module-level free vars (`sym`, `array`),
  so it is not self-contained.
- **`surface-helpers.js` does not exist** (same finding as slice01).

So the **rewiring capability was demonstrated on the one real cross-file import
that does exist** — `surface.js` imports `toJsIdentifier` from `compiler.js`:

1. **Rewire mechanics (correct, on real code):** moving `toJsIdentifier`
   (compiler.js → a scratch `surface-helpers.js`) produced `consumers rewired: 1`
   — `surface.js:17` became `import { toJsIdentifier } from "./surface-helpers.js";`
   — plus a compiler.js back-import (it uses the helper internally), and the
   moved body was **byte-identical** to the original.
2. **Verify gate + atomic revert at scale:** the full rebuild-first move
   (`--verify-cmd "<lykn> build && deno test --config project.json -A test/"`)
   went **294 failures** — because `toJsIdentifier`'s body references module-level
   constants (`MACRO_OVERRIDES`, `PREDICATE_PREFIXES`) that a single-declaration
   move does not carry — and the tool **reverted all three touched files
   byte-exact** and exited non-zero. The gate works on real code.
3. Scratch branch discarded; `release/0.6.x` restored and rebuilt; suite 657/0.

**Disposition:** F-4 `done-adapted`. The cross-file rewiring *capability* is
verified (Layers 1–3 on fixtures + the toJsIdentifier real-corpus rewire); the
verify-gate/atomic-revert is verified at scale on real code. A **fully-green real
extraction is deferred to M22.5-2**, which must first build the surface/helpers
architecture and handle free-var dependencies (below).

---

## Bubble-up to arc04 (esp. for the real M22.5-2/-3 moves)

**1. Did slice02 deliver its assigned piece?** Yes — cross-file rewiring + batch +
atomic multi-file revert + rebuild-first verify. Closing slice02 **completes
arc04's tool build**; the extraction campaigns (M22.5-2/-3/-4) follow as their own
slices, executed *with* this tool.

**2. What slice02 revealed that the plan didn't anticipate — import shapes /
prerequisites the real extractions must handle:**

- **The M22 architecture must be (re)built first.** `classifier.js`,
  `surface-helpers.js`, and the exported surface helpers (`buildTypeCheck`,
  `emitMatchMacro`, …) the audit lists do **not** exist on `release/0.6.x`.
  M22.5-2 cannot "start with `andChain` → classifier.js rewire" until that split
  exists. **This is a hard prerequisite, not a detail.**
- **The tool moves bytes, not free-variable dependencies.** Both real helpers
  tried (`andChain` → `sym`/`array`; `toJsIdentifier` → `MACRO_OVERRIDES`/
  `PREDICATE_PREFIXES`) reference module-level bindings that don't travel with a
  single-declaration move. **M22.5-2 must, per helper, either (a) move the
  dependencies together, (b) ensure the destination file imports them, or (c)
  pick leaf helpers with no free vars.** The verify gate catches the breakage
  and reverts — but the *campaign* needs a dependency-ordering plan (the audit's
  "10 helpers, start with andChain" ordering should be validated against
  free-var graphs, not just consumer graphs).
- **Real import shape seen:** named imports only, **tab-indented** (e.g.
  `surface.js`), single-name-per-source in the cross-file case. No namespace/
  default/aliased cross-file imports were encountered in `packages/lang` — but
  the tool's rewrite path only handles **named** imports cleanly; a
  namespace/default consumer would need new handling (surface it if M22.5-2 hits
  one). `rewriteImportSource` reconstructs the named list (preserving `as`
  aliases) and is byte-minimal elsewhere.
- **Re-exporter consumers are correctly skipped** (§2.3) — relevant once
  `surface-helpers.js` re-exports exist again.

**3. Silent-drop diff at slice scale:** none. Scope-as-delivered == scope-as-spec,
with two disclosed items: `--batch-verify-once` deferred (allowed), and F-4
adapted to the corpus reality (capability proven, green-extraction deferred).

---

## Reproduce (for CDC)

```sh
cd /Users/oubiwann/lab/lykn/lang
deno test -A scripts/move-function.test.js          # expect: 36 passed | 0 failed
deno lint scripts/                                   # expect: exit 0
deno test --config project.json -A test/             # expect: 657 passed | 0 failed
# rewire mechanics on real code (no extraction lands — undo after):
git checkout -b scratch/verify-t1b
printf '// tmp\n' > packages/lang/surface-helpers.js
deno run -A scripts/move-function.js --from packages/lang/compiler.js \
  --to packages/lang/surface-helpers.js --name toJsIdentifier --verify-cmd "true"
grep -n toJsIdentifier packages/lang/surface.js     # → import { … } from "./surface-helpers.js"
git checkout -f release/0.6.x && git branch -D scratch/verify-t1b
rm -f packages/lang/surface-helpers.js && "$(pwd)/target/release/lykn" build
```
