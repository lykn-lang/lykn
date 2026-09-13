# YAML value baseline and replay — YV-B01

Same-author evidence, 2026-09-12 local date. Question: what do the pinned YAML
value APIs accept, reject, coerce, lose or preserve across all Y-01–12/Y-15
variants? The frozen questions remain in [inputs.json](inputs.json), including
verbatim original YP-M01 rows. This is a purposive functional case series, not
a performance benchmark or dependency-adoption decision. RP01/FM01/AE01 apply.

## Immutable condition

Planning began clean at `46f4c45`. Registered source homes were main `1b74783`,
release/0.6.x `50608c4`, release/0.7.x `74a90d5`, release/0.8.x `0f3c28c`.
The inspected 0.6.x worktree was clean; no source worktree or shared binary was
reset, rebuilt or modified. Fresh source export:
`/private/tmp/lykn-p07-yaml-values.FnXDWO/source`, from immutable commit
`d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree
`1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`.

`cargo build --release --locked` exited 0 in that export. Cargo/rustc 1.97.0;
default release profile, inherited build environment, no command-added profile
or RUSTFLAGS overrides. This is a fresh export, not a cold Cargo-cache trial.
The resulting `source/target/release/lykn` SHA-256 is
`78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`, matching
Slice03 CDC. Build output and compiler versions are retained in the packet.

Deno `/opt/homebrew/bin/deno` 2.7.7 SHA-256
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`;
V8 14.6.202.9-rusty, TypeScript 5.9.2; macOS 15.7.9 (24G830), arm64, APFS.
Agent: Codex; exact backend build and sampling settings unavailable. Prior
conversation, memory and verified Slice03 code are disclosed prior knowledge.

## Conditions, graph and scopes

Initial trial: `/private/tmp/lykn-p07-yaml-values.FnXDWO/trial`.
Final confirmation: `/private/tmp/lykn-p07-yaml-values.FnXDWO/confirmation`.
Each contains fresh `runs/ID-attempt` roots, separate inputs, outputs, HOME,
TMPDIR and cache. Existing attempt roots are rejected. Each normal variant has
two final attempts; the earlier complete 518-attempt run remains superseded
because warning messages were missing from its structured observations.

The exact pin is `jsr:@std/yaml@1.2.0`. The real lock is copied from Slice03,
SHA-256 `31701539b90a70c921fce96ab7cd8c6a4ee74d888ffc30c4c1e6d6ebc3f9031f`;
package integrity `20beb41e4983ba3437dbefac62b14061ab058e8a187596f19d28ff9035f6e6cf`.
The fresh graph has 26 modules, one JSR package, no Node/npm entries and no
resolution errors. Initial sandbox cache/info returned exit 0 despite a graph
resolution error; the graph audit rejected it. Authorized host transport
resolved it before controls or YAML runs. Confirmation copies the verified
warm cache and resolves its final emitted source graph again. Every attempt
checks the same lock and config. Broader ancestry and offline policy remain
Slice04; source port ancestry is separate from runtime dependencies.

All real commands clear inherited environment, set PATH
`/opt/homebrew/bin:/usr/bin:/bin`, HOME/TMPDIR/DENO_DIR below the trial,
DENO_NO_UPDATE_CHECK=1 and NO_COLOR=1, and use null stdin and `--no-prompt`.
Parser-only probes request no application grants. Y-01 and Y-09 alone request
`--allow-read=./inputs,./outputs --allow-write=./outputs`. Materialization
requests only fixture write access. All non-supervisor-control children use
`--cached-only --frozen=true`. No application network or npm grant is used.

The supervisor reads/writes its one trial root and may run only the isolated
CLI, `/usr/bin/time`, `/bin/ps`, `/bin/kill`. Child grants are constructed
independently. Host process observation succeeds before loop controls. Standard
limits remain 10 seconds, 16 MiB combined output and 512 MiB sampled tree RSS;
controls deliberately use 500 ms, 4096 bytes, or 1 KiB to exercise termination.
These are sampled thresholds, not hard allocation or real-time guarantees.
Inspector depth/visit/node/member/encoding guards do not bound all allocations.

## Source and operation contract

The freeze preserves all 349 original YAML IDs/owners/options/bytes/questions.
It selects 259 here; Slice06 keeps 62, gated Slice07 keeps 28. Exact JSON case
contracts are embedded in cases.lykn by audit.lykn freeze. Dispatch rejects an
unknown ID or any changed operation/schema/options before package import.
Constructor entries, order, literal key domains and file additions were frozen
before observations. The inherited first comment in cases.lykn describes its
preflight origin; the generated 259-entry contract is the actual execution scope.

