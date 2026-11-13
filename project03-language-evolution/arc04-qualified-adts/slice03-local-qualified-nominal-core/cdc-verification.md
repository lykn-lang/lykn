# S03 independent verification

## Increment A candidate 5a8aedc5 — 2026-11-11

**Verdict: HOLD; do not accept increment A or start dependent nominal work.**
This separate Sol 6.1 High context reviewed the issued initial prompt, all eight
open LC rows, actual 38-path source delta from accepted `0829e892`, CC's
closing report and available raw gate logs. Root transferred exclusive task
build/execution ownership after Luna returned the committed candidate.
No source repair, Git index change, stage, commit or parent/ledger edit was
made by this reviewer.

Source remained clean on `codex/qualified-adt-core` at
`5a8aedc5dcd6329da7b5f33a5397126a45891bac`, tree
`3a05cbf5cc12b8e964e5de983b2f835e1f563c4e`. The source diff synchronizes six
changed canonical compiler files into the embedded payload and adds the finite
native/public private-reference facilities, v2 policy, guard/error consumers,
JSON Result boundaries and tests. This is A only: no nominal syntax, qualified
owner resolution or purity implementation is accepted here.

### Findings and required correction

1. **AF-01 — substantive native dispatch capture, independently reproduced.**
   `crates/lykn-lang/src/emitter/forms.rs::build_dispatch_check`, line 3938,
   still constructs `atom("Array:isArray")`. All other production raw
   Number/Array/Promise/TypeError/Error producers in the scoped emitter census
   were migrated; this one was missed. With `(bind Array 0)`, a multi-clause
   `func` accepting `:array` and `:string`, called with `#a(1)`, compiles but
   produces `["TypeError","Array.isArray is not a function"]`. Expected
   selection is `"array"`. The same failure occurs with an enclosing-function
   parameter named Array. Both module and parameter controls fail semantically
   in checked and stripped output: four independently executed conditions,
   each compile/runtime process exit 0 because the probe catches and records
   the exception. Generated payload guards already use the correct imported
   or local alias; the earlier dispatch condition bypasses it. Correct this
   owned producer and add discriminating module/parameter regressions,
   including retained string and unknown-clause outcomes.
2. **AF-02 — cold delivery oracle does not cover A's full changed boundary.**
   `crates/lykn-cli/tests/macro_dependencies.rs::m6_...`, line 714, retains its
   old five-file comparison list. The union with A's changed canonical files
   is seven: binding, classifier, compiler, compiler-private-atoms,
   expander-core, protected-host and surface-helpers. Actual copies appear
   synchronized in the inspected diff, but the passing M6 receipt does not
   prove the omitted compiler/policy bytes or new owned guard runtime through
   materialized imports. Its existing public ADT fixture has `:any` payloads.
   Adapt the comparison set and exercise A's host guards/errors against the
   actual cold-materialized `lang/` path/copy-of-CLI route.
3. **AF-03 — unfinished native fragment return, source-inspected boundary.**
   Public `emitter/forms.rs::emit_form` (276–289) detects only old
   host-invocation markers before returning forms. Typed guards now introduce
   private host references; this fragment API can therefore return unfinished
   reference-bearing forms instead of its assigned structured fragment error.
   Complete emission/JSON lowerers subsequently handle them, and fragment JSON
   rejects them, but that does not enforce this earlier public fragment
   boundary. Add the corresponding check and direct product test, or obtain
   an explicit contract disposition before claiming all native fragments are
   covered. This finding is source inspection, not an executed native API
   reproduction; no private Rust research helper was authored.
4. **AF-04 — shared public reference identity, reproduced internal case.**
   `packages/lang/compiler.js::lowerHostReferences` appends every encountered
   marked atom to an array, then clears its metadata during mutation. Reusing
   one owned `hostReference("SymbolFor")` atom as the head of two calls causes
   the second mutation to throw `invalid compiler-owned host reference`.
   Root explicitly selected a bounded deduplicated mutation fix and internal
   regression. Reference values may have multiple occurrences; this is
   distinct from single-consumption Reflect invocation anchors. No ordinary
   source exploit is claimed.

The commit has a blank line between Codex and Billo AI co-author trailers,
contrary to AGENTS' contiguous-trailer rule. Root independently noticed the
same documentary deviation. Preserve this committed pin/history; do not amend
it. Subsequent commits must use contiguous trailers. This is not a source
runtime repair or grounds to rewrite prior evidence.

### Independently executed evidence and its limits

A fresh `make check` exited 0 with existing explicit Deno cache and fresh owned
npm/XDG/tmp homes. It completed build/lint/Clippy/format, Rust integrations,
1,176 language unit tests, 1,507 corpus tests plus 67 steps, and 482 docs once.
The browser ESM consumer and current M6 tests ran within that gate. The gate
was already running when AF-01 was confirmed; its successful population does
not cover the independently failing condition. No duplicate documentation
suite was run.

A reviewer-authored Lykn driver imported the existing internal public
`hostReference` producer and exercised all nine values through actual emitted
ESM in unshadowed, module-root-shadowed and parameter-root-shadowed units.
All 27 runtime assertions passed: Symbol construction/registry identity,
Object freeze/descriptor behavior, Number.isNaN, Array.isArray, Promise,
TypeError and Error. Three public fragment controls correctly reject an
unfinished atom, call-head reference and `new` constructor reference. This
does not validate the missed native dispatch consumer or future nominal
producers. A separate internal sharing observation records that reusing one
marked atom object in two calls is rejected after metadata is cleared on the
first occurrence. Root's subsequent disposition requires the bounded AF-04
fix; no source-reachable exploit is claimed.

Support aliases/import specifiers are sparse and after directives. Both fixed
inline module constants, however, capture/export all nine values regardless
of the requested subset. Root explicitly approved that fixed-module baseline
as a provisional layout; it is not a rejection finding. Do not describe the
data-module body as sparse.
The current protected-host assumption excludes foreign/dynamic tampering;
this review did not invent getter-tampering acceptance requirements. Later
LC-06 still owns support-initializer provenance/removal in the ADT dependency
graph; no purity or zero-contribution result is accepted now. Collision and
same-spelling macro requirements still need their discriminating corrected
candidate evidence rather than inference from a complete-name walk alone.

Fresh bounded [raw receipts](artifacts/increment-a/cdc/receipts-5a8aedc5.tar.gz)
and [navigation/digest](artifacts/increment-a/cdc/README.md) preserve actual
argv/cwd/selected environment, source/tool/binary pins, source/generated
probes, runtime observations and the first failed reviewer import-map setup.
The retry used existing `project.json`, without changing any dependency.
Compiler/source pins remained unchanged throughout. Installed and release
CLI SHA-256 are both
`e4e949abdda17d52f7024ce88f58c15e517aeaae5b9444d67d48d2fa857aabbb`;
Rust/Cargo are 1.97.0, Deno 2.9.6.

After AF-01, root directed bounded focused completion and return rather than
additional full gates on a known-failing candidate. Separate fresh citation
and browser-size gates, adapted cold host-runtime proof and corrected source
full gates therefore remain unrun here. CC's reported successful gates retain
their attested strength and original logs; they are not independent acceptance.
No missing historical raw log was reconstructed.

### Criterion disposition and ownership

LC-01 is **open/held** by AF-01 and the remaining fragment/delivery obligations.
The seven other LC rows remain open; A neither closes them nor implements the
qualified nominal feature. Retain S02's separately accepted evidence and I4
protected early-return, historical unregistered fallback and version-sentinel
warm-cache limits; this A review does not strengthen those claims.

Root owns the correction assignment, planning Git/index and ledger/parent
status. The reviewer returns exclusive task source/build execution and this
verification/evidence ownership now. Further source correction belongs to CC,
followed by separate review of the actual corrected candidate and required
gates. No B/C implementation authority follows from this record.

## Correction01 candidate 16dcd64f — 2026-11-11

**Verdict: HOLD for remaining materialized dispatch and diagnostic-span work.**
This separate reviewer inspected all 12 changed paths, the issued correction01
prompt, CC handoff/results and available logs. Source stayed clean at
`16dcd64f09946b6bd484a893dcefa16c01e1b431`, tree
`6f36076d83c0f87b5e038be99604b8bc7eb5d531`, on `codex/qualified-adt-core`.
No source/index edit, stage or commit occurred. The corrected commit has the
required contiguous trailers; the earlier spacing deviation stays historical.

- **AF-01 software repair verified.** Owned ArrayIsArray dispatch passes four
  independent module/parameter × checked/stripped conditions. Each retains
  array selection, string selection and existing unknown-clause TypeError.
  Generated output distinguishes module inline fallback from parameter-only
  local capture. The native same-spelling source-macro test also passes.
- **AF-03 rejection implemented, span completion remains.** Public emit_form
  recursively rejects owned references through the specified Codegen channel;
  internal raw production and whole-unit/JSON lowering remain viable. All
  seven emission-results tests pass, including exact non-default span for a
  typed single-clause source and plain fragment success. However, the array
  dispatch caller builds arg_access with the default-span list helper
  (~3786), then build_dispatch_check attaches expr.span() (~3963). Its first
  dispatch reference therefore remains synthetic-default. The single-clause
  span test does not establish multi-clause anchoring. Root confirmed this
  source-inspected gap and requires actual param.span() threading plus a
  parsed multi-clause public-fragment span test. This is not relabelled as an
  executed native API failure.
- **AF-04 verified.** Unique marked atoms are mutated once; the normal public
  product test executes two shared SymbolFor calls with one alias and matching
  runtime registry identity. The reviewer driver now compiles its formerly
  rejected shared-node case. Reflect's separate anchor/recovery controls pass.
- **AF-02 partly verified, still open.** Fresh copied-CLI M6 starts from an
  absent owned versioned cache and compares all seven modules, including the
  previously omitted compiler/policy bytes. Its three materialized public
  runtimes pass: recursive ADTs, private macro hygiene and single-clause
  shadowed host guards/errors. Neither separate multi-clause dispatch fixture
  runs through materialized lang/. The test's guard/dispatch name does not
  change its fixture contents. Root requires both explicit materialized
  dispatch controls before acceptance. Public source stripping remains absent;
  native checked/stripped proof is separate.

