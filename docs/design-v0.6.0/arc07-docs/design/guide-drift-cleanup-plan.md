# Guide-Drift Cleanup Plan

**Drafted:** 2026-05-10
**Owner:** Duncan (with this conversation as the working session)
**Purpose:** track the documentation reconciliation work remaining
between `assets/ai/SKILL.md` (ground truth), `docs/guides/`, and
`docs/philosophy.md`. Split into "do now" (independent of all four
Phase-2 conversation threads) and per-thread sections (work that
waits on each thread closing).

## Background

Two sources of pending guide work:

1. **M2 guide-drift inventory** at
   `workbench/M2-guide-drift-inventory.md` (drafted 2026-04-29).
   Identified ~54 "reconcile" items across the guides. M14
   ("Guide-drift cleanup pass") was scoped in the Phase-2 plan to
   address them, but never started — the milestone slot is still
   open.
2. **M7 closing-report fast-followups** at
   `workbench/2026-05-10-M7-closing-report.md`. DD-49, DD-50, and
   DD-51 each have small SKILL.md / surface-forms-guide updates that
   need to land but were intentionally deferred from the DDs
   themselves.

After this cleanup lands, the project's guides match SKILL.md as
ground truth across the board — which makes CC's decision-making
more reliable when working on the four open Phase-2 conversation
threads (cross-project dep ergonomics, compiler architecture
coherence, build-dir + publish dirty-check, lykn-source linter).

---

## "Do now" — independent of all four threads

Suggested order: largest-impact first, mechanical to less-mechanical.

### 1. Biome → `deno lint` / `deno fmt` sweep

The largest single set of drift in the M2 inventory. SKILL.md says
the toolchain uses Deno's built-in `deno lint` and `deno fmt`. The
guides were written when Biome was the recommended tool; that's now
stale.

**Two patterns:**

**(a) "Target environment" header lines** — 17 files share the same
header pattern reading "Target environment: **Deno**, **ESM-only**,
**Biome** on compiled output." Replace "Biome" → "Deno's built-in
`deno lint` and `deno fmt`."

Files (per M2 inventory):

- `00-lykn-surface-forms.md:6`
- `01-core-idioms.md:9`
- `02-api-design.md:9`
- `03-error-handling.md:9`
- `04-values-references.md:9`
- `05-type-discipline.md:13`
- `06-functions-closures.md:9`
- `07-async-concurrency.md:10`
- `08-performance.md:10`
- `09-anti-patterns.md:13`
- `10-project-structure.md:10`
- `11-documentation.md:10`
- `12-deno/12-01-runtime-basics.md:11`
- `12-deno/12-02-testing.md:9`
- `12-deno/12-03-task-runner.md:8`
- `12-deno/12-04-publishing.md:9`
- `14-no-node-boundary.md:10`

**(b) Instructional Biome references** — substantive `biome format`
/ `biome lint` / `biome.json` references across multiple files.
Mechanical substitutions to `deno fmt` / `deno lint` / `deno.json`.

Files with the heaviest concentration (per M2 inventory):

- `14-no-node-boundary.md` — lines 10, 72, 92, 96, 248, 252, 311,
  325, 340, 355, 356, 371 (11 references)
- `15-lykn-cli.md` — lines 130, 132, 314, 317, 333, 339, 344 (7
  references)
- `10-project-structure.md` — lines 10, 66, 345, 496, 502, 503, 516,
  522, 527, 578 (10 references)
- `12-deno/12-01-runtime-basics.md:153`
- `12-deno/12-03-task-runner.md:23, 25, 50, 56`
- `12-deno/12-04-publishing.md:62`

### 2. `13-biome/` directory decommission

Three substantive files (~5KB total) documenting Biome:

- `docs/guides/13-biome/13-01-setup.md`
- `docs/guides/13-biome/13-02-lint-rules.md`
- `docs/guides/13-biome/13-03-formatting.md`

