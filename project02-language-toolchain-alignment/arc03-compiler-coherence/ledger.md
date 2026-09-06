# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence |
|----|-----------|--------|--------------|--------|--------|----------|
| A-1 | slices 01–10 each closed | ptr: each slice closing-report + cdc-verification | correctness | arc-plan | done | shipped closing reports + CDC reviews (attested) |
| A-2 | **same surface input → same output across Rust + JS** (form-codegen corpus), demonstrated end-to-end | `LYKN_BIN=target/release/lykn lykn test` over 146 `compile-both` assertions | serious | arc-plan | **done** | **reproduced at arc scale** (CC, 2026-06-28): 1287/6, **0 semantic divergences**; see closing-report §3 |
| A-3 | DD-58 kernel/surface separation landed (classifier, `kernel:` escape, strict mode, corpus) | slices 02–06 closing reports | serious | arc-plan | done | reproduced at slice scale |
| A-4 | DD-37 JS surface compiler architecture landed (bundle guard + per-form migration) | slices 07–08 closing reports | serious | arc-plan | done | reproduced at slice scale |
| A-5 | intentional divergences documented (incl. the newly characterized async trailing-`;` class) | closing-report §3/§5 + `helpers.js:104-109` | correctness | bubble-up | done | documented; async class routed to slice11 |
| A-6 | **cross-compiler corpus green** — residual failures fixed or dispositioned | `lykn test` exits 0 | serious | bubble-up | **done** | slice11: **1293 passed / 0 failed** (CC-attested; CDC code-verified the fixes; host re-run to reconcile) |

**The close.** Composition (A-2) reproduced with **0 semantic divergences**, and
slice11 took the corpus to **green (1293/0)** — A-6 done. The arc is closed.
slice11 also corrected the residual classification: only the async trailing-`;`
was a real (cosmetic) codegen divergence; the gensym and import-macros "failures"
were a stale-build-dir artifact, now guarded. Full per-row walk and bubble-ups
are in `closing-report.md`.

