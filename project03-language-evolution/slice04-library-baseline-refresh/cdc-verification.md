# Slice04 CDC verification

## Initial review — 2026-11-05

Reviewer: CDC, OpenAI Codex Sol 6.1 High; implementer: separate CC Luna 6 High.
Two-Contributor Autonomous Mode. Reviewed initial `cc-prompt.md`, planning
candidate `e4d0e4d159028183836ae853a36f2ea55ee49c19`, source
`release/0.7.x@74a90d51b853fc18fe2b7c6ee07417736e1ce464`.

**Verdict: returned for bounded correction; slice remains open.** LB-05's
selective-entrypoint protocol conflates separate-package and within-package
boundaries. LB-01 also needs a compact clarification of the generically grouped
required-reading extents. Neither issue warrants repeating unchanged source
research or executing a bundler. Current next assignment is
`cc-prompt-iteration01.md`; this initial verdict is preserved after correction.

### Independently reproduced evidence retained for correction

- Planning/source branches, exact HEADs and clean statuses checked; AGENTS.md
  byte comparison equal. CC commit touches exactly the four permitted slice
  paths, has both contiguous co-author trailers, and `git diff --check
  5787097 e4d0e4d` passes. Source and all original Slice01 evidence/statuses are
  unchanged.
- Re-ran installed tool versions: Deno 2.9.6/V8 15.0.245.2-rusty/TypeScript6.0.3,
  cargo 1.99.1 and global lykn 0.5.2. Independently inspected `deno bundle --help`
  during author preparation and review: explicit CLI options are available,
  but no assertion about underlying bundler capability follows from help absence.
- Re-ran the exact five scoped `rg -n` queries with rs/js/json globs: sideEffects
  0 lines / exit 1, npm: 53 / exit 0, node: 57 / exit 0, workspace 16 / exit 0, exports 15 / exit 0.
  Tracked projected source population is 35 files and configuration manifests 4;
  npm/node lexical false positives remain separated from import edges.
- Read default compile arguments/dispatch/cmd_compile and complete native
  `compile_source_inner`, wrappers, bridge implementation/tests, cross_compiler
  test setup and freshness code. Confirmed source routes, not runtime behavior.
- Read configuration types/member/dependency/overlay handling and dist member,
  staging, rewrite and metadata writers, with the cited config/dist tests.
  `rewrite_imports` accepts packages/ OR target/lykn/build/; npm dependency
  extraction accepts packages/ only. JSR configured exports pass through;
  npm root-only export is hardcoded. Neither proves a new lib/ package works.
- Read source package configs, compiler.js's `astring` import, expander.js's
  intentional node:path import/comment and full embedded browser build. Confirmed
  existing JS compiler/build compatibility edges, not stdlib payload or policy
  approval. No build, test, compile, bundle, install or network action run.

One reviewer search used nonexistent `test/helpers*` and returned exit2 after
source matches; no inference used that incomplete search. Replaced it with
`rg --files test` and source-grounded freshness/test reads. This is a retained
inspection error, not a research-program execution or source-authoring failure.

### Row disposition

| Row | Initial review result |
| --- | --- |
| LB-01 | Source/tool/governance/readback evidence reproduced; intake groups several required documents without explicit loaded extents. Clarify recorded coverage honestly; do not redo complete unchanged reads merely to generate receipts. |
| LB-02 | Source claims reproduced at pin, including alternate-route uncertainty and distinct prefix/export policies. Retain this evidence unless correction changes a source claim. |
| LB-03 | Policy/existing-edge distinctions source-checked; no prohibited execution. Retain with original scope: lexical census is not a whole dependency graph or ancestry audit. |
| LB-04 | Exact original 12 F rows preserved and mapped; no original F status/fixture/prompt/prediction changed. Retain. |
| LB-05 | Open: findings initial lines96–100 place YAML modules inside the JSON package. Separate cross-package exclusion from within-package selective subpaths and add precise future specimen outcomes/effect controls. |
| LB-06 | Four-path diagnostic-only delivery and Project07 residual owners checked; retain scope evidence, recheck final close/bubble-up after correction. |

### Bubble-up check

The delivered baseline answers current static boundary questions but no
optimizer/library claim. Full Slice01 experiment, corpus, prediction/divergence
and report obligations survive. Package/member hardcoding and metadata asymmetry
are later implementation proof needs. The next audit's F-6/F-10 evidence contract
remains a separate CDC/Operator decision. No project composition or human gate
closes. Parent status/bubble-up will be updated after accepted correction;
there is no arc wrapper to close or next authorized unit beyond Slice04.


