# arc07 / slice02 Closing Report: Current Drift Recon

**Branch/HEAD:** `release/0.6.x` at `17117b3`.

This slice was recon-only. I did not edit `docs/guides/**` or
`assets/ai/SKILL.md`.

## Inputs Read

- Slice prompt, slice doc, and ledger:
  `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/cc-prompt.md`,
  `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/slice-doc.md`,
  `docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/ledger.md`
- Arc/project context:
  `docs/design-v0.6.0/project-plan.md`,
  `docs/design-v0.6.0/arc07-docs/arc-plan.md`
- Seed docs:
  `docs/design-v0.6.0/arc07-docs/design/guide-drift-cleanup-plan.md`,
  `docs/design-v0.6.0/arc07-docs/design/proposed-skill-and-guide-additions.md`
- Current guidance surface:
  `assets/ai/SKILL.md` and all 20 files under `docs/guides/`
- Current code evidence for behavioral claims:
  `crates/lykn-cli/src/main.rs`, `crates/lykn-cli/src/dist.rs`,
  `crates/lykn-lang/src/emitter/dts.rs`, plus `./bin/lykn` probes.

## Current Sweep

Required command:

```sh
rg -n "Biome|biome|deno publish|npm publish|deno test|deno run|deno fmt|deno lint|cargo build|node |src/|dist/|target/lykn|package\\.json|jsr\\.json|\\? suffix|if.*expression|\\):[A-Za-z_-]" docs/guides assets/ai/SKILL.md
```

Hit count by file from `rg --count-matches`:

| File | Hits | Classification |
|---|---:|---|
| `assets/ai/SKILL.md` | 45 | Mostly correct no-bypass guidance, but stale `lykn build --dist` / `dist/` spelling remains. |
| `docs/guides/15-lykn-cli.md` | 21 | Still-open: publish/build docs predate `lykn dist` and `target/lykn/dist/`; compile examples still use manual `dist/`. |
| `docs/guides/12-deno/12-03-task-runner.md` | 20 | Still-open: task examples teach raw Deno and manual `dist/` pipeline. |
| `docs/guides/12-deno/12-01-runtime-basics.md` | 17 | Still-open: runtime guide still teaches manual `src/` -> `dist/` flow. |
| `docs/guides/14-no-node-boundary.md` | 17 | Mostly done: no Biome; dependency/no-Node guidance is current. |
| `docs/guides/10-project-structure.md` | 27 | Still-open: reference tree and pipeline still use `dist/`, not `target/lykn/{build,dist}`. |
| `docs/guides/12-deno/12-04-publishing.md` | 11 | Partly done: raw publish commands are counter-cues, but build/dist spelling is stale. |
| Other guide files | 2-9 each | Mostly expected examples (`?`, Deno APIs, target test paths) or local context; no Biome. |

Targeted sweeps:

```sh
find docs/guides -path '*13-biome*' -print
rg -n '13-biome|Biome|biome' docs/guides assets/ai/SKILL.md
rg -n 'target/lykn/build|target/lykn/dist|lykn dist|lykn build --dist|dist/' docs/guides assets/ai/SKILL.md
rg -n 'allow-dirty|dirty|no-build' docs/guides assets/ai/SKILL.md crates/lykn-cli/src/main.rs
rg -n '^## ID-.*d\\.ts|\\.d\\.ts|emit_dts|TypeScript consumer|type declaration' docs/guides assets/ai/SKILL.md crates/lykn-cli/src/dist.rs crates/lykn-lang/src/emitter/dts.rs
```

Results:

- No Biome or 13-biome hits remain in the current guide/SKILL surface.
- `lykn build --dist` is still documented as the primary publish staging command,
  but `./bin/lykn build --help` marks it deprecated and `./bin/lykn dist --help`
  is the current command.
- `docs/guides/15-lykn-cli.md:294-306` says `--no-build` assumes `dist/`; the
  CLI says it assumes `target/lykn/dist/` (`crates/lykn-cli/src/main.rs:161-162`).
- Dirty publish safety exists in code (`crates/lykn-cli/src/main.rs:1031-1042`)
  but is not documented in the guide/SKILL surface.
