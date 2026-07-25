# Book Drift Inventory — 0.6.0

**Drafted:** 2026-05-10
**Owner:** Duncan (with the lykn-book-0.6.0-update thread as the
  working session)
**Author:** CDC (Cowork Claude), Iter 1 of the lykn-book-0.6.0-update
  thread
**Purpose:** catalog every drift item that the book (`~/lab/cnbb/lykn`)
  and the writer's guide (`~/lab/cnbb/lykn-writers-guide`) carry against
  lykn 0.6.0-era ground truth (`~/lab/lykn/lang`), bucketed by
  dependency on remaining Phase 2 threads.
**Format precedent:** `workbench/M2-guide-drift-inventory.md` (lang),
  with the per-row Status column improvement from the methodology
  notes in `workbench/phase-2-plan.md` §Methodology improvements.
**Status:** open

---

## Bucketing scheme

| Bucket | Meaning | Iteration |
|--------|---------|-----------|
| 0 | Writer's-guide and book-infrastructure drift; blocks chapter-prompt writing | Iter 2 |
| 1 | Already-stale-against-current-0.5.x state; tackleable now | Iter 3 |
| 2 | Per-thread folds; gated on Phase 2 threads closing | Iter 5–8 |
| 3 | Language-level changes from M5–M9 already landed in lang | Iter 4 |

Per-row Status values: `open` / `in-progress` / `done` / `deferred`
/ `no-op`. Inventory is a planning snapshot; the truth-tracking
mechanism is the per-iteration ledger (modeled on lang's M-NN
closing reports).

---

## Decisions baked in from the kickoff conversation (2026-05-10)

Items confirmed with Duncan during Iter 1 conversation, recorded
here so subsequent iters and CC prompts can reference them as
settled rather than as open questions.

### Q1 — Book versioning + multi-edition preservation: **DECIDED**

The book preserves every released edition as a parallel, frozen
tree. Architecture:

- **URL structure:** `book.lykn.pl/v0.5/`, `book.lykn.pl/v0.6/`,
  etc. Each version is its own permanent URL tree. Root
  `book.lykn.pl/index.html` is a CI-generated HTML meta-refresh
  pointing at the latest version. No "current" alias, no
  duplicated root copy — permanent URLs are an invariant.
- **Hosting:** GitHub Pages at `cnbbooks.github.io/lykn/` today;
  CNAME to `book.lykn.pl` planned.
- **Version cadence:** book version tracks lykn's *minor* version
  (0.5 → 0.6 → 0.7). Patch versions of lykn don't warrant a new
  book edition; the book's "version" is "lykn 0.6.x".
- **Git tags:** `book-v0.5.0`, `book-v0.6.0`, etc. on the book
  repo. CI builds each tag into the corresponding URL subtree.
- **Per-edition test pinning:** when `test/book/` exists (see
  inventory item B0-G), each tagged edition's tests run against
  that edition's lykn release. Old editions petrify deliberately;
  they don't bit-rot.
- **In-book navigation:** "Book Versions" entry in the ToC (near
  Feedback), pointing at a page that lists every edition with
  release dates, "you are reading" highlighting (build-time
  templated), and links to GitHub Releases for each edition's
  downloadable artifacts.
- **Footer indicator:** every page footer shows "Lykn vX.Y
  edition · [Book Versions] · [Feedback]". Quiet, non-banner;
  answers "what version is this?" without competing with prose.
- **EPUB version indicator:** title page and copyright page of
  every edition's EPUB shows "Lykn · vX.Y edition" explicitly.
  Authoring discipline, no infra.
- **No cross-version canonical:** older editions do NOT add
  `<link rel="canonical">` pointing at the current edition. Each
  version is its own canonical document. Search engines rank
  independently.

### Q1.1 — Images across editions: **DECIDED**

Vidís' art is shared across all editions — single canonical
location, slug-named, full-resolution preserved. The book is "a
secret coffee table book for Vidís' art" alongside its technical
content; preserving the art at full resolution is non-negotiable.

- **Single canonical path:** `src/images/` shared across all
  editions. One copy, served from one URL, no per-edition
  duplication.
- **Slug-naming, not chapter-numbering:** rename `ch4.png` →
  `ch-bindings.png` (and `dssrt1.png` → name-by-piece) *before*
  0.6 chapter renumbering happens. Decouples image filenames
  from chapter ordering, which otherwise breaks across editions.
- **Full-resolution preservation:** the existing ~2.5–2.9 MB
  chapter PNGs and the 5.7 MB `cover-large.png` stay at full
  resolution in source. Git LFS as the storage-cost mitigation
  if/when repo size gets uncomfortable (~1 GB).
- **Mermaid for future technical diagrams:** when 0.6+ adds
  compiler-architecture illustrations (pipeline, position-aware
  compilation, identifier-mapping decision tree), use mermaid
  inline in markdown. Mermaid renders per-edition free; doesn't
  compete with Vidís' art (different `src/images/` vs inline
  mermaid).
- **Escape hatch (noted, not built):** if an edition ever needs
  to lock a piece pixel-for-pixel against future art revisions,
  copy that one image into `src/images/v0.5/foo.png` and adjust
  that edition's markdown. Not designed for; not needed yet.

### Q3 — `CLAUDE.md` in the book repo: **DECIDED — Option B**

