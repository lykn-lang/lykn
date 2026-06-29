# M18 Implementation Prompt for CC — DD-58 Phase 1b: Closed-Namespace Dispatch + Strict-Mode Flag

## Read this first

Your milestone is M18. The spec is at
`workbench/milestones/M18-dd58-phase1b-closed-namespace-dispatch-and-strict-mode-ledger.md`.
That file is canonical — every acceptance criterion is enumerated
there with a grep-verifiable Verify command.

**This is the second DD-58 implementation milestone.** M17
landed the `kernel:` prefix recognition (foundation, additive).
M18 builds on it by:

- Adding strict-mode dispatch functions
  (`is_surface_form_strict()`, `is_kernel_only_form()`) that
  encode DD-58's closed-namespace enumeration.
- Adding a strict-mode flag to `classify()` that gates
  closed-namespace enforcement.
- **Preserving existing behaviour** — strict mode defaults to OFF.
  Nothing breaks for existing users or tests.

**M18 is purely additive.** The existing `is_surface_form()` and
`is_kernel_form()` functions stay untouched. M19 (next milestone)
will migrate existing tests to be strict-mode-compatible. M20+
will turn strict mode ON by default for `.lykn` files via file-
extension gating.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents.
- **You MUST use TDD-first** for M18-3 (strict-mode flag + routing),
  and per the M17 methodology learning, for M18-4 and M18-5 where
  practical. Each TDD-first row requires test commit → fix commit
  ordering in the git log.
- **You MUST disclose honest trivial-pass cases.** If M18-4 or
  M18-5 tests pass trivially because M18-3's fix bundled their
  substance, name this in the closing report (per M17 precedent
  — methodology-acceptable when disclosed).
- **You MUST stop and surface on dissonance.** If DD-58's
  enumeration doesn't match the existing dispatch-table reality
  (e.g., a form is listed as passthrough but doesn't exist in
  the current `is_kernel_form()`), STOP. The methodology asks
  you to surface, not silently work around.
- **You MUST preserve backward compatibility.** Strict mode
  defaults to OFF. Every existing test must pass unchanged. No
  existing call site of `classify()` may need modification.
- **You MUST NOT modify `is_surface_form()` or `is_kernel_form()`.**
  Those are the strict-OFF dispatch; they stay untouched in M18.
- **You MUST NOT change strict's default to ON.** Default is OFF;
  enforcement-by-default is M20+ scope.
