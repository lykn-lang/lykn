# Slice06 independent CDC verification

2026-09-13. **Closed: LC-01–06, six of six.** The source correction at
`4dded883bbd321d19635e6fce233343f33803f9e` works with the identified Deno 2.9.6
while preserving the tested permission, argument, stdin, path and symlink
contracts. A3-06 and D-2609-DARG close as repaired. The complete
[Arc01/Slice04 prompt](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cc-prompt.md)
resumes; all eight DB criteria remain open.

This review independently inspected the source diff and reproduced evidence
from [CC's handoff](closing-report.md), planning commit `876eceb`. Original
CC artifacts and the earlier Slice04 blocker report remain unchanged. CDC used
fresh isolated Git archives, disposable test roots and normal corrected
`lykn run`; no shared binary was replaced or source file edited.

## Identity and source review

| Condition | Identity |
| --- | --- |
| Corrected source | `4dded883bbd321d19635e6fce233343f33803f9e` |
| Corrected tree | `218b085176053f1273642496cf75d7691c399f6e` |
| Selected release CLI SHA-256 | `d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326` |
| Deno 2.9.6 SHA-256 | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74` |
| Immediate source parent | `50608c443c452107b138cc30deda4a09ab5c7642` |
| Fresh parent release CLI SHA-256 | `bda1b384f71e1f4d9678ea8fc35f3e52966a003aa773feed4fc2e059fc5ee5e7` |

Both archives built with `cargo build --release --locked`. The selected release
hash matches CC's receipt. Toolchain/platform/version outputs, source tree and
diff, commands, hashes and clean source status are retained in the CDC packet.

The four-file correction removes the pre-script separator, prefixes an ambiguous
local leading-hyphen path with `./`, and preserves the literal `-` stdin entry.
It does not canonicalize symlinks or rewrite specifiers and caller arguments.
Permission collection and config/cache/frozen forwarding are unchanged.
The regression tests and two changed guide passages match that implementation.
Reviewed source locators at **4dded88**:

- `crates/lykn-cli/src/main.rs`, `cmd_run` script selection and child argv.
- `crates/lykn-cli/tests/run_permissions.rs`, all 16 tests and fixture helpers.
- `docs/guides/15-lykn-cli.md`, run invocation and path handling.
- `docs/guides/12-deno/12-01-runtime-basics.md`, run permission/path contract.

The complete interval from the earlier research pin d0bb981 to 4dded88 changes
30 paths, including embedded compiler and toolchain inputs. Only the final
commit is the narrow four-file launcher correction. Slice04 R-01/R-02 must
inventory this new compiler condition and re-gate its own emitted programs;
historical format results retain their original compiler/runtime provenance.

## Independent row walk

| Row | Independently reproduced evidence | Disposition |
| --- | --- | --- |
| LC-01 | Fresh parent build and minimal no-import launch on the current runtime exits 1 with the missing-script/task-list failure; source/emitted bytes and identities retained. Original d0bb981 failures and CC argv evidence remain attributable. | done |
| LC-02 | All 16 targeted regressions pass in the source home and against the isolated selected release binary. Cases cover run routes, spaces, leading hyphens, literal script flags, stdin, local imports, file specifiers and symlink import bases. Eight fresh captured runtime cases also pass. | done |
| LC-03 | Fresh denied reads/writes contain the specific NotCapable access errors; scoped grants succeed and the output file contains exactly `written`. Explicit all-grants succeeds. Argument and stdin cases preserve option-like, space, empty and separator arguments and exit 23. Existing repeated/empty-scope, overlay and offline-argv regressions pass. | done |
| LC-04 | 16 targeted tests, complete canonical make check and separate cited-path gate pass. Full check reports 1507 Rust tests in 23 result groups, 1465 suite tests and 482 documentation tests. Cited-path gate checks 63 documents and 601 historical citations. | done |
| LC-05 | Independently built selected release hash matches CC; reproduced Cargo's test-condition hash transition, rebuilt the selected release and ran the compiled harness directly. All 16 tests pass with the selected CLI hash identical before and after. Deno hash also matches. | done |
| LC-06 | Inspected the exact four source paths and 17 CC planning paths. Retained evidence audit, fresh replay and planning checks reproduce. Ancestor body/history, active Slice04 pins and next prompt are updated while all eight DB rows remain byte-identical and open. | done |

## Reproduction and retained failures

The lossless CC packet SHA-256 is
`250abacee504124b139ddb942f1d5aa3618e88b282768438ccc31f6eb77ad85b`.
The reviewed Lykn packet auditor extracted **174 files with 871 checks**.
The reviewed Lykn verifier passed **37 checks** on both CC's retained records
and eight fresh runtime captures. Before edits, the retained planning audit
passed **26 checks, 17 paths and 134 local links**. Its CDC adaptation passed
**36 checks, 17 paths and 142 local links**, including six retained-and-closed
LC criteria, unchanged eight DB rows and current/next arc metadata.

Three independent infrastructure observations remain in the packet:

1. The first canonical make check failed when the existing npm dry-run gate
   tried to write the sandbox-protected global npm log/cache. Repeating the
   same gate with a disposable `npm_config_cache` passed. No test or safety
   check was bypassed; the existing NPMB owner remains separate from research.
2. `cargo test --release --locked` changed the CLI to hash
   `a871df4a5c2de812c023b4c123acffc7b15511769a8f13a9cbe4238b43ac79c6`.
   Rebuilding release restored the selected hash; the direct compiled harness
   then passed against that unchanged binary. Both conditions are recorded.
3. The first fresh evidence-verifier launch failed because CDC had omitted the
   root `project.json`. Adding the empty config and repeating the same normal
   launcher route passed. The failure and correction are retained; this was
   CDC replay setup, not a new compiler or Slice04 authoring failure.

No fresh Deno 2.7.7 result is claimed: the operator removed it. The Unix-only
regression suite ran on this macOS host, not Windows. Remote/data specifier
spelling has argv evidence; this review did not download remote programs.
The selected binary and source correction are verified within these conditions,
not as a universal compatibility or filesystem guarantee.

## Packet and replay

[CDC lossless packet](artifacts/cdc-raw-transcript.txt) contains fresh raw logs,
before/after fixtures and outputs, generated code, exact source diff/identities,
the original and adapted Lykn auditors, replay infrastructure and invocation
notes. Each JSONL record carries relative path, byte count, SHA-256 and hex bytes.
The CDC packet contains **175 files, 568308 original bytes**, SHA-256
`c5c7b427ddd9fb0a57fff8f464ed7fcb17d83d7745bc58674abb9764d0315fd9`.
Independent extraction passed **876 checks**; the extracted runtime verifier
again passed all **37 checks**. This validates the committed packet's replay,
separately from CC's retained packet and the fresh live runtime run.
Use the already reviewed Slice04 `artifacts/audit.lykn` in `extract` mode,
through the selected corrected CLI with read access to the packet and write
access only to a new scratch extraction root. Use cleared environment, null
stdin, fresh HOME/TMPDIR/DENO_DIR, `--no-prompt --cached-only --frozen=true`.
Build the source archive independently and verify its hash before replay.

The packet's `meta/replay.md` gives exact retained and fresh replay commands.
Start in the extracted root, which includes `project.json`; create fresh
home/tmp/cache directories. `tooling/verify.js` audits retained captures and
the make-check log. `after/replay.sh` accepts the absolute selected CLI path
and a fresh destination and produces the eight runtime captures and 12 source
gate exits. Its Lykn sources and emitted code are retained for inspection.
The compiled Rust harness separately exercises the 16 broader regressions.

## Bubble-up to the arc

Arc03/Slice06 and A3-06 close; DARG is repaired. Resume Arc01/Slice04 in
Expedited Mode on its explicit 4dded88/Deno 2.9.6 condition. Operational matrix
freeze, complete graphs/configs/locks, candidate review and adapted supervisor
preflight remain owed. Preserve all R-01–09 families, three failed authoring
conditions, 36 unsupported Y-13 cells and 28 gated Y-14 variants. Do not execute
the Node-dependent document candidate or infer package/ancestry acceptance.
Guide/book/compiler/formatter/tooling, ADT design and operator code-shape
outcomes retain their owners. A-03–06, A3-02–05 and every project row remain
open; child closure does not establish arc composition or human acceptance.
