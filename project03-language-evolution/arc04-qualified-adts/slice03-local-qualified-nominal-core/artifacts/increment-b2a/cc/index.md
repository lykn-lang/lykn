# B2a CC intake and evidence index

## Assignment and authority

Executed issued `cc-prompt-iteration09.md` at planning commit `b31e6f24` for
source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch `codex/qualified-adt-core`. Initial source is clean at
`e80f613baf8f52d7b8f42e05ac38e99c69513d46`, tree
`7376b33d7ca8e66942afd88036599e9e5e4bae35`. Baseline `bin/lykn` SHA-256 is
`67dc1b6ad2881b9b80fabfc36544db90f7eb6f4d1c8577b5aff32f1189e75106`.
Root owns architecture, plans/ledger and planning Git/index/status. CC owns the
authorized source/build paths through clean committed handoff to separate Sol
CDC. No release integration, remote action, external publication, new
 dependency, or auxiliary agent is authorized. No Python/Ruby/Fennel/handwritten
JS research or helper execution is authorized; native Rust/JS product code and
ordinary tests are.

## Required-reading manifest and coverage

| Material | Required extent actually read | Application |
| --- | --- | --- |
| Issued iteration09 prompt | Full, all sections | B2a implementation/test/source scope and handoff; no LC closure or OwnerRef work. |
| `slice-plan.md`, version 1.16 | Full file, lines 1–349 | S03 scope and authorization; B2a is a bounded prerequisite, downstream gates survive. |
| `ledger.md` | Full file, lines 1–14 | B2-LX is open, correctness-grade; LC-02–08 stay open. |
| Source `AGENTS.md` | Full file, lines 1–186 | Worktree ownership, no research helpers, repository gates, path-scoped commits/trailers. |
| `b2-owner-and-lexical-design.md` | Full file, lines 1–104 | Typed owner design remains future B2b; actual expansion, lexical occurrence, no replay. |
| `b2a-lexical-regions-recipe.md` | Full file, lines 1–224 | Exact source-ready scope, edge decisions, behavioral tests and gates. |
| S01 `qualified-adt-contract.md` | Sections “Source forms, binding resolution, and diagnostics” (10–34) and “Compile-time owner identity and loader-instance identity” (35–40) | Lexical names/owner identity boundaries only; this increment must not create ADT semantics. |
| IC-01 correction02 CDC README | Full findings, actual gates, delivery and limits (21–169) | Accepted IC-01 remains valid; native post-before-body is an explicit B2a repair; keep evidence limits. |
| `local-owner-preparation.md` | Withdrawn phase proposal 108–223; current incremental direction 224–276; B2 resume 366–383 | Keep macro/lowering arrangement, no phase split or B2b metadata choice. |
| Rust `rust-guidelines/SKILL.md` | Full entrypoint; required anti-pattern and core guidance loaded | Rust private types use named/tagged semantic structures, borrowed input, fallible malformed handling, preserve node metadata. |
| Rust `guides/11-anti-patterns.md`, `01-core-idioms.md` | Core/error/ownership guidance consulted; topic-specific sources below | Avoid panic-prone indexing and unnecessary clones; preserve established style and errors. |
| Rust `guides/05-type-design.md` | TD-01–03, lines 1–124 | Use tagged enums/semantic types for grammar, roles and child paths. |
| Rust `guides/03-error-handling.md` | EH-01, lines 1–41 | Malformed source follows existing recoverable diagnostic paths. |
| JS `javascript-deno-guidelines/SKILL.md` | Full entrypoint | Deno/ESM constraints; no Node/research scripts. |
| JS `guides/09-anti-patterns.md`, `01-core-idioms.md` | Required feature guidance consulted | Keep explicit absence/tags and non-mutating structure where practical. |
| JS `guides/02-api-design.md` | ID-01–04, lines 1–96 | Keep public signatures stable; private region/result-slot inputs explicit and one tagged result shape. |
| Testing `testing/SKILL.md` | Full entrypoint | Focused product proof plus repository-native gates. |
| Testing `guides/03-validation-gates.md` | Full, lines 1–130 | Actual runtime, selected populations, package delivery, exact commands/exits; keep raw attempts. |
| Lykn `skills/lykn/SKILL.md` | Full, lines 1–808 | Source-first conventions and Deno-only/no-Node boundary. |

The intake is grounded in the named installed source homes and the assigned
source branch. Unrelated historical proposals are context only.

## Source query coverage at accepted e80f613b

