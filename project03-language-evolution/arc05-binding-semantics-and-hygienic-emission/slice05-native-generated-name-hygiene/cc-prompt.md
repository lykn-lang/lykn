# CC — S05 native compiler-generated name hygiene

Issued2026-11-14 after separate source-readiness PASS and committed
open set. Same operator-selected Luna6 High CC / separate Sol6.1 High CDC,
Autonomous Mode through S05 independent task-branch close only. Initial
assignment,0/5 refinements. Root owns design/planning/index/status.

## Authority, baseline and intake

Task source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch codex/qualified-adt-core, clean
c0ed454610f3a384196e4fa003335373819fb2fd,
tree7d8b3359fa570b2e8322996dbe8b648f02af58da. Planning is separate orphan
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. Release/0.6.x staysc60.
Root transfers exclusive source/build only on explicit committed dispatch.

Required-full: this prompt, slice-plan.md, ledger.md, source AGENTS.md,
emitter/gensym.rs and context.rs, ast/surface.rs definitions1–510,
artifacts/root/baseline/README.md and its three complete actual sources/generated
outputs/runtime streams. Read prior S04 cdc-retrospective.md and final source/
closing-verdict sections for role/oracle/path/metadata lessons.
Required-section: emitter/mod.rs complete production emit/materialization/
emit_json1–240; forms.rs complete public emit_form/raw/finalization boundaries,
emit_expr wrapper and dispatcher, unbox_awaited_value, emit_dissoc, all threading,
prepare_typed_param/prepare_param, emit_func/single/multi, both generator producers
and instrument_yields, next_unreserved_gensym/reserve helpers; every actual
gensym/fixed-binding producer found by the plan's scoped source census.
Read complete actual Func/Bind/Type/nested/class/raw AST fields, not only
typed_params()/bound_names(). For unchanged late allocators load names.rs1–74,
host_references.rs and host_invocation.rs production definitions, ICU allocator/
kwargs/hoist/branch paths510–656/812–909, codegen/mod.rs module entry1–110,
codegen/emit.rs fragment entry78–140, emitter/json.rs1–72.

Required test/caller sections: existing emission_results.rs complete relevant
canonical unit/fragment/error/reuse/runtime helpers; remaining_discard_bindings.rs
CLI .lykn/.lyk check/compile/runtime and unsupported-signature controls;
discard_declarations.rs package template/build/sidecar/runtime pattern; actual
CLI main.rs Compile kernel_json flag and compile.rs native owned-unit flow;
packages/lang/compiler.js actual compile(exprs)2296–2306 and bridge.rs45–82
as schema reference only (not a new caller of its shared temp helper);
macro_dependencies.rs existing M6 capture/selection/comparison definitions.
Resolve paths through source, not guessed reader/json or cli.rs modules.
Guidance: installed Rust guidelines AP-09/AP-12/AP-13 actual sections; testing
discipline/validation gates; engineering-methods guide07 required-reading/intake;
repo skills/lykn/SKILL.md Before Anything and binding/function grammar plus
guide06 ID01 and relevant generator/thread examples. Recover clipping before
dependent edits. Record actual text extents separately from structured searches.

