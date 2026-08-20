# arc16 — Lykn Book 0.6.0 Edition

> **Status: OPEN — slice04 language-surface runway implemented; CDC review pending.**
> slice01 `pre-book-decision-gate`, slice02 `dogfood-implementation-runway`,
> and slice03 `cli-scaffold-package-runway` are closed/CDC-verified. The
> operator tightened the rule: all accepted 0.6.0 implementation work must land
> before book or writers-guide prose normalizes the final surface. This arc
> gates arc09/release: the book is the full-surface reader of 0.6.0, and every
> language/tooling/book defect it exposes must be fixed for 0.6.0 or routed
> with a named home before the release cut.

## 1. Capability

Arc16 produces the Lykn Book's 0.6.0 edition and uses that work as the final
full-surface review of the language, CLI, package model, guides, and teaching
story before arc09 cuts the release.

The plan-of-record lives in this language repo because 0.6.0 release readiness
gates on it. The book content remains in the sibling book repo
`/Users/oubiwann/lab/cnbb/lykn`, and the reusable prose conventions remain in
`/Users/oubiwann/lab/cnbb/lykn-writers-guide`. Those repos now have tracked
`AGENTS.md` files pointing back here; do not create a parallel planning tree in
either sibling repo.

This arc is done when:

- the 0.6.0 book edition reflects shipped 0.6.0 behavior rather than 0.5.x
  drift;
- every Lykn code example touched by the pass is checked against the current
  compiler/tooling surface;
- the pre-book design findings from dogfooding have either landed, been
  accepted as-is with explicit rationale, or been routed out of 0.6.0 with a
  named re-entry condition;
- the book and writers-guide instructions no longer teach stale paths,
  obsolete toolchain flows, or unreachable verification gates;
- the final HTML/EPUB build, link/path sweep, and voice review are recorded in
  the arc close.

## 2. Source Material

Read these before planning or executing any slice:

- [`design/kickoff-thread-book-0.6.0-update.md`](./design/kickoff-thread-book-0.6.0-update.md)
  — the original 6-8 iteration book-update thread and open decisions.
- [`design/book-drift-inventory-0.6.0.md`](./design/book-drift-inventory-0.6.0.md)
  — the historical drift inventory. Treat it as a snapshot to verify, not live
  truth.
- [`design/fence-wiring-spec.md`](./design/fence-wiring-spec.md) — the
  `lykn test --docs --fence lisp` reachability spec for the book's `lisp`
  fences.
- [`design/dogfooding-friction-log.md`](./design/dogfooding-friction-log.md) —
  real-module dogfood findings, including the pre-book language/package
  decisions.
- [`../../backlog/discoveries.md`](../../backlog/discoveries.md) — permanent
  register rows for routed findings.
- `/Users/oubiwann/lab/cnbb/lykn/AGENTS.md` and
  `/Users/oubiwann/lab/cnbb/lykn-writers-guide/AGENTS.md` — sibling-repo
  instruction files that record the split-by-design planning layout.

## 3. Slice Breakdown

Plan late, plan deep. slice01 is closed as an evidence packet. slice02 closed
the first implementation/dogfood runway: CC built a from-scratch Lykn project,
graded it against the SKILL/guides, and surfaced four CLI/scaffold/package
runway findings. slice03 closed that first implementation cluster. slice04 now
opens the remaining language-surface runway before book prose starts.
Book-facing slices remain deliberately scoped at capability level until the
remaining implementation-first findings land or receive explicit deferral with
re-entry conditions.

