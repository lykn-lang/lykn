# slice03 - CLI Scaffold Package Runway Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required implementation substrate is read before edits | close report lists `AGENTS.md`, Lykn SKILL/guides 10/15/16, Rust guidelines, Deno JS guidelines if JS is touched, arc16 arc-plan, slice02 close/CDC verification, and the relevant source files with one-line roles | serious | slice-doc | done | [`closing-report.md`](./closing-report.md) §1 | prevents stale-guide and wrong-seam fixes |
| F-2 | Fresh scaffold supports project-local Lykn command shape (`D-2608-BINW`) | fresh scratch project from `lykn new`; `./bin/lykn --version` exits 0 without manual symlink/copy repair; automated test or scaffold template assertion covers it | serious | slice02 CDC | done | [`closing-report.md`](./closing-report.md) §2, §4, §5 | implemented by copying active executable to scaffold `bin/lykn` |
| F-3 | Fresh scaffolded Lykn test runs through testing macros (`D-2608-TDSL`) | fresh scratch project from `lykn new`; `./bin/lykn test` exits 0 using the scaffolded Lykn test; regression test covers testing macro package metadata/resolution | serious | slice02 CDC | done | [`closing-report.md`](./closing-report.md) §2, §4, §5, §6 | bare `testing` scaffold plus local overlay for checkout dogfood and `macroEntry` for publish metadata |
| F-4 | Build includes nested package source or fails loudly (`D-2608-BREC`) | fixture with nested `.lykn`/`.lyk` and `.js` helpers; `./bin/lykn build` emits/copies nested outputs preserving relative paths, or exits non-zero with documented flat-package diagnostic | serious | slice02 CDC | done | [`closing-report.md`](./closing-report.md) §2, §4, §5 | implemented recursive build/dist traversal with preserved relative paths |
| F-5 | Source-file `lykn run` handles relative imports or is intentionally narrowed (`D-2608-RIMP`) | fixture with source entrypoint importing local/nested module; `./bin/lykn run packages/.../*.lykn` exits 0, or command exits with documented diagnostic steering to built entrypoint | serious | slice02 CDC | done | [`closing-report.md`](./closing-report.md) §2, §4, §5 | workspace source runs execute generated package build output |
| F-6 | 0.6.0 source-ownership floor is explicit (`D-2608-SOWN`) | changed scaffold/build/dist/docs distinguish user-authored non-Lykn files from Lykn-owned generated output; no generated artifacts are written into package source as part of build/test/run | correctness | operator clarification | done | [`closing-report.md`](./closing-report.md) §2, §3, §4 | arbitrary non-Lykn package source allowed; build/dist do not copy it to generated JS output |
| F-7 | Automated regression coverage pins each accepted behavior | `cargo test -p lykn-cli` includes targeted tests for scaffold/bin, recursive build/copy, and run import behavior; `cargo test -p lykn-lang` or targeted Deno tests included if relevant surfaces changed | serious | ledger discipline | done | [`closing-report.md`](./closing-report.md) §4, §6 | no acceptance-by-transcript only |
| F-8 | Fresh scratch acceptance demo matches the new normal workflow | close report records scratch path, exact commands, exits, and outputs for scaffold, version, build, test, lint, source run, and built run | serious | slice-doc | done | [`closing-report.md`](./closing-report.md) §5 | user-facing proof captured |
| F-9 | Guide/SKILL command truth is reconciled where behavior changed | `rg` sweeps for stale scaffold/test/build/run claims; changed guides/SKILL documented; `make test-docs` passes | correctness | arc16 book gate | done | [`closing-report.md`](./closing-report.md) §3, §6 | guides 10/15 updated; doctests passed |
| F-10 | Lang repo standing gates pass and close artifacts bubble up | `cargo fmt --check`; relevant cargo/Deno/Lykn tests; `git diff --check`; `make check-cited-paths`; `make test-docs`; close report includes row walk and arc bubble-up | serious | standing bar | done | [`closing-report.md`](./closing-report.md) §6, §7, §8 | final committed-tree cited-path check passed after close-report citation cleanup |

## What Worked

- The slice02 dogfood transcript mapped directly to implementation seams:
  scaffold templates, macro package metadata, build recursion, and source-run
  output placement.
- The new end-to-end scaffold regression is a useful pattern for future
  dogfood-derived CLI slices because it tests the same commands the book will
  teach.
- Keeping the registry-oriented `project.json` while writing a gitignored local
  overlay let source-checkout dogfood pass before the fixed testing package is
  published, without changing the publish-time dependency contract.
