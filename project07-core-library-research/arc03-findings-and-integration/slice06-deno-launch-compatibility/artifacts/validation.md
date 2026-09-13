# LC-V01 — Validation and replay

2026-09-13, CC attestation. Source correction: `4dded883bbd321d19635e6fce233343f33803f9e`.
All six LC rows are proposed-done, with ledger status open pending CDC.

| Check | Result |
| --- | --- |
| Original targeted suite | 7 passed, 4 failed: actual launcher defect reproduced |
| Expanded tests before repair | 2 passed, 14 failed; boundary and runtime regressions fail on original launcher |
| First corrected test condition | 13 passed, 3 failed; test assumptions corrected below |
| Final targeted Cargo suite | 16 passed, 0 failed, 0 ignored |
| make check | passed: dependency/citation/build/clippy/format gates, 1,507 Rust tests in 23 result groups, 1,465 suite tests, 482 documentation tests |
| Separate make check-cited-paths | passed: 63 documents; 601 preexisting historical census entries |
| Isolated locked release build | passed; immutable source/tree and hash in LC-B01 |
| Isolated Cargo release tests | 16 passed; Cargo rebuilt the binary, explicitly reconciled in LC-B01 |
| Selected release binary, direct existing harness | 16 passed; identical binary hash before and after |
| Eight retained runtime captures | minimal success; denied/scoped read/write; explicit all; args and stdin exit 23 |
| Native Lykn evidence verification | 37 checks; eight capture exits/stdout, specific denials, live written bytes, 12 source gates, argv, binary equality and Rust-result accounting |

The runtime permission suite covers all four run routes with positive and
negative controls. It requires NotCapable plus the named access category;
generic exit 1 cannot pass. It tests scoped outside-path rejection, explicit
denies in either order, trailing all-permission flags that grant nothing,
repeated scopes, bare/scoped mixtures and empty-scope rejection. All 16
allow/deny categories retain bare/scoped/repeated/empty argv coverage.
Both explicit all-permission spellings work on all four routes. Frozen and
cached-only controls are explicit in native fixtures and their argv. This is
not the full package/offline/corrupt-lock matrix owed by Slice04.

## Corrections and limitations retained

The first corrected test run exposed three test issues: adding frozen=true to
the fixture collided with an existing frozen=false option; the symlink test
initially expected canonical-target imports rather than Deno's link-location
behavior; and the existing empty-scope assertion used Deno's older wording.
The repaired tests preserve a specific rejection assertion and add direct Deno
comparison, instead of relaxing to generic success/failure. First-draft tests
and all failed logs remain captured.

The evidence verifier's first emitted review found a literal backslash-u string
where a NUL delimiter was intended. It now uses String.fromCharCode(0); the
regular expression uses `[.]` to avoid escape ambiguity. The first source and
emitted output are preserved; they were not used to interpret a runtime result.
The compiler's known false unused-binding warning for `expected` remains in
the raw logs. No compiler-warning repair or guide/book acceptance is claimed.

Guidance used: source AGENTS.md and assets/ai/SKILL.md; selected module forms;
installed rust-guidelines (entrypoint, anti-pattern excerpts/summary and CLI
testing/wayfinder), collaboration-framework, project-management README and
closing guides, work-verification row closure, and testing discipline/gates.
Some initial broad reads were truncated; this is not a claim of reading every
guide in full. The missing source Rust skill had the operator's already-approved
installed substitute; the missing coverage guide did not create a new permission
gate or a coverage-percentage claim.

## Captured-evidence replay

`raw-transcript.txt` is a lossless JSONL packet of file bytes, lengths and
SHA-256 values. It includes before/after sources and streams, NUL argv, exact
test sources/diff, failed conditions, full gate/build logs, provenance and the
native Lykn pack/verify source. It excludes executable binaries and dependency
caches; immutable source plus LC-B01 supplies the rebuild route.

Use the existing Slice04 `artifacts/audit.lykn` (also retained inside this
packet) with the corrected verified CLI. From a fresh scratch directory with
`project.json` containing `{}`, copy that source to `audit.lykn`, check/lint,
compile and inspect it. Set `lc_packet` to the absolute raw-transcript.txt path,
`lc_extracted` to a new empty directory, and `lc_cli` to the verified CLI:

```sh
"$lc_cli" run --no-prompt --cached-only --frozen=true \
  --allow-read="$lc_packet" --allow-write="$lc_extracted" \
  audit.lykn extract "$lc_packet" "$lc_extracted"
```

Use private HOME/TMPDIR/DENO_DIR and null stdin as in the retained replay script.
After extraction, change directory to the extracted root and run:

```sh
"$lc_cli" run --no-prompt --cached-only --frozen=true \
  --allow-read=./ tooling/verify.lykn
```

This verifies captured results and the retained live-output file. It does not
create new runtime evidence. For that, rerun `after/replay.sh` into a fresh trial
and independently rerun the committed integration tests and source gates.
No independent CDC is claimed by these CC checks.

The final packet contains **174 files / 572,626 original bytes**. Native Lykn
packing passed 522 checks, fresh extraction with the documented narrow grants
passed 871 checks, and replay from the extracted root passed all 37 evidence
checks. Packet SHA-256:
`250abacee504124b139ddb942f1d5aa3618e88b282768438ccc31f6eb77ad85b`.
The packet's own completion receipts are recorded here rather than recursively
including the packet in itself. Pack/compile warnings from the inherited audit
are retained in logs/pack-compile.stderr; none was suppressed or repaired.

The native planning audit passed 26 checks over 17 allowed paths and 134 local
links. All six original LC criteria, significance/origin and open statuses
remain unchanged; their evidence pointers now reference the CC handoff.
The Slice04 ledger has no diff. These counts remain separate from runtime,
source-suite and packet-integrity checks.
