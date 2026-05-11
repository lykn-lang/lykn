# Guide-Drift Cleanup Plan

**Drafted:** 2026-05-10
**Corrected:** 2026-05-11 (see Correction section below)
**Owner:** Duncan (with the guide-drift / 0.6.0 coordination
conversation as the working session)
**Purpose:** track the documentation reconciliation work remaining
between `assets/ai/SKILL.md` (ground truth), `docs/guides/`, and
`docs/philosophy.md`.

---

## Correction (2026-05-11): the original plan misdiagnosed scope

The first version of this plan (drafted 2026-05-10) treated the M2
guide-drift inventory's "reconcile" disposition column as a TODO
list — items to be reconciled later. The plan then scoped three CC
sessions (A, B, C) covering 8 "do now" steps that would reconcile
those items.

**Empirical verification surfaced the misdiagnosis.** When CC ran
Session A (Biome → `deno lint` / `deno fmt` sweep + `13-biome/`
decommission), the verification greps returned zero Biome matches in
the guides. CC's report said "D1 was already done from a prior
session" — which prompted a check.

The check confirmed: commit `d8f85049` from 2026-04-29 ("M2: Guide
drift audit + reconciliation — reconcile Biome→deno lint/fmt, raw
publish→lykn publish, add npm publish MUST-AVOID row") was the
actual reconciliation work. M2 closed with the work already done.
The inventory's "reconcile" column was a planning snapshot, not a
deferred TODO.

**What this means for the original plan:**

- **Step 1 (Biome sweep) — already done at M2 close** (commit
  `d8f85049`, 2026-04-29). The 17 "Target environment" headers and
  ~30 substantive Biome references were all reconciled at that time.
- **Step 2 (`13-biome/` decommission) — done by Session A**
  (2026-05-11). The directory itself was the legitimate fast-follow;
  Session A correctly deleted it and removed the 5 remaining
  cross-references.
- **Step 3 (raw command reconciliation in `12-04-publishing.md`) —
  already done at M2 close.** Lines 18, 24, 39, 45 now correctly
  frame `deno publish` / `npm publish` as descriptions of what
  `lykn publish` wraps, plus explicit counter-cues. The
  instructional usages were replaced in M2.
- **Step 4 (`deno test`/`deno run` drift in `15-lykn-cli.md`) —
  already done.** Current line 197 reads "Wraps `deno test ...`"
  (descriptive), not instructional. Likely cleaned up in M2 or
  M3.5; verified zero remaining drift.
- **Steps 5-7 (DD-49 SKILL.md + DD-50 surface-forms-guide + DD-50
  SKILL.md style guidance) — legitimately pending.** These are the
  M7 fast-followups that were intentionally deferred from the DDs
  themselves.
- **Step 8 (M2 "Other drift" verification) — mostly resolved; one
  item still needs verification.** Items 1 (`deno add`), 2
  (`deno test`/`run`), 3 (`13-biome/`) are all closed. Item 4
  (`deno.json` exports path in `12-04-publishing.md` ID-03) needs
  verification against current build artifact shape.

**Methodology lesson:** CDC drafting a cleanup plan against an old
inventory MUST grep the current state before issuing MUST prompts
for CC. The M2 inventory was a 12-day-old snapshot; current state
was the ground truth, not the inventory.

**Session B prompt at `workbench/CC-prompt-guide-drift-session-B-2026-05-10.md`
is retired — its work is all already done.** Session A's prompt
(`workbench/CC-prompt-guide-drift-session-A-2026-05-10.md`) ran and
correctly handled the only real outstanding item (`13-biome/`
deletion). Session C's prompt
(`workbench/CC-prompt-guide-drift-session-C-2026-05-10.md`) remains
valid — all 5 of its deliverables are legitimately pending.

---

## Background

Two sources of guide-related work were considered when this plan
was drafted:

1. **M2 guide-drift inventory** at
   `workbench/M2-guide-drift-inventory.md` (drafted 2026-04-29).
   Catalogued ~54 drift items across the guides. M2 (the milestone)
   closed at commit `d8f85049` with the reconciliations DONE for
   54 of those items. Inventory remained as a historical snapshot.
2. **M7 closing-report fast-followups** at
   `workbench/2026-05-10-M7-closing-report.md`. DD-49, DD-50, and
   DD-51 each had small SKILL.md / surface-forms-guide updates that
   were intentionally deferred from the DDs themselves. These are
   the legitimately-pending items.

After this cleanup lands (i.e., after Session C and item-4
verification close), the project's guides match SKILL.md as ground
truth across the board.

---

## What's already done

- **M2 commit `d8f85049` (2026-04-29):** Biome → `deno lint` /
  `deno fmt` reconciliation across 17 guide files; raw `deno
  publish` / `npm publish` → `lykn publish` reconciliation in
  `12-04-publishing.md`; added `npm publish` MUST-AVOID row to
  `14-no-node-boundary.md` ID-27.
- **DD-51 implementation (commit `f9b647a`, 2026-05-10):** ID-07 and
  ID-28 in `14-no-node-boundary.md`; SKILL.md Principle 1 bypass
  table augmentation; philosophy doc decided-question entry #6.
- **Guide-drift Session A (2026-05-11):** `docs/guides/13-biome/`
  directory deleted; 5 cross-references removed from
  `10-project-structure.md`, `14-no-node-boundary.md`,
  `15-lykn-cli.md`.

---

## What's still pending — the actual "do now" list

These items are M7 fast-followups that were intentionally deferred.
They constitute the legitimate scope of Session C
(`workbench/CC-prompt-guide-drift-session-C-2026-05-10.md`).

### 1. DD-49 fast-follow: SKILL.md naming conventions update

Add the predicate-prefix list (`is-`, `has-`, `can-`, `should-`,
`will-`, `does-`, `was-`, `had-`), the abbreviation table for
embedded punctuation (`?` → `QMARK`, `!` → `BANG`, `*` → `STAR`,
etc.), multi-char arrow mappings (`->` → `To`, `<-` → `From`), and
macro overrides (`->` → `threadFirst`, `->>` → `threadLast`). Note
`$` is NOT in the table — it's a valid JS identifier character per
DD-49 Rule 3's `$`-passthrough note.

Target file: `assets/ai/SKILL.md` naming conventions section.

Source: `docs/design/05-active/0049-identifier-mapping-lykn-js.md`.

### 2. DD-50 surface-forms guide updates

Three additions to `docs/guides/00-lykn-surface-forms.md`:

- **New entry for the `do` form** (sequence of expressions,
  position-aware; statement position → block, expression position
  → IIFE; distinct from `do-while`).
- **Note on position-aware `if`** (DD-50 Rule 1) — both branches
  pure expressions → ternary; statement branches → IIFE; no-else
  in expression position → compile error.
- **Style guidance** (DD-50 Rule 5) — "Prefer `?` for expression
  position; prefer `if` for statement position. Functionally
  equivalent; explicit forms communicate intent."

Source: `docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`.

### 3. DD-50 SKILL.md style guidance

Add the Rule 5 style guidance to `assets/ai/SKILL.md` (anti-patterns
or style section). One-paragraph addition, including the
"LLM-generated code: treat as a hard rule" note.

### 4. M2 "Other drift" item 4 verification

`workbench/M2-guide-drift-inventory.md` "Other drift" section
flagged `deno.json` `exports` pointing to `./dist/mod.js` in
`12-04-publishing.md` ID-03 as a concern at M2 draft time. Verify
the current state of `12-04-publishing.md` ID-03 against the actual
`lykn build --dist` artifact shape (consult `15-lykn-cli.md` for
the canonical artifact-staging description).

If drift remains, surface it as a finding for the build-dir-reorg
thread (M11) to handle — M11's build-dir reorg will likely reshape
the exports paths anyway, so this item naturally folds into M11's
scope.

---

## Per-thread guide drift

These items wait on the corresponding Phase-2 conversation thread
closing.

### After Thread 3 (M11 build-dir reorg + M13 publish dirty-check)

**M11 lands:**

- `10-project-structure.md` — update directory tree (`target/lykn/build/`
  and `target/lykn/dist/` paths).
- `11-documentation.md` — consumer-facing references to output paths.
- `12-04-publishing.md` — publish pipeline that consumes build
  output. **Folds in item 4 above.**
- `14-no-node-boundary.md` — verify no stale path refs after the
  reorg.
- `15-lykn-cli.md` — `lykn build` and `lykn build --dist` subcommand
  descriptions.

**M13 lands:**

- `12-04-publishing.md` — document the new dirty-check gate +
  `--allow-dirty` opt-out.
- `15-lykn-cli.md` — `lykn publish` subcommand description.
- `assets/ai/CLAUDE.md` "Lykn CLI safety gates" — may need a
  cross-reference to confirm M13 materializes the rule.

### After Thread 1 (M10 .d.ts + surface-macros gap + mycelium friction)

**M10 (`.d.ts` generation) lands:**

- `02-api-design.md` — TypeScript consumer support; type-annotation
  → `.d.ts` mapping.
- `11-documentation.md` — consumer documentation patterns.
- `12-04-publishing.md` — publishing with `.d.ts` artifacts in `dist/`.
- `15-lykn-cli.md` — `lykn build` description mentions `.d.ts`
  output.

**Surface-macros JS-loading gap closes (if it lands):**

- No specific guide today; possibly a new section in
  `01-core-idioms.md` or `09-anti-patterns.md` on macro authoring
  patterns.

**Mycelium smoke-test findings:** ad-hoc per finding.

### After Thread 2 (compiler architecture coherence)

**DD-36 / DD-37 resolution:**

- If promoted: update `docs/dev/` architecture docs.
- If decommissioned: archive or delete the workbench drafts;
  document the alternative decision in `docs/dev/`.

**V-06 (JS-side analyzer) decision:**

- **Option A (build JS analyzer):** SKILL.md updates for symmetric
  warnings; `09-anti-patterns.md` may get new entries; `16-testing.md`
  mentions both compilers' analysis layers.
- **Option B (document divergence):** SKILL.md adds explicit note
  ("Rust compiler is the validation pass; run `lykn check` for full
  analysis").

**Error-format alignment:**

- If type-check message format changes, update DD-49 Rule 7
  ("Refinement log" entry).
- `03-error-handling.md` — any references to the format.

**`compileBoth` broader adoption:**

- `16-testing.md` — document the `compileBoth` pattern as recommended
  for cross-compiler verification.
- SKILL.md — testing-related guidance.

### After Thread 4 (M12 lykn-source linter)

**`lykn lint` command lands:**

- `15-lykn-cli.md` — new `lykn lint` command section.
- `09-anti-patterns.md` — cross-reference lint rule names (each
  entry discoverable by rule name for grep).
- SKILL.md anti-patterns table — link entries to corresponding lint
  rules.
- Possibly new guide `17-linting.md` if M12's scope warrants a
  dedicated reference page.
- `16-testing.md` — mention linter integration in test runners.

---

## Working-session bookkeeping

After Session C lands (the 4 pending items above), the "do now"
guide-drift work is fully closed. The per-thread items then land as
each Phase-2 thread completes.

**This session's two-phase purpose:**

1. Guide-drift cleanup (mostly closed; Session C is the final
   pending CC pass).
2. 0.6.0 release coordination — version bumps, changelog, release
   notes, dry-runs against JSR/npm/crates, Duncan's manual publish.
   Models on `M9-release` from 0.5.2 work. Begins after M10-M14
   close.

**Status tracker** (update as items complete):

- [x] Step 1 — Biome → deno lint/fmt sweep — **already done at M2
      close (commit `d8f85049`, 2026-04-29)**
- [x] Step 2 — `13-biome/` decommission — **done by Session A
      (2026-05-11)**
- [x] Step 3 — `12-04-publishing.md` raw command reconciliation —
      **already done at M2 close (commit `d8f85049`)**
- [x] Step 4 — `15-lykn-cli.md` `deno test`/`run` drift —
      **already done (M2 or M3.5)**
- [x] Step 5 — DD-49 SKILL.md naming-conventions update — **done
      (Session C D1)**
- [x] Step 6 — DD-50 surface-forms guide updates (`do`, position-
      aware `if`, style guidance) — **done (Session C D2)**
- [x] Step 7 — DD-50 SKILL.md style guidance — **done (Session C
      D3)**
- [x] Step 8 — M2 "Other drift" item 4 verification (12-04 ID-03
      exports path) — **done (Session C D4); item 4 deferred to M11
      build-dir reorg — current exports path is correct for current
      layout but will change with 0.6.0 reorg**
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

- `workbench/M2-guide-drift-inventory.md` — original drift
  inventory (Phase 1, M2 milestone). **Historical snapshot only —
  reconciliations done at M2 close (commit `d8f85049`).**
- `workbench/phase-2-plan.md` — Phase-2 milestone list.
- `workbench/2026-05-10-M7-closing-report.md` — DD-49/DD-50
  fast-follow source.
- `docs/design/05-active/0049-identifier-mapping-lykn-js.md` —
  DD-49 (step 5).
- `docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`
  — DD-50 (steps 6, 7).
- `docs/design/01-draft/0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md`
  — DD-51 (already-landed doc updates).
- `assets/ai/SKILL.md` — ground truth for all reconciliations.
- `docs/philosophy.md` — foundational principles.
- `workbench/CC-prompt-guide-drift-session-A-2026-05-10.md` —
  Session A prompt (ran successfully; 13-biome cleanup).
- `workbench/CC-prompt-guide-drift-session-B-2026-05-10.md` —
  Session B prompt (**retired — work already done at M2 close**).
- `workbench/CC-prompt-guide-drift-session-C-2026-05-10.md` —
  Session C prompt (legitimately pending; ready for CC).
