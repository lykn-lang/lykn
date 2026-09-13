# Slice06 — YAML resources and file failures

Status: **CDC closed, 2026-09-13; seven of seven criteria reproduced.**
Expedited Mode. The opening contract below and [CC report](closing-report.md)
remain evidence. [Independent verification](cdc-verification.md) replayed 108
resource attempts, 16 file attempts, 13 controls and the 26674-check audit;
4036 additional checks compared semantic/file evidence and reread 138 files.
All 36 unsupported cells remain explicit capabilities, not measurements.
Slice04 is now open; whole YAML, dependency adoption and human acceptance remain open.

## Capability and complete scope

Characterize the pinned YAML value route under bounded depth, scalar size,
alias graphs and real file failures. Consume [Slice05 CDC](../slice05-yaml-value-behavior/cdc-verification.md),
its [baseline](../slice05-yaml-value-behavior/artifacts/baseline-and-protocol.md),
[findings](../slice05-yaml-value-behavior/artifacts/findings.md), retained harness,
and the original [YP-M01 manifest](../slice03-yaml-preflight/artifacts/inputs.json).
RP01/FM01/AE01 and the project/arc plans remain the contract.

All 62 assigned original IDs remain visible:

| Family | Cells | Conditions |
| --- | --- | --- |
| Y-13 depth | 18 | Depth 16/64/256 × default/explicit bound × parse/toJS/stringify |
| Y-13 scalar | 18 | Payload 1KiB/1MiB/8MiB × default/explicit bound × parse/toJS/stringify |
| Y-13 alias DAG | 18 | Fanout 2, depth 4/8/12 × default/explicit bound × parse/toJS/stringify |
| Y-16 | 8 | Missing/unreadable input, absent/unwritable output parent, raw/safe interrupted write, injected pre-rename failure, actual rename-over-directory failure |

Each executable resource cell has one warm-up plus five measured fresh runs.
File variants repeat twice. These are ceilings of 324 resource attempts and
16 file attempts before unsupported-stage and stopping-rule dispositions;
do not report them as completed measurements without execution. Controls,
corrections, unsupported cells and protocol not-runs have separate counts.
The 259 verified value variants and 28 gated document variants retain their
owners. This slice does not execute @eemeli, choose a package, implement a new
library/API, or repair source/book/compiler findings.

## Pin and preflight

Export source d0bb981dae2a4abf6c984406c4b2081a45cc92f8 to a fresh scratch
directory and build there with cargo build --release --locked. Preserve registered
source worktrees and shared binaries. Expected executable SHA-256:
78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb.
Deno /opt/homebrew/bin/deno 2.7.7 expected SHA-256:
103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4.
Record versions, tree, build settings and unexplained drift before comparison.
Use exact jsr:@std/yaml@1.2.0 and the existing frozen lock; inspect the actual
final probe graph for errors and Node/npm edges before package execution.

All research, generation, supervision, inspection and evidence tooling is Lykn.
Shell/Git/compiler builds and dependency transport are authorized infrastructure.
Record an actual gap before proposing another research language. No generated-JS
repair or implicit permissions. Read the pinned Lykn skill and relevant guides,
preserve failed sources/warnings and inspect all emitted programs after source
check/lint/compile. Retain known JSCF/NZRO/UNUS and guide/book findings separately.

Fresh disposable CWD/HOME/TMPDIR/cache/input/output roots; null stdin, no-prompt,
cleared environment, PATH /opt/homebrew/bin:/usr/bin:/bin, DENO_NO_UPDATE_CHECK=1,
NO_COLOR=1. Keep compiler-path.txt as a replay parameter. Package children use
cached-only/frozen mode; grants are explicit per child, not inherited from the
supervisor. Supervisor executable grants name only the isolated CLI, time, ps
and kill. Verify host observation before loops; use the authorized host route
when required. Preserve actual denied/scoped read and fake argv controls.

Before resource/file runs, prove wall/output/RSS stopping, process cleanup,
bounded inspection, dispatch rejection and new interruption checkpoints. Reject
existing attempt roots. Freeze all handler/phase/options/fixture changes and
predeclared invariants before the confirmation matrix; preserve original IDs,
recipe hashes/lengths and full 349-case ownership in the crosswalk.

## Resource operations and measurement

1. Establish actual APIs/options from pinned public exports/source. Stable
   std/yaml returns JavaScript values and exposes no separate toJS operation.
   Preserve every toJS cell as explicitly unsupported with cited capability
   evidence; never time an identity function and label it conversion. Likewise,
   distinguish an actual package bound option from observer/inspector limits.
   No invented option silently ignored by the package is an explicit-bound test.
2. Define default/explicit conditions before execution. RP01 external safety
   thresholds always apply. YP-M01's explicit inspection bounds are depth 256
   and 4096 visits; record node/member/string limits as well. If both labels map
   to identical package behavior, say so and do not infer a package-bound effect.
   Any unavailable package option remains an explicit unsupported capability;
   all original cells still receive an honest disposition.
3. Generate exact original recipes with Lykn and verify YP-M01 hashes/lengths.
   Materialize large inputs as files, not multi-megabyte argv strings. Use short
   exact ID/recipe descriptors and scoped input reads. Record file hash/size before
   package calls. Preserve each unique input's complete bytes once in the retained
   resource-input envelope, or an exact deterministic recipe plus verified hash
   where already retained; avoid repeated giant hex snapshots in every record.
