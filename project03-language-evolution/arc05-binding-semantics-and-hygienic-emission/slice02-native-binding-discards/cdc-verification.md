# S02 independent CDC verification

## Initial candidate verdict — HOLD

Independent reviewer OpenAI gpt-6.1-sol/high, context `/root/arc05_s02_cdc`,
reviewed Luna6 High's candidate `3617a3aecf69cd4f6a39cd9ebb68e09cdc5c15e9`,
tree `cf3b823daa93a588597147121f8dd273637978ce`, on
`codex/qualified-adt-core` in the assigned source worktree
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Comparison baseline is accepted S01 `4998240927909c3abc0172dfef2b56076b19f708`.
This report does not close ledger rows, accept the arc/release, or implement a
production repair. Source/build ownership was exclusive during this review;
root retained architecture and planning Git/index/ledger/status.

The initial candidate is held for the findings below. Fresh focused checks and
the bounded supplemental consumer passed; they do not erase source or oracle
defects. The final full/M6/citation/size gates remain required on the corrected
candidate. Root requested that the known-held candidate not receive further
final gates.

## Consolidated findings

**R01, P2 — The immediate Source guide still teaches incompatible frontdoors.**
At this source pin, `docs/guides/00-lykn-surface-forms.md:1319` says any kernel
form can be used directly in surface code unchanged. The new paragraph at1326
says its lambda row documents both Source and literal raw IR, but the row at1335
contains only untyped raw `(lambda (a) (return a))`. Function/function* rows
likewise use unprefixed raw declaration spellings. Normal strict `.lykn` rejects
those bare declarations; lambda uses typed Source grammar, and `kernel:lambda`,
`kernel:class`, `kernel:class-expr` are absent from `KERNEL_FORMS`. ND-07 and
refinement02 require a useful, accurate user guide. Repair the surrounding
namespace explanation and label or rewrite table examples by actual entrance;
retain the raw API boundary without presenting raw IR as Source syntax.

**R02, P2 — The new raw-loop hole oracle cannot detect IteratorValue reads.**
`tests/remaining_discard_bindings.rs:246` puts `holeReads` on index0 of an array
stored as the first value in the row. The loop pattern skips the first row
value; even an incorrect named binding would read that array object without
accessing its own index0. Thus the asserted zero would survive the rejected
behavior. Observe the getter on the actual iterator result's `value` and pair
it with a non-hole named control proving that the getter is live. Preserve the
existing independent early-close counter. Supplement02 below confirms current
production behavior with the correct observation point; the product regression
still needs repair.

**R03, P2 — New zero-name admission mistakes member expressions for static keys.**
`classifier/forms.rs:1452–1467` accepts every Atom alias key. The alias writer
at `codegen/emit.rs:1382` calls `emit_expr`, and `codegen/names.rs:254–257`
emits colon atoms through `emit_member_chain`. Consequently the newly admitted
grouped pattern `(object (alias owner:key _))` reaches a key spelling such as
`owner.key: private`, which is not a static JavaScript PropertyName. This is a
source-derived finding, not an executed runtime observation. The new structural
guard promises writer-valid static keys and does not authorize computed key
expressions. Restrict new zero-name admission to genuinely static supported key
spellings, with a member-expression negative and ordinary static-key positives;
do not revalidate unrelated already-admitted named patterns or add key grammar.

**R04, P2 — The raw lambda runtime control conflates argument and foreign value.**
`tests/remaining_discard_bindings.rs:143–159` supplies argument7 and sets
global `_` to7. It therefore returns7 both for intended literal binding and for
the rejected discard interpretation. Use distinct values, such as foreign99
and supplied7, while retaining expected7. The literal writer source and raw
arrow/class controls support the intended boundary, but this lambda-specific
oracle does not independently establish it.

## Assignment and read coverage

