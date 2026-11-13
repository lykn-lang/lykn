# Increment A checkpoint — protected host foundation

**S03 remains open.** This is the CC implementation checkpoint for increment A,
not a slice closeout or independent acceptance. The ledger remains unchanged;
LC-01 through LC-08 remain open pending their assigned work and review.

## Source handoff

- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Branch: `codex/qualified-adt-core`
- Baseline: `0829e892999890e8877dec5e35cd249753e1be5d`
- CC commit: `5a8aedc5dcd6329da7b5f33a5397126a45891bac` (`feat: add protected host contract v2 substrate`)
- Source worktree is clean. Commit contains only the named A source, docs, embedded payload and product-test paths.
- Increment A gate receipts and final browser/build logs: [`artifacts/increment-a/gate-results.md`](artifacts/increment-a/gate-results.md), [`make-check-final.log`](artifacts/increment-a/make-check-final.log), [`browser-size-final.log`](artifacts/increment-a/browser-size-final.log).

## Implemented boundary

The native host reference identity is private metadata on `SExpr` (`crates/lykn-lang/src/ast/sexpr.rs:55`, `:259`). The finite host support planner handles nine references and offers both ordinary kernel lowering and a raw writer lookup while retaining pointer anchored invocation requests (`crates/lykn-lang/src/codegen/host_references.rs`; composition test at `crates/lykn-lang/src/codegen/mod.rs:184`). Public references use a private WeakMap (`packages/lang/compiler-private-atoms.js`); public complete expansion and compile boundaries lower them (`packages/lang/expander-core.js:1690`, `:2309`; `packages/lang/compiler.js:25`, `:2357`). `compileExpr` and native fragment JSON reject unfinished references.

Requested intrinsics become collision-free top-level aliases after directives. A requested host root bound in the unit uses a feature-local import from the fixed inline data module, retaining the user binding. The inline ESM fallback executed in both a native CLI fixture and the browser compiler's ESM consumer test (`test/fixtures/semantic-roles/host-reference-shadowing.lykn`; `test/forms/browser-host-reference-compile.test.js:4`). The separate existing Reflect invocation protocol stays restricted to its validated Reflect.apply request; composition coverage is at `crates/lykn-lang/src/codegen/mod.rs:184`.

Native JSON APIs now expose the authorized typed result boundary: `sexpr_to_json(&SExpr) -> Result<Value, LyknError>` rejects a fragment reference, and `emit_module_json(&[SExpr]) -> Result<String, LyknError>` lowers complete units itself (`crates/lykn-lang/src/emitter/json.rs:20`, `:65`). CLI and test callers were migrated. Whole-unit e2e checks assert the exact support alias set and preserve the export/async node (`crates/lykn-lang/tests/e2e_tests.rs:119`).

Protected-host v2 protects roots `Reflect`, `Symbol`, `Object`, `Number`, `Array`, `Promise`, `TypeError`, `Error` and exact slots `Reflect.apply`, `Symbol.for`, `Object.freeze`, `Object.defineProperties`, `Number.isNaN`, `Array.isArray`. Existing scope, normalization, alias invalidation, unknown-proof and mutator behavior is retained (`crates/lykn-lang/src/protected_host.rs`; `packages/lang/protected-host.js:13`, `:525`). Diagnostics say `host-contract v2: write to protected slot <slot>`. The source contract is updated in `docs/host-contract.md`.

Six canonical public compiler files were synchronized into the crate-owned embedded package copy. The successful full gate includes the embedded cold-cache delivery test (`make-check-final.log`). No new dependency, nominal syntax activation or purity claim was introduced. The compiler's browser `run`/`load` still indirect-eval generated code and cannot execute the static inline ESM fallback; that compile/run boundary is for S06.

## API and downstream handoff

- Rust JSON callers must handle `Result` from both fragment and module serialization. This is the intentional 0.6 breaking signature change.
- Public `compile()` and complete `expand()`/`expandExpr()` return self-contained ordinary forms/source with support declarations as needed. `compileExpr()` rejects an unfinished compiler-private reference rather than emitting its marker.
- Generated JavaScript may gain support declarations or a named inline data-module import when the module shadows a referenced host root. With no compiler-owned request, output remains unchanged.
- Diagnostic expectations migrate from v1 to v2. Browser compile can return the ESM text; browser eval-based run/load do not gain inline-import support.
- Alias/import initializers are not pure and carry no purity annotation. LC-06 remains for later reviewed work, including their ADT initialization-graph implications.

## Review and ownership

The finite host substrate is ready for the separate Sol source review. This checkpoint does not disposition LC-01 as accepted and does not authorize increment B/C. Root owns the planning Git commit, parent plans, index and subsequent acceptance/CDC work. CC owns only source commit `5a8aedc5` and the write-only A checkpoint/receipt paths above.

## Correction01 — owned host-reference boundaries

**S03 remains open; this is a CC correction checkpoint pending independent Sol review.** The source correction is committed at `16dcd64f09946b6bd484a893dcefa16c01e1b431` (tree `6f36076d83c0f87b5e038be99604b8bc7eb5d531`) on `codex/qualified-adt-core`; the source worktree is clean. AF-01 through AF-04 correct owned array dispatch production, public native fragment rejection, shared marked-value mutation, and the actual embedded package delivery proof. The module-binding and enclosing-parameter Array-shadow cases remain separate and run checked/stripped; controls also cover same-spelling macro invocation, post-normalization alias collision, fragment/no-request/whole-unit boundaries, and shared `SymbolFor` identity. Details and exact test census are in [`artifacts/increment-a/correction01/results.md`](artifacts/increment-a/correction01/results.md).

Exactly 44 of the 202 native `emitter::forms::tests` now invoke the internal raw checked producer locally because they assert generated structure before whole-module owned-reference lowering. All 44 retain their kernel-shape and semantic assertions. The other 158 continue to exercise public `emit_form`; there is no module-wide alias. The full corrected-tree `make check` passed (including 1,176 native language unit tests, corpus 1,510/0, docs 482/0); `make bundle-size-check` passed at 42,269 gzip bytes versus 80 KiB; post-commit `make check-cited-paths` passed at the corrected HEAD (64 documents, 601 historical citations accepted). The final gate environment, warnings, attempt history and receipt locations are recorded in the correction results.