- `.d.ts` machinery exists in code (`crates/lykn-cli/src/dist.rs:262-273`,
  `crates/lykn-lang/src/emitter/dts.rs:1-4`), but user-facing guide coverage is
  thin (`docs/guides/05-type-discipline.md:523-533` only mentions `.d.ts` as an
  option).

## Behavioral Probes

Commands run:

```sh
./bin/lykn --version
./bin/lykn build --help
./bin/lykn publish --help
./bin/lykn dist --help
./bin/lykn build
./bin/lykn compile /private/tmp/arc07-recon-valid-predicate.lykn
./bin/lykn compile /private/tmp/arc07-recon-if-expression.lykn
./bin/lykn compile /private/tmp/arc07-recon-if-no-else-expression.lykn
./bin/lykn run /private/tmp/arc07-recon-if-no-else-expression.lykn
./bin/lykn compile /private/tmp/arc07-recon-method-on-expression.lykn
```

Findings:

- `./bin/lykn --version` reports `lykn 0.6.0-dev`.
- `./bin/lykn build --help` says `build` writes `target/lykn/build/`; the
  `--dist` flag is deprecated in favor of `lykn dist`.
- `./bin/lykn publish --help` says `--no-build` assumes `target/lykn/dist/`.
- `./bin/lykn dist --help` says it stages workspace packages into
  `target/lykn/dist/`.
- `./bin/lykn build` succeeded and printed three built packages under
  `target/lykn/build/`.
- `valid?` compiles to `function isValid` and exports `isValid`; the May proposal
  claiming `?` names produce invalid JS is stale.
- `(bind label (if (> 1 0) "items" "empty"))` compiles to a JS ternary; the May
  proposal claiming `if` in expression position always emits invalid JS is stale.
- `(bind label (if (> 1 0) "items"))` does not fail `lykn check` or
  `lykn compile`; it emits invalid JS (`const label = throw ...`) and `lykn run`
  fails when Deno parses it. This contradicts the current guide claim at
  `docs/guides/00-lykn-surface-forms.md:797-802` that it is a compile error.
- `((express parts):join "")` is rejected with the current DD-64 diagnostic and
  thread-or-bind fix-it, matching `docs/guides/09-anti-patterns.md:1006-1033`.

## Seed Disposition: Guide-Drift Cleanup Plan

