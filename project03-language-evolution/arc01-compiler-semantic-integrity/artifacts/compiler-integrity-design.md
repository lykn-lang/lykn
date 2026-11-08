# Compiler integrity design and finding reconciliation

## S03 private incremental representation selected — 2026-11-07

After independent S02 and exact local release integration atc9, the Operator
explicitly advanced S03. Its [source-ready plan](../slice03-shared-semantic-roles/slice-plan.md)
selects a crate-private shared expression-use/body/cardinality core with actual
validator/lowering consumers and explicit existing grammar adapters. Public
AST/ExprContext/Result APIs remain unchanged. This is the approved incremental
direction's routine representation choice, not a selected recursive A6 migration
or a proof the planned code works. S03's finite real baseline/runtime/gates still
decide acceptance; original source-specific planning comparison below is history.

## Subsequent approved decision and current baseline — 2026-11-07

Operator approved the incremental direction, S01 delivered NE-C12, and Slice20
independently integrated accepted source8f5d199 into release/0.6.x. Operator then
clarified the0.5→0.6 breaking development boundary and explicitly chose
**Result-family compiler APIs without a legacy shim merely for compatibility**.
This supersedes the earlier unresolved compatibility choice in the original
planning comparison below, not its source/evidence history. S02 must cover actual
public emit/emit_json/emit_form and context error lifecycle, preserve infallible
primitive/runtime AST builders and actual parsed-source diagnostics. No broad
public removal, runtime-error change or recursive typed-AST rewrite is approved.

Proposed 2026-11-07 by `/root/cdc` (Sol 6.1 High). This is a planning design,
not an implementation, experiment, architecture approval or software acceptance.
Read with the [arc roadmap](../arc-plan.md) and [open ledger](../ledger.md).

## Evidence boundary

Source facts below refer to accepted task
`codex/match-subject-values@8ed869f1ed24bf688ba91f71d8c539680136794e`,
checkout `lang/.worktrees/contract-predicate-lowering`. Relative source paths
in this record belong to that tree, not the orphan planning tree. Native language
module shorthand (`classifier/`, `emitter/`, `ast/`, `codegen/`, `error.rs`)
has prefix `crates/lykn-lang/src/`; CLI shorthand (`compile.rs`, `dist.rs`,
`main.rs`) has prefix `crates/lykn-cli/src/`. Release/0.6.x
is separately `5408abd432b8789ae474a3895436f68818c4e482`. C10/11 acceptance
is task-only; C12 does not invalidate those independently tested repairs.
No new test, trial or code edit was conducted for this design.

Canonical prior evidence is the Project03 [BACKLOG](../../BACKLOG.md),
[Slice19 verification](../../slice19-match-subject-and-walker/cdc-verification.md),
[retrospective](../../slice19-match-subject-and-walker/cdc-retrospective.md)
and the original linked child records. Retained failures, missing captures,
wrong-tool/pin conditions, rejected oracles and process violations retain their
original evidence strength; a new roadmap does not reconstruct or cure them.

## What the source establishes

- Native validator `classifier/forms.rs` uses two-state `ExprPosition`; its
  numeric-for role walk at 463–475 treats three headers as Value and all body
  forms as Statement. Emitter `forms.rs` uses three-state `ExprContext`
  (Statement/Value/Tail). Its numeric-for fixed positional profile around 3271
  defaults later children to Value. Printer `codegen/emit.rs:734–747` accepts
  every body form after the three headers. Guide00 documents numeric-for and
  statement-if; the classifier and printer establish variadic-for body support.
  This is the bounded NE-C12 mismatch; it is not evidence every loop is broken.
- Native `ast/surface.rs` contains typed outer forms and raw nested SExprs:
  FuncClause body, Match target/clauses, Bind values and FunctionCall args are
  examples. Classifier raw-shape roles and emitter role profiles are duplicated.
  That supports consolidation as a design candidate, not a proof that a fully
  recursive typed AST is the only solution.
