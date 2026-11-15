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

## Source-first review 02 — correction01 at89 — HOLD for proof

2026-11-14. Same independent Sol6.1 High reviewer and Luna6 High implementer.
Reviewed only immutable Git objects at commit
`89ab9dcd90f0c8498685dba0f267a986d07ee462`, tree
`6305ea2ee0b2b29b0a754b4641b46ea54ae247f7`, parent177, plus stable planning
inputs. No source execution, build, live target read/import, product edit or Git
mutation occurred. Root attested the checkout clean and froze product bytes;
this review independently identifies the committed objects, not mutable stage.

Read the complete corrected identifier module, all785 lines of the committed
new test in bounded recovered chunks, the issued iteration01, plan v1.1,
eight PN rows and the original complete proof table above. Checked actual
unchanged producer interfaces and retained canonical tests where applicability
matters. Exact correction delta is3 paths; canonical and embedded identifier
objects share blob `822561be02effff48ecc9ac7f7a314be8619c45a`. Adjacent required
coauthor trailers and parent/tree were inspected through Git.

### Implementation fixes: source assessment

| Finding | Immutable identifier.js source | Source-first assessment |
| --- | --- | --- |
| F1 | sourceAtomText183–187; physicalIdentifierKeys190–198; emitted collector228–241 | Actual shared member normalization precedes decoding; legacy whole/colon spellings remain conservative; emitted text is not normalized again. Correct selected repair. |
| F2 | raw/Surface step selection205–224 and owning census269–272 | Four raw heads and both Surface node types reserve scalar/keyword-headed member text during complete-input traversal. Ordinary literal/data keywords remain skipped. Correct selected repair. |
| F3 | generic payload traversal273–285 | Actual value fields and object entries in names/key arrays are now visited; metadata/private callbacks and traversal-local visits remain. Correct selected repair. |
| F4 | per-next rejected Set294–308 | Nonadjacent raw repeat is detected without a small retry cap; accepted candidate keys insert once and original value returns. Correct selected repair. |
| F5 | bounded braced scan148–163 | At most6 hex-digit inspections and immediate brace check per escape; failed cases advance. No suffix-wide search remains. Correct selected repair. |

No new implementation defect or necessary source-path expansion was identified.
The new exact decoder/candidate/Surface tests at128–277 are materially stronger:
they assert actual tokens/text, both-direction normalized/escaped candidates,
original atom identity, rejected A/B/A count3, actual classified value/names/
thread fields, data skips and repeated traversal of a mutated container.
This is source assessment; none was independently executed in this phase.

### Remaining mandatory proof repairs — existing test only

The following are still required by issued iteration01 and the original proof
table. Focused42 green or a milestone description does not fill these omissions.
All fit the same test file/eight groups; no implementation change is requested.

