# Implement native clause-local match scope

## Assignment and intake

Luna 6 High CC, independent Sol 6.1 High CDC, standard Autonomous Mode.
The Operator authorized this bounded I2 delivery after the validated
S09 local release. Own source in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
on `codex/completion-value-flow`, starting clean
`7b17a7841cc4d749276467ec2bcec7ed9faed7b2`, tree
`da690cba4b3e2d35feec0ac5853f279ffa83e664`. Release at the same
baseline is read-only. CDC owns the planning index. Read this prompt,
[slice plan](slice-plan.md), [ledger](ledger.md), [exact fixtures](artifacts/fixtures.md),
source AGENTS and the named source/code-guidance sections below.
Confirm exact model, pins, scope and ownership before editing.
S12 is its own bounded correction budget, initially 0/5. Preserve
historical S04/S09/tooling counts. Repair clear in-scope faults
autonomously with retained numbered follow-ups. Escalate material
design or evidence ambiguity.

Intake manifest. Read the complete assignment, plan, ledger, exact
fixture record and source AGENTS. In source, read the complete
resolver scope-planning/resolve/shadow sections, Pass2
`expand_expr`/scoped/sequence functions, classifier
`classify_match` and pattern helpers, binding occurrence
definitions and projection, both semantic-role fixture runners,
and Guide 00 Match. Read the Lykn skill's ADT/pattern guidance and
the installed Rust Guidelines core idioms and type-design TD-01,
Testing Discipline's quality/behavior/triage sections and JS/Deno
guidance's testing and permissions sections. Resolve skills through
the installed catalog. Supporting evidence goes in this slice's
`artifacts/evidence/cc/` or exact owned scratch locators retained
there. Return bounded read coverage and source-cited contract
readback before source ownership begins. Recover truncated required
sections. Earlier I2 artifacts are background unless a question
depends on them.

Research tooling must use Lykn for all authored helper, orchestration,
validation, JSON and evidence logic. Native CLI/shell is only direct
invocation and simple filesystem lifecycle. No Python execution,
Ruby/Fennel/Node/handwritten JS as a research substitute, new helper
framework, dependency, remote action, K trial or release integration.
Normal product Rust, JS tests and Lykn source are allowed.

## Binding behavior

- A genuine unresolved `match` has the subject in the incoming scope,
  structural pattern syntax and one independent environment for each
  clause's guard and ordered body. Body declarations affect only
  following siblings in that clause. A bound or tagged `match` head
  stays an ordinary call and contributes no pattern sites. User macro
  precedence for genuine unresolved heads remains unchanged.
- Preserve original source and spans, exact public `BindingSite`
  projection and order, classifier diagnostics, output role and
  target semantics. Clause structure is determined by the existing
  native match grammar, including its exact `:when` selection. Pattern
  structure is never an executable macro dispatch site. A macro can
  still generate the whole match, and guards and bodies still expand.
- Public compiler production is unchanged. Retain ordinary bound
  calls, reserved-name rules and the accepted statement/consumed
  distinctions. No analyzer usefulness change or general completion
  work. S07/S08 own the eventual integration-range API/book review.

## Concrete recipe

1. In `classifier/forms.rs`, factor the existing `classify_match`
   clause parser into one private borrowed parser. It returns original
   `pattern_input: &SExpr`, optional `guard: &SExpr`, body slice and
   original clause span, plus the parsed `Pattern`. Keep actual
   order: list/length check, `classify_pattern_captured` on the first
   child, select the guard only with the current length/keyword
   predicate, then require nonempty body. `classify_match` projects
   the exact current owned `MatchClause`; its existing diagnostics and
   captured occurrence order are unchanged. A crate-private scope
   projection of that same parser returns borrowed syntax slots and
   that clause's successful `Vec<BindingOccurrence>`. Use an
   independent local capture so no failed parse contributes sites.
   A malformed clause can be copied unchanged by the scoped walks
   and still diagnosed by the existing classifier. Avoid a second
   match grammar or public AST field. In `binding.rs`, make the
   existing `BindingOccurrence::project` crate-visible for the lint
   consumer only. Keep the public walker and binding projection.
2. In `resolver.rs`, extend `ScopePlan<'tree>` with a Match variant
   containing clause-aligned optional borrowed plans. Keep the public
   resolver API. Refactor the private computation to return the plan
   and any existing own non-match occurrences together, so ordinary
   forms are still classified once per existing traversal. Check raw
   head spelling `match` only to separate this special route. The
   new variant is available only when `as_form_head()==Some("match")`
   and the name is absent in incoming scope. If the raw head is
   `match` but already tagged or scoped, choose Sequence and no
   own occurrences. This prevents false BindingDef tags even on
   clause-shaped ordinary call arguments. Leave other form plans
   and hoist behavior unchanged.
3. Resolve the subject under incoming scope. Preserve the clause
   and pattern list spans. Recursively copy the pattern as structural
   data, tagging only actual binder atoms by borrowed identity
   (`ptr::eq` as in NE-C14). Structural atoms carry no new lexical
   tags and no normal resolver/form dispatch is called there.
   Extend the current scope with the actual clause names, resolve
   guard as a single operand, then `resolve_seq` on the body and
   restore the mark. Keep any incoming binding occurrence checks
   needed outside this structural subtree. Missing subject or
   malformed clauses remain unchanged for existing diagnostics.
   The shadow walk consumes the same Match plan. Inspect the
   subject in incoming scope, skip pattern traversal and project
   each binder for ancestor collisions. With the clause scope
   active, check the guard in its own single-slot region and
   `shadow_seq` the body; restore the mark before the next clause.
