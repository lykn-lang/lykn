# Preparation results; runtime boundary not delivered

One immutable locked Lykn build reproduced the expected CLI hash. A pre-upgrade
Lykn transport-list invocation completed, emitting 188 exact published-file URLs.
Those files were retrieved without importing/evaluating them. The operator's
subsequent eval route successfully ran the compiled minimal program. Native Lykn
tooling then generated 47 candidate rows (three checks) and verified all 188
published sizes/hashes (376 checks). Full graph/lineage work remains owed.

After Deno changed from 2.7.7 to 2.9.6, the freeze invocation failed before its
body. Two fresh minimal no-import launches and two operator-requested explicit
`--allow-all` launches all failed before the program marker, exit 1. These five
failed launch invocations are diagnostics/preparation, **not five format trials**.
The fake-child recorder separately captured argv with NUL boundaries.

Zero frozen matrix attempts, zero resource measurements, zero supervisor stop
controls, zero package runtime evaluations, zero permission-denial observations,
zero file/concurrency/cancellation trials are claimed. The 379 generation/static
checks are separate from experiments and packet integrity checks.
Check/lint/compile success is recorded separately from emitted validity
and runtime execution. All eight DB ledger criteria remain open.

See baseline-and-protocol.md for the tested minimal replay, raw-transcript.txt
for the lossless evidence packet, and authoring-observations.md for failed drafts.

The final packet preserves 460 files, totaling 3,007,950 original bytes.
Native packing passed 1,380 checks; fresh extraction passed 2,301 checks.
Its SHA-256 is `bef1eb72d43e13edc1491e87d481d88c12c79b4bca392b2711f263126a51c60d`.
From that fresh extraction, published-file verification passed all 376 checks
and candidate generation passed three checks. All six regenerated outputs
(inputs.json, project.json, deno.lock, dependency-graph.json, package.lykn and
case-manifest.md) match the original trial bytes. This is captured-evidence
replay by CC, not independent CDC or runtime validation.

The planning audit passed 39 checks across 28 authorized paths and 109 local
links, including exact preservation of the eight original DB criterion rows
and the six new open LC rows. Packet integrity counts remain separate from
generation, package-byte and planning checks. The packet includes earlier
pack/extract/replay receipts; final totals are recorded here to avoid recursive
self-inclusion of the final packet and its own completion receipts.
