# M22 Implementation Prompt for CC — DD-37 Step 3: Per-Form Migration + CI Integration

## Read this first

Your milestone is M22. The spec is at
`workbench/milestones/M22-dd37-step3-per-form-migration-and-ci-integration-ledger.md`.
That file is canonical — it has the full ledger, the 8 design
calls (including batch ordering), per-row preflight discipline,
and the spec sections.

**M22 executes DD-37 step 3 for the remaining ~19 surface forms.**
M21's pilot (`not` extracted) proved the new architecture is
bundle-size-efficient (+109 bytes gzipped per form) and behavior-
preserving. The pilot delta extrapolates to +2.2 KB lower bound /
+6.5 KB upper bound — comfortably within DD-37's +20 KB budget.
Go signal: GO.

M22 also folds in the CI integration fast-follow from M21-4:
wiring the `make bundle-size` script's threshold-breach exit
codes into PR-level CI checks so every batch is self-measuring
against the budget.

This is a **substantial milestone with high paired-commit
discipline requirements** — 8+ batches, each requiring TDD-first
paired commits. With 5 iterations expected (4-6 likely), it's the
biggest scope this thread has tackled. The shape is repetitive
(extract form → test → measure → next form), but the discipline
matters at every batch boundary.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.

- **You MUST follow the subagent delegation policy.** Per-form
  extraction is judgment work; main CC context only. Subagent OK
  for lookup work (finding form references, finding CI config).

- **You MUST use TDD-first PAIRED COMMITS per batch.** Each batch
  (8+ batches total) is one paired-commit pair. Test commit
  precedes fix commit. SHA boundary visible in `git log`. Single-
  commit batches will fail M22-10's verify command. This is the
  methodology MUST from M19/M20/M21 — non-negotiable.

- **You MUST run `make bundle-size` after every batch.** Per-batch
  +2KB warn / +5KB hard fail threshold. If a batch trips hard
  fail, STOP and surface — don't accumulate breaches.

- **You MUST surface special-case preflight findings (M22-4).**
  `macro` / `import-macros` / `=` / `!=` are NOT routine. Before
  extracting, surface whether the standard emit pattern fits or
  needs a variant. Architectural questions go to CDC; don't work
  around quietly.

- **You MUST preserve backward-compat for production paths.**
  `lykn compile` / `lykn run` for non-test `.lykn` files produces
  identical output pre-M22 vs. post-M22. Spot-check at least 3
  representative files.

- **You MUST stop and surface on dissonance.** Examples:
  - A form's per-batch delta is anomalously high (even if within
    threshold).
  - A form's existing implementation has a hidden coupling that
    breaks the clean-extraction model.
  - Cumulative delta approaches +15KB before all batches done.
  - Special-case preflight surfaces architectural questions.

- **You MUST NOT skip per-batch bundle-size checks.** The whole
  point of the per-batch discipline is to catch anomalies early.

- **You MUST NOT combine multiple batches into one commit pair.**
  Each batch is its own paired-commit pair.

- **You MUST NOT migrate `unquote` / `unquote-splicing`.** Out of
  scope; handled by the expander's quasiquote logic inline.

- **You MUST NOT delete `_kernel` marker or `kernelArray()`
  helper.** DD-37 step 4-5 — separate milestone (likely M23).

- **You MUST NOT touch the Rust compiler.**

- **You MUST NOT modify the kernel compiler path.**

- **You MUST NOT escalate to Alt C unilaterally.** If cumulative
  delta approaches +15KB before batches complete, surface to CDC.
  CDC + Duncan make the call.

- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.

