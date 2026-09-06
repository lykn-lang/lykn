# DD-58 Phase 1 Polish — Comprehensive Cleanup Prompt for CC

## Read this first

M17 (kernel: escape recognition) and M18 (closed-namespace
dispatch + strict-mode flag) both closed cleanly with substantive
intent met. The CDC reviews for both surfaced **ten polish-grade
items** — gaps, edge cases, documentation improvements, and
verifications that didn't block closure but are real
improvements worth landing now.

Per Duncan's 2026-05-17 directive: **even the nice-to-haves are
MUSTs here.** No item may be silently dropped. The list is the
spec; the list cannot be quietly ignored.

**Scope:** ten discrete items in three tiers:

- **Tier A — M17/M18 substantive cleanups (5 items):** diagnostic
  polish, strict-mode handling of `async` and `?`, dynamic-import
  verification.
- **Tier B — Edge-case test coverage (3 items):** tests that
  exercise edge cases of the kernel: escape and strict mode that
  weren't covered in M17/M18.
- **Tier C — Documentation and comments (2 items):** DD-58
  citations in the new strict-mode code paths and resolving any
  in-flight TODO/FIXME.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode. The
  acceptance criteria below are in substantive-intent terms.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents.
- **You MUST use TDD-first** for every item that changes
  behaviour or adds tests. Test commit precedes fix commit.
  Per M17/M18 precedent, if multiple tests pass trivially after
  one bundled fix, disclose honestly in the closing report.
- **You MUST address EVERY item.** No item may be silently
  dropped. If an item proves wrong, impossible, or supersedable,
  raise an amendment request.
- **You MUST stop and surface on dissonance.** Particularly for
  Tier A items that involve verifying CC's M17/M18 understanding
  (A-3, A-5): if your re-verification surfaces something
  unexpected, name it before working around.
- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.
- **You MUST NOT auto-accept any insta snapshot diffs** per
  AGENTS.md "Snapshot testing."
- **You MUST NOT change strict's default to ON.** That's M20+
  scope.
