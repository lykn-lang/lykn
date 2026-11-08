---
project: project03-language-evolution
arc: arc03-protected-host-intrinsics
slice: slice01-versioned-host-protection
status: in-progress
planned-release: unassigned
depends-on: []
---

# S01 — versioned host contract and provable-write errors

## Current resumed authority — 2026-11-08

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