Y-01/Y-09 read actual fixture bytes before parsing. Complete serialization and
successful validation precede create-new sibling, complete write, sync/close,
rename and reread. Parse rejection preserves an existing ORIGINAL+LF destination
and the source, with no leftover temp. Accepted duplicate anchors and tab input
follow the actual replacement path. No concurrency or crash-durability claim.

Every accepted value has no-op serialization/reparse; declared n, alias and
exact-key edits have output serialization/reparse. For no-edit cases output is
the no-op result, not a fabricated edit. parseAll returns an ordered array;
serializing that array is value rewriting, not reproduction of a document stream.
Warnings are ordered events with stage, name, message and structured positions;
no Map deduplicates them. Errors are caught only around package calls. Inspector,
contract, file and supervisor failures remain nonzero harness failures.

## Fresh replay

From the planning root; substitute your fresh paths. Keep each command's status
and streams separately, including expected permission/dispatch failures.

```sh
set -e
set -o pipefail
planning_root=/Users/oubiwann/lab/lykn/lang/.worktrees/planning
artifact_dir="$planning_root/project07-core-library-research/arc01-format-runtime-evidence/slice05-yaml-value-behavior/artifacts"
preflight_dir="$planning_root/project07-core-library-research/arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts"
yv_root=$(mktemp -d /private/tmp/lykn-p07-yaml-values-replay.XXXXXX)
mkdir "$yv_root/source" "$yv_root/trial"
git -C "$planning_root" archive d0bb981dae2a4abf6c984406c4b2081a45cc92f8 | tar -x -C "$yv_root/source"
(cd "$yv_root/source" && cargo build --release --locked)
yv_cli="$yv_root/source/target/release/lykn"
shasum -a 256 "$yv_cli" /opt/homebrew/bin/deno
# Stop on any unexplained hash drift.
yv_trial="$yv_root/trial"
cp "$artifact_dir/"*.lykn "$artifact_dir/project.json" "$artifact_dir/deno.lock" "$yv_trial/"
cp "$preflight_dir/inputs.json" "$yv_trial/yp-inputs.json"
mkdir -p "$yv_trial/home" "$yv_trial/tmp" "$yv_trial/cache" "$yv_trial/inputs" "$yv_trial/outputs" "$yv_trial/runs" "$yv_trial/meta"
printf '%s\n' "$yv_cli" > "$yv_trial/compiler-path.txt"
cd "$yv_trial"
yv_env() {
  env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$yv_trial/home" TMPDIR="$yv_trial/tmp" DENO_DIR="$yv_trial/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$@"
}
yv_env "$yv_cli" run --no-prompt --allow-read=./yp-inputs.json,./cases.lykn --allow-write=./inputs.json,./case-manifest.md,./cases.lykn audit.lykn freeze
cmp inputs.json "$artifact_dir/inputs.json"
cmp case-manifest.md "$artifact_dir/case-manifest.md"
cmp cases.lykn "$artifact_dir/cases.lykn"
for program in cases supervisor audit; do
  yv_env "$yv_cli" check "$program.lykn"
  yv_env "$yv_cli" lint "$program.lykn"
  yv_env "$yv_cli" compile "$program.lykn" -o "$program.js"
done
# Review emitted code before proceeding; retain all warnings.
yv_env /opt/homebrew/bin/deno cache --no-npm --frozen=true --config project.json --lock=deno.lock cases.js
yv_env /opt/homebrew/bin/deno info --no-npm --frozen=true --config project.json --json cases.js > dependency-graph.json
yv_env "$yv_cli" run --no-prompt --allow-read=./dependency-graph.json,./deno.lock audit.lykn graph
yv_env "$yv_cli" run --no-prompt --allow-write=./inputs cases.lykn materialize '[{"path":"inputs/control.txt","hex":"434f4e54524f4c"}]'
# Expected denied read must exit 1, and stderr must include NotCapable.
set +e
yv_env "$yv_cli" run --no-prompt cases.lykn control-read > meta/permission-denied.stdout 2> meta/permission-denied.stderr
permission_status=$?
set -e
test "$permission_status" -eq 1
yv_env "$yv_cli" run --no-prompt --allow-read=./inputs cases.lykn control-read > meta/permission-scoped.stdout 2> meta/permission-scoped.stderr
mkdir fake
printf '#!/bin/sh\nprintf '\''%%s\\0'\'' "$@"\n' > fake/deno
chmod +x fake/deno
env -i PATH="$yv_trial/fake:/opt/homebrew/bin:/usr/bin:/bin" HOME="$yv_trial/home" TMPDIR="$yv_trial/tmp" DENO_DIR="$yv_trial/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$yv_cli" run --no-prompt --allow-read=./inputs --allow-write=./outputs cases.lykn control-read --allow-all > meta/argv.bin 2> meta/argv.stderr
# Only this recorder uses fake PATH; it is not the actual permission test.
/bin/ps -axo pid,ppid,rss,stat > meta/ps-before-controls.txt
yv_supervise() {
  yv_env "$yv_cli" run --no-prompt --allow-read="$yv_trial" --allow-write="$yv_trial" --allow-run="/usr/bin/time,/bin/ps,/bin/kill,$yv_cli" supervisor.lykn "$1"
}
yv_supervise controls > controls.stdout 2> controls.stderr
yv_supervise harness > harness.stdout 2> harness.stderr
yv_env "$yv_cli" run --no-prompt --allow-read="$yv_trial" audit.lykn preflight
yv_supervise matrix > matrix.stdout 2> matrix.stderr
yv_env "$yv_cli" run --no-prompt --allow-read="$yv_trial" --allow-write=./results.md,./byte-audit.md audit.lykn audit
```

