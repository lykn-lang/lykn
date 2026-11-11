# IC-01 — emitted binding legality prerequisite

Root design against B1 candidate 3f197340, tree 9ee95765. This is a bounded
identifier-validation prerequisite inside S03, not qualified ADT activation.
**NOT SOURCE-READY: separate preparation review found source-role gaps in the
proposed gates.** B1 is independently accepted, but implementation is unissued
pending the revisions recorded below. All LC-02–08 obligations remain; this
work alone closes none of them. The original recipe below is retained as the
reviewed draft, not authority to implement its incomplete post-expansion walk.

## Observed defect and inspected paths

The accepted A cold CLI driver compiled successfully with a binding named
package, then Deno rejected its emitted const declaration. The original source,
generated output and process receipts remain in the A correction03 CDC archive;
the [owner preparation](local-owner-preparation.md#ic-01--reserved-binding-carryover-for-namespace-validation)
records that observation without treating a renamed probe as a compiler fix.

At 3f197340 both reserved-word tables omit package and several other module/
strict restrictions. The validators compare raw source names, while DD-49
emission normalizes them separately. The product parity test and hereditary
JS research matrix use deno check on a plain temporary .js declaration; their
candidate/sentinel population and tool result do not prove emitted ESM legality.
The product conformance test still calls await a legal shadowing name. These
are source facts, not completed runtime reproductions for every spelling.

Native compile and dist share validation::first_compile_validation_group;
compile.rs::validate_compile_forms wraps that group. However check_strict
duplicates the other validators without the reserved-name group. Public
expandWithMacroImports validates before Pass 0/1/2 only; public expandExpr has
no such validation. A macro-produced binder therefore needs a post-expansion
gate as well as the existing early source diagnostic.

## Policy selected by root

Keep the established D2 principle: source bindings must emit legal JavaScript
ESM identifiers. Diagnose invalid names; do not silently rename, escape a
keyword, change DD-49, or add a runtime parser/dependency. This is a correction
of the intended module target, not a new optional restriction or a style rule.

The finite RESERVED_WORDS set is the union of unconditional ECMAScript reserved
words, the strict-only identifier restrictions, and module await/yield. In
addition to the existing entries, add await, yield, enum, implements, interface,
package, private, protected, public and static. Strict modules do not make
async, as, from, get, set, of, meta, target or ordinary identifiers reserved.

eval and arguments are a separate strict BindingIdentifier restriction, not
keywords: reject them in value-binding positions, while allowing them as
labels and property names. Keep the shared table's is_reserved_word/
isReservedWord meaning as keyword membership, not a catch-all binding predicate.
Use BindingKind::Label / kind label for that distinction; labels still reject
normalized reserved words. Never apply this policy to every atom, member key,
object/data key or external imported/exported name. Validate the local name
introduced by an import alias, not its external property name.

The primary authorities are [ECMAScript keywords](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-keywords-and-reserved-words)
and [identifier early errors](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-identifiers-static-semantics-early-errors).
Executable module controls below are the toolchain oracle. Do not use the
existing await/yield sentinels to weaken the target or accept check success
as a runtime parse proof.

Compare the emitted spelling using the existing DD-49 converter. For example,
if! emits if and must be rejected as a binder, but an object member named if
is legal. Preserve the raw source span and spelling in diagnostics. Existing
direct-keyword diagnostic text remains unchanged. For a changed spelling,
explain both raw name and emitted reserved identifier. For eval/arguments use
a distinct strict-binding message. Suggestions append an underscore to the
source name; ensure the suggested spelling converts to a legal identifier.
This does not expand into Unicode grammar, duplicate-name resolution, lexical
collision detection, or qualified case/payload validation.

## Concrete implementation

1. Native binding.rs uses codegen::names::to_js_identifier at the validator
   boundary, preserving BindingSite identity/span and the shared walker.
   Keep is_reserved_word as the exact static table query. Use a small private
   restriction classification/helper if it keeps diagnostics clear; no public
   API result change is needed. Add direct, normalized and label distinction
   tests. In CLI check_strict, replace the duplicated validation blocks with
   the existing validate_compile_forms call, preserving group priority and
   classifier behavior. Compile and dist retain their shared gate.
2. Public naming must not introduce compiler.js -> protected-host.js ->
   binding.js -> compiler.js. Move the DD-49 tables and toJsIdentifier function
   unchanged into a dependency-free private packages/lang/identifier.js.
   Compiler imports and reexports the same function, preserving its real public
   export. Binding imports from that leaf. Do not duplicate the converter or
   add an optional hidden normalizer/context callback. Existing DD-49 tests
   remain the algorithm oracle; no mapping change is authorized.
3. Correct the public reserved table and binding validator under the same
   finite policy and raw/normalized/strict-binding diagnostic distinction.
   Keep the actual shared binding walker. Do not refactor source-role walks.
4. Preserve public complete expansion's early source validation and add a
   post-Pass-2 binding gate before host-reference support is materialized.
   Public expandExpr validates its input and its actual expanded result without
   adding Pass-0/Pass-1 behavior or re-expanding anything. Validate one form or
   returned form array using the existing representation. This catches actual
   macro-generated bindings while preserving B1 state isolation/private atoms.
   Raw compiler fragment/serialized-kernel APIs remain separate boundaries;
   this task does not promise arbitrary input-JSON validation.
5. Mirror identifier, compiler, binding, reserved-words and expander-core into
   the embedded package. Add no JSR entrypoint: compiler.js reexports the old
   name; identifier.js is a private relative dependency. Existing recursive
   copy and browser routes include it. Expand M6's actual nine-file union to
   ELEVEN, adding identifier.js and reserved-words.js. Keep all existing public
   materialized cases and add discriminating new product regressions there.

Current legacy type fields are emitted function parameters and remain subject
to actual binding legality. This is not the future qualified payload-key
contract: B2 must use hygienic generated parameter names where needed so legal
member keys remain legal. Do not weaken the accepted S01 member/data contract.

## Product tests and discriminating evidence

Use ordinary product JS/Rust tests for actual compiler regressions. New research
helpers or matrix/probe logic use Lykn only. Do not extend the hereditary
handwritten tools/conformance-matrix.js research harness. Preserve its old
evidence with an explicit invalid-oracle limitation; do not relabel it current.

- First reproduce the existing normal package-binding compile/run failure on
  the immutable baseline. Include actual default native compile, native check
  and public complete compile observations; record which route rejects or emits
  invalid output. Separately reproduce a normalized if! binding and a
  macro-produced restricted binding. Avoid making module-not-found or early
  reader/macro registration errors stand in for the observed defect.
- Repair reserved-words-parity.test.js into an actual ESM oracle: write .mjs
  with export {} and a binding declaration, run Deno with no-config/offline/
  no-npm/no-prompt controls, and assert actual status and recognizable parse
  error for negative controls. These files are bounded ordinary test fixtures,
  contain no imports or user code, and request no runtime permission. Compare
  Rust/JS tables exactly and separately test a fixed normative candidate pool
  including every newly added restriction plus legal sentinels, so a missing
  entry cannot hide outside the table being tested. eval/arguments are tested
  separately as binding restrictions, not added to RESERVED_WORDS.
- Correct conformance-corpus's await-as-legal expectation rather than skipping
  the D1 test: retain its legal form-name population and add actual module
  execution for representative valid shadowing. Keep await/yield syntax itself
  working in valid async/generator code.
- End-to-end native/public rejection controls cover package, if!, eval and
  arguments, legacy constructor names actually emitted as bindings, and a
  macro-produced binder. A legacy type's metadata-only name is not yet a
  runtime namespace binder; do not introduce that new rejection ahead of B2.
  Test the
  public expandExpr boundary separately. Assert diagnostic category/name and
  actual source span where exposed; defaults and stripped native compilation
  both reject, since binding validity is not a removable assertion.
- Existing binder-position parity remains green, with new normalized-name
  representatives for parameter, grouped bind, match/conditional, import alias
  and label sites. No huge Cartesian research sweep is required.
- Positive generated-ESM runtime controls cover reserved property/data keys,
  aliasing an external package/eval export to a legal local name, legal label
  eval/arguments, legal contextual names, and ordinary async/generator syntax.
  Use actual existing kernel interoperability syntax where labels/imports need
  it; distinguish those fixtures from default surface binding rejections.
- Run the same new public output regressions through M6's actual cold
  materialized lang mapping, along with all prior eleven cases and eleven
  canonical/embedded/materialized byte comparisons. Include browser compile
  rejection plus legal-output ESM execution without claiming eval-based
  run/load support. Full make check, committed cited paths and browser80KiB
  follow focused green tests; documentation runs once through make check.

Retain failures and exact pins; fixes to ordinary tests must prove the intended
module target instead of merely changing goldens. Actual counts are derived
from executed tests, not the populations or filenames above. No release
integration, publication, dependency, purity, nominal feature or row closure
is implied by this prerequisite.

## Preparation review — source-role prerequisites before issue

Separate Sol read-only review against immutable 3f197340 found concrete gaps;
root inspected the cited producer and walker paths. These are source-inspected
counterexamples, not executed IC-01 runtime observations. No source change or
IC-01 implementation assignment was issued.

1. **Lowered parameter roles are missing.** Public bindingsIntroduced's
   DECL_HEADS branch projects only the first argument of function/function*;
   arrow parameter lists are not projected. Native kernel_decl_names likewise
   projects a name slot only. A source macro can return an fn or function
   whose restricted parameter appears only after the existing early check.
   The draft's public post-Pass-2 walker would miss it after lowering. Adding
   parameter sites also affects D1 clients, so root must settle body versus
   enclosing scope and hoisting rather than adding names indiscriminately.
2. **Quoted syntax is data.** Existing binding walks recurse into quote while
   native expansion explicitly leaves quote untouched and public dispatch
   declares quote walk:none. The proposed normalization would reject quoted
   `(bind if! 1)` even though it creates no runtime binding. A revised walk
   must respect quote and the executable-depth rules of quasiquote/unquote;
   skipping every quasiquote subtree is not a general active-unquote proof.
3. **Object property pairs are structure.** classifier.js lowers
   `(obj :const eval)` to kernel `(object (const eval))`, with the pair marked
   as kernel. The generic binding walk then interprets the property pair as a
   const declaration and projects eval as a binder. It would falsely reject
   a legal property/value expression under the draft's new strict-binding gate.
   Properties need executable value/computed-key traversal without dispatching
   the structural pair as a declaration. Preserve imported external names and
   class/member structural roles under the same distinction.
4. **Bound form names are calls.** The new expandExpr validation must respect
   its supplied binding Set: `(bind eval 1)` with bind already in scope is a
   call, not an eval declaration. The complete expansion counterpart first
   binds bind to a function, then calls it. Current walkBindings starts with
   no incoming scope and only special-cases bound match; other tagged/ref heads
   can still reach bindingsIntroduced. Rejecting eval at that call would be a
   false positive. The revised role contract must use actual source lexical
   dispatch and preserve bound/tagged form-name positive controls, including
   the native resolver's corresponding binding identities.
5. **Nullary legacy constructors still bind.** Public typeConstructorNames
   currently projects list constructors but omits atom-form nullary ones.
   `(type Metadata package)` must be distinguished from `(type package Safe)`:
   the former emits a restricted value binding, while the latter's type name
   is currently metadata-only. The shared projection/gates must cover that
   distinction without pre-implementing qualified namespaces.

The finite table, strict BindingIdentifier versus label distinction and shared
DD-49 converter remain design inputs, not software claims. Root must finish
the actual source/kernel role contract and concrete shared API/callers before
issuing the numbered CC prompt. Keep the primary package observation, B1
acceptance, all LC rows and original qualified B/C scope intact. A source
presence/table parity test is not a substitute for the missing role proof.

Sol's final read-only readiness verdict found no additional gap in the finite
table/label policy, dependency-free converter extraction/reexport, check_strict
reuse, executable .mjs oracle or eleven-file delivery union. It does require a
narrow source-role correction allowance in place of the draft's instruction
not to refactor source-role walks. Finish that concrete contract, then review
and issue; do not implement the known-incomplete draft from this record.
