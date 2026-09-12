# arc16 slice12 - Edition Close and Release Gate

Status: **Open**
Opened: 2026-09-12

## Capability

Perform the final Lykn Book 0.6.0 edition close after the slice11 overlap parity fix. This slice is the final whole-book verification and release-gate handoff for arc16 before arc09 can plan the 0.6.0 release cut.

## Scope

- Re-check the book, writers-guide, and language release worktree heads before editing.
- Build the book HTML and EPUB outputs, recording warnings and output paths.
- Run the book example gates, including whole-book `lykn test --docs src --fence lisp` and any additional fences needed to prove shipped examples.
- Perform a stale-link/path sweep and edition/version metadata check.
- Review the book at final-pass level for voice consistency, stale caveats, and release-blocking contradictions.
- Route any new implementation or documentation defects as discoveries and new slices or explicit deferrals before prose normalizes them.
- Close arc16 only if the book edition gate is actually satisfied; otherwise update arc16 with the next required slice.
- Bubble the arc16 result to project02 and arc09 status surfaces.

## Out of scope

- Publishing the 0.6.0 language release; arc09 owns release publishing after arc16 closes.
- Broad language redesign discovered during the final pass; register and route it instead.
- Merging planning into source or creating planning artifacts in the sibling book repo.

## Verification

Minimum expected gates:

- book HTML build;
- book EPUB build if supported by the book repo tooling;
- whole-book `lykn test --docs src --fence lisp`;
- additional `lykn test --docs` fence runs for any non-`lisp` executable examples that are in release scope;
- link/path/version sweep evidence;
- final repository hygiene statuses for release/0.6.x, planning, book, and writers-guide.

If source docs or code change during this slice, run the relevant release-worktree gates, with `make check` as the canonical source bar. Remove generated book `target/` after doctest runs unless intentionally tracked.

## Close conditions

- The book 0.6.0 edition is built and example-verified, or remaining blockers are routed by name.
- No stale implementation caveat, skipped example, or release-blocking contradiction is silently left behind.
- arc16 is either closed with evidence and arc09 unblocked, or kept open with the next slice explicitly opened.
- Planning status surfaces and ledgers reflect the actual result.
