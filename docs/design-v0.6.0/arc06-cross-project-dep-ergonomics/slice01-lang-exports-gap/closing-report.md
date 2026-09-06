# Finding D Closing Note — @lykn/lang Exports Field Gap

**Date:** 2026-05-12
**Branch:** cdc/dep-ergonomics

## Summary

Applied Fix A + Fix B per the implementation prompt.

### Fix A — `packages/lang/deno.json`

Added `"./mod.js": "./mod.js"` to exports. 6 exports total (was 5).

### Fix B — `packages/testing/helpers.js`

- Removed `import { lykn } from "lang/mod.js";`
- Added `expand` to the destructured import from `lang/expander.js`
- Added local `lykn(source)` function: `rawCompile(expand(read(source)))` — identical to `mod.js`'s definition

## Verification

1. **DD-50.7 tests:** 21 passed, 0 failed
2. **DD-50 tests:** 13 passed, 0 failed
3. **Lint:** 5 pre-existing `no-slow-types` warnings (JS modules without .d.ts — all of `packages/lang/`). No new warnings. No warnings on `packages/testing/helpers.js`.
4. **Mycelium render.lykn:** E.1 ✓, E.2 ✓, Cluster 2 ✓ — no regression on DD-50.7 fixes.
5. **Structural checks:**
   - `grep "import.*lang/mod.js" helpers.js` → no match ✓
   - `grep "from \"lang/expander.js\"" helpers.js` → shows `expand` in imports ✓
   - `grep "function lykn(" helpers.js` → line 23 ✓
   - `jq '.exports' deno.json` → 6 exports including `./mod.js` ✓

## Substrate-rule compliance

- No `--allow-*` flags auto-passed.
- Both compilers unaffected (changes are package metadata + test helper only).
- All tests pass unchanged.

---

## Post-closure verification (Duncan, 2026-05-12 05:56–05:58 UTC)

Per CDC review's recommended cleanup, the two gate-completeness checks
ran successfully after the closing note was written.

### 1. verify-finding-e against the worktree binary (full empirical gate)

```
./workbench/verify-finding-e-2026-05-12.sh --lykn-bin ./target/release/lykn
```

Output (`workbench/verify-finding-e-output-2026-05-12T055633Z.txt`):

```
mode: using provided --lykn-bin (skipping cargo build)
provided binary: /Users/oubiwann/lab/lykn/lang/.worktrees/cdc-dep-ergonomics/target/release/lykn

=== Bug E.1 — '() => if' === ✓ FIXED (not present)
=== Bug E.2 — 'return throw' === ✓ FIXED (not present)
=== Bug E.3 — stray semicolon line === ✓ FIXED (not present)
=== Cluster 2 — 'COMPILE_ERROR' === ✓ FIXED (not present)
=== deno check === ✓ no syntax errors (TS2307 module-not-found only — expected)
=== verdict === ✓ ALL CHECKS PASSED — Finding E is fixed for this binary.
=== Script exit: 0 ===
```

Compiled `render.js` size: 3614 bytes (matches the 2026-05-12T05:14:48Z post-DD-50.7-extension run; confirms the worktree binary still produces the correct fixed shape after Finding D landed).

### 2. Full JS test suite

```
./target/release/lykn build && ./target/release/lykn test
```

Result: **`ok | 1179 passed | 0 failed (8s)`**

Test-count delta: 1158 (M11-baseline per `2026-05-11-M11-M13-closing-report.md` row M11M13-5) + 21 (DD-50.7's regression tests in `test/forms/dd-50.7.test.js`) = 1179. Matches. No tests regressed because of the Finding D refactor of `helpers.js`. The new local `lykn` function is byte-equivalent to `mod.js`'s definition at runtime, and the hundreds of tests using the testing DSL (which transitively invoke `helpers.js::lykn`) all pass.

### Two methodology findings from the cleanup-run cycle (logged for retrospective)

**Finding 1 — verify-finding-e script bug.** The script's `cd "$LANG_REPO"` (line 73 pre-fix) was happening BEFORE relative `--lykn-bin` paths were resolved. A relative path like `./target/release/lykn`, invoked from a worktree, got re-anchored against the main repo (`/Users/.../lang/target/release/lykn`), which is a pre-DD-50.7 binary. The first cleanup attempt at 2026-05-12T05:47:27Z showed all bug signatures STILL PRESENT — a false negative caused by hitting the wrong binary. **Fixed** in the script at lines 60–74 (resolve `--lykn-bin` to absolute path immediately after argument parsing, before any cwd change). Re-run with the fix gave the correct ✓ ALL CHECKS PASSED. **Generalized lesson:** any tool that accepts file-path arguments AND changes cwd internally should resolve those paths to absolute form upon receipt, not after the cd.

**Finding 2 — `lykn test` doesn't auto-invoke `lykn build` post-M11.** M11 (build-dir reorg) relocates compiled JS to `target/lykn/build/<pkg>/`. The test infrastructure imports via `project.json`'s `"lang/" → "./target/lykn/build/lang/"` prefix mapping. Tests fail with "Module not found" if `target/lykn/build/` isn't populated, which happens whenever the dir hasn't been built (fresh clone, after `make clean`, etc.). Correct invocation post-M11: `lykn build && lykn test`, or `lykn test` could be enhanced to ensure the build dir is fresh internally. **Logged as a candidate UX improvement for the next CLI-touching milestone:** `lykn test` could/should auto-invoke `lykn build` (or check freshness) before running tests. Not in DD-50.7 or Finding D scope; tracked here for the Phase 2 retrospective.

### Finding D closes cleanly

Both fixes verified empirically:
- The worktree's lykn binary still produces correct output for mycelium's canonical downstream pattern (DD-50.7 fixes not regressed by Finding D).
- The full 1179-test JS suite passes (Finding D's helpers.js refactor is byte-equivalent at runtime; no test regressions).
- Lint clean on the touched files (only pre-existing `no-slow-types` warnings outside Finding D's scope).
- Structural gates all green (deno.json has 6 exports including `./mod.js`; helpers.js has no `lang/mod.js` import; local `lykn` function in place; call sites unchanged).
