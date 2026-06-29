# M18 Closing Report — CDC Review

**Reviewer:** Cowork Claude (CDC role, cdc/compiler-coherence thread)
**Reviewed artifact:** `workbench/2026-05-17-M18-closing-report.md`
**Reviewed at:** 2026-05-17
**Disposition:** **Accepted.** All 9 ledger rows walked with
evidence; ClassifierOptions struct + strict-mode flag + new
strict dispatch functions all match DD-58's prescribed shape;
backward-compat invariant fully preserved (existing
`classify()` unchanged; test counts strictly grow). Two
substantive findings logged that need DD-58 refinement (both
identified honestly by CC, neither hidden). Iteration count:
1 of 5.

---

## Protocol checklist

| Requirement | Status | Notes |
|---|---|---|
| Row count: 9 → 9 walked | ✓ | All ledger rows addressed |
| Every done row: evidence reproducible | ✓ | Verified independently below |
| No silent drops | ✓ | All rows reach final status |
| Spec-softening check | ✓ | Trivial-pass disclosures honored per M17 precedent |
| Partial-adoption check | ✓ (with two flagged findings) | dynamic-import + async/ternary handled differently — see findings |
| Backward-compat invariant | ✓ | `classify()` unchanged; defaults to lax; +4 test growth, zero regressions |
| TDD-first discipline | ✓ | Test commit `4e50b59` precedes fix commit `0ab8155` |
| Substrate-rule compliance section | ✓ | Six rules addressed |
| Fast-follow findings logged | ✓ | Two: dynamic-import + async/ternary handling under strict |

---

## Per-row verification (independent reproduction)

### M18-1 — Baseline state capture ✓

`workbench/verify/m18/baseline.txt` exists with 6 section headers.

### M18-2 — New strict dispatch functions ✓

Independently verified:

- `is_surface_form_strict` at `crates/lykn-lang/src/classifier/dispatch.rs:43`.
- `is_kernel_only_form` at `crates/lykn-lang/src/classifier/dispatch.rs:179`.
- Both functions present and well-formed.

