# S04 independent CDC verification

## Source-readiness verdict — PASS — 2026-11-14

Separate reviewer context `/root/arc05_s04_cdc`, selected OpenAI
gpt-6.1-sol/high, reviewed the **unissued** S04 open set against task source
`codex/qualified-adt-core` at
`c60dea62d126bb07557a7f4f7183662dec3f6a58`, tree
`9c247edcf632ef2e038078a2833e727db949730d`. Read-only Git checks before and
after review show that task checkout clean at that pin. Root retains source,
build, planning Git/index and status ownership. This record is the reviewer's
only write: no product edit, Git mutation, build or test execution occurred.

The corrected draft is source-ready for the authorized four product paths and
eight DT criteria. This verdict permits committed issuance under the existing
authority; it does not accept implementation, reproduce the release gates,
close any DT/BS row or authorize S05, release integration or external action.

### Material correction resolved before issue

The initial marker recipe needed an explicit source representation boundary.
At this pin, `classifier/forms.rs:1080–1114` classifies default and re-export
forms as `SurfaceForm::KernelPassthrough`, rather than `SurfaceForm::Export`.
`classify_kernel_escape` at `46–73` strips an admitted `kernel:export` to a raw
`export` head. An implementation counting only `Export`/`Exports` could thus
mistake a handled empty bind export beside an unsupported default/re-export
for an empty interface.

Root revised plan C, the prompt spine, required reading and controls before
issue. I reread the complete revised open set. It now vetoes the empty marker
for a top-level passthrough raw list whose first `as_form_head()` is `export`,
preserves bound-call identity and tests unsupported exports alone and mixed
with handled empty binds. No descendant/string scan or unsupported API
implementation is commissioned. This resolves the material readiness finding.

The draft also now names `FuncClause`/`Constructor` in intake, gives a valid
two-pair zero-name grouped-bind specimen, and explicitly sets
`skipLibCheck:false` in the owned checker configuration. These clarifications
retain the four-file/eight-row boundary.

### Why the remaining recipe is coherent

- The declaration-local set reserves normalized meaningful Simple names before
  allocating synthetic labels in source order. It handles later named `arg0`,
  `arg2` and suffix candidates without changing runtime names, AST ownership or
  the existing general source-name policy. Every argument slot/type survives.
- Existing `TypedParam` flags and destructured element variants support the
  specified default/rest policy directly. Last-required-index rendering keeps
  a default before a required argument positional, allows the trailing suffix,
  and treats a rest tail separately. Required destructured arguments remain
  required. Explicit undefined for optional object/tuple defaults matches the
  strict/exactOptionalPropertyTypes consumer contract. Fixed overloads and the
  existing rejected simple multi-clause default/rest boundary remain intact.
- `binding_names_in_pattern(..., BindingKind::Bind)` supplies the actual source
  projection already used by native inline runtime exports. Shared private
  rendering can serve inline/named scalar/group/pattern entrances without
  assigning a whole initializer type to each destructured leaf. Selection before
  normalization and source/pair order preserve the source namespace contract.
- The handled-all-empty marker is deliberately narrower than output emptiness.
  It replaces a prior sidecar through the existing CLI write path and can follow
  retained local type declarations, while unsupported-only or mixed unsupported
  exports and ordinary empty non-module source retain their existing behavior.
- `emit_dts_module` takes a borrowed successful `AnalyzedUnit`; reader/resolver/
  classifier/analyze provide a real test route without exposing its registry or
  creating an alternate API. File compilation and package `emitDts:true` already
  call this emitter and write nonempty results. Existing TempDir/Command and
  package fixtures supply viable integration setup within the allowed test file.
- Real generated local DTS consumers, opposing argument/arity/export controls,
  one unguarded TS negative, exact runtime namespaces, 99-versus-7 witnesses and
  schema TypeError controls discriminate the promised behavior. String tests
  remain supplementary. The valid old-output semantic red is still required
  before production edits; no such execution is claimed by this review.

