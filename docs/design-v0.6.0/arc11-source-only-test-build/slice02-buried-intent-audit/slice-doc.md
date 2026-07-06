# Slice 02: buried-intent-audit

> Sweep the repo's **buried-intent inventory** — every artifact of the
> *delayed-deferred-buried-then-lost* failure mode (the operator-named
> pre-framework plague) — and give **every hit a written disposition:
> wired, retired, or tracked**. Closes arc11 (A-4) and clears the small-fix
> backlog that accumulated across arc10/arc11. Audit-then-fix: diagnosis
> first, then the trivial fixes in the same slice, non-trivial items routed
> to tracked rows.

## Goal

After this slice, re-running the marker sweep returns **only hits with a
written disposition** — nothing sits silently deferred. The one-line fixes
land here; design-question items (e.g. `SetSymbol` deprecation) get a
tracked home, not a quiet TODO; the conventions/docs notes from slice01's
bubble-up land in their proper places.

## Opening inventory (CDC sweep, 2026-07-05 — post-slice01; F-1 re-runs and
reconciles this)

**Code markers (real):**

| # | Item | Provisional disposition (CC verifies/decides) |
|---|------|-----------------------------------------------|
| 1 | `surface.rs:294` — `TODO: deprecate [SetSymbol] when surface/kernel syntaxes are separated; remove the release after that` — **the trigger fired at arc10's close** | **Assess + surface (F-4).** Removing `set-symbol!` is a language-surface change — likely a tracked row / DD note targeting 0.7.0, not a this-slice removal. Don't decide silently |
| 2 | `icu.rs:696` — `TODO: translate e.position into a Span offset for finer attribution` | Fix if small; else tracked row with re-entry (F-3) |
| 3 | `kernel-mark.js:10` — comment says `kernelArray` was "removed as dead in this slice" — **false** (kept; call site `surface-helpers.js:518`); stale text from arc10/slice03 | One-line comment fix (F-3) |
| 4 | `expander.js` — `macroEnv.has('bind')` idempotence guard is stale (only the 5 `js:*` macros register since arc04; the guard always fails, re-running registration harmlessly) | One-line fix — key on a `js:*` name (F-3) |
| 5 | `main.rs:805` — `cmd_lint(_paths)` stub | **Already tracked** (arc05, P-11) — disposition = pointer verified, no code change (F-2) |

**Benign filter (documented, not dispositioned):** `bridge.rs:14`,
`config.rs:511`, `doctest.rs:3/:522` — "temporary file" *descriptions* of
runtime behavior, not deferred work. The audit's false-positive rule:
markers describing *what the code does now* are noise; markers describing
*what the code should someday do* are inventory.

**Slice01 bubble-up items (inherited):**

| # | Item | Provisional disposition |
|---|------|------------------------|
| 6 | Reserved-plumbing sweep of `main.rs` (and the CLI arg surface generally): other `_`-prefixed ignored params, `hide = true` flags, dead `Option`s threaded-and-dropped | Part of F-1's sweep — enumerate; disposition each |
| 7 | Test-source **location-independence conventions note** (imports = bare import-map specifiers; fixture paths = `Deno.cwd()`-anchored, never `import.meta.dirname`) | Land in the right home (guide 16 §testing or a `test/CONVENTIONS.md`); file the **arc05 lint-rule candidates** in the bubble-up (F-5) |
| 8 | **Canonical test command** documented — `deno test --config project.json -A test/` is supported; unscoped `deno test` is not (double-runs the compiled corpus; needs `-A`) | Document where developers look (guide 16 and/or CLAUDE.md/README dev section) (F-5) |
| 9 | **Doctest-dir harmonization** — `target/test/doctest/` → `target/lykn/test/doctest/` (arc01-aligned); a one-line constant *plus* the discovery/cleanup around it — slice01 filed it rather than folding it in | Do it with its own verify (`make test-docs` green) or no-op with written rationale (F-6) |

**Doc-claims-vs-code spot-checks (bounded sample, F-1):** philosophy.md's
commitment claims (#1 now true — does the text still hedge?), README's
command examples, guide-16's fence documentation — the arc10 pattern
("ELIMINATED" claims that were aspirational) applied as a sample audit, not
an exhaustive doc pass (that's arc07).

## Scope (out)

- `set-symbol!`/`SetSymbol` **removal** (assess + route only — breaking
  surface change).
- The full guide-drift audit (arc07) and the linter itself (arc05) — this
  slice *files* lint candidates, it doesn't implement them.
- `workbench/` deletion (operator-owned, already tracked in the migration
  provenance notes).

## Verification approach

Rebuild-first; full green bar — this slice touches guides/docs, so
**`make test-docs` is mandatory**. The audit's own verify: **re-run the F-1
sweep at close and diff against the disposition table** — zero
undispositioned hits (this is arc11 A-4's evidence). One-line fixes carry
normal suite greens.

## Exit criteria

Disposition table complete (every inventory item wired/retired/tracked, no
"later" without re-entry); items 3–4 fixed; item 1 assessed + routed with
the design question surfaced; items 7–8 documented in their homes; item 9
done-or-rationaled; sweep-rerun diff clean; suites green at baseline
(1365/0 · 673/0 · `make check` ✓ · `make test-docs` 0 failed). arc11 A-4
closes on this slice's evidence.
