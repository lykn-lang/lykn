# Kickoff — Lykn Book 0.6.0 Update Thread

## Read this first

This is a fresh CDC session for the **Lykn Book** — the long-form
prose companion to the lykn language. The book lives in its own
repo at `~/lab/cnbb/lykn` (github.com/cnbbooks/lykn). This thread
updates the book from its 0.5.0-era content to align with everything
that ships in 0.6.0.

You are **CDC (Cowork Claude)** in Duncan's collaboration framework:

- **CDC (this session):** planning, drafting DDs/ledgers, reviewing
  CC's work, writing prompts for CC.
- **CC (Claude Code, separate sessions on Duncan's machine):**
  implementation — prose edits, chapter rewrites, drift audits.
- **Duncan:** methodology owner, voice/style arbiter, manual
  publishes.

Framework: CDC scopes → CC implements → CDC reviews → iterate →
closing report. Prompts to CC use MUST framing with explicit
verification checklists.

## The three repos

This thread spans three repos:

- **`~/lab/lykn/lang`** — the lykn language repo. Source of truth
  for what's true about lykn. `assets/ai/SKILL.md`,
  `docs/philosophy.md`, `docs/guides/`, and all the design docs
  (DD-49/50/51 etc.) live here. CDC and CC both need read access
  for verification.
- **`~/lab/cnbb/lykn`** — the book repo. Where chapter prose edits
  land. mdBook-based; `book.toml`, `src/SUMMARY.md`, eight parts,
  39 chapters. Also contains `test/book/<chN>/<section>.test.js`
  files that verify every code example against both compilers.
- **`~/lab/cnbb/lykn-writers-guide`** — the authoring guide repo.
  Standing instructions for any chapter prompt: voice rules,
  structural conventions, source-material locations, code-example
  testing rules. Three files:
  - `authoring-guide.md` — the canonical voice + conventions doc.
  - `new-ch-prompt.md` — bootstrap prompt template for chapter
    writing.
  - `planned-toc.md` — v2 ToC with concept-card mapping
    (1,576 cards across the 39 chapters).

**Note: the writer's guide itself has 0.6.0-era drift** that this
thread must reconcile. See "Bucket 0" below.

## Substrate: git write operations happen on the host

Same rule as the lang threads. CDC sessions in Cowork **must not**
run git write operations against either repo — no `git merge`,
`git reset`, `git rebase`, `git commit`, `git worktree add/remove`,
or anything else that modifies git metadata or tracked files via
shell.

Reason (same as lang): Cowork's sandbox uses different filesystem
paths than the host, and lock-file / ownership semantics don't
translate. Worktrees created from inside Cowork encode sandbox paths
in their git metadata, breaking host-side `git`.

CDC's Cowork-side work against either repo is read-only: file reads,
greps, file writes through Cowork's mediated Write/Edit tools.
Anything that modifies git's view of the world happens from the host
or from CC.

CC runs on Duncan's host machine — it owns the git operations for
both repos.

## The book at a glance

- **mdBook** with `book.toml` at repo root. Themes: HTML uses
  `lfe-pdp`; EPUB has its own CSS (`css/epub.css`) and font set
  (Red Hat Display, Literata, IBM Plex Mono).
- **Build:** `mdbook build` produces `book/html/` and `book/epub/`.
  Mermaid diagrams via `mdbook-mermaid`. EPUB image-path workaround
  via `scripts/mdbook-epub-image-paths.py` (mdbook-epub v0.5.2 bug).
- **39 chapters in 8 parts** plus prelude/preface and conclusion:
  - **Part 0 — Prelude** (chapters 0–1): what lykn is, getting
    started.
  - **Part I — The Architecture** (chapters 2–3): two-language
    design (kernel + surface), the reader.
  - **Part II — The Fundamentals** (chapters 4–10): bindings,
    types, operators, functions, contracts, control flow, ADTs +
    pattern matching.
  - **Part III — The Modern Toolkit** (chapters 11–17): strings,
    colon syntax, mutation/threading, JS interop, destructuring,
    modules, async.
  - **Part IV — Data Structures** (chapters 18–23): objects,
    arrays, classes, iterators, collections, symbols.
  - **Part V — The Deep Cuts** (chapters 24–26): regex, dates/
    JSON/math, Proxy + metaprogramming.
  - **Part VI — The Wider World** (chapters 27–31): browser/DOM,
    server-side, testing, tooling, CI/CD.
  - **Part VII — The Lykn Compiler** (chapters 32–35): kernel
    internals, surface compiler internals, browser shim, building
    a language.
  - **Part VIII — Projects** (chapters 36–38): CLI tool, HTTP
    server, browser app.
- **Each chapter** has multiple sub-files: `0-opening.md`,
  `1-X.md`, …, `N-closing.md`. Openings and closings are voice-
  heavy. Section files start with `##` (mdBook uses the H2 as the
  page title); subsections use `###`. No YAML frontmatter.
- **Voice is "Scholarly Shenanigans"** — a specific blend codified
  in `lykn-writers-guide/authoring-guide.md`:
  - **Pratchett 50%** — dominant voice; precision disguised as
    absurdity. Footnotes that contain the actual insight.
  - **Adams 20%** — cosmic reframing of the mundane; the perfectly
    placed parenthetical aside.
  - **Wodehouse 20%** — sentence-level craft; the construction is
    the joke.
  - **Monty Python 10%** — structural layer only. Sketch-as-
    chapter-opening, willingness to commit fully to an absurd
    premise, willingness to *stop* when the bit has run.
  Voice is dominant in openings/closings, recedes in technical
  sections, dissolves into the chapter's own language by the
  closing. **Technical content is never the joke**; the humour
  lives in framing, metaphor, and transitions.
- **No `AGENTS.md` exists in the book repo.** The authoring guide
  fills that role, but doesn't follow AGENTS.md naming/discovery
  conventions. See Q3 below.
- **Code-example testing is mandatory.** Every ` ```lisp ` block
  has a corresponding test in `test/book/<chN>/<section>.test.js`;
  every example tested against both the JS pipeline (`lykn()`
  function) and the Rust pipeline (`lykn compile` CLI). This is
  the structural gate that catches 0.6.0 compiler-output drift
  automatically.

## What needs updating for 0.6.0

The book was written for 0.5.0. The 0.6.0 changes that affect
chapters fall into four buckets:

### Bucket 0 — The writer's guide itself

Surfaced during this kickoff's first audit. `authoring-guide.md`
and `new-ch-prompt.md` both have drift that must be reconciled
before chapter-prompt writing for 0.6.0 begins, because the
authoring guide is the standing instruction file every chapter
prompt references.

**Path / reference drift:**

- **Stale lang-repo path.** Both files reference `~/lab/oxur/lykn/`
  as the lykn source location (multiple occurrences). The current
  repo is at `~/lab/lykn/lang/`. All five sub-paths (the README,
  `project01-mvp/artifacts/research/`, `docs/design/06-final/`, `examples/surface/`,
  `workbench/conversation-bootstrap-v6.md`) need verifying against
  the new location — the `~/lab/oxur/` prefix is definitively stale.
- **Test-import path `../../src/index.js`** in code samples
  (`authoring-guide.md` "Code example verification" section). The
  JS compiler is now at `packages/lang/` per lang `AGENTS.md`.
  Test files in `test/book/chN/` would need to import via the
  current package layout (likely `jsr:@lykn-lang/lang` or a
  workspace-relative import; verify against `project.json`).
- **Stale DD-range claim.** Technical-accuracy section says "All
  Lykn syntax examples must be valid surface syntax per DD-15
  through DD-21." Current valid range is DD-15 through DD-51+
  (M7 just closed DD-49/50/51, with DD-50.5/.6 fast-follows).
  Update to "per the current SKILL.md / surface-forms guide" so
  the validity reference doesn't drift on every DD landing.
- **Compiler-architecture description in `new-ch-prompt.md`** says
  "Codegen is pure Rust (no astring, no ESTree). A separate JS
  compiler exists for the browser bundle only." Verify against
  current state — the JS compiler is general-purpose (not
  browser-only); it's the Deno-accessible pipeline. Thread 2
  (DD-36/37, V-06) may shift this further.
- **`workbench/conversation-bootstrap-v6.md` reference** — verify
  this file exists in current lang repo. If superseded, point at
  the equivalent (probably `assets/ai/SKILL.md` + `docs/philosophy.md`).
- **JS concept cards path** `~/lab/cnbb/ai-design/concept-cards/`
  — verify this is still the current location for the cnbb
  research substrate. Same for `~/lab/cnbb/ai-design/guides/js/`.

**Lykn-fronted toolchain drift (Principle 1):**

Per lang's `assets/ai/SKILL.md` Principle 1, project operations go
through `lykn <command>`. The authoring guide currently instructs
raw `deno` invocations in several places — these became wrong with
M5's lykn-fronted toolchain.

- **"Running the tests" section** instructs `deno test test/book/`
  / `deno test test/book/ch04/` / `deno test test/book/ --verbose`.
  Per Principle 1, these should be `lykn test test/book/` etc.
  Both the prose and the example test invocations need updating.
- **"Dual-compiler testing" inline shell** uses
  `new Deno.Command("lykn", { args: ["compile", ...] })` — already
  lykn-fronted; good. Leave.
- **Test-runner instructions in `new-ch-prompt.md`** — if any raw
  `deno` invocations appear, same treatment.
- **`mdbook build`** — leave as-is. mdbook isn't lykn-wrapped and
  isn't a "project operation" in the SKILL.md Principle 1 sense.

**Code-block language tag — decided, no change for 0.6.0:**

- **Keep ` ```lisp `** for lykn source through the 0.6.0 release.
  Duncan's call (2026-05-11): the GitHub Linguist submission for
  lykn as its own language is deferred to 0.7.0+, so ` ```lykn `
  isn't a usable tag yet. The `project01-mvp/artifacts/ecosystem/linguist-sample-note.md`
  and `linguist-languages-entry.yml` in the lang repo are
  preparation for that future submission, not the trigger to
  switch tags now. Revisit at the 0.7.0 book pass.

**Voice rubric currency:**

- **The "Scholarly Shenanigans" voice section is solid and recent**
  — likely doesn't need 0.6.0 updates. Leave alone unless a
  specific drift surfaces during audit.

### Bucket 1 — Already-stale (not gated on remaining threads)

These items reflect drift that's already wrong against current
0.5.x state. They don't need to wait for the four open Phase 2
threads to land and can be tackled first.

- **Ch 30 "Tooling"** — currently has `2-biome.md` and `3-eslint.md`
  sub-sections. Per M2 work (lang commit `d8f85049`, 2026-04-29)
  and Session A (2026-05-11), Biome is decommissioned in favour of
  `deno lint` / `deno fmt`. ESLint section likely needs re-scoping
  or deletion. `4-lykn-cli.md` needs M5-era updates and forward-
  looking notes.
- **Ch 31 "CI/CD"** — `1-pipeline.md`, `2-tasks.md`,
  `3-github-actions.md` all contain Biome references. Need
  scrubbing for current `lykn`-fronted workflow.
- **Ch 0 (Why lykn) + acknowledgments + preface "About the
  Cover"** — passing Biome references; copy-edit only.

Drift sweep result (run from `~/lab/cnbb/lykn`):

```sh
grep -rln Biome src/   # 9 files at time of writing
```

### Bucket 2 — Per-thread folds (gated on threads closing)

These wait on the corresponding Phase 2 thread in the lang repo
closing. See lang's `project01-mvp/arc18-guide-alignment/artifacts/dev/0017-guide-drift-cleanup-plan.md`
("Per-thread guide drift" section) for the mirror list.

**After Thread 3 (M11 build-dir reorg + M13 publish dirty-check)
closes:**

- Ch 30 `5-project-structure.md` — `target/lykn/build/` /
  `target/lykn/dist/` paths.
- Ch 31 `1-pipeline.md`, `5-deployment.md` — build output
  references; publish dirty-check gate; `--allow-dirty` opt-out
  story.
- Ch 28 (Server-Side JS) — Deno-specific publish flow if affected.

**After Thread 1 (M10 .d.ts + surface-macros gap + mycelium)
closes:**

- Ch 5 "Types and Values" — `.d.ts` consumer story (probably a
  new section "Lykn for TypeScript Consumers" or similar).
- Ch 16 "Modules" — DD-51 `lykn add` / deno-native tool
  boundaries; `.d.ts` artifacts in `dist/`.
- Ch 30 `4-lykn-cli.md` — `lykn add` documentation.
- Possibly new section in Ch 33 or Ch 26 on macro authoring if
  the surface-macros JS-loading gap closes.

**After Thread 2 (compiler architecture coherence) closes:**

- Ch 32 "The Kernel" — DD-50 position-aware compilation may want
  a callout in `6-form-vocabulary.md`.
- Ch 33 "The Surface Compiler" — DD-36/37 outcome may rewrite
  this chapter substantively; V-06 decision affects
  `6-parallel-compiler.md`.
- Ch 29 "Testing" — `compileBoth` pattern documented as
  recommended for cross-compiler verification.

**After Thread 4 (M12 lykn-source linter) closes:**

- Ch 30 — new section on the source linter (under whatever name
  resolves from the collision flagged in
  `workbench/kickoff-thread-lykn-source-linter.md`).
- Ch 33 — linter as part of the compiler architecture story.
- Possibly cross-references from Ch 9 (Control Flow) or Ch 10
  (Pattern Matching) to lint rules that catch related anti-
  patterns.

### Bucket 3 — Language-level changes from M5–M9 (already landed)

Some are book-wide rather than chapter-specific. Audit needed:

- **DD-49 (identifier mapping)** — affects how `is-empty?`,
  `swap-cell!`, etc. map to JS. Probably needs a section in Ch 3
  `5-camelcase.md` or in Ch 7 (Functions). Book currently
  pre-dates DD-49.
- **DD-50 (position-aware compilation)** — affects Ch 6
  `5-conditional.md` (the `?` form), Ch 9 `1-conditionals.md`
  (the `if` form), and introduces the `do` form (not in the
  current book at all).
- **DD-50.5 / DD-50.6** — refinements; absorbed into the DD-50
  chapters.
- **DD-51 (deno-native tool boundaries)** — Ch 30 (CLI),
  Ch 16 (Modules). Already partly addressed in lang guides;
  book needs alignment.
- **Lykn-fronted toolchain (Principle 1)** — pervasive. All
  chapters that mention raw `deno publish` / `npm publish` /
  `deno test` need `lykn`-fronted phrasing. (Drift sweep:
  `grep -rln "deno publish\|npm publish" src/` returned 0 hits
  at time of writing — needs verification.)
- **Lykn CLI safety gates** — should appear somewhere in Ch 30 or
  Ch 31; current book likely silent on this.

## Why this is a 6–8 iteration thread

The book is substantially larger than any single guide. Realistic
breakdown:

- **Iter 1 (drift audit):** systematic catalog of every chapter
  touching anything from 0.6.0 changes, plus the writer's-guide
  drift. Output: a `book-drift-inventory-0.6.0.md` analogous to
  lang's `workbench/M2-guide-drift-inventory.md`. Tag each item
  Bucket 0, 1, 2, or 3.
- **Iter 2 (Bucket 0 reconciliation):** writer's guide stale paths,
  DD-range claim, compiler-architecture description verification.
  This MUST land before any chapter-prompt writing — the authoring
  guide is the standing reference.
- **Iter 3 (Bucket 1 reconciliation):** Ch 30, Ch 31, preface /
  Ch 0 Biome scrub. Lands now; doesn't wait on threads.
- **Iter 4 (Bucket 3 reconciliation):** DD-49 + DD-50 language-
  level changes that have already landed in lang. Ch 3, Ch 6,
  Ch 7, Ch 9 mainly. **Run `test/book/` tests after each chapter
  edit** — compiler-output changes from DD-49/50 will be caught
  here automatically.
- **Iter 5 (Thread 3 fold):** Ch 30 `5-project-structure.md`,
  Ch 31, Ch 28.
- **Iter 6 (Thread 1 fold):** Ch 5, Ch 16, Ch 30 `4-lykn-cli.md`,
  possibly Ch 33 macro authoring.
- **Iter 7 (Thread 2 fold):** Ch 29, Ch 32–33.
- **Iter 8 (Thread 4 fold + final voice pass):** Ch 30, Ch 33;
  then a voice-consistency sweep across the whole book against the
  Scholarly Shenanigans rubric.

Iters 2–4 can run in parallel with the language threads; iters 5–8
gate on those threads closing. **Iter 1 (audit) is the first
move; Iter 2 (writer's-guide reconciliation) blocks all subsequent
chapter-prompt writing.**

## Open design questions

The book thread has its own DD-style decisions. Answer in Iter 1
before the audit produces edits.

**Q1: Versioning the book?**

The book has no `version` field in `book.toml`. Options:
- (A) Pin to lykn 0.6.0; bump in lockstep going forward.
- (B) Leave unversioned; describe the language at the latest
  stable version, update narratively.
- (C) Add a "this book covers lykn X.Y" preface and update at each
  minor release.

**Q2: Voice consistency mechanism?**

Monty Python references are intentional but easy to drift. Options:
- (A) Style-guide doc in the book repo (analogous to SKILL.md but
  for prose conventions).
- (B) Inline guidance in each chapter README.
- (C) Trust the author; rely on CDC review of CC's edits.

**Q3: `AGENTS.md` in the book repo, given `authoring-guide.md`
already exists?**

`lykn-writers-guide/authoring-guide.md` already functions as the
book repo's canonical conventions doc — it covers voice,
structure, source material, code testing, accuracy requirements.
But it lives in a *separate* repo (`lykn-writers-guide`, not the
book repo itself), and doesn't follow `AGENTS.md` naming
convention that CC's tool ecosystem discovers automatically.
Options:
- (A) Symlink or copy `authoring-guide.md` into the book repo as
  `AGENTS.md` (or vice versa). Discovery + single source of truth.
- (B) Add a thin `AGENTS.md` to the book repo that points at the
  authoring guide.
- (C) Leave as-is; rely on kickoff prompts to direct CC to the
  authoring guide explicitly.

(B) is probably right — discoverability for CC + one canonical
location for the prose conventions.

**Q4: Iteration cadence for Bucket 2?**

Bucket 1 can land in a single iteration; Bucket 2 is gated on
threads. What's the right granularity for Bucket 2 — one iter per
thread, or one iter per chapter cluster?

**Q5: Cross-repo verification pattern?**

When CC writes book prose claiming "lykn does X", how is X
verified? Options:
- (A) CC reads the relevant lang repo file (e.g.,
  `~/lab/lykn/lang/docs/guides/...`) as part of the task.
- (B) Quote the canonical source explicitly in the book (with
  link/citation).
- (C) CDC review responsibility — book prose is "what lykn looks
  like to a human"; lang repo is "what lykn actually does"; CDC
  catches drift.

**Q6: EPUB / HTML output drift?**

The book builds both HTML and EPUB. EPUB has a known mdbook-epub
v0.5.2 image-path bug worked around in `book.toml`. Any other
output-specific concerns to track for 0.6.0?

## Suggested opening moves

1. **Read `lykn-writers-guide/authoring-guide.md`** end-to-end.
   This is the canonical voice + structure + testing rubric for
   the book. It IS the standing instructions file — every
   chapter prompt references it.
2. **Read `lykn-writers-guide/new-ch-prompt.md`** for the
   chapter-bootstrap template, and `planned-toc.md` for the v2 ToC
   with concept-card mapping.
3. **Read lang's `assets/ai/SKILL.md`** end-to-end. Ground truth
   for what lykn looks like in 0.6.0.
4. **Read lang's `docs/philosophy.md`** — 0.6.0 commitments
   section.
5. **Read lang's `workbench/phase-2-plan.md`** — milestone list +
   status.
6. **Read lang's `project01-mvp/arc18-guide-alignment/artifacts/dev/0017-guide-drift-cleanup-plan.md`** —
   especially the "Per-thread guide drift" section (this book
   thread mirrors that structure for book chapters).
7. **Read the book's `src/SUMMARY.md`** for the full chapter list.
8. **Read `src/preface/README.md`** and `src/part0/chapter0/` for
   voice calibration. Note that what you're calibrating to is
   *Scholarly Shenanigans* (Pratchett-dominant), not pure Python.
9. **Run drift sweeps** against the book and the writer's guide:

   ```sh
   # Book repo
   cd ~/lab/cnbb/lykn
   grep -rln Biome src/
   grep -rln "deno publish\|npm publish" src/
   grep -rln "deno test\|deno run --" src/
   grep -rln ESLint src/
   grep -rln "version 0\." src/

   # Writer's guide repo
   cd ~/lab/cnbb/lykn-writers-guide
   grep -n "lab/oxur" *.md          # stale lang path
   grep -n "DD-1[5-9]\|DD-2[01]" *.md   # stale DD range
   ```

10. **Verify book code-example tests pass against current lang
    HEAD** before writing any prose:

    ```sh
    cd ~/lab/cnbb/lykn
    deno test test/book/
    ```

    Failures here are 0.6.0 compiler-output drift Iter 4 will need
    to address. Catalog them; don't fix them yet.
11. **Draft Iter 1's audit ledger** — `book-drift-inventory-0.6.0.md`
    in lang's `workbench/` (lang workbench is gitignored; book
    repo has no workbench dir yet — that's Q3-adjacent).
12. **Discuss Q1–Q6 with Duncan** before committing the iteration
    plan.

## Related work that should NOT be in scope

- **Language changes** — book is downstream, not upstream. If the
  audit surfaces "this would be cleaner if lykn did X", that's a
  finding for the lang repo, not a book edit. File it as a
  cross-reference back to whichever thread owns the upstream
  change.
- **Repository tooling changes** (mdbook plugins, fonts, CI) —
  unless 0.6.0 specifically requires them.
- **Re-translation / locale work** — not in 0.6.0 scope.
- **Cover art / illustrations** — separate craft.
- **Chapter restructuring** — voice/structure changes that aren't
  driven by 0.6.0 are out of scope; this thread is about
  alignment, not redesign.

## Constraints and conventions

- **Per lang AGENTS.md "Lykn CLI safety gates":** book prose must
  not document `--allow-dirty` / `--force` / `--no-verify` etc. as
  recommended workflows. The book reflects the safety-gated
  defaults.
- **MUST framing for CC prompts** — same as lang threads.
- **Closing report pattern** — same as lang threads (see
  `workbench/2026-05-10-M7-closing-report.md` in lang).
- **Voice preservation — Scholarly Shenanigans.** Per
  `lykn-writers-guide/authoring-guide.md`, the voice is
  Pratchett 50% / Adams 20% / Wodehouse 20% / Monty Python 10%.
  Python is the *structural* layer (sketch-as-opening, not
  dominant prose register). CC prompts MUST cite the authoring
  guide's voice section and reproduce the "what it is / what it is
  NOT" rubric. A flat literal edit that strips voice from a
  `0-opening.md` or `N-closing.md` is a regression. A "punching up"
  edit that overcompensates with internet-humour or random
  zaniness is also a regression — Pratchett is never random.
- **Cross-repo paths in prompts** — always specify which repo a
  file lives in. CC defaults to the lang repo working directory;
  book edits require explicit `~/lab/cnbb/lykn/` paths; writer's-
  guide edits require explicit `~/lab/cnbb/lykn-writers-guide/`
  paths.
- **Dual-compiler test gate.** Every chapter edit that touches a
  ` ```lisp ` or ` ```javascript ` block MUST be followed by
  `deno test test/book/chN/` for the affected chapter, against
  both compilers (per authoring guide "Dual-compiler testing").
  CC prompts MUST include this as a verification step. A passing
  book test is the ground truth for whether the example still
  reflects what the compiler actually produces.
- **No version pin in `book.toml`** currently — confirm with Duncan
  whether to add one (Q1).
- **Capitalize "Lykn"** as a proper noun in prose. Use `lykn`
  (lowercase) only in code contexts and the package name.
- **Code block language tags** — `lisp` for lykn source,
  `javascript` for compiled output, `scheme` for Scheme examples.

## How to start

1. Read the writer's-guide trio (`authoring-guide.md`,
   `new-ch-prompt.md`, `planned-toc.md`) first — voice and
   conventions calibration.
2. Read the SKILL anti-patterns table + book's SUMMARY.md +
   book's preface for current-state calibration.
3. Run the drift sweep greps above (both book and writer's-guide
   repos).
4. Run `deno test test/book/` to baseline current example-test
   state against current lang HEAD.
5. Draft Iter 1's audit ledger — `book-drift-inventory-0.6.0.md`
   in lang's `workbench/`. Tag items by bucket (0/1/2/3).
6. Answer Q1–Q6 with proposed defaults.
7. Discuss with Duncan, fold his calls, send Iter 2 prompt to CC
   (Bucket 0 — writer's guide reconciliation) first.

This is downstream-of-everything work. Expect calendar time of
several weeks once Buckets 0–1 are unblocked, plus 1–2 weeks of
book polish gated on threads 1–4 closing. Final pass aligns with
the 0.6.0 release.

Good luck.
