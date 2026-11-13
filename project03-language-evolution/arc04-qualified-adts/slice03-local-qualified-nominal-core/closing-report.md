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
