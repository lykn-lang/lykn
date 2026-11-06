# Slice08 Phase A CC report — 2026-11-06

## Disposition

Phase A diagnosis is recorded and ready for CDC independent review. No
production, reader, test-expectation, observer, or frozen-pilot source was
changed. No pilot run or retry occurred. The slice and every ledger criterion
remain open pending CDC disposition.

## Evidence pins

- Planning prep: `38798f1468aed487f08b1676141696a2bc23c85e`.
- Source: `codex/template-string-boundary@b841f71b30eb2c3e340a651ae1d57de04fec3d79`,
  clean tracked tree.
- Lock: `Cargo.lock` SHA-256
  `672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce`.
- Baseline compiler: `lykn 0.6.0`, SHA-256
  `e69f67f4cbc8cda4b9a3a82436bd3375f277d68c45387dae7ac7fc2a9ba32ae8`.
- Compiler built with `cargo build --offline --locked --release -p lykn-cli`;
  exit 0. Rust 1.97.0, Cargo 1.97.0, Deno 2.9.6 stable.
- Intake commit: `d920f31a177bdd15766b7399993ee68d9b0f90b4`.
- Cases/predictions frozen before execution:
  `41fba58c8d0a99c851ae79093a82fd8c7990b7f6`.

## Actual outcomes

Six independent Lykn modules compiled with default-strict native CLI; all six
compile exits were 0. Five emitted modules ran in pinned Deno with exit 0. The
P5 generated module exited 1 with a JavaScript `SyntaxError` at emitted template
text. Therefore 18/22 values are established; P5's four are unestablished.

- P1 backslash+n and P2 backslash+quote survive plain binding and interpolation,
  but concat and ICU reinterpret/remove the backslash.
- P3 LF is preserved in all four fields.
- P4 CR survives plain/interpolation but becomes LF in concat and ICU.
- P5 syntax failure is consistent with backslash plus independently escaped
  backtick ordering; no value from the module is counted.
- P6 `String:raw` returns backslash+n for concat and ICU, demonstrating raw
  generated template text rather than a promise about original Lykn token bytes.
- The three assigned direct-AST printer tests all passed. Their asserted
  property is emitted text from constructed AST values, not surface-source
  runtime preservation.

See `artifacts/results.md` for exact observed code points, source-cited contract
and implementation analysis, the failed/unestablished denominator, and limits.
Complete compile/runtime/test argv, stdout, stderr, exit status, and generated
JavaScript are retained under `artifacts/diagnosis/run-01/`.

## Recommendation

The observations show a source-encoding mismatch with normative ID-33: decoded
string text is inserted into JS template literals where backslash escapes and
physical CR are interpreted again. The shared native text path serves concat
and ICU. Source inspection found analogous JS `TemplateElement` raw/cooked
construction, but this diagnosis executes only native compiler output. A
bounded repair should encode the cooked string for JS template grammar,
including backslash, CR, and delimiter ordering, then reconcile the older
emitted-text tests against the documented value contract. The tag
contract remains post-expansion JS raw/cooked template behavior; original
Lykn lexical spelling is not promised. This is a candidate direction for CDC,
not an implementation authorization or an assertion about untested escapes.

CDC independent replay/disposition is required before any repair iteration.
TE-01 remains open; TE-02 through TE-06 remain held/open. No runtime or pilot
criterion is accepted by this CC report.

## Iteration 01/02 implementation return — 2026-11-06

The scoped repair is committed at source
`a061c2149792178ba037d17a31220545e34b4ac1` on
`codex/template-string-boundary`, with a clean tracked tree and exactly thirteen
authorized source paths changed from b841. Fixture/test expected-red commit
`920012afa4fd182e4619393e20a7af0a53e0382f` and byte-identical filename rename
`dc7e3ad0353d1e9ed46cbce06dda8f0383a77b46` remain preserved. The old native
baseline binary is retained; no binaries are committed.

The focused native and public-JS regression suites each pass all six programs
and 22 scalar observations. Kernel concat/ICU tests, D2 convergence, tag smoke,
and accepted contract17 regression pass. Fresh embedded materialization matches
canonical and mirror compiler bytes. The full unfiltered `make check` and
cited-path gate pass at the committed source HEAD; full receipts are retained
under `artifacts/repair/run-01/`. `artifacts/results.md` contains exact run
details and binary, lock, fixture, and materialization pins.

CC returns this implementation for CDC independent review. TE-02 and TE-03
remain open until that review. Do not start the frozen pilot: TE-04/05 remain
held until the repair is independently accepted and the next authorized stage
is resumed. No source/specimen, dependency, reader, cache-policy, or frozen
observer change was made.
