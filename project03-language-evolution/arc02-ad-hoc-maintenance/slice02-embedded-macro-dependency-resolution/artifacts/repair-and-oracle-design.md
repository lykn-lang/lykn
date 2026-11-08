# Proposed dependency repair and native oracle contract — 2026-11-08

CDC Sol6.1 High source-grounded DESIGN, not source execution/acceptance. Current
source e2f differs from accepted62e only in two Arc03 tests; source contracts
below are therefore62e. Original W8 raw/pins/stop remain in Arc03 S01 at planning
c791eca. No new experiment, Deno help/eval/probe or specimen was launched.

## 1. Selected bounded recommendation

Native macro evaluator is a compiler-owned runtime component, so use its
EXISTING materialized `packages/lang/deno.json` and adjacent deno.lock explicitly.
Both canonical/embedded declarations map astring to npm:astring@^1.9.0; both
v5 locks pin1.9.0/integrity. No dependency adoption, import rewrite, vendoring,
new resolver library, merged workspace configuration or caller-file mutation.

Actual source: deno.rs47–73 discovers project.json from caller cwd, materializes
packages, sets child cwd to materialized ROOT, and passes --config only if a
caller project was found. Package config is nested, not root. Compiler.js:5
imports bare astring. These facts support the wiring recommendation; the ONLY
runtime evidence is the original W8 failure, not a tested repair.

Path convention: native shorthand is under crates/lykn-lang/src/ (expander/
deno.rs etc.); CLI shorthand under crates/lykn-cli/src/. All package/script/test
paths are source-checkout-relative. Source references are62e/e2f, not runtime proof.

Implementation sketch (private types/API, UNCOMPILED):
- `DenoSubprocess::spawn() -> Result<Self,LyknError>` calls
  `embedded::materialize_packages()?`, then PURE
  `build_deno_command(script:&str, materialized:&Path) -> Command`.
- Builder owns cwd=materialized and exact arguments `eval --config
  <materialized>/packages/lang/deno.json --lock
  <materialized>/packages/lang/deno.lock --frozen-lockfile=true --ext=js <script>`.
  Pass actual Path/OsStr, not to_string_lossy. Remove private find_project_json.
- Preserve JSON-line evaluator/protocol/pipes and Drop kill→wait unchanged.
  No temporary merged map/config exists, hence no new resource-lifetime guard.
  Materialization I/O propagates existing LyknError::Io before child spawn,
  never user-reachable expect/panic or silent ambient fallback.
- Existing materialize_packages same-version fastpath additionally requires
  both package config AND lock files. Missing required file uses EXISTING
  re-extraction. Frozen lock refuses drift; no caller lock or new version writes.
  Existing unknown/tampered cache CONTENT identity remains C04-owned, not fixed
  by presence checks. Do not expand to global integrity scans or cache redesign.

