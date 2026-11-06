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

## Native source-built esbuild authorization (2026-11-05)

Operator approved using a pinned native esbuild build without Node/npm: “perfect.
I love this idea — let's do it :-)”. This expressly authorizes immutable upstream
source and reviewed Go-input acquisition, separate build, pinned explicit binary
paths and provenance for the existing five-control scope. Direct native esbuild
CLI/metafile replaces Deno bundle in [Slice06](slice06-native-esbuild-controls/slice-plan.md);
Deno executes generated ESM only. Slice05's no-provisioning gate is superseded only
for this source-build approval, not retroactively erased. Retained-code attribution
still requires actual proof; all original F-1–F-12 criteria and Project07 outcomes
remain open. No npm distribution/client/registry, Node installation, new backend,
production library, push/publish/release or remote CI is authorized.

One coherent increment ends after the pinned native tool and five controls plus
independent review/retrospective, or an honest prerequisite/evidence-gap stop.
Same explicit CDC Sol 6.1 High and CC Luna 6 High models; one Lykn observer driver
is necessary tooling, not a sixth stimulus. Exact source/Go/module pins, finite
network scope, five source programs/shared positives and actual attempt budgets
are in the slice plan. The task branch/worktree is codex/native-esbuild-controls
at 74a90d5, with durable ignored tools/experiment outputs; planning remains the
only authored research/evidence branch. Managed API could not create this nested
repository worktree, so verified repository-local Git fallback created it; no
source baseline switched and main/releases are read-only. Sequential mutation
ownership and local-only commits persist. Stop after Slice06, no whole-project
advance or source repair. Source/module acquisition under this approval is
separate from earlier documentation-only network reads.