- **You MUST NOT auto-accept any insta snapshot diffs** per
  AGENTS.md.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md`
4. **The M22 ledger** at
   `workbench/milestones/M22-dd37-step3-per-form-migration-and-ci-integration-ledger.md`.
   Read the 8 design calls carefully, especially the batch
   ordering and special-case escalation policy.
5. **M21 closing report + CDC review** (the pattern M22 scales):
   - `workbench/2026-05-17-M21-closing-report.md`
   - `workbench/2026-05-17-M21-closing-cdc-review.md`
6. **M21 implementation artifacts** (the reference shape):
   - `packages/lang/surface-ast.js` — Not constructor pattern
   - `packages/lang/classifier.js` — classifySurfaceForm + emitSurfaceForm pattern
   - `packages/lang/expander.js` lines 730-740 — classifier integration point
   - `scripts/bundle-size.js` — measurement script
7. **DD-37** at `project02-language-toolchain-alignment/arc03-compiler-coherence/artifacts/design/05-active/0047-dd-37-js-surface-compiler-architecture.md`:
   - §"Gradual migration, not a big-bang rewrite" (lines 864-916)
   - §"Bundle size considerations" (lines 1027-1114)
   - **Refinement log entries 2026-05-17 (M21 baseline + pilot
     delta)** — the reference points
8. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`:
   - §"Per-layer form enumeration" — surface namespace
9. **`packages/lang/surface.js`** (~2,123 lines after `not`
   removed) — read each form's current macro implementation
   before extracting
10. **Existing CI config** (`.github/workflows/` or similar) for
    M22-2 wiring

---

## Per-row preflight discipline

The M22 ledger has the full per-row preflight notes. Headline ones:

### M22-1 — Form inventory authoritative

Produce a complete inventory before starting batches. Enumerate
every surface form currently registered as macro in `surface.js`.
Rough size estimate per form. Assign each to a batch per CDC's
ordering — or to a different batch if size warrants.

### M22-2 — CI integration preflight

Check for existing CI config. If exists, add bundle-size job. If
not, escalate — M22 doesn't invent CI infrastructure.

### M22-3 / M22-4 — Per-batch discipline

Each batch:

1. **Test commit FIRST.** Regression tests for each form in the
   batch asserting identical kernel output via both paths. Tests
   fail pre-fix (the new path doesn't have those forms yet).
2. **Commit the tests.**
3. **Fix commit.** For each form: surface-ast.js constructor +
   classifier.js case (both classifySurfaceForm and
   emitSurfaceForm) + remove from surface.js.
4. **Commit the extraction.**
5. **Verify tests pass post-fix.**
6. **Run `make bundle-size`.** Record per-batch delta.
7. **If +5KB hard fail OR per-form delta anomalously high**,
   STOP and surface.
8. **Next batch.**

### M22-4 special-case preflight

Before starting the special-case batch, read each form's existing
implementation carefully. Identify whether the standard
`emitSurfaceForm` pattern works OR whether a variant is needed.
Surface findings to CDC BEFORE implementing. Don't work around.

---

## Iteration budget

**5 iterations.** Expected 4–6. The scope is substantial (~22-28
forms across 8-9 batches). Per Duncan's standing iteration-budget
override, the cap guards against compliance-theatre / infinite
spin, not good-faith engineering iteration. If the special-case
batch surfaces architectural questions, the count may legitimately
exceed 5.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-X-M22-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M22-1 through M22-10) with the
   final status and Verify command output as evidence.

2. **For each batch in M22-3 AND M22-4, cite BOTH commit SHAs**
   (test-only and fix-only). With 8+ batches, structure as a
   table for clarity. Explicitly call out the paired-commit
   discipline.

3. Include a summary table:
   - Total forms migrated.
   - Per-batch breakdown: form count, gzipped delta, cumulative
     delta from M21 baseline (27,630 bytes).
   - Final bundle measurements (raw / minified / gzipped).
   - Cumulative gzipped delta vs. DD-37's +20 KB total budget.

4. Design-call confirmations from M22-1 (or escalation).

5. "Substrate-rule compliance" section addressing six rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant
   - **TDD-first discipline — every batch's paired commit SHAs
     cited in the per-row table.**

6. "Findings for fast-follow" section. Expected at minimum:
   - Special-case batch architectural findings (if any).
   - Forms with anomalous per-form cost.
   - CI integration items deferred.
   - DD-37 step 4 setup (deleting `_kernel` marker) — what remains.

