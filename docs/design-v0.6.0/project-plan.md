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
this file is the *plan*, not the design. The **Lykn Book 0.6.0 update** lives
in a separate repo (`~/lab/cnbb/lykn`) and is tracked as its own project, not
as an arc here (decided 2026-06-28). The **0.1.0–0.5.x history** remains in
`workbench/old/` and is out of this plan's scope; a `docs/design-v0.5.x/`
retro pass may reconstruct it later.

A pointer to the architecture: `docs/philosophy.md` (the three principles +
0.6.0 commitments), and the odm-managed DDs in `docs/design/` (DD-36, DD-37,
DD-56, DD-58 in particular).

**Post-0.6.0 tracked candidates** *(added v1.17 — the arc11 buried-intent
audit's routed items; each has a named source + re-entry condition; this
list is the "watcher" that keeps routed items from re-burying)*:

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

## 2. The arc roadmap

Arcs in dependency order. Each delivers one coherent capability.

| Arc | Capability | Depends on | Status |
|-----|-----------|-----------|--------|
| **arc01 · build-publish-toolchain** | `target/lykn/{build,dist}` reorg + `lykn publish` dirty-check gate | — | **Closed** (M11+M13) |
| **arc02 · type-dts-generation** | `.d.ts` declarations generated from `:type` annotations (DD-56) | — | **Closed** (M10) |
| **arc03 · compiler-coherence** | Rust + JS compilers coherent by construction; kernel/surface split (DD-58) + JS surface compiler arch (DD-37) | arc01 (build) | **Closed** (M16–M22; architecture landed on release 2026-06-29) |
| **arc04 · refactor-tooling** | `move-function` byte-exact code-move tool driving surface extraction | arc03 | **Tool built & proven** (slice01+02 closed); A-3 real-extraction deferred to M22.5-2 |
| **arc05 · lykn-source-linter** | `lykn lint` over Lykn source — anti-patterns, idiom, style (Option A) | arc03 | **Open** (not started; was M12) |
| **arc06 · cross-project-dep-ergonomics** | `lykn add` and ergonomic cross-project dependency handling (DD-51 follow-ons) | arc01 | **Open** (slice01 exports-gap closed; main work not started) |
| **arc07 · docs** | Guide/SKILL alignment with 0.6.0; clear guide drift; land discoverability additions | arc01–06, arc08 (describes shipped behaviour) | **Open** (seeded, not slice-planned) |
| **arc08 · template-i18n** | `template` macro → ICU MessageFormat + i18n (DD-55) | DD-54 template; D-2 escape | **Closed** (DD-55; landed on release 2026-06-29) |
| **arc09 · release-0.6.0** | Version bumps, release notes, publish to JSR / npm / crates.io | all above | **Future** (was M14/M15) |
| **arc10 · compiler-completion** | DD-58 strict-default (surface prevents kernel-form leaks) + DD-37 step-4 (`_kernel` removal) | arc03, arc04 | **CLOSING** — 3/3 slices closed; composition + operator gate pending (host runbook: arc10 `closing-report.md` §5); arc05 unblocks on the gate |
| **arc11 · source-only-test-build** | `lykn test` compiles to `target/lykn/test/` (never the source tree) — finishes philosophy #1 for the last source-tree emitter — + a buried-intent audit (sweep + disposition every deferred-then-lost stub) | arc01 (target discipline) | **CLOSING** — 2/2 slices closed; composition + operator gate pending (host runbook: arc11 `closing-report.md` §5, combinable with arc10's); **gates arc09** (P-7 demo, now unconditional) |
| **arc12 · test-topology** | Every test executes exactly once per `make check`; `make test-docs` tests docs (kills the ×12 corpus re-runs: the `--docs` corpus-default bug, the 4× Deno startups, the `test-lykn` subset re-run, the double builds) | arc11 slice01 (out-dir layout) | **Open — scoped** (slice01 open set written 2026-07-05); **lands before the arc10/arc11 gate re-run** (cheapens all verification) |

> **Numbering convention (from 2026-06-30):** `NN` is **creation order**, not
> strict dependency order (we stopped renumbering on each mid-stream insert).
> **Dependency/sequence** is carried by the *Depends on* column and the arcs'
> Dependencies sections. Current dependency sequence of the open arcs:
> **arc10-gate → (arc11 ∥ arc05) → arc06 → arc07 → arc09.** (High numbers
> belie the order: arc10 ran first; arc11 may run parallel to arc05.)

