---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice02-native-binding-discards
status: closed
version: "1.5"
depends-on: [slice01-public-source-discards]
---

# Remaining native discard binding forms

## Accepted delivery —2026-11-14

S02 independently closes at9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a,
tree6d64692fde0c367e73deeda1ec1aca19e49d6b93. Separate Sol6.1 High
[verification](cdc-verification.md) resolves R01–04 and accounts for all nine
ND criteria; root completed the [retrospective](cdc-retrospective.md), BS-02
reconciliation and downstream API/research routing. Source/build returned clean,
with no owned jobs. Integration is task-branch only; release remains0829e892.
BS-03 onward, S09 signature-design re-entry, NUMI and qualified/library/book/
human gates retain their owners. S03 is not opened. The dated issue/HOLD/
preparation records below remain history, superseded only for current status.

2026-11-14 pre-gate review holds28733980: R02/R04 corrected, R03 pipe Atom still
emits invalid bare syntax, and R01 raw table still includes Source-only assign.
[Correction04](cc-prompt-iteration04.md) is issued for a literal static-
key representation in the NEW zero-name grouped admission branch and the last
table mismatch. Three source paths/all9criteria remain; no broad naming/raw API
rewrite. The classified static Atom/Keyword key becomes a normalized String
literal, preserving spans, existing property names and all expression positions.
Earlier punctuation-only source-readiness recommendations are superseded.
Separate Sol reviewed and approved the validation-before-normalization branch,
span/role/caller preservation, concrete tests and raw-table repair. Source/build
transfers back to Luna on dispatch; implementation acceptance remains pending.

2026-11-13 independent initial HOLD at3617a3ae records four findings: guide
Source/raw-IR contradiction, wrong loop getter observation, member-expression
Atom admitted as static alias key, and a nondiscriminating raw lambda control.
[Correction03](cc-prompt-iteration03.md) is issued for those findings;
all9ND rows remain open and full original scope is retained. Review fresh44
native/4CLI and pure Lykn supplement pass; its full gate was interrupted130,
not a successful final check. Original candidate/HOLD/evidence remain intact.
Separate Sol approved the complete correction, including both colon and dotted
member-Atom negatives and preserved literal String keys. Source/build transfers
to Luna on dispatch. No source-code acceptance is inferred from readiness.

2026-11-13 issued refinement02 corrects root/reviewer admission assumptions:
actual KERNEL_FORMS excludes lambda/class/class-expr. Those prefixed escapes
remain rejected. Actual typed Source lambda and Source class/class-expr remain
the admitted language consumers; raw codegen lambda/class stays a separate
literal-IR API. [Refinement02](cc-prompt-iteration02.md) preserves full9-row/
TEN-path scope and requires explicit positive/negative/API/guide distinctions.
No namespace feature is introduced. Earlier unconditional kernel-lambda/class
route wording below is superseded only by this verified frontend fact.

2026-11-13 refinement01 issued: the complete initial scope remains.
Root's subsequent source review identifies negative numeric alias keys as an
invalid-JS edge in the existing writer, exposed by grouped zero-name admission.
[Refinement01](cc-prompt-iteration01.md) adds only codegen/emit.rs to the original
nine source paths, syntax-correct negative numeric key spelling and existing
Bool/Null static alias keys. The initial assignment is superseded by
refinement01 after separate Sol source-readiness approval.
Original prompt is preserved. Sol confirms sign-negative numeric brackets,
existing -0→0 formatting, Bool/Null literal keys and the full9-row scope.
The final witness must use a genuinely grouped Bind plus getter count; a
single-Bind numeric red only establishes the writer defect, not group admission.

## Authority and useful delivery

2026-11-13 operator opens Arc05 S02, Luna6 High CC, separate Sol6.1 High CDC,
usual Autonomous Mode. Root owns architecture, planning Git/index/status and
serial source/build handoffs. Open, implement, independently validate and close
S02, including retrospective and bubble-up; do not advance S03 or integrate a
release. No push/publication/new dependency/licence/remote CI/experiment.

Deliver coherent `_` discard behavior through the native canonical pipeline's
remaining binding forms. A discard creates no source binding but retains
argument/initializer/default evaluation, destructuring and checks. `_value`
is ordinary; schema fields, keys, assignments, names and API slots are separate
roles. This consumes accepted native Source759567f9/public49982409, not a new
underscore policy. Existing source spellings and general hygiene remain later.