| Slice | Scope | Status |
|-------|-------|--------|
| **slice01 · pre-book-decision-gate** | Re-ground the historical book inventory and dogfood findings against current lang/book/writers-guide state; produce the operator decision packet for D-1...D-5, `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN`; classify each as 0.6.0 implementation, docs/book-only, or 0.7.0+ deferral; recommend the next executable slice order. No compiler/book prose edits. | **Closed / CDC-verified** ([closing-report](./slice01-pre-book-decision-gate/closing-report.md), [cdc-verification](./slice01-pre-book-decision-gate/cdc-verification.md)) |
| **slice02 · dogfood-implementation-runway** | Run another from-scratch Lykn project through current SKILL/guides/CLI workflows before book prose; collect command evidence, self-grade against guidance, and route implementation work from `D-2607-R4NW`, `D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, `D-2608-SOWN`, and any new dogfood findings. No compiler/book prose edits. | **Closed / CDC-verified** ([closing-report](./slice02-dogfood-implementation-runway/closing-report.md), [cdc-verification](./slice02-dogfood-implementation-runway/cdc-verification.md)) |
| **slice03 · cli-scaffold-package-runway** | Land or explicitly route the first implementation cluster from slice02: `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and the 0.6.0 floor for `D-2608-SOWN`. A fresh project should build, test, lint, and run without the manual repairs slice02 needed. No export/grouped-binding/branching syntax work. | **Closed / CDC-verified** ([closing-report](./slice03-cli-scaffold-package-runway/closing-report.md), [cdc-verification](./slice03-cli-scaffold-package-runway/cdc-verification.md), [slice-doc](./slice03-cli-scaffold-package-runway/slice-doc.md), [ledger](./slice03-cli-scaffold-package-runway/ledger.md), [cc-prompt](./slice03-cli-scaffold-package-runway/cc-prompt.md)) |
| **slice04 · language-surface-runway** | Land or explicitly defer the remaining language-surface findings before book examples harden: `D-2608-XPRT` top-of-module exports and `mod.lykn` ownership, `D-2608-LBND` grouped local bindings, and `D-2608-COND` flatter ordered validation branching. | **Closed / CDC pending** ([closing-report](./slice04-language-surface-runway/closing-report.md), [slice-doc](./slice04-language-surface-runway/slice-doc.md), [ledger](./slice04-language-surface-runway/ledger.md), [cc-prompt](./slice04-language-surface-runway/cc-prompt.md)) |
| **slice05 · book-instruction-bootstrap** | Reconcile the book repo and writers-guide instructions after implementation decisions: stale paths, toolchain commands, planned-ToC strategy, `AGENTS.md`/`CLAUDE.md` status, durable close-artifact locations, and the implementation-first rule. Disposition Bucket 0 rows that are already fixed by sibling-repo commits. | Blocked until accepted 0.6.0 implementation routes are closed or deferred |
| **slice06 · book-fence-reachability** | Make the book's `lisp` fences reachable to automated verification, using the fence-first route recommended by slice01 unless the operator chooses another strategy. Establish the gate that later chapter slices must run. | Blocked on `D-2607-R4NW` implementation decision |
| **slice07 · current-book-drift-refresh** | Refresh the 0.6.0 book drift inventory against the current book/writers-guide/lang heads after implementation work settles. Replace stale May bucket/thread terminology with live 0.6.0 arc/slice truth. | Planned after implementation runway |
| **slice08 · toolchain-and-project-structure-chapters** | Update book chapters that teach project layout, Deno boundaries, testing, tooling, CI/CD, publish/build/dist, and source ownership. Depends on the final `D-2608-SOWN` route. | Provisional / book-facing |
| **slice09 · language-surface-chapters** | Update language chapters for identifier mapping, position-aware forms, records/single-constructor types, exports, grouped local bindings, and flatter validation branching. Depends on final `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` routes, plus any implementation slices. | Provisional / book-facing |
| **slice10 · edition-close-and-release-gate** | Whole-book final pass: build HTML/EPUB, run book/example gates, voice consistency review, stale-link/path sweep, version/edition metadata check, and arc close with bubble-up to arc09. | Provisional |

slice01 found that D-3 is resolved by the tracked lang planning home, while D-1
and `D-2607-R4NW` should be treated as one verification strategy: implement a
repeatable book-fence gate before chapter code edits. It also confirmed that
`D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN` remain operator
decisions. The operator clarified after slice01 that all accepted 0.6.0
implementation work must land before book prose. Therefore book-facing slices
are blocked until the dogfood/implementation runway either closes the accepted
work or records an explicit deferral with a re-entry condition.

