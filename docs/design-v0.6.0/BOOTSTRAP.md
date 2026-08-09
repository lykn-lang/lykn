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

## 5. Current state (2026-08-08, checked against `release/0.6.x` git)

**Read this as a snapshot, not a replacement for git.** The release worktree is
`~/lab/lykn/lang/.worktrees/0.6.x`; the main checkout can lag the release branch
and has done so. Before acting, confirm with `git log` on `release/0.6.x`.

**Closed / gated arcs:** arc01, arc02, arc03, arc04, arc05, arc06, arc08,
arc10, arc11, arc12, arc13, arc15. arc10's original DD-58/DD-37
compiler-completion gate is historically closed, and its 2026-08-08
`slice04-no-else-if-expression-error` follow-up is closed. The big recent
closes:

- **arc05 · lykn-source-linter** — gate GO 2026-07-21. `lykn lint` ships over
  Lykn source: 16 rules, resolution-aware, wired into `make check`; P-5/P-11
  reconciled.
- **arc06 · cross-project-dep-ergonomics** — gate GO 2026-07-24. All seven
  slices are closed/CDC-verified. The founding 0.6.0 goal is met: mycelium can
  consume lykn end to end (`lykn add`, `lykn link`/`unlink`, import by
  specifier, build, test 43/0, publish dry-run). The highest-risk publish-safety
  row is operator-reproduced, not merely attested.
- **arc13 · expander-coherence** — gate GO 2026-07-09. Resolve-Once landed:
  lexical bindings shadow macros on both backends, reserved words are rejected
  as binding names, and the 1947-cell matrix closes at 53 documented residual
  divergences.

**Standalone slices:**

- **01 · macro-entry-diagnostics — CLOSED.** Source/test fix `41cf05a`, slice
  docs `e8f212d`, CDC close `bc51055`. One acceptance demo is deliberately owed
  until 0.6.0 publishes because mycelium currently resolves the registry JS
  compiler.
- **02 · artifact-homes — CLOSED.** The register/backlog homes exist and the
  cited-path gate landed (`379bb32`); after `03-citation-repoint`,
  `make check-cited-paths` and `make check` are green. The 2026-08-08 CDC
  return on L-5/L-6 was remediated by tracking sibling-repo `AGENTS.md` files,
  making `CLAUDE.md` a symlink to `AGENTS.md`, adding the new commit trailers,
  and tracking the book audit tool (`91fee17`, `a042e18`). P-21 is done.
- **03 · citation-repoint — CLOSED.** Opened by `409e7fd`, closed through
  `774e9eb`, `a3055c9`, and `2df2130`. It repointed migrated citations,
  populated four already-decided artifact homes, and shrank the frozen census
  from 631 to 601 accepted pairs. `make check-cited-paths` is green at HEAD.

**Open arcs / release gates:**

- **arc15 · surface-syntax-traps — CLOSED.** slice01 and slice02 are
  closed/CDC-verified; slice03 is honestly deferred to 0.7.0 (fully typed
  classification); slice04 closed the sibling traps and slice05 closed the
  nested `fn` parameter mismatch. The arc-close repro passed at arc scale.
- **arc10 · compiler-completion — CLOSED.** Original 2026-07-05 gate remains
  true, and the 2026-08-08 slice04 follow-up fixed `D-2608-W2HF`:
  no-else `if` in expression position now fails `lykn check`/`compile` before
  invalid JS can be emitted.
- **arc07 · docs — CLOSED.** slice01 fixed the first doctest drift; slice02
  current-drift recon is closed/CDC-verified; slice03 build/dist/publish guide
  refresh is closed/CDC-verified; slice04 Deno workflow reconciliation is
  closed/CDC-verified. Arc ledger A-1...A-7 met; P-13 is done.
- **arc16 · book-0.6.0-edition — OPEN.** The arc plan now exists at
  `arc16-book-0.6.0-edition/arc-plan.md`; slice01
  `pre-book-decision-gate` is open. The book gates arc09 because drafting it is
  the full-surface review before the release cut. Slice01 re-grounds D-1...D-5,
  `D-2607-R4NW`, and the new pre-book dogfood decisions: `D-2608-XPRT` export
  ownership, `D-2608-LBND` grouped local bindings, `D-2608-COND` flatter
  validation branching, and `D-2608-SOWN` source ownership. Later compiler,
  scaffold, docs, and chapter work must not proceed until those decisions have
  an explicit route.
- **arc09 · release — FUTURE.** Waits on the remaining 0.6.0 gates above.

**Current sequence:** arc16, then arc09. arc14
comment-retention is seeded but explicitly 0.7.0.

**Standing:** `make check` is the canonical bar; **`./bin/lykn`**, never bare
`lykn`; **`./bin/lykn build` before any deno/matrix probe** (the `lang/` import
map resolves to `target/lykn/build/lang/`); doc-touching slices add
`make test-docs`; path-citation work must run `make check-cited-paths` and must
not append to `scripts/cited-paths-census.tsv`.

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
  **`status.html` means the whole DATA object** — not just the
  `updated`/`arcs`/`now` state fields but the *narrative* sections
  (metrics, accomplishments, issues log): they drift silently if only
  the state fields get touched (caught 2026-07-09 — doctest count and
  an "open" tag on a fixed issue were both stale).
- **Commit hygiene:** CC commits *source only*; the `docs/design-v0.6.0/**`
  planning edits are CDC's and land as a separate commit (tell CC to leave them).
