# Slice20 retrospective — 2026-11-07

Exact-tree integration worked as intended: the approved seven-path stack moved
by normal FF with history intact, then actual release builds and separate fresh
review established the same source/runtime contracts in its delivery home.
Release hashes differed from the task binary, as expected possible; actual
post-build pins prevented ancestry from being mistaken for executable provenance.
No source repair, extra matrix or walker re-entry was needed.

Record timing was less reliable than behavior. CC sent its readback before FF
but wrote durable intake afterward and omitted the separate full-Make prelaunch
environment file. Its initial version probe used workspace cwd, not release cwd;
the source-specific toolchain was rechecked before build. These limits are
explicit and retained. CDC used prospective release command records/streams and
independently reran source gates; later success does not retroactively make CC
capture compliant. Future prompts should apply existing actual-cwd/first-launch
record rules immediately, not add a new wrapper or validator to enforce them.

The public API discussion proceeded without delaying unrelated integration.
Operator's breaking0.6 boundary and Result-family choice now permit S02 design
to favor correct compiler outcomes over a legacy shim. It does not decide
language semantics by Rust convenience: source validity, typed representation,
runtime guards and compilation failures remain distinct. S02 must finish its
actual public form/context/failure-lifecycle and source-span design before code;
S03/S04 and guide/book/human review retain their separate roles.

All integration rows are done; no new arc unit is required. Conditional advance
is S02 under its actual engineering contract, not automatic permission for a
rewrite, new public removals, tool/K/corpus work, source propagation or external
delivery. Original histories, eight spent tooling passes and other gates remain.
