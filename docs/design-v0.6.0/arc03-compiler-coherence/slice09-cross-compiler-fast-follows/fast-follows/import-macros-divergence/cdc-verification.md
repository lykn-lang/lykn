# Import-Macros Divergence Diagnosis — CDC Review (Turn 1)

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/dd-58-or-similar-import-macros-divergence-diagnosis-2026-05-16.md`
**Reviewed at:** 2026-05-16
**Disposition:** **Direction (a) confirmed. Proceed to Turn 2.**
**Deliverable 2 status:** verified done at commit `7552886`.

---

## Substantive reframing: this is a Rust correctness bug

CC's diagnosis is structurally sound on all five questions, but the
framing in the closing report (and in any commit message) should
reflect what was actually surfaced: **the Rust compiler produces
broken JS for any source using `(import-macros ...)` with
`runtime-import`-declared dependencies.** The output would fail at
runtime with `ReferenceError`. This is a substantive correctness
bug, not just a "divergence between compilers."

The bug has been latent because:
- `lykn test` shells out to Deno + the JS compiler
  (`packages/lang/mod.js`), which handles `runtime-import` correctly
  (verified at `crates/lykn-cli/src/main.rs:fn compile_lykn_test_files`).
- The Rust compiler's broken output for these sources has never been
  exercised end-to-end at runtime.
- `compileBoth` couldn't reach this path until
  `--source-context-path` enabled relative-path testing.

This isn't trivia. It changes the framing of the fix from "improve
`compileBoth` reach" to "fix a latent correctness bug in the Rust
compiler that the new tooling just surfaced." Worth naming
explicitly in the closing report and commit message.

---

## Verification of CC's five claims

### Q1 — What diverges (verified) ✓

CC's side-by-side output is accurate. Verified that the testing
macro module declares `(runtime-import "jsr:@std/assert" ...)` at
`packages/testing/mod.lykn:12`. JS emits the resulting `import`
statement; Rust omits it. Macro expansion itself is identical.

### Q2 — Why each compiler does what it does (verified) ✓

**JS path verified:** `packages/lang/expander.js` lines 1418–1425
correctly detect `(runtime-import ...)` forms during
`loadMacroModule`, convert them to `(import ...)` forms, and push
them into the consumer's `remaining` forms via line 1345
(`remaining.push(...runtimeImports)`).

**Rust path verified:** independent grep
`grep -rn "runtime.import\|runtime_import" crates/` returns zero
matches in actual code (only fixture names in publishing tests
contain the string). CC's claim that the Rust expander has no
handling is empirically correct.

### Q3a — Runtime correctness (verified) ✓

The Rust output `Deno.test("x", () => assertEquals(1, 1))` references
`assertEquals` which is not imported anywhere. Running this JS in
Deno would produce `ReferenceError: assertEquals is not defined`.
CC's claim is correct.

**Q3a corollary independently verified:** `compile_lykn_test_files`
in `crates/lykn-cli/src/main.rs` uses
`packages/lang/mod.js` (or `jsr:@lykn/lang`) as the
compiler, not the Rust path. So `lykn test` has been masking the
Rust bug. The bug is invisible to `lykn test` users; visible only
to anyone using `lykn compile` to produce JS bundles that include
`import-macros`-using code.

### Q3b — Correctness-grade, not stylistic (verified) ✓

Confirmed: the output is broken at runtime. This is correctness-grade.

### Q4 — Direction (a) recommendation (approved) ✓

**Direction (a) — align Rust to JS — is the right call.** Reasoning
beyond what CC named:

- The JS behaviour matches user intent: `(runtime-import ...)` in
  the macro module exists precisely to declare "the macro
  expansion's output references these runtime symbols; they need
  to be imported when consumers use this macro." This is the
  designed semantics; Rust is missing the implementation.
- Direction (b) (drop the imports in JS) would be wrong because the
  imports ARE needed at runtime. JS users compiling via
  `lykn compile` and running their output would suddenly break.
- Direction (c) (the divergence is correct) is empirically false
  given the runtime breakage.

CC's implementation-shape claim (`process_single_import` return type
change to `Result<Vec<SExpr>, LyknError>`, mirroring the existing
`surface-macros` pattern; ~30–50 lines, 1 Rust file) is plausible.
Turn 2 will verify.

### Q5 — Scope estimate (plausible; Turn 2 will verify) ✓

1 file changed on the Rust side. 1 new test file. 0 JS changes.
The surface-macros precedent in `process_single_import` is the
right model — it already extracts a directive from the loaded
module and acts on it; runtime-import handling slots in as a
sibling case.

---

## Deliverable 2 (drive-by cleanup) — verified done

Commit `7552886` ("Remove dead compile_file_with_dts function"):

- `git show cdc/compiler-coherence:crates/lykn-cli/src/main.rs | grep -c "compile_file_with_dts"` → 0
- `git show cdc/compiler-coherence:crates/lykn-cli/src/compile.rs | grep -c "compile_file_with_dts"` → 0

Both the function definition and its caller (the now-refactored
path through `cmd_compile`) are gone. Deliverable 2 closes cleanly.

---

## Turn 2 acceptance criteria — unchanged

F-1.1 through F-1.3 from the implementation prompt remain in force
for Turn 2. The substantive criterion (F-1.1) is what to watch:
**`compile-both` converges on a source with `(import-macros ...)`**
exercising the directory-path resolution this work was designed to
enable.

---

## Methodology observations

### Methodology-positive behaviours

1. **CC's MUST-stop-and-surface compliance.** CC produced the
   diagnosis, named the recommendation, and explicitly waited for
   direction confirmation before implementing. This is exactly the
   gate the two-turn pattern is designed to enforce. Without the
   gate, CC would have implemented direction (a) by default — which
   would have been correct here, but the gate exists for the case
   where the canonical direction isn't pre-decided.

2. **CC's correctness-grade framing.** CC didn't soften the finding
   into "minor stylistic divergence." The diagnosis says clearly:
   "The Rust output is broken at runtime." This is the honest-
   engagement discipline working.

3. **CC's framing of the implementation shape.** "Modelled on the
   existing surface-macros pattern" — concrete reference to
   existing precedent, not invented architecture. Turn 2 should be
   bounded.

### The methodology-learning gate

The two-turn pattern (Turn 1 diagnosis-with-CDC-gate → Turn 2
implementation) demonstrably worked here. The substantive direction
was settled BEFORE implementation, not as a fast-follow finding
after. This is the structural fix for the M16-6 / F-4 "literal
criterion met, substantive gap" pattern.

Worth canonicalising: **when a fix could be implemented in
multiple directions AND the direction isn't pre-decided in the
prompt, use a two-turn pattern with a CDC-approval gate.** Adds
~1 iteration of ceremony; pays for itself by ensuring substantive
intent is established before implementation lands.

---

## Recommendation to CC

**Proceed to Turn 2. Direction (a) confirmed.** Specifically:

1. Modify `process_single_import` in `crates/lykn-lang/src/expander/pass0.rs`:
   - Change return type to `Result<Vec<SExpr>, LyknError>`.
   - Detect `(runtime-import ...)` forms in the loaded module (mirror the surface-macros extraction pattern).
   - Convert detected forms to `(import ...)` shape and return them.
2. Modify `process_import_macros` to collect the returned forms and push them into `remaining`.
3. Add the regression test at `test/forms/dd-52-import-macros-convergence_test.lykn` per F-1.1.
4. Run `make test`, `make test-lykn`, `./bin/lykn test test/forms/` per F-1.2. Counts must be ≥ post-source-context-path baseline.
5. Update the diagnosis doc with a "Resolution" section naming direction (a) and pointing at the implementing commit.
6. Reframe the closing report's language: this fixes a latent Rust correctness bug, not just a compileBoth-convergence issue.

---

## Open inputs for Duncan

1. **Approve direction (a)?** CDC has approved; CC awaiting Duncan's confirmation per the methodology framework (CDC reviews, Duncan ratifies).
2. **The "Rust correctness bug" reframing.** The closing report and any merge-commit message should name this as a latent correctness bug surfaced by the new tooling, not as "compileBoth convergence improvement." Worth your sign-off on the framing.
3. **Iteration count so far:** 1 of 5 (Turn 1 diagnosis only). Turn 2 will be iteration 2. Plenty of budget.
4. **Commit timing.** When you merge cdc/compiler-coherence into release/0.6.x, all M16 commits + a97e151 (source-context-path) + 7552886 (compile_file_with_dts cleanup) + Turn 2's commit land together. Sequencing your call.
