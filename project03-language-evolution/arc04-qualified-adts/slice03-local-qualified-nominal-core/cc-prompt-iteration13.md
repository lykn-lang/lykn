# S03 iteration13 — B2a correction04

Issued2026-11-13 after separate Sol source-readiness. Baseline0e249cafb7d50ce45e00f7c7288249666fcc113f,
treee946afc2283951fe11f2e9c7040a7f734dbf6d11. Correction03 independent HOLD
is preserved in artifacts/increment-b2a/correction03/cdc/README.md; archive
SHA25691564bbcccc497e527aad1c6b82b08be28af609806c699ac1a2d0a339c3cbd82.

## Authority, preserved obligations and intake

Same Operator-selected Luna6High CC and separate Sol6.1High CDC, standard
Autonomous Mode. Root owns design and planning Git/index/ledger/status. After
issue CC exclusively owns source/build in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
codex/qualified-adt-core, until clean committed handback. Planning home is
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`; owning slice is
project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core.
No release integration, remote action, push, publication or new dependency.
B2-ID-NAME remains unanswered; no B2b name policy/OwnerRef/CaseRef or nominal
activation. B2-LX, LC02–08 and all original S03 obligations stay open.

This is the fourth formal B2a correction, not a new retry allowance. Preserve
all issued prompts, failed candidates/fixtures, raw evidence and original
denominators. No amend/reset/blanket staging or planning evidence in source
docs/. No Python execution; no Python/Ruby/Fennel/handwritten JS research,
evidence, command-construction or orchestration helpers. Use Lykn for new helper
logic. Direct shell/CLI/simple lifecycle and ordinary Rust/JS product tests
remain allowed. No temporary parity exception is authorized.

Before edits/tests write intake and source-cited contract readback in absolute
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2a/correction04/cc/index.md`.
Required-full: this prompt, source AGENTS.md, current slice-plan.md and ledger.md,
correction03 CDC README. Required-sections: iteration12 typed-header/genfn
recipe, scope/gates; original b2a-lexical-regions-recipe.md and iterations10–11
preserved contracts (R01–04, source-only collection, wrappers, completion,
private capabilities, staged browser), closing-report.md current carryovers.
Load applicable Rust-guidelines/testing entrypoints and relevant type-driven,
error, mutation/API guidance. Record actual loaded extents and complete query
coverage separately; recover truncation. Prior receipts are not this intake.

Required source queries: complete protected_host.rs Surface named/anonymous
function handlers, param_scope_names/default visitors and raw Kernel branches;
all callers of param_scope_names; complete ParamShape::{typed_params,bound_names}
and enum shapes; pure classifier function parsers and emitter Genfunc handling
of ignored post/returns; classifier binding-capture leaf projection; current
CLI protected_host tests, lexical tests, M6 population/mapping. Inspect both
actual public compiler caller of validateProtectedHost and validator JSDoc.

Set/capture DENO_DIR=/Users/oubiwann/Library/Caches/deno plus owned XDG/npm/
TMPDIR under `/private/tmp/lykn-b2a-correction04-cc/` outside every repository
ancestor from the first invocation. Capture exact cwd/command/env, raw stdout/
stderr and numeric status contemporaneously. No runtime caches in evidence.

## Causal repair: parsed source regions in the native host-policy client

Native protected_host.rs currently parses Surface Func/Genfunc, but generic
fn/lambda/genfn handling walks raw args[1..]. Thus it visits the consumed
genfn :yields payload as executable code, and includes it in body scope names.
The existing Genfunc branch similarly includes/visits ignored post. The actual
public compile route already lowers these ignored forms away and is green.
Direct public validateProtectedHost(read(rawSource),...) is outside its expanded/
kernel input contract; do NOT introduce a source dialect API or alter public
production code to satisfy that unsupported helper call.

Extend the EXISTING InputDialect::Surface classifier boundary to Fn/Lambda/
Genfn as well as Func/Genfunc. Use authoritative parsed ParamShape params and
selected raw body returned by pure classify_expr, not another metadata grammar
or whole-program classification. Match the three anonymous variants together
where their executable shapes agree. Push actual parameter scope for defaults,
pop it, derive body scope only from actual body and actual parameters, visit
body, pop, return. No yields metadata is in that body. Preserve existing fallback
on classifier error; ordinary typed-header diagnostics remain with their existing
pipeline authority. Keep InputDialect::Kernel/raw function pattern handling
unchanged and separate. Do not re-expand macros or activate new syntax.

