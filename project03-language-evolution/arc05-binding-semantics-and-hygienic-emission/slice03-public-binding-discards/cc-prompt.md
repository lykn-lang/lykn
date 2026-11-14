# CC implementation assignment — Arc05 S03

Issued2026-11-14 after separate Sol6.1 High source-readiness PASS. Project
project03-language-evolution, arc05-binding-semantics-and-hygienic-emission,
slice03-public-binding-discards. Initial assignment; no predecessor execution.

## Outcome, authority and ownership

Implement the remaining public/browser discard binding forms under the binding
contract in [slice-plan.md](slice-plan.md). All nine [PB rows](ledger.md) remain
open until separate Sol6.1 High CDC verification. You are CC, OpenAI gpt-6-luna
with high reasoning, explicitly selected by the operator2026-11-14. Root is
coordinator/design/planning-index owner. You own source/build only after root's
explicit dispatch, and return it clean with no owned jobs before CDC checks.

Source cwd: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`, clean9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a,
tree6d64692fde0c367e73deeda1ec1aca19e49d6b93. Planning lives in the existing
orphan worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`; this prompt
is project-relative
`arc05-binding-semantics-and-hygienic-emission/slice03-public-binding-discards/cc-prompt.md`.
Do not use planning as source or edit release/main/other worktrees. Source
integration is accepted task-branch delivery only; release stays0829e892.
No push/merge/release/publication/remote CI/new dependency/licence/reader change.

## Required reading and intake

Before dependent edits, load the following complete extents in this order;
recover truncated tool output in contiguous bounded chunks. Installed skills
resolve through this session's catalog; relative guide paths below are beneath
their skill root. A previous context's summary/hash/existence does not prove
this context read the content. Record actual extents/queries and a concise
source-cited contract readback in `artifacts/cc/intake.md` here. State how the
source/generated/raw and catch/pattern distinctions constrain your changes.
No source edits until intake is coherent; then proceed without a new approval.

| Kind | Required input | Purpose |
| --- | --- | --- |
| Required-full | This prompt; slice-plan.md; ledger.md | Current implementation/acceptance contract, including all test oracles and exclusions |
| Required-full | Source AGENTS.md | Repo homes, commands, Git/assistant trailers and Lykn-only helpers |
| Required-section | Parent arc-plan.md: Authority and outcome, Candidate slice roadmap, Verification/handoff/limits | Accepted S01/S02 and current S03/later ownership; older issue/HOLD prose is history |
| Required-section | S02 cdc-verification.md: Final correction04 verdict through final handback, plus Closing metadata review; S02 cdc-retrospective.md: Follow-through and next-slice recommendations | Actual accepted boundary and oracle/admission/staging lessons, not prior prompts as current assignments |
| Required-section | collaboration-framework skill: Notes for Codex, planning/prompt/intake routing; engineering-methods guide01: Roles/shared invariants, Two-Contributor Workflow, Autonomous Mode; guide07: Required reading and CC intake | Current role, source ownership and evidence quality |
| Required-section | javascript-deno-guidelines skill: Environment/module, Declarations/naming, Values/references/mutation, Error handling, Testing, No-Node boundary; guides/09-anti-patterns.md ID12 and ID35, guides/06-functions-closures.md ID11–14; guides/12-deno/12-02-testing.md ID08 | Applied copying/identity/scope and exact failure tests; repo conventions override generic migrations |
| Required-full | testing/guides/01-testing-discipline.md and guides/03-validation-gates.md from installed testing skill | Real paths/denominators and proportionate checks without new harnesses |
| Required-section | rust-guidelines guides/11-anti-patterns.md AP09/AP12; source macro_dependencies.rs M6 function complete | Test-only M6 list/count extension, retain actual inner proof and owned resources |
| Required-section | source skills/lykn/SKILL.md Before You Do Anything; source docs/guides/00-lykn-surface-forms.md `Bindings & Mutation`, `Kernel form passthrough`, `Raw kernel IR function reference`, `Destructuring`, `Classes (kernel forms)`; guide06 `ID-30: Multi-Clause func for Overloaded Dispatch` | Existing teaching and actual backend/API distinctions; AGENTS permits contributor-native Cargo/Deno/Make |
| Required-section | Source surface-helpers.js preparedValue through lowerBindingPatternChild and parseTypedParams; classifier.js classifySurfaceForm func/bind, parseBindGroup, Func emission and complete buildSingleClauseFunc/buildMultiClauseFunc | Existing producer/type/dispatch/pattern shapes |
| Required-section | Source expander-core.js cloneOccurrenceSyntax, expandChildrenPlan and function/class/try regions, private atom/finalization definitions, expandExpr/expandAt/expandExprInner, pass2/expandWithMacroImports complete | Exact placement after source resolution/macros, generated exemptions and finalization lifecycle |
| Required-section | Source binding.js kernelParamNames, patternNames, walkPatternDefaults; lexical-regions.js complete; kernel-forms.js KERNEL_FORMS/KERNEL_ONLY_FORMS; compiler.js compileParam/Pattern/ObjectPattern/ArrayPattern/PatternKey, function/arrow/async/class/try/loop writers, compile/compileExpr; mod.js, browser/compiler.js and expander-browser.js | Trace actual admission and writer consumers, not inferred metadata; these are mostly read-only |
| Required-full | Source test/forms/discard-bindings.test.js, test/expander/lexical-regions.test.js | Useful existing runtime/strict-name/private/namespace fixtures and preservation obligations |
| Required-data | `rg -n 'lowerDiscardBindingPattern|prepareTypedParam|prepareTypedBind|compilePattern|kernelParamNames|parameterDefaultPaths' packages/lang/`; `rg -n 'Deno.test\(' test/forms/remaining-discard-bindings.test.js` after creation; M6 public_tests list and summary | Complete relevant caller census and actual8-new/62-retained selection; distinguish query coverage from full-file reading |

