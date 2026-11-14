---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice01-public-source-discards
status: active
version: "1.0"
depends-on: [accepted-native-discards-759567f9, held-public-candidate-dba24d40]
---

# Public Source discard completion

## Authority, source and endpoint

2026-11-13 operator: “open Arc05 S01 and finish public Source discards”, Luna6
High CC, Sol6.1 High CDC, usual Autonomous Mode. Resume IMPLEMENTATION of this
slice only; finish implementation, independent verification, closing report
and retrospective, then report. S02/later slices remain roadmap only.

Use fresh OpenAI gpt-6-luna/high implementation and separate gpt-6.1-sol/high
independent review contexts. Root owns architecture/planning Git/index/ledger;
one source/build owner at a time, with explicit clean handoffs. Source is the
existing `.worktrees/contract-predicate-lowering`, branch codex/qualified-adt-core,
clean dba24d4063f34551c30590c884a495c8ca57298f,
tree0ad99ea5838a463ee8aa680005fae472a0b8135c. Planning is this existing orphan
worktree. Release stays0829e892. No new worktree, merge/push/release/publication,
remote CI, dependency adoption, licence action or emission experiment.

## Useful result and inherited scope

Finish the complete public Source discard contract in the already-implemented
candidate and resolve its R01 software HOLD. `_` introduces no Source binding;
`_value` remains ordinary. Evaluation, defaults, destructuring and declared
checks survive; compiler-private values cannot capture source variables/macros.
This covers parsed Func/Fn/Lambda/Genfunc/Genfn and normal Bind/BindGroup, actual
Source-only exports, current pattern/JSON/fragment/browser/materialized routes.

The [ledger](ledger.md) restates the full acceptance surface. The existing
[bounded public recipe](../../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/b2-public-discard-recipe.md)
is the implementation-preservation contract; it does not license redoing its
five-module implementation. The original
[independent HOLD](../../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/public/cdc/README.md)
and [causal source review](../../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/public/cdc/source-review.md)
are retained. Seven existing groups plus supplemental evidence cover the full
contract; fixing one line without independent final delivery proof is not done.

The historical S03 iteration21 candidate was rejected once by independent
review. Its planned first correction22 was paused without source edits. This
new initial assignment completes that correction under the new slice; no old
failure, acceptance or correction accounting is erased/reset. Subsequent
refinements get distinct prompts here and retain that inherited history.

## Bounded implementation

Change exactly THREE source paths: packages/lang/binding.js, its identical
crates/lykn-lang/embedded/packages/lang/binding.js mirror, and
test/forms/discard-bindings.test.js. Restore preexisting default-LEFT validation
for CatchBinding by using the existing non-TypedParameter discriminator in
walkPatternDefaults. Preserve typed slots, canonical-only spread/required-RHS
rules, source environments, metadata and all other code paths.

Add actual positive catch-default ESM execution and eval/arguments early
strict-binding negatives through public lykn and mapped browserCompileLykn in
the existing pattern/catch group. Keep seven top-level groups and M6's actual
62 tests/14 comparisons. No new harness or callback/public API.

Root refreshed the actual catch→default-left→raw arrow→binding projection→D2
chain and current test/execution helpers at the clean pin. Original Sol22
source-readiness applies to this unchanged narrow repair; new slice scope and
all original contract rows are explicit here, without importing the retired
S03's entire historical reading packet as current instructions.

## Verification and provenance

Capture the meaningful new regression before the guard fix, then focused green
against fresh browser output and affected binding/lexical/private/ICU/host
regressions. Run one final make check (docs already included) with a fresh
absolute M6 receipt hook. Commit only the three paths, then committed-HEAD
cited paths and fresh81920-byte gzip gate. Independent Sol repeats affected
proof and final gates, deciding any retained evidence by source applicability.
Counts are observed, not acceptance quotas; inherited M6 selection stays62/14.

Use existing DENO_DIR and owned XDG/npm/TMP under
/private/tmp/lykn-arc05-s01-cc/ or separate reviewer equivalent. Preserve actual
commands, source fixtures, numeric results, failed/incomplete observations and
cache/network/skip limits in artifacts/cc/ and artifacts/cdc/ when needed.
Retain session handles and clean up exact owned processes before handoff.
Existing root TERM143 history remains external termination, not a natural test
outcome. No new unbounded reader probe or evidence-reconstruction framework.

Canonical close records are closing-report.md, cdc-verification.md and
cdc-retrospective.md. CC proposed-done is not independent acceptance. Root
closes BS-01 and reconciles the old B2-DISCARD-P row only after full proof;
all other BS/LC/QA/project obligations remain open and keep their owners.

## Explicit limits and downstream handoff

This does not implement remaining raw/catch/loop/method discards or DTS (BS-02–04),
general source/compiler-name hygiene (BS-05–08), top-simple-multi default/rest,
native grouped non-atom admission, nested non-any annotation semantics, typed
owners/nominal activation or purity. Preserve public's already-admitted groups.
Catch validation preservation is not a new catch grammar or typed-source-fn
parameter expansion. Reader RDEO/RDCL, I4, warm-cache and other prior limits stay.

Arc06 LI-04 retains helper-export replacements, source-labelled rest diagnostics,
numeric-key AST changes and actual browser execution/API impacts. Public has no
strip option; test actual public checked behavior and native existing routes.
Source/book/human/library/licence acceptance is not inferred. Helpers use Lykn;
no Python or substitute research-helper language exception.

## Assignment history

| Prompt | Date | Predecessor | Purpose | State |
| --- | --- | --- | --- | --- |
| cc-prompt.md | 2026-11-13 | Historical S03 held21 / paused22 | First public correction and full independent Source discard completion | Issued; source/build transfers to Luna on dispatch |

## Version history

- 2026-11-13 v1.0: Open operator-authorized S01 with complete inherited scope,
  narrow R01 repair, fresh selected contributors and slice-only endpoint.
