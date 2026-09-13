# arc09 slice03 — Publish Dry-runs and Package Audit Closing Report

Status: **Closed / CDC-verified, qualified crates sequencing**
Date: 2026-09-12
Source branch/worktree: `release/0.6.x` in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`
Initial source commit: `65ff40fbcabbf3edab760947108f4a0d13ed9d99`
Final source commit: `50608c443c452107b138cc30deda4a09ab5c7642`
Planning branch/worktree: `planning` in `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`

## Scope completed

slice03 ran the 0.6.0 package audit and dry-runs without passing `--allow-dirty` or any equivalent bypass flag.

The first crates dry-run found a real release blocker: `lykn-lang` embedded `../../packages/lang`, which is outside the crate tarball during Cargo publish verification. The blocker was fixed in source commit `50608c443c452107b138cc30deda4a09ab5c7642` by moving the embedded payload inside `crates/lykn-lang/embedded/packages/lang` and updating the `include_dir!` path.

After that repair, the final committed release evidence was gathered from source commit `50608c443c452107b138cc30deda4a09ab5c7642`.

## Artifacts

- [dry-run-and-package-audit-receipt.md](artifacts/dry-run-and-package-audit-receipt.md)
- [make-check.log](artifacts/make-check.log)
- [dist.log](artifacts/dist.log)
- [dist-audit.log](artifacts/dist-audit.log)
- [jsr-dry-run.log](artifacts/jsr-dry-run.log)
- [npm-dry-run.log](artifacts/npm-dry-run.log)
- [crates-dry-run.log](artifacts/crates-dry-run.log)
- [cargo-publish-lykn-lang.log](artifacts/cargo-publish-lykn-lang.log)
- [cargo-publish-lykn-cli.log](artifacts/cargo-publish-lykn-cli.log)
- [cargo-publish-lykn.log](artifacts/cargo-publish-lykn.log)
- [lykn-lang-package-list.log](artifacts/lykn-lang-package-list.log)
- [lykn-cli-package-list.log](artifacts/lykn-cli-package-list.log)
- [lykn-package-list.log](artifacts/lykn-package-list.log)
- [initial-crates-dry-run-failure.log](artifacts/initial-crates-dry-run-failure.log)
- [cdc-verification.md](cdc-verification.md)

## Validation

- `make check`: passed on the repaired committed source tree after required filesystem escalation for npm home log/cache access.
- `./bin/lykn dist`: passed.
- Dist audit: all generated JSR/npm package metadata reports `0.6.0`; file lists recorded for `browser`, `lang`, and `testing`.
- `./bin/lykn publish --jsr --dry-run`: passed for `@lykn/lang`, `@lykn/testing`, and `@lykn/browser` at `0.6.0`; Deno emitted an `import.meta.resolve` warning for `@lykn/lang`, but the dry-run completed.
- `./bin/lykn publish --npm --dry-run`: passed for all three npm packages at `0.6.0`.
- `cargo publish -p lykn-lang --dry-run`: passed; Cargo packaged and verified the crate successfully.
- `make publish-dry-run`: qualified; `lykn-lang` passed, then Cargo stopped at `lykn-cli` because `lykn-lang 0.6.0` is not yet present on crates.io.
- `cargo publish -p lykn-cli --dry-run`: same expected registry sequencing failure for unpublished `lykn-lang 0.6.0`.
- `cargo publish -p lykn --dry-run`: same expected registry sequencing failure for unpublished `lykn-cli 0.6.0`.

## Ledger row walk

| ID | Disposition | Evidence |
|----|-------------|----------|
| D-1 | done / CDC-verified | Entry status and final source commit are recorded in [dry-run-and-package-audit-receipt.md](artifacts/dry-run-and-package-audit-receipt.md#entry-status) and accepted in [CDC verification](cdc-verification.md). |
| D-2 | done / CDC-verified | `make check` passed; see [make-check.log](artifacts/make-check.log) and [CDC verification](cdc-verification.md). |
| D-3 | done / CDC-verified | `./bin/lykn dist` and generated package audit passed; see [dist-audit.log](artifacts/dist-audit.log) and [CDC verification](cdc-verification.md). |
| D-4 | done / CDC-verified | JSR dry-run passed; see [jsr-dry-run.log](artifacts/jsr-dry-run.log) and [CDC verification](cdc-verification.md). |
| D-5 | done / CDC-verified | npm dry-run passed; see [npm-dry-run.log](artifacts/npm-dry-run.log) and [CDC verification](cdc-verification.md). |
| D-6 | done / qualified / CDC-verified | `lykn-lang` cargo dry-run passed; dependent crates are blocked by normal crates.io publication sequencing until internal 0.6.0 dependencies exist on the registry. |
| D-7 | done / CDC-verified | All transcripts are preserved under [artifacts](artifacts). |
| D-8 | done / CDC-verified | No publish, tag, branch push, tag push, or book tag was performed. |
| D-9 | done / CDC-verified | Arc09 planning is updated and [slice04 cc-prompt](../slice04-operator-publication-and-tags/cc-prompt.md) is opened. |

## CDC verification

CDC independently reproduced the source status, embedded crate payload package
list, full source gate, dist metadata, JSR dry-run, npm dry-run, `lykn-lang`
Cargo dry-run, dependent crate registry-sequencing failures, and publication/tag
side-effect boundaries. See [cdc-verification.md](cdc-verification.md).

## Bubble-up to the arc

slice03 found and fixed a real crate packaging defect before publication. The release evidence now points to source commit `50608c443c452107b138cc30deda4a09ab5c7642`, not the earlier slice02 commit `65ff40fbcabbf3edab760947108f4a0d13ed9d99`.

The only remaining crates dry-run qualification is Cargo's registry sequencing rule for workspace crates: before `lykn-lang 0.6.0` is published, `lykn-cli 0.6.0` cannot verify its rewritten registry dependency; before `lykn-cli 0.6.0` is published, `lykn 0.6.0` cannot verify its rewritten registry dependency. slice04 should publish crates in dependency order and capture per-step evidence.

Scope-as-specified versus scope-as-delivered: all package audits and dry-run evidence were captured, and a release-blocking package defect was repaired and committed. No source publication, release tags, book tags, branch pushes, or tag pushes were performed.
