# 0.6.0 Release Readiness Runbook

Date: 2026-09-12
Arc: `project02-language-toolchain-alignment/arc09-release-0.6.0`
Source release worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
Planning worktree: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`
Book worktree: `/Users/oubiwann/lab/cnbb/lykn`
Writers-guide worktree: `/Users/oubiwann/lab/cnbb/lykn-writers-guide`

This runbook is executable release planning, not a publish authorization. The operator owns real publication, release tags, and pushes. Codex may prepare concrete diffs, run dry-runs, collect transcripts, and open the final approval boundary.

## Starting state for the release arc

- Project02 is active and current work is arc09 release 0.6.0.
- arc16 book 0.6.0 edition is closed/CDC-verified and no longer blocks release planning.
- Source work for the release belongs on `release/0.6.x` in `.worktrees/0.6.x`; planning belongs on `planning` in `.worktrees/planning`.
- The source worktree was clean at the slice01 inventory point.
- The planning worktree had unrelated Project07 edits and artifacts; release work must stage only arc09/project02/status paths it intentionally changes.
- The book worktree had a pre-existing untracked `_to_delete/`; preserve it.
- The writers-guide worktree was clean.

## Phase 1 — version bump, release notes, and release-prep chore work

1. Confirm the source branch and clean state:

   ```sh
   git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x status --short --branch
   git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x branch -vv
   ```

2. Update release versions from `0.6.0-dev` to `0.6.0`:

   - root `Cargo.toml` workspace package version
   - root `Cargo.toml` workspace dependency requirements for local Lykn crates
   - `Cargo.lock` local `lykn`, `lykn-cli`, and `lykn-lang` package entries
   - `packages/browser/deno.json`
   - `packages/lang/deno.json`
   - `packages/testing/deno.json`
   - any release-facing README/docs version strings that refer to the package release rather than examples or fixtures

3. Rebuild and verify local version reporting:

   ```sh
   make build
   ./bin/lykn --version
   ```

   Expected CLI output after the version bump: `lykn 0.6.0`.

4. Draft release notes from `0.5.2..HEAD`, using `release-note-inputs.md` as the curated input inventory. Separate user-visible changes from planning/discovery mechanics.

5. Apply low-risk release-prep chores if still current:

   - update GitHub Actions checkout actions from `actions/checkout@v4` to `actions/checkout@v5` where compatible;
   - either repair `make publish-dry-run` so it does not use `--allow-dirty`, or document that slice03 uses direct no-bypass cargo commands instead;
   - do not change `make push` into a release branch push without reviewer-visible intent. The runbook already uses explicit branch/tag push commands.

6. Run source validation appropriate to the version/release-note changes:

   ```sh
   make check
   ```

7. Commit the source release-prep changes on `release/0.6.x` with the required co-author trailer block.

## Phase 2 — dry-runs and package audit

Dry-runs must run from the exact committed release tree. A dirty-tree failure is valid evidence that the release tree is not ready; do not bypass it silently.

1. Confirm the source tree is clean and at the intended commit:

   ```sh
   git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x status --short --branch
   git -C /Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x rev-parse HEAD
   ```

2. Run the canonical repository bar:

   ```sh
   make check
   ```

3. Stage package artifacts locally:

   ```sh
   ./bin/lykn dist
   ```

   Inspect `target/lykn/dist/` for the expected JSR/npm package manifests and generated stubs.

4. Run JSR and npm dry-runs through the Lykn-only path:

   ```sh
   ./bin/lykn publish --jsr --dry-run
   ./bin/lykn publish --npm --dry-run
   ```

5. Run crates dry-runs without bypass flags. Use direct cargo commands unless `make publish-dry-run` has been repaired:

   ```sh
   cargo publish -p lykn-lang --dry-run
   cargo publish -p lykn-cli --dry-run
   cargo publish -p lykn --dry-run
   ```

   If package file lists are needed, run `cargo package -p <crate> --list` from a clean tree without `--allow-dirty`.

6. Capture transcripts or concise receipts under the dry-run slice artifacts directory, including:

   - exact source commit
   - `make check` result
   - JSR dry-run result
   - npm dry-run result
   - crates dry-run results for all three crates
   - dist manifest/package metadata spot checks
   - dirty-tree gate evidence if exercised

## Phase 3 — operator publication and release tags

Publication and tags are operator-owned. Codex may prepare the exact commands and final approval packet, but should not publish/tag/push without explicit operator authorization.

1. Confirm source tree, release notes, and dry-run artifacts point at the same commit.
2. Publish JavaScript packages:

   ```sh
   ./bin/lykn publish --jsr
   ./bin/lykn publish --npm
   ```

3. Publish crates in dependency order, preserving prompts/rate-limit behavior:

   ```sh
   make publish-crates
   ```

4. Tag the language release only after publication succeeds or after the operator explicitly chooses the project’s preferred tag timing:

   ```sh
   git tag -a 0.6.0 -m "Lykn 0.6.0"
   ```

5. Push the release branch and tag explicitly to each intended remote. Do not rely on the current `make push` recipe for the release branch because it pushes `main` and tags.

   ```sh
   git push macpro release/0.6.x
   git push github release/0.6.x
   git push codeberg release/0.6.x
   git push macpro 0.6.0
   git push github 0.6.0
   git push codeberg 0.6.0
   ```

6. Publish or tag the book release only after the language release boundary is satisfied:

   ```sh
   git -C /Users/oubiwann/lab/cnbb/lykn tag -a book-v0.6.0 -m "Lykn book v0.6.0 edition"
   ```

   Push book tags/remotes by the operator-approved book publication route.

## Phase 4 — post-publish verification and Project02 closeout

Use explicit temporary installation directories and record the exact paths. Do not rely on default managed install locations as installability evidence.

1. Verify registry/package availability:

   - JSR package pages or `deno add jsr:@lykn/lang@0.6.0`-style install checks
   - npm package metadata and `npm pack`/install checks in a temporary project
   - crates.io package pages and `cargo install`/dependency checks with an explicit install root

2. Suggested local temporary install convention:

   ```sh
   INSTALL_DIR=$(mktemp -d /tmp/lykn-0.6.0-install.XXXXXX)
   cargo install lykn --version 0.6.0 --root "$INSTALL_DIR"
   "$INSTALL_DIR/bin/lykn" --version
   ```

   Expected output: `lykn 0.6.0`.

3. Run a minimal external consumer smoke in a temporary project for each published channel:

   - compile a small Lykn file with the installed CLI;
   - import `@lykn/lang@0.6.0` from JSR in a Deno project;
   - install/import the npm artifact where supported by the generated package contract.

4. Verify release tags and branch visibility on all intended remotes:

   ```sh
   git ls-remote --tags github 0.6.0
   git ls-remote --heads github release/0.6.x
   ```

   Repeat for `macpro` and `codeberg`, or record why a remote is intentionally excluded.

5. Verify the book release tag/artifacts:

   - `book-v0.6.0` exists at the intended book commit;
   - `src/book-versions.md` remains accurate;
   - final book build/fence evidence remains tied to the v0.6 edition.

6. Close Project02 only after release artifacts, registry availability, post-publish install checks, release notes, and Project02 ledger rows P-8/P-12 are reconciled. Keep operator acceptance, CC attestation, and independent CDC verification distinct.

## Blockers and routed chores from slice01

- No current release blocker was found in the version-surface or release-note inventory.
- `make publish-dry-run` is not acceptable release evidence while it uses `--allow-dirty`. Repair or avoid it in slice03.
- `make push` is not the release-branch push recipe in its current form. Use explicit release branch and tag pushes.
- CI checkout v5/Node-20 maintenance is a low-risk release-prep chore, not a blocker unless CI proves otherwise.
- Project07 rows `D-2609-LINT`, `D-2609-NPMB`, `D-2609-JSER`, and `D-2609-YNOD` remain routed to Project07 and do not block this Project02 release arc based on slice01 evidence.
