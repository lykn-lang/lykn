# Preserve actual compiler diagnostics in the kernel JSON check

S17 refinement 01 of five. Same Luna 6 High CC and independent
Sol 6.1 High CDC, standard Autonomous Mode. Read [initial](cc-prompt.md)
and exact unchanged [fixtures](artifacts/fixtures.md).

Exact test-only base `a42ca3003e3aa0087a9f017d8e403ef5467eadaf`,
tree `addfabd7a10b361a3db105a4e6bf414e1160d148`. No executable
gate ran on this freeze. The newly added native kernel JSON
test asserts compiler stderr is empty. Original oracle requires
parsed ordinary kernel JSON with successful compile and exact
strict runtime stderr. The actual analyzer registers parameters
and can report ordinary unused binding warnings for F1/F2,
including earlier/later parameters. The actual compile JSON
route retains those warnings on compiler stderr.

Edit only `crates/lykn-cli/tests/semantic_roles.rs`. Remove only
the `kernel_json.stderr.is_empty()` assertion and its assertion
message. Keep actual `execute_recorded` output, successful
status, parsed nonempty module array and every strict runtime
and negative predicate. No input, output oracle or other path
changes. Use prepared `/private/tmp/lykn-s17-cdc.lAFdsMI8/correction01-message.txt`
with normal exact-path `git commit --only -F`. Return clean
immutable source for independent static release before original
baseline. Record 01/5 used and preserve actual previous freeze.
No production writes before baseline reconciliation.
