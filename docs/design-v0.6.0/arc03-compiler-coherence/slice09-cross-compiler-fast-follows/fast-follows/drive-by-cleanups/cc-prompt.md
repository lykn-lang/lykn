# Drive-By Cleanups Implementation Prompt for CC — Three Remaining Items

## Read this first

The M16-2 wishlist cleanup (commit chain `63543a4` through `dc58226`)
surfaced four fast-follow findings. Three are actionable now; one
(lambda expansion divergence) is DD-58 territory and stays deferred.

This prompt addresses the three actionable items as drive-bys: they
share scope (template-content emission and minor codegen alignment)
and can land in one work session.

**Three items:**

- **D-1: Unify duplicate template-text escape functions.**
  `emit_template_text` (emit.rs:148) and `emit_template_text_icu`
  (icu.rs:776) implement the same escape logic independently. The
  C-6b template-content bug existed in both because of this
  duplication. Unify into one function both paths call.
- **D-2: Fix JS template double-escape.** The same bug as Rust's
  C-6b exists in the JS compiler — astring (or the JS template
  emitter) double-escapes backslashes in template literal content.
  Align JS to Rust's now-correct output (direction (b)-style fix).
- **D-3: Single-param arrow paren cosmetic.** Rust emits
  `(x) =>`, JS emits `x =>`. Both valid; minor codegen alignment.

