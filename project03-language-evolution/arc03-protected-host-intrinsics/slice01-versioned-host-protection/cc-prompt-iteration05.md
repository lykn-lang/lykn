# Arc03 S01 continuation — enforce protected host intrinsics v1

The Operator now authorizes S01 production enforcement and typed dist
diagnostics, then independent validation. Luna6 High CC implements.
Sol6.1 High CDC reviews and reproduces. Autonomous Mode, with a stop on
the first unexpected substantive failure or real evidence gap.
This is the original planned implementation following the accepted
baseline, not a source refinement. The recorded refinement count is
03 of 5. HC-01 through HC-06 are all open.

Work only in the existing task worktree
`.worktrees/contract-predicate-lowering`, branch
`codex/protected-host-contract` at clean
`5a2e569852fa88181498c18d28cdfb26f70e2dae`, tree
`7a9f29b2a312e4b3d1a20bee3cd14fdadddb4a79`.
Keep accepted prerequisite refs and release `62e9531e` unchanged.
No integration, push, publication, remote CI, new dependency, S02, S04,
K, or next-slice work.

## Intake and ownership

Required-full: read this assignment, the current [plan](slice-plan.md)
and [ledger](ledger.md), the source/plan AGENTS files, the
[oracle continuation](cc-prompt-iteration02.md) and
[prospective hold](cc-prompt-iteration04.md).
Required-sections: read the [arc plan](../arc-plan.md) v1 contract,
two deliveries and source/validation constraints, the original
[implementation spine](cc-prompt.md#exact-source-scope--implementation-spine),
and the [accepted baseline](cdc-verification.md#original-pre-policy-baseline-independently-reproduced).
This continuation governs the named route changes. Older stop and
implementation authority sections are history.
The baseline was already reproduced independently. Preserve it and do
not repeat it before production.

Refresh the domain and source readback named in the original prompt.
Read the complete relevant current function bodies for
`binding::bindings_introduced`, `binding_names_in_pattern`,
`BindingKind`, resolver `ScopePlan` (its dispatch-sequential scope is
reference, not the TDZ policy), the native whole-unit classifier/emitter/
codegen entries, native source assignment and kernel target emission,
`dist.rs` compile phase, and both actual host tests. On JS, read
`binding.js`, `compiler.js` `formHead`, `toJsIdentifier`, `compileExpr`,
`toStatement`, `compile`, and `expander.js` `compileMacroBody` and its
definition caller. Refresh the source `skills/lykn/SKILL.md` and
`docs/guides/00-lykn-surface-forms.md` locations. Recover truncated
required bodies. Rust TD-03/05/06 and EH-01/04 govern private identities and
typed failures. Deno ID-01/04/08/12 and testing's Quality Floor govern
separate exact asserted cases and genuine artifact/runtime evidence.

Return actual read extents and a source-cited contract readback,
including macro-time vs runtime entry, normalized lexical roots, typed
dist error and exact validation sequence. Read back the full provided
[commit message](artifacts/commit-messages/v1-implementation.txt).
Wait for exclusive source/index/build/raw ownership before mutation.
CDC owns planning prose/index. CC retains only implementation and raw
receipts in ignored `target/arc03-s01`, then returns clean ownership.

## Authorized source paths

Original production paths from the original prompt:

- `crates/lykn-lang/src/lib.rs`, `crates/lykn-lang/src/protected_host.rs`
- `crates/lykn-lang/src/classifier/mod.rs`, `crates/lykn-lang/src/emitter/mod.rs`,
  `crates/lykn-lang/src/codegen/mod.rs`
- `crates/lykn-lang/src/emitter/forms.rs` (fragment precondition doc comment only)
- `packages/lang/protected-host.js`, `packages/lang/compiler.js`, and their
  exact mirrors in `crates/lykn-lang/embedded/packages/lang/`
- `docs/host-contract.md`, narrow references in
  `docs/guides/00-lykn-surface-forms.md` and `skills/lykn/SKILL.md`

Four narrow route necessities are explicit in this continuation:

- `crates/lykn-cli/src/dist.rs`: typed classifier adapter only.
- `crates/lykn-cli/tests/protected_host.rs`: one fallback literal, changing
  the hard-coded Homebrew path to `"deno".into()` like `semantic_roles.rs`.
  Keep the explicit `LYKN_TEST_DENO` override. Unfiltered Make runs this
  target on Linux CI with Deno on PATH. The pinned baseline used the
  override. Every source, predicate, receipt and test remains exact.
- `packages/lang/expander.js` and its exact embedded mirror: only the
  imports and `compileMacroBody` wrapper described below.
- `test/expander/macro-basic.test.js`: one compile-only dormant-macro
  regression, retaining the nine accepted tests.

`test/forms/protected-host.test.js` remains byte-identical to the
composite. Do not edit the frozen tests to fit implementation or add
runtime fixture populations.

## Implementation

Behavior, routes, error effects, exclusions and tests are binding.
Private helper names and internal storage are local discretion.
Use the same scope/target walker for alias detection and diagnostic
collection, with separate per-unit state. This keeps their proofs
consistent and output in source traversal order. No global state.

1. Implement a private Rust `IntrinsicId::ReflectApply` catalog, version 1,
   `InputDialect::{Surface, Kernel}` and the private
   `validate_program(&[SExpr], InputDialect) -> Vec<Diagnostic>` boundary.
   Protect the real global binding `Reflect` and its exact `apply` slot.
   Match exact normalized member paths, with source identifier segments
   through `to_js_identifier` and literal computed string keys unchanged.
   Dynamic computed keys and arbitrary aliases are unknown. Track
   `GlobalKnown(path)`, `Local` and `Unknown`. A bare unresolved tag on
   a colon atom is insufficient, and unknown must never become global.
2. Precollect lexical names for each actual scope to respect TDZ. Reuse
   binder grammar for declaration/pattern names and
   `as_form_head` / `formHead` for real dispatch. Do not treat the raw
   binder scan's class-wide params or branch patterns as enclosing names.
   Treat function names, imports, nested lexical blocks, function params
   and defaults/body, loop header/iterable/body, switch case bodies,
   catch and branch patterns at their actual scope boundaries. Hoist
   kernel `var` to the owning function/module without crossing another
   function, separately from lexical collection. Check executable values,
   defaults, pre/post and deferred bodies in their owning scopes. Skip
   quoted data and structural metadata/name slots. A label, member,
   property or imported external name is not a local value binder.
   Do not change resolver or original compiler semantics to implement proof.
3. Source writes include real `set!`, `set-symbol!`, class `assign`,
   update/compound assignment and explicit `kernel:<write>`. Surface
   `=` is equality. Kernel `=` is assignment. An explicit prefix
   changes the operation's dialect, not all unprefixed child forms.
   Reuse actual emitted atom/member/`get` and assignment-pattern shapes.
   Check relevant destructuring leaves, and inspect executable key/default/
   RHS expressions independently as values. A write to a property below
   `Reflect.apply` is not a write to the protected slot itself. Preserve
   ordinary calls, reads and unrelated application object mutations.
4. Use the same normalized lexical proof for a whole-unit pass detecting
   identifiable writes to real `globalThis` or `globalThis.globalThis`,
   including nested/conditional updates and destructuring. These writes
   are legal and invalidate alias-based proofs throughout that unit.
   Lexical shadow writes do not invalidate. Bare real Reflect checks
   remain in force. No flow-sensitive or universal alias claim.
5. Native `classify_with_options` preserves existing classification
   error priority. When otherwise successful, validate the original
   entire post-macro input before assertion stripping. Use Surface
   unless `opts.kernel_only`. Check thereby gets only this classifier
   policy. `emitter::emit` validates its finished kernel vector before
   success, including the path used by `emit_json`. Raw
   `codegen::emit_module_js` validates its entire kernel before output.
   Return the actual `Diagnostic` as Classify or Codegen at its
   corresponding boundary. Do not check recursive fragments and do not
   change S02 Result/first-fatal behavior. Prestripped IR cannot prove
   unseen source.
6. Emit exact native Error severity, no suggestion, message
   `host-contract v1: write to protected slot <slot>`. Use the original
   parsed write target span (the receiver for Source `set-symbol!`) or
   actual unknown span for synthesized W8. Preserve the test's exact
   check/compile rendering and artifact effects. At dist's actual
   `classify_with_options` error arm, consume its first Diagnostic into
   existing `DistError::Language { path: path.clone(), source:
   LyknError::Classify(diagnostic) }`. Err is nonempty by that API's
   collection/validation invariant. No policy-message substring branch.
   Keep reader, expander, analysis, output-write and incremental
   `needs_compile` routes unchanged. This intentionally exposes the
   first typed classifier diagnostic rather than prior joined I/O text.
7. In pure internal JS `protected-host.js`, enforce the equivalent
   whole expanded/kernel program proof through `compile(exprs)` before
   generation. Reuse `binding.js`, pass `toJsIdentifier` and
   `formHead` from compiler to avoid an import cycle. Throw ordinary
   Error with the same version and slot. No validation in recursive
   `compileExpr`. In `compileMacroBody`, replace the sole
   `compile([fnForm])` use with existing `compileExpr(fnForm)` and
   `generate` from the already declared `astring` dependency. Generate
   the same `Program` with `sourceType: 'module'` and one
   `ExpressionStatement` for the synthetic lambda `FunctionExpression`,
   indent two spaces, and keep the existing trim/return wrapper. This
   exactly matches old `toStatement` for this synthetic lambda while
   keeping compiler extension bodies outside runtime policy. No new
   exported bypass, API parameter, dependency or runtime payload.
   Match all three affected canonical/embedded JS pairs byte-for-byte.
8. Add the already planned inline native module controls from the original
   prompt, with real binder/emitter grammar. Test normalized import and
   destructuring shadow, TDZ, loop/catch/method isolation, data and
   property/label namespaces, Source equality vs Kernel write, exact
   original target span, alias invalidation and bare-Reflect preservation.
   Include falsifiers that distinguish genuine shadow from another
   member/branch's shadow. These are private compile/validation controls,
   never host-mutating runtime trials. Representative exact inputs to
   private validation after `reader::read`:

   - Source `(= Reflect:apply 0)` has no diagnostic. The same form in
     Kernel has one Reflect.apply diagnostic at its first target span.
   - Source `(import "m" ((alias orig Reflect!))) (++ Reflect:apply)`
     and `(bind (array Reflect) xs) (++ Reflect:apply)` have none.
   - Kernel `(block (++ Reflect) (let Reflect 0)) (++ Reflect)` has
     exactly one diagnostic, at the outer update.
   - Kernel `(class C () (one (Reflect) (++ Reflect)) (two () (++ Reflect)))`
     has exactly one diagnostic, in `two`.
   - Kernel `(for-of Reflect xs (++ Reflect)) (++ Reflect)` and
     `(try 0 (catch Reflect (++ Reflect))) (++ Reflect)` each report
     only the outer update. Kernel `(label Reflect (++ Reflect))`
     reports the update. Kernel `(quote (++ Reflect))` is inert data.
   - Kernel `(= globalThis:Reflect:apply 0) (function f () (++ globalThis)) (++ Reflect)`
     reports only the final bare Reflect. The same alias write followed
     by `(function f (globalThis) (++ globalThis))` reports the alias
     write. Include the real destructuring assignment target case
     `(= (array globalThis) xs)` as an invalidator as well.

   Use separately parsed target spans as expectations. Append one independent dormant
   regression to `macro-basic.test.js`, using the existing canonical
   publicLykn and reset aliases: compile
   `(macro dormant-host-write () (++ Reflect)) 0` and assert trimmed
   output `0;`. Reset canonical state before and after. The macro is
   registered but never invoked, and its body is never executed. The
   existing W8 host test still requires rejection of the emitted runtime
   program. No old baseline rerun or new runtime family.
9. Ship one normative `docs/host-contract.md` with scope, exact slots,
   version, known alias/foreign/macro-time limits, pre-strip source
   diagnostics, whole-unit vs fragment and conditional dist recompilation.
   State typed first-classification diagnostic and unchanged output on
   failure for the failing file. Link from the source guide and LLM
   skill. Invalid examples inline/plaintext, not executable fences.
   Keep exact source/API/book/user-impact evidence for S07/S08 and
   human acceptance. No separate book or S02 facility edits.

## Freeze, verification and return

Freeze immutable source before any validation. Use normal named-path
`git add --` and `git commit --only -F <absolute supplied file> -- <paths>`.
Read raw commit body afterward and preserve the whole candidate/diff/status.
Wait for CDC static release. Any necessary native leaf formatting is
mechanical only, with prior candidate preserved and separate release
before launch. Never quietly fix an unexpected result.

Each top-level command (including format, build, direct test, artifact
refresh, compiler/runtime and citation) is held until CDC reads the
actual prospective manifest and exact named-path raw evidence and
releases that invocation. Follow iteration04. Persist executable/argv,
cwd, source/tree, fresh TMPDIR/XDG_CACHE_HOME/npm cache, inherited
overrides, fixed DENO_DIR, tool pins, output/status/observation roots,
and exact named config check argv/raw/status before launch. Check the
actual fixture root and fixed ancestors. Keep an intended checkout
project.json separate. No shell chains masking tool status. Actual
CC readback and named CDC release required before each invocation.

After static release, build the protected_host target and relevant
lykn-lang lib tests `--no-run --offline --locked` and pin actual
after-last-build test/debug CLI/Deno. Run the direct protected_host
test `--nocapture --test-threads=1` with pinned Deno and evidence env,
and the selected direct private policy tests. The unchanged native target
must pass all three parents, 15 predicate verdicts, 29 exact rejections
and actual file effects, typed dist with intact JS/DTS and legal4 strict
execution. No protected-write artifact runs. After normal fresh-artifacts
with the source-root project config, run the unchanged public target
`/opt/homebrew/bin/deno test --config project.json -A test/forms/protected-host.test.js`
with both original LYKN environment values. Require 1 parent and 13
steps, nine exact policy failures and legal4 exact before/after runtime
receipts. Run the `macro-basic.test.js` target with the same configured
Deno test command and expect all ten tests. Read generated legal modules.
Use actual fresh XDG macro materialization to verify all three affected
JS mirrors against source. Preserve exact generated code and raw results.

Run normal unfiltered `make check` and separate `make check-cited-paths`.
Do not pass a Deno override to normal Make to mask the tested fallback.
Record effective PATH Deno and fresh actual postbuild producer hashes.
Deno is exactly `/opt/homebrew/bin/deno` 2.9.6 SHA-256
`2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`
with `DENO_DIR=/Users/oubiwann/Library/Caches/deno`.
Return exact source/tree/clean refs, each HC row proposed disposition,
full original raw/status/manifests/artifacts and exclusive ownership.
CDC then repeats the focused, runtime, mirror, full normal and citation
gates independently from separate fresh roots before acceptance.

All authored research, helper, command-construction and validation
logic uses Lykn. Product Rust/JS and their assigned tests are allowed.
No Python execution or exception, Node or other script substitute,
new helper framework, new dependency, hidden probes or gate bypass.
