# CC Prompt — arc05 / slice02 · shape-rule-corpus

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Complete the shape tier: the **12 remaining lint rules from your own
F-1 table**, the **two compiler fixes your F-1 catches earned** (operator
decisions 2026-07-06: ID-44 → fix the bug; ID-42 → "why don't we simply
disallow it?" → compile-time disallow, recon-gated), **ID-03's severity by
measurement**, and the **real dogfood pass**.

## 0. Read first

- `…/slice02-shape-rule-corpus/ledger.md` (6 rows) and `slice-doc.md` (the
  12-rule table with shapes/severities is the contract — sourced from your
  F-1 table, not DD-59's superseded list).
- Your slice01 closing report — especially the ID-42 transcript (the
  param-shadows-the-special-form behavior) and the ID-44 repro.
- `test/CONVENTIONS.md` — the rules the two conventions lints enforce.

## 1. The work (MUST)

1. **F-1 — the 12 rules.** Same discipline as the pilots: both-direction
   fixtures, head-atom spans, suggestions, kebab-case IDs. Conventions
   rules are **path-scoped to test files** (`*_test.lykn`/`*.test.lykn` —
   confirm the match set, surface if it's wrong). `for-in-on-arrays`:
   conservative — flag array literals and obvious array bindings only;
   prefer misses over false positives in v1.
2. **F-2 — measure ID-03 before assigning severity.** Run
   `or-for-defaults` over the whole repo corpus; table every hit with a
   true/false-positive judgment; propose warn/info/drop **from the data**.
   Surfaced, not decided — the operator confirms at close.
3. **F-3 — fix the ID-44 compiler bug.** `(for-of (const …) …)` → compile
   **error** with a diagnostic suggesting the bare binding. **First check
   the JS compiler on the same input** — DD-58's lesson is that enforcement
   is per-backend; if the JS side also emits garbage (or silently
   diverges), fix it there too or surface. Regression tests + a
   cross-compiler corpus row. Guide-09's "Throws" claim becomes true (the
   relabel itself is slice03's). **Self-stop if this exceeds a binding-
   validator guard** — an emitter rewrite means we re-slice.
4. **F-4 — ID-42 recon, then disallow (or fallback with data).** Recon:
   (a) confirm the shadowing semantics — your F-1 transcript shows `(fn)`
   in a body calling the *param*; which other special-form heads shadow
   like this? (b) propose the **reserved set** — the dangerous shadowers
   only; banning common nouns (`type`, `get`, …) would break reasonable
   code, so the set is where call-position *meaning changes*, not all
   heads; (c) blast-radius grep (repo + guides + examples); (d) both
   backends. **Small radius → compile error on both backends + tests.
   Large → STOP and report** — lint-warn is the measured fallback, and the
   operator re-decides. Either way the recon table ships.
5. **F-5 — dogfood for real.** Full corpus over all repo `.lykn` sources.
   This time rules will fire (`prefer-surface-operators`,
   `or-for-defaults` at minimum). Every finding: **fix it or acknowledge
   it** in a triage table with rationale. End state: exit 0, or exit 1
   with a fully-acknowledged table. Handle honestly — a triage entry
   "the rule is too noisy" is valid data (feeds F-2 and severity calls),
   not a failure.

## 2. Verify (rebuild-first, all green)

`make check` ✓; suites at baseline + new corpus row(s); 12 × both-direction
fixtures; snapshots extended and **reviewed, never auto-accepted**; the
ID-44 error demo on both backends; `./bin/lykn` in every transcript.

## 3. Discipline

- **Recon gates the compiler fixes** (F-3 JS-side check first; F-4 recon
  first). Both carry self-stop clauses — surface with data, don't grind.
- **Surface, don't decide silently:** the ID-42 reserved set, ID-03
  severity, conventions path-scope match set, for-in precision, anything
  a rule's real-world firing pattern teaches you.
- **Breaking-change notes** for arc09: ID-44 rejection (code that
  "compiled" before now errors — it was emitting garbage); ID-42 if
  implemented.
- No guide relabeling (slice03), no shadowing rule (slice03), no `make
  lint` wiring, no `--fix`, no config.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report; per the
  restored convention, **leave the closing report untracked** for the
  staging pass. Source only.

## 4. Close

`closing-report.md`: per-row walk (6 rows) + the ID-03 measurement table +
the ID-42 recon table + the dogfood triage table + design-call rationales
+ a **bubble-up to arc05** (corpus state for slice03; DD-59 addendum items
— corpus 19→final, the compiler-enforcement promotions; anything the
fixes revealed). → hand back for CDC `cdc-verification.md`. Then slice03
(shadowing + guide-09 enforcement labels + `make lint` decision + P-11
demo prep) closes the arc's slice work.
