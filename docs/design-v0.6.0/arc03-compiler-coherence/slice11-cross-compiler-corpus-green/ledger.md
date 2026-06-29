# Slice 11: cross-compiler-corpus-green — Ledger

Acceptance criteria as grep/test-verifiable rows. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Evidence MUST reach
`reproduced` (CDC re-runs) for `done`. **All test runs use a freshly built
binary** (`cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"`)
— never the stale `bin/lykn`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | async function **declaration** converges Rust↔JS (no trailing `;` divergence) | `"$LYKN_BIN" test 2>&1 \| grep -A2 "async: wraps function declaration"` shows pass; and a direct compile of `(async (function f () ...))` via Rust has no `}` `;` tail | serious | arc03 closing §5 #1 | **done** | Rust codegen fix in `emit.rs` (`is_async_declaration` + `emit_statement`). Raw: `lykn compile (async (function fetchData () (return 1)))` → ends `}` with **no** trailing `;` (`cat -e` confirms). `async: wraps function declaration ... ok` in corpus. | **attested**; fixed codegen, normalizer untouched (per policy) |
| F-2 | `for-await-of: basic` and `async function*: basic` converge (same root cause as F-1) | `"$LYKN_BIN" test` → both tests in `test/forms/generator_test.lykn` pass | serious | arc03 closing §5 #1 | **done** | Cleared by the F-1 fix (`function*` routes through `is_async_declaration`). `for-await-of: basic ... ok`, `async function*: basic ... ok` in the green corpus run | **attested** |
| F-3 | DD-49 return-type-check convergence (gensym/blank-line residual) resolved | `"$LYKN_BIN" test` → `"DD-49 Finding #4"` test in `test/forms/dd-49_test.lykn` passes | correctness | arc03 closing §5 #4(gensym) | **done** | Root cause = **stale build dir**, not codegen: `target/lykn/build/testing/helpers.js` (May 14) had only normalizer transforms #1/#2 (missing #3 gensym). Proven: running the **source** normalizer on both outputs → `EQUAL? true`. Fresh build dir → `DD-49 Finding #4 ... ok`. No compiler/normalizer change needed; covered by F-7 guard | **attested**; gensym is process-global (inherent), correctly handled by existing transform #3 |
| F-4 | DD-52 import-macros `--source-context-path` convergence fixed OR documented harness limit | `"$LYKN_BIN" test` → `test/forms/dd-52-import-macros-convergence_test.lykn` passes, **or** test marked skipped with written rationale | correctness | arc03 closing §5 #2 | **done** | Also a **stale build dir** artifact: the old `helpers.js` predated the `compileboth-source-context-path` fast-follow, so it invoked Rust *without* `--source-context-path` → relative macro path resolved against the temp dir (`/var/folders/.../T/./packages/testing`). Fresh build dir has the fix → passes reliably (5/5 runs). No remaining Rust path bug | **attested**; the migrated fast-follow works once the build dir is fresh (F-7) |
| F-5 | DD-53 R-5 JSR end-to-end dispositioned as network/env-gated (not a coherence defect) | `test/forms/dd-53.test.js` passes when network available, else skips with rationale (no hard fail offline) | polish | arc03 closing §5 #3 | **done** | Added a reachability probe (`fetch jsr.io meta + AbortSignal.timeout`, try/catch → skip) — the prior guard checked net *permission* (always granted under `-A`), not reachability, so it would hard-fail offline. Passes online (`DD-53 R-5 ... ok`); skips cleanly offline by inspection | **attested** online; offline-skip path attested by code inspection (CDC: re-run with net denied) |
| F-6 | **cross-compiler corpus green** | `cargo build --release && LYKN_BIN="$(pwd)/target/release/lykn" "$LYKN_BIN" test` → `0 failed` | serious | arc03 A-6 | **done** | `ok | 1293 passed | 0 failed (8s)`, exit 0. Reproduced across 3 consecutive runs (incl. via `make test-js`) | **attested**; the gating row |
| F-7 | stale-`bin/lykn` guard: corpus run builds/uses a fresh binary or fails loudly | inspect `make test`/runner: builds release first, or errors if `bin/lykn` older than `crates/**/*.rs` | correctness | arc03 closing §5 #5 | **done** | Two layers: (a) Rust guard `check_cross_compiler_freshness` in `cmd_test` — fails loudly (exit 1) if `LYKN_BIN`/`bin/lykn` older than `crates/**/*.rs` **or** `target/lykn/build/` older than `packages/**`. Verified firing: `touch emit.rs` → `error: stale compiler binary ... exit 1`. (b) Makefile `fresh-artifacts` prereq rebuilds binary + build dir before every JS/lykn/docs suite (rm+cp dodges the macOS sig trap) | **attested**; covers both staleness traps (binary + build dir) |
| F-8 | no silent normalizer weakening | `git diff packages/testing/helpers.js` — any normalizer change carries (a) rationale comment and (b) this closing-report reference, per the in-file policy; else no change | correctness | helpers.js policy | **done** | `git diff --stat packages/testing/helpers.js` → empty. The normalizer is **unchanged**; all fixes were compiler (F-1) or stale-artifact (F-3/F-4) | **attested**; policy honored — fixes preferred over normalizer extension |
| F-9 | no regressions | `cargo test` and `deno test --config project.json -A test/` both green | serious | slice-doc | **done** | `cargo test --all-features --workspace` → all suites `0 failed` (incl. 1003-test suite); `deno test --config project.json -A test/` → `657 passed | 0 failed`; `cargo clippy --all-features --workspace -- -D warnings` → exit 0 | **attested** |

## What Worked

- **Empirical reproduction before theorizing.** The "6 divergences" were not 6 bugs:
  3 were one codegen quirk (async trailing `;`), 2 were a stale build dir, 1 was a
  network gate. Reproducing each diff against a *fresh* binary + build dir, and
  running the source normalizer by hand, separated real defects from artifacts.
- **The fix matched the defect class.** Only F-1/F-2 were a true codegen
  divergence → one targeted `emit.rs` change (12 lines) cleared 3 failures. The
  normalizer was never touched (F-8).
- **The second staleness trap was the real find.** The arc03 A-2 work flagged the
  stale *binary*; this slice found a stale *build dir* (`target/lykn/build/`) was
  silently masking transforms #3/#4. F-7's guard now covers **both**.

## Closure

Closed at commit <pending — Duncan does git ops on host> on 2026-06-28.
Verified by: CC (attested); awaiting CDC reproduction.
Rows: 9. Done: 9. Deferred: 0. No-op: 0.

Changes (4 files, all in scope): `crates/lykn-lang/src/codegen/emit.rs` (F-1/F-2),
`crates/lykn-cli/src/main.rs` (F-7 guard), `Makefile` (F-7 prevention),
`test/forms/dd-53.test.js` (F-5). Iteration count: 1 (analyze → fix → verify, no
re-passes). `packages/testing/helpers.js` deliberately unchanged (F-8).
