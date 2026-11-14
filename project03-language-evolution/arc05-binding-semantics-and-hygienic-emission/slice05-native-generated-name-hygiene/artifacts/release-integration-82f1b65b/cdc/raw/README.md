# Independent release command receipts

2026-11-14, separate Sol6.1 High `/root/arc05_s05_cdc`.
All commands ran from `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`,
`release/0.6.x`, clean82f1b65b92529979afd6c624183912ca31453927/tree
4bb6bfc9e171bc6424548b0f740dd32f0cf98c75. Direct command-tool results and
terminal session handles were retained in the review transcript. Logs combine
stdout/stderr by direct shell redirection; no processing helper was authored.

Common explicit environment for every gate:

- DENO_DIR=/Users/oubiwann/Library/Caches/deno (shared warm cache)
- XDG_CACHE_HOME=/private/tmp/lykn-release-82f1b65b-cdc/xdg
- TMPDIR=/private/tmp/lykn-release-82f1b65b-cdc/tmp
- NPM_CONFIG_CACHE=/private/tmp/lykn-release-82f1b65b-cdc/npm

Private roots and the absolute evidence directories were precreated before
execution. Commands were serial in this order:

| Log | Direct command | Tool exit/session |
| --- | --- | --- |
| 01-fresh-artifacts.log | make fresh-artifacts |0 |
| 02-focused-optimized-cli.log | cargo test --release -p lykn-cli --test generated_name_hygiene --test discard_declarations -- --nocapture |0; session21395 drained0; hygiene2/declarations4 |
| 03-make-check.log | make check |0; session14695 drained0; docs once |
| 04-final-cited-paths.log | make check-cited-paths |0;64 documents/601 historical citations |
| 05-fresh-bundle-size.log | make bundle-size-check |0;gzip48689 below81920 |

Focused additionally set LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR to this
directory's absolute focused-discard/ path. Full additionally set
LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR to absolute full-discard/ and
LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR to absolute m6-final/ BEFORE make started.
Both use existing product-test receipt hooks. The full invocation used the
authorized existing-dependency network escalation. No failed invocation, retry,
extra docs target or overlapping owned job occurred.

Full Rust output has42 results/1798 passed,0 failed/ignored/filtered, including
the lykn-lang1217-case library harness. Lykn1578/67steps and docs482 passed;
docs22 generated files/15 harness skips and nine no-block inputs remain
distinct. Clippy/format/source lint188 passed. JSR/mycelium self-skip branches
remain; their explicit skip messages were not observed in this log.

m6-final/ contains actual inner commands/config/status/output/source/generated
and all14 comparison receipts. Compile0; public0/70passed/0failed; seven
selected product paths; all14 have both equality flags true. Public stderr is
empty; inner compile has four unused-binding warnings and one unreachable
match warning. Deno resolves2.9.6; macro-child argv is explicitly untraced.
Cold per-test XDG materialization reuses warm DENO_DIR; no blanket offline or
publication claim follows.

binary-sha256.txt identifies optimized bin/lykn and target/release/lykn versus
the default test-profile target/debug/lykn. Optimized CLI tests use Cargo's
CARGO_BIN_EXE_lykn; full Rust/M6 uses the separate default test-profile route;
corpus/docs uses refreshed optimized bin/lykn. Size retains two esbuild
registry Download lines and four existing astring condition warnings.
Expected unused-binding warnings, TS2345 and invalid-export negative statuses
remain in focused logs/receipts. See the owning RI record for final row verdict.
