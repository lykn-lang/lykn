# CC Prompt — arc15 slice05: Nested `fn` Parameter Validation

You are landing `arc15-surface-syntax-traps/slice05-nested-fn-param-validation`
on `release/0.6.x`.

## Context

Slice04 closed the silent sibling traps and opened `D-2608-H7FN`: JS rejects
`(fn (x) x)` with a typed-parameter diagnostic, but Rust currently lets the
nested form fall through to raw emission and produces bad JavaScript like
`fn(x(), x)`.

The likely root cause is `emit_expr`: nested surface forms are classified during
emission, but a nested classification error is swallowed and the raw S-expression
is returned. Do not broaden this slice into a whole `emit_expr -> Result` rewrite.
Instead, add a narrow recursive validator in the resolved pre-classification
pipeline slot, alongside `validate_method_calls`.

## Required Work

1. Add Rust validation for nested `fn`, `lambda`, and `genfn` parameter lists.
2. Wire it into both `check_strict` and `compile_source_inner` after resolver
   tagging and before top-level classification/emission.
3. Preserve DD-61: a lexically bound head named `fn` is a value call, not a
   surface form.
4. Add Rust tests for direct rejection, nested rejection, and bound-head
   non-rejection.
5. Add a Deno test pinning the JS rejection.
6. Close `D-2608-H7FN` and update arc/project/status planning text.

## Verification

Run focused tests first, then the full gate:

```sh
cargo test -p lykn-lang nested_fn -- --nocapture
cargo test -p lykn-cli nested_bare_parameter_fn -- --nocapture
deno test --config project.json -A test/forms/arc15-fn-param-validation.test.js
make lint
make test
git diff --check
make check
```

`make check-cited-paths` is expected to be red before the commit if new tracked
docs cite each other; it must be green after commit.
