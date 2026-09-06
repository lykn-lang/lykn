# M21 Implementation Prompt for CC — DD-37 Phase 0: Bundle-Size Baseline, CI Guard, and `not` Pilot

## Read this first

Your milestone is M21. The spec is at
`workbench/milestones/M21-dd37-phase0-bundle-size-baseline-and-not-pilot-ledger.md`.
That file is canonical — it has the full ledger, the 10 design
calls, the per-row preflight discipline, and the spec sections.

**This is DD-37 Phase 0.** The DD-58 phase chain requires it:
DD-58 Phase 2 needs DD-37 Phase 3+, which requires DD-37 Phase 0
acceptance (bundle baseline + CI guard + one-form pilot). M21
delivers all three.

This is also a **domain shift**. M17 through M20 were Rust-side
classifier work. M21 is JS-side — building a bundle, measuring
its size, wiring CI, and extracting one surface form (`not`)
through DD-37's new architecture. Different rhythm, different
tooling, but the methodology continues unchanged.

M21 closes DD-37's Phase 0 acceptance and delivers an empirical
go/no-go for DD-37 step 3+ (per-form migration). If `not`'s
per-form cost extrapolates within budget, the per-form migration
proceeds in M22+. If it doesn't, the pre-agreed Alt C fallback
(classifier-only, surface forms stay as macros) becomes the
discussion.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.

- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Subagent OK for
  lookups (e.g., existing CI config, esbuild availability,
  Makefile conventions). Architectural decisions and the pilot
  extraction stay in main CC context.

- **You MUST use TDD-first with PAIRED COMMITS for M21-6 (`not`
  pilot).** Test-only commit precedes fix-only commit. SHA
  boundary visible in `git log`. This is the methodology MUST
  from M19/M20 — non-negotiable here.

