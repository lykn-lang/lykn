# Slice07 independent CDC verification

2026-09-13. **SH-01–06 closed, six of six.** Independent fresh replay passed
all 33 process attempts and five negative controls at the accepted compiler/
runtime pair. A3-07 closes; [full Slice04 resumes](../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cc-prompt.md)
with all eight DB criteria open and its four historical source failures retained.

Reviewed CC commit `910268d` against `956da55`, including all three Lykn sources,
emitted supervisor control flow, frozen manifest, failure populations, exact
replay infrastructure, ledgers and ancestor changes. No source compiler or
library was edited. Original CC artifacts remain unchanged.

## Identities and independent runs

CDC reused the isolated release binary built and independently tested during
[launcher CDC](../slice06-deno-launch-compatibility/cdc-verification.md), rehashing
it and Deno before execution. This review does not claim another source build
or repeat of canonical Rust/source checks; the code change is planning/research.

| Identity | Value |
| --- | --- |
| Source | `4dded883bbd321d19635e6fce233343f33803f9e` |
| Source tree | `218b085176053f1273642496cf75d7691c399f6e` |
| Selected CLI SHA-256 | `d4a7028ebba234ffcd6fdb544c256489d22b840da2e94e0aa833b0520c834326` |
| Deno 2.9.6 SHA-256 | `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74` |
| CC packet SHA-256 | `49482c78b73af8b9112b7560b47c16afd242bc45c5d86fcc5424265c56d3ac2f` |

The literal captured extraction passed **5,244 checks over 1,748 files**.
The extracted primary report passed **1,255 checks / 33 attempts / five negative
controls**, and the captured-file crosswalk passed **229 checks**, reading
128 fixture files and 33 source copies. Extracted runtime paths were qualified
as retained evidence; they were not mistaken for freshly executed processes.

After source/emitted review, CDC ran the literal `fresh-replay.sh` using the
accepted CLI and committed artifacts in a new root. All nine source gates
passed; all three emitted files match CC's `work03/gates-07/` byte-for-byte.
The fresh freeze retains 19 variants and 33 attempts, adapting only the actual
CLI path and timestamp. Five external controls, 18 native attempts, six observer/
concurrency attempts and four cancellation attempts all passed. The five fresh
negative controls passed **96 checks**; the final report passed **1,255 checks**.
The fresh file crosswalk again passed **229 checks / 128 fixtures / 33 sources**.

An additional CDC-authored Lykn audit passed **609 checks** over the same
33 attempts: exact invocation flags and selected CLI, actual config/lock bytes,
compiled hashes, live fixture kind/size/mode, worker configs/locks, nonempty
bounded kill targets, and recorded process identities against a fresh host
snapshot. No recorded owned identity remained live. The longest fresh attempt
was the parent-exit control, approximately **1,608 ms**, below its 10s deadline.

## Independent row walk

| Row | Reproduced evidence | Status |
| --- | --- | --- |
| SH-01 | Pinned source/binary/runtime; fresh 19-variant/33-attempt freeze; exact source/config/lock/flags and source gates | done |
| SH-02 | Five fresh external controls, including actual compiled-file absence, root exit with inherited pipe held by registered child, and injected observation failure. Natural drain and no owned survivors; extra post-run identity checks | done |
| SH-03 | Nine native variants twice; explicit grant success, actual NotCapable failures, expected bytes/values, unchanged live locks and exact invocation authority | done |
| SH-04 | Six observer/concurrency and four checkpoint cancellation attempts; nonempty in-window samples, 32,768-byte partial detection, complete final candidates, old/new destination and orphan bytes, live metadata | done |
| SH-05 | Semantic audit gates each positive group; five independently rerun labeled negative copies fail for their intended reason, 96 checks | done |
| SH-06 | Retained/fresh replay, emitted byte comparisons, original failed conditions, packet integrity and live crosswalk; complete Slice04 re-entry and unchanged DB criteria | done |

