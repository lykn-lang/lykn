# Implement direct consumed source-function returns

Luna 6 High CC in standard Autonomous Mode. Sol 6.1 High CDC
owns independent acceptance. Read this prompt, [plan](slice-plan.md),
[ledger](ledger.md) and [fixtures](artifacts/fixtures.md) in
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. Source is
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/completion-value-flow`, exact clean
`31893710bbba8999e936fade2d79ae6f6aee929c`, tree
`3a5e2505d991896016fb1a20070487325c37d19c`. Wait for explicit
source/index/build/raw ownership. Keep release read-only.

## Intake

Load source AGENTS.md and skills/lykn/SKILL.md sections on
`func`, `return`, `do`, `if`, `match`, kernel and macros.
Read Guide 00 matching/branch control sections and Guide 06
function return/region portions. Read the installed Rust,
JavaScript/Deno and testing skill entrypoints and their
relevant sections. Read exact emitter/forms.rs routines
`emit_body`, `emit_function_body`, `emit_func_single`,
`emit_expr`, `emit_match`, `emit_match_statement`,
`emit_match_iife`, `emit_if_expression`, `emit_do`;
context.rs; semantic_roles.rs function/child roles.
Read public expander.js `expandAt`, `expandExprInner`,
`expandChildrenPlan`, `expandChildrenSeq`, `childRoles`
and `emitSurfaceMatchStatement`; classifier.js
`emitMatchStatementMacro`, function/surface emission and
surface-helpers.js `wrapReturnLast`; compiler.js return/if/do.
Read the two existing semantic-role runners. Return source
identity, loaded scope, route/ownership readback and any actual
blocking dependency before editing.

## Contract and implementation

Only direct explicit return and implicit result tail in an
ordinary unprotected single-clause named `func`, including actual
expanded macros. Treat no return annotation or `:returns :any`
as ordinary when no postcondition is present. Genuine nested
functions own their own exits and must not have their bodies
rewritten by a surrounding result walker. Preserve other
function, generator, typed/post and legacy wrapper routes.
Keep bound/tagged match or other heads as ordinary calls.
Use existing grammar, child roles and fixed-point dispatch.
No AST/API/wire changes, runtime helper, reference/argument
lowering, bind destinations or new temporary naming in S14.

**Native.** Activate a private direct-return region only around
the selected function body and restore it. Prevent leakage into
existing synthetic value wrappers or unselected function
families. The old checked/legacy match flag remains separately
meaningful. Use `as_form_head` for dispatch and the existing
checked classifier where actual match input needs parsing.
A private direct-tail result distinguishes a regular emitted
value from already-emitted lexical statements. Build a single
kernel block for the latter, so an ordinary implicit func
tail can retain its existing statement/no-return-wrap boundary.
Apply the same lowering to the operand of a genuine explicit
`return` in an active statement region. Preserve bare return and
normal value emission for unselected root forms. Keep the
first-fatal typed error route and source positions.

For admitted if/do/match tails:
- Conditional: evaluate condition normally once, and lower each
  arm in the same source return destination. If both arms are
  regular value expressions, keep the existing pure ternary.
  Otherwise create the real braced conditional with a return of
  each regular arm value and direct control for statement arms.
  Keep existing no-else diagnostic. Untaken arms are lazy.
- Do: keep one real lexical block and sequential statement
  prefixes. Recurse only into its tail result. A bare transfer
  remains a source statement. An ordinary value is returned
  exactly once. Preserve the existing undefined completion for
  an empty do or a normally completing statement-only tail.
- Match: reuse the accepted S09 ordered candidate implementation,
  subject once, guard scope, terminal unguarded pattern and exact
  exhaustion error. Introduce a private selection for clause
  body emission so the original statement path keeps its exact
  output/behavior. In direct-return mode, selected clause
  prefixes remain statement sequence, tail recursively uses the
  return destination. Existing statement-arm guard, binding and
  control semantics remain. Do not reuse value IIFE's unconditional
  return wrapper.

**Public JS.** Preserve `expandExpr` legacy and public expand/
compile contracts. Propagate a private direct return operand use
inside the existing synchronous expansion. Respect actual
resolution, kernel escape normalization, surface priority, and
user macro fixed point. Select Match before its existing
value-IIFE emission, reuse `emitMatchStatementMacro` by supplying
the direct-return clause-body callback. Specialize if/do after
the established macro gate and before generic child expansion.
Use an ordinary final lexical kernel block for direct statements,
and preserve pure conditional and ordinary values. If needed,
use private occurrence identity only inside pass2 to distinguish
new direct blocks from ordinary value nodes. Nothing new crosses
exported `expand`. Never expand a macro twice to select the plan.

Use direct operand expansion for real returns (including the
normal `wrapReturnLast` result of selected named funcs) in the
active ordinary function's statement region. Selected regions
must remain distinct from existing `Legacy` or `Protected`
wrappers and unselected semantic function bodies. Use a private
named-function entry use and direct-statement child use, with
the existing statement tests shared by both statement uses.
Choose entry only for the selected classified Func using the
existing `parseKeywordClauses` and existing single/multi shape.
Forward direct-statement use through actual if, loop, block,
switch clause and try/catch/finally statement regions. A new
semantic function or legacy/protected wrapper decides its own
use. The established statement Match body callback must carry
the direct-statement use when inside this selected region.
Reuse the
current sequence-env logic so do/match body prefixes hoist only
to following siblings and the tail sees the actual current env.
Keep conditions and subject/guard expressions in their existing
normal value slots. The public result must be normal kernel and
must work through both public pipelines without an extra wrapper.
Canonical expander.js and its embedded copy must match byte for
byte. If a different source path is required, report the exact
reason and retain a clean freeze before behavioral execution.

This is a bounded destination delivery. It claims transfer-free
headers, direct result composition through the three admitted
forms, and real statement-prefix transfers. Transfer-bearing
ordered/reference leaves and subject/guard/test value prefixes
remain held for the following I2 readiness. Preserve their
existing routes outside the admitted contract. Do not present a
control-bearing fallback in an admitted result as supported.
I3/I4, release changes and frozen K are out of scope.

Applied guidance: Rust EH-04 favors existing typed first-fatal
propagation; a private enum expresses actual cardinality without
changing the AST API. JavaScript/Deno keeps private synchronous
module state scoped and uses existing Deno.test controls. Test
behavior through real source, actual generated output and pinned
strict child, preserving original greens and expected old reds.
Use Lykn for authored evidence or research logic and native
tools for exact commands, Git and filesystem operations. No
Python, Node or substitute research program.

## Exact paths and execution

Test-only freeze: existing native
`crates/lykn-cli/tests/semantic_roles.rs`, public
`test/forms/semantic-roles.test.js`, and the four listed fixtures.
Use existing runner stdout/stderr, generated module and DTS
checks. Use prepared commit body
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-test-message.txt`.
Send clean actual commit/diff/body and hold for static release.
Then observe old grouped no-run, direct native suite and public
parent on exact compiler `31893710`. New native 26 total and public
one parent with 24 steps plus five independent negatives. Retain
actual F1/F2/F3 outcomes even if old phase differs. F4 expected
trace may already pass; inspect actual whole old module. No
relaxed assertions or accepted old fixture edits.

