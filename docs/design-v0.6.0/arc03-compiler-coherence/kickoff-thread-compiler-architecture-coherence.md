# Kickoff — Compiler Architecture Coherence Thread (lykn)

## Read this first

This is a fresh CDC session for the lykn project. The prompt below
bootstraps you with everything the previous session built up. Workbench
artifacts persist across sessions even though conversation history
doesn't.

You are **CDC (Cowork Claude)** in Duncan's collaboration framework:

- **CDC (this session):** planning, drafting DDs, reviewing CC's work,
  writing prompts for CC.
- **CC (Claude Code, separate sessions on Duncan's machine):**
  implementation.
- **Duncan:** methodology owner, makes design calls, handles `odm`
  promotion of design docs.

Framework: CDC scopes → CC implements → CDC reviews → iterate → closing
report. Prompts to CC use MUST framing with explicit verification
checklists. No soft language; no opt-outs.

## Project: lykn

Lisp-flavored JavaScript that compiles to clean JS. Repo at
`/Users/oubiwann/lab/lykn/lang`. Two implementations:

- **JS compiler** (`packages/lang/`): ESTree AST + astring.
- **Rust CLI tools** (`crates/`): single `lykn` binary.

Targets Deno; uses `project.json` for workspace imports.

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
3. `assets/ai/CLAUDE.md` — project-specific conventions including
   "Lykn CLI safety gates."
4. `docs/philosophy.md` — foundational. Especially Principle 3
   (compiler-owned output quality) — this thread is intimately
   tied to it.
5. `workbench/phase-2-plan.md` — Phase 2 milestones.
6. `workbench/2026-05-10-M7-closing-report.md` — recent milestone
   closure with status snapshot.

## Current state of the project (as of 2026-05-10)

- Phase 1 closed 2026-04-29 (0.5.1 shipped).
- Phase 2 closed: M5, M6, M7 (incl. DD-49/50/51 + DD-50.5 + addendum
  + iters), M9, M9-release.
- Active: DD-50.6 (implicit-return bug fix queued for CC).
- Open: M10, M11, M12, M13, M14, M15 (0.6.0 release), M4 (held).

## This thread's scope: Compiler architecture coherence

The concern: lykn has two compilers (Rust + JS). They share the surface
language but diverge structurally at multiple points. Some divergences
are intentional (Rust has surface-form classifier; JS has macro
handlers). Some are latent bugs that compileBoth has surfaced. Some
are pending design decisions that have been drafted but not landed.

This thread audits and addresses the structural alignment so that
"the two compilers produce the same output for the same input" is
true by construction wherever possible, and intentional divergence is
documented where it exists.

### Specific open items

**1. DD-36 (kernel-surface compiler split) — drafted, not promoted**

Located at `workbench/dd-36-kernel-surface-split.md`. Drafted but
never made it into `docs/design/01-draft/` or beyond. Goes into the
architecture of splitting lykn's compilation pipeline into a kernel
(JS-dialect IR) and surface (user-facing forms) layer.

Decision needed: promote, decommission, or replace? Status check
the DD's relevance against what landed in M7 (the DDs there
established surface vs. kernel patterns implicitly).

**2. DD-37 (JS surface compiler architecture) — drafted, not
promoted**

Located at `workbench/dd-37-js-compiler-architecture.md`. JS-side
counterpart to DD-36. Same status: needs decision on promotion
vs. decommission.

**3. V-06 — JS-side unused-binding analyzer absent**

M6 (JS-compiler equivalence) confirmed that the JS compiler emits no
warnings because it has no analyzer. The Rust compiler has one that
produces real (and sometimes false-positive) warnings. M8's original
scope was to fix the Rust analyzer's scope-tracking bugs. M7 absorbed
the V-02-V-05 fixes; V-06 ended up scoped out.

Two reads:
- (A) Add a JS-side analyzer for parity (build new infrastructure).
- (B) Document the divergence explicitly: "Rust is the
  validation-pass compiler; JS is the fast-emit compiler. Users
  running validation should use `lykn check` (Rust)."

M6's CDC review suggested (B) as the conservative move; (A) as a
0.6.0+ candidate. This thread can revisit.

