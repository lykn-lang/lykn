# Milestone M20: DD-58 Phase 1.5 — Kernel Test Corpus + `.lyk` Runner Support

> **Status:** open
> **Iteration budget:** 5 (expect 3–4 — substantial scope; per-form
> authoring + runner extension + audit)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [DD-58](../../docs/design/05-active/0059-dd-58-*.md) Phase 1.5 — coverage completion. Closes the substrate gap surfaced by M19-2's audit.
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** DD-58 Phase 1 complete (M17 + M18 + polish + M19). M19 closing report at `workbench/2026-05-17-M19-closing-report.md`; CDC review at `workbench/2026-05-17-M19-closing-cdc-review.md`.

---

## IMPORTANT: 2026-05-17 quote/quasiquote correction (read before resuming M20)

While CC was doing M20 audit work, the audit's "NOT FOUND" finding
for `quote`/`quasiquote` surfaced a substantive CDC framing error:
those two forms were incorrectly listed as kernel-only in DD-58.
Duncan caught the error; CDC corrected it. **Before resuming M20
work, CC must read the DD-58 refinement-log entry "2026-05-17
(quote/quasiquote correction)" and the ripple changes below.**

**What changed:**

- DD-58 kernel-only namespace shrinks from 6 forms to 5:
  `function`, `function*`, `const`, `let`, `var`. The unifying
  property is now "JS declaration / binding constructs" —
  uniformly.
