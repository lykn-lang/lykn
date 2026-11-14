# S02 correction03 — four independent review findings

Issued2026-11-13 after separate Sol source-readiness approval. Same operator-selected
OpenAI gpt-6-luna/high CC / separate gpt-6.1-sol/high CDC, Autonomous Mode.
Predecessor cc-prompt-iteration02.md; original and all refinements remain
immutable. Complete ALL ND-01–09, not a smaller correction-only contract.

Source /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
codex/qualified-adt-core, clean3617a3aecf69cd4f6a39cd9ebb68e09cdc5c15e9,
treecf3b823daa93a588597147121f8dd273637978ce. Planning existing orphan home;
review packet f3c04dff5f3fb2570fe1cfab76527002434c9ea5. Root owns architecture/
planning Git/index/status. Source/build transfers back to Luna on issue/dispatch.
All rows remain open at the independent HOLD; no release/S03 advancement.

## Required reading and inherited authority

Read this prompt, current plan/ledger and complete initial HOLD section in
cdc-verification.md. Read actual affected definitions below and the relevant
guide passage in full. Prior required source/skill reads remain applicable
where unchanged; do not reload the retired mega-packet. Record actual coverage,
truncation recovery, current source and contract readback before edits in
artifacts/cc/index.md. Apply Rust AP-09/AP-12 and meaningful positive/negative
testing as before; no new dependencies, public API or broad lexer redesign.

Only THREE source paths change in this correction:

- crates/lykn-lang/src/classifier/forms.rs
- crates/lykn-lang/tests/remaining_discard_bindings.rs
- docs/guides/00-lykn-surface-forms.md

The complete inherited delivery remains the original ten-path implementation;
this correction's source commit is exactly these three paths. No production
writer/emitter/dispatch/mirror change is needed for the four findings.

## R01 — coherent native Source versus raw IR teaching

At3617a3ae, guide00:1319 says every kernel form is directly usable as Source,
then1326–1340 labels an exclusively raw lambda row as both APIs. Correct the
surrounding paragraph AND table, not merely add another contradictory caveat.

Recommended: label the table explicitly as compiler-facing raw kernel IR,
and give actual normal strict `.lykn` spellings in its Notes or a clear adjacent
mapping. const/let/var/function/function* require kernel: escapes in Source;
arrow and admitted passthrough forms keep their actual spellings. State typed
Source `(lambda (:any name) name)` separately from raw `(lambda (name) (return name))`.
Native Source class/class-expr remain Source forms; their prefixed escapes,
like kernel:lambda, stay rejected. Direct raw codegen writes supplied valid IR
literally; no namespace addition. Readers must be able to identify which API
each example belongs to. Preserve useful kernel/Source examples and actual
class-body teaching, and use Source-first phrasing for normal authors.

## R02 — observe IteratorValue at the actual protocol boundary

Current raw_nested_iteration_patterns_keep_array_holes_and_iterator_close
test234 places holeReads on index0 of an array stored inside the skipped row
value. Reading that row value never touches its index0, so a wrong implementation
would pass. Replace that setup with iterator results whose FIRST `value`
property is the observed getter; retain the existing early-close fixture.

Concrete recommended product fixture: each row is a fresh iterable. next()'s
first result has done:false and a value getter incrementing holeReads, returning
the skipped value8/9. Its second result returns {value:nested1/2, done:false};
later result is done:true. The current loop pattern `(array _ (object (alias
:value nested)))` must skip the first IteratorValue and leave holeReads0.
Run the corresponding non-hole `(array _value (object (alias :value nested)))`
control on fresh inputs: that same getter must run once per row (two reads for
the two-row fixture). Keep body/foreign99/nested results and separate outer
closable next1/return1 behavior. Print actual source/JS/streams on failure;
these meaningful distinct outcomes must fail the rejected implementation.
Existing JS setup strings inside ordinary Rust product tests remain allowed;
do not create a separate JS research/evidence harness.

