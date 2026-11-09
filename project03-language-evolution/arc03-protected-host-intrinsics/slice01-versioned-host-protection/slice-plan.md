---
project: project03-language-evolution
arc: arc03-protected-host-intrinsics
slice: slice01-versioned-host-protection
status: blocked
planned-release: unassigned
depends-on: []
---

# S01 — versioned host contract and provable-write errors

## Iteration06 private if-let oracle clarification

The issued prompt's new private `Reflect` pattern example is a
zero-field constructor, per `classifier/forms.rs:1954–1980,2031–2048`.
The actual binding pair below supersedes only that new private test
input and oracle. The original host fixtures and all gates are unchanged.

- Source `(if-let (globalThis source) (++ globalThis) 0) (set! globalThis:Reflect:apply 0)`
  has one Reflect.apply diagnostic at the second form's original target.
  The then arm's local update leaves the global alias valid.
- Source `(if-let (globalThis source) 0 (++ globalThis)) (set! globalThis:Reflect:apply 0)`
  has no diagnostic. Else sees the real binding, so its update
  invalidates alias proof throughout the unit.

This is an in-scope authoring clarification under the current Operator
steering. It does not change the language, issue a new assignment or
consume another source refinement.

## Current Operator steering — standard Autonomous Mode

After iteration06 was issued, the Operator replaced the strict
first-failure stop with standard Autonomous Mode. The same Luna6 High
CC and separate Sol6.1 High CDC continue through S01 acceptance.
Resolve clear in-scope code, formatting, test setup and receipt issues
using sound engineering judgment without asking for another approval.
Pause only if there is no obvious sound solution or a genuinely
material unresolved design or evidence gap. This supersedes the
stop wording in the preserved issued prompt and earlier records.

The original v1 scope, exact behavioral fixtures/oracles, release
boundary, source freeze and independent review, durable prospective
launch receipts and named releases remain binding. Preserve actual
failed attempts and never weaken a gate to pass it. Refinement 04 of
5 remains the current assignment. Normal later refinement and closure
rules apply, with no reset and no expansion to S02 or release work.

## Consolidated correction04 authorized

The Operator authorizes all seven recorded static repairs and the
original S01 validation. [Iteration06](cc-prompt-iteration06.md)
is the active correction from clean `cabfc621`. Same Luna6 High CC
and Sol6.1 High CDC, Autonomous Mode and first-further-substantive-
failure/real-gap stop. This dispatch is source refinement 04 of 5.
Original frozen tests, prospective releases and independent review
remain binding. Earlier unissued preflight holds remain history.

## Consolidated correction04 held before dispatch

