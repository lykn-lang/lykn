# arc15 · slice01 — Ledger (Reject method-on-expression + migrate guides)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands on the
host and attests runtime rows (`make check`/`make test-docs`); CDC verifies
against `lang` + re-runs the sweep. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | Classifier **errors** on `(<non-atom-head> :kw …)` with the DD-64 fix-it (thread / bind / string-literal note); span on the receiver. | read the classifier check; `lykn compile` the 3 canonical shapes → non-zero + message | serious | DD-64 §4 | open | | express / `new` / arithmetic |
| S-2 | **No over-rejection**: atom method `(x:m a)`, threading `(-> (e) (:m a))`, compound-head + non-keyword arg (IIFE, curried) still compile. | positive tests green; `lykn compile` each | correctness | DD-64 §3 | open | | anti-over-rejection |
| S-3 | The ~10 **teaching** guide sites migrated to threading (14-no-node-boundary, 03-error-handling, 06-functions-closures, 08-performance). | guide diff = exactly the enumerated sites → threading | correctness | CDC sweep | open | | no functional text lost |
| S-4 | ID-31 (`01-core-idioms`) rewritten **threading-primary**; `09-anti-patterns` ID-31 **cross-ref added**. | read the two guides; ID-31 leads with `(-> …)`; 09 has the entry | serious | slice-doc / bootstrap #6 rec | open | | the teach-the-right-way row |
| S-5 | **`make test-docs` green** — every migrated block compiles/runs; no doc teaches the trap. | host: `make test-docs`; re-run sweep → only documented-as-wrong `):kw` remain | serious | DD-64 §2 | open | | docs anti-silent-drop |
| S-6 | **`make check` green — no source/test regressed.** | host: `make check` | serious | CDC sweep (0 source hits) | open | | corpus was clean |
| S-7 | Recon honesty: the change is classifier + tests + guide edits only; no unrelated drive-bys. | `git show --stat`: crates/lykn-lang classifier + tests + docs/guides only | correctness | recon discipline | open | | scoped diff |

## Closure

Closed at commit `<CDC-fills>` (CC-attested; `make check`/`make test-docs`
reconcile on host). Rows: 7. _(On close: CDC verifies the classifier check
location + the guide diff against `lang`, re-runs the `):kw` sweep, confirms only
documented-as-wrong sites remain, and checks A-3…A-6 on the arc ledger.)_
