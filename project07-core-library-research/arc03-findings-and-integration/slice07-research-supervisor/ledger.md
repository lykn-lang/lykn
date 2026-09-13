# Slice07 ledger

Six criteria remain open for independent CDC. [CC handoff](closing-report.md)
attests proposed-done for all six after 33 primary attempts, five negative
controls and full fresh/captured replay. Six failed conditions are retained
under the operator's eight-failure maximum. Original row text below is unchanged.
Slice04's eight DB criteria and four inherited source failures remain separate.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SH-01 | Exact native baseline and bounded manifest are frozen | Source/CLI/Deno hashes, matching native config/lock, all control IDs, grants, budgets and repetitions before execution | correctness-grade | Slice04 DB-01/08 preparation | open | — | Package graph and DB matrix remain Slice04 |
| SH-02 | External stops and cleanup are observable and bounded | Wall/output/RSS, early precompile stop, nested-child/parent-exit control, identity validation and no owned survivors | correctness-grade | RP01; supervisor review | open | — | Observation failure must not orphan children |
| SH-03 | Native permissions reflect actual requested authority | Minimal/parser no-grant success, allowed/denied file operations, env/net/run NotCapable, exact parent/child argv and unchanged locks | correctness-grade | DB-04 preparation | open | — | No implicit all-permissions route |
| SH-04 | Observer and cancellation evidence checks actual bytes and windows | Partial control, reader/one-writer/two-writer checkpoints, both cancellation stages, live before/aftermath files and modes | correctness-grade | DB-05 preparation | open | — | No universal atomicity, conflict-policy or durability claim |
| SH-05 | Audit rejects invalid evidence and gates markers semantically | Labeled negative copies fail for missing samples, bad bytes/denials, survivors and lock mismatch; original live evidence preserved | correctness-grade | Source-review marker gap | open | — | Exit zero alone is insufficient |
| SH-06 | Source, corrections, live replay and captured evidence reproduce | Check/lint/compile/emitted review, lossless packet, fresh replay, retained replay, exact denominators and complete Slice04 ownership handoff | correctness-grade | Expedited Mode; re-slicing | open | — | Independent CDC; preserve four prior source failures and separate config error |
