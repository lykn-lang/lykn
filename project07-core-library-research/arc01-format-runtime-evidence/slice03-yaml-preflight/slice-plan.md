# Slice03 — YAML baseline, fixtures and harness preflight

Status: **CDC closed**, six of six criteria reproduced. Expedited Mode.
See [CDC verification](cdc-verification.md): 349 YAML variants frozen, 38
sentinel/harness attempts plus three supervisor controls independently replayed.
Full families remain owed; Slice05 is the next opened work. The
[CC report](closing-report.md) retains the original proposed-done attestation.

## Assigned capability

Deliver a verified, bounded Lykn harness and frozen YAML variant matrix before
the larger format executions. This is the preparation part of the former
`slice03-yaml-fidelity` roadmap, now split explicitly in [Arc01](../arc-plan.md).
All original [FM01](../slice01-baseline-and-protocol/artifacts/fixture-matrix.md)
Y-01–16 requirements survive. Slice05 owns Y-01–12/Y-15 values, Slice06 owns
Y-13/Y-16 resources/files, Slice07 owns Y-14 documents after Slice04 policy.
Preflight examples are controls, not completed-family claims.

Read the [JSON CDC](../slice02-json-behavior/cdc-verification.md), RP01 and AE01.
Use Lykn for fixture generation, inspection, evidence aggregation and audit.
Shell transport, Git and package metadata inspection remain infrastructure.
Record a concrete missing Lykn capability before proposing another language;
artifact tooling is not an automatic Python/Ruby/Fennel exception.

## Runtime and package condition

Default compiler condition is source `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`.
The shared release checkout/binary has drifted during release work. Inspect
current status but do not reset it or rebuild over another task's binary.
Export that immutable commit into a fresh `/private/tmp/lykn-p07-yaml-source.*`
directory and build there with `cargo build --release --locked`; record source
tree, build settings, executable hash and version. Cargo is compiler-build
infrastructure here, not a replacement research language. Use the resulting
CLI's absolute path for every runtime probe, including supervised children.
Do not rely on an earlier temporary directory still existing. A different
source condition requires an explicit plan amendment and comparison rationale.

Runtime: `/opt/homebrew/bin/deno` 2.7.7, SHA-256
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.
Recheck identity and record drift before comparison. Trial CWD/HOME/TMPDIR/cache
and all generated files belong below a fresh disposable root. Cleared inherited
environment, explicit PATH, null stdin, no-prompt and exact grants are required.
Use the JSON launch/observer controls with the newly pinned CLI path; grants
apply to the program, not trusted compiler file access.

Candidate value API: exact `jsr:@std/yaml@1.2.0`, as B01/SE recorded. Fresh
dependency cache/info may inspect the compiled probe's literal imports using
`--no-npm` and a real frozen lock. Preserve actual graph/lock before executing
package probes; reject runtime Node/npm edges. No language-repo dependency
adoption. Capture schema exports, parse/parseAll/stringify options and their
actual representations; do not infer YAML behavior from JSON's inspector.

@eemeli/yaml 2.9.1 remains **source inspection only** under D-2609-YNOD.
Y-14 is owned by Slice07 and waits for Slice04's compatible route/policy
disposition. No hidden shim, fork, Node import, or replacement candidate is
authorized by this packet. Preparation records the exact unresolved requirement.

## Work and evidence

1. Freeze concrete variants, literal bytes, expected invariants/unknowns,
   repeats, schemas, option combinations and eventual owner for every Y ID.
   Include all quoted/unquoted scalar/schema combinations, tags and invalid
   cases. Manifest construction must not use the parser under test as oracle.
   Preserve edits to fixtures and their reasons before executing observations.
2. Build a bounded graph inspector that retains identity/cycles, exact keys
   and represented key kinds, NaN/Infinity/-0, undefined/absence, timestamps,
   binary and unsupported values. Distinguish the parsed representation from
   original YAML key identity. Observed coercion is loss, never proof that
   the YAML domain was string-only. Bound depth and output on inspection.
3. Predeclare a small sentinel set: Y-01 edit/reread; Y-02 quoted/unquoted
   true plus schema distinction; Y-04 duplicate rejection; Y-05 alias identity;
   Y-06 one self-cycle and unresolved alias; Y-08 two documents; Y-09 malformed
   input; Y-10 comment/presentation rewrite. These validate harness reporting,
   not the full family. Select exact sentinels before observing outcomes.
4. Reuse/adapt the JSON external supervisor, correcting only retained Lykn
   source. Verify wall/output/RSS controls, no live owned children, combined
   output budget, exact grants and actual read denial before sentinel runs.
   Confirm observer availability before launching any infinite-loop control;
   use authorized host observation when required. Keep RP01 budgets. No large
   alias DAG or resource matrix executes in this preparation slice.
5. Run check/lint/compile on authored Lykn, inspect emitted code for the known
   NZRO/JSCF shapes, and run bounded sentinels through the selected CLI. Keep
   all warnings and failed sources; distinguish author mistakes, guide issues,
   compiler defects and dependency behavior. Never repair generated JS.
6. Audit sentinel bytes/values, IDs, exit/errors, graph identity, limits and
   replay using retained Lykn. Require explicit failure on unknown case IDs.
   Document enough invocation/config/copy setup for fresh-context replay and
   later full matrix execution. Freeze the ready harness condition for Slice05.

Durable files in this slice's `artifacts/`:

```text
baseline-and-protocol.md
case-manifest.md
inputs.json
project.json
deno.lock
dependency-graph.json
cases.lykn
supervisor.lykn
audit.lykn
preflight-results.md
raw-transcript.txt
authoring-and-findings.md
```

The raw transcript retains original/revised sources, emitted output, exact
commands/environment scopes, outputs, hashes and file states. The authoring
record includes reference paths actually read, corrections and attribution;
operator elegance review remains pending. Avoid hidden scratch-only evidence.
No source/book changes, publication or generic dependency installation.

## Close and advancement

All six [ledger](ledger.md) criteria must independently reproduce. A smoke
probe's success is not YAML family closure or a dependency acceptance decision.
After verified close, open `slice05-yaml-value-behavior` for Y-01–12/Y-15 using
the actual prepared harness and frozen variants. Do not auto-advance to the
numerically next runtime slice. At most five failed correction iterations;
re-slice transparently if the preparation itself exceeds context headroom.

## Version History

- 2026-09-12 v1.2: CDC rebuilt the pinned compiler, reproduced freeze and all
  controls/sentinels, passed 1991 retained and 907 independent audit checks,
  and closed all six criteria. Original artifacts remain unchanged; CDC evidence
  lives under artifacts. Full file/serialization operations and resource caveats
  are explicit in the next-owner handoff; no YAML family inherits closure.

- 2026-09-12 v1.1: Submitted bounded preparation, pinned isolated build and
  actual graph, 38 sentinel/control attempts, three supervisor controls and
  retained Lykn audit. Resource recipes have exact byte hashes; all later
  owners and the Y-14 gate remain intact. Independent CDC remains required.

- 2026-09-12 v1.0: Opened the bounded YAML preparation slice after JSON CDC
  replay exposed live binary drift and confirmed authoring/context pressure.
  All YAML families retained in explicit later owners; Lykn covers evidence
  tooling as well as format probes.
