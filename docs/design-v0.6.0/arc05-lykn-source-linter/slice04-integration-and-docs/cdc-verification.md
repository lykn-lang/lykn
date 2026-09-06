# arc05 · slice04 — CDC Verification (Integration + guide alignment)

**By:** CDC (Cowork) · **Date:** 2026-07-21 · **Branch:** `release/0.6.x`
**Source under review:** `2feb5fd` (Makefile +10, SKILL +14, guide-09 +245/−87,
guide-15 +37, P-11 fixtures + `p11_lint_corpus.rs` +83).
**Verdict: CDC-closed.** All 8 rows verified — F-1/F-2/F-3/F-5/F-6/F-7
**reproduced by code + grep** (sandbox has no toolchain); F-4/F-8
CC-attested runtime, reconcile on the operator host. No silent drops, no
spec-softening; two disclosed scope-additions (both accuracy fixes within intent).

## Per-row verification

| Row | CDC finding | Strength |
|-----|-------------|----------|
| **F-1** make lint runs `lykn lint`, green; 2 findings path-scoped | **Confirmed by diff.** `Makefile` lint target: `find packages examples test -name '*.lykn' ! -path 'test/surface/kernel-in-surface_test.lykn' \| sort \| xargs ./bin/lykn lint`. **Path exclusion, one file**, with an explicit comment that this is *not* inline suppression (→ arc14). Clean; deterministic (`sort`). | reproduced-by-code |
| **F-2** guide-09 every entry labelled, no blanket ELIMINATED | **Confirmed by grep.** 46 `## ID-` entries ↔ 46 `**Status**` lines; tally 7 compiler-enforced (incl. the ID-38 split) / 14 linted / 25 documented-only. No standalone "ELIMINATED BY LANGUAGE DESIGN" survives. | reproduced-by-code |
| **F-3** labels accurate (the substantive row) | **Confirmed by cross-check.** All **14 Linted labels cite a real `registry()` rule** (grep intersection: 14/14 ∈ the 16-rule registry; the 2 uncited rules are the arc11 test-conventions rules, correctly not guide-09 entries). Compiler-enforced labels are internally consistent and nuanced — ID-38 dual-labelled "declaration forms · operators", reserved-word params cite "D2". The per-entry spot-compiles are CC-attested (host reconcile). **The audit thesis holds:** all 12 formerly-ELIMINATED reclassified (4 Linted / 3 Compiler-enforced / 5 Documented-only) — none kept a bare language-design elimination. | reproduced-by-code (labels) + attested (spot-compiles) |
| **F-4** `make test-docs` green | 475/0 — **CC-attested**; host reconcile. | attested-runtime |
| **F-5** guide-15 + SKILL document `lykn lint` | **Confirmed by diff.** guide-15 ID-04c is a `lykn lint` section (usage, 16-rule set, exit 0/1/2, `--format=json`, `.lyk` exempt) + a Quick-Reference row; SKILL carries a CLI line + a linter note pointing at guide-09's Linted labels. | reproduced-by-code |
| **F-6** P-11 seeded fires every rule, exit 1 | **Confirmed by diff.** `p11_lint_corpus::seeded_corpus_fires_every_rule_and_exits_nonzero` asserts exit≠0 **and** `[{rule}]` present for all **16** `EXPECTED_RULES` (= the full registry). Runtime pass CC-attested. | reproduced-by-code (test) + attested (pass) |
| **F-7** P-11 clean silent, exit 0 | **Confirmed by diff.** `clean_corpus_is_silent_and_exits_zero` asserts exit 0 and no rule tags. | reproduced-by-code + attested |
| **F-8** `make check` green; no half-built suppression; diff source+docs | **Partly confirmed.** Diff **is** source+docs (`git show --stat`: Makefile + 2 guides + SKILL + P-11; no `docs/design-v0.6.0/**`) — reproduced-by-code. Grep: **no comment-directive/suppression scaffolding**. `make check` green CC-attested; host reconcile. | reproduced (diff) + attested (make check) |

## Silent-drop / spec-softening / over-claim checks

- **Silent-drop:** 8/8, no drop. Suppression stayed out **disclosed** (→ arc14),
  not dropped. ✓
- **Two disclosed scope-additions, both within intent:** (a) **ID-42's body was
  corrected**, not just relabelled — the stale "form-named param throws"
  (false since arc13 D1) rewritten to the accurate D1-legal-shadow / D2-compile-
  error split. This is exactly F-3's "labels that are *true*" mandate reaching
  into the entry body; a genuine accuracy improvement, correctly flagged. (b)
  guide-15 ID-04c **rewritten** (it was stale — documented the *old* `deno lint`
  wrapper under the same command name) — within F-5's "document `lykn lint`"
  intent. Neither is scope-creep; both are the audit doing its job. ✓
- **Over-claim:** none. `make check`/`make test-docs`/spot-compiles correctly
  marked CC-attested. ✓
- **Partial-adoption:** the path-exclusion is a single Makefile rule, not a
  per-file scatter; grep confirms no stray suppression code. ✓

## Bubble-up check (verified, routed)

CC's three-question bubble-up is honest and complete. The findings, verified and
routed (into the arc05 closing-report + arc07 + arc14):

1. **guide-15 stale-tool-under-a-stable-name drift** — `lykn lint` meant a
   `deno lint` wrapper; the meaning changed, the guide didn't. CC fixed the
   entry; the *class* (a command's meaning changing under a stable name — a
   doctest can't catch it) is **routed to arc07's guide-drift audit**. A real
   drift-detection insight.
2. **The `_test.lykn` predicate collision** — the lint `is_test_file` predicate
   and `lykn test`'s `discover_lykn_test_files` key on the *same* `*_test.lykn`
   string with different intents; a `_test.lykn` seeded corpus under `test/`
   would be run (and fail) by `make test-suite`. Resolved by homing P-11 under
   `crates/lykn-cli/tests/fixtures/p11/` (outside both scans) while keeping the
   basename so the conventions rules fire. **Routed as a standing coupling
   caution** (arc05 closing-report + a candidate for the hardening backlog): if
   either predicate moves, this bites.
3. **Suppression deferral cost ~nothing** (one `find` exclusion) — validates the
   slice04 decision to defer to arc14; the kernel-interop fixture's 2 `===` are
   arc14's natural first customer.
4. **Orphaned `LintContext` ancestry API** — still `allow(dead_code)`, still a
   delete-or-keep decision. Routed to a future cleanup (not arc05-blocking).

## What Worked

- **The audit reached past the label into the body.** F-3's "labels that are
  true" mandate caught ID-42's stale *claim*, not just its stale status —
  grounding the reclassification in the actual compiler behaviour rather than
  the guide's own prose. This is the anti-drift discipline finding real drift.
- **Homing P-11 outside `test/` turned a latent collision into a design note.**
  The `_test.lykn` predicate coupling would have surfaced as a mysterious
  `make test-suite` failure; CC found it at scoping-of-the-fixture time and
  recorded the coupling instead of just working around it.
- **The deferral held.** Suppression-to-arc14 cost one Makefile line — evidence
  the arc13-pattern call (make the deeper capability its own arc, don't block
  the current close) was right again.

## Disposition

**slice04 CDC-closed** on code + grep, with F-4/F-8 pending the operator host
reconcile. arc05 arc-ledger **A-7 (slice04 closed) → done**, **A-4 (P-11 demo)
→ done** (reproduced at arc scale by `p11_lint_corpus` in `make check`,
CC-attested; host reconcile), **A-6 (guide-09 aligned) → done**. With A-1…A-7
now done, **arc05 composes** — see the arc05 `closing-report.md`.