4. In `expander/pass2.rs`, consume the same Match plan after the
   existing macro dispatch. For tagged `match` heads honor their
   existing ordinary-call role at the earlier macro gate too.
   Expand subject once in incoming scope. Clone raw pattern and
   guard marker exactly, expand optional guard once in its own
   scope, and `expand_seq` the body. Restore scope after success
   or failure before returning. Current `expand_expr` returns
   Option; preserve each fixed subject/guard slot even if an
   internal empty result is encountered, using the original slot
   in that unreachable-by-current-language condition. Do not shift
   roles, run pattern syntax through `expand_expr` or introduce
   a new diagnostic contract. Preserve exact current macro wire.
5. In Guide 00's Match section, add a compact sentence or paragraph
   describing incoming subject scope, clause-local guard/body
   bindings and structural pattern syntax. Existing examples and
   statement/consumed/checked behavior remain intact.

Rust Guidelines chapter 05 TD-01 SHOULD favors a closed named role
over implicit flags. Apply that in private ScopePlan and prove all
three consumers keep the same roles. Core idioms favor existing
iterator/Result shapes, borrowed original syntax and existing source
diagnostics over a second parser or new semantic AST. Read the actual
Rust guidance, source Guide 00 match section and Lykn skill pattern
examples. Testing discipline's Test Behavior And Contracts requires
a wrong old result to discriminate each real route. Apply JS/Deno
guidance's test/permission sections only to the existing public test
table and strict child, using existing native project config and
permissions. No JS production refactor.

## Freeze tests, then prove the old condition

Use existing Rust resolver helpers and add three named tests in its
test module. Freeze all tests before dependent execution. Tests must
use the old public callable surfaces so the baseline can compile.

- `match_scope_separates_subject_guard_body_and_siblings` resolves
  `(match (match 1 (_ 2)) (match :when (match 3) (match 4)) (_ (match 5 (_ 6))))`.
  Assert unchanged syntax/span, incoming nested subject head
  Unresolved, exact first clause binder BindingDef, its guard and
  body heads BindingRef, and sibling's genuine nested head Unresolved.
  Read actual AST paths or existing helper, not a name-only summary.
  Old fails sibling dispatch.
- `bound_match_has_no_pattern_definition_sites` resolves
  `(bind match f) (match 0 (phantom 7) (ordinary 8))`. Assert the
  outer call head BindingRef and both coincidental operand heads
  Unresolved. Also tag the outer raw head BindingRef in a separate
  invocation without the preceding declaration and assert the
  same operand roles. Old untagged scoped route falsifies the test.
- `match_shadowing_is_clause_local` uses
  `(match 0 (slot :when false (bind slot 1) slot) (_ (bind slot 2) slot))`.
  Assert `shadowing_sites` returns one Bind named slot at the exact
  first clause body's nested declaration span. Old erroneously
  also warns on the sibling declaration. Existing classifier
  invalid-match tests remain unchanged and are run in the full gate.

Add the two [literal fixtures](artifacts/fixtures.md) and table
entries in `crates/lykn-cli/tests/semantic_roles.rs` and
`test/forms/semantic-roles.test.js`. Native 17, public 1 parent/16
steps. No changes to old assertions, flags or fixture bytes. Exact
source/test freeze with normal hooks and
`/private/tmp/lykn-s04-i2.tBlMBxu9/s12-test-message.txt`. Await CDC static release,
then actual old native/public/three unit outcomes with full raw
evidence. Distinguish known reds from harness/tool setup. After CDC
reconciliation, implement source only, freeze with
`/private/tmp/lykn-s04-i2.tBlMBxu9/s12-source-message.txt` and await CDC static release.

Production allowlist `binding.rs`, `resolver.rs`, `classifier/forms.rs`,
`expander/pass2.rs` beneath `crates/lykn-lang/src/`, and Guide 00.
Tests use the already-listed native/public tables and fixture files.
Test-only freeze may touch the test module in resolver.rs. There is
no compiler JS or embedded mirror delta.

## Current gates and handoff

Use fresh separate config-free `/private/tmp` TMPDIR, XDG and npm
roots and fixed `DENO_DIR=/Users/oubiwann/Library/Caches/deno`. Record
actual named ancestor probes and exact argv/cwd/scoped env/raw paths
before launches, terminal exits and original streams afterward.
Rust/Cargo 1.97.0, Deno 2.9.6 from ordinary PATH. Pin actual CLI,
test binaries and Deno after no-run before tests and again after
focused runs. Preserve ordinary parallel native tests and existing
per-fixture XDG isolation. Strict fixture children use existing
`--no-config --cached-only --no-npm --no-remote --deny-net --no-prompt`.
Retain full generated modules, actual optional DTS observations,
child outcomes and all earlier failures. Current gates are native
17, public 1+16, three unit controls, normal unfiltered `make check`
and standalone `make check-cited-paths`. Report post-Make binary
identities, clean status and exact source scope. Return actual
proposed-done rows and explicit exclusive source/index/build/raw
ownership. CDC then runs separate focused/full/cited gates.
