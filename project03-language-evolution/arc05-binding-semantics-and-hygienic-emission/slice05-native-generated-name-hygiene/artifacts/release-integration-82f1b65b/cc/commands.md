# CC release command receipt — 82f1b65b

Worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, branch
`release/0.6.x`, clean HEAD `82f1b65b92529979afd6c624183912ca31453927`,
tree `4bb6bfc9e171bc6424548b0f740dd32f0cf98c75`.
Private roots: `XDG_CACHE_HOME=/private/tmp/lykn-release-82f1b65b-cc/xdg`,
`TMPDIR=/private/tmp/lykn-release-82f1b65b-cc/tmp`,
`NPM_CONFIG_CACHE=/private/tmp/lykn-release-82f1b65b-cc/npm`; shared
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`.

Commands ran serially in this order, with complete stdout/stderr and numeric
status files beside this index:

1. `make fresh-artifacts` — exit 0; `fresh-artifacts.stdout.log`,
   `.stderr.log`, `.status`.
2. `cargo test --release -p lykn-cli --test generated_name_hygiene --test discard_declarations -- --nocapture`
   with the cache variables above and
   `LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR=<absolute cc/focused/discard>` —
   exit 0; `focused.stdout.log`, `.stderr.log`, `.status`, plus actual inner
   CLI/Deno command, status, stdout/stderr and generated declaration receipts.
   Actual selected groups: generated-name hygiene 2/2 and discard declarations
   4/4. CARGO_BIN_EXE_lykn is from the optimized release test profile.
3. One `make check` with the same cache variables,
   `LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR=<absolute cc/m6-final>` (precreated),
   and `LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR=<absolute cc/full/discard>` —
   exit 0; `full.stdout.log`, `.stderr.log`, `.status`. The tool command ran in
   session 88633 and was drained with final numeric exit 0. Authorized network
   escalation was used for existing pinned dependency availability; no
   dependency changed. Docs were included once by this command.
4. `make check-cited-paths` at final release HEAD with the same cache roots —
   exit 0; `cited.stdout.log`, `.stderr.log`, `.status`.
5. Fresh `make bundle-size-check` at final release HEAD with the same cache
   roots — exit 0; `size.stdout.log`, `.stderr.log`, `.status`.

The full run used Cargo test profile for the Rust workspace and M6's copied
standalone CLI. `make fresh-artifacts` and focused optimized CLI tests used the
release profile; normal corpus/docs wrappers used freshly copied `bin/lykn`.
`binary-sha256.txt` records the two optimized installed binary paths.
