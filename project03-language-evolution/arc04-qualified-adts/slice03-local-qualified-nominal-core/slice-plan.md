---
project: project03-language-evolution
arc: arc04-qualified-adts
slice: slice03-local-qualified-nominal-core
status: active
version: "1.30"
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

**Current assignment:** [iteration16](cc-prompt-iteration16.md), B2b2 native ICU
generated-name hygiene against accepted5554a4d6/treef632c415, under the
operator's B2 design/implementation/independent-validation authorization and
2026-11-13 source-name decision. B2-LX and B2-UNIT are independently accepted.
[B2 architecture](artifacts/b2-owner-and-lexical-design.md) still governs typed
owner/case and occurrence-scoped queries; this native generated-name repair
does not complete that architecture or ordinary source binding hygiene.
Separate Sol readiness and preserved root failures ground its bounded recipe.
Luna6High owns task source/build through clean handoff; Sol6.1High then reviews
independently; root owns architecture and planning Git/index/status. Standard
Autonomous Mode continues without routine permission stops. B2-LX has its own
row and is not complete B2 or LC-02. Original B/C, purity, API and downstream
gates survive. No release edits/integration, remote CI, push or publication.

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
| cc-prompt-iteration07.md | 2026-11-11 | iteration06 | Shared function group parsing, complete executable/default regions, restore public post scope and valid macro oracle | Independent HOLD atb8a1fa17/treed3e604b2: R01–05 repaired, new R06–08; three correction commits retained |
| cc-prompt-iteration08.md | 2026-11-11 | iteration07 | Mandatory producer grammar, exactly-once function regions and ordinary malformed-header diagnostics | Independently accepted IC-01 at e80f613b/tree7376b33d; LC-02–08 remain open |
| cc-prompt-iteration09.md | 2026-11-12 | iteration08 | B2a shared precise lexical regions, actual expanded visibility and explicit unsupported generator diagnostic | Independent HOLD bcb98482/tree72adf0ee; R01–03 and raw controls retained |
| cc-prompt-iteration10.md | 2026-11-12 | iteration09 | B2a correction01: native redispatch/actual diagnostic gating, public class defaults, named kernel function scope | Independent HOLD804be5da/treed25f2b66 on R04; R01–03 focused replays pass |
| cc-prompt-iteration11.md | 2026-11-13 | iteration10 | B2a correction02: shared actual enclosing-declaration sites across expansion/resolution/D2/shadow clients and real wrapper/default slots | Independent HOLD595f672b/treedd518b1b on R05; R01–04 focused controls pass |
| cc-prompt-iteration12.md | 2026-11-13 | iteration11 | B2a correction03: pure typed-source header preflight and canonical genfn metadata/body slots in parser and walkers | Independent HOLD0e249caf/treee946afc2: native protected-host client still visits ignored generator regions; exercised header/D2 controls green |
| cc-prompt-iteration13.md | 2026-11-13 | iteration12 | B2a correction04: parsed native Surface function regions, ignored generator post excluded, actual parameter leaf scopes | Independently acceptedf9be7cb8/tree0ea27d21 for B2-LX only; full S03 and B2b/name decision remain open |
| cc-prompt-iteration14.md | 2026-11-13 | iteration13 | B2b1 owned native analysis unit and canonical JS/JSON/DTS consumer pairing | Accepted through iteration15 at5554a4d6 for B2-UNIT only; original weak-oracle HOLD/history retained |
| cc-prompt-iteration15.md | 2026-11-13 | iteration14 | B2b1 correction01: complete-field private-construction Rustdoc discriminator | Independently accepted5554a4d6/treef632c415, strict Rustdoc-only correction and evidence retention; full B2b/S03 remain open |
| cc-prompt-iteration16.md | 2026-11-13 | iteration15 | B2b2 native ICU generated-name allocator, actual hoist/selector capture repair | Issued after separate source-readiness; CC implementation pending, B2-ICU-N open |

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

