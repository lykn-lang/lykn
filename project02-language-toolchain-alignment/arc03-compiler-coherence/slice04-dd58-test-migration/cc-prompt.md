# M19 Implementation Prompt for CC — DD-58 Phase 1c: Test Migration + Strict-Mode Enforcement

## Read this first

Your milestone is M19. The spec is at
`workbench/milestones/M19-dd58-phase1c-test-migration-and-strict-mode-enforcement-ledger.md`.
That file is canonical.

**This is the third DD-58 implementation milestone.** M17 +
M18 + the Phase-1 polish work landed the strict-mode classifier
infrastructure as additive code paths. M19 makes that
infrastructure real:

- Audits the test corpus for bare kernel-only forms.
- Migrates affected tests to surface alternatives (preferred) or
  `kernel:` escape (when surface alternatives don't preserve
  intent).
- Turns ON strict mode for `.lykn` test execution in the test
  runner.
- Verifies all tests pass under strict mode.

**After M19, the test corpus is the regression net for DD-58's
closed-namespace rule.** Future changes that accidentally
re-introduce overlap or violate the closed namespace break
tests immediately.

---

## Dependency on Phase 1 polish — CLOSED (2026-05-17)

**The Phase 1 polish has closed.** Closing report:
`workbench/2026-05-17-dd58-phase1-polish-closing-report.md`. CDC
review: `workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md`.
Disposition: accepted (10/10 items addressed, +11 tests, zero
regressions). The gaps that would have blocked test migration —
`?` ternary, `async`, `dynamic-import` strict-mode dispatch, and
diagnostic specialization — are all in place.

**Effect on M19:** CC may begin M19-1 and M19-2 immediately. No
waiting gate. The audit's complete inventory should reflect the
post-polish classifier behaviour (`?`, `async`, and
`dynamic-import` route correctly under strict; no test should need
migration on their account).

DD-58's flavor (b) enumeration was updated at the same time to
include `?`, `async`, and `dynamic-import` (Refinement log entry
"2026-05-17 (Phase 1 polish — `?`, `async`, `dynamic-import`
confirmed as flavor (b))"). The audit should reference DD-58's
current flavor enumeration when categorising forms.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. The audit (M19-2)
  involves significant grep work — subagent delegation is fine
  for the lookup itself. Migration choices and the runner change
  stay in main CC context.
- **You MUST use TDD-first for M19-4** (the runner change). Test
  asserts strict mode is used; fix changes the runner.
- **You MUST follow migration preference order:** surface
  alternative > typed-surface alternative > `kernel:` escape.
  Don't reach for `kernel:` to avoid the judgment work of
  surface-alternative selection.
- **You MUST stop and surface on dissonance.** If the audit
  surfaces a kernel-only form not in DD-58's enumeration OR a
  pattern the polish prompt didn't address, raise it before
  working around.
- **You MUST preserve production-code backward compat.** `lykn
  compile` for non-test `.lykn` files still uses strict OFF by
  default in M19. Strict-on-by-default for all `.lykn` files is
  M20+ scope.
- **You MUST NOT change strict's default for production code.**
- **You MUST NOT modify dispatch tables.** Those are frozen as
  M17 + M18 + polish left them.
- **You MUST NOT touch the JS compiler.**
- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.
- **You MUST NOT auto-accept any insta snapshot diffs** per
  AGENTS.md "Snapshot testing."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **The M19 ledger** at
   `workbench/milestones/M19-dd58-phase1c-test-migration-and-strict-mode-enforcement-ledger.md`.
5. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"Per-layer form enumeration" (kernel-only forms + surface alternatives)
   - §"Breaking changes inventory" (canonical migration patterns)
   - §"Migration sequencing Phase 1"
6. **M17 + M18 closing reports + CDC reviews** for context on
   the strict-mode infrastructure.
7. **The Phase 1 polish closing report** at
   `workbench/2026-05-17-dd58-phase1-polish-closing-report.md`
   plus the CDC review at
   `workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md` —
   describes the post-polish strict classifier state M19 builds on.
8. The test corpus: `test/forms/`, `test/surface/`, and any
   package-internal test files.
9. The test runner: `packages/testing/helpers.js` and any Rust-
   side test orchestration in `crates/lykn-cli/src/main.rs`
   (`compile_lykn_test_files`).

