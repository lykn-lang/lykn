# CC metadata01 verification receipt

Date: 2026-11-14. This receipt records a message-only correction. No source, test, mirror, or documentation bytes changed.

## Original objects and preserved bytes

`original-c1.commit` and `original-c2.commit` are the exact bytes returned by `git cat-file commit` for the first and second original commits. `git hash-object -t commit` reproduced both originals:

- C1 original `df39449034e3e8530927b0df8129049833af5f5f`; replacement `86c3d77f60af08438a184fdc4aad0beef66f17d2`.
- C2 original `85ddca6325012f12f72f18bcc2530669709e5216`; replacement `30d8b77c4e5516191fc9d470325c4ead64e9fba4`.

Author and committer names, emails, timestamps, timezone, subject and body were kept. Only the blank line between coauthor trailers was removed in each replacement message. `replacement-c1.commit` and `replacement-c2.commit` are exact `git cat-file commit` receipts for the new objects; hashing each with `git hash-object -t commit` returned its replacement ID.

## Graph and content checks

- Baseline remains `9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree `6d64692fde0c367e73deeda1ec1aca19e49d6b93`.
- C1 old/new tree: `a35f249bdf71a8744f19be2f4af5376ae28b8413`; both parent the baseline.
- C2 old/new tree: `eed763256aada46c8bc5e7a848be09c7a1f7f19c`; old C2 parents old C1; replacement C2 parents replacement C1.
- `git diff --exit-code 85ddca6325012f12f72f18bcc2530669709e5216 30d8b77c4e5516191fc9d470325c4ead64e9fba4` returned 0 with no output: zero source-tree delta between original and replacement final commits.
- `git diff-tree --no-commit-id --name-status -r baseline original-final` and the same baseline-to-replacement-final comparison list the same fourteen authorized paths (14 each).
- `git update-ref refs/heads/codex/qualified-adt-core 30d8b77c4e5516191fc9d470325c4ead64e9fba4 85ddca6325012f12f72f18bcc2530669709e5216` returned 0 using the explicit old-value compare-and-swap. Final branch HEAD is `30d8b77c4e5516191fc9d470325c4ead64e9fba4`, tree `eed763256aada46c8bc5e7a848be09c7a1f7f19c`; worktree/index status is clean.
- Both actual replacement commit messages were read back with `git cat-file commit`; the final two trailer lines are adjacent and exactly `Co-authored-by: Codex <noreply@openai.com>` then `Co-authored-by: Billo AI <ai-engineering@billo.systems>`.

## Checks run at replacement HEAD

- `make check-cited-paths`: exit 0; 64 documents on `codex/qualified-adt-core`, 601 historical citations accepted through the existing census.
- Fresh `make bundle-size-check`: exit 0; gzip 48,730 bytes against 81,920, baseline 27,630 bytes, delta +21,100. esbuild emitted the existing astring package condition warning (`browser` follows `import` and `require`); output also reported downloading esbuild from the npm registry. No test/build gate was rerun for this commit-message-only change.

The original focused/full/M6 test claims remain doer-attested at the identical original source trees and conditions recorded in the preceding closing report and `m6-pre-class-expr`/`m6-final` receipts. This receipt does not represent those as new runs or independent acceptance. CDC is to reproduce its required gates at the replacement candidate.
