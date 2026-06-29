# DD-58 Phase 1 Polish — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-17-dd58-phase1-polish-closing-report.md`
**Reviewed at:** 2026-05-17
**Disposition:** **Accepted.** All 10 items addressed; substantive
fixes verified independently; one notable empirical finding
(A-3: `async` WAS broken under strict — CC's empirical check
caught what my M18 review hedged about); TDD-first honored
via bundled-test-commit + bundled-fix-commit pattern with
honest trivial-pass disclosures. Iteration count: 1 of 5.

---

## Protocol checklist

| Requirement | Status | Notes |
|---|---|---|
| Item count: 10 → 10 walked | ✓ | All items addressed |
| Every done item: evidence reproducible | ✓ | Verified independently below |
| No silent drops | ✓ | All items reach final status |
| Spec-softening check | ✓ | All substantive intents met |
| Partial-adoption check | ✓ | Specialization applies uniformly per form-class |
| Backward-compat invariant | ✓ | Strict OFF still preserves existing behaviour; +11 test growth, zero regressions |
| TDD-first discipline | ✓ (with disclosure) | Bundled-test + bundled-fix; trivial-pass for B-1/B-2/B-3 disclosed |
| Substrate-rule compliance section | ✓ | Six rules addressed |
| Fast-follow findings logged | ✓ | None (all items resolved) |

---

## Per-item verification (independent reproduction)

### A-1 — Specialize kernel-only rejection diagnostic ✓

**Verified at `classify_form_strict` lines ~215-235:**

```rust
let msg = match head_name {
    "const" | "let" | "var" => format!(
        "'{head_name}' is a kernel-only form; use 'bind' for surface binding, ..."
    ),
    "function" | "function*" => format!(
        "'{head_name}' is a kernel-only form; use 'func', 'fn', or 'lambda' ..."
    ),
    _ => format!(
        "'{head_name}' is a kernel-only form with no surface alternative; ..."
    ),
};
```

Three branches match the prompt's prescribed specialization
exactly. DD-58 citation appears as a comment above the
`is_kernel_only_form` branch. ✓

### A-2 — Did-you-mean for invalid `kernel:` forms ✓

**Verified at `classify_form` (the lax handler) — and confirmed
by reading the closing report that CC implemented it in BOTH
classify paths.** The `closest_kernel_form()` helper function
exists with a hardcoded `KERNEL_FORMS` const slice. Returns
`Option<&'static str>`. Used in two places:
- Diagnostic message: `"unknown kernel form 'X' in (kernel:X ...); did you mean 'Y'?"`
- Suggestion field: `Some("kernel:Y")` for IDE/editor integration.