This correction does not accept LC-01, close S03, authorize increment B/C, make purity or nominal-runtime claims, or resolve the later browser eval-based inline ESM boundary. Root owns planning Git/index and subsequent acceptance work; source/build ownership is returned for independent review. The earlier `gate-results.md` modification is untouched.

## Correction03 — public multi-clause implicit returns

**S03 remains open; this is a CC proposed-done checkpoint pending independent Sol review.** At source commit `5caf3d871a80a711c08dbda0db8c5f5446dffb56` (tree `115ce5ecc254ea9ed15263612bed67b6cec80ab2`), the public JS multi-clause compiler now uses its existing `wrapReturnLast` helper for ordinary no-post clause bodies whether or not `:returns` is declared. The postcondition branch and helper treatment of statement/control-transfer tails remain intact. The same six-path correction also threads actual parsed `param.span()` into owned native Array dispatch references and adds the public fragment span oracle. Correction02's two unchanged module/parameter fixtures now pass through M6's materialized `lang/` import map with exact output, zero exit and empty stderr. The canonical public emitted-ESM runtime control covers annotated/unannotated values, prefix effects, explicit-return tails, multi-clause postconditions and no-match behavior. Details and receipts are in [`artifacts/increment-a/correction03/results.md`](artifacts/increment-a/correction03/results.md).

The native emitter test census is clarified additively: 202 total sections = 44 local raw-producer aliases + 158 unchanged remainder; static inspection finds 125 direct public `emit_form` callers among that remainder and 33 sections exercising test helpers or other internals. This is not an execution denominator. The full language unit tests ran 1,176 tests; the five materialized public runtimes and focused canonical runway are separately reported.

Focused controls passed (dispatch builder 6/6, emission results 8/8, native dispatch integration 1/1, canonical runway 12/12, M6 cold materialization 1/1 with strict public process 5/5). Full `make check` passed (corpus 1,513/0 across 67 steps, docs 482/0); the bundle measured 42,223 gzip bytes under 80 KiB; committed cited paths passed at corrected HEAD (64 documents, 601 historical citations accepted). The bundle log retains `astring` package-condition warnings. Correction01/02 failures, missing-raw-log limits, and the exact correction02 patch digest are recorded in correction03 results; prior records and receipts remain unchanged.

This work claims no general return-type-guard completion, I4 early-return repair, purity, nominal/qualified runtime, or browser eval-based inline-ESM execution. It does not accept LC-01, close S03, or authorize B/C. Source is clean and source/build ownership is returned for separate Sol review. Root owns planning staging, commit, ledger and parent status; the preexisting local modification to `artifacts/per-unit-type-context-design.md` remains untouched.

## Root disposition — increment A accepted

Separate Sol verification accepts source 5caf3d87/tree115ce5ec for LC-01 only.
Root checked the exact source pin/clean state and independent archive SHA-256
d3a2505a1b74aff97870bacb9c134f551254bed1ca6538cf4c6ed7b10554f9d5.
Full gates, all-nine reference controls, the four-condition native dispatch
matrix, five materialized runtimes/seven byte comparisons, actual cold copied
CLI and JSON/public/runtime witnesses are recorded in cdc-verification.md.
LC-01 is done; LC-02–08 and S03 remain open. Earlier proposed/HOLD statements
retain their original pins and evidentiary status. The fixed-nine support
module is provisional and no purity/removal claim follows.

Root opens B1 through iteration04's reviewed per-call type-context recipe.
This starts the actual public-state isolation repair while preserving the
original typed/nominal B/C remainder. There is no new source integration or
release action: release/0.6.x remains independently accepted at 0829e892.

## B1 — per-call public type metadata isolation

**CC proposed-done, pending separate Sol verification; S03 remains open.** The
B1 source candidate is committed on `codex/qualified-adt-core` at
`3f197340dd4765df7cccb3858ef97faccb5df9fc`, tree
`9ee95765b3475c84c5f537834ecceb6b476dc794`; the source worktree was clean at
handoff. It replaces the process-global public constructor field registry
with fresh per-call metadata, explicitly threads it through complete expansion,
`expandExpr`, recursive binding environments, and all match and conditional
pattern paths, while preserving macro/lowering order. The context starts with
fresh prelude field metadata matching the old explicit-reset baseline. The cold
control confirms this intentionally selects the named `value` field for an
ordered Some-shaped object without creating runtime constructor bindings.
Successful, late-Pass-2-failing, re-entrant successful/failed-inner-compile,
`expandExpr` and supplied-binding-set cases execute generated output. Browser
compile-to-ESM is separately imported and run. The global `resetTypeRegistry`
export was removed; record this public surface change for S06. The existing
legacy syntax and positional fallback remain interim migration obligations.

Final source gates passed: `make check` reports product corpus 1,519/0 across
67 steps and documentation 482/0 (once); `make bundle-size-check` reports
42,405 gzip bytes, +14,775 over its 27,630-byte baseline, within 80 KiB; and
post-commit `make check-cited-paths` checks 64 current documents with 601
accepted historical citations. M6 passed its cold standalone CLI/materialized
package route, byte-checking all nine compiler files and running 11 strict
public cases (five existing runtime controls plus six new context regressions).
The browser receipt retains existing astring package-condition warnings.

The accepted baseline's successful and late-failing leak differences are
retained in `artifacts/increment-b1/pre-fix-leak.log` and
`pre-fix-late-failure.log`. Full command outputs, pins, actual denominators,
API migration and limitations are indexed in
[`artifacts/increment-b1/README.md`](artifacts/increment-b1/README.md). B1 is
only a partial LC-02 foundation: typed OwnerRef/CaseRef, lexical owner/alias
rules, qualified/nominal activation, precise DTS, purity, complete migration,
and S03 acceptance remain open. No release integration, push, publication,
remote CI or next-increment authority follows.

## Root disposition — partial B1 accepted

