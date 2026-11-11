# Independent release verification receipts

Reviewer: separate Codex Sol 6.1 High context, 2026-11-11. Source home:
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, `release/0.6.x`, clean
`0829e892999890e8877dec5e35cd249753e1be5d`, tree
`d0f802ca4eb1847400c7395f1c203ada3263403b`.

`receipts.tar.gz` SHA-256:
`060351aee7bbb2905c8aedf74dc4d3632a3e000fa2d08acb78d3fcf26e2f8952`.
The archive contains bounded raw gate/process receipts, actual selected
environment/argv/cwd/status, the Lykn-authored capture and inspection helpers,
M6 product receipts and useful complete generated modules. It contains no
copied executable, package payload or dependency/XDG/npm cache.

| Archive path | Observation |
| --- | --- |
| `receipts/make-check/` | Fresh full release-worktree gate, exit 0. Build, lint, Clippy, format, Rust integrations, 1,170 language units, 1,500 corpus tests plus 67 steps, and 482 documentation blocks. Docs ran once. |
| `receipts/cited-paths/` | Fresh committed-HEAD citation check, exit 0, 64 documents/601 historical citations. |
| `receipts/browser-size/` | Fresh historical baseline/current measurement, exit 0; gzip 27,630/41,349 bytes, delta +13,719 within 80 KiB. Existing astring warnings and esbuild metadata download lines remain in stderr. |
| `receipts/m6-release/`, `m6/` | Cargo `--release --offline` M6 selector: 1 passed/5 filtered; cold standalone copied CLI, five delivery comparisons and two materialized public runtime tests pass. |
| `receipts/semantic-release/` | Cargo `--release --offline` semantic roles: 56 passed, zero ignored/filtered. Actual native compilation/runtime assertions include recursive ADTs, private-name macros, sequencing and finite protected/guard/scope/transfer controls. |
| `receipts/direct-*-compile/`, `receipts/direct-*-runtime/`, `standalone/` | Full-gate installed binary copied into standalone cwd; second cold owned XDG materialization; ADT-plus-macro trigger and hygiene source compile/run, all exit 0; runtime stderr empty. |
| `direct-verification.json`, `verify-direct.lykn` | Exact two native outputs compared against committed product-fixture expectations (ADT has additional macro trigger output `42`); all five canonical/embedded/materialized modules compare equal. |
| `pins.json`, `receipts/final-pins/` | Actual final release/task clean head/tree, exact fast-forward reflog, 0/2 ancestry, scoped commit trailers, tool versions and executable hashes. |
| `run.lykn`, `pins.lykn` | Reviewer-authored process capture and pin inspection; `.js` siblings are compiler-generated output. |

Execution home was `/private/tmp/lykn-s02-release-cdc-0829e892`.
Gate invocations explicitly used existing
`DENO_DIR=/Users/oubiwann/Library/Caches/deno`, fresh owned `npm`/`xdg`/`tmp`
subdirectories and `npm_config_cache`. Direct installed-binary replay used
the separate initially empty `direct-xdg` directory and a standalone cwd
without `packages/lang`. M6 creates its own additional cold owned fixture.
No dependency file or user cache ownership was changed.

The source workdir selects Rust/Cargo 1.97.0; Deno is 2.9.6, Node 26.9.0 and
npm 11.19.1. The full-gate installed `bin/lykn` and its direct standalone copy
both hash `93af1484ea34ed7dd6a19f3ee8be59f9b2ab5f88899e5450df1bb2505695756b`.
After focused Cargo release-profile tests, `target/release/lykn` hashes
`5bed8cb5a1611d6caecde8cb3e368ed80af970ad98a3c76f531b94480355b8df`;
the full gate's debug artifact hashes
`cce92b2ce68e416585835c043a4088a58d8a4c43bbbb01169730b5efda338376`.
These build variants are distinct, with the same clean committed source.
M6's copied CLI comes from its Cargo-provided `CARGO_BIN_EXE_lykn`; its
per-process launch receipt identifies the actual standalone path.

No required gate or runtime failed in this release review. Existing helper
compilation unused-binding warnings are session observations, not fabricated
archived raw diagnostics. An incidental process-list diagnostic was sandbox
denied and supplied no validation evidence. Prior task-source failed attempts
and original evidence stay in their existing archives; none is reconstructed
here. The task-source independent acceptance remains pinned to its original
source/evidence, separately from these fresh release-worktree observations.

Scope remains S02: no general protected early-return acceptance (Arc01 S04
I4/CV-03 and related composition rows retain ownership), no stronger selective
read guarantee for historical unregistered patterns, and no same-version warm
cache content invalidation. Qualified/nominal ADTs, later emission experiments,
composition/re-pin, API/docs/book/human gates and remote actions remain outside
this release verdict.
