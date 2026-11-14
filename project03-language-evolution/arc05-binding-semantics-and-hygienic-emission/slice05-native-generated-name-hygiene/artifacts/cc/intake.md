# CC S05 intake and contract readback

2026-11-14; source/build dispatch `c0ed454610f3a384196e4fa003335373819fb2fd` / tree `7d8b3359fa570b2e8322996dbe8b648f02af58da`, branch `codex/qualified-adt-core`, initially clean. Release/0.6.x pin remains `c60dea62`; planning is the separate orphan and remains root-owned.

## Required material and coverage

- Complete issued `cc-prompt.md`, `slice-plan.md` and eight-row `ledger.md` read in full from the canonical planning S05 directory.
- Complete source `AGENTS.md`; complete `emitter/gensym.rs`, `emitter/context.rs`, and `ast/surface.rs` definitions through line 510 loaded. `emitter/mod.rs` complete production unit emission/materialization and JSON path; `emitter/json.rs` complete serializer and fragment rejection; `forms.rs` loaded public form/raw/finalization boundary (282–410), recursive expression dispatch (622 onward), typed-param preparation (3720–3900), function producers including single/multi (3992–4410), generator instrumentation, local gensym reservation helpers and match/let/await call sites (4580–4915). Scoped `rg` census found direct `ctx.gensym.next` sites and `next_unreserved_gensym`/per-match reservation.
- Complete canonical `emission_results.rs`; complete `remaining_discard_bindings.rs`; complete `bridge.rs`. Read actual CLI `Compile` argument schema and dispatch, `compile.rs` pipeline locations, JS `compile(exprs)` implementation at 2296–2306, `codegen` module emission and literal raw writer contract, and host references/invocation production definitions. Read ICU caller reservation and hoist/branch allocation sections (510–656, 812–909), `codegen/names.rs` normalization implementation, and M6 receipt selectors / 70-case materialized-population assertions in `macro_dependencies.rs`.
- Read `docs/guides/06-functions-closures.md` opening ID-01/02/function boundary material and `skills/lykn/SKILL.md` surface naming, generators, raw kernel and runtime guidance. Read S04 `cdc-retrospective.md` complete; its lesson to verify each modified producer's actual input role and rejected wrong implementation is applied below.
- Read complete canonical root baseline README and all three actual `.lykn` sources, generated ESMs, stdout and stderr receipts. Observations: typed `result__gensym0` causes duplicate declaration SyntaxError; fixed clause parameter `args` causes TDZ ReferenceError at `const args = args[0]`; a foreign global `args=99` instead returns `[7]`. These are preserved as opposing old behavior, not acceptable success oracles.
- Structured source census covered all `SurfaceForm`, `ParamShape`, `Pattern`, `TypedParam`, `TypeAnnotation`, `Constructor`, `BindBinding`, `CondClause`, `ThreadingStep`, `ClassMemberForm` fields from the actual enum/struct definitions, plus all emitter `gensym` sites and raw AST atom walkers. SExpr Atom/List/Cons traversal borrows existing nodes; strings/keywords/numbers/bools/null are literal data. Source-level parser, pattern, default, guard and raw member traversals are included in the implementation design.

## Contract readback

The defect originates in names created before the emitter's per-form expressions are emitted: the real gensym counter alone does not know typed/reconstructed names or later sibling forms. I will extend the context-owned generator with normalized occupancy and checked monotonic allocation, then add one exhaustive borrowed `SurfaceForm` census. `emitter::emit` must seed every unit form before its first producer; public `emit_form` seeds its whole single form; private recursive `emit_expr` must not rescan. Raw codegen stays literal, and fragment emission cannot reserve future siblings. Existing completion markers retain their separate finalization/reservation policy, host/invocation materialization order, diagnostics, error recovery, and mode restoration. A failed fragment keeps consumed counter and occupancy; only a newly constructed/reset generator starts a fresh namespace.

All producer families already using the context generator (some-thread, dissoc, awaits, yields, checked results, carriers and match paths) should gain protection through the shared allocator, without rewriting their algorithms. For overloaded functions, one allocated preferred `args` name must drive rest storage, length test and every indexed read; source parameters, clause order, dispatch, no-match TypeError, and unsupported top-level default/rest behavior remain intact. Named rest guard storage uses preferred `_el__<stem>` but diagnostics retain the source label. Discard rest identity continues through `CompletionValueId`, not source `_` or a synthesized prefix. Late host references/invocation and ICU retain their existing allocators and owned inputs.