The required query was bounded to the current compiler implementation and its
actual callers; it does not claim whole-repository reading. Complete caller
inventories were obtained with recursive `rg` over the named Rust and public JS
source paths, then narrowed to definitions and caller blocks below. The
canonical package and its mirror are also explicitly inventoried before edits.

- Native resolver: `crates/lykn-lang/src/resolver.rs` definitions
  `hoisted_names`, `ScopePlan`, `scope_plan`, `scope_plan_and_occurrences`,
  `scope_plan_with_occurrences`; all matches/callers including sequential
  resolver and D2 shadow walk. Native pass2: top-level `expand_all`,
  `expand_children_scoped`, `expand_seq`; all scope-plan and sequential callers.
- Native binding: `binding.rs` all source/kernel function and class/member
  projection, D1 walk and D2 validation callers; `classifier/forms.rs`
  canonical clause parser, Func/Genfunc lowering, and class member parser;
  `emitter/forms.rs` actual function/generator and class/member writers.
- Public binding: `binding.js` `bindingsIntroduced`, `bindingScopePlan`,
  `hoistedNames`, function/class body walkers and all scope consumers.
  `classifier.js` canonical parser re-export and Func/Genfunc lowering/emission.
- Public expansion: `expander-core.js` every caller/definition of
  `expandAt`, `expandChildrenSeq`, `expandChildrenTail`, `expandChildrenPlan`,
  `pass2ExpandAll`, macro dispatch, sequence result handling and private
  kernel/completion/Reflect markers.
- Current modules and embedded copies: `packages/lang` module graph from
  canonical imports; M6 current twelve-file union and selected test list are
  to be refreshed and recorded with actual cold materialization after edits.

### Source-cited contract readback

At the accepted pin, native `resolver.rs::scope_plan_with_occurrences`
currently derives one whole-subtree body from collected binder occurrences and
`expander/pass2.rs::expand_children_scoped` visits that body textually; the
native Func writer in `emitter/forms.rs` instead emits selected defaults/pre,
body and post in semantic order. The new private region layout must be shared
by actual resolver and pass2 consumers, preserve original paths/physical syntax,
and allow native ordinary Func's defaults/pre/body/post order without moving
clause dispatch order (recipe §Contract and §Implementation spine 1–3).

Public `expander-core.js` currently has a `FUNCTION_FAMILY` aggregate
pre-extension at `expandExprInner` before actual lowered clauses, and sequence
loops collect `hoistedNames` from source inputs. `binding.js` separately
aggregates class member parameters. B2a removes aggregate sources and uses
actual expanded results under the incoming environment, with explicit
Single/Sequence result-slot threading for existing public statement splices;
ordinary value/argument slots retain existing mapping (recipe §Implementation
spine 4–5). Function and class binding layouts remain structural and preserve
IC-01's explicit producer grammar (accepted CDC README §Findings).

The accepted S01 identity remains an occurrence's lexical binding query;
OwnerRef/CaseRef and nominal runtime activation are not implemented here
(S01 §§10–40; architecture §§8–27). Current incremental design explicitly
keeps the actual macro/lowering arrangement and macro count (local-owner-prep
§§108–276). Thus there is no new macro phase, no replay, no global unit state,
no owner metadata, and no interpretation of raw macro spelling as declarations.
Known native multi-clause Func default divergence remains a future B2b/S06
input; actual two-plus clause genfunc forms now fail explicitly before body
macro execution in both compilers, including manually constructed native
emission. No result-slot tags or region helpers may activate generator post/
returns (recipe §§8–65, 189–224).

## Baseline and receipt policy

All baseline commands use the immutable accepted source and its verified
`bin/lykn`; captured stdout/stderr, command and numeric exit are kept under
`receipts/`. Candidate product commands use explicit owned caches/temp and
retain their first attempt streams and exits. Raw evidence remains distinct
from summaries and is indexed after execution. No binary/failed result is
rewritten or replaced by a passing retry.

## Change inventory and completion

To be updated after implementation with exact changed paths, tests, cold-M6
population, focused/full gates, failures/unrun controls, final source commit/tree,
clean status, size and committed-citation evidence. CC attestation is proposed-
done pending separate Sol review; this checkpoint does not close B2-LX or any
LC criterion.

## Evidence-location correction

The initial intake and baseline command receipts were briefly written under two
incorrect worktree-root `artifacts/increment-b2a/cc/` paths. They were moved
byte-preserving into this canonical slice-owned `artifacts/increment-b2a/cc/`
home before further evidence was added; only the now-empty mistaken directories
were removed. No baseline streams were regenerated or edited. Active receipts
and future evidence use this canonical path.

