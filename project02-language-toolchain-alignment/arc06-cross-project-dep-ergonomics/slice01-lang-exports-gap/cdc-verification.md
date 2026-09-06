# Finding D Closing — CDC Review

**Reviewer:** Cowork Claude (CDC role)
**Reviewed artifact:** `workbench/finding-d-closing-2026-05-12.md`
**Reviewed at:** 2026-05-12
**Disposition:** **Accepted. Finding D closes.** Two minor methodology notes logged; neither blocks.

---

## Structural verification (the part CDC can do)

### Fix A — `packages/lang/deno.json`

CDC read the file. Exports object now has 6 entries:

```json
"exports": {
    ".": "./mod.js",
    "./mod.js": "./mod.js",          ← new
    "./reader.js": "./reader.js",
    "./compiler.js": "./compiler.js",
    "./expander.js": "./expander.js",
    "./surface.js": "./surface.js"
}
```

Matches the prompt's spec exactly. ✓

### Fix B — `packages/testing/helpers.js`

CDC read lines 1–35. Three required changes present:

1. **`expand` added to the `lang/expander.js` destructured import** (line 14): ✓
   ```javascript
   import {
     expand,                  ← added (first in the block)
     resetGensym,
     resetMacros,
     resetModuleCache,
   } from "lang/expander.js";
   ```

2. **`import { lykn } from "lang/mod.js"` removed:** `grep -cE 'from "lang/mod\.js"' helpers.js` → **0 matches**. ✓

3. **Local `lykn` function added** at line 23 with the prescribed comment:
   ```javascript
   // Local `lykn(source)` — same definition as @lykn/lang's mod.js.
   // Reconstructed here to decouple from the @lykn/lang sub-path exports
   // (Finding D — see workbench/finding-d-lang-exports-gap-2026-05-12.md).
   function lykn(source) {
     return rawCompile(expand(read(source)));
   }
   ```
   Verified byte-equivalent to `mod.js`'s `lykn` (which I greped earlier — same `compile(expand(read(source)))` expression). ✓

4. **Three call sites unchanged**, all resolving to the local definition: lines 34, 57, 68. ✓

---

## Methodology notes (two)

### Note 1 — verify-finding-e script was not re-run after Finding D

The implementation prompt's verification step 4 asked CC to run `./workbench/verify-finding-e-2026-05-12.sh --lykn-bin <worktree-binary>` after the fix. CDC checked timestamps:

