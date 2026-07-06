# CC Prompt — arc05 / slice01 · lint-infra

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-06
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Begin **arc05 — the linter**, lykn's oldest public promise (the
`cmd_lint` stub cites issue #1). This slice builds the machinery end-to-end
with 3 pilot rules, and compiler-verifies the whole DD-59 rule inventory so
slice02 builds on ground truth. Architecture is settled (DD-59 draft,
operator-confirmed 2026-07-06): Rust, pre-expansion SExpr, hardcoded
dispatch, text+JSON, error/warn, read-only, exit 0/1/2.

## 0. Read first

- `…/slice01-lint-infra/ledger.md` (6 rows) and `slice-doc.md`.
- `design/dd-59-lykn-source-linter-DRAFT.md` — the decisions + full rule
  inventory with tiers.
- The pattern to follow: `cmd_check` / `compile::check_strict`
  (`compile.rs`) — but lint stops at **read** (pre-expansion; lint judges
  what the user wrote). Reader spans + the `Diagnostic` type are your
  vocabulary.
- `docs/guides/09-anti-patterns.md` — the IDs behind each rule (don't
  relabel the guide; that's slice03).

## 1. The work (MUST), in order

1. **F-1 — compiler-verify the inventory FIRST.** For each DD-59 candidate
   (15 tier-1, 2 tier-2, 2 conventions), write its bad-example as a `.lykn`
   snippet and compile it with the current `./bin/lykn`. Classify:
   **already-errors** (the compiler owns it — out of the lint corpus),
   **compiles-and-lintable** (in), **unclear/unrepresentable** (flagged
   with the transcript). This is the arc10 lesson-#4 discipline applied
   *before* anyone scopes against an unverified list — the resulting table
   is slice02's authoritative contract. Watch ID-44/45/46 (post-DD-49/50
   they may already error) and note ID-03's false-positive concern (flag
   it; severity gets decided in slice02 against measured data).
2. **F-2 — the machinery.** Spanned SExpr walk (top-level + nested, with a
   lightweight **parent-context stack** — the conventions rules and
   for-in-on-arrays will want ancestry); rule trait + hardcoded
   match-dispatch registry (trait must allow stateful rules — slice03's
   shadowing needs scope); severities error/warn; diagnostics through the
   existing `Diagnostic` rendering so `lykn lint` output reads like
   `lykn check`'s.
3. **F-3 — the CLI.** Replace the stub (`main.rs:821–829`): `lykn lint
   <paths…>` accepting files and dirs (`.lykn` discovery; **`.lyk`
   exempt** — kernel idiom is its own thing; record the default in your
   report); exit **0** clean / **1** findings / **2** usage-or-IO;
   `--format=json` with a stable documented shape (rule, severity, message,
   file, span, suggestion). The exit codes and JSON keys are API.
4. **F-4 — pilots, TDD'd**: `no-require` (**error** — `(require "fs")`
   compiles to un-runnable ESM; the suggestion points at `import`),
   `sort-without-comparator` (warn), `parseint-radix` (warn). Per-rule
   fixtures both directions: bad → flagged at the right span with a
   suggestion; good → silent.
5. **F-5 — snapshots**: text + JSON under `insta`; review each, never
   auto-accept.

## 2. Verify (rebuild-first, all green)

`make check` ✓ (the bar; ~1m04s post-arc12) — suites 1365/0 · 673/0
unchanged. Pilot fixtures green both directions; exit-code demo (0/1/2);
JSON parses; the issue-#1 stub text gone (grep). **Smoke dogfood** (F-6):
`lykn lint test/ examples/` runs without crashing — record findings for
slice02's triage; do NOT fix them here.

## 3. Discipline

- **F-1 before F-2** in reporting order — even if you build in parallel,
  the table is a first-class deliverable; if pilot work runs long, the
  table still ships complete.
- **Surface, don't decide silently:** walk-context design, the `.lyk`
  exemption, rule-ID naming convention (recommend kebab-case,
  deno-lint-style — it becomes API), and anything F-1 reclassifies.
- No `--fix`, no config files, no JS-side work, no guide relabeling, no
  `make lint` wiring — later slices own those.
- Use `./bin/lykn` in all transcripts (the PATH lesson).
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Source
  only.

## 4. Close

`closing-report.md`: per-row walk (6 rows, no silent drops) + the **F-1
verification table** + design-call rationales + smoke-dogfood findings + a
**bubble-up to arc05** (the authoritative slice02 corpus; anything the
walk/registry design revealed; candidate severities that moved). → hand
back for CDC `cdc-verification.md`. Then slice02 (shape corpus + dogfood),
slice03 (context rules + guide alignment), and the arc's P-11 demo.
