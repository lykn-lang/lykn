# RC01 runtime and resource observations

2026-09-14 CC attestation. RC-01–08 are proposed-done; independent CDC and the
separate DB composition review remain owed. The [protocol](baseline-and-protocol.md)
defines the pins, grants, replay commands and stop rules. All raw sources,
records, graphs, gates and helper outputs are in [raw-transcript.txt](raw-transcript.txt).
Packet paths below are relative to the extracted `payload/`.

## Scope and distinct denominators

| Evidence | Primary | Fresh replay | Meaning |
| --- | --- | --- | --- |
| Original candidates / expansions / intended attempts | 47 / 48 / 103 | 47 / 48 / 103 | Exact original work02 scope |
| Added source-read denial | 1 expansion / 2 attempts | 1 expansion / 2 attempts | FF correction, separate denominator |
| Complete supervised records | 105 | 105 | All intended outcomes verified; expected denials/faults are not successful operations |
| Actual delegated Deno argv captures | 94 | 94 | Real executed arrays; ten transports and one precompile stop per condition are separate |
| Negative audit families / checks | 5 / 118 | 5 / 118 | Synthetic record corruption; not process trials |
| Complete semantic report checks | 4,126 | 4,126 | Full 105-record reports |
| Physical crosswalk checks / fixtures / source-temp copies | 5,775 / 304 / 4 | 5,775 / 304 / 4 | Exact source/emitted/config/lock/input/output and file-state joins |
| Resource trials | 18 | 18 | Three operations, each one warm-up plus five measured |
| Pinned prefetch graphs | 2 | 2 | Each 67 modules; sources/lock/transport retained |

There are 210 new supervised attempts, 36 of them resource attempts. These counts
exclude captured historical records, semantic reruns, static rows and unsupported
cells. Eleven static dispositions and nine verbatim FM01 R rows remain intact.
`composition.json` reports 2,345 checks, with six additional assertions covering
the reporting summaries after that reported count. Both condition manifests and
sources are retained; [inputs.json](inputs.json) publishes the primary manifest.

## Runtime findings

R-01 minimal launches pass twice per condition. `deno-argv.bin` records the actual
`run`, config, grants, no-prompt/cached-only/frozen flags, generated script and
JSON script argument. All 188 arrays match; compilation outputs match the gated
sources. The recorder preserves stdin by `exec`. Null stdin and cleared child
environment remain in the reviewed supervisor. Historical literal-stdin and
option-like argument controls retain Arc03/Slice06 CDC provenance and are not
counted as fresh controls here.

R-03 narrow imports succeed; alias mismatch, missing package/subpath and corrupt
scratch lock retain cause-specific diagnostics. R-04 prefetch succeeds into each
new owned cache; warm cached-only execution succeeds; genuinely empty-cache
execution fails for missing dependencies. Actual before/after frozen lock bytes
match. Four graphs each contain 67 modules. Remote source content matches the
accepted cache after separating the recorded `denoCacheMetadata` suffix; raw
cache bytes and extracted content remain available. Resolver transport authority
does not imply runtime network authority. The static dependency qualification in
[Slice09](../../slice09-dependency-decision-and-reconciliation/artifacts/dependency-inventory.md)
still governs runtime/type/development/example/ancestry distinctions.

R-05 native and YAML parsers succeed without runtime grants. Native and package
read/write operations succeed only with the requested paths; denied file, env,
net and run operations report actual `NotCapable`. The five SH process controls
exercise wall/output/RSS stops, parent exit and observation failure, including
owned-child identity, termination and empty survivor sets. These controls remain
separate from the five negative audit families: missing observation, changed
checkpoint bytes, false denial class, survivor and lock mismatch. Each synthetic
record is rejected for its named reason in each condition.

