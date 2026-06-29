# Finding D Implementation Prompt for CC — @lykn/lang Exports Field Gap

## Read this first

Finding D: `@lykn/lang`'s `exports` field in `packages/lang/deno.json` exposes sub-paths for `reader.js`, `compiler.js`, `expander.js`, and `surface.js` — but not `./mod.js`. `@lykn/testing/helpers.js` imports from `lang/mod.js` via the consumer's `"lang/"` prefix mapping. When the consumer maps `"lang/"` to `"jsr:@lykn/lang@X.Y.Z/"`, the resulting `"jsr:@lykn/lang@X.Y.Z/mod.js"` doesn't resolve because the package's exports field doesn't declare it.

Full context: `workbench/finding-d-lang-exports-gap-2026-05-12.md`. Read first.

This is **small scope** (one JSON line + one helpers.js function refactor). No design questions. Two-part structural fix.

---

## MUST framing

You MUST:

1. **Apply both Fix A and Fix B** below (Duncan called both). Fix A patches the package's exports field; Fix B makes `@lykn/testing` self-contained against the gap.

2. **Verify existing tests still pass.** No test should regress. The change is byte-equivalent at runtime: `lykn(source)` is reconstructed locally with the same expression `compile(expand(read(source)))` it had in `mod.js`.

3. **Land on the cdc/dep-ergonomics worktree alongside DD-50.7.** Both ship in 0.6.0; landing together makes the commit story clean.

4. **Write a short closing note** at `workbench/finding-d-closing-2026-05-12.md` — no full closing report needed (small scope), but document the diffs applied + verification output.

You MUST NOT:

1. **Skip Fix B.** "Structural fix only" leaves helpers.js depending on a sub-path that historically wasn't exposed. The defensive refactor decouples helpers.js from that fragility.

2. **Change the `lykn` function's behavior.** The local reconstruction MUST be `compile(expand(read(source)))`, byte-identical to `mod.js`'s definition. Verified via grep below.

3. **Auto-pass safety-bypass flags** to any tool.

---

## Fix A — `packages/lang/deno.json` exports field

**File:** `packages/lang/deno.json`

Add one entry to the `exports` object:

```diff
 "exports": {
     ".": "./mod.js",
+    "./mod.js": "./mod.js",
     "./reader.js": "./reader.js",
     "./compiler.js": "./compiler.js",
     "./expander.js": "./expander.js",
     "./surface.js": "./surface.js"
 },
```

That's the entire change for Fix A.

**Verification:**
- `cat packages/lang/deno.json | jq '.exports'` — should show 5 exports (was 4). The `./mod.js` entry present.
- `deno check --no-config packages/lang/mod.js` — should still pass.

---

## Fix B — `packages/testing/helpers.js` defensive refactor

**File:** `packages/testing/helpers.js`

Currently (lines 11–18):

```javascript
import { read } from "lang/reader.js";
import { compile as rawCompile } from "lang/compiler.js";
import {
  resetGensym,
  resetMacros,
  resetModuleCache,
} from "lang/expander.js";
import { lykn } from "lang/mod.js";
```

After the change:

```javascript
import { read } from "lang/reader.js";
import { compile as rawCompile } from "lang/compiler.js";
import {
  expand,
  resetGensym,
  resetMacros,
  resetModuleCache,
} from "lang/expander.js";

// Local `lykn(source)` — same definition as @lykn/lang's mod.js.
// Reconstructed here to decouple from the @lykn/lang sub-path exports
// (Finding D — see workbench/finding-d-lang-exports-gap-2026-05-12.md).
function lykn(source) {
  return rawCompile(expand(read(source)));
}
```

Three changes total:

1. **Add `expand` to the destructured import from `lang/expander.js`.** Insert at the top of the destructuring block.

2. **Remove `import { lykn } from "lang/mod.js";`.** Delete that line entirely.

3. **Add the local `lykn` function definition** immediately after the imports block, before its first use. Use the comment shown to flag the Finding-D context for future readers.

The function is used three times in helpers.js (verified by CDC: lines 27, 50, 61). All three call sites continue to work because the function signature is identical.

**Verification:**
- `grep -n "import.*lang/mod.js" packages/testing/helpers.js` — should return nothing.
- `grep -n "from \"lang/expander.js\"" packages/testing/helpers.js` — should show the imports include `expand`.
- `grep -nE "function lykn\\(" packages/testing/helpers.js` — should show the local function definition.

---

## Deliverable — verification + short closing note

Run these checks in order:

1. **Existing tests pass:**
   ```
   deno test -A --config project.json test/
   ```
   Capture: total tests passed, failures (should be 0).

2. **DD-50.7 tests still pass** (no regression):
   ```
   deno test -A --config project.json test/forms/dd-50.7.test.js
   ```
   Capture: 21 passed, 0 failed.

3. **Lint check:**
   ```
   deno lint packages/lang/ packages/testing/
   ```
   Capture: no warnings or errors.

4. **Mycelium re-verification** (sanity — these changes shouldn't affect mycelium's local-path flow, but confirm):
   Run the verify-finding-e script against the worktree binary:
   ```
   ./workbench/verify-finding-e-2026-05-12.sh --lykn-bin .worktrees/cdc-dep-ergonomics/target/release/lykn
   ```
   Capture: "✓ ALL CHECKS PASSED" verdict. No regression on DD-50.7 fixes.

5. **Write `workbench/finding-d-closing-2026-05-12.md`** — short closing note (~30–60 lines) covering:
   - Summary: Fix A and Fix B applied
   - Diffs applied (with file paths and line refs)
   - Verification output from steps 1–4
   - Substrate-rule compliance (no `--allow-*` flags; both compilers unaffected; tests pass)

---

## What this milestone does NOT cover

- **Publishing 0.5.3 or rolling into 0.6.0.** Duncan handles release sequencing.
- **Filing the GitHub ticket for issue #9 (scaffold-side fix).** Separate work; complementary; covered by `workbench/CC-prompt-create-gh-tickets-2026-05-10.md`.
- **Auditing other lykn packages for the same exports-field gap.** Suggested in `finding-d-lang-exports-gap-2026-05-12.md` §"Audit recommendation" but out of scope here. Logged for follow-up.

---

## Anticipated risks

- **Lint may complain about the local function definition.** Deno's lint may flag `function lykn(...)` if it expects all exports to be top-level. If lint fires, surface — don't paper over by adding `// deno-lint-ignore`.

- **The local `lykn` is now isolated from any future change to `mod.js`'s lykn function.** If `mod.js`'s `lykn` changes shape (e.g., gains a parameter), helpers.js's local reconstruction won't track that change. Document in the comment: this is intentional decoupling. If `mod.js`'s signature evolves, helpers.js's local reconstruction needs an explicit update.

---

## Discussion points for Duncan / CDC

The diffs are spelled out exactly. If they apply cleanly and the verification steps all green, the closing note can be terse. If anything unexpected surfaces (lint complaint, test failure, sub-path resolution still broken), surface BEFORE writing the closing note.

If the diffs apply cleanly, proceed. The closing note + verification output is the closure artifact.
