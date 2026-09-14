# FF01 baseline and replay protocol

CC evidence, 2026-09-13; all six FF rows are proposed-done, pending independent
CDC. This is Slice08's reviewed native file-fault subset. Slice04 remains stopped
with all eight DB rows open and its nine-failure history unchanged.

| Pin | Identity |
| --- | --- |
| Planning start | 8cdce4f, clean planning worktree |
| Immutable compiler source | 4dded883bbd321d19635e6fce233343f33803f9e |
| Accepted isolated CLI SHA-256 | d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326 |
| Runtime | /opt/homebrew/bin/deno 2.9.6; V8 15.0.245.2-rusty; TypeScript 6.0.3 |
| Deno SHA-256 | 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74 |
| Parent packet | Slice04 at e1e8f0d; beb47407afaa2effbcd12c95206fff2f426556afb585aba37e4f1a82e95ed94f |
| Native cases SHA-256 | 30c2b33eeca212bc54f6fc1e74e53b276af981058c93934fe484974aa8a096f7 |
| FF supervisor SHA-256 | 8c4e6d9b79199e1f2d8f8c30d867d8aa7e7edc6f6da49ed090b23c2ca59ee0a2 |
| FF runtime audit SHA-256 | 501a7090c72d89194fe0670cab9c0e2906eb23e6f6901aa828fd5e541269724a |
| FF manifest generator SHA-256 | d9333a36df30ddc4ba3bca68efd238bf6885cc39d17002959888e2e710506cd5 |

The previously independently built isolated CLI was rehashed and reused; no new
source build is claimed. Parent evidence was freshly extracted and verified:
3,997 files and 11,991 checks. Exact work02 cases/supervisor/audit were the inputs;
the invalid Slice04 helper was not used. The new cases are byte-identical to
work02; changes are in FF supervision, manifest and audit logic. Source and
registered worktrees were not modified.

[inputs.json](inputs.json) freezes 21 variants/37 attempts for primary; the
packet preserves the separately frozen fresh manifest. Both use identical
source hashes and original IDs. Changed condition fields are new absolute
fixture roots, timestamps and actual observation metadata. Native
[project.json](project.json) is `{}` plus LF; [deno.lock](deno.lock) is
`{"version":"5"}` plus LF. There are no imports, package graphs or network runs.

The independent variable is the file-operation condition: normal replacement,
declared injection, actual directory/cross-device fault or source-read denial.
The compiler/runtime, candidate bytes, observer protocol, semantic expectations,
repeats and budgets are fixed. Both cross-device branches were declared before
execution. This host exercised only the genuine OS-error branch; the success
branch is reviewed code, not a measured success result. Prior knowledge and
informed guide use mean this is not a blinded authoring experiment.

Each complete condition has 12 fault trials, 23 controls/regressions and two
separately named source-read denials. All 37 ran, with five separate negative
audit families afterward. Normal external stop is 9s, deadline 10s, output
16MiB, sampled process-tree RSS 512MiB, with smaller deliberate stop controls.
Stdin is null; environment is cleared; no prompt, cached-only and frozen flags
are explicit. Process ownership includes birth identity and bounded cleanup.
Recorded sampling limits do not establish true peak RSS or universal atomicity.

New exclusive second-filesystem root:
`/Volumes/Games01/lykn-p07-ff.J4VEAG`, with primary/replay children. Device IDs
were 16777245 versus 16777233 for primary scratch. Every absolute temp path was
frozen before launch; candidates received read/write for `./outputs` and only
that attempt's source temp. Denial controls omitted only source read. Parent
device/mode metadata, actual argv/grants, lstat/type/mode and bytes/absence are
recorded. Host ps/kill and isolated `/bin/ln` have explicit run grants. The old
Slice04 orphan root was untouched. All eight new cross-filesystem/denial temps
were captured, live-audited, copied into evidence and then removed with timestamped
absence receipts; other fixtures remain retained in isolated scratch.

## Packet and tested captured replay

