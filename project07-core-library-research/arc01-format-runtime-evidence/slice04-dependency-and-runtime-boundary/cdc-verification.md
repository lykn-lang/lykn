# CDC review — Deno launch blocker and partial evidence

2026-09-13. Reviewed CC commit **09d6c6e0ee237df5335c011af9d661f3968d9fd0**,
parent ae179ea8658e8a6999f8162151345c0aca280ea9.

**Disposition: blocked handoff verified; Slice04 remains open.** None of its
eight DB criteria is closed or proposed-done. The six Arc03/Slice06 correction
criteria also remain open. Its [CC prompt](../../arc03-findings-and-integration/slice06-deno-launch-compatibility/cc-prompt.md)
is ready for implementation. No source edits or correction build were made.

## What independently reproduced

| Evidence | CDC result and boundary |
| --- | --- |
| Runtime/CLI identity | Available Deno 2.9.6 SHA-256 2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74. Reused the previous CDC isolated d0bb981 build, rechecking CLI SHA-256 78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb. This review did not claim a fresh build or install the removed runtime. |
| Four fresh wrapper launches | Two no-grant and two explicitly all-granted minimal runs, each in a new root with private HOME/TMPDIR/cache, cleared environment, null stdin, no-prompt/cached-only/frozen. All exited 1 with the same missing-script/task-list output; none printed the marker. |
| Actual argv | Fresh NUL-delimited recorder shows run, config and requested flags, then pre-script -- and the absolute emitted minimal.js path. The recorder is separate from the real launches and supplies no permission proof. |
| Native eval | The freshly compiled minimal Lykn program printed DB-MINIMAL-EXECUTED and exited 0. No generated JS was edited. Eval used forced ESM, no automatic config, no remote/npm resolution, cached-only and null stdin. |
| Retained evidence | Original packet SHA bef1eb72d43e13edc1491e87d481d88c12c79b4bca392b2711f263126a51c60d matched; 460 files extracted with 2301 size/hash/path checks. |
| Published files | The retained Lykn audit independently checked all 188 files against captured published metadata: 376 size/hash checks. This establishes correspondence to that metadata, not a fresh download, dependency adoption, authenticity beyond the retained provenance, or complete graph/lineage review. |
| Candidate generation | Three ownership checks and 47 candidate rows reproduced. Six generated outputs matched pre-regeneration copies byte-for-byte: inputs.json, project.json, deno.lock, dependency-graph.json, package.lykn and generated case-manifest.md. The four committed candidate JSON/config/lock/graph files also match. The hand-written committed case-manifest.md is intentionally a disposition report. |
| Source/tooling gates | Minimal and retained audit passed check/lint/compile; emitted code reviewed. Fresh audit.js matches CC's retained emitted file byte-for-byte. Known used-binding warnings remain captured. |
| CC scope/ledger check | Retained planning audit passed 39 checks over 28 allowed CC paths and 109 local links; all eight original DB rows remain byte-identical and all six LC rows are present. |
| CDC packet | 70 files / 328229 original bytes, packed with 210 checks and independently extracted with 351 checks. No package modules were evaluated during this review. |
| Review commit checks | 14 explicit planning paths, 112 local links, eight DB and six LC criteria still open; status JSON parsed and whitespace checks passed. |

Scratch root: /private/tmp/lykn-p07-darg-cdc.uXU6tN. The reused compiler lives at
/private/tmp/lykn-p07-yr-cdc.dFVEEv/source/target/release/lykn and corresponds
to immutable source d0bb981dae2a4abf6c984406c4b2081a45cc92f8. Registered
planning and release/0.6.x were clean before review; release/0.6.x HEAD was
50608c4. Existing source worktrees and shared binaries remain unchanged.

## Diagnosis and repair boundary

The observed failure is script selection, before application execution. Extra
permissions cannot fix a missing selected script, as both all-grants repetitions
demonstrate. Closed stdin is part of the controlled condition; these observations
do not show that stdin support was removed or broken.

The captured Deno v2.9.6 parser source supports CC's attribution:
upstream-deno/defs.rs around line 611 defines script_arg as an ordinary single
positional; parse.rs:164–187 routes tokens after a pre-script separator into
trailing arguments; convert.rs:1415–1465 falls back to task listing when
script_arg is absent. Current Lykn cmd_run retains the pre-script separator,
originally inserted to protect leading-hyphen filenames. This is source-backed
analysis of the reproduced failure, not an upstream patch test or a direct-Deno
file A/B experiment. Those distinctions remain in D-2609-DARG.

