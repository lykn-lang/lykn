# Correction04 native statement-tail and gates evidence

Frozen native source commit: `54608a7c463ea0386c9fade45d57d66da45050b9` on `codex/async-expression-values`. Exact source/tool hashes and focused command are in `pins.md`. The five fixtures, test harness, and JS compilers are unchanged from correction03.

## Frozen control and native regressions

- `for-await-tail-before.log` retains the first weak unit pass at `be6bf73`; its predicate queried the form head on the loop list and did not establish placement.
- `for-await-tail-corrected-before.log` retains the corrected private-tail test failure on unchanged product source `0fe6663` (exit101); the corrected unit is frozen at `949da90`.
- `native-await-units.log`, `native-bound-call-unit.log`, `native-carrier-unit.log`, and `for-await-tail-green.log` retain the four prior private units plus the new loop-tail unit after `54608a7`; all pass.
- `native-runtime.log` is the same five native fixtures on `54608a7`; E1–E5 all exit0 and the integration test passes.
- `native-build.log`, `native-test-build-final.log`, formatting receipts, and `native-release-build.log` retain the focused/release build and formatting evidence. The first draft build error is separately preserved in `native-test-build.log` (borrow-after-move); the exact transient source body was not saved, as noted in `pins.md`.

## Old complete-core validity witness

- Source: the same Slice14 `parser-core.lykn` at commit `13fd27feed2c3e6b4c0de37835f9edab602cee47`, SHA-256 `6ca1afe83d6d9a47f7eb1fea7f0aa3872ae626cc4f39d5b3ed017aab38308bf7`.
- Release compiler: `target/release/lykn`, SHA-256 `b42b1adea1e60c1412eaa210190e4061e56709b770a292d21202334746bd8a93`.
- `core-check.*` and `core-compile.*` retain actual invocations, cwd, separated stdout/stderr and exit0. Complete generated module is `core-generated.js`, SHA-256 `068afeb7c912bab6876b8412fdadc6c6948ca41dcdb497f8b99a40061fb3f6a9`.
- `core-generated-vs-stage-c.diff` was reviewed in full (26 lines): the complete-module delta is confined to the selected awaited parser import/conditional value branch, now emitted as a valid async boxed-value path with a boxed-undefined fallthrough. No unrelated generated-code differences appeared.
- `core-deno-check.*` exits0 but is not treated as validity proof. `core-module.argv`, `.cwd`, `.env`, `.stdout`, `.stderr`, and `.exit` retain the actual offline Deno module load: exit0, empty stdout/stderr, no arguments, no entry-function call, no permission grants, network denied, no prompt, and no Acorn import. Existing fixed DENO_DIR was reused.

## Mirror, fresh materialization, and full Make disposition

- Canonical and embedded compiler files compare byte-identically at SHA-256 `1c1e7e822e5665b3cac2914d95bceade004694c0c37db5be1dd971876e56fd56`.
- The unfiltered normal-environment `make check` invocation, cwd and explicit environment are in `make-check.argv`, `.cwd`, `.env`; `make-check.log` and `.exit` preserve exit2. The environment left `CARGO_NET_OFFLINE` and `CARGO_TARGET_DIR` unset, used the installed toolchain, existing `/Users/oubiwann/Library/Caches/deno`, and owned npm/XDG paths. The new XDG cache was empty before Make.
- Make passed dependency checks, the committed citation gate (63 documents, 601 historical citations accepted), release build, clippy, rustfmt and syntax checks. It stopped in unfiltered Lykn lint on the existing frozen E5 scope witness: a shadowing warning for its inner `outer` binding at line 5. Make treats that warning as failure. No fixture edit, lint suppression, reduced gate or later test-suite retry was made.
- The build stage had already freshly materialized embedded packages under `target/slice15/correction04/xdg-cache/lykn/embedded/0.6.0/packages/lang`; its compiler.js byte-compares to the embedded source at the same hash above. The Make test stage did not run after lint stopped.
- Earlier public-JS five-case evidence remains correction03 and applicable because correction04 changed only forms.rs. No redundant focused JS run was made.
- No parser observations or independent acceptance are claimed.
