---
project: project03-language-evolution
status: research
planned-release: "0.7.0"
depends-on: ["project02-language-toolchain-alignment"]
blocks: []
related: ["project04-c-lang", "project07-core-library-research"]
---

# Language evolution

This project holds the former 0.7.0 candidate backlog and exploratory work:
build tooling, distribution, output optimization, language forms and typing,
and internationalization. It is a research and candidate roadmap, not a promise
that every backlog item ships in 0.7.0. Release splits remain undecided where
BACKLOG.md says so.

## Current direction and bounded Autonomous Mode (2026-11-05)

The operator accepted the proposed core-library approach and directed the next
slice to run autonomously: “Agreed on all points. Let's do it!” and “Once you
update the plan with the agreed upon approach you laid out above, go ahead and
open up the next slice and set yourself to run in Autonomous Mode ... with CDC
running Sol 6.1 High and CC running 6 Luna High”. The accepted proposal was to
refresh the existing tree-shake audit for today's compiler, Deno and dependency
policy, then use JSON/YAML as concrete consumers of its findings.

Binding direction: core standard-library source belongs under `lang/lib/` in
the language repository. Independently opt-in `@lykn/*` JSR packages expose
selective entrypoints; importing no standard-library module must introduce zero
standard-library payload. Application bundling may safely remove unreachable
code while preserving observable side effects. Published package APIs must
remain available; optimizing an application is not authority to prune a public
package. Package inventory, individual names/versions and implementation are
not assigned here. This source-home decision supersedes the earlier future
`lykn-patch/yaml` proposal in Project07. Existing ownership/accountability and
all licence, bootstrap, authoring/book and human-acceptance gates survive.

The authorized bounded delivery is [Slice04](slice04-library-baseline-refresh/slice-plan.md):
a source-grounded current-baseline/policy refresh and concrete next-audit
protocol. Slice04 is now independently closed at CC candidate `55ee1c2`; its
[verification](slice04-library-baseline-refresh/cdc-verification.md) and
[retrospective](slice04-library-baseline-refresh/cdc-retrospective.md) complete
this Autonomous authorization. F-6 bundler/metafile and F-10 walker/evidence
contract disposition precedes later audit execution. It is a prerequisite for
resuming Slice01, not a replacement for its F-1–F-12 obligations. No experiment, compiler/CLI change, library port or full
matrix is authorized in this slice. Its agreed effort extent is one baseline
census and one method/protocol decision packet, followed by independent review
and corrections within the normal five-iteration limit; no numeric operator
budget was supplied and no automatic investigation extension is authorized.
Stop after Slice04 closure/retrospective and report the next decision rather
than advancing the whole project. This explicitly uses the established
collapsed standalone-slice convention; no artificial arc is introduced.

| Role | Approved provider/model/settings | Scope and authority |
| --- | --- | --- |
| CDC and independent reviewer | OpenAI Codex, Sol 6.1, High reasoning | Planning/design; independently review CC findings; slice close/retrospective |
| CC | OpenAI Codex, 6 Luna, High reasoning | Execute Slice04 only; self-check, local scoped commit, proposed-done return |

Requested settings must be applied at dispatch; reported backend identity is
not inferred. Two contributors are appropriate because baseline interpretation
and the next evidence contract need independent review. The root context only
coordinates tool transport and read-only lookup; CDC is planning mutation/index
owner until explicit handoff to CC. Review uses `cdc-verification.md` and close
includes `cdc-retrospective.md`. Plans/evidence remain on `planning` at the
existing `.worktrees/planning` checkout, initially clean at `d49f5a9`.
Source is read-only `release/0.7.x` at
`74a90d51b853fc18fe2b7c6ee07417736e1ce464`; 0.6.x `4dded88` and 0.8.x `0f3c28c`
remain distinct baselines. No source implementation occurs, so no source task
branch is opened. Any later source work requires a dedicated non-default task
branch/worktree and revalidated identity before dispatch. No pushes, merges,
publishing, package fetches, installations or workflow triggers are authorized.
Local CI definitions were inspected: push/PR tests, manual/PR/weekly Deno
compatibility and manual consumer smoke; this slice triggers none of them.

## Bounded Deno attempt and required preflight stop (2026-11-05)