Six cross-references from other guides point to these (per M2
inventory: `10-project-structure.md:578`, `14-no-node-boundary.md`
lines 96, 252, 371; `15-lykn-cli.md:132`; etc.).

**Recommendation: decommission entirely.** After step 1's Biome
sweep, the directory's content contradicts SKILL.md as ground truth
and the cross-refs no longer point anywhere useful. Two options:

- (a) Delete the directory; remove the cross-references.
- (b) Move to a hypothetical `archive/` location; leave a single
  "moved" stub.

(a) is cleaner. (b) is more conservative if the content might be
referenced historically.

### 3. Raw command reconciliation in `12-04-publishing.md`

7 instructional references to `deno publish` / `npm publish` that
should be `lykn publish --jsr` / `lykn publish --npm` per SKILL.md
Principle 1. Single-file, focused, mechanical.

Per M2 inventory:

- `12-deno/12-04-publishing.md:14` — `deno publish` (ID-01 heading)
  → `lykn publish --jsr`
- `12-deno/12-04-publishing.md:20` — `deno publish --dry-run` (code
  block) → `lykn publish --jsr --dry-run`
- `12-deno/12-04-publishing.md:23` — `deno publish` (code block) →
  `lykn publish --jsr`
- `12-deno/12-04-publishing.md:28` — `npm publish` (ID-02 heading)
  → `lykn publish --npm`
- `12-deno/12-04-publishing.md:33-34` — `npm publish --access
  public` (code block) → `lykn publish --npm`
- `12-deno/12-04-publishing.md:68` — `deno publish` (pipeline code
  block) → `lykn publish --jsr`
- `12-deno/12-04-publishing.md:69` — `npm publish` (pipeline code
  block) → `lykn publish --npm`

Leave `npm version` at line 78 in place (reference, not
instruction).

### 4. `deno test` / `deno run` drift in `15-lykn-cli.md`

Carry-forward C-M2-2 from the Phase-1 plan. Lines 320 and 323 show
`deno test test/` and `deno run --allow-net dist/main.js` as manual
workflow steps. Per SKILL.md Principle 1, replace with `lykn test`
and `lykn run`.

### 5. DD-49 fast-follow: SKILL.md naming conventions update

DD-49 settled the identifier mapping rules. SKILL.md's naming
conventions table currently shows only the basic predicate (`?`
suffix) and mutation (`!` suffix) cases. Update to include:

- **Predicate prefix list** for Rule 1: `is-`, `has-`, `can-`,
  `should-`, `will-`, `does-`, `was-`, `had-` (these are
  automatically detected; if the identifier already starts with one,
  no `is-` is prepended).
- **Abbreviation table** for Rule 3 (embedded punctuation): `?` →
  `QMARK`, `!` → `BANG`, `*` → `STAR`, `+` → `PLUS`, `=` → `EQ`, `<`
  → `LT`, `>` → `GT`, `&` → `AMP`, `%` → `PCT`, `/` → `SLASH`. Note
  `$` is NOT escaped (passthrough — valid JS identifier character).
- **Multi-char arrows**: `->` → `To`, `<-` → `From`.
- **Macro overrides**: `->` → `threadFirst`, `->>` → `threadLast`
  (Rule 4).

Reference DD-49 for full rationale; SKILL.md just needs the table
summary.

### 6. DD-50 surface-forms guide fast-follow

`docs/guides/00-lykn-surface-forms.md` needs:

- **New entry for `do` form.** Sequence-of-expressions form whose
  value is the value of the final expression. Position-aware:
  statement position → block; expression position → IIFE. Distinct
  from `do-while` (separate kernel form).
- **Note on position-aware `if`** (Rule 1). Both branches pure
  expressions → ternary; statement branches → IIFE; no-else in
  expression position → compile error.
- **Style guidance** (Rule 5): "Prefer `?` for expression position,
  `if` for statement position." Functionally equivalent in expression
  position; `?` makes intent explicit.

