# Fast-Follow Implementation Prompt for CC — import-macros Output Divergence + `compile_file_with_dts` Cleanup

## Read this first

This prompt addresses two fast-follow items from the
`--source-context-path` closure (commit `a97e151`):

1. **import-macros output divergence between JS and Rust compilers.**
   When source contains `(import-macros ...)`, JS emits the macro
   module's import declarations into the compiled output; Rust omits
   them. This prevents `compileBoth` convergence on any source using
   `(import-macros ...)` — which is the canonical case the
   `--source-context-path` flag was designed to enable. **The
   substantive reach of `compileBoth` for relative-path imports is
   materially narrowed until this is fixed.**

2. **`compile_file_with_dts` dead code.** The refactor of
   `cmd_compile` in commit `a97e151` made `compile_file_with_dts`
   unused. It's a public function with zero callers in `crates/`.
   Drive-by deletion.

Deliverable 1 is two-turn (diagnosis-first, CDC approves the
canonical direction, then implementation). Deliverable 2 is a
single-step cleanup. Both can land in the same commit chain.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** The protocol's named failure mode is *compliance
  theatre.* The acceptance criteria below are written in
  substantive-intent terms — `compile-both` convergence is what's
  required, not "compiler X emits Y."
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`: subagents for lookup
  only (grep, find call sites). Design and judgment in main context.
- **You MUST stop and surface after Deliverable 1's Turn 1
  (diagnosis).** Do not proceed to Turn 2 (implementation) without
  CDC approval of the canonical direction. Surface the diagnosis
  artifact for review; wait for direction confirmation.
- **You MUST NOT auto-pass safety-bypass flags** to underlying
  tools per CLAUDE.md "Lykn CLI safety gates."
- **You MUST preserve backward compatibility.** Any source that
  compiles correctly today MUST continue to produce correct runtime
  behaviour after the fix. The fix is about alignment between
  compilers; correctness of compiled output for end users must be
  preserved.

---

## Required reading (before writing any code)

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/CLAUDE.md` "Lykn CLI safety gates"
4. `packages/lang/expander.js` — `pass0ImportMacros` function around
   line 1271; the JS path that resolves `import-macros` and registers
   macros.
5. `crates/lykn-lang/src/expander/pass0.rs` — `process_import_macros`
   at line 35 and `process_single_import` at line 319; the Rust path.
6. `workbench/2026-05-16-compileboth-source-context-path-closing-report.md`
   — the closing report that surfaced this fast-follow.
7. `workbench/compileboth-fast-follow-cdc-review-2026-05-16.md` — the
   CDC review for context on why this matters.

---

## Deliverable 1 — import-macros output divergence (TWO-TURN)

### Turn 1 — Diagnosis only (MUST NOT proceed to implementation)

Produce a diagnosis artifact at
`workbench/dd-58-or-similar-import-macros-divergence-diagnosis-2026-05-16.md`
addressing the following questions. **You MUST stop and surface
this for CDC review before implementing anything.** Do not write
code in Turn 1.

**Q1 — What exactly diverges?** Use a minimal source like
`(import-macros "./packages/testing" (test is-equal))
(test "x" (is-equal 1 1))` and produce a side-by-side comparison
(JS output vs. Rust output) of the compiled JS. Name precisely which
lines differ.

**Q2 — Why does each compiler do what it does?** Read the JS
`pass0ImportMacros` and Rust `process_import_macros` /
`process_single_import`. Locate the code that decides whether to
emit (or not emit) the upstream import declarations. Cite line
numbers.

**Q3 — Which is correct, or is the question malformed?** Two
sub-questions:
   - **Q3a — Runtime correctness:** if the JS-side `assertEquals`
     (or whatever the macros expand into) is referenced in the
     compiled output, where does the binding for `assertEquals`
     come from at runtime? Does the JS-emitted import declaration
     bind it? Does the Rust path leave it unbound? If so, is the
     Rust output actually broken at runtime, or does Deno's import
     resolution close the gap somehow?
   - **Q3b — Stylistic vs. correctness:** is the divergence
     stylistic (both compilers produce valid runtime behaviour, just
     different shape) or correctness-grade (one of them produces
     broken runtime)? Be specific.

**Q4 — Direction recommendation.** Based on Q3, propose one of:
   - **Direction (a):** Align Rust to JS — Rust starts emitting the
     macro module's runtime imports.
   - **Direction (b):** Align JS to Rust — JS stops emitting them.
   - **Direction (c):** Neither — the divergence is correct
     because the two compilers have different runtime models that
     need different output. (Surface this if you find it.)

   For your recommendation, name the architectural reasoning and
   any backward-compat concerns (existing user code that may break
   under the chosen direction).

