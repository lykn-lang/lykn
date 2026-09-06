# Milestone M17: DD-58 Phase 1a — `kernel:` Escape Recognition in Rust Classifier

> **Status:** open
> **Iteration budget:** 5 (expect 1–2)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [DD-58](../../docs/design/05-active/0059-dd-58-*.md), [philosophy.md](../../docs/philosophy.md)
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** M16 + source-context-path + import-macros runtime-import fix + wishlist cleanup + drive-by cleanups all closed; DD-58 promoted to `05-active/` as `0059-dd-58-*.md` on 2026-05-17.
> **DD-58 Phase mapping:** This is the first sub-piece of DD-58's "Phase 1 — Rust classifier strict mode + kernel: prefix + closed-namespace dispatch." Specifically the kernel: prefix piece, scoped as Phase 1a. Phase 1b (closed-namespace dispatch tables + strict mode flag) is a follow-up milestone.

---

## Why this milestone exists

DD-58 introduces `(kernel:<form> ...)` as the single escape hatch
into the kernel layer. The escape is the lowest-level, most
foundational piece of the DD-58 work: it's purely additive (accepts
new syntax, doesn't reject anything previously-accepted), it's a
prerequisite for every subsequent DD-58 phase, and it can be
landed and tested in isolation before any of the more disruptive
changes.

Landing this first means:
- Users have access to the kernel-escape syntax immediately, even
  before strict-mode enforcement turns on.
- Subsequent milestones (closed-namespace dispatch tables, strict
  mode, file-extension gating, JS-side parity) build on a stable
  foundation.
- TDD-first: the escape syntax can be implemented with a failing-
  test-first discipline (the failing test exercises `kernel:foo`;
  the fix accepts and routes it).

---

## What this milestone produces

1. **Reader handling of `kernel:` prefix.** Verified that the
   reader keeps `kernel:if` as a single atom (per DD-01). No reader
   changes expected; the milestone confirms current behaviour and
   adds a regression test if one doesn't exist.
2. **Classifier handling of `kernel:` prefix** in the Rust
   classifier (`crates/lykn-lang/src/classifier/`):
   - When a head atom starts with `kernel:`, strip the prefix.
   - Validate the stripped form against `is_kernel_form()` (the
     existing kernel-form whitelist).
   - If valid, emit a `SurfaceForm::KernelPassthrough` wrapping
     the stripped form.
   - If invalid (`kernel:nonsense`), produce a structured
     diagnostic naming the form and suggesting valid alternatives.
3. **Tests** covering:
   - `(kernel:if c t e)` compiles to the same JS as bare `(if c t e)`
     in surface code today (proves the escape syntax routes correctly).
   - `(kernel:const x 42)` compiles to `const x = 42;` (proves
     kernel-only forms are reachable via escape).
   - `(kernel:nonexistent ...)` produces a structured diagnostic
     (proves validation).
   - `compile-both` test that both compilers produce convergent
     output for `(kernel:<form> ...)` cases. (Note: JS-side
     `kernel:` handling is M18+ scope; for M17, the compile-both
     test uses a kernel form that JS already handles correctly via
     its existing classifier, OR is marked skip-rationale until
     JS-side support lands.)
4. **No changes to existing behavior.** Surface code that uses
   bare kernel forms today (e.g., `(const x 42)` in a `.lykn`
   file) continues to work exactly as before. The dispatch tables
   are not modified in this milestone.
5. **Documentation.** A note in the dev-doc tree or in a comment
   in `dispatch.rs` naming the `kernel:` syntax as the
   DD-58-canonical escape hatch.

This milestone does **not**:

- Update the surface or kernel dispatch tables (`is_surface_form`,
  `is_kernel_form`). Those move to DD-58's closed-namespace model
  in M18.
- Add a strict-mode flag to the classifier. M18 work.
- Enforce the closed-namespace rule (rejecting bare kernel forms
  in surface code). M18 work.
