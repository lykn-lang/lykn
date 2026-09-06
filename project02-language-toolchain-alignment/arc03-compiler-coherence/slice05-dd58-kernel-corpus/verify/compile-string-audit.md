# Compile-String Audit — M20-8

**Date:** 2026-05-17
**Scope:** All `(compile "...")` / `(compile-both "...")` / `(compile-kernel "...")`
string arguments containing kernel-only forms in test/forms/ and test/surface/.

## Summary

47 total occurrences of kernel-only forms inside compile strings.

| Form | Count | Files | Disposition |
|------|-------|-------|-------------|
| `const` | ~30 | destructuring-*, class-expr, default-params, async-await, dd-50.6 | keep-runtime-only |
| `let` | ~6 | dd-50, dd-50.6 | keep-runtime-only |
| `function` | ~8 | async-await, default-params, destructuring-params | keep-runtime-only |
| `var` | 0 | — | — |
| `function*` | 0 | — | — |
| `quote` | 0 | — | — |
| `quasiquote` | 0 | — | — |

## Disposition Rationale

**All occurrences: `keep-runtime-only`.**

These compile strings test the kernel codegen path — they exercise how
the kernel compiler handles `const`, `let`, `function` etc. They're
compiled at runtime by the `compile`/`compile-kernel`/`compile-both`
helper function, which bypasses the strict classifier (the strings are
literal data in the test source, not classified forms).

The runtime-compile pattern is a DIFFERENT coverage layer from the
source-level `.lyk` tests M20-5/M20-6 added. Both layers are valuable:
- Source-level `.lyk` tests verify the kernel classifier accepts forms
- Runtime-compile tests verify the kernel codegen produces correct JS

No occurrences warranted `keep-and-supplement` or `migrate-to-source`
disposition. The source-level coverage (M20-5/M20-6) already covers
the kernel-only forms; the runtime-compile strings test codegen, not
classification.