## B2a iteration09 CC implementation and evidence

The shared private layouts are implemented in `crates/lykn-lang/src/lexical_regions.rs`
and `packages/lang/lexical-regions.js` with exact embedded mirror. Native
`ScopePlan`, D2 traversal and pass2 consume source function clauses and class
member regions. The native Func classifier's public `is_func_clause_key` and
`parse_keyword_clauses` now consume the same canonical last-wins range helper
as the layout; public clause-range parsing similarly backs the existing
function-clause API. Class parameter lists project kernel binding patterns;
fields visit only the first writer-consumed initializer, methods/defaults remain
member-local, and a missing field name reaches a normal diagnostic. Ordinary
call operand plans retain parent occurrence identities but independently use
the incoming scope; true `do`/`block`/`seq` sequences still hoist between
siblings. Native dispatch explicitly recognizes existing class grammar because
its classifier dispatch predicates do not list `class` as surface/kernel.

Public expansion now derives sibling declarations from actual expanded
occurrences, checks trusted kernel declarations before bound-head suppression,
keeps explicit `Single`/`Sequence` array slots, and checks macro dispatch
priority at each expansion-chain step. Public ordinary source nodes are
normalized by occurrence at expansion entry and raw macro return; trusted
kernel nodes, compiler-private atoms, host references and exact Reflect request
objects retain identity. The direct private `isExpandedHostCall` predicate and
exact embedded module are used as authorized by root. Function body expansion
reuses the existing `childRoles(form, use)` policy per original occurrence;
this preserves DirectEntry/Statement/Protected/Value completion behavior across
the new region walker. `do`, `block`, and `seq` remain real sequence plans so
prior declarations reach following operands. Existing tagged/bound `match`
heads remain ordinary calls.

Multi-clause simple generator forms now fail before body macro execution in
both backends; manual native multi-clause emission also rejects. Single
functions and generators remain supported. The exact public lexical suite
contains ten cases, including runtime/macro-count pairs for post-before-body,
function clauses, class members, expanded export/async declarations, macro
laziness, shared object binder/head occurrences, independent call operands,
Single/Sequence result slots, and per-step dispatch priority.

### Actual commands and dispositions

All receipts below are raw invocation streams, command descriptions and numeric
status files under `receipts/`; retries use distinct names. Canonical public
commands used `/tmp/lykn-b2a-project.json`, whose `lang/` import points to the
current `packages/lang/` source and preserves `testing/` and `astring` imports.
The earlier 47-pass project.json run mapped to `target/lykn/build/lang/` and
remains explicitly noncanonical.

- Focused current-source Deno suite, six named files: 66 passed, 0 failed;
  `receipts/focused/public-focused-final.{command.txt,stdout.txt,stderr.txt,status.txt}`.
- Native resolver suite: 38 passed, 0 failed; full language library suite:
  1,191 passed, 0 failed. Final receipt is
  `receipts/focused/native-lang-final.*`; CLI source compile fixtures passed
  with numeric 0 at `receipts/focused/native-cli-final.*`.
- First native library run exposed six scope regressions from routing all
  non-known heads through Call. The next run exposed five (catch, if-let,
kernel escape, function and bound-match boundaries). Both raw attempts remain
  as `native-lang-unit.*` and `native-lang-unit-retry01.*`. The final Call plan
  recognizes the established strict/native grammar, keeps inherited
  `BindingOccurrence` identity while using independent incoming scopes, and
  preserves the special bound-match sequence/tag path. Bound ordinary
  conditional tests now expect the new Call plan. The 38 resolver controls
  and entire library suite pass in the final run.
- The first cold M6 attempt had an uncreated evidence directory; the next used
  a nonexistent macOS DENO_DIR fallback and failed fetching astring in the
  network-restricted environment. These remain in `receipts/focused/m6-cold.*`
  and `m6-cold-retry01.*`. With the actual existing
  `/Users/oubiwann/Library/Caches/deno` and owned XDG/npm/tmp directories, the
  exact cold M6 integration test passed (numeric 0) at
  `receipts/focused/m6-cold-final.*`. M6 compares all fourteen canonical,
  embedded and materialized modules, including both new leaf modules, and
  executes 38 materialized strict public tests (11 retained + 17 IC-01 + 10
  B2a lexical-region cases). Internal receipts are under `receipts/m6/`.
