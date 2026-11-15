# S06 CC intake

2026-11-14. CC: OpenAI gpt-6-luna/high. CDC: separate gpt-6.1-sol/high.
The dispatch authorizes source/build work on the named non-default task branch;
root retains planning Git/index/ledger ownership. No source edits preceded this
intake.

## Required reading coverage

The committed planning identity is `83d75e450b806f857f9beb980741d635f28cf755`
plus the current S06 open set. The source identity is clean
`82f1b65b92529979afd6c624183912ca31453927`, tree
`4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`, branch
`codex/qualified-adt-core`; `git status --short --branch` was clean.

| Manifest item | Loaded extent |
| --- | --- |
| CC prompt | Entire `cc-prompt.md`, lines 1–262, including scope, producer recipes, 8 proof groups, gates and handoff. |
| Slice plan and ledger | Entire `slice-plan.md` (1–246) and `ledger.md` (1–15); all eight PN rows remain open. |
| Parent plan | Entire Arc05 `arc-plan.md` (1–388), including active S06 authority, boundaries, roadmap and history. |
| Source `AGENTS.md` | Entire file; repo/worktree ownership, source citation, Lykn-only research-helper rule, exact-path commit and dual trailers. |
| Root baseline and readiness | Entire baseline README and readiness report; all baseline `*.lykn`, `*.generated.txt`, `*.stdout`, `*.stderr` files read. They show the actual typed duplicate declaration, thread result 14, and ICU TDZ failure, with root's repaired oracles 7/106/5. These are inherited observations, not my reruns. |
| Framework / Autonomous Mode | Collaboration-framework route and Autonomous Mode contract; project-management README Autonomous Mode/existing-record routing; engineering-methods Autonomous Mode and CC intake. Scope ends at independently reviewed S06 close; role selection, separate CDC, source branch, root planning ownership, commits authorized, external actions not authorized. |
| Testing and language guidance | Testing discipline and validation gates (complete); JS/Deno module and test guidance plus anti-pattern IDs 07/12/14/16/35; Lykn `SKILL.md` Before Anything, bindings, functions, generators, threading; `docs/guides/06-functions-closures.md` ID-01/helper boundary, generators and threading. Rust guidance consulted for membership/count-only integration test edits. |
| Identifier and invocation source | Entire `identifier.js` (1–130), `host-invocation-kernel.js` (1–96), `host-invocation.js` (1–228), and `compiler-private-atoms.js` (1–48). The read covered identity anchors, WeakMaps, plan validation/consumption/finalization, AST identifier traversal, private markers, and existing identifier normalization. |
| Compiler | `compiler.js` module imports and `lowerHostReferences` (1–91), actual Atom emission/colon validation and `compileExpr` entry (1816–1895), ICU reservation/allocation/emission (195–340), closed carrier (1720–1815), and public compile/finalization (2296–2305). These sections establish original validation order, helper scopes and finalization calls. |
| Expander | `expander-core.js` exports and legacy counter (1–150), expansion environment and occurrence clone (720–890), emitted-name/private completion finalizer (1247–1288), helper objects/Match adapters and fragment entry (1831–1881), classifier dispatch and macro fixed point (2010–2150), and whole-unit Pass 2/import entry (2444–2550). Cross-references were followed to actual helpers, clone identity checks, macro output cloning, sibling sequence and host lowering. |
| Classifier and AST | `classifier.js` dispatch producers (493–812), full single/multi builders and signature guard (830–1225), genfunc (1277–1357), value/statement Match and reservation (1379–1575), yield recursion (1665–1700), and actual `surface-ast.js` constructors/fields (1–69). Existing tests confirmed helper defaults and direct callers. |
| Surface helper preservation | `surface-helpers.js` typed discard/rest helper functions (250–310), discard binding preparation (365–465), compiler pattern/private-atom sites (535–635); private identity sites at 267/279/556/611 were read with their containing functions. |
| Product tests and runtime consumers | Entire `icu-generated-names.test.js` (1–209), `lazy-protected-invocation.test.js` (1–309), `browser-host-reference-compile.test.js` (1–40); required `remaining-discard-bindings.test.js` direct signature/private boundary and JSON round-trip sections (390–475); entire `dd-37-classifier-pilot.test.js` (1–32); `reserved-binding-output.test.js` source, defaults, and completion-relevant sections (1–120, 245–310). Actual fixture conventions and `lang/`/`browser/` aliases are recorded. |
| M6 / build / import map | `macro_dependencies.rs` receipt helpers and complete M6 test (940–1165); `embedded.rs` materialization readiness/include path (25–55); Makefile fresh-artifacts, lint/format, check, and bundle-size targets (200–230, 294–374, 580–583); complete `project.json` (1–19). M6 retains its seven prior paths/70 cases/14 comparisons, uses materialized `lang/` and `browser/` aliases, and needs 78/15 after this slice. |

