# S01 iteration03 — complete the source, interface and observation contracts

Correct candidate 2e94b49f against independent review 1ab4cdb6 (RV-07–13).
Luna 6 High CC; separate Sol 6.1 High review; source remains read-only clean
685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95. Design only, with every QD row
open until independent disposition.

Required-full in order: planning AGENTS.md; this prompt; slice plan/ledger;
both current artifacts; cdc-verification.md's iteration02 review including
RV-07–13 and earlier findings' current dispositions. Required-section:
source guide00 Functions (:204–328), Types & Pattern Matching (:495–597),
Objects & Immutable Updates (:653–690), Modules (:808–869); native
classifier/forms.rs classify_func (:1654–1730) and exportable names
(:222–233); analysis/match_check.rs infer_match_type (:98–151); original
iteration02 for unchanged architecture, homes, constraints and return rules.
Recover truncated/missing content and record actual extents and a concise
contract readback in closing-report.md. Root read those source sections and
testing's behavior/proportionate-proof rules before this assignment.

Keep same-module identity/ABI, actual-qualifier sequencing, representation,
mutation/serialization, defaults and scope decisions. Uncompiled examples
still require correct existing Lykn grammar. Preserve previous returns and
findings in labelled sections/Git, not competing current contracts.

## Source behavior and RV-07/08/12

Use canonical bare zero-case patterns in the primary approved example:
`(Label:MissingField "missing")`, `(Label:NullField "null")`, and
`((Label:Text text) text)`. Accept `(Label:MissingField)` as an equivalent
zero-field PATTERN inside its clause; it never means an expression call.
Expression `(Label:MissingField)` is an invalid call of a zero-case value.
A fielded pattern has exactly its declared fields. A directly resolved
qualified constructor call has exactly its payload arity in checked AND
stripped modes. Detached/dynamic ordinary functions retain JS call arity
and existing payload guards.

Preserve one root constructor owner per match, comparing OwnerRefs/CaseRefs
rather than short names. Nested patterns have their own field owners.
Preserve existing native exhaustiveness/reachability checks; no general new
inference/exhaustiveness algorithm is promised. State actual public/native
obligations, including a shared mixed-root-owner diagnostic.

Use this resolver-safe self-contained TDZ specimen:

```lykn
(type Label (Text :string value))
(func arg-effect
  :args () :returns :string
  :body (console:log "argument") "hello")
(bind answer (use))
(bind Later Label)
(func use
  :args () :returns :any
  :body (Later:Text (arg-effect)))
```

The hoisted use function's body resolves after Later is introduced. Calling
it before Later initializes throws ReferenceError without printing argument.
`(func use (x) ...)` instead treats `(x)` as a body call, not a parameter list.
C2/C5 functions likewise use real keyword args/body syntax or documented
zero-arg shorthand without a spurious empty body expression.

Reconstruction covers all three Label cases: preserve both unit values and
construct Text with `(template text "!")`. Add a complete qualified nested
pattern example with a declared wrapper field :Label and false-guard/fallback
outcome; do not silently use an ownerless prelude constructor.

C4 has separate positive Left-only/Right-only matches, followed by SEPARATE
negative matches per direction: match left against only Right:Text plus
wildcard, then right against only Left:Text plus wildcard. Correct four-line
output is left, right, left-is-not-right, right-is-not-left. A wrongly selected
negative arm yields wrong-owner. This rejects tag-only matching without
mixing owner universes or hiding the wrong-owner arm after a successful arm.

## C5 observation and RV-09

Export a local escaped namespace and observed dynamic value, e.g.
`(bind escaped Label)`, `(bind observed (dynamicCase "hello"))`, and
`(exports escaped observed)`. Exporting imported Label is also legal; do not
invent a source rejection. Keep effectful key computation and match output.

Give complete proposed Lykn observer source OUTSIDE the bundled graph. Read
bundle path/family from Deno:args and `(await (dynamic-import target))` once.
C1–4/6 import and add no output. C5 inspects loaded:escaped/loaded:observed,
constructs a control through escaped:Text, and prints fixed scalar projections:
sorted members exactly MissingField,NullField,Text; namespace frozen; both
unit values frozen; observed tag Text/value hello; own brand descriptor with
symbol token equal to control's brand and enumerable/writable/configurable
false; own tag descriptor Text with enumerable true and writable/configurable
false; own payload descriptor hello with all three flags true. Missing
descriptors must yield a false check, not an observer crash.

