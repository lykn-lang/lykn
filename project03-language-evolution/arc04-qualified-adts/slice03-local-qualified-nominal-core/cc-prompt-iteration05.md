# S03 iteration05 — IC-01 emitted-binding legality

CC implementation assignment, succeeding accepted B1 iteration04. Luna 6 High
CC / separate Sol 6.1 High CDC, Autonomous Mode, explicitly authorized by the
operator on 2026-11-11. Implement the bounded binding-role/identifier repair,
return for independent validation, then resume qualified-constructor preparation
only after acceptance. This is a new usable prerequisite, not an A/B1 corrective
retry or reset of their historical failures. S03 and LC-02–08 remain open.

## Baseline, intake and ownership

Source is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
branch codex/qualified-adt-core, clean accepted B1
3f197340dd4765df7cccb3858ef97faccb5df9fc, tree
9ee95765b3475c84c5f537834ecceb6b476dc794. Release is independently accepted
0829e892 in its separate 0.6.x home; do not edit/integrate it. Root owns planning
Git/index, ledgers, architecture and parent records. CC exclusively owns task
source/build after root's issue message. No subagents, remote action, push,
publication, new dependency or implicit permission bypass.

No Python execution is permitted and no temporary parity exception exists.
No Python/Ruby/Fennel/handwritten JS research helpers, including temporary ones.
New research/probe/orchestration/evidence/command-construction logic uses Lykn.
Native shell/CLI is only for direct invocation and simple filesystem lifecycle.
Actual compiler Rust/JS and ordinary product tests are allowed; do not disguise
a general research harness as a product test or extend tools/conformance-matrix.js.

Required reading, in order (recover truncated required output):

1. Required-full: this prompt, AGENTS.md at source, this slice's slice-plan.md
   and ledger.md in canonical planning. Match the active assignment before edits.
2. Required-full: artifacts/binding-role-contract.md, the revised root recipe.
3. Required-section: artifacts/reserved-binding-repair-design.md, sections
   Policy selected by root, Concrete implementation items1/2/5, and Product
   tests and discriminating evidence. The binding-role contract supersedes its
   known-incomplete walker/gate instructions; its Preparation review is history.
4. Required-section: cdc-verification.md B1 acceptance and artifacts/increment-b1/
   cdc/README.md, to preserve state/host/delivery behavior and known limits.
5. Installed Rust/JS-Deno/testing skills; actual relevant anti-pattern, type/API
   and validation chapters. Root's applied guidance is in the role contract.
   For Lykn probes read source skills/lykn/SKILL.md plus anti-pattern and syntax
   sections required by the actual probe. Keep contributor commands distinct
   from the ordinary Lykn user workflow.
6. Required-data/source queries: inspect all callers of walkBindings,
   validateReservedNames, binding_occurrences, ScopePlan/bindingScopePlan and
   actual codegen function/parameter/property/import shapes. Inspect every
   query result and retain the concise caller inventory, not an inferred count.

Return a concise source-cited contract readback, then implement without waiting
for another permission question. Challenge a concrete contradiction rather than
silently choosing new language semantics. Obvious bounded local fixes are
authorized; unresolved new scope/architecture returns to root before edits.

## Implementation spine

Binding decisions are in the full role contract. Local helper names/mechanics
are CC discretion; public behavior and scope are not.

- Correct the finite reserved tables and compare actual DD-49 emitted names.
  Keep direct keyword diagnostics unchanged, explain raw/emitted names when
  different, and separate eval/arguments strict-binding diagnostics from labels.
- Extract the unchanged public converter/tables into private identifier.js;
  compiler.js imports and reexports toJsIdentifier. Binding imports the leaf,
  avoiding compiler->host->binding->compiler cycles. Preserve all mapping tests.
- Make actual binding enumeration role/scope aware, with explicit incoming
  public bindings options. Shared projection gains real source/kernel function
  parameters, correct typed versus kernel rest/default/destructuring slots and
  atom-form nullary constructors. Keep name/span/node identities. Distinguish
  quote/template/property/pattern/import/member grammar from executable regions.
  Reuse existing scope/projection helpers, not a second blind binder census.
- Update the narrow D1 kernel-function scope plans when adding parameters:
  own name/parameters are inner scope, only the named declaration hoists.
  No parameter or method/clause local leaks to siblings. Bound/tagged calls
  project no binders; explicit/trusted kernel forms retain current authority.
- Add role-aware public final expanded validation and single-expression input/
  result validation with the supplied Set; no macro replay or new Pass0/1.
  Native check_strict reuses validate_compile_forms and existing group priority.
