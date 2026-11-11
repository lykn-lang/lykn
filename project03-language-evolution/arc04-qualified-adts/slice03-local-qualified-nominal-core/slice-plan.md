---
project: project03-language-evolution
arc: arc04-qualified-adts
slice: slice03-local-qualified-nominal-core
status: active
version: "1.11"
depends-on: [slice01-contract-and-emission-design, slice02-existing-adt-correctness]
---

# Local qualified nominal core

The operator authorized the S02 local release fast-forward, independent
validation, then S03 on 2026-11-11, same Luna 6 High CC and separate Sol 6.1
High CDC, Autonomous Mode. [Release integration](../slice02-existing-adt-correctness/artifacts/release-integration-0829e892.md)
is independently accepted at 0829e892999890e8877dec5e35cd249753e1be5d, tree
d0f802ca4eb1847400c7395f1c203ada3263403b. No push, publication or later source
integration is authorized by this S03 assignment.

Implementation reuses `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on dedicated `codex/qualified-adt-core`, created clean from that accepted pin.
Release stays separate at `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.
Canonical planning is the existing orphan planning worktree. Root owns design,
parent plans and planning index; CC owns task source/build during assigned
implementation; Sol owns independent checks after explicit handoff.

Deliver the local/single-file part of the [accepted S01 contract](../slice01-contract-and-emission-design/artifacts/qualified-adt-contract.md).
That complete contract governs syntax, static ownership, runtime descriptors,
qualified guard/call/TDZ rules, declaration shape, serialization loss and the
intended migration. Same-module facade access is the semantic baseline, not a
winner of the later reference-lowering experiment. Imported graph/interfaces,
reexports and the two-layout comparison remain S04; actual build/JSON composition
is S05; the full API/docs/book/human gates remain S06/S07. Existing I4 protected
early-return work is separate. Do not silently keep flat constructor dispatch
as the new language contract or select a production optimizer strategy here.

Use bounded engineering increments, preserving all eight LC criteria:

1. **A: protected host foundation.** Independently review and implement the
   finite v2 host contract and hygienic compiler-owned intrinsic references,
   including transitive existing guard/error operations. Existing typed guard
   production paths consume it; no ADT syntax migration yet. This is the initial
   `cc-prompt.md` assignment. Its private lowerer must coexist with protected
   Reflect invocation and preserve ordinary no-request output. A's independent
   acceptance is required before dependent nominal initialization uses it.
2. **B: local metadata and nominal semantics.** Prepare the source-ready
   iteration against accepted A. Fresh per-unit state, typed OwnerRef/CaseRef,
   lexical owners/immutable aliases, static validation and same-module runtime
   namespace/brand/case construction and recursive matching. Preserve real
   qualifier reads and declaration-position TDZ. Migrate the necessary corpus
   rather than maintaining accidental flat global-case lookup.
3. **C: complete consumers and initialization proof.** Finish precise DTS,
   API/CLI/browser-compile/embedded consumers, scoped compiler-owned initialization
   purity provenance (including feature-local support initializers in the ADT
   dependency graph) and its serialization/codegen boundaries, required
   migration and full single-file proof. Typed purity is reviewed before use;
   source-shaped annotations and application constructor calls are not trusted.

These are implementation checkpoints within S03, not reduced scope, extra
acceptance claims or authority to skip later gates. Root issues preserved
numbered prompts after source inspection/readiness for B/C; CC does not invent
their public semantics from the brief. Each usable checkpoint is committed and
independently checked; LC rows close only when their full stated verifier is met.

All new research probes/helpers use Lykn. No Python execution or Python/Ruby/
Fennel/handwritten JS research helper is permitted; product Rust/JS and normal
product tests are in scope. Use existing product harnesses, direct native CLI
and useful bounded receipts; no reconstruction framework, source/binary cache
archives or arbitrary artifact caps. Keep useful failures and issued prompts.
Do not reformat legacy JS whole files or amend already committed evidence.

The source-ready A recipe fixes the finite protected set and capture/alias
policy, preserves unknown/dynamic/foreign limits, and supplies discriminating
runtime and source-write tests. Later initialization-proof work must distinguish
trusted declaration initialization from effectful user expressions. Per-unit
metadata and local nominal changes do not imply all existing builtin keyword
guards are already coherent: public symbol/bigint and native promise behavior
are concrete pre-existing differences to record and route, not hide.

