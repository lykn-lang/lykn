# S05 independent CDC verification

## Source-readiness verdict — PASS — 2026-11-14

Separate selected Sol6.1 High reviewer `/root/arc05_s05_cdc` inspected the actual
unissued S05 draft: slice-plan.md285 lines, cc-prompt.md182 lines and ledger.md14
lines/eight NH criteria. Root supplies the stable source baseline
`c0ed454610f3a384196e4fa003335373819fb2fd`, tree
`7d8b3359fa570b2e8322996dbe8b648f02af58da`, branch
codex/qualified-adt-core, at
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Source was read in that assigned home. This pass did not independently execute
Git/status/hash checks: root retained exclusive source/build/index ownership.
Planning is the separate orphan worktree; release remains the supplied c60.

**The revised draft is source-ready for committed issuance of its exact seven
product paths and unchanged eight NH criteria. No material readiness finding
remains.** This is review of an implementable contract, not implementation or
runtime acceptance. NH-01–08 all remain open. No refinement is spent by these
pre-issue clarifications, and no S06/integration/push/publication is authorized.

### Source and design reconciliation

- The borrowed census covers every current SurfaceForm variant in
  ast/surface.rs:257–475 and the separate typed/default/alias structures at
  4–60, clauses/constructors/patterns at152–207 and class members at233–254.
  It includes retained raw expressions and reconstructed String fields rather
  than treating typed_params()/bound_names() as complete source identity.
  Conservative occupancy of property/alias strings does not turn them into
  local bindings or activate S07's source-binding rewrite.
- Canonical seeding before the forms loop fits emitter/mod.rs:32–54. Public
  forms::emit_form is the only public typed-form entrance (forms.rs:282–302);
  emit_expr/emit_expr_inner are private at622/632 and recurse through
  emit_form_inner at762–764. One census at each supported entrance therefore
  covers nested classification without repeated subtree scans or depth state.
  Future sibling protection belongs to the complete-unit API.
- The actual early users are value_box carriers (226–233), dissoc discard/rest
  storage (3462–3480), some-thread temporaries/await storage (3568–3667), checked
  single/multi results (4080/4161/4315), yields (4592–4644), and local match/
  if-let/when-let helpers through next_unreserved_gensym (4803–4815 and callers).
  The scoped searches found no additional early name producer outside these
  families. Existing local match reservations can conservatively compose with
  the proposed owned emitter occupancy.
- Both fixed binding roles are addressed concretely: all multi-clause `args`
  storage/read/length sites at4230–4277 share one preferred allocation; named
  rest element storage at3764–3778 uses preferred allocation while retaining
  the old diagnostic label. Source parameters, `length`, field/schema/export
  names and DTS labels retain their roles. Discard identities remain private
  CompletionValueId values, finalized by the existing completed-kernel scan.
- The owned HashSet and monotone candidate counter do not require global state
  or iteration over the set. Borrowed traversal and one preallocation scan fit
  the AP-12/AP-13 guidance. Checked exhaustion with an invariant message follows
  the existing completion identity pattern (context.rs:53–59); malformed source
  keeps recoverable errors. The specified reset deliberately starts a fresh
  counter and occupancy namespace, while canonical emit always creates a new
  context.

### Pre-issue clarifications now present

The reused fragment namespace is not rolled back after failure. Existing
emission_results.rs:175–188 actually observes seed0, a failed emission and
probe2; its136–147 test separately checks mode restoration and error clearing.
The revised plan explicitly retains consumed counters and reserved/allocated
names while preserving those mode/fatal rules. This removes an otherwise easy
partial-work ambiguity without changing the established failure contract.

The revised plan also bounds occupancy to static source-visible names.
forms.rs:2965–2972 emits dynamic eval without parsing its string text, so no
dynamic-eval namespace-isolation guarantee follows from ignoring literal data.
That explicit limit is consistent with this repair; it is not a new defect
claim or a proposal to parse strings or expand source-renaming scope.

