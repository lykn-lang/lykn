# Increment A checkpoint — protected host foundation

**S03 remains open.** This is the CC implementation checkpoint for increment A,
not a slice closeout or independent acceptance. The ledger remains unchanged;
LC-01 through LC-08 remain open pending their assigned work and review.

## Source handoff

- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Branch: `codex/qualified-adt-core`
- Baseline: `0829e892999890e8877dec5e35cd249753e1be5d`
- CC commit: `5a8aedc5dcd6329da7b5f33a5397126a45891bac` (`feat: add protected host contract v2 substrate`)
- Source worktree is clean. Commit contains only the named A source, docs, embedded payload and product-test paths.
- Increment A gate receipts and final browser/build logs: [`artifacts/increment-a/gate-results.md`](artifacts/increment-a/gate-results.md), [`make-check-final.log`](artifacts/increment-a/make-check-final.log), [`browser-size-final.log`](artifacts/increment-a/browser-size-final.log).

## Implemented boundary

The native host reference identity is private metadata on `SExpr` (`crates/lykn-lang/src/ast/sexpr.rs:55`, `:259`). The finite host support planner handles nine references and offers both ordinary kernel lowering and a raw writer lookup while retaining pointer anchored invocation requests (`crates/lykn-lang/src/codegen/host_references.rs`; composition test at `crates/lykn-lang/src/codegen/mod.rs:184`). Public references use a private WeakMap (`packages/lang/compiler-private-atoms.js`); public complete expansion and compile boundaries lower them (`packages/lang/expander-core.js:1690`, `:2309`; `packages/lang/compiler.js:25`, `:2357`). `compileExpr` and native fragment JSON reject unfinished references.

Requested intrinsics become collision-free top-level aliases after directives. A requested host root bound in the unit uses a feature-local import from the fixed inline data module, retaining the user binding. The inline ESM fallback executed in both a native CLI fixture and the browser compiler's ESM consumer test (`test/fixtures/semantic-roles/host-reference-shadowing.lykn`; `test/forms/browser-host-reference-compile.test.js:4`). The separate existing Reflect invocation protocol stays restricted to its validated Reflect.apply request; composition coverage is at `crates/lykn-lang/src/codegen/mod.rs:184`.

Native JSON APIs now expose the authorized typed result boundary: `sexpr_to_json(&SExpr) -> Result<Value, LyknError>` rejects a fragment reference, and `emit_module_json(&[SExpr]) -> Result<String, LyknError>` lowers complete units itself (`crates/lykn-lang/src/emitter/json.rs:20`, `:65`). CLI and test callers were migrated. Whole-unit e2e checks assert the exact support alias set and preserve the export/async node (`crates/lykn-lang/tests/e2e_tests.rs:119`).

Protected-host v2 protects roots `Reflect`, `Symbol`, `Object`, `Number`, `Array`, `Promise`, `TypeError`, `Error` and exact slots `Reflect.apply`, `Symbol.for`, `Object.freeze`, `Object.defineProperties`, `Number.isNaN`, `Array.isArray`. Existing scope, normalization, alias invalidation, unknown-proof and mutator behavior is retained (`crates/lykn-lang/src/protected_host.rs`; `packages/lang/protected-host.js:13`, `:525`). Diagnostics say `host-contract v2: write to protected slot <slot>`. The source contract is updated in `docs/host-contract.md`.

Six canonical public compiler files were synchronized into the crate-owned embedded package copy. The successful full gate includes the embedded cold-cache delivery test (`make-check-final.log`). No new dependency, nominal syntax activation or purity claim was introduced. The compiler's browser `run`/`load` still indirect-eval generated code and cannot execute the static inline ESM fallback; that compile/run boundary is for S06.

## API and downstream handoff

- Rust JSON callers must handle `Result` from both fragment and module serialization. This is the intentional 0.6 breaking signature change.
- Public `compile()` and complete `expand()`/`expandExpr()` return self-contained ordinary forms/source with support declarations as needed. `compileExpr()` rejects an unfinished compiler-private reference rather than emitting its marker.
- Generated JavaScript may gain support declarations or a named inline data-module import when the module shadows a referenced host root. With no compiler-owned request, output remains unchanged.
- Diagnostic expectations migrate from v1 to v2. Browser compile can return the ESM text; browser eval-based run/load do not gain inline-import support.
- Alias/import initializers are not pure and carry no purity annotation. LC-06 remains for later reviewed work, including their ADT initialization-graph implications.

## Review and ownership

The finite host substrate is ready for the separate Sol source review. This checkpoint does not disposition LC-01 as accepted and does not authorize increment B/C. Root owns the planning Git commit, parent plans, index and subsequent acceptance/CDC work. CC owns only source commit `5a8aedc5` and the write-only A checkpoint/receipt paths above.

## Correction01 — owned host-reference boundaries

**S03 remains open; this is a CC correction checkpoint pending independent Sol review.** The source correction is committed at `16dcd64f09946b6bd484a893dcefa16c01e1b431` (tree `6f36076d83c0f87b5e038be99604b8bc7eb5d531`) on `codex/qualified-adt-core`; the source worktree is clean. AF-01 through AF-04 correct owned array dispatch production, public native fragment rejection, shared marked-value mutation, and the actual embedded package delivery proof. The module-binding and enclosing-parameter Array-shadow cases remain separate and run checked/stripped; controls also cover same-spelling macro invocation, post-normalization alias collision, fragment/no-request/whole-unit boundaries, and shared `SymbolFor` identity. Details and exact test census are in [`artifacts/increment-a/correction01/results.md`](artifacts/increment-a/correction01/results.md).

Exactly 44 of the 202 native `emitter::forms::tests` now invoke the internal raw checked producer locally because they assert generated structure before whole-module owned-reference lowering. All 44 retain their kernel-shape and semantic assertions. The other 158 continue to exercise public `emit_form`; there is no module-wide alias. The full corrected-tree `make check` passed (including 1,176 native language unit tests, corpus 1,510/0, docs 482/0); `make bundle-size-check` passed at 42,269 gzip bytes versus 80 KiB; post-commit `make check-cited-paths` passed at the corrected HEAD (64 documents, 601 historical citations accepted). The final gate environment, warnings, attempt history and receipt locations are recorded in the correction results.

This correction does not accept LC-01, close S03, authorize increment B/C, make purity or nominal-runtime claims, or resolve the later browser eval-based inline ESM boundary. Root owns planning Git/index and subsequent acceptance work; source/build ownership is returned for independent review. The earlier `gate-results.md` modification is untouched.
