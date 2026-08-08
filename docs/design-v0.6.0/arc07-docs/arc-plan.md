# arc07 — Documentation & Guide Alignment

> **Status: ACTIVE — slice01, slice02, and slice03 closed/CDC-verified; slice04 closed.**
> Created 2026-06-28 for the 0.6.0-era docs/SKILL hygiene work. The red-CI finding
> (2026-06-30: 8 guide doctest blocks, DD-50.6 drift) is **fixed and landed** in
> **slice01** (`0731048`; guide doctests 472/0) — the release-branch doctests are
> green (CI re-run pending). **slice02** (`66a3565`, CDC-verified) re-grounded
> the old guide/SKILL seed lists against the current branch. **slice03**
> (`dcf23f5`, CDC-verified) refreshed build/dist/publish guide drift. The
> slice04 reconciled the Deno workflow guides. The remaining arc07 work is
> arc-level composition and CDC verification; a no-else `if` compiler defect is
> routed to reopened arc10 slice04.

## 1. Capability

Keep `docs/guides/` and the `assets/ai/` SKILL files aligned with the 0.6.0
language and toolchain — eliminate guide drift (content that no longer matches
what the compiler/CLI actually do) and land the discoverability-gap additions
that surfaced when the first real downstream project (mycelium) was bootstrapped.
The aim is that a reader following the guides/SKILL gets advice that matches
shipped 0.6.0 behaviour, so docs are release-ready before arc09 cuts 0.6.0.

**Relationship to neighbouring arcs.** Distinct from arc03's W-4d doctest-fence
work (that was compiler-coherence: making doctests compile correctly). This arc
is prose/guidance correctness. It also feeds arc05 (the linter's rule corpus
draws on `docs/guides/09-anti-patterns.md` and the surface-forms reference), so
clearing guide drift first makes the linter's seed corpus trustworthy.

## 2. Slice breakdown

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · doctest-drift-fix** (CI green) | Fix the 8 guide doctest blocks failing DD-50.6's return-type check: 2 `try` cases (explicit return / drop `:returns`) + the `fn`-closure cases (bind-then-return to keep typed params) + a preventive style note. | **Closed** (`0731048`; docs-only; guide doctests 464/8→472/0; `make check` green; CI re-run pending) |
| **slice02 · current-drift-recon** | Re-ground the old guide/SKILL seed lists against current `release/0.6.x`; disposition each seed item as done/stale/open/defer; run current drift sweeps; behaviour-check live compiler/CLI claims; recommend the next slice breakdown. Recon-only: no guide/SKILL edits. | **Closed** (`66a3565`; [closing report](./slice02-current-drift-recon/closing-report.md); [CDC verification](./slice02-current-drift-recon/cdc-verification.md)) |
| **slice03 · build-dist-publish-guide-refresh** | Update `assets/ai/SKILL.md`, guide 10, guide 12-04, and guide 15 for `lykn dist`, `target/lykn/{build,dist}`, generated publish files, `--allow-dirty`, and `--no-build`; preserve deprecation notes where useful. | **Closed/CDC-verified** ([closing report](./slice03-build-dist-publish-guide-refresh/closing-report.md); [CDC verification](./slice03-build-dist-publish-guide-refresh/cdc-verification.md); `make test-docs`, `make check-cited-paths`, and `cargo test -p lykn-cli` green) |
| **slice04 · deno-workflow-reconciliation** | Audit guides 12-01, 12-02, and 12-03 for raw Deno/manual `dist/` examples; preserve intentional low-level runtime examples and convert normal project workflows to `lykn` wrapper flows. | **Closed** ([closing report](./slice04-deno-workflow-reconciliation/closing-report.md); `make test-docs`, `make check-cited-paths`, and `git diff --check` green) |

The 8 blocks: `03-error-handling.md` (`load-config`, `valid-json?` — `try`),
`06-functions-closures.md` (`create-logger`, `create-filter` — `fn`),
`07-async-concurrency.md` (`debounce` — `fn`), `08-performance.md` (`memoize`,
`memoize-lru` — `fn`), `11-documentation.md` (`debounce` — `fn`). Verify with
`make test-docs` (the surface that catches this — see the process note below).

