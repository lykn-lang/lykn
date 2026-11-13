# Draft19 native discard export — independent source readiness

Sol6.1High,2026-11-13. Read full unissued cc-prompt-iteration19.md against
immutable57c76c99cbed07ff992e78aac8afefa4bdf0b2ad,
treef044d795e88c3dac8e84a73a557cf071edd5327c and retained18 source readiness.
Luna owns dirty authorized18 source/build; no reviewer source/build/test/Git/
index/ledger mutation. Root owns design and final issue. This is source
readiness, not actual export/runtime/discard acceptance.

**Core export recipe coherent; source projector consumption gap needs final
root disposition below.** Root has already allowed binding.rs as a seventh
path for a shared correction, not an export-only duplicated walker.

## Confirmed exact emitter/writer boundary

- Baseline forms.rs534–549 wraps EVERY inner emitted statement in export and
  appends raw extra_args. Direct Bind/Group discard storage would become public;
  typed guards become invalid export-if. Root's ordinary sibling declarations/
  checks followed by one emit_exports fixes that concrete path without moving
  initializers, dropping guards or adding evaluation. Collect source names
  BEFORE prepared private lowering, retaining BindingSite names/spans/order.
- emit_exports2897–2901 constructs `(export (names ...))`; writer
  emit_export1667–1672 consumes names and emit_export_names1707–1730 writes
  braces even when empty. Empty source name list therefore emits `export {};`
  and introduces no public private-storage binding. Standard names form gives
  live exports, not copied runtime values. JSON keeps ordinary names-list shape.
- classifier/forms.rs1066 onward only creates SurfaceForm::Export for direct
  recursively classified first list. Default/remote/raw wrappers stay Kernel
  passthrough; direct async(Bind) is a different inner kind. Limiting new branch
  to direct Bind/BindGroup preserves these existing grammar boundaries.
  Current export-declaration writer1664–1678 consumes ONLY args0: extra_args
  are ignored there. New branch must ignore them, not execute/lower them into
  siblings or append them to the source export-name list. Direct default
  payloads and all unrelated wrappers retain their earlier distinction.
- Projector aliases use actual local child2 for BindingPattern; property/key
  child1 stays data. Raw `_` is excluded, _value retained. Source spelling is
  preserved in BindingSite and normalized only by existing writer. Pair-order
  collection is distinct from sorted ESM namespace key observation; effect
  traces must prove initializer order. No new ordinary-name hygiene is implied.

## Exact projector mismatch requiring resolution

binding_names_in_pattern944–948 delegates to pattern_occurrences with
PatternGrammar::BindingPattern. For each array/object member1118–1197 it
handles rest/default/alias/array/object, but NOT spread. Writer object pattern
430–435 emits spread operand using emit_expr; array pattern falls through
emit_pattern→emit_expr→emit_spread for spread, so BOTH support simple rest:
`(object (spread remaining))`→`{ ...remaining }` and
`(array (spread remaining))`→`[...remaining]`. A new export collector using the
uncorrected projector drops actual source remaining and produces export{}.

Root and reviewer agree on narrow BindingPattern-only child1 spread handling,
TypedParameter unchanged. Underfilled `(default x)` is another consumed-slot
mismatch: projector currently collects x but writer default needs marker/name/
RHS (len>=3) and emits no x otherwise. BindingPattern default needs that minimum
before projecting. Alias needs marker/key/local len>=3 and current get(local)
already enforces it; rest needs target len>=2 and get(target) already enforces
it. No new syntax rejection or malformed-input acceptance is proposed.

There IS an extra context boundary for NON-ATOM spread operands: rest uses
emit_pattern whereas spread uses emit_expr. Example
`(array (spread (object (source named))))` emits valid binding
`[...{ source: named }]`. Recursing with ordinary BindingPattern treats object
member `(source named)` as unknown and misses named. Nested spread array `_`
also follows expression writer (real Identifier), not array-pattern hole. This
cannot be called full consumed projector parity based on simple atom tests.
Root must explicitly settle expression-rendered pattern support/extent or name
the retained nested-spread limitation before issue; no competing architecture
is selected here. This source-only counterexample was sent to root. No runtime
or new malformed grammar behavior is preclaimed.

## Actual shared clients and verification obligations

Whole immutable source query: direct helper callers analysis/mod.rs271;
classifier/forms.rs1359 (group admission),1435 (duplicates); expander/pass2.rs261
(group visibility); resolver.rs754/1117 (actual grouped declarations); binding
walk_bind_group685 (following default/initializer scope). PatternGrammar's
internal clients include bind_names898, kernel_param_names859 onward,
loop_names953, kernel_decl_names966, catch_names990 and default walkers363/
381/398/681. bindings_introduced779 and binding_occurrences787 feed broader
D1/D2/enclosing-declaration consumers. Thus a shared projection correction
needs full binding/resolver/validation and inherited18 regression gates, not
only export namespace tests. Current catch writer grammar remains its separate
retained limitation; changing shared helper must not claim catch migration.

Actual runtime oracles remain root's19+18: exact namespace excludes _/private
names, named aliases and _value values retained, scalar all-discard repeated
initializer effects/checks, ordinary named typed export checks+stripped effects,
JSON round-trip same module, unchanged function/default/type routes. Invalid
export-if must not be confused with a real TypeError; assert runtime/import
status, source `_` and actual got-type. DTS source-based behavior remains named
follow-through, not accepted by runtime module proof. All broader public/raw/
owner/LC02–08/S03 limits persist. No full gate/commit is authorized by this
readiness note; root may issue only after its source disposition.

## Root's bounded writer-consistency decision — follow-up source review