After Slice04 closure the operator authorized “that bounded Deno experiment”
with the same models/Autonomous Mode and an explicit evidence-gap stop. Scope:
one pinned compiler/Deno, one backend, five tiny control programs (no-library
payload; JSON without YAML; JSON value without unused file helpers; pure-code
removal/effect preservation; usable published entrypoints), no new external
dependencies. [Slice05](slice05-deno-evidence-preflight/slice-plan.md) records
this separate authorization, its five predeclared controls/shared positives
and exact endpoint: experiment plus independent review/retrospective, or the
required gap-stop with all unrun work visible. It does not reopen project-wide
execution or change original F-6/F-10 evidence contracts.

Author preflight found the exact Deno-required backend absent before control 1;
source predicts npm provisioning before resolver setup. Different cached
versions are not substituted. Slice05 is now independently closed as a [verified stop record](slice05-deno-evidence-preflight/cdc-verification.md)
with [retrospective](slice05-deno-evidence-preflight/cdc-retrospective.md), not fixture/build execution: 0/5 programs run and 5/5 unrun. No
unused task branch/worktree is created while the prerequisite prevents source
implementation. Later executable work first needs an actual dedicated task
source branch/worktree, revised authority and revalidated pins. CDC Sol 6.1 High,
CC Luna 6 High, sequential ownership, local-only commits and all approval gates
from the prior authority remain, scoped now to Slice05. Read-only official source
retrieval is permitted; no backend provisioning or external action is implied.

## Existing units

- [slice01-treeshake-audit](slice01-treeshake-audit/slice-plan.md): compiled-output tree-shakeability research; open.
- [slice02-packaging-strategy](slice02-packaging-strategy/slice-plan.md): distribution strategy research; open.
- [slice03-threading-macros](slice03-threading-macros/slice-plan.md): completed argument-position research; language-design disposition remains separate.
- [slice05-deno-evidence-preflight](slice05-deno-evidence-preflight/slice-plan.md): operator-approved five-control Deno attempt; independently verified preflight stop, 0/5 run and 5/5 unrun; provisioning/attribution decisions remain with Operator.
- [slice04-library-baseline-refresh](slice04-library-baseline-refresh/slice-plan.md): current compiler/Deno/policy and library/package boundary refresh; independently closed as a static baseline/protocol prerequisite; audit method decisions remain before Slice01 resumes.

The original units explicitly use the collapsed standalone-slice convention.
No arcs are fabricated for unapproved candidate capabilities. The full future
arc roadmap will be designed when project definition resumes; BACKLOG.md
retains every candidate and its re-entry condition.

## Definition of done and boundaries

For the current research opening: retain the original three research records,
the approved baseline refresh, bounded Deno attempt and candidate register,
with their source and status distinctions. A future
implementation definition of done is not established by this migration.

## Version history

- 2026-11-05 v1.4: Slice05 independently closed its required preflight stop
  after one intake-only correction, retaining reproduced source/cache evidence.
  All five controls remain unrun. Retrospective complete; any exact-backend
  provisioning or changed attribution route requires a new Operator decision.

- 2026-11-05 v1.3: Operator authorized one-backend/five-control Deno attempt and
  explicit evidence-gap stop. Opened Slice05 after preflight found missing pinned
  backend; preserve 0/5 run denominator and original audit/Project07 obligations.
  No fixture/build/backend acquisition or evidence-contract substitution.

- 2026-11-05 v1.2: Slice04 independently closed after one bounded correction.
  Recorded static lib/member/import/metadata constraints and separate application,
  package and public-API proof obligations through its accepted findings.
  Completed retrospective and stopped at the authorized endpoint; full original
  Slice01 audit and Project07 outcomes remain open.

- 2026-11-05 v1.1: Recorded operator-approved `lib/` source/opt-in JSR and safe
  application optimization direction. Opened bounded collapsed Slice04 to
  refresh baseline/policy and prepare audit re-entry, preserving all Slice01
  F-1–F-12 criteria and the distinct Project07 remaining outcomes. Recorded
  Autonomous role settings, ownership and Slice04-only endpoint.

- 2026-09-06 v1.0: Added project metadata and a retrospective roadmap during project06-planning-reorg; release scope remains provisional.
