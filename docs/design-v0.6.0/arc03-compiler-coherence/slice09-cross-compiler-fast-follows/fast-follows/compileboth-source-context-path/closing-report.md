# compileBoth `--source-context-path` Closing Report

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Branch:** cdc/compiler-coherence
**Commit:** `a97e151`
**Iteration:** 1 of 5

---

## Per-Row Walk

### F-1 — `--source-context-path` flag exists on `lykn compile`

**Status:** done
**Verify:** `./bin/lykn compile --help 2>&1 | grep -c "source-context-path"` → 1.

### F-2 — Flag plumbed via synthetic path; `compile_source` signature unchanged

**Status:** done
**Verify:**
- `grep -E "fn compile_source\(" crates/lykn-cli/src/compile.rs` → `pub fn compile_source(source: &str, file_path: Option<&Path>, strip_assertions: bool, kernel_json_only: bool)` — unchanged.
- `grep -c "source_context_path" crates/lykn-cli/src/main.rs` → 5 matches (field definition, destructure, parameter, and routing logic).

### F-3 — `compileBoth` passes `--source-context-path` with `Deno.cwd()`

**Status:** done
**Verify:** `grep -c "source-context-path" packages/testing/helpers.js` → 2 (docstring + args array). The args line is:
```js
args: ["compile", "--source-context-path", projectRoot, tmpPath],
```
where `projectRoot = Deno.cwd()`.

### F-4 — M16-6 test now uses `compile-both`

**Status:** done
**Verify:**
- `grep -c "compile-both" test/forms/dd-52-import-path-convergence_test.lykn` → 2.
- `grep -c "compileBoth cannot test" test/forms/dd-52-import-path-convergence_test.lykn` → 0 (stale comment removed).

### F-5 — Flag absence preserves existing behaviour

**Status:** done
**Verify:**
- `cargo test -p lykn-lang` → 1071 passed, 0 failed.
- `cargo test -p lykn-cli` → 186 passed, 0 failed.
- `make test-lykn` → 292 passed, 0 failed.
- `./bin/lykn test test/forms/` → 667 passed, 0 failed.

All counts match or exceed the post-M16 baseline (1071 Rust, 292 surface, 666→667 forms due to the new test).

### F-6 — Rust unit test covers the `--source-context-path` code path

**Status:** done
**Verify:** `grep -c "context_path" crates/lykn-cli/src/compile.rs` → 1 (in the test function `compile_source_context_path_synthetic_parent`). The test verifies that a synthetic path's `parent()` equals the context directory and that `compile_source` works with it.

### F-7 — `compileBoth`'s docstring updated

**Status:** done
**Verify:**
- `grep -c "cannot test import-macros" packages/testing/helpers.js` → 0.
- `grep -c "source-context-path" packages/testing/helpers.js` → 2 (docstring + code).

### F-8 — Single coherent commit chain

**Status:** done
**Verify:** `git log --grep="source-context-path\|compileBoth" --oneline` → commit `a97e151`.

---

## Synthetic-Path Naming Choice

The synthetic filename is `__compileBoth__.lykn`. The basename is
irrelevant — the only thing the expander uses from `file_path` is
`file_path.parent()` (pass0.rs line 249: `fp.parent().unwrap_or(Path::new("."))`).
The parent directory of the synthetic path equals `--source-context-path`,
which is what determines the base directory for relative import resolution.

The double-underscore naming signals "this is a synthetic internal path,
not a real file" — matching the convention used by `__surface_macro__` in
the expander.

---

## Substrate-rule compliance

1. **CLAUDE.md safety gates:** No `--allow-dirty`, `--force`, `--no-verify`,
   or equivalent flags injected.

2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 8 F-rows addressed with
   evidence. No rows dropped. No verify commands modified.

3. **Backward-compatibility invariant:** All existing tests pass with
   unchanged counts. The `--source-context-path` flag defaults to `None`,
   in which case `cmd_compile` uses the actual file path — identical to
   pre-change behaviour. When set, the only difference is the `file_path`
   argument passed to `compile_source` has a different parent directory.

4. **Partial-adoption check:** The flag is used in exactly one place
   (compileBoth in helpers.js). The Rust CLI definition, the routing in
   cmd_compile, and the JS caller all reference it consistently. No partial
   adoption.

---

## Findings for fast-follow

1. **import-macros output divergence between compilers.** When source uses
   `(import-macros ...)`, the JS compiler includes the macro module's
   import declarations (e.g., `import {...} from "jsr:@std/assert"`) in
   the compiled output, while the Rust compiler omits them. This prevents
   full `compileBoth` convergence for sources that use import-macros. The
   divergence is in how import side-effects are emitted, not in the macro
   expansion itself. Tracked as a fast-follow for the compiler-coherence
   thread.

2. **`compile_file_with_dts` is now dead code.** The refactored
   `cmd_compile` reads source itself and calls `compile_source_with_dts`
   directly, making `compile_file_with_dts` unused. It's still a public
   API but has no callers. Low-priority cleanup candidate.

---

## Closure

Closed at commit `a97e151` on 2026-05-16. CDC verification: pending.
Total rows: 8. Done: 8. Deferred: 0. No-op: 0.
