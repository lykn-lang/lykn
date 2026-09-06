# arc07 / slice03 CDC Verification: build-dist-publish-guide-refresh

**Verdict: accepted - slice03 closed.** CC's close at `dcf23f5` matches the
slice03 open set: the build/dist/publish docs now describe the current CLI
contract, the stale publish error string is corrected, and the named backlog
rows are closed or no-op with evidence. arc07 remains active because slice04
Deno workflow reconciliation and the arc-level composition rows are still open.

## Verification

| Check | Result | Evidence strength |
|---|---|---|
| Commit scope | `git show --stat --name-status --oneline dcf23f5` touched only `assets/ai/SKILL.md`, `crates/lykn-cli/src/main.rs`, the scoped guide/backlog/arc/slice files, and the slice03 closing artifacts. `git diff --name-only 578ec5d..dcf23f5` matches the scoped file set; guides 12-01, 12-02, and 12-03 were not edited. | reproduced |
| Worktree state | `git status --short --branch` reported only `## release/0.6.x` before CDC edits. | reproduced |
| Ledger closure | `ledger.md` closes B-1 through B-10; row count matches the opening ledger, with no missing or silently dropped rows. | reproduced by artifact review |
| Closing report completeness | `closing-report.md` lists substrate, live CLI help evidence, changed files, a B-1..B-10 ledger walk, verification commands, and explicit deferrals. | reproduced by artifact review |
| Live CLI contract | `./bin/lykn build --help` says build output is `target/lykn/build/`; `./bin/lykn dist --help` stages `target/lykn/dist/`; `./bin/lykn publish --help` exposes `--no-build` and `--allow-dirty`. | reproduced |
| Stale workflow sweeps | The B-2, B-4, B-5, and B-6 `rg` commands returned no stale primary-workflow hits. Guide 15's remaining `lykn build --dist` mention is explicitly the deprecated alias, which is allowed by the slice scope. | reproduced |
| Backlog dispositions | `D-2607-6BQX` and `D-2607-V5DK` are closed; `D-2607-2FHM` is no-op with the `git ls-files dist` / `test ! -e dist` evidence. | reproduced |
| Root `dist/` state | `git ls-files dist` returned empty output; `test ! -e dist` exited 0. | reproduced |
| Rust gate | `cargo test -p lykn-cli` passed, including 98 library tests, 156 CLI binary tests, and the publishing integration tests. | reproduced |
| Docs gate | `make test-docs` passed: 476 passed, 0 failed, 15 skipped. | reproduced |
| Cited-path gate | `make check-cited-paths` passed: 587 documents on `release/0.6.x`, 601 historical citations accepted via `scripts/cited-paths-census.tsv`. | reproduced |
| Whitespace check | `git diff --check` exited 0. | reproduced |

## Row Walk

| ID | CDC disposition |
|----|-----------------|
| B-1 | Accepted. The closing report names the required docs/SKILL/source files, live help commands, and root `dist` probes. |
| B-2 | Accepted. `assets/ai/SKILL.md` now teaches `lykn dist` and `target/lykn/dist/`; the stale-primary-workflow grep returned no hits. |
| B-3 | Accepted. Guide 15 matches the live help for build/dist/publish, including `--no-build`, `--allow-dirty`, dirty-tree behaviour, and the deprecated alias classification. |
| B-4 | Accepted. Guide 12-04 routes normal publishing through `lykn publish` / `lykn dist`; direct registry commands remain counter-cues only. |
| B-5 | Accepted. Guide 10's reference layout and conventions use `target/lykn/build/` and `target/lykn/dist/`, not repo-root `dist/` staging. |
| B-6 | Accepted. `main.rs` now reports missing publish staging under `target/lykn/dist/...` and recommends `lykn dist`; the Rust gate reproduced. |
| B-7 | Accepted. There is no tracked or filesystem root `dist` path; the discovery row is validly no-op. |
| B-8 | Accepted. The three backlog rows named by the slice have final statuses matching the delivered work. |
| B-9 | Accepted. The diff stayed inside the planned slice boundary; guides 12-01, 12-02, and 12-03 remain for slice04. |
| B-10 | Accepted. Docs/path/Rust/whitespace gates all reproduced. |

## Bubble-Up

slice03 delivered its assigned arc07 piece: the build/dist/publish drift cluster
is closed. It does not close arc07. The remaining arc07 work is still:

1. `slice04-deno-workflow-reconciliation`: reconcile guides 12-01, 12-02, and
   12-03 around raw Deno/manual `dist/` examples versus normal `lykn` wrapper
   workflows.
2. Arc-level composition rows A-3/A-4/A-5: confirm all current guide/SKILL
   drift is fixed or routed, sample executable guide claims against the shipped
   0.6.0 behaviour, and keep `make test-docs` / `make check-cited-paths` green
   at arc close.

The compiler bug remains outside this docs slice and is still correctly routed
to reopened arc10 `slice04-no-else-if-expression-error`.

## What Worked

The slice's narrow stale-text greps worked well: they distinguished current
workflow claims from intentional deprecated-alias mentions, which avoided both
over-editing and papering over real drift.