The complete 202-test emitter module passes (974 other library tests filtered).
Exactly 44 tests locally select the raw producer, with existing assertions
preserved apart from intentional dispatch identity inspection; no global
alias was introduced. The unchanged remainder is 158 tests, but CC's statement
that all 158 exercise public emit_form is too broad. A Lykn source census
identifies 125 test sections with direct public calls and 33 testing other
helpers/internals. This arithmetic remainder is not promoted into public API
execution coverage; exact names are retained in the census receipt.

Fresh focused public tests pass 12/12: seven host-reference, one browser
compile/ESM consumer and four lazy protected-invocation tests. The original
reviewer Lykn driver was rerun at the corrected pin: 27 all-nine runtime
assertions across unshadowed/module/parameter scopes and three unfinished
atom/call-head/new fragment controls pass. Normalized-name reservation and
shared-reference runtime behavior are executed product assertions.

Fresh [raw receipts](artifacts/increment-a/correction01/cdc/receipts-16dcd64f.tar.gz)
and [navigation/digest](artifacts/increment-a/correction01/cdc/README.md)
preserve populations, argv/cwd/environment, raw streams/status, generated
modules, census and pins. Rust/Cargo 1.97.0, Deno 2.9.6; installed/release CLI
SHA-256 `9e3d716177cff6c9167efd4d45a0a99a5d0fe62be2f20ea1839a1c554830a300`.

Root explicitly required bounded completion and return once the missing
product oracle was identified. No fresh full make check, citation/size gate or
redundant docs run was started on this known-incomplete candidate. CC's gates
retain their original attested strength; corrected-final independent full,
committed citation, 80 KiB and complete delivery evidence remain required.

LC-01 remains open; no A acceptance or LC-02–LC-08/B/C completion follows.
Fixed-nine inline layout remains approved/provisional, with sparse imports
distinguished from its fixed body. I4, warm-cache and browser eval limitations
remain explicit. Source/build execution and review-record ownership return
to root for correction. No release, integration or remote action occurred.

## Correction03 candidate 5caf3d87 — 2026-11-11

**Verdict: ACCEPT increment A and its LC-01 host prerequisite only. S03 remains
open.** Independent review inspected the exact six-path 16dcd64f-to-5caf3d87
diff against issued corrections02/03, the CC handoff and retained failure
receipts. The candidate is
`5caf3d871a80a711c08dbda0db8c5f5446dffb56`, tree
`115ce5ecc254ea9ed15263612bed67b6cec80ab2`, on `codex/qualified-adt-core` in
the named task worktree. Source/index remained unchanged and clean; the commit
has contiguous Codex/Billo AI trailers. No release or remote action occurred.

The canonical and embedded classifier copies are byte-identical. Both original
Array-shadow fixtures are unchanged from parent16. The public repair removes
only the ordinary body's returns-annotation gate, reusing wrapReturnLast;
the postcondition branch and helper's statement/control-transfer treatment
remain intact. The new runtime control executes annotated/unannotated single
values and prefix effects, explicit-return tails, multi-clause post success
and failure, and unknown-type no-match behavior. It does not establish missing
general multi-clause return-type guards or repair I4 early returns.

### Findings resolved and focused evidence

- **AF-01 verified:** native module/parameter Array shadowing executes all four
  checked/stripped conditions, retaining exact array/string/unknown-clause
  results. Both separate fixtures now also execute successfully through the
  materialized public compiler, with exact stdout and empty runtime stderr.
- **AF-02 verified:** real M6 runs a copied built CLI outside the canonical
  package cwd from an absent owned versioned cache, compares all seven module
  bytes, then imports the actual materialized lang/ mapping. All five runtime
  cases pass: recursive ADTs, macro hygiene, single-clause guard/error paths,
  module-shadowed dispatch and parameter-shadowed dispatch. These are actual
  executed cases, not inferred from names. A further reviewer-authored Lykn
  witness copies the freshly built release CLI to another empty standalone cwd,
  starts with an empty separate XDG and runs a macro plus shadowed guards/errors.
  Seven module and embedded config/lock byte comparisons all pass.
- **AF-03 verified:** all eight emission-results integration tests pass. The
  new parsed multi-clause test verifies Codegen rejection at the actual first
  array parameter, line 2 columns 18–23. The helper receives param.span()
  explicitly while keeping the synthetic argument-access expression separate.
  Public native fragment rejection, raw producer/whole-unit lowering and JSON
  Result boundaries remain intact. Existing raw writer/all-nine/Reflect
  composition and fragment JSON tests pass within the full gate. A separate
  actual native CLI kernel-JSON → public compiler → ESM runtime witness returns
  the expected number/array TypeErrors and match Error, with empty runtime
  stderr. The public fragment driver rejects unfinished atom, call-head and
  new-constructor positions; these three controls are public-JS evidence, not
  a claim that every native fragment position has a separate runtime test.
- **AF-04 verified:** shared private value identity compiles once to one alias
  across multiple occurrences. Its product runtime test executes matching
  Symbol.for identity. Existing distinct pointer-anchored Reflect validation,
  recovery and lazy invocation controls also pass.

Focused populations pass: 202 emitter tests (974 other library tests filtered),
8 emission-results tests, one native dispatch matrix containing four
conditions, one native same-spelling macro test, and 24 public tests (runway
12, owned references 7, browser compile/ESM consumer 1, lazy Reflect 4). The
original reviewer Lykn all-nine driver passes 27 actual runtime assertions
across unshadowed/module/parameter scopes and all three unfinished public
fragment controls. This distinguishes future Symbol/Object/Promise support
from the currently source-reachable number/array/error producer tests.
Normalized-name collision, no-request output, sparse aliases/imports and
directive placement retain their executed/source-inspected evidence.

The fresh Lykn census confirms exactly 202 native emitter test sections:
44 function-local raw-producer aliases, 125 remaining sections with direct
public emit_form calls, and 33 other/helper sections. The remainder is 158;
it is not a direct-public execution denominator. Correction03's additive
closing-report clarification now says this accurately and leaves the old
attestation historical. The six-path diff does not migrate additional tests.

### Required gates, receipts and disposition

Fresh full **make check passes**: build/lint/format and Rust suites, including
1,176 language units, corpus **1,513 passed across 67 steps / 0 failed**, and
docs **482 passed / 0 failed**, once through the standard combined gate.
Committed-HEAD cited paths pass: 64 documents and 601 historical citations
accepted. Browser gzip is **42,223 bytes**, baseline 27,630, delta +14,593,
below the 80 KiB budget. Existing astring condition warnings and registry
metadata output remain in the raw size log; no dependency changed.

The built release, bin/lykn and retained standalone copy share SHA-256
`5a226c7af5a79e91dc76464f02c7b40a24057bdbc4436b1bb0a5b7b988dcc476`.
Rust/Cargo are 1.97.0; Deno 2.9.6. Every focused/gate process used explicit
existing DENO_DIR plus owned npm/XDG/tmp. Useful
[raw receipts](artifacts/increment-a/correction03/cdc/receipts-5caf3d87.tar.gz)
and [navigation/digest](artifacts/increment-a/correction03/cdc/README.md)
retain argv/cwd/environment, statuses, raw streams, generated probes, census,
actual materialized comparisons and pins. The extra cold driver's first
attempt used a strict-mode reserved binding and failed before any CLI child;
both that source/output/failure and its probe-only rename/passing retry are
preserved. No full gate failed or needed a retry. Prior failures and missing
historical raw-log limits remain unaltered.

No unresolved A software finding remains. Root may disposition LC-01 from this
independent result; root owns ledger/parent status and planning Git/index.
LC-02–LC-08, B/C, nominal/qualified activation, private purity and the later
dependency-graph/removal proof remain open. The approved fixed-nine inline
module body is provisional; sparse imports/aliases do not prove purity or
zero ADT contribution. Accepted S02 I4, historical unregistered fallback,
version-sentinel warm-cache and browser eval-based run/load limits are retained.
The compileLykn evidence proves ESM compilation/consumer execution only.

This reviewer returns exclusive task source/build and CDC record/evidence
ownership to root. No implementation authority for B follows from this result.

## B1 candidate 3f197340 — 2026-11-11

**Verdict: ACCEPT the bounded B1 per-call public-state repair only.** LC-02–08
and S03 remain open. Independent review inspected the exact 12-path delta from
accepted A, iteration04, the selected design, CC handoff and original pre-fix
receipts. Candidate `3f197340dd4765df7cccb3858ef97faccb5df9fc`, tree
`9ee95765b3475c84c5f537834ecceb6b476dc794`, remained clean on
`codex/qualified-adt-core` in the named task worktree. No source/index edit,
stage or commit occurred; commit trailers are contiguous. No B2, identifier
carryover, release or remote action was undertaken.

### Source and behavioral verification

The fresh creator allocates one Map and fresh prelude arrays per call. Complete
expansion creates its context at Pass 2; public expandExpr independently wraps
and copies its existing Set input. All seven lexical reads, all three ordinary
surface-producer sites, three statement/direct/result match adapters and the
separate clause extension preserve the explicit context through existing
recursion. TypeDef writes and recursive Match/IfLet/WhenLet pattern reads use
that context. No global active/save-restore context, macro-order change, AST
transport clone, new public option or native typed-API change was introduced.
Macro reset/registration and gensym behavior remain separate. All five changed
or new canonical modules compare byte-for-byte with their embedded copies.

The actual surface.js JSR entrypoint remains exported by unchanged deno.json;
its resetTypeRegistry export is now absent. The global typeRegistry is removed.
This intentional API removal stays a S06 migration obligation. Private metadata
consumers reject missing context with a descriptive TypeError; a direct Not
emitter and context-free wildcard pattern remain valid. The unchanged Not
pilot also passes; the supplementary probe checks its actual emitted node.

Independent negative controls use an immutable git-archived accepted-A public
package at 5caf3d87, not a rebuilt or edited task checkout. They reproduce both
the successful-declaration leak and the distinct late-Pass-2 failure leak:
named value differs from the cold positional decoy. Both corresponding B1
controls pass. Fresh-process cold-prelude behavior is also discriminating:
old cold extraction selects decoy, while B1 selects the named value field
without runtime constructor bindings. This is root's explicit normalization
to the old reset/native metadata baseline, not byte-preserved old cold fallback.