Read complete current S02 plan v1.2, nine-row ledger, original prompt and both
preserved refinements, CC closing report and all85 lines of the CC index;
the CC index's three subsequent factual wording fixes were included. Original
kernel-lambda/class routing assumptions are explicitly superseded by
refinement02, not silently treated as supported. Read the entire ten-path diff
and both new test files (659 native lines and156 CLI lines), plus actual kernel,
class/catch/pattern/number/alias writers, producer-local lowering, parameter
projection/default paths, finalizer and validation dependencies. Read the full
S01 independent record to establish the accepted unchanged public baseline.
Source AGENTS/Lykn skill and installed collaboration-framework, prompt authoring,
Rust AP-09/AP-12 and testing guidance informed the review. Initial combined
outputs clipped; the original/refinement prompts, CC index, affected source and
S01 record were recovered with bounded separate reads before disposition.

The complete diff is retained as `artifacts/cdc/reviewed-ten-path.diff` and
commit metadata as `source-commit.txt`. Exactly the ten allowed paths changed;
dispatch, JS/embedded mirrors and dependency/config inputs did not. Source was
clean at intake and handback; both contiguous co-author trailers were checked.

Source inspection supports producer-local preparation rather than a whole-result
rewrite: raw declaration/loop/callable slots enter `lower_kernel_discard_roles`,
class method parameter elements enter the existing class emitter, and generated
schema functions are not fed back through those producers. Catch preparation
mirrors the actual expression writer and only changes the selected last catch.
Default RHS/computed keys remain value expressions. Existing CompletionValueId
and finalizers retain identity and reservation. The shared multi diagnostic
finds any top-level Simple default/rest for more than one clause, including a
destructured neighbor, and the direct-AST emitter records an existing fatal
diagnostic. No namespace addition or general number formatting change occurred.

## Fresh observations at the initial candidate