| ID | Actual committed evidence/gap | Required bounded opposition |
| --- | --- | --- |
| P1 | No actual leading-hyphen Dissoc, keyword-thread/control, keyword-headed or nested enclosing-result runtime witness occurs anywhere in the785-line file. G1 checks helper/Surface fields; its leading-text assertion only checks raw compiler output. | Execute the retained original `leading-hyphen-review`, `keyword-thread-review02`, opposing control and `keyword-enclosing-result-review` Source consumers through reset-controlled public compilation: JSON keep7,7,7,7 with empty stderr. Include the issued keyword-headed layout and raw ->/->> nested typed role case. The nested result consumer must fail if reservation is patched only at threading emission. These are supplied admitted specimens, not new exploratory cases. |
| P2 | Direct group resets at502 only. Its fragment allocates t1 after rejecting t0, leaving counter2. Single518 therefore chooses result2, sole-Multi525 chooses result3, Match530 chooses target4; later yield/statement builders also allocate higher suffixes while their inputs all name suffix0/1. Runtime success does not oppose bypassed standalone allocation. | Reset immediately before EACH independent direct builder/instrumenter construction. Use known candidate0 references for Single, sole-Multi, direct Genfunc, direct instrumentYields and value Match, execute outputs, and control target/matched order separately for statement Match. Preserve the valid self-contained fragment test503–508. Do not route ordinary direct cases through new private finalization. |
| P3 | Statement Source385–395 names target0 and matched1 together. Rejecting target0 consumes0 and accepts target1; matched candidate is then2, so matched1 never collides. No Match :when guard with side-effect ordering occurs in the new file. | Isolate matched1 with target0 accepted, or deliberately name matched2 after a target0 rejection; state the chosen stream. Include an actual guarded statement/value consumer whose guard mutates a trace once and whose body observes the opposing outer name. Ordinary unguarded value/target tests do not prove this requirement. |
| P4 | Dissoc398–401 has only record/drop/keep; it opposes neither alias nor rest storage. | P1 supplies the alias ___gensym0 opposition. Add a distinct rest fixture with alias0 accepted and rest candidate1 opposed, e.g. a string-key global rest__gensym1 holding a child record, then dissoc of rest__gensym1.child; expected keep7. Do not combine it with an alias0 rejection and keep pretending the rest candidate remains1. |
| P5 | G1 advances a factory callback, but no advancing injected h.gensym ever lowers and executes a Surface consumer; the only h callback586–595 is intentionally uncalled. | Actual classified SomeThread with an input t__custom0, h.gensym returning original atoms t__custom0 then t__custom1, should execute7+99=106 and consume exactly2 callback calls. This distinguishes correct standalone helper wiring from a factory-only test. |
| P6 | Legacy reset/probe checks597–601 and interleaved runtime/stream tests618–631 are useful. There is no explicit same-Source early-producer reset-to-identical-code assertion. Existing ICU recovery equality concerns a local late allocator, not this stream. | Compile the same actual early-producer Source after explicit resets and compare its generated code. Keep raw lifecycle calls unwrapped in compileFresh; the new reentry634–655 and failure-after-allocation603–615 are source-correct decisive cases and need no replacement. |
| P7 | Raw ICU726–730 now executes the dotted baseline; its runtime never contains escaped/computed Identifier text. G1's computed AST shape and escaped pure keys do not prove late allocator wiring. | Execute raw compile/read ICU with actual escaped `_v0` root and a separate computed `_v0[_v1]` selector operand, expected5 items, through actual emitted Identifier storage. Existing repeated-kwarg and selector/hoist tests can retain once-only/repeated-allocation proof; no duplicate broad ICU matrix is needed. |
| P8 | Browser calls768–770 follow two compileFresh calls and raw compilation without resetting the shared stream. The typed/thread inputs name candidate0 but browser allocates later suffixes. | Reset the browser legacy stream immediately before each typed7/thread106 baseline. ICU local allocation remains separately exercised. JSON round-trip/imported namespace772–782 is now real execution and is useful; preserve it. |
| P9 | executeFailure97 checks substring `${expectedClass}:`. Expected Error therefore accepts TypeError or RangeError containing the same message. The post-condition failure control444–452 could pass the wrong error class. | Match the actual error class token exactly, alongside intended message and SyntaxError exclusion. A small credible negative assertion showing TypeError cannot satisfy expected Error is sufficient; no new diagnostic parser/framework. |

Original nested array/object/default leaf coverage is only partially explicit:
object/default328–332 and nested-function335–342 execute, but no colliding
array parameter leaf is present. Where this obligation is not discharged by a
specific existing applicability row, one admitted `(array :number
result__gensym0)` typed-parameter consumer with argument99/result100 completes
that original leaf requirement; this is not an expanded destructuring matrix.

### Preservation versus newly missing composition

Do not require fictional capture inside the closed private rest loop or async
getter. The existing `discard-bindings.test.js:133–178` executes scalar/nested
rest values and TypeError labels including `rest arg '_'`; its97–120 exercises
private names/identities and generated-name source opposition. These remain
applicable because rest preparation, labels and finalizer identity protocol
were not rewritten. Fresh focused/full execution of those canonical cases can
retain their value/check/label composition without duplicating them here.
The new late typed-discard/completion consumers661–685 now exercise actual F1
Source failures; they remain valid public-owned private lowering cases.

`host-reference-lowering.test.js:49–76` retains a genuinely shared host-reference
atom across two calls and checks one alias plus real Symbol identity; its90+
guard/no-match shadowing tests preserve intrinsic selection and error semantics.
`icu-generated-names.test.js:69–128,152–180` retains hoist/selector collisions,
repeated kwargs/once-only effects and recovery;183–208 retains exact raw anchors
under both Reflect branches. `lazy-protected-invocation.test.js:55–142` retains
no-request, malformed/duplicate/orphan/incomplete and cleanup proof. Those
address unchanged protocols, not P7's new escaped/computed late composition.

