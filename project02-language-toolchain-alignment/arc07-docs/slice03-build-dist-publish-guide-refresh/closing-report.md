# Slice 03 Closing Report: build-dist-publish-guide-refresh

Date: 2026-08-08
Status: Closed

## Summary

Slice 03 refreshed the release-branch build/dist/publish guidance to match the
current CLI contract:

- `lykn build` writes intermediate artifacts under `target/lykn/build/`.
- `lykn dist` stages publishable packages under `target/lykn/dist/`.
- `lykn build --dist` is retained only as a deprecated alias where documented.
- `lykn publish --no-build` assumes `target/lykn/dist/` is already staged.
- `lykn publish` refuses dirty trees unless `--allow-dirty` is explicit.

The implementation touched only the scoped SKILL/guides, the stale publish
error string, the three backlog rows named by the slice, and arc/slice close
artifacts. Guides 12-01, 12-02, and 12-03 were not edited; their Deno workflow
reconciliation remains slice04.

## Substrate Loaded

Before editing, CC loaded:

- `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/closing-report.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/cdc-verification.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/slice-doc.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/ledger.md`
- `assets/ai/SKILL.md`
- `docs/guides/10-project-structure.md`
- `docs/guides/12-deno/12-04-publishing.md`
- `docs/guides/15-lykn-cli.md`
- `docs/backlog/discoveries.md`
- `crates/lykn-cli/src/main.rs`

CC also checked the live command surface:

- `./bin/lykn build --help`: build output is `target/lykn/build/`; `--npm`
  and `--dist` are deprecated aliases.
- `./bin/lykn dist --help`: dist stages packages into `target/lykn/dist/`.
- `./bin/lykn publish --help`: `--no-build` assumes `target/lykn/dist/`;
  `--allow-dirty` overrides the dirty-tree safety gate.
- `git ls-files dist`: no tracked root `dist` entries.
- `test ! -e dist`: no filesystem root `dist` path exists.

## Changes

- `assets/ai/SKILL.md` now teaches `lykn dist` as publish staging, keeps
  generated files generated, and avoids telling agents to run raw Deno
  lint/format over generated `target/lykn/` output.
- `docs/guides/10-project-structure.md` now shows the reference workspace
  layout with `target/lykn/build/` and `target/lykn/dist/`, not repo-root
  `dist/`.
- `docs/guides/12-deno/12-04-publishing.md` now routes JSR/npm publishing
  through `lykn publish` and `lykn dist`, with direct `deno publish` and
  `npm publish` kept only as counter-cues.
- `docs/guides/15-lykn-cli.md` now documents `lykn build`, `lykn dist`,
  `lykn publish --no-build`, `lykn publish --allow-dirty`, the dirty-tree
  gate, and the deprecated `lykn build --dist` alias.
- `crates/lykn-cli/src/main.rs` now reports missing publish staging as
  `target/lykn/dist/...` and recommends `lykn dist`.
- `docs/backlog/discoveries.md` closes `D-2607-6BQX` and `D-2607-V5DK`, and
  marks `D-2607-2FHM` as no-op because no root `dist` debris exists.

## Ledger Walk

| ID | Result | Evidence |
|----|--------|----------|
| B-1 | closed | Required context and live CLI help loaded before edits. |
| B-2 | closed | SKILL publishing workflow now uses `lykn dist`; stale primary workflow sweep returned no hits. |
| B-3 | closed | Guide 15 matches live help for build/dist/publish, including `--no-build`, `--allow-dirty`, and dirty-tree behaviour. |
| B-4 | closed | Guide 12-04 uses `lykn publish`/`lykn dist`; direct registry commands remain counter-cues only. |
| B-5 | closed | Guide 10 reference layout and conventions now use `target/lykn/{build,dist}`; direct stale layout sweep returned no hits. |
| B-6 | closed | Publish error string now names `target/lykn/dist/` and recommends `lykn dist`; Rust gate passed. |
| B-7 | closed | `git ls-files dist` returned empty and `test ! -e dist` passed; backlog row marked no-op. |
| B-8 | closed | The three discovery rows have final statuses matching the slice outcome. |
| B-9 | closed | Diff stayed within slice scope; guides 12-01, 12-02, and 12-03 were not edited. |
| B-10 | closed | `make test-docs`, `make check-cited-paths`, `cargo test -p lykn-cli`, and `git diff --check` passed. |

## Verification

Commands run:

```sh
./bin/lykn build --help
./bin/lykn dist --help
./bin/lykn publish --help
git ls-files dist
test ! -e dist
make test-docs
make check-cited-paths
cargo test -p lykn-cli
git diff --check
```

Results:

- `make test-docs`: 476 passed, 0 failed.
- `make check-cited-paths`: passed.
- `cargo test -p lykn-cli`: passed.
- `git diff --check`: clean.

## Deferrals

- Slice04 still owns the broader Deno workflow reconciliation in
  `docs/guides/12-deno/12-01-runtime-basics.md`,
  `docs/guides/12-deno/12-02-testing.md`, and
  `docs/guides/12-deno/12-03-task-runner.md`.
- The no-else `if` compiler defect remains routed to arc10 slice04 and was not
  papered over in this docs slice.
- A first-class `.d.ts` documentation pass remains a later candidate pending an
  artifact-producing fixture.