Source: /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
branch codex/qualified-adt-core, clean4998240927909c3abc0172dfef2b56076b19f708,
treeb18e75dc06888a771bd7f3aa92a3c2cb1a7e1dc8. Planning is the existing orphan
worktree /Users/oubiwann/lab/lykn/lang/.worktrees/planning. Release0829e892 stays.
Useful integration state is independently accepted source on this task branch.

## Binding decisions

1. Native canonical Source, `.lyk` classification and admitted `kernel:` escapes
   prepare actual raw const/let/var, numeric-for declarations, for-in/of/await-of,
   function/function*/arrow/kernel-lambda and class parameter binding roles.
   Async wrappers consume their callable payload. Object callable values use
   those same callable routes; no new object-method grammar is introduced.
2. Catch retains its legacy expression-pattern writer. Bare `_` in a direct
   catch array remains a value-reading private binder, unlike a declaration's
   existing array hole. Object shorthand `_` preserves key `_` with a private
   target; literal pair/computed keys remain keys. `(object (default _))` means
   property `default`, not a declaration default wrapper. Actual default/rest/
   alias subwriters retain their own pattern/value slots. Keep last-catch/
   finally selection, body contexts, legacy catch8 and S01 strict-name controls.
   No catch grammar unification or typed-source-fn expansion in catch.
3. Direct raw `codegen::emit_module_js` remains a literal writer of supplied IR.
   It does not acquire Source discard preparation. Canonical emitter output
   must already have private bindings finalized before raw writing/JSON. This
   explicit API distinction preserves generated schema constructors and existing
   raw consumers; document and test it rather than claiming raw Source parity.
4. Grouped untyped Bind admits structurally valid all-discard/empty array/object
   patterns as single Bind does. A zero projected-name count is not a validity
   test. Keep arbitrary/malformed zero-name expressions rejected, typed-group
   atom restriction and named duplicate diagnostics. Preserve effect/order,
   getter/iterator/default/rest behavior and source-only exports.
5. Multi-clause func with more than one clause rejects ANY top-level
   ParamShape::Simple default or rest parameter, even in mixed signatures.
   Diagnostic: `multi-clause func does not support top-level default or rest parameters`.
   Apply to classify/check and directly constructed SurfaceForm emission, with
   source span and existing Result/Diagnostic propagation. Single-clause and
   defaults/rest INSIDE destructured parameters remain supported. Current
   dispatch assumes exact arity and cannot implement omitted/variadic binding;
   emitting malformed JS is not a supported contract. Future support belongs
   to Arc05 candidate S09, held for an explicit arity/selection/binding design
   and both-backend proof. S02 delivers an honest diagnostic, not that feature.

## Source-grounded implementation spine

At49982409, emitter/forms.rs2829 is the sole caller of
lower_discard_binding_pattern. Raw paths788/819/907 and class prefixes5300
do not prepare discards. Reuse CompletionValueId and existing whole/fragment
finalizers353; ordinary gensym lacks the necessary whole-unit reservation.
Do not scan/rewrite all emitted forms: generated Type schema parameters3474
are real fields and would break. Prepare only source-consumed binding slots.

In emit_kernel_children, retain original role/context recursion, then lower the
actual emitted declaration/loop binder and raw function parameter slots. Map
each parameter independently, not the parameter container as an array pattern.
Handle top-level default/rest/spread wrappers (current helper covers only atom/
array/object roots). Preserve RHS/key expressions and preexisting NameRes/private
metadata; nested callable defaults must still traverse normal emission once.
Function name slots stay unchanged. Anonymous function* uses its first list;
named function/function* uses the following parameter list. Arrow shorthand,
async and kernel-lambda must all reach the same preparation.

Class Method.prefix has the parameter list last (constructor/ordinary index1,
get/set index2); lower only its parameter elements after existing emission.
Keep fields and property names untouched. Route explicit kernel:class/class-expr
through the existing class classifier/emitter rather than bypassing member
roles with generic recursion. Keep static/async wrappers and in_class_body.

Use a separate catch-binding preparation helper after existing binder emission,
wired in ordinary and direct-return try paths. It must mirror codegen/emit.rs978,
1215/1277 and default/rest/alias writers1363–1398, not reuse ordinary object
pattern interpretation wholesale. In a default's left operand, use that actual
pattern subwriter's roles; do not lower a default RHS or computed key as a binder.
Do not introduce errors/evaluation from ignored clauses or alter selection.