[raw-transcript.txt](raw-transcript.txt) is a lossless gzip-hex JSONL packet:
1,307 files, 20,406,340 decoded bytes, 3,246,393 encoded bytes, SHA-256
`dc38580712fa4762ffd6978e420b6c2d478d2ba1388befd1dd0b9edca820d17f`.
Packing and fresh extraction each passed 3,921 safe-path/length/hash checks.
Each entry carries its original byte count and SHA-256. The source capture tool
is unchanged from Slice04; it is distinct from this slice's top-level runtime
[audit.lykn](audit.lykn). The packet retains it as `payload/meta/packet.lykn`;
bootstrap with [Slice04's capture audit](../../slice04-dependency-and-runtime-boundary/artifacts/audit.lykn).
Do not run the FF auditor as the gzip extraction tool.

The packet contains `primary/` and `replay/`, their manifests, sources, native
configs/locks, gates/failed drafts, all 74 process records and actual fixtures,
10 labeled negative copies/results, cleanup receipts and raw logs. It also
contains `meta/replay.md`, original work02 hashes, opening plan/prompt/ledger,
parent ledger and authoring record. Ambient caches/home/tmp are excluded;
source/config/lock/emitted files needed for the crosswalk are retained.

The tested fresh extraction ran from
`/private/tmp/lykn-p07-ff.DOVJ47/capture`, containing the Slice04 capture audit,
native config/lock, packet and fresh `extracted/`, `home/`, `tmp/`, `cache/`:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 /private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn run \
 --no-prompt --cached-only --frozen=true --allow-read=./raw-transcript.txt \
 --allow-write=./extracted audit.lykn extract raw-transcript.txt extracted </dev/null
```

From each extracted `payload/primary` and `payload/replay` directory, create
native home/tmp/cache and run its unchanged FF audit:

```sh
env -i PATH=/opt/homebrew/bin:/usr/bin:/bin HOME="$PWD/home" TMPDIR="$PWD/tmp" \
 DENO_DIR="$PWD/cache" DENO_NO_UPDATE_CHECK=1 NO_COLOR=1 \
 /private/tmp/lykn-p07-db-final.LuQhzp/source/target/release/lykn run \
 --no-prompt --cached-only --frozen=true --allow-read=./ audit.lykn crosswalk </dev/null
```

Each extracted condition passed 2,319 checks across 37 records, 146 physical
fixtures and four actual source-temp byte copies. This reruns semantic checks
and proves exact record/fixture sets and source/config/lock/emitted/fixture
bytes. Original live audits separately check actual modes/types/link targets;
extraction does not recreate original filesystem metadata. Captured replay must
not grant or follow historical external temp paths.

The five negative families were also recreated in each extracted condition:
rename only its extracted `negative` directory to `retained-negative`, then
run `audit.lykn negative` with `--allow-read=./ --allow-write=./negative`.
Both runs passed 114 checks and reproduced original `results.json` byte-for-byte.
Post-seal extraction receipts are reported here; the packet cannot contain its
own final seal receipts. Pre-seal primary/fresh checks and all sources are inside.

## Tested complete fresh runtime route

The actual fresh condition was built by copying only cases/supervisor/audit,
freeze.lykn, parent-inputs.json, native project/lock and compiler-path.txt from
primary into `replay/`, with empty home/tmp/cache and a new cross-root.txt.
No markers, records or negative outputs were carried forward. `meta/replay.md`
inside the packet specifies the portable recreation and unavailable-filesystem
stop rule. Substitute new exclusive roots; never reuse an existing run directory.

Freeze using `freeze.lykn`, read=./ plus the exact new second-filesystem child,
write=./inputs.json plus that child. Run supervisor groups in order: controls,
files, denial, observers, cancellation. The tested outer run uses the cleared
environment/null stdin above, `--no-prompt --cached-only --frozen=true`,
read/write=./ plus that owned child, and explicit allow-run for the accepted
CLI, `/usr/bin/time`, `/bin/ps`, `/bin/kill`, `/bin/ln`. Candidate permissions are
separately frozen and checked against each recorded actual command.
Every group must pass before progressing. Then run `audit.lykn negative`,
`report`, `crosswalk`, read=./ and write=./negative,./summary.json. Required
receipts per condition: 37 attempts, five negatives/114 checks, report/1,630
checks, crosswalk/2,319 checks. Preserve any failed condition before correction.