- First `make check` preserved a Clippy collapsible-if failure at
  `receipts/full-make-check.*`; after correction, retry01 preserved ten
  focused-completion/semantic-role failures at
  `receipts/full-make-check-retry01.*`. Root identified the completion role
  loss; the function region walker now carries the existing `childRoles` map.
  The two bound-match fixtures were actually producing `[11,22,1]` instead of
  their unchanged `[11,22,14]` expectation: generated output showed `do` had
  been misclassified as an ordinary Call, preventing a preceding `(bind match
  ...)` from entering its following sibling scope. `do`/`block`/`seq` now use
  Sequence. The exact raw failure and temporary generated-JS diagnosis remain
  at `receipts/focused/public-completion-controls-retry01.*` and
  `public-semantic-generated.*`; temporary logging was removed from source.
- Final repository `make check` passed numeric 0 at
  `receipts/full-make-check-retry02.*`: Clippy, formatting, syntax/lint,
  committed-source cited-path scan, release build, Rust tests, 1,536 generated
  JS/Lykn cases and 482 documentation cases (docs run once). Browser size gate
  passed at 45,457 gzip bytes (+18,827 from the 27,630-byte baseline), under
  80 KiB; receipt is `receipts/bundle-size-check.*`.

### Source inventory and handoff

Authorized changed source paths are the seven native language modules/files
from the prompt plus the Rust CLI compile tests, macro-dependency M6 test,
public `binding.js`, `classifier.js`, `expander-core.js`, `function-clauses.js`,
new `lexical-regions.js`, root-approved `host-invocation-kernel.js`, their six
exact embedded copies, and the new `test/expander/lexical-regions.test.js`.
The host predicate/mirror is the only extra private source path and is directly
needed to distinguish compiler-owned expanded-host call anchors from forged
properties while occurrence-copying ordinary syntax. No docs/source-research
helper, public API, dependency or release path changed. `git diff --check` is
clean. The exact source commit/tree, post-commit citation gate, final clean
status, committed paths and source line citations are appended after commit.

CC disposition is proposed-done only. Root owns planning integration and the
separate Sol CDC; this candidate does not implement OwnerRef/CaseRef, nominal
runtime activation, purity, LC closure, generator post/returns or other B2b
behavior. No release integration, push or publication occurred.

## B2a iteration09 committed handoff

The source implementation commit is `fbd1604d94b77a736a17572f27f06fac12b29553`
on `codex/qualified-adt-core`, parent `e80f613b`, and contains exactly the 22
authorized source/test paths enumerated above. Final HEAD is
`bcb98482fa9b32aa6f58df3e2249123e16924271`, tree
`72adf0ee9beb51eb6b0a9166ad9448b8103cfbb9`; its tree is the same implementation
tree, and `git status --short` is empty. Final inspection found the source
commit command had omitted trailers. To preserve history without amend/reset,
two empty metadata follow-ups were added: `5af6701a` (trailers separated by
blank paragraphs) and `bcb98482` (correct contiguous Codex/Billo AI trailers).
The final HEAD has the required contiguous trailer pair. Post-final-HEAD
`make check-cited-paths` passed numeric 0: 64 documents, 601 accepted
historical citations; raw command and streams are
`receipts/post-final-head-citations2.*`.

Committed implementation anchors for independent review:

- Native tagged lexical structures, last-wins source ranges, source Func and
  class path projection: `crates/lykn-lang/src/lexical_regions.rs:29-80`,
  `:122-202`, `:362-444`.
- Native dispatch gate, independent Call operands and class/source clause
  consumers: `crates/lykn-lang/src/resolver.rs:115-165`, `:397-538`; default
  parser consumes the shared key/range helper at
  `crates/lykn-lang/src/classifier/forms.rs:1725-1805`.
- Public function/class occurrence layouts and retained do/block/seq sequence
  dispatch: `packages/lang/lexical-regions.js:12-94`, `:97-135`,
  `packages/lang/binding.js:144-240`, `:420-445`.
- Public occurrence ownership, function completion roles, actual-result
  hoisting and explicit result slots: `packages/lang/expander-core.js:47`,
  `:856-863`, `:1025-1072`, `:1135-1150`, `:1874`, `:2123-2148`.
- Runtime/scope/macro-count and shared-node public oracle:
  `test/expander/lexical-regions.test.js:1-183`; native source/class/error and
  macro-result tests `crates/lykn-cli/src/compile.rs:426-531`; M6 module union
  and materialized population `crates/lykn-cli/tests/macro_dependencies.rs:714-809`.

The clean candidate is returned to root for separate Sol6.1High CDC. CC
proposed-done is not independent acceptance. B2-LX, B2b and LC-02–08 remain
open; no OwnerRef/CaseRef, qualified runtime activation, purity or release
integration is claimed. No remote action, push or publication occurred.