- Touch the JS compiler. JS-side `kernel:` parity lands once
  DD-37's classifier infrastructure is in place (DD-37 Phase 3+).
- Implement file-extension gating. DD-58 Phase 4 / future milestone.
- Retire the `_kernel` marker, `kernelArray()`, or `SetSymbol`.
  DD-58 Phase 5 / future milestone.

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md) — subagent rules
3. [`assets/ai/AGENTS.md`](../../assets/ai/AGENTS.md) "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-58 itself:** `docs/design/05-active/0059-dd-58-kernelsurface-separation-closed-surface-namespace-with-kernelform-.-escape.md`. Focus on the "Architectural rule," "The `kernel:` escape syntax," and "Migration sequencing Phase 1" sections.
5. `crates/lykn-lang/src/classifier/dispatch.rs` — the current `is_surface_form` and `is_kernel_form` tables.
6. `crates/lykn-lang/src/classifier/mod.rs` — the classifier entry point.
7. `crates/lykn-lang/src/classifier/forms.rs` — per-form classification logic.
8. `crates/lykn-lang/src/ast/surface.rs` — `SurfaceForm` enum, including the `KernelPassthrough` variant.
9. DD-01 (`docs/design/06-final/0001-dd-01-colon-syntax-and-camelcase-conversion.md`) — colon syntax for member access. The `kernel:` prefix is a documented exception to DD-01's colon-as-member-access rule.

---

## Design dispositions (carried forward from DD-58)

**On the kernel-form whitelist for `kernel:` validation.** The
whitelist is *exactly* what `is_kernel_form()` returns today.
Forms recognised by the current Rust kernel codegen are eligible
for `kernel:` escape; forms not in that list produce a diagnostic.
This includes forms that ARE ALSO surface forms (e.g.,
`kernel:if`, `kernel:try`, `kernel:=`) — the `kernel:` prefix
unambiguously routes to kernel handling regardless of surface
existence.

**On the diagnostic shape for invalid escape.** The diagnostic
SHOULD name the invalid form and suggest the closest valid
alternative if any. Example: `(kernel:functoin ...)` → "unknown
kernel form 'functoin'; did you mean 'function'?" Implementation
detail; first-pass can be a simple "unknown kernel form 'X'"
without the suggestion, with the suggestion as polish if budget
permits.

**On classification routing for `kernel:`-escaped forms.** The
classifier emits `SurfaceForm::KernelPassthrough { ... }` for the
escaped form. The emitter then handles `KernelPassthrough` as it
does today (the DD-50.5 addendum fix means
`KernelPassthrough::emit` recurses into the surface emitter for
nested surface forms, which is correct: a `(kernel:if c t e)`
where `c` is a surface form like `(= a b)` still has the surface
`=` correctly classified as equality).

**On `kernel:` precedence vs DD-01 colon syntax.** The classifier
dispatches `kernel:` BEFORE member-access compilation. A head atom
`foo:bar` is member access; a head atom `kernel:foo` is the
kernel escape (recognized by the classifier as a special case).
This is the documented DD-01 exception; cite DD-58 in the
implementing code comments.

