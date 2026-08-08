# Drive-by: Unify `closest_kernel_form` / `is_kernel_form` kernel-forms list

**Origin:** CDC review of DD-58 Phase 1 polish closure
(`workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md`,
methodology observation #4). CDC flagged that `closest_kernel_form`
hardcodes a `KERNEL_FORMS` const slice that parallels the
`matches!`-macro list in `is_kernel_form`. Anyone modifying
`is_kernel_form` would have to remember to update the parallel
list — a silent-drift risk.

**Scope:** Single source of truth for the kernel-form atom list,
consumed by both `is_kernel_form` and `closest_kernel_form`.

**Iteration budget:** 2 (expected: 1 — this is mechanical).

**Methodology:** [LEDGER_DISCIPLINE.md](../assets/ai/LEDGER_DISCIPLINE.md) applies
even for drive-bys; per-row preflight is light because the scope
is small.

---

## MUST framing

- **You MUST load `assets/ai/LEDGER_DISCIPLINE.md` before writing code.**
- **You MUST preserve `is_kernel_form`'s public contract.** The
  function signature and return type stay the same. Only the
  *implementation* changes (from `matches!` macro to slice lookup).
- **You MUST verify the refactor is behaviour-preserving** — every
  existing test in `crates/lykn-lang/tests/` and elsewhere that
  exercises `is_kernel_form` must still pass without modification.
- **You MUST keep `closest_kernel_form`'s Levenshtein behaviour
  intact.** Same threshold (≤2), same "no suggestion" path for
  distance > 2. Only the source list it consults changes.
- **You MUST add at least one assertion-style test** that proves
  the two functions read from the same source. The simplest shape:
  a test that loops the const slice and asserts
  `is_kernel_form(form) == true` for every entry. If anyone ever
  removes an atom from the slice without updating `is_kernel_form`,
  this test catches it; if anyone adds an atom to `is_kernel_form`
  via the new slice-lookup path, the slice IS the source so they
  can't drift.
- **You MUST NOT change which atoms `is_kernel_form` recognises.**
  The slice's contents must match the current `matches!` list
  exactly — same atoms, no additions, no removals. This is a
  pure refactor.
- **You MUST NOT touch `is_surface_form` or `is_surface_form_strict`.**
  Those are in scope for DD-58 work, not this drive-by.
- **You MUST NOT modify the dispatch tables in `forms.rs`.**
- **You MUST NOT auto-pass safety-bypass flags** per AGENTS.md.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md`
2. `assets/ai/AGENTS.md`
3. `crates/lykn-lang/src/classifier/dispatch.rs` —
   `is_kernel_form()` current shape (the `matches!` macro).
4. `crates/lykn-lang/src/classifier/forms.rs` —
   `closest_kernel_form()` and its hardcoded `KERNEL_FORMS` slice.
5. `workbench/dd58-phase1-polish-closing-cdc-review-2026-05-17.md`
   §"Methodology observations" #4 — origin of this drive-by.

---

## Per-row preflight

### Preflight 1 — locate the two definitions

Before changing anything:

1. Read `is_kernel_form` in `dispatch.rs`. Confirm it's the
   `matches!`-macro shape that returns `bool`.
2. Read `closest_kernel_form` in `forms.rs`. Confirm the
   `KERNEL_FORMS` const slice exists locally to that function (or
   module) and lists the same atoms `is_kernel_form` recognises.
3. **Cross-check the two lists.** If they DIFFER (i.e., the slice
   already drifted from the macro), STOP and surface — that's a
   correctness finding, not a refactor target. Either:
   - The slice is missing atoms that `is_kernel_form` matches
     (did-you-mean would silently fail to suggest them).
   - The slice has atoms `is_kernel_form` doesn't match (impossible
     state — would suggest a non-kernel form as a kernel form).

   Surface whichever is found and wait for CDC direction.

If the lists match (expected — polish CDC review verified this),
proceed.

### Preflight 2 — pick the shared shape

Two reasonable shapes. **Pick one based on what reads cleanly in
the existing code; don't over-engineer:**

(a) **Module-level const slice** (recommended):

```rust
// In dispatch.rs or a shared location:
const KERNEL_FORMS: &[&str] = &[
    "function", "function*", "const", "let", "var",
    "quote", "quasiquote", /* ... */
];

pub fn is_kernel_form(name: &str) -> bool {
    KERNEL_FORMS.contains(&name)
}
```

Then `closest_kernel_form` imports `KERNEL_FORMS` from the same
location.

(b) **Public function that returns the slice**:

```rust
pub fn kernel_forms() -> &'static [&'static str] {
    &[...]
}
```

Both functions call `kernel_forms()`.

The const-slice shape (a) is simpler and matches Rust idiom for
this kind of small, stable list. Use it unless you find a reason
to prefer (b) (e.g., if other modules in the crate have an
established pattern of getter functions over consts).

---

## TDD-first applies — but lightly

This is a refactor with no intended behaviour change. TDD-first
maps to:

1. **First**: write the consistency-assertion test (the loop test
   described in MUST above). Commit it. It should pass against
   the *current* code because the current slice DOES match the
   current `is_kernel_form` (per polish CDC verification).
2. **Then**: refactor. The consistency test should continue to
   pass; the broader existing-test suite (`cargo test -p
   lykn-lang`) should continue to pass.

The "failing test first" discipline for behaviour changes doesn't
apply here because there's no behaviour change. But the
consistency test is the regression net that justifies the
refactor — without it, the unification could silently re-drift.

---

## Ledger

| ID | Criterion | Verify | Significance | Status |
|----|-----------|--------|--------------|--------|
| K-1 | Consistency-assertion test exists | `grep -rE "fn .*kernel_forms.*consist\|KERNEL_FORMS.iter" crates/lykn-lang/tests/ crates/lykn-lang/src/` returns ≥1 | serious | open |
| K-2 | Single source of truth for kernel-form list | `grep -rE "const KERNEL_FORMS\|fn kernel_forms" crates/lykn-lang/src/classifier/` returns exactly 1 definition | serious | open |
| K-3 | `is_kernel_form` consumes the shared list | Read `is_kernel_form` in dispatch.rs; confirm it reads from `KERNEL_FORMS` (or `kernel_forms()`), not a local `matches!` macro | serious | open |
| K-4 | `closest_kernel_form` consumes the shared list | Read `closest_kernel_form` in forms.rs; confirm the local hardcoded slice is gone, replaced by the shared source | serious | open |
| K-5 | All existing tests still pass | `cargo test -p lykn-lang` exits 0; test count strictly ≥ post-polish baseline (1021) | serious | open |
| K-6 | No surface/dispatch table changes | `git diff <pre-K> -- crates/lykn-lang/src/classifier/forms.rs` shows changes to `closest_kernel_form` only; no changes to `classify_form` or `classify_form_strict` | correctness | open |

---

## Anti-shortcut instructions

- **Do NOT add or remove kernel atoms during the refactor.** If
  you notice an atom that "should probably be there" (e.g., some
  form you think is kernel-only but isn't in the current list),
  STOP and surface — that's a DD-58 enumeration question, not
  refactor work.
- **Do NOT change `is_kernel_form`'s public signature.** Callers
  expect `fn is_kernel_form(name: &str) -> bool`. The internals
  change; the contract doesn't.
- **Do NOT inline `KERNEL_FORMS` into multiple places.** The point
  of the refactor is single-source-of-truth. If you find yourself
  defining it twice (once in `dispatch.rs`, once in `forms.rs`),
  back up and use a shared location.

---

## Closing report requirements

Produce a short closing report at
`workbench/2026-05-<date>-closest-kernel-form-refactor-closing-report.md`.
Walk K-1 through K-6 with status + verify-command output. Cite
the test commit SHA and the refactor commit SHA (TDD-first
ordering preserved).

Substrate-rule compliance section: terse is fine — AGENTS.md
safety gates, LEDGER_DISCIPLINE no-silent-rewrite, backward-compat
invariant (no behaviour change), TDD-first (consistency test
precedes refactor commit).

If anything surfaces that wasn't expected (e.g., slice drift in
preflight 1, or a test that previously assumed local slice
semantics), name it in a "Findings for fast-follow" section.

---

## What you do NOT need to do

- You do not need to touch surface or surface-strict dispatch.
- You do not need to add Levenshtein-distance tuning. Threshold
  stays at ≤2.
- You do not need to expand the kernel-form list. DD-58's
  enumeration is the spec; M19 will exercise it.
- You do not need to add did-you-mean for surface forms (separate
  scope, not this drive-by).

---

## Start

1. Load LEDGER_DISCIPLINE.md.
2. Preflight 1 — read both functions, verify list equality.
3. Pick shape (a) or (b) per the "Pick the shared shape" guidance.
4. Write consistency test first, commit.
5. Refactor both functions to consume the shared source, commit.
6. Run `cargo test -p lykn-lang`; verify ≥1021 tests pass.
7. Produce closing report.

If preflight surfaces list drift OR an enumeration question,
STOP and surface.