Tests must falsify the actual collision modes with real native analyzed units and actual CLI/JSON/package consumers; no hand-built replacement IR. Preserve checked and stripped behavior, result values, effect/error/iterator timing, named API/DTS/data semantics, `_` vs `_value`, and the established strict TypeScript suite. Scope is exactly the seven plan paths. S07 owns exact source-binding rewriting; no source renaming, public parity claim, raw writer guarantee, arbitrary eval isolation, or whole-compiler ICU hoist determinism is claimed. The meaningful pitfall is a plausible emitter-only patch that tests just generated spelling or one form: later siblings and reconstructed typed/default/alias names remain invisible unless the complete owned unit is censused before the first allocation.

No consequential design/source contradiction was found in the loaded contract. The plan's warning about the prior `bound_names()` over-approximation is a scope limit, not a defect to repair here. Root retains planning Git/index/eight row states; Sol remains the independent source-first verifier. This intake was written before any product source edits.

## Intake coverage supplement before gate work

Follow-up manifest reads completed the missed exact producer functions: `unbox_awaited_value` 226–235; `emit_dissoc` 3463–3488; thread step and thread-first/last plus some-thread producer 3539–3650; `prepare_typed_param` and complete recursive `prepare_param` 3746–3930; complete `emit_func_multi` 4203–4450; generator function/expression and `instrument_yields` 4460–4660. This confirms the shared `EmitterGensym` is the correct early-producer choke point and that `emit_dissoc`/some-thread/multi result temporaries are already context-owned. The CLI M6 evidence root/selectors and test receipt functions are loaded at `macro_dependencies.rs` 1–120 and the cold-cache/copy/materialization/comparison/population test at 1000–1170. Package/declaration consumer patterns are identified by `discard_declarations.rs` 149–216, 466–787 and 788 onward; actual CLI check/compile fixture patterns in complete `remaining_discard_bindings.rs`.

Guidance read: Rust guideline `11-anti-patterns.md` AP-09 (recoverable diagnostics vs documented finite-namespace invariant), AP-12 (borrowed traversal, no AST cloning/rebuild), AP-13 (no collect-only-for-reiteration); testing discipline and validation gates (behavioral oracles, exact selected population, actual final consumers and repository gates); engineering-methods guide 07 complete CC preflight/readback/review-strength section. These reinforce checked counter increment as a true internal invariant, a borrowed pass over every owned field, and actual generated-code values/errors rather than spelling-only tests. The named-rest source contract is the preexisting diagnostic string `_el__<tp.name>` for named values and `_` for discard; the allocated actual atom is kept distinct, as clarified by CDC before any further dependent changes.

## Initial candidate state (preservation, not acceptance)

The initial seven-path source candidate was preserved at
`fa6562a1` (tree `71c65689be1c8e3dbc2638aa5a7d60cee89944a0`) after the
attempt11 dotted-root runtime TDZ failure. All eight NH rows remain open. The
initial source/build owner returned a clean worktree and no active build/test
jobs to root for source-design correction 01. See the bounded partial
`closing-report.md` and `artifacts/cc/attempt11-focused-native.log`; no final
M6/full-gate success is asserted.

## Correction01 pre-edit intake and contract readback