| Seed item | Status | Evidence and rationale |
|---|---|---|
| Step 1, Biome -> Deno sweep | done | No `Biome`/`biome` hits in `docs/guides` or `assets/ai/SKILL.md`; headers now say `deno lint` + `deno fmt`, for example `docs/guides/11-documentation.md:10-11`. |
| Step 2, 13-biome decommission | done | `find docs/guides -path '*13-biome*' -print` returned no paths; `rg -n '13-biome|Biome|biome' docs/guides assets/ai/SKILL.md` returned no hits. |
| Step 3, raw publishing commands in publishing guide | done, with follow-up | `docs/guides/12-deno/12-04-publishing.md:18-30` and `:39-51` teach `lykn publish`; raw `deno publish` / `npm publish` mentions are counter-cues. Follow-up: same file still says staging goes through `lykn build --dist` and `dist/` (`:18-20`, `:39-41`, `:75-80`). |
| Step 4, `deno test` / `deno run` drift in CLI guide | done for old specific lines, broader drift still-open | `docs/guides/15-lykn-cli.md:180-197` documents `lykn test`; `:157-176` documents `lykn run`. Still-open examples remain in Deno task/runtime guides, especially `docs/guides/12-deno/12-01-runtime-basics.md:148-160` and `docs/guides/12-deno/12-03-task-runner.md:17-58`. |
| Step 5, DD-49 SKILL naming update | done | `assets/ai/SKILL.md:594-616` documents predicate prefix detection and punctuation abbreviations, including arrow and macro overrides. Current behavior probe confirms `valid?` -> `isValid`. |
| Step 6, DD-50 surface-forms guide updates | done, with behavior defect | `docs/guides/00-lykn-surface-forms.md:753-781` documents `do`; `:797-813` documents position-aware `if` and the `?` style rule. The no-else compile-error claim at `:801-802` is not true in the CLI today: compile/check exit 0 and emit invalid JS. |
| Step 7, DD-50 SKILL style guidance | done | `assets/ai/SKILL.md:575` states the hard LLM rule: `?` in expression position, `if` in statement position. |
| Step 8, other M2 drift verification | partly still-open | `deno add` is closed by `docs/guides/14-no-node-boundary.md:86-93`; `?` suffix is current in `docs/guides/02-api-design.md:528-550`; remaining real drift is build/dist layout and raw Deno/manual pipeline examples. |
| Thread 3, M11 build-dir docs | still-open | Code and CLI are on `target/lykn/build` / `target/lykn/dist` (`crates/lykn-cli/src/main.rs:113-126`, `crates/lykn-cli/src/dist.rs:567-618`), but guides still teach `dist/` in `docs/guides/10-project-structure.md:113-135`, `:356-358`, `:500-506`, and `docs/guides/15-lykn-cli.md:240-313`. |
| Thread 3, M13 publish dirty-check docs | still-open | Dirty check and `--allow-dirty` exist in code (`crates/lykn-cli/src/main.rs:1031-1042`), but `rg -n 'allow-dirty|dirty' docs/guides assets/ai/SKILL.md` finds no guide/SKILL documentation. |
| Thread 1, M10 `.d.ts` docs | still-open | `.d.ts` generation code exists, but current guide coverage is minimal (`docs/guides/05-type-discipline.md:523-533`) and publish/build guides do not explain the generated declaration artifacts. Workspace build did not produce observable `.d.ts` artifacts under `target/lykn/build/`, so artifact behavior needs a targeted fixture in the implementation slice. |
| Thread 1, surface-macros JS-loading docs | defer | No current guide target was established by the seed; no drift was visible in the required guide/SKILL sweep. Re-enter only if a user-facing macro-authoring guide is scoped. |
| Thread 1, mycelium friction docs | partly done, partly folded into target-layout follow-up | `assets/ai/SKILL.md:67-74` teaches no top-level `src/`; `docs/guides/16-testing.md:477-500` teaches package-specifier test imports through `target/lykn/build`. Guide 10/15 still need the target-layout refresh. |
| Thread 2, DD-36/DD-37 architecture docs | defer | Seed targets `docs/dev/`, not `docs/guides` or `assets/ai/SKILL.md`; no current guide/SKILL drift found in this slice. |
| Thread 2, V-06 analyzer decision docs | done for current user guidance | `assets/ai/SKILL.md:565-573` and `docs/guides/15-lykn-cli.md:201-236` document `lykn lint` as the source-lint pass and Deno lint as compiled-output lint. |
| Thread 2, error-format alignment | defer | No current hit in the required sweep or targeted reads showed user-facing error-format drift. |
| Thread 2, `compileBoth` adoption | defer | This is developer/testing documentation, not current guide/SKILL drift. |
| Thread 4, M12 `lykn lint` docs | done | `docs/guides/15-lykn-cli.md:201-236`, `assets/ai/SKILL.md:565-573`, and `docs/guides/09-anti-patterns.md:1006-1011` show the linter surfaced in CLI, skill, and rule catalog docs. |

## Seed Disposition: Proposed Skill and Guide Additions