The Operator authorized all six recorded corrections. Preflight found
a distinct computed-key collision in the public proof.
[Verdict](cdc-verification.md#consolidated-correction04-held-on-exact-path-identity--2026-11-09).
No prompt issued or source work began. Refinement 03 of 5 remains spent
and all HC rows and gates remain open.

## Approved correction04 held before assignment

The Operator approved the four original static corrections with the
same models, Autonomous Mode and first-substantive-failure stop.
[Preflight](cdc-verification.md#correction04-held-at-preflight--2026-11-09)
found two further scope defects on unchanged `cabfc621`. No prompt
was issued and CC received no assignment. Refinement 04 was unexecuted
and 03 of 5 remains spent. All HC rows and original gates remain open.

## V1 production held after static review

The frozen `cabfc621` implementation stopped on four source-derived
contract mismatches before any validation execution.
[Verdict and held correction](cdc-verification.md#v1-production-candidate-stopped-at-static-review--2026-11-09).
No HC row closes. Source refinement remains 03 of 5. The original
pre-policy baseline at `5a2e569` and its raw evidence remain accepted.

## Authorized v1 implementation

The Operator authorizes v1 source protection and typed dist diagnostics,
then separate independent validation. [Iteration05](cc-prompt-iteration05.md)
is the active production assignment from clean `5a2e569`, with Luna6
High CC and Sol6.1 High CDC in Autonomous Mode. Stop on the first
unexpected substantive failure or real evidence gap. This is the
original planned implementation, with source refinement 03 of 5 spent.
The earlier baseline and all evidence limitations stay in history.
CDC owns planning and prospective gate release. CC receives exclusive
source/index/build/raw ownership after intake and returns it before
independent validation. Release `62e9531e` remains read-only.

Readiness at `5a2e569`: the assignment pins the actual whole-unit
source and kernel boundaries, the existing typed dist error, and the
sole macro-time compiler call. The approved scoped behavior and
domain rules are applied in the recipe. The frozen native/public
oracles, separate dormant compile-only regression, exact prospective
gates and artifact preservation define independent acceptance. No
open API or behavior decision is delegated to implementation.

## Bounded baseline return accepted

The original pre-policy baseline was independently reproduced at local
composite `5a2e569` after the accepted numeric prerequisite and exact
composition. [Verification](cdc-verification.md#original-pre-policy-baseline-independently-reproduced).
All six HC rows remain open. V1 and typed dist source implementation
require separate continuation authority. Source refinement stays 03 of 5.

## Accepted W8 prerequisite, composition pending

The numeric-only repair at `46ca1c04` passed separate CC and CDC gates
under [iteration04](cc-prompt-iteration04.md).
[Independent proof](cdc-verification.md#w8-numeric-prerequisite-accepted-independently).
The exact local composition into `a7153649` and the original pre-policy
baseline remain the authorized endpoint. Source refinement stays 03 of 5.
No protected-host implementation or release update is in this increment.

## Authorized W8 gate continuation

Operator approves [iteration04](cc-prompt-iteration04.md) from the stopped
planning record at `f1719d2` and frozen prerequisite `17d7018`. Same
Luna6 High CC and Sol6.1 High CDC in Autonomous Mode with the same stop
rule. This continues refinement 03 of 5. Before each validation invocation,
CDC must read the exact prospective named-file checks and durable launch
receipt, then explicitly release that invocation. The prior red remains
preserved and production still follows the original gated endpoint.

## Latest stop — W8 prerequisite launch evidence

The exact tests-only `17d7018` prerequisite reproduced two expected
numeric macro failures. Required prospective named-file checks and saved
command/environment readback were absent, so work stopped before
production, composition or resumed Arc03 baseline.
[Review and next bounded gate](cdc-verification.md#w8-repair-prerequisite-stopped-before-production).
Source refinement 03 of 5 is spent. All HC rows stay open.

## Authorized W8 repair and baseline continuation

Operator authorizes the bounded public W8 repair, independent validation,
and original baseline. [Iteration03](cc-prompt-iteration03.md) is source
refinement 03 of 5. Same Luna6 High CC and Sol6.1 High CDC in Autonomous
Mode, stop at the next unexpected substantive failure or real gap. Keep
the prerequisite on a local branch from accepted `f2cd8139` for full
checks, then compose into preserved `a7153649` after independent acceptance.
All six HC rows and later v1/dist gates stay open.

## Latest stop — public W8

Native correction02 is frozen at `a7153649`. Its 15 predicate controls
and all 29 legacy native routes reached the expected observations.
Native legal4 passed and old dist overwrote both artifacts. Public baseline
produced eight expected write-case modules and stopped on an unrelated
W8 expansion error. Public legal4 passed. See [exact reconciliation](cdc-verification.md#correction02-public-baseline-stop).
All six HC rows remain open, source 02 of 5 spent. Independent replay and
production v1/dist continuation are held.

## Authorized native oracle correction and baseline

Operator authorizes [iteration02](cc-prompt-iteration02.md) on the exact
`8443fde` composite. Same Luna6 High CC and Sol6.1 High CDC in Autonomous
Mode. Stop on the next unexpected substantive failure or real evidence gap.
This is source refinement 02 of 5. Scope is the single native test file and
independent reconciliation of the original baseline. All six HC rows remain
open. The production v1 and typed dist adapter remain separate.

## Current local composition status — 2026-11-08

Exact macro prerequisite `f2cd8139` and the Arc03 tests-only tip
`e2f2959` compose at clean `8443fdeda07139cdc2c333e03f210ac471454249`
on `codex/protected-host-contract`. The
[independent Git proof](../../arc02-ad-hoc-maintenance/slice02-embedded-macro-dependency-resolution/cdc-verification.md#independent-local-composition-acceptance--2026-11-08)
accepts both parents and the exact union. Original red baseline evidence
and all six HC rows retain their disposition. Source refinement 01 of 5
is spent. Native-oracle correction02 and v1 source continuation remain
separate from the local composition authority.

Reviewed design2026-11-08: [actual review/disposition](../../arc02-ad-hoc-maintenance/slice02-embedded-macro-dependency-resolution/artifacts/design-review.md)
now supplies concrete prerequisite and native-oracle/dist re-entry proposal.
No implementation/correction02/source composition authorized in this design
endpoint; original01/5/all6HC/PHI/CV and stopped evidence remain unchanged.

## Current DESIGN-only re-entry — 2026-11-08

Operator authorizes reviewed design, NOT source continuation, after latest STOP.
Generic macro runtime prerequisite is planned in
[Arc02 S02](../../arc02-ad-hoc-maintenance/slice02-embedded-macro-dependency-resolution/slice-plan.md)
on accepted62e so intentionally-red e2f tests do not poison its full gates.
Native exact v1 diagnostic/phase/effect oracles and REQUIRED narrow dist.rs
classifier→Language adapter addition stay owned by this S01, in the linked
[design](../../arc02-ad-hoc-maintenance/slice02-embedded-macro-dependency-resolution/artifacts/repair-and-oracle-design.md).
This justifies a proposed future16th source path, not a quiet current allowlist
change. All6HC/PHI/CV remain open, source01/5 spent, no correction02 issued.
Candidate composition/re-entry needs explicit future approval, no release merge.

## Latest baseline STOP — 2026-11-08

Correction01 e2f is statically verified, but the first native baseline stopped
original continuation: no-run0, native1pass2fail/exit101, all29 invalid-route
observations =26 old-success +3 W8 macro dependency-resolution errors. Legal
native4/4 passed; typed dist old-success/overwrite red observed. Public0/13,
no implementation/full gates. See current [report](closing-report.md),
[review](cdc-verification.md) and [retrospective](cdc-retrospective.md).
Native generic-nonzero rejection is a DISTINCT oracle gap: unrelated W8 errors
are not v1 policy verification. CDC owns renewed readiness/scope for existing
declared macro dependency resolution and discriminating policy oracles; no
new correction/probe/production edit authorized. Refinement01/5 spent, all6HC/
PHI/CV OPEN. Root directed read-only reconciliation, no independent replay.
Actual CC source/index/build/raw ownership fully returned; release62e unchanged.

## Correction01 resumption authority — 2026-11-08 (preserved)

Operator explicitly approved the proposed phase-path-only test correction and
resumed original Arc03 endpoint (“yup, let's do that — proceed!”). Current
assignment [cc-prompt-iteration01.md](cc-prompt-iteration01.md), refinement01/5
authorized (four remain), same Luna6 High CC/separate Sol6.1 High CDC. Reuse the
coherent initial CC after renewed intake/ownership; correction freeze/static
release precedes the still-unrun original baseline. ANY further unexpected
substantive failure/REAL gap STOPS. All6HC/all6PHI stay open; no prior result is
upgraded. Existing initial stopped records below remain historical evidence.

## Initial-attempt STOP — 2026-11-08 (preserved)

Tests-only871f failed separate CDC static review: same legal case receipt path
is created both before and after the child with createNew. No build/no-run/test/
runtime was launched; no production policy/docs authored. All6HC/all6PHI remain
open; see [report](closing-report.md), [review](cdc-verification.md), and
[retrospective](cdc-retrospective.md). Source refinement0/5, initial attempt
stopped, next correction01 NOT issued/authorized. Proposed precise re-entry is
distinct before/after paths retaining createNew and both observations, followed
by original gates. No automatic continuation despite unused allowance.

## Authority/readiness — 2026-11-08

Operator authorizes named Arc03 plan→implementation/independent close, same
fresh Luna6 High CC/separate Sol6.1 High CDC, Autonomous Mode, ANY substantive
failure/REAL gap STOP. This is the first useful source delivery, not an inventory
exercise. S01 refinement0/5; strict stop is narrower. Old S04/source/tooling8/K0
allowances unchanged. Source baseline clean62e/tree6721237 in existing task
checkout; planned branch codex/protected-host-contract preserves accepted refs.
Release62e read-only, no integration/push/deps/new runtime/public AST migration.

CDC owns planning/design/review until explicit intake/handoff. CC source + raw
only on named paths; no prose/ledger edits. All generated evidence under this
slice artifacts/evidence/cc and ignored task target/arc03-s01; separate CDC
roots/acceptance after clean return. Actual source freezes BEFORE checks; fixed
-F body supplied before first commit/raw %B after, no history rewrite/bypass.

## Delivered behavior and exact engineering recipe

Ship docs/host-contract.md as the ONE normative v1 source, small catalog
IntrinsicId::ReflectApply + real global Reflect binding / Reflect.apply slots.
Reads/local/import/macro binding shadows and application own.call/.apply legal.
Protected-source write diagnostics are stable even if dead/unreferenced or
removed by strip-assertions. This is stronger source policy, not a universal
host security sandbox. v1 governs expanded runtime program; compiler-extension/
foreignJS execution is host-precondition territory, not a new macro sandbox.

Native: new private protected_host.rs shared catalog + scoped root proof,
exhaustive Source/Kernel dialect adapters. Reuse binding::bindings_introduced/
binding_names_in_pattern for WHAT binds and codegen::names::to_js_identifier
for emitted names; never treat NameRes::Unresolved on Reflect:apply as proof.
Normalized source names (Reflect!) and member identifier segments matter;
computed string keys retain literal spelling. Import/property/label namespaces
are not generic value bindings. Do not put every class method parameter in
every member's scope. Quote/data skipped; executable values/defaults/bodies
are visited with their real scopes, including deferred function bodies.

Proof type is GlobalKnown(path) / Local / Unknown, not a raw string predicate.
Module/block/function/param/body/loop/catch/switch scopes collect lexical names
before visiting to respect TDZ; var/function versus lexical binding regions
remain distinct. Source function/func/fn clauses, class-method params and
destructuring reuse actual binding grammar. Unknown scope cannot be guessed
global or used for a source error. Required finite scope controls below are
binding; no universal coverage claim from them.

Two whole-unit native boundaries:
1. classify_with_options: keep existing classification errors first, then
   validate the ORIGINAL post-macro forms before assertion removal, in Source
   dialect (Kernel if opts.kernel_only). Not classify_expr recursion. Thus
   normal compile/build/dist AND check's existing classifier stage gain this
   policy; check does NOT gain all other compile passes. Five existing compile
   validation-group priorities remain unchanged.
2. Completed emitter::emit kernel vector before Ok/emit_json, and
   codegen::emit_module_js before writing: shared Kernel-dialect consistency
   check for full units/raw backend entry. Never per recursive emit_form or
   emit_expr. Programmatically preprocessed/stripped typed IR cannot prove
   unseen removed source; document its validated-source precondition. Existing
   S02 checked lowering Result/first-fatal/state restoration remains untouched.

Source dialect: real set!, set-symbol!, assign in class, update/compound write
operators and explicit kernel:<write> escapes are writes. Surface '=' is
equality, NOT assignment. Kernel dialect '=' is assignment; target get/member/
destructuring leaves are write locations. Reads/ordinary bound-call heads are
not writes. Existing kernel '=' reclassification concern is an unvalidated
separate source lead, NOT repaired or used as native runtime evidence here.

globalThis alias proof: initially canonical host alias, invalidated for the
ENTIRE unit by any identifiable real globalThis binding/globalThis.globalThis
replacement/update/destructuring write anywhere, even nested/conditional.
Lexical/normalized shadow writes do not invalidate. Do not ban replacement
itself; after invalidation skip globalThis.Reflect proofs, still protect bare
real Reflect. This intentionally loses some detections, including before an
unexecuted possible write; dynamic/reflection/foreign mutations are explicit
limits. No flow-sensitive or universal alias theorem.

PublicJS: new pure compiler-only protected-host.js with version/catalog and
whole-kernel scope proof. Receive toJsIdentifier/formHead callbacks from
compiler.js to avoid a new circular import; binding.js is the binder authority.
compile(exprs) validates WHOLE expanded/kernel unit before generating. Do not
validate each compileExpr with no enclosing locals. Public expand is a
transformation, not a complete source-policy validator. JS expansion retains
pre/post checks (no strip path); validation before optimization sees them.
Canonical/embedded compiler.js + protected-host.js byte-identical; fresh owned
XDG materialization verifies the new embedded module, fixed existing DENO_DIR.

Diagnostics identify host-contract v1 + normalized protected slot, original
target span where retained; macro/synthetic missing locations honest. Native
source errors use existing Diagnostic/Classify channel, kernel consistency
existing Codegen error; JS throws Error with same policy identity. No strings
grep, catch-all panic/error suppression, source fallback or new public AST/API.

## Baseline/regression population (freeze actual tests first)

Nine invalid runtime-program inputs, NEVER execute their generated output:

| ID | Exact source |
| --- | --- |
| W1 | `(set! Reflect:apply 0)` |
| W2 | `(set-symbol! Reflect "apply" 0)` |
| W3 | `(++ Reflect)` |
| W4 | `(set! globalThis:Reflect 0)` |
| W5 | `(set! globalThis:Reflect:apply 0)` |
| W6 | `(++ Reflect:apply)` |
| W7 | `(kernel:delete Reflect:apply)` |
| W8 | ``(macro stomp () `(set! Reflect:apply 0)) (stomp)`` |
| W9 | `(func guarded :args () :returns :number :pre (do (set! Reflect:apply 0) true) :body 1)` |

Existing-API TDD first: new CLI test target has THREE tests: capture all9×
check/stdout-compile/-o-existing outputs before aggregate desired rejection
assertions; plus W1 missing-output and W9 strip-enabled compile (29 invalid
route observations total); one distinct dist preservation test; four strict
legal runtimes in a separate test so expected red cannot skip them. Old62e
prediction: 1pass/2fail selected tests, invalid routes succeed/emit writes,
valid4 pass. These baseline reds are expected prerequisites, not new stops.
Public test one parent uses independent t.steps for all9 bad + valid4, continues
all steps; old invalid cases return JS, desired throws assertions fail, valid4
pass. No new Result/private tests that cannot compile against old source.

Legal runtime sources: V1 JSON.stringify(typeof Reflect:apply) => `"function"`;
V2 typed func local params Reflect/globalThis mutate their application objects
to7/8 and return `[7,8]`; V3 param Reflect! writes Reflect!:apply9 => `9`;
V4 application action fn's own call is replaced by fn returning99, then
action:call1 => `99`. All JSON+LF/exit0/empty runtime stderr, implicit final
values only. Exact source bodies supplied in prompt before authoring.

Implementation freeze adds private unit tests for imports/aliases, block TDZ,
class/method/loop/catch/pattern/name namespaces, quoted data/strings, surface
equality vs raw-kernel assignment, normalized roots/keys and full-unit alias
invalidation (including nested writes/destructuring). Use actual existing
binding fixture grammar, no invented public accessor. Native direct parsed
W1 target span must match Diagnostic span; unknown macro span not invented.

Dist fixture follows accepted emission_failures.rs layout/API: package name
@fixture/emission, actual build/emission/mod.js, source named exported typed
answer plus W1 so real DTS is expected on old success. Sentinel JS/DTS get
deterministically epoch-old FileTimes; prove source newer/needs_compile and
retain before/after/result. Desired typed failure + path/no overwrites; old
success overwrites. This is per-failing-file, not package transaction promise.

## Gates, quality and ownership

Read corrected test source before first launch. Freeze tests/Git/body/predictions
then no-run needed targets, pin actual after-last-build debug/test/Deno and run
direct baseline. After production freeze/focused green, full normal unfiltered
Make/cites and current post-build runtime/module/protection controls, mirror/
fresh materialization. Fresh TMPDIR/XDG/npm, fixed DENO_DIR and exact Deno2.9.6;
no global Cargo overrides. Durable actual argv/cwd/env/paths before launches,
full raw/status/complete modules before assertions; optional test receipt env
must not disable assertions when unset. No shell chains masking failures.

CDC independently reviews source/scopes/generated modules and replays focused/
runtime/full normal/citations from fresh roots after exclusive ownership return.
Any unexpected substantive failure stops, no quiet corrective edit or other
compiler repair. S01 full normative docs/guide/LLM references land with source;
book/API/human impact remains exact S07/S08-owned, not falsely updated here.
S02 private invocation/optimized proof and S04 source completion remain separate.

Allowed source paths are exactly those in cc-prompt; no generalized framework,
scope fixer in resolver/emitter/forms behavior, JS native-eval harness, deps or
K/tool changes. Authored research logic Lykn only; no Python exception, Node/
Ruby/Fennel/jq/handwritten researchJS/shell-logic substitutes. Product Rust/JS
and their tests are explicitly allowed. Source commits exact paths/provided -F
body/readback; CC raw only, CDC canonical prose/index after handoff.

## Assignment history

- 2026-11-09 additive Operator steering to active iteration06.
  Standard Autonomous Mode replaces the earlier stop condition.
  Issued prompt remains unchanged. Current authority is above.

- 2026-11-09 [iteration06](cc-prompt-iteration06.md), predecessor
  [iteration05](cc-prompt-iteration05.md). Active consolidated
  refinement04 for the seven source findings at cabfc621. Review and
  any execution follow actual intake and immutable freeze.

- 2026-11-08 iteration01 baseline return: one no-run0 and one direct native
  launch at e2f; unexpected W8 dependency phase triggered STOP before public/
  production. Existing raw copied byte-identically to artifacts/evidence/cc/
  baseline-e2f2959, original task data preserved. No further prompt issued.
- 2026-11-08 iteration01 actual intake/handoff: same Luna actor reread immutable
  planning 63723f4, plan/ledger/stopped records and supplied-F; CDC renewed source/
  index/build/raw ownership. Exact correction freeze e2f29597 followed by separate
  CDC whole-public-file/diff/raw-body review, known writer issue statically
  resolved; ORIGINAL baseline stage released only after this review record
  commits. No behavioral launch/result claimed here, no production-stage release.
- 2026-11-08 iteration01, predecessor cc-prompt.md: explicit renewed Operator
  approval for same source branch871f, phase-specific before/after receipt
  filenames only. New prompt/F supplied before renewed intake/handoff; actual
  execution/acceptance pending. This is refinement01, not a fresh source budget.
- 2026-11-08 initial return: CC froze tests-only
  `871f0a3b5d444213fb59e7f25dab8f9a95fa0893`, CDC read both complete files and
  issued STOP before baseline release on the receipt collision. CC confirmed no
  further edits/builds/launches. Root separately confirmed the static source.
  Actual source capability remains undelivered; all original rows/limits stay.
- Initial cc-prompt.md, issued2026-11-08 with this preparation: fresh Luna6 High
  intake then explicit source/index/build/raw ownership. Source starts only after
  readback/static baseline-test release. Actual actor/commit reported at dispatch.
  No source executed during preparation; planned implementation is not a
  refinement. Source0/5 and all original allowances remain.
- 2026-11-08 actual issue: preparation commit
  `3ada8c4e74fc66e152bfac31dbbdc3ba62fe6a89`; fresh fork-none actor
  `/root/cdc/protected_host_s01_luna_cc` (gpt-6-luna High) completed the required
  source/guide and supplied-F readback. CDC explicitly handed source/index/build/
  raw ownership after intake. Initial tests are being authored on the dedicated
  branch; immutable test freeze and separate CDC static release remain required
  before any baseline build/runtime. This records active assignment, not a gate
  result or source acceptance. CDC retains planning/index ownership.

CDC author readiness: exact classifier/module APIs, Source/Kernel prefix
semantics, member normalization, binding/import shapes, macro syntax, accepted
dist path/FileTimes and native/public receipt APIs were inspected at62e. Bare
Reflect update and property writes are supported forms; no kernel '=' execution
claim. Pre-strip and whole-unit placement is explicit, initial sources/oracles
use old APIs and phase-type tests wait implementation. Critical old behavior is
PREDICTED, not preclaimed measured; unexpected observation stops. Root read-only
review found no blocker. No remaining policy decision is delegated to CC.
