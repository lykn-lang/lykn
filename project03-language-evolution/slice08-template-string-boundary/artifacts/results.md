# Slice08 Phase A — intake and source readback

## Assignment pins

- Planning prep: `38798f1468aed487f08b1676141696a2bc23c85e`, initially clean.
- Task source: `codex/template-string-boundary` at
  `b841f71b30eb2c3e340a651ae1d57de04fec3d79`, initially clean.
- `Cargo.lock` SHA-256:
  `672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`.
- Toolchain observed in the task checkout: rustc 1.97.0, cargo 1.97.0,
  Deno 2.9.6 stable (`aarch64-apple-darwin`, V8 15.0.245.2-rusty).
- Preserved prior task ref is `86d116db5c096d0fff7ec555d388343946114e4d`;
  it is reference history, not this baseline.

## Required guidance revalidated

Read the current planning and task `AGENTS.md`, the complete Slice08 prompt,
plan and ledger, and the required installed collaboration-framework roles /
Autonomous, project-management iteration / ownership, work-verification
independent-review, Rust AP-02 / ID-39, testing discipline / validation gates,
and JavaScript/Deno entrypoint, ID-31, and no-Node boundary. Current source
ownership is task-local; no source file or test expectation was changed.

## Normative contract and implementation readback

At task b841, `docs/guides/01-core-idioms.md` ID-33 (MUST, lines 1117–1134)
specifies cooked string escapes before code generation; Rust CLI and JS compiler
must receive the same value. The native reader `read_string` maps `\\n` to LF,
`\\r` to CR, `\\\\` to a literal backslash and `\\\"` to a quote
(`crates/lykn-lang/src/reader/lexer.rs:201–251`). The JS reader's
`readString` / `readStringEscape` implements the same source-to-value boundary
(`packages/lang/reader.js:61–101`).

Guide17 defines concat string arguments as template text segments and non-string
arguments as interpolations (`docs/guides/17-template-and-i18n.md:14–26`). Its
dispatch table selects ICU for a single literal with no slots, concat when
argument 0 is non-literal or a later argument is not a keyword, and ICU for a
literal with keyword slots (`:126–130`). Tagged templates receive the
post-expansion JS template literal (`:232–240`); the contract does not promise
the original Lykn lexical spelling as tag raw text.

Native `emit_template_text` currently escapes backtick and dollar but passes
backslashes through (`crates/lykn-lang/src/codegen/emit.rs:178–194`);
`emit_template` uses it for concat (`:1267–1284`), and ICU `emit_mft` uses the
same helper on literal segments (`crates/lykn-lang/src/codegen/icu.rs:727–755`).
The three existing direct-AST template tests in `emit.rs:2267–2304` inspect
printed source created from manually constructed string values. In particular,
the passthrough cases assert the backslash+n spelling in JS output; they do not
execute surface strings to establish runtime cooked values.

The JS compiler's `makeTemplateElement` creates template-element raw text after
backtick/dollar escaping and sets cooked to its input (`packages/lang/compiler.js:92–102`).
Both `templateConcat` (`:105–128`) and `emitMft` (`:234–266`) share it; the
tag path emits a `TaggedTemplateExpression` from that template AST (`:1408–1424`).
Thus AST/raw-cooked inspection and `compileBoth` structural convergence alone
do not establish runtime value preservation. Existing convergence and tag
tests were read whole (`test/forms/template-escape-convergence_test.lykn`,
`test/forms/tag_test.lykn`); their assertions are retained as historical/current
evidence, not elevated above ID-33.

History read: BACKLOG NE-C03, Slice07 CDC stop/review, and its source driver,
generated JS expected-output witness, and actual C5 receipt. The recorded child
process exited 0 with serialized JSON while the outer expected-output comparison
failed. The May16 C6b change (`f1f04a5...`) and D2 convergence test
(`fbab5a3...`) are competing implementation-era evidence; they do not displace
the normative cooked-value contract. The pilot is frozen and will not be rerun
in this diagnosis.

## Frozen diagnostic denominator and predictions (not yet executed)

