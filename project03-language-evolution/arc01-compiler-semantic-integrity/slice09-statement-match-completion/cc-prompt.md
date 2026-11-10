# Implement direct statement-match completion

## Authority, source and intake

S09 is the first bounded I2 delivery approved on 2026-11-09. Luna 6
High CC, Sol 6.1 High CDC, standard Autonomous Mode. Exclusive source
ownership follows readback. Task branch `codex/completion-value-flow`,
checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
exact starting commit `f348ae4239c45e21b730e66cc229875f06ed6e8e`.
Release d736 is read-only. Preserve accepted I1/NE-C14, all prior
refinements and K0/13. Source-ready direct statement work only.

Read [plan](slice-plan.md), [ledger](ledger.md), the I2 row and source
target rule in [completion design](../slice04-completion-value-flow-integrity/artifacts/incremental-completion-design.md),
the existing NE-C13 backlog entry, source AGENTS, Guide 00 match,
`emitter/forms.rs` statement/value match and checked Statement uses,
`semantic_roles.rs`, actual public `classifier.js` emitMatchMacro and
`surface-helpers.js` compilePattern, `expander.js` scope plans and
expansion branches, and `compiler.js` actual child grammar.
Read both existing semantic-role tests and exact match-shape controls.
Apply Rust TD-05/06 private precise roles without public API changes,
JS/Deno named internal ESM and existing runner style, and behavior-first
testing discipline. Read back actual role, names, fixture and evidence
contracts before edits. All evidence helper logic is Lykn or direct
native CLI/filesystem. Product Rust/JS/Lykn only.

## Native statement algorithm

Keep native `emit_match_iife` and all consumed dispatch unchanged.
Replace the statement branch in `emit_match_statement` with one ordinary
kernel block. Evaluate and save the subject once in Value, initialize
one local `matched` bit to false, then compile each clause in source
order. Candidate condition is `!matched && patternCheck`, or simply
`!matched` for an irrefutable pattern. Place existing pattern declarations
inside its candidate block. If guarded, evaluate the guard once in
Value inside that binding scope, then set matched true and emit the
entire clause body in Statement. Unguarded selection sets the bit before
the body. Keep `emit_in_context` and context restoration. No
extra function, loop or exit label. A source return, break or continue
keeps its actual surrounding target. On normal exhaustion throw
`new Error("match: no matching pattern")` using existing kernel shape.
An unguarded irrefutable terminal can omit unreachable remainder and
exhaustion after validating source. A guarded irrefutable is not terminal.

Before allocating target and matched, reserve emitted JS spellings from
the already macro-expanded subject, guards and bodies, plus names in
actual Pattern leaves. Use existing `to_js_identifier` on atom colon
segments, including free roots, via a private local scan for List/Cons
and Pattern children. Use normal emitter gensym and choose unused
names. There is no whole-unit hygiene rewrite. Keep existing pattern
checks/bindings via compile_pattern. Update only actual obsolete
statement-only shape assertions, preserving Value tests.

## Public expansion adapter and statement assembly

The public `expandExpr(form, env)` low-level signature retains legacy
behavior. Factor its sanctioned mark wrapper into private recursive
`expandAt(form, env, use)` with closed statement/value/legacy choices.
Start genuine `pass2ExpandAll` forms in Statement. In `expandExprInner`,
the lexical bound/marked kernel gates keep their actual order. A
genuine unresolved classified Match in Statement uses the statement
builder. A value or legacy Match uses exact existing emitMatchMacro
and expands that synthetic tree in Legacy. Likewise classify-generated
IfLet, WhenLet, SomeThread and Dissoc IIFE trees retain Legacy. An
unknown/structural child does not inherit Statement by accident.

Pass the private use through fixed-point user-macro, desugared and
quasiquote expansion results and explicit kernel escape. Each actual
expression is expanded once. The existing bound-call early return
always expands arguments in Value (Legacy stays Legacy). Do not turn
a binding named match into syntax or change public macro precedence.

Use actual compiler grammar for the role adapter in `expandChildrenPlan`
and its existing sequence/conditional helpers. A genuine Statement
if has a Value test and same-incoming-environment Statement arms. Block
and Statement do have Statement sequences. Consumed do/block and
consumed if arms keep legacy nested expansion. Loop headers retain
Value and body tails Statement (while/do-while list index 2 onward,
for index 4, for-in/of/await-of index 3). Named function body starts
at list index 3, lambda at 2, function* after the actual named or
anonymous parameter slot, raw arrow at index 2 only if it has multiple
body items. A single raw arrow body is Value. Real function body roles
apply even when the function itself is a Value. Existing surface
function emission already inserts explicit return for a consumed tail;
the return operand is Value. Async/export can forward use to their
actual wrapped form. Label's target is structural and its body can be
Statement. For genuine Statement try, expand main children and structural
catch/finally bodies as statements using existing environments. For
genuine Statement switch keep subject/test in Value and case body
sequences Statement, preserving raw default marker. Existing scope
and hoist logic remains. Recognize roles through actual form-head
dispatch, not raw spelling on ordinary calls. Do not add a generic
statement role to keys, parameters, quote/data or class members.
Class-member and other opaque paths, transparent consumed wrappers,
typed/post exits and ordered references remain later composition work.

