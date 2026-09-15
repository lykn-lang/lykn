# Document-route design for operator review

2026-09-14, CC/Sofie. **Qualified design direction accepted by the operator;
new-code licence and independent CDC remain pending. No compatible implementation
is claimed.** Starting planning commit: `6518d57`. Actual decisions and their
qualifications are in [decision-record.md](decision-record.md). There have
been zero document/package executions, source edits or repository creations.

## Recommendation and five alternatives

Recommend a separately maintained Lykn/Deno document route, with a bounded
evaluation of an attributed Eemeli 2.9.1 port as its first implementation option.
The operator approved this direction subject to a complete translation inventory
and feasibility review before commitment to a port. Require idiomatic Lykn and
ADTs internally, not merely a Lykn interface around mechanically translated
TypeScript. Internal document/node/value/error representations, matching and
control flow must be reviewed as Lykn design, with representative source trials
and the operator's language-design goals retained.
Keep the original source bytes and syntax graph separate from converted values.
Use byte splices for supported edits; do not rely on whole-document serialization
to preserve unrelated bytes. First prove the route can satisfy the original
28 Y-14 cases. Failure of that proof must return to design, not weaken the
fidelity threshold or expand into an unbounded parser rewrite.

This recommendation favors existing grammar knowledge over independently
reimplementing all YAML semantics. It adds significant port/conformance/security
maintenance and a new preservation layer; neither its cost nor feasibility has
been measured. An independently authored parser is the fallback design option,
requiring a separate estimate and scope. It is not automatically authorized if
the port fails. Native JSON and std value APIs remain useful alternatives for
explicit value-rewrite workflows; they do not satisfy document preservation.

| Existing alternative | Evidence and utility | Why choose or decline it for this document contract |
| --- | --- | --- |
| Native JSON plus Lykn validation | Verified parse/value edit/stringify; no third-party parser dependency, but Deno/V8 and existing compiler dependencies remain | Recommend for separately scoped JSON value work. It loses lexemes/duplicates/presentation and supplies no YAML document model |
| Pinned std JSON/JSONC/streams and YAML value APIs | Verified selected graph has no Node/npm imports; JSONC comments and YAML presentation do not survive value rewrite; no YAML conversion/bound API | Keep as qualified value-workflow option, subject to policy disposition. Not the fidelity route; streams do not prove constant memory |
| Eemeli 2.9.1 unchanged | Static Document/setIn/toJS/toString/comments/token APIs, ISC notice; source imports node:process and node:buffer | Decline under current runtime boundary. Its API surface alone is not a compatible route or preservation proof |
| Eemeli browser build claim | Rollup config replaces Node bindings and emits ESM; generated output absent from retained source; build uses npm tools | Decline as an accepted artifact. A browser label does not prove graph closure, API equivalence, source correspondence or a permitted build |
| Independently maintained Lykn/Deno implementation or port | No implementation evidence. Can own graph, bytes, explicit conversion and all stage/error contracts | Recommend bounded attributed-port evaluation, with Lykn public API and native Deno/ECMAScript dependencies. Our own build/test path must pass the chosen boundary; retain upstream ancestry/notices and a divergence ledger |

Evidence: [Slice09 inventory](../../../arc01-format-runtime-evidence/slice09-dependency-decision-and-reconciliation/artifacts/dependency-inventory.md)
and [decisions](../../../arc01-format-runtime-evidence/slice09-dependency-decision-and-reconciliation/artifacts/decision-record.md),
[value CDC](../../../arc01-format-runtime-evidence/slice05-yaml-value-behavior/cdc-verification.md),
[resource CDC](../../../arc01-format-runtime-evidence/slice06-yaml-resource-and-files/cdc-verification.md),
[FF CDC](../../../arc01-format-runtime-evidence/slice08-file-fault-completion/cdc-verification.md),
[runtime CDC](../../../arc01-format-runtime-evidence/slice10-runtime-resource-and-composition/cdc-verification.md)
and the [separate DB closure](../../../arc01-format-runtime-evidence/slice04-dependency-and-runtime-boundary/cdc-verification.md).
The proposal uses those pinned sources, not an unverified newer release.

## Boundary and maintenance proposal

Disallow Node built-ins, npm imports, require/CommonJS, Node compatibility shims
and dynamic loading of unenumerated modules in the new route's runtime, type,
test and build graphs. Use the already accepted pinned Lykn CLI as an explicitly
inventoried toolchain dependency; its existing npm/astring/node:path ancestry is
not represented as clean, and does not authorize a new library exception.

