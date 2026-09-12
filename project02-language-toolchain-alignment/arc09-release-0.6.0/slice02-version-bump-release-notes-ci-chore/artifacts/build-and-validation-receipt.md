# arc09 slice02 Build and Validation Receipt

Date: 2026-09-12
Source worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
Source branch: `release/0.6.x`
Source commit: `65ff40fbcabbf3edab760947108f4a0d13ed9d99`

## Entry status

- `git status --short --branch` before source edits: `## release/0.6.x`.
- Planning worktree before planning close edits: `## planning`.
- Book worktree: `## main` plus pre-existing untracked `_to_delete/`.
- Writers-guide worktree: `## main`.

## Version evidence

- `Cargo.toml` workspace package version: `0.6.0`.
- `Cargo.toml` local workspace dependency versions: `lykn-lang = 0.6.0`, `lykn-cli = 0.6.0`.
- `Cargo.lock` local package entries: `lykn`, `lykn-cli`, and `lykn-lang` at `0.6.0`.
- JS package manifests:
  - `packages/browser/deno.json`: `@lykn/browser` `0.6.0`
  - `packages/lang/deno.json`: `@lykn/lang` `0.6.0`
  - `packages/testing/deno.json`: `@lykn/testing` `0.6.0`
- `rg -n '0\.6\.0-dev'` over the source worktree found no remaining matches.

## Build and CLI evidence

- `cargo check --workspace --all-targets`: passed; Cargo reported `lykn-lang v0.6.0`, `lykn-cli v0.6.0`, and `lykn v0.6.0`.
- `make build`: passed.
- `./bin/lykn --version`: `lykn 0.6.0`.

## Dist package metadata spot check

After `./bin/lykn dist`, generated metadata reported:

```text
target/lykn/dist/browser/deno.json: @lykn/browser 0.6.0
target/lykn/dist/browser/package.json: @lykn/browser 0.6.0
target/lykn/dist/lang/deno.json: @lykn/lang 0.6.0
target/lykn/dist/lang/package.json: @lykn/lang 0.6.0
target/lykn/dist/testing/deno.json: @lykn/testing 0.6.0
target/lykn/dist/testing/package.json: @lykn/testing 0.6.0
```

## CI and publish-dry-run chore evidence

- `.github/workflows/ci.yml`, `.github/workflows/consumer-smoke.yml`, and `.github/workflows/deno-compat.yml` now use `actions/checkout@v5`.
- The current upstream `actions/checkout` documentation/changelog was checked on 2026-09-12. It shows v5 as a Node 24 checkout release with a minimum runner version; the slice applied the explicit v4 to v5 chore rather than widening scope to newer major versions.
- `Makefile` `publish-dry-run` now runs `cargo publish -p $$crate --dry-run` without `--allow-dirty`, preserving Cargo's dirty-tree gate.
- The remaining `--allow-dirty` strings are the intentional CLI/docs opt-in publish safety boundary:
  - `crates/lykn-cli/src/main.rs`
  - `docs/guides/15-lykn-cli.md`

## Full validation

- First sandbox-limited `make check`: failed in the Lykn syntax phase with `PermissionDenied` while materializing embedded packages. This was treated as a sandbox/file-materialization failure, not source validation evidence.
- Escalated `make check`: passed. The successful run completed dependency freshness, cited-path check, release build, clippy, format, Lykn syntax, Lykn lint, Rust tests, full JS/Lykn test suite, and documentation tests. Final line: `✓ All checks passed (build + lint + test)`.

## Source commit

```text
65ff40fbcabbf3edab760947108f4a0d13ed9d99 Prepare 0.6.0 release tree
```

Committed source files:

```text
.github/workflows/ci.yml
.github/workflows/consumer-smoke.yml
.github/workflows/deno-compat.yml
Cargo.lock
Cargo.toml
Makefile
packages/browser/deno.json
packages/lang/deno.json
packages/testing/deno.json
release-notes-0.6.0.md
```
