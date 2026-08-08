# M17 Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-17-M17-closing-report.md`
**Reviewed at:** 2026-05-17
**Disposition:** **Accepted.** All 8 ledger rows walked with
evidence; substantive intent of every row met; TDD-first
discipline honored in substance with one honest disclosure
(M17-4's test passes trivially because M17-3's fix bundled the
positive and negative paths — methodology-acceptable; CC
disclosed honestly rather than hiding). Iteration count: 1 of 5.

---

## Protocol checklist (LEDGER_DISCIPLINE CDC protocol)

| Requirement | Status | Notes |
|---|---|---|
| Item count: 8 rows → 8 walked | ✓ | All ledger rows addressed |
| Every done row: evidence reproducible | ✓ | Verified independently below |
| No silent drops | ✓ | All rows reach final status |
| Spec-softening check | ✓ (with M17-4 nuance) | See M17-4 disposition below |
| Partial-adoption check | ✓ | Single-site classifier change; no fan-out |
| Backward-compat invariant | ✓ | Test counts strictly ≥ baseline; no regressions |
| TDD-first discipline | ✓ (with M17-4 nuance) | See methodology observation below |
| Substrate-rule compliance section | ✓ | Six rules addressed |
| Fast-follow findings logged | ✓ | One: JS-side kernel: prefix recognition (M18+ scope, as expected) |

---

## Per-row verification (independent reproduction)

### M17-1 — Baseline state capture ✓

- `test -f workbench/verify/m17/baseline.txt` → exists.
- 6 section headers (criterion was ≥4).

### M17-2 — Reader preserves `kernel:if` as single atom ✓

- Regression test `parse_kernel_prefix_as_single_atom` exists at
  `crates/lykn-lang/src/reader/parser.rs`.
- Test passes — confirms DD-01's "colons are ordinary characters"
  rule holds for the `kernel:` prefix as DD-58 assumed. Reader
  needed no changes, just a regression-guard.

### M17-3 — Classifier accepts `kernel:` prefix → KernelPassthrough ✓

**Commit chain (TDD-first verified):**
- `18f4b31` M17-3 test (failing).
- `28680d9` M17-3 fix (passing).

**Implementation verified (read of `crates/lykn-lang/src/classifier/forms.rs`):**

```rust
// DD-58: kernel: prefix escape — strip prefix, validate
// against kernel whitelist, emit KernelPassthrough with
// the stripped form. Takes precedence over all other dispatch.
if let Some(kernel_form) = head_name.strip_prefix("kernel:") {
    if dispatch::is_kernel_form(kernel_form) {
        ...
        return Ok(SurfaceForm::KernelPassthrough { ... });
    }
    return Err(Diagnostic { ... });
}
```

The implementation matches DD-58's prescribed shape exactly:
strip → validate → either passthrough or diagnostic. DD-58 cited
in the comment. The prefix handler takes precedence over all
other dispatch (correct per DD-58's "classifier dispatches before
member-access compilation" requirement).

### M17-4 — Invalid `kernel:<form>` produces diagnostic ✓ (with methodology nuance)

**Commit chain:**
- `8823c51` M17-4 test (passes immediately because M17-3 fix
  bundled the diagnostic logic).

**Diagnostic verified:** `"unknown kernel form 'nonexistent' in
(kernel:nonexistent ...)"` — names the form explicitly. First-
pass implementation; did-you-mean suggestion was polish-grade per
the ledger and was reasonable to defer.

**Methodology nuance:** The ledger required "failing-test-first:
test for `(kernel:nonexistent ...)` exists and fails before
implementation; passes after." Strict reading: the test should
have been written between M17-3's failing test and M17-3's fix,
so that BOTH tests failed pre-fix and BOTH passed post-fix. CC
wrote it after the M17-3 fix landed, so it passed trivially.

**CDC disposition:** *Accept.* CC's "What Worked" #3 makes a
defensible methodology point: "the diagnostic is structurally
part of the prefix handler. Writing the M17-4 test after M17-3's
fix confirmed this — the test passes trivially because the
validation is the natural else-branch of the handler. This is
better engineering than artificially separating them."

The substantive intent of M17-4 (the diagnostic exists, names
the form, is a regression guard against future changes) IS met.
CC's honest disclosure (naming the trivial-pass explicitly rather
than hiding it) is methodology-correct.

**Methodology learning worth canonicalising:** when ledger rows
split a positive-path and negative-path of the SAME implementation
site, the TDD-first discipline should adapt — what matters is "is
there a failing test for each substantive behaviour change before
the implementation lands," not "does each row's test commit
strictly precede each row's fix commit." Future ledger drafting
should either (a) merge such rows into one row with both test
cases under one TDD-first discipline, OR (b) explicitly note in
the prompt that the negative-path test may be regression-coverage
rather than TDD-driven.

### M17-5 — compile-both convergence (skip-with-rationale) ✓

**Honest disposition:** the JS compiler does NOT yet handle the
`kernel:` prefix — treats `kernel:const` as member access
(`kernel.const(x, 42)`). JS-side recognition is M18+ scope
requiring DD-37's Phase 3+ classifier.

- Integration test file `test/forms/dd-58-kernel-escape_test.lykn`
  exists with 19 lines.