- `quote`, `quasiquote` are moved to flavor (b) passthrough under
  a new "Macro / quoting" category. They're surface-accessible
  because `packages/lang/reader.js` produces them from reader
  macros: `'expr` → `(quote expr)`, `` `expr `` → `(quasiquote
  expr)`.
- `unquote`, `unquote-splicing` are enumerated in DD-58's flavor
  (b) "Macro / quoting" for completeness, but NOT added to
  `is_surface_form_strict` — they're partial forms only meaningful
  inside quasiquote; at top level they fall through to the
  FunctionCall / user-macro path (same as lax mode).
- `crates/lykn-lang/src/classifier/dispatch.rs` updated:
  - `is_kernel_only_form` drops `"quote" | "quasiquote"` from its
    matches!.
  - `is_surface_form_strict` adds `"quote"` and `"quasiquote"`
    under "Macro / quoting" category.
- `crates/lykn-lang/src/classifier/forms.rs` updated:
  - The polish-era test `test_strict_mode_diagnostic_quote_class`
    is inverted into TWO tests:
    `test_strict_mode_quote_passes_as_surface_form` and
    `test_strict_mode_quasiquote_passes_as_surface_form`.
  - The kernel-only diagnostic match's `_` fallback arm is now
    technically unreachable (kept for forward-compatibility,
    rephrased to not say "no surface alternative").

**Effect on M20 work:**

- **M20-5 (kernel-only-form tests) drops from 6 files to 5.**
  The five files are: `function_test.lyk`, `function-star_test.lyk`
  (or `function-generator_test.lyk` — CC's choice on file naming),
  `const_test.lyk`, `let_test.lyk`, `var_test.lyk`.
- **M20-6 (flavor (b) representative sample) gains TWO MANDATORY
  files**: `quote_test.lyk` and `quasiquote_test.lyk`. These are
  not optional — their reader-macro entry points make them
  universally reachable from surface code, so they're required
  coverage. The remaining flavor (b) samples (async op, module
  form, control-flow, arithmetic, comparison, literal constructor)
  stay as drafted.
- **If CC already authored a `quote_test.lyk` or similar in the
  pre-correction draft, no change needed — those tests are still
  valid (`.lyk` kernel mode allows quote/quasiquote naturally).**
  If CC authored a strict-rejection test for quote in any `.lykn`
  file, that test needs inversion or removal — surface to CDC if
  uncertain.
- **M20-2 design-confirmation doc** should reference the
  corrected count (5 kernel-only forms, not 6) in its acknowledgment.
- **M20-9 (M19-4 negative-direction enforcement test)** should
  NOT use quote as the rejected-form example. Use `const` or
  `function` instead, since those remain kernel-only.

---

## Why this milestone exists

M19's audit established that the test corpus has **zero source-level
kernel-only forms** in `.lykn` test files. All kernel-form exercise
happens through one of three indirect routes:

1. **Transitively** through surface tests that compile down to kernel
   forms (e.g., `bind` → kernel `const`).
2. **Runtime-evaluated** through `(compile "...")` and
   `(compile-kernel "...")` string arguments — strings are
   compiled at test runtime, bypassing the strict classifier.
3. **Rust unit tests** in `crates/lykn-lang/tests/` that exercise the
   classifier API directly.

**There are zero `.lyk` (kernel-extension) test files** — only five
`.lyk` example files in `examples/kernel/`. The kernel layer is the
substrate of the language; DD-58 made it an intentional sub-namespace;
it has no first-class source-level test coverage. This is a
substantively thin substrate.

M20 closes the gap:

- **Adds `.lyk` runner support** so the test runner can classify
  and compile `.lyk` test files in kernel mode.
- **Adds the `test/kernel/` directory** with conventions matching
  `test/forms/` and `test/surface/`.
- **Authors per-kernel-only-form `.lyk` test files** (five tests,
  one per kernel-only form in DD-58's enumeration: `function`,
  `function*`, `const`, `let`, `var`). Note: this count was
  corrected from six to five after the 2026-05-17 quote/quasiquote
  refinement (see DD-58 refinement log); those two forms are now
  flavor (b) passthrough, not kernel-only, and get coverage as
  part of the flavor (b) representative sample.
- **Adds representative coverage for flavor (b) passthroughs**.
- **Folds in the M19-4 negative-direction test** (the missing
  TDD-first piece from M19's CDC review).
- **Audits `(compile "...")` strings** to record per-case disposition
  — keep, supplement, or both.

This milestone does **not**:

- Migrate `(compile "...")` strings out of existing surface tests.
  The runtime-compile pattern is a separate coverage layer; M20 is
  additive.
- Turn strict-mode-on-by-default for production code (M21+ scope,
  DD-58 Phase 4).
- Modify the JS compiler.
- Modify the dispatch tables in `forms.rs` / `dispatch.rs`.
- Address the lambda emission divergence (DD-58 Breaking Change #3
  — separate codegen milestone, Phase 5 scope per Duncan
  2026-05-17).

---

## Design calls (decided in CDC drafting; flag dissent before M20 starts)

These are baked into the spec below. CC should treat them as
binding unless Duncan over-rules; if CC's preflight surfaces a
reason to revisit any, STOP and surface to CDC.

1. **`.lyk` classifier mode: kernel-only post-expansion.** Macros
   expand normally (so `(import-macros ...)` works in `.lyk`
   files). Post-expansion, only `is_kernel_form()` atoms are
   accepted as form heads. Surface forms (`bind`, `func`, `match`,
   etc.) at the top of a `.lyk` form post-expansion are a category
   error — diagnosed with "X is a surface form; use `.lykn` for
   surface code or use kernel form Y instead."

2. **Test directory: `test/kernel/`** mirroring `test/forms/` and
   `test/surface/`. Conventions follow `test/forms/`.

3. **Test-per-file shape: single-form-per-file.** One test file per
   kernel form. File names: `<form>_test.lyk` (e.g.,
   `function_test.lyk`, `const_test.lyk`). Matches `test/forms/`
   convention.

4. **`compileBoth` for kernel forms where both compilers implement
   them.** Single-compiler tests where only one does. The
   `compileBoth` helper at `packages/testing/helpers.js` already
   exists from M16; it should work for kernel forms once the
   runner classifies `.lyk` files.

5. **Compile-string audit disposition: ADDITIVE, not migration.**
   `(compile "...")` and `(compile-kernel "...")` strings in
   existing `.lykn` tests stay; they test the dynamic-compilation
   API and are correct in that role. M20 ADDS source-level
   `.lyk` tests for kernel-form static classification — a second
   coverage layer with different semantics.

6. **Flavor (b) passthrough coverage: representative, not
   exhaustive.** Kernel-only forms (6: `function`, `const`, `let`,
   `var`, `quote`, `quasiquote`) get exhaustive coverage. Flavor
   (b) passthroughs (many — async ops, module forms, arithmetic,
   comparison, control flow, etc.) get representative samples; the
   rationale (which subset, why) is recorded in the test-conventions
   doc. Remaining passthrough coverage can land in a follow-up
   milestone if needed.

7. **M19-4 negative-direction test folded into M20-9.** The missing
   piece from M19's CDC review — a regression test that a `.lykn`
   file with a bare `(const x 1)` is REJECTED by the runner under
   strict mode. Lives in `crates/lykn-cli/tests/` as an integration
   test of `compile_lykn_test_files`.

---

## Spec (substantive intents)

1. **`.lyk` runner code path exists** and routes `.lyk` files
   through a kernel-only post-expansion classifier.

2. **`test/kernel/` directory exists** with conventions
   documentation and at least one `.lyk` test file per kernel-only
   form.

3. **All tests pass** in both old `.lykn` paths and new `.lyk`
   paths. Counts strictly ≥ post-M19 baseline.

4. **Backward-compat preserved.** Production `lykn compile` paths
   unchanged. `.lykn` test classification unchanged.

5. **Audit doc** at `workbench/verify/m20/compile-string-audit.md`
   records per-case disposition for the ~20 `(compile "...")`
   string occurrences M19-2 surfaced.

6. **DD-58 Coverage section** added — a short §"Test discipline"
   subsection in DD-58 records the kernel-coverage spec (every
   kernel-only form gets a `.lyk` test; flavor (b) passthroughs
   get representative coverage).

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md) — subagent rules
3. [`assets/ai/AGENTS.md`](../../assets/ai/AGENTS.md) "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"Per-layer form enumeration" — kernel-only set + flavor (b)
   - §"The `kernel:<form>` escape" — kernel sub-language identity
   - §"Refinement log" — recent revisions including 2026-05-17 Phase 1 polish entry
5. **M19 closing report + CDC review:**
   - `workbench/2026-05-17-M19-closing-report.md`
   - `workbench/2026-05-17-M19-closing-cdc-review.md`
   - `workbench/verify/m19/test-migration-audit.md` — for the
     `(compile "...")` string locations
6. **M19-4 runner code** at `crates/lykn-cli/src/main.rs` lines
   563–612 (`compile_lykn_test_files`). M20's `.lyk` runner is the
   parallel sibling.
7. **Existing test infrastructure:**
   - `test/forms/` — convention reference for per-form test files
   - `test/surface/` — convention reference
   - `packages/testing/helpers.js` — `compileBoth` helper
   - `crates/lykn-cli/src/main.rs` `cmd_test` — current test
     orchestration entry point
8. **Classifier internals:**
   - `crates/lykn-lang/src/classifier/mod.rs` — `ClassifierOptions`
   - `crates/lykn-lang/src/classifier/dispatch.rs` — `is_kernel_form()`, `is_surface_form()`, `is_surface_form_strict()`
   - `crates/lykn-lang/src/classifier/forms.rs` — `classify_form`, `classify_form_strict`

---

## Per-row preflight discipline

### M20-2 preflight — design-call confirmation

The seven design calls in the preamble are CDC-decided defaults. Before
implementing, CC reads them and either:

(a) Acknowledges them and proceeds, OR

(b) Surfaces a substantive question on any specific call (with
    rationale — not just preference).

If CC accepts all seven, the preflight is short. If CC surfaces a
question, STOP and route to CDC before implementing the affected
row.

### M20-3 preflight — kernel-only-post-expansion classifier shape

The runner needs a new classifier mode that:

1. Expands macros (same as the `.lykn` path).
2. Post-expansion, dispatches against `is_kernel_form()` only.
3. Rejects surface forms with a specialized diagnostic.

Two possible implementations:

(α) **New `ClassifierOptions` field**: `kernel_only: bool`. When true,
    the classifier rejects surface forms. Symmetric to `strict: bool`
    which was M18's addition.

(β) **New top-level entry point**: `classify_kernel(&forms)` parallel
    to `classify_with_options(&forms, opts)`.

CDC lean: (α). Consistent with M18's pattern; one struct, two flags;
adding new modes in the future is a slot-in. CC should confirm (α) is
right before implementing; if (α) doesn't fit the existing call-site
shape, surface to CDC.

### M20-3 TDD-first discipline

Runner change requires TDD-first PROPERLY this time (per M19 CDC
methodology callout). Specifically:

1. Write a NEGATIVE-DIRECTION test FIRST: a fixture `.lyk` file
   that contains a surface form (e.g., `(bind x 1)`) at top level
   AND a test that asserts the runner REJECTS it with the expected
   "X is a surface form" diagnostic.
2. Commit the failing test (it would currently fail-to-fail because
   the runner doesn't even classify `.lyk` files yet — so the test
   would pass trivially today, which IS the failure: the runner
   is silent on `.lyk` problems). Actually re-read: the test should
   ASSERT a specific rejection diagnostic; pre-fix the runner emits
   no diagnostic at all, so the assertion fails. Good — that's the
   failing-pre-fix shape.
3. Implement the runner change.
4. Commit the fix.
5. Verify the test passes.

PAIRED COMMITS — test commit precedes fix commit. SHA boundary
visible in `git log`.

### M20-9 TDD-first discipline (the M19-4 fold-in)

Same shape — failing test first, paired commits. Negative-direction
test for the EXISTING M19-4 runner: a fixture `.lykn` with bare
`(const x 1)` at top level; integration test asserts
`compile_lykn_test_files` exits non-zero with the expected
diagnostic.

### M20-5 / M20-6 batch granularity

Test-file authoring: per-form, one file at a time, batched in commits
of 2–4 files per commit. After each batch: run the new `.lyk` test
suite + existing `.lykn` suites to verify no regressions.

Each test file should:

1. Exercise the form's primary semantics with at least one positive
   case.
2. Exercise at least one expected-failure or edge-case where it
   makes sense (e.g., `const_test.lyk` exercising reassignment-
   rejection; `function_test.lyk` exercising arity).
3. Use `compileBoth` for forms both compilers implement.
4. Be readable as documentation — comments explaining what the
   test demonstrates.

---

## Iteration budget

**5 iterations.** Expected 3–4. Per Duncan's 2026-05-16 iteration-
budget override: the cap guards against compliance-theatre, not
good-faith engineering iteration. If the audit or runner change
surfaces unexpected complexity (e.g., the kernel-only classifier
mode reveals a dispatch-table coupling we missed), surface — don't
compress at the cost of correctness.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M20-1 | Baseline state captured at `workbench/verify/m20/baseline.txt` | `test -f workbench/verify/m20/baseline.txt && grep -cE "^=== " workbench/verify/m20/baseline.txt` returns ≥4 | polish | Spec 1 | open | | Pre-state: zero `.lyk` test files, current test counts, current runner behaviour for `.lyk` (likely: ignored) |
| M20-2 | Design-call confirmation recorded | A short note at `workbench/verify/m20/design-confirmation.md` acknowledges the seven design calls OR surfaces substantive questions on specific ones | polish | Preflight discipline | open | | If CC surfaces a question, STOP and route to CDC |
| M20-3 | `.lyk` runner code path exists with kernel-only post-expansion classification | TDD-first paired commits: (a) `git log` shows test commit precedes fix commit; (b) test asserts rejection of surface form in `.lyk` file with the expected diagnostic; (c) `grep -E "kernel_only.*true\|classify_kernel\|compile_lyk_test_files" crates/lykn-cli/src/main.rs` shows the new path | serious | Spec 1; design call 1 | open | | The runner is the load-bearing infrastructure. Methodology MUST: paired commits. |
| M20-4 | `test/kernel/` directory exists with conventions doc | `test -d test/kernel` and `test -f test/kernel/CONVENTIONS.md`; conventions doc names: single-form-per-file rule, naming convention, `compileBoth` usage, flavor (b) representative-sample rationale | polish | Spec 2; design calls 2-3 | open | | Mirror of `test/forms/` and `test/surface/` |
| M20-5 | Per-kernel-only-form `.lyk` test file exists for each form in DD-58's kernel-only enumeration | Five files exist: `test/kernel/function_test.lyk`, `function-star_test.lyk` (or `function-generator_test.lyk`), `const_test.lyk`, `let_test.lyk`, `var_test.lyk`. Each contains at least one passing test. (Updated 2026-05-17 quote/quasiquote correction: count was 6, dropped to 5; quote/quasiquote moved to flavor (b) representative sample in M20-6.) | serious | Spec 2; DD-58 §kernel-only enumeration | open | | Exhaustive coverage for kernel-only forms |
| M20-6 | Representative flavor (b) passthrough coverage in `test/kernel/` | At least 8 flavor (b) tests covering a representative sample across categories. REQUIRED categories (one test each): Macro/quoting (`quote_test.lyk` AND `quasiquote_test.lyk` — both are mandatory per DD-58 refinement log 2026-05-17 quote/quasiquote correction), one async op, one module form, one control-flow, one arithmetic, one comparison, one literal constructor. Sample selection rationale recorded in CONVENTIONS.md. | serious | Spec 2; DD-58 §flavor (b) enumeration | open | | Representative-not-exhaustive; quote/quasiquote mandatory because their reader-macro entry points (`'expr` and `` `expr ``) make them universally reachable from surface code |
| M20-7 | `compileBoth` used for kernel forms where both compilers implement them | `grep -rE "compileBoth\|compile-both" test/kernel/` returns ≥1 match per kernel-form file that has dual implementation. Single-compiler test files are explicitly marked with a header comment. | polish | Spec 4 | open | | M16 work made `compileBoth` available for kernel paths |
| M20-8 | `(compile "...")` strings audit recorded | `workbench/verify/m20/compile-string-audit.md` exists with per-case disposition for each of the ~20 occurrences M19-2 surfaced. Each occurrence: file, line, form-class, disposition (`keep-runtime-only` / `keep-and-supplement` / `migrate-to-source`). | serious | Spec 3 | open | | ADDITIVE disposition: M20 doesn't migrate; it records and supplements |
| M20-9 | M19-4 negative-direction enforcement test added | TDD-first paired commits: integration test at `crates/lykn-cli/tests/` asserts a `.lykn` fixture with bare `(const x 1)` is REJECTED by `compile_lykn_test_files` with the expected DD-58 strict-mode diagnostic. `git log` shows paired commits. | serious | Fold-in from M19 CDC review methodology callout | open | | The missing TDD-first piece from M19-4 |
| M20-10 | All tests pass under all modes | `cargo test -p lykn-lang` ≥1022; `cargo test -p lykn-cli` ≥83 + new integration test from M20-9; `make test-lykn` ≥292 surface, ≥671 forms; `./bin/lykn test test/kernel/` exits 0 with ≥6 passing kernel-only tests + ≥6 passing flavor (b) tests | correctness | Spec 4 | open | | The new `.lyk` suite must run cleanly |
| M20-11 | Backward-compat preserved | `cmd_compile` in main.rs unchanged for production `.lykn` paths (verify by reading the function — strict-OFF default for production); existing `.lykn` test runner code path unchanged in behaviour | correctness | Spec 5; production-code invariant | open | | M20 is purely additive |
| M20-12 | DD-58 Coverage section added | DD-58 has a new §"Test discipline" subsection that records the kernel-coverage spec; `grep -c "## Test discipline\|## Coverage" docs/design/05-active/0059-dd-58-*.md` returns ≥1 | polish | Spec 6 | open | | Section can be terse; the substantive content is the test corpus itself |
| M20-13 | Closing report exists with substrate-rule compliance section | `workbench/2026-05-<date>-M20-closing-report.md` exists; substrate-rule compliance section names six rules including TDD-first (with explicit reference to paired commits for M20-3 and M20-9) | correctness | Methodology continuity | open | | TDD-first paired commits MUST be named in the closing |
| M20-14 | Commit chain coherent | `git log --grep="M20\|kernel.test\|\.lyk\|DD-58 Phase 1.5" --oneline` returns the expected commit chain. For M20-3 AND M20-9: test commit precedes fix commit. For M20-5/M20-6: test batches in commits of 2-4 files. Audit + runner + tests + closing in clear chronological order. | correctness | TDD-first discipline + commit hygiene | open | | Paired commits explicit for the two TDD-first rows |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 3–4.

