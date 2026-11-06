# Lykn repository guidance

This file gives project-specific guidance to coding agents working in Lykn.
Keep it byte-identical across main, release branches, planning, and active task
worktrees. It applies across the repository and its existing worktrees. Follow
the active assignment and the user’s instructions; this guidance does not create
authority to expand scope, bypass a gate, or take an external action.

## Lykn and its architecture

Lykn is a source-first language with typed functions, contracts, algebraic data
types, pattern matching, and macros. Surface Lykn is the language taught and
authored by users; the JavaScript-like kernel is an intermediate representation
for compiler work. Compiled JavaScript is an implementation detail for ordinary
Lykn users.

The Rust workspace has three crates: `lykn-lang` implements the native language
pipeline, `lykn-cli` provides the CLI and orchestration, and `lykn` is the
umbrella crate. The existing JavaScript compiler and browser path remain part
of the repository. Lykn output has no mandatory Lykn runtime library; this does
not mean the compiler has no dependencies. Existing Deno/npm-resolved compiler
inputs are facts about the current toolchain, not permission to add research
dependencies or turn the project into a Node.js application.

For Lykn surface conventions, use the repository-owned reference
`skills/lykn/SKILL.md` and corpus under `docs/guides/`. Their full source is in
the assigned source worktree/branch. From the planning worktree, name that
worktree and branch explicitly when citing or consulting source guidance;
planning is not a second source tree. `docs/philosophy.md` in that source home
is the authority for Lykn's source-only user workflow, Lykn CLI surface, and
compiler-owned generated output quality.

## Repository homes and branch ownership

Inspect the live worktree list, current branch, status and local changes before
writing. Use the existing worktree for the assigned task; do not fall back to
another checkout when it is missing.

| Work | Home |
| --- | --- |
| Project, arc and slice plans; ledgers; prompts; reviews; design records; research evidence | Branch `planning`, worktree `.worktrees/planning` |
| Source and user/developer docs for 0.6.x | Branch `release/0.6.x`, worktree `.worktrees/0.6.x` |
| Source and user/developer docs for 0.7.x | Branch `release/0.7.x`, worktree `.worktrees/0.7.x` |
| Source and user/developer docs for 0.8.x | Branch `release/0.8.x`, worktree `.worktrees/0.8.x` |
| Product task authoring | Its named dedicated non-default task branch and worktree |
| `main` | Integration only, except an explicitly authorized synchronized governance/docs change |

Planning was created as an orphan and connected to original source history by
selective ancestry imports to preserve Git history. Its tree contains planning,
not implementation. **Never merge planning into source.** Normal source
propagation follows 0.6.x → 0.7.x → 0.8.x. Before any propagation, inspect
branch divergence and local changes, retain them, and get explicit integration
authority. A release target in a project name or plan is intent, not approval
to ship.

An explicitly authorized governance and documentation synchronization may span
the existing branches, including `main`; this is a scoped exception, not
authority for product implementation on main or release branches. Do not merge,
rebase, cherry-pick, push, publish, release, or trigger remote CI without the
specific authority required for that action.

## Planning, citations and project history

