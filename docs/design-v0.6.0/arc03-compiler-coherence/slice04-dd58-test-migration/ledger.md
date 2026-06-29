# Milestone M19: DD-58 Phase 1c — Test Migration + Strict-Mode Enforcement for Tests

> **Status:** open
> **Iteration budget:** 5 (expect 2–3 — bounded scope but the
> migration audit may surface unexpected patterns)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** [DD-58](../../docs/design/05-active/0059-dd-58-*.md), M17 + M18 + polish closing reports
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** M17 (kernel: escape) + M18 (closed-namespace dispatch + strict-mode flag) closed; DD-58 Phase 1 polish closed (2026-05-17 — closing report at `workbench/2026-05-17-dd58-phase1-polish-closing-report.md`, CDC review at `workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md`).
> **DD-58 Phase mapping:** This is Phase 1c — the third and final sub-piece of DD-58's "Phase 1." After M19, the strict-mode infrastructure exists AND is exercised by the test corpus. Phase 4 (file-extension gating, strict-mode-on-by-default for all `.lykn` files) is the subsequent milestone.

---

## Why this milestone exists

M17 + M18 + the Phase-1 polish work landed the strict-mode
classifier infrastructure as additive code paths. Strict mode
defaults to OFF; no production code or test exercises it. The
infrastructure is dormant.

M19 makes the infrastructure real:

- **Audits the existing test corpus** for bare kernel-only forms
  (`(const ...)`, `(let ...)`, `(var ...)`, `(function ...)`,
  `(quote ...)`, `(quasiquote ...)`).
- **Migrates affected tests** to either surface alternatives
  (`bind`, `cell`, `func`/`fn`/`lambda`) where idiomatic OR the
  `(kernel:<form> ...)` escape where the surface alternative
  isn't equivalent.
- **Turns ON strict mode for `.lykn` test execution** — the test
  runner passes `ClassifierOptions { strict: true }` to the
  classifier for test files.
- **Verifies all tests pass under strict mode** — closing the
  loop on Phase 1.

After M19, the test corpus serves as the regression net for
DD-58's closed-namespace rule. Any future change that
accidentally re-introduces overlap or violates the closed
namespace breaks tests, surfacing immediately.

This milestone is purely a "make the infrastructure real" step.
No new dispatch tables, no new classifier features, no JS-side
work, no production-code strict enforcement.

---

## What this milestone produces

1. **Audit document** at `workbench/verify/m19/test-migration-audit.md`:
   - Inventory of every `.lykn` test file containing bare
     kernel-only forms (`const`, `let`, `var`, `function`,
     `function*`, `quote`, `quasiquote`).
   - For each occurrence: file path, line range, current form,
     proposed migration (surface alternative OR kernel: escape),
     rationale for the choice.
2. **Test file migrations:**
   - `(const x val)` / `(let x val)` / `(var x val)` →
     `(bind x val)` (preferred — types-light surface binding) OR
     `(bind x (cell val))` if mutability is needed.
   - `(function name (args) body)` → `(func name :args ... :body ...)`
     where types are obvious OR `(fn (args) body)` / `(lambda (args) body)`
     for anonymous forms. `(kernel:function ...)` only when surface
     alternatives can't preserve semantics.
   - `(quote ...)` / `(quasiquote ...)` → `(kernel:quote ...)` /
     `(kernel:quasiquote ...)`. No surface alternative exists.
3. **Test runner change:** the test runner (in
   `packages/testing/` or wherever `lykn test` orchestrates) passes
   `ClassifierOptions { strict: true }` when classifying `.lykn`
   test files.
4. **All tests pass under strict mode.** Specifically:
   - `make test-lykn` passes with strict ON for test compilation.
   - `./bin/lykn test test/forms/` passes with strict ON.
   - Pass counts strictly ≥ post-polish baseline (1021 Rust tests
     / 292 surface / 670 forms as of polish closure 2026-05-17).
5. **Backward-compat for non-test paths:**
   - `lykn compile` for production code still uses strict OFF by
     default — no enforcement of closed-namespace for `.lykn`
     production files yet.
   - Strict-mode-on-by-default for all `.lykn` files is M20+
     (Phase 4, file-extension gating).

This milestone does **not**:

- Implement file-extension gating for non-test files (M20+).
- Touch the JS compiler.
- Add or modify dispatch tables (those are frozen as M17 + M18 +
  polish left them).
- Retire `_kernel`, `kernelArray()`, `SetSymbol` (DD-58 Phase 5).
- Address the lambda emission fix (DD-58 Breaking Change #3 —
  separate milestone, codegen-side).

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md) — subagent rules
3. [`assets/ai/CLAUDE.md`](../../assets/ai/CLAUDE.md) "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"Per-layer form enumeration" (kernel-only list + surface alternatives)
   - §"Breaking changes inventory" (canonical migration patterns)
   - §"Migration sequencing Phase 1"
5. **M17 + M18 closing reports + CDC reviews**, and the DD-58
   Phase 1 polish closing report
   (`workbench/2026-05-17-dd58-phase1-polish-closing-report.md`)
   + CDC review
   (`workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md`).