### 7. DD-50 SKILL.md style guidance

Add the Rule 5 style guidance to SKILL.md (anti-patterns or style
section). One-liner with rationale. Specifically for LLM-generated
code: treat as a hard preference rather than soft.

### 8. Other M2-surfaced drift

Verify nothing's left from `workbench/M2-guide-drift-inventory.md`
"Other drift" section. Most resolved:

- `deno add` adjudication — closed by DD-51, doc updates landed.
- `deno test` / `deno run` drift in `15-lykn-cli.md` — addressed by
  step 4 above.
- `13-biome/` stale-but-cross-referenced — addressed by step 2 above.
- `deno.json` `exports` pointing to `./dist/mod.js` in
  `12-04-publishing.md` ID-03 — flagged for verification; check
  whether it's still drift after current state.

### Bite-sized split for CC sessions

This work can be split into three CC sessions:

- **Session A:** Items 1 + 2 (Biome sweep + 13-biome decommission)
  — the largest single chunk.
- **Session B:** Items 3 + 4 (publishing command reconciliations +
  `deno test`/`run` drift) — focused on two files.
- **Session C:** Items 5 + 6 + 7 + 8 (DD-49/DD-50 fast-follows + M2
  leftover verification).

Each session is one closing report. Or fold into one big "M14
redux" milestone with three rows.

---

## Per-thread guide drift

These items wait on the corresponding thread closing.

### After Thread 3 (M11 build-dir reorg + M13 publish dirty-check)

**M11 lands:**

- `10-project-structure.md` — update directory tree (build pipeline,
  `target/lykn/build/` and `target/lykn/dist/` paths).
- `11-documentation.md` — consumer-facing references to output
  paths.
- `12-04-publishing.md` — publish pipeline that consumes build
  output.
- `14-no-node-boundary.md` — verify no stale path refs after the
  reorg.
- `15-lykn-cli.md` — `lykn build` and `lykn build --dist`
  subcommand descriptions.

**M13 lands:**

- `12-04-publishing.md` — document the new dirty-check gate +
  `--allow-dirty` opt-out.
- `15-lykn-cli.md` — `lykn publish` subcommand description.
- `assets/ai/AGENTS.md` "Lykn CLI safety gates" — may need a
  cross-reference to confirm M13 materializes the rule.

### After Thread 1 (M10 .d.ts + surface-macros gap + mycelium friction)

**M10 (`.d.ts` generation) lands:**

- `02-api-design.md` — TypeScript consumer support;
  type-annotation → `.d.ts` mapping.
- `11-documentation.md` — consumer documentation patterns.
- `12-04-publishing.md` — publishing with `.d.ts` artifacts in
  `dist/`.
- `15-lykn-cli.md` — `lykn build` description mentions `.d.ts`
  output.

**Surface-macros JS-loading gap closes (if it lands):**

- No specific guide today; possibly a new section in
  `01-core-idioms.md` or `09-anti-patterns.md` on macro authoring
  patterns.

**Mycelium smoke-test findings:** ad-hoc per finding; likely small
targeted updates.

### After Thread 2 (compiler architecture coherence)

**DD-36 / DD-37 resolution:**

- If promoted: update `docs/dev/` architecture docs to reflect the
  formal compiler split. May need new `docs/guides/` entry on
  architecture (less likely — guides target user audience, not
  internals).
- If decommissioned: archive or delete the workbench drafts;
  document the alternative decision in `docs/dev/`.

**V-06 (JS-side analyzer) decision:**

- **Option A (build JS analyzer):** SKILL.md updates for symmetric
  warnings; `09-anti-patterns.md` may get new entries; `16-testing.md`
  mentions both compilers' analysis layers.
