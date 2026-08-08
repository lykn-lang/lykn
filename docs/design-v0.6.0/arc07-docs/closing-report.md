# arc07 Closing Report: Documentation & Guide Alignment

Date: 2026-08-08
Status: Closed - gate GO

## Capability Verdict

arc07 delivered its capability: `docs/guides/` and `assets/ai/SKILL.md` are
aligned with the current 0.6.0 language and toolchain surface for the guide
drift that arc07 owned. The arc removed the stale doctest blocks, re-grounded
the old guide/SKILL seed lists, refreshed build/dist/publish guidance, and
reconciled the Deno workflow guides so normal Lykn project work starts from the
lykn CLI wrappers.

The only live compiler mismatch surfaced by the arc, no-else `if` in expression
position, is not papered over as docs truth. It is explicitly routed to reopened
arc10 `slice04-no-else-if-expression-error` as `D-2608-W2HF`, and guide 00 now
names it as a known 0.6.0-dev defect until the compiler follow-up lands.

## Slice Walk

| Slice | Outcome | Evidence |
|---|---|---|
| slice01 doctest-drift-fix | closed | `0731048`; [`slice01-doctest-drift-fix/cdc-verification.md`](./slice01-doctest-drift-fix/cdc-verification.md); guide doctests moved from 464/8 to green. |
| slice02 current-drift-recon | closed/CDC-verified | `66a3565`; [`slice02-current-drift-recon/closing-report.md`](./slice02-current-drift-recon/closing-report.md); [`slice02-current-drift-recon/cdc-verification.md`](./slice02-current-drift-recon/cdc-verification.md). |
| slice03 build-dist-publish-guide-refresh | closed/CDC-verified | `dcf23f5`; [`slice03-build-dist-publish-guide-refresh/closing-report.md`](./slice03-build-dist-publish-guide-refresh/closing-report.md); [`slice03-build-dist-publish-guide-refresh/cdc-verification.md`](./slice03-build-dist-publish-guide-refresh/cdc-verification.md). |
| slice04 deno-workflow-reconciliation | closed/CDC-verified | `ae31c75` + CDC close `af69f70`; [`slice04-deno-workflow-reconciliation/closing-report.md`](./slice04-deno-workflow-reconciliation/closing-report.md); [`slice04-deno-workflow-reconciliation/cdc-verification.md`](./slice04-deno-workflow-reconciliation/cdc-verification.md). |

Slice count matches the arc-plan breakdown: four planned slices, four closed.

## Composition Check

The slices compose into the arc capability:

- The doctest drift that made CI red is closed; current `make test-docs`
  reports 476 passed and 0 failed.
- The old May guide/SKILL seed list has a disposition for every item. The
  concrete 0.6.0 docs drift became slice03, slice04, or explicit routing.
- Build/dist/publish guidance now uses `lykn build`, `lykn dist`,
  `target/lykn/{build,dist}`, `--no-build`, `--allow-dirty`, and current dirty
  publish behaviour.
- Deno workflow guidance now preserves direct Deno teaching for permission,
  runtime, assertion, and task-runner mechanics, while normal project workflows
  use `lykn build`, `lykn test`, `lykn lint`, `lykn run`, and `lykn dist`.
- The live no-else `if` compiler defect is documented as a known defect and
  routed to arc10/P-22 instead of being represented as already-true shipped
  behaviour.
- The optional `.d.ts` user-documentation pass remains a named later candidate
  pending an artifact-producing fixture; it is not silent-dropped.

## Drift Inventory Disposition

| Slice02 finding | Disposition |
|---|---|
| Build/dist/publish docs stale around `lykn build --dist`, `dist/`, `--no-build`, dirty publish, and `--allow-dirty` | Fixed by slice03 and CDC-verified. |
| Raw Deno/manual pipeline examples in guides 12-01/12-02/12-03 | Fixed by slice04 and CDC-verified. |
| Publish dirty-check and `--allow-dirty` undocumented | Fixed by slice03. |
| `.d.ts` user documentation incomplete | Deferred as a later candidate pending an artifact-producing fixture. It is tracked in this report and project P-10 remains open for the underlying DoD. |
| no-else `if` in expression position emits invalid JS at rc=0 | Routed to reopened arc10 slice04 and project row P-22. guide 00 now names the live defect until the compiler follow-up lands. |
| Surface-macros JS-loading docs, DD-36/DD-37 architecture docs, error-format alignment, `compileBoth` adoption | Deferred by slice02 as out of current guide/SKILL drift scope. |

## Arc Ledger Walk