Final S03 validation includes focused native/public default/stripped semantics,
normal CLI, actual embedded delivery and browser path, declaration consumers,
fresh state/alias/TDZ/collision/descriptor/serialization negative controls,
`make check`, committed-HEAD citation and 80 KiB browser gates. No repeated docs
outside make check. A passing intermediate substrate test is not S03 closure.

The browser contract here is compileLykn/the normal compile adapter returning
ESM text, as S01 specifies. Existing browser run/load use indirect eval and
cannot execute emitted fallback imports. Record their expanded affected cases
and route the execution-policy/API impact to S06; this slice does not promise
a new run/load, CSP or module-loader policy. Test browser-compiled output in an
ESM-capable consumer without disguising that distinction.

Root's preparation inspected the actual native/public guard/error producers,
private atom/writer and pointer-anchored Reflect request path, whole/fragment
JSON signatures, browser compile/eval split, CLI call sites and duplicate
embedded package. Sol's separate read-only readiness review confirmed the
finite operations and identified two ambiguities, resolved before issue:
whole-unit JSON lowers refs and returns Result<String,LyknError>, fragment
JSON returns Result<Value,LyknError> and rejects unfinished refs; browser
compile is distinct from existing eval execution. A's alias shape may evolve
under later LC-06 proof; it selects no final optimizer strategy.

2026-11-11 final read-only preparation review by the separate Sol 6.1 High
context supports issuing increment A after those clarifications. This is
assignment readiness only; no LC implementation criterion is closed.

2026-11-11 increment A candidate 5a8aedc5 passed CC and fresh independent full
gates, but independent focused controls exposed native multi-clause Array
dispatch capture in all four module/parameter checked/stripped conditions.
The public native fragment boundary, repeated private-atom mutation and M6's
changed-module/runtime oracle also require correction. [Independent HOLD](cdc-verification.md)
and original evidence remain intact. [Correction01](cc-prompt-iteration01.md)
implements those four bounded repairs; separate Sol source-readiness review
supports issue. LC-01 and all other rows stay open pending corrected software
verification. The fixed nine-value inline module is explicitly provisional;
only aliases/import specifiers, not its module body, are sparse.

B preparation is retained in [the owner-resolution memo](artifacts/local-owner-preparation.md).
Its provisional macro-before-surface proposal was withdrawn before issue:
actual Thread/Eq lowering changes macro arguments/occurrences, so a new macro
phase would require a separate language contract. Current preparation keeps
existing macro behavior and considers explicit per-unit ADT semantic plans
finalized after actual expanded declarations are collected. Exact B types,
APIs, lifecycle and source-readiness review remain unissued; A correction
authorizes none of that work.

Correction01 source 16dcd64f repaired the dispatch capture and shared-reference
mutation; independent focused controls passed. Acceptance remains held because
M6's actual public runtime set omitted both new dispatch fixtures, and the
dispatch reference inherited a generated default span. [Correction02](cc-prompt-iteration02.md)
adds those materialized tests and threads the real parameter span. Root
verified the exact fixture oracle; separate Sol preparation review supports
issue. No full independent gates were spent on the known-incomplete candidate.
The test census is 44 redirected internal-producer sections, 125 remaining
sections containing public emit_form calls, and 33 other sections (202 total);
158 denotes the untouched remainder, not public API coverage. Original CC
attestation and independent clarification retain their original pins.

The completed correction02 M6 oracle then exposed a concrete public compiler
defect: both unchanged dispatch fixtures fall through after a selected
unannotated expression body and throw no-match. CC preserved three passing/two
failing materialized cases; root inspected the actual hasReturns gate, existing
wrapReturnLast helper, native counterpart and source guide ID-19. The dirty
three-file correction02 state is retained as an exact patch with its own hash.
[Correction03](cc-prompt-iteration03.md) keeps that work and repairs public
implicit returns in canonical/embedded classifiers, with direct runtime
controls. Optional type annotations do not select successful function control
flow. A separate Sol preparation review supports issue after tightening the
explicit-return/postcondition runtime oracles. No fixture annotation workaround,
public macro redesign or broader return-guard guarantee is authorized.

