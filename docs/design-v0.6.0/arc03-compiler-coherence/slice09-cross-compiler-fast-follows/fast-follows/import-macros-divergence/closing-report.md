# import-macros Divergence Fast-Follow — Closing Report

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Branch:** cdc/compiler-coherence
**Iteration:** 1 of 5

---

## Per-Row Walk

### F-1.1 — compileBoth converges on import-macros source

**Status:** done
**Evidence:** commit `56894c7`. Test at `test/forms/dd-52-import-macros-convergence_test.lykn` uses `compile-both` on `(import-macros "./packages/testing" (test is-equal)) (test "x" (is-equal 1 1))` and passes.
**Verify:** `./bin/lykn test test/forms/dd-52-import-macros-convergence_test.lykn` → 1 passed, 0 failed.

### F-1.2 — Existing tests still pass

**Status:** done
**Evidence:**
- `cargo test -p lykn-lang` → 1071 passed, 0 failed.
- `cargo test -p lykn-cli` → 187 passed, 0 failed.
- `make test-lykn` → 292 passed, 0 failed.
- `./bin/lykn test test/forms/` → 668 passed, 0 failed (667 + 1 new).

All counts ≥ baseline.

### F-1.3 — Diagnosis doc updated with Resolution section

**Status:** done
**Evidence:** `workbench/dd-58-or-similar-import-macros-divergence-diagnosis-2026-05-16.md` has a "Resolution" section naming direction (a) and commit `56894c7`.
**Verify:** `grep -c "^## Resolution" workbench/dd-58-or-similar-import-macros-divergence-diagnosis-2026-05-16.md` → 1.

### F-2.1 — No callers of compile_file_with_dts

**Status:** done
**Evidence:** `grep -rn "compile_file_with_dts" crates/ tests/ 2>/dev/null` returned only the declaration at compile.rs:53 (no callers).

### F-2.2 — Function removed

**Status:** done
**Evidence:** commit `7552886`. `compile_file_with_dts` and its doc comment deleted from `crates/lykn-cli/src/compile.rs`.

### F-2.3 — cargo build --release succeeds post-deletion

**Status:** done
**Evidence:** `cargo build --release -p lykn-cli` succeeded with no errors (zero warnings post-deletion).

### F-2.4 — cargo test -p lykn-cli succeeds post-deletion

**Status:** done
**Evidence:** `cargo test -p lykn-cli` → 187 passed, 0 failed.

---

## Diagnosis Reference

Full diagnosis at `workbench/dd-58-or-similar-import-macros-divergence-diagnosis-2026-05-16.md`. Key findings:

- **Q1:** JS emits `import {...} from "jsr:@std/assert"` from `(runtime-import ...)` declarations in macro modules; Rust omitted them entirely.
- **Q2:** JS: `pass0ImportMacros` line 1345 pushes `runtimeImports` to `remaining`. Rust: zero handling for `runtime-import` — the form was silently discarded.
- **Q3:** Correctness-grade divergence. Rust output would fail at runtime with `ReferenceError`.
- **Q4:** Direction (a) — align Rust to JS. CDC confirmed.
- **Q5:** 1 Rust file (pass0.rs) + cache.rs extension + 1 new test. ~65 lines net.

---

## Substrate-rule compliance

1. **AGENTS.md safety gates:** No safety-bypass flags injected.

2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 7 F-rows addressed with evidence. No rows dropped. No verify commands modified.

3. **Backward-compatibility invariant:** All existing tests pass with unchanged counts. The Rust compiler now emits *more* correct output (previously missing imports). No existing valid source code changes behavior — only previously broken output is fixed.

4. **Partial-adoption check:** `runtime-import` handling is applied at a single extraction point in `process_single_import`. The caching layer (`CachedModule`) stores runtime imports for all modules consistently. No partial adoption.

---

## Findings for fast-follow

None. The import-macros output divergence was the finding being fixed; it is now resolved. The `compile_file_with_dts` cleanup is also complete.

---

## Closure

Closed at commit `56894c7` (Deliverable 1) and `7552886` (Deliverable 2) on 2026-05-16.
CDC verification: pending.
Total rows: 7. Done: 7. Deferred: 0. No-op: 0.
