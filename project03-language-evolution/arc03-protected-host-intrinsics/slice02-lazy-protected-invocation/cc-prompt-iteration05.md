# S02 iteration 05 — isolate the protected operation in affected modules

## Authority and intake

The Operator approved the HI-05 fallback only for actual private request plans
with a real normalized module-scope Reflect binding. Same Luna 6 High CC and
Sol 6.1 High CDC, standard Autonomous Mode. Continue through independent S02
and Arc03 closure if earned. No S04 production, K, release propagation,
push, publishing, new dependencies, or external runtime. This is the fifth
numbered S02 pass. Keep four prior passes and accepted bounded source
`801fcd83f7a79dd945ac109c55d636dd512e8b64` in history.

Read this assignment, [slice plan](slice-plan.md), [initial gates](cc-prompt.md),
[previous independent review](cdc-verification.md), and [feasibility inputs and
actual results](artifacts/evidence/hi05-feasibility/). Read the assigned
worktree's AGENTS.md; actual `codegen/{host_invocation,mod}.rs`,
`protected_host.rs` scope query, `packages/lang/host-invocation.js`,
`compiler.js` finalizer and package exports; current native/public proof tests
and normative `docs/host-contract.md`. Reuse prior readback for unchanged
context. Rust TD-03/05/06 and EH-04 guide the closed private support choice,
stable identity and existing LyknError boundary. JS/Deno ID-04/08 guide a
normal ESTree result with no new package export. Testing discipline requires
real output, selective effects, discriminating old/default/affected controls
and exact result receipts. Read back the source revision, operation/identity,
private fallback condition, runtime population and commit-body file before
dependent work.

Worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch
`codex/lazy-protected-invocation`. CDC owns planning. CC exclusively owns
source/index/build and CC evidence after handoff. Use normal Git with exact
named paths and fixed `-F /private/tmp/lykn-hi05-cdc.Goin1Htz/source-message.txt`.
Read it before commit and return the clean immutable Git object. No config
override, history rewrite, generic harness, or Python/Node/other research
script. Authored research logic is Lykn; ordinary Rust/JS product tests are
in scope.

## Exact production recipe

The fixed string is:

```text
data:text/javascript,export%20function%20apply(fn%2Creceiver%2Cargv)%7Breturn%20Reflect.apply(fn%2Creceiver%2Cargv)%7D
```

Decoded payload: `export function apply(fn,receiver,argv){return Reflect.apply(fn,receiver,argv)}`.
Use one fixed literal in each backend (canonical/embedded JS mirror exact),
no dependency, loader registration, sidecar, encoder or runtime lookup in
compiler code. Feasibility used a Lykn-authored equivalent with that precise
encoding. Strict Deno accepted the raw ESM, the live import changed from
`first` to `first!`, and saved-call output was `["receiver",7]`. Pinned
esbuild removed the helper entirely in the ordinary shaken case. Retained
observer read 0 at import and 1 on a deliberate lookup. Pinned esbuild
explicitly does not guarantee arbitrary top-level ESM direct eval after
bundling. Test the latter language behavior on unbundled output; the
ordinary optimizer fixtures use static source bindings without eval.

In native `codegen/host_invocation.rs`, retain exact-node validation and
name allocation, then distinguish local function from inline ESM support
using a closed private mode. Reuse the existing module-binding query,
renaming the private `invocation_unavailable_for_reflect` to reflect its
actual binding test and leaving S01 detection logic untouched. The empty
plan still bypasses binding selection. In `codegen/mod.rs` choose either
the exact existing local function bytes or one static named import
`import { apply as NAME } from "FIXED_URL";`. NAME is the same hygiene
allocator's chosen identifier. Insert after directives, leaving user
imports, binding spelling, export names and relative order untouched.
S01 policy validation still precedes output. The output remains a single
generated JS file. Do not touch writers, call evaluation, or public APIs.

In `packages/lang/host-invocation.js` and the embedded mirror, preserve
finalized/complete-consumption checks, name reservation and provisional
call rewriting. Replace the existing unavailable branch with a choice
between the unchanged helper FunctionDeclaration and an ImportDeclaration
whose ImportSpecifier is imported `apply`, local NAME, literal source
FIXED_URL. Use the existing directive-aware insertion point. Do not alter
`compiler.js`, package exports, source scope, or public signatures. One
import per requested module, including multiple requests. No fallback for
false positives such as nested-only Reflect, module-only globalThis, or
reexports that introduce no local binding.