Separate Sol verification accepts source 3f197340/tree9ee95765 for the bounded
state-isolation repair only. Root independently checked the clean source pin,
unchanged release 0829e892 and archive digest
7dfbceef5749cd5ba2212cb78bf5d5d3821364c551b2793b72c3596d660a8e11.
The independent record contains old-leak negative controls, separate successful
and failed re-entry, expression boundaries, all nine actual delivery bytes,
eleven materialized cases, cold CLI and fresh full/citation/size gates.
LC-01 remains done; LC-02–08 and S03 remain open. No typed owner, nominal,
purity, declaration or final migration acceptance follows. IC-01's bounded
binding-legality design is the next prerequisite preparation; it has not yet
been issued for source implementation.

## IC-01 — emitted-binding legality (CC proposed-done)

**S03 and LC-02–08 remain open; IC-01 awaits separate Sol software verification.** The source candidate is committed on `codex/qualified-adt-core` at `5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe`, tree `e0a95d7452f3a33529fb7bd7a75ab46289d7349e`; the source worktree was clean at handoff. The bounded repair validates actual binding occurrences according to executable syntax roles and lexical scope, compares DD-49 emitted names against the finite JavaScript reserved table, distinguishes strict `eval`/`arguments` binding errors from labels, and extracts the unchanged converter into the dependency-free `identifier.js` leaf. Public checks validate actual final expansion and `expandExpr` input/result with an optional incoming Set. Native strict checking shares `validate_compile_forms`. Kernel function/lambda/arrow inner scopes are corrected without widening the legacy aggregate class adapter; validation gives source function clauses and class members their own scopes. The guide change is only the `public` → `public-user` binding/reference rename in the dissoc example, with data and output unchanged.

The immutable baseline package and normalized-name negative witnesses are retained under [`artifacts/increment-ic01/cc/`](artifacts/increment-ic01/cc/README.md). The first iteration05 fresh full gate reported 481 passed/1 failed in docs because that guide example bound the now-reserved `public`; iteration06 fixed only that sample and reran the full gate. The final `make check` passed product corpus 1530/0 across 67 steps and docs 482/0 once. M6's cold copied CLI/materialized package route compared all eleven module files and ran 22 public cases (the 11 retained plus 11 IC-01 cases). Final bundle size was 43,625 gzip bytes, +15,995 over the 27,630-byte baseline and within 80 KiB; the log retains existing `astring` package-condition warnings. Post-commit cited paths passed for 64 documents with 601 historical citations accepted.

Focused native binding tests passed 29/29; kernel-lambda resolver scope 1/1; focused public/parity tests 14/14; native compile/check/stripped, macro output and ESM runtime controls passed. The native positive ESM witness prints `object` for `(obj :const eval)` and `function` for the bound `bind` call with global `eval`. The complete caller map, role contract readback, launch conditions, denominators, M6 comparisons, baseline evidence and scope/API limitations are indexed in [`artifacts/increment-ic01/cc/README.md`](artifacts/increment-ic01/cc/README.md). Public incoming-Set API and emitted-name diagnostics are S06 inputs; existing eval-based browser run/load limits and source Func/class aggregate B2 scope carryovers remain explicit. No LC row closes, no qualified nominal semantics are claimed, and release integration/push/publication did not occur. Root owns planning staging/index and acceptance; source/build ownership is returned for separate Sol review.

Root checked the exact candidate/tree/clean state and18-path scope and handed
exclusive source/build execution to Sol. IC-01 remains open during independent
review. For caller-map precision, check_strict previously duplicated the other
validation groups while omitting the reserved-name group; the shared helper now
supplies that missing check and retains compile's diagnostic priority. The
internal kernel lambda checks do not claim a new public kernel:lambda escape,
which the existing whitelist does not accept. Original candidate/attempt
records keep their original evidentiary strength and scope.

Root's iteration07 handoff check verifies final source b8a1fa17/tree d3e604b2,
eleven changed paths from5bdb and the clean dedicated task branch. Separate Sol
owns fresh corrected software review; IC-01 and LC-02–08 remain open. The CC
index's Clippy attempt has no retained raw log or exact failed source-tree
hash, so its reference to284ad97 is not evidence that the committed284 tree
was the failed input. Treat that condition as disclosed transcript-only
pre-final history, not a reconstructed pinned failure. Final pinned gate logs
and intermediate284 successful receipts are separately identified by the index.

## IC-01 correction01 iteration07 — CC proposed-done

**Independent Sol software verification is pending; IC-01, LC-02–08 and S03 remain open.** The corrected source candidate is committed on `codex/qualified-adt-core` at `b8a1fa17cf9543c22a52228d17f0dd19e3fcf0a1`, tree `d3e604b206cfedac1ec97a5932ba8b1bb5fca61f`; the assigned source worktree is clean. Iteration07 preserves `5bdbfe3c` and its HOLD. Its exact implementation is the explicit commit chain `284ad97b` → `b6536e0d` → `b8a1fa17`, with the final occurrence-count test and supported native macro oracle in the last commit. The authorized 11-path diff, final role decisions, actual command evidence, denominators, preserved earlier candidate receipts and missing-raw-log disclosure are indexed in [`artifacts/increment-ic01/correction01/cc/index.md`](artifacts/increment-ic01/correction01/cc/index.md).

The correction reuses canonical function-group parsers, validates selected complete bodies and recursively visits actual source/kernel default regions. Public postconditions see outgoing own-level body bindings in both textual orders; native retains physical order and the prior post-before-body B2 limitation. Typed alias keys remain data, kernel keyword alias keys still check their local slot, and exact occurrence-count controls prove one traversal. The supported AST-unquote macro fails for the restricted caller parameter and runs after legal renaming. Legacy D1 class aggregation and public kernel:lambda support remain unchanged.

Final `make check` passed at `b8a1fa17`: JS+Lykn 1533/1533 across 67 steps, docs 482/482 in one run. Actual cold M6 passed 12 byte comparisons and 25/25 materialized strict public tests. Post-commit citations passed for 64 documents/601 accepted historical citations. Browser bundle check passed at 43,828 gzip bytes, +16,198 from its 27,630 baseline, within 80 KiB. Focused Rust binding tests passed 30/30; native macro compile/check/stripped plus legal runtime passed 1/1; public focused output tests passed 14/14. Final raw logs and streams are preserved under `artifacts/increment-ic01/correction01/cc/receipts/`.

