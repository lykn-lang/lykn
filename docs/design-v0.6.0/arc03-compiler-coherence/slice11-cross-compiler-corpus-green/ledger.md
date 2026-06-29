# Slice 11: cross-compiler-corpus-green — Ledger

Acceptance criteria as grep/test-verifiable rows. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. Evidence MUST reach
`reproduced` (CDC re-runs) for `done`. **All test runs use a freshly built
binary** (`cargo build --release && export LYKN_BIN="$(pwd)/target/release/lykn"`)
— never the stale `bin/lykn`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | async function **declaration** converges Rust↔JS (no trailing `;` divergence) | `"$LYKN_BIN" test 2>&1 \| grep -A2 "async: wraps function declaration"` shows pass; and a direct compile of `(async (function f () ...))` via Rust has no `}` `;` tail | serious | arc03 closing §5 #1 | open | | **fix Rust codegen** (`emit_async`/`emit_function`), not the normalizer, per helpers.js policy |
| F-2 | `for-await-of: basic` and `async function*: basic` converge (same root cause as F-1) | `"$LYKN_BIN" test` → both tests in `test/forms/generator_test.lykn` pass | serious | arc03 closing §5 #1 | open | | should be cleared by the F-1 codegen fix |
| F-3 | DD-49 return-type-check convergence (gensym/blank-line residual) resolved | `"$LYKN_BIN" test` → `"DD-49 Finding #4"` test in `test/forms/dd-49_test.lykn` passes | correctness | arc03 closing §5 #4(gensym) | open | | prefer compiler fix; touch normalizer #3 only with policy rationale + this slice ref |
| F-4 | DD-52 import-macros `--source-context-path` convergence fixed OR documented harness limit | `"$LYKN_BIN" test` → `test/forms/dd-52-import-macros-convergence_test.lykn` passes, **or** test marked skipped with written rationale | correctness | arc03 closing §5 #2 | open | | this is the migrated `slice09/fast-follows/compileboth-source-context-path` item |
| F-5 | DD-53 R-5 JSR end-to-end dispositioned as network/env-gated (not a coherence defect) | `test/forms/dd-53.test.js` passes when network available, else skips with rationale (no hard fail offline) | polish | arc03 closing §5 #3 | open | | environment dependency, not Rust↔JS divergence |
| F-6 | **cross-compiler corpus green** | `cargo build --release && LYKN_BIN="$(pwd)/target/release/lykn" "$LYKN_BIN" test` → `0 failed` | serious | arc03 A-6 | open | | the gating row; transcript required |
| F-7 | stale-`bin/lykn` guard: corpus run builds/uses a fresh binary or fails loudly | inspect `make test`/runner: builds release first, or errors if `bin/lykn` older than `crates/**/*.rs` | correctness | arc03 closing §5 #5 | open | | prevents the false-divergence trap (16 phantom failures) |
| F-8 | no silent normalizer weakening | `git diff packages/testing/helpers.js` — any normalizer change carries (a) rationale comment and (b) this closing-report reference, per the in-file policy; else no change | correctness | helpers.js policy | open | | compiler fixes preferred over normalizer extensions |
| F-9 | no regressions | `cargo test` and `deno test --config project.json -A test/` both green | serious | slice-doc | open | | guard against the fix breaking other suites |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 9. Done: _. Deferred: _. No-op: _.
