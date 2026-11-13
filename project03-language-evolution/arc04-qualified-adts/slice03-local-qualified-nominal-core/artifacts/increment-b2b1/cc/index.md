# B2b1 CC intake and implementation record

Status: intake complete before product edits or test execution. This record is
in the canonical S03 planning evidence home; root retains planning Git/index/
ledger/status ownership. Product source/build ownership is exclusively CC for
iteration14 until clean committed handback. This is an attested CC record, not
independent CDC acceptance or ledger closure.

## Pin, authority, and boundary

Issued prompt: `cc-prompt-iteration14.md`, planning commit `d58e0af9`, read in
full through EOF (202 lines). Source `AGENTS.md` read in full (186 lines).
Source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`, was clean at `f9be7cb85f62513f1624964fcc6773bffe4f66fe`,
tree `0ea27d21f759e0c068e8f655b14f43a1a5f20452` before implementation. This
candidate is the B2b1 owned native analysis-unit transport, not a B2a retry,
owner activation, nominal behavior, source-name hygiene completion, or S03
closure. Operator resolved B2-ID-NAME to distinct source spellings as distinct
binding identities; this task does not implement JavaScript identity hygiene or
claim the some-name/someName program returns 1. `check_strict` and preliminary
dev classification remain unchanged; their eventual shared analysis-unit join
is still pending B2b.

Prompt mandates an owned immutable `AnalyzedUnit` success type and typed
`AnalysisFailure`, `analyze(Vec<SurfaceForm>) -> Result<AnalyzedUnit,
AnalysisFailure>`, and canonical emit/JSON/DTS consumers borrowing the same
unit. Analysis keeps the current registry/diagnostic algorithm. Failure retains
all diagnostics; success retains non-errors. Unit construction and registry
access remain private/crate-private. Compile paths retain warning printing;
dist retains no analysis-warning printing and its current DTS-warning output.
No separate forms/registry canonical overload, mutator, public registry accessor,
owner graph, name allocation, or new analysis is authorized. The low-level
fragment/form and DTS helper contracts remain as-is. Source filenames, artifact
writes, errors, output order, strip behavior, and diagnostic adapters remain
stable.

## Required planning/readback sources

- `slice-plan.md`: full 526 lines read (chunks 1–175 and 176–526). S03 and
  LC-02–08 scope remain open; this is an intermediate owned-unit boundary.
- `ledger.md`: full 15 lines read. This task does not close B2b or S03 rows.
- `artifacts/b2b-owner-unit-preparation.md`: full 290 lines read. It documents
  current borrowed `analyze` and separately supplied registry call sites,
  source-name identity resolution and later hygiene, and the public producer /
  finalizer and `check_strict` boundaries.
- B2a correction04 CDC `artifacts/increment-b2a/correction04/cdc/README.md`:
  full 292 lines read in chunks 1–100, 101–200, and 201–292. Its final
  independent verdict accepts B2-LX only; all B2b and LC-02–08 obligations
  remain. Carried runtime/host/private/completion and cold-delivery criteria
  remain applicable at this task's final gates, not inferred from API tests.
- `closing-report.md`: full 618 lines read, including final B2-LX acceptance
  and the later B2b carryover. Its earlier statements that B2-ID-NAME was
  unanswered are superseded by the iteration14 operator resolution; historical
  text is not rewritten.
- Iteration14 prompt and source `AGENTS.md`: full extents above.

There is no separate iteration14 manifest file in the issued S03 directory;
the issued prompt names the canonical evidence home and authorized paths.
Canonical raw receipts will be stored only under this `cc/` home. No product
command has yet run for iteration14, so there are no iteration14 command/status
receipts or failures to report at intake.

## Source-grounded caller and fixture census

At the clean assigned source pin, source line counts: `analysis/mod.rs` 1243,
`emitter/mod.rs` 387, `emitter/dts.rs` 658, CLI `compile.rs` 1205 and `dist.rs`
1196, `emission_results.rs` 238, `cross_compiler.rs` 163, `e2e_tests.rs` 317.
Relevant complete public functions/regions were read: `analyze` at
analysis/mod.rs:387–418; `emit` and `emit_json` at emitter/mod.rs:28–219;
`emit_dts_module` at dts.rs:201–300; compile source and compile-with-DTS paths
at compile.rs:150–304; package compile, analysis error mapping, emission and
DTS warning path at dist.rs:205–281. The complete integration fixture helpers
were read at cross_compiler.rs:1–68 and e2e_tests.rs:1–70; emission boundary
fixtures were read in full at emission_results.rs:1–238. Existing analysis
unit-test regions calling `analyze` were read around lines 630–1243.

A whole-source Rust/Markdown/Lykn query for `analyze`, `AnalysisResult`,
`emit_json`, `emit_dts_module`, canonical `emitter::emit`, `TypeRegistry`, and
`register_type` found production consumers only in the two compile paths and
dist. Direct analysis calls otherwise occur in analysis unit tests and one e2e
analysis test. The cross-compiler and e2e pipeline helpers each manually built
prelude/user TypeRegistry data before canonical emission; these are the two
integration fixture migrations. `emission_results.rs` manually paired empty
registries with whole-unit emit calls; its fragment `emit_form` cases still use
the raw helper contract. Other `TypeRegistry::default/register_type` hits are
internal analysis, prelude, type-registry, low-level emitter/form/DTS tests and
helpers; those are not canonical whole-unit consumers and remain unchanged.
One docs guide describes the existing Result/error channels but provides no
separate-registry invocation to migrate; the docs prose needs no expansion in
this checkpoint.

## Applicable guidance loaded

- Installed `rust-guidelines` skill: API02 (the task's required owned Vec
  storage is the deliberate exception to the borrowed-input default), TD02–03
  (strong types/invariant-bearing wrapper), EH01 (recoverable failure as
  `Result`), and DC01 / documentation guidance (document each new public API
  and make examples compile).
- Installed `testing` skill and Testing Discipline: prove observable API,
  failure, recovery and integration behavior; keep failures and denominators;
  use repository-native focused then full gates.
- Installed `work-verification` Evidence Strength: this is CC-attested work;
  independent source review is required before any ledger acceptance.
- Installed `collaboration-framework` guidance: preserve CC/source versus
  root/planning ownership and report proposed-done separately from CDC.
- Source-owned `skills/lykn/SKILL.md` front matter/introduction (lines 1–40;
  808 lines total) and `docs/guides/00-lykn-surface-forms.md` lines 1–180 read
  for valid source fixture conventions. Tests will use existing valid type and
  call syntax and retain the source-vs-kernel boundary.

## Authorized implementation and evidence paths

Expected production paths only: `crates/lykn-lang/src/analysis/mod.rs`,
`crates/lykn-lang/src/emitter/mod.rs`, `crates/lykn-lang/src/emitter/dts.rs`,
`crates/lykn-cli/src/compile.rs`, `crates/lykn-cli/src/dist.rs`. Expected tests:
`crates/lykn-lang/tests/emission_results.rs`, `cross_compiler.rs`,
`e2e_tests.rs`, plus appropriate in-module tests. Any extra path must be
justified before editing. No JS/embedded/browser, AST, TypeRegistry algorithm,
fragment API, docs/book rewrite, release, dependency, external action, or
planning Git change is authorized.

Before every product invocation, owned runtime/cache dirs are to be created
under `/private/tmp/lykn-b2b1-cc/{xdg,npm,tmp}`, outside every repository and
config ancestor. Existing `DENO_DIR` is
`/Users/oubiwann/Library/Caches/deno`. Each invocation will retain exact
command, cwd, environment, stdout, stderr and numeric status in this canonical
home; no cache/build tree will be stored here.

## Implementation and focused evidence

The implementation replaces public `AnalysisResult` with public, non-`Clone`
`AnalyzedUnit` and `AnalysisFailure`. Both derive `Debug`; the unit exposes
immutable `forms()` and `diagnostics()` while its registry accessor is
`pub(crate)`. Failure exposes all diagnostics, implements `Display` (rendering
only ordered errors with each Diagnostic's span and suggestion) and `Error`.
`analyze` now consumes and retains its `Vec<SurfaceForm>`, runs the same
collection/check/scope/prelude algorithm, returns failure if any error exists,
and otherwise returns the owned unit with the original non-error diagnostics.
No independent success state or registry can be constructed through the public
API.

Canonical signatures are now `emit(&AnalyzedUnit, bool)`,
`emit_json(&AnalyzedUnit, bool)`, and `emit_dts_module(&AnalyzedUnit, &str)`.
The JS/kernel and DTS paths read forms and registry from that same immutable
unit. Compile and compile-with-DTS move classified forms into one analysis;
both preserve the previous error adapter and Warning-only stderr behavior.
Dist likewise moves forms once, retains its existing path-wrapped invalid-data
analysis error, emits no analysis warnings, and continues printing DTS
warnings only when requested. `check_strict`/dev preliminary classification,
low-level `emit_form` and leaf DTS helpers are untouched.

Cross-compiler and end-to-end Rust pipeline fixtures no longer hand-build a
TypeRegistry; each analyzes its classified forms and calls canonical JSON
emission. `emission_results` prepares successful units for whole-module paths
and still uses standalone TypeRegistry only for raw fragment calls. New
coverage checks success/error diagnostics, spans/suggestion display, private
construction and legacy-call compile-fail rustdoc, and two independent `Entry`
units with different owners/fields. The test interleaves kernel, JSON and DTS,
checks ESM/DTS contain only their own field/type, and executes generated ESM
through Deno (A prints `3`, B prints `three`).

Changed canonical source paths (8 total; all authorized):

- `crates/lykn-lang/src/analysis/mod.rs`
- `crates/lykn-lang/src/emitter/mod.rs`
- `crates/lykn-lang/src/emitter/dts.rs`
- `crates/lykn-cli/src/compile.rs`
- `crates/lykn-cli/src/dist.rs`
- `crates/lykn-lang/tests/emission_results.rs`
- `crates/lykn-lang/tests/cross_compiler.rs`
- `crates/lykn-lang/tests/e2e_tests.rs`

Focused raw receipts under `raw/` retain exact command, cwd, owned environment,
stdout, stderr and status for invocations. Chronology and outcomes:

1. `focused-analysis`: status 101, authored test compile error because
   `SurfaceForm::span()` does not exist. Corrected test uses the parsed SExpr
   span; raw first attempt remains unchanged.
2. `focused-analysis-retry01`: status 0; 22 analysis tests passed, including
   failure diagnostic/warning/suggestion/span and successful warning-retention
   tests.
3. `focused-emission`: status 0; 9 emission boundary tests passed before the
   actual-runtime assertion was added.
4. `focused-pipeline`: status 0; 22 cross-compiler and 18 E2E tests passed.
5. `focused-rustdoc`: both commands status 0; 7 emitter unit tests, 2
   rustdoc examples and 2 compile-fail examples passed.
6. `focused-emission-runtime`: status 0; all 9 emission tests passed with the
   Deno execution of generated ESM for independent same-name constructor units.
7. `focused-cli`: status 101. CLI and other package tests passed except two
   `lyk_runner_kernel_only` tests, which correctly rejected stale `./bin/lykn`
   (`stale compiler binary: ./bin/lykn is older than crates/ sources`). This
   was a materialized binary precondition, not a source/API failure. Fresh
   `make check` rebuilt artifacts and all workspace tests passed.
8. `focused-cli-library`: status 0; 99 CLI library tests passed.
9. First `format-check`: status 1, only rustfmt differences in changed files.
   First `format-retry01` ran `cargo fmt --all`, status 0 printed by shell; its
   status-file path had a typo, so status was recovered retrospectively from
   that exact output and recorded in `status-provenance.txt`. After the final
   runtime/doc edits, `format-final` (`cargo fmt --all`) status 0 and
   `format-check-final` (`cargo fmt --all -- --check`) status 0.
10. `full-make-check`: one `make check`, status 0. Raw summary: 1199 native
    `lykn-lang` library tests; 1557 product cases across 67 Deno steps; docs
    generated 22 files containing 482 blocks (15 skipped); final marker
    `All checks passed`. This included fresh release binary/build artifacts,
    full Rust workspace tests, product suite and docs once. The newly added
    `emission_results` test is in this full population.
11. `m6-cold`: focused replay after full check, status 0, test
    `m6_embedded_compiler_payload_matches_canonical_and_runs_from_cold_cache`
    passed. The child copied CLI compiled from a standalone cwd, began with
    absent owned XDG extraction and no `standalone/packages/lang` fallback,
    and emitted generated JS. Fourteen per-module canonical/embedded/
    materialized byte-equality receipts are present. Child strict public Deno
    command/config/output/status are preserved; it explicitly reports
    `ok | 49 passed | 0 failed` (derived 5+6+17+21 tests), using materialized
    `lang/` and the staged browser adapter. The workspace browser artifact had
    just been rebuilt by full `make check`; this is a cold compiler-XDG and
    copied-CLI test, not a whole-workspace-cold claim.

The full `make check` log establishes its embedded M6 test passed in the
14-test macro-dependencies integration suite. `m6-cold/` separately captures
the inner child commands and exact 49-case output that the full make log itself
does not print. All test/setup failures above are preserved distinctly; no
expected output or golden was changed to make a failure pass.

## API/S06 impact, post-HEAD gates, and handback

The public native API change is deliberate and breaking:

- Removed public `analysis::AnalysisResult { diagnostics, type_registry,
  has_errors }` and its `Clone` route.
- Changed `analysis::analyze(&[SurfaceForm]) -> AnalysisResult` to owned
  `analysis::analyze(Vec<SurfaceForm>) -> Result<AnalyzedUnit,
  AnalysisFailure>`.
- Added immutable `AnalyzedUnit::{forms, diagnostics}` and
  `AnalysisFailure::diagnostics`; registry remains an internal field with only
  `pub(crate) AnalyzedUnit::type_registry` access for whole-unit consumers.
- Changed canonical `emitter::emit`, `emitter::emit_json`, and
  `emitter::dts::emit_dts_module` to take only `&AnalyzedUnit` plus their
  existing options/path. No compatibility overload accepts independent forms
  and registry. Lower-level APIs keep their old contracts.
- Migrated native callers in `compile_source_inner`,
  `compile_source_with_dts`, and package `compile_lykn_sources` in dist. Both
  compile warning paths still print analysis warnings only; dist still prints
  no analysis warnings and only its existing DTS warnings. Error messages
  continue to filter/format error diagnostics through the old adapters.
- Migrated the `cross_compiler` and `e2e_tests` pipeline helpers from manual
  prelude/type registration to real analysis. `emission_results` uses real
  units only for canonical whole-module emission while preserving raw fragment
  tests. Internal registry algorithms and test consumers outside the
  canonical API remain unchanged.

S06 should audit the new public types and signatures, constructor/accessor
privacy, the intentional owned-input migration, rustdoc compile-fail evidence,
all downstream native API consumers, and continued separation of `check_strict`
from this first API checkpoint. This candidate implements no owner/case graph,
name hygiene, nominal activation, new analysis, purity, `check_strict` join,
DTS finalization, public JavaScript, or book/docs migration. B2b and LC-02–08
remain open; this is not ledger acceptance.

Post-commit gates ran against the committed source HEAD `d787231ae2f8b9dc9fabf347897b9551e0d161f0`:

- `make check-cited-paths`: `raw/posthead-citations`, status 0, 64 documents
  and 601 historical citations accepted on `codex/qualified-adt-core`.
- `make bundle-size-check`: `raw/posthead-size`, status 0. Freshly built
  `target/lykn/build/browser` measured raw 361,569 bytes, minified 172,901,
  gzip 46,600 bytes, below the 81,920-byte budget by 35,320 bytes. Baseline
  gzip was 27,630; delta is +18,970. Existing esbuild/astring package-condition
  warnings are retained in stderr and were non-fatal. No source/dependency
  manifest changed.

Commit inspection: commit `d787231ae2f8b9dc9fabf347897b9551e0d161f0`, tree
`4cd8c07343f868e0cfbdc400912a8f2d29198993`, subject
`B2b1: bind native emission to analyzed units`. It contains exactly the eight
authorized paths inventoried above. The prepared literal message and
`git interpret-trailers --parse` output were checked before commit; the
committed message was checked afterward and contains exactly contiguous
`Co-authored-by: Codex <noreply@openai.com>` and
`Co-authored-by: Billo AI <ai-engineering@billo.systems>` trailers. Source
branch `codex/qualified-adt-core` has no tracked, staged, or untracked changes;
`git diff --exit-code` and `git diff --cached --exit-code` pass. No build/test
job remains active. Source/build ownership returns to root for the separately
assigned Sol software review. CC status is proposed-done only.
## Test-only registry-sensitive oracle follow-up and final source pin

After the first commit and full check, root review asked the existing
independent `Entry` units to consume constructor metadata through a pattern
match, because direct constructor emission/DTS field rendering could pass while
not actually consulting the registry. The one fixture now logs
`(match item ((Entry value) value))` for both A:number/left and B:string/right;
production files were not changed. Each successful run still verifies isolated
ESM/DTS/JSON text, and the actual ESM outputs remain `3` and `three`.

The follow-up is a distinct, explicit one-path commit, not an amend:
`cf4326224ccfd992cf9abf6f9f943375c5305fb0`, tree
`27419cb322612374e036e14ea7e469243cf75eeb`, subject
`B2b1: prove matched type isolation across units`. Literal and parsed contiguous
co-author trailers were checked before and after. `raw/focused-emission-match-retry01`
records status 0 and all 9 `emission_results` tests passed with actual Deno
execution. `raw/format-check-followup` status 0. The committed tree remains
clean. Thus full `make check` at d787231a is a successful pre-follow-up
production/test snapshot; it did not include this last test-only fixture delta.
The independently assigned Sol must run fresh final-source `make check` on
cf432622 before any software acceptance.

Final-HEAD `make check-cited-paths` is status 0 (64 documents/601 historical
citations) in `raw/finalhead-citations`. Final-HEAD `make bundle-size-check`
is status 0 and repeats the same browser size (361,569 raw, 172,901 minified,
46,600 gzip; 35,320-byte headroom) in `raw/finalhead-size`; the browser build
was freshly materialized by the preceding successful full gate and the
follow-up changed only a Rust test fixture. Final source/build ownership is
returned clean at cf432622; the task remains proposed-done pending Sol review.