Allow attributed reuse of MIT/ISC source and fixtures after file-level provenance
review, even where historical upstream development used Node/npm. Do not run
upstream npm builds/tests here. This distinguishes accepted historical ancestry
from forbidden dependencies in the new owned route. A policy that excludes all
historical Node/npm ancestry would reject the port and std YAML ancestry; that
is a real alternative requiring a new design, not an implicit exception.

Retain exact upstream commits, original paths/hashes/notices, copied-file and
translation mappings, modification descriptions and local regression evidence.
Eemeli source is pinned at `1440ecd3d1bff41e4ac399f8f6839e810328bd16`.
Any reused MIT or ISC notice remains with its source and distribution. The
eventual new-code licence remains pending by explicit operator choice. The
earlier ISC recommendation is not adopted; upstream selection must not choose
our new-code licence. This is a project provenance contract, not a legal
opinion. Unretrieved submodules or dependency sources
remain unresolved until needed and reviewed; empty archive directories are
not a clean dependency graph.

The operator accepts accountability as maintainer, build owner and release
decision owner. Implementation and review may be delegated appropriately.
Assistants can implement/review bounded
tasks but do not assume ongoing maintenance. Before each release, the named
owner must review upstream changes/security reports, every local divergence,
conformance failures, source licenses and reproducible build receipts. No
automatic upstream merge, publication or release schedule. If there is no
accepted maintainer, the route remains a research design and cannot be adopted.

## Observable document and edit contract

These are conceptual interfaces/types; exact Lykn syntax and recursive ADT
behavior require Arc02 source trials. They are not generated code or prototype APIs.

| Stage | Contract |
| --- | --- |
| Read | Read bytes under explicit source authority; reject over-limit or invalid UTF-8 without replacement-character decoding. Retain exact bytes, digest, BOM and line endings; empty stream is distinct from a null document |
| Parse document | Produce an ordered document stream, concrete token/trivia spans and semantic node graph without converting to host objects. Preserve directives, document markers, comments, blank lines, styles, tags, anchors, aliases and duplicate mapping occurrences |
| Inspect | Every node has stable identity within a document revision, tag, source byte span and graph edges. Offsets are UTF-8 bytes; expose explicit byte-to-character/line conversion. Diagnostics retain ordered severity/code/stage/span/message and underlying cause |
| Edit | Apply an immutable change set against a document digest/revision. Paths use typed string keys/indexes or stable occurrence IDs. Missing and null are distinct. Ambiguous duplicate-key paths and implicit alias-target mutation return an error; the caller must name the occurrence/target explicitly |
| Render | No-op is byte-for-byte original. Supported edits replace only declared disjoint byte ranges or insert at declared offsets. Unchanged slices are copied verbatim. Reparse proposed bytes, validate requested semantic changes and unchanged graph/trivia before allowing a file commit |
| Convert | Explicit separate operation from graph to recursive values or application domain. It reports unsupported tags, cycles, ambiguous keys and precision loss as Result errors; it never silently collapses them |
| Write | Accept validated bytes plus source revision/destination expectation and an explicit write intent. Return a commit receipt whose visibility/durability state is distinct from cancellation/cleanup status |

Default interpretation is YAML 1.2 core; explicit YAML directives must be
reported and checked. YAML 1.1 resolution is a separate named profile requiring
its own conversion tests; it is not silently selected for legacy spellings.
Original Y-14 `schema: default` is preserved in the input contract and the route
adapter must document its exact mapping to the selected profile. Unknown tags
remain opaque syntax with diagnostics; they do not load constructors. They may
survive a no-op or unrelated edit, but conversion or direct mutation requires
an explicit supported adapter. Invalid documents return diagnostics and retained
source; normal edits/writes are disabled. Repair-mode design is out of scope.

Mapping entries remain ordered node pairs rather than JavaScript object
properties. Duplicate occurrences, non-string keys and merge syntax remain
represented. Aliases are references to node IDs; cycles are finite graph edges.
Editing an anchored node affects its references semantically and must be
explicit in the change set. Editing an alias site without permission to affect
the target fails. Anchor spelling/ordering is preserved; deleting a referenced
anchor fails unless an explicit graph rewrite accounts for every reference.
Merge expansion is an explicit conversion policy, not a parse-time rewrite.

