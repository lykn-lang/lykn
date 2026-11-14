# CC implementation assignment — Arc05 S04

Issued2026-11-14 after separate Sol source-readiness PASS. Project03 language evolution,
Arc05 binding semantics, S04 discard-aware declarations; initial assignment.
The operator explicitly authorizes S04 after green releasec60 integration and
selects Luna6 High CC / separate Sol6.1 High CDC, Autonomous Mode. Root owns
design/planning/index/status; you receive exclusive TASK source/build on dispatch.

## Outcome, pin and exact scope

Deliver native-generated declarations matching accepted discard argument slots,
default/rest input types and actual source-only binding exports, consumed by
real TypeScript clients and actual CLI/package outputs. The full binding design
and proof recipes are in [slice-plan.md](slice-plan.md) sections A–D and
Concrete proof; all eight [DT rows](ledger.md) stay open until separate review.

Task cwd `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch codex/qualified-adt-core, cleanc60dea62d126bb07557a7f4f7183662dec3f6a58,
tree9c247edcf632ef2e038078a2833e727db949730d. Planning is separate
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. Release/0.6.x staysc60;
no further integration/push/publication/remote action. Endpoint is independent
S04 task-branch close with root retrospective and bubble-up, no S05 opening.

Only these FOUR product files may change:

1. crates/lykn-lang/src/emitter/dts.rs
2. crates/lykn-cli/tests/discard_declarations.rs (new)
3. docs/guides/00-lykn-surface-forms.md
4. docs/guides/06-functions-closures.md

No AST/resolver/classifier/runtime, JS/embedded/M6 count, public API signature,
CLI production plumbing, dependency/lock or general source-name change.

## Required loading and intake before dependent edits

Required-full, in order: this prompt, current slice-plan.md and ledger.md,
task AGENTS.md, complete native emitter/dts.rs including existing tests.
Required-section:

- S03 artifacts/release-integration-c60dea62.md independent release ACCEPT and
  RI rows; S03 cdc-retrospective.md Outcome/observations/recommendations.
- Source skills/lykn/SKILL.md Before You Do Anything and Bindings & Mutation;
  guides00 complete bind/exports/type sections and guide06 ID01/ID30. Preserve
  runtime/schema/unsupported-signature contracts; source is taskc60, not planning.
- ast/surface.rs TypedParam/ParamShape/DestructuredField/ArrayParamElement,
  FuncClause/Constructor and
  Bind/BindGroup/Func/Export/Exports/Type definitions; binding.rs complete
  binding_names_in_pattern and emitter/forms.rs direct_bind_export_names.
- CLI compile.rs complete compile_source_with_dts; main.rs compile-file output
  branch writing JS/DTS; dist.rs compile_lykn_sources; full existing
  compile_validation_parity.rs test and emission_failures.rs package fixture
  helper. These are caller patterns, not permission to edit those files.
- Classifier forms.rs parse_typed_params_with_capture, object/array destructure
  parsers, classify_exports, classify_export, classify_kernel_escape and
  strict/lax export dispatch; sexpr.rs as_form_head: actual admission/default/
  rest/type/property and raw/default/re-export veto roles.
- Installed rust-guidelines entrypoint plus complete AP09/AP12/AP13 sections;
  testing discipline/Proportionate Proof; engineering-
  methods required-reading/CC-intake; work-verification independent corrections.
  Resolve skills through catalog; do not substitute another personal guide tree.

Recover clipped output in bounded contiguous reads. Append actual complete
read extents and source-cited readback to artifacts/cc/intake.md here BEFORE
edits. Connect declaration-local labels, real binding projections, optionality,
module-marker recognition and schema roles to the actual consumers. No blanket
receipt or sampling substitute. After coherent intake proceed autonomously.

## Implementation spine

1. Add a valid baseline consumer/red in the allowed CLI test: real compiled
   repeated `_` declarations fail actual Deno type checking atc60. Capture the
   generated .d.ts, real error/exit and relevant test state before production
   edits. A malformed source/consumer or missing tool is not this semantic red.
2. Implement plan A's deterministic clause-local synthetic labels in
   emit_func_args. Pre-reserve normalized meaningful names; retain slots/types,
   named labels and existing low-level APIs. Borrow successful units, no global
   mutable allocator or private runtime names in DTS.
3. Implement plan B default/rest and nested tuple/object caller-input types,
   with last-required-index logic and explicit undefined where exact optional
   fields/elements need it. Preserve returns/warnings/fixed overloads; no new
   multi-clause signature admission. Add semantic boundary/unit checks, not a
   duplicate implementation-as-oracle.
4. Implement plan C through existing binding_names_in_pattern. Share a private
   Bind/BindGroup declaration renderer at inline and named-export entrances.
   Scalar inference unchanged; destructured leaves unknown. Only known handled
   all-empty inline-bind export modules receive export{}; unsupported exports
   and empty non-module source keep their current behavior. Preserve schema/
   property `_`; never filter serialized text globally.
   Include plan C's raw KernelPassthrough export census: default/re-exports and
   stripped kernel:export veto an empty marker via first.as_form_head, including
   mixed-with-empty-bind tests; SurfaceForm::Export alone is not the full census.
5. Complete actual native AnalyzedUnit, CLI normal/strip/package and generated
   TypeScript consumers listed in the plan. Use existing Rust TempDir/Command
   product-test patterns, local generated declarations and Deno check with an
   owned strict+exactOptionalPropertyTypes+skipLibCheck:false config, no remote/npm. Include both
   expect-error and an unguarded actual TS negative; inspect stdout/stderr and
   real status. Runtime source fixtures may be Lykn compiled by the CLI.
6. Add only immediate factual teaching to guides00/06: generated declaration
   labels are compiler-owned labels, slots/guards preserved, `_value` ordinary,
   schema/data keys retained and discard-only source exports empty. Do not claim
   new browser DTS, complete generator/class APIs or book/human acceptance.

The worked examples/algorithms/tests in the plan are binding except private
mechanics explicitly recommended there. Challenge a contradiction before edits;
do not choose a different public/failure/optional-arity policy silently.

## Gates, evidence, commit and return

Use fresh owned XDG/tmp/npm under `/private/tmp/lykn-arc05-s04-cc`, shared warm
DENO_DIR explicitly `/Users/oubiwann/Library/Caches/deno`, and a new absolute
LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR in this slice's artifacts/cc/m6-final.
Preserve unknown outputs and failed conditions; no overwritten streams or
reconstructed missing snapshots. No new replay/archive/validator machinery.

Run make fresh-artifacts before staged consumers; focused Rust DTS tests and
new discard_declarations CLI target, then one final make check (docs included
once). Inspect actual M6 inner command/config/status/seven paths/exact70 and
all14 dual comparisons, even though JS source is unchanged. Derive actual
Rust/product/docs denominators from complete raw streams, retaining skip/
cache/warning/download/tracing distinctions. No optional Cargo docs/duplicate
docs command. Commit ONLY four named source paths using git commit --only,
with adjacent trailers:

    Co-authored-by: Codex <noreply@openai.com>
    Co-authored-by: Billo AI <ai-engineering@billo.systems>

Then final-HEAD make check-cited-paths and fresh make bundle-size-check81920.
Do not amend reviewed commits. Root owns planning Git/index/rows; CC appends
intake/evidence/closing report here, no planning commit. Return clean/no jobs,
exact source/tree/changed paths, actual checks/errors/limits, all8 row proposals,
artifact inventory and bubble-up for separate Sol. Later API/DTS omissions,
source-naming/qualified/reader/library/book/human/licence owners survive.

All new helper/script/orchestration/validator/evidence-processing/JSON/command
logic must be Lykn, never Python/Ruby/Fennel/handwritten JS/Node or substitutes.
**No Python execution or parity exception.** Named Rust product implementation/
tests and necessary static TS/runtime product fixtures are this deliverable;
native shell/Git only direct invocation/simple file lifecycle. No external
action or new dependency. Initial0/5 refinements spent; scope/quality/history
remain intact. Fix obvious scoped issues, return genuine non-obvious gaps to root.