The bounded set is six independent Lykn programs / 22 observations: P1–P5 each
print plain, interpolation, forced two-literal concat, and one-literal ICU
values for decoded code points respectively `[92,110]`, `[92,34]`, `[10]`,
`[13]`, `[92,96,36]`; P6 records raw results from existing `String:raw` tags
around the P1 forced-concat and ICU forms. Prediction is that plain values
follow ID-33, while template text may diverge if emitted JS reinterprets cooked
backslash sequences; interpolation alone should preserve the bound value. P4
distinguishes physical CR normalization, and P5 checks delimiter ordering and
whether generated syntax is valid. P6 reports actual post-expansion tag raw
text; equality with the original Lykn token spelling is not predicted.

No diagnostic source has yet been authored or executed at this point. No
observed values, compiler binary hash, case result, or test result is claimed.

## Baseline build and case freeze

The source-cited intake is commit `d920f31a177bdd15766b7399993ee68d9b0f90b4`.
From the clean task checkout at b841, `cargo build --offline --locked
--release -p lykn-cli` exited 0. Raw stdout/stderr and exact command are retained
under `artifacts/diagnosis/run-01/build/`. The resulting task-local `lykn`
binary is version 0.6.0, SHA-256
`e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8`.
The six case sources and predictions in run-01 were committed before any case
compile or execution.

## Actual run-01 observations

The six source modules each compiled once with the pinned default-strict CLI;
all six compile exits were 0. Each emitted module was copied byte-for-byte to
`artifacts/diagnosis/run-01/compile/P*.generated.js` before execution. Five Deno
modules completed with exit 0. P5 completed compilation but Deno rejected the
generated module with exit 1 (`SyntaxError: Expected ',', got <lexing error:
Error { error: (104..104, ExpectedUnicodeEscape) }>`); its four runtime values
are **unestablished**, not passing or recovered by retry. Thus 18/22 values are
observed and four remain unestablished.

| Case | Field | Observed value as Unicode scalar decimals | Result |
| --- | --- | --- | --- |
| P1 | plain | `[92,110]` | literal backslash+n |
| P1 | interpolated | `[92,110]` | literal backslash+n |
| P1 | concat | `[10]` | LF, differs from ID-33 input |
| P1 | ICU | `[10]` | LF, differs from ID-33 input |
| P2 | plain | `[92,34]` | literal backslash+quote |
| P2 | interpolated | `[92,34]` | literal backslash+quote |
| P2 | concat | `[34]` | quote, backslash lost |
| P2 | ICU | `[34]` | quote, backslash lost |
| P3 | plain / interpolated / concat / ICU | `[10]` each | LF preserved on all four paths |
| P4 | plain | `[13]` | CR preserved |
| P4 | interpolated | `[13]` | CR preserved |
| P4 | concat | `[10]` | CR becomes LF in template text |
| P4 | ICU | `[10]` | CR becomes LF in template text |
| P5 | plain / interpolated / concat / ICU | unestablished | emitted module syntax error before evaluation |
| P6 | `String:raw` concat | `[92,110]` | raw text is backslash+n |
| P6 | `String:raw` ICU | `[92,110]` | raw text is backslash+n |

Exact, unmodified child stdout is retained in each `runtime/P*/stdout.log`;
those lines are JSON serialization, while the table decodes each field to its
actual scalar sequence. P5's exact generated template witness is in
`compile/P5.generated.js`; its full Deno diagnostic and empty stdout are in
`runtime/P5/`.

### Existing direct-AST test results

Ran the three existing unit tests individually using `cargo test --offline
--locked -p lykn-lang <full-test-name> -- --exact`; all exited 0:

- `codegen::emit::tests::test_template`
- `codegen::emit::tests::test_template_backslash_passthrough`
- `codegen::emit::tests::test_template_icu_backslash_passthrough`

The exact argv and complete raw stdout/stderr for each test are under
`artifacts/diagnosis/run-01/kernel-tests/<test-name>/`. A separate `--list`
enumeration is preserved; it found the three named tests plus the tagged-template
and ICU error template tests, which were not run. These tests confirm the
current source printer's manually constructed AST output, including its
backslash passthrough expectation. They do not exercise the six surface-source
programs or execute the generated modules, so their green status does not
contradict the observed runtime losses.

## Interpretation and recommendation for CDC review

