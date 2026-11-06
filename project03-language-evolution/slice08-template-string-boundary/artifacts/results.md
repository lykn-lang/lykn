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
