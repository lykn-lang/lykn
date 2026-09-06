# 01 · macro-entry-diagnostics — Ledger

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands +
attests `make check`; CDC verifies the two implementations and their parity
against `lang` by inspection. **Closer ≠ verifier.**

Evidence strengths: `asserted` < `attested` < `reproduced` < `reconciled`. CDC
has no toolchain — structural rows are *reproduced by inspection at HEAD*,
runtime rows are **CC-attested** and reconcile on the operator's host.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| M-1 | **A missing package directory produces a distinct error** naming the path that does not exist — **not** the `lykn.macroEntry` hint. Implemented in **both** compilers. | read `find_macro_entry` (Rust + JS); the new missing-dir test | **serious** | operator C-bis repro | **done** | Rust `find_macro_entry` + JS `findMacroEntry` branch on `!is_dir` first → `macro_dir_not_found_message` / `macroDirNotFoundMessage`. Rust call site widened (`is_dir() \|\| !exists()`) so a missing path reaches the leaf (was `is_dir()`-only → "cannot read"). Tests: `test_find_macro_entry_missing_dir_is_not_the_macroentry_hint` (Rust) + JS "M-1". Host: `lykn compile` shows the message directly (see closing-report) | the defect that motivated the slice |
| M-2 | **The existing "directory present, no entry" message is preserved** — same content, same hint, both compilers. | diff the message; existing test `test_find_macro_entry_no_entry_errors` still green | correctness | regression guard | **done** | `no_macro_entry_message` / `noMacroEntryMessage`. The existing Rust test still passes (asserts "no macro entry found" + "hint: add lykn.macroEntry") + JS "M-2". **Also fixed the pre-existing drift** — Rust's two-line+parenthetical form is now the JS one-line form (both identical) | good message kept; drift closed |
| M-3 | **Overlay provenance in the diagnostic** — a failure resolved through the Tier-0 `lykn link` overlay names the **specifier** the user wrote, states the path came from the overlay, and gives **both** exits (`lykn dist` in the linked project / `lykn unlink <specifier>`). | read the enriched error path; a test asserting the specifier + both exits appear | **serious** | CDC recon (D-2) | **done** | **Design (a) — pass `MacroOrigin` down** (not CDC's leaned (b)). Rationale: co-locates the full message at one site per compiler → M-4's parity is a clean leaf comparison; messages identical by construction. `via_overlay` = a scheme specifier (jsr:/npm:) with a non-scheme override (Rust: the imports map; JS: a scheme specifier resolving to a `file://` path). Tests: Rust `..._overlay_provenance` + JS "M-3" | design choice recorded per the ledger's ask |
| M-4 | **Cross-compiler parity, drift-detected** — the Rust and JS diagnostics match, and **a test fails when they drift.** | read both messages; run the parity test; confirm it fails on an induced divergence | **serious** | CDC recon (§5) | **done** | `test/expander/macro-entry-diagnostics-parity.test.js` — every canonical phrase must appear verbatim in **both** `pass0.rs` and `expander.js` (the reserved-words-parity precedent). **Drift confirmed:** breaking the JS `checked:` line makes it FAIL (`missingFromJs` non-empty); restored → passes | **the structural point** — verified failing on induced divergence, not merely existing |
| M-5 | **A user-facing macro-resolution failure is not presented as a crash** — the JS path no longer surfaces as `Uncaught (in promise)`, but as a clean error consistent with the CLI's other failures. | reproduce the C-bis negative check; inspect the output | polish | CDC recon (D-3) | **done** | The `Uncaught (in promise)` came from the `deno eval` **compile-driver script** (`main.rs` `compile_lykn_test_files`), not `expander.js`. Wrapped its `lykn()` call in try/catch → clean `console.error` + `Deno.exit(1)`; the Rust side already reports the non-zero status as "error compiling <file>". Host mycelium C-bis repro: **no more `Uncaught`** (see closing-report) | cheap after all; done, not deferred |
| M-6 | **`make check` green; scoped diff; no new deps** — `pass0.rs` + `expander.js` + their tests only. | host `make check`; `git show --stat`; `Cargo.toml` untouched | serious | scope discipline | **done** (CC-attested) | `make check` ✓. Diff: `pass0.rs`, `expander.js`, `main.rs` (**+1 for M-5** — the crash-framing lives in the compile-driver script, not `expander.js`; disclosed), + 2 new JS tests. `Cargo.toml` untouched; no new deps | M-5 required the `main.rs` compile-driver touch — noted |

## Acceptance demonstration

The operator's own repro is the bar. From arc06's runsheet, Part C-bis:

```sh
mv ~/lab/lykn/lang/target/lykn/dist/testing{,.off}
lykn test packages/mycl-html/tests/          # in mycelium, with the link active
mv ~/lab/lykn/lang/target/lykn/dist/testing{.off,}
```

**Before:** `error: Uncaught (in promise) Error: import-macros: no macro entry
found in …/dist/testing/` + a hint to add `lykn.macroEntry` to a `deno.json`
inside a directory that does not exist.

**After:** a message that names the specifier the operator wrote, says the path
came from a `lykn link` overlay, and gives both exits — **without reading the
compiler source.**

## Closure

Closed at `<CDC-fills>`. Rows: 6 (M-1…M-6). Done: 6 (CC-attested; `make check`
+ the C-bis repro reconcile on host). **Acceptance nuance (disclosed):** the
mycelium C-bis repro shows M-5 (no crash) *now*, but the improved M-1/M-3
*content* reaches mycelium's `lykn test` only once `@lykn/lang` 0.6.0 publishes —
mycelium pins the **published** `jsr:@lykn/lang@0.5.2`, so its JS compiler
predates this fix. The **local Rust binary** shows the full message today
(`lykn compile`, closing-report), and both compilers are fixed + tested. A
routed follow-up (surface the swallowed Rust validation error in
`compile_lykn_test_files`) would deliver the content in mycelium regardless of
the published JS — named in the closing-report, not built here.

_(On close: CDC verifies both implementations by inspection, confirms the parity
test genuinely fails on an induced divergence rather than merely existing,
confirms M-2's regression guard, and checks that any M-5 deferral carries a
rationale and a named home. Runtime rows reconcile on the operator's host.)_
