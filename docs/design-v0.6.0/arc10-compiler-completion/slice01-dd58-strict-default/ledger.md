# Slice 01: dd58-strict-default — Ledger

Completes DD-58: strict enforcement default-on for `.lykn` compilation. **Lands;
breaking; repo-wide migration.** Rebuild-first verify. TDD where the compiler
change fits. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Enforcement point located** — the exact place `lykn compile`/`build`/doctests compile `.lykn`, where `classify_form_strict` must wire in; `.lyk` exemption preserved | written trace in the closing report (Rust `compile_source` path; JS-path status) | serious | slice-doc | open | | build on CC's anti-patterns trace; `classifier.js` has no strict concept today |
| F-2 | **Strict default-on for `.lykn`** — bare kernel-only (`function`/`function*`/`const`/`let`/`var`) → `classify_form_strict` diagnostic; `.lyk` exempt | compile a `.lykn` with `(var x 1)` → error; same in a `.lyk` → OK | serious | anti-patterns finding | open | | no silent blanket bypass; `kernel:` escape resolves |
| F-3 | **Migration audit** — every bare kernel-only form in surface `.lykn`/guide-doctests enumerated + classified (convert / kernel:-escape / compile-fail / exempt) | a table in the closing report; count reconciles with the repo grep (~9 var, ~57 const, ~35 ===/&&/function) | serious | slice-doc | open | | repo-only; downstream deferred |
| F-4 | **Migration applied (repo-only)** — real surface code → surface forms; doc/anti-pattern examples → `kernel:` or `compile-fail`; `.lyk` untouched | `grep` shows no bare kernel-only forms left in runnable surface `.lykn`/doctests | serious | slice-doc | open | | esp. guides 00/01/09 |
| F-5 | **A-3 composition demo** — the 10 anti-patterns-report leak snippets error in `.lykn`; `kernel:` escape resolves each | compile each of the 10 → error; `(kernel:var …)` (etc.) → compiles | serious | arc10 A-3 | open | | `var`, `==`, `function`-`this`, `arguments`, `require`, IIFE, `const`, `===`, `&&` |
| F-6 | **rebuild-first full suite + doctests green** | `make check` green; `make test-docs` 0 failed; `.lyk` kernel tests pass (exempt) | serious | slice02 F-7 lesson | open | | lands — must be green |
| F-7 | no regressions | `cargo test` 0 failed; `clippy -D warnings` exit 0; `lykn test` 0 failed; `deno test test/` 0 failed | serious | slice-doc | open | | |
| F-8 | guide "ELIMINATED" claims are now compiler-enforced | the guide-09 kernel-form anti-pattern examples are `compile-fail`/`kernel:`-escaped and the "eliminated by language design" claims hold under strict | correctness | anti-patterns finding | open | | advances the arc07 guide-09 reframe |

## What Worked

_(At slice close.)_

## Closure

Closed at commit <SHA> on <date>. Verified by: <name/session>.
Rows: 8. Done: _. Deferred: _. No-op: _.

> Breaking change — the migration (F-3/F-4) is the bulk. Surface design calls
> (does `check` go strict; any `--no-strict`) go in the closing report, not
> decided silently. **Downstream (mycelium) migration is a filed follow-up, not
> this slice.**