Iteration07 returns a clean three-commit correction:284ad97b, b6536e0d and
b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1, final tree
d3e604b206cfedac1ec97a5932ba8b1bb5fca61f. Root checked the eleven authorized
changed paths and final clean pin, then transferred exclusive source/build
execution to Sol for independent review. The self-review follow-ups remove
duplicate default traversal and add once-only occurrence counting plus the
supported native macro oracle. CC attests final full1533/482, cold twelve-byte-
comparison/25-case M6, public14/binding30, size43828 and committed citations64/601.
These remain proposed evidence; IC-01 is open until corrected software review.
Intermediate284 gate receipts and original5bdb HOLD remain historical. Root
owns planning index/records; current assignment is returned for review.

Independent corrected-candidate review holds b8a1fa17 on R06 wrong non-parameter
pattern grammar (actual bind/loop alias locals), R07 repeated public function
default traversal and R08 native empty func/genfunc header panic. Old R01–05
witnesses now behave as required. No independent full gates ran after the new
substantive failures; prior CC full results remain attested. Root's
[correction02 design](artifacts/ic01-correction02-design.md) changes the causal
method: every private projection/default caller selects an actual producer
grammar explicitly, function headers no longer fall through to generic walking,
and malformed source returns to normal classification. Typed surface lambda
and actual kernel lambda remain distinct. This is IC refinement3, with all
earlier passes/failures and the five-pass limit retained. Source/build ownership
transfers only after the reviewer finishes its durable HOLD; Luna then executes
iteration08 and returns a clean candidate to separate Sol review. IC-01 stays
open; qualified-constructor implementation does not resume on CC attestation.

Iteration08 returns clean e80f613baf8f52d7b8f42e05ac38e99c69513d46, tree
7376b33d7ca8e66942afd88036599e9e5e4bae35. Root verified the six authorized
changed paths and contiguous trailers, preserving the CC index, raw final gate
logs and explicit missing-numeric-exit limitation for its full make check.
The raw log reports1536 product/482 docs and the all-checks-passed marker; this
is CC attestation pending Sol's own run. CC cold M6 asserts twelve comparisons
and28 public cases, citations64/601 and size43996 pass. Early expectation,
filter and stale-map attempts remain disclosed transcript-only. Root transfers
exclusive source/build execution to Sol; IC-01 and LC-02–08 stay open until
independent disposition. Prior A/B1 and release0829 remain unchanged.

Independent Sol review accepts IC-01 at that exact pin. The
[correction02 verification](artifacts/increment-ic01/correction02/cdc/README.md)
reproduces repaired R06–08 and retained R01–05 behavior, fresh numeric-exit0
full checks (1187 language units,1536 corpus/67 steps,482 docs once), cold
twelve-module/28-case M6, citations64/601, browser43996 and isolated copied
CLI/browser-compiled ESM controls. Its own setup/helper failures and both actual
native binary hashes are preserved distinctly. Root verified archive
a889c79e0a1fb50847b9a0dbe8edd975a45096b1a0bd9d75eaef46c32c93fd7a.
Only IC-01 closes. The B2 preparation handoff records the accepted source,
remaining lexical identity/clause/member/native-order design inputs and the
requirement for a source-ready next numbered assignment before implementation.

2026-11-12 B2 authoring/readiness inspected native resolver/pass2/classifier/
emitter and public lowering/sequence/private-marker paths. The chosen first
checkpoint repairs clause/member scopes and native Func semantic-region order
without a macro-phase split. Class bases retain incoming plus own class scope.
Public/native macro clause-order differences remain explicit; multi-clause
simple-default lowering differences are B2b/S06 carryovers. Silent native
first-clause generator emission becomes an unsupported-feature diagnostic.
The recipe uses original occurrence-index paths, explicit result-slot tags and
incoming-environment declaration gating, not pointer/span identity or completion
use guessing. Separate Sol initially required those behavioral dispositions,
then accepted source readiness with no remaining contradiction. No new runtime
experiment or software acceptance is inferred. B2a is a separate usable
checkpoint after accepted IC, not erasure/reset of prior refinement history;
its own corrections remain bounded by the framework's five-pass loop. Root
continues B2b preparation after independent lexical acceptance.

