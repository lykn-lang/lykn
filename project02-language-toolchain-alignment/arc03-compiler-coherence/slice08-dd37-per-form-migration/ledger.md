# Milestone M22: DD-37 Step 3 — Per-Form Migration + CI Integration

> **Status:** open
> **Iteration budget:** 5 (expect 4–6; substantial scope. Iteration override per Duncan's 2026-05-16 standing call if the form-batches surface architectural questions.)
> **Implementer (CC):** Claude Code, on Duncan's machine
> **Reviewer (CDC):** Cowork Claude (this session, cdc/compiler-coherence)
> **Methodology:** [LEDGER_DISCIPLINE.md](../../assets/ai/LEDGER_DISCIPLINE.md) — load before starting
> **Phase context:** DD-58 Phase 2 chain. M21 cleared DD-37 Phase 0 acceptance; M22 executes DD-37 step 3 (per-form migration) for the remaining ~19 surface forms, plus the CI integration fast-follow from M21-4.
> **Thread origin:** [`workbench/2026-05-10-compiler-coherence-thread-opening.md`](../2026-05-10-compiler-coherence-thread-opening.md)
> **Predecessors:** M21 closed (DD-37 Phase 0). Closing report at `workbench/2026-05-17-M21-closing-report.md`; CDC review at `workbench/2026-05-17-M21-closing-cdc-review.md`. Pilot extrapolation confirmed +6.5 KB gzipped upper bound, well within +20 KB budget. Go signal for step 3.

---

## Why this milestone exists

M21's pilot confirmed the new architecture is bundle-size-efficient
(+109 bytes gzipped per form) and behavior-preserving. DD-37 step
3 ("Move built-in surface forms out of `surface.js` one at a time")
can now proceed for the remaining ~19 forms.

M22 also closes the CI integration fast-follow from M21-4: the
`make bundle-size` script's threshold-breach exit codes need to be
wired into PR-level CI checks so subsequent per-form PRs are
self-measuring against the budget.

After M22 closes:

- All surface forms route through the new `surface-ast.js` +
  `classifier.js` pipeline.
- The `_kernel` marker remains in use (DD-37 step 4 — separate
  milestone) but the per-form macros are gone from `surface.js`.
- The CI guard prevents bundle-size regressions in future work.
- DD-37 step 4 (delete `_kernel`) becomes unblocked.

---

## Design calls (decided in CDC drafting; flag dissent before M22 starts)

These are baked into the spec below. Flag dissent before starting
if any are wrong.

1. **Form ordering: smallest-first.** Lets confidence accumulate
   before tackling the large forms. Approximate ordering by
   complexity (subject to CC's per-form judgment if a smaller form
   surfaces unexpected complexity):

   - **Batch 1 — Mutation primitives (small):** `swap!`,
     `reset!`, `set!`, `set-symbol!`
   - **Batch 2 — Collection ops:** `conj`, `assoc`, `dissoc`
   - **Batch 3 — Threading macros:** `->`, `->>`, `some->`,
     `some->>`
   - **Batch 4 — Binding macros:** `if-let`, `when-let`
   - **Batch 5 — Anonymous functions:** `fn`, `lambda`
   - **Batch 6 — Logical n-ary:** `and`, `or` (`not` already
     migrated in M21)
   - **Batch 7 — Small surface forms:** `do`, `express`, `obj`,
     `cell`, `type`
   - **Batch 8 — Large forms (substantial scope; possibly
     separate batches):** `func`, `match`, `bind`
   - **Batch 9 — Special-case (preflight escalation expected):**
     `macro`, `import-macros` (macro-system primitives), `=`,
     `!=` (flavor (c) rich namesake-sharing — emit transformation
     maps to a different kernel name)

   Total ~22-28 forms across the batches (counts vary based on
   CC's exact enumeration). The ~19 referenced elsewhere is
   approximate; CC's M22-1 inventory is the authoritative count.

2. **Batch granularity: 3-5 forms per commit.** Each batch is one
   TDD-first paired-commit pair (test commit + fix commit).
   Run `make test-lykn` AND `make bundle-size` after each batch.

3. **TDD-first paired commits per batch.** Same MUST as M19-4 /
   M20-3 / M20-9 / M21-6. Test commit asserts ALL forms in the
   batch produce identical kernel output via both old (pre-batch)
   and new (post-batch) paths; fix commit moves the forms through
   surface-ast.js + classifier.js. SHA boundary visible in
   `git log`.

4. **emit pattern: continue M21's dependency-injection shape.**
   `emitSurfaceForm(node, sym, array)` — the classifier doesn't
   need to know how SExprs are constructed. New per-form emit
   cases follow the same shape.

5. **Bundle-size strategy: per-batch measurement + cumulative
   budget tracking.**

   - After each batch: `make bundle-size` records the delta from
     the previous batch (per-PR/per-batch +2KB warn / +5KB hard
     fail threshold applies).
   - After all batches: cumulative delta from M21 baseline (27,630
     bytes gzipped) is recorded in DD-37 refinement log.
   - Cumulative budget: ≤ +20 KB gzipped (DD-37's total budget
     for the architecture). If cumulative delta approaches +15KB
     before all batches are done, surface to CDC — Alt C
     escalation discussion may be needed.

6. **CI integration shape: bundle-size job in existing CI
   workflow.** CC's preflight checks `.github/workflows/` (or
   wherever the CI config lives) and adds a bundle-size job that:
   - Runs `make bundle-size`
   - Sets BASELINE_GZIPPED to the M21 baseline initially; updated
     post-batch as M22 progresses
   - Job fails on +5KB delta, warns on +2KB

   If no CI infrastructure exists, M22-3 escalates — CI shouldn't
   be invented from scratch as part of M22.

7. **Special-case form preflight: `macro` / `import-macros` and
   `=` / `!=`.** These are NOT routine batches. Before extracting:

   - **`macro` / `import-macros`** are macro-system primitives.
     Extracting them through the new architecture changes the
     classifier-to-expander interaction. CC's preflight surfaces
     whether the existing pattern fits or needs a variant.
   - **`=` / `!=`** are flavor (c) rich namesake-sharing — `=`
     (surface) compiles to `===` (kernel), `!=` to `!==`. The
     emit transformation produces a DIFFERENT kernel name, not a
     literal passthrough. CC's preflight surfaces the emit-shape
     for these.

   If either preflight raises substantive architectural questions,
   STOP and surface to CDC. Don't work around quietly.

8. **`unquote` / `unquote-splicing` are NOT migrated in M22.**
   They're handled inline by the expander's quasiquote logic, not
   registered as macros. Out of scope.

---

## Spec (substantive intents)

1. **All remaining surface forms migrated** out of `surface.js`
   into the new `surface-ast.js` + `classifier.js` pipeline. Post-
   M22, `surface.js` should be substantially smaller (or empty
   if all forms migrate cleanly).

2. **Per-form behavior preservation** — regression tests assert
   identical kernel output for each form via both paths
   (pre-batch and post-batch) during the migration; post-M22, the
   old path is gone for all migrated forms.

3. **CI integration wired** — bundle-size job runs per PR with
   threshold checks.

4. **Cumulative bundle-size delta within budget** — total
   gzipped growth from M21 baseline ≤ +20 KB. (Pilot extrapolation
   was +2.2 KB to +6.5 KB; substantial headroom expected.)

5. **All tests pass** at every batch boundary AND at M22 close.

6. **Backward-compat preserved** for production code paths
   (`lykn compile`, `lykn run` for non-test `.lykn` files).

---

## Source materials (read in this order)

1. [`assets/ai/LEDGER_DISCIPLINE.md`](../../assets/ai/LEDGER_DISCIPLINE.md)
2. [`assets/ai/SUBAGENT-DELEGATION-POLICY.md`](../../assets/ai/SUBAGENT-DELEGATION-POLICY.md)
3. [`assets/ai/AGENTS.md`](../../assets/ai/AGENTS.md)
4. **DD-37** at `project02-language-toolchain-alignment/arc03-compiler-coherence/artifacts/design/05-active/0047-dd-37-js-surface-compiler-architecture.md`:
   - §"Gradual migration, not a big-bang rewrite" (lines 864–916)
     — the 9-step migration sequence; M22 executes step 3 for
     the remaining forms
   - §"Bundle size considerations" (lines 1027–1114) — budget
     and Alt C fallback
   - **Refinement log entries 2026-05-17 (M21 baseline + pilot
     delta)** — the reference points
5. **DD-58** at `docs/design/05-active/0059-dd-58-*.md`:
   - §"Per-layer form enumeration" — surface namespace
     enumeration (the forms that exist)
6. **M21 closing report + CDC review:**
   - `workbench/2026-05-17-M21-closing-report.md`
   - `workbench/2026-05-17-M21-closing-cdc-review.md`
7. **M21 implementation artifacts (the pattern to follow):**
   - `packages/lang/surface-ast.js` (Not constructor — pattern
     for new constructors)
   - `packages/lang/classifier.js` (classifySurfaceForm +
     emitSurfaceForm — pattern for new cases)
   - `packages/lang/expander.js` lines 730-740 (classifier
     integration point)
   - `scripts/bundle-size.js` (the measurement script)
8. **Existing surface form implementations** at
   `packages/lang/surface.js` (~2,123 lines after `not` removed —
   read each form's current macro implementation before extracting)
9. **Existing CI config** (probably `.github/workflows/` or
   similar — CC's M22-3 preflight checks)

---

## Per-row preflight discipline

### M22-1 — Form inventory authoritative

Before starting batch work, CC produces a complete inventory of
all surface forms currently registered as macros in `surface.js`,
with rough size estimates per form. The inventory becomes the
authoritative count for ledger row M22-3 (per-form migration).

If the inventory surfaces forms NOT in CDC's ordering above (e.g.,
a form I missed), CC integrates them into the appropriate batch
based on size.

### M22-3 — CI integration preflight

Check for existing CI config: `.github/workflows/`,
`.gitlab-ci.yml`, or other. If exists, add a bundle-size job. If
not, escalate to CDC — CI infrastructure is not in M22's scope to
invent from scratch.

### M22-4 onwards — Per-batch discipline

Each batch:

1. **Test commit first.** Write regression tests for each form in
   the batch asserting identical kernel output via both paths.
   Tests fail pre-fix (the new path doesn't have those forms
   yet). Commit the tests.
2. **Fix commit.** For each form: add constructor in
   surface-ast.js; add case in classifier.js (both
   classifySurfaceForm and emitSurfaceForm); remove from
   surface.js. Commit the extraction.
3. **Verify tests pass post-fix.**
4. **Run `make bundle-size`.** Record per-batch delta.
5. **If per-batch delta exceeds +2KB warn or +5KB hard fail**,
   STOP. Surface to CDC. The threshold breach is a signal worth
   investigating before continuing.
6. **Move to next batch.**

PAIRED COMMITS are non-negotiable. The methodology MUST from
M19-4 / M20-3 / M20-9 / M21-6 applies. SHA boundary visible per
batch.

### Special-case batch (M22-9 in ledger) preflight

Before starting the special-case batch (`macro`, `import-macros`,
`=`, `!=`), CC's preflight:

1. Read each form's existing implementation carefully.
2. Identify whether the standard `emitSurfaceForm` pattern works
   for it, OR whether the form needs a variant.
3. Surface findings to CDC BEFORE implementing. The special-case
   batch is the place architectural questions are most likely to
   arise.

If the preflight reveals that any of the four needs significant
classifier/emitter changes, escalate. Don't work around quietly.

---

## Iteration budget

**5 iterations.** Expected 4–6. The form count is substantial
(~22-28 forms across 8-9 batches). Per Duncan's 2026-05-16
iteration-budget override: the cap guards against compliance-
theatre, not good-faith engineering iteration. If the special-
case batch (M22-9) surfaces substantive architectural questions,
the iteration count may legitimately exceed 5.

---

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M22-1 | Baseline + design confirmation + form inventory + ordering recorded | `test -f workbench/verify/m22/baseline.md && test -f workbench/verify/m22/design-confirmation.md && test -f workbench/verify/m22/form-inventory.md`; form-inventory enumerates all surface forms with size estimates and assigned batch | polish | Spec setup; design call 1 | open | | Inventory is authoritative count for M22-3 |
| M22-2 | CI integration wired (bundle-size job in existing CI workflow) | Relevant CI config has a bundle-size job invoking `make bundle-size` with BASELINE_GZIPPED env var; PR check fails on +5KB delta, warns on +2KB | serious | Spec 3; M21-4 fast-follow | open | | If no existing CI, escalate — M22 does not invent CI infrastructure |
| M22-3a | Simple-form routine batches (1-3) migrated: mutation primitives, collection ops, threading macros | After each batch: TDD paired commits visible in `git log`; relevant forms removed from `surface.js`; corresponding cases present in `classifier.js`; `make test-lykn` exits 0 after each batch | serious | Spec 1; DD-37 step 3 (simple forms); methodology MUST | open | | Per-batch paired commits; per-batch bundle-size check |
| M22-3b | Helper extraction to `packages/lang/surface-helpers.js` — preflight commit before complex batches | New file `packages/lang/surface-helpers.js` exports the 9 helpers currently scoped inside `registerSurfaceMacros`: `compileLetPattern`, `wrapReturnLast`, `buildTypeCheck`, `formatSExpr`, `toJsIdentifier`, `gensym`, `isKeyword`, `isArray`, `isSymbol`. `surface.js` imports from `surface-helpers.js` (no behavior change). TDD-first paired commits: test commit asserts helpers' behavior unchanged via in-place tests AND via simple integration test through a still-macro-registered form; fix commit moves helpers out. `make bundle-size` shows minimal delta (pure refactor; no new functionality). | serious | DD-37 architectural intent — see CDC architectural guidance 2026-05-17 (response to CC's mid-M22 surface) | open | | Behavior-preserving refactor; gates complex-batch migration |
| M22-3c | Complex-form routine batches (4-8) migrated: binding macros, anonymous functions, logical n-ary, small surface forms, large forms | After each batch: TDD paired commits; relevant forms removed from `surface.js`; corresponding cases present in `classifier.js` (importing from `surface-helpers.js`); `make test-lykn` exits 0; per-batch bundle-size check | serious | Spec 1; DD-37 step 3 (complex forms); methodology MUST | open | | Depends on M22-3b. Per-batch paired commits; per-batch bundle-size check |
| M22-4 | Special-case batch (macro, import-macros, =, !=) — preflight surfaced + migration completed | Preflight doc at `workbench/verify/m22/special-case-preflight.md` exists naming each form's emit-shape; TDD paired commits visible for the batch (or for sub-batches if needed); forms migrated | serious | Spec 1; design call 7 | open | | If preflight surfaces architectural questions, escalation expected |
| M22-5 | Cumulative bundle-size delta within DD-37 budget | DD-37 refinement log has post-M22 measurement; cumulative gzipped delta from M21 baseline (27,630 bytes) ≤ +20 KB; per-batch deltas all recorded | serious | Spec 4; DD-37 budget | open | | If cumulative approaches +15KB pre-completion, surface for Alt C discussion |
| M22-6 | All tests pass | `cargo test -p lykn-lang` ≥ post-M21 baseline (1023); `cargo test -p lykn-cli` ≥ post-M21 (83); `make test-lykn` ≥ post-M21 (292 surface, 674 forms); `./bin/lykn test test/kernel/` exits 0 (≥15 tests) | correctness | Spec 5 | open | | Plus the per-form regression tests added during M22 |
| M22-7 | Backward-compat preserved | Production `lykn compile` / `lykn run` produce identical output for non-test `.lykn` files pre-M22 vs. post-M22 (spot-check at least 3 representative files); kernel compiler path unchanged | correctness | Spec 6 | open | | Migration is behavior-preserving; old vs. new path produces identical kernel output |
| M22-8 | DD-37 refinement log updated with M22 final measurements | DD-37 has "2026-05-X — M22 step 3 completion" entry with: total forms migrated; final bundle measurements; per-batch deltas summary | polish | Spec 4; methodology continuity | open | | Records the milestone-level outcome |
| M22-9 | Closing report exists with substrate-rule compliance section | `workbench/2026-05-X-M22-closing-report.md` exists; substrate-rule section names six rules including TDD-first (per-batch paired commits explicitly cited); fast-follow findings logged | correctness | Methodology continuity | open | | M22 has more paired commits than any previous milestone — citation discipline matters |
| M22-10 | Commit chain coherent | `git log --grep="M22\\|step 3\\|per-form\\|DD-37" --oneline` shows expected commit chain. For EACH batch: test commit precedes fix commit; SHA boundary visible | correctness | TDD-first discipline + commit hygiene | open | | Per-batch paired commits non-negotiable per M19/M20/M21 methodology learnings |

---

## CC instructions

1. **Read `LEDGER_DISCIPLINE.md` first.** Protocol applies.
   Iteration budget is 5; expected 4–6.

2. **Read M21's closing report + CDC review carefully.** The
   pattern M21 established is what M22 scales. Take the
   `surface-ast.js` + `classifier.js` + `expander.js` integration
   as the reference shape.

3. **Subagent delegation policy:** lookup-only. Per-form
   extraction is judgment work; main CC context only. Subagent
   appropriate for grep work (e.g., finding all references to a
   migrating form, finding existing CI config).

4. **Order of work:**

   - **M22-1** — form inventory + design confirmation. Get the
     authoritative count before starting batches.
   - **M22-2** — CI integration (do this BEFORE the routine
     batches so subsequent batches are self-checking).
   - **M22-3a** — simple routine batches (1-3), in order:
     - Batch 1: mutation primitives (swap!, reset!, set!,
       set-symbol!)
     - Batch 2: collection ops (conj, assoc, dissoc)
     - Batch 3: threading macros (->, ->>, some->, some->>)
   - **M22-3b** — Helper extraction to `surface-helpers.js`
     (preflight commit gating complex batches; behavior-preserving
     refactor; TDD-first paired commits).
   - **M22-3c** — complex routine batches (4-8), in order:
     - Batch 4: binding macros (if-let, when-let)
     - Batch 5: anonymous functions (fn, lambda)
     - Batch 6: logical n-ary (and, or)
     - Batch 7: small surface forms (do, express, obj, cell,
       type, genfn)
     - Batch 8: large forms (func, genfunc, match, bind) —
       possibly split into sub-batches if individual forms are
       large
   - **M22-4** — special-case batch (macro, import-macros, =,
     !=) with preflight escalation expected.
   - **M22-5 / M22-6 / M22-7** — verification (cumulative delta;
     all tests pass; backward-compat).
   - **M22-8 / M22-9 / M22-10** — DD-37 update + closing report
     + commit chain verify.

5. **Anti-shortcut explicit instructions:**

   - **TDD-first PAIRED COMMITS per batch.** Test commit precedes
     fix commit. SHA boundary visible. Single-commit batches will
     fail M22-10's verify command.
   - **Do NOT combine multiple batches into one commit pair.**
     Each batch (per CDC's ordering or your authoritative
     inventory's batching) is its own paired-commit pair.
   - **Do NOT skip the per-batch bundle-size check.** If a batch
     trips +5KB hard fail, STOP and surface. Don't keep going to
     accumulate more breaches.
   - **Do NOT migrate `unquote` / `unquote-splicing`.** Out of
     scope.
   - **Do NOT delete `_kernel` marker or `kernelArray()` helper.**
     DD-37 step 4-5 — separate milestone.
   - **Do NOT touch the Rust compiler.**
   - **Do NOT modify the kernel compiler path.**
   - **Do NOT auto-pass safety-bypass flags** per AGENTS.md.
   - **Do NOT escalate to Alt C unilaterally.** If cumulative
     delta approaches +15KB before all batches done, surface to
     CDC; let CDC + Duncan call it.
   - **Do NOT work around special-case preflight findings
     quietly.** If `macro`/`import-macros`/`=`/`!=` need
     architectural variants, surface BEFORE implementing.

6. **If the form inventory surfaces forms NOT in CDC's ordering**
   (e.g., I missed a form, or a form has unexpected complexity),
   integrate it into the appropriate batch based on size — but
   surface the finding in the M22-1 doc so it's visible.

7. **If any per-batch bundle-size delta is anomalously high**
   (e.g., a small form produces a disproportionate delta), surface
   the finding even if within threshold. Anomalies are data.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-X-M22-closing-report.md`. The closing
report MUST:

1. Walk every ledger row by ID (M22-1 through M22-10) with the
   final status and Verify command output as evidence.

2. **For each batch in M22-3 AND M22-4, cite BOTH commit SHAs**
   (test-only and fix-only) and explicitly call out the paired-
   commit discipline. With 8+ batches, this is the most paired-
   commit-citing closing report in the thread; structure it as a
   table for clarity.

3. Include a summary table:
   - Total forms migrated (across all batches).
   - Per-batch breakdown: form count, gzipped delta, cumulative
     delta from M21 baseline.
   - Final bundle measurements (raw / minified / gzipped).
   - Cumulative gzipped delta from M21 baseline (27,630 bytes).
   - Budget check vs. DD-37's +20 KB total budget.

4. Include the design-call confirmations from M22-1 (or any
   substantive escalation if the preflight surfaced one).

5. Include a "Substrate-rule compliance" section addressing six
   rules:
   - AGENTS.md safety gates
   - LEDGER_DISCIPLINE no-silent-rewrite
   - philosophy.md Principle 1
   - philosophy.md Principle 3
   - Backward-compat invariant
   - **TDD-first discipline — every batch's paired commit SHAs
     cited.**

6. Include a "Findings for fast-follow" section. Expected at
   minimum:
   - Any architectural questions surfaced during the special-case
     batch (M22-4).
   - Any form whose per-form cost was anomalous (significantly
     above or below extrapolation).
   - Any CI integration items deferred.
   - The DD-37 step 4 setup (deleting `_kernel` marker once all
     forms are migrated) — what remains to be done.

7. Name any uncertainty.

---

## What you do NOT need to do

- Migrate `unquote` / `unquote-splicing`. Out of scope.
- Delete `_kernel` marker or `kernelArray()` helper. DD-37 step
  4-5 — separate milestone (probably M23).
- Touch the Rust compiler.
- Touch the kernel compiler path.
- Modify dispatch tables in `forms.rs` / `dispatch.rs`.
- Fix the lambda emission divergence (DD-58 Breaking Change #3
  — Phase 5).
- Add file-extension dispatch for production `.lykn` files. DD-58
  Phase 4 — later milestone.
- Invent CI infrastructure if none exists — escalate instead.
- Escalate to Alt C unilaterally — surface to CDC.
- Make DD-58 Phase 2 complete. M22 lands DD-37 step 3; DD-58
  Phase 2 requires DD-37 steps 3-5 minimum, which means M22 is
  most-but-not-all of DD-58 Phase 2.
