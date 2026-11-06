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
