# Drive-By Cleanups — Closing Report

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Branch:** cdc/compiler-coherence

---

## Per-Item Walk

### D-1 — Unify duplicate template-text escape functions: done

**Test commit:** `bcb7564` — `test_template_icu_backslash_passthrough`
guards against re-introducing double-escape in the ICU path. Test
passes trivially because C-6b already fixed both paths; the
unification makes structural re-divergence impossible.

**Fix commit:** `a4d04b5` — Made `emit_template_text` `pub(crate)`,
imported in `icu.rs`, deleted `emit_template_text_icu`. Both call
sites (emit.rs:1173 regular template, icu.rs:740/750 ICU template)
now use the single function.

**Verify:**
- `grep -c "pub(crate) fn emit_template_text" crates/lykn-lang/src/codegen/emit.rs` → 1.
- `grep -c "emit_template_text" crates/lykn-lang/src/codegen/icu.rs` → 2 (two call sites).
- `grep -c "emit_template_text_icu" crates/lykn-lang/src/codegen/icu.rs` → 0 (deleted).
- `cargo test -p lykn-lang` → 1003 passed.

### D-2 — Fix JS template double-escape: done

**Test commit:** `fbab5a3` — `compileBoth` test for
`(template "\\\\n")` (lykn source producing backslash + n). Test
fails pre-fix: JS emits `` `\\n` `` (3 chars), Rust emits `` `\n` ``
(2 chars).

**Fix commit:** `e462a67` — Removed `.replaceAll('\\', '\\\\')` from
`makeTemplateElement()` in `packages/lang/compiler.js:74`. The ESTree
`TemplateElement.raw` field now contains the literal string value;
astring preserves it as-is in the backtick output.

**Verify:**
- `./bin/lykn test test/forms/template-escape-convergence_test.lykn` → 1 passed.
- `make test-lykn` → 292 passed.
- The fix is at `packages/lang/compiler.js:74` — one line removed.

**D-2.4 (astring upstream):** The bug was NOT in astring — it was in
our `makeTemplateElement` wrapper. No upstream work needed.

### D-3 — Single-param arrow paren cosmetic: done

**Direction:** (a) — align Rust to JS. JS's `x => x` is the more
idiomatic JavaScript form. No structural reason to prefer (b).

**Test commit:** `743de31` — Unit test
`test_arrow_single_param_no_parens` expects `x => x`. Fails pre-fix:
Rust emits `(x) => x`.

**Fix commit:** `f9fa77c` — In `emit_arrow` (emit.rs:430), when the
params list has exactly one simple identifier, emit it without parens.
Multi-param, zero-param, destructured, and default-param arrows are
unaffected.

**Verify:**
- `cargo test -p lykn-lang -- test_arrow` → 4 passed (all arrow tests).
- compile-both count: 110 (> 109 baseline).

---

## Substrate-rule compliance

1. **CLAUDE.md safety gates:** No safety-bypass flags injected.
2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 3 items addressed with
   per-item evidence. No items dropped.
3. **TDD-first discipline:** Each item has a test commit SHA preceding
   the fix commit SHA:
   - D-1: `bcb7564` (test) → `a4d04b5` (fix)
   - D-2: `fbab5a3` (test) → `e462a67` (fix)
   - D-3: `743de31` (test) → `f9fa77c` (fix)
4. **Partial-adoption check:** D-1 unification applied to all call
   sites (2 in icu.rs + 1 in emit.rs). D-2 fix is in the single
   `makeTemplateElement` function. D-3 fix is in the single
   `emit_arrow` function. No partial adoption.

---

## Findings for fast-follow

None. All three items from the wishlist findings are resolved. The
lambda expansion divergence (finding #3 from wishlist) remains
deferred to DD-58 as agreed.

---

## Closure

All 3 items done. Test counts: 1003 Rust, 292 surface, 670 forms.
compile-both count: 110. No regressions.
