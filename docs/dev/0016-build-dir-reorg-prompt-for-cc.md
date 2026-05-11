# Build Dir Reorg + `lykn publish`

## Read this first

Two 0.6.0 commitments land in this milestone, bundled because they share
the `crates/lykn-cli/` surface area and are conceptually coupled:

- **M11 — Build-dir reorganization.** All build artifacts move under
  `target/lykn/build/` (intermediate compiler output) and
  `target/lykn/dist/` (publish-ready staging). This closes the
  philosophy.md Known Violations around `.js` files in the source tree
  and aligns with Rust's `target/` discipline. Includes a four-way
  command split: `lykn compile` (single-file primitive), `lykn build`
  (whole-project compile to `build/`), `lykn dist` (whole-project
  staging to `dist/`, renamed from `lykn build --dist` with a
  deprecation alias), and `lykn publish` (depends on `dist`).

- **M13 — `lykn publish` uncommitted-changes check.** `lykn publish`
  refuses to ship on a dirty tree by default, with `--allow-dirty`
  override. The override does NOT auto-inject `--allow-dirty` into
  underlying `deno publish` / `npm publish` invocations — those have
  their own gates the user controls independently. This is the
  materialization of the lykn-level half of CLAUDE.md's "Lykn CLI
  safety gates" rule.

All twelve design questions that this milestone touched have been
resolved by CDC. The dispositions live in the ledger's `§Design
dispositions` section. CC does NOT need to re-derive them. CC may
amend with surfaced concerns, but should not silently diverge.

---

## Ledger

The load-bearing artifact is the ledger:

**`workbench/milestones/M11-M13-build-dir-and-publish-dirty-check-ledger.md`**

It contains:

- Twelve specs (one per ledger row), each with an exec-able Verify
  command.
- The complete `§Design dispositions` section — all twelve resolved
  questions.
- `§Source materials (read in this order)` — eleven numbered references
  with specific file paths and line numbers.
- `§CC instructions` — order of work, self-stop conditions, the M3.5
  commit `64bb301` precedent CC must NOT re-create.
- `§Closing report specification` — structure CC must follow at close.

**Read the ledger before writing any code.** CC's work is against the
ledger; the closing report's per-row walk uses the ledger's IDs.

---

## Worktree and branch

This thread shares one worktree: **`.worktrees/cdc-build-dir-reorg`**,
branch `cdc-build-dir-reorg`. Duncan, CDC, and CC all operate inside it.
No fresh CC branch.

### Substrate rule: git operations against this worktree happen on the host

CDC running inside Cowork **must not** invoke `git` from inside this
worktree — read OR write. That includes `git status`, `git log`,
`git diff`, `git merge`, `git reset`, `git rebase`, `git commit`,
`git worktree add/remove`, and anything else.

Reason: a worktree's `.git` file encodes a single absolute path to its
metadata. Cowork sees the lykn repo as `/sessions/<session>/mnt/lang/`;
the host sees it as `/Users/oubiwann/lab/lykn/lang/`. The worktree can
be encoded for one or the other, not both. The worktrees were
recreated from the host on 2026-05-11 (correct encoding for CC and
Duncan), so Cowork-side `git` invoked inside the worktree now fails
with `fatal: not a git repository:
/Users/oubiwann/lab/lykn/lang/.git/worktrees/cdc-build-dir-reorg`.

CDC's Cowork-side work is read-only-from-files: Read tool, `ls`,
`cat`, `grep`, Write/Edit tools (Cowork's permission layer handles
these). For git introspection, CDC runs read-only ops from the main
checkout (`/sessions/<session>/mnt/lang/`, no `.worktrees/...`
subdir) — that path resolves correctly because the main checkout's
`.git/` is a directory, not a gitlink file. Branch state across all
worktrees is visible from there.

CC, running on Duncan's host machine, handles all git operations
against this worktree: `git fetch`, `git merge`, `git commit`,
`git rebase`, etc.

### Before starting: fast-forward to current `release/0.6.x`

From CC's host shell:

```sh
cd /Users/oubiwann/lab/lykn/lang/.worktrees/cdc-build-dir-reorg
git fetch origin
git merge --ff-only release/0.6.x
git log -1 --oneline
```

The upstream head at this prompt's writing is `dd1f059` (Guide-drift
cleanup: decommission 13-biome + DD-49/DD-50 doc updates, landed
2026-05-10). The two commits between the worktree's current `f9b647a`
and `dd1f059` are DD-50.6 (`e15379f`) and the guide-drift cleanup
itself (`dd1f059`). Verify this is the head you fast-forward to (or
whatever has landed since this prompt was written).

If `release/0.6.x` advances further while CC is working, rebase
periodically — but don't rebase mid-iteration without good reason.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md` — protocol.
2. `assets/ai/CLAUDE.md` "Lykn CLI safety gates" section — load-bearing
   for M13. The rule materialization is what M13 *is*.
