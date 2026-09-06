# Slice 01: dd58-strict-default — Ledger

Completes DD-58: strict enforcement default-on for `.lykn` compilation. **Lands;
breaking; repo-wide migration.** Rebuild-first verify. TDD where the compiler
change fits. Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | **Enforcement point located** — the exact place `lykn compile`/`build`/doctests compile `.lykn`, where `classify_form_strict` must wire in; `.lyk` exemption preserved | written trace in the closing report (Rust `compile_source` path; JS-path status) | serious | slice-doc | open | | build on CC's anti-patterns trace; `classifier.js` has no strict concept today |
| F-2 | **Strict default-on for `.lykn`** — bare kernel-only (`function`/`function*`/`const`/`let`/`var`) → `classify_form_strict` diagnostic; `.lyk` exempt | compile a `.lykn` with `(var x 1)` → error; same in a `.lyk` → OK | serious | anti-patterns finding | open | | no silent blanket bypass; `kernel:` escape resolves |
| F-3 | **Migration audit** — every bare **kernel-only declaration form** (`const`/`let`/`var`/`function`/`function*`) in surface `.lykn`/guide-doctests enumerated + classified (convert / kernel:-escape / compile-fail / exempt) | a table in the closing report; count reconciles with the repo grep (~57 `const`, ~21 `let`, ~14 `function`, ~7 `function*` across ~29 files; classify doc/comment false-positives) | serious | slice-doc | open | | operators (`===`/`&&`/`==`) are legal surface — **not** in scope; repo-only |
| F-4 | **Migration applied (repo-only)** — real surface code → surface forms (`bind`/`fn`); doc examples of the 5 kernel forms → `kernel:` or `compile-fail`; `.lyk` untouched | `grep` shows no bare `const`/`let`/`var`/`function`/`function*` left in runnable surface `.lykn`/doctests | serious | slice-doc | open | | esp. guides 00/01/09 |
| F-5 | **A-3 composition demo (5 forms only)** — bare `const`/`let`/`var`/`function`/`function*` in `.lykn` error; `kernel:` escape resolves each | compile each of the 5 → error; `(kernel:var …)` (etc.) → compiles | serious | arc10 A-3 | open | | **the other anti-pattern "leaks" (`==`,`this`,`arguments`,`require`,IIFE) are NOT DD-58 violations — routed to arc05 (lint), not this slice** |
| F-6 | **rebuild-first full suite + doctests green** | `make check` green; `make test-docs` 0 failed; `.lyk` kernel tests pass (exempt) | serious | slice02 F-7 lesson | open | | lands — must be green |
| F-7 | no regressions | `cargo test` 0 failed; `clippy -D warnings` exit 0; `lykn test` 0 failed; `deno test test/` 0 failed | serious | slice-doc | open | | |
| F-8 | guide-09 kernel-form framing corrected + enforced | the guide-09 examples of the **5 kernel-only forms** are `compile-fail`/`kernel:`-escaped; ID-38's claim that `===`/`&&`/`==` are anti-patterns is corrected to "legal surface passthrough, non-idiomatic (a lint preference), not eliminated" | correctness | anti-patterns finding | open | | only the 5 declaration forms are compiler-enforced; the rest is arc05/arc07 |

## What Worked

_(At slice close.)_

## Closure

Closed 2026-06-30 (commit `faee8a1`). Verified by: CC (attested) + CDC
(`cdc-verification.md`: git/code-verified the Rust strict wiring + guide migration;
runtime attested). Rows: 8. Done: 8 (F-8 as `skip` pending JS parity). Deferred: 0.
No-op: 0. **Major bubble-up:** JS compiler lacks DD-58 strict + `kernel:` escape →
routed to arc10 slice02 (js-dd58-parity).

> Breaking change — the migration (F-3/F-4) is the bulk. Surface design calls
> (does `check` go strict; any `--no-strict`) go in the closing report, not
> decided silently. **Downstream (mycelium) migration is a filed follow-up, not
> this slice.**