---

## Per-row preflight discipline

### M19-2 preflight — audit against post-polish classifier

The polish has closed (see above). The audit should reflect the
post-polish strict classifier behaviour — `?`/`async`/
`dynamic-import` route correctly under strict, so test occurrences
of these forms should pass through without migration. The audit
should focus on bare kernel-only forms (per DD-58's "Kernel-only
namespace" enumeration: `function`, `const`, `let`, `var`,
`quote`, `quasiquote`).

If the audit surfaces a form pattern that the polish did not
address (i.e., something behaving differently under strict than
under lax that DD-58's enumeration doesn't account for), stop
and surface to CDC before working around. This is the
"stop and surface on dissonance" MUST.

### M19-3 preflight — batch granularity

Migrate in batches of 5-10 test files per commit. Each batch:
1. Pick the files from the audit.
2. Apply migrations per the audit's prescribed choice.
3. Run `make test-lykn` to verify no regressions.
4. Commit the batch.
5. Move to next batch.

**Do NOT** do a single mega-commit covering all migrations —
review tractability suffers and any single bad migration is
hard to isolate.

### M19-4 TDD-first discipline

The runner change is a behavioral change to the test
infrastructure. TDD-first applies:
1. Write a test (probably an integration test) that asserts the
   test runner classifies `.lykn` files with strict mode ON.
   This test should fail pre-fix (because the runner currently
   passes strict: false / uses the lax classify()).
2. Commit the test.
3. Implement the runner change (modify the call site in
   `packages/testing/helpers.js` or wherever it lives).
4. Commit the fix.
5. Run the test; observe it passes.

---

## Iteration budget

**5 iterations.** Expected 2–3. The audit + migration is
substantial but bounded.

Per Duncan's 2026-05-16 iteration-budget override: the cap is
a guard against compliance-theatre / infinite spin, not against
good-faith engineering iteration. If the audit surfaces a much
larger migration surface than expected, surface it — don't try
to compress into fewer iterations at the cost of migration
quality.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M19-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M19-1 through M19-8) with the
   final status (`done` / `deferred` / `no-op`) and Verify
   command output as evidence.
2. Cite the audit doc path and the migration batch commit SHAs.
3. For M19-4 (runner change), cite the test commit SHA and the
   fix commit SHA.
4. Include a summary table:
   - Total bare kernel-only form occurrences in pre-state.
   - Migrations to surface alternatives (by form-class).
   - Migrations to `(kernel:<form> ...)` escape (with rationale
     summary per case).
   - Any out-of-scope occurrences (with explicit deferral
     reason).
5. Include a "Substrate-rule compliance" section addressing
   six rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant (production code paths
     unchanged)
   - TDD-first discipline (M19-4 named explicitly)
6. Include a "Findings for fast-follow" section if any new
   findings surface (e.g., a test pattern that should migrate
   but DD-58's enumeration doesn't cover its specific case).
7. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to migrate non-test `.lykn` files. M20+ scope.
- You do not need to turn strict mode ON by default for
  production code. M20+ scope (Phase 4 file-extension gating).
- You do not need to touch the JS compiler.
- You do not need to fix the lambda emission divergence (DD-58
  Breaking Change #3). Separate codegen milestone.
- You do not need to retire `_kernel`, `kernelArray()`,
  `SetSymbol`. DD-58 Phase 5.

---

## Start

Polish has closed; M19 is clear to begin.

1. Load the required reading (especially LEDGER_DISCIPLINE.md,
   the M19 ledger, DD-58, and the polish closing report + CDC
   review for the current classifier state).
2. Walk the ledger rows:
   - M19-1 (baseline) — captures pre-state.
   - M19-2 (audit) — produce the complete inventory of bare
     kernel-only forms across the test corpus.
   - M19-3 (migrations) — batches of 5-10 files; each batch
     commits separately; `make test-lykn` after each batch.
   - M19-4 (runner change) — TDD-first.
   - M19-5 (all tests pass under strict) — full suite run.
   - M19-6 (backward-compat for non-test paths) — verify
     production paths unchanged.
   - M19-7, M19-8 — at closing.

Surface anything that looks off before working around it.
