# Predictions — committed before any CC run (ledger F-5)

**Written 2026-07-07, CDC static phase, derived from `inventory.md`.**
Must be committed in a commit that precedes the first `evidence/` commit.

Confidence is stated per row so divergences are informative, not
embarrassing. The named uncertainty running through the crux rows: whether
esbuild's tree-shaker removes *un-annotated* IIFEs whose bodies it can
prove side-effect-free. My training-data recall on esbuild's exact IIFE
analysis is genuinely uncertain — which is precisely what P2 settles.

## A. Per-fixture emitted-shape predictions (checked against P1 output + walker)

| Fixture | Predicted top-level shape | Walker findings predicted | Conf |
|---------|---------------------------|---------------------------|------|
| f01-bind | `const answer = 42;` `function computeLimit…` `const limit = computeLimit(21);` **`if (typeof limit !== "number") throw new TypeError(…)`** | 1 call-in-initializer + 1 effectful-statement (the if/throw, H3) | 0.85 |
| f02-func | two function decls + `export {…}` | **zero** | 0.9 |
| f03-type | `const Red = {tag:"Red"}…` + `function Point…` | **zero** | 0.8 (export-of-constructors syntax is the residual risk, not emission) |
| f04-match | `const label = (() => {…})();` (H1 IIFE); `describe` lowers match inside function body | 1 call-in-initializer | 0.85 |
| f05-cell | `const counter = {value: 0};` + `function bump…` | **zero** (cell decl is a plain object literal) | 0.8 |
| f06-threading | `const seeded = double(inc(5));` (H5) | 1 call-in-initializer | 0.85 |
| f07-template | `greeting` = template literal (pure); `itemsLabel` = ICU lowering, shape **uncertain** — conditional expr (pure) or IIFE (H4) | 0 or 1 call-in-initializer — prediction: **1**, conf 0.55; this row is the H4 probe | 0.55 |
| f08-import-export | named import, bare import, `const nine = inc(8);`, re-export | 1 bare-import (info) + 1 call-in-initializer | 0.85 |
| f09-macros | macros fully expanded at compile time; `const eight = 4 + 4;` `function quadruple…`; **no runtime trace of macros-impl** | **zero** | 0.75 (import-macros path resolution is the residual risk) |

## B. App-bundle shake predictions (checked against metafile/bundle)

Entry `app-main.js` imports only `used-func` from `app-lib.js`.

| app-lib item | Prediction | Conf | Reasoning / what divergence means |
|--------------|-----------|------|-----------------------------------|
| `usedFunc` | retained | 1.0 | imported + called |
| `unusedFunc` | **dropped** | 0.9 | pure function decl, unreferenced; if retained, something is disabling shaking globally (check format/metafile) |
| `Apple`, `Banana` | dropped | 0.85 | pure object-literal consts |
| `unusedCell` | dropped | 0.85 | `{value: 0}` literal |
| `unusedMatch` | **retained** | 0.6 | **crux row (H1).** const init is an un-annotated IIFE call. If esbuild drops it anyway, its IIFE analysis suffices and the PURE-annotation recommendation weakens to ICU/complex cases; if retained, PURE emission becomes the headline 0.7.0 recommendation |
| `unusedTyped` + its `if/throw` check | **retained** | 0.9 | H3: the top-level if/throw is an effectful statement referencing the binding; bundler must keep both |
| `helper` | **retained** | 0.85 | cascade: kept alive solely by `unusedTyped`'s initializer call — demonstrates H3+H5 transitive cost |
| `console.log(usedFunc(41))` in main | retained | 1.0 | user effect |

**Headline prediction:** the bundle is *partially* shaken — pure
declarations drop cleanly (validating the clean-ESM design), while the H1
IIFE and the H3 type-check chain survive as dead weight. Predicted
recommendation set for 0.7.0, in descending value: PURE annotations on
compiler-generated IIFEs/initializer calls; `--strip-assertions` (or
assertion-hoisting) as the documented dist default question;
`sideEffects: false` in dist `package.json` once the corpus scan supports
it; `lykn bundle` wrapping the existing esbuild machinery.

## C. Corpus-scan prediction (P3)

Findings will be dominated by (a) `effectful-statement` from test files —
top-level `(test …)` calls are the corpus's *purpose*, so interpretation
must segment test-shaped files from product-shaped modules — and (b)
`call-in-initializer` + H3 `if/throw` pairs in product modules that use
typed binds. Prediction, low confidence (0.5): product-shaped modules in
the compiled corpus average **≥1 hazard finding each**, i.e. today's
output is *not* `sideEffects: false`-clean without assertion stripping.

## D. Routing prediction (F-1, to be confirmed live by CC P1)

Default `lykn compile` = native Rust codegen; bridge path not invoked
(static evidence: compile.rs:204-214). Confidence 0.9; divergence would
mean a config/flag routing path unseen in static reading — record exactly
which.
