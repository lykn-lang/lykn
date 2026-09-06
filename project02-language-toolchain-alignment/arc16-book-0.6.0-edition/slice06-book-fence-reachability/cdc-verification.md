# arc16 slice06 - CDC Verification

Verified by CDC on 2026-08-21. Verdict: **pass**.

slice06 is CDC-verified at lang commit
`3c13aa2d611b25c00cb8ee8ae56f145e5673ec76`. The implementation makes the
book's `lisp` fenced Lykn examples reachable through the opt-in, repeatable
`lykn test --docs --fence <tag>` path while preserving default `lykn`-only
doctest behavior.

## Scope Checked

Repos and commits:

- lang: `3c13aa2d611b25c00cb8ee8ae56f145e5673ec76`
  (`test: add opt-in doctest fence tags`) on `release/0.6.x`.
- book: `ee10a47859a07b3dd1accfc1d101ed7ccfe0d78c`
  (`docs: update book fence gate guidance`) on `main`; only the pre-existing
  untracked `_to_delete/` remains.
- writers-guide: `db1777fec9fa2cfee5cfc040084669d48e6f11be`
  (`docs: record landed book fence gate`) on `main`.

The lang diff is appropriately scoped to:

- `crates/lykn-cli/src/main.rs` for the repeatable `--fence` flag and parser
  test;
- `crates/lykn-cli/src/doctest.rs` for accepted-fence extraction, annotation
  preservation, prefix guarding, fallback compiler/config routing, and focused
  tests;
- lang guide/SKILL/discovery/planning surfaces for the landed gate and routed
  follow-up.

Sibling diffs are instruction-only and preserve `CLAUDE.md -> AGENTS.md`.

## Reproduced Evidence

Lang gates:

| Check | Result |
|-------|--------|
| `cargo fmt --check` | pass |
| `cargo test -p lykn-cli` | pass: 98 lib tests, 176 CLI tests, all listed integration tests, and 0 doctests passed |
| `./bin/lykn test --docs docs/guides/ --docs README.md --docs examples/surface/ --docs examples/kernel/` | pass: 22 generated files, 482 blocks, 15 skipped, `482 passed / 0 failed` |
| `make test-docs` | pass: refreshed release binary/build artifacts, then `482 passed / 0 failed` |
| `make check-cited-paths` | pass: 628 documents checked; 601 historical citations accepted |
| `git diff --check` | pass |

Book reachability gates, run from `/Users/oubiwann/lab/cnbb/lykn`:

| Check | Result |
|-------|--------|
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp` | expected non-zero after Deno execution: 176 generated files, 444 blocks, 0 skipped, `417 passed / 27 failed` |
| `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn` | expected non-zero after Deno execution: 177 generated files, 447 blocks, 0 skipped, `420 passed / 27 failed` |

The non-zero book result is acceptable for this slice because the slice's claim
is reachability, not book cleanliness. The failing examples are visible and
countable, and the closing report routes them to slice07
`current-book-drift-refresh` or new Discovery rows if triage proves a tooling or
language defect.

Sibling checks:

| Repo | Check | Result |
|------|-------|--------|
| book | `git status --short --branch` | `## main`; `?? _to_delete/` only |
| book | `git diff --check` | pass |
| book | `git ls-files -s AGENTS.md CLAUDE.md`; `readlink CLAUDE.md` | `AGENTS.md` mode `100644`; `CLAUDE.md` mode `120000`; symlink target `AGENTS.md` |
| writers-guide | `git status --short --branch` | `## main` |
| writers-guide | `git diff --check` | pass |
| writers-guide | `git ls-files -s AGENTS.md CLAUDE.md`; `readlink CLAUDE.md` | `AGENTS.md` mode `100644`; `CLAUDE.md` mode `120000`; symlink target `AGENTS.md` |

The generated book `target/` directory created during the approved verification
probe was removed after the probe, leaving only the pre-existing `_to_delete/`
untracked directory.

## Ledger Verification

Rows opened: 16. Rows addressed by CC: 16. Rows CDC-reproduced or reconciled:
16. Deferred: 0. No-op: 0. Silent drops: 0.

| Row | CDC disposition |
|-----|-----------------|
| F-1 | Reconciled: required-reading list is present in the closing report and matches the slice prompt. |
| F-2 | Reconciled: repo status claims match current lang/book/writers-guide state, including the book `_to_delete/` caveat. |
| F-3 | Reproduced by code inspection and `cargo test -p lykn-cli`: `--fence` is repeatable and parser coverage exists. |
| F-4 | Reproduced: explicit docs sweep and `make test-docs` both pass at 482/0 with default `lykn` behavior. |
| F-5 | Reproduced by focused extractor tests and the book `--fence lisp` run. |
| F-6 | Reproduced by focused annotation tests for opt-in `lisp` fences. |
| F-7 | Reproduced by focused prefix-guard test; `lisp-foo` is not accepted by `--fence lisp`. |
| F-8 | Reproduced by parser/extractor tests and the mixed book run adding the three `lykn` blocks. |
| F-9 | Reproduced by `cargo test -p lykn-cli` and docs sweep over HTML examples. |
| F-10 | Reconciled by guide/SKILL sweep: `--fence` is opt-in and repeatable; `lisp` is not made default. |
| F-11 | Reconciled by sibling commit/status/symlink inspection. |
| F-12 | Reconciled: `D-2607-R4NW` is closed as route-implemented with slice07/new-discovery re-entry. |
| F-13 | Reproduced by both book reachability commands and matching counts. |
| F-14 | Reproduced: required lang gates pass. |
| F-15 | Reproduced: sibling statuses, diff checks, and symlink facts match. |
| F-16 | Reconciled: arc/project/status surfaces keep arc16 open, mark slice06 verified after this file, and leave slice07 next. |

## Bubble-Up Check

slice06 delivered its assigned piece of arc16: the book's `lisp` examples are
now reachable by an automated gate without changing the book fences and without
weakening default guide doctests.

No new implementation slice is required from CDC verification itself. The first
27 visible book failures are already routed to slice07
`current-book-drift-refresh`, with the correct escape hatch: if slice07 proves a
failure is a language, tooling, or DevX defect rather than stale prose, it must
be registered and routed as a new slice or explicit deferral before the book
teaches around it.

arc16 remains open. slice07 remains next.
