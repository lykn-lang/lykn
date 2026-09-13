# Slice05 — YAML value behavior through Lykn

Status: **Open; ready for CC.** Expedited Mode. No full-value execution yet.

## Assigned capability and inputs

Execute the complete value portion of [FM01](../slice01-baseline-and-protocol/artifacts/fixture-matrix.md):
Y-01–12 and Y-15. Establish what the pinned value API accepts, rejects, coerces,
loses or preserves during reading, parsing, editing, serialization and writing.
Keep original YAML bytes beside represented values; successful value rewriting
does not imply document preservation. This is research, not a library API or
dependency-adoption decision.

Read [Slice03 CDC](../slice03-yaml-preflight/cdc-verification.md), its
[baseline/replay](../slice03-yaml-preflight/artifacts/baseline-and-protocol.md),
[frozen matrix](../slice03-yaml-preflight/artifacts/inputs.json),
[authoring record](../slice03-yaml-preflight/artifacts/authoring-and-findings.md),
RP01/FM01/AE01 and the project/arc plans and ledgers. Slice03's 16 YAML
sentinels were harness preparation; every assigned variant is executed here.

| Families | Frozen variants | Required work |
| --- | --- | --- |
| Y-01 | 1 | Actual file read → parse → n=2 edit → serialize → safe replacement → reread |
| Y-02 | 110 | Eleven scalars, plain/quoted, all five schema strings |
| Y-03 | 50 | Ten explicit tags across five schemas, including unsupported/unstable cases |
| Y-04 | 8 | Duplicate allow/reject and original non-string key identity versus represented coercion/collision |
| Y-05/Y-06 | 3 | Shared alias edit, self-cycle, unresolved alias; serialization and bounded graph evidence |
| Y-07/Y-08 | 11 | Five merge schemas and six single/multiple/empty/invalid stream cases |
| Y-09 | 4 | Diagnostics/warnings and actual existing-destination preservation on rejected parse |
| Y-10/Y-11 | 8 | No-op/edit and block/directive/BOM/CRLF/no-final-LF presentation evidence |
| Y-12 | 52 | Numeric lexemes, precision, missing/null/falsy/own undefined and exact dynamic keys |
| Y-15 | 12 | Six constructed runtime kinds with skipInvalid false/true |
| Total | 259 | Two fresh attempts each: 518 normal matrix attempts |

Y-13/Y-16's 62 resource/file-fault variants remain Slice06. Y-14's 28 document
variants remain Slice07 after Slice04's compatible-route disposition. Preserve
all 349 original IDs in the crosswalk; no silent exclusion or reassignment.
Do not execute large resource recipes or the gated @eemeli candidate here.

## Immutable execution condition

Use source `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`, tree
`1c91b11c6ebfc7305ca4bc3fca4a5148eb2fdaf5`. Inspect registered worktrees/status;
do not reset or build over the shared release binary. Export the immutable
commit to a fresh scratch directory and `cargo build --release --locked` there.
Record build settings, versions and executable SHA-256; the reproduced baseline
is `78aac90c4b4d6c644ac376e99ce91f88cdae32477aff476980912e68eba0c1bb`.
Investigate drift before runtime comparison. Cargo is authorized compiler-build
infrastructure, not a substitute research language.

Deno: `/opt/homebrew/bin/deno` 2.7.7, SHA-256
`103ea70463213b1a8ea7b46852a34612f4e0afcc1ff09d1656d185ed215772d4`.
Candidate: exact `jsr:@std/yaml@1.2.0`; preserve the real Slice03 lock and
package integrity. Resolve the final emitted probe with fresh cache/info,
`--no-npm` and frozen lock, then inspect the actual graph and all errors before
execution. Cache/info exit zero alone did not establish resolution during CDC.
Use cached-only/frozen execution for package children. Package transport and
metadata inspection are authorized infrastructure; all programs run via Lykn.