Increment A is independently accepted at source
5caf3d871a80a711c08dbda0db8c5f5446dffb56, tree
115ce5ecc254ea9ed15263612bed67b6cec80ab2. Root verified the independent
archive digest and actual source pin; LC-01 is done. This is not S03 closure
or authority to integrate later source into release. Release remains 0829e892.

The first usable B checkpoint is [per-call public type metadata isolation](artifacts/per-unit-type-context-design.md),
issued as [iteration04](cc-prompt-iteration04.md) after separate Sol final
source-readiness review. It removes actual global type state, preserving
existing macro/lowering order and legacy syntax until the qualified migration.
Cold prelude metadata is explicitly normalized to the old reset/native-analysis
baseline, not introduced as runtime bindings. The actual changed M6 union is
nine files. No new dependency or public context injection is added; removal
of surface.js resetTypeRegistry is carried to S06. This is a partial LC-02
foundation, not replacement for typed owners, aliases, nominal values or C.

B1 is independently accepted at source 3f197340dd4765df7cccb3858ef97faccb5df9fc,
tree 9ee95765b3475c84c5f537834ecceb6b476dc794. Root verified the source pin,
clean task/release state and independent archive SHA-256
7dfbceef5749cd5ba2212cb78bf5d5d3821364c551b2793b72c3596d660a8e11.
Actual old successful/late-failure leaks reproduce; fresh independent focused,
full, actual embedded and cold CLI gates pass. LC-02 remains open because
isolated legacy field metadata is not typed OwnerRef/CaseRef resolution.
The removed public reset export and prior Rust JSON signature changes stay
explicit S06 inputs. Release remains 0829e892, with no later integration.

Before qualified namespace activation, root prepares the bounded
[IC-01 emitted-binding prerequisite](artifacts/reserved-binding-repair-design.md).
It addresses the observed package compile/run failure, the raw/emitted name
gap, actual ESM oracles and existing check/expansion gate differences. This
design is unissued pending separate readiness review; it does not replace B2
or close any LC row. Current legacy metadata-only type names and future
namespace/data keys remain distinct. All original B/C and downstream gates
are preserved.

IC-01's separate read-only preparation review is complete and requires revision
before issue. Its proposed gates must first cover lowered function/arrow
parameters and atom-form nullary constructors, respect actual bound form-head
dispatch, and distinguish quoted/property structure from executable forms.
These concrete source-inspected counterexamples are recorded in the design;
they are not B1 failures or executed IC-01 observations. No IC-01 source edit
or numbered implementation prompt was issued. Root owns the concrete source-
role contract and subsequent readiness/assignment, retaining all qualified B/C
and S06 audit obligations. The task stays clean at accepted B1 3f197340 and
release stays clean at independently accepted 0829e892.

2026-11-11 the operator authorizes settling the binding-role contract,
implementing and independently validating the bounded IC-01 repair before
resuming qualified constructors, same Luna 6 High CC / Sol 6.1 High CDC,
Autonomous Mode. Root's [revised role contract](artifacts/binding-role-contract.md)
settles every preparation ambiguity: actual parameter grammar, quoted-template
depth, supported native quotation paths, kernel-only D1 scope corrections and
validation-only class-member queries. Existing source Func/class aggregate
scope issues are explicit B2 inputs, not new IC-01 expansion claims.

**Current assignment:** [iteration07](cc-prompt-iteration07.md), consolidated IC-01 correction after iteration06's HOLD;
implementation at accepted B1 3f197340/tree9ee95765. The preserved initial
design remains historical where superseded by the role contract. Root owns
architecture/planning; Luna owns task source/build until clean handoff; Sol
then independently validates actual software. IC-01 has its own ledger row,
and LC-02–08 remain open. No release edits/integration or external actions.
After acceptance resume concrete qualified-constructor preparation against the
new exact source, preserving the original B/C and downstream gates.

## Assignment history

