# S03 iteration20 — native export protocol and real parity oracle

Issued2026-11-13. Refines cc-prompt-iteration19.md, retaining all18+19 source,
contracts, failed attempts and gates. Baseline57c76c99/treef044d795 remains;
Luna owns the authorized dirty seven-path implementation at the existing
codex/qualified-adt-core task worktree. Root owns design/planning Git/index/
ledger. Same Luna6High CC and separate Sol6.1High CDC, standard Autonomous.
No release/merge/push/publication/remote CI/dependency/licensing authority.

The full-check01 old unit-wrapper oracle was correctly migrated within forms.rs.
Full-check02 now fails e2e_export_bind in crates/lykn-lang/tests/e2e_tests.rs:
it is an e2e_test! macro comparing native JSON against ACTUAL public JSON,
not a hardcoded expected constant. Native now emits const followed by names
export; public still uses the old inline wrapper pending its own implementation.
This intentional backend protocol divergence must not be hidden by disabling
the test, changing global normalization, or asserting the old public shape as
a permanent contract. Keep actual behavioral comparison and prove native API.

Authorize this EIGHTH source path, only for the e2e_export_bind migration.
Keep the same test name/population and existing source `(export (bind VERSION
"0.4.0"))`. Replace that one macro invocation with an explicit test:

1. Run existing rust_pipeline and normalize_json. Assert exact native protocol
   const declaration carrying VERSION/string0.4.0 followed by one export(names
   VERSION), no extra declarations/public bindings. Existing native-only
   export_func test demonstrates explicit API assertions; do not weaken to
   merely is_array/nonempty.
2. Parse native JSON back with existing
   lykn_lang::expander::env::protocol_json_to_sexpr and native codegen, as
   discard_bindings.rs compile_through_json already does. This is actual native
   JSON consumer proof, not treating public JSON as native output.
3. In an ordinary product Deno runtime test script (Command with repo cwd and
   project.json, as this file's existing helpers), import actual public lykn
   from packages/lang/mod.js, compile the SAME source, and execute both complete
   generated ESM modules via data-URL imports or existing product temp-module
   lifecycle. Serialize embedded strings with serde_json rather than ad hoc
   quote escaping. Observe each namespace's exact keys `["VERSION"]` and
   value `"0.4.0"`; require process success and exact expected observations
   for BOTH backends. No optional runtime skip. This retains meaningful public/
   native behavior parity without imposing identical intermediate representation.
   No new production API, compiler change, JS module/dependency or harness.

Only add local standard product test code needed for this one existing case;
leave all other e2e_test! instances, normalize_json and pipeline behavior
unchanged. Record that one structural backend equality assertion became an
explicit native protocol assertion plus stronger actual ESM namespace/value
comparison. Full public discard/typed export parity is STILL OPEN. Original
macro, actual outputs and failed full02 survive in Git/receipts/planning; do not
preserve obsolete history as expected product behavior.

Required-full: this prompt, current slice-plan/ledger, source AGENTS, issued19
and its inherited18 contract (already completely loaded in continuing context;
record current changes and recover full reading after compaction). Required-
section: e2e_tests.rs rust_pipeline/js_pipeline/normalize_json/e2e_test! and
export tests, new discard_bindings.rs JSON/module runtime helper, actual
protocol_json_to_sexpr/codegen API needed. Root inspected these actual callers;
testing01/03 principles apply: exact native protocol AND actual semantic parity,
not skipped/normalized-away behavior. No new domain policy or source readiness
question is pending; separate final reviewer checks the changed oracle.

Record intake/readback and all first/final receipts in the SAME canonical
artifacts/increment-b2b3/native/cc/index.md/home. Source eight-path scope is19's
seven PLUS crates/lykn-lang/tests/e2e_tests.rs. Keep source/build ownership;
run the focused e2e test and affected unit/integration checks, then a fresh
final make check with M6 hook55/14, exact eight-path commit/trailers, finalHEAD
citations and fresh81920byte size gate. Previous failed full runs remain failed;
the rerun is justified by this necessary test change, not an arbitrary repeat.
Docs run inside make check, not separately. Return clean proposed-done source/
build with no jobs before separate Sol software validation. Root owns ledgers.

No Python execution or parity exception; no Python/Ruby/Fennel/handwritten JS
research/helper/orchestration/evidence/command logic. Helpers use Lykn;
ordinary Rust/JS product tests (including the runtime test here), direct shell/
CLI and simple filesystem lifecycle are allowed. No new dependency/lock/
manifest or unrelated source/format changes. All remaining public/raw/catch/
name/owner/check/DTS/docs/book/human/LC02–08/S03 obligations remain open.