**4. Cross-compiler test conversion (broader compileBoth adoption)**

`compileBoth` was introduced in DD-50.5 addendum and immediately
surfaced two real latent bugs (KernelPassthrough skip-emitter-descent,
PATH-vs-local-build binary issue). Currently only 4 lykn-side tests
use it; the test suite has ~270+ tests, most of which run only the
JS compiler.

Broader conversion would surface more latent divergences. The
question is: which tests should convert, how to script the conversion,
and what level of normalization is acceptable in `compileBoth`'s
divergence detection.

**5. JS/Rust error-message format divergence**

Logged as Finding #4 in
`workbench/2026-05-05-DD-49-iteration-2-closing-report.md`. JS emits
`"return 'result__gensym0' expected boolean"` (uses the gensym var
name); Rust emits `"return value expected boolean"` (uses generic
"return value" label). Same error class, different wording. Pre-dates
DD-49; surfaced when DD-49 added the bridged `"isValid (valid?):"`
prefix.

Should both compilers agree? If yes, which version is right?

### What's already shipped that this thread doesn't need to redo

- DD-49: identifier mapping (both compilers byte-identical).
- DD-50: position-aware compilation of conditional/block forms (both
  compilers structurally aligned; remaining surface forms route
  through `KernelPassthrough` which now correctly recurses).
- DD-50.5: kernel-form context profile (per-form Statement/Value
  classification, both compilers in sync).
- DD-50.5 addendum: `compileBoth` cross-compiler test helper +
  `KernelPassthrough` fix.

## Suggested opening moves

1. **Read DD-36 and DD-37 drafts.** Determine current relevance. Did
   M7's work supersede them, complement them, or leave them
   untouched? Compare what they propose against what `forms.rs` /
   `compiler.js` actually do now.
2. **Audit the JS-side analyzer absence.** Trace what the Rust
   `analysis/` module covers. Decide whether (A) build JS-side
   parity, (B) document the divergence as intentional + recommend
   `lykn check` for validation, or (C) something else.
3. **Scope the broader compileBoth conversion.** Pick a sample of
   tests (e.g., `test/forms/*_test.lykn`) and try converting; see
   what divergences surface. Triage them as bugs vs. cosmetic
   normalization issues.
4. **Decide on error-format alignment.** Quick discussion with
   Duncan; pick which compiler's wording is canonical and make the
   other match.

## Constraints and conventions

- **Per CLAUDE.md "Lykn CLI safety gates":** never auto-pass
  `--allow-dirty`, `--force`, or equivalent.
- **MUST framing for CC prompts.**
- **Closing report pattern** for each milestone (template in past
  closing reports — see `workbench/2026-05-10-M7-closing-report.md`).
- **`docs/design/` taxonomy:** drafts in `01-draft/`, active in
  `05-active/`, finalized in `06-final/`. Duncan handles promotion.
- **Workbench is gitignored.**

## Key methodology learnings

- `compileBoth` is the gating tool for cross-compiler convergence;
  this thread is its natural home for broader adoption.
- Misdiagnosis correction pattern: if iter-N walks back a previous
  claim, the closing report gets a "Correction" subsection. See
  `workbench/2026-05-10-DD-50.5-addendum-closing-report.md` for an
  example.
- Design refinements during implementation are acceptable when
  reflected back into the DD docs (see DD-49 / DD-50.5 "Refinement
  log" sections).
- CC's self-stop behavior (surfacing findings rather than
  shortcutting) is methodology-correct.

## How to start

1. Read DD-36 and DD-37 drafts. Decide whether either is still
   accurate / desirable.
2. Re-survey what's structurally divergent between the two
   compilers post-DD-49/50/50.5/50.6 work.
3. Draft a single coordinating DD or milestone for this thread,
   scoping the work into bounded iterations.
4. Run it past Duncan for the design calls, then send to CC.

The thread may not need a single huge milestone — could be a
multi-DD pass where each DD covers one structural concern. Discuss
with Duncan whether to handle as one milestone (M-something in
Phase 2 or 3) or as discrete DDs.

Good luck.
