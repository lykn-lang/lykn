# S03 iteration10 — B2a correction01

Issued2026-11-12 after independent HOLD, source-readiness and clean handoff.
The predecessor remains immutable. Root verified the final HOLD archive SHA256
d9d1b02c8ace3d9777f292e8e56eacd736f242b97858e27c2134182f668e2963.

## Outcome and authority

Correct B2a's independently reproduced lexical execution defects, preserving
the entire iteration09 contract and all earlier accepted A/B1/IC behavior.
This is the first B2a formal correction, not a reset of the prior A/IC loops.
Operator authorized standard Autonomous Mode, Luna6High CC and separate
Sol6.1High CDC. Root owns design and planning Git/index/status; implementer
owns task source/build only after issue, reviewer after clean handoff.

Task source is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`, baseline
`bcb98482fa9b32aa6f58df3e2249123e16924271`, tree
`72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9`. Preserve implementation fbd1604d
and both metadata follow-ups. Planning is the separate orphan worktree.
No release integration, remote action, publication, dependency or new public
syntax/API. B2b identity/lookup remains held on unanswered B2-ID-NAME; this
correction does not select that language policy or implement OwnerRef/CaseRef.

No Python execution or research helpers in Python/Ruby/Fennel/handwritten JS.
New evidence logic uses Lykn; direct shell lifecycle/CLI and ordinary Rust/JS
product tests are permitted. Preserve all failures, commands, streams and
issued prompts. No amend/reset, blanket staging or source evidence in docs/.

## Required intake before edits

Record loaded extents and source-cited contract readback in the existing
`artifacts/increment-b2a/correction01/cc/index.md` (create its parent first).
Recover truncated reads. Reading claims are attestation, not acceptance.

1. Required-full: this final issued prompt, slice-plan.md, ledger.md, source
   AGENTS.md, artifacts/b2a-lexical-regions-recipe.md. Required-section:
   closing-report.md's B2a root scope notes and handoff reconciliation. These
   preserve occurrence ownership, approved host predicate and actual1546/482
   prior CC denominator; no golden may change merely to match a regression.
2. Required-full: artifacts/increment-b2a/cdc/README.md, final B2a CDC HOLD
   with its reproduced witnesses and unsuitable/unrun probe distinctions.
   Required-section: predecessor iteration09's implementation
   spine and scope/return contract. No need to reload unrelated historical A/IC
   raw packets. The source-ready B2a recipe remains governing except explicit
   corrective mechanics below.
3. Required-section: installed Rust TD-01–03 and EH-01, JS API ID-03–04,
   testing validation gates; refresh applicable skill entrypoints/core guidance
   as required. Preserve fallible malformed-source paths, explicit grammar
   and consistent private helper input/output shapes. No tool example overrides
   the repository's real Make/config/no-Node contracts.
4. Required source queries: full native expand_expr/root macro-chain code,
   callers and try_desugar policy; lexical_regions::function_regions and its
   resolver/pass2 consumers; public expandClassMember, replaceChildPath and
   replaceArrayPath definitions/callers; M6 actual module/test populations and
   relevant native/public tests. Load the complete affected bodies and complete
   caller queries, not only hits. Distinguish actual source queries from full
   document reads.

## Causal repair recipe

### R01 — native macro results must re-enter actual dispatch policy

At baseline pass2.rs:135–167, only the first head checks lexical scope and
try_desugar. The inner fixed-point loop invokes every later matching macro
without those checks. A macro yielding an already-bound head therefore invokes
a same-spelled macro instead of the callable binding; a macro yielding car/cons
can similarly bypass the desugar priority that direct entry already has.

Refactor the root expansion into one redispatch loop/state for one head chain.
After each actual macro result, revisit the existing entry policy: quote and
actual lexical binding, supported source diagnostics, built-in desugaring,
then eligible macro. Once no root rewrite applies, expand actual children
through the existing precise scope plan. Child occurrences start independent
budgets. Keep one user-macro expansion count and original chain name/location
across same-root results and sugar redispatch; do not reset via recursive
expand_expr after each macro or sugar transition. Preserve the existing limit,
error propagation, raw lazy arguments, Thread/Eq phase and quote semantics.
No broad public-style classifySurfaceForm priority is invented for native;
reapply its actual existing direct-entry policy consistently at every step.
The multi-clause genfunc diagnostic must run only when the head actually
dispatches as unbound genfunc. Its current pre-binding check makes an ordinary
bound call change behavior merely because an unrelated macro activates pass2.
Move/gate that check by the same actual lexical dispatch decision; retain the
exact diagnostic and zero body effects for genuine unsupported genfunc forms.

Test native bound-result versus direct bound-call and unbound macro controls;
surface/sugar collision versus direct sugar control; macro count/effect remains
zero for suppressed later macros. Keep a genuine multi-step expansion, raw
discard/duplicate arguments, and runaway-chain limit with an ordinary diagnostic
rather than stack overflow. Include a sugar-to-macro transition if the actual
supported shape makes one possible. Product tests must use real native macro
facilities, not only manually checking source strings.
Add paired native compile controls for an identical bound genfunc call with
and without an unrelated macro declaration; both retain ordinary call dispatch.
Keep genuine unbound multi-clause rejection before any body macro executes.

### R02 — class-default replacement uses one array-path contract

Public expandClassMember passes an Array to replaceChildPath, which reads
root.values.slice and crashes on a supported method parameter default. Reuse
replaceArrayPath(values, member-relativePath, replacement), already used for
function defaults, and remove the now-unused wrong-shape helper. Retain one
outer copy and per-path ancestor rebuilds, original occurrence paths and all
private child identities. No in-place mutation of caller source AST, broad
clone-every-walk, or second default expansion. Mirrors stay byte-identical.

Use actual method `(value ((default amount 41)) (return amount))` runtime:
omitted argument41, supplied argument42. Add a default macro count oracle
proving one expansion per original occurrence and a class-member local shadow
control. Cover constructor/wrapper paths where the established writer supports
that shape, plus no-default positive. Do not introduce typed class parameters
or computed method syntax unsupported by the compiler.

### R03 — supported kernel function prefixes preserve name/parameter roles

Native function_regions admits kernel:function/kernel:function* but detects
the optional name only for literal function/function*. Consequently the name
is treated as a body expression and its following params do not become local.
Classify the already-supported head by canonical base kind before deciding
optional named-function roles. Keep an explicit grammar distinction: only
function/function* families accept that optional name; arrows/lambda stay in
their actual existing grammar. Do not add kernel:lambda source escape support.

Run named ordinary and supported escaped function/generator controls, anonymous
and arrow controls, callable parameters named array/bind and own recursion.
The exact escaped witness must emit a call to the parameter and execute7,
not the incorrectly desugared array [7]. Cover resolver and actual pass2;
structural layout equality alone is insufficient. Keep malformed-header normal
diagnostics and all prior binding-role/default tests.

## Scope, gates and return

Permitted changes: native expander/pass2.rs and lexical_regions.rs (including
their in-module tests); packages/lang/expander-core.js and its exact embedded
mirror; test/expander/lexical-regions.test.js; crates/lykn-cli/src/compile.rs
and tests/macro_dependencies.rs for real native/M6 regression coverage. Any
other necessary path needs a concrete integration explanation to root first.
Existing goldens14 remain. No broad emitter, default-contract, annotation,
owner, formatter or API cleanup.

Retain independent failing witnesses at the pinned baseline. Run focused actual
native/public runtime controls first, with current-source canonical imports;
failed setup and substantive attempts stay in raw evidence. After focused green,
fresh cold M6 compares all14 current modules and runs retained plus new strict
materialized cases, actual count derived rather than assumed38. Include copied
CLI/browser-compiled ESM and affected private fragment/host controls as the
issued B2a contract requires. Then fresh make check with docs once, post-commit
HEAD citations, browser80KiB. No full rerun on a known-bad candidate. Use the
actual existing Deno cache and created owned npm/XDG/tmp paths from the start.
Capture command/stdout/stderr/numeric exit, source state and actual denominator
from the first attempt; no reconstructed receipts or stale target import maps.

No B2a software claim was independently accepted at bcb98482; prior CC green
cannot substitute for affected gates. Earlier A/B1/IC independent evidence
remains historical and must be assessed for applicability by Sol. All B2-LX
criteria remain accounted for; LC-02–08 and S03 stay open.

Commit exact authorized changed paths with git commit --only and one prepared
message carrying contiguous Codex/Billo AI trailers; inspect it before and
after commit. Root owns planning staging/commits. Append the correction handoff
in closing-report.md and the canonical correction01 CC index: exact pin/tree,
source inventory, row walk, raw receipts/failures, remaining limits and clean
source/build return. Sol then independently validates the corrected candidate;
CC proposed-done is not acceptance. Do not proceed into B2b or release work.