The corrected test has actual yielded values and named-generator construction/
advancement effects405–475, real async Promise identity/value and closed getter
presence476–498, new late private/intrinsic cases661–685, exact raw lazy foreign
113/helper1 case710–724, expanded getter/argument/receiver trace732–751 and real
post-JSON namespace772–782. Preserve these improvements. A new duplicate
private-rest/negative-protocol/identity matrix is optional, not a blocker when
the stated retained cases are explicitly mapped and freshly run.

### Criterion and gate disposition at89

| Row | Source-first disposition |
| --- | --- |
| PN-01 | F1/F5 source fixes and exact helper assertions assessed; P1/P7 consumer composition still required. No runtime acceptance. |
| PN-02 | F2/F3 source fixes assessed; P1–P4 and controlled direct/array-leaf consumers remain. HOLD for proof. |
| PN-03 | F4 source fix and actual failure/interleave/reentry assertions assessed; P2/P5/P6 remain. HOLD for proof. |
| PN-04 | Actual late private/intrinsic/raw-lazy/closed-carrier source cases improved; retain named canonical protocol/identity/rest checks; P7 remains. |
| PN-05 | Real JSON namespace now present; P8 and actual missing Source witnesses remain. P9 must make failure class assertions honest. |
| PN-06 | Unchanged8/78/15 delivery contract; fresh successful materialized execution still pending. |
| PN-07 | Exact3-path correction/equal identifier blobs/trailers checked; source-first proof HOLD and full required gates remain. |
| PN-08 | Independent final gates, accurate CC close/history and root closing metadata/routing remain pending. |

Root reported stopping further full attempts after a TMPDIR-missing failure
(86 passes/13 failures before M6); this reviewer did not inspect mutable running
logs or reproduce it. Preserve actual receipts and the previously reported
stale-stage37/5 and discarded ad-hoc-eval violation, with their limits. A claimed
keyword/Dissoc Source consumer in a milestone must be reconciled against the
actual committed test above; descriptions cannot substitute for missing source.
No intent attribution is made. Code stays frozen89, release82 and S07 unopened.

**Verdict: HOLD for mandatory test proof, not a newly demonstrated implementation
defect.** Root may author the bounded test-only correction; no helper/module/
native/policy scope expansion is needed. This source-only review created no
jobs and returns control without executing or importing the mutable stage.

## Source-proof review 03 — correction02 ata44 — PASS

2026-11-14. Same independent Sol6.1 High reviewer. **PASS for the committed
source/proof contract**, allowing root to resume CC full validation at this
same pin. This is not independent runtime acceptance, final PN disposition or
BS-06 close; mandatory full/materialized/citation/size checks and later root
metadata remain pending.

Reviewed immutable commit `a44e16db96ca4ae76de124b555c34ffe2c2779ba`, tree
`4080ee3f7be200610814b39b4118d2b5f3062ca8`, parent89. Root attested clean
checkout/owner return and focused42/eight-path terminal0; this phase did not
execute that command or infer coverage from its green result. Independently
read all905 committed test lines in bounded chunks, the full issued iteration02,
P1–P9/array-leaf map and retained canonical applicability from Source02.
Only immutable Git text and stable planning inputs were read; no execution,
build, mutable target load/import, product edit or Git mutation occurred.

### Algorithm and delivery retention

Both identifier diffs from89 contain exactly the single JSDoc sentence,
accurately identifying Source text and directing emitted consumers to
emittedIdentifierKeys. Thus the complete F1–F5 implementation assessment at89
above remains applicable: functional code, interfaces and callers did not
change. Both corrected helper files share blob
`45cf70e6a9ec0b12b81ffbf3de3b9cdace8cf214`. The exact3-path correction and
original15-path range from82, commit parent/tree and adjacent coauthor trailers
were independently checked through Git. No algorithm or new API was added.

### P1–P9 and original leaf proof disposition

All locators below are in committed test/forms/public-generated-names.test.js
ata44. They describe executable assertion source, not independently reproduced
results from this review.

