# CC Prompt — arc11 / slice02 · buried-intent-audit

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-05
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** arc11's **last slice**. Sweep the repo's buried-intent inventory —
the artifacts of the *delayed-deferred-buried-then-lost* failure mode you've
now hit four times this cycle (stranded branches; DD-58 half-wired;
`--out-dir` reserved-and-ignored; the April fossil) — and give **every hit a
written disposition: wired, retired, or tracked**. Land the trivial fixes
here; route the design questions. Then arc11 closes.

## 0. Read first

- `…/slice02-buried-intent-audit/ledger.md` (7 rows) and `slice-doc.md` —
  the **opening inventory is seeded there** (9 items + the benign-filter
  rule); your F-1 sweep reconciles against it.
- Your own slice01 closing-report bubble-up (items 6–9 came from it).
- arc10 arc-plan v1.5 (items 3–4: the two cosmetic defects routed there).

## 1. The work (MUST), in order — audit THEN fix

1. **F-1 — sweep + reconcile.** Re-run the marker greps (TODO / FIXME / XXX
   / "for now" / "temporar" / "transitional" / "reserved" / `hide = true` /
   `allow(dead_code)` / `unimplemented!`) over `crates/` + `packages/`,
   plus the CLI-surface sweep (underscore-silenced params, hidden clap
   flags, options threaded-and-dropped), plus a **bounded** doc-claims
   sample (philosophy.md commitment claims, README command examples,
   guide-16 fence docs — sample, not the arc07 audit). Reconcile against
   the slice-doc's 9-item seed: add what's new, drop nothing, and apply the
   benign-filter rule explicitly (*describes-now* = noise, documented;
   *should-someday* = inventory).
2. **F-2 — disposition table.** One row per item: **wired** (fixed here) /
   **retired** (stub/comment removed, with rationale) / **tracked** (a
   named home — row, DD, arc — plus a re-entry condition; bare "later" is
   invalid). Item 5 (`cmd_lint` stub) should come back "tracked — arc05 /
   P-11, pointer verified."
3. **F-3 — trivial fixes.** `kernel-mark.js:10` (the comment claims
   `kernelArray` was "removed as dead" — it lives at
   `surface-helpers.js:518`; fix the text); `expander.js`'s
   `macroEnv.has('bind')` guard (stale since arc04 — key on a `js:*`
   name); `icu.rs:696` fix-if-small-else-track; plus any new one-liners
   F-1 surfaces.
4. **F-4 — `SetSymbol`: assess and route, do NOT remove.** The
   `surface.rs:294` TODO's trigger (surface/kernel separation) fired at
   arc10's close. Census the usage (`set-symbol!` in repo code, tests,
   guides, examples), surface the design question (deprecate in 0.7.0?
   keep as surface?), propose a routing (DD note / project row), and
   replace the stale TODO text with one that names the tracked home.
   Operator decides on the routed item — not in this slice.
5. **F-5 — land the docs.** The location-independence conventions (bare
   import-map specifiers; `Deno.cwd()`-anchored fixtures; never
   `import.meta.dirname`) in the home you judge right (guide 16 vs a
   `test/CONVENTIONS.md` vs CLAUDE.md — say why); the canonical test
   command (`deno test --config project.json -A test/` supported; unscoped
   is not — double-runs, needs `-A`) where developers look. File the arc05
   lint-rule candidates in your bubble-up.
6. **F-6 — doctest-dir harmonization.** `target/test/doctest/` →
   `target/lykn/test/doctest/` with its own verify (`make test-docs`
   green, old path gone) — **or** a written no-op rationale if the move's
   risk exceeds its value. You filed this one yourself; your call, stated.

## 2. Verify (rebuild-first, all green)

`make check` ✓; **`make test-docs` 0 failed** (doc-touching slice);
`lykn test` ≥1365/0; `deno test --config project.json -A test/` ≥673/0;
clippy clean. **The A-4 demo (F-7): re-run the F-1 sweep at close and diff
against the disposition table — zero undispositioned hits.** That
transcript is arc11's composition evidence; make it clean and quotable.

## 3. Discipline

- **Audit before fix** — the table exists before the diffs.
- **F-4 is assess-and-route** — removing `set-symbol!` is a breaking
  surface change and an operator decision.
- **Surface, don't decide silently:** the conventions-doc home; the
  doctest-dir move-or-no-op; any inventory item whose disposition feels
  like a design call.
- Small slice — if the sweep balloons (it shouldn't; CDC sized it at ~10
  code hits), disposition-as-tracked is always available; don't let the
  audit become the fix-everything slice.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Source
  only.

## 4. Close

`closing-report.md`: per-row walk (7 rows, no silent drops) + the inventory
+ disposition tables + the sweep-rerun diff + a **bubble-up to arc11** that
answers: **is arc11 ready to close?** (A-1/A-2 done; A-3 three-moment demo,
A-4 sweep diff, A-5 unscoped-run — ready for arc-scale reproduction on
host). → hand back for CDC `cdc-verification.md`. Closing this slice closes
the arc's slice work; the arc closing-report + host composition run follow.
