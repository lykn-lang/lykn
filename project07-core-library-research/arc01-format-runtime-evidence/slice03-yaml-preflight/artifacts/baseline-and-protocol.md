# YAML baseline and protocol — YP-B01

Question: can the pinned Lykn condition generate, supervise and audit small
YAML sentinels while preserving every full-matrix obligation? This preparation
checks harness readiness, not library adoption or full YAML fidelity.
RP01/FM01/AE01 apply, with the explicit Slice03/05/06/04/07 decomposition.

## Build and environment

Source: immutable `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree
`1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`. Exported with git archive from
planning root into `/private/tmp/lykn-p07-yaml-source.NpSvJJ`; built there using
`cargo build --release --locked`, exit0. No source checkout or shared binary
was reset/rebuilt. Fresh executable:
`/private/tmp/lykn-p07-yaml-source.NpSvJJ/target/release/lykn`, SHA-256
`78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`.
This matches the prior CDC isolated build; it is not the original CC binary.
Cargo/rustc 1.97.0, default release profile, inherited build environment, no
command-added RUSTFLAGS/profile overrides. Build stdout/stderr and rustc -Vv
are in the transcript; cache reuse means a fresh directory, not a cold Cargo
cache experiment. Compiler byte identity is checked separately from version.

Deno `/opt/homebrew/bin/deno`,2.7.7; SHA-256
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`;
V8 14.6.202.9-rusty, TypeScript 5.9.2. macOS 15.7.9 Darwin arm64, APFS scratch.
Planning started at c2efe26. Shared release/0.6.x was 65ff40f and clean when
inspected; earlier JSON source/binary pins were therefore not blindly reused.

Actual trial root `/private/tmp/lykn-p07-yaml-trial.vw3Kjl`; each supervised
attempt uses a fresh runs/ID-attempt directory. Every runtime/evidence program
uses this isolated CLI through lykn run. Each child clears inherited env and
has PATH `/opt/homebrew/bin:/usr/bin:/bin`, scratch HOME/TMPDIR/DENO_DIR,
DENO_NO_UPDATE_CHECK=1, NO_COLOR=1, null stdin and no-prompt. Case records
retain UTC start/end, command, exact scopes, source/emitted hashes,
stdout/stderr text/hex/hash, exit/signal, process samples and file states.
Model: Codex/GPT-6 per session; exact backend build/sampling settings unavailable.

## Dependency graph and options

[project.json](project.json) maps only @std/yaml to jsr:@std/yaml@1.2.0.
Actual fresh cache resolution and deno info graph preceded YAML execution.
[dependency-graph.json](dependency-graph.json) has26 ESM modules including the
local emitted probe, one JSR package and no Node/npm entries/errors; [deno.lock](deno.lock)
is real and unchanged across all 38 attempts. Package integrity is
`20beb41e4983ba3437dbefac62b14061ab058e8a187596f19d28ff9035f6e6cf`.
Cached-only/frozen=true are explicit for sentinel children. This is not a
cold-offline, development-graph, ancestry or adoption-policy audit; Slice04 owns it.

Actual runtime exports: YamlSyntaxError, parse, parseAll, stringify. Schema
selection is an options string: failsafe/json/core/default/extended, not a
public schema object. Stable parse options are schema, allowDuplicateKeys
(default false) and onWarning; parseAll shares them and returns an array.
Stringify exposes indent, arrayIndent, skipInvalid, flowLevel, styles, schema,
sortKeys, lineWidth, useAnchors, compatMode and condenseFlow. The matrix freezes
relevant schema/duplicate/skipInvalid choices; unspecified style settings use
pinned package defaults. Binary is explicitly unstable in package documentation.
No custom extraTypes or unstable API was imported. Published sources are
retained in the transcript with their paths and hashes.

## Gates and controls

Before infinite-loop controls, /bin/ps observation succeeded on the authorized
host route; supervisor itself calls processes before spawning any controls.
Its run grant names only time, ps, kill and the isolated CLI. Read/write grants
cover the one trial root. Case programs do not inherit these grants.

Materialized CONTROL bytes using explicit fixture-write scope. No-grant
control-read exited1 with NotCapable; granting only read inputs printed CONTROL
and exited0. A separately labeled fake deno recorder captured actual forwarded
argv: grants and no-prompt before `--` and script path; a trailing --allow-all
remained script data. Real trials restored the declared PATH. Replay script
below preserves this distinction.

Wall/output/RSS controls returned expected reasons and exit137, with nonzero
sampled RSS and no observed live owned child. The output control retained at
most4096 combined bytes; wall threshold 500ms and RSS threshold 1KiB deliberately
exercise stopping, not realistic YAML limits. Standard 10s/16MiB/512MiB sampled
thresholds remain unchanged. Snapshot/pipe collection and ps/kill overhead
mean sampled thresholds are not strict real-time/hard-memory enforcement.

## Replay from a fresh export and trial

Run from the planning root. The first attempt at git archive from the Project07
subdirectory failed because that directory did not exist in the historical
source tree; no valid source was exported there. The corrected command below
explicitly uses planning root and pipefail. Do not reuse old attempt directories.

