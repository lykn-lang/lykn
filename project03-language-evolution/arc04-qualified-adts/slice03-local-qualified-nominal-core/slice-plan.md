---
project: project03-language-evolution
arc: arc04-qualified-adts
slice: slice03-local-qualified-nominal-core
status: active
version: "1.4"
depends-on: [slice01-contract-and-emission-design, slice02-existing-adt-correctness]
---

# Local qualified nominal core

The operator authorized the S02 local release fast-forward, independent
validation, then S03 on 2026-11-11, same Luna 6 High CC and separate Sol 6.1
High CDC, Autonomous Mode. [Release integration](../slice02-existing-adt-correctness/artifacts/release-integration-0829e892.md)
is independently accepted at 0829e892999890e8877dec5e35cd249753e1be5d, tree
d0f802ca4eb1847400c7395f1c203ada3263403b. No push, publication or later source
integration is authorized by this S03 assignment.

Implementation reuses `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on dedicated `codex/qualified-adt-core`, created clean from that accepted pin.
Release stays separate at `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`.
Canonical planning is the existing orphan planning worktree. Root owns design,
parent plans and planning index; CC owns task source/build during assigned
implementation; Sol owns independent checks after explicit handoff.

Deliver the local/single-file part of the [accepted S01 contract](../slice01-contract-and-emission-design/artifacts/qualified-adt-contract.md).
That complete contract governs syntax, static ownership, runtime descriptors,
qualified guard/call/TDZ rules, declaration shape, serialization loss and the
intended migration. Same-module facade access is the semantic baseline, not a
winner of the later reference-lowering experiment. Imported graph/interfaces,
reexports and the two-layout comparison remain S04; actual build/JSON composition
is S05; the full API/docs/book/human gates remain S06/S07. Existing I4 protected
early-return work is separate. Do not silently keep flat constructor dispatch
as the new language contract or select a production optimizer strategy here.

Use bounded engineering increments, preserving all eight LC criteria:

1. **A: protected host foundation.** Independently review and implement the
   finite v2 host contract and hygienic compiler-owned intrinsic references,
   including transitive existing guard/error operations. Existing typed guard
   production paths consume it; no ADT syntax migration yet. This is the initial
   `cc-prompt.md` assignment. Its private lowerer must coexist with protected
   Reflect invocation and preserve ordinary no-request output. A's independent
   acceptance is required before dependent nominal initialization uses it.
2. **B: local metadata and nominal semantics.** Prepare the source-ready
   iteration against accepted A. Fresh per-unit state, typed OwnerRef/CaseRef,
   lexical owners/immutable aliases, static validation and same-module runtime
   namespace/brand/case construction and recursive matching. Preserve real
   qualifier reads and declaration-position TDZ. Migrate the necessary corpus
   rather than maintaining accidental flat global-case lookup.
3. **C: complete consumers and initialization proof.** Finish precise DTS,
   API/CLI/browser-compile/embedded consumers, scoped compiler-owned initialization
   purity provenance (including feature-local support initializers in the ADT
   dependency graph) and its serialization/codegen boundaries, required
   migration and full single-file proof. Typed purity is reviewed before use;
   source-shaped annotations and application constructor calls are not trusted.

These are implementation checkpoints within S03, not reduced scope, extra
acceptance claims or authority to skip later gates. Root issues preserved
numbered prompts after source inspection/readiness for B/C; CC does not invent
their public semantics from the brief. Each usable checkpoint is committed and
independently checked; LC rows close only when their full stated verifier is met.

All new research probes/helpers use Lykn. No Python execution or Python/Ruby/
Fennel/handwritten JS research helper is permitted; product Rust/JS and normal
product tests are in scope. Use existing product harnesses, direct native CLI
and useful bounded receipts; no reconstruction framework, source/binary cache
archives or arbitrary artifact caps. Keep useful failures and issued prompts.
Do not reformat legacy JS whole files or amend already committed evidence.

The source-ready A recipe fixes the finite protected set and capture/alias
policy, preserves unknown/dynamic/foreign limits, and supplies discriminating
runtime and source-write tests. Later initialization-proof work must distinguish
trusted declaration initialization from effectful user expressions. Per-unit
metadata and local nominal changes do not imply all existing builtin keyword
guards are already coherent: public symbol/bigint and native promise behavior
are concrete pre-existing differences to record and route, not hide.

Final S03 validation includes focused native/public default/stripped semantics,
normal CLI, actual embedded delivery and browser path, declaration consumers,
fresh state/alias/TDZ/collision/descriptor/serialization negative controls,
`make check`, committed-HEAD citation and 80 KiB browser gates. No repeated docs
outside make check. A passing intermediate substrate test is not S03 closure.

The browser contract here is compileLykn/the normal compile adapter returning
ESM text, as S01 specifies. Existing browser run/load use indirect eval and
cannot execute emitted fallback imports. Record their expanded affected cases
and route the execution-policy/API impact to S06; this slice does not promise
a new run/load, CSP or module-loader policy. Test browser-compiled output in an
ESM-capable consumer without disguising that distinction.

Root's preparation inspected the actual native/public guard/error producers,
private atom/writer and pointer-anchored Reflect request path, whole/fragment
JSON signatures, browser compile/eval split, CLI call sites and duplicate
embedded package. Sol's separate read-only readiness review confirmed the
finite operations and identified two ambiguities, resolved before issue:
whole-unit JSON lowers refs and returns Result<String,LyknError>, fragment
JSON returns Result<Value,LyknError> and rejects unfinished refs; browser
compile is distinct from existing eval execution. A's alias shape may evolve
under later LC-06 proof; it selects no final optimizer strategy.

2026-11-11 final read-only preparation review by the separate Sol 6.1 High
context supports issuing increment A after those clarifications. This is
assignment readiness only; no LC implementation criterion is closed.

2026-11-11 increment A candidate 5a8aedc5 passed CC and fresh independent full
gates, but independent focused controls exposed native multi-clause Array
dispatch capture in all four module/parameter checked/stripped conditions.
The public native fragment boundary, repeated private-atom mutation and M6's
changed-module/runtime oracle also require correction. [Independent HOLD](cdc-verification.md)
and original evidence remain intact. [Correction01](cc-prompt-iteration01.md)
implements those four bounded repairs; separate Sol source-readiness review
supports issue. LC-01 and all other rows stay open pending corrected software
verification. The fixed nine-value inline module is explicitly provisional;
only aliases/import specifiers, not its module body, are sparse.

B preparation is retained in [the owner-resolution memo](artifacts/local-owner-preparation.md).
Its provisional macro-before-surface proposal was withdrawn before issue:
actual Thread/Eq lowering changes macro arguments/occurrences, so a new macro
phase would require a separate language contract. Current preparation keeps
existing macro behavior and considers explicit per-unit ADT semantic plans
finalized after actual expanded declarations are collected. Exact B types,
APIs, lifecycle and source-readiness review remain unissued; A correction
authorizes none of that work.

Correction01 source 16dcd64f repaired the dispatch capture and shared-reference
mutation; independent focused controls passed. Acceptance remains held because
M6's actual public runtime set omitted both new dispatch fixtures, and the
dispatch reference inherited a generated default span. [Correction02](cc-prompt-iteration02.md)
adds those materialized tests and threads the real parameter span. Root
verified the exact fixture oracle; separate Sol preparation review supports
issue. No full independent gates were spent on the known-incomplete candidate.
The test census is 44 redirected internal-producer sections, 125 remaining
sections containing public emit_form calls, and 33 other sections (202 total);
158 denotes the untouched remainder, not public API coverage. Original CC
attestation and independent clarification retain their original pins.

The completed correction02 M6 oracle then exposed a concrete public compiler
defect: both unchanged dispatch fixtures fall through after a selected
unannotated expression body and throw no-match. CC preserved three passing/two
failing materialized cases; root inspected the actual hasReturns gate, existing
wrapReturnLast helper, native counterpart and source guide ID-19. The dirty
three-file correction02 state is retained as an exact patch with its own hash.
[Correction03](cc-prompt-iteration03.md) keeps that work and repairs public
implicit returns in canonical/embedded classifiers, with direct runtime
controls. Optional type annotations do not select successful function control
flow. A separate Sol preparation review supports issue after tightening the
explicit-return/postcondition runtime oracles. No fixture annotation workaround,
public macro redesign or broader return-guard guarantee is authorized.

Increment A is independently accepted at source
5caf3d871a80a711c08dbda0db8c5f5446dffb56, tree
115ce5ecc254ea9ed15263612bed67b6cec80ab2. Root verified the independent
archive digest and actual source pin; LC-01 is done. This is not S03 closure
or authority to integrate later source into release. Release remains 0829e892.

The first usable B checkpoint is [per-call public type metadata isolation](artifacts/per-unit-type-context-design.md),
issued as [iteration04](cc-prompt-iteration04.md) after separate Sol final
source-readiness review. It removes actual global type state, preserving
existing macro/lowering order and legacy syntax until the qualified migration.
Cold prelude metadata is explicitly normalized to the old reset/native-analysis
baseline, not introduced as runtime bindings. The actual changed M6 union is
nine files. No new dependency or public context injection is added; removal
of surface.js resetTypeRegistry is carried to S06. This is a partial LC-02
foundation, not replacement for typed owners, aliases, nominal values or C.