Fresh canonical focused tests pass **31/31**: B1 six, unchanged Not pilot one,
runway twelve, owned references seven, browser compile/ESM one and lazy Reflect
four. The cold-prelude test also passes alone in a fresh process (five filtered).
An additional reviewer-authored Lykn driver passes seven reported rows:
successful and late-failed compile isolation against independently observed
baseline outputs; **separate** successful-inner and failed-inner re-entry
oracles; expression-to-expression isolation; nested value/statement match,
if-let and when-let extraction; and helper/export/fresh-array boundaries.
Each emitted runtime checks exact output, success and empty stderr. The failing
inner variant verifies that its intended late error actually occurred.
Caller binding-Set preservation and same-spelled macro gating execute in the
product regression. Current legacy decoy fixture expectations are migration
inputs; the supplementary equality controls do not canonize that fallback.

### Delivery and required gates

Fresh M6 passes the actual cold copied-built-CLI route with no canonical package
in its cwd, all **nine** canonical/embedded/materialized module byte comparisons,
and **11 actual materialized public tests** (five retained runtimes plus all
six B1 cases). Its explicit lang/ mapping selects the extracted package, including
the private macroEnv used by re-entry tests. The new browser test uses the normal
compile adapter and executes emitted ESM; this does not solve eval-based run/load.
The M6 parent-stderr assertion change is justified by observed Deno Check progress:
status and the actual 11/11 summary are verified, and runtime children still
assert empty stderr. This is not permission to ignore failed process status.

A further Lykn witness copies the freshly built release CLI into a separate
empty standalone cwd, starts from empty owned XDG, and executes a macro plus
real shadowed number/array/error guards. All nine module bytes plus embedded
config and lock bytes match extraction. The retained all-nine driver also
passes 27 runtime assertions, three unfinished public fragment rejections and
shared-value compilation at this candidate.

Fresh **make check passes**, including build/lint/format, **1,176 language unit
tests**, product corpus **1,519/0 across 67 steps**, and docs **482/0**, once
inside the standard gate. Committed citations pass **64 documents / 601 frozen
historical citations**. Browser gzip is **42,405 bytes**, baseline 27,630,
delta +14,775, below 80 KiB. Existing astring condition warnings and registry
metadata output are retained. Required full gates needed no independent retry.
Built release, bin/lykn and the standalone copy share SHA-256
`091c78283a3fda26ef106dda04bff109adc32a50138d11c175ff460d82f1e87c`.
Rust/Cargo 1.97.0 and Deno 2.9.6; all commands use both explicit existing DENO_DIR
and owned npm/XDG/tmp. Focused M6 receipt variables stay command-local.

[Raw archive](artifacts/increment-b1/cdc/receipts-3f197340.tar.gz) and
[navigation/digest](artifacts/increment-b1/cdc/README.md) preserve launch data,
statuses, streams, immutable baseline/configs, generated probes and comparison
receipts. Four supplementary-helper corrections and their initial failures
are retained: expression-context if missing else, an imported AST factory
shadowing array, redundant wrapping of multi-form expandExpr output, and Map
indexing instead of Map.get. They did not alter candidate source or require
repeating a full gate. No missing historical transcript was reconstructed.

No unresolved B1 software finding remains. Root retains planning Git/index,
ledger and parent status. This partial repair does not establish typed
OwnerRef/CaseRef, lexical owner/alias/forward semantics, qualified nominal
activation, precise DTS, purity or final migrations. The separate accepted-A
package-binding carryover is unchanged. S02 I4, historical fallback,
version-sentinel warm-cache, fixed-nine support-layout and browser run/load
limitations remain explicit. B1 acceptance closes neither LC-02 nor S03.

This reviewer returns source/build execution and CDC record/evidence ownership
to root. No subsequent implementation authority follows from this verification.

## IC-01 candidate 5bdbfe3c — 2026-11-11

**Verdict: HOLD for executable-region misses and a public scope regression.**
Candidate `5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe`, tree
`e0a95d7452f3a33529fb7bd7a75ab46289d7349e`, remains clean on
`codex/qualified-adt-core`. Independent review read the governing role contract,
issued iterations05/06, the 18-path inventory and relevant implementation/test
deltas, and CC index/failure disclosures.
No source/index repair, stage, commit, release or remote action occurred.

### Confirmed findings

- **IC-R01, correctness: function executable groups are truncated.** Native
  binding.rs::walk_source_function (~451) and public
  binding.js::walkSourceFunction (~243) visit only the first form following
  body/pre/post markers instead of the actual group grammar. The normal source
  `(func example :args () :body 1 (bind package 2) 3)` is accepted by native
  checked/stripped compile and check. Its actual emitted modules contain
  `const package = 2` and fail strict ESM parsing. Both direct binding validators
  accept the source; public final compile/expandExpr catch the later lowered
  declaration and reject correctly. Zero-argument shorthand and repeated-group
  last-wins behavior also require the actual existing parser semantics, not a
  second keyword-window approximation; those extensions are source-inspected
  obligations, not separately executed cases in this review.
- **IC-R02, correctness: native computed callee is omitted.** The fallback in
  native binding.rs::walk (~255) visits values.skip(1) even when the first value
  is a computed list callee. `(bind result ((do (bind package 1) (fn () 2))))`
  therefore compiles/checks successfully in both native modes, and both emitted
  modules fail strict parsing at a real const package declaration. Public
  validation/compile/expandExpr reject it correctly.
- **IC-R03, correctness: executable default regions remain unvisited.** Native
  first kernel-parameter defaults and kernel const destructuring defaults
  escape the gate. More seriously, class method parameter defaults escape
  **both backends**: `(class Example () (method ((default value (do (bind package
  1) 2))) (return value)))` succeeds in native checked/stripped compile/check and
  public validation/lykn/expandExpr. All emitted modules fail strict parsing
  at const package. Native/public walk_class_member/walkClassMember project
  parameter leaves but do not visit their executable defaults. Kernel parameter
  lists and declaration patterns also need their real pattern/default roles.
  A nested alias-local default is accepted by both direct validators; public
  final compilation catches it. Its native artifact contains older unlowered
  do/bind syntax, so that extra parse failure is not presented as an independent
  reserved-declaration oracle or a new emitter-repair assignment.
- **IC-R04, correctness: new public body-to-post scope rejection.** At root's
  request, the reviewer compared supported functions whose body declares bind
  as a callable and whose post predicate is `(bind eval 1)`, in both textual
  keyword orders. Both immutable B1 public versions compile and run true;
  candidate public validation, lykn and expandExpr reject both as an eval
  declaration. The new validation must follow actual body sequence scope and
  lowering order rather than textual group windows. Native body-before-post
  compiles/checks and runs true in baseline and candidate (checked/stripped at
  candidate). Native post-before-body already compiled to invalid predicate
  syntax at B1, `if (!const eval = 1;`, while candidate rejects it at the new
  gate. That separate preexisting native resolution/lowering limit is retained;
  this review does not silently make its general repair part of IC-01.
- **IC-R05, verification gap: macro fixture uses unsupported grammar.** The
  product/native macro negatives emit `(function (package) value)`, an anonymous
  plain-function shape unsupported by the established writer. They do not
  establish the required valid macro-produced function-parameter path. The
  reviewer additionally executed a supported macro that unquotes its caller's
  typed parameter AST into fn; actual checked/stripped native compile, native
  check and public compile reject it with the intended package parameter
  diagnostic. Retain this valid control in the corrected product oracle.

### Focused evidence and preserved scope

Canonical focused execution explicitly maps lang/ to current packages/lang,
not target/lykn/build. Existing public/parity tests pass **14/14**, native
binding units **29/29** (1,154 filtered), and kernel resolver controls **2/2**
(1,181 filtered). Green reported populations do not cover the new misses.
The five primary prohibited-region inputs above each pass native compile in
checked/stripped modes and check, then fail actual emitted ESM parsing. The
class-default case also proves a public complete/single-form expansion boundary
failure.
A legal class method that declares bind then calls it with global eval executes
and prints function through native checked/stripped and public output, with
empty stderr. Supplied-Set/trusted-marker/quote/template/label/type-role product
controls remain in the passing focused suite; no broader acceptance is inferred.

The actual DD-49 algorithm/tables are unchanged apart from one added blank line,
and compiler.js imports/reexports its existing name from the dependency-free
leaf. All five changed/new canonical/embedded module comparisons pass. The
guide diff is exactly the three authorized public-user replacements with
expected output unchanged. Internal kernel-lambda validation/resolver evidence
does not imply that the public escape whitelist accepts kernel:lambda; no new
lambda syntax is claimed.

Useful [raw receipts](artifacts/increment-ic01/cdc/receipts-5bdbfe3c.tar.gz) and
[navigation/digest](artifacts/increment-ic01/cdc/README.md) retain actual launch
conditions/status/streams, concrete sources/generated modules, first and second
bounded census, candidate ordering and immutable B1 ordering comparisons, pins
and mirror checks. The candidate release/bin hash is
`83b9b783d9e541c5dbcff90ac65b1ae2216f97122a381bb3ee24d7c7f358f60a`.
Baseline native ordering used the retained B1 copied release CLI with its
independently recorded `091c7828…` digest, not a rebuilt baseline. The public
baseline was git-archived from 3f197340. Rust/Cargo 1.97.0, Deno 2.9.6; both
explicit existing DENO_DIR and owned npm/XDG/tmp were used. A first macro probe
hit an existing quoted-keyword parameter-shape limitation; it was replaced by
the supported AST-argument macro, with both sources/observations retained.
One inventory helper's method-on-expression mistake and passing retry are
preserved. No historical raw transcript was reconstructed.

Following the substantive failure, no new full make check, docs, citation/size
gate or actual cold M6 delivery run was started on this known-failing candidate.
Those corrected-candidate independent gates remain required; CC's reported
gates retain their original attested status. IC-01 receives no acceptance.
Accepted A/B1, LC-02–08/S03 open status, original D1 source Func/class aggregate
carryovers, I4, warm-cache, legacy fallback and browser run/load limits remain.

