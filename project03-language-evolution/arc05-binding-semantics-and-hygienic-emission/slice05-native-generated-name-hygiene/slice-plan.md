---
project: project03-language-evolution
arc: arc05-binding-semantics-and-hygienic-emission
slice: slice05-native-generated-name-hygiene
status: active
version: "1.1"
depends-on: [slice02-native-binding-discards, slice04-discard-aware-declarations]
---

# Native compiler-generated name hygiene

Current2026-11-14: initial candidatefa6562a13ffc1069c06bb98d81cc4561fee68e12,
tree71c65689be1c8e3dbc2638aa5a7d60cee89944a0, is preserved clean and
explicitly NOT accepted. Actual attempt11 exposes a design gap shared by root
and original readiness: dotted emitted atom await__gensym0.child hides a JS
lexical root from the whole/colon census and produces a TDZ. Correction01 is
being prepared,1/5 on dispatch, all8NH/BS-05 open. Root owns source/build again.
Section D supersedes the original occupancy-extraction assumption and expands
the initial seven paths to ten, preserving the same capability/eight criteria.

2026-11-14: operator opens S05 after independently accepted S04. Continue the
established OpenAI gpt-6-luna/high CC and separate gpt-6.1-sol/high CDC,
Autonomous Mode through this slice's independent task-branch close,
retrospective and parent routing. No S06 opening or further integration/push/
publication. Root coordinator backend is not independently reported.

## Preflight and useful delivery

