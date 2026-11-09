# CC assignment — S02 private lazy protected invocation

## Authority, intake and scope

Operator-authorized standard Autonomous Mode. Same Luna 6 High CC,
separate Sol 6.1 High CDC. Read this complete prompt, [slice plan](slice-plan.md),
[ledger](ledger.md), and [arc H01–H08](../arc-plan.md#useful-capability-and-v1-contract-seed).
Read task AGENTS.md and the applicable source host-contract and guide sections.
Task checkout is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
new `codex/lazy-protected-invocation` at exact accepted S01 `e7b44c1`.
CDC owns planning. CC owns task source/index/build/raw after explicit handoff.
Keep source and release S01 refs, K, S04 production, publish and push untouched.
Continue clear in-scope fixes with separate freezes, receipts and review.
No Python or migration exception, Node, alternate research scripts or dependencies.
Author research/validation helpers, if any, in Lykn; normal product tests and
compiler Rust/JS are in scope. Native CLI and direct filesystem actions are fine.

This assignment implements the separable path for eligible modules. A real
module-level `Reflect` binding has a private unavailable outcome. Renaming it
can change documented direct eval. Global alias fallback and broader runtime
trust are outside authority. Preserve ordinary compilation of those modules
with no request. HI-05 and complete S02/arc acceptance remain held.

Read actual Rust `codegen/{mod,format,emit,names}.rs` entry/writer/atom paths,
`protected_host.rs` module scope and var walker, kernel JSON boundary, and
current native codegen tests. Read actual JS `packages/lang/{compiler,protected-host,kernel-mark}.js`
whole-unit/compileExpr/marker paths and deno.json exports. Use the S04 I3
ReferencePlan/argument-list section to confirm ownership of effects. Apply
Rust guidelines TD-03/05/06 and EH-01/04 to typed private identity, borrowed
final nodes and checked errors. Apply JS/Deno ID-01/04/08 and testing guidance
to private module surface, exact object identity and separate real runtimes.
Read back source revision, requested paths, request/availability invariant,
tool pins and fixed commit-body location before editing.

## Binding interface and implementation recipe

A request applies one callable already obtained by the caller, its saved
receiver and a fully evaluated/materialized argument list, in that order.
Each operand is an already saved stable atom reference (undefined receiver
permitted). Request code neither reconstructs a receiver/member access nor
iterates user spreads. I3 will own prior evaluation and abrupt control.

Use a single lazily executed module helper such as
`function lyknHostReflectApply2(fn, receiver, argv) { return Reflect.apply(fn, receiver, argv); }`.
The compiled call is a reference to that helper and three operands. Allocate
the first deterministic `lyknHostReflectApply<N>` name absent from all
normalized compiler/expanded source binding and free-reference names, including
colon roots. No reserved public spelling, ambient runtime, import, sidecar,
eval, eager lookup, PURE annotation, or per-call receiver substitution.
Insert the definition after original leading directives. No request means
no helper, no output change and no source binding decision.

Native: add crate-private `codegen/host_invocation.rs`. Reuse the v1
`IntrinsicId::ReflectApply` catalog, widening visibility only to the crate
as required. Route existing `emit_module_js(forms)` through a private
`emit_module_with_invocations(forms, requests)` with an empty plan. A request
pairs typed ID and a borrowed exact final-tree expression node. Its list
contains exactly callable/receiver/argv atoms. No marker spelling and no
public SExpr or JsWriter signature/trait change. Store private per-emission
identity state in the writer, using addresses as opaque keys without unsafe
dereference. Intercept the matched expression in `emit_expr`, including
statement-position requests before head dispatch in `emit_statement`.
The writer consumes each anchor exactly once. Duplicate, malformed,
orphaned or missed anchors fail the whole private emission. Reserve names
before writing and return JS only after all checks and consumption.
Keep S01 validation on the input, ahead of the feature emission.

For native availability, use the actual kernel bind/var grammar. Reuse
`protected_host.rs` private pattern/module/var collection where appropriate
without altering S01 source policy. The feature query must also inspect direct
declarations in `export` and `async` wrappers (including named default function
or class declarations), and top-level-hoisted var through blocks/loops/catches.
Imports inspect local names; exports and re-exports by names do not introduce
bindings. Nested function and class scopes do not hoist to the module. A real
normalized module Reflect yields a checked private unavailable result before JS
is returned. Preserve existing public error type and no-request behavior.

JS: add `packages/lang/host-invocation.js` and exact embedded mirror. The
package manifest and existing exports are unchanged. Expose private internal
typed ID (opaque symbol) and whole-unit request adapter only at this internal
file path. Pass the actual existing `compile` function to the adapter, so no
new public compiler export is required. Use a private WeakMap keyed by the
exact request node during the synchronous call, with cleanup in finally.
Intercept in `compileExpr` only by identity. Build a normal ESTree CallExpression
and retain private identity of the provisional call in a WeakMap until the
whole-program finalizer. Before astring, collect actual generated normalized
Identifiers (including free identifiers), check direct module declaration/
import/export and nested module-hoisted var roles in ESTree, reserve helper
name, validate all request nodes are consumed exactly once and inject a normal
FunctionDeclaration after directives. Fail closed for unavailable/invalid
plans without returning partial JS. Existing public compileExpr calls without
a private request are unchanged, including macro-time emission. Keep canonical
`compiler.js` and new private module byte-equal with embedded files.
Native equivalent stages use the same role policy. No other source edits
unless concrete necessary route finding is reported to CDC.

## Concrete cases and verification

Use private native unit tests in the codegen module and a product Deno
test under `test/forms/` importing the unexported internal JS file.
An optional absolute `LYKN_INTRINSIC_EVIDENCE_DIR` may retain real artifacts
in separate native/public subdirs. Normal tests require no evidence env and
cannot silently skip behavioral assertions. Shared kernel fixtures under
`test/fixtures/lazy-protected-invocation/` are compiler test inputs, not
source-facing features. Mark the exact `(saved receiver argv)` call node
only in the private backend plan. The same unmarked shape is an ordinary
call. Preserve fixture revisions before build and emitted bytes before runtime.

Focused controls must verify exact stable byte output for an ordinary
no-request module; no false dispatch from textual request shapes; malformed,
duplicate and orphan/unconsumed requests fail; actual module-level lexical,
normalized, imported, exported/async and hoisted-var Reflect declines.
Nested Reflect/globalThis shadows remain eligible. Module-level globalThis
alone does not affect the bare Reflect route. Include a directive-bearing
requested provider, public exports `marker` and `invoke` unchanged,
an application object property `Reflect` unchanged, bound normalized
`lykn-host-reflect-apply0` and free `lyknHostReflectApply1` forcing a fresh
candidate. The latter evaluates via typeof to "undefined", so capture is
observable. Preserve S01 checks and distinguish name roles from text.

Freeze the following four esbuild inputs and exact expected results
before launch, in both native and public producer trees.

1. **Absent**. Ordinary generated entry logs `absent\n`; assert no helper,
   no protected lookup, no added import and byte identity to ordinary compile.
   The bundle and metafile confirm the selected real entry and no facility.
2. **Shaken**. Provider exports an intrinsic-using `invoke` and independent
   `marker`, with top-level `provider\n` log. Shaken entry imports only
   marker and logs `use:provider\n`. Unoptimized provider demonstrably has
   helper and call. Full bundle retains provider/entry effects but contains
   neither invocation nor helper/lookup. Verify actual attribution in
   metafile and exact `provider\nuse:provider\n` at runtime.
3. **Retained uncalled**. Provider is entry; invoke is preserved as an ESM
   export. Bundle contains call and helper and the lookup occurs only in
   helper body. Ordinary strict Deno stdout is `provider\n`. A separate
   Lykn-authored/compiled observer temporarily installs a getter on host
   Reflect.apply in its own process, dynamically imports retained bundle,
   logs count 0, then deliberately reads the property and logs count 1.
   Exact `provider\n0\n1\n`. This is a deliberately nonconforming
   observation condition and separate from normal runtime evidence.
4. **Live**. Entry calls invoke in live, throwing-getter and throwing-arg
   modes. Provider creates receiver with id "receiver" and Reflect property
   "property". A getter logs "get" and supplies original callable once or
   throws Error("getter"). Materialize an argument list with a native
   array spread of an iterator that logs "spread" and yields 7, then a
   later argument that logs "arg", throws Error("arg") in arg mode,
   otherwise replaces receiver.method and returns 8. The saved callable
   logs "call" and returns its receiver id and two inputs. Its own
   .call/.apply and replacement callable throw if touched. The helper
   uses the saved receiver and final argv after both arguments. Catch
   cases report actual Error.message without calling the request. Entry
   supplies local Reflect!/globalThis id objects "localReflect",
   "localGlobal" and collision value 3. Exact JSON+LF after provider line:
   `[["get","spread","arg","call"],["receiver",7,8],"localReflect","localGlobal",3,"undefined","property"]`
   then `[["get"],"getter"]`, then `[["get","spread","arg"],"arg"]`.
   Inspect all bundle code and entry/input attribution, not size only.

Compile cases through actual private backend hooks. Real test-mode export is
only ignored evidence, not a new production endpoint. Use existing reader,
kernel `function`, `lambda`, `dynamic-import`, `try/catch`, `get`, `object`,
`array`, and generator/iterator support. The above is a fixture recipe
with expected observations, not a previously executed snapshot.

Exact local esbuild command prefix is
`/Users/oubiwann/lab/lykn/lang/.worktrees/native-esbuild-controls/target/lykn/tools/esbuild-0.25.5/bin/esbuild`.
Version 0.25.5, SHA-256
`b26c07a69bc734c1661ee3180bc2a8b71ee860826a866393e94c519cda46fe1f`.
Adjacent source clean `ea453bf687c8e5cf3c5f11aae372c5ca33be0c98` and existing
[reproduced provenance](../../slice06-native-esbuild-controls/cdc-verification.md#independently-reproduced-evidence).
No acquisition or rebuild. Use `ENTRY --bundle --format=esm --platform=neutral
--target=es2022 --tree-shaking=true --log-level=warning --metafile=ABS --outfile=ABS`.
Eight selected bundle invocations, two backends by four cases. Preserve full
inputs/outputs/metafiles/statuses and strict actual Deno stdout/stderr. Run
every bundle and each retained observer with absolute Deno 2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`,
`run --no-config --cached-only --no-npm --no-remote --deny-net --no-prompt ABS`.
No user fixture mutation or writing to tool home.

Before each invocation preserve/read exact prospective argv/cwd/scoped
env, fresh owned TMPDIR/XDG/npm roots and exact named config ancestor checks,
tool/source pins, output directories and raw status paths. Fixed approved
DENO_DIR. Batch stable manifests without serial acknowledgments. No untested
substitution or follow-on execution after an actual unresolved dependency.
Apply ordinary formatting and Clippy without suppression. Freeze exact
semantic and format deltas before dependent tests. Run native focused and
configured public product tests, normal unfiltered `make check`, and separate
`make check-cited-paths`. Capture actual postbuild pins. Return exact clean
source/index/build/raw ownership, paths, observed case outcomes and per-row
proposed disposition. CDC independently reruns and inspects artifacts.

Use normal named-path Git with the fixed -F body
`/private/tmp/lykn-s02-cdc.gadeVma9/source-message.txt` and the required
contiguous Codex/Billo AI trailers. Report first frozen code, first actual
focused results and any consequential gap. No complete S02/arc claim while
HI-05 is open. No S04 implementation or release action.
