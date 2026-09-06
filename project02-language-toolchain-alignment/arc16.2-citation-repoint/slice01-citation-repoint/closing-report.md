# Closing report - `03-citation-repoint`

**Closed:** 2026-08-08. **Branch:** `release/0.6.x`.

## Summary

This slice turned the cited-path gate from correctly red to useful green.
Migrated citations were repointed, four already-decided artifact homes were
populated, historical narration was preserved instead of rewritten into false
claims, and the frozen census shrank in place from 631 accepted pairs to 601.

Source commits:

- `774e9eb` - `Finish citation repoint cleanup`
- `a3055c9` - `Clean migrated planning citations`
- `2df2130` - `Finish design citation census shrink`

## Ledger walk

| Row | Verdict | Evidence |
|---|---|---|
| R-1 | done | crates/design citations were repointed to `docs/design/06-final/`; the final directory citation was corrected in `project01-mvp/arc01-js-foundations/artifacts/dev/0011-phase-2-core-forms-implementation-guide.md`; `make check-cited-paths` is green at HEAD. |
| R-2 | done | example citations were repointed to tracked `examples/surface/` homes where those examples now live; the corresponding census rows were deleted. |
| R-3 | done with caveat | Mixed classes were walked. Resolvable live references were repointed; historical movement prose was de-citationized; residual classes remain frozen only under named operator dispositions (`D-2607-D3NL`, `D-2607-5TDW`, `D-2607-W2FJ`, `D-2607-Q8LM`). The caveat is format-level: the TSV has no reason column, so the reasons live here and in the discovery rows rather than in each census row. |
| R-4 | done | The four files already assigned homes by committed planning docs were added under `project02-language-toolchain-alignment/arc01-build-publish-toolchain/` and `project02-language-toolchain-alignment/arc03-compiler-coherence/`; their internal stale citations were cleaned in `a3055c9`. |
| R-5 | done | Sentence-level review preserved historical move/rename claims. Historical examples were fenced, unbackticked, or reworded when repointing would have changed the meaning of the sentence. |
| R-6 | done | `scripts/cited-paths-census.tsv` changed by deletion only: 631 accepted pairs before the slice, 601 after `2df2130`; no regenerated census and no new exemptions. |

## Verification

Run after the close docs were committed:

```text
make check-cited-paths
=> passed (567 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)

deno test --config project.json -A test/integration/cited-paths.test.js
=> 22 passed / 0 failed

git diff --check
=> passed

git status --short
=> clean after the close commit
```

## Silent-drop diff

No slice-owned class was silently dropped. The residual accepted census is not a
claim that the old paths are healthy; it is the already-recorded historical
closure for artifacts that either cannot resolve in this repo or belong to a
different branch/decision surface.

The named residual homes are:

- `D-2607-D3NL`: accepted historical ignored-tree citations, permanently
  asserted-tier rather than repaired.
- `D-2607-5TDW`: release-0.7.x defects, not a 0.6.x repoint target.
- `D-2607-W2FJ`: root-vs-leaf exemption governance decision.
- `D-2607-Q8LM`: red-until-commit contract decision, already recorded closed.

## Bubble-up

`03-citation-repoint` is closed. `P-21` is now materially narrower: the gate is
green, the census is smaller, and the remaining open claim is whether
`02-artifact-homes` has been independently verified and closed. The next release
sequence should therefore move from "finish 03" to "CDC-verify/close 02", then
continue with arc15 slice04, arc07, arc16, and arc09.
