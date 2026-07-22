# arc05 · slice04 — Closing Report (Integration + guide alignment)

**By:** CC (Claude Code) · **Date:** 2026-07-21 · **Branch:** `release/0.6.x`
**Source+docs commit:** `2feb5fd` (source + shipped guides/SKILL; planning docs
are CDC's separate commit).
**Verdict: delivered — arc05's last slice.** `lykn lint` now rides `make check`
(green, path-scoped), guide-09 carries an accurate enforcement label on every
entry (closing arc05 A-6), guide-15 + the SKILL document the source linter, and
the P-11 corpus proves every rule fires exactly where seeded and stays silent on
clean idiomatic source (arc05 A-4). Suppression stayed out (arc14). This closes
the IC work of arc05; the arc-level close-set is CDC's.

## Per-row ledger walk (8 rows in, 8 out)

| Row | Status | Evidence |
|-----|--------|----------|
| **F-1** — `make lint`/`make check` runs `lykn lint`, green; 2 fixture findings path-scoped, mechanism recorded | **done** | `Makefile` `lint` target: `find packages examples test -name '*.lykn' ! -path 'test/surface/kernel-in-surface_test.lykn' \| xargs ./bin/lykn lint`. Mechanism = **`find` path exclusion** (no CLI flag, no inline suppression). 117 files, 0 findings, exit 0. |
| **F-2** — guide-09 every `## ID-NN` has an enforcement Status; no blanket ELIMINATED | **done** | All **46** entries labelled (grep: 46 IDs = 46 Status lines); the 11 "ELIMINATED BY LANGUAGE DESIGN" lines replaced; intro + summary-table Status column + footer tally rewritten. |
| **F-3** — labels are accurate (Linted cites a real rule; Compiler-enforced is a real error) | **done** | Cross-check script: all 14 Linted labels ∈ `registry()` (16 rules). Compiler-enforced spot-compiled: `const`/`var` bare, untyped param, reserved-word param (`if`), `const`-in-`for-of` all → compile error; `assoc`-no-kv / `((param))` / `= in class` → rc=0 (runtime/silent) → correctly **Documented-only**. |
| **F-4** — `make test-docs` green after edits | **done** | `make test-docs` 475/0 (doctest fences unaffected; ID-42's executable fence still prints `[ 2, 4, 6 ]`). |
| **F-5** — guide-15 + SKILL document `lykn lint` | **done** | `docs/guides/15-lykn-cli.md` ID-04c **rewritten** (was stale — documented the *old* `deno lint` wrapper; now the source linter: usage, 16-rule set, exit 0/1/2, `--format=json`, `.lyk` exempt) + table row; SKILL CLI line + a linter note under Anti-Patterns. |
| **F-6** — P-11 seeded corpus fires every rule, exit 1 | **done** | `crates/lykn-cli/tests/fixtures/p11/seeded_test.lykn` (one instance per rule) → 16 distinct rules, 16 findings, exit 1. Asserted by `p11_lint_corpus::seeded_corpus_fires_every_rule_and_exits_nonzero`. |
| **F-7** — P-11 clean corpus, zero findings, exit 0 | **done** | `crates/lykn-cli/tests/fixtures/p11/clean.lykn` → `[]`, exit 0. Asserted by `clean_corpus_is_silent_and_exits_zero`. |
| **F-8** — `make check` green; no half-built suppression; diff source+docs only | **done** (CC-attested) | `make check` ✓ (build + lint + test; docs 475/0). No suppression scaffolding (grep-clean; no comment-directive parsing). `git show --stat` = Makefile + 2 guides + SKILL + P-11 test/fixtures; no `docs/design-v0.6.0/**`. |

## F-1 — the make-lint scoping mechanism

**`find` path exclusion**, at the Makefile level, not a CLI flag or inline
suppression:

```make
@find packages examples test -name '*.lykn' \
    ! -path 'test/surface/kernel-in-surface_test.lykn' \
    | sort | xargs $(BIN_DIR)/$(CODE_NAME) lint
```

Only one file is excluded — `test/surface/kernel-in-surface_test.lykn`, whose 2
`prefer-surface-operators` findings are intentional kernel-interop test material
(slice03 dogfood). This is *path* exclusion: no new CLI surface, and nothing
resembling the `; lykn-lint: disable` comment directive (which needs comment
retention → arc14). The P-11 seeded corpus needs no exclusion — it lives under
`crates/.../tests/fixtures/`, outside this scan (see the bubble-up).

The scoping is a clean one-line `find` exclusion — **not** uglier than a path
exclusion, so no re-scope signal fired.

## F-2/F-3 — the guide-09 label tally

Verified against `registry()` (16 rules) + the compiler (spot-compile):

| Label | Count | Entries |
|---|---|---|
| **Compiler-enforced** | 6 | ID-10/13/28 (`var` kernel-only) · ID-39 (untyped param) · ID-42 (reserved-word param, D2) · ID-44 (`const` loop binding) |
| **Linted (`rule`)** | 14 | ID-01, 03, 04, 05, 06, 12, 17, 29, 30, 31, 32, 33, 34, 35 |
| **Documented-only** | 25 | the remainder |
| **Split** | 1 | ID-38 (declaration forms compiler-enforced · operators linted) |

**Downgraded blanket "ELIMINATED"** (the audit's core claim): all **12**
formerly-ELIMINATED entries got an accurate enforcement label — **none** kept a
standalone "language-design elimination":
- → **Linted**: ID-01 (`prefer-surface-operators`, via the kernel `==`), ID-30
  (`no-arguments`), ID-32 (`no-iife`), ID-33 (`no-require`) — the audit's exact
  point: a live lint rule exists, so "eliminated" was wrong.
- → **Compiler-enforced**: ID-10, ID-13, ID-28 (`var` is kernel-only → bare use
  is a compile error).
- → **Documented-only**: ID-07, ID-08, ID-09, ID-11, ID-15 (design properties
  nothing mechanically enforces — the guide is the guardrail).

**ID-42 was corrected, not just relabelled.** Its body claimed a form-named
param (`fn`) makes "the expander interpret it as a macro invocation" and throws —
false since arc13 (DD-60 D1: a bound `fn` legally shadows the macro; it compiles
to a call to the binding). Rewritten to the accurate two-case split: JS reserved
words → compile error (D2, spot-verified); surface-macro/form names → legal
shadow, a readability concern. This is a substantive accuracy fix beyond the
Status label — flagged here per F-3 ("labels that are true").

## Bubble-up to the arc (three questions)

**1. Did slice04 deliver arc05's last piece?** Yes. `lykn lint` is in `make
check` green; guide-09 is accurate (arc05 A-6 met); guide-15 + SKILL document the
linter; the P-11 corpus demonstrates the full rule set (arc05 A-4, reproducible
on the host: `./bin/lykn lint crates/lykn-cli/tests/fixtures/p11/seeded_test.lykn`
→ exit 1; `.../clean.lykn` → exit 0). All that remains for arc05 is the CDC
close-set (composition A-1…A-7, P-5).

**2. What it revealed:**

- **guide-15's `lykn lint` entry was stale — it documented a *different* tool.**
  ID-04c described `lykn lint` as a `deno lint` wrapper over *compiled JS*. The
  arc05 source linter replaced that meaning entirely; the guide never caught up.
  Rewritten. Worth the arc07 (docs drift) audit's attention: a command's
  *meaning* changed under a stable name — the kind of drift a doctest can't see.
- **The `_test.lykn` naming collision (P-11).** The path-scoped conventions rules
  (`no-relative-source-imports`, `no-dirname-fixtures`) fire only on
  `is_test_file` = `*_test.lykn`/`*.test.lykn` — the *same* predicate
  `lykn test`'s `discover_lykn_test_files` uses. So a `_test.lykn` seeded corpus
  under `test/` would be compiled+run by `make test-suite` (and fail — it's
  anti-pattern soup). Resolved by homing the corpus under
  `crates/lykn-cli/tests/fixtures/p11/` (outside `lykn test`'s `test/` scan and
  outside `make lint`'s scan) while keeping the `_test.lykn` basename so the
  conventions rules still fire. **Carry to arc14/arc05-close:** the lint
  "is-test-file" predicate and the runner's "is-test-file" predicate are
  coincidentally identical strings with different intents; if either moves, this
  coupling bites.
- **How much the suppression deferral pinched: barely.** One `find` exclusion for
  one fixture covered it; no per-rule config, no re-scope. The deferral to arc14
  cost nothing this slice. The only place a real inline directive would read
  better is the kernel-interop fixture's 2 intentional `===` — a fine first
  customer for arc14, not a blocker.
- **The orphaned `LintContext` ancestry API (routed from slice03) was not
  touched.** slice04 didn't need it (no new rule); it remains `allow(dead_code)`.
  Still a delete-or-keep decision for a future cleanup — re-flagged, not resolved
  (out of this slice's scope).

**3. Silent-drop diff (scope-as-specified vs delivered):** none. All 8 rows
delivered as specified. Scope *additions* beyond relabeling: (a) ID-42's body
correction (accuracy, F-3-driven); (b) the guide-15 ID-04c full rewrite (it was
stale, not absent). Both are within F-2/F-5's intent (accurate labels /
document the linter). Suppression and the arc close stayed out, as scoped.

## Discipline notes

- **Source + shipped docs touched:** `Makefile` (lint wiring),
  `docs/guides/09-anti-patterns.md` (reclassification), `docs/guides/15-lykn-cli.md`
  (ID-04c rewrite), `assets/ai/SKILL.md` (linter note), and the P-11 corpus
  (`crates/lykn-cli/tests/p11_lint_corpus.rs` + `tests/fixtures/p11/*.lykn`). No
  `docs/design-v0.6.0/**` planning edits in CC's commit.
- **No suppression scaffolding** — the pull toward a `; disable` directive was
  resolved by path exclusion; no comment-directive parsing landed (grep-clean).
- **Rebuild-first held** — `cargo build --release && cp target/release/lykn
  bin/lykn` / `./bin/lykn build` before every lint probe; `make check` rebuilds.
- Closing report untracked at hand-off; the source+docs landed as a green
  increment. CDC verifies, closes slice04, then writes the arc05
  `closing-report.md` and closes arc05.