The generator/class/default/re-export/imported declaration omissions are
pre-existing unsupported native DTS routes, rather than a new loss of an
implemented interface. The bounded Func/Bind/BindGroup/Type repair is consistent
with BS-04's discard declaration carryover provided the close explicitly routes
those omissions to open Arc06 LI-04. This is not whole-language DTS/API parity.
Schema/property `_`, low-level literal-rendering helpers and runtime/compiler
behavior keep their separate roles. Later naming/S09/qualified/module/library/
research/reader/book/human/licence and release gates retain their owners.

### Actual reading and inspection extents

All source ranges below are from the task worktree at the pinned commit, not
from planning. Reads are text inspection; searches, Git facts and external
version checks are distinct from full-document reading. Clipped aggregate
outputs were recovered with bounded reads for the required relevant extents.

| Input | Loaded extent |
| --- | --- |
| S04 open set | Complete initial and complete revised `slice-plan.md`, `ledger.md`, `cc-prompt.md`, including all eight DT rows |
| Repository instructions | Complete task `AGENTS.md` |
| Native declarations | Complete `emitter/dts.rs:1–660`, including existing inline tests |
| Typed AST | `ast/surface.rs:1–115,125–190,248–307,420–480`: parameter variants/dependencies, clauses, constructors, binding/type/export/passthrough forms |
| Binding projection | `binding.rs:135–165,900–1005,1100–1255`: BindingKind, complete projection helper and its recursive grammar dependency |
| Native runtime export projection | `emitter/forms.rs:515–568,3210–3275`, including complete `direct_bind_export_names` |
| Classifier | `classifier/forms.rs:1–115,870–1167,1170–1300,1337–1438,2781–3335`: escape/strict/lax/export dispatch, exports errors, grouped-bind admission, complete typed/default/rest/object/array parsers |
| Classifier entry points | `classifier/mod.rs:1–180` through EOF |
| Head identity | `ast/sexpr.rs:380–417`, complete `as_form_head` contract/body |
| File compile/DTS | `compile.rs:214–290`, complete `compile_source_with_dts`; `main.rs:465–550`, output sidecar write branch |
| Package compile/DTS | `dist.rs:182–279`, complete `compile_lykn_sources` |
| Existing test patterns | Complete `compile_validation_parity.rs`; `emission_failures.rs:1–200`, including complete package fixture/helper prerequisites |
| Lykn reference | `skills/lykn/SKILL.md:36–84,172–230`: complete Before You Do Anything and Bindings & Mutation |
| Immediate guide context | Guide00 `15–190,498–524,811–866,1380–1429`: bind/type/export and data/discard boundaries; guide06 `1–67,1040–1125`: complete ID-01 and ID-30 |
| Prior accepted input | S03 release integration independent intake/ACCEPT/RI disposition sections `133–EOF`; complete S03 `cdc-retrospective.md` |
| Parent scope | Arc05 `arc-plan.md:75–165` and BS-04 row; complete Arc06 ledger and open LI-04 ownership |
| Existing gate recipes | Makefile `200–237,350–380`; named focused/full/final gates reconciled with the draft, no command executed |
| Collaboration guidance | Installed collaboration-framework entrypoint; complete project-management guides README; complete implementation-prompt-authoring guide; methodology role/shared/two-contributor `26–154` and Autonomous authorization/model/preflight `326–410` sections |
| Testing/verification guidance | Installed testing entrypoint, complete Testing Discipline, validation Gate Selection/Proportionate Proof/substrate/minimum gate sections `1–126`; independent-verification `1–140`, including correction retention |
| Rust guidance | Installed Rust entrypoint and complete AP-09/AP-12/AP-13 sections; applied no user-reachable panic, borrowed unit, existing projection and no ceremonial collect rules |

