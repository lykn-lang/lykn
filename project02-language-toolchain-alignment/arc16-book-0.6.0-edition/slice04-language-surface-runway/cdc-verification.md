# arc16 slice04 - CDC Verification

Verifier: CDC (Codex Desktop)
Date: 2026-08-20
Implementation commit verified: `35623432e6831fc11a17233abdb519b8bbde6e84`

## Verdict

Accepted. The implementation commit closes the 0.6.0 language-surface runway
for `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`.

No blocking code findings were found in CDC review. The remaining arc16 work can
move to book-facing instruction/bootstrap and fence-reachability slices, with
one teaching note: `(exports ...)` is compiler-enforced as a top-level module
declaration, while "put exports before implementation bodies" is the preferred
style the book/guides should teach rather than an ordering rule enforced by the
compiler.

## Scope And Diff Review

CDC verified that HEAD is `3562343` on `release/0.6.x`, with a clean worktree
before CDC edits. The implementation diff touched the expected surfaces:

- Rust classifier, binding walker, resolver, analyzer, expander, emitter, DTS,
  and CLI check/compile validation.
- JS surface AST, classifier, binding walker, and expander parity.
- Focused Rust, Deno, and Lykn fixtures for exports, grouped `bind`, and
  `cond`.
- `assets/ai/SKILL.md` and the current guide surfaces that will feed the book.
- slice04 close artifacts and arc16 bubble-up text.

The implementation commit includes both required co-author trailers.

## Ledger Verification

Opening ledger rows counted: 12. Closing-report rows counted: 12. No silent
drops found.

| ID | CDC disposition | Evidence |
|----|-----------------|----------|
| F-1 | accepted | Closing report lists the required repo, guide, prior-slice, Rust, and Deno guidance reads. CDC also read the collaboration-framework close discipline, `AGENTS.md`, and focused Rust/Deno review guidance. |
| F-2 | accepted | Scope fit was explicit and matched the diff: all three findings share classifier/resolver/emitter/CLI/JS guide surfaces. No sibling book or writers-guide repo files were edited. |
| F-3 | accepted | Inline `(export (...))` wrappers remain accepted as 0.6.0 compatibility syntax; `(exports ...)` is now the preferred module-local teaching surface. |
| F-4 | reproduced | `./bin/lykn check` and `compile` on `test/surface/language-surface-runway_test.lykn` passed; compile emitted `export {roleLabel, normalizeRecord};`. Rust tests cover missing, duplicate, and nested export diagnostics. |
| F-5 | accepted | SKILL/guides and the closing report distinguish module-local `(exports ...)` from `mod.lykn` package/barrel re-exports. |
| F-6 | accepted | Closing report records grouped `bind` as sequential, with untyped pairs, typed atom pairs, destructuring for untyped pairs, duplicate diagnostics, and existing shadowing behavior. |
| F-7 | reproduced | Rust resolver/compile tests and JS form tests passed; fixture runtime proved earlier grouped names are visible to later initializers. |
| F-8 | accepted | `cond` syntax and semantics are settled: ordered two-item clauses, optional final `:else`, statement no-value behavior, and relation to `?`, `if`, and `match`. |
| F-9 | reproduced | Rust check/compile reject expression-position no-else `cond`; positive `cond` fixture checks, compiles, tests, and runs. |
| F-10 | accepted | Statement-position no-else `cond` is covered in Rust classifier/emitter behavior and documented as producing no value if no predicate matches. |
| F-11 | reproduced | `make test-docs` passed with 482 doctest blocks after the guide/SKILL updates. |
| F-12 | reproduced | Standing release-worktree gates listed below passed. |

## Commands Reproduced

```text
git status --short
clean

cargo fmt --check
passed

cargo test -p lykn-lang
passed; 1115 unit tests, 72 integration tests, and 1 doctest passed

cargo test -p lykn-cli
passed; 264 unit tests, 30 integration tests, and 0 doctests passed

./bin/lykn build
passed; rebuilt @lykn/lang, @lykn/browser, and @lykn/testing

deno test --config project.json -A test/forms/export.test.js test/forms/language-surface-runway.test.js
12 passed / 0 failed

./bin/lykn check test/surface/language-surface-runway_test.lykn
passed; 6 top-level expressions checked

./bin/lykn compile test/surface/language-surface-runway_test.lykn
passed; emitted grouped const bindings, cond IIFEs, and export {roleLabel, normalizeRecord}

./bin/lykn test test/surface/language-surface-runway_test.lykn
2 passed / 0 failed

./bin/lykn run test/surface/language-surface-runway_test.lykn
passed

git diff --check
passed

make test-docs
482 passed / 0 failed

make check-cited-paths
passed; 619 documents on release/0.6.x; 601 historical citations accepted
```

## Bubble-Up

slice04 closes the accepted implementation-first language-surface work before
book prose starts:

- `D-2608-XPRT`: `(exports ...)` is the preferred module-local named export
  declaration; inline export wrappers remain compatibility syntax; `mod.lykn`
  remains the package/barrel re-export layer.
- `D-2608-LBND`: grouped sequential `bind` is available for related
  normalization and validation locals.
- `D-2608-COND`: `cond` is available for ordered predicate/result branching,
  with `:else` required when a value is needed.

This removes the language-surface implementation blocker from arc16. The next
arc16 slices should begin reconciling book/writers-guide instructions and the
book fence verification runway against the now-shipped 0.6.0 surface.
