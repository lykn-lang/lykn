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