All execution used source cwd above, warm
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`, and owned
`XDG_CACHE_HOME=/private/tmp/lykn-arc05-s02-cdc/xdg`,
`NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s02-cdc/npm`,
`TMPDIR=/private/tmp/lykn-arc05-s02-cdc/tmp`.

- `make fresh-artifacts`: exit0, before staged-import consumers.
- `cargo test -p lykn-lang --test remaining_discard_bindings --test discard_bindings -- --nocapture`:
  exit0, new21 and existing23 passed; session86470 completed0.
- `cargo test -p lykn-cli --test remaining_discard_bindings --test variadic_for_bodies -- --nocapture`:
  exit0, new2 and existing2 passed; session65071 completed0. Actual Source/.lyk
  check, checked/strip compilation and ESM runtime are visible in the logs.
- Pure Lykn `supplement02.lykn` compiled with the freshly staged release CLI,
  then executed by `deno run --config project.json`: compile0/runtime0, empty
  stderr and exact expected stdout verified by `diff -u`. It observes the
  actual iterator result `value` getter: hole2steps/1read/1close, named2/2/1,
  catch2/2/1; object alias/spread getters1/1; raw argument effects1,7 once,
  `_value`7, arity2, reserved candidate colon lookup41; generator argument
  evaluation occurs before its body advances. All setup and consumer logic is
  Lykn, with no research JS/Rust harness.

The independent `make check` had already begun when root's hold instruction
arrived. It used the same environment and precreated absolute M6 directory
`artifacts/cdc/m6-evidence`. Build/lint/workspace Rust stages passed, including
lang lib1205 and affected integration/host/private tests. It was interrupted
during corpus compilation, before completion of product/docs. Session1768 was
terminated with Ctrl-C and returned130; stdout/stderr retain the actual ending
(`make: *** [test-suite] Interrupt: 2`). This is not a successful full check.
An exact `pgrep` lookup failed because host sysmond was unavailable; no process
was killed by PID or broad process census. No owned session remains active.

`supplement-runtime.NOT-RUN.mjs` and
`supplement-authoring01.NOT-RUN.lykn` retain the unexecuted first authoring
attempt. The JS setup was not executed; after root clarified the helper policy,
the actual specimen was authored wholly in Lykn. No failed source snapshot was
reconstructed or deleted. All source commands are direct repository/native
invocations; the raw triplets and tool session outcomes remain distinct.

## Retained evidence and limits

Existing Source discard, schema and fragment/private behavior is retained only
after examining applicability: the typed callable/schema producers and private
finalizers are unchanged; new lowering is wired at raw source consumers rather
than applied globally. Fresh existing23 discard tests reexecute type checks,
lazy/default/rest/fixed nested multi behavior, schema `_`, export/effect,
private-candidate reservation and fragment failure/reuse. Thus these are fresh
native checks, not borrowed CC attestations. The old independent S01 public
acceptance remains baseline evidence because no JS/embedded implementation
changed; S02 does not broaden its public acceptance.

CC's successful full gate and M6 are corroborating reviewed receipts, not fresh
CDC gates: the actual standalone and strict public statuses are0, strict public
output62/0, and all14 canonical/embedded/materialized comparisons are true.
The captured strict config maps lang to materialized embedded bytes and browser
to staged browser output. CC's earlier make-check-final exit2 stopped at clippy;
make-check-postfix exit0 is a distinct attempt. The actual CC corpus output says
`(skipped — jsr.io not reachable)`; that network end-to-end fixture was not
verified. CC docs482/0 include15 entries with no Lykn blocks, not15 skipped
executables. CC citations64/601 and gzip47747/81920, baseline27630, remain CC
receipts pending independent final-candidate runs. Size measurement used warm
cache plus existing esbuild downloads and astring package-condition warnings;
no entirely-offline claim is made. Existing number-range limitation
D-2611-NUMI remains outside this bounded alias syntax correction.

## Nine-row disposition at HOLD

| Row | Current independent disposition |
| --- | --- |
| ND-01 | Production observations supported; HOLD R02 until meaningful product hole/non-hole oracle lands. |
| ND-02 | Fresh callable/class controls and supplemental `_value`/length/order/advance pass; raw lambda oracle R04 held. |
| ND-03 | Fresh legacy catch8, pair/computed/default/rest/direct-return/selected-last controls pass; supplement proves catch IteratorValue consumption. |
| ND-04 | Source identity/reservation/projection separation inspected; fresh native/schema/fragment/private and supplemental colon candidate controls support it. Final delivery gate pending. |
| ND-05 | Numeric/literal/grouped effects and malformed-structure controls pass; HOLD R03 static-key guard. |
| ND-06 | Classify/direct-AST and actual CLI negatives pass; shared source predicate covers any top-level Simple parameter. No default/variadic dispatch acceptance. |
| ND-07 | Actual entrances and raw boundaries inspected/executed; HOLD R01 guide and R04 lambda oracle. |
| ND-08 | Focused checks pass; final independent full/M6/citations/size pending corrected source. Interrupted gate is explicitly unaccepted. |
| ND-09 | Consolidated independent HOLD and preserved evidence supplied; root correction/retrospective/bubble-up and eventual independent close remain pending. |

## Handback and bubble-up

Source remains clean at3617a3ae/treecf3b823d; reviewer made no production edit,
Git/index or ledger mutation. All invoked sessions completed or returned130
as recorded. Source/build returns to root for the bounded correction assignment.
The correction should preserve all ten-path/nine-row scope, actual namespace
negatives and history. Final fresh full/M6/citations/size verification waits for
the corrected candidate. No S03, merge, push, release, library/book/human or
whole-arc acceptance follows from these observations.

## Correction03 pre-gate review — 2026-11-14

Reviewed clean correction commit `28733980289e535f2b767aa5789b32d811ae97d9`,
tree `d09837b225f66aa634a10069eec4de4e6a2231c7`, parent3617a3ae. Read the entire
three-path delta, affected current definitions and CC's appended correction
readback/closing sections. The malformed first co-author attempt08ba3743 is
retained by CC as the original commit object; current correction metadata is
reported separately and does not rewrite the initial candidate's history.

**Verdict remains HOLD before final gates.** R02 is now addressed at source
level: each fresh row iterable's first actual IteratorResult has the observed
value getter, the discard arm expects0 reads and the named arm2, with independent
outer next1/return1 retained. R04 now distinguishes foreign99 from argument7
and asserts literal raw parameter/body spelling. These fixes are inspectable
and discriminating; no full or focused gate was run by this reviewer at this
pre-gate handoff.

R01's namespace prose and lambda distinction are corrected, but the table now
explicitly promises direct raw `codegen::emit_module_js` IR while its final row
still says `(assign this:x value)` writes assignment. `codegen/emit.rs:250–348`
has no `assign` dispatch: raw assignment is `=`, and unknown `assign` emits a
function call. The Source-only class-body teaching belongs separately from the
raw table, or that row must use actual raw `=`. Retain the useful adjacent
Source class example.

R03's colon/dot exclusions are implemented, but the finite pipe Atom remains
admitted and generates malformed JS. Actual source: the static-key predicate
only excludes colon/dot; `PUNCTUATION_TABLE` has no pipe; the normalizer's regular
character branch preserves pipe; alias emission writes it bare. The authorized
single bounded Lykn fixture `artifacts/cdc/pipe-static-key.lykn` was preserved
before execution. Using CC's staged release CLI, compilation exited0 with empty
stderr and generated `const {|: completionValue__gensym0} = record;`; executing
that actual module with Deno exited1 with `Unexpected token |` at that exact
generated declaration. This is an observed finite product failure, distinct
from the earlier source-only member-key finding. No compiler rebuild or broad
key/reader investigation was performed; fresh final gates remain pending.

Root's proposed representation repair matches the existing static role: in
newly admitted zero-name grouped patterns only, normalize admitted Atom and
Keyword alias keys through existing `to_js_identifier` into owned String nodes
with original spans, then use the existing String writer. Recurse only through
binding targets and preserve default RHSs and values. Keep member-expression
Atom rejection, literal String spelling, numeric/Bool/Null handling, already
admitted named-pattern behavior and raw codegen unchanged. This avoids extending
a character blacklist or changing the general identifier/Unicode policy. It
requires a reviewed correction assignment; no implementation was made here.

Finite-case receipts: `pipe-static-key-compile.*`, `pipe-static-key-runtime.*`,
the preserved input and `pipe-static-key.generated.mjs`. All commands used the
same source cwd/warm Deno/owned CDC cache environment listed above. No tool
session remains running. Source/build returns clean to root for the consolidated
static-role and remaining table-label correction; final gates were not started.

## Final correction04 verdict — ACCEPT — 2026-11-14

**Accept the complete S02 source delivery at
`9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree
`6d64692fde0c367e73deeda1ec1aca19e49d6b93`.** All substantive R01–04 findings
are resolved. This is the same independently selected OpenAI gpt-6.1-sol/high
CDC context; Luna6 High remained the separate implementer. The initial3617
HOLD,2873 pre-gate HOLD, failed pipe condition, interrupted130 attempt and
unexecuted authoring specimens above remain unchanged history. Root still owns
retrospective, status/ledger close and bubble-up adoption. Source acceptance does
not close the arc/project/release or authorize S03/integration/publication.

