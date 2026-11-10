# Borrow generated module bytes in the two native preservation checks

S19 refinement 02 of five, same standard Autonomous Mode and
actors. Exact test-only `5e5c2c6af341ec0878d0c31a67599f9f50312273`,
tree `17ab78ad91d28aefc07208b7fe6828b18a0bad0a`. Public
baseline reached all 13 tests and 37 steps with exactly the
expected F1/F3 reds. Native no-run exits 101 with E0382 because
the first pure-call assertion moves the optional module bytes
before the second check borrows them. No native behavior ran.

Edit only `crates/lykn-cli/tests/semantic_roles.rs`. In the two
existing pure-call branches borrow the optional byte slice via
`generated.as_deref().expect(...)` and decode with
`std::str::from_utf8` rather than consuming the Vec. Keep both
branch-specific messages and every predicate, expected trace,
source and population. Rust format owned. Normal exact path-only
commit using `/private/tmp/lykn-s19-cdc.OPnp9nfQ/correction02-message.txt`, actual body and
clean tree readback. Return for separate static release before
the original unrun native old baseline. Keep the passing/redded
public observations attributed to 5e5c2c6, no public replay needed
before product.
