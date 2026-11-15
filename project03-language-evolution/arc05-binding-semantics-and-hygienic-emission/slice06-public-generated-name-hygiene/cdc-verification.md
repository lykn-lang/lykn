# S06 independent verification

## Source-first review 01 — HOLD

2026-11-14. Reviewer `arc05_s06_cdc`, separately selected OpenAI
gpt-6.1-sol/high; implementer `arc05_s06_cc`, OpenAI gpt-6-luna/high. Root retains
design/planning/Git/rows and will author a single consolidated correction.
This is source-first disposition before fresh aggregate gates. **HOLD** the
candidate; no PN row or BS-06 is independently accepted.

Reviewed clean task `codex/qualified-adt-core` in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, commit
`17791f24696ecbd1bc1cc4cabcc65c1a49d555c1`, tree
`792fd4244180068e3319c49785cf8df1ff5ae02b`, parent82. Read the full current
slice plan, initial prompt, eight-row ledger, CC closing report, root's
preliminary review, complete new test and guide change, actual source delta
and containing producer/caller/consumer definitions. The earlier source census
was rechecked against current implementations, not accepted from labels.
Applied installed JavaScript/Deno, testing discipline/validation, framework
and independent-verification guidance, with Rust guidance for the bounded M6
membership edit and repository Lykn/AGENTS constraints. No aggregate gate ran
on held code. Bounded reproduced observations are in
[source-first-evidence.md](artifacts/cdc/source-first-evidence.md).

### Concrete implementation findings

**F1 — P1: physical keys are extracted before actual Source normalization.**
`packages/lang/identifier.js:183–199` decodes raw text, normalizes the complete
string, then extracts runs from the raw decoded spelling. It does not extract
from the compiler's actual emitted member-part text. `---gensym0.child` emits
`___gensym0.child`, but its key set omits the free root `___gensym0`; Dissoc
allocates that very name and the actual Source consumer throws TDZ. Independently
reproduced in `leading-hyphen-review.*`, expected `{"keep":7}`. The same ordering
error makes source `a-\\u0062` report aB while its actual emitted spelling is
`a\\u0062`, physically ab; the Lykn API client confirms this mismatch.
This breaks PN-01 and the shared early/late mapping contract.

Required correction: use the selected shared actual member-part mapping to
obtain Source emitted text FIRST, then decode/extract its physical runs. Keep
legacy whole-normalized/colon keys conservatively as specified. Already-emitted
ESTree Identifier text must stay decode-only. Keep compiler grammar validation,
private-member flags and protected-root selection unchanged. Add exact key
and actual consumer oppositions for both examples; token nonemptiness is not
an oracle.

**F2 — P1: reconstructed threading keyword members are omitted before allocation.**
`identifier.js:243` skips all keyword nodes, but `classifier.js:553–559,587–593`
reconstructs scalar and keyword-headed threading steps as executable member
atoms. Actual Source `keyword-thread-review02.lykn` uses only a data string to
establish global t0 and a keyword `:child[t__gensym0]` to reference it. The
generated receiver t0 captures that index; execution throws TypeError instead
of7. The opposing control adds an ordinary atom reference and runs correctly.
The nested `keyword-enclosing-result-review.lykn` independently throws result0
TDZ, showing that reserving only inside SomeThread emission is too late.

Required correction: seed these reconstructed executable member strings during
the owning complete-input census, including raw Source heads `->`, `->>`,
`some->`, `some->>` and actual Surface Thread/SomeThread steps, scalar and
keyword-headed lists. Preserve ordinary literal/data keywords as data. No
macro replay, evaluator or new lexical-binding guarantee is needed. Include
the nested typed-result consumer, not just a standalone threading success.

**F3 — P2: generic Surface traversal drops real value and names payloads.**
`identifier.js:245` universally skips `value`; actual Surface Reset, SetProp,
SetSymbol and Cell use that property for executable syntax, and Assoc/Obj
pair records do too (`surface-ast.js:20–42,66–69`, classifier519–529/714–723).
The special names-array path246–252 traverses only string items, losing the
actual Exports.names atom array (`classifier.js:735–736`). The one-shot Lykn
client obtains these nodes through the real classifier and confirms acceptance
of an already present t0. Whole-unit raw-SExpr seeding masks these omissions
in some compiler routes; it does not satisfy the selected Surface census/API
contract.