Use a new disposable trial with separate input/output/home/tmp/cache roots.
Clear inherited environment, use PATH `/opt/homebrew/bin:/usr/bin:/bin`, scratch
HOME/TMPDIR/DENO_DIR, DENO_NO_UPDATE_CHECK=1, NO_COLOR=1, null stdin and no-prompt.
Record exact read/write/run grants. Keep the supervisor's compiler-path.txt
parameter so replay never requires changing the retained program bytes.
Per-case grants never inherit supervisor grants. No broad -A, network or npm
grant. No repository dependency installation, publication, source or book edit.

Stable package exports are YamlSyntaxError, parse, parseAll and stringify.
Schemas are option strings failsafe/json/core/default/extended; parseAll returns
an array. Do not invent public schema objects, Document or a separate toJS API.
No custom type construction or unstable import is part of this packet. Retain
the package's unstable-binary caveat when classifying !!binary outcomes.

## Freeze and implementation sequence

1. Copy/adapt Slice03 cases, supervisor and audit into this slice's artifacts.
   Keep original Slice03 artifacts immutable. Use Lykn to select the 259 assigned
   IDs and freeze a Slice05 execution manifest before observing the matrix.
   Preserve YP-M01 IDs, literal bytes/hash, schema/option combinations, repeats
   and original invariant/unknown questions. Document every operational addition
   (handlers, phase, file fixtures, emitted stages) and its reason in the crosswalk.
   Do not overwrite original expected questions with observed outcomes.
2. Fill the deliberately missing handlers. Make dispatch reject unknown IDs,
   operations and unsupported schema names explicitly; an unknown handler must
   never fall through to generic parse and report completion. Validate any ID/op
   pairing against the frozen manifest. Define exact runtime construction before
   execution: Date at 2026-09-12T00:00:00.000Z; Map with distinct string and numeric
   keys; Set with distinct number/string values; top-level undefined; a function
   returning 1; and an object whose own self property points to itself. Freeze
   actual constructor bytes and entry values, including enumeration order. The
   Y-12 own-undefined case has an own enumerable x=undefined beside the absent-x
   control. Preserve these originals beside any serializer output.
3. Check/lint/compile every authored Lykn program and inspect emitted code before
   interpreting outcomes. Account for NZRO/JSCF and retain UNUS warnings. Fix only
   Lykn source. Record references actually read, failed sources/outputs, edits and
   attribution under AE01; neither compiler exit zero nor a lint pass is a runtime
   oracle. Source/emitted hashes are pinned for the frozen execution condition.
4. Revalidate actual permission denial/scoped success and a separately labeled
   argv recorder. Confirm host ps observation before any loop. Replay wall/output/
   RSS controls and inspector/unknown-dispatch controls against the new harness
   before the 518 attempts. Keep these controls separately counted. Use authorized
   host observation if the sandbox denies it; do not bypass or weaken the observer.
5. Execute each frozen variant twice in fresh per-attempt directories using the
   external supervisor. Keep 10s wall, 16MiB combined output and 512MiB sampled
   process-tree RSS thresholds. Keep pipe draining, capped retention, termination
   reasons and survivor checks. Stop the affected family on an unexpected cap or
   harness failure; retain all not-run IDs and correct/replay in new directories.
   A package rejection is a characterized result only when the declared stage,
   structured error and file invariants agree. It is not an infrastructure pass.
6. Audit all attempts with Lykn. Require unique complete IDs/attempts, exact
   source/emitted/config/lock identity, errors/warnings/status attribution,
   byte/hash agreement, file state invariants and repeat comparisons. Preserve
   duplicate warning events in sequence; a Map keyed only by label loses them.
   Distinguish expected domain loss from a failing harness assertion. Use original
   bytes and independently specified invariants as checks, not only parse/stringify
   against itself. Unexpected observations remain evidence, with explanations or
   explicitly open questions. Produce full replay instructions and results.

## Required semantic, graph and file observations

