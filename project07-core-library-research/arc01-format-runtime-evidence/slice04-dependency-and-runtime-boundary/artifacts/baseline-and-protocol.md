# DB01 preparation and launch blocker

2026-09-13, CC observation. **Slice04 is blocked; no criterion is proposed-done.**
Original scope and budgets remain in [slice-plan.md](../slice-plan.md) and RP01.
This packet records preparation and a newly reproduced launcher incompatibility,
not a completed runtime/dependency experiment.

## Identities and operator intervention

Fresh source export: `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree
`1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`, into
`/private/tmp/lykn-p07-dependency.v8PYzy/source`. The locked release Cargo build
exited zero with Cargo/rustc 1.97.0. CLI SHA-256:
`78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`.
Build logs and identities are retained in the raw packet's meta directory. No registered
source worktree or shared binary was changed.

Before the operator upgrade, Deno was 2.7.7, SHA-256
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.
The operator paused runtime work during the upgrade, then clarified:
“2.7.7 was removed; 2.9.6 was installed!” and “2.9.6 is correct :-)”.
The post-upgrade identity is Deno 2.9.6, V8 15.0.245.2-rusty, TypeScript 6.0.3,
SHA-256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.
This is a separate condition. No fresh 2.7.7/2.9.6 pair comparison exists.
The pinned CI has broad v2.x jobs and a specific 2.7.7 job; that is support
intent, not proof that 2.9.6 launches this compiler's output.

Host: macOS 15.7.9 (24G830), arm64. Registered planning started clean at
ae179ea; source heads and shared binary hashes are in live-identity.txt.
The first PATH inventory used unsupported `command -v -a`; available-paths.txt
contains the corrected `type -a` inventory. This infrastructure correction is
not a research result. Games01 was already mounted; an exclusive empty directory
was created there for R-07 and removed after the launch blocker. No mount,
cross-filesystem rename, file fault or cancellation trial occurred.

## Minimal replay of the blocker

Build the immutable source above in a new scratch root using `git archive`
from the planning root and `cargo build --release --locked`. Verify both binary
hashes first. Create a fresh directory for each invocation, containing
`project.json` with `{}` and this exact UTF-8/LF `minimal.lykn`:

```lykn
(console:log "DB-MINIMAL-EXECUTED")
```

Run check, lint and compile with the pinned absolute CLI. Inspect the emitted
`console.log("DB-MINIMAL-EXECUTED");`. Then, with `db_cli` and `db_trial` set to
those new absolute paths, use:

```sh
cd "$db_trial"
mkdir home tmp cache
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$db_trial/home" \
  TMPDIR="$db_trial/tmp" DENO_DIR="$db_trial/cache" \
  DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  "$db_cli" run --no-prompt --cached-only --frozen=true minimal.lykn \
  >run.stdout 2>run.stderr < /dev/null
printf '%s\n' "$?" > run.exit
```

This literal route ran twice in fresh directories and exited 1 both times,
printing a missing-script/task-list message; the program marker was absent.
After the operator suggested `--allow-all`, two more fresh runs added that
explicit flag and produced the same failure. This permission control is
operator-authorized and is not an injected default or a policy decision about
every later denial case. It establishes that the observed launch failure is
not repaired by granting all permissions.

The attempted Lykn `audit.lykn freeze` invocation also exited 1 before running
its body. Its compiled source is retained. Thus inputs.json, merged deno.lock,
package.lykn and the generated case manifest were **not** produced by that run. Subsequent
package source gates encountered the absent file; their failures are retained
as a dependent invocation mistake, not a package/compiler observation.

The operator then suggested `deno eval`. The exact compiled minimal program
printed its marker and exited zero through eval. With this explicit alternate
route, the native Lykn audit generated a candidate 47-variant inventory (three
ownership checks), candidate merged config/lock/package source, and verified all
188 downloaded files against published size/checksum metadata (376 checks).
These successes do not erase the five failed launcher invocations. Eval's
implicit-all permissions are recorded, not mistaken for denied/scoped runtime
evidence. Full operational freeze, resolved runtime/development graphs,
supervision and the matrix remain blocked on the wrapper correction.

For native evidence tooling, compile and inspect audit.lykn, then invoke its
exact emitted bytes with a cleared environment and null stdin:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$db_trial/home" \
  TMPDIR="$db_trial/tmp" DENO_DIR="$db_trial/cache" \
  DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  /opt/homebrew/bin/deno eval --ext=mjs --no-config --no-remote --no-npm \
  --cached-only "$(cat audit.js)" published < /dev/null
```

