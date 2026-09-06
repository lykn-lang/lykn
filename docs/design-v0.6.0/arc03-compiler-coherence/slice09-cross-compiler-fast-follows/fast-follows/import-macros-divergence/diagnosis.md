# import-macros Output Divergence — Diagnosis

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Status:** diagnosis complete, awaiting CDC direction confirmation

---

## Q1 — What exactly diverges?

**Source:**
```lykn
(import-macros "./packages/testing" (test is-equal))
(test "x" (is-equal 1 1))
```

**JS compiler output:**
```js
import {assert, assertEquals, assertNotEquals, assertStrictEquals, assertExists, assertThrows, assertRejects, assertMatch, assertStringIncludes, assertArrayIncludes, assertObjectMatch} from "jsr:@std/assert";
Deno.test("x", () => assertEquals(1, 1));
```

**Rust compiler output:**
```js
Deno.test("x", () => assertEquals(1, 1));
```

**Precisely what differs:** The JS compiler emits an `import {...} from "jsr:@std/assert"` statement at the top of the compiled output. The Rust compiler does not. The macro expansion itself (`Deno.test(...)`, `assertEquals(...)`) is identical between compilers.

---

## Q2 — Why does each compiler do what it does?

### JS expander — emits runtime imports

In `packages/lang/expander.js`:

1. **`loadMacroModule`** (line 1359) loads the macro module's `.lykn` source, parses it, and classifies its forms. Forms with head `runtime-import` (lines 1418-1425) are collected into a `runtimeImports` array and converted to `(import ...)` forms.

2. **`pass0ImportMacros`** (line 1271) calls `loadMacroModule` and then at **line 1345** pushes `runtimeImports` into the consuming file's remaining forms:
   ```js
   remaining.push(...runtimeImports);
   ```

3. The `@lykn/testing` module's `mod.lykn` (line 12) declares:
   ```lykn
   (runtime-import "jsr:@std/assert"
     (assert assert-equals assert-not-equals ...))
   ```
   This tells the JS expander: "when a consumer imports macros from this module, also emit this import in their output."

### Rust expander — omits runtime imports

In `crates/lykn-lang/src/expander/pass0.rs`:

1. **`process_single_import`** (line 319) loads the macro module, recursively processes its `import-macros`, extracts `surface-macros` directives, and passes the rest to `compile_local_macros`.

2. **There is no handling for `(runtime-import ...)` forms** anywhere in the Rust expander. `grep -rn "runtime.import" crates/` returns zero matches. The `(runtime-import ...)` form in `mod.lykn` falls into the "non-surface-macro, non-macro" bucket (`non_surface_forms` starting at line 402) and is passed to `compile_local_macros`, which treats it as a regular form to compile — but since it's not a macro definition, it's effectively discarded (it doesn't produce a compiled macro and doesn't get emitted anywhere).

3. The Rust expander's `process_single_import` returns `Ok(())` — it doesn't return any forms to inject into the consuming file. The function signature is `-> Result<(), LyknError>`, not `-> Result<Vec<SExpr>, LyknError>`. There is no mechanism for the Rust expander to inject forms from a macro module into the consumer's output.

---

## Q3 — Which is correct?

### Q3a — Runtime correctness

**The Rust output is broken at runtime.** The compiled JS references `assertEquals` (from the macro expansion), but `assertEquals` is not imported — there's no `import` statement. When Deno runs this output, it will fail with `ReferenceError: assertEquals is not defined`.

The reason this hasn't been caught: the Rust compiler is only used via `lykn compile` (to produce JS source). The typical workflow is `lykn compile foo.lykn -o foo.js`, then `deno run foo.js`. Tests that use `import-macros` are run via `lykn test`, which uses the **JS compiler** (not Rust) to compile test files before running them in Deno. So the Rust compiler's broken output for `import-macros`-using sources has never been exercised at runtime.

However, `compileBoth` compares the output of both compilers — and the difference is real and substantive.

### Q3b — Stylistic vs. correctness

**This is correctness-grade, not stylistic.** The Rust compiler produces output that would fail at runtime if executed. The JS compiler produces correct output. The divergence is not about formatting or whitespace — it's about missing import declarations that are required for the compiled code to run.

---

## Q4 — Direction recommendation

**Direction (a): Align Rust to JS — Rust starts emitting the macro module's runtime imports.**

Reasoning:
1. The JS compiler's behavior is correct — `runtime-import` exists precisely to declare "these imports are needed at runtime by the macro's expanded output." Omitting them produces broken JS.
2. The Rust expander already handles `surface-macros` directives in macro modules (DD-52). Adding `runtime-import` handling is the same pattern: extract a directive from the macro module and propagate its effect to the consumer.
3. No backward-compat concerns — the Rust output today is *broken* for sources using `import-macros` with `runtime-import` declarations. Adding the missing imports can only make things more correct.

Direction (b) (align JS to Rust — stop emitting imports) is wrong because the imports ARE needed at runtime.

Direction (c) (neither) doesn't apply — both compilers should produce runnable JS.

**Implementation shape:** Modify `process_single_import` in pass0.rs to:
1. Change the return type to `Result<Vec<SExpr>, LyknError>` (to return runtime-import forms to the caller).
2. Detect `(runtime-import ...)` forms in the loaded module (same pattern as `surface-macros` detection).
3. Convert them to `(import ...)` forms and return them.
4. Have `process_import_macros` collect these and include them in its `remaining` output.

---

## Q5 — Implementation scope estimate

**1 file changed on the Rust side:** `crates/lykn-lang/src/expander/pass0.rs`.

Changes:
- `process_single_import`: change return type, add runtime-import extraction, return collected forms.
- `process_import_macros`: collect returned forms from `process_single_import` and push to `remaining`.
- Add a helper to detect and convert `(runtime-import ...)` forms.

Estimated ~30-50 lines of new code, modeled on the existing `surface-macros` detection pattern.

**1 new test file:** `test/forms/dd-52-import-macros-convergence_test.lykn` using `compile-both` on an `import-macros` source.

**0 JS changes.** The JS compiler already does the right thing.

---

## Resolution

**Direction (a) confirmed by CDC and implemented.** Commit `56894c7`.

The Rust expander now extracts `(runtime-import ...)` forms from macro
modules and emits them as `(import ...)` in the consuming file, matching
the JS expander's behavior. The `ModuleCache` was extended to store
runtime imports alongside compiled macros for correct caching.

`compileBoth` converges on `import-macros` sources — verified by
`test/forms/dd-52-import-macros-convergence_test.lykn`.