3. `assets/ai/CLAUDE.md` "Snapshot testing (insta)" section — load-
   bearing for M11. Manual review only; `cargo insta accept` is
   forbidden.
4. `assets/ai/SUBAGENT-DELEGATION-POLICY.md` — implementation is
   thinking work; closing report is thinking work. Subagent
   delegation is acceptable for lookup work only.
5. `workbench/milestones/M11-M13-build-dir-and-publish-dirty-check-ledger.md`
   — the ledger. Read every section.
6. `docs/philosophy.md` `§0.6.0 commitments` and `§Known violations`
   sections — the contract being paid off.
7. `crates/lykn-cli/src/main.rs` — clap definitions, `cmd_publish`,
   `cmd_build`, `cmd_new` (scaffold generation), the existing `git init`
   invocation at line 895 (the only `git` call in the CLI today).
8. `crates/lykn-cli/src/dist.rs` — `compile_lykn_sources`,
   `copy_js_files`, `write_deno_json`. The compile-output relocation
   (Spec 2) and the staged-tree generation (Spec 3) both live here.

---

## Scope

**Twelve MUST deliverables, one per ledger row.** All are MUST — no
optional items, no shortcuts. If any deliverable cannot be completed
as specified, stop and surface the constraint to CDC.

Order of work is specified in the ledger's `§CC instructions` section
(item 4). The short version:

1. Spec 1 (baseline capture).
2. Spec 2 (compile-output relocation) — **central M11 change.**
3. Spec 5 (project.json imports repointed) — **must follow Spec 2 quickly.**
   Without Spec 5, `lykn test` will break and all downstream Verify
   commands depend on it.
4. Spec 3, Spec 4 (`lykn dist` + `lykn build` semantics, deprecation
   alias) — either order.
5. Spec 6 (scaffold updated).
6. Spec 7 (snapshot review) — after all M11 changes.
7. Spec 8, Spec 9 (M13 dirty-check + `--allow-dirty`).
8. Spec 10 (philosophy.md alignment).
9. Spec 11 (substrate-rule compliance) — drafted as part of closing
   report.
10. Spec 12 (commit chain) — verified at close.

---

## Critical antipatterns (resist these)

**1. Auto-injecting `--allow-dirty` to underlying tools.** When
implementing Spec 9 (`--allow-dirty` override), the lykn-level gate is
bypassed. **Do NOT then pass `--allow-dirty` through to
`deno publish` / `npm publish`** — those have their own gates that are
the user's separate concern. The precedent for this antipattern is
commit `64bb301` (reverted), named in CLAUDE.md. The rule's reasoning:
"dry-runs against an uncommitted tree don't tell the user what would
actually publish, so weakening the gate defeats the purpose." The
same logic applies even to real publishes: lykn's gate and the
underlying tool's gate are independent.

The Spec 9 Verify command grep — `grep -nE '"--allow-dirty"'
crates/lykn-cli/src/main.rs` — should return matches ONLY in the clap
definition for the lykn-level flag AND in the dirty-check logic. NEVER
in a `Command::new("deno")` or `Command::new("npm")` args block.

**2. Auto-accepting insta snapshots.** When implementing Spec 7
(snapshot review), `cargo insta review` opens the interactive TUI.
**Do NOT use `cargo insta accept`.** Each diff must be inspected and
either accepted with explicit reasoning recorded in
`workbench/verify/m11-m13/snapshot-review.md`, or rejected (in which
case the underlying change is the issue, not the snapshot).

