# Correction05 source and prediction freeze

The only product-source change for this correction is E5's pair of same-name sibling Do bindings. Exact whole-body snapshot: `new-E5-frozen.lykn`, SHA-256 `0b4a02a9c67e7537fc8a3f88cf2a001387b925772a7c75fe79d23dd8bd499034`. It matches the committed source at `802bb223b341b5860fc2a0b7d2f2f77f17fbe499` byte for byte. The source file is `test/fixtures/async-expression-values/E5-effects-errors.lykn`.

Source-derived prediction, frozen before checks or runtimes: `prediction.md`, SHA-256 `a9dafe689b06b193c95b4a2fc26050ba8cc64482d6dc9962f0d058e66e3f0afa`. The exact expected E5 JSON remains `{"trace":["selected","await-selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner","asyncValueMessage":"value boom"}`. Other fixtures, harnesses, expected values, and product files are outside this correction's change.

`old-E5-at-54608a7.lykn` preserves the previous complete E5 body, SHA-256 `5440850abf7cab981ddab36a82a3dc060be872625078837214df52f4ce105d77`. The earlier original-shadow proof remains attributed to that old fixture on unchanged product commit `54608a7c463ea0386c9fade45d57d66da45050b9`; it is not evidence for this sibling-scope condition.

No runtime or check had run when these source and prediction snapshots were frozen.
