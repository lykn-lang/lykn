# S01 independent design verification

## Initial review — candidate 4bd224fc

**Verdict: not accepted; all five QD rows remain open.** This is a substantive
initial design review, preserved before the consolidated corrective iteration.
It accepts neither the contract nor the emission protocol for implementation
or experiment execution. Explicitly unresolved architecture is not itself an
agent violation; the findings identify source errors and contract/proof gaps
that the final design must resolve. The root coordinator retains PL decision
authority. This reviewer proposes no replacement architecture.

Actual reviewer: the assigned independent Codex Sol 6.1 High context, separate
from Luna 6 High CC. Assignment: slice-root `cc-prompt.md` and current plan/ledger
at `f478eb788159d856d9c32a06486f07bc050d2f01`. Reviewed proposal commit
`4bd224fcd9b4a9354bb1a7950904760b54c33b32`: the
[contract](artifacts/qualified-adt-contract.md),
[protocol](artifacts/emission-protocol.md) and
[contributor report](closing-report.md).

All source locators below refer to the read-only worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/completion-value-flow`, commit
`685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`. The source remained clean.
This review read actual native/public interfaces and preserved research;
no source write, helper logic, prototype, compile, test, bundle or experimental
execution occurred. Existing tool availability was checked read-only during
preparation, not rebuilt or treated as new layout proof.

## Findings

### RV-01 — High: prelude interoperability and legacy binding compatibility are unspecified

Location: contract:62–100,204–246; QD-01/02/03/05.

The declaration-binding owner rule and generic branding options do not state
how built-in Option/Result values interoperate across independently compiled
modules without a mandatory shared runtime. A fresh prelude owner per compilation
or module evaluation would make common separately compiled APIs reject one
another's values. Built-in compatibility must be stated separately from any
generative user-owner policy; the initial draft contains no such exception.
This is a correctness-grade compatibility obligation, not a request to select
an identity representation in this review.

The actual native prelude has named module paths `lykn/core/option` and
`lykn/core/result` (`analysis/prelude.rs:7–54`). User definitions may shadow
blessed constructors, losing enhancement; registration removes the entire
shadowed blessed type mapping (`analysis/type_registry.rs:43–47,80–86`). The
contract must explicitly disposition that existing policy and distinguish
pre-registered metadata from actual runtime constructor bindings.

There is also a concrete legacy namespace collision to account for:
`test/surface/type_test.lykn:32–41` uses `(type Box (Box ...))` and Pair/Pair.
Adding a runtime type namespace while retaining a same-named bare constructor
cannot silently place both in one binding. The draft mentions migration
collisions generally, but supplies no worked policy for these actual consumers.

Required disposition: identify built-in cross-unit compatibility, user/prelude
shadowing, constructor availability and same-name legacy migration behavior,
with discriminating cases. Root owns those decisions; no solution is prescribed
here.

### RV-02 — Medium: existing host protection cannot protect arbitrary intrinsic captures

Location: contract:148–155; QD-02/03/05.

The draft correctly limits protected-host v1, then offers capturing Object or
Symbol operations “under the existing protected contract.” That existing
facility protects global Reflect and the exact Reflect.apply slot, and forwards
an already evaluated compiler-owned invocation. It does not establish the
provenance or integrity of Object.freeze, Object.defineProperty, Symbol or a
captured callable. The offered path therefore implies authority/guarantees
that the current contract does not provide.

Source authority: `docs/host-contract.md:3–20,35–49`. The final design must name
its actual intrinsic assumptions/mechanism and any separately scoped host
contract decision. It may not describe generic capture as already protected.

### RV-03 — Medium: L2's private bindings do not establish imported public selectivity

Location: protocol:45–58 and C2/C6 at :22,26; QD-03/04/05.

L2 permits static references to private case bindings. Those bindings are
reachable directly only within their defining module. A consumer importing
only the named Label facade cannot refer to another module's private lexical
bindings. Eliminating unused local cases in C2 therefore does not establish
selectivity through the qualified imported public interface exercised by C6.

The baseline implements named runtime imports/aliases
(`packages/lang/compiler.js:27–46`; native `binding.rs:335–379`), not an imported
private-case access mechanism. Freeze the real module boundaries, public and
any generated export/import wiring, and the exact applicability of each
retention claim before execution. Keep local-case removal distinct from
cross-module public-interface proof. This is not a request to choose or add an
export mechanism here.

### RV-04 — Medium: the producer and exact executable comparison remain unspecified

Location: protocol:28–34,36–64,85–92; QD-04/05.

The protocol names consumer families and layout sketches, then defers exact
source bytes, commands and oracles. It also asks to test Lykn-produced modules,
but the pinned compiler cannot produce the proposed qualified forms. The
pre-production gate precedes S03 layout selection, so a concrete account of
which authorized Lykn-authored producer emits each candidate is necessary.
Without it, prototype and integrated compiler claims can be conflated, or the
gate can accidentally depend on the implementation it is meant to select.

The final protocol must identify exact fixtures, producer/lowering path and
metadata inputs, tool/argv/permission details and expected observations, and
state what this prototype can establish versus S04's later integrated modules.
The 24 proposed unique cells and separate replay count are clear; they are not
operator agreement or executed proof. No execution is requested to resolve this
documentary and design dependency.

### RV-05 — Medium: ordinary runtime aliases and member access need worked boundaries

Location: contract:21–46,65–100; QD-01/02/03.

The import-alias and direct-shadow examples are useful, but do not disposition
local value aliases such as `(bind alias Label)`, detached case values, or
computed `(get Label key)` access versus statically resolved Label:Case.
“Use lexical binding kind” is insufficient by itself: current imports carry
ImportLocal markers, not declared-owner interfaces (`binding.rs:335–379`);
ordinary colon access remains a runtime operation. Missing-interface and
unknown-case diagnostics must not swallow valid imported host-object access.

Provide worked source outcomes for those alias/member boundaries and state
which uses retain ADT-specific static resolution and which remain ordinary
runtime operations. This must agree with the chosen metadata and mutation
contract. Surface namespace imports remain banned (`skills/lykn/SKILL.md:442`);
an escaping ADT namespace value is not permission for `import * as` syntax.

### RV-06 — Low: reset-path wording overstates current automatic isolation

Location: contract:108–110; QD-03.

The text says expander-core resets type state “on its path.” The actual reset
is in the explicit `resetMacros` API (`packages/lang/expander-core.js:653–656`).
Normal `expandWithMacroImports` (:2257–2290) does not call it. Meanwhile
`classifier.js:1503,1522` writes the shared typeRegistry. Describe the explicit
reset and ordinary compilation path accurately, retaining per-call isolation
as a requirement rather than implying it is already provided.

## Five-row disposition

| Row | Initial independent disposition |
| --- | --- |
| QD-01 | Open. Approved syntax is retained; runtime alias/member and legacy binding boundaries still need worked decisions (RV-01/05). |
| QD-02 | Open. Root must settle identity, prelude cross-unit compatibility, guard/strip, serialization and mutation/hygiene; RV-01/02/05 identify additional obligations. |
| QD-03 | Open. Baseline map is substantially grounded, but private/imported access, exact metadata API/wiring, compatibility and reset wording need reconciliation (RV-01/03/05/06). |
| QD-04 | Open. Proposed 24-cell count and zero-unused oracles are preserved; exact executable producers/fixtures and applicable public-interface proof are not yet concrete (RV-03/04). |
| QD-05 | Open. Increment ordering and existing API/docs/book/human owners are retained, but the contract/protocol dependencies above remain before implementation. |

The proposal correctly separates approved qualified construction/patterns from
unresolved representation choices, preserves ordinary member syntax and the
namespace-import ban, and keeps reader, guide/book, API audit, Project07 research
and human judgments with their existing owners. These strengths do not resolve
the six findings or close any QA/QD row. The next review must identify the
corrective assignment and exact revised candidate, preserve this initial verdict,
and assess root's actual PL dispositions separately from CC attestation.

## Iteration02 independent review — candidate 2e94b49f

**Verdict: not accepted; all five QD rows remain open for consolidation.**
Reviewed `2e94b49fd8f69ca948b08a77dbd10c9dbd79de6c` against
`cc-prompt-iteration02.md` at `8a95c7bae837e586d099fa92e8ac9ec1af4c7168`,
with iteration01's carried semantic decisions. Read both complete artifacts,
the entire iteration02 report/readback and the five current QD criteria.
The actual author is the same independently assigned Sol 6.1 High context.
Root retains PL decisions and the later arc-plan update.

Source remains clean at `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95` in the
assigned `codex/completion-value-flow` worktree. All source citations below
refer to that revision. This is source-backed design review only: no parser,
compiler, type checker, runtime, prototype or bundle execution. No specimen,
contract, protocol, ledger or source repair was authored by this reviewer.

### Retained history and architectural reconciliation

RV-01's compatibility obligations now have an explicit policy: baseline
Option/Result entries are metadata only, no runtime constructors/namespaces
are synthesized, local declarations are generative, and cross-unit APIs share
a real declared owner through imports/reexports. Structural-tag interoperability
and automatic flat constructor bindings change deliberately for 0.6. Box/Box
becomes qualified, same-scope namespace/function conflicts are diagnosed, and
ordinary short-name functions are not seized by ADT case names. This resolves
the earlier semantic ambiguity without inventing an implicit mandatory prelude.

RV-02's incorrect existing-host authority is corrected: Symbol/Object operations
require a separately reviewed bounded extension. The nominal representation,
mutable payload limits, safe raw-subject mismatch and reconstruction after
assoc/spread/JSON/clone are now explicit. The host and typed purity mechanisms
remain implementation prerequisites, not present source capabilities.

Root's iteration01 sidecar design had a real generativity error: separately
instantiated producer URLs could share cached static identity/case sidecars.
This reviewer missed that interaction when initially reading 811b944b. Root
identified it; the reviewer confirmed it and independently identified the
separate local-alias TDZ issue from the existing resolver/function emitter.
This is a preserved design/review miss, not a CC fault or model capability claim.
The current same-physical-producer ABI and actual-qualifier read remove those
identified architectural causes. No experiment has proved the new implementation.

RV-03 is addressed at the strategy level: L2 now uses actual same-producer named
case ABI exports/imports, with the same public exports as L1. RV-04 is partially
addressed by the common-frontend/two-candidate compiler production route and
explicit later freeze; its remaining executable-fixture/oracle gaps are below.
RV-05's local alias, detached/dynamic and ordinary-member distinctions and
qualifier evaluation are materially specified. RV-06's automatic-reset wording
is corrected. These dispositions preserve the original RV-01–06 findings and
initial verdict; they do not turn the current candidate into accepted work.

### RV-07 — Medium: worked function and reconstruction examples do not fit the preserved source rules

Locations: contract:93–99,109–112; protocol:62–70,122–132; QD-01/04/05.

`(func use (x) ...)` is not Lykn's typed parameter syntax. In the actual native
`classifier/forms.rs:1654–1722`, a non-keyword list does not introduce an args
list: the zero-argument shorthand retains it as a body expression. Thus `(x)`
is a body call, not a parameter binding. The example also defines use before
the Later alias, so its body does not have the required source-order OwnerRef
resolution. It cannot serve as the promised alias-TDZ example. The relevant
resolver sequence is `resolver.rs:186–203`; ordinary function declaration
emission is `emitter/forms.rs:3535–3544`.

C2's `(func text-arg () ...)` and C5's `(func effectfulKey () ...)` likewise
put an extra empty expression in the zero-argument shorthand body. This review
does not claim parser rejection or an observed runtime failure: no execution
occurred. The fixtures must use actual keyword args/body syntax or documented
zero-arg shorthand without the spurious list (`guide00:211–215,255–261`).

The reconstruction example has only a Text arm for the three-case Label and
no wildcard. The existing direct match analyzer reports uncovered variants as
errors (`analysis/match_check.rs:52–73`). It must not silently become a promise
that qualified syntax removes that check. Supply a complete reconstruction
example and an actual resolver-safe TDZ specimen: declare Label, invoke the
hoisted function before alias initialization, then bind the alias and define
the typed function after it so the body resolves the alias. Keep examples
unexecuted until the separate source-ready validation scope.

### RV-08 — High: C4 violates the owner-universe restriction and can miss tag-only dispatch

Locations: protocol:94–116; contract:149; QD-01/03/04/05.

Each C4 match mixes Left and Right constructor patterns. Existing native
`analysis/match_check.rs:98–140` rejects mixed constructor owners, with an
explicit regression at :489–516. Root's consolidation decision is to preserve
v1's single-owner-per-match restriction, not introduce a heterogeneous union
matcher. This fixture therefore cannot be the runtime proof as written.

Even ignoring that diagnostic, the correct-owner arm precedes the wrong-owner
arm. A broken implementation comparing only tag Text can return left/right
from the first arm and pass the expected output. Merely moving a wrong-owner
arm first would still violate the preserved static restriction.

Use separate positive matches and wrong-owner-only matches with wildcards in
each direction inside the same C4 consumer/cell. A tag-only implementation must
select the observable wrong-owner result while correct dispatch reaches its
fallback. The static Maranget/deconstructed-pattern universe and mixed-owner
diagnostics must migrate from short type-name strings to OwnerRefs/CaseRefs:
`analysis/pattern.rs:33–40` and `match_check.rs:110–145` currently use strings,
which would conflate equal-spelled Label declarations. This is a substantive
migration obligation in addition to runtime tag/brand emission.

### RV-09 — Medium: C5 promises observations inaccessible to its proposed harness

Location: protocol:118–135,170–180; QD-04.

The fixture does not export dynamicValue or emit its promised own-property/
brand/descriptor projection. No concrete observer source or observation API is
given. Importing the generated entry cannot read that closed local binding;
printing only the match result hello does not establish the promised actual
value/own properties, all escaped namespace members, frozen namespace or
readonly metadata. The harness promise is not an executable oracle yet.

`(exports Label)` itself is valid for an imported local: native
`classifier/forms.rs:222–233` explicitly includes ImportLocal. No export-rejection
finding is made. The correction needs a real observable value/export and a
concrete Lykn observer with exact results/invocations. Existing dynamic-import
support (`packages/lang/compiler.js:1071–1079`; guide00 Modules) permits a
Lykn observation route; it does not require handwritten JS or another bundle
cell. Distinguish observer runtime counts from the fixed 24 esbuild cells.

### RV-10 — Medium: the interface example does not define the promised concrete lookup/schema

Location: contract:38–78; QD-03.

The JSON names currentModuleId app/main, but includes only pkg/label with an
empty imports array. The text says imports maps actual source specifiers to
module IDs without defining that entry's shape or showing the current unit's
`./label.js` mapping. The example therefore does not determine how the adjacent
consumer import is looked up. Reexports are prose only, without a worked
renamed namespace/token/case ABI boundary. Field types are helpfully
OwnerRef-qualified, but the document remains an example rather than the
requested version-1 structural contract and validation errors.

Specify required/optional fields and entry shapes, exact current-unit/specifier
lookup, canonical definition/reference and export-map consistency rules, and
worked import-alias/reexport inputs with deterministic invalid-input outcomes.
Keep schema validation separate from real export verification, as the candidate
correctly does; trusted public interfaces do not make lookup rules unnecessary.
Do not invent runtime I/O or a metadata requirement for already lowered kernel
users to fill this gap. Existing moduleId/typeInterfaces defaults and synchronous
result/stage shapes are otherwise coherently stated.

### RV-11 — Medium: declaration sketch loses the precise case result types

Location: contract:124–143; QD-03.

Both zero-field ABI constants and the Text constructor return are declared as
the entire LabelValue union. Consequently a normal typed consumer of
`Label.Text("hello").value` does not know that value exists: two union members
lack it. A unit constant also loses its statically fixed tag/variant. This
contradicts iteration02's requirement to type unit/case exports precisely.

The shared-brand-key versus owner-token distinction is corrected, but each
case export/namespace member must have its actual variant result type, retaining
readonly tag/brand and mutable Text payload. Include a source/type consumer
oracle in the later API gate. No TypeScript execution or current DTS-emitter
repair was performed for this review.

### RV-12 — Low: canonical zero-field pattern grammar remains implicit

Locations: contract:9–20; protocol C3:79–92; QD-01.

The artifacts use `((Label:MissingField) ...)`, while the approved bare pattern
spelling is not explicitly retained or rejected. Declaration normalization of
`(Zero)` versus Zero does not specify pattern grammar. Existing native parsing
accepts bare uppercase zero patterns and zero-argument list patterns
(`classifier/forms.rs:2166–2175,2189–2207`); this is not evidence that the new
qualified grammar rejects the shown spelling.

State the bare canonical pattern and whether parenthesized zero-pattern syntax
is an accepted equivalent, including lowercase imported-owner aliases. Neither
form may be described as a zero-field constructor call. This is an ambiguity
to settle, not a reproduced parse error.

Also state the carried static arity rule for known qualified constructor calls
explicitly, distinct from patterns and from detached/dynamic ordinary calls.
The current wrong-arity sentence is attached to patterns, while :88 explicitly
waives a dynamic arity checker. That waiver must not silently remove the
specified compile-time direct-call diagnostic in stripped output.

### RV-13 — Medium: QD-04's stop/re-entry policy is missing from the revised protocol

Location: protocol:155–184; ledger QD-04 verification requirement.

The protocol retains pre-execution agreement/freeze and says a target miss
remains a miss, but no longer states what stops on invalid fixtures, compiler/
bundle/runtime or metafile failure, what continuation remains allowed, or how
a correction/retry is counted without overwriting a cell. This matters because
an expected L1 retention miss and an unexpected invalid program/observer are
different conditions; the former must not silently become the latter's waiver.

Restore a concrete stop/affected-continuation and re-entry rule, preserving
failed outputs, all planned/launched/unrun denominators, candidate identity and
separate retry receipts. Keep expected comparative layout misses distinct from
unexpected semantic/tool failures. This is the existing QD-04 stop-condition
obligation, not a new stimulus or expanded experiment.

### Current five-row disposition

| Row | Independent disposition at 2e94b49f |
| --- | --- |
| QD-01 | Open. Core owner/alias/member/scope decisions are substantially clearer; worked source forms, explicit zero-pattern grammar and preserved owner-universe rules still require correction (RV-07/08/12). |
| QD-02 | Open for consolidated disposition. The selected nominal, guard/strip, mutation, serialization and metadata-only prelude policies resolve the earlier semantic menu; host/purity mechanisms remain explicit later implementation prerequisites, not executed proof. No new fundamental runtime-identity contradiction was found in the same-module strategy. |
| QD-03 | Open. Real same-producer ABI and stage/default behavior are improvements; concrete interface lookup/schema, case-precise declarations and OwnerRef-based static universe migration remain (RV-08/10/11). |
| QD-04 | Open; not accepted. Count/tool templates and candidate production route are substantially supplied, but invalid/weak/inaccessible fixture oracles and missing stop/re-entry rules prevent a concrete executable protocol (RV-07/08/09/13). |
| QD-05 | Open. The seven-increment recommendation is coherent as a recommendation, but root must consolidate these corrections and update actual arc sequencing before dependent work. Reader, guide/book, API audit, repinned JSON and human obligations remain. |

No QD/QA ledger row is modified by this review. These findings and root's
explicit consolidation choices must enter the next preserved iteration; the
next independent pass must identify its actual candidate and affected claims.
The 24-cell population is still proposed, not operator agreement or experimental
success. This record accepts no product implementation or layout winner.
