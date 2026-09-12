# Baseline, launch and replay — J2-L01

CC-attested on 2026-09-12. The independent prerequisite is [Arc03 CDC](../../../arc03-findings-and-integration/slice01-run-permissions/cdc-verification.md), not this report. Selected CLI source `release/0.6.x` commit `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree `1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`; source status clean before and after. CLI reports `lykn 0.6.0-dev`.

- CLI `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn`, SHA-256 `5efc8299cc005e977c4d33304f3c9f7062bc4eeb0038c93136a95dccdbaceb86`.
- Deno `/opt/homebrew/bin/deno`, 2.7.7; SHA-256 `103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.
- V8 `14.6.202.9-rusty`, TypeScript `5.9.2`; macOS15.7.9 build24G830, Darwin arm64; disposable files on APFS (`df -T apfs`).
- Actual seed `/private/tmp/lykn-p07-trial.0qqwa5_8`; each format attempt `runs/<ID>-<attempt>` was new. Scratch retained pending review; durable evidence does not depend on it.
- Planning started at `181b32f`; unrelated concurrent release-runbook commit `21a3602` appeared during work and was preserved. Main/release0.7/release0.8 remained `1b74783`/`74a90d5`/`0f3c28c`. No source, book or dependency adoption edits.
- Agent: Codex/Sofie, GPT-6 per session; exact model build/sampling controls unavailable. Same author performed all work; no independent-verifier or human-acceptance claim.

## Own-harness launcher controls

Raw `launch-preflight` records retain exact argv/environment/stdout/stderr. Materialize CONTROL bytes first under explicit write permission; no-grant read then exited1 with Deno NotCapable requiring read permission; adding only `--allow-read=./inputs` exited0 and printed CONTROL. This was actual Deno, not a missing-file error.

A separately labeled fake `deno` argv recorder (`printf '%s\0' "$@"`) received:

```text
run --config /private/tmp/lykn-p07-trial.0qqwa5_8/project.json
--allow-read=./inputs --allow-write=./outputs --no-prompt --
/private/tmp/lykn-p07-trial.0qqwa5_8/target/lykn/run/cases.js control-read --allow-all
```

The final allow-all is script data after `--` and FILE; no implicit grant was inserted. Fake PATH applied only to this recorder; real trials use `/opt/homebrew/bin:/usr/bin:/bin`. This supports the shared forwarding route, not an assertion that every child's effective argv was separately intercepted.

Parser cases receive no application grants. J-01/J-17 grants and malformed-file grants are exactly `flags` in inputs.json; setup materializes with write access to inputs/outputs. Supervisor separately receives read/write to its one seed and run access to selected CLI, time, ps and kill. No application net/env/run grants, no -A. The CLI's trusted compilation reads/writes its scratch build independently of Deno's application permissions.

Every child clears inherited environment and uses scratch HOME/TMPDIR/DENO_DIR, DENO_NO_UPDATE_CHECK=1, NO_COLOR=1 and null stdin. Native effective project.json is `{}`; literal dynamic package imports are not executed. Package/stress copy exact map/lock/cache and request cached-only/frozen=true. Each record contains effective config, exact child command, scopes and environment.

## Package setup

Infrastructure only (no package program executed): pinned Deno `cache --no-npm --config project.json --lock=deno.lock cases.js`, then `info --no-npm --frozen=true --config project.json --json cases.js`. Both exit0. Fresh dedicated cache fetched three JSR packages, zero npm packages. Graph has 13 ESM modules including local compiled harness; no errors or node:/npm: edges. It includes literal dynamic imports. Full actual output is [dependency-graph.txt](dependency-graph.txt); [deno.lock](deno.lock) retains package integrities and transitive resolutions: jsonc ^json1.0.2→1.1.0 and json ^streams1.1.0→1.1.2. Cached-only means this run did not need downloads; cold-cache offline behavior remains Slice04.

## Supervisor preflight and limitation

Initial host sandbox denied `/bin/ps` (OS error1); no format case ran. Its stderr is retained. A targeted process check found no experiment child left. The rerun used approved host process observation with unchanged Deno grants. This is a host sandbox constraint, not a Lykn permission failure. The same control directories were reused after that failed preflight; all completed controls and format attempts have separate IDs.

Timeout: checkpoint busy-loop reached, stopped wall at600.060417ms, exit137. Output: stopped output, retained at most4096 combined bytes, exit137. RSS: stopped at deliberately tiny1KiB threshold, exit137 (tests observer/termination, not large allocation). All had nonzero sampled tree RSS and no live known PID after termination. Control raw records retain targets, kill results and process samples. Standard wall 10s, output 16MiB and sampled RSS 512MiB thresholds were not hit by stress. Poll interval25ms plus process-observation/kill overhead; not hard real-time or hard memory limits. Process names outside the owned tree are not retained.