- Source: existing `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  branch codex/qualified-adt-core, clean
  c0ed454610f3a384196e4fa003335373819fb2fd,
  tree7d8b3359fa570b2e8322996dbe8b648f02af58da.
- Release: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, independently
  acceptedc60dea62; unchanged by this assignment.
- Planning: separate orphan `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`,
  initial3c9d80b6. Root owns plans/index/status and serial source/build handoffs.
- Fresh bounded S05 reviewer `/root/arc05_s05_cdc` retains the stated Sol model;
  fresh implementation context `/root/arc05_s05_cc` uses the stated Luna model
  on committed dispatch after readiness.
  Prior S04 records remain the accepted baseline rather than growing its context.
- Root currently owns source/build. CC receives exclusive ownership only after
  separate source-readiness PASS and committed open set. Five refinements maximum;
  none spent at opening. Fix obvious scoped problems autonomously; return real
  unresolved contract/scope gaps to root before dependent work.

Deliver native helper storage that cannot collide with source/foreign emitted
names, including typed/reconstructed names missing from raw expression walks.
Actual CLI/file/package consumers must use it. Do not merge exact source
spellings, rename user bindings, alter field/API names or promise general macro
hygiene. S07 owns exact source-binding lowering; S06 owns public parity.

## Source-grounded design

Atc0ed, emitter/gensym.rs is a bare unit counter; forms.rs uses it for async
carriers/hoists, dissoc, some-thread, checked results, yields and match helpers.
Match helpers additionally reserve their local target/pattern/guard/body names.
CompletionValueId finalization separately reserves the completed kernel.
emit_func_multi hard-codes `args` for rest storage and every dispatch/read.
prepare_typed_param hard-codes `_el__<source rest name>` for a named rest guard.
These are generated binding roles, not public argument or object-property names.

The existing [runtime-name draft](../../arc04-qualified-adts/slice03-local-qualified-nominal-core/artifacts/b2-native-runtime-name-plan.md)
explains why reservation must precede producer lowering. Its full lexical
BindingId/name-rewriter graph remains S07; do not implement it here.

### A. One borrowed, exhaustive source census before allocation

Add private emitter/source_names.rs with
`reserve_form_names(&SurfaceForm, &mut EmitterGensym)` and borrowed helpers.
Match every actual SurfaceForm variant without a catch-all. Traverse:

| Owned data | Required census |
| --- | --- |
| Bind/BindGroup | Original patterns, annotations and initializer expressions for every pair |
| Func/Genfunc/Fn/Lambda/Genfn | Reconstructed declaration/parameter names; every ParamShape level, typed rest/default leaf, nested alias/type; pre/post/body/yields/returns |
| Match/IfLet/WhenLet | Target/input, every recursive Pattern binding/constructor/object pair, guard and each branch/body |
| Type | Type/constructor/field names and annotations/defaults; schema roles remain data |
| Obj/Assoc/Dissoc | Keys conservatively reserve strings used as names; values/target executable expressions are traversed |
| Cell/Express/Swap/Reset/Set/SetSymbol/Conj | Every stored operand, extra argument and computed-key expression |
| Thread variants/Cond/logical/Eq/NotEq | Initials, all Bare/Call steps, tests/results/operands |
| Async/Export/Exports | Recurse inner form plus extra args/names |
| Class/ClassExpr | Name/base, every member prefix/body/initializer, including Raw members |
| MacroDef/ImportMacros/KernelPassthrough/FunctionCall/Do | All retained raw syntax/head/args/body and reconstructed macro name |

For SExpr, recursively inspect Atom/List/Cons; ignore literal String/Keyword/
Number/Bool/Null values. Reserve normalized complete atom spelling and its
colon-separated segments conservatively, matching current emitted-name census
conventions. **This v1.0 whole/colon-only extraction is superseded by D**;
the borrowed structural visitor and literal-data distinction remain binding.
Preserve all tags/spans/metadata by borrowing; never rebuild nodes.
This is a conservative occupancy set, NOT a binder/use resolver: reserving a
property key or alias does not declare it local. Do not use typed_params() or
bound_names() as a supposedly complete traversal; they omit required operands.

Canonical emitter::emit creates its fresh context, reserves ALL unit forms
before the FIRST generated name, then retains existing emission/finalization/
validation/invocation/reference ordering. Public forms::emit_form reserves its
single supplied form at entry. Private emit_expr already recurses below those
entrances; do not add repeated subtree scans or a recursion-depth mechanism.
Fragment callers cannot retrospectively reserve later siblings: use complete
unit emission for that guarantee. Existing fragment host-marker rejection and
failure/reuse contracts remain unchanged.
In a reused fragment context, failed emission retains consumed counters and
reserved/allocated names; it does not roll back the namespace. Existing mode
restoration/first-fatal clearing is separate. Preserve emission_results.rs's
actual consumed-seed/counter assertion and failed-then-good mode test. A caller
requesting a fresh namespace creates a new context (or explicitly resets its
standalone generator); do not silently rewind after errors.
Arbitrarily constructed eval text is not a static atom/name input; this repair
does not add dynamic-eval namespace isolation or parse literals as source.

### B. A reserved emitter generator and all early producers

Extend EmitterGensym with owned normalized occupancy, private reserve helpers
and a private preferred-name operation. Public next(prefix) keeps its return
type and `{prefix}__gensymN` scheme: advance a checked counter until the candidate's
emitted spelling is unoccupied; reserve each returned spelling immediately.
Preferred allocation returns the old raw preferred spelling if available,
otherwise uses next(preferred). Existing public reset starts a fresh counter
and occupancy namespace; document that explicitly. Canonical emit always uses
a fresh context; no global/thread-local/current-unit state.

Counter exhaustion is an internal finite-namespace invariant failure with an
explicit checked-add expectation, analogous to existing completion identities;
source nodes cannot exhaust usize distinct names within addressable memory.
Do not introduce a recoverable-error-shaped panic or broaden public Result APIs
for malformed source, which retains its existing diagnostics.

Route all current gensym users through that occupancy. Replace multi-clause
`args` storage once with preferred allocation, and reuse the SAME allocated
name in rest declaration, length/member checks and every argument read. The
literal member `length` remains data. Preserve clause order/arity/dispatch,
parameter bindings and contracts; no new default/rest-overload support.

Route named rest-guard element storage through preferred allocation of its
existing `_el__<name>` stem. Keep original diagnostic display text separately
from the allocated actual operand; discard rest guards keep their existing
CompletionValueId identity. Preserve guards, checks, effects and strip behavior.
No generated names enter DTS or public export/property/schema names.

### C. Late producer composition and explicit limits

Keep existing completion finalizer, host-reference/invocation and ICU allocators.
Their allocation algorithms, lifetimes and private protocols remain; D replaces
their incomplete occupancy extraction, superseding v1.0's no-change assumption.
They reserve their own actual completed inputs and share no mutable global state.
Host helper parameters fn/receiver/argv enclose only fixed helper code; inline
support exports live in separate data-URL modules. ICU reserves kwarg expressions
before hoist/branch locals. Prove actual canonical composition with these paths;
do not claim the existing raw ICU tests ran canonical analysis/emission.

Raw codegen writes supplied bindings literally; it does not perform Source
reservation. Raw unfinished private metadata/address-map limits remain unchanged.
An unordered ICU HashMap hoist traversal surfaced in read-only source census;
no determinism/effect repair or new behavioral finding is claimed here. Keep
that inspection limit for later ownership, not a new experiment or hidden waiver.
Determinism here is fresh emitter allocation for the same owned unit; do not
promise whole-compiler byte determinism for unordered ICU hoist populations.

### D. Correction01 — shared physical identifier occupancy

Binding amendment within operator-authorized S05: honor the actual existing
atom writer, including static dotted/computed member spellings. This is a
conservative occupancy set, not source-binding resolution, JavaScript syntax
validation, new grammar or a protected-host policy change. The initial real
attempt11 failure is retained; additional late-family cases below are proposed
controls until actually executed, not retrospective runtime findings.

Add crate-private
`codegen::names::reserve_emitted_atom_names(raw: &str, occupied: &mut HashSet<String>)`.
Recommended concrete implementation:

1. Use EXISTING `JsWriter::new`, `emit_atom(&mut writer, raw)` and `finish()`
   to obtain the actual emitted atom text. Reusing the writer handles the exact
   normalization, colon segmentation and private-member prefix; do not mirror
   those rules or split raw dots before normalization. Retain legacy complete
   normalized and normalized-colon-segment reservations in addition to the
   physical identifier runs. For ordinary no-colon atoms physical text already
   equals that normalized value; avoid gratuitous normalization duplication.
2. Conservatively reserve every identifier-shaped run in that emitted text:
   ASCII letters/digits/underscore/dollar and non-ASCII non-whitespace characters.
   Treat char.is_whitespace() and U+FEFF as separators. This is intentionally
   broader than JavaScript identifier grammar: property/quoted/numeric extras
   may occupy a name without acquiring binding authority. Computed-key reads
   inside a legacy atom, such as box[t__gensym0], must be included, not only
   the root before its first dot/bracket. Literal SExpr strings remain ignored.
3. Before extracting runs, decode STATIC JavaScript Unicode escapes in the
   emitted atom text: fixed four-hex `backslash-u` and braced scalar escapes.
   Do not normalize the decoded runs again. Only allocate an auxiliary decoded
   representation when an escape is present. A checked UTF-16 buffer can retain
   fixed-u4 code units and combine adjacent surrogate units through the standard
   decoder; a valid braced scalar encodes its units. Invalid/incomplete/overflow/
   out-of-range escape input stays ordinary text and never panics. Validate byte
   ranges/UTF-8 boundaries before slicing; use checked numeric conversion.
   This does not validate an otherwise malformed JavaScript atom or promise
   successful execution for it. No regex/parser dependency or AST clone.
4. Scan/decoding traversals must be bounded by text length, with no repeated
   suffix materialization. Existing to_js_identifier already rebuilds suffixes;
   its inherited cost is NOT repaired or claimed linear here. The borrowed
   source traversal still avoids repeated subtree scans.
   Parse braced escapes incrementally and stop at the first invalid nonhex
   character; do not repeatedly search the entire suffix for a closing brace
   before validation. Invalid nested prefixes must not introduce a quadratic
   scan. Fixed-u4 lookahead is bounded; preserve invalid text without a panic.

Generated candidates must compare/store keys in the SAME physical identifier
domain. Add crate-private `emitted_identifier_key(raw_generated_name: &str) -> String`
using actual emit_atom and the shared static-escape decoder; generated names
are single binding identifiers, so this is a key rather than an expression
token set. EmitterGensym next/preferred compare and insert that key while
returning the existing RAW candidate spelling. For ICU's GeneratedNameAllocator,
preferred/suffix names are ALREADY emitted text written directly: use the same
decoder for their key WITHOUT normalizing again. Keep suffix order, checked
failure behavior and returned raw text. ASCII completion/host candidates already
use physical keys and need no new allocation scheme. This aligns our private
storage keys; it does not resolve escaped SOURCE binder/protected-root identity.

Route ordinary atoms/names at ALL five reservation consumers through this one
helper, preserving their existing traversal/ownership and allocator schemes:

- emitter/gensym.rs reserve — source/reconstructed fields before early allocation;
- forms.rs reserve_emitted_names — completion finalization AND local match sets;
  preserve its leading CompletionValueId branch and descendant-marker bool;
- codegen/names.rs GeneratedNameAllocator::reserve_expr — ICU input occupancy;
- codegen/host_references.rs prepare visitor — private metadata/address census
  and ordered finite alias allocation remain unchanged;
- codegen/host_invocation.rs normalized_payload_names — anchors, support choice,
  helper construction and checked allocation remain unchanged.

Early occupancy alone cannot repair the separate late sets. Do not change
protected_host's binder/root selection, source logical identities, AST tags,
symbolic private requests or public/browser compiler behavior. In particular,
this correction does not resolve escaped source binding identity or escaped
protected-root classification; S07/LI-04 retain that separate boundary.

Extend the existing four native/two CLI groups, retaining all prior controls:

- Actual attempt11 dotted foreign await root must run8 in both modes. A
  computed-key early specimen `some-> 7 (+ box[t__gensym0])`, with foreign
  t0=99/box99=5/box7=100, must run12 rather than107. A static escaped physical
  root equivalent to await__gensym0 must run8; use Rust raw fixture strings so
  the escape reaches the actual compiler rather than being decoded by the test.
- Include actual post-normalization extraction, private-member text and Unicode
  code-unit/scalar cases in focused helper tests, plus malformed/incomplete
  escapes that cannot panic. These test the new extractor's actual contract;
  do not substitute them for real generated runtime consumers.
  Candidate-key controls must work in both directions: reserve a literal name
  then allocate its escaped gensym/preferred alias; allocate one escaped spelling
  then an equivalent spelling. ICU's already-emitted preferred text must use
  decoded keys without a second normalization. These distinguish consistent
  candidate insertion from a collector-only fix; no source binder is renamed.
- Completion: typed discarded parameter and body reading foreign
  completionValue__gensym0.child must retain foreign41. Require actual private
  completion storage distinct from that root. Its input is source `_`, not an
  invented ordinary binding named completionValue.
- ICU: actual canonical template plural selector with kwarg `_v0.child` (foreign
  object count5), and a computed-key kwarg reading `_v0`, must preserve the
  supplied counts rather than a generated selector's TDZ. Raw native ICU entry
  uses the same helper and retains literal/API boundaries.
- Host references: typed number check plus foreign dotted
  lyknIntrinsicNumberIsNaN0.child must retain41 while a real intrinsic alias is
  generated separately. Invocation: reuse the actual pure-colon-call shape in
  test/fixtures/ordered-member-calls/pure-colon-call.lykn and let the called
  method read foreign lyknHostReflectApply0.child41. Verify actual invocation
  support exists as well as runtime41, so a no-request fixture cannot pass.
- Run representative early dotted/computed/escaped native JSON outputs through
  the existing real kernel compiler client. Public ICU/name producers remain
  S06: do not claim their raw static-atom reservation was fixed by Rust changes.

Observe valid actual errors and guard/strip differences; a family whose guard
or helper disappears on strip must be described accurately. Full final gates
remain mandatory on the corrected source; earlier focused successes are not
acceptance of the newly exposed path.

## Exact source scope and proof

Initial seven product paths are retained:

1. crates/lykn-lang/src/emitter/gensym.rs
2. crates/lykn-lang/src/emitter/source_names.rs (new)
3. crates/lykn-lang/src/emitter/mod.rs
4. crates/lykn-lang/src/emitter/forms.rs
5. crates/lykn-lang/tests/generated_name_hygiene.rs (new)
6. crates/lykn-cli/tests/generated_name_hygiene.rs (new)
7. docs/guides/06-functions-closures.md (bounded native helper/API boundary teaching)

Correction01 adds ONLY these three paths, for ten total:

8. crates/lykn-lang/src/codegen/names.rs
9. crates/lykn-lang/src/codegen/host_references.rs
10. crates/lykn-lang/src/codegen/host_invocation.rs

No dependencies/locks, JS compiler, resolver/AST, protected policy, DTS emitter,
or M6 population edits. The v1.0 late-codegen no-edit restriction is superseded
ONLY for D's shared occupancy helper and its named callers. Existing forms/gensym inline tests
may change only when asserting intentionally replaced helper spellings; retain
their useful behavioral assertions. Baseline compiled fixtures/evidence and
failed attempts belong in this slice's artifacts/, not source artifacts/.

The [three actual root baselines](artifacts/root/baseline/README.md) were run
before product edits on the accepted optimized binary: compile0/run1 for the
duplicate typed result parameter and args TDZ, compile0/run0 with wrong `[ 7 ]`
for foreign args99. Additional variants below remain planned, not claimed runs:

- Typed scalar parameter `result__gensym0` and normalized spelling
  `result__gensym0!`, absent from the body, with `:returns :number` and body7:
  checked JS must parse and return7 instead of redeclaring the parameter.
  Repeat with nested typed object/array leaves, defaults and later callable
  siblings to reject an incomplete raw-expression-only census.
- Multi fixed clauses with typed parameter `args` must return7/"ok" rather
  than `const args = args[0]` TDZ. A foreign global args99 read from clause body
  must remain99 rather than seeing the dispatch array. Keep arity/type/no-match
  TypeError and ordinary noncolliding overload behavior.
- Actual some-thread, dissoc, await hoist and checked yield/result producers:
  opposing source/foreign t__gensym0/rest__gensym1/await__gensym0/yv__gensym0
  names, including bang-normalized spellings and colon roots. Check values and
  exactly-once effects, null/throw/iterator timing; SyntaxError is never the
  desired error oracle. Counter-number text alone is not behavioral proof.
- Checked/stripped behavior, `_` discard versus `_value`, object/schema data,
  original return/post/rest diagnostic labels, host fallback/private-marker and
  ICU composition. Existing S04 strict DTS consumers must stay green.
- Fresh/repeated/interleaved AnalyzedUnits allocate locally. Public emit_form
  reserves its complete one-form typed fields; failed then successful reuse
  clears existing fatal/mode state and does not capture names. No future-sibling
  or raw-writer Source guarantee is inferred.
- Real `.lykn`/`.lyk` check+compile, checked/strip execution and --kernel-json
  consumed by the actual staged/canonical JS kernel compiler; compare real
  outputs. Actual `lykn build` package exports/declarations must contain only
  source public names and execute fixed overloads. No handwritten replacement IR.

The real JSON consumer is packages/lang/compiler.js `compile(exprs)`2296–2306,
not a Source expander or an invented reader/json Rust API. A static product
client imports that function using the existing project.json configuration,
JSON.parses the ACTUAL CLI output, compiles its typed-node array, then imports
the produced ESM as a data URL. The selected fixtures have no relative imports.
Ordinary atom/list/cons nodes already match emitter/json.rs's actual schema;
do not use the unused bridge helper's shared global temp file or create a new
public accessor. This does not settle arbitrary bound-keyword JSON transport,
which retains S07's owner.

Use four meaningful native integration groups and two CLI groups; local fixture
organization is discretionary, promised producer/scope cases are not. Reuse
existing reader→resolver→classifier→owned analyze→emit/codegen and Rust TempDir/
Command patterns. Named Rust product tests and static runtime compiler clients
are allowed deliverables, not new helper/replay frameworks. Prefer focused
`--nocapture` semantic receipts over new evidence machinery/environment knobs.

Concrete source sketches for the expression-producer group (not yet executed;
baseline README records only the three actually run checks):

```clojure
;; Some-thread: intended106; old generated t0 can capture the source99 as7.
(bind t__gensym0 99)
(console:log (some-> 7 (+ t__gensym0)))

