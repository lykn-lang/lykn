# arc16 / slice02 CDC Verification: dogfood-implementation-runway

**Verdict: accepted — slice02 is closed and CDC-verified, with implementation
work routed forward.**

CC's close at `35f8fcc` delivered the required scratch dogfood run, self-grade,
and routing recommendations. CDC independently checked the commit shape, replayed
the scratch project success path, reproduced the expected red probes, and ran the
standing documentation gates. CDC also repaired one close-discipline gap: the
newly named dogfood findings now have permanent discovery-register rows instead
of living only in the slice close report.

## Commit Review

- `35f8fcc` changes only this slice's `closing-report.md` and `ledger.md`.
- The commit includes the shared co-author trailers.
- The worktree was clean before CDC verification.
- F-1 through F-9 are marked `done` in the ledger, and each row points at the
  closing report.

## Evidence Reproduced

From the scratch project at:

```text
/private/tmp/lykn-dogfood-run-20260808-204448/record-shape-tools
```

CDC replayed:

| Command | Result |
|---------|--------|
| `./bin/lykn build` | passed; package built under `target/lykn/build/record-shape-tools/` |
| `./bin/lykn test` | passed; 3 tests, 0 failed |
| `./bin/lykn lint packages/record-shape-tools test` | passed; no lint findings across 6 files |
| `./bin/lykn run target/lykn/build/record-shape-tools/main.js` | passed; demo printed the expected summary and valid record |

CDC also reproduced the expected red probes:

| Command | Result |
|---------|--------|
| `./bin/lykn lint` | exit 2 with `usage: lykn lint <paths...>` |
| `./bin/lykn run packages/record-shape-tools/main.lykn` | exit 1; temp-compiled source import resolves `./mod.js` from the temp directory |

## Standing Gates

- `git diff --check`: passed before CDC edits.
- `make test-docs`: passed before CDC edits, 476 passed / 0 failed.
- `make check-cited-paths`: failed at CC HEAD because the close report cited the
  scratch-only JS test path as an inline path. CDC repaired that citation as
  transcript prose rather than weakening the gate.

Final post-commit gate results are recorded in the CDC commit and summary.

## Row Walk

| ID | CDC disposition |
|----|-----------------|
| F-1 | Accepted. CC read the required Lykn guidance and recorded the source list. |
| F-2 | Accepted. The project was created from scratch outside tracked source trees. |
| F-3 | Accepted. The scratch library has enough real API shape to exercise modules, types, normalization, validation, collections, and demos. |
| F-4 | Accepted. The successful build/test/lint/run path is replayable and was reproduced by CDC. |
| F-5 | Accepted. The self-grade is specific rather than ceremonial, with both successes and failures called out. |
| F-6 | Accepted. Guide/SKILL weaknesses are identified from direct project friction. |
| F-7 | Accepted and strengthened. The new `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and `D-2608-RIMP` findings were added to the permanent discovery register. |
| F-8 | Accepted. The report recommends a concrete next slice: implementation routing before book prose. |
| F-9 | Accepted. The closing report, ledger, and bubble-up surfaces now reflect the slice result. |

## Bubble-Up

slice02 does not make arc16 book-ready. It proves the implementation-first rule
is still necessary: a fresh project can be made to work, but normal scaffold,
test, build recursion, source-run, export, local-binding, branching, and
generated-manifest ownership surfaces are not yet coherent enough for the book
to teach as final.

The next arc16 move should be a narrowly scoped implementation-routing slice for
the CLI/scaffold/package runway findings:

- `D-2608-BINW` — decide whether `lykn new` creates a project-local `bin/lykn` or
  whether guides stop promising one.
- `D-2608-TDSL` — make scaffolded Lykn tests expand through the current testing
  package path, or change the scaffold/test guidance.
- `D-2608-BREC` — make `lykn build` include nested package source directories, or
  declare and enforce the single-directory package rule.
- `D-2608-RIMP` — make source-file `lykn run` resolve relative imports from the
  source file/package home, or steer documented demos to built entrypoints.

The earlier language-surface decisions remain in force: `D-2608-XPRT`,
`D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN` must land or receive explicit
deferrals before book/writers-guide prose normalizes the final surface.