Use actual `(obj :key value ...)` syntax if making a projection object, or
console:log scalar lines. Bind intermediates before calling methods; no
method-on-expression trap. Give exact expected output and child invocation.
Compile this Lykn observer once using the accepted common compiler before
the gate, then launch one fresh Deno observer process per cell: 24 runtime
observations per contributor, separately counted from 24 esbuild invocations.
It is not bundled and adds no cell. Include runtime args/read scope and
distinguish compiler warnings from runtime stderr. No handwritten JS helper.

## Concrete interfaces/declarations and RV-10/11

Define required/optional fields, field types, uniqueness/consistency rules and
deterministic errors. Include the current module record with imports entries
`{"specifier":"./label.js","targetModuleId":"pkg/label"}`.
Lookup is current module + exact source specifier -> target module, then
normalized imported export name -> public ADT export; bind OwnerRef under
the actual local alias. Define normalization and reject mismatches/collisions.
No capitalization, guessed paths or ambient process registry.

Include a complete renamed barrel example: producer declares/exports Label;
barrel imports it as Renamed and `(exports Renamed)`; consumer imports Renamed
as lowercase label. Show all three module/import/export records, preserving
the defining OwnerRef while mapping real namespace/token/CASE ABI names at
the barrel. Generated consumer imports use that actual barrel specifier.
Runtime reexports retain identities; DTS aliases reuse the original nominal
type instead of recreating a different private brand-key type.

Public malformed options/interface input throws TypeError synchronously;
source-use failures retain existing compiler diagnostics/errors. Native
validation returns a named typed error through Result/CLI propagation.
State deterministic categories/example messages for unsupported version,
missing current module, unresolved specifier/export/OwnerRef and normalized
collision. Remote export existence remains trusted-caller/graph-adapter
responsibility, not I/O by the synchronous validator.

Keep public TS type name Label alongside runtime value Label (TS has separate
type/value namespaces); do not silently change it to LabelValue. Private
precise case aliases or `Extract<Label,{readonly tag:"Text"}>` type every
unit/case ABI result. Future type-consumer oracles: Text(...).value is string;
MissingField.value rejects; readonly tag/brand assignment rejects; Text
payload assignment succeeds; alias/reexport values have the same nominal type.

## Stop/re-entry and RV-13

Exactly 24 unique cells/six families remain. Missing agreement, pins, fixtures,
ABI, observer or tool identities blocks launch. An expected L1 retention miss
records candidate failure and permits other frozen cells to characterize both
strategies. Unexpected parse/build/tool, behavior/effect/export/descriptor,
metafile/evidence or observer failure stops the affected continuation.
Preserve raw receipts and planned/launched/failed/completed/unrun counts.
Never overwrite a cell or count retries as fresh unique keys. Re-entry states
cause/correction, new hashes and exact affected population; changed experiment
or budget requires its own agreement, not silent extra trials. Ordinary source
regression repairs remain separate from frozen experiment execution.

Production eligibility requires all semantic/effect/export oracles plus C1
zero-unused and C2 selective-code targets. If one strategy meets them, it is
eligible. If both do, CDC compares three byte measures and implementation
costs, recording tradeoffs without invented aggregate statistics. If neither
does, no winner; return the gap for bounded follow-up. No execution now.

## Applied hygiene, sequencing and return

Do not claim host v1 covers new operations. Record the transitive host needs
of reused guard/error paths, not only new branding: native type_checks.rs
uses Number.isNaN, Array.isArray, TypeError and (for :promise) Promise; public
surface-helpers.js uses Number.isNaN, Array.isArray and TypeError; no-match
paths use Error. S03's source-ready host plan must cover lexical hygiene for
operations actually emitted (including user owners/aliases named Number,
Array, TypeError or Error) and explicitly review its finite protected slots.
Do not expand this into a claim that every existing builtin type check is
already coherent across compilers; retain any old keyword/parity differences
for the actual source/API audit. No new runtime library or blanket prototype
freeze is authorized. This is a source-grounded prerequisite, not a claimed
implementation repair.

Root updates the arc to seven increments and preserves superseded six-step
history. CC creates no new slice directories/artifacts. Return a five-row
proposal, applied decision/check table and all RV dispositions in the existing
report, with actual intake/validation extents and labelled prior returns.

Write only the two artifacts and closing-report.md. No source edits or parser,
compile/runtime/bundle/gzip probes/acquisition. All research/helper logic must
be Lykn: no Python execution/parity exception, Ruby, Fennel, handwritten
JS/Node helper, substitute scripting, new Node/npm input, generated-output
repair, network, merge/push/publication. Native read-only commands/Git and
simple file lifecycle only. Use explicit git commit --only for those three
files with both contiguous AGENTS trailers; return hash and Git ownership.