slice02 added four CLI/scaffold/package findings to the permanent register:
`D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and `D-2608-RIMP`. These join
`D-2608-SOWN` as the first implementation-routing cluster because they affect
whether a fresh project can follow the guides without local workarounds.

slice03 closed that cluster and left the language-surface set as the next
implementation-first blocker. slice04 opens that work with explicit target
shapes for top-of-module exports, grouped local bindings, and `cond`, while
preserving a split-before-implementation escape hatch if CC proves the combined
scope is too large for one context.

## 4. Dependencies

Consumes:

- arc07 guide/SKILL alignment — closed and current as of 2026-08-08;
- arc10 compiler-completion — closed, including the no-else `if` expression
  fix;
- arc15 surface-syntax-traps — closed, with slice03 hardening deferred to
  0.7.0 by name;
- arc01-arc06, arc08, arc11-arc13 — shipped behavior the book must describe.

Feeds:

- arc09 release — arc09 remains future until arc16 closes;
- any new 0.6.0 implementation slice/arc opened from slice01 decisions;
- repeat dogfood project iterations that probe whether the current surface is
  ready to teach;
- 0.7.0 backlog, but only for findings explicitly deferred with a re-entry
  condition.

## 5. Decision Gates

Slice01 must produce a table with one row per gate below. The operator makes the
final call; CC/CDC supply evidence, options, costs, and routing.

| Gate | Source | Decision needed before |
|------|--------|------------------------|
| D-1 | historical inventory B0-G | choose book example verification strategy: bootstrap `/Users/oubiwann/lab/cnbb/lykn/test/book/`, use `lykn test --docs --fence lisp`, or downgrade the old test-suite claim |
| D-2 | historical inventory B0-I | preserve `planned-toc.md` as v2 and create v3, or reconcile in place |
| D-3 | historical inventory B0-M | confirm durable close-artifact locations after `workbench/` was declared scratch |
| D-4 | historical inventory | decide whether the verification bootstrap is sequential before chapter work or can run in parallel |
| D-5 | historical inventory | decide PR/commit cadence for book/writers-guide iterations |
| `D-2607-R4NW` | fence-wiring spec | choose and/or implement the book `lisp` fence reachability mechanism |
| `D-2608-XPRT` | dogfood F-7 | settle export ownership: inline definitions, top-of-module exports, `mod.lykn` re-export semantics, and implementation route |
| `D-2608-LBND` | dogfood F-8 | settle grouped local binding syntax/semantics and implementation route |
| `D-2608-COND` | dogfood F-9 | settle flatter validation branch syntax/semantics and implementation route |
| `D-2608-SOWN` | dogfood F-10 | settle Lykn-owned generated/config manifest placement without restricting user-owned non-Lykn source files |

Slice01's decision packet is recorded in
[`slice01-pre-book-decision-gate/closing-report.md`](./slice01-pre-book-decision-gate/closing-report.md)
and CDC-verified in
[`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md).
Current CDC read:

- D-3 is resolved unless the operator reopens artifact-home policy: durable
  arc16 planning/close artifacts live in this tracked lang arc directory, not
  sibling repo scratch space.
- D-1 and `D-2607-R4NW` should be decided together. The recommended route is a
  repeatable `lykn test --docs --fence <tag>` book gate, with targeted external
  tests later for examples that need more than fence compilation/execution.
- D-2, D-4, and D-5 are still operator/editorial process decisions for ToC
  policy, sequential verification, and cross-repo review cadence.
- `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` are language-surface
  decisions. slice04 is the current implementation route; book-facing language
  chapters remain blocked until it closes or splits with explicit re-entry
  conditions.
- `D-2608-SOWN` can be a docs-only 0.6.0 compromise or a scaffold/build/dist
  behavior change, depending on the operator decision.

## 6. Arc Ledger