### Final source inspection before gates

Read complete issued prompt04/current plan v1.4/nine-row ledger and appended CC
correction04 index/closing sections, the complete2873→9e three-path diff and
necessary whole S02 producer/writer/normalizer/finalizer source already mapped
above. The final delivery still changes exactly the ten allowed paths relative
to49982409. There is no dispatch, JS/embedded, dependency or configuration edit.
Final source/doc/oracle readiness was reached before staging/focused/full gates.

The new classifier branch records the empty binding-name condition before
validation and literalizes only a newly admitted zero-name pattern after its
structural check succeeds. Bare `_` and already-admitted named patterns retain
their representations. Atom/Keyword alias keys become String literals via the
existing normalizer with their original spans. Nested object/array targets,
default-left and rest/spread targets recurse; default RHS and optional alias
defaults remain cloned expressions. No global/Source value, schema or raw API
walk was added. Tests inspect the actual classified key nodes/spans, unchanged
default RHS and original named-branch Atom; runtime/JSON proves normalized
property identity and getter/default effects. This solves the pipe syntax
failure by representing static data, not by widening a punctuation blacklist.
Colon/dot member-Atom negatives still run before normalization.

R01 now has coherent strict Source versus direct raw IR prose and an actual raw
`=` assignment row. The adjacent Source class example still uses `assign`.
Typed Source lambda, literal raw lambda, and rejected kernel:lambda/class/
class-expr remain distinct. R02's permanent iterator result getter and fresh
non-hole control distinguish0 from2 reads while retaining outer early close.
R04 now supplies7 against foreign99 and asserts literal raw lambda spelling.

### Fresh independently reproduced final-source evidence

