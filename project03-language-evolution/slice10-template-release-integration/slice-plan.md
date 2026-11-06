# Slice10: template repair release integration

Opened 2026-11-06. Status: open. Standalone collapsed slice, consistent with
Project03's existing slices; no new arc or broader project authorization.

## Authority, roles and endpoint

Operator: “Agreed, let's merge the template repair into release/0.6.x and do the
validation and independent review. Same models, Autonomous Mode :-D”. CDC
`/root/cdc` uses OpenAI Sol 6.1 High; one fresh CC uses OpenAI 6 Luna High.
Root is transport/read-only support. Two-contributor workflow: CC executes and
attests; CDC independently verifies actual integration and gates, closes rows
and writes the retrospective. Five correction iterations maximum, retaining
failed/unrun attempts. Endpoint is this local integration's acceptance or an
honest validation stop. Do not open another unit.

Planning home: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch
`planning`, initial ec9e209038762a2662fe546f420a8f3fc2653cd0. Source target:
`/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`, `release/0.6.x`, initial
 ae51223089def7b7b3498519d9f51283b3a6065b. Explicit integration authority permits
this existing release checkout; no new product authoring or task branch is
needed. CDC owns planning/index until dispatch; CC then solely owns release
and its index plus this slice's results/closing report/evidence and ledger
attestations. CDC/root remain read-only until ownership returns. Other source
homes stay unchanged.

## Exact accepted input and merge prediction

Merge accepted repair a061c2149792178ba037d17a31220545e34b4ac1, not planning.
Task branch `codex/template-string-boundary` currently ends at
bc83b43cc9084d0eddb910c73497cef0f9c43179 (AGENTS-only successor). Both homes
already share the no-Python policy. Revalidated `git merge-tree --write-tree
--name-only <target> <repair>` predicts clean tree
572bc953a053c34cf4ded4520c36d12e7657c2c3, byte-identical to the whole current
task tree. Revalidate immediately before merge. Target-relative changes:

- crates/lykn-cli/tests/template_string_boundary.rs
- crates/lykn-lang/embedded/packages/lang/compiler.js
- crates/lykn-lang/src/codegen/emit.rs
- packages/lang/compiler.js
- test/fixtures/template-string-boundary/P1-backslash-n.lykn
- test/fixtures/template-string-boundary/P2-backslash-quote.lykn
- test/fixtures/template-string-boundary/P3-line-feed.lykn
- test/fixtures/template-string-boundary/P4-carriage-return.lykn
- test/fixtures/template-string-boundary/P5-backslash-backtick-dollar.lykn
- test/fixtures/template-string-boundary/P6-tag-raw.lykn
- test/forms/tag_test.lykn
- test/forms/template-escape-convergence_test.lykn
- test/forms/template-string-boundary.test.js

AGENTS, Cargo.lock, Cargo.toml, Makefile and frozen citation census must remain
unchanged relative to target. Cargo.lock SHA256 is
672c8bf62e441cfaa6ec22bd511d55e002812d8f18814faea0e99d4c5e2813ce.
Use non-fast-forward local merge with real multiline message and both contiguous
co-author trailers; no amend/rebase. Merge mechanics are the explicit-path
exception: clean index, exact parent/tree/path checks before and after instead.
No non-sample executable hooks or core.hooksPath were found; recheck. Local
operations trigger no hosted CI; do not push or run remote workflows.

## Validation method and predictions, before execution

Use actual source-cwd tools: rust-toolchain.toml selects installed Rust/Cargo
1.97.0, not outer-cwd 1.99.1; Deno /opt/homebrew/bin/deno 2.9.6. Record actual
versions and hashes. Never use global/bare lykn. Build target's own absolute
`target/release/lykn`, hash it and `bin/lykn`; do not assume task binary hash
544041ecf2ff61a9b1b3338ed08728a12db549a69dbcadfa644a30d39bfb908a carries over.

1. Inspect accepted Slice08 source diff and its independent verification,
   including six shared fixtures/22 native and 22 public-JS observations,
   concat/ICU/tag raw/cooked and canonical/embedded mirror parity. Integration
   must preserve exactly these bytes; no source repair in this assignment.
2. Confirm cargo-binstall/outdated/llvm-cov already available before canonical
   gate (no automatic installer). Prefer cached offline/locked bootstrap if
   needed. Do not update dependencies or change toolchain/lock. Do not impose
   offline mode on `check-deps`' required metadata query.
3. Run unfiltered `make check` from release, with explicitly owned isolated
   `npm_config_cache=$release/target/slice10/cc/npm-cache`, fresh
   `XDG_CACHE_HOME=$release/target/slice10/cc/xdg-cache`, fixed
   `DENO_DIR=/Users/oubiwann/Library/Caches/deno`. Keep default Cargo target.
   Make already includes docs; do not append redundant docs run. Existing
   publishing compatibility tests execute npm pack --dry-run; this is existing
   validation, not new dependencies or research Node tooling. Do not hide PATH,
   filter tests, add permission/force/skip flags or modify HOME/global caches.
4. Run committed `make check-cited-paths` and focused native regression
   `cargo test --offline --locked -p lykn-cli --test template_string_boundary
   -- --nocapture`. Full Make must include the public-JS test. Inspect actual
   output selection/counts, not just exit0. Expected prior conditions: native
   22 observations, public-JS22, JS/Lykn1467 tests and docs482; report actual
   Rust suites and totals, warnings/failures/unruns without fitting predictions.
5. Compare canonical and embedded compiler.js and the compiler.js actually
   materialized under the fresh owned XDG cache after existing macro tests.
   Expected SHA25650db21ce3d1f30325e9541c284cb37ffdc3f6e93bad55521a26cd6b4734ac1f4.
   Same-version global cache (NE-C04) must not mask integration. If needed use
   existing focused template-escape-convergence_test.lykn route after fresh
   artifacts with exact absolute release binary; no invented eval/helper.
6. Keep exact commands/env/cwd/exits, raw outputs, source and binary pins under
   this slice's artifacts/evidence/cc (generated build/cache stays ignored
   target). Preserve every distinct failure and actual attempts before retry.
   CDC independently rechecks ancestry/tree/13-path equality and runs its own
   full release `make check` plus affected citation/native witnesses with
   separate owned caches, reconciling actual materialized bytes and conditions.

No Python execution or authored Python is permitted, including historical
oracles: there is no parity exception. All authored helper/script/orchestration/
validator/evidence/JSON/command-construction logic must be Lykn, never Python,
Ruby, Fennel, handwritten JavaScript/Node or another replacement scripting
language. Native shell/CLI is only for direct invocation and simple filesystem
lifecycle. Existing accepted Slice09 Lykn helpers may be reused if needed;
no new harness is needed for these native commands. Generated output stays in
ignored target paths. Every new iteration prompt repeats this policy.

## Stop and carryovers

If identity/cleanliness/tree differs, halt mutations and report exact mismatch.
If required validation fails, retain raw failure and diagnose only enough to
identify gate/environment versus source; safe owned cache setup is allowed.
No compiler fixes, lock updates, test filtering, skipped validation, permission
bypasses, global installs, other release propagation, publishing or push. A real
out-of-scope source repair remains a disclosed stop. Prior accepted Slice08
5/5 bundles and11/11 runtimes remain their original bounded pilot evidence;
this integration neither repeats nor enlarges it. Preserve Slice01 F1–F12,
Project07 licence/bootstrap/library/final-report/ADT/book/human gates and
BACKLOG NE-C02/04/05/06 and NE-D01. No audit execution or new scope follows.