The initial broad source index command was visibly clipped; it was only a locator
query. No required text was inferred from it. All implementation-relevant
required sections above were recovered by bounded source reads. No required
input is missing or contradictory.

Recovery note: the pre-edit pass also loaded the complete classifier `emitSurfaceForm`
helper binding and opening switch (489–525), `reserveNodeNames` (1474–1494), all
three Match adapter definitions (1290–1375), the captured macro API values
(234–244), `resolveAutoGensym` (488–520), and Deno surface-macro registration
and macro-environment restoration (475–590). The embedded Rust include and
cache setup (1–24) was read before its readiness logic (25–55). These preserve
the legacy global gensym captured by macro environments and the existing
module-private macro scope; they do not add a new allocator to macro APIs.

## Contract readback

This is static generated-name protection, not source-binding renaming or macro
hygiene. The public whole-unit entry must seed one closure-owned physical-name
set from every owned form before the first emitter, then carry it through
Pass 0/Pass 2 imports, macro-result barriers, child environments, classifier
helpers and Match adapters. A one-form fragment and standalone ordinary-name
builders own only their supplied inputs. Existing global `gensym`/reset stays
observable, monotonically advances even on failed compilation, and receives an
exhaustion check; names are reserved in a separate per-entry allocator.

Physical occupancy must use the same normalized colon/private-member parts as
the compiler after the compiler's existing validation order, while decoding
static Unicode escapes for conservative source scanning and already-emitted
ESTree identifiers without normalizing emitted text twice. Allocation accepts
an already inserted candidate once, handles escaped-equivalent keys, and fails
on a repeated rejected raw callback rather than spinning. Strings, keywords,
literal values, metadata and opaque private markers are not executable name
inputs. Owned clones and WeakMap capabilities must remain intact.

The patch is limited to six canonical JS package files, their six tracked
byte-identical embedded mirrors copied before fresh builds, one new eight-group
public Deno product test, one Rust M6 membership/count change, and the existing
function/closure guide. Late completion, ICU and host invocation consumers must
share physical keys without altering protected-root selection, lazy
`patternNames`, exact invocation anchors, cleanup or helper enclosure. The
easily missed invalidation is a locally correct allocator that fails to reserve
a later sibling or generated/macro-exposed name before an earlier producer;
another is replacing identity-bearing nodes through generic cloning. Proof must
therefore use real Source expansion/compile/run, actual direct APIs, existing
private requests, and fresh materialized packages, not token checks or invented
IR. Raw compile retains its existing boundary and does not gain Source binding
resolution. The eight PN proposals remain open until independent CDC review;
green CC evidence is proposed-done only.

No Python or alternate helper-language execution is authorized. Research,
fixture generation, validation, orchestration and evidence logic remain Lykn;
named JS/Rust product tests and static runtime consumers are in-scope. No
dependency, release integration, push, publication, S07, or library work is
authorized.

## Correction01 intake — source-first recipe recovered before edits

Correction01 source pin rechecked clean in `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`: `codex/qualified-adt-core`, commit `17791f24696ecbd1bc1cc4cabcc65c1a49d555c1`, tree `792fd4244180068e3319c49785cf8df1ff5ae02b`. This append is a source/contract readback; product files remain untouched at this point.

### Newly recovered required extents

