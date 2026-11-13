# S03 iteration14 — B2b1 owned native analysis unit

Issued2026-11-13 after separate Sol source-readiness against acceptedf9be7cb85f62513f1624964fcc6773bffe4f66fe,
tree0ea27d21f759e0c068e8f655b14f43a1a5f20452. This is a usable native API
foundation within B2b, not qualified/nominal activation or binding-hygiene
completion. B2a's four correction cycles and all failed records remain intact;
this is not another B2a retry. The complete S03/LC02–08 scope survives.

## Authority, intake and ownership

Operator2026-11-13 explicitly selects distinct Lykn spellings as distinct
binding identities (B2-ID-NAME resolved). Source lookup remains exact; emitted
JavaScript must eventually preserve identities hygienically. This increment
does not yet make the some-name/someName program return1. Do not claim it does.
Same Luna6High CC/separate Sol6.1High CDC, standard Autonomous Mode. Root owns
design/planning Git/index/ledger/status. Source/build transfers only after issue
to CC in `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch codex/qualified-adt-core; planning is
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. No release merge, push,
publication, remote action, new dependency or public feature flag.

No Python execution or Python/Ruby/Fennel/handwritten JS research/evidence/
orchestration/command helpers. Use Lykn for new helper logic; direct shell/CLI/
simple lifecycle and ordinary Rust/JS product tests remain allowed. No parity
exception. No amend/reset or blanket staging. Preserve every first failure.

Before dependent edits/tests, write actual loaded extents, source-query coverage
and source-cited contract readback in absolute canonical
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b1/cc/index.md`.
Required-full: this final prompt, source AGENTS.md. Required-sections: current
slice-plan/ledger, b2b-owner-unit-preparation.md native boundary and accepted
source-name policy, B2a final CDC verdict/limits. Prior A/B1/IC/B2-LX acceptance
is not permission to shrink original criteria. Load installed rust-guidelines
and testing plus applicable chapters; apply Rust TD02–03, API02 and EH01.
Recover truncation; required queries and read extents are separate claims.

Required source queries/read complete affected functions: analysis/mod.rs
AnalysisResult/analyze and every caller; emitter/mod.rs emit/emit_json and all
public callers; dts.rs emit_dts_module callers; both CLI compile paths/dist
error/warning/DTS behavior; all analysis/emission_results/cross_compiler/e2e
test fixtures receiving signature migration. Query source/docs for old API
examples and manual registry construction. Do not infer a caller census from
one crate or summaries. Read source Lykn guides when adding actual fixtures.

All product invocations record exact cwd/command/env/raw streams/numeric
status. Create XDG/npm/TMPDIR under `/private/tmp/lykn-b2b1-cc/` outside every
repo/config ancestor before first invocation; existing
DENO_DIR=/Users/oubiwann/Library/Caches/deno. No caches in canonical evidence.

## Binding outcome and exact native API

Current AnalysisResult exposes an independently usable TypeRegistry beside
diagnostics/has_errors; canonical emit and DTS accept unrelated forms plus
registry. Replace that pairing with one owned, immutable success unit.

In analysis/mod.rs (a small private submodule may be factored if needed):

```rust
pub struct AnalyzedUnit { /* private owned forms, registry, diagnostics */ }
pub struct AnalysisFailure { /* private diagnostic vector */ }
pub fn analyze(forms: Vec<SurfaceForm>) -> Result<AnalyzedUnit, AnalysisFailure>;
impl AnalyzedUnit {
    pub fn forms(&self) -> &[SurfaceForm];
    pub fn diagnostics(&self) -> &[Diagnostic];
    pub(crate) fn type_registry(&self) -> &TypeRegistry;
}
impl AnalysisFailure { pub fn diagnostics(&self) -> &[Diagnostic]; }
```

Both structs implement Debug. AnalysisFailure implements Display/std::error::Error;
Display renders existing error Diagnostics in order without losing spans or
suggestions. It retains ALL original diagnostics for inspection, including
warnings/info on failure. Successful unit retains every non-error diagnostic
in original order. No duplicate public has_errors flag. No public mutable/
from_parts/new/into_parts/registry accessor, DerefMut, Deserialize or compatibility
emitter overload accepting a separate registry. Do not add Clone or fresh
identity IDs just for anticipated use. The owned Vec is intentional API02
ownership: the unit stores it, avoiding a second whole-tree clone. No lifetime
parameter or ambient current unit.

Preserve the existing analyze collection/check/scope/prelude algorithm exactly;
only package its result. If any Severity::Error exists, return AnalysisFailure
and make no success unit accessible. Otherwise construct AnalyzedUnit privately.
Do not add owner lookup, new analyses, reclassification or macro execution here.
TypeRegistry remains its existing internal semantic representation and standalone
legacy helper type; this unit is not yet OwnerRef/CaseRef or a resolved nominal
graph. Public old AnalysisResult is replaced, not retained as a forgeable route.

Change canonical whole-unit signatures to:

```rust
emitter::emit(unit: &AnalyzedUnit, strip_assertions: bool)
    -> Result<Vec<SExpr>, LyknError>;
emitter::emit_json(unit: &AnalyzedUnit, strip_assertions: bool)
    -> Result<String, LyknError>;
emitter::dts::emit_dts_module(unit: &AnalyzedUnit, file_path: &str)
    -> (String, Vec<Diagnostic>);
```

Use the SAME borrowed unit for JS/kernel and DTS. Internal functions obtain the
matched forms/registry through immutable accessors. Do not alter serialization,
completion/host request/reference materialization, fallible channels, nested
classification error/span/suggestion propagation, actual output order or
strip behavior. Low-level emit_form/context and leaf DTS helpers retain their
existing signatures/contracts in this checkpoint; they are not canonical
whole-unit or owner-safe interfaces. Fully lowered kernel codegen remains
context-free. Keep their fragment rejection/recovery tests.