**Observed:** Plain strings and interpolation preserve the cooked Lykn values
for P1–P4. Both native template-text paths lose/reinterpret P1/P2 backslashes
and convert the P4 CR to LF. P3 LF is preserved. P5 establishes a separate
delimiter/backslash ordering defect: current emitted JS is invalid, so none of
its four values can be counted. `String:raw` returns the generated JS raw
template contents for the two P1 paths; it is not evidence of preservation of
the original source token bytes.

**Documented:** ID-33 is a MUST cooked-value contract. Both readers cook before
codegen. Concat and ICU use the same native `emit_template_text` helper, matching
the observed common losses. Guide17 defines tag input as the post-expansion JS
template literal. The existing C6b/D2 direct-AST/convergence evidence tests
printed-source shape, not the normative surface-source runtime contract.

**Inference:** The value mismatch occurs when already-decoded literal text is
inserted into JavaScript template raw source without encoding the JS template
escape-sensitive backslash and CR characters. In P1, the JS template cooks the
emitted `\\n` to LF; in P2 it cooks `\\"` to a quote; in P4 a physical CR is
normalized to LF. The same helper feeds concat and ICU. P5's invalid syntax is
consistent with emitting a cooked backslash adjacent to the separately escaped
backtick. This diagnosis is limited to these five payloads; no blanket claim
about all escape forms is established. The JS compiler source inspected has a
corresponding raw/cooked `TemplateElement` construction, but these cases execute
only the native CLI output; no JS compiler runtime result is asserted.

**Candidate repair direction, not authorized implementation:** encode cooked
text for the JS template-literal grammar (including backslash, CR, and
delimiter ordering) in the shared native/JS printing paths, then reconcile the
old emitted-text assertions with the MUST runtime contract. Preserve tag raw as
post-expansion JS raw text; do not promise original Lykn token spelling.
CDC should independently determine whether that narrow source-encoding
correction covers the frozen observer witness and whether any remaining public
tag/raw choice needs Operator disposition before assigning a repair iteration.
No production code, tests, expectations, or frozen observer were changed and no
pilot was run.

The complete command/exit/stdout/stderr receipts, emitted JS, case inputs, and
source/build pins are retained under `artifacts/diagnosis/run-01/`. Compiler
source remains clean at b841; planning work will be committed as a separate
diagnosis record with ledger statuses left open for CDC review.

## Iteration 01 changed-contract readback and baseline preservation