- `emitter/mod.rs:28` publicly returns `Vec<SExpr>` from `emit`; line41 returns
  `String` from `emit_json`, calling `emit`. Neither has a diagnostic channel.
  `LyknError::Codegen(Diagnostic)` already exists. Nested classification failure
  can be cloned unchanged by `emitter/forms.rs` around525. Compiler-failure
  instructions can also be constructed as ordinary throw-shaped output.
- There are three production native emit callers: CLI `compile.rs:298` and367
  (normal/lax and JS+DTS), and `dist.rs:245`. CLI compile wrappers run shared
  compile validators; the dist per-file route directly reads/expands/classifies/
  analyzes/emits and currently does not visibly call that shared resolver/
  validation wrapper. This is a source-only route-policy risk, not a newly
  reproduced dist bug. S02 must decide intended parity and prove it.
- `lykn-lang` publicly exposes its emitter module. Test callers also include
  e2e/cross-compiler and emitter unit tests. The umbrella crate reexports
  formatter/reader, not an emitter alias. A repository caller search does not
  establish that there are no external users of public Rust APIs.
- CLI computes JS/DTS before writes, then writes them sequentially. A compiler
  failure can be stopped before either write; whole-output atomic replacement
  on I/O failure is a different feature and is not promised by this design.
  Dist currently reports per-file failures through its own error mapping.
- Public JS `packages/lang/mod.js` exposes read, expand and compile entrypoints;
  compile/compileExpr already throw for malformed forms, including expression
  `if` without else. An idiomatic checked Rust route does not require changing
  that JS public signature. Canonical/embedded JS byte synchronization and
  fresh materialization are required whenever that product code changes.

## Semantic role contract

Recommended: one authoritative child/body-role specification with explicit
adapters at the raw surface, classified surface, kernel lowering and validation
boundaries. Exact representation is chosen at S03 readiness, not invented here
as an untested universal table. The normative constraints are:

1. Role follows semantic form identity/resolution (`as_form_head`), not spelling
   alone. A lexically bound `if`, `switch` or `match` is an ordinary call; quote
   and data are not executable syntax. Computed calls retain Value arguments.
2. Distinguish evaluated Value children, Statement sequence children and Tail
   completion from binding sites, names, patterns, headers and syntax containers.
   Adapters must explicitly explain the validator's two states versus emitter
   Tail, including nonvoid/fn implicit tails, void and generator statement bodies,
   consumed `do` tails and match clause prefix/final roles. No silent collapse.
3. Numeric-for means exactly three Value headers and **all** remaining Statement
   bodies. Preserve source order, sibling grouped bindings and sequential
   visibility. Default markers, clause lists and empty containers retain their
   structural roles rather than becoming computed calls. Inspect actual
   normalized-stage operands and any reordering before sharing a raw role table;
   source surface order need not equal printer input order. Untraced adjacent
   stage-order discrepancies are design census cues, not new established bugs.
4. Function/method boundaries establish their own lexical/async/return contexts.
   Their bodies still require compilation/validation. This is distinct from an
   ESTree load-time effect walker deferring evaluation of function bodies.
5. Preserve explicit await, selected-branch evaluation, final values (including
   Promise-valued tails), sync/no-Promise behavior, exceptions and scopes as
   already accepted in C09. No generic await scan through deferred bodies or
   blanket async conversion. Honor the language's functional `if`/`?`
   equivalence; a style recommendation is not permission to reject valid `if`.
6. Recognized unsupported/invalid nested surface forms produce structured
   compile diagnostics, with origin/span/cause retained where available. Ordinary
   foreign calls remain valid. Exhaustive-match/runtime type/contract failures
   are intentional emitted behavior, not failed lowering by association.

Regression design follows these roles and their boundaries, including negative
Value positions. It must falsify the previous behavior and guard adjacent
contexts, not merely find a fallback node or a string in emitted output.

## Failure representation and public compatibility decision