**On TDD-first discipline.** Per CC's wishlist-closing self-
reflection ("the C-6b template content debugging took much longer
than needed because I didn't write the failing test first"), this
milestone REQUIRES failing-test-first for each substantive change:

1. Write a test that exercises `(kernel:if c t e)`. It should fail
   before the classifier change.
2. Implement the classifier change. Test passes.
3. Write a test for `(kernel:nonexistent ...)` diagnostic. It
   should fail before the validation logic. Implement; test passes.

Each test commit MUST precede the corresponding fix commit in the
git history. CDC review verifies this via `git log --oneline`.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M17-1 | Baseline state captured at `workbench/verify/m17/baseline.txt` | `test -f workbench/verify/m17/baseline.txt && grep -cE "^=== " workbench/verify/m17/baseline.txt` returns ≥4 | polish | Spec 1; LEDGER_DISCIPLINE pre-state discipline | open | | Pre-state: current is_surface_form / is_kernel_form sizes; existing test counts; SurfaceForm::KernelPassthrough current usage |
| M17-2 | Reader keeps `kernel:if` as a single atom (no reader changes required) | A new unit test in `crates/lykn-lang/src/reader/` parses `(kernel:if c t e)` and asserts the head is a single atom `"kernel:if"` (not two atoms). Test exits 0 | correctness | Spec 1 | open | | Verify behaviour matches DD-01 + DD-58 expectation |
| M17-3 | Classifier accepts `kernel:` prefix, strips it, validates against `is_kernel_form()`, emits `KernelPassthrough` | Failing-test-first: test for `(kernel:if c t e)` exists and fails before implementation; passes after. `grep -nE "kernel:" crates/lykn-lang/src/classifier/` shows the prefix-stripping logic with comment citing DD-58. `cargo test -p lykn-lang` passes | serious | Spec 2; DD-58 §"The `kernel:` escape syntax" | open | | TDD-first MUST: test commit precedes fix commit |
| M17-4 | Invalid `kernel:<form>` produces a structured diagnostic | Failing-test-first: test for `(kernel:nonexistent ...)` asserts on the diagnostic content. Test fails pre-fix; passes post-fix | serious | Spec 2 | open | | First-pass diagnostic can be simple ("unknown kernel form 'X'"); did-you-mean suggestion is polish-grade |
| M17-5 | `compile-both` convergence for `(kernel:<form> ...)` cases where JS already handles the form correctly via its existing classifier | A new test in `test/forms/dd-58-kernel-escape_test.lykn` exercises `(kernel:if c t e)` via `compile-both`. Test exits 0. If JS doesn't yet handle `kernel:` prefix (likely — that's M18+ scope), the test is documented with a skip-rationale comment naming the M18 prerequisite | correctness | Spec 3; DD-58 §"Migration sequencing Phase 1" | open | | Honest disposition: either compile-both passes today or it's skip-with-rationale citing M18 |
| M17-6 | No behaviour change for surface code that doesn't use `kernel:` prefix | `make test`, `make test-lykn`, `./bin/lykn test test/forms/` all pass with counts ≥ current baseline. **No existing test may regress.** | serious | Spec 4 | open | | Backward-compatibility invariant — additive change, nothing else changes |
| M17-7 | Closing report includes substrate-rule compliance section addressing the six starter rules + TDD-first | `grep -cE "^## Substrate-rule compliance" workbench/2026-*-M17-closing-report.md` returns 1; each of the six rules named (AGENTS.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite, philosophy.md Principle 1, philosophy.md Principle 3, backward-compat invariant, TDD-first discipline) | correctness | Spec 7; methodology learning from wishlist closure | open | | TDD-first is named as a discipline this milestone exercises |
| M17-8 | Single coherent commit chain demonstrating TDD-first | `git log --grep="M17\|kernel:.*prefix\|kernel:.*escape\|DD-58" --oneline` returns ≥4 commits (test commits + fix commits for M17-3 and M17-4). For each substantive change (M17-3 and M17-4), the test commit MUST precede the fix commit in the log | correctness | Spec 8; TDD-first discipline | open | | The "test commit precedes fix commit" pattern is itself part of the deliverable |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 1–2.

2. **Read DD-58 itself before writing any code.** The "Architectural
   rule," "The `kernel:` escape syntax," and "Migration sequencing
   Phase 1" sections are mandatory reading. The escape syntax has
   specific shape (strip prefix → validate against kernel whitelist
   → emit `KernelPassthrough`) that the implementation MUST follow.

3. **Subagent delegation policy.** Per the project methodology,
   subagents are for **lookup only**. All design decisions,
   classifier implementation, diagnostic-message wording, and
   judgment calls stay in main CC context.

