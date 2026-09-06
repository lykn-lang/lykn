# arc15 · slice01 — Ledger (Reject method-on-expression + migrate guides)

Per `collaboration-framework/templates/LEDGER-DISCIPLINE.md` §A. CC lands on the
host and attests runtime rows (`make check`/`make test-docs`); CDC verifies
against `lang` + re-runs the sweep. Closer ≠ verifier.

## Ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| S-1 | Classifier **errors** on `(<non-atom-head> :kw …)` with the DD-64 fix-it (thread / bind / string-literal note); span on the receiver. | read the classifier check; `lykn compile` the 3 canonical shapes → non-zero + message | serious | DD-64 §4 | **done** | `9ca9c7e` — `classifier::forms::{check_method_on_expression, validate_method_calls}` + `compile.rs` step 2c; 3 canonical shapes → rc=1, span col 2. Tests `dd64_rejects_the_three_canonical_shapes`/`dd64_span_points_at_the_receiver`. **Boundary note (bubble-up):** classify-dispatch alone missed *nested* traps → added recursive validator | express / `new` / arithmetic |
| S-2 | **No over-rejection**: atom method `(x:m a)`, threading `(-> (e) (:m a))`, compound-head + non-keyword arg (IIFE, curried) still compile. | positive tests green; `lykn compile` each | correctness | DD-64 §3 | **done** | `dd64_does_not_over_reject` (8 shapes: atom method, threading ×2, bare-kw prop, IIFE, curried, plain calls) + host probes all rc=0 | anti-over-rejection |
| S-3 | The ~10 **teaching** guide sites migrated to threading (14-no-node-boundary, 03-error-handling, 06-functions-closures, 08-performance). | guide diff = exactly the enumerated sites → threading | correctness | CDC sweep | **done** | `9ca9c7e` — 14(×4), 03(×2), 06(×5), 08(×3 occ); migration table in closing-report. **+1 missed site** (09-anti-patterns:405 catch) migrated too | no functional text lost |
| S-4 | ID-31 (`01-core-idioms`) rewritten **threading-primary**; `09-anti-patterns` ID-31 **cross-ref added**. | read the two guides; ID-31 leads with `(-> …)`; 09 has the entry | serious | slice-doc / bootstrap #6 rec | **done** | `9ca9c7e` — ID-31 (`express`) + ID-41 (`get`) threading-primary, bad commented; `09` gains **ID-47** (Compiler-enforced) + table row + tally 6→7 | ID-41 also needed it (same trap, `get` receiver) |
| S-5 | **`make test-docs` green** — every migrated block compiles/runs; no doc teaches the trap. | host: `make test-docs`; re-run sweep → only documented-as-wrong `):kw` remain | serious | DD-64 §2 | **done** (CC-attested) | `make test-docs` 476/0; sweep → 9 hits, all comments/prose (no live code teaches it) | docs anti-silent-drop |
| S-6 | **`make check` green — no source/test regressed.** | host: `make check` | serious | CDC sweep (0 source hits) | **done** (CC-attested) | `make check` ✓ (build + lint + test; docs 476/0) | corpus was clean |
| S-7 | Recon honesty: the change is classifier + tests + guide edits only; no unrelated drive-bys. | `git show --stat`: crates/lykn-lang classifier + tests + docs/guides only | correctness | recon discipline | **done** | `git show --stat 9ca9c7e` = `compile.rs` + `classifier/{forms,mod}.rs` + 6 guides. ID-32/ID-33 sibling traps left for slice03 | scoped diff |

## Closure

Closed at commit `9ca9c7e` (CC-attested; `make check`/`make test-docs` 476/0
reconcile on host). Rows: 7. Done: 7. _(On close: CDC verifies the classifier
check location + the guide diff against `lang`, re-runs the `):kw` sweep,
confirms only documented-as-wrong sites remain, and checks A-3…A-6 on the arc
ledger. Note for CDC: the recursive `validate_method_calls` pass — not just the
classify-dispatch branch — is the guarantee; the boundary finding is in the
closing-report bubble-up.)_