S02 must introduce a genuine diagnostic-bearing emission path and thread it
through production callers before artifact writes. Existing `LyknError::Codegen`
is a candidate carrier; exact type/span aggregation and stop-first versus
multi-diagnostic behavior require source-ready design. Do not catch arbitrary
panics, stringify diagnostics into JS, scan text for `COMPILE_ERROR`, return
empty output on error, or misclassify user strings/runtime throws.

| Option | Benefit | Compatibility/acceptance consequence |
| --- | --- | --- |
| Result-bearing `emit` and `emit_json` migration | Makes failure propagation explicit at the actual public boundary; existing `?` paths can compose with CompileError | Public Rust signature break. Requires Operator choice, caller migration, release/semver policy and affected reference/release documentation before code. Preferred target, not approved here. |
| Additive checked entrypoints with explicit legacy transition | Can migrate CLI/dist and internal consumers without immediately removing old signatures | Must state legacy failure behavior, deprecation and migration timeline. An unchanged infallible legacy API cannot silently inherit an all-public-APIs fail-closed claim. Scope/compatibility exceptions need explicit approval; empty success or unnoticed panic is not a solution. |

These are alternatives, not two required implementations. No external caller
absence or version number is assumed. S01 can deliver while this decision is
pending. Public AST fields changed later need their own compatibility decision.

Failure acceptance includes actual failing stdout/-o/JS+DTS/dist routes under
their documented strictness, pre-existing sentinel outputs unchanged on compile
failure, no new artifact for the failing unit, nonzero/errors with useful source
context, and successful output/warning/API controls. Check is intentionally a
different validation surface; promise only its documented stages. For dist,
decide shared frontend adoption versus a justified route adapter after comparing
actual resolver/expansion/config behavior; do not silently change package
semantics while adding errors. Earlier files written by a multi-file build are
not retroactively erased under a fictional transaction guarantee.

## Architecture alternatives and A6 ownership

| Alternative | Assessment and needed answer |
| --- | --- |
| Continue isolated profile/validator patches | Small immediate diffs but perpetuates duplicated context rules and weak internal error transport. Appropriate only as S01's contract-backed delivery, not the whole arc strategy. |
| Incremental shared roles plus targeted normalization and structured failures | Recommended first: useful correctness/error increments, explicit adapters and bounded regression proof without changing every AST consumer at once. Risk: raw forms still require disciplined adapters; S03 must demonstrate reduced duplication rather than add another parallel table. |
| Recursive typed surface AST (A6) | Could encode child roles and remove classes of raw-shape reclassification, but needs node/provenance design, parser/classifier/emitter/caller migration, public AST compatibility, native/JS strategy, error recovery and measured cost. It does not automatically prove semantics, effect analysis or public ADT guards. Historical benefit assertions are hypotheses, not current proof. |

A6's concrete owner is Arc01 S03 architecture decision, registered under the
existing BACKLOG A6. Before a migration commitment, answer which actual accepted
invariants cannot reasonably be maintained by the incremental contract, what
public consumers change, and what usable staged migration/test boundary would
replace it. This planning comparison is not prototype/research execution.
If a full migration is selected, revise scope/acceptance before opening code;
do not smuggle it into S01 or turn the arc into indefinite evidence-only slices.

## Complete finding map

Accepted repairs remain regression inputs; open historical observations are not
automatically current defects. Owners below are concrete planned units, not
claims that future slices already exist.