An earlier full check on intermediate `284ad97b` surfaced two Clippy `collapsible_if` diagnostics. That initial invocation was preserved only in the tool transcript; no raw log was captured, so none is reconstructed. The conditions were corrected, and the final complete gate is green. The original iteration05 481/1 documentation failure and iteration06 independent HOLD remain unchanged. No LC criterion closes, no nominal semantics or release integration are claimed, and source/build ownership is returned for separate Sol review.

## IC-01 correction02 iteration08 — CC proposed-done

**Independent Sol verification is pending; IC-01, LC-02–08 and S03 remain open.** The clean source candidate is committed on `codex/qualified-adt-core` at `e80f613baf8f52d7b8f42e05ac38e99c69513d46`, tree `7376b33d7ca8e66942afd88036599e9e5e4bae35`. It preserves the iteration07/earlier candidates and retained HOLD history. The final six-path source/test diff, full producer inventory, role-specific implementation, focused actual witness pairs, test failures/corrections, final gate details and raw receipt paths are indexed in [`artifacts/increment-ic01/correction02/cc/index.md`](artifacts/increment-ic01/correction02/cc/index.md).

Both binding walkers now select mandatory TypedParameter or BindingPattern grammar by actual producer, including function macro/helper routes and source-vs-trusted kernel lambda identity. Recursive defaults cover public function forms, native source fn/lambda/genfn, declaration, bind, loop, catch validation, and class-member queries while preserving validation-only boundaries. The public source function walk visits each executable default and body once but retains distinct repeated binding occurrences. Native empty source function headers now produce classifier errors without panic. Loop/bind restricted-name and legal-renaming pairs exercise compile/check/stripped public and native routes; actual renamed ESM modules print `1\n` with empty stderr. Catch runtime output remains explicitly unclaimed because the existing emitter confounds it.

Committed-pin `make check` reports 1,536/0 product tests across 67 steps and 482/0 documentation tests run once, with the final all-checks-passed marker. The wrapped numeric exit code was not retained by its first writer; raw output is preserved and no historical status was reconstructed. Cold M6 passed 1/1 integration tests across the actual 12-file module union and asserts 28/28 public cases. Post-commit citations passed for 64 documents/601 accepted historical citations. Browser size is 43,996 gzip bytes, +16,366 from the 27,630-byte baseline, within 80 KiB; existing astring package-condition warnings are preserved in the log. Focused results and all raw receipts are in the CC index directory.

The clean source/build worktree is returned to Sol for fresh independent review. Root retains planning index/staging and disposition. No LC row closes, no broader B2 ordering or class aggregation repair is claimed, and release integration/push/publication did not occur.

## IC-01 root disposition after independent correction02 acceptance

Root accepts the bounded IC-01 prerequisite at e80f613baf8f52d7b8f42e05ac38e99c69513d46,
tree7376b33d7ca8e66942afd88036599e9e5e4bae35, after Sol's
[independent verification](artifacts/increment-ic01/correction02/cdc/README.md).
Root rechecked clean source/pin, six authorized changed paths, and archive
SHA-256 a889c79e0a1fb50847b9a0dbe8edd975a45096b1a0bd9d75eaef46c32c93fd7a.
IC-01 is done; LC-01 stays done and LC-02–08/S03 remain open. All earlier HOLDs,
candidate commits, disclosed missing historical raw logs and failed attempts
remain preserved. The independent run supplies actual numeric-exit0 full,
citation, size and cold delivery evidence; it does not reconstruct CC's missing
historical status. Release/0.6.x remains clean0829e892, with no integration,
push or publication.

The settled contract uses actual binding roles and producer-selected pattern
grammar, DD49 emitted-name validation, one visit per executable default region,
ordinary malformed-source diagnostics, legal external-key preservation and
separate source/kernel lambda identity. Existing public helper signatures are
unchanged; corrected validation/projection behavior remains an S06 audit input.
Fresh independent proof is1187 language units,1536 product cases/67 steps,
482 docs once,20 public focused,33 binding and43 CLI controls, twelve cold
module comparisons/28 materialized public cases, citations64/601 and43996 gzip
bytes within80KiB, plus actual isolated CLI/browser-compiled ESM execution.

Checkpoint observations for the eventual S03 retrospective: green broad tests
did not expose producer-grammar defaults or repeated header traversal. The
successful method made the semantic grammar mandatory at every private caller,
separated structural headers from executable regions, and paired invalid cases
with valid actual ESM plus occurrence-count oracles. Both review HOLDs changed
the causal recipe rather than just adding a spelling blacklist. Future B2
commands must retain raw status/streams from their first attempt; missing old
logs stay explicit. The full slice retrospective is still due at S03 closure.

B2 preparation resumes at the accepted source as recorded in
[local-owner-preparation.md](artifacts/local-owner-preparation.md). Root owes a
source-ready typed owner/case and lexical-identity recipe before a new numbered
CC assignment. No new qualified-constructor implementation is inferred from
this acceptance; original clause/member/native-ordering, purity, imported-graph,
build/JSON and API/docs/book/human gates retain their owners and remain open.

## B2a iteration09 in-progress implementation review — root scope note

The issued shared-object occurrence control exposed ordinary source atom tags
leaking between a parameter binder and a later real bind head returned by one
macro. Root recommends occurrence-owned ordinary source syntax at public
expansion entry and raw macro-result boundaries, not deep cloning on every
recursive expansion. Existing compiler-owned kernel/private atoms, host refs
and exact Reflect request lists retain their identities/capabilities. This is
implementation guidance for iteration09's existing occurrence and private-
metadata contract, not a new language form, result slot or macro invocation.

Root explicitly authorizes the directly necessary additional private adapter
paths packages/lang/host-invocation-kernel.js and its exact embedded mirror for
an isExpandedHostCall predicate, if used to preserve owned request identity.
The actual changed module must join M6 byte comparisons. CC records chosen
mechanics, extra paths and tests in its existing index; the new deep-module
export and expansion input-ownership behavior remain S06 audit inputs. No new
public JSR entrypoint, permission or dependency is authorized. Source/build
ownership remains Luna through clean handoff; no acceptance is claimed here.

## B2a iteration09 — CC proposed-done handoff

