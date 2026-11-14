# S03 independent CDC verification

## Source-readiness review — PASS — 2026-11-14

Reviewer: the separately assigned OpenAI gpt-6.1-sol/high CDC context
`/root/arc05_s03_cdc`; root owns design/planning and source/build preparation,
and the operator selected Luna6 High as the prospective CC implementer.
This verdict covers the corrected, still-unissued initial draft, not an
implementation. All nine PB rows remain open.

Source inspected in
`/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, assigned
branch `codex/qualified-adt-core` at
`9e6fb1270c3efcbaa0f6ddb9f0fbfd3b2c1c825a`, tree
`6d64692fde0c367e73deeda1ec1aca19e49d6b93`. Root supplied the clean pin;
this readiness assignment prohibited Git/index operations, so the reviewer
did not independently repeat that status check. Planning is the existing
orphan planning worktree. Release remains outside this assignment.

Read the full draft slice plan, nine-row ledger and initial prompt, including
root's preparation corrections; repository AGENTS.md; collaboration-framework
and project-management routing; engineering-methods' prompt-authoring/intake
and readiness contract; the relevant JS/Deno identity, copying, scope and error
testing guidance; testing's validation/proportionate-proof guidance; and the
relevant source language/API and accepted S02 boundary records. Inspection used
bounded source reads, symbol searches and a static selected-test census.
Source and guide locators below describe the inspected baseline, not planning
as a second source tree.

### Source-grounded conclusions

- The two preparation doors are viable. Explicit escapes validate and mark at
  `packages/lang/expander-core.js:1956–1987`; the normal fallback at2338 follows
  lexical resolution, classification and macro expansion at1991–2144.
  `expandAt:1881–1906` propagates sanctioned identity. Preparation must operate
  on the precise node later marked, while skipping already sanctioned own
  slots. Generated Type constructors really bind schema `_` fields at
  `packages/lang/classifier.js:1537–1581`; expansion sanctions their output at
  `packages/lang/expander-core.js:2085–2100`. A global writer/tree rewrite would
  violate the contract.
- Occurrence-local structural copies fit existing identity ownership:
  `cloneOccurrenceSyntax:855–864`, `compilerPrivateAtom:763–768` and
  `finalizeCompilerPrivateAtoms:1263–1291` in expander-core preserve private
  capabilities through actual object identity. The draft correctly rejects
  JSON/structuredClone as a copying mechanism before finalization, while
  retaining finalized JSON as a public output check.
- Ordinary pattern preparation can extend the existing
  `surface-helpers.js:369–443` recursion without touching default RHSs or keys.
  Actual per-parameter and class-member slots follow compiler.js:825–912 and
  lexical-regions.js:10–144. The untyped spread omissions are real:
  binding.js:673–693 and lexical-regions.js:67–100 omit a role already consumed
  by compiler.js:1968–1975. Typed parameter grammar need not widen.
- Catch must follow the legacy expression writer and suffix selection,
  compiler.js:1084–1138, not ordinary declaration patterns. The corrected
  design now follows default/rest/spread expression operands at1437–1458 and
  1508–1517, object shorthand/pairs/computed keys at1520–1602, and selected
  catch/finally/direct-body expansion in expander-core.js:1140–1184.
- Public grouped admission is already broader than the native historical
  proxy: classifier.js:350–393 admits untyped non-atom patterns without a
  nonempty-name gate, and compiler.js:1934–1937 supports empty-list shorthand.
  Normalizing static alias keys only for zero-name untyped groups fits
  compilePatternKey:2097–2105 and the existing Keyword conversion at
  compiler.js:1814–1815. Preserving String/numeric keys, named/single/raw
  branches, metadata and expression roles is explicitly specified.
- The shared signature rejection can use actual parseTypedParams results
  (surface-helpers.js:565–633) before expansion. Func classification/emission
  at classifier.js:294–304 and742–765 plus exported builders at823 and982 are
  genuine entrances. The corrected recipe delegates one-clause calls in the
  exported multi builder itself, preserving both source and direct callers.
- M6's retained population statically totals62:5 embedded ADT +6 type context
  +17 reserved bindings +6 ICU +21 lexical regions +7 existing discards.
  The selector and exact count assertion are macro_dependencies.rs:1124–1163;
  its14 canonical/embedded/materialized comparisons are1059–1098. Eight new
  top-level tests yield the specified70. This is a census, not runtime proof.

### Preparation observations and disposition

Review and root's parallel source inspection corrected three consequential
draft details before issue: ordinary `function` is named-only (compiler.js:825),
whereas `function*` admits anonymous layouts (851–891); public catch defaults,
rests and spreads retain legacy expression recursion, and an `alias`-named
object property is not a standalone alias subwriter; one-clause delegation
belongs in the exported multi builder with direct-builder default/rest proof.
Root also replaced approximate guide names with actual reading-manifest
headings. These are preparation corrections, not an accepted implementation
or a spent CC refinement. No source or test was changed by this reviewer.

The corrected plan/prompt/ledger agree on exact14 product paths, eight new test
groups and nine open PB rows. The recipe resolves the consequential producer,
role, admission, static-data and signature decisions. The foreign99/argument7,
iterator-result getter0/2 and early-close1/1, catch live-value/legacy8, unexpanded
default macro0, source-only namespaces, schema7/type-error and raw-versus-
expanded controls distinguish plausible wrong implementations. Real facade,
fragment, browser compile-to-ESM and materialized delivery gates are retained,
with the browser execution-policy claim explicitly bounded. No material
readiness ambiguity remains.

**PASS for root to finalize and issue this draft within its recorded authority.**
No build, runtime experiment or Git/index operation was performed, and no PB
implementation criterion is independently accepted here. The later source
verdict must inspect CC intake/readback, actual candidate/diff and oracles,
then reproduce the required focused/full/inner M6/citation/fresh-size checks.
Source/build ownership remains with root; this reviewer has no running jobs.
