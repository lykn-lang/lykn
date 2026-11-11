# S02: repair existing recursive patterns and zero-field variants

You are CC, Luna 6 High, implementing the operator-authorized S02 in Autonomous
Mode. Independent reviewer is a separate Sol 6.1 High. Deliver actual source
and regression fixes, not another design packet. Root retains coordination and
Git ownership outside your explicit write phase. Do not spawn other agents.

## Homes, authority and required reading

- Source `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
  branch `codex/adt-pattern-correctness`, base
  `685bbe1dbbfdaf34ecf49017c22e43f7dc8adb95`.
- Planning `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch planning;
  your assignment/plan/ledger live in
  `project03-language-evolution/arc04-qualified-adts/slice02-existing-adt-correctness/`.
- Read source `AGENTS.md`, `docs/guides/09-anti-patterns.md` first, this slice plan
  and all PC rows. Inspect actual relevant source, tests and original controls.
  Read installed collaboration-framework and its applicable implementation,
  verification/testing guidance; installed rust-guidelines (required
  anti-pattern summary, relevant enum/ownership/API guidance) and
  javascript-deno-guidelines for the compiler sources. Their skill root is
  `/Users/oubiwann/Library/Application Support/ChatGPT-Profiles/personal/codex-home/skills/`.
  Use bounded relevant guides; list what informed the repair in the handoff.
- You may change necessary product Rust/JS and product tests, plus this slice's
  closing report/evidence. Root updates parent plans/ledgers after review.
  No release merge, push, publication, dependency additions or unrelated fixes.
  Ask root about ambiguity; obvious bounded corrections are authorized.

No Python/Ruby/Fennel helpers or new handwritten JavaScript research helpers,
including temporary ones. New research probes/drivers must be Lykn. Product
compiler JS and normal product-test changes are authorized. Invoke existing
tools directly with shell; shell is not a replacement program for research
logic. Preserve all original evidence and failed attempts; do not encode
historical failures as accepted behavior in tests. New runtime probes use valid
Lykn `func :args ... :returns ... :body ...`, with `?` for value conditionals
where appropriate. Learn from actual guides rather than inventing syntax.

## Defects and explicit scope

Original witness home relative to planning:
`project07-core-library-research/arc02-lykn-authoring-evidence/slice01-json-value-and-decoder/artifacts/at02/independent-original/`.
Read `nested-control/{nested.lykn,report.md,launches.txt}` and
`zero-control/{zero.lykn,report.md,launches.txt}` and their existing public
Lykn drivers. Preserve these unchanged; replay them on the candidate.

- NPAT: balanced Some(InnerNumber(7)) must print `7`. Native drops nested checks
  and bindings; public checks its nested temporary before declaring it.
- ZVAR: `(type ZeroForms (ListZero) BareZero)` must print
  `["object",{"tag":"ListZero"},"object",{"tag":"BareZero"}]`.
  Native already does; public list spelling currently emits a function. Exit
  success alone is not a sufficient oracle.

This slice keeps existing flat names/string tags, raw tagged object matching,
existing type registry and constructor field layout. Do not implement S03's
qualified syntax, symbol identities, immutable facade, module ABI or static
owner universe. No emission comparison or tree-shaking acceptance is in scope.
Recursive existing object/literal children and conditional bindings are in
scope because the shared matcher must not retain two contradictory semantics.
No new array patterns or unrelated structural property-key redesign.

## Concrete implementation recipe

1. Inspect native `crates/lykn-lang/src/emitter/forms.rs`:
   `compile_pattern` (~4541), three match consumers (~4165,4275,4425),
   `compile_let_pattern` (~4930), four conditional-binding consumers (~4727–4890).
   Classification and analysis already recurse. Native `emit_type` (~3302)
   already emits both empty-field spellings as constants: keep that behavior.
2. Replace dropped-child lowering with one private recursive pattern plan.
   A suitable small shape is prelude declarations, ordered short-circuit
   predicates, and success-only user bindings. Root suggests declared fresh
   field temporaries plus kernel `(seq (= cached parent:field) true)` conditions:
   capture only after parent guards, then recurse on cached. Returning literal
   true from capture is essential for false/0/empty/null payloads. Both native
   and public backends already support sequence expressions and assignment.
   A comparably small ordered lowering is acceptable if it proves the same
   scope/control/effect contract; don't introduce another function boundary.
3. Work an example before coding: Some(InnerNumber(value)) first null-checks
   the outer target, checks Some tag, captures .value once, null-checks that
   cached child, checks InnerNumber tag, captures its .value once, then binds
   user `value` inside the selected clause. A wrong outer/inner tag must skip
   later extraction. `_` does not read its field. Missing/null nested subjects
   mismatch without throwing. A nullish guard (`target != null`) before tag
   access preserves existing tag compatibility without adding nominal guards.
