# CC Prompt — Guide-Drift Cleanup Session A

**Scope:** the Biome → `deno lint` / `deno fmt` sweep across the guides,
plus decommissioning the `docs/guides/13-biome/` directory. Step 1
and Step 2 from `workbench/guide-drift-cleanup-plan-2026-05-10.md`.

This is the largest of the three "do now" CC sessions. Single-purpose,
mechanical, well-bounded.

## Context

The lykn project's guides at `docs/guides/` were written when Biome
was the recommended JS lint/format tool. The current ground truth at
`assets/ai/SKILL.md` says the toolchain uses Deno's built-in
`deno lint` and `deno fmt`. The M2 guide-drift inventory at
`workbench/M2-guide-drift-inventory.md` (drafted 2026-04-29)
catalogued ~47 Biome-related drift items. They never landed; this
session closes them.

CC should not need to revisit M2's audit work. The file:line
references below are sufficient; the existence-of-drift is established.

## Scope

Three MUST deliverables. **All are MUST — no optional items.** If
any deliverable cannot be completed as specified, stop and surface
the constraint.

This is a doc-only session — no source code changes (`crates/` and
`packages/` are untouched).

---

## Required reading (skim, not deep-read)

1. `assets/ai/LEDGER_DISCIPLINE.md` — protocol.
2. `workbench/guide-drift-cleanup-plan-2026-05-10.md` — the parent
   plan, Steps 1 and 2 (this session's scope).
3. `workbench/M2-guide-drift-inventory.md` — the source inventory
   with line numbers.
4. `assets/ai/SKILL.md` — ground truth for `deno lint` / `deno fmt`
   wording.

---

## Deliverable 1 — "Target environment" header sweep (MUST)

17 guides share the same header pattern reading approximately:

```
Target environment: **Deno**, **ESM-only**, **Biome** on compiled output.
```

(Exact wording varies slightly per file but the "Biome" reference is
consistent.)

**Required action:** replace `**Biome** on compiled output` with
`**Deno's built-in `deno lint` and `deno fmt`** on compiled output`.

**Files (per M2 inventory):**

- `docs/guides/00-lykn-surface-forms.md:6`
- `docs/guides/01-core-idioms.md:9`
- `docs/guides/02-api-design.md:9`
- `docs/guides/03-error-handling.md:9`
- `docs/guides/04-values-references.md:9`
- `docs/guides/05-type-discipline.md:13`
- `docs/guides/06-functions-closures.md:9`
- `docs/guides/07-async-concurrency.md:10`
- `docs/guides/08-performance.md:10`
- `docs/guides/09-anti-patterns.md:13`
- `docs/guides/10-project-structure.md:10`
- `docs/guides/11-documentation.md:10`
- `docs/guides/12-deno/12-01-runtime-basics.md:11`
- `docs/guides/12-deno/12-02-testing.md:9`
- `docs/guides/12-deno/12-03-task-runner.md:8`
- `docs/guides/12-deno/12-04-publishing.md:9`
- `docs/guides/14-no-node-boundary.md:10`

**MUST verify** with:

```sh
grep -nE "Biome" docs/guides/*.md docs/guides/*/*.md | grep -v "13-biome/"
```

After this deliverable, the only remaining Biome references should be
inside `13-biome/` itself (which Deliverable 2 deletes).

---

## Deliverable 2 — `13-biome/` decommission + cross-reference cleanup (MUST)

The directory `docs/guides/13-biome/` contains three files:

- `13-01-setup.md`
- `13-02-lint-rules.md`
- `13-03-formatting.md`

All three document Biome setup, lint rules, and formatting — content
that contradicts SKILL.md ground truth.

**Required action:** delete the entire `docs/guides/13-biome/`
directory.

```sh
rm -rf docs/guides/13-biome/
```

**Cross-references to update:** the following files reference
`13-biome/` and need their cross-references removed (per M2
inventory):

- `docs/guides/10-project-structure.md:578` — "See `13-biome/01-setup.md`"
- `docs/guides/14-no-node-boundary.md:96` — "See also: `13-biome/01-setup.md`"
- `docs/guides/14-no-node-boundary.md:252` — "See also: `13-biome/01-setup.md`"
- `docs/guides/14-no-node-boundary.md:371` — "See `13-biome/01-setup.md`"
- `docs/guides/15-lykn-cli.md:132` — "See also: `13-biome/13-03-formatting.md`"

For each cross-reference: **remove the "See also" / "See" line
entirely** (don't replace with a dangling note — the content no
longer exists, so a "See X" pointing nowhere is worse than no
pointer at all).

**MUST verify** with:

```sh
test ! -d docs/guides/13-biome
grep -rE "13-biome" docs/ assets/ 2>/dev/null
```

The first command MUST succeed (directory gone). The second MUST
return zero matches.

---

## Deliverable 3 — Substantive Biome reference reconciliation (MUST)

Beyond the header lines (D1) and the directory deletion (D2), there
are ~30 instructional / code-block / table-row references to Biome
across the guides. Replace each per the patterns below.

### Substitution patterns

| Find | Replace with |
|---|---|
| `biome format --write <path>` | `deno fmt <path>` |
| `biome format` (general) | `deno fmt` |
| `biome lint <path>` | `deno lint <path>` |
| `biome lint` (general) | `deno lint` |
| `biome check <path>` | `deno lint <path>` |
| `biome.json` | `deno.json` |
| "Biome" (capitalized, prose) | "`deno lint`/`deno fmt`" or context-appropriate substitution |
| "Biome config goes in `biome.json`" | "lint/format config goes in `deno.json`" |
| "Format compiled output with Biome" | "Format compiled output with `deno fmt`" |
| "ESLint → Biome" (comparison) | "ESLint → `deno lint`" |
| "Prettier → Biome" (comparison) | "Prettier → `deno fmt`" |

### Files and line-references (per M2 inventory)

**`docs/guides/14-no-node-boundary.md`** — 11 references:

- Line 72: "Biome config goes in `biome.json`" → "lint/format config
  goes in `deno.json`"
- Line 92: ID-08 heading containing "Use `biome.json`" → "Use
  `deno.json`"
- Line 248: ID-22 heading containing "Use Biome" → "Use `deno lint`
  / `deno fmt`"
- Line 311: MUST-AVOID table row 08 (`biome.json`) → `deno.json`
- Line 325: MUST-AVOID table row 22 (`Biome`) → `deno lint` / `deno fmt`
- Line 340: Migration table `.eslintrc + .prettierrc → biome.json` →
  `.eslintrc + .prettierrc → deno.json`
- Line 355: Comparison ESLint → Biome → ESLint → `deno lint`
- Line 356: Comparison Prettier → Biome → Prettier → `deno fmt`

(Lines 96, 252, 371 are cross-refs handled in D2.)

**`docs/guides/15-lykn-cli.md`** — 5 substantive references:

- Line 130: "use `biome format`" → "use `deno fmt`"
- Line 314: `biome format --write dist/` → `deno fmt dist/`
- Line 317: `biome lint dist/` → `deno lint dist/`
- Line 333: `biome format --write dist/` → `deno fmt dist/`
- Line 339: `biome check dist/` → `deno lint dist/`
- Line 344: `biome format --write dist/` → `deno fmt dist/`

(Line 132 is a cross-ref handled in D2.)

**`docs/guides/10-project-structure.md`** — 8 substantive references:

- Line 66: `biome.json` in directory tree → remove the line (no
  equivalent file needed; lykn projects use `deno.json` already
  listed in the tree)
- Line 345: "Biome config goes in `biome.json`" → "lint/format config
  goes in `deno.json`"
- Line 496: "pipeline alongside Biome formatting" → "pipeline
  alongside `deno fmt` formatting"
- Line 502: "Format compiled output with Biome" → "Format compiled
  output with `deno fmt`"
- Line 503: `biome format --write dist/` → `deno fmt dist/`
- Line 516: `biome format` in pipeline diagram → `deno fmt`
- Line 522: `biome format --write` in numbered steps → `deno fmt`
- Line 527: "Biome formats" → "`deno fmt` formats"

(Line 578 is a cross-ref handled in D2.)

**`docs/guides/12-deno/`** files — 6 substantive references:

- `12-01-runtime-basics.md:153`: `biome format --write dist/` →
  `deno fmt dist/`
- `12-03-task-runner.md:23`: `biome check dist/` in deno.json task
  → `deno lint dist/`
- `12-03-task-runner.md:25`: `biome format --write dist/` in
  deno.json task → `deno fmt dist/`
- `12-03-task-runner.md:50`: `biome format --write dist/` in
  Makefile → `deno fmt dist/`
- `12-03-task-runner.md:56`: `biome check dist/` in Makefile →
  `deno lint dist/`
- `12-04-publishing.md:62`: `biome format --write dist/` in
  pipeline → `deno fmt dist/`

### Verification grep (after all substitutions)

```sh
grep -rE "biome|Biome" docs/ assets/ 2>/dev/null
```

Expected: zero matches. If any remain, audit each and either
substitute or surface the constraint.

---

## Verification checklist (all MUST be checked before reporting complete)

- [ ] **D1 verification:** `grep -nE "Biome on compiled output"
      docs/guides/*.md docs/guides/*/*.md` returns zero matches.
- [ ] **D1 verification (positive):** `grep -nE "Deno's built-in"
      docs/guides/` returns 17 matches (one per file updated).
- [ ] **D2 verification:** `test ! -d docs/guides/13-biome` succeeds.
- [ ] **D2 verification:** `grep -rE "13-biome" docs/ assets/`
      returns zero matches.
- [ ] **D3 verification:** `grep -rE "biome|Biome" docs/ assets/`
      returns zero matches.
- [ ] `make lint` clean (the lykn lint targets — should be unaffected
      since no source code changed).
- [ ] `git status -s` shows only `docs/guides/` changes (and the
      deleted `13-biome/` directory). No `crates/` or `packages/`
      changes.
- [ ] `git diff --stat` confirms scope: ~25 files modified, 3 files
      deleted.
- [ ] Single coherent commit chain naming the deliverables. No "WIP"
      or "fixup" commits.

---

## Reporting (when complete)

Post a 3-row deliverable × evidence table:

| # | Deliverable | Result |
|---|---|---|
| 1 | Header sweep | 17 files updated; verification greps pass |
| 2 | 13-biome decommission | Directory deleted; 5 cross-refs removed; verification greps pass |
| 3 | Substantive Biome refs | ~30 references substituted across 5 files; verification greps pass |

Include the commit SHA(s) and the final state of the verification
greps.

---

## What this session does NOT cover

- **Step 3** (raw command reconciliation in `12-04-publishing.md`)
  — separate Session B.
- **Step 4** (`deno test`/`run` drift in `15-lykn-cli.md`) —
  separate Session B.
- **Steps 5-7** (DD-49/DD-50 fast-follows) — separate Session C.
- **Per-thread guide updates** — wait on the corresponding Phase 2
  conversation thread closing.
- **Any source code changes** — out of scope; doc-only.

---

## Methodology notes

- Per CLAUDE.md "Lykn CLI safety gates": no safety-bypass flags
  needed.
- Per LEDGER_DISCIPLINE: this session is small enough that no
  closing report is required — a thorough commit message naming the
  three deliverables suffices. (If the parent plan's status tracker
  needs updating, that's an out-of-band CDC task.)
- Per SUBAGENT-DELEGATION-POLICY: this work is entirely mechanical
  (find/replace + directory delete) and subagent-delegatable. A
  single subagent can probably handle D1 + D3 in one pass; D2 is a
  shell command + cross-ref edits.

## Anticipated objections

- **"What if the substitution introduces awkward wording in some
  cases?"** Use judgment. The patterns above are the default; if a
  specific line reads poorly after mechanical substitution (e.g.,
  "the Biome formats output" → "the `deno fmt` formats output" is
  ungrammatical), rephrase to match SKILL.md's wording for similar
  constructions. Don't preserve Biome references for "stylistic"
  reasons.
- **"Should `13-biome/` content be archived instead of deleted?"**
  No. The content contradicts ground truth, predates the toolchain
  shift, and isn't load-bearing for any active milestone. Git
  history preserves it if anyone ever needs to recover it.
- **"What if a line number from the M2 inventory is off (file has
  been edited since)?"** Use the inventory as a starting hint; the
  substantive content (e.g., `biome format --write dist/`) is more
  important than the exact line number. If the content has moved,
  find it; if it's been removed already, note that in the report
  and skip.
- **"What about `biome` mentions in commits / commit messages /
  git history?"** Out of scope. Only the current state of files in
  `docs/` and `assets/` matters.
