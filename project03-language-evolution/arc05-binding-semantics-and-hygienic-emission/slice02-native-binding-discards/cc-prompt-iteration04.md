# S02 correction04 — literal static keys and final table boundary

Issued2026-11-14 after separate Sol source-readiness approval. Same OpenAI gpt-6-luna/high CC,
separate gpt-6.1-sol/high CDC, Autonomous Mode. Continue all9ND criteria and
the complete original delivery. Predecessor cc-prompt-iteration03.md; preserve
all prompts, initial3617HOLD and corrected2873pre-gate HOLD/evidence.

Source is the same assigned contract-predicate-lowering worktree/branch,
clean28733980289e535f2b767aa5789b32d811ae97d9,
treed09837b225f66aa634a10069eec4de4e6a2231c7. Root owns design/planning Git/
index/status; source/build transfers to Luna on dispatch. No next-slice/release.

## Accepted corrections and remaining findings

Separate Sol confirms R02's IteratorResult.value getter/hole0 versus named2
control and R04's foreign99 versus argument7 raw-lambda control are meaningful.
Keep them unchanged. R03 remains: the pure Lykn pipe fixture compiled0, emitted
`const {|: private} = record`, then Deno rejected it. Excluding colon/dot does
not make every other Atom a valid unquoted JS PropertyName. R01 retains one
table mismatch: direct raw codegen supports `=`, whereas `assign` is Source
class-body syntax. Other reviewed corrections remain supported.

Only these THREE source paths may change:
- crates/lykn-lang/src/classifier/forms.rs
- crates/lykn-lang/tests/remaining_discard_bindings.rs
- docs/guides/00-lykn-surface-forms.md

## R03 — preserve static data by construction

Keep colon/dotted MEMBER-EXPRESSION Atom keys rejected in new zero-name group
admission. Do not add computed-key evaluation or another punctuation blacklist.
After the existing structural validation succeeds, represent STATIC Atom and
Keyword alias keys as String literal nodes using the existing to_js_identifier
normalizer. The String writer supplies correct escaping and syntax; Unicode
and punctuation do not need a new JavaScript identifier validator/dependency.

Apply ONLY to the newly admitted, structurally validated zero-name BindGroup
pattern, not arbitrary existing named patterns, single-Bind/raw APIs, schema,
source values or global naming. Existing valid emitted property names keep
their exact normalization: Atom some-name and Keyword :some-name mean someName;
String "some-name" remains exactly some-name. Number/Bool/Null retain their
existing nodes and the existing numeric spelling/range contract. No broad
property-grammar or number-formatting repair is authorized.

Recommended pure helper `literalize_discard_alias_keys(pattern: &SExpr) -> SExpr`
(name local discretion), invoked by parse_bind_group only after the empty-name
structural gate. Capture whether the pattern is newly admitted before rewriting;
do not normalize first and accidentally turn a rejected member expression into
static data. Bare `_` groups and already-admitted named patterns keep their
existing branch/representation.

Traverse only validated binding-pattern roles:
- array/object members recurse into actual binding targets;
- alias key index1: Atom/Keyword becomes normalized String with ORIGINAL span,
  existing String/Number/Bool/Null is cloned unchanged; recurse target index2;
  optional default index3 is an untouched expression;
- default wrapper recurses left binding target only, RHS stays untouched;
- rest/spread recurses its binding target only;
- ordinary binding atoms, computed/value expressions, defaults/RHS bodies,
  schema fields and property/data values are never walked as patterns.

Use intentional immutable AST reconstruction retaining node metadata and spans,
not a global rewrite or mutable active state. This is one linear pattern pass
on the new admission branch. No raw writer/emitter/codegen-name API changes.
The classified AST's static key representation change for this new feature is
explicit and belongs in Arc06 LI-04's later public API/IR audit.

## Meaningful proof

Use existing native test helpers and source file; all test code is ordinary
product testing. First preserve a pre-fix pipe regression with valid setup and
actual generated invalid JS. Reviewer `artifacts/cdc/pipe-static-key.lykn`
is reference evidence, never guessed
input or permission to rebuild history. Read the reviewer amendment and actual
source. No new exploration/matrix/harness.

Then actual grouped Atom `|` and corresponding Keyword/static String controls
must compile/run0 with foreign_=99, exact output and a live getter read once.
Inspect the classified new group key nodes as String literals. Add normalizer
controls for Atom/Keyword some-name→someName, literal String some-name unchanged,
and an ordinary Unicode static Atom; verify runtime property identity/effects
and finalized whole JSON. Keep colon/dot Atom and expression-key negatives;
literal String colon/dot stay positive. Demonstrate the preexisting named-pattern
branch retains its original key node/behavior and default RHS is not rewritten.
Preserve R02/R04, all prior ND proof, native/CLI modes and early diagnostics.

## R01 — complete the raw table

Move Source-only `(assign this:x value)` out of the table labelled direct raw
codegen IR, or replace that table row with raw `(= this:x value)` and preserve
the adjacent Source class-body example using assign. The text must identify
the two entrances accurately; no semantic change to either operation. Check
each remaining table row against the actual raw writer/Source notes rather than
adding another conflicting caveat. No unrelated documentation sweep.

## Intake, gates and return

Read full prompt04, current plan/ledger and appended2873pre-gate report; actual
parse_bind_group/structural helpers, normalizer, String/Keyword/alias writers,
affected tests and complete table passage. Retain unchanged prior manifests;
record readback/source before edits in artifacts/cc/index.md. Preserve failed
fixtures/commands/cwd/env/status/raw streams before running meaningful attempts.

Use the existing owned CC cache/temp/artifact homes and warm DENO_DIR. Focused
new/legacy native+CLI+JSON/static-member-key proof and fresh staging first.
Then run required successful make check with docs included and fresh absolute
precreated M6 hook; do not append duplicate docs or infer62/14 from outer tests.
Local failed gates get obvious in-scope repair and required rerun, preserving
attempts. Commit only the THREE correction paths with exact contiguous coauthor
trailers; check the literal message before committing. No amend/reset of any
reviewed candidate; preserve the08ba metadata attempt and repaired2873 history.
Run final-HEAD citations and fresh81920-byte size gate. No source edit afterward
without affected revalidation. No permission question for these authorized gates.

Return clean candidate/tree/no owned sessions, CC proposed-done, appended
closing-report/index accounting all9rows and every prompt. Root owns planning
commits/ledgers/retrospective; separate Sol reads corrected source/docs/oracles
before its own final successful full/M6/citation/size gates. No S03/merge/push/
release/publication/new dependency/licence/remote CI/experiment; NUMI stays open.

No Python execution/parity exception or Python/Ruby/Fennel/handwritten JS
research/helper/evidence/orchestration/command logic. New helpers use Lykn.
Ordinary Rust/JS product-test fixtures and direct native CLI/simple filesystem
lifecycle remain allowed. Preserve earlier failed/interrupted/unexecuted evidence.
