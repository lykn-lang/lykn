# Kickoff — Lykn-Source Linter Thread (lykn, M12)

## Read this first

This is a fresh CDC session for the lykn project. The prompt below
bootstraps you with context from the previous session. Workbench
artifacts persist across sessions.

You are **CDC (Cowork Claude)** in Duncan's collaboration framework:

- **CDC (this session):** planning, drafting DDs/ledgers, reviewing
  CC's work, writing prompts for CC.
- **CC (Claude Code, separate sessions on Duncan's machine):**
  implementation.
- **Duncan:** methodology owner, design calls, manual publishes.

Framework: CDC scopes → CC implements → CDC reviews → iterate →
closing report. Prompts to CC use MUST framing with explicit
verification checklists.

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
3. `assets/ai/AGENTS.md` — project-specific conventions including
   "Lykn CLI safety gates."
4. `docs/philosophy.md` — foundational. The 0.6.0 commitments section
   names the linter explicitly.
5. `workbench/phase-2-plan.md` — Phase 2 milestones; M12 entry there.
6. `assets/ai/SKILL.md` — **especially relevant for this thread.**
   The anti-patterns table and code-quality rules are the substrate
   the linter should enforce.
7. `docs/guides/09-anti-patterns.md` — concrete anti-pattern catalog.

## Current state of the project (as of 2026-05-10)

- Phase 1 closed 2026-04-29 (0.5.1 shipped).
- Phase 2 closed: M5, M6, M7 (incl. DD-49/50/51 + DD-50.5 +
  addendum + iters), M9, M9-release.
- Active: DD-50.6.
- Open: M10, M11, **M12**, M13, M14, M15, M4.
- This thread covers M12 — the largest single Phase 2 open
  milestone.

## This thread's scope: Lykn-source linter for `lykn lint`

**Phase 2 plan entry:** "Lykn-source linter for `lykn lint`. 3-5
iterations (substantial new work)."

This is the most substantive Phase 2 open milestone. Building a
lint pass over lykn source code (`.lykn` files) — not the compiled
JS output (Deno's own `deno lint` covers that), and not just syntax
errors (the existing `lykn check` does that). A linter for
**stylistic and semantic patterns** in lykn source.

### Why this matters

Lykn has substantial style and anti-pattern conventions documented
in:

- `assets/ai/SKILL.md` (the AI-facing skill doc — anti-patterns
  table + "Before You Do Anything" principles)
- `docs/guides/09-anti-patterns.md` (concrete anti-pattern catalog
  with bad/good code examples)
- `docs/guides/01-core-idioms.md`
- And other guides

But there's no automated enforcement. A human (or a CDC) has to
catch violations during review. `lykn lint` would automate the
checks — catching unused bindings, type-annotation gaps, cell
overuse, etc. — at write-time.

This is a Principle 3 (compiler-owned output quality) extension:
the compiler doesn't just produce valid JS; it also nudges lykn
source toward the project's conventions.

### What the linter MIGHT cover (inventory question)

The first design pass needs to inventory what rules the linter
should check. Candidates from existing guides:

**From `docs/guides/09-anti-patterns.md`:**

- Cell + swap! used where assoc/conj would suffice.
- Empty catch blocks.
- Direct kernel operator use (`===`, `&&`, `!`) instead of surface
  forms.
- Quoted-string object keys instead of keywords.
- Sequential `await` on independent operations.
- Mutation discipline — `cell` used where pure transformation
  would do.

**From `assets/ai/SKILL.md`:**

- Type-annotation discipline on `func` params.
- Mutation discipline (`!` suffix on mutating ops).
- Predicate discipline (`?` suffix on boolean returns).
- API design conventions.

**From M7 work (DD-49 / DD-50):**

- Style: "Prefer `?` for expression position, `if` for statement
  position" (DD-50 Rule 5).
- Identifier collision detection (already in compiler via DD-49
  Rule 6 — but linter could catch at source-level too).

**Probably out of scope for v1:**

- Semantic verification (typechecking) — Rust's analysis layer
  already does much of this.
- Complex flow analysis (effect tracking, etc.) — too much for v1.
- Performance hints — separate concern; defer.

The right v1 scope is "stylistic anti-patterns surface-grep-able
from the SExpr representation."

### Naming collision to resolve up-front

**`lykn lint` is already taken.** `15-lykn-cli.md` ID-04c documents
an existing `lykn lint` command that wraps `deno lint --config
project.json` to lint the *compiled JS output*. It was added in the
M5 era as part of the lykn-fronted toolchain (Principle 1 — all
project operations go through `lykn`). M12's linter operates on
*lykn source*, so the two commands aren't interchangeable.

The thread MUST resolve this before answering Q1-Q6 below, because
the name shapes the surface area, the help text, the testing
strategy, and the guide updates. Three credible options:

- **(A) Repurpose `lykn lint` for source linting; move the JS pass
  to `lykn lint --js` or `lykn lint-js`.** Aligns with the user
  mental model that "lint" means "lint the language you're writing"
  (i.e., lykn source). Costs a CLI break for anyone scripting
  against the current `lykn lint` — worth a quick survey before
  deciding.

- **(B) Keep `lykn lint` as the JS post-compile pass; introduce a
  new command for source linting.** Candidate names:
  `lykn lint-source`, `lykn analyze`, `lykn audit`, or extending
  `lykn check --lint`. Avoids a CLI break but bifurcates the mental
  model.

- **(C) Unify under `lykn lint` with subcommands or flags
  controlling pass selection:** `lykn lint --source`,
  `lykn lint --js`, `lykn lint --all`, with the bare command
  defaulting to `--all` so both passes run. Coherent surface, but
  requires careful design of the diagnostics output (two passes
  emitting into one report).

Duncan's call. The DD should answer this before the architecture
questions below — Q1 (where it lives) and Q3 (output format) both
depend on whether the linter is one command or two.

**Existing `lykn lint` references that will need updating** depending
on which option lands:

- `docs/guides/15-lykn-cli.md` ID-04c (around L201) — the canonical
  documentation entry.
- `docs/guides/15-lykn-cli.md` command table (around L386) — the
  one-line summary row.
- `docs/guides/10-project-structure.md` L138 — "lykn test, lykn
  lint, lykn run wrap Deno with --config project.json".
- `crates/lykn-cli/` — the existing command implementation and any
  snapshot tests (`insta` snapshots in
  `crates/lykn-cli/src/snapshots/`).

### Architecture questions (DD-style design pass)

The linter design needs DD-level decisions:

**Q1: Where does the linter live?**

- (A) Rust-side `crates/lykn-lang/src/analysis/lint.rs` or similar,
  invoked by `lykn lint` command.
- (B) JS-side `packages/lang/lint.js` invoked via `lykn lint`
  (Rust CLI shells out to Deno for the lint pass).
- (C) Both, with each compiler implementing a subset.

Probably (A) — keep it in Rust for compile speed and consistency
with `lykn check`.

**Q2: Rule architecture?**

- (A) Hardcoded `match`-based rule dispatcher (fast, simple, less
  extensible).
- (B) Plugin-style rule registry (slower, more extensible).
- (C) Configuration-driven (read rule list from `project.json` or
  similar; rules are constants in code).

V1 probably wants (A) — start hardcoded, refactor to (C) later if
demand surfaces.

**Q3: Output format?**

- (A) Plain-text diagnostics (like `lykn check`).
- (B) JSON for tooling integration (LSP, editor warnings).
- (C) Both — default plaintext, `--format=json` for tooling.

Probably (C).

**Q4: Severity levels?**

- (A) Single "lint warning" level.
- (B) Multiple levels (error, warning, info, hint) matching the
  style of `cargo clippy` / `deno lint`.
- (C) Configurable per-rule.

Probably (B) for v1, with simple categorization.

**Q5: Auto-fix support?**

- (A) Read-only — report only, no fixes.
- (B) `--fix` flag that applies safe transformations.
- (C) `--fix-suggested` flag with confirmation.

Probably (A) for v1; (B) as fast-follow if rules naturally
auto-fix.

**Q6: Initial rule set?**

Pick 5-10 rules for v1. Candidate list from above. Each rule needs:
- A name (e.g., `unused-binding`, `cell-overuse`,
  `prefer-question-ternary-in-expr`).
- A severity.
- A check predicate (operates on SExpr).
- A diagnostic message format.
- A code example in tests.

### Why this is 3-5 iterations

Per the Phase 2 plan estimate, this is the largest open milestone.
Reasonable breakdown:

- **Iter 1 (DD):** answer Q1-Q6 design questions; commit the
  architecture.
- **Iter 2 (scaffolding):** add `lykn lint` command stub; rule
  dispatcher; output formatting; one minimum-viable rule.
- **Iter 3 (rule set):** add the v1 rule set (5-10 rules).
- **Iter 4 (polish):** error messages, JSON output, snapshot tests.
- **Iter 5 (docs + closing):** SKILL.md / guides update, closing
  report.

Each iteration is its own CC session.

## Suggested opening moves

1. **Read the SKILL anti-patterns table** + `docs/guides/09-anti-patterns.md`
   to inventory potential rules.
2. **Read `crates/lykn-lang/src/analysis/`** to understand the
   existing analysis pass architecture (used for unused-binding
   warnings, collision detection from DD-49, etc.).
3. **Read the existing `lykn check` command** in `crates/lykn-cli/`
   for the pattern to follow.
4. **Read the existing `lykn lint` command** in `crates/lykn-cli/`
   (the JS post-compile `deno lint` wrapper). Needed to answer the
   naming-collision question above before the rest of the DD.
5. **Draft the DD** — answer the naming-collision question first,
   then Q1-Q6 with proposed defaults.
6. **Discuss with Duncan** before committing the architecture.

## Related work that should NOT be in scope

- **`deno lint` integration** — already runs on compiled JS output;
  separate concern from lykn-source linting.
- **`lykn fmt`** (formatter) — separate command; not lint.
- **Typechecking / type inference** — Rust's analysis layer
  already handles this for the cases lykn cares about; don't
  duplicate.
- **LSP server work** — Phase 3+ territory.

## Constraints and conventions

- **Per AGENTS.md "Lykn CLI safety gates":** never auto-pass
  `--allow-dirty`, `--force`, or equivalent flags.
- **MUST framing for CC prompts.**
- **Closing report pattern** — see
  `workbench/2026-05-10-M7-closing-report.md`.
- **Snapshot testing (insta):** lykn-cli uses `insta` for golden-file
  snapshot tests. The linter will likely add new snapshots for its
  output format. Never auto-accept snapshots — review each.
- **Workbench is gitignored.**

## Key methodology learnings

- Build up incrementally — each iteration ships a working subset.
  Don't try to land all rules in one iteration.
- Snapshot test discipline is load-bearing for tooling output.
- CC's self-stop pattern (refusing shortcuts) is
  methodology-correct.
- Misdiagnosis correction pattern: if iter-N walks back a previous
  claim, the closing report gets a "Correction" subsection.

## How to start

1. Read the referenced anti-pattern documents.
2. Inventory candidate rules (probably 10-15; cull to v1 set of
   5-10 with Duncan's input).
3. Draft a DD with the architecture questions Q1-Q6 answered as
   proposed defaults.
4. Get Duncan's design calls.
5. Fold in his calls; send DD + iter-1 (scaffolding) ledger to CC.

This is the most substantive Phase 2 open work. Expect ≥1 month of
elapsed-time-with-iterations to close M12 fully, even though each
individual CC session is bounded.

Good luck.