| Finding | Evidence/status now | Planned owner and acceptance/re-entry |
| --- | --- | --- |
| NE-C01 contract predicate lowering | Independently accepted Slice07; integrated into release5408 ancestry | S03/S06 regression preservation: predicate normalization, positive/negative pre/post behavior, diagnostics and caller blame remain intact. Not reopened. |
| NE-C02 branch-local binding | Historical invalid generated JS/runtime witness; original source validity and current applicability unsettled | S04 current-source/source-contract disposition first. If supported, prove scope/completion with a meaningful current regression; if not, actionable rejection/guide decision. No assumed same cause as C09. |
| NE-C03 template cooked-value escaping | Accepted native/public-JS repair and bounded pilot; integrated release5408 | S03/S06 preserve decoded values, tagged raw/cooked boundary, canonical/embedded mirror and existing finite controls. Not a blanket all-escape theorem. |
| NE-C04 embedded cache identity | Source-only same-version cache-key limitation; fresh-cache proof is not warm migration proof | Planned adjacent unit **Embedded compiler cache identity and refresh** (Project03 A5): choose content/version identity, warm/stale/fresh behavior and recovery; meaningful parity tests and fresh materialization. Depends on approved cache policy, not K unless demonstrated necessary. |
| NE-C05 typed explicit final return | Accepted-tool retained source/output pair; no reduced/current8ed runtime proof or universal return claim | S04 establish documented valid source and current boundary, then actual behavior/diagnostic regression or policy decision. Existing implicit-final helper success does not erase it. |
| NE-C06 warning side | Observed unused-binding warning despite member/receiver use; runtime behavior retained, lint success distinct | S05 diagnostic fidelity with actual used/unused countercontrols and honest stdout/stderr/warning behavior. |
| NE-C06 nested-classifier side | Source-only Err-to-raw fallback; historical invalid dissoc/wrong-tool evidence is not a valid runtime repro | S02 checked lowering; source-guided negative regression and preserved diagnostic cause. Do not upgrade old evidence. |
| NE-C07 async export bindings | Independently accepted Slice14, integrated release5408 | S03/S06 preserve valid async names and real import/await plus unknown/nested/bound-head negatives; no global recursive binding walk. |
| NE-C08 compile-route validation | Accepted shared five-pass normal/JS+DTS validation, integrated release5408 | S02 route/API regression preservation, including missing-category red tests and successful JS/DTS. Check subset stays explicit. |
| NE-C09 async expression values | Accepted through5408 after preserved overrides/regressions, integrated; original four parser observations passed independently | S03/S04/S06 preserve scoped await, carriers/final values, grouped-binding/switch corrections, sync and deferred boundaries. Prior source budget/history is not reset. |
| NE-C10 match validation | Independently accepted task8ed; not release5408 | S03/S06 preserve clause target/guard/body-prefix/value-tail, fn/lambda and generator/yields distinctions with retained regressions. Integration is a separate decision. |
| NE-C11 match target lowering | Same task8ed combined acceptance, real unchanged740-byte program/JSON/DTS proof | S03/S06 preserve unconsumed target Value lowering and context restoration; no new guard/other-role runtime claims inherited. |
| NE-C12 numeric-for later bodies | Independently reproduced full walker check0/strictcompile0 and three compiler-failure instructions in JS; none executed | S01 actual header/body regression and supported runtime proof, then S02 prevents other internal failures masquerading as success. Only this loop mismatch is established. |
| NE-T01 async declarations | Known async DTS omission; no universal declaration promise established | Planned adjacent unit **Async declaration contract and distribution**: decide promised public type surface, implement/validate if approved, test actual import/type consumer and sidecar/API compatibility. Type/distribution owner before future JSR type claims; not mandatory K dependency. |
| NE-T02 ADT guard membership | Source-only generic tag-shape guard observation; public nominal/membership policy unsettled | Planned adjacent unit **ADT membership and guard contract**: Operator language-policy decision, cross-backend positive/negative guard behavior, guide/reference/book and human acceptance. Public language ADT policy is distinct from A6 compiler AST types and NE-T01. |
| NE-D01 template guide dispatch | Pre-existing guide17 table/prose inconsistency; actual accepted dispatch backs table | S07 records pre-existing documentation correction candidate separately from new API impacts; S08 implements required clarification with example/dispatch validation and book/reference disposition. No source edit now. |
| NE-D02 zero-field ADT example | Source-only guide05 `(None)` contradiction with bare zero-field values and emitter constants; no runtime probe | S07/S08 explicit guide/example/reference/book disposition. Does not require changing constructors or resolving T02 membership policy to correct a clear example. |

