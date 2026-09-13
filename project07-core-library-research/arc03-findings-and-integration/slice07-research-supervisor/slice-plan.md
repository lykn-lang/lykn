# Slice07 — Research supervisor verification

Status: **Open, ready for CC.** Planning-only prerequisite, Expedited Mode.
Parent: [Arc03](../arc-plan.md). Six open criteria in [ledger.md](ledger.md).

2026-09-13 CDC: [preparation and split reviewed](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cdc-resume-verification.md).
The retained failure and packet reproduce; this open set is ready for CC.
No SH criterion is closed. The control clarifications below make existing
observation-failure and parent-exit cleanup obligations directly testable.

## Capability and reason for the split

Produce a verified, native Lykn supervisor and semantic audit for the bounded
Slice04 research children on the accepted compiler/runtime pair. The
[resumed preparation](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/artifacts/resume-preparation.md)
retains four source-authoring failed conditions and a separate frozen-lock
configuration failure. Slice04 explicitly requires re-slicing before its
five-condition correction budget is exhausted. Its supervisor has only passed
source gates; no resumed control or matrix ran.

This is a distinct tooling unit with six checkable criteria, not renamed
completion of DB-01–08. Keep Slice04's four-condition history and remaining
budget intact. Track this bounded unit's own corrections separately; re-slice
before five failures here as well. Do not use a new name to keep an unbounded
research loop running. Source compiler repair, full graph research, package
evaluation and the DB matrix remain outside this unit.

## Inputs and baseline

Read the project/arc plans and ledgers, Slice04's complete prompt/plan and
resumed preparation, original FM01/RP01, the Slice06 YAML resource/file CDC,
and Arc03/Slice06 launcher CDC. Use the installed collaboration-framework,
project-management README and relevant guides, work-verification,
scientific-methods, and the selected immutable compiler's Lykn skill/guides.
The installed Rust guidance is already authorized if needed; do not reopen
that permission question. Record actual reads, inherited context and warnings.

Extract both Slice04 packets with its existing audit, preserving originals.
The resumed packet has source and emitted gates for `seed/cases.lykn`,
`seed/supervisor.lykn` and native `audit.lykn`; these are unverified candidates.
Use their exact hashes as the adaptation starting point. Preserve failed
sources; edit Lykn only, check/lint/compile and inspect emitted code. No
generated-JS repair or alternate research language.

CDC-confirmed seed hashes: `cases.lykn`
`6bc7f6ff266908383f09261a97e19fab26f6d0d00de1c8ef2e878838dfdf28a7`;
`supervisor.lykn` `eb768d0ed0af18b82db1676210ee70fd91ae20c53ace37e1706699193b52c912`;
`audit.lykn` `f73c7b00cebe40e85dcdeee1745c424161e51edc3a6b7a813720b041529743f8`.
The inherited candidate manifest's launcher-blocked label is historical; native
SH inputs must be freshly authored/frozen without mutating that evidence.

Build immutable `4dded883bbd321d19635e6fce233343f33803f9e`, tree
`218b085176053f1273642496cf75d7691c399f6e`, in an isolated export with
`cargo build --release --locked`. Selected CLI SHA-256:
`d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326`.
Use installed `/opt/homebrew/bin/deno` 2.9.6, SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
No installation, alternative revision build or shared binary changes. Verify
identity and source/worktree status before work. The entire new compiler
condition includes earlier embedded/toolchain changes; it is not launcher-only.

## Bounded work and frozen controls

Freeze a native-only manifest, exact source hashes/configs/locks, fixtures,
grants and expected observations before execution. All scripts have no imports;
use an empty project config and matching version-5 native lock, independently
copied per child. Keep package config/lock/cache outside these native roots.
No package download, evaluation, dependency decision or installation is needed.

Assign new `SH-*` attempt IDs. Prerequisite controls never silently become
R-family attempts. Required families, with concrete subvariants frozen before
execution, are:

| Family | Required observation and repetitions |
| --- | --- |
| SH-CAP | Five separate controls, one fresh attempt each: wall stop, output stop, RSS stop before compiled output exists, nested-child/parent-exit cleanup, and injected observation failure after owned-child registration. Freeze exact IDs and expected evidence; none is a DB attempt. |
| SH-NATIVE | Minimal and parser no-grant success; allowed/denied read and write, denied env/net/run; two fresh attempts each |
| SH-OBSERVER | Deliberate partial raw write detected while writer waits; two fresh attempts |
| SH-CONCURRENT | Reader plus replacement writer, and reader plus two writers; two fresh attempts each |
| SH-CANCEL | Before-rename and after-rename observed checkpoint termination; two fresh attempts each |
| SH-AUDIT | Retained-data negative controls reject missing observations, wrong checkpoint bytes, wrong denial class, survivor evidence and config/lock mismatch; no fabricated run is represented as an actual process observation |