Source/build execution and CDC record/evidence ownership return to root for
the bounded correction. Root owns architecture, planning Git/index and status;
no next implementation authority follows from this review.

## IC-01 correction01 independent software review — HOLD at b8a1fa17

Reviewed clean candidate `b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1`, tree
`d3e604b206cfedac1ec97a5932ba8b1bb5fca61f`, on codex/qualified-adt-core,
against issued iteration07/correction design and the eleven-path source delta
from 5bdbfe3c. The old HOLD archive and findings are preserved. Source/index
were diagnosis-only and remain unchanged; git diff --check passes.

Three independently reproduced findings prevent IC-01 acceptance:

- **IC-R06, correctness:** typed-parameter grammar is still selected at real
  non-parameter binding-pattern consumers. `(for-of (object (alias :value
  package)) (array (obj :value 1)) (console:log 1))` passes native checked and
  stripped compile/check, public direct validation, complete compilation and
  expandExpr. Actual native and public emitted ESM fail strict parsing at the
  real local package binding. `(bind (object (alias :value package)) (obj
  :value 1)) (console:log 1)` has the same native compile/check escape; public
  direct validation misses it but final/expandExpr gates reject after lowering.
  Corresponding safe-local loop and bind both pass all native modes and public
  compilation and actually print `1\n` with empty stderr. Thus these are
  supported grammar, not malformed fixtures. Native loop_names/catch_names and
  public loop/catch bindingsIntroduced call the default source projector;
  source-bind projection/default callers likewise require explicit binding
  grammar. The catch analogue is retained only as a confounded observation:
  its safe counterpart also fails existing lowering, so no catch runtime
  repair is inferred from it.
- **IC-R07, traversal contract:** public function defaults are visited twice.
  Direct walkBindings on `(function example ((default value (do (bind local
  (fn (:any inner) inner)) local))) (return value))` returns
  `[example,value,local,inner,local,inner]`. Typed fn and kernel arrow variants
  return `[value,local,inner,local,inner]`. Matched class-member and kernel
  declaration controls visit the defaults once. Public binding.js:179–184
  explicitly walks defaults, then the generic scope-plan traversal re-enters
  the header. This is not a claim that emitted runtime defaults execute twice.
- **IC-R08, diagnostic regression:** standalone `(func)` and `(genfunc)` each
  panic with exit 101 through native checked compile, stripped compile and
  check. binding.rs:538 slices `&args[1..]` when args is empty, preventing the
  established classifier missing-name/body diagnostic. Public compilation
  retains an ordinary error.

The old IC-R01–05 concrete witnesses now behave as intended at this pin:
late body, computed callee, parameter/class/declaration/nested-alias defaults,
and supported macro-produced typed fn receive reserved-binding diagnostics
through the applicable native/public gates. Both public body/post textual
orders actually execute `true\n`. Native body-before-post executes `true\n`
in both modes and passes check; its explicitly retained post-before-body
ordering limit rejects eval and is not claimed repaired. Positive actual
modules prove safe supported macro output (`0\n`), typed external package
alias key (`local-value\n`), last-wins body groups (`1\n`), and locally bound
class-method bind call (`function\n`). The macro definition alone remains an
inapplicable expandExpr first-form unit, not a new failure.

Canonical focused product tests pass **17/17** (3 parity + 14 role), native
binding units **30/30** (1,154 filtered), permanent native supported-macro
compile/check/stripped oracle **1/1** (181 filtered). The direct public parser
and clause-key Set reexport identities both compare equal. All seven
changed/new canonical–embedded comparisons pass. DD49 algorithm comparison
still matches apart from the known blank line. Focused public imports explicitly
map lang/ to current packages/lang, avoiding stale target staging. Both explicit
existing DENO_DIR and owned npm/XDG/tmp are recorded. Rust/Cargo 1.97.0 and
Deno 2.9.6; handed-off target/release and bin binaries share SHA-256
`ff84481bb13c29da730bde2fb1cdc937d85713907d19f3ad2e65ca192a2a9935`.

[Receipt index](artifacts/increment-ic01/correction01/cdc/README.md) maps all
sources, generated modules, launch conditions/status/streams, censuses and
inventory. [Archive](artifacts/increment-ic01/correction01/cdc/receipts-b8a1fa17.tar.gz)
SHA-256 is `26d6d7c93e21bd8830ff36dc5c59de668f0e142a3c74d64f740120856244d380`.
CC's missing historical Clippy raw stream remains disclosed as transcript-only;
intermediate 284ad97 gates are not relabelled final candidate evidence. No raw
history was reconstructed.

No new full make check/docs, committed citation check, browser budget gate,
cold M6 twelve-file/25-case delivery, or freshly rebuilt/copied release CLI
proof was started after the substantive failures. These remain unrun final
acceptance gates, not inherited independent passes. IC-01 remains HOLD; A/B1
acceptance is unchanged, LC02–08/S03 and B2 D1/native-ordering carryovers remain
open, and release0829 is unchanged. Source/build and CDC record/evidence
ownership return to root for correction; root retains planning Git/index/status
and architecture. This review grants no further implementation authority.

## IC-01 correction02 candidate e80f613b — independent acceptance

**Accept IC-01 only** at clean source
`e80f613baf8f52d7b8f42e05ac38e99c69513d46`, tree
`7376b33d7ca8e66942afd88036599e9e5e4bae35`, codex/qualified-adt-core in the
assigned contract-predicate-lowering worktree. Reviewed the six authorized
changed paths against issued iteration08, correction02 design, role contract
and slice plan v1.14. Source/index were diagnosis-only and remain clean;
git diff --check passes. The earlier two HOLD records remain historical.

### Corrected findings and preservation

R06's original keyword-key/package-local loop and bind inputs now reject
through actual native checked compile, stripped compile and check, and public
direct validation/complete/expandExpr. Their safe-local counterparts actually
execute `1\n` with empty stderr in both native modes and public output. Typed
nested-alias external package key remains legal and executes `local-value\n`.
Every inspected private projection/default caller explicitly selects the
producer's TypedParameter or BindingPattern grammar; public pattern helper
signatures remain fixed-grammar adapters and match grammar remains separate.
Loop/catch optional alias defaults have direct negative role controls. The
older catch safe-input emitter failure remains a limitation, not runtime proof.

R07's retained independent direct count driver now reports
`[example,value,local,inner]` for the named kernel function, corresponding
once-only fn/arrow counts, and unchanged once-only class/declaration counts.
Product/native controls additionally cover func/genfunc, anonymous generator,
fn/lambda/genfn, arrow and escaped kernel lambda. The public trusted-marked
lambda is distinguished from source typed lambda. Distinct same-name
parameters remain two occurrences; there is no global deduplication. The public
function branch now returns after its one parameter/default/body traversal.

R08's actual `(func)` and `(genfunc)` native checked/stripped compile/check
invocations exit1 with normal missing-name diagnostics, never101. Checked
splitting creates no invented binding; public complete/expandExpr retain
ordinary diagnostics. Reserved-name validation alone is not a grammar parser.

Prior independent R01–05 repairs remain applicable to unchanged shared parser
and computed-callee behavior and stay green in this pin's focused/full product
checks. The independent census also replays supported restricted/renamed macro,
typed alias, last-wins groups and body/post orders. Both public orders actually
execute `true\n`; native body-before-post does likewise checked/stripped and
passes check. Its explicitly retained post-before-body rejection is unchanged.
No new product blocker was found in this bounded independent review.

### Fresh independent gates and delivery

Canonical mapping targets actual packages/lang, avoiding stale target staging.
Focused public checks pass **20/20** (3 parity + 17 role), native binding units
**33/33** (1,154 filtered), and native CLI compile controls **43/43**
(141 filtered). Fresh full `make check` records numeric **exit0**, raw streams
and all-checks-passed marker: **1,187 language units**, **1,536 product tests
across67 steps**, **482 documentation tests once**. Committed-HEAD citations
pass exit0 with **64 documents/601 historical citations**. Browser gate passes
exit0 at **43,996 gzip bytes**, +16,366 over27,630, within80KiB.

Cold release-profile M6 passes **1/1 integration test** (5 filtered), all
**12 canonical/embedded/materialized byte comparisons** and actual **28/28
materialized public cases** (11 retained +17 role), through its recorded real
lang/ map. A separate copied fresh full-built bin CLI uses an empty standalone
directory and fresh owned XDG, proving macro42 delivery and actual shadowed
guard/error output. Twelve compiler files plus deno metadata match embedded
bytes. Copied package/normalized-if!/loop-alias/supported-macro negatives reject
in all twelve checked/stripped/check invocations. Legal property/global-eval/
bound-bind output compiles both modes, executes `property-ok\nfunction\n` with
empty stderr and passes check.

The normal browser compile adapter, explicitly mapped to the browser expander,
rejects package/normalized-if!/loop locals. Its actual fallback-import ESM runs
the expected TypeError/TypeError/Error results in an ESM-capable no-network
consumer. This is compileLykn output proof; indirect-eval run/load, CSP and
module-loader policy remain S06 limits. Seven changed/new IC mirror comparisons
also pass, DD49 algorithm comparison retains its known blank-line-only change,
and parser/Set reexport identities remain equal.

Fresh full-built bin and copied CLI SHA-256 is
`67dc1b6ad2881b9b80fabfc36544db90f7eb6f4d1c8577b5aff32f1189e75106`.
Later release-profile M6 compilation leaves target/release/lykn at distinct
`36fe67a4ae7e26d5df01245110b2a117ea2d8109fe682cd9ed2cbae4c3bd905f`;
both are recorded against the same source, without a false byte-equality claim.
Rust/Cargo1.97.0, Deno2.9.6, explicit existing DENO_DIR and owned npm/XDG/tmp
were used from focused launch onward. Existing warnings remain in raw streams.