_Later candidate (pending slice03/slice04):_ `.d.ts` user documentation remains
open if the generated declaration path is meant to be a first-class 0.6.0 user
surface. It needs a targeted artifact-producing fixture before exact guide
claims are written. 0.5.x-era guide-drift sessions (`workbench/old/`) are out
of 0.6.0 scope.

> **Process note (applies arc-wide and beyond):** the standing slice "green" bar
> (`lykn test` + `deno test test/`) **does not run `make test-docs`**, which is
> why this drift sat latent until CI caught it. Slice ledgers touching guides/docs
> (and arc-composition checks) must include `make test-docs` (or `make check`) in
> their verification. Recorded as a project-level process fix.

## 3. Dependencies

Consumes: the shipped behaviour of arc01–arc06 and arc15 (docs describe what
those landed).
Best sequenced **after** the language/toolchain arcs stabilize (so docs aren't
chasing a moving target) and **before** arc09 (release ships release-ready docs).
Feeds arc16 (the book should describe the reconciled guide truth) and arc09.

**Compiler dependency surfaced by slice02.** No-else `if` in expression position
is documented as a compile error, but `lykn check`/`compile` currently return
success and emit invalid JS (`const label = throw ...`). The operator promoted
this from backlog routing into reopened arc10
[`slice04-no-else-if-expression-error`](../arc10-compiler-completion/slice04-no-else-if-expression-error/slice-doc.md).
arc07 should not paper over this with docs that teach the wrong behaviour;
either the compiler follow-up lands, or arc07/arc16 must explicitly name the
live defect.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 doctest-drift fix closed | ptr: slice01 cdc-verification | correctness | arc-plan | **done** | `0731048` + [`slice01-doctest-drift-fix/cdc-verification.md`](./slice01-doctest-drift-fix/cdc-verification.md) | red-CI item closed |
| A-2 | slice02 current-drift recon closed | ptr: slice02 closing-report + cdc-verification | serious | arc-plan v1.3 | **done** | `66a3565` + [`slice02-current-drift-recon/cdc-verification.md`](./slice02-current-drift-recon/cdc-verification.md); CDC reproduced docs/path gates and the no-else `if` defect | re-grounded before editing |
| A-3 | All current guide/SKILL drift is either fixed in arc07 or explicitly routed | arc close: compare slice02 inventory with subsequent implementation slices and deferrals | serious | arc capability | open | | anti-silent-drop row |
| A-4 | Guide/SKILL claims match shipped 0.6.0 behaviour for sampled executable claims | arc close: reproduce selected `./bin/lykn` checks/compiles/lints and `make test-docs` | serious | P-13 | open | | class-(b) composition row; reproduce at arc scale |
| A-5 | `make test-docs` and `make check-cited-paths` are green at arc close | arc close gate | serious | process note + P-21 | open | | docs drift and cited-path drift stay visible |

## 5. Version History

### v1.9 — 2026-08-08 (slice04 closed; Deno workflow guidance reconciled)

slice04 closed the remaining Deno workflow drift in guides 12-01, 12-02, and
12-03. Normal lykn project workflows now use `lykn build`, `lykn test`,
`lykn lint`, and `lykn run`, and `deno task` examples call lykn wrappers in
their task bodies. Direct Deno examples remain where the guide is teaching
permissions, Deno APIs, assertions, or task-runner mechanics.

arc07 remains active for CDC verification and the arc-level composition rows
A-3/A-4/A-5.

### v1.8 — 2026-08-08 (slice04 opened)

Opened **slice04 deno-workflow-reconciliation** with the full open set:
`slice-doc.md`, `ledger.md`, and `cc-prompt.md`. This slice owns the remaining
Deno workflow drift in guides 12-01, 12-02, and 12-03: normal lykn project
workflows should use `lykn build`, `lykn test`, `lykn lint`, and `lykn run`,
while intentional Deno runtime/API/task-runner teaching should be preserved and
classified at close.

### v1.7 — 2026-08-08 (slice03 CDC-verified)

CDC accepted slice03 at `dcf23f5`: build/dist/publish guide drift is closed,
the stale publish error string is fixed, and `D-2607-6BQX`, `D-2607-V5DK`, and
`D-2607-2FHM` are closed/no-op with reproduced evidence. The reproduced gates
were `cargo test -p lykn-cli`, `make test-docs`, `make check-cited-paths`, and
`git diff --check`.

