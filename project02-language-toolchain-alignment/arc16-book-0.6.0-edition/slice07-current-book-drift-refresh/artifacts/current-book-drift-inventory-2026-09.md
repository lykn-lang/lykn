# Current Book Drift Inventory - 2026-09

Closed by CC as part of arc16 slice07 on 2026-09-12.

## Baseline

| Repo | Branch/status before edits | HEAD | Notes |
|---|---|---|---|
| planning | `## planning` | `65d501f` | clean at slice start; planning artifacts written here |
| lang 0.6.x | `## release/0.6.x` | `cd3e95e` | clean; used `/bin/lykn` for probes |
| book | `## main`; `?? _to_delete/` | `ee10a47` | `_to_delete/` pre-existing and preserved; generated `target/` came only from fence runs |
| writers-guide | `## main` | `db1777f` | instruction-path drift fixed in this slice |

After edits, book and writers-guide each have one scoped instruction commit; planning has the slice close and next-slice open set.

## Current Book Fence Evidence

Commands run from `/Users/oubiwann/lab/cnbb/lykn` with the live 0.6.x binary:

```sh
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp
/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/bin/lykn test --docs src --fence lisp --fence lykn
```

Both commands exited `1` after reaching generated Deno execution, which is acceptable evidence for this recon.

| Command | Generated files | Blocks | Skipped | Passed | Failed | Log |
|---|---:|---:|---:|---:|---:|---|
| `--fence lisp` | 176 | 444 | 0 | 417 | 27 | `/private/tmp/slice07-book-lisp.log` |
| `--fence lisp --fence lykn` | 177 | 447 | 0 | 420 | 27 | `/private/tmp/slice07-book-lisp-lykn.log` |

The mixed run adds three `lykn` fences, and all three pass. The failure set is unchanged.

## Current Failure Triage