[Independent evidence index](artifacts/increment-ic01/correction02/cdc/README.md)
and [archive](artifacts/increment-ic01/correction02/cdc/receipts-e80f613b.tar.gz)
preserve actual commands/statuses, sources, emitted modules, full/cold/browser
proof, counts and final pins. Archive SHA-256:
`a889c79e0a1fb50847b9a0dbe8edd975a45096b1a0bd9d75eaef46c32c93fd7a`.
First M6 launch101 was the reviewer's missing precreated evidence-directory
condition; the subsequent fresh cold fixture passes. A browser research helper
first failed because bare set! is unsupported; its original source/raw error
and corrected property mutation/pass are retained. Neither is a product
regression. CC's missing historical wrapped full status and transcript-only
failures/Clippy log remain disclosed; no historical raw log was reconstructed.

IC-01 is independently accepted. Accepted A/B1 are unchanged; LC02–08/S03 and
the retained B2 D1/native-ordering/catch-emitter obligations remain open. No
qualified syntax/purity or general resolver repair is accepted here. Browser
run/load, I4, warm-cache and legacy fallback limits remain explicit; release0829
is untouched. Source/build and CDC record/evidence ownership return to root;
root owns planning Git/index/ledger/status and architecture. No further
implementation, integration or release authority follows from this review.

## B2a root record of separate Sol source-readiness — 2026-11-12

Against immutable accepted e80f613b/tree7376b33d, separate Sol6.1High reviewed
root's B2 architecture and lexical-region recipe read-only. No runtime probe,
test, source/index edit or implementation acceptance was performed. Initial
readiness required three explicit dispositions: multi-clause default lowering
differs by backend; native genfunc accepts clauses it silently discards; class
bases include the class's own binding. Root adopted per-backend default carryover,
explicit multi-clause generator rejection and incoming-plus-own class base
scope, also specifying native source versus public lowered/sorted clause order.
Sol then found no remaining design contradiction and approved B2a for issue.

The revised recipe also makes original occurrence paths, actual incoming-
environment declaration checks and a private Single/Sequence result-slot tag
explicit, preserving macro phases/private metadata. Root issues iteration09;
B2-LX, B2b and LC-02–08 remain open. The review is source-readiness only and
does not settle B2b's eventual storage/consumer API or accept typed owners,
nominal runtime, purity, release integration or the later emission experiment.

## B2a candidate bcb98482 — 2026-11-12 independent HOLD

Separate Sol6.1High CDC independently reviewed the clean task source at
bcb98482fa9b32aa6f58df3e2249123e16924271,
tree72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9, and freshly checked its native
release build. No source edits were made. Root's dedicated source/build
ownership is returned clean after the bounded review. Full independent gates
were deliberately not run on the known-bad candidate.

**B2-LX: HOLD.** Three causal repair areas are reproduced in
[the independent index](artifacts/increment-b2a/cdc/README.md):

1. Native fixed-point macro results bypass renewed lexical/try_desugar
   priority: chained bound and car/cons witnesses execute99 while paired direct
   controls execute41. Adjacent pre-binding genfunc rejection also makes an
   ordinary bound call change from compile0 to compile1 when an unrelated macro
   activates pass2. This violates iteration09, although the inner loop itself
   predates B2a.
2. Public class defaults pass an Array to a list-node path helper and throw
   TypeError. The same valid source compiles and executes42 with immutable e80
   public code; candidate's no-default control also executes42.
3. Native named kernel:function loses its parameter role through incomplete
   prefix normalization. The escaped witness executes[7]; ordinary native and
   current public escaped controls execute7.

Actual emitted ESM, native/public Lykn fixtures/drivers, numeric command exits,
stdout/stderr, source/binary identities and the reviewed diff are retained.
The genuine dynamic alpha/beta chain retains its normal1000-limit diagnostic
and original alpha name; raw discard remains lazy. Failed loop/probe attempts
and authored-but-unrun fixtures are explicitly separated from findings in the
index. No fourth malformed-header finding is claimed from an unsuitable
throw-shaped macro-expression attempt.

[Evidence archive](artifacts/increment-b2a/cdc/receipts-bcb98482.tar.gz) SHA-256:
`d9d1b02c8ace3d9777f292e8e56eacd736f242b97858e27c2134182f668e2963`.
The archive contains the index, fixtures, generated outputs and raw receipts;
its external digest is retained at `artifacts/increment-b2a/cdc/archive.sha256`.

Root and CDC reconciled the original CC full log:1546 product passes/67steps/
0failures, docs482/0. Original1536 attestation text remains historical; the
raw excerpt/log digest identify the correction. This is not a fresh independent
full-gate claim. Full make/check/docs, cold M6, copied CLI/browser, citations,
size and complete prior-control disposition remain pending corrected software.

The current root iteration10 R01–03 correction mechanics, including bound
unsupported-form gating, were separately source-readiness reviewed and are
ready for issue. That verdict does not accept future software. Earlier A/B1/
IC acceptance remains unchanged; B2b, LC-02–08 and S03 stay open, with
B2-ID-NAME pending. No release integration or remote action occurred.

## B2a correction01 candidate804be5da — 2026-11-13 independent HOLD

Separate Sol6.1High CDC reviewed clean804be5daace5b0cb708ad21b3beb7eecbd5d00fa,
treed25f2b660d3de2e6f52b8ee890172f223c9abc80. No source edit was made;
source/build ownership returns clean to root after bounded verification.

**B2-LX: HOLD on new R04 actual enclosing-declaration transitions.**
The original R01–03 repairs pass focused independent checks: native runtime
4/4, bound-genfunc pair1/1, escaped function/generator header2/2 and canonical
public11/11, plus exact prior bound-chain41, escaped-function7 and class-default42
ESM replays. The initial native4 test attempt failed at a missing evidence
subdirectory before behavior; its exit101/4setupfailures remain separate from
the successful precreated-directory retry.

[Independent correction01 index](artifacts/increment-b2a/correction01/cdc/README.md)
records R04's causal witnesses: native resolver unconditionally applies a raw
binder projection after an ordinary bound bind call, causing a later array
literal to emit as array(7) and throw. Public and renamed native controls print
[7]. Native normal exported function and public escaped exported function lose
following visibility and print[1] instead of41. Native direct named default
export likewise prints[1], while public prints41. Both compilers correctly keep
a conditional default's function name expression-local and print[1]. Actual
materialized ESM and numeric statuses distinguish each case.

The bounded caller census covers native resolver/pass2/D2/shadow transitions
and all public actual-hoist/D2 callers. A shared dispatch-aware sites query
must preserve span/kind, use incoming scope, respect trusted-root/child
boundaries and select the actual consumed declaration/default slots. Raw binder
enumeration stays structural. Root's iteration11 mechanics were independently
source-readiness reviewed; they require no broader writer/name/owner feature.
Regression witnesses must fail baseline; paired retained positives already pass.

[Evidence archive](artifacts/increment-b2a/correction01/cdc/receipts-804be5da.tar.gz)
SHA-256 `4418170862beeb0d0673fb14f7d2180dde26af129365bd1adfcfee16b70fc9f1`.
The original B2a HOLD/archive remains unchanged. Current CC raw full1547/67steps/
482docs and46,418gzip were inspected/corroborated as CC evidence, not rerun or
converted to independent acceptance. CC chronology/setup/filter/receipt limits
remain disclosed. Fresh full/docs/coldM6/copiedCLI/browser/private/citation/size
independent gates were not run on known-bad software and remain due after repair.
A/B1/IC acceptance is unchanged; LC-02–08, B2b/B2-ID-NAME and S03 remain open.
No release integration or remote action occurred.

## B2a correction02 candidate595f672b — 2026-11-13 independent HOLD

Separate Sol6.1High CDC reviewed clean595f672b9991896754ba62a05c7c647dfaaeaa01,
treedd518b1bf339aac75e25a8459c67804f0559de72. Implementationf39bc18a and final
empty metadata follow-up have the same tree. Independent message inspection
confirms f39's missing Co-authored-by labels and595f's correct contiguous labels;
original history remains intact. No source edits were made; source/build
ownership returns clean to root.

**B2-LX: HOLD on R05 source-header validation/region selection.** Fresh native
focused7/7 and canonical public82/82 pass the exercised R01–04, macro extraction,
import, private predicate, host/type and browser ESM controls. Before any full
known-bad gate, supported get-null macro witnesses establish that malformed
named/anonymous/default typed headers execute selected body/default macros
before the authoritative parser diagnostic. A registration-only control with
the same macro and literal body returns the normal parameter-name error.
This replaces the earlier unsuitable throw-shaped probe with supported causal
execution evidence, without rewriting that old attempt.

An adjacent genfn witness also invokes a macro from :yields metadata that the
authoritative parser consumes and ignores. Exact source without the macro
definition compiles0 and executes41; the defined macro case exits1 from the
metadata null-property read. Its current generic lexical body paths disagree
with the parser-selected body boundary. No new annotation grammar is inferred.

[Independent index](artifacts/increment-b2a/correction02/cdc/README.md) preserves
all commands/streams/statuses, actual source/binary/metadata identity, native
per-case receipts, parser/caller census and class/kernel writer-authority
limits. The pure existing func/genfunc/fn/lambda/genfn parsers validate headers
and retain raw body expressions; preflight must preserve actual dispatch,
all-clause header validation, ignored-group laziness, exact Diagnostic/span and
canonical genfn metadata boundaries. Root retains the final correction03 recipe.

[Evidence archive](artifacts/increment-b2a/correction02/cdc/receipts-595f672b.tar.gz)
SHA-256 `c3c7f0404fb556dbe898bdaade59890d7bb552070763dba669e00c0dbc50c9cd`.
Earlier HOLD archives are unchanged. Independent full/docs/coldM6/copiedCLI/
fresh-staged-browser/full-fragment/citation/size gates were not run on this
known-bad candidate. Prior CC1553/67steps,1195unit,482docs,14/45cold and46503gzip
remain attestation, not CDC acceptance. A/B1/IC scope stays accepted; LC-02–08,
B2b/pendingB2-ID-NAME and S03 remain open. No release or remote action occurred.

### R05 genfn D2 addendum and correction03 readiness

