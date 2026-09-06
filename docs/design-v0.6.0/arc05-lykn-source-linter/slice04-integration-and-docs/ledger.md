# arc05 · slice04 — Ledger (Integration + guide alignment)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. Runtime rows
(`make lint`/`make check`/`make test-docs`/P-11) are CC-attested and reconciled
by an operator host re-run; doc/grep rows are reproduced-by-code.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| F-1 | `make lint` (and thus `make check`) runs `./bin/lykn lint` over the repo's `.lykn` source and is **green**; the 2 kernel-interop fixture findings are **path-scoped** (not inline-suppressed), mechanism recorded. | `make lint` exit 0; read the Makefile target + the scoping mechanism | serious | arc-plan / slice03 bubble-up | **done** | `2feb5fd` Makefile `lint` target: `find … ! -path 'test/surface/kernel-in-surface_test.lykn' \| xargs ./bin/lykn lint` → 117 files, 0 findings, exit 0. Mechanism = find path-exclusion (closing-report §F-1) | suppression is arc14, not here |
| F-2 | **guide-09 reclassified** — every `## ID-NN` entry's `**Status**` is one of **Compiler-enforced** / **Linted (`<rule-id>`)** / **Documented-only**; no inaccurate blanket "ELIMINATED BY LANGUAGE DESIGN" remains. | grep every `## ID-` has a labelled Status; count = entry count | correctness | CC anti-patterns audit; arc05 A-6 | **done** | `2feb5fd` — 46 IDs = 46 Status lines; 11 ELIMINATED lines replaced; intro + table + footer rewritten. Tally: 6 compiler-enforced / 14 linted / 25 documented-only / 1 split | closes arc05 A-6 |
| F-3 | The labels are **accurate** — each "Linted" cites a real rule in `registry()`; each "Compiler-enforced" is a real compile error (spot-check a sample on both). | cross-check a sample of labels vs. the rule registry + a spot compile | serious | A-6 (substance, not presence) | **done** | all 14 Linted labels ∈ `registry()` (grep); Compiler-enforced spot-compiled (`const`/`var`/untyped-param/reserved-param/`const`-in-`for-of` → error; assoc-no-kv/`((param))`/`=`-in-class → rc=0 → Documented-only). ID-42 body corrected | the audit's point: labels that are true, not just present |
| F-4 | `make test-docs` green after the guide-09/15 edits (doctest fences still compile). | `make test-docs` | serious | standing bar (docs-touching) | **done** | `make test-docs` 475/0 | doc drift is invisible to `lykn test` alone |
| F-5 | **guide-15 + SKILL** document `lykn lint` — CLI usage, rule set, exit 0/1/2, `--format=json`, `.lyk` exempt. | read `docs/guides/15-lykn-cli.md` + the SKILL linter note | correctness | arc-plan | **done** | `2feb5fd` — guide-15 ID-04c **rewritten** (was stale `deno lint` wrapper → source linter) + table row; SKILL CLI line + Anti-Patterns linter note | discoverability |
| F-6 | **P-11 seeded corpus** — a fixture with one deliberate instance per v1 rule (incl. shadowing + the path-scoped conventions rules): **every rule fires exactly where seeded**, exit 1. | run `./bin/lykn lint` over the seeded fixture; each rule id present once | serious | arc-plan / P-11 / A-4 | **done** | `crates/lykn-cli/tests/fixtures/p11/seeded_test.lykn` → 16 rules, 16 findings, exit 1; `p11_lint_corpus` test asserts each rule fires | the arc composition demo material |
| F-7 | **P-11 clean corpus** — an idiomatic fixture: **zero findings**, exit 0. | run `./bin/lykn lint` over the clean fixture | serious | arc-plan / P-11 / A-4 | **done** | `crates/lykn-cli/tests/fixtures/p11/clean.lykn` → `[]`, exit 0; asserted by `p11_lint_corpus` | silence on clean source |
| F-8 | `make check` green; **no half-built suppression** (deferred to arc14 — confirm nothing suppression-related half-landed); diff is source + docs only (no `docs/design-v0.6.0/**`). | `make check`; grep for stray suppression scaffolding; `git show --stat` | serious | standing bar | **done** (CC-attested) | `make check` ✓ (docs 475/0); no suppression scaffolding (grep-clean); `git show --stat 2feb5fd` = Makefile + 2 guides + SKILL + P-11 test/fixtures, no `docs/design-v0.6.0/**` | CC-attested; host reconcile |

## What Worked

- **Grounding caught two stale docs the relabel would have propagated.** guide-15
  ID-04c documented `lykn lint` as the *old* `deno lint` wrapper; ID-42's body
  described pre-arc13 expander behaviour that's now false. Both were rewritten to
  the shipped reality, not just given a Status label — F-3's accuracy mandate in
  action.
- **The `_test.lykn` predicate collision was caught before it broke `make
  check`.** The lint conventions rules and `lykn test`'s discovery key on the
  same `*_test.lykn` string; homing the P-11 corpus under
  `crates/.../tests/fixtures/` kept both happy.
- **The suppression deferral barely pinched** — one `find` path-exclusion covered
  the only standing fixture noise; no per-rule config, no re-scope signal.

## Closure

Closed at commit `2feb5fd` on 2026-07-21 (CC-attested; operator host re-run +
CDC verification reconcile the `make check`/`make lint`/P-11 runtime rows).
Rows: 8. Done: 8. Deferred: 0. No-op: 0.
_(On close: CDC writes the arc05 `closing-report.md` — composition check
A-1…A-7, bubble-up to the project, P-5 — and arc05 closes.)_

**CDC verification (2026-07-21).** Verified against `2feb5fd` by code-review +
grep: F-1/F-2/F-3/F-5/F-6/F-7 **reproduced-by-code** (Makefile path-exclusion; 46
labelled entries, 14 Linted cites ∈ registry; guide-15 + SKILL; the
`p11_lint_corpus` 16-rule assertions), F-4/F-8 **CC-attested** (host reconcile).
No silent drops; two disclosed accuracy-additions (ID-42 body, guide-15 ID-04c),
both within intent. **slice04 CDC-closed**; arc05 arc-ledger A-4/A-6/A-7 → done,
A-1…A-7 compose. See `cdc-verification.md` + the arc `closing-report.md`.
Verified by: CDC (Cowork).