Start at the [planning index](https://github.com/lykn-lang/lykn/blob/planning/README.md).
Keep all planning material out of source `docs/`. Use `project-plan.md`,
`arc-plan.md`,
`slice-plan.md`, and a `ledger.md` at each scale. Preserve issued
`cc-prompt.md` and numbered iteration prompts. Keep durable slice evidence in
the owning `artifacts/` directory unless its plan records a different home.
Historical prompts, findings, decisions, failures, and source contexts are
provenance; do not silently rewrite them or infer acceptance from a filename.

Project identity is distinct from release intent. Plans record project status,
planned release, dependencies and relationships; an unassigned release stays
explicitly unassigned. Approximate historical groupings and existing migrated
ledgers retain their recorded provenance; do not invent slices to make an old
plan look regular.

Cross-project discoveries belong in the planning `backlog/`; candidates stay
with their project until a destination exists in Git and contains the finding.
Design decisions live in the
owning project's or arc's artifacts. The separate book repository remains the
book home. Existing mixed-era workbench/archive records stay intact; their
location does not prove completion or release provenance.

Source citations must resolve on their own branch, except an explicit
branch-qualified planning URL or immutable historical commit. Planning links
are relative within planning. When planning work cites source, identify the
assigned source worktree/branch and relevant commit; an uncommitted sibling
checkout is not evidence. `make check-cited-paths` resolves links from committed
HEAD. The frozen historical citation census is not an allowlist to expand to
hide a new citation error.

## Language and domain guidance

Resolve named skills through the current session's installed skill catalog. If
a required skill is missing, disclose that and resolve a supported substitute;
do not point to personal absolute paths, recreate host paths, create replacement
external symlinks, or claim automatic installation/discovery.

- Rust work: load `rust-guidelines`.
- JavaScript or Deno work: load `javascript-deno-guidelines`.
- Tests, coverage, validation gates or failure triage: load `testing`.
- Sustained planning, evidence, delegation, ledgered work or audits: load
  `collaboration-framework` and the relevant routed component, such as
  `work-verification`, `agent-coordination` or `code-auditing`.
- Lykn work: consult `skills/lykn/SKILL.md` and the relevant source guide.

Research tooling should prefer Lykn. Keep compiled output and other generated
files in ignored `target/` paths. Preserve the ADT, guide/book and explicit
human acceptance obligations in their owning plans. The approved future
`lib/`, opt-in JSR, selective-entrypoint, effect and public-API direction is not
an implemented standard library or approval to license, publish or release it.

## Commands and validation

Normal Lykn users run `lykn <command>` for project operations. Contributors
working on Lykn itself may use the repository's Cargo, Deno and Make commands.
Do not present contributor tooling as the normal Lykn user workflow.

- `lykn compile` compiles source; `lykn build` builds workspace outputs under
  `target/lykn/build/`; `lykn dist` stages packages under `target/lykn/dist/`.
  `lykn build --dist` and `lykn build --npm` are deprecated aliases; use
  `lykn dist` for staging.
- `lykn test` is the user-facing test wrapper. Repository contributor checks
  are `make test-suite` for the full JS plus Lykn corpus and `make test-docs`
  for documentation examples. `make check` already includes the documentation
  tests; do not chain `make check && make test-docs` and run them twice.
- When explicitly running the repository's raw Deno test suite, use its
  `project.json` import map and scope it to `test/` (the documented direct
  command is `deno test --config project.json -A test/`). Fixtures are rooted
  at `Deno.cwd()` and imports use configured bare specifiers, so tests remain
  location-independent when Lykn compiles them under `target/`. A Lykn wrapper
  must not silently add Deno permission grants the user did not request.
- `make help` lists current targets. `make check-cited-paths` is the committed
  source-document citation gate; it is not the full implementation test suite.
  For implementation work, `make check` is the canonical combined build,
  lint and test bar. Use a focused target for focused iteration, then run the
  required full gate before claiming implementation validation.

The JavaScript reader and Rust reader are parallel implementations of the same
S-expression grammar. Reflect grammar changes in both readers unless an approved
design explicitly records a divergence.

Review generated snapshots manually; never auto-accept them. Preserve command
exits, warnings, failures, unrun checks and actual denominators. Syntax checks
or source presence alone do not prove generated package contents or runtime
behavior. Report what each check does and does not establish.

## Git, safety and external actions

Inspect and stage only the paths authorized for the task. Preserve unrelated
working-tree changes and existing evidence. Use explicit path lists with
`git commit --only`; do not blanket-stage. Assistant-authored commits include
both contiguous trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

Never silently inject `--allow-dirty`, `--force`, `--no-verify`, `--unsafe`,
`--skip-checks`, broader Deno permissions, or another safety-bypass option into
a wrapped tool. Satisfy the underlying gate or surface it to the user; do not
weaken a gate to make a command appear successful. The user retains authority
for publication, pushing and release actions.

`CLAUDE.md` is maintained as a relative compatibility symlink to `AGENTS.md`.
The old device-bridge Git restriction applies only when using that bridge: do
not work around its unavailable worktree gitdir or manipulate its index. Native
local Codex Git access is distinct from the bridge.