Expected final audit: 35,098 checks, 259 variants, 518 normal attempts,
13 supervised control attempts. Status `complete` is execution attribution,
not a losslessness verdict. Timing, PIDs, RSS and compiler warning order may
vary. Stop on observer failure or unexpected cap; never silently rerun a used
attempt root. Authorized host transport/observation is needed in this sandbox.

## Raw packet and comparison replay

raw-transcript.txt is a lossless JSON-lines transport envelope: each record has
relative file, byte count, SHA-256 and JSON-escaped text. It includes both run
conditions, every normal/control record, source revisions, final emitted output,
commands, exact environment/scopes, build and package-source receipts. Escaping
preserves trailing whitespace and NUL argv separators without editing evidence.
Deno's appended cache transport headers are omitted from package-source bodies;
no source statement or runtime result is omitted. This is not program-generated
source repair. audit.lykn pack/extract owns the envelope and hash checks.

For an empty scratch archive directory, use the final audit's extract mode:

```sh
yv_env "$yv_cli" run --no-prompt --allow-read="$artifact_dir/raw-transcript.txt" --allow-write="$yv_root/archive" audit.lykn extract "$yv_root/archive" "$artifact_dir/raw-transcript.txt"
```

From a confirmation replay containing matrix.stdout, mode `compare` takes the
extracted `archive/trial` directory as its second argument, with read grants
to both roots. It checks 2,592 obligations across 518 pairs. Only added warning
name/message fields are normalized; all prior value/error/byte/file facts must
match. Do not compare timing, PIDs or compiler-warning ordering as deterministic.

## Final identities

```text
d97f9d1d25b6da040cfcf1fe1916b372c034ce7d25ddc0ecb3ecfbd33c965b63  cases.lykn
20ff43e1352c3866ece089e70c16ee28afd2d2841caf00475d3e1d7637562264  cases.js
810f2688cca0213a6181b14dbf27574268a77bc6a5705527e9f021662210cbed  supervisor.lykn
42b874c7cfdaea43ba4b4c7533c067bff7993a97e9efbdc59edeed1eb4117ae6  supervisor.js
af2e2d3db865a00403d242d50ef2914b119914a928f63bd3ed221f46d369a1dd  audit.lykn
72e6b2390b9e04782cafa40676ca2fd62ab0ab5313ba9a399e79699859e7c718  audit.js
1008a8ed5a78feb7d91a83f6e044f1e7c7e28f84dafd7e0bc46f1408cbdce91c  inputs.json
81d8ec7aca2dd72ccb4ee1d396b67ba60130783a2bbb02911ce81284b01d3813  project.json
31701539b90a70c921fce96ab7cd8c6a4ee74d888ffc30c4c1e6d6ebc3f9031f  deno.lock
```

Generated JavaScript is retained only as evidence in the packet and scratch;
there is no hand-edited generated source in this planning scope.

Final packet verification: 296 retained files, 888 extraction checks, followed
by the same 2,592 comparison checks against the extracted original matrix.
The final packet therefore carries the original evidence needed by compare;
its raw process/stream records do not depend on the original temporary roots.
