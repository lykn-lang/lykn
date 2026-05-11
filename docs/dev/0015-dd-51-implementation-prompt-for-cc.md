# DD-51 Implementation Prompt for CC

## Context

DD-51 (`docs/design/01-draft/0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md`)
commits four rules for the lykn-only-tooling vs deno-native-tooling
boundary:

1. **`deno add` is banned in lykn projects** — writes to the wrong
   file (`deno.json`) in the wrong format; lykn projects use
   `project.json` workspace imports.
2. **`deno task` is acceptable** — reads project scripts from
   `deno.json`'s `tasks` field; doesn't conflict with workspace
   imports.
3. **`deno cache` is acceptable** — and is the official
   offline-prefetch tool per DD-48; not banned, not promoted.
4. **`lykn add` is tracked as future work** — ergonomic
   dependency-addition command; not blocking on this DD.

The implementation is **documentation alignment only — no source
code changes.** The current state of `docs/guides/14-no-node-boundary.md`
contradicts SKILL.md (ID-07 recommends `deno add`; SKILL.md
Principle 1 bans it). This implementation closes the contradiction.

The DD's implementation outline (lines 222-385) prescribes 5
specific edits to guide 14 + 1 edit to SKILL.md + an optional
philosophy doc entry. This prompt makes each MUST.

The work is small — single-day scope. Last M7 row pending before M7
closes (M7-4 — DD-51).

---

## Scope

Six MUST deliverables (5 doc edits + closing report). **All are
MUST — no optional items.** If any deliverable cannot be completed
as specified, stop and surface the constraint to Duncan/CDC.

No source code changes. No tests required (the DD is doc-alignment
only). Verification is via greps confirming the edits landed.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md` — protocol.
2. `docs/design/01-draft/0051-deno-native-tool-boundaries-deno-add-deno-task-deno-cache-lykn-add.md`
   — the DD; specifically the Implementation outline section
   (lines 222-385) which prescribes the edits.
3. `docs/guides/14-no-node-boundary.md` — the target of the bulk
   of the edits. Lines 86 (ID-07 heading), 310 (summary table),
   343 (replacement table) are the load-bearing positions.
4. `assets/ai/SKILL.md` — specifically the "Before You Do Anything"
   Principle 1 bypass table around line 51.
5. `docs/philosophy.md` — for the optional decided-question entry
   (Deliverable 5).

---

## Deliverable 1 — Update guide 14 ID-07 heading (MUST)

**File:** `docs/guides/14-no-node-boundary.md` line 86.

**Old:**
```markdown
## ID-07: No `npm install` / `npm run` — Use `deno add` / `deno task`
```

**New:**
```markdown
## ID-07: No `npm install` — Use `project.json` `imports`
```

Rationale: `deno add` is now banned (Rule 1); `npm run` is not the
focus (`lykn run` / `deno task` cover script execution). The
heading names the cue user is most likely to reach for and the
correct replacement.

---

## Deliverable 2 — Add body content to ID-07 (MUST)

**File:** `docs/guides/14-no-node-boundary.md` immediately after the
new heading from Deliverable 1.

The current ID-07 entry has no body — just `**Strength**: MUST-AVOID`.
Add the following body content (copy verbatim from DD-51's
Implementation outline Edit 2 at lines 235-281, or transcribe the
equivalent — the worked example with `project.json` JSON snippet
and the `deno cache` offline-prefetch note MUST be present):

```markdown
**Strength**: MUST-AVOID

**Summary:** Lykn projects manage dependencies via the workspace-level
`project.json` `imports` map, not Deno's per-package `deno.json` or
`deno add`. The latter writes to a file Lykn's workspace resolver
doesn't read.

**Adding a dependency** — edit `project.json` directly:

```json
{
  "imports": {
    "@std/path": "jsr:@std/path@^1.0.0",
    "lodash": "npm:lodash@^4.17.21"
  }
}
```

Online builds: Deno auto-caches on first import. No prefetch needed.

Offline builds: prefetch the new dependency once before going
offline, using Deno's cache infrastructure command:

```sh
deno cache jsr:@std/path
```

`deno cache` is acceptable in lykn projects (per DD-51 Rule 3) — it's
infrastructure, not project configuration. `deno add` is **not**
acceptable (it writes to the wrong file).

