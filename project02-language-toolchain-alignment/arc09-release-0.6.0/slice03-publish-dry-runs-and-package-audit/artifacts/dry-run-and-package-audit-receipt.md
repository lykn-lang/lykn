# arc09 slice03 — Dry-run and Package Audit Receipt

Date: 2026-09-12
Source branch/worktree: `release/0.6.x` in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
Initial source commit: `65ff40fbcabbf3edab760947108f4a0d13ed9d99`
Final source commit for release evidence: `50608c443c452107b138cc30deda4a09ab5c7642`
Planning branch/worktree: `planning` in `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

## Entry status

- Source worktree began clean on `release/0.6.x` at `65ff40fbcabbf3edab760947108f4a0d13ed9d99`.
- Planning worktree began on `planning` with pre-existing untracked Project07 artifacts; those were preserved and not staged.
- Book repository remained on `main` with pre-existing untracked `_to_delete/`; no book files were changed.
- Writers-guide repository remained clean on `main`.
- Language tags still stopped at `0.5.2`; no `0.6.0` tag existed or was created.

## Source repair produced during slice03

The first crates dry-run found a real packaging defect in `lykn-lang`: the packaged crate tried to embed `$CARGO_MANIFEST_DIR/../../packages/lang`, which is outside the crate tarball during Cargo verification.

Source commit `50608c443c452107b138cc30deda4a09ab5c7642` fixes that release blocker by keeping the embedded `packages/lang` payload under `crates/lykn-lang/embedded/packages/lang` and pointing `include_dir!` at the in-crate path. No publish, tag, or push was performed.

## Validation and dry-run receipts

| Check | Result | Receipt |
|-------|--------|---------|
| `make check` | Passed after required filesystem escalation for npm home log/cache access; final line reports `✓ All checks passed (build + lint + test)`. | [make-check.log](make-check.log) |
| `./bin/lykn dist` | Passed; staged `@lykn/lang`, `@lykn/browser`, and `@lykn/testing`. | [dist.log](dist.log) |
| Dist metadata/file audit | Passed; all generated JSR/npm package metadata reports `0.6.0`. | [dist-audit.log](dist-audit.log) |
| `cargo package -p lykn-lang --list` | Passed; package list includes `embedded/packages/lang/*`. | [lykn-lang-package-list.log](lykn-lang-package-list.log) |
| `./bin/lykn publish --jsr --dry-run` | Passed; simulated all three JSR packages at `0.6.0`. Deno emitted a warning for unanalyzable `import.meta.resolve` in `expander.js`, but the dry-run completed successfully. | [jsr-dry-run.log](jsr-dry-run.log) |
| `./bin/lykn publish --npm --dry-run` | Passed; simulated all three npm packages at `0.6.0`. | [npm-dry-run.log](npm-dry-run.log) |
| `make publish-dry-run` | Qualified: `lykn-lang` passed; `lykn-cli` stopped at Cargo's registry dependency check because `lykn-lang 0.6.0` is not yet on crates.io. | [crates-dry-run.log](crates-dry-run.log) |
| `cargo publish -p lykn-lang --dry-run` | Passed; packaged 70 files, 1.4 MiB, 253.5 KiB compressed; verification compiled successfully; upload aborted because this was a dry run. | [cargo-publish-lykn-lang.log](cargo-publish-lykn-lang.log) |
| `cargo publish -p lykn-cli --dry-run` | Expected registry sequencing failure before publication: crates.io only has `lykn-lang` through `0.5.2`, so `lykn-lang = ^0.6.0` cannot resolve yet. | [cargo-publish-lykn-cli.log](cargo-publish-lykn-cli.log), [lykn-cli-package-list.log](lykn-cli-package-list.log) |
| `cargo publish -p lykn --dry-run` | Expected registry sequencing failure before publication: crates.io only has `lykn-cli` through `0.5.2`, so `lykn-cli = ^0.6.0` cannot resolve yet. | [cargo-publish-lykn.log](cargo-publish-lykn.log), [lykn-package-list.log](lykn-package-list.log) |

## Package audit summary

Generated JS dist metadata:

| Package dir | Deno name/version | npm name/version | Files |
|-------------|-------------------|------------------|-------|
| `browser` | `@lykn/browser` `0.6.0` | `@lykn/browser` `0.6.0` | 11 |
| `lang` | `@lykn/lang` `0.6.0` | `@lykn/lang` `0.6.0` | 31 |
| `testing` | `@lykn/testing` `0.6.0` | `@lykn/testing` `0.6.0` | 12 |

npm dry-run tarballs:

| Package | Tarball | Size | Unpacked | Files |
|---------|---------|------|----------|-------|
| `@lykn/lang@0.6.0` | `lykn-lang-0.6.0.tgz` | 68.4 kB | 278.2 kB | 16 |
| `@lykn/testing@0.6.0` | `lykn-testing-0.6.0.tgz` | 13.2 kB | 36.5 kB | 7 |
| `@lykn/browser@0.6.0` | `lykn-browser-0.6.0.tgz` | 9.1 kB | 22.5 kB | 6 |

## Publication boundary

No real publication, release tag, book tag, branch push, or tag push was performed in this slice. slice04 remains the operator-owned publication and tag boundary.
