# Dirty18+19 implementation — independent read-only pre-review

Sol6.1High,2026-11-13. Baseline57c76c99cbed07ff992e78aac8afefa4bdf0b2ad,
treef044d795e88c3dac8e84a73a557cf071edd5327c; actual dirty authorized7path
snapshot inspected while Luna exclusively owns source/build. No tests/build/
source/Git/index/ledger mutation, code authoring or acceptance. Complete issued
candidate/pin and final content must be reread at clean handback. Root retains
design/planning ownership. Review actual code, not proposed-done attestation.

Snapshot SHA256 at reads (forms/binding/test unchanged at second SHA read):

| Path under crates/lykn-lang | SHA256 |
| --- | --- |
| src/emitter/forms.rs |4c601a020c45ba34340b8afd803e5eb0814ce19fe5558d6f9a71821318b3be5a |
| src/emitter/type_checks.rs |d121c7e1d890aa768577dae831ca9fd30915881840c68dc8cdeb6cb3d044a3d4 |
| src/analysis/mod.rs |ed2a5a708a42a0819873b95fe304c3b917a596e1e1c288fec1a5b99d4936942c |
| src/classifier/forms.rs |256af05072d7e64ad598c4f6b128f05de3a0db301e5f52c9b96669ef490de139 |
| src/binding.rs |5a78c183fdb1b1510f6787f08e8c7ea2d3360e2bb8bc599a6ab621bd4163567e |
| src/codegen/emit.rs |560291be3e3888f3a4960b92ae9483c58118d798bf3dbc52321981b8a2bb6a45 |
| tests/discard_bindings.rs |ebb8b11618f9218be336392d0f2145c96b31e23af1e0478b160eba56cf474dbf |

Tracked diffstat shows6modified product paths; new authorized test is untracked
at this pre-review, so absent from ordinary diffstat, not a path-scope mismatch.
Initial combined large diff read truncated; recovered complete new lowerer/
prepared code, other production changes, test harness and relevant oracles
through numbered direct reads before conclusions. No runtime observed here.

## Concrete source findings

**No concrete product defect found in this inspected snapshot.**

- forms.rs3538–3592 allocates a single private atom per discard typed leaf;
  PreparedParam retains pattern/checks together. Actual atom is cloned with
  its identity into check predicate and dynamic typeof (type_checks.rs56–94/
  193–211). Rest discard has distinct private collection and element, same
  element identity in loop/check and source `_` display label. Ordinary rest
  retains prior source-derived loop label. Stripped params still allocate
  discard storage but omit checks; all5consumers use one prepared set per
  signature/clause. No second reconstruction remains.
- Object `_` defaults extract the already-prepared storage from default node,
  preserve `_` key and original expression via alias optional default;
  non-discard/nested aliases retain selector data. Array Skip stays raw hole,
  typed `_` uses private value. Type constructors still use their original
  field-local/string-helper path, not prepared discard semantics. No broad
  source body/pre/post/default rewriting is present.
- Bind lowerer2894–3006 touches consumed scalar/object/array/default/alias/rest/
  spread binder positions, leaves expression/default RHS and keys alone, and
  keeps original source span on rebuilt consumed members. Unknown old tuple
  member is cloned, so new codegen migration error can point to its original
  span. Direct-return initializer path stays intact; scalar typed actual guard
  uses lowered storage, legacy typed-pattern limitation is explicitly retained.
- Export branch535 and collector3035 use original BindingSite names/spans/pair
  order, ordinary inner output followed by names export. Extra_args ignored
  only for direct Bind/Group as issued; other wrapper logic remains original.
  No private prepared atoms are added to public names. Empty source set gets
  existing export{} syntax; ordinary named typed checks remain siblings.
- binding.rs NEWspread/default extent is BindingPattern-only and CatchBinding-
  excluded. TypedParameter unchanged. Classifier removes only final seen-empty
  group restriction; original nonatom admission/typed-atom/real duplicates
  remain. Analysis skips `_` at actual Bind/callable typed introductions,
  not global ScopeTracker or Type/Constructor producer.
- Pattern-only spread delegates to rest→pattern in both writer doors; generic
  value spread unchanged. Unknown object LIST member has exact typed Codegen
  migration message, member.span and alias suggestion. Generic emit_pattern
  fallback still supports assignment-member targets. Trailing raw-hole comma
  implements one extra elision delimiter, not private typed-discard storage.

## Current test contract and remaining issued proof

Current helper is read→resolve→classify→owned analyze→emit→native codegen,
not actual expander/CLI; issued CLI gates remain separately due. JSON helper
really serializes complete emission, parses protocol back and runs nativewriter.
Deno process status and exact output are asserted. Module helper writes unique
ESM path, dynamically imports its namespace and removes it. Actual generator
advancement, typed got-type negatives, source foreign99/default/pre/post,
iterator step/value/close, nested multi default/rest, schema field `_`, private
collision/direct return/member call and context recovery oracles are present.
No optional runtime skip is used in the new test file.

Current tests inspect exact export namespaces/effects, typed good/bad/stripped
exports, simple object/array spread exports and ignored default export,
canonical nested spread actual local17 and corrected typed migration span,
unchanged value spread and legacy catch default callable8. These are source
oracles inspected, not independently executed review results.

Still-unfulfilled19 test contract in THIS snapshot (Luna is still completing
focused oracles; not a product HOLD or final candidate defect):

1. assignment_spread_patterns_keep_alias_bindings735 currently tests simple
   array first/rest only; it does not exercise an alias nor the preserved
   generic member target that revised19 explicitly requires.
2. Nested canonical alias/rest tests execute local named17 but do not put that
   nested pattern under inline export and assert exact resulting namespace.
3. Legacy catch `{default:array}` callable lookup is present, but distinct raw
   expression-object catch behavior required by19 is not yet represented.
   Binding unit tests cover names vectors, while issued actual reserved-name/
   duplicate/lexical spread projector controls still need meaningful coverage
   and the full binding/resolver/validation regression run.

Report these to root as in-progress coverage completion, not speculative new
scope or a reason to rewrite working product code. Root reported last failures
were test outerobject/array grammar and span-extractor mistakes; current source
fixture and original-member extractor now match canonical19 and are visible
in tests681–725. No independent runtime inference is made from that attestation.
Full18+19 controls, final exact pin/readback, one full+cold55/14+cites+size and
independent software review remain due. Prior accepted rows/limits and broader
public/raw/discard/name/owner/check/DTS/docs/LC02–08/S03 obligations stay open.
