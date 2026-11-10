# Invoke all four native S16 fixtures

S16 refinement 01 of five, standard Autonomous Mode, same Luna
6 High CC and independent Sol 6.1 High CDC. Read [original](cc-prompt.md).
Clean test-only base `964af49aaea6ec6a67775ef6106ecc083403365d`,
tree `d31a8478a25663c1703fcc24686f9de9253cbf88`.
The first static read missed that native tests are individually
registered. The fixture array grew to 33, but the last
`run_positive` still selects index 28. There were zero executions
before CC found it in prelaunch route review. Preserve that freeze.

In `crates/lykn-cli/tests/semantic_roles.rs` only, after the
existing native typed bind positive and before the negative tests,
add four ordinary `#[test]` wrappers using the existing runner:

```rust
#[test]
fn completion_if_headers_preserve_source_returns() {
    run_positive(&FIXTURES[29]);
}

#[test]
fn completion_match_headers_preserve_candidate_scope_and_source_returns() {
    run_positive(&FIXTURES[30]);
}

#[test]
fn completion_logical_operands_preserve_lazy_source_returns() {
    run_positive(&FIXTURES[31]);
}

#[test]
fn completion_nullish_operands_preserve_values_and_source_returns() {
    run_positive(&FIXTURES[32]);
}
```

Exact fixtures, expected bytes, previous tests and public runner
stay unchanged. Use prepared `/private/tmp/lykn-s16-cdc.B22ECt81/correction01-message.txt`
with ordinary exact-path `git commit --only -F`. Return source/tree,
actual delta and clean status for separate static release. Then
original prospective baseline 35 native and 32 shared public
steps plus seven standalone controls. No earlier run is claimed.
Production stays held until old baseline reconciliation.
