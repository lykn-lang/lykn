# CC Prompt — arc12 / slice01 · run-once-topology

**From:** CDC (Cowork) · **To:** CC (Claude Code, host) · **Date:** 2026-07-05
**Branch:** `release/0.6.x` (fresh branch or worktree — Duncan's call; git host-side).
**Re:** Implement your own A–D from the redundancy report — **every test
executes exactly once per `make check`; `make test-docs` tests docs.** You
asked "want me to implement A (and B/C/D)?" — yes, all four, under this
ledger. This lands before the arc10/arc11 gate re-run so the whole
verification stack gets cheap.

## 0. Read first

- `…/slice01-run-once-topology/ledger.md` (6 rows) and `slice-doc.md`.
- Your own report — it is the F-1 baseline; capture it (plus a fresh
  timing) in the closing report as the before-state.

## 1. The work (MUST)

1. **F-2 (A) — the CLI fix, TDD'd.** With `--docs` and no explicit test
   patterns, `lykn test` runs **docs only** (no corpus discovery/compile/
   run). With explicit patterns *and* `--docs`, keep today's combined
   behavior — the default changes, the capability doesn't. Pin both in
   tests. This alone removes 4 corpus runs from `make test-docs`.
2. **F-3 (B) — one Deno startup for the doc phase.** `make test-docs` runs
   guides + README + both example trees under a single invocation; keep the
   granular `test-docs-*` targets for focused dev runs. Mechanism (a
   multi-path `--docs`, or one invocation over a combined generated
   out-dir) is your call — state the rationale.
3. **F-4 (C) — honest targets.** Remove `test-lykn`'s subset re-run from
   the `test` chain; delete or repurpose the target (surface the choice —
   e.g. keep as a documented convenience alias for surface-focused runs).
   `test-js`'s name lies (it runs the full 1365 incl. the corpus) — rename
   or re-document so names match behavior; **surface, don't decide
   silently** on the naming.
4. **F-5 (D) — one build pass.** Rationalize `common-checks`' debug
   `build` vs `fresh-artifacts`' release build so `make check` builds once.
   Minor — don't over-engineer; incremental builds already make this cheap
   on warm trees.
5. **F-6 — docs + the habit fix.** Update AGENTS.md's verify commands,
   `test/CONVENTIONS.md`, and any "green bar" wording so the canonical
   operator verification is **`make check`** (with `make test-docs` as the
   doc-focused iteration tool, no longer needed alongside). The
   `make check && make test-docs` habit is redundancy #1 — kill it at the
   documentation source.

## 2. Verify (rebuild-first)

**The sentinel census is the proof** (your methodology, formalized): count
executions of `surface/bind_test` — `make check` → exactly **1**;
`make test-docs` → **0**; each doc suite exactly once. Plus: `lykn test`
1365/0; `deno test --config project.json -A test/` 673/0; doctest counts
identical before/after; clippy clean; `make check` green. **Record
before/after wall-clock** for `make check` and `make test-docs` — the win
is measured, not asserted (F-1/F-6).

## 3. Discipline

- No change to *what* any test verifies — this is topology only. Counts
  must hold exactly.
- **Out of scope, file in the bubble-up:** batching the 97 per-file
  `deno eval` compile spawns into one process (a real lever, but a
  compiler-CLI change — Post-0.6.0 candidate); CI workflow updates (arc09).
- **Surface, don't decide silently:** the B mechanism; the C target
  naming/fate; anything the Makefile rework reveals.
- Leave `docs/design-v0.6.0/**` to CDC except your closing report. Source
  only.

## 4. Close

`closing-report.md`: per-row walk (6 rows, no silent drops) + the
before/after timing table + the census transcript + design-call rationales
+ **bubble-up to arc12** (anything the topology rework revealed; the
batch-compile candidate). → hand back for CDC `cdc-verification.md`. Then
the **combined gate session** (arc10 §5 + arc11 §5 + arc12 A-2/A-3) — now
cheap — closes all three arcs at once.
