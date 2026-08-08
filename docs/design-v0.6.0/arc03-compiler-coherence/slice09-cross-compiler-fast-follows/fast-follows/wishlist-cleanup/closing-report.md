# Wishlist Cleanup — Closing Report

**CC:** Claude Code (Opus 4.6)
**Date:** 2026-05-16
**Branch:** cdc/compiler-coherence

**Time-budget override:** Duncan explicitly overrode iteration-budget
constraints when critical codegen flaws were discovered during Tier C
implementation. Instruction: "optimize for good engineering, not
time-budgets." This resulted in deeper diagnosis and additional codegen
fixes (computed property keys, empty class bodies, refined paren
wrapping) that would have been deferred under strict budget compliance.

---

## Per-Item Walk

### A-1 — cmd_compile routing integration test: done

Commit `63543a4`. Two tests in `crates/lykn-cli/tests/source_context_path_routing.rs`:
- `with_context_path_resolves_from_context_directory`: invokes `lykn compile` with `--source-context-path` on source with relative import; succeeds.
- `without_context_path_resolves_from_file_directory`: same source without flag in /tmp; fails (correct — import can't resolve from /tmp).

### A-2 — CLI help output test: done

Same commit. Test `help_output_contains_source_context_path_flag` asserts `lykn compile --help` contains `--source-context-path`.

### A-3 — bad-form fixture test: done

Commit `c29f6a2`. New test in `test/forms/dd-52.test.js` exercises `test/regression/surface-macros/bad-form/` fixture. Asserts compilation of `(surface-macros 42)` produces validation error.

### B-1 — compileBoth docstring overhaul: done

Commit `f39da91`. Docstring is 50+ lines naming: source-context-path mechanism, Deno.cwd() assumption, normalizer transformations, forbidden-extension policy, known convergence scope and limitations.

### B-2 — Synthetic-path routing comment: done

Commit `8570155`. 15-line comment above `match source_context_path` citing pass0.rs, explaining synthetic basename irrelevance, parent-directory significance, and None-path default behavior.

### B-3 — Normalizer policy comment: done

Commit `f39da91`. Comment above `normalize` function lists all transformations with rationales and codifies the "FIX the divergence, don't normalize it" default policy.

### C-1 — Class/object formatting: done

**C-1a object parens:** direction (a) — Rust now wraps standalone object expressions in `(...)`. Commit `f1f04a5` (initial) + `19f7d11` (refined).

**C-1a object formatting:** direction (a) — Rust now emits `{ key: val }` with spaces inside braces, matching JS post-normalization. Commit `19f7d11`.

**C-1a computed keys:** direction (a) — Rust now unwraps `(computed key)` marker and emits `[key]` instead of `[computed(key)]`. Commit `19f7d11`.

**C-1b class body whitespace:** direction (c) — empty class bodies now emit `{}` on one line; non-empty bodies already converge via whitespace normalization.

**C-1c class constructor `=`:** DEFERRED TO DD-58. Tests rewritten to use `set!` per CDC direction. Rationale comment in test file.

### C-2 — Generators: done (no action needed)

All 8 generator tests converge after normalization. Converted to `compile-both`. Original failure was import pattern issue (sed didn't convert the generator file's non-standard import line).

### C-3 — Async wrapping: done

**C-3a trailing `;`:** direction (c) — normalizer extended with `}\s*;` → `}` transformation. Rationale comment added per B-3 policy. Commit `e89e0ec`.

**C-3b async arrow parens:** direction (a) — Rust wraps async arrow expressions in `(...)`. Async function declarations are NOT wrapped (refined after initial implementation was too aggressive).

### C-4 — Destructuring: done

**C-4a destr-param formatting:** no action needed. 9 of 10 tests converge after normalization. One test (single-param arrow paren cosmetic: `(x) =>` vs `x =>`) uses JS-only compile with rationale comment.

**C-4b destr-assign `=`:** DEFERRED TO DD-58. Skip-with-rationale comment in test file.

### C-5 — Default params: done

Direction (a). The failing pattern was a bare arrow expression without paren wrapping — same root cause as C-3b. Fixed by the expression-statement disambiguation codegen change. All 3 tests converge.

### C-6 — Tagged templates: done

**C-6a tag parens:** Not needed. Tagged templates are unambiguous at statement level. Initial implementation wrapped all tags; refined to not wrap (matching JS behavior).

**C-6b template content:** direction (a) — localised emitter fix. Removed double-escape of backslashes in both `emit_template_text` (emit.rs) and `emit_template_text_icu` (icu.rs). NOT entangled with surface/kernel boundary — the bug was purely in the codegen escape handling.

**Finding: JS compiler has the same bug.** The JS compiler (via astring) also double-escapes template content. The Rust fix is correct; the JS-side equivalent fix is tracked as a fast-follow.

---

## Substrate-rule compliance

1. **AGENTS.md safety gates:** No safety-bypass flags injected.
2. **LEDGER_DISCIPLINE no-silent-rewrite:** All 12 items addressed. No items dropped. Deferred items explicitly named with DD-58 rationale.
3. **No spec-softening:** C-1c and C-4b correctness-grade items properly deferred with explicit rationale, not silently downgraded.
4. **Partial-adoption check:** Codegen paren-wrapping applied at one site (`emit_statement`). Object formatting applied at one site (`emit_object`). Template fix applied at both `emit_template_text` and `emit_template_text_icu`. No partial adoption.

---

## Findings for fast-follow

1. **Duplicate template-text escape functions.** `emit_template_text` (emit.rs) and `emit_template_text_icu` (icu.rs) implement the same escape logic independently. The C-6b bug existed in both because they were separate. Should unify into a single function both paths call.

2. **JS compiler double-escapes template content.** The same bug as Rust's C-6b exists in the JS compiler — astring or the JS template emitter adds a spurious backslash in template literal text. Tracked for future alignment (direction (b) — align JS to Rust's now-correct output).

3. **Lambda expansion divergence.** JS expands `(lambda ...)` to `function` (anonymous function expression), Rust expands to `=>` (arrow). Different `this`-binding semantics. DD-58 territory.

4. **Single-param arrow paren cosmetic.** Rust emits `(x) =>`, JS emits `x =>`. Both valid JS. Minor codegen alignment candidate.

---

## Closure

All 12 items addressed. Test counts: 1001 Rust, 292 surface, 669 forms — all passing. compile-both count: 109 (up from 68).
