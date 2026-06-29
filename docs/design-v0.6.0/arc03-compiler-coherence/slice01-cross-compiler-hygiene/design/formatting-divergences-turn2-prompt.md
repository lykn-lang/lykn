# M16-2 Formatting Divergences — Turn 2 Implementation Prompt for CC

## Read this first

Turn 1 (diagnosis) is complete. CDC has reviewed the diagnosis at
`workbench/m16-formatting-divergences-diagnosis-cdc-review-2026-05-16.md`
and approved the directions per class. This prompt is Turn 2:
**implement the CDC-approved directions for each of the six classes.**

**Headline calls from CDC review:**
- **Two items deferred to DD-58** (C-1 class constructor `=`, C-4
  destr-assign `=`) — your amendment request approved.
- **One additional item promoted to correctness-grade by CDC**
  (C-6 template content) — direction (a), with entanglement check.
- **Three items "no action — already converges"** still require
  test conversion to `compile-both` to lock the convergence into
  the regression net.
- **One item still needs investigation** (C-5 default params) —
  pinpoint the failing pattern, then act.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode. The
  acceptance criteria below are written in substantive-intent
  terms.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents.
- **You MUST stop and surface on dissonance.** If during
  implementation a class behaves differently from the diagnosis,
  or if a fix's scope balloons beyond the diagnosis estimate, raise
  it before working around it.
- **You MUST treat the C-1/C-4 `=` deferrals as deferrals, not
  fixes.** The substantive Rust bug is real, but the fix belongs in
  DD-58's implementation. For Turn 2, the affected tests either
  (a) get rewritten to use `set!` (the DD-22 migration target),
  producing convergent output, OR (b) get a skip-with-rationale
  comment citing this CDC review for the deferral reason.
- **You MUST NOT extend the normalizer silently.** The C-3
  trailing-`;` extension requires the rationale comment from B-3
  (already added in Tier B) PLUS an explicit named-reason in the
  closing report.
- **You MUST NOT auto-pass safety-bypass flags** to underlying
  tools per CLAUDE.md "Lykn CLI safety gates."

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/CLAUDE.md` "Lykn CLI safety gates" + "Snapshot testing"
4. **Your own Turn 1 diagnosis** at
   `workbench/2026-05-16-m16-formatting-divergences-diagnosis.md`
5. **CDC review** at
   `workbench/m16-formatting-divergences-diagnosis-cdc-review-2026-05-16.md`
   — direction confirmations + the C-6 promotion + the deferral
   rationale
6. `crates/lykn-lang/src/codegen/emit.rs` — where the Rust codegen
   fixes will land
7. `packages/testing/helpers.js` — where the C-3 normalizer
   extension will land

---

## Per-class implementation instructions

### C-1 — Object / class formatting

**C-1a: Object parens (direction a — align Rust).**
- **MUST** modify `emit.rs` to wrap standalone object expressions
  in `(...)` for expression-statement disambiguation. (Bare `{...}`
  at statement level is parsed as a block.)
- **Convert** `test/forms/object_test.lykn` to use `compile-both`
  in place of `compile` for every assertion currently using
  `compile`.

**C-1b: Class body whitespace (direction c — normalize, already
handled).**
- **No codegen change** — existing whitespace collapse handles it.
- **Convert** `test/forms/class_test.lykn` to use `compile-both`.
- If `compile-both` fails after conversion, surface — the diagnosis
  said this already converges; a failure here would be a finding,
  not a fix.

**C-1c: Class constructor `=` (DEFERRED TO DD-58).**
- **MUST** rewrite `test/forms/class-methods_test.lykn`'s
  `=`-in-class-constructor cases to use `(set! this:x x)` instead
  of `(= this:x x)`. The `set!` form is DD-22's migration target;
  the test's user-facing intent (set the property) is preserved.
- For each rewritten case, add a comment:
  `;; DD-58 deferral: original (= this:x x) → (set! this:x x) ` +
  `;; per workbench/m16-formatting-divergences-diagnosis-cdc-review-2026-05-16.md`
- **Convert** to `compile-both` after the rewrite. The `set!`-based
  test MUST converge (set! has well-defined semantics on both
  compilers).
- **If `set!` rewrite is not semantically equivalent for any
  specific case**, stop and surface — that case may need either a
  different surface form OR a skip-with-rationale comment naming
  the DD-58 deferral.

### C-2 — Generators (no action + convert)

- **No codegen change.** Diagnosis confirms convergence
  post-normalization.
- **Convert** `test/forms/generator_test.lykn` to use `compile-both`.
- **If `compile-both` fails after conversion**, the stale-build
  hypothesis was wrong; surface as a finding.

### C-3 — Async wrapping (two sub-items)

**C-3a: Trailing `;` (direction c — normalize).**
- **MUST** extend the `normalize` function in
  `packages/testing/helpers.js` to strip trailing `;` after `}` more
  broadly (currently the pattern only handles `;\s*}` — collapse
  semicolons; the broader case is `}\s*;` → `}`).
- **MUST** update the normalizer-policy comment (B-3, already
  added in Tier B) with a new bullet naming this transformation:
  `// strip trailing ';' after function-declaration '}' — ` +
  `// stylistic-only; rationale: M16-2 C-3 fast-follow.`
