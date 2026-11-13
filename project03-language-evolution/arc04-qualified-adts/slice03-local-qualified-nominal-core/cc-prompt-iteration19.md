# S03 iteration19 — keep native discard storage out of exports

Issued2026-11-13 after independent source-readiness. This refines issued
cc-prompt-iteration18.md within the same native B2-DISCARD-N checkpoint.
Source baseline remains57c76c99cbed07ff992e78aac8afefa4bdf0b2ad/
treef044d795e88c3dac8e84a73a557cf071edd5327c on codex/qualified-adt-core at
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering. Luna's
in-progress dirty18 changes in its six authorized paths are expected and
retained, not another contributor's edits or an accepted candidate. Luna owns
source/build; root owns design/plans/Git/index in the separate planning
worktree. Same Luna6High CC and separate Sol6.1High CDC, standard Autonomous.
No release/merge/push/publication/remote CI/new dependency/licensing action.

## Why a new assignment

Root's read-only integration review found emitter/forms.rs534's Surface Export
wrapper applies `export` to EVERY form produced by its inner Surface form.
With discard lowering, `(export (bind _ effect))` would export generated
private storage. Mixed groups and typed bind checks also cannot be blindly
wrapped as declarations. This is a concrete source-inspected path, not yet a
runtime claim. CC18's full gate/commit is held so the known hole is fixed before
the one final full run. Preserve18, its first compile failure, six-test success,
all current work and subsequent focused attempts. No user policy question is
reopened; an export introduces only the source bindings its declaration owns.

## Binding export contract and concrete recipe

For SurfaceForm::Export whose direct inner form is Bind or BindGroup:

1. Collect the actual SOURCE binding sites from the original Bind name or each
   BindGroup name in pair order using existing binding_names_in_pattern with
   BindingKind::Bind. That projector excludes `_` and distinguishes object
   property selectors from local names. Do not use raw atom scanning or
   ParamShape::bound_names. Reconstruct the source named-export atoms with
   their original spans; existing JS normalization still applies. Distinct
   source-name runtime hygiene remains its own open prerequisite.
   First repair its concrete consumed-role gap in binding.rs:
   pattern_occurrences_with_grammar must recognize inner `(spread local)`
   as a binding in BindingPattern grammar for BOTH object and array shapes
   AFTER unifying the binding writer below. Like rest, use child1;
   skip `_`. Keep TypedParameter grammar unchanged. For BindingPattern
   `(default local value)`, project its local only when the required value
   child2 exists: the actual writer emits no binding for underfilled default.
   Existing alias/rest missing-local handling already yields no site; retain
   all other actual consumed roles and ignored extra operands. No new malformed
   syntax support or broad rejection policy. This necessary source projector
   parity serves validation/resolution as well as named exports; test it in
   binding.rs and through actual runtime/module consumers.
   Isolate these NEW spread/default-extent rules from CatchBinding: use the
   existing typed BindingKind::CatchBinding role to preserve its old projection
   unchanged. Do not introduce a global flag or claim catch parity. Its writer
   still uses expression grammar. `(catch (object (default array)) ...)` really
   binds array as `{default:array}` today; removing that site could redispatch
   a caught callable as a kernel form. TypedParameter and CatchBinding keep
   their previous projection; other BindingPattern sites match the canonical
   pattern writer. Catch repair remains a separate open obligation.
   In codegen/emit.rs, make binding/assignment-pattern `spread` use the existing
   emit_rest_pattern→emit_pattern route, both emit_pattern's spread dispatch
   and the object-pattern spread arm. Value-position emit_spread/emit_array/
   emit_object remain unchanged. This intentionally replaces the accidental
   expression-object tuple grammar under a nested spread with the existing
   canonical pattern grammar: `(array (spread (object (alias source named))))`
   denotes `[...{source:named}]`. Array `_` holes keep pattern meaning there;
   source discard preparation already recurses into spread binding targets.
   Do NOT implement an expression-grammar name collector or silently support
   two incompatible pattern grammars. Native generic pattern rendering also
   serves assignment LHS, raw callable parameters, declarations and loops;
   account for their shared effect and test assignment explicitly. This is
   a bounded intentional0.6 pattern consistency repair, not public parity or
   complete raw scalar discard acceptance.
   Under emit_object_pattern, an unrecognized list member must now return a
   typed LyknError::Codegen diagnostic at that member span with message
   `object pattern member must use alias, default, rest, spread, or a shorthand field`
   and an alias-form suggestion. This gives old nested spread
   `(object (source named))` a clear migration error, not rc0 invalid JS.
   The diagnostic is at the JS codegen boundary; emit_json may serialize the
   kernel before that boundary and check semantic join is still open. Do not
   claim earlier rejection that was not implemented/tested.
   Keep underfilled recognized helper consumption and value-object tuples
   unchanged; do not reject ordinary assignment member targets globally in
   emit_pattern's expression fallback.
2. Emit the inner form normally through the now-prepared18 binding path. Keep
   its complete declarations, direct-transfer support, initializers and guards
   as ordinary sibling statements in EXACT original order. Do not wrap those
   individual statements in export, remove checks or duplicate evaluation.