Read the complete iteration prompt and CDC Phase A acceptance. The binding
change is source representation only: native `emit_template_text(&str)` and
canonical JS `makeTemplateElement` must encode each decoded backslash as two
backslashes, CR as `\\r`, backtick as `\\``, and dollar as `\\$`; all other
characters, including LF, pass through. JS doubles original backslashes before
its existing delimiter/dollar escaping and keeps `cooked` equal to input. The
native helper signature and concat/ICU sharing remain. The embedded JS mirror
must equal the canonical compiler byte-for-byte. Existing native AST passthrough
tests and D2's contrary printed-text expectation are to be reconciled explicitly;
the tag smoke test remains, with raw now expected to encode the generated
post-expansion JS representation (`[92,92,110]` for P6), not the original
decoded Lykn value or token bytes.

The new Rust and public-JS regression tests must share the six frozen P1–P6
fixtures, run real strict compiler/runtime paths, and account for all 22 values.
Expected-red native and JS executions must be captured after the fixture/test
commit and before the implementation. No reader, AST, normalizer, dependency,
test-helper, or cache-policy change is authorized. Packaging validation must
use `make fresh-artifacts` and a new owned XDG cache; the embedded materializer
uses a version-only sentinel, so the pre-existing global same-version cache
will not be changed. The full unfiltered gate remains required.

Before rebuilding, the b841 task binary was copied from `target/release/lykn`
to ignored task `target/lykn/tools/lykn-b841f71b/bin/lykn`. Source and copy both
hash to `e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8`
and report `lykn 0.6.0`. Baseline identity, exact copy command, and verification
are retained at `artifacts/repair/run-01/baseline/identity.txt`. Current source
is clean at b841; lock hash remains
`672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`.

Iteration02 author-readiness correction: `.gitignore:8` matches `*_test.js`,
reserving that suffix for generated Lykn test output; repository hand-authored
JavaScript tests use `*.test.js`. The test-only commit remains preserved. Its
JS test body will move byte-for-byte to `test/forms/template-string-boundary.test.js`
in a separate commit, with the original expected-red receipt retained under the
old path and a new focused discovery/runtime receipt recorded at the corrected
path. No ignore rule or test behavior changes.

## Expected-red receipts — before implementation

The byte-preserved initial JS test commit is `920012afa4fd182e4619393e20a7af0a53e0382f`;
the author-readiness rename is `dc7e3ad0353d1e9ed46cbce06dda8f0383a77b46`.
The renamed file matches the original Git blob byte-for-byte (blob
`9d38ab06da5a249232e3805dc915e5af15cefd69`, content SHA-256
`19174f1b6cf847cbd0de1a45d85a12918c819e2735ef3c102c100e4083f5489a`).

Before implementation, `make fresh-artifacts` passed with the original b841
compiler. The focused native regression at source `920012a` exited 101 from its
expected test failure, not setup: all six fixtures compiled and executed; eight
field oracles mismatched (P1/P2/P4/P6 concat and ICU), while P5's child exited
1 on invalid generated JS and left four values unestablished. Ten of 22 values
matched. The JS test first run at the ignored old filename also exited 1 after
running its six child modules. After the byte-identical rename, the focused
`./bin/lykn test test/forms/template-string-boundary.test.js` selected the new
file and again executed all six child modules with the same eight mismatches
and P5 failure. Per-case `ok` labels mean the test's collector completed each
case; the final aggregate oracle failed, so this is actual JS runtime red.
Exact command, env, complete stdout/stderr, and exit records for old and new
JS paths and the native path are retained separately under
`artifacts/repair/run-01/expected-red/`. No red output was rerun or overwritten.

## Iteration 01/02 repair and green validation

The expected-red fixture/test commit is `920012afa4fd182e4619393e20a7af0a53e0382f`;
the content-identical handwritten JS test rename is
`dc7e3ad0353d1e9ed46cbce06dda8f0383a77b46`. The implementation is committed at
`a061c2149792178ba037d17a31220545e34b4ac1`. Its diff from b841 contains exactly
the thirteen authorized source paths (with `.test.js` replacing the initial
ignored `_test.js` path). The source tree is clean. All six fixture SHA-256
values are retained in the accepted case records; no fixture content changed.

The change encodes already-decoded text for JavaScript template source in both
native and public JS printers, in the same order: original backslash, actual CR,
then existing backtick and dollar delimiters. The native borrowed-string helper
and shared concat/ICU callers remain. The embedded compiler mirror is byte-for-
byte identical to canonical source. The first direct-AST backslash unit now has
two string literals (second empty) and therefore exercises concat; the separate
single-literal unit exercises ICU. The D2 printed-text assertion/comment and
stale tag-test deferral comment were reconciled without changing reader,
normalizer, or test helper code.

### Actual green evidence

On committed HEAD `a061c2149792178ba037d17a31220545e34b4ac1`, all focused green
receipts are captured with exact command, environment, full stdout/stderr, and
exit status under `artifacts/repair/run-01/green/`:

- Native `template_string_boundary` integration: exit 0, all six strict
  compile/runtime modules pass and all 22 Unicode-scalar observations match.
- Public JS `template-string-boundary.test.js`: exit 0, all six real child
  modules pass, including code 0 and empty stderr, and all 22 values match.
- Native template kernel selection: 3/3 tests pass; this includes separate
  concat and ICU backslash coverage.
- D2 `template-escape-convergence_test.lykn`: 1/1 passes.
- Tag smoke route: 3/3 passes.
- Accepted contract-predicate regression: 1 integration test passes with all
  17 frozen observations.
- `make fresh-artifacts`: exit 0. After the focused D2 route, canonical,
  embedded mirror, and freshly materialized package compiler bytes compare
  identical. All three SHA-256 values are
  `50db21ce3d1f30325e9541c284cb37ffdc3f6e93bad55521a26cd6b4734ac1f4`.

The native and JS green regressions each report the P6 raw fields as scalars
`[92,92,110]`, the post-expansion JavaScript raw representation. P1 cooked
values remain `[92,110]`. This verifies decoded-value preservation while
retaining the documented generated-source raw behavior.

### Full canonical gate

The unfiltered `make check` ran at the committed HEAD with a fresh task-local
`XDG_CACHE_HOME`, the accepted explicit `DENO_DIR`, no Deno update checks, and a
fresh task-local `npm_config_cache`. It included the cited-path gate and legacy
npm compatibility checks; it exited 0. The log reports 482 documentation/test
blocks passed, zero failed, and “All checks passed (build + lint + test).” Exact
argv/environment, complete raw stdout/stderr, and exit record are retained in
`artifacts/repair/run-01/full-check/`. No extra docs-test rerun was performed.

### Final source/tool pins and limits

- Source branch/head: `codex/template-string-boundary` at
  `a061c2149792178ba037d17a31220545e34b4ac1`, clean.
- `Cargo.lock` SHA-256 is unchanged at
  `672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`.
- Rebuilt `bin/lykn` and `target/release/lykn` both hash to
  `544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`
  (`lykn 0.6.0`).
- Deno remains 2.9.6 stable. The global same-version materialized cache was
  not modified; the fresh owned XDG materialization was verified instead.

This is CC implementation and gate evidence only. TE-02/03 remain open pending
CDC independent acceptance. No frozen pilot was run; TE-04/05 remain held.

## Iteration 03 — accepted-repair condition and predictions, frozen before runs

CDC independently accepted TE-01/02/03 and authorized only the original frozen
five-control pilot under the accepted 0.6 condition. Before any new compile,
bundle, or runtime invocation, I rechecked the clean source branch
`codex/template-string-boundary` at `a061c2149792178ba037d17a31220545e34b4ac1`.
The release compiler `bin/lykn` and `target/release/lykn` both hash to
`544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a` and report
`lykn 0.6.0`; `Cargo.lock` remains
`672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`. The
read-only native esbuild0.25.5 binary is
`/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`,
SHA-256 `b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`;
`/opt/homebrew/bin/deno` is 2.9.6 with SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`.