6. The test corpus: `test/forms/`, `test/surface/`, plus any
   package-internal test files.
7. The test runner: `packages/testing/helpers.js` and any Rust-
   side test orchestration in `crates/lykn-cli/src/main.rs`
   (`compile_lykn_test_files`).

---

## Design dispositions

**On migration preference order.** When a kernel-only form has
multiple possible migrations, prefer in this order:
1. **Surface alternative idiomatic for the use case.** E.g.,
   `(const x 42)` with an immutable simple value → `(bind x 42)`.
2. **Surface alternative with type annotation.** E.g.,
   `(const x 42)` with a known type → `(bind x :int 42)`.
3. **`(kernel:<form> ...)` escape.** Only when surface
   alternatives can't preserve semantics (e.g., `(const x 42)`
   where the test specifically exercises kernel-`const` emission).

**On `(function ...)` migration specifically.** `function` is
the named-function-declaration form. Surface alternatives:
- `(func name :args ... :body ...)` — full surface function with
  contracts (preferred when types are obvious).
- `(bind name (fn ... ))` — anonymous function bound to a name
  (when contracts aren't needed but the function-as-value form
  is desired).
- `(kernel:function name (args) body)` — explicit kernel escape
  (only when the surface alternatives don't preserve the test's
  intent).

**On `(quote ...)` / `(quasiquote ...)`.** No surface alternative
exists. All occurrences migrate to `(kernel:quote ...)` /
`(kernel:quasiquote ...)`. If a test substantively depends on
the bare form (e.g., a test that demonstrates the bare form
works), discuss with CDC whether to migrate the test OR
deprecate it.

**On test runner integration.** Two acceptable approaches:
- **Direct flag:** the test runner passes `strict: true` to
  `classify_with_options`. Simplest; works if the test runner has
  a single classification call site.
- **Per-file detection:** the test runner detects `.lykn`
  extension and passes `strict: true`; non-test `.lykn` files
  compiled via `lykn compile` still use strict: false.
  Slightly more complex but matches DD-58 Phase 4's eventual
  shape.

**CDC lean: per-file detection** (option 2) — pre-positions the
runner for Phase 4 and avoids a second refactor. CC's call if a
structural reason favors option 1.

**On audit batching.** The audit doc is a single document
listing ALL occurrences. Migrations land in commit batches —
one batch per ~5-10 files for review tractability. Each batch
commit cites the audit doc + the migration choices.

**On TDD-first.** This is a migration milestone (changing
existing tests), not a feature milestone. TDD-first applies
differently:
- For the test runner change (M19-4): TDD-first IS applicable.
  Write a test that asserts test compilation uses strict mode;
  it should fail pre-change.
- For migration commits (M19-3): the migrations themselves are
  the discipline — the test continues to pass after migration
  (proving the migration is semantics-preserving). The
  pre-migration test pass IS the "test exists" evidence.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M19-1 | Baseline state captured at `workbench/verify/m19/baseline.txt` | `test -f workbench/verify/m19/baseline.txt && grep -cE "^=== " workbench/verify/m19/baseline.txt` returns ≥4 | polish | Spec 1 | open | | Pre-state: current test counts; strict-mode dormant; bare-kernel-form occurrence counts |
