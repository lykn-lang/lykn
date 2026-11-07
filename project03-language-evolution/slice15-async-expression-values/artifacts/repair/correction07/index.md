# Correction07 CC evidence index

## Frozen source and ownership

- Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/async-expression-values`, final frozen source commit `5408abd432b8789ae474a3895436f68818c4e482`, clean after all gates. Only product path changed: `crates/lykn-lang/src/emitter/forms.rs`; SHA256 `096c91ea3dc15a9ec6f54aad69f31b5fe81a38ff0813fd55d89cb9d45c8f53c0`.
- Semantic traversal was committed at `38055bbb02bc924b038589bec3512b443b495ce7`; one edition-only formatting correction was committed at `5408abd432b8789ae474a3895436f68818c4e482`. Both commits have exact-path source scope and contiguous Codex/Billo AI trailers.
- Planning worktree was clean at `57d492baef4c9a713014b861bb1c0c3604170026` before intake. This new correction07 directory is the only planning-owned path. Full intake and contract readback are in `raw/intake.md`.
- No parser observations ran. Source acceptance and all independent CDC review/replay remain pending; this is CC attestation only.

## Results

| Gate | Result | Raw receipt |
|---|---|---|
| Frozen-source rustfmt | `rustfmt --edition 2024 --check` exit 0 | `raw/attempt-04-rustfmt-frozen-final/` |
| Focused native lib build | `cargo test --offline --locked -p lykn-lang --lib --no-run` exit 0; binary SHA256 `6fc308f570bbaf6956372588ad9961a52a1e8370cd52f2573ad58187bfb9e278` | `raw/attempt-05-native-lib-build/` |
| Existing grouped-bind regression | exact selected test 1 passed, 0 failed, 1122 filtered | `raw/attempt-06-grouped-bind-unit/` |
| Existing switch-if regression | exact selected Deno test 1 passed, 0 failed, 33 filtered | `raw/attempt-09-switch-if/` |
| Existing switch-or regression | exact selected Deno test 1 passed, 0 failed, 33 filtered | `raw/attempt-10-switch-or/` |
| Same-five native fixtures | E1–E5 strict compile and no-grant Deno execution, exact frozen JSON; 1 harness test passed | `raw/attempt-11-native-five/` |
| Same-five public JS fixtures | 1 parent test, 5 fixture steps passed, exact frozen JSON | `raw/attempt-12-public-js-five/` |
| Parser-core compatibility | Input source SHA256 `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7` is the unchanged Slice14 parser-core source; compile exit 0. Generated JS SHA256 `068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9` matches the earlier repaired Slice15 CDC output, not the original invalid Slice14 output. Strict Deno module load exit 0 with empty stdout/stderr, no grants, inputs, function call, or Acorn import. | `raw/attempt-13-core-compile/`, `raw/attempt-14-core-module-load/` |
| Normal full validation | `make check` exit 0: dependencies, committed citation gate (63 documents / 601 historical citations), release build, clippy, formatting, syntax, Lykn lint, full Rust workspace (language lib 1123 passed / 0 failed), Deno suite 1468 passed / 0 failed (11 steps), docs 482 passed / 0 failed. | `raw/attempt-15-full-make-check/` |
| Embedded JS materialization | Canonical compiler, embedded mirror and fresh XDG materialization all byte-identical, SHA256 `1c1e7e822e5665b3cac2914d95bceade004694c0c37db5be1dd971876e56fd56`. Fresh XDG and npm caches were used; fixed DENO_DIR was retained. | `raw/attempt-16-embedded-materialization/` |
| Separate committed citation gate | exit 0; 63 documents / 601 historical citations. | `raw/attempt-18-citation-gate-resolved-make/` |

Runtime pins: Deno `/opt/homebrew/bin/deno` 2.9.6 SHA256 `2ad84f9e678ce12600a56772e0bed999938556153bf4da9b71cac7e365e5ce74`; CLI `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/release/lykn` SHA256 `b0a5649791ec6dfdd774619cc7c01c4c6c4f1138a5db7e368916416a9600b873`. The complete fixture sources, generated modules, runtime outputs, actual argv/cwd/environment, streams and exits are retained under the referenced attempt paths.

## Preserved non-green invocations

- `raw/attempt-01-rustfmt-frozen/` records an initial bare rustfmt check that exited 1 because the project uses Rust 2024 let-chains; no source was changed by that check. `raw/attempt-02-rustfmt-frozen-edition2024/` then identified one mechanical formatting difference. The pre-format whole source was preserved, rustfmt wrote only that mechanical change in attempt03, and the final edition-qualified read-only check passed in attempt04.
- `raw/attempt-17-citation-gate/` records an invalid absolute make path (`/opt/homebrew/bin/make` absent), exit127. The correctly resolved `/usr/bin/make` invocation is preserved separately at attempt18 and passed. No gate was weakened or skipped.

## Final status

The exact two introduced switch regressions, grouped-bind unit and all specified focused/five-fixture/core/full source gates pass on this frozen candidate. Independent CDC source review, exact-two replay, same-five/core replay and independent full Make are pending. Do not treat this CC record as acceptance or as authority to continue the four parser observations.