4. Share the recursive plan with native conditional binding. Only root simple
   binding in if-let/when-let keeps its nullish check; a nested binding remains
   irrefutable and can contain null/false/0/empty string. Keep object existing
   typeof/null/key checks and recurse on demanded children. Literal children
   must test values, not create bindings named true/null/etc.
5. Thread plan prelude through every affected native match and let consumer,
   evaluating subject once. Use existing reserved-emitted-name census and
   unreserved gensym mechanisms for all introduced names, including normalized
   user names/guard/body/subject. Preserve return/break/continue and checked/
   protected paths. The legacy statement matcher currently uses an else-chain
   that may suppress fallback after a false guard: make ordered candidate
   selection consistent, without enabling unrelated completion lifting there.
6. Public `packages/lang/surface-helpers.js::compilePattern` (~346) and
   `compileLetPattern` (~529) need the same plan and recursive semantics.
   Inspect ALL callers (classifier.js, surface.js, expander-core as applicable).
   Preserve positional registry fallback rather than silently deleting it.
   Explicit compatibility boundary: once/order/wildcard-no-read guarantees
   cover registered constructors and object patterns. Unregistered public
   constructors retain the historical Object.values(target)[i+1] enumeration
   mapping/read behavior for flat bindings; do not silently redesign it or
   claim field-selective semantics there. Add a retained-behavior regression
   and disclose this limitation. Imported/qualified resolution is later work.
   Compiler-generated assignment/seq must remain sanctioned kernel output:
   surface `=` means equality. Use existing kernelArray/markKernel correctly.
   `classifier.js::emitMatchStatementMacro` (~1405) retargets provisional
   targets and establishes a clause environment from USER bindings: include
   new plan nodes in retarget/emission, reserve compiler temps, and don't expose
   internal declarations as user pattern bindings. Value matcher (~1314) and
   IfLet/WhenLet consumers must also consume prelude safely.
7. Public `classifier.js::emitTypeMacro` (~1487): normalize list and atom
   zero-field declarations to the same constant object emission/registry entry.
   Fielded variants stay constructor functions. No freeze, symbol or facade.

## Regression and acceptance recipe

Use existing product harnesses rather than inventing a duplicate runner:
`crates/lykn-cli/tests/semantic_roles.rs`, `match_clause_validation.rs`,
`test/fixtures/semantic-roles/`, and surface Lykn tests for match/type/
conditional-binding. `packages/testing/helpers.js::compile` is lax/shared-state;
it is not the only proof of strict public compilation. Reuse actual native and
strict public API paths, including default and stripped native output. Inspect
which strip/public modes actually exist; don't claim unsupported combinations.

Add discriminating runtime tests for nested success, wrong outer and inner
tags, literal children (including false/null/undefined), nested object/ADT
combinations, zero-field matches, null/missing children, falsy bound payloads,
guard-false fallthrough, clause-local scope, and side-effect order/once. A getter
trace must catch repeated/premature child reads; wildcard must not read. Include
statement, value, protected and conditional-binding paths, with return/loop
transfer and generated-name collision coverage as affected. Expected values
must distinguish skipped predicates from merely restored bindings. Keep test
scope proportional: fixtures can group related checks with exact trace output.
Review emitted shape where that tests a real ordering invariant; avoid brittle
new gensym names. Existing substring expectations may need semantic updates.

Replay unchanged original NPAT and ZVAR through native and strict public
pipelines on the current candidate binary. Record command, tool/source pins,
status and exact stdout/stderr; public evaluation of generated JS is not a
new handwritten JS helper. Use preserved Lykn driver where practical.

Run focused regressions first, then `make check` (already includes docs),
`make check-cited-paths` on committed HEAD and `make bundle-size-check`.
Do not rerun the full suite gratuitously without a changed candidate/failure.
Record failures before fixing them. Never skip an assertion to obtain green.

Commit only exact named source paths with `git commit --only`, using contiguous
trailers:
`Co-authored-by: Codex <noreply@openai.com>`
`Co-authored-by: Billo AI <ai-engineering@billo.systems>`.
Commit this slice's closing report and useful evidence separately on planning;
leave PC rows open/proposed-done pending CDC. Report all five PC rows, source
and planning commit hashes, actual changed file lists, validation commands/
results, artifacts, failed-attempt dispositions, and downstream boundaries.
Return both worktrees clean and Git/build ownership to root for independent
Sol review. Do not update parent acceptance or call your work independently
verified.
