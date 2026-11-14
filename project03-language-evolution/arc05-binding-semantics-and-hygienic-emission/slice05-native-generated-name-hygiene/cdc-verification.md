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
