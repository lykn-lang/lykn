# Frozen E5 sibling-scope prediction

Source before edit: product commit `54608a7c463ea0386c9fade45d57d66da45050b9`; old E5 body is retained at `old-E5-at-54608a7.lykn` and has SHA-256 `5440850abf7cab981ddab36a82a3dc060be872625078837214df52f4ce105d77`.

The only fixture change replaces the enclosing-shadow setup with two sibling Do expressions that bind the same local name `scope-value`, once to `"outer"` and once to `"inner"`. Their sibling scopes should remain independent and yield separate outer/scoped values. This control does not claim enclosing-variable shadowing; that proof remains the original source and independently run old fixture from commit `54608a7`.

All remaining E5 throw, rejection, trace and untaken-branch source stays unchanged. The expected exact JSON remains:

`{"trace":["selected","await-selected"],"selectedMessage":"selected boom","rejectionMessage":"await rejected","outer":"outer","scoped":"inner","asyncValueMessage":"value boom"}`

The other four fixtures, both harnesses, product code and the original E5 oracle are unchanged. This prediction was frozen from the source contract before any check or runtime.