| Prompt | Issued | Predecessor | Reason | Disposition |
| --- | --- | --- | --- | --- |
| cc-prompt.md | 2026-11-11 | S02 independent release acceptance | A finite host prerequisite | Superseded by corrections; original candidate/HOLD retained |
| cc-prompt-iteration01.md | 2026-11-11 | cc-prompt.md | Four host-reference findings | Superseded by02; source16dcd64f retained |
| cc-prompt-iteration02.md | 2026-11-11 | iteration01 | Actual materialized dispatch coverage/span | Superseded by03 after public implicit-return finding; failed patch retained |
| cc-prompt-iteration03.md | 2026-11-11 | iteration02 | Public multi-clause implicit-return correction | Accepted5caf3d87; LC-01 done |
| cc-prompt-iteration04.md | 2026-11-11 | iteration03 | B1 per-call metadata isolation | Accepted3f197340 as partial LC-02 only |
| cc-prompt-iteration05.md | 2026-11-11 | iteration04 | IC-01 binding-role/emitted-name prerequisite | Continued by06 after first full gate exposed a necessary guide-example rename |
| cc-prompt-iteration06.md | 2026-11-11 | iteration05 | Rename guide block34 public to public-user, preserve output, finish original repair/gates | HOLD at5bdbfe3c/treee0a95d74: IC-R01–04 correctness plus R05 oracle gap |
| cc-prompt-iteration07.md | 2026-11-11 | iteration06 | Shared function group parsing, complete executable/default regions, restore public post scope and valid macro oracle | Active correction; independent acceptance pending |

The A correction loop used three refinement passes; B1 required no software
correction. IC-01 is a distinct authorized usable prerequisite, not a retry
renumbering or erasure of those failures. Keep future refinements explicit.

IC-01's first full gate reached documentation and retained481 passed/1 failed:
the existing core-idioms dissoc example binds public. Root inspected the exact
block and issues the three-token binding/reference rename to public-user through
iteration06, preserving data/output/teaching and all correctness gates. This is
the first IC-01 refinement; it does not reopen A/B1 or authorize general docs
work. The broader S06/S07 guide/book obligations remain intact.

CC's clean candidate is5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe, tree
e0a95d7452f3a33529fb7bd7a75ab46289d7349e. Root verified the exact18-path
scope, contiguous trailers and clean source pin, read the CC receipt index and
transferred exclusive source/build execution to separate Sol for independent
software verification. CC attests fresh full1530/482, focused14/29 and actual
cold M6 eleven comparisons/22cases, size43625 and committed citations64/601;
these do not close IC-01 pending that review. Current iteration06 is returned
for review, not authority for more source edits. Root owns planning Git/index.

The raw writer/validator kernel lambda representation is distinct from the
existing public escape whitelist: kernel:lambda is not accepted by that
whitelist. CC retained the unsupported fixture attempt and uses direct
validator/resolver checks for the internal representation. No new lambda
source syntax is introduced or claimed. Review must judge that actual boundary.

Independent review holds5bdb for executable body-tail, computed-callee and
default-region misses plus new public body-to-post scope rejection; the macro
fixture also used unsupported anonymous plain-function grammar. Existing
focused suites were green despite these concrete actual ESM failures. No full
independent gates were run on the known-bad candidate. Root verified archive
f8a6a9fc81cf5ac0a72d79853c9816a6eb40ca5e2a70e395c6e84ae513eeceeb.
IC-01 remains open; A/B1 acceptance is unchanged. Source/build ownership is
back with root while [the consolidated correction](artifacts/ic01-correction01-design.md)
receives a read-only readiness check, before a new numbered source assignment.

The reviewer separately reproduced an older native post-before-body resolution
limit at B1. Public B1 handled both keyword orders; IC-R04 must restore that
public behavior. Native body-before-post success and newer fail-fast rejection
of the older invalid native ordering must survive this bounded correction;
general native ordering repair is retained with B2, not silently added here.

Root issues iteration07 after read-only correction readiness. The review's
one blocking recipe clarification is adopted: typed nested alias names are
external property keys, not bindings; project only nested locals. The bounded
shared-parser wiring and twelve-file delivery union are now explicit. This
is IC-01's second refinement (the first was its guide migration), preserving
the earlier A loop's three passes and all original holds. Luna owns source/
build until clean corrected handoff; Sol will then independently revalidate.
