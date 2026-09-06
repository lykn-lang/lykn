# Slice 01: lint-infra

> Build `lykn lint`'s machinery end-to-end — spanned SExpr walk, rule
> registry, diagnostics, CLI (replacing the issue-#1 stub), fixtures +
> snapshots — proven by **3 pilot rules**, plus the **rule-inventory
> compiler-verification pass** that gives slice02 an authoritative corpus.
> Architecture per **DD-59 draft** (operator-confirmed 2026-07-06).

## Goal

`lykn lint <paths>` walks `.lykn` sources (pre-expansion reader SExpr, with
spans), dispatches hardcoded rules, and reports check-style diagnostics
(error/warn) in text or `--format=json`; exit 0 clean / 1 findings / 2
usage-or-IO error. Three pilot rules ship working: **no-require** (error —
compiles to invalid ESM), **sort-without-comparator** (warn),
**parseint-radix** (warn). And every DD-59 rule candidate is verified
against the actual compiler before slice02 builds on it.

## Current state (grounded)

- `cmd_lint(_paths)` (`main.rs:821–829`) is a stub: prints "not yet
  implemented … see issue #1", exits 1. This slice replaces it.
- The check-command pattern to follow: `cmd_check` → `compile::check_strict`
  (read → expand → classify). Lint sits **earlier**: read only — lint
  judges what the user *wrote*.
- Reader (`lykn-lang/reader`) produces SExpr with source spans; the
  `Diagnostic` type (message/severity/span/suggestion) is the reporting
  vocabulary the CLI already renders (see the DD-58 strict diagnostics).
- `insta` snapshot harness exists (`crates/lykn-cli/src/snapshots/`); never
  auto-accept.
- The analysis layer (`analysis/scope.rs` etc.) is NOT consumed this slice
  (slice03's shadowing rule will reuse it) — but don't preclude it: the
  rule trait should not assume statelessness.

## Scope (in)

1. **F-1 — rule-inventory compiler-verification pass** (the arc10 lesson-#4
   discipline, proactive): for every DD-59 candidate, compile its
   bad-example against the current compiler. Classify: **already-errors**
   (out — compiler owns it), **compiles-and-lintable** (in), **shape
   unclear/unrepresentable** (flagged). Produces the authoritative slice02
   table. Watch especially ID-44/45/46 (may be compile errors or
   unparseable post-DD-49/50) and ID-38's operator set (legal passthrough
   — confirmed lintable).
2. **F-2 — infrastructure**: spanned walk over top-level + nested forms;
   rule trait + match-dispatch registry; severities error/warn;
   diagnostics through the existing rendering.
3. **F-3 — CLI**: replace the stub; `lykn lint <paths…>` (files or dirs,
   `.lykn` discovery; **`.lyk` kernel files exempt** — kernel style is its
   own idiom; surfaced as a default, not silently assumed); exit 0/1/2;
   `--format=json` (stable shape: rule, severity, message, file, span,
   suggestion).
4. **F-4 — pilots**: the 3 rules TDD'd with per-rule fixtures (bad →
   flagged at the right span with a suggestion; good → silent).
5. **F-5 — snapshots**: text + JSON output under `insta`, reviewed.

## Scope (out)

- The rest of the rule corpus (slice02) and context rules (slice03).
- `--fix`, config files, `make lint` wiring (slice03 decision), JS-side
  anything (DD-59 Q1: no dual-backend obligation for lint).
- Guide-09 relabeling (slice03).

## Verification approach

Rebuild-first; `make check` green (suites 1365/0 · 673/0 unchanged); the
pilot fixtures + snapshots; F-1's verification table with compile
transcripts. Dogfood *smoke* (not the full A-5 pass): `lykn lint test/
examples/` runs without crashing; findings, if any, recorded for slice02's
triage.

## Exit criteria

Stub gone; 3 pilots green end-to-end (both output formats, both exit
codes); F-1 table authoritative; snapshots reviewed; suites unchanged.
Bubble-up: the verified slice02 corpus + anything the walk/registry design
revealed (e.g. rules needing parent-context that the walk should expose).

## Design sub-questions (surface, don't decide silently)

1. **Walk context** — do rules see just the node, or node + ancestry? (The
   conventions rules and for-in-on-arrays want context; recommend passing a
   lightweight parent stack from the start.)
2. **`.lyk` exemption** — confirmed default, or should kernel files get a
   kernel-idiom rule set later? (Record; don't build.)
3. **Rule naming** — kebab-case rule IDs in diagnostics (deno-lint style,
   e.g. `no-require`) — confirm the convention; it becomes API.
