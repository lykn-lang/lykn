# Slice 11: cross-compiler-corpus-green — Closing Report

**By:** CC (Claude Code, fresh session) · **Date:** 2026-06-28
**Branch:** `release/0.6.x` working tree (git ops deferred to Duncan, per prompt §0).
**Evidence strength:** `attested` (CC ran every command; CDC reproduces to lift to
`reproduced` and mark arc03 row A-6 done).

**Verdict: the cross-compiler `compile-both` corpus is GREEN — `1293 passed, 0
failed`.** All nine ledger rows reach `done`. The six residual failures from the
arc03 A-2 run were **one** real codegen bug (3 failures), **two** stale-build-dir
artifacts (2 failures), and **one** network gate — not six independent defects.

---

## Per-row walk (the contract)

The full per-row evidence is in [`ledger.md`](ledger.md); summarized here.

- **F-1 — async declaration trailing `;` (done).** Root cause: `STATEMENT_FORMS`
  in `emit.rs` listed `function`/`function*` but not `async`, so `(async
  (function …))` fell through to the expression-statement branch and got a
  trailing `;`. Fix: `is_async_declaration()` routes async-wrapped
  `function`/`function*` through the declaration path (no `;`), while async
  arrows/lambdas stay expression statements. Raw compile of `(async (function
  fetchData () (return 1)))` now ends `}` with no `;` (`cat -e` confirmed).
- **F-2 — generators (done).** `for-await-of: basic` and `async function*: basic`
  shared F-1's root cause; both pass with no extra change.
- **F-3 — DD-49 gensym/blank-line (done).** **Not a codegen bug.** The built
  `target/lykn/build/testing/helpers.js` (May 14) carried only normalizer
  transforms #1/#2 — missing #3 (gensym canonicalization). The *source*
  normalizer makes the two outputs `EQUAL? true` (verified by hand). A fresh
  build dir resolves it; the process-global gensym counter is inherent and is
  exactly what transform #3 exists to absorb. No compiler/normalizer change.
- **F-4 — DD-52 import-macros (done).** **Also a stale-build-dir artifact.** The
  old `helpers.js` predated the `compileboth-source-context-path` fast-follow, so
  it invoked Rust *without* `--source-context-path` → the relative macro path
  resolved against the temp dir (`/var/folders/…/T/./packages/testing`). The
  fresh build dir carries the fix → passes 5/5. No remaining Rust path bug.
- **F-5 — DD-53 JSR end-to-end (done).** Added a reachability probe (a timed
  `fetch` to jsr.io in try/catch → skip). The prior guard checked net
  *permission* (always granted under `-A`), not reachability, so it would
  hard-fail offline. Now passes online and skips cleanly offline.
- **F-6 — corpus green (done).** `1293 passed | 0 failed`, exit 0, reproduced
  across 3 runs including `make test-js`.
- **F-7 — stale-artifact guard (done).** (a) Rust guard
  `check_cross_compiler_freshness` in `cmd_test` fails loudly (exit 1) when the
  binary is older than `crates/**/*.rs` **or** the build dir is older than
  `packages/**` — verified firing via `touch emit.rs`. (b) Makefile
  `fresh-artifacts` prerequisite rebuilds binary + build dir before every
  JS/lykn/docs suite (rm+cp dodges the macOS arm64 signature trap).
- **F-8 — no normalizer weakening (done).** `git diff packages/testing/helpers.js`
  is empty. Every fix was a compiler change or a stale-artifact refresh; the
  equality check was never loosened.
- **F-9 — no regressions (done).** `cargo test --all-features --workspace` all
  green; `deno test --config project.json -A test/` → 657/0; `cargo clippy …
  -D warnings` → exit 0.

**Silent-drop check:** 9 opening rows, 9 closed (9 done, 0 deferred, 0 no-op).
No row dropped. Scope-out items (cargo-fmt red, coverage-beyond-form-codegen,
DD-58/DD-37 behavior) were not touched, as specified.

---

## Bubble-up to arc03

**1. Did slice11 deliver its assigned piece (A-6 / corpus green)?** Yes. The
cross-compiler corpus is green (`1293/0`) against a freshly built binary + build
dir. arc03 row **A-6 can move to done** once CDC reproduces F-1…F-9; **P-3** (arc03
closed+composed) and **P-9** (compileBoth same-output) can then close at project
scale.

**2. What did slice11 reveal that the arc-plan / closing-report didn't anticipate?**

- **A second staleness trap.** The arc03 closing-report §5 #5 named the stale
  *binary*. Slice11 found a stale **build dir** (`target/lykn/build/`) was an
  equal-and-separate trap: it silently ran the corpus against an out-of-date
  `helpers.js` normalizer, which **manufactured 2 of the 6 "divergences" (F-3,
  F-4)**. The arc03 closing-report classified F-3/F-4 as a gensym/blank-line
  cosmetic and a Rust path bug respectively; the true cause of *both* was the
  stale build dir. **Correction to record:** F-3 and F-4 were never compiler
  defects. The async trailing `;` (F-1/F-2) was the *only* genuine codegen
  divergence in the residual set. This sharpens the arc's "0 semantic
  divergences" finding: of the 6 residuals, **1 root-cause codegen quirk
  (cosmetic) + 2 stale-build-dir artifacts + 1 gensym(inherent) + 1 network +**
  (F-1's 3 share one cause). F-7's guard now covers both traps.
- **The freshness guard belongs in the harness, not the operator's memory.**
  Both A-2 reproductions (arc03's and this slice's) were initially misled by
  stale artifacts. The guard + Makefile prerequisite make the trap
  unreproducible going forward.

**3. Silent-drop diff at slice scale (specified vs delivered):** none. Every
scoped item delivered; the only *additions* beyond spec are the build-dir half
of the F-7 guard and the F-5 reachability probe — both disclosed here.

---

## What this changes for the arc03 close (for CDC)

arc03 `closing-report.md` §3 can be updated: the A-2 corpus is now **green**, not
"red on 6 non-semantic failures." The honest re-statement: **0 semantic
divergences and 0 residual failures**, with the one true codegen divergence
(async trailing `;`) fixed in `emit.rs` and the rest shown to be stale-artifact
or environment, now guarded. The coverage bound (~11%, form-codegen only) is
unchanged and remains a documented limitation, not a slice11 deliverable.

**Reproduce (CDC):**
```sh
cd /Users/oubiwann/lab/lykn/lang
cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"
"$LYKN_BIN" build                 # refresh target/lykn/build/
"$LYKN_BIN" test                  # expect: 1293 passed | 0 failed
git diff packages/testing/helpers.js   # expect: empty (F-8)
cargo test --all-features --workspace  # expect: all green (F-9)
deno test --config project.json -A test/   # expect: 657 passed | 0 failed (F-9)
# guard check (F-7): touch a crate src, expect a loud stale-binary error + exit 1
touch crates/lykn-lang/src/codegen/emit.rs && "$LYKN_BIN" test test/forms/for_test.lykn ; echo "exit=$?"
```
