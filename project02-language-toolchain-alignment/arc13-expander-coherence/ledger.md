# Arc ledger

Extracted from arc-plan.md on 2026-09-06 without changing the historical rows, dispositions, or explicit not-yet-opened status.

## 4. Arc ledger

| ID | Criterion | Verify | Significance | Origin | Status | Evidence | Notes |
|----|-----------|--------|--------------|--------|--------|----------|-------|
| A-1 | slice01 (matrix + DD-60) closed | ptr: cdc-verification | serious | arc-plan | done | slice01/cdc-verification.md (attested) | |
| A-2 | slice02 (rust-shadowing) — self-stopped; superseded by the v1.2 re-slice, all 5 rows deferred with homes | ptr: slice02 closing docs | serious | arc-plan | no-op | slice02/closing-report.md + cdc-verification.md | was: "slice02 (Rust) closed" — the Rust work moved to slice06 |
| A-3 | slice03 (binding-walker + D2) closed | ptr: cdc-verification | serious | arc-plan | done | slice03/cdc-verification.md (attested) | was: "slice03 (JS + corpus)" — the v1.2 re-slice renamed the slice map; JS resolution + corpus have their own rows below |
| A-4 | **the matrix converges** — every live cell behaves per DD-60 on both backends; zero cells where the backends disagree | run the conformance corpus; matrix re-probe transcript | serious | arc05 F-4 recon | done | **reconciled** — gate GO 2026-07-09: operator matrix run 1947/53 exact (53 = the two documented-as-intended classes, CDC-recounted from the transcript); corpus green in `make check` | criterion met as-refined: convergence everywhere D1/D2 apply; the 53 residuals are documented intended divergence (DD-60 ‡ + edge 4), pinned by corpus rows |
| A-5 | **no invalid output at rc=0 for any name class** — reserved-word (and any matrix-surfaced) name misuse is a compile error with a diagnostic, both backends | the validator demos; `deno check` on emitted corpus output | serious | Principle 3 / ID-44 genus | done | **reconciled** — gate GO 2026-07-09: D2 spot-demos verbatim (clean diagnostics + rename suggestions); matrix: only `invalid-output` cells are the `kernel:`-prefixed unbindables, never a real name | |
| A-6 | arc05's ID-42 question re-answered from the fixed state | arc05 slice03 scoping note: reserved-param-name rule shrunk/dropped with rationale | correctness | operator decision 2026-07-06 | open | | the point of pausing: do the right thing instead of warning broadly |
| A-7 | slice04 (walker-extension) closed | ptr: cdc-verification | serious | accrued at slice close (v1.7 catch-up) | done | slice04/cdc-verification.md (attested) | |
| A-8 | slice05 (position-sweep) closed | ptr: cdc-verification | serious | accrued at slice close (v1.7 catch-up) | done | slice05/cdc-verification.md (attested) | binding layer complete by construction; coverage test standing |
| A-9 | slice06 (rust-resolution) closed | ptr: cdc-verification | serious | arc-plan v1.7 | done | slice06/cdc-verification.md; landed `dc37ae9` (attested — host ancestry reconcile at arc close) | |
| A-10 | slice10 (js-resolution) closed | ptr: cdc-verification | serious | arc-plan v1.7 | done | slice10/cdc-verification.md (`c19a1fb`; structure CDC-reproduced) | numbered at creation 2026-07-07 (was: un-numbered) |
| A-11 | atom-payload-privacy landed — **slices 08 (accessor-sweep) + 09 (privacy-flip) closed** (§A6 by-construction layer) | ptr: both cdc-verifications | correctness | operator phasing call 2026-07-06; two-slice packaging 2026-07-07 | done | slice08/cdc-verification.md (`7d86703`+`dab4405`) + slice09/cdc-verification.md (`4c12301`); E0451 proof both crates | was: "atom-payload-privacy slice" (single, un-numbered) — split per slice07's recon + operator call |
| A-12 | DD-60 refinements #1/#2/addendum dispositioned (routed, confirmed, landed) | DD-60 refinement log (3 entries) + v1.4/v1.5/v1.6 change-log entries | correctness | bubble-ups: slices 03/04/05 | done | DD-60 §Refinement log; slices 04/05 closed | class-(c) rows, accrued at v1.7 catch-up |
| A-13 | slice07 (atom-privacy-recon) closed | ptr: cdc-verification | correctness | arc-plan v1.8 | done | slice07/cdc-verification.md (empty diff; lead finding CDC-reproduced) | recon-only; empty diff |
| A-14 | slice11 (conformance-corpus + dispositions) closed | ptr: cdc-verification | serious | arc-plan v1.16 | done | slice11/cdc-verification.md (`a0b24b9`) | its F-7 snapshot is A-4's evidence input |
| A-15 | slice08/10 routed findings dispositioned (`contains_await`; D2-timing residual; 56-cell classes) | slice11 ledger rows F-3..F-6 closed | correctness | bubble-ups: slices 08, 10 | done | slice11 F-3..F-6 (two fixed, three documented, all probe-grounded) | class-(c) rows, accrued at slice11 scoping |

