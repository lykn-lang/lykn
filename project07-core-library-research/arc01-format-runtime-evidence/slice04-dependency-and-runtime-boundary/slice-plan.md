# Slice04 — Dependency and runtime boundary

Status: **Open for execution.** Expedited Mode. Eight open ledger criteria.
This retains the original Slice04 identity and all R-01–09 families. It follows
Slices03/05/06 and precedes Slice07; numbering is not execution order.

## Capability and inputs

Establish which runtime, dependency and file-operation boundaries the proposed
JSON/YAML libraries can actually rely on, with explicit alternatives and unresolved
decisions. Distinguish measured behavior, pinned source evidence, upstream claims,
policy proposals and operator acceptance. Registry placement is not provenance.

Read the project/arc plans and ledgers; [FM01](../slice01-baseline-and-protocol/artifacts/fixture-matrix.md),
[RP01](../slice01-baseline-and-protocol/artifacts/research-protocol.md),
[Slice01 findings](../slice01-baseline-and-protocol/artifacts/findings.md),
[JSON CDC](../slice02-json-behavior/cdc-verification.md),
[YAML preflight CDC](../slice03-yaml-preflight/cdc-verification.md),
[value CDC](../slice05-yaml-value-behavior/cdc-verification.md) and
[resource/file CDC](../slice06-yaml-resource-and-files/cdc-verification.md).
Follow their actual linked baseline, sources, locks, claims and observations.
Source/book and guide findings remain with Arc02/Arc03; do not infer repairs.

## Complete family inventory

Freeze a concrete, enumerated variant manifest before executing it. Copy each
original FM01 R row verbatim alongside its operational expansion; do not rename,
collapse or omit any condition. Record every variant's ID, owner, entry point,
input/config/lock/cache state, grants, repetitions, expected observation, budgets,
stop conditions and eventual disposition. New subcases extend the inventory.
Map relevant J/Y evidence by exact variant and attempt IDs, without counting old
runs as new executions.

| Family | Required conditions and evidence |
| --- | --- |
| R-01 | Refresh immutable source/build/runtime identity, effective help/argv and a minimal no-import Lykn launch. Compare source, executable and Deno hashes separately; record current live drift without substituting it. |
| R-02 | Exact std/json 1.1.0, std/jsonc 1.0.2, std/yaml 1.2.0 and the retained exact streams resolution; qualified static @eemeli/yaml 2.9.1 inspection. Inventory reachable runtime/type edges separately from development/test/example/toolchain edges, full URLs, hashes, locks, licenses and upstream lineage. A graph of one probe is not the whole package. |
| R-03 | Narrow import map success, alias mismatch, missing package, missing subpath and corrupt disposable lock. Record actual failures and before/after lock bytes under frozen mode. Do not alter real caches or silently repair failed locks. |
| R-04 | New dedicated cache with declared online prefetch, complete warm cached-only replay and empty-cache offline failure. Separate resolution/network transport from runtime net grants and process permission controls. Preserve exact cache state and actual command flags. |
| R-05 | Parser-only with no grants; read-only input; write-only output; each denied counterpart; denied env/net/run operations. Verify effective argv and actual NotCapable failures with no prompt, null stdin and clear environment. Do not mistake an OS error, invalid argument or unavailable endpoint for a Deno denial. |
| R-06 | Sibling temp write, complete write loop, flush/close/rename; preexisting file, isolated symlink, mode bits, concurrent reader, two writers. Inspect actual destination/link/target bytes and metadata. Use an explicit protocol/checkpoints to observe concurrency; last-writer wins or a no-partial-read observation does not establish conflict policy or universal atomicity. |
| R-07 | Different-filesystem rename only if a suitable isolated second filesystem already exists; injected open/write/flush/rename errors; cancellation before and after rename. No mount creation or disk filling. Distinguish each injection from actual OS error and from process termination; capture aftermath before cleanup. If no permitted second filesystem exists, preserve an unexecuted variant with reason, owner and exact re-entry. |
| R-08 | Reconcile J-16 and every Y-13 resource cell, actual CPU/time/RSS/output observations and supervisor controls. Execute a bounded representative JSON/YAML supervisor replay, with exact retained recipes and stage attribution; do not repeat large series without a new question. Never derive asymptotic complexity, a hard memory limit or universal safe size from sampled results. Preserve all 36 unsupported YAML cells, their overlapping toJS/bound reasons and API-dependent re-entry. |
| R-09 | Compare the frozen baseline with another already available supported Deno/CLI pair only after identity and support evidence. No installation or source rebuild at an unapproved revision. Missing pair/support evidence means unavailable, with owner and re-entry. Compiler-only drift does not substitute for a runtime comparison. |

## Baseline, execution and safety

Use isolated source d0bb981dae2a4abf6c984406c4b2081a45cc92f8 and the
retained lock; cargo build --release --locked is infrastructure. Expected CLI
SHA-256 78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb;
Deno 2.7.7 at /opt/homebrew/bin/deno has SHA-256
103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4.
Record source tree, compiler toolchain, platform and build receipt. Protect all
registered source worktrees/shared binaries. Treat unexplained drift as a new
condition before comparison. Already available comparison binaries must be
identified and scoped first.