Complete only the necessary shared projection for the writer's admitted
top-level spread parameter: kernel_param_names858 recognizes it like rest;
lexical_regions collect_default_paths338 traverses spread only in untyped
binding grammar, including nested default values. Typed schema/catch/value
grammar is not extended. Prove reserved-name validation and real named/form-
name default/body resolution so this does not become emitter-only support.

In classifier/forms.rs1344 replace the empty-name admission proxy for new
discard-only patterns with an actual structural predicate. For newly admitted
zero-name shapes, validate exact writer-supported forms: root array/object,
array `_` holes/nested patterns/default(target,value)/last rest or spread,
object `_` shorthand/default(_,value)/alias(key,target[,default])/last rest or spread.
Alias keys retain atom/string/numeric/keyword/boolean/null behavior; negative
numeric keys use syntax-correct computed brackets, including -0. Object rest/spread binds an identifier;
array rest may bind an admitted pattern. Validate arities and positions; no
arbitrary calls, literals, alias-as-array-element or missing default RHS.
Do not revalidate unrelated already-admitted named grammar through a new rule.

Share the multi-simple restriction between classify_func1689 and emit_func3793
so programmatically built units fail rather than emit invalid JS. Existing
LyknError::Classify/Diagnostic is sufficient; no public error/API redesign.

Private helper names and local factoring are CC discretion. Recommended
placement is focused helpers beside current emitter lowering; avoid a generic
new traversal framework. Clones needed to build emitted AST retain identity;
do not clone for borrow-checker convenience or allocate source-spelling caches.

## Exact source scope and immediate docs

Original nine paths, plus codegen/emit.rs authorized by refinement01 (TEN total).

- crates/lykn-lang/src/emitter/forms.rs
- crates/lykn-lang/src/classifier/forms.rs
- crates/lykn-lang/src/binding.rs
- crates/lykn-lang/src/lexical_regions.rs
- crates/lykn-lang/src/codegen/mod.rs — raw API documentation/boundary test
- crates/lykn-lang/src/codegen/emit.rs — negative numeric alias key syntax only
- crates/lykn-lang/tests/remaining_discard_bindings.rs — new native product tests
- crates/lykn-cli/tests/remaining_discard_bindings.rs — new actual CLI tests
- docs/guides/00-lykn-surface-forms.md — precise native discard roles/limits
- docs/guides/06-functions-closures.md — fixed-arity multi/simple restriction

No JS/embedded/M6 selection edits. Later public parity BS-03, DTS BS-04,
general naming BS-05–08, qualified ADTs, reader, library, book and human gates
remain owned. Arc06 LI-04 retains API/docs audit of raw-writer distinction and
new early diagnostic; immediate factual guide updates land with this slice.

## Proof and engineering application

[ND-01–09](ledger.md) is the complete scope. New tests execute actual emitted
ESM, native checked/stripped and finalized whole JSON, with runtime0/exact stdout/
empty stderr positives and precise negative diagnostics or TypeErrors. Preserve
current discard tests and legacy catch controls; no golden gensym spelling.
Detailed discriminators and worked source examples are in the active prompt.
Author examples are source-grounded sketches, not claimed pre-executed probes.

Rust anti-pattern AP-09 (AVOID) applies to malformed user forms: propagate the
existing typed error, never panic or emit a marker as a successful result.
AP-12 (AVOID) distinguishes necessary immutable AST reconstruction retaining
private identities from cloning to evade borrow ownership. Testing's validation
gates require actual composed behavior plus repository gates; count/presence
alone is not acceptance. Existing compiler-owned ADTs/NameRes and direct-return/
host/private lifecycle contracts override generic runtime/style defaults.

Before source-dependent tests run make fresh-artifacts: project.json resolves
lang/browser to staged target paths. Then focused new+existing native tests,
actual CLI check/compile/runtime and affected binding/lexical/emission/host
regressions; final make check once with docs included and precreated absolute
M6 receipt hook; exact-scope source commit; final-HEAD citations and fresh
81920-byte gzip gate. Each contributor runs independent required gates. Capture
actual M6 inner62/14, source pins, meaningful failure/final commands/status/raw
streams and own session cleanup. No repeated docs or new capture machinery.