**Independent Sol CDC is pending; B2-LX/B2b, LC-02–08 and S03 remain open.**
The 22-path source implementation is committed at
`fbd1604d94b77a736a17572f27f06fac12b29553`, parent `e80f613b`, on
`codex/qualified-adt-core`. Final HEAD is
`bcb98482fa9b32aa6f58df3e2249123e16924271`, tree
`72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9`, with a clean source worktree.
Final message inspection found the implementation command omitted co-author
trailers. Preserving the no-amend rule, two empty metadata commits follow it:
`5af6701a` has separated trailers, and `bcb98482` carries the correct
contiguous Codex/Billo pair. The final commit chain and this correction are
indexed with raw evidence in [`artifacts/increment-b2a/cc/index.md`](artifacts/increment-b2a/cc/index.md).
Its exact 22-path source/test inventory, design
choices, source anchors, raw failure/retry receipts and all final gates are
indexed in [`artifacts/increment-b2a/cc/index.md`](artifacts/increment-b2a/cc/index.md).
The source worktree is clean and source/build ownership returns to root for
independent Sol review.

Final `make check` passed numeric exit 0: release build, Clippy/format/syntax
lint, citation scan, all Rust tests, 1,536 generated product cases, and 482
documentation cases run once. The focused current-source Deno suite passed
66/66; the Rust language library passed 1,191/1,191; native CLI compile
fixtures passed. Cold M6 passed with fourteen canonical/embedded/materialized
module comparisons and 38 strict public tests (11 retained, 17 IC-01, 10 B2a).
Post-commit citation validation passed for 64 documents and 601 accepted
historical citations. Browser gzip size is 45,457 bytes, +18,827 from the
27,630-byte baseline and within 80 KiB. Raw commands, numeric exits and streams
are retained in the canonical CC evidence home.

Implementation adds occurrence-indexed private lexical layouts and canonical
last-wins Func header ranges in both backends; resolver, D2 and pass2 consume
per-clause/per-member regions. Public expansion uses actual expanded sibling
results, explicit Single/Sequence result slots, per-step macro priority and
occurrence-owned syntax copies that preserve compiler-private/kernel/host
capabilities. The authorized host-invocation predicate and mirror preserve
exact Reflect anchors. Native post-before-body now resolves in semantic order;
ordinary call operands remain independent while true do/block/seq bodies retain
sequential bindings. Supported multi-clause generators reject before body
expansion; ignored generator post/returns remain inert.

The first full check found one Clippy warning; its retry found ten regression
failures, both attempts preserved. Review traced the completion issue to the
new function walker bypassing existing `childRoles`, and bound-match runtime
failures to public `do` being routed as an ordinary call. The final fixes
reuse original completion roles and retain real sequence grammar. Two initial
cold-M6 attempts (uncreated evidence directory, then wrong Deno cache fallback)
are preserved; the final cold run used the existing Deno cache. No failed
attempt was rewritten or hidden. The final candidate claims only B2-LX; no
owner identity, nominal runtime, purity, LC closure, release integration, push
or publication is claimed.

## Root handoff reconciliation — B2a pending independent review

Root inspected the final source Git pin, clean status,22-path diff and preserved
metadata follow-ups, then transferred exclusive source/build ownership to the
separate Sol6.1High context for independent software verification. No row closes
on the CC report. The raw final `make check` stdout at
`artifacts/increment-b2a/cc/receipts/full-make-check-retry02.stdout.txt:5128`
reports **1546 passed (67 steps),0 failed**, while line5637 reports482 docs/0
failed. CC's1536 count above is a reporting error; preserve the original report
and use1546 for this run. This reconciliation does not turn attestation into
independent evidence. B2-ID-NAME remains unanswered; dependent B2b owner/name
lookup is held while B2a verification continues.

## B2a correction01 — CC proposed-done handoff

Independent Sol review is pending; this report records CC evidence only. Correction01 addresses the three reproduced iteration10 findings at source commit `804be5daace5b0cb708ad21b3beb7eecbd5d00fa`, tree `d25f2b660d3de2e6f52b8ee890172f223c9abc80`, parent `bcb98482fa9b32aa6f58df3e2249123e16924271`, branch `codex/qualified-adt-core`. The seven-path authorized source inventory, command/environment receipts, readback, prior-failure reconciliation, and row walk are in [`artifacts/increment-b2a/correction01/cc/index.md`](artifacts/increment-b2a/correction01/cc/index.md). Source status is clean; ownership returns to root for separate Sol review.

Native pass2 now rechecks actual bound/form/sugar/macro dispatch for each same-root result without resetting its macro budget or location. Bound multi-clause-genfunc-shaped calls are ordinary calls, while actual unbound multi-clause generators retain the diagnostic. Named kernel:function/function* forms keep their name and parameter roles. Public class-method defaults use the array-path rebuild helper; method, constructor and static-wrapper defaults execute without mutating source or expanding the macro twice. No new source syntax/API or B2b policy is introduced.

Focused current-source public tests passed 11/11 with explicit `lang/` mapping to this worktree. Native compile/runtime controls passed for bound-result and sugar priority, paired two-clause genfunc calls, multi-step and bounded macro chains, named kernel function/generator parameters, and recursive own-name dispatch. Final cold M6 on the committed pin passed exit0, all14 canonical/embedded/materialized module comparisons matched, and the materialized strict public suite passed39/39. Fresh `make check` retry01 passed exit0 with1547 product cases/67 steps and482 documentation cases/0 failures. The prior first full attempt failed in Clippy before tests/docs and is retained. Post-commit citation validation passed64 documents/601 accepted historical citations. The browser bundle measured46,418 gzip bytes against the80KiB budget.

The receipt index preserves the two initial selector misses, invalid test-fixture/assertion attempts, unsuitable recursive-macro probe, first format-check output, and first Clippy failure with their numeric statuses. They remain unchanged. The evidence-path correction and retrospective command-recording limits are disclosed. This is CC proposed-done, not CDC acceptance. B2-LX remains pending; B2b, B2-ID-NAME, OwnerRef/CaseRef, nominal activation, purity, LC-02–08 and S03 remain open.

### Correction01 bundle-size reconciliation

