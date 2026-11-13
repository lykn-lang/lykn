# S03 iteration18 — native Surface discard values and guards

Issued2026-11-13 after separate source-readiness and clean root handback.
Project03/Arc04/S03; predecessor cc-prompt-iteration17.md is accepted
public ICU work. Execute this refinement against source57c76c99cbed07ff992e78aac8afefa4bdf0b2ad,
treef044d795e88c3dac8e84a73a557cf071edd5327c, branch
codex/qualified-adt-core, worktree
/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering.
Planning remains the existing orphan /Users/oubiwann/lab/lykn/lang/.worktrees/planning.
Luna6High implements; separate Sol6.1High independently reviews. Root owns
design/plans/ledger/planning Git/index; exclusive source/build transfers on
actual issue. No release integration, push/publication, remote CI, licensing,
new dependency or manifest/lock change.

## Contract and bounded usable result

The operator has settled B2-ID-DISCARD: `_` is a true discard in binding
patterns, `_value` is an ordinary named binding. Distinct source spellings
still identify distinct bindings (B2-ID-NAME). Implement this first native
checkpoint for Surface Bind/BindGroup and parsed Surface callable signatures:
Func/Fn/Lambda/Genfunc/Genfn, including supported fixed-arity multi-clause
parameter patterns. A discard introduces no source binding. Preserve argument/
initializer evaluation, defaults, existing destructuring operations and declared
runtime type checks. Source body/pre/post/default `_` is never rewritten to
compiler storage. No new unbound-value policy is authorized: expression `_`
can still follow existing foreign-JS lookup. Property/schema/API names remain
data in their own roles.

This checkpoint does not claim complete discard semantics. Public compilation,
raw/kernel catch/loop/callable/class bindings, source owner graph, ordinary name
hygiene, check semantic join, DTS/API/docs/book/human and LC02–08 retain their
existing open obligations. In particular source `(bind _ 99)` is now itself a
discard: do not use it to establish a visible outer99 in a new test. Use a real
foreign global `_` installed by an ordinary product runtime test, or test
`typeof _` with a clean global. Retain the original7/99/7 baseline unchanged.

## Concrete implementation

1. Reuse the existing typed CompletionValueId compiler-private local mechanism
   through ctx.next_completion_value_id/SExpr::completion_value_atom. It already
   represents private callee/argv/receiver temporaries as well as completions.
   This is private storage, not a source BindingId or typed-owner identity.
   Existing whole-unit/emit_form finalization reserves normalized names and
   colon roots; use that lifecycle, no raw prefix/gensym string as authority,
   no global current-unit or new public API. Copies of one storage atom keep
   the same private identity; distinct discards/guard elements get distinct IDs.
2. Replace separate parameter reconstruction and string-based check generation
   with a private prepared parameter result (e.g. PreparedParam with pattern
   and checks). Recursively prepare each parsed parameter ONCE per clause/
   signature and retain that result for BOTH emitted definitions and guards.
   Update every param_to_kernel_names/param_type_checks consumer: emit_fn_expr,
   emit_func_single, emit_func_multi, emit_genfunc_single, emit_genfn_expr;
   Lambda dispatch uses the Fn route. Keep existing return/pre/post/yield and
   strip-assertions ordering. Even stripped output must lower discard binders.
3. Simple typed/default/rest `_` uses a private storage atom. Typed object
   field `_` preserves the actual property key through `(alias _ <private>)`;
   a default uses the existing alias optional-default slot, not a renamed
   shorthand key. Ordinary fields retain their current output where possible.
   Recurse nested object/array patterns; nested alias names are property/data
   selectors, not new bindings. Preserve the existing native alias-annotation
   behavior; this checkpoint does not invent alias guard semantics.
   Array typed `_` stores/reads its value normally for checks; bare Skip `_`
   remains a hole. Rest retains collection creation/consumption. Typed rest's
   guard loops over the prepared collection and uses a distinct private element
   atom; diagnostic label stays source `_`, never `_el___` or private prefix.