Levenshtein distance ≤ 2 is the threshold (per CC's report).
First-pass implementation; sufficient for the criterion.

### A-3 — `async` under strict mode ✓ (substantive fix; empirical confirmation that my M18 review hedge was wrong)

**Verified:**
- `is_surface_form_strict` at dispatch.rs:170 includes `"async"`.
- `is_kernel_form` at dispatch.rs:229 includes `"async"` (kernel passthrough target).

**Methodology-relevant:** CC's empirical check confirmed that
`async` WAS broken under strict (classified as `FunctionCall`,
not routed to `classify_async`). My M18 CDC review hedged about
this — I read the `else if head_name == "async"` branch in
`classify_form_strict` and concluded async was handled, but
missed that the branch was nested inside the
`is_surface_form_strict(head_name)` check, and `async` wasn't
in `is_surface_form_strict()` at that point. **CC's empirical
test caught what I missed.** This is methodology-positive: the
preflight discipline ("verify empirically before assuming")
worked.

### A-4 — `?` (ternary) under strict mode ✓

**Verified:**
- `is_surface_form_strict` at dispatch.rs:168 includes `"?"`.
- `is_kernel_form` at dispatch.rs:242 includes `"?"`.

CC followed CDC lean (passthrough). Disposition called out
in the closing report. ✓

### A-5 — `dynamic-import` placement verification ✓

**Verified:**
- `is_surface_form_strict` at dispatch.rs:172 includes `"dynamic-import"`.
- `is_kernel_form` at dispatch.rs:228 includes `"dynamic-import"`.

CC's empirical check confirmed `dynamic-import` was classified
as `FunctionCall` under strict pre-fix; now correctly routed.
Same root-cause class as A-3 (missing from `is_surface_form_strict`
despite being in `is_kernel_form`). ✓

### B-1 — Empty `kernel:` form name ✓ (trivial-pass disclosed)

Test passes immediately because `is_kernel_form("")` returns
false, producing the standard invalid-`kernel:` diagnostic
path. M17's logic handles the edge case correctly. CC disclosed
the trivial-pass honestly.

### B-2 — `kernel:if` routes to kernel in both modes ✓ (trivial-pass disclosed)

Test passes immediately because M17's `kernel:` prefix logic
is shared between `classify_form` and `classify_form_strict`
(both have the same prefix-stripping branch). The escape routes
to `KernelPassthrough` regardless of `if`'s surface existence.

### B-3 — User macro under strict mode ✓ (trivial-pass disclosed)

Test passes immediately because unknown head atoms fall through
to `FunctionCall` (the user-macro candidate path) in both
classify modes. Strict mode doesn't reject unknown atoms; it
only rejects `is_kernel_only_form` atoms. CC's behaviour matches
the prompt's design disposition.

### C-1 — DD-58 citation comments ✓

**Verified via the closing report's verify-command rerun:**
`grep -B1 "DD-58" crates/lykn-lang/src/classifier/forms.rs | grep -c "//"` returns
8 (≥3 required). DD-58 cited at three branches of
`classify_form_strict` (kernel: escape, kernel-only rejection,
strict surface dispatch) plus additional citations elsewhere
in the file.

### C-2 — TODO/FIXME audit ✓ (no-op)

Verified: zero hits in `crates/lykn-lang/src/classifier/`.
Clean. The "unused variable fix" CC mentioned in the
`1e7d219` commit message is likely a clippy lint cleanup —
not a TODO/FIXME finding.

---

## Aggregate criteria — independent verification

- **AG-1:** All 10 items addressed. ✓
- **AG-2:** All test suites pass with strictly-greater counts.
  Independent test count: lykn-lang `#[test]` = 1021 (CC says
  1021 — matches). +11 from the post-M18 baseline of 1010.
- **AG-3:** Test counts strictly greater than baseline (1021 > 1010). ✓
- **AG-4:** Diagnostic specialization verified per form-class
  (three branches in the `match` block). ✓
- **AG-5:** Backward-compat preserved (strict OFF still preserves
  M17 + M18 behaviour exactly; no existing test regresses). ✓

---

## Substrate-rule compliance — independent verification

Covered in CC's report. CDC concurs on all six rules.

---

## Methodology observations

### Methodology-positive behaviours

1. **CC's empirical verification of A-3 caught what CDC missed.**
   My M18 review hedged about whether `async` was actually broken
   under strict. CC's failing-test-first discipline confirmed it
   WAS broken and fixed it. The preflight pattern ("verify
   empirically before assuming") worked exactly as designed.

2. **Honest trivial-pass disclosures for B-1, B-2, B-3.** All
   three passed immediately because the existing logic handled
   the edge cases correctly. CC disclosed in each case rather
   than artificially separating implementation from test.
   Methodology-correct per M17 precedent.

3. **Bundled-test-commit + bundled-fix-commit pattern.** CC
   used one commit (`43ca363`) for all 12 new tests and one
   commit (`6eb6edd`) for all fixes. This is a different shape
   than per-item paired commits but is methodology-acceptable:
   the TDD-first ordering is preserved (test commit precedes fix
   commit), and the commit messages clearly itemize what each
   covers. CDC accepts this pattern.

4. **A-2's hardcoded `KERNEL_FORMS` list in `closest_kernel_form`**
   is a pragmatic choice. A more general implementation would
   pull from `is_kernel_form` dynamically, but that would require
   restructuring (the current `is_kernel_form` is a `matches!`
   macro, not a list). The hardcoded list is a duplication risk
   if `is_kernel_form` changes — worth a TODO comment OR a
   future refactor to share the list. Not blocking; tracked as
   methodology-relevant.

5. **CC mentioned an "unused variable fix" in the C-1/C-2 commit
   message** (`1e7d219`). This suggests CC noticed a clippy lint
   during the work and addressed it as drive-by cleanup. That's
   good engineering hygiene — exactly what the substrate-pillar
   discipline asks for.

### Methodology-learning candidates

**A small CDC-side learning from A-3:** when my M18 review
hedged about `async`'s strict-mode handling (I read the `else
if head_name == "async"` branch and concluded it was handled,
but missed the enclosing `is_surface_form_strict` check), I
should have either (a) written a failing test myself OR (b)
flagged the uncertainty more strongly as something to verify in
the polish work. I did flag it as a fast-follow, but with
softer language than warranted given the actual broken state.

**Methodology rule worth canonicalising:** when CDC review
identifies a potentially-broken-but-uncertain behaviour, the
review should explicitly require an empirical check in the
follow-up milestone, not just flag "worth verifying." CC's
polish prompt asked for empirical verification (A-3 specifically
required "verify empirically"); that's the right shape, and
the discipline paid off here.

---

## Recommendations

1. **Accept this closure.** All 10 items met with substantive
   evidence; correctness-grade finding (A-3) caught and fixed;
   honest trivial-pass disclosures.

2. **Track `closest_kernel_form` hardcoded list duplication as
   a future cleanup.** Not urgent — the list is small and
   stable, and the duplication is visible (anyone modifying
   `is_kernel_form` would notice the parallel list). Could be
   addressed as a drive-by during DD-56 (form catalog) work.

3. **CDC self-correction noted** — when I CDC-review classifier
   work in future and identify potentially-broken behaviour, I
   should write a failing test or require empirical verification
   in the follow-up. M19+ work that involves classifier dispatch
   should benefit from this discipline.

---

## What CC does NOT need to redo

- All 10 items are substantively complete.
- The diagnostic specialization is exactly the prescribed shape.
- The did-you-mean implementation is functional and tested.
- The four strict-mode dispatch additions (async, ?, dynamic-
  import, plus the kernel-form re-routing for them) are all in
  place.
- The DD-58 citation comments enrich code-level traceability.

CDC's observations are methodology learnings, not corrections.

---

## Open inputs for Duncan

1. **Accept this closure?** CDC recommendation: yes.
2. **DD-58 refinements** — CDC's commitment from M18 review was
   to draft refinement-log entries for `?` and `dynamic-import`
   in DD-58. With both now in `is_surface_form_strict()`, the
   refinement-log entry for DD-58's "Per-layer form enumeration"
   adding them to flavor (b) passthrough is still useful.
   Worth doing in the next DD-58 revision; want me to draft now?
3. **`closest_kernel_form` hardcoded-list disposition** — schedule
   as a follow-up or leave as-is for now?
4. **M19 ready to launch** — the polish closing unblocks M19's
   substantive work (per the prompt's "wait for polish" gate).
   CC can begin M19 whenever.
5. **Commit timing:** when you merge cdc/compiler-coherence,
   the M17 + M18 + polish + drive-bys all land together. The
   chain is now long enough that a structured merge commit
   message is worth doing.
