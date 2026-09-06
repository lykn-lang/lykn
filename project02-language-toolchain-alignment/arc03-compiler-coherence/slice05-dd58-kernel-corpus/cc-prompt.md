# M20 Implementation Prompt for CC — DD-58 Phase 1.5: Kernel Test Corpus + `.lyk` Runner Support

## Read this first

Your milestone is M20. The spec is at
`workbench/milestones/M20-dd58-phase15-kernel-test-corpus-and-lyk-runner-ledger.md`.
That file is canonical — it has the full ledger, the seven design
calls, the per-row preflight discipline, and the spec sections.

**This is DD-58 Phase 1.5 — coverage completion.** Phase 1 (M17 +
M18 + polish + M19) landed the strict-mode classifier infrastructure
and turned it on for `.lykn` test compilation. M19 surfaced a
substantive finding: **there are zero `.lyk` test files; kernel-form
testing today happens transitively, through runtime-compile strings,
or through Rust unit tests on the classifier API.** No first-class
source-level kernel test corpus exists.

M20 closes that gap:

- Adds `.lyk` runner support with kernel-only post-expansion
  classification.
- Adds `test/kernel/` with per-kernel-form `.lyk` test files.
- Adds representative coverage for flavor (b) passthroughs.
- Folds in the M19-4 negative-direction test (the missing TDD-first
  piece from M19's CDC review).
- Audits the ~20 `(compile "...")` strings M19-2 surfaced; records
  per-case disposition (additive, not migration).

---

## 2026-05-17 quote/quasiquote correction — READ BEFORE RESUMING

While CC was doing M20 audit work, the audit's "NOT FOUND" finding
for `quote`/`quasiquote` surfaced a CDC framing error in DD-58.
Those two forms are NOT kernel-only — they're flavor (b)
passthrough, produced by reader macros (`'expr` → `(quote expr)`,
`` `expr `` → `(quasiquote expr)`).

**Before resuming M20, CC MUST:**

1. Read the DD-58 refinement-log entry "2026-05-17
   (quote/quasiquote correction)" at the end of DD-58.
2. Read the M20 ledger's new "IMPORTANT: 2026-05-17
   quote/quasiquote correction" section (at the top of the
   ledger, right after the predecessors line).
3. Note the ripple changes already applied to:
   - `crates/lykn-lang/src/classifier/dispatch.rs`
     (`is_kernel_only_form` and `is_surface_form_strict`)
   - `crates/lykn-lang/src/classifier/forms.rs` (test
     inversion + diagnostic-match comment)
4. Adjust M20 work as follows:
   - **M20-5 drops from 6 to 5 files** (no `quote_test.lyk` /
     `quasiquote_test.lyk` in M20-5).
   - **M20-6 gains TWO MANDATORY files**: `quote_test.lyk`
     and `quasiquote_test.lyk` under flavor (b) "Macro / quoting"
     category.
   - **M20-9 must NOT use quote** as the rejected-form example;
     use `const` or `function` instead.

If CC has already committed work that conflicts with the
correction (e.g., a strict-rejection test for quote in any
`.lykn` file), STOP and surface to CDC before continuing.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.

- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. The `(compile "...")`
  string audit (M20-8) is appropriate for subagent delegation —
  it's grep work over a known fixed corpus. Runner change,
  classifier-mode design, and test authoring are judgment work;
  stay in main CC context.

- **You MUST use TDD-first with PAIRED COMMITS for M20-3 (runner
  change) AND M20-9 (M19-4 negative-direction test).** Test-only
  commit precedes fix-only commit. The SHA boundary must be
  visible in `git log`. Do NOT combine test + fix into one commit.
  This is the methodology learning from M19's CDC review — it is
  binding here.

- **You MUST write the failing test FIRST and verify it fails
  pre-fix.** For behaviour-change milestones, the failing test
  must demonstrate the NEW rejection path (negative-direction),
  not just continued success of pre-existing valid cases. M19's
  pattern (positive-only adapted TDD) is explicitly insufficient
  here.

- **You MUST confirm the seven design calls in the M20 ledger
  preamble before implementing.** Acknowledge them in
  `workbench/verify/m20/design-confirmation.md` (M20-2) OR
  surface a substantive question. If you surface a question,
  STOP and route to CDC before implementing the affected row.

- **You MUST preserve production-code backward compat.**
  `cmd_compile` for production `.lykn` files unchanged. The new
  `.lyk` runner code path is additive only.

- **You MUST stop and surface on dissonance.** Examples:
  classifier-mode design call doesn't fit the existing call-site
  shape; compile-string audit surfaces a kernel form not in
  DD-58's enumeration; the `.lyk` classifier mode would reject
  patterns in `examples/kernel/`.

- **You MUST NOT migrate `(compile "...")` strings.** The audit
  records dispositions; actual migration is a separate milestone
  if Duncan calls for it.

- **You MUST NOT modify the dispatch tables in `forms.rs` /
  `dispatch.rs`.** Those are frozen as M17 + M18 + polish left them.

- **You MUST NOT change strict's default for production code.**
  M21+ scope.

- **You MUST NOT touch the JS compiler.**

- **You MUST NOT exhaustively cover flavor (b) passthroughs.**
  Representative sample only (~6 tests). If you feel strongly that
  additional coverage is needed, surface to CDC — don't quietly
  expand scope.

- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.

- **You MUST NOT auto-accept any insta snapshot diffs** per
  AGENTS.md "Snapshot testing."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **The M20 ledger** at
   `workbench/milestones/M20-dd58-phase15-kernel-test-corpus-and-lyk-runner-ledger.md`.
   Read the seven design calls carefully.
5. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`.
6. **M19 closing report + CDC review:**
   - `workbench/2026-05-17-M19-closing-report.md`
   - `workbench/2026-05-17-M19-closing-cdc-review.md`
   - `workbench/verify/m19/test-migration-audit.md`
7. **M19-4 runner code** at `crates/lykn-cli/src/main.rs:563-612`
   (`compile_lykn_test_files`) — the parallel sibling your
   `.lyk` runner will mirror.
8. **Existing test infrastructure:** `test/forms/`, `test/surface/`,
   `packages/testing/helpers.js`, `cmd_test` in
   `crates/lykn-cli/src/main.rs`.
9. **Classifier internals:**
   - `crates/lykn-lang/src/classifier/mod.rs` (`ClassifierOptions`)
   - `crates/lykn-lang/src/classifier/dispatch.rs`
   - `crates/lykn-lang/src/classifier/forms.rs`

---

## Per-row preflight discipline

The M20 ledger has the full per-row preflight notes. The most
consequential ones:

### M20-3 (runner change) — classifier-mode shape

CDC lean: add `kernel_only: bool` to `ClassifierOptions` (symmetric
to M18's `strict: bool`). Confirm this fits the existing call-site
shape before implementing. If a different shape fits better,
surface to CDC.

### M20-3 / M20-9 — TDD-first paired commits

Both rows REQUIRE paired commits. Test commit MUST precede fix
commit. Combined commits will fail the M20-14 verify command.

The failing test must demonstrate the NEW rejection path:
- M20-3: a `.lyk` fixture with `(bind x 1)` at top level →
  runner rejects with "X is a surface form" diagnostic.
- M20-9: a `.lykn` fixture with `(const x 1)` at top level →
  runner rejects with the DD-58 strict-mode diagnostic.

### M20-5 / M20-6 — batch granularity

Test-file authoring: 2-4 files per commit. Run new suite after
each batch.

### M20-8 — compile-string audit

Subagent delegation appropriate. Produce per-case disposition;
record in `workbench/verify/m20/compile-string-audit.md`. Each
occurrence gets: file, line, form-class, disposition (one of:
`keep-runtime-only`, `keep-and-supplement`, `migrate-to-source`).
**Default disposition is `keep-runtime-only`** — M20 is additive,
not migration. Use the other dispositions only when the audit
finding suggests a substantive supplement or migration is
warranted.

---

## Iteration budget

**5 iterations.** Expected 3–4. Per Duncan's 2026-05-16 iteration-
budget override: the cap is a guard against compliance-theatre /
infinite spin, not against good-faith engineering iteration. If
the runner change or audit surfaces unexpected complexity, surface
to CDC — don't compress at the cost of correctness or methodology.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M20-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M20-1 through M20-14) with the
   final status (`done` / `deferred` / `no-op`) and Verify command
   output as evidence.

2. **For M20-3 and M20-9 specifically, cite BOTH commit SHAs**
   (test-only and fix-only) and explicitly call out the paired-
   commit discipline. Single-commit shortcuts will be flagged by
   CDC.

3. Include a summary table:
   - Kernel-only-form tests authored (target: 6 — one per form in
     DD-58's kernel-only enumeration).
   - Flavor (b) passthrough tests authored (target: ~6
     representative).
   - `compileBoth` adoption count across kernel tests.
   - `(compile "...")` audit case count with per-disposition
     breakdown.

4. Include the seven design-call confirmations from M20-2 (or any
   substantive escalation if the preflight surfaced one).

5. Include a "Substrate-rule compliance" section addressing six
   rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant (production code paths unchanged)
   - **TDD-first discipline — M20-3 and M20-9 named explicitly
     with paired commit SHAs cited.**

6. Include a "Findings for fast-follow" section if any new
   findings surface (e.g., a compile-string pattern that suggests
   supplemental coverage is warranted; a classifier-mode edge case;
   passthrough categories worth expanding beyond the
   representative sample).

7. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to migrate `(compile "...")` strings.
- You do not need to cover every flavor (b) passthrough.
- You do not need to migrate non-test `.lykn` files. M21+/Phase 4.
- You do not need to turn strict mode ON for production code.
  M21+/Phase 4.
- You do not need to touch the JS compiler.
- You do not need to fix the lambda emission divergence (DD-58
  Breaking Change #3 — Phase 5, per Duncan 2026-05-17).
- You do not need to retire `_kernel`, `kernelArray()`,
  `SetSymbol`. DD-58 Phase 5.

---

## Start

1. Load LEDGER_DISCIPLINE.md.
2. Read the M20 ledger carefully, especially the seven design
   calls.
3. M20-1 (baseline) — capture pre-state.
4. M20-2 (design confirmation) — acknowledge or surface dissent.
5. M20-3 (runner change) — TDD-first PAIRED COMMITS.
6. M20-4 (test directory + conventions doc).
7. M20-5 (kernel-only form tests) — batches of 2-3.
8. M20-6 (flavor (b) representative sample).
9. M20-7 (compileBoth verification).
10. M20-8 (compile-string audit — subagent appropriate).
11. M20-9 (M19-4 negative-direction test) — TDD-first PAIRED
    COMMITS.
12. M20-10 / M20-11 (full test run + backward-compat verify).
13. M20-12 (DD-58 coverage section).
14. M20-13 / M20-14 — closing report + commit chain.

Surface anything that looks off before working around it.
