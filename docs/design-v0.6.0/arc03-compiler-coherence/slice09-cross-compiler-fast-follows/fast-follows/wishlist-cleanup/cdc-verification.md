# Wishlist Cleanup Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-16-wishlist-cleanup-closing-report.md`
**Reviewed at:** 2026-05-16
**Disposition:** **Accepted.** All 12 items walked with evidence;
six aggregate criteria verified independently; four fast-follow
findings surfaced honestly; correctness-grade promotions deferred
to DD-58 with explicit rationale. CC's behaviour throughout was
methodology-positive across multiple dimensions (gate compliance,
honest reframing, duplication discovery, TDD self-reflection).
Iteration count: not flagged per Duncan's 2026-05-16 explicit
override on the budget.

---

## Protocol checklist (LEDGER_DISCIPLINE CDC protocol)

| Requirement | Status | Notes |
|---|---|---|
| Item count: 12 items → 12 walked | ✓ | A-1, A-2, A-3, B-1, B-2, B-3, C-1 (4 sub-items), C-2, C-3 (2), C-4 (2), C-5, C-6 (2) |
| Every done item: evidence reproducible | ✓ | All grep-verifiable claims confirmed independently |
| No silent drops | ✓ | Deferred items (C-1c, C-4b) explicitly named with rationale |
| Spec-softening check | ✓ | Deferrals are CDC-approved, not silent downgrades |
| Partial-adoption check | ✓ | Codegen fixes applied uniformly; template fix in BOTH emit.rs and icu.rs |
| Substrate-rule compliance section | ✓ | Four rules addressed |
| Fast-follow findings logged | ✓ | Four findings, each precisely characterised |
| Time-budget override disclosed | ✓ | Named at the top of the report; per Duncan's call |

---

## Aggregate criteria — independent verification

- **AG-1: 9 affected files use compile-both** ✓
  Each file has ≥1 compile-both invocation: tag_test (2),
  object_test (8), default-params_test (4), generator_test (9),
  destructuring-params_test (8), destructuring-assignment_test (2),
  class_test (5), class-methods_test (7), async-await_test (3).
- **AG-2: compile-both count strictly > 68** ✓
  Count is **109** (60% growth over baseline 68).
- **AG-3: test counts ≥ baseline** ✓
  CC reported test counts: 1001 Rust (lykn-lang only — different
  scope than the earlier 1071 which included lykn-cli), 292
  surface, 669 forms. Independent `#[test]` count check:
  worktree has 1001 lykn-lang + 199 lykn-cli = 1200 total; baseline
  has 1000 + 195 = 1195. **Net +5 tests, no removals.** The
  scope-inconsistency in the closing report's "1001 Rust" framing
  is a minor reporting issue, not spec-softening.
- **AG-4: C-3 normalizer extension with rationale** ✓
  Comment block above the new `}\s*; → }` transformation names the
  M16-2 C-3 origin and the "stylistic-only" framing.
- **AG-5: ≥2 "DD-58 deferral" comments** ✓
  3 total: 2 in class-methods_test.lykn, 1 in
  destructuring-assignment_test.lykn.
