# CC Prompt — Resolve the `feature/template-update` (DD-55) merge into `release/0.6.x`

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-06-29
**State:** `release/0.6.x` has an **in-progress merge** of `feature/template-update`
(DD-55 ICU MessageFormat / i18n). `cdc/compiler-coherence` (DD-58 + DD-37) was
already merged cleanly just before. 6 files are conflicted. Resolve them, complete
the merge, and verify — git ops on the host.

## 0. Read first
- `docs/design-v0.6.0/_reconciliation-2026-06-29.md` — why these merges are happening.
- This whole prompt before touching anything. Two conflicts are **subtly
  dangerous** (§2.2, §2.3) — they can silently revert a shipped fix.

## 1. The three invariants (do not violate)
1. **slice11's async-declaration fix must survive** — async `function`/`function*`
   *declarations* emit with **no trailing `;`** (`is_async_declaration` in `emit.rs`).
2. **The D-2 fix must survive** — the JS template escaper must **not** double-escape
   backslashes (commit `e462a67`; guarded by the "ICU template backslash passthrough"
   test). DD-55 (older) tries to re-add `.replaceAll('\\','\\\\')` — that is the D-2
   bug returning.
3. **DD-55 must land functional** — ICU MessageFormat codegen (JS + Rust mirror),
   the fallible-codegen `Result` cascade, and the ICU cross-compiler tests all work.
   DD-58/DD-37 (just merged: `classifier.js`, `surface-helpers.js`) must also survive.

This is a **"take both intents" merge**, not pick-a-side — except where an invariant
above dictates the winner.

## 2. Per-file resolution

### 2.1 `crates/lykn-lang/src/codegen/emit.rs` (9 hunks — the big one)
- **Hunk at the `use super::icu::{…}` import:** trivial ordering diff — take either; `cargo fmt` normalizes.
- **Hunk at `emit_statement`'s expression-statement branch (~line 111):** **take HEAD.**
  HEAD has slice11's `needs_parens` async-declaration logic; `feature/template-update`
  has the older simpler `emit_expr(...)` (it forked before slice11). Taking the
  template side **loses the async fix** (invariant 1).
- **The remaining hunks** are almost certainly DD-55's **fallible-codegen `Result`
  cascade** (signatures returning `Result<…, LyknError>`, added `?`). For each:
  **keep HEAD's DD-58/slice11 logic AND apply DD-55's `Result` return/`?` threading
  around it.** The function bodies from HEAD must be preserved; only their
  fallibility/signatures adopt the DD-55 shape. Reconcile by understanding, hunk by hunk.

### 2.2 `packages/lang/compiler.js` (1 hunk — DANGER, invariant 2)
DD-55 adds `.replaceAll('\\', '\\\\')` to the template-element escaper; HEAD omits it
**on purpose** (the D-2 fix removed backslash double-escaping). **Resolve in HEAD's
favour — do NOT re-add the backslash double-escape.** Then confirm **both** the D-2
"ICU template backslash passthrough" test **and** DD-55's ICU tests pass. If DD-55's
ICU path genuinely needs different escaping, that's a real design question — **stop
and surface it**, don't guess.

### 2.3 `crates/lykn-lang/src/codegen/icu.rs` (15 hunks, both-added)
Two divergent ICU implementations (HEAD's came in via the release-side template work;
`feature/template-update` has the full DD-55 version). **Diff them.** The DD-55
version is most likely the canonical/fuller one — prefer it as the base, then
re-apply any HEAD-only fixes it's missing. Drive the choice by which the ICU tests
(§2.4) and `emit.rs`'s `try_emit_template_icu`/`IcuDispatch` callers expect. Surface
if genuinely ambiguous.

### 2.4 `crates/lykn-lang/tests/icu_cross_compiler_tests.rs` (2 hunks, both-added)
Reconcile to the superset of test coverage; align with the `icu.rs` you settled in
§2.3. These must pass after resolution.

### 2.5 `docs/guides/17-template-and-i18n.md` (6 hunks, both-added)
**Combine, don't pick.** HEAD has slice10's W-4d ICU error-block fence annotations
(`lykn,compile-fail`); `feature/template-update` has the full DD-55 i18n guide. Keep
**both** — the DD-55 prose with the W-4d fence corrections applied.

### 2.6 `crates/lykn-cli/src/dist.rs` (1 hunk)
Trivial line-wrap diff around `emit_module_js(...).map_err(...)` — functionally
identical; take either, `cargo fmt` normalizes.

## 3. Verify (MUST — all green before the merge commit)
Rebuild-first (avoid the stale-artifact traps slice11 guards):
```sh
cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"
cargo fmt --all -- --check          # or run cargo fmt --all + restage
cargo clippy --all-features --workspace -- -D warnings   # exit 0
cargo test --all-features --workspace                    # 0 failed
"$LYKN_BIN" build                                         # refresh target/lykn/build
"$LYKN_BIN" test                                          # cross-compiler corpus: 0 failed
deno test --config project.json -A test/                 # 0 failed
deno lint scripts/                                        # exit 0
```
Plus **targeted invariant checks**:
- The 3 async tests green: `async: wraps function declaration`, `for-await-of: basic`,
  `async function*: basic` (invariant 1 survived).
- The D-2 backslash test green (invariant 2 survived).
- The DD-55 ICU cross-compiler tests green (invariant 3).

Test **counts will be higher** than the old 657/1293 (DD-37 + DD-55 added tests) —
"green" = **0 failed**, not a specific number.

## 4. Commit scope (important)
- Stage and commit **only the merge** — the resolved conflict files plus the files
  the merge already auto-staged. Use a clear merge message.
- **Do NOT stage `docs/design-v0.6.0/**`** — there are uncommitted CDC planning-doc
  edits + untracked reconciliation/cdc-verification files in the tree. Leave them
  alone; CDC reconciles and commits those separately after you confirm green.
  `git status` before committing to confirm `docs/design-v0.6.0/` stays unstaged.

## 5. Close
Report: per-file how you resolved it (esp. the §2.2 escaping call and the §2.3
icu.rs choice), the full verification output (0-failed lines), and confirmation
that invariants 1–3 held. Surface anything that needed a design judgment. Then CDC
re-verifies, un-qualifies arc03, and gives DD-55 an arc.
