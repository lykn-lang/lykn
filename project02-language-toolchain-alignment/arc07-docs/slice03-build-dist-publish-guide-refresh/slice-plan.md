# Slice 03: build-dist-publish-guide-refresh

> **Open set** (2026-08-08, CDC). Refresh the highest-value arc07 drift cluster
> from slice02: build/dist/publish docs and SKILL guidance. This slice is mostly
> docs, with one small user-facing CLI string edge if it remains stale.

## 1. Goal

Bring the user-facing build/dist/publish guidance into line with the current
0.6.0 CLI:

- `lykn build` writes intermediate artifacts to `target/lykn/build/`;
- `lykn dist` stages publishable packages into `target/lykn/dist/`;
- `lykn build --dist` is a deprecated alias, not the primary workflow;
- `lykn publish --no-build` assumes `target/lykn/dist/`;
- `lykn publish` has a dirty-tree gate and explicit `--allow-dirty` opt-out;
- generated publish files are generated from source config and should not be
  hand-written.

The user should leave this slice with one coherent story across
`assets/ai/SKILL.md`, guide 10, guide 12-04, and guide 15.

## 2. Scope

### In

- Update `assets/ai/SKILL.md` publishing and generated-files guidance from
  `lykn build --dist` / repo-root `dist/` to `lykn dist` /
  `target/lykn/dist/`.
- Update `docs/guides/15-lykn-cli.md`:
  - ID-04d should describe `lykn dist`, not `lykn build --dist`;
  - ID-04e should document `target/lykn/dist/`, `--no-build`, `--allow-dirty`,
    and the dirty-tree gate;
  - stale "moving to target/..." prose should become current-state prose.
- Update `docs/guides/12-deno/12-04-publishing.md` for the same publishing
  pipeline and counter-cues.
- Update `docs/guides/10-project-structure.md` for the reference layout and
  conventions that directly describe build/dist/publish output.
- Fix the user-facing publish error string in `crates/lykn-cli/src/main.rs` if
  it still says `dist/<pkg>` or recommends `lykn build --dist`.
- Disposition the root `dist/` debris finding (`D-2607-2FHM`): if absent, record
  the no-op evidence; if present, remove or route it explicitly.
- Keep the old command visible only as a deprecated alias when that is useful
  to a reader migrating from older docs.

### Out

- Do not rewrite the broader Deno runtime/task-runner/manual-pipeline examples
  in guides 12-01, 12-02, or 12-03. That is slice04.
- Do not implement the no-else `if` compiler fix. That is now arc10 slice04.
- Do not write the optional `.d.ts` documentation pass unless a tiny mention is
  required to keep generated-file lists accurate; exact `.d.ts` behavior needs
  its own fixture-backed pass.
- Do not append to `scripts/cited-paths-census.tsv`.

## 3. Verification Approach

Use slice02's closing report as the before-state inventory, then verify against
the live CLI:

- `./bin/lykn build --help`
- `./bin/lykn dist --help`
- `./bin/lykn publish --help`
- targeted `rg` sweeps for stale `lykn build --dist`, repo-root `dist/`,
  `--no-build`, `--allow-dirty`, `target/lykn/build`, and
  `target/lykn/dist` wording
- `make test-docs`
- `make check-cited-paths`
- if `crates/lykn-cli/src/main.rs` changes, run the relevant Rust test gate
  (`cargo test -p lykn-cli`, or a narrower justified command if available)

## 4. Exit Criteria

1. The SKILL and guides 10/12-04/15 agree on `lykn dist` and
   `target/lykn/{build,dist}`.
2. `lykn publish --no-build`, `--allow-dirty`, and the dirty-tree gate are
   documented without encouraging bypass.
3. Generated publish files are described as generated from source config, not
   hand-written into the staged tree.
4. `D-2607-6BQX`, `D-2607-V5DK`, and `D-2607-2FHM` are either closed or
   explicitly re-routed with evidence.
5. Broader Deno workflow drift remains untouched and queued for slice04.
6. `make test-docs` and `make check-cited-paths` pass.
