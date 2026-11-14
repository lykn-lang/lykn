---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice04-discard-aware-declarations
status: active
version: "1.1"
depends-on: [slice02-native-binding-discards, slice03-public-binding-discards]
---

# Discard-aware TypeScript declarations

Current assignment2026-11-14: correction01 `cc-prompt-iteration01.md` addresses
the independent918 source-first HOLD: missing positive inline/named BindGroup
declaration consumers and recursive parameter-shape/default consumers. No
emitter defect was demonstrated; independent aggregate gates stayed unrun.
Only the existing CLI integration test changes; same four-path complete
delivery/eight DT rows/M670 population remain. Candidate918, initial prompt,
failed authoring/gate conditions and scope boundaries remain preserved.
Refinement1/5, separately readiness-approved and issued with the committed
open set; source/build transfers exclusively to Luna CC on dispatch.

2026-11-14 operator authorizes releasec60 fast-forward/independent validation,
then S04 if green, Luna6 High CC and Sol6.1 High CDC, Autonomous Mode.
[Release integration is independently accepted](../slice03-public-binding-discards/artifacts/release-integration-c60dea62.md#independent-release-verdict--accept--2026-11-14).
The useful result is correct native-generated declarations for the existing
Func/Bind/BindGroup/Type declaration routes, consumed by real TypeScript clients
and delivered through file compilation and package build. JavaScript runtime
discard semantics remain the accepted S02/S03 input.

## Authority and preflight

- Task source: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  branch codex/qualified-adt-core, cleanc60dea62d126bb07557a7f4f7183662dec3f6a58,
  tree9c247edcf632ef2e038078a2833e727db949730d.
- Release: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, samec60/tree9c,
  independently validated; no subsequent release mutation is authorized.
- Planning: separate orphan `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`.
  Root owns plans/index/status and serial task-source/build handoffs.
- Root coordinator backend is not independently reported. Fresh S04 CC context
  `/root/arc05_s04_cc` uses explicitly selected OpenAI gpt-6-luna/high; separate reviewer uses
  gpt-6.1-sol/high, actual reviewer context `/root/arc05_s04_cdc`.
  Fresh contexts bound the declaration packet instead of
  carrying the long S03 correction context; prior evidence stays canonical.
- Endpoint: implemented, independently accepted S04 on the task branch with
  retrospective/BS-04/parent routing. No S05 opening, merge/push/publication,
  licence/dependency decision or qualified ADT/library execution.
- Root owns source/build during preparation; CC receives it only after separate
  readiness PASS and committed open set. No concurrent product mutation/build.
  New evidence uses artifacts/cc and artifacts/cdc here only where needed for
  reading intake, semantic red/failures and complete final gate proof.
- Five refinement passes maximum; correction01 spends1/5 on dispatch; the
  initial assignment spent0 refinements.
  Fix obvious scoped issues autonomously; genuine unresolved contract/evidence
  gaps return to root before dependent work. No historical budget resets.

## Source-grounded contract and recipe

Atc60, native `emitter/dts.rs` consumes the same immutable AnalyzedUnit as JS
emission. emit_func_args currently prints every Simple parameter's source name,
ignores default/rest flags and chooses arg{i} for destructured shapes. Repeated
`_` therefore duplicates TypeScript parameter names; generated labels can also
collide with an ordinary arg0. Module emission treats inline Bind `_` as an
exported const, omits inline BindGroups and ignores destructured binding names.
CLI compile_source_with_dts and dist compile_lykn_sources already use this module
emitter and write nonempty sidecars; no alternate pipeline is needed.

### A. Parameter labels are declaration-local

Binding: retain every positional type and argument slot. `_` contributes no
source binding but still consumes a typed argument. Ordinary `_value` and all
named parameters retain their existing normalized spelling. Schema/object
property names are data, not discard parameter labels.

Recommended: in emit_func_args pre-reserve the normalized names of all Simple
non-discard parameters. For each Simple `_` or anonymous destructured argument
allocate arg{i}, suffixing `_1`, `_2`, etc until unused; insert each result.
Use one local set per clause, deterministic source order, no global allocator,
private atom protocol, AST mutation or copied AnalyzedUnit. Existing source-name
normalization remains; general collisions between distinct named source
spellings belong to BS-07/08. Low-level emit_bind_dts/type conversion signatures
and literal-rendering roles stay intact; discard filtering belongs at module
binding projection, not a global underscore/string rewrite.

### B. Describe the supported input positions honestly

Binding: for top-level Simple default parameters, a trailing optional suffix
uses `name?: T`; a default before a later required argument uses
`name: T | undefined`. Rest is `...name: T[]`, with T the per-element annotation.
Later rest does not make an earlier default required. Destructured parameters
remain required arguments. Preserve overloads/return annotations/contracts and
missing-return warnings. S09's unsupported multi-clause simple-default/rest
diagnostic remains unchanged; this is not new overload admission.

Array tuple types retain typed discard positions and bare skip positions.
Typed defaults and bare skips may be optional only in the suffix before an
optional/rest tail; earlier default slots include undefined before a later
required element. Required typed/nested elements stay required; rest stays last.
For optional tuple defaults and optional object default properties, explicitly
include undefined so TypeScript exactOptionalPropertyTypes also admits the
same explicit-undefined input as runtime defaults. Object `_` and alias keys
retain their data names and nested types. Bare skip has type unknown, not an
invented named binding. Existing primitive/user types keep their conversions.

Recommended linear approach: find the last required index with rposition,
then render forward. For function args, required means a destructured shape or
Simple with no default and not rest. For tuple elements it means nested or
Typed without default; Skip and Rest are not required positions. Avoid a second
grammar/parser or per-element repeated full-suffix scans.

### C. Export real source bindings

Use existing binding_names_in_pattern(pattern, BindingKind::Bind), as runtime
direct_bind_export_names already does. Reuse one private declaration renderer
for Bind and each BindGroup pair, inline Export and named Exports selection.
Scalar typed/literal inference remains unchanged for meaningful names.
Untyped destructured leaves are conservatively unknown, never the initializer's
whole-object annotation/literal type assigned to every leaf. Filter selection
against ORIGINAL source names before normalization; emit in source/pair order.
Never emit `_`, generated private locals or property keys as value exports.

A module with only handled empty inline bind exports needs a real sidecar
`export {};` instead of an absent sidecar or a phantom `_`. This also updates
an old nonempty sidecar when compiling the same output path to discard-only
source. Preserve local Type declarations by adding the module marker if needed.
Conservatively recognize this case only when at least one explicit export form
exists AND every explicit export form is an inline Bind/BindGroup projecting
zero names. Do not infer empty exports from out.is_empty(), or fabricate an empty
interface for an unsupported export form. No export syntax is widened: `(exports)`
and `(exports _)` remain their existing errors; actual empty inline bind groups
and discard-only inline exports use their admitted grammar.

The conservative census must include raw export forms: classify_export atc60
stores default/re-export forms as KernelPassthrough, and classify_kernel_escape
strips an admitted kernel:export to raw head export. Treat a top-level
KernelPassthrough raw list with first.as_form_head()==Some("export") as an
unsupported explicit export that vetoes the empty-module marker. Preserve bound
call heads; do not scan strings or arbitrary descendants. Test default/re-export
and raw/kernel variants both alone and beside a handled empty bind export, so
ignoring passthrough exports cannot turn an unknown interface into export{}.

Pre-existing declaration gaps for generator/class/default/re-export/imported
surfaces have no new implementation promise here; preserve their current
behavior, disclose exact boundaries to Arc06 LI-04, and do not label those APIs
complete. This slice closes BS-04's discard-specific declaration contract,
not the eventual whole-language API audit. No public/browser JS DTS API exists
in this source census; do not invent one or modify the public compiler.

### D. Preserve roles and caller paths

Existing Type/constructor `_` fields and object-pattern `_` properties remain
required typed data where required; optional defaults retain their source key.
Bare array holes differ from typed discarded entries. Keep foreign `_`, named
`_value`, exact source-only namespaces, guards/effects, schema errors and
checked/stripped JS behavior. No runtime emission/AST/resolver/classifier change.
CLI file output and package emitDts:true use the same production module emitter;
an empty source with no exports still produces no declaration. No CLI/ABI change.

## Concrete proof and permitted paths

Only FOUR product files may change:

1. crates/lykn-lang/src/emitter/dts.rs — implementation plus meaningful inline tests.
2. crates/lykn-cli/tests/discard_declarations.rs — new real integration tests.
3. docs/guides/00-lykn-surface-forms.md — immediate discard/export declaration teaching.
4. docs/guides/06-functions-closures.md — parameter/declaration caller contract.

No dependencies/locks, JS/embedded/M6 selector/count, schema/runtime compiler,
CLI production plumbing, source-name algorithm or other test changes.

Test mapping (examples below are proposed specimens, not claimed runs):

- Repeated typed `_` plus named `_value`; destructured slot0 with later named
  arg0 and discarded slot2 with later named arg2; reserve suffix candidates too.
  Actual generated declarations must type-check; calls require the same types
  and positions. Check determinism/fresh clause and fresh successful unit.
- Single and multi fixed overloads; ordinary/default-before-required/trailing-
  default/rest and default-before-rest discarded parameters. Include opposing
  TS calls (correct/incorrect types, missing required argument) and explicit
  undefined. Tuple default/skip before required and trailing/rest controls,
  nested object/array and object/schema `_` data preservation. Observe actual
  generated JS/runtime outputs99 versus argument7 and `_value`7, not only text.
- Inline scalar/group/pattern exports: discard-only, valid empty group, mixed
  visible names, typed and inferred names; preferred named Exports over a
  destructured binding. Exact runtime namespace and declaration type namespace
  agree. Property keys/private compiler locals must not leak. Update a prior
  nonempty sidecar through a discard-only compile at the same output path.
  For a zero-name GROUP use `(export (bind (array) #a() (object) {}))`;
  this still has two valid name/value pairs, not an invented zero-pair `(bind)`.
  Empty non-module source remains no sidecar. Keep exports-empty/wildcard errors
  and unsupported raw/default/re-export exclusions, alone and mixed with an
  empty handled bind export.
- Type Sample with constructor Sample carrying field `_`: declaration property
  and constructor input stay number; real constructor output field7 and TypeError
  negative remain. Preserve no-returns warning and ordinary greet example.
- Native public emit_dts_module is tested from an actual successful AnalyzedUnit;
  low-level shape tests supplement that caller. CLI normal/strip sidecars match,
  and actual `lykn build` package emitDts:true sidecars use this same path.
- Real TypeScript consumers use local generated .d.ts via type-only imports,
  not handwritten replacement declarations or inference from JS. Use Deno2.9.6
  `check --no-remote --no-npm --cached-only --no-lock --config <owned-check.json>`;
  config explicitly enables strict and exactOptionalPropertyTypes, with
  skipLibCheck:false so declaration-file errors are checked explicitly. No remote
  imports or npm dependencies are needed. Check positive calls plus @ts-expect-error
  bad argument/arity/missing `_` exports, and one genuinely failing unguarded
  missing-property or argument control with its real TS diagnostic. Tests must
  not pass from SyntaxError excerpts, missing Deno or skipped type-checking.

Before production edits retain one valid semantic red from the actual old
generated declaration (e.g. duplicate `_` parameters rejected by Deno check).
Use existing Rust tempfile/process patterns; static TS and runtime fixtures are
product tests, not a new helper language/tool. Runtime sources/consumers may be
Lykn compiled through the actual CLI. Do not invent replay/validation machinery.

Gates: focused `cargo test -p lykn-lang emitter::dts::tests -- --nocapture` and
`cargo test -p lykn-cli --test discard_declarations -- --nocapture`, after
make fresh-artifacts where staged consumers are used. Then one final make check
(docs once), actual existing M670/all14 receipts, exact four-path source commit,
final-HEAD citations and fresh81920 size gate. Derive all new counts from raw
output. Shared Deno cache is warm; per-contributor fresh XDG/tmp/npm/M6 roots
use `/private/tmp/lykn-arc05-s04-{cc,cdc}`. Preserve failed conditions, complete
streams and existing skip/warning/download/tracing limits. No optional docs run.

## Guidance application, readiness and closing

2026-11-14 authoring checkpoint: the ordinary Source case with first
destructured parameter followed by plain typed named parameters hits inherited
CLI method-call prevalidation before DTS. CC reproduced this on immutable
releasec60; root/separate Sol traced the role-blind container walk. The finding
is [D-2611-MPVR](../../../backlog/discoveries.md#d-2611-mpvr--native-method-call-validation-mistakes-typed-parameter-structure-for-an-expression),
routed to unopened Arc02 maintenance and later LI-04 impact accounting.
No validator is changed or Source grammar acceptance claimed by S04. Admitted
later named DEFAULT Simple parameters exercise the same pre-reservation name
producer, and required named BEFORE destructuring supplies the opposing actual
CLI/TS case. The required-after/destructure proof is a low-level ParamShape
test, not a successful analyzed-unit Source witness. Separate Sol confirms
this composition preserves DT-01/02; the unsupported ordinary Source form stays
explicitly open. Initial assignment/specimens were recommendations, not a
promise to repair its independent prevalidation prerequisite.

Rust AP-09 AVOID: no user-reachable panic path introduced by declaration data;
test expect with explanation is appropriate. AP-12/AP-13 AVOID: borrow the
successful unit, reuse existing projections, allocate only actual strings/set
needed for deterministic labels, avoid full-tree clones or ceremonial collects.
Testing Proportionate Proof selects existing gates plus actual TS/CLI/package
consumers where string snapshots cannot prove the contract. S03's retrospective
requires producer-specific proof and real error classes, applied above.

Root inspected the actual emitter/callers/typed AST, binding projection and
classifier default/rest/export grammar before drafting. Deno check flags were
verified through installed2.9.6 help. Recipe resolves allocation, optionality,
empty-module recognition, ownership and preserved low-level/data roles; no
separate investigation is commissioned. Separate readiness review precedes issue.

All eight DT rows must receive separate Sol disposition. CC supplies row walk,
artifact inventory and bubble-up; root completes cdc-retrospective and BS-04,
Arc04/Arc06/Project07 routing. All later source-name/signature/qualified/module/
library/research/reader/book/human/licence and release gates keep their owners.
Initial cc-prompt.md is a draft until readiness/commit/dispatch; preserve it once
issued. Each refinement uses a new cc-prompt-iterationNN.md and retained findings.

## Assignment history

- 2026-11-14 correction01 `cc-prompt-iteration01.md`: issued test-only
  refinement1/5 after independent918 HOLD R01/02. Positive typed/inferred/destructured
  inline/named groups and recursive Object→Array→Object input/default/rest
  cases extend the existing four CLI groups. No production or validator change;
  separate Sol correction01 readiness PASS precedes committed issue/dispatch.
  The nested alias property-key/local-binding specimen error was corrected
  before issue; caller-owned length observations preserve the intended oracle.
  All8 DT/BS-04 remain open. Exclusive task source/build transfers to Luna CC
  on dispatch; planning Git/index/status remain root-owned.

- 2026-11-14 initial cc-prompt.md: source-ready from independently integratedc60.
  Separate Sol [readiness PASS](cdc-verification.md#source-readiness-verdict--pass--2026-11-14)
  after pre-issue raw KernelPassthrough export-veto correction, concrete valid
  zero-name group and explicit pinned checker settings. Root reconciled source
  definitions/recipe/tests/manifest; same four paths/eight rows. Issued after
  committed open set; task source/build transfers to fresh Luna CC on dispatch.
  No implementation acceptance or spent refinement is inferred from readiness.
  Returned for independent review at918f2e9c4237770fc7b2e0e950d726e735e95198,
  tree37b1cd6e7a457caf94933a35cdac54335c7afb66, cleantask/nojobs, exact4paths.
  CC attests native32/CLI4, fullRust1786 across40harnessrows/product1578/67/
  docs482, actual M670/all14, final64/601 citations and48689/81920 gzip.
  Source red/invalid clients/interim fixture/code/gate failures remain explicit,
  including missing interim test snapshots. Initial0refinements: these are
  local authoring attempts, not a new review refinement. Root corrected the
  doer report location to canonical closing-report.md after clean handoff;
  both location mistakes and root's relative-path prompt ambiguity remain
  retrospective inputs. All8 DT rows await separate Sol source/gate review.
  Subsequent independent918 verdict HOLD R01/02, no aggregate gates executed;
  initial assignment superseded by correction01, with all original records intact.

## Version history

- 2026-11-14 v1.1: Preserve independent918 HOLD and prepare consolidated
  test-only correction01 for the original grouped-export/recursive-input proof
  obligations. Same scope/rows, no source defect asserted or gate waived.

- 2026-11-14 v1.0: Prepare operator-authorized S04 after independently green
  c60 release integration, retaining the bounded discard declaration contract.