Add a thin `CLAUDE.md` to the book repo (`~/lab/cnbb/lykn/`) that
points at `~/lab/cnbb/lykn-writers-guide/authoring-guide.md` as the
canonical conventions doc. The writer's guide lives in its own repo
(separate from the book repo for cross-book reuse); CLAUDE.md
preserves CC tool ecosystem auto-discovery.

`new-ch-prompt.md` stays in the writer's-guide repo as the
chapter-bootstrap template, referenced from `CLAUDE.md`.

### Q4 — Bucket 2 iteration granularity: **DECIDED**

One Iter per Phase 2 thread, not per chapter cluster. Each Iter's
ledger lists every chapter it touches. Cleaner change-management;
matches lang's per-milestone closing-report pattern.

### Q5 — Cross-repo verification: **DECIDED — Option A + Option C hybrid**

CC reads the relevant lang repo file (e.g., `docs/guides/...` or
`assets/ai/SKILL.md`) as part of any task that asserts lykn
behavior — Option A. CDC review remains the catch-net — Option C.
Explicit citation in the book (Option B) is reserved for cases
where the reader benefits from knowing where a rule came from
(DDs, philosophy decisions); not a default.

### Q2 — Voice consistency: **DECIDED — Option C as default**

Trust the author and CC; rely on CDC review of CC's edits with
the authoring guide's voice section as the rubric. No new
style-guide doc beyond the authoring guide. Voice drift will
surface during CDC review (Iter 8 includes a whole-book voice
sweep against the Scholarly Shenanigans rubric).

### Q6 — EPUB/HTML output drift: **DEFERRED to Bucket 1 audit**

The mdbook-epub v0.5.2 image-path workaround is documented in
`book.toml` (lines 17–28). No other output-specific concerns
identified during Iter 1. If Iter 3 (Bucket 1) surfaces other
output-rendering issues, they fold in there.

---

## Bucket 0 — Writer's-guide and book-infrastructure drift

