# DD-58 Phase 1 Polish — Closing Report

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-17
**Branch:** cdc/compiler-coherence
**Iteration:** 1 of 5

---

## Per-Item Walk

### A-1 — Specialize kernel-only rejection diagnostic: done
Test commit: `43ca363`. Fix commit: `6eb6edd`.
Three form-class branches: const/let/var → "use 'bind'"; function/function* → "use 'func', 'fn', or 'lambda'"; quote/quasiquote → "no surface alternative".

### A-2 — Did-you-mean for invalid kernel: forms: done
Test commit: `43ca363`. Fix commit: `6eb6edd`.
Levenshtein distance ≤2 triggers suggestion. `kernel:functoin` → "did you mean 'function'?". `kernel:absolutelynothing` → no suggestion.

### A-3 — async under strict mode: done (was broken, now fixed)
Test commit: `43ca363` (fails: async classified as FunctionCall). Fix commit: `6eb6edd` (added `async` to `is_surface_form_strict`).
**Empirical finding:** async WAS broken under strict — classified as FunctionCall (user macro candidate), not routed to `classify_async`. Fixed by adding `async` to the strict dispatch table.

### A-4 — Ternary (?) under strict mode: done
Test commit: `43ca363`. Fix commit: `6eb6edd`.
**Disposition:** passthrough (CDC lean confirmed). `?` added to `is_surface_form_strict()`.

### A-5 — dynamic-import verification: done
Test commit: `43ca363` (fails: classified as FunctionCall). Fix commit: `6eb6edd` (added `dynamic-import` to strict table).

### B-1 — Empty kernel: form name: done
Test in `43ca363`. Passes immediately — `is_kernel_form("")` returns false, producing diagnostic.

### B-2 — kernel:if routes to kernel in both modes: done
Test in `43ca363`. Passes immediately — M17 logic handles this correctly in both classify_form and classify_form_strict.

### B-3 — User macro under strict mode: done
Test in `43ca363`. Passes immediately — unknown head atoms produce FunctionCall, not rejection.

### C-1 — DD-58 citation comments: done
Commit `1e7d219`. Three citations in classify_form_strict: kernel: escape (§"The kernel: escape syntax"), kernel-only rejection (§"Per-layer form enumeration" — kernel-only namespace), strict surface dispatch (§"Per-layer form enumeration" — closed surface namespace).
**Verify:** `grep -B1 "DD-58" crates/lykn-lang/src/classifier/forms.rs | grep -c "//"` → 8 (≥3).

### C-2 — TODO/FIXME audit: done (no-op, clean)
`grep -rn "TODO\|FIXME\|XXX" crates/lykn-lang/src/classifier/` → 0 hits.

---

## Substrate-rule compliance

1. **CLAUDE.md safety gates:** No safety-bypass flags injected.
2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 10 items addressed.
3. **philosophy.md Principle 1:** No structural source-tree changes.
4. **philosophy.md Principle 3:** Diagnostics now specialized per form-class with did-you-mean suggestions.
5. **Backward-compat invariant:** Strict OFF unchanged. All existing tests pass (1021 Rust, 292 surface, 670 forms).
6. **TDD-first discipline:** Test commit `43ca363` (12 new tests, 6 fail) precedes fix commit `6eb6edd`. B-1/B-2/B-3 pass trivially (disclosed).

---

## Findings for fast-follow

None. All 10 items resolved.

---

## Closure

All 10 items done. Test count: 1021 Rust (> 1010 baseline). Zero regressions.
