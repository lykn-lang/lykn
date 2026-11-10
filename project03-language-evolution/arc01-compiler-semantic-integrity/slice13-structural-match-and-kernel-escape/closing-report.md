# S13 closed — structural match and nested kernel escape

Accepted 2026-11-10 on clean task `31893710bbba8999e936fade2d79ae6f6aee929c`.
All five [MK criteria](ledger.md) are done after the actual
Luna 6 High CC handoff and separate Sol 6.1 High CDC
[verification](cdc-verification.md).

NE-C16 corrects public match binding discovery and preserves
actual reserved diagnostics and ordinary bound calls. NE-C17
checks nested native escapes through the existing allowlist and
preserves executable and structural object slots. The two exact
original S12 witnesses pass. Independent native 22/22, private
2/2, public six tests with 20 steps, unfiltered Make, citations
and materialized mirror checks pass.

Three source refinements were used. Earlier reds, the first
failed Rust build, the separate CC pinned native replay and the
excluded Python authoring command are preserved with their actual
scope. See the [CDC retrospective](cdc-retrospective.md).
Release stays at `7b17a784`. Wider completion and diagnostic
work retain their existing owners.