| Source | Block | Nearby context | Failure class | Source-of-truth comparison | Disposition |
|---|---:|---|---|---|---|
| `src/part1/chapter2/2-the-kernel.md` | 1 | Kernel / what the kernel knows | bare kernel-only `const` rejected | 0.6.x strict surface requires `bind` or `(kernel:const ...)` | book chapter needs annotation or explicit kernel escape in language-surface slice |
| `src/part1/chapter2/2-the-kernel.md` | 2 | Kernel / what the kernel knows | bare kernel-only `function` rejected | strict surface requires `func`/`fn` or `(kernel:function ...)` | book chapter needs annotation or explicit kernel escape |
| `src/part1/chapter2/4-the-pipeline.md` | 3 | Pipeline / kernel output example | generated kernel form tested as surface | kernel-output examples are not ordinary surface examples | annotate/skip or use explicit kernel escape in compiler chapter pass |
| `src/part2/chapter4/3-scope.md` | 3 | Scope / closures | JS compiler rejects `func` body ending with `fn` | Rust CLI check/compile accepts the same source and emits a return-checked closure | implementation defect; routed to `D-2609-FNRT` and slice08 |
| `src/part2/chapter7/4-closures.md` | 1 | Closures / pure pattern | JS compiler rejects `func` body ending with `fn` | Rust CLI accepts and compiles | implementation defect; routed to `D-2609-FNRT` and slice08 |
| `src/part2/chapter7/4-closures.md` | 2 | Closures / stateful pattern | JS compiler rejects `func` body ending with `fn` | Rust CLI accepts function-returning closures; current guides teach `fn` as value-producing | implementation defect; routed to `D-2609-FNRT` and slice08 |
| `src/part2/chapter7/7-kernel-underneath.md` | 1 | Function kernel forms | kernel examples use untyped params / kernel syntax in surface gate | book is teaching kernel forms; gate compiles as surface | annotate/escape in language-surface/compiler chapter pass |
| `src/part2/chapter8/4-overlap.md` | 1 | Overlap compile error | expected diagnostic drift | current compiler reports `bad: clauses 1 and 2 overlap -- both match (:number)` | update expected error text in language-surface slice |
| `src/part2/chapter8/4-overlap.md` | 2 | Overlap compile error | expected diagnostic drift | current compiler reports `also-bad: clause 2 (:any) overlaps with clause 1 (:number)` | update expected error text |
| `src/part2/chapter8/6-erlang-heritage.md` | 1 | Erlang / LFE comparison | non-Lykn LFE sample compiled as Lykn | sample is comparative LFE, not Lykn source | retag as `scheme`/text or skip in language-surface slice |
| `src/part3/chapter12/3-keywords-as-keys.md` | 3 | Keywords roles | ellipsis placeholder compiled | current compiler requires real `:body` | make non-runnable prose or complete example |
| `src/part3/chapter12/3-keywords-as-keys.md` | 4 | Keywords roles | ellipsis placeholder compiled | current `match` requires real `(pattern body...)` clauses | make non-runnable prose or complete example |
| `src/part3/chapter14/2-kernel-passthrough.md` | 3 | Kernel passthrough / `let` | bare kernel-only `let` rejected | strict surface requires `bind` or `(kernel:let ...)` | rewrite to explicit escape or annotate compile-fail |
| `src/part3/chapter14/3-library-patterns.md` | 1 | JS library patterns | `express` name collides with Lykn `express` form | current `express` form reads cell values and requires one argument | rename/import pattern or use explicit member/import example |
| `src/part3/chapter15/3-parameter-destructuring.md` | 9 | Kernel functions with destructuring | bare kernel-only `function` rejected | strict surface requires explicit `(kernel:function ...)` for kernel examples | annotate/escape in language-surface slice |
| `src/part3/chapter15/6-edge-cases.md` | 2 | Edge cases / rest position | intentional compile error runs but fails gate | current compiler correctly errors `rest must be the last element` | mark as `compile-fail` with expected text |
| `src/part3/chapter15/6-edge-cases.md` | 3 | Edge cases / typed destructuring | intentional compile error runs but fails gate | current compiler correctly requires type annotations | mark as `compile-fail` with expected text |
| `src/part3/chapter15/6-edge-cases.md` | 4 | Edge cases / nested destructuring | intentional compile error runs but fails gate | current compiler correctly requires `alias` for nested object patterns | mark as `compile-fail` with expected text |
| `src/part4/chapter18/5-copying.md` | 1 | Copying objects | stale `assoc` no-op copy claim | current compiler requires `(assoc obj :key value)` | rewrite copy example; likely use spread/Object.assign |
| `src/part4/chapter20/3-fields-private.md` | 3 | Private member validation | no-else `if` in expression position | current compiler correctly requires else in value position | rewrite as statement-position body or add else |
| `src/part6/chapter29/1-philosophy.md` | 1 | Testing philosophy | unresolved `import-macros "testing"` | current book repo lacks imports/package context for testing macro examples | slice09 toolchain/testing chapter must add runnable context or annotate |
| `src/part6/chapter29/2-writing-tests.md` | 1 | Writing tests | unresolved `testing` macro import | same | slice09 |
| `src/part6/chapter29/2-writing-tests.md` | 2 | Writing tests / minimal form | unresolved `testing` macro import | same | slice09 |
| `src/part6/chapter29/5-test-compiles.md` | 1 | `test-compiles` pattern | unresolved `testing` macro import and stale import shape | current macro package needs project imports or explicit package path | slice09; may add targeted test package setup |
| `src/part7/chapter32/2-reader.md` | 1 | Reader concrete example | expected reader AST drift | current reader returns a concrete List/Atom/String tree, not blank expected output | update assertion/expected output in compiler chapter pass |
| `src/part7/chapter32/3-compiler.md` | 1 | Compiler dispatch `const` | bare kernel-only `const` rejected | strict default applies to JS doctest path | use `(kernel:const ...)`, compile-fail, or kernel-mode fixture |
| `src/part7/chapter32/3-compiler.md` | 2 | Compiler dispatch `function` | bare kernel-only `function` rejected | strict default applies to JS doctest path | use `(kernel:function ...)`, compile-fail, or kernel-mode fixture |


## Failure Classes

| Class | Count | Route |
|---|---:|---|
| JS compiler / Rust CLI parity defect for `func` returning `fn` | 3 | new `D-2609-FNRT`, inserted slice08 |
| Kernel-only examples compiled as ordinary surface examples | 7 | chapter rewrite/annotation after slice08 |
| Intentional compile-error examples missing doctest annotation or updated expected text | 5 | language-surface chapter pass |
| Placeholder/non-Lykn examples compiled as Lykn | 4 | retag, complete, or annotate in chapter pass |
| Toolchain/testing macro context missing | 4 | toolchain/testing chapter pass |
| Stale surface/library examples | 3 | language-surface chapter pass |
| Reader/compiler expected-output drift | 1 | compiler chapter pass |

## Historical May Inventory Reconciliation