In classifier.js, reuse the existing per-clause shape validation by
factoring its clause parser without changing value emitter output or
error order. Give the private statement builder the existing pattern
compiler and expansion callbacks via the internal module boundary.
No new package export or marker-dependent serialized shape.
Statement Match expansion works as follows:

1. Reserve normalized names from the original match subtree. Use a
   provisional target from the normal gensym sequence that avoids
   those names. Parse clauses and call existing compilePattern once
   per clause against this target, retaining only generated checks and
   bindings as separate fragments. Determine each guard/body lexical
   env from that clause's actual generated const binder slots, as
   the existing generated-block walk did. The subject sees the
   outer env. Expand subject and guards exactly once in Value and
   each body exactly once as a Statement sibling sequence. Preserve
   one actual node for each consumed slot.
2. Add normalized names from those expanded pieces to the reservation,
   including colon roots and macro-generated free names. If this
   introduces a collision, choose a fresh target and relocate only
   the provisional symbol object and exact target colon-root atoms
   in the separated compiler-generated pattern fragments. The
   initial reservation excludes all original raw pattern spellings
   from that provisional name. Do not rewrite the source or expanded
   pieces. The existing compilePattern field/member syntax survives.
   Allocate the matched bit after reservation.
3. Assemble an ordinary marked kernel block from those pieces with the
   same subject/condition/guard/bit/exhaustion algorithm as native.
   No further macro walk of the already-expanded source nodes. Existing
   kernel compiler emits the real source transfers with its normal
   lexical blocks. All emitted guards and body references retain their
   existing resolution metadata.

## Frozen proof and source paths

Add the five shared fixtures below to the existing semantic-role native
and public populations. Preserve actual harness and per-fixture XDG
isolation. Add each native case as a separately named test; do not hide
one failing witness behind another. Exact current total is native 14
(including one test with four prior negative cases), public 1 parent
with 13 steps. Read the separate literal fixtures from
[fixture specification](artifacts/fixtures.md). No invented after-the-fact
expected results. For F5 call existing public resetGensym before that
case only, to make the first provisional target choice observable.
Require complete modules and strict Deno runtime bytes, empty stderr
and actual native optional DTS outcome. Review F5 original free name
and distinct generated target/bit in both final modules.

Production allowlist `crates/lykn-lang/src/emitter/forms.rs`,
`packages/lang/{classifier,expander}.js` and exact embedded mirrors.
Tests `crates/lykn-cli/tests/semantic_roles.rs`,
`test/forms/semantic-roles.test.js`, five named shared fixtures and
existing `test/surface/match_test.lykn` obsolete statement IIFE shape
only. Keep explicit Value IIFE shape witness as a consumed source use.
Guide 00 match gets a narrow statement guard/transfer clarification.
No dependency, public AST/API, product cache, release, K or I3/I4 work.

## Execution and handoff

Fixed normal exact-path Git messages
`/private/tmp/lykn-s04-i2.tBlMBxu9/i2-test-message.txt` and
`/private/tmp/lykn-s04-i2.tBlMBxu9/i2-source-message.txt`. First freeze only new fixtures and
test table additions, with old production f348; return exact Git
source for review before baseline. Run old focused native/public,
retain actual results and all files, reconcile prediction mismatch
before production. No full Make expected-green claim on red tests.
After source implementation and exact existing shape updates,
format and return immutable source for static release. Use ordinary
parallel native tests, no filter to hide a failure. Precreate fresh
config-free /private/tmp TMPDIR/XDG/npm roots, prospectively record
actual named config probes, argv/cwd/env/raw paths and exits, build
no-run and pin actual CLI/test/Deno before/after. Deno 2.9.6 ordinary
PATH and Rust/Cargo 1.97.0, fixed DENO_DIR. Same strict child flags.
Preserve exact raw first failures and fresh followups.

Current focused/native/public actual modules, normal unfiltered
`make check`, standalone `make check-cited-paths`, current producer
pins and separate CDC replay all required. Return actual per-row
proposal and explicit exclusive source/index/build/raw ownership.
Keep exact current scope on routine fixes, preserve numbered
iterations, stop only on material unresolved design/evidence.