## Final correction review and closure — 2026-11-05

**Current verdict: ACCEPTED; all six LB rows done at reproduced strength.**
Reviewed iteration01 `cc-prompt-iteration01.md` and corrected CC candidate
`55ee1c2c5ac2277cae09de0f6745f4f0c30435df`. The initial failed-review section
above remains historical evidence. Acceptance is the baseline and proposed
protocol only. No optimizer, generated package, runtime, library implementation,
F-row or Project07 acceptance follows. Readiness to execute F-6/F-10 remains held
for the explicit evidence-contract decision.

### Fresh checks and evidence retention

Inspected the complete correction delta, current Intake, all five protocol
claims and both closing-report attempts. Revalidated source clean at unchanged
`74a90d51b853fc18fe2b7c6ee07417736e1ce464`, planning clean at `55ee1c2`, exact
four-path correction diff, contiguous trailers and `git diff --check 2c0c6fa
55ee1c2`. Original initial prompt and all Slice01 content are byte-unchanged
between `5787097` and `55ee1c2`; original mapping has 12 F IDs and slice ledger 6
LB IDs. Installed guide heading/range checks match the specified intake extents.

Retain the independently reproduced source/census/tool/policy observations from
the initial review above, with their original source pin/date: the correction
changes no source observation, input/dependency/tool condition, acceptance scope
or relevant source. No finding undermines that evidence. Current identity and
changed protocol were checked fresh; no wholesale census/research replay was
needed. Reading extents remain CC attestation; review establishes source and
contract consistency, not proof of attention or comprehension.

The corrected protocol separates disjoint JSON/YAML package membership from
value-only JSON subpaths within one package. Positive consumers keep the omitted
YAML/helper entrypoints usable, and JSON input `{"x":1}` has an exact value oracle.
The no-import app's BASE control, used-export 42, exact initialization/entry order
and separate throwing initializer discriminate plausible bad optimization.
Resolved-input graph and retained-output attribution are separate required
observations; missing attribution stays unresolved. Public package exports are
checked independently of one app's eliminated modules. These are hypothetical
future specimen contracts, not new production names/APIs or executed tests.

### Final row walk

| Row | Final status | Independent basis and limits |
| --- | --- | --- |
| LB-01 | done / reproduced | Baseline/governance/tool facts reproduced initially and current identity rechecked; intake now enumerates actual full/section extents and concise correction readback. Receipts remain attested; source/contract agreement independently inspected. |
| LB-02 | done / reproduced | Retained native/bridge/config/dist/package/test source checks at pinned revision; distinguishes generic member joining, prefix-specific rewriting/dependency extraction and JSR/npm export policies without a new-build claim. |
| LB-03 | done / reproduced | Retained scoped census and exact source imports/build route; current policy holds old npm execution and new dependencies. Lock/history/whole-graph ancestry not inferred from lexical matches. |
| LB-04 | done / reproduced | All 12 original IDs mapped with meaning/evidence/owner, original content/statuses preserved, and F-6/F-10 changes explicitly held. |
| LB-05 | done / reproduced | Fresh semantic check of distinct no-import, cross-package, within-package, app-effect and public-API controls, exact future specimen observations and declared unavailable attribution/tool evidence. No experiment or evidence equivalence accepted. |
| LB-06 | done / reproduced | Fresh final diff, both close attempts, artifact inventory and residual/bubble-up walk; source unchanged, original audit and Project07 owners retain their full scope. |

### Final bubble-up, artifact and boundary check

One supporting artifact was produced: `artifacts/findings.md`. Plans, both
preserved prompts, closing report, this verification and retrospective are
first-class slice records. No extra fixture, program, package, source output or
registry was created. All six opening rows have final dispositions with no
silent drop. Required retrospective: [cdc-retrospective.md](cdc-retrospective.md).

The collapsed slice delivers current static baseline/policy knowledge and a
falsifiable next-audit proposal, as the project assigned. Updated Project03's
status/version history to record this delivery and its consumer: later Slice01
re-entry. The source reveals actual future lib/dependency/metadata proof needs,
but does not authorize implementing fixes. There is no arc wrapper to close;
Project03 P-1 remains open. Project07 consolidated synthesis, licence/bootstrap/
actual-home proof, all 28 Y-14/all 36 unsupported Y-13 cells, ADT/guide/book/human
judgments and JSON-before-production-YAML remain. No higher-scale composition
or Operator gate closes. Autonomous authorization ends at this slice's close
and retrospective; report the next decision, do not advance automatically.