The actual JSON consumer is verified: emitter/json.rs:20–71 produces typed
nodes; packages/lang/compiler.js:2296–2304 consumes the array through compile.
The revised packet names CLI --kernel-json, JSON.parse, the existing configured
compiler import and execution of the resulting ESM, with no relative imports
in selected fixtures. This uses the real API without exporting a Rust accessor,
using bridge.rs's shared temporary file or constructing replacement IR. Its
bound-keyword/private-metadata limits remain explicit and separately owned.

### Late composition and feasible proof

The unchanged late producers reserve actual inputs: completion finalization
scans completed kernel forms; host aliases reserve normalized atom segments;
ICU reserves all kwarg expressions before generated hoist/branch locals.
Canonical emitter::emit materializes invocations then lowers host references
before later JS/JSON consumers. Raw writer address maps and fragment rejection
remain separate. Fixed fn/receiver/argv parameters enclose only fixed invocation
code, and inline support export names live in separate data-URL modules.
The unordered ICU HashMap observation is explicitly not repaired or promoted to
a whole-compiler determinism/effect claim by S05.

The three retained root baseline sources, generated modules and complete runtime
streams were read. They show the intended opposing cases in inspectable text:
typed duplicate declaration, `const args = args[0]`, and foreign args99 replaced
by the dispatch array. Their compile/runtime exit provenance remains root's
record, not fresh reviewer reproduction. Repaired values7/7/99 and successful
execution distinguish the requested behavior from those old results.

The proposed tests use accessible canonical APIs and existing Rust Command/
TempDir patterns. Four native groups/two CLI groups retain reconstructed typed
and nested/default fields, normalized/candidate-suffix collisions, later siblings,
producer values/effects/null/throw/iterator timing, fragment recovery and late
composition. The packet expressly requires checking the actual input role and
wrong implementation rejected, rather than accepting counter text or a sentinel
inside SyntaxError. Existing admitted-source/MPVR limitations remain separate.

CLI main/compile flow really reaches owned analysis → emitter::emit → codegen
or JSON. Existing discard_declarations.rs:692–785 supplies the actual package
configuration/build/output/sidecar/runtime route. No package-code change or new
dependency is needed merely to consume the protected producers. The unchanged
S04 strict declaration suite remains required. Existing M6 capture requires an
absolute precreated evidence directory; the packet preserves its seven selected
paths,70 tests and14 file comparisons rather than replacing inner proof with an
outer Cargo exit. Fresh artifacts, final make check including docs, final-HEAD
citations and fresh81920 size remain mandatory future execution gates.

### Actual loading and inspection extents

These are text reads and scoped source queries, not execution receipts.
Clipped early combined output was recovered with smaller focused reads.

| Material | Loaded extent |
| --- | --- |
| Current S05 contract | Complete final slice-plan285, prompt182 and eight-row ledger14; earlier draft reads retained only as preparation |
| Baseline evidence | Complete README and all three .lykn/.mjs/stdout/stderr files under artifacts/root/baseline |
| Prior lessons | Complete S04 retrospective; S04 verification341–399 and484–561, covering final source/closing verdict and attribution limits |
| Repository/AST | Complete source AGENTS.md; ast/surface.rs1–510; complete emitter/gensym.rs and context.rs |
| Emitter entrances | emitter/mod.rs1–240; forms.rs1–819, including public/raw/finalization, private recursive dispatcher and carrier construction |
| Early producer details | forms.rs2937–2982,3435–4645;4670–4865,4855–4946,5035–5105,5178–5265,5315–5407,5470–5575 |
| Late producers/raw limits | Complete host_references.rs and host_invocation.rs; names.rs1–80; codegen/mod.rs1–150; format.rs1–150; emit.rs51–205,477–575,1307–1348; ICU493–625,625–746,745–920; emitter/json.rs1–82 |
| Existing native proof | Complete emission_results.rs1–318; ICU cross-compiler helpers1–85 and regressions452–623; bounded codegen module tests151–215,328–455,625–690,701–742 |
| CLI/package/JSON | CLI compile.rs170–214,238–275; dist.rs238–265; main.rs169–188,502–526; bridge.rs1–100; compiler.js2285–2305; complete CLI remaining_discard_bindings.rs1–156; discard_declarations.rs692–825 |
| Gate substrate | macro_dependencies.rs1–108,1000–1165; Makefile210–242,354–370; scoped target/caller searches |
| Domain/process guidance | Coordination entrypoint and guides01/02; complete implementation-prompt guide07; testing entrypoint/discipline/validation guides; work-verification entrypoint/independent verification; project-management README; Rust AP-09/AP-12/AP-13/AP-24/AP-25 actual sections; Lykn skill Before Anything and guide06 ID01/generator/thread/multi-clause sections |

