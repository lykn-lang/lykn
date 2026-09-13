# CDC review — resumed preparation and supervisor split

2026-09-13. **Preparation and routing verified; Slice04 remains open.** Reviewed
CC commit `3b391f1` against its parent `ff08306`. The fourth source-authoring
failure and separate frozen-lock failure reproduce. The bounded
[Arc03/Slice07 prompt](../../arc03-findings-and-integration/slice07-research-supervisor/cc-prompt.md)
is ready for CC with the control clarifications below. All eight DB rows and
six SH rows remain open; this is neither research nor supervisor closure.

## Independent evidence

CDC reused the isolated release executable independently built and tested during
[launcher CDC](../../arc03-findings-and-integration/slice06-deno-launch-compatibility/cdc-verification.md),
then rehashed it and the installed runtime before this replay. No new source
build or repeated canonical source test suite is claimed in this planning review.

| Identity | SHA-256 |
| --- | --- |
| CLI from source 4dded883bbd321d19635e6fce233343f33803f9e | `d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326` |
| Deno 2.9.6 | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74` |
| CC resumed packet | `44d74cbd889a462cfeaa174057b2bbc075e037528f07c697a7e748443c46ef93` |
| Original Slice04 packet, unchanged | `bef1eb72d43e13edc1491e87d481d88c12c79b4bca392b2711f263126a51c60d` |

- Ran the literal captured-replay command in
  [resume-preparation.md](artifacts/resume-preparation.md) from a new native
  config/cache/HOME/TMPDIR root. Corrected restricted `lykn run` extracted
  **94 files with 471 byte/hash/path checks**, exit 0. The native version-5
  lock remained `e6f8e7f253a8e419d745ffca442817365cbfc1574c1a462e2f19bc2b5956a6cd`.
- Independently checked the first supervisor draft: exit 1, `unexpected ')' at
  230:10`. The corrected source differs by exactly one removed parenthesis in
  `compiledSha256`. This is the fourth retained source-authoring condition,
  not evidence of a compiler bug or runtime result.
- Re-ran check/lint/compile on retained cases, package and corrected supervisor:
  **nine gates passed**. All three emitted files match their retained bytes.
  Package source was compiled only; no imports were resolved or evaluated.
- Copied the mismatched native config/package lock and audit into separate
  scratch. Restricted frozen launch again failed with `lockfile is out of date`,
  before published-file auditing. The failed lock stayed byte-identical.
  No new 188-file package checksum verification is claimed.
- The 47-candidate input file is byte-identical to the original Slice04 file.
  The 30-path compiler interval list matches an independent Git diff. It is
  still an inventory, not a complete toolchain or package graph.
- Inspected the 16-path CC commit, both current ledgers, source/emitted supervisor
  control flow, worker orchestration and precursor configuration. Original CC
  packets/reports and earlier CDC records remain unchanged by this review.

Compiler unused-binding warnings remain in the raw streams. They are not
silently suppressed or a new claim that the existing guide/compiler findings
are resolved. No resumed supervisor, permission, concurrency, resource or DB
matrix ran in either CC's handoff or this CDC review. CC's host observation and
build receipts are retained attestation, not a fresh CDC process-cleanup proof.

## Why the bounded prerequisite is appropriate

The existing Slice04 plan explicitly requires re-slicing before the correction
budget is exhausted. Four source failures leave insufficient headroom for the
unverified supervisor plus the complete research matrix. The new unit delivers
native process supervision and semantic evidence checking; it does not transfer
DB criteria or reset Slice04's four-condition history. Its own corrections are
tracked separately under a bounded contract, with no permission to keep
renaming an unresolved loop.

Source review confirms the draft paths requiring verification. In the resumed
packet's `seed/supervisor.lykn`, `stop` can call kill with an empty target list;
`watch` can reject without a cleanup boundary; compiled-output hashing assumes
the file exists after an early stop; and harness/permission marker creation
checks outcomes before the still-owed semantic audit. These are source-review
risks, not reproduced runtime failures.

There is also a concrete parent-exit risk: `observed-status` sets `done` as soon
as the root exits, while `Promise:all` still waits for output collectors. A known
nested child can retain an inherited pipe beyond that exit; the watcher must
not stop enforcing the bound while draining waits. The retained worker code
also needs explicit parent run authority and independent native locks.

CDC clarified the existing SH-02/SH-06 obligations before execution:

- Five named external/failure controls: wall, output, RSS-before-compiled-output,
  nested-child/parent-exit cleanup, and injected observation failure after owned
  child registration. The parent-exit control retains an output pipe; the
  observation-failure control preserves the injected error and verifies cleanup
  through an independent working observation route.
- Bound process/error sample recording as well as child output. Preserve
  identity checks, empty-target handling, stream completion and explicit
  compiled-output absence. No stale PID authorizes termination.
- Pin the adaptation source hashes and require a newly frozen native SH
  manifest. The inherited candidate file's launcher-blocked status is historical.

All original SH criteria remain unchanged. These clarifications make the
existing failure/cleanup promises testable; they do not authorize package
execution, source repair, adoption, mounts or the full research matrix.

## Replay and packet

[CDC review packet](artifacts/cdc-resume-raw-transcript.txt) retains fresh gate
outputs, emitted files, failure streams, unchanged-lock receipts, source diff,
identity records, the original auditor and a native Lykn reconciliation audit.
The CC preparation packet remains a separate required input; it is not nested
again. Use the original Slice04 auditor in `extract` mode as documented in
resume-preparation.md, substituting this packet and a fresh destination.
Every record preserves relative path, byte count, SHA-256 and hex bytes.

CDC packet: **75 files, 120295 decoded bytes**, SHA-256
`b098710654aad434329ad33ab519a9c0192863fd97e9996b30c6257202375c6d`.
Packing passed 225 checks; fresh extraction passed **376 checks**. From that
extracted packet, the literal two-packet replay again passed **471 extraction
checks** and **55 reconciliation checks**, covering 15 scoped planning paths,
132 local links, 47 candidate IDs and the unchanged eight DB/six SH rows.

The packet's `meta/replay.md` supplies literal invocation details for the
original failure, corrected source gates, frozen-lock failure and native
reconciliation. These are bounded preparation replays. Do not run the draft
supervisor as a substitute for Arc03/Slice07's required implementation/preflight.

## Bubble-up and silent-drop check

Arc03/Slice07 is the next CC assignment; its six rows and A3-07 remain open.
After its independent closure, return to the entire Slice04 assignment on the
accepted 4dded88/Deno 2.9.6 condition. All eight DB rows remain byte-identical
and open, with four source failures and a separately retained config error.
All R-01–09, 47 candidate IDs and operational expansions, 36 unsupported Y-13
cells and 28 gated Y-14 documents retain their owners and exact re-entry.
Toolchain/package graphs, document-route policy, native/package permissions,
replacement/fault/resource work and unavailable-pair disposition remain owed.
Guide/book/compiler/formatter/tooling, ADT and operator code-shape outcomes
remain explicit; no arc/project/human acceptance or library adoption follows.
Ancestor body/history and dashboard sequencing now point to the supervisor
prerequisite, preserving the independently closed launcher correction.