Reviewer artifacts/cdc/supplement02.lykn supplies an independently executed
Lykn protocol witness if useful; preserve its original bytes/pin. Do not replace
the permanent product oracle with a pointer to that supplemental success.

## R03 — keep member-expression atom keys out of new static admission

At classifier/forms.rs1452–1467, new zero-name alias admission accepts every
Atom. Actual codegen/names.rs254–257 routes colon atoms through member-chain
emission. A grouped `(object (alias owner:key _))` therefore reaches malformed
`owner.key: private`. Keep the agreed STATIC key contract without adding a
computed-key feature or changing already-admitted named-pattern behavior.

Factor a private static-key predicate (local helper name discretionary).
Atom accepts an ordinary static spelling, excluding BOTH colon and dotted
member-expression atoms (`owner:key` and `owner.key`); the existing normalizer
preserves dots, so a colon-only guard is insufficient. Keyword/String/Number/Bool/Null keep their current static roles. All
other expression nodes remain rejected. Check the raw atom spelling via its
accessor; never use a global colon ban on literal String/Keyword keys or values.
Use existing normalizer/identifier policy; no general name/Unicode redesign.

Add true grouped zero-name colon AND dotted member-key negatives with the existing early
classification diagnostic BEFORE codegen, capturing its pre-fix failure.
Preserve plain Atom, keyword, String (including literal `"owner:key"` and
`"owner.key"`), numeric,
Bool/Null positives and getter/evaluation effects. Do not rerun unrelated named
patterns through the new structural rule. Actual CLI check and checked/strip
compile must also reject a balanced Source fixture before producing JS; direct
native commands and a durable .lykn fixture under artifacts/cc suffice without
editing the CLI test file or adding orchestration logic.

## R04 — make raw lambda binding control discriminate

Current raw lambda test143 sets foreign `_`=7 and supplies7. Change the foreign
value to99 while keeping argument7 and expected return7. Retain the literal raw
parameter/body spelling assertion as appropriate. Canonical Source discard99
remains a different control. No raw writer implementation changes are authorized.

## Verification, provenance and handback

Capture the meaningful R03 red and all materially changed failed/final fixture
conditions before execution. Never reconstruct a missing snapshot as original.
The earlier CC failure/snapshot limits and reviewer interrupted130 gate remain.
Use existing warm DENO_DIR and owned S02 CC xdg/npm/tmp paths. Native staged
artifacts must be refreshed before dependent runtime tests. Session handles/
exact-owned cleanup, numeric statuses, cwd/env/command/raw streams stay durable
under artifacts/cc; root alone stages/commits planning.

Focused corrected native tests, preserved discard/binding/lexical/CLI behavior
and R03 actual CLI negative first. Then successful final make check with docs
included and precreated absolute M6 hook; do not append duplicate docs to it.
A failed gate is retained and corrected autonomously; source changes justify
the required successful rerun, not weaker validation. Capture actual M662/14
and counts, warnings, network skip and cache limits. Exact THREE-path correction
commit --only with contiguous Codex/Billo trailers; final-HEAD citation and fresh
81920-byte bundle gates. Do not amend/reset the initial candidate.

Append dated correction03 sections to closing-report/index, preserving initial
candidate/HOLD and all assignment identities. Walk all9ND rows with fresh or
explicitly retained applicable evidence, artifact inventory and bubble-up.
Return clean committed candidate/tree/no owned sessions and source/build to
root, CC proposed-done only. Separate Sol validates final source/docs/oracles
before running final gates and before root closes rows/retrospective.

No Python execution or parity exception. No Python/Ruby/Fennel/handwritten JS
research/helper/evidence/orchestration/command logic; new helpers use Lykn.
Ordinary product-test fixtures, direct native CLI/simple filesystem lifecycle
remain allowed. No S03/merge/push/release/publication/new dependency/licence/
remote CI/experiment; existing NUMI range risk remains outside scope.
