# Slice 05: Book Instruction Bootstrap

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required source and repo guidance read before edits | closing report lists `AGENTS.md`, arc16 plan, slice01-slice04 close/CDC artifacts, book `AGENTS.md`, writers-guide `AGENTS.md`, `authoring-guide.md`, `new-ch-prompt.md`, `planned-toc.md`, book `book.toml`, and book `src/SUMMARY.md`, with one-line roles | serious | collaboration framework | open | | protects against importing May drift as live truth |
| F-2 | Sibling repo state is recorded before edits | closing report records `git status --short --branch` for book and writers-guide, including the book `_to_delete/` caveat if still present | serious | slice01/slice05 | open | | do not disturb unrelated user work |
| F-3 | `AGENTS.md`/`CLAUDE.md` canonical instruction state is preserved | `git ls-files -s AGENTS.md CLAUDE.md` and `readlink CLAUDE.md` pass in both sibling repos after edits | serious | artifact-homes / AGENTS standard | open | | canonical AGENTS, symlink CLAUDE |
| F-4 | Planning-home and durable-artifact rules are current | `rg` over updated sibling instructions shows planning points to lang `docs/design-v0.6.0/arc16-book-0.6.0-edition/`; no durable close artifacts are routed to `workbench/` | serious | D-3 / P-21 | open | | split by design remains intact |
| F-5 | Stale old lang paths are removed from active instruction surfaces | targeted `rg 'oxur/lykn|conversation-bootstrap-v6|docs/design/06-final|docs/dev/research'` over active writers-guide instruction files returns no active-use hits, or historical hits are explicitly marked historical | correctness | B0-A/B/C | open | | current lang repo/worktree paths only |
| F-6 | Testing instructions no longer assert an absent universal book-test gate | targeted sweep shows raw book-test Deno commands and "all examples must have corresponding tests" claims are removed, replaced, or explicitly marked as future/pending with `D-2607-R4NW` / slice06 as home | serious | B0-G / D-2607-R4NW | open | | do not claim a gate that does not exist |
| F-7 | Fence-tag guidance is accurate for 0.6.0 | updated instructions preserve `lisp` fences for book Lykn source and name the pending `lykn test --docs --fence lisp` route without implying it has already landed | serious | B0-K / D-2607-R4NW | open | | Linguist migration remains 0.7.0+ |
| F-8 | Compiler/toolchain wording matches current 0.6.0 architecture | targeted sweep and changed text distinguish Rust CLI/check/compile from the JS/Deno compiler path without saying JS is browser-only or importing from obsolete `src/index.js` | correctness | B0-D/F | open | | avoid stale compiler story |
| F-9 | 0.6.0 project/source ownership guidance is honest | updated text reflects slice03: Lykn-generated build/dist artifacts live under `target/lykn/*`, scaffold/source config rules are stated as the 0.6.0 floor, and user-owned non-Lykn source files are not forbidden | correctness | D-2608-SOWN / slice03 | open | | do not overstate source-only rule |
| F-10 | New 0.6.0 language surface is reflected in authoring instructions | updated text teaches `(exports ...)`, grouped sequential `bind`, and `cond` as preferred current examples, while inline export wrappers are named compatibility syntax where relevant | serious | slice04 / D-2608-XPRT/LBND/COND | open | | book examples should imitate shipped surface |
| F-11 | Planned-ToC policy is settled for this slice | closing report states whether `planned-toc.md` is preserved as v2 with a new/current 0.6.0 artifact, reconciled in place, or explicitly deferred; any new artifact path is tracked and cited | correctness | D-2 / B0-I/J | open | | no silent ToC drift |
| F-12 | Book-pass defect routing rule is explicit | updated instructions or arc16 plan state that new book-discovered language/tooling/DevX defects become Discovery Register rows and new slices or explicit deferrals before prose normalizes them | serious | operator note 2026-08-20 | open | | arc16 can grow many slices by design |
| F-13 | Sibling repo verification is run after edits | closing report records post-edit sibling statuses, targeted stale-guidance sweeps, and any available repo-local build/format checks or states that none exist | serious | slice close discipline | open | | evidence from actual repos |
| F-14 | Lang planning/status surfaces are bubbled up | arc16 `arc-plan.md`, project plan/status surfaces, and slice close report reflect slice05 outcome and name whether slice06 remains next | serious | project-management | open | | no stale "ready/open" drift |
| F-15 | Standard lang docs/planning gates pass | `git diff --check`; `make check-cited-paths`; `make test-docs` pass after lang planning edits are committed or with documented post-commit cited-path rerun | serious | AGENTS.md / arc16 | open | | cited paths resolve at HEAD |

## What Worked

_(At slice close. Patterns that made the slice close cleanly.)_

## Closure

Closed by CC on <date>. Verified by: <name/session>.
Rows: 15. Done: <n>. Deferred: <n>. No-op: <n>. Pending: <n>.
