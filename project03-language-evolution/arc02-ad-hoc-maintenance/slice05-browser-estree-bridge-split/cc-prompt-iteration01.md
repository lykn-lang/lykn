# S05 iteration 01 — Correct the current cache path in M4

Continue under the Operator's existing S05 authorization in standard
Autonomous Mode. Luna 6 High CC retains source ownership. Sol 6.1 High
CDC independently verifies the next exact freeze. Source refinement
01 of 05. Preserve the original [assignment](cc-prompt.md), candidate
`1562e1d3` and all its actual evidence.

In `crates/lykn-cli/tests/macro_dependencies.rs` change only the
`owned_embedded_root` helper's format suffix from `-expander-split`
to `-compiler-split`. The S04 path seeded inside M4 stays
`-expander-split`. The original candidate accidentally makes both
paths the S04 sibling even though the executable correctly extracts
into the current S05 directory. Keep the exact config recovery,
old sibling preservation, artifact and runtime assertions.

Freeze the single test-line change with a normal exact-path commit.
Supply the unchanged commit-message body and both required trailers.
Run the actual focused M4 and all outstanding normal gates with the
original isolated tools, evidence and final clean handoff. Attribute
earlier product receipts to their original freeze. The independent
review will compare all production paths across the two freezes.