The three named adjacent units are planned candidates in the Project03 roadmap,
not abandoned notes or prerequisites automatically added to this arc. Their
technical owners are respectively compiler delivery/cache, type distribution,
and language ADT design; CDC owns opening the corresponding approved unit, and
Operator retains language/release policy. Number/home is assigned when one
becomes the next approved increment; no phantom directories/prompts are made.

## Original tooling, K and consumers

Slice19 final four-module source9122473 remains unaccepted as tooling.
Core Lykn source SHA6ca1afe8 and frozen controls SHA0f20dba4 remain distinct
from compiled core JS SHA068afeb7. A new accepted compiler may change generated
bytes: an explicit provenance-only refresh must derive actual output and review
identity guards before use; never silently repin or call a source digest a JS
digest. If intended behavior changes, it is semantic work needing explicit scope
and budget, not provenance maintenance. Eight prior tooling passes remain spent.

S06 retains the [Slice11 contract](../../slice11-audit-evidence-contract/artifacts/audit-contract.md),
frozen Slice17 controls and all original predicates: 12 families/13 rows,
K10 missing/unreadable separate failures, K11 hash-before-import with no fictional
AST, K12 synthetic unsupported coverage outside file/parser counts, K06 nine,
K08 distinct call/identifier ranges, exact locations/roles/reasons/partitions,
potential evaluation versus observation/dependency, and supervisor control-pass
versus scanner completeness/nonzero. Current K0/13 is not parser failure.
Prior four parser observations and five-bundle/11-call pilot do not substitute
for walker or full-corpus proof. All original F1–F12 remain open.

Project07 consumes eventual findings under approved future lib/opt-in/zero-unused
payload/effects/public-API constraints. Its licensing/bootstrap, authoring ADTs,
guides, separate book, human gates and consolidated final research report stay
owned there; this arc neither implements a standard library nor closes them.

## Final public-surface audit and conditional documentation

S07 produces an actual delta register against exact accepted source ranges:
task8ed→final arc candidate, plus release5408→candidate/actual separately
authorized integration. Separate inherited C10/11 from newly introduced changes.
List every public signature/behavior/file/error/export/declaration change and
explicit no-change areas; classify corrective/additive/breaking/deprecated or
unresolved exposure, affected users and documentation. Include Lykn syntax and
runtime semantics; CLI flags/status/diagnostics/stdout and JS/DTS/file behavior;
package/module entrypoints; public Rust emitter/AST APIs; generated DTS.

Map each required update to actual repository API docs, guides, Lykn LLM
reference, CLI/release documentation and the separately verified book home.
Do not infer book completion from a link or source tests. D01/D02 are separately
labeled pre-existing inputs. S08 is the conditional implementation placeholder:
activate for required findings with source/example/link validation and independent
review; otherwise explicitly record not needed. Any pending required book/human
work stays open at arc close. Neither audit nor placeholder authorizes a merge,
publication, API break or delayed compatibility choice.

## Planning-session outcome and retrospective

The fresh separate Sol 6.1 High reviewer found the fixed draft17182cb adequate
for Operator design review, with no material correction required; see the
[attributed report](planning-review.md). The author subsequently made only the
two announced source-citation precision edits and added this session record.
That review is independent design/source inspection, not fresh replay of old
source acceptance or acceptance of a future architecture implementation.

The useful planning change is a shared normative contract with separately usable
source deliveries and explicit adjacent owners, rather than making every new
observation another automatically opened prerequisite. Cfor correctness and
error/API migration were split before execution; the Operator's final API/docs
request became actual close gates. Historical A6 benefits were qualified as
hypotheses instead of using repeated raw-shape findings to presume a rewrite.
No empirical claim that this roadmap improves implementation effectiveness is
made yet. Future readiness must demonstrate source/API compatibility and actual
behavior without losing the retained budgets, failure records or human goals.