Required correction: after handling atom/literal nodes by type, visit actual
container payloads named value, and visit non-string elements in names/key
arrays while reserving reconstructed strings. Preserve metadata/literal/private
skips. Test the actual classified shapes; do not invent a new AST variant.

**F4 — P2: repeated rejected callbacks are detected only when adjacent.**
`identifier.js:265–281` remembers one last rejected raw string. Occupied A,B
with callback A,B,A,B can loop forever. The bounded actual client reaches its
callback4 tripwire; the specified allocator error should occur at callback3.
Required correction: track rejected raw candidates for the current next()
attempt, preserving the no-small-retry-cap contract and original accepted
candidate object/string. Add a bounded cycle opposition alongside the existing
adjacent-repeat case.

**F5 — P2: braced Unicode decoding rescans suffixes quadratically.**
`identifier.js:148–154` uses suffix-wide indexOf/slice for every braced escape.
Repeated unterminated `\\u{` prefixes repeatedly scan the remaining string.
This directly contradicts plan B's explicit incremental bounded-progress rule.
This is a static algorithm finding, not an executed performance measurement.
Required correction: inspect a bounded number of digits/incrementally stop at
invalid, overlong or unterminated input, with checked progress and exact malformed
text behavior. No new parser dependency, benchmark framework or arbitrary
allocation retry limit is requested.

### Required proof gaps in the existing eight-group file

These are undelivered initial-prompt obligations, not optional new scope.
Keep exactly eight top-level groups and strengthen their actual assertions.

| Current group/location in public-generated-names.test.js | Actual evidence and missing opposition |
| --- | --- |
| 1,80–120 | Useful normalization and candidate A/escaped-A/B assertions exist. Unicode, surrogate, FEFF and malformed cases94/97 assert only Set.size>0, which holds without correct decoding. Assert exact required tokens/decoder outcomes, actual private/member mapping and emitted-text non-normalization; include F1/F3/F4/F5 oppositions. |
| 2,122–162 | The first typed parameter opposes a real result0 collision, but no per-fixture reset is used. Initializer137 uses result0 rather than result__gensym0; recursive143 names recursive, not the generated result candidate; default156 names nested. Sibling149 runs after earlier allocations. Restore explicit reset-controlled baseline/normalized/outer-initializer/self-name/default/nested/sibling collisions with actual values and once-only defaults. |
| 3,164–195 | Only the initial some-> fixture explicitly forces suffix0. Later IfLet/WhenLet/value Match/some->> inherit an advanced stream; Dissoc has no opposing generated-name reference. Only value Match is present. Add independently controlled collisions for both Match routes, Dissoc aliases/rest and conditional helpers; include real guarded/effect ordering and null short circuit (the current empty calls array is never mutated). |
| 4,197–225 | args0/yv0 fixtures follow prior global allocations without reset; post fixture uses result0. Yield values run, but construction/advancement effect timing and wrong-yield class are not checked here. Restore actual collisions and the original async closed-carrier behavior/presence proof. Existing contract/no-match/yield negative tests may cover unchanged error semantics with an explicit applicability map; do not duplicate them solely for volume. |
| 5,227–292 | Fragment229 uses unrelated result0 in a t-producing form and only string-checks output. Single/sole-Multi run ordinary7/8 without collisions; instrumentYields257 checks only the head. No standalone Genfunc or statement Match consumer is exercised. Add actual fragment/direct collision consumers for the promised supported ordinary-name APIs, advancing custom helpers, failure-after-allocation/global counter advancement and deterministic reset/interleaving. The partial Not and early unsupported-signature callback0 checks are useful and should remain. Do not expand the pre-entry private-atom lifecycle. |
| 6,294–316 | Callback count1 is useful. Its inner expansion is only shape-checked, the returned t0 was already present in original Source, and recovery compares two generator-free console programs. Execute the inner consumer, introduce a newly returned colliding name not preseeded in original input, and observe monotonic global advancement/recovery without resetting entries automatically. |
| 7,318–363 | Useful Source ICU, ADT data, exact raw anchor and actual expanded getter/argument/receiver trace exist. New mapping-specific completion/discard/rest/host alias/raw-ICU/lazy collision boundaries and repeated private identity are not established by the title. Strengthen those changed-consumer oppositions, including actual escaped/computed emitted identifiers. Retain existing full lazy malformed/duplicate/orphan/incomplete tests as applicable protocol evidence, not newly invented substitute plans. |
| 8,365–374 | Browser runs only the ICU specimen. JSON transport compiles and string-checks data but never executes it; no exported namespace is observed. Execute typed/thread/ICU baseline consumers through public Deno and fresh staged browser, then completed-lowering JSON and actual data/API/namespace output. Keep raw/future-sibling/no-strip boundaries explicit. |

