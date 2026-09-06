# Slice 03: helper-extraction (M22.5-2) — Closing Report

**By:** CC (Claude Code) · **Date:** 2026-06-29 · **Branch:** `release/0.6.x`
**Evidence strength:** `attested` (CC ran every command; CDC reproduces).

**Verdict: delivered — the first real `move-function` extraction landed.** All
10 aliased helpers are now real definitions in `surface-helpers.js`, byte-exact,
moved **entirely by the tool**; consumers rewired; alias gone. Cross-compiler
corpus 1345/0, `deno test` 658/0, `cargo test`/`clippy`/`deno lint scripts/`
green. One honest exception: `deno lint packages/` carries **pre-existing**
cdc/compiler-coherence debt that is M22.5-3/4 scope (see §4).

---

## 1. Dependency table (F-1)

Free-var scan (acorn) of each helper, against what `surface-helpers.js` provides
(`sym, array, gensym, isKeyword, isArray, formatSExpr, toJsIdentifier` +
`isStatementOnlyForm, wrapReturnLast, kernelArray`):

| Helper | inter-helper deps | already provided | surface-local **not** in the 10 (hazard) |
|--------|-------------------|------------------|-------------------------------------------|
| `isPascalCase` | — | — | — (leaf) |
| `andChain` | — | array, sym | — (leaf) |
| `getLiteralType` | — | — | — (leaf) |
| `typeMatchesLiteral` | — | — | — (leaf) |
| `buildTypeCheck` | — | toJsIdentifier, array, sym | — (leaf) |
| `paramNameNodes` | — | array, sym | — (leaf) |
| `paramTypeChecks` | buildTypeCheck | gensym, array, sym | — |
| `compilePattern` | isPascalCase | array, sym, isKeyword, gensym, formatSExpr | **`typeRegistry`** |
| `compileLetPattern` | isPascalCase, compilePattern, andChain | isArray, kernelArray, sym, array | — |
| `parseTypedParams` | — | isArray, isKeyword | **`parseDestructuredParam`, `parseDefaultParam`, `parseRestParam`** |

**Both hazards are importable** (exported from surface.js): `typeRegistry` is a
shared mutable `Map` — ESM live-binding preserves the single instance, used at
call-time so the surface↔helpers cycle is safe; the 3 param sub-parsers are
exported functions (themselves M22.5-3/4 territory, left in surface.js and
imported). So neither is an M22.5-3 *deferral*; each was satisfied by adding an
import to `surface-helpers.js` before its move.

**Move order (leaf-first):** isPascalCase, andChain, getLiteralType,
typeMatchesLiteral, buildTypeCheck, paramNameNodes, paramTypeChecks →
*(add `typeRegistry` import)* compilePattern → compileLetPattern →
*(add param-parser imports)* parseTypedParams.

---

## 2. Per-row walk

