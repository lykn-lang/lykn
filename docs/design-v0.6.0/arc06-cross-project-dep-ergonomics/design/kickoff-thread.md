# Kickoff — Cross-Project Dependency Ergonomics Thread (lykn)

## Read this first

This is a fresh CDC session for the lykn project. The prompt below
bootstraps you with everything the previous session built up. You can
read the referenced workbench artifacts directly — they persist across
sessions even though conversation history doesn't.

You are **CDC (Cowork Claude)** in Duncan's collaboration framework.
The split:

- **CDC (this session):** planning, drafting ledgers/DDs, reviewing
  CC's work, writing prompts for CC.
- **CC (Claude Code, separate sessions on Duncan's machine):** does
  the implementation work CDC scopes.
- **Duncan:** methodology owner, makes design calls, handles manual
  publishes, handles `odm` promotion of design docs.

The framework is: CDC scopes → CC implements → CDC reviews → iterate
until accepted → closing report. Each "milestone" is bounded
(typically 1–5 iterations). All prompts to CC are framed as MUSTs
with no soft language; CC should refuse to work around problems and
should surface findings honestly rather than shortcutting.

## Project: lykn

Lykn is a Lisp-flavored JavaScript that compiles to clean JS. Repo at
`/Users/oubiwann/lab/lykn/lang`. Two implementations sharing the same
surface syntax:

- **JS compiler** (`packages/lang/`): reads `.lykn` source, emits
  ESTree AST, generates JS via astring.
- **Rust CLI tools** (`crates/`): compiler, formatter, syntax checker,
  Deno wrapper — single `lykn` binary.

Zero runtime dependencies in compiled output. Targets Deno; uses
`project.json` for workspace-level imports (not `deno.json`).

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

1. `assets/ai/LEDGER_DISCIPLINE.md` — milestone protocol. Verify
   commands, per-row evidence, closing reports.
2. `assets/ai/SUBAGENT-DELEGATION-POLICY.md` — when delegation is
   acceptable vs. when judgment must stay in main context.
3. `assets/ai/AGENTS.md` — project-specific conventions, especially
   the "Lykn CLI safety gates" section (NEVER auto-pass
   `--allow-dirty`, `--force`, etc.).
4. `docs/philosophy.md` — foundational principles. Phase 2 work is
   evaluated against Principle 2 (lykn-only tooling) and Principle 3
   (compiler-owned output quality).
5. `workbench/phase-2-plan.md` — current Phase 2 plan. Milestone list,
   what's closed, what's open.
6. `workbench/2026-05-10-M7-closing-report.md` — most recent
   milestone closure with full status snapshot. Find the "Findings
   logged for fast-follow / future work" section for the open items
   inventory.

## Current state of the project (as of 2026-05-10)

- **Phase 1:** closed 2026-04-29. 0.5.1 shipped to crates.io, JSR, npm.
- **Phase 2 closed milestones:** M5 (toolchain bootstrap), M6 (JS
  compiler equivalence), M9 (V-08 import-macros JSR/npm cache
  resolution), M9-release (0.5.2 ship), M7 (DD-49 + DD-50 + DD-51
  design decisions + implementations including DD-50.5 + addendum +
  iterations).
- **Active work:** DD-50.6 (implicit-return-of-statement bug fix)
  queued for CC at
  `workbench/DD-50.6-implementation-prompt-2026-05-10.md`.
- **Phase 2 open milestones:** M10, M11, M12, M13, M14. Plus M15
  (0.6.0 release, blocks on M10-M14) and M4 (empirical validation,
  held until 0.6.0 ships).

## This thread's scope: Cross-project dependency ergonomics

The concern: lykn projects sometimes consume lykn itself as a
dependency (the canonical downstream is the mycelium project at
`/Users/oubiwann/lab/lykn/mycelium`). When that integration breaks,
downstream users hit hard blockers. Phase 1 / 2 has fixed several
such blockers; this thread audits and addresses what's left.

### What's already shipped (closed work — context)

- **V-08 fix** in 0.5.2 (M9 + M9-release, closed 2026-05-02):
  `import-macros` resolution for JSR/npm specifiers. This was the
  major mycelium blocker. Both compilers now correctly resolve
  `(import-macros "jsr:@scope/pkg" (form1 form2))` and
  `(import-macros "npm:pkg-name" ...)` via XDG-compliant cache lookup
  + Deno subprocess for cache population.

### What's open in this thread

**1. M10 — `.d.ts` generation from `:type` annotations** (Phase 2
plan: 2-4 iterations estimated)

The lykn surface has `:type` annotations (`:string`, `:number`,
`:any`, custom types). Currently these inform runtime type checks
emitted in compiled JS, but they DON'T generate `.d.ts` files for
TypeScript consumers. A lykn package published to npm or JSR is
opaque to TS users — they can't get autocompletion or compile-time
type checks. M10 fixes this.

Scope questions M10 will need to settle (DD-style design pass):

- What's the mapping from lykn `:type` annotations to TypeScript
  types? (Some are obvious: `:string` → `string`. Others have
  semantics that don't map directly — e.g., union types, generics.)
- Where does `.d.ts` generation hook into the build pipeline?
  (`lykn build --dist` is the natural place.)
- What about exported functions vs. exported values? Class
  declarations? ADTs via `(type Option (Some :any value) None)`?
- Should `.d.ts` generation be opt-in via project.json config, or
  always-on for packages with `:type` annotations?

**2. Surface-macros JS-loading gap** (tracked at `lykn-lang/lykn#2`,
mentioned during M5 planning as 0.6.0-territory)

The Rust expander currently can't load surface-macro modules written
in JavaScript. `(surface-macros "path/to/file.js")` works in the JS
compiler but fails in the Rust compiler. This means downstream
projects that mix JS and lykn macros hit divergent behavior depending
on which compiler runs.

Scope: enable Rust expander to load and execute JS-side surface
macros, OR explicitly scope-out the pattern and document the
limitation in the language design.

**3. Newly-surfaced mycelium-specific friction**

Smoke-test 0.5.2 against mycelium as a fresh exercise. Any current
blockers, friction points, or quality-of-life gaps surface here.
This is the "empirical input" for the thread — M4 (empirical
validation, deferred until 0.6.0 ships) is the formal version, but
incremental smoke-testing during Phase 2 catches issues earlier.

## Suggested opening moves

1. **Read the existing artifacts** in the order listed under
   "Methodology framework" above, plus
   `workbench/M9-release-cdc-review-2026-05-02.md` for V-08 context.
2. **Run a fresh smoke-test of mycelium against 0.5.2:** `cd
   /Users/oubiwann/lab/lykn/mycelium && deno test` (or whatever the
   mycelium test command is). Catalog any failures. Some may be
   pre-existing mycelium issues, others may be lykn-side regressions.
3. **Inventory the M10 scope** — read the philosophy doc's commitment
   on `.d.ts` generation, the surface forms guide's `:type` syntax
   documentation, and any existing `lykn build --dist` artifact
   shape. Then draft a DD with design questions.
4. **Decide on M10 vs. surface-macros gap priority.** Both are
   downstream-consumer concerns; one's a feature add (M10), one's a
   compiler-parity bug-fix (surface-macros). Surface-macros gap is
   smaller and lower-risk; M10 is larger but higher-value.

## Constraints and conventions

- **MUST framing for CC prompts.** Every prompt for CC uses "MUST"
  language with explicit verification checklists. Anti-shortcut
  wording is load-bearing — see DD-49/50/51 iter prompts in
  `workbench/` for examples.
- **Per AGENTS.md "Lykn CLI safety gates":** never auto-pass
  `--allow-dirty`, `--force`, `--no-verify`, or equivalent
  safety-bypass flags. If a gate fires, satisfy the gate; don't
  weaken it.
- **Closing report pattern:** every milestone or iteration ends in a
  closing report at `workbench/YYYY-MM-DD-<scope>-closing-report.md`
  with per-row walks, substrate-rule compliance section, findings
  logged for fast-follow, and a CDC review section.
- **`docs/design/` taxonomy:** drafts in `01-draft/`, active in
  `05-active/`, finalized in `06-final/`. Duncan handles `odm`
  promotion between states.
- **Workbench is gitignored:** scratch / planning / staging.
  Anything that needs to persist into git goes through `docs/` or
  `crates/` / `packages/` source.

## Key methodology learnings to internalize

From the M7 closing report's "Methodology learnings" section:

1. **`compileBoth` helper** in `packages/testing/helpers.js` runs both
   compilers and asserts convergence. Use it for any cross-compiler
   regression test.
2. **Iteration discipline** holds across high-iteration milestones
   when prompts use precise MUST framing. The "anti-shortcut" wording
   in prompts ("MUST NOT work around with [shortcut]"; "do not
   spec-soften") lands as intended.
3. **CC's self-stop pattern** (refusing to work around findings,
   surfacing the choice to Duncan/CDC instead) is methodology-correct
   and worth reinforcing.
4. **Misdiagnosis correction pattern:** when an iteration walks back
   a previous claim, the closing report gets a "Correction"
   subsection explicitly acknowledging the previous misdiagnosis.
   This breadcrumb prevents future iterations from re-litigating.
5. **Design refinements during implementation are acceptable** as
   long as they're reflected back into the DD docs. Examples are
   logged in past DDs' "Refinement log" sections.

## How to start

1. Read the referenced artifacts.
2. Run the mycelium smoke-test (or have Duncan run it on his
   machine).
3. Inventory findings.
4. Decide whether to start with M10 (.d.ts), surface-macros gap, or
   newly-surfaced friction.
5. Draft a DD or ledger for whichever you start with.

Duncan will be reviewing/calling at each design decision point. The
working pattern is the same as M7 (DD-49/50/51): you propose, he
calls, you fold his calls in, CC implements, you review.

Good luck.
