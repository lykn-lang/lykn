# Slice: build-dir-and-publish-dirty-check (M11+M13)

> Reconstructed retroactively (2026-06-28). Combined milestone; see arc-plan
> for the one-slice rationale. Gap: no standalone slice-doc existed originally.

## Goal / scope
`target/lykn/{build,dist}` reorganization; `lykn dist` subcommand + deprecation
alias; whole-project `lykn build`; `project.json` import repointing; scaffold
update; `lykn publish` dirty-check gate + `--allow-dirty` (never auto-injected).

## Status
Closed (shipped 2026-05-11; combined ledger rows M11M13-1…12).

**Gap (disclosed):** no `cc-prompt.md` and no `cdc-verification.md` — this
shipped as the combined M11+M13 milestone; the CC assignment lived in
`project02-language-toolchain-alignment/arc01-build-publish-toolchain/artifacts/dev/0016-build-dir-reorg-prompt-for-cc.md` and CDC-style checks are folded
into the closing report's substrate-compliance section rather than a separate
file.

## Artifacts
- `ledger.md` — combined M11+M13 ledger (12 rows)
- `closing-report.md` — per-row walk + substrate-compliance checks
- `design/kickoff-thread.md` — originating thread