Scoped rg searches covered emitter next/fixed names and callsites, public emitter
entrances, GeneratedNameAllocator users, codegen support callers, compiler/CLI
consumers and M6 definitions. They supplement the named complete body reads;
they do not constitute a full-repository audit or a claim that every test body
was inspected. No source, docs, ledger or index change was made; this verification
record is the sole authorized write. No build/runtime/probe/helper/Python or
external action occurred and no owned job remains. Root retains source/build
ownership and performs committed dispatch only after this readiness return.

## Correction01 source-readiness verdict — PASS — 2026-11-14

The same separate Sol6.1 High reviewer inspected the actual unissued v1.1 plan
and correction01 against root's clean preserved initial source candidate
`fa6562a13ffc1069c06bb98d81cc4561fee68e12`, tree
`71c65689be1c8e3dbc2638aa5a7d60cee89944a0`, parent c0ed. Root owns source/build
and planning/index/status; no Git, build or runtime action was taken in this
review. The source pin/clean state is the supplied ownership handoff, not a
fresh reviewer Git check.

**PASS for committed issuance of correction01 within the amended ten product
paths and the same eight NH criteria. No material readiness finding remains.**
The initial candidate is not accepted. All NH rows/BS-05 remain open;
correction01 spends1/5 only on dispatch. No final implementation, M6, full-gate,
release, S06 or source-binding acceptance follows from this verdict.

### Initial readiness omission and retained evidence

My initial readiness accepted whole/colon occupancy without checking that the
existing writer leaves dotted/bracket member text inside an atom. That was a
real omission in my review, shared with the source design; it is not evidence
that CC failed to implement the issued recipe. The original PASS remains above
as history, with its occupancy-completeness assumption superseded by this pass.

I read the complete preserved attempt11 log and summary. The actual foreign
`await__gensym0.child` specimen emits a helper0 initializer reading that same
root and records Deno exit1/ReferenceError after passing the opposing colon
control. The focused native result is0 passed/1 failed/3 filtered, not a full
suite. This is inspectable doer evidence read here, not reviewer reproduction.
The partial closing report correctly retains the initial seven-path commit,
earlier lint/fixture failures and unknown lost-session result without claiming
final full-gate/M6 success. The initial four/two focused successes establish
their actual cases, not completeness of every promised producer or source role.

### Concrete correction assessment

- Reusing `emit_atom` with a fresh `JsWriter` and `finish()` is a viable exact
  physical-text boundary. names.rs:254–289 handles normalized no-colon atoms,
  per-colon normalization and private member prefixes. JsWriter new/write/finish
  only construct the string here; this path does not prepare support, inspect
  metadata or recurse into reservation. The helper needs no new public API,
  AST copies, dependencies or mirrored normalization rules.
- Lexer default atom handling at163–190 and delimiters337–342 admit the static
  dots, brackets and backslashes in question. Scanning every physical run
  includes computed-key reads, rather than reserving only a leading root.
  Legacy full/colon reservations remain in addition to those runs, preserving
  the existing conservative behavior. Property/quoted/numeric extras are
  occupancy only; they do not become binders or grammar decisions.
- Normalization precedes extraction. `await__gensym0!:child` must use the
  actual independently normalized segment; `box[t__gensym0!]` physically contains
  the embedded-punctuation mapping rather than a separately normalized raw
  bracket token. Actual-writer reuse resolves that ordering without a second
  interpretation of source names.