| Obligation | Actual delivered source/assertion | Source-proof verdict |
| --- | --- | --- |
| P1 | 358–383 executes actual leading-hyphen Dissoc keep7, raw keyword-thread7, its ordinary-atom control7, nested enclosing-result7 and keyword-headed variant7, all via compileFresh/executeModule. 390–398 adds both raw ->/->> nested typed variants. | PASS: owning-input reservation and actual Source consumers are now delivered; the function-array entries are callable and the nested counter0 is genuinely opposed. |
| Array leaf | 301–304 uses actual typed array parameter result0 with input99/result100, alongside existing object/default338–342 and nested345–352 coverage. | PASS: original leaf obligation is no longer inferred from a nested-function label. |
| P2 | Resets606/614/620/632/636/653 immediately precede Single, sole-Multi, value Match, Genfunc, instrumentYields and statement Match construction. Their actual compiled consumers661–667 observe100/100/106/99/99; statement inputs use matched2 after target0 rejection. | PASS: each intended first candidate is controlled, and distinct generated scopes can safely reuse a suffix after separate explicit resets. The valid fragment570–575 remains. |
| P3 | Source438–447 deliberately uses target0/matched2; separate fresh guarded statement450–456 uses only matched1 and records guard before body with exact [guard,88]. | PASS: matched storage is now actually opposed and guard ordering/count is observable. |
| P4 | Separate fresh Source386–388 uses a foreign string-key rest1 child record and observes keep7. | PASS: alias0 is accepted first, so rest1 is the opposed candidate; it is separate from P1's alias0 rejection. |
| P5 | Actual classified SomeThread581–590 receives injected atom callback t__custom0 then t__custom1; returned expression is compiled/run595–599 with outer99, exact106 and callback2. | PASS: real h.gensym wiring and skip/return composition are tested, beyond a factory-only assertion. |
| P6 | 693–699 explicitly resets around identical early Source, asserts generated-code equality and executes8. Raw failure/probe707–719, interleave722–735 and reentry738–759 remain unwrapped in compileFresh. | PASS: reset determinism is distinguished from the monotonic lifecycle contract. |
| P7 | 836–840 preserves an actual backslash escape in raw Source and executes late ICU5 items;842–847 separately executes actual computed `_v0[_v1]` raw Identifier text with5 items. | PASS: these are real compile/read late consumers, not only key or AST shape checks. |
| P8 | Resets885/887/889 immediately precede actual staged-browser typed7/thread106/ICU5 calls. Completed Source JSON transport is compiled and imported892–902, checking literal data and visible-only namespace. | PASS: browser candidate0 oppositions are controlled and transport/namespace assertions execute. |
| P9 | 98–103 extracts the controlled actual exception class token and compares equality;537–541 runs actual TypeError through the same helper, accepts TypeError and rejects expected Error. Real post/yield class/message controls remain505–535. | PASS: TypeError no longer satisfies expected Error by substring; SyntaxError remains explicitly excluded. |

The general success helper47–70 requires exit0, empty stderr and exact stdout.
The failure helper requires nonzero exit, exact extracted class, intended
message and no SyntaxError. The negative control uses that same helper and a
known actually generated TypeError source. Exactly eight top-level groups
remain; no steps/skips or count padding were introduced.

### Full eight-PN source map and preserved contracts

| PN | Source/proof disposition ata44; remaining acceptance work |
| --- | --- |
| PN-01 | F1/F5 source assessment retained; exact Unicode/malformed/emitted-key/candidate/atom-identity assertions136–281 plus actual P1/P7 consumers are present. Fresh execution still required. |
| PN-02 | Borrowed Surface traversal/keyword-role assessment retained. Actual typed scalar/normalized/array/default/self/sibling284–353; every early family356–464; direct/fragment568–667 now has controlled meaningful consumers. Fresh focused/full execution remains. |
| PN-03 | F4 assessment retained. h custom/partial/early-rejection580–691, explicit reset693–705, failure/interleave707–735 and reentry738–759 observe the selected global stream/ownership behavior. No per-compilation reset API was added. Fresh execution remains. |
| PN-04 | Actual private completion/discard/intrinsic765–789, raw/lazy anchors802–828, raw ICU830–847 and expanded receiver/effect849–868 compose with retained canonical rest/identity/negative tests. Closed async value/effect/presence543–565 remains honest. Fresh execution remains. |
| PN-05 | Actual Source errors/values/effects and iterator timing466–565; direct/raw boundaries568–667; Deno/browser baselines872–890; completed JSON/data/API/namespace892–904 are delivered. No new raw Source-resolution, private transport, source renaming or strip claim. Fresh execution remains. |
| PN-06 | Original8/78/15 membership/delivery is unchanged; immutable comment mirror equality checked. Actual successful fresh materialized command/config/status/output and all15 comparisons remain pending. |
| PN-07 | Exact3 delta/original15 range and trailers checked. This source-proof PASS clears the internal full-validation hold only. CC full/docs/M6/final-HEAD citations/fresh81920 size and separate fresh independent checks are still required. |
| PN-08 | Historical177/89 HOLDs and failed/unknown/discarded attempts remain. Accurate CC current close, independent final disposition and root retrospective/BS-06/API/research routing remain pending. No row closure here. |

