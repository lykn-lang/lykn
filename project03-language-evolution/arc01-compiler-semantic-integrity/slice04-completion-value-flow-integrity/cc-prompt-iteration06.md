# S04 iteration 06 — preserve native binder occurrence identity

Continue the bounded NE-C14 prerequisite in standard Autonomous Mode.
Luna 6 High CC and Sol 6.1 High CDC. I1 is independently accepted at clean
`c202e55c20410f58c950343531f003cd6453650d`, tree
`871b78721e3ee221c7ca66433cc60a7e0691ff2a`, on the existing
`codex/completion-value-flow` task checkout. The release is d736.
This is the first implementation of the separately named prerequisite.
The existing four S04 refinements remain spent and the normal fifth
remains. Do not infer permission to implement I2–I4.

Read the [I1 review](cdc-verification.md), [actual baseline/cause](artifacts/i1-baseline-disposition.md),
the [ledger](ledger.md), source AGENTS, and iteration 01's tool/evidence
section. Inspect actual `binding.rs` enumeration and all callers,
`classifier/forms.rs` surface dispatch, type/func/genfunc/fn/lambda/genfn,
clause keywords, typed/destructured params, match/if-let/when-let patterns
and `parse_keyword_clauses`. Read resolver def propagation/scope adapters,
`expander/env.rs::protocol_json_to_sexpr`, and both integration fixture
tables. Apply Rust TD-05/06's private precise representation and
testing's actual same-span discriminator, preserving public AST/API and
unchanged generated/runtime tests. Read back scope, exact role positions,
oracles, fixed messages and limits. Wait for exclusive source/index/build
ownership and test-freeze review before dependent execution.

## Representation and source recipe

An occurrence is the actual atom node in the input tree. Span remains
diagnostic data. NE-C14 currently uses equal spans as identity in
`resolver.rs::resolve_form`, so the native macro protocol's default spans
misclassify the wrapper and unrelated control heads as definition atoms.

- Add crate-private `BindingOccurrence<'a>` with a borrowed `&'a SExpr`
  atom and existing `BindingKind`. Its projection yields the exact
  existing public `BindingSite {name, kind, span}` in existing order.
  Use the same implementation for `bindings_introduced` and private
  `binding_occurrences`. Preserve `walk_bindings`, reserved-name errors,
  shadow sites and `binding_names_in_pattern` contracts. For direct
  bind/group/loop/kernel declaration/catch/import/label/class shapes,
  have the existing extraction helpers record the actual atom at the
  existing slot. Do not add new grammar or value-binding scope.
- For classifier-owned forms, use a private optional capture sink in
  the same grammar, with a no-capture normal classifier wrapper.
  On genuine successful classification, return occurrences recorded
  from input atoms. On a failed grammar or a bound head, discard all
  sites. Route this through existing classifier dispatch rather than
  reimplementing raw grammar or reverse-matching names/spans. Function
  and type declaration names and constructor fields keep current
  kinds and ordering. Typed params record simple/default/rest leaves
  and nested destructured leaves. Skip/alias metadata retains existing
  projection behavior, including the current leaf-only `typed_params`
  policy. In match/if-let/when-let record only exact `Pattern::Binding`
  atoms, never constructor heads, wildcards or literal data.
- `parse_keyword_clauses` currently clones argument nodes. Return a
  private map of borrowed keyword-to-original-value slices, preserving
  last occurrence for repeated keys and every original segment rule.
  Parse typed params from the original `:args` slice. Clone actual
  `pre`, `post` and `body` only where existing public owned AST requires.
  Retain original spans, order, shapes and diagnostics. Preserve all
  grammar choices, including invalid/speculative branches, by recording
  only original atoms on the successful path.
- In the native resolver replace inherited definition spans with
  borrowed occurrence atoms. Use `std::ptr::eq` to compare borrowed
  nodes. Never dereference a raw pointer, mutate an input tree, use a
  synthetic source span or add serialized metadata. Keep normal name
  lookup and BindingDef-before-BindingRef priority. Reuse the current
  form's already-collected sites for its own `ScopePlan` body names
  where practical. Resolve, shadow and pass2 retain all existing scope
  decisions and C02 arms. In particular an equal-name initializer
  reference outside the new binding can still dispatch.