2. **Read DD-58, the M19 closing report, the M19 CDC review, and
   the M19-2 audit.** M19's substantive finding (compile-string
   bypass) and the M19 CDC review's methodology callouts
   (TDD-first paired commits, negative-direction tests) are
   directly load-bearing on M20's design.

3. **Read the seven design calls in the preamble.** Confirm or
   surface dissent before implementing. The classifier-mode call
   (M20-2 preflight) is the most consequential.

4. **Subagent delegation policy:** lookup-only. The
   `(compile "...")` string audit (M20-8) involves grep work —
   appropriate for subagent delegation. Test-file authoring
   (M20-5, M20-6) is judgment work; main CC context only.

5. **Order of work:**
   - M20-1 (baseline) — captures pre-state.
   - M20-2 (design confirmation) — acknowledge or surface.
   - M20-3 (runner change) — TDD-first PAIRED COMMITS. This is
     the methodology MUST. Do not combine test + fix into one
     commit.
   - M20-4 (test directory + conventions doc) — small, gates the
     test authoring.
   - M20-5 (kernel-only form tests) — five files (`function`,
     `function*`, `const`, `let`, `var`), batched in commits of
     2-3 files. Run new suite after each batch.
   - M20-6 (flavor (b) sample) — at least eight tests covering a
     representative sample across categories, including MANDATORY
     `quote_test.lyk` and `quasiquote_test.lyk` (per DD-58
     refinement log 2026-05-17 quote/quasiquote correction).
   - M20-7 (compileBoth verification) — confirm the helper works
     for kernel paths.
   - M20-8 (compile-string audit) — produce the per-case
     disposition doc.
   - M20-9 (M19-4 negative-direction test) — TDD-first PAIRED
     COMMITS. Same MUST as M20-3.
   - M20-10 (full test pass) — comprehensive run.
   - M20-11 (backward-compat) — verify production unchanged.
   - M20-12 (DD-58 coverage section) — short addition.
   - M20-13 + M20-14 — closing report + commit chain
     verification.

