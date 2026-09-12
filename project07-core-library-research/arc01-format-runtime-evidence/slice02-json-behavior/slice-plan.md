# Slice02 — JSON behavior through Lykn

Status: **CC proposed-done**, pending independent CDC verification.
Expedited Mode. All 17 JSON families executed in 354 attempts; see the
[closing report](closing-report.md) and [results](artifacts/results.md). Read [Arc01](../arc-plan.md),
[baseline CDC](../slice01-baseline-and-protocol/cdc-verification.md) and the
[permission correction](../../arc03-findings-and-integration/slice01-run-permissions/slice-plan.md).

## Goal and fixed scope

Execute all J-01–17 families in
[FM01](../slice01-baseline-and-protocol/artifacts/fixture-matrix.md) through
retained Lykn programs, using RP01's isolated execution and evidence rules.
Native JSON comes first, then pinned JSONC/stream/canonicalization candidates.
Record values, exact keys and bytes, parse/serialize losses, errors and file
failures separately. No production library or unapproved dependency is created.

Preserve AE01 authoring/reference logs during trials; carry actual guide/book
findings and representative source into Arc02. J-09 feeds the book BigInt
finding without claiming a book repair. Full ADT/human trials remain Arc02.

## Prerequisites and launch

The [run-correction CDC](../../arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md)
has verified the correction, RP-B01 receipt and actual permission controls.
That prerequisite is lifted as of 2026-09-12. Pin this condition:

- CLI: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn`, source
  `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree
  `1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`.
- CLI SHA-256: `5efc8299cc005e977c4d33304f3c9f7062bc4eeb0038c93136a95dccdbaceb86`.
- Deno: `/opt/homebrew/bin/deno`, 2.7.7, SHA-256
  `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.

Recheck hashes, actual runtime selection and source drift before execution;
record changes rather than silently substituting a new build. The PATH-installed
Lykn and historical B01 binary are not the selected condition.

Verified launch syntax, from a disposable trial root with its `project.json`
and retained Lykn case program copied there:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --no-prompt cases.lykn CASE
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn run --no-prompt --allow-read=./inputs --allow-write=./outputs cases.lykn CASE
```

`CASE` denotes the frozen variant's actual selector; replace it with the
manifest value. The retained cases program now implements the frozen selectors in
[inputs.json](artifacts/inputs.json); full replay is in
[baseline-and-launch.md](artifacts/baseline-and-launch.md). Run with cleared inherited
environment and PATH `/opt/homebrew/bin:/usr/bin:/bin`; put HOME, TMPDIR and
DENO_DIR under the disposable root, with DENO_NO_UPDATE_CHECK=1, NO_COLOR=1
and null stdin. Prepare/copy fixture inputs before the measured case so a
parser-only run does not need fixture-creation permissions.

J2-01 remains open until this harness records effective argv and a real denied
read. Record the exact case-specific scopes in `artifacts/baseline-and-launch.md`.
No direct-Deno exception, implicit -A, or flags-after-FILE workaround.
Parser cases get no application grants; file cases get only disposable input/
output scopes. Capture the effective argv and a real denied-read control.

Package cases require exact pins, import map, resolved graph and frozen lock
recorded before interpreting behavior; reject Node/npm edges. Source-register
pins are std/json 1.1.0, std/jsonc 1.0.2 and resolved std/streams. No package
adoption into the language repository. Full graph policy closure remains S04.

J-16 stress variants stay gated on a verified external supervisor enforcing
RP01 wall/output limits and observing RSS. A synchronous parser cannot be
stopped by its own timer. Preserve blocked variants with owner/re-entry status;
do not count them passed. If the slice needs splitting, amend the arc with
every J ID retained before claiming closure.

## Exact artifact layout

Durable files in this slice's `artifacts/`:

```text
case-manifest.md
cases.lykn
supervisor.lykn
inputs.json
project.json
deno.lock
baseline-and-launch.md
dependency-graph.txt
results.md
raw-transcript.txt
byte-evidence.md
authoring-observations.md
findings.md
```

`inputs.json` is a retained fixture manifest using explicit text or hex bytes,
never decoded through the converter being evaluated as its own oracle. It
can be hand-authored as input data; `cases.lykn` materializes fixtures in a
disposable `/private/tmp/lykn-p07-trial.*` root. It dispatches by case/variant
so each attempt runs in a fresh process. Split into additional files only via
an explicit exact-path amendment. Do not create a fake lock or graph; retain
actual resolution output when executed. Original input/output bytes may be
represented in the evidence document as hex plus hashes for durable replay.

Generated JS/config/cache and transient files stay below the disposable root.
Retain command results/stdout/stderr/signals and input/output bytes in the
listed durable records before cleanup; do not rely on temporary paths as proof.
No authored source/release/book changes in this research slice.

## Verification and exit

Freeze concrete variants and invariants before execution. Follow RP01 and
FM01, including independent expected values, numeric-token preservation,
null/own-undefined distinction, arbitrary keys, framing, negative controls and
file replacement versus raw-write behavior. Report unsupported outcomes
honestly. Run normal deterministic cases in two fresh processes; timing
characterization follows RP01 and is not a performance population claim.

Every J family needs an explicit disposition and evidence; a blocked outcome
does not automatically fulfill its requirement. CDC must approve an explicit
deferral with re-entry or re-slice instead of silently narrowing the work.
Review [ledger.md](ledger.md), preserve all findings and source-shape examples,
commit exact paths, then seek independent reproduction. No empty close sets.

## Version History

- 2026-09-12 v1.2: CC executed all 161 variants/354 attempts after own launcher,
  graph and supervisor preflights; retained failures, bytes, measurements and
  authoring findings. Proposed-done only; no source repair, package adoption,
  CDC closure or operator acceptance inferred.

- 2026-09-12 v1.1: Arc03/Slice01 CDC closed; lifted the launcher dependency,
  pinned verified CLI/source/runtime identities and concrete launch syntax.
  Own-harness denial/argv, package and supervisor preflights remain required.
- 2026-09-12 v1.0: Opened after baseline CDC closure with all J-01–17 families
  retained. Run permission/build receipt gates execution; resource supervision
  and package-graph preflights remain explicit prerequisites.
