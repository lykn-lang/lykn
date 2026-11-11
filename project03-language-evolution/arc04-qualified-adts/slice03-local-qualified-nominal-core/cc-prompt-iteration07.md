# S03 iteration07 — consolidated IC-01 software correction

Execute this CC correction after iteration06's independent HOLD. Luna6High CC,
separate Sol6.1High CDC, standard Autonomous Mode under the operator's existing
authority to fix obvious bounded issues. Source baseline is clean candidate
5bdbfe3c27c58bdcbf93471d1c469c53ef2eaabe, tree
e0a95d7452f3a33529fb7bd7a75ab46289d7349e on codex/qualified-adt-core in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Retain the candidate and all failed/reviewed evidence; do not amend/reset it.

Root owns design, planning Git/index/ledger; CC owns task source/build after
issue, returning it clean for independent review. No subagents, release edits,
integration, remote CI, push/publication, new dependency or permission bypass.
No Python execution or temporary parity exception; no Python/Ruby/Fennel/
handwritten JS research helpers. New research/evidence/command logic uses Lykn;
shell/native CLI is direct invocation/simple lifecycle only. Actual product
Rust/JS and ordinary tests are allowed. All iteration05/06 constraints and
unresolved LC-02–08 obligations remain unless explicitly superseded here.

## Required reading and active authority

- Required-full: this prompt, current slice plan/ledger, source AGENTS and
  artifacts/ic01-correction01-design.md. The latter is root's exact correction
  recipe and takes precedence over incomplete traversal details in the original
  role contract, while preserving its scope and invariant decisions.
- Required-section: cdc-verification.md IC-01 candidate5bdbfe3c section and
  artifacts/increment-ic01/cdc/README.md, including confirmed findings,
  ordering baseline and the alias confounder. Required source inputs: its
  retained probes/function-tail.lykn, computed-callee.lykn, kernel-default.lykn,
  declaration-default.lykn, class-default.lykn, alias-default.lykn,
  post-before-body.lykn, body-before-post.lykn and macro-fn.lykn. Working originals
  are at /private/tmp/lykn-s03-ic01-cdc-5bdbfe3c; the committed archive preserves
  them if needed. Inspect actual sources and results, not filenames alone.
- Required-section: iteration05's no-Python, ownership, guidance, gates and
  commit/return contracts; iteration06's exact guide-only migration. Original
  artifacts/binding-role-contract.md remains the boundary: no generic D1
  class/clause repair, no public kernel:lambda support or nominal activation.
- Apply existing installed Rust/JS-Deno/testing guidance and the concrete
  root recipe. No need to reread unchanged skills already loaded in this context.
  Fresh contexts must load the required skills/chapters named by iteration05.

Read back the exact reviewed misses and source/grammar decisions, then implement
without another permission stop. Return a concrete contradiction before affected
edits; routine implementation/test fixes within this contract proceed.

## Correction spine

1. IC-R01: use canonical keyword-group parsing, all body forms and shorthand,
   repeated-group last-wins; do not scan ignored metadata as live code. Make
   native parse_keyword_clauses/is_func_clause_key pub(crate), keeping behavior.
   Extract public parseKeywordClauses/FUNC_CLAUSE_KEYS unchanged into private
   function-clauses.js, with existing classifier exports reexported. Binding
   imports the dependency-free leaf; do not create a classifier/core import cycle.
2. IC-R04: public function validation follows pre→body→post, retaining outgoing
   own-level body scope for post in both textual orders. Scope cannot leak
   from blocks/clauses/methods/operands. Native follows actual resolved tags and
   existing physical visibility: body-before-post keeps working; the old bad
   native post-before-body case stays rejected pending B2. Do not suppress its
   new rejection while the older resolver still emits invalid predicates.
3. IC-R02: native ordinary calls with a computed non-atom head must visit the
   callee expression plus arguments independently. Atom heads have no subtree.
4. IC-R03: recursively visit real defaults using their actual producer grammar,
   wired into first/all function params, class methods/accessors/wrappers,
   source bind and kernel declaration patterns and supported loop/catch patterns.
   Recurse complete nested patterns. Typed alias :type key pattern treats key
   as data and projects only nested locals; kernel alias key local [default]
   projects local and visits default. A kernel key can itself be a keyword,
   so do not guess dialect just from keyword presence. Keep legacy class D1
   aggregation unchanged; correct any newly introduced false key projection.
5. IC-R05: use the supported macro that unquotes its caller's typed param AST
   into a real fn. Verify both restricted failure and a valid renamed counterpart
   that compiles/runs. Remove unsupported grammar as the purported parameter
   oracle; no source whitelist expansion to rescue a bad test.
6. Mirror changed binding/classifier and new function-clauses into embedded
   package. M6's current eleven-file union becomes twelve; classifier was
   already present. Retain prior actual cases and add new regressions through
   materialized lang/, not a canonical/native fallback. Derive actual counts.

Implement the actual group parser and difficult paired ordering/default cases
through output before scaling tests. Preserve all IC-R01–05 witnesses and
limits. Source alias positive from the design must compile/run with package
as external key and local as nested binder; pair with a real kernel alias
having a keyword key and invalid local. Native alias's unlowered-do confounder
is a direct-gate regression only, not a new emitter repair or fabricated runtime
proof. Existing B2 source Func/class aggregates and native ordering limits
remain explicit; restoring public behavior is required now.

## Source scope, gates and return

All original iteration05 source/test paths and iteration06's single guide
path remain permitted. Add exactly these necessary parser-wiring paths:
crates/lykn-lang/src/classifier/forms.rs; packages/lang/classifier.js and new
packages/lang/function-clauses.js; their two corresponding embedded copies.
No new public JSR entrypoint, runtime helper, dependency or normalizer change.
Root permits small private sequence-helper refactoring to retain outgoing
scope without mutating incoming Sets/caller frames. Do not redesign the public
AST or ordinary compiler pipeline.

Run focused regressions against all actual review witnesses with native
checked/stripped compile/check and public/direct/expandExpr routes as applicable;
run positive ESM outputs. Then fresh actual cold M6 twelve comparisons/new test
count, make check (docs once), committed-HEAD citations and browser80KiB.
Use both explicit existing DENO_DIR and owned npm/XDG/tmp from first command,
create owned directories first, keep capture variables scoped to focused runs.
No repeated full gates on a known-bad candidate; rerun them after necessary
changes before handoff. Keep original failed logs and disclosed missing raw
transcripts; do not reconstruct old records or drop tests.

Commit only actual changed explicit authorized source/test paths using git
commit --only and contiguous Codex/Billo AI co-author trailers. No amend or
blanket staging. Write an iteration07 checkpoint in closing-report.md and
artifacts/increment-ic01/correction01/cc/ receipts/index, with exact head/tree,
clean status, changed paths, readback, failed/passing checks and denominators,
API and B2/S06 limits. No planning stage/commit/status edits. Return source/build
ownership promptly for separate Sol review. IC-01 and all open LC rows remain
open until independently dispositioned; no further source integration follows.