Capability: the 0.6.0 Lykn Book edition is release-ready, and the book pass has
either fixed or routed every language/tooling defect it surfaced.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 pre-book decision gate closed | ptr: slice01 closing-report + cdc-verification | serious | arc-plan | **done** | [`slice01-pre-book-decision-gate/closing-report.md`](./slice01-pre-book-decision-gate/closing-report.md) + [`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md); commit `00b3338` plus CDC follow-up | decisions before edits |
| A-2 | every pre-book decision gate has a final disposition | arc close: compare §5 gates with operator decisions and routed homes | serious | arc-plan | open | | no design silent drops |
| A-3 | book/writers-guide instructions are reconciled with the confirmed layout and current toolchain | read sibling `AGENTS.md`, writer-guide diffs, and slice02 close | serious | arc-plan | open | | includes stale B0 rows |
| A-4 | book code fences/examples are reachable by an automated gate | run the chosen book fence/test command and record extracted/passing/failing counts | serious | `D-2607-R4NW` + B0-G | open | | class-(b) composition row |
| A-5 | stale 0.5.x/tooling/book drift inventory rows are either fixed, no-op, or deferred with re-entry | arc close: compare refreshed inventory against slice closures | serious | inventory | open | | anti-silent-drop row |
| A-6 | chapters touched for 0.6.0 language/tooling changes match shipped behavior | chapter-scope tests plus source sweeps against current lang guides/SKILL | serious | P-20 | open | | reproduced at arc scale |
| A-7 | final book outputs build and render in supported formats | run mdBook HTML/EPUB build and any configured book checks | serious | P-20 | open | | include known EPUB workaround |
| A-8 | arc16 bubbles up honestly to arc09 | arc closing-report updates project-plan/status and names remaining blockers, if any | serious | project-management | open | | release gate |
| A-9 | implementation-first rule honored before book prose | arc close: show accepted 0.6.0 implementation findings from dogfood are closed or explicitly deferred before book/writers-guide/chapter slices depend on them | serious | operator clarification 2026-08-08 | open | slice02 closed/CDC-verified; slice03 closed/CDC-verified with `D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and the 0.6.0 `D-2608-SOWN` floor implemented; slice04 implemented `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND` pending CDC | prevents prose from masking unsettled language |

## 7. Verification Strategy

Minimum gates for arc16 planning/docs changes in this repo:

- `git diff --check`
- `make check-cited-paths`
- `make test-docs`

Book/writers-guide implementation slices add their own repo-local gates, chosen
per slice. At minimum, any chapter slice touching code fences must run the
chosen book example gate for the affected chapter(s), and the final slice must
build the book HTML/EPUB outputs. If a gate is not yet possible because the
test/fence bootstrap does not exist, the slice must say that plainly and route
the bootstrap before relying on manual review.

Dogfood slices add scratch-project gates: create a project outside tracked
source trees, build it, test it, lint it, run or demo it where applicable, then
self-grade it against the Lykn SKILL/guides and route any defects before prose
normalizes the surface.

## 8. Out Of Scope

- Publishing the 0.6.0 release itself; arc09 owns release cutting.
- GitHub Linguist / ` ```lykn ` migration; deferred to 0.7.0+ unless the
  operator changes the release boundary.
- Cover art, illustration redesign, translation/localization, or broad chapter
  restructuring not caused by 0.6.0 truth.
- Teaching around a known language defect instead of fixing or routing it.

## 9. Version History

### v1.8 - 2026-08-20 (slice04 implemented; CDC pending)

Closed slice04 from CC's side with Rust and JS compiler support for
`(exports ...)`, grouped sequential `bind`, and `cond`; refreshed SKILL/guides
to teach the accepted 0.6.0 surface before book prose. CDC verification remains
the next required step before book-facing language chapter work depends on the
slice.

### v1.7 - 2026-08-20 (slice04 language-surface runway opened)

Opened slice04 `language-surface-runway` with the canonical open set. The slice
routes the remaining dogfood language-surface findings before book prose:
`D-2608-XPRT` top-of-module exports and `mod.lykn` ownership, `D-2608-LBND`
grouped local bindings, and `D-2608-COND` flatter validation branching. The
previous book-facing provisional rows were pushed back one slot so execution
order matches the implementation-first rule.

### v1.6 - 2026-08-20 (slice03 CDC-verified)

CDC reproduced slice03's fresh-project acceptance workflow and standing gates.
The CLI/scaffold/package runway is now closed: fresh scaffolds include a
project-local `bin/lykn`, scaffolded Lykn tests expand through `testing`,
nested package sources build recursively, source-file `lykn run` resolves
relative imports through workspace build output, and the 0.6.0 source-ownership
floor is explicit. Next arc16 implementation work remains the language-surface
decision set: `D-2608-XPRT`, `D-2608-LBND`, and `D-2608-COND`.

### v1.5 - 2026-08-08 (slice03 closed pending CDC)

slice03 closed the first CLI/scaffold/package runway implementation cluster.
Fresh scaffolds now install `bin/lykn`, scaffolded Lykn tests run through the
testing macro package, package build/dist traversal includes nested source with
preserved relative paths, source-file `lykn run` executes package build output
so relative imports resolve, and the 0.6.0 source-ownership floor is explicit.
CDC verification remains pending. `D-2608-XPRT`, `D-2608-LBND`, and
`D-2608-COND` remain the next implementation-first language-surface decisions
before book prose can normalize the final surface.

### v1.4 - 2026-08-08 (slice03 CLI/scaffold/package runway opened)

slice03 opens the first implementation-routing cluster from slice02:
`D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, `D-2608-RIMP`, and the 0.6.0
source-ownership floor for `D-2608-SOWN`. The language-surface decisions
(`D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`) remain deliberately out of scope
for this slice so CLI/scaffold/package reliability can land before book prose.

### v1.3 — 2026-08-08 (slice02 closed/CDC-verified)

slice02 closed at `35f8fcc` and CDC reproduced the scratch project gates in
[`slice02-dogfood-implementation-runway/cdc-verification.md`](./slice02-dogfood-implementation-runway/cdc-verification.md).
The slice surfaced four fresh CLI/scaffold/package runway findings:
`D-2608-BINW`, `D-2608-TDSL`, `D-2608-BREC`, and `D-2608-RIMP`. The next arc16
move is implementation routing before any book/writers-guide prose normalizes
project structure or package commands.

### v1.2 — 2026-08-08 (implementation-first dogfood runway)

The operator clarified that all accepted implementation work must happen before
the book or writers-guide starts teaching the final surface, and expects several
more from-scratch Lykn project dogfood iterations with CC. The arc plan now
opens slice02 `dogfood-implementation-runway`, inserts an implementation
routing slice before book-facing work, shifts the book/writers-guide/chapter
slices later, and adds A-9 to verify the implementation-first rule at arc close.

### v1.1 — 2026-08-08 (slice01 closed/CDC-verified)

slice01 closed at `00b3338` and CDC reproduced the close in
[`slice01-pre-book-decision-gate/cdc-verification.md`](./slice01-pre-book-decision-gate/cdc-verification.md).
The arc plan now treats the decision gate as closed, marks A-1 done, resolves
D-3 to the tracked lang arc16 planning home, records the fence-first
recommendation for D-1 / `D-2607-R4NW`, and keeps the export, grouped-binding,
branching, and source-ownership findings as explicit operator decisions before
later chapter slices normalize those surfaces.

### v1.0 — 2026-08-08 (arc planned; slice01 opened)

Created the arc plan after arc07, arc10, and arc15 closed and after the
external dogfood experiment added four pre-book decisions:
`D-2608-XPRT`, `D-2608-LBND`, `D-2608-COND`, and `D-2608-SOWN`. Converted the
old "6-8 iteration" book thread into canonical arc/slice shape, kept the split
layout decision (plan in lang, content in sibling repos), opened the arc ledger,
and opened slice01 as the decision-gate recon before implementation/book prose
work begins.