- **You MUST NOT touch the emitter, codegen, JS compiler, or
  existing tests.** The lambda emission fix (DD-58 Breaking
  Change #3) and test migration are separate milestones.
- **You MUST NOT auto-pass safety-bypass flags** per CLAUDE.md
  "Lykn CLI safety gates."
- **You MUST NOT auto-accept insta snapshot diffs** per CLAUDE.md
  "Snapshot testing."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/CLAUDE.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **The M18 ledger** at
   `workbench/milestones/M18-dd58-phase1b-closed-namespace-dispatch-and-strict-mode-ledger.md`.
5. **DD-58** at
   `docs/design/05-active/0059-dd-58-kernelsurface-separation-closed-surface-namespace-with-kernelform-.-escape.md`.
   Focus on:
   - §"Architectural rule"
   - §"Per-layer form enumeration" — the canonical lists for
     the strict dispatch tables
   - §"Migration sequencing — Phase 1"
6. **M17 closing report + CDC review** for context on the
   precedent established for prefix-handler logic and TDD-first
   discipline:
   - `workbench/2026-05-17-M17-closing-report.md`
   - `workbench/M17-closing-cdc-review-2026-05-17.md`
7. The source materials listed in the ledger's "Source materials"
   section.

---

## Per-row preflight discipline

### M18-2 preflight — verify DD-58's enumeration matches reality

Before writing the new strict dispatch functions, **cross-check
DD-58's "Per-layer form enumeration" against the current
`is_surface_form()` and `is_kernel_form()` lists in
`crates/lykn-lang/src/classifier/dispatch.rs`**.

For each form in DD-58's enumeration:
- Is it in `is_surface_form()` today? In `is_kernel_form()`? In both? In neither?
- Does the DD-58 disposition (rich-unique / passthrough / namesake-sharing / kernel-only) match what the form does today?

**If anything in DD-58 contradicts the current dispatch tables**
(e.g., a form listed as passthrough doesn't exist in
`is_kernel_form()`), STOP and surface. DD-58 may need a
refinement-log entry to fix the enumeration.

If the cross-check holds, proceed to write the new dispatch
functions matching DD-58's enumeration.

### M18-3 / M18-4 / M18-5 TDD-first discipline

Per M17's precedent:
1. Write the failing test FIRST. Run. Observe failure. Commit
   the test.
2. THEN implement the fix. Run. Observe pass. Commit the fix.
3. The git log MUST show test-commit-before-fix-commit ordering.

**M17 methodology learning applied:** if M18-3's fix bundles the
positive-path (acceptance) and negative-path (rejection) such
that M18-4 or M18-5 tests pass trivially after M18-3 lands,
disclose honestly in the closing report. The "What Worked"
section is the right place for the methodology insight.

---

## Iteration budget

**5 iterations.** Expected 2–3.

Per Duncan's 2026-05-16 override on iteration budgets: the cap
is a guard against compliance-theatre / infinite spin, not against
good-faith engineering iteration. If real engineering issues
surface during implementation (e.g., the strict-mode routing
needs to handle a subtle case DD-58 didn't enumerate), surface
them — don't sacrifice good engineering on the altar of time-
budgets.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M18-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M18-1 through M18-9) with the
   final status (`done` / `deferred` / `no-op`) and Verify command
   output as evidence. **No prose summary** — per-row walk only.
2. For TDD-first rows: cite test commit SHA AND fix commit SHA,
   in that order. If a row's test passes trivially due to a
   bundled fix in a sibling row, disclose honestly.
3. Include a "Substrate-rule compliance" section addressing six
   rules:
   - CLAUDE.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant
   - TDD-first discipline (named explicitly)
4. For M18-2, name the API shape chosen for the strict-mode
   flag (direct parameter vs. options struct) and the reasoning.
5. Include a "Findings for fast-follow" section if any new
   findings surface (e.g., DD-58 enumeration needs refinement;
   strict-mode routing needs handling of an edge case DD-58
   didn't cover).
6. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to modify the existing `is_surface_form()` or
  `is_kernel_form()`. M18 is additive.
- You do not need to turn strict mode ON by default. M20+ scope.
- You do not need to fix the lambda emission (DD-58 Breaking
  Change #3). Separate milestone.
- You do not need to migrate any existing tests. M19 scope.
- You do not need to touch the JS compiler. Separate milestone
  after DD-37's classifier infrastructure lands.
- You do not need to implement file-extension gating. DD-58
  Phase 4 / M20+.
- You do not need to retire `_kernel`, `kernelArray()`, or
  `SetSymbol`. DD-58 Phase 5 / future milestone.

---

## Start

1. Read the required materials, in order.
2. Begin with M18-1 (baseline capture).
3. M18-2 preflight: cross-check DD-58's enumeration against
   reality. Surface any discrepancies.
4. M18-2 (write strict dispatch functions) — data-only addition.
5. M18-3 (strict-mode flag on `classify()`) — TDD-first.
6. M18-4 (strict rejection tests) — TDD-first (may pass trivially
   if M18-3 bundles diagnostic logic — disclose honestly).
7. M18-5 (strict acceptance tests) — TDD-first (same trivial-pass
   discipline).
8. M18-6 (kernel: escape under strict) — regression test for
   M17's work.
9. M18-7 (backward-compat verify) — run full test suite.
10. M18-8, M18-9 — at closing.

Surface anything that looks off before working around it.