**Bake in TDD-first.** Per CC's self-reflection at the end of the
wishlist closing report ("the C-6b template content debugging took
much longer than needed because I didn't write the failing test
first"), each fix in this prompt MUST start with a failing test
before the implementation.

---

## MUST framing — what you MUST and MUST NOT do

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing
  any code.** Compliance-theatre is the named failure mode.
- **You MUST follow the subagent delegation policy** per
  `assets/ai/SUBAGENT-DELEGATION-POLICY.md`. Lookup-only for
  subagents.
- **You MUST write a failing test BEFORE the fix for each
  item.** This is the TDD-first methodology lesson from CC's
  wishlist closing report. The failing test MUST:
  - Exercise the bug directly (run, observe the failure, then
    fix).
  - Be committed alongside the fix as a regression guard.
  - For D-1 and D-2: be a unit test or a `compileBoth` test that
    would have caught the bug. For D-3: be a `compileBoth` test
    or assertion that catches the paren-wrapping difference.
- **You MUST stop and surface on dissonance.** If during
  implementation the bug class behaves differently from the
  fast-follow description, raise it before working around.
- **You MUST NOT auto-pass safety-bypass flags** to underlying
  tools per CLAUDE.md "Lykn CLI safety gates."
- **You MUST NOT touch the lambda expansion divergence.** That
  one is deferred to DD-58 per the wishlist CDC review.
- **You MUST NOT auto-accept any insta snapshot diffs.** Per
  CLAUDE.md "Snapshot testing." Manual review only.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md`
3. `assets/ai/CLAUDE.md` "Lykn CLI safety gates" + "Snapshot testing"
4. The wishlist closing report at
   `workbench/2026-05-16-wishlist-cleanup-closing-report.md` —
   §"Findings for fast-follow" names the four items + the
   self-reflection on TDD-first.
5. The CDC review at
   `workbench/m16-wishlist-cleanup-closing-cdc-review-2026-05-16.md`
   — §"Substantive findings disposition" confirms each item's
   shape.
6. `crates/lykn-lang/src/codegen/emit.rs` — `emit_template_text` at
   line 148; relevant for D-1 and D-3.
7. `crates/lykn-lang/src/codegen/icu.rs` — `emit_template_text_icu`
   at line 776; relevant for D-1.
8. `packages/lang/compiler.js` — JS template emission; relevant for
   D-2.

---

## Per-item implementation

### D-1 — Unify duplicate template-text escape functions

**Failing test first.** Write a unit test (in `crates/lykn-lang/`
or wherever appropriate) that exercises both template paths
(regular template, ICU template) and asserts the escape behaviour
matches. The test MUST fail before the unification (or pass
trivially if the duplication has already been removed; surface if
that's the case).

**Fix.** Extract the escape logic into a single function (suggested
name: `emit_template_text_escaped` or `escape_template_text`). Both
`emit_template_text` and `emit_template_text_icu` MUST call the
unified function. The signature should be the same; the call sites
that differ in surrounding context can keep their per-context logic
(the unification is the escape step only, not the surrounding
emission).

**Acceptance criteria (per-item):**

- **D-1.1:** A unified escape function exists and is referenced by
  both `emit_template_text` and `emit_template_text_icu`. Verify:
  `grep -c "fn emit_template_text_escaped\|fn escape_template_text"
  crates/lykn-lang/src/codegen/` (or wherever) returns 1.
- **D-1.2:** Both `emit_template_text` and `emit_template_text_icu`
  call the unified function. Verify: each function's body in
  emit.rs and icu.rs contains a call to the unified escape function.
- **D-1.3:** The failing test (written first) now passes.
- **D-1.4:** `cargo test -p lykn-lang` and `cargo test -p lykn-cli`
  exit 0.

### D-2 — Fix JS template double-escape

**Failing test first.** Write a `compileBoth` test that compiles
`(template "\\n")` (or another minimal source exercising the
template-content escape) and asserts JS and Rust outputs converge.
Per the wishlist closing, Rust now emits the correct 2-character
form. JS, currently, double-escapes. The test MUST fail before the
JS fix.

**Fix.** Locate the JS template-text emission in
`packages/lang/compiler.js` (likely a function that handles
`TemplateLiteral` nodes for ESTree → astring conversion, OR a
custom emitter wrapping astring). Align the emission to NOT
double-escape backslashes. Match Rust's now-correct shape.

If the bug turns out to be in `astring` itself (not in lykn's
JS compiler), surface — that's a different scope (probably means
filing an upstream issue OR working around it in our compiler).

**Acceptance criteria (per-item):**

- **D-2.1:** The new `compileBoth` test for template-content
  convergence (written first) now passes.
- **D-2.2:** Existing JS template tests still pass.
  Verify: `make test-lykn` exits 0 with the new test included.
- **D-2.3:** The JS source change is localised — `grep -nE
  "template.*escape\|TemplateLiteral.*emit" packages/lang/compiler.js`
  shows the new logic.
- **D-2.4:** If the fix required upstream `astring` work, surface
  this in the closing report and propose either a workaround or
  defer the fix.

### D-3 — Single-param arrow paren cosmetic

**Failing test first.** Write a `compileBoth` test that compiles
`(=> (x) x)` or equivalent single-param arrow source and asserts
JS and Rust outputs converge. The test MUST fail before the fix
(Rust emits `(x) =>`, JS emits `x =>`).

**Direction call.** Two options:
- **(a) Align Rust to JS** — strip the parens around single
  identifier params in arrow expressions (matching JS's minimal
  form).
- **(b) Align JS to Rust** — JS adds parens (matching Rust's more
  explicit form).

**CDC lean: (a).** JS's `x =>` is the more idiomatic JavaScript
shape; aligning Rust to it preserves the slightly-more-readable
output. But this is a minor cosmetic choice; if you find a
structural reason to prefer (b) during implementation (e.g.,
parenthesised form is consistent with other arrow cases and
prevents future ambiguity), stop and surface.

**Fix.** Per the direction call. Locate the Rust arrow-emission
site in `crates/lykn-lang/src/codegen/emit.rs` (likely an
`emit_arrow` function or arrow handling within the `=>` case).
Add a single-param-paren-strip check.

**Acceptance criteria (per-item):**

- **D-3.1:** The new `compileBoth` test for single-param arrow
  convergence (written first) now passes.
- **D-3.2:** Other arrow tests (multi-param, no-param, etc.) still
  pass. Verify: existing arrow-related tests pass; total
  `compile-both` count strictly greater than 109 (the post-wishlist
  baseline).
- **D-3.3:** `cargo test -p lykn-lang` exits 0.

---

## Aggregate acceptance criteria

| ID | Criterion | Verify |
|----|-----------|--------|
| AG-1 | All three items have failing-test-first commits | For each of D-1, D-2, D-3: the commit chain shows a test commit (test that fails on the pre-fix state) preceded the fix commit. `git log --oneline cdc/compiler-coherence \| head -20` shows interleaved test + fix commits per item |
| AG-2 | All test suites pass post-change | `cargo test -p lykn-lang`, `cargo test -p lykn-cli`, `make test-lykn`, `./bin/lykn test test/forms/` all exit 0 |
| AG-3 | Test counts strictly greater than post-wishlist baseline | `compile-both` count > 109; Rust `#[test]` count > 1001 |
| AG-4 | No regressions in any previously-passing test | Test pass counts ≥ post-wishlist baseline (1001 Rust, 292 surface, 669 forms — except where increased by new tests) |

---

## Forbidden patterns

- **Do NOT fix the lambda expansion divergence.** Deferred to
  DD-58.
- **Do NOT skip the failing-test-first discipline.** Each fix MUST
  start with a test that exercises the bug, fails, then passes
  after the fix. Closing report MUST cite the test commits for
  each item.
- **Do NOT mix items across commits.** Each item (D-1, D-2, D-3)
  gets its own commit (or test-commit + fix-commit pair).
- **Do NOT extend the normalizer to hide D-2 or D-3 divergences.**
  Both are direction-(a) or direction-(b) fixes (align one
  compiler); no normalizer extension permitted for them.
- **Do NOT auto-accept any insta snapshot diffs.**

---

## Iteration budget

**5 iterations.** Expected 1–2. If you reach iteration 5 without
convergence, stop. Rework scope or surface a methodology question.

Per Duncan's 2026-05-16 override on the wishlist work: the cap is
a guard against compliance-theatre / infinite spin, not against
good-faith engineering iteration. If real engineering issues
surface, surface them — don't sacrifice good engineering on the
altar of time-budgets.

---

## Closing report requirements

Produce a closing report at
`workbench/2026-05-<date>-drive-by-cleanups-closing-report.md`. The
closing report MUST:

1. Walk each of D-1, D-2, D-3 with final status (`done` /
   `deferred` / `no-op`) and Verify command output as evidence.
2. For each item, cite the test commit SHA AND the fix commit SHA,
   in that order, demonstrating the TDD-first discipline.
3. For D-3, name the direction chosen (a or b) and the rationale.
4. If D-2 requires upstream astring work, name the disposition
   (workaround landed; defer; etc.).
5. Include a "Substrate-rule compliance" section addressing
   CLAUDE.md safety gates, LEDGER_DISCIPLINE no-silent-rewrite,
   the TDD-first discipline (named explicitly), and partial-
   adoption check.
6. Include a "Findings for fast-follow" section logging any new
   findings. If none, say so explicitly.
7. Name any uncertainty.

---

## What you do NOT need to do

- You do not need to touch the lambda expansion divergence.
- You do not need to touch DD-58 or DD-37.
- You do not need to convert any tests beyond the new tests
  required by D-1/D-2/D-3.
- You do not need to address methodology learnings (TDD-first
  canonicalisation, etc.) — those are CDC work.

---

## Start

1. Read the required materials.
2. Start with the easiest item to build momentum (probably D-3 —
   small, isolated codegen change).
3. For each item, write the failing test FIRST. Commit the test.
   Then implement the fix. Commit the fix.
4. Run the test suites after each item to catch regressions early.
5. Surface anything that looks off before working around it.