3. Append one existing emit_exports(source_names) form. Thus source bindings
   are live exports, while private support/storage is not exported. Empty
   source_names deliberately yields `export {};`: discard-only inline export
   still evaluates its initializer/checks and marks module intent, but creates
   no public `_` or generated-name export. This is not a new error/restriction
   or a new source binding. Mixed discard/named exports expose only named
   source bindings. Default expressions and schema/property `_` keep roles.
4. Leave all other Export inner kinds and raw kernel export/default/import/
   reexport forms on their existing paths. Direct Bind declaration's extra_args
   are ignored as by the current codegen emit_export declaration branch; do
   not start evaluating/redispatching these previously unconsumed operands.
   Do not reinterpret async(Bind) or other previously invalid wrappers as new
   supported grammar. No public Rust signature or JS compiler change.

Use a small private collector/helper or local match, not a new export subsystem.
The existing projector and emit_exports already supply the needed boundaries.
General export alias/name hygiene and API/DTS work remain open. In particular
emitter/dts.rs94 still uses source simple parameter names, and212–239 emits
inline Bind declarations by original name: discard-aware DTS is follow-through,
not proved by this runtime/source checkpoint. No release readiness follows.

## Runtime proof and existing obligations

Extend ordinary product discard_bindings.rs tests through the actual canonical
pipeline and real ESM import/namespace inspection. Existing test helpers or
ordinary Rust test fixture construction/Deno runtime code are sufficient; no
new research/validation harness or public compiler API.

- Inline scalar discard-only export: exact empty namespace, foreign `_` stays
  visible, initializer runs once. Require no public generated temporary.
- Mixed grouped discard/named binds: exact named keys/values and once-only
  initializer order. `_value` is an ordinary exported name. Multiple discard
  slots never become exported locals. Named object aliases preserve the property
  `_` while exporting only their local name; destructured discard/named fields
  expose only actual named bindings.
  Object/array `(spread rest)` exports must retain the ordinary rest binding;
  underfilled object `(default absent)` must not invent an export absent from
  the actual emitted declaration. Reserved-name/duplicate/lexical controls
  demonstrate the shared projector remains a source-role component rather
  than an export-only name allowlist. TypedParameter grammar is unchanged.
  Nested canonical spread/object aliases and nested array patterns retain exact
  exported names/values. Old expression-object tuple pattern syntax gets the
  new typed migration error; the same tuple in a value spread still executes
  unchanged. Actual assignment-pattern aliases/rest and ordinary member target
  assignment remain valid. Preserve legacy catch `{default:array}` callable
  lookup and raw expression-object catch behavior, without claiming catch
  discard completion. Record source/corpus migration census across codegen,
  binding, tests and docs (all relevant spread occurrences, then actual binding
  contexts), not just one generated-string assertion.
- Typed nonliteral discard export: valid value executes effects/check once;
  bad value rejects with actual TypeError/source `_` label, not invalid `export
  if` syntax. Stripped output keeps effects and excludes checks/private exports.
- Ordinary named inline typed Bind export retains actual named export/value and
  guard; function/default/type raw export regressions stay on existing routes.
- Actual emit_json→reader/codegen output preserves the same export namespace,
  effects and errors. Use real ESM execution, not solely a substring for names.

Complete ALL18 runtime/diagnostic/CLI/fragment/private controls as well; its
first six tests are not the full denominator. After focused completion, run
one final make check, M6 actual55 cases/fourteen comparisons with the existing
evidence hook, then exact-source commit, finalHEAD citations and fresh browser
81920-byte gate. Do not repeat docs separately. Missing runtime is failure.
Keep unsupported/nonatom grouped/top-level simple multi/public/raw/check/DTS/
owner/source-hygiene/LC02–08 follow-through explicit, not silently closed.

Required-full: this prompt, issued18 (already loaded in continuing CC context),
current slice-plan and ledger, source AGENTS, independent19 export readiness
at artifacts/increment-b2b3/cdc/native-discard-export-readiness.md. Preserve
and revalidate the full earlier18 reading coverage; load all changed current
plan text to maintain a complete current read. A recovered context must reload
the full applicable manifest, not trust an old summary. Required-section:
actual Surface Export arm, actual binding_names_in_pattern implementation and
definitions, emit_exports and codegen emit_export/names functions in full;
18 native recipe/private guard rules and the new source-readiness final
disposition. Rust TD02–05/AP06/12/29 and testing01/03 remain applied: private
identity is not a source API name; test actual module namespace and effects.

Record intake/readback and exact first/final commands/env/status/streams in
the SAME absolute planning artifacts/increment-b2b3/native/cc/index.md and its
owned receipts. No Python execution/parity exception; no Python/Ruby/Fennel/
handwritten JS research/helper/orchestration/evidence/command logic. Helper
logic uses Lykn; ordinary Rust/JS product tests and direct shell/CLI/simple
filesystem lifecycle remain allowed. No new dependency, source wrapper or
manifest/lock change. Source scope is EXACTLY18's six paths PLUS
crates/lykn-lang/src/binding.rs (seven total); its
commit/trailers/environment/clean handback and separate review rules still
govern. Root owns planning staging; CC does not change ledgers or issued prompts.

Return both18 and19 dispositions in the same clean proposed-done source
checkpoint with actual commit/tree/seven-path inventory, all required tests,
failed attempts and remaining limits. Separate Sol independently validates
before the B2-DISCARD-N row can close. The rest of B2b/S03 stays open.
