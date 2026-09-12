# CC Prompt - arc16 slice12 Edition Close and Release Gate

You are working in the Lykn language project. Planning lives on branch `planning` in `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`. Source/user docs for 0.6.x live on branch `release/0.6.x` in `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x`. The Lykn Book content lives in `/Users/oubiwann/lab/cnbb/lykn`, and the writers-guide lives in `/Users/oubiwann/lab/cnbb/lykn-writers-guide`.

Read `AGENTS.md`, then read the installed collaboration-framework project-management guides before changing planning. Read this slice's `slice-plan.md` and `ledger.md`, plus the slice11 closing report and `cdc-verification.md`. Preserve the split: planning artifacts stay in the planning worktree; book content stays in the book repo; release source/doc changes stay on `release/0.6.x`.

## Goal

Perform the final Lykn Book 0.6.0 edition close and release-gate handoff for arc16. Build the book outputs, run the executable-example gates, sweep for stale paths/links/edition metadata, review for stale caveats and release-blocking contradictions, and either close arc16 with evidence or route the next blocker explicitly.

## Scope

- Check starting statuses for release/0.6.x, planning, book, and writers-guide.
- Build the book HTML output and record warnings/output path.
- Attempt the EPUB build if the book repo has a supported command or documented flow; if not, record the absence as evidence rather than fabricating the gate.
- Run whole-book `lykn test --docs src --fence lisp` from the book repo using the release/0.6.x binary.
- Run any additional `lykn test --docs` fence gates needed for executable examples in scope.
- Sweep book links, cited paths, stale implementation caveats, skipped examples, version/edition metadata, and release-blocking contradictions.
- Fix book-only/documentation issues that are safely within this slice; route implementation defects or larger doc changes as named discoveries/slices/deferrals.
- Update the slice ledger/closing report, arc16 plan/status, project status, and arc09 handoff state according to the actual result.

## Out of scope

Do not publish 0.6.0; arc09 owns release publishing after arc16 closes. Do not broaden into language redesign without routing the finding. Do not merge planning into source or create planning files in the book/writers-guide repos.

## Verification

Minimum expected evidence:

- HTML book build result.
- EPUB build result or explicit tooling-unavailable note.
- Whole-book `lykn test --docs src --fence lisp` result.
- Any additional executable fence gates selected and their results.
- Link/path/version/stale-caveat sweep evidence.
- If source changes occur, run `make check` in release/0.6.x.
- Remove generated book `target/` after doctests unless intentionally tracked.
- Final `git status --short --branch` for release/0.6.x, planning, book, and writers-guide.

## Closeout

Close the slice only when every ledger row is dispositioned. If arc16 gates are met, close arc16 and update project02 so arc09 release planning is next. If a blocker remains, keep arc16 open and create the next slice or explicit deferral with evidence.