## Failures, authority and limitations

The prompt and retained `payload/meta/condition-record.md` record the operator's
amendment: “Continue Slice07 with an eight-failure maximum.” It changes this
unit's correction budget only. CC retained six failures: four source/emission
conditions, the failed comment-padding precompile control, and the failed
checkpoint ownership sampling condition. The original 3+30 superseded process
attempts remain separate from CC's primary 33 and replay 33. CDC's fresh 33
are another separately attributed population, not an inflated DB denominator.

CDC retained two additional audit-authoring drafts: an excess closing parenthesis
in the record binding, then the known JSCF emission of COMPILE_ERROR for two
statement-style conditional forms. Both were caught before execution; the final
Lykn audit uses explicit alternatives and passed check/lint/compile plus emitted
review before running. These do not erase or change CC's six-failure history or
Slice04's four. They are available to the existing authoring/compiler/guide
owners; no compiler correction or human aesthetic acceptance is inferred.

CDC's initial shell ps preflight was sandbox-denied before any loop. The
authorized host route ran the fresh replay and final process observation.
Two initially assumed emitted-file paths were absent; locating the retained
`gates-07/` files corrected the comparison. These setup observations are recorded
separately. The final comparisons and runtime replay passed without weakening
frozen mode, grants or semantic checks.

This verifies the declared native protocol on macOS and Deno 2.9.6. It does not
verify Windows, the removed Deno 2.7.7, package graphs, symlink/file-fault research,
kernel/host-tool hangs, universal atomicity, conflict policy, crash durability
or a hard memory allocation bound. The injected observation error is controlled;
cleanup uses working host ps/kill. Missing CPU statistics after termination stay
unavailable. Preserved unused-binding warnings and compiler/guide findings
retain their existing owners. No package code was evaluated.

## Evidence and replay

[CDC lossless packet](artifacts/cdc-raw-transcript.txt) retains fresh attempts,
negative copies, live fixtures, configs/locks, source/emitted gates, invocation
logs, extra audit and failed drafts, host snapshot and final planning checks.
CC's sealed packet is separately retained; this packet does not duplicate it.
The CDC packet contains **569 files / 5,633,265 decoded bytes**, SHA-256
`68e79588034368499f6ae81d4461fb6250c27b3e0665f6cae218d58ff75682ca`.
Packing and fresh extraction each passed **1,707 checks**. The extracted CDC
report and crosswalk repeated **1,255** and **229** checks respectively.
Final planning reconciliation passed **32 checks / 16 paths / 159 local links**,
including unchanged SH criteria, six done statuses and all eight unchanged DB rows.
Use the committed audit's `extract` mode and the same restricted native setup
in [results.md](artifacts/results.md) to extract into a new scratch root.
`payload/meta/replay.md` records the literal fresh and captured routes.

The retained report/crosswalk can be rerun against extracted files. Fresh process
identity and file-mode claims require a new live replay and host snapshot;
unpacking bytes does not reproduce original modes or a current process table.

## Bubble-up to the arc

All six SH criteria and A3-07 close. Resume Slice04 on 4dded88/Deno 2.9.6 using
the pinned Slice07 sources from 910268d, not its older unverified supervisor.
Carry substantive precompile stimulus, checkpoint ownership refresh, bounded
drain, native lock separation and semantic marker gates into its adaptation.
Re-gate emitted programs and rerun affected controls after adaptation; SH native
attempts never silently become DB attempts.

All eight DB rows, R-01–09, 47 candidates and expansions, 36 unsupported Y-13
cells and 28 gated Y-14 documents remain owed. Complete package/toolchain graphs,
offline/lock faults, package permissions, full replacement/fault/resource matrix,
available-pair disposition and document-route decision remain Slice04 work.
Source/guide/book/compiler/formatter/ADT and operator code-shape outcomes retain
their owners. A3-02–05, Arc01 A-03–06 and all project criteria remain open;
this child closure does not establish arc composition or package/human acceptance.
