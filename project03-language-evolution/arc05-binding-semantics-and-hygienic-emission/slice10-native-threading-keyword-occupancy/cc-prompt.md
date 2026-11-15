# CC initial assignment: native threading-keyword occupancy

Project03 / Arc05 / S10. Execute this initial implementation assignment,
return six TK row proposals to separate Sol reviewer; do not open S07.
2026-11-14 Operator authorizes checking the native keyword watch, repairing it
if reproduced, and independent validation, Luna6 High CC/Sol6.1 High CDC,
Autonomous Mode. Root's two actual native reproductions already establish the
defect at a44; do not repeat a broad research investigation. Root owns plans,
planning Git/index and acceptance. You own task source/build only upon root's
explicit committed dispatch, until clean handback. Five formal corrections max.

## Homes and required reading

Source /Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering,
codex/qualified-adt-core, clean a44e16db96ca4ae76de124b555c34ffe2c2779ba /
tree4080ee3f7be200610814b39b4118d2b5f3062ca8. Release stays82f1b65b. Planning
/Users/oubiwann/lab/lykn/lang/.worktrees/planning; this prompt's slice root is
project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/
slice10-native-threading-keyword-occupancy/. Durable evidence goes only in its
artifacts/cc/, your closing-report.md beside this prompt. No planning Git/
ledger edits. No source edits by other contexts while you own the build.

Load the manifest BEFORE dependent edits; read complete extents, recover
truncation using bounded contiguous reads, and record extent/revision plus a
brief source-cited contract readback in artifacts/cc/execution.md. Counts/hashes
or another agent's receipt do not establish reading. Resolve consequential
contradictions with root; coherent preflight is authority to implement, not a
new permission gate. Existing installed skills resolve through session catalog.

1. Required-full: this prompt, sibling slice-plan.md and ledger.md; task
   source AGENTS.md. Root's baseline execution.md and two .lykn/.mjs specimens
   plus runtime stderr/stdout under artifacts/root/baseline/. Identify actual
   generated binding/read capture and both intended7 results.
2. Required-section: Arc05 arc-plan.md current S10 authority and candidate
   S10/S07 roadmap rows/verification limits; original S06 native watch is
   reference-only history, superseded as evidence by the actual baseline here.
3. Required-full: installed rust-guidelines SKILL.md and guides/11-anti-patterns.md;
   testing SKILL.md and guides/01-testing-discipline.md/03-validation-gates.md.
   Apply Rust AP-02 borrowed slices/str, AP-12/AP-18 no source clone, AP-26
   private free role helpers, AP-58 ordinary borrowed iteration. Existing
   finite gensym invariant/error model stays unchanged. No new unsafe/API/type.
4. Required-section: engineering-methods guides/07-implementation-prompt-authoring.md
   "Required reading and CC intake" in full; collaboration-framework canonical
   Autonomous Mode in engineering-methods guide01. Repository domain selection
   remains binding; this prompt's source recipe bounds the new work.
5. Required-full actual source: emitter/source_names.rs; emitter/gensym.rs;
   crates/lykn-cli/tests/generated_name_hygiene.rs.
   Required-section: emitter/mod.rs emit/emit_json and its reservation entrance;
   emitter/forms.rs emit_form and emit_expr classification path, threading /
   some-threading sections; codegen/emit.rs emit_method_call; codegen/names.rs
   reserve_emitted_atom_names/emitted_identifier_key with their normalization/
   decoder dependencies; ast/surface.rs ThreadingStep/four thread fields.
   Read complete needed definitions; this is source revision a44.
6. Required-section: docs/guides/06-functions-closures.md "Compiler-generated
   helper names". Lykn source skills/lykn/SKILL.md Before You Do Anything,
   Functions, threading guidance, Bindings & Mutation, CLI/Deno/no-Node; use
   existing native Source fixtures as the actual compiler spelling authority.
   CONTRIBUTOR Cargo/Make/Deno use is authorized by AGENTS, not user workflow.
7. Conditional: javascript-deno-guidelines entry/relevant JS anti-patterns before
   adding/editing a STATIC PRODUCT JS consumer string inside the named Rust
   test. No new standalone JS/helper program. Reference-only prior S06 gate
   receipts show M6 shape, not acceptance for this new native source revision.

## Binding design and recommended implementation