4. Measure parse and stringify independently. File read, fixture preparation,
   inspector traversal, transport and compilation are separate from timed package
   calls. Stringify requires an input graph: establish it before its stage timer
   and record setup cost/failure separately. The external whole-child budget still
   includes setup. Report a setup failure as such, not as a stringify measurement.
   Whole-process time/RSS cannot be attributed solely to one internal stage.
5. Use ascending sizes, one warm-up plus five measured fresh runs, raw values and
   median/range. No population/complexity/safe-maximum claim from this host series.
   Maximum payload 8MiB, encoded input 9MiB, depth 256, DAG depth 12/fanout 2;
   per-child wall 10s, combined observed output 16MiB, sampled tree RSS 512MiB.
   Caps are predeclared, never tuned after outcomes. Measure serializer output
   length/hash separately from log length. Inspection uses bounded previews and
   identity references; do not recursively expand aliases for logging.
6. Stop the affected recipe/operation/condition family at a cap or harness failure,
   retain partial evidence, and mark larger cells not-run with cause, owner and
   re-entry condition. Unsupported is not a failed invocation or fabricated six
   repeats. All counts must reconcile. A required case without a defensible
   protocol disposition remains open; completion cannot be manufactured by
   discarding large cases. Correct/replay in new roots or explicitly re-slice.

Keep stdout/stderr draining and combined retention bounds. The supervisor itself
must avoid full large-file hex snapshots; record size/hash and limited previews,
cross-referenced to the retained exact recipe/input. Array.from(Map/Set), Object.keys
and JSON encoding allocate before some existing inspector guards. Their overhead
is a measured limitation, not a hard safety guarantee. Sampling is not a hard
memory cap and a polling deadline is not hard real time. No Node shim, new
dependency, mount or unbounded alias expansion is authorized.

## Real file-failure paths

Adapt the verified Y-01 file-first workflow with the frozen base YAML and n=2
edit. Source and existing destination bytes are independently recorded. Complete
serialization/validation precedes safe sibling create-new/write-all/sync/close/
rename/reread. Exact failures:

- Missing input and mode-000 unreadable input: distinguish OS error from Deno
  permission denial; the child has the intended narrow read grant. Record file
  modes and the actual operation error. Do not claim unreadability if privileges
  allow the read. Capture bytes before chmod and after controlled restoration,
  without hiding the inaccessible state.
- Missing output parent and mode-0500 unwritable output directory: exercise the
  actual operation with scoped Deno write permission; retain source/destination
  or absent-parent state. Do not invent platform behavior or conflate stages.
- Raw and safe interruption: externally kill the observed child only after a
  declared checkpoint proves a partial raw destination write or partial sibling
  write occurred. A timeout during startup proves neither. Compare immediate
  aftermath before cleanup. Raw truncation is a characterized unsafe behavior;
  the safe path must preserve the existing destination. Retain orphan sibling
  evidence and separate subsequent cleanup from the observed outcome.
- Injected pre-rename failure: report deliberate injection separately from OS
  failure; old destination is untouched and temp/cleanup disposition explicit.
- Rename over a directory: exercise the actual filesystem error, preserving the
  existing directory and its sentinel contents; distinguish it from injection.

All paths, mode changes, sentinels and signals stay in disposable fixtures. Never
edit real configs. Retain original/post states, errors, exit/signal, checkpoint
and cleanup/survivor evidence. No blanket atomicity, cross-platform, concurrency,
power-loss durability or ownership guarantee; Slice04 owns those policy limits.
Host inability to express a fault is a documented blocker/disposition, not a pass.

## Artifacts, verification and close

All durable artifacts live under this slice's artifacts directory:

```text
baseline-and-protocol.md
case-manifest.md
inputs.json
resource-inputs.jsonl
project.json
deno.lock
dependency-graph.json
cases.lykn
supervisor.lykn
audit.lykn
raw-transcript.txt
results.md
file-audit.md
authoring-observations.md
findings.md
```

Use a lossless, hash-checked Lykn packet for raw evidence. Include original/
corrected source, emitted output, all gates, commands/scopes, every measurement
and disposition, exact file/recipe evidence and enough setup to replay after
scratch deletion. Do not silently normalize warning events or error messages.
Audit every executable attempt, all unsupported/not-run cells, original hashes,
phase attribution, actual file behavior, controls and raw/summary agreement.
Resource controls must be independent of synchronous parser execution.

All seven ledger rows require independent CDC verification. At most five failed
correction iterations; re-slice transparently if one context plus correction
headroom is insufficient, preserving every obligation. Accepted API absence is
evidence of unsupported capability, not a request to invent an implementation.
Any true unresolved requirement remains open or explicitly deferred with a real
destination/re-entry condition, never hidden behind aggregate counts.

CC commits exact paths and reports proposed-done. After verified close, open
Slice04 dependency/runtime boundary, then the compatible document route for
Slice07. All 28 document variants, source/guide/book corrections, ADT experiments
and operator aesthetic acceptance remain in scope with their established owners.

## Version History

- 2026-09-12 v1.1: Submitted all 62 assigned IDs with source-backed unsupported
  dispositions, fresh resource measurements and actual file/partial-write faults.
  Original criteria/owners/caps remain unchanged. Five failed authoring conditions
  and the reverted optional renderer are retained; no required work is deferred.
  CDC and Slice04 policy remain separate gates.

- 2026-09-12 v1.0: Opened after Slice05 CDC full replay. All 54 resource cells
  and eight faults retained, with actual API absence, file-based large-input
  transport, stage/observer cost separation and real interruption checkpoints
  made explicit before execution. No policy or source change is inferred.