- Mirror the five changed/new public modules; M6 grows from nine to eleven
  compared modules, adding identifier.js and reserved-words.js. Include the new
  regression test file in the actual materialized public test process.

Start with a difficult representative through the real output path: a macro
produces a function parameter named package; the negative must be a binding
diagnostic, while `(obj :const eval)` and a bound call to bind with eval must
compile and execute. This distinguishes the incomplete post-walker recipe.
Retain immutable-baseline package and normalized-name failures before fixes;
do not import a not-yet-created module and call that the regression.

## Product acceptance checks

Use a new test/forms/reserved-binding-output.test.js with ordinary black-box
compiler/runtime controls and shared native/public fixtures as appropriate.
Exact oracles and all required role populations are in the governing contract.
The old implementation must fail discriminating negative controls.

- Actual package/if! rejection from default and stripped native compile, check,
  public compile and expandExpr; macro-generated fn/kernel function parameters,
  rest/default/destructuring cases and legacy atom nullary constructor covered.
- Real positive ESM execution for quoted data, two-depth template data/active
  unquote on existing supported paths, reserved property keys and executable/computed/spread values,
  external alias versus local import names, eval/arguments label versus binder,
  legal contextual names and ordinary async/generator syntax.
- Bound-call controls include supplied Set containing bind and a complete
  native/public source binding bind to a function then calling it with eval;
  tagged call head and explicit-kernel controls remain distinct. Verify inner
  kernel parameter scopes and absence of sibling leakage; validation clause/
  method environments stay separate. The source Func preextension union is an
  explicit B2 carryover, not a general expansion-scope claim in this repair.
  Keep legacy aggregate classNames/class_names D1 projection unchanged; new
  member-role queries serve validation only, per the governing contract's
  final readiness disposition. Do not add newly recognized member parameters
  to the old whole-class environment.
- Fix product reserved-word parity to run self-contained .mjs fixtures with
  export {}, no imports/permissions and offline/no-config/no-npm/no-prompt
  flags. Check actual runtime parse status/diagnostic, exact Rust/JS table
  equality and a fixed normative candidate population independent of the table
  under test. Keep eval/arguments as separate binding restrictions. Correct
  await/yield-as-legal sentinels and conformance expectations without skipping
  legal D1 shadow tests. Historical research matrix remains historical.
- Actual cold copied CLI/materialized lang route compares all eleven modules,
  retaining prior eleven public tests and executing the new regression file.
  Browser compile rejection and legal emitted ESM execution are separate from
  existing eval-based run/load limitations. Keep B1 re-entry and all-nine host
  behavior green, including literal/helper paths requiring no type context.

Focused controls first; then fresh make check (includes docs once), browser
make bundle-size-check under80KiB, and post-commit make check-cited-paths.
Use explicit DENO_DIR=/Users/oubiwann/Library/Caches/deno and owned npm cache
from the first command; create owned tmp/XDG/evidence directories before use.
Preserve warnings, failures, launch conditions and actual denominators. Do not
auto-accept snapshots or add ignore/suppression bypasses. Do not repeat a full
gate against a known-bad focused candidate. No artifact cap or new reconstruction
framework; retain useful existing product receipts and bounded raw evidence.

## Files, commits and return

Permitted source paths: crates/lykn-lang/src/binding.rs and resolver.rs (their
inline tests); crates/lykn-cli/src/compile.rs; crates/lykn-cli/tests/
macro_dependencies.rs; packages/lang/{binding,compiler,reserved-words,
expander-core,identifier}.js and exactly corresponding embedded copies;
test/expander/{reserved-words-parity,conformance-corpus,binding-walker-parity}.test.js;
test/forms/reserved-binding-output.test.js. Focused new Rust integration tests
may use crates/lykn-cli/tests/reserved_bindings.rs if inline tests cannot prove
actual compile/check/stripped runtime routes. No unrelated source/docs changes.
If another actual helper consumer requires adaptation, report exact path to
root for a bounded amendment before modifying it. Avoid wholesale JS formatting.

Commit only the actually changed explicit source/test paths using git commit
--only. No blanket staging/amend. Include contiguous trailers:

Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>

CC may append an iteration05 checkpoint to closing-report.md and write only
artifacts/increment-ic01/cc/ within this slice, with no planning stage/commit
or ledger/parent edit. Root owns those. Return exact source head/tree/clean
status, changed paths, contract readback/caller map, baseline failure witnesses,
fresh tests/gates and limits, API/S06 impact and source/build ownership.
Mark proposed-done only; separate Sol acceptance is mandatory before dependent
qualified-constructor work. Preserve every LC row and all S04–07/book/human gates.