4. Add a private/value-based type-check helper in emitter/type_checks.rs,
   receiving actual:&SExpr separately from the source display name. Preserve
   public emit_type_check's current string signature by delegation. The real
   value must appear in BOTH the predicate and dynamic `(typeof value)` in
   the error message; the literal label alone uses the original source name.
   Keep protected host references, errors, existing return checks and all
   non-discard behavior. No stringify/parse or magic string replacement.
5. In emit_bind lower its actual binding pattern before constructing const.
   A private recursive helper handles only consumed binder roles: scalar,
   object shorthand/default/alias/rest/spread and array/default/rest nesting.
   Preserve object keys/default expressions; array bare `_` stays hole.
   A scalar typed discard's check uses its SAME private value; evaluate RHS
   exactly once, preserve direct-return destination/preexisting literal-check
   optimization/strip behavior. BindGroup already calls emit_bind, so preserve
   pair order and original spans. Do not rewrite expression atoms, assignment
   targets, schema constructor fields, named declarations or imports/exports.
6. In analysis/mod.rs skip `_` only at actual Bind and callable typed leaf
   introductions, using role-aware existing binding projection where suitable.
   No global ScopeTracker::introduce exemption. `_value` remains a normal
   binding and duplicate/shadow/type diagnostics for other names remain.
   Match wildcards/projector behavior already excludes `_`; preserve it.
   In classifier/forms.rs remove validate_bind_group_duplicates' final
   seen.is_empty rejection so valid repeated scalar `_` groups can reach
   emission. Keep parse_bind_group's existing pattern admission/typed-atom
   rules and duplicate named-binding errors; all-discard non-atom grouped
   patterns rejected by that earlier admission rule remain explicit follow-
   through, not accepted by this checkpoint. Adjust the now-unused span
   parameter/callers idiomatically, without weakening malformed group errors.
7. Repair codegen/emit.rs trailing array elision: a final hole needs its trailing
   comma (`[,]`, `[x, ,]`), including multiple holes. Preserve IteratorStep and
   IteratorClose, without inventing IteratorValue reads for a bare elision.
   Do not change generic emit_pattern to treat EVERY raw `_` as discard: it
   also renders assignment targets and compiler constructor locals.

Multi-clause constraints: existing exact args.length dispatch and per-argument
const emission do not implement TOP-LEVEL simple default/rest clause binding
correctly. Nested defaults and array rest within a destructured parameter are
ordinary valid const patterns and remain supported/tested by this checkpoint.
Keep
that existing limitation explicit, do not expand/rewrite dispatch here or use
top-level simple multi default/rest as a green control. Fixed simple/destructured multi-clause
patterns must use prepared definitions and the matching guards. This staged
checkpoint neither accepts those old unsupported shapes nor closes their
follow-through obligation.

## Discriminating product tests

Use ordinary Rust tests in new crates/lykn-lang/tests/discard_bindings.rs and
focused existing module tests. Execute actual generated ESM through Deno;
missing Deno is failure, not silent skip. Existing emission_results.rs helper
shape is a suitable canonical read→resolve→classify→analyze→emit→codegen
example. Use real subprocess exit/stderr/stdout assertions and cleanup.

- With a real foreign global `_`=99, scalar parameter7, typed array leaf7 and
  object field7 must leave value `_` at99; `_value` parameter returns7.
  Repeat with multiple `_` arguments and repeated discard binds: no duplicate
  source bindings or spurious shadow/unused diagnostic; named controls still
  have normal diagnostics. Successful fixed multi clauses choose correct arm.
- Typed scalar/object/array/rest discard accepts valid values; bad values
  throw TypeError with source `_` label and actual got type. Checked vs
  stripped differs only in assertions, never binding/effect behavior.
- Once-only argument/initializer/getter effects, lazy defaults on undefined
  versus supplied values, default exception propagation, nested object aliases
  and rest consumption. Use exact useful output/counters, not solely JS text.
  Ensure body/pre/post/source-default `_` cannot capture private storage.