The unchanged source population was exported from planning commit
`30e97932dc2cabeaa243338f405a5b8fe6399c10`, path
`project03-language-evolution/slice06-native-esbuild-controls/artifacts/source`,
with four leading path components stripped into the fresh task-local
`target/slice08/pilot/run-01/experiment/`. The exact tar archive SHA-256 is
`55d6cd577fc6f003955b2f6d836ad60c0b84c6e715dc6352039bb1276ca12a32`; 22 files
were exported (five stimuli, ten library supports, one driver, five configs,
and the seven-byte data file). The data bytes remain
`5041bf1f713df204784353e82f6a4a535931cb64f1f4b4a5aeaffcb720918b22`.
No archived specimen, driver, support, config, or data file was edited.

The five predictions are unchanged from the accepted Slice06 protocol:

| Control | Frozen runtime prediction | Frozen graph/contribution/API prediction |
| --- | --- | --- |
| C1 | `BASE\n`, exit 0, empty stderr | No library identities in inputs, import graph, or output contributors |
| C2 | `{"x":1}\n`, exit 0, empty stderr | JSON value contributes; no YAML graph/contribution |
| C3 | `{"x":1}\n`, exit 0, empty stderr | JSON value contributes; no file/document/YAML graph/contribution |
| C4 | `init:effect\nentry:42\n`, exit 0, empty stderr | used/effect retained; unused-pure code absent and zero-contribution |
| C5 | Effect line then exact frozen JSON, exit 0, empty stderr | Nine declared public paths work; relevant implementations contribute; package bytes unchanged |

C5's frozen JSON values are `jsonRoot`/`jsonValue={"x":1}`;
`fileRoot`/`fileValue="{\"x\":1}"`;
`documentRoot`/`documentValue="document:{\"x\":1}"`;
`yamlRoot`/`yamlValue={"answer":42}`; and `usedRoot`/`usedValue=42`,
`deadRoot`/`deadValue=82`. The exact observer also checks all nine exports,
positive C5 implementation contributions, the seven-byte data input, and the
13-file before/after snapshot reconciliation. The archived YAML module remains
a one-input research stub; no broader fidelity claim is predicted.