Root explicitly chooses a0.6 pattern consistency repair, not an expression-
pattern interpreter: emit_pattern's spread dispatch and emit_object_pattern's
spread arm delegate to emit_rest_pattern→emit_pattern. Value emit_spread and
value emit_array/emit_object remain unchanged. Source-reviewed route is coherent
and resolves the nested spread mismatch for canonical pattern grammar:
`(array (spread (object (alias source named))))` now consistently emits the
binding `[...{source:named}]`; the earlier accidental expression-object tuple
`(object (source named))` is historical source output, not newly promised
canonical grammar. This intentional source/kernel change needs its migration/
API/docs/public parity limits, not an assertion no behavior changed.

Actual emit_pattern callers at immutable57: declaration478; params685;
for-clause805; for-of/in/await-of846/862/878; ASSIGNMENT LHS1059; recursive
object/array/default/rest/alias417/434/437/460/1354/1365/1376. Thus assignment
pattern behavior is intentionally affected, not a definition-only change.
Bare scalar assignment `_` remains an ordinary target on its existing path;
new Surface discard storage is not global underscore rewriting. Pattern nested
spread→array holes now follows canonical elisions/trailing-comma behavior;
source/default/key roles remain separate. Tests need valid assignment context,
not an unrelated existing object-assignment statement parsing limitation.

Whole immutable corpus search over crates/test/packages/docs/examples for
object/array spread and nested object/array spread found chiefly VALUE-spread
examples/tests: emitter Conj/Assoc3076/3090, value writer tests2312–2322,
spread.test.js, lazy live-entry fixture and guides01/02/04/08/09. These are
preservation inputs and should remain byte/behavior unchanged. One direct
native protected_host.rs1491 raw callable `(function f ((object (spread Reflect)))
...)` is a pattern client; inherited binding/host regression gates matter.
No nested expression-object spread pattern match was found by that query;
this is a bounded text census, not evidence no external raw API consumer exists.
Public/native parity/API/docs remain named follow-through as root directed.

BindingPattern-only spread recursion and underfilled-default guard match
canonical pattern rendering; TypedParameter grammar stays unchanged. However
**catch must be excluded from that canonical projection change or precisely
separately dispositioned**, because catch_names990 currently passes the SAME
BindingPattern enum while its writer still calls emit_expr. This includes a
concrete NEW default regression risk, not only an old missed spread case:
`(catch (object (default array)) ...)` writer emits valid catch({default:array}).
Current projector sees child1 array as binder, matching that actual output;
new unconditional default len>=3 guard would drop it, so a caught callable
named array could redispatch as kernel in its body. Root has explicitly kept
legacy catch grammar, so the corrected shared projector needs an explicit
canonical-pattern versus legacy-catch role boundary. The implementation method
is root's decision; no new catch writer/grammar is required to preserve it.
The unchanged expression spread path also keeps the earlier nested legacy
catch tuple observation distinct from canonical binding/assignment patterns.

Reported this exact catch risk to root before issue. No source/build/tests/
mutation or runtime claim. Once root's revised19 records canonical writer
scope plus preserved catch projection extent, no other concrete contradiction
was found in this route, empty exports, ignored extras or source-name collector.

## Final revised draft19 review — source-ready

Read the COMPLETE revised draft19 after root recorded its exact preservation
choice. **Source-ready; no remaining material contradiction found.** This is
readiness only, not issue/software acceptance. Luna retains in-progress source/
build ownership; reviewer ran no builds/tests and made no source/Git/index/
ledger mutation. Root owns the final issue and seventh-path authorization.

The revised recipe resolves the shared-client regression explicitly: ONLY the
NEW canonical spread/default-extent projection rules exclude existing
BindingKind::CatchBinding, preserving that role's old projection without a new
public mode/global flag. TypedParameter also remains unchanged. Thus legacy
catch({default:array}) callable lookup is retained, while canonical declaration/
parameter/loop sites match the intentionally unified pattern writer. The
separate catch writer/semantic/discard repair is still open, not inferred fixed.

Pattern-context spread delegates to existing rest→pattern in both required
doors; value spread, value arrays/objects and catch expression rendering stay
unchanged. Assignment LHS intentionally shares the pattern repair and receives
explicit tests. Old accidental expression-object tuple grammar in pattern
position gets the exact typed Codegen migration error at its member span plus
alias suggestion; canonical `(object (alias source named))` is the replacement.
The diagnostic is confined to unknown LIST members of emit_object_pattern,
not emit_pattern's generic expression/member-target fallback. Consequently
ordinary array/member assignment targets can keep their actual existing path.

Underfilled recognized default/alias/rest/spread consumption remains unchanged;
no broad malformed-input policy is introduced. The underfilled-default export
positive should use a writer-valid shape (e.g. lone ignored default member):
existing object separators can make other malformed combinations invalid JS,
so do not claim the new guard validates all malformed patterns. Codegen-only
migration timing is explicit: emit_json/check earlier boundaries are not newly
promised to reject. Reconstructed container/member spans must preserve source
span needed by the exact migration-error test; no source-span claim follows
from only checking its message.

Revised tests explicitly cover canonical nested aliases/rest exports, legacy
catch lookup/raw expression-object catch, actual assignments, unchanged value
spread, old migration diagnostics, projector reserved/duplicate/lexical clients
and all inherited18 controls. Direct Surface Bind/Group export collection still
uses original source names/spans/pair order, normal sibling declarations/checks
then existing names export (including empty export{}); extra_args/default/raw/
async wrappers remain on their original consumed routes. Exact7paths and one
combined18+19 full gate, cold55/14, final citations/size and preserved failed
attempts are specified. No new source-name/owner/API/DTS/public parity or full
operator-discard/S03 closure is implied by this bounded readiness.