After CDC reconciles actual baseline, production allowed in
native emitter/forms.rs and context.rs, canonical
`packages/lang/expander.js` plus exact embedded mirror, and
Guide 00 narrow direct-return clarification. Existing native
emitter unit tests can be added in the same owned file only
when needed to discriminate actual classification or context
restoration. Use prepared
`/private/tmp/lykn-s13-release-cdc.ovKWFaY3/s14-source-message.txt`,
freeze exact paths and await static release. No implementation
before old baseline review.

Use prospective per-command argv/cwd/scoped env/raw locations and
actual named config checks. Fresh config-free /private/tmp
TMPDIR/XDG/npm, fixed DENO_DIR
`/Users/oubiwann/Library/Caches/deno`, ordinary PATH, Deno 2.9.6
`/opt/homebrew/bin/deno` SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`,
Rust/Cargo 1.97.0. Pin actual CLI and direct test executable
after no-run. Set explicit `LYKN_TEST_DENO` and distinct
`LYKN_SEMANTIC_ROLE_EVIDENCE_DIR` for focused runs; verify actual
raw and complete modules for each new fixture. Retain real child
statuses, native DTS absence, same strict Deno flags, original
negative controls and no source artifacts in scratch evidence.

Current focused native and public, normal unfiltered
`make check`, standalone `make check-cited-paths`, post-Make
producer pins and real fresh materialized JS mirror comparison.
Check full generated bodies for actual direct transfers and
nested source function retention, and keep pure ternary
preservation. Return actual CR-01 through CR-04 proposals,
scope and limitations, and explicit clean source/index/build/raw
ownership. CDC separately reproduces current gates.