Normative new dependencies encountered during reading must be loaded before
affected work; unbounded historical packets are reference-only. Source locators
in the plan are at9e; recheck branch/revision/dirt on intake and handoff.

## Implementation spine

Binding decisions are in slice-plan's six numbered design sections. Recommended
private helper names may vary; observable boundary, ordering and ownership may
not. Use the plan's exact14-path product allowlist and eight-group test mapping.

1. Add the eight-group Deno product suite, using existing ESM child/namespace
   style. Show a discriminating raw remaining-form or signature regression red
   on9e after `make fresh-artifacts`. Keep that original failure; do not change
   expected results to fit the old compiler. Ordinary product JS test/fixtures
   are allowed; do not author an ad-hoc JS helper in planning or tmp.
2. Reuse existing private-atom creation/finalization and role-local pattern
   lowering. Add source raw-form preparation at explicit validated escape and
   unmarked resolved fallback boundaries, preserving sanctioned identity. Do
   not run it over generated schema functions or raw compile/compileExpr input.
3. Prepare ordinary declaration/loop/function parameters and class member
   slots, including wrappers; separate catch expression grammar and actual
   public suffix selection. Preserve RHS/key effects, type checks and dispatch.
4. Add untyped spread projection/default-path support in binding/lexical code;
   preserve actual source/private environments and failure/reuse behavior.
5. Preserve public grouped zero-name admission, including empty-list shorthand;
   literalize only grouped zero-name static alias keys by role and existing
   normalizer, with colon/dot member-Atom early rejection. Named/single/raw
   branches/default RHS stay untouched; do not port native structural admission.
6. Add one shared >1-clause top-level simple default/rest guard at classify and
   direct emission/build entrances. Exact diagnostic in plan; reject before
   RHS expansion. In exported buildMultiClauseFunc itself, delegate a ONE-clause
   list to buildSingleClauseFunc before allocating dispatch state, preserving
   default/rest effects for source and direct-builder callers; test both routes.
   Do not implement variadic overloads.