The bounded ignored-payload control independently confirms both native and
public D2 visit `(bind eval 1)` inside consumed genfn :yields metadata and
reject it as a strict binding. Changing only the ignored binder to `ignored`
compiles0 in both; both actual emitted ESM programs execute0 and print41.
One public control tool call failed before process start because of a nonexistent
misspelled cwd; the attempt and distinct successful retry are disclosed in the
index. No missing process status was invented.

The complete draft iteration12 was source-readiness reviewed against held595f.
No concrete contradiction was found in actual-dispatch pure typed-header
preflight, all-clause ordering/None-layout coverage, exact Diagnostic propagation,
per-backend canonical genfn slots or explicit class/kernel writer limits.
This is readiness, not software acceptance. No further broad gates were run.

[Supplemental cumulative evidence archive](artifacts/increment-b2a/correction02/cdc/receipts-595f672b-r05-addendum.tar.gz)
SHA-256 `51dc4bf5d53a6cb8ee6c4b7047e5493c87d9b9088dbb5cea9f3e42b82d381e8e`.
Original archive SHA remains
`c3c7f0404fb556dbe898bdaade59890d7bb552070763dba669e00c0dbc50c9cd`.
Final source pin/tree unchanged, final source status empty; source/build ownership
returns clean to root. B2-LX remains HOLD R05; all wider owner/name/LC/S03 limits
above remain open.

## B2a correction03 candidate0e249caf — 2026-11-13 independent HOLD

Separate Sol6.1High reviewed clean0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11,13 authorized paths and correct
literal contiguous/parsed Codex+Billo trailers. Source was not edited.
Source/build ownership returns clean to root, with no active build/test job.

**B2-LX remains HOLD R05**, now in an adjacent actual native protected-host
consumer. Native genfn metadata `(set-symbol! Array "isArray" 1)` consumed and
ignored by the real parser is nevertheless visited by protected_host.rs735's
raw args[1..] body walk; actual compile exits1 at1:46 with the protected-slot
error. The paired actual-body write correctly exits1 at1:51. Native Genfunc
Surface handling likewise visits ignored clause.post; its inert-post fixture
and real-body negative both exit1. The established writer ignores generator
post, so this is another same-causal structural/executable role mismatch.

Actual canonical public genfn metadata compiles and actual emitted ESM prints41
(exit0); the real-body write correctly rejects. Direct raw-source invocation of
the deep public protected validator rejects metadata too, but its documented
input is expanded/kernel units, so this is not claimed as a supported-public
source API regression or a new source-validator requirement. The initial
keyword-key pair is not a valid rejection oracle because current protected
proof accepts literal string keys only; both preserved keyword attempts compile0.
No protected-key policy expansion is inferred.

R05's implemented header and D2 controls pass focused independent replay:
8 native integration tests (6 filtered),85 canonical public tests, and a separate
Lykn public replay with10 expected diagnostics plus5 actual ESM runtime positives.
Fresh make fresh-artifacts passed. R01–04 exercised cases remain green.
Helper isolation/oracle and missing-else attempts are preserved separately;
no candidate product failure was hidden. Original HOLD archives remain intact.

[Independent index](artifacts/increment-b2a/correction03/cdc/README.md) preserves
source facts, exact route limits, commands/env/raw streams/statuses and all
attempts. [Evidence archive](artifacts/increment-b2a/correction03/cdc/receipts-0e249caf.tar.gz)
SHA-256 `91564bbcccc497e527aad1c6b82b08be28af609806c699ac1a2d0a339c3cbd82`.
No full make check/docs/native1195/product1556/67steps, coldM6 fourteen/48,
complete copiedCLI/private/Reflect/completion/browser-delivery, committed cites
or gzip gate was independently run on known-bad software. CC's figures remain
attestation. Its preserved size arithmetic is reconciled against correction02
actual46503: current46600 would imply+97 and35320 headroom, not its prose values.
No independent current gzip claim follows. Root owns the next repair recipe.
A/B1/IC remain accepted within prior limits; B2b/pendingB2-ID-NAME,LC02–08 and
S03 stay open. No release/integration/remote/dependency or source Git action.

## B2a correction04 candidate f9be7cb8 — 2026-11-13 independent acceptance

**Accept B2-LX only** at clean
`f9be7cb85f62513f1624964fcc6773bffe4f66fe`, tree
`0ea27d21f759e0c068e8f655b14f43a1a5f20452`, codex/qualified-adt-core in the
assigned task worktree. Separate Sol6.1High reviewed the four authorized-path
candidate and complete CC chronology/raw claims, issued13 and original09–12
contracts, with the preparatory twelve-row matrix. Correct literal contiguous
and Git-parsed Codex/Billo trailers independently confirmed. No source edit,
source Git/index mutation, release or remote action occurred. Final source
status is empty; no active test/build job remains. Source/build ownership
returns clean to root, who owns planning Git/ledger/status.

The R05 host-policy carryover is resolved: native Surface Fn/Lambda/Genfn now
uses parsed typed params and selected body, ignored genfn annotation payloads
stay structural, Genfunc post is excluded from both names and visits, and
real typed parameter leaves replace external nested alias keys in the private
scope helper. Ordinary Func post, generator pre/body/defaults and actual
global protected writes retain diagnostics with target spans. Raw Kernel
patterns/error fallback/public expanded-kernel validator domain stay bounded.
No new public source validator or raw class/kernel header grammar is claimed.

