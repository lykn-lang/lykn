# YAML resource and file findings — YR-F01

CC-attested under the pinned condition; independent CDC remains pending.
All 54 resource cells and eight file variants have evidence or an explicit
unsupported disposition. [Results](results.md) contain every cell, raw package,
setup and inspection timings, five-run median/range, and bounded value facts.
[File audit](file-audit.md) preserves actual bytes, modes, errors and checkpoints.

## Resources and capability boundaries

Eighteen default parse/stringify cells each completed one warm-up and five fresh
measurements: 108 resource attempts, including 90 measured attempts. There were
zero resource caps, protocol not-runs, package warnings or observed survivors.
Every parsed depth/scalar/alias graph met an independently stated recipe
invariant. Alias inspection retained shared identity without expanding the DAG.
The package produced repeatable serializer sizes/hashes across the six repeats.

| Input | Parse ms median [range] | Stringify ms median [range] |
| --- | --- | --- |
| Depth 16 | 5.04 [3.26, 8.38] | 1.67 [1.12, 2.20] |
| Depth 64 | 4.87 [4.11, 5.36] | 1.52 [1.42, 4.35] |
| Depth 256 | 9.35 [6.72, 12.74] | 7.37 [5.59, 14.52] |
| Scalar 1KiB | 7.01 [5.48, 8.06] | 2.27 [1.84, 3.20] |
| Scalar 1MiB | 74.79 [62.43, 157.02] | 65.94 [55.53, 72.28] |
| Scalar 8MiB | 428.48 [416.18, 578.44] | 430.19 [412.34, 720.03] |
| Alias DAG depth 4 | 9.44 [5.71, 22.33] | 3.96 [2.39, 8.18] |
| Alias DAG depth 8 | 7.22 [5.96, 19.49] | 3.72 [1.73, 5.27] |
| Alias DAG depth 12 | 10.04 [5.87, 13.48] | 2.87 [2.69, 3.94] |

These are five measured fresh processes per cell, rounded here to two decimals.
Stringify's input parse happens before its timer and is separately recorded.
Whole-child time includes compilation, module loading, setup and inspection.
For 8MiB stringify, whole-child measured median was about 1286.94ms, and the
largest sampled tree RSS among those five attempts was 131984KiB. These are
host observations, not package-only memory, complexity or a universal safe size.
Short-lived processes can fall between samples: one depth-64 parse attempt's
sampled peak was only 5472KiB. The full /usr/bin/time output and samples remain;
sampled maxima are not hard bounds or guaranteed true peaks.

Thirty-six cells are explicitly unsupported: all 18 toJS cells and all 27
explicit package-bound cells, with nine overlapping. Public mod.ts exports
parse, parseAll, stringify and YamlSyntaxError; parse.ts returns JS values.
ParseOptions/LoaderStateOptions and StringifyOptions expose no resource bound
or separate conversion operation. Formatting flowLevel/lineWidth and anchor
use are not resource caps. Source bodies and URL/hash index are retained in the
packet's confirmation/package-source directory. No identity function was timed,
no ignored bound option was passed, and no package-bound effect was inferred.
Re-entry remains an approved compatible route under Slice04 with the original
IDs intact. Inspector and external limits apply in all executed default cells.

## Actual file behavior

All eight variants ran twice. Missing input and absent output parent produced
NotFound at read-input and open-write respectively. Input mode 000 and output
directory mode 0500 produced real PermissionDenied (OS error 13) under intended
narrow Deno grants. The separate denied-read control produced NotCapable, keeping
runtime permission denial distinct from OS access failure. Source bytes and
existing destination state survived these failures; mode restoration follows
recorded inaccessible/failed state, not before it.

Both raw interruptions left exactly the first 26 bytes of a complete 53-byte
serialization in the truncated destination. Both safe interruptions left those
26 bytes in a sibling while preserving the eight-byte ORIGINAL+LF destination.
The supervisor independently reread the prefix and observed child PID before
SIGKILL. Pre-kill visible state and immediate post-kill state agree. Orphan
sibling deletion is recorded only after that evidence. These are controlled
partial-write interruptions, not accidental startup timeouts.

Both pre-rename injections left the complete 53-byte sibling and unchanged
original destination; the injection message is explicit. Actual rename over a
directory produced IsADirectory (OS error 21), preserved DIRECTORY-SENTINEL+LF
and retained the complete sibling until separate cleanup. No power-loss,
concurrency, cross-filesystem, ownership or universal atomicity claim follows.

## Authoring and next owners

The final Lykn audit passes 26674 checks across all attempted cells, unsupported
rows, original hashes/owners, phase timings, controls, stream bytes/hashes,
file states, checkpoint prefixes and raw/summary agreement. Five failed authoring
conditions and one metadata-command mistake are retained separately in the
[authoring record](authoring-observations.md). Optional report compaction was
reverted to the already passing renderer; required research was not reduced.
No program in another research language or generated-JavaScript repair was used.

Known JSCF and UNUS recur; the shorthand member-access incident remains a
recorded authoring/compiler/guide question, not a newly adjudicated root cause.
NZRO and LINT/NPMB/JSER/YNOD retain their established status. No new permanent
Discovery Register ID or source repair is asserted. Arc02 retains ADT, guide/book
and operator source-shape review; Arc03 retains accepted source corrections.

The complete crosswalk remains 259 value variants (verified Slice05), 62
resource/file variants (this CC handoff), and 28 gated document variants
(Slice07): 349 total. After CDC closes Slice06, open Slice04's runtime/dependency
boundary before Slice07. Actual API absence, sampled-observer limits and these
file outcomes inform that policy work without choosing it. Whole-YAML, arc and
project composition and human acceptance remain open.
