# arc16 slice10 - Language Surface Chapters Closing Report

Status: **Closed / CDC-verified 2026-09-12**.

## Outcome

slice10 refreshed the Lykn Book language/compiler examples that were still failing after the toolchain pass. The book-side change landed in `/Users/oubiwann/lab/cnbb/lykn` as commit `6aa379d` (`docs: refresh lykn language chapters`).

The pass corrected current-surface examples by using explicit `kernel:` escapes where the chapter is showing kernel-only declaration forms from surface context, marking true sketches/fragments as skipped or fragments, retagging comparative LFE as `scheme`, updating destructuring edge cases to use `compile-fail`, replacing stale shallow-copy examples with current object spread / `Object.assign` / `structuredClone`, and updating compiler-chapter kernel examples.

One implementation defect was newly routed: `D-2609-FOVL`. The overlap chapter teaches compile-time rejection for overlapping multi-clause `func` definitions. The CLI compile path rejects the examples, but the JS API path used by book doctests emits first-match code and a fall-through runtime error instead of throwing at compile time. The book examples are skipped with an explicit caveat pending the routed fix; the arc now needs slice11 before edition close.

## Grounding

The pass read and applied:

- lang worktree `AGENTS.md` and branch/worktree ownership rules;
- book repo `AGENTS.md`;
- writers-guide `AGENTS.md`, `authoring-guide.md`, and `planned-toc.md`;
- arc16 `arc-plan.md`;
- slice10 `slice-plan.md`, `ledger.md`, and `cc-prompt.md`;
- slice07 current-book drift inventory;
- slice08 close and CDC evidence for `D-2609-FNRT`;
- slice09 close evidence for the toolchain/project-structure chapter pass;
- source guides for surface forms, core idioms, values/references, type discipline, functions/closures, anti-patterns, and testing/doctest annotation behavior.

## Chapter map

Book commit `6aa379d` touched these files:

- `src/part1/chapter2/2-the-kernel.md` — replaced bare kernel-only `const`/`function` examples with explicit `kernel:` escapes from surface context.
- `src/part1/chapter2/4-the-pipeline.md` — marked illustrative internal kernel output as skipped instead of testing it as ordinary surface source.
- `src/part2/chapter7/7-kernel-underneath.md` — marked the kernel vocabulary sketch as skipped and clarified the surface-file escape boundary.
- `src/part2/chapter8/4-overlap.md` — recorded `D-2609-FOVL`, updated diagnostic text, and skipped examples pending JS API compile-time parity.
- `src/part2/chapter8/6-erlang-heritage.md` — retagged the LFE comparison sample as `scheme`.
- `src/part3/chapter12/3-keywords-as-keys.md` — marked ellipsis examples as fragments.
- `src/part3/chapter14/2-kernel-passthrough.md` — changed top-level mutable `let` example to explicit `kernel:let`.
- `src/part3/chapter14/3-library-patterns.md` — renamed the Express placeholder factory to avoid collision with Lykn's `express` form.
- `src/part3/chapter15/3-parameter-destructuring.md` — changed the kernel `function` destructuring example to explicit `kernel:function`.
- `src/part3/chapter15/6-edge-cases.md` — marked intentional bad destructuring examples as `compile-fail`, removed ellipsis from bad snippets, and separated the valid alias example.
- `src/part4/chapter18/5-copying.md` — removed stale zero-argument `assoc` shallow-copy prose and used current object spread, `Object.assign`, and `structuredClone` spelling.
- `src/part4/chapter20/3-fields-private.md` — marked the private-method-only sample as a fragment.
- `src/part7/chapter32/2-reader.md` — skipped the reader-input example so the following reader AST text is not treated as runtime output.
- `src/part7/chapter32/3-compiler.md` — changed compiler kernel examples to explicit `kernel:const` and `kernel:function`.

## Verification

Focused touched-chapter gate from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test   --docs src/part1/chapter2/2-the-kernel.md   --docs src/part1/chapter2/4-the-pipeline.md   --docs src/part2/chapter7/7-kernel-underneath.md   --docs src/part2/chapter8/4-overlap.md   --docs src/part2/chapter8/6-erlang-heritage.md   --docs src/part3/chapter12/3-keywords-as-keys.md   --docs src/part3/chapter14/2-kernel-passthrough.md   --docs src/part3/chapter14/3-library-patterns.md   --docs src/part3/chapter15/3-parameter-destructuring.md   --docs src/part3/chapter15/6-edge-cases.md   --docs src/part4/chapter18/5-copying.md   --docs src/part4/chapter20/3-fields-private.md   --docs src/part7/chapter32/2-reader.md   --docs src/part7/chapter32/3-compiler.md   --fence lisp
```

Result: 14 generated test files, 39 runnable blocks, 9 skipped blocks, 39 passed / 0 failed.

Whole-book `lisp` gate from `/Users/oubiwann/lab/cnbb/lykn`:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
```

Result: 177 generated test files, 425 runnable blocks, 22 skipped blocks, 425 passed / 0 failed.

Book build:

```sh
mdbook build -d book
```

Result: passed, with only the existing mdbook-mermaid preprocessor version warning.

Book whitespace:

```sh
git -C /Users/oubiwann/lab/cnbb/lykn diff --check
```

Result: passed.

Implementation probe for `D-2609-FOVL`:

- `lykn compile /private/tmp/overlap1.lykn` rejected overlapping clauses with `clauses 0 and 1 overlap (same arity 1, compatible types)`.
- JS API `lykn(src)` under release `project.json` returned JavaScript with duplicate compatible checks and a fall-through `TypeError` instead of throwing at compile time.

No release/0.6.x source files changed in this slice, so source gates were not run.

## Row walk

- L-1 done: required instructions and current language guidance were read before edits.
- L-2 done: the touched chapter map above names every changed chapter and maps it to the slice07 failure classes.
- L-3 done with routed caveat: kernel-only and non-surface examples were corrected or annotated; overlap compile rejection is routed as `D-2609-FOVL`.
- L-4 done: intentional error, placeholder, and non-Lykn examples now use `compile-fail`, `fragment`, `skip`, or non-Lykn tags as appropriate.
- L-5 done with routed caveat: touched prose and examples match current 0.6.x behavior except the overlap parity defect, which is explicitly routed.
- L-6 done: focused and whole-book doctest gates pass with counts above.
- L-7 done: generated book `target/` was removed, `_to_delete/` was preserved, and repo status was checked.
- L-8 done: planning surfaces are updated in this closeout and slice11 is opened.

## Artifact inventory

- Book commit: `6aa379d` (`docs: refresh lykn language chapters`).
- Discovery Register row: `D-2609-FOVL`.
- Planning close artifacts: this closing report, the updated slice10 ledger,
  and [`cdc-verification.md`](cdc-verification.md).
- Next-slice open set: `slice11-js-overlap-compile-parity/`.
- No durable generated artifacts. Generated doctest `target/` was removed; mdBook output under `book/` remains ignored by the book repo.

## Bubble-up to the arc

slice10 delivered the language/compiler chapter pass assigned by arc16, but it surfaced a new implementation blocker: the JS API does not compile-reject overlapping multi-clause `func` definitions in the way the CLI compile path does. That changes the arc sequence. The final edition close cannot be next; arc16 now needs slice11 `js-overlap-compile-parity`, and the edition close moves to slice12.

Scope-as-specified versus scope-as-delivered: all slice10 language-surface failure classes were fixed, annotated, or routed. No slice10 ledger row was dropped. The only remaining caveat is explicit and routed as `D-2609-FOVL`.
