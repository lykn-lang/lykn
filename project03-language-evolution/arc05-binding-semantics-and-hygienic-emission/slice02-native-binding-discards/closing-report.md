# S02 CC closeout: native binding discards

## Disposition

CC proposes this slice done, pending independent Sol review and root's planning disposition. This is implementation evidence, not independent acceptance; all nine ND ledger rows remain open. The source/build handoff is ready.

The active contract is `slice-plan.md` v1.2, following the original `cc-prompt.md` and preserved refinements `cc-prompt-iteration01.md` and `cc-prompt-iteration02.md`. Refinement01 authorized exactly one additional source file for negative numeric alias-key spelling and Bool/Null static-key admission. Refinement02 corrected the frontend whitelist facts without broadening dispatch. The resulting source change is exactly ten paths; no JS mirror, M6 selection, dependencies, or unrelated grammar changed.

## Implementation and evidence by ND row

- **ND-01 — loop and declaration producers:** discard initialization lowers at each producer while preserving initializer effects and declaration roles. The numeric-for fixture exercises a discard initializer, a true condition and an immediate `break`; it establishes initializer/private-binding behavior and finite termination, not a new loop-counter implementation. For-in/of/await-of preserve iterator and generator timing. Nested array holes remain holes, and the raw nested for-of regression observes one `next` and one `return` on early exit.
- **ND-02 — callable and class producers:** raw admitted kernel declaration/function/function*/arrow routes, async and generator functions, and class constructor/method/getter/setter parameter slots lower independently. Surface typed lambda, Source class/class-expr and object-callable controls retain `_` as a value (99) and `_value` as a binding (7). Direct raw lambda/class writer controls retain literal `_`. `kernel:lambda`, `kernel:class`, and `kernel:class-expr` stay exact unknown-kernel-form negatives because the actual whitelist excludes them.
- **ND-03 — catch writer roles:** catch normalization runs after ordinary binder emission, preserving legacy catch grammar and selected-last-handler behavior. Catch-array defaults/rest lower declaration targets while leaving default RHS expressions untouched; nested object alias targets bind hygienically; object shorthand `_` emits a literal property pair; ordinary object-pair child1 is a binding value even when its property is named `alias`, `default`, or `rest`; computed keys, direct-return try paths, and finally remain intact. Runtime controls observe each default effect/getter once.
- **ND-04 — spread projection and hygiene:** top-level untyped kernel spread is included in parameter-name projection and default-path resolution. A named raw spread function with nested default callback and body call resolves and executes through its lexical dispatch. Finalized JSON round-trip of grouped aliases preserves generated bindings, output and getter count. Raw codegen literal behavior is independently executed; public raw API/schema and named slots remain unchanged.
- **ND-05 — grouped structural admission:** only writer-valid, structurally checked empty/all-discard forms are admitted. Invalid rest/default positions and non-discard targets remain rejected. Grouped negative numeric alias keys now use computed brackets and execute with getter count one; `-0` canonicalizes to `[0]`. Bool, Null, Keyword and String key controls execute; raw numeric codegen controls still emit literal `_` and return the supplied value.
- **ND-06 — clause diagnostics:** multi-clause simple default/rest forms produce the same intended diagnostic through classification and direct AST emission. CLI check and both compile modes reject them. The single-clause default control remains supported. No dispatch-arity semantics were added.
- **ND-07 — native CLI and raw API:** native `.lykn`/`.lyk` coverage exercises real CLI checked/strip and execution routes. The direct `codegen::emit_module_js` API retains literal-writer semantics. Both guides document native roles, the fixed-arity restriction, and the raw IR versus admitted Source lambda/class boundary.
- **ND-08 — validation:** final focused native suite 21/21, CLI suite 2/2, lang lib 1,205/1,205, legacy discard integration 23/23, legacy CLI variadic 2/2; formatting, fresh artifacts and workspace clippy all passed. The first `make check` attempt is preserved as exit 2: clippy flagged `.last()` on a double-ended iterator before tests/docs/M6 ran. The local correction to `.next_back()` preserves selection; affected checks were rerun, then the required full `make check` passed once after the correction. It reported 1,570 tests passed across 67 steps, docs 482 passed / 0 failed, with 15 documentation entries containing no Lykn blocks, and successful M6 embedded delivery with strict public suite 62 passed / 0 failed and 14/14 package comparisons. JSR e2e was skipped by its own handling because `jsr.io` was unreachable. Post-HEAD cited-path check passed (64 documents, 601 historical citations); gzip size gate passed at 47,747 bytes against 81,920, baseline 27,630, delta +20,117. The size run emitted repeated esbuild warnings about `astring` package condition ordering; it exited successfully and changed no dependencies.
- **ND-09 — disposition boundary:** implementation and gates are complete for CC. Sol review, planning ledger closure and any retrospective/bubble-up adoption remain with their respective owners. No S03 work, merge, push, release, publication or remote CI was performed.

