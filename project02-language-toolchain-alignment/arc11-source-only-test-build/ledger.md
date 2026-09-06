# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (test-out-dir) closed | ptr: slice01 cdc-verification | serious | arc-plan | **done** | slice01 `cdc-verification.md` (accepted 2026-07-05; commit `75c9cc2`) — attested (pointer to closed child ledger) | |
| A-2 | slice02 (buried-intent-audit) closed | ptr: slice02 cdc-verification | correctness | arc-plan | **done** | slice02 `cdc-verification.md` (accepted 2026-07-05; commit `4f2a628`) — attested (pointer to closed child ledger) | |
| A-3 | **source tree is `.js`-free at every moment** — during a `lykn test` run, after Ctrl-C mid-run, and after `--compile-only` (tracked hand-written `.test.js` files excepted) | arc-scale demo: start `lykn test`, interrupt it, then `git status --porcelain test/` + `find test -name '*_test.js'` → empty; repeat with `--compile-only` | serious | operator observation 2026-07-05 | open | | reproduce at arc scale on host |
| A-4 | **buried-intent inventory is empty-or-tracked** — the marker sweep returns only hits with a written disposition (wired / retired / tracked row) | slice02 disposition table; re-run the sweep, diff against the table | correctness | CDC systemic finding | **met (CDC-reproduced)** | slice02 table (13 items) + CC's close-of-slice sweep-diff + **CDC's independent re-run (8 remaining hits, all dispositioned, zero orphans)**; tracked homes instantiated (project-plan §Post-0.6.0; arc05 seed). Re-run once more at arc close on host | the anti-"delayed, deferred, buried, lost" row — now evidenced, not asserted |
| A-5 | **unscoped `deno test --config project.json` does not abort on generated or orphaned artifacts** — the April fossil is gone and generated output resolves cleanly (bare specifiers) | run it unscoped; no TS2307 from `target/**` | correctness | operator deno-test issue + CC investigation 2026-07-05 | **met (attested)** | slice01: fossil deleted (CDC-reproduced) + 0 target errors unscoped (attested). **Amended (v1.2; was: "discovery excludes `target/`")** — the exclude mechanism was empirically invalidated (Deno's config `exclude` filters even explicitly-passed paths, which would break `lykn test`'s own out-dir run); goal met without it. Residual: unscoped runs double-run the corpus + need `-A` — not a supported invocation; canonical-command doc → slice02 |