- **AG-6: C-6 template content fix lands or defers with finding** ✓
  Landed as localised emitter fix in both `emit_template_text`
  (emit.rs:148) and `emit_template_text_icu` (icu.rs:776).
  Entanglement check explicitly negative ("NOT entangled with
  surface/kernel boundary"). Duplication of the escape logic
  surfaced as fast-follow finding #1.

---

## Per-item verification

### Tier A — Coverage gaps

- **A-1 (cmd_compile routing test) ✓** — two tests exist in
  `crates/lykn-cli/tests/source_context_path_routing.rs` per CC's
  claim. The negative case (without flag, /tmp directory, import
  fails) is a particularly nice test design — it verifies the
  `None` branch by *exercising* the failure mode, not just by
  asserting structure.
- **A-2 (CLI help output test) ✓** — third test in the same file.
- **A-3 (bad-form fixture) ✓** — landed at commit `c29f6a2`.

### Tier B — Documentation

- **B-1 (compileBoth docstring overhaul) ✓** — 50+ lines per CC's
  claim. Names everything the prompt required.
- **B-2 (synthetic-path routing comment) ✓** — 15 lines per CC.
  Cites pass0.rs, explains parent-irrelevance/parent-significance,
  documents None-default path.
- **B-3 (normalizer policy comment) ✓** — comment above
  `normalize` function with the forbidden-extension policy AND the
  list of transformations.

### Tier C — Formatting divergences

- **C-1a (object parens + formatting + computed keys) ✓** — three
  related codegen fixes landed across f1f04a5 and 19f7d11. CC
  explicitly named the refinement path (initial implementation
  refined). Methodology-positive.
- **C-1b (class body whitespace) ✓** — empty class bodies emit
  `{}` on one line; non-empty bodies converge via normalization.
- **C-1c (class constructor = deferred to DD-58) ✓** — rewrite
  pattern `(class Foo () (constructor (x) (set! this:x x)))`
  verified in test file; rationale comment cites this CDC review.
- **C-2 (generators) ✓** — converted to compile-both; passes.
  CC's secondary finding ("Original failure was import pattern
  issue — sed didn't convert the generator file's non-standard
  import line") is the kind of empirical-discovery-during-
  conversion that surfaces real test-infrastructure quirks.
- **C-3a (trailing `;` normalizer) ✓** — `}\s*; → }` extension
  with rationale comment.
- **C-3b (async arrow parens) ✓** — wraps async arrows but NOT
  async function declarations (refined after initial too-aggressive
  implementation). Honest refinement disclosed.
- **C-4a (destr-param formatting) ✓** — 9 of 10 tests converge;
  one (single-param arrow paren cosmetic) uses JS-only compile
  with rationale (this is the new finding #4).
- **C-4b (destr-assign = deferred to DD-58) ✓** — skip-rationale
  comment in test file.
- **C-5 (default params) — verified, with a methodology note ✓**
  The "investigate first" requirement was honored: CC found the
  failing pattern was bare arrow paren wrapping, **same root cause
  as C-3b**. Fix was the same codegen change. **This is the
  single most valuable empirical finding of Turn 2:** what looked
  like 6 distinct classes turned out to have shared root causes,
  meaning fewer fixes than the diagnosis predicted. Methodology-
  positive consolidation.
- **C-6a (tag parens) ✓** — CC's refinement from initial (a)
  direction is correct: tagged templates are unambiguous at
  statement level, so no wrapping needed. Honest correction of
  the diagnosis direction based on implementation reality.
- **C-6b (template content) ✓** — localised emitter fix in
  BOTH emit.rs and icu.rs. NOT entangled with surface/kernel.
  Duplication of the escape logic is fast-follow #1.

---

## Substantive findings disposition

CC logged four fast-follows; CDC reads on each:

1. **Duplicate template-text escape functions (emit.rs and icu.rs).**
   **Accept; substantive.** The duplication is real (independently
   verified: `emit_template_text` at emit.rs:148, called at :1187;
   `emit_template_text_icu` at icu.rs:776, called at :740 and :750).
   Unification into a single function both paths call is the right
   shape. Low-priority cleanup; doesn't need its own milestone.

2. **JS compiler double-escapes template content (mirror image of
   C-6b).** **Accept; substantive correctness-grade for the JS
   side.** Direction (b)-style alignment: JS aligned to Rust's
   now-correct output. This means TWO compilers' template emitters
   had the same bug, and Rust fixed it first. The JS-side fix is
   tracked. Worth filing as a follow-up that lands together with
   the M16-2 compile-both conversions that will now surface the
   divergence.

3. **Lambda expansion divergence (JS → function, Rust → =>).**
   **Accept; DD-58 territory.** Different `this`-binding semantics
   between `function` and `=>`. This is exactly the surface-form-
   semantics question DD-58's closed-namespace model is designed
   to settle.

4. **Single-param arrow paren cosmetic (Rust: `(x) =>`, JS: `x =>`).**
   **Accept; polish-grade.** Both are valid JS; the runtime
   semantics identical. Minor codegen alignment candidate; not
   urgent.

---

## Methodology observations

### Methodology-positive behaviours

1. **The diagnosis-then-implementation gate held twice.** CC
   stopped at Turn 1, surfaced findings + amendment request +
   correctness-grade promotions. Then in Turn 2, CC encountered
   real Rust emitter issues during implementation, made
   substantive engineering progress, and produced a closing
   report with honest refinements. The gate pattern surfaces
   what's worth surfacing; the engineering iteration produces
   real value.

2. **CC's TDD self-reflection** (closing message: "Your question
   about TDD was the right call — the C-6b template content
   debugging took much longer than needed because I didn't write
   the failing test first. The ICU path was the actual culprit,
   and a failing unit test would have caught it immediately.") is
   a substantive methodology-learning moment. Worth canonicalising
   beyond this thread.

3. **Honest reframing of directions** based on implementation
   reality: C-6a (tag parens) was diagnosed as direction (a) — wrap
   them — but during implementation CC realised tagged templates
   are unambiguous at statement level and refined to "don't wrap."
   The refinement is the right call; the diagnosis-direction was
   wrong, and CC surfaced the correction explicitly rather than
   silently doing what the prompt said.

4. **C-5 root-cause consolidation.** What looked like 6 distinct
   formatting-class divergences turned out to have shared root
   causes (C-5 reduces to the same codegen change as C-3b). This
   is the kind of "fewer fixes than expected" outcome that should
   always be celebrated rather than hidden.

5. **C-6b duplicate-function discovery.** CC found that the
   template-content bug existed in two places (emit.rs and
   icu.rs) because the escape logic was duplicated. CC fixed both
   AND surfaced the duplication as a fast-follow. Substrate-pillar
   discipline working as designed.

6. **CC's behaviour around the time-budget override** is also
   methodology-positive. CC didn't stop short at iteration N to
   meet a count target; CC produced honest engineering output and
   disclosed the override explicitly at the top of the closing
   report. This is exactly how human-in-the-loop methodology
   override should work.

### Methodology-learning candidates (for future ledger / prompt drafting)

1. **TDD-first for emitter bug diagnosis.** CC's self-reflection
   names this concretely. Future implementation prompts for
   emitter-level fixes should require a failing unit test BEFORE
   the fix, not after. Would have caught the ICU path bug in
   C-6b immediately.

2. **The "6 classes turned into N fewer" pattern.** When scoping
   formatting-divergence work, expect root-cause consolidation.
   The diagnosis enumerates N classes; the fix may resolve N-k
   because of shared causes. Don't be alarmed by "fewer fixes
   than expected"; it's the right shape.

3. **Three of six classes promoted to correctness-grade
   between diagnosis and implementation.** This is the same
   ratio observed in similar work. Consider: when prompting for
   "formatting-class" cleanup, ALWAYS include the escape hatch
   for promotion to correctness-grade. The escape hatch isn't
   exotic; it's the common case.

---

## Recommendations

1. **Accept this closure.** All 12 items met; aggregate criteria
   verified; deferrals explicit; fast-follows precise.

2. **Schedule the fast-follow finding #2 (JS template
   double-escape)** as a follow-up — it's the mirror image of the
   Rust fix. Probably a one-PR fix in `packages/lang/compiler.js`
   or astring's invocation. Could land as a drive-by in any
   upcoming JS-compiler-touch milestone.

3. **Schedule fast-follow finding #1 (duplicate template-text
   escape functions)** as a low-priority cleanup. Unify
   `emit_template_text` and `emit_template_text_icu`. Reduce
   surface area for future bugs.