## Commit and source boundary

Source commit `3617a3aecf69cd4f6a39cd9ebb68e09cdc5c15e9`, tree `cf3b823daa93a588597147121f8dd273637978ce`, is on `codex/qualified-adt-core`. It contains exactly:

1. `crates/lykn-lang/src/emitter/forms.rs`
2. `crates/lykn-lang/src/classifier/forms.rs`
3. `crates/lykn-lang/src/binding.rs`
4. `crates/lykn-lang/src/lexical_regions.rs`
5. `crates/lykn-lang/src/codegen/mod.rs`
6. `crates/lykn-lang/src/codegen/emit.rs`
7. `crates/lykn-lang/tests/remaining_discard_bindings.rs`
8. `crates/lykn-cli/tests/remaining_discard_bindings.rs`
9. `docs/guides/00-lykn-surface-forms.md`
10. `docs/guides/06-functions-closures.md`

The commit has contiguous `Codex` and `Billo AI` co-author trailers. The source worktree was clean after commit and post-HEAD gates. Root retains the planning worktree and all planning Git/index/ledger/status ownership.

## Durable artifacts and retained failures

`artifacts/cc/index.md` is the read-coverage, source-cited contract readback, correction history and gate index. The directory contains 562 files at closeout, including focused native/CLI source snapshots and stdout/stderr/exit triplets, lib/legacy/fresh-artifact/clippy logs, `make-check-final.*` (the failed pre-test attempt), `make-check-postfix.*` (successful corrected full gate), `post-head-cited-paths.*`, `post-head-bundle-size.*`, the M6 receipt subtree with embedded delivery/public strict output and 14 comparison records, and earlier red/retry snapshots. The negative-number red records a valid prelude and actual generated invalid property spelling before the writer correction. An earlier invalid-prelude fixture is retained but not treated as causal evidence. One early panic-path authoring failure did not preserve a complete pre-execution test source; that limit is recorded in the index rather than reconstructed as a contemporaneous snapshot.

## Bubble-up items for root's disposition

1. The actual `KERNEL_FORMS` whitelist, rather than namesake-sharing metadata, is the boundary for `kernel:<form>` support. Existing readiness assumptions about lambda/class/class-expr prefixes were inaccurate; this slice keeps them rejected and documents the raw IR/typed Source distinction.
2. Grouped-pattern admission must follow actual writer-valid JavaScript property syntax. Negative numeric keys required a narrow computed-bracket spelling in `codegen/emit.rs`; Bool/Null literals belong with other static keys. No numeric formatting or unrelated pattern grammar changed.
3. Multi-clause defaults/rest remain restricted pending signature-semantics candidate S09; this implementation adds only the agreed diagnostic.
4. The raw codegen API is a literal writer boundary, not evidence that every raw kernel prefix is admitted by Source. Preserve that distinction in future surface work.

These are proposed carry-forward observations, not planning ledger edits. Independent Sol review is pending.
