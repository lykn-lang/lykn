# Correction07 CC intake and readback

## Worktree and ownership

- Source: `/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering`, branch `codex/async-expression-values`, starting HEAD `3f8f6dfe6177db7233932dc6c8938993655a1cae`, initially clean.
- Planning: `/Users/oubiwann/lab/lykn/lang/.worktrees/planning`, branch `planning`, current HEAD `57d492baef4c9a713014b861bb1c0c3604170026`, initially clean. Prompt header's `692b5d8` is its pre-approval baseline; CDC confirmed current HEAD records approval/prompt.
- Source ownership is only `crates/lykn-lang/src/emitter/forms.rs`; planning ownership is only this new `artifacts/repair/correction07/**` evidence. Tests, fixtures, oracles, JS, mirror, prompt/plan/ledger prose are read-only.
- The pre-edit whole-source body is retained as `raw/pre-edit/forms.rs`, SHA256 `389b1444a2b471a83b9e41684d47d9e50d6ef143b5669094aa032d88345bf133`. Candidate body 001 is retained as `raw/pre-edit/forms.rs.candidate-001`, SHA256 `d173501044d457357c1cc4b1799ff1f98b0969eaf14839ce9f376d9a0af56395`.

## Required reading coverage

Read fully: source and planning `AGENTS.md`; `cc-prompt-iteration06.md`; `slice-plan.md`, `ledger.md`, current `cdc-verification.md`; Rust and Lykn skill entrypoints; JavaScript/Deno skill entrypoint; collaboration-framework, project-management, work-verification, and testing skill entrypoints. Read the complete bounded source sections named in the prompt: `emit_expr`, `emit_in_context`, `emit_body`, `emit_function_body`, `kernel_child_profile`, the unchanged grouped-bind unit, codegen `emit_switch`, exact DD-50 test excerpts, `compileBoth`, five fixture files and public async-expression harness, and guide00 if/switch excerpts. Reviewed the full current correction06 switch verdict and exact two-case replay commands/output; inspected existing correction06 retained raw full-Make failure names and generated mismatch output. Required existing generated test file is `target/lykn/test/test/forms/dd-50_test.js`.

## Contract readback

The direct path is the generic non-form-head recursion reached by a numeric-headed switch clause. Although the outer kernel switch profile assigns the clause a Statement context, the clause is mistaken for a computed call and its children are forced to Value, so no-else `if` is rejected as expression-position misuse. The code generator's writer defines the structural clause roles: discriminant and non-default first clause element are values; remaining clause elements are statements; raw `default` is a marker. Implement only a `Some("switch")`-guarded traversal in `forms.rs`, preserving list shape, original switch/clause spans, ordering, empty/non-list behavior, and marker clone/tags. Keep resolved-bound/computed call value handling and grouped-bind repair intact. No new tests, matrix, helper/oracle changes, parser work, or eighth correction.

## Applied guidance

Preserve immutable AST inputs and name-resolution metadata; use `emit_in_context` to scope and restore context; retain necessary AST reconstruction and avoid duplicate classifiers. Focused existing tests establish the specific regression; the full normal repository gate remains required, and filtered success alone is not acceptance. Raw attempts will have unique paths created before invocation, exact absolute task cwd/argv/env/exits, tool pins, and preserved streams. No Python or substitute scripting-language research logic is permitted.
