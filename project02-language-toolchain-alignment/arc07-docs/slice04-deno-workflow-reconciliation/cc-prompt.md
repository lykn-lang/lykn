# CC Prompt - arc07 / slice04 deno-workflow-reconciliation

You are CC. Implement arc07 slice04, the Deno workflow reconciliation, on
`release/0.6.x`.

## Required Context

Load the collaboration framework and ledger discipline before editing. Because
this slice changes Deno/JavaScript workflow documentation, also load the
Deno-based JavaScript guidelines before editing the guides.

Read:

- `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/cdc-verification.md`
- `docs/design-v0.6.0/arc07-docs/slice04-deno-workflow-reconciliation/slice-doc.md`
- `docs/design-v0.6.0/arc07-docs/slice04-deno-workflow-reconciliation/ledger.md`
- `docs/guides/12-deno/12-01-runtime-basics.md`
- `docs/guides/12-deno/12-02-testing.md`
- `docs/guides/12-deno/12-03-task-runner.md`
- `docs/guides/10-project-structure.md`
- `docs/guides/15-lykn-cli.md`
- `assets/ai/SKILL.md`

Also run and record:

```sh
./bin/lykn build --help
./bin/lykn test --help
./bin/lykn lint --help
./bin/lykn run --help
```

## Scope

Update guides 12-01, 12-02, and 12-03 so the normal lykn project workflow uses
the lykn CLI:

- build: `lykn build` -> `target/lykn/build/`
- test: `lykn test` -> compiled tests under `target/lykn/test/`
- lint: `lykn lint` over Lykn source
- run: `lykn run <file>` for Lykn entry points
- task runner examples: `deno task` is fine, but task bodies should call lykn
  wrappers for normal lykn project actions

Preserve direct Deno examples when the section is teaching Deno itself:
permissions, `Deno:*` APIs, `Deno.test`, assertions, `deno.json` task syntax,
and similar runtime-level mechanics. If you keep a direct Deno command that
looks superficially like a stale workflow, classify it in the closing report.

## Non-Goals

- Do not change compiler or CLI behaviour.
- Do not implement the no-else `if` compiler fix; that is arc10 slice04.
- Do not do the `.d.ts` documentation pass.
- Do not append to `scripts/cited-paths-census.tsv`.
- Do not broadly rewrite guide 10, guide 15, or `assets/ai/SKILL.md`; use them
  as reference material unless a narrow cross-reference correction is necessary.
- Never pass `--allow-dirty`, `--force`, or `--no-verify` just to get a gate
  green.

## Verification

Close every ledger row with evidence. Required gates:

```sh
make test-docs
make check-cited-paths
git diff --check
```

Use targeted `rg` sweeps from the ledger to demonstrate that stale normal
workflow guidance is gone or explicitly classified as retained runtime teaching.

At close, write `closing-report.md` with a row-by-row ledger walk and a bubble-up
to arc07. Do not create `cdc-verification.md`; CDC writes that after reviewing
your close.