**3. Compiling into the source tree.** When implementing Spec 2,
`dist.rs::compile_lykn_sources` currently writes `.js` next to `.lykn`
in `packages/<pkg>/`. This is the Known Violation M11 closes. The
relocation MUST go to `target/lykn/build/<pkg>/`, NOT to a slightly
adjusted source-tree path. Any `.js` left in `packages/<pkg>/` after
the relocation is a partial-implementation defect.

**4. Spec-softening the `exports` field convention.** Per `§Design
dispositions` Q4, source per-package `deno.json` `exports` field stays
unchanged. It is a *template for the staged tree*, not a local-dev
config. If during implementation you find yourself wanting to repoint
it at `../../target/lykn/build/...` "for clarity" — don't. The
project.json `imports` field handles local-dev resolution; the source
`exports` field handles only the staging template role.

**5. Working around a snapshot diff or test failure.** If `lykn test`
breaks after Spec 2 and stays broken after Spec 5, the imports
repointing is wrong somehow. **Diagnose; don't paper over** with
test-fixture adjustments or import-path tweaks that don't reflect a
correct mental model. Same rule for any other surprising behaviour.

---

## Commit-message convention

Each commit names the milestone(s) it touches:

```
M11: relocate compile output to target/lykn/build/<pkg>/
M11: add lykn dist subcommand and lykn build --dist deprecation alias
M11: update lykn new scaffold for target/lykn/build/ layout
M13: add --allow-dirty flag and uncommitted-changes check to lykn publish
M11: close philosophy.md Known Violations resolved by build-dir reorg
```

Granularity: one commit per spec is fine; fewer is also fine if a
single commit cleanly covers multiple related specs. The Spec 12
Verify command grep is `git log --grep="M11\|M13\|build-dir\|publish.*dirty\|allow-dirty" --oneline` — every commit
in the chain should match at least one of these patterns.

Don't make WIP or fixup commits. If you need to iterate on something,
use `git commit --amend` (before pushing) or land it as a single
coherent commit.

---

## Verification checklist (all MUST be checked before reporting complete)

- [ ] All twelve ledger rows have `Status: done` with evidence.
- [ ] Spec 1 baseline captured.
- [ ] `find packages -name "*.js" -type f | wc -l` returns 0 after
      fresh `lykn build`.
- [ ] `find target/lykn/build -name "*.js" -type f | wc -l` returns >0.
- [ ] `lykn dist && ls -d target/lykn/dist/{lang,testing,browser}` succeeds.
- [ ] `lykn build --dist 2>&1` emits the deprecation warning.
- [ ] `lykn test` exits 0 after Spec 5's project.json update.
- [ ] Fresh `lykn new` scaffold's `lykn build && lykn test` exits 0.
- [ ] `cargo insta test --check` reports 0 pending snapshots; or
      `workbench/verify/m11-m13/snapshot-review.md` has rationale for
      each accepted snapshot.
- [ ] In a dirty tree: `lykn publish --jsr --dry-run` exits non-zero
      with the Cargo-style error.
- [ ] In a dirty tree with `--allow-dirty`: `lykn publish --jsr --dry-run`
      exits 0 (or structural-failure pattern).
- [ ] `grep -nE '"--allow-dirty"' crates/lykn-cli/src/main.rs` returns
      matches ONLY in clap def + dirty-check logic.
- [ ] `cargo test --workspace` green.
- [ ] `make lint` clean.
- [ ] `make test` green.
- [ ] philosophy.md "Known violations" entries resolved by M11 moved
      to a "Resolved by M11" subsection.
- [ ] Closing report at `workbench/2026-MM-DD-M11-M13-closing-report.md`
      with per-row walk and substrate-rule compliance section.
- [ ] Single coherent commit chain per `§Commit-message convention`
      above.

---

## Reporting (when complete)

Post a per-spec deliverable × evidence table (12 rows). Include:

- Path to the M11+M13 closing report.
- Commit SHA(s) — at least one per major spec.
- Confirmation `lykn test` and `make test` both green at close.
- Confirmation no `.js` files in source tree (with the explicit `find`
  output).
- Confirmation no `--allow-dirty` auto-injection (with the explicit
  `grep` output showing what matches and where).
