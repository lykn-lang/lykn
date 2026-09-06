# CC Prompt - arc07 / slice03 build-dist-publish-guide-refresh

You are CC. Implement the arc07 slice03 build/dist/publish guide refresh on
`release/0.6.x`.

## Required context

Load the collaboration framework and ledger discipline before editing. Because
this slice may touch a Rust CLI string, load the Rust guidelines before editing
`crates/lykn-cli/src/main.rs`. Because the docs describe Deno/JS publishing
workflows, load the Deno JavaScript guidelines before changing those workflow
sections.

Read:

- `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/closing-report.md`
- `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/cdc-verification.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/slice-doc.md`
- `docs/design-v0.6.0/arc07-docs/slice03-build-dist-publish-guide-refresh/ledger.md`
- `assets/ai/SKILL.md`
- `docs/guides/10-project-structure.md`
- `docs/guides/12-deno/12-04-publishing.md`
- `docs/guides/15-lykn-cli.md`
- `docs/backlog/discoveries.md` rows `D-2607-6BQX`, `D-2607-V5DK`, and
  `D-2607-2FHM`
- `crates/lykn-cli/src/main.rs` around the `publish` help/error strings

Also run and record:

```sh
./bin/lykn build --help
./bin/lykn dist --help
./bin/lykn publish --help
git ls-files dist
```

## Scope

Update the SKILL and guides so a user sees one current workflow:

- `lykn build` -> `target/lykn/build/`
- `lykn dist` -> `target/lykn/dist/`
- `lykn build --dist` only as a deprecated alias, if mentioned at all
- `lykn publish --no-build` assumes `target/lykn/dist/`
- `lykn publish` enforces a dirty-tree gate, with explicit `--allow-dirty`
  opt-out

Fix the stale publish error string in `crates/lykn-cli/src/main.rs` if it still
names `dist/<pkg>` or recommends `lykn build --dist`.

Disposition the root `dist/` debris finding. In the CDC planning probe,
`git ls-files dist` was empty and `dist/` did not exist; verify in your tree and
record the actual result.

## Non-goals

- Do not rewrite guides 12-01, 12-02, or 12-03. That is slice04.
- Do not implement the no-else `if` compiler fix. That is arc10 slice04.
- Do not do the `.d.ts` documentation pass except for a minimal generated-file
  mention if needed for accuracy.
- Do not append to `scripts/cited-paths-census.tsv`.
- Never pass `--allow-dirty`, `--force`, or `--no-verify` just to get a gate
  green.

## Verification

Close every ledger row with evidence. Required gates:

```sh
make test-docs
make check-cited-paths
```

If `crates/lykn-cli/src/main.rs` changes, also run the relevant Rust gate. Use
`cargo test -p lykn-cli` unless you find and justify a narrower command.

At close, write `closing-report.md` with a row-by-row ledger walk and bubble-up
to arc07. Do not create `cdc-verification.md`; CDC writes that after reviewing
your close.