Positive assertions must inspect actual JSON records and live fixture bytes,
not only exit status. Negative audit controls operate on labeled copies and
retain the original evidence. Enumerate the exact attempt denominator before
launch; do not add new behavior families ad hoc. Extra execution after a failed
condition requires a named correction with original evidence retained.

## Required corrections and safety

- Early termination may precede the compiled file. Record source identity and
  explicit compiled-output absence without throwing away stop evidence.
- Never invoke kill with no targets. Track ownership and process identity,
  validate descendants and parent-exit behavior; stale PID reuse is not
  authority. Verify no observed owned survivors and retain termination receipts.
- Observation failure must stop owned children and leave bounded evidence;
  promise rejection must not orphan loops. Inspect this path before controls.
  Exercise a labeled injected observation failure, retain its original error,
  and verify cleanup with an independent working host observation route.
  The parent-exit control must leave a known nested child holding an inherited
  output pipe open: cleanup and stream draining must still finish within the
  declared external bound. Parent exit alone cannot disable the watchdog.
  Cap process-sample and error evidence as well as stdout/stderr; reaching a
  recording cap must produce an explicit disposition, not unbounded allocation.
- Create verified markers only after semantic checks: actual `NotCapable`,
  independently observed partial bytes, nonzero in-window reader samples,
  complete candidate hashes and exact cancellation aftermath.
- Correct explicit parent/worker grants. Parent `--allow-run` is limited to
  the selected CLI; child workers receive only their declared fixture access.
  Supervisor host execution is limited to selected CLI, `/usr/bin/time`,
  `/bin/ps`, `/bin/kill`. Native files stay within owned scratch.
- Freeze maximum three workers, 65,537-byte A/B candidates, 32,768-byte partial
  control, 512 reader samples, 5s internal deadline and 10ms poll, or explicitly
  justify a smaller bounded control in the manifest before execution.
- Retain before/checkpoint/aftermath bytes, modes, process receipts and streams
  before any cleanup. No rename observation proves durability or conflict policy.

Use corrected `lykn run`, null stdin, no prompt, cleared environment, separate
private HOME/TMPDIR/DENO_DIR and fresh cwd/fixtures for every attempt. Use
frozen/cached-only execution and narrow requested grants. Host `/bin/ps`
observation through the authorized route must work before any loop; external
wall/output/RSS and cleanup controls must pass before native/concurrency loops.
Default external caps remain 10s, 16MiB retained combined output and 512MiB
sampled process-tree RSS. Control thresholds may be smaller as declared.
Inspection caps remain depth 256, visits 4096, nodes/members 2048,
strings/binary 4096; input cap 8MiB and total encoded transport 9MiB.
Stop the affected family on a cap or invalid harness result and retain exact
owed attempts, owner and re-entry. Sampled RSS is not a hard allocation cap.

## Output, verification and re-entry

Artifact home: this slice's `artifacts/`. Exact files are listed in cc-prompt.md:
manifest/config/lock, cases/supervisor/audit source, protocol, lossless packet,
results and authoring observations. Preserve failed inputs/source and all
streams/hashes. Test literal fresh execution and captured replay instructions.
Independent CDC must re-run controls, check live files, reject negative audit
fixtures, reconcile source/emitted hashes and count all six criteria.

After CDC, return to Slice04's complete R-01–09 assignment, retaining its four
source failures. Slice04 still owes full operational freeze, whole-package and
toolchain graphs, cache/lock/resolution cases, package permissions, replacement
and fault matrix, J-16/Y-13 reconciliation, supported-pair disposition and
document-route decision. All 47 candidates and their expansions remain there.
The 36 unsupported resource cells and 28 gated Y-14 documents retain their
owners and API/route-dependent re-entry; no package or ancestry acceptance is
implied. Existing guide/book/ADT/source/human outcomes remain Arc02/Arc03 work.

## Version History

- 2026-09-13 v1.1: CDC reproduced preparation and reviewed the split. Made
  observation-failure and inherited-pipe cleanup controls explicit, pinned
  adaptation inputs and retained all six open SH and eight unchanged DB rows.

- 2026-09-13 v1.0: Opened from Slice04's fourth source-authoring failure and
  review gaps before exhausting its correction budget. Isolated native
  supervisor verification without transferring or closing research criteria.
