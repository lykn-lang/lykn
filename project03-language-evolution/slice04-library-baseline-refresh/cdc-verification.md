# Slice04 CDC verification

## Initial review — 2026-11-05

Reviewer: CDC, OpenAI Codex Sol 6.1 High; implementer: separate CC Luna6 High.
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
- Re-ran installed tool versions: Deno2.9.6/V8 15.0.245.2-rusty/TypeScript6.0.3,
  cargo1.99.1 and global lykn0.5.2. Independently inspected `deno bundle --help`
  during author preparation and review: explicit CLI options are available,
  but no assertion about underlying bundler capability follows from help absence.
- Re-ran the exact five scoped `rg -n` queries with rs/js/json globs: sideEffects
  0 lines/exit1, npm:53/exit0, node:57/exit0, workspace16/exit0, exports15/exit0.
  Tracked projected source population is35 files and configuration manifests4;
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
