# arc16 slice06 - Book Fence Reachability Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required source and language guidance is read before edits | closing report lists collaboration framework, project-management, ledger discipline, Rust guidance, Deno/JS guidance, Lykn SKILL/guides, lang `AGENTS.md`, arc16 plan, slice05 CDC verification, fence-wiring spec, Discovery Register row `D-2607-R4NW`, doctest/CLI implementation files, and sibling book/writers-guide instructions with one-line roles | serious | collaboration framework / operator coding-guidance rule | open | | Rust and Deno/JS guidance are required because this is implementation work |
| F-2 | Current repo states are recorded before edits | closing report records `git status --short --branch` for lang, book, and writers-guide before edits, including the book `_to_delete/` caveat if still present | serious | slice05 close discipline | open | | preserve unrelated user work |
| F-3 | `lykn test --docs` exposes a repeatable `--fence TAG` flag | `./bin/lykn test --help` or equivalent CLI help shows the new flag; focused CLI/Rust tests cover repeated values | serious | `D-2607-R4NW` / fence spec | open | | flag belongs to docs mode but may be parsed on the `test` command |
| F-4 | Default doctest behavior is preserved | `make test-docs` passes and generated block count remains 482 unless an intentional docs change explains a different count | serious | regression guard | open | | no accidental guide count churn |
| F-5 | Opt-in `lisp` Markdown fences are extracted as Lykn | focused Rust test or fixture command proves a bare `lisp` fence is ignored by default and extracted with `--fence lisp` | serious | fence spec test 1 | open | | reachability without hard-coding `lisp` |
| F-6 | Annotated opt-in fences preserve existing semantics | focused tests prove `lisp,compile-fail` and at least one non-failure annotation follow the same annotation path as `lykn,<annotation>` | correctness | fence spec test 2 | open | | do not fork annotation semantics per tag |
| F-7 | Prefix-similar tags are still skipped | focused test proves `lisp-foo` is not extracted when `--fence lisp` is set | correctness | fence spec test 3 | open | | protects real non-Lykn `lisp-*` fences |
| F-8 | Repeated fence tags compose in one run | focused test or integration fixture proves `--fence lisp --fence lykn` extracts both tags | correctness | fence spec test 5 | open | | mixed tree support |
| F-9 | HTML Lykn extraction behavior is unchanged | existing HTML doctest tests pass, and any changed signature has coverage proving `<script type="text/lykn">` still extracts | correctness | doctest regression | open | | Markdown fence tags should not regress HTML |
| F-10 | User-facing lang docs/guides describe the new flag honestly | targeted `rg` shows docs/guides or CLI docs name `--fence`; docs do not claim `lisp` is the default tag | serious | arc16/slice05 | open | | preserve opt-in framing |
| F-11 | Book and writers-guide standing instructions are updated after implementation | sibling commits or diffs update the pending-gate language to the landed command while preserving `AGENTS.md` canonical / `CLAUDE.md` symlinks | serious | slice05 / artifact homes | open | | no stale "pending" instruction after gate lands |
| F-12 | `D-2607-R4NW` is dispositioned with implemented route and remaining re-entry | Discovery Register row names the slice06 implementation, the command, and any remaining book-run failure triage home | serious | Discovery Register protocol | open | | do not leave the blocker open after implementation |
| F-13 | Book-level reachability is demonstrated | closing report records a command run from the sibling book repo that reaches the `lisp` fences, including extracted/generated/failing counts; non-zero exit is acceptable only with routed follow-up | serious | A-4 / `D-2607-R4NW` | open | | this is the slice's arc-level value |
| F-14 | Required lang implementation gates pass | `cargo fmt --check`; `cargo test -p lykn-cli`; `./bin/lykn test --docs docs/guides/ --docs README.md --docs examples/surface/ --docs examples/kernel/`; `make test-docs`; `make check-cited-paths`; `git diff --check` pass after commit as applicable | serious | AGENTS.md / arc16 | open | | include narrower rationale if any gate is impossible |
| F-15 | Sibling repo checks are run after edits | book and writers-guide `git diff --check`, statuses, and `git ls-files -s AGENTS.md CLAUDE.md` plus `readlink CLAUDE.md` are recorded after edits/commits | serious | slice05 | open | | book `_to_delete/` should remain untouched |
| F-16 | Slice close bubbles up honestly | closing report updates arc16 `arc-plan.md`, project plan/status surfaces, and states whether slice07 remains next or new implementation slices were inserted from book-gate findings | serious | project-management | open | | future defects may add slices |

## What Worked

_(Fill at slice close.)_

## Closure

Open as of 2026-08-20. Rows: 16. Done: 0. Deferred: 0. No-op: 0. Pending: 16.