Comments associate with concrete spans as well as nodes, so deleting a node
does not silently delete a neighboring comment. General deletion/insertion/
reordering contracts need additional cases before implementation. The first
bounded proof permits only the original no-op and root `n=2` changes. A route
must reject unsupported edits before changing the document. A normalized
whole-document rewrite may be offered only as a separately named future mode
with explicit caller consent; it is never a fallback for preservation failure.

## Exact original fidelity thresholds

[y14-crosswalk.json](y14-crosswalk.json) retains each full original row, exact
input/case hashes, token option, edit, original repeat count, proposed output
hex/digest and allowed byte splice. Seven documents × two token settings ×
no-op/edit = 28 IDs; two original attempts each = 56 per condition. No cases
have run in this design slice. Internal byte/span retention is required in both
token modes; the option controls public token exposure, not permission to lose
comments or rewrite unrelated bytes.

For doc0, replace only the two ASCII bytes `01` with `2`. For doc3–6 replace
only the one numeric byte `1` with `2`. For doc1–2 append `n: 2` plus LF at the
original EOF, preserving block content/chomping. All no-op outputs are exact
input bytes. BOM, CRLF, directive, quotes, comments, order, blank lines and
final-newline absence outside those splices must remain unchanged. Require
zero unrelated changed bytes, zero semantic mismatches, zero lost trivia and
zero unexpected diagnostics. Both token modes must produce the same bytes and
semantics; public token availability differs. If the adapter cannot meet this,
retain the failing case; do not call semantic-only equality a fidelity pass.

## Recursive values and Result boundaries

Proposed recursive value algebra: Null, Bool, Text, ExactInteger(decimal text),
ExactDecimal(sign/coefficient/exponent), Sequence(values), Mapping(ordered
key/value pairs). Missing is an Option/lookup outcome, not a Null variant.
The document graph separately carries NodeId references, aliases, cycles, tag
and lexical information; a recursive tree cannot encode all graph identities.
Strict JSON projection permits only unique string keys, finite numbers in the
application's chosen precision domain, arrays and JSON scalar types. Preserve
arbitrary keys as data; never use prototype-bearing object assignment as a map.

NaN/infinities, signed zero, binary, timestamp, set, undefined/functions/symbols,
non-string keys, duplicate keys and alias cycles receive explicit conversion
dispositions. Preserve their syntax in the document; strict tree/JSON conversion
rejects unsupported values. Host Date, Map or Set are not implicit interchange
types. Exact decimal lexemes avoid JS Number rounding; conversion to Number or
BigInt is opt-in and checked, with original spelling and precision warnings
retained. A shared acyclic node may be copied only in an explicitly bounded
tree-conversion mode; default conversion rejects graph sharing as loss of identity.

Conceptually every public stage returns `Ok(value, diagnostics)` or
`Err(stage, code, location, cause, sourceDigest, commitState)`. Stages are
read/decode/parse/edit/convert/render/validate/write/cleanup. Expected user-data,
permission and limit failures do not escape as thrown exceptions. Preserve an
underlying cause for debugging without exposing full input in diagnostics.
Unexpected internal invariants fail distinctly and retain evidence; they are
not mislabeled invalid YAML. Arc02 must verify recursive constructors, exhaustive
matching, asynchronous Result composition and representative source readability.
P-04/P-08 remain actual operator judgments, not design acceptance by proxy.

## Resource and cancellation proposal

Initial proof profile: input ≤1MiB, output ≤2MiB, depth ≤128, semantic nodes
≤100,000, alias references ≤100, expanded conversion nodes ≤100,000, documents
≤100, diagnostic retained text ≤64KiB. These are proposed conservative budgets,
not permanent library limits or limits measured/guaranteed by current packages.
The operator accepted them specifically as provisional research limits.
Check byte limits before
decode, counters during parsing/traversal and output before writing; do not first
allocate an unbounded tree/string and then claim a bound. Incremental counter
support must be independently proven or the API remains unavailable.

Cooperative cancellation checks occur at byte chunks and node/edge visits;
bound the check interval and prove responsiveness. Synchronous parsing may block
the caller's event loop, so external worker/process supervision remains required
until cancellation is proved. Reuse the research stop profile: 10s wall, 16MiB
captured output and 512MiB sampled tree RSS, with observation/cleanup controls.
Those stops are not hard allocator limits. Report parse/convert/render/setup
separately; supervisor wall includes drain/inspection and child CPU includes
launch overhead. No performance improvement or true peak-memory claim follows.