B2b preparation now records the pending operator **B2-ID-NAME** language choice
in [owner-unit preparation](artifacts/b2b-owner-unit-preparation.md): DD-49's
module-scope collision rule does not settle distinct normalized spellings in
nested lexical scopes. Source-exact identities with hygienic JS emission versus
canonical normalized alias/shadow identity produce different semantics. Root
requested a disposition; dependent B2b name/owner lookup is held pending it.
B2a implementation and independent verification continue under their settled
scope; this does not reopen or block accepted A/B1/IC.

2026-11-12 v1.17: root verified the clean B2a handoff at
bcb98482fa9b32aa6f58df3e2249123e16924271, tree
72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9, and its exact22-path implementation
diff over e80f613b. Source implementation fbd1604d and two empty metadata
follow-ups remain intact; the last carries the required contiguous trailers.
Exclusive source/build ownership transfers to the separate Sol6.1High reviewer.
The CC evidence is attested, not acceptance; B2-LX and LC-02–08 stay open.
Root reconciled the raw final full-check denominator:1546 product cases/67 steps,
not the1536 reported in CC's handoff;482 documentation cases passed once.
The original attestation and raw streams are preserved with this correction.

2026-11-12 v1.18: separate Sol software review holds B2-LX on three causal
areas: native macro-result redispatch and pre-binding generator diagnostics,
public class-default path replacement, and named escaped kernel-function
parameter scope. [Independent evidence](artifacts/increment-b2a/cdc/README.md)
includes actual ESM/direct controls, immutable-e80 class-default comparison,
lazy arguments and genuine chain-limit control; no full known-bad gates ran.
Root verified the archived receipt digest, read the source-grounded defects
and supplies iteration10's concrete correction. Separate Sol read-only review
finds R01–03 source-ready after generator gating is explicit. This is B2a's
first formal correction; all earlier A/IC passes remain preserved. Luna now
owns task source/build through clean committed return, followed by separate
Sol software review. No row closes, B2-ID-NAME remains pending, and release0829
is unchanged.

2026-11-13 v1.19: root verified correction01's clean source
804be5daace5b0cb708ad21b3beb7eecbd5d00fa, tree
d25f2b660d3de2e6f52b8ee890172f223c9abc80, exact seven authorized paths and
contiguous trailers. Exclusive source/build ownership transfers to separate
Sol6.1High for corrected software verification. CC's raw final full check is
1547 product/67steps and482 docs, numeric0; committed cold M6 reports14 module
matches and39 materialized public cases. Browser raw gzip is46418, not
independent acceptance. Prior B2a prose45457 was a preserved transcription error:
its original raw gate says46457, so this correction is39 bytes smaller.
Both metadata/count reconciliations remain append-only. B2-LX, LC-02–08 and
B2-ID-NAME remain open/pending; source is not integrated into release0829.

2026-11-13 v1.20: independent review holds804be5da on B2a-R04 despite passing
focused R01–03 controls. [The preserved HOLD](artifacts/increment-b2a/correction01/cdc/README.md)
reproduces false native declarations from ordinary calls, missing native normal/
default export bindings and missing public trusted-wrapper visibility. Root
verified receipt archive4418170862beeb0d0673fb14f7d2180dde26af129365bd1adfcfee16b70fc9f1.
Complete bounded caller review exposes competing transition adapters; iteration11
therefore supplies one sites-preserving actual declaration query per backend,
consumed by expansion/resolution/D2/shadow clients. Direct default declarations
and expression-local names have distinct explicit slots. Separate Sol finds
this source-ready; its blanket baseline-failure wording clarification is adopted.
Luna owns source/build for correction02, then Sol independently verifies.
This is the second B2a formal correction; no loop history resets or row closes.
The unanswered operator name policy and all original B/C/S06 obligations remain.

