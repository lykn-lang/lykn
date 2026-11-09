# S04 iteration 01 — implement I1 conditional branch regions

## Authority and intake

The Operator authorized direct S04 after independently validated Arc03
release integration. Standard Autonomous Mode, Luna 6 High CC and Sol 6.1
High CDC. This assignment is the first bounded production increment.
The original `cc-prompt.md` was design-only and stays intact.
Source checkout `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
`codex/completion-value-flow`, clean baseline
`d73601a57fcf9294389eb5283e173ec0eca40091` tree
`86e05ce1e2f9c23267bcc93faa9bd458af1c6cdf`. CDC owns planning. Wait for
explicit source/index/build ownership after the contract readback.

Read this complete assignment, [current slice plan](slice-plan.md),
[ledger](ledger.md), the I1 and phase sections of
[completion design](artifacts/incremental-completion-design.md), and task
AGENTS.md. Read actual native `resolver.rs` ScopePlan/resolve_form/
shadow_form, `expander/pass2.rs` expand_children_scoped, `semantic_roles.rs`
if roles, `emitter/forms.rs` emit_expr branch and codegen emit_if/
emit_stmt_or_block. Read actual public `expander.js` scopePlan,
expandChildrenPlan, fixed-point/marked-kernel paths and `compiler.js` if
handler/toStatement. Inspect both existing semantic-roles integration test
bodies and relevant Guide 00/06 and source skill conditional references.
Use installed Rust TD-05/06 to keep a private closed region role with
exhaustive consumers, and JS/Deno ID-04/08 to keep public expansion shape
and existing exports. Testing discipline applies to frozen baseline,
exact output and live product paths. Installed guide root `/Users/oubiwann/Library/Application Support/ChatGPT-Profiles/personal/codex-home/skills`.
Read back inspected symbols, conditions/arm behavior, exact source/test
scope and fixed commit bodies before dependent work.

## Production contract and smallest source recipe

A genuine statement `if` has a test and separate consequent/alternate
regions. The test and each arm see the same incoming lexical scope.
Declarations inside one arm are not sibling declarations of any other
arm. A grouped bind still exposes earlier local names to later initializers
within that same arm. Each statement arm emits a JavaScript block without
adding a function. This preserves direct source return, break and continue
targets, and the outer else belongs to its source if. Existing expression
if/ternary/IIFE and no-else diagnostics keep their current routes.
An intentional macro-generated function remains a real boundary in the
tested path. I1's actual private conditional-region role is used by
resolution and expansion now. General wrapper provenance/target IDs,
transparent consumed lowering, ordered references and checked exits belong
to later executable readiness, with CV03–06 open. Add no unused IR.

Native `resolver.rs`: add a private `ScopePlan::Conditional` or equivalent
closed role. Pass actual lexical scope to `scope_plan` or an equivalent
single common gate. Genuine resolution-aware `if` and the explicit
`kernel:if` accepted adapter use this role. An already bound head or a
lexically bound ordinary head stays a call. This fixes exactly the
conditional role; do not rewrite other ScopePlan dispatch. Resolve fixed
children against the same incoming scope independently, using the
existing child recursion. In `shadow_form`, walk each operand as an
independent one-child sequence so declaration shadows inside an arm are
still reported, but no name is added for the next operand. In
`expander/pass2.rs`, expand each fixed child using the same incoming
scope and its own recursion (no sibling hoist). Respect current expansion
elision/error behavior; no new macro policy. Preserve explicit kernel
escape semantics and source spans/tags.

Native `codegen/emit.rs`: use actual `emit_block_body` for each
`emit_if` arm. For a genuine explicit kernel `block`, emit its body
exactly once. Otherwise use a one-statement body via
`std::slice::from_ref`. A bound `block` head remains an ordinary call in
the wrapper. Update the two exact native inline-if printer expectations to
braced text (one existing explicit-block test still checks no double
wrapping). Existing native `emit_expr` lowering already wraps multiple
surface statements into one `block`, and semantic_roles gives each if
arm one inherited child. Preserve those adapters and the Value/Tail route.
No public API, error model, declaration typing or general validator edits.

Public `packages/lang/expander.js`: add the corresponding fixed conditional
case in `scopePlan`/`expandChildrenPlan`. The actual gate in
`expandExprInner` already routes lexically bound calls before this case.
Use real `if` as a fixed list in default and marked-kernel routes, including
the stripped `kernel:if` path. Preserve head and condition/then/else
positions. Expand each operand under the same incoming env. For an arm
whose expansion is an array of statements, preserve it in one compiler-
marked kernel `(block ...)` node, using existing `sym`/markKernel.
A single expansion retains its node, with current null/elision behavior.
A multi-node condition is invalid because condition has one consumed value;
report an explicit existing-style expansion error before emission rather
than flattening or treating it as an arm. No change to ordinary bound call
or public API/returned representation beyond genuine group-to-block.
In `packages/lang/compiler.js` statement `if`, use a small private helper:
compile arm in Statement, retain existing BlockStatement, otherwise
wrap `toStatement` in a BlockStatement. Keep expression path unchanged.
Keep both canonical JS files byte-equal with their embedded mirrors.

Update Guide 00's statement-if paragraph in place to teach arm scope,
sequential grouped bindings and direct abrupt targets through branch blocks.
Check Guide 06/source skill references and update only if a current
contradiction actually needs the narrow change. No value-transport claim.

## Frozen behavioral proof

Add three shared fixtures in the existing `test/fixtures/semantic-roles/`.
Use existing native and public harnesses in
`crates/lykn-cli/tests/semantic_roles.rs` and
`test/forms/semantic-roles.test.js`. Native positive fixtures should have
separate test functions so a baseline failure does not hide another case.
Preserve existing fixtures/oracles. Continue actual pre-spawn and raw
postprocess capture, strict subprocess flags and exact known output. Record
absent optional DTS only when actually inspected by native harness.

1. `if-declaration.lykn`, exact historical source plus newline:
   `(if true (bind following-statement 99))`. Current default strict check
   and compile are predicted successful, with invalid unbraced declaration.
   Final runtime exits 0 with empty stdout/stderr. Inspect final block
   containing the local const in both outputs.
2. `if-arm-scope.lykn` (ordinary source, local macro exercises native pass2):
   ```lykn
   (macro pick (x) `(+ ,x 10))
   (bind trace (array))
   (if true
     (bind pick (fn (:number n) (+ n 100)) saved (trace:push (pick 1)))
     (trace:push (pick 2)))
   (if false
     (bind pick (fn (:number n) (+ n 200)) saved (trace:push (pick 3)))
     (trace:push (pick 4)))
   (trace:push (pick 5))
   (console:log (JSON:stringify trace))
   ```
   Exact final `[101,14,15]\n`. Local call in the same group returns
   101, the second alternate and following macro calls expand as additions.
   Verify one block per arm, both group declarations in its block, and
   true alternate/following expansion code. Old native scope leak and
   public slot flattening are source-derived predictions; record actual
   compile/emission/run separately, without inventing the old stderr.
3. `if-direct-transfers.lykn`:
   ```lykn
   (macro make-pick () `(kernel:function select (flag)
     (if flag (return 7))
     (return 9)))
   (make-pick)
   (bind match (fn (:number n) n))
   (bind trace (array))
   (for (let i 0) (< i 4) (++ i)
     (if (= i 1) (continue))
     (if (= i 3) (break))
     (trace:push i))
   (if true (if false (trace:push 900)) (trace:push 901))
   (console:log (JSON:stringify (array (select true) (select false) trace
     (match (if true 4 5)))))
   ```
   Exact final `[7,9,[0,2],4]\n`. This tests the intentionally
   macro-generated function boundary, direct loop target behavior,
   dangling-else ownership and actual legal bound call/value if. A source
   binder named `if` is reserved and must not be used as a legal runtime
   case. A private Rust synthetic tagged head check may prove ScopePlan
   bypass without executing invalid source. Add a precise resolver unit
   test with a direct conditional arm declaring a name and alternate/
   following same-spelling calls, plus genuine `kernel:if` structural
   and synthetic bound-ordinary checks in existing resolver tests.
   Preserve existing DD-50 consumed if diagnostics and ternary tests.

## Execution, ownership and exact paths

Allowed product paths: named native resolver, pass2 and codegen files, their
specified tests, the two public modules and their embedded mirrors, the
existing native/public integration test files, three fixtures and bounded
Guide 00 clarification. Guide 06/source skill only for a confirmed linked
contradiction with CDC readback. No source/AST API migration, new tool,
dependency, unrelated work, release mutation or I2–I4 implementation.
Research/evidence authoring uses Lykn; native CLI/direct filesystem and
normal product Rust/JS tests are allowed. No Python/Node/other script
substitutes, global install or network expansion.

Freeze fixture/test bytes before old baseline on exact d736 task source.
Use normal exact-path commits and supplied messages
`/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-test-message.txt` and `/private/tmp/lykn-d736-release-cdc.Gdv7dxje/i1-source-message.txt`.
Stage only named new paths before `git commit --only -F`. Keep that
actual test-only freeze, status, baseline source and any failures. No
normal Make claim on intentionally red fixtures. Run focused actual
native/public baseline on d736 code before implementation, inspecting
complete generated JS and exits. For current tests, run repository
formatter/checks, freeze source and return to CDC for source review
before dependent gates. Then same native/public and scoped private tests,
full normal unfiltered Make, and standalone committed citations. CDC
independently replays and reconciles exact source plus actual generated/
runtime artifacts. No next increment started until accepted I1.

Pin Deno 2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`,
ordinary PATH `/opt/homebrew/bin/deno`, and Rust/Cargo 1.97.0 in the
task cwd. Use genuinely fresh configfree `/private/tmp` TMPDIR/XDG/npm
roots with fixed approved DENO_DIR, no LYKN or Cargo global overrides,
and exact named ancestor probes. Preserve unique actual prelaunch
cwd/argv/env and raw/status paths, then complete generated JS and actual
process output before assertions. Build/no-run and pin actual compiler/
test paths before direct use. Existing strict runtime child flags are
unchanged. Normal Make may rebuild and requires new producer pins before
any dependent artifact use. Prepare grouped receipts; no extra serial
approval per command. Return row-by-row CC proposal, earlier raw attempts,
clean source and exclusive ownership to CDC. Fix clear in-scope issues
with preserved observations and named bounded refinements. Pause affected
work only on a material unresolved design/evidence choice.
