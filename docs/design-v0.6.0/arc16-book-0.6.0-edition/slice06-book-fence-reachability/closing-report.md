# arc16 slice06 - Book Fence Reachability Closing Report

Closed by CC on 2026-08-20. CDC verification is pending.

## 1. Source Material Read

- `/Users/oubiwann/.agents/skills/collaboration-framework/SKILL.md` - collaboration posture and artifact discipline.
- `/Users/oubiwann/.agents/skills/collaboration-framework/docs/PROJECT-MANAGEMENT.md` - slice close and bubble-up rules.
- `/Users/oubiwann/.agents/skills/collaboration-framework/templates/LEDGER-DISCIPLINE.md` - per-row evidence expectations.
- `/Users/oubiwann/.agents/skills/rust-guidelines/SKILL.md` - Rust CLI implementation guidance.
- `/Users/oubiwann/.agents/skills/javascript-deno-guidelines/SKILL.md` - Deno/JS workflow boundary guidance.
- `AGENTS.md` - lang repo workflow, gates, and commit trailer rules.
- `assets/ai/SKILL.md` - agent-facing Lykn authoring guidance to keep current.
- `docs/guides/00-lykn-surface-forms.md` - current surface syntax baseline for book examples.
- `docs/guides/11-documentation.md` - documentation-authoring conventions.
- `docs/guides/15-lykn-cli.md` - CLI command reference and wrapper-command guidance.
- `docs/guides/16-testing.md` - test/doctest guidance and annotation semantics.
- `docs/design-v0.6.0/arc16-book-0.6.0-edition/arc-plan.md` - arc16 plan-of-record and ledger.
- `docs/design-v0.6.0/arc16-book-0.6.0-edition/design/fence-wiring-spec.md` - selected fence-first route.
- `docs/backlog/discoveries.md` row `D-2607-R4NW` - permanent discovery row for the unreachable book fences.
- `docs/design-v0.6.0/arc16-book-0.6.0-edition/slice05-book-instruction-bootstrap/cdc-verification.md` - CDC-verified sibling instruction baseline.
- `crates/lykn-cli/src/main.rs` - `lykn test` CLI parsing and dispatch.
- `crates/lykn-cli/src/doctest.rs` - Markdown/HTML doctest extraction, generation, and Deno invocation.
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` - book repo standing instructions.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` - writers-guide standing instructions.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/authoring-guide.md` - chapter-authoring workflow guidance.
- `/Users/oubiwann/lab/cnbb/lykn-writers-guide/new-ch-prompt.md` - new-chapter prompt template.

## 2. Repo Status

Before edits:

| Repo | Command | Result |
|------|---------|--------|
| lang | `git status --short --branch` | `## release/0.6.x` |
| book | `git status --short --branch` | `## main`; `?? _to_delete/` |
| writers-guide | `git status --short --branch` | `## main` |

After sibling commits:

| Repo | Command | Result |
|------|---------|--------|
| book | `git status --short --branch` | `## main`; `?? _to_delete/` remains unrelated and untouched |
| writers-guide | `git status --short --branch` | `## main` |

## 3. Implementation Summary

Lang repo:

- `crates/lykn-cli/src/main.rs` adds repeatable `lykn test --fence TAG` parsing and passes the selected tags into docs mode.
- `crates/lykn-cli/src/doctest.rs` keeps `lykn` as the default Markdown fence, adds opt-in fence selection, preserves comma annotations for every accepted tag, keeps prefix-similar tags such as `lisp-foo` out, and leaves HTML `<script type="text/lykn">` extraction on the existing path.
- `crates/lykn-cli/src/doctest.rs` also falls back from a sibling repo without `project.json` to the checkout that owns the invoked `bin/lykn` for Deno config and compiler imports, while still writing generated doctests under the caller's project tree.
- `assets/ai/SKILL.md`, `docs/guides/15-lykn-cli.md`, and `docs/guides/16-testing.md` document the flag as opt-in and repeatable; none claims `lisp` is the default.
- `docs/backlog/discoveries.md` closes `D-2607-R4NW` as route-implemented and names the remaining re-entry path.

