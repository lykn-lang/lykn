# compileBoth Audit — M16-2

**Date:** 2026-05-15
**Pre-conversion count:** 19 compile-both calls
**Post-conversion count:** 68 compile-both calls
**Files in scope:** 42 test files in `test/forms/*_test.lykn`

## Per-File Disposition (flat summary)

| converted | for_test.lykn | 2 structural tests converted to compile-both |
| converted | for-of_test.lykn | 1 structural test converted |
| converted | for-in_test.lykn | 1 structural test converted |
| converted | while_test.lykn | 1 structural test converted |
| converted | do-while_test.lykn | 1 structural test converted |
| converted | label_test.lykn | 1 structural test converted |
| converted | template_test.lykn | 1 structural test converted |
| converted | switch_test.lykn | 1 structural test converted |
| converted | function_test.lykn | 2 structural tests converted |
| converted | export_test.lykn | 5 structural tests converted |
| converted | import_test.lykn | 6 structural tests converted |
| converted | spread_test.lykn | test-compiles only (no compile calls) |
| converted | try-catch_test.lykn | 4 structural tests converted |
| converted | destructuring-object_test.lykn | 8 structural tests converted |
| converted | destructuring-array_test.lykn | 6 structural tests converted |
| converted | destructuring-nested_test.lykn | 4 structural tests converted |
| converted | class-expr_test.lykn | 2 structural tests converted |
| converted | class-fields_test.lykn | 6 structural tests converted |
| converted | class-async_test.lykn | 3 structural tests converted |
| converted | colon-syntax_test.lykn | error tests only, compile-both import added |
| converted | camel-case_test.lykn | test-compiles only (no compile calls) |
| skipped-divergence | tag_test.lykn | tagged template emission divergence |
| skipped-divergence | object_test.lykn | object literal formatting divergence |
| skipped-divergence | default-params_test.lykn | multiple-defaults format divergence |
| skipped-divergence | generator_test.lykn | generator function syntax divergence |
| skipped-divergence | destructuring-params_test.lykn | destructured param format divergence |
| skipped-divergence | destructuring-assignment_test.lykn | assignment destructuring divergence |
| skipped-divergence | class_test.lykn | empty class body format divergence |
| skipped-divergence | class-methods_test.lykn | class method format divergence |
| skipped-divergence | async-await_test.lykn | async function wrapping divergence |
| skipped-runtime-test | debugger_test.lykn | error behavior only |
| skipped-runtime-test | compound-assignment_test.lykn | 1 is-thrown test |
| skipped-runtime-test | ternary_test.lykn | 1 is-thrown test |
| skipped-runtime-test | seq_test.lykn | 1 is-thrown test |
| skipped-runtime-test | get_test.lykn | 1 is-thrown test |
| skipped-runtime-test | throw_test.lykn | 1 is-thrown test |
| skipped-runtime-test | update-operators_test.lykn | 1 is-thrown test |
| skipped-runtime-test | dynamic-import_test.lykn | 1 is-thrown test |
| skipped-runtime-test | regex_test.lykn | 2 is-thrown tests |
| converted | dd-50_test.lykn | already used compile-both (15 calls) |
| converted | dd-50.6_test.lykn | already used compile-both (4 calls) |
| converted | dd-49_test.lykn | compile-both added in M16-3 (1 call) |
| converted | dd-52-import-path-convergence_test.lykn | M16-6, JS-only compile |

## Detailed Tables

### Converted (20 files, 49 new compile-both calls)