4. **TDD-first MUST.** For each of M17-3 and M17-4:
   - Write the failing test FIRST. Run it. Observe the failure.
     Commit the test.
   - THEN implement the fix. Run the test. Observe the pass.
     Commit the fix.
   - The git log MUST show test commit → fix commit ordering.
     CDC verifies this in review.

5. **Order of work:**
   - M17-1 (baseline) — captures pre-state.
   - M17-2 (reader regression test) — verify current behaviour.
     If reader doesn't keep `kernel:if` as a single atom today,
     STOP and surface. The implementation assumes it does.
   - M17-3 (classifier accepts `kernel:` prefix) — TDD-first.
     Test commit precedes fix commit.
   - M17-4 (invalid `kernel:<form>` diagnostic) — TDD-first.
   - M17-5 (compile-both convergence test) — write the test;
     determine empirically whether JS already handles `kernel:`
     correctly via its existing classifier. If yes, test passes.
     If no, document with skip-rationale citing M18 prerequisite.
   - M17-6 (no behaviour change for non-`kernel:` code) — run
     full test suite after each change; surface any regression
     immediately.
   - M17-7, M17-8 — at closing.

6. **Anti-shortcut explicit instructions:**
   - **Do NOT modify `is_surface_form()` or `is_kernel_form()`.**
     This milestone is purely additive; dispatch table changes
     are M18 scope.
   - **Do NOT add a strict-mode flag.** Strict mode is M18 scope.
   - **Do NOT touch the JS compiler.** JS-side `kernel:` parity
     lands once DD-37's classifier infrastructure is in place;
     that's a separate milestone.
   - **Do NOT extend the `kernel:` prefix recognition to accept
     bare kernel forms** (i.e., this milestone doesn't change
     behavior for code that uses `(const x 42)` today; only
     `(kernel:const x 42)` gets new recognition).

7. **If anything in the source survey contradicts DD-58's
   assumed shape** (e.g., the reader doesn't preserve `kernel:if`
   as one atom; `SurfaceForm::KernelPassthrough` has a different
   shape than DD-58 assumes), STOP and surface. Don't work around
   silently — the divergence is methodology-relevant for DD-58's
   broader sequence.

8. **Compliance theatre is the named failure mode.** The per-row
   walk in the closing report MUST cite test commit SHAs + fix
   commit SHAs for M17-3 and M17-4. "Done" without commit-chain
   evidence is softpedalled.

---

## CDC instructions

1. **Count rows at close.** Closing report row count = 8. Missing
   rows are a ledger bug.

2. **Run every Verify command independently.** Reproduce against
   the actual commit state.

3. **For M17-3 and M17-4: verify the test commit precedes the
   fix commit.** Inspect `git log --oneline` or
   `git log --follow` for the test file. The TDD-first discipline
   is itself part of the deliverable.

4. **For M17-5: verify the compile-both disposition is honest.**
   If skip-with-rationale, the rationale MUST name the M18
   prerequisite explicitly. If passing, run the test independently
   to confirm.

5. **For M17-6 (backward-compat): run the full test suite from
   a clean state.** Don't trust pass counts without independent
   verification — this is the highest-risk regression criterion in
   the milestone.

6. **Watch for spec-softening.** Particular risks:
   - The kernel-form whitelist for `kernel:` validation accepts
     more than just `is_kernel_form()` results (would defeat the
     validation purpose).
   - The diagnostic for invalid `kernel:<form>` is generic
     ("compilation error") rather than naming the form.
   - The compile-both test passes by coincidence (e.g., on a form
     that produces empty output) rather than by exercising the
     escape path.

7. **Watch for silent drops.** All 8 rows must reach final
   status. If a row proves wrong, raise amendment.

---

## What worked

_(Filled in at milestone close. Patterns or practices that made
the milestone close cleanly and should be preserved or generalised.)_

## Closure

_(Filled in at milestone close. Closed at commit `<SHA>` on
`<date>`. CDC verification: `<session>`. Total rows: 8. Done:
`<n>`. Deferred: `<n>`. No-op: `<n>`.)_