| Historical row(s) | Current disposition | Evidence / route |
|---|---|---|
| B0-A, B0-B | closed | slice05 removed old `~/lab/oxur/lykn/` active paths from sibling instructions. |
| B0-C, B0-D, B0-E, B0-F, B0-K | closed | slice05 reconciled authorship guidance: moving ground truth, JS compiler role, lykn wrappers, and `lisp` fence rule. |
| B0-G, `D-2607-R4NW` | closed / route implemented | slice06 landed repeatable `--fence`; current counts reproduced here. Targeted book tests remain optional future coverage, not the current universal gate. |
| B0-H | closed | book repo has tracked `AGENTS.md`; `CLAUDE.md` remains symlink. |
| B0-I, B0-J | routed | `planned-toc.md` is now explicitly historical v2 input; current ToC reconciliation belongs with book-facing chapter slices, chiefly slice09/slice10 after slice08. |
| B0-L | no-op | voice rubric still current. |
| B0-M | closed | durable close artifacts live in tracked planning slice directories; book `workbench/` remains scratch. |
| B1-A through B1-F, B1-P through B1-R | still-open / slice09 | Biome/ESLint/toolchain/project-structure chapter drift remains book content work; no normal chapter rewrite done in this recon. |
| B1-G through B1-I | still-open / slice10 | ESLint references need chapter-context audit; historical ESTree reference may no-op. |
| B1-J, B1-L | no-op | direct Deno examples are descriptive in those contexts. |
| B1-K, B1-M, B1-N, B1-O | still-open / slice09 | direct-Deno/task examples need current lykn-wrapper framing in toolchain/testing chapters. |
| B2-A through B2-E, B2-H, B2-N | still-open / slice09 | build/dist/publish/add/lint toolchain folds belong in toolchain chapter pass. |
| B2-F, B2-G, B2-I | still-open / slice10 | type declarations, imports, and macro authoring belong in language-surface chapter pass after slice08. |
| B2-J through B2-M, B2-O, B2-P | still-open / slice10 | compiler architecture, position-aware compilation, compileBoth, and linter cross-reference work remain language/compiler chapter work. |
| B3-A through B3-C | still-open / slice10 | identifier mapping/function naming work remains language-surface chapter work. |
| B3-D through B3-F | still-open / slice10 | DD-50 `?`/`if`/`do` position-aware chapter work remains open. |
| B3-G, B3-J | no-op | May inventory already marked no drift; no current fence failure changes that. |
| B3-H, B3-I, B3-Q, B3-R | still-open / slice09 or slice10 | dependency management and safety-gate material split between toolchain and language-surface passes. |
| B3-K through B3-P | still-open / slice10 | type keywords, destructuring, classes, generators, and equality require normal chapter rewrite/audit. |


## Stale Active Path Sweep

Command family: targeted `rg` over planning `AGENTS.md`, planning `README.md`, project02, planning `status/`, planning `backlog/`, book `AGENTS.md`, writers-guide `AGENTS.md`, `authoring-guide.md`, and `planned-toc.md` for old `docs/design-v0.6.0` and `docs/backlog` references.

Findings:

- Active sibling instructions still pointed at `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/design-v0.6.0/arc16-book-0.6.0-edition/` and `/Users/oubiwann/lab/lykn/lang/.worktrees/0.6.x/docs/backlog/discoveries.md`.
- This slice fixed book `AGENTS.md`, writers-guide `AGENTS.md`, and writers-guide `authoring-guide.md` to point at `/Users/oubiwann/lab/lykn/lang/.worktrees/planning/project02-language-toolchain-alignment/arc16-book-0.6.0-edition/` and `backlog/discoveries.md`.
- Remaining old `docs/design-v0.6.0` hits under project02 are historical prompts, close reports, or migration evidence. They are not active standing instructions and should not be rewritten in this recon.

## Recommended Next Slice Order

1. `slice08-js-fn-return-parity`: fix or explicitly dispose the JS compiler / Rust CLI mismatch where `func` with `:returns :function` ends in `fn`. This must run before chapter work rewrites the affected closure examples.
2. `slice09-toolchain-and-project-structure-chapters`: update testing/toolchain/project-structure chapters, including the four current `testing` macro failures, Biome/ESLint drift, raw Deno workflow framing, build/dist/publish paths, and safety-gate prose.
3. `slice10-language-surface-chapters`: update the language/compiler chapters, including kernel-only examples, DD-49/DD-50/DD-51 folds, destructuring/classes/generators/equality, and expected diagnostic/output drift.
4. `slice11-edition-close-and-release-gate`: final whole-book build, fence gates, link/path sweep, voice review, version metadata, and arc close.

Normal chapter rewrites remain blocked until slice08 is closed or explicitly deferred.