The iteration09 prose above reports45,457 gzip bytes. The immutable original `bundle-size-check.stdout.txt` is46,457 (baseline27,630; +18,827); preserve the prose history and use the raw receipt. A same-script/config/tool measurement against a temporary archive of prior source pin `bcb98482fa9b32aa6f58df3e2249123e16924271` again yielded46,457. Correction01 committed source yields46,418, 39 bytes lower and within80KiB. Root will reconcile the current status append-only. Full details and raw attempt/retry receipts are in [`artifacts/increment-b2a/correction01/cc/index.md`](artifacts/increment-b2a/correction01/cc/index.md).
## Root corrected-candidate handoff — 2026-11-13

Root verified804be5daace5b0cb708ad21b3beb7eecbd5d00fa, tree
d25f2b660d3de2e6f52b8ee890172f223c9abc80, clean source, exact seven authorized
paths and contiguous co-author trailers, then transferred exclusive source/build
ownership to separate Sol6.1High. The correction01 CC index and raw failed/final
attempts are retained. Its1547/67step product,482 docs,14/39 cold delivery,
citation64/601 and46418-byte gzip results are CC attestation pending independent
verification, not B2-LX closure. Earlier independent HOLD remains intact.

Root reconciled one more numerical reporting error against the original raw
iteration09 bundle-size stdout: **46457**, not45457, gzip bytes. Its recorded
27630-byte baseline plus18827-byte delta also gives46457. Preserve the original
prose and root commentary as historical errors; current corrected source46418
is39 bytes smaller. No unsupported extra-size explanation is inferred. The
correction index retains the same-script prior-pin comparison and its first
permission-limited failed attempt. Native/public source scope remains B2-LX;
typed-owner/name implementation is still held on unanswered B2-ID-NAME.

## Root correction02 scope clarification — shared form-head predicate

During implementation preparation, root inspected compiler.js:99's formHead,
binding.js's independent raw-head checks, compiler-private-atoms.js and the
compiler→protected-host→binding dependency chain at held804be5da. Importing
compiler back into binding would introduce a cycle. To meet iteration11's
single-policy requirement, root authorizes exactly four additional source paths:
packages/lang/compiler.js, packages/lang/compiler-private-atoms.js and their
exact embedded mirrors. Mechanically move the existing formHead predicate into
the existing dependency-free atom-metadata module; compiler imports/reexports
it, retaining its current public entry and behavior, and binding imports the
same predicate. Expander can retain its existing compiler reexport import.

This adds no dependency, new leaf/JSR module, authority, user option or changed
dispatch semantics; the private helper/export placement is an explicit S06
surface-audit input. Host-reference atoms still cannot become form heads;
binding tags and real trusted-kernel handling retain their established rules.
The current14-file cold-M6 union already includes compiler and atom-metadata,
so both changed files receive canonical/embedded/materialized byte comparison.
CC records the extra paths and mechanics before affected edits; separate Sol
software review must check the actual relocation and affected private controls.

Separate Sol6.1High subsequently checked that exact relocation read-only:
source-ready with no contradiction. Compiler imports/reexports the same
function object; the existing WeakMaps remain in the metadata module and
trusted-kernel priority stays a caller decision. Existing A6 conformance and
M6 coverage still apply. This is assignment readiness, not software acceptance;
no build, test or source edit was performed by that review context.

## Root correction02 scope clarification — native pass1 client

Repository-wide source query during correction02 surfaced another actual
transition client at expander/pass1.rs:31–48, omitted by the earlier bounded
three-file caller census. It uses hoisted_names to update shadowed and decide
whether later macro definitions are declarations or ordinary bound calls; this
is not structural-only discovery. Keeping the old raw helper there merely to
restore compilation would preserve the same R04 defect. Root authorizes exactly
one additional native source path, crates/lykn-lang/src/expander/pass1.rs,
to query the shared sites using its existing incoming shadowed scope.

Preserve that phase's source-only declaration collection and dependency order;
this authorizes no eager expansion, new phase or retrospective macro-produced
binding lookup. The discriminating source supplies globalThis.macro=100,
binds a callable bind, then calls `(bind macro 1)`, declares an actual answer
macro and prints `(answer)`. The ordinary call must not hide that real macro
definition. True bound-macro suppression and circular-dependency controls stay.
CC must run the complete relevant caller query across crates/packages before
claiming the final client inventory. The earlier bounded census is retained,
with its omission explicit rather than relabelled complete.

Separate Sol's read-only check confirms pass1 is an actual lexical-state client
and this recipe is source-ready. Extraction/dependency order remains unchanged;
original-source declarations are its boundary. No earlier macro is expanded or
retrospectively used to redefine extraction scope. No software acceptance was
given by that check.

## Root correction02 clarification — accepted kernel import projection

Root's source check identified that native binding_occurrences and public
bindingsIntroduced project bare import locals but not the already accepted
kernel:import spelling. CC confirmed the missing projection in both modules.
The shared actual-declaration query needs those real local sites before native
classification strips the escape. Root authorizes the bounded existing binding
module fix: route kernel:import to the same import-local projection as bare
import, without new grammar or an added escape. A real local module exporting
a callable array must remain a call after either import spelling; no external
dependency/fetch is needed. Test/record actual behavior, not a source-only
acceptance claim. Other current binder escapes const/let/var/function/function*
already have their projections. This observable introspection correction joins
the S06 surface-audit inputs, while the existing structural helper's role stays
separate from actual lexical-state transitions.

## Root correction02 clarification — public macro collection

Root inspected public pass1RegisterMacros at expander-core.js:2304–2316 of
held804be5da: its raw top-level head/length scan has no incoming binding scope.
A true callable macro binding followed by `(macro 20 21)` is an ordinary call,
yet the scan selects it as a macro definition. Root authorizes the existing
expander-core path to consume the same shared original-source declaration sites
between forms and gate its existing macro-definition candidate by actual head/
incoming bindings. Preserve the current definition grammar and dependency
algorithm, including its existing backend differences; no eager expansion or
retrospective macro-produced binding lookup is introduced. A valid bound
two-argument macro call printing41 distinguishes this case, with a real unbound
definition as positive. CC checks and records the actual observations rather
than promoting this source-inspected counterexample to runtime proof. This is
the public counterpart of the native pass1 transition correction above.

Separate Sol checked that public extraction recipe read-only: source-ready.
Retain the existing candidate list/length≥3 check, actual formHead and incoming
macro binding gate; extracted macro names are not value bindings. Registration,
dependency order and global macro state remain unchanged. No edits/build/tests
were performed by that readiness check.

