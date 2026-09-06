---
number: 51
title: "`deno add` Adjudication — Guide 14 vs SKILL Contradiction"
author: "the SKILL"
component: All
tags: [change-me]
created: 2026-05-03
updated: 2026-05-05
state: Overwritten
supersedes: null
superseded-by: null
version: 1.0
---

# `deno add` Adjudication — Guide 14 vs SKILL Contradiction

## Status

Proposed (pending Duncan/CDC review)

## Context

- `docs/guides/14-no-node-boundary.md` ID-07 ("No `npm install` / `npm run` — Use `deno add` / `deno task`") recommends `deno add` and `deno task` as replacements for npm commands.
- `assets/ai/SKILL.md` "Before You Do Anything" Principle 1 explicitly bans `deno add`: the bypass table says `npm install <x>` → "add to `project.json` `imports`, let Deno cache it."
- These contradict each other inside the project's own ground-truth corpus.
- First surfaced in M2's inventory as `needs-adjudication`; carried forward through M3.5 and into Phase 2.
- Two coherent readings exist:
  - **Reading A (SKILL is canonical):** Lykn projects use `project.json` workspace-level import map. `deno add` writes to a package-level `deno.json`, which lykn's workspace resolution doesn't read for import-map entries. Recommending `deno add` for lykn projects misdirects users.
  - **Reading B (layer separation):** Guide 14 speaks to Deno-native projects (no Lykn); SKILL speaks to the Lykn-project layer. Both are correct in their respective layers, but need disambiguation.
- M2 CDC review's prior weak lean: Reading A. Guide 14's title is "No-Node Boundary" — its purpose is the boundary Lykn projects draw, which is the layer SKILL applies to.

## Options analyzed

### Option A: SKILL is canonical; update guide 14

Update guide 14 ID-07 to match SKILL's directive:

- Replace `deno add` recommendation with "add to `project.json` `imports`"
- Add `deno add` to the MUST-AVOID table alongside `npm publish` (ID-27)
- Keep `deno task` recommendation (lykn doesn't wrap task-running; `deno task` is acceptable for project scripts defined in the user's `deno.json`)

**Pros:**