- Read correction prompt fully in bounded ranges and current `slice-plan.md` v1.1, ledger, CDC F1–F5, full 8-group proof table/API/metadata disposition, source-first evidence, correction01-consumers, and the complete old prompt's 8 group obligations. The actual plan/prompt bind exactly 3 changed product paths, original 15-path delivery/eight PNs/eight Deno top-level groups, actual M6 78 cases/8 paths/15 comparisons, plus focused/full/docs/citations/81920 size gates. Formal refinement is 1/5; PN rows remain proposed-done only after CC.
- Recovered actual classifier emission extents `packages/lang/classifier.js:510–610,705–745`: `Reset.value`, `SetProp.value`, `SetSymbol.value`, Assoc pair `value`, Obj pair `value`, Cell `value`, Exports atom `names`; Thread/SomeThread rebuild scalar keyword and keyword-headed step lists into executable member names. Surface constructors at `surface-ast.js:20–69` confirm those object fields. Generic keyword/literal data remains non-executable and skipped except these recognized threaded member roles.
- Recovered `classifier.js:1485–1558` complete `reserveNodeNames` / statement Match preparation. Match adapter complete extents are `expander-core.js:1305–1390` (statement, direct statement and result each pass `env.generatedNames`); direct consumers are `classifier.js:1288–1484,1679–1714` for Genfunc, value Match, and recursive yield instrumentation. `expander-core.js:42–75,238–254,492–506` confirms the shared legacy counter and macro-captured `gensym` callback; `crates/lykn-lang/src/expander/embedded.rs:1–24` confirms the embedded package include root, with required mirror at `crates/lykn-lang/embedded/packages/lang/identifier.js`.
- Compiler actual-member mapping is `compiler.js:1816–1884`: colon validation precedes `toJsIdentifierParts`; first member and private member parts use that actual mapping. ICU `reserveIcuIdentifiers` uses decode-only `emittedIdentifierKeys` for ESTree Identifier nodes. The `identifier.js:132–289` source read confirms the five defects: braced decoder suffix `indexOf`/slice; raw text decoded before normalization/physical run extraction; keyword and all `value` fields skipped; arrays only consume strings; and only adjacent rejected callback text remembered.
- Applied repository `AGENTS.md`; installed JS/Deno guidance entry, project `docs/guides/09-anti-patterns.md`, `06-functions-closures.md`, `08-performance.md`, and `12-deno/12-02-testing.md`; testing discipline and validation-gates; work-verification and engineering-methods intake contracts. Relevant decisions: keep ESM/Deno/no-Node and named API conventions; use actual observable runtime assertions, preserve error classes and cleanup, no invented timing claim for F5; keep all failed/unknown receipts distinct; existing eight-group/product gates define scope.
- Recovered actual test entry imports and current first group in `test/forms/public-generated-names.test.js:1–140`; prior intake covered the remainder of this full 374-line test. Existing exact recipes in `icu-generated-names`, full lazy protocol, remaining/discard-binding, classifier pilot and reserved-output suites remain preservation inputs. Existing artifacts' prior failures and numerical summaries are retained; unavailable raw focused-attempt01 stream and unpreserved failed-source snapshot will not be reconstructed or overstated.

### F1–F5 readback and bounded product recipe

1. F1: derive physical occupancy from actual emitted Source text: join `toJsIdentifierParts` member names with `.` and private `#`, then collect decode-only emitted keys. Also collect legacy whole `toJsIdentifier(raw)` and normalized colon-part keys. Do not Source-normalize already-emitted ESTree text. Tests require actual `___gensym0` for `---gensym0.child`, actual `ab` for `a-\\u0062`, compiler member/private/computed observations, escaped-equivalent candidate opposition both directions, object identity, and explicit malformed/surrogate/FEFF decoder boundaries.
2. F2: in each owner scan, recognize raw thread heads (`->`, `->>`, `some->`, `some->>`) and Surface Thread/SomeThread steps; reserve scalar or step-head keyword as reconstructed executable Source member. Continue traversing operands; preserve ordinary literal/data keyword behavior. This is census-only, without macro invocation/classification/evaluation. The nested result witness is an early-allocation proof, not a late SomeThread-only reservation.
3. F3: preserve primitive literal/type/metadata and private skip rules, but traverse executable container `value` payloads and object members inside names/keys/fieldNames arrays while separately reserving string elements. Use actual classifier-produced nodes; a fresh WeakSet per reserve call lets a later call see a newly attached child on the same object.
4. F4: local Set of rejected RAW candidate strings per `next()` attempt; only add on collision; repeated A,B,A fails at callback 3 with existing repeated-rejection Error; accepted atom object/string is returned unchanged and keys inserted once. No global namespace and no retry cap.
5. F5: incremental braced decoder checks at most six hex digits and immediate `}`; invalid, overlong, unterminated and out-of-range source preserves current literal-text/progress policy. Long malformed prefixes are a functional checked-progress oracle; bounded algorithm is reviewed directly, without timing claims.

