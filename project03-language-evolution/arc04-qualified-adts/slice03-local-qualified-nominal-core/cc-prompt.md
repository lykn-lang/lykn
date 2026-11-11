# S03 increment A: protected host foundation

CC is Luna 6 High; separate Sol 6.1 High independently reviews. Autonomous Mode
continues under the operator's explicit model selection. Implement this bounded
foundation, not the nominal syntax activation or the later emission experiment.
Read the complete slice plan/ledger; all LC rows remain in scope for S03.

## Homes, intake and constraints

Source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
dedicated `codex/qualified-adt-core`, clean baseline
0829e892999890e8877dec5e35cd249753e1be5d. Independently integrated release has
the same source. Planning is `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`.
Root owns parent plans and planning index; CC owns source/build after issue.
No subagents, release edits, merge/push/publication or dependency changes.

No Python execution is permitted. No Python/Ruby/Fennel/handwritten JS research
helpers, including temporary helpers. New research probes/drivers/processing
logic use Lykn. Actual compiler Rust/JS and normal product tests are authorized;
shell/native CLI is for direct invocation and filesystem lifecycle only. There
is no temporary Python parity exception. Preserve useful failures, source and
issued prompts; don't amend history or prune raw evidence by file count.

Read source AGENTS.md, source docs/guides/09-anti-patterns.md, docs/host-contract.md,
the complete accepted S01 qualified-adt-contract.md and this plan/prompt/ledger.
Load installed rust-guidelines (anti-patterns first, enum/API/error guidance),
javascript-deno-guidelines and testing/collaboration applicable guidance. Recover
truncated required text and report concise source-cited contract readback before
edits. Inspect all relevant producers/callers below, rather than trusting this
map alone. Don't read unrelated guide corpora or re-open settled S01 design.

## Reviewed design proposed for A

The bounded extension is **protected host contract v2**, an additive protected
set with an explicit new diagnostic version, enforced on complete units before
stripping and at raw/kernel codegen boundaries. Preserve existing lexical,
normalization, globalThis invalidation, mutator and unknown-proof rules.

Protected global replacement bindings:
`Reflect`, `Symbol`, `Object`, `Number`, `Array`, `Promise`, `TypeError`, `Error`.
Protected exact member slots:
`Reflect.apply`, `Symbol.for`, `Object.freeze`, `Object.defineProperties`,
`Number.isNaN`, `Array.isArray`.
An ancestor root replacement is forbidden; unrelated members/deeper properties
are not blanket-protected. A local binding of any of these names is ordinary
source code. Unknown computed keys/arbitrary aliases/foreign mutation retain
the documented limits; no prototype freeze or flow-sensitive resolver is added.
Keep error severity and typed CLI/dist failure propagation. Diagnostic wording
is `host-contract v2: write to protected slot <slot>`; migrate actual old-version
expectations and docs intentionally, not by loosening substring assertions.

Introduce compiler-private typed references for exactly these nine additional
host values: Symbol constructor, Symbol.for, Object.freeze,
Object.defineProperties, Number.isNaN, Array.isArray, Promise constructor,
TypeError constructor and Error constructor. Existing Reflect.apply's saved
callee/receiver/argv invocation protocol remains distinct and unchanged; do not
relax its three-stable-reference validation to accept generic calls.

Only owned producers create trusted references (native private enum metadata,
public identity metadata/WeakMap). Reader/source/macro/ordinary JSON spelling
cannot forge them. No new public kernel form, prefix convention or JSR export.
Reused type/return/constructor/generator/contract/match-error emitters must use
owned references rather than accidentally resolving user Number/Array/etc.
Don't fix existing keyword guard semantics as an incidental host refactor:
native promise versus public symbol/bigint/fallback differences stay explicit.

For each requested value, emit one hygienic module-level private const alias
of the real global binding or exact member. Place support after directives and
before source statements, outside user function/parameter scopes. Reserve the
complete expanded normalized source names. If the module itself binds ANY
requested root, use feature-local named imports from a compiler-owned fixed
inline data module for the affected references, as the existing Reflect fallback
already does. The data module contains only the finite requested intrinsic
exports, no external package/sidecar. Preserve user live bindings/direct eval;
do not rewrite user names, introduce a source function boundary, use eval to
find globals or capture globalThis through a user binding. Ordinary unshadowed
units use local aliases. Static builtin functions in this finite set are safe
detached references; constructor references are used with new/instanceof as
appropriate. Do not route them through user call/apply methods.

Alias capture is compiler-owned module support under the protected-host
assumption, not a claim to defend against foreign/dynamic tampering. With no
owned request, support is absent and ordinary valid output is byte-unchanged.
Do not annotate aliases/calls pure or introduce initialization removal yet;
LC-06's reviewed producer/serialization proof is a later S03 increment. C must
also account for alias/import support initializers in the owned ADT dependency
graph so they cannot silently defeat C1's zero-contribution target. A's alias
shape is not an irrevocable final layout; only its source semantics are fixed.

## Concrete implementation route

1. Extend the exact-path policy in native protected_host.rs and public
   protected-host.js using a finite typed/table definition, including root
   proofs and existing globalThis alias invalidation. Keep all existing writer
   forms/mutator handling; test segment exactness, local normalized bindings,
   scopes and uncertain paths so extra roots don't create false positives.