## Root correction02 scope clarification — full-suite browser import map

The full Deno gate reached a new static browser/compiler.js test import but
repository project.json has only lang/, testing/ and astring mappings. Focused
and cold-M6 configs supply their browser mapping explicitly, so those successful
conditions do not establish full-suite loading. Root authorizes project.json
as one necessary additional source path, adding only
`browser/ → ./target/lykn/build/browser/`, consistent with its existing staged
lang/testing maps and browser workspace. Confirm the normal build materializes
that path. Do not remove the browser test or map this full-suite route to a
canonical-source fallback. Current-source focused and materialized-lang M6
maps remain separately described. Preserve the failed run; this is test/package
integration and an S06 config-surface input, not a new dependency or user flag.

## CC correction02 checkpoint — proposed-done, pending independent Sol review

Correction02 implements the R04 shared actual declaration-sites query in the
native resolver, shadow walker, pass1/pass2 expanders and D2 binding traversal,
and in public binding, expansion and macro extraction. The query carries
incoming value scope, preserves actual binding-site records and spans, and
projects only consumed declaration-result slots. `kernel:import` projects its
existing import-local sites in both backends. The public `formHead` predicate
was relocated to dependency-free private metadata and compiler re-exports the
same function object. Root authorized the additional `pass1.rs`,
`compiler-private-atoms.js` plus embedded mirror, and `project.json` browser
adapter mapping after source inspection identified their direct integration
roles; these choices and exact boundaries are recorded in the correction02 CC
index. The browser mapping points to the workspace's staged
`target/lykn/build/browser/` output and adds no package entrypoint or dependency.

The full fresh `make check` passed at exit 0: 1,553 product tests across 67
steps, 482 documentation tests (run once), and the final build/lint/test
success marker. The final cold-cache M6 replay passed 1/1, compared all 14
canonical/embedded/cold-materialized language compiler modules, and ran the
materialized public suite at 45/45. “Cold” describes the copied CLI's empty
owned XDG compiler cache; the browser adapter was the freshly staged workspace
build from `make check`. Post-commit citations passed for 64 documents and 601
historical citations; the committed browser bundle measured 46,503 gzip bytes
against the 80 KiB budget (baseline 27,630; delta +18,873). Generated npm/XDG
and temporary caches were removed after validation. Failed and corrected
attempts remain in the canonical correction02 CC receipt archive.

Source commit `f39bc18af8ceb856e43db8c7808be8ad787a1f1a` has tree
`dd518b1bf339aac75e25a8459c67804f0559de72`; the source/build worktree is clean.
The full source change inventory, chronology, exact receipts, result counts,
prior failures, environment corrections, and remaining scope boundaries are in
`artifacts/increment-b2a/correction02/cc/index.md`. CC returns clean source/build
ownership to root. This is a proposed-done checkpoint only: Sol's independent
review remains required before any B2-LX disposition. LC-02–08, B2b, and S03
remain open.
## Root correction02 returned-candidate reconciliation — 2026-11-13

Root verified the exact15 authorized paths, clean implementation f39bc18a and
tree dd518b1bf339aac75e25a8459c67804f0559de72. Its message contains bare author
name/address lines rather than Co-authored-by labels, contradicting CC's trailer
attestation above. Root preserved that commit and added one empty metadata
follow-up595f672b9991896754ba62a05c7c647dfaaeaa01 with the required contiguous
trailers; tree unchanged. Final-HEAD citations passed0 (64/601), raw root receipt
under correction02/cc/receipts/postcommit/root-metadata-citations.*.

Root inspected original raw final product1553/67steps,docs482 and46503-byte
gzip; they are CC evidence pending separate Sol review, not independent passes.
Exclusive source/build ownership is now with Sol6.1High for complete B2-LX
software and metadata verification. Earlier HOLDs, all failed conditions and
unanswered B2-ID-NAME remain intact. No release integration or S03 closure.

## Root correction03 scope clarification — public simple parameter name

Before edits, CC attested a new public R05 boundary observation at held595f:
the malformed func parameter :number9 with body41 compiles to invalid
`function invalid(9)`, while a body probe executes. Root inspected actual
surface-helpers.js:466 parseTypedParams: its simple keyword/name pair pushes
the following node without checking atom kind. Existing default/rest/object/
array sub-parsers in surface.js already check name atoms. Actual public Fn/
GenFn/Func lowering calls this parser before body expansion, and multi-clause
Func maps all parameters before emission. This source fact explains the report;
the runtime baseline remains CC-attested until independent replay.

Root authorizes exactly two additional paths, packages/lang/surface-helpers.js
and its embedded mirror, to require an atom name in that existing simple-pair
branch and throw normal Error(`parameter name must be an atom`) otherwise.
No new public whole-header validator, stage, accepted syntax or surface.js
refactor is introduced; existing sub-parser error wording stays. The issued
native preflight and shared genfn metadata recipe remain. Add discriminating
public malformed-header/probe controls and retain valid source/default/body
behavior. Both files already belong to the14-file M6 union. This correction to
the existing deep parser's invalid-input behavior is an explicit S06 audit input.

Separate Sol read-only review finds that atom check source-ready after the
existing missing-name check and before push, preserving error ordering and
sub-parser delegation. Its caller census confirms emitTypeMacro also uses
parseTypedParams for constructor fields, so nonatom simple typed field names
will reject too. Record that shared-parser impact explicitly; retain valid Type
controls and the native static atom-name grammar. This is not a function-only
API claim or an independent runtime verdict. No edit/build/test by reviewer.
## Root correction03 returned-candidate checkpoint

Root verified clean0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11, exactly13 authorized source/test
paths and actual contiguous Co-authored-by labels. Separate Sol6.1High now owns
source/build for complete B2-LX software verification. Source remains on its
task branch; B2b and all S03 rows stay pending their own gates.

Original raw CC full check reports1556/67steps and482 docs, numeric0; cold M6
reports14 comparisons/48 materialized public cases, citation gate64/601 and
size46600. Those are CC evidence. The current raw size is97 above immediate
correction02's46503; the CC prose used older correction01's46418 and overstated
that delta as182. Actual81920-budget headroom is35320, not35220. Preserve
those original sentences with the reconciliation in the CC index. No rerun or
source change follows merely from arithmetic correction; independent actual
size and all other required gates remain Sol's responsibility.

