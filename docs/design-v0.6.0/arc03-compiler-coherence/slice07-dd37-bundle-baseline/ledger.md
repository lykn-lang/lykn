# Milestone M21: DD-37 Phase 0 — Bundle-Size Baseline, CI Guard, and `not` Pilot

> **Status:** open
> **Iteration budget:** 5 (expect 3–4 — bundler + CI infrastructure + one-form pilot)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** DD-58 Phase 2 chain. DD-58 Phase 2 requires DD-37 Phase 3+; DD-37 Phase 3+ requires DD-37 Phase 0 acceptance. M21 is the substantive Phase 0 work.
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** DD-58 Phase 1 complete (M17 + M18 + polish + M19 + M20 + closest-kernel-form refactor). M20 closing CDC review at `workbench/2026-05-17-M20-closing-cdc-review.md`.

---

## Why this milestone exists

DD-58 Phase 2 ("JS classifier — DD-37 Phase 3+") is the next
substantive layer of the kernel/surface separation work. But DD-58
Phase 2 has a prerequisite chain:

- DD-58 Phase 2 requires DD-37 Phase 3+ (per-form migration).
- DD-37 Phase 3+ has an explicit gate: **"Until all three [bundle
  baseline + CI guard + one-form pilot] are in place, the per-form
  migration work (Phase 3 of the migration sequence below) does
  not begin."** (DD-37 lines 30–62.)

So the strictly in-order next thing is DD-37 Phase 0 acceptance.
M21 is the substantive Phase 0 work, delivering all three
prerequisites:

1. **Reproducible bundle-size measurement** (`make bundle-size`
   using esbuild) capturing raw / minified / gzipped numbers for
   the full `@lykn/browser` payload.
2. **CI guard** with per-PR thresholds (+2KB gzipped warning,
   +5KB gzipped hard fail).
3. **One full-pipeline migration prototyped** — `not` moved out
   of `surface.js` through the new architecture (DD-37 steps 1 +
   2 + 3 for a single form), with delta measured and extrapolated.

After M21 closes, DD-37's Phase 0 acceptance criterion is met, and
the per-form migration work (DD-37 step 3 for the remaining ~19
forms) can proceed — informed by the pilot's empirical cost data
and gated by the CI bundle-size guard.

This milestone is also the substantive "go/no-go" for the full
DD-37 architecture. If `not`'s per-form cost extrapolates to a
total payload growth that exceeds the budget, DD-37's pre-agreed
"Alt C" fallback (classifier-only, surface forms stay as macros)
becomes the path forward.

---

## Design calls (decided in CDC drafting; flag dissent before M21 starts)

These are baked into the spec below. Duncan confirmed both calls
2026-05-17 (esbuild + `not` as pilot). Other calls are CDC
defaults — flag dissent before starting if any are wrong.

1. **Bundler: esbuild.** Battle-tested, fast, ESM-native. Invoked
   directly (CLI or via small Deno wrapper). Confirmed by Duncan
   2026-05-17.

2. **Pilot form: `not`.** Smallest possible — unary boolean
   operator with no kernel-output complexity. Confirmed by Duncan
   2026-05-17.

3. **Bundle target: `packages/browser/mod.js` with full transitive
   resolution.** This is the representative user-facing payload:
   what a browser tab loads when someone imports `@lykn/browser`.
   The `@lykn/lang` payload (currently ~167KB unminified across
   surface.js + expander.js + compiler.js + reader.js) is what
   drives bundle size; the browser wrapper itself is ~2.3KB.