Sibling repos:

- Book repo commit `ee10a47` updates `AGENTS.md` from "pending fence gate" to the landed book command.
- Writers-guide commit `db1777f` updates `AGENTS.md`, `authoring-guide.md`, and `new-ch-prompt.md` with the landed command and mixed-tag sweep.
- Both sibling repos still track `AGENTS.md` as a regular file and `CLAUDE.md` as a symlink to `AGENTS.md`.

## 4. Book-Level Reachability

The final book-level command was run from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Result: non-zero after reaching Deno execution, which is acceptable for this
slice because the gate now sees the book examples.

- Generated 176 test files with 444 blocks and 0 skipped.
- Final result: 417 passed, 27 failed.

The mixed-tag demonstration was also run from the book repo:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

Result: non-zero after reaching Deno execution.

- Generated 177 test files with 447 blocks and 0 skipped.
- Final result: 420 passed, 27 failed.
- The mixed run proves the three existing `lykn` book fences are included when explicitly requested, and those three added blocks pass.

Failures observed in the `lisp` run were classified enough to route the next
work without rewriting chapter prose in this slice:

| Class | Count | Examples |
|-------|-------|----------|
| Kernel-only declaration forms now rejected by strict surface defaults | 7 | bare `const`, `function`, and `let` examples |
| Function examples that end with statement-only function declarations | 3 | stale return-position function examples |
| Missing or stale `import-macros "testing"` examples | 4 | chapter 29 testing examples |
| Expected-output or assertion drift | 3 | overlap diagnostics and reader output expectations |
| Other stale syntax, arity, or type-shape examples | 10 | keyword type syntax, `++` arity, missing `:body`, malformed `match`, `express` arity, array `rest`, destructuring, `assoc` arity, and no-else `if` in expression position |

These failures should re-enter through arc16 slice07
`current-book-drift-refresh`, or as new Discovery rows if triage proves an
implementation/tooling defect instead of stale book prose.

## 5. Verification Transcript

Implementation checks:

- `cargo fmt --check` -> pass.
- `cargo test -p lykn-cli` -> pass.
- `cargo test -p lykn-cli doctest` -> pass, including the focused doctest extractor/generator tests.
- `cargo test -p lykn-cli test_command_parses_repeated_fence_flags` -> pass.
- `cargo build --release` -> pass; `target/release/lykn` was copied to `bin/lykn` before sibling book commands.
- `./bin/lykn test --help` -> pass; help shows repeatable `--fence <FENCE>` with default `lykn` wording.

Lang docs gates after implementation:

- `./bin/lykn test --docs docs/guides/ --docs README.md --docs examples/surface/ --docs examples/kernel/` -> pass; generated 22 test files with 482 blocks, 15 skipped; final `482 passed / 0 failed`.
- `make test-docs` -> pass; generated 22 test files with 482 blocks, 15 skipped; final `482 passed / 0 failed`.

Book command failures and fixes during the slice:

- First unprivileged sibling-book run failed before extraction with a local filesystem permission error creating the generated doctest directory; the command was rerun with the approved sibling write context.
- First privileged book run reached extraction but failed before Deno execution because the book repo has no `project.json`; `doctest.rs` now falls back to the invoked lang checkout for Deno config/compiler imports.
- The final `--fence lisp` and mixed-tag book runs reached Deno execution and produced the counts recorded above.

Sibling checks:

