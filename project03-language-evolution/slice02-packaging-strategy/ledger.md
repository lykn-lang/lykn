# Slice 02: packaging-strategy

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| D-1 | Deno's absence from the official Debian archive is independently verified (not just web-search-attested), with the actual blocking reason cited from a primary source | `evidence/deno-debian-check.md` contains `apt-cache policy deno` (or equivalent) output against a real Debian mirror, plus a citation to the upstream issue/Debian bug tracker | serious | slice-doc | open | | This is the load-bearing claim the whole Debian-route recommendation rests on; if it's wrong, the report's recommendation is wrong |
| D-2 | Runtime-dependency inventory (`deno` mandatory, `npm`/`git` conditional, `make`/`bash` not invoked by the binary) re-verified against current source | `grep -rn "Command::new" crates/lykn-cli/src/` output matches the slice-doc's Background list | correctness | slice-doc | open | | Re-verify since this session's grep was via a subagent, not directly reproduced by CC |
| D-3 | Homebrew route decision documented (custom tap, not homebrew-core) with a draft formula (`artifacts/lykn.rb`) that lists a correct `depends_on "deno"` and a correct `cargo install --locked` build stanza | `artifacts/lykn.rb` exists; `ruby -c artifacts/lykn.rb` (or `brew audit` if available) passes | serious | slice-doc | open | | |
| D-4 | Draft Homebrew formula validated against a real Homebrew installation, if one is reachable from the execution context; otherwise a no-op with the reason (no macOS/brew environment reachable) recorded | `evidence/brew-validation.md` with `brew audit --strict` / `brew install --build-from-source` transcript, or an explicit no-op note | correctness | slice-doc | open | | Expect no-op if CC runs in a non-macOS sandbox — operator may need to run this step locally |
| D-5 | Debian route decision documented (self-hosted APT repo via `cargo-deb`, not official archive) with a draft packaging config (`artifacts/Cargo.toml.deb-metadata` or `artifacts/debian/`) | Draft config exists and names the exact `cargo-deb` invocation | serious | slice-doc | origin: operator decision 2026-07-07 | open | | Route already decided by the operator; this row verifies the config, not the decision |
| D-6 | Draft `.deb` build actually succeeds locally against `lykn-cli`'s real `Cargo.toml` | `evidence/cargo-deb-build.md` contains the `cargo deb` (or `cargo deb -p lykn-cli`) transcript and the resulting `.deb` filename | serious | slice-doc | open | | If it fails, the failure + diagnosis is the deliverable, not silently deferred |
| D-7 | CI gap analysis complete (current: ubuntu-latest x86_64 only, no release job) with a draft multi-platform workflow addition (not merged) covering at minimum linux-x86_64, linux-arm64, macos-x86_64, macos-arm64 | `report.md` §CI gap cites `.github/workflows/ci.yml`; `artifacts/release-workflow-draft.yml` exists | correctness | slice-doc | open | | Draft only — out of scope to merge this slice |
| D-8 | Strategy report complete with a recommended 0.7.0 arc/slice breakdown for the implementation work (tap creation, apt-repo hosting, CI matrix, release automation) | `report.md` contains §Runtime deps, §Homebrew route, §Debian route, §CI gap, §Recommended arc/slice breakdown | serious | slice-doc | open | | This is the artifact the 0.7.0 project-plan consumes |
| D-9 | No production code changed by this slice; all drafts confined to this slice's directory | `git diff --stat <open>..<close>` touches only `project03-language-evolution/` (and `CLAUDE.md`/README layout lines) | correctness | slice-doc | open | | Diagnostic-only guarantee, same as slice 01's F-12 |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row counts.)_