- One source of truth — SKILL and guide 14 agree.
- Matches philosophy Principle 2: Lykn projects use lykn-fronted operations. Adding dependencies is a project-level operation that should go through the project's import map, not Deno's per-package mechanism.
- Users of guide 14 ARE Lykn users (the guide is in the Lykn project's `docs/guides/`).
- Eliminates the contradiction entirely.

**Cons:**

- `deno add` is a real Deno capability that some users know and expect. Banning it may feel heavy-handed.
- The `project.json` imports approach is manual (no version resolution, no lock-file integration). `deno add` provides version resolution from JSR/npm. The manual approach is less ergonomic.
- Future work: when `lykn add` exists (a Lykn-fronted equivalent), this becomes cleaner. Until then, "edit project.json manually" is the user experience.

### Option B: Layer separation; update both

- Update guide 14 to scope its recommendations explicitly: "When working with Deno directly (without the Lykn CLI), use `deno add` for package management."
- Update SKILL Principle 1 to footnote: "The `deno add` ban applies to Lykn projects using `project.json` workspace imports. For Deno-native projects without Lykn, `deno add` is the correct tool."

**Pros:**

- Preserves more of guide 14's existing content.
- Honest about the two-layer reality (Deno-native vs Lykn-project).

**Cons:**

- Users must distinguish which layer they're in. In practice, Lykn users are ALWAYS in the Lykn-project layer — that's the whole point of guide 14 living inside the lykn project.
- Adds cognitive overhead: "am I in Deno-native mode or Lykn-project mode?"
- Guide 14 becomes conditionally-correct, which is harder to follow than unconditionally-correct.

### Option C: Clarify guide 14's audience (minimal)

Add a preamble to guide 14 stating its audience is Lykn projects, then defer to SKILL for the authoritative guidance on each item. Leave ID-07 as-is but add a note: "In Lykn projects, prefer editing `project.json` `imports` directly (per SKILL.md Principle 1)."

**Pros:**

- Least invasive change.
- Acknowledges the contradiction without fully resolving it.

**Cons:**

- The contradiction still exists in the body of the guide. A user reading ID-07 without the preamble gets the wrong advice.
- Doesn't resolve the MUST-AVOID question (should `deno add` be in the MUST-AVOID table?).
- "Prefer" is weaker than SKILL's "Never" — leaving ambiguity.

## Decision

**Option A: SKILL is canonical; update guide 14**

### Rationale

1. **Philosophy Principle 2 is unambiguous.** "A Lykn user runs `lykn <command>` for every project operation." Dependency management is a project operation. Until `lykn add` exists, the user edits `project.json` directly. `deno add` writes to the wrong file (`deno.json`), in the wrong format (Deno's per-package mechanism vs Lykn's workspace import map).

2. **Guide 14's audience IS Lykn users.** The guide lives in the Lykn project's `docs/guides/` directory. It's loaded by the SKILL's Document Selection Guide. Its title ("No-Node Boundary") names a boundary that Lykn projects draw. There is no audience for this guide that isn't already in the Lykn-project layer.

3. **Layer separation (Option B) creates unnecessary cognitive overhead.** If the guide is always read by Lykn users (which it is), adding "unless you're in Deno-native mode" conditions is wasted complexity. The hypothetical Deno-native user doesn't consult Lykn's guides.

4. **`deno task` is a separate question.** Unlike `deno add` (which conflicts with Lykn's import-map mechanism), `deno task` is a script runner that reads tasks from `deno.json`. Lykn projects CAN use `deno task` for custom project scripts alongside `lykn`-fronted operations. The guide should keep `deno task` as acceptable but ban `deno add`.

### Why others rejected

- **Option B:** Adds layer-distinction overhead for an audience that's always in one layer. Over-specified.
- **Option C:** Doesn't resolve the contradiction; leaves "prefer" vs "Never" ambiguity.

## Implementation outline

- **Documentation changes (M8 scope):**
  - `docs/guides/14-no-node-boundary.md` ID-07: heading becomes "No `npm install` — Use `project.json` `imports`". Body explains the Lykn import-map approach. `deno add` named in a counter-cue.
  - `docs/guides/14-no-node-boundary.md` MUST-AVOID table: add row for `deno add` (similar to the `npm publish` row added in M2).
  - `deno task` stays as an acceptable Deno-native tool (not banned; not promoted).
  - Replacement table row: `npm install` → "Add to `project.json` `imports`, Deno caches automatically" (matching SKILL).
- **No source code changes.** This is purely documentation alignment.

## Relationship to philosophy

- **Principle 2 (lykn-only tooling):** `deno add` is a Deno-native tool that writes to files Lykn doesn't own. Banning it for Lykn projects is consistent with the principle.
- **Future `lykn add`:** When (if) a `lykn add` command is implemented that writes to `project.json` imports, the user experience improves. But the absence of `lykn add` doesn't justify promoting `deno add` — the manual approach (edit `project.json`) is correct if less ergonomic.

## Open questions

1. **`deno task` companion question:** Should `deno task` also be banned? Proposed answer: no. `deno task` reads from `deno.json` which Lykn projects use for per-package config. Running project-defined tasks via `deno task` is acceptable alongside `lykn test`/`lykn build`. The difference: `deno add` WRITES incorrect state; `deno task` READS user-defined scripts.

2. **`lykn add` as future work:** Should this DD recommend implementing `lykn add`? Proposed answer: note as a good-to-have but not block the documentation fix on it. The fix is "ban `deno add`"; the improvement is "provide `lykn add` later."

3. **`deno cache` for prefetching:** The M9 closing report notes that `deno cache <specifier>` is needed for offline compilation. Is `deno cache` also banned under Principle 2? Proposed answer: no — `deno cache` is an infrastructure command (like `git fetch`) that populates a cache; it doesn't modify project configuration. Document as acceptable in the "offline prefetch" pattern.