The shell substitution passes file bytes as one argument; no JavaScript is
hand-authored or modified. No program in this route imports a package.
`published`, `freeze`, `pack OUTPUT` and `extract INPUT DESTINATION` are the
retained modes. Use fresh destinations for packing and extraction. Candidate
generation is explicitly not an execution-ready operational freeze. Extract the
packet into a new empty directory, then replay its published audit independently
of old scratch paths. Full runtime replay still requires the launcher correction.

For captured replay, set `db_artifacts` to this committed artifacts directory,
`db_cli` to the verified pinned CLI, and `db_trial` to a fresh scratch directory.
Compile `audit.lykn` with `"$db_cli" compile "$db_artifacts/audit.lykn" > audit.js`
inside that scratch directory; inspect the emitted file. Create home/tmp/cache
there and an empty `extracted` directory. In the invocation above replace
`published` with `extract "$db_artifacts/raw-transcript.txt" "$db_trial/extracted"`.
After successful extraction, change directory to `extracted`, create its private
home/tmp/cache directories, and reset `db_trial` to that absolute directory.
Run the same eval invocation with `published`, then with `freeze`. Compare
inputs.json, project.json, deno.lock and dependency-graph.json with the committed
candidate artifacts. Compare package.lykn and case-manifest.md with copies made
from the extraction before regeneration. The retained manifest is generated
candidate data; the committed case-manifest.md adds the handoff dispositions.
This extraction and both regeneration modes were tested from a fresh directory;
all six outputs matched the original trial bytes. Counts are in results.md.

## Actual argv and source attribution

The recorder uses the corrected Slice06 CDC shell form:

```sh
cat > deno <<'RECORDER'
#!/bin/sh
printf '%s\0' "$@"
RECORDER
```

Placed first in a disposable PATH, it recorded actual NUL-delimited argv.
Lykn supplies `run`, `--config`, the actual config path, explicit grants,
`--no-prompt`, **`--`**, the absolute compiled script and its argument `freeze`.
The raw binary record is retained in the hex-encoded packet; it is neither split on whitespace nor treated
as evidence of real Deno permissions. The no-grant and explicit-all real launches
above provide the runtime failure evidence.

Pinned Lykn `crates/lykn-cli/src/main.rs` cmd_run deliberately inserts the
separator to protect a leading-hyphen filename. Captured upstream Deno v2.9.6
`libs/cli_parser/src/defs.rs:611` defines script_arg without positional trailing;
`parse.rs:164–187` routes values following this separator into result.trailing;
`convert.rs:1415–1465` looks for script_arg and otherwise requests task listing.
This source path explains the observed message. No patched Deno or Lykn was
built, and no direct-Deno A/B execution was performed. The precise repair is
owned by [Arc03/Slice06](../../../arc03-findings-and-integration/slice06-deno-launch-compatibility/slice-plan.md).

## Required re-entry

Independently verify a launcher correction preserving explicit permissions,
argument bytes, leading-hyphen path safety, configuration and exit propagation.
Record a new immutable compiler identity; retain this original failing pin.
Then return here, review the draft generator, freeze all variants, gate generated
entries, inspect full graphs and locks, and run permission/supervisor controls
before the complete matrix. Fresh runtime and captured-evidence audits remain
owed; replaying this blocker does not satisfy either full-slice route.