The exact fixed runtime sequence remains C5-source-before, C4-source,
C4-bundle-run, C1-source, C1-bundle-run, C2-source, C2-bundle-run, C3-source,
C3-bundle-run, C5-bundle-run, C5-source-after. This is eleven calls across the
five archived controls, with five total bundles; C4 is a gate-only first
invocation and must be independently inspected/confirmed before any runtime.
Permissions remain exactly those in the accepted Slice06 command receipt:
outer Deno `--no-config` with scoped workspace/output reads, output write, and
only the pinned esbuild/Deno run grants; each child selects its staged
`project.json`, and only C5 receives the exact data-file read permission.

At this freeze point, the fresh experiment archive is exported but no compile,
dist, staging comparison, bundle, or runtime has run. New-run counts are 0/16
compiles, 0/15 staged comparisons, zero of nine export checks, 0/5 bundles,
and 0/11 runtime calls. The old Slice06 and Slice07 partial/failed conditions
remain distinct historical records; they are not counted as attempts in this
new accepted-source condition. Source, lock, driver, stimuli, permissions,
predictions, and protocols remain fixed. The next allowed work is strict
compilation and staging validation, followed by the C4-only gate.

### Fresh compile, staging, and C4-only gate

At the frozen condition, all 16 strict absolute-path compiles completed with
exit 0. The same compiler `dist`, `fmt --check`, `lint`, and `check` each exited
0; lint reported no findings. All 15 staged JS files compared byte-identical
to their direct compiles using the literal recipe paths `build/<pkg>/...` and
`dist/<pkg>/...`. The actual three staged package export maps match the frozen
maps: JSON has four keys, YAML two, effects three, for nine keys total. The
driver's exact 13-file public-before snapshot was captured, with individual
SHA-256 values retained. Complete per-invocation commands, exits, stdout/stderr,
all 16 frozen Lykn sources/generated JS, the 15 direct/staged witnesses, and
the export check are under `artifacts/evidence/pilot/run-01/raw/{compile,
build-gates,staging}/`.

The C4-only gate then ran once under the exact accepted outer Deno permissions;
the outer process exited 0 with empty stdout/stderr. The child esbuild receipt
also reports code 0. The complete command and receipt, C4 source, emitted JS,
bundle, raw metafile, gate observations, and before snapshot are retained under
`artifacts/evidence/pilot/run-01/raw/gate/c4-only/` and
`artifacts/evidence/pilot/run-01/source-witnesses/`. The actual 538-byte bundle
`raw/gate/c4-only/artifacts/C4.js` hashes to
`6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a`, the
frozen expected hash.

Complete source and code inspection identifies the expected C4 result. The raw
metafile resolves `effects/dead.js` (406 input bytes), but no dead-module row
contributes to the output. The complete bundle contains the effect initializer
(28 bytes), the `used` implementation (365 bytes), and the entry body; it has no
`unusedPure` declaration or body. The effects barrel resolves but contributes
zero bytes. `gate-observations.json` says `c4DeadResolved: true`, reports the
positive used/effect contributions, and lists no unexpected library identity.
The exported-source map is exact, and the pre-run 13-file/nine-key snapshot is
present. The result matches the prior accepted C4 evidence; no runtime was
invoked by the gate.

A first local Python command-construction attempt exited 1 on a syntax error
before launching Deno or esbuild. It is retained separately at
`raw/gate/launch-setup-error-01/`; it is not a bundle/runtime attempt and does
not change the denominator. There was exactly one actual bundle invocation:
current condition counts are 1/5 bundles and 0/11 runtimes. CDC independently
inspected the complete current C4 bundle, raw metafile, child receipt, frozen
Lykn/staged JS sources and observations; independently confirmed bundle hash
`6476e3082c6904e253caad9740d2463941b6f9ab49382a63a478f8ff5e433b8a`,
compiler hash `544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a`,
and the expected dead/used/effect attribution. CDC confirmed the C4 gate and
authorized the existing `controls <reviewedhash>` phase once. The next allowed
action is that exact controls invocation reusing this bundle; no other bundle
or runtime variant is authorized.