Exactly three product paths: source_names.rs, generated_name_hygiene.rs,
docs/guides/06-functions-closures.md, as listed in slice-plan.md. Preserve
existing cases. No other production source/JS/mirror/dependency/schema/API/
grammar/protected-host/DTS/CLI changes. If actual source contradicts the recipe,
report the concrete gap to root; do not opportunistically redesign the resolver.

source_names.rs currently visits Surface steps using generic expr/exprs; expr
ignores every keyword. Yet apply_threading_step turns a Bare keyword or Call
HEAD keyword into an executable member atom, whose computed identifier reads
are written by codegen. Nested emit_expr does not call public emit_form's census.
A late fix at apply_threading_step therefore misses enclosing typed result and
await/temp producers. Repair the existing COMPLETE owning-input census instead.

Recommended private borrowed functions (names local discretion):

```text
bare_step(expr):
  Keyword(value): text(value, names)
  otherwise: ordinary expr(expr)
raw_step(expr):
  List(values): thread_call(values)
  otherwise: bare_step(expr)
thread_call(values):
  empty: return
  keyword head: text(value, names)
  otherwise: ordinary expr(head)
  each tail argument: ordinary expr(argument)
```

Surface threading dispatch: ordinary expr(initial), then Bare→bare_step,
Call→thread_call on borrowed slice, for all four variants. Raw SExpr::List:
if first atom is exactly ->/->>/some->/some->>, ordinary expr(head/initial),
then raw_step on each remaining item; otherwise existing exprs(values).
The Surface tag is binding: Bare(List(...)) is an ordinary expression, not a
Call step. Thus a Bare containing a genuine raw thread must reach expr's raw
head recognition and reserve that inner thread's keyword; a Bare containing
an ordinary keyword-headed list must not reserve its keyword as a method.
No AST clone, parse/classify roundtrip, new allocation/state/decoder. Existing
text→names.reserve handles actual member normalization/static Unicode. Preserve
generic recursive Cons/list traversal and all other Surface fields/metadata.
Raw syntactic-head recognition is conservative occupancy, not a binding resolver.
Ordinary data keywords/strings, initial keyword and keyword call ARGUMENTS stay
excluded; a nested argument that itself is a genuine thread is visited normally.
Empty malformed call/list boundaries remain no panic; existing lowering owns
admission/errors. Preserve borrowed source and exact private identities.

Guidance: extend existing helper-name section with the executable keyword-step
role and ordinary-data distinction. Do not promise arbitrary raw JS names,
exact source-binding resolution or general macro hygiene.

## Concrete proof and wrong-implementation controls

Use source strings/real AST constructors and existing Rust product process
helpers. Every collision fixture starts a FRESH compiler/context so suffix0
is genuinely opposed; don't concatenate cases and let counter advancement
mask the defect. Actual compile success alone is not runtime success.

Eight families = four heads × two steps: `:child[INDEX]` and
`(:child[INDEX])`. For some->/some->>, set globalThis["t__gensym0"]=0 by
Source `(set-symbol! globalThis "t__gensym0" 0)`; compile and execute
`(console:log (HEAD (obj :child (array (fn () 7))) STEP))`. For ->/->>, set
global result__gensym0=0 by string key and place the same thread inside
`(func pick :args () :returns :number :body THREAD)`, then `(console:log (pick))`;
INDEX is result__gensym0. Checked mode's enclosing result0 must be excluded.
Actual .lykn AND .lyk, checked AND --strip-assertions (32 compile/runtime cells):
expect exact stdout `7\n`, exit0, empty runtime stderr; compiler warnings may
be retained. Stripped mode removes the typed result local, so don't demand its
existence there. Assert the foreign computed reference stays unchanged and
the conflicting generated binding is absent in the relevant checked/null-safe
consumer. Never inject an ordinary atom reference to INDEX into a collision
fixture: it would mask this keyword-only defect. A separate ordinary-atom
control can use `(bind observed-index t__gensym0)` and must also return7.

Add one escaped keyword method `:child[t\u005f\u005fgensym0]` represented as
literal backslash-u in Source; actual index global t__gensym0=0, some-> returns7.
This tests existing physical mapping reuse, no new escaped binding policy.

