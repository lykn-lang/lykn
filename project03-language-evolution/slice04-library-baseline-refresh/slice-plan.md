# Slice04 — library baseline refresh

Status: **Closed 2026-11-05; six LB rows independently reproduced after iteration01.**
Kind: source reconnaissance and next-audit protocol; no production code or experiment.
Parent: [Project03](../project-plan.md), collapsed standalone-slice convention.
Contract: [ledger.md](ledger.md). Accepted assignment: `cc-prompt-iteration01.md`.
Review: [cdc-verification.md](cdc-verification.md); retrospective: [cdc-retrospective.md](cdc-retrospective.md).

## Outcome and agreement

Deliver a reviewable current-baseline/policy finding record and a concrete method
for resuming the original tree-shake audit, so JSON/YAML library design can use
current compiler, Deno, packaging and dependency facts. The operator approved
refreshing that audit for today's compiler, Deno and dependency policy, then
using JSON/YAML as concrete consumers, and explicitly requested this next slice
in Autonomous Mode with CDC Sol 6.1 High and CC 6 Luna High. This single refresh
is the agreed effort extent: one finite source census and one proposed protocol,
with the normal five corrective iterations and no automatic extension. No numeric
operator budget was supplied. This slice is the bounded prerequisite, not the
entire F matrix or a new implementation project. Stop at independent slice close
and retrospective; report next decisions before further execution.

## Scope and authority

Binding: core library source under `lang/lib/`; independently opt-in `@lykn/*`
JSR packages and selective entrypoints; no standard-library import means zero
standard-library payload; app-level removal preserves all observable effects;
published package APIs remain available. Do not infer package names, versions,
a licence, a YAML port or a proven working lib build from those decisions.

In scope: current native/default and independently invocable alternate emitter
routes; workspace/member/import/export/dist metadata paths; npm/Node edges and
policy conflicts; installed tool version/help only; all original F rows mapped
to retained versus stale prerequisites and proposed next checks; separate
no-import/selective-import/application/package proof obligations for later work.

Out: builds, compilation, bundling, fixture/corpus execution, new scripts,
package fetch/install, source/doc changes, port/vendoring, JSR/npm publication,
network mutation and CI triggers. No handwritten JavaScript research tooling.
Existing npm:esbuild and npm:astring edges are facts to classify, not execution
authority or approval for new dependencies. Research/evidence programs remain
Lykn-first if a later assignment needs one. Do not silently replace esbuild's
metafile with Deno bundle text and call F-6 done.

Source: read-only `/Users/oubiwann/lab/lykn/lang/.worktrees/0.7.x`, branch
`release/0.7.x`, `74a90d51b853fc18fe2b7c6ee07417736e1ce464`, clean at opening.
Planning: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, `planning`, based
on `d49f5a9ba7b414eaa4930e2364e766c78beb081b` plus this open-set commit.
Global `lykn` reports 0.5.2 and is not accepted current-source provenance.
Deno reports 2.9.6 locally; recheck it rather than infer behavior from help.
No source implementation means no source task branch is needed. Any future
implementation first needs a dedicated non-default task branch and revalidation.

CDC owns planning/index until handoff; CC then owns only the allowlisted paths
in the prompt, and returns ownership to CDC at proposed-done. Root coordinates
transport/read-only lookup. CDC independently reviews CC source findings in
`cdc-verification.md`; CDC writes `cdc-retrospective.md` at close. No contributor
accepts its own substantive output. Local scoped commits only, with both
repository co-author trailers. Automatic CI definitions inspected; no external
trigger occurs. Full governance is [Project03 authority](../project-plan.md).

## Method and evidence

Artifacts: one `artifacts/findings.md` is needed as the durable source-cited
baseline and next-protocol consumer input; do not add routine mirrors, verifiers,
per-command files or a new source registry. Include concise intake/readback and
commands/results there. Closing report provides row walk and bubble-up.

