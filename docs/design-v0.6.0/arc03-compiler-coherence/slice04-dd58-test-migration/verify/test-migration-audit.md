# Test Migration Audit — M19-2

**Date:** 2026-05-17
**Scope:** All `.lykn` test files in `test/forms/` and `test/surface/`

## Key Finding

**Zero bare kernel-only forms exist at the test-file source level.**

All kernel-only forms (`const`, `let`, `var`, `function`, `function*`,
`quote`, `quasiquote`) in the test corpus are inside `(compile "...")`
or `(compile-both "...")` string arguments — runtime-compiled by the
JS helper function, not classified by the outer compiler at test-file
compilation time.

When strict mode is turned ON for test-file compilation (M19-4), all
existing tests should pass immediately with zero migrations needed.

## Detailed Inventory

### Top-level forms in test files

| Form | Occurrences at top level | Migration needed |
|------|-------------------------|-----------------|
| `const` | 0 | none |
| `let` | 0 | none |
| `var` | 0 | none |
| `function` | 0 | none |
| `function*` | 0 | none |
| `quote` | 0 | none |
| `quasiquote` | 0 | none |

### Nested forms outside strings in test files

| Form | Occurrences nested (non-string) | Migration needed |
|------|-------------------------------|-----------------|
| all kernel-only forms | 0 | none |

### Forms inside compile strings (NOT subject to strict-mode migration)

These are test inputs compiled at runtime by the `compile`/`compile-kernel`
helper. The strict classifier does not operate on them (they're string
literals in the test source). They're documented here for completeness:

| Form | Approx. count | Context |
|------|--------------|---------|
| `(const ...)` | ~10 | Test inputs for const-declaration tests |
| `(let ...)` | ~6 | Test inputs for let-declaration tests |
| `(function ...)` | ~4 | Test inputs for function-declaration tests |

These are correctly tested via `compile-kernel` (kernel-only compiler
path). They test the kernel codegen, not surface classification.

## Migration Prescription

**No migrations required for M19-3.** All test files are already
strict-mode-compatible at the test-file compilation level.

M19-3 is a no-op for test content migration. The runner change (M19-4)
to turn on strict mode for test compilation is the only change needed.