### Three product paths and proofs

Only `packages/lang/identifier.js`, byte-identical `crates/lykn-lang/embedded/packages/lang/identifier.js`, and existing `test/forms/public-generated-names.test.js` may be edited. New tests must import compiler/expander/identifier/invocation via the `lang/` import-map alias and staged browser compiler via `browser/`, so M6 consumes the materialized package. Keep exactly eight existing Deno test groups and no skips/steps/count padding. Raw Source lifecycle recipes reset only when explicitly needed; `compileFresh` is a product-test helper only. Cover all supplied groups: exact physical/Unicode API plus actual classified Surface fields; Source dissoc/thread/nested typed + keyword-headed and Surface keyword cases; reset-controlled typed/default/recursive/sibling; isolated SomeThread/IfLet/WhenLet/value and statement Match/Dissoc; Multi/Genfunc/GenFn/yield/closed async carrier; self-contained fragment/direct producers/failure advancement/interleaving; actual macro re-entry inner/outer/recovery; late completion/discard/rest/host/ICU/lazy protocols and exact anchors; public Deno and staged-browser typed/thread/ICU plus executed JSON-roundtrip literal and namespace observation. Preserve top-level-do control, closed compiler-only discard scope, private identities, raw-vs-expanded invocation distinction, no Source binding rename or S07/S08 guarantee, no new entrypoint/export/dependency/API or strip option.

No scope/design contradiction was found. Exact three-file limit and sequential source/build ownership are binding. Focused gate precedes exact3 commit; full M6/docs/final-path citations/fresh size run only after immutable source commit; failed DNS/previous failure evidence remains distinct. All five PNs stay open pending independent disposition.

### Intake recovery and denominator correction

A review of the correction append found two coverage descriptions that needed more precision. The complete applicable test was freshly read at `test/forms/public-generated-names.test.js:141–EOF` after the initial intake append; the opening `1–140` was already visibly read in that append. The later range inspection occurred after first product-test edits, so it is recorded as a current-source recovery rather than claimed as a pre-edit read. The normalizer/API source extent `packages/lang/identifier.js:1–131` was separately read visibly before edits (and the baseline remainder through line289 in the same source pass). The installed JavaScript/Deno skill's own `guides/09-anti-patterns.md:1–220` was read; this is distinct from the similarly named Lykn project guide `docs/guides/09-anti-patterns.md`, which was also read. Current anti-pattern relevance is ES modules/no Node, strict equality/type handling, guarded iteration and avoiding unsupported complexity/performance assertions; no additional product surface follows from it. The prior correction append's final reference to “all five PNs” was a typo: all **eight** PN rows remain open pending independent disposition. The full public test's initial functions and exact eight-group structure were read before changing that test; later actual groups were recovered as stated, not inferred from filenames.

## Correction02 intake — proof repair source recovered before edits

Correction02 starts from source `codex/qualified-adt-core` commit
`89ab9dcd90f0c8498685dba0f267a986d07ee462`, tree
`6305ea2ee0b2b29b0a754b4641b46ea54ae247f7`, which I rechecked clean. No
correction02 product edit had been made at this intake point. I read the full
184-line `cc-prompt-iteration02.md`, plan v1.2, ledger, source `AGENTS.md`,
complete CDC Source02 review P1–P9/array-leaf/applicability and readiness PASS,
and the 30-line root correction02 preflight. Formal refinement count is 2/5;
all eight PN rows remain open.

