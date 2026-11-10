# Preserve the actual public protected compile output observation

Retain exact test-only `7768e003` and its valid old behavioral proof.
The public F4 harness stored its result in `output` but omitted that
value from its preassert observation. Add the actual `output` field to
the existing observation and require it equals null in the same F4
assertions. No input, expected error, native test or population change.
This is one local public test refinement 02 of five, with exact
`correction02-message.txt`. No old-source replay is needed. Then
implement the already issued three-file product recipe and return
both immutable revisions before current validation.
