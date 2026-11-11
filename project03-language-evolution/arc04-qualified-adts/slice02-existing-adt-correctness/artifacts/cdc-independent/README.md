# Independent S02 receipts — 0829e892

Reviewer: independent Codex Sol 6.1 High. Fresh execution on 2026-11-11,
separate from Luna CC's runs. Source remained clean at
0829e892999890e8877dec5e35cd249753e1be5d throughout.

`receipts-0829e892.tar.gz` SHA-256:
`da59a7882ecfa770302e469326bd1cff7e3c376c0c511134794680b026279c67`.
This bounded archive preserves raw command metadata, stdout/stderr/status,
relevant generated JavaScript, original-control copies, product M1–M6 receipts,
and the Lykn-authored reviewer drivers. It contains no copied CLI, source-tree
package archive or XDG/npm cache. Source/binary identities are receipts, not
archived binaries. Temporary execution home was
`/private/tmp/lykn-s02-cdc-0829`.

## Navigation

| Archive path | Meaning |
| --- | --- |
| `receipts/focused/` | Fresh offline Cargo macro-dependencies and semantic-role suites: 6 and 56 passed. Raw native harness observations are retained in stderr. |
| `m6/` | Existing product harness's per-process/source/generated receipts; M6 compares canonical/embedded/materialized modules and runs 2 strict public runtime tests. |
| `receipts/canonical-public/` | Strict public runway plus semantic-role suites: 26 tests and 43 steps passed. |
| `receipts/full-make/` | First full gate, exit 2, npm inherited-cache permission failure; not product acceptance. |
| `receipts/full-make-owned-npm/` | Complete repeated gate, exit 0, with owned npm cache. |
| `receipts/cited-paths/`, `receipts/browser-size/` | Fresh committed-HEAD 64/601 citation and 41,349-byte current gzip measurements. |
| `receipts/original-replay/`, `replay/` | First replay attempt stopped on reviewer-generated `langSLASH` import-map key. Raw failure retained; not a product verdict. |
| `receipts/original-replay02/`, `replay02/` | Successful fresh 25-cell original-control/materialization/old-protected reproduction. `summary.json` contains observations; each cell has launch, raw streams and status. |
| `edge.lykn`, `edge.js`, `edge-stripped.js`, `edge-canonical/`, `edge-embedded/`, `receipts/edge-*` | Extra registered-name, root-literal, scope, getter-throw and nested loop-transfer checks across four runtime routes. |
| `receipts/final-pins/`, `receipts/commit-scope/`, `receipts/ancestry/`, `receipts/input-digests/` | Actual executables/driver hashes, both source commits/trailers, 0/2 release ancestry and unchanged original source-copy digests. |
| `run.lykn`, `replay.lykn` | Reviewer-authored process capture and replay logic; no handwritten JavaScript research helper was used. |

## Launch conditions and limits

The tools recorded command argv/cwd and selected environment before launching,
then raw streams and actual exit status. `run.lykn` records a selected projection
rather than the entire inherited environment. The focused and full-gate outer
invocations set `DENO_DIR=/Users/oubiwann/Library/Caches/deno`,
`XDG_CACHE_HOME=/private/tmp/lykn-s02-cdc-0829/xdg` and
`TMPDIR=/private/tmp/lykn-s02-cdc-0829/tmp`. The successful full-gate retry also
set `npm_config_cache=/private/tmp/lykn-s02-cdc-0829/npm`; that outer variable is
not included in `run.lykn`'s selected projection. The replay's own launch records
include its explicit environment, including the owned npm cache and separate
cold embedded XDG root. No source/assertion change or user-cache ownership
mutation occurred between full-gate failure and retry.

Deno was 2.9.6, Rust/Cargo 1.97.0. Cargo focused verification built the debug
CLI at the exact source pin; its SHA-256 and the standalone copy are
`1835fdd00e071d32d70b4b49d370fdc06573412873f2789ba3aaf026521cb88c`.
The full gate's release and installed CLI both hash
`d2319c8a27d987a0aa781eeb2b27eeb988f737629ce1208cefd5f3e1af4bdfc5`.
The direct original/edge replays used the pinned debug copy. All code remains
the same committed source; build-profile identities are not conflated.

The reviewer corrected two driver drafting errors before successful execution:
an unsupported method receiver on `(new Date)` was replaced by `Date:now`, and
a missing closing parenthesis was repaired. Those initial compile diagnostics
remain in the review session's tool outputs, not fabricated archived raw logs.
The first executed replay's incorrectly normalized import-map key is preserved
as an actual failed receipt. Replay02 used `Object:from-entries` for exact
`lang/` keys and a new home, preserving prior observations.

The old protected source was freshly obtained with `git show 685bbe1d:...`,
compiled and run now. Its `["bad",[]]` observation is a new reproduction. The
original CC full-gate raw failure was never available and is not reconstructed.
Fresh materialization is proved; same-version warm-cache content invalidation
is not. Unregistered public patterns retain historical positional enumeration,
and Arc01 S04 I4/CV-03 retains protected early-return repair ownership.
