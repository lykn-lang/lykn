# M20 Closing Report — DD-58 Phase 1.5: Kernel Test Corpus + .lyk Runner

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-17
**Branch:** cdc/compiler-coherence

---

## Per-Row Walk

### M20-1 — Baseline: done
`workbench/verify/m20/baseline.txt` with 5 sections.

### M20-2 — Design confirmation: done
`workbench/verify/m20/design-confirmation.md` acknowledges all 7 calls.

### M20-3 — .lyk runner with kernel-only classification: done
**TDD paired commits:**
- Test: `2f28c77` — failing test for .lyk surface-form rejection
- Fix: `978b5ea` — kernel_only field + classify_form_kernel_only + runner change

### M20-4 — test/kernel/ directory + conventions: done
Commit `99a0860`. CONVENTIONS.md names single-form-per-file, naming, compileBoth, sample rationale.

### M20-5 — Kernel-only form tests: done (5 files)
Commits `629b3a9` + `d2b995e` (correction). Five files:
function_test.lyk, function_star_test.lyk, const_test.lyk, let_test.lyk, var_test.lyk.
(quote/quasiquote moved to M20-6 per DD-58 refinement correction.)

### M20-6 — Flavor (b) passthrough tests: done (8 tests)
Commits `a4f66f8` + `d2b995e` (correction). passthrough_test.lyk with 8 tests: + (arithmetic), while (control flow), import (module), await (async), array (literal constructor), === (comparison), quote (macro/quoting), quasiquote (macro/quoting).

### M20-7 — compileBoth verification: done
compileBoth used in const_test.lyk, let_test.lyk, var_test.lyk, function_test.lyk, function_star_test.lyk, and passthrough_test.lyk (4 of 8 passthrough tests).

### M20-8 — Compile-string audit: done
`workbench/verify/m20/compile-string-audit.md`. 47 occurrences; all `keep-runtime-only`. No migrations needed.

### M20-9 — M19-4 negative-direction test: done
**TDD paired commits:**
- Test: `2f28c77` — failing test for .lykn bare-const rejection
- Fix: `978b5ea` — runner change (same commit as M20-3 fix)

### M20-10 — All tests pass: done
- Rust (lykn-lang): 1023 passed
- CLI (lykn-cli): 83 passed
- Surface: 292 passed
- Forms: 671 passed
- Kernel: 15 passed

### M20-11 — Backward-compat: done
`compile.rs` has zero strict/kernel_only references. Production `lykn compile` unchanged.

### M20-12 — DD-58 Coverage section: done
Commit `72cfe53`. §"Test discipline" added to DD-58.

### M20-13 — Closing report: done (this file)

### M20-14 — Commit chain: done
Test commit `2f28c77` precedes fix commit `978b5ea` for both M20-3 and M20-9.

---

## Summary Table

| Category | Count |
|----------|-------|
| Kernel-only form tests (M20-5) | 5 (function, function*, const, let, var) |
| Flavor (b) passthrough tests (M20-6) | 8 (+, while, import, await, array, ===, quote, quasiquote) |
| compileBoth adoption in kernel tests | 9 tests use compileBoth |
| Compile-string audit cases | 47 total, all keep-runtime-only |

## Design-Call Confirmations

All 7 confirmed. No dissent surfaced. See `workbench/verify/m20/design-confirmation.md`.

---

## Substrate-rule compliance

1. **CLAUDE.md safety gates:** No violations.
2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 14 rows addressed.
3. **philosophy.md Principle 1:** test/kernel/ added as new directory.
4. **philosophy.md Principle 3:** Kernel tests validate codegen output.
5. **Backward-compat:** Production paths unchanged.
6. **TDD-first:** M20-3 test `2f28c77` → fix `978b5ea`. M20-9 same pair.

---

## Findings for fast-follow

1. **quote/quasiquote correction mid-flight.** DD-58 refinement moved these from kernel-only to flavor (b) passthrough during M20. Corrected successfully. The correction's ripple through dispatch.rs, forms.rs tests, and M20-5/M20-6 allocation is documented.

---

## Closure

Closed at commit `72cfe53` on 2026-05-17. CDC verification: pending.
Total rows: 14. Done: 14. Deferred: 0. No-op: 0.