2026-11-13 v1.21: root verified clean correction02 implementation f39bc18a,
15 authorized paths and treedd518b1bf339aac75e25a8459c67804f0559de72.
Actual message inspection contradicted CC's trailer claim: bare names lacked
Co-authored-by labels. Root preserved f39 and added empty595f672b9991896754ba62a05c7c647dfaaeaa01
with correct contiguous trailers, unchanged implementation tree and fresh
committed-HEAD citation0. [Root-authorized scope clarifications](closing-report.md)
include shared formHead relocation, native/public original-source macro
collection, accepted kernel import projection and staged-browser project map.
CC raw final1553/67steps plus482docs, cold14/45 and46503-byte gzip pass; original
failed/setup/cache/config attempts remain. Separate Sol now owns source/build
for independent software/metadata review. No B2-LX/LC closure or release change
is inferred; B2-ID-NAME remains unanswered.

2026-11-13 v1.22: independent review holds595f672b on original R05 typed-header
ordering and genfn metadata/body alignment. Supported get-null macros establish
actual invocation before malformed-header diagnostics; paired registration/
literal controls establish the ordinary parser boundary. Native/public D2 also
reject an inert genfn :yields binding payload, while its legal-name control
compiles/runs41 in both. [Full HOLD/addendum](artifacts/increment-b2a/correction02/cdc/README.md)
preserves native7/public82 passing R01–04 focused evidence and all unrun full
gates. Root verified both original and cumulative archive digests.

Iteration12 supplies pure existing typed-source header preflight after actual
root dispatch and before every selected clause's effects; a shared genfn slot
descriptor aligns both actual parsers/lowerers and native/public layout clients.
No broader raw-kernel/class grammar or early semantic analysis is claimed.
Existing annotation permissiveness and backend error ordering remain explicit.
Separate Sol reviewed the complete draft with no concrete contradiction; root
issues correction03, Luna owns source/build, then independent software review.
This is the third B2a formal correction; earlier history and all rows survive.
The typed-owner/name choice remains pending and release0829 is unchanged.

2026-11-13 v1.23: root verified clean correction03
0e249cafb7d50ce45e00f7c7288249666fcc113f, treee946afc2283951fe11f2e9c7040a7f734dbf6d11,
13 authorized paths and correct literal/parsed contiguous co-author trailers.
The [root scope clarification](closing-report.md) adds only the existing public
simple typed-name atom guard and embedded mirror, including its constructor-
field parser reach. CC raw full1556/67steps plus482 docs, cold14/48, citations64/
601 and46600-byte gzip pass. Root corrected the CC prose's wrong predecessor
comparison/headroom against original raw logs, preserving both reports.
Exclusive source/build ownership transfers to separate Sol6.1High for complete
B2-LX verification; no row closes on CC attestation. B2-ID-NAME, LC-02–08 and
all original nominal/API/purity/book/human obligations remain open.

2026-11-13 v1.24: correction03 independent HOLD retains R05 in the native
protected-host client: raw anonymous generator traversal includes consumed yields
metadata and named generator traversal includes ignored post. Root verified
archive91564bbcccc497e527aad1c6b82b08be28af609806c699ac1a2d0a339c3cbd82
and clean0e249caf/treee946afc2 handback. Independent focused8native/85public
plus10 diagnostic/5 runtime public replay pass; full gates remain unrun.
Iteration13 corrects the remaining client with authoritative parsed source
regions and actual leaf parameter names, preserving raw Kernel handling and
the public validator's expanded/kernel input domain. Fourth formal B2a
correction, no history reset; B2-LX, B2-ID-NAME, LC02–08 remain open.
Separate Sol reviewed the complete draft against the pinned source and confirmed
the parsed leaf projection/emitter agreement and public input-domain limit.
Root issues iteration13; Luna takes exclusive source/build ownership.

