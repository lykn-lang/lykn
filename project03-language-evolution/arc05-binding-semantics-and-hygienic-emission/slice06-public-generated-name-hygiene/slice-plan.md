---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice06-public-generated-name-hygiene
status: active
version: "1.1"
depends-on: [slice03-public-binding-discards, slice05-native-generated-name-hygiene]
---

# Public compiler-generated name hygiene

Current2026-11-14: candidate17791f24/tree792fd424 is independently
[HELD](cdc-verification.md#source-first-review-01--hold) for F1–F5 and the
consolidated original proof gaps. CC's42/full1586/docs482/M678/15 pass does
not supersede actual Source captures. Correction01 is prepared in exactly
identifier.js, its tracked mirror and public-generated-names.test.js; original
fifteen-path/eight-row/eight-group scope stays. Root owns source/build during
preparation; 1/5 refinements only upon committed dispatch. Release stays82.

2026-11-14: operator authorizes release82 FF/validation/review, then S06 if
green. RI-01–03 independently ACCEPT the clean release82 baseline. Root now
prepared this open set. Separate [source readiness PASS](artifacts/cdc/readiness.md)
accepts the final preissue recipe and concrete proof packet; root's committed
issue and explicit dispatch transfer task source/build to fresh Luna CC. Five
formal refinements maximum,0 spent. All eight PN criteria remain open.

## Preflight, useful delivery and authority

Task source: /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
codex/qualified-adt-core, clean82f1b65b92529979afd6c624183912ca31453927/tree
4bb6bfc9e171bc6424548b0f740dd32f0cf98c75. Release/0.6.x in its existing
0.6.x worktree is independently validated at the same pin/tree; later task
commits must NOT be merged into it without new authority. Canonical planning
is the separate orphan planning worktree, preparation9115695b.

Roles: fresh OpenAI gpt-6-luna/high CC after readiness; separate fresh
gpt-6.1-sol/high CDC arc05_s06_cdc; root owns design/planning/index/status and
serial source/build handoffs. Fresh bounded contexts fit the different public
producer/lifecycle packet instead of extending S05's completed context. Root
coordinator backend is not independently reported. User selection persists.
Autonomous Mode endpoint is independent S06 task-branch close, retrospective
and parent routing. No S07, further integration/push/hosted CI/tag/publication,
book/library trial, new dependency or licence choice follows.

Deliver usable static generated-name protection through normal public Source,
supported fragment/direct builders, raw late compiler consumers, staged browser
and materialized packages. Preserve legacy macro/gensym behavior and exact
private node capabilities. Source-binding renaming/protected-root selection
remain S07/S08/LI-04; no general hygienic-macro system is selected.

## Actual source and producer census

All citations refer to the named task source/pin82 above. Source-backed lookup
and root direct reads identify:

- expander-core.js41–72 legacy gensym/reset;744–752 environment;856–864 existing
  occurrence cloning;1247–1288 completion occupancy/finalization;1865–1881
  public fragment;2450–2550 whole-unit passes. Helper objects1833/2061/2086
  and Match adapters1291/1303/1358 must all carry one owned allocator.
- classifier.js493–812 h.gensym Dissoc/SomeThread/IfLet/WhenLet and dispatch;
  FREE imported gensym in exported Single830/Multi989/Genfunc1277/Match1379/
  statement Match1495/instrumentYields1665. One-clause delegation992, yield
  recursion1672/1694 and generator callers792/1342 must propagate it too.
- surface-helpers.js267/279/556/611 already uses private identity atoms for
  discards/rest/pattern caches. Do not replace these or change rest labels.
- compiler.js31 intrinsic aliases,195–258 already-emitted ICU identifiers,
  1816–1878 actual atom mapping. Existing closed carrier1769–1786 uses only its
  fixed getter parameter; the source expression is outside its enclosure.
- host-invocation-kernel.js source census43–54 and host-invocation.js ESTree
  census78/helper86–87. Preserve exact anchors/WeakMaps/provisional calls,
  finally cleanup, support strategy and existing nested-plan rejection.
- identifier.js is the existing pure shared normalization module. No new
  module or runtime dependency is needed. Existing mod/JSR exports stay intact.

Direct compatibility: Not's emitSurfaceForm h may contain only sym/array
(dd-37-classifier-pilot27). Existing direct Multi tests400–433 supply custom
h.gensym for rejection and call supported sole-clause builders without options.
No existing direct Single/Genfunc/instrumenter test was found; add actual cases.

## A. Binding lifecycle and early-allocation contract

Retain exported gensym(prefix)/resetGensym signatures and shared legacy counter.
Do NOT reset that counter automatically per compilation or create a global
active namespace/unit. Failure never rolls it back. Add a safe-integer exhaustion
guard before using a counter value; ordinary behavior and reset determinism stay.
Macro APIs still capture the legacy function (expander242/502, Deno companion535).

Create an owned allocation factory in identifier.js, accepting a raw fresh-atom
callback and closing over a Set of physical keys. Recommended interface:
`createGeneratedNameAllocator(nextRawName) -> { reserveSyntax, next }`.
Methods close over state, never rely on a receiver when passed as callbacks.
next(prefix) requests the existing raw candidate, checks/inserts its physical
key and skips occupied candidates while returning the original atom object.
Require atom/string callback output; detect a repeated raw rejected candidate
and throw an Error instead of spinning on a non-advancing injected callback.
No arbitrary small retry cap; the default legacy source remains monotonic.

reserveSyntax borrows ordinary SExpr/array/Surface containers with a visited
WeakSet per traversal, never clones or mutates syntax. Do not retain a visited
set across macro barriers: a mutable container may have acquired new children.
Atom strings and reconstructed static
name/key strings are occupancy only; literal String/Keyword/Number/Boolean/null
nodes and location/binding metadata are not executable name inputs. Traversal
must reach every current Surface field, typed/default/nested argument leaf and
later sibling. It declares no source binding or aliases.

Canonical entry creates one allocator and seeds complete owned source BEFORE
first helper allocation, preserving pass order. Seed actual imported/expanded
input at its existing barriers, without invoking macros to discover names.
pass2 receives the prepared allocator; createExpansionEnvironment/extendEnv
carry that same object to all lexical children/helper objects/Match adapters.
Public expandExpr creates its own allocator seeded from its one owned form.
At each real user macro result, reserve the NEW output before dependent lowering;
do not replay callbacks or recursively rescan the complete tree at every node.
Debug one-step macro expansion preserves its existing separate semantics.

emitSurfaceForm obtains the prepared allocator from an additive optional
`h.generatedNames`, else creates a one-form allocator using h.gensym if supplied
or the legacy default. Missing unused helpers still work for Not. If a prepared
allocator is supplied, reuse it without rescanning already-seeded subtrees.
Add optional final `{ generatedNames } = {}` to exported Single/Multi/Genfunc/
instrumentYields; Match's existing options gain the same field. Standalone
builders seed their COMPLETE actual inputs when no prepared state is supplied.
Pass that state through all dispatch/delegation/recursive edges above; no free
gensym production path may bypass it. Keep parser/signature validation order,
source names, checks, effects and diagnostics unchanged. Namespace bookkeeping
must not evaluate defaults, guards or macros.

Standalone direct-builder proof uses ordinary source names. It does not promise
that raw compile finalizes already-created private discard/rest atoms; that
existing unfinished-private boundary remains explicit. Full public Source and
supported expandExpr own their private finalization. Do not extend this slice
to repair a new pre-entry private-atom transport lifecycle. An accepted candidate
is already inserted by next(); local reservation loops must not reject it merely
because it is now present in that same allocator's occupied set.

This protects statically present owned names and newly exposed names before
dependent producers. Opaque future macro-produced strings/names, arbitrary eval
and whole-program hygienic macros are not promised; there is no retroactive
source renaming/replay. Fragment callers cannot know future sibling input;
use the whole-unit entry. Global counter advancement remains observable; byte
determinism is after explicit reset with the same inputs, not a new per-call API.

## B. Physical keys shared by early and late consumers

Reuse the actual compiler's per-segment mapping through a pure shared helper
in identifier.js: normalized member parts include name/private-member flags.
compiler.js's atom case uses those same parts AFTER its unchanged colon checks.
A non-throwing sourceAtomText/collector uses the parts without imposing syntax
validation during occupancy scans. Do not generate AST with a new parser/astring
dependency or call compileExpr on quoted/structural atoms merely to scan them.
Preserve whole-normalized and colon-segment legacy occupancy as well.

Decode static fixed-u4/braced Unicode escapes before conservative identifier-run
extraction: ASCII alphanumeric/_/$ and non-ASCII non-whitespace, FEFF separator.
Handle adjacent fixed surrogate pairs, reject malformed/out-of-range encodings
as ordinary text, make checked progress and stop braced parsing incrementally.
No suffix-wide repeated search or decoded re-normalization. Reuse decoder for
raw generated candidate keys and already-emitted ESTree Identifier text; the
latter MUST NOT pass through toJsIdentifier a second time.

Route all consumers: owned early allocator; classifier reserveNodeNames and
candidate membership; completion emittedNames/finalizer including private-marker
skip/group identity; compiler lowerHostReferences; ICU reserve/allocate; expanded
invocation source names; lazy invocation ESTree names. Preserve visits/addresses/
private capabilities and every allocation suffix scheme. Add checked exhaustion
to affected finite local loops, not new global state. Do NOT change lazy
patternNames/module Reflect-binding selection or protected-host policy.

Closed carrier __lykn_value_box and invocation support fn/receiver/argv stay
unchanged: no source expression is evaluated inside those fixed helper scopes.
Prove their real carrier/ordered-call value/effect behavior, without inventing
a capture. Retain public checked-only API: no public assertion-stripping option.
Raw compile/compileExpr do not acquire Source binding resolution guarantees.

## Exact product scope and delivery

### Correction01 clarifications from actual source

The five fixes and eight-group proof-gap table in cdc-verification.md are
binding initial-scope completion. No original proof obligation is dropped.
The initial blanket keyword/literal statement above means DATA roles: raw
threading heads ->/->>/some->/some->> and Surface Thread/SomeThread scalar or
keyword-headed steps reconstruct executable member atom text. Reserve that
text during COMPLETE owning-input seeding, before any enclosing typed result
producer. Do not wait until the threading producer has already allocated.
Other literal/data keywords and strings stay excluded; no lexical binding or
macro authority is inferred. A conservative raw syntactic-head census is
occupancy only, including when the source head will later resolve differently.

After atom/literal handling, Surface value fields are executable containers,
not metadata. Traverse real Reset/SetProp/SetSymbol/Cell and Assoc/Obj pair.value;
keys/names/fieldNames arrays reserve string entries AND visit object entries
(actual Exports.names contains atom nodes). Keep traversal-local visits and
existing compiler-private skip callbacks, not generic cloning.

Source physical keys must normalize actual shared member parts FIRST, then
decode/extract emitted keys. A private sourceAtomText helper may join normalized
parts using dot/private syntax; it need not add an export. Preserve legacy
whole-normalized and colon-part occupancy by routing their NORMALIZED text
through emittedIdentifierKeys. Never normalize decoded/already-emitted text
again. The current decode-first source implementation is not compatibility to
preserve; it was introduced only by this unaccepted candidate.

Decoder braced scan examines at most six hex digits and the immediate closing
brace, stops incrementally on invalid/overlong/unterminated text and advances
without suffix-wide indexOf/find/slice. Rejected raw callback names use a local
Set for the current next() call, not just one preceding name. No arbitrary cap.
Keep all five existing new module exports, generatedNames options and package
entrypoint boundary; accurate API audit is required.

Counter-controlled tests isolate EACH collision fixture with explicit reset;
lifecycle/reentry tests deliberately call the raw APIs without auto-reset helpers.
Actual runtime/static field and Unicode oppositions replace vacuous nonempty-
set/head/string-presence claims. Existing source/runtime/protocol tests may
preserve unchanged behavior with an applicability map; they do not substitute
for newly changed mapping/counter/caller proofs. The original eight-group/M678
population remains. Correction edits only the three named product files.

Nine logical product paths plus six tracked byte-identical delivery mirrors,
fifteen committed paths only:
1. packages/lang/identifier.js
2. packages/lang/compiler.js
3. packages/lang/expander-core.js
4. packages/lang/classifier.js
5. packages/lang/host-invocation-kernel.js
6. packages/lang/host-invocation.js
7. test/forms/public-generated-names.test.js (new product test)
8. crates/lykn-cli/tests/macro_dependencies.rs (membership/count only)
9. docs/guides/06-functions-closures.md (extend existing helper/API boundary)

10–15. crates/lykn-lang/embedded/packages/lang/{identifier.js,compiler.js,
expander-core.js,classifier.js,host-invocation-kernel.js,host-invocation.js}.
These are existing tracked ordinary files, not a build-generated symlink.
Copy the six changed canonical package files byte-for-byte before building.
fresh-artifacts does not synchronize them. No divergent embedded implementation.

No native compiler logic change, AST/reader/resolver/host-policy/DTS/schema,
dependency/lock/package entrypoint change or new shared module. Existing owned
AST cloning/materialization rules stay; generic cloning loses WeakMap authority.

M6 preserves ALL original seven paths/70 cases and14 byte comparisons. Append
the new eight-group test file as path8, giving78 cases; append host-invocation.js
as comparison15. It is currently omitted despite the changed lazy backend.
Extend the exact Rust count/message to70+8, without weakening success checks.
Embedded payload already includes the whole package; fresh owned XDG is required
because the version/config/lock readiness sentinel can reuse a same-version cache.

## Proof, gates and close

New test file has exactly eight top-level Deno.test groups (no hidden skips):
1 physical mapping/decoder/keys and both-direction candidate insertion;
2 scalar/normalized/recursive/default/sibling typed-result consumers;
3 some-thread/dissoc/IfLet/WhenLet/value+statement Match actual collisions;
4 overload args, named/anonymous yields, guards/errors/effects/null/iterator and
  actual closed async carrier;
5 complete fragment/direct-builder cases, partial/custom helpers, legacy reset/
  failure counter, repeated/interleaved/reentrant entries and one macro callback;
6 actual completion/discard/rest/host-reference/expanded-invocation consumers;
7 raw compiled ICU and lazy exact-plan consumers, current negative/recovery tests;
8 public Deno/browser/post-expansion JSON/data/API/namespace and error boundaries.
Keep original source/corpus tests and useful assertions. Concrete Source inputs,
wrong-implementation oppositions and existing helper patterns are detailed in
the initial CC prompt before issue; group labels alone are not proof.

Use actual Source→read/expand/compile and controlled generated-module execution,
same-object raw requests, exported APIs and fresh staged browser output. Preserve
status/streams and old negative/error classes; SyntaxError is not expected for
valid inputs. No handwritten substitute IR/declarations/private metadata.
Raw invalid-request API tests may construct actual plans through existing APIs.

Before first focused tests, make fresh-artifacts because project.json maps lang/
to target/lykn/build/lang. Preflight JS lint/format as repo prescribes; no global
reformat. Run focused new/affected public and legacy/lazy protocol tests, then
one full make check (docs once) with precreated absolute M6 evidence env, actual
8/78/all15 inspection, exact fifteen-path source commit/message-file adjacent coauthors,
final-HEAD cited paths and fresh81920 size. Separate source-first Sol review
and fresh independent gates precede acceptance; root owns final rows/history/
retrospective/BS-06 and Arc06/API/research routing. No auto release integration.

Artifact home: this slice artifacts/{root,cc,cdc}; root/baseline may retain three
actual source/generated/runtime specimens and one tiny Lykn public-front-end
client, because the native CLI alone cannot exercise the public source compiler.
No reusable runner/parser/archive framework. All helper/orchestration/evidence
logic MUST be Lykn, never Python/Ruby/Fennel/handwritten JS/Node/awk. No Python
exception. The named JS/Rust PRODUCT compiler/test deliverables, delivery mirrors and static
runtime clients are allowed; this is not permission for JS evidence tools.

## Version history

- 2026-11-14 v1.1: independent source-first F1–F5 HOLD and original proof gaps;
  clarify executable keyword roles, real Surface fields, normalize-before-decode,
  bounded scanner and rejected-name Set, same scope; prepare correction01.

- 2026-11-14 v0.1: source-grounded S06 preparation after independent release82
  integration; nine logical paths plus six tracked delivery mirrors/eight rows/
  eight groups, preserving legacy APIs
  and local ownership. Actual baseline/readiness/complete prompt precede issue.
- 2026-11-14 v1.0: actual public baseline/readiness PASS; preissue locator/oracle/
  direct-private ambiguity and tracked-mirror omissions resolved before dispatch.