2. Native AtomData in ast/sexpr.rs already carries private completion and host
   invocation metadata with value-preserving clone/accessor discipline. Add
   a distinct trusted-reference enum/accessor/factory; source constructors leave
   it absent and structural equality remains metadata-insensitive. Public use
   a small private metadata module, not a source property granting authority.
3. Build a whole-unit reference support plan from actual marked occurrences,
   with complete name census, sparse aliases/imports and typed errors on invalid
   escape. Materialize to ordinary kernel before emitter::emit returns and
   before whole-unit JSON is exposed, so expanded/lowered kernel needs no
   ambient registry. Public complete expand/expandExpr boundaries similarly
   return self-contained forms (the existing multi-form result is valid).
4. Raw native module codegen must also handle owned producer fragments safely.
   Existing codegen::emit_module_with_invocations uses pointer-anchored requests:
   do NOT clone/rebuild that tree and silently orphan existing request anchors.
   A non-mutating support plan plus JsWriter ID-to-name lookup can emit marked
   atoms, including call heads, while retaining original node addresses. Share
   the support construction with kernel lowering. Preserve the old protected
   invocation's validation/consumption and test combined requests explicitly.
5. Ordinary public compile/compileExpr and native fragment writers must not
   silently print private placeholders or drop metadata. Complete module APIs
   lower trusted references; a fragment with an unfinished owned reference
   returns the existing structured codegen/error channel. Native fragment JSON
   serialization encountering such a reference must fail with a typed error,
   not serialize an unsafe source name. Exact native JSON boundary decision:
   sexpr_to_json returns Result<Value,LyknError> and rejects unfinished owned
   refs; emit_module_json returns Result<String,LyknError> and LOWERS a complete
   owned-ref unit to ordinary aliases before serialization. It does not require
   an undocumented prior emitter call. Propagate through emitter::emit_json and
   CLI compile.rs callers (currently ~255/323), all tests and actual consumers;
   do not panic or add a legacy fallback. This explicit Result change is
   authorized for the breaking 0.6 release. Plain fully lowered kernel/JSON
   retains its existing shape and behavior.
6. Inspect emitter/type_checks.rs, contracts.rs, forms.rs (including all new
   TypeError/Error construction sites), emitter/mod.rs and json.rs;
   codegen/{mod,emit,format,host_invocation}.rs; public surface-helpers.js,
   classifier.js, compiler.js, expander-core.js and private host modules. Query
   all owned guard/error producers in these regions. Don't convert ordinary
   user calls merely because their names match a protected operation.
7. Update docs/host-contract.md and necessary direct source guide references
   for v2, retaining v1 history and exact fallback/unknown limitations. Record
   every public Rust/JS signature/output/diagnostic impact for S06. Synchronize
   changed canonical public compiler files AND new dependencies into the actual
   crate-owned embedded payload. Adapt M6 comparisons to the actual changed set;
   preserve its package config/lock and cold-cache/delivery proof.

## Proof and handoff

Run a focused capability check as soon as a coherent reference can pass through
both writers; don't wait for a large diff. Required controls: all protected roots
and exact slots rejected via direct/literal-computed/recognized mutator paths
in default and stripped compilation; locals/uncertain/deeper paths permitted;
v1 Reflect controls retained under v2 wording. Typed number/array and throwing
guard/no-match paths under module and parameter shadowing of every used root
must use real intrinsics (including Error/TypeError constructors); no capture
through a same-spelling macro or normalization collision. Check sparse support,
directives, actual inline fallback and live source eval, complete JSON-to-public
compiler/runtime parity, invalid fragment failure/no outputs, repeated calls,
and a unit combining old Reflect invocation with new references.

Tests may construct private requests only in normal internal product tests;
public source/JSON lookalikes must NOT select the facility. Preserve baseline
S02 runtime/getter/hygiene controls and unchanged output for a plain no-request
program. Product runtime probes are Lykn. Verify the actual fresh embedded
package/copy-of-CLI route, not only canonical public files.

For browser evidence, exercise compileLykn/the normal browser compile adapter
returning ESM text and run that output in an ESM-capable consumer. Existing
browser run/load use indirect eval and cannot execute fallback imports: retain
and document that limitation and its newly affected guard cases for S06.
Do not call compile success browser run/load success, invent an eval escape,
or silently change their sync/async/export semantics or CSP/module policy.

After focused checks pass, run make check, committed-HEAD cited paths and the
80 KiB browser gate. No duplicate docs outside make check, no whole-file legacy
JS formatting, no added Node/npm dependency. Use owned npm/XDG caches and the
explicit existing Deno dependency cache. Capture useful bounded raw receipts
under this slice's artifacts/increment-a/ and record actual pins/failed attempts.
Do not treat a zero-test filter exit as proof or reconstruct missing old logs.

Commit exact named source paths with --only and contiguous Codex/Billo AI
trailers from AGENTS. Root owns planning Git; append your increment-A handoff
to canonical closing-report.md (clearly S03 still open) and useful receipts,
leave ledger/parent/CDC files unchanged and return ownership. This checkpoint
implements LC-01's host substrate only. Do NOT start B/C, add qualified syntax,
brand initialization or purity comments before root's source-ready follow-up
and separate Sol acceptance of A. No user pause is needed for obvious bounded
corrections; send consequential ambiguity/findings to root promptly.