Append intake/readback BEFORE edits to the exact canonical file:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice05-native-generated-name-hygiene/artifacts/cc/intake.md`.
Read back census versus binding resolution, all early/late producers, unit versus
single-form/raw entrances, fixed args replacement, error/reset/strip policy,
real consumer proof, no source-renaming/qualified scope and exact seven paths.
Challenge an actual consequential mismatch before dependent edits; do not
invent a new experiment or repair a different subsystem by fixture churn.

## Concrete implementation

The binding design and borrowed exhaustive field map are slice-plan.md A–C.
Implement that complete recipe, not the later full RuntimeBindingId graph.

1. In gensym.rs add normalized occupied names, private source reservation and
   preferred allocation. Keep next(prefix)'s public String API and old suffix
   shape; consume a checked counter candidate until free and reserve immediately.
   reset starts a fresh counter+occupancy namespace. Counter exhaustion is the
   documented address-space invariant, not source-error recovery. No globals.
2. Add private source_names.rs exhaustive borrowed SurfaceForm/ParamShape/
   Pattern/class member/default/guard traversal. Census both reconstructed
   String names and retained SExpr operands, complete normalized atom spellings
   and colon segments. Data aliases may be conservatively occupied without
   becoming source bindings. Never clone/rebuild AST nodes, flatten incomplete
   projections, reinterpret spans/tags or walk generated output to recover
   source identities already merged by a producer.
3. Register the private module; canonical emit reserves ALL unit inputs before
   its first allocation. Public emit_form seeds its complete one input before
   raw emission; private recursive emit_expr stays below that boundary. No
   O(n-squared) repeated subtree scans or unnecessary context-depth mechanism.
   Preserve completion/validation/invocation/reference ordering and fragment
   host-marker errors, existing fatal/mode recovery and strip semantics.
4. In forms.rs replace multi-clause rest storage args ONCE using preferred
   allocation; use the same result in its rest binding, length test and every
   indexed read. Preserve source clause bindings, ordering/dispatch/no-match,
   contracts and unsupported SIMPLE default/rest boundary. Replace the named
   rest-check element storage through preferred allocation; keep its OLD display
   label distinct from the new actual value atom. Discard element identity is
   still CompletionValueId, not source `_` or a new prefix convention.
5. Existing next users and local match reservation now compose with the seeded
   generator. Do not rewrite completion/host/ICU allocators. Keep their existing
   owned markers and late reservation inputs. Fixed helper-only parameters
   fn/receiver/argv and separate support-module exports are closed lexical
   enclosures with no user payload inside. Raw codegen remains a literal writer.
6. Add actual product tests in the two allowed files and bounded native helper/
   fragment boundary teaching in guide06. No new user namespace/prefix ban,
   public compiler claim, general exact-spelling support or runtime dependency.

## Real oracles and delivery

The three root baseline specimens are executed reds/opposing output, not
hypothetical failures: old typed result duplicate SyntaxError; args parameter
TDZ ReferenceError; foreign args99 captured as argument array. Preserve them.
New tests require successful execution7/7/99, with source reconstructed fields,
normalized `!` collision, nested param/default leaves and candidate suffixes.
An unused-variable warning is not a runtime failure or a false success reason.

Use four meaningful native groups and two CLI groups per plan. Exercise actual
gensym producer families (some-thread/dissoc/await/yield/checked results/match/
carriers), not solely new generator methods. Observe opposing values, exactly-
once effects, null/throw and iterator timing; assert the actual intended Error/
TypeError class/message, never a SyntaxError excerpt containing a sentinel.
Retain `_` data/discard distinctions, `_value`, rest labels and checked/strip
behavior. A direct low-level shape test cannot substitute for admitted Source.
Use complete native canonical unit APIs and actual codegen; repeated/interleaved
and failed-then-good calls must preserve per-context/source ownership.

CLI consumers must run real .lykn/.lyk check+compile and generated JS for both
strip modes. Exercise actual --kernel-json output through the existing JS kernel
compiler compile API, not handwritten IR or replacement declarations. Static JS
compiler runtime clients embedded in these Rust PRODUCT tests are permitted;
they are not new orchestration/evidence helpers. Use actual build package output
for overloaded args, selected public namespace and source DTS names; compiler
private locals must not appear as extra exports or declaration parameters.
Keep existing S04 strict TS suite intact; no duplicate generic TS framework.

Late composition uses real canonical host fallback/completion/ICU inputs plus
the existing bounded tests. Do not relabel raw ICU source→codegen tests as native
analyzed-unit proof. Whole-compiler unordered ICU hoist determinism, raw unfinished
private-address metadata transport, user macro hygiene and exact source-binding
renaming are not newly solved. Report these limits with their proper later owners.

## Gates, exact commit and return

Only the seven named plan paths may change. Native source code and two named
Rust product tests are the deliverable; no dependency/lock/JS/resolver/AST/
protected-policy/DTS/late-allocator/M6 count changes. Preserve legitimate old
unit tests in forms/gensym; only replace intentionally obsolete spelling checks.
If another product file genuinely must change, return the concrete dependency
to root rather than silently widen scope or weaken a test.

Before full gates, inspect each materially changed producer's actual test input
role and the wrong implementation it rejects. Run rustfmt and focused native/
CLI generated_name_hygiene targets with --nocapture; retain complete semantic
sources/generated consumers/status/stdout/stderr in existing test output.
No new capture wrapper or archive framework. Run make fresh-artifacts before
staged consumers, then ONE final make check/docs once. Set existing
LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR to an absolute fresh artifacts/cc/m6 home
BEFORE that invocation. Read actual inner command/config/status/seven paths/
M670 and all14 canonical=embedded=materialized comparisons; outer Cargo is not
that evidence. Source may still be dirty before commit: report that actual
execution state and subsequent identical tree, not a future checked-out hash.

Write the exact source commit message to an owned temporary text file, with
one blank line after the title and THESE ADJACENT final lines:

    Protect native compiler-generated bindings from capture

    Co-authored-by: Codex <noreply@openai.com>
    Co-authored-by: Billo AI <ai-engineering@billo.systems>

Stage only the new named files as needed; git commit --only -F <message-file>
with all seven exact paths. Do not use separate -m paragraphs for each trailer.
Inspect actual raw commit text, exact tree/path delta and clean worktree before
handoff. Never amend reviewed c0ed/earlier commits. Then final-HEAD
make check-cited-paths and fresh make bundle-size-check (81920 cap).

First-class close is EXACTLY:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice05-native-generated-name-hygiene/closing-report.md`.
Append all8 NH proposals, actual pins/commands/counts/limits, complete artifact
inventory and bubble-up against BS-05; never self-accept. Root owns planning
Git/index/rows; Sol source-first independent review and fresh mandatory gates
precede acceptance. Root then completes retrospective and parent routing.
Return clean exact source/tree, no jobs and exclusive source/build to root.

Use fresh owned /private/tmp/lykn-arc05-s05-cc and canonical planning artifacts/cc;
shared warm DENO_DIR=/Users/oubiwann/Library/Caches/deno is explicit. Keep
actual optimized/debug profiles, shared cache, skips/downloads/warnings and
untraced child argv limits. No blanket no-npm or registry-success claim.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
must be Lykn: no Python/Ruby/Fennel/handwritten JS/Node or alternate scripting.
No Python execution or parity exception. Direct shell/Git/simple file lifecycle
and the explicitly named Rust product tests/static runtime fixtures are allowed.
No S06, integration/merge/push/hosted-CI/publication/new licence or library trial.
