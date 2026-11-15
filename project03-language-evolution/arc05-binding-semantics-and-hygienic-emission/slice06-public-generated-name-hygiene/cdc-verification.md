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
