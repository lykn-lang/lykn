# CC Prompt — Guide-Drift Cleanup Session C

**Scope:** Steps 5, 6, 7, and 8 from
`docs/dev/0017-guide-drift-cleanup-plan.md`. The DD-49 and DD-50
documentation fast-follows that were intentionally deferred from
those DDs' implementation work, plus a final M2-inventory leftover
verification pass.

This is the third and final "do now" CC session in the guide-drift
cleanup track.

## Context

DD-49 (identifier mapping: lykn → JS) and DD-50 (position-aware
compilation of conditional and block forms) settled their design
decisions and shipped their compiler-side implementations in M7.
Each DD's spec called for accompanying SKILL.md / surface-forms-guide
updates so the user-facing documentation matches the compiler's
behavior. Those updates were intentionally deferred to a separate
guide-cleanup pass; this session lands them.

Plus a final verification pass against the M2 guide-drift inventory
to confirm nothing's left.

## Scope

Five MUST deliverables. **All are MUST — no optional items.** If
any deliverable cannot be completed as specified, stop and surface
the constraint.

Doc-only session — no `crates/` or `packages/` changes.

---

## Required reading

1. `assets/ai/LEDGER_DISCIPLINE.md` — protocol.
2. `docs/dev/0017-guide-drift-cleanup-plan.md` — the parent plan,
   Steps 5-8 (this session's scope).
3. `docs/design/05-active/0049-identifier-mapping-lykn-js.md` — DD-49
   (steps 5 and parts of 8).
4. `docs/design/05-active/0050-position-aware-compilation-of-conditional-and-block-forms.md`
   — DD-50 (steps 6 and 7).
5. `assets/ai/SKILL.md` — the file being updated in steps 5 and 7.
6. `docs/guides/00-lykn-surface-forms.md` — the file being updated
   in step 6.
7. `workbench/M2-guide-drift-inventory.md` — source inventory for
   step 8's verification pass.

---

## Deliverable 1 — SKILL.md naming-conventions update (DD-49 fast-follow) (MUST)

**File:** `assets/ai/SKILL.md`.

Find the naming-conventions table (currently shows predicate `?`
suffix and mutation `!` suffix entries — typically in the
"Naming conventions" or similar section near the SKILL's middle).

**Required additions to / updates of the table:**

### Predicate-prefix list (DD-49 Rule 1)

Add a row or section explaining the prefix-detection logic:

> **Predicate prefix detection:** when a `?`-suffix identifier
> already starts with `is-`, `has-`, `can-`, `should-`, `will-`,
> `does-`, `was-`, or `had-`, the compiler strips the `?` and emits
> the camelCase form without prepending `is-`. So `has-items?` →
> `hasItems` (not `isHasItems`). Otherwise, the compiler prepends
> `is-` then camelCases: `valid?` → `isValid`.

### Abbreviation table for embedded punctuation (DD-49 Rule 3)

Add a table or expanded section covering Rule 3 mappings:

| Character | Abbreviation | Example |
|---|---|---|
| `?` (mid/leading) | `QMARK` | `func?-thing` → `funcQMARKThing` |
| `!` (mid/leading) | `BANG` | `set!-state` → `setBANGState` |
| `*` | `STAR` | `*globals*` → `STARGlobalsSTAR` |
| `+` | `PLUS` | `+constant+` → `PLUSConstantPLUS` |
| `=` (mid/leading) | `EQ` | (rare) |
| `<` / `>` | `LT` / `GT` | (rare in identifiers) |
| `&` | `AMP` | `&rest` → `AMPRest` |
| `%` | `PCT` | (rare) |
| `/` | `SLASH` | `path/to` → `pathSLASHTo` |
| `->` | `To` | `string->json` → `stringToJson` |
| `<-` | `From` | `json<-string` → `jsonFromString` |

**Note:** `$` is NOT in the abbreviation table — it's a valid JS
identifier character (per ECMAScript spec) and passes through
unchanged. Reference DD-49 Rule 3 "Note on `$`" for full rationale.

### Macro overrides (DD-49 Rule 4)

Add a small subsection:

> **Macro-name overrides:** the threading macros `->` and `->>`
> (the language-primitive forms, not embedded in longer identifiers)
> compile to `threadFirst` and `threadLast` respectively. These are
> language-design names rather than mechanical-rule outputs.

### Cross-reference

Add a "See DD-49 for full rationale" link at the end of the section.

### MUST verify

```sh
grep -cE "QMARK|BANG|STAR|threadFirst|threadLast" assets/ai/SKILL.md
```

Expect at least 5 matches (one per major mapping concept).

---

## Deliverable 2 — Surface-forms guide updates (DD-50 fast-follow) (MUST)

**File:** `docs/guides/00-lykn-surface-forms.md`.

Three additions:

### 2a. New entry for the `do` surface form

`do` was introduced by DD-50.5 as a new surface form. It needs a
section in the surface-forms guide. Place near the other control-flow
or sequencing forms (look at existing organization to find the right
spot).

Required content:

```markdown
### do — sequence of expressions, position-aware

`(do expr1 expr2 ... final)` evaluates each expression in order and
yields the value of the final expression.

**Position-aware:**
- **Statement position:** emits a block. The final expression's value
  is discarded.
- **Expression position:** IIFE-wrapped, with the final expression
  returned.

```lykn
;; Statement position — sequence with no value flow
(do
  (console:log "step 1")
  (console:log "step 2"))

;; Expression position — value of `(+ a b)` flows out
(bind result
  (do
    (validate! a)
    (validate! b)
    (+ a b)))
```

**Not to be confused with `do-while`** — that's a separate kernel
loop form (see "Control flow" section).

See DD-50.5 for full position-aware emission rules.
```

### 2b. Note on position-aware `if` (DD-50 Rule 1)

Find the existing `if` entry and add a note about its position-aware
behavior:

```markdown
**Position-aware compilation (DD-50):** `if` in expression position
compiles to a ternary `cond ? then : else` when both branches are
pure expressions, or an IIFE when a branch is a statement form
(`throw`, `return`, etc.). `if` in statement position emits a
standard `if`-statement. A no-else `if` in expression position is
a compile error — use `?` explicitly or restructure.
```

### 2c. Style guidance (DD-50 Rule 5)

Add to the `if` and `?` entries, or in a "Style" subsection if one
exists:

```markdown
**Style:** Prefer `?` for expression position; prefer `if` for
statement position. The compiler treats them as functionally
equivalent in expression position, but explicit forms communicate
intent at the source level.

For LLM-generated code, treat this preference as a hard rule
(always use `?` in expression position, always use `if` in
statement position). LLMs flatten soft style preferences toward
uniform compliance, so explicit phrasing makes the convention
reliable in generated output.
```

### MUST verify

```sh
grep -nE "^### do\b|^## do\b" docs/guides/00-lykn-surface-forms.md
grep -nE "Position-aware compilation \(DD-50\)" docs/guides/00-lykn-surface-forms.md
grep -nE "Prefer.*for expression position" docs/guides/00-lykn-surface-forms.md
```

All three greps MUST return at least one match each.

---

## Deliverable 3 — SKILL.md style guidance (DD-50 Rule 5 + LLM-as-hard-rule note) (MUST)

**File:** `assets/ai/SKILL.md`.

Add the same Rule 5 style guidance from Deliverable 2c to SKILL.md.
Place in the existing anti-patterns or style section (find the
section that addresses style conventions; if no obvious section,
place near the naming-conventions table from Deliverable 1).

Required content (one-paragraph addition):

```markdown
**`?` vs `if` (DD-50 Rule 5):** prefer `?` for expression position;
prefer `if` for statement position. The compiler treats them as
functionally equivalent in expression position; the explicit form
communicates intent at source level. For LLM-generated code, treat
this as a hard rule (always use `?` in expression position, always
use `if` in statement position).
```

### MUST verify

```sh
grep -nE "DD-50 Rule 5" assets/ai/SKILL.md
```

Expect at least 1 match.

---

## Deliverable 4 — M2 "Other drift" leftover verification (MUST)

The M2 guide-drift inventory at `workbench/M2-guide-drift-inventory.md`
"Other drift" section lists four items:

1. `deno add` adjudication — **already resolved** via DD-51 and
   landed in the DD-51 implementation pass. **Verify** by greping
   `docs/guides/14-no-node-boundary.md` for any remaining positive
   `deno add` recommendations. Expect zero (only counter-cue / MUST-
   AVOID references should remain).

2. `deno test` / `deno run` drift in `15-lykn-cli.md` — addressed by
   Session B's Deliverable 2. **Verify** by greping `15-lykn-cli.md`
   for positive-instruction `deno test` / `deno run --` references.
   Expect zero outside counter-cue contexts.

3. `13-biome/` stale-but-cross-referenced — addressed by Session A's
   Deliverable 2 (directory deleted + cross-refs removed). **Verify**
   by `test ! -d docs/guides/13-biome` and `grep -rE "13-biome" docs/
   assets/` returning zero matches.

4. `deno.json` `exports` pointing to `./dist/mod.js` in
   `12-04-publishing.md` ID-03 — was flagged for verification at M2
   draft time. **Read the current state** of `12-04-publishing.md`
   ID-03 against the actual `lykn build --dist` artifact shape
   (consult `15-lykn-cli.md` for the canonical artifact-staging
   description). If drift remains, surface it as a finding for the
   build-dir thread (M11) to handle alongside its work, since M11's
   build-dir reorg will likely reshape the exports paths anyway.

### MUST verify

For each of the 4 items, run the verification and document the
result. If all 4 are resolved, the M2 inventory is closed. If item
4 surfaces ongoing drift, document for hand-off to M11 work.

---

## Deliverable 5 — Update guide-drift-cleanup-plan status tracker (MUST)

**File:** `docs/dev/0017-guide-drift-cleanup-plan.md`.

The status tracker section near the bottom of the plan has
checkboxes for each step. After Sessions A, B, and C all land,
Steps 1-8 should all be checked.

This session is the last of the three; mark Steps 5, 6, 7, 8 as
complete. (Steps 1-4 were marked by Sessions A and B's CC runs.)

If Sessions A and B didn't update the tracker, mark all 8 steps
checked once this session completes.

### MUST verify

```sh
grep -cE "^- \[x\]" docs/dev/0017-guide-drift-cleanup-plan.md
```

Expect at least 8 (one per "do now" step). Per-thread items further
down the plan remain unchecked (they wait on other threads).

---

## Verification checklist (all MUST be checked before reporting complete)

- [ ] **D1 verification:** SKILL.md naming-conventions section has
      predicate-prefix list, abbreviation table, macro overrides,
      and DD-49 reference. `grep -cE "QMARK|BANG|STAR|threadFirst|threadLast"
      assets/ai/SKILL.md` returns ≥5.
- [ ] **D2 verification:** `00-lykn-surface-forms.md` has `do` form
      entry, position-aware `if` note, and style guidance. All three
      greps from D2's "MUST verify" return matches.
- [ ] **D3 verification:** SKILL.md has DD-50 Rule 5 style guidance.
      `grep -nE "DD-50 Rule 5" assets/ai/SKILL.md` returns ≥1.
- [ ] **D4 verification:** all 4 M2 "Other drift" items verified —
      3 confirmed resolved, item 4 either resolved or flagged for M11.
- [ ] **D5 verification:** `docs/dev/0017-guide-drift-cleanup-plan.md`
      has ≥8 checked items in the status tracker.
- [ ] `make lint` clean.
- [ ] `git status -s` shows only `docs/`, `assets/ai/`, and the plan
      file changes. No `crates/` or `packages/` changes.
- [ ] `git diff --stat` confirms scope: ~4 files modified.
- [ ] Single coherent commit chain naming the deliverables.

---

## Reporting (when complete)

Post a 5-row deliverable × evidence table:

| # | Deliverable | Result |
|---|---|---|
| 1 | SKILL.md naming conventions (DD-49) | Added predicate-prefix list + abbreviation table + macro overrides |
| 2 | Surface-forms guide (DD-50) | Added `do` entry + position-aware `if` note + style guidance |
| 3 | SKILL.md style guidance (DD-50 Rule 5) | One-paragraph addition |
| 4 | M2 "Other drift" verification | Items 1-3 resolved; item 4 status: <as found> |
| 5 | Plan status tracker | 8 do-now steps marked checked |

Include the commit SHA(s).

If item 4 of D4 surfaces new drift, file a finding in the report
flagged for hand-off to the build-dir-reorg thread (M11).

---

## What this session does NOT cover

- **Session A** (Biome sweep + `13-biome/` decommission) — already
  ran (or runs separately).
- **Session B** (raw command reconciliations) — already ran (or
  runs separately).
- **Per-thread guide updates** — wait on the four Phase 2
  conversation threads closing.
- **Source code changes** — out of scope.

---

## Methodology notes

- Per CLAUDE.md "Lykn CLI safety gates": no safety-bypass flags
  needed.
- Per LEDGER_DISCIPLINE: this session is small enough that no
  closing report is required — a thorough commit message suffices.
  (The plan's status tracker update in D5 is the documentation.)
- Per SUBAGENT-DELEGATION-POLICY: D1, D2, D3, D5 are mechanical
  (find/replace + tracker checkmarks) and subagent-delegatable. D4
  is a verification pass that's also mechanical (just running greps
  and documenting results).

## Anticipated objections

- **"The DD-49 abbreviation table is repeating the DD; just link
  instead?"** No. SKILL.md is the AI-facing skill doc — load-bearing
  for CC's decision-making. Inlining the table (with a reference
  to DD-49 for rationale) means CC reading SKILL.md gets the rules
  immediately without a hop to DD-49.
- **"D5's tracker update feels like bookkeeping busywork."** It is.
  It's also load-bearing for the project's milestone-discipline
  pattern. The status tracker shows what's done and what's
  outstanding; future readers (including future CDC and CC sessions)
  read it as ground truth.
- **"Where do I put the new `do` entry in the surface-forms guide?"**
  Look at existing organization. Probably near `block`, `if`, or
  the sequencing forms. If unclear, place near `block`. The exact
  location matters less than the entry's content being correct.
- **"What if the existing surface-forms guide doesn't have a
  'Style' subsection?"** Add the Rule 5 style note inline with the
  `if` and `?` entries — short note at the end of each. No need to
  create a new subsection just for one rule.
