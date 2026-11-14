# S05 independent final-source receipts

2026-11-14, separate Sol6.1 High reviewer `/root/arc05_s05_cdc`.
All executions below ran on actual clean source
`82f1b65b92529979afd6c624183912ca31453927`, tree
`4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`, in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Final read-only status/tree checks confirm the same clean pin. No product or
Git/index mutation occurred. Release stayed clean c60dea62.

Runtime-bearing commands used explicit
`DENO_DIR=/Users/oubiwann/Library/Caches/deno` and
`XDG_CACHE_HOME=/private/tmp/lykn-arc05-s05-cdc/final02-xdg`.
This outer private directory and the absolute `m6/` evidence directory were
created before execution. The full gate additionally set
`LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR` to this directory's absolute `m6/` path
BEFORE make started. No wrapper or evidence-processing helper was authored.
Complete command-tool results/session identifiers were retained in the review
transcript; logs below combine top-level stdout/stderr by direct redirection.

| Log | Actual command from the source home | Exit and result |
| --- | --- | --- |
| 01-focused-native.log | `cargo test -p lykn-lang --test generated_name_hygiene -- --nocapture` | 0;4 passed,0 failed |
| 02-focused-cli.log | `cargo test -p lykn-cli --test generated_name_hygiene -- --nocapture` | 0;2 passed,0 failed |
| 03-names.log | `cargo test -p lykn-lang --lib codegen::names::tests -- --nocapture` | 0;59 passed,1158 filtered,0 failed |
| 04-gensym.log | `cargo test -p lykn-lang --lib emitter::gensym::tests -- --nocapture` | 0;5 passed,1212 filtered,0 failed |
| 05-fresh-artifacts.log | `make fresh-artifacts` | 0; optimized release binary and lang/browser/testing build outputs refreshed |
| 06-make-check.log | `make check` with the explicit absolute M6 environment above | 0; complete workspace Rust1798 across42 harness results, including native library1217; Lykn1578/67 steps; docs482 |
| 07-cited-paths.log | `make check-cited-paths` | 0 at finalHEAD;64 documents/601 accepted historical citations |
| 08-bundle-size.log | `make bundle-size-check` | 0 fresh at finalHEAD; raw379173/minified181014/gzip48689, below81920 |

Fresh-artifacts terminal session5818 drained with exit0. The single full
make-check session7432 drained with exit0. No overlapping jobs or gate retries
were launched. The full gate used authorized network escalation for existing
pinned compiler dependencies; no dependency file changed. It includes Clippy
with warnings denied, format, source syntax/lint, fresh artifacts, full Rust,
Lykn suite and documentation ONCE. There was no extra docs target.

The full Rust run has0 failed/ignored/filtered in its42 results; the zero-test
umbrella/doc harnesses remain visible. Docs generated22 files/482 blocks with
15 existing harness skips, then482 tests passed. The JSR/mycelium tests retain
their own reachability/presence self-skip branches; no such self-skip message
was observed in this full log. This is not registry-publication evidence.

Focused native receipts independently show the first function's result2,
recursive normalized leaf/result1 with checked/stripped7, supported fragment8
and carrier7/99/before once. Earlier late-family92/41, ICU5 and host/completion41,
errors/effects/iterator lifecycle and source/raw boundaries also pass. CLI
checked/stripped .lykn/.lyk file and actual JS-kernel JSON consumers print
`7 7 ok`,8,12,8; package namespace is exactly pick and calls print7/ok. The
expected unused result0 compiler warning remains in CLI receipts. Focused
tests print source/generated output and runtime statuses/streams; invocation
templates and setups remain in the committed product test source, not a claim
that every subprocess argv was separately traced.

## M6 inner evidence

`m6/` contains independent existing-test receipts, including the actual
standalone compile command/status/source/generated module/stderr and public
command/config/status/stdout/stderr. The copied CLI is Cargo's test-profile
debug executable; it materializes embedded code in a per-test initially cold
TempDir XDG cache while reusing the explicit warm DENO_DIR. Its compile exits0.
The resolved macro executable is Deno2.9.6; its nested argv is explicitly not
separately traced. No blanket offline/no-npm assertion is made.

The public command is `deno test -A --cached-only --no-prompt --config ...`.
Its config points lang/ to the actual materialized package and browser/ to the
fresh staged browser output. It runs exactly these seven paths:

1. test/forms/embedded-adt-pattern.test.js
2. test/forms/surface-type-context.test.js
3. test/forms/reserved-binding-output.test.js
4. test/forms/icu-generated-names.test.js
5. test/expander/lexical-regions.test.js
6. test/forms/discard-bindings.test.js
7. test/forms/remaining-discard-bindings.test.js

Actual status is success/code0 and output70 passed/0 failed, with no skips.
The standalone fixture stderr has four unused-binding warnings (Option,
InnerValue, ZeroForms, value) and one unreachable-match warning. Public stderr
is empty. Every one of these14 comparison files was read; both equality flags
are true in each:

binding.js, classifier.js, compiler.js, compiler-private-atoms.js,
expander-core.js, function-clauses.js, host-invocation-kernel.js, identifier.js,
lexical-regions.js, protected-host.js, reserved-words.js, surface-helpers.js,
surface.js and surface-type-context.js.

## Profile, size and limits

Fresh optimized bin/lykn and target/release/lykn both hash SHA256
`65706edd021f5955c82249aa6eb1bae36a3eb3eb6a07d4fa19721224a45e1a8a`.
The test-profile target/debug/lykn hashes
`3372e0c917889e71d2bc9d7e124c691bd3cacd7841fee956c9fdf51e6b7857be`.
Optimized staged corpus/docs and debug CLI integration/M6 consumers are
distinct profiles of the same reviewed source.

Fresh size compares gzip27630 baseline with current48689 (+21059), below81920.
Its existing esbuild/astring package-condition warnings and registry metadata
Download lines are retained. The gate's outdated-dependency table is retained;
the validator's passing label is not a claim that every dependency is latest.

These are fresh independent final-source checks, not relabelled CC receipts.
Initial fa, held32749d97, their failures and AWEX remain historical. AWEX's
unchanged nested awaited-block expression path is not repaired by these passing
top-level tests. Public physical-name parity, escaped SOURCE/protected-root
identity, dynamic eval isolation and unordered ICU determinism retain their
explicit limits and owners. Root closing metadata/NH-08 remains pending.

Final process inventory: the default-sandbox `ps -Ao pid,ppid,command` query
reported `/bin/ps: Operation not permitted`. Its authorized read-only escalated
retry, filtered for make check/Cargo test or Clippy/Deno test or run/Lykn build
or test, returned exit1 with no matching output. This is an empty-match status,
not a failed product gate. All owned terminal sessions had already drained.