7. Keep five embedded copies byte-identical to their canonical modules. Add the
   new file's8 tests to M6 selection and assert exact70/0 total (retained62+8).
   Update immediate factual guides for public/browser parity and raw boundary;
   keep tested teaching, examples and future book/human gates.
8. Inspect complete diff, refresh staged artifacts, run focused and full gates,
   self-review code/oracles against every PB row, commit exact paths. Final-HEAD
   citations/fresh size follow. Return for independent review, not self-close.

Important rejected approaches: global output-tree underscore replacement,
parameter-container-as-array lowering, declaration-pattern catch conversion,
normalizing value expressions, copying private markers with JSON/structuredClone,
prefix-based identity, caller/whitelist assumptions and a new generic verifier.
These fail schema/data/effect/lifecycle contracts even if a simple test passes.

## Validation and evidence

Follow slice-plan's exact commands and eight oracle groups. Each claimed behavior
must run through the real relevant facade; browser compile-to-ESM is distinct
from browser run/load/CSP. Existing raw codegen remains literal. Preserve S01
nested catch strict-name controls and S02 native acceptance/regressions.

Precreate owned per-contributor `/private/tmp/lykn-arc05-s03-cc/{xdg,tmp,npm}`;
set DENO_DIR to `/Users/oubiwann/Library/Caches/deno`, XDG_CACHE_HOME/TMPDIR/
NPM_CONFIG_CACHE to those owned roots. Precreate absolute slice-local
`artifacts/cc/m6-final` and set LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR before final
make check. Do not delete/overwrite unknown outputs or expand permissions.

Run `make fresh-artifacts` BEFORE the first staged consumer, including red.
After implementation/mirror changes refresh again. Focused command:

```sh
deno test --config project.json -A test/forms/remaining-discard-bindings.test.js test/forms/discard-bindings.test.js test/expander/lexical-regions.test.js test/expander/binding-walker-parity.test.js
```

Then final `make check` (includes docs once); actual M6 child70/0 and all14 byte
comparisons, final-HEAD `make check-cited-paths`, fresh `make bundle-size-check`
below81920. Read the inner results/config, not just outer exit. Record actual
denominators, cache/network/JSR self-skip/warnings/failures/unrun conditions.
No test ignores, tolerance broadening or validator bypasses. A change after a
gate invalidates affected evidence; repin/rerun appropriately. Keep proof
proportionate; no broad mutation/benchmark/archive system is commissioned.

## Helper-language and scope policy

Research tooling authored for Lykn must use Lykn for all helper, script,
orchestration, validator, evidence-processing, JSON and command-construction
logic. Do not author those in Python, Ruby, Fennel, handwritten JS/Node or another
scripting language. Native shell/CLI is for direct invocation and simple file
lifecycle, not replacement logic. **No Python execution or parity exception is
authorized.** Ordinary product compiler JS and product Deno tests/fixtures in
the named source paths are this implementation's deliverable, not a helper-
language exception. Keep generated outputs in ignored target paths except
specific durable evidence needed under this slice's artifacts home.

Do not alter readers, native compiler semantics, public flags, browser loaders,
locks/dependencies, licence, API audit scope, book or later naming/ADT work.
Obvious in-scope errors may be repaired autonomously; preserve failures and
report source-grounded corrections. If a non-obvious solution, real evidence
gap or changed contract is needed, return to root before dependent execution.
Five refinement passes remain the framework cap; filenames do not reset it.

## Commit and return

Only the14 named product paths in slice-plan may enter your source commit.
Use explicit `git add -- <named paths>` and `git commit --only -- <named paths>`;
no blanket staging or unrelated change. Both contiguous trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

Do not amend reviewed commits. Root owns all planning Git/index/ledgers. You may
write only your intake/evidence under artifacts/cc and the slice closing-report.md;
record exact commands/statuses/pins and PB row proposed dispositions, failed
conditions, applicability/limits and bubble-up suggestions. Do not mark rows
done or write reviewer success. No jobs remain on return. Name commit/tree,
exact changed paths, current prompt and actual M6/citation/size results.
Source/build returns to root for separate Sol review. S04 and release stay held.
