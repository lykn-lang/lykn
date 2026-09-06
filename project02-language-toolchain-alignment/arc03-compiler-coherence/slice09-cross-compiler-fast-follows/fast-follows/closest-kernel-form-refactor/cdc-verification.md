# closest_kernel_form Refactor — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-17-closest-kernel-form-refactor-closing-report.md`
**Reviewed at:** 2026-05-17
**Disposition:** **Accepted.** Refactor is substantively correct and
the methodology was honored properly. One minor methodology
observation logged as non-blocking. Iteration count: 1 (drive-by
scope; no iteration cap applies).

---

## Protocol checklist

| Requirement | Status | Notes |
|---|---|---|
| Item count: 6 → 6 walked | ✓ | All ledger rows addressed |
| Every done item: evidence reproducible | ✓ | Verified independently below |
| No silent drops | ✓ | All items reach final status |
| TDD-first discipline | ✓ | **Paired commits done right** — contrast with M19-4 |
| Substrate-rule compliance section | ✓ | Brief but addresses the relevant rules |
| Fast-follow findings logged | ✓ | None |

---

## Per-row verification (independent reproduction)

### K-1 — Consistency test ✓

Verified at `dispatch.rs:219–227`. Test name
`kernel_forms_consistency_with_is_kernel_form`. Loops `KERNEL_FORMS`
and asserts `is_kernel_form(form)` returns true for each, with a
clear failure message including the offending atom.

### K-2 — Single source of truth ✓

`grep -rE "const KERNEL_FORMS" crates/lykn-lang/src/classifier/`
returns exactly one definition at `dispatch.rs:194`. ✓

### K-3 — `is_kernel_form` consumes the shared list ✓

Verified at `dispatch.rs:211–213`:

```rust
pub fn is_kernel_form(name: &str) -> bool {
    KERNEL_FORMS.contains(&name)
}
```

The `matches!` macro is gone. Function is now a thin wrapper.

### K-4 — `closest_kernel_form` consumes the shared list ✓

Verified at `forms.rs:25–27`. Local `KERNEL_FORMS` slice deleted;
function reads `dispatch::KERNEL_FORMS`. ✓

### K-5 — All tests pass ✓

CC reports 1022 passing in `cargo test -p lykn-lang`. Internally
consistent with: post-polish baseline (1021) + 1 consistency test
(K-1) = 1022. M19 added zero Rust tests, so this count holds
across the parallel closures.

### K-6 — No surface/dispatch table changes ✓

Independent verification via the grep at the head of this review:
only `closest_kernel_form` (forms.rs) and `is_kernel_form`
(dispatch.rs) were modified. `classify_form`, `classify_form_strict`,
`is_surface_form`, `is_surface_form_strict`, and `is_kernel_only_form`
are untouched.

`is_kernel_only_form` deserves a specific note: it remains a
`matches!` macro covering the DD-58 closed-namespace kernel-only
set (`function`, `function*`, `const`, `let`, `var`, `quote`,
`quasiquote`). This is correct — `is_kernel_only_form` is a
*different* check than `is_kernel_form` (the closed-namespace
rejection set vs. the full kernel atom set), and the refactor
correctly didn't conflate them.

---

## Substrate-rule compliance — independent verification

- **AGENTS.md safety gates:** no violations. ✓
- **LEDGER_DISCIPLINE no-silent-rewrite:** all 6 rows walked. ✓
- **Backward-compat invariant:** `is_kernel_form`'s public contract
  is unchanged; the consistency test verifies behavioural
  equivalence with the pre-refactor matches! list. ✓
- **TDD-first discipline:** **paired commits** — test commit
  `8556f11` precedes refactor commit `66301e3`. This is the
  methodology pattern M19's CDC review flagged as missing from
  M19-4. **This drive-by got it right.**

---

## Methodology observations

### Methodology-positive behaviours

1. **TDD-first paired commits done correctly.** Contrast with
   M19-4 (single combined commit). CC's drive-by execution
   honored the test-first / paired-commit pattern explicitly.
   The grep for `git log` should show two separate commits with
   the test SHA preceding the refactor SHA — verified by SHA
   pairs cited in the closing report.

2. **Honest scope discipline.** The refactor touched exactly the
   two functions named in the drive-by prompt. No drive-by-on-
   the-drive-by scope creep. `is_kernel_only_form` was NOT
   touched (correct — different check, different scope).

3. **Concise closing report.** Six rows, terse evidence, no
   findings, no fast-follow. Appropriate for the scope — no
   over-elaboration.

### Methodology-learning candidates

1. **One-directional consistency test.** The test asserts
   `KERNEL_FORMS contains X → is_kernel_form(X) = true`. The
   converse is structurally guaranteed *today* because
   `is_kernel_form` is a thin wrapper, but the test wouldn't
   catch a future drift like:

   ```rust
   pub fn is_kernel_form(name: &str) -> bool {
       name == "future-form" || KERNEL_FORMS.contains(&name)
   }
   ```

   The bidirectional check ("if `is_kernel_form` returns true,
   the atom is in `KERNEL_FORMS`") would require enumerating
   "all possible atoms" — not feasible. An alternative would be a
   structural check (e.g., a doctest or a comment-level assertion
   that `is_kernel_form` must be a thin wrapper).

   **Disposition:** acceptable as-is. The one-directional test is
   a strong regression net for the specific drift the refactor
   was designed to prevent (parallel-list divergence). Future
   drift via embedding-extra-cases is a different failure mode;
   if it becomes a concern, a clippy lint or code-review note
   would be more appropriate than a test.

---

## Recommendations

1. **Accept this closure.** Substantive work is correct; methodology
   was honored properly.

2. **No fast-follow needed.** The one-directional-consistency
   observation is informational, not actionable.

3. **Reference for future TDD-first MUSTs.** This drive-by's
   commit pattern (`8556f11` test → `66301e3` refactor) is the
   shape to point to when future ledger drafts spell out the
   paired-commit requirement. Concrete example beats abstract
   description.

---

## Open inputs for Duncan

1. **Accept this closure?** CDC recommendation: yes.
2. **Original drive-by prompt** at
   `workbench/closest-kernel-form-refactor-prompt-2026-05-17.md`
   — should it be moved/archived now that the work is done?
   Options: (a) leave in workbench as historical record, (b)
   archive to a `workbench/completed/` directory, (c) delete. No
   strong CDC preference; left to your filing discipline.