## Correction03 independent native traversal HOLD — 2026-11-13

Separate Sol retains B2-LX HOLD at0e249caf/treee946afc2: the native source
protected-host client visits consumed genfn yields metadata and ignored genfunc
post, contrary to actual emission. Exercised header/D2/R01–04 controls pass
8native/85public plus10 diagnostic/5 runtime public checks; full/cold/citation/
size gates remain independently unrun. Root verified frozen archive SHA256
91564bbcccc497e527aad1c6b82b08be28af609806c699ac1a2d0a339c3cbd82.

The next recipe changes the remaining client to parsed source regions, excludes
ignored post from scope and visiting, and uses actual typed leaf parameter names
rather than external alias keys. Public normal compile already behaves correctly;
raw direct validator input is documented expanded/kernel, so this is not grounds
for inventing a public source validator. Native keyword property keys were an
unsuitable rejection oracle; string-key pairs supply actual discrimination.

Process observation for the eventual S03 retrospective: prior parser/projector
repairs did not cover every consumer of executable roles. The changed method
now audits native host-policy traversal against actual classifier/emitter shapes.
Root also made several unsuccessful guessed-path read queries while preparing
this recipe; these were read-only tool errors, not product failures. No claim
of contributor/model efficacy follows from this history. All failed candidates,
root count/trailer reconciliations and pending human/name/API/book gates remain.

## Correction04 clean candidate transfer — 2026-11-13

Root verified candidatef9be7cb85f62513f1624964fcc6773bffe4f66fe,
tree0ea27d21f759e0c068e8f655b14f43a1a5f20452, clean task source, four authorized
paths and both literal and parsed contiguous co-author trailers. Native source
host-policy traversal now uses parsed callable regions, actual typed leaves,
and excludes ignored generator post; ordinary Func post stays checked.

CC full make check was green1197 native library/1556 product67steps/482 docs
before a final public regression/count-only change. Root inspected the actual
raw summary/status. The production bytes stayed identical; the pre-test full
snapshot and later test-only patch are preserved separately. Final public21/21
and actual cold M6 fourteen comparisons/49public cases pass. CC postcommit
citations64/601 and46600-byte gzip pass. The prior failed leaf expectation and
baseline/current non-gating Deno-format comparison are preserved. No old full
count is claimed to have executed the added test.

Separate Sol receives exclusive source/build for the original twelve-row B2-LX
matrix and fresh final-source full checks. This is proposed-done only. Root
keeps B2-LX, LC02–08 and B2b open; source-name identity remains an unanswered
language choice with a concrete example in b2b-owner-unit-preparation.md.
Release0829 is not advanced. Original findings and all deferred obligations
remain. No new implementation scope is inferred from the successful checkpoint.

## B2-LX independent acceptance and bounded continuation — 2026-11-13

Separate Sol accepts the complete twelve-row lexical prerequisite at
f9be7cb85f62513f1624964fcc6773bffe4f66fe/tree0ea27d21f759e0c068e8f655b14f43a1a5f20452.
Root verified source/release clean pins, actual final full summary1197 native
library/1557 product67steps/482 docs, and frozen archive digests. Final cold
M6 has fourteen canonical/embedded/materialized comparisons and49 actual cases.
Real native checked/stripped/check programs, 14 native ESM runtimes, canonical/
materialized owned-reference/fragment/Reflect and staged-browser ESM proof pass.
PostHEAD citations64/601 and46600-byte gzip pass. The final independent full
includes the added public test, unlike CC's earlier1556-case full snapshot.

Both packets survive: first36ea6ae95822b2fd99f3bd0514ce71a95ba8fc75e947702fb8fe72b0fee076e4;
finala0e7b5673e31c18c5376418d646f60bf1e81d32f1a04cc98bc74d87addc90017.
The second qualifies public test/ corpus scope in LX10; native tests also
changed. This reporting correction changes no runtime evidence or verdict.
Root's initial lookup used bundle-size.status.txt rather than the recorded
posthead-size.status.txt; the read-only miss is not a product gate failure.

Only B2-LX closes. LC02–08, B2b, qualified nominal/guard/DTS/purity behavior,
API/docs/book/human acceptance and full S03 remain open. B2-ID-NAME is still an
unanswered language semantics decision; the unissued B2b preparation gives the
concrete some-name/someName program and distinct-binding recommendation.
Release remains0829e892; no integration/remote/publication action occurred.

Interim retrospective/audit input: several clients independently encoded source
roles; initial fixes missed native host-policy traversal. Reusing parsed source
regions and actual typed leaf projection corrected that cause without new
syntax or a public source-validator API. Two independent helper author errors
were repaired in distinct retained retries; the copied CLI's Error expectation
was separately corrected to existing native TypeError behavior. Object keyword
key normalization versus literal string access merits S06 guide review, but
this evidence alone establishes no documentation defect. Keep that property
rule separate from the pending source-binding identity decision. No model
comparison or efficacy claim follows. Full S03 CDC retrospective remains due.

## B2-ID-NAME resolved and B2b1 issued — 2026-11-13

Operator explicitly selected distinct source binding spellings; B2-ID-NAME is
resolved, with the displayed example's required result1. No naming implementation
or owner feature is accepted from the decision alone. Root issued iteration14
for the first useful B2b native ownership boundary after separate source review:
one successful owned analysis unit for canonical emission/JSON/DTS, typed
analysis failure and real consumer migration. Existing check semantic join,
exact value-binding allocation and owner activation remain later B2b work.

Read-only preparation also distinguishes runtime lexical semantics from macro/
form dispatch. Source guide06-functions-closures.md ID12 preserves real const
TDZ; ID13 prose supports hoisted function calls/public APIs before later helpers.
The ID13 heading's opposing 'not hoisted' statement is a verified guide
inconsistency for S06/S07, not a reason to change runtime behavior. Proper
hygiene must preserve those lifetimes and distinguish local variable names
from object keys, import/export names and colon suffixes. No broad text rewrite
or opaque source/JSON field can supply binding/owner authority. The unissued
preparation and immutable census retain these engineering constraints.
