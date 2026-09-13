# Slice04 blocked handoff — not a close

2026-09-13, CC. **All eight DB-01–08 criteria remain open; none is proposed-done.**
Planning started at ae179ea8658e8a6999f8162151345c0aca280ea9. This report belongs
to the scoped blocked-handoff commit whose exact identity is returned after
commit. No source change, independent CDC or slice closure is claimed.

## Delivered evidence and blocker

The isolated d0bb981 locked build reproduced the pinned CLI hash. Deno initially
matched 2.7.7; the operator then upgraded it to 2.9.6 and clarified the version.
Actual post-upgrade launches fail before script execution: one generator launch,
two fresh no-grant minimal reproductions and two operator-requested explicit
all-grants reproductions, all exit 1. NUL-delimited argv and pinned Deno parser
source identify the pre-script separator interaction. Stdin was closed; no stdin
regression is claimed. See [baseline and replay](artifacts/baseline-and-protocol.md).

The operator suggested eval. The exact compiled minimal Lykn program succeeded
through `deno eval`; native Lykn tooling then generated 47 candidate rows with
three ownership checks and verified all 188 published files with 376 size/hash
checks. This route retains implicit-all permissions and cannot satisfy restricted
wrapper tests. No package code was evaluated. No frozen matrix, supervisor
control, resource, replacement, concurrency or cancellation trial ran.

Three failed source conditions are retained, plus their corrections and source
gate/emitted output evidence. Original first/second draft reconstructions recompile
to retained emitted bytes. A dependent invocation sequence attempted package
gates after the failed generator; those missing-file diagnostics remain visible.
The final research drafts have not been runtime-validated as a harness.

## Eight-row walk

| Row | Status | Present evidence and remaining work |
| --- | --- | --- |
| DB-01 | open / partial attestation | Source/build/runtime identity and candidate ownership generation; complete operational freeze and launch still owed |
| DB-02 | open / partial attestation | All 188 published files match metadata; full runtime/type/dev/example/toolchain/lineage audit still owed |
| DB-03 | open / blocked | Candidate merged lock/config retained; frozen corruption, alias/missing and warm/cold variants not run |
| DB-04 | open / blocked | Actual argv and all-grants diagnostic retained; denied/scoped matrix and supervisor preflight still owed |
| DB-05 | open / blocked | Worker/replacement source draft retained; observation control, metadata, concurrency/fault/cancellation and cross-filesystem execution still owed |
| DB-06 | open / blocked | Original J/Y inputs preserved; representative resources, reconciliation and qualified comparison disposition still owed |
| DB-07 | open / partial attestation | Interim decision preserves document/API/ancestry gates; full alternatives and compatible-document prerequisite still owed |
| DB-08 | open / partial attestation | Drafts, raw capture, native static audit and prerequisite routing; full runtime handoff and CDC still owed |

Owner of the remaining R-01–09 workload is Slice04. Re-entry is independent CDC
verification of [Arc03/Slice06](../../arc03-findings-and-integration/slice06-deno-launch-compatibility/slice-plan.md),
a traceable new compiler condition and fresh complete preparation/controls. The
removed 2.7.7 runtime must not be treated as available or silently reinstalled.

## Artifact inventory and validation boundaries

Produced under artifacts: baseline-and-protocol.md, case-manifest.md, inputs.json,
project.json, deno.lock, dependency-graph.json, cases.lykn, audit.lykn,
raw-transcript.txt, results.md, dependency-inventory.md, decision-record.md,
authoring-observations.md and findings.md. Config/lock/inputs are candidate setup;
the graph is published metadata, explicitly not a resolved runtime graph.
The promised adapted supervisor.lykn is **not delivered**. Its previously verified
Slice06 predecessor is retained in the packet as a reference, not silently adopted
as a working Slice04 harness. All 15 promised deliverables keep their obligations.

The packet contains exact input/source/metadata/downloaded files, build and gate
receipts, original/revised drafts, runtime-change inventory, argv/failure streams,
eval controls and native-audit receipts. Native Lykn pack/extract is separate from
the blocked full runtime replay. Final packet extraction verified 460 files;
fresh replay reproduced all six generated outputs byte-for-byte. Separate
check counts and the packet hash are in results.md. No source `make check` is claimed for this planning-only
handoff; the next correction requires canonical source gates.

## Bubble-up to the arc

The assigned runtime/dependency capability has **not** been delivered. The
operator's Deno upgrade exposed D-2609-DARG. Arc/project body and histories now
insert Arc03/Slice06 before resuming this same Slice04 identity. This is
prerequisite routing, not closure, source repair or replacement of the workload.

Silent-drop walk: all R families and operational conditions survive; 36 unsupported
Y-13 cells retain overlapping conversion/bound reasons and API-dependent re-entry;
all 28 Y-14 cases remain gated in Slice07. A fixed launcher will not establish a
compatible document route. Slice04 must still supply that evidence or open its
actual design/correction prerequisite. Source/compiler/formatter/tooling,
guide/book evaluation, recursive ADT boundaries, patch identity and operator
code-shape acceptance retain Arc02/Arc03/Arc04 ownership. All project rows and
Arc01 A-03–06 remain open. Historical PERM closure retains its original condition;
DARG is separate compatibility work.