- Static fixed-u4 code-unit/braced-scalar decoding before run extraction fits
  the physical identifier requirement. The chosen optional UTF-16 path permits
  adjacent units to combine; checked accumulation, scalar/range handling and
  valid UTF-8 boundaries keep malformed input out of panic paths. Invalid text
  remains ordinary text, and decoded runs are not normalized again. This is
  an occupancy contract, not a claim that malformed atoms are valid JavaScript.
- The incremental braced parser constraint is now explicit: stop at the first
  invalid nonhex character rather than repeatedly searching a shared closing
  brace through the remaining suffix. Together with bounded u4 lookahead and
  one run scan this supplies a bounded decoder/scanner route. The old
  to_js_identifier suffix-materialization cost remains disclosed and outside
  the repair; total normalization is not newly claimed linear.
- All five independent input sets are addressed: emitter source reservation,
  forms.rs completed-kernel/local-match reservation, ICU's GeneratedNameAllocator,
  host-reference aliases and invocation helpers. Completion finalization does
  not consult early occupancy, so routing its ordinary-Atom branch is necessary.
  Its leading CompletionValueId branch and descendant-marker boolean remain
  binding; changing them could silently prevent finalization even with a correct
  string collector. Existing allocator order/counters, node identity, request
  anchors, support strategy, lifetime and strip behavior remain unchanged.

No additional obvious static physical-name input hole surfaced within that
bounded collector contract. This is not a general resolver/parser proof.
Escaped source binding identity, source-derived escaped preferred-name identity,
protected-root selection and arbitrary eval text do not become solved by
reservation decoding. The explicit S07/LI-04 and raw/private-metadata boundaries
remain essential; fixed ordinary generated candidate families are the repaired
namespace, not a new guarantee for arbitrary low-level generator prefixes.

### Oracle and scope assessment

The new family setups have discriminating actual consumer routes:

- Dotted/escaped await roots oppose helper0 and require successful8 in both
  modes. The computed-key some-thread input opposes source t0=99 against the
  generated value7, with box99=5/box7=100 selecting12 versus107.
- A typed source `_` parameter creates real CompletionValueId storage. Reading
  foreign completion0.child41 distinguishes late completion reservation from
  early generator seeding; the test must confirm actual private storage.
- Canonical ICU dotted/computed kwargs enter the unchanged ICU allocator. The
  typed number-check fixture creates a real intrinsic alias while the foreign
  dotted alias0 read must retain41. Strip cases must state when guards/aliases
  disappear rather than claiming a nonexistent producer was exercised.
- The verified pure-colon-call fixture is an admitted route to ordered private
  invocation support. Having its called method read the opposing foreign helper0
  root, and asserting actual support/request presence as well as41, rejects a
  misleading ordinary-call fixture with no private producer.
- Early dotted/computed/escaped JSON cases reuse the actual CLI typed-node array
  and existing JS kernel compiler consumer. They do not establish public ICU
  producer repair. Inline malformed/Unicode/private-prefix collector tests
  establish extraction/failure boundaries and supplement the runtime cases.

The initial tests/source are preserved, not accepted. Correction01 keeps all
original promised typed/nested/default/later-sibling/carrier/match/guard/effect/
iterator/lifecycle/package obligations in addition to these new controls.
Later source-first review must inspect their actual input roles and rejected
wrong implementations; four native/two CLI group names alone are insufficient.
The packet keeps final format/Clippy/focused gates, fresh staged consumers,
full make check including docs, real unchanged M670/seven paths/all14 comparisons,
exact ten-path commits/adjacent trailers, final-HEAD citations and fresh81920 size.
Nothing in this readiness pass waives those future checks.

### Correction01 actual loading extents and return

Read complete v1.1 plan413 and correction01 draft141, then the exact added
incremental-parser text at final plan185–210/prompt62–82 (final counts417/143).
Read complete current ledger19/eight rows, partial close75, intake38, attempt11
native log71 and summary2, and current pending root retrospective. Reused the
unchanged initial prompt's already-loaded helper/gate/commit/return rules;
correction01 explicitly supersedes only the named occupancy assumptions and
path scope. The original issued prompt remains preserved.

