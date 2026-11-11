# Increment A correction01 — CC implementation receipt

**Status: CC proposed-done, pending independent Sol review. S03 remains open.** This receipt records the corrective implementation and evidence; it does not accept LC-01, start increment B/C, or close the slice.

## Source pin and scope

- Worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Branch: `codex/qualified-adt-core`
- Parent: `5a8aedc5dcd6329da7b5f33a5397126a45891bac` (tree `3a05cbf5cc12b8e964e5de983b2f835e1f563c4e`)
- Corrected commit: `16dcd64f09946b6bd484a893dcefa16c01e1b431` (`fix: correct owned host reference boundaries`)
- Corrected tree: `6f36076d83c0f87b5e038be99604b8bc7eb5d531`; source worktree clean.
- Commit paths: the 12 files shown by `git show --stat` are exclusively the native emitter, direct Rust tests, CLI semantic-role/cold-delivery tests, canonical and embedded compiler, and three discriminating Lykn fixtures. No dependency, release, tag, or publication change.
- Commit body has adjacent trailers, verified from `%B`:
  `Co-authored-by: Codex <noreply@openai.com>`
  `Co-authored-by: Billo AI <ai-engineering@billo.systems>`

## Corrective changes

- **AF-01:** native array dispatch now produces owned `HostReference::ArrayIsArray` metadata. Module `Array` shadowing uses the inline module fallback; parameter-only shadowing captures real module `Array`. Separate array/string multi-clause fixtures assert array selection, retained string selection and the existing unknown-clause `TypeError`, in checked and stripped modes. A same-spelling source macro control confirms compiler-owned guard lowering does not call the macro.
- **AF-02:** M6's embedded synchronization census is the seven-module union: `binding.js`, `classifier.js`, `compiler.js`, `compiler-private-atoms.js`, `expander-core.js`, `protected-host.js`, and `surface-helpers.js`. Existing config/lock, cold-cache, copied standalone CLI and no-canonical-fallback controls remain. The materialized `lang/` ESM consumer now exercises owned typed guard and no-match errors with shadowed roots while retaining recursive ADT/private-macro cases. The known version-sentinel warm-cache limitation remains.
- **AF-03:** public native `emit_form` recursively rejects an unfinished owned reference nested in list/cons output with structured Codegen diagnostic `compiler-owned host reference requires whole-module emission; use emitter::emit`, anchored to the actual first reference span. Ordered-call wording is unchanged. Internal whole-unit raw production remains able to hand references to the module writer. Native product tests cover ordinary no-request fragment success, typed fragment rejection with exact source span, and whole-unit emit/JSON success on the same source. Rustdoc describes the fragment error.
- **AF-04:** public JS lowering retains full occurrence/name and requested-value census but resolves and mutates each marked atom identity once. One `SymbolFor` marker reused as two call heads emits one alias and two valid calls; the product test executes the ESM and verifies shared registry identity. Existing fresh-atom, no-request, source-lookalike, unfinished fragment, and Reflect invocation-anchor controls remain. Canonical and embedded `compiler.js` are synchronized. A post-normalization source-name collision control verifies alias suffixing.

### Native structure-test boundary census

The original `emitter::forms::tests` population is 202 tests. Exactly 44 tests whose purpose is to assert the internal producer's generated structure now import `emit_form_raw_checked as emit_form` locally inside their own function. Their kernel-shape guards and semantic structure assertions remain intact. This boundary is necessary because public `emit_form` now intentionally returns an error when a generated fragment still contains an owned host reference; those structure-only checks do not run module lowering. The migration does not globally shadow or alias the public API. The other 158 tests in the module continue to call public `emit_form`, preserving fragment-boundary and existing public behavior coverage.

The exact 44 internal-producer tests are:

