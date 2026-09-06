# Slice 01: treeshake-audit

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | Authoritative emission path(s) for 0.6.0+ identified and documented (native `lykn_lang::codegen` vs `bridge.rs` kernel-JSON path), with the default `lykn compile` route named | `report.md` §Emission paths cites `compile.rs`/`main.rs` file:line + a `lykn compile` run transcript in `evidence/toolchain.md` | serious | slice-doc | open | | Audit step 0; everything downstream branches on this |
| F-2 | Emission inventory complete: every form that can produce a top-level statement is listed with file:line and purity classification, for each live emitter | Inventory table row set ⊇ the classifier's form list (`packages/lang/classifier.js` + `lykn_lang` classifier); cross-check counts match | serious | slice-doc | open | `inventory.md` written 2026-07-07 (attested; R2/R8/R10 CDC-verified at source, rest agent-reported); systematic classifier cross-check pending at close | Pure-declaration vs load-time effect |
| F-3 | Fixture suite covers all nine surface families + the partial-import two-module app | `ls fixtures/` matches the family list in `slice-doc.md` §Scope | correctness | slice-doc | open | 12 files in `fixtures/` written 2026-07-07 (attested): f01–f09 + macros-impl + app-lib/app-main; syntax grounded in corpus greps | Fixtures must NOT live under `test/` |
| F-4 | Toolchain probe recorded: Deno version, `deno bundle` availability, esbuild version, clean `cargo build --release` | `evidence/toolchain.md` contains the four command transcripts | correctness | slice-doc | open | | CC phase P0 |
| F-5 | CDC per-fixture predictions committed **before** the experiment runs | `git log` shows the predictions commit strictly precedes the first `evidence/` commit | serious | slice-doc | open | `predictions.md` written 2026-07-07 (attested); **operator must commit it before handing off cc-prompt.md** — commit-order verify at close | The discipline that makes the experiment a test, not decoration |
| F-6 | Tree-shake experiment executed: esbuild metafile + minified/unminified bundles captured | Files exist under `evidence/`; `metafile.json` parses (`jq . evidence/metafile.json`) | serious | slice-doc | open | | CC phase P2 |
| F-7 | Every prediction/outcome divergence investigated and dispositioned | `report.md` divergence table: divergence count == disposition count | serious | slice-doc | open | | Zero divergences is a valid (recorded) outcome |
| F-8 | Cross-emitter diff performed if both paths are live; else no-op citing F-1 | `evidence/cross-emitter-diff.md` exists, or no-op rationale referencing F-1's finding | correctness | slice-doc | open | | |
| F-9 | dist metadata findings recorded (`sideEffects` absence; generated `deno.json` fields relevant to shaking) | `grep -rn sideEffects crates/lykn-cli/src/dist.rs` returns nothing; `report.md` §Dist metadata cites it | correctness | slice-doc | open | | `sideEffects` absence pre-verified 2026-07-07 grep; re-verify at close |
| F-10 | Corpus scan run: walker over compiled corpus; effectful top-level statements tabulated with file:line | `evidence/corpus-scan.json` exists; report summary row count == `jq '.findings \| length'` | correctness | slice-doc | open | | CC phase P3 |
| F-11 | Audit report complete: severity-graded findings + 0.7.0 recommendations | `report.md` contains §Emission paths, §Inventory, §Predictions vs outcomes, §Dist metadata, §Corpus scan, §Recommendations | serious | slice-doc | open | | |
| F-12 | No production code changed by this slice | `git diff --stat <open>..<close>` touches only `project03-language-evolution/` (and `CLAUDE.md` layout line) | correctness | slice-doc | open | | Diagnostic-only guarantee |

## What Worked

_(At slice close.)_

## Closure

_(At slice close: commit SHA, date, verifier, row counts.)_