2026-11-13 v1.25: correction04 returns clean
f9be7cb85f62513f1624964fcc6773bffe4f66fe/tree0ea27d21f759e0c068e8f655b14f43a1a5f20452.
Root verified four authorized paths and correct literal/Git-parsed trailers.
CC full make check passes1197 native library/1556 product67steps/482 docs before
the final public test/count-only delta; no later production change. Final public
21/21 and cold M6 fourteen byte comparisons/49cases pass after that delta.
CC postHEAD citations64/601 and46600-byte gzip pass. Original full-check snapshot
and final test-only patch are separately preserved, not conflated. A test-only
expected-leaf error and non-gating preexisting Deno-format observation survive.
Separate Sol now exclusively owns source/build for complete original B2-LX
verification, including fresh final-source full checks. Only independent
acceptance may close B2-LX; B2b/name policy and LC02–08 remain open.

2026-11-13 v1.26: separate Sol accepts B2-LX only at cleanf9be7cb8/tree0ea27d21.
All12 verification rows pass, including final-source full1197native/1557product/
67steps/482docs, cold fourteen module comparisons/49cases, actual native routes,
canonical/materialized fixed-nine/private/Reflect and staged-browser ESM proof,
postHEAD citations64/601 and46600-byte gzip. Root verified both frozen packets:
first36ea6ae95822b2fd99f3bd0514ce71a95ba8fc75e947702fb8fe72b0fee076e4;
finala0e7b5673e31c18c5376418d646f60bf1e81d32f1a04cc98bc74d87addc90017.
The final packet qualifies a broad public test-corpus wording; native tests
also changed, and no runtime/verdict/denominator changed. Root verified source
and release status/pins; release remains0829e892. Only B2-LX closes. B2-ID-NAME
is unanswered, B2b remains unissued, LC02–08 and all nominal/purity/API/book/
human obligations remain open. S06 should examine object-key normalization vs
literal string lookup guidance based on the preserved helper assertion error;
this is an audit input, not a proved documentation defect. Full S03 closing
and CDC retrospective are still due when its original criteria are satisfied.

2026-11-13 operator continuation: B2-ID-NAME is resolved explicitly: distinct
Lykn spellings identify distinct bindings. The recorded example must return1,
with exact source lookup and hygienic emitted names. Existing same-scope/public
name diagnostics and property normalization remain separate contracts. Historical
pending statements above describe their earlier checkpoints. Root resumes B2b
source-readiness; no owner or naming implementation is yet accepted. Same
Luna6High CC/separate Sol6.1High CDC, existing Autonomous authority and all
original gates remain. No release or remote action is authorized here.

Iteration14 is the first usable B2b checkpoint: replace independently paired
native forms/registry with an opaque owned successful AnalyzedUnit and typed
AnalysisFailure; canonical kernel/JSON and module DTS consume one unit. This
lands the approved transport spine before source identity allocation or nominal
activation. No new source-name behavior is claimed and check_strict's semantic
join remains explicit future B2b work. Root inspected algorithm/signatures and
actual production/test consumers; source-readiness is with separate Sol before
issue. All old emitted output, diagnostics/fragment/completion/host contracts
and full validation survive. This is new B2b feature work, not a B2a retry reset.

Separate Sol read-only readiness on complete iteration14 found no concrete
source contradiction. Root clarified that compile prints successful analysis
warnings, whereas dist currently prints no analysis warnings and only its DTS
warnings. Old negative emission cases remain analysis-valid and retain channels.
Root issues iteration14 against cleanf9; Luna takes exclusive source/build.

