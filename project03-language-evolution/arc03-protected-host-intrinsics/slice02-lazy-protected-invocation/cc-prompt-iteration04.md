# S02 refinement 04 — own the native temporary evidence directory

At immutable `c3035f7634413f3eba430a7d54c6f2e8393525ae` the bounded
focused assertion fixes are present and fixture inputs are unchanged.
Before validation, replace the new native test's predictable PID
directory and recursive RemoveOnDrop with the existing dev dependency
`tempfile::TempDir`. Keep the owner alive through the whole test.
Explicit evidence directories stay retained. Restrict source changes
to `crates/lykn-lang/src/codegen/mod.rs`. No new runtime, dependency,
test/oracle change or broader review. Preserve c3035 and all prior raw.

Use exact normal -F `/private/tmp/lykn-s02-cdc.gadeVma9/s02-refinement04-source-message.txt`.
Return the clean immutable successor. The original focused, four-case,
full normal and independent gates are unchanged. HI-05 stays held.