In Surface Genfunc exclude clause.post from BOTH emitted-body scope collection
and visits. Keep args/defaults, recursive function name, pre and actual body.
Ordinary Func post remains executable/protected. Do not implement generator
post/returns or multi-clause dispatch. A small private traversal helper may share
identical logic; avoid boolean mode switches/new general function AST.

The existing param_scope_names uses ParamShape.bound_names(), which includes
external nested aliases that are property keys rather than emitted bindings.
Do not extend that erroneous aggregate to anonymous source functions. Narrowly
project names via params.iter().flat_map(ParamShape::typed_params), then each
TypedParam.name normalized once with to_js_identifier. typed_params already
recurses every object/array nested pattern, skips holes, and yields real leaf/
rest bindings; retain its existing default visitor. This changes only this
private helper's consumers, including named functions. Do not change the public
ParamShape API, broad classifier grammar or B2b guard producers. Nested alias
guard/annotation concerns remain explicit B2b/S06 carryovers.

## Discriminating regression proof

Use literal STRING keys: `(set-symbol! Array "isArray" 1)` is proved protected;
keyword :isArray is not a rejection oracle under the existing proof policy.
Preserve the reviewer’s failed keyword attempts without expanding that policy.

1. Native source `(bind factory (genfn () :yields (set-symbol! Array "isArray" 1) (yield 41)))`
   compiles; actually execute compiled ESM by calling factory/next and observe41.
   Move exactly that write to actual body after :yields :any: protected-slot
   diagnostic with target span, no emitted output. Cover ignored payload that
   would otherwise declare a protected name, paired real global write, so merely
   suppressing diagnostics while retaining metadata scope pollution fails.
2. Native Genfunc ignored :post containing the write compiles/runtime41; same
   write in real body and executable pre still rejects. Ignored post bindings
   must not hide real global body writes. Ordinary Func executable post rejects.
3. All source Fn/Lambda/Genfn parameter defaults preserve real protected-write
   rejection, genuine parameter shadows and exclusion of body-only bindings
   from defaults. Real bodies preserve protection; selected no-metadata/typed-
   metadata behavior and original header diagnostics survive.
4. Source-only host-validator tests distinguish nested external alias named
   Array with a different leaf (global write rejects) from actual leaf Array
   (local write allowed), including nested object/array/rest/hole paths where
   supported. Check classifier-produced bindings so the fixture is real syntax.
   Pair default/body where applicable. Whole-pipeline kernel rejection alone
   cannot prove the source helper's alias behavior.
5. Actual canonical public compile and generated ESM retain metadata/post
   positives and body/default negatives. Do not claim direct raw validator API
   support. Retain all R01–05, private/host/Reflect/shared occurrence/fragment,
   macro priority/limit/lazy/order, wrapper/import/default/body-post controls,
   match14 goldens and generator non-features.

## Authorized paths, gates and return

Production source: `crates/lykn-lang/src/protected_host.rs` only, including its
in-module tests. Regression tests may also use
`crates/lykn-cli/tests/protected_host.rs`, `crates/lykn-cli/tests/macro_dependencies.rs`
and `test/expander/lexical-regions.test.js`. No public production or embedded
source change is expected. Explain any necessary extra path before affected edit.

Focused real regressions/source tests first; no full known-bad runs. Then fresh
make check including docs once, cold-XDG M6 with copied CLI and staged browser
(current14 module comparisons; derive test population), actual CLI/browser ESM
and private boundaries. Respect make fresh-artifacts workspace build before
materialized tests. After exact source commit run HEAD cited paths and80KiB
browser gate. New independent verification is required; no prior CC green is
independent acceptance. Reviewer determines retained evidence applicability.

Commit only inspected exact authorized paths with git commit --only and a
message file. Verify git interpret-trailers --parse before commit and committed
message after: literal contiguous Co-authored-by: Codex and Co-authored-by:
Billo AI lines, existing mandated addresses. Root owns planning commits.
Return clean source/build ownership with exact commit/tree/paths, raw failed/
final receipts, actual denominators, row walk and remaining limitations in CC
index. No B2-LX or broader acceptance attestation by CC.

Author readiness: root inspected native handlers at655–780, helpers307–329,
ParamShape1–143 and actual protected tests, supported independent causal pairs
and public input domain. Rust named semantic data/error authority and precise
JS API-domain discipline constrain this recipe. The implementation reuses the
actual parsed source representation and true leaf-binding projection, correcting
this third client of the already-settled metadata boundary rather than repeating
the earlier parser-only approach. Separate Sol read the complete draft against
the exact baseline and confirmed typed leaf projection, parsed anonymous source
regions, ignored Genfunc post and public validator domain, with no concrete
contradiction. Root issues under existing Autonomous authority.