R-06/07 replacement, mode, symlink, reader checkpoints, two writers, partial-write
detection, injected open/write/flush/rename and before/after cancellation all
satisfy the original predicates. Exact bytes, types, modes, link targets, temp
states, absences and checkpoint records precede cleanup. Real cross-filesystem
rename reports OS error 18 on devices 16777233/16777245; directory replacement
reports `IsADirectory`/OS error 21. The four separate source-read denial attempts
report `NotCapable`; they cannot stand in for OS faults. Source-temp bytes are
copied before removal, then cleanup is verified. No new owned survivor or
external temp remains. The declared cross-filesystem success branch is
unobserved; it requires a suitable environment and a newly frozen condition.
No crash-durability, universal atomicity or recovery policy is established.

R-09's bounded inventory found only Deno 2.9.6. Other installed CLI hashes do
not establish a supported alternative with attributable source provenance.
Comparison is unavailable: the operator supplies an already available supported
pair and provenance, then CDC freezes unchanged inputs and a controlled protocol.
Removed Deno 2.7.7 is historical. No installation or revision build was performed.

## Historical and physical reconciliation

[historical-crosswalk.json](historical-crosswalk.json) joins original IDs,
attempts, source/config/lock/emitted bytes, fixture sets and observations.
`history.lykn audit` reports 5,237 checks. The original semantic auditors run
unchanged over all 163 DB records, retaining all three failed audit outcomes.

| Retained evidence | Exact disposition |
| --- | --- |
| DB work | 71 records: 69 pass, two fail; 32 of the original 103 unrun |
| DB work02 | 92 records: 91 pass, one fail; 11 of the original 103 unrun |
| Original authoring history | Nine Slice04 failures remain in the original sealed packet; no budget reset |
| JSON J-16 | Eight recipe cells / 48 original attempts; original physical source/emitted/config/lock roots reread, 241 capture checks |
| YAML Y-13 | All 54 cells / 108 original attempts / 36 unsupported; 108 original input files and their source/emitted/config/lock reread, 6,046 capture checks |
| Verified FF | Both 37-record conditions retained; 2,319 physical crosswalk checks each |

Original JSON stress inputs were constructed in memory. Native recipes reproduce
those bytes and preserve the exact original arguments and hashes. The composed
JSON 1MiB scalar adds a trailing LF absent from the J-16 recipe; this is a named
input difference, not an exact-byte historical timing comparison. YAML's 1MiB
default parse/stringify recipe matches the retained physical input. Deduplicated
YAML physical bytes are linked by exact hashes, not by a claim that every copied
file is an independent run. The full 349-owner YAML manifest/matrix and original
JSON native/package/stress records survive in the packet.

All 36 unavailable YAML resource cells retain reasons: 18 lack conversion API,
27 lack explicit package bounds, with nine overlapping. API-dependent re-entry
requires an actual compatible API and newly frozen limits/protocol. No package
bound, hard allocation guarantee, asymptotic result or universal safe size follows.

## Resource measurements

`composition.json` retains all 36 observations, warm-up classification, exact
output lengths/hashes and units. The table below is the native helper's
`measurement-table.md`, reproduced without rounding. Warm-up attempt one is
excluded from each five-value series. `stageMs` measures parser/serializer work;
`setupMs` is separate (including parse preparation for stringify).
`supervisorWallMs` includes drain/inspection; `/usr/bin/time` real/user/system
seconds cover the measured child tree, including launch/compile overhead.
Package-only CPU and true peak RSS are unavailable. Sampled tree RSS is KiB and
can miss short-lived Deno children; the small JSON samples do not measure its
true peak. Stops remain observations, not allocator enforcement.

The primary/replay timing differences are confounded by host load and execution
order. These runs establish bounded workflow execution; they do not establish
a performance improvement or cross-version comparison.

