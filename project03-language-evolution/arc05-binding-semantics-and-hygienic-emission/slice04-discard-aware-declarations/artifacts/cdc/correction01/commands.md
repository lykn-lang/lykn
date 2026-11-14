# Independent correction01 command receipts

2026-11-14, separate Sol reviewer `/root/arc05_s04_cdc`. All commands completed
naturally with the numeric status in the adjacent `status.txt`. Raw stdout and
stderr are preserved separately and never overwritten. Status values were
recorded from actual tool completion, not inferred from the log text.

Source cwd: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`.
Actual clean HEAD throughout execution:
`c0ed454610f3a384196e4fa003335373819fb2fd`, tree
`7d8b3359fa570b2e8322996dbe8b648f02af58da`, parent
`918f2e9c4237770fc7b2e0e950d726e735e95198`. Release remains
`c60dea62d126bb07557a7f4f7183662dec3f6a58`.

Every command used these explicit environment assignments:

```text
DENO_DIR=/Users/oubiwann/Library/Caches/deno
XDG_CACHE_HOME=/private/tmp/lykn-arc05-s04-cdc/correction01/xdg
TMPDIR=/private/tmp/lykn-arc05-s04-cdc/correction01/tmp
NPM_CONFIG_CACHE=/private/tmp/lykn-arc05-s04-cdc/correction01/npm
```

The cache roots were newly owned for this independent correction run; DENO_DIR
is intentionally shared and warm. No uncached registry-success claim follows.

| Receipt home | Exact invoked command after `env` assignments | Extra environment | Actual status |
| --- | --- | --- | --- |
| fresh | `make fresh-artifacts` | none | 0 |
| focused | `cargo test -p lykn-cli --test discard_declarations -- --nocapture` | `LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR=<this home>/focused/cli` | 0 |
| full | `make check` | `LYKN_DISCARD_DECLARATIONS_EVIDENCE_DIR=<this home>/full/cli`; `LYKN_MACRO_DEPENDENCIES_EVIDENCE_DIR=<this home>/full/m6` | 0 |
| cited | `make check-cited-paths` | none | 0 |
| size | `make bundle-size-check` | none | 0 |

`<this home>` expands to the absolute canonical directory containing this file:
`/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project03-language-evolution/arc05-binding-semantics-and-hygienic-emission/slice04-discard-aware-declarations/artifacts/cdc/correction01`.
Each command redirected stdout/stderr to its corresponding home. There was one
independent full check, documentation ran once within it, and its M6 receipts
were captured in that same invocation. No separate M6 or native32 rerun occurred.

## Source and metadata observations

Native `git hash-object -t commit` reproduced original
`8ed7761e834583c7c524783d7614ffb7c53a1420` and replacement
`c0ed454610f3a384196e4fa003335373819fb2fd` from the saved raw objects in
`artifacts/root-metadata01/`. Each saved object compared byte-for-byte equal to
`git cat-file commit` output (both cmp exits0). Native diff showed only removal
of the inter-trailer blank line; tree, parent, identities and epoch1794678409
-0600 author/committer dates match. `git diff --exit-code 8ed c0ed` exited0.
Only the test file differs from reviewed918; the full c60-to-final delivery has
exactly its original four paths. No reviewer Git/index mutation occurred.

After final size, `shasum -a 256` reported:

```text
b732f4c38526b8158fea2e2d7adb606ae6bf80331e78998712a1f9f4b58097ad  bin/lykn
b732f4c38526b8158fea2e2d7adb606ae6bf80331e78998712a1f9f4b58097ad  target/release/lykn
7d9244563bce48538e7d5206f0808034d32628ad5e41c3c80e1c3af674da696d  target/debug/lykn
```

The focused/full Rust integration tests execute the debug CLI through
CARGO_BIN_EXE_lykn, as their saved actual child commands show. M6 copies that
built CLI to its standalone directory. Make product/docs wrappers use installed
bin/lykn (optimized release bytes above). This run does not relabel the Rust
integration suite or standalone M6 as optimized-profile semantic execution.