These items must land in Iter 2 *before* any chapter-prompt
writing for 0.6.0 begins. The writer's guide is the standing
instruction file every chapter prompt references; chapter prompts
written against drifted instructions reproduce the drift.

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B0-A | `authoring-guide.md:284,289` | Stale lang path `~/lab/oxur/lykn/` (2 occurrences) | Replace with `~/lab/lykn/lang/`; verify every sub-path (README, `docs/dev/research/`, `docs/design/06-final/`, `examples/surface/`, `workbench/conversation-bootstrap-v6.md`) | open |
| B0-B | `new-ch-prompt.md:31-33,47-49` | Stale lang path `~/lab/oxur/lykn/` (6 occurrences) | Same as B0-A; replace all 6 and verify sub-paths | open |
| B0-C | `authoring-guide.md:557` | Stale DD range claim: "All Lykn syntax examples must be valid surface syntax per DD-15 through DD-21." Current range is DD-15 through DD-51+ | Replace with "per the current `assets/ai/SKILL.md` and `docs/guides/00-lykn-surface-forms.md`" — point at moving ground truth rather than freezing the range | open |
| B0-D | `authoring-guide.md:354,490` | Test-import path `../../src/index.js` — JS compiler is now at `packages/lang/` per lang `CLAUDE.md` | Verify against `project.json` imports map; replace with the correct import (likely `jsr:@lykn/lang` or workspace-relative) | open |
| B0-E | `authoring-guide.md:456,459,462` | Raw `deno test test/book/` invocations in "Running the tests" section — Principle 1 violation | Replace with `lykn test test/book/` etc. Both prose and example shell commands. | open |
| B0-F | `new-ch-prompt.md:37-43` | Compiler-architecture description: "Codegen is pure Rust (no astring, no ESTree). A separate JS compiler exists for the browser bundle only." Description of JS compiler's role may be outdated — JS compiler is the Deno-accessible pipeline, not browser-only. May shift further if Thread 2 (DD-36/37) lands. | Verify against current `packages/lang/` and lang `CLAUDE.md`; rewrite to match current state. Add an "as of lykn 0.6.0" qualifier so it doesn't drift again. | open |
| B0-G | `~/lab/cnbb/lykn/test/book/` | **Missing.** Writer's guide §"Code example verification" treats the test suite as load-bearing ("All code examples must have corresponding tests in `test/book/`", "Every chapter edit that touches a ```lisp or ```javascript block MUST be followed by `deno test test/book/chN/`"). Directory does not exist; zero `.test.js` files in the book repo. The "dual-compiler test gate that catches 0.6.0 compiler-output drift automatically" — the kickoff's structural verification mechanism for Iter 4 — has no implementation. | **Three options. CDC recommends Option 1 (carve out before Iter 4).** Option 1: dedicated mini-iter between Iter 3 and Iter 4 to bootstrap `test/book/` with at least minimal coverage of each chapter's `lisp` blocks against both compilers, then Iter 4 onward enforces the gate. Option 2: do Iter 4 (Bucket 3 reconciliation) without the test gate, accept human review as the verifier, and bootstrap tests later. Option 3: reduce the writer's guide's claim from MUST to SHOULD until the suite exists. Decision needed before Iter 2 closes. | open |
| B0-H | `~/lab/cnbb/lykn/CLAUDE.md` | **Missing.** No `CLAUDE.md` exists in the book repo. CC's tool ecosystem discovers project conventions via `CLAUDE.md`. Authoring guide lives in a separate repo (`lykn-writers-guide`). | Add thin `CLAUDE.md` to book repo per decided Q3 (Option B). Single doc, points at writer's-guide canonical paths, lists the standing voice rule, the per-edition versioning model (see Q1 decisions), and the test-gate rule (see B0-G). | open |
| B0-I | `planned-toc.md` (whole file) | Drift against actual book SUMMARY.md. planned-toc shows 37 chapters + 9 appendices (Part VI = Ch 27–29 Browser/Server/Tooling, Part VII = Ch 30–33 Compiler/Surface/Shim/BuildingLang, Part VIII = Ch 34–36 Projects); actual SUMMARY.md has 39 chapters, no appendices, Part VI = Ch 27–31 (Browser/Server/Testing/Tooling/CI-CD), Part VII = Ch 32–35 (Kernel/Surface/Shim/BuildingLang), Part VIII = Ch 36–38 (Projects). Also includes stale "DD-15 through DD-21" range claim (line 50). Concept-card counts in summary table reference planned-toc state, not current book state. | **CDC recommends "preserve planned-toc as historical v2 design snapshot; create new `planned-toc-v3.md` for current state."** Rationale: planned-toc was a forward-looking design doc, not a description of the book; reconciling it backward would lose its purpose as a record of the v2 design. v3 captures current ToC + 0.6.0 fold-ins. Alternative: reconcile planned-toc to current state and lose the v2 design history. Decision needed in Iter 2. | open |
| B0-J | `planned-toc.md:13` | Source counts line: "Biome (54)" still appears in the source-count summary. Biome was decommissioned in M2. | If B0-I picks "create v3, preserve v2", leave planned-toc-v2 as historical artifact; in planned-toc-v3, drop the Biome row and recompute totals. If B0-I picks "reconcile in place", drop the Biome row here. | open |
| B0-K | `authoring-guide.md` "Code blocks" §:80-81 | Currently specifies ` ```lisp ` for lykn source. **No change for 0.6.0** (decided per kickoff and per `MEMORY.md`'s `lykn_linguist_deferred` entry — GitHub Linguist submission deferred to 0.7.0+). | Add an explicit "Code block language tag" note: "Use ` ```lisp ` for lykn source through the 0.6.0 release. Revisit at 0.7.0 when the Linguist submission lands and ` ```lykn ` becomes a usable tag." Prevents future drift. | open |
| B0-L | `authoring-guide.md` (whole "Voice and tone" §) | No drift identified. The Scholarly Shenanigans rubric is current and applies to 0.6.0 unchanged. | No-op. Leave alone. | no-op |
| B0-M | `~/lab/cnbb/lykn/.gitignore` | Currently ignores `/workbench`. The lang repo has its own `workbench/` (gitignored too). If 0.6.0 iters produce book-repo workbench artifacts (per-iter closing reports), they'll be gitignored. | Decide: do book-repo iter closing reports live in the *book* repo's `workbench/` (gitignored, host-only), in the lang repo's `workbench/`, or in the writer's-guide repo? CDC recommends lang's `workbench/` for consistency with how this thread already documents itself (this inventory lives there). Confirm. | open |

### Bucket 0 — Iter 2 sequence recommendation

1. **B0-H first** — add the book repo's `CLAUDE.md` so CC sessions have local conventions discovery before any other work.
2. **B0-A, B0-B, B0-C, B0-D, B0-E, B0-F, B0-K** — mechanical writer's-guide reconciliation. Single CC session, single PR per repo.
3. **B0-I + B0-J** — planned-toc reconciliation. Same session if Option "reconcile in place" picked; separate session if Option "preserve v2, create v3" picked (more substantive authoring work).
4. **B0-G** — `test/book/` bootstrap is its own dedicated mini-iter ("Iter 3.5") between Bucket 1 and Bucket 3 work. Scope: write a small test framework for the book repo, generate one test file per chapter's `lisp` blocks via a transcription pass, run against both compilers, fix any failures *only* if they're book typos (compiler-output drift goes to Iter 4).
5. **B0-M** — clarify per-iter ledger location early so subsequent ledgers land in the right repo.

---

## Bucket 1 — Already-stale drift (not gated)

Drift that reflects 0.5.x-era reality that is already wrong. Can
land in Iter 3 without waiting for any Phase 2 thread to close.

### Biome scrub (9 files in book)

Drift sweep result (run 2026-05-10):

```
src/SUMMARY.md
src/preface/about-cover.md
src/preface/acknowledgments.md
src/part0/chapter0/4-why-lykn.md
src/part6/chapter30/3-eslint.md
src/part6/chapter30/2-biome.md
src/part6/chapter31/1-pipeline.md
src/part6/chapter31/3-github-actions.md
src/part6/chapter31/2-tasks.md
```

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B1-A | `src/part6/chapter30/2-biome.md` | Whole section dedicated to Biome. Biome decommissioned in lang M2 (commit `d8f85049`, 2026-04-29). | **Delete `2-biome.md`.** Remove from `SUMMARY.md`. Renumber subsequent Ch 30 files (`3-eslint.md` → `2-eslint.md`?) — *but see B1-B*, ESLint also gets re-scoped. | open |
| B1-B | `src/part6/chapter30/3-eslint.md` | Section on ESLint. Per philosophy doc §"No-Node boundary" table and lang `14-no-node-boundary.md`, ESLint is replaced by `deno lint` + `lykn lint` (M12). | **Re-scope.** Either (a) delete and merge any salvageable content into a new "Linting" section in `1-workflow.md`, or (b) rewrite as "Linting (and why you won't use ESLint)" — short section explaining the Deno-built-in + future `lykn lint` story. CDC recommends (a) for cleanliness. | open |
| B1-C | `src/SUMMARY.md` | Lists `2-biome.md` and `3-eslint.md` in Ch 30. | Remove both entries; renumber if Ch 30 is reshuffled per B1-A/B1-B outcomes. | open |
| B1-D | `src/part0/chapter0/4-why-lykn.md` | Passing reference to Biome (need verification — file not read in Iter 1). | Read, identify, replace with `deno lint` / `deno fmt` reference, or remove. | open |
| B1-E | `src/preface/about-cover.md`, `src/preface/acknowledgments.md` | Passing Biome references (need verification). | Same as B1-D. | open |
| B1-F | `src/part6/chapter31/{1-pipeline.md,2-tasks.md,3-github-actions.md}` | Biome in CI/CD workflow examples. | Replace Biome steps with `deno lint` / `deno fmt` (or `lykn lint` for source, once M12 lands — but that's Bucket 2 fold). For Iter 3, replace with the M2-correct toolchain (deno builtins on compiled output). M12 fold updates these again later. | open |

### ESLint scrub (7 files in book)

Same set as Biome plus `part3/chapter13/5-nil-safe.md`,
`part2/chapter5/4-equality.md`, `part7/chapter32/4-estree.md`. The
chapter-30 and SUMMARY hits are covered by B1-A/B/C. Remaining:

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B1-G | `src/part3/chapter13/5-nil-safe.md` | ESLint reference in nil-safe-threading context. Need verification of how it's used. | Verify; replace with `deno lint` reference or remove if the reference was about ESLint's `no-optional-chaining` style rules. | open |
| B1-H | `src/part2/chapter5/4-equality.md` | ESLint reference in equality-discussion context. | Verify; same treatment. | open |
| B1-I | `src/part7/chapter32/4-estree.md` | ESLint in ESTree-architecture context. Likely a historical reference (ESLint uses ESTree-compatible AST). | If historical/reference, keep — that's a true statement about JS tooling history. Verify framing is not prescriptive. | open |

### `deno test` / `deno run` raw invocations (6 files in book)

Sweep results:

```
src/part6/chapter28/3-file-system.md:36
src/part6/chapter28/1-why-deno.md:9,25
src/part6/chapter29/7-running-tests.md:43
src/part6/chapter29/1-philosophy.md:11
src/part6/chapter31/5-deployment.md:24
src/part6/chapter31/2-tasks.md:17
```

Per Principle 1 (`lykn`-only tooling), raw `deno` invocations are
drift *when instructional*. Descriptive uses (explaining what
`lykn test` wraps, comparing to Deno) are fine.

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B1-J | `src/part6/chapter28/1-why-deno.md:9,25` | "Why Deno?" chapter introduces Deno permissions via `deno run --allow-net app.js` etc. These are *descriptive* — teaching Deno's permission model. | **Keep.** This chapter is teaching Deno itself (the runtime lykn targets). The whole point is to explain Deno's model. Adding "and `lykn run` wraps this for you" as a callback in this chapter is appropriate, but the raw invocations are correct teaching here. | no-op |
| B1-K | `src/part6/chapter28/3-file-system.md:36` | `deno run --allow-read=config.json --allow-write=output.txt app.js` in a file-system example. Need verification — is this teaching Deno's permission model (descriptive) or recommending a workflow (instructional)? | Read, judge. If descriptive (extending B1-J's teaching), keep. If instructional ("here's how to run your app"), replace with `lykn run ...` | open |
| B1-L | `src/part6/chapter29/7-running-tests.md:43` | "Everything else passes through to `deno test`. Filtering, reporters, coverage..." — descriptive of what `lykn test` wraps. | **Keep.** Correct framing. | no-op |
| B1-M | `src/part6/chapter29/1-philosophy.md:11` | "Invoke `deno test` on the compiled output" — listed as a numbered step in the testing philosophy. Likely instructional. | **Reconcile.** Replace with "Invoke `lykn test` (which runs `deno test` on the compiled output internally)." Or rewrite the philosophy as `lykn test`-fronted. | open |
| B1-N | `src/part6/chapter31/5-deployment.md:24` | `deno run --allow-net --allow-read dist/shortn.js` — deployment example for the shortn HTTP server project. Instructional. | **Reconcile.** Replace with `lykn run dist/shortn.js` (verify lykn run accepts flags pass-through for permissions). Or, if deployment specifically means "running compiled output without lykn installed on the production host", document that as an explicit fall-back path — but then frame it that way: "in production, where lykn is not installed, you can deno-run the compiled output directly." | open |
| B1-O | `src/part6/chapter31/2-tasks.md:17` | `"dev": "deno task compile && deno run --allow-all dist/app.js"` in a deno.json task example. Plus the entire `deno task` model is pre-Principle-1. | **Reconcile.** Replace with a `lykn`-fronted task structure, or — if the chapter is teaching `deno task` as an underlying mechanism — keep with explicit framing as "what `lykn` wraps." `--allow-all` in dev is a flag CDC would want to push back on; replace with explicit permissions per Principle 2 of CLAUDE.md. | open |

### Other Bucket 1 items

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B1-P | `src/part6/chapter30/0-opening.md` | Likely Biome reference in opening (file in sweep result). | Read, replace. | open |
| B1-Q | `src/part6/chapter30/4-lykn-cli.md` | Predates M5 toolchain bootstrap fixes (M5 closed 2026-04-30) and M9 (V-08 import-macros fix, shipped 0.5.2). Likely needs M5-era updates to `lykn test`, `lykn build --dist`, `lykn publish` descriptions. | Audit against `15-lykn-cli.md` (lang) and SKILL.md "Workflows" section. Bring up to M5-M9 reality. Forward-looking notes (M11, M12, M13) are Bucket 2 folds. | open |
| B1-R | `src/part6/chapter30/5-project-structure.md` | Project structure section. **Will be revised by Thread 3 (M11)** for `target/lykn/build/` and `target/lykn/dist/` paths. Iter 3 work: bring to current 0.5.x state if drifted; Iter 5 work (Bucket 2): fold M11 changes. | Iter 3: verify against current `lykn new` scaffold output. Iter 5: M11 fold. | open |

---

## Bucket 2 — Per-thread folds

These items wait on the corresponding Phase 2 thread closing.
Listed mirror-style to lang's `docs/dev/0017-guide-drift-cleanup-plan.md`
§"Per-thread guide drift".

### After Thread 3 (M11 build-dir reorg + M13 publish dirty-check)

| ID | File | Drift expected | Iteration | Status |
|----|------|----------------|-----------|--------|
| B2-A | `src/part6/chapter30/5-project-structure.md` | `target/lykn/build/` and `target/lykn/dist/` paths replace `dist/` / `bin/`. Update directory tree examples. | Iter 5 | open |
| B2-B | `src/part6/chapter31/1-pipeline.md` | Build output references in CI pipeline. | Iter 5 | open |
| B2-C | `src/part6/chapter31/5-deployment.md` | Build output paths in deployment examples. Combines with B1-N work. | Iter 5 | open |
| B2-D | `src/part6/chapter28/{1-why-deno.md,...}` | If 0.5.x Deno-specific publish flow changes with M11/M13, update Ch 28 references. Verify post-M11. | Iter 5 | open |
| B2-E | `src/part6/chapter31/1-pipeline.md`, `5-deployment.md` | Publish dirty-check gate (M13) — `lykn publish` fails on uncommitted changes; document the gate and the explicit `--allow-dirty` opt-out. | Iter 5 | open |

### After Thread 1 (M10 .d.ts + surface-macros gap + mycelium)

| ID | File | Drift expected | Iteration | Status |
|----|------|----------------|-----------|--------|
| B2-F | `src/part2/chapter5/{0-opening.md,...}` | New section "Lykn for TypeScript Consumers" — `.d.ts` artifacts generated from `:type` annotations and `func`/`fn` signatures. Bridge between surface-type-keywords and TS interfaces. | Iter 6 | open |
| B2-G | `src/part3/chapter16/{2-import.md,3-export.md,...}` | DD-51 `lykn add` documentation; deno-native tool boundaries; `.d.ts` artifacts in `dist/`; consuming Lykn packages from TS projects. | Iter 6 | open |
| B2-H | `src/part6/chapter30/4-lykn-cli.md` | `lykn add` subcommand documentation once it lands. | Iter 6 | open |
| B2-I | New section, Ch 33 or Ch 26 | Macro authoring patterns if the surface-macros JS-loading gap closes in Thread 1. Possibly a new ` ###` subsection on user-defined macros via Deno subprocess. | Iter 6, conditional on Thread 1 outcome | deferred |

