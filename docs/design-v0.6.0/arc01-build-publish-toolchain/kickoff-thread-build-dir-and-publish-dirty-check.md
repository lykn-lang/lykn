# Kickoff — Build-Dir Reorg + Publish Dirty-Check Thread (lykn, M11 + M13)

## Read this first

This is a fresh CDC session for the lykn project. The prompt below
bootstraps you with context from the previous session. Workbench
artifacts persist across sessions.

You are **CDC (Cowork Claude)** in Duncan's collaboration framework:

- **CDC (this session):** planning, drafting ledgers, reviewing CC's
  work, writing prompts for CC.
- **CC (Claude Code, separate sessions on Duncan's machine):**
  implementation.
- **Duncan:** methodology owner, design calls, manual publishes.

Framework: CDC scopes → CC implements → CDC reviews → iterate →
closing report. Prompts to CC use MUST framing.

## Project: lykn

Lisp-flavored JavaScript compiled to clean JS. Repo at
`/Users/oubiwann/lab/lykn/lang`. JS compiler (`packages/lang/`) +
Rust CLI tools (`crates/`). Targets Deno; uses `project.json` for
workspace imports.

## Substrate: git operations against this worktree happen on the host

CDC sessions for this thread run inside Cowork. CDC inside Cowork
**must not** invoke `git` from inside the worktree — read OR write.
That includes `git status`, `git log`, `git diff`, `git merge`,
`git reset`, `git rebase`, `git commit`, `git worktree add/remove`,
and anything else.

Reason: a worktree's `.git` file encodes a single absolute path to
its metadata. Cowork sees the lykn repo as
`/sessions/<session>/mnt/lang/`; the host sees it as
`/Users/oubiwann/lab/lykn/lang/`. The worktree can be encoded for one
or the other, not both. Worktrees are created from the host (correct
encoding for CC and Duncan), so Cowork-side `git` invoked inside the
worktree fails with `fatal: not a git repository:
/Users/oubiwann/lab/lykn/lang/.git/worktrees/<name>`.

CDC's Cowork-side work is read-only-from-files:

- **Read files** via the Read tool, `ls`, `cat`, `grep`. These don't
  invoke git, so the path-encoding issue doesn't apply.
- **Write files** via Write/Edit tools. Cowork's permission layer
  handles these; no git involvement.
- **Run git read-only ops from the main checkout**
  (`/sessions/<session>/mnt/lang/`, no `.worktrees/...` subdir). The
  main checkout's `.git/` is a directory (not a gitlink file), so its
  metadata resolves correctly from Cowork. Branch state across all
  worktrees is fully visible:
  `cd /sessions/.../mnt/lang/ && git log <branchname>`.

CC and Duncan handle all git operations against the worktree from the
host: commits, merges, rebases, resets, worktree create/remove.

Origin: this rule was crystallized 2026-05-11. The four CDC
worktrees (cdc-build-dir-reorg, cdc-dep-ergonomics, compiler-coherence,
m12-linter) were initially created from inside Cowork sessions, which
encoded sandbox paths in their git metadata and broke host-side `git`.
After recreating from host, the encoding flipped: host works, Cowork
can no longer invoke git inside the worktree. That's the correct
trade-off — Cowork's substantive needs are file reads and
Cowork-mediated writes, neither of which require git inside the
worktree. Future CDC sessions on any of these threads should encode
this rule once and not try to invoke git inside the worktree.

---

## Methodology framework — read in this order

1. `assets/ai/LEDGER_DISCIPLINE.md` — milestone protocol.
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md` — delegation rules.
3. `AGENTS.md` — **especially the "Lykn CLI safety gates"
   section.** This thread's M13 work IS the rule materialization;
   M11 must not weaken safety gates either.
4. `docs/philosophy.md` — foundational principles. The 0.6.0
   commitments section lists what M11 and M13 must deliver.
5. workbench/phase-2-plan.md — Phase 2 milestone list; M11 and M13
   entries are there.

## Current state of the project (as of 2026-05-10)

- Phase 1 closed 2026-04-29 (0.5.1 shipped).
- Phase 2 closed: M5, M6, M7 (incl. DD-49/50/51 + DD-50.5 +
  addendum + iters), M9, M9-release.
- Active: DD-50.6.
- Open: M10, **M11**, M12, **M13**, M14, M15, M4.
- This thread covers M11 + M13.

## This thread's scope: M11 (build-dir reorg) + M13 (publish dirty-check)

Both are 0.6.0 commitments from the philosophy doc. They're
operational/tooling concerns — no compiler internals, no language
design. Each is small individually; bundled here because they share
the "lykn CLI tooling" surface area.

### M11 — Build-dir reorganization

**Phase 2 plan entry:** "Build-dir reorganization to
`target/lykn/build/` and `target/lykn/dist/`. 2-3 iterations
estimated."

**Background:** Currently lykn build outputs scatter across the
repo. The philosophy doc commits 0.6.0 to a clean structure:

- `target/lykn/build/` — intermediate build artifacts (compiled JS
  per source file, etc.).
- `target/lykn/dist/` — staged publishable packages (the contents of
  what `lykn publish --jsr` / `lykn publish --npm` actually ships).

The `target/` directory is Rust's cargo build directory; lykn's
build artifacts go under a `lykn/` subdirectory to coexist cleanly
with cargo's `release/` etc.

**Scope questions to settle (DD-style design pass):**

- What exact subdirectory layout under `target/lykn/`? Per-package
  subdirs? Flat?
- How does `lykn build` (no `--dist`) differ from `lykn build --dist`
  in output location?
- What about user override (e.g., `lykn build --out path/to/dir`)?
- What gets gitignored? (Currently `target/` is in .gitignore via
  Rust convention; `target/lykn/` inherits that.)
- Migration path for existing projects — does this break anything?
- Are there published artifacts on JSR/npm currently that reference
  the OLD layout and would break after the change?

**Implementation surface:**

- `crates/lykn-cli/` — the `lykn build` and `lykn build --dist`
  commands.
- `packages/lang/` — possibly the JS-side build helpers if any.
- `Makefile` — currently has `make build` etc.; needs to align.

### M13 — `lykn publish` uncommitted-changes check

**Phase 2 plan entry:** "`lykn publish` uncommitted-changes check +
`--allow-dirty` override (0.6.0 commitment). 1 iteration."

**Background:** Today `lykn publish` doesn't gate on git state. A
user with uncommitted changes can `lykn publish` and ship artifacts
that don't match any committed snapshot. The philosophy doc commits
to a hard gate in 0.6.0:

- Default: refuse to publish if working tree has uncommitted changes
  or untracked files affecting the publish surface.
- Override: `--allow-dirty` opt-in flag for users who explicitly
  accept the risk.

**Critical reference:** `AGENTS.md` "Lykn CLI safety gates"
section. The rule there says lykn CLI must NOT auto-pass
`--allow-dirty` to underlying tools (deno publish, cargo publish,
etc.). M13 implements the *lykn-level* gate consistent with that
rule:

- Lykn CLI checks git state.
- If dirty + no `--allow-dirty`: refuse, exit non-zero, clear error.
- If dirty + `--allow-dirty`: proceed (no auto-injection to
  underlying tools — they have their own gates that the user can
  control independently).
- If clean: proceed normally.

**Scope questions:**

- What counts as "dirty"? Tracked-but-modified files definitely. What
  about untracked files? Per the Rust precedent: untracked files
  also block (because they could affect publish).
- What about files outside the publish surface? E.g., uncommitted
  changes to `docs/`. Should those block a `lykn publish`? Probably
  yes for simplicity (matches `cargo publish --allow-dirty`
  semantics).
- Submodule state?
- What's the error message format? See past lykn CLI error messages
  for the project's wording conventions.

**Implementation surface:** `crates/lykn-cli/` — the `publish`
command implementation.

### Why M11 + M13 are bundled in this thread

- Both 0.6.0 commitments from philosophy doc.
- Both `lykn-cli/` Rust changes.
- Both small individually (1-3 iterations each); bundling lets one
  CC session cover both.
- Neither touches the language or compiler.

That said: they can be split into separate milestones if scope
expands during DD-style planning. Discuss with Duncan.

## Suggested opening moves

1. **Read the philosophy doc's 0.6.0 commitments** for the exact
   contract.
2. **Read the existing `lykn-cli/` source** to understand the current
   shape of `lykn build` and `lykn publish` commands.
3. **Audit current build-output paths.** Run `make build` / `lykn
   build --dist` and trace where artifacts land.
4. **Draft a coordinating ledger (M11+M13)** or two separate ledgers,
   depending on preferred granularity.
5. **Discuss with Duncan** before committing to bundle vs. split.

## Constraints and conventions

- **`CLAUDE.md` "Lykn CLI safety gates" is load-bearing.** M13 is
  literally implementing the rule's underlying gate. M11 must not
  weaken any related gates either.
- **MUST framing for CC prompts.**
- **Closing report pattern** — see
  workbench/2026-05-10-M7-closing-report.md for shape.
- **Snapshot testing (insta) considerations:** lykn-cli uses `insta`
  for golden-file snapshot tests at
  `crates/lykn-cli/src/snapshots/`. M11's build-dir changes likely
  affect these snapshots. **Never auto-accept snapshots** — review
  each change to verify intent (per CLAUDE.md "Snapshot testing"
  section).
- **Workbench is gitignored.**

## Key methodology learnings

- Iteration discipline holds when prompts use precise MUST framing.
- CC's self-stop pattern (refusing shortcuts) is methodology-correct.
- Closing reports include substrate-rule compliance section
  confirming no safety-bypass flags were auto-passed and no Verify
  commands were silently rewritten.

## How to start

1. Read philosophy doc's 0.6.0 commitments.
2. Read existing `lykn-cli/` build + publish command code.
3. Decide bundle vs. split with Duncan.
4. Draft the ledger(s).
5. Send to CC for implementation.

This thread is small relative to the architecture thread or
linter thread. Plausibly completes in one CC session per milestone
with quick CDC turnaround.

Good luck.