Source reads for this amendment include complete current source_names.rs344,
gensym.rs and both new product test files (native291/CLI194); complete actual
pure-colon-call fixture; names.rs production1–290; lexer1–215/300–342;
JsWriter new/write/finish; current completion358–389/4824–4859 and typed-rest
3750–3795; protected_host131–189/435–465 for the separate boundary; scoped
collector/caller searches. The prior complete host prepare/validation/alias,
ICU, canonical/fragment and JSON/package bodies remain applicable to unchanged
mechanisms; the initial seven-path candidate did not replace those codegen
algorithms. Actual later-candidate source and gates still require independent
review. An initial planning-path query accidentally ran from the source home,
reported missing paths and was rerun in planning; it supplied no false evidence.

Only this reviewer-owned record was appended. No product/planning contract,
ledger/index, source pin, build, runtime, helper, Python or external action was
changed or executed. No owned jobs remain. Root retains exclusive source/build
ownership until committed correction01 dispatch.

### Final candidate-key amendment pending review

After the collector-only checkpoint above was appended, root held dispatch to
make generated candidate comparison keys use the same physical/decoded identity.
That additional consequential amendment requires review of its actual plan and
prompt text before the final correction01 dispatch-ready verdict. The checkpoint
above does not accept the as-yet-unread candidate-key amendment or authorize
dispatch while this note is current. All eight NH rows remain open.

### Final representation-key assessment — PASS / dispatch-ready

Read the actual final candidate-key amendment at plan195–280 and correction
prompt75–125; final document counts are434/152. These contiguous reads include
the complete new policy, all affected caller instructions and bidirectional
controls. Earlier complete contract reads plus the exact added parser/key text
cover the current draft; no changed policy is accepted from a message summary.

**The full amended correction01 draft is now source-ready for committed
dispatch.** This supersedes the pending note above and the collector checkpoint's
remaining limit concerning our own source-derived escaped preferred-name keys.
There is no unresolved material readiness finding. The initial fa candidate
and original readiness omission remain preserved, and all eight NH rows/BS-05
remain open pending implementation and independent proof.

The added `emitted_identifier_key(raw_generated_name: &str) -> String` supplies
the missing representation agreement: EmitterGensym next/preferred compare and
insert the actual emitted/decoded identifier key, while returning their existing
raw spelling. Thus a source-derived preferred stem containing static escapes
does not bypass a reservation made under its literal physical identity.
GeneratedNameAllocator writes its preferred/suffix text directly, so reusing
only the decoder for that key is the correct separate route; renormalizing
already emitted text would impose a second mapping step absent from its writer.
Fixed ASCII completion/host candidate keys already agree with these sets.

This changes private candidate identity coherently with the new occupancy
inputs, not raw return APIs, checked suffix order, node/request ownership or
source binding resolution. It adds no validity assertion or new panic path for
opaque text: invalid escape handling remains total, conservative and separate
from JavaScript syntax validity. Existing counter/failure/reset rules and the
new bounded decoder/resource policy remain applicable. No global state, AST
rewrite, new dependency or additional product path is needed.

The bidirectional controls now distinguish both missing comparison and missing
insertion: literal reservation versus escaped generated aliases, then escaped
allocation versus an equivalent spelling, in both generator families. They
supplement the actual early/late runtime consumers rather than replacing them.
These are meaningful tests of the new private key contract; they do not establish
escaped SOURCE binder or protected-root classification, which remains separately
owned by S07/LI-04. Public ICU/name parity remains S06.

The final scope is still ten named paths/four native groups/two CLI groups plus
focused helper unit tests and the same mandatory gates. Correction01 spends1/5
only on dispatch. This final assessment is source-only: no tests, build, runtime,
Git/index/ledger action or product edit occurred. This reviewer record is the
only write; no owned jobs remain and root retains source/build ownership until
its explicit committed handoff.
