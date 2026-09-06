# 01 · macro-entry-diagnostics — Closing Report

**By:** CC · **Date:** 2026-07-24 · **Branch:** `release/0.6.x`
**Verdict: delivered.** An `import-macros` failure on a package directory that
doesn't exist now says so — naming the missing path, the specifier the user
wrote, that it came from a `lykn link` overlay, and **both exits** — instead of
confidently telling the user to add `lykn.macroEntry` to a `deno.json` inside a
directory that isn't there. The two compilers' messages are unified and a parity
test fails if they drift. `make check` green.

## Per-row ledger walk (6 in, 6 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **M-1** — missing dir ≠ the macroEntry hint (both compilers) | **done** | Rust `find_macro_entry` and JS `findMacroEntry` branch on `!is_dir` **first** → `macro_dir_not_found_message` / `macroDirNotFoundMessage`. Rust's call site was `is_dir()`-only (a missing dir fell to "cannot read macro module"); widened to `is_dir() \|\| !exists()` so the leaf is reached. Tests: Rust `test_find_macro_entry_missing_dir_is_not_the_macroentry_hint`, JS "M-1". |
| **M-2** — "dir present, no entry" preserved | **done** | `no_macro_entry_message` / `noMacroEntryMessage`. The existing Rust test still passes. **Bonus:** closed the *pre-existing* drift — Rust's two-line+parenthetical form is now the JS one-line form; both identical. |
| **M-3** — overlay provenance | **done** | **Design (a): pass `MacroOrigin { specifier, via_overlay }` into the leaf** (see below). The error names the specifier, `via: lykn link overlay (project.local.json)`, and both exits (`lykn dist` / `lykn unlink <specifier>`). Tests: Rust `..._overlay_provenance`, JS "M-3". |
| **M-4** — parity, drift-detected (the structural point) | **done** | `test/expander/macro-entry-diagnostics-parity.test.js`: every canonical phrase must appear verbatim in **both** source files (the reserved-words-parity precedent). **Verified it fails on induced drift** — breaking the JS `checked:` line → `missingFromJs` non-empty; restored → passes. |
| **M-5** — no `Uncaught (in promise)` | **done** (cheap, not deferred) | The crash came from the `deno eval` **compile-driver script** in `main.rs::compile_lykn_test_files`, not `expander.js`. Wrapped its `lykn()` call in try/catch → clean `console.error` + `Deno.exit(1)`; the Rust side already reports the status as "error compiling <file>". mycelium C-bis repro: **no more `Uncaught`**. |
| **M-6** — `make check` green; scoped diff | **done** | `make check` ✓. Diff: `pass0.rs`, `expander.js`, `main.rs` (M-5), + 2 new JS tests. `Cargo.toml` untouched; no new deps. |

## The design decision (M-3): option (a), pass provenance down

`find_macro_entry(pkg_dir)` was path-only. CDC leaned **(b) enrich at the call
site** (keep the leaf pure). I took **(a) pass an optional `MacroOrigin` into the
leaf** — CDC explicitly invited this ("if (b) loses the distinction, take (a)").
Rationale: (a) co-locates the *full* enriched message at **one site per
compiler**, so M-4's parity test is a clean leaf-level comparison and the two
messages are identical by construction rather than by two call sites staying in
sync. The leaf gains one optional parameter; the message logic doesn't fork.

`via_overlay` is computed symmetrically: a **scheme** specifier (`jsr:`/`npm:`)
that resolved to a **local** target is exactly the Tier-0 `lykn link` case — Rust
checks the effective imports map; JS checks that `import.meta.resolve` returned a
`file://` path (a published package resolves to a `jsr:`/`npm:` URL instead).

## The message, before / after

```
# BEFORE (both, misleading — hint points inside a dir that isn't there):
import-macros: no macro entry found in /…/dist/testing/
  hint: add lykn.macroEntry to the package's deno.json

# AFTER (local Rust binary, verified via `lykn compile`):
import-macros: package directory not found: /…/dist/testing/
  specifier: jsr:@lykn/testing@0.5.2
  via: lykn link overlay (project.local.json)
  hint: run 'lykn dist' in the linked project, or 'lykn unlink jsr:@lykn/testing@0.5.2'
```

## Acceptance demonstration — the nuance, disclosed

The operator's repro is `lykn test` in **mycelium** with a `lykn link` active,
moving the linked dist away. After this slice that repro shows:

- **M-5 delivered now:** the failure is a clean "error compiling …", **not**
  `Uncaught (in promise)`.
- **M-1/M-3 content — not in mycelium yet, and here's why:** mycelium pins the
  **published** `jsr:@lykn/lang@0.5.2`, and `compile_lykn_test_files` uses that
  published JS compiler (`compiler_import = "jsr:@lykn/lang"` when there's no
  local `packages/lang`). The published 0.5.2 JS predates this fix, so mycelium's
  `lykn test` still prints the old "no macro entry" text. The improved content
  lands in mycelium when **@lykn/lang 0.6.0 publishes** (mycelium re-pins), or
  immediately if the operator links local lang.

The fix itself is proven on the **local** compilers (always current):
- **Rust binary:** `lykn compile` of an `import-macros` at a missing overlay dir
  prints the full message above (host-run, in the report).
- **JS (`packages/lang`):** the 3 behavioral tests + the parity test, run against
  the freshly-built `lang/` (the test harness rebuilds it).

## Bubble-up

- **The slice's own scope is delivered and tested in both compilers**, with the
  parity/drift guard that was its structural point.
- **Routed follow-up (named home, not built here):** in
  `compile_lykn_test_files`, the Rust expander's now-clean macro-resolution error
  is **swallowed** by the best-effort DD-58 validation (`if let Ok(expanded)`),
  so the local binary's good message never reaches the operator when a published
  JS compiler is in play. Surfacing *macro-resolution* expand errors (while
  keeping best-effort for genuine cross-compiler-divergence cases) would deliver
  M-1/M-3 content in mycelium today, independent of the published JS. It's a
  `cmd_test` control-flow change with its own risk profile (could surface
  Rust-only expand failures) — deliberately **out of this diagnostics slice**;
  route to a `cmd_test`-error-surfacing follow-up or the diagnostics arc if
  dogfooding keeps producing these.
- **Systemic note (per slice-doc §6):** this is the third "the untested path is
  the one that shipped wrong" in a day (slice07's zero-coverage rewrite, its
  overclaiming test name, and this missing-dir case). Belongs in
  `backlog/discoveries.md` as a systemic entry.

## Discipline notes

- **Scope:** `pass0.rs` (leaf + message helpers + call-site widen + 2 tests),
  `expander.js` (mirror + 3 exports for tests), `main.rs` (M-5 compile-driver
  try/catch — the one out-of-`{pass0,expander}` touch, disclosed), + 2 new JS
  test files. No new deps; `cargo fmt` applied.
- **Host note:** `rm -f bin/lykn && cp …` (Apple Silicon); the JS tests need a
  `lykn build` so `lang/` (→ `target/lykn/build/lang/`) carries the source edit —
  the test harness does this.