The current 785-line `public-generated-names.test.js` was read in bounded
overlapping ranges 1–170, 171–340, 341–510, 360–470, 471–590, 585–625,
611–800. The first command accidentally addressed this source file from the
planning worktree and returned “No such file”; no source-read claim is based on
that attempt. The later ranges cover the complete current file and show the
existing eight top-level Deno groups, direct-builder assertion with missing
counter resets, unchecked-class substring helper, and browser calls without
immediate per-call resets. Required new cases will be placed inside these
groups, not in a separately-run fixture.

The four supplied CDC fixtures were read completely: `leading-hyphen-review`
Source/generated/stdout/stderr shows the actual TDZ failure for the accepted
`___gensym0` alias; `keyword-thread-review02` Source/generated/stdout/stderr
shows the actual non-callable computed member failure (its array entry is a
function); `keyword-thread-control` Source/generated/stdout/stderr confirms
preserving source spelling `t__gensym0` yields 7; `keyword-enclosing-result-review`
Source/generated/stdout/stderr shows result-local TDZ for the authored
`result__gensym0` selector. New same-source test cases will retain their
original opposing behavior and use the supplied Source roles.

Current identifier API/source was read at `packages/lang/identifier.js:1–317`.
The helper comment at ~190 currently misstates `physicalIdentifierKeys` as
accepting emitted text; the adjacent `emittedIdentifierKeys` API is the actual
decode-only emitted-text path. The only identifier production change here is
that comment plus exact mirror; algorithm/signatures/exports remain fixed.
Actual allocator and producer source was read: classifier `60–210` dispatch
and `allocatorFor`, `480–640` emit helpers and SomeThread call shape,
`820–1045` direct single/multi builders and argument candidate allocation,
`1280–1370` Genfunc allocation, `1380–1555` value/statement Match and complete
`reserveNodeNames`, and `1670–1725` recursive yield instrumentation. The
expander Match adapters at `expander-core.js:1280–1395` pass the shared
`env.generatedNames` into statement/direct/result Match; the existing macro
environment captures the legacy `gensym` callback in `expander-core.js:220–260`
and public macro allocation is visible around `486–510`. Rust embedding is
`crates/lykn-lang/src/expander/embedded.rs:1–25`, with the included package
directory declared at line13.

Installed JavaScript/Deno anti-patterns were read from the installed skill root
at `guides/09-anti-patterns.md:1–240`; project Lykn guide is separate. Source
`skills/lykn/SKILL.md` was read through its language and workflow guidance.
Relevant retained-product extents were read, not inferred from titles:
`discard-bindings.test.js:90–180` preserves scalar/object/array/nested/simple
rest/default/contract/Multi and actual error cases; `host-reference-lowering`
tests at `40–120` preserve shared identity, exported actual namespace and exact
exception classes; `icu-generated-names.test.js:65–210` preserves real source
identifier capture, selector/hoist sharing, once-only effects, exception,
branch laziness, fragment/recovery, browser and host-invocation anchors;
`lazy-protected-invocation.test.js:50–145` preserves no-request equality,
actual helper collision, rejected plans, cleanup and exact invocation ordering.
These tests supplement, rather than replace, the new same-source P1–P9 and
array-leaf assertions.

Correction02 changes exactly three product paths (the existing eight-group
test plus the two JSDoc mirrors), and keeps the original 15-path M6 delivery,
eight groups, and 78-case/eight-path/15-comparison M6 contract. The comment-only
mirror is synchronized before `make fresh-artifacts`; owned temp/XDG/npm and
evidence directories must exist before focused checks. Focused proof is 42
cases/eight paths. After focused green and exact three-path commit, source and
build return to root and CC stops for independent source-proof disposition;
no full-gate retry is in this phase. Earlier failures, stale-stage work,
ad-hoc eval, TMPDIR failure, and interrupted/unknown attempts remain separate
historical evidence and will not be reconstructed or relabeled.
