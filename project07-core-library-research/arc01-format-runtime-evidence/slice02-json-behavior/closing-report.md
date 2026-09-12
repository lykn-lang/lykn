# JSON behavior — CC closing report

**CC proposed-done; independent CDC reproduction and formal closure pending.**
2026-09-12. Scope: Arc01/Slice02 J-01–17, research artifacts only.

All 161 frozen variants executed: 220 native attempts, 86 extension attempts and
48 stress attempts. All 153 deterministic stdout pairs agree. Three supervisor
controls passed before format execution; the harness's real denial/scoped-read
and argv controls also passed. No J-family is blocked, deferred or not-run.
Expected errors, lossy conversions and four intended interruption exits are
retained as observations, not relabeled lossless successes.

## Seven-row walk

| Row | CC disposition | Evidence and remaining independent work |
| --- | --- | --- |
| J2-01 | Proposed-done; ledger open for CDC | [Launch and baseline](artifacts/baseline-and-launch.md). Actual no-grant denial and scoped success; argv recorder confirms no implicit grant. |
| J2-02 | Proposed-done; ledger open for CDC | [Frozen manifest](artifacts/case-manifest.md). All 17 families, 161 variants; original escaped fixture retained before correction. |
| J2-03 | Proposed-done; ledger open for CDC | [Results](artifacts/results.md) and [bytes](artifacts/byte-evidence.md). 220 native attempts; typed losses, exact keys, expected errors and file effects recorded. |
| J2-04 | Proposed-done; ledger open for CDC | [Graph](artifacts/dependency-graph.txt), [lock](artifacts/deno.lock), [results](artifacts/results.md). 86 package attempts; three exact JSR packages, no Node/npm graph edges. |
| J2-05 | Proposed-done; ledger open for CDC | [Supervisor](artifacts/supervisor.lykn) and [raw records](artifacts/raw-transcript.txt). Three controls passed before format cases; 48 stress attempts, sampled RSS limitation explicit. |
| J2-06 | Proposed-done; ledger open for CDC | [Authoring](artifacts/authoring-observations.md) and [findings](artifacts/findings.md). Original/revised source, three compiler discoveries, existing JSER runtime support; human judgment pending. |
| J2-07 | Proposed-done; ledger open for CDC | [CC report](closing-report.md). Replay packet and same-author evidence audit complete; independent CDC verification still required. |

J2-07 is a submission for independent reproduction, not a claim that the author
has performed it. CDC must walk all rows, inspect coverage/interpretation,
reproduce the preflights and representative native/package/resource/failure
cases, and decide formal closure. No operator aesthetic approval is inferred.

## Artifacts and verification

The 13 required artifacts are present: case-manifest.md, cases.lykn,
supervisor.lykn, inputs.json, project.json, deno.lock, baseline-and-launch.md,
dependency-graph.txt, results.md, raw-transcript.txt, byte-evidence.md,
authoring-observations.md and findings.md. Every artifact is in this slice's
artifacts/ directory; this report and status updates use the authorized paths.

Both retained Lykn programs passed check/lint/compile with compiler warnings
preserved. Runtime programs were always launched through the selected Lykn
binary; direct Deno commands performed dependency/type/help inspection only.
Same-author evidence audit checked every ID/repeat count, source and output
hash, expected termination, surviving process set, unchanged input state,
selected independent invariants and all normal stdout pairs. It passed 2940
checks. This is an audit of 354 runs, not 2940 independent test cases. A final
audit also confirmed all 134 package/stress lock copies and all 354 compiled
hashes, six independently expected primitives, 36 unsupported-value positions
and six presence variants. The 13-artifact inventory, 85 local links and exact
22-path scope and staged whitespace checks passed. No source changed, so no
source Make/cargo regression gate is claimed.

Exact full replay commands and pinned identities are in
[baseline-and-launch.md](artifacts/baseline-and-launch.md#replay-from-retained-inputs).
Run source gates, own denial/scoped-read controls, supervisor controls, native,
then frozen package graph/cache, package and stress in a new scratch root.
Expected output record counts are 3/220/86/48. The raw transcript contains the
full original/revised sources and emitted JS; no generated output was repaired.

## Limits and discoveries

Native precision/duplicate/presentation loss is demonstrated. JSONC is a value
rewrite; canonical output is a separate policy; stream framing matters. J-15's
BAD-frame controls produce downstream syntax errors, not a complete framing
validator. Stress measures include harness work and cached-module startup;
sampled RSS is not a hard cap, nor are polling deadlines exact. File interruption
proves the observed Darwin fixture behavior, not power-loss durability or
concurrent-reader atomicity. These were already Slice04/library-contract topics.

D-2609-NZRO/JSCF/UNUS record negative-zero code generation, invalid composed
emitted forms and misleading unused-binding warnings. D-2608-W2HF is a related
existing symptom; root-cause identity is unresolved. D-2609-JSER receives
BigInt runtime evidence without a book repair claim. Original agent syntax,
macro-as-function and NaN-annotation mistakes are separately attributed.

## Bubble-up to the arc

1. Delivered the arc's assigned JSON behavior piece: every frozen J-family and
   all variants have retained runtime observations, bytes/values/errors and
   bounds. The package graph is actual and pinned; no dependency adopted.
2. Compilation success did not guarantee valid emitted JavaScript. The arc and
   project plans now preserve compiler/diagnostic findings and require later
   authoring to inspect generated output before interpreting format behavior.
   Future openings should separate harness preparation from large matrices;
   this task crossed context boundaries but retained all failed sources and
   stayed within five authoring interventions. No scope split or family removal
   was needed to deliver the evidence.
3. Silent-drop diff: J-01–17 were specified and executed; no requested deferral.
   Full AE01/L-01–08 and operator judgment remain Arc02; adoption/full graph,
   offline, replacement concurrency/durability and wider resource policy remain
   Slice04. YAML, including gated document preservation Y-14, remains Slice03.
   Independent CDC and arc/project composition remain open. No later requirement
   is closed merely because a related JSON case ran.

Next action is independent CDC review of this slice. After verified closure,
open Arc01/Slice03 YAML with its full scope and inherited prerequisites. That
next prompt does not exist yet and is not claimed ready here.
