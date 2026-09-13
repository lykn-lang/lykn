# arc09 slice02 - CDC Verification

Verified by CDC on 2026-09-12.

## Verdict

slice02 is **closed / CDC-verified**.

CDC treated CC's close as proposed-done and independently reproduced the
release-prep evidence. The source release tree is prepared at commit
`65ff40fbcabbf3edab760947108f4a0d13ed9d99`; no real publication, release tag,
branch push, or book tag was performed.

## Evidence reproduced

| Check | Result |
|-------|--------|
| Source commit scope | `65ff40f` changes only workflows, Cargo version surfaces, package manifests, `Makefile`, and `release-notes-0.6.0.md`; required co-author trailers are present. |
| Planning commit scope | `9c004c3` records the slice02 close packet and opens slice03; required co-author trailers are present. Current planning HEAD has unrelated project07 work above it, and `9c004c3` is an ancestor. |
| Version sweep | No `0.6.0-dev` remains in the checked source version surfaces; `Cargo.toml`, `Cargo.lock`, and `packages/{browser,lang,testing}/deno.json` report `0.6.0`. |
| CLI version | Rebuilt CLI reports `lykn 0.6.0`. |
| Dist metadata | `./bin/lykn dist` regenerated package metadata; browser, lang, and testing `deno.json` and `package.json` outputs all report `0.6.0`. |
| Release notes | `release-notes-0.6.0.md` exists as a draft release-note home and keeps publication/tag evidence out of scope. |
| CI checkout chore | Local workflows use `actions/checkout@v5`. Official upstream documentation now advertises newer v6/v7 majors, so this is accepted only as the slice-scoped v4-to-v5 chore, not as "latest action" evidence. |
| Dry-run helper | `make publish-dry-run` now calls `cargo publish -p $$crate --dry-run` without `--allow-dirty`. |
| Full validation | A sandboxed `make check` failed only because npm could not write logs under `/Users/oubiwann/.npm/_logs`; the filesystem-escalated rerun passed and ended with `All checks passed (build + lint + test)`. |
| Operator boundaries | Source tags still stop before `0.6.0`; the book repo has no `book-v0.6.0` tag. Publication, tags, pushes, and book release tagging remain future operator-owned work. |
| Hygiene | Source worktree is clean on `release/0.6.x`; planning changes are limited to CDC closeout; book still has only the pre-existing untracked `_to_delete/`; writers-guide is clean. |

## Ledger disposition

All slice rows V-1 through V-9 are accepted as done / CDC-verified.

## Bubble-up

slice02 delivered its assigned release-prep capability. slice03 should proceed
from exact source commit `65ff40fbcabbf3edab760947108f4a0d13ed9d99` and produce
dry-run/package-audit receipts without weakening dirty-tree gates.

No new slice is required from this verification.