Exact commands/environment, source conditions, numeric statuses, raw streams,
session outcomes and artifact inventory are in
[artifacts/cdc/final04-commands.md](artifacts/cdc/final04-commands.md). All
following observations are fresh at9e6fb127; no source edit occurred afterward.

1. `make fresh-artifacts`0 preceded staged consumers.
2. Focused native0:24 new remaining-discard tests and23 existing discard tests.
   Focused CLI0:2 new tests and2 existing variadic-for tests. These execute real
   checked/strip Source/.lyk compilation, ESM, diagnostics and finalized JSON.
3. Pure Lykn static pipe roles compile0/runtime0, exact stdout `99 3` newline,
   empty stderr: actual grouped Atom/Keyword/String keys each read the same
   live getter once. This supplements the permanent24 tests' AST/normalization/
   Unicode/default/JSON controls without adding a research harness.
4. Both balanced member-key fixtures independently fail actual CLI check,
   checked compile and strip compile: six statuses1, intended early group
   diagnostic at1:7, empty stdout and no JS output. These do not rely on a
   later syntax error.
5. One successful final `make check`0, docs included once: build/lint/format and
   workspace Rust tests passed, including lykn-lang lib1205; full product1570
   passed/67steps/0failed; docs482passed/0failed,22 generated files. Fifteen
   entries have no Lykn blocks; they are not fifteen skipped executable tests.
6. Fresh inner M6 under separate precreated `m6-final04`: standalone embedded
   delivery0; strict mapped public62passed/0failed; all14 canonical/embedded/
   materialized comparisons true. Actual child command/config/status/output
   and each comparison were inspected, not inferred from outer success. The
   lang mapping uses materialized embedded bytes; browser uses staged output.
7. Final-HEAD cited paths0:64 documents and601 historical citations. Fresh
   bundle gate0:47747 gzip bytes below81920, baseline27630, delta+20117.

### Fresh versus retained proof and limits

The final native/CLI/full/M6 sets supersede doer attestation and earlier focused
counts for final-source verification. Fresh legacy23 retains type-check errors,
schema `_` field7, lazy defaults, typed rest, fixed/nested multi dispatch,
export/effect and fragment failure/reuse coverage. Full workspace Rust provides
affected binding/default projection, emission/private/host regressions. Final
native24 includes the corrected permanent loop/lambda oracles and source/raw
boundaries; tests are not accepted merely for being green.

Retain the independently reproduced supplement02 observation at3617 only after
applicability review: its raw call arity/order/_value, generator timing,
iterator/catch and candidate-colon paths are unchanged. Its one newly admitted
object alias key `:value` now becomes String `value`, the exact same property
identity. The new permanent JSON/key and three-role pipe consumer prove that
representation boundary at final source; no helper/control-flow/fixture input
changed. Thus supplement02's exact protocol/effect observations remain useful
independent proof at their original pin, not a claim they were rerun at9e.
S01's public acceptance remains baseline evidence because no public/mirror
implementation changed, with fresh final M6 and full product corroboration.

The actual full output still says `(skipped — jsr.io not reachable)` for the
JSR end-to-end fixture. It self-reports ok under its existing skip handling;
network publication/end-to-end success is not claimed. Warm DENO_DIR, fresh
owned M6 XDG and existing cached-only child options are explicit. Size checking
fetched existing esbuild registry data and emitted four astring package-condition
ordering warnings, while returning0. This was not entirely offline. No new
dependency/permission bypass or number-range experiment occurred. NUMI and all
downstream library/book/human/general naming obligations retain their owners.

### All nine ND dispositions