Retain the explicit Source02 applicability map: unchanged canonical discard
tests133–178 prove closed rest values/checks/labels; their97–120 and
host-reference-lowering49–76 preserve private/shared identity and one-alias
composition. Existing ICU69–128/152–180 preserve repeated kwargs, once-only,
selector/hoist and recovery; its183–208 and full lazy55–142 preserve exact
anchors, both Reflect branches, rejection and cleanup. No identity/host-policy/
rest-layout code changed after that assessment; fresh focused/full runs must
still execute these cases. They supplement the new P7 composition rather than
substitute for it. No duplicate optional protocol matrix is required.

Read root's native-keyword-follow-up.md only as a source-assessed later-lane
WATCH/routing input. No native source investigation, build or probe was run,
and no native defect/parity or retrospective S05/82 acceptance claim is made.
S07/Arc06 LI-04 disposition remains root's future routing responsibility.

No remaining mandatory source/proof blocker was found. Root may resume CC full
validation at exacta44; any further product change requires an explicit new
candidate/review. Release remains82, S07 unopened, and this review returns with
no jobs and no runtime/full-gate acceptance claim.

## Independent fresh validation 04 — a44 — PN-01–07 ACCEPT; PN-08 pending

2026-11-14. Independent OpenAI gpt-6.1-sol/high reviewer, after root's exclusive
source/build validation handoff. **ACCEPT the reviewed implementation and
runtime/gate proof for PN-01 through PN-07. PN-08 remains pending the separate
root closing-metadata/retrospective/parent-row review.** This is not release
integration or BS-06/ledger closure. Release82 and unopened S07 remain intact.

Direct Git checks before and after gates show clean task source at
`a44e16db96ca4ae76de124b555c34ffe2c2779ba`, tree
`4080ee3f7be200610814b39b4118d2b5f3062ca8`, branch
`codex/qualified-adt-core`. Source-proof03's complete a44 test/source review
and F1–F5 correction assessment remain applicable to these exact bytes.
No source/Git mutation occurred. All commands ran after precreating and
verifying the owned `/private/tmp/lykn-arc05-s06-cdc/{tmp,xdg,npm}` directories,
with explicit warm `DENO_DIR=/Users/oubiwann/Library/Caches/deno`.
The fresh independent evidence is [final-a44](artifacts/cdc/final-a44/);
[execution.md](artifacts/cdc/final-a44/execution.md) records exact commands,
environment, initial sessions and terminal tool exits. These are independent
receipts, not relabelled CC results. All sessions ended, with no jobs returned.

### Independently reproduced gates

| Actual command | Terminal result and inspected evidence |
| --- | --- |
| make fresh-artifacts | exit0; optimized release binary and freshly staged lang/browser/testing. Ran before focused tests. |
| Prescribed focused Deno command | exit0;42 passed/0 failed across eight paths, including all eight S06 groups. Focused stdout/stderr retained separately. |
| ONE make check | exit0; required dependency/citation/build/Clippy/Rust-format/Lykn-syntax-lint checks, Rust/full corpus/docs complete.42 Rust result records sum1798 passed/0 failed/0 ignored, including Lang1217; JS/Lykn1586 passed/67 steps/0 failed; compiled99 Lykn files; docs482 passed/0 failed from22 files. Docs ran once. |
| Separate final-HEAD make check-cited-paths | exit0;64 documents,601 historical citations. |
| Fresh make bundle-size-check | exit0; raw388047, minified184990, gzip50162 bytes; same-tool baseline27630 at4b9546cdba6bdcd4e5dd82d7cdf6cf58da9edde0; delta22532;50162<81920. |