- **Option B (document divergence):** SKILL.md adds explicit note
  ("Rust compiler is the validation pass; run `lykn check` (Rust)
  for full analysis").

**Error-format alignment:**

- If type-check message format changes, update DD-49 Rule 7
  ("Refinement log" entry retracting the bridging-guard if no
  longer needed).
- `03-error-handling.md` — any references to the format.

**`compileBoth` broader adoption:**

- `16-testing.md` — document the `compileBoth` pattern as
  recommended for cross-compiler verification.
- SKILL.md — testing-related guidance.

### After Thread 4 (M12 lykn-source linter)

**`lykn lint` command lands:** substantial new documentation:

- `15-lykn-cli.md` — new `lykn lint` command section.
- `09-anti-patterns.md` — cross-reference lint rule names (each
  entry should be discoverable by rule name for grep).
- SKILL.md anti-patterns table — link entries to corresponding lint
  rules.
- Possibly new guide `17-linting.md` if M12's scope warrants a
  dedicated reference page (depends on rule count and complexity).
- `16-testing.md` — may mention linter integration in test runners.

---

## Working-session bookkeeping

This guide-drift work is the natural scope for **this conversation
session**. The four parallel conversation threads (build-dir +
publish, cross-project dep, compiler-arch, linter) handle their
respective per-thread items as those threads close.

**Suggested sequencing for this session:**

1. Land the "do now" work first (steps 1-8 above), probably split
   into 2-3 CC sessions per the "bite-sized split" subsection.
2. As each parallel thread closes, fold its per-thread items into a
   small targeted CC session.
3. Once all per-thread items have landed, this session's other
   purpose kicks in: **0.6.0 release coordination** — version
   bumps, changelog, release notes, dry-runs against JSR/npm/crates,
   Duncan's manual publish. Models on `M9-release` from 0.5.2 work.

**Status tracker** (update as items complete):

- [ ] Step 1 — Biome → deno lint/fmt sweep (17 header files +
      ~30 substantive refs)
- [ ] Step 2 — `13-biome/` decommission
- [ ] Step 3 — `12-04-publishing.md` raw command reconciliation (7
      items)
- [ ] Step 4 — `15-lykn-cli.md` `deno test`/`run` drift fix
- [ ] Step 5 — DD-49 SKILL.md naming-conventions update
- [ ] Step 6 — DD-50 surface-forms guide updates (`do`, position-
      aware `if`, style guidance)
- [ ] Step 7 — DD-50 SKILL.md style guidance
- [ ] Step 8 — M2 "Other drift" leftover verification
- [ ] Thread 3 follow-up: M11 build-dir doc updates
- [ ] Thread 3 follow-up: M13 publish dirty-check doc updates
- [ ] Thread 1 follow-up: M10 `.d.ts` doc updates
- [ ] Thread 1 follow-up: surface-macros gap docs (if applicable)
- [ ] Thread 1 follow-up: mycelium friction docs (ad-hoc)
- [ ] Thread 2 follow-up: DD-36/37 resolution doc updates
- [ ] Thread 2 follow-up: V-06 analyzer decision doc updates
- [ ] Thread 2 follow-up: error-format alignment doc updates
- [ ] Thread 2 follow-up: `compileBoth` adoption doc updates
- [ ] Thread 4 follow-up: M12 `lykn lint` docs

---

## References

- `workbench/M2-guide-drift-inventory.md` — original drift inventory
  (Phase 1, M2 milestone)
- `workbench/phase-2-plan.md` — Phase-2 milestone list including
  M14 slot
- `workbench/2026-05-10-M7-closing-report.md` — fast-follow log
  source
- `docs/design/05-active/0049-identifier-mapping-lykn-js.md` —
  DD-49 (steps 5, 8)
- `docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`
  — DD-50 (steps 6, 7)
- `docs/design/01-draft/0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md`
  — DD-51 (already-landed doc updates referenced in step 8)
- `assets/ai/SKILL.md` — ground truth for all reconciliations
- `docs/philosophy.md` — foundational principles (especially
  Principle 1 — single-source-of-truth — and Principle 2 — lykn-
  only tooling)