Existing unchanged ICU tests retain real hoist/selector collision, once-only,
exception, branch, fragment recovery, browser and exact raw request coverage.
Existing lazy tests retain no-request/collision, role selection and rejection/
cleanup coverage. Existing discard/reserved-output suites contain actual private
rest/completion/carrier and JSON boundaries. They are useful preservation
inputs because those syntax/identity protocols were not rewritten here; their
old/CC-attested success does not prove the new physical-key oppositions or
replace fresh affected checks after correction. No arbitrary exhaustive matrix
or new top-level group is requested.

### Delivery, API and metadata disposition

Read-only Git independently confirms one exact15-path commit atop82 and required
adjacent trailers. Six native cmp commands independently confirm all changed
canonical/mirror pairs are equal. The Rust M6 delta preserves seven original
paths/70 cases/14 comparisons and adds the new eighth path/eight cases plus
lazy-module comparison15. Inspected CC final command/config/status/stdout and
all15 comparison receipts: actual8/78/15, materialized lang alias, staged browser,
cold owned XDG with warm Deno dependencies. This is inspected doer evidence;
no fresh independent materialized/aggregate acceptance is claimed on held code.

The CC close's Rust514 total is false. Exact `^test result:` lines in its actual
make-check-attempt03.log include native Lang1217 at1913 alone, plus CLI194,
umbrella99 and other harnesses/doctests; the42 result lines sum to1798 passed,
zero failed. Correct the current account while preserving the original mistaken
attestation/history and unavailable raw-stream limits. The original focused
attempt01 count correction and first DNS/macro failure lacking saved raw output
must stay visible; so must the77/78 M6 failure and later recorded successes.

The claim of no module-export changes is also false as written. There is no
package-entrypoint change, but identifier.js adds five named exports:
toJsIdentifierParts, decodeIdentifierEscapes, physicalIdentifierKeys,
emittedIdentifierKeys and createGeneratedNameAllocator. Single/Multi/Genfunc/
instrumentYields gain final generatedNames options; Match/statement-Match and
emitSurfaceForm gain corresponding option/helper fields. Preserve these exact
API audit inputs for Arc06 LI-04, including callback/error/state behavior;
do not erase them through wording. Legacy public gensym/reset, raw compiler
semantics, protected-root selection and future source-binding work stay distinct.

### Eight-row source-first disposition

| Row | Independent disposition at177 | Reason |
| --- | --- | --- |
| PN-01 | HOLD | F1/F5 and exact physical/Unicode/candidate proof gaps. |
| PN-02 | HOLD | F2/F3 and unforced/missing producer/direct consumer oppositions. |
| PN-03 | HOLD | F4; failure advancement/reentry/interleaving proof incomplete. |
| PN-04 | HOLD | Shared mapping held; preservation source is encouraging but changed late/private/carrier composition proof remains incomplete. |
| PN-05 | HOLD | Reproduced valid Source failures; browser/JSON/API proofs incomplete. |
| PN-06 | Open, fresh acceptance pending | Membership/mirrors/CC receipts checked; held source cannot be independently accepted through its passing78 tests. |
| PN-07 | HOLD | Corrections and fresh required gates remain; metadata count must be reconciled. |
| PN-08 | Open, root closing metadata pending | No accepted implementation, independent final gates, retrospective or root later-owner routing yet. |

Consolidate F1–F5 and the required proof repairs into one bounded iteration01
inside the same15 paths/eight groups; copy six mirrors before builds and retain
all failed attempts. Root owns that recipe/issue and later metadata. After CC
returns, source-first review must clear the corrected candidate before the
separate fresh focused/full/M6/citation/size gates and independent close.
Release remains82; S07 and external actions remain unopened. Review returned
with clean source, no product/Git mutation and no running jobs.