- **You MUST NOT touch the JS compiler.** Separate milestone
  after DD-37's classifier infrastructure lands.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-58** at
   `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"The `kernel:` escape syntax"
   - §"Per-layer form enumeration"
5. **M17 closing report + CDC review** —
   `workbench/2026-05-17-M17-closing-report.md` +
   `workbench/M17-closing-cdc-review-2026-05-17.md`
6. **M18 closing report + CDC review** —
   `workbench/2026-05-17-M18-closing-report.md` +
   `workbench/M18-closing-cdc-review-2026-05-17.md` — §"Substantive
   findings disposition" names the fast-follows being addressed
   here.
7. The source files you'll modify:
   - `crates/lykn-lang/src/classifier/dispatch.rs` (strict tables)
   - `crates/lykn-lang/src/classifier/forms.rs`
     (`classify_form_strict` + tests)
   - `crates/lykn-lang/src/classifier/mod.rs` (entry points)

---

## Tier A — M17/M18 substantive cleanups (5 items)

### A-1 — Specialize the kernel-only rejection diagnostic per form-class

**Background:** M18's strict-mode rejection diagnostic currently
says `"use 'bind' for surface binding"` regardless of which
kernel-only form was rejected. That's correct for
`const`/`let`/`var` but generic for `function`/`function*`
(should suggest `func`/`fn`/`lambda`) and irrelevant for
`quote`/`quasiquote` (no surface alternative — only the `kernel:`
escape is meaningful).

**MUST do:**
- Modify `classify_form_strict`'s kernel-only-rejection branch
  to produce form-class-specific diagnostics:
  - `const`/`let`/`var` → "'X' is a kernel-only form; use 'bind'
    for surface binding, or '(kernel:X ...)' to access the
    kernel form explicitly."
  - `function`/`function*` → "'X' is a kernel-only form; use
    'func', 'fn', or 'lambda' for surface functions, or
    '(kernel:X ...)' to access the kernel form explicitly."
  - `quote`/`quasiquote` → "'X' is a kernel-only form with no
    surface alternative; use '(kernel:X ...)' to access it
    explicitly."
- TDD-first: write a test per form-class that asserts the
  diagnostic contains the expected suggestion.
- Update the suggestion field consistently.

**Verify:**
- `cargo test -p lykn-lang -- test_strict_mode.*diagnostic` →
  ≥3 tests passing (one per form-class).
- `grep -A 2 "'const'\|'function'\|'quote'" crates/lykn-lang/src/classifier/forms.rs`
  shows the three diagnostic branches.

### A-2 — Did-you-mean for invalid `kernel:<form>` forms

**Background:** M17's invalid-`kernel:` diagnostic produces
`"unknown kernel form 'X' in (kernel:X ...)"` — names the form
but doesn't suggest the closest valid alternative. For typos
like `(kernel:functoin ...)`, a did-you-mean suggestion
("did you mean 'function'?") materially improves the error.

**MUST do:**
- In the `(kernel:<form> ...)` validation path (added in M17),
  when the form is not in `is_kernel_form()`, compute the
  closest match using a simple edit-distance algorithm
  (Levenshtein or similar). If the closest match has
  distance ≤ 2, add "did you mean 'X'?" to the diagnostic.
- TDD-first: test that `(kernel:functoin ...)` produces a
  diagnostic containing "function".
- Test that `(kernel:absolutely-nothing-close ...)` produces a
  diagnostic WITHOUT a did-you-mean suggestion (when no close
  match exists).

**Verify:**
- `cargo test -p lykn-lang -- test_kernel.*did_you_mean` → both
  tests pass.
- `grep -nE "did you mean\|did_you_mean" crates/lykn-lang/src/classifier/forms.rs`
  shows the suggestion logic.

### A-3 — `async` handling verification under strict mode

**Background:** M18 fast-follow #2 flagged `async` as potentially
not handled under strict mode. CDC's M18 review noted `async` IS
handled in `classify_form_strict` via an explicit
`else if head_name == "async"` branch — BUT the branch is
nested inside `if is_surface_form_strict(head_name)`. If `async`
isn't in `is_surface_form_strict()`, the branch never fires
under strict mode.

**MUST do:**
- Verify empirically: write a test that compiles
  `(async (function f () (return 1)))` under strict mode and
  asserts it classifies correctly (not as a diagnostic).
- If the test fails (async not handled under strict), add
  `async` to `is_surface_form_strict()` as a passthrough OR
  restructure the strict-mode dispatch so `async` is reachable.
- TDD-first: failing test → fix → passing test.

**Verify:**
- `cargo test -p lykn-lang -- test_strict_mode.*async` → passes.
- If `async` is added to `is_surface_form_strict()`: `grep -n "async" crates/lykn-lang/src/classifier/dispatch.rs` returns the new entry.

### A-4 — `?` (ternary) handling under strict mode

**Background:** M18 fast-follow #2 also flagged `?` (kernel
ternary) as not handled under strict. `?` is in `is_kernel_form()`
but doesn't have a surface-equivalent handler in
`classify_form_strict`.

**MUST do:**
- Disposition call: is `?` a surface flavor (b) passthrough, or
  kernel-only via `(kernel:? ...)`? **CDC lean: passthrough.**
  Ternary is a common JS expression primitive; users may write
  `(? cond then else)` in surface and expect it to work.
- Add `?` to `is_surface_form_strict()` if disposition is
  passthrough.
- Update DD-58's flavor (b) passthrough table (refinement-log
  entry) — CDC will handle the DD-58 doc edit; you handle the
  source edit.
- TDD-first: failing test for `(? cond t e)` under strict mode
  → fix → passing test.

**Verify:**
- `cargo test -p lykn-lang -- test_strict_mode.*ternary` →
  passes.
- `grep -n '"?"' crates/lykn-lang/src/classifier/dispatch.rs`
  shows `?` in `is_surface_form_strict()`.

### A-5 — `dynamic-import` placement verification

**Background:** M18 fast-follow #1 noted `dynamic-import` is in
`is_kernel_form()` but not explicitly in DD-58's enumeration.
CC added it to `is_surface_form_strict()` as a passthrough on
inference.

**MUST do:**
- Verify `dynamic-import` is in `is_surface_form_strict()`.
  Write a regression test that asserts
  `(dynamic-import "module-path")` classifies correctly under
  strict mode (as a passthrough).
- TDD-first: write test first; if it passes immediately
  (because M18 already added it correctly), disclose honestly.
  If it fails, fix.

**Verify:**
- `cargo test -p lykn-lang -- test_strict_mode.*dynamic_import` →
  passes.
- `grep -n "dynamic-import" crates/lykn-lang/src/classifier/dispatch.rs`
  returns ≥1 match in `is_surface_form_strict()`.

---

## Tier B — Edge-case test coverage (3 items)

### B-1 — `(kernel:)` empty form name edge case

**MUST add a test** that compiles `(kernel:)` (the `kernel:`
prefix with no form name) and asserts it produces a clear
diagnostic. Edge case: the prefix-stripping in M17 produces
an empty string when split on `kernel:`; the validation against
`is_kernel_form("")` should fail with a useful error.

**Verify:**
- Test exists and passes.
- Diagnostic names "empty form name" or similar.

### B-2 — `(kernel:if c t e)` for surface+kernel namesake

**MUST add a test** that compiles `(kernel:if c t e)` under
BOTH strict mode and lax mode. Edge case: `if` is in both
`is_surface_form_strict()` (flavor c, namesake-sharing) AND
`is_kernel_form()`. The `kernel:` prefix MUST route to kernel
regardless of the surface existence.

**Verify:**
- Test verifies `(kernel:if c t e)` classifies as
  `KernelPassthrough` in both modes (NOT as the rich surface
  `if` with position-aware semantics).
- Output is kernel `if` (regular JS if-statement or ternary
  per kernel codegen), not surface's position-aware emission.

### B-3 — Strict mode + user macros interaction

**MUST add a test** that registers a user macro (e.g., via
`(macro foo ...)`) and then invokes it under strict mode.
Edge case: a user-macro invocation has an unknown head atom at
classification time — strict mode should NOT produce a
diagnostic; the macro is resolved at expansion time.

**Verify:**
- Test registers a user macro and invokes it; assert the
  classification produces `FunctionCall` (or equivalent
  "user macro candidate" node), not a strict-mode rejection
  diagnostic.
- If the macro is in fact rejected, the strict-mode dispatch
  needs adjustment — surface as finding before fixing.

---

## Tier C — Documentation and comments (2 items)

### C-1 — DD-58 citation comments in classify_form_strict

**MUST add comments** in `classify_form_strict` (forms.rs)
citing DD-58 for:
- The kernel: prefix branch (cite DD-58 §"The `kernel:` escape syntax")
- The kernel-only rejection branch (cite DD-58 §"Per-layer form enumeration" — kernel-only namespace)
- The strict surface dispatch branch (cite DD-58 §"Per-layer form enumeration" — closed surface namespace)

Each comment ≥ 1 line; references DD-58's specific section.

**Verify:**
- `grep -B1 "DD-58" crates/lykn-lang/src/classifier/forms.rs | grep -c "//"` ≥ 3.

### C-2 — Resolve any in-flight TODO/FIXME in M17/M18 work

**MUST audit** the files touched by M17 and M18 for `TODO`,
`FIXME`, `XXX` comments. For each:
- If it's actionable in this milestone, address it.
- If it's a real future-work item, ensure it's logged in the
  closing report's fast-follow section.
- If it's stale (refers to work already done), remove it.

**Verify:**
- `grep -rn "TODO\|FIXME\|XXX" crates/lykn-lang/src/classifier/`
  returns either 0 hits OR each hit is named in the closing
  report.

---

## Aggregate acceptance criteria

| ID | Criterion | Verify |
|----|-----------|--------|
| AG-1 | All 10 items addressed; each has TDD-first commit chain where applicable | Per-item Verify commands above all pass; `git log --grep="A-[1-5]\|B-[1-3]\|C-[1-2]" --oneline` shows interleaved test + fix commits |
| AG-2 | All test suites pass | `cargo test -p lykn-lang`, `make test-lykn`, `./bin/lykn test test/forms/` all exit 0 with counts ≥ post-M18 baseline (1010 Rust, 292 surface, 670 forms) |
| AG-3 | Test counts strictly greater than post-M18 baseline | Rust `#[test]` count > 1010 (each new test from A-1..A-5 + B-1..B-3 adds ≥1) |
| AG-4 | Diagnostic-specialization in A-1 verified per form-class | Three distinct test assertions for `const`-class, `function`-class, `quote`-class diagnostics |
| AG-5 | Backward-compat preserved | Strict OFF still preserves M17 + M18 behaviour exactly; no existing test regresses |

