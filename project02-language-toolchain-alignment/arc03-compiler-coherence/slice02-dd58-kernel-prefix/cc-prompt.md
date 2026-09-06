# M17 Implementation Prompt for CC — DD-58 Phase 1a: `kernel:` Escape Recognition

## Read this first

Your milestone is M17. The spec is at
`workbench/milestones/M17-dd58-phase1a-kernel-prefix-recognition-ledger.md`.
That file is canonical — every acceptance criterion is enumerated
there with a grep-verifiable Verify command.

**This is the first implementation milestone for DD-58** (the
kernel/surface separation, now in `docs/design/05-active/0059-dd-58-*.md`).
DD-58's Phase 1 has multiple sub-pieces; M17 is scoped to JUST the
`kernel:` prefix recognition piece. The closed-namespace dispatch
tables and strict-mode enforcement come in subsequent milestones.

**Why this scope:** the `kernel:` escape is the foundational
piece — additive (accepts new syntax, doesn't reject anything),
testable in isolation, and a prerequisite for every other DD-58
phase. Landing it first means users have the escape hatch
immediately, even before strict-mode enforcement turns on, and
subsequent milestones build on stable ground.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode. The
  ledger's eight rows have grep-verifiable Verify commands; meet
  them as written, not as paraphrased.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents. Design decisions, classifier implementation,
  diagnostic-message wording, all in main CC context.
- **You MUST use TDD-first** for M17-3 (classifier accepts
  `kernel:` prefix) and M17-4 (invalid `kernel:<form>`
  diagnostic). For each:
  1. Write the failing test FIRST. Run it. Observe failure.
     Commit the test.
  2. Implement the fix. Run the test. Observe pass. Commit the fix.
  3. The git log MUST show test-commit-before-fix-commit ordering.
  CDC verifies this in review.
- **You MUST stop and surface on dissonance.** If the source
  doesn't match DD-58's assumed shape (e.g., the reader doesn't
  keep `kernel:if` as one atom; `SurfaceForm::KernelPassthrough`
  has different shape), STOP. Don't work around silently.
- **You MUST preserve backward compatibility** (M17-6). Surface
  code that doesn't use `kernel:` continues to work exactly as
  today. No existing test may regress.
- **You MUST NOT modify `is_surface_form()` or `is_kernel_form()`**
  — those are M18 scope. This milestone is purely additive.
- **You MUST NOT add a strict-mode flag** — M18 scope.
- **You MUST NOT touch the JS compiler** — JS-side `kernel:`
  parity is a separate milestone once DD-37's classifier lands.
- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md
  "Lykn CLI safety gates."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md` — the protocol.
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md` — subagent rules.
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates" + "Snapshot testing".
4. **The M17 ledger** at
   `workbench/milestones/M17-dd58-phase1a-kernel-prefix-recognition-ledger.md`.
5. **DD-58 itself** at
   `docs/design/05-active/0059-dd-58-kernelsurface-separation-closed-surface-namespace-with-kernelform-.-escape.md`.
   Focus on:
   - §"Architectural rule"
   - §"The `kernel:` escape syntax"
   - §"Migration sequencing — Phase 1"
6. The source materials listed in the ledger's "Source materials"
   section (read in the order given there).

---

## Per-row preflight discipline

### M17-2 preflight — verify reader behaviour BEFORE assuming

DD-58 assumes the reader keeps `kernel:if` as a single atom (per
DD-01). Before writing the classifier change, **verify this
assumption empirically**:

1. Locate the reader's atom-parsing logic in
   `crates/lykn-lang/src/reader/`.
2. Write a unit test that parses `(kernel:if c t e)` and asserts
   the head element is a single `SExpr::Atom("kernel:if")` (not
   two atoms or a member-access shape).
3. Run the test. Observe whether it passes.

**If the test passes:** assumption holds; proceed to M17-3.
**If the test fails:** the reader doesn't preserve `kernel:` as
part of an atom. **STOP and surface.** This is methodology-
relevant; DD-58's classifier dispatch assumes the atom shape, and
if the reader is doing something different, the design needs
adjustment.

### M17-3 / M17-4 preflight — TDD-first discipline

Both rows REQUIRE failing-test-first. Per the wishlist-closing
methodology learning ("the C-6b template content debugging took
much longer than needed because I didn't write the failing test
first"), this is a hard MUST for both.

- For M17-3: the test asserts that `(kernel:if c t e)` classifies
  as `SurfaceForm::KernelPassthrough { ... }` (or whatever the
  appropriate variant). Run before the classifier change; should
  fail (either by panic, wrong variant, or some other observable
  miss). Commit the test. THEN implement. Commit the fix.
- For M17-4: the test asserts that `(kernel:nonexistent ...)`
  produces a diagnostic naming the form. Run before the validation
  logic; should fail. Commit the test. THEN implement. Commit the fix.

---

## Iteration budget

**5 iterations.** Expected 1–2 (this is a tightly scoped
additive change).

Per Duncan's 2026-05-16 override on iteration budgets: the cap
is a guard against compliance-theatre / infinite spin, not against
good-faith engineering iteration. If real issues surface, surface
them — don't sacrifice good engineering on the altar of time-budgets.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M17-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M17-1 through M17-8) with the
   final status (`done` / `deferred` / `no-op`) and Verify command
   output as evidence. **No prose summary** — per-row walk only.
2. For M17-3 and M17-4: cite the test commit SHA AND the fix
   commit SHA, in that order. Demonstrating TDD-first compliance
   is part of the deliverable.
3. Include a "Substrate-rule compliance" section addressing six
   rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant
   - TDD-first discipline (named explicitly)
4. Include a "Findings for fast-follow" section if any new
   findings surface (e.g., reader behaviour differs from
   assumption; `SurfaceForm::KernelPassthrough` needs adjustment;
   JS-side classifier already handles `kernel:` correctly so M18
   prereq is partially-satisfied). If none, say so explicitly.
5. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to modify `is_surface_form()` or
  `is_kernel_form()`. M18 scope.
- You do not need to add a strict-mode flag. M18 scope.
- You do not need to touch the JS compiler. Separate milestone
  after DD-37's classifier lands.
- You do not need to implement file-extension gating. DD-58
  Phase 4 / future milestone.
- You do not need to retire `_kernel`, `kernelArray()`, or
  `SetSymbol`. DD-58 Phase 5 / future milestone.
- You do not need to convert any existing tests. The milestone
  is additive; existing tests should continue to pass unchanged.

---

## Start

1. Read the required materials, in order.
2. Begin with M17-1 (baseline capture).
3. M17-2 (reader regression test) — preflight; if reader doesn't
   match DD-58's assumption, STOP and surface.
4. M17-3 (classifier accepts `kernel:` prefix) — TDD-first.
5. M17-4 (invalid `kernel:<form>` diagnostic) — TDD-first.
6. M17-5 (compile-both convergence) — empirical test of JS-side
   behaviour; honest disposition.
7. M17-6 (backward-compat verification) — run full suite.
8. M17-7, M17-8 — at closing.

Surface anything that looks off before working around it.