**Source state:** task branch `codex/qualified-adt-core` at clean
`fa6562a13ffc1069c06bb98d81cc4561fee68e12`, tree
`71c65689be1c8e3dbc2638aa5a7d60cee89944a0`, parent `c0ed4546...`.
The initial proposed candidate, all prior failures and the partial close remain
preserved. Correction01 is 1/5 and adds only the three plan-D codegen paths to
the original seven; no edit has been made after dispatch yet. Planning worktree
is `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, planning issue pin
`84779add734f7eff8eeb57e59ebb2e0897b45f9f`; root owns its Git/index/rows.

**Required material actually loaded before edits:**

- Correction prompt `cc-prompt-iteration01.md`, full text, and plan v1.1
  `slice-plan.md`, lines 1–437 (including plan D and the preserved A–C
  contracts); slice `ledger.md`, all eight open rows; source `AGENTS.md`, full
  file; partial `closing-report.md`, full file; existing intake, all 38 lines.
- Prior finding receipt `artifacts/cc/attempt11-focused-native.txt` (all 11
  lines) and `attempt11-focused-native.log` (all 71 lines). Source and tree
  pins for both are the preserved candidate fa6562a/tree71.
- At fa6562a/tree71: `emitter/gensym.rs` full relevant production and tests;
  borrowed `emitter/source_names.rs` full 344 lines; the native product test
  full 291 lines and CLI product test full 194 lines. Prior original-intake
  producer/source and guidance reads remain applicable, including the named
  seven-path implementation contracts, all producer cases and S04 failure/
  reuse evidence.
- At fa6562a/tree71: `codegen/names.rs` production allocator lines 1–61,
  full normalizer lines 112–252, and actual `emit_atom`/member-chain lines
  254–289; `JsWriter` construction/write/finish lines 1–170; complete
  `host_references.rs` production (1–227); complete `host_invocation.rs`
  production (1–169); `forms.rs` completion finalizer lines 358–410,
  completion/ordinary atom reservation and marker traversal lines 4810–4870,
  plus local pattern/next-name collectors and callers around 4696–4710 and
  4866–4910; actual Rust reader lexer atom/string escape/advance routines
  `reader/lexer.rs` lines 1–349. The complete repository-owned
  `test/fixtures/ordered-member-calls/pure-colon-call.lykn` was loaded; its
  actual shape saves receiver/call operands and invokes `receiver:read-entry`.
  `protected_host.rs` kernel declaration/root collection lines 130–230 was
  read only to retain its separate binder/root-policy boundary.
- Installed Rust guideline AP-09/12/13, testing Discipline/Failure Triage,
  engineering-methods guide07 required-reading/corrective-iteration sections,
  and source `skills/lykn/SKILL.md` bindings/functions/generators/threading
  sections were loaded for this correction.

**Contract readback before implementation:**

The initial bug is now an exact writer-to-collector mismatch. `emit_atom`
normalizes the actual text through the current writer; colon segments and
private-member prefixes can differ from the raw Surface/SExpr spelling, and
legacy atoms can contain static dotted or computed-key expressions such as
`box[t__gensym0]`. Therefore source occupancy has to emit first, then scan the
physical text for conservative identifier-shaped runs; splitting raw dots or
reserving only the first colon root is insufficient. Static `\\uXXXX` and
`\\u{...}` escapes must decode before run extraction, including valid surrogate
pairs, while the decoded tokens are never normalized a second time. Checked
incremental parsing, UTF-8-safe boundaries and bounded malformed-escape
handling prevent panic/quadratic suffix rescans; this does not validate JS or
repair the inherited repeated-suffix cost inside `to_js_identifier`.

One crate-private helper serves all five existing collectors: emitter
`EmitterGensym.reserve`, forms `reserve_emitted_names`, ICU
`GeneratedNameAllocator.reserve_expr`, host-reference prepare's atom visitor,
and host-invocation `normalized_payload_names`. Existing traversal, literal
string exclusion, ownership/address maps, order and strategy stay intact. The
forms completion-marker leading return and descendant `has_markers` propagation
must not be disturbed. Generated candidate identity uses the same physical
key: early gensym and preferred candidates are passed through `emit_atom`,
while ICU's preferred/suffix candidate is already emitted and gets only static
escape decoding, never a second normalization. Returned spellings, suffix
ordering and checked exhaustion behavior remain unchanged. The five consumers
collect occupancy; they do not acquire binder authority or alias resolution.

Tests must run actual generated programs for dotted/computed/escaped early
producers and real late completion, ICU, intrinsic alias and invocation
consumers, verifying each relevant producer actually exists. Early JSON must
flow from real CLI kernel JSON through the current `compiler.js compile` client;
raw ICU and native producers must not be described as public ICU/name parity.
`protected_host` root selection, escaped source binder identity, AST/resolver,
JS/browser compilation, public syntax and source-name rewriting are outside this
correction and remain later S06/S07/LI-04 ownership. Exact ten-path scope and
all eight NH criteria remain unchanged/open. Focused proof is followed by
fresh-artifacts, a Clippy preflight, one fully captured final `make check`,
actual M6 70/7 plus all 14 comparisons, exact commit, final-HEAD citations and
fresh 81920-byte cap check; none is waived by earlier candidate evidence.

## Correction02 pre-edit source and oracle readback

**Dispatch pin:** correction02 planning issue
`9009d509` directs test-only work from clean source HEAD
`32749d97216cba269fb5e4a4d454e26ece6c11dc`, tree
`f4a955ab32c9bcbadf9ac47eb06ec9e79e2b971c`, branch
`codex/qualified-adt-core`. The preserved initial `fa6562a1` and correction01
`32749d97` commits, their attempt histories and close remain unchanged. Only
`crates/lykn-lang/tests/generated_name_hygiene.rs` may change; source/build
ownership is this CC's exclusive dispatch, while root owns planning Git/index/
rows. Ten-path c0ed→delivery scope and eight open NH rows remain fixed; this is
test-only and does not assert or repair a production defect.

**Required documents read before edits:** the complete canonical
`cc-prompt-iteration02.md`; current plan `slice-plan.md` v1.2 including
correction02 section E, exact scope/gates/history; all eight rows in `ledger.md`;
the complete correction01 independent source-first HOLD and correction02
actual-text readiness PASS in `cdc-verification.md`; current complete
`closing-report.md`; and the full 417-line native integration test. The plan's
four wrong-implementation distinctions are read as exact requirements, not
coverage labels: first-function sibling allocation must be isolated before the
second declaration; recursive object→array→object default leaf must be absent
from the body and normalize `result__gensym0!`; the supported `:any` fragment
parameter `t__gensym0` must be absent from its some-thread body; and a real
Bind-RHS async do/await carrier must oppose `value_box__gensym0` while its
fixed getter storage is distinct and one `before` effect remains. Keep the
rejected checked `:number`/`:returns` fragment out because the actual public
API rejects unfinished host references.

**Source reading with recovery:** read `forms.rs` public `emit_form` at
286–307, including both whole-module host invocation and host-reference marker
rejections. The named existing rejection oracle is actually in
`crates/lykn-lang/tests/emission_results.rs:246–278` (the initially tried
`src/emitter/emission_results.rs` path does not exist); recovered by listing
source/test paths and read the actual test. It asserts the compiler-owned
reference diagnostic/span, then shows whole-unit JSON lowers the reference.
Read the recursive `source_names.rs` parameter walk through `ParamShape`,
`DestructuredField`, `ArrayParamElement`, `TypedParam`, annotation, nested
alias, pattern and defaults; literal SExpr strings remain excluded. Read
`forms.rs:226–235` actual `unbox_awaited_value` implementation and the
async/value-context producer/callers `5620–5758`, including
`emit_do`'s `any_current_await`, array boxing and async IIFE unbox. Read the
existing actual nested input at `crates/lykn-cli/tests/discard_declarations.rs:
160–194`; it confirms the object alias → array → nested object parameter syntax.
The full current native group shows the corrected attempt11, completion, ICU,
host/invocation and JSON controls that must remain intact.

**Pre-edit test contract:**

1. In the existing combined typed fixture, assert that the first `collide`
   function specifically allocates `result__gensym2` before `function nested(`;
   a whole-module search does not distinguish a per-form allocator. Preserve
   actual runtime `7 7`.
2. Add the recursive alias/array/object default function and call with
   `(obj :items #a((obj)))`. Require the actual normalized parameter leaf,
   checked result helper `result__gensym1`, and runtime7. Run checked and
   stripped output; do not require the checked-only helper after strip.
3. Replace the public fragment specimen's body-read parameter with the
   `:any t__gensym0` absent-body + `(some-> 7 (+ 1))` source. Assert the actual
   emitted function parameter and `t__gensym1` some-thread local, execute
   `one(99)`→8, then assert context `next("t")` gives `t__gensym2`. Preserve
   the supplementary failure/reuse/mode/raw controls and existing whole-unit
   reference rejection; no API weakening or fabricated raw IR.
4. Add the canonical bind-RHS `(do ... (await ...))` carrier input in checked
   and stripped modes. `value_box__gensym0=99` is read as foreign source data;
   generated unbox carrier uses distinct `value_box__gensym1`, boxes/unboxes
   the awaited result through the actual source producer, and outputs
   `7 99 before` exactly once. The carrier's parameter encloses only its fixed
   getter; assert actual helper presence/distinct identity and result/effect,
   never claim it captures a foreign source read inside its own fixed body.

Retain every existing native control and make no CLI/test-helper/production
change. Use existing native `compile`, `compile_strip`, `run`, `reader` →
resolver → classifier → analyze → emit and `emit_form` paths. Log full actual
source/generated JS and runtime command/status/stdout/stderr to the new
correction02 attempt receipts; failures remain preserved. Preflight/focused,
fresh-artifacts and one full `make check` with precreated absolute M6 evidence
are required; inspect actual 7/70/all14, commit only this one path with exact
message file/adjacent trailers, then final-HEAD citations and fresh81920 size.
No extra docs target, new scripts, dependencies, source-language parity,
S06/S07/AWEX repair, or ledger acceptance is authorized.