**Q5 — Implementation scope estimate.** Once direction is chosen,
roughly how many files need to change, and on which compiler? This
is for CDC's scoping; CC isn't expected to be precise.

**MUST stop and surface after Turn 1.** Do not implement until CDC
confirms the direction.

### Turn 2 — Implementation (after CDC approves direction)

Once direction is settled, implement the alignment. Acceptance for
Turn 2:

- **(F-1.1) `compileBoth` converges on an `(import-macros ...)`
  source.** A new test in
  `test/forms/dd-52-import-macros-convergence_test.lykn` uses
  `compile-both` on a source containing
  `(import-macros "./packages/testing" (test is-equal))
  (test "x" (is-equal 1 1))` and passes. This is the
  substantive criterion — meeting it means the convergence is
  real, not just declared.
- **(F-1.2) Existing `(import-macros ...)`-using tests still
  pass.** `make test` and `make test-lykn` exit 0 with pass counts
  ≥ post-source-context-path baseline (1071 Rust, 292 surface,
  667 forms + any new tests).
- **(F-1.3) The diagnosis doc is updated** with a "Resolution"
  section naming the final direction (a/b/c) and pointing at the
  implementing commits.

---

## Deliverable 2 — `compile_file_with_dts` cleanup (single-step)

`compile_file_with_dts` at `crates/lykn-cli/src/compile.rs:53` has
no callers in `crates/` after the `cmd_compile` refactor in commit
`a97e151`. Verify the no-callers claim independently, then delete.

Acceptance:

- **(F-2.1) No callers anywhere in `crates/` or test fixtures.**
  `grep -rn "compile_file_with_dts" crates/ tests/ 2>/dev/null`
  returns no matches before deletion (i.e., the function is
  genuinely dead). If you find a caller, **stop and surface** —
  don't delete it.
- **(F-2.2) The function and its doc comment are removed** from
  `crates/lykn-cli/src/compile.rs`.
- **(F-2.3) `cargo build --release` succeeds** post-deletion
  (catches any caller I missed in the grep).
- **(F-2.4) `cargo test -p lykn-cli` succeeds** post-deletion (no
  test relied on the function).

---

## Forbidden patterns

- **Do NOT proceed to Turn 2 of Deliverable 1 without CDC approval
  of the direction.** This is the gate that prevents the M16-6
  "literal criterion met, substantive gap" pattern from recurring.
- **Do NOT delete `compile_file_with_dts` if you find any caller.**
  Surface to CDC; the function may be live in a path the previous
  grep missed.
- **Do NOT extend the convergence-test surface beyond `(import-macros
  ...)` sources.** If you discover other related divergences during
  diagnosis, log them as new fast-follows, not as additions to
  Deliverable 1's scope.
- **Do NOT auto-accept any insta snapshot diffs.** Per CLAUDE.md
  "Snapshot testing." Manual review only.
- **Do NOT mix the two deliverables into a single diff that's hard
  to revert.** Use a separate commit for each.

---

## Iteration budget

**5 iterations.** Expected 2–3 (Turn 1 diagnosis + Turn 2
implementation + drive-by cleanup, each could be a separate
iteration if needed). If you reach iteration 5 without convergence,
stop. Rework scope or surface a methodology question.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-import-macros-divergence-closing-report.md`. The
closing report MUST:

1. Walk each F-1.1, F-1.2, F-1.3, F-2.1, F-2.2, F-2.3, F-2.4 row
   with the final status (`done` / `deferred` / `no-op`) and the
   Verify command output as evidence. No prose summaries.
2. Include the diagnosis doc's final state (Q1–Q5 + Resolution
   section) verbatim or by reference.
3. Include a "Substrate-rule compliance" section addressing
   CLAUDE.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite,
   backward-compat invariant, and partial-adoption check.
4. Include a "Findings for fast-follow" section if any new
   divergences or limitations surface during diagnosis. If none,
   say so explicitly.
5. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to convert additional tests to use `compile-both`
  on `(import-macros ...)` sources. One regression test (F-1.1) is
  enough; the M16-2 compileBoth-conversion work has already
  catalogued the broader divergence landscape.
- You do not need to fix M16-2's 9 formatting-class divergences.
  Those are separate fast-follows from M16's closure.
- You do not need to touch DD-58 (in CDC's main context).
- You do not need to extend `--source-context-path` to `lykn run`
  or `lykn test`. Out of scope.

---

## Start

Begin with Turn 1 of Deliverable 1: read the required materials,
build the minimal divergence example, produce the diagnosis at the
workbench location named above, then surface for CDC review.

**Deliverable 2 can be done in any order relative to Deliverable
1.** If you want to ship the dead-code cleanup first as a quick win
(low-risk separate commit), that's fine — surface the cleanup
separately in the closing report's per-row walk.
