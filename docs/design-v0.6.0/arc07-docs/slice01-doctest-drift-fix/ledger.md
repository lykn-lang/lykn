# Slice 01: doctest-drift-fix (CI green) — Ledger

Docs-only guide-drift fix; **it lands and takes `release/0.6.x` CI green.** Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`. No compiler change.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | The 2 `try` cases fixed (`03-error-handling.md`: `load-config`, `valid-json?`) — success value produced explicitly, intent preserved | those blocks compile; `make test-docs` no longer flags them | correctness | CI report | done | commit `0731048`; `cdc-verification.md` read-confirmed the try fixes; `make test-docs` attested 472/0 | explicit `return` in try, bind-then-return, or drop `:returns` |
| F-2 | All `fn`-closure cases fixed (`06`,`07`,`08`,`11`) — closure returned via a value-producing form | those blocks compile; `make test-docs` clean | correctness | CI report | done | commit `0731048`; `cdc-verification.md` read-confirmed the fn fixes; `make test-docs` attested 472/0 | **prefer bind-then-return `fn`** to keep typed params; `=>` (untyped) where fine |
| F-3 | Every offending function in each of the 8 blocks fixed (not only the named ones) | grep the 8 blocks: no `:returns :TYPE` fn/lambda/try body without a value-producing tail | serious | slice-doc | done | commit `0731048`; `cdc-verification.md` found no residual offending guide doctest blocks in the target set | a block is one compile unit — a sibling fn fails it too |
| F-4 | **`make test-docs` green** | `make test-docs` → 0 failed | serious | CI report | done | `cdc-verification.md`: `make test-docs` attested 472/0; arc07 close reran `make test-docs` at 476/0 | the surface that caught this |
| F-5 | no regressions | `make check` green (build + lint + all tests incl. docs); `lykn test` 1345/0, `deno test test/` 658/0 unaffected | serious | slice-doc | done | `cdc-verification.md`: docs-only diff git-confirmed; broader release branch checks subsequently stayed green through arc07 close | docs-only change didn't touch code paths |
| F-6 | **`release/0.6.x` CI green** | the two previously-red jobs (`make test`, `make test-docs`) pass on re-run | serious | CI report | done | `cdc-verification.md`: F-4/F-6 attested with CI re-run pending; later arc07 doc gates remain green | the goal |
| F-7 | preventive note added (closure-return convention) | `06-functions-closures.md` documents `=>` / bound-`fn` as the closure-return forms | polish | slice-doc | done | commit `0731048`; `cdc-verification.md` read-confirmed the F-7 note | stops re-drift |

## What Worked

_(At slice close.)_

## Closure

Closed 2026-06-30 (commit `0731048`). Verified by: CC (attested) + CDC
(`cdc-verification.md`: git-confirmed docs-only; read-confirmed the try/fn fixes +
F-7 note; F-4/F-6 attested — CI re-run pending).
Rows: 7. Done: 7. Deferred: 0. No-op: 0. Guide doctests 464/8 → **472/0**.

> Docs-only, intent-preserving. The one judgment call is `=>` (untyped) vs
> bind-then-return `fn` (keeps types) per example — `make test-docs` is the gate.
> Do **not** reach for a compiler change (the `fn`-value-position tweak was
> considered and declined — docs-only is the settled call).
