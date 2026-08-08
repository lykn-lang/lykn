# Slice 03: build-dist-publish-guide-refresh - Ledger

Build/dist/publish guide refresh for arc07. Per
`collaboration-framework/templates/LEDGER-DISCIPLINE.md`.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| B-1 | Current build/dist/publish substrate is loaded before editing | closing report lists `slice02-current-drift-recon/closing-report.md`, this open set, `assets/ai/SKILL.md`, guides 10/12-04/15, `./bin/lykn * --help`, and `crates/lykn-cli/src/main.rs` publish string evidence | serious | slice-doc | open | | prevents stale May-era command spelling from driving edits |
| B-2 | `assets/ai/SKILL.md` teaches `lykn dist` / `target/lykn/dist/` as the staging workflow | `rg -n 'lykn build --dist|dist/<pkg>|Never hand-write.*dist|Run lykn build --dist' assets/ai/SKILL.md` returns no stale primary workflow hits; closing report classifies any remaining deprecated-alias mention | serious | slice02 recon | open | | generated files remain generated |
| B-3 | `docs/guides/15-lykn-cli.md` ID-04d/ID-04e match current CLI help | compare guide text with `./bin/lykn build --help`, `./bin/lykn dist --help`, and `./bin/lykn publish --help`; no stale `assume dist/`, `reads from dist/`, or "moving to target" claims remain | correctness | slice02 recon | open | | includes `--no-build`, `--allow-dirty`, and dirty-tree gate |
| B-4 | `docs/guides/12-deno/12-04-publishing.md` uses the current lykn publishing pipeline | `rg -n 'lykn build --dist| into dist/|bypasses lykn build --dist' docs/guides/12-deno/12-04-publishing.md` returns no stale primary workflow hits; raw `deno publish`/`npm publish` remain counter-cues only | correctness | slice02 recon | open | | guide 12-04 should not fight guide 15 |
| B-5 | `docs/guides/10-project-structure.md` reference layout and conventions no longer teach repo-root `dist/` as the staged publish output | targeted read around the reference tree and conventions; `rg -n 'staged output \\(lykn build --dist\\)|Compiled .js output in dist/|Reference directory structure.*dist/' docs/guides/10-project-structure.md` returns no stale hits | correctness | slice02 recon + D-2607-2FHM | open | | broad Deno task/runtime examples stay for slice04 unless directly part of this layout section |
| B-6 | User-facing publish error string is current if touched | `rg -n 'Did .*lykn build --dist|lykn publish: dist/' crates/lykn-cli/src/main.rs` returns no stale publish error text, or closing report justifies no code change; if code changes, run Rust test gate | serious | D-2607-V5DK | open | | CC must load Rust guidelines before editing Rust |
| B-7 | Root `dist/` debris finding is dispositioned | `git ls-files dist` and `test ! -e dist`; backlog row `D-2607-2FHM` updated to closed/no-op/routed with evidence | polish | D-2607-2FHM | open | | current CDC probe found no `dist/` path, but CC should verify in its own tree |
| B-8 | Discovery rows are updated honestly | `D-2607-6BQX`, `D-2607-V5DK`, and `D-2607-2FHM` in `docs/backlog/discoveries.md` have final or re-routed statuses matching the slice outcome | serious | backlog | open | | no silent-drop from the recon inventory |
| B-9 | Slice boundary is preserved | `git diff --name-only` is limited to the scoped guides/SKILL, optional `crates/lykn-cli/src/main.rs`, backlog/status surfaces, and slice close artifacts | correctness | slice-doc | open | | guides 12-01/12-02/12-03 belong to slice04 |
| B-10 | Docs/path gates green at close | `make test-docs` and `make check-cited-paths` pass; Rust gate passes if `main.rs` changes | serious | process note + P-21 | open | | doc-touching slice; cited-path gate must stay green |

## What Worked

_(At slice close. Capture patterns that kept the refresh bounded.)_

## Closure

Open.
