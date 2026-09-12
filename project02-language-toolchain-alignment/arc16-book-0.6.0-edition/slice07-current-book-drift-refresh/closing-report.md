# arc16 slice07 - Current Book Drift Refresh Closing Report

Closed by CC on 2026-09-12. CDC verification pending.

## 1. Source Material Read

- `/Users/oubiwann/.codex/skills/collaboration-framework/SKILL.md` - collaboration posture, Expedited Mode routing, and proposed-done boundary.
- `/Users/oubiwann/.codex/skills/project-management/SKILL.md` - project/arc/slice routing entrypoint.
- `/Users/oubiwann/.codex/skills/project-management/guides/README.md` - required wayfinder and Expedited Mode mechanics.
- `/Users/oubiwann/.codex/skills/project-management/guides/01-scales-of-work.md` - slice sizing and recomposition vocabulary.
- `/Users/oubiwann/.codex/skills/project-management/guides/02-canonical-planning-worktree.md` - planning worktree and canonical file layout.
- `/Users/oubiwann/.codex/skills/project-management/guides/03-planning-top-down.md` - project/arc/slice plan update rules.
- `/Users/oubiwann/.codex/skills/work-verification/SKILL.md` - ledger discipline entrypoint.
- `/Users/oubiwann/.codex/skills/work-verification/guides/01-ledger-discipline.md` - row status/evidence rules.
- `planning/AGENTS.md` and `0.6.x/AGENTS.md` - branch/worktree ownership, gates, and trailers.
- project02 project plan, README, status JSON/HTML, arc16 status JSON/HTML - current project/arc status surfaces.
- arc16 `arc-plan.md`, `ledger.md`, slice06 close/CDC reports - arc plan of record and prior book-fence evidence.
- `design/book-drift-inventory-0.6.0.md` - historical May inventory, treated as input.
- `design/dogfooding-friction-log.md` - pre-book implementation-first finding context.
- `backlog/discoveries.md` and `backlog/README.md` - permanent finding protocol and Book rows.
- book `AGENTS.md`; writers-guide `AGENTS.md`, `authoring-guide.md`, `planned-toc.md` - sibling standing instructions and ToC/reference state.

## 2. Repo Status Before Edits

| Repo | Status | HEAD |
|---|---|---|
| planning | `## planning` | `65d501f` |
| lang 0.6.x | `## release/0.6.x` | `cd3e95e` |
| book | `## main`; `?? _to_delete/` | `ee10a47` |
| writers-guide | `## main` | `db1777f` |

The book `_to_delete/` directory was pre-existing and preserved.

## 3. Book Fence Evidence

Recorded in `artifacts/current-book-drift-inventory-2026-09.md`:

- `--fence lisp`: exit 1 after Deno execution; 176 generated files, 444 blocks, 0 skipped, 417 passed, 27 failed.
- `--fence lisp --fence lykn`: exit 1 after Deno execution; 177 generated files, 447 blocks, 0 skipped, 420 passed, 27 failed.

Logs: `/private/tmp/slice07-book-lisp.log` and `/private/tmp/slice07-book-lisp-lykn.log`.

## 4. Triage Outcome

All 27 current failures are classified in the refreshed inventory. Most are book/content drift: kernel forms compiled as surface examples, intentional compile-error examples missing annotations or updated expected text, placeholder/comparative examples compiled as Lykn, and testing chapter examples without runnable macro context.

One implementation defect was found: the JS compiler rejects `func` returning `fn` in three book examples, while the Rust CLI accepts and compiles a focused probe. This is now `D-2609-FNRT` and routed to the new slice08 `js-fn-return-parity` open set.

## 5. Instruction-Path Drift

Fixed active sibling instruction paths:

- book `AGENTS.md`: arc16 plan path and Discovery Register path now point at the planning worktree and `backlog/README.md`.
- writers-guide `AGENTS.md`: same path repair.
- writers-guide `authoring-guide.md`: source-material references now use `project02-language-toolchain-alignment/arc16-book-0.6.0-edition/` and `backlog/discoveries.md`.

Remaining old `docs/design-v0.6.0` references found under planning are historical prompts, close reports, or migration evidence, not active standing instructions.

## 6. Ledger Walk

| Row | Status | Evidence |
|---|---|---|
| F-1 | done | Required-reading list above. |
| F-2 | done | Repo baseline table above. |
| F-3 | done | Fence evidence recorded in the inventory. |
| F-4 | done | 27/27 failures triaged in the inventory. |
| F-5 | done | Historical May rows/buckets reconciled in the inventory. |
| F-6 | done | Active sibling planning-path drift repaired. |
| F-7 | done | `D-2609-FNRT` plus slice08 open set. |
| F-8 | done | Next order now starts with slice08 implementation parity. |
| F-9 | done | No book `src/` chapter rewrites. |
| F-10 | done | Planning/status surfaces updated with explicit scoped paths. |
| F-11 | done | Verification listed below. |

## 7. Verification

- Planning scoped `git diff --check` passed for project02/status/backlog paths.
- Book `git diff --check`, `git ls-files -s AGENTS.md CLAUDE.md`, and `readlink CLAUDE.md` passed after the instruction edit.
- Writers-guide `git diff --check`, `git ls-files -s AGENTS.md CLAUDE.md`, and `readlink CLAUDE.md` passed after instruction edits.
- No lang source/user docs were edited; `make test-docs` and `make check-cited-paths` were not required by the slice prompt.

## 8. Bubble-Up To arc16

slice07 is CC-closed with CDC verification pending. The refreshed inventory recommends inserting slice08 before normal chapter work. The provisional chapter slices are shifted:

1. slice08 `js-fn-return-parity` - implementation parity for `D-2609-FNRT`.
2. slice09 `toolchain-and-project-structure-chapters`.
3. slice10 `language-surface-chapters`.
4. slice11 `edition-close-and-release-gate`.

Normal chapter rewrite work remains blocked until slice08 closes or explicitly defers the compiler mismatch.