### After Thread 2 (compiler architecture coherence)

| ID | File | Drift expected | Iteration | Status |
|----|------|----------------|-----------|--------|
| B2-J | `src/part7/chapter32/6-form-vocabulary.md` | DD-50 position-aware compilation callout — kernel `if` and `do` forms compile differently based on position. | Iter 7 | open |
| B2-K | `src/part7/chapter33/{0-opening.md,...}` (whole chapter) | DD-36/37 outcome may rewrite this chapter substantively. V-06 decision affects `6-parallel-compiler.md` — if Option A (build JS analyzer for symmetric warnings), parallel compiler section grows; if Option B (document divergence), section explains the gap. | Iter 7 | open |
| B2-L | `src/part6/chapter29/{5-test-compiles.md,...}` | `compileBoth` pattern as recommended for cross-compiler verification (per `lang/workbench/0017` Thread 2 fold list). | Iter 7 | open |
| B2-M | Various | Error-format alignment — if DD-49 Rule 7 refinement-log entry shifts type-check message format, audit all chapters showing error messages. | Iter 7 | open |

### After Thread 4 (M12 lykn-source linter)

| ID | File | Drift expected | Iteration | Status |
|----|------|----------------|-----------|--------|
| B2-N | `src/part6/chapter30/{1-workflow.md,4-lykn-cli.md,...}` | New section on `lykn lint` source linter. Naming TBD per Thread 4's name-collision resolution. | Iter 8 | open |
| B2-O | `src/part7/chapter33/{1-architecture.md,...}` | Linter as part of the compiler architecture story — DD-12-flavoured. | Iter 8 | open |
| B2-P | Cross-references | From Ch 9 (Control Flow) or Ch 10 (Pattern Matching) to lint rules that catch related anti-patterns (e.g., DD-50 Rule 5 enforcement). | Iter 8 | open |

