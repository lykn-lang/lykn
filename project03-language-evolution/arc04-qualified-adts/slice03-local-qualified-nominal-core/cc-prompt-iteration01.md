# S03 A correction01 — dispatch, fragment and delivery boundaries

Implement AF-01–04 from the independent `cdc-verification.md` together.
Luna 6 High CC; separate Sol 6.1 High CDC; the operator's standard Autonomous
Mode continues. These have concrete bounded repairs; no new operator pause is
needed. S03 stays open, and no B/C or nominal activation is assigned here.

## Intake and ownership

Source is `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`,
`codex/qualified-adt-core`, clean baseline
5a8aedc5dcd6329da7b5f33a5397126a45891bac, tree
3a05cbf5cc12b8e964e5de983b2f835e1f563c4e. Sol returned source/build ownership
after its HOLD. Root owns the planning index/Git and parent plans. Release
remains separately accepted at 0829e892; do not edit, integrate or push it.
No subagents, dependency changes, release/tag/publication or remote CI.

No Python execution is permitted, and there is no parity exception. No
Python/Ruby/Fennel/handwritten JS research helpers, even temporary ones. New
research tooling/probes use Lykn. Normal product Rust/JS tests and compiler
implementation are authorized; shell/native CLI is for direct invocation and
filesystem lifecycle. Preserve failed attempts, issued prompts and original
candidate; do not amend commits or reconstruct missing raw logs.

Read AGENTS.md, the initial S03 prompt and plan/ledger, the independent findings
and A checkpoint. Reload applicable installed Rust, JS/Deno and testing guides
as needed. Root inspected the actual functions/callers below at 5a8aedc5;
recheck drift and send a concise contract readback before editing. Root's
local-owner-preparation.md contains unissued B design history; none of it is
implementation authority for this correction.

## Binding correction recipe

1. **AF-01: owned dispatch reference.** In native
   `crates/lykn-lang/src/emitter/forms.rs::build_dispatch_check`, the array
   branch (~3938) still emits raw `Array:isArray`. Replace that producer with
   `SExpr::host_reference_atom(HostReference::ArrayIsArray, ...)`, following the
   existing typed guard producer. Do not change dispatch semantics, overlap
   rules, array acceptance or stripped behavior. Its current unit test
   `test_dispatch_check_array` expects the obsolete source spelling; verify the
   owned identity instead, with actual runtime regressions below so this is
   not merely a representation assertion.
2. **AF-03: public native fragment guard.** `emitter::forms::emit_form`
   (~276–289) already rejects remaining ordered-call markers via `codegen_error`.
   Add recursive detection of unfinished owned host references, including nested
   lists/cons, and return the same structured `LyknError::Codegen` diagnostic
   channel before returning forms. Use the first real reference span. Binding
   wording: `compiler-owned host reference requires whole-module emission; use
   emitter::emit`. Existing ordered-call wording remains unchanged. Internal
   `emit_form_raw_checked` keeps producing refs for whole-unit emission and raw
   module writers. Complete emit/JSON/writer paths must continue working.
   Add public success/no-request and typed-fragment rejection controls, plus
   whole-unit success on the same meaningful source. Preserve internal typed
   lowering tests at their proper producer/module boundary; do not blindly
   redirect every test to a raw helper or discard guard assertions. Any affected
   AST unit test migration must retain its original semantic purpose and state
   which boundary it now exercises. Update Rustdoc/API handoff for the new
   fragment failure behavior.
3. **AF-04: shared value-reference mutation.** In
   `packages/lang/compiler.js::lowerHostReferences`, collect unique marked atom
   identities for mutation (a Set or equivalent) while retaining the complete
   occurrence/name census and requested-value set. Resolve/mutate/clear each
   marked atom once. One owned value may occur as the head of two calls; both
   occurrences must use the same generated alias. Do not change Reflect's
   separate single-consumption invocation-anchor protocol or silently allow
   duplicate Reflect requests. Add a normal internal product regression using
   one `hostReference('SymbolFor')` object in two actual calls: one support alias,
   correct generated calls and runtime registry identity. Keep fresh two-atom,
   no-request, source-lookalike, unfinished atom/callee/new fragment controls.
   Mirror the changed compiler.js into the actual embedded package.
