# Local S12/S13 release integration — 2026-11-10

Operator authorized local fast-forward to exact accepted task
`31893710bbba8999e936fade2d79ae6f6aee929c` and continuation
into remaining S04/I2. The root coordinator executed the merge.
Sol 6.1 High CDC independently verified the release checkout and
ran the normal gate set. The accepted S13 Luna 6 High CC proof
remains separately attributed in [slice verification](../cdc-verification.md).

- Release branch `release/0.6.x` in `.worktrees/0.6.x` moved
  from `7b17a7841cc4d749276467ec2bcec7ed9faed7b2` to the
  accepted source. The reflog reports the exact fast-forward.
  Before/after ancestry is 0/9 and 21 paths. Current tree
  `3a5e2505d991896016fb1a20070487325c37d19c` matches the task.
  Tracked/index comparisons are clean.
- Full normal `make check` and standalone `make check-cited-paths`
  both exit 0. Clippy and format pass, with 1,166 native library
  tests, 1,485 JS/Lykn tests and 44 steps, and 482 docs cases.
  Standalone cites cover 64 documents and 601 historical entries.
- Release `bin/lykn` and `target/release/lykn` are byte-identical,
  SHA-256 `cb66a975e8b8fb31852f2e876b5775d58b2b34468778f705f690e7ce73eab6c5`.
  This is the actual release-path build. All three canonical,
  embedded and fresh materialized files match, and full embedded
  package comparison exits 0.
- [Raw release evidence](evidence/cdc/release-31893710/) retains
  exact prospective commands, named config checks, separate
  stdout/stderr and exit codes. All 48 named config paths were
  absent. Fresh config-free /private/tmp TMPDIR/XDG/npm roots,
  fixed DENO_DIR, ordinary PATH, Deno 2.9.6 and Rust/Cargo 1.97.0
  were used without a test Deno override.
- Scoped planning prose passes the whitespace check. The full
  archive check reports one original blank EOF in Make stdout.
  The raw file retains its exact bytes.

This is local integration. Wider consumed completion, I3, I4,
CV-04 and CI-04 remain open.