6. **Anti-shortcut explicit instructions:**

   - **Do NOT combine test + fix commits for M20-3 or M20-9.** The
     methodology callout from M19 review is binding here. Test
     commit precedes fix commit; SHA boundary visible in
     `git log`. The grep-level verify is satisfied OR fail.
   - **Do NOT migrate `(compile "...")` strings out of existing
     surface tests.** The audit (M20-8) RECORDS the disposition.
     Actual migrations are a separate milestone if Duncan calls
     for them.
   - **Do NOT modify dispatch tables.** Frozen as M17 + M18 +
     polish left them.
   - **Do NOT change strict's default for production code.** M21+
     scope.
   - **Do NOT touch the JS compiler.**
   - **Do NOT auto-pass safety-bypass flags** per AGENTS.md.
   - **Do NOT auto-accept any insta snapshot diffs** per
     AGENTS.md.
   - **Do NOT exhaustively cover flavor (b) passthroughs.**
     Representative sample only. If CC feels strongly that
     specific additional passthroughs need coverage, surface to
     CDC — don't quietly expand scope.

7. **If the audit surfaces a `(compile "...")` string pattern
   that suggests a substantive coverage gap M20 doesn't account
   for, STOP and surface.** Examples: a kernel form in a compile
   string that isn't in DD-58's enumeration; a compile-string
   form that has behaviour that would diverge between the runtime-
   compile path and a source-level `.lyk` path. These are CDC-
   level questions, not work-around-locally questions.