- Confirmation `cargo insta accept` was never invoked.

If any test fails, **do NOT report complete.** Surface the failure
with the actual output for diagnosis. Same no-shortcuts rule from
DD-50.5 and DD-50.6 applies — diagnose and resolve, don't work around.

---

## Methodology notes

- Per LEDGER_DISCIPLINE: iteration budget is 5; expect 3–4. If the
  fourth iteration doesn't close the milestone, surface scope concerns
  rather than starting iteration 5 reflexively.
- Per CLAUDE.md "Lykn CLI safety gates": M13 IS the rule's lykn-level
  materialization. Implementation defects here propagate into the
  rule's credibility going forward.
- Per CLAUDE.md "Snapshot testing": never auto-accept. The protocol
  expects manual review.
- Per SUBAGENT-DELEGATION-POLICY: implementation is thinking work,
  closing report is thinking work — both stay in CC's main context.
  Lookup subagents acceptable for grepping the codebase, listing files,
  reading specific lines of files CC needs but doesn't have loaded.

---

## Anticipated objections

- **"Spec 7's `cargo insta test --review --check` flag combination
  doesn't work."** Correct — those two flags may not compose. Amend
  the Verify command inline per the M5/M9 inline-amendment refinement
  to whatever flag combination actually verifies "no pending snapshots
  AND each accepted snapshot has rationale" (probably split into two
  commands). Update the closing report's per-row walk with the
  amended Verify so CDC's verification can reproduce.

- **"Spec 2 breaks `lykn test` until Spec 5 lands. Can I land them
  together?"** Yes — one commit covering both is fine. The order in
  `§CC instructions` is logical sequencing, not commit granularity.

- **"`lykn build --dist` deprecation warning is going to spam test
  output if any existing scripts use it."** Acceptable for 0.6.0.
  Migration is the user's responsibility per `§Why this milestone
  exists`. The Makefile in this repo may need updating to use
  `lykn dist` directly to avoid its own deprecation warnings.

- **"Some philosophy.md Known Violations entries might be partially
  resolved (e.g., `.gitignore *.js` defensive coverage stays even
  after Principle 1 is enforced)."** Per Spec 10, the precise format
  of the resolved-violations section is CC's call. Strike-through,
  separate subsection, footnote — any clear marker. Original text
  preserved as historical record.

- **"Could M11 introduce a `--out <path>` flag for users who want to
  override the target/lykn/build/ location?"** No — `§Design
  dispositions` M11-Q3 explicitly rejects this. Add only if a real
  downstream user demands it.

- **"Could M13 list dirty files inline instead of pointing at
  `git status`?"** Yes — the Cargo-style error format in `§Design
  dispositions` M13-Q3 includes a file list. Use `git status
  --porcelain` output verbatim (with status prefixes like `M`, `??`).

---

## What M11+M13 does NOT cover

- **`lykn migrate` or any auto-migration tool** for 0.5.x scaffolded
  projects. Migration is documented in 0.6.0 release notes; users
  hand-edit or re-scaffold. Out of scope.
- **Lykn-source linter (M12)** — separate thread, separate worktree.
- **0.6.0 release itself (M15)** — separate milestone.
- **JS compiler internals (`packages/lang/`)** — M11+M13 only touches
  `crates/lykn-cli/`, scaffold templates, `project.json`, and
  `docs/philosophy.md` doc alignment.
- **Performance optimization** of the new layout — if measurable
  impact surfaces (e.g., extra disk seeks from the deeper directory
  structure), log as a finding for future profiling-driven work.
- **DD-50.6 follow-on work** — that landed in `e15379f` and is
  independent of this thread.
- **Source-mapping for the new layout** — when source maps land
  (post-0.6.0), the relationship between `packages/<pkg>/*.lykn` and
  `target/lykn/build/<pkg>/*.js` becomes a source-map mapping
  concern. Out of scope here.

---

## Closing handoff

When CC posts the closing report and reporting table per `§Reporting`
above, CDC reviews per LEDGER_DISCIPLINE's CDC protocol (run every
Verify command independently, check evidence chains, watch for
spec-softening / partial adoption / silent drops). The milestone
closes when CDC accepts.

Good luck.