Allowlist `crates/lykn-lang/src/{binding.rs,classifier/forms.rs,resolver.rs}`
and the existing native/public semantic-role test files. No source change
to protocol, pass2, host policies, codegen, public JS compiler or release.
Both original and literal fixtures stay byte-identical. No new source
fixture, scope broadening, API migration or additional semantic stage.

## Frozen test population and actual oracles

Restore `if-direct-transfers` as an additional native positive case and
public step, alongside the accepted literal. Native uses a separately
named test and existing harness; public uses the same exact parent.
Native check and strict compile exit 0, optional DTS reported absent,
strict Deno exit 0, empty stderr, and exact `[7,9,[0,2],4]\n` on both.
Require a real `function select(flag)` declaration, braced return/loop
targets and outer else in complete generated modules. Existing literal,
F1/F2 and preservation oracles remain unchanged. Final population is
native 9 tests including the original four negative value positions
inside their one test, and public 1 parent/8 steps.

Add two focused existing-resolver tests named with prefix `same_span_`.
Use actual `expander::env::protocol_json_to_sexpr` on typed protocol
nodes for the forms below, so all synthetic spans really are the default
without a new reader or test harness. Existing atom-tag collector is usable.
Assert structure/span equality before separate exact tag assertions.

1. `(bind match (match 1 (_ 3))) (match 7)`: exact occurrence roles
   `bind Unresolved, match BindingDef, match Unresolved, _ Unresolved,
   match BindingRef`. In particular the initializer's same-spelling
   match head is an actual form, while the following head is a real call.
2. `(func run :args (:any ignored) :args (:any match) :body (match 9))`:
   exact roles `func Unresolved, run BindingDef, ignored Unresolved,
   match BindingDef, match BindingRef`. Require projected public sites
   `run Bind, match Param` in that order with default spans. Also use
   `(func broken :args (:any rejected))` as a same-test failed-parse
   control, with an empty projected site list. This discriminates
   original borrowed slots from clones, name lookup, structural
   classification and speculative capture.

Freeze only tests first using the fixed message. On old production c202e,
run the two exact private tests, exact original native witness and existing
public parent. Expected native original check/strict compile exits 0
followed by the preserved SyntaxError from the corrupt plain call, both
private assertions red, and public original green under I1. Capture actual
results and complete module before assertion. The d736 first failure
stays its own observed condition. Report differing actuals without
changing fixture bytes or design quietly.

## Execution and handoff

Use supplied exact normal Git messages `/private/tmp/lykn-d736-release-cdc.Gdv7dxje/c14-test-message.txt`
and `/private/tmp/lykn-d736-release-cdc.Gdv7dxje/c14-source-message.txt`. Use actual immutable source freezes,
fixed `-F`, no blanket index staging or hook bypass. After baseline
reconciliation, implement, format, mirror review and return exact
source for CDC static review before dependent gates. No public/embedded
compiler change is planned, verify their unchanged pair identity.

Repeat current native 9/public 1+8 and exact new private tests with real
build/no-run and binary identities. Then normal unfiltered `make check`
and standalone cited paths, independent CDC replay after clean ownership
return. Use original pinned tools, precreate unique TMPDIR/XDG/npm
roots before the named ancestor probes, and save durable outer launch
argv/cwd/scoped env/locators before execution. Keep raw child outputs and
complete generated modules. Pre/post producer pins belong to actual
used binaries; Make can rebuild. Do not reuse or overwrite earlier raw.
Use native CLI/filesystem or Lykn for evidence, no substitute scripts.

Return actual before/after outcomes, exact source/ref, named raw receipts,
proposed NE-C14 disposition and clean ownership. C02 accepted history
and earlier refinements remain. No I2 implementation, K, release merge,
push, publication, new dependency or next slice.