- The rationale must reference the M16-2 fast-follow context.

**C-3b: Async arrow parens (direction a — align Rust).**
- **MUST** modify `emit.rs` to wrap async arrow expressions in
  `(...)` (matching the same expression-statement disambiguation
  pattern as C-1 object parens and C-6 tag parens).
- **Convert** `test/forms/async-await_test.lykn` to use
  `compile-both`.

### C-4 — Destructuring (two sub-items)

**C-4a: Destr-param formatting (no action + convert).**
- **No codegen change.** Diagnosis confirms convergence.
- **Convert** `test/forms/destructuring-params_test.lykn` to use
  `compile-both`.

**C-4b: Destr-assign `=` (DEFERRED TO DD-58).**
- **MUST** rewrite `test/forms/destructuring-assignment_test.lykn`'s
  `=`-as-destructuring-assignment cases. The user's intent
  (`(= (object a b) obj)` ≈ destructure `obj` into `a` and `b`) is
  arguably an unusual idiom; consider:
  - **Option A:** rewrite to `(bind {a b} obj)` (surface-typed
    destructuring bind) if semantically equivalent.
  - **Option B:** if no clean surface equivalent exists, add a
    skip-with-rationale comment naming the DD-58 deferral and
    excluding the case from `compile-both` until DD-58 lands.
- For each rewrite or skip, add a comment citing this CDC review.

### C-5 — Default params (investigate first)

- **MUST** first identify the specific failing pattern that M16-2
  flagged but the diagnosis's one-liner didn't reproduce. The
  diagnosis names "default: multiple defaults" as the suspect
  test — find that test, isolate the source, reproduce the
  divergence.
- **Based on what you find:**
  - **If it's a genuine divergence:** apply direction (a) or (b)
    per CC's analysis (lean toward (a) — align Rust to JS — unless
    structural reason prefers (b)).
  - **If it's a stale-build artifact** (like C-2 turned out to
    be): no codegen change; convert `test/forms/default-params_test.lykn`
    to `compile-both`.
- **Do not skip C-5.** If pinpointing the pattern takes more than
  ~20 minutes, surface — better to ask CDC for clarification than
  to declare "no action — already converges" without evidence.

### C-6 — Tagged templates (two sub-items)

**C-6a: Tag parens (direction a — align Rust).**
- **MUST** modify `emit.rs` to wrap tag expressions in `(...)` for
  member-expression tags (matching the C-1 object parens and C-3b
  async arrow parens pattern).

**C-6b: Template content (correctness-grade — direction a, with
entanglement check).**
- **MUST first verify** whether the bug is in the template
  emitter's escape-handling (localised) OR entangled with surface
  vs. kernel processing of template content (DD-58 territory).
  Brief diagnosis (1–2 paragraphs in the closing report): is the
  spurious `\\n` introduced at the emitter level or earlier?
- **If localised (emitter only):** fix in `emit.rs`. The template
  content for `(template "\\n")` should emit as `\n` (the 2-char
  source-form), matching JS's output. Convert
  `test/forms/tag_test.lykn` to `compile-both`.
- **If entangled (template content processed differently in
  surface vs. kernel paths):** defer to DD-58 with a
  skip-with-rationale comment on the affected test case, and
  surface the entanglement finding for CDC.

---

## Aggregate acceptance criteria

