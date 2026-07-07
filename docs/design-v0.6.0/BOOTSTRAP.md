# Bootstrap — for the next CDC session on lykn 0.6.0

> You are **CDC** (Cowork Claude): the planning / review / verification seat in
> Duncan's collaboration framework. This doc bootstraps you into the current
> state of the lykn 0.6.0 effort so you can hit the ground running. Read it, then
> read `project-plan.md`, `README.md`, and open `status.html`.
>
> **The most valuable section here is [§7 Issues & learnings](#7-issues--learnings--the-workflow-evolution-log).** It is the record of what has gone wrong and what we changed because of it — the substance of our evolving workflow, and (per Duncan) of equal or greater value than the project assets themselves.

## 1. Who's who (the peer frame)

- **CDC** (you, in Cowork): plan, scope slices, write DDs/ledgers/CC-prompts,
  **verify** CC's work, keep the plan honest. You do **not** run the host
  toolchain (see §3).
- **CC** (Claude Code, separate sessions on Duncan's machine): implements — code,
  migrations, doctests. Runs the real build/test/lint. Reports back.
- **Duncan** (operator / methodology owner): makes design calls, handles `odm`
  promotion of DDs, does host git ops (commits, merges), relays CC↔CDC.

The loop: **CDC scopes → Duncan hands the prompt to CC → CC implements + reports →
CDC verifies + closes + bubbles up → CDC updates the plan docs.** Prompts to CC
use MUST framing with explicit verification checklists; CC is expected to
**self-stop and surface findings** rather than work around problems (this has
caught two real CDC errors — see §7).

## 2. The framework (read these first)

The house framework is the `collaboration-framework` skill. Load it and read, in
full, before planning or closing anything:
- `docs/PROJECT-MANAGEMENT.md` (v2.1) — scales of work (project → arc → slice →
  step), the canonical layout, the confirmation protocol, top-down planning +
  bottom-up bubble-up/close.
- `templates/LEDGER-DISCIPLINE.md` (v2.0) — grep-verifiable ledger rows,
  evidence strengths (`asserted < attested < reproduced < reconciled`), the
  closer-≠-verifier rule, the five-iteration cap, arc/project composition rows.

Also foundational: `docs/philosophy.md` (the three principles — source-only tree,
lykn-only tooling, compiler-owned output quality — plus the 0.6.0 commitments).

## 3. Substrate & environment (important gotchas)

- **Repo:** `~/lab/lykn/lang`. **Branch:** `release/0.6.x` (all 0.6.0 work).
- **Cowork sandbox has NO deno / cargo / rust toolchain.** You cannot run the
  runtime suites. Your verification is **git ancestry + code review + grep**;
  runtime rows are **CC-attested** and reconciled by an **operator host re-run**.
  Be explicit about which you did (reproduced-by-code vs attested-runtime).
- **`workbench/` is gitignored** — its files aren't tracked even when the tree
  looks clean. It's scratch (CC reports land there too).
- **Git in Cowork:** read-only from the main checkout is fine
  (`cd .../mnt/lang && git log …`). **Do NOT run git inside a worktree** from
  Cowork (path-encoding breaks). Host handles commits/merges/rebases.
- **Two compilers:** Rust (`crates/lykn-lang/`, the codegen `lykn compile` uses)
  and JS (`packages/lang/`, embedded per DD-54). Know which path a check exercises.
- **Verify commands** live in `Makefile` (`make check` = build+lint+test incl.
  `make test-docs`). `lykn test` runs the cross-compiler `compile-both` corpus.

## 4. Where everything lives

```
docs/design-v0.6.0/
  project-plan.md      ← arc roadmap + project ledger + Version History (READ FIRST)
  README.md            ← index + arc table + conventions
  status.html          ← standalone dashboard (edit its DATA object to update)
  BOOTSTRAP.md         ← this file
  _reconciliation-2026-06-29.md   ← the branch-ancestry audit
  arcNN-<slug>/
    arc-plan.md, closing-report.md
    sliceNN-<slug>/{slice-doc, ledger, cc-prompt, closing-report, cdc-verification}.md
docs/design/           ← odm-managed DDs (DD-58 = 05-active/0059-…; DD-60 = 05-active/0062-…
                         [CANONICAL — the arc13/design copy was retired 2026-07-06; amendments
                         land in 0062 only]; DD-61 still arc13/design-only, odm add pending;
                         Duncan owns odm)
docs/guides/           ← the guides (doctested; 09-anti-patterns.md seeds arc05)
```

Numbering convention (from 2026-06-30): **`NN` = creation order, not dependency
order.** Sequence is carried by each arc's Dependencies. Stop renumbering on
inserts.

## 5. Current state (2026-06-30)

- **Closed:** arc01 (build-publish), arc02 (type-dts), arc03 (compiler-coherence),
  arc04 (refactor-tooling — move-function + full surface extraction), arc08 (DD-55
  template i18n).
- **Open / partial:** arc06 (dep-ergonomics — slice01 closed), arc07 (docs —
  slice01 CI-green closed; broader drift audit pending), arc05 (linter — not
  started).
- **CLOSING:** **arc10 (compiler-completion)** — all 3 slices closed
  2026-06-30…07-05 (slice01 `faee8a1` Rust strict; slice02 `feb056c` JS
  parity; slice03 `2f6a84d` `_kernel`→WeakSet registry + A-6 macro-boundary
  enforcement [operator-decided Rust semantics] + A-7 parity guard + A-8
  `kernel:` corpus rows). DD-58 holds on **every** compile path, incl. the
  macro boundary. Arc `closing-report.md` written; **formal close = operator
  host composition run + gate** (runbook in the report §5). Final numbers:
  `lykn test` 1365/0, deno 673/0, `make check` ✓.
- **Future:** arc09 (release).
- **Dependency sequence of the open arcs:** **arc05 → arc06 → arc07 →
  arc09.** arc10 (compiler-completion), arc11 (source-only-test-build), and
  arc12 (test-topology) are all **CLOSED — operator-gated 2026-07-05**
  (gate records in each arc's `closing-report.md`; the day also produced
  the PATH-binary staleness lesson and the ×12-corpus fix — `make check`
  now ~1m04s and is the canonical bar).
- Headline metrics: `surface.js` 2,315→448 lines; corpus 1345/0; deno 658/0;
  guide doctests 468/0 (4 kernel demos now `skip`); `deno lint packages/` exit 0.

**Immediate next action (updated 2026-07-06, end of day): slice06 ·
rust-resolution is DELIVERED and CDC content-verified** (arc-plan v1.9;
DD-60 D1 holds on Rust; matrix at targets, JS + corpus byte-identical;
the fresh-context recycle worked — the first session's clean self-stop
+ handoff addendum is the pattern to reuse). **Formal close: CC commits
source-only on `release/0.6.x` → record the SHA in the ledger Closure
line → ancestry-check → flip arc A-9.** Then **slice07 ·
atom-privacy-recon** (scoped, recon-only) → its report scopes the
*atom-payload-privacy* implementation slice → js-resolution (MUST mirror
slice06's `scope_plan` region model — hook notes in its closing report).

**Where arc13 stands** (read its `arc-plan.md` [v1.6] + both design docs
first): the **binding layer is complete by construction**. Slices 03/04/05
built the per-backend binding-position walkers
(`crates/lykn-lang/src/binding.rs` + `packages/lang/binding.js`; shared
parity fixtures; `shadows_values()` distinguishes the label namespace),
killed the ID-44 genus everywhere a name binds (D2: reserved words →
compile errors — incl. `export`, the `kernel:` name slot, and the
name-slot class the slice05 sweep found), and pinned it with a **standing
coverage-diff test in `make check`** (grammar-derived position list vs
walker: a future binding construct fails CI until the walker knows it).
Matrix: 11 position columns; suites **1401/0**. Three DD-60 refinements
arrived by CC surfacing findings rather than folding them — keep that
discipline.

**The rust-resolution slice implements DD-60 D1 on Rust per DD-61**
(`arc13/design/dd-61-resolve-once-resolution-architecture.md`,
operator-confirmed): thread the lexical env via the walkers'
`bindings_introduced` hooks (expander gets a light binding-scan; classifier
hosts the env and **tags atoms** — resolved-atom flags, §A1); demote
emitter + codegen to **read-only consumers via the `as_form_head()`
accessor swap** (§A6 — returns `None` for binding-refs so an unaware site
*cannot* misdispatch; field private, `#[must_use]`, `#[non_exhaustive]`).
**Pin the §A6 rows in the ledger** at scoping (zero dispatch sites read
raw head names; JS matrix baseline byte-identical — movement = leak =
stop). Acceptance = the matrix: Rust columns → DD-60 targets. Hook-point
notes: CC's slice03 + slice05 closing reports. After it: js-resolution
(`formHead()` + the static grep-conformance check, §A6), then
conformance-corpus + arc close, then **arc05 resumes** (its slice03:
shadowing via the resolution machinery, linter resolution-awareness
[arc05 v1.5], the ID-42 re-answer [arc13 A-6], guide-09 enforcement
labels, lint-suppression + `make lint` decisions, P-11 demo).

**Standing:** `make check` is the canonical bar (~1m); **`./bin/lykn`**,
never bare `lykn` (the PATH-binary trap); doc-touching slices add
`make test-docs`; odm = Duncan (DD-59/60/61 tracked; DD-58 @ v1.2;
DD-60's refinement log has 3 entries). Sequence: **arc13 → arc05(resume)
→ arc06 → arc07 → arc09.** Post-0.6.0 candidates: project-plan §1.

## 6. How we work — the rhythm & the disciplines

- **Scope a slice** = write its open set (`slice-doc.md`, `ledger.md`,
  `cc-prompt.md`). Ground the ledger in the *actual code* (grep/read first) — this
  session, grounding caught real errors every time.
- **CC prompts**: MUST framing, explicit Verify per row, rebuild-first, "surface
  don't decide silently," close-set instructions (closing-report + bubble-up).
- **Verify a close**: git-confirm commits are on `release/0.6.x`; code-review the
  diffs; run what the sandbox allows; mark runtime rows attested. Write
  `cdc-verification.md`. Then **bubble up** (did the slice deliver its arc piece;
  what it revealed; the silent-drop diff) and **update the plan docs**
  (arc-plan, project-plan Version History, README, `status.html`, memory).
- **Commit hygiene:** CC commits *source only*; the `docs/design-v0.6.0/**`
  planning edits are CDC's and land as a separate commit (tell CC to leave them).
- **Standing verification bar:** any slice touching guides/docs must run
  `make test-docs` (not just `lykn test` + `deno test test/`). Rebuild-first
  always (freshness guard exists but assume nothing).
- **Safety gates (CLAUDE.md):** never auto-pass `--allow-dirty`/`--force`/
  `--no-verify`; satisfy the gate instead.

## 7. Issues & learnings — the workflow-evolution log

*This is the heart of the bootstrap. Each entry: what happened → root cause → the
learning / what changed.* (Also rendered in `status.html`.)

1. **"Milestone-closed" ≠ "landed on the release branch."**
   The retroactive reconstruction trusted workbench closing-reports as done. A
   branch-ancestry audit (triggered by an arc04 finding) showed **two large bodies
   of closed work were never merged**: DD-58+DD-37 (M17–M22, ~47 commits on
   `cdc/compiler-coherence`) and DD-55 (11 commits on `feature/template-update`) —
   stranded ~6 weeks. arc03 had been *closed* on the strength of reports, not the
   branch.
   → **Learning:** before claiming any slice/arc "landed," run
   `git merge-base --is-ancestor <commit> release/0.6.x`. A green test run can
   *mask* this (the language worked via the old path; only the architecture was
   unmerged). Now standard.

2. **The slice "green" bar was blind to doc drift.**
   Guide doctests drifted (8 blocks with a DD-50.6 return-type violation) and sat
   latent for weeks because the standard bar (`lykn test` + `deno test test/`)
   never runs `make test-docs`. The **first CI run on the branch** caught it.
   → **Learning:** doc-touching slices (and arc composition checks) must include
   `make test-docs` / `make check`. Recorded as a process standard.

3. **Staleness traps produced phantom results.**
   `compile-both` shelled out to a **stale `bin/lykn`** (16 phantom "divergences")
   and later a **stale `target/lykn/build/`** dir (2 more). Green/red were both
   lies until a rebuild.
   → **Learning:** rebuild-first verify, every time. A freshness guard now fails
   `lykn test` loudly if the binary/build-dir is older than sources — but assume
   nothing and rebuild.

4. **CDC scope error: "anti-pattern leaks" ≠ "what the compiler rejects."**
   The arc10/slice01 contract asserted DD-58 strict rejects all 10 anti-pattern
   "leaks." It rejects **exactly 5** kernel-only declaration forms
   (`const`/`let`/`var`/`function`/`function*`); `==`/`===`/`&&` are legal surface,
   and `this`/`arguments`/`require`/IIFE are ordinary expressions. **CC verified
   against the compiler and stopped** before a ~99-file migration.
   → **Learning:** verify a slice's contract against ground truth (the actual
   compiler/behavior) before scoping a migration. And: **CC's self-stop is
   high-value** — the framework's "surface, don't decide silently" earns its keep.

5. **`=>` is the untyped arrow.**
   The doctest fix nearly swapped typed `fn` closures for `=>`, silently dropping
   type annotations. Reading the guide + code caught it → **bind-then-return the
   `fn`** keeps the types.
   → **Learning:** ground fixes in real language semantics, not the obvious token
   swap.

6. **Fix the tool, not the high-stakes move.**
   Moving the complex-form emitters into `classifier.js` collided with its
   existing imports. Rather than hand-edit `emitMatchMacro` (the exact function a
   past session broke by *reimplementing* — the crisis that motivated this whole
   framework), CC TDD'd a **TO-as-consumer import-prune** capability into the tool.
   → **Learning:** when a mechanical task hits a wall on a high-stakes file, invest
   in the tool; it leaves the tool permanently better and keeps the move verbatim.

7. **DD-58 strict was half-landed — twice (the same shape recurred).**
   First: strict shipped wired to `lykn test` only; `lykn compile`/`build` had no
   gate, so surface silently accepted bare kernel forms — `philosophy.md`'s
   "surface *prevents* this" was aspirational. arc10/slice01 fixed that **on the
   Rust CLI**. Then slice01's bubble-up found the **JS compiler** (which doctests
   and `deno test` use) enforces neither strict nor the `kernel:` escape — so that
   path is still lax, and `(kernel:const …)` mis-compiles there. lykn has *two*
   backends; a claim can be enforced on one and lax on the other.
   → **Learning:** "design intent" ≠ "enforced," **and** "enforced" must be
   verified on *every* compile path, not one. arc10 slice02 (JS parity) closes
   the second gap.

8. **Numbering churn.**
   Arcs were renumbered twice to keep `NN` = dependency order (inserting docs, then
   template-i18n).
   → **Learning:** switched to **`NN` = creation order**; dependency sequence lives
   in the Depends-on field. Stop renumbering.

9. **Sandbox can't run the toolchain.**
   No `deno`/`cargo`/`rust` in Cowork; also bash wedged once (a self-inflicted
   timed-out loop).
   → **Learning:** CDC verifies via git + code review + grep; be **explicit about
   evidence strength** (reproduced-by-code vs attested-runtime); recommend an
   operator host re-run to reconcile. Never claim a run you didn't do.

10. **Small correctness debts surfaced along the way** (routed, not lost):
    inherited `make check` red (`cargo fmt`, fixed by drive-by); `(require …)` →
    invalid-ESM output (→ arc05 lint + a Principle-3 note); the `_kernel` marker
    still load-bearing (→ arc10 slice02).
    → **Learning:** disclose-and-route every incidental finding into the plan
    (version histories / bubble-ups); never silently drop.

## 8. Open follow-ups (surfaced, not yet fully scoped)

- **arc10 slice01** — DONE (Rust-CLI strict-default, `faee8a1`).
- **arc10 slice02 · js-dd58-parity** — DONE (`feb056c`; strict + `kernel:` in
  the JS compiler; guide fences 09/06 flipped; A-3 met).
- **arc10 slice03** — DONE (`2f6a84d`; `_kernel` → `kernel-mark.js` WeakSet
  registry; A-6 enforced [Rust semantics, DD-58 refinement recorded]; A-7
  parity guard in `make check`; A-8 corpus rows). **arc10 gate pending**
  (host composition runbook in the arc closing-report §5). Cosmetic
  drive-bys open: `kernel-mark.js:10` stale comment; `macroEnv.has('bind')`
  stale guard.
- **arc07 (docs/examples)** — new item routed from slice02: the kernel browser
  examples use top-level `(= el:inner-HTML …)` (equality → runtime no-op,
  pre-existing latent bug).
- **arc09 (release notes)** — breaking items from slice02: bare kernel forms
  via JS API/browser now throw; `(kernel:…)` changed meaning in JS (bogus
  member call → real escape).
- **arc05 corpus** — after arc10 lands: the linter owns idiom/style (incl. the
  re-homed `==`/`&&`/`require`/IIFE anti-patterns); the compiler owns the closed
  declaration-form namespace. `09-anti-patterns.md` is the seed (needs the
  "ELIMINATED" reclassification per the CC audit).
- **Downstream migration** (mycelium) under DD-58 strict — deferred (repo-only for
  now).
- **arc07** — broader guide-drift audit + SKILL additions (slice01 done).
- **`actions/checkout@v4→v5`** CI maintenance → arc09.
- Duncan to reconcile **DD-58 odm `state.json` version** with the doc's v1.1 bump.

## 9. One-line cheat-sheet

Read project-plan + README + status.html → **arc10 is CLOSING** (3/3 slices
done; DD-58 enforced everywhere incl. the macro boundary; `_kernel` retired)
→ the gate is the **operator host composition run** (closing-report §5
runbook) → on sign-off flip arc10 Closed + reconcile rows + land the two
one-line comment/guard drive-bys → then **scope arc05 (linter)** — the first
post-arc10 arc, corpus division per project-plan v1.12.
