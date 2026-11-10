# Format the native S22 assertions

Normal Make on `23f2bf00` passed its release build and Clippy,
then stopped on Rust formatting in the native semantic role test.
Keep the actual run in `/private/tmp/lykn-s22-current-23f2bf00/full-make`.

Apply only the actual formatting to
`crates/lykn-cli/tests/semantic_roles.rs`. Preserve the exact fixture
bytes, predicates, messages, emitted shapes and all other files.
Before claiming readiness, run the same complete workspace Rust
format check with a separate prospective receipt. Then freeze with
the supplied `correction03-message.txt` and return exact clean
identity and raw body. This is the third issued refinement in
addition to the preserved provisional native-oracle attempt.

After static release, complete the unfiltered Make and cited-path
gates with fresh receipts, then hand source ownership back.
