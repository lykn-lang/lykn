# slice01 — Pre-Book Decision Gate

## 1. Goal

Re-ground the historical book-update inventory and the new dogfood findings
against the current `release/0.6.x` branch and the sibling book repositories,
then produce the decision packet needed before any 0.6.0 book prose or language
surface implementation proceeds.

This slice does not decide language syntax by itself. It gives Duncan and CDC
the evidence, options, costs, and routing needed to decide cleanly.

## 2. Scope

In:

- Read the current arc16 source material:
  - [`../arc-plan.md`](../arc-plan.md)
  - [`../design/kickoff-thread-book-0.6.0-update.md`](../design/kickoff-thread-book-0.6.0-update.md)
  - [`../design/book-drift-inventory-0.6.0.md`](../design/book-drift-inventory-0.6.0.md)
  - [`../design/fence-wiring-spec.md`](../design/fence-wiring-spec.md)
  - [`../design/dogfooding-friction-log.md`](../design/dogfooding-friction-log.md)
  - [`../../../backlog/discoveries.md`](../../../backlog/discoveries.md)
- Verify current sibling repo facts that were stale or missing in the May
  inventory: `AGENTS.md`/`CLAUDE.md`, `/Users/oubiwann/lab/cnbb/lykn/test/book/`, `book.toml`,
  `src/SUMMARY.md`, writer-guide files, and git status.
- Produce a decision packet inside the slice closing report for D-1...D-5,
  `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and
  `D-2608-SOWN`.
- Classify every decision as one of:
  - `book-only/docs-only`;
  - `0.6.0 implementation before book examples`;
  - `0.6.0 implementation after a book-support slice`;
  - `0.7.0+ deferral with re-entry condition`;
  - `already resolved; close/no-op with evidence`.
- Recommend the next slice order and any arc-plan amendments required before
  slice02 opens.

Out:

- No compiler, CLI, scaffold, book prose, or writer-guide implementation.
- No edits in `/Users/oubiwann/lab/cnbb/lykn` or
  `/Users/oubiwann/lab/cnbb/lykn-writers-guide`.
- No attempt to settle the final syntax by CC assertion. Options and evidence
  only; Duncan decides.
- No arc close.

## 3. Verification Approach

This is a recon/planning slice. Verification is therefore evidence coverage and
anti-silent-drop coverage, not runtime behavior:

- every ledger row has a concrete artifact/evidence pointer;
- every historical decision and new dogfood finding is present in the decision
  packet;
- current sibling-repo facts are verified from the filesystem/git state, not
  copied from the old inventory;
- docs/path gates in the lang repo remain green after writing the report.

## 4. Exit Criteria

- `ledger.md` rows F-1...F-10 are all `done`, `deferred`, or `no-op`, with
  evidence.
- `closing-report.md` contains:
  - a source-material freshness section;
  - a decision packet table for all gates named above;
  - a recommended next-slice order;
  - a bubble-up section saying whether `arc-plan.md` must change before
    slice02 opens.
- `cdc-verification.md` is still absent until CDC reviews the closed slice.
- Lang repo gates pass:
  - `git diff --check`
  - `make check-cited-paths`
  - `make test-docs`