- Skip-rationale comment names the M18 prerequisite explicitly
  and cites DD-58 §"Phase 2 — JS classifier".
- Rust-side behaviour verified independently via the integration
  test (uses `compile`, not `compile-both`, until JS-side support
  lands).

**CDC accepts the skip-with-rationale disposition** — it's
exactly the honest path the prompt envisioned for this case.

### M17-6 — No behaviour change for non-`kernel:` code ✓

**Independent verification:** worktree `#[test]` count for
`lykn-lang` is 1006. The pre-M17 baseline (post-drive-by-cleanup)
was 1003. Net +3 tests from M17 (reader regression + classifier
positive + classifier negative). No removals. Backward-compat
invariant holds.

**Surface and forms counts:** matches baseline (292 / 670). No
regression.

### M17-7 — Substrate-rule compliance section ✓

Six rules addressed in the closing report. CDC concurs:

- AGENTS.md safety gates: no bypass flags. ✓
- LEDGER_DISCIPLINE no-silent-rewrite: all rows addressed; no
  Verify commands modified. ✓
- philosophy.md Principle 1: no source-tree structural changes. ✓
- philosophy.md Principle 3: compiler output quality improved
  (kernel escape now reachable). ✓
- Backward-compat invariant: no regressions. ✓
- TDD-first discipline: M17-3 honored strictly; M17-4 honored
  in substance with honest disclosure (see nuance above). ✓

### M17-8 — Single coherent commit chain ✓

**Verified via `git log --oneline cdc/compiler-coherence`:**

- `7e5ec04` M17-2: Reader regression test
- `18f4b31` M17-3 test: failing test for kernel: prefix classification
- `28680d9` M17-3 fix: classifier accepts kernel: prefix, routes to KernelPassthrough
- `8823c51` M17-4 test: invalid kernel: form produces diagnostic
- `bdbe2a6` M17-5: kernel: escape integration test + compile-both skip-rationale

Five commits. M17-3 test precedes M17-3 fix as required. M17-4
test follows M17-3 fix (the trivial-pass case, disclosed). Commit
messages are clear and link to ledger row IDs.

---

## Methodology observations

### Methodology-positive behaviours

1. **CC's exact-shape conformance to the prompt.** The
   implementation matches DD-58's prescribed shape exactly: strip
   → validate → emit. The DD-58 citation appears in the code
   comment. The prefix takes precedence over all other dispatch.
   No scope creep into dispatch tables, strict mode, or JS-side
   work.

2. **M17-2 preflight discipline worked.** CC verified the reader
   assumption before writing classifier code. If the reader had
   differed from DD-58's assumption, CC would have stopped and
   surfaced — but the assumption held, so the work proceeded.
   This is exactly the "verify before working around" pattern that
   the methodology asks for.

3. **CC's M17-4 trivial-pass disclosure.** This is the textbook
   example of honest engagement: the test passes immediately
   because the broader implementation already covered it; CC
   named this explicitly in the closing report's "What Worked"
   section rather than pretending it followed strict TDD-first.
   The methodology insight (positive-path and negative-path are
   structurally linked) is valuable.

4. **The scope boundary held cleanly.** The milestone touched
   exactly one function with 18 lines of new logic. M18 and later
   are unaffected. Future milestones (closed-namespace dispatch
   tables, strict-mode flag, JS-side parity) build on a stable
   foundation.

### Methodology learning candidates (for future ledger drafting)

1. **When ledger rows split positive-path and negative-path of
   the same implementation site, TDD-first discipline should
   adapt.** Either merge such rows into one row with both test
   cases under one TDD-first discipline, OR explicitly note in
   the prompt that the negative-path test may be regression-
   coverage rather than TDD-driven. M17-3 + M17-4 is the
   canonical example: M17-3's implementation naturally covered
   M17-4's substance, so artificially separating them would have
   added complexity without value.

2. **The "preflight verify-assumption" pattern is reusable
   beyond M17.** When a milestone's implementation depends on an
   architectural assumption about an upstream component, requiring
   a preflight test that verifies the assumption catches design-
   level surprises before implementation work begins. Worth
   embedding in future implementation prompts where appropriate.

---

## Open inputs for Duncan

1. **Accept M17 closure?** CDC recommendation: yes.
2. **Methodology learning #1 (positive/negative-path row
   splitting)** — canonicalise in LEDGER_DISCIPLINE or as a
   thread-level note? CDC lean: thread-level note for now; promote
   if the pattern recurs.
3. **Next milestone: M18.** Scope was "closed-namespace dispatch
   tables + strict-mode flag" per the M17 ledger's framing. Worth
   me drafting M18 ledger + implementation prompt now, or wait for
   you to merge cdc/compiler-coherence first?
4. **Commit timing:** when you merge cdc/compiler-coherence into
   release/0.6.x, M17 + the three drive-by cleanups (D-1, D-2,
   D-3) all land together. Sequencing your call.

---

## What CC does NOT need to redo

- All 8 rows are substantively complete.
- The classifier implementation matches DD-58's prescribed shape.
- The diagnostic format is correct and informative.
- The skip-with-rationale for compile-both is the right disposition.
- Backward-compat preserved.
- TDD-first honored in substance.

CDC's observations are methodology learnings, not corrections.