- Book before commit: `git diff --check` -> pass; `git status --short --branch` -> `## main`, `M AGENTS.md`, `?? _to_delete/`.
- Book after commit: `git diff --check` -> pass; `git status --short --branch` -> `## main`, `?? _to_delete/`.
- Book symlink check after commit: `AGENTS.md` mode `100644`; `CLAUDE.md` mode `120000`; `readlink CLAUDE.md` -> `AGENTS.md`.
- Writers-guide before commit: `git diff --check` -> pass; `git status --short --branch` -> `## main`, modified `AGENTS.md`, `authoring-guide.md`, and `new-ch-prompt.md`.
- Writers-guide after commit: `git diff --check` -> pass; `git status --short --branch` -> `## main`.
- Writers-guide symlink check after commit: `AGENTS.md` mode `100644`; `CLAUDE.md` mode `120000`; `readlink CLAUDE.md` -> `AGENTS.md`.

Final lang close-state gates:

- Pre-commit `make check-cited-paths` -> expected failure: 9 citations to the
  new `slice06-book-fence-reachability/closing-report.md` could not resolve
  because the cited-path gate checks `HEAD` and the file was not committed yet.
- Post-commit `make check-cited-paths` -> pass; 628 documents checked on
  `release/0.6.x`, with 601 historical citations accepted via the frozen
  cited-path census.
- `git diff --check` -> pass before commit and before amend.

## 6. Ledger Walk

| Row | Status | Evidence |
|-----|--------|----------|
| F-1 | done | Source list above covers every required prompt file with one-line roles. |
| F-2 | done | Before-status table records lang, book, and writers-guide states; the book `_to_delete/` directory remained untouched. |
| F-3 | done | `main.rs` parses repeatable `--fence`; CLI help shows `--fence <FENCE>`; focused parser test covers repeated values. |
| F-4 | done | `make test-docs` passed with 482 blocks and 0 failures, preserving the expected current docs baseline. |
| F-5 | done | `test_extract_blocks_lisp_ignored_by_default` and `test_extract_blocks_lisp_with_opt_in_fence` prove default-ignore and opt-in extraction. |
| F-6 | done | `test_extract_blocks_lisp_compile_fail_annotation` and `test_extract_blocks_lisp_run_annotation` prove annotations share the existing path. |
| F-7 | done | `test_extract_blocks_lisp_prefix_tag_ignored` proves `lisp-foo` is not accepted by `--fence lisp`. |
| F-8 | done | `test_extract_blocks_repeated_fence_tags_compose`, the CLI parser test, and the book mixed-tag run prove composition. |
| F-9 | done | Existing HTML doctest coverage passed under `cargo test -p lykn-cli` and the explicit docs sweep still ran HTML examples under `examples/{surface,kernel}/`. |
| F-10 | done | `assets/ai/SKILL.md`, guide 15, and guide 16 document `--fence` as opt-in and repeatable without defaulting to `lisp`. |
| F-11 | done | Book commit `ee10a47` and writers-guide commit `db1777f` update the landed gate language while preserving `CLAUDE.md -> AGENTS.md`. |
| F-12 | done | `D-2607-R4NW` is closed as route-implemented with command, counts, and re-entry rule. |
| F-13 | done | Book `--fence lisp` generated 176 files from 444 blocks and reached Deno execution; mixed run generated 177 files from 447 blocks. |
| F-14 | done | Required lang gates passed. Pre-commit `make check-cited-paths` failed only because this new close report was not in `HEAD`; post-commit rerun passed across 628 documents with 601 historical citations accepted. |
| F-15 | done | Sibling statuses, `git diff --check`, `git ls-files -s AGENTS.md CLAUDE.md`, and `readlink CLAUDE.md` are recorded above after edits/commits. |
| F-16 | done | Arc plan, project plan, README, status dashboard, slice ledger, and this report bubble slice06 up as closed by CC with CDC pending and slice07 next. |

## 7. Bubble-Up To arc16

- slice06 `book-fence-reachability` is closed by CC and ready for CDC review.
- arc16 remains open because the book edition is not drafted/closed.
- slice07 `current-book-drift-refresh` remains next. It should consume the 27
  current book-fence failures as the first drift inventory input and split out
  new implementation slices only when a failure proves to be a language,
  tooling, or DevX defect rather than stale chapter material.