Migrate compile.rs compile_source/compile_with_dts and dist.rs to move classified
forms into analyze once, map AnalysisFailure diagnostics through their EXISTING
error adapters/text/filtering, preserve successful warning behavior exactly:
compile paths print Severity::Warning only; dist currently prints no analysis
warnings and only emits its existing DTS warnings. Do not add output there.
and pass one unit to emit/DTS. Preserve source filenames and write/error/artifact
behavior; do not reclassify for DTS. This checkpoint leaves check_strict and
dev preliminary classification unchanged: their eventual semantic-unit join
remains a named B2b obligation before owner activation, not a new analysis
behavior change smuggled into this API migration. No CLI option changes.

Remove manual registry-building loops in cross_compiler/e2e Rust pipeline
fixtures and prepare real units. Update analysis/emission tests to inspect
Result success/failure diagnostics and prepare valid units for whole emission.
Keep raw emit_form negative tests as raw fragment tests. Do not bypass failed
analysis, add a skip_analysis option, ignore diagnostics, weaken old goldens
or auto-update snapshots. A fixture invalidated by actual preexisting analysis
must be diagnosed from its purpose/source, preserved, and given a concrete
disposition before changing its language meaning. Root can resolve a clear
fixture issue under existing authority; no arbitrary public behavior is left
to CC. Initial source census finds cross fixtures are simple valid forms.

## Source-grounded proof and API audit inputs

1. Positive empty and ordinary bind units: prepare successfully, retain forms
   in order, emit valid checked/stripped kernel JSON/JS; warnings/info preserved.
   Existing nested Classify vs Codegen diagnostics and source spans remain.
2. A literal annotation mismatch `(bind :number age "wrong")` returns typed
   AnalysisFailure, with original error message/span/suggestion and any warnings;
   no unit can be passed to canonical emission from that Result. Recovery call
   prepares/emits normally without state leakage.
3. Prepare two independent actual source units with equal case spelling Entry
   but different owner/field definitions: `(type A (Entry :number left))` and
   `(type B (Entry :string right))`, each calling/logging its constructor.
   Interleave JS/kernel and DTS operations. Actual generated ESM and declaration
   content must retain each unit's own field/type and exclude the other's.
   Do not construct or inject TypeRegistry externally to fake this proof.
4. Add meaningful Rustdoc compile_fail coverage for private unit construction
   and the old independent forms/registry emitter call. Include a normal working
   owned-unit example. These prove API invariants, not just file presence.
5. Existing emission_results, cross/e2e, CLI compile/build/dist/DTS, A/B1/IC/
   B2-LX runtime/private/completion/fragment and cold materialization all remain.
   No public JavaScript production or browser behavior changes are intended.

Record actual removed/changed Rust symbols/signatures and their consumers in
the CC index for S06. Add accurate adjacent Rustdoc for the new public API;
avoid a broad guide/book rewrite before the planned audit. This is an
intentional0.6 Rust breaking API change under existing operator policy, not a
new source naming implementation. Remaining work explicitly includes binding
IDs/hygiene, typed owners/cases/field TypeRef, nested scope transport, private
public-compiler requests/finalization, coherent nominal activation, check join,
all full API/DTS/purity/consumer/docs/book/human gates. All LC02–08 stay open.

## Authorized paths, gates and handback

Production: crates/lykn-lang/src/analysis/mod.rs (and a justified small new
analysis/unit.rs if factored), emitter/mod.rs, emitter/dts.rs;
crates/lykn-cli/src/compile.rs and dist.rs. Tests:
crates/lykn-lang/tests/{emission_results.rs,cross_compiler.rs,e2e_tests.rs} and
appropriate in-module tests; existing CLI regression test files only if
necessary for real unit/DTS/artifact cases. Explain necessary extra path before
affected edit. No emitter/forms.rs/AST/type-registry algorithm or public JS/
embedded edit is expected. No unrelated formatter/fixture/golden migration.

Focused API/error/independent-unit/runtime/DTS gates first, then actual fresh
make check with docs once; cold M6 fourteen module comparisons/current derived
49 public cases, copied CLI/native macro/DTS and staged browser/public ESM
delivery. Full Make's exact cold M6 execution can satisfy that gate when inner
receipts establish it; no duplicate solely for a command name. After commit:
HEAD citations and80KiB gzip. Final source tree must have complete required
gates; preserve setup/oracle/semantic failures distinctly and don't run full
known-bad candidates. Separate Sol independently verifies substantive work.

Commit only inspected exact authorized paths with git commit --only. Use a
message file; verify literal contiguous Codex/Billo Co-authored-by trailers with
git interpret-trailers --parse before/after. Root alone commits planning. Return
clean committed source/build ownership with exact commit/tree/path inventory,
actual raw denominators, first/final attempts, API impact and limitations in CC
index. CC proposed-done cannot close any ledger row.

## Author readiness

Root inspected actual AnalysisResult/analyze algorithm and all rg callers,
canonical emit/emit_json and module DTS signatures, CLI diagnostics/output
adapters and complete emission_results/cross-compiler fixture shapes at f9.
Rust TD02–03 support an opaque ownership boundary; EH01 gives a typed failure;
API02's borrowed default is deliberately superseded where storing the owned
Vec avoids copying. Error channels and source behavior are preserved; no name
policy or runtime ABI is delegated. This first usable boundary precedes actual
owner activation and retains every original acceptance obligation. Separate
Sol read the complete draft/source and found no concrete contradiction. The
dist/compile warning asymmetry is explicitly clarified above; old emission
negative cases retain their actual diagnostic channels. Root issues under
existing Autonomous authority.
