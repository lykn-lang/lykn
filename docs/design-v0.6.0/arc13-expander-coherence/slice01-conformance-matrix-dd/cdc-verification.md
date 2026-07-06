# Slice 01: conformance-matrix + DD-60 — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — slice01 closed (commit pending for `tools/` +
`design/`; content verified from the tree).** The matrix is the ground
truth the arc needed; DD-60 is a confirmable spec with zero TBD cells; the
recon-only discipline held.

## Verification (tree review + grep; runtime CC-attested)

| Row | Verified | Strength |
|-----|----------|----------|
| F-1 matrix | `tools/conformance-matrix.js` present, purpose-documented; 885 cells across the full enumerated name sets; deterministic re-run + memoized `deno check` identifier-legality attested. CC's *double self-correction of the classifier before trusting it* (the param-declaration false positive; the reserved-word prior) is exactly the calibration the row wanted. | reproduced (tree) + attested (runs) |
| F-2 DD-60 | Read in full: D1 (whole-scope lexical shadowing, incl. user macros), D2 (reserved words invalid — **empirical legality test**, not a hand-list), D3 (DD-58 untouched); per-cell targets cover every class; breaking analysis **verified against the matrix** (the one meaning-change class is currently-surprising code, in-tree radius 0); edge cases named with proposals (export + `kernel:` name slots). | reproduced (read) |
| F-3 sizing | Both backends need symmetric scope-threading; neither is the small case; **keep the 02/03 split**, conformance corpus validates convergence after both. Honest LoE — accepted. | reproduced (read) |
| F-4 recon-only | **CDC-reproduced**: `git diff HEAD -- crates/ packages/` = empty. | **reproduced** |
| F-5 green bar | `make check` ✓ attested (no source changes). | attested |

Rows: 5/5. No silent drops. **Headline finding accepted with its
correction of the earlier record:** Rust's apparent shadowing was a
shape-check *coincidence* — neither backend has binding awareness; 312/885
cells (35%) disagree. My arc-plan capability table (which credited Rust
with "calls param ✓") is superseded by the matrix — the matrix is ground
truth, the ✓ was accidental.

## Disposition

**slice01 closed.** Next: **operator confirms DD-60** (D1–D3 + the three
sub-questions) → arc13/slice02 (`rust-shadowing`) is scoped against it.
CC should commit `tools/` + `arc13/design/dd-60…` (single source commit;
closing report untracked per convention).