Full stdout/stderr are retained for each command, not just extracted result
lines. The full-check initial session48535 terminated exit0 with no continuing
session (terminal chunke98139); focus session44107 likewise terminated exit0.
Citations and size returned immediate terminal0. The independent run required
no gate retry. Pinned dependency access used the already authorized escalation;
no test, dependency, cache requirement or gate was weakened.

The42 Rust counts, in stream order, are
`0,99,194,2,1,4,3,1,4,1,4,2,2,14,5,2,4,6,2,5,3,2,16,1,59,4,1,2,1217,1,22,23,18,9,4,28,5,24,0,0,2,2`.
Their sum is1798; the historical514 is erroneous. Cargo's optimized release
build and unoptimized dev/test profiles are separately visible in stderr.
M6's standalone CLI is copied from Cargo's CARGO_BIN_EXE_lykn in its test/dev
profile; it is not claimed to be the optimized release binary.

Docs preserve the existing15 skipped blocks and nine no-block files: the
three Deno testing/task-runner/publishing guides and six surface/kernel browser
HTML examples. These are exclusions, not executed examples. DD-53 R-5's fresh
outer test reports ok; its console branch marker is absent from this stream.
Actual source128–151 allows a permission/reachability early return. Thus this
run does not establish external JSR registry-path execution or cold networking.
CC's separately retained explicit unreachable-JSR skip stays CC evidence.
No extra probe/rerun was used to strengthen that claim.

### Actual fresh M6, not outer-result inference

Fresh DISTINCT evidence root is
`artifacts/cdc/final-a44/m6-evidence/`. Read the actual delivery and strict
commands, config, both status files, full output streams, and every comparison
value. Delivery compile and strict consumer each report success=true/code0.
The actual strict child runs `deno test -A --cached-only --no-prompt --config`
with the following eight paths: embedded-adt-pattern, surface-type-context,
reserved-binding-output, icu-generated-names, public-generated-names,
expander/lexical-regions, discard-bindings and remaining-discard-bindings.
Its own stdout reports **78 passed/0 failed**, and its stderr is **0 bytes**.
This includes the eight new public groups and retained discard7.

The actual import config maps lang/ into fresh fixture-owned
`.tmpn39Ygy/xdg-cache/lykn/embedded/0.6.0-compiler-split/packages/lang/`
under the owned TMPDIR; browser/ maps the freshly staged
`target/lykn/build/browser/`. Delivery's copied CLI runs from standalone/ and
uses that fixture XDG; strict execution inherits the owned parent XDG and uses
the explicit materialized lang/ map. Child Deno resolves to
`/opt/homebrew/Cellar/deno/2.9.6/bin/deno`. Command receipts retain actual
arguments and inherited/overridden environment; macro child argv is not
separately traced. Shared DENO_DIR remains warm. Fresh XDG materialization is
not cold external-dependency resolution. Delivery stderr retains five fixture
warnings (unreachable match clause and four unused bindings); only the strict
consumer stderr is claimed empty.

Both recorded booleans (canonical_equals_embedded and
canonical_equals_materialized) are **true for every row below**. These are
the read actual comparison-file values, not a count inferred from filenames.

| File | Bytes | canonical=embedded | canonical=materialized |
| --- | ---: | --- | --- |
| binding.js |35636|true|true|
| classifier.js |58364|true|true|
| compiler-private-atoms.js |1541|true|true|
| compiler.js |74629|true|true|
| expander-core.js |99445|true|true|
| function-clauses.js |1890|true|true|
| host-invocation-kernel.js |3747|true|true|
| host-invocation.js |8780|true|true|
| identifier.js |9489|true|true|
| lexical-regions.js |8064|true|true|
| protected-host.js |22819|true|true|
| reserved-words.js |1445|true|true|
| surface-helpers.js |27004|true|true|
| surface-type-context.js |423|true|true|
| surface.js |12158|true|true|

### Eight-row independent disposition