8. **If the `.lyk` classifier mode (kernel-only post-expansion)
   reveals an existing surface-form usage in `examples/kernel/`
   that would NOT classify cleanly**, surface. The `examples/kernel/`
   files are not part of M20's test corpus, but if they would fail
   the new classifier, that's a finding worth recording (and may
   indicate the design call needs nuance — e.g., examples don't go
   through the runner classifier, only tests do).

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M20-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M20-1 through M20-14) with the
   final status and Verify command output as evidence.
2. For M20-3 and M20-9 specifically, cite BOTH commit SHAs
   (test-only and fix-only) and explicitly call out the paired-
   commit discipline.
3. Include a summary table:
   - Kernel-only-form tests authored (target: 6).
   - Flavor (b) passthrough tests authored (target: 6
     representative).
   - `compileBoth` adoption count.
   - `(compile "...")` audit case count with per-disposition
     breakdown.
4. Include the seven design-call confirmations (or any
   substantive escalation from M20-2 preflight).
5. Include a "Substrate-rule compliance" section addressing six
   rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant (production code unchanged)
   - **TDD-first discipline — name M20-3 and M20-9 explicitly,
     cite paired commit SHAs.**
6. Include a "Findings for fast-follow" section if any new
   findings surface (compile-string patterns, classifier-mode
   edge cases, additional passthrough coverage worth expanding,
   etc.).
7. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to migrate `(compile "...")` strings.
- You do not need to cover every flavor (b) passthrough.
- You do not need to touch the JS compiler.
- You do not need to change production `lykn compile` behaviour.
- You do not need to retire `_kernel`, `kernelArray()`,
  `SetSymbol`. DD-58 Phase 5.
- You do not need to fix the lambda emission divergence (DD-58
  Breaking Change #3 — Phase 5, per Duncan 2026-05-17).
- You do not need to add file-extension gating for production
  `.lykn` files. M21+/Phase 4.