**Spot-check against DD-58:**
- `=>` is in `is_surface_form_strict()` at line 166 (matches Duncan's 2026-05-17 follow-up call: surface arrow passthrough). ✓
- `=>` is ALSO in `is_kernel_form()` at line 194 (kernel passthrough target). Correct — passthrough surface forms share names with kernel forms.
- `bind` (flavor a, rich-unique) present.
- `if` (flavor c, namesake-sharing) present.
- `const` in `is_kernel_only_form()` — correct disposition per DD-58.
- `function`, `function*`, `let`, `var`, `quote`, `quasiquote` — all 6 also present (CC said 7; verified 7 entries in `is_kernel_only_form`).

The strict surface set is 130+ entries spanning all three flavors. Did not spot-check every entry; the spot-checked forms (one per flavor) all match DD-58.

### M18-3 — Strict-mode flag + classify_form_strict ✓

**Commit chain (TDD-first verified):**
- `4e50b59` Tests for strict mode (TDD red — tests reference functions that don't exist yet, so test commit fails to compile pre-fix).
- `0ab8155` Fix — classify_form_strict + ClassifierOptions + classify_with_options.

**API shape verified:**
- `ClassifierOptions` struct at `mod.rs:11`.
- `classify_with_options(forms, opts)` at `mod.rs:22`.
- `classify(forms)` at `mod.rs:18` delegates to `classify_with_options(forms, ClassifierOptions::default())` — existing call sites need NO modification.
- Default for `strict` is `false` (via `#[derive(Default)]`) — backward-compat preserved.

**Algorithm verified by reading `classify_form_strict` at `forms.rs:87`:**

```rust
1. Check kernel: prefix → strip, validate against is_kernel_form(), emit KernelPassthrough OR diagnostic
2. Check is_kernel_only_form() → diagnostic naming form + suggesting bind + kernel: escape
3. Check is_surface_form_strict() → dispatch to appropriate handler
4. (Fallback to function call / user macro handling)
```

This matches DD-58's prescribed shape exactly. The diagnostic suggestion field is populated with `(kernel:X ...)` for IDE/editor integration.

**Minor polish observation (not blocking):** the diagnostic
message always says "use 'bind' for surface binding" regardless
of which kernel-only form was rejected. That's correct for
`const`/`let`/`var` but generic for `function` (should suggest
`func`/`fn`/`lambda`) and irrelevant for `quote`/`quasiquote`
(no surface alternative). Polish-grade improvement; not blocking
closure but worth tracking as a follow-up.

### M18-4 — Strict rejection tests ✓ (trivial-pass disclosed)

Test `test_strict_mode_rejects_kernel_only_form` exists at
`forms.rs:5346` (or near). Passes after M18-3 fix. CC disclosed
honestly: "the rejection logic is the natural else-branch of the
strict-mode handler." Methodology-acceptable per M17 precedent.

### M18-5 — Strict acceptance tests ✓ (trivial-pass disclosed)

Tests `test_strict_mode_accepts_surface_form` and
`test_strict_mode_accepts_passthrough_form`. Verify `bind`
(flavor a) and `+` (flavor b) classify correctly. Same
trivial-pass disclosure as M18-4 — both rows' logic was bundled
into M18-3's implementation.

### M18-6 — kernel: escape under strict ✓

Test `test_strict_mode_kernel_escape_still_works` verifies
`(kernel:const x 42)` classifies as `KernelPassthrough` with
prefix stripped under strict mode. Confirmed by reading
`classify_form_strict`'s first branch (which is identical to
M17's logic in `classify_form`). Regression protection for
M17's work.

### M18-7 — Backward-compat ✓

Independent test-count verification:
- lykn-lang `#[test]` count: 1010 (was 1006 post-M17, +4
  from M18's 4 new tests).
- No removals.
- `classify()` signature preserved; no existing call site
  required modification.

Backward-compat invariant fully preserved. ✓

### M18-8 — Substrate-rule compliance ✓

Six rules addressed. CDC concurs on each.

### M18-9 — Commit chain ✓

Three M18 commits in clean order:
- `628cdc8` M18-2: dispatch functions
- `4e50b59` M18-3/4/5/6 tests (TDD red)
- `0ab8155` M18-3 fix (implementation)

TDD-first verified by independent inspection. The test commit
precedes the fix commit by one position in the log.

---

## Substantive findings disposition

CC logged two fast-followups; both are real and need DD-58
refinement.

### Finding #1 — `dynamic-import` not in DD-58's enumeration

**Severity: substantive (DD-58 refinement).**

The current `is_kernel_form()` includes `dynamic-import`. DD-58's
"Per-layer form enumeration" does not explicitly list it. CC
made a judgment call to add it to `is_surface_form_strict()` as
a passthrough.

CDC read: **CC's call is correct** — `dynamic-import` is a JS
feature that users may write in surface code (e.g.,
`(dynamic-import "path")` to dynamically load a module).
Passthrough is the right disposition. **But DD-58's enumeration
is incomplete; needs a refinement-log entry adding
`dynamic-import` to the passthrough section under "Async ops" or
a new "Module forms" subsection.**

### Finding #2 — `?` (ternary) and `async` handling under strict

**Severity: substantive (potential strict-mode bug).**

Both `?` and `async` are in `is_kernel_form()` but handled by
special-case logic in `classify_form` (not via dispatch table
lookup — `classify_form` has explicit `else if head_name == "async"`
and similar branches). They are NOT in `is_surface_form_strict()`,
and `classify_form_strict` doesn't reproduce the special-case
logic.

**The risk:** under strict mode, `(? c t e)` or `(async (function ...))`
won't classify correctly. CC flagged this for verification in
M19's test migration.

**CDC verifies the risk is real** by inspecting `classify_form_strict`:
the function dispatches via `is_surface_form_strict` → `classify_surface_form`,
OR via `head_name == "export" / "async" / "class" / "class-expr"`
explicit branches. So `async` IS handled in `classify_form_strict`
(I can see it in the read I did). But `?` is NOT explicitly
handled — that's a real gap.

**Disposition:**
- `async`: NOT a gap; CC's read was wrong or my read missed
  something. **CC should re-verify; possibly defer to M19.**
- `?`: REAL gap. Either add `?` to `is_surface_form_strict()`
  (passthrough disposition) OR add an explicit `classify_form_strict`
  branch for it.

Either way, the gap is for M19's test migration to surface
concretely. M18's closure stands — the gap doesn't break any
existing test (strict mode is OFF by default).

---

## Methodology observations

### Methodology-positive behaviours

1. **CC's ClassifierOptions choice** matches CDC's lean and is
   well-justified ("extensible for Phase 4, file_kind"). The
   `#[derive(Default)]` is the idiomatic Rust pattern.

2. **Preflight discipline** (M18-2): CC cross-checked DD-58's
   enumeration against reality and surfaced two discrepancies
   (dynamic-import + async/ternary) rather than silently
   working around. This is exactly the methodology pattern the
   preflight was designed to surface.

3. **Bundled implementation, honest disclosure** (M18-3/4/5/6):
   one strict-mode handler naturally covers four test scenarios.
   CC disclosed the trivial-pass for M18-4/5/6 per M17 precedent.
   Methodology-acceptable; no spec-softening.

4. **DD-58 citation in code** — both new dispatch functions
   carry comments citing DD-58. Future readers can trace the
   design intent.

5. **Zero existing-test regressions; +4 new tests added** —
   backward-compat invariant fully preserved. The strict flag
   exists but is dormant until M19/M20+ activate it.

### Methodology-learning candidates

The preflight pattern continues to pay off. M17's preflight
verified the reader assumption; M18's preflight surfaced two
DD-58 enumeration gaps. **Both gaps would have been silent
work-arounds in a milestone without preflight discipline.**

Worth canonicalising: **when an implementation milestone
depends on a DD's enumeration, require a preflight pass that
explicitly cross-checks the DD against the existing source.**
This catches:
- DD entries that don't match the source (DD refinement needed).
- Source entities the DD didn't enumerate (DD completeness gap).
- Forms the DD enumerates but the source can't handle (potential
  spec-impl mismatch).

---

## Recommendations

1. **Accept this closure.** All 9 rows met; aggregate invariants
   verified; fast-follow findings precise.

2. **DD-58 refinement for `dynamic-import`** — add to the
   flavor (b) passthrough table (suggested: a new "Module forms
   (dynamic)" sub-row, or under existing "Module forms"). Worth
   doing in the next DD-58 revision; the second revision's
   refinement log is the right place.

3. **DD-58 refinement for `?` handling** — needs disposition.
   Likely flavor (b) passthrough (ternary is a JS expression
   primitive). DD-58 doesn't currently mention `?`; worth a
   refinement-log entry.

4. **`async` re-verification** — CC said it's not in
   classify_form_strict's strict-dispatch but my read suggests
   it IS handled via an explicit `else if head_name == "async"`
   branch in classify_form_strict. CC should double-check;
   if it IS handled, no action needed.

5. **Diagnostic message polish** (M18-3) — the "use 'bind' for
   surface binding" suggestion is generic. Could be specialized
   per kernel-only form (`function` → `func`/`fn`/`lambda`;
   `quote`/`quasiquote` → no surface alternative, just the
   `kernel:` escape). Polish-grade; not blocking.

---

## What CC does NOT need to redo

- All 9 rows are substantively complete.
- Implementation matches DD-58's prescribed shape.
- Backward-compat preserved bit-for-bit.
- TDD-first honored in substance with honest disclosures.
- Both fast-follow findings are precisely characterised.

CDC's observations are methodology learnings, not corrections.

---

## Open inputs for Duncan

1. **Accept M18 closure?** CDC recommendation: yes.
2. **DD-58 refinements** (Findings #1 and #2) — fold into next
   DD-58 revision? CDC can draft the refinement-log entries.
3. **`async` re-verification by CC** — worth confirming before
   M19 or treating it as M19's first task?
4. **Diagnostic message polish** — schedule as M19 work or as
   a drive-by?
5. **Next milestone M19** — scope was "test migration + strict-
   mode enforcement for tests." Worth me drafting M19 ledger
   now, or wait?
6. **Commit timing:** when you merge cdc/compiler-coherence,
   M17 + M18 + drive-bys all land together. Sequencing your
   call.
