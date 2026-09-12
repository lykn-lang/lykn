# Version Surface Inventory — 0.6.0 Release Readiness

Date: 2026-09-12
Source branch/worktree: `release/0.6.x` at `d0bb981dae2a4abf6c984406c4b2081a45cc92f8`
Planning branch/worktree: `planning`

## Current branch and tag state

- `release/0.6.x` is the source branch for the 0.6.0 release cut.
- `git branch -vv` shows no upstream for local `release/0.6.x`; release push commands must name the intended remotes and branch explicitly.
- Configured remotes in the source worktree are `macpro`, `github`, and `codeberg`.
- Existing local language tags are `0.1.0`, `0.2.0`, `0.3.0`, `0.4.0`, `0.4.1`, `0.5.0`, `0.5.1`, and `0.5.2`.
- The next language release tag is `0.6.0`.
- The book repository currently has no local tags. Its current version page says the v0.6 edition release artifacts are published from `book-v0.6.0` when the 0.6.0 release is cut.

## Rust version surfaces

| Surface | Current value | Release action |
| --- | --- | --- |
| `Cargo.toml` `[workspace.package].version` | `0.6.0-dev` | Change to `0.6.0` in the version-bump slice. |
| `Cargo.toml` `[workspace.dependencies].lykn-lang.version` | `0.6.0-dev` | Change to `0.6.0` with workspace package version. |
| `Cargo.toml` `[workspace.dependencies].lykn-cli.version` | `0.6.0-dev` | Change to `0.6.0` with workspace package version. |
| `crates/lykn/Cargo.toml` | `version.workspace = true` | No direct package version edit; verify `cargo package` metadata resolves to `0.6.0`. |
| `crates/lykn-cli/Cargo.toml` | `version.workspace = true` | No direct package version edit; verify CLI reports `lykn 0.6.0`. |
| `crates/lykn-lang/Cargo.toml` | `version.workspace = true` | No direct package version edit; verify package metadata resolves to `0.6.0`. |
| `Cargo.lock` local package entries | `lykn`, `lykn-cli`, `lykn-lang` at `0.6.0-dev` | Regenerate/update so local package entries read `0.6.0`. |

The current CLI version check from the source worktree is `./bin/lykn --version` → `lykn 0.6.0-dev`; the version-bump slice must rebuild and record `lykn 0.6.0` before dry-runs.

## JavaScript/JSR package version surfaces

| Surface | Current value | Release action |
| --- | --- | --- |
| `packages/browser/deno.json` | name `@lykn/browser`, version `0.6.0-dev`, export `./mod.js`, Lykn kind `tooling` | Change version to `0.6.0`; verify generated JSR/npm package metadata. |
| `packages/lang/deno.json` | name `@lykn/lang`, version `0.6.0-dev`, exports `./mod.js`, `./reader.js`, `./compiler.js`, `./expander.js`, `./surface.js`, Lykn kind `runtime` | Change version to `0.6.0`; verify generated JSR/npm package metadata. |
| `packages/testing/deno.json` | name `@lykn/testing`, version `0.6.0-dev`, export `./mod.lykn`, Lykn kind `macro-module`, `macroEntry` `mod.lykn` | Change version to `0.6.0`; verify generated JSR/npm package metadata and stub generation. |
| `project.json` | workspace and import-map root; no project package version | No version edit expected; verify workspace package discovery still finds the three package manifests. |
| `deno.lock`, `packages/lang/deno.lock` | lockfiles only | Update only if the version-bump/build path changes them. |

The generated npm `package.json` files live in the dist tree and must not be hand-edited. Verify them after `lykn dist` or `lykn publish --dry-run` builds the release staging tree.

## Documentation and release-note surfaces

| Surface | Role | Release action |
| --- | --- | --- |
| `README.md` | public package overview, examples, install/publish guidance, badges | Check examples for `0.6.0-dev` remnants and update release-facing version references where appropriate. |
| `docs/guides/12-deno/12-04-publishing.md` | JSR/npm publishing guide | Confirm commands match the release runbook and dirty-tree boundary. |
| `docs/guides/15-lykn-cli.md` | CLI publish/dist reference | Confirm commands match the release runbook and dirty-tree boundary. |
| release notes / changelog home | user-visible 0.6.0 notes | Create or update the 0.6.0 release-note artifact in the version-bump slice from `0.5.2..HEAD` inputs. |
| book `src/book-versions.md` | v0.6 edition tag reference | Confirm `book-v0.6.0` tag is cut only after the language release and book publish boundary is satisfied. |
| book front matter/theme | visible v0.6 edition label | No release-blocking edit found; verify before book tag. |

## CI and publishing command surfaces

| Surface | Current behavior | Release action |
| --- | --- | --- |
| `.github/workflows/ci.yml` | `actions/checkout@v4`; Rust toolchain `1.97.0`; Deno `v2.x` and bundle-size `v2.7.7`; publishing job runs `make test-publishing` | Route checkout v5/Node-20 action maintenance into the version-bump slice if it remains a low-risk release chore. |
| `.github/workflows/consumer-smoke.yml` | manual workflow; schedule disabled; checkout v4 | Same CI maintenance route; do not make consumer-smoke existence a release blocker. |
| `.github/workflows/deno-compat.yml` | Deno matrix `2.3.1`, `2.x`, `canary`; checkout v4 | Preserve the Deno 2.3.1 floor; route checkout maintenance. |
| `Makefile` `publish-jsr`/`publish-npm` | invokes `lykn publish --jsr` / `--npm` | Release publication route after dry-runs and operator approval. |
| `Makefile` `publish-crates` | prompts, publishes crates in order `lykn-lang`, `lykn-cli`, `lykn`, and handles rate limits/already-exists | Operator-owned publication route; record transcript. |
| `Makefile` `publish-dry-run` | loops `cargo package -p $$crate --allow-dirty --list` | Do not use as release evidence in current form. Either repair it in slice02/03 or use direct no-bypass `cargo publish -p <crate> --dry-run` / `cargo package -p <crate> --list` commands from a clean tree. |
| `make push` | source Makefile pushes `main` and tags to each remote | Do not use as the release branch push recipe unless it is corrected. The runbook uses explicit `git push <remote> release/0.6.x` plus explicit tag pushes. |

## Fixture and non-release version strings

Test fixtures with version `0.0.1` are not release package surfaces. Treat them as fixture data unless a release-note or package-audit step proves otherwise.