## 3. Current status (2026-06-28)

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
| P-5 | arc05 (linter) closed + composed | ptr: arc05 closing-report | correctness | project-plan | open | | not started |
| P-6 | arc06 (dep-ergonomics) closed + composed | ptr: arc06 closing-report | polish | project-plan | open | slice01 (exports-gap) closed | main work (`lykn add`, mycelium audit) not started |
| P-7 | `build` emits to `target/lykn/build/`; no `.js` in source tree (DoD demo) | end-to-end: clean build, grep source tree for `.js` = 0 | serious | DoD | open | | reproduce at project scale |
| P-8 | `lykn publish` fails on a dirty tree; `--allow-dirty` overrides, never auto-injected | end-to-end publish dry-run on dirty + clean tree | serious | DoD | open | | reproduce at project scale |
| P-9 | same surface input → same output across Rust + JS for the migrated corpus (`compileBoth`) | run `compileBoth` corpus; divergences documented or zero | serious | DoD | **done** | corpus **green: 1293 passed / 0 failed** (slice11); 0 semantic divergences | form-codegen only (~11%) remains a documented coverage bound |
| P-10 | `.d.ts` generated from `:type` annotations | end-to-end: compile a typed module, inspect emitted `.d.ts` | correctness | DoD | open | | reproduce at project scale |
| P-11 | `lykn lint` lints Lykn source (not compiled JS) | end-to-end: `lykn lint` on a fixture with seeded anti-patterns | correctness | DoD | open | | blocked on arc05 |
| P-12 | 0.6.0 published to JSR + npm + crates.io | release transcript | serious | DoD | open | | blocked on arc09 |
| P-13 | docs/guides + SKILL aligned with shipped 0.6.0 (no unreconciled guide drift) | arc07 drift-audit demo; **`make test-docs` green** | correctness | project-plan | open | **doctests now green (472/0)** via arc07 slice01 | broader guide-drift audit + SKILL additions still pending (arc07) |
| P-14 | `template` ICU MessageFormat / i18n works, Rust↔JS equivalent | DD-55 ICU cross-compiler tests | serious | DoD | **done** | arc08 (DD-55) merged; 25 ICU cross-compiler tests green | escaping consistent with D-2 fix |
| P-15 | arc10 (compiler-completion) closed + composed — DD-58 enforced on every compile path; DD-37 `_kernel` retired | ptr: arc10 closing-report + operator gate | serious | arc10 bubble-up (v1.15 — the ledger predated arc10) | **closing** | 3/3 slices closed (`faee8a1`/`feb056c`/`2f6a84d`); arc closing-report written; **composition + gate = operator host run** (runbook in the closing-report §5) | added per the arc10 bubble-up: P-1…P-14 had no row for this arc |
| P-16 | arc11 (source-only-test-build) closed + composed — no compiled `.js` in the source tree at any moment; buried-intent inventory empty-or-tracked | ptr: arc11 closing-report | serious | operator observation + CDC systemic finding (v1.16) | **closing** | 2/2 slices closed (`75c9cc2`/`4f2a628`); closing-report written; **composition + gate = operator host run** (§5 runbook) | P-7's demo now unconditionally runnable; tracked candidates instantiated (§1 Post-0.6.0 list) |
| P-17 | arc12 (test-topology) closed + composed — corpus executes exactly once per `make check`, zero per `make test-docs`; suite/doctest counts unchanged; verification wall-clock materially reduced | ptr: arc12 closing-report + sentinel census | serious | operator observation + CC redundancy report (v1.18) | open | | the manual-verification cost was blocking the arc10/arc11 gates |

DoD verdict, gate (go / adjust / kill), and the per-row walk are recorded in
this project's `closing-report.md` at release time.

## 5. Version History

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
  5 committed files (pre-existing; fix = `cargo fmt --all` + commit, per CLAUDE.md
  — do not bypass); blocks P-7/P-8 clean-toolchain demos; (3) **cross-compiler
  coverage is form-codegen only (~11%)** — reader/expander/integration parity is
  a documented latent gap.
- **Repo finding (non-plan):** `assets/ai/LEDGER_DISCIPLINE.md` is a **dead
  symlink** (underscore vs hyphen + moved base path) — CLAUDE.md's "read first"
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