All 54 Y-13 rows and the 36 unsupported rows remain in the crosswalk: 18 missing
conversion, 27 missing explicit bound, overlap nine, zero unsupported attempts.
A future conversion function alone does not satisfy the bound rows, and external
supervision is not a package-bound API. Larger original recipes require their
separate reviewed profile; this 1MiB proof profile does not replace them.

## File policy proposal

Default API is pure parse/edit/render; file authority is a separate module.
Require explicit source read and destination-directory/temp/destination write
grants, plus read authority needed for rename source and conflict inspection.
Never inject permissions or copy-fallback after a denied/failed rename.

Restrict the first write profile to owned regular files in a caller-designated
directory, with trusted parent directories and no symlink traversal. Reject
symlink destinations, directories and cross-filesystem temp paths. Require
explicit replace-existing intent; a create-only operation must use an independently
proved no-clobber primitive, not an existence check followed by overwrite rename.
Until that primitive is proved, create-only publishing remains unsupported.

Serialize cooperating writers using an exclusively created sibling lock and
owner token, then reread and compare the expected destination digest. Refuse a
changed preimage. This is not an atomic filesystem compare-and-swap against
noncooperating writers: require exclusive ownership/cooperating-writer agreement,
or return UnsupportedConflictModel. External races and malicious directory
replacement remain outside this profile. No false claim that hashing closes
the time-of-check/time-of-use window.

Write an exclusively named sibling temp, check all writes, sync/close, validate
bytes, then rename once. New temp mode is 0600; preserve only explicitly selected
existing POSIX permission bits after inspection. Ownership, ACLs and xattrs are
not promised; files requiring their preservation are outside this profile.
Actual cross-device error 18, directory error 21, NotCapable and injected faults
retain distinct stage/error classes. No fallback to raw in-place writes.

Cancellation before rename leaves the original destination and triggers bounded
owned-temp cleanup. After successful rename return Committed, even if a later
abort/cleanup occurs. If termination loses knowledge of the commit point, return
Indeterminate and require explicit recovery inspection; do not promise rollback.
Return orphan paths/digests/owner tokens on cleanup failure. Never delete by a
broad filename glob or automatically reclaim a stale lock based only on PID.
Recovery requires operator inspection of owner identity and destination/temp
bytes. File sync does not prove directory-entry durability; crash durability,
power-loss recovery and durable directory sync are explicitly unproved and
unsupported by this initial profile.

## Actual source homes and alternatives

Fresh 2026-09-14 read-only inventory: planning is clean at `6518d57` before this
work; release/0.6.x is clean at `4dded88`; local mycelium is clean at
`e60af9dfef679e9aa83fdcd140a3b283ffa04112`, remote
`git@github.com:lykn-patch/mycelium.git`. Its README identifies a server-first
web framework. The official GitHub organization API returned only mycelium;
metadata/headers are retained in the design packet. That bounded local/API
inventory does not prove absence of all private or differently located repos.

| Source-home option | Concrete proposal and tradeoff | Verification/authority still needed |
| --- | --- | --- |
| New focused repository under lykn-patch | Operator selected future `lykn-patch/yaml`, checkout `/Users/oubiwann/lab/lykn/yaml`, initial `main`; keeps YAML maintenance independent of compiler and web framework | Not created. Separate bootstrap review and exact creation scope remain; subsequent work verifies actual repo/worktree/branch/status before implementation |
| Existing compiler repo | Actual `lykn-lang/lykn`, release/0.6.x worktree above; possible package subdirectory | Adds library maintenance/release coupling to compiler; not recommended. Requires explicit new source scope and propagation/release design |
| Existing mycelium repo | Actual checked-out web framework with unrelated package surface | Not recommended as a core-format home; would need explicit scope/governance changes and separate library ownership |

The future repository home and accountable owner are selected; the repository
has not been created. No project number, package name or release is assigned.
JSON still precedes YAML in the later library queue. The proposed proof is
bounded research preparation, not opening a production YAML library ahead of
JSON. Source-home/maintainer selection does not accept representative source
style or authorize implementation. [proof-contract.md](proof-contract.md) gives
the separate staged authorization and verification gates.