The checker-version concern was resolved from primary **v2.9.6** source, not
assumed from current-main documentation: [Deno's pinned configuration](https://github.com/denoland/deno/blob/v2.9.6/libs/resolver/deno_json.rs#L296-L334)
defaults `skipLibCheck` to false and permits an explicit setting; its getter
also defaults false at `797–812`. The pinned
[checker entry point](https://github.com/denoland/deno/blob/v2.9.6/cli/tsc/99_main_compiler.js#L92-L164)
collects semantic diagnostics. A newer native-tsgo caveat was investigated and
not promoted to a fact about this pin. These source checks establish a viable
method, not a local checker run or a produced semantic red.

### Readiness disposition

Source-grounded, design-complete, guideline-applied, executable, falsifiable and
coherent after the pre-issue correction above. No material readiness issue
remains. The initial assignment is still unissued at this review cutoff and
has spent zero implementation refinements. DT-01–08 and BS-04 stay open for
CC evidence and separate implementation verification; root alone owns their
eventual status/retrospective/bubble-up updates.

## Boundary applicability check — 2026-11-14

At root's request, performed a narrow read-only check while CC still owns the
uncommitted four-path task delta above c60. No test/build, product edit, Git/index
or ledger mutation was performed; this appendix is the sole additional write.
This is neither an implementation acceptance nor a final-gate review.

The retained `artifacts/cc/classifier-boundary/release-repro.lykn`, exact
`release-command.txt` and separate stdout/stderr/status show the release CLI
rejecting a first destructured argument followed by required named arguments:
exit1, method-on-parenthesized-expression diagnostic at the parameter list.
Unchanged `classifier/forms.rs:98–116,375–390` explains the failure: the generic
recursive validator treats that list as a call. This is an inherited source
admission defect, not malformed fixture syntax or new intended behavior.

Current `discard_declarations.rs:183–190,262–270,328–337` instead uses a first
destructured argument followed by named defaults `arg0`/`arg0_1`, plus required
named `arg1` before a destructured argument. The retained
`focused/final05/declaration-consumer.generated.d.ts` contains `arg0_2` and
`arg1_1`, and the matching compile/check command/status receipts report success.
These are inspected CC observations, not independently executed checks.

This composition preserves the DT-01 collision obligation: both later defaults
are still `ParamShape::Simple` meaningful names, and the current declaration
reservation at `dts.rs:116–122` reads names independently of optionality flags.
DT-02's admitted default-before-required, trailing-default/rest and nested input
controls remain separate. Repairing the generic source validator would exceed
the frozen source scope; root retains D-2611-MPVR/Arc02 maintenance and LI-04
routing. No source-admission success is inferred for the rejected form.

Correct proof attribution matters: the current required-later/destructure test
at `dts.rs:694–707` constructs parameter shapes directly. The successful
AnalyzedUnit test at `747–764` covers simple discarded/named parameters only.
The composition is low-level shape proof plus admitted CLI/TS consumers, not an
analyzed-unit proof of the rejected source arrangement. Root was informed; no
additional test is needed merely to preserve the mistaken description.

A separate promised witness is still missing at this cutoff: `slots` has
discard indices0/1 and `_value` at2, so its later `arg2` does not challenge a
generated label for discarded slot2. The frozen plan explicitly requires that
opposition. Root received the scoped request for an actual admitted CLI/TS
discard-at2/later-arg2 case before full gates. This does not invalidate the
classifier-boundary workaround, but DT-01 proof remains incomplete until the
witness is supplied and verified in the final candidate. All eight DT rows
remain open.

## Initial implementation verdict — HOLD — 2026-11-14

Separate Sol reviewer received exclusive task source/build at clean
`918f2e9c4237770fc7b2e0e950d726e735e95198`, tree
`37b1cd6e7a457caf94933a35cdac54335c7afb66`, parent c60. Read-only Git checks
confirm exactly the four allowed paths and adjacent required trailers. Release
integration remains c60; no release mutation is authorized. The current planning
packet is `fcd0cae1`. Root remains owner of plans, index, ledger statuses and
retrospective/bubble-up work.

**Hold for two missing promised behavior witnesses.** The inspected emitter
matches the intended allocation, optionality, projection and conservative raw
export rules. No emitter defect is claimed from this source pass. However,
existing green tests and CC final output do not establish the complete frozen
contract below. No independent focused test, build, full gate, citation or size
run was started: resolve these source/proof gaps before aggregate reproduction.

### R01 — Positive grouped export projection is unproved — DT-03/06

The complete new test file's export fixture at
`crates/lykn-cli/tests/discard_declarations.rs:443–448` uses separate scalar
Bind forms and Bind patterns. The only actual grouped form, at `535`, consists
of two zero-name patterns. Both its expected runtime binding projection and its
declaration namespace are empty. The final08 `exports.generated.d.ts` contains
only the separate scalar/pattern exports. There is no inline **or named**
BindGroup fixture with visible projected names in the native unit tests or the
CLI consumer population.

Consequently, either changed group entrance at `emitter/dts.rs:306–317,353–364`
could omit every declaration and still satisfy the current new export tests.
This misses frozen plan C and the explicit inline/named scalar/group/pattern
mapping in DT-03; empty-group marker proof cannot substitute for positive group
projection.

Required correction: extend the existing product test protocol with positive
inline and named groups mixing discards and visible names. Include typed and
literal scalar output, a destructured `unknown` leaf, and named selection from
original source names before normalization. Check exact generated declarations,
actual TS value namespace/types and exact executed runtime namespace/values;
unselected locals, `_` and property keys must be absent. Reuse the current test
file, TempDir and generated-DTS/namespace checks. No new helper framework,
runtime/compiler source path or public API is needed.

### R02 — Recursive parameter shapes are unproved — DT-02/04/06

The complete `declaration_source` at `discard_declarations.rs:149–207` includes
only one-level object and array parameters. None traverses a nested alias into
an object/array or includes a nested object/array element. Native parameter
fixtures likewise contain only Simple object fields and Typed/Rest/Skip array
elements. The final08 generated declaration witness confirms that population.
Thus the frozen plan B/mapping's recursive caller-input obligation and the
close report's nested claim are not established by those green checks.

Required correction: add a small admitted recursive parameter specimen through
the existing actual CLI and generated-DTS consumer. An object alias containing
an array with a default before a required nested object and a rest tail can
exercise the interacting rules in one specimen. Preserve an actual data key
`_`, required nested fields and explicit undefined at defaults under the owned
strict/exactOptionalPropertyTypes/skipLibCheck:false configuration. Assert the
expected nested declaration, positive calls and a credible nested missing-field
or wrong-type rejection; execute the generated callable to observe the retained
input/default behavior. Keep the independent method-prevalidation defect
outside this repair and do not describe a low-level constructed shape as an
admitted CLI source witness.

### Confirmed observations and retained limits

The earlier boundary composition remains applicable. The final source now has
three discarded slots, including slot2 opposed by later meaningful `arg2`, and
suffix reservations opposing `arg0`/`arg0_1`. It has a true discarded parameter
whose body reads the foreign global `_`, with 7-versus-99 checked/stripped and
package runtime controls. Current constructor checks exercise both typed input
and required `_` output data, with an exact actual TypeError oracle. These are
sound inspected test designs; execution is still CC-attested at this cutoff.

The preserved c60 red was inspected directly: compiler-produced duplicate `_`
DTS, valid type-only import/typeof/declare client, strict/exact/skipLibCheck:false
configuration, real offline command and exactly two TS2300 diagnostics, nested
exit1 and Rust witness exit0. The distinct invalid TS1361 attempt remains
explicit. The final08 unguarded bad caller reports TS2345. Neither a malformed
consumer nor an error excerpt is being substituted for semantic proof.

Read the complete final four-path delta and new CLI test `1–817`, current DTS
production source `1–540` plus its complete changed tests and the earlier fully
read baseline tests; complete frozen prompt140, current plan273, ledger14,
intake219 and canonical closing129; baseline red and final08 generated DTS,
checker commands/status/diagnostics. The source guidance and caller/grammar
dependencies recorded in readiness remain applicable because their product
paths are unchanged. This is not a claim to have inspected every CC aggregate
stream or to have reproduced any CC gate. Earlier location errors, failed
attempts and missing interim test snapshots remain preserved as reported.

### Eight-row disposition at the initial HOLD

| Row | Independent disposition |
| --- | --- |
| DT-01 | Source/test design supports the repaired slot and local-allocation contract; independent execution pending. |
| DT-02 | HOLD R02: recursive shape proof missing; current one-level default/rest tests remain proposed-done. |
| DT-03 | HOLD R01: positive inline/named group projection proof missing. |
| DT-04 | Source/schema preservation appears coherent; recursive data-key/default proof remains R02 and execution pending. |
| DT-05 | Actual native/file/package routes and equality assertions inspected; independent execution pending. |
| DT-06 | Actual valid red and TS2345 attestation inspected; R01/R02 consumer populations incomplete and independent execution pending. |
| DT-07 | No independent gates executed on held candidate; CC streams remain attested, not reproduced. |
| DT-08 | HOLD continues; independent final disposition, root retrospective and parent routing remain pending. |

All eight ledger rows and BS-04 remain open. Return exclusive task source/build
to root with no owned jobs; only this review record was written. Root should
preserve this candidate/report, issue one consolidated numbered correction
within the existing five-refinement budget, and retain the same four-path
scope and later owners. No S05, release/remote action, qualified/library,
licence, book or human acceptance follows from this review.

## Correction01 source-readiness — PASS — 2026-11-14

Reviewed the complete unissued `cc-prompt-iteration01.md` and current v1.1
slice plan against unchanged clean918/tree37b1cd6e. Root retains source/build;
no test, runtime, build, product, Git/index or ledger action was taken by this
review. The one-test-file correction adequately addresses R01/R02 while keeping
the four-path S04 delivery, four CLI test groups, all eight DT criteria, M670
population, five-refinement budget and later owners intact. This is readiness
for correction1/5, not implementation acceptance or a new correction count.

R01's inline and named groups use the actual multi-pair grammar, scalar typed
pairs and untyped destructuring pairs. Expected number/string/unknown outputs,
original hyphenated-name selection, exact TypeScript/runtime namespaces and
hidden/discard exclusions discriminate omitted group output and unfiltered
named output through the existing consumers.

R02's Object-alias → Array → Object specimen traverses the actual recursive
variants. Its required nested object/label and required total keep the boolean
default positional as `boolean | undefined`; rest remains `string[]`; optional
object property `_` explicitly admits undefined. The positive and nested
wrong-type/missing-field/rest negatives fit the owned strict/exact/skipLibCheck
configuration. One top-level destructured parameter avoids the separately held
method-prevalidation spelling. No runtime or source-validation change is needed.

One consequential pre-issue specimen error was corrected during readiness:
the original body read `items:length`, although the alias emits a property key
mapped to a nested pattern, not an additional local `items` binding.
`emitter/forms.rs:3850–3872` constructs `(alias items (array ...))`, and
`codegen/emit.rs:1382–1402` writes the key followed by the nested binding pattern.
Root removed that body read, required these producer/writer definitions in
intake, and moved original-array length observations to the actual caller.
The two function returns are `[99,"ok",5,["kept"]]` and
`[99,"second",6,[]]`, with caller lengths respectively4/4 and3/3 before/after.
The first expected-array prose initially omitted its final closing bracket;
root corrected it and I confirmed the exact revised text before this cutoff.

Loaded complete original/revised correction draft, complete revised plan,
current ledger and prior HOLD/boundary records; rechecked group parser
`forms.rs:1338–1389`, recursive object parser `2964–3046`, array parser
`3132–3228`, typed shape definitions `surface.rs:1–103`, declaration recursion
`dts.rs:35–107`, complete parameter preparation `emitter/forms.rs:3718–3938`,
and pattern writers `codegen/emit.rs:377–479,1380–1414`. Earlier complete parser,
caller and scope inspection remains applicable to unchanged source paths.
Actual runtime/checker results remain to be produced by CC and independently
verified. Absolute canonical intake/closing paths and append-only evidence
rules now make the previously mistaken locations explicit.

No remaining substantive readiness gap. Root may commit and issue the corrected
draft under existing authority. The initial918 implementation HOLD stays in
force until a new immutable candidate and its complete evidence are reviewed;
DT-01–08 and BS-04 remain open, with no S05 or release/remote advancement.
