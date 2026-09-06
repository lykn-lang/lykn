# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is lykn?

lykn is a lightweight Lisp that compiles S-expressions to clean, readable JavaScript. It has two implementations sharing a common syntax:

- **JS compiler** (`packages/lang/`) — reads `.lykn` source, emits ESTree AST, generates JS via astring
- **Rust CLI tools** (`crates/`) — compiler, formatter, syntax checker, and Deno wrapper — single binary

Zero runtime dependencies in compiled output.

## Branch and worktree ownership

Confirmed by the operator 2026-09-06 during the planning reorganization.
Inspect `git worktree list` and the target status before writing. Use the
existing worktree; do not fall back to main when it is missing.

| Work | Home |
| --- | --- |
| Project, arc, slice plans; ledgers; prompts; reviews; design records; research evidence | Branch `planning`, worktree `.worktrees/planning` |
| Source and user/developer docs for 0.6.x | Branch `release/0.6.x`, worktree `.worktrees/0.6.x` |
| Source and user/developer docs for 0.7.x | Branch `release/0.7.x`, worktree `.worktrees/0.7.x` |
| Source and user/developer docs for 0.8.x | Branch `release/0.8.x`, worktree `.worktrees/0.8.x` |
| main | Integration by rebase/merge; no authored work except synchronized AGENTS.md governance |

`docs/` is for user-facing and developer-facing documentation. Planning is
never created there. The ECMAScript 2025 reference corpus and Lykn guides
remain in `docs/ecmascript-2025/` and `docs/guides/` on source branches.

The planning worktree was initialized as an orphan. A deliberate migration
exception connects original source commits through selective ancestry imports
to preserve exact Git history. Its current tree contains planning only.
**Never merge planning into source.** Propagate source changes through the
release chain 0.6.x → 0.7.x → 0.8.x. Preserve local edits and inspect divergence
before rebasing. Do not push rewritten branches without operator authorization.

## Planning and project management