---

## Forbidden patterns

- **Do NOT skip any item.** All 10 are MUSTs.
- **Do NOT silently extend `is_surface_form()` or `is_kernel_form()`** — those stay frozen as M18 left them.
- **Do NOT change strict's default to ON.**
- **Do NOT touch the JS compiler.**
- **Do NOT auto-accept insta snapshot diffs.**
- **Do NOT bundle TDD-first violations.** If you can't write a failing test first for an item, surface that BEFORE implementing.
- **Do NOT mix items across commits.** Each Tier-A item gets its own commit pair (test + fix). Tier-B items can share commits where the test is the deliverable. Tier-C is documentation-only commits.

---

## Iteration budget

**5 iterations.** Expected 2–3.

Per Duncan's 2026-05-16 iteration-budget override: the cap is a
guard against compliance-theatre / infinite spin, not against
good-faith engineering iteration. Surface real engineering
issues; don't sacrifice good engineering on the altar of
time-budgets.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-dd58-phase1-polish-closing-report.md`.
The closing report MUST:

1. Walk EVERY item (A-1..A-5, B-1..B-3, C-1, C-2) with final
   status (`done` / `deferred` / `no-op`) and Verify command
   output as evidence.
2. For each TDD-first item, cite test commit SHA AND fix commit
   SHA. Trivial-pass disclosures honored per M17/M18 precedent.
3. For A-3 (async re-verification), name the empirical finding:
   was async actually broken under strict (needed fix) OR
   already working (no-op disposition)?
4. For A-4 (ternary), name the disposition chosen (passthrough
   vs kernel-only) and the rationale.
5. Include a "Substrate-rule compliance" section addressing six
   rules (AGENTS.md safety gates, LEDGER_DISCIPLINE no-silent-
   rewrite, philosophy.md Principle 1, philosophy.md Principle 3,
   backward-compat invariant, TDD-first discipline).
6. Include a "Findings for fast-follow" section logging new
   findings. If none, say so explicitly.
7. Name any uncertainty.

---

## What you do NOT need to do

- You do not need to update DD-58 itself. CDC will handle DD-58
  refinement-log entries for the `?` and `dynamic-import`
  additions to flavor (b) passthrough.
- You do not need to turn strict mode ON by default. M20+ scope.
- You do not need to migrate existing tests. M19 scope.
- You do not need to touch the JS compiler.
- You do not need to implement file-extension gating. DD-58
  Phase 4 / M20+.
- You do not need to canonicalize methodology lessons. CDC work.

---

## Start

1. Read the required materials.
2. Tier A items can be done in any order, but suggest:
   - A-3 (async re-verification) FIRST — quick empirical check
     that informs whether other work is needed.
   - A-4 (ternary) NEXT — pairs with A-3 (both are
     classify_form_strict dispatch gaps).
   - A-5 (dynamic-import verification) — quick regression test.
   - A-1 (diagnostic specialization) — independent.
   - A-2 (did-you-mean) — independent.
3. Tier B items are test-additions; can interleave with Tier A.
4. Tier C-1 (citations) can be done last as a documentation pass.
5. Tier C-2 (TODO/FIXME audit) — do early; surface anything that
   blocks other Tier-A items.

Surface anything that looks off before working around it.