Lykn owns research programs, generation, supervision, inspection, aggregation,
packing and verification. Shell/Git/Cargo and pinned dependency transport are
infrastructure. No Python/Ruby/Fennel/JS fallback, generated-JS repair, blanket
-A grants, Node/npm execution, package installation or publication. Use the
pinned Lykn skill and relevant guides; record loaded references and known context.
Preserve original/revised source and diagnostics. Check/lint/compile and inspect
emitted programs before interpreting results. At most five failed correction
iterations; before exhaustion, explicitly re-slice with all owed variants owned.

Use fresh disposable CWD/HOME/TMPDIR/cache/input/output roots, null stdin,
no-prompt and a cleared environment. Package execution is cached-only/frozen
after explicit prefetch. Static transport for a prohibited candidate does not
authorize evaluating its modules. Pin complete graphs/configs/locks before each
condition; never rely on a warm global cache or execute a graph with unresolved
Node/npm/error edges. Scope each child's read/write/env/net/run grants to its
actual declared need. A supervisor grant does not grant the child authority.

Reuse and independently preflight the retained Lykn supervisor: host process
observation before loops, wall/output/RSS termination and no observed survivors.
Use the authorized host route for observation and owned-child termination.
Keep the 10s, 16MiB retained-output and 512MiB sampled-tree RSS external budgets
unless the frozen protocol explicitly requires a smaller control threshold.
Inspection is separately bounded (depth 256, visits 4096, nodes/members 2048,
strings/binary 4096), with bounded serialization and input transport. Sampled
limits are not hard allocation guarantees. Record full streams/hashes up to the
declared cap, elapsed/CPU/sampled-memory evidence with units and attribution.

Repeat executable functional/fault/concurrency variants twice in fresh roots.
Resources use retained RP01 measurement rules when new measurements are needed;
prior observations keep their provenance. External controls and harness controls,
authoring corrections, unsupported variants, blocked variants and protocol
not-runs have separate denominators. Stop the affected family on a cap or invalid
harness observation; retain larger/unexecuted obligations and exact re-entry.
Never tune after seeing outcomes and silently substitute the confirmation.

For concurrency, bound process counts and payloads before launch; coordinate
readiness, replacement and cancellation through observable checkpoints. Record
reader observations, both writers' outcomes, every complete candidate hash and
the final destination. A reader must demonstrably observe the intended window;
zero samples or a writer finishing before observation is inconclusive. Include a
checkpoint/control that proves the observer can detect a deliberately partial
raw write. No escape through symlinks; all link targets stay inside scratch.
Capture original mode, link type, target and destination before each fault and
immediate aftermath before repair. No successful rename proves crash durability.
Do not reuse stale PIDs as authorization to kill an unrelated process.

## Dependency and document-route decision

Use pinned captured upstream source as primary evidence; refresh official
sources when making current compatibility/maintenance claims, keeping dates and
immutable locators. Inventory ancestry separately from imported APIs and registry
transport. In particular std/yaml's declared js-yaml lineage is not erased by
its runtime graph lacking Node/npm. Current user direction excludes Node and
that ecosystem; do not turn an ancestry policy ambiguity into acceptance.

Produce a decision table for native facilities, reviewed Deno/JSR candidates,
an explicitly identified compatible document route if one can be evidenced,
and a separately planned Lykn implementation/port if needed. For each: actual
read/parse/edit/write and source-fidelity capability, value-domain losses,
recursive/ADT boundary implications, runtime/type/dev graphs, license/lineage,
missing safety APIs, evidence strength and required operator decisions.
Existing npm tooling/test-runner implicit grants remain separate open corrections;
they do not authorize new-library npm or blanket permissions.

D-2609-YNOD stays open unless its actual correction is independently verified.
Do not execute or adopt @eemeli merely because it is published on JSR. Do not
install alternatives, vendor/port a package, implement a library or relax policy
inside this slice. A proposed compatible route needs exact identity, inspectable
source/provenance, full reachable graph and actual relevant API evidence before
Slice07 can open for runtime. If adoption or ancestry interpretation requires
operator choice, prepare a concrete reviewable decision; silence is not consent.

If no compatible route is established, document that outcome and route an
explicit correction/design obligation in the existing arc/project plans, with
owner, bounded scope and re-entry. Slice07's 28 original Y-14 variants remain
required and gated, never closed by static rejection. The same rule preserves
the 36 unavailable Y-13 cells: route/API/bounds decisions precede any claimed
conversion or package-bound result. Research completion may establish a missing
capability; it cannot establish adoption or fulfillment of that capability.

## Deliverables and closure

The exact artifact paths are in cc-prompt.md: baseline/protocol, expanded
manifest, config/lock/graph, Lykn cases/supervisor/audit, complete lossless packet,
runtime results, dependency inventory, decision record, authoring observations
and findings. Original failures and pinned source locators belong in the packet.
Every report row resolves to actual variants, attempts and raw records. Provide
separate fresh runtime replay and captured-evidence audit instructions; test both,
including shell quoting. The Slice06 CDC recorder correction is authoritative.

Keep all eight ledger rows open until independent CDC. Report justified work as
CC proposed-done, with counts/dispositions, exact commit, artifact inventory,
replay, limitations and **Bubble-up to the arc**. Update ancestor body and Version
History; retain source, guide/book, ADT and operator code-shape findings and
owners. No model supplies the user's aesthetic acceptance. Arc A-03–06 and all
project rows remain open; Slice04 closure does not replace later composition.
After CDC, open Slice07 only with a compatible route; otherwise open the
explicit prerequisite work, preserving the complete document scope.