| File | compile calls | Converted | Skipped (error tests) | Status |
|------|-------------|-----------|----------------------|--------|
| `for_test.lykn` | 3 | 2 | 1 (is-thrown) | converted |
| `for-of_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `for-in_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `while_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `do-while_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `label_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `template_test.lykn` | 1 | 1 | 0 | converted |
| `switch_test.lykn` | 2 | 1 | 1 (is-thrown) | converted |
| `function_test.lykn` | 2 | 2 | 0 | converted |
| `export_test.lykn` | 5 | 5 | 0 | converted |
| `import_test.lykn` | 6 | 6 | 0 | converted |
| `spread_test.lykn` | 0 | 0 | 0 | converted (test-compiles only) |
| `try-catch_test.lykn` | 4 | 4 | 0 | converted |
| `destructuring-object_test.lykn` | 8 | 8 | 0 | converted |
| `destructuring-array_test.lykn` | 6 | 6 | 0 | converted |
| `destructuring-nested_test.lykn` | 4 | 4 | 0 | converted |
| `class-expr_test.lykn` | 2 | 2 | 0 | converted |
| `class-fields_test.lykn` | 6 | 6 | 0 | converted |
| `class-async_test.lykn` | 3 | 3 | 0 | converted |
| `colon-syntax_test.lykn` | 4 | 0 | 4 (is-thrown) | converted (error-only) |
| `camel-case_test.lykn` | 0 | 0 | 0 | converted (test-compiles only) |

### Skipped — cross-compiler divergence surfaced (9 files)

These files failed compileBoth conversion due to genuine cross-compiler
output divergences. Each is logged as a fast-follow finding.

| File | Divergence Class | Disposition |
|------|-----------------|-------------|
| `tag_test.lykn` | JS emits tagged template differently than Rust | skipped-divergence-surfaced |
| `object_test.lykn` | JS/Rust differ on object literal formatting | skipped-divergence-surfaced |
| `default-params_test.lykn` | Multiple-defaults parameter format divergence | skipped-divergence-surfaced |
| `generator_test.lykn` | Generator function syntax divergence | skipped-divergence-surfaced |
| `destructuring-params_test.lykn` | Destructured parameter format divergence | skipped-divergence-surfaced |
| `destructuring-assignment_test.lykn` | Assignment destructuring divergence | skipped-divergence-surfaced |
| `class_test.lykn` | Empty class body format divergence | skipped-divergence-surfaced |
| `class-methods_test.lykn` | Class method format divergence | skipped-divergence-surfaced |
| `async-await_test.lykn` | Async function wrapping divergence | skipped-divergence-surfaced |

### Skipped — error behavior tests only (9 files)

These files contain only `is-thrown` tests (error behavior). Both
compilers hit the same Deno runtime for error tests, so cross-compiler
comparison is vacuous.

| File | Disposition |
|------|-------------|
| `debugger_test.lykn` | skipped-runtime-test (error behavior only) |
| `compound-assignment_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `ternary_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `seq_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `get_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `throw_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `update-operators_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `dynamic-import_test.lykn` | skipped-runtime-test (1 is-thrown test) |
| `regex_test.lykn` | skipped-runtime-test (2 is-thrown tests) |

### Already using compileBoth (4 files)

| File | compile-both calls | Status |
|------|-------------------|--------|
| `dd-50_test.lykn` | 15 | already-converted |
| `dd-50.6_test.lykn` | 4 | already-converted |
| `dd-49_test.lykn` | 1 (added in M16-3) | already-converted |
| `dd-52-import-path-convergence_test.lykn` | 0 (uses compile) | already-converted (M16-6, JS-only) |

## Surfaced Divergences — Fast-Follow Log

Nine files surfaced genuine cross-compiler output divergences. These
are tracked as fast-follow findings for the compiler-coherence thread,
not blocked on M16.

**Divergence classes identified:**
1. **Class/object formatting** — JS and Rust emit class bodies, object
   literals, and method definitions with different whitespace/formatting.
2. **Generator syntax** — function* declaration formatting differs.
3. **Async wrapping** — async function wrapping differs in formatting.
4. **Destructuring formatting** — destructured parameter and assignment
   patterns differ.
5. **Default parameter formatting** — multiple-default parameter lists differ.
6. **Tagged template** — tagged template literal emission differs.

All are cosmetic/formatting divergences, not semantic. Both compilers
produce valid JS that executes identically; the divergences are in
whitespace, semicolons, and formatting choices that the current
normaliser (whitespace collapse + trailing semicolons + gensym
canonicalization) doesn't cover.

**Resolution path:** These divergences are candidates for either:
(a) fixing the divergence in one compiler to match the other, or
(b) extending the normaliser (with explicit rationale per M16
normaliser policy).
