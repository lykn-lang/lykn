# Slice 02: buried-intent-audit — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-05
**Verdict: accepted — slice02 closed; arc11 ready for its closing-report +
host composition run.** Every inventory item carries a written disposition;
the trivial fixes are landed and reproduced; `SetSymbol` is routed, not
removed; the docs are in sensible homes. **The A-4 sweep-diff is
CDC-reproduced** — I re-ran the sweep independently and every remaining hit
maps to a disposition-table row.

## Verification (git + code review + grep; runtime CC-attested)

Commit: **`4f2a628` confirmed on `release/0.6.x`**. Diff: 7 files, +77/−8 —
exactly the audit's shape (3 comment/guard fixes, 1 constant, 2 doc homes).

| Row | How CDC verified | Strength |
|-----|------------------|----------|
| F-1 sweep | Inventory reconciles: 9 seed items + 4 new, benign filter documented and extended (3 more describes-now items named). Zero `hide = true`/`allow(dead_code)`/`unimplemented!` — consistent with slice01 having retired the last hidden flag. | reproduced (grep) |
| F-2 dispositions | Table complete: 13 items (5 seed + 4 new + 4 inherited), each wired/retired/tracked with rationale + re-entry. No bare "later". #5 (`cmd_lint`) correctly tracked-not-fixed. | reproduced (read + cross-check) |
| F-3 fixes | **All reproduced by read**: `kernel-mark.js:10` now correctly lists `kernelArray` as living producer #4; `expander.js:1585–1586` guard keyed on `js:eq` with an arc11/slice02 rationale comment; `icu.rs:696` assessed-and-tracked (right call — not a one-liner). | **reproduced** (code) |
| F-4 SetSymbol | **Reproduced**: `surface.rs:294–299` replaced by the tracked-home comment ("Do NOT remove before the routed decision"); census credible (live surface form, no other surface spelling for computed-key assignment — a real design question, properly an operator call at 0.7.0 planning). Routed home instantiated this pass (project-plan, below). | reproduced (code) + routed |
| F-5 docs | **Reproduced**: `test/CONVENTIONS.md` (canonical command with the *why* of each part; location-independence MUSTs; naming split) — the home rationale (repo-suite vs user-docs) is right; `AGENTS.md` carries the caveat. Lint candidates named in the bubble-up → instantiated in arc05's plan this pass. | reproduced (read) |
| F-6 doctest dir | **Reproduced**: `doctest.rs:553` = `target/lykn/test/doctest`; comment at `:522` matches. Runtime (`make test-docs` green, old path absent) attested. | reproduced (code) + attested |
| F-7 green + A-4 | Suites attested (1365/0 · 673/0 · `make check` ✓ · test-docs 0). **A-4 sweep-diff independently reproduced**: my own re-run returns 8 hits — `icu.rs:696`(#2), `main.rs:809`(#5), `forms.rs:1676/1681`(N1), `forms.rs:2074`(N4), `parser.rs:310`(N2), `doctest.rs:1138/1139`(N3) — **all dispositioned, zero orphans**; the 3 wired items no longer appear. | **reproduced** (sweep) + attested (suites) |

Rows: 7/7 walked. Done: 7. Deferred: 0. No-op: 0. **No silent drops.**

## Tracked homes — instantiated (this pass, CDC)

Per CC's bubble-up, rows/entries created so "tracked" means *watched*:

- **project-plan §Post-0.6.0 tracked candidates** (new subsection, v1.17):
  `set-symbol!` deprecation decision (breaking; operator, at 0.7.0
  planning); `genfunc` multi-clause (N1, silent clause-drop); polish
  backlog — ICU Span attribution (#2), reader block-comment stub (N2),
  doctest nested-fence scanner (N3), nested-destructure completeness (N4).
- **arc05 arc-plan**: the two lint-rule candidates (reject relative source
  imports in `.lykn` test files; reject `import.meta.dirname` fixture
  anchoring) added to the linter's seed corpus with provenance.

## Bubble-up check

- Delivered its assigned arc piece: **yes** — A-4's claim ("inventory
  empty-or-tracked") is now evidenced by a reproducible diff, and A-5's
  hygiene items are all landed.
- Silent-drop diff: clean (the audit found *more* than specified — 4 new
  items — and dispositioned them rather than parking them).
- arc-plan change required: **yes** — A-2 → done; A-4 → met
  (CDC-reproduced at slice scale; arc-scale re-run at close); arc11 →
  CLOSING (v1.4, done this pass).

## Disposition

- **slice02 closed.** arc11's slice work is complete.
- **Next: the arc11 close** — CDC assembles `closing-report.md`; the
  composition rows (A-3 three-moment demo, A-4 sweep-diff, A-5
  unscoped-run) are **reproduced at arc scale on the host** and gated by
  the operator (same §B posture as arc10 — CDC assembled, so CDC cannot
  sign off alone).