Y-01 must read the materialized input and parse those bytes first. Checking a
file after parsing an argv literal is insufficient. Serialize fully before
opening a new sibling temp file, write all bytes, sync/close, rename and reread.
The source is unchanged; compare all non-edited values and actual destination
bytes. Record the no-op rewrite separately from the intended n edit. This is
bounded replacement behavior; concurrency and crash durability remain Slice04.

For Y-09, materialize an existing destination containing ORIGINAL plus LF and
run the same actual read/parse/replace path. Any rejected parse leaves both source
and destination unchanged, with no leftover temp. Capture error class, message,
stage, structured positions and every warning. Do not invent rejection for the
duplicate-anchor fixture if the package accepts it; record the accepted value
and resulting file disposition with its own checks.

For Y-05, preserve original/no-op bytes before alias mutation, test a===b and
b.x after a.x=9, then serialize and reparse the edited graph. For Y-06, bounded
inspection must terminate; record cycle serialization success or attributable
rejection and reparse identity where available. No fabricated edited output
when no meaningful edit is defined. For Y-07, compare merge resolution/override
values and merge/anchor presentation. For Y-08, preserve all document ordering
and empty values; an invalid later document must not become false all-success.

For Y-02–04/Y-12, record scalar spelling and original YAML key domain beside
represented kind/value/presence. Use exact original numeric tokens rather than
reconstructing an integer from an already rounded Number. Distinguish -0, NaN,
Infinity, null, absent, own undefined, false, zero and empty string. Edit exact
dynamic keys without keyword camel-casing or prototype mutation. Compare own
key lists and prototype before/after. For Y-15, explicitly classify accepted,
rejected, coerced or dropped; skipInvalid does not establish fidelity.

Y-10/Y-11 need original/no-op/edited bytes as applicable, hashes, first difference
and complete positional difference ranges with the method stated. Separate
semantic scalar newlines from comments, quotes, layout, directive/BOM, line-ending
and final-newline loss. Reparse equality never proves original document fidelity.

Reuse the tagged graph inspector's bounded reporting. Record truncation or
bound markers as incomplete observations, never whole-value equality. Enumeration
and encoding allocate before some guards; this small matrix does not establish
hard allocation safety. No unbounded alias expansion or cycle-blind JSON transport.
Separate parser/serializer errors from inspector, file and supervisor failures.

## Artifacts and close

All durable output belongs in this slice's artifacts directory:

```text
baseline-and-protocol.md
case-manifest.md
inputs.json
project.json
deno.lock
dependency-graph.json
cases.lykn
supervisor.lykn
audit.lykn
raw-transcript.txt
results.md
byte-audit.md
authoring-observations.md
findings.md
```

The transcript contains actual commands, environment/scopes, source revisions
and failed attempts, generated output, process/exit/stream records and file
states. Exact source/API locators belong in baseline/authoring evidence. Register
new confirmed cross-cutting findings using existing permanent IDs where relevant;
a proposed destination is not routed until that destination exists and contains
the finding. Keep original compiler and guide/book findings open unless separately
corrected and verified. Full ADT and operator aesthetic evaluation remains Arc02.

Close only when all seven ledger criteria reproduce independently. After at most
five failed correction iterations, explicitly re-slice with every owed ID retained;
do not spend all context on an expanding harness or close on partial counts. Normal
matrix size is 518 attempts; controls and any corrections have separate counts and
provenance. If the task no longer fits one context plus correction headroom, amend
the arc before execution rather than silently reducing this contract.

CC commits exact paths and reports proposed-done. CDC verifies before closing.
After verified close, open Slice06 YAML resources/files using these actual findings.
Slice04 still precedes gated Slice07. No whole-YAML, arc or project closure here.

## Version History

- 2026-09-12 v1.0: Opened after Slice03 CDC reproduced the frozen 349-variant
  preparation. Assigned all 259 value variants, two attempts each, with explicit
  full file/serialization and evidence-audit work left by sentinels. Preserved
  resource/file-fault and gated document owners and the immutable build condition.