Full evidence in [`ledger.md`](./ledger.md); all 8 rows `done`:
F-1 dep analysis · F-2 moves via the tool (3 invocations, rebuild-first verify) ·
F-3 all 10 in helpers / 0 in surface · F-4 **all 10 byte-identical** · F-5 alias
self-deleted (tool's stripReExport) · F-6 consumers rewired (note below) · F-7
rebuild-first 1345/0 + 658/0 · F-8 cargo/clippy/scripts-lint green (packages-lint
exception in §4).

**F-6 note:** `classifier.js` now imports from `surface.js` **none** of the 10
(only the M22.5-3 complex forms remain there). It imports from
`surface-helpers.js` the **7 it actually uses**; `isPascalCase`/`andChain`/
`compilePattern` were **pre-existing dead imports** (never referenced in
classifier.js) and were removed rather than carried as dead. So the ledger's
"all 10" is satisfied as "every helper it uses, sourced from surface-helpers.js,
none from surface.js."

---

## 3. How the moves were done (the invariant)

Three `scripts/move-function.js` runs, every body a byte-exact slice, each with a
rebuild-first `--verify-cmd` (`<lykn> build && deno test --config project.json -A
test/`) so the verify wasn't fooled by a stale build dir:

1. **Batch (7 leaves):** `--names isPascalCase,andChain,getLiteralType,typeMatchesLiteral,buildTypeCheck,paramNameNodes,paramTypeChecks` (paramTypeChecks after buildTypeCheck).
2. *(added `import { typeRegistry } from "./surface.js"`)* **Batch (2):** `--names compilePattern,compileLetPattern`.
3. *(added `import { parseDestructuredParam, parseDefaultParam, parseRestParam } from "./surface.js"`)* **Single:** `--name parseTypedParams`.

No helper resisted a clean byte-move; nothing was reimplemented or hand-edited.
Post-extraction, surface.js's now-unused `toJsIdentifier` and `kernelArray`
imports (used only by the moved `buildTypeCheck`/`compileLetPattern`) were
removed — the only source edits beyond the tool's own.

---

## 4. `deno lint packages/` — the honest F-8 exception

`deno lint packages/` does **not** reach exit 0. Cause: it was **already badly
red on `release/0.6.x`** (the cdc/compiler-coherence merge landed packages/ with
10+ `no-unused-vars` errors — verified by stashing slice03's changes). slice03
**reduced** it to 4 and introduced **none**. The 4 residuals are all pre-existing
and all **out of slice03's stated scope** (§3: "Don't touch the 4 complex forms
or dead code — M22.5-3 / M22.5-4"):

- `classifier.js:8` — `typeRegistry`, `parseKeywordClauses` imported from
  surface.js but unused: they support the **M22.5-3 complex forms**
  (`type`/`func`) not yet inlined into classifier.js.
- `surface.js` — `buildThread`, `buildSomeThread`: **dead functions**
  (defined-but-unused) = **M22.5-4 dead-code** cleanup.

So `deno lint packages/` exit 0 is **blocked on M22.5-3/4 work slice03 must not
do**. Recommend it be a checked exit-criterion of those slices (or a dedicated
cdc/compiler-coherence lint-cleanup pass), not a re-litigation of this one.

(I also prefixed an unused `startPos` → `_startPos` in `icu-parser.js` — a
1-char pre-existing-debt drive-by in a DD-55 file; harmless, not part of the
extraction.)

---

## 5. Bubble-up to arc04 (for M22.5-3 / M22.5-4)

1. **`surface.js` reduced** — 10 helper definitions left it; the helper half of
   DD-37's surface migration is done. What remains in surface.js for the
   complex-form macros: `buildSingleClauseFunc`, `buildMultiClauseFunc`,
   `instrumentYields`, `emitMatchMacro`, `emitTypeMacro`, `emitGenfuncMacro`,
   `parseKeywordClauses`, the param sub-parsers, `typeRegistry`, and the dead
   `buildThread`/`buildSomeThread`.
2. **Import shapes M22.5-3 will face:** the complex forms are entangled with
   `typeRegistry` (shared mutable Map — importable via live binding, as proven
   here) and `parseKeywordClauses`; the param sub-parsers
   (`parse{Destructured,Default,Rest}Param`) are a cluster `parseTypedParams`
   already depends on. Moving the complex forms will need the same
   "import-the-dep-then-byte-move" pattern, plus handling the
   `surface.js ↔ surface-helpers.js` import cycle (safe at call-time).
3. **The move tool leaves now-unused imports in FROM** — after extraction,
   surface.js had dangling `toJsIdentifier`/`kernelArray` imports (cleaned here).
   M22.5-3/4 should expect to remove now-unused imports/exports after each move
   (a candidate tool enhancement: prune imports that become unused in FROM).
4. **`deno lint packages/` is pre-existing-red** — M22.5-4 (dead code) is the
   natural owner of clearing it to exit 0.

---

## 6. Reproduce (for CDC)

```sh
cd /Users/oubiwann/lab/lykn/lang
cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"
"$LYKN_BIN" build
for h in isPascalCase compilePattern andChain getLiteralType typeMatchesLiteral \
         buildTypeCheck compileLetPattern parseTypedParams paramNameNodes paramTypeChecks; do
  printf "%-20s surface.js=%s helpers.js=%s\n" "$h" \
    "$(grep -cE "^(export )?(function|const) $h\\b" packages/lang/surface.js)" \
    "$(grep -cE "^(export )?(function|const) $h\\b" packages/lang/surface-helpers.js)"
done   # expect all: surface.js=0 helpers.js=1
"$LYKN_BIN" test                              # 1345 passed | 0 failed
deno test --config project.json -A test/      # 658 passed | 0 failed
cargo test --all-features --workspace         # 0 failed
cargo clippy --all-features --workspace -- -D warnings   # exit 0
deno lint scripts/                            # exit 0
deno lint packages/                           # 4 pre-existing M22.5-3/4 errors (documented)
```