## Replay from retained inputs

Use a fresh directory each replay. Run on the pinned native host or explicitly record drift. Host process observation must be available; if ps is denied, stop and use the host's authorized execution route. Do not remove the observer or grant -A. Set `artifact_dir` to the absolute committed artifacts directory before changing cwd:

```sh
artifact_dir=/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project07-core-library-research/arc01-format-runtime-evidence/slice02-json-behavior/artifacts
trial_dir=$(mktemp -d /private/tmp/lykn-p07-trial.XXXXXX)
research_cli=/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn
research_deno=/opt/homebrew/bin/deno
cp "$artifact_dir/cases.lykn" "$artifact_dir/supervisor.lykn" "$artifact_dir/inputs.json" "$trial_dir/"
mkdir -p "$trial_dir/home" "$trial_dir/tmp" "$trial_dir/cache" "$trial_dir/inputs" "$trial_dir/outputs"
printf '{}\n' > "$trial_dir/project.json"
cd "$trial_dir"
research_env() {
  env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$trial_dir/home" TMPDIR="$trial_dir/tmp" DENO_DIR="$trial_dir/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 "$@"
}
research_env "$research_cli" check cases.lykn
research_env "$research_cli" lint cases.lykn
research_env "$research_cli" compile cases.lykn -o cases.js
research_env "$research_cli" check supervisor.lykn
research_env "$research_cli" lint supervisor.lykn
research_env "$research_cli" compile supervisor.lykn -o supervisor.js
research_env "$research_cli" run --no-prompt --allow-write=./inputs cases.lykn materialize '[{"path":"inputs/control.txt","hex":"434f4e54524f4c"}]'
research_env "$research_cli" run --no-prompt cases.lykn control-read
# Expect exit1 above; do not run this script with implicit errexit.
research_env "$research_cli" run --no-prompt --allow-read=./inputs cases.lykn control-read
supervise() {
  research_env "$research_cli" run --no-prompt --allow-read="$trial_dir" --allow-write="$trial_dir" --allow-run="/usr/bin/time,/bin/ps,/bin/kill,$research_cli" supervisor.lykn "$1"
}
supervise controls > controls.jsonl 2> controls.stderr
# Require exit0 and all three exact stop reasons, no survivors, nonzero RSS.
supervise native > native.jsonl 2> native.stderr
cp "$artifact_dir/project.json" "$artifact_dir/deno.lock" .
research_env "$research_deno" cache --no-npm --frozen=true --config project.json --lock=deno.lock cases.js
research_env "$research_deno" info --no-npm --frozen=true --config project.json --json cases.js > dependency-graph.json
# Inspect complete graph and preserve it before extension execution.
supervise package > package.jsonl 2> package.stderr
supervise stress > stress.jsonl 2> stress.stderr
```

Retain each command status separately. Expected counts: controls 3; native 220; package 86; stress 48. Never rerun a completed group in the same seed: immutable attempt directories, restrictive fixture modes and createNew siblings are intentional. Inspect raw records for stop reasons, errors, filesystem effects and framing prefixes; exit0 alone is not a semantic oracle. Match identities below, deterministic stdout pairs and independently stated manifest invariants; compare resource ranges descriptively.

## Retained artifact identities

| Artifact | SHA-256 |
| --- | --- |
| cases.lykn | `5c024493b3bdab99a04e5844ed001cdd20825d6fd06d1cd3b24e322cdf1aca25` |
| supervisor.lykn | `a8347100f4e3f95fe649a2014dfc2d748e793dbffc7828ae455f0020d1834392` |
| inputs.json | `37a61ee952c563271f1bdaedb4bdd14e4a973675d904bb408e9e691602523bcb` |
| project.json | `8b366b66ac5947611bbc2d5817948b4a6312255a3b17bbf0737ac613e648ad22` |
| deno.lock | `313133e65c7b6d72392fe566fb03b231d1b80708a5edecfa4e7b5f155ac1075f` |

Compiled cases.js SHA-256 `a528ce3038f0e1989f66ddaf49b6154e4e226e2a25866dc30d2166176de446f2`; compiled supervisor.js SHA-256 `d76bcd3288dd83ddaeedf00dedf177ebde1bfbce56d76f4d3efc580ff4448e2f`. Complete generated files are retained in raw-transcript.txt; never edit them to make a replay pass.