4. **AF-02: actual delivered boundary.** In
   `crates/lykn-cli/tests/macro_dependencies.rs::m6_...`, expand package_names
   (~714) to the seven-module union: binding.js, classifier.js, compiler.js,
   compiler-private-atoms.js, expander-core.js, protected-host.js,
   surface-helpers.js. Preserve existing config/lock checks and cold-cache,
   standalone copied CLI/no canonical fallback assertions. Add an owned-host
   guard/error runtime test through the existing materialized `lang/` import
   map. `test/forms/embedded-adt-pattern.test.js` already imports that actual
   package via lang/; extending it is the recommended route. Keep its existing
   recursive ADT/private macro tests. Exercise typed number/array guards and
   no-match errors under module roots shadowed, and the multi-clause array
   dispatch regression, in an ESM-capable consumer. Relative imports of the
   canonical compiler do not establish this delivery proof. The existing
   version-sentinel warm-cache limitation remains explicit.

The fixed inline data module captures/exports all nine finite references;
only local aliases/import specifiers are sparse. This approved provisional
layout stays in A; C owns its support-graph purity/removal proof. Do not add
purity, namespace activation or foreign-tampering guarantees here.

## Discriminating proof

Keep separate Lykn product fixtures for a module binding named Array and an
enclosing function parameter named Array around a nested multi-clause function.
Combining both in one unit would prove only module fallback. Use array and
string clauses; assert actual array selection, retained string selection and
the existing TypeError unknown-clause outcome. Each fixture runs checked and
stripped. Expected selection is `array`, never the independently observed
`Array.isArray is not a function`. The module case should use inline import
fallback; parameter-only shadowing should capture a module alias of real Array.

Reuse the existing semantic_roles fixture/process/receipt functions and normal
CLI test infrastructure. Add a narrow checked/stripped invocation option/helper
where needed; do not build a new generic harness or weaken existing fixture
oracles. Extend or add the corresponding normal public product test. Include
normalization collision and same-spelling macro controls from the initial A
prompt that have not yet received discriminating evidence: generated alias
names must avoid source names after conversion, and owned guard calls must not
invoke source macros. Keep parameter and module distinctions in the report.

Run the difficult dispatch and public fragment/sharing controls first, then
the M6 actual embedded route. Scope-check all native/public generated guard,
dispatch and error producers again; distinguish production from test literals.
The independent all-nine public driver at the failed candidate already passed
27 runtime checks and three fragment checks; keep its original pin/strength.
New checks must establish the corrected candidate's required behavior.

After focused corrections pass, run required `make check` and
`make bundle-size-check` (80 KiB), commit the exact source candidate, then run
`make check-cited-paths` against that committed HEAD. Use BOTH explicit
`DENO_DIR=/Users/oubiwann/Library/Caches/deno` and an owned npm_config_cache;
use owned XDG/tmp for cold delivery. Do not repeat docs outside make check or
change user cache ownership. Preserve original gate failures and unrun checks;
do not call all gates passed before actual completion. No whole-file legacy JS
formatting or automatic snapshot acceptance.

## Commit and handoff

Expected source paths: emitter/forms.rs and necessary direct emitter tests;
semantic_roles.rs, the two new semantic-role fixtures; macro_dependencies.rs;
canonical/embedded compiler.js; host-reference-lowering.test.js and the
materialized embedded-host product test above. Necessary direct consumer/test
migrations for the fragment Result contract are in scope; enumerate their
actual names before staging. No unrelated cleanup. Commit exact named paths
with `git commit --only`. Put both co-author lines in ONE commit body with
adjacent actual newlines (no blank line between them):

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

Recheck the actual `%B` output; preserve 5a8aedc5's earlier spacing deviation.
Root owns planning Git. Append correction results to closing-report.md and
write useful correction receipts under artifacts/increment-a/correction01/;
leave original logs, CDC record, ledger and parent files unchanged. Report
exact source pin/tree, clean state, actual test populations, warnings/failures
and limits; return exclusive source/build ownership for separate Sol review.
No B/C begins from a CC proposed-done checkpoint.