arc07 remains active. slice04 still owns Deno workflow reconciliation, and
arc-level rows A-3/A-4/A-5 still close only at arc close.

### v1.6 — 2026-08-08 (slice03 closed; build/dist/publish guidance refreshed)

slice03 closed the build/dist/publish drift cluster. `assets/ai/SKILL.md`,
guides 10/12-04/15, the stale publish error string, and the related backlog
rows now describe the current workflow: `lykn build` writes to
`target/lykn/build/`, `lykn dist` stages under `target/lykn/dist/`, and
`lykn publish` documents `--no-build`, `--allow-dirty`, and the dirty-tree gate.

The root `dist/` debris row closed as no-op after `git ls-files dist` returned
empty and `test ! -e dist` passed. Slice04 remains pending for broader Deno
workflow reconciliation in guides 12-01/12-02/12-03.

### v1.5 — 2026-08-08 (slice03 opened; compiler follow-up promoted to arc10)

Opened **slice03 build-dist-publish guide refresh** as the next executable docs
slice, with the full open set (`slice-doc.md`, `ledger.md`, `cc-prompt.md`).
The slice owns the `lykn build --dist` / repo-root `dist/` drift cluster in
`assets/ai/SKILL.md`, guides 10/12-04/15, the stale publish error string if it
still exists, and the `D-2607-2FHM` root-`dist/` disposition.

Per operator direction, `D-2608-W2HF` moved from "compiler follow-up outside
arc07" to reopened arc10 slice04. arc07 still tracks the dependency, but the
fix lives in compiler-completion.

### v1.4 — 2026-08-08 (slice02 closed — next slices split)

slice02 closed as a recon-only pass (`66a3565`) and was CDC-verified. The close
report did not justify arc07 closure; it split the remaining guide/SKILL work
into **slice03 build/dist/publish guide refresh** and **slice04 Deno workflow
reconciliation**. The optional `.d.ts` docs pass stays a later candidate pending
an artifact-producing fixture.

The recon also surfaced a compiler/check defect: no-else `if` in expression
position is documented as a compile error, but the current CLI emits invalid JS
at rc=0. CDC reproduced it and routed it to `docs/backlog/discoveries.md` as
`D-2608-W2HF`.

### v1.3 — 2026-08-08 (slice02 current-drift recon opened)

After arc15 closed, arc07 became the next release gate. The seed docs are now
old enough that implementation would be risky without a freshness pass:
publishing/no-`src` SKILL guidance is already present, `13-biome/` is gone, and
DD-49/DD-50/arc15 changed several claims the May seed material names. Opened
slice02 as a recon-only slice to disposition the old seed rows, sweep the current
guides/SKILL, behaviour-check live claims, and recommend the actual next slice
breakdown.

The arc ledger is now explicit: slice01 is done, slice02 is open, and the
remaining composition rows check that all guide/SKILL drift is fixed or routed
before arc07 can close.

### v1.2 — 2026-06-30 (slice01 closed — CI-green)
slice01 landed (`0731048`): the 8 drifted blocks fixed docs-only — `try` cases via
explicit `(return …)` + dropped `:returns`; `fn` closures via **bind-then-return**
(kept typed params); preventive note added. Guide doctests **464/8→472/0**,
`make check` green. Red-CI item resolved (CI re-run pending). arc07 stays open for
the broader guide-drift work.

### v1.1 — 2026-06-30 (slice01 added — red-CI doctest drift)
The first CI run on `release/0.6.x` (the commit enabling release/* CI) went red on
8 guide doctest blocks failing DD-50.6's return-type check — accumulated guide
drift, newly exposed (compiler correct; not an arc04 regression). Added **slice01
· doctest-drift-fix** (the path to green CI). Design call settled (CC report):
**docs-only — closure returns use `=>`**, not a `fn`/`lambda` value-position tweak.
Recorded the process gap (slice green-bar omits `make test-docs`). Arc flagged
near-term.

### v1.0 — 2026-06-28 (created)
Arc created to home the 0.6.0 docs/SKILL hygiene backlog (`guide-drift-cleanup-plan`,
`proposed-skill-and-guide-additions`), previously un-arc'd in `workbench/`.
Release renumbered arc07→arc08 to keep dependency order (docs before release).
