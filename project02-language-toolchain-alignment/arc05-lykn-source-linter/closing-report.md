# arc05 · lykn-source-linter — Closing Report

**By:** CDC (Cowork) · **Date:** 2026-07-21 · **Branch:** `release/0.6.x`
**Status: CLOSED — gate GO 2026-07-21 (operator).** All four slices CDC-closed; the arc ledger (A-1…A-7) walks
clean; the P-11 composition demo is reproduced-at-arc-scale via
`p11_lint_corpus` in `make check` (CC-attested, host reconcile).

## 1. The capability, restated — and the verdict

From `project-plan.md` / `arc-plan.md`: *"`lykn lint` lints **Lykn source**
(`.lykn`) for anti-patterns, idiom, and style — not compiled JS (that was
`deno lint`, removed from the user surface per philosophy #2 Option A) and not
syntax errors (`lykn check` covers those). The compiler owns the closed
declaration-form namespace; the linter owns idiom/style."*

**Verdict: delivered.** `lykn lint` exists as a Rust CLI over the pre-expansion
reader SExpr, with **16 rules** (13 shape + 2 test-conventions + the ID-12
shadowing rule), **resolution-aware** (a lexically-bound head is a call, not a
false positive — the arc13 consequence), wired into `make check` green, with the
guides reclassified to accurate enforcement labels and a seeded/clean demo
corpus proving the whole rule set. It replaces the old compiled-JS `deno lint`
surface. The one v1 enhancement not shipped — inline comment-directive
suppression — is **disclosed-deferred to arc14 · comment-retention** (DD-62), not
dropped.

## 2. The slice walk (4 slices — matches the arc-plan breakdown)

| Slice | Outcome |
|-------|---------|
| 01 · lint-infra | **Delivered** (`1989138`) — machinery (rule trait, hardcoded registry, spanned pre-expansion walk, diagnostics, CLI replacing the issue-#1 stub, insta), 3 pilots, and the F-1 compiler-verification pass that caught ID-39 (compiler-owned), ID-42 (stale claim), ID-44 (compiler bug). |
| 02 · shape-rule-corpus | **Delivered** — 12 verified rules → 15 live; ID-44 fixed both backends; ID-03 severity-by-measurement; honest dogfood. The ID-42 recon **self-stopped and exposed the expander divergence** → arc13 (the whole detour). |
| 03 · resolution-consumer + context rules | **Delivered** (`ea429e2`, CDC-verified) — the linter consumes resolution (`resolve()` + the `as_form_head` funnel gates every head rule on bound names); the ID-12 shadowing rule rides `resolver::shadowing_sites` (one decider, many consumers — grep-clean, no scope logic in `lint/`); the ID-42 re-answer = no rule (closed arc13 A-6); dogfood clean. |
| 04 · integration + guide alignment | **Delivered** (`2feb5fd`, CDC-verified) — `lykn lint` in `make check` green (path-scoped); guide-09 reclassified (46 entries, accurate labels; ID-42 body corrected); guide-15 + SKILL; the P-11 seeded/clean corpus. |

Four slices in the breakdown; four walked. No arc-scale silent drop. (The arc ran
2 planned → 4 delivered: slice02's self-stop spawned arc13 and paused arc05; the
resume split slice03 1→2. Every change is in `arc-plan.md`'s Version History
v1.0→v1.8.)

## 3. The composition check — the arc ledger walked

| Row | Status | Evidence |
|-----|--------|----------|
| A-1 (slice01 closed) | done | slice01 cdc-verification (attested) |
| A-2 (slice02 closed) | done | slice02 cdc-verification (attested) |
| A-3 (slice03 closed) | done | slice03 cdc-verification; `ea429e2` (reproduced-by-code) |
| **A-4 (P-11 demo — every rule fires seeded, silent clean)** | **done — reproduced at arc scale** | `p11_lint_corpus` (seeded → 16 rules, exit 1; clean → exit 0) in `make check`; host command in §5. CC-attested; reconcile on host. |
| A-5 (dogfooded) | done | slice03: 118 `.lykn` files, 2 benign fixtures triaged, 0 shadowing FPs |
| **A-6 (guide-09 aligned — every entry labelled; doctests green)** | **done** | 46 entries labelled (7 compiler-enforced / 14 linted / 25 documented-only); all 12 formerly-ELIMINATED reclassified; `make test-docs` 475/0 |
| A-7 (slice04 closed) | done | slice04 cdc-verification; `2feb5fd` |

**Composition verdict: the four slices recompose into the capability.** The
class-(b) composition row (A-4, the end-to-end `lykn lint` demo) is *reproduced*
at arc scale by the `p11_lint_corpus` integration test (not inherited from a
slice attestation) — pending the operator host re-run in §5.

## 4. The accumulated change log (drift made visible)

`arc-plan.md` v1.0 → v1.8. The big movements: the arc went **ACTIVE** (v1.2,
DD-59 drafted), **PAUSED** on the expander divergence that became arc13 (v1.4),
**RESUMED** post-gate with slice03 scoped as a **1→2 split** (v1.6), slice03
**CLOSED** with findings routed to slice04 (v1.7), and slice04 **SCOPED with
suppression deferred to arc14** (v1.8). Two capabilities were spun out as their
own arcs rather than forced into a linter slice: **arc13 · expander-coherence**
(the shadowing divergence) and **arc14 · comment-retention** (the suppression
substrate) — both the arc13 pattern, applied.

## 5. The operator reconcile — host runbook (formal close)

Lighter than a semantic-change gate (arc05 is a dev-side linter, no runtime
behaviour change): from a clean tree at `2feb5fd` or later, rebuild first, then:

1. **Ancestry:** `git merge-base --is-ancestor 2feb5fd release/0.6.x` (and
   `ea429e2` for slice03).
2. **`./bin/lykn build`** (trap #4), then **`make check`** — expect green incl.
   the new `lykn lint` step and `p11_lint_corpus`; `make test-docs` 475/0.
3. **P-11 demo (A-4 reproduction):**
   `./bin/lykn lint crates/lykn-cli/tests/fixtures/p11/seeded_test.lykn` → **exit
   1**, all 16 rule tags; `.../clean.lykn` → **exit 0**.
4. On GO: flip arc05 **Closed** in project-plan/README/status; reconcile
   P-5/P-11 and the attested rows `attested → reconciled`; record the reconcile
   here.

**Reconcile record: GO — 2026-07-21, operator (Duncan).** `make check` green; `./bin/lykn lint …/p11/seeded_test.lykn` → **16 findings** (4 error / 12 warning — all 16 rules fired: no-require, no-eval, no-new-wrappers, global-isnan, no-arguments, no-iife, no-delete-on-array, no-json-deep-copy, prefer-surface-operators, or-for-defaults, for-in-on-arrays, parseint-radix, sort-without-comparator, shadowing, no-relative-source-imports, no-dirname-fixtures), exit 1; `…/clean.lykn` → 0 findings, exit 0. **A-4 / P-11 reproduced at project scale and reconciled; the attested slice rows reconcile via `make check` green. ARC05 IS CLOSED.**

## 6. Bubble-up to the project

1. **Did arc05 deliver its capability as `project-plan.md` defines it (P-5,
   P-11)?** **Yes.** "`lykn lint` lints Lykn source (anti-patterns, idiom,
   style), replacing the compiled-JS-lint surface" — delivered, resolution-aware,
   in `make check`, guides aligned. **P-5** (arc05 closed+composed) and **P-11**
   (`lykn lint` lints Lykn source, not compiled JS — the seeded-fixture demo)
   both met, pending §5's host reconcile.
2. **What arc05 revealed the project plan didn't anticipate:**
   (a) **arc13 · expander-coherence** — the whole expander-divergence arc was
   surfaced by arc05/slice02's ID-42 recon (already closed);
   (b) **arc14 · comment-retention (DD-62)** — the suppression mechanism needs
   reader comment-retention, which no backend has; spun out as its own arc, the
   operator's 3-step comment directive its charter (release boundary 0.6.0-vs-
   0.7.0 = operator, CDC leans 0.7.0);
   (c) **arc07 (docs) gains a drift specimen** — guide-15's `lykn lint` entry
   documented the *old* `deno lint` wrapper under the same command name (a
   meaning-changed-under-a-stable-name drift a doctest can't see); CC fixed the
   entry, the *class* is for arc07's audit;
   (d) **a standing coupling caution** — the lint `is_test_file` predicate and
   `lykn test`'s discovery predicate are identical `*_test.lykn` strings with
   different intents (candidate for the toolchain-hardening backlog);
   (e) **an orphaned `LintContext` ancestry API** (slice01 forward-API the
   shadowing rule didn't end up needing) — a delete-or-keep cleanup.
3. **Silent-drop diff at arc scale:** none. Inline suppression is
   deferred-with-rationale to arc14, not dropped; everything the roadmap
   expected of arc05 landed.

**Project-plan changes:** flip P-5/P-11 and the arc05 roadmap row to Closed on
the §5 reconcile; arc14 already seeded in the roadmap. Remaining 0.6.0 sequence:
**arc06 → arc07 → arc09.** Version History entry records this bubble-up.

## What Worked / What Recurred (cross-slice trending)

- **The self-stop → own-arc pattern, twice.** slice02's ID-42 recon self-stopped
  into arc13; slice04's suppression need was spun into arc14. Each time, a lint
  question that *looked* like a rule was the surface of a deeper capability — and
  the discipline made it a tracked arc instead of a forced, half-built slice.
- **Grounding beat guessing at every seam.** F-1's compiler-verification pass
  (slice01), the route-(a)-insufficient finding (slice03), and the guide-09
  labels-that-are-true audit (slice04) each caught a plausible-but-wrong path
  before it shipped.
- **Recurred (now countered):** stale docs under stable names (guide-15) and
  predicate coupling (`_test.lykn`) — both drift classes a green test can't see;
  both routed to homes (arc07 / the hardening backlog) rather than left latent.