Flag support is SOURCE-verified against Deno v2.9.6
[parser defs](https://raw.githubusercontent.com/denoland/deno/v2.9.6/libs/cli_parser/src/defs.rs)
(config/lock/frozen-lockfile definitions). This is not a new installed-binary
trial. [Deno eval reference](https://docs.deno.com/runtime/reference/cli/eval/)
documents these options; future pinned executable gates remain mandatory.

## 2. Preserve intentional Lykn resolution, disclose actual compatibility change

Pass0.rs resolve_specifier remains UNCHANGED: exact local overrides precede
scheme delegation; bare exact/longest-prefix mappings use supplied Rust imports;
filesystem paths use importing-file/cwd rules; workspace fallback remains.
Compile.rs obtains effective imports before expand. Required tests use UNIQUE
imported alias-twice, not builtin when, so dropping an import cannot false-pass.
No new registry input or new claim all existing relative-path behavior is ideal.

Consumer mapping named astring must still resolve its requested macro module
through Rust, while compiler imports use their own package declaration. Missing
or conflicting consumer aliases cannot supply/replace compiler dependencies.
Keep publicJS compiler import/bundling unchanged: scripts/bundle-size.js currently
aliases bare astring, and package distribution also owns its source import rules.
No changes to these consumers are necessary for the chosen native-only recipe.

Actual intentional change: native evaluator no longer forwards arbitrary caller
Deno imports/scopes/lock/vendor/permissions/compilerOptions/workspace settings.
Do NOT claim complete equivalence with that previous private passthrough. This
fits the agreed 0.6 breaking-development boundary and compiler-owned dependency
contract; document the changed configuration surface now and assign exact final
API/book/guide/LLM/human audit to Arc01 S07/S08. Public Lykn import precedence is
preserved; arbitrary Deno-environment passthrough is not its implementation.

Parent evaluator versus env.rs resolve-macro-source's nested `deno info --json`
and registry fetch paths are DISTINCT. They remain unchanged/out of scope;
do not claim offline isolation, all remote macro workflows or a sandbox repaired.
Use existing pinned/cached inputs in validation; if required input is unavailable,
stop, no install/fetch/version update. No offline-only production policy added.

Rejected alternatives: no-project-only fallback leaves consumer alias poisoning;
direct npm import changes canonical/browser consumers; CLI --import-map overlay
can replace root mapping, and naive copying loses extended Deno semantics.
Pinned [workspace resolver](https://raw.githubusercontent.com/denoland/deno/v2.9.6/libs/resolver/workspace.rs)
961–1033 shows explicit-map base selection/member layering;
[Deno modules docs](https://docs.deno.com/runtime/fundamentals/modules/#differentiating-between-imports-or-importmap-in-denojson-and---import-map-option)
explain the extended/standard-map distinction. No custom composition framework.

## 3. Arc03 native oracle correction proposal (HELD, separate owner)

Future Arc03 S01 correction02 after accepted prerequisite/local composition:
ONLY existing `crates/lykn-cli/tests/protected_host.rs` for oracle work, plus
explicit S01 production allowance addition `crates/lykn-cli/src/dist.rs` for
classifier error wiring. Original source families/W1–W9, strip/macro/legal4,
public phase-path correction and before-assert raw retention remain unchanged.
No new public Diagnostic fields/error-code API or general test framework.

Proposed exact v1 message: `host-contract v1: write to protected slot <slot>`.
Expected slots W1/W2/W5/W6/W7/W8/W9=Reflect.apply; W3/W4=Reflect. Keep independent
literal expectations in product tests, not values imported from the feature
implementation. Severity Error, suggestion None for these simple fixtures.

Typed library proof uses actual Diagnostic equality/message/severity/span and
Classify versus Codegen channels. For ordinary parsed cases expected span is
reader node [form0].values[1]; W9 target is [form0].values[7].values[1].values[1].
W8 generated nodes have default span: env.rs protocol_json_to_sexpr343–383
constructs each node from Span::default(), and pass2 expands without restoring
the call span. Expected0:0 is unknown origin, not precise blame. Never invent a
macro body source location.

CLI has NO structured phase code: CompileError::Analysis stringifies diagnostics.
Use exact route-rendered bytes plus independent typed library proof, not a new
machine code or free substring match. Diagnostic Display is
`<line>:<column>: error: <message>`; main check adds `<source-path>: error: `,
compile/stdout/-o/strip adds no path prefix. Single-fixture error is one exact
line+LF. Require exit Some(1), stdout empty; wrong severity/span/slot, extra
macro/error wrapper or extra lines must fail. This does not claim unforgeable
diagnostic authentication for arbitrary programs.

Keep JS/DTS before/after bytes, missing-file absence and typed-dist epoch mtimes.
Add existing-output mtime capture to the SAME native observations so equal-byte
rewrites cannot count as preservation. No new invalid source family/launch.
Raw code/streams/files/mtimes precede all assertions. All29 observations still
complete before aggregate desired-rejection assertion; legal4 remain separate.

Tiny private test predicate consumes a borrowed view of actual Observation
(code/stdout/stderr/expected rendering/artifact bytes+times), NOT just an
externally fabricated effects-ok boolean. Same function is used by real routes
and synthetic controls. At start of existing negative parent test run one valid
acceptance plus fourteen rejecting controls: syntax, I/O, original astring
macro failure, marker inside macro error, wrong slot, wrong severity, wrong
span, exit0, exit101, no exit code, stdout payload, JS mutation, DTS mutation,
mtime-only mutation. These are15 private predicate observations, NOT additional
Rust selected tests, source families, compiler runs or K controls. Fixtures are
inline PRODUCT Rust test data, no dependency on planning files. Preserve actual
source/runtime errors if a control fails; no automatic assertion weakening.

Conscious required dist wiring: dist.rs234–247 currently converts classifier
Vec<Diagnostic> into Io/string, unlike its existing validation Language branch.
When v1 uses classify_with_options, map its nonempty Err list to existing
DistError::Language { path, source:LyknError::Classify(first diagnostic clone) }.
The classifier's nonempty-Err invariant is source-defined; preserve payload,
never scan message strings for v1. This intentionally exposes the first typed
classifier diagnostic instead of prior Io/all-joined text; document/API-audit
that change. Reader/expander/analysis adapters stay out of scope; no all-error
parity claim. Dist test must check path AND Error/message/actual parsed span,
in addition to existing sentinel bytes/mtimes. No weaker variant-only success.

Baseline after prerequisite must observe ALL29 old successes, plus legal4 and
old dist overwrite, BEFORE v1 production implementation. Merely matching old
runner1pass2fail is insufficient. After v1, all29 exact policy/error/effect
oracles pass; unrelated dependency errors remain failures. All original full
normal Make/cites/generated/runtime/separate CDC gates remain mandatory.

## 4. Sequencing, budget and review

Maintenance implementation is one useful future Arc02 S02 on accepted62e, not
e2f's intentionally-red tests. All six MR rows OPEN, source0/5. After independent
acceptance P, local candidate composition with preserved e2f needs explicit
authority/actual exact union review, no release merge. Arc03 source01/5 and
old tooling8/K0/13 carry forward; future oracle correction02 is not issued by
this DESIGN request. S04/HC/PHI/CV still open, no protection/facility delivered.

Applied guides: Rust type design TD05 MUST private representation; core Path
APIs preserve path identity. EH01/EH04 MUST recoverable typed errors: reuse
LyknError::Io and Language/Classify, no panics/string laundering. JS-Deno testing
ID04/08 MUST awaited/error assertions and Testing Discipline's behavioral floor
motivate exact runtime bytes and the SAME-predicate false-positive controls.
No new diagnostics/AST/cache/helper framework. Proposals remain uncompiled and
runtime outcomes UNOBSERVED pending explicit execution approval.
