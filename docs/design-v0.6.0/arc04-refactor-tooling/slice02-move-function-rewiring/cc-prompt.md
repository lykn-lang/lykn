# M22.5-T1b Implementation Prompt: `move-function.js` — Cross-File Rewiring + Batch

**From:** CDC (Cowork Claude, cdc/compiler-coherence thread)
**To:** CC (Claude Code, fresh session)
**Date:** 2026-05-23
**Branch:** `cdc/compiler-coherence` (worktree at `.worktrees/compiler-coherence/`)
**Depends on:** `M22.5-T1a` (the verbatim-move core) — **must be complete
and green before starting this.**
**Re:** Extend `scripts/move-function.js` so a move also rewires the
*other* modules that import the moved name, plus batch mode. This is what
makes the tool usable on the real M22.5-2/-3 corpus.

---

## 0. Read these first

1. `workbench/M22.5-T1a-move-function-core-prompt-2026-05-23.md` — the
   core spec. T1b extends that tool; re-read its §2 invariant, §3
   placement/deps, §4 algorithm, and §5 acorn notes. **All of those
   still hold unchanged.**
2. `scripts/move-function.js` and `scripts/move-function.test.js` as they
   exist after T1a — you are extending this code, not rewriting it.
3. `workbench/2026-05-18-M22-audit-report.md` — §C and the per-helper
   table. The audit is *why* cross-file rewiring is mandatory (see §1).
4. `LEDGER_DISCIPLINE.md` — TDD-first paired commits still apply.

Do **not** start coding until you have read these.

---

## 1. Why cross-file rewiring is mandatory (not optional polish)

The whole reason T1a's acceptance was restricted to a zero-external-
consumer helper is that the *real* helpers we need to move have external
consumers. Per the audit, `classifier.js` (line 8) imports straight from
`surface.js`:

```
import { buildSingleClauseFunc, buildMultiClauseFunc, instrumentYields,
  compilePattern, andChain, isPascalCase, buildTypeCheck, typeRegistry,
  getLiteralType, typeMatchesLiteral, parseKeywordClauses, emitMatchMacro,
  emitTypeMacro, emitGenfuncMacro } from "./surface.js";
```

If the tool moves `buildTypeCheck` to `surface-helpers.js` but leaves
`classifier.js` importing it from `surface.js`, the suite goes red (the
name no longer exports from `surface.js`) and the core's verify gate
reverts the move — making the tool useless for M22.5-2. T1b closes that
gap.

Every edit T1b makes is a mechanical specifier/string change: **no call
sites move, because the imported binding name is unchanged.** The full
test suite remains the backstop.

---

## 2. Functional spec (additions to the core)

### 2.1 New pure function

- `rewriteImportSource(text, name, oldSpecifier, newSpecifier) →
  newText` — remove `name` from the `import { ... } from
  "<oldSpecifier>"` statement (deleting that import entirely if its list
  empties) and add it to an `import { ... } from "<newSpecifier>"`
  (merging into an existing one if present, else creating a new import
  line after the last existing import). If `text` does not import `name`
  from `oldSpecifier`, return `text` unchanged.

Reuse T1a's `addNamedImport` internals where natural; do not duplicate
logic.

### 2.2 Consumer discovery + rewire (folded into `moveFunction`)

After the core's two-file move (T1a §4.2 steps 1–8) and **before** the
verify/write step, the move now also:

- Globs `packages/lang/*.js`, **excluding FROM and TO**.
- For each module, parses it and finds any `ImportDeclaration` whose
  resolved source path is FROM **and** whose specifiers include `name`.
- Applies `rewriteImportSource(module, name, <spec→FROM>, <spec→TO>)`,
  computing each module's correct relative specifier to FROM and to TO
  (resolve by **path**, not raw string — `"./surface.js"` from different
  directories must resolve correctly).
- Records every modified consumer file's original content for revert.

The write/verify/revert step (T1a §4.2 step 9) now covers FROM, TO, **and
every rewired consumer** atomically: on verify failure, all of them
revert to byte-original.

### 2.3 Scope boundary (unchanged from the combined spec)

The tool rewires imports *of the moved name from FROM*. It does **not**
chase transitive re-export chains beyond the single `stripReExport` the
core already does in TO. A module that imports `name` from a
*re-exporter* (e.g. from `surface-helpers.js`) rather than from FROM is
correctly left alone — the re-exporter still exports `name` (now via the
real definition the core moved in).

### 2.4 Batch mode

`--names a,b,c`: process names left-to-right, each as an **atomic
move+verify** (move one — including consumer rewiring — verify, keep if
green). Stop on the first failure (after reverting that one move) and
report which name failed. Atomic-per-name is the default because it gives
clean bisection when a dependency ordering is wrong.

A `--batch-verify-once` flag (verify only after all moves) is optional
and may be deferred to track C; if you skip it, say so in the closing
report.

---