| ID | Criterion | Verify |
|----|-----------|--------|
| AG-1 | 9 affected M16-2 test files now use `compile-both` (modulo deferred cases which use `set!` rewrite OR skip-with-rationale) | For each of `tag_test.lykn`, `object_test.lykn`, `default-params_test.lykn`, `generator_test.lykn`, `destructuring-params_test.lykn`, `destructuring-assignment_test.lykn`, `class_test.lykn`, `class-methods_test.lykn`, `async-await_test.lykn`: `grep -c "compile-both" test/forms/<file>` returns ≥1; **OR** the file contains a skip-with-rationale comment naming this CDC review |
| AG-2 | Total `compile-both` invocations strictly greater than post-M16-2 baseline (68) | `grep -c '(compile-both ' test/forms/*_test.lykn 2>/dev/null \| awk -F: '{sum+=$2} END{print sum}'` returns >68 |
| AG-3 | All test suites pass post-change | `make test`, `make test-lykn`, `./bin/lykn test test/forms/` all exit 0 with counts ≥ post-import-macros-Turn-2 baseline |
| AG-4 | Normalizer extension for C-3 includes the rationale comment | `grep -B 2 "strip trailing.*';' after.*'}'" packages/testing/helpers.js` returns the rationale line referencing M16-2 C-3 |
| AG-5 | All deferred-to-DD-58 test cases have explicit rationale comments naming the deferral | `grep -c "DD-58 deferral" test/forms/class-methods_test.lykn test/forms/destructuring-assignment_test.lykn` returns ≥2 (at least one per file) |
| AG-6 | C-6 template-content fix EITHER lands as a localised emitter fix OR is deferred with entanglement-finding documented | Either: emit.rs has the template-content fix (verify by recompiling the diagnosis example), OR the closing report's "Findings for fast-follow" section names the entanglement and the deferral |

---

## Forbidden patterns

- **Do NOT auto-accept any insta snapshot diffs.** Per CLAUDE.md
  "Snapshot testing." Manual review only.
- **Do NOT extend the C-3 normalizer beyond stripping the trailing
  `;` after `}`.** Any other normalizer change requires its own
  CDC-approved direction.
- **Do NOT fix the C-1/C-4 `=` bugs at the codegen or classifier
  level.** They're deferred to DD-58. Test rewrites only.
- **Do NOT skip C-5.** Investigate-then-act, even if the pinpoint
  is hard. Skipping it without evidence is the same compliance-
  theatre failure mode the methodology guards against.
- **Do NOT mix the deferred-`=` test rewrites with codegen
  changes in the same commit.** Separate commits per substantive
  change class.
- **Do NOT introduce new normalizer transformations beyond C-3.**
  The B-3 comment names the default policy: FIX the divergence,
  don't normalize it.

---

## Iteration budget

**5 iterations.** Expected 1-2. If you reach iteration 5 without
convergence, stop. Rework scope or surface a methodology question.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-m16-formatting-divergences-turn-2-closing-report.md`.
The closing report MUST:

1. Walk EVERY direction-confirmed item from the CDC review by ID
   (C-1a, C-1b, C-1c, C-2, C-3a, C-3b, C-4a, C-4b, C-5, C-6a, C-6b)
   with the final status and the Verify command output as evidence.
2. For each codegen change, cite the file + line range modified.
3. For the C-3 normalizer extension, quote the new transformation
   line AND its rationale comment verbatim.
4. For C-5, name the specific failing pattern + your determination
   (genuine divergence with direction, or stale-build artifact with
   evidence).
5. For C-6b, name your entanglement-check finding (localised or
   entangled with surface/kernel).
6. For the deferred items (C-1c, C-4b), include the rewritten test
   sources (or skip-with-rationale comments) verbatim.
7. Include a "Substrate-rule compliance" section addressing
   CLAUDE.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite,
   the deferred-items disclosure, and partial-adoption check.
8. Include a "Findings for fast-follow" section logging any new
   findings (e.g., C-5 turning out genuine; C-6b being entangled;
   any class behaving differently from the diagnosis).
9. Name any uncertainty. "Done with caveat X" is stronger than
   confident "done" that turns out softpedalled.

---

## What you do NOT need to do

- You do not need to touch DD-58 or DD-37 (CDC's work).
- You do not need to fix the C-1/C-4 `=` correctness bugs at the
  compiler level — only the test rewrites.
- You do not need to convert tests outside the M16-2 list.
- You do not need to canonicalize the methodology lessons — that's
  CDC work.

---

## Start

1. Re-read this prompt and the CDC review.
2. The codegen fixes (C-1a, C-3b, C-6a, possibly C-6b) can be
   batched into one commit; the normalizer extension (C-3a) into
   another; the deferred test rewrites (C-1c, C-4b) into a third;
   the convert-to-compile-both work (across all files) into a
   fourth or interleaved with the others.
3. C-5 investigation should happen early so any genuine divergence
   surfaces before the bulk of codegen work.
4. Surface anything that looks off before working around it.