4. **Three measurements per bundle: raw concatenated, minified,
   gzipped.** Threshold lives at gzipped (DD-37's spec); the other
   two are diagnostic (compressibility signals).

5. **Bundle output location: `tmp/bundle/` or `dist/bundle/` (CC's
   choice).** Whichever fits the existing build conventions
   better. The bundle artifact is ephemeral — not committed; built
   per invocation.

6. **CI invocation: `make bundle-size` produces a delta report
   against the recorded baseline.** Specific CI integration
   shape (GitHub Actions, etc.) is whatever the existing CI
   infrastructure uses. CC checks for an existing CI config first;
   if none, the bundle-size script is at least runnable manually
   and a CI integration ticket can fast-follow.

7. **Baseline recording location: DD-37 refinement log** (per
   DD-37's own spec at line 41 — "recorded in this DD's refinement
   log"). Format: numbered baseline entry with the three
   measurements and the date.

8. **Pilot-pipeline architecture: DD-37 steps 1 + 2 + 3 for
   `not`.** Concretely:
   - Step 1: `surface-ast.js` created with constructor function for
     the `Not` AST node (partial — only what's needed for the
     pilot).
   - Step 2: `classifier.js` created as pass-through wrapper around
     the existing surface dispatch, with a single case for `not`
     that produces the new typed AST node.
   - Step 3: `not` moved out of `surface.js`; classifier emits
     `Not` AST; emitter transform produces the kernel form.
   - All existing `not` behavior preserved (full test suite passes).

9. **Pilot TDD-first: paired commits per the M19/M20 methodology
   discipline.** Test commit (asserting `not` still produces the
   same kernel output through the new path) precedes fix commit
   (the architectural extraction). Same SHA-boundary requirement
   as M20-3 / M20-9.

10. **Extrapolation methodology: ~20 forms estimated migration
    scope.** Per-form cost from the pilot × 20 = total estimated
    growth. If total exceeds budget, escalate to Alt C
    (classifier-only) per DD-37's pre-agreed fallback.

---

## Spec (substantive intents)

1. **Reproducible bundle-size measurement** with `make
   bundle-size` producing raw / minified / gzipped numbers for the
   full `@lykn/browser` rollup.

2. **Baseline numbers recorded** in DD-37 refinement log as a
   numbered baseline entry.

3. **CI guard wired** at +2KB gzipped warn / +5KB gzipped hard fail
   per PR. If no CI infrastructure exists, the runnable manual
   script + a fast-follow CI ticket counts as partial completion.

4. **`not` migration pilot complete** — DD-37 steps 1 + 2 + 3
   applied for the single form; all existing tests pass; pilot
   delta measured and recorded.

5. **Extrapolation calculation** recorded — per-form cost × ~20
   forms — with go/no-go signal for DD-37 step 3+ continuation
   (or Alt C escalation).

6. **Backward-compat preserved.** No behavior change for any
   existing surface form (including `not`). Tests pass; production
   paths unchanged.

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md) — protocol (mandatory)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md) — subagent rules
3. [`assets/ai/AGENTS.md`](../../assets/ai/AGENTS.md) "Lykn CLI safety gates" + "Snapshot testing"
4. **DD-37** at `docs/design/05-active/0047-dd-37-js-surface-compiler-architecture.md`. Focus on:
   - §"Acceptance state and Phase 0 criterion" (lines 30–62) — Phase 0 spec
   - §"Gradual migration, not a big-bang rewrite" (lines 864–916) — the 9-step migration sequence
   - §"Six-module decomposition" (lines 187–270) — target architecture
   - §"Bundle size considerations" (lines 1027–1114) — budget rationale, Alt C fallback
5. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`. Focus on:
   - §"Migration sequencing" — Phase 2 in context
6. **M20 closing report + CDC review** (for methodology continuity):
   - `workbench/2026-05-17-M20-closing-report.md`
   - `workbench/2026-05-17-M20-closing-cdc-review.md`
7. **Current JS compiler source** at `packages/lang/`:
   - `surface.js` (2,135 lines — where `not` lives today)
   - `compiler.js`, `expander.js`, `reader.js`, `mod.js`
8. **Current browser package** at `packages/browser/`:
   - `mod.js`, `compiler.js`, `scripts.js`, `deno.json`
9. **Existing build infrastructure:** `Makefile`, `project.json`,
   `deno.json`, any CI config (`.github/workflows/`, etc.)

---

## Per-row preflight discipline

### M21-2 (bundler integration) — esbuild invocation shape

CC's preflight check before implementing the bundle script:

1. Verify esbuild is available (`which esbuild` or via Deno).
2. Pick the invocation shape that fits the existing toolchain.
   Options in rough order of CDC preference:
   - **`esbuild` CLI directly** (cleanest if installed locally).
   - **`deno run -A npm:esbuild`** (if Deno is the primary runtime
     and we don't want a separate Node/npm dependency).
   - **A small `deno_emit` script** (more bespoke; less standard).
3. If the bundler choice has a substantive trade-off (e.g., adding
   an esbuild npm dependency vs. Deno-native tooling), surface to
   CDC.

### M21-5 (CI guard) — preflight check for existing CI

Before wiring the CI guard:

1. Check `.github/workflows/`, `.gitlab-ci.yml`, or any other CI
   config file.
2. If CI exists, integrate the bundle-size check into the existing
   pipeline (probably a new job or step).
3. If no CI exists, the `make bundle-size` script must at minimum
   produce clear output and a non-zero exit code on threshold
   breach. A CI integration ticket can fast-follow.

### M21-6 (`not` pilot) — TDD-first paired commits

The pilot is a behavior-preserving extraction. TDD-first applies
PROPERLY per M20 methodology:

1. **Test commit FIRST.** A test that compiles `(not x)` through
   the EXISTING surface-macro path AND through the NEW
   architecture path and asserts both produce identical kernel
   output. The test will fail pre-fix (the new architecture
   doesn't exist yet — there's no `Not` AST node, no classifier
   case, no emitter transform).
2. **Commit the failing test.**
3. **Implement** DD-37 steps 1 + 2 + 3 for `not`:
   - Create `packages/lang/surface-ast.js` with `Not` constructor.
   - Create `packages/lang/classifier.js` as pass-through with a
     `not` case.
   - Move `not` out of `surface.js`; classifier produces `Not` AST;
     emitter transform converts `Not` to the kernel form.
4. **Commit the fix.**
5. **Verify** the test now passes.
6. **Measure** the bundle delta against baseline; record.

Same SHA-boundary requirement as M20-3 / M20-9: test commit
precedes fix commit in `git log`.

### M21-7 (extrapolation) — honest extrapolation discipline

The per-form cost extrapolation × ~20 forms must be honest. If
`not` is unusually small (which it is — unary boolean is the
simplest possible case), the extrapolation should explicitly note
that and offer a range:

- Lower bound: per-form cost × 20 (assumes other forms are
  comparable to `not`).
- Upper bound: per-form cost × 20 × scaling factor (where the
  scaling factor accounts for `func`, `match`, `bind` being
  substantially larger).
- Recommendation: pick a midpoint or upper bound for the go/no-go
  threshold check.

If the upper bound exceeds the DD-37 budget (+20KB gzipped total
across all forms), surface "Alt C may be necessary" as a
recommendation — but do NOT escalate to Alt C unilaterally. CDC
+ Duncan make the call.

---

## Iteration budget

**5 iterations.** Expected 3–4. Substantive scope: bundle tooling
+ CI guard + first-time architectural extraction. Per Duncan's
2026-05-16 iteration-budget override: the cap guards against
compliance-theatre / infinite spin. If the pilot surfaces
architectural questions (e.g., the new classifier shape doesn't
cleanly fit existing call sites; the bundler output diverges from
expectations; esbuild produces unexpected size deltas), surface to
CDC — don't compress at the cost of correctness or methodology.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M21-1 | Baseline directory exists at `workbench/verify/m21/` with `baseline.md` and `design-confirmation.md` | `test -d workbench/verify/m21 && test -f workbench/verify/m21/baseline.md && test -f workbench/verify/m21/design-confirmation.md` | polish | Spec setup | open | | Baseline.md captures pre-pilot state; design-confirmation.md acknowledges the 10 design calls or surfaces dissent |
| M21-2 | esbuild integrated; `make bundle-size` target produces raw + minified + gzipped numbers for `packages/browser/mod.js` rollup | `make bundle-size` exits 0 and prints three numeric measurements; the script is reproducible (subsequent invocations produce same numbers within ±10 bytes) | serious | Spec 1; design call 1 | open | | Bundle target lives at `tmp/bundle/` or `dist/bundle/` per design call 5 |
| M21-3 | Baseline numbers recorded in DD-37 refinement log as a numbered baseline entry | `grep -E "^### .*[Bb]aseline.*2026-05" docs/design/05-active/0047-dd-37-*.md` returns ≥1 match; the entry contains all three measurements | serious | Spec 2; DD-37 Phase 0 criterion #1 | open | | Format: "### 2026-05-X — Phase 0 bundle baseline" with the three numbers |
| M21-4 | CI guard wired (or runnable-manual fallback with fast-follow ticket) at +2KB gzipped warn / +5KB gzipped hard fail | If CI exists: relevant CI config has a bundle-size job invoking `make bundle-size` with threshold checks. If no CI: `make bundle-size` script exits non-zero on threshold breach AND a fast-follow ticket is logged in `workbench/M21-followups.md` | serious | Spec 3; DD-37 Phase 0 criterion #2 | open | | CC's preflight determines which case applies |
| M21-5 | Pre-pilot infrastructure exists: `surface-ast.js` with `Not` constructor + `classifier.js` as pass-through | `test -f packages/lang/surface-ast.js && grep -E "function Not\\|export.*Not" packages/lang/surface-ast.js`; `test -f packages/lang/classifier.js && grep -E "function classify\\|export.*classify" packages/lang/classifier.js` | serious | Spec 4; DD-37 steps 1 + 2 (partial scope) | open | | Initial files; mostly empty except for what `not` needs |
| M21-6 | `not` migrated end-to-end through new architecture | TDD-first PAIRED COMMITS: test commit asserts `(not x)` produces identical kernel output via both old and new paths; fix commit moves `not` out of `surface.js` and through `surface-ast.js` / `classifier.js`. `git log` shows test SHA precedes fix SHA. All existing `not`-using tests pass. | serious | Spec 4; DD-37 step 3 for one form; methodology MUST | open | | Paired commits non-negotiable per M19/M20 methodology learning |
| M21-7 | Pilot delta measured + extrapolation recorded | `make bundle-size` shows post-pilot numbers; delta vs. baseline computed; extrapolation × ~20 forms with lower/upper bounds recorded in DD-37 refinement log; go/no-go recommendation explicit | serious | Spec 5; DD-37 Phase 0 criterion #3 | open | | If upper-bound exceeds budget, surface "Alt C may be necessary" but do NOT escalate unilaterally |
| M21-8 | All tests pass | `cargo test -p lykn-lang` ≥ post-M20 baseline; `cargo test -p lykn-cli` ≥ post-M20 baseline; `make test-lykn` ≥ post-M20 surface/forms; `./bin/lykn test test/kernel/` exits 0; new JS tests (if any added) pass | correctness | Spec 6 | open | | Pilot is behavior-preserving — no regressions |
| M21-9 | Backward-compat preserved | Existing JS surface dispatch unchanged for forms OTHER than `not`; existing kernel compiler path unchanged; production `lykn compile` / `lykn run` unchanged | correctness | Spec 6 | open | | Architecture extension is additive; old paths still work |
| M21-10 | Closing report + substrate-rule compliance section | `workbench/2026-05-<date>-M21-closing-report.md` exists; substrate-rule section names six rules including TDD-first (M21-6 named with paired commit SHAs); fast-follow findings logged if any (esp. Alt-C consideration if pilot extrapolation is concerning) | correctness | Methodology continuity | open | | TDD-first MUST cite SHAs explicitly |
| M21-11 | Commit chain coherent | `git log --grep="M21\\|DD-37 Phase 0\\|bundle-size\\|pilot.*not" --oneline` shows expected commits. For M21-6: test commit precedes fix commit; SHA boundary visible. | correctness | TDD-first discipline + commit hygiene | open | | Per M20 callout learnings |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 3–4.

2. **Read DD-37 carefully**, especially the Phase 0 criterion and
   the 9-step migration sequence. The pilot's purpose is empirical
   — record what you find honestly.

3. **Read the M20 closing CDC review** for the TDD-first
   methodology learnings (paired commits, negative-direction
   discipline). Those learnings apply to M21-6.

4. **Subagent delegation policy:** lookup-only. The pilot
   extraction itself is judgment work; main CC context only.
   Bundle-size measurement and CI integration may be appropriate
   for some subagent grep work but the substantive decisions are
   main-context.

5. **Order of work:**
   - M21-1 (baseline directory + design confirmation).
   - M21-2 (esbuild + `make bundle-size`).
   - M21-3 (baseline recorded in DD-37).
   - M21-4 (CI guard wired OR fallback + ticket).
   - M21-5 (pre-pilot infrastructure: surface-ast.js + classifier.js).
   - M21-6 (`not` pilot) — TDD-first PAIRED COMMITS.
   - M21-7 (delta measured + extrapolation recorded).
   - M21-8 / M21-9 (test pass + backward-compat).
   - M21-10 / M21-11 (closing report + commit chain verify).

6. **Anti-shortcut explicit instructions:**

   - **Do NOT combine test + fix commits for M21-6.** Same MUST
     as M20-3 / M20-9. SHA boundary visible in `git log`.
   - **Do NOT escalate to Alt C unilaterally.** If pilot
     extrapolation exceeds the DD-37 budget, surface to CDC; the
     escalation decision is CDC + Duncan, not CC.
   - **Do NOT migrate any other surface form.** Only `not` for the
     pilot. Other forms wait for the post-M21 per-form work.
   - **Do NOT touch the Rust compiler.**
   - **Do NOT modify the kernel compiler path.** The kernel path
     is separate from the surface architecture extraction.
   - **Do NOT auto-pass safety-bypass flags** per AGENTS.md.
   - **Do NOT add esbuild as a runtime dependency.** It's a
     build-time tool; runtime should remain dependency-free per
     project conventions.

7. **If the bundle baseline differs dramatically from
   expectations** (e.g., ~25KB gzipped recall vs. measured ~50KB+
   gzipped), surface to CDC. The threshold scaling depends on the
   baseline.

8. **If the pilot surfaces a structural problem** (e.g., the new
   classifier shape doesn't cleanly fit the existing call site;
   `not` has a hidden dependency on `surface.js` internals), STOP
   and surface. Don't work around quietly.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-M21-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M21-1 through M21-11) with the
   final status and Verify command output as evidence.

2. **For M21-6 specifically, cite BOTH commit SHAs** (test-only
   and fix-only) and explicitly call out the paired-commit
   discipline.

3. Include a summary table:
   - Baseline measurements (raw, minified, gzipped).
   - Post-pilot measurements (raw, minified, gzipped).
   - Delta per measurement.
   - Extrapolation × 20 forms (lower bound, upper bound).
   - Budget check (does upper bound fit within DD-37's +20KB
     gzipped total budget?).
   - Go/no-go recommendation for DD-37 step 3+ continuation.

4. Include the 10 design-call confirmations (or any substantive
   escalation from M21-1 preflight).

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
   minimum: the per-form cost extrapolation discussion, any CI
   integration items deferred, any architectural questions the
   pilot surfaced.

7. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to migrate any surface form other than `not`.
  Other forms wait for the post-M21 per-form work (probably
  M22+).
- You do not need to complete DD-37 steps 4-8 (delete `_kernel`,
  delete `kernelArray()`, trim `compiler.js`, intro
  `compileKernel`/`compileSurface`, structured diagnostics). M21
  is Phase 0 only.
- You do not need to escalate to Alt C if the pilot extrapolation
  is concerning. Surface to CDC; let CDC + Duncan call it.
- You do not need to retire `_kernel` or `kernelArray()`. Those
  retirements happen after all surface forms are migrated (DD-37
  step 4 + 5).
- You do not need to touch the Rust compiler.
- You do not need to touch the kernel compiler path
  (`packages/lang/compiler.js`'s kernel-form handling).
- You do not need to fix the lambda emission divergence (DD-58
  Breaking Change #3 — Phase 5).
- You do not need to add file-extension dispatch for production
  `.lykn` files. DD-58 Phase 4 / M-later scope.
- You do not need to make Phase 2/3 of DD-58 happen. M21 unblocks
  them; their implementation is later milestones.