| Row | Independent disposition and actual proof |
| --- | --- |
| PN-01 | **ACCEPT.** Reviewed corrected physical-key/decoder algorithms, exact source/emitted Unicode and malformed-boundary assertions, allocator candidate/insertion/identity assertions in group1; real Source leading-hyphen and escaped/computed ICU consumers in groups3/7 now execute in focused/full and materialized delivery. No full lexical identity claim. |
| PN-02 | **ACCEPT.** Source-proof03's complete-input/role-aware traversal and producer/caller inventory, actual typed scalar/array/object/default/self/sibling and all-family Source consumers, controlled direct builders and fragment all execute. The nested keyword consumer opposes the earlier enclosing producer. Ordinary direct builders own only supplied input; no new standalone private lifecycle is claimed. |
| PN-03 | **ACCEPT.** Actual custom h callback106/count2, factory rejection/cycling, explicit reset determinism, monotonic failure/probe, independent interleave and reentry inner8/outer106/recovery10/probe4 execute. Exported gensym/reset legacy stream remains; no macro replay/new global active unit or automatic public per-call reset is introduced. |
| PN-04 | **ACCEPT.** New actual late private completion/discard/intrinsic, raw escaped/computed ICU, expanded receiver/effect, lazy anchor and closed async value/effect/presence consumers execute. Retained canonical discard133–178 supplies rest values/checks/labels; discard97–120 and host49–76 supply private/shared identity/one alias; ICU69–128/152–208 and lazy55–142 retain repetition, once-only, selector/recovery, exact anchors/Reflect branches/rejection/finally cleanup. These relevant unchanged tests ran fresh focused/full and the applicable materialized subset. |
| PN-05 | **ACCEPT.** Actual Source values/effects, exact class+message failure controls including TypeError-as-Error rejection, overload/yield timing, direct/fragment consumers, reset-controlled staged browser typed7/thread106/ICU5 and completed JSON/data/visible-namespace execution passed. Existing raw/private transport and checked-only/protected-root boundaries remain scoped; no public strip API or source-binding renaming is claimed. |
| PN-06 | **ACCEPT.** Actual inner M6 command/config/status/78-of-eight/empty stderr and all15 read true comparison values above establish changed materialized delivery, including lazy module. Cache/profile limits are explicit. |
| PN-07 | **ACCEPT.** Prior immutable exact15-range/three-path correction/trailer checks apply to unchanged clean a44. Independent fresh artifacts, focused42, one full check/docs once, actual M6, final-HEAD64/601 citations and fresh50162<81920 size all terminate0. No dependency/lock/gate/snapshot weakening. |
| PN-08 | **PENDING ROOT METADATA REVIEW.** This independent runtime disposition and artifact inventory are complete. Root's retrospective, closing diff and parent/BS-06/API/research routing require their separate review; no ledger/parent row is changed here. |

### API inventory, history and handback

Independently read final a44 `packages/lang/deno.json`: **six unchanged package
entrypoints** `.`, `./mod.js`, `./reader.js`, `./compiler.js`, `./expander.js`,
`./surface.js`. No new package entrypoint is correct; “only two” is false.
Five new identifier module exports remain actual API audit inputs:
toJsIdentifierParts, decodeIdentifierEscapes, physicalIdentifierKeys,
emittedIdentifierKeys and createGeneratedNameAllocator. Optional allocator
threading on supported builders/helper adapters is also an API input;
unchanged mod.js does not erase module-level exports/options. The separate
Arc06 LI-04 audit must use these concrete interfaces and the legacy stream/
owned-input/private transport limits. Read CC's report-only append correcting
all six entrypoints, withdrawing the unsupported514 derivation and correcting
77/78 chronology; historical wrong text stays preserved.

Earlier initial raw-stream-unavailable failures,77/78 initial M6 failure,
stale-stage37/5, discarded ad-hoc-eval violation, TMPDIR86/13 and interrupted
unknown-session attempts remain historical evidence with their original limits.
They are neither rewritten nor counted as successful independent gates. Fresh
final-a44 streams/command/session receipts are separately owned and complete.
Inspection-only path/glob mistakes during this final read did not execute gates
or change source; no validation failure/retry is hidden by them.

No native-keyword follow-up probe ran. Its source-assessed WATCH remains a
later-lane input, not a native parity/defect finding or revision of accepted82.
No release integration, S07 opening, publication or root-ledger mutation was
performed. **Source/build validation ownership returns to root, clean a44,
with no running jobs.** No further aggregate gate is needed solely for later
metadata-only changes; any product change needs a new explicit candidate.
