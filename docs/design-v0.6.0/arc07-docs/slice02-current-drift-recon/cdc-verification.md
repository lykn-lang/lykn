# arc07 / slice02 CDC Verification: Current Drift Recon

**Verdict: accepted — slice02 closed.** CC's recon stayed inside its stated
boundary, reproduced the old seed lists against the current branch, and surfaced
the next arc07 shape without editing `docs/guides/**` or `assets/ai/SKILL.md`.

## Verification

| Check | Result | Evidence strength |
|---|---|---|
| Commit scope | `git show --stat --name-status --oneline 66a3565` shows only `slice02-current-drift-recon/closing-report.md` added and `ledger.md` modified. `git diff --name-status 17117b3..66a3565` matches. | reproduced |
| Worktree state | `git status --short --branch` reported `## release/0.6.x` before CDC edits. | reproduced |
| Ledger closure | `ledger.md` closes R-1 through R-8, with the recon-only boundary in R-7 and the docs/path gates in R-8. | reproduced |
| Closing report completeness | `closing-report.md` lists the read set, current sweeps, behavioural probes, both seed-document disposition tables, still-open drift, and recommended next slice breakdown. | reproduced by artifact review |
| No guide/SKILL edit smuggling | The commit diff excludes `docs/guides/**` and `assets/ai/SKILL.md`. | reproduced |
| Cited-path gate | `make check-cited-paths` passed: 581 documents on `release/0.6.x`, 601 historical citations accepted via `scripts/cited-paths-census.tsv`. | reproduced |
| Docs gate | `make test-docs` passed: 476 passed, 0 failed, 15 skipped. | reproduced |

## Behaviour Reproduction

The key non-doc finding is real. A CDC fixture containing:

```lykn
(bind label (if (> 1 0) "items"))
```

produced:

- `./bin/lykn check <temporary no-else-if fixture>`:
  `ok (1 top-level expressions)` plus the unrelated unused-binding warning.
- `./bin/lykn compile <temporary no-else-if fixture>`:
  emitted invalid JavaScript, `const label = throw new TypeError(...)`.
- `./bin/lykn run <temporary no-else-if fixture>`:
  failed only at Deno parse time with `Expression expected`.

That confirms CC's classification: the guide's desired semantics are right
(`docs/guides/00-lykn-surface-forms.md` says this should be a compile error),
but the compiler/check path currently lets invalid JS escape at rc=0.

The CLI-surface claims also reproduce:

- `./bin/lykn --version` reports `lykn 0.6.0-dev`.
- `./bin/lykn build --help` says build writes `target/lykn/build/` and marks
  `--dist` deprecated in favor of `lykn dist`.
- `./bin/lykn dist --help` stages packages into `target/lykn/dist/`.
- `./bin/lykn publish --help` documents `--no-build` as assuming
  `target/lykn/dist/` and exposes `--allow-dirty`.

## CDC Finding

No blocking findings against slice02. One close-discipline action was required:
CC's close report correctly says arc07 should not close yet, so CDC must bubble
that result into the arc/project status surfaces before the next slice is
scoped. This verification performs that bubble-up.

## Bubble-Up

arc07 stays active. The remaining guide/SKILL work should split as:

1. `slice03 · build-dist-publish-guide-refresh` — update `assets/ai/SKILL.md`,
   guides 10, 12-04, and 15 around `lykn dist`,
   `target/lykn/{build,dist}`, generated publish files, `--allow-dirty`, and
   `--no-build`.
2. `slice04 · deno-workflow-reconciliation` — audit guides 12-01, 12-02, and
   12-03 for raw Deno/manual `dist/` examples, preserving intentional
   low-level runtime teaching while converting normal project workflows to
   `lykn` commands.
3. Compiler follow-up outside the docs-only arc07 slice stream:
   no-else `if` in expression position must fail `lykn check`/`compile` instead
   of emitting invalid JS. Routed to `docs/backlog/discoveries.md` as
   `D-2608-W2HF`.

**Route update (2026-08-08):** after this verification, the operator promoted
`D-2608-W2HF` from backlog-only routing into reopened arc10
`slice04-no-else-if-expression-error`; see
`docs/design-v0.6.0/arc10-compiler-completion/arc-plan.md` v1.6. The original
slice02 verification result is unchanged.

The optional `.d.ts` documentation pass remains a later arc07 candidate, but it
needs a targeted artifact-producing fixture before its exact user-facing claims
are written.