1. Revalidate worktree/revision/status and active assignment. Load required
   manifest text with complete bounded reads; record full/section extents and
   query coverage separately plus a source-cited contract readback before edits.
2. Inspect the finite source population and source bodies described by the
   prompt; cite revision-qualified paths/lines. Derive package/fixture/row counts
   from actual inputs; retain discrepancies. Separate source observations,
   documented rules, accepted decisions, inference and untested proposals.
3. Compare each F-1–F-12 requirement against this baseline without changing any
   original status. State what survives, what needs refreshed evidence, and what
   needs an explicit evidence-contract decision before audit execution.
4. Write a concrete later audit protocol using only verified available command
   surfaces. Define fixtures, controls, output/runtime/API oracles and limits.
   Missing tooling capabilities are unresolved checks with an owner, not passes.
   No procedure is executed in this slice.
5. Self-review provenance/claim strength, scope, exact F-row coverage, remaining
   Project07 owners, and source diff; scoped local commit; return proposed-done.

## Verification and exit

Every LB row must have inspectable evidence, then independent source replay and
semantic review by CDC. `git diff --check` and path/heading checks are structural
only; they cannot establish runtime or optimizer correctness. No `make check`
is required because no source/behavior changes occur, and no source suite is
run opportunistically. Slice01's all twelve F rows stay open, including full
fixture/corpus/bundler, predictions/divergence and report obligations. Project07
retains consolidated synthesis, JSON-before-production-YAML, licence/bootstrap,
28 Y-14 cases, 36 unsupported resource cells, ADT/guide/book/human and actual-home
proof. Accepted historical RC/DB/design evidence retains its actual scope.

Stop affected work on drift, missing binding inputs, contradictory authority or
a need for source/code/experimental execution. Surface the smallest decision;
do not resolve it by weakening a row. Five corrective iterations maximum; no
historical failure budget is reset. The initial attempt is not an iteration.

## Author readiness

CDC read framework 3.0.1, project-management wayfinder/scales/layout/top-down,
engineering-methods role/Autonomous and prompt-authoring contracts, ledger and
evidence-strength guides, repository governance, Lykn skill and no-Node/module
structure guidance. Scientific-methods framing/measures/protocol/analysis informs
the proposed protocol. Inspected actual main.rs compile/browser routes,
compile.rs native pipeline, config.rs dependency extraction, dist.rs member and
metadata/rewrite functions, source package configs and installed Deno help.

Source-grounded method, resolved scope/ownership, manifest/intake, falsifiable
claim checks and return contract are supplied in the prompt. Non-execution is
intentional: the unresolved policy/evidence equivalence is the delivery question,
not a reason to execute old npm research or claim bundler proof. CC may choose
local prose layout; consequential evidence-contract changes remain with CDC
and Operator. Required packet is sized for one context with recovery headroom.

## Assignment history

| Prompt | Date | Predecessor | Reason | Disposition |
| --- | --- | --- | --- | --- |
| `cc-prompt.md` | 2026-11-05 | none | Operator-approved baseline/policy refresh prerequisite | CC e4d0e4d reviewed; returned for LB-05 correction and LB-01 extent clarification |
| `cc-prompt-iteration01.md` | 2026-11-05 | `cc-prompt.md` | Separate package/subpath oracles, concrete specimens, compact coverage clarification | accepted by CDC at CC candidate 55ee1c2; one executed refinement |

## Version history

- 2026-11-05 v1.2: CDC accepted all six LB rows after targeted correction review,
  retained applicable source/census evidence, completed retrospective and stopped
  at the authorized endpoint. Original F rows and Project07 gates stay open.

- 2026-11-05 v1.1: Initial CDC reproduced current baseline and source census;
  returned LB-05 boundary/protocol defect and LB-01 generic extent record for
  bounded iteration01. Retained unaffected evidence and all original scope.

- 2026-11-05 v1.0: Opened bounded research refresh and future audit method;
  retained original audit and Project07 obligations; no source implementation.