Start at the [planning index](https://github.com/lykn-lang/lykn/blob/planning/README.md).
Canonical homes under the planning root:

| Project | Purpose | Original planned release |
| --- | --- | --- |
| project01-mvp | Retrospective early language/compiler/tooling history | 0.5.0 |
| project02-language-toolchain-alignment | Structural compiler and toolchain alignment | 0.6.0 |
| project03-language-evolution | Post-alignment research and candidates | 0.7.0 |
| project04-c-lang | C target research | 0.8.0 |
| project05-hardware | Hardware research and bench contracts | 0.8.0 |
| project06-planning-reorg | This history-preserving migration | none assigned |

Project names do not encode release commitments. Each project-plan.md begins
with YAML containing `project`, `status`, `planned-release`, `depends-on`,
`blocks`, and `related`. An unassigned target is explicit null. A planned
release is intent, not a claim that all candidates are approved to ship.

Use project-plan.md / arc-plan.md / slice-plan.md, with a dedicated ledger.md
at each scale. Slice prompts are cc-prompt.md; close reports and independent
verification are recorded when performed. Durable slice-produced artifacts
default to the owning slice's artifacts directory. This is the confirmed
collaboration-framework layout; do not reopen layout confirmation for these
projects. Read the installed framework's project-management guides/README.md
before opening or closing a unit.

Historical exceptions are documented in project06's migration records:
project01 uses approximate arcs without fabricated slices; three project02
standalone slices have decimal arc wrappers at the operator's request; older
embedded ledgers and historical acceptance claims retain their provenance.
The three project03 research units retain collapsed standalone slices.

## Discovery, design, and citation homes

- The permanent-ID Discovery Register and owed-row queues live in root
  `backlog/` on planning, independently of any one project's release.
- Project-specific candidate lists stay with their project. A discovery is
  not routed until its destination exists in Git and contains the finding.
- DDs live in the owning project or arc's artifacts/design directory; original
  names, ODM state metadata, and historical versions remain evidence. The
  old single-tree ODM configuration is archived in project06; do not use it
  to recreate planning under source docs.
- Scratch stays in ignored workbench. The existing mixed-era workbench/old
  archive is inventoried by project06 and remains intact; no historical
  completion is inferred from that archive's name.
- The Book content still lives in the separate book repository. Its owning
  plan remains project02's arc16-book-0.6.0-edition on planning.

Source-document citations must resolve on their own source branch, except
explicit branch-qualified planning links or immutable historical commit links.
Planning links use relative paths within planning; source references name
their source branch/commit. Migrated historical root-relative command snippets
retain the source context in project06's manifest. A cross-branch reference
must be explicit; an uncommitted sibling is never sufficient evidence.

`make check-cited-paths` remains the source-document gate and resolves at HEAD.
Project06's migration verifier additionally checks moved-path coverage, blobs,
ancestry, retained source docs, metadata, and planning navigation. The frozen
historical citation census is not an allowlist to expand for migration errors.

## Governance and Git mechanics

AGENTS.md is kept byte-identical on main, the three release branches, and
planning. CLAUDE.md remains a compatibility symlink to AGENTS.md.
Assistant-authored commits include both trailers:

```text
Co-authored-by: Codex <noreply@openai.com>
Co-authored-by: Billo AI <ai-engineering@billo.systems>
```

The old Cowork device bridge restriction still applies when using that bridge:
its worktree gitdir mount is intentionally unavailable; do not work around it
or manipulate its index. Use ordinary file writes in the correct worktree and
read-only git show from the primary mount. A native local Codex session with
working Git access is not that bridge.

## Writing Code

### JavaScript

This project does not use Node.js.

**For JavaScript Code Quality:**

1. **`assets/ai/js/SKILL.md`** - Advanced JavaScript programming skill (**use this**)
2. **`assets/ai/js/guides/*`** - Comprehensive JavaScript guidelines referenced by the skill

**Important:** Note that `assets/ai/js` may be a synlink; check to be sure, before assuming there's no directory if a directory check failes. If a symlink check fails and you have confirmed that `assets/ai/js` does not exist on the file system, ask the user for help.

### Rust

**For Rust Code Quality:**

1. **`assets/ai/rust/SKILL.md`** - Advanced Rust programming skill (**use this**)
2. **`assets/ai/rust/guides/*`** - Comprehensive Rust guidelines referenced by the skill
3. **`assets/ai/CLAUDE-CODE-COVERAGE.md`** - Comprehensive test coverage guide
4. **This file (AGENTS.md)** - Project-specific conventions only

**Important:** Note that `assets/ai/rust` may be a synlink; check to be sure, before assuming there's no directory if a directory check failes. If a symlink check fails and you have confirmed that `assets/ai/rust` does not exist on the file system, ask the user for help.

### Lykn

**For Lykn Code Quality:**

1. **`assets/ai/SKILL.md`** - Advanced Lykn programming skill (**use this**)
2. **`docs/guides/*`** - Comprehensive Lykn guidelines referenced by the skill

## Build commands

### Project setup

```sh
lykn new my-project            # create new project
```

### Rust (Cargo workspace at project root)

```sh
cargo build --release        # build all crates
cargo clippy                 # lint
cargo fmt                    # format
cargo test                   # test
cargo publish --dry-run      # verify crates.io packaging
```

### JavaScript (Deno)

```sh
deno lint packages/          # lint JS
deno test --config project.json -A test/  # test JS (canonical — scope to test/)
deno publish                 # publish to jsr.io
```

Always scope `deno test` to `test/` and pass `-A`. Unscoped `deno test --config
project.json` is **not supported** — it also walks `target/` (compiled
`*_test.js`), which double-runs the corpus and fails on permissions. Test
authoring conventions (bare import-map specifiers; `Deno.cwd()`-anchored
fixtures, never `import.meta.dirname`) are in `test/CONVENTIONS.md`.

### Snapshot testing (insta)

Publishing pipeline tests use `insta` for golden-file snapshot testing.
Snapshot files live under `crates/lykn-cli/src/snapshots/` and are
committed. When generated output changes, tests fail with a diff.

```sh
cargo insta test                # run tests, show pending snapshots
cargo insta review              # interactive review of snapshot changes
cargo insta test --review       # run tests then review
```

Never auto-accept snapshots — review each change to verify it is
intentional. See DD-35 (`workbench/dd-35-testing-strategy-publishing-pipeline.md`)
for the full testing strategy.

## Lykn CLI safety gates

The Lykn CLI wraps underlying tools (deno, cargo, npm, git). Wrapping
must not weaken those tools' safety guarantees. Specifically:

**Never auto-pass safety-bypass flags to underlying tools.** The
Lykn CLI must NOT silently inject `--allow-dirty`, `--force`,
`--no-verify`, `--unsafe`, `--skip-checks`, or any equivalent
skip-gate flag when invoking deno, cargo, npm, or git. Safety gates
from underlying tools are part of the user's expected experience; the
Lykn CLI does not own the authority to bypass them on the user's
behalf.

**When an underlying gate fires, the resolution is to satisfy the
gate's condition.** If `cargo publish` rejects a dirty working tree,
the answer is `git commit` or `git stash`, not auto-passing
`--allow-dirty`. If `deno publish` rejects untracked files, the
answer is to track or remove them, not to add a wrapper flag that
silently includes `--allow-dirty`. The user retains the choice; the
Lykn CLI surfaces the gate honestly.

**If a gate's default behaviour is genuinely wrong for the project's
use case, that is a methodology question, not a wrapper patch.**
Raise it as a design discussion in the philosophy doc or as a DD,
not as a quiet behavioural change in the CLI. The 0.6.0 direction
(per `docs/philosophy.md` §Decided design questions #4) is to *more
strongly* enforce the uncommitted-changes check, not less — adding
an opt-in `--allow-dirty` flag at the lykn level for users who
explicitly accept the risk, with the default being a hard fail.

**Examples of operations this rule covers:**

- `lykn publish` (any subcommand) must not auto-pass `--allow-dirty`
  to deno/cargo/npm.
- `lykn publish` must not auto-pass `--no-verify` (which would skip
  signing / signature checks).
- `lykn run` / `lykn test` must not auto-pass deno permission flags
  (`--allow-all`, `--allow-net`, etc.) the user didn't request.
- `lykn build --dist` must not silently overwrite tracked files in
  ways the user can't undo with `git checkout`.
- Any future Lykn CLI subcommand wrapping a tool with safety gates
  must respect them by default.

Origin: this rule was crystallized after a M3.5 incident where the
Lykn CLI was patched to auto-pass `--allow-dirty` to `deno publish`
during dry-runs (commit `64bb301`, subsequently reverted). The
reasoning at the time ("dry-runs are verification, not publication —
untracked files should not block publishability checks") was
rhetorically clean but operationally wrong: dry-runs against an
uncommitted tree don't tell the user what would actually publish, so
weakening the gate defeats the purpose.

See also: `docs/philosophy.md` Principle 2 (Lykn-only tooling); the
"Snapshot testing (insta)" rule above; LEDGER_DISCIPLINE.md (the
discipline of not silently rewriting safety-relevant defaults).

### Makefile

`make help` lists all targets. Key ones: `make build`, `make build-release`, `make test`, `make lint`, `make format`, `make check` (build+lint+test), `make push` (pushes to all remotes).

**`make check` is the canonical verification bar** — it already runs the doc
tests (`test-docs`), so do **not** chain `make check && make test-docs` (that
re-runs the whole doc phase). Use `make test-docs` on its own only for
doc-focused iteration; it now tests docs only (no corpus), so it's ~seconds.
`make test-suite` runs the full non-doc suite (`*.test.js` + the `.lykn`
corpus); `make test-lykn` is a surface-focused dev subset (not part of
`check`).

## Architecture

### JS compiler pipeline (`packages/lang/`)

`reader.js` → parse source into S-expression AST (`{type: 'atom'|'string'|'number'|'list', value}`) → `compiler.js` → transform to ESTree nodes via built-in macros → `astring.generate()` → JS output.

`mod.js` re-exports `read`, `compile`, `compileExpr` and provides a convenience `lykn(source)` function.

The `astring` dependency is mapped via import map in `project.json` (`"astring"` → `"npm:astring@^1.9.0"`) so the source uses bare imports while Deno resolves through npm without node_modules.

### Rust workspace (`crates/`)

- **`lykn-cli`** — binary (`lykn`) + library. Contains `reader.rs` (S-expression parser, `SExpr` enum) and `formatter.rs` (pretty-printer, 80-char line width). CLI commands: `fmt`, `check`.
- **`lykn`** — umbrella library crate, re-exports `lykn_cli::reader` and `lykn_cli::formatter`.

Both crates use Rust edition 2024.

### Shared pattern

The JS reader and Rust reader are parallel implementations of the same S-expression grammar. Changes to the grammar should be reflected in both.

## Publishing

All JS packages publish from `dist/` (never directly from source). `lykn build --dist` stages each workspace member into `dist/<name>/` with generated `deno.json` and `package.json`. Three package kinds: `runtime` (compile .lykn → .js), `macro-module` (copy .lykn + .js, generate stub), `tooling` (copy .js).

```sh
lykn build --dist              # stage all packages into dist/
lykn publish --jsr             # publish to JSR from dist/
lykn publish --npm             # publish to npm from dist/
lykn publish --jsr --dry-run   # verify without publishing
make publish                   # publishes to JSR, npm, and crates.io
```

- **crates.io**: `make publish-crates` (publishes in dependency order with rate-limit delays) or `make publish-one CRATE=lykn-cli`

## Git remotes

The project pushes to multiple remotes (macpro, github, codeberg). `make push` handles all three. `make remotes` configures them.