;; Separate fresh fixture: intended9; old rest1 initializer can be its own TDZ.
(bind rest__gensym1 (obj :drop 7 :keep 9))
(bind kept (dissoc rest__gensym1 :drop))
(console:log kept:keep)

;; Separate fresh fixture: intended8; await-hoist storage must not hide source7.
(bind await__gensym0 7)
(console:log (some-> (await (Promise:resolve await__gensym0)) (+ 1)))

;; Separate fresh fixture: intended7; checked yield storage must not hide source7.
(bind yv__gensym0 7)
(genfunc numbers :args () :yields :number :body (yield yv__gensym0))
(bind iterator (numbers))
(bind item (iterator:next))
(console:log item:value)
```

Use independent fresh units for these counter-opposition fixtures. Add effects/
short-circuit/error/iterator-state observations where promised above; literal
result equality alone cannot establish those timing claims. If actual existing
lowering enters a different producer, report and adjust the fixture to that
producer before claiming coverage; do not change the language to fit a sketch.

Gates: fresh staged artifacts before dependent consumers; focused new native
and CLI targets; one final make check/docs once with existing M6 evidence env
set BEFORE execution. Inspect actual unchanged7-path M670/all14 comparisons,
not outer Cargo alone. Commit the exact current ten paths with adjacent coauthors, then
final-HEAD citations and fresh81920 size. Independent Sol source-first review
precedes fresh independent gates; every NH row stays open until its verifier.

## Guidance, evidence and closing

Applied Rust AP-09 (AVOID): preserve recoverable diagnostic propagation and
document the finite counter invariant rather than unchecked wrap. AP-12/13
(AVOID): one borrowed exhaustive traversal, no AST clones or temporary flattened
collections. Testing Discipline/Proportionate Proof: real opposing values,
actual generated consumers and mandatory repo checks; no new general verifier.
Prompt-authoring guide07: complete producer/caller recipe and required intake
before edits; S04 retrospective requires actual role inputs, absolute artifact
homes, valid full clients and exact message files rather than vague receipts.

Canonical intake:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice05-native-generated-name-hygiene/artifacts/cc/intake.md`.
Canonical close: same slice-root closing-report.md. Root owns planning Git/rows;
CC writes its intake/close/evidence, Sol writes its own review/receipts. Fresh
owned caches use `/private/tmp/lykn-arc05-s05-{root,cc,cdc}`; shared warm DENO_DIR
is `/Users/oubiwann/Library/Caches/deno`. Retain significant raw failures and
final semantic/gate receipts, actual source/tree/profile/cache/skip/warning/
untraced-child limits; do not create routine archives or reconstruction tools.