7. Name any uncertainty.

---

## What you do NOT need to do

- Migrate `unquote` / `unquote-splicing`.
- Delete `_kernel` marker or `kernelArray()` helper. M23 / DD-37
  step 4-5.
- Touch the Rust compiler.
- Touch the kernel compiler path.
- Modify dispatch tables in `forms.rs` / `dispatch.rs`.
- Fix the lambda emission divergence (DD-58 Breaking Change #3
  — Phase 5).
- Add file-extension dispatch for production `.lykn` files
  (DD-58 Phase 4 — later milestone).
- Invent CI infrastructure if none exists — escalate instead.
- Escalate to Alt C unilaterally — surface to CDC.
- Complete DD-58 Phase 2 — M22 lands DD-37 step 3 (most of Phase
  2's substantive content), but step 4-5 are M23+.

---

## Start

1. Load LEDGER_DISCIPLINE.md.
2. Read the M22 ledger carefully, especially the 8 design calls
   and batch ordering.
3. M22-1 (form inventory + design confirmation).
4. M22-2 (CI integration — wire the bundle-size job into existing
   CI).
5. M22-3a (simple routine batches 1-3, each with TDD-first paired
   commits and per-batch bundle-size measurement).
6. **M22-3b — helper extraction (NEW, 2026-05-17 amendment).**
   Before starting complex batches: extract the 9 internal helpers
   from `registerSurfaceMacros` (compileLetPattern, wrapReturnLast,
   buildTypeCheck, formatSExpr, toJsIdentifier, gensym, isKeyword,
   isArray, isSymbol) into `packages/lang/surface-helpers.js`.
   TDD-first paired commits: test commit asserts behavior
   unchanged; fix commit moves helpers out and updates `surface.js`
   imports. This is a behavior-preserving refactor that unblocks
   the complex-form batches.
7. M22-3c (complex routine batches 4-8 — classifier.js imports
   helpers from surface-helpers.js).
8. M22-4 (special-case batch with preflight escalation).
9. M22-5 / M22-6 / M22-7 (verification).
10. M22-8 / M22-9 / M22-10 (DD-37 update + closing + commit chain).

Surface anything that looks off before working around it.

---

## 2026-05-17 amendment — Option C helper extraction (mid-M22 architectural call)

This amendment was added after CC surfaced an architectural finding
mid-M22: complex forms in batches 4-8 depend on 9 helper functions
scoped inside `registerSurfaceMacros` in `surface.js`. The helpers
cannot be imported directly. CC proposed three options; CDC
recommended Option C; Duncan confirmed.

**Option C decision:** Extract helpers to `surface-helpers.js`
before complex batches. This honors DD-37's central architectural
claim ("Built-in surface forms become static transforms, not
macros") — Option A's "delegate back to macros" approach would
have compromised it.

**Order of operations:**

1. **Commit batches 1-3 cleanly.** Get the simple-form work to a
   good commit state before pausing for the architectural step.
2. **Helper extraction (M22-3b).** TDD-first paired commits.
   New file `surface-helpers.js`; `surface.js` updated to import
   from it; bundle-size measured (delta should be minimal — pure
   refactor).
3. **Resume complex batches (M22-3c).** classifier.js's emit
   transforms import the helpers from `surface-helpers.js`.

**Why Option C, not A or B:**

- **Option A** (emit delegates back to existing macro
  implementations): doesn't deliver DD-37's static-transform
  claim; `_kernel` retirement (DD-37 step 4) stays blocked.
- **Option B** (full inline extraction; classifier.js ~800
  lines): messy; risks bugs during reimplementation.
- **Option C** (helpers in shared module): honors DD-37's
  architectural intent; classifier.js stays reasonable
  (~400-500 lines projected); helper logic remains in one
  place; minimal duplication risk.

**Iteration budget reality:** This amendment pushes M22 past the
nominal 5-iteration cap. Per Duncan's standing iteration-budget
override (the cap guards against compliance-theatre / infinite
spin, not against good-faith engineering iteration), this is
acceptable.