| Row | Final independent disposition | Evidence and limit |
| --- | --- | --- |
| ND-01 | Accept; reproduced and source-reconciled. | Final declarations/numeric-for initializer/for-in/of/await-of, new live hole0/named2 oracle and outer next1/return1, legacy protocol controls. Numeric-for test proves discard initializer plus immediate-break termination, not a new counter facility. |
| ND-02 | Accept; reproduced plus applicable independent supplement. | Actual admitted callable/generator/async/object/class families, `_value`/arity/order/advance supplement, default/rest/spread positives; typed Source lambda and raw literal lambda7 against foreign99 are separate. |
| ND-03 | Accept; reproduced plus applicable protocol supplement. | Legacy catch8, default/pair/computed/shorthand/rest/subwriter roles and selected-last/finally/direct-return behavior; supplement distinguishes catch value2 from declaration-hole value1. No catch grammar feature added. |
| ND-04 | Accept; fresh and source-reconciled. | Shared spread projection/default-path tests, named/form-body resolution, final JSON, legacy schema/fragment/private/host and candidate-colon proof; finalizers unchanged and producer preparation remains local. |
| ND-05 | Accept; R03 resolved, freshly reproduced. | Valid structural empty/nested/default/rest/grouped literals, reject malformed/member expressions, normalized static key AST/spans and Unicode/normalizer/unchanged String/default/named controls, real getter/default effects and JSON. Numeric formatting range remains existing bounded behavior. |
| ND-06 | Accept; reproduced and predicate inspected. | Classify and direct-AST default/rest errors, actual CLI check/checked/strip negatives, mixed clause coverage; shared predicate examines every top-level Simple param. Single/nested/fixed cases stay supported; no new variadic selection semantics. |
| ND-07 | Accept; R01/R04 resolved and actual entrances proved. | Correct Source/raw table and API docs, native Source/.lyk/escape CLI runtime, strict member diagnostics, unsupported kernel lambda/class/class-expr negatives, literal raw/schema controls. |
| ND-08 | Accept; fresh final-source gates. | Focused24+23/2+2, successful full/lib1205/product1570/67/docs482, actual M662/14, final64/601 citations and47747/81920 gzip. All raw skip/cache/warning limits retained. |
| ND-09 | Reviewer requirements satisfied; root closing duties pending. | Independent9-row acceptance, source/history/oracle findings resolved, original candidates/attempts retained, clean/no-jobs handback. Root owns retrospective/ledger/status close and bubble-up; no wider acceptance inferred. |

### Final artifact and ownership handback

Final evidence stems are `final04-*`, six `colon-*`/`dotted-*` CLI triplets and
`m6-final04/`, indexed in the command record. Source pin/status/commit and exact
delivery diff are retained separately from initial candidate snapshots. The
original malformed08ba commit object independently hashes to
`08ba3743440aaccdbfd1a999ca47fe296a92c720`; current correction commits have valid
contiguous trailers, without rewriting that failed metadata history.

Source9e6fb127/tree6d64692f is clean. All final sessions completed naturally0;
earlier session1768 remains the explicitly interrupted130 attempt. No production
edit, source/planning Git/index or ledger mutation was made by this reviewer.
Source/build ownership returns to root. The useful delivery is accepted on the
task branch; release remains0829e892. Root may finish the authorized S02 closing
metadata and retrospective, with BS-03 onward, S09 design re-entry, Arc06 LI-04
classified-IR/API audit and other existing owners retained.

## Closing metadata review — PASS — 2026-11-14

The same independent Sol6.1 High reviewer inspected the current tracked closing
diff, full root retrospective and final04 command/evidence index. Recovered
clipped combined output through bounded file-group reads before this verdict.
All nine ND rows close with the accepted9e6fb127 evidence; BS-02 closure is
supported. Root's retrospective, downstream routing and status reconciliation
now fulfill ND-09's remaining closing duties. Earlier cutoff/HOLD text above
retains its historical meaning.

Ledger cardinalities remain S02 nine, Arc05 nine, retired Arc04 S03 fifteen
criteria (excluding the header), and Arc06 six. The original fifteen S03 rows
are untouched; its diff only adds a dated subsequent checkpoint. BS-03–09,
LI-01–06, P-BIND/P-QADT and broader composition remain open. Arc06 LI-04 retains
the new classified-key representation, numeric spelling, signature diagnostic
and Source/raw-IR/API/guide impacts; Project07 routing retains research/reader/
library/book/human/licence gates. No S03 or integration authority is inferred.

Live read-only Git checks confirm clean source9e6fb127/tree6d64692f and release
0829e892999890e8877dec5e35cd249753e1be5d unchanged. The closing report correctly
leaves the eventual planning closing-packet hash to the commit rather than
inventing it; this is not a missing source receipt. No material metadata finding
remains. This follow-up changed only this reviewer record, ran no runtime gate
and made no Git/index/ledger mutation. Source/build remains with root.