All helper/script/orchestration/validator/evidence-processing/JSON/command logic
must be Lykn, never Python/Ruby/Fennel/handwritten JS/Node or substitute scripting.
No Python execution or parity exception. Direct shell/Git/simple file lifecycle
and the named Rust product tests/static compiler runtime fixtures are allowed.

Close all eight NH rows independently, root retrospective and BS-05/parent
reconciliation before reporting S05 complete. Arc06 LI-04 owns API/output/guide
impacts; S06/S07/S08/S09 and original qualified/library/research/reader/book/
human/licence/composition criteria remain open. MPVR stays Arc02; alias
bound_names remains only its existing watch. No source renaming or ADT activation.

## Assignment and version history

- 2026-11-14 v1.1/correction01: preserve initialfa6562a candidate and actual
  dotted-root TDZ; replace whole/colon-only assumptions with D's shared physical
  identifier census across early/completion/host/ICU consumers. Add three exact
  codegen paths, same8NH/four-native/two-CLI groups,1/5 on dispatch. No public
  binder/protected-root policy or source grammar change. Final separate Sol
  source-readiness PASS covers all five collectors and physical candidate keys;
  correction01 issued with committed metadata,1/5 on dispatch. Source/build
  transfers to the existing Luna CC only on explicit dispatch; all8NH stay open.

- 2026-11-14 initial cc-prompt.md: separate Sol source-readiness PASS confirms
  the complete census/producer/consumer recipe, explicit failed-context retention,
  JSON compiler route and dynamic-eval/raw limits. Root read the actual failure
  counter/mode tests and reconciled the clarifications before issue. Issued with
  committed open set; all8NH open,0/5 refinements. Exclusive source/build moves
  to fresh Luna CC only on explicit dispatch; root retains planning Git/index.

- 2026-11-14 v1.0: Source-grounded S05 draft at acceptedc0ed, seven product
  paths/eight NH rows, same models/Autonomous endpoint. Separate readiness and
  committed issue complete the open set; no refinement spent.