`test_emit_bind_typed_non_literal_emits_check`, `test_emit_bind_typed_array_check`, `test_emit_type_with_fields`, `test_emit_fn`, `test_emit_func_single_clause`, `test_emit_func_multi_clause`, `test_func_returns_void`, `test_func_returns_typed`, `test_func_with_pre_condition`, `test_func_with_post_condition`, `test_func_with_post_and_if_body_uses_ternary`, `test_func_with_post_and_multi_body`, `test_func_returns_typed_multi_body`, `test_func_returns_typed_empty_body`, `test_func_multi_clause_different_arity`, `test_func_multi_clause_with_post`, `test_func_multi_clause_with_pre`, `test_func_multi_clause_empty_body`, `test_func_multi_clause_multi_body`, `test_func_multi_clause_post_empty_body`, `test_func_multi_clause_post_multi_body`, `test_match_obj_pattern_value`, `test_match_with_guard_multi_body_value`, `test_match_no_wildcard_statement`, `test_match_no_wildcard_value`, `test_match_constructor_wildcard_binding`, `test_fn_control_transfer_last_forms_are_not_wrapped`, `test_fn_typed_returns_last_expression`, `test_fn_typed_multi_body_returns_last`, `test_func_multi_clause_strip_assertions`, `test_func_multi_clause_any_types_single_condition`, `test_emit_func_single_clause_object_destructure`, `test_emit_fn_object_destructure`, `test_emit_func_multi_clause_mixed_destructure_dispatch`, `test_emit_func_single_clause_object_default`, `test_emit_fn_object_default`, `test_emit_func_nested_object_with_alias`, `test_emit_func_nested_in_array`, `test_emit_func_toplevel_default`, `test_emit_func_toplevel_rest`, `test_emit_func_typed_rest_for_of_check`, `test_emit_export_func`, `test_emit_genfunc_with_yields_instrumentation`, `test_emit_genfn_with_yields`.

## Verification

The final full gate was run on this narrowed source tree with explicit `DENO_DIR=/Users/oubiwann/Library/Caches/deno`, owned `npm_config_cache=/private/tmp/lykn-correction01-npm-cache`, owned `XDG_CACHE_HOME=/private/tmp/lykn-correction01-make-check-xdg`, owned `TMPDIR=/private/tmp/lykn-correction01-tmp`, and the two assigned evidence-directory variables. Full `make check` passed: Rust including 1,176 `lykn-lang` unit tests, 59 semantic-role integration tests, 7 emission-result tests, and all other listed integration suites; the complete product corpus reported `1510 passed (67 steps) | 0 failed`; documentation reported `482 passed | 0 failed`; build, lint, formatting and tests all passed. Semantic-role receipts comprise 1,770 files; M6/macro-dependency receipts comprise 98 files.

`make bundle-size-check` passed the 80 KiB gzip budget: 42,269 bytes gzip (41.3 KiB), baseline 27,630 bytes, delta +14,639 bytes (+14.3 KiB). The output includes existing package-condition warnings from `astring` in the owned Deno npm cache; no gate failed on these warnings.

After commit, `make check-cited-paths` passed at the corrected HEAD: 64 documents on `codex/qualified-adt-core`, with 601 historical citations accepted through `scripts/cited-paths-census.tsv`.

Focused evidence: `emitter::forms::tests` 202/202; `emission_results` 7/7; the corrected module/parameter shadowing runtime matrix (checked and stripped); same-spelling macro control; `host-reference-lowering.test.js` 7/7; `embedded-adt-pattern.test.js` 3/3; M6 cold-cache/copy delivery test 1/1. Full logs are `make-check-final.log`, `bundle-size-check.log`, and `check-cited-paths.log`; detailed process receipts are under `semantic-role-receipts/` and `macro-dependency-receipts/`.

## Preserved attempts and limits

- `make-check.log` preserves the first gate attempt, which stopped at formatting after `cargo fmt --all`.
- `make-check-retry.log` preserves the intermediate successful run before the migration was narrowed to the binding 44-test boundary. It is not the final proof; `make-check-final.log` is the authoritative full-gate receipt for commit `16dcd64f`.
- During focused correction, the first span expectation and two fixture drafts exposed wrong test expectations/syntax; these were corrected, and the focused final controls listed above passed. The earlier candidate's independent all-nine driver remains at its original pin and strength; this correction adds only the discriminating evidence specified here.
- No purity, foreign-tampering, nominal activation, support-graph removal, or browser eval-based inline-ESM execution claim is made. The browser `run`/`load` inline-import boundary remains assigned to S06. No remote CI, release, push, B/C, CDC acceptance, or slice closure was performed.

Raw gate logs and process receipts are retained under this directory. Root owns the planning index and Git; this receipt and the appended checkpoint are intentionally unstaged.
