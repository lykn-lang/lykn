# Isolate the consumed return macro witness

S14 refinement 01/5. Same Luna 6 High CC and Sol 6.1 High CDC,
standard Autonomous Mode. Old source `31893710` and frozen
tests `0a17dda5` observed native 23/26 and public 21/24 steps
with all five separate negatives green. Retain the native F1
nested return syntax, both F2 loop transfer failures, F3
native pass/public wrong exhaustion, and the independent F4
native raw-atom/public invalid-node failure. The latter is
quoted string type loss in the existing compiled macro
template, not the S14 lowering defect.

In only `test/fixtures/semantic-roles/return-consumed-macro-boundaries.lykn`,
replace its first line with

```lykn
(macro i2-return-body (early later) `(do (return ,early) ,later))
```

and change its only macro invocation to
`(i2-return-body "inside" "wrong")`. The exact expected runtime
bytes, nested function, conditional, untaken branch and real
macro-return boundary stay the same. This uses the existing
quasiquote/unquote grammar to carry original typed string AST
arguments rather than raw template string literals. No compiler,
runner, oracle or other fixture edits.

Retain exact prior freeze and per-case raw. Commit only this
fixture with the prepared body
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-macro-isolation-message.txt`.
Hold for independent static release. Then replay F4 alone with
the exact pinned native filter
`direct_return_macro_keeps_nested_function_boundaries` and the
public parent with its 24 steps and five negative tests. Distinct
fresh evidence roots and prospective receipts. The old F4 is
expected to reach real JS with both correct string literals,
and may pass the runtime oracle while retaining an IIFE. No
other native baseline repetition is required after the one
fixture-only source change. Hold production for CDC review.
