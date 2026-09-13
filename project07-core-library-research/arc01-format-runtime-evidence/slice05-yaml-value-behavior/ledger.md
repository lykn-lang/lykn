# YAML value behavior ledger

All seven rows are now CDC closed at reproduced strength; see
[verification](cdc-verification.md). Full YP-M01 value scope is 259 variants/518 attempts,
plus separately counted controls. No sentinel-only or successful-case-only closure.

Historical CC submission, 2026-09-12: all seven rows were **CC proposed-done**, with per-row attested
evidence in [closing-report.md](closing-report.md). Final 518 attempts and 13
supervised controls passed; the Lykn audit passed 35,098 checks. Original
warning-incomplete executions remain visible, with 2,592 comparison checks.
CDC subsequently reproduced 35,098 audit checks, 2,592 correction-comparison
checks and 7,833 additional checks. Criteria are unchanged; the original CC
attestation remains in the closing report. Slice06 is now open.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| YV-01 | Baseline and complete assigned matrix are frozen and reproducible | Immutable build/hash, actual Node/npm-free graph/lock, YP-M01 crosswalk, 259 unique IDs and two attempts each | correctness-grade | Slice03 CDC; RP01/FM01 | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Preserve all 349 original owners; operational additions declared before execution |
| YV-02 | Scalar/tag/schema and mapping-key behavior is characterized without hidden domain loss | Replay all Y-02/03/04 cases; original bytes versus kinds/keys, duplicate policy, error/warning outcomes | correctness-grade | FM01 YAML resolution and keys | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Unsupported and unstable tag outcomes explicit |
| YV-03 | Graphs, merges, multi-documents and diagnostics retain identity and failure evidence | Replay Y-05–09; alias mutation/serialization, cycle handling, ordered/empty docs, attributed errors and all warnings | correctness-grade | FM01 graphs/streams/errors | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Errors distinct from inspector/harness failures; original/no-op/edit bytes where meaningful |
| YV-04 | File workflows and presentation losses are verified against actual bytes | Y-01 file-first read/edit/write/reread; Y-09 existing destination on parse rejection; Y-10/11 byte differences and scalar semantics | serious | Slice03 CDC remaining workflow obligations | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | No crash/concurrency/durability or document-preservation guarantee inferred |
| YV-05 | Numeric, presence, exact-key and runtime-value behavior is explicit | Replay all Y-12/Y-15; lexemes, -0/non-finite, own presence, default behavior, prototype/key checks and skipInvalid classification | correctness-grade | FM01 cross-format value domain | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Coercion, omission and rejection are distinct from fidelity |
| YV-06 | Full execution and audit obey the bounded Lykn protocol | Source/emitted gates, permission/argv controls, external stops/cleanup, 518 attempt records, independent invariants and byte/hash/lock checks | serious | RP01; Lykn-first direction | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Inspector markers limit observations; no hidden fallback language or broad grants |
| YV-07 | Findings and complete handoff survive with reproducible evidence | Walk original/revised source, references/attribution, discoveries, artifact inventory, ancestor bubble-up and next-owner replay | correctness-grade | AE01; guide/book/human goals; Expedited Mode | done | [CDC reproduction](cdc-verification.md#seven-row-walk) | Slice06 next; Slice04 before Slice07; human acceptance and source repairs remain separate |