The [independent index and twelve-row disposition](artifacts/increment-b2a/correction04/cdc/README.md#final-independent-verdict--accept-b2-lx-only)
records original clause/member isolation, native semantic post/body order,
actual-result declaration sites/wrapper slots/imports/source-only macro
collection, per-step macro priority/limit/lazy arguments, original occurrence
paths/Single–Sequence/private identities, generator non-features and all
retained A/B1/IC/completion obligations. No original B2-LX row is omitted.

Fresh independent observations:

-15 native host-policy tests,4 CLI tests/49 captured rejection-route
observations,8 native B2a macro tests pass. Source-only alias/hole/rest/default
controls independently prove the source helper instead of relying on a later
Kernel rejection.
-7 native programs pass checked compile, stripped compile and check, with14
actual ESM runtimes: original clauses/classes, both textual post/body orders,
constructor/getter/setter/static/async/default/field/base member controls,
ignored genfn protected metadata and ignored Genfunc post. Nested-block names
do not leak into post in native/public negatives.24 malformed-header routes
retain ordinary diagnostics and no body/default probe effect.
-Canonical public focused130 cases/43steps passes semantic-roles/dd-50/lazy
Reflect/private fragments/runway/lexical/binding/type-state/browser controls;
separate public R05 replay passes10 expected diagnostics and5 actual ESM
positives. Original match14 expectations/fixtures remain unchanged.
-Single fresh final-source **make check exits0**: **1197 native library units,
1557 product cases across67steps,482 documentation cases once**, all checks
passed. CC's earlier full1556 preceded its last test-only addition; raw snapshot
and unchanged production hashes corroborate that chronology, without pretending
its old count included the new test.
-Fresh cold M6 passes1/1,13filtered, all **14 canonical/embedded/materialized
byte comparisons**, actual **49 materialized public cases** (5+6+17+21), copied
CLI/no-canonical-cwd/absent owned compiler-cache assertions. Fresh workspace
browser artifacts precede this; compiler-XDG delivery is cold, not the entire
workspace/Deno cache.
-An independent copied full-built CLI with separate empty owned XDG executes
macro42 and shadowed guard/no-match controls. Canonical AND actual independently
materialized all-nine helper each passes27 runtime checks,3 fragment rejections
and shared identity; Reflect helper each executes2 runtimes and verifies
fragment/orphan rejection plus recovery. Actual freshly staged browser adapter
using materialized lang modules emits3 ESM programs that execute correctly.
-PostHEAD citations pass0: **64documents/601historical citations**. Browser
size passes0: **46600 gzip bytes**, baseline27630,delta18970,**35320 bytes below
81920**. This equals correction03 size; no public production bytes changed.

Two authored evidence mistakes remain preserved: class-only assign in a new
top-level setter probe (distinct retry uses set!), and a hyphenated object-key
assertion instead of emitted sharedReferenceNode (distinct retry/output dir).
The copied CLI's native no-match TypeError differed from an initial author
Error assumption; actual generated native writer/observed stdout are retained.
A read-only .stdout.txt/.bin receipt lookup miss was corrected. No candidate
product gate failed, no source repair or full-gate retry was needed, and no
missing raw process result was reconstructed.

[Raw evidence archive](artifacts/increment-b2a/correction04/cdc/receipts-f9be7cb8.tar.gz)
SHA-256 `36ea6ae95822b2fd99f3bd0514ce71a95ba8fc75e947702fb8fe72b0fee076e4`.
Built bin/independent copied CLI SHA-256
`392508e4fe361b7177d9c891f33bf9913fdd5e746f112cadc27b5a3f472f979e`.
All owned XDG/npm/TMP paths were precreated under /private/tmp outside repo/
config ancestors; existing DENO_DIR reused. No caches/executable in archive,
forbidden helper language, dependency or release/remote action. All prior HOLDs
and archives survive unchanged.

B2-LX acceptance does not establish typed OwnerRef/CaseRef, name/alias/forward
semantics, qualified nominal runtime/DTS, initialization purity or overall S03.
B2-ID-NAME remains unanswered and dependent B2b held; LC02–08 remain open.
Accepted A/B1/IC limits persist: provisional fixed-nine support layout, I4,
legacy fallback, sentinel warm cache, catch-emitter limitation, public API/S06
migrations, multi-clause simple-default backend difference, nested alias guard/
annotation issues, and browser indirect-eval run/load/CSP/module policy. Actual
browser proof is compile-to-ESM. No next implementation/integration follows
automatically from this clean handback.

### B2-LX index wording clarification and final packet

Root requested that LX10's unchanged-public-corpus claim be precisely scoped:
within `test/`, the cumulative e80→f9 delta changes only
expander/lexical-regions.test.js; native test files also changed and are
separately inventoried. The README now says this explicitly. The earlier broad
wording was a reporting imprecision, not a product defect. No runtime rerun,
source edit, verdict or denominator change.

The first archive above remains byte-preserved at SHA25636ea6a…076e4.
The [final corrected packet](artifacts/increment-b2a/correction04/cdc/receipts-f9be7cb8-final.tar.gz)
includes the qualified index and this correction's command record; SHA-256
`a0e7b5673e31c18c5376418d646f60bf1e81d32f1a04cc98bc74d87addc90017`.
The clean f9be7cb8/tree0ea27d21 source/build handback and B2-LX-only acceptance
remain exactly as above.

## B2b1 candidate cf432622 — 2026-11-13 independent validation HOLD

**B2-UNIT remains HOLD U01**, despite passing compiled-code gates. Separate
Sol6.1High reviewed cleancf4326224ccfd992cf9abf6f9f943375c5305fb0,
tree27419cb322612374e036e14ea7e469243cf75eeb, oncodex/qualified-adt-core.
Implementationd787231a (8authorized paths) and the distinct one-path match
oracle followupcf432622 are preserved, with literal and Git-parsed contiguous
Codex/Billo trailers. No source edit/index mutation or release/remote action.
Source/build ownership returns clean to root; no active build/test remains.

Production AnalyzedUnit privacy is correct, but its construction compile_fail
uses `AnalyzedUnit {}`. That would still fail if public fields were omitted,
so the negative does not discriminate the claimed privacy invariant. Current
Rustdoc stderr reports private fields, yet the alternate missing-fields failure
cause makes this oracle insufficient. The old separate forms/registry emitter
arity negative is discriminating. Root accepted U01 as a bounded validation
finding and prepared iteration15, not a runtime/API rewrite.

Complete draft iteration15 is independently source-ready: its literal supplies
all three actual fields—forms Vec, TypeRegistry::default(), diagnostics Vec—
with existing valid public imports and inferable field types. Private fields
are the only remaining rejection cause. No mutation test/source edit/build was
performed for this readiness check. Root owns issue/design and planning Git.

The current implementation otherwise preserves the original analysis algorithm
and ordered diagnostics, owns the matching forms/registry in a success-only
unit, and removes canonical unrelated registry/form pairing. Compile and dist
retain their prior error filtering, spans/suggestions, filenames and warning
asymmetry; module DTS borrows the same unit as JS/kernel/JSON. Existing raw
fragment/leaf DTS/kernel-codegen contracts remain explicit. AnalyzedUnit means
analysis success, not complete nested syntax/codegen success or a nominal graph.
The strengthened Entry match fixture actually consumes registry field metadata
and passes interleaved ESM3/three; constructor-only prior evidence is not treated
as discriminating metadata proof.

[Independent index](artifacts/increment-b2b1/cdc/README.md) preserves full
source/caller review, U01, iteration15 readiness and exact observations:

-22analysis tests;22cross-compiler+18e2e+9emission tests;2normal and2compile-fail
Rustdoc examples pass (U01 qualification retained).53CLI API tests and3validation
parity tests pass after fresh-artifacts0.
-Reviewer Lykn CLI proof executes both different-field Entry units checked/
stripped and JSON→actual public compiler→ESM (6runtimes), own DTS fields/types,
analysis failure/suggestion filtering then recovery, compile analysis+DTS
warnings versus dist DTS-only warnings, and dist analysis-error source path.
-Public preservation54cases/43steps passes lexical/type-state/private/Reflect/
completion/browser ESM controls. A/B1/IC/B2-LX remain applicable within prior
limits; no public/embedded production module changed.
-Single independent FINAL-cf **make check exits0**: **1199native library units,
1557product cases/67steps,482docs once**. Full stderr176 records22generated doc
files/482blocks/15skipped. It includes the final match-oracle delta; CC's earlier
full snapshot remains separately pinned to d787.
-Full gate's exact inner cold M6 receipts establish **14byte comparisons**,
actual extracted lang mapping/fresh staged browser and **49materialized public
cases**, copied CLI/no canonical cwd/absent compiler-XDG assertions. No duplicate
M6 solely for command naming. Independent separate copied full-built CLI,
absent owned delivery-XDG, macro→Entry match executes3 and emits own A/left:number
DTS/exported Entry. Binary SHA256
`0ff85708c7c8a51672e1891cad8cffe0215243586b945aa5c07ed9b60dce34f3`.
-PostHEAD cites0=64documents/601historical. Browser gzip46600,baseline27630,
delta18970,headroom35320 under81920. All raw streams/numeric statuses retained.

[Evidence archive](artifacts/increment-b2b1/cdc/receipts-cf432622.tar.gz)
SHA-256 `0864bc473e988c6d9c2cbe6c2cf490249d8a8aea5f524b880ba1ba1f5c1b660d`.
No independent author/setup/product test failed; expected negatives remain
explicit. Truncated combined reads were recovered before tests. CC's earlier
span-method/stale-bin/format/status-file provenance remains unchanged in CC
records. All owned XDG/npm/TMP dirs were precreated outside repos/config
ancestors; existing DENO_DIR reused; no caches/copied executable in archive or
forbidden helper/dependency/remote action.

Root permits conditional retention of this compiled-code/runtime/CLI/full/cold/
size evidence only after actual successor diff is verified strictly Rustdoc-only.
Corrected Rustdoc and finalHEAD provenance/citations must be independently
rerun; no advance acceptance or semantic validation bypass is inferred. Full
repetition solely for a new comment-only commit name is unnecessary absent a
new concern. B2-UNIT cannot close until U01 is resolved.

Two requested naming-author baselines are separate in increment-b2b/cdc at cf:
outer some-name1/parameter someName2 prints2 (known unimplemented hygiene, not a
unit HOLD); exact entry→later helper program prints41. Both direct CLI/ESM
routes exit0. They do not implement or accept the resolved name policy.

B2-ID-NAME is resolved as policy; binding allocation/hygiene, OwnerRef/CaseRef/
field TypeRef, nested transport/private public requests/nominal activation,
check_strict/dev semantic join, DTS/API/purity/S06/consumer/book/human and
LC02–08/S03 remain open. Accepted A/B1/IC/B2-LX limits persist, including fixed-
nine layout, I4, legacy fallback, warm cache, catch-emitter, multi-clause defaults,
nested alias runtime/annotation guards and browser eval run/load limitations.
No source integration or subsequent implementation follows automatically.

## B2b1 correction01 5554a4d6 — 2026-11-13 B2-UNIT acceptance

**B2-UNIT accepted; U01 resolved.** Independent Sol6.1High reviewed clean
5554a4d6bd0aa66bbca3cedfd91a41e0f1cf86cb,
treef632c415b833e796e6843abdc5220d6492595fc0, codex/qualified-adt-core.
Actual diff versus cf432622 is exactly one Rustdoc-only file (8insertions/
2deletions), no production/signature/test input change. Literal and Git-parsed
contiguous Codex/Billo trailers match. No source or Git/index edits.

The repaired literal includes all three actual fields using valid public
TypeRegistry import/Default and inferred Vec types. Independently rerun
Rustdoc exits0:2normal+2compile-fail,0failed. Actual stderr for the complete
literal is solely E0451 on forms/type_registry/diagnostics; no omitted field,
import or type failure. The separate legacy emitter-call negative gives E0061,
so the two controls remain distinguishable. Privacy/immutability and canonical
analyze→AnalyzedUnit→JS/JSON/module-DTS signatures match issued14/15. No public
constructor/parts/mutator/Clone/Deserialize/registry escape exists. Algorithm,
ordered diagnostics/spans/suggestions, compile/dist warning/error asymmetry
and raw fragment contracts remain as independently reviewed at cf.

Current-HEAD cargo fmt --all -- --check0 and make check-cited-paths0
(64documents/601historical) pass. Under the expressly conditional retention
direction, actual strictly doc-only diff makes the cf compiled-code evidence
applicable: focused22analysis,22cross+18e2e+9emission,53CLI+3parity; interleaved
registry-dependent Entry MATCH/JS/JSON/DTS and6ESM runtimes3/three; actual
analysis-failure/recovery/compile-dist warnings/path controls;54public cases/
43steps; one final-cf full make check **1199native/1557product/67steps/482docs**
(22files,15skipped); cold **14module byte comparisons/49materialized cases**,
actual staged browser/copied CLI/absent owned cache mapping; separate copied
CLI MATCH/DTS; identical-input browser gzip **46600<81920**,35320headroom.
No redundant full/product/CLI/M6/size run solely for the new doc commit. Retained
binary hash is explicitly cf-built, not asserted as a new-HEAD binary hash.

[Correction index](artifacts/increment-b2b1/correction01/cdc/README.md) records
actual scope/API/privacy/retention and limitations. [Frozen correction packet](artifacts/increment-b2b1/correction01/cdc/receipts-5554a4d6.tar.gz)
SHA256 `7b12443b0f93852b3059f8f64d12008aeb79ab2187ffe74b5a5977008cac8932`.
Prior cf HOLD/index/archive remain byte-preserved; prior archive SHA independently
reconfirmed0864bc473e988c6d9c2cbe6c2cf490249d8a8aea5f524b880ba1ba1f5c1b660d.
All current commands/env/raw streams/numeric statuses and final source pin/
metadata/full diff are retained. No correction author/setup/product failure;
expected compile failures remain explicit. All own tmp/cache paths precreated
outside repos/config ancestors, existing DENO_DIR reused; no caches in packet.

Only this native owned-unit boundary closes. B2-ID-NAME policy is resolved,
but naming runtime2 baseline is still unimplemented hygiene, not acceptance.
Binding allocation/identity/OwnerRef/CaseRef/fieldTypeRef/nominal activation,
private public requests/nested transport/purity, check_strict/dev join, final
DTS/API/S06/consumer/book/human and LC02–08/B2b/S03 remain open. Accepted
A/B1/IC/B2-LX and their fixed-nine/I4/fallback/warm-cache/catch/default/nested-
alias/annotation/emitter/browser eval limits persist. Browser proof remains
compile-to-ESM. No release/integration/dependency/remote action follows.

Source/build returns clean at exact5554a4d6/treef632c415 above, with no active
build/test. Root owns planning Git/ledger/status and subsequent implementation.

Post-freeze bookkeeping note: first archive-check invocation ran at slice cwd,
while the checksum file contains an archive-relative basename, and exited1
with file-not-found. Rerun from the packet cwd verifies **OK/0**; see external
correction01/cdc/postfreeze-checksum.txt. Frozen packet/hash are unchanged.
This setup error occurred after the recorded product/doc/provenance gates and
does not alter their results or B2-UNIT disposition.

## B2b2 native ICU 228e8c99 — 2026-11-13 independent acceptance

**B2-ICU-N accepted only** by separate Sol6.1High at clean
228e8c99707e5dc4ee86a50e8aea532c9a99a80b,
tree5a2c9a4ba836aaf6e34ef63c04f08b7f47621877, codex/qualified-adt-core.
Exactly3authorized paths: native codegen names/ICU and existing ICU integration
tests. Literal and Git-parsed contiguous Codex/Billo trailers match; source
status empty. Source/build returns to root; no active job/source/Git/index or
ledger/status mutation, release/integration/remote/dependency action.

Reviewed full issued16/AGENTS/actual diff/current affected bodies/caller census
and CC index SHA f59a3c8365605204806e653c60cc09b0be08119d4aff6ce89f7439872d19c538.
Borrowed source Atom/List/Cons scan reserves actual normalized lexical roots
before any hoist; immediate checked allocation shares one per-template set
across hoists/selectors/every recursive MFT branch and literal/test helpers.
No ordinary binding policy, API/unit/metadata/JSON/public source behavior was
rewritten. Original evaluation/IIFE/exception/HashMap consumption stays bounded.

Independent31ICU library+27integration tests pass with new runtime cases
requiring Deno and checked subprocess success. Source/normalized/colon/suffix
capture, a-b/aB11|11|40|40, actual hoist-selector overlap7 7, nested selectors/
independent templates, safe preferred names, exact once-only effects, inert
once-reference branch, original exception and invalid/recovery controls pass.
Fresh debug canonical CLI original fixture checked+stripped compiles/runs0,
exact3 3. Separate reviewer canonical10line matrix both modes compile/runtime/
cmp0 proves source→owned-unit→native writer route and eager repeated branch-
only once versus once-reference laziness ([2]→[2,99]). Original ICU boom runtime1
and missing-other compile1 with normal1:24 diagnostic are expected negatives;
recovery0/3 3. No reviewer author/setup/product failure.

ONE fresh final-source **make check0** includes docs once: **1199native library,
1557product/67steps,482docs**; rawfull stdout1791/5170/5679/5683 establishes counts/
final marker, stderr174 says22generated docfiles/15skipped. Existing private host/
Reflect/completion/owned-unit/API/JSON and public preservation suites pass.
Exact same full's inner cold M6 receipts establish **14byte comparisons true**,
**49actual materialized public cases0failed/status0**, copied standalone CLI/
absent owned compiler-XDG/no canonical fallback and fresh staged-browser mapping.
No redundant full/docs/M6 run. This existing49population is public preservation,
not unimplemented public ICU repair proof. Existing Deno cache reused; cold
claim is owned compiler-XDG+standalone, not all workspace/tool caches.

Separate copied full-built releaseCLI outside repo/canonicalcwd, empty owned
delivery-XDG, compiles/runs reviewer matrix0/cmp0. Source bin/copy SHA256
0aebdeac69d4b63a07c27a9def84b58973d09b851d2c006ae2a2b857179cfdc1.
FinalHEAD citations0=64documents/601historical. Fresh browser size gate0:
raw361569/min172901/gzip**46600<81920**,baseline27630/delta18970/headroom35320.
Size stderr reports Download registry.npmjs.org/esbuild plus existing astring
condition warnings, so this gate is NOT fully offline; no manifest/lock or
new dependency changed. Raw acquisition/warnings remain. CC first format1/
Clippy2 let_and_return and filtered M6 after missing full receipts are preserved
as CC chronology, not erased/inherited as independent results.

[Index](artifacts/increment-b2b2/cdc/README.md) records exact source/gates/limits.
[Frozen packet](artifacts/increment-b2b2/cdc/receipts-228e8c99.tar.gz) SHA256
`6705f978abfc03958577897b2d2d4573088e527e487bc9ae5eec2455f0f677c4`, checkedOK0.
Commands/env/raw streams/status, fixtures/generated ESM, metadata/full diff and
M6 inner receipts retained; no caches/binary or forbidden helper in packet.
All own tmp/XDG/npm precreated outside repos/config ancestors; existing DENO_DIR.

A/B1/IC/B2-LX/B2-UNIT and their fixed-nine/I4/fallback/warm-cache/catch/default/
colon-triviality/nested-alias/annotation/emitter/browser eval/fragment limits
persist. Public ICU, ordinary distinct-spelling binding allocation/hygiene,
OwnerRef/CaseRef/fieldTypeRef/private public requests/nested transport/nominal/
purity/check_strict-dev join, DTS/API/S06/consumer/book/human and LC02–08/B2b/S03
remain open. After gates, corrected unissued public recipe test-home conflict
was rechecked resolved; draft17 still requires final accepted-native pin and
root issue. No public software acceptance follows. Root owns planning Git,
ledger closure and next source/build transfer.

## B2b2 public ICU 57c76c99 — 2026-11-13 independent acceptance

**B2-ICU-P accepted only**, separate Sol6.1High, clean
57c76c99cbed07ff992e78aac8afefa4bdf0b2ad,
treef044d795e88c3dac8e84a73a557cf071edd5327c, codex/qualified-adt-core.
Exact5authorized paths, mirrorcmp0 and literal/Git-parsed contiguous Codex/Billo
trailers verified. Source/build returns clean to root, no active test/build or
source/Git/index/ledger/status changes. No release/remote/dependency action.

Reviewed full issued17/recipe/AGENTS/actual compiler+test+M6+parity diff and
CCindex390914710182cd18e7edbeef94de2e82639746c62cdc9b4a6f8cb7064a3e6bc4
(snapshot retained). Per-template private closure scans actual compiled AST
Identifier names before any allocation, preserves AST/PROVISIONAL identities,
shares immediate-reserving checked names across all hoists/selectors/recursion
and literal-only dispatch; ambient counter removed. Public API/grammar/runtime/
private protocol/native production untouched. Map/effect/IIFE/error boundaries
preserved; no generic cyclic-input or ordinary source-binding hygiene claim.

Fresh stage0 then **128focused public cases/43steps**, **28native/public ICU**
pass. Six real groups prove canonical source/normalized/root/suffix/a-b+aB,
true sharedhoist/selector7 7, nested templates, exact once-only values/effects,
original exception, inert once-reference versus eager repeated branch-only
work, real fragment AST plus whole-module recovery and staged browser ESM.
Trusted private raw API uses actual original3atom saved-call node, same forms,
normal and moduleReflect fallback both runtime14 14/[10], no pending callee.
No source-looking trust forgery/clone or browser-source producer claim.

Reviewer supplements product coverage honestly: actual canonical _v0 select
ESM0/Owner (product canonical select uses owner, raw parity uses _v0); repeated
compileExpr(expandExpr(form)) around actual invalid template yields3CallExpressions,
true/true JSON equality and retained correct original/generated Identifier AST.
Returned fragment itself is inspected, not executed. Small new evidence logic
is Lykn. First helper invocation wrongly used --no-config/--no-npm while
importing compiler's existing astring dependency: setup1/downstream absent
output1/copy miss retained. Corrected existing compiler config/cached-only/no
remote-network invocation0; generated select module0. No product HOLD/failure.

ONE independent final-source **make check0**: **1199native library,
1563product/67steps,482docs once**; rawfullstdout1791/5178/5687/5691 andstderr174
(22generated docfiles/15skipped). Exact same full innerM6 proves **14module
comparisons true**, actual **55materialized cases0failed/status0**
(5+6+17+21+6), true copiedCLI/absent owned compilerXDG/no canonical fallback,
lang→materialized and browser→fresh stage. Nested command explicitly selects
new6group file/private imports; no duplicate full/docs/M6 gate. Existing Deno
cache reused; cold scope is owned compiler cache/copiedCLI, not all tools.

FinalHEAD citations0=64documents/601historical. Fresh browser raw363450/
min173685/gzip**46857<81920**,headroom35063; historical27630/delta19227,
**+257**versus accepted46600. Existing esbuild Download/astring warnings retained;
size gate is NOT wholly offline. No manifest/lock/new dependency changed.

[Index](artifacts/increment-b2b2-public/cdc/README.md) records six-group verdict,
source/gate readback/limits and expected negatives versus setup chronology.
[Frozen packet](artifacts/increment-b2b2-public/cdc/receipts-57c76c99.tar.gz)
SHA256 `3163d4a2cbb81ec5c3278e527f80953b653154202fbd97ac0d7b205f02f6a2b8`,
verifiedOK0. Commands/env/raw statuses/streams/generated ESM/fragmentJSON/full
provenance+diff/M6 receipts retained, no caches/binary. Own tmp/XDG/npm dirs
precreated outside repos/config ancestors; existing DENO_DIR used.

CC emptycache selection miss, authoredduplicate_v0/eageroracle/unbound_n,
pretestfullformat and50receipt relocation remain unchanged in CC chronology;
actual command/env/status bytes and canonical mapping were read. Byte-move is
retained CC/root provenance, not independently replayed migration or a product
finding. Original CC policy-unresolved prose is erroneous and not inherited:
B2-ID-NAME policy is resolved, implementation open. Current independent results
stand on fresh final-source receipts, not CC attestation or failed gates.

A/B1/IC/B2-LX/B2-UNIT/B2-ICU-N remain accepted within fixed-nine/I4/fallback/
warm-cache/catch/default/colon-triviality/nested-alias/annotation/emitter/fragment/
browser indirect-eval limits. Browser proof remains compile-to-ESM. Ordinary
source identity/allocation/hygiene, OwnerRef/CaseRef/fieldTypeRef/nested transport/
private public requests/nominal/purity/check_strict-dev join, DTS/API/S06/consumer/
book/human and LC02–08/B2b/S03 remain open. Runtime-name draft B2b3 is unissued;
no new catch grammar or source-name/owner acceptance follows. Root owns planning
Git/ledger closure and any subsequent implementation issue.
