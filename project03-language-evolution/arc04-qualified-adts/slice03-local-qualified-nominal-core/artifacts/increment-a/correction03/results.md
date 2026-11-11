# Increment A correction03 — implicit multi-clause returns

**Status: CC proposed-done, pending independent Sol review. S03 remains open.** This checkpoint implements the correction02 span/materialized-oracle work and the newly authorized public compiler fix. It accepts no LC row and authorizes no B/C work.

## Source pin and six-path scope

- Worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`
- Branch: `codex/qualified-adt-core`
- Parent: `16dcd64f09946b6bd484a893dcefa16c01e1b431`, tree `6f36076d83c0f87b5e038be99604b8bc7eb5d531`
- Correction03 commit: `5caf3d871a80a711c08dbda0db8c5f5446dffb56` (`fix: preserve implicit returns in multi-clause funcs`)
- Corrected tree: `115ce5ecc254ea9ed15263612bed67b6cec80ab2`; source worktree clean.
- Exact source paths: `crates/lykn-lang/src/emitter/forms.rs`, `crates/lykn-lang/tests/emission_results.rs`, `packages/lang/classifier.js`, `crates/lykn-lang/embedded/packages/lang/classifier.js`, `test/forms/embedded-adt-pattern.test.js`, and `test/forms/language-surface-runway.test.js`.
- Canonical and embedded `classifier.js` compare byte-for-byte. Both Array-shadow fixture sources remain unchanged.
- Commit message body has the required adjacent trailers, verified from `%B`:
  `Co-authored-by: Codex <noreply@openai.com>`
  `Co-authored-by: Billo AI <ai-engineering@billo.systems>`

## Implemented behavior

- Public JS `buildMultiClauseFunc` now routes the ordinary no-post body through the existing `wrapReturnLast` helper regardless of whether `:returns` is present. The `:post` branch remains unchanged; the helper continues to preserve statement-only and explicit control-transfer tails. No general return-type guard, I4 early-return, generator, void, or assertion-stripping behavior is claimed or changed.
- The native private dispatch builder receives `param.span()` from the real parsed multi-clause parameter and stores it on the owned ArrayIsArray reference. Its generated expression and dispatch decisions are unchanged.
- The public native fragment integration test parses a multi-clause source and asserts the Codegen diagnostic uses the first array parameter's actual line 2, columns 18–23 span, rather than `Span::default()` or a synthetic list span.
- The embedded public test retains its existing recursive ADT, macro-hygiene and single-clause guard controls; its title now accurately says single-clause. The two existing module/parameter Array-shadow fixtures run independently through the materialized `lang/` import map and assert exact stdout, exit zero and empty child stderr.
- A canonical public emitted-ESM regression compares annotated and unannotated one-expression and prefix-plus-final-value multi-clause functions; it also runs unannotated explicit-return tails, a multi-clause `:post` success/failure path and an unknown-type no-match path. Exact values and prefix effects are asserted. This does not claim complete multi-clause return-type validation.

## Census clarification

The native `emitter::forms::tests` static source census has 202 test sections: exactly 44 function-local `emit_form_raw_checked` aliases, 125 sections among the remainder with direct public `emit_form` calls, and 33 sections using testing helpers or other internals. The unchanged remainder is 158, but it is not accurate to describe all 158 as direct public API tests. The 44 producer-boundary migrations preserve their shape guards and assertions. The full 1,176-test language unit population executed in `make check`; this source census is separate from the independently focused integration controls and five materialized ESM runtime cases.

The correction01 results had already recorded the 44-name list; this addendum corrects only its overbroad characterization of the 158-test remainder. Historical wording is retained.

## Verification

All focused commands used explicit `DENO_DIR=/Users/oubiwann/Library/Caches/deno`, owned `npm_config_cache=/private/tmp/lykn-correction03-npm-cache`, and owned XDG/tmp directories where applicable. M6-specific receipts were scoped to its focused command.

- `cargo test -p lykn-lang --lib emitter::forms::tests::test_dispatch_check`: 6/6.
- `cargo test -p lykn-lang --test emission_results`: 8/8, including the parsed-source span oracle.
- `cargo test -p lykn-cli --test semantic_roles array_dispatch_uses_owned_intrinsics_under_module_and_parameter_shadowing -- --exact`: 1/1; its existing process matrix covers both fixture scopes in checked and stripped modes.
- `deno test --config project.json -A test/forms/language-surface-runway.test.js`: 12/12, including the new emitted-ESM regression.
- M6 cold-cache/copy/no-fallback/seven-module comparison test: 1/1. Its strict materialized package import-map process reports all five tests passed, including module and parameter multi-clause Array-shadow runtimes.
- Full `make check`: passed. Recorded populations include 1,176 `lykn-lang` units, 59 semantic-role tests, 8 emission-results tests, product corpus `1513 passed (67 steps) | 0 failed`, and docs `482 passed | 0 failed`; build, lint, format and other Rust suites passed.
- `make bundle-size-check`: 42,223 gzip bytes (41.2 KiB), baseline 27,630 bytes, delta +14,593 bytes; within the 80 KiB budget. The output retains `astring` package condition warnings from the owned Deno npm cache; no gate failed on them.
- After commit, `make check-cited-paths`: passed at corrected HEAD, 64 documents on `codex/qualified-adt-core`, with 601 historical citations accepted via the frozen census.

Logs: `canonical-runway-retry.log`, `dispatch-builder-tests.log`, `emission-results-tests.log`, `native-dispatch-runtime.log`, `materialized-m6.log`, `make-check.log`, `bundle-size-check.log`, and `check-cited-paths.log`. The materialized M6 raw process files, config, seven module comparison receipts, command, stdout, stderr and status are under `macro-dependency-receipts/`.

## Preserved failures and limits

- Correction01's initial public-fragment span expectation targeted the enclosing typed form; the final contract anchors to the actual reference token span (line 1, columns 35–40). The focused raw assertion transcript is unavailable. Its initial dispatch fixture draft declared the same function twice and failed at duplicate identifier; a later same-spelling-macro draft emitted an unresolved `sourceMacro` atom and failed at runtime. Those raw focused logs are unavailable; the later passing corrected tests and existing source/evidence are preserved. No failure text has been reconstructed.
- Correction02's first M6 attempt stopped before its test body because the configured receipt directory did not exist; `materialized-m6.log` preserves that failure. After creating it, the materialized suite ran three cases successfully and failed the two new multi-clause cases because their unannotated final values fell through to the no-match throw. `materialized-m6-retry.log` preserves the failed result; `materialized-m6-debug.log` preserves the temporary diagnostic showing the generated aliases were correct and the missing returns caused the fallthrough. The temporary error-output change was reverted before correction03; fixtures were not annotated or changed. The archived pre-implementation source patch remains at correction02 with SHA-256 `e59b3ec72b83a8d095a18b7541ec8fb62a1a395d893220e263fba502932cc23f`.
- The first correction03 runway run lacked a created owned tmp directory; `canonical-runway.log` preserves the five temp-creation failures and seven passing non-runtime cases. After creating the owned directories, `canonical-runway-retry.log` records 12/12. A shell log-path typo prevented one attempted retry command from launching and produced no process log; it did not alter source or receipts. The first commit invocation put `-m` after the path separator and was rejected as pathspecs; no commit was created by that attempt. The next exact-path invocation succeeded with verified trailers.
- No purity, qualified syntax, nominal runtime, browser eval-based inline-ESM, release, remote CI, publication, integration, or independent acceptance claim is made. No dependency was added. `make check` ran docs once as part of its standard gate.

All correction02 failures and files remain intact. Planning receipts are write-only/uncommitted; root owns the planning index and Git. Source/build ownership returns to the separate Sol reviewer after this CC checkpoint.