| M19-2 | Audit doc exists at `workbench/verify/m19/test-migration-audit.md` with every bare-kernel-only-form occurrence inventoried | `test -f workbench/verify/m19/test-migration-audit.md`; `grep -cE "^\| " workbench/verify/m19/test-migration-audit.md` matches the count of `(const\|let\|var\|function\|function\*\|quote\|quasiquote) ` occurrences in `.lykn` test files | serious | Spec 1; DD-58 enumeration | open | | The audit is the spec for M19-3; without it, migrations are not auditable |
| M19-3 | All bare-kernel-only-form occurrences in `.lykn` test files migrated per the audit's prescribed choice | After migrations: `grep -rE '\(const \|^\(const\|\(let \|\(var \|\(function \|\(quote \|\(quasiquote ' test/forms/*_test.lykn test/surface/*_test.lykn 2>/dev/null \| wc -l` returns 0 (modulo cases explicitly disclaimed in the audit as out-of-scope) | serious | Spec 2; DD-58 Breaking Changes Inventory | open | | Migrations land in batches of 5-10 files; each batch commit cites the audit |
| M19-4 | Test runner passes `strict: true` for `.lykn` test classification | TDD-first: failing test asserts test runner uses strict mode; passes after change. Verify: locate the test-runner classifier call site and confirm `ClassifierOptions { strict: true }` is used. `grep -E "strict.*true\|ClassifierOptions" packages/testing/helpers.js crates/lykn-cli/src/main.rs` shows the change | serious | Spec 3; DD-58 Migration sequencing Phase 1c | open | | TDD-first required for the runner change |
| M19-5 | All tests pass under strict mode | `make test-lykn` exits 0; `./bin/lykn test test/forms/` exits 0; pass counts strictly ≥ post-polish baseline | serious | Spec 4 | open | | The substantive closure criterion — if this fails, M19's migration is incomplete |
| M19-6 | Backward-compat for non-test paths preserved | `cargo test -p lykn-lang`, `cargo test -p lykn-cli` exit 0; `lykn compile` for production code still uses strict OFF by default (verify by inspecting `cmd_compile` in main.rs) | correctness | Spec 5; M18 invariant continuity | open | | Strict-on-by-default for production is M20+ scope |
| M19-7 | Closing report substrate-rule compliance section | `grep -cE "^## Substrate-rule compliance" workbench/2026-*-M19-closing-report.md` returns 1; six rules named | correctness | Methodology continuity | open | | TDD-first named explicitly |
| M19-8 | Single coherent commit chain | `git log --grep="M19\|test.migration\|strict.*test\|DD-58" --oneline` returns ≥3 commits (audit + migration batches + runner change). For M19-4 (runner change) the test commit precedes the fix commit | correctness | TDD-first discipline | open | | |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 2–3.

2. **Read DD-58, M17/M18 closing reports, and the Phase 1
   polish closing report + CDC review.** The polish has closed
   (2026-05-17); the gaps that would have blocked migration —
   `?`, `async`, `dynamic-import` strict-mode dispatch — are
   resolved. M19 may proceed without a waiting gate. DD-58's
   flavor (b) enumeration has been updated to include all three
   (refinement-log entry "2026-05-17 (Phase 1 polish — `?`,
   `async`, `dynamic-import` confirmed as flavor (b))").

3. **Subagent delegation policy:** lookup-only. The audit
   itself (M19-2) involves significant grep work — that's
   appropriate for subagent delegation if useful. Migration
   choices (M19-3) and runner change (M19-4) are judgment work;
   main CC context only.

4. **Order of work:**
   - M19-1 (baseline) — captures pre-state.
   - M19-2 (audit) — produce the complete inventory FIRST.
     Migrations cannot proceed without it.
   - M19-3 (migrations) — land in batches of 5-10 files. Each
     batch commit cites the audit. After each batch:
     `make test-lykn` to verify no regressions.
   - M19-4 (runner change) — TDD-first. Test asserts strict mode
     is used; fix changes the runner.
   - M19-5 (all tests pass under strict) — run the full test
     suite. If any test fails, surface — likely a missed
     migration OR a polish-prompt gap.
   - M19-6 (backward-compat) — verify production-code paths
     unchanged.
   - M19-7, M19-8 — at closing.

5. **Anti-shortcut explicit instructions:**
   - **Do NOT migrate a test by adding `kernel:` prefix when a
     surface alternative is idiomatic.** The migration preference
     order (surface → typed-surface → kernel-escape) is binding.
   - **Do NOT change strict's default for production code.** M20+
     scope. M19's runner change is scoped to test files only.
   - **Do NOT modify dispatch tables.** Those are frozen.
   - **Do NOT touch the JS compiler.**
   - **Do NOT auto-pass safety-bypass flags** per CLAUDE.md.

6. **If the audit surfaces a pattern the polish prompt didn't
   address** (e.g., a kernel-only form not in DD-58's
   enumeration), STOP and surface. The polish work may need a
   sibling addition.

7. **If a migration breaks a test's substantive intent** (e.g.,
   the test specifically demonstrates kernel-`const` emission
   behavior), use the `(kernel:const ...)` escape — DON'T pick
   a surface alternative that changes what's being tested.
   Disclose in the audit doc.

8. **Compliance theatre is the named failure mode.** Per-row
   walk in the closing report MUST cite the audit doc, the
   migration batch commit SHAs, and the runner-change commit
   SHAs.

---

## CDC instructions

1. **Count rows at close.** Closing report row count = 8.

2. **Run every Verify command independently.** Particular focus:
   - M19-3's grep counts (verifying no remaining bare kernel-only
     forms in test files).
   - M19-5's test suite pass under strict mode.

3. **Spot-check audit-doc completeness.** Pick 5 random `.lykn`
   test files and verify the audit accounts for every
   bare-kernel-only-form occurrence in them.

4. **Spot-check migration choices.** Pick 5 random migrated
   occurrences and verify the choice (surface alternative vs.
   kernel: escape) matches the audit's prescription. Watch for
   silent over-use of `kernel:` escape where a surface
   alternative would have been idiomatic.

5. **Watch for spec-softening.** Particular risks:
   - The audit is incomplete (misses occurrences) — would
     leave un-migrated tests that fail under strict.
   - Migration uses `kernel:` escape consistently to avoid the
     judgment work of surface-alternative selection.
   - The runner change is conditional / scoped narrowly so
     strict mode isn't actually exercised by the test suite.

6. **Watch for silent drops.** All 8 rows reach final status.

---

## What worked

_(Filled in at milestone close.)_

## Closure

_(Filled in at milestone close. Closed at commit `<SHA>` on
`<date>`. CDC verification: `<session>`. Total rows: 8. Done:
`<n>`. Deferred: `<n>`. No-op: `<n>`.)_
