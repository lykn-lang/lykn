# S03 increment A gate receipts

Source branch: `codex/qualified-adt-core`

Source commit: `5a8aedc5dcd6329da7b5f33a5397126a45891bac`
Baseline: `0829e892999890e8877dec5e35cd249753e1be5d`

## Final gates

- `DENO_DIR=/Users/oubiwann/Library/Caches/deno npm_config_cache=/private/tmp/lykn-s03-a-npm-cache make check` — passed. Release build, Clippy, Rust formatting, Lykn syntax/source lint, all Rust tests, product test suite (`1507 passed (67 steps)`), documentation tests (`482 passed`), and final `All checks passed` receipt are preserved in `make-check-final.log`.
- `make check-cited-paths` on committed `5a8aedc5` — passed: 64 current documents checked; 601 accepted historical citations.
- `make bundle-size-check` — passed: gzip 42,262 bytes, +14,632 bytes over baseline, within the 80 KiB budget. Full output is preserved in `browser-size-final.log`.
- `deno test --config project.json -A test/forms/host-reference-lowering.test.js test/forms/protected-host-policy.test.js` — passed, 7 tests.
- `deno test --config project.json -A test/forms/browser-host-reference-compile.test.js` — passed; browser `compileLykn` output was imported as an ESM module and its TypeError, array guard and no-match Error outcomes matched expected values.
- `deno test --config project.json -A test/forms/lazy-protected-invocation.test.js test/forms/protected-host.test.js test/forms/protected-host-policy.test.js test/forms/semantic-roles.test.js` — passed, 27 tests / 56 steps.
- `cargo test -p lykn-lang owned_host_reference` — passed, 2 codegen tests.
- `cargo test -p lykn-lang protected_host --lib` — passed, 13 policy tests.
- `cargo test -p lykn-cli --test protected_host` — passed, 4 tests, including default and stripped CLI compilation plus local/deeper controls.
- `cargo test -p lykn-cli --test semantic_roles native_owned_intrinsics_survive_module_shadowing -- --nocapture` — passed; native CLI emitted and ran the source with Number, Array, TypeError and Error roots shadowed. Runtime result was `[["TypeError","checkNumber: arg 'value' expected number, got string"],["TypeError","checkArray: arg 'value' expected array, got number"],["Error","match: no matching pattern"]]`.
- Three native JSON e2e cases passed after asserting the exact expected intrinsic support bindings as well as semantic export/async forms.

## Preserved failed attempts and corrections

- The first direct `expandExpr` coverage attempt passed `read(source)` itself and failed with `Error: expandExpr: unexpected node type 'undefined'`; the reader returns an array of top-level forms. The test now passes the single returned form, proves that owned references materialize into multi-form output, and passes.
- The first `make check` used the isolated temporary Deno cache and failed four Rust integration tests while fetching `astring@1.9.0` (`https://registry.npmjs.org/astring/-/astring-1.9.0.tgz`, DNS lookup failure). The later run reused only the existing Deno dependency cache via explicit `DENO_DIR`.
- With Deno repaired, the next run hit `npm pack --dry-run` failing with `EPERM` on root-owned `/Users/oubiwann/.npm/_cacache/tmp`. The successful run instead used a fresh task-owned npm cache at `/private/tmp/lykn-s03-a-npm-cache`; the user cache was untouched.
- That run exposed three stale native JSON e2e count assertions: whole-unit JSON now includes the generated reference-support forms. The tests now assert exactly the expected Number.isNaN/TypeError aliases (or TypeError alias for async string guards), exact complete-unit form counts, and the expected export/async structure; all focused tests and the final gate pass.
- The next run found four stale `.lykn` product-test expectations for unaliased `Number.isNaN` / `Array.isArray`; these now assert compiler-owned aliases. The final full gate passes.

## Scope limits

No new dependency was added. The browser ESM compile/consumer path is exercised. Browser `run`/`load` still use indirect eval and cannot execute the generated static inline-data ESM import fallback; carry this limitation for S06. No purity annotation, nominal activation or purity/initialization claim was added.

## Early implementation chronology (session narrative, not retained raw logs)

The following records early attempts recalled from this CC session and the
available tool output/context. No raw terminal log for these early failures was
saved under `artifacts/increment-a/`; they are explicitly narrative evidence,
not verbatim log excerpts. The retained raw evidence above remains unchanged.

1. **Native marked-reference/form-head dispatch.** The first focused native
   command was `cargo test -p lykn-lang owned_host_references -- --nocapture`.
   It exposed that an unlowered marked atom with an empty marker value was still
   visible to form-head dispatch, so the writer treated it as a kernel head and
   did not emit the typed reference. The exact assertion/error text was not
   retained. The correction made marked references ineligible for form-head
   dispatch; rerunning that focused command passed both codegen tests.
2. **Public `set!` output oracle.** The first focused public command was
   `deno test --config project.json -A test/forms/host-reference-lowering.test.js test/forms/protected-host-policy.test.js`.
   One assertion for `(set! Object:freeze:prototype 0)` expected the wrong
   spelling. The exact initial expected/actual diagnostic text was not
   retained. The oracle was corrected to the compiler's actual
   `set(Object.freeze.prototype, 0);` output; the focused public tests then
   passed.
3. **CLI test API visibility.** The first `make check` failed while compiling
   the new `crates/lykn-cli/tests/protected_host.rs` test because it called the
   private binary module `lykn_cli::compile::compile_source` (reported at
   lines 872 and 881 as `error[E0433]: cannot find compile in lykn_cli`). The
   correction exercised the actual `lykn compile` binary against temporary
   source fixtures in both assertion modes and for legal local/deeper controls.
   `cargo test -p lykn-cli --test protected_host v2_protected_roots_and_slots_reject_before_assertion_stripping -- --nocapture`
   then passed.

## Commit trailer note

The source commit's trailers are present, but Git formatted a blank line
between `Co-authored-by: Codex <noreply@openai.com>` and
`Co-authored-by: Billo AI <ai-engineering@billo.systems>`. This is recorded as a
commit-format deviation only. Commit `5a8aedc5dcd6329da7b5f33a5397126a45891bac`
is preserved without amend or history rewrite.