Extend `docs/host-contract.md` in place. Explain the precise compiler-only
trigger, no-request/default output, preserved source binding/direct-eval
scope, single emitted file and lazy protected lookup. Distinguish an
inline ESM loader requirement (including potential CSP/data-import policy)
from an external runtime/package dependency. Record tested tool scope
and esbuild direct-eval bundle limitation without promising all loaders.
The existing Guide 00 and Lykn skill already link this normative source.

## Product tests and independent gates

Update only the existing focused test sections in `codegen/mod.rs` and
`test/forms/lazy-protected-invocation.test.js`, and add three small Lykn
fixtures under `test/fixtures/lazy-protected-invocation/`:
`fallback-provider.lisp`, `fallback-eval.lisp`, `fallback-state.lisp`.
Do not change existing fixtures/oracles. Reuse the test artifact materializer,
reader/anchor helper, normal TempDir ownership and optional evidence env.
Exact production/test/doc allowlist is those five paths plus
`codegen/host_invocation.rs`, `protected_host.rs`, the two
`host-invocation.js` mirrors and `docs/host-contract.md`
(codegen and protected-host Rust paths under `crates/lykn-lang/src/`).

Focused old-decline cases become positive fallback checks: actual normalized
module lexical binding, alias import, exported named/default/async
declaration, module-hoisted var. Retain true negative re-export/nested
function, ordinary globalThis-only, exact requested default and unchanged
no-request bytes, including on the affected input. Test multiple requests
yield one import, checked bad/duplicate/orphan/unfinalized remain rejected.
Assert exactly one fixed encoded specifier on affected output, zero in
empty/default; product JS test decodes and compares to the literal payload
above. Independent review compares native/public emitted URL bytes directly.
Check directives precede helper/import, user import order and aliases remain,
and ordinary source text cannot trigger the internal plan.

Fallback provider is the existing provider shape with a real module
`(const Reflect! "provider")` and `(const marker Reflect!)`. Keep the
directive, nested Reflect!/globalThis parameters, collision/free refs,
exports and existing proof runtime traces. Mark only the exact
`(saved receiver argv)` node. Emit in separate
`fallback-shaken`, `fallback-retained` and `fallback-live` subdirs for
each backend, reusing the existing ordinary entries/observer. The unbundled
`fallback-eval` imports `current` as real local `Reflect` plus `advance`
from `./state.js`, reads `(get Deno:args 0)`, logs direct `(eval code)`,
advances and logs direct `(eval code)` again. State uses kernel
`(let current "first")`, function body `(+= current "!")`, and real live
exports. Eval fixture defines a saved function returning its receiver id
and value, receiver object id "receiver" and argv array containing 7.
Log JSON from the exact planned `(saved receiver argv)` call. No inline
data URL authored in product fixtures. They receive it from the actual
compiler plan. Run emitted eval entry unbundled with argv `Reflect`.
Expected stdout is `first\nfirst!\n["receiver",7]\n`, exit0, empty stderr.

At exact candidate repeat native focused and normal configured public
focused from the original gates. For each backend run the original four
esbuild cases and the three fallback cases with identical pinned esbuild
argv shape. That's 14 actual esbuild outputs/metafiles. For both default
and fallback compare complete input/bundle code and metafiles. In shaken,
the helper, encoded dependency and Reflect lookup contribute no bytes,
while provider/entry retain their effects. A data-module input may remain
listed in the metafile; it must contribute no bytes to the shaken output.
In retained/live the bundled helper contains the only host lookup, with
no eager read or runtime output import. Execute the original ten strict
runs, eight equivalent fallback bundle/observer runs, and two fallback
unbundled eval runs, total 20. All stdout traces for shared cases are
unchanged. Observer conditions are isolated deliberately nonconforming
host probes, separate from ordinary runs. No arbitrary bundled-eval
guarantee and no extra trial families.

Use exact local esbuild and Deno pins/flags from the initial assignment,
fresh owned private roots, explicit absolute argv/cwd/env/raw status and
named configuration ancestor probes prospectively, and complete compiled
modules/metafiles/pins. Prepare stable groups before launch; separate source
product config from strict generated runtime. Keep unique actual raw output
paths per invocation. Freeze final semantic/formatted source before builds,
return actual test binary pins before use, then normal unfiltered
`/usr/bin/make check` and separately `/usr/bin/make check-cited-paths`.
No filtering, skipping, suppression or launch on stale metadata.
Return separate CC per-row proposals, full evidence paths, failed
attempts, exact clean source and ownership. CDC independently reviews and
repeats the complete necessary source/focused/optimizer/runtime/Make/cites
gates and reconciles composition with S01. Clear local issues may be fixed
under standard Autonomous Mode with preserved records. Report a real
unresolved contract/evidence gap before extending scope. No release or
next-arc implementation.
