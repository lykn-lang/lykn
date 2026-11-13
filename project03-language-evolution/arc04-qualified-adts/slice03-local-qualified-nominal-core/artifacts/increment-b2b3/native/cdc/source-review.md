# Committed source review —759567f9

Source home/branch/pin/tree are in README.md and final/pin.txt. These citations
refer to that exact source, not the prior dirty pre-review snapshot.

- emitter/forms.rs3533–3734: PreparedParam retains pattern and checks;
  parameter_name allocates CompletionValueId only for discard. A prepared leaf
  is cloned as one identity into its definition and guard. Typed rest uses a
  different private element identity, in both loop binder and value check.
  Checks are omitted under stripping; private binder lowering still happens.
  Object `_` keeps its key through alias; default alias reuses the prepared
  local from its default node. Nested selectors remain data; raw array Skip
  is an elision. All five consumers (3748,3818,4033,4274,4339) prepare once;
  Lambda shares Fn. Old split reconstruction/check helper census has no caller.
- emitter/type_checks.rs31–71,193–211: public emit_type_check signature stays;
  private emit_type_check_value takes actual SExpr separately from display
  source_name. Both build_check and dynamic typeof operand use actual clones.
  Compiler host references remain typed private atoms, not source spelling.
- emitter/forms.rs2820–3008: lower only actual binder roles; preserve values,
  default RHS and object keys. Both array rest/spread targets recurse; bare `_`
  array member stays hole. emit_bind uses the same lowered scalar in const and
  guard; initializer/direct-return lowering remains exactly once and ordered.
  Existing literal and unsupported typed non-atom behavior remain explicit.
- emitter/forms.rs535–558,3035–3051: direct Bind/BindGroup export projects
  original source names/spans/pair order through shared binding helper before
  private lowering. Normal declarations/checks stay siblings; append names
  export, including empty export{}. Other wrappers remain unchanged and direct
  declaration extra_args remain ignored. No DTS/public backend change.
- binding.rs1122–1199: spread child1 and default required RHS apply only to
  BindingPattern excluding CatchBinding. TypedParameter and catch retain old
  extent. Callers include resolver754/1117, pass2:261, classifier admission and
  duplicates1359/1435, analysis271, export3046 and other role projections.
  Actual reserved-name/duplicate/source-call tests prove this shared client
  behavior, not only vector equality in unit tests.
- codegen/emit.rs377–476: pattern spread routes rest→pattern in generic and
  object doors; value spread stays on old expression writer. Unknown object
  LIST member reports exact typed Codegen diagnostic at member.span with alias
  suggestion. Generic assignment member fallback remains; catch still uses
  expression grammar. Final raw hole gets its required comma, without a value
  read; typed private leaf gets normal IteratorValue.
- analysis/mod.rs264–390 skips `_` only Bind/parsed callable leaf introductions;
  no global ScopeTracker exception. classifier/forms.rs1432 removes only the
  final empty-seen group rejection. Earlier non-atom admission and named
  duplicate errors remain. Type/schema constructor production is unchanged.
- tests/e2e_tests.rs220–302 replaces only e2e_export_bind. It asserts exact
  two-form native JSON; parses that actual JSON into native SExpr/codegen;
  compiles same source with actual packages/lang/mod.js lykn; executes both
  ESM modules and compares exact keys/value. No normalizer weakening, optional
  Deno skip, public production change or removal of other macro tests.

Independent bounded corpus query: `(spread` in crates/packages/test/docs/guides
contains value/call/CLI examples, protected_host.rs1491 atomic raw parameter,
and new canonical binding/assignment tests. Docs examples are value construction
and unchanged. Writer consumers include declarations, raw parameters, loops and
assignment; canonical nested pattern migration is intentionally codegen-stage.
No external-consumer absence or complete catch/raw discard parity is claimed.

Final901-line discard test was read fully. It runs actual Deno, no optional
skip; helper does reader→resolver→classifier→owned analysis→emit→native writer
without expansion. JSON helper actually serializes, parses protocol, native
writer and runs ESM. Namespace helper imports actual temporary ESM. CLI/M6
separately cover actual expansion/delivery. Distinct assertion populations and
runtime effects are retained in the final matrix.
