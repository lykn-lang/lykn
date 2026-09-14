# RC01 baseline and replay protocol

2026-09-14, CC/Sofie. Two complete runtime conditions passed; independent CDC
and the separate parent DB composition review remain owed.

| Identity | Frozen value |
| --- | --- |
| Planning start | 1ea48fe, clean |
| Source / tree | 4dded883bbd321d19635e6fce233343f33803f9e / 218b085176053f1273642496cf75d7691c399f6e |
| Reused accepted CLI | /private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn |
| CLI SHA-256 | d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326 |
| Deno | /opt/homebrew/bin/deno, 2.9.6 |
| Deno SHA-256 | 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74 |
| Scratch | /private/tmp/lykn-p07-rc.YHfniq, separate primary/replay roots |
| Existing second filesystem | /Volumes/Games01/lykn-p07-rc.Fq9WYU, exclusive primary/replay children |
| Device IDs | primary 16777233; source-temp filesystem 16777245 |

No new build or source change is claimed. Live source identity matches; other
installed CLI hashes are inventoried separately. Only Deno 2.9.6 was found in
the bounded PATH/Homebrew inventory. Removed 2.7.7 remains historical; another
supported, attributable pair is unavailable. The operator supplies an existing
pair and provenance before CDC freezes a comparison. No installation follows.

The pretrial freeze starts from DB work02, preserves 47 candidates, 48 original
expansions/103 attempts, 11 static rows and nine verbatim FM01 R rows, then adds
FF-source-read-denied twice: 49 expansions/105 attempts per condition.
[inputs.json](inputs.json) is primary; the packet retains the independent replay
manifest and original work02 manifest. Source/grant changes are enumerated in
the packet's `composition.json`, not silently applied to the historical records.
Legacy fields such as original `lockSha256` remain provenance; the exact actual
`config`/`lock` strings, before/after records and frozen source map define each
operational condition.

Native tools use [project.json](project.json) = `{}` plus LF and
[deno.lock](deno.lock) = `{"version":"5"}` plus LF. Package cases use the separate
frozen transport config/resolved lock in the packet: std/json 1.1.0, jsonc 1.0.2,
yaml 1.2.0, streams 1.1.2 and bytes 1.0.6. Each condition prefetches twice into new
caches. Only its first successful prefetch cache seeds warm attempts; empty-cache
offline failures receive none. Graph/transport controls do not evaluate modules.

The unchanged cases and package sources run through the FF supervisor's reviewed
file/ownership/cleanup mechanism with full DB dispatch restored. The NUL argv
recorder delegates to the real pinned Deno and preserves stdin. Lykn checks 188
actual arrays, exact generated script/argument separation and gate/emitted hashes.
No grant is inferred from a printed intended command. The original null-stdin,
cleared environment and no-prompt contracts remain. Literal stdin and option-like
argument controls retain [launcher CDC](../../../arc03-findings-and-integration/slice06-deno-launch-compatibility/cdc-verification.md)
provenance; those historical tests are not added to this slice's fresh count.

Budgets are unchanged: normal stop 9s/deadline 10s, output 16MiB, sampled tree RSS
512MiB, bounded process/observation/error/cleanup counts and original inspection
limits. Host observation was preflighted through the authorized host route.
Children receive null stdin and cleared environment, explicit runtime grants,
fresh HOME/TMPDIR/CWD/cache and cached-only/frozen execution after prefetch.
Cross-filesystem grants name both rename paths; denial controls omit source read
only. Live aftermath and exact source-temp copies precede cleanup. Original
Slice04 orphan paths are never read or cleaned during replay.

## Complete fresh execution route

Copy only `cases.lykn`, `package.lykn`, `supervisor.lykn`, `audit.lykn`,
`freeze.lykn`, `graph-entry.lykn`, `missing-package.lykn`, `missing-subpath.lykn`,
`parent-inputs.json`, `inventory.json`, native project/lock and compiler-path.txt
from the extracted primary into a new root; copy `recorder/deno` and only the
transport project.json/resolved.lock. Create empty home/tmp/cache/gates and make
the recorder executable. No runs, markers, negative copies or caches are inputs.

Rehash the accepted CLI/runtime. Rebuild only the exact authorized source if the
accepted isolated binary is absent, following Slice04's locked build contract.
Record its actual binary hash. Set compiler-path.txt to that accepted path;
freeze regenerates nested-worker grants. Allocate a new exclusive child on an
already mounted distinct filesystem and put its path in cross-root.txt. If no
suitable filesystem is available, preserve the unrun OS/denial cells and their
re-entry; never create a mount. Check/lint/compile all eight Lykn sources and
review their emitted bytes before freezing.

From that new root, use the cleared environment below for every call. Freeze:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$RC_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read="./,$RC_CROSS_PARENT" --allow-write="./inputs.json,$RC_CROSS_PARENT" \
 freeze.lykn </dev/null
```

`RC_CROSS_PARENT` is the newly owned second-filesystem parent; `RC_CROSS` is the
exact child written to cross-root.txt. Run supervisor groups in order: controls,
prefetch, native, resolution, resources, files, denial, observers, cancellation.
Every group must pass. After prefetch, copy only `runs/R-04-prefetch-1/cache` to
the previously absent `transport/cache`. The tested supervisor invocation is:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$RC_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read="./,$RC_CROSS" --allow-write="./,$RC_CROSS" \
 --allow-run="$RC_CLI,/opt/homebrew/bin/deno,/usr/bin/time,/bin/ps,/bin/kill,/bin/ln" \
 supervisor.lykn "$RC_GROUP" </dev/null
```

Outer host execution may require the authorized host route for ps/kill and
Games01. This does not widen Deno child permissions. Stop on any failed group;
preserve it before correction. After all groups, run `audit.lykn negative`,
`report`, `crosswalk` with read=./ and write=./negative,./summary.json using the
same native environment. Expected: 105 records, five negative families/118
checks, report/4,126 checks and crosswalk/5,775 checks over 304 fixtures/four
source copies. Repeat this entire route in another fresh root before proposing
completion. Both complete conditions ran here with the identical source map.

## Captured replay

The [raw packet](raw-transcript.txt) uses the unchanged Slice04 gzip-hex packet
tool, not this slice's runtime [audit.lykn](audit.lykn). Bootstrap with
[Slice04's capture audit](../../slice04-dependency-and-runtime-boundary/artifacts/audit.lykn),
native empty config/lock and new home/tmp/cache. Rehash and gate that tool first.
Copy it as `packet.lykn` beside the packet, then from that scratch directory:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 "$RC_CLI" run --no-prompt --cached-only --frozen=true \
 --allow-read=./raw-transcript.txt --allow-write=./extracted \
 packet.lykn extract raw-transcript.txt extracted </dev/null

RC_ROOT="$PWD/extracted/payload" RC_LOGS="$PWD/replay-logs" \
 RC_CLI="$RC_CLI" /bin/bash extracted/payload/meta/replay-captured.sh
```

The retained script restores the explicit directory manifest, recreates all ten
negative copies, regenerates both complete reports, verifies their physical
records, reproduces history/composition/measurement artifacts byte-for-byte,
reruns all 163 historical DB audit outcomes and both 37-record FF crosswalks.
It grants no historical absolute paths. Directory restoration is part of the
protocol because the packet stores regular files; it does not recreate original
mode bits. Live metadata checks and captured metadata/bytes are distinct.

Final packet counts and the actual fresh extraction receipt are recorded in the
[closing report](../closing-report.md). The packet cannot contain its own seal
receipt. Original history, both failures, raw records, helpers/gates, source-cache
copies, exact configs/locks and commands survive within it.