Eval's different entry path accepts the generated code as its code argument.
The captured convert.rs:1507–1510 explicitly sets allow_all in eval_parse;
the [official eval documentation](https://docs.deno.com/runtime/reference/cli/eval/)
also describes its default permissions. The actual help now lists permission
options, but that listing alone does not establish a restricted default. This
tooling route is authorized by the operator and recorded with its real authority;
it does not prove the wrapper's denied/scoped behavior. No permission regression
matrix, package execution or supervisor experiment was run here.

Arc03/Slice06 must keep ordinary launch on deno run, select the intended program,
and preserve explicit permissions, optional caller separators, literal arguments,
config/overlays, frozen/cache flags and exit propagation. Removing a separator
without protecting leading-hyphen filenames is incomplete. Likewise, applying
filesystem normalization indiscriminately could alter stdin "-", specifiers,
symlink semantics or relative-import bases. The reviewed open set now makes
inspection and preservation of existing supported forms explicit, within the
same four source paths and six criteria. It adds no new protocol support,
package installation, source propagation or policy exception.

## Eight-row and silent-drop review

- DB-01: identity and candidate ownership evidence only; full operational freeze
  and executable preparation remain owed.
- DB-02: 188 file correspondences reproduce; actual reachable runtime/type graphs,
  upstream development/example/toolchain edges, licenses and lineage remain owed.
- DB-03: candidate config/lock is reproducible; resolution, integrity-fault and
  warm/cold runtime conditions have not executed.
- DB-04: launch failure is not NotCapable evidence. Permission matrix and actual
  supervisor preflight remain owed.
- DB-05: replacement/concurrency/fault/cancellation drafts are not a validated
  harness; every observation/readiness control and file-state trial remains owed.
- DB-06: inherited J/Y cases remain represented; resource reconciliation,
  supervised representative trials and qualified available-pair comparison remain owed.
- DB-07: document/API/ancestry gates are preserved; compatible-route alternatives
  and a concrete document prerequisite remain owed.
- DB-08: packet/static replay is reproduced; full runtime/evidence-tooling
  validation and eventual independent slice closure remain owed.

All eight rows stay open and unchanged. The missing adapted supervisor is
explicitly disclosed, not supplied by copying its predecessor's status. All
15 promised deliverable obligations survive. The candidate graph is labeled
published metadata, not a resolved execution graph. Three failed authoring
conditions remain charged to the original correction budget; successful eval
tooling does not reset that budget or validate cases.lykn/package.lykn at runtime.

All R-01–09 conditions, 36 unsupported Y-13 cells with API-dependent re-entry,
28 gated Y-14 document cases, source/compiler/formatter/tooling findings,
guide/book evaluation, recursive ADT contracts, patch identity and operator
code-shape acceptance retain their owners. Historical PERM closure is unchanged.
The discovery is still open; confirming the blocker does not repair it.

## Evidence and replay

[CDC raw packet](artifacts/cdc-raw-transcript.txt), SHA-256
c25cce8bbbf4759587be978146a7f1d348dda8457d873555f3ec79638201df81,
retains fresh minimal sources/emitted files, argv bytes, source gates, four
failed-launch streams/exits, eval/static/extraction receipts, comparison receipt,
runtime/help/hash evidence and the captured parser files reviewed here. Its
hex envelopes preserve binary argv exactly. The original 460-file CC packet
remains unchanged and supplies the published inputs and original drafts.

Follow the [baseline replay](artifacts/baseline-and-protocol.md) using a freshly
identified d0bb981 executable and the identified available runtime. Build from
the immutable source if the previous verified binary is unavailable. Compile
audit.lykn, check/lint and inspect emitted JS before eval. Extract CC's packet
into a new empty root; save the six generated files before running published
and freeze; compare afterward. Use a new root for every minimal invocation.
The documented shell command substitution removes trailing newlines when
transporting JS as an argument; the generated program is not hand-edited, but
that route should not be described as preservation of every terminal LF byte.

CDC packet extraction uses the same retained audit's extract mode with the CDC
packet path and a fresh empty destination. Its output is 351 checks/70 files.
Captured replay does not invoke historical absolute record paths. New runtime
evidence requires the fresh launches described above. The packet does not
contain a corrected launcher or a completed Slice04 matrix.

## Bubble-up

Accepted the blocked prerequisite handoff and reviewed the existing Arc03/Slice06
open set. The correction is the next CC action, followed by its independent CDC
and a traceable new compiler condition before returning to the full Slice04
preparation. Project and both arc plans/status now identify that sequence.
No slice, arc or project closes in this review; no human or adoption criterion
inherits success from the partial static evidence.