## 3. Testing strategy (TDD-first, paired commits)

Extend `scripts/move-function.test.js`. All T1a tests must still pass.

### Layer 1 — `rewriteImportSource` unit tests

- Moves a name from one import source to another (both pre-existing).
- Creates the destination import when none exists.
- Deletes the origin import when its specifier list empties.
- No-op when the name isn't imported from `oldSpecifier`.
- Path-resolution: `"./surface.js"` vs `"../lang/surface.js"` from
  different directories resolve to the same module.

### Layer 2 — end-to-end with a consumer file

In a temp dir, write FROM, TO, **and a consumer** `.js` file that imports
the moved name from FROM. Run the move; assert:

- The byte-identity invariant (T1a §2) still holds for the moved body.
- The consumer now imports the name from TO; its other imports are
  untouched.
- A second consumer that imports the name from a *re-exporter* (not from
  FROM) is left unchanged.

### Layer 3 — batch + atomic revert

- Batch of two names where the second would break the build under a
  given ordering: assert the first is kept, the second reverts, the tool
  stops and names the failure.
- Atomic revert across multiple files: a single move that rewires two
  consumers, with a `--verify-cmd` that fails, reverts FROM, TO, and both
  consumers to byte-original.

### Layer 4 — acceptance: the real `andChain` move

On a **throwaway scratch branch** (this never lands as real extraction):

1. Move `andChain` from `surface.js` to `surface-helpers.js`. The tool
   must rewire `classifier.js`'s import (and any other real consumer it
   discovers) from `surface.js` to `surface-helpers.js`.
2. Run the **full** `deno test -A test/`. It must stay green.
3. Confirm the moved `andChain` body in `surface-helpers.js` is
   byte-identical to its pre-move body in `surface.js` (capture both via
   `git show` and diff — expect zero body difference).
4. `git reset --hard` / discard the scratch branch. No extraction lands.

Record the consumer files the tool rewired and the green test result in
the ledger row.

---

## 4. Ledger (M22.5-T1b)

TDD-first paired commits. Each row: test-only commit, then fix-only
commit. `Verify` is grep-/run-verifiable.

| Row | Description | Verify |
|-----|-------------|--------|
| T1b-1 | `rewriteImportSource` (Layer-1 unit tests, incl. path resolution). | Layer-1 tests green; all T1a tests still green. |
| T1b-2 | Consumer discovery + rewire folded into `moveFunction`; atomic multi-file revert (Layer-2 + Layer-3 revert test). | Layer-2 + multi-file-revert tests green. |
| T1b-3 | Batch mode (`--names`, atomic-per-name, stop-on-failure). | Layer-3 batch test green. |
| T1b-4 | Acceptance: scratch-branch `andChain` move with `classifier.js` rewiring, full suite green, body byte-identical, scratch discarded. | `deno test -A test/` green on scratch; rewired consumers + zero-body-diff recorded. |
| T1b-5 | `deno lint scripts/` clean; closing notes. | `deno lint scripts/` exits 0. |

Iteration budget: genuine engineering, not compliance theatre — standing
override applies.

---

## 5. Non-goals for T1b

- No TypeScript; no `astring` regeneration of moved bodies (T1a §2).
- No transitive re-export-chain chasing beyond the core's single
  `stripReExport` (§2.3).
- No scope-accurate rename/shadowing analysis.
- No actual M22.5-2/-3 extraction — T1b proves the rewiring on a scratch
  `andChain` move only. The real workstreams are separate prompts.
- No MCP server / LSP / Tree-sitter — track C.

---

## 6. Methodology reminders

- **TDD-first paired commits**, SHA boundary visible in `git log`. All
  T1a tests stay green throughout.
- **Surface design calls.** If consumer discovery turns up an import
  shape the spec didn't anticipate (namespace import, default import,
  re-export aliasing with `as`), raise it rather than guessing.
- **No evasion.** Fix the tool, not the test.
- **Closing report:** honest expected-vs-actual — what rewiring covers,
  the consumers rewired in the `andChain` acceptance, the zero-body-diff
  confirmation, anything deferred (e.g. `--batch-verify-once`), and any
  import shapes in `packages/lang/*.js` that will need handling when we
  run the real M22.5-2/-3 moves.

---

## 7. Acceptance criteria

Done when:

1. `scripts/move-function.js` gains cross-file rewiring + batch mode,
   still plain JS, `npm:acorn`-only, passes `deno lint`.
2. All T1a tests still pass; T1b Layers 1–3 pass via `deno test -A
   scripts/move-function.test.js`.
3. The Layer-4 `andChain` acceptance kept `deno test -A test/` green on a
   scratch branch with the moved body byte-identical, and the scratch was
   discarded (no real extraction landed).
4. Ledger rows committed as TDD-first pairs with visible SHA boundaries.
5. A closing report with an honest expected-vs-actual summary is in
   `workbench/`.

Go.
