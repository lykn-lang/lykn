# arc15 · slice05 — Closing Report

Closed 2026-08-08 by CDC after operator approval to add the fast-follow slice
for the `fn` mismatch.

## Result

`D-2608-H7FN` is closed for the scoped defect: nested bare-parameter
`fn`/`lambda`/`genfn` forms are rejected by the Rust compile and check paths
before raw S-expression fallback can emit bad JavaScript.

The implementation adds `validate_nested_fn_params` in
`crates/lykn-lang/src/classifier/forms.rs`, exports it through the classifier
module, and runs it in `crates/lykn-cli/src/compile.rs` after resolver tagging
and the existing method-call validator. The validator uses `as_form_head()`, so
a lexically bound value named `fn` remains a value call under DD-61.

## Per-Row Walk

| Row | Verdict | Evidence |
|-----|---------|----------|
| S5-1 | done | Pre-fix probes reproduced the mismatch: JS rejected `(bind f (fn (x) x))`; Rust emitted `const f = fn(x(), x);`. |
| S5-2 | done | `cargo test -p lykn-lang nested_fn -- --nocapture` -> 4 passed / 0 failed. |
| S5-3 | done | `cargo test -p lykn-cli nested_bare_parameter_fn -- --nocapture` -> 2 passed / 0 failed; `cargo test -p lykn-cli fn_head -- --nocapture` -> 1 passed / 0 failed. |
| S5-4 | done | `deno test --config project.json -A test/forms/arc15-fn-param-validation.test.js` -> 1 passed / 0 failed. |
| S5-5 | done | `D-2608-H7FN` is closed in `docs/backlog/discoveries.md`; arc/project/status docs name slice05 as closed and arc15 close as next. |
| S5-6 | done | `make test` green; final lint/cited-path/diff/post-commit evidence is recorded in `cdc-verification.md`. |

## Boundary

This is a narrow parameter-list guard, not the full `emit_expr -> Result`
rewrite. The older documented labelled-form arity residual
`(label fn (block (fn 987)))` remains intentionally pinned by
`test/expander/conformance-corpus.test.js`. A focused validator regression
keeps slice05 from silently changing that separately dispositioned matrix cell.

## Bubble-Up

- `D-2608-H7FN` closes here.
- arc15 is now ready for arc-close reproduction: slices 01, 02, 04, and 05 are
  closed; slice03 remains deferred to 0.7.0.
- The remaining project sequence is arc15 close, then arc07 + arc16, then arc09.
