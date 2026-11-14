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
