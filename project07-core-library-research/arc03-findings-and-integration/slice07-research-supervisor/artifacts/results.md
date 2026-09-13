# SH01 results

2026-09-13, CC attestation. **All six SH criteria are proposed-done; independent
CDC is pending.** This delivers native research supervision, not Slice04's
runtime/dependency research or a package-adoption decision.

## Primary condition and fresh replay

| Group | Primary attempts | Observation |
| --- | ---: | --- |
| SH-CAP | 5 | Wall/output/RSS stops, actual precompile absence, inherited-pipe cleanup after root exit and injected observation failure all pass |
| SH-NATIVE | 18 | Minimal/parser no-grant success; allowed read/write exact bytes; denied read/write/env/net/run return actual NotCapable |
| SH-OBSERVER / SH-CONCURRENT | 6 | Partial-write control detected 32,768 bytes; replacement observations include old and complete A/B states; worker exits and final bytes agree |
| SH-CANCEL | 4 | Both before/after rename checkpoints independently observed; external termination, old/new destination and complete orphan state verified |
| Synthetic SH-AUDIT | 5 copies | Missing observations, incorrect checkpoint hash, wrong denial class, survivor evidence and changed lock each rejected for its intended reason |

The primary run is `payload/work03/`. The literal fresh replay under
`payload/replay/` independently of that run's roots repeated all **33 process
attempts and five negative controls** successfully. Both are CC-performed
runs; this is not independent CDC. All three emitted files match byte-for-byte.
Each positive attempt's semantic audit checked actual live fixture bytes and
modes before its group's verified marker could be written.

Each complete retained-record report passed **1,255 checks**; each negative
suite passed **96 checks**. An additional native crosswalk read **128 fixture
files and 33 source copies**, passing **229 checks**. Counts describe separate
checks and populations; do not add inherited or superseded runs to the primary
33-attempt denominator. Before/after config and lock bytes remain unchanged.

The parent-exit control's root exits 0 while its registered nested child keeps
an inherited output pipe open. The watchdog remains active, kills the remaining
owned process tree at the declared bound, drains the streams and observes no
survivors. The observation-failure control records
`SH_INJECTED_OBSERVATION_FAILURE` and uses a fresh working host observation for
cleanup. The RSS control records compiled output as null, rather than failing
while trying to hash a nonexistent file. No empty kill invocation occurs.

Cancellation before rename preserves the nine-byte `ORIGINAL\n` destination
and leaves the complete 65,537-byte A candidate in `replacement.tmp`.
Cancellation after rename leaves the complete A destination. Both preserve
the independently observed checkpoint and immediate aftermath; modes are
recorded. The final source refreshes ownership when a checkpoint appears,
preventing a marker/process-snapshot sampling race.

These results establish the declared bounded protocol on this macOS/Deno/CLI
condition. They do not establish universal atomicity, crash durability, conflict
policy, a hard allocation limit or kernel-failure tolerance. Sampled tree RSS
and wall time retain their units; `/usr/bin/time -l` streams are preserved.
CPU/time summaries can be unavailable when the time wrapper itself is killed;
no missing statistic is fabricated. Error/sample/process/output recording is
bounded separately from the child operation.

## Superseded evidence and exact scope

`payload/work/` retains three control attempts (two pass, one fails precompile
absence). `payload/work02/` retains 30 attempts (five controls, 18 native and six
observer checks pass; first cancellation fails). The remaining variants and
repetitions stopped in each failed condition and were executed only after a
named correction and new freeze/root. Thus the packet retains **33 superseded,
33 primary and 33 fresh-replay process attempts**, 99 total, with provenance
kept separate. Earlier partial negative-audit output is also retained and does
not count as a completed five-control suite.

Four source/emission review failures and two failed runtime control conditions
are retained: **six against the operator-authorized maximum of eight**. Two
command/protocol mistakes are recorded separately in
[authoring-observations.md](authoring-observations.md). Slice04's four historical
source failures are not reset or charged here. No generated JS was edited.

All eight DB rows, all R-01–09 and 47 candidate IDs/expansions remain with
Slice04. Its complete operational freeze, package/toolchain graphs, resolution/
offline matrix, package permissions, full replacement/fault/resource work,
available-pair disposition and document-route decision still precede closure.
All 36 unsupported Y-13 cells, 28 gated Y-14 variants and existing guide/book/
compiler/formatter/ADT/operator code-shape owners remain. No source change,
package execution, installation, mount, propagation or publication occurred.

## Evidence and replay

[raw-transcript.txt](raw-transcript.txt) is the lossless Lykn-generated packet.
It contains `payload/meta/` pins, opening contract, failed-gate evidence and
replay infrastructure; `payload/logs/` complete invocation streams/receipts;
and the four execution directories described above, including source/emitted
files, exact manifests/configs/locks, per-attempt records and actual fixtures.
Private cache/HOME/TMP directories are excluded from the byte-copy payload;
they began empty and no imports or dependency transport occurred. Generated
programs, every original failed source, and all recorded streams are retained.

Fresh replay: use the accepted immutable build and verify both pinned binary
hashes in [baseline-and-protocol.md](baseline-and-protocol.md). Extract the
packet as below, inspect `payload/meta/fresh-replay.sh` and its emitted sources,
then run with `SH_CLI`, `SH_ARTIFACTS` and a nonexistent `SH_REPLAY` absolute
path. The script performs source gates, native freeze, all four gated groups,
negative controls and retained audit. Its literal route was tested to completion.
Host observation/termination requires the authorized host route; do not treat
a sandbox ps denial as a package or supervisor result.

```sh
SH_CLI=/absolute/path/to/accepted/lykn \
SH_ARTIFACTS=/absolute/path/to/this/artifacts \
SH_REPLAY=/private/tmp/a-new-sh-replay-root \
  /bin/bash /absolute/extraction/payload/meta/fresh-replay.sh
```

Captured replay: in a new directory, copy the committed `audit.lykn`,
`project.json` and `deno.lock`; create `home`, `tmp`, `cache`. Set `SH_PACKET`
and `SH_CLI` to absolute paths. The extraction destination must not exist.

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" \
  TMPDIR="$PWD/tmp" DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  "$SH_CLI" run --no-prompt --cached-only --frozen=true \
  "--allow-read=$SH_PACKET" "--allow-write=$PWD/extracted" \
  audit.lykn extract "$SH_PACKET" "$PWD/extracted" </dev/null
```

From the extraction directory used above, run:

```sh
cd extracted/payload/work03
mkdir home tmp cache
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" \
  TMPDIR="$PWD/tmp" DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  "$SH_CLI" run --no-prompt --cached-only --frozen=true \
  --allow-read=./ --allow-write=./summary.json audit.lykn report </dev/null
cp ../meta/check-handoff.lykn ./check-handoff.lykn
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" \
  TMPDIR="$PWD/tmp" DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
  "$SH_CLI" run --no-prompt --cached-only --frozen=true \
  --allow-read=./ check-handoff.lykn captured "$PWD" </dev/null
```

The extracted report passed 33 attempts, five negative controls and 1,255
checks. The extracted-file crosswalk passed 33 attempts, 128 fixture files
and 229 checks. Packing and fresh extraction each passed 5,244 checks over
1,748 files and 19,146,147 decoded bytes. Both captured routes are tested;
the packet hash and post-seal receipts are recorded in the closing report.