| Condition / resource | Metric | Five measured values | Min / median / max |
| --- | --- | --- | --- |
| primary / R-08-json-parse | stageMs | 0.8193330000000003, 1.0708330000000004, 0.8947920000000007, 1.0989170000000001, 0.8640830000000008 | 0.8193330000000003 / 0.8947920000000007 / 1.0989170000000001 |
| primary / R-08-json-parse | setupMs | 0.0066670000000002005, 0.006625000000001435, 0.00575000000000081, 0.007415999999999201, 0.006041999999998993 | 0.00575000000000081 / 0.006625000000001435 / 0.007415999999999201 |
| primary / R-08-json-parse | supervisorWallMs | 819.3343750000004, 690.0317910000003, 733.0716670000002, 788.9308340000007, 743.1436249999988 | 690.0317910000003 / 743.1436249999988 / 819.3343750000004 |
| primary / R-08-json-parse | timeRealSeconds | 0.27, 0.12, 0.14, 0.14, 0.15 | 0.12 / 0.14 / 0.27 |
| primary / R-08-json-parse | userSeconds | 0.04, 0.04, 0.04, 0.04, 0.04 | 0.04 / 0.04 / 0.04 |
| primary / R-08-json-parse | systemSeconds | 0.03, 0.03, 0.03, 0.03, 0.03 | 0.03 / 0.03 / 0.03 |
| primary / R-08-json-parse | sampledTreeRssKiB | 2128, 2128, 1424, 1328, 1296 | 1296 / 1424 / 2128 |
| primary / R-08-yaml-parse | stageMs | 63.03808300000003, 56.40004099999999, 67.78258299999999, 91.87262499999997, 58.61870800000003 | 56.40004099999999 / 63.03808300000003 / 91.87262499999997 |
| primary / R-08-yaml-parse | setupMs | 0.07049999999998136, 0.005415999999996757, 0.006166000000007443, 0.042374999999992724, 0.006375000000048203 | 0.005415999999996757 / 0.006375000000048203 / 0.07049999999998136 |
| primary / R-08-yaml-parse | supervisorWallMs | 1342.1327500000007, 1013.2048749999994, 1097.0152080000007, 1691.9448329999977, 1285.7535840000019 | 1013.2048749999994 / 1285.7535840000019 / 1691.9448329999977 |
| primary / R-08-yaml-parse | timeRealSeconds | 0.69, 0.39, 0.42, 0.87, 0.56 | 0.39 / 0.56 / 0.87 |
| primary / R-08-yaml-parse | userSeconds | 0.18, 0.17, 0.17, 0.2, 0.18 | 0.17 / 0.18 / 0.2 |
| primary / R-08-yaml-parse | systemSeconds | 0.09, 0.09, 0.09, 0.1, 0.09 | 0.09 / 0.09 / 0.1 |
| primary / R-08-yaml-parse | sampledTreeRssKiB | 57024, 56688, 57184, 43680, 44176 | 43680 / 56688 / 57184 |
| primary / R-08-yaml-stringify | stageMs | 65.828125, 62.12904200000003, 57.667958, 46.350415999999996, 45.710959 | 45.710959 / 57.667958 / 65.828125 |
| primary / R-08-yaml-stringify | setupMs | 65.48599999999999, 61.48675, 83.92091600000003, 55.456500000000005, 60.82370800000001 | 55.456500000000005 / 61.48675 / 83.92091600000003 |
| primary / R-08-yaml-stringify | supervisorWallMs | 1098.4307079999999, 970.393165999998, 1520.661165999998, 1271.604041999999, 1162.0121660000004 | 970.393165999998 / 1162.0121660000004 / 1520.661165999998 |
| primary / R-08-yaml-stringify | timeRealSeconds | 0.5, 0.45, 0.88, 0.79, 0.54 | 0.45 / 0.54 / 0.88 |
| primary / R-08-yaml-stringify | userSeconds | 0.22, 0.22, 0.23, 0.23, 0.23 | 0.22 / 0.23 / 0.23 |
| primary / R-08-yaml-stringify | systemSeconds | 0.09, 0.09, 0.1, 0.1, 0.09 | 0.09 / 0.09 / 0.1 |
| primary / R-08-yaml-stringify | sampledTreeRssKiB | 59056, 56816, 58640, 56688, 58368 | 56688 / 58368 / 59056 |
| replay / R-08-json-parse | stageMs | 0.31816699999999987, 0.32720899999999986, 0.3710829999999996, 0.3376669999999997, 0.3246660000000001 | 0.31816699999999987 / 0.32720899999999986 / 0.3710829999999996 |
| replay / R-08-json-parse | setupMs | 0.0019170000000001686, 0.00216700000000003, 0.0017499999999994742, 0.002333999999999836, 0.0012080000000000979 | 0.0012080000000000979 / 0.0019170000000001686 / 0.002333999999999836 |
| replay / R-08-json-parse | supervisorWallMs | 200.96070899999995, 213.42612500000007, 207.35745899999984, 204.38141700000006, 204.46516599999995 | 200.96070899999995 / 204.46516599999995 / 213.42612500000007 |
| replay / R-08-json-parse | timeRealSeconds | 0.03, 0.03, 0.03, 0.03, 0.03 | 0.03 / 0.03 / 0.03 |
| replay / R-08-json-parse | userSeconds | 0.01, 0.01, 0.01, 0.01, 0.01 | 0.01 / 0.01 / 0.01 |
| replay / R-08-json-parse | systemSeconds | 0.01, 0.01, 0.01, 0.01, 0.01 | 0.01 / 0.01 / 0.01 |
| replay / R-08-json-parse | sampledTreeRssKiB | 1200, 1200, 1744, 2160, 1168 | 1168 / 1200 / 2160 |
| replay / R-08-yaml-parse | stageMs | 12.754708999999998, 12.71875, 12.967500000000001, 13.217291999999993, 12.654834000000001 | 12.654834000000001 / 12.754708999999998 / 13.217291999999993 |
| replay / R-08-yaml-parse | setupMs | 0.0018330000000048585, 0.0018750000000054001, 0.0021249999999994884, 0.0023330000000001405, 0.0017499999999941451 | 0.0017499999999941451 / 0.0018750000000054001 / 0.0023330000000001405 |
| replay / R-08-yaml-parse | supervisorWallMs | 270.35175000000027, 266.5387089999999, 263.7364169999996, 256.69624999999996, 263.5365840000004 | 256.69624999999996 / 263.7364169999996 / 270.35175000000027 |
| replay / R-08-yaml-parse | timeRealSeconds | 0.08, 0.07, 0.07, 0.09, 0.08 | 0.07 / 0.08 / 0.09 |
| replay / R-08-yaml-parse | userSeconds | 0.07, 0.07, 0.07, 0.07, 0.07 | 0.07 / 0.07 / 0.07 |
| replay / R-08-yaml-parse | systemSeconds | 0.03, 0.03, 0.03, 0.03, 0.03 | 0.03 / 0.03 / 0.03 |
| replay / R-08-yaml-parse | sampledTreeRssKiB | 52848, 61872, 50544, 47840, 49408 | 47840 / 50544 / 61872 |
| replay / R-08-yaml-stringify | stageMs | 13.129041999999998, 11.958624999999998, 11.973666999999999, 11.92725, 12.196624999999997 | 11.92725 / 11.973666999999999 / 13.129041999999998 |
| replay / R-08-yaml-stringify | setupMs | 13.551375, 12.744, 13.315999999999995, 13.572792, 13.504124999999995 | 12.744 / 13.504124999999995 / 13.572792 |
| replay / R-08-yaml-stringify | supervisorWallMs | 243.15491699999984, 238.11145899999974, 243.1107090000005, 250.25687500000004, 239.8249590000005 | 238.11145899999974 / 243.1107090000005 / 250.25687500000004 |
| replay / R-08-yaml-stringify | timeRealSeconds | 0.09, 0.09, 0.08, 0.09, 0.09 | 0.08 / 0.09 / 0.09 |
| replay / R-08-yaml-stringify | userSeconds | 0.08, 0.08, 0.08, 0.08, 0.08 | 0.08 / 0.08 / 0.08 |
| replay / R-08-yaml-stringify | systemSeconds | 0.03, 0.03, 0.03, 0.03, 0.03 | 0.03 / 0.03 / 0.03 |
| replay / R-08-yaml-stringify | sampledTreeRssKiB | 48496, 47024, 48592, 48448, 48208 | 47024 / 48448 / 48592 |
