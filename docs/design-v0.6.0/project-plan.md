# lykn 0.6.0 — Project Plan

> Plan-of-record for the lykn 0.6.0 release: the **language-toolchain
> alignment** release. This document is the arc roadmap — the place a fresh
> session reads to understand all the arcs at once before opening any single
> `arc-plan.md`.
>
> **Reconstructed retroactively (2026-06-28)** from the milestone (M-series)
> history that lived in `workbench/` under the project's prior tracking
> convention. The arcs, slices, and statuses below are recovered from the
> actual shipped milestones, their ledgers, closing reports, and CDC reviews —
> now reorganized into the canonical `docs/design-v0.6.0/` layout per
> `collaboration-framework/docs/PROJECT-MANAGEMENT.md` (v2.1). See the Version
> History for the migration provenance.

## 1. Definition of done and boundaries

**What 0.6.0 delivers.** 0.5.1 was the documentation/scaffold/SKILL alignment
release; **0.6.0 is the release where the structural language-toolchain
commitments land**. Specifically, 0.6.0 is done when:

- The build/publish toolchain is reorganized onto the `target/lykn/{build,dist}`
  discipline, and `lykn publish` enforces an uncommitted-changes gate
  (philosophy commitments #1 and #4).
- The two compilers (Rust + JS) are coherent by construction wherever
  possible: same surface input → same output, with intentional divergence
  documented (DD-36/DD-58 kernel/surface separation; DD-37 JS surface
  compiler architecture).
- `.d.ts` type declarations are generated from `:type` annotations (DD-56).
- `lykn lint` lints **Lykn source** (anti-patterns, idiom, style), replacing
  the compiled-JS-lint surface (philosophy commitment #2, Option A).
- The release is cut: version bumps, release notes, publish to JSR / npm /
  crates.io.

**Boundaries — explicitly NOT in 0.6.0 scope here.** The architecture is in
the design docs (`docs/design/`, odm-managed DDs) and `docs/philosophy.md`;
this file is the *plan*, not the design.

**~~The Lykn Book 0.6.0 update lives in a separate repo (`~/lab/cnbb/lykn`) and
is tracked as its own project, not as an arc here (decided 2026-06-28).~~
SUPERSEDED 2026-07-24 (operator):** the Book 0.6.0 edition is **in 0.6.0 scope
and gates the release** — see **arc16** in the roadmap and **P-20** in the
project ledger. Rationale (operator): drafting the book's 0.6.0 edition is a
full-surface review of the shipped language, so it is expected to surface bugs
and DevX defects; discovering those *after* the cut means point releases on 0.6.
Better to pay that cost before the gate than after it. The 2026-06-28 routing
was not wrong about *where the work lives* (still its own repo) — it was wrong
about *whether the release waits on it*. Note the failure mode this correction
also fixes: the 0.7.x BACKLOG recorded the book as "owned by the Book project,"
but **no such project had ever been instantiated** — the routing pointed at an
owner that did not exist, so the work read as handled while going cold. The
**0.1.0–0.5.x history** remains in
`workbench/old/` and is out of this plan's scope; a `docs/design-v0.5.x/`
retro pass may reconstruct it later.

A pointer to the architecture: `docs/philosophy.md` (the three principles +
0.6.0 commitments), and the odm-managed DDs in `docs/design/` (DD-36, DD-37,
DD-56, DD-58 in particular).

**Post-0.6.0 tracked candidates** *(added v1.17 — the arc11 buried-intent
audit's routed items; each has a named source + re-entry condition; this
list is the "watcher" that keeps routed items from re-burying)*:

> **Consolidated (2026-07-22) into `release/0.7.x` →
> `docs/design-v0.7.0/BACKLOG.md`** — the single canonical 0.7.0+ candidate
> register. It carries these items (§B), the big-rock arcs (§A — incl. **A6 ·
> fully-typed classification** = arc15 slice03's deferred Option C), and
> memory-only items (§C). This list is kept here as the in-tree provenance
> snapshot; new routing lands in the BACKLOG.

- **`set-symbol!` deprecation decision** (breaking) — the `SetSymbol` TODO's
  trigger fired at arc10's close; it is a live surface form (the only
  surface spelling for computed-key assignment; 1 guide + 2 tests use it).
  Operator decides at 0.7.0 planning: deprecate per the original intent, or
  keep. Source: arc11/slice02 F-4.
- **`genfunc` multi-clause** — the Rust emitter silently emits only the
  first clause (matches current JS behaviour). A compiler feature for 0.7.x;
  re-entry when multi-clause generators are needed. Source: arc11/slice02 N1.
- **Polish backlog** (re-entry when the respective area is next touched):
  ICU error-position → Span attribution (`icu.rs:696`); reader
  block-comment stub cleanup (`parser.rs:308–310`); doctest nested-fence
  scanner (`doctest.rs:1138`); nested-destructure completeness
  (`emitter/forms.rs:2074`). Source: arc11/slice02 #2, N2–N4.
- **Downstream (mycelium) DD-58 migration** — standing follow-up (bare
  kernel forms there break under a strict consumer). Source: arc10.
- **Batch-compile the test corpus** — `compile_lykn_test_files` spawns ~97
  per-file `deno eval` processes; batching into one Deno process is the
  next big verification speed win. Source: arc12/slice01 bubble-up.
- **Toolchain hardening trio** (small tidies, re-entry when the CLI is next
  touched): stray-sibling double-run guard (`lykn test` should run `test/`'s
  hand-written `*.test.js` explicitly + corpus only from `target/`, so stray
  `*_test.js` can't be discovered); freshness-guard scoped to `src/` (newer
  `tests/*.rs` false-positives it); `--compile-only`+`--docs` honored by
  `run_doc_tests`. Source: arc12/slice01 bubble-up.
- **Comment retention + lint suppression (arc14 · comment-retention, DD-62)** —
  scheduled **0.7.0** (operator, 2026-07-21). Reader comment-retention (→
  surface→kernel provenance → strip-or-preserve at JS emit) unblocks inline
  `lykn lint` suppression; deferred out of 0.6.0 as additive capability, not
  toolchain alignment. Source: arc05/slice04 (the suppression deferral).

## 2. The arc roadmap

Arcs in dependency order. Each delivers one coherent capability.

| Arc | Capability | Depends on | Status |
|-----|-----------|-----------|--------|
| **arc01 · build-publish-toolchain** | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check gate | — | **Closed** (M11+M13) |
| **arc02 · type-dts-generation** | `.d.ts` declarations generated from `:type` annotations (DD-56) | — | **Closed** (M10) |
| **arc03 · compiler-coherence** | Rust + JS compilers coherent by construction; kernel/surface split (DD-58) + JS surface compiler arch (DD-37) | arc01 (build) | **Closed** (M16–M22; architecture landed on release 2026-06-29) |
| **arc04 · refactor-tooling** | `move-function` byte-exact code-move tool driving surface extraction | arc03 | **Tool built & proven** (slice01+02 closed); A-3 real-extraction deferred to M22.5-2 |
| **arc05 · lykn-source-linter** | `lykn lint` over Lykn source — anti-patterns, idiom, style (Option A) | arc03, arc10, arc11, arc13 | **Closed** — gate GO 2026-07-21 (`make check` green; P-11 demo 16/16 seeded → exit 1, clean → exit 0); `lykn lint` (16 rules, resolution-aware) ships. Inline suppression deferred → arc14/DD-62 |
| **arc13 · expander-coherence** | Lexical bindings shadow macros on both backends; JS reserved words rejected as names; name-binding conformance corpus | arc10 (per-backend discipline); blocked arc05 slice03 | **CLOSED — gate GO 2026-07-09** (11 slices, 3 planned → 11 via tracked re-slices; DD-60 D1/D2 hold on both backends; Resolve-Once [DD-61] landed incl. §A6 privacy; corpus standing in `make check`; matrix 1947/53 exact at the gate, all documented-as-intended; P-18 reconciled) |
| **arc06 · cross-project-dep-ergonomics** | `lykn add` and ergonomic cross-project dependency handling (DD-51 follow-ons) | arc01 | **CLOSED — gate GO 2026-07-24** (operator; runsheet Parts A/B/C/C-bis all green, runtime rows **reproduced** not merely attested). All 7 slices closed/CDC-verified. slice06 version-consolidation + slice07 link-registry-specifier (Tier-0 resolver override; iteration 1 resolved a blocking effective-config regression + added the 4 table tests that were missing). Slices 01–05: mycelium re-audit + DD-63 → `lykn add` (`f9f9014`, exact-pin) → `lykn link`/`unlink` (`e1c0dd7`, git-ignored overlay; dist reads raw = publish-safe) → import-by-specifier (`42500a9`, zero lang change). mycelium consumes lykn end-to-end (build ✓ · test 43/0 · publish --jsr --dry green). Closing-report **re-issued** covering the full 7-slice walk; arc ledger **A-1…A-9 all met**. **0.6.0's founding goal — consume lykn as a dependency, end to end — is met.** |
| **arc07 · docs** | Guide/SKILL alignment with 0.6.0; clear guide drift; land discoverability additions | arc01–06, arc08, arc15 (describes shipped behaviour) | **Active** — slice01/slice02/slice03 closed/CDC-verified; slice04 Deno workflow reconciliation pending; compiler follow-up `D-2608-W2HF` moved to reopened arc10 slice04 |
| **arc08 · template-i18n** | `template` macro → ICU MessageFormat + i18n (DD-55) | DD-54 template; D-2 escape | **Closed** (DD-55; landed on release 2026-06-29) |
| **arc09 · release-0.6.0** | Version bumps, release notes, publish to JSR / npm / crates.io | all above, **incl. arc10 follow-up and arc16 (book)** | **Future** (was M14/M15) — now gated by the remaining open arcs, arc10 follow-up + arc07 + arc16 |
| **arc10 · compiler-completion** | DD-58 strict-default (surface prevents kernel-form leaks) + DD-37 step-4 (`_kernel` removal) + no-invalid-JS follow-up for no-else `if` expression position | arc03, arc04 | **Reopened** — original gate GO 2026-07-05 remains true; slice04 draft planned for `D-2608-W2HF` |
| **arc11 · source-only-test-build** | `lykn test` compiles to `target/lykn/test/` (never the source tree) — finishes philosophy #1 for the last source-tree emitter — + a buried-intent audit (sweep + disposition every deferred-then-lost stub) | arc01 (target discipline) | **Closed** (gated 2026-07-05; P-7's demo unconditional; buried-intent inventory empty-or-tracked) |
| **arc12 · test-topology** | Every test executes exactly once per `make check`; `make test-docs` tests docs (killed the ×12 corpus re-runs) | arc11 slice01 (out-dir layout) | **Closed** (gated 2026-07-05; delivered same-day: 1m52s→2.6s, >2m→1m04s, corpus 1×/0×) |
| **arc14 · comment-retention** | Reader retains comments; provenance annotated surface→kernel; strip-or-preserve at JS emit (DD-62) — the home for lint-suppression | arc13 (node-metadata pattern) | **Seeded → 0.7.0** (2026-07-21; **release boundary decided 0.7.0**, operator; not slice-planned — post-0.6.0 capability) |
| **arc16 · book-0.6.0-edition** | The Lykn Book's 0.6.0 edition drafted to completion — the full-surface review that catches language and DevX defects **before** the release, not in point releases after it | arc01–08, arc10–13, arc15 (describes shipped behaviour); pairs with arc07 (guides) | **Open — planning home CREATED 2026-07-25, arc-plan still to be written.** *(was: "reserved slot, not yet planned … planning home deliberately NOT created yet".)* The confirmation-protocol decision (PROJECT-MANAGEMENT Part VI) was taken with the operator on 2026-07-25: **split by design** — the *plan* lives here at [`arc16-book-0.6.0-edition/`](./arc16-book-0.6.0-edition/) because this project's arc09 gates on it; the *content* stays in `~/lab/cnbb/lykn`, whose new `AGENTS.md` points back here (as does `~/lab/cnbb/lykn-writers-guide`'s). The previously-untracked material is now tracked under `arc16-book-0.6.0-edition/design/`: the kickoff thread (which sizes the work at **6–8 iterations**, its own pre-reorg vocabulary — those map to *slices*, not to the framework's `iteration`), the 40KB drift inventory, the fence-wiring spec (moved from a loose file at this directory's root), and the dogfooding friction log (relocated from the book repo's gitignored `workbench/`). **First task is now writing `arc-plan.md`**, not finding the material. Five decisions (D-1…D-5) await the operator; the plan is written in pre-reorg M/Thread vocabulary and needs translating to arcs |
| **arc15 · surface-syntax-traps** | Surface shapes that compile clean but mean something else → compile error + fix-it + lint + guide fix; slice01 = reject method-on-expression `(<non-atom-head> :kw …)` (DD-64), thread instead | threading (shipping); arc05 (lint) | **Closed — gate GO 2026-08-08**. slice01 reject (`9ca9c7e`) + slice02 lint/check-parity (`d6c23b5` + follow-up B `90cf211`) closed/CDC-verified; slice03 hardening **DEFERRED → 0.7.0** (Option C = fully-typed classification, `release/0.7.x` BACKLOG A6); slice04 sibling traps closed; slice05 nested `fn` parameter validation closed; arc ledger A-1…A-6 met. |

> **Numbering convention (from 2026-06-30):** `NN` is **creation order**, not
> strict dependency order (we stopped renumbering on each mid-stream insert).
> **Dependency/sequence** is carried by the *Depends on* column and the arcs'
> Dependencies sections. Current dependency sequence of the remaining work
> (**checked 2026-08-08**): **arc10 follow-up + arc07 (docs) + arc16 (book) -> arc09
> (release).** arc07 and
> arc16 are siblings, not sequential: both describe shipped behaviour, and the
> book draft is expected to feed defects back into the language arcs, so plan
> for a return loop rather than a straight line. arc05 closed 2026-07-21; arc06
> closed 2026-07-24; arc14 is deferred to 0.7.0. (High numbers belie the order:
> arc10 ran first.)

> **Standalone slices (new 2026-07-24).** Not every unit of 0.6.0 work is an
> arc. When a body of work is one slice, `PROJECT-MANAGEMENT.md` Part II collapses
> the wrapper: the per-slice documents live directly in `NN-<slug>/` under this
> directory, with no `arc-plan.md` above them. Bare-`NN` non-arc units already
> exist under `docs/design-v0.7.0/` (`01-treeshake-audit` etc.); this tree now
> uses the same convention. Current standalone slices:
>
> - **[`01-macro-entry-diagnostics`](./01-macro-entry-diagnostics/slice-doc.md)** —
>   `import-macros` resolution diagnostics (**closed**, 2026-07-24). Gates
>   nothing; fixes a *misleading* error rather than a missing one. Acceptance
>   demonstration re-enters after 0.6.0 publication because the mycelium path
>   currently resolves the registry JS compiler.
> - **[`02-artifact-homes`](./02-artifact-homes/slice-doc.md)** — give every
>   durable artifact a tracked home and make "a cited path resolves in git" a
>   `make check` gate (**closed**, 2026-08-08). Origin:
>   `docs/backlog/discoveries.md` was cited by five committed documents while
>   sitting in a gitignored tree. The gate is green; the sibling-repo
>   `AGENTS.md` / `CLAUDE.md` guidance files and the book audit tool are now
>   tracked. P-21 is done.
> - **[`03-citation-repoint`](./03-citation-repoint/slice-doc.md)** — execute the
>   operator's amended disposition: repoint every citation whose target migrated
>   to a *tracked* location, freeze only what can never resolve, and perform four
>   migrations that were decided but never done (**closed**, 2026-08-08). Uses
>   `02-artifact-homes`' gate; adds no mechanism. Close evidence: commits
>   `774e9eb`, `a3055c9`, and `2df2130`; `make check-cited-paths` green at
>   HEAD; frozen census 631 -> 601 accepted pairs.

## 3. Current status (2026-08-08)

This is the live release-branch status, reconciled against `release/0.6.x` git
history and the slice directories. Older dated snapshots remain below as
provenance, not as current instruction.

- **Closed / gated arcs:** arc01, arc02, arc03, arc04, arc05, arc06, arc08,
  arc11, arc12, arc13, arc15. arc10's original 2026-07-05 gate remains
  historically closed, but the arc is reopened for slice04.
- **Open standalone work:** none. `02-artifact-homes` and
  `03-citation-repoint` are closed, P-21 is done, and the cited-path gate is
  green at HEAD.
- **Open arcs:** arc10 (reopened: slice04 draft planned), arc07 (active:
  slice04 Deno workflow reconciliation pending), arc16 (book arc-plan still
  to write).
- **Future:** arc09 release, gated by the open arcs above. arc14
  comment-retention is seeded for 0.7.0, not 0.6.0.

### Historical snapshot (2026-06-28 through 2026-06-30)

- **✅ Reconciliation RESOLVED (2026-06-29) — see [`_reconciliation-2026-06-29.md`](./_reconciliation-2026-06-29.md):**
  both stranded bodies are now merged to `release/0.6.x` and verified green
  (corpus 1345/0, clippy/fmt/lint clean). `cdc/compiler-coherence` (DD-58+DD-37)
  via merge `6aa3724`; `feature/template-update` (DD-55) via `7a552ca`. **All
  worktree branches are now 0-ahead of release — zero stranded work.** arc03's
  close is **restored**; DD-55 added as **arc08**; M22.5-2/-3 unblocked.
- **Done / closed:** arc01, arc02, **arc03** (architecture landed), **arc08**
  (DD-55 template/ICU/i18n).
- **arc04 CLOSED** (5/5 slices) — the `move-function` tool built *and* drove the
  complete surface extraction; **DD-37's implementation migration finished**:
  `surface.js` 2,315→448 lines, `classifier.js` self-contained, byte-identity held
  throughout (incl. `emitMatchMacro`). `deno lint packages/` **exit 0** — the
  standing JS-lint debt is closed.
- **Surfaced follow-up (not yet scoped):** **DD-37 step 4** — remove the `_kernel`
  marker (an `expander.js`-core change). A candidate future arc/slice/DD.
- **Red CI on `release/0.6.x` (2026-06-30) — RESOLVED:** first CI run caught **8
  guide doctest blocks** with DD-50.6 return-type drift (guide drift, compiler
  correct). Fixed docs-only in **arc07 slice01** (`0731048`; doctests 464/8→472/0,
  `make check` green; closure returns via bind-then-return keeping typed params).
  CI re-run pending to confirm. CI-maintenance drive-by (`actions/checkout@v4→v5`)
  still open → arc09.
- **Process standard (new):** the slice "green" bar must include **`make
  test-docs`** (or `make check`) whenever a slice touches guides/docs, and at
  arc-composition checks — doctest/guide drift is invisible to `lykn test` +
  `deno test test/` (which is why this sat latent). Apply in slice ledgers going
  forward.
- **Investigation resolved + DECIDED (2026-06-30):** CC verified `09-anti-patterns.md`
  against the compiler (report in `workbench/cc-anti-patterns-verification-2026-06-30.md`).
  **Finding:** only **2 of 12 `ELIMINATED` entries are truly eliminated**; the other
  10 **leak** — bare kernel/JS forms (`var`, `==`, `function`-with-`this`,
  `arguments`, `require`, IIFE, `const`, `===`, `&&`) pass through the surface
  compiler and emit directly (`(var x 1)` → `var x = 1`). Root cause: **DD-58
  strict mode is wired to `lykn test` only** (`main.rs:675 strict: !is_lyk`), not
  to `lykn compile`/`build`. So the guide's + philosophy's "eliminated by design"
  is *intent*, currently **half-enforced**.
  **Decision (operator):** **complete DD-58 — strict mode default-on for `.lykn`
  compilation.** Consequences:
  - **New compiler work (high priority, gates arc05):** DD-58-strict-default —
    turn strict on for normal compilation; bare **kernel-only declaration forms**
    become compile errors (use `kernel:` escape). **Scope narrowed by CC 2026-06-30:
    `classify_form_strict` rejects exactly `const`/`let`/`var`/`function`/`function*`
    — NOT `==`/`===`/`&&` (legal surface passthrough) or `this`/`arguments`/
    `require`/IIFE (ordinary expressions).** So strict does *not* subsume the
    `require`→invalid-ESM issue (that + the operator/expression anti-patterns route
    to arc05). Potentially breaking; migration is the 5 forms only.
  - **arc05 (linter) — the division sharpened:** the compiler owns the closed
    *declaration-form* namespace; the linter owns the **idiom/style** anti-patterns,
    including the report's non-kernel-form "leaks" (`==`-vs-`===`, `&&`-vs-`and`,
    `require`, IIFE) plus the converted JS-runtime traps (`or`-vs-`??`, `:sort`,
    `for-in`, boolean-params, catch-and-log, `cell`-when-pure, `js:`-overuse …).
  - **arc07 guide-fix SHRINKS:** once strict lands, the "ELIMINATED" claims become
    *true* (enforced) — minimal guide change; the guide is ahead of the compiler,
    not wrong.
  - **Structure/sequencing (decided 2026-06-30):** created **arc10 ·
    compiler-completion**, appended by creation order, sequenced **before arc05**.
    DD-58 doc → v1.1. **slice01 (Rust-CLI strict-default) is CLOSED** (`faee8a1`).
    slice01's bubble-up: the **JS compiler has no strict / `kernel:` parity** →
    **slice02 · js-dd58-parity** is next (arc10 A-3 met on Rust path only until
    then; doctests/`deno test` stay lax); `_kernel` removal → slice03. **arc10 is
    still next up in the sequence.**
- **Open / not started:** arc05 (linter), arc06 (dep ergonomics; slice01 closed),
  arc07 (docs; seeded).
- **Gated:** arc09 (release) waits on the open arcs.

Per **plan late, plan deep**: arc-plans for the closed arcs (01–03) are
*reconstructed* from shipped work; arc04 is planned to the depth its in-flight
state supports; arc05–07 carry capability statements and their kickoff-thread
seeds but are **not** planned slice-by-slice until they become active.

## 4. Project ledger

Composition criteria that verify the 0.6.0 definition of done. Opens here;
closes (per-row walk) in this project's `closing-report.md` when 0.6.0 ships.
Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §C, class-(b)
rows are **reproduced at project scale** (end-to-end demonstration), never
inherited from arc attestations.

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| P-1 | arc01 closed + composed | ptr: arc01 closing-report | correctness | project-plan | done | M11+M13 closing report | attested (reconstructed) |
| P-2 | arc02 closed + composed | ptr: arc02 closing-report | correctness | project-plan | done | M10 closing report + CDC | attested (reconstructed) |
| P-3 | arc03 closed + composed | ptr: arc03 closing-report | serious | project-plan | **done** | architecture merged to release (`6aa3724`); corpus 1345/0; classifier.js/surface-helpers.js present | restored after the 2026-06-29 reconciliation |
| P-4 | arc04 closed + composed | ptr: arc04 closing-report | correctness | project-plan | **done** | arc04 closed (5/5 slices); `closing-report.md` composition check; surface.js 2315→448; emitMatchMacro byte-identical; lint green | DD-37 step 4 (`_kernel`) surfaced as follow-up |
| P-5 | arc05 (linter) closed + composed | ptr: arc05 closing-report | correctness | project-plan | **done** | 4 slices closed; arc05 closing-report composition A-1…A-7; **gate GO 2026-07-21** (`make check` + P-11 demo) | **reconciled** |
| P-6 | arc06 (dep-ergonomics) closed + composed | ptr: arc06 closing-report | polish | project-plan | **done** | all 7 slices closed/CDC-verified; `lykn add` DD-63 `f9f9014`; `lykn link` `e1c0dd7`; import-by-specifier `42500a9`; version consolidation; link-registry-specifier; closing-report A-1…A-9 all met; mycelium consumes lykn end-to-end (build ✓ · test 43/0 · publish --jsr --dry green) | **DONE — gate GO 2026-07-24.** Round trip on the way: CLOSE-READY → ACTIVE (slices 06/07 landed post-report; slice07 iteration 1) → CLOSE-READY → **CLOSED**. The host reconcile ran in full, so A-4/A-5/A-6 are **operator-reproduced**, not CC-attested — including the publish-safety property (`lykn dist` with a link active → 0 linked refs in staged output), the arc's highest-stakes claim |
| P-7 | `build` emits to `target/lykn/build/`; no `.js` in source tree (DoD demo) | end-to-end: clean build, grep source tree for `.js` = 0 | serious | DoD | open | | reproduce at project scale |
| P-8 | `lykn publish` fails on a dirty tree; `--allow-dirty` overrides, never auto-injected | end-to-end publish dry-run on dirty + clean tree | serious | DoD | open | | reproduce at project scale |
| P-9 | same surface input → same output across Rust + JS for the migrated corpus (`compileBoth`) | run `compileBoth` corpus; divergences documented or zero | serious | DoD | **done** | corpus **green: 1293 passed / 0 failed** (slice11); 0 semantic divergences | form-codegen only (~11%) remains a documented coverage bound |
| P-10 | `.d.ts` generated from `:type` annotations | end-to-end: compile a typed module, inspect emitted `.d.ts` | correctness | DoD | open | | reproduce at project scale |
| P-11 | `lykn lint` lints Lykn source (not compiled JS) | end-to-end: `lykn lint` on a fixture with seeded anti-patterns | correctness | DoD | **done** | `p11_lint_corpus` (seeded→16 rules/exit1, clean→exit0) in `make check`; host: `./bin/lykn lint …/p11/{seeded_test,clean}.lykn` | **reconciled** — gate GO 2026-07-21: seeded 16/16 exit 1, clean exit 0 |
| P-12 | 0.6.0 published to JSR + npm + crates.io | release transcript | serious | DoD | open | | blocked on arc09 |
| P-13 | docs/guides + SKILL aligned with shipped 0.6.0 (no unreconciled guide drift) | arc07 drift-audit demo; **`make test-docs` green** | correctness | project-plan | open | **doctests now green (476/0)**; arc07 slice01 closed the red-CI item; slice02 current-drift recon closed/CDC-verified; slice03 build/dist/publish guide refresh closed/CDC-verified (`dcf23f5`) | next docs work: Deno workflow reconciliation; compiler defect `D-2608-W2HF` moved to arc10 slice04 so docs do not paper over invalid-JS emission |
| P-14 | `template` ICU MessageFormat / i18n works, Rust↔JS equivalent | DD-55 ICU cross-compiler tests | serious | DoD | **done** | arc08 (DD-55) merged; 25 ICU cross-compiler tests green | escaping consistent with D-2 fix |
| P-15 | arc10 (compiler-completion) closed + composed — DD-58 enforced on every compile path; DD-37 `_kernel` retired | ptr: arc10 closing-report + operator gate | serious | arc10 bubble-up (v1.15 — the ledger predated arc10) | **done** | 3/3 slices (`faee8a1`/`feb056c`/`2f6a84d`); **operator gate GO 2026-07-05 23:29** (5-form demo verbatim; `kernel:` resolves; suites reconciled) — reproduced at arc scale | |
| P-16 | arc11 (source-only-test-build) closed + composed — no compiled `.js` in the source tree at any moment; buried-intent inventory empty-or-tracked | ptr: arc11 closing-report | serious | operator observation + CDC systemic finding (v1.16) | **done** | 2/2 slices (`75c9cc2`/`4f2a628`); **operator gate GO 2026-07-05 23:31** (three-moment demo 0/0 with `./bin/lykn`, destination proven by the compile message; sweep + hygiene from the earlier session) | P-7's demo unconditional; tracked candidates instantiated |
| P-17 | arc12 (test-topology) closed + composed — corpus executes exactly once per `make check`, zero per `make test-docs`; suite/doctest counts unchanged; verification wall-clock materially reduced | ptr: arc12 closing-report + sentinel census | serious | operator observation + CC redundancy report (v1.18) | **done** | slice01 (`3612cad`); 1m52s→2.6s / >2m→1m04s; **operator gate GO 2026-07-05** (suite run green; census grep 3 line-mentions ≈ 1 compile + 1 execution — once, vs ~16 before); `lykn test` in 13s during the arc11 demo | the verification cost that was blocking the gates is gone |
| P-18 | arc13 (expander-coherence) closed + composed — the name-binding matrix converges on both backends per DD-60; no invalid output at rc=0 for any name class | ptr: arc13 closing-report + the conformance-corpus run | serious | arc05/slice02 F-4 recon + operator blocker call (v1.23) | done | **reconciled** — gate GO 2026-07-09 (arc13 closing-report §5 gate record: ancestry ×6, `make check` 100%, matrix 1947/53 exact = the two documented classes, D2 demos verbatim) | arc05 slice03 / P-11 unblocked; the corpus closes the coverage gap permanently |
| P-19 | arc15 (surface-syntax-traps) closed + composed — method-call-on-expression (and every non-atom-head + keyword-first shape) is a hard **compile + `lykn check` error** with a threading fix-it; no guide teaches the trap; no source regressed | ptr: arc15 closing-report + host `lykn compile`/`make check` | serious | arc06/slice02 #6 finding + operator pushback (v1.33) | **done** | [`arc15-surface-syntax-traps/closing-report.md`](./arc15-surface-syntax-traps/closing-report.md): A-1…A-6 met; trap repros exit 1 with fix-it; atom/thread positives compile and lint green; guide sweep clean except documented-as-wrong/prose/comment sites; `make test-docs` 476/0; final `make check` green on the committed close-documentation state | **Closed 2026-08-08.** DD-64 still -DRAFT (odm = Duncan); slice03 Option C remains routed to 0.7.x, not dropped |
| P-20 | **arc16 (Lykn Book 0.6.0 edition) drafted and closed** — the book's 0.6.0 edition is complete, and every language/DevX defect it surfaced is either fixed in 0.6.0 or routed with a named home | ptr: arc16 closing-report + the defect-routing table | **serious** | operator decision 2026-07-24 (release-gating call) | **open — planning home created, arc-plan pending** | Iter-01 (the drift inventory), the 6–8-iteration kickoff thread, the fence-wiring spec and the dogfooding friction log are tracked under `arc16-book-0.6.0-edition/design/` (v1.38); sibling book guidance/tool homes are tracked (`91fee17`, `a042e18`) | **Gates arc09.** Prerequisite (1) — *the plan gets a git home* — is met. Prerequisite (2), the operator's D-1…D-5 decisions, is still open. Deliberately *not* planned in detail yet — *plan late, plan deep*, and the layout is a confirmation-protocol call |
| P-21 | **Every durable artifact has a tracked home, and no tracked document cites a path that does not resolve in git** | `make check` dangling-path gate (green) + a manual sweep of the pre-existing citations | correctness | operator-directed housekeeping, 2026-07-25 (v1.38) | **done** | register + owed-rows relocated to `docs/backlog/`; arc16 material relocated to `arc16-book-0.6.0-edition/design/`; `02-artifact-homes` delivered the gate; `03-citation-repoint` closed the red gate and shrank the census 631 -> 601; sibling repos now track `AGENTS.md` / `CLAUDE.md` and the book audit tool (`91fee17`, `a042e18`) | **Closed 2026-08-08.** `make check-cited-paths`, the Deno cited-path integration test, and full `make check` are green. |
| P-22 | no-else `if` in expression position fails before invalid JS is emitted | arc10 slice04 close + `./bin/lykn check`/`compile` negative fixture; positive DD-50 fixtures still pass | serious | arc07 slice02 / D-2608-W2HF | open | [`arc10-compiler-completion/slice04-no-else-if-expression-error/slice-doc.md`](./arc10-compiler-completion/slice04-no-else-if-expression-error/slice-doc.md) draft plan exists | gates arc09; fixes compiler truth before arc07/arc16 teach the settled surface |

DoD verdict, gate (go / adjust / kill), and the per-row walk are recorded in
this project's `closing-report.md` at release time.

## 5. Version History

### v1.48 — 2026-08-08 (arc07 slice03 CDC-verified)

arc07 slice03 (`dcf23f5`) is CDC-verified: the build/dist/publish guidance
cluster is closed, the stale publish error string is fixed, and the related
backlog rows are closed/no-op with reproduced evidence. P-13 remains open
because arc07 still has slice04 Deno workflow reconciliation plus arc-level
composition rows A-3/A-4/A-5.

### v1.47 — 2026-08-08 (arc10 reopened; arc07 slice03 opened)

Operator routed `D-2608-W2HF` back into **arc10 compiler-completion**. The
original arc10 gate remains true for DD-58/DD-37, but arc10 is reopened with
draft **slice04 no-else-if-expression-error** so the compiler/check path, not
arc07 prose, fixes no-else `if` in expression position emitting invalid JS at
rc=0. Added P-22 to make that release-gating follow-up visible at project
scale.

Opened **arc07 slice03 build-dist-publish guide refresh** with the full open
set. Current release sequence is now **arc10 follow-up + arc07 + arc16 ->
arc09**.

### v1.46 — 2026-08-08 (arc07 slice02 closed; next docs split)

arc07 slice02 (`66a3565`) closed as recon-only and was CDC-verified. P-13
remains open, but the drift shape is now current: build/dist/publish docs first,
Deno workflow reconciliation second, optional `.d.ts` docs later only with a
fixture, and a compiler follow-up outside the docs-only stream for no-else `if`
in expression position emitting invalid JS at rc=0 (`D-2608-W2HF`).

The release sequence is unchanged: **arc07 + arc16 -> arc09**.

### v1.45 — 2026-08-08 (arc07 slice02 recon opened)

arc07 is now active. Opened slice02 as a recon-only current-drift pass: classify
the old `guide-drift-cleanup-plan` and `proposed-skill-and-guide-additions` seed
items against the actual 0.6.0 branch, sweep current `docs/guides/` and
`assets/ai/SKILL.md`, behaviour-check live compiler/CLI claims, and recommend
the next implementation slice breakdown. This keeps arc07 from editing against
pre-arc05/arc06/arc15 assumptions.

P-13 remains open; its evidence now reflects the current doctest baseline
(476/0) and the active recon slice. The release sequence is unchanged:
**arc07 + arc16 -> arc09**.

### v1.44 — 2026-08-08 (arc15 closed; P-19 done)

arc15 closed after arc-scale reproduction. The three canonical DD-64 trap shapes
now fail compilation with the method-on-parenthesized-expression diagnostic and
threading fix-it; the atom and threaded positive forms compile and lint green;
the guide sweep leaves only documented-as-wrong/prose/comment examples;
`make test-docs` is green with 476 passing blocks and 0 failures; and final
`make check` is green on the committed close-documentation state. P-19 is done.

The remaining release sequence is now **arc07 + arc16 -> arc09**. arc07 owns the
broader guide/SKILL drift pass; arc16 owns the book's full-surface review; arc09
cuts the release after those gates. slice03's fully typed classifier rewrite
remains an explicit 0.7.x route, not a 0.6.0 close claim.

### v1.43 — 2026-08-08 (arc15 slice04/slice05 closed; arc close next)

arc15 slice04 closed the sibling traps and slice05 closed `D-2608-H7FN`, the
nested bare-parameter `fn` mismatch surfaced by slice04's execution probe. The
remaining release sequence now starts with arc15 close, then arc07 + arc16, then
arc09.

### v1.42 — 2026-08-08 (`02-artifact-homes` closed; P-21 done)

The L-5/L-6 remediation landed in the sibling book repos. Both repos now
standardize on tracked `AGENTS.md`, keep `CLAUDE.md` as a symlink to it, and
include the new assistant-authored commit trailers. The book repo also tracks
the fence-audit tool. Evidence commits: book `91fee17`, writers-guide
`a042e18`.

**Close result.** `02-artifact-homes` is closed after CDC re-verification:
L-1...L-9 are final, `make check-cited-paths` is green, the Deno cited-path
integration test is green, and full `make check` is green. P-21 is done.

**Sequence update.** With artifact homes closed, the next work was arc15
slice04 + arc15 close, then arc07 + arc16, then arc09. v1.43 supersedes this
now that slice04 and slice05 are closed.

### v1.41 — 2026-08-08 (`02-artifact-homes` CDC verification returned)

CDC verified `02-artifact-homes` after `03-citation-repoint` closed. The
cited-path mechanism reproduced: `make check-cited-paths` is green, the Deno
cited-path integration test is green (22 passed / 0 failed), and full
`make check` passed after rerunning with normal filesystem access.

**Blocking finding.** L-5 and L-6 do not reproduce. The book and writers-guide
guidance files are present only as untracked sibling-repo files, and the book
fence-audit tool is likewise present only under an untracked tools tree. This
is the same structural class `02-artifact-homes` exists to prevent: a useful
artifact visible on one machine but not protected by git.

**Sequence update.** P-21 remains open. The next unit is a narrow remediation:
track those sibling-repo artifacts under the intended convention, or explicitly
amend the ledger if the convention changed, then rerun CDC verification. Only
then continue to arc15 slice04.

### v1.40 — 2026-08-08 (`03-citation-repoint` closed; path gate green)

`03-citation-repoint` closed through source commits `774e9eb`, `a3055c9`, and
`2df2130`, followed by the close-documentation update. Migrated citations now
point at tracked homes, four already-decided planning artifacts are tracked
under their assigned arc homes, and historical move/rename prose was preserved
rather than rewritten into false claims.

**Gate fact.** `make check-cited-paths` is green at HEAD:
567 documents checked on `release/0.6.x`, with 601 historical citations accepted
via `scripts/cited-paths-census.tsv`. The Deno cited-path integration test is
also green: 22 passed, 0 failed.

**Census fact.** The frozen census shrank in place from 631 accepted pairs to
601; the diff was deletion-only. The residual accepted rows remain historical
closures under the named discovery/operator dispositions, not proof that those
old paths are healthy.

**Sequence update.** P-21 remains open, but for a narrower reason:
`02-artifact-homes` still needs CDC verification/close. The next sequence is
therefore `02-artifact-homes` close discipline, then arc15 slice04 and arc15
close, then arc07 plus arc16, then arc09.

### v1.39 — 2026-08-08 (status reconcile against `release/0.6.x`)

Cross-checked `BOOTSTRAP.md`, `README.md`, `status.html`, the standalone slice
directories, and the current `release/0.6.x` git log. This revision is a status
reconcile only; it does not close implementation work.

**Corrections.** arc06 is closed, not active; `01-macro-entry-diagnostics` is
closed, not open; arc16's planning home exists, though its arc-plan remains
unwritten; `02-artifact-homes` delivered the path gate but lacks a CDC
verification file; and `03-citation-repoint` is the current open standalone
slice created after artifact-homes.

**Current gate fact.** `make check-cited-paths` was run locally on
`release/0.6.x` on 2026-08-08 and reported 34 dangling citations. P-21 stays
open until those are repointed, frozen with the intended rationale, or otherwise
routed by the operator.

### v1.38 — 2026-07-25 (artifact homes: the register, arc16's planning home, and a `make check` gate)

**What changed.** Every durable artifact that was living in a gitignored tree
now has a tracked home, and the class is closed structurally rather than by
vigilance.

- **The Discovery Register moved to `docs/backlog/discoveries.md`** — *the path
  this document was already citing at §7 and §8*, and that the
  `01-macro-entry-diagnostics` slice set cited three more times. Nobody invented
  a wrong path; the agreed home was simply never created, so **five committed
  documents carried a dangling reference from the day they were written**, and a
  committed spec (`fence-wiring-spec.md`) cited two of the register's IDs. A new
  `docs/backlog/README.md` carries the row format, the section scheme, and the
  **routing rule**: *a row is not `routed` until the destination file exists in
  git and contains it* (`D-2607-8HTN`, generalised).
- **arc16's planning home created** at `arc16-book-0.6.0-edition/`, populated
  with the material that had been untracked. See the roadmap row.
- **`workbench/` is now defined as scratch** — nothing durable, nothing cited —
  recorded in the `AGENTS.md` of all three repos. The book and writers-guide
  repos had **no `AGENTS.md` at all**, which is why their layout decision had
  nowhere to be written down.
- **New standalone slice `02-artifact-homes`** carries the ledger for the above
  plus the `make check` gate that fails on a tracked document citing a path
  that does not resolve in git.

**The root cause, named honestly.** `PROJECT-MANAGEMENT.md` Part VIII settles
audit reports at `workbench/<date>-…` — it assumes `workbench/` is durable.
This repo ignores `/workbench` wholesale. Each half is defensible; together they
routed durable artifacts into an invisible tree, and the mismatch was invisible
*because each half looked correct on its own*. Recorded in `status.html`.

**Factual correction folded in (2026-07-25, operator-caught).** Several documents
— `status.html` ×3, this file, and the v1.38 text as first written — said the
book's plan was an **8-iteration** program. The kickoff thread's own heading is
*"Why this is a **6–8** iteration thread"*: an estimate, not a count. Corrected
in place. The word itself is also a trap for arc16's planning: those Iter-1–8
units are pre-reorg vocabulary and map to **slices**, whereas `iteration` now
means a fix pass on a slice that missed spec (budget: five). Do not carry the
word across.

**Which-child-surfaced:** not a slice — an operator-directed housekeeping pass
during the arc16 pre-planning conversation, after a memory-vs-git reconcile
found the register untracked. `P-21` opened.

### v1.37 — 2026-07-24 (**arc06 CLOSED — gate GO**; 0.6.0's founding goal met)

**Operator gate GO.** The host reconcile ran in full — runsheet Parts A, B, C and
C-bis all green — so arc06's runtime rows moved from **CC-attested** to
**operator-reproduced**, the top evidence tier. That matters most for the arc's
highest-stakes claim: with a link active, `lykn dist` staged **zero** linked
references, so a local dev path cannot reach a published package. That property
was architecturally guaranteed by inspection, then attested, and is now
reproduced. **P-6 → done.**

**arc06 closed at 7 slices** (01 lang-exports-gap · 02 mycelium re-audit · 03
`lykn add` · 04 `lykn link`/`unlink` · 05 N1 import-by-specifier · 06
version-consolidation · 07 link-registry-specifier). **0.6.0's founding goal —
consume lykn as a dependency, end to end — is met.**

**Two findings surfaced by the reconcile itself**, both logged rather than
absorbed into the close: a `lykn add` resolve failure leaks deno's `Uncaught (in
promise)` plus a `$deno$eval.js` frame into a user-facing error — the same root as
`01-macro-entry-diagnostics` M-5 at a different call site; and Part B showed that
`lykn link <package-name>` already writes the entry-file + directory pair that the
linked-*specifier* path lacks, which re-scopes the routed 0.7.0 runtime-override
item from new design to a parity fix between two sibling code paths.

**Recorded as a pattern:** host reconcile is a **discovery surface, not a
formality.** This arc produced two unplanned slices (06, 07) from the operator's
runsheet pass and two further findings from running it — three separate times the
reconcile found work no plan had anticipated. Future arcs should budget for it.

Remaining 0.6.0: **arc15 slice04 + close → arc07 (docs) + arc16 (book) → arc09
(release).** Which-child-surfaced: arc06's gate.

### v1.36 — 2026-07-24 (standalone slice `01-macro-entry-diagnostics` opened)

**A new unit that is deliberately not an arc06 row.** While running arc06's
host-reconcile runsheet (Part C-bis — the negative check proving a `lykn link`
override is live), the operator hit a diagnostic that is *confidently wrong*:
when the resolved macro package **directory does not exist**, both compilers
report "no macro entry found" and hint *"add `lykn.macroEntry` to the package's
`deno.json`"* — instructing the user to edit a file inside a directory that
isn't there. Neither implementation checks whether the directory exists before
walking its candidate chain.

Two further defects found in the same recon: the error names a resolved path the
user never typed (the `lykn link` overlay that produced it is invisible in the
message), and the JS expander's throw escapes to Deno's top level, presenting an
expected user-facing failure as `Uncaught (in promise)`.

**Not routed to arc06** — that arc is CLOSE-READY at the operator's gate, its
capability is delivered, and `find_macro_entry` predates slice07 entirely
(slice07 only made the path reachable a new way). Reopening it a third time in
one day would be the wrong instinct. Opened instead as a **standalone slice**
under the Part II collapse; see the note in §2.

**The structural point of the slice is parity, not the message.** The diagnostic
exists twice — `pass0.rs` and `expander.js` — and has *already drifted*; nothing
compares them. This is DD-57's Q4=A / W-3 problem in miniature, so ledger row
**M-4** requires a test that fails when the two diverge. Fixing the wording
without it only resets the drift clock.

Which-child-surfaced: the operator's arc06 host reconcile. Discoveries logged to
`docs/backlog/discoveries.md`, including a candidate **systemic** entry — "no
coverage → the uncovered case ships wrong" has now appeared three times in one
day (slice07's rewritten-with-zero-coverage function, the test whose name
overclaimed its guard, and the missing-directory case here, which has no test in
either compiler).

### v1.35 — 2026-07-24 (arc06 CLOSE-READY — all 7 slices closed; 0.6.0's founding goal met)

**arc06 closes the goal the whole 0.6.0 dive was in service of.** slice07's
iteration 1 (`72a1cfd`/`70666d0`) resolved all six CDC-review findings — the
blocking effective-config regression fixed *and* covered by four table tests
(the missing coverage was the defect's cause, not a side issue), the advertised
guard given a real test, and the capability narrowed to what was actually
demonstrated: `lykn link` on a literal registry specifier covers **macro
modules**; a runtime import of a linked specifier errors loudly rather than
silently resolving to the published package, with full runtime override routed
to 0.7.0. **slice06** verified the same day (V-1…V-6). Arc ledger **A-1…A-9 all
met**; `closing-report.md` **re-issued** over the full 7-slice walk rather than
edited, since the superseded version predated slices 06/07. **P-6 → CLOSE-READY;
gate is the operator's** after the host reconcile.

**Routed out of the close, both with named homes and re-entry conditions:** full
runtime override of a linked literal specifier (0.7.0); the drop-workspace
scoped assumption (0.7.x backlog, trigger = *first multi-package downstream that
links*); and — surfaced by slice06's independent verification sweep — a **arc09
release precondition**: `dist/` is stale at `0.5.2` while the tree is
`0.6.0-dev`, and `lykn publish --no-build` exists precisely to publish an
already-staged `dist/`, so a build-skipping publish would ship 0.5.2 metadata
from a 0.6.0 tree.

**Process findings bubbled up** (both in `docs/backlog/discoveries.md`): the
arc-plan went stale at slice02 while five slices closed under it — correct
recon-first scoping is *why* nobody re-read the plan, so the rule is now
re-reconcile at each slice close, not only at arc close; and two distinct ways
for green to mean nothing — a rewritten function with zero coverage, and a test
whose name claimed a guarantee its body didn't assert. Which-child-surfaced:
arc06 slices 06 + 07 and slice07's CDC review.

### v1.34 — 2026-07-24 (arc06 REOPENED; **the Book enters 0.6.0 scope and gates the release**; arc16 reserved)

Three changes, two of them corrections to this plan rather than new work.

**1 — The Lykn Book 0.6.0 edition is now in scope and gates arc09 (operator
decision).** v1.0's boundary text — "the Book update … is tracked as its own
project, not as an arc here" — is **superseded** in §1 (struck, not deleted).
The operator's reasoning: drafting the 0.6.0 edition is a full-surface review of
the shipped language, so it will surface bugs and DevX defects; finding them
after the cut means point releases on 0.6. Cheaper before the gate than after.
Added **arc16 · book-0.6.0-edition** to the roadmap as a **reserved slot** and
**P-20** to the project ledger; **arc09's Depends-on now includes arc16**, and
the dependency-sequence note is revised — arc07 (guides) and arc16 (book) are
**siblings with a feedback loop back into the language arcs**, not a straight
line into release.

*Deliberately not done here:* arc16's planning directory. The layout is a
confirmation-protocol decision (PROJECT-MANAGEMENT Part VI) and the operator is
mid-investigation. Reserving the slot without inventing the home is the point.

**2 — The routing failure this correction exposes (worth recording).** A CDC
audit found the book's planning material — a 6–8 iteration program with buckets,
per-iter ledger names and five open decisions, its Iter-01 audit *complete* —
exists only as **two untracked files in `lang/workbench/`** (gitignored), in the
wrong repo, describing work in a third. The `release/0.7.x` BACKLOG recorded it
as "owned by the Book project," but no such project was ever instantiated: the
book repo has no plan, no arc tree, an empty odm index, and its last commit is
**2026-04-19**. *Routed* had become *re-buried* — the exact failure the bubble-up
discipline exists to catch — and it survived because the pointer named an owner
that did not exist. **Lesson for the ledger: a routing row must name a home that
can be opened, not an owner that might someday exist.** Giving the material a git
home is arc16's first task.

**3 — arc06 reverted CLOSE-READY → ACTIVE.** Two slices landed after its
closing-report was written (**slice06 · version-consolidation** `caeb2e4`;
**slice07 · link-registry-specifier** `58e22e8`), and slice07 is now in
**iteration 1**: CDC review returned a **blocking regression** (in
`write_effective_deno_config`, the overlay is silently dropped when
`project.json` has no `imports` key — `lykn link` prints success and applies
nothing), plus an untested guard, an untested rewritten function, and an open
question about whether the exact-key→directory-value entry survives Deno's
import-map parsing for *runtime* imports. An arc closes when its last slice is
CDC-closed, so arc06 is not closeable. `arc-plan.md` → **v1.3** (slices 06/07
added to a breakdown that had gone stale at slice02; A-6/A-7 → met; **A-8**/
**A-9** added); the arc `closing-report.md` is marked **superseded in part** and
will be **re-issued**, not edited, at the real close. **P-6 → open (ACTIVE).**

Which-child-surfaced: **arc06 slice07's CDC review** (items 3, and the audit in
item 2 ran alongside it) + **operator decision** (item 1).

### v1.33 — 2026-07-24 (arc06 → CLOSE-READY; arc15 slices 01–03 resolved; 0.7.0 candidates consolidated)
**arc06 · cross-project-dep-ergonomics → CLOSE-READY** — the arc the whole
0.6.0 dive was in service of ("consume lykn as a dependency end-to-end").
Slices 02–05 delivered + CDC-verified since v1.32: **slice02** mycelium
re-audit (`a2e9b00`; DD-63 promoted, odm); **slice03 `lykn add`** (`f9f9014`)
— exact-version pin via deno-shell (the `~>` DSL + `nodejs-semver` engine
routed to the 0.7.0 build-tool arc, BACKLOG A1.1); **slice04 `lykn
link`/`unlink`** (`e1c0dd7`) — non-destructive git-ignored `project.local.json`
overlay, **safety property architecturally guaranteed** (dist/publish read the
raw `project.json`; link/unlink never write it); **slice05 N1
import-by-specifier** (guide `42500a9`; mycelium `e60af9d`) — the compiler
preserves import specifiers verbatim (`emit_import`), so N1 is pure convention,
**zero `lang` change**. **A-6 green** (CC-attested): mycelium as a downstream —
`lykn build` ✓ · `lykn test` **43/0** · `lykn publish --jsr --dry` green,
dev-only self-key absent from the staged config (publish-safe). Closing-report
A-1…A-7 all met. **P-6 → CLOSE-READY; gate = operator's** after host reconcile.

**arc15 · surface-syntax-traps — slices 01–03 resolved.** slice01 reject
(`9ca9c7e`) + slice02 lint/check-parity (`d6c23b5` + follow-up **B** `90cf211`)
**closed/CDC-verified** — `((express x):method …)` is now a hard compile +
`lykn check` error with a threading fix-it. **slice03** (type-safe hardening)
**DEFERRED → 0.7.0 (Option B kept).** Two verify-before-writing self-stops
(CC's discipline) established that match-awareness is **irreducible without
typing the nested exprs**: classification leaves nested exprs raw
(`Bind.value`/`FuncClause.body` are `SExpr`), so a nested guarded `match` keeps
the `((pattern) :when …)` trap shape (proven vs `data-types.lykn:54–59`).
Option B (structural `is_match_clause`/`ptr::eq` exemption) is the verified
0.6.0 guarantee; the real fix (**Option C = fully-typed classification**) is
research → `release/0.7.x` BACKLOG **A6**. Lint rule **left as-is** (operator,
07-24) — its retirement folds into Option-C, not a standalone 0.6.0 change.
**slice04** (sibling traps ID-32/ID-33) shaped. **P-19 added.**

**0.7.0 candidate register consolidated (2026-07-22)** into `release/0.7.x` →
`docs/design-v0.7.0/BACKLOG.md` (§A big-rock arcs incl. **A6 fully-typed
classification**; §B routed 0.6.0 items; §C memory-only). §1's list is retained
here as the in-tree provenance snapshot. Remaining 0.6.0 work: **arc06 gate →
arc15 slice04 + close → arc07 (docs) → arc09 (release).** Which-child-surfaced:
arc06 slices 02–05 + arc15 slices 01–03 closes + operator direction.

### v1.32 — 2026-07-21 (arc06 ACTIVE — slice-planned recon-first)
arc06 (the 0.6.0 dive's original motivation) resumed after arc05 closed.
Grounding: `lykn add` does **not** exist (net-new; the DD-51 replacement); the
`lykn new` scaffold is monorepo-shaped (breaks external projects); mycelium is
host-only (not a Cowork folder → the audit is CC-run). The April-2026 mycelium
report (14 issues) is largely stale post-0.6.0, so the arc opens **recon-first**:
**slice02 · mycelium re-audit** (recon-only, host-run) re-establishes ground
truth before slices 03/04 are detailed — the arc10 "verify the contract" lesson
at arc scale. Then **DD-63 + slice03 (`lykn add`)** and **slice04 (external
scaffold + resolution hardening)**, arc close = a mycelium end-to-end demo. arc06
**unblocks arc07** (the guide pass can't document the dependency/publish/
external-test workflows until they work). arc-plan v1.2; arc ledger opened
(A-1…A-7). Sequence: **arc06 → arc07 → arc09.** Which-child: arc06 activation.

### v1.31 — 2026-07-21 (arc14 · comment-retention scheduled 0.7.0)
Operator decided the arc14 release boundary: **comment-retention → 0.7.0**
(additive capability, not 0.6.0 toolchain alignment). arc14 stays in the design
tree as the home for the deferred lint-suppression mechanism (DD-62) and is added
to the §1 Post-0.6.0 tracked candidates with its named source (arc05/slice04).
0.6.0 is unaffected — its remaining work is **arc06 → arc07 → arc09**.
Which-child: operator decision.

### v1.30 — 2026-07-21 (GATE GO — arc05 CLOSED; P-5/P-11 reconciled)
Operator ran the arc05 reconcile (closing-report §5): **`make check` green**;
the P-11 demo reproduced at project scale — `seeded_test.lykn` → **16 findings,
all 16 rules, exit 1**; `clean.lykn` → 0 findings, exit 0. **P-5 (arc05
closed+composed) and P-11 (`lykn lint` lints Lykn source) → reconciled; arc05 →
Closed.** arc05 delivered the 0.6.0 linter (`lykn lint` over Lykn source, 16
rules, resolution-aware, replacing the compiled-JS surface) and spawned arc13
(closed) + arc14 (comment-retention, seeded). Remaining 0.6.0: **arc06 → arc07 →
arc09.** Which-child: arc05 gate.

### v1.29 — 2026-07-21 (arc05 slice04 CLOSED; arc05 CLOSING — P-5/P-11 met)
slice04 delivered (`2feb5fd`, CDC-verified): `lykn lint` wired into `make check`
green (path-scoped), guide-09 reclassified (46 entries; all 12 formerly-
ELIMINATED corrected; ID-42 body fixed), guide-15 + SKILL, the P-11 corpus. arc05
arc-ledger A-1…A-7 all done → **the 4 slices compose**; `closing-report.md`
written with the project bubble-up. **P-5 (arc05 closed+composed) and P-11
(`lykn lint` lints Lykn source) → done**, reproduce at project scale on the host
(arc05 closing-report §5 — `make check` + the 2 P-11 demo commands). Bubble-up:
arc05 spawned **arc13** (expander-coherence, closed) and **arc14** (comment-
retention, seeded); routed guide-15 stale-tool drift → arc07, the `_test.lykn`
predicate coupling → hardening backlog, the orphaned `LintContext` API → cleanup.
Remaining 0.6.0 sequence: **arc06 → arc07 → arc09.** Which-child: arc05 close.

### v1.28 — 2026-07-21 (arc05 slice04 SCOPED; arc14 · comment-retention created)
Scoping slice04 surfaced that the lint-suppression mechanism depends on **reader
comment-retention**, which no backend has (readers drop comments; no `SExpr`
trivia). Per the operator's directive (retain comments → annotate provenance
surface→kernel → strip-or-preserve at JS emit — the LFE comment-drop pain made a
first-class goal), this became **arc14 · comment-retention** (DD-62 drafted;
release boundary 0.6.0-vs-0.7.0 is the operator's call, CDC leans 0.7.0).
**Suppression is deferred to arc14**; slice04 path-scopes the 2 kernel-interop
dogfood findings so `make lint` is green without it. slice04 (arc05's last
slice) = `make lint` wiring + guide-09 reclassification (A-6) + guide-15 + SKILL
+ P-11 (A-4); arc05 close is CDC's close-set after. 0.6.0 DoD is unaffected
(inline suppression isn't required). Which-child: slice04 scoping.

### v1.27 — 2026-07-21 (arc05 slice03 CLOSED, CDC-verified)
CC delivered slice03 at `ea429e2` (source-only); CDC-verified by code-review +
grep (F-1…F-6 reproduced-by-code; F-8/F-9 CC-attested, operator host `make
check` + dogfood reconciles). `lykn lint` is now a resolution consumer
(`resolver::resolve` + the `as_form_head` funnel gates every head-matching rule
on bound names) and gained the ID-12 shadowing rule riding the resolver's single
scope model — grep-confirmed zero scope logic in `lint/` (the arc13 lesson
held). arc05 arc-ledger A-1/A-2/A-3 → done (slices closed), A-5 → done (dogfood:
118 files, 2 benign fixtures triaged, 0 shadowing FPs). **slice04 is the arc's
last slice** (suppression + `make lint` + guide-09/15 + SKILL + P-11 → arc
close); P-5 (arc05 closed) stays open until then. Bubble-up routed to slice04:
the orphaned `LintContext` ancestry API (delete-or-keep), the suppression
motivation, and the stale-`bin/lykn`-guard-bites-`cargo test` note. Sequence:
arc05 → arc06 → arc07 → arc09. Which-child: slice03 close.

### v1.26 — 2026-07-21 (arc05 RESUMED; slice03 scoped as a 1→2 split; arc13 A-6 closed)
Fresh CDC session resumed arc05 after the 07-09 gate (confirmed: nothing
landed on `release/0.6.x` since — tip `ff0e72e`; only untracked item is the
separate `docs/design-v0.7.0/` tree). Grounding slice03 against the actual
code found the resolution-consumer work small (`resolver::resolve` is `pub`
+ structural; `as_form_head()` gates all head-matching rules through the one
shared `atom_call` helper) but the v1.4/v1.5 "slice03" bundle too large for
one context — **split 1→2** (arc05 arc-plan v1.6): slice03 = resolution-
awareness + shadowing + the ID-42 re-answer + dogfood; **slice04** =
suppression + `make lint` wiring + guide-09/15 + SKILL + the P-11 demo +
arc close. **arc13 A-6 closed** at this scoping (its Verify was the scoping
note): the ID-42 re-answer is **no lint rule** — reserved words are D2
compile errors, form-named params legally shadow via D1 (operator steer).
slice03 open set written; P-11/P-5 still gated on slice04/arc05 close.
Sequence unchanged: arc05 → arc06 → arc07 → arc09. Which-child: the
slice03 scoping session (CDC).

### v1.25 — 2026-07-09 (GATE GO — arc13 CLOSED; P-18 reconciled; arc05 UNPAUSED)
The operator ran the full arc13 gate (closing-report §5 record):
ancestry ×6 ok, `make check` 100%, **matrix 1947/53 exact** (the two
documented classes precisely, CDC-recounted), D2/D1 demos verbatim.
**P-18 → done/reconciled. arc05 unpauses** — its slice03 (the resume)
is the next work: lint consumes resolution (DD-61 tooling accounting),
the ID-42 re-answer (which closes arc13's A-6, left open by design),
shadowing rule, guide-09 reclassification, lint-suppression,
`make lint`, P-11 demo. Sequence: **arc05 → arc06 → arc07 → arc09.**
Which-child-surfaced: arc13 (gate).

### v1.24 — 2026-07-09 (arc13 → CLOSING; the arc bubble-up received)
All 11 arc13 slices CDC-closed (2026-07-06 → 07-09; six source SHAs
`dc37ae9`/`7d86703`/`dab4405`/`4c12301`/`c19a1fb`/`a0b24b9`); arc
closing-report written with the §5 host-gate runbook — **P-18 flips on
gate GO** (its Verify = the closing-report + corpus/matrix run,
exactly §5 steps 3–5). The bubble-up (which-child: arc13): **(a)** the
**Resolve-Once architecture (DD-61)** is a durable structural asset —
resolved-atom tags, per-backend walkers, `as_form_head()`/`formHead()`
doors, by-construction payload privacy, four standing CI checks —
later arcs inherit it (operator: a pivotal 0.6.0 feature); **(b)** odm:
DD-61 promotion pending; DD-60 canonical (0062) current through
07-09 (5 refinement entries + label footnote); **(c)** arc09 gains
breaking notes (D1: bound macro-named params resolve, blast radius 0;
D2: reserved-word names error); **(d)** **arc05 unpauses on gate GO**
— its slice03 scope shrinks as intended (arc13 A-6 hands off: the
ID-42 reserved-param-name lint question is re-answered at scoping from
the fixed state, likely a much smaller rule or none); **(e)** standing
caution recorded in DD-61 as-built: the A6 layers bound *dispatch*,
not emit-time *heuristics* (the `contains_await` lesson). No arc-scale
silent drops. Sequence unchanged: **arc05-resume → arc06 → arc07 →
arc09.**

### v1.23 — 2026-07-06 (arc05 PAUSED on an expander-coherence blocker; arc13 created)
arc05/slice02 delivered (CDC verification pending commit): 12 rules → 15
live; **ID-44 fixed on both backends** (the JS-first recon found the JS
compiler shared the bug); ID-03 → warn (measured 0/10 FP,
operator-confirmed); honest dogfood (a rule bug fixed — `!=` is already
surface; 2 findings acknowledged). **The ID-42 recon self-stopped and
exposed the real disease: the Rust and JS expanders resolve param-vs-macro
shadowing differently** — same source compiles on Rust, throws on JS; Rust
emits wrong code for 7 macro-named params; JS reserved words produce
invalid JS at rc=0. A P-9-class semantic divergence outside the corpus's
coverage. **Operator: blocker — "pause arc05, fix the expander divergence…
then we can just do the right thing." Created arc13 · expander-coherence**
(CDC LoE: arc-worthy — DD-60 semantics + both expanders + a conformance
corpus; 3 slices, recon-first). **P-18 added.** Sequence: **arc13 → arc05
slice03 → arc06 → arc07 → arc09.** Also filed: lint-suppression mechanism
(arc05 slice03 candidate). Surfaced by: arc05/slice02 close + operator
decisions.

### v1.22 — 2026-07-06 (arc05 slice01 closed; two compiler-enforcement promotions decided)
`lykn lint` exists (`1989138`: machinery, CLI replacing the issue-#1 stub,
3 pilots, insta snapshots; smoke dogfood 117 files clean). The F-1
compiler-verification of all 19 rule candidates caught three drifts:
ID-39 already compiler-enforced; ID-42's guide "Throws" claim void (but a
param named `fn` semantically shadows the special form); **ID-44 a
compiler bug — rc=0 with unparseable JS emitted** (Principle 3 violation).
**Operator decisions:** ID-44 → fix the compiler (both backends; guide
claim becomes true); ID-42 → compile-time disallow of reserved param
names, recon-gated (set + blast radius measured; lint-warn fallback).
Both are **breaking-change items for arc09**. slice02 scoped: 12 verified
rules + the 2 gated fixes + ID-03 severity-by-measurement + real dogfood.
Surfaced by: arc05 slice01 close.

### v1.21 — 2026-07-06 (arc05 ACTIVE — the linter, at last)
arc05 slice-planned with the operator's design calls: **Broad v1 rule set**
(15 tier-1 shape rules + missing-type-annotations + shadowing + the 2 arc11
conventions rules), **architecture package** (Rust over pre-expansion SExpr;
hardcoded dispatch; text + `--format=json`; error/warn; read-only; exit
0/1/2; insta snapshots), **DD-59 drafted** (`arc05/design/…-DRAFT.md`, odm
= Duncan). Kickoff Q0 resolved by history (the JS-lint wrapper is gone;
`lykn lint` = the issue-#1 stub, replaced in slice01). Three slices:
infra + 3 pilots + **rule-inventory compiler-verification pass** (arc10
lesson #4, proactive) → shape corpus + repo dogfood → context rules +
guide-09 enforcement labels. Arc ledger opens with the P-11 demo (A-4),
the dogfood row (A-5), and guide-09 alignment (A-6 — closes the
reclassification debt that spawned arc10). Surfaced by: operator go-ahead.

### v1.20 — 2026-07-05 (GATE GO — arc10, arc11, arc12 all CLOSED)
Operator gate session (23:29–23:33, `./bin/lykn` per the PATH lesson):
arc10's 5-form demo produced all five kernel-only errors verbatim +
`kernel:` resolved (`var x = 1;`); arc11's three-moment demo 0/0 with the
destination proven by the compile message (mid-run count elided in the
transcript, structurally covered — calibration noted in the gate record);
arc12's census grep = 3 line-mentions ≈ once (vs ~16 before); suites
reconciled across the day (`make check` ✓, 1365/0, 673/0, docs green,
`lykn test` in 13s). **P-15, P-16, P-17 → done; arc10/arc11/arc12 →
Closed.** Remaining 0.6.0 work: **arc05 (linter — next, seed at arc05
arc-plan v1.1), arc06 (dep ergonomics), arc07 (docs), arc09 (release)**.
Sequence: arc05 → arc06 → arc07 → arc09. Surfaced by: the combined gate.

### v1.19 — 2026-07-05 (arc12 delivered same-day; three arcs at one gate)
arc12/slice01 closed (`3612cad`, CDC-verified, **operator host-run green
same day**): `--docs` no longer runs the corpus (TDD'd); one Deno startup
for the doc phase; `test-js`→`test-suite` (honest), `test-lykn` out of the
chain (kept as dev alias); one release build per `make check` (plus a latent
lint-ordering fix). **Measured: `make test-docs` 1m52s → 2.6s; `make check`
>2m → 1m04s; corpus 8×/4× → 1×/0×; counts unchanged.** §Post-0.6.0 gains
the batch-compile lever + the toolchain-hardening trio (stray-sibling
guard, freshness-guard scoping, `--compile-only`+`--docs` tidy). **arc10,
arc11, arc12 all CLOSING — one combined gate** (arc12 closing-report §4:
the operator's green suite run + three short demo blocks) flips
P-15/P-16/P-17. Minor open query: 473-vs-475 doc-count reconciliation.
Surfaced by: arc12 slice01 close + operator run.

### v1.18 — 2026-07-05 (arc12 created: test topology — each test runs once)
The arc10/arc11 gate attempt surfaced two things: (a) a **stale PATH
binary** invalidated the first A-3 run (staleness trap, third costume —
runbooks amended to `which lykn` + `./bin/lykn`; guard candidate filed);
(b) the operator's repeated-tests/slow-runs observation, CC-quantified:
**the corpus executes ~12× across `make check && make test-docs`** — root
causes: `lykn test --docs` runs the full corpus by default (CLI bug, 4×),
`check ⊇ test-docs` (invocation habit), `test-lykn` ⊂ `test-js` (target
drift), duplicate builds (minor). `make test-docs` ≈ 1m53s, 85–94% corpus.
**Created arc12 · test-topology** (one slice, scoped: CC's A–D + canonical
`make check` bar + sentinel-census proof; **P-17 added**). Sequences
immediately — before the combined gate re-run, so all three arcs gate
cheaply in one session. Another drift specimen: targets whose names were
honest once. Surfaced by: operator observation + CC report, 2026-07-05.

### v1.17 — 2026-07-05 (arc11 → CLOSING; Post-0.6.0 candidates instantiated)
arc11 slice01 (`75c9cc2`) and slice02 (`4f2a628`) both closed, CDC-verified:
`lykn test` → `target/lykn/test/` (wiped per run; three-moment demo clean;
**P-7's demo unconditionally runnable**); the reserved `--out-dir` live; the
April fossil deleted; doctest dir `target/lykn/`-aligned; 13-item
buried-intent disposition table with the **sweep-diff CDC-reproduced** (A-4).
**Instantiated the tracked homes** so routed ≠ re-buried: **§1 Post-0.6.0
tracked candidates** (`set-symbol!` deprecation decision; `genfunc`
multi-clause; 4-item polish backlog; mycelium) and **arc05 seed** (2 lint
rules from `test/CONVENTIONS.md`; corpus division recorded, arc05 v1.1).
Notable amendment: slice01 declined the planned `project.json` exclude
(empirically invalidated — Deno's config `exclude` filters explicitly-passed
paths); A-5 was:-noted, goal met. arc11 → **CLOSING**; its host runbook is
combinable with arc10's — **both arcs now await the same operator gate
session**. Surfaced by: arc11 slice01+02 closes.

### v1.16 — 2026-07-05 (arc11 created: source-only test build + buried-intent audit)
Operator observation during the arc10 composition run: compiled `_test.js`
siblings visible in `test/`. CDC ground-truthing: **transient by design**
(April interim, `a640398` — compile-sibling, run, clean) but with real gaps
(SIGINT strands debris; `--compile-only` leaves it; `.gitignore` misses
`*_test.js`; P-7's demo holds only at rest). The `--out-dir` flag exists,
**hidden + "reserved for future use" + received-and-ignored** — the intent
was captured, never wired; doctests already do it right
(`target/test/doctest`, wiped per run). **Created arc11 ·
source-only-test-build** (slice01 test-out-dir, open set written; slice02
buried-intent-audit, planned): wire the flag → `target/lykn/test/` and sweep
the buried-intent inventory (~10 marker hits, incl. `surface.rs:294` whose
DD-58 deprecation trigger fired at arc10's close). **P-16 added.** Sequences
parallel-to-or-before arc05; **gates arc09**. Systemic note (operator): this
is the named pre-framework failure mode — *features delayed, deferred, or
buried, then lost*; arc11 A-4 is the 0.6.0 countermeasure. Surfaced by:
operator observation + CDC investigation, 2026-07-05.

### v1.15 — 2026-07-05 (arc10 slice03 closed; arc10 → CLOSING; P-15 added)
arc10 slice03 closed (`2f6a84d`, CDC-verified): `_kernel` retired for the
WeakSet sanctioned-kernel registry; **A-6 enforced** (operator decision, Rust
semantics: macro-emitted top-level bare kernel decls error everywhere — the
divergence was runtime-confirmed before implementation; DD-58 refinement
entry landed); A-7 kernel-form parity guard now runs in `make check`; A-8
`kernel:` corpus rows green. Final numbers: `lykn test` 1365/0, deno 673/0,
`make check` ✓. **arc10 → CLOSING**: arc-level `closing-report.md` written
(slice walk 3/3; composition rows A-3/A-4 met-attested; silent-drop diff
clean); formal close = **operator host composition run + gate** (runbook in
the report). **P-15 added** — the arc10 bubble-up found the project ledger
predated arc10 and had no row for it. Release-notes obligations accumulated
→ arc09. Cosmetic drive-bys routed: stale `kernel-mark.js:10` comment; stale
`macroEnv.has('bind')` guard. On the gate: arc05 (linter) is next. Surfaced
by: arc10 close (slice03 CC report + CDC verification + arc bubble-up).

### v1.14 — 2026-07-05 (arc10 slice02 closed — DD-58 at the language level)
arc10 slice02 (`js-dd58-parity`) closed (`feb056c`, CDC-verified): the JS
compiler (`packages/lang/`) now enforces DD-58 — strict default-on
(`{strict:false}` opt-out) + the `kernel:` escape (whitelist parity with Rust
CDC-reproduced, 92=92; Rust-verbatim diagnostics). Browser loader + `lykn test`
codegen script extension-aware (`.lyk`→lax). 26-site migration; guide fences
09/06 flipped `skip`→`compile-fail`/runnable-`kernel:`. Metrics: `lykn test`
**1354/0**, deno **667/0**, `make check` ✓, doctests green both example trees.
**arc10 A-3 partial → met** — DD-58 now holds on every compile path. Findings
routed: macro-boundary strict asymmetry (Rust post-expansion vs JS
pre-expansion; DD-58 refinement — arc10 A-6, assess in slice03); kernel-form
set duplication follow-up (A-7); `kernel:` compileBoth corpus rows (A-8);
browser-example `(= el:inner-HTML …)` equality no-op → **arc07**;
breaking-change release-notes items → **arc09**. Next: arc10 slice03
(`dd37-step4-kernel-removal`), then arc10 close (composition on host), then
arc05. Surfaced by: slice02 close (CC report + CDC verification).

### v1.13 — 2026-06-30 (arc10 slice01 closed; JS-parity finding)
arc10 slice01 (`dd58-strict-default`) closed (`faee8a1`): DD-58 strict default-on
for `.lykn` on the **Rust CLI** (5 kernel-only heads error; `kernel:` resolves;
`.lyk` exempt; `lykn check` now strict; `--no-strict` harness-only). Guides
migrated (15 `lykn,skip`; ID-38 operators reframed). `make check` ✓, corpus
1345/0, guide docs 468/0. **Major bubble-up:** the JS compiler (`packages/lang/`)
implements neither strict nor the `kernel:` escape — so doctests/`deno test` stay
lax and `(kernel:const …)` mis-compiles. → **arc10 slice02 · js-dd58-parity**
(next; gates arc10 A-3); `_kernel` removal → slice03. DD-58 is complete on the
Rust CLI but not yet at the *language* level.

### v1.12 — 2026-06-30 (anti-patterns verified; DD-58 strict-default decided)
CC's compiler-verified anti-patterns report found the guide's "12 ELIMINATED" is
really **2** — the other 10 are *leaks* (bare kernel/JS forms pass through the
surface compiler; DD-58 strict mode is `lykn test`-only). **Operator decided:
complete DD-58 (strict default-on).** Routing: a new **compiler-completion arc**
(DD-58 strict-default + DD-37 step-4 `_kernel` removal), **sequenced before arc05**
(it gates the linter corpus); arc05 and the arc07 guide-fix both **shrink** as a
result; the `(require …)`→invalid-ESM issue is subsumed. Worth capturing the
strict-default decision in DD-58 (odm) canonically. Surfaced by: CC anti-patterns
report + the ID-38 thread.

### v1.11 — 2026-06-30 (CI finding planned into arc07)
First CI run on `release/0.6.x` (the commit enabling release/* CI) went red: **8
guide doctest blocks** fail DD-50.6's return-type check — accumulated guide drift,
newly exposed (compiler correct; not an arc04 regression; README/examples clean).
Planned, not hotfixed: → **arc07 slice01 · doctest-drift-fix** (docs-only;
closure returns use `=>` per the settled design call; takes CI green) — flagged
near-term / arc07 candidate to pull forward. **Process fix** added: slice/arc
green-bar must include `make test-docs` for guide/doc-touching work. CI
maintenance (`actions/checkout@v4→v5`) folded into arc09. Surfaced by: CC's CI
report 28421983093.

### v1.10 — 2026-06-29 (M22.5-4 landed — **arc04 CLOSED**)
slice05 (M22.5-4) closed and **arc04 closed** (arc-level `closing-report.md`
written; composition check reproduced at arc scale). Dead code removed; **`deno
lint packages/` exit 0** (standing JS-lint debt closed); `surface.js` 2,315→448.
P-4 → done. The `move-function` campaign is complete: tool built (01–02) + full
surface extraction (03–05), every move byte-identical by the tool incl.
`emitMatchMacro`. **New surfaced follow-up:** DD-37 step 4 (`_kernel` marker
removal) — candidate future work, not yet scoped. Remaining 0.6.0 work: arc05
(linter), arc06 (dep-ergonomics main), arc07 (docs), arc09 (release).

### v1.9 — 2026-06-29 (M22.5-3 landed — DD-37 implementation migration finished)
arc04 slice04 (M22.5-3) closed: the 4 complex-form emitters moved to
`classifier.js` byte-identical — `emitMatchMacro` (the function M22 broke by
reimplementing) verbatim-confirmed by CDC byte-diff. `typeRegistry` relocated to
`surface-helpers.js` as a single shared instance. **DD-37's implementation
migration is finished**: `surface.js` 2,315→540 lines, `classifier.js` imports
nothing from it. The tool gained a TDD'd TO-as-consumer import-prune capability.
`deno lint packages/` 4→2. Next in planned order: slice05 = M22.5-4 (dead-code →
clears the last 2 lint residuals).

### v1.8 — 2026-06-29 (M22.5-2 landed — first real extraction)
arc04 slice03 (M22.5-2) closed: the `move-function` tool drove its first real
extraction — 10 aliased helpers moved out of `surface.js` into `surface-helpers.js`,
byte-identical, dependency-ordered, committed `266ff3d`, corpus 1345/0. A-3 done;
P-4 advanced. This is the first measurable reduction of `surface.js` and the start
of finishing DD-37's physical migration. Standing debt recorded: `deno lint
packages/` ≠ 0 (4 residuals = M22.5-3/4 dead code/imports). Next in planned order:
slice04 = M22.5-3 (complex forms).

### v1.7 — 2026-06-29 (integration complete; arc03 restored; arc08 added)
Both stranded bodies merged to `release/0.6.x` and verified green (corpus 1345/0,
deno 658/0, clippy/fmt/lint clean; the slice11 async + D-2 backslash invariants
held): `cdc/compiler-coherence` (DD-58+DD-37) via `6aa3724`, `feature/template-update`
(DD-55) via `7a552ca`. Re-ran the ancestry audit: **all worktree branches 0-ahead
— zero stranded.** Reconciliation: **arc03 close restored** (P-3 done), **DD-55
added as arc08** (template-i18n, closed; P-14 done), **release renumbered arc08→arc09**,
arc04 A-3 / M22.5-2 unblocked. Three findings from the merge (recorded below).
**Findings:** (1) `cdc/compiler-coherence` had landed without `make check` passing
— 2 clippy + 1 deno-lint debt fixed by CC, bundled into merge `6aa3724` (Duncan may
split if desired); (2) DD-55 was largely already on release in parallel, so the
merge mainly records history convergence; (3) **slice02's F-7 freshness guard is
too broad** — it fires for *any* `lykn test` over `.lykn` files (broke the
`lyk_runner_kernel_only` cargo tests until a rebuild), and should be scoped to the
cross-compiler corpus — a **slice02 follow-up** (tracked in arc04).

### v1.6 — 2026-06-29 (full branch-ancestry audit)
Ran the operator-requested full audit — [`_reconciliation-2026-06-29.md`](./_reconciliation-2026-06-29.md).
Confirmed landed: arc01, arc02, arc06/slice01, arc03 slices 01/09/10/11 (and no
stranded linter work — arc05 genuinely not started). Confirmed **stranded**: (a)
DD-58+DD-37 on `cdc/compiler-coherence` (47 commits, arc03 slices 02–08); (b)
**DD-55 ICU/i18n on `feature/template-update`** (11 commits) — a body of 0.6.0
work the reconstruction never mapped to an arc. Both await merge + post-merge
re-verification; then DD-55 needs an arc (or fold-in) and arc03's close can be
un-qualified.

### v1.5 — 2026-06-29 (arc04 slice02 closed; ⚠ unmerged-architecture finding)
arc04 slice02 closed — the `move-function` tool is built and proven (cross-file
rewiring + batch + atomic multi-file revert). Its `andChain` acceptance surfaced
a **major reconciliation finding**, CDC-confirmed: the DD-58 + DD-37 architecture
(arc03 slices 02–05, 07–08; M17–M22) **is not on `release/0.6.x`** — it lives on
`cdc/compiler-coherence` (fork `e462a67`). `classifier.js`/`surface-helpers.js`
don't exist on release; `surface.js` still registers 36 macros. **arc03's close
is downgraded to qualified** (P-3); arc04 A-3 deferred; M22.5-2/-3 blocked.
**Root cause:** the retroactive migration + arc closes treated workbench
milestone closure as "landed on release" without a branch-ancestry check (a CDC
verification gap, now named). **Resolution requires an operator decision**: merge
`cdc/compiler-coherence` → `release/0.6.x`, or otherwise reconcile the branches.
A full per-slice branch-ancestry audit is the recommended immediate follow-up.

### v1.4 — 2026-06-28 (arc04 slice01 closed; fmt blocker cleared)
arc04 slice01 (`move-function-core`) closed — byte-exact move tool, TDD-first,
byte-identity invariant verified. The standing **`cargo fmt` drive-by landed**
(`401e2bd`, the 5 files), clearing the `make check` lint-red blocker noted in
v1.1 (P-7/P-8 clean-toolchain demos are now unblocked, though still pending a
host run). slice01 bubble-up refined slice02's scope (extraction target +
rebuild-first verify). Next: arc04 slice02.

### v1.3 — 2026-06-28 (arc03 closed)
slice11 greened the cross-compiler corpus (**1293 / 0**); **arc03 closed**.
P-3 and P-9 → done. Recorded correction: the only genuine residual codegen
divergence was the cosmetic async trailing-`;` (fixed in `emit.rs`); the gensym
and import-macros "divergences" were a **stale-build-dir** trap (now guarded
alongside the stale-binary trap, F-7). Next in planned order: arc04. CDC verified
by code review + git; runtime rows CC-attested — **operator host re-run
recommended** to reconcile P-3/P-9/P-7.

### v1.2 — 2026-06-28 (docs arc added)

Added **arc07 · docs** to home the 0.6.0 docs/SKILL hygiene backlog
(`guide-drift-cleanup-plan`, `proposed-skill-and-guide-additions`), previously
un-arc'd in `workbench/`. To preserve dependency order (docs alignment lands
before the release cut), **release was renumbered arc07 → arc08**; all
references updated (this plan, README, arc01, arc03 closing-report, the release
arc-plan). Added project-ledger row **P-13** (docs aligned with shipped 0.6.0).
(Surfaced by: operator request to spin up a docs arc; the M6/M7 closings remain
out of scope — arc03 prehistory below the M10 floor, left for a `design-v0.5.x`
retro.)

### v1.1 — 2026-06-28 (CC verification + round-2 + arc03 composition)

After an independent verification pass (CC), with results in
`workbench/cc-results-design-v060/`:

- **Structure verified:** canonical layout confirmed, 115 files, no undisclosed
  gaps (CC `01-structure-verification.md`).
- **arc03 composition (P-9) reproduced** end-to-end for the first time: 146
  cross-compiler assertions, 1287/6, **0 semantic divergences**. arc03 stays
  **open**, close gated on new **slice11** (corpus-green remediation) for 6
  non-semantic residuals. (Surfaced by: arc03 composition run.)
- **Round-2 migration** (CC reconciliation found real value the first pass
  missed): arc06 gained closed **slice01 · lang-exports-gap** (Finding D) +
  `mycelium-bootstrap-issues.md`; arc03 gained **slice10 · icu-doctest-fences**
  (W-4d) + `finding-e-empirical-disconfirmation.md`. P-6 updated.
- **Three project-level findings bubbled up from arc03** (to act on before
  arc08): (1) **stale-`bin/lykn` trap** — A-2/P-7/P-9 demos must
  `make build-release` first or the harness reports false divergences;
  (2) **`make check` is red on `release/0.6.x`** — `cargo fmt --check` fails on
  5 committed files (pre-existing; fix = `cargo fmt --all` + commit, per AGENTS.md
  — do not bypass); blocks P-7/P-8 clean-toolchain demos; (3) **cross-compiler
  coverage is form-codegen only (~11%)** — reader/expander/integration parity is
  a documented latent gap.
- **Repo finding (non-plan):** `assets/ai/LEDGER_DISCIPLINE.md` is a **dead
  symlink** (underscore vs hyphen + moved base path) — AGENTS.md's "read first"
  pointer is broken; worth fixing.

### v1.0 — 2026-06-28 (reconstructed)

Initial project-plan, **reconstructed retroactively** from the M-series
milestone history that previously lived in `workbench/` (gitignored) under the
project's pre-framework tracking convention. The migration:

- Adopted the canonical `docs/design-v0.6.0/` layout (operator-confirmed
  2026-06-28: canonical layout, lang-repo-only scope, 0.6.0-only history,
  copy-not-move so `workbench/` remains intact as a safety net).
- Mapped milestones → arcs/slices: M10→arc02; M11+M13→arc01; M16–M22 + the
  DD-58/DD-37 phases + cross-compiler fast-follows→arc03; M22.5→arc04;
  M12→arc05 (open); dep-ergonomics→arc06 (open); M14/M15→arc07 (future).
- **Deviation from the proposed slice split:** arc01 was proposed as two
  slices (build-dir-reorg / publish-dirty-check) but shipped as one combined
  milestone (M11+M13) with a single interleaved ledger (`M11M13-1…12`). Split
  was rejected as destructive to a coherent artifact; arc01 carries one slice
  holding the combined ledger + closing report, with both capabilities
  documented. (Surfaced by: the migration; recorded here per plan-change
  discipline.)

_This document is a living spec. Reconstructed 2026-06-28._