Use existing warm DENO_DIR and owned /private/tmp/lykn-arc05-s02-{cc,cdc}/
xdg/npm/tmp. Pinned downloads, warnings, skipped docs and cache limits remain
explicit. No Python execution or substitute helper language; new helper logic
uses Lykn. Ordinary Rust/JS product tests, direct native CLI and simple shell
filesystem lifecycle are allowed. Preserve original failures and history.

Durable evidence lives in artifacts/cc and artifacts/cdc; CC also writes
closing-report.md. Reviewer owns cdc-verification.md; root owns ledgers,
cdc-retrospective.md and bubble-up. No row closes by doer attestation.

## Assignment history and readiness

Initial assignment cc-prompt.md was issued after source-readiness
review and root issue commit. Root inspected the cited source and tests;
separate Sol read-only consumed-role census confirms the producer boundaries.
All binding choices above are root decisions within the authorized S02 scope;
no new runtime/dispatch language feature is selected. Fresh source-readiness
review accepted the recipe before Luna source/build dispatch. Its one draft
HOLD identified omitted keyword alias keys and object spread in grouped
zero-name recognition. Root restored both existing-writer cases and added
runtime discriminators; separate Sol confirmed source-ready. No source edits,
probes or build ran during preparation. This was draft review, not an executed
CC correction or acceptance of implementation.

Latest initial candidate assignment was cc-prompt-iteration02.md, preserving all initial work
and constraints, the explicit tenth-path syntax repair and actual frontend
admission distinction. Separate Sol confirmed its complete amendment against
the actual whitelist/escape classifier before issue. No implementation
acceptance is claimed by either readiness review.

Previous correction assignment was cc-prompt-iteration03.md for independent R01–04. The
initial candidate and reviewer HOLD remain preserved; correction source scope
is classifier/forms.rs, native remaining_discard_bindings.rs and guide00 only.

Final accepted assignment is cc-prompt-iteration04.md for the static-key
representation and table-label findings, with the same three source paths.

| Prompt | Date | Predecessor | Purpose | State |
| --- | --- | --- | --- | --- |
| cc-prompt.md | 2026-11-13 | S01 accepted49982409 | Remaining native binding discards and explicit admission/signature dispositions | Executed in progress; superseded by refinement01 with all scope retained |
| cc-prompt-iteration01.md | 2026-11-13 | cc-prompt.md, initial work in progress | Preserve full scope; make admitted literal numeric keys valid JS and retain existing Bool/Null key roles | Executed in progress; superseded by refinement02 with full scope retained |
| cc-prompt-iteration02.md | 2026-11-13 | cc-prompt-iteration01.md, implementation in progress | Correct frontend admission assumptions; retain actual Source/raw-IR/unsupported-prefix distinction | Returned3617a3ae; independently held R01–04 |
| cc-prompt-iteration03.md | 2026-11-13 | Candidate3617a3ae and independent R01–04 HOLD | Correct docs/oracles and static-key role guard, preserving all9criteria | Returned28733980; pre-gate R02/R04 supported, R01/R03 held; malformed08ba message bytes retained |
| cc-prompt-iteration04.md | 2026-11-14 | Candidate28733980 and pre-gate R01/R03 HOLD | Encode new grouped static keys as literal data; finish Source/raw table | Accepted9e6fb127; full independent gates, clean source/build handback |

## Version history

- 2026-11-14 v1.5: Independently close the complete9-row native delivery at9e;
  preserve all four refinements/HOLDs/failures and reconcile BS-02, API audit and
  research owners without opening S03 or integrating release.

- 2026-11-14 v1.4: Retain2873pre-gate HOLD and corrected R02/R04; prepare
  classifier-local literal static-key representation and final raw-table fix,
  rather than continue punctuation blacklisting. Same3-path/9-row scope.

- 2026-11-13 v1.3: Retain independent3617HOLD and four consolidated findings;
  prepare three-path correction with actual IteratorValue control and static
  expression-key rejection, preserving full9-row contract and final gates.

- 2026-11-13 v1.2: Correct kernel-prefix admission assumptions surfaced by
  real callable/class fixture checks. Preserve namespace rejection and require
  distinct Source/raw API proof plus accurate immediate guide documentation.

- 2026-11-13 v1.1: Prepare narrow writer-syntax follow-through from ND-05
  grouped admission; preserve original9rows/scope, add one source path and real
  numeric/boolean/null key controls rather than accepting malformed output.

- 2026-11-13 v1.0: Prepare operator-authorized S02 from accepted49982409;
  preserve grammar/API roles and explicitly disposition both inherited limits.