Slice06 is now independently closed as a bounded stop at CC candidate
6ccfd9e: [verification](slice06-native-esbuild-controls/cdc-verification.md#final-independent-review--2026-11-05)
and [retrospective](slice06-native-esbuild-controls/cdc-retrospective.md).
The native tool rebuilt offline to the same binary hash; actual C4 code/metafile
attribution was reproduced. First C5 runtime failed before evaluation on invalid
JS generated from a documented equality precondition: 1/5 bundles completed,
1/11 runtime attempts failed, four bundles/ten runtimes unrun. NE-01/02/03/07
are done; NE-04/05/06 deferred. [NE-C01](BACKLOG.md#native-pilot-compiler-follow-up-ne-c01)
owns separate compiler follow-up/re-entry; no implementation is opened here.
Tool inputs/binary remain reusable under the documented ignored task target.
This stop is not optimizer-wide, functional, effect or public-API acceptance.
Original F-1–F-12, F-6/F-10 method decisions, Project03 composition and all
Project07 final synthesis/licence/bootstrap/authoring/book/human gates survive.

## Existing units

2026-11-06 [Slice12](slice12-offline-walker-capability/cdc-verification.md)
closed at its independently reproduced first real gap: pinned native check
rejects documented exports of async-wrapped named functions. NE-C07 owns a
separate validation disposition/re-entry. Candidate helpers/control data are
retained but not verified usable; parser observations0/4 and all12 walker
control groups remain unrun. One PC row done/five deferred, including the
explicit precheck provenance limit; compiler/source/Acorn were not worked around.
No PhaseB, product repair, full audit or next unit follows.

2026-11-06 Operator authorized [Slice12](slice12-offline-walker-capability/slice-plan.md)
to implement Lykn tooling and prove the bounded offline parser/walker capability
under the same Sol6.1 High CDC / fresh Luna6 High CC Autonomous roles. Exact
cached Acorn execution is now authorized, without new acquisition or general
npm-source reuse. Stage the minimal parser prerequisite first and stop on a
real gap; independently review it before walker investment/fixed controls.
Endpoint remains bounded tooling/capability or honest gap, not full corpus/F6
matrix/audit execution, source repair, library work or original F-row closure.

2026-11-06 [Slice11](slice11-audit-evidence-contract/cdc-verification.md) is
independently closed after one preserved method-precision correction. The
accepted contract selects existing unmodified npm-distributed Acorn ESM for a
future separately authorized offline gate and a Lykn-authored conservative
ESTree walker; native esbuild evidence remains graph/module/body/runtime/API
specific, per artifact. Source/emitter populations and failure accounting are
explicit. This settles the F6/F10 method, not their execution: all original
F rows remain open, with future implementation/capability/complete-audit proof
still required. No parser/control/fullcheck/corpus/bundle run or source change
occurred, and no next unit is opened.

2026-11-06 Operator authorized [Slice11](slice11-audit-evidence-contract/slice-plan.md)
to settle the remaining compiled-corpus ESTree walker and coherent native-esbuild
evidence contract under the same Sol6.1 High CDC / fresh Luna6 High CC Autonomous
arrangement. Endpoint is independently reviewed method or a concrete gap only,
not full audit execution. Original F1–F12 remain open; no product change,
parser acquisition/runtime probe, corpus scan or new pilot is assigned.

2026-11-06 [Slice10](slice10-template-release-integration/slice-plan.md) independently
closed the explicitly approved template-repair integration into release/0.6.x.
Merge f70565566088f5d55129edda6bd73a4691e5a58d has exact predicted tree572bc953
and13 accepted repair/test paths, preserving target policy/lock. CC and CDC
separately passed full native Make (Rust1509, JS+Lykn1467, docs482), focused
native22-value regression and committed citations. Fresh materialized JS bytes
match public/embedded source; actual release binary is pinned in its review.
Earlier dated “not merged” records below describe their historical conditions.
No push, other branch propagation, next unit or wider project acceptance follows.

2026-11-06 Operator requested replacing the scoped Python research helpers with
Lykn, retaining originals only for migration parity, then deleting their code
and making the no-Python rule explicit in seven-home AGENTS/new CC prompts.
[Slice09](slice09-lykn-research-helpers/slice-plan.md) owns usable validator/
orchestration replacements, finite exact-positive parity and negative controls,
independent review and scoped cleanup. Existing outcome/failure/hash records
and Git history survive. No global Python purge, compiler fix, integration or
full pilot repeat is authorized by this increment.

2026-11-06 Slice09 is independently closed: all seven LH criteria done. Reusable
Lykn validator/orchestration tools and the same12 behavior controls pass actual
independent replay; exact V0 output matches the single original Python oracle
and immutable baseline. Five current program-body files across three related
programs were removed/replaced with source locators, preserving diagnostics,
outputs and Git history. Seven-home explicit policy/citation gates pass; all
four accepted helpers stay unchanged through cleanup. No product compiler
change or propagation occurred. Source-backed NE-C05/06 remain separately owned.
The stale-global-tool false blocker, authoring failures and evidence limits are
preserved in review/retrospective; no next unit or broader project acceptance.

2026-11-06 Operator authorized local integration of the accepted predicate
repair into release/0.6.x, then NE-C03. Merge b841f71b and the unfiltered release
gate are complete (JS+Lykn1466/1466, docs482/482), recorded in Slice07's dated
integration addendum. [Slice08](slice08-template-string-boundary/slice-plan.md)
owns source/template diagnosis, conditional repair after independent semantic
disposition, and the unchanged frozen pilot or an honest next gap stop. Initial
source home is the reused task checkout on new codex/template-string-boundary
at b841f71b; earlier branch refs/history/binary are preserved. No further release
integration, propagation, push/publication or broad escape audit is approved.

2026-11-06 Slice08 independently closed with all six TE criteria done. ID-33
resolved the decoded-string contract; task a061c214 repairs native and JS/mirror
template encoding. Native/public-JS22-value regressions, fresh materialization
and full gate pass (1467 JS+Lykn/482 docs). The unchanged frozen pilot now passes
5/5 bundles and11/11 calls in both CC and independent CDC replications, with
13 public files/nine exports preserved. Python orchestration nonconformance is
retained explicitly. This fulfils the bounded re-entry under a new compiler
condition; prior Slice06/07 failures/deferred rows stay historical. NE-C02/04/D01,
all original F rows and Project07 synthesis/library/human obligations remain
open. The template fix is not merged into a release branch.

2026-11-05 Operator approved repairing NE-C01 then resuming the unchanged native
five-control pilot. [Slice07](slice07-contract-predicate-lowering/slice-plan.md)
owns that bounded implementation/test/replay increment, with same Sol 6.1 High
CDC and fresh Luna 6 High CC. Guidance cleanup is independently complete;
task source tip9be0c301 retains74a code baseline. Repair/gates need independent
acceptance before frozen pilot replay; no production propagation, new backend,
dependency update, push or publication. Original Slice06 failed counts/deferred
rows and all F/Project07 outcomes remain historical/open as recorded.

2026-11-05 Slice07 independently closed at its authorized new-gap stop.
NE-C01 task-branch repair at86d116d passes17/17 strict inputs and the independent
full repository gate. Frozen controls independently reproduced C4 attribution,
then first C5 child exit0 but outer template oracle mismatch. CP-01/02/03/06
done, CP-04/05 deferred to existing backlog NE-C03: four bundles/ten calls unrun.
NE-C02 separately owns the branch-binding observation. No release integration,
new slice, dependency/backend change or full audit/library acceptance follows.

- [slice01-treeshake-audit](slice01-treeshake-audit/slice-plan.md): compiled-output tree-shakeability research; open.
- [slice12-offline-walker-capability](slice12-offline-walker-capability/slice-plan.md): closed at reproduced native async-export validation gap; candidate tooling retained, parser0/4 and full K gate unrun; NE-C07 owns re-entry.
- [slice11-audit-evidence-contract](slice11-audit-evidence-contract/slice-plan.md): independently closed method settlement; all original audit rows/execution remain open and separately gated.
- [slice10-template-release-integration](slice10-template-release-integration/slice-plan.md): independently closed; exact accepted template repair integrated locally into release/0.6.x with fresh release gates and byte/ancestry reconciliation; no other propagation.
- [slice09-lykn-research-helpers](slice09-lykn-research-helpers/slice-plan.md): closed; Lykn replacement/parity, independently passing12 controls, scoped Python body deletion and explicit seven-home policy delivered; separate language/diagnostic follow-ups remain.
- [slice08-template-string-boundary](slice08-template-string-boundary/slice-plan.md): closed; decoded-template repair/full gates and unchanged five-bundle/eleven-call pilot independently accepted on dedicated task branch; no further integration implied.
- [slice07-contract-predicate-lowering](slice07-contract-predicate-lowering/slice-plan.md): independently accepted predicate repair/full gates; frozen pilot stopped at independently reproduced template-oracle mismatch, four done/two deferred rows; NE-C03 re-entry.
- [slice02-packaging-strategy](slice02-packaging-strategy/slice-plan.md): distribution strategy research; open.
- [slice03-threading-macros](slice03-threading-macros/slice-plan.md): completed argument-position research; language-design disposition remains separate.
- [slice06-native-esbuild-controls](slice06-native-esbuild-controls/slice-plan.md): independently verified native tool/C4 attribution and required first-C5 parse stop; four done/three deferred rows, remaining controls unrun; NE-C01 owns re-entry.
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

- 2026-11-06 v1.18: Independently closed Slice12's requested first-gap stop,
  preserving native authoring failures, actual valid-source rejection, process
  nonconformance/reviewer retraction and all unrun controls. Routed NE-C07;
  no compiler repair or audit execution opened, all original outcomes survive.

- 2026-11-06 v1.17: Opened explicitly approved staged Slice12 tooling/capability
  increment, with exact controls/pins, preserved pre-run freezes and first-gap
  stop. Full audit and every original/inherited outcome remain separately gated.

- 2026-11-06 v1.16: Independently accepted Slice11's source-grounded walker/
  native-esbuild evidence contract and preserved amendment, five WC rows done,
  retrospective complete. No implementation or audit execution inferred; all
  original F rows, inherited library/human and separate compiler owners remain.

- 2026-11-06 v1.15: Opened bounded Slice11 after explicit audit-contract
  settlement approval. CC authors the source-grounded method; CDC independently
  reviews. Preserve full original audit and all library/human obligations; stop
  before execution or another unit.

- 2026-11-06 v1.14: Independently accepted Slice10's local template merge and
  actual release validation, with all five TI rows done and retrospective.
  Preserved earlier task-only statements as dated history and every other open
  audit/library/compiler/human obligation; stopped at the integration endpoint.

- 2026-11-06 v1.13: Opened [Slice10](slice10-template-release-integration/slice-plan.md)
  after explicit Operator approval to merge accepted template repair a061c214
  into release/0.6.x, validate and independently review under the same
  Sol6.1 High CDC / Luna6 High CC Autonomous arrangement. Endpoint is this
  local integration only; preserve synchronized policy, all original evidence,
  open audit/library/human gates and other compiler candidates. No propagation,
  push, publication, new compiler fix or subsequent unit is authorized here.

- 2026-11-06 v1.12: Independently closed Slice09's usable helper migration,
  exact positive parity, fixed controls, actual code retirement and policy;
  retained history/evidence limits and owned NE-C05/06 without new compiler scope.

- 2026-11-06 v1.11: Opened bounded Slice09 after explicit Operator replacement/
  removal request; original Python is temporarily a frozen parity oracle,
  with actual code deletion and seven-home policy delivery required at close.

- 2026-11-06 v1.10: Independently accepted Slice08 repair and complete bounded
  frozen pilot; retained process nonconformance, historical failed conditions,
  separate compiler/cache/guide owners and original audit/Project07 gates.

- 2026-11-06 v1.9: Recorded explicitly authorized local release predicate
  integration/full validation and opened canonical Slice08 for NE-C03 with
  finite diagnosis, semantic review, conditional repair and unchanged pilot
  obligations. No legacy assertion is promoted to Operator language policy.

- 2026-11-05 v1.8: Independently accepted bounded native contract repair and
  full validation, then closed Slice07 at the separately reproduced frozen
  observer gap. Retained partial pilot counts, all prior failures/process
  nonconformance, NE-C02/03 owners and original audit/library/human obligations.

- 2026-11-05 v1.7: Opened Operator-approved NE-C01 repair plus frozen pilot
  re-entry after guidance cleanup. Recorded dedicated updated task tip, fresh
  same-model CC, meaningful native regressions/gates and staged independent
  acceptance without changing original audit/library/human obligations.

- 2026-11-05 v1.6: Independently closed Slice06 as a bounded stop: reproducible
  native esbuild and C4 attribution delivered; first C5 failed before evaluation,
  four bundles/ten runtimes unrun. Routed NE-C01 to the existing backlog;
  deferred full control criteria and completed retrospective, no source fix.

- 2026-11-05 v1.5: Operator approved pinned native source-built esbuild/Go inputs
  and direct CLI/metafile for the bounded five-control attempt. Opened coherent
  Slice06 with durable tools, exact task branch, predictions and independent
  review. Earlier stop remains history; no original audit/Project07 gate waived.

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
