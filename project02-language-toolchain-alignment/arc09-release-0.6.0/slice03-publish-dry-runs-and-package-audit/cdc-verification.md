# arc09 slice03 - CDC Verification

Verified by CDC on 2026-09-12.

## Verdict

slice03 is **closed / CDC-verified**, with the crates sequencing qualification
accepted and carried into slice04.

CDC treated CC's close as proposed-done and independently reproduced the release
dry-run claims against source commit
`50608c443c452107b138cc30deda4a09ab5c7642` on `release/0.6.x`.

## Evidence reproduced

| Check | Result |
|-------|--------|
| Source commit scope | `50608c4` moves the embedded `packages/lang` payload into `crates/lykn-lang/embedded/packages/lang` and points `include_dir!` at the crate-local path. Required co-author trailers are present. |
| Source status | Source worktree is clean on `release/0.6.x` at `50608c443c452107b138cc30deda4a09ab5c7642`. |
| Embedded payload package list | `cargo package -p lykn-lang --list` includes `embedded/packages/lang/*`, proving the payload is inside the crate package. |
| Full source gate | Sandboxed `make check` failed only because npm could not write under `/Users/oubiwann/.npm/_logs`; the filesystem-escalated rerun passed and ended with `All checks passed (build + lint + test)`. |
| Dist package audit | `./bin/lykn dist` passed; generated browser, lang, and testing `deno.json`/`package.json` files all report `0.6.0`; generated package file lists include expected README, LICENSE, JS, and declaration surfaces. |
| JSR dry-run | `./bin/lykn publish --jsr --dry-run` passed for `@lykn/browser`, `@lykn/testing`, and `@lykn/lang` at `0.6.0`; Deno emitted the recorded `import.meta.resolve` warning but completed the dry-run. |
| npm dry-run | Sandboxed npm dry-run failed only on npm home log writes; filesystem-escalated `./bin/lykn publish --npm --dry-run` passed for `@lykn/lang`, `@lykn/testing`, and `@lykn/browser` at `0.6.0`. |
| `lykn-lang` crates dry-run | Sandboxed Cargo could not resolve `index.crates.io`; filesystem-escalated `cargo publish -p lykn-lang --dry-run` packaged 70 files, verified the crate, and aborted upload only because this was a dry run. |
| Dependent crates sequencing | `cargo publish -p lykn-cli --dry-run` fails because crates.io does not yet have `lykn-lang = ^0.6.0`; `cargo publish -p lykn --dry-run` fails because crates.io does not yet have `lykn-cli = ^0.6.0`. This is accepted as normal Cargo registry sequencing, not a package-content failure. |
| Dry-run helper | `make publish-dry-run` still calls `cargo publish -p $$crate --dry-run` without `--allow-dirty`. |
| Operator boundaries | No source publication, tag, branch push, tag push, book tag, or book publication was performed. Source tags still stop before `0.6.0`; the book repo has no `book-v0.6.0` tag. |
| Planning hygiene | Planning changes are limited to slice03 CDC closeout and status roll-up; unrelated Project07 artifacts remain untracked and preserved. |

## Ledger disposition

Rows D-1 through D-5 and D-7 through D-9 are accepted as
done / CDC-verified.

Row D-6 is accepted as done / qualified / CDC-verified: the first crate in the
dependency chain (`lykn-lang`) dry-runs successfully, and the remaining crates
are blocked only by normal crates.io publication ordering. slice04 must publish
crates in dependency order and capture evidence after each registry dependency
becomes available.

## Bubble-up

slice03 delivered its assigned package-audit and dry-run capability and found a
real publication blocker before release. The final release evidence now points
to source commit `50608c443c452107b138cc30deda4a09ab5c7642`, not the earlier
slice02 commit.

The arc-plan already routes the remaining publication/tag/push work to slice04.
CDC updates the live status surfaces and slice04 prompt so the next operator
packet reads this verification before proposing concrete publication commands.

No additional remediation slice is required from this verification.
