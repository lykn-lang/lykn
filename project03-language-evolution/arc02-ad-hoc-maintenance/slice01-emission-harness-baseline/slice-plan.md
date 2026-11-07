---
project: project03-language-evolution
arc: arc02-ad-hoc-maintenance
slice: slice01-emission-harness-baseline
status: planned
planned-release: unassigned
depends-on: []
related: [arc01-compiler-semantic-integrity/slice02-checked-emission-results]
---

# Local emission harness and old-compiler baseline

## Planning authority and delivery boundary

2026-11-07 Operator requested planning this maintenance item while S02 is paused. No source action, CC dispatch or baseline execution is approved now. This plan is not an executable assignment; there is deliberately no issued `cc-prompt.md` or pre-created close/verification record. CDC `/root/cdc` Sol6.1 High owns planning; the last selected future implementation/review roles are Luna6 High CC and separate Sol6.1 High CDC. Execution-specific source/index ownership and preserved prompt are prerequisites to any future work.

Deliver one corrected local test plus a trustworthy old-API compiler baseline. Do not implement Result APIs, alter production code, replace shared infrastructure, change the three source constants (one invalid and two valid), integrate/push/publish, install/update dependencies, or run the old tools/K/walker/corpus/library work. Source scope, when separately approved: ONLY `crates/lykn-cli/tests/emission_failures.rs`, currently261 lines at `codex/checked-emission-results@23219431e6d154a4e046bfd375a01dc8bfb3929d` in `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`. Proposed execution branch is `codex/emission-harness-baseline` from exact232 in that same physical checkout, preserving its old ref/history; revalidate availability before creating it, never modify release8f. After acceptance and explicit S02 continuation, a new S02 task branch should descend directly from the exact accepted maintenance candidate, retaining232 and its correction history without cherry-pick/rewrite or merging into release. No branch creation or transfer occurs in this planning task. Planning/evidence default home is this slice's `artifacts/`, created only when actual evidence exists.

## Evidence and defect boundary

The [S02 review](../../arc01-compiler-semantic-integrity/slice02-checked-emission-results/cdc-verification.md) source-verifies CE-R01–04 against exact2321943 and unchanged production8f. One no-run build0 is transcript-attested only, with an unused SystemTime import and missing original durable streams/post-build pin. Actual test functions0/2, invalid compile conditions0/4, valid runtime conditions0/4. No product/runtime result or repository-wide harness failure is established. Preserve the old prompt, review, test commit and capture limitations.

One initial S02 attempt failed. Zero numbered refinements executed. This proposed consolidated correction is **refinement01 of the inherited five-refinement allowance**, not a fresh five passes in another arc. At future execution record the same shared count in both assignment histories; prompt sequence names do not reset counts. Eight older tooling passes remain spent, K0/13. Any further substantive issue requires the then-applicable stop/Operator disposition, not a silent new maintenance slice or changed oracle.

## Concrete local correction

Keep existing four invalid conditions and two valid source fixtures unchanged. Correct these authored tests in one useful increment:

1. **Real package output paths.** Config name is `@fixture/emission` (test42). Source `crates/lykn-cli/src/config.rs:176–180` strips the scope and `src/dist.rs:602–610` uses that short name. All sentinel and positive reads must watch `target/lykn/build/emission/{mod.js,mod.d.ts}`. May assert the public build result's short_name equals `emission`, but do not derive an expected path from the implementation under test alone. No production-path change.
2. **Exact optional DTS contract.** These two unchanged valid fixtures have no exports and require no DTS. `emitter/dts.rs:201–301` and CLI compile.rs384–387 make absence legitimate; dist writes only nonempty content. Assert JS success/presence and explicit DTS absence for these fixtures. Still preserve both pre-existing JS/DTS sentinels on invalid compilation. This does not establish general type-declaration availability or repair NE-T01.
3. **Execute both routes.** For each unchanged valid source, run both CLI-generated and correctly located package-generated JS with the existing strict Deno child route. No new authored JS/research driver. Save/read the complete emitted source before runtime, full child streams and exit before aggregate assertions. Do not count build-only package observations as runtime results.
4. **Nonvacuous oracles.** Bound-dissoc source: exact exit0, stdout bytes `"kept"\n`, empty stderr. User-text/throw source: exact exit1, stdout `COMPILE_ERROR: literal\n`, stderr must identify both TypeError and `COMPILE_ERROR: user runtime`. Never use contains("") or accept arbitrary nonzero as the required exit. No text scanning to decide compiler validity; this is a known intentional program exception control.
5. **Actual stale outputs and capture.** Set the correctly watched owned JS/DTS mtime to UNIX_EPOCH with stable File APIs and assert source mtime is greater than both before build. No sleep/clock adjustment/dependency. Remove the unused SystemTime import. Capture unique complete raw streams/argv/cwd/env/status from the first corrected build/run and pin final actual CLI/test executables after no-run build, before direct execution. No test binary run before actual source Git freeze.