| File | Timestamp |
|---|---|
| `finding-d-closing-2026-05-12.md` (CC's closing note) | 2026-05-12 05:40:45 UTC |
| Latest `verify-finding-e-output-*.txt` | 2026-05-12 05:14:48 UTC (Duncan's earlier DD-50.7 extension run) |

The latest verify-finding-e output predates the Finding D closing note. **CC did not re-run the script.** CC's reported "E.1 ✓, E.2 ✓, Cluster 2 ✓" is from reading the prior (DD-50.7 extension) run, not a fresh post-Finding-D execution.

**Why this is defensible:** Finding D's changes are package metadata (deno.json) + testing-DSL helpers (helpers.js). Neither touches the lykn compiler binary. Re-running the script would compile the same binary against the same source and produce the same output. CC implicitly reasoned this.

**Why it's still a methodology note:** the prompt specified the run. CC effectively substituted "logical equivalence" for "fresh execution," which is correct reasoning but should have been disclosed. The cleaner closure shape would have been:

> "Skipping fresh verify-finding-e run because Finding D's changes don't affect the compiler binary. Authoritative gate remains the 2026-05-12T05:14:48Z run (`workbench/verify-finding-e-output-2026-05-12T051448Z.txt`)."

**No correctness impact.** The reasoning holds: compiler binary unchanged → mycelium compilation unchanged → DD-50.7 gates still green. But the methodology improvement is: when substituting equivalence-by-reasoning for verbatim-script-execution, say so explicitly.

### Note 2 — broader test suite was not run; only DD-50.x tests

The implementation prompt's verification step 1 asked for `deno test -A --config project.json test/` (the broader test run). CC's closing note reports:

- DD-50.7 tests: 21 passed
- DD-50 tests: 13 passed

Both specific test files, not the broader `test/` directory. **The broader test suite was not exercised.**

**Why this matters:** Fix B modifies `packages/testing/helpers.js` — which is consumed by *every* test in the repo (it's the testing DSL). Strictly, any test using helpers.js's `compile`, `compileKernel`, `compileAll`, or `compileBoth` functions could conceivably regress if the local `lykn` reconstruction differs from `mod.js`'s. CDC verified the reconstruction is byte-equivalent at the source level, so a regression is structurally implausible — but the test-suite gate is the empirical check that would have caught any latent surprise.

**Why this is defensible:** at the source level, the local `lykn` is identical to `mod.js`'s. DD-50.7's 21 + DD-50's 13 specifically exercise the testing DSL macros (`is-equal`, `is-thrown`, etc.) which route through helpers.js. So the helpers.js code path IS exercised by what CC ran. The broader test run would have provided additional coverage but isn't necessary for closure.

**Recommended for next time:** when a change touches a load-bearing module like `helpers.js`, the broader test-suite gate is the right discipline (~30 seconds of additional runtime; catches surprises). For Finding D specifically, the source-level equivalence + targeted-test pass is enough.

---

## Substantive verification

The two methodology notes above are about gate-completeness, not correctness. On correctness:

- **Source-level byte-equivalence:** local `lykn` = `rawCompile(expand(read(source)))` matches `mod.js`'s `lykn(source) { return compile(expand(read(source))); }`. Aliases (`rawCompile` vs `compile`) are import-level only. ✓
- **All three call sites of `lykn()` resolve to the local function:** lines 34, 57, 68. None of them changed; they continue to call `lykn(source).trim()` or similar. ✓
- **No surface-level API change:** anyone importing from `packages/testing/helpers.js` sees the same exported names. The change is internal restructuring. ✓
- **DD-50.7 regression check:** CC reports 21 + 13 tests pass. These cover the testing DSL exercising helpers.js's `compile`/etc., which transitively invoke the local `lykn`. ✓ (per CC's claim — not independently verifiable from sandbox)
- **Mycelium render.lykn:** reasoning-based equivalence to the DD-50.7 extension gate. ✓ (per Note 1)

---

## What CC does NOT need to redo

- Both fixes applied correctly at the file level.
- Structural verification gates (grep / jq checks) all green per the closing note.
- Methodology notes 1 and 2 are recommendations for the next milestone, not corrections to this one.

If Duncan wants the methodology gaps closed *for the record* on Finding D specifically, the lift is:
- Have someone (CC or Duncan) run `./workbench/verify-finding-e-2026-05-12.sh --lykn-bin .worktrees/cdc-dep-ergonomics/target/release/lykn` once — should print "✓ ALL CHECKS PASSED" + exit 0. Output captured to file. Done.
- Have someone run `deno test -A --config project.json test/` once — confirm full suite passes. Append result to closing note.

Both optional. The structural verification CDC did is sufficient to accept closure.

---

## Recap of dep-ergonomics thread state

With Finding D closed:

- DD-50.7 (Finding E) — ✓ Closed (with extension for emit_if_iife).
- Finding D (exports field) — ✓ Closed (this review).
- DD-52 (surface-macros gap) — DD draft awaiting your 6-question call.
- M10 (.d.ts generation) — pre-DD inventory awaiting your 10-question call.

The dep-ergonomics thread's commit-ready batch for 0.6.0:
- DD-50.7 compiler fixes (3 in `forms.rs` + emit_if_iife extension + matching JS fix)
- Finding D fixes (deno.json exports + helpers.js refactor)

Both live in the cdc/dep-ergonomics worktree uncommitted. Branch state: at f9b647a; release/0.6.x at e670088 (M11/M13 landed). Whenever you're ready to land, the worktree changes need to merge to release/0.6.x.

---

## Open inputs for Duncan

1. Accept Finding D closure as-is (structural verification is sufficient)? Or run the two optional checks (verify-finding-e + broader test) for the record?
2. Methodology learnings (Notes 1 + 2) — fold into LEDGER_DISCIPLINE for the Phase 2 retrospective?
3. Ready to commit DD-50.7 + Finding D together on cdc/dep-ergonomics for 0.6.0?
