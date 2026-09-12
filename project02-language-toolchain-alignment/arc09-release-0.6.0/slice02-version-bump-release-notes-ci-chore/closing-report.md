# arc09 slice02 — Version Bump, Release Notes, and CI Chore Closing Report

Status: **CC proposed-done; CDC pending**
Date: 2026-09-12
Source branch/worktree: `release/0.6.x` in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
Source commit: `65ff40fbcabbf3edab760947108f4a0d13ed9d99`
Planning branch/worktree: `planning` in `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

## Scope completed

slice02 prepared the committed 0.6.0 source release tree for dry-runs. The source commit:

- changed Rust workspace/package versions and local workspace dependency versions from `0.6.0-dev` to `0.6.0`;
- updated `Cargo.lock` local Lykn package entries to `0.6.0`;
- changed `@lykn/browser`, `@lykn/lang`, and `@lykn/testing` manifests to `0.6.0`;
- added `release-notes-0.6.0.md` as the draft release-note home;
- updated workflow checkout actions from v4 to v5;
- changed `make publish-dry-run` to use `cargo publish --dry-run` without `--allow-dirty`;
- committed the source changes with the required co-author trailer block.

## Source files changed

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

## Artifacts

- [build-and-validation-receipt.md](artifacts/build-and-validation-receipt.md)

## Validation

- `cargo check --workspace --all-targets`: passed.
- `make build`: passed.
- `./bin/lykn --version`: `lykn 0.6.0`.
- `./bin/lykn dist` plus generated `deno.json`/`package.json` metadata spot check: all three JS packages report `0.6.0`.
- `git diff --check`: passed before staging source files.
- `git diff --cached --check`: passed before source commit.
- `make check`: first sandbox-limited run failed with `PermissionDenied` while materializing embedded packages; rerun with filesystem escalation passed and ended with `✓ All checks passed (build + lint + test)`.

## Ledger row walk

| ID | Disposition | Evidence |
|----|-------------|----------|
| V-1 | done / CC-attested; CDC pending | Entry statuses recorded in [validation receipt](artifacts/build-and-validation-receipt.md#entry-status). |
| V-2 | done / CC-attested; CDC pending | `Cargo.toml` and `Cargo.lock` changed in source commit `65ff40f`; Cargo reported all three crates as `v0.6.0`. |
| V-3 | done / CC-attested; CDC pending | Three package manifests changed and dist metadata spot check reports `0.6.0` for generated JSR/npm metadata. |
| V-4 | done / CC-attested; CDC pending | `./bin/lykn --version` reported `lykn 0.6.0`. |
| V-5 | done / CC-attested; CDC pending | `release-notes-0.6.0.md` added from slice01 curated inputs. |
| V-6 | done / CC-attested; CDC pending | Checkout v5 applied; `make publish-dry-run` now uses `cargo publish --dry-run` without `--allow-dirty`. |
| V-7 | done / CC-attested; CDC pending | Escalated `make check` passed. |
| V-8 | done / CC-attested; CDC pending | Source commit `65ff40fbcabbf3edab760947108f4a0d13ed9d99` created with required trailers. |
| V-9 | done / CC-attested; CDC pending | This close packet updates arc09 status and opens slice03. |

## Bubble-up to the arc

slice02 delivered the arc-plan slice assignment: the exact release tree now has 0.6.0 version surfaces, draft release notes, CI checkout v5 maintenance, and a repaired no-bypass crates dry-run helper.

The slice resolved one hazard that slice01 had routed: `make publish-dry-run` no longer uses `--allow-dirty`. The remaining source-level release chore is the existing `make push` behavior, which is still intentionally left alone because publication, branch pushes, and tags are operator-owned later-slice boundaries. slice03 should run dry-runs from source commit `65ff40fbcabbf3edab760947108f4a0d13ed9d99` and should verify `make publish-dry-run` as part of crates dry-run evidence.

Scope-as-specified versus scope-as-delivered: all requested source version surfaces, release notes, CI checkout maintenance, no-bypass dry-run repair, source validation, source commit, and next-slice planning updates were delivered. No source publication, release tags, book tags, or branch pushes were performed.
