---
project: project03-language-evolution
arc: arc01-compiler-semantic-integrity
slice: slice02-checked-emission-results
status: in-progress
planned-release: unassigned
depends-on: [slice01-variadic-for-context]
---

# Checked emission results

## Authority, endpoint and homes

2026-11-07: after independently green [Slice20](../../slice20-semantic-stack-release-integration/cdc-verification.md), the Operator approved Result-family compiler APIs. The 0.5→0.6 breaking-development boundary removes backward compatibility as a reason to retain a success-shaped legacy API. This authorizes S02 implementation, full validation and independent review; it does not authorize arbitrary API removal or a typed-AST rewrite. Stop on the first unexpected substantive failure; planned baseline red below is expected. No automatic S03 advance.

CDC `/root/cdc`, OpenAI gpt-6.1-sol High, owns design/planning and independent acceptance. Fresh CC gpt-6-luna High owns the source implementation and raw receipts after explicit handoff; root coordinates read-only. Normal source refinement ceiling is five, initially zero used, with the stricter substantive-failure stop above. Eight spent tooling passes and K0/13 remain unchanged.

Source baseline is exact `8f5d1990df86405656729972485ae4d11feba808`, tree `8b1a05ff7ca8d6c9aedd82984be19d81a03894f2`. In `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, create `codex/checked-emission-results` from that revision, preserving `codex/variadic-for-body-context`. Release `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x` stays read-only at8f. No integration, push, publication, new dependencies/toolchain, global installation, source propagation, K/walker/corpus/F6/library work. Planning stays on `planning`; never merge it into source.

## Public and internal contract

Use existing `LyknError::{Classify,Codegen}` and `Diagnostic` (severity/message/span/suggestion). Change exactly these source-lowering boundaries to checked results:

- `emitter::emit -> Result<Vec<SExpr>, LyknError>`.
- `emitter::emit_json -> Result<String, LyknError>`.
- `emitter::forms::emit_form -> Result<Vec<SExpr>, LyknError>`.

Primitive `atom/str_lit/num/list`, raw-kernel JSON serialization and runtime contract/type/DTS builders remain infallible builders. No unchecked public source-lowering escape. Existing public context fields and constructor remain; add a private first-fatal slot. This intentionally prevents external context struct literals: document the constructor migration, not a legacy shim. No unrelated public removals.

Use a private `emit_form_inner` for all internal recursion (baseline calls at forms.rs376/386/514/655); public checked wrapper is a true boundary, not a recursive drain. Record only the first fatal until that boundary. Successful or failing later siblings cannot erase/overwrite it. Never expose partial IR/JSON as Ok. Save/restore entry `expr_context` and `in_class_body` on failure; clear the consumed diagnostic for subsequent context reuse. Gensym consumption is monotonic even on failure, not rolled back. Private helpers may produce a discarded placeholder after recording an error, never a successful source artifact. Do not use panic-catching, text scans, sentinel grep, or compiler-generated runtime throws as failure delivery.

Recognized fatal paths in baseline `crates/lykn-lang/src/emitter/forms.rs`: invalid assign at emit_form/emit_expr (~423/483); recognized nested classification Err→raw clone (~525); returns mismatch (~747, three call sites); missing-else conversion (~772, recursive and function-tail call sites); missing-else expression lowering (~3017). Preserve nested classifier `Diagnostic` exactly as Classify. Use Codegen for actual lowering failures, with original expression/clause span passed where available; helper-generated default0:0 is not precise source provenance. No file ID exists in Diagnostic: CLI/dist supplies path context. Do not blame every lowering failure on invalid user Lykn or prescribe an else to evade a compiler context defect. C05 completion semantics remain S04.

Legitimate user text (including `COMPILE_ERROR`), user exceptions, runtime type/pre/post/exhaustive-match throws retain their behavior. `strip_assertions` never disables compiler failure reporting.

## Production route adoption

Use new private `crates/lykn-cli/src/validation.rs`, `mod validation` in both binary main.rs and library lib.rs; do not expose compile.rs as a public module. A crate-private function returns the FIRST nonempty existing validator group in this exact order: reserved bindings, method calls, nested fn parameters, no-else-if values, exports. Existing compile helper delegates and preserves the entire group's newline-joined diagnostic formatting.

Both compile paths use checked emission with `?` before JS/DTS/file writes. Dist keeps its package config/import map/strict extension/cache/staging rules, but resolves expanded forms and applies the same five groups before classification. Add `DistError::Language { path, source: LyknError }` with typed source chaining. New dist prevalidation policy is path plus first Diagnostic, classified as Classify; lowering errors retain their original variant. Existing other aggregate diagnostic formatting need not be redesigned. I/O remains I/O. Do not alter cache keys, packaging policy or import acquisition.

Compiler failure means no new JS/DTS and unchanged pre-existing JS/DTS for that failing source. This is not I/O-atomic pair writing or whole-package rollback; earlier successfully compiled files may exist.

## Frozen test recipe and predicted observations

### A — Behavioral baseline before production changes

New CLI integration tests must compile against the OLD API. Freeze and commit their actual bodies first. Use the existing Rust `Command`/TempDir product-test idiom, CARGO_BIN_EXE_lykn and the configured exact Deno executable, raw bytes/exit before assertions. Execute all four invalid conditions before aggregate assertion, so expected first failure cannot skip later rows.

Invalid source, exact ordinary syntax:

```lykn
(bind obj-value (obj :secret 1))
(bind cleaned (dissoc obj-value "secret"))
(console:log cleaned)
```

`dissoc` requires keyword keys (classifier/forms.rs classify_dissoc); Bind retains its raw value until lowering. Existing five compile prevalidators do not check that key. Baseline prediction: nested classification failure is silently raw-cloned, producing success-shaped compile output. Four conditions: CLI stdout; CLI `-o` existing JS/DTS; CLI `-o` missing outputs; public dist/build route existing JS/DTS. Future oracle: nonzero/typed error, no stdout JS, existing bytes unchanged, fresh outputs absent. Never execute the invalid generated output. For dist force actual compilation: set owned JS/DTS modification times to UNIX_EPOCH via stable `File::set_modified` and assert source newer. No sleep/clock changes; do not let a cache hit pass the failure test.

Two valid source controls, through CLI and package compilation:

```lykn
(console:log "COMPILE_ERROR: literal")
(throw (new TypeError "COMPILE_ERROR: user runtime"))
```

Compilation succeeds. Strict Deno execution exits1, stdout exactly `COMPILE_ERROR: literal\n`, stderr identifies TypeError and the user message. This is intentional program behavior, not a compiler failure.

```lykn
(bind dissoc (fn (:any left :any right) (get (array left right) 1)))
(console:log (JSON:stringify (dissoc (obj :secret 1) "kept")))
```

Compilation/execution succeeds, stdout exactly `"kept"\n`, empty runtime stderr. Resolver-bound `dissoc` is an ordinary call; new error delivery must not falsely classify it as the special form. Use actual public build_project/package fixtures, no npm/registry operation. Preserve complete successful JS/DTS output evidence. Existing contract_predicate_lowering test supplies 17 broader runtime type/contract observations; retain it and full suites.

### B — Result API/context tests with implementation

New Result-method tests cannot compile against the old Vec API. Add them with the implementation freeze; do not fake a baseline type-error as behavioral red or create an old/new adapter. Adapt existing direct emitter callers/tests mechanically to checked success. Meaningful finite tests:

1. All three public checked boundaries, assertions enabled/stripped, reject known fatal lowering; emit_json never returns partial serialized output. Valid empty/literal/primitive-builder cases succeed.
2. Parsed, resolved, classified nested bad→bad→good sibling forms preserve the FIRST exact classifier Diagnostic, including nonzero original span and suggestion. A useful body is `(bind data (obj :secret 1)) (bind result (obj :a (dissoc data "bad") :b (dissoc data "later") :c (obj :ok 1)))`. Derive the independent expected payload by classifying the first bad parsed child, not from emitter output. Assert later failures/success cannot erase it.
3. Checked form failure restores caller Value/in_class_body state; the same context subsequently emits a valid form without a stale error. Include nested failure, not just a top-level known error.
4. Parsed postcondition/typed function ending in a statement-only while exercises returns mismatch after allocating a result gensym; failure keeps monotonic consumed gensym and correct source clause span. Do not test new C05 return semantics. Defensively exercise conversion's missing-else path with supplied source origin as well as direct value-if and invalid assign paths.
5. Migrate S01 direct numeric-for header counter from its old throw-IR representation to checked Err for each of three consumed headers, with caller context restoration; same input and falsifier (all-Statement shortcut would incorrectly succeed). Do not weaken the negative or hide compiler failure behind runtime throw.
6. Private shared validation preserves all five category priorities and existing CLI multi-diagnostic group formatting. Use existing compile_validation_parity invalid cases, not a new language family. Dist's typed path/source payload and same-file sentinel preservation are asserted. Existing earlier frontend rejection controls are preservation tests, not predicted new CLI-red rows.

## Allowed source paths and guidance

Only: emitter `mod.rs/context.rs/forms.rs`; lang `tests/e2e_tests.rs`, `tests/cross_compiler.rs`, new `tests/emission_results.rs`; CLI `src/compile.rs`, `src/dist.rs`, `src/main.rs`, `src/lib.rs`, new `src/validation.rs`, new `tests/emission_failures.rs`; `docs/guides/03-error-handling.md` for a narrow compile-error versus runtime-error section. API Rustdoc stays in owned Rust paths. No Cargo/lock/AST/error-enum/JS implementation change expected. All paths relative to the named source checkout. Any necessary additional source path requires return before mutation.

Load installed collaboration-framework, PM README and required layout/top-down/prompt guides, work-verification, testing, rust-guidelines (named errors/Result/private boundaries), javascript-deno-guidelines for child permissions, and source `skills/lykn/SKILL.md`/relevant error/object/function guidance. CDC's recipe above is binding; intake records actual stable sections loaded, source identities and contract readback. Reuse unchanged historical receipts proportionately.

## Gates, capture and ownership

Freeze actual source/test bodies in Git before each dependent check. Use exact path commits with supplied message files and raw message readback, never amend/rewrite. Build/no-run all needed binaries first, then pin actual debug CLI/test executables and invoke direct focused binaries without an intervening Cargo build. Verify producer hash before/after actual compile/runtime. Capture full stdout/stderr/exit, argv/cwd/env from first launch, unique attempt paths, complete generated JS/DTS (or explicit absence), and real strict Deno results. A build may replace a binary; repin after full Make.

Full normal unfiltered `make check` plus committed `make check-cited-paths` required. No CARGO_NET_OFFLINE/CARGO_TARGET_DIR or global metadata override for full Make; focused Cargo `--offline --locked` is allowed. Actual source cwd Rust1.97 toolchain; Deno `/opt/homebrew/bin/deno` version2.9.6 SHA `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`. Fresh owned npm/XDG caches, fixed accepted DENO_DIR `/Users/oubiwann/Library/Caches/deno` from first launch, existing cached compiler dependencies only. No installer/update when a gate fails. Existing normal publishing dry-run compatibility tests are part of Make, not new helper/dependency or publication permission.

CDC independently reviews exact diff/public surface/context/error spans/route writes/generated modules and repeats focused/runtime/full normal Make/citation gates after clean ownership return. No acceptance from CC attestation alone. Six ledger rows, report/review/retrospective and parent/API impact pointers close this unit only. All historical process violations/receipt limits and F/Project07/adjacent findings remain intact.