- **Standing verification bar:** any slice touching guides/docs must run
  `make test-docs` (not just `lykn test` + `deno test test/`). Rebuild-first
  always (freshness guard exists but assume nothing).
- **Safety gates (AGENTS.md):** never auto-pass `--allow-dirty`/`--force`/
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

11. **The expanders disagreed on what a name meant — and it took an arc.**
    arc05's ID-42 recon self-stop exposed a P-9-class semantic divergence
    (35% of an 885-cell probe matrix); the fix was arc13: DD-60 semantics,
    the DD-61 Resolve-Once architecture (resolved-atom tags, one walker
    per backend, dispatch sites demoted to consumers), and a standing
    corpus. 3 slices planned → 11 delivered; 5 DD refinements, every one
    child-surfaced; end state 53/1947 documented-as-intended.
    → **Learning:** when N sites must agree on a judgment, don't write N
    careful implementations — make the judgment once and represent it so
    the question can't be re-asked. And: a would-be lint rule that
    self-stops on a recon gate can be the discovery of the real disease.

12. **The fresh-context recycle is now a named move.**
    Twice in arc13 (slices 06, 10) a long session hit its ceiling
    mid-slice, self-stopped cleanly (tree green/reverted, nothing
    half-landed), and wrote a handoff addendum into the slice's cc-prompt;
    both fresh sessions delivered same-day, re-deriving nothing.
    → **Learning:** a recycle is not an iteration (nothing was delivered;
    the ledger stands). The honest self-stop is the enabling move; the
    addendum is what makes it cheap. Standard for tail-of-session slices.

13. **Staleness trap, fourth costume: import-map artifacts.**
    The `lang/` import map resolves to `target/lykn/build/lang/` — deno
    and matrix runs exercise the last *build*, not the source edit.
    → **Learning:** `./bin/lykn build` before any deno/matrix probe. The
    costume changes (bin/, build-dir, PATH, import-map); the rule
    doesn't: rebuild-first, every channel.

14. **The A6 layers bound dispatch, not emit-time heuristics.**
    `contains_await` read raw names to decide async-ness — a
    destructure-shaped read the static check was blind to (slice08 found
    it); the probe (slice11) then caught the real bug: a bound `await`
    inside an async-gated wrapper reinterpreted as the operator on Rust.
    → **Learning:** the `A6-exempt` bar is **"renders, never behaves"** —
    any structural read that changes emitted behavior based on a name
    must honour resolution. And: decide dispositions **with the probe in
    hand**, never in the abstract — the probe caught what both the matrix
    and the corpus's coverage bar structurally couldn't.

## 8. Open follow-ups (surfaced, not yet fully scoped)

- **arc13 gate** — ★ **GO, complete 2026-07-09**; **A-6 closed
  2026-07-21** at slice03 scoping — arc13 fully discharged.
- **arc05 slice03** (SCOPED 2026-07-21 — hand to CC): resolution-consumer
  (`resolve()` + `as_form_head`); shadowing rule (reuse the resolver's
  scope model — no second decider); ID-42 re-answer = no rule (closed A-6);
  dogfood. Open set at `slice03-resolution-consumer/`.
- **arc05 slice04** (planned, from the 1→2 split): lint-suppression
  mechanism; `make lint` wiring; guide-09 "ELIMINATED" reclassification +
  guide-15 + SKILL; P-11 demo → arc close. Corpus division stands:
  compiler owns the closed declaration-form namespace + name binding;
  linter owns idiom/style (`==`/`&&`/`require`/IIFE-class anti-patterns).
- **odm (Duncan):** DD-61 promotion pending (mirror its refinement log
  IN FULL — the DD-60 drift lesson); DD-60 0062 frontmatter v1.1 vs
  `state.json` reconcile if tracked; the old DD-58 v1.1 reconcile item
  still open.
- **arc07 (docs):** stale AGENTS.md architecture note ("lykn-cli …
  SExpr enum" — false since the re-export); kernel browser examples'
  `(= el:inner-HTML …)` no-op; broader guide-drift audit + SKILL
  additions (incl. the `(export (func …))` invalid-form fix noted in
  memory).
- **arc09 (release):** breaking-notes accumulator — DD-58 strict; JS
  `kernel:` semantics change; **D1** (bound macro-named params now
  resolve — blast radius 0 in-tree); **D2** (reserved-word names now
  compile errors); `actions/checkout@v4→v5`.
- **Post-0.6.0** (project-plan §1): + the `Atom(_)` cosmetic
  normalization (slice09); the mycelium migration under DD-58 strict
  (deferred, repo-only for now).

## 9. One-line cheat-sheet

Read project-plan + README + status.html → **★ arc13 is CLOSED and fully
discharged** (gate GO 2026-07-09; A-6 closed 2026-07-21) → **arc05 slice03
is SCOPED** (1→2 split, arc-plan v1.6; open set at
`slice03-resolution-consumer/`): the linter on true lexical scoping
(resolution-consumer via `resolver::resolve` + `as_form_head`; shadowing
rule reusing the resolver's scope model; ID-42 re-answer = no rule, closed
arc13 A-6; dogfood) is **CLOSED** (`ea429e2`) → slice04 **CLOSED** (`2feb5fd`) → **arc05 CLOSED** (gate GO 2026-07-21: `make check` green, P-11 demo 16/16) →
then arc06 → arc07 → arc09, and 0.6.0 is in sight.