Inline source_names tests must explicitly exercise each of four actual Surface
forms with both Bare/Call keyword role, and raw lists under ordinary container
traversal. Exact census oracle: fresh EmitterGensym.next("t") skips opposed
t__gensym0→t__gensym1. Meaningful negative: only ordinary data keyword/string,
thread INITIAL keyword or CALL ARGUMENT keyword t__gensym0 must leave next("t")
at t__gensym0. Also cover tagged Surface Bare(List(genuine raw thread)) to
reserve its inner executable keyword, versus Bare(List(keyword-headed data))
which leaves data excluded. Mixed roles cannot mask a missed negative. A real public
emit_form call on an actual Surface threading form, with context/reg in the
test, must reserve before lowering; assert next candidate/executed output or
actual emitted conflicting-binding separation. Existing complete-unit CLI
fixtures exercise nested raw forms and enclosing timing; no source-shaped mock
IR or new public accessor is needed. Test constructors may borrow/own as actual
APIs require; no production clone solely for traversal.

Preservation controls in the named Rust test: null some-thread executes no
computed selector/argument effect (counter remains0); ordinary -> versus ->>
noncommutative argument order (e.g. subtract100 with initial7 yields -93 versus
93); once-only receiver/argument effects for a keyword call. Use real Source
cells/objects/functions and assert exact value/count/trace. Keep the examples
small; do not invent malformed Source or a general runtime harness. For kernel
JSON, compile one keyword collision through actual CLI --kernel-json and feed
the actual serialized kernel to existing packages/lang/compiler.js compile,
then run output: exact7, unchanged foreign reference, normal private protocol.
Reuse the existing static test-client technique, with no hand-authored AST or
replacement codegen. Keep existing two tests and their private/package checks.

## Gates, environment, commit and return

Precreate your owned absolute tmp/xdg/npm directories BEFORE setting TMPDIR.
Explicit `DENO_DIR=/Users/oubiwann/Library/Caches/deno`; owned cold XDG
materialization is not cold dependency/network proof. Keep exact command,
full streams, terminal exit/session and actual selected populations in
artifacts/cc/execution.md and existing gate logs; failures retain distinct
attempt outputs, unknown exits remain unknown. Existing pinned dependencies
may use ordinary approved escalation. Do not weaken or skip a gate on network
failure, silently change cache semantics or start a probe outside this question.

Run `cargo test -p lykn-lang emitter::source_names -- --nocapture` (actual
nonzero new selection), and `cargo test -p lykn-cli --test generated_name_hygiene
-- --nocapture` (existing2 plus actual new cases). Run fresh artifacts before
any public/browser stage consumer if not refreshed after source build. Then
ONE `make check` with docs ONCE, precreated unique absolute
LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR in artifacts/cc/ for actual M6. Inspect
strict child status/stdout/stderr8paths/78cases and all15 actual comparison
VALUES; inherited M6 counts must not be guessed from outer Cargo success.
Record profile/cold XDG/warm DENO and no same-version cache invalidation claim.
No M6 membership changes are authorized. Full tests counts must be derived from
actual result records; preserve existing docs15 skips/no-block notices and DD53
network-dependent boundary rather than treating them as external registry proof.

Commit exact three paths with message-file and adjacent trailers:
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
Use git commit --only with explicit path list. Final committed HEAD
`make check-cited-paths` and fresh `make bundle-size-check`, existing81920 gate.
No blanket staging, force, unsafe, ignore/snapshot weakening or other source edits.
Write canonical closing-report.md: assignment/revision/tree, all six TK proposals,
actual counts/commands/limitations, complete artifact inventory, findings/failures,
silent-drop accounting and bubble-up to Arc05/Arc06/Project07. Root handles
retrospective and rows. Return clean source/build, no jobs and exact pin; separate
Sol must inspect source/proof and rerun required gates before acceptance.

All helper/script/orchestration/validator/evidence-processing/JSON/command
construction logic MUST use Lykn. No Python execution, migration-parity
exception, Ruby/Fennel/handwritten JS/Node/awk substitute is permitted. Only the
named Rust PRODUCT tests and their bounded static JS product consumer are
allowed; this does not authorize JS deno-eval investigation helpers. Direct
shell/Git invocation and simple filesystem lifecycle remain allowed. No new
runner/archive framework, dependency, licence, release integration, external
message, publication, S07 or library work is authorized by this assignment.