| Proposed item | Status | Evidence and rationale |
|---|---|---|
| 1. Add publishing to SKILL document selection | done, but stale command wording | `assets/ai/SKILL.md:109` adds "Publishing a package". It still points at ID-04d/ID-04e, whose command spelling is now stale. |
| 2. Add SKILL publishing workflow | done, but stale command/path wording | `assets/ai/SKILL.md:147-166` adds the workflow and raw-publish counter-cue. It still says `lykn build --dist` and `dist/<pkg>/`; current CLI says `lykn dist` and `target/lykn/dist/`. |
| 3. Add no top-level `src/` guidance to guide 10 | still-open in guide 10; done in SKILL | `assets/ai/SKILL.md:67-74` has the rule. `docs/guides/10-project-structure.md:98-112` shows package-root files but does not explicitly warn against top-level `src/`; `:500` still uses `src/main.lykn`. |
| 4. Add staging-scope note to CLI guide | still-open, superseded by `lykn dist` | `docs/guides/15-lykn-cli.md:240-258` describes package-kind staging but not package-root/no-`src` scope, and it documents deprecated `lykn build --dist` as primary. |
| 5. Add publishing files to guide 10 layout | partly done, stale target path | `docs/guides/10-project-structure.md:113-120` includes generated `deno.json`, `package.json`, `README.md`, and `LICENSE`, but omits `jsr.json` and still locates the generated tree at `dist/` instead of `target/lykn/dist/`. |
| 6. Clarify `if` vs `?` | superseded | The old proposal said `if` in expression position produces invalid JS. Current docs correctly teach position-aware compilation at `docs/guides/00-lykn-surface-forms.md:797-813`; two-branch behavior probe compiles to a ternary. No-else behavior is a compiler defect, not the old doc claim. |
| 7. Add anti-patterns for `?` suffix and if-as-expression | stale / superseded | `?` suffix is valid now (`assets/ai/SKILL.md:596`, `docs/guides/02-api-design.md:528-550`, behavior probe). `if` with else in expression position is valid now. Guide 09's ID-47 is now the arc15 method-on-expression rule (`docs/guides/09-anti-patterns.md:1006-1033`) and is current. |

## Current Still-Open Drift

1. **Build/dist/publish documentation should be one focused implementation
   slice.** Update `assets/ai/SKILL.md`, `docs/guides/10-project-structure.md`,
   `docs/guides/12-deno/12-04-publishing.md`, and
   `docs/guides/15-lykn-cli.md` from `lykn build --dist` / `dist/` to
   `lykn dist` / `target/lykn/dist/`, while preserving the deprecation note for
   users who still see the alias.
2. **Raw Deno/manual pipeline examples need a separate Deno guide pass or a
   tightly scoped subtask.** `docs/guides/12-deno/12-01-runtime-basics.md`,
   `docs/guides/12-deno/12-02-testing.md`, and
   `docs/guides/12-deno/12-03-task-runner.md` still teach manual compile/run/test
   flows. Some are valid Deno-level explanations; the next slice should decide
   which are intentional low-level references and which should become `lykn`
   wrapper workflows.
3. **Publish dirty-check and `--allow-dirty` are undocumented.** Code has the
   gate and opt-out; guides/SKILL do not.
4. **`.d.ts` user documentation is incomplete.** The implementation exists in
   code, but docs need an artifact-producing fixture before describing the exact
   behavior.
5. **No-else `if` in expression position is a behavior defect.** Current docs say
   compile error; current CLI emits invalid JS and only fails at Deno parse time.
   This should be filed outside arc07 docs or used as a compiler follow-up row.

## Recommended Next Slice Breakdown

Do not close arc07 yet. Split the remaining work:

1. **slice03: build-dist-publish guide refresh.** Update SKILL + guides 10, 12-04,
   and 15 for `lykn dist`, `target/lykn/build`, `target/lykn/dist`, generated
   publish files, `--allow-dirty`, and `--no-build`. This is the highest-value
   user-facing drift and has clear code evidence.
2. **slice04: Deno low-level workflow reconciliation.** Audit guides 12-01,
   12-02, and 12-03 for raw Deno/manual `dist/` examples. Mark intentional Deno
   runtime examples as such; convert normal project workflows to `lykn` commands.
3. **Compiler follow-up outside arc07 or as a dependency row:** fix no-else `if`
   expression diagnostics so `lykn check`/`compile` fail before emitting invalid
   JS.
4. **Optional later slice:** `.d.ts` docs with a targeted artifact fixture, if the
   generated declaration path is meant to be user-facing in 0.6.0.

## Close Verification

```sh
git diff --name-only
=> docs/design-v0.6.0/arc07-docs/slice02-current-drift-recon/ledger.md

make test-docs
=> ok | 476 passed | 0 failed
=> Documentation tests passed

make check-cited-paths
=> Cited-path check passed (580 documents on release/0.6.x; 601 historical citations accepted via scripts/cited-paths-census.tsv)
```

Note: `git diff --name-only` reports tracked-file diffs only. The new
`closing-report.md` is visible in `git status --short` until staged.
