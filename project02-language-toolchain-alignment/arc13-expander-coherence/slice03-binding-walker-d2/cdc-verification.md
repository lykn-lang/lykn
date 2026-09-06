# Slice 03: binding-walker + d2-validation — CDC Verification

**By:** CDC (Cowork) · **Date:** 2026-07-06
**Verdict: accepted — slice03 closed** (commit pending on the staged 8
files; content verified from the tree). The walker exists on both backends
with parity fixtures; D2 kills the ID-44 genus; the matrix moved exactly
where the contract allowed; and the slice's *finding* — DD-60's
binding-position list was incomplete — is the architecture proving itself.

## Verification (tree + grep; runtime CC-attested)

| Row | Verified | Strength |
|-----|----------|----------|
| F-1/F-2 | **Reproduced**: `crates/lykn-lang/src/binding.rs` + `packages/lang/binding.js` exist; Rust reuses the classifier's `ParamShape` (no grammar re-derivation — the single-source discipline held); `bindings_introduced`/`bindingsIntroduced` hook points present and documented for slices 05/06; 16 shared parity fixtures attested. | reproduced (tree) + attested |
| F-3 | D2 diagnostics present in both walkers (DD-58 voice); `export` + `kernel:` slot covered; runtime demos attested. | reproduced (grep) + attested |
| F-4 | Three-way parity test in `make check`; seeded-drift demo attested (fails all three legs, restores clean). | attested (mechanism per A-7 precedent) |
| F-5 | **Only D2 rows moved**: reserved-word cells → `rejects-cleanly` both backends; non-reserved cells byte-identical (no scope leak); disagreement **312 → 208**; suites **1387/0 (+19)**, `make check` ✓. | attested (re-probe diff) |

Rows: 5/5. Done: 5. No silent drops.

## The finding (routed via operator decision, 2026-07-06)

**DD-60's binding-position list missed `if-let`/`when-let` bindings and
`match` clause patterns** — real binding positions leaking invalid JS at
rc=0 (`(if-let (if x) …)` → `const if`). CC surfaced with evidence rather
than silently extending a confirmed DD — exactly the "don't reinterpret"
discipline. **Operator: refinement confirmed, landed as its own small
slice** → **slice04 · walker-extension** (both backends: walker + D2 +
probe cells for the 3 positions), before the resolution slices. DD-60
gains the dated refinement entry (this pass).

## Disposition

**slice03 closed.** Plan renumber (un-created table entries only):
rust-resolution → slice05, js-resolution → slice06, corpus + close →
slice07. Next: CC commits the staged source; slice04 open set is ready.
