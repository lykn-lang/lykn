# Register the native anonymous name regression

Same S20 scope, Luna 6 High CC with separate Sol 6.1 High CDC in
standard Autonomous Mode. Retain the test-only freeze `5daf1fe5`.
The fixture array gained entry 37, but the native test file uses explicit
test functions. No test invocation has started, and the prior native
population would still run 45. Add the actual `#[test]` function
`private_storage_preserves_anonymous_value_names` calling
`run_positive(&FIXTURES[37])` next to the existing computed-call
controls. Change only that registration in `semantic_roles.rs`.
Use exact supplied `correction01-message.txt` and return the new
immutable test freeze before old focus. S20 refinement 01 of five.
