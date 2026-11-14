# CC intake and evidence index — Arc05 S01

## Intake pin and ownership

Source worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/qualified-adt-core`, HEAD `dba24d4063f34551c30590c884a495c8ca57298f`, initial tree `0ad99ea5838a463ee8aa680005fae472a0b8135c`; clean at intake. Planning worktree `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch `planning`. Root retains planning Git/index/ledger and architecture; this CC owns source/build for only the three paths named in the active prompt.

## Required reading coverage

Read to EOF: active `cc-prompt.md`; current `slice-plan.md`; current `ledger.md`; source `AGENTS.md`; preserved S03 `artifacts/b2-public-discard-recipe.md`; preserved S03 `artifacts/increment-b2b3/public/cdc/README.md` and `source-review.md`. The historical path was resolved from `rg --files` under the `project03-language-evolution` tree after an initial malformed absolute path omitted the slice directory; no evidence was edited or inferred from that miss.

Required source sections read: `packages/lang/binding.js` PatternGrammar and catch/function routes (lines 33–34, 178–197), full `walkPatternDefaults` (276–302), `kernelParamNames` (673–698), complete `patternNames` (848–880) and `validateReservedNames` (902 onward), plus its imports (`isCompilerPrivateAtom`, `formHead`, reserved-name projection). Read the complete existing `test/forms/discard-bindings.test.js` (489 lines), including all seven top-level groups and actual helper cleanup/ESM command behavior. Read M6's pre-created evidence-root contract and actual count assertion in `crates/lykn-cli/tests/macro_dependencies.rs` (46–56, 1011–1165). Read source `skills/lykn/SKILL.md`, surface forms' `bind` and `try/catch` conventions, plus installed JS anti-pattern ID-12, functions ID-08, Deno testing IDs 01/03/04, and testing component guides 01 and 03.

The first combined source/guide output was truncated; I recovered the relevant source ranges and each assigned guidance chapter with separate bounded reads before proceeding. The active prompt, current plan/ledger and full historical HOLD/readiness packet were read without truncation.

## Contract readback before edits

At the pinned candidate, catch callers deliberately use `PatternGrammar.CATCH_BINDING` (`binding.js:188`, `patternNames(..., "catch-binding", ...)` at `:566`). In `walkPatternDefaults`, the default branch first recursively validates a default's left pattern only when the grammar equals `BINDING_PATTERN` (`:276–284`). The new catch mode therefore skips the pre-existing path that reached a raw arrow parameter nested at a catch default-left. Keep the catch mode and its projection boundaries: change only the recursion discriminator to `!typed`, so typed parameter slots stay excluded while BindingPattern and CatchBinding retain non-TypedParameter left recursion. Do not add typed-source-fn catch expansion or alter catch grammar.

The discriminating positive is the exact nested raw-arrow fixture in the prompt; through both public facades it must compile and execute as ESM with process code 0, stdout `1\n`, stderr empty. Replacing only the parameter `input` with `eval`, then with `arguments`, must make both facades reject during compilation with the existing strict-binding diagnostic substring. A generated-JavaScript SyntaxError is a failed oracle. Add these assertions only to the existing pattern/catch group, preserve its catch8 controls, seven total groups, and M6 selection 62 tests / 14 comparisons. Preserve the complete inherited PD-01–09 contract and existing product-test population.

Before any test edit, the exact original test bytes were copied to `artifacts/cc/discard-bindings.pre-edit.js`; source and snapshot both hash `3e0e49718f5962b2af7a5988348722ce0b43bb6aef38af5dc1d18357b24d7125`. The task's actual regression-first command, focused/full gates, receipts, exact three-path commit and no-post-gate-edit constraints remain binding. `closing-report.md` is also required at proposed-done with the nine PD-row evidence walk, artifact inventory, bubble-up and retrospective link; it is an implementer report, not row acceptance.