2026-11-13 v1.28: iteration14 returns production/API commitd787231a plus
test-only oracle followupcf432622/tree27419cb3. Root refined the independent
Entry unit test to actually pattern-match via registry metadata; constructor/
DTS field rendering alone was not a discriminating registry consumer. Both
commits and their successful full/focused chronology remain. CC full1199native/
1557product67steps/482docs preceded that final test-only change; separate Sol
ran final-source full once and actual metadata-sensitive CLI/JSON/DTS/runtime,
warning/error/recovery and cold gates green. B2-UNIT remains validation HOLD:
the empty AnalyzedUnit literal compile_fail also rejects from missing fields.
Actual fields/accessors are private/immutable and no runtime defect was found.
Iteration15's full-field literal isolates privacy as the actual rejection;
source-ready with separate Sol, then source/build transfers back to Luna on
clean handback. Compiled-code evidence may be retained only if the actual diff
is strictly doctest-only; corrected Rustdoc needs independent rerun. All
name/owner/nominal/LC02–08/S03 obligations remain open; source-name policy is
resolved but not implemented. Root's original proof choice/refinement and all
author/setup errors are retrospective inputs, not claims about model efficacy.

Root verified the independent cf HOLD archive SHA256
0864bc473e988c6d9c2cbe6c2cf490249d8a8aea5f524b880ba1ba1f5c1b660d and clean
source/build handback. Sol confirmed complete draft15 source-readiness. Root
issues the strictly one-file Rustdoc correction; Luna owns source/build until
clean committed handback, then Sol independently verifies the new discriminator
and evidence applicability. Old successful compiled-code gates remain evidence,
not a claim the empty literal proved privacy. No ledger row closes yet.

2026-11-13 v1.29: separate Sol accepts B2-UNIT at clean
5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb/treef632c415b833e796e6843abdc5220d6492595fc0.
Root verified exact doc-only diff, both literal trailers and final archive
7b12443b0f93852b3059f8f64d12008aeb79ab2187ffe74b5a5977008cac8932.
The repaired full-field constructor rejects solely E0451; old-call test E0061,
two normal/two compile-fail examples, format and finalHEADcites pass. Independent
cf compiled-code/fixture/JS/build/compression inputs are unchanged and the
reviewer explicitly retains its full1199native/1557product67steps/482docs
(15skipped), matched registry/API/CLI/JSON/DTS/runtime/cold14/49 and46600-byte
size evidence. The copied binary hash remains pinned to cf, not a post-doc build.
Original U01 and CC/root/CDC first attempts remain. One post-freeze checksum
cwd mistake and corrected check are outside the unchanged final archive.
Only B2-UNIT closes. Name hygiene, owner/case graph/nominal activation/check
semantic join and LC02–08/S03 remain open. Root resumes their source-readiness
with no new operator name decision required. Source runtime naming baseline2
and preserved hoisted helper41 remain future change/preservation controls.

2026-11-13 v1.30: root's naming preparation reproduces two native ICU private-
local captures: repeated-slot _n initializes from itself and plural _v0 does
likewise, both runtime ReferenceError. Noncollision control prints3 3.
Original CLI streams/generated outputs remain in
artifacts/increment-b2b/root/icu-hoist-baseline. Draft iteration16 is the
source-ready B2b2 native-only allocator prerequisite: source-normalized roots,
one per-template shared hoist/selector namespace, unchanged evaluation/IIFE/
error contracts and actual runtime discriminator tests. Separate Sol readiness
precedes issue. Public JS has analogous raw ICU names and remains explicitly
open; ordinary source binding hygiene/typed owner activation is not closed by
this repair. New B2-ICU-N row does not replace LC02–08 or any original scope.

Separate Sol read-only readiness found no concrete recipe contradiction.
Root clarified eager repeated nontrivial kwargs versus once-referenced lazy
branches, and current unspecified HashMap consumption order. Canonical
host/completion aliases are finalized before this scan; raw private family
names are disjoint from current ICU stems. This evidence is family-specific.
After the clean handback and planning commit, root issues iteration16 and
transfers source/build to Luna; public/source-name/owner scope remains open.