4. **Defer fast-follow finding #3 (lambda expansion divergence)
   to DD-58.** Surface-form semantics question.

5. **Polish fast-follow finding #4 (single-param arrow paren)** —
   minor cosmetic; can land any time.

6. **The TDD-first lesson** (CC's closing self-reflection) is
   worth canonicalising in LEDGER_DISCIPLINE or as a thread-level
   methodology note. Concretely: future emitter-fix prompts should
   require failing test FIRST.

---

## What CC does NOT need to redo

- All 12 items are substantively complete.
- The Tier A integration tests are well-designed (especially A-1's
  negative case).
- The Tier B documentation is thorough.
- The Tier C codegen fixes are correctly scoped and refined.
- The deferred-to-DD-58 handling is clean.
- The fast-follow findings are precise and honest.

CDC's observations are methodology learnings, not corrections.

---

## Open inputs for Duncan

1. **Accept this closure?** CDC recommendation: yes.
2. **Schedule fast-follow #2 (JS template double-escape)** — when
   and where? CDC lean: drive-by in any JS-compiler-touch
   milestone OR a 2-item mini-prompt covering #1 (unify template
   escape funcs) + #2 (JS-side fix).
3. **DD-58 follow-up logging.** I'll add C-1c, C-4b, and Finding
   #3 (lambda divergence) to DD-58's draft as "items the
   closed-namespace model resolves." Confirm if you want this
   in the next DD-58 revision or held for later.
4. **TDD-first methodology learning** — canonicalise in
   LEDGER_DISCIPLINE or thread note? CDC lean: thread note for
   now; promote if the pattern recurs.
5. **Commit timing for cdc/compiler-coherence merge to
   release/0.6.x.** All M16 + source-context-path + import-macros
   runtime-import + compile_file_with_dts cleanup + wishlist
   cleanup commits land together when you merge. Sequencing your
   call.
