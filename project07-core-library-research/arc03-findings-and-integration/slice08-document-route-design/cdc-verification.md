# Slice08 independent partial design verification

2026-09-14. Reviewed design commit `56155d8` and qualified approvals commit
`ff9d3164a6d794b9212ca5c047af9747188a4cde` from a clean planning worktree.
**DR-02, DR-03 and DR-05 are independently verified at design strength.**
DR-01 and DR-04 remain open; the slice is not closed. No repository, licence,
implementation or next source assignment is created by this review.

## Decisions and independent evidence

The current decision record retains the operator's explicit adoption of the
qualified recommendations; the operator also relayed CC's resulting commit in
this task. This review checks their faithful incorporation rather than supplying
operator decisions. D1/D2/D3a/D4/D5/D6/D7/D8 remain accepted with qualifications;
D3b remains deliberately pending. No default ISC or inferred new-code licence.

The four live design artifacts and their `ff9d316` diff carry feasibility and
exact translation inventory before port commitment, idiomatic internal Lykn/ADTs,
provisional limits, only original no-op/n=2 edits and selected future YAML home/
accountability. Earlier packet decision statuses are explicitly historical.
The immutable packet is not silently rewritten to manufacture approval evidence.

Rehashed the accepted isolated CLI:
`/private/tmp/lykn-p07-lc-cdc.0IMone/source/target/release/lykn`, SHA-256
`d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`;
source release/0.6.x `4dded883bbd321d19635e6fce233343f33803f9e`.
Deno remains 2.9.6, SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
This is reuse of the accepted binary, not a fresh compiler build.

| Verification | Independent result |
| --- | --- |
| Original CC packet | SHA-256 `2585bc4315fd1d40fc50d26fb5bdb8aefc5a4645779e71de40b023c77eb4f745`; all 49 files pass 147 extraction checks |
| Source gates | Unchanged packet and design audit pass check/lint/compile; audit emitted bytes equal CC's; packet emitted bytes equal the previously reviewed CDC copy |
| Original input correspondence | Both captured input files compare byte-for-byte to committed Slice09 inputs and Slice10 historical-crosswalk, rather than trusting packet-local copies alone |
| Complete design regeneration | 413 checks; entire crosswalk reproduces byte-for-byte against both captured and committed copies |
| Independent verify invocation | 414 checks; all 28 original IDs, options, exact bytes/edits and two repetitions remain, with 56 intended attempts per future condition |
| Resource retention | All 54 rows and the exact 36 unsupported subset remain; 18 missing conversion / 27 missing bound / nine overlap; zero unsupported attempts |

Scratch `/private/tmp/lykn-p07-dr-cdc.yquTMR`. Calls used cleared environment,
owned HOME/TMPDIR/cache, cached-only/frozen/no-prompt, null stdin and explicit
relative read/write grants. There were zero candidate/package/document executions,
no eval or generated-JS edits, and no CDC source-authoring failures. Existing
compiler unused-binding warnings remain in receipts. No new network, build,
source-home inventory or complete upstream graph proof is claimed.

## Contract review and row walk

Read the native generator and emitted code, all seven explicit original/edited
strings, byte-splice rules, proposed semantic deltas and both token settings.
The BOM byte offset, CRLF, absent final LF, doc0 two-byte numeric replacement,
five numeric documents and two block-scalar append cases are explicit. No-op
splices are empty. The semantic field describes the preimage followed by its
requested delta; it is not an executed semantic oracle. The future G5 verifier
must independently check final semantics and literal/folded scalar content.
This review accepts inspectable proposed bytes, not parser implementation proof.

| Original criterion | CDC disposition |
| --- | --- |
| DR-01 | **Open.** Qualified boundary/reuse/maintenance decisions are recorded. D3b remains undecided; no new-code licence can be supplied by CDC. |
| DR-02 | **Done.** Accepted design distinguishes original bytes, document graph and recursive values; specifies stable occurrence/alias identity, precision/missing/null, errors, schemas, exact supported edit ranges and all 28 original cases. Internal Lykn/ADT and source-readability proof remain explicit later obligations. |
| DR-03 | **Done.** Accepted initial limits are proposals requiring in-operation counters/cancellation proof. File policy names cooperative writer ownership, unsupported noncooperating races, symlink/cross-device rejection, no-clobber proof, commit-point ambiguity and bounded orphan handling. It retains missing APIs and makes no current hard-memory/durability claim. |
| DR-04 | **Open.** Future lykn-patch/yaml, initial main and oubiwann accountability are selected. The qualified decision retains final bootstrap-scope/creation-authority review, including the unresolved LICENSE content. Do not reopen home/owner choices. |
| DR-05 | **Done.** G0–G6 preserve the outstanding licence/creation gates, exact later translation scope and feasibility review, independent source/emitted graph/API/license proof, structural controls, all original Y-14 cases and separate resource re-entry. This verifies the proof contract, not execution of its future gates. |

DR-04's original verifier permits either an existing verified home or explicit
separate creation authorization. Do not introduce a circular requirement to
create the repository before finishing design: final reviewed creation authority
can finish this row; actual created checkout identity is checked later at G1.
The provisional bootstrap path list has been inspected, but its licence-dependent
content and final source authority remain unresolved. It is not dispatched here.

## Evidence and bubble-up

The [CDC evidence packet](artifacts/cdc-raw-transcript.txt) retains native sources,
emitted gates, exact inputs and regenerated crosswalk, raw gate/replay receipts,
the reviewed current design/decision/proof snapshots and planning checks.
Its replay instructions reproduce data verification without evaluating a YAML
candidate or using the original absolute scratch directories. The original CC
packet remains authoritative for its original source/transport snapshots.

Final CDC packet SHA-256:
`4d625a6aa9b0098cbb9b5fd6e00f5709dfce4bd906ef995c2c98a4c51feebd9b`.
All **38 files / 1,321,177 decoded bytes** pass **114 packing and 114 fresh
extraction checks**. Its literal `replay.sh` then regenerates the crosswalk
byte-for-byte and passes 413/414 checks. Final replay receipts remain at the
scratch root as `final-replay.stdout`/empty `final-replay.stderr`; per-mode
receipts are in `final-extracted/payload/replay-logs/`. The packet precedes its
final replay and does not claim to contain its own final seal receipt.

The adapted native planning verifier passed check/lint/compile and emitted
inspection, then **22 checks over 10 exact paths and 136 local Markdown links**.
It confirms all five original criterion definitions and the three-done/two-open
status vector. Direct diff review confirms no project or arc row status changes.

Scope delivered: independently reviewed and reproducible design preparation,
with three fulfilled design criteria. Scope remaining: D3b and final bootstrap
scope/authority review under DR-01/04. All five original definitions survive.
No failed/unsupported cell, original repetition or human judgment is dropped.
A3-08 and every project/arc row remain unchanged; RC/DB research stays closed.
Bodies and version histories carry this partial disposition, not a new source
assignment. Arc02 recursive ADT/authoring/source-shape, Arc03 guide/book/compiler/
formatter/test findings, P-04/P-08 actual human judgment, JSON-first production
ordering, all 28 gated Y-14 cases and 36 unsupported Y-13 cells remain owned.

What worked: separate original input correspondence, explicit golden byte splices,
and a recorded qualified approval diff made the design review possible without
mistaking reproducible metadata for implemented YAML behavior.