Source facts above belong to the named task checkout at232 (production byte-identical to8f), not planning's tree. No new source investigation is needed to establish these local defects.

## Separate harness quality from product behavior

Use small private Rust test predicates within the existing test file, not a generic harness or replacement framework. Retain exact byte/exit checks; add finite data-only self-checks so a weakened predicate fails:

- The two exact valid status/stdout/stderr triples pass their own predicate.
- Fixed bound-call predicate rejects independently wrong exit, stdout and nonempty stderr.
- Fixed intentional-throw predicate rejects independently wrong exit (including2), stdout, missing TypeError and missing user message.

These are data-only checks of the actual assertion functions used by BOTH routes, not new Lykn programs, compiler variants or K cases. Keep their count distinct from the four invalid and four valid runtime conditions. File/path/mtime checks still depend on actual owned files; they cannot be replaced by synthetic data.

The finite predicate population is ten checks: two positive triples; three independently mutated bound-call triples (exit1, wrong stdout, nonempty stderr); five independently mutated throw triples (exit0, exit2, wrong stdout, missing TypeError, missing user message). Freeze their exact data with the corrected source before executing them. This is local test validation, not a new research harness.

The four invalid-source conditions remain: CLI stdout; CLI `-o` existing files; CLI `-o` fresh files; public package build existing files. Capture all four before the future-product aggregate assertion. Source `(bind obj-value (obj :secret 1)) (bind cleaned (dissoc obj-value "secret")) (console:log cleaned)` remains frozen in the test. The desired future Result oracle is rejection/no JS stdout/no changed or new JS/DTS, but the OLD compiler is predicted to return success-shaped output because nested recognized classification Err is raw-cloned at emitter/forms.rs525. Thus the product regression test is expected RED now; that meaningful red is a required baseline result, never ignored, filtered or renamed a pass.

The two valid sources and required runtime values are those in source232/test constants and S02 plan, not replacement fixtures. CLI resolves bound `dissoc`; current package route lacks resolution, but its nested classifier fallback can preserve this particular ordinary call. Source-based prediction is that it still compiles/runs correctly; that is not an observed fact or a claim the package route is generally resolution-correct. Record any actual discrepancy with complete evidence as product behavior, separate from harness-quality results; do not repair the route or weaken the required valid-control oracle. Resolution adoption remains S02. Unexpected substantive behavior or inability to distinguish harness from product failure stops for review.

## Required future verification and acceptance

After separate execution approval, freeze corrected test/predictions, perform no-run build and final binary/hash pin, run the actual test executable unfiltered so all self-checks, four invalid conditions and four valid route/runtime conditions are observed. Keep expected product-red exit(s) explicit. A trustworthy baseline can be accepted with those predicted regressions red **only when** harness-quality self-checks pass, all mandatory raw observations are present, valid controls are dispositioned against their unchanged required oracle, and separate CDC reproduces the same fixed conditions. Do not confuse the supervisor's acceptance of a faithful baseline with the test binary or product passing.

Native formatting/compilation of this owned test is required. Full normal `make check` GREEN is not a maintenance acceptance prerequisite while this intentionally red product test is retained; do not skip/filter/ignore it to manufacture that result. S02 must later make the unchanged future-product oracle pass and run its full normal source/citation gates. If a full gate is run here for a concrete reason, retain its actual failure/counts; do not call it green or use it to expand scope.

The independent CDC reviews exact test/source contract paths and predicates, complete generated modules/sidecar absence, actual producer identities/strict child argv, file mtimes/outcomes and full baseline population; then fresh replay in separate owned outputs. No self-review counts as independent acceptance. Required full source validation remains with S02 after product changes. All helper/research/JSON logic stays Lykn; no Python execution/exception, Ruby/Fennel/handwritten research JS/Node/jq/shell-logic substitutes, hooks bypass, suppression, permission widening or new dependencies. Necessary product Rust test code and direct native CLI/filesystem actions only.

## Return and assignment history

No implementation assignment is issued by this planning record. On execution approval, author the source-ready preserved initial prompt here, explicitly identifying shared refinement01 and exact ownership/gates/message file. Keep original S02 initial prompt and stopped review unchanged.

Accepted maintenance S01 provides a linked corrected test and independently reproduced baseline, not CI-02 closure. CDC updates both plans/ledgers and asks for explicit S02 continuation at its already-approved Result design; further source work remains held until then. Arc02 may retain unrelated future intake without blocking this return. No automatic next maintenance unit, source fix or integration.

## Version history

- 2026-11-07 v0.1: Planning-only consolidated local harness correction/baseline delivery, separate harness/product outcomes, inherited allowance and explicit S02 return gate.