**Counter-cue (read this if you're tempted to bypass):** `deno add`
is a real Deno command, but its target is `deno.json` per-package
imports, which lykn's workspace resolver doesn't honour. Editing
`project.json` directly is the correct workflow.
```

---

## Deliverable 3 — Update the summary table at line 310 (MUST)

**File:** `docs/guides/14-no-node-boundary.md` summary table around
line 310 (look for the row starting `| 07 |`).

**Old row:**
```markdown
| 07 | `npm install`/`npm run` | MUST-AVOID | `deno add`/`deno task` |
```

**New row:**
```markdown
| 07 | `npm install` | MUST-AVOID | edit `project.json` `imports`; `deno cache` to prefetch for offline |
```

Verify by reading the surrounding table to confirm the row's
position and format match (4 columns: ID, source, strength,
replacement).

---

## Deliverable 4 — Update the replacement table at line 343 (MUST)

**File:** `docs/guides/14-no-node-boundary.md` replacement table
around line 343.

**Old row:**
```markdown
| | `npm install` | `deno add` |
```

**New row:**
```markdown
| | `npm install` | edit `project.json` `imports` (offline: `deno cache <spec>`) |
```

---

## Deliverable 5 — Add new MUST-AVOID entry for `deno add` (MUST)

**File:** `docs/guides/14-no-node-boundary.md`.

Add a new ID-NN entry banning `deno add` explicitly. Place it in a
position that fits the guide's existing organization (next available
ID number, near ID-07 or in the appropriate MUST-AVOID section —
read the guide's structure to determine the right spot).

**Required content:**

```markdown
## ID-NN: No `deno add` — Edit `project.json` `imports` Directly

**Strength**: MUST-AVOID

**Summary**: `deno add` writes to `deno.json` per-package imports,
which lykn's workspace resolver does not read. Edit `project.json`
`imports` directly. See ID-07 for the workflow.
```

Replace `ID-NN` with the actual next available ID number. Determine
by reading the guide's existing ID range — likely ID-28 or ID-29
based on the M2-era addition of `npm publish` entry.

**Also update the summary table** at line 310 to include this new
row (after the row for the new ID-NN entry).

---

## Deliverable 6 — Update SKILL.md Principle 1 bypass table (MUST)

**File:** `assets/ai/SKILL.md` around line 51 (in the "Before You
Do Anything" Principle 1 bypass table).

**Old row:**
```markdown
| `npm install <x>` | add to `project.json` `imports`, let Deno cache it |
```

**New row:**
```markdown
| `npm install <x>` | add to `project.json` `imports` — Deno auto-caches online; for offline use `deno cache <spec>` |
```

Verify the table column structure is preserved.

---

## Deliverable 7 — Philosophy doc decided-question entry (MUST)

**File:** `docs/philosophy.md`.

Per the pattern of M3.5 / M5 / M9 closing reports, significant
tooling decisions get a one-line entry in `docs/philosophy.md`'s
"Decided design questions" list. Add a new entry (CC determines the
next-available number based on the existing list):

```markdown
N. **`deno add` is banned in lykn projects; `deno task`/`deno cache`
   are acceptable.** Lykn projects use `project.json` workspace-level
   imports, not Deno's per-package `deno.json` mechanism. `deno cache`
   is the offline-prefetch tool (per DD-48). `lykn add` is tracked as
   future work for ergonomic dependency addition; the absence of
   `lykn add` does not block the `deno add` ban. See DD-51.
```

Place the entry in the "Decided design questions" section,
maintaining the existing list's numbering and format.

---

## Deliverable 8 — Closing report (MUST)

**Path:** `workbench/2026-05-XX-DD-51-implementation-closing-report.md`
(use the actual close date in `YYYY-MM-DD`).

**Required structure** (mirror the DD-49 / DD-50.5 closing reports):

- Header: `**CC author:** Claude Code`,
  `**Disposition:** awaiting CDC review`, total deliverables (7).
- **Summary** — what landed, why DD-51 implementation matters.
- **Per-deliverable walk** — one section per deliverable above
  (D1 through D7), each with: file edited, line ranges affected,
  before/after excerpts where helpful, evidence file or commit SHA.
- **Substrate-rule compliance** — confirm:
  - No safety-bypass flags auto-passed (per CLAUDE.md "Lykn CLI
    safety gates").
  - No Verify commands silently rewritten.
  - No spec-softening — every rule from DD-51's Decision is
    reflected in the doc edits.
- **Cross-reference verification** — confirm that:
  - `docs/guides/14-no-node-boundary.md` no longer recommends
    `deno add` anywhere.
  - The new `deno add` MUST-AVOID entry (ID-NN) is reachable from
    the summary table.
  - `assets/ai/SKILL.md` Principle 1 bypass table is consistent
    with the guide 14 update.
  - `docs/philosophy.md` decided-question entry references DD-51.
- **DD state transition** — propose moving DD-51 from
  `docs/design/01-draft/` to `docs/design/05-active/` (Duncan
  handles the actual `odm` promotion).
- **Findings logged for fast-follow / future work**:
  - `lykn add` implementation (tracked in DD-51 Rule 4).
  - `lykn cache` wrapper (tracked in DD-51 Future Work).
  - Lock-file design for lykn projects (DD-51 Future Work).
- **What this implementation did NOT cover** — explicit
  out-of-scope (`lykn add`, lock-files, surface-forms-guide updates
  for `do`/`if`).
- **CDC review section at the end** (CDC fills in after review).

---

## Verification checklist (all MUST be checked before reporting complete)

CC MUST run each of these and confirm pass before declaring this
task done. **Reporting "done" without checking each box is a spec
violation.**

- [ ] `grep -nE "deno add" docs/guides/14-no-node-boundary.md`
      shows `deno add` only in counter-cue and MUST-AVOID contexts
      — NOT as a recommendation/replacement.
- [ ] `grep -nE "project.json.*imports|imports.*project.json" docs/guides/14-no-node-boundary.md`
      shows the new workflow in at least 3 places (ID-07 body,
      summary table, replacement table).
- [ ] `grep -nE "deno cache" docs/guides/14-no-node-boundary.md`
      shows the offline-prefetch tool in at least 2 places (ID-07
      body, summary table).
- [ ] `grep -nE "ID-NN|ID-2[89]|ID-3[0-9]" docs/guides/14-no-node-boundary.md`
      finds the new `deno add` MUST-AVOID entry (with the actual
      assigned ID number).
- [ ] `grep -nE "deno cache.*offline|offline.*deno cache" assets/ai/SKILL.md`
      finds the augmented Principle 1 bypass-table entry.
- [ ] `grep -nE "DD-51|deno add.*banned" docs/philosophy.md`
      finds the decided-question entry.
- [ ] `make lint` — clean (markdown linting if any; lykn syntax
      unaffected since no `.lykn` files changed).
- [ ] `make test` — green (no tests should be affected; sanity check).
- [ ] No source code changes — no edits to `crates/` or
      `packages/`. `git diff --stat` shows only `docs/` and
      `assets/ai/` files changed.
- [ ] Closing report written; per-deliverable walk for all 7 items
      (5 doc edits + philosophy entry + report itself).
- [ ] Single coherent commit chain naming the deliverables. No
      "WIP" or "fixup" commits.

---

## Reporting (when complete)

Post a 7-row deliverable × evidence table. Include:

- Path to the closing report.
- Commit SHA(s) of the DD-51 implementation.
- Confirmation that the verification checklist is fully checked.
- The actual ID number assigned to the new `deno add` MUST-AVOID
  entry.

---

## Methodology notes

- Per CLAUDE.md "Lykn CLI safety gates": none of these tasks
  require any safety-bypass flags.
- Per LEDGER_DISCIPLINE: this is the smallest of the M7 DDs to
  implement (doc-only). The closing report is still required —
  it logs the cross-reference verification that's load-bearing
  for the SKILL ↔ guide consistency.
- Per SUBAGENT-DELEGATION-POLICY: all seven deliverables are
  judgment-light (mechanical doc edits + grep verification).
  Subagent-delegatable end to end. The closing report is the only
  part requiring main-context judgment.

## Anticipated objections

- **"Why ID-NN and not just append to ID-07's body?"** ID-07 is
  about `npm install`; the new entry is about `deno add` (a
  separate Deno-native tool). They warrant separate IDs for
  discoverability and grep-ability.
- **"Why edit the summary table at line 310 AND the replacement
  table at line 343?"** They serve different reader paths: the
  summary table indexes all rules by ID; the replacement table is
  a quick-reference for "what should I run instead." Both need to
  be consistent.
- **"Is the philosophy doc entry necessary?"** Yes — significant
  tooling decisions get philosophy-doc entries per the pattern
  established by M3.5 / M5 / M9. It's a single line and makes the
  decision discoverable from the top-level philosophy.

## What DD-51 implementation does NOT cover

- `lykn add` implementation — tracked as future work (DD-51 Rule
  4). Not in scope here.
- `lykn cache` wrapper — tracked in DD-51 Future Work.
- Lock-file design — tracked in DD-51 Future Work.
- Surface-forms guide updates for new `do` form or position-aware
  `if` — those are DD-50.5 fast-follows, separate from DD-51.
