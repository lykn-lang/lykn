# slice03 - CLI Scaffold Package Runway Ledger

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Required implementation substrate is read before edits | close report lists `AGENTS.md`, Lykn SKILL/guides 10/15/16, Rust guidelines, Deno JS guidelines if JS is touched, arc16 arc-plan, slice02 close/CDC verification, and the relevant source files with one-line roles | serious | slice-doc | open | | prevents stale-guide and wrong-seam fixes |
| F-2 | Fresh scaffold supports project-local Lykn command shape (`D-2608-BINW`) | fresh scratch project from `lykn new`; `./bin/lykn --version` exits 0 without manual symlink/copy repair; automated test or scaffold template assertion covers it | serious | slice02 CDC | open | | choose symlink/copy/wrapper deliberately and document portability limits |
| F-3 | Fresh scaffolded Lykn test runs through testing macros (`D-2608-TDSL`) | fresh scratch project from `lykn new`; `./bin/lykn test` exits 0 using the scaffolded Lykn test; regression test covers testing macro package metadata/resolution | serious | slice02 CDC | open | | do not silently switch scaffold to JS tests unless routed |
| F-4 | Build includes nested package source or fails loudly (`D-2608-BREC`) | fixture with nested `.lykn`/`.lyk` and `.js` helpers; `./bin/lykn build` emits/copies nested outputs preserving relative paths, or exits non-zero with documented flat-package diagnostic | serious | slice02 CDC | open | | green build with missing runtime files is the defect |
| F-5 | Source-file `lykn run` handles relative imports or is intentionally narrowed (`D-2608-RIMP`) | fixture with source entrypoint importing local/nested module; `./bin/lykn run packages/.../*.lykn` exits 0, or command exits with documented diagnostic steering to built entrypoint | serious | slice02 CDC | open | | likely seam: source-context handling in `cmd_run` |
| F-6 | 0.6.0 source-ownership floor is explicit (`D-2608-SOWN`) | changed scaffold/build/dist/docs distinguish user-authored non-Lykn files from Lykn-owned generated output; no generated artifacts are written into package source as part of build/test/run | correctness | operator clarification | open | | full manifest redesign may defer, but the 0.6 floor must be honest |
| F-7 | Automated regression coverage pins each accepted behavior | `cargo test -p lykn-cli` includes targeted tests for scaffold/bin, recursive build/copy, and run import behavior; `cargo test -p lykn-lang` or targeted Deno tests included if relevant surfaces changed | serious | ledger discipline | open | | no acceptance-by-transcript only |
| F-8 | Fresh scratch acceptance demo matches the new normal workflow | close report records scratch path, exact commands, exits, and outputs for scaffold, version, build, test, lint, source run, and built run | serious | slice-doc | open | | this is the user-facing proof |
| F-9 | Guide/SKILL command truth is reconciled where behavior changed | `rg` sweeps for stale scaffold/test/build/run claims; changed guides/SKILL documented; `make test-docs` passes | correctness | arc16 book gate | open | | docs only where implementation changed truth |
| F-10 | Lang repo standing gates pass and close artifacts bubble up | `cargo fmt --check`; relevant cargo/Deno/Lykn tests; `git diff --check`; `make check-cited-paths`; `make test-docs`; close report includes row walk and arc bubble-up | serious | standing bar | open | | closing report should recommend the next arc16 slice |

## What Worked

Open at slice start. Fill this during close with patterns that made the runway
repair tractable, especially tests or demos that should become standard for
future dogfood-derived implementation slices.