- **You MUST write the failing test FIRST and verify it fails
  pre-fix.** For the `not` pilot, the failing test should
  demonstrate that the NEW architecture path doesn't exist yet
  (asserting equivalence between old and new path; new path
  errors or doesn't exist; test fails). Post-fix, both paths
  produce identical kernel output; test passes.

- **You MUST measure baseline BEFORE making any changes** that
  could affect bundle size. The baseline is the reference point
  for the pilot delta.

- **You MUST record empirical numbers honestly.** No rounding to
  favorable figures; no excluding "outlier" forms from
  extrapolation; no choosing the lower-bound estimate when the
  upper bound is the safer signal. The methodology is honest
  measurement → evidence-based decision.

- **You MUST stop and surface on dissonance.** Examples:
  - Bundle baseline differs dramatically from the ~25KB gzipped
    expectation (could indicate something is misconfigured).
  - `not` extraction reveals a hidden coupling to `surface.js`
    internals that breaks the clean-extraction model.
  - esbuild produces unexpected output (e.g., includes
    dev-dependencies or excludes production code).
  - The per-form cost extrapolation suggests Alt C is needed.

- **You MUST NOT escalate to Alt C unilaterally.** If pilot
  extrapolation exceeds the DD-37 budget, surface to CDC. The
  escalation decision is CDC + Duncan, not CC.

- **You MUST NOT migrate any surface form other than `not`.**
  Other forms wait for M22+. M21 is Phase 0 only.

- **You MUST NOT modify the Rust compiler.**

- **You MUST NOT modify the kernel compiler path.** The kernel
  path (`packages/lang/compiler.js`'s kernel-form handling) is
  separate from the surface architecture extraction.

- **You MUST NOT add esbuild as a runtime dependency.** Build-time
  only. Runtime should remain dependency-free per project
  conventions.

- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.

- **You MUST NOT auto-accept any insta snapshot diffs** per
  AGENTS.md "Snapshot testing."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/AGENTS.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **The M21 ledger** at
   `workbench/milestones/M21-dd37-phase0-bundle-size-baseline-and-not-pilot-ledger.md`.
   Read the 10 design calls carefully.
5. **DD-37** at `docs/design/05-active/0047-dd-37-js-surface-compiler-architecture.md`:
   - §"Acceptance state and Phase 0 criterion" (lines 30–62) —
     mandatory; the gate this milestone clears.
   - §"Gradual migration, not a big-bang rewrite" (lines 864–916)
     — the 9-step migration sequence including the steps the
     pilot exercises.
   - §"Six-module decomposition" (lines 187–270) — target
     architecture.
   - §"Bundle size considerations" (lines 1027–1114) — budget
     rationale and Alt C fallback context.
6. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`,
   §"Migration sequencing" — Phase 2 context.
7. **M20 closing CDC review** at
   `workbench/2026-05-17-M20-closing-cdc-review.md` — TDD-first
   methodology learnings that apply to M21-6.
8. **Current JS compiler source** at `packages/lang/`:
   - `surface.js` (~2,135 lines) — where `not` lives today.
     Locate its current implementation before extraction.
   - `compiler.js`, `expander.js`, `reader.js`, `mod.js` — supporting context.
9. **Current browser package** at `packages/browser/`:
   - `mod.js`, `compiler.js`, `scripts.js`, `deno.json`.
10. **Existing build/CI infrastructure:** `Makefile`,
    `project.json`, `deno.json`, `.github/workflows/` (if exists),
    any other CI config.

---

## Per-row preflight discipline

The M21 ledger has the full per-row preflight notes. Headline ones:

### M21-2 — esbuild invocation shape

Preflight: check esbuild availability and pick invocation. CDC
preference order: esbuild CLI directly → `deno run -A npm:esbuild`
→ bespoke `deno_emit` script. Surface trade-off if it has
substantive implications (e.g., adding npm dependency vs. staying
Deno-native).

### M21-4 — CI guard preflight

Preflight: check for existing CI config (`.github/workflows/`,
etc.). If exists, integrate. If not, manual-runnable script with
threshold-breach exit code AND a fast-follow ticket counts as
partial M21-4 completion.

### M21-6 — `not` pilot TDD-first

PAIRED COMMITS REQUIRED. Test commit asserts `(not x)` produces
identical kernel output via both the old surface-macro path AND
the new architecture path. Pre-fix, the new path doesn't exist;
test fails. Fix commit moves `not` through `surface-ast.js` +
`classifier.js`. Post-fix, both paths produce identical output;
test passes.

SHA boundary visible in `git log`. The grep-level verify for
M21-11 will check both commits exist with appropriate temporal
ordering.

### M21-7 — extrapolation honesty

Per-form cost from `not` × 20 = lower bound estimate.
Per-form cost × 20 × scaling factor (acknowledging `func`,
`match`, `bind` are larger) = upper bound estimate. Pick midpoint
or upper bound for go/no-go check. If upper bound exceeds DD-37's
+20KB gzipped total budget, surface "Alt C may be necessary" —
but do NOT escalate. CDC + Duncan decide.

---

## Iteration budget

**5 iterations.** Expected 3–4. Substantive scope: bundle tooling
+ CI guard + first-time architectural extraction. Per Duncan's
2026-05-16 iteration-budget override, the cap guards against
compliance-theatre. If the pilot surfaces architectural questions,
surface to CDC — don't compress at the cost of correctness.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M21-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M21-1 through M21-11) with the
   final status (`done` / `deferred` / `no-op`) and Verify command
   output as evidence.

2. **For M21-6 specifically, cite BOTH commit SHAs** (test-only
   and fix-only) and explicitly call out the paired-commit
   discipline.

3. Include a summary table:
   - Baseline measurements (raw, minified, gzipped).
   - Post-pilot measurements (raw, minified, gzipped).
   - Delta per measurement.
   - Extrapolation × 20 forms (lower bound, upper bound).
   - Budget check vs. DD-37's +20KB gzipped total budget.
   - Go/no-go recommendation for DD-37 step 3+ continuation.

4. Include the 10 design-call confirmations from M21-1 (or any
   substantive escalation if the preflight surfaced one).

5. Include a "Substrate-rule compliance" section addressing six
   rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant (production code paths unchanged)
   - **TDD-first discipline — M21-6 named explicitly with paired
     commit SHAs cited.**

6. Include a "Findings for fast-follow" section. Expected at
   minimum:
   - The per-form cost extrapolation discussion.
   - Any CI integration items deferred (if M21-4 used the
     fallback path).
   - Any architectural questions the pilot surfaced about the
     new classifier shape, the surface-ast.js layout, or the
     emitter transform pattern.

7. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- Migrate any surface form other than `not`.
- Complete DD-37 steps 4-8 (delete `_kernel`, delete
  `kernelArray()`, trim `compiler.js`, intro
  `compileKernel`/`compileSurface`, structured diagnostics).
- Escalate to Alt C if pilot is concerning — surface to CDC.
- Retire `_kernel` or `kernelArray()`. Those happen post-
  migration.
- Touch the Rust compiler.
- Touch the kernel compiler path
  (`packages/lang/compiler.js`'s kernel-form handling).
- Fix the lambda emission divergence (DD-58 Breaking Change #3
  — Phase 5).
- Add file-extension dispatch for production `.lykn` files
  (DD-58 Phase 4 — later milestone).
- Make Phase 2/3 of DD-58 happen — M21 unblocks them; their
  implementation is later milestones.

---

## Start

1. Load LEDGER_DISCIPLINE.md.
2. Read the M21 ledger carefully, especially the 10 design calls.
3. M21-1 (baseline directory + design confirmation).
4. M21-2 (esbuild + `make bundle-size`).
5. M21-3 (baseline recorded in DD-37).
6. M21-4 (CI guard wired OR fallback + ticket).
7. M21-5 (pre-pilot infrastructure).
8. M21-6 (`not` pilot) — TDD-first PAIRED COMMITS.
9. M21-7 (delta measured + extrapolation recorded).
10. M21-8 / M21-9 (test pass + backward-compat).
11. M21-10 / M21-11 (closing report + commit chain verify).

Surface anything that looks off before working around it.