```sh
set -o pipefail
planning_root=/Users/oubiwann/lab/lykn/lang/.worktrees/planning
artifact_dir="$planning_root/project07-core-library-research/arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts"
yaml_source=$(mktemp -d /private/tmp/lykn-p07-yaml-source.XXXXXX)
git -C "$planning_root" archive d0bb981dae2a4abf6c984406c4b2081a45cc92f8 | tar -x -C "$yaml_source"
(cd "$yaml_source" && cargo build --release --locked)
yaml_cli="$yaml_source/target/release/lykn"
shasum -a 256 "$yaml_cli" /opt/homebrew/bin/deno
# Stop and record any hash drift before comparison.
yaml_trial=$(mktemp -d /private/tmp/lykn-p07-yaml-trial.XXXXXX)
cp "$artifact_dir/cases.lykn" "$artifact_dir/supervisor.lykn" "$artifact_dir/audit.lykn" "$artifact_dir/inputs.json" "$yaml_trial/"
mkdir -p "$yaml_trial/home" "$yaml_trial/tmp" "$yaml_trial/cache" "$yaml_trial/inputs" "$yaml_trial/outputs"
printf '%s\n' "$yaml_cli" > "$yaml_trial/compiler-path.txt"
printf '{}\n' > "$yaml_trial/project.json"
cd "$yaml_trial"
yaml_env() {
  env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$yaml_trial/home" TMPDIR="$yaml_trial/tmp" DENO_DIR="$yaml_trial/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$@"
}
for program in cases supervisor audit; do
  yaml_env "$yaml_cli" check "$program.lykn"
  yaml_env "$yaml_cli" lint "$program.lykn"
  yaml_env "$yaml_cli" compile "$program.lykn" -o "$program.js"
done
# Inspect emitted code and keep warnings. No generated-output edits.
yaml_env "$yaml_cli" run --no-prompt --allow-write=./inputs.json,./case-manifest.md audit.lykn freeze
cmp inputs.json "$artifact_dir/inputs.json"
cp "$artifact_dir/project.json" "$artifact_dir/deno.lock" .
yaml_env /opt/homebrew/bin/deno cache --no-npm --frozen=true --config project.json --lock=deno.lock cases.js
yaml_env /opt/homebrew/bin/deno info --no-npm --frozen=true --config project.json --json cases.js > dependency-graph.json
yaml_env "$yaml_cli" run --no-prompt --allow-read=./dependency-graph.json,./deno.lock audit.lykn graph
yaml_env "$yaml_cli" run --no-prompt --allow-write=./inputs cases.lykn materialize '[{"path":"inputs/control.txt","hex":"434f4e54524f4c"}]'
yaml_env "$yaml_cli" run --no-prompt cases.lykn control-read
# Expected exit1; record it separately, not as a shell-script failure to hide.
yaml_env "$yaml_cli" run --no-prompt --allow-read=./inputs cases.lykn control-read
/bin/ps -axo pid,ppid,rss,stat | head -2
# If host observation is denied, stop before controls and obtain the authorized host route.
yaml_supervise() {
  yaml_env "$yaml_cli" run --no-prompt --allow-read="$yaml_trial" --allow-write="$yaml_trial" --allow-run="/usr/bin/time,/bin/ps,/bin/kill,$yaml_cli" supervisor.lykn "$1"
}
yaml_supervise controls > controls.stdout 2> controls.stderr
# Require exit0, three exact stop reasons, no survivors, nonzero RSS, bounded output.
yaml_supervise sentinel > sentinel.stdout 2> sentinel.stderr
yaml_env "$yaml_cli" run --no-prompt --allow-read="$yaml_trial" --allow-write=./byte-audit.md,./sentinel-summary.md audit.lykn audit
```

Record each status separately. Expected controls 3 and sentinel 38 records;
audit 1991 checks. Source freeze must reproduce inputs.json byte-for-byte.
Graph local source/cache paths will differ; remote module identities/lock must
agree. Never invoke sentinel twice in the same trial root.

For the separate argv recorder, before real control execution:

```sh
mkdir -p fake
printf '#!/bin/sh\nprintf '\''%%s\\0'\'' "$@"\n' > fake/deno
chmod +x fake/deno
env -i PATH="$yaml_trial/fake:/opt/homebrew/bin:/usr/bin:/bin" HOME="$yaml_trial/home" TMPDIR="$yaml_trial/tmp" DENO_DIR="$yaml_trial/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$yaml_cli" run --no-prompt --allow-read=./inputs --allow-write=./outputs cases.lykn control-read --allow-all > argv.bin 2> argv.stderr
tr '\000' '\n' < argv.bin
```

Only the fake-recorder command uses fake PATH. It records forwarding, not a
runtime permission test. Source manifest/hash checks and actual denied read
supply the other controls. The full byte/value/graph audit source is retained;
no auxiliary research-language fallback is required.

## Final artifact identities

The supervisor's compiler-path.txt is an explicit replay parameter; retained
program bytes do not change when the verified scratch build path changes.
Final source/manifest identities, from the committed working bytes:

```text
15178cfdd8fbdaa0e1ca85eeef1e719a1570d2c5e76566c3bb84ba3d04aeb3c3  arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts/cases.lykn
ebc50a8d075c10715d439175374e522a30bb11c98e33d1faf6c2b55a402f3f93  arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts/supervisor.lykn
d5936e2b26d2e9ea02190da390795cfa989fe400db665564aa60fbe5bfc689fa  arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts/audit.lykn
012be588e360a46b4458cc2be8ea99448b3314783bc794509df83eeb17e627db  arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts/inputs.json
31701539b90a70c921fce96ab7cd8c6a4ee74d888ffc30c4c1e6d6ebc3f9031f  arc01-format-runtime-evidence/slice03-yaml-preflight/artifacts/deno.lock
```

Final planning audit (Lykn): 20 exact-scope changed paths and 66 local links
passed. For replay, create changed-paths.txt with planning-root-relative paths
from the intended diff, then run the retained audit with mode `planning` and
planning root as its second argument; allow read to that root and trial only.
Fresh freeze regeneration reproduced both inputs.json and case-manifest.md
byte-for-byte. That verifies generator stability, not full-family outcomes.