| ID | Result | Evidence |
|---|---|---|
| A-1 | done | slice01 closed at `0731048` with [`slice01-doctest-drift-fix/cdc-verification.md`](./slice01-doctest-drift-fix/cdc-verification.md). |
| A-2 | done | slice02 closed at `66a3565` with [`slice02-current-drift-recon/cdc-verification.md`](./slice02-current-drift-recon/cdc-verification.md). |
| A-3 | done | slice02 inventory compared against slices 03/04 and this close report: fixed items are closed, no-else `if` is routed to arc10/P-22, `.d.ts` docs remain an explicit later candidate, and no seed finding is silently dropped. |
| A-4 | done | Reproduced selected executable claims: `lykn 0.6.0-dev`; build/dist/publish/test/lint/run help matches docs; `lykn build` writes `target/lykn/build/*`; two-branch expression `if` compiles to a ternary; `lykn run` executes a `.lykn` file; `lykn lint` reports no findings on a clean fixture; no-else expression `if` still emits invalid JS and fails at Deno parse time, matching the new known-defect note and arc10/P-22 routing. |
| A-5 | done | `make test-docs`, `make check-cited-paths`, and `git diff --check` pass at arc close. |
| A-6 | done | Accrued child-closed row: slice03 is closed/CDC-verified at `dcf23f5` + [`slice03-build-dist-publish-guide-refresh/cdc-verification.md`](./slice03-build-dist-publish-guide-refresh/cdc-verification.md). |
| A-7 | done | Accrued child-closed row: slice04 is closed/CDC-verified at `ae31c75` + `af69f70` + [`slice04-deno-workflow-reconciliation/cdc-verification.md`](./slice04-deno-workflow-reconciliation/cdc-verification.md). |

## Arc-Scale Verification

Commands reproduced during arc close:

```sh
./bin/lykn --version
./bin/lykn build --help
./bin/lykn dist --help
./bin/lykn publish --help
./bin/lykn test --help
./bin/lykn lint --help
./bin/lykn run --help
./bin/lykn build
./bin/lykn check /private/tmp/arc07-close-if-expression.lykn
./bin/lykn compile /private/tmp/arc07-close-if-expression.lykn
./bin/lykn run /private/tmp/arc07-close-main.lykn
./bin/lykn lint /private/tmp/arc07-close-main.lykn
./bin/lykn check /private/tmp/arc07-close-no-else-if-expression.lykn
./bin/lykn compile /private/tmp/arc07-close-no-else-if-expression.lykn
./bin/lykn run /private/tmp/arc07-close-no-else-if-expression.lykn
rg -n 'Biome|biome|13-biome|lykn build --dist|lykn compile .* -o dist/|deno fmt dist/|deno lint dist/|deno test test/|deno run --watch.*dist/|../../dist/|dist/main.js|dist/server.js|make build|make test|make check|deno fmt on compiled|deno test to run|deno run to execute|lykn compile to produce|deno publish|npm publish|cargo build' docs/guides assets/ai/SKILL.md
make test-docs
make check-cited-paths
git diff --check
```

Key results:

- `./bin/lykn --version`: `lykn 0.6.0-dev`.
- `./bin/lykn build --help`: build output is `target/lykn/build/`.
- `./bin/lykn dist --help`: stages all workspace packages into
  `target/lykn/dist/`.
- `./bin/lykn publish --help`: `--no-build` assumes `target/lykn/dist/`, and
  `--allow-dirty` is present.
- `./bin/lykn test --help`: compiled tests land in `target/lykn/test/`, never
  the source tree, and extra Deno runner args pass after `--`.
- `./bin/lykn lint --help`: lints `.lykn` source recursively; `.lyk` files are
  exempt.
- `./bin/lykn run --help`: runs a `.lykn` or `.js` file.
- `./bin/lykn build`: built `@lykn/lang`, `@lykn/browser`, and `@lykn/testing`
  under `target/lykn/build/`.
- Two-branch expression `if`: `lykn check` exited 0 and `lykn compile` emitted a
  JS ternary.
- Clean run/lint fixture: `lykn run` printed `arc07-ok`; `lykn lint` reported no
  findings.
- No-else expression `if`: `lykn check` exited 0, `lykn compile` emitted
  `const label = throw ...`, and `lykn run` failed at Deno parse time. This is
  the known defect now named in guide 00 and routed to arc10/P-22.
- Stale-guide sweep: no stale primary-workflow hits. Remaining raw
  `deno publish`/`npm publish`/`cargo build` hits are explicit counter-cues,
  deprecated-alias notes, or CLI development instructions.
- `make test-docs`: 476 passed, 0 failed.
- `make check-cited-paths`: passed at arc close.
- `git diff --check`: clean.

## Accumulated Arc-Plan Changes

- v1.3 opened the explicit arc ledger and slice02 current-drift recon.
- v1.4 closed slice02 and split the remaining docs work into slice03
  build/dist/publish and slice04 Deno workflow reconciliation; it also surfaced
  no-else `if` as a compiler follow-up.
- v1.5 promoted `D-2608-W2HF` into reopened arc10 slice04.
- v1.7 CDC-verified slice03 and kept slice04/arc composition open.
- v1.10 CDC-verified slice04 and repaired guide 10/15 supporting-reference
  drift.
- v1.11 closes the arc and bubbles P-13 up to done.

## Bubble-Up to the Project

arc07 delivers the project roadmap capability for docs/guides + SKILL alignment.
Project row P-13 can close as done with this report as evidence.

The arc does not unblock release by itself: project row P-22 remains open for
the compiler fix, and arc16 remains open for the Lykn Book 0.6.0 edition.
arc09 should continue to wait on arc10 follow-up + arc16.

Silent-drop diff at arc scale: none for arc07-owned docs drift. The only known
language/runtime mismatch found by the docs pass is deliberately outside arc07's
implementation scope and is tracked by arc10/P-22. The optional `.d.ts` docs pass
is a named later candidate tied to P-10 rather than an untracked arc07 miss.

## What Worked

The recon-first split paid off. slice02 prevented old seed material from
turning into blind implementation; slice03 and slice04 then landed as focused
docs changes, and the CDC supporting-reference sweep caught the remaining
`dist/` drift before arc close.