---

## Bucket 3 — Language-level changes already landed (M5–M9)

These reflect lang work that's already landed and is therefore
already correct ground truth. Iter 4 reconciles the book.

### DD-49 — identifier mapping (lang `docs/design/05-active/0049-identifier-mapping-lykn-js.md`)

Affects how lisp-case → camelCase conversion works in detail.
Current book Ch 3/5 `5-camelcase.md` describes only the simple
hyphen-to-camelCase rule and promises the full table in "Appendix
B." Appendix B does not exist.

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B3-A | `src/part1/chapter3/5-camelcase.md` | Missing: predicate-prefix detection (`is-`/`has-`/`can-`/`should-`/`will-`/`does-`/`was-`/`had-` skip the `is-` prepend), embedded-punctuation abbreviations (`?` → `QMARK`, `!` → `BANG`, `*` → `STAR`, etc.), multi-char arrow mappings (`->` → `To`, `<-` → `From`), macro-name overrides (`->` and `->>` as language primitives map to `threadFirst`/`threadLast`), `$` passthrough note. | Add new `###` subsections per category. Cite DD-49 explicitly. Keep the simple-rule subsection at the top — most readers hit only the simple case. Push the full abbreviation table to a sidebar or note that there *is* a full reference (no Appendix B yet — see B3-B). | open |
| B3-B | Appendix B reference | `5-camelcase.md` says "The full conversion table — with rules for consecutive hyphens, trailing hyphens, and private-field prefixes — lives in Appendix B." No Appendix B exists. | **Two options.** Option 1: build Appendix B as the full DD-49 reference (matches planned-toc-v2's Appendix C ambition). Option 2: drop the Appendix B reference; cite SKILL.md `assets/ai/SKILL.md` §"Identifier Mapping Details (DD-49)" as the canonical reference and link to lang repo. CDC recommends Option 2 for now — appendices are a separate workstream (planned-toc-v2 has 9 appendices, none yet built). Appendix B can be a Phase 3 deliverable. | open |
| B3-C | `src/part2/chapter7/{1-func.md,...}` | Function-naming examples may need DD-49 awareness. E.g., `is-empty?` as a `func` name should be discussed with the predicate-prefix rule. | Audit Ch 7 for any `?`-suffix or punctuation-bearing names in examples; cross-reference Ch 3/5. | open |

### DD-50 / DD-50.5 / DD-50.6 — position-aware compilation (lang `0050-position-aware-compilation-of-conditional-and-block-forms.md`)

Affects how `if`, `do`, and `?` compile based on whether they're
in expression or statement position. Introduces the `do` form.
Style guidance: prefer `?` for expression position, `if` for
statement position (DD-50 Rule 5).

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B3-D | `src/part2/chapter6/5-conditional.md` | Section on `?` (conditional expression) is largely correct but doesn't mention DD-50 Rule 5 explicitly or the position-aware compilation semantics. Currently frames `?` as "the ternary equivalent." | Update with DD-50 framing: `?` is the expression-position form; `if` is the statement-position form; both functionally equivalent but communicate intent. Brief callout (1 paragraph) on the position-aware behavior — full mechanics belong in Ch 32 (B2-J fold). | open |
| B3-E | `src/part2/chapter9/1-conditionals.md` | Section on `if` describes it as "a kernel form that maps directly to JavaScript's `if` statement" — pre-DD-50 framing. Now `if` is position-aware: expression position → ternary, statement position → block, no-else in expression position → compile error. | Update. Add new `###` subsection "`if` as expression vs statement" with examples of both compilation outputs. Show the no-else compile error case. Cite DD-50. | open |
| B3-F | `src/part2/chapter9/` (whole chapter) | Missing: the `do` form. DD-50 introduces `do` as a position-aware sequence of expressions (statement position → block, expression position → IIFE; distinct from `do-while`). No section exists. | Add new section `8-do-form.md` (or insert after `1-conditionals.md`). Show both compilation paths. Distinguish from `do-while`. Cite DD-50. Update `SUMMARY.md`. | open |
| B3-G | `src/part2/chapter6/{0-opening.md,...}` | Opening / closing voice references "ex-precedence table" — current; no DD-50 voice updates needed. | No-op. | no-op |

### DD-51 — deno-native tool boundaries (lang `0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md`)

Affects how lykn projects interact with `deno add` (banned),
`deno task` (acceptable), `deno cache` (acceptable), `lykn add`
(future). Affects Ch 16 (Modules) and Ch 30 (CLI).

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B3-H | `src/part3/chapter16/{2-import.md,3-export.md,5-alias-everywhere.md}` | Import / export examples may not reflect the `project.json`-vs-`deno.json` distinction (workspace imports vs per-package). DD-51 establishes the policy explicitly. | Audit for raw `deno add` mentions; add a `### Adding a dependency` subsection in `2-import.md` or `5-alias-everywhere.md` that frames the workflow as "edit `project.json` imports, Deno auto-caches" (per SKILL.md Principle 1 table). Note `lykn add` as future work. | open |
| B3-I | `src/part6/chapter30/4-lykn-cli.md` | `lykn add` is future work; current state is "manual edit `project.json`." Document the current state with a forward pointer. | Add subsection on dependency management; note `lykn add` is planned. | open |

### Other M5–M9 landings

| ID | File | Drift | Disposition | Status |
|----|------|-------|-------------|--------|
| B3-J | `src/part2/chapter4/1-bind.md` | **No drift.** Already documents DD-24 correctly — literal vs non-literal type annotations, compile-time vs runtime checks, `--strip-assertions`. | no-op | no-op |
| B3-K | `src/part2/chapter5/2-type-keywords.md` | Verify type-keyword list matches SKILL.md current list (`:number`, `:string`, `:boolean`, `:function`, `:object`, `:array`, `:symbol`, `:bigint`, `:any`, `:void`, `:promise`). Especially `:void` and `:promise` — were they in 0.5? | Audit, add any missing keywords with examples. | open |
| B3-L | `src/part2/chapter7/6-parameters.md` | DD-25 / DD-25.1: destructured params (`object`/`array` patterns in `:args`) with per-field type annotations, `(default :type name value)` for defaults, nested destructuring (`(alias :type name (object/array ...))`). | Verify coverage. Likely needs a new `###` subsection on destructured params with surface examples (idiomatic for named/keyword parameters, 3+ related params). Cite DD-25. | open |
| B3-M | `src/part3/chapter15/3-parameter-destructuring.md` | Same DD-25 / DD-25.1 territory; cross-reference Ch 7. | Verify coverage; cross-reference Ch 7 work in B3-L. | open |
| B3-N | `src/part4/chapter20/{2-class-syntax.md,3-fields-private.md}` | DD-27: surface forms expand inside class bodies (`bind`, `=`, `set!`, threading macros, `obj`). `assign` form for this-property assignment (class-body-only). | Verify coverage; add subsection on surface forms in class bodies if missing; document `assign` distinctly from `set!`. Cite DD-27. | open |
| B3-O | `src/part4/chapter21/{3-genfunc.md,4-genfn.md,5-async-generators.md}` | `:yields :type` for per-yield runtime checks on generators. Verify the book mentions this. | Audit. Add if missing. | open |
| B3-P | `src/part2/chapter5/4-equality.md`, `src/part3/chapter14/1-js-namespace.md` | `js:eq` for loose equality (the only way). SKILL.md is explicit: "Loose equality only via `(js:eq a b)`. Compiler-generated `== null` is an accepted exception." Verify book frames this correctly. | Audit. Adjust framing if drift. | open |
| B3-Q | Lykn-fronted toolchain (book-wide) | Pervasive Principle 1 application. Sweep run 2026-05-10 found 0 hits for raw `deno publish` / `npm publish` in book. Remaining `deno test` / `deno run` hits catalogued in Bucket 1 (B1-J through B1-O). | Verify post-Bucket-1 that no Principle-1-violating instructional invocations remain. | open |
| B3-R | `src/part6/chapter30/`, `src/part6/chapter31/` | Lykn CLI safety gates (`CLAUDE.md` "Lykn CLI safety gates" section in lang). Book should reflect the "no auto-pass `--allow-dirty` / `--force` / `--no-verify`" position. M13 lands the publish dirty-check; book documents the gate when M13 closes (Bucket 2, B2-E). | Iter 4: confirm Ch 30/31 don't currently *recommend* bypass flags. Iter 5 (B2-E): document the M13 gate. | open |

---

## Per-iter ledger references (forward-looking)

When each iter closes, its ledger updates this inventory's Status
column. Ledger files:

- `workbench/2026-MM-DD-book-iter-01-audit-closing-report.md` — this inventory's close.
- `workbench/2026-MM-DD-book-iter-02-bucket-0-closing-report.md` — Bucket 0 reconciliation.
- `workbench/2026-MM-DD-book-iter-03-bucket-1-closing-report.md` — Bucket 1 reconciliation.
- `workbench/2026-MM-DD-book-iter-03-5-test-bootstrap-closing-report.md` — `test/book/` bootstrap (per B0-G).
- `workbench/2026-MM-DD-book-iter-04-bucket-3-closing-report.md` — Bucket 3 (DD-49/50/51 + M5-M9 changes).
- `workbench/2026-MM-DD-book-iter-05-thread-3-fold-closing-report.md` — M11/M13 fold.
- `workbench/2026-MM-DD-book-iter-06-thread-1-fold-closing-report.md` — M10 fold.
- `workbench/2026-MM-DD-book-iter-07-thread-2-fold-closing-report.md` — Compiler architecture fold.
- `workbench/2026-MM-DD-book-iter-08-thread-4-fold-closing-report.md` — M12 lint fold.
- `workbench/2026-MM-DD-book-0-6-0-release-closing-report.md` — Book 0.6.0 cut + GH Pages deploy + book-v0.6.0 tag.

---

## Decisions still open (require Duncan input before Iter 2 hand-off)

| # | Question | CDC recommendation | Why CDC isn't deciding |
|---|----------|--------------------|-----------------------|
| D-1 | B0-G — `test/book/` bootstrap strategy. Option 1 (carve-out mini-iter), Option 2 (defer, accept human review), Option 3 (downgrade authoring-guide MUST to SHOULD). | Option 1. The kickoff's verification model depends on this gate. Building it once is a one-time cost; deferring means manual verification across every Bucket 3 chapter edit. | Methodology call. Duncan's bandwidth and the timing relative to the four open Phase 2 threads in lang determines whether the carve-out fits the schedule. |
| D-2 | B0-I — planned-toc reconciliation strategy. "Preserve v2, create v3" vs "reconcile in place." | Preserve v2, create v3. planned-toc-v2 is a record of the v2 design intent; that has historical value. v3 captures current ToC + concept-card recount + 0.6.0 fold-ins. | Same — methodology, not technical. v2's value as historical artifact is a judgment call. |
| D-3 | B0-M — book-repo iter closing reports location. Book repo's `workbench/` (host-only, gitignored), lang's `workbench/`, or writer's-guide repo? | Lang's `workbench/`. Consistency with how this inventory documents itself; book repo's `workbench/` is gitignored so it'd be host-only anyway. | Workflow preference. |
| D-4 | Bucket 3 ordering — is the test-bootstrap (B0-G) "Iter 3.5" between Iter 3 and Iter 4, or does it run *in parallel* with Iter 3? | Sequential (3 → 3.5 → 4). Parallel would mean two CC sessions in the book repo at once; the book repo doesn't yet have the version-trees infra, so isolation is harder. | Bandwidth call. |
| D-5 | Iter scope vs PR cadence — one iter = one PR, or multiple PRs per iter? Lang threads have used one closing report per milestone with possibly multiple PRs. | One PR per iter for the book; cleaner reviewability. Each iter's PR is reviewed by Duncan post-CC, merged, ledger lands at close. | Methodology call, matches lang's pattern. |

---

## Methodology notes for chapter prompts (forward-looking, Iter 2+)

When Iter 2's writer's-guide reconciliation lands, subsequent
chapter prompts must:

1. **Cite the authoring guide's voice section by anchor link** — the Scholarly Shenanigans rubric, including the "what it is NOT" list. Pratchett-dominant, never flat literal, never overcompensating zaniness.
2. **Cite the relevant SKILL.md section + DD doc** in `~/lab/lykn/lang` — establishes ground truth for the prompt's technical claims.
3. **Include the dual-compiler test gate as a verification step** — once B0-G's test bootstrap lands. Pre-bootstrap, the verification step is "run `lykn check` and `lykn compile` against every ` ```lisp ` block."
4. **Include the voice-preservation gate** — opening/closing voice MUST land in Pratchett-dominant register; CDC review catches under-voiced (flat literal) and over-voiced (random zaniness) regressions.
5. **Use MUST framing for safety-relevant items**, SHOULD/CONSIDER for style preferences. Same convention as lang prompts.
6. **Specify the repo for every path** — `~/lab/cnbb/lykn/` for book, `~/lab/cnbb/lykn-writers-guide/` for writer's guide, `~/lab/lykn/lang/` for lang. CC defaults to lang working directory; book edits require explicit repo path.

---

## References

- `~/lab/cnbb/lykn-writers-guide/authoring-guide.md` — voice + conventions (currently drifted; B0-A through B0-F target).
- `~/lab/cnbb/lykn-writers-guide/new-ch-prompt.md` — chapter-bootstrap template (drifted; B0-B, B0-F).
- `~/lab/cnbb/lykn-writers-guide/planned-toc.md` — v2 ToC (drifted vs SUMMARY; B0-I, B0-J).
- `~/lab/cnbb/lykn/src/SUMMARY.md` — current book ToC (39 chapters, no appendices).
- `~/lab/cnbb/lykn/book.toml` — mdbook config; no `version` field currently.
- `~/lab/cnbb/lykn/.gitignore` — currently excludes `/book`, `/.claude*`, `/workbench`.
- `~/lab/lykn/lang/assets/ai/SKILL.md` — ground truth for 0.6.0 surface syntax + toolchain.
- `~/lab/lykn/lang/docs/philosophy.md` — three principles; 0.6.0 commitments.
- `~/lab/lykn/lang/workbench/phase-2-plan.md` — milestone list.
- `~/lab/lykn/lang/docs/dev/0017-guide-drift-cleanup-plan.md` — lang guide drift cleanup (the inventory this thread mirrors).
- `~/lab/lykn/lang/docs/design/05-active/0049-identifier-mapping-lykn-js.md` — DD-49 (B3-A, B3-B, B3-C).
- `~/lab/lykn/lang/docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md` — DD-50/.5/.6 (B3-D, B3-E, B3-F).
- `~/lab/lykn/lang/docs/design/01-draft/0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md` — DD-51 (B3-H, B3-I).
- `~/lab/lykn/lang/workbench/M2-guide-drift-inventory.md` — methodology precedent for this inventory's format.
- `~/lab/lykn/lang/workbench/2026-05-10-M7-closing-report.md` — DD-49/50 fast-follow source.