- Bare single/multiple/trailing holes advance iterators the exact expected
  number and close them; use a real custom iterator whose value getter reveals
  accidental reads. Typed `_` does read its value for the check. Property `_`
  and ADT schema field `_` preserve property names; constructor payload/check
  references remain coherent. Ordinary object value `_` stays a value use.
- Host/completion/private-name collision: occupy preferred generated suffixes,
  include a real ordered member call and ordinary return/type guard paths;
  no accidental capture or unfinished private marker. Repeated canonical/
  fragment calls recover after an actual failure. Do not claim fragment host
  refs are supported: emit_form retains its explicit whole-unit rejection.
- Whole emit/emit_json→reader/codegen round-trip yields same runtime results;
  original private marker authority is gone before JSON. Preserve owned-unit
  independent-unit tests and public emit_type_check API. Source-level compile
  CLI checked and stripped must exercise at least scalar and typed discard.

Required-full before dependent edits: this prompt, slice-plan.md, ledger.md,
source AGENTS.md, artifacts/increment-b2b3/cdc/native-discard-readiness.md.
Required-section: b2-native-runtime-name-plan.md's B2-ID-DISCARD resolution and
retained baseline section; source functions/types/callers named above in full;
the existing private finalizer/context and actual writer pattern helpers;
installed rust-guidelines anti-patterns and type-design TD02–05, testing's
01-testing-discipline and03-validation-gates. Root's design applies typed
identity (TD02/03), private prepared representation (TD04/05), avoiding
string reconstruction/clone-based divergence (AP06/12/29), and meaningful real
runtime tests (testing). Read relevant Rust error/value helper dependencies
before changing them. Original ICU evidence and other historical prompts are
reference-only. No new broad audit or research harness.

Record actual complete read extents/query coverage and a source-cited contract
readback in the absolute canonical planning artifact home
/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/increment-b2b3/native/cc/index.md.
Recover truncated reads. No Python execution, no temporary parity exception;
no Python/Ruby/Fennel/handwritten JS research/helper/orchestration/evidence/
command logic. New helper logic must use Lykn; ordinary Rust/JS product tests,
direct shell/CLI and simple filesystem lifecycle are allowed. Keep generated
build outputs in ignored target/, receipts in the named planning home. Use
existing DENO_DIR; XDG/npm/TMPDIR in /private/tmp/lykn-b2-discard-native-cc/
outside repository/config ancestors. Preserve exact commands/cwd/env/status/
raw streams and failures, not a new wrapper/replay framework.

Authorized source files only: crates/lykn-lang/src/emitter/forms.rs,
crates/lykn-lang/src/emitter/type_checks.rs,
crates/lykn-lang/src/analysis/mod.rs,
crates/lykn-lang/src/classifier/forms.rs,
crates/lykn-lang/src/codegen/emit.rs,
crates/lykn-lang/tests/discard_bindings.rs (new).
Routine additional source shape need: report to root with concrete reason,
root assesses under existing authority. Do not silently enlarge exact commit.

Focused tests first, then one fresh make check (docs included once), finalHEAD
make check-cited-paths and fresh make bundle-size-check (81920-byte gate).
Use LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR with a precreated absolute planning
receipt directory to retain the actual M6 cold55 cases and fourteen comparison
receipts from the full gate; no extra full run merely to repeat checks. Keep
existing pinned dependency/network warnings explicit; no offline claim unless
all actual operations satisfy it. Record denominators and unrun/skipped checks.

Commit --only exact inspected authorized paths, no amend/reset/blanket staging;
use a message file with contiguous trailers Co-authored-by: Codex
<noreply@openai.com> and Co-authored-by: Billo AI
<ai-engineering@billo.systems>. Return clean source/build (no active jobs),
commit/tree/path inventory, first/final evidence, API/source behavior impact and
remaining limits. CC proposed-done is not independent acceptance; root hands
to separate Sol before changing the new B2-DISCARD-N row. Parent S03 stays open.